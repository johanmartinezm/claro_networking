//  ajax.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.factory('cachedImage', function($ionicLoading, $http, ajax){

	return function(options){
		var f = function(){};
		var tmp = {};
		if(options.image){
			tmp.image = options.image;
			options.data = [tmp];
		}
		options.complete = options.complete || f;
		options.error = options.error || f;
		options.data = options.data || [];
		if(options.signHmac === undefined) options.signHmac = true;
		if(options.loading === undefined) options.loading = true;
		options.find = options.find || function(e){
			return e.image;
		};
		options.set = options.set || function(e, value){
			e.image = value;
		};

		var i = 0;
		var limit = options.data.length;
		var cacheDir = null;
		try{
			cacheDir = cordova.file.externalCacheDirectory || cordova.file.cacheDirectory;
		}catch(e){}

		var next = function(){
			i++;
			if(i >= limit){
				$ionicLoading.hide();
				if(options.image) options.complete(tmp.image);
				else options.complete(options.data);
			}
		}

		var processImages = function(dirEntry){
			options.data.forEach(function(element){
				var path = options.find(element);
				if(!path) return next();
				var filename = path.replace(/\//g, '_');
				var contentType = 'image/' + filename.split('.')[1].toLowerCase();
				if(dirEntry){
					window.resolveLocalFileSystemURL(cacheDir + filename, function(fileEntry){
						//Aquí traemos la imagen cacheada
						fileEntry.file(function (file) {
							var reader = new FileReader();

							reader.onloadend = function() {
								var blob = new Blob([new Uint8Array(this.result)], { type: contentType });
								var fileURL = URL.createObjectURL(blob);
								options.set(element, fileURL);
								element.file = cacheDir + filename;
								next();
							};

							reader.readAsArrayBuffer(file);

						}, options.error);
					}, function(){
						// Aquí descargamos la imagen y la cacheamos
						downloadImage(path, element, contentType,function(file){
							dirEntry.getFile(filename, { create: true, exclusive: false }, function (fileEntry) {
								fileEntry.createWriter(function (fileWriter) {
									fileWriter.onerror = options.error;
									fileWriter.write(file);
									element.file = cacheDir + filename;
									next();
								});
							}, options.error);	
						})
					});
				}
				else{
					downloadImage(path, element, contentType)
				}
			})
		}

		var downloadImage = function(filename, element, contentType, success){
			var subpath = '/media/';
			if(!options.signHmac) subpath = '/media/public/';
			ajax({
				endpoint : subpath + filename,
				responseType : 'arraybuffer',
				signHmac : options.signHmac,
				loading : options.loading,
				success : function(data){
					var file = new Blob([data], {type: contentType});
					var fileURL = URL.createObjectURL(file);
					options.set(element, fileURL);
					if(success) success(file);
					else next();
				},
				error : next
			})
		}

		if(options.loading) $ionicLoading.show();
		if(cacheDir){
			window.resolveLocalFileSystemURL(cacheDir, function (dirEntry) {
				processImages(dirEntry);
			}, function(){
				processImages(null)
			});	
		}
		else{
			processImages(null);
		}
	}
})