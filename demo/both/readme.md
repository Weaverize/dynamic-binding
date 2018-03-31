# Dynamic Data-Binding of Custom Elements and Polymer
This demo illustrate dynamic data-binding between Custom Elements and Polymer Elements.

4 elements (2 HTMLElement and 2 Polymer) are bound together on properties and sub-properties level. 2 are created statically, 2 dynamically, all are bound together dynamically by transitivity:

```
1 <-> 2
2 <-> 3
2 <-> 4
```

The Polymer element is defined in [../polymer/my-element2.html](../polymer/my-element2.html) the Custom Element is defined in [../htmlelement/element.js](../htmlelement/element.js).