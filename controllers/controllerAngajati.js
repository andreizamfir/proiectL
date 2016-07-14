angular.module('myApp').controller('controllerAngajati', ['$scope', '$http', '$location', 'getSetName', 'getSetType', 'getSetId', function($scope, $http, $location, getSetName, getSetType, getSetId) {
    $scope.name = getSetName.getName()

    function refresh() {
        $http.get('/angajati/').success(function(response) {
            $scope.angajati = response

            for (var i = 0; i < $scope.angajati.length; i++) {
                if ($scope.angajati[i].tip == 0)
                    $scope.angajati.splice(i, 1)
            }

            function compare(a, b) {
                if (a.tip < b.tip)
                    return -1;
                else
                if (a.tip > b.tip)
                    return 1;
                else
                    return 0;
            }

            $scope.angajati.sort(compare)

            for (var i = 0; i < $scope.angajati.length; i++) {
                getSetType.setType($scope.angajati[i].tip)

                var obiect = new Object()
                obiect = $scope.angajati[i]
                obiect.tip = getSetType.getType()

                var data = new Date(obiect.createdAt.toString())
                obiect.createdAt = formatareData(data)

                $scope.angajati.splice(i, 1, obiect)
            }
        })
    }
    function formatareData(data) {
        var d = new Date(data || Date.now()),
            luna = '' + (d.getMonth() + 1),
            zi = '' + d.getDate(),
            an = d.getFullYear();

        if (luna.length < 2) luna = '0' + luna;
        if (zi.length < 2) zi = '0' + zi;

        return [zi, luna, an].join('-');
    }
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    
    function comandaPromovareAngajat(nume) {
        var comanda = new Object()
        comanda.secventa = "Promovare angajat cu numele " + nume
        comanda.numeAngajat = $scope.name
        comanda.data = new Date()

        $http.post('/angajati/' + $scope.name + '/comanda', comanda).success(function(request) {
            $http.request = request
        })
    }
    function comandaRetrogradareAngajat(nume) {
        var comanda = new Object()
        comanda.secventa = "Retrogradare angajat cu numele " + nume
        comanda.numeAngajat = $scope.name
        comanda.data = new Date()

        $http.post('/angajati/' + $scope.name + '/comanda', comanda).success(function(request) {
            $http.request = request
        })
    }

    if (getSetType.getType() != "Manager") {
        $location.path('/eroare')
    } else {
        refresh()

        $scope.promovare = function(id) {
            $http.get('/angajatId/' + id).success(function(response) {
                $scope.numeAngajat = response.nume

                if (response.tip > 1) {
                    var json = response
                    json.tip -= 1

                    var motive = new Object()

                    $http.get('/angajati/' + id + '/comenzi').success(function(response) {
                        $scope.comenzi = response
                        var valoare = new Array()

                        for (var i = 0; i < $scope.comenzi.length; i++) {

                            var obiect = new Object()
                            obiect = $scope.comenzi[i]

                            var data = new Date(obiect.createdAt.toString())
                            obiect.data = formatareData(data)

                            var minute = data.getMinutes().toString().length == 1 ? '0' + data.getMinutes() : data.getMinutes()
                            var ore = data.getHours().toString().length == 1 ? '0' + data.getHours() : data.getHours()

                            obiect.ora = ore + ':' + minute

                            $scope.comenzi.splice(i, 1, obiect)
                        }

                        $scope.comenzi.forEach(function(entry) {
                            valoare.push(entry.secventa)
                        })

                        valoare.forEach(function(entry) {
                            motive[entry] = entry
                        })

                        if (!isEmpty(motive)) {
                            swal({
                                title: 'Promovare',
                                text: "Promovati angajatul?",
                                input: 'select',
                                inputOptions: motive,
                                showCancelButton: true,
                                closeOnConfirm: false,
                                animation: "slide-from-top",
                                inputPlaceholder: "De ce se doreste promovarea angajatului",
                                inputValidator: function(value) {
                                    return new Promise(function(resolve, reject) {
                                        if (value) {
                                            resolve()
                                        } else {
                                            reject('Trebuie sa mentionati un comentariu')
                                        }
                                    })
                                }
                            }).then(function(result) {
                                json.modificare = result

                                swal({
                                    title: "Succes!",
                                    text: "Cauza promovarii: " + result,
                                    type: "success"
                                })

                                comandaPromovareAngajat($scope.numeAngajat)

                                $http.put('/angajatId/' + id, json).success(function(response) {
                                    $http.request = id
                                    $http.request.updateAttributes = json
                                    refresh()
                                })
                            })
                        } else {
                            swal({
                                title: 'Promovare',
                                text: "Promovati angajatul?",
                                inputPlaceholder: "De ce se doreste promovarea angajatului",
                                input: 'text',
                                showCancelButton: true,
                                animation: "slide-from-top",
                                inputValidator: function(value) {
                                    return new Promise(function(resolve, reject) {
                                        if (value) {
                                            resolve();
                                        } else {
                                            reject('Trebuie mentionat un comentariu');
                                        }
                                    });
                                }
                            }).then(function(result) {
                                json.modificare = result

                                swal({
                                    title: "Succes!",
                                    type: 'success',
                                    text: 'Cauza promovarii: ' + result
                                });

                                comandaPromovareAngajat($scope.numeAngajat)

                                $http.put('/angajatId/' + id, json).success(function(response) {
                                    $http.request = id
                                    $http.request.updateAttributes = json
                                    refresh()
                                })
                            })
                        }
                    })

                } else
                    swal({
                        title: "Eroare",
                        text: "Angajatul a atins cea mai inalta functie",
                        type: "info"
                    })
            })
        }
        $scope.retrogradare = function(id) {
            $http.get('/angajatId/' + id).success(function(response) {
                $scope.numeAngajat = response.nume

                if (response.tip < 3) {
                    var json = response
                    json.tip += 1

                    var motive = new Object()

                    $http.get('/angajati/' + id + '/comenzi').success(function(response) {
                        $scope.comenzi = response
                        var valoare = new Array()

                        for (var i = 0; i < $scope.comenzi.length; i++) {

                            var obiect = new Object()
                            obiect = $scope.comenzi[i]

                            var data = new Date(obiect.createdAt.toString())
                            obiect.data = formatareData(data)

                            var minute = data.getMinutes().toString().length == 1 ? '0' + data.getMinutes() : data.getMinutes()
                            var ore = data.getHours().toString().length == 1 ? '0' + data.getHours() : data.getHours()

                            obiect.ora = ore + ':' + minute

                            $scope.comenzi.splice(i, 1, obiect)
                        }

                        $scope.comenzi.forEach(function(entry) {
                            valoare.push(entry.secventa)
                        })

                        valoare.forEach(function(entry) {
                            motive[entry] = entry
                        })

                        if (!isEmpty(motive)) {
                            swal({
                                title: 'Retrogradare',
                                text: "Retrogradati angajatul?",
                                input: 'select',
                                inputOptions: motive,
                                showCancelButton: true,
                                closeOnConfirm: false,
                                animation: "slide-from-top",
                                inputPlaceholder: "De ce se doreste retrogradarea angajatului",
                                inputValidator: function(value) {
                                    return new Promise(function(resolve, reject) {
                                        if (value) {
                                            resolve()
                                        } else {
                                            reject('Trebuie sa mentionati un comentariu')
                                        }
                                    })
                                }
                            }).then(function(result) {
                                json.modificare = result

                                swal({
                                    title: "Succes!",
                                    text: "Cauza retrogradarii: " + result,
                                    type: "success"
                                })

                                comandaRetrogradareAngajat($scope.numeAngajat)

                                $http.put('/angajatId/' + id, json).success(function(response) {
                                    $http.request = id
                                    $http.request.updateAttributes = json
                                    refresh()
                                })
                            })

                        } else {
                            swal({
                                title: 'Retrogradare',
                                text: "Retrogradati angajatul?",
                                input: 'text',
                                showCancelButton: true,
                                closeOnConfirm: false,
                                inputPlaceholder: "De ce se doreste retrogradarea angajatului",
                                inputValidator: function(value) {
                                    return new Promise(function(resolve, reject) {
                                        if (value) {
                                            resolve()
                                        } else {
                                            reject('Trebuie sa mentionati un comentariu')
                                        }
                                    })
                                }
                            }).then(function(result) {
                                json.modificare = result

                                swal({
                                    title: "Succes!",
                                    text: "Cauza retrogradarii: " + result,
                                    type: "success"
                                })

                                comandaRetrogradareAngajat($scope.numeAngajat)

                                $http.put('/angajatId/' + id, json).success(function(response) {
                                    $http.request = id
                                    $http.request.updateAttributes = json
                                    refresh()
                                })
                            })
                        }
                    })

                } else
                    swal({
                        title: "Eroare",
                        text: "Angajatul ocupa cea mai de jos functie deja",
                        type: "info"
                    })
            })
        }
        $scope.detalii = function(path, id) {
            $http.get('/angajati/'+id+'/comenzi').success(function(response){
                if(Object.keys(response).length==0)
                    swal({
                        type: "info",
                        text: "Angajatul nu a introdus nicio comanda"
                    })
                else {
                    getSetType.setType(0)
                    getSetId.setId(id)
                    $location.path(path)
                }
            })
        }
        $scope.inapoi = function(path) {
            getSetType.setType(0)
            $location.path(path)
        }
    }
}])