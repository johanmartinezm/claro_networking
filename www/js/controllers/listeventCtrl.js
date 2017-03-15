

angular.module('app')

.controller('listeventCtrl', function($scope, $state, $cordovaCalendar, ajax, cachedImage, $ionicPopup, $rootScope, $interval) {
	$scope.events = [];

	$scope.addToCalendar = function(event) {
		$cordovaCalendar.createEvent({
			title: event.name_event,
			notes: event.descrip,
			startDate: new Date(event.start_at),
			endDate: new Date(event.end_at)
		}).then(function (result) {
			$ionicPopup.alert({
        template: "Se ha agregado correctamente el evento a su calendario"
      });
		}, function (err) {
			$ionicPopup.alert({
        template: "Se ha presentado un problema al agregar el evento a su calendario"
      });
		});
	}

	$scope.logInEvent = function(event) {
		localStorage.currentEvent = event.id;
		var url = '/config/app_config/' + event.id;
		ajax({
			endpoint : url,
			showError: true,
			signHmac : true,
			success : function(data){
				localStorage.eventConfig = data.config;
				$state.go('event.home');
				$rootScope.startListeningNotification();
			}
		});
	}

	$scope.signInEvent = function(event) {
		localStorage.currentEvent = event.id;
		var session = JSON.parse(localStorage.session);

		ajax({
			endpoint : '/user/event',
			showError: true,
			signHmac : true,
			method: 'POST',
			data: {'__id': event.user_id, 'event': event.id},
			success : function(data){
				console.log(data)
				// $state.go('event.home');
			}
		});
	}

	ajax({
		endpoint : '/event',
		showError: true,
		signHmac : true,
		success : function(data){
			cachedImage({
				data : data,
				signHmac : true,
				loading: false,
				find : function(e){
					console.log(e)
					return e.pic_path;
				},
				complete : function(){
					$scope.events = data;
				}
			})
		}
	});

})
