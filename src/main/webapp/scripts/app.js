angular.module("app.services", []);
angular.module("app.components", ['ngMaterial', 'app.services']);
angular.module("app.routes", ['ngRoute','app.services','app.components']);

angular.module("app", [
	'app.templates',
	'app.routes',
	'app.services',
	'app.components']);
