angular.module('myApp').controller('controllerAplicatie', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType) {
    var numeAngajat = getSetName.getName()

    function refresh() {
        $http.get('/categoriiAplicatii').success(function(response) {
            $scope.categorii = response
        })
    }
    function comandaCreareAplicatie(val) {
        var comanda = new Object()
        comanda.secventa = "Creare aplicatie cu numele " + val.name
        comanda.numeAngajat = numeAngajat
        comanda.data = new Date()

        $http.post('/angajati/' + numeAngajat + '/comanda', comanda).success(function(request) {
            $http.request = request
        })
    }

    if (getSetType.getType() == "Administrator") {
        refresh()

        $scope.creare = function(val) {
            refresh()
            $http.get('/numeCategorie/' + val.categoryId).success(function(response) {
                $scope.numeCategorie = response

                if (val.appProtocol == undefined)
                    swal({
                        title: "Eroare",
                        text: "Eroare: trebuie selectat un protocol",
                        type: "error"
                    })
                else {
                    $http.post('/creareAplicatie', val).success(function(response) {
                        $http.request = val

                        if (response.isError == false) {
                            swal({
                                title: "Succes",
                                text: "Aplicatia cu numele " + val.name + " a fost adaugata cu succes",
                                type: "success"
                            })

                            val.categorie = $scope.numeCategorie
                            val.idServer = response.id
                            $http.post('/aplicatii', val).success(function(response) {
                                $http.request = val
                            })

                            comandaCreareAplicatie(val)

                            $location.path('/paginaAdministrator')

                            setTimeout(function() {
                                $http.get('/aplicatieDB/' + val.name).success(function(response) {
                                    setTimeout(function() {
                                        $http.put('/aplicatieDB/' + val.name, val)
                                    }, 1000)
                                })
                            }, 1000)

                        } else {

                            if (response.message != null) {
                                swal({
                                    title: "Eroare!",
                                    text: response.message + ": " + response.detail,
                                    type: "error"
                                })
                            } else {
                                swal({
                                    title: "Eroare",
                                    text: "Eroare: " + response.failureReason,
                                    type: "error"
                                })
                            }
                        }
                    })
                }
            })
        }
        $scope.inapoi = function(path) {
            $location.path(path)
        }
    } else {
        $location.path('/eroare')
    }
}])