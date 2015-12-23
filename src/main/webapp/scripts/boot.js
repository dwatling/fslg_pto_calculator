$(window).load(function() {
	angular.bootstrap(document, ['app'], {strictDi: window.jasmine === undefined});
});
