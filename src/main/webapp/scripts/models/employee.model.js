var Employee = function(json) {
	if (json === undefined) {
		json = {};
	}

	this.yearsEmployed = json.yearsEmployed;
	this.ptoPerYear = json.ptoPerYear;
	this.lastPto = json.lastPto;
	this.lastPtoUpdate = json.lastPtoUpdate || new Date();
};