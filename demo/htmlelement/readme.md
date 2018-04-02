# Dynamic Data-Binding of Custom Elements
This demo illustrates two-way dynamic data-binding on sub-properties.
One instance is declared in the dom the other is created through `document.createElement`.

## Elements
### ["my-element" (element.js)](element.js)
This is a very simple elements that holds the bindable properties `name.firstname` and `name.lastname`.
This data is displayed in two `<span>` and editable using one `<my-input>` custom element and one overloaded `<input>` native element.

### ["my-input" (myinput.js)](myinput.js)
Is a custom elements that wraps a native html `<input>` to allow two-way binding with its `value` property.

### ["createBindableInput()" (bindableinput.js)](bindableinput.js)
The function `createBindableInput()` creates an `<input>` and overloads it with a `new Binder`.
Internal binding is made to sync `input.value` and `input._data.value`.
For this purpose a custom setter is provided.