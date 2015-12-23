angular.module('app.components')
	.controller('HomeController', function($scope, DataStoreService, PtoService) {
	$scope.futurePto = undefined;
	$scope.ptoAsOf = new Date();

	$scope.minDate = new Date();

	$scope.ptoAccrualMatrix = [];

	$scope.accrualRate = undefined;
	$scope.useOrLose = [];
	$scope.currentPtoHours = undefined;

	$scope.showPtoCalculations = false;

	$scope.initialize = function() {
		var employeeData = DataStoreService.get("employee");
		$scope.employee = new Employee(employeeData);

		$scope.ptoAccrualMatrix = PtoService.getPtoAccrualMatrix();

		$scope.refresh();
	};

	$scope.save = function() {
		$scope.lastPto = +$scope.lastPto;
		DataStoreService.set("employee", $scope.employee);

		$scope.refresh();
	};

	$scope.hasRequiredInformation = function() {
		return $scope.employee.yearsEmployed !== undefined && $scope.employee.lastPto !== undefined && $scope.employee.lastPtoUpdate !== undefined;
	};

	$scope.determinePtoPerYear = function(){
		angular.forEach($scope.ptoAccrualMatrix, function(ptoAccrual) {
			if (ptoAccrual.yearsEmployed === $scope.employee.yearsEmployed) {
				$scope.employee.ptoPerYear = ptoAccrual.ptoPerYear;
			}
		});
	};

	$scope.getNow = function() {
		return new Date();
	};

	$scope.refresh = function() {
		if ($scope.hasRequiredInformation()) {
			// Ensure ptoPerYear is always set to what is defined in the accrual matrix based on years employed
			$scope.determinePtoPerYear();

			$scope.showPtoCalculations = true;
			$scope.employee.lastPto = +$scope.employee.lastPto;

			$scope.accrualRate = PtoService.ptoPerPayPeriod($scope.employee);
			$scope.useOrLose = PtoService.calculateUseOrLose($scope.employee);
			$scope.currentPtoHours = PtoService.calculatePtoOnDate($scope.employee, $scope.getNow());
		}
	};

	$scope.refreshFuturePto = function() {
		$scope.futurePto = PtoService.calculatePtoOnDate($scope.employee, $scope.ptoAsOf, true);
	};

	$scope.initialize();
});
