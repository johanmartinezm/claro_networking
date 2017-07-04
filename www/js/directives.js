angular.module('app.directives', [])

.directive('blankDirective', [function(){

}])

.directive('tooltip', function () {
  return {
    restrict: 'C',
    link: function (scope, element, attrs) {
      if (attrs.title) {
        var $element = $(element);
        $element.attr("title", attrs.title)
        $element.tooltipster({
          animation: attrs.animation,
          trigger: "click",
          position: attrs.position,
          positionTracker: true,
          maxWidth: 500,
          contentAsHTML: true
        });
      }
    }
  };
})

.directive('callnumber', function(){
  return{
    restrict: 'A',
    link: function (scope, element, attrs){
      $(element[0]).click(function(e){
        if(e.target.tagName.toLowerCase() === 'a'){
          var parts = e.target.href.split(':');
          if(parts[0] === 'tel'){
            e.preventDefault()  
            var f = console.log.bind(console);
            window.plugins.CallNumber.callNumber(f, f, parts[1]);
          }          
        }
      });
    }
  };
});