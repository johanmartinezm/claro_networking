

angular.module('app')

.controller('listeventCtrl', function($scope, $state, $cordovaCalendar, ajax, messages, cachedImage, $ionicPopup, $rootScope, $interval) {
	$scope.events = [];

	$scope.event_espera = true;

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
		
		$rootScope.event = event;
		localStorage.currentEvent = event.id;

		$scope.menuEvent(event.id);	

		var url = '/config/app_config/' + event.id;
		ajax({
			endpoint : url,
			showError: true,
			signHmac : true,
			success : function(data){

				$config = JSON.parse(data.config);
				localStorage.eventConfig = data.config;
				localStorage.TermsAndServices = $config.terms_services;
				localStorage.faq = JSON.stringify($config.faq);
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
				//console.log(data)
				$ionicPopup.alert({
			        template: messages('event_add_user')
			    });
				event.active = 0;

				// $state.go('event.home');
			}
		});
	}


	/****************************
	Creacion de menu por evento
	****************************/


	$scope.menuEvent = function(event){
		$rootScope.menuItems = [];

		$rootScope.menuItems = [
			{
				sref: 'event.list',
				icon: 'P',
				text: 'Eventos',
			},
			{
				sref: 'event.home',
				icon: 'R',
				text: 'Home',
				active: true
			},
		]

		ajax({
			endpoint : '/event/seccion/' + event,
			showError: true,
			signHmac : true,
			success : function(data){
				//console.log(data);

				data.forEach(function(item){
					$rootScope.menuItems.push({
						'sref' : item.sref,
						'icon' : item.icon,
						'text' : item.name,
						'badge' : item.badge

					})
				});

				$rootScope.menuItems.push({
					'sref' : 'logout',
					'icon' : 'B',
					'text' : 'Cerrar sesión'
				});

			},
	        error: function(e){console.log(e)}
		});

		

		//console.log($rootScope.menuItems);
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
					//console.log(e)
					return e.pic_path;
				},
				complete : function(){
					$scope.events = data;
				}
			})
		}
	});

})
