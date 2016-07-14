angular.module('myApp').controller('controllerAplicatiiCustom', ['$scope', '$http', '$location', 'getSetId', 'getSetName', 'getSetType', function($scope, $http, $location, getSetId, getSetName, getSetType) {
    var numeAngajat = getSetName.getName()

    function refresh() {
        $http.get('/aplicatiiCustom').success(function(response) {
            response.forEach(function(entry) {
                if (entry.descriere == "undefined" || entry.descriere == null || entry.descriere=="")
                    entry.descriere = "-"
            })

            $scope.aplicatii = response
            console.log($scope.aplicatii[2])
        })
    }
    function comandaStergereAplicatie(nume) {
        var comanda = new Object()
        comanda.secventa = "Stergere aplicatia cu numele " + nume
        comanda.numeAngajat = numeAngajat
        comanda.data = new Date()

        $http.post('/angajati/' + numeAngajat + '/comanda', comanda).success(function(request) {
            $http.request = request
        })
    }

    if (getSetType.getType() == "Administrator") {
        refresh()

        $scope.modifica = function(path, id) {
            getSetId.setId(id)
            $location.path(path)
        }
        $scope.stergeAplicatie = function(nume) {
            swal({
                title: 'Atentie!',
                text: "Sigur doriti stergerea aplicatiei " + nume + " din retea? Rezultatul este ireversibil!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sterge',
                cancelButtonText: 'Cancel',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger'
            }).then(function() {
                $http.delete('/aplicatieRetea/' + nume)
                $http.delete('/aplicatie/' + nume)

                swal({
                    title: "Succes",
                    text: "Aplicatia cu numele " + nume + " a fost eliminata cu succes",
                    type: "success"
                })
                refresh()

                comandaStergereAplicatie(nume)
            }, function(dismiss){
                if(dismiss==='cancel'){
                    swal({
                        type: "error",
                        text: "Stergerea aplicatiei " + nume + " a fost intrerupta",
                        title: "Inrerupere"
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