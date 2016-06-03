angular.module('myApp').controller('controllerManager', ['$scope', '$location', 'getSetName', 'getSetType', function($scope, $location, getSetName, getSetType){
  $scope.name = getSetName.getName()
  
  if(getSetType.getType()!="Manager"){
    $location.path('/eroare')
  
  }
  else {
    $scope.angajati = function(path){
    $location.path(path)
  }
  
  $scope.inapoi = function(path){
    $location.path(path)
    getSetType.setType(4)
  }
  
  $scope.dispozitive = function(path){
    $location.path(path)
  }
  }
  
}])