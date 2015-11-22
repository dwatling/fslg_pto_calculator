describe("DataStoreService", function() {
	var service, $window;

	beforeEach(function() {
		module("app.services");

		inject(function($injector) {
			service = $injector.get("DataStoreService");
			$window = $injector.get("$window");

			$window.localStorage.clear();
		});
	});

	describe("set", function() {
		it("should store string in localStorage", function() {
			service.set("key", "value");

			expect($window.localStorage.getItem("key")).toEqual("value");
		});

		it("should store object in localStorage", function() {
			var DATA = {foo: 'bar'};
			service.set("key", DATA);

			expect($window.localStorage.getItem("key")).toEqual(angular.toJson(DATA));
		});

		it("should store numbers in localStorage", function() {
			var DATA = 1;
			service.set("key", DATA);

			expect($window.localStorage.getItem("key")).toEqual("1");
		});

		it("should store Dates in localStorage", function() {
			var DATA = new Date(2001, 3, 1);
			service.set("key", DATA);

			expect($window.localStorage.getItem("key")).toEqual(DATA.toJSON());
		});
	});

	describe("get", function() {
		beforeEach(function() {
			$window.localStorage.clear();
		});

		it("should return undefined if key is not defined in localStorage", function() {
			var result = service.get("key");

			expect(result).toEqual(undefined);
		});

		it("should return defaultValue if key is not defined in localStorage", function() {
			var result = service.get("key", "val");

			expect(result).toEqual("val");
		});

		it("should return string if key is defined in localStorage", function() {
			var DATA = "value";
			$window.localStorage.setItem("key", DATA);
			var result = service.get("key");

			expect(result).toEqual(DATA);
		});

		it("should return object if key is defined in localStorage", function() {
			var DATA = {foo: 'bar'};
			$window.localStorage.setItem("key", angular.toJson(DATA));
			var result = service.get("key");

			expect(result).toEqual(DATA);
		});

		it("should return number if key is defined in localStorage", function() {
			var DATA = 100;
			$window.localStorage.setItem("key", angular.toJson(DATA));
			var result = service.get("key");

			expect(result).toEqual(DATA);
		});

		it("should return Date if key is defined in localStorage", function() {
			var DATE = new Date("2003/04/01 12:00:00")
			var DATA = DATE.toJSON();
			$window.localStorage.setItem("key", DATA);
			var result = service.get("key");

			expect(result).toEqual(DATE);
		});
	});
});