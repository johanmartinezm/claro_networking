//  notificacionesCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('notificacionesCtrl', function($scope, $state, $rootScope, $interval , ajax, $rootScope, $timeout, messages) {

	$scope.items = $rootScope.notifications;
	$scope.noNotifications = messages('no_notification')
	var countIntervals = 0;

	var blink = function(){
		if(countIntervals !== 0)return;
		var paint = function(color){
			$scope.items.forEach(function(i){
				if(i.is_read === 0){
					i.color = color
				}
			})
		}

		var interval = $interval(function(){
			countIntervals++;
			if(countIntervals === 6){
				$interval.cancel(interval);
				paint('gray');
				markRead();
				countIntervals = 0;
				return;
			}
			if(countIntervals % 2 === 1) paint('red');
			else paint('gray');

		}, 500);
	}

	var markRead = function(){
		var ids = [];
		$scope.items.forEach(function(i){
			if(i.is_read === 0){
				i.is_read = 1;
				ids.push(i.id);
			}
		});
		if(ids.length === 0)return;
		ajax({
			endpoint : '/notification/mark',
			method : 'POST',
			data : {
				notifications : '[' + ids.join(',') + ']'
			},
			loading : false,
			signHmac : true,
			success : function(){
				$rootScope.notifications.read = 0;
			}
		})
	}


	$timeout(blink, 1000);

	var getNotifications = function(){
		ajax({
			endpoint : '/notification/all/'+ $rootScope.notifications.page,
			loading : false,
			signHmac : true,
			success : function(data){
				if(data.length === 0){
					$scope.stop = true;
					return;
				}
				data.forEach(function(n){
					if($rootScope.checkNotification(n)){
						$rootScope.notifications.push(n);
					}
				})
				$rootScope.notifications.read = 0;
				$rootScope.notifications.forEach(function(n){
					if(n.is_read === 0){
						$rootScope.notifications.read++;
					}
				})
				$rootScope.notifications.page++;
				blink();
			}
		})
	}

	$scope.scroll = function(){
		$timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			getNotifications();
		}, 1000);
	}

	$scope.refresh = function(){
		$timeout(function() {
			$rootScope.getNotifications();
		}, 1000);
		$scope.$broadcast('scroll.refreshComplete');
	}

	var watch = $rootScope.$watch('notifications.length', blink);
	$scope.$on('$destroy', watch);
})