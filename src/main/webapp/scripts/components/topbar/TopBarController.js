angular.module('app.components')
	.controller('TopBarController', function($scope, $window) {

	$scope.clickPublic = function() {
		$window.location.href = "https://github.com/dwatling/fss_pto_calculator";
	};
});
