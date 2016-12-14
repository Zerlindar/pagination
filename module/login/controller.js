/**
 * Created by Administrator on 2016/12/13.
 */
app.controller("loginController", ["$scope", "alertify", "myHttp", "myCookie", "$state", function($scope, alertify, myHttp, myCookie, $state){
  $scope.page = 1;
  $scope.count = 200;
  $scope.size = 5;
}]);
