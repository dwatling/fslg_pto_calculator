angular.module('app.components')
	.controller('HomeController', ['$scope', '$routeParams', 'DataStoreService', 'PtoService', '$log', function($scope, $routeParams, DataStoreService, PtoService, $log) {
	$scope.futurePto = undefined;
	$scope.ptoAsOf = new Date();

	$scope.minDate = new Date();

	$scope.ptoAccrualMatrix = [];

	$scope.useOrLose = [];
	$scope.currentPtoHours = undefined;

	$scope.showPtoCalculations = false;

	$scope.initialize = function() {
		$scope.employee = DataStoreService.get("employee") || new Employee();

		$scope.ptoAccrualMatrix = PtoService.getPtoAccrualMatrix();

		$scope.update();
	};

	$scope.update = function() {
		if ($scope.employee.yearsEmployed !== undefined && $scope.employee.lastPto !== undefined && $scope.employee.lastPtoUpdate !== undefined) {
			$scope.showPtoCalculations = true;
		}

		$scope.recalculate();
	};

	$scope.save = function() {
		$scope.lastPto = +$scope.lastPto;
		DataStoreService.set("employee", $scope.employee);

		$scope.update();
	};

	$scope.accrual_rate = function() {
		return PtoService.ptoPerPayPeriod($scope.employee);
	};

	$scope.updateFuturePto = function() {
		$scope.futurePto = PtoService.calculateFuturePto($scope.employee, $scope.ptoAsOf, true);
	};

	$scope.recalculate = function() {
		$scope.useOrLose = PtoService.calculateUseOrLose($scope.employee);
		$scope.currentPtoHours = PtoService.calculateCurrentPtoHours($scope.employee);
	};

	$scope.initialize();
}]);
