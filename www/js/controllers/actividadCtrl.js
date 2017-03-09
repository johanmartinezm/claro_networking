//  agendaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('actividadCtrl', function($scope, $state, $ionicModal, ajax, cachedImage, $interval, $ionicScrollDelegate, session, camera, $ionicPopup, messages, $timeout) {
	var page = 0;
	var requesting = false;
	$scope.items = [];
	$scope.requestLength = 0;
	var updateTime = [];

	var newElements = function(a1, a2){
		var elements = [];
		for(var i=0;i < a2.length;i++){
			var control = false;
			for(var j=0;j<a1.length;j++){
				if(a1[j].id === a2[i].id){
					control = true;
				}
			}
			if(!control) elements.push(a2[i]);
		}
		if(elements.length) return elements;
		return false;
	}

	$scope.refresh = function(){
		$timeout(function() {
			$scope.loadContent('0');
		}, 1000);
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.scroll = function(){
		$timeout(function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.loadContent();
		}, 1000);
	}

	$scope.loadContent = function(p){
		if(requesting)return;
		requesting = true;
		ajax({
			endpoint : '/content/all/'+ (p || page),
			showError: true,
			signHmac : true,
			loading : page === 0,
			error : function(){
				requesting = false;
			},
			success : function(data){
				$scope.requestLength = data.length;
				if(data.length === 0){
					requesting = false;
					return;
				}
				if(p){
					data = newElements($scope.items, data)
					if(!data){
						requesting = false;
						$scope.$broadcast('scroll.refreshComplete');
						return;
					}
				}
				var images = [];
				data.forEach(function(p){
					images.push({image : p.pic, obj : p, type : 'post'});
					images.push({image : p.user_pic, obj : p, type : 'user'});
					p.share = p.legend || '';
					p.legend = p.share.replace(/(^|\s)(#[a-z\d-]+)/ig, '$1<span class="font-red">$2</span>');
					p.comments = [];
					p.openedComments = false;
				})
				cachedImage({
					data : images,
					loading : false,
					complete : function(images){
						images.forEach(function(i){
							if(i.type === 'post'){
								i.obj.pic = i.image;
								i.obj.file = i.file;
							}
							else i.obj.user_pic = i.image;
						});
						if(p === undefined){
							page++;
							$scope.items.push.apply($scope.items, data);
							updateTime.push.apply(updateTime, data);
							$scope.$broadcast('scroll.infiniteScrollComplete');
							$ionicScrollDelegate.resize()
						}
						else{
							for(var i=data.length-1;i>=0; i--){
								if($scope.items.indexOf(data[i]) === -1){
									$scope.items.unshift(data[i])
									updateTime.unshift(data[i])
								}
							}
							$scope.$broadcast('scroll.refreshComplete');
						}
						
						requesting = false;
					}
				})
			}
		});
	}

	$scope.$on('$stateChangeSuccess', function() {
		$scope.loadContent();
	});

	var interval = $interval(function(){
		if(!$scope.items) return;
		updateTime.forEach(function(p){
			p.time = moment(p.created_at, "YYYY-MM-DD HH:mm:ss").fromNow();
		})
	}, 1000);

	$scope.$on('$destroy', function() {
  		$interval.cancel(interval);
    });

    $scope.like = function(item){
    	if(item.liked) item.likes--;
    	else item.likes++;
    	item.liked = !item.liked;
    	ajax({
    		endpoint : '/content/like/'+ item.id,
    		signHmac : true,
    		loading : false
    	})
    }

	$ionicModal.fromTemplateUrl('modal-compartir.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function(item) {
		$scope.item = item;
		$scope.modal.show();
	};

	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	$scope.twitter = function(item){
		window.plugins.socialsharing.shareViaTwitter(item.share, item.file, null, function(result){
			ajax({
				endpoint : '/content/share/'+ item.id,
				signHmac : true,
				loading : false
			})
		}, function(){
			$ionicPopup.alert({
        template: messages('no_twitter')
      });
		})
	}

	$scope.facebook = function(item){
		window.plugins.socialsharing.shareViaFacebook(item.share, item.file, null, function(result){
			ajax({
				endpoint : '/content/share/'+ item.id,
				signHmac : true,
				loading : false
			})
		}, function(){
			$ionicPopup.alert({
        template: messages('no_facebook')
      });
		})
	}

	$scope.openComments = function(item){
		if(item.openedComments){
			item.openedComments = false;
		}
		else{
			item.openedComments = true;
			if(item.requesting) return;
			item.requesting = true;
			ajax({
				endpoint : '/content/comment/'+ item.id ,
				signHmac : true,
				loading : false,
				success : function(data){
					if(data.length === 0){
						item.requesting = false;
						return;
					}
					updateTime.push.apply(updateTime, data);
					item.comments = data;
					item.requesting = false;
				},
				error : function(){
					item.requesting = false;
				}
			})
		}
	}

	$scope.addComment = function(item){
		if(!item.message)return;
		var message = item.message;
		delete item.message
		ajax({
			endpoint : '/content/comment/add/'+ item.id,
			data : {
				comment : message
			},
			method : 'POST',
			signHmac : true,
			success : function(data){
				var comment = {
					id : data.id,
					comment : data.comment,
					user_names : data.user_names
				}
				if(item.openedComments || item.comments.length > 0){
					updateTime.push(comment);
					item.comments.unshift(comment);
				}
				item.total_comments++;
			}	
		})
	}

	$scope.newPost = function(){
		$scope.post = {text:messages('default_post_hashtag')};
		$ionicModal.fromTemplateUrl('modal-newpost.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.postModal = modal;
			modal.show();
		});

		$scope.closePost = function(){
			$scope.postModal.hide();
		}

		$scope.publish = function(){
			if(!$scope.post.text && !$scope.post.file){
				$ionicPopup.alert({
	                template: messages('invalid_post')
	            });
	            return;
			}

			ajax({
				endpoint : '/content/add',
				file : $scope.post.file,
				fileKey : 'pic',
				signHmac : true,
				method : 'POST',
				data : {
					legend : $scope.post.text || ''
				},
				success : function(data){
					$scope.loadContent('0');
					$scope.postModal.hide();
				}
			})
		}

		$scope.camera = function(){
			camera.take($scope.uploadFile);
		}
 
		$scope.gallery = function(){
			camera.gallery($scope.uploadFile)
		}

		$scope.uploadFile = function(file, url){
			$scope.post.file = file;
			$scope.post.image = url;
		}
	}
})