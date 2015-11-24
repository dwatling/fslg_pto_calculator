describe("TopBarController", function() {
	var $scope, $window;

	beforeEach(function() {
		module("app.components", function($provide) {
			$provide.value('$window', {location: { href: undefined }});
		});

		inject(function($injector) {
			var $rootScope = $injector.get("$rootScope");
			$scope = $rootScope.$new();

			var $controller = $injector.get("$controller");
			$window = $injector.get("$window");

			$controller("TopBarController", {$scope: $scope});
		});
	});

	describe("clickPublic", function() {
		it("should set window.location.href", function() {
			expect($window.location.href).toBe(undefined);

			$scope.clickPublic();

			expect($window.location.href).not.toBe(undefined);
		});
	});
});