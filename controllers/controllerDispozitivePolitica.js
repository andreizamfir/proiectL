angular.module('myApp').controller('controllerDispozitivePolitica', ['$scope', '$http', '$location', 'getSetPolicyTag', 'getSetName', 'getSetType', function($scope, $http, $location, getSetPolicyTag, getSetName, getSetType) {
    $scope.tag = getSetPolicyTag.getTag()
    var numeAngajat = getSetName.getName()

    function refresh() {
        $http.get('/dispozitivePolitica/' + $scope.tag).success(function(response) {
            $scope.dispozitive = response
        })
    }
    function comandaStergereTagDispozitiv(IP) {
        var comanda = new Object()
        comanda.secventa = "Stergere politica " + $scope.tag + " din dispozitivul cu IP-ul " + IP
        comanda.numeAngajat = numeAngajat
        comanda.data = new Date()

        $http.post('/angajati/' + numeAngajat + '/comanda', comanda).success(function(response) {
            $http.request = comanda
        })
    }

    if (getSetType.getType() == "Administrator") {
        refresh()

        $scope.stergeDispozitiv = function(id) {
            $http.get('/dispozitiv/' + id + '/detalii').success(function(response) {
                swal({
                    title: 'Atentie!',
                    text: "Sigur doriti stergerea tagului de politica " + $scope.tag + " din dispozitivul cu IP-ul " + response.adresaIP +"? Rezultatul este ireversibil!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sterge',
                    cancelButtonText: 'Cancel',
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger'
                }).then(function() {
                    $http.delete('/dispozitivePolitica/' + $scope.tag + '/' + id)
                    
                    refresh()

                    swal({
                        title: "Succes",
                        text: "Politica " + $scope.tag + " a fost eliminata cu succes din dispozitivul cu IP-ul " + response.adresaIP,
                        type: "success"
                    })

                    comandaStergereTagDispozitiv(response.adresaIP)

                }, function(dismiss){
                    if(dismiss==='cancel'){
                        swal({
                            type: "error",
                            text: "Stergerea tagului de politica " + $scope.tag + " a fost intrerupta",
                            title: "Inrerupere"
                        })
                    }
                })
            })
        }
        $scope.inapoi = function(path) {
            $location.path(path)
        }
    } else {
        $location.path('/eroare')
    }
}])