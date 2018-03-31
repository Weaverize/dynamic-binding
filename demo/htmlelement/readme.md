# Dynamic Data-Binding of Custom Elements
This demo illustrates two-way dynamic data-binding on sub-properties.
One instance is declared in the dom the other is created through `document.createElement`.

## Elements
### ["my-input" (myinput.js)](myinput.js)
Is a custom elements that wraps a native html `<input>` to allow two-way binding with its `value` property.

### ["my-element" (element.js)](element.js)
This is a very simple elements that holds the bindable properties `name.firstname` and `name.lastname`.

This data is displayed in two `<span>` and editable using two `<my-input>`.