//  sideMenuCtrlCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('homeCtrl', function($scope, $state, $rootScope) {
	$scope.notifications = $rootScope.notifications;
})