/**
 * Created by Administrator on 2016/12/13.
 */
app.filter('trustHtml', ["$sce", function ($sce) {
  return function (input) {
    return $sce.trustAsHtml(input);
  }
}]);