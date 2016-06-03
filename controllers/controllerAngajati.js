angular.module('myApp').controller('controllerAngajati', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType){
  $scope.name = getSetName.getName()
  
  var refresh = function(){
    $http.get('/employees/').success(function(response){
      $scope.employees=response
      
      for(var i=0; i<$scope.employees.length; i++){
        if($scope.employees[i].type==0)
          $scope.employees.splice(i,1)
      }
        
      function compare(a,b) {
        if (a.type < b.type)
          return -1;
        else 
          if (a.type > b.type)
            return 1;
          else 
            return 0;
      }
        
      $scope.employees.sort(compare)
        
      for(var i=0; i<$scope.employees.length; i++){
        getSetType.setType($scope.employees[i].type)
          
        var obiect = new Object()
        obiect = $scope.employees[i]
        obiect.type = getSetType.getType()
          
        var data = new Date(obiect.createdAt.toString())
        obiect.createdAt = formatareData(data)
        //obiect.createdAt = data.toISOString().replace(/T/, ' ').replace(/\..+/, '')
          
        $scope.employees.splice(i, 1, obiect)
      }
    })
  }
    
  refresh()
    
  function formatareData(data) {
          var d = new Date(data || Date.now()),
          luna = '' + (d.getMonth() + 1),
          zi = '' + d.getDate(),
          an = d.getFullYear();

          if (luna.length < 2) luna = '0' + luna;
          if (zi.length < 2) zi = '0' + zi;

          return [zi, luna, an].join('-');
  }
    
  $scope.inapoi = function(path){
    $location.path(path)
  }
    
  $scope.promovare = function(id){
    $http.get('/employees/' + id).success(function(response){
    
      if(response.type>1){
        var json = response
        json.type -= 1
      
        swal({
          title:"Promovare",
          text: "Promovati angajatul?",
          type: "input",
          showCancelButton: true,
          closeOnConfirm: false,
          animation: "slide-from-top",
          inputPlaceholder: "De ce se doreste promovarea angajatului"
          },
          function(inputValue){
            if (inputValue === false) 
              return false;
  
            if (inputValue === "") {
              swal.showInputError("Trebuie sa mentionati un comentariu!")
              return false
            }
            
            json.modificare = inputValue
            
            swal({
              title: "Succes!", 
              text: "Cauza promovarii: " + inputValue, 
              type: "success"
            })
            
            $http.put('/employees/' + id, json).success(function(response){
              $http.request=id
              $http.request.updateAttributes = json
              refresh()
            })
        })
      }
      else 
        swal({
          title: "Eroare",
          text: "Angajatul a atins cea mai inalta functie",
          type: "error"
        })
    })
  }
  
  $scope.retrogradare = function(id){
    $http.get('/employees/' + id).success(function(response){
      
      if(response.type<3){
        var json = response
        json.type += 1
    
        swal({
          title:"Retrogradare",
          text: "Retrogradati angajatul?",
          type: "input",
          showCancelButton: true,
          closeOnConfirm: false,
          animation: "slide-from-bottom",
          inputPlaceholder: "De ce se doreste retrogradarea angajatului"
          },
          function(inputValue){
            if (inputValue === false) 
              return false;
  
            if (inputValue === "") {
              swal.showInputError("Trebuie sa mentionati un comentariu!")
              return false
            }
            
            json.modificare = inputValue
            
            swal({
              title: "Succes!", 
              text: "Cauza retrogradarii: " + inputValue, 
              type: "success"
            })
            
            $http.put('/employees/' + id, json).success(function(response){
              $http.request=id
              $http.request.updateAttributes = json
              refresh()
            })
        })
      }
      else
        swal({
          title: "Eroare",
          text: "Angajatul ocupa cea mai de jos functie deja",
          type: "error"
        })
    })
  }
}])