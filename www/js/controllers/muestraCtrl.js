//  ayudaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('muestraCtrl', function($scope, $state,ajax, messages, $ionicModal,$ionicPopup) {
  $scope.text = messages('muestra_text');
  

  $scope.groups = [];

  var muestra = JSON.parse(localStorage.muestra || '[]');
  var muestra_visited = JSON.parse(localStorage.muestra_visited || '[]');



  ajax({
    endpoint : '/muestra/all/' + localStorage.currentEvent || 0,
    signHmac : true,
    showError : true,
    success : function(data){
      //console.log(data);

      $scope.groups = data;

      angular.forEach(data, function(value, key) {
        value.interes = false;
        value.codevalid = false;


        if(muestra.indexOf(value.id) !== -1){
          value.interes = true;
        }


        if(muestra_visited.indexOf(value.id) !== -1){
          value.codevalid = true;
        }

      });
      
    }
  })

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.valid = function(item){

    if( !item.code_valid || item.code_valid == '' ){
      $ionicPopup.alert({
          template: messages('muestra_interes_code_error')
      });
    }else{

     

      if(item.code == item.code_valid){

        item.codevalid = true;
        muestra_visited.push(item.id);
        localStorage.muestra_visited = JSON.stringify(muestra_visited);


        data_ = {
          "__id": parseInt(localStorage.identify) || 0,
          "event": parseInt(localStorage.currentEvent) || 0,
          "id_item": item.id,
          "puntaje": item.puntaje,      
         
        };

        ajax({
          endpoint : '/muestra/add_score',
          showSuccess : false,
          loading : false,
          data: data_,
          method: 'post',
          success: function(data_resp){

            $ionicPopup.alert({
                template: messages(data_resp.message)
            });

          }

        });


      }else{
         $ionicPopup.alert({
            template: messages('muestra_interes_code_error')
        });
      }

      /*data_ = {
        "id_item": item.id,
        "code_valid": item.code_valid,      
       
      };

      ajax({
        endpoint : '/muestra/valid_code',
        showSuccess : false,
        loading : false,
        data: data_,
        method: 'post',
        success: function(data_resp){

          console.log(data_resp)


        }

      });*/

    }

    

  }

  $scope.interesado = function($group) {

    var data_ = [];

    data_ = {
      "__id": parseInt(localStorage.identify) || 0,
      "item_id": $group.id,      
      "event_id": parseInt(localStorage.currentEvent) || 0
    };
   
    ajax({
      endpoint : '/muestra/save-interes',
      showSuccess : false,
      loading : false,
      data: data_,
      method: 'post',
      success: function(data_resp){

        //console.log(data_resp);
        if(data_resp.status == 'ok'){

          $group.interes = true;

          muestra.push($group.id);
          localStorage.muestra = JSON.stringify(muestra);
          

          $ionicPopup.alert({
              template: messages(data_resp.message)
          });

          //console.log($group);

          
          
        }else{

          $ionicPopup.alert({
              template: messages(data_resp.message)
          });
        }
      }
    });



  };
  

})