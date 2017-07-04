//  logisticaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('logisticaCtrl', function($scope, $state, ajax, cachedImage, $ionicModal) {

	var config = JSON.parse(localStorage.eventConfig);

	ajax({
		endpoint : '/route',
		showError: true,
		signHmac : true,
		success : function(data){
			$scope.flight = data.flight;
			$scope.hotel = data.hotel;

			cachedImage({
				image : config.event_small_map,
				complete : function(image){
					$scope.smallImage = image;
				}
			});

			cachedImage({
				image : config.event_big_map,
				complete : function(image){
					$scope.bigImage = image;
				}
			});
		}
	})

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
