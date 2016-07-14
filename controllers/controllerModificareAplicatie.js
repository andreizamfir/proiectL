angular.module('myApp').controller('controllerModificareAplicatie', ['$scope', '$http', '$location', 'getSetId', 'getSetName', 'getSetType', function($scope, $http, $location, getSetId, getSetName, getSetType) {
    var numeAngajat = getSetName.getName()

    function setFields(aplicatie){
        $scope.valori.name = aplicatie.nume
        $scope.valori.helpString = aplicatie.helpString
        $scope.valori.trafficClass = aplicatie.clasaTrafic
        $scope.valori.portFolosit = aplicatie.port
        $scope.valori.longDescription = aplicatie.descriere
        $scope.valori.appProtocol = aplicatie.protocol
        $scope.valori.categoryId = aplicatie.idCategorie
    }
    function comandaModificareAplicatie(val) {
        var comanda = new Object()
        comanda.secventa = "Modificare aplicatie cu numele " + val.name
        comanda.numeAngajat = numeAngajat
        comanda.data = new Date()

        $http.post('/angajati/' + numeAngajat + '/comanda', comanda).success(function(request) {
            $http.request = request
        })
    }
    
    if (getSetType.getType() == "Administrator") {
        $scope.valori = {
            name: '',
            helpString: '',
            trafficClass: '',
            longDescription: '',
            appProtocol: '',
            categoryId: '',
            portFolosit: 0
        }
    
        $http.get('/aplicatie/' + getSetId.getId()).success(function(response) {
            $scope.aplicatie = response
        
            $http.get('/categoriiAplicatii').success(function(response) {
                $scope.categorii = response
            })
            $http.get('/idCategorie/'+$scope.aplicatie.categorie).success(function(response) {
                $scope.aplicatie.idCategorie = response
            
                if($scope.aplicatie.descriere=="undefined")
                    $scope.aplicatie.descriere = ""
                setFields($scope.aplicatie)
            })
    })
    
        $scope.modificare = function(val){
            var protocol = null
            
            var radios = document.getElementsByName('optradio');

            for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                    protocol = radios[i].value
                    break;
                }
            }
            $http.get('/numeCategorie/'+val.categoryId).success(function(response){
                val.category = response
            })
                
                $http.get('/aplicatii/'+val.name).success(function(response){
                    var idServer = response
                    
                    $http.get('/aplicatieServer/' + response).success(function(response){
                        response.name = val.name
                        
                        console.log("Protocol: " + protocol)
                        response.appProtocol = protocol
                        val.appProtocol = protocol
                        
                        if(protocol=="udp"){
                            delete response.tcpPorts
                            response.udpPorts = val.portFolosit
                        } else {
                            delete response.udpPorts
                            response.tcpPorts = val.portFolosit
                        }
                        
                        response.categoryId = val.categoryId
                        response.helpString = val.helpString
                        response.longDescription = val.longDescription
                        response.trafficClass = val.trafficClass
                        response.rank = "1"
                        response.transportIps = "0.0.0.0"
                        response.ignoreConflict = true
                    
                        var array = new Array()
                        array.push(response)
                        console.log("ARRAY: " + JSON.stringify(array))
                    
                        console.log("aplicatie.idServer: " + idServer)
                        $http.put('/aplicatieServer/' + idServer, array).success(function(response){
                            if(response.progress == "UPDATE"){
                                console.log(val)
                                $http.put('/aplicatii/' + getSetId.getId(), val).success(function(response){
                                    $http.request = getSetId.getId()
                                    $http.request.updateAttributes = val
                                })
            
                                swal({
                                    type: "success",
                                    title: "Succes!",
                                    text: "Aplicatia cu numele " + val.name + " a fost modificata cu succes!"
                                })
            
                                comandaModificareAplicatie(val)
            
                                $location.path('/aplicatiiCustom')
                            }
                        // else 
                        //     swal({
                        //         type: "error",
                        //         text: "Eroare"
                        //     })
                        })
                    })
                })
    }
        $scope.inapoi = function(path){
        $location.path(path)
    }
    } else
        $location.path('/eroare')
    
}])