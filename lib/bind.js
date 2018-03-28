/**
 * Bind de façon à ce que la propriété destination soit synchro avec la propriété de la source
 * @param {*} srcObj objet source à écouter
 * @param {String} srcProp nom de la propriété à écouter
 * @param {*} dstObj objet qui souhaite être synchro avec la source
 * @param {String} dstProp nom de la propriété synchronisée
 * @returns la source surchargée à utiliser
 */
function bind(srcObj, srcProp, dstObj, dstProp)
{
	return new Proxy(srcObj, {
		set(obj, prop, valeur) {
			console.log("setting " + prop + " of ", obj);
			if (prop == srcProp && dstObj[dstProp] != valeur)
			{
				dstObj[dstProp] = valeur;
			}
			return Reflect.set(obj, prop, valeur);
		}
	});
}

/**
 * Fonctionne dans le navigateur et dans NodeJS
 */
if (typeof window !== 'undefined')
{
	window.bind = bind;
}
else
{
	module.exports = bind;
}