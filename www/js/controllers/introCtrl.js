//  introCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('introCtrl', function($scope, $rootScope, $state, $ionicSlideBoxDelegate, $state, ajax, $interval, messages, $ionicPopup, $ionicModal, cachedImage, PushNotificationDevice) {
	$scope.data = {};
	/*$scope.data = {
		username : 'tim.cook@apple.com',
		password : '1067888111'
	};*/

	$scope.info = {
		conditions : false,
		tooltip : messages('login_help_message')
	};

	$scope.changeConditions = function(){
		$scope.info.conditions = !$scope.info.conditions;
	}

	$scope.showTerms = function(){
		$scope.terms = localStorage.TermsAndServices;
		$ionicModal.fromTemplateUrl('templates/terms.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(modal) {
		    $scope.modal = modal;
		    modal.show();
		});
	}

	/*$scope.slideChanged = function(index){
		$scope.tooltip = messages('login_help_message');
	}*/

	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
	};


	$scope.register = function(){

		$state.go('event.list');	
		console.log('registrar');
	}

	$scope.login = function(){
		var error = null;
		//console.log($scope.data.username );

		if(!$scope.info.conditions) error = 'login_terms';
		if(!$scope.data.password) error = 'login_password_required';
		if(isNaN($scope.data.password)) error = 'login_password_required';
		if(!$scope.data.username || $scope.data.username === undefined ) error = 'login_username_required';
		if(!regexEmail.test($scope.data.username)) error = 'auth_invalid_email';
		if(error){
			$ionicPopup.alert({
                template: messages(error)
            });
            return false;
		}



		localStorage.identify = $scope.data.username;
		localStorage.password = CryptoJS.SHA1($scope.data.password).toString()
		ajax({
			endpoint : '/security/auth', 
			data : $scope.data,	
			method : 'POST',
			signHmac : true,
			showError : true,
			success : function(data){
				delete localStorage.LoginAttempt;
				$scope.data = {};
				localStorage.session = JSON.stringify(data);
				localStorage.identify = data.id;
				localStorage.token = data.token;
				PushNotificationDevice.sendServer();
				
				$state.go('event.list');
				
			}, 
			error : function(data){
				if(data.message === 'auth_failed' && data.token){
					localStorage.LoginAttempt = data.token;
				}
				else if(data.message === 'auth_blocked'){
					delete localStorage.LoginAttempt;
				}
			}
		});
		return false;
	}




	//$interval.cancel($rootScope.interval);
	delete $rootScope.notifications;
	

	

	
})