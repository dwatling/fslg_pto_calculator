// Since we are bootstrapping angular, we need our 'app'
var app = angular.module('application', ['AppServices']);

require([
	"services", 
	"date_enhancer", 
	"controllers", 
	"routes"], function() { 
	angular.element(document).ready(function() {
		// Bootstrap because we are using requireJS
		angular.bootstrap(document, ['application']);
	});	
});

