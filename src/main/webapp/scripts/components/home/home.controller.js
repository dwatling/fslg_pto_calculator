angular.module('app.components')
	.controller('HomeController', ['$scope', '$routeParams', '$interval', 'DataStoreService', 'PtoService', '$log', function($scope, $routeParams, $interval, DataStoreService, PtoService, $log) {
	$scope.yearsEmployed = undefined;
	$scope.lastPto = undefined;
	$scope.lastPtoUpdate = undefined;
	$scope.futurePto = undefined;

	$scope.output = {};

	$scope.ptoAccrualMatrix = [];

	$scope.showPtoCalculations = false;

	var interval;

	$scope.initialize = function() {
		$scope.yearsEmployed = DataStoreService.get("years_employed");
		$scope.lastPto = DataStoreService.get("last_pto");
		$scope.lastPtoUpdate = DataStoreService.get("last_updated", new Date());

		$scope.ptoAccrualMatrix = PtoService.getPtoAccrualMatrix();

		$scope.update();
	};

	$scope.$on("$destroy", function() {
		if (interval !== undefined) {
			$interval.cancel(interval);
			interval = undefined;
		}
	});

	$scope.update = function() {
		if ($scope.yearsEmployed !== undefined && $scope.lastPto !== undefined && $scope.lastPtoUpdate !== undefined) {
			$scope.showPtoCalculations = true;
		}

		if ($scope.showPtoCalculations) {
			interval = $interval($scope.recalculate, 250);
		}
	};

	$scope.save = function() {
		$scope.lastPto = +$scope.lastPto;
		DataStoreService.set("years_employed", $scope.yearsEmployed);
		DataStoreService.set("last_pto", $scope.lastPto);
		DataStoreService.set("last_updated", $scope.lastPtoUpdate);

		$scope.update();
	};

	$scope.accrual_rate = function() {
		return PtoService.ptoPerPayPeriod($scope.yearsEmployed);
	};

	$scope.updateFuturePto = function(arg1, arg2) {
		$scope.futurePto = PtoService.calculateFuturePto($scope.ptoAsOf, $scope.yearsEmployed, $scope.lastPto, $scope.lastPtoUpdate);
	};

	$scope.recalculate = function() {
		$scope.output.use_or_lose = PtoService.calculateUseOrLose($scope.yearsEmployed, $scope.lastPto, $scope.lastPtoUpdate);
		$scope.output.current_pto_seconds = PtoService.calculateCurrentPtoSeconds($scope.yearsEmployed, $scope.lastPto, $scope.lastPtoUpdate);
		$scope.output.current_pto_hours = PtoService.calculateCurrentPtoHours($scope.yearsEmployed, $scope.lastPto, $scope.lastPtoUpdate);
	};

	$scope.initialize();
}]);
