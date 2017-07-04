
angular.module('app')

.controller('listProductsCtrl', function($scope, $state, $stateParams, messages, ajax, cachedImage, $ionicPopup) {

	var id = parseInt($stateParams.id);

	$scope.category_info = [];

	$scope.item = [];




	ajax({
		endpoint : '/list/category_info/' + id,
		signHmac : true,
		showError : true,
		success : function(data){

			$scope.category_info = data;
		}
	})



	ajax({
		endpoint : '/list/product/' + id,
		signHmac : true,
		showError : true,
		success : function(data){

			$scope.item = data;

			angular.forEach($scope.item, function(value, key) {
			  value.cantidad = 1;
			});
		}
	});

	$scope.updateCant = function(item,type){

		if(type == '-'){

			if( item.cantidad > 1){
				item.cantidad = item.cantidad - 1;	
			} else{
				item.cantidad = 1;
			}
			
		}else{

			if( item.cantidad < localStorage.max_cant_prod){
				item.cantidad = item.cantidad + 1;
			}
				
		}
			

	}

	cart = [];

	$scope.addCart = function(item){

		$scope.addok = false;

		if( typeof localStorage.cart  != "undefined" ){
			cart = JSON.parse(localStorage.cart);
		
			angular.forEach(cart, function(value, key) {
				  
				  if(value.id_product == item.id_product){
				  	value.cantidad = item.cantidad;
				  	$scope.addok = true;
				  }
			});


			if ($scope.addok == false) {

				cart.push({
					"name" : item.name,
					"category_name": $scope.category_info.name,
					"category_id": id,
					"id_product": item.id_product,
					"cantidad" : item.cantidad,
					"valor": item.valor,
						
				});
			}




		}else{
			
			cart.push({
				"name" : item.name,
				"category_name": $scope.category_info.name,
				"category_id": id,
				"id_product": item.id_product,
				"cantidad" : item.cantidad,
				"valor": item.valor,
					
			});
		}
		

		$ionicPopup.alert({
	        template: messages('list_product_add')
	    });

		

		localStorage.cart = JSON.stringify(cart);
	}


	$scope.listCart = function(){
		$state.go('event.listCart')
	}
	
})
