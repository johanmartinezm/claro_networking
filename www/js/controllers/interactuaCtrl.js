//  controllersCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('interactuaCtrl', function($scope, $state, messages, ajax, cachedImage) {
	$scope.interactTitle = messages('interact_title');

	var interact = JSON.parse(localStorage.interact || '[]');

	ajax({
		endpoint : '/speaker/questions/all/' + localStorage.currentEvent || 0,
		signHmac : true,
		showError : true,
		success : function(data){
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
	}
})
