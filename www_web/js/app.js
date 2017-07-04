angular.module('app', ['ionic', 'app.routes', 'app.services', 'app.directives', 'tabSlideBox', 'ionic.rating', 'monospaced.qrcode','ngCordova','mp.autoFocus'])

.run(function($ionicPlatform,$location, ajax, messages, $rootScope, $ionicPopup, PushNotificationDevice) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        // Google Analytics
        if(window.analytics) analytics.startTrackerWithId('UA-96323013-1');

        // PushNotification
        //PushNotificationDevice.init();

        // Busca la configuración
        ajax({
            endpoint : '/config/app_g_config',
            showError: true,
            success : function(data){
                localStorage.config = JSON.stringify(data);
                localStorage.bigSuccessForm = JSON.stringify(data.big_success_form);

                if(!window.cordova)return;
                cordova.getAppVersion.getVersionNumber().then(function (version) {
                    if($('body.platform-android').length){
                        if(version !== messages('app_version_android')){
                            /*$ionicPopup.alert({
                                template: messages('update_available_android')
                            });*/
                        }
                    }
                    if($('body.platform-ios').length){
                        if(version !== messages('app_version_ios')){
                            /*$ionicPopup.alert({
                                template: messages('update_available_ios '+localStorage.countdown )
                            });*/
                        }
                    }
                });
            },
            error: function(e){console.log("error ;DD")}
        });
    });

    $rootScope.$on('$stateChangeStart', function(e, to) {
        if(to.name.split('.')[0] === 'event' && !localStorage.session){
            e.preventDefault();
        }
        if(to.name === 'intro' && localStorage.session){
            e.preventDefault();
        }
        
        $rootScope.sec = true;

        if(to.name === 'event.list'){
        
            $rootScope.sec = false;
        }

        if(window.analytics) analytics.trackView(to.url);
    });
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
})

//Globales
window.regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

window.once = function(callback){
    var attempts = 0;
    return function(){
        if(attempts++ == 0) callback.apply(this, [].slice.call(arguments))
    }
}

moment.locale('en', {
    relativeTime : {
        future: "%s",
        past:   "%s",
        s:  "Ahora",
        m:  "1m",
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        d:  "1d",
        dd: "%dd",
        M:  "1 mes",
        MM: "%d meses",
        y:  "1 año",
        yy: "%d años"
    }
});
