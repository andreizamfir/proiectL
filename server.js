var express = require("express")
var bodyParser = require("body-parser")
var Sequelize = require("sequelize")
var request = require("request")
var rpromise = require("request-promise")
var requestify = require("requestify")
var url = 'https://sandboxapic.cisco.com/api/v1/'
var username = 'devnetuser'
var password = 'Cisco123!'

var app = express()

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

var sequelize = new Sequelize('DB', 'root', '', {
    dialect: 'mysql',
    port: 3306
})
var Angajat = sequelize.define('angajat', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    nume: {
        type: Sequelize.STRING,
        allowNull: false
    },
    parola: {
        type: Sequelize.STRING,
        validate: {
            len: [6, 30]
        },
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        },
        allowNull: false
    },
    tip: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    modificare: {
        type: Sequelize.STRING
    }
})
var Comanda = sequelize.define('comanda', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    secventa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    numeAngajat: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    data: {
        type: Sequelize.DATE,
        allowNull: false
    }
})
var Dispozitiv = sequelize.define('dispozitiv', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false
    },
    hostname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    adresaIP: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tip: {
        type: Sequelize.STRING,
        allowNull: false
    },
    upTime: {
        type: Sequelize.STRING
    },
    adresaMAC: {
        type: Sequelize.STRING,
        allowNull: false
    },
    versiuneSoftware: {
        type: Sequelize.STRING,
        allowNull: false
    },
    familieDevice: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rol: {
        type: Sequelize.STRING,
        allowNull: false
    },
    numarSerie: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastUpdated: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING
    }
})
var Aplicatie = sequelize.define('aplicatie', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    nume: {
        type: Sequelize.STRING,
        allowNull: false
    },
    clasaTrafic: {
        type: Sequelize.STRING,
        allowNull: false
    },
    protocol: {
        type: Sequelize.STRING,
        allowNull: false
    },
    port: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    descriere: {
        type: Sequelize.STRING
    },
    categorie: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Angajat.hasMany(Comanda, {
    foreignKey: 'employeeId'
})
Comanda.belongsTo(Angajat, {
    foreignKey: 'employeeId'
})

function requestTicket() {
    return {
        encoding: 'utf8',
        uri: url + 'ticket',
        json: true,
        method: 'POST',
        json: {
            "username": username,
            "password": password
        }
    }
}
function getDispozitive(ticket) {
    return {
        url: url + 'network-device',
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function getConfiguratie(ticket, id) {
    return {
        url: url + 'network-device/' + id + '/config',
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function getInterfete(ticket, id) {
    return {
        url: url + 'interface/network-device/' + id,
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function getHosts(ticket) {
    return {
        url: url + 'host',
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function postFlow(ticket, ip) {
    return {
        encoding: 'utf8',
        uri: url + 'flow-analysis',
        json: true,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        },
        json: {
            "sourceIP": ip.sourceIP,
            "destIP": ip.destIP
        }
    }
}
function getTask(ticket, id) {
    return {
        encoding: 'utf8',
        uri: url + 'task/' + id,
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function getFlow(ticket, trackId) {
    return {
        encoding: 'utf8',
        uri: url + 'flow-analysis/' + trackId,
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function getTaguri(ticket) {
    return {
        url: url + 'policy/tag',
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function postTag(ticket, nume) {
    return {
        encoding: 'utf8',
        url: url + 'policy/tag',
        json: true,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        },
        json: {
            'policyTag': nume
        }
    }
}
function deleteTag(ticket, nume) {
    return {
        encoding: 'utf8',
        url: url + 'policy/tag?policyTag=' + nume,
        json: true,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function adaugareTagDispozitiv(ticket, tag) {
    return {
        encoding: 'utf8',
        url: url + 'policy/tag/association',
        json: true,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        },
        json: tag
    }
}
function getDispozitiveAsociate(ticket) {
    return {
        url: url + 'policy/tag/association',
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function deleteTagDispozitiv(ticket, tag, id) {
    return {
        url: url + 'policy/tag/association?policyTag=' + tag + '&networkDeviceId=' + id,
        json: true,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function getPolitici(ticket) {
    return {
        url: url + 'policy',
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function postPolitica(ticket, tag, relevantaP, listaAplicatii, relevanta){
    return {
        url: url + 'policy',
        json: true,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        },
        json: jsonPolitica(tag, relevantaP, listaAplicatii, relevanta)
    }
}
function getAplicatii(ticket, id) {
    return {
        url: url + 'application',
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function postAplicatie(ticket, json) {
    return {
        url: url + 'application',
        json: true,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        },
        json: json
    }
}
function putAplicatie(ticket, json){
    return {
        url: url + 'application',
        json: true,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        },
        json: json
    }
}
function deleteAplicatie(ticket, id) {
    return {
        encoding: 'utf8',
        uri: url + 'application/' + id,
        json: true,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function getCategorii(ticket) {
    return {
        url: url + 'category',
        json: true,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': ticket
        }
    }
}
function tag(numePolitica, idDispozitiv) {
    return {
        "policyTag": numePolitica,
        "networkDevices": [{
            "deviceId": idDispozitiv
        }]
    }
}
function jsonAngajat(valori){
    return {
        "nume" : valori.name,
        "email" : valori.email,
        "parola" : valori.password,
        "tip" : valori.type
    }
}
function jsonUDP(valori) {
    return [{
        "trafficClass": valori.trafficClass,
        "helpString": valori.helpString,
        "name": valori.name,
        "appProtocol": valori.appProtocol,
        "udpPorts": valori.portFolosit,
        "pfrThresholdJitter": 1,
        "pfrThresholdLossRate": 50,
        "pfrThresholdOneWayDelay": 500,
        "pfrThresholdJitterPriority": 1,
        "pfrThresholdLossRatePriority": 2,
        "pfrThresholdOneWayDelayPriority": 3,
        "category": "other",
        "subCategory": "other",
        "categoryId": valori.categoryId,
        "longDescription": valori.longDescription,
        "engineId": 9,
        "ignoreConflict": true
    }]
}
function jsonTCP(valori) {
    return [{
        "trafficClass": valori.trafficClass,
        "helpString": valori.helpString,
        "name": valori.name,
        "appProtocol": valori.appProtocol,
        "tcpPorts": valori.portFolosit,
        "pfrThresholdJitter": 1,
        "pfrThresholdLossRate": 50,
        "pfrThresholdOneWayDelay": 500,
        "pfrThresholdJitterPriority": 1,
        "pfrThresholdLossRatePriority": 2,
        "pfrThresholdOneWayDelayPriority": 3,
        "category": "other",
        "subCategory": "other",
        "categoryId": valori.categoryId,
        "longDescription": valori.longDescription,
        "engineId": 9,
        "ignoreConflict": true
    }]
}
function jsonModificareAplicatie(valori){
    return {
        "nume": valori.name,
        "helpString": valori.helpString,
        "clasaTrafic": valori.trafficClass,
        "protocol": valori.appProtocol,
        "port": valori.portFolosit,
        "categorie": valori.category,
        "descriere": valori.longDescription
    }
}
function jsonPolitica(tag, relevantaP, listaAplicatii, relevanta){
    return [{
        "policyName": tag + "_" + relevantaP,
        "policyOwner": "devnetuser",
        "policyPriority": 4099,
        "resource": {
            "applications": listaAplicatii
        },
        "actions": [
            "SET_PROPERTY"
        ],
        "policyScope": tag,
        "actionProperty": {
            "relevanceLevel": relevanta
        }
    }]
}

//TODO de modificat statusurile requesturilor, in concordanta (ex 500,404,200)
app.get('/creazaDB', function(req, res) {
    sequelize
        .sync({
            force: true
        })
        .then(function() {
            res.status(201).send('created')
        })
        .catch(function(error) {
            console.warn(error)
            res.status(500).send('not created')
        })
})

app.get('/insereazaDispozitive', function(req, res) {

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']

            request(getDispozitive(ticket), function(error, response, body) {
                var resp = body['response']
                resp.forEach(function(entry) {

                    var id = entry['id']
                    var hostname = entry['hostname']
                    var adresaIP = entry['managementIpAddress']
                    var tip = entry['type']
                    var status = entry['reachabilityStatus']
                    var familieDevice = entry['family']
                    var upTime = entry['upTime']
                    var adresaMAC = entry['macAddress']
                    var versiuneSoftware = entry['softwareVersion']
                    var rol = entry['role']
                    var numarSerie = entry['serialNumber']
                    var lastUpdated = entry['lastUpdated']

                    var text = '{ "id" : "' + id + '", "hostname" : "' + hostname + '", "adresaIP" : "' + adresaIP +
                        '", "familieDevice" : "' + familieDevice + '", "upTime" : "' + upTime + '", "adresaMAC" : "' + adresaMAC +
                        '", "versiuneSoftware" : "' + versiuneSoftware + '", "rol" : "' + rol + '", "numarSerie" : "' + numarSerie +
                        '", "lastUpdated" : "' + lastUpdated + '", "tip" : "' + tip + '", "status" : "' + status + '"}'

                    var dispozitiv = JSON.parse(text)

                    Dispozitiv
                        .create(dispozitiv)
                        .then(function() {
                            res.status(200).send('inserted')
                        })
                        .catch(function(error) {
                            console.warn(error)
                            res.status(404).send('not inserted')
                        })
                })
            })
            res.status(200).send("ok")
        })
        .catch(function(error) {
            console.log(error).send("couldn't get token")
        })
})

app.get('/dispozitive', function(req, res) {
    Dispozitiv
        .findAll({
            attributes: ['id', 'hostname', 'adresaIP', 'tip', 'status']
        })
        .then(function(dispozitive) {
            res.status(200).send(JSON.stringify(dispozitive, null, 4))
        })
        .catch(function(error) {
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.get('/dispozitiv/:id/configuratie', function(req, res) {
    var id = req.params.id

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""
            var configuratie = new Object()
            configuratie.response = "Nu exista configuratie"

            request(getConfiguratie(ticket, id), function(error, response, body) {
                if (body) {
                    resp = body['response']
                    if (resp)
                        configuratie.response = resp
                }
                res.status(200).send(configuratie)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/dispozitiv/:id/detalii', function(req, res) {
    Dispozitiv
        .find({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'hostname', 'adresaIP', 'tip', 'upTime', 'adresaMAC', 'versiuneSoftware', 'familieDevice', 'rol', 'numarSerie', 'lastUpdated', 'status']
        })
        .then(function(dispozitiv) {
            res.status(200).send(dispozitiv)
        }).catch(function(error) {
            console.warn(error)
            res.send(500).send('not created')
        })
})

app.get('/dispozitiv/:id/interfete', function(req, res) {
    var id = req.params.id

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""
            var interfata = new Object()

            request(getInterfete(ticket, id), function(error, response, body) {
                resp = body['response']
                if (resp['errorCode'])
                    interfata.interfete = "Nu exista interfete disponibile"
                else
                    interfata.interfete = resp
                res.status(200).send(interfata)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/hosts', function(req, res) {
    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getHosts(ticket), function(error, response, body) {
                resp = body['response']
                res.status(200).send(resp)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.post('/getRuta', function(req, res) {
    var ip = req.body
    var id
    var verificare
    var pathId
    var trackId
    var obiect = new Object()

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']

            rpromise(postFlow(ticket, ip), function(error, response, body) {
                    var resp = body['response']
                    id = resp['taskId']
                })
                .then(function(body) {

                    rpromise(getTask(ticket, id), function(error, response, body) {
                        verificare = body['response']

                        var i = 0,
                            howManyTimes = 90;

                        function f() {
                            pathId = verificare['endTime']
                            i++;
                            if (pathId == undefined && i < howManyTimes) {
                                setTimeout(
                                    function() {
                                        rpromise(getTask(ticket, id), function(error, response, body) {
                                            verificare = body['response']
                                            console.log("Task id: " + id + ", iteratia " + i)
                                            f()
                                        })
                                    }, 2000);
                            } else {
                                trackId = verificare['progress']
                                console.log(verificare)
                                var isError = verificare['isError']

                                if (isError) {
                                    obiect.failureReason = verificare['failureReason']
                                    console.log("Failure reason: " + obiect.failureReason)
                                }
                                if (trackId.indexOf("InternalError") != -1) {
                                    obiect.failureReason = "Nu se poate prelua"
                                } else {
                                    rpromise(getFlow(ticket, trackId), function(error, response, body) {
                                            var elemente = body['response']
                                            var request = elemente['request']
                                            obiect.elemente = elemente['networkElementsInfo']
                                            obiect.failureReason = request['failureReason']

                                        })
                                        .then(function(body) {
                                            res.status(200).send(obiect)
                                        })
                                }
                            }
                        }
                        f()
                    })
                })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/taguriPolitici', function(req, res) {
    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getTaguri(ticket), function(error, response, body) {
                resp = body['response']
                res.status(200).send(resp)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.post('/adaugaTagPolitica', function(req, res) {
    var nume = req.body.tagPolitica

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']

            request(postTag(ticket, nume), function(error, response, body) {
                res.status(200).send('adaugata')
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.delete('/stergeTagPolitica/:tag', function(req, res) {
    var nume = req.params.tag

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']

            request(deleteTag(ticket, nume), function(error, response, body) {
                res.status(200).send('deleted')
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.post('/asocierePolitica', function(req, res) {
    var numePolitica = req.body.numePolitica
    var idDispozitiv = req.body.idDispozitiv

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']

            request(adaugareTagDispozitiv(ticket, tag(numePolitica, idDispozitiv)), function(error, response, body) {
                res.status(200).send('adaugat')
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/dispozitivePolitica/:tag', function(req, res) {
    var tag = req.params.tag

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getDispozitiveAsociate(ticket), function(error, response, body) {
                resp = body['response']
                resp.forEach(function(entry) {
                    if (entry['policyTag'] == tag) {
                        var networkDevices = entry['networkDevices']
                        res.status(200).send(networkDevices)
                    }
                })
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.delete('/dispozitivePolitica/:tag/:id', function(req, res) {
    var tag = req.params.tag
    var id = req.params.id

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(deleteTagDispozitiv(ticket, tag, id), function(error, response, body) {
                res.status(200).send('deleted')
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/politica/:tag', function(req, res) {
    var tag = req.params.tag

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getPolitici(ticket), function(error, response, body) {
                resp = body['response']
                var politica = new Object()
                politica.relevant = new Array()
                politica.irrelevant = new Array()
                politica.default = new Array()
                politica.applications = new Array()

                resp.forEach(function(entry) {

                    if (entry['policyScope'] == tag) {
                        politica.instanceUuid = entry['instanceUuid']
                        politica.state = entry['state']
                        politica.taskId = entry['taskId']
                        politica.id = entry['id']

                        var actionProperty = entry['actionProperty']
                        if (actionProperty['relevanceLevel'] == "Business-Relevant") {
                            politica.relevant.push(entry)
                        } else
                        if (actionProperty['relevanceLevel'] == "Business-Irrelevant")
                            politica.irrelevant.push(entry)
                        else
                            politica.default.push(entry)
                    }
                })
                res.status(200).send(politica)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

//de facut refactoring
app.post('/politica', function(req, res) {
    var aplicatii = req.body
    var listaAplicatii = aplicatii.listaAplicatii
    var relevanta

    if (aplicatii.relevanta == 'BR')
        relevanta = 'Business-Relevant'
    else
        if (aplicatii.relevanta == "IR")
            relevanta = 'Business-Irrelevant'
    else
        relevanta = 'Default'

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            console.log("TICKET: " + ticket)
            var resp = ""

            request(postPolitica(ticket, aplicatii.tag, aplicatii.relevanta, aplicatii.listaAplicatii, relevanta), 
                function(error, response, body) {
                    res.status(200).send('adaugata')
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

//de facut refactoring
app.put('/politica', function(req, res) {
    var aplicatii = req.body
    var listaAplicatii = aplicatii.listaAplicatii
    var id = aplicatii.id
    var instanceUuid = aplicatii.instanceUuid
    var taskId = aplicatii.taskId
    var state = aplicatii.state
    var relevanta

    if (aplicatii.relevanta == 'BR')
        relevanta = 'Business-Relevant'
    else
    if (aplicatii.relevanta == "IR")
        relevanta = 'Business-Irrelevant'
    else
        relevanta = 'Default'

    var json = [{
        "instanceUuid": instanceUuid,
        "policyName": aplicatii.tag + "_" + aplicatii.relevanta,
        "policyOwner": "devnetuser",
        "policyPriority": 4999,
        "state": state,
        "taskId": taskId,
        "id": id,
        "resource": {
            "applications": listaAplicatii
        },
        "actions": [
            "SET_PROPERTY"
        ],
        "policyScope": aplicatii.tag,
        "actionProperty": {
            "relevanceLevel": relevanta,
            "pathControlFlag": false,
            "pathPreferenceFlag": false
        }
    }]

    console.log("JSON: " + JSON.stringify(json))

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request({
                url: url + 'policy',
                json: true,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': ticket
                },
                json: json
            }, function(error, response, body) {
                res.status(200).send('adaugata')
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

//de facut refactoring
app.put('/politica/scoateAplicatie', function(req, res) {
    var aplicatie = req.body
    var exista = aplicatie.exista
    var listaAplicatii = aplicatie.listaAplicatii
    var id = aplicatie.id
    var instanceUuid = aplicatie.instanceUuid
    var taskId = aplicatie.taskId
    var state = aplicatie.state
    var relevanta

    console.log("APLICATII CARE EXISTA: " + exista['appName'])

    console.log("SE EXECUTA PUT")
    var aplicatii = listaAplicatii
        .filter(function(el) {
            return el.appName !== exista['appName'];
        })

    console.log("Aplicatii: " + aplicatii)

    if (aplicatii.relevanta == 'BR')
        relevanta = 'Business-Relevant'
    else
    if (aplicatii.relevanta == "IR")
        relevanta = 'Business-Irrelevant'
    else
        relevanta = 'Default'

    var json = [{
        "instanceUuid": instanceUuid,
        "policyName": aplicatie.tag + "_" + aplicatie.relevanta,
        "policyOwner": "devnetuser",
        "policyPriority": 4099,
        "state": state,
        "taskId": taskId,
        "id": id,
        "resource": {
            "applications": aplicatii
        },
        "actions": [
            "SET_PROPERTY"
        ],
        "policyScope": aplicatie.tag,
        "actionProperty": {
            "relevanceLevel": relevanta,
            "pathControlFlag": false,
            "pathPreferenceFlag": false
        }
    }]

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request({
                url: url + 'policy',
                json: true,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Token': ticket
                },
                json: json
            }, function(error, response, body) {
                res.status(200).send('adaugata')
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/aplicatii', function(req, res) {
    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getAplicatii(ticket), function(error, response, body) {
                resp = body['response']
                res.status(200).send(resp)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/aplicatii/:nume', function(req, res) {
    var nume = req.params.nume
    var id

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getAplicatii(ticket), function(error, response, body) {
                resp = body['response']
                resp.forEach(function(entry) {
                    if (entry.name == nume)
                        id = entry.id
                })
                res.status(200).send(id)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/categoriiAplicatii', function(req, res) {
    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getCategorii(ticket), function(error, response, body) {
                resp = body['response']
                res.status(200).send(resp)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/numeCategorie/:id', function(req, res) {
    var id = req.params.id

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getCategorii(ticket), function(error, response, body) {
                resp = body['response']
                var categorie = ""
                resp.forEach(function(entry) {
                    if (entry.id == id)
                        categorie = entry.name
                })
                res.status(200).send(categorie)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/idCategorie/:name', function(req, res) {
    var name = req.params.name

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getCategorii(ticket), function(error, response, body) {
                resp = body['response']
                var idCategorie = ""
                resp.forEach(function(entry) {
                    if (entry.name == name)
                        idCategorie = entry.id
                })
                res.status(200).send(idCategorie)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.post('/creareAplicatie', function(req, res) {
    var valori = req.body
    if (valori.longDescription == undefined)
        valori.longDescription = null
    var json

    if (valori.appProtocol == "tcp") {
        json = jsonTCP(valori)
    } else {
        json = jsonUDP(valori)
    }

    console.log("Json de creare aplicatie: " + JSON.stringify(json))
    
    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""
            var id

            rpromise(postAplicatie(ticket, json), function(error, response, body) {
                resp = body['response']
                id = resp['taskId']

                setTimeout(function() {
                    rpromise(getTask(ticket, id), function(error, response, body) {
                        var feedback = body['response']
                        res.status(200).send(feedback)
                    })
                }, 2000)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.get('/angajati', function(req, res) {
    Angajat
        .findAll()
        .then(function(angajati) {
            res.status(200).send(angajati)
        })
        .catch(function(error) {
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.post('/angajati', function(req, res) {
    var angajat = jsonAngajat(req.body)
    
    console.log("Angajat: " + JSON.stringify(angajat))
    Angajat
        .create(angajat)
        .then(function() {
            res.status(201).send('created')
        })
        .catch(function(error) {
            console.warn(error)
            res.status(404).send('not created')
        })
})

app.get('/angajatId/:id', function(req, res) {
    var id = req.params.id
    Angajat
        .find({
            where: {
                id: id
            },
            attributes: ['id', 'nume', 'parola', 'email', 'tip']
        })
        .then(function(angajat) {
            res.status(200).send(angajat)
        }).catch(function(error) {
            console.warn(error)
            res.send(500).send('not created')
        })
})

app.get('/angajatNume/:nume', function(req, res) {
    Angajat
        .find({
            where: {
                nume: req.params.nume
            },
            attributes: ['id', 'nume', 'parola', 'email', 'tip']
        })
        .then(function(angajat) {
            res.status(200).send(angajat)
        }).catch(function(error) {
            console.warn(error)
            res.send(500).send('not created')
        })
})

app.put('/angajatNume/:nume', function(req, res) {
    Angajat
        .find({
            where: {
                nume: req.params.nume
            }
        })
        .then(function(angajat) {
            angajat.updateAttributes(req.body)
        })
        .then(function() {
            res.status(200).send('updated')
        })
        .catch(function(error) {
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.put('/angajatId/:id', function(req, res) {
    Angajat
        .find({
            where: {
                id: req.params.id
            }
        })
        .then(function(angajat) {
            angajat.updateAttributes(req.body)
        })
        .then(function() {
            res.status(200).send('updated')
        })
        .catch(function(error) {
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.delete('/angajat/:nume', function(req, res) {
    Angajat
        .find({
            where: {
                nume: req.params.nume
            }
        })
        .then(function(angajat) {
            angajat.destroy()
        })
        .then(function() {
            res.status(200).send('updated')
        })
        .catch(function(error) {
            console.warn(error)
            res.status(500).send('not updated')
        })
})

app.get('/aplicatieDB/:nume', function(req, res){
    Aplicatie
        .find({
            where: {
                nume: req.params.nume
            },
            attributes: ['id', 'nume', 'helpString', 'clasaTrafic', 'protocol', 'port', 'descriere', 'categorie', 'idServer']
        })
        .then(function(aplicatie) {
            res.status(200).send(aplicatie)
        })
        .catch(function(error) {
            console.warn(error)
            res.send(500).send('not created')
        })
})

app.put('/aplicatieDB/:nume', function(req,res){
    var helpString = req.body.helpString
    var idServer = req.body.idServer
    
    var obiect = new Object()
    obiect.helpString = helpString
    obiect.idServer = idServer
    
    console.log("Help string: " + helpString + ", idServer: " + idServer)
    Aplicatie
        .find({
            where: {
                nume: req.params.nume
            }
        })
        .then(function(aplicatie) {
            aplicatie.updateAttributes(obiect)
        })
        .then(function() {
            res.status(200).send('updated')
        })
        .catch(function(error) {
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.post('/aplicatii', function(req, res) {
    var aplicatie = req.body

    var a = new Object()
    a.nume = aplicatie.name
    a.helpString = aplicatie.helpString
    a.clasaTrafic = aplicatie.trafficClass
    a.protocol = aplicatie.appProtocol
    a.port = aplicatie.portFolosit
    a.categorie = aplicatie.categorie
    a.descriere = aplicatie.longDescription
    a.idServer = aplicatie.idServer

    var text = '{"nume" : "' + a.nume + '", "helpString" : "' + a.helpString + '", "clasaTrafic" : "' + a.clasaTrafic + '", "protocol" : "' + a.protocol + '", "descriere" : "' + a.descriere + '", "port" : "' + a.port + '", "idServer" : "' + a.idServer + '", "categorie" : "' + a.categorie + '"}'

    var app = JSON.parse(text)
    
    console.log("Aplicatia: " + JSON.stringify(app))
    Aplicatie
        .create(app)
        .then(function() {
            console.log("Aplicatia 2: " + JSON.stringify(app))
            res.status(201).send('created')
        })
        .catch(function(error) {
            console.warn(error)
            res.status(404).send('not created')
        })
})

app.put('/aplicatii/:id', function(req, res){
    var json = jsonModificareAplicatie(req.body)
    
    console.log(JSON.stringify(json))
    Aplicatie
        .find({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'nume', 'helpString', 'clasaTrafic', 'protocol', 'port', 'descriere', 'categorie', 'idServer']
        })
        .then(function(aplicatie) {
            aplicatie.updateAttributes(json)
        })
        .then(function() {
            res.status(200).send('updated')
        })
        .catch(function(error) {
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.get('/aplicatiiCustom', function(req, res) {
    Aplicatie
        .findAll()
        .then(function(aplicatii) {
            res.status(200).send(aplicatii)
        })
        .catch(function(error) {
            console.warn(error)
            res.status(404).send('not found')
        })
})

app.get('/aplicatie/:id', function(req, res) {
    Aplicatie
        .find({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'nume', 'helpString', 'clasaTrafic', 'protocol', 'port', 'descriere', 'categorie', 'idServer']
        })
        .then(function(aplicatie) {
            res.status(200).send(aplicatie)
        })
        .catch(function(error) {
            console.warn(error)
            res.send(500).send('not created')
        })
})

app.get('/aplicatieServer/:id', function(req, res){
    var id = req.params.id

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            request(getAplicatii(ticket), function(error, response, body) {
                resp = body['response']
                var aplicatie = new Object()
                resp.forEach(function(entry) {
                    if (entry.id == id)
                        aplicatie = entry
                })
                res.status(200).send(aplicatie)
            })
        })
        .catch(function(error) {
            res.status(404).send("couldn't get token")
        })
})

app.put('/aplicatieServer/:id', function(req, res){
    var id = req.params.id
    var json = req.body
    
    console.log(json)

    rpromise(requestTicket())
        .then(function(body){
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""
            var taskId = ""
            var obiect = new Object()
            
            rpromise(putAplicatie(ticket, json), function(error, response, body){
                resp = body['response']
                taskId = resp['taskId']
            })
                .then(function(body){
                    rpromise(getTask(ticket, taskId), function(error, response, body){
                        var r = body['response']
                        obiect.progress = r['progress']
                        obiect.failureReason = r['failureReason']
                    })
                        .then(function(body){
                            res.status(200).send(obiect)
                        })
                })
        })
})

app.delete('/aplicatie/:nume', function(req, res) {
    Aplicatie
        .find({
            where: {
                nume: req.params.nume
            }
        })
        .then(function(aplicatie) {
            aplicatie.destroy()
        })
        .then(function() {
            res.status(200).send('aplicatie stearsa')
        })
        .catch(function(error) {
            res.send(500).send('eroare')
        })
})

app.delete('/aplicatieRetea/:nume', function(req, res) {
    var nume = req.params.nume
    var id

    rpromise(requestTicket())
        .then(function(body) {
            var response = body['response']
            var ticket = response['serviceTicket']
            var resp = ""

            rpromise(getAplicatii(ticket, id), function(error, response, body) {
                    resp = body['response']
                    resp.forEach(function(entry) {
                        if (entry.name == nume)
                            id = entry.id
                    })
                })
                .then(function(body) {
                    request(deleteAplicatie(ticket, id), function(error, response, body) {
                        res.status(200).send('aplicatie stearsa')
                    })
                })
                .catch(function(error) {
                    res.status(404).send("couldn't get token")
                })
        })
})

app.get('/angajati/:id/comenzi', function(req, res) {
    var id = req.params.id

    Angajat
        .find({
            where: {
                id: id
            },
            include: [Comanda]
        })
        .then(function(angajat) {
            return angajat.getComandas()
        })
        .then(function(comenzi) {
            res.status(200).send(comenzi)
        })
        .catch(function(error) {
            console.warn(error)
            res.status(500).send('error')
        })
})

app.post('/angajati/:nume/comanda', function(req, res) {
    var nume = req.params.nume
    var comanda = req.body

    Angajat
        .find({
            where: {
                nume: nume
            }
        })
        .then(function(angajat) {
            if (angajat) {
                return Comanda.create({
                    secventa: comanda.secventa,
                    numeAngajat: comanda.numeAngajat,
                    data: comanda.data,
                    employeeId: angajat.id
                })
            }
        })
        .then(function() {
            res.status(201).send('created')
        })
        .catch(function(error) {
            console.warn(error)
            res.status(500).send('error')
        })
})

app.listen(8080)