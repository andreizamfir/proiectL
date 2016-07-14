angular.module('myApp').controller('controllerLogin', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType) {
    getSetType.setType(4)
    $('body').addClass('stop-scrolling')
    
    $scope.login = function(username, parola) {
        $http.get('/angajatNume/' + username).success(function(response) {

            if (username != null && parola != null) {
                $scope.angajat = response
                getSetName.setName(username)
                getSetType.setType($scope.angajat.tip)

                if (username == $scope.angajat.nume && parola == $scope.angajat.parola) {
                    if (getSetType.getType() == "Manager")
                        $location.path('/listaAngajati')
                    else
                    if (getSetType.getType() == "Administrator") {
                        $location.path('/paginaAdministrator')
                    } else
                    if (getSetType.getType() == "Inginer") {
                        $location.path('/listaDispozitive')
                    } else
                        console.log('Esti tehnician, nu poti face nimic!')

                } else {
                    swal({
                        title: 'Error!',
                        imageUrl: "media/thumbsDown.png",
                        text: "Parola/Angajat gresit!",
                        timer: 2000
                    })
                    $scope.passworkd = ""
                }
            }
        })
    }
    $scope.register = function(path) {
        $location.path(path);
    }
}])