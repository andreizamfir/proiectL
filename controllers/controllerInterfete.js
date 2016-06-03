angular.module('myApp').controller('controllerInterfete', ['$scope', '$http', '$location', 'getSetId', function($scope, $http, $location, getSetId){
  var id = getSetId.getId()
  
  $http.get('/device/' + id + '/interfaces').success(function(response){
    console.log(response)
    
    if(response.interfete=="Nu exista interfete disponibile"){
      document.getElementById("tabelInterfete").style.display = 'none'
      document.getElementById("interfete").innerHTML = response.interfete
      console.log(response.interfete)
    }
    else
      $scope.interfete = response.interfete
  })
  
  $scope.inapoi = function(path){
    $location.path(path)
  }
}])