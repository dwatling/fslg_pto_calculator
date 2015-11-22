angular.module('app.components')
	.controller('HomeController', ['$scope', '$routeParams', '$timeout', 'DataStoreService', 'PtoService', function($scope, $routeParams, $timeout, DataStoreService, PtoService) {
	$scope.input = {};
	$scope.output = {};

	$scope.initialize = function() {
		$scope.input.years_employed = DataStoreService.get_years_employed();
		$scope.input.last_pto = DataStoreService.get_last_pto();
		$scope.input.last_update = DataStoreService.get_last_updated();
		$scope.input.pto_as_of = new Date().toLocaleDateString();
		$scope.output.use_or_lose = 0;
		$scope.output.current_pto_hours = 0;
		$scope.output.current_pto_seconds = 0;

		// Start expressions update timer
		$timeout($scope.output_recalculate, 250);
	};

	$scope.save = function() {
		DataStoreService.set_years_employed($scope.input.years_employed);
		DataStoreService.set_last_pto($scope.input.last_pto);
		DataStoreService.set_last_updated($scope.input.last_update);
	};

	$scope.accrual_rate = function() {
		return PtoService.pto_per_pay_period($scope.input.years_employed);
	};

	$scope.future_pto = function() {
		return PtoService.calculate_future_pto($scope.input.pto_as_of, $scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);
	};

	$scope.output_recalculate = function() {
		$scope.output.use_or_lose = ptoService.calculate_use_or_lose($scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);
		$scope.output.current_pto_seconds = ptoService.calculate_current_pto_seconds($scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);
		$scope.output.current_pto_hours = ptoService.calculate_current_pto_hours($scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);

		$timeout($scope.output_recalculate, 250);
	};

	$scope.initialize();
}]);
