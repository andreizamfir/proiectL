angular.module('myApp').service('getSetPolicyTag', function(){
  var tag=""
  
  return{
    getTag: function(){
      return tag
    },
    setTag: function(value){
      tag = value
    }
  }
})