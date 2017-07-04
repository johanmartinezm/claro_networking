//  logisticaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('strategyCtrl', function($scope, $state,messages, ajax, cachedImage,$ionicModal,$ionicPopup) {


	

    $scope.items = [];

	ajax({
        endpoint : '/strategy/category/'+localStorage.currentEvent+'/'+localStorage.identify,
        showError: true,
        signHmac : true,
		loading: true,
        success : function(data){
            //console.log(data);

            $scope.items = data;
			
        },
        error: function(e){console.log("error ;DD")}
    });

    


    $scope.total_porc = 0;

    ajax({
        endpoint : '/strategy/user-resp-sum/'+localStorage.currentEvent+'/'+localStorage.identify,
        showError: true,
        signHmac : true,
        loading: true,
        success : function(data){
            //console.log(data);

            $scope.num_res = data.num_resp.sum;

            data.sum_cat.forEach(function(item){  

                $scope.total_porc = $scope.total_porc + item.porcentaje;                    

            });      
            
        },
        error: function(e){console.log("error ;DD")}
    });



    $scope.responseCate = function(category) {

        //console.log(category);

    	localStorage.currentStrategyCat = JSON.stringify(category);

        //$scope.recordCat(category.id_category);

        ajax({
            endpoint : '/strategy/category-sum-resp/'+localStorage.currentEvent+'/'+category.id_category+'/'+localStorage.identify,
            showError: true,
            signHmac : true,
            loading: true,
            success : function(data){
                //console.log(data);

                //$scope.cant_pregu = data.sum;

                if(data.sum >= 2){
                    error = 'strategy_category_finish'
                    $ionicPopup.alert({
                        template: messages(error)
                    });
                }else{
                    $state.go('event.strategy_response');
                }

                

                //$scope.items = data;            
                
            },
            error: function(e){console.log("error ;DD")}
        });



        //var resp = $scope.CountCat(category.id_category);

        //console.log(resp);
    	//$state.go('event.strategy_response');

    }


    var recordCat = function(category){


        ajax({
            endpoint : '/strategy/category-sum/'+category+'/'+localStorage.identify,
            showError: true,
            signHmac : true,
            loading: true,
            success : function(data){
                //console.log(data);

                return data.sum;

                //$scope.items = data;            
                
            },
            error: function(e){console.log("error ;DD")}
        });




    }


    $scope.CountCat = function(category){


        ajax({
            endpoint : '/strategy/category-sum-resp/'+localStorage.currentEvent+'/'+category+'/'+localStorage.identify,
            showError: true,
            signHmac : true,
            loading: true,
            success : function(data){
                //console.log(data);

                return data.sum;

                //$scope.items = data;            
                
            },
            error: function(e){console.log("error ;DD")}
        });

    }

    
    

	
})
