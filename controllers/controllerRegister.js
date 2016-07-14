angular.module('myApp').controller('controllerRegister', ['$scope', '$location', '$http', function($scope, $location, $http) {
    var emailuri = new Array()
    $http.get('/angajati').success(function(response) {
        response.forEach(function(entry) {
            emailuri.push(entry.email)
        })
    })

    $scope.back = function(path) {
        $location.path(path)
    }
    $scope.register = function(path, $val) {
        if ($val.name != null && $val.password != null && $val.email != null) {
            if ($val.password != $val.passwordAgain) {
                swal({
                    title: "Eroare!",
                    text: "Parolele nu coincid!",
                    type: "error"
                })
            } else
            if (emailuri.indexOf($val.email) != -1) {
                swal({
                    title: "Eroare!",
                    text: "Emailul este deja inregistrat!",
                    type: "error"
                })
            } else {
                $http.post('/angajati', $val).success(function(request) {
                    $http.request = $val
                    swal({
                        title: "Succes!",
                        text: "Inregistrare cu succes!",
                        type: "success",
                        timer: 2000
                    })
                })
                $location.path(path)
            }
        }
    }
}])
