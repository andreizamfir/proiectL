var myApp = angular.module('myApp', ['ngRoute', 'ngMessages'])
var SERVER = 'https://proiect-licenta-andreizamfir16.c9users.io'

myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/register', {
        templateUrl: 'templates/register.html',
	      controller: 'registerController'
      })
      .when('/login', {
  	    templateUrl: 'templates/login.html',
	      controller: 'loginController'
      })
      .when('/firstPage', {
        templateUrl: 'templates/firstPage.html',
        controller: 'firstPageController'
      })
      .when('/managerPage',{
        templateUrl: 'templates/managerPage.html',
        controller: 'managerController'
      })
      .when('/listaAngajati', {
        templateUrl: 'templates/managerPageAngajati.html',
        controller: 'listaAngajatiController'
      })
      .otherwise({
	      redirectTo: '/login'
      })
}])

myApp.service('getSetName', function(){
  var name=""
  
  return{
    getName: function(){
      return name
    },
    setName: function(value){
      name = value
    }
  }
})

myApp.service('getSetType', function(){
  var type=""
  
  return{
    getType: function(){
      return type
    },
    setType: function(value){
      switch(value){
        case(0):
          type="Manager"
          break
        case(1):
          type="Administrator"
          break
        case(2):
          type="Inginer"
          break
        case(3):
          type="Tehnician"
          break
      }
    }
  }
})





myApp.controller('loginController', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType){
    $scope.login = function(username, password){
        $http.get(SERVER + '/employee/' + username).success(function(response){
      
            if(username!=null && password!=null){
              $scope.employee=response
              getSetName.setName(username)
              getSetType.setType($scope.employee.type)
              
              if(username==$scope.employee.name && password==$scope.employee.password){
                  if(getSetType.getType()=="Manager")
                    $location.path('/managerPage')
                  else {
                    $location.path('/firstPage')
                    $http.get(SERVER + '/getDevices').success(function(response){
                      
                    })
                  }
              }
              else {
                  swal({
                      title: 'Error!', 
                      imageUrl: "media/thumbsDown.png",
                      text: "Wrong username/password!"
                  })
              }
            }
        })
  }

  $scope.register = function(path){
      $location.path(path);
  }
}])





myApp.controller('registerController', ['$scope', '$location', '$http', function($scope, $location, $http){
  
  $scope.back = function(path){
    $location.path(path)
  }
  
  $scope.register = function(path, $val){
    if ($val.name!=null && $val.password!=null && $val.email!=null){
      if($val.password!=$val.passwordAgain){
        swal({
          title:"Eroare!", 
          text: "Parolele nu coincid!", 
          type: "error"})
      }
      else{
        $http.post(SERVER + '/employees', $val).success(function(request){
          $http.request = $val
          swal({
            title: "Succes!", 
            text: "Inregistrare cu succes!", 
            type: "success", 
            timer: 2000})
        })
      $location.path(path)
      }
    }
  }
}])





myApp.controller('firstPageController', ['$scope', 'getSetName', 'getSetType', function($scope, getSetName, getSetType){
  $scope.name = getSetName.getName()
  $scope.type = getSetType.getType()
  
}])





myApp.controller('listaAngajatiController', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType){
  $scope.name = getSetName.getName()

  var refresh = function(){
    $http.get('/employees/').success(function(response){
      $scope.employees=response
      console.log($scope.employees)
      //$scope.type=new Array()
      
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

          return [luna, zi, an].join('-');
  }
    
  $scope.inapoi = function(path){
    $location.path(path)
  }
    
  $scope.promovare = function(id){
    $http.get('/employees/' + id).success(function(response){
    
      if(response.type>1){
        var json = response
        json.type -= 1
      
        $http.put('/employees/' + id, json).success(function(response){
          $http.request=id
          $http.request.updateAttributes = json
          refresh()
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
          animation: "slide-from-top",
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
            
            // $scope.employees.forEach(function(entry){
            //   if(entry.id==id){
            //     json.modificare = comentariu
            //   }
            // })
      
            swal({
              title: "Succes!", 
              text: "Angajatul a fost retrogradat din cauza: " + inputValue, 
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






myApp.controller('managerController', ['$scope', '$location', function($scope, $location){
    
  $scope.angajati = function(path){
    $location.path(path)
  }
  
}])

//TODO
//sa nu pot sa intru pe alte pagini daca nu exista un utilizator logat
//cand dau back sa se faca logout