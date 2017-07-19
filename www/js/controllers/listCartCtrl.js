
angular.module('app')

.controller('listCartCtrl', function($scope, $state, $stateParams, messages, ajax, $ionicPopup) {

	$scope.total = 0;
	$scope.total_cant = 0;
	$scope.emptyCart = true;	


	if(localStorage.cart){

		$scope.cart =  JSON.parse(localStorage.cart);

		if($scope.cart.length > 0 ){

			$scope.total = 0;
			$scope.total_cant = 0;
			
			$scope.emptyCart = false;			

			$scope.products = JSON.parse(localStorage.cart);	
			angular.forEach($scope.products, function(value, key) {

				$scope.total += parseInt(value.valor) * parseInt(value.cantidad);

				$scope.total_cant += value.cantidad;
			  	
			});
		}
	}

	

	$scope.removeItem = function ($index){

		$scope.products.splice($index,1);

		$ionicPopup.alert({
	        template: messages('list_product_remove')
	    });

	    localStorage.cart = JSON.stringify($scope.products);

	    if($scope.products.length == 0){

	    	//$state.go('event.listcategory');
	    	$scope.emptyCart = true;

	    }else{

	    	$scope.total = 0;
			$scope.total_cant = 0;

			angular.forEach($scope.products, function(value, key) {

				$scope.total += parseInt(value.valor) * parseInt(value.cantidad);

				$scope.total_cant += value.cantidad;
			  	
			});
	    }

		//console.log($scope.products); 

	}

	$scope.volver = function(){
		$state.go('event.listcategory')
	}


	$scope.addOrder = function (){

		var data_ = [];

		data_.push({
			"__id": parseInt(localStorage.identify) || 0,
			"products": $scope.products,
			"total": $scope.total,
			"event": parseInt(localStorage.currentEvent) || 0
		});

		var popup  = $ionicPopup.alert({
	        template:  messages('loading_creating_order'),
	        buttons:[]
	    });

							

		ajax({
			endpoint : '/list/add-order',
			signHmac : true,
			showSuccess : false,
			loading : false,
			data: data_,
			method: 'post',
			success: function(data_resp){

				//console.log(data_resp);
				if(data_resp.status == 'ok'){
					//$scope.questions = [];
					// cambiar el mensaje por uno dinámico como messages('message_from_json')
					//console.log(item.lead_id+'--'+item.response);
					localStorage.cart = '';
					$scope.cart = '';

					popup.close();

					$ionicPopup.alert({
				        template: messages(data_resp.message)
				    });

				    $state.go('event.listcategory');
					//ok = true;
					
				}else{
					$ionicPopup.alert({
				        template: messages(data_resp.message)
				    });
				}
			}
		});
			
			


		
	} 

	
	
})
