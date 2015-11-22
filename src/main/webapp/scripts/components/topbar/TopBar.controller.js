angular.module('app.components')
	.controller('TopBarController', ['$scope', '$window', function($scope, $window) {


	$scope.clickPublic = function() {
		$window.location.href = "https://github.com/dwatling/fslg_pto_calculator";
	};
}]);
