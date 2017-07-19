//  controllersCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('retosCtrl', function($scope, $state, $ionicPopup, messages, ajax, cachedImage) {
	$scope.interactTitle = messages('retos_empresariales_title');

	var retos = JSON.parse(localStorage.retos || '[]');

	$scope.ok_form = true;

	ajax({
		endpoint : '/retos/questions/all/' + localStorage.currentEvent || 0,
		signHmac : true,
		showError : true,
		success : function(data){
			data.forEach(function(item){
				item.class = 'button-default';
				item.answer = false;
				item.answered = retos.indexOf(item.id) !== -1;
			});


			$scope.items = data;
			
		}
	})

	$scope.select = function(item, optionSelected, question){
		//item.class = 'button-assertive';
		//item.answer = true;

		question.answer = optionSelected.id;
		
	}

	$scope.rate = function(item){

		$scope.ok_form = true;

		item.questions.forEach(function(item_q){

			if (item_q.type == 2) {

				if(!item_q.answer_text){

					$scope.ok_form = false;
				}

			}else{

				if(!item_q.answer){
					$scope.ok_form = false;
				}

			}

		});


		if ($scope.ok_form === false) {
			$ionicPopup.alert({
		        template: messages('retos_error_answer')
		    });
		}else{
			var json = JSON.stringify({
				speaker : item.id,
				answers : item.questions.map(function(q){

					if(q.type == 2){
						return {
							id : q.id,
							type: q.type,
							response : q.options[0].id,
							response_text : q.answer_text
						}
					}else{
						return {
							id : q.id,
							type: q.type,
							response : q.answer
						}
					}

					
				})
			})

			ajax({
				endpoint : '/retos/save-response',
				method : 'POST',
				signHmac : true,
				data : {
					answers : json
				},
				showSuccess : true,
				success : function(data){
					console.log(data);
					item.answered = true;
					retos.push(item.id);
					localStorage.retos = JSON.stringify(retos);
				}
			})
		}



		/*
		if(!item.answer) return;

		*/
	}
})
