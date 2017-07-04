
angular.module('app')

.controller('listCartCtrl', function($scope, $state, $stateParams, messages, ajax, $ionicPopup) {

	$scope.products = JSON.parse(localStorage.cart);

	console.log($scope.products);

	$scope.total = 0;


	angular.forEach($scope.products, function(value, key) {

		$subtotal = value.value * value.cantidad;

	  	$scope.total = $scope.total + $subtotal;
	});


	$scope.removeItem = function ($index){

		$scope.products.splice($index,1);

		$ionicPopup.alert({
	        template: messages('list_product_remove')
	    });

		console.log($scope.products); 

	}


	$scope.addOrder = function (){


		
	} 

	
	
})
