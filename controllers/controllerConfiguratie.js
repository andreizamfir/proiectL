angular.module('myApp').controller('controllerConfiguratie', ['$scope', '$http', '$location', 'getSetId', 'getSetType', function($scope, $http, $location, getSetId, getSetType) {
    var id = getSetId.getId()

    if (getSetType.getType() == "Administrator" || getSetType.getType() == "Inginer") {
        $http.get('/dispozitiv/' + id + '/configuratie').success(function(response) {
            if (response.response == "Nu exista configuratie")
                document.getElementById('rezultat').innerHTML = response.response
            else
                document.getElementById('rezultat').innerHTML = response.response.replace(RegExp("\n", "g"), "<br>");
        })

        $scope.inapoi = function(path) {
            $location.path(path)
        }
    } else {
        $location.path('/eroare')
    }
}])