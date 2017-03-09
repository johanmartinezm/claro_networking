//  messages.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.factory('messages', function(){
    var config;

    return function(tag){
    	config = config || JSON.parse(localStorage.config)
    	for (var i =0; i<config.message_copies.length;i++){
    		if(config.message_copies[i].tag === tag){
    			return config.message_copies[i].message;
    		}
    	}
    	return tag;
    }
})