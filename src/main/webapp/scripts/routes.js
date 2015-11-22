angular.module("app.routes")
.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when("/", {controller: 'HomeController', templateUrl: 'scripts/components/home/home.tpl.html'})
		.otherwise({redirectTo: '/'});
}]);
