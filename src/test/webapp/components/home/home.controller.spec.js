describe("HomeController", function() {
	var $scope, DataStoreService, PtoService;

	beforeEach(function() {
		module("app.components");

		inject(function($injector) {
			var $rootScope = $injector.get("$rootScope");
			$scope = $rootScope.$new();

			DataStoreService = $injector.get("DataStoreService");
			PtoService = $injector.get("PtoService");

			var $controller = $injector.get("$controller");

			$controller("HomeController", {$scope: $scope});
		});
	});

	describe("initialize", function() {
		beforeEach(function() {
			spyOn($scope, "refresh");
		});

		it("should call DataStoreService.get and store on $scope", function() {
			var DATA = {yearsEmployed: 1, lastPto: 1, lastPtoUpdate: new Date()};

			$scope.employee = undefined;

			spyOn(DataStoreService, "get").and.returnValue(DATA);

			$scope.initialize();

			expect(DataStoreService.get).toHaveBeenCalledWith("employee");
			expect($scope.employee).toEqual(new Employee(DATA));
		});

		it("should load PtoService.ptoAccrualMatrix", function() {
			spyOn(PtoService, "getPtoAccrualMatrix");

			$scope.initialize();

			expect(PtoService.getPtoAccrualMatrix).toHaveBeenCalled();
		});

		it("should call $scope.refresh", function() {
			$scope.initialize();

			expect($scope.refresh).toHaveBeenCalled();
		});
	});

	describe("determinePtoPerYear", function() {
		it("should set $scope.employee.ptoPerYear based on $scope.ptoAccrualMatrix based on $scope.employee.yearsEmployed && ptoAccrualMatrix->yearsEmployed", function() {
			$scope.employee = {yearsEmployed: 2};
			$scope.ptoAccrualMatrix = [{yearsEmployed: 1, ptoPerYear: 1}, {yearsEmployed: 2, ptoPerYear: 2}, {yearsEmployed: 3, ptoPerYear: 3}];

			$scope.determinePtoPerYear();

			expect($scope.employee.ptoPerYear).toEqual(2);
		});

		it("should not set anything if no matching yearsEmployed", function() {
			$scope.employee = {yearsEmployed: 23};
			$scope.ptoAccrualMatrix = [{yearsEmployed: 1, ptoPerYear: 1}, {yearsEmployed: 2, ptoPerYear: 2}, {yearsEmployed: 3, ptoPerYear: 3}];

			$scope.determinePtoPerYear();

			expect($scope.employee.ptoPerYear).toEqual(undefined);
		});
	});

	describe("getNow", function() {
		it("should return a Date", function() {
			var result = $scope.getNow();
			expect(Object.prototype.toString.call(result)).toEqual("[object Date]");
		});
	});

	describe("save", function() {
		beforeEach(function() {
			spyOn(DataStoreService, "set");
			spyOn($scope, "refresh");
		});

		it("should convert $scope.lastPto to a number", function() {
			$scope.lastPto = "1";

			$scope.save();

			expect($scope.lastPto).toEqual(1);
		});

		it("should call DataStoreService.set", function() {
			$scope.employee = "EMPLOYEE";

			$scope.save();

			expect(DataStoreService.set).toHaveBeenCalledWith("employee", $scope.employee);
		});

		it("should call refresh", function() {
			$scope.save();

			expect($scope.refresh).toHaveBeenCalled();
		});
	});

	describe("hasRequiredInformation", function() {
		var DATA = [
			{yearsEmployed: undefined, lastPto: undefined, lastPtoUpdate: undefined, expected: false},
			{yearsEmployed: "defined", lastPto: undefined, lastPtoUpdate: undefined, expected: false},
			{yearsEmployed: undefined, lastPto: "defined", lastPtoUpdate: undefined, expected: false},
			{yearsEmployed: undefined, lastPto: undefined, lastPtoUpdate: "defined", expected: false},
			{yearsEmployed: "defined", lastPto: "defined", lastPtoUpdate: undefined, expected: false},
			{yearsEmployed: undefined, lastPto: "defined", lastPtoUpdate: "defined", expected: false},
			{yearsEmployed: "defined", lastPto: undefined, lastPtoUpdate: "defined", expected: false},
			{yearsEmployed: "defined", lastPto: "defined", lastPtoUpdate: "defined", expected: true},
		];

		angular.forEach(DATA, function(input) {
			it("should return " + input.expected + " if yearsEmployed is " + input.yearsEmployed + ", lastPto is " + input.lastPto + ", lastPtoUpdate is " + input.lastPtoUpdate, function() {
				$scope.employee = {};
				$scope.employee.yearsEmployed = input.yearsEmployed;
				$scope.employee.lastPto = input.lastPto;
				$scope.employee.lastPtoUpdate = input.lastPtoUpdate;

				expect($scope.hasRequiredInformation()).toEqual(input.expected);
			});
		});
	});

	describe("refresh", function() {
		beforeEach(function() {
			spyOn($scope, "determinePtoPerYear");
			spyOn(PtoService, "ptoPerPayPeriod").and.returnValue("ptoPerPayPeriod");
			spyOn(PtoService, "calculateUseOrLose").and.returnValue("calculateUseOrLose");
			spyOn(PtoService, "calculatePtoOnDate").and.returnValue("calculatePtoOnDate");
		});

		it("should do nothing if hasRequiredInformation is false", function() {
			spyOn($scope, "hasRequiredInformation").and.returnValue(false);

			$scope.refresh();

			expect($scope.determinePtoPerYear).not.toHaveBeenCalled();
			expect(PtoService.ptoPerPayPeriod).not.toHaveBeenCalled();
			expect(PtoService.calculateUseOrLose).not.toHaveBeenCalled();
			expect(PtoService.calculatePtoOnDate).not.toHaveBeenCalled();
		});

		it("should invoke PtoService methods, update ptoPerYear on employee object, set showPtoCalculations, and convert lastPto into a number", function() {
			var NOW = new Date();
			spyOn($scope, "getNow").and.returnValue(NOW);
			spyOn($scope, "hasRequiredInformation").and.returnValue(true);

			$scope.employee = new Employee();
			$scope.employee.lastPto = "1";

			$scope.refresh();

			expect($scope.employee.lastPto).toEqual(1);
			expect($scope.showPtoCalculations).toEqual(true);

			expect($scope.determinePtoPerYear).toHaveBeenCalled();
			expect(PtoService.ptoPerPayPeriod).toHaveBeenCalledWith($scope.employee);
			expect(PtoService.calculateUseOrLose).toHaveBeenCalledWith($scope.employee);
			expect(PtoService.calculatePtoOnDate).toHaveBeenCalledWith($scope.employee, NOW);
		});
	});

	describe("refreshFuturePto", function() {
		it("should invoke PtoService.calculatePtoOnDate and store the value", function() {
			var DATA = "DATA";
			spyOn(PtoService, "calculatePtoOnDate").and.returnValue(DATA);

			$scope.employee = {};
			$scope.ptoAsOf = new Date("11/12/2013");

			$scope.refreshFuturePto();

			expect(PtoService.calculatePtoOnDate).toHaveBeenCalledWith($scope.employee, $scope.ptoAsOf, true);
			expect($scope.futurePto).toEqual(DATA);
		});
	});
});