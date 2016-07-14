angular.module('myApp').controller('controllerDetaliiDispozitiv', ['$scope', '$http', '$location', 'getSetId', 'getSetType', function($scope, $http, $location, getSetId, getSetType) {
    var id = getSetId.getId()

    if (getSetType.getType() == "Administrator" || getSetType.getType() == "Inginer") {
        $http.get('/dispozitiv/' + id + '/detalii').success(function(response) {
            $scope.detalii = response
        })

        $scope.inapoi = function(path) {
            $location.path(path)
        }
    } else {
        $location.path('/eroare')
    }
}])