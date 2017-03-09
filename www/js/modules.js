// Tabs
function SimplePubSub() {
    var events = {};
    return {
        on: function(names, handler) {
            names.split(' ').forEach(function(name) {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(handler);
            });
            return this;
        },
        trigger: function(name, args) {
            angular.forEach(events[name], function(handler) {
                handler.call(null, args);
            });
            return this;
        }
    };
};

angular.module('tabSlideBox', [])
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
})
.directive('tabSlideBox', [ '$timeout', '$window', '$ionicSlideBoxDelegate', '$ionicScrollDelegate',
  function($timeout, $window, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
    'use strict';

    return {
      restrict : 'A, E, C',
      link : function(scope, element, attrs, ngModel) {
        
        var ta = element[0], $ta = element;
        $ta.addClass("tabbed-slidebox");
        if(attrs.tabsPosition === "bottom"){
          $ta.addClass("btm");
        }
        
        var handle = ta.querySelector('.slider').getAttribute('delegate-handle');
        
        var ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
        if(handle){
          ionicSlideBoxDelegate = ionicSlideBoxDelegate.$getByHandle(handle);
        }
        
        var ionicScrollDelegate = $ionicScrollDelegate;
        if(handle){
          ionicScrollDelegate = ionicScrollDelegate.$getByHandle(handle);
        }
        
        function renderScrollableTabs(){
          $timeout(function() {
            var iconsDiv = angular.element(ta.querySelector(".tsb-icons")),
            icons = iconsDiv.find("a"),
            wrap = iconsDiv[0].querySelector(".tsb-ic-wrp"),
            totalTabs = icons.length;
            var scrollDiv = wrap.querySelector(".scroll");

            angular.forEach(icons, function(value, key){
              var a = angular.element(value);
              a.on('click', function(){
                 ionicSlideBoxDelegate.slide(key);
              });

              if(a.attr('icon-off')) {
                a.attr("class", a.attr('icon-off'));
              }
            });

            setPosition(0);
            ionicSlideBoxDelegate.slide(0);
          }, 0);
        }
        function setPosition(index){
          var iconsDiv = angular.element(ta.querySelector(".tsb-icons")), icons = iconsDiv.find("a"), wrap = iconsDiv[0].querySelector(".tsb-ic-wrp"), totalTabs = icons.length;
          var scrollDiv = wrap.querySelector(".scroll");
          
          var middle = iconsDiv[0].offsetWidth/2;
          var curEl = angular.element(icons[index]);
          var prvEl = angular.element(iconsDiv[0].querySelector(".active"));
          if(curEl && curEl.length){
          var curElWidth = curEl[0].offsetWidth, curElLeft = curEl[0].offsetLeft;

          if(prvEl.attr('icon-off')) {
            prvEl.attr("class", prvEl.attr('icon-off'));
          }else{
            prvEl.removeClass("active");
          }
          if(curEl.attr('icon-on')) {
            curEl.attr("class", curEl.attr('icon-on'));
          }
          curEl.addClass("active");
          
          var leftStr = (middle  - (curElLeft) -  curElWidth/2 + 5);
          if(!scrollDiv){
            var leftStr = (middle  - (curElLeft) -  curElWidth/2 + 5) + "px";
            wrap.style.webkitTransform =  "translate3d("+leftStr+",0,0)" ;
          }else{
            var wrapWidth = wrap.offsetWidth;
            var currentX = Math.abs(getX(scrollDiv.style.webkitTransform));
            var leftOffset = 100;
            var elementOffset = 40;
            if (currentX !== currentX) {
              currentX = ionicScrollDelegate.getScrollPosition().left;
            }
            if(((currentX + wrapWidth) < (curElLeft + curElWidth + elementOffset)) || (currentX > (curElLeft - leftOffset))){
              if(leftStr > 0){
                leftStr = 0;
              }
              ionicScrollDelegate.scrollTo(Math.abs(leftStr), 0, true);
            }
          }
          }
        };
        function getX(matrix) {
          matrix = matrix.replace("translate3d(","");
          matrix = matrix.replace("translate(","");
          return (parseInt(matrix));
        }
        var events = scope.events;
        events.on('slideChange', function(data){
          setPosition(data.index);
        });
        events.on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
          renderScrollableTabs();
        });
        
        renderScrollableTabs();
      },
      controller : function($scope, $attrs, $element) {
        $scope.events = new SimplePubSub();
        
        $scope.slideHasChanged = function(index){
          $scope.events.trigger("slideChange", {"index" : index});
          $timeout(function(){if($scope.onSlideMove) $scope.onSlideMove({"index" : eval(index)});},100);
        };
        
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
          $scope.events.trigger("ngRepeatFinished", {"event" : ngRepeatFinishedEvent});
        });
      }
    };
  } 
]);

// Rating
(function() {
  angular.module('ionic.rating', []).constant('ratingConfig', {
    max: 5
  }).controller('RatingController', function($scope, $attrs, ratingConfig) {
    var ngModelCtrl;
    ngModelCtrl = {
      $setViewValue: angular.noop
    };
    this.init = function(ngModelCtrl_) {
      var max, ratingStates;
      ngModelCtrl = ngModelCtrl_;
      ngModelCtrl.$render = this.render;
      max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max;
      return $scope.range = this.buildTemplateObjects(ngModelCtrl.$modelValue, max);
    };
    this.buildTemplateObjects = function(stateValue, max) {
      var i, j, len, states = [];

      for (j = 0; j < max; j++) {
        if(stateValue > j && stateValue < j+1)
          states[j] = 2;
        else if(stateValue > j)
          states[j] = 1;
        else
          states[j] = 0;
      }

      return states;
    };
    $scope.rate = function(value) {
      if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
        ngModelCtrl.$setViewValue(value);
        return ngModelCtrl.$render();
      }
    };
    $scope.onKeydown = function(evt) {
      if (/(37|38|39|40)/.test(evt.which)) {
        evt.preventDefault();
        evt.stopPropagation();
        return $scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? {
              1: -1
            } : void 0));
      }
    };
    this.render = function() {
      return $scope.value = ngModelCtrl.$viewValue;
    };
    return this;
  }).directive('rating', function($timeout) {
    return {
      restrict: 'EA',
      require: ['rating', 'ngModel'],
      scope: {
        readonly: '=?'
      },
      controller: 'RatingController',
      template: '<ul class="rating" ng-keydown="onKeydown($event)">' + '<li ng-repeat="r in range track by $index" ng-click="rate($index + 1)"><i class="icon" ng-class="value === undefined ? (r === 1 ? \'ion-ios-star\' : (r === 2 ? \'ion-ios-star-half\' : \'ion-ios-star-outline\')) : (value > $index ? (value < $index+1 ? \'ion-ios-star-half\' : \'ion-ios-star\') : \'ion-ios-star-outline\')"></i></li>' + '</ul>',
      replace: true,
      link: function(scope, element, attrs, ctrls) {
        var ngModelCtrl, ratingCtrl;
        ratingCtrl = ctrls[0];
        ngModelCtrl = ctrls[1];
        if (ngModelCtrl) {
          $timeout(function(){
          return ratingCtrl.init(ngModelCtrl);
          })
        }
      }
    };
  });
}).call(this);