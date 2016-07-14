angular.module('myApp').controller('controllerComenzi', ['$scope', '$http', '$location', 'getSetId', 'getSetType', function($scope, $http, $location, getSetId, getSetType) {
    var id = getSetId.getId()
    
    function formatareData(data) {
        var d = new Date(data || Date.now()),
            luna = '' + (d.getMonth() + 1),
            zi = '' + d.getDate(),
            an = d.getFullYear();

        if (luna.length < 2) luna = '0' + luna;
        if (zi.length < 2) zi = '0' + zi;

        return [zi, luna, an].join('-');
    }

    if (getSetType.getType() != "Manager") {
        $location.path('/eroare')
    } else {
        $http.get('/angajati/' + id + '/comenzi').success(function(response) {
            $scope.comenzi = response

            for (var i = 0; i < $scope.comenzi.length; i++) {

                var obiect = new Object()
                obiect = $scope.comenzi[i]

                var data = new Date(obiect.createdAt.toString())
                obiect.data = formatareData(data)

                var minute = data.getMinutes().toString().length == 1 ? '0' + data.getMinutes() : data.getMinutes()
                var ore = data.getHours().toString().length == 1 ? '0' + data.getHours() : data.getHours()

                obiect.ora = ore + ':' + minute

                $scope.comenzi.splice(i, 1, obiect)
            }
        })

        $scope.inapoi = function(path) {
            $location.path(path)
        }
    }
}])