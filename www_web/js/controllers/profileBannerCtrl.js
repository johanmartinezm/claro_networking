//  profileBannerCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('profileBannerCtrl', function($scope, $state, ajax, session, cachedImage) {
	$scope.session = session('all');

	cachedImage({
		image : session('thumbnail'),
		complete : function(image){
			$scope.image = image;
		}
	});
})