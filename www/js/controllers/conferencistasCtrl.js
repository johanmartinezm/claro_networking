//  conferencistaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('conferencistasCtrl', function($scope, $state, ajax, cachedImage, $rootScope) {

	ajax({
		endpoint : '/speaker/' + localStorage.currentEvent || 0,
		showError: true,
		success : function(data){
			cachedImage({
				data : data,
				signHmac : false,
				find : function(e){
					return e.pic_path;
				},
				complete : function(){
					$scope.speakers = data;
					$rootScope.speakers = data;
				}
			})
		}
	})

})

.controller('conferencistaCtrl', function($scope, $state, $stateParams, $rootScope) {
	var id = parseInt($stateParams.id)
	$rootScope.speakers.forEach(function(speaker){
		if(id === speaker.id){
			$scope.item = speaker;
		}
	})
})
