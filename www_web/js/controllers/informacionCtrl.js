//  logisticaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('informacionCtrl', function($scope, $state, ajax, cachedImage, $ionicModal) {

	var config = JSON.parse(localStorage.eventConfig);

	//console.log(localStorage.eventConfig);

	cachedImage({
		image : localStorage.eventConfig.event_small_map,
		complete : function(image){
			$scope.smallImage = image;
		}
	});

	cachedImage({
		image : localStorage.eventConfig.event_big_map,
		complete : function(image){
			$scope.bigImage = image;
		}
	});

	$scope.openModal = function(){
		$ionicModal.fromTemplateUrl('templates/map-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(modal) {
		    $scope.modal = modal;
		    modal.show();
		});
	}
})
