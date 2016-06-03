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
      .when('/dispozitivePolitica', {
        templateUrl: 'templates/dispozitivePolitica.html',
        controller: 'controllerDispozitivePolitica'
      })
      .when('/politica',{
        templateUrl: 'templates/structuraPolitica.html',
        controller: 'controllerPolitica'
      })
      .when('/eroare', {
        templateUrl: 'templates/paginaEroare.html',
        controller: 'controllerEroare'
      })
      .otherwise({
	      redirectTo: '/eroare'
      })
}])



//TODO
//rute - sa scot ip-urile care incep cu 207
//sa inserez jquery in controllerPolitica
//buton de creare aplicatie