//  session.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.factory('session', function(){
    var session;
    var backup;

    return function(key){
    	if(key === 'delete_all'){
    		delete localStorage.session;
    		delete localStorage.password;
    		delete localStorage.identify;
    		delete localStorage.token;
    		return;
    	}
        if(session){
            if(backup !== localStorage.session){
                session = JSON.parse(localStorage.session);
                backup = localStorage.session;     
            }
        }
        else{
    	   session = JSON.parse(localStorage.session);
           backup = localStorage.session;
        }
    	if(key === 'all') return session;
    	return session[key]
    }
})