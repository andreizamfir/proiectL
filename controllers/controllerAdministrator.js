angular.module('myApp').controller('controllerAdministrator', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType) {
    $scope.name = getSetName.getName()

    if (getSetType.getType() != "Administrator") {
        $location.path('/eroare')
    } else {
        $scope.inapoi = function(path) {
            $location.path(path)
        }
        $scope.dispozitive = function(path) {
            $location.path(path)
        }
        $scope.hosts = function(path) {
            $location.path(path)
        }
        $scope.politici = function(path) {
            $location.path(path)
        }
        $scope.creareAplicatie = function(path) {
            $location.path(path)
        }
        $scope.aplicatii = function(path) {
            $location.path(path)
        }
    }
}])