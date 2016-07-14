angular.module('myApp').controller('controllerInterfete', ['$scope', '$http', '$location', 'getSetId', 'getSetType', function($scope, $http, $location, getSetId, getSetType) {
    var id = getSetId.getId()

    if (getSetType.getType() == "Administrator" || getSetType.getType() == "Inginer") {
        $http.get('/dispozitiv/' + id + '/interfete').success(function(response) {
            if (response.interfete == "Nu exista interfete disponibile") {
                document.getElementById("tabelInterfete").style.display = 'none'
                document.getElementById("interfete").innerHTML = response.interfete
                console.log(response.interfete)
            } else
                $scope.interfete = response.interfete
        })

        $scope.inapoi = function(path) {
            $location.path(path)
        }
    } else {
        $location.path('/eroare')
    }
}])