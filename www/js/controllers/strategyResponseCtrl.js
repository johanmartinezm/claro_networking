//  logisticaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('strategyResponseCtrl', function($scope, $state,messages, ajax, cachedImage,$ionicModal,$ionicPopup) {

    $scope.category = JSON.parse(localStorage.currentStrategyCat); 

    $scope.codes = JSON.parse(localStorage.stategy_code);

    console.log($scope.codes);

    $scope.text_code = messages('strategy_copy_code'); 
    $scope.val_code = false;

    $scope.response = {
        response_1: 0 ,
        response_2: 0 
    }

    
    ajax({
        endpoint : '/strategy/answer/' + $scope.category.id_category,
        showError: true,
        signHmac : true,
        loading: true,
        success : function(data){
            //console.log(data);
            var items = {};
            $scope.items = [];

            
            data.forEach(function(e){

                ajax({
                    endpoint : '/strategy/response/'+ e.id_pregunta,
                    showError: true,
                    signHmac : true,
                    success : function(response){
                        //console.log(response);

                        var answer = {
                            id_pregunta : e.id_pregunta,
                            titule : e.texto,
                            respon : []
                        }


                        response.forEach(function(item){

                            answer.respon.push(item);

                        });


                        //answer.respon.push(response); 
                        $scope.items.push(answer);
                        //console.log($scope.items);
                        
                    },
                    error: function(e){console.log("error ;DD")}
                })

            });             

        },
        error: function(e){console.log("error ;DD")}
    });


    $scope.openCont = function(){


        var error = null;

        //console.log($scope.items[0].response);

        if(typeof $scope.items[0].response === 'undefined'){

            error = 'strategy_response_error';

        }
                
        if(error){
            $ionicPopup.alert({
                template: messages(error)
            });
            return;
        }


        $('#cont_0').addClass('cont_last');
        $('#cont_1').removeClass('cont_last');

        //angular.element();

        

    };



    $scope.saveResponse = function(){

        //console.log($scope.items);

         var error = null;

        if(typeof $scope.items[1].response === 'undefined'){

            error = 'strategy_response_error';

        }
                
        if(error){
            $ionicPopup.alert({
                template: messages(error)
            });
            return;
        }

        //console.log($scope.items);

        $scope.items.forEach(function(item){


            var dats = {
                event: localStorage.currentEvent,
                id_resp: item.response,
                __id: localStorage.identify,
                category: $scope.category.id_category,
                id_pregunta: item.id_pregunta,
                response_value : 0

            }


            item.respon.forEach(function(resp){
                if(resp.id_repuestas == item.response){
                    dats.response_value = resp.valor;
                }
            });
            

            //console.log(dats);

             ajax({
                endpoint : '/strategy/user-response',
                signHmac : true,
                showSuccess : false,
                data: dats,
                method: 'post',
                success: function(data_resp){

                    
                },
                error: function(e){console.log("error ;DD")}
            });

        })


        $ionicPopup.alert({
            template: messages('strategy_save_ok')
        });


        $state.go('event.strategy');   
  
        

    };


    $scope.validateCode = function(){

        $code = $scope.code_startegy;

        console.log($code);

        if($code === null || $code === undefined){

            $ionicPopup.alert({
                template: messages('strategy_error_code')
            });
        

        }else{


            if($scope.category.id_category ==1){

                if ($code == $scope.codes.eficiencia) {

                    $scope.val_code = true;
                }else{
                    $ionicPopup.alert({
                        template: messages('strategy_error_code')
                    });
                }
            }


            if($scope.category.id_category ==2){

                if ($code == $scope.codes.crecimiento) {

                    $scope.val_code = true;
                }else{
                    $ionicPopup.alert({
                        template: messages('strategy_error_code')
                    });
                }
            }


            if($scope.category.id_category ==3){

                if ($code == $scope.codes.servicio) {

                    $scope.val_code = true;
                }else{
                    $ionicPopup.alert({
                        template: messages('strategy_error_code')
                    });
                }
            }


            if($scope.category.id_category ==4){

                if ($code == $scope.codes.ventas) {

                    $scope.val_code = true;
                }else{
                    $ionicPopup.alert({
                        template: messages('strategy_error_code')
                    });
                }
            }
        }


    };

	
})
