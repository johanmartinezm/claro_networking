
angular.module('app')

.controller('listCategoryCtrl', function($scope, $state, messages, ajax, cachedImage) {

	$scope.item = [];

	ajax({
		endpoint : '/list/category/' + localStorage.currentEvent || 0,
		signHmac : true,
		showError : true,
		success : function(data){

			cachedImage({
				data : data,
				signHmac : true,
				loading: false,
				find : function(e){
					//console.log(e)
					return e.pic_path;
				},
				complete : function(){
					$scope.item = data;
				}
			})
			
			
		}
	})
<<<<<<< HEAD


	$scope.listCart = function(){
		$state.go('event.listCart')
	}
=======
>>>>>>> 7dea7a2967806a31658da27cb5608634b685926f
	
})
