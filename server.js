var express = require("express")
var bodyParser = require("body-parser")
var Sequelize = require("sequelize")
var request = require("request")

var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())

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

app.get('/insertDevices', function(req, res){
  request({
    url: 'https://sandboxapic.cisco.com:9443/api/v1/network-device',
    json: true,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': 'ST-3640-sL1JfSyq1v2HAtfIa2My-cas'
    }
    }, function (error, response, body) {
        var resp = body['response']
        console.log(resp)
        resp.forEach(function(entry){
            console.log(entry['id'] + ', ' + entry['hostname'] + ', ' + entry['managementIpAddress'] + ', ' + entry['type'] + ', ' + entry['reachabilityStatus'])
            
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
                    res.status(200)
                })
                .catch(function(error){
                    console.warn(error)
                    res.status(404)
                })
        })
    })  
})

app.get('/getDevices', function(req, res){
    Device
        .findAll({attributes: ['id', 'hostname', 'ip', 'type', 'vendor']})
        .then(function(devices){
            res.status(200).send(JSON.stringify(devices, null, 4))
        })
        .catch(function(error){
            console.warn(error)
            res.status(404).send('not found')
        })
})


//TODO momentan e in regula, trebuie facuta legatura intre device si interfata lui
app.get('/getDeviceInterface/:id', function(req, res){
    var id = req.params.id
    request({
    url: "https://sandboxapic.cisco.com/api/v0/interface/network-device/" + id,
    json: true
    }, function (error, response, body) {
        var resp = body['response']
        
        console.log(resp)
        res.status(200).send(resp)
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
    console.log(e)
    console.log(e.name)
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

// app.put('/employees/:name', function(req, res){
//     Employee
//         .find({where : {name : req.params.name}})
//         .then(function(employee){
//             employee.updateAttributes(req.body)
//         })
//         .then(function(){
//             res.status(200).send('updated')
//         })
//         .catch(function(error){
//             console.warn(error)
//             res.status(404).send('not found')
//         })
// })

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

app.delete('/employees/:id', function(req, res){
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

app.listen(8080)