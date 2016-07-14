angular.module('myApp').controller('controllerRuta', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType) {
    var numeAngajat = getSetName.getName()

    function comandaVizualizareRuta(sursa, destinatie) {
        var comanda = new Object()
        comanda.secventa = "Vizualizare ruta intre dispozitivele cu IP-urile " + sursa + " si " + destinatie
        comanda.numeAngajat = numeAngajat
        comanda.data = new Date()

        $http.post('/angajati/' + numeAngajat + '/comanda', comanda).success(function(request) {
            $http.request = request
        })
    }

    if (getSetType.getType() == "Administrator") {
        $http.get('/hosts').success(function(response) {
            $scope.hosts = response
        })
        $http.get('/dispozitive').success(function(response) {
            $scope.dispozitive = response
        })

        $scope.ruta = function($ip) {
            $http.post('/getRuta', $ip).success(function(response) {
                if (response.failureReason) {
                    swal({
                        title: "Eroare",
                        text: response.failureReason,
                        type: "error"
                    })

                    comandaVizualizareRuta($ip.sourceIP, $ip.destIP)
                } else {
                    var sursa = response.elemente.shift()
                    var destinatie = response.elemente.pop()
                    var ruta = sursa.ip + " -> "
                    response.elemente.forEach(function(entry) {
                        ruta += entry.ip + "(" + entry.name + ") -> "
                    })
                    ruta += destinatie.ip

                    swal({
                        title: "Ruta calculata",
                        text: ruta,
                        type: "success"
                    })

                    comandaVizualizareRuta($ip.sourceIP, $ip.destIP)
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