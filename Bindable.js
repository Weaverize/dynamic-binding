// Copyright (c) 2018 Weaverize SAS <dev@weaverize.com>.

/**
 * Class Mixin that extends a Polymer Class to add dynamic binding capabilities
 * Adds a _bind method
 * @param {*} superClass the class to extend
 */
var Bindable = function (superClass) {
	return class extends superClass {
		constructor() {
			super();
			//__data is where Polymer stores it's binded data
			new Binder(this, "__data");
		}

		/**
		 * Sync the properties of two objects together both ways
		 * Shared value will the one of the object bound to
		 * @param {String} path dotted path of the property within this object
		 * @param {*} destObj object to sync
		 * @param {String} [destPath] dotted path to the destination property, path will be copied if not provided
		 * @returns {function} function to undo the binding
		 */
		_bind(path, destObj, destPath) {
			//mock method replaced by Binder.bindPropertyBothWays at runtime
			//used for documentation purposes
		}

		/**
		 * Binds a property of this object with a target's object property
		 * @param {String} path dotted path of the property within this object
		 * @param {*} destObj object to sync
		 * @param {String} [destPath] dotted path to the destination property, path will be copied if not provided
		 * @param {function} [setter] custom function to set a new value on the destination object
		 * @returns {function} function to undo the binding
		 */
		_bindOneWay(path, destObj, destPath, setter) {
			//mock method replaced by Binder.bindProperty at runtime
			//used for documentation purposes
		}
	}
}

/**
 * Class that handles the dynamic binding
 * @param {*} element target to make bindable
 * @param {String} entrypoint name of the root property to make bindable
 */
var Binder = class {
	constructor(element, entrypoint) {
		//Map => { keys: proxy, values: [ { property : name, setting : function } ]
		this.binds = new Map;
		this.element = element;
		this.entrypoint = entrypoint;

		if (!this.element[this.entrypoint] || typeof this.element[this.entrypoint] != "object")
		{
			this.element[this.entrypoint] = {};
		}

		this.handler = {
			set(obj, prop, value, parent) {
				if (obj[prop] != value) {
					//console.log("setting", prop, obj[prop], value);
					Reflect.set(obj, prop, value);
					if (value && typeof value == "object") {
						obj[prop] = this.deepBind(obj[prop]);
					}
					this.notifyChanges(obj, prop, value, parent);
					return true;
				}
				else {
					//the value is unchanged, lets avoid propagation of unchanged
					return Reflect.set(obj, prop, value);
				}
			},
			deleteProperty(obj, prop) {
				//FIXME: remove from this.binds the property
				//don't know how to find the bind key corresponding to the current proxy...
				//maybe by adding a reference to the original obj[prop] in this.binds
				return Reflect.deleteProperty(obj, prop);
			}
		}
		this.handler.set = this.handler.set.bind(this);
		this.handler.deleteProperty = this.handler.deleteProperty.bind(this);

		this.bindProperty = this.bindProperty.bind(this);
		this.bindPropertyBothWays = this.bindPropertyBothWays.bind(this)

		element[entrypoint] = this.deepBind(element[entrypoint]);

		//to expose the binding at runtime uncomment:
		element._binds = this.binds;
		
		//making the default binding two-way by default seemed the default behavior
		element._bind = this.bindPropertyBothWays;
		element._bindOneWay = this.bindProperty;

		this.addGetterAndSetter();
	}

	/**
	 * Adds a bindable property to the register
	 * @param {*} property 
	 */
	register(property) {
		if (this.binds.has(property)) {
			console.log("this property already is registered as a bind", this.binds.get(property));
		}
		else {
			this.binds.set(property, []);
		}
	}

	/**
	 * Retrieves a property of an object using a path
	 * @param {*} obj object containing the property
	 * @param {String} path dotted path to the property
	 * @returns the object retrieved
	 */
	resolve(obj, path) {
		var steps = path.split(".");
		var crawled = obj;
		if (path != "") {
			for (var step of steps) {
				crawled = crawled[step];
			}
		}
		return crawled;
	}

	/**
	 * Retrieves the parent property of a property
	 * @param {*} obj object containing the property
	 * @param {String} path dotted path to the children property
	 * @returns the parent property of the children property
	 */
	resolveParent(obj, path) {
		var steps = path.split(".");
		steps.pop();
		return this.resolve(obj, steps.join("."));
	}

	/**
	 * Setter factory that provides a function to set a value
	 * @param {*} obj Object to set
	 * @param {String} prop name of the property to set
	 * @returns function able to set the value 
	 */
	makeSetter(obj, prop) {
		return function (value) {
			if (obj.get != undefined)
			{
				if (obj.get(prop) != value) {
					obj.set(prop, value);
				}
				if (obj.notifyPath != undefined)
				{
					obj.notifyPath(prop);
				}
			}
			else
			{
				var parent = this.resolveParent(obj, prop);
				var property = prop.split(".").pop();
				if (parent[property] != value)
				{
					parent[property] = value;
				}
			}
		}
	}

	/**
	 * Sync the properties of two objects together both ways
	 * Shared value will the one of the object bound to
	 * @param {String} path dotted path of the property within this object
	 * @param {*} destObj object to sync
	 * @param {String} [destPath] dotted path to the destination property, path will be copied if not provided
	 * @returns {function} function to undo the binding
	 */
	bindPropertyBothWays(path, destObj, destPath) {
		var destPath = destPath || path;
		var undos = [];
		undos.push(this.bindProperty(path, destObj, destPath));
		if (typeof destObj._bind == "function") {
			undos.push(destObj._bindOneWay(destPath, this.element, path));
		}
		else
		{
			console.log(destObj, "is not Bindable, binding will be one way only.\nUse ._bindOneWay() or make it Bindable to avoid this message.");
		}
		return function () {
			undos.forEach(function (undo) {
				undo();
			});
		}
	}

	/**
	 * Binds a property of this object with a target's object property
	 * @param {String} path dotted path of the property within this object
	 * @param {*} destObj object to sync
	 * @param {String} [destPath] dotted path to the destination property, path will be copied if not provided
	 * @param {function} [setter] custom function to set a new value on the destination object
	 * @returns {function} function to undo the binding
	 */
	bindProperty(path, destObj, destPath, setter) {
		var destPath = destPath || path;
		var parent = this.resolveParent(this.element[this.entrypoint], path);
		var property = path.split(".").pop();
		if (parent && this.binds.has(parent)) {
			var setting = {
				property: property,
				setter: setter || this.makeSetter(destObj, destPath)
			};
			setting.setter = setting.setter.bind(this);
			setting.setter(parent[property]);
			var binds = this.binds.get(parent);
			binds.push(setting);
			//unbinding:
			return function () {
				if (binds.indexOf(setting) != -1) {
					binds.splice(binds.indexOf(setting), 1);
				}
			};
		}
		else {
			console.log("this property doesn't exist or cannot be binded (is it notify: true ?)", parent, property);
		}
	}

	/**
	 * Notifies if necessary of the change to a bindable property's value
	 * @param {*} obj proxy's target object
	 * @param {*} prop name of the property that was modified
	 * @param {*} value new value of the property
	 * @param {*} proxy the proxy that intercepted the call
	 */
	notifyChanges(obj, prop, value, proxy) {
		if (this.binds.has(proxy)) {
			var watchers = this.binds.get(proxy);
			for (var watcher of watchers) {
				if (watcher.property == prop) {
					watcher.setter(value);
				}
			}
		}
		else {
			console.log("something went really wrong !");
		}
	}

	/**
	 * Crawls recursively within a tree of object and replace the object by proxies
	 * Ignores non object property
	 * FIXME: /!\ Doesn't handle cycling in object /!\
	 * @param {*} property replace it by a proxy
	 * @returns the proxy replacement to the property
	 */
	deepBind(property) {
		if (property && typeof property == "object") {
			for (var subprop in property) {
				if (property[subprop] && typeof property[subprop] == "object") {
					property[subprop] = this.deepBind(property[subprop]);
				}
			}
			var proxy = new Proxy(property, this.handler);
			this.register(proxy);
			return proxy;
		}
	}

	addGetterAndSetter() {
		if (this.element.get == undefined)
		{
			this.element.get = function(path) {
				return this.resolve(this.element[this.entrypoint], path);
			}.bind(this);
		}

		if (this.element.set == undefined)
		{
			this.element.set = function(path, value) {
				var parent = this.resolveParent(this.element[this.entrypoint], path);
				var property = path.split(".").pop();
				parent[property] = value;
			}.bind(this);
		}
	}
}