angular.module('app.services')
	.service('PtoService', function() {
		var PTO_CAP_DATES = [
				{date: new Date(2015, 11, 26), cap: 80},
				{date: new Date(2016, 2, 26), cap: 40},
				{date: new Date(2016, 11, 24), cap: 40},
				{date: new Date(2017, 11, 23), cap: 40},		// TODO: verify
				{date: new Date(2018, 11, 22), cap: 40},		// TODO: verify
			];

		// TODO - These values currently include floating holidays, but I'm pretty sure those expire on a different date than the PTO cap
		var MAX_PTO_DAYS = 29;
		var PTO_ACCRUAL = [
				{up_to_years_employed: 25, pto_days: 29},
				{up_to_years_employed: 15, pto_days: 26},
				{up_to_years_employed: 10, pto_days: 23},
				{up_to_years_employed: 5, pto_days: 19},
				{up_to_years_employed: 1, pto_days: 15}
			];

		this.ptoPerYear = function(years_employed) {
			var result = MAX_PTO_DAYS;
			angular.forEach(PTO_ACCRUAL, function(accrual) {
				if (years_employed < accrual.up_to_years_employed) {
					result = accrual.pto_days;
				}
			});
			return result;
		};

		this.ptoPerPayPeriod = function(years_employed) {
			return this.ptoPerYear(years_employed) * 8 / 26;
		};

		this.ptoPerDay = function(years_employed) {
			return this.ptoPerPayPeriod(years_employed) / 14;	// TODO: There are actually only 10 working days in a pay period
		};

		this.ptoPerHour = function(years_employed) {
			return this.ptoPerDay(years_employed) / 24;
		};

		this.ptoPerMinute = function(years_employed) {
			return this.ptoPerHour(years_employed) / 60;
		};

		this.ptoPerSecond = function(years_employed) {
			return this.ptoPerMinute(years_employed) / 60;
		};

		// How many hours of PTO will I have on date X?
		this.calculatePtoOnDate = function(on_date, years_employed, last_pto, last_update) {
			var diff = (on_date - last_update) / 1000;
			var accrued_pto = diff * this.ptoPerSecond(years_employed);
			var result = last_pto + accrued_pto;

			return result;
		};

		this.isDateWithinOneYearFromNow = function(date) {
			var diff = ptoCap.date - new Date();
			var result = diff >= 0 && diff < MILLISECONDS_IN_A_YEAR;

			return result;
		};

		// How many hours of PTO will I need to use by the cap dates?
		this.calculateUseOrLose = function(years_employed, last_pto, last_update) {
			var result = [];

			// Loop through each of the cap dates and generate a list of how much PTO will need to be used by the cap date
			angular.forEach(PTO_CAP_DATES, function(ptoCap) {
				if (isDateWithinOneYearFromNow(ptoCap.date)) {
					var pto = this.calculatePtoOnDate(ptoCap.date, years_employed, last_pto, last_update);
					if (pto > ptoCap.cap) {
						result.push(ptoCap.date, pto - ptoCap.cap);
					}
				}
			});

			return result;
		};

		this.calculateCurrentPtoHours = function(years_employed, last_pto, last_update) {
			return this.calculatePtoOnDate(new Date(), years_employed, last_pto, last_update);
		};

		this.calculateCurrentPtoSeconds = function(years_employed, last_pto, last_update) {
			return this.calculatePtoOnDate(new Date(), years_employed, last_pto, last_update) * 60 * 60;
		};

		this.calculateFuturePto = function(on_date, years_employed, last_pto, last_update) {
			var temp = new Date(on_date);
			temp.setHours(23);
			temp.setMinutes(59);
			temp.setSeconds(59);
			return this.calculatePtoOnDate(temp, years_employed, last_pto, last_update);
		};
	});
