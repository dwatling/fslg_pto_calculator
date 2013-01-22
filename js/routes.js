// Configure partials
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/pto', {
		templateUrl: 'views/pto.html', controller: 'PTOCtrl'
	});
	$routeProvider.otherwise({redirectTo: '/pto'});
}]);
app.config(['$locationProvider', function($locationProvider) {
	// I heard this was "cool" but it really broke my app...
	//  cool => (fsc/#/pto --> fsc/pto)
	//$locationProvider.html5Mode(true);
}]);
