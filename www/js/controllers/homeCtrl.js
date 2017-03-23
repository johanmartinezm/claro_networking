//  sideMenuCtrlCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('homeCtrl', function($scope, $state, $rootScope) {
	$scope.notifications = $rootScope.notifications;

    $scope.event_info = $rootScope.event;


	$scope.new_app = function(){

		if(device.platform === 'iOS') {
            scheme = 'clarora://';
            var url = 'https://appsto.re/co/Dte3cb.i';
        }
        else if(device.platform === 'Android') {
            scheme = 'com.claro.latam.idc.clarora';
            var url = 'https://play.google.com/store/apps/details?id=com.claro.latam.idc.clarora';
        }


        var sApp = startApp.set(scheme);
         
        appAvailability.check(
            scheme, // URI Scheme
            function() {  // Success callback
                //window.open('com.claro.clarotechsummit', '_system', 'location=no');
                sApp.start(function() { /* success */
				    //console.log("OK");
				}, function(error) { /* fail */
				    console.log(error);
				    
				});
                //console.log('Twitter is available'+scheme);

                
            },
            function() {  // Error callback
                
                //console.log('Twitter is not available');
                cordova.InAppBrowser.open(url,'_system');
            }
        );      

	}
})