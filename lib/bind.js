var binds = new Map;
var targets = new Map;

function register(newbind, property) {
	if (binds.has(newbind)) {
		console.log("this bind already is registered", binds.get(newbind), property);
	}
	else {
		console.debug("registering", newbind);
		binds.set(newbind, []);
	}
}

function resolveParent(obj, path) {
	var steps = path.split(".");
	steps.pop();
	var crawled = obj;
	for (var step of steps) {
		crawled = crawled[step];
	}
	return crawled;
}

function makeSetter(obj, prop) {
	return function (value) {
		if (obj[prop] != value)
			obj[prop] = value;
	}
}

function bind(srcObj, path, destObj, destProp) {
	var parent = resolveParent(srcObj.__data, path);
	var property = path.split(".").pop();
	if (parent && binds.has(parent)) {
		var setter = makeSetter(destObj, destProp);
		setter(parent[property]);
		binds.get(parent).push({
			property: property,
			setter: setter
		});
	}
	else {
		console.log("this property doesn't exist or cannot be binded (is it notify: true ?)");
	}
}

var binder = {
	binds: binds,
	register: register,
	bind: bind,
	resolve: resolveParent
}

window.binder = binder;

function notifyChanges(obj, prop, value) {
	if (targets.has(obj)) {
		var proxy = targets.get(obj);
		if (binds.has(proxy)) {
			var watchers = binds.get(proxy);
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
}

var handler = {
	set(obj, prop, value, caller) {
		if (obj[prop] != value) {
			console.debug("setting", prop, obj[prop], value);
			var returnValue = Reflect.set(obj, prop, value);
			if (value && typeof value == "object") {
				console.debug("new value is an object", prop, obj[prop]);
				returnValue = obj[prop] = deepBind(binder, obj, prop);
			}
			console.debug("returning", returnValue);
			notifyChanges(obj, prop, value);
			return returnValue;
		}
		else {
			//the value is unchanged, lets avoid propagation of unchanged
			return Reflect.set(obj, prop, value);
		}
	}
};

function deepBind(binder, obj, property) {
	if (obj[property] && typeof obj[property] == "object") {
		//*
		for (var subprop in obj[property]) {
			console.debug("typeof", subprop, typeof obj[property][subprop]);
			if (obj[property][subprop] && typeof obj[property][subprop] == "object") {
				obj[property][subprop] = deepBind(binder, obj[property], subprop);
			}
		}
		//*/
		var proxy = new Proxy(obj[property], handler);
		binder.register(proxy);
		targets.set(obj[property], proxy);
		return proxy;
	}
}

function ProxyBind(element) {
	element.binder = binder;
	element["__data"] = deepBind(element.binder, element, "__data");
}