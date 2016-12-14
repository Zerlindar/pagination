/**
 * Created by Administrator on 2016/12/12.
 */
var tab = angular.module('ui.select', []);
tab.service("eventUtil", function () {
  this.getEvent = function (event) {
    return event ? event : window.event;
  },
    this.getTarget = function (event) {
      return event.target || event.srcElement;
    },
    this.getRelatedTarget = function (event) {
      if (event.relatedTarget) {
        return event.relatedTarget;
      } else if (event.toElement) {
        return event.toElement;
      } else if (event.fromElement) {
        return event.fromElement;
      } else {
        return null;
      }
    },
    this.addHandler = function (element, type, handler) {
      if (element.addEventListener) {
        element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + type,
          function () {
            return handler.call(element, window.event);
          });
      } else {
        element["on" + type] = handler;
      }
    },
    this.removeListener = function (element, type, hander) {
      if (element.removeEventListener) {
        element.removeEventListener(type, hander, false);
      } else if (element.deattachEvent) {
        element.deattachEvent("on" + type,
          function () {
            return handler.call(element, window.event);
          });
      } else {
        element['on' + type] = null;
      }
    },
    this.preventDefault = function (event) {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    },
    this.stopPropagation = function (event) {
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
    }

})
tab.directive("selectVox", ["eventUtil", function (eventUtil) {
  return {
    restrict: "EA",
    replace: true,
    scope: {
      labelTitle: "@",
      originLabel: "@",
      labelContent: "=",
      listData: "=",
      myClick: "&"
    },
    link: function (scope, element, attrs) {
      scope.labelFlag = {};
      var ele = document.body;
      eventUtil.addHandler(ele, "click", function(e){
        var event = eventUtil.getEvent(e),
          target = eventUtil.getTarget(event);
        if(target.id != "ser-input" && target.id != "search"){
          scope.listData = [];
          scope.$apply();
        }
      });
      scope.setLabel = function (val) {
        if (!scope.labelFlag[val.name]) {
          scope.labelFlag[val.name] = 1;
          scope.labelContent.push(val);
        }
        scope.listData = [];
      }
      scope.deleteLabel = function (index, val) {
        scope.labelContent.splice(index, 1);
        scope.labelFlag[val.name] = 0;
      }
    },
    template: '<div id = "selectVox"> ' +
    '<div class="form-group"> ' +
    '<label for="ser-input" class="control-label col-sm-2">{{labelTitle}}：</label> ' +
    '<div class="col-sm-9 has-feedback"> ' +
    '<input id="ser-input" class="form-control" type="text"> <span ng-click = myClick() style = "right: 20px; cursor: pointer; pointer-events: auto" title="搜索" id = "search"class="glyphicon glyphicon-search form-control-feedback pos-relative"></span> ' +
    '<div class="select-content border border-t-none col-sm-12 pd-horizontal-none">' +
    '<ul ng-show = "listData && listData.length > 0"  id = "fansList-content"> ' +
    '<li class="list-detail" ng-repeat = "val in listData track by $index" ng-click = setLabel(val)>{{val.name}}</li> ' +
    '<li ng-if = "listData && listData.length == 0" class="title">没有找到该粉丝...</li>' +
    '</ul></div>' +
    '</div>' +
    '<div class="fans-content border border-t-none col-sm-12 pd-horizontal-none"> ' +
    '<ul ng-show = "labelContent.length > 0" class  = "col-sm-offset-2 col-sm-9 pd-horizontal-none group-label-list">' +
    '<li ng-repeat="val in labelContent track by $index"  class="col-sm-4 pd-horizontal-none label-detail pd-horizontal-sm has-feedback">' +
    '<a title = "{{val.name}}"  class = "pd-horizontal-sm" href="javascript:;">{{val.name}}</a> ' +
    '<div title = "删除标签" ng-click = "deleteLabel($index, val)" class = "glyphicon glyphicon-remove delete"></div> ' +
    '</li>' + ' </ul>' +
    ' </div>' +
    '</div>'
  }
}]);
tab.directive("myPagination", function(){
  function creatPage(current, count, length){
    var page = [], min, max;
    var center = (length + 1) / 2,
      diff = (length - 1) / 2,
      mdm = length - 1;
    if (count <= length) {
      min = 1;
      max = count;
    } else {
      if (current > center && current < count - diff) {      //3,2
        min = current - diff;
        max = min + mdm;
      } else if (current <= center) {
        min = 1;
        max = min + mdm;
      } else {
        min = count - mdm;
        max = count;
      }
    }
    for(var i = min; i <= max; i ++){
      page.push(i);
    }
    return page;
  }
  return {
    restrict: "EA",
    replace: true,
    scope: {
      pageNum: "=",
      pageCount: "=",
      ngModel: "=",
    },
    link: function (scope, element, attrs) {
      console.log(attrs.ngModel);
      if(!attrs.ngModel)
        throw '\"ng-model\" is undefined \n 中文:\"ng-model\"为必传参数。';
      if(!attrs.pageNum)
        throw '\"pageNum\" is undefined \n 中文:\"items-per-page\"为必传参数。';
      if(!attrs.pageCount)
        throw '\"pageCount\" is undefined \n 中文:\"total-items\"为必传参数。';
      scope.page = creatPage(scope.ngModel, scope.pageCount, scope.pageNum);  //页面数据
      scope.currentPage = scope.ngModel;                                      //当前页面
      scope.total = scope.pageCount;                                          //总页数
      scope.updatePage = function(page){
        scope.currentPage = page;
        scope.page = creatPage(scope.currentPage, scope.pageCount, scope.pageNum);
      }
      scope.jump = function(data){
        scope.currentPage = document.getElementById("jumpPage").value;
        scope.page = creatPage(scope.currentPage, scope.pageCount, scope.pageNum);
      }
    },
    template: '<div id ="pagination" >' +
    '<ul class="pagination inline-block">' +
    '<li ng-click = "updatePage(1)" ng-class = "{disabled: currentPage == 1}"><a class = "firstPage" title = "首页"  href="javascript:;">&laquo;</a></li>' +
    '<li ng-click = "updatePage(currentPage-1)" ng-class = "{disabled: currentPage == 1}"><a class = "previous" title = "前一页"  href="javascript:;">&lt;</a></li>'+
    '<li ng-click = "updatePage(val)" ng-repeat="val in page track by $index" class = "page" ng-class = "{active: val == currentPage}"><a href="javascript:">{{val}}</a></li>' +
    '<li ng-click = "updatePage(currentPage+1)" ng-class = "{disabled: currentPage == total}"><a class = "next" title = "尾页" href="javascript:">&gt;</a></li>' +
    '<li ng-click = "updatePage(total)" ng-class = "{disabled: currentPage == total}"><a class = "lastPage" title = "后一页" href="javascript:">&raquo;</a></li></ul>' +
    '<div class="page-footer inline-block page-footer">转至 ' +
    '<input id = "jumpPage" class = "input-sm" type="text"/>页&nbsp;&nbsp; ' +
    '<div ng-click = "jump(ngModal)" class="btn-inline btn btn-sm btn-info border-radius confirm">确定</div> </div>' +
    '</div>'
  }
})