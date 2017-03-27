//  sideMenuCtrlCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('rootCtrl', function($scope,$location, $state, session, messages, $ionicPopup, camera, $ionicHistory, $timeout, ajax, $rootScope, $interval, PushNotificationDevice) {

	var type = session('user_type');
	$rootScope.notifications = [];
	$rootScope.notifications.page = 1;
	$scope.notifications = $rootScope.notifications;

	/*$scope.menuItems = [
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
			icon: 'S',
			text: 'Información'
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
		},
		{
			sref: 'event.casosdeexito',
			icon: 'Q',
			text: 'Mis ideas'
		},
		{
			sref: 'event.actividad',
			icon: 'K',
			text: 'Memorias y Actividad'
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
			text: 'Su opinión'
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
	];*/

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
			$state.go(item.sref,{'name_seccion':item.text});
		}
	}

	
})
