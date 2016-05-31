var express = require("express")
var bodyParser = require("body-parser")
var Sequelize = require("sequelize")
var request = require("request")
var rpromise = require("request-promise")
var requestify = require("requestify")

var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     
  extended: true
}))

var sequelize = new Sequelize('DB','root', '', {dialect : 'mysql', port : 3306})
var Employee = sequelize.define('employee', {
    id : {
        primaryKey : true,
        type : Sequelize.INTEGER,
        autoIncrement : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false
    },
    password : {
        type : Sequelize.STRING,
        validate: {
            len : [6,30]
        },
        allowNull : false
    },
    email : {
        type : Sequelize.STRING,
        validate : {
            isEmail : true
        }
    },
    type : {
      type : Sequelize.INTEGER,
      allowNull : false
    },
    modificare : {
        type:Sequelize.STRING
    }
})
var Command = sequelize.define('command', {
    id :{
        primaryKey: true,
        type : Sequelize.INTEGER,
        autoIncrement: true
    },
    sequence : {
        type: Sequelize.STRING,
        allowNull: false
    },
    employeeName : {
        type : Sequelize.TEXT,
        allowNull: false
    }, 
    date : {
        type : Sequelize.DATE,
        allowNull : false
    }
})
var Device = sequelize.define('device', {
    id : {
        primaryKey : true,
        type : Sequelize.STRING,
        allowNull : false
    },
    hostname : {
        type : Sequelize.STRING,
        allowNull : false
    },
    ip : {
        type : Sequelize.STRING,
        allowNull : false
    },
    type : {
        type : Sequelize.STRING,
        allowNull : false
    },
    status : {
        type : Sequelize.STRING
    }
})
var Interface = sequelize.define('interface', {
    type : {
        type : Sequelize.STRING,
        allowNull : false
    },
    portName : {
        type : Sequelize.STRING,
        allowNull : false
    },
    status : {
        type : Sequelize.STRING,
        allowNull : false
    },
    speed : {
        type : Sequelize.INTEGER
    },
    duplex : {
        type : Sequelize.STRING
    }
})
var Host = sequelize.define('host', {
    name : {
        type : Sequelize.STRING,
        allowNull : false
    }, 
    VLANid : {
        type : Sequelize.STRING
    },
    ip : {
        type : Sequelize.STRING,
        allowNull : false
    },
    ipOfTheNetworkDevice : {
        type : Sequelize.STRING,
        allowNull : false
    },
    hostType : {
        type : Sequelize.STRING
    }
})

Employee.hasMany(Command, {foreignKey : 'employeeId'})
Command.belongsTo(Employee, {foreignKey : 'employeeId'})
Device.hasMany(Interface, {foreignKey: 'deviceId'})
Interface.belongsTo(Device, {foreignKey: 'deviceId'})


//TODO de modificat statusurile requesturilor, in concordanta
app.get('/createDB', function(req, res){
    sequelize
        .sync({force : true})
        .then(function(){
            res.status(201).send('created')
        })
        .catch(function(error){
            console.warn(error)
            res.status(500).send('not created')
        })
})

var requestTicket = {
        encoding: 'utf8',
        uri: 'https://sandboxapic.cisco.com:9443/api/v1/ticket',
        json: true,
        method: 'POST',
        json: {
            "username" : "admin",
            "password" : "C!sc0123"
        }
    }

app.get('/insertDevices', function(req, res){

    rpromise(requestTicket)
        .then(function(body){
            var response = body['response']
            var ticket = response['serviceTicket']
            
            request({
                url: 'https://sandboxapic.cisco.com:9443/api/v1/network-device',
                json: true,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': ticket
                }
            }, function (error, response, body) {
                    var resp = body['response']
                    resp.forEach(function(entry){
            
                    var id = entry['id']
                    var hostname = entry['hostname']
                    var ip = entry['managementIpAddress']
                    var type = entry['type']
                    var status = entry['reachabilityStatus']
                
                    var text = '{ "id" : "' + id + '", "hostname" : "' + hostname + '", "ip" : "' + ip + '", "type" : "' + type + '", "status" : "' + status + '"}'
            
                    var device = JSON.parse(text)
            
                    Device 
                        .create(device)
                        .then(function(){
                            res.status(200).send('inserted')
                        })
                        .catch(function(error){
                            console.warn(error)
                            res.status(404).send('not inserted')
                        })
                    })
                }
            )
            res.status(200).send("ok")
        })
        .catch(function(error){
            console.log(error).send("couldn't get token")
        })
})

app.get('/devices', function(req, res){
    Device
        .findAll({attributes: ['id', 'hostname', 'ip', 'type', 'status']})
        .then(function(devices){
            res.status(200).send(JSON.stringify(devices, null, 4))
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.get('/device/:id/configuration', function(req, res){
    var id = req.params.id
    
    rpromise(requestTicket)
        .then(function(body){
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""
            var configuratie = new Object()
            configuratie.response = "Nu exista configuratie"
            
            request({
            url: 'https://sandboxapic.cisco.com:9443/api/v1/network-device/' + id + '/config',
            json: true,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': ticket
            }
            }, function (error, response, body) {
                if(body){
                    resp = body['response']
                    if(resp)
                        configuratie.response = resp
                }
                res.status(200).send(configuratie)
            }
            )
        })
        .catch(function(error){
            res.status(404).send("couldn't get token")
        })
})

app.get('/device/:id/interfaces', function(req, res){
    var id = req.params.id
    
    rpromise(requestTicket)
        .then(function(body){
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""
            var interfata = new Object()
            
            request({
            url: 'https://sandboxapic.cisco.com:9443/api/v1/interface/network-device/' + id,
            json: true,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': ticket
            }
            }, function (error, response, body) {
                resp = body['response']
                if(resp['errorCode'])
                    interfata.interfete = "Nu exista interfete disponibile"
                else
                    interfata.interfete = resp
                console.log(interfata)
                res.status(200).send(interfata)
                }
            )
        })
        .catch(function(error){
            res.status(404).send("couldn't get token")
        })
})

app.get('/hosts', function(req, res){
    rpromise(requestTicket)
        .then(function(body){
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""
            
            request({
            url: 'https://sandboxapic.cisco.com:9443/api/v1/host/',
            json: true,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': ticket
            }
            }, function (error, response, body) {
                resp = body['response']
                res.status(200).send(resp)
                }
            )
        })
        .catch(function(error){
            res.status(404).send("couldn't get token")
        })    
})

app.post('/getRuta', function(req, res){
    var ip = req.body
    
    rpromise(requestTicket)
        .then(function(body){
            var response = body['response']
            var ticket = response['serviceTicket']
            var id = ""
            var verificare = ""
            var pathId
            var trackId
            var obiect = new Object()
            
            // function verificaIP(){
            //     if(ip.sourceIP[2]=="7" || ip.destIP[2]=="7"){
                    
            //     }
            // }
            
            rpromise({
                encoding: 'utf8',
                uri: 'https://sandboxapic.cisco.com:9443/api/v1/flow-analysis',
                json: true,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': ticket 
                },
                json: {
                "sourceIP" : ip.sourceIP,
                "destIP" : ip.destIP
                }
            }, function(error, response, body){
                var resp = body['response']
                id = resp['taskId']
                }
            )
                .then(function(body){
                   
                    rpromise({
                        encoding: 'utf8',
                        uri: 'https://sandboxapic.cisco.com:9443/api/v1/task/' + id,
                        json: true,
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': ticket 
                        }
                    }, function(error, response, body){
                        verificare = body['response']
                        
                        var i = 0, howManyTimes = 90;
                        
                        function f() {
                            pathId = verificare['endTime']
                            //console.log("EndTime: " + pathId);
                            i++;
                            if(pathId==undefined && i < howManyTimes ){
                                setTimeout(
                                    function(){
                                        rpromise({
                                        encoding: 'utf8',
                                        uri: 'https://sandboxapic.cisco.com:9443/api/v1/task/' + id,
                                        json: true,
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-Auth-Token': ticket 
                                        }  
                                    },function(error, response,body){
                                        verificare = body['response']
                                        console.log("Task id: " + id + ", iteratia " + i)
                                        f()
                                    }
                                    )
                                    }, 2000 );
                            }
                            else{
                                trackId = verificare['progress']
                                //var failureReason
                                console.log(verificare)
                                //console.log("track id " + trackId)
                                var isError = verificare['isError']
                                
                                if(isError){
                                    obiect.failureReason = verificare['failureReason']
                                    console.log("Failure reason: " + obiect.failureReason)
                                    //obiect.failureReason = failureReason
                                }
                                if(trackId.indexOf("InternalError")!=-1){
                                    obiect.failureReason = "Nu se poate prelua"
                                } else {
                                    rpromise({
                                        encoding: 'utf8',
                                        uri: 'https://sandboxapic.cisco.com:9443/api/v1/flow-analysis/' + trackId,
                                        json: true,
                                        method: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-Auth-Token': ticket 
                                        }
                                    }, function(error, response, body){
                                        var elemente = body['response']
                                        var request = elemente['request']
                                        obiect.elemente = elemente['networkElementsInfo']
                                        obiect.failureReason = request['failureReason']
                                        
                                        console.log("1. Obiectul: " + obiect.failureReason + ", " + obiect.elemente)
                                        //res.status(200).send(obiect)
                                        }
                                    )
                                    .then(function(body){
                                        
                                        console.log("2. Obiectul: " + obiect.failureReason + ", " + obiect.elemente)
                                        res.status(200).send(obiect)
                                    })
                                }
                            }
                        }
                        f()
                    }
                    )
                })
        })
        .catch(function(error){
            res.status(404).send("couldn't get token")
        })
})

app.get('/employees', function(req, res){
    Employee
        .findAll()
        .then(function(employees){
            res.status(200).send(employees)
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.post('/employees', function(req, res){
    var e = req.body
    Employee
        .create(e)
        .then(function(){
            res.status(201).send('created')
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not created')
        })
})

app.get('/employees/:id', function(req, res){
    var id = req.params.id
    Employee
        .find({where:{id:id}, attributes:['id', 'name', 'password', 'email', 'type']})
        .then(function(employee){
            res.status(200).send(employee)
        }).catch(function(error){
            console.warn(error)
            res.send(500).send('not created')
        })
})

app.get('/employee/:name', function(req, res){
    var name = req.params.name
    Employee
        .find({where:{name:name}, attributes:['id', 'name', 'password', 'email', 'type']})
        .then(function(employee){
            res.status(200).send(employee)
        }).catch(function(error){
            console.warn(error)
            res.send(500).send('not created')
        })
})

app.put('/employee/:name', function(req, res){
    Employee
        .find({where : {name : req.params.name}})
        .then(function(employee){
            employee.updateAttributes(req.body)
        })
        .then(function(){
            res.status(200).send('updated')
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.put('/employees/:id', function(req, res){
    Employee
        .find({where : {id : req.params.id}})
        .then(function(employee){
            employee.updateAttributes(req.body)
        })
        .then(function(){
            res.status(200).send('updated')
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.delete('/employees/:nume', function(req, res){
    var nume = req.params.nume
    Employee
        .find({where : {name : nume}})
        .then(function(employee){
            employee.destroy()
        })
        .then(function(){
            res.status(200).send('updated')
        })
        .catch(function(error){
            console.warn(error)
            res.status(500).send('not updated')
        })
})

app.delete('/employee/:id', function(req, res){
    var id = req.params.id
    Employee
        .find({where : {id : id}})
        .then(function(employee){
            employee.destroy()
        })
        .then(function(){
            res.status(200).send('updated')
        })
        .catch(function(error){
            console.warn(error)
            res.status(500).send('not updated')
        })
})

app.listen(8080)