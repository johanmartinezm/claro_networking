//  entradaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('entradaCtrl', function($scope, $state, session, messages) {
  
  $scope.entryTitle = messages('entry_title');
	$scope.code = session('friendly_code');
})