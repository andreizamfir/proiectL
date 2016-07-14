var myApp = angular.module('myApp', ['ngRoute', 'ngMessages']);

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
      .when('/comenziAngajat', {
        templateUrl: 'templates/listaComenzi.html',
        controller: 'controllerComenzi'
      })
      .when('/listaDispozitive', {
        templateUrl: 'templates/listaDispozitive.html',
        controller: 'controllerDispozitive'
      })
      .when('/detaliiDispozitiv', {
        templateUrl: 'templates/detaliiDispozitiv.html',
        controller: 'controllerDetaliiDispozitiv'
      })
      .otherwise({
	      redirectTo: '/eroare'
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
      .when('/politici', {
        templateUrl: 'templates/listaPolitici.html',
        controller: 'controllerPolitici'
      })
      .when('/politica',{
        templateUrl: 'templates/structuraPolitica.html',
        controller: 'controllerPolitica'
      })
      .when('/creareAplicatie', {
        templateUrl: 'templates/paginaAplicatie.html',
        controller: 'controllerAplicatie'
      })
      .when('/aplicatiiCustom', {
        templateUrl: 'templates/listaAplicatiiCustom.html',
        controller: 'controllerAplicatiiCustom'
      })
      .when('/modificareAplicatie', {
        templateUrl: 'templates/modificareAplicatie.html',
        controller: 'controllerModificareAplicatie'
      })
      .when('/eroare', {
        templateUrl: 'templates/paginaEroare.html',
        controller: 'controllerEroare'
      })
}])



//TODO
//adaugarea de comenzi pt politici

//structura politica

//de sters controllerere si templateurile care nu imi mai folosesc (configuratie, detalii)