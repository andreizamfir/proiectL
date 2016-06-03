angular.module('myApp').controller('controllerPolitica', ['$scope', '$http', '$location', 'getSetPolicyTag', function($scope, $http, $location, getSetPolicyTag){
  $scope.tag = getSetPolicyTag.getTag()
  
  $http.get('/politici/' + $scope.tag).success(function(response){
    $scope.relevant = response.relevant[0].resource.applications
    $scope.irrelevant = response.irrelevant[0].resource.applications
    $scope.default = response.default[0].resource.applications
  })
}])