angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('intro', {
    url: '/intro',
    cache: false,
    templateUrl: 'templates/intro.html',
    controller: 'introCtrl'
  })

  .state('event.home', {
    url: '/home',
    cache: false,
    views: {
      'side-menu': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('register', {
    
    url: '/register',
    cache: false,
    templateUrl: 'templates/register.html',
    controller: 'registerCtrl'

   
  })

  .state('event.agenda', {
    url: '/agenda',
    views: {
      'side-menu': {
        templateUrl: 'templates/agenda.html',
        controller: 'agendaCtrl'
      }
    }
  })

  .state('event.conferencistas', {
    url: '/conferencistas',
    views: {
      'side-menu': {
        templateUrl: 'templates/conferencistas.html',
        controller: 'conferencistasCtrl'
      }
    }
  })

  .state('event.conferencista', {
    url: '/conferencista/:id',
    views: {
      'side-menu': {
        templateUrl: 'templates/conferencista.html',
        controller: 'conferencistaCtrl'
      }
    }
  })

  .state('event.perfil', {
    url: '/perfil',
    views: {
      'side-menu': {
        templateUrl: 'templates/perfil.html',
        controller: 'perfilCtrl'
      }
    }
  })

  .state('event.logistica', {
    url: '/logistica',
    views: {
      'side-menu': {
        templateUrl: 'templates/logistica.html',
        controller: 'logisticaCtrl'
      }
    }
  })

  .state('event.informacion', {
    url: '/informacion',
    views: {
      'side-menu': {
        templateUrl: 'templates/informacion.html',
        controller: 'informacionCtrl'
      }
    }
  })

  .state('event.entrada', {
    url: '/entrada',
    views: {
      'side-menu': {
        templateUrl: 'templates/entrada.html',
        controller: 'entradaCtrl'
      }
    }
  })

  .state('event.notificaciones', {
    url: '/notificaciones',
    cache: false,
    views: {
      'side-menu': {
        templateUrl: 'templates/notificaciones.html',
        controller: 'notificacionesCtrl'
      }
    }
  })

  .state('event.casosdeexito', {
    url: '/casosdeexito',
    params: {
      'name_seccion': null
    },
    views: {
      'side-menu': {
        templateUrl: 'templates/casosdeexito.html',
        controller: 'casosdeexitoCtrl'
      }
    }
  })

  .state('event.usuariostop', {
    url: '/usuariostop',
    views: {
      'side-menu': {
        templateUrl: 'templates/usuariostop.html',
        controller: 'usuariostopCtrl'
      }
    }
  })

  .state('event.cocreacion', {
    url: '/cocreacion',
    views: {
      'side-menu': {
        templateUrl: 'templates/cocreacion.html',
        controller: 'cocreacionCtrl'
      }
    }
  })

  .state('event.networking', {
    url: '/networking',
    views: {
      'side-menu': {
        templateUrl: 'templates/networking.html',
        controller: 'networkingCtrl'
      }
    }
  })

  .state('event.ayuda', {
    url: '/ayuda',
    views: {
      'side-menu': {
        templateUrl: 'templates/ayuda.html',
        controller: 'ayudaCtrl'
      }
    }
  })

  .state('event.encuesta', {
    cache: false,
    url: '/encuesta',
    views: {
      'side-menu': {
        templateUrl: 'templates/encuesta.html',
        controller: 'encuestaCtrl'
      }
    }
  })

  .state('event.interactua', {
    url: '/interactua',
    views: {
      'side-menu': {
        templateUrl: 'templates/interactua.html',
        controller: 'interactuaCtrl'
      }
    }
  })
  
  .state('event.actividad', {
    url: '/actividad',
    views: {
      'side-menu': {
        templateUrl: 'templates/actividad.html',
        controller: 'actividadCtrl'
      }
    }
  })

  .state('event.list', {
    url: '/list',
    views: {
      'side-menu': {
        templateUrl: 'templates/listevent.html',
        controller: 'listeventCtrl'
      }
    }
    
  })  


  .state('event.strategy', {
    url: '/strategy',
    cache: false,
    views: {
      'side-menu': {
        templateUrl: 'templates/strategy.html',
        controller: 'strategyCtrl'
      }
    }
  })

  .state('event.strategy_response', {
    url: '/strategy_response',
    views: {
      'side-menu': {
        templateUrl: 'templates/strategy_response.html',
        controller: 'strategyResponseCtrl'
      }
    }
  })


  .state('event.listcategory', {
    url: '/listcategory',
<<<<<<< HEAD
    cache: false,
=======
>>>>>>> 7dea7a2967806a31658da27cb5608634b685926f
    views: {
      'side-menu': {
        templateUrl: 'templates/listcategory.html',
        controller: 'listCategoryCtrl'
      }
    }
  })

  .state('event.listproducts', {
    url: '/listproducts/:id',
<<<<<<< HEAD
    cache: false,
=======
>>>>>>> 7dea7a2967806a31658da27cb5608634b685926f
    views: {
      'side-menu': {
        templateUrl: 'templates/listproducts.html',
        controller: 'listProductsCtrl'
      }
    }
  })


  .state('event.listCart', {
    url: '/listcart',
<<<<<<< HEAD
    cache: false,
=======
>>>>>>> 7dea7a2967806a31658da27cb5608634b685926f
    views: {
      'side-menu': {
        templateUrl: 'templates/listcart.html',
        controller: 'listCartCtrl'
      }
    }
  })  

<<<<<<< HEAD
  .state('event.retos', {
    url: '/retos',
    cache: false,
    views: {
      'side-menu': {
        templateUrl: 'templates/retos.html',
        controller: 'retosCtrl'
      }
    }
  })  

  .state('event.muestra', {
    url: '/muestra',
    cache: false,
    views: {
      'side-menu': {
        templateUrl: 'templates/muestra.html',
        controller: 'muestraCtrl'
      }
    }
  })  

=======
>>>>>>> 7dea7a2967806a31658da27cb5608634b685926f
  .state('event', {
    url: '/event',
    templateUrl: 'templates/side-menu.html',
    abstract:true,
    controller : 'rootCtrl'
  })

  if(localStorage.session){
    $urlRouterProvider.otherwise('/event/list')
  }
  else{
    $urlRouterProvider.otherwise('/intro')
  }
});
