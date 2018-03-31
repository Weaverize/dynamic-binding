# Polymer Dynamic Binding
This mixin allows binding with dynamicaly created Polymer element.

## Getting started
To get started import `Bindable.js`.
Then simply apply the mixin to your the element that have to be bound using class extention.

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

## Bind the property
To bind the property your can use the following methods.

### Expose Property
To expose a property and allow binding it should have the flag `notify : true` in the property's definition.

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

## Unbind
When you create a bind a function is returned to undo it.

Example:
```js
var unbind = element._bind("prop", otherElement);
unbind();
```
Changes on both sides won't be propagated to the other.

If you make you use `_bindOneWay` twice to manually create the two-ways bind you can unbind one or both as you like.

## Using Custom Elements (untested)
This library should be able to bind vanilla custom elements (HTMLElement). You should call Binder in your element's constructor:

```js
class MyElement extends HTMLElement {
	constructor() {
		super();
		this._data = {};
		new Binder(this, "_data");
	}
}
```
Now your element properties stored in `_data` should be bindable using only `_bindOneWay` to which you have to provide your custom setter. `"_data"` should not be part of the path while binding.

Properties added to your `_data` will become bindable automatically.

## Important Notes

### Polymer properties
Polymer's properties are stored in `__data` (with two `_`). Root property you add there will also be bindable by this library. They might not be bindable with Polymer's binding mecanism though (untested).

### Binding sub-properties
If your using Polymer binding and this binding to bind sub-properties you should manually bind every step of the path leading to your property.

For example to bind `prop.subprop` your should use the following binding:
```js
element._bind("prop",otherElement);
element._bind("prop.subprop",otherElement);
```

### Avoid cyclic object !
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