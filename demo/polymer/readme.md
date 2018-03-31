# Dynamic Data-Binding of Polymer Elements
This demo illustrates two-way dynamic data-binding on properties and sub-properties using Polymer Elements.

the data is
```json
{
	"msg" : "string",
	"prop" : {
		"test" : "string"
	}
}
```
bound in every objet, displayed and editable using `<paper-input>`.

## Run the demo
Before you can run the demo you have to install the dependencies:
```
bower install
```
Then serve the entire repository (because `/Bindable.js` is used) using for example `http-server`.

## Bindings
`<my-app>` and `<my-element>` are declared statically in the DOM, they are bound together using Polymer bindings (`{{msg}}` and `{{prop.test}}`).

`<my-element2>` is created using `document.createElement` when you press the button.

`<my-element>` and `<my-element2>` are bound together using this library's bindings:

```js
this._bind("msg", element);
this._bind("prop", element);
this._bind("prop.test", element);
```

When the data of any of those element is modified, all receive the change.
