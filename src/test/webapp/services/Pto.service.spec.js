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
		it("should calculate the number of hours of PTO will be available given certain criteria", function() {
			spyOn(service, "ptoPerSecond").and.returnValue(0.000012);

			var result = service.calculatePtoOnDate(new Date(2015, 11, 25), 15, 0, new Date(2015, 10, 26));

			expect(result).toEqual(30.0672);
		});
	});

	describe("isDateWithinOneYearFromNow", function() {
		beforeEach(function() {
			var MOCK_DATE = new Date(2015, 3, 1);
			spyOn(service, "getNow").and.returnValue(MOCK_DATE);
		});

		var DATA = [{date: new Date(2014, 2, 29), expected: false}, {date: new Date(2015, 4, 1), expected: true}, {date: new Date(2016, 1, 1), expected: true}, {date: new Date(2016, 4, 1), expected: false}];

		angular.forEach(DATA, function(input) {
			it("should return " + input.expected + " for date " + input.date, function() {
				expect(service.isDateWithinOneYearFromNow(input.date)).toEqual(input.expected);
			});
		});
	});

	describe("calculateUseOrLose", function() {
	});

	describe("calculateCurrentPtoHours", function() {
		it("should call into calculatePtoOnDate using now", function() {
			var MOCK_DATE = new Date(2015, 3, 1);
			var LAST_UPDATE = new Date(2015, 2, 1);

			spyOn(service, "getNow").and.returnValue(MOCK_DATE);
			spyOn(service, "calculatePtoOnDate").and.returnValue(1);

			var result = service.calculateCurrentPtoHours(1, 0, LAST_UPDATE);

			expect(service.calculatePtoOnDate).toHaveBeenCalledWith(MOCK_DATE, 1, 0, LAST_UPDATE);
			expect(result).toEqual(1);
		});
	});

	describe("calculateCurrentPtoSeconds", function() {
		it("should call into calculateCurrentPtoHours", function() {
			var LAST_UPDATE = new Date(2015, 2, 1);

			spyOn(service, "calculateCurrentPtoHours").and.returnValue(1);

			var result = service.calculateCurrentPtoSeconds(1, 0, LAST_UPDATE);

			expect(service.calculateCurrentPtoHours).toHaveBeenCalledWith(1, 0, LAST_UPDATE);
			expect(result).toEqual(1 * 60 * 60);
		});
	});

	describe("calculateFuturePto", function() {
		it("should call into calculatePtoOnDate the end of the input date", function() {
			var MOCK_DATE = new Date(2015, 11, 25);
			spyOn(service, "calculatePtoOnDate").and.returnValue(1);
			spyOn(MOCK_DATE, "setHours");
			spyOn(MOCK_DATE, "setMinutes");
			spyOn(MOCK_DATE, "setSeconds");

			var result = service.calculateFuturePto(MOCK_DATE, 15, 0, new Date(2015, 10, 26));

			expect(result).toEqual(1);
			expect(MOCK_DATE.setHours).toHaveBeenCalledWith(23);
			expect(MOCK_DATE.setMinutes).toHaveBeenCalledWith(59);
			expect(MOCK_DATE.setSeconds).toHaveBeenCalledWith(59);
		});
	});
});