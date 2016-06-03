angular.module('myApp').controller('controllerDispozitivePolitica', ['$scope', '$http', '$location', 'getSetId', 'getSetPolicyTag', function($scope, $http, $location, getSetId, getSetPolicyTag){
  $scope.tag = getSetPolicyTag.getTag()
    
  $http.get('/dispozitivePolitica/' + $scope.tag).success(function(response){
    $scope.devices = response
  })
}])