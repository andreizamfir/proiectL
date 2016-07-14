angular.module('myApp').controller('controllerDispozitive', ['$scope', '$http', '$location', 'getSetType', 'getSetId', function($scope, $http, $location, getSetType, getSetId) {
    $scope.tip = getSetType.getType()
    
    if ($scope.tip != "") {
        $http.get('/dispozitive').success(function(response) {
            $scope.devices = response
        })
        
        if($scope.tip == "Inginer")
            document.getElementById("logoutInginer").innerHTML = "Logout"
        
        $scope.inapoi = function() {
            if ($scope.tip == "Manager") {
                $location.path('/paginaManager')
            } else
            if ($scope.tip == "Administrator") {
                $location.path('/paginaAdministrator')
            } else
            if ($scope.tip == "Inginer") {
                $location.path('/login')
            }
        }
        $scope.config = function(path, id) {
            $http.get('/dispozitiv/'+id+'/configuratie').success(function(response){
                if(response.response == "Nu exista configuratie")
                    document.getElementById("rezultat").innerHTML = response.response
                else
                    document.getElementById("rezultat").innerHTML = response.response.replace(RegExp("\n", "g"), "<br>")
            })
        }
        $scope.interface = function(path, id) {
            
            $http.get('/dispozitiv/'+id+'/interfete').success(function(response){
                if(response.interfete=="Nu exista interfete disponibile")
                    swal({
                        type: "info",
                        text: "Nu exista interfete pentru acest dispozitiv"
                    })    
                else {
                    getSetId.setId(id)
                    $location.path(path)
                }
            })
        }
        $scope.arataDetalii = function(path, id) {
            $http.get('/dispozitiv/' + id + '/detalii').success(function(response) {
                $scope.detalii = response
            })
        }
    } else {
        $location.path('/eroare')
    }
}])