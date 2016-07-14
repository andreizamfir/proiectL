angular.module('myApp').controller('controllerManager', ['$scope', '$location', 'getSetName', 'getSetType', function($scope, $location, getSetName, getSetType) {
    $scope.name = getSetName.getName()
            console.log(getSetType.getType())
    
    if (getSetType.getType() != "Manager") {
        $location.path('/eroare')
    } else {
        $scope.angajati = function(path) {
            console.log(getSetType.getType())
            $location.path(path)
        }
        $scope.inapoi = function(path) {
            $location.path(path)
            getSetType.setType(4)
        }
        $scope.dispozitive = function(path) {
            $location.path(path)
        }
    }

}])