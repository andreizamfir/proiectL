angular.module('myApp').controller('controllerLogin', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType){
    $scope.login = function(username, password){
        $http.get(SERVER + '/employee/' + username).success(function(response){
      
            if(username!=null && password!=null){
              $scope.employee=response
              getSetName.setName(username)
              getSetType.setType($scope.employee.type)
              
              if(username==$scope.employee.name && password==$scope.employee.password){
                  if(getSetType.getType()=="Manager")
                    $location.path('/paginaManager')
                  else
                    if(getSetType.getType()=="Administrator"){
                      $location.path('/paginaAdministrator')
                    }
                  else
                    if(getSetType.getType()=="Inginer"){
                      $location.path('/listaDispozitive')
                    }
                  
              }
              else {
                  swal({
                      title: 'Error!', 
                      imageUrl: "media/thumbsDown.png",
                      text: "Parola/Angajat gresit!",
                      timer: 2000
                  })
              }
            }
        })
  }

  $scope.register = function(path){
      $location.path(path);
  }
}])