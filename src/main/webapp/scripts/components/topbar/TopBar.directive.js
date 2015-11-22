angular.module('app.components')
.directive('topBar', [function() {
	return {
		restrict: 'E',
		replace: true,
		controller: 'TopBarController',
		templateUrl: 'scripts/components/topbar/TopBar.tpl.html'
	};
}]);
