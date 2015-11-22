angular.module('app.components')
	.controller('HomeController', ['$scope', '$routeParams', '$timeout', 'DataStoreService', 'PtoService', function($scope, $routeParams, $timeout, DataStoreService, PtoService) {
	$scope.input = {};
	$scope.output = {};

	$scope.ptoAccrualMatrix = [];

	$scope.initialize = function() {
		$scope.input.years_employed = DataStoreService.get("years_employed");
		$scope.input.last_pto = DataStoreService.get("last_pto");
		$scope.input.last_update = DataStoreService.get("last_updated");
		$scope.input.pto_as_of = new Date().toLocaleDateString();
		$scope.output.use_or_lose = 0;
		$scope.output.current_pto_hours = 0;
		$scope.output.current_pto_seconds = 0;

		$scope.ptoAccrualMatrix = PtoService.getPtoAccrualMatrix();

		// Start expressions update timer
		$timeout($scope.output_recalculate, 250);
	};

	$scope.save = function() {
		DataStoreService.set("years_employed", $scope.input.years_employed);
		DataStoreService.set("last_pto", $scope.input.last_pto);
		DataStoreService.set("last_updated", $scope.input.last_update);
	};

	$scope.accrual_rate = function() {
		return PtoService.ptoPerPayPeriod($scope.input.years_employed);
	};

	$scope.future_pto = function() {
		return PtoService.calculateFuturePto($scope.input.pto_as_of, $scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);
	};

	$scope.output_recalculate = function() {
		$scope.output.use_or_lose = PtoService.calculateUseOrLose($scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);
		$scope.output.current_pto_seconds = PtoService.calculateCurrentPtoSeconds($scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);
		$scope.output.current_pto_hours = PtoService.calculateCurrentPtoHours($scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);

		$timeout($scope.output_recalculate, 250);
	};

	$scope.initialize();
}]);
