/**
 * This class wraps an HTML <input> and makes it two-ways bindable on its "value" property
 * Check bindableinput for the equivalent directly overloading the `<input>`
 */
class BindableInput extends HTMLElement {
	static get is() {
		return "my-input";
	}
	constructor() {
		super();
		new Binder(this, "_data");
		var shadow = this.attachShadow({mode: 'open'});
		var input = document.createElement("input");
		input.onkeyup = function(e) {
			this.set("value", e.target.value);
		}.bind(this);
		this._bindOneWay("value", input, "value");
		shadow.appendChild(input);
	}
}
customElements.define(BindableInput.is, BindableInput);