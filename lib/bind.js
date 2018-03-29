var handler = {
	set(obj, prop, value, caller) {
		console.log("setting", prop, obj[prop], value);
		return Reflect.set(obj, prop, value, caller);
	}
};

function deepBind(binder, obj, property)
{
	/*
	for (var p in obj[property])
	{
		console.log(p, typeof obj[p]);
		if (obj[p] && typeof obj[p] == "object")
		{
			deepBind(binder, obj[p], p);
		}
	}
	//*/
	console.log("binding", property);
	return obj[property] = new Proxy(obj[property], handler);
}

function ProxyBind(element)
{
	element.binder = {

	}
	deepBind(element.binder, element, "__data");
}