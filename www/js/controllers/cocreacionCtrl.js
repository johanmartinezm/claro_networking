//  cocreacionCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('cocreacionCtrl', function($scope, $state, ajax, cachedImage, $ionicModal ,messages, camera, $ionicPopup) {

	$scope.post = {}
	$scope.maxHeight = ($(window).height() * 0.8) + 'px';

	var getAll = function(loading){
		ajax({
			endpoint : '/idea/all',
			signHmac : true,
			loading : loading,
			success : function(data){
				var images = [];
				data.forEach(function(e){
					if(e.pic){
						images.push({
							image : e.pic,
							type : 'idea',
							obj : e
						});
					}
					if(e.user_pic){
						images.push({
							image : e.user_pic,
							type : 'user',
							obj : e
						});	
					}
				})
				cachedImage({
					data : images,
					set : function(e, image){
						if(e.type === 'idea'){
							e.obj.image = image;
						}	
						else{
							e.obj.photo = image;
						}
					},
					complete : function(){
						$scope.all = data.map(function(i){
							return {
								id : i.id,
								img : i.photo,
								image : i.image,
								titulo : i.name,
								nombre : [i.user_name, i.user_lastname].join(' '),
								descripcion : i.description,
								solucion : i.solution,
								rating: {rate: i.rated || 0, max: 5},
								readonly : i.rated ? true : false,
	      						puntaje: i.total,
							}
						})
					}
				})
			}
		})
	}

	var getTop = function(loading){
		ajax({
			endpoint : '/idea/top',
			signHmac : true,
			loading : loading,
			success : function(data){
				var images = [];
				data.forEach(function(e){
					if(e.pic){
						images.push({
							image : e.pic,
							type : 'idea',
							obj : e
						});
					}
					if(e.user_pic){
						images.push({
							image : e.user_pic,
							type : 'user',
							obj : e
						});	
					}
				})
				cachedImage({
					data : images,
					set : function(e, image){
						if(e.type === 'idea'){
							e.obj.image = image;
						}	
						else{
							e.obj.photo = image;
						}
					},
					complete : function(){
						$scope.top = data.map(function(i){
							return {
								id : i.id,
								img : i.photo,
								image : i.image,
								titulo : i.name,
								nombre : [i.user_name, i.user_lastname].join(' '),
								descripcion : i.description,
								solucion : i.solution,
	      				puntaje: i.total,
							}
						})
					}
				})
			}
		})
	}

	getTop(true);
	getAll(true);

	$scope.rating = function(item){
		var copy = item.rating.rate;
		item.rating.rate = 0;
		$ionicPopup.confirm({
			title: item.text,
			template: messages('are_you_sure').replace('{$value}', copy),
			buttons: [{
				text: 'No',
				type: 'button-default'
				}, {
				text: 'Sí',
				type: 'button-positive',
				onTap: function(e) {
					item.rating.rate = copy;
					item.readonly = true
					ajax({
						endpoint : '/idea/rate/'+ item.id,
						method : 'POST',
						loading : false,
						signHmac : true,
						data : {
							value : item.rating.rate
						},
						success : function(){
							getTop();
						}
					})
				}
			}]
		});
	}

	$scope.photo = function(){
		$scope.message = messages('prompt_select_picture');
		$ionicModal.fromTemplateUrl('templates/prompt-picture-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.postModal = modal;
			modal.show();
		});

		$scope.closeModal = function(){
			$scope.postModal.hide();
		}

		$scope.camera = function(){
			camera.take($scope.uploadFile);
			$scope.closeModal();
		}
 
		$scope.gallery = function(){
			camera.gallery($scope.uploadFile)
			$scope.closeModal();
		}

		$scope.uploadFile = function(file, url, filename){
			$scope.$apply(function(){
				$scope.file = file;
				$scope.filename = filename;	
			})		
		}
	}

	$scope.publish = function(){
		var error = null;
		if(!$scope.post.solution) error = 'invalid_solution';
		if(!$scope.post.description) error = 'invalid_description';
		if(!$scope.post.name) error = 'invalid_title';
		if(error){
			$ionicPopup.alert({
				template: messages(error)
			});
			return;
		}

		ajax({
			endpoint : '/idea/add',
			file : $scope.file,
			fileKey : 'pic',
			signHmac : true,
			method : 'POST',
			data : $scope.post,
			showError : true,
			showSuccess : true,
			success : function(data){
				delete $scope.file;
				delete $scope.filename;
				$scope.post = {}
				getAll();
				getTop();
			}
		})
	}

	$scope.openDetail = function(which, item){
		var template = 'cocreacion-photo.html';
		if(which === 2) template = 'cocreacion-detail.html';
		$scope.item = item;
		$ionicModal.fromTemplateUrl(template, {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.detail = modal;
			modal.show();
		});

		$scope.closeDetail = function() {
			$scope.detail.hide();
		};
	}
})