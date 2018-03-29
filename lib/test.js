var spyer = {
	construct(target, args, extender) {
		console.log("constructing new spy", target, args, extender);
		return Reflect.construct(target, args, extender);
	},
	defineProperty(obj, prop, value, caller) {
		if (value && typeof value == "object") {
			console.log("spying on new property", prop);
			return Reflect.defineProperty(obj, prop, new Proxy(value, this), caller);
		}
		else
			return Reflect.defineProperty(obj, prop, value, caller);
	},
	set(obj, prop, value, caller) {
		if (value && typeof value == "object" && prop != "_template") {
			console.log("spying on property", prop);
			return Reflect.set(obj, prop, new Proxy(value, this), caller);
		}
		else {
			console.log("property ", prop, "changed from", obj[prop], "to", value);
			return Reflect.set(obj, prop, value, caller);
		}
	},
	get(obj, prop, caller) {
		console.log("getting", prop, obj);
		if (prop == "msg" || prop == "test")
		{
			return new Proxy(obj[prop], simple);
		}
		else
		{
			return Reflect.get(obj, prop, caller);
		}
	},
	apply(target, that, args) {
		console.log("calling ", target, that, args);
		return Reflect.apply(target, that, args);
	}
};

var propSpy = {
	set(obj, prop, value, caller) {
		if (prop == "__properties" || prop == "__ownProperties")
		{
			console.log("setting properties", value);
			var proxied = {};
			for (key in value)
			{
				proxied[key] = new Proxy(value[key], simple);
			}
			console.log("proxied:", proxied);
			return Reflect.set(obj, prop, proxied, caller);
		}
		else
		{
			return Reflect.set(obj, prop, value, caller);
		}
	}
}

var PolyProxy = function (superclass) {
	return new Proxy(class extends superclass { }, spyer);
}

class Vanilla extends HTMLElement
{
	static get is() {
		return 'my-element';
	}
	constructor() {
		  super();
		this.innerHTML = "<div>Coucou !</div>";
	}
}
//customElements.define(Vanilla.is, new Proxy(Vanilla, spyer));