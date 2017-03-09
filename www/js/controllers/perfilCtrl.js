//  agendaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('perfilCtrl', function($scope, $state, session, cachedImage, $ionicModal, ajax, messages, camera, $ionicPopup) {
	
	$scope.item = {
		name: session('name'),
		lastname: session('lastname'),
		charge: session('charge'),
		email: session('username'),
		phone: session('phone')
	};

	cachedImage({
		image : session('pic'),
		complete : function(image){
			$scope.image = image;
		}
	})

	$scope.photo = function(){
		$scope.message = messages('prompt_select_picture');
		$ionicModal.fromTemplateUrl('templates/prompt-picture-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.postModal = modal;
			modal.show();
		});

		$scope.closeModal = function(){
			$scope.postModal.hide();
		}

		$scope.camera = function(){
			camera.take($scope.uploadFile);
			$scope.closeModal();
		}
 
		$scope.gallery = function(){
			camera.gallery($scope.uploadFile)
			$scope.closeModal();
		}
	}

	$scope.uploadFile = function(file, url){
		$scope.$apply(function(){
			$scope.file = file;
			$scope.image = url;	
		})		
	}

	$scope.update = function(){
		var error = null;
		if(!$scope.item.charge) error = 'invalid_charge';
		if($scope.item.phone && isNaN($scope.item.phone)) error = 'invalid_phone';
		if(!$scope.item.lastname) error = 'invalid_lastname';
		if(!$scope.item.name) error = 'invalid_name';
		if(error){
			$ionicPopup.alert({
				template: messages(error)
			});
			return;
		}

		ajax({
			endpoint : '/user/update',
			file : $scope.file,
			fileKey : 'pic',
			signHmac : true,
			method : 'POST',
			data : $scope.item,
			showError : true,
			success : function(data){
				delete $scope.file;
				var s = JSON.parse(localStorage.session);
				s.pic = data.pic;
				s.thumbnail = data.thumbnail;
				for(var attr in $scope.item){
					s[attr] = $scope.item[attr];
				}
				localStorage.session = JSON.stringify(s);
				$ionicPopup.alert({
					template: messages(data.message)
				});
			}
		})
	}
})