angular.module('myApp').controller('controllerPolitica', ['$scope', '$http', '$location', 'getSetPolicyTag', 'getSetType', 'getSetName', function($scope, $http, $location, getSetPolicyTag, getSetType, getSetName) {
    $scope.tag = getSetPolicyTag.getTag()
    var numeAngajat = getSetName.getName()
    var hasRelevant = false
    var hasDefault = false
    var hasIrrelevant = false

    function refresh() {
        $http.get('/politica/' + $scope.tag).success(function(response) {
            $scope.id = response.id
            $scope.instanceUuid = response.instanceUuid
            $scope.state = response.state
            $scope.taskId = response.taskId
            $scope.applications = response.applications

            if (response.relevant[0]) {
                $scope.relevant = response.relevant[0].resource.applications
                hasRelevant = true
            }
            if (response.irrelevant[0]) {
                $scope.irrelevant = response.irrelevant[0].resource.applications
                hasIrrelevant = true
            }
            if (response.default[0]) {
                $scope.default = response.default[0].resource.applications
                hasDefault = true
            }
        })
    }
    function populareDomenii() {
        $scope.domains = new Array()

        var domeniuRelevant = new Object()
        var domeniuIrelevant = new Object()
        var domeniuDefault = new Object()

        domeniuRelevant.tip = "BUSINESS_RELEVANT"
        domeniuDefault.tip = "BUSINESS_DEFAULT"
        domeniuIrelevant.tip = "BUSINESS_IRRELEVANT"

        $scope.domains.push(domeniuRelevant)
        $scope.domains.push(domeniuDefault)
        $scope.domains.push(domeniuIrelevant)
    }
    var comandaAdaugareAplicatie = function(r, aplicatii){
        var relevanta = ""
        if(r=="BR")
            relevanta="relevanta"
        else 
            if(r=="D")
                relevanta="implicita" 
        else 
            if(r=="IR")
                relevanta="irelevanta"
        
        var comanda = new Object()
        comanda.secventa = "Adaugare lista de aplicatii (" + aplicatii + ") in politica " + + " a tagului " + getSetPolicyTag.getTag()
        comanda.numeAngajat = numeAngajat
        comanda.data = new Date()
        
        console.log("comanda: " + JSON.stringify(comanda))

        $http.post('/angajati/' + comanda.numeAngajat + '/comanda', comanda).success(function(request) {
            $http.request = comanda
        })
    }

    if (getSetType.getType() == "Administrator") {
        populareDomenii()
        refresh()

        $http.get('/aplicatii').success(function(response) {
            $scope.aplicatii = response
        })

        $scope.save = function($app) {
            console.log($app.domain)
            var obiect = new Object()
            obiect.tag = $scope.tag
            obiect.id = $scope.id
            obiect.instanceUuid = $scope.instanceUuid
            obiect.taskId = $scope.taskId
            obiect.state = $scope.state

            var ap = new Array()
            $app.aplicatie.forEach(function(entry) {
                var json = JSON.parse(entry)
                var jsonR = {
                    "appName": json.name,
                    "id": json.id
                }
                ap.push(jsonR)
            })

            obiect.listaAplicatii = ap
            var aplicatii = new Array()
            ap.forEach(function(entry) {
                aplicatii.push(entry.appName)
            })
            
            var stringAplicatii = aplicatii.join(',')
            console.log(stringAplicatii)


            var put = function() {
                var toateAplicatiile = []
                if ($app.domain == "BUSINESS_RELEVANT") {
                    toateAplicatiile.push.apply(obiect.listaAplicatii, $scope.relevant)
                } else if ($app.domain == "BUSINESS_IRRELEVANT") {
                    toateAplicatiile.push.apply(obiect.listaAplicatii, $scope.irrelevant)
                } else if ($app.domain == "BUSINESS_DEFAULT") {
                    toateAplicatiile.push.apply(obiect.listaAplicatii, $scope.default)
                }

                $http.put('/politica', obiect).success(function(response) {
                    $http.request = obiect
                    swal({
                        type: "success",
                        title: "Succes",
                        text: "Am adaugat aplicatiile " + stringAplicatii + " in politica " + $scope.tag
                    })
                })
                refresh()
            }

            var post = function() {
                $http.post('/politica', obiect).success(function(response) {
                    $http.request = obiect
                    swal({
                        type: "success",
                        title: "Succes",
                        text: "Am introdus aplicatiile " + stringAplicatii + " in politica " + $scope.tag
                    })
                    refresh()
                })
            }


            switch ($app.domain) {
                case 'BUSINESS_RELEVANT':
                    obiect.relevanta = 'BR'
                    if (hasRelevant) {
                        put()
                    } else {
                        post()
                    }
                    refresh()
                    break
                case 'BUSINESS_DEFAULT':
                    obiect.relevanta = 'D'
                    if (hasDefault) {
                        put()
                    } else {
                        post()
                    }
                    refresh()
                    break
                case 'BUSINESS_IRRELEVANT':
                    obiect.relevanta = 'IR'
                    if (hasIrrelevant) {
                        put()
                    } else {
                        post()
                    }
                    
                    comandaAdaugareAplicatie(obiect.relevanta, stringAplicatii)
                    refresh()
                    break
            }
        }
        $scope.inapoi = function(path) {
            $location.path(path)
        }
    } else {
        $location.path('/eroare')
    }
}])