


angular.module("app")

.factory("PushNotificationDevice", function ($rootScope,$ionicPopup, ajax) {
	var device = null;
	var platform = null;
	

	var push = {
		
		init : function(){		

	        window.FirebasePlugin.grantPermission(); 
	        window.FirebasePlugin.subscribe("claro-networking");
	        window.FirebasePlugin.getToken(function(token) {
	                // save this server-side and use it to push notifications to this device
	                //console.log(token);
	                //push.sendServer(token, platform);
	                $rootScope.device_id = token;
	            }, function(error) {
	                console.error(error);
            });

		},
		close : function(){

			window.FirebasePlugin.unsubscribe("claro-networking");

		},
		sendServer : function(){

			platform = window.device.platform.toLowerCase();


			if(! $rootScope.device_id) return;
			ajax({
				endpoint : '/user/set-device',
				data : {
					type_device : platform,
					device_id : $rootScope.device_id
				},
				method : 'POST',
				signHmac : true,
				loading : false
			})
		}


	};
	
	return push;

	
});