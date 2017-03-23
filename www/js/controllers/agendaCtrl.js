//  agendaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('agendaCtrl', function($scope, $state, ajax, session, cachedImage) {

	ajax({
		endpoint : '/agenda/all/' +  localStorage.currentEvent || 0,
		showError: true,
		signHmac : true,
		success : function(data){
			var items = {};

			var getHour = function(s){
				var hour = moment(s, 'YYYY-MM-DD HH:mm:ss').format('hh:mm a.')
				return hour.replace('m', '.m');
			}

			data.forEach(function(e){
				var day = items[e.day_name] || {
					titulo : e.day_name,
					agenda : []
				};
				day.agenda.push({
					fecha : getHour(e.event_start_at) +' - '+getHour(e.event_end_at),
					lugar : e.event_description,
					titulo : e.event_name
				})
				items[e.day_name] = day;
			})

			$scope.items = [];

			for (var day in items){
				$scope.items.push(items[day]);
			}
			$scope.agendaItems = $scope.items;
		}
	})
})
