//  agendaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('registerCtrl', function($scope, $state,  $ionicModal, ajax, messages,  $ionicPopup) {


	$scope.item = {
		name: '',
		lastname: '',
		id_number: '',		
		email: '',
		empresa: '',
		charge: '',
		phone: '',
		event: '',
		
	};
	

	$scope.backSec = function(){
		console.log('back');
	}

	$scope.event_list = [];

	ajax({
			endpoint : '/event/list',
			showError: true,
			signHmac : true,
			method: 'GET',
			success : function(data){
				
				$scope.event_list = data;
			}
		});


	


	$scope.save = function(){
		var error = null;
		
		if(!$scope.item.event) error = 'invalid_event';
		if(!$scope.item.phone || isNaN($scope.item.phone)) error = 'invalid_phone';
		if(!$scope.item.charge) error = 'invalid_charge';
		if(!$scope.item.empresa) error = 'invalid_empresa';
		if(!$scope.item.email) error = 'invalid_email';
		if(!$scope.item.id_number) error = 'invalid_documento';
		if(!$scope.item.lastname) error = 'invalid_lastname';
		if(!$scope.item.name) error = 'invalid_name';	
		
		
		if(error){
			$ionicPopup.alert({
				template: messages(error)
			});
			return;
		}

		ajax({
			endpoint : '/user/add',
			method : 'POST',
			data : $scope.item,
			showError : true,
			success : function(data){
				
				$ionicPopup.alert({
					template: messages(data.message)
				});

				$state.go('intro');
			}
		})
	}
	
})