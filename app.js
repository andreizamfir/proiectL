var myApp = angular.module('myApp', ['ngRoute', 'ngMessages']);
var SERVER = 'https://proiect-licenta-andreizamfir16.c9users.io'

myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/register', {
        templateUrl: 'templates/register.html',
	      controller: 'controllerRegister'
      })
      .when('/login', {
  	    templateUrl: 'templates/login.html',
	      controller: 'controllerLogin'
      })
      .when('/paginaManager',{
        templateUrl: 'templates/paginaManager.html',
        controller: 'controllerManager'
      })
      .when('/paginaAdministrator',{
        templateUrl: 'templates/paginaAdministrator.html',
        controller: 'controllerAdministrator'
      })
      .when('/listaAngajati', {
        templateUrl: 'templates/listaAngajati.html',
        controller: 'controllerAngajati'
      })
      .when('/listaDispozitive', {
        templateUrl: 'templates/listaDispozitive.html',
        controller: 'controllerDispozitive'
      })
      .when('/listaHosts', {
        templateUrl: 'templates/listaHosts.html',
        controller: 'controllerHosts'
      })
      .when('/configuratieDispozitiv', {
        templateUrl: 'templates/configuratieDispozitiv.html',
        controller: 'controllerConfiguratie'
      })
      .when('/interfeteDispozitiv', {
        templateUrl: 'templates/interfeteDispozitiv.html',
        controller: 'controllerInterfete'
      })
      .when('/analizaRuta', {
        templateUrl: 'templates/rutaDispozitive.html',
        controller: 'controllerRuta'
      })
      .when('/eroare', {
        templateUrl: 'templates/paginaEroare.html',
        controller: 'controllerEroare'
      })
      .otherwise({
	      redirectTo: '/eroare'
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
        case(4):
          type="Not logged"
          break
      }
    }
  }
})
myApp.service('getSetId', function(){
  var id=""
  
  return{
    getId: function(){
      return id
    },
    setId: function(value){
      id = value
    }
  }
})




myApp.controller('controllerRegister', ['$scope', '$location', '$http', function($scope, $location, $http){
  var emailuri = new Array()
  $http.get('/employees').success(function(response){
    response.forEach(function(entry){
      emailuri.push(entry.email)
    })
  })
    
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
      else
        if($.inArray($val.email), emailuri){
          swal({
            title: "Eroare!",
            text: "Emailul este deja inregistrat!",
            type: "error"
          })
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
myApp.controller('controllerLogin', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType){
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
myApp.controller('controllerManager', ['$scope', '$location', 'getSetName', 'getSetType', function($scope, $location, getSetName, getSetType){
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
myApp.controller('controllerAdministrator', ['$scope', '$http', '$location', 'getSetId', 'getSetName', function($scope, $http, $location, getSetId, getSetName){
  $scope.name = getSetName.getName()
  
  $scope.inapoi = function(path){
    $location.path(path)
  }
  
  $scope.dispozitive = function(path){
    $location.path(path)
  }
  
  $scope.hosts = function(path){
    $location.path(path)
  }
}])

myApp.controller('controllerAngajati', ['$scope', '$http', '$location', 'getSetName', 'getSetType', function($scope, $http, $location, getSetName, getSetType){
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

myApp.controller('controllerDispozitive', ['$scope', '$http', '$location', 'getSetType', 'getSetId', function($scope, $http, $location, getSetType, getSetId){
  $scope.tip = getSetType.getType()
  
  $http.get('/devices').success(function(response){
    $scope.devices=response
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
  
  $scope.config = function(path, id){
    getSetId.setId(id)
    $location.path(path)
  }

  $scope.interface = function(path, id){
    getSetId.setId(id)
    $location.path(path)
  }
}])
myApp.controller('controllerConfiguratie', ['$scope', '$http', '$location', 'getSetId', function($scope, $http, $location, getSetId){
  var id = getSetId.getId()
  
  $http.get(SERVER + '/device/' + id + '/configuration').success(function(response){
    if(response.response=="Nu exista configuratie")
      document.getElementById('rezultat').innerHTML = response.response
    else
      document.getElementById('rezultat').innerHTML = response.response.replace(RegExp("\n","g"), "<br>");
  })
  
  $scope.inapoi = function(path){
    $location.path(path)
  }
  
}])
myApp.controller('controllerInterfete', ['$scope', '$http', '$location', 'getSetId', function($scope, $http, $location, getSetId){
  var id = getSetId.getId()
  
  $http.get(SERVER + '/device/' + id + '/interfaces').success(function(response){
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
myApp.controller('controllerHosts', ['$scope', '$http', '$location', 'getSetType', function($scope, $http, $location, getSetType){
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

myApp.controller('controllerRuta', ['$scope', '$http', '$location', function($scope, $http, $location){
  $http.get(SERVER + '/hosts').success(function(response){
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

myApp.controller('controllerEroare', ['$scope', function($scope){
  
}])

// myApp.controller('controllerInterfata', ['$scope', '$http', '$location', 'getSetId', function($scope, $http, $location, getSetId){
  
// }])





//TODO
//injectarea de controllere si servicii, pentru a le pune in foldere separate