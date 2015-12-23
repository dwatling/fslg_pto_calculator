angular.module("app.routes")
.config(function($routeProvider) {
	$routeProvider
		.when("/", {controller: 'HomeController', templateUrl: 'scripts/components/home/home.tpl.html'})
		.otherwise({redirectTo: '/'});
});
