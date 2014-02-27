// Extends Date object to include nice to have methods...
Date.prototype.end_of_year = function() {
	this.setHours(23);
	this.setMinutes(59);
	this.setSeconds(59);
	this.setMonth(11);
	this.setDate(31);
	return this;
}

Date.prototype.end_of_day = function() {
	this.setHours(23);
	this.setMinutes(59);
	this.setSeconds(59);
	return this;
}
