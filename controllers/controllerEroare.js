angular.module('myApp').controller('controllerEroare', ['$scope', '$location', function($scope, $location){
    $scope.login = function(path){
        $location.path(path)
    }
}])