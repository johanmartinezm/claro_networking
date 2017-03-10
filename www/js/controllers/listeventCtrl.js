

angular.module('app')

.controller('listeventCtrl', function($scope,$state,$cordovaCalendar) {


	$scope.createEvent = function() {
        $cordovaCalendar.createEvent({
            title: 'Space Race',
            location: 'The Moon',
            notes: 'Bring sandwiches',
            startDate: new Date(2017, 2, 15, 0, 0, 0, 0, 0),
            endDate: new Date(2017, 2, 16, 12, 0, 0, 0, 0)
        }).then(function (result) {
            console.log("Event created successfully");
        }, function (err) {
            console.error("There was an error: " + err);
        });
    }

    $scope.inEvent = function() {
    	$state.go('event.home');    	
    }

		
  
	
})