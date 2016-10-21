describe("PtoService", function() {
	var service;

	var mockEmployee;

	beforeEach(function() {
		module("app.services");

		mockEmployee = new Employee({yearsEmployed: 10, ptoPerYear: 26, lastPto: 10, lastPtoUpdate: new Date("2015/10/31")});

		inject(function($injector) {
			service = $injector.get("PtoService");
		});
	});

	describe("getPtoAccrualMatrix", function() {
		it("should return an array with three fields", function() {
			var result = service.getPtoAccrualMatrix();

			expect(Object.prototype.toString.call(result)).toEqual("[object Array]");
			angular.forEach(result, function(item) {
				expect(item.yearsEmployed).not.toEqual(undefined);
				expect(item.ptoPerYear).not.toEqual(undefined);
				expect(item.label).not.toEqual(undefined);
			});
		});
	});

	describe("ptoPerPayPeriod", function() {
		it("should return PTO (in hours) accrued every pay period (2 weeks)", function() {
			var EXPECTED = mockEmployee.ptoPerYear * 8 / 26;

			var result = service.ptoPerPayPeriod(mockEmployee);
			expect(result).toEqual(EXPECTED);
		});
	});

	describe("calculateNumberOfPayPeriods", function() {
		var DATA = [
			{fromDate: new Date(2015, 11, 12), toDate: new Date(2015, 11, 26), expected: 1},
			{fromDate: new Date(2015, 11, 12), toDate: new Date(2016, 0, 9), expected: 2},
			{fromDate: new Date(2015, 11, 12), toDate: new Date(2016, 0, 16), expected: 2.5},
		];

		angular.forEach(DATA, function(input) {
			it("should return " + input.expected + " pay periods between two dates (" + input.fromDate + ", " + input.toDate + ")", function() {
				var result = service.calculateNumberOfPayPeriods(input.fromDate, input.toDate);
				expect(result).toEqual(input.expected);
			});
		});
	});

	describe("calculatePtoOnDate", function() {
		it("should calculate the number of hours of PTO will be available given certain criteria", function() {
			var result = service.calculatePtoOnDate(mockEmployee, new Date(2015, 11, 25, 12, 0, 0));

			expect(result).toEqual(41.73809523809524);
		});

		it("should calculate the number of hours of PTO will be available at the start of the day given certain criteria", function() {
			var result = service.calculatePtoOnDate(mockEmployee, new Date(2015, 11, 25, 12, 0, 0), true);

			expect(result).toEqual(41.45238095238095);
		});

		it("should consider PTO cap dates", function() {
			var tonsOfPtoBoy = new Employee({yearsEmployed: 10, ptoPerYear: 26, lastPto: 200, lastPtoUpdate: new Date(2015, 11, 12)});
			var result = service.calculatePtoOnDate(tonsOfPtoBoy, new Date(2015, 11, 26, 0, 0, 0));

			expect(result).toEqual(80);

			result = service.calculatePtoOnDate(tonsOfPtoBoy, new Date(2016, 2, 19, 0, 0, 0));

			expect(result).toEqual(40);
		});
	});

	describe("isDateWithinOneYearFromLastPtoUpdate", function() {
		var DATA = [{date: new Date(2014, 2, 29), expected: false}, {date: new Date(2015, 4, 1), expected: false}, {date: new Date(2016, 1, 1), expected: true}, {date: new Date(2016, 4, 1), expected: true}];

		angular.forEach(DATA, function(input) {
			it("should return " + input.expected + " for date " + input.date, function() {
				expect(service.isDateWithinOneYearFromLastPtoUpdate(mockEmployee, input.date)).toEqual(input.expected);
			});
		});
	});

	describe("calculateUseOrLose", function() {
		it("should return nothing if employee won't be affected by PTO caps", function() {
			var noPtoBoy = new Employee({yearsEmployed: 10, ptoPerYear: 1, lastPto: 0, lastPtoUpdate: new Date(2015, 11, 12)});
			var result = service.calculateUseOrLose(noPtoBoy);
			expect(result).toEqual([]);
		});

		it("should return March cut off date if employee won't be affected by December PTO cap", function() {
			var somePtoBoy = new Employee({yearsEmployed: 10, ptoPerYear: 20, lastPto: 15, lastPtoUpdate: new Date(2015, 11, 12)});
			var result = service.calculateUseOrLose(somePtoBoy);
			expect(result).toEqual([{date: new Date(2016, 2, 19), amount: 18.05860297110297}]);
		});

		it("should return both December and March cut off dates if employee will be affected PTO caps", function() {
			var tonsOfPtoBoy = new Employee({yearsEmployed: 10, ptoPerYear: 20, lastPto: 200, lastPtoUpdate: new Date(2015, 11, 12)});
			var result = service.calculateUseOrLose(tonsOfPtoBoy);
			expect(result).toEqual([{date: new Date(2015, 11, 26), amount: 126.15384106634107}, {date: new Date(2016, 2, 19), amount: 76.90475681725681}]);
		});

		it("should reflect December 31st cut off date for 2016", function() {
			var ptoHorder = new Employee({yearsEmployed: 10, ptoPerYear: 20, lastPto: 185, lastPtoUpdate: new Date(2016, 11, 6)});
			var result = service.calculateUseOrLose(ptoHorder);
			expect(result).toEqual([{date: new Date(2016, 11, 31), amount: 155.9890059015059}]);
		});
	});
});