angular.module('myApp').controller('controllerDispozitive', ['$scope', '$http', '$location', 'getSetType', 'getSetId', 'getSetPolicyTag', function($scope, $http, $location, getSetType, getSetId, getSetPolicyTag){
  $scope.tip = getSetType.getType()
  if($scope.tip=="Administrator"){
    document.getElementById("politici").style.display = 'inline'
    document.getElementById("listaPolitici").style.display = 'inline'
    document.getElementById("asociere").style.display = 'inline'
  }
  
  var refresh = function(){
    $http.get('/gamePolitici').success(function(response){
      $scope.politici=response
    })
  }
  
  $http.get('/devices').success(function(response){
    $scope.devices=response
    refresh()
  })
  
  $scope.adauga = function($politica){
    if($politica.gamaPolitica==""){
      swal({
        title: "Eroare",
        text: "Trebuie introdus o sfera de politica",
        type: "error"
      })
    } else
    $http.post('/adaugaPolitica', $politica).success(function(request){
      $http.request = $politica
      $scope.politica.gamaPolitica=""
      refresh()
    })
  }
    
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
  
  $scope.adaugaScopeDispozitiv = function($politica){
    if($politica.numePolitica==undefined){
      swal({
        title: "Eroare",
        text: "Trebuie introdus un nume de politica",
        type: "error"
      })
    } else if($politica.idDispozitiv==undefined){
      swal({
        title: "Eroare",
        text: "Trebuie introdus id-ul unui dispozitiv",
        type: "error"
      })
    } else 
        $http.post('/asocierePolitica', $politica).success(function(request, response){
          $http.request = $politica
          swal({
            type: "success",
            title: "Succes",
            text : "Am introdus politica " + $scope.politica.numePolitica + " in dispozitivul cu id-ul " + $scope.politica.idDispozitiv
          })
          $scope.politica.idDispozitiv = ""
          refresh()
      })
  }
  
  $scope.dispozitivePolitica = function(path, policyTag){
    getSetPolicyTag.setTag(policyTag)
    $location.path(path)
  }
  
  $scope.structuraPolitica = function(path, policyTag){
    getSetPolicyTag.setTag(policyTag)
    $location.path(path)
  }
}])