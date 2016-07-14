angular.module('myApp').service('getSetName', function() {
    var name = ""

    return {
        getName: function() {
            return name
        },
        setName: function(value) {
            name = value
        }
    }
})