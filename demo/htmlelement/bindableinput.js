/**
 * This function returns an overloaded `<input>` and the necessary to make it bindable
 * Check in myinput.js for the equivalent using a Custom Element
 */
function createBindableInput() {
	var input = document.createElement("input");
	new Binder(input, "_data");
	input.onkeyup = function(e) {
		input.set("value", e.target.value);
	}.bind(input);
	//we want to update input.value not input._data.value, a custom setter has to be provided for that purpose:
	input._bindOneWay("value", input, "value", function(value) {
		input.value = value;
	});
	return input;
}