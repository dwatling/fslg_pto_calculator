angular.module('app.services')
	.service('PtoService', function() {
	var MILLISECONDS_IN_A_YEAR = 1000 * 60 * 60 * 24 * 365;
	var MILLISECONDS_IN_A_PAYPERIOD = 1000 * 60 * 60 * 24 * 14;

	var PTO_CAP_DATES = [
			{date: new Date(2015, 11, 26), cap: 80},
			{date: new Date(2016, 2, 19), cap: 40},
			{date: new Date(2016, 11, 24), cap: 40},
			{date: new Date(2017, 11, 23), cap: 40},		// TODO: verify
			{date: new Date(2018, 11, 22), cap: 40},		// TODO: verify
		];

	this.getPtoAccrualMatrix = function() {
		return [
			{yearsEmployed: 0, ptoPerYear: 15, label: "< 1 year"},
			{yearsEmployed: 1, ptoPerYear: 19, label: "1 - 5 years"},
			{yearsEmployed: 5, ptoPerYear: 23, label: "5 - 10 years"},
			{yearsEmployed: 10, ptoPerYear: 26, label: "10 - 15 years"},
			{yearsEmployed: 15, ptoPerYear: 29, label: "15+ years"}
		];
	};

	this.ptoPerPayPeriod = function(employee) {
		return employee.ptoPerYear * 8 / 26;
	};

	// Assumes fromDate is the end of a pay period (i.e. when PTO is actually accrued)
	this.calculateNumberOfPayPeriods = function(fromDate, toDate) {
		var result = (toDate - fromDate) / MILLISECONDS_IN_A_PAYPERIOD;

		return result;
	};

	// How many hours of PTO will I have on date X?
	this.calculatePtoOnDate = function(employee, date, shouldBeStartOfDay, skipCaps) {
		if (shouldBeStartOfDay) {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
		}

		var numberOfPayPeriods = this.calculateNumberOfPayPeriods(employee.lastPtoUpdate, date);
		var ptoEarned = numberOfPayPeriods * this.ptoPerPayPeriod(employee);

		var result = employee.lastPto + ptoEarned;

		if (!skipCaps) {
			angular.forEach(PTO_CAP_DATES, function(ptoCap) {
				if (employee.lastPtoUpdate < ptoCap.date && date >= ptoCap.date) {
					if (result > ptoCap.cap) {
						var tempEmployee = new Employee(employee);
						tempEmployee.lastPtoUpdate = ptoCap.date;
						tempEmployee.lastPto = ptoCap.cap;
						result = this.calculatePtoOnDate(tempEmployee, date, shouldBeStartOfDay, true);
					}
				}
			}, this);
		}

		return result;
	};

	this.isDateWithinOneYearFromLastPtoUpdate = function(employee, date) {
		var diff = date - employee.lastPtoUpdate;
		var result = diff >= 0 && diff < MILLISECONDS_IN_A_YEAR;

		return result;
	};

	// How many hours of PTO will I need to use by the cap dates?
	this.calculateUseOrLose = function(employee) {
		var result = [];

		// Loop through each of the cap dates and generate a list of how much PTO will need to be used by the cap date
		angular.forEach(PTO_CAP_DATES, function(ptoCap) {
			if (this.isDateWithinOneYearFromLastPtoUpdate(employee, ptoCap.date)) {
				var oneSecondBeforeCap = new Date(ptoCap.date);
				oneSecondBeforeCap.setSeconds(-1);
				var pto = this.calculatePtoOnDate(employee, oneSecondBeforeCap);
				if (pto > ptoCap.cap) {
					result.push({date: ptoCap.date, amount: pto - ptoCap.cap});
				}
			}
		}, this);

		return result;
	};
});
