angular.module('app.services')
	.service('DataStoreService', ['$window', '$log', function($window, $log) {
		this.set = function(key, value) {
			if (angular.isDate(value)) {
				value = value.toJSON();
			} else if (angular.isObject(value)) {
				value = angular.toJson(value);
			}
			$log.debug("Setting '" + key + "' to: ", value);
			$window.localStorage.setItem(key, value);
		};

		this.get = function(key, defaultValue) {
			var result = $window.localStorage.getItem(key);
			if (result === null) {
				result = undefined;
			}
			if (!angular.isDefined(result) && defaultValue !== undefined) {
				result = defaultValue;
			} else if (result !== undefined) {
				// I'm not happy with this. There's gotta be a cleaner way to convert the stored value back to its original type
				if (result.indexOf("{") === 0 || result.indexOf("[") === 0) {
					result = angular.fromJson(result);
				} else {
					var temp = Number(result);
					if (temp.toString() !== 'NaN') {
						result = temp;
					} else {
						temp = new Date(result);
						if (temp.toString() !== 'Invalid Date') {
							result = temp;
						}
					}
				}
			}

			$log.debug("'" + key + "' is: ", result);
			return result;
		};
	}]);