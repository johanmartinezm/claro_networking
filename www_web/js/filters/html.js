angular.module('app')

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})
.filter('flupper', function(){
	return function(val){
		return val.charAt(0).toUpperCase() + val.slice(1);
	}
});