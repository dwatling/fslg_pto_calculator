angular.module('AppServices', ['ngCookies']).
	// DataStore service. Uses Cookies to save / load
	factory('$dataStore', function($cookies) {
		return new function() { 
			this.set_last_pto = function(amount) {
				$cookies.last_pto = amount;
			}
			this.get_last_pto = function() {
				return this._getValue($cookies.last_pto, 0);
			}
			this.set_last_updated = function(date) {
				$cookies.last_update = date;
			}
			this.get_last_updated = function() {
				return this._getValue($cookies.last_update, new Date().toLocaleDateString());
			}
			this.set_years_employed = function(years) {
				$cookies.years_employed = years;
			}
			this.get_years_employed = function() {
				return this._getValue($cookies.years_employed, 0);
			}

			this._getValue = function(value, defaultValue) {
				var result = defaultValue;
				if (angular.isDefined(value)) {
					result = value;
				}
				return result;
			}
		}
	}).

	// FSLG service that handles all PTO calculates
	factory('$fslg', function() {
		return new function() {
			this.pto_per_year = function(years_employed) {
				var result = 0;
				if (years_employed < 1) {
					result = 15;
				} else if (years_employed < 5) {
					result = 19;
				} else if (years_employed < 10) {
					result = 23;
				} else if (years_employed < 15) {
					result = 26;
				} else if (years_employed < 25) {
					result = 29;
				} else {
					result = 29;
				}
				return result;
			}

			this.yearly_pto_cap = function() {
				return 80;
			}

			this.pto_per_pay_period = function(years_employed) {
				return this.pto_per_year(years_employed) * 8 / 26;
			}

			this.pto_per_day = function(years_employed) {
				return this.pto_per_pay_period(years_employed) / 14;
			}

			this.pto_per_hour = function(years_employed) {
				return this.pto_per_day(years_employed) / 24;
			}

			this.pto_per_minute = function(years_employed) {
				return this.pto_per_hour(years_employed) / 60;
			}

			this.pto_per_second = function(years_employed) {
				return this.pto_per_minute(years_employed) / 60;
			}

			// How many hours of PTO will I have on date X?
			this.calculate_pto_on_date = function(on_date, years_employed, last_pto, last_update) {
				var last_update = new Date(last_update);

				var diff = (on_date - last_update) / 1000;
				var accrued_pto = diff * this.pto_per_second(years_employed);
				var result = eval(last_pto) + accrued_pto;

				return result;
			}

			// How many hours of PTO will I need to use by the end of the year?
			this.calculate_use_or_lose = function(years_employed, last_pto, last_update) {
				var eoy = new Date().end_of_year();

				var eoy_pto = this.calculate_pto_on_date(eoy, years_employed, last_pto, last_update);
				var result = eoy_pto - this.yearly_pto_cap();
				if (result < 0) {
					result = 0;
				}

				result = result;
	
				return result;
			}

			// How much PTO do I have now?
			this.calculate_current_pto_hours = function(years_employed, last_pto, last_update) {
				return this.calculate_pto_on_date(new Date(), years_employed, last_pto, last_update);
			}

			// How much PTO do I have now (in seconds)?
			this.calculate_current_pto_seconds = function(years_employed, last_pto, last_update) {
				return this.calculate_pto_on_date(new Date(), years_employed, last_pto, last_update) * 60 * 60;
			}

			this.calculate_future_pto = function(on_date, years_employed, last_pto, last_update) {
				var temp = new Date(on_date).end_of_day();
				return this.calculate_pto_on_date(temp, years_employed, last_pto, last_update);
			}
		}
	});
