angular.module('myApp').service('getSetType', function(){
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