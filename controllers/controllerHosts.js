angular.module('myApp').controller('controllerHosts', ['$scope', '$http', '$location', 'getSetType', function($scope, $http, $location, getSetType){
  $scope.tip = getSetType.getType()
  
  $http.get('/hosts').success(function(response){
    $scope.hosts = response
  })
  
  $scope.inapoi = function(path){
    if($scope.tip=="Manager"){
      $location.path('/paginaManager')
    }
    else
      if($scope.tip=="Administrator"){
        $location.path('/paginaAdministrator')
      }
    else
      if($scope.tip=="Inginer"){
        $location.path(path)
      }
    
  }
}])