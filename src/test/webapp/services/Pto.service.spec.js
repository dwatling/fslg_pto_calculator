describe("PtoService", function() {
	var service;

	beforeEach(function() {
		module("app.services");

		inject(function($injector) {
			service = $injector.get("PtoService");
		});
	});

	describe("ptoPerYear", function() {
		var DATA = [
				{years_employed: 0, expected: 15},
				{years_employed: 1, expected: 19},
				{years_employed: 5, expected: 23},
				{years_employed: 10, expected: 26},
				{years_employed: 15, expected: 29},
				{years_employed: 25, expected: 29},
				{years_employed: 26, expected: 29}
			];
		angular.forEach(DATA, function(input) {
			it("should return " + input.expected + " for " + input.years_employed + " years of service.", function() {
				var result = service.ptoPerYear(input.years_employed);
				expect(result).toEqual(input.expected);
			});
		});
	});

	describe("ptoPerPayPeriod", function() {
		it("should return PTO (in hours) accrued every pay period (two weeks)", function() {
			var DATA = 10;
			var EXPECTED = DATA * 8 / 26;		// 8 hours in a work day, 26 pay periods per year

			spyOn(service, "ptoPerYear").and.returnValue(DATA);

			var result = service.ptoPerPayPeriod(10);
			expect(result).toEqual(EXPECTED);

			expect(service.ptoPerYear).toHaveBeenCalled();
		});
	});

	describe("ptoPerDay", function() {
		it("should return PTO (in hours) accrued every day", function() {
			var DATA = 10;
			var EXPECTED = DATA / 14;

			spyOn(service, "ptoPerPayPeriod").and.returnValue(DATA);

			var result = service.ptoPerDay(10);
			expect(result).toEqual(EXPECTED);

			expect(service.ptoPerPayPeriod).toHaveBeenCalled();
		});
	});

	describe("ptoPerHour", function() {
		it("should return PTO (in hours) accrued every hour", function() {
			var DATA = 10;
			var EXPECTED = DATA / 24;		// 14 days in a pay period

			spyOn(service, "ptoPerDay").and.returnValue(DATA);

			var result = service.ptoPerHour(10);
			expect(result).toEqual(EXPECTED);

			expect(service.ptoPerDay).toHaveBeenCalled();
		});
	});

	describe("ptoPerMinute", function() {
		it("should return PTO (in hours) accrued every hour", function() {
			var DATA = 10;
			var EXPECTED = DATA / 60;		// 14 days in a pay period

			spyOn(service, "ptoPerHour").and.returnValue(DATA);

			var result = service.ptoPerMinute(10);
			expect(result).toEqual(EXPECTED);

			expect(service.ptoPerHour).toHaveBeenCalled();
		});
	});

	describe("ptoPerSecond", function() {
		it("should return PTO (in hours) accrued every hour", function() {
			var DATA = 10;
			var EXPECTED = DATA / 60;		// 14 days in a pay period

			spyOn(service, "ptoPerMinute").and.returnValue(DATA);

			var result = service.ptoPerSecond(10);
			expect(result).toEqual(EXPECTED);

			expect(service.ptoPerMinute).toHaveBeenCalled();
		});
	});

	describe("calculatePtoOnDate", function() {
	});

	describe("isDateWithinOneYearFromNow", function() {
	});

	describe("calculateUseOrLose", function() {
	});

	describe("calculateCurrentPtoHours", function() {
		it("should call into calculatePtoOnDate using now", function() {
			spyOn(window, "Date").and.returnValue(MOCK_DATE);
			spyOn(service, "calculatePtoOnDate");

			service.calculateCurrentPtoHours(1, new Date())

			expect(service.calculatePtoOnDate).toHaveBeenCalledWith()
		});
	});

	describe("calculateCurrentPtoSeconds", function() {
	});

	describe("calculateFuturePto", function() {
	});
});