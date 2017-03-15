//  ajax.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.factory('ajax', function($http, $ionicPopup, $ionicLoading,messages){
    var online = navigator.onLine;
    var urlServices = 'http://eventosclaro.com.co/claro_eventos/public/api/v1';
    urlServices = localStorage.urlServices || urlServices;
    localStorage.urlServices = urlServices;

    document.addEventListener("offline", function(){
        online = false;
    }, false);
    document.addEventListener("online", function(){
        online = true;
    }, false);

    var validateOptions = function(options){
        var f = function(){};
        options.success = options.success || f;
        options.error = options.error || f;
        options.complete = options.complete || f;
        options.method = options.method || 'GET';
        options.responseType = options.responseType || 'json';
        options.data = options.data || {};
        options.headers = options.headers || {};
        if(options.loading === undefined) options.loading = true;
        if(localStorage.LoginAttempt){
            options.headers.LoginAttempt = localStorage.LoginAttempt;
        }
        if(localStorage.token){
            options.headers.Token = localStorage.token;
        }
        options.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    var signHmac = function(options){
      var url = urlServices + options.endpoint;
      var nonce = Math.random().toString(20).substring();
      var postMD5 = CryptoJS.MD5(JSON.stringify(options.data)).toString();
      var data = [options.method, url, localStorage.identify, nonce, postMD5].join('');
      var sign = CryptoJS.MD5(localStorage.identify+localStorage.password).toString();
      var hmac = CryptoJS.HmacSHA256(data, sign).toString();
      var digest = btoa(hmac);
      options.headers['Authentication'] = [localStorage.identify, nonce, digest, postMD5].join(':');
      options.headers['Timestamp'] =  Date.now() / 1000 | 0;
    }

    var request = function(options){
        online = navigator.onLine
        var controlledError = function (data, response) {
            $ionicLoading.hide();
            if(options.showError){
                var errorMessage = 'Para vivir la experiencia se requiere conexión a internet.';
                try{
                    errorMessage = data.message || errorMessage;
                }catch(e){}

                $ionicPopup.alert({
                    template: messages(errorMessage)
                });
            }
            options.error.apply({}, [].slice.call(arguments));
        }

        if(online && navigator.onLine){
            if(options.loading) $ionicLoading.show();
            var params = {
                method: options.method,
                url: urlServices + options.endpoint,
                data : options.data,
                headers : options.headers,
                responseType : options.responseType
            };
            if(options.file){
                var fd = new FormData();
                fd.append(options.fileKey || 'file', options.file);
                for(var attr in options.data){
                    fd.append(attr, options.data[attr]);
                }
                params.data = fd;
                params.transformRequest = angular.identity;
                options.headers['Content-Type'] = undefined;
            }
            $http(params).then(function(response){
                $ionicLoading.hide();
                if(response.data.status === 'error'){
                    return controlledError.apply({}, [response.data, response]);
                }
                if(options.showSuccess && response.data.message){
                    $ionicPopup.alert({
                        template: messages(response.data.message)
                    });
                }
                options.success.apply({}, [response.data, response]);
            }, controlledError);
        }
        else{
            if(options.showError){
                var key = 'no_internet_connection';
                var template = messages(key);
                if(key === template){
                    template = 'Verifica tu conexión a internet.';
                }
                $ionicPopup.alert({
                    template: template
                });
            }
            options.error.apply({}, [{}]);
        }
    }

    return function(options){
      validateOptions(options);
      if(options.signHmac) signHmac(options);
      request(options);
    }
})
