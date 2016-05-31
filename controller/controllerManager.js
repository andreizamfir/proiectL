var myApp = angular.module('myApp', ['ngRoute', 'ngMessages']);
var SERVER = 'https://proiect-licenta-andreizamfir16.c9users.io'

myApp.controller('controllerManager', ['$scope', '$location', 'getSetName', function($scope, $location, getSetName){
  $scope.name = getSetName.getName()
  
  $scope.angajati = function(path){
    $location.path(path)
  }
  
  $scope.inapoi = function(path){
    $location.path(path)
  }
  
  $scope.dispozitive = function(path){
    $location.path(path)
  }
  
}])