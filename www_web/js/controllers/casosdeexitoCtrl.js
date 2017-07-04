//  casosdeexitoCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('casosdeexitoCtrl', function($stateParams, $scope, $state, ajax, $ionicPopup, messages) {
	$scope.questions = [];

	//console.log($state);

	$scope.name_sec = $state.params.name_seccion;

	ajax({
		endpoint : '/leads/all',
		showError: true,
		signHmac : true,
		loading: true,
		success : function(data){
			$scope.questions = data;
			//console.log(data);
		}
	});

	$scope.selectOption = function(question, response) {
		question.info = response;
	}

	$scope.saveForm = function(){
		// cambiar el mensaje por uno dinámico como messages('message_from_json')
		
				
					var data_ = [];
					var error = false;

					//console.log($scope.questions);
						
					$scope.questions.forEach(function(item){

						if( typeof item.info === 'undefined'  ){
							error = true;

							//console.log(error);
						}else{
							//console.log(item);

							if(item.response == ''){

								data_.push({
									"__id": parseInt(localStorage.identify) || 0,
									"lead_id": item.lead_id,
									"response": item.info,
									"event": parseInt(localStorage.currentEvent) || 0
								});

							}else{
						
								data_.push({
									"__id": parseInt(localStorage.identify) || 0,
									"lead_id": item.lead_id,
									"response": item.info.message,
									"event": parseInt(localStorage.currentEvent) || 0
								});
							}

							//console.log(data_);
						}

					});					

					if(error === true){
						$ionicPopup.alert({
			                template: messages('lead_error_answer')
			            });
					}else{

						var ok = false;

						data_.forEach(function(item){							

							ajax({
								endpoint : '/leads/add-response',
								signHmac : true,
								showSuccess : false,
								data: item,
								method: 'post',
								success: function(data_resp){

									//console.log(data_resp);
									if(data_resp.status == 'ok'){
										//$scope.questions = [];
										// cambiar el mensaje por uno dinámico como messages('message_from_json')
										//console.log(item.lead_id+'--'+item.response);
										ok = true;
										
									}
								}
							});
							
						});	

						$ionicPopup.alert({
						  	template: messages('lead_ok_answer')
						});


						$state.go('event.home');				

					}					
					
				
		
	}
})
