//  usuariostopCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('usuariostopCtrl', function($scope, $state, ajax, cachedImage, $ionicModal) {

	ajax({
		endpoint : '/score/' + localStorage.currentEvent || 0,
		showError: true,
		signHmac : true,
		success : function(data){
			cachedImage({
				data : data,
				find : function(e){
					return e.thumbnail;
				},
				complete : function(){
					$scope.items = data.map(function(user){
						return {
							img : user.image,
							nombre : user.name +' '+ user.lastname,
							puntaje : user.total_user +' pts',
							barra : parseInt(user.total_user*100/user.total)
						}
					})
				}
			})
		}
	})

	$ionicModal.fromTemplateUrl('rewards.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function(item) {
		$scope.item = item;
		$scope.modal.show();
	};

	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	try{
		$scope.scores = JSON.parse(localStorage.config).score;
	}catch(e){}
})
