//  sideMenuCtrlCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('rootCtrl', function($scope,$location, $state, session, messages, $ionicPopup, camera, $ionicHistory, $timeout, ajax, $rootScope, $interval, PushNotificationDevice) {

	var type = session('user_type');
	$rootScope.notifications = [];
	$rootScope.notifications.page = 1;
	$scope.notifications = $rootScope.notifications;
	$scope.menu_active = true;


	if($rootScope.sec === 'event.list'){
		//console.log($rootScope.sec);
		$scope.menu_active = false;
	}

	$scope.menuItems = [
		{
			sref: 'event.home',
			icon: 't',
			text: 'Home',
			active: true
		},
		{
			sref: 'event.list',
			icon: 't',
			text: 'Eventos',
		},
		{
			sref: 'event.agenda',
			icon: 'c',
			text: 'Agenda'
		},
		{
			sref: 'event.conferencistas',
			icon: 'l',
			text: 'Conferencistas'
		},
		{
			sref: 'event.logistica',
			icon: 'J',
			text: 'Logística'
		},
		{
			sref: 'event.entrada',
			icon: 'x',
			text: 'Mi entrada'
		},
		{
			sref: 'event.notificaciones',
			icon: 'z',
			text: 'Notificaciones',
			badge: true
		},
		/*{
			sref: 'event.casosdeexito',
			icon: 'g',
			text: 'Casos de éxito'
		},*/
		{
			sref: 'event.casosdeexito',
			icon: 'g',
			text: 'Mis ideas'
		},
		{
			sref: 'event.actividad',
			icon: 'K',
			text: 'Actividad'
		},
		{
			sref: 'event.usuariostop',
			icon: 'I',
			text: 'Usuarios top'
		},
		{
			sref: 'event.cocreacion',
			icon: 'j',
			text: 'Co-creación'
		},
		{
			sref: 'event.networking',
			icon: 'y',
			text: 'Networking'
		},
		{
			sref: 'event.encuesta',
			icon: 'p',
			text: 'Encuesta'
		},
		{
			sref: 'event.interactua',
			icon: 's',
			text: 'Interactúa'
		},
		{
			sref: 'event.ayuda',
			icon: 'e',
			text: 'Ayuda y términos'
		},
		{
			sref: 'logout',
			icon: 'B',
			text: 'Cerrar sesión'
		},
	];

	if(type === 'ex' || type === 'ex-cli'){
		$scope.menuItems.splice(9, 1)
	}

	$scope.action = function(item){
		if(item.sref === 'logout'){
			$ionicPopup.confirm({
				title: item.text,
				template: messages('logout_message'),
				buttons: [{
					text: 'No',
					type: 'button-default'
					}, {
					text: 'Sí',
					type: 'button-positive',
					onTap: function(e) {
						$timeout(function () {
							$ionicHistory.clearCache();
							$ionicHistory.clearHistory();
							session('delete_all');
							$state.go('intro');
				      	},300);
				      	PushNotificationDevice.close();
					}
				}]
			});
		}
		else{
			$state.go(item.sref);
		}
	}

	$rootScope.checkNotification = function(n){
		for(var i = 0; i< $rootScope.notifications.length; i++){
			if(n.id === $rootScope.notifications[i].id){
				return false;
			}
		}
		return true;
	}

	$rootScope.getNotifications = function(){
		var url = '/notification/all/' + localStorage.currentEvent + "/1";
		ajax({
			endpoint : url,
			loading : false,
			signHmac : true,
			success : function(data){
				if(data.length === 0){
					$rootScope.notifications.page = 0;
					return;
				}
				data.forEach(function(n){
					if($rootScope.checkNotification(n)){
						$rootScope.notifications.splice(0, 0, n);
					}
				})
				$rootScope.notifications.read = 0;
				$rootScope.notifications.forEach(function(n){
					if(n.is_read === 0){
						$rootScope.notifications.read++;
					}
				})
			},
			error : function(){
				$rootScope.notifications.page = 0;
			}
		})
	}

	$rootScope.startListeningNotification = function() {
		// activate listening notification
		try{
			var delay = JSON.parse(localStorage.config).ajax_notification_delay * 1000;
			$scope.interval = $interval($rootScope.getNotifications, delay);
		}catch(e){
			$scope.interval = $interval($rootScope.getNotifications, 15000);
		}
	}

	$scope.$on('$destroy', function() {
		$interval.cancel($scope.interval);
	});
})
