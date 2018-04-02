/**
 * Simple elements that holds the bindable properties "name.firstname" and "name.lastname"
 */
class MyElement extends HTMLElement {
	constructor() {
		super();
		this.data = {
			name : {
				firstname : "John"
			}
		};
		new Binder(this,"data");

		//bindable properties can be declared whenever
		this.data.name.lastname = "Doe";
	}
	static get is() {
		return "my-element"
	}
	connectedCallback() {
		var shadow = this.attachShadow({mode: 'open'});

		var div = document.createElement('div');

		var firstname = document.createElement('span');
		var lastname = document.createElement('span');
		var divider = document.createElement('span');
		divider.innerText = " - ";
		
		div.appendChild(firstname);
		div.appendChild(divider);
		div.appendChild(lastname);
		shadow.appendChild(div);
		
		var inputfirst = createBindableInput();
		var inputlast = document.createElement('my-input');

		shadow.appendChild(inputfirst);
		shadow.appendChild(inputlast);

		this._bindOneWay("name.firstname", firstname, "innerText");
		this._bindOneWay("name.lastname", lastname, "innerText");
		this._bind("name.firstname", inputfirst, "value");
		this._bind("name.lastname", inputlast, "value");
		//*/
	}
}
customElements.define(MyElement.is, MyElement);