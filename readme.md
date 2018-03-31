# Dynamic Data-Binding
This mixin allows data-binding with dynamicaly created Native Custom Element, Polymer Element or both together.

# Getting started
To get started
```
bower install --save Weaverize/dynamic-binding
```
then import `Bindable.js` in your html file:
```html
<script src="bower_components/dynamic-data-binding/Bindable.js"></script>
```

## Using native Custom Elements
For custom elements just call a `new Binder` on your Custom Element.
```js
class MyElement extends HTMLElement {
	constructor() {
		super();
		this.data = {
			name : {
				firstname : "John"
			}
		};
		new Binder(this,"data");

		//new property can be declared whenever
		this.data.name.lastname = "Doe";
	}
}
```
Then in your html you can bind your objects together.
```html
<body>
	<my-element id="element"></my-element>
	<script>
		var element1 = document.getElementById("element");
		var element2 = document.createElement("my-element");
		document.body.appendChild(element2);
		element1._bind("name.firstname", element2);
		element1._bind("name.lastname", element2);
	</script>
</body>
```
Check out the example provided in [demo/htmlelement](demo/htmlelement) that binds with a native html `<input>`.

## Using Polymer Elements
For Polymer Elements, simply apply the mixin to your the element that have to be bound using class extention.

For example:
```js
class MyElement extends Bindable(Polymer.Element) {
	//..
}

class MyOtherElement extends Bindable(Polymer.Element) {
	//..
}
```

You can bind properties at run time using like in the following examples:
```js
element._bind("my_prop", otherElement);
element._bind("prop", otherElement, "otherProp");
element._bind("works.also.on.subprop", otherElement, "on.both.sides");
```

A complete example is available in the [demo/polymer](demo/polymer) it mixes normal Polymer with bindings from this library.

## Custom Elements and Polymer Elements together
You anything else to do, just bind the property of one with the other.

Check out [demo/both](demo/both) for simple demo using elements from the two other demo.

# Documentation
Here is a detailed documentation of the library.

## Datastore
The datastore is where the bindable properties are.
Every property found in the datastore are automatically bindable.
They don't have to be defined in advance.

For Custom Elements the datastore can have any name. For Polymer we use the Polymer's datastore `__data` (with two `_`). To expose a Polymer property it should have the flag `notify : true` in its definition.

## Overloading your Element
To make an element's properties bindable your have to overload it with this library.

### `new Binder(element, datastore)`
Native elements are overloaded by the contructor of the Binder class.
- `element` is the element to overload, usually `this`.
- `datastore` is the name of the datastore corresponding to `this[datastore]`. It should be an object, it will be created if the property is not defined or if it's not an object.

The constructor adds the following methods if needed:
- `#.get(path)`
	- `path` is the dotted string path to the property inside the datastore (without the name of the datastore). 
- `#.set(path, value)`
	- `path` is the dotted string path, just like for `get`.
	- `value` is the value to set, it can be of any type.

### `extends Bindable(Polymer.Element)`
Polymer Elements don't have to specify a datastore, `__data` will be used automatically.

Polymer Elements already have `get` and `set` defined natively.

## Binding

### `#._bind(path, obj, [destPath])`
This method creates a two-way binding between two properties of two objects.
- `path` is the dotted path to the property in first object
- `obj` is the destination object
- `destPath` is the optional dotted path to the destination property. `path` would be used if not provided

`_bind` returns a `function()` that undoes the binding.

The value from the first object will be copied in the second object.

### `#._bindOneWay(path, obj, [destPath], [setter])`
This method creates a one-way binding between two properties of two objects.
- `path` is the dotted path to the property in first object
- `obj` is the destination object
- `destPath` is the optional dotted path to the destination property. `path` would be used if not provided
- `setter` is an optional fonction to provide a custom way to set the value in the destination object (`obj`). It should have the following signature `function(value)`.

`_bindOneWay` returns a `function()` that undoes the binding.

The value from the first object will be copied in the second object.

`_bindOneWay` is useful when your binding to a native html element like a `<div>` or an `<input>` that you want to sync:
```js
this._bindOneWay("name.firstname", div, "innerText");
this._bindOneWay("name.firstname", input, "value");
```

## Unbinding
When you create a bind a function is returned to undo it.

Example:
```js
var unbind = element._bind("prop", otherElement);
unbind();
```
Changes on both sides will not be propagated to the other after this.

If you make you use `_bindOneWay` twice to manually create the two-ways bind that you can unbind one or both as you like.

# Important Notes

## Binding sub-properties
If your using Polymer and this library to bind sub-properties you should manually bind every step of the path leading to your property.

For example to bind `prop.subprop` your should use the following binding:
```js
element._bind("prop",otherElement);
element._bind("prop.subprop",otherElement);
```

Polymer seems to send an entire object when one of its property is changed.

## Avoid cyclic object !
The current implementation does a recursive crawl through all properties to make them bindable. You have to avoid circular reference (direct or indirect) or an infinite loop will occur.

Avoid this:
```js
prop : {
	subprop : {
		subsubprop : prop
	}
}
```

# Credit
Copyright (c) 2018, [Weaverize SAS](http://www.weaverize.com). All rights reserved. Contact: <dev@weaverize.com>.