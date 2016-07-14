angular.module('myApp').service('getSetId', function() {
    var id = ""

    return {
        getId: function() {
            return id
        },
        setId: function(value) {
            id = value
        }
    }
})