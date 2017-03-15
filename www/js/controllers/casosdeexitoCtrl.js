//  casosdeexitoCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('casosdeexitoCtrl', function($scope, $state, ajax, $ionicPopup, messages) {
	$scope.questions = [];

	ajax({
		endpoint : '/leads/all',
		showError: true,
		signHmac : true,
		loading: true,
		success : function(data){
			$scope.questions = data;
		}
	});

	$scope.selectOption = function(question, response) {
		question.info = response;
	}

	$scope.saveForm = function(){
		// cambiar el mensaje por uno dinámico como messages('message_from_json')
		$ionicPopup.alert({
	    	template: "Esta seguro de enviar el formulario"
	   	}).then(function(res) {
				if (res) {
					var data = [];
					$scope.questions.forEach(function(item){
						data.push({
							"__id": parseInt(localStorage.identify) || 0,
							"lead_id": item.lead_id,
							"response": item.info,
							"event": parseInt(localStorage.currentEvent) || 0
						});
					});

					ajax({
						endpoint : '/leads/add-response',
						signHmac : true,
						showSuccess : false,
						data: data,
						method: 'post',
						success: function(data){
							if(data.status == 'ok'){
								$scope.questions = [];
								// cambiar el mensaje por uno dinámico como messages('message_from_json')
								$ionicPopup.alert({
							  	template: "Registro exitoso"
							  }).then(function(res) {
									$state.go('event.home');
								});
							}
						}
					});
				}
		});
	}
})
