angular.module('myApp').controller('controllerPolitici', ['$scope', '$http', '$location', 'getSetPolicyTag', 'getSetName', 'getSetType', function($scope, $http, $location, getSetPolicyTag, getSetName, getSetType) {
    var numeAngajat = getSetName.getName()

    function refresh() {
        $http.get('/taguriPolitici').success(function(response) {
            $scope.politici = response
        })
    }
    function refreshDispozitive(policyTag){
        $http.get('/dispozitivePolitica/' + policyTag).success(function(response) {
            $scope.dispozitivePolitica = response
                
            if(Object.keys(response).length === 0){
                document.getElementById("tabelDispozitive").style.display = 'none'
                document.getElementById("pDispozitive").style.display = 'block'
            } else {
                document.getElementById("tabelDispozitive").style.display = 'table'
                document.getElementById("pDispozitive").style.display = 'none'
                getSetPolicyTag.setTag(policyTag)
            }
        })
    }
    function comandaCreareTag($politica) {
        var comanda = new Object()
        comanda.secventa = "Creare tag de politica cu numele " + $politica.tagPolitica
        comanda.numeAngajat = numeAngajat
        comanda.data = new Date()

        $http.post('/angajati/' + comanda.numeAngajat + '/comanda', comanda).success(function(request) {
            $http.request = comanda
        })
    }
    function comandaStergereTag(tag, today) {
        var comanda = new Object()
        comanda.secventa = "Stergere tag de politica cu numele " + tag
        comanda.numeAngajat = numeAngajat
        comanda.data = new Date()

        $http.post('/angajati/' + comanda.numeAngajat + '/comanda', comanda).success(function(request) {
            $http.request = comanda
        })
    }
    function comandaAdaugareTagDispozitiv($politica, IP, today) {
        var comanda = new Object()
        comanda.secventa = "Adaugare politica " + $politica.numePolitica + " in dispozitivul cu IP-ul " + IP
        comanda.numeAngajat = numeAngajat
        comanda.data = new Date()

        $http.post('/angajati/' + comanda.numeAngajat + '/comanda', comanda).success(function(request) {
            $http.request = comanda
        })
    }
    function comandaStergereTagDispozitiv(IP) {
        $scope.tag = getSetPolicyTag.getTag()
        
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
        
        $http.get('/dispozitive').success(function(response) {
            $scope.dispozitive = response
        })

        $scope.adaugaTag = function($politica) {
            if ($politica.tagPolitica == "") {
                swal({
                    title: "Eroare",
                    text: "Trebuie introdus un tag pentru politica",
                    type: "error"
                })
            } else
                $http.post('/adaugaTagPolitica', $politica).success(function(request) {
                    $http.request = $politica

                    swal({
                        title: "Succes",
                        text: "S-a creat cu succes un nou tag de politica cu numele " + $politica.tagPolitica,
                        type: "success"
                    })

                    $scope.politica.tagPolitica = ""
                    refresh()
                })

            comandaCreareTag($politica)
        }
        $scope.stergeTag = function(tag) {
            swal({
                title: 'Atentie!',
                text: "Sigur doriti stergerea tagului de politica " + tag + " din retea? Rezultatul este ireversibil!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sterge',
                cancelButtonText: 'Cancel',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger'
            }).then(function() {
                $http.get('/dispozitivePolitica/' + tag).success(function(response) {
                    if(Object.keys(response).length === 0){
                        $http.delete('/stergeTagPolitica/' + tag).success(function(response) {

                            swal({
                                title: "Succes",
                                text: "Tagul " + tag + " s-a sters cu succes",
                                type: "success"
                            })
                            refresh()

                            comandaStergereTag(tag)
                            })
                        }
                    else 
                        swal({
                        type: "error",
                        text: "Error while deleting policy tag " + tag + ". Policy tag " + tag + "is currently associated with device(s). Remove the association(s) before deleting the policy tag.",
                        title: "Error"
                    })
                })
            }, function(dismiss){
                if(dismiss==='cancel'){
                    swal({
                        type: "error",
                        text: "Stergerea tagului de politica " + tag + " a fost intrerupta",
                        title: "Inrerupere"
                    })
                }
            })
        }
        $scope.adaugaTagDispozitiv = function($politica) {
            if ($politica.numePolitica == undefined) {
                swal({
                    title: "Eroare",
                    text: "Trebuie introdus un nume de politica",
                    type: "error"
                })
            } else if ($politica.idDispozitiv == undefined) {
                swal({
                    title: "Eroare",
                    text: "Trebuie introdus id-ul unui dispozitiv",
                    type: "error"
                })
            } else
                $http.post('/asocierePolitica', $politica).success(function(request, response) {
                    $http.request = $politica
                    swal({
                        type: "success",
                        title: "Succes",
                        text: "Am introdus politica " + $scope.politica.numePolitica + " cu succes!"
                    })

                    $http.get('/dispozitiv/' + $politica.idDispozitiv + '/detalii').success(function(response) {
                        comandaAdaugareTagDispozitiv($politica, response.adresaIP)
                    })

                    $scope.politica.idDispozitiv = ""
                    refresh()
                })
        }
        $scope.arataDispozitive = function(path, policyTag) {
            refreshDispozitive(policyTag)
        }
        $scope.stergeDispozitiv = function(id) {
            $scope.tag = getSetPolicyTag.getTag()
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
                    $http.delete('/dispozitivePolitica/' + getSetPolicyTag.getTag() + '/' + id)
                    
                    refreshDispozitive($scope.tag)

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
            refreshDispozitive($scope.tag)
        }
        $scope.structuraPolitica = function(path, policyTag) {
            getSetPolicyTag.setTag(policyTag)
            $location.path(path)
        }
        $scope.inapoi = function(path) {
            $location.path(path)
        }
    } else {
        $location.path('/eroare')
    }
}])