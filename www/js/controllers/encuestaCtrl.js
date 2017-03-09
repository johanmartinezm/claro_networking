//  encuestaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('encuestaCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicModal, ajax, cachedImage, messages, $ionicPopup) {
	$scope.init = function() {
		$ionicSlideBoxDelegate.enableSlide(false);
	};
	$scope.page = 0;

	$scope.next = function(item) {
		if(!item.answer)return;
		var answers = {question : item.id, answers : []};
		item.companies.forEach(function(c){
			if(c.answer){
				answers.answers.push({id : c.id});
			}
		})
		var data = JSON.stringify(answers);
		ajax({
			endpoint : '/company/save-poll',
			method : 'POST',
			data : {
				answers : data
			}, 
			loading : false,
			signHmac : true,
			success : function(){

			}
		})
		if($scope.items.indexOf(item) === $scope.items.length -1){
			$scope.openPopup();
		}
		else{
			$scope.page++;
			$ionicSlideBoxDelegate.next();
		}
	};

	ajax({
		endpoint : '/company/poll',
		signHmac : true,
		showError : true,
		success : function(data){
			$scope.limit = data.length;
			var images = []
			data = data.filter(function(e){
				return !e.answered;
			});
			$scope.page = $scope.limit - data.length + 1;
			if(data.length === 0){
				$scope.openPopup();
				return;
			}
			data.forEach(function(e){
				e.answer = false;
				e.class = 'button-default';
				images.push.apply(images, e.companies)
			})
			cachedImage({
				data : images,
				find : function(e){
					return e.imagen;
				},
				complete : function(){
					$scope.items = data;
				}

			})
		}
	})

	$scope.select = function(c, item){
		if(!c.answer){
			c.class = 'answer active';
			c.answer = true;
			item.class = 'button-assertive';
			item.answer = true;
		}
		else{
			c.class = '';
			c.answer = false;
			var control = false;
			item.companies.forEach(function(c){
				control = control || c.answer;
			})
			if(!control){
				item.class = 'button-default';
				item.answer = false;	
			}	
		}
	}

	
	$ionicModal.fromTemplateUrl('modal-encuesta.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});

	$scope.openPopup = function() {
		alertPopup = $ionicPopup.alert({
	    	template: messages('poll_blocked')
	   	}).then(function(res) {
			$state.go('event.home');
		});
	};
	
})