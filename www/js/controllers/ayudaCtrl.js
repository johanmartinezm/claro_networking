//  ayudaCtrl.js 1.0.0
//  Sergio Andrés Ñustes
//  infinito84@gmail.com

angular.module('app')

.controller('ayudaCtrl', function($scope, $state, messages, $ionicModal) {
  $scope.helpTitle = messages('help_title');
  $scope.helpText = messages('help_about');

  $scope.groups = JSON.parse(localStorage.faq);

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
  $scope.showTerms = function(){
    $scope.terms = localStorage.TermsAndServices;
    $ionicModal.fromTemplateUrl('templates/terms.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        modal.show();
    });
  }
})