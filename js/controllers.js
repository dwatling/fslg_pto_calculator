// Define Main PTO controller
//  Decided to split input fields and output bindings for clarity
app.controller('PTOCtrl', function($scope, $routeParams, $timeout, $dataStore, $fslg) {
	$scope.input = {}
	$scope.input.years_employed = $dataStore.get_years_employed();
	$scope.input.last_pto = $dataStore.get_last_pto();
	$scope.input.last_update = $dataStore.get_last_updated();
	$scope.input.pto_as_of = new Date().toLocaleDateString();
	$scope.input.save = function() {
		$dataStore.set_years_employed($scope.input.years_employed);
		$dataStore.set_last_pto($scope.input.last_pto);
		$dataStore.set_last_updated($scope.input.last_update);
	}

	$scope.output = {}
	$scope.output.use_or_lose = 0;
	$scope.output.current_pto_hours = 0;
	$scope.output.current_pto_seconds = 0;
	$scope.output.accrual_rate = function() {
		return $fslg.pto_per_pay_period($scope.input.years_employed);
	}
	$scope.output.future_pto = function() {
		return $fslg.calculate_future_pto($scope.input.pto_as_of, $scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);
	}
	$scope.output_recalculate = function() {
		$scope.output.use_or_lose = $fslg.calculate_use_or_lose($scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);
		$scope.output.current_pto_seconds = $fslg.calculate_current_pto_seconds($scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);
		$scope.output.current_pto_hours = $fslg.calculate_current_pto_hours($scope.input.years_employed, $scope.input.last_pto, $scope.input.last_update);

		$scope.input.save();

		$timeout($scope.output_recalculate, 250);
	}

	// Start expressions update timer
	$timeout($scope.output_recalculate, 100);
}
);
