angular.module('myApp').controller('controllerConfiguratie', ['$scope', '$http', '$location', 'getSetId', function($scope, $http, $location, getSetId){
  var id = getSetId.getId()
  
  $http.get('/device/' + id + '/configuration').success(function(response){
    if(response.response=="Nu exista configuratie")
      document.getElementById('rezultat').innerHTML = response.response
    else
      document.getElementById('rezultat').innerHTML = response.response.replace(RegExp("\n","g"), "<br>");
  })
  
  $scope.inapoi = function(path){
    $location.path(path)
  }
  
}])