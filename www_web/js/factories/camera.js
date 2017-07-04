//  camera.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.factory('camera', ['$http', '$ionicLoading', function($http, $ionicLoading){
    
	var createBlob = function(file, next, filename){
		file = file.split('?')[0];
		window.resolveLocalFileSystemURL(file, function(fileEntry){
            fileEntry.file(function (f) {
                var reader = new FileReader();

                reader.onloadend = function() {
                	var splits = file.split('.');
                    var contentType = 'image/' + splits[splits.length -1].toLowerCase();
                    var blob = new Blob([new Uint8Array(this.result)], { type: contentType });
                    next(blob, URL.createObjectURL(blob), filename.split('/').pop())
                };

                reader.readAsArrayBuffer(f);

            }, console.error.bind(console));
        })
	}

    return {
    	take : function(next){
    		$ionicLoading.show();
			navigator.camera.getPicture(function(file){
				file = file.split('?')[0];
				plugins.crop(function (file2) {
					createBlob(file2, next, file);
					$ionicLoading.hide()
				}, function () {
					$ionicLoading.hide()
				}, file, {})
			}, function(){
				$ionicLoading.hide()
			}, {
				//quality 			: 75,
				destinationType 	: Camera.DestinationType.FILE_URI,
				sourceType 			: Camera.PictureSourceType.CAMERA,
				//allowEdit 			: true,
				//encodingType 		: Camera.EncodingType.JPEG,
				targetWidth 		: 1024,
				targetHeight 		: 1024,
				correctOrientation 	: true,
				saveToPhotoAlbum 	: true
			});
		},

		// Se elige una imagen de la galería
		gallery : function(next){
			$ionicLoading.show();
			navigator.camera.getPicture(function(file){
				file = file.split('?')[0];
				plugins.crop(function success (file2) {
					createBlob(file2, next, file);
					$ionicLoading.hide()
				}, function fail () {
					$ionicLoading.hide()
				}, file, {})
			}, function(){
				$ionicLoading.hide()
			}, {
				//quality				: 75,
				destinationType 	: Camera.DestinationType.FILE_URI,
				sourceType 			: Camera.PictureSourceType.PHOTOLIBRARY,
				//allowEdit 			: true,
				//encodingType 		: Camera.EncodingType.JPEG,
				targetWidth 		: 1024,
				targetHeight 		: 1024,
				correctOrientation 	: true,
				saveToPhotoAlbum 	: true
			});
		}
    }
}])