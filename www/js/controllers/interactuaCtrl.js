//  controllersCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

<<<<<<< HEAD
.controller('interactuaCtrl', function($scope, $state, $ionicPopup, messages, ajax, cachedImage) {
=======
.controller('interactuaCtrl', function($scope, $state, messages, ajax, cachedImage) {
>>>>>>> 7dea7a2967806a31658da27cb5608634b685926f
	$scope.interactTitle = messages('interact_title');

	var interact = JSON.parse(localStorage.interact || '[]');

<<<<<<< HEAD
	$scope.ok_form = true;

=======
>>>>>>> 7dea7a2967806a31658da27cb5608634b685926f
	ajax({
		endpoint : '/speaker/questions/all/' + localStorage.currentEvent || 0,
		signHmac : true,
		showError : true,
		success : function(data){
<<<<<<< HEAD
			//console.log(data);
=======
>>>>>>> 7dea7a2967806a31658da27cb5608634b685926f
			data.forEach(function(item){
				item.class = 'button-default';
				item.answer = false;
				item.answered = interact.indexOf(item.id) !== -1;
			});
			cachedImage({
				data : data,
				find : function(e){
					return e.pic_path
				},
				complete : function(){
					$scope.items = data;
				}
			})
		}
	})

	$scope.select = function(item, optionSelected, question){
<<<<<<< HEAD
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
		        template: messages('interactua_error_answer')
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

			//console.log(json);

			ajax({
				endpoint : '/speaker/save-response',
				method : 'POST',
				signHmac : true,
				data : {
					answers : json
				},
				showSuccess : true,
				success : function(data){
					console.log(data);
					item.answered = true;
					interact.push(item.id);
					localStorage.interact = JSON.stringify(interact);
				}
			})
		}



		/*
		if(!item.answer) return;

		*/
=======
		item.class = 'button-assertive';
		item.answer = true;
		question.answer = optionSelected.id;
	}

	$scope.rate = function(item){
		if(!item.answer) return;

		var json = JSON.stringify({
			speaker : item.id,
			answers : item.questions.map(function(q){
				return {
					id : q.id,
					response : q.answer
				}
			})
		})
		ajax({
			endpoint : '/speaker/save-response',
			method : 'POST',
			signHmac : true,
			data : {
				answers : json
			},
			showSuccess : true,
			success : function(){
				item.answered = true;
				interact.push(item.id);
				localStorage.interact = JSON.stringify(interact);
			}
		})
>>>>>>> 7dea7a2967806a31658da27cb5608634b685926f
	}
})
