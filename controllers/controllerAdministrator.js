angular.module('myApp').controller('controllerAdministrator', ['$scope', '$http', '$location', 'getSetId', 'getSetName', function($scope, $http, $location, getSetId, getSetName){
  $scope.name = getSetName.getName()
  
  $scope.inapoi = function(path){
    $location.path(path)
  }
  
  $scope.dispozitive = function(path){
    $location.path(path)
  }
  
  $scope.hosts = function(path){
    $location.path(path)
  }
  
  $scope.politici = function(path){
    $location.path(path)
  }
}])