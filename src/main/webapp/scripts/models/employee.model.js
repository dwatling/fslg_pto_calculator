var Employee = function(json) {
	if (json === undefined) {
		json = {};
	}

	this.yearsEmployed = json.yearsEmployed;
	this.ptoPerYear = json.ptoPerYear;			// TODO - This really shouldn't be in the model since the value doesn't need to be saved to storage
	this.lastPto = json.lastPto;
	this.lastPtoUpdate = json.lastPtoUpdate ? new Date(json.lastPtoUpdate) : new Date();
};