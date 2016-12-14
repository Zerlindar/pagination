/**
 * Created by Administrator on 2016/9/26.
 */
app.directive("tabTitle", function(){
  return {
    restrict: "EA",
    replace: true,
    require: "?ngModel",
    scope: {
      tempTitle: "=",
      tempLs: "@",
      myClick: "&"
    },
    link: function(scope, element, attrs, ctr){
      scope.temp = 0;
      scope.setCheck = function(index, val){
        scope.temp = index;
        if (ctr) {
          ctr.$setViewValue(val);
        }
        scope.myClick();
      }

    },
    template: "<div id = 'tab-component'>{{tempLs}}" +
    "<span ng-class='{active: temp == $index}' ng-repeat='val in tempTitle track by $index' " +
    "ng-click = 'setCheck($index, val)'>{{val}}</span>" +
    "</div>",
  }
})
