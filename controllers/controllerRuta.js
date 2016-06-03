angular.module('myApp').controller('controllerRuta', ['$scope', '$http', '$location', function($scope, $http, $location){
  $http.get('/hosts').success(function(response){
    $scope.hosts = response
  })
  
  $http.get('/devices').success(function(response){
      $scope.devices=response
  })
    
  $scope.ruta = function($ip){
    $http.post('/getRuta', $ip).success(function(response){
      if(response.failureReason)
        swal({
          title: "Eroare",
          text: response.failureReason,
          type: "error"
        })
        else{
          console.log(response.elemente)
          var sursa = response.elemente.shift()
          var destinatie = response.elemente.pop()
          var ruta=sursa.ip+" -> "
          response.elemente.forEach(function(entry){
            ruta += entry.ip+"("+entry.name+") -> "
          })
          ruta+=destinatie.ip
          
          swal({
            title: "Ruta calculata",
            text: ruta,
            type: "success"
          })
        }
    })
  }  
}])