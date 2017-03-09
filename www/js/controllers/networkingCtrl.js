//  networkingCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('networkingCtrl', function($scope, $state, session, ajax, cachedImage, $ionicPopup, messages, $ionicModal) {

	$scope.networkingTitle = messages('networking_title');
	$scope.code = {
		qr : session('friendly_code')
	}

	var loadContacts = function(){
		ajax({
			endpoint : '/networking/all',
			showError: true,
			signHmac : true,
			success : function(data){
				if(data.length){
					cachedImage({
						data : data.map(function(c){
							return {
								id : c.contact_id || c.id,
								name : (c.contact_name || c.name),
								lastname : (c.contact_lastname || c.lastname),
								phone : c.contact_phone || c.phone,
								email : c.contact_email || c.email,
								company : c.contact_company || c.company,
								image : c.thumbnail
							}
						}),
						complete : function(data){
							$scope.networkingItems = data
						},
						error : console.error.bind(console)
					})
				}
			}
		})
	}

	loadContacts();

	//window.scope = $scope;

	$scope.addByCode = function(){
		if(!$scope.code.friend)return;
		ajax({
			endpoint : '/networking/add',
			data : {
				code : $scope.code.friend
			},
			method : 'POST',
			signHmac : true,
			showError : true,
			success : function(data){
				delete $scope.code.friend;
				loadContacts();
				$ionicPopup.alert({
	                template: messages('contact_success_added')
	            });
			}
		})
	}

	$scope.saveContact = function(c){
		var contact = navigator.contacts.create();
		contact.displayName = c.name +' '+ c.lastname;
		contact.nickname = c.name +' '+ c.lastname;
		if(c.phone) contact.phoneNumbers = [new ContactField('mobile', ''+c.phone, true)];
		if(c.email) contact.emails = [new ContactField('work', c.email, true)];
		if(c.company) contact.organizations = [new ContactOrganization(true, null, c.company)]
		if(c.file) contact.photos = [new ContactField('url', c.file,true)];
		contact.save(function(){
			console.log(arguments);
			$ionicPopup.alert({
                template: messages('contact_success_added_address')
            });
		}, function(){
			$ionicPopup.alert({
                template: messages('contact_error_added_address')
            });
		});
	}

	$scope.editContact = function(item){
		$scope.contact = {};
		for(var attr in item) $scope.contact[attr] = item[attr];
		$ionicModal.fromTemplateUrl('templates/edit-contact-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(modal) {
		    $scope.modal = modal;
		    modal.show();
		});
		  
		$scope.save = function(contact) {  
			var error = null;
			if(!contact.company) error = 'invalid_company';
			if(!contact.phone) error = 'invalid_phone';
			if(isNaN(contact.phone)) error = 'invalid_phone';
			if(!regexEmail.test(contact.email)) error = 'invalid_email';
			if(!contact.email) error = 'invalid_email';
			if(!contact.lastname) error = 'invalid_lastname';
			if(!contact.name) error = 'invalid_name';
			if(error){
				$ionicPopup.alert({
	                template: messages(error)
	            });
	            return;
			}

		    ajax({
		    	endpoint : '/networking/update/' + contact.id,
		    	signHmac : true,
		    	method : 'POST',
		    	data : {
					name : contact.name,
					lastname : contact.lastname,
					phone : contact.phone,
					email : contact.email,
					company : contact.company
				},
		    	showError : true,
		    	success : function(data){
		    		$ionicPopup.alert({
		                template: messages(data.message)
		            });
		            for(var attr in item) item[attr] = $scope.contact[attr];
		    		$scope.modal.hide();
		    	}
		    })
		 };
	}

	$scope.scanQr = function(){
		cordova.plugins.barcodeScanner.scan(function (result) {
			if(result.text) {
				$scope.code.friend = result.text;
				$scope.addByCode();
			}
		}, console.error.bind(console),{
			  'formats' : 'QR_CODE',
			  'prompt' : messages('qr_scanner_prompt')
		});
	}
})