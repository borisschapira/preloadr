/**
 * Preload a collection of images (license : GPL v2)
 * @author Boris Schapira
 *
 * @param {(object|string[])} srcCollection - A collection of images
 * @param {function(object)=} callbackOne - A function callback that is called after each loading
 * @param {function((object|object[]))=} callbackAll - A function callback that is called after all the loading
 * @param {boolean} [sequential=false] - A boolean defining wheter to force the sequential loading. Default : false.
 *
 */
function preloadr(srcCollection, callbackOne, callbackAll, sequential) {

    sequential = typeof sequential !== 'undefined' ? sequential : false;

    var imgCollection = srcCollection instanceof Array ? [] : {};
    var srcIndexArray = [];
    for (var key in srcCollection) {
        srcIndexArray.push(key);
    }

    function onEvent(index) {
        return function () {
                    load(imgCollection[srcIndexArray[index]], (function () {
                        if (sequential && index < srcIndexArray.length - 1) {
                            return function () {
                                var newIndex = srcIndexArray[index + 1];
                                imgCollection[newIndex].src = srcCollection[newIndex];
                            };
                        } else {
                            return null;
                        }
                    })());
                };
    }

    function load(image, callback) {
        if (isFunctionCallbackOne) {
            callbackOne(image);
        }
        if (callback && 'function' === typeof callback) {
            callback();
        }
        if (++nbLoaded >= nbToLoad && 'function' === typeof callbackAll) {
            callbackAll(imgCollection);
        }
    }

    if (srcIndexArray.length) {
        var nbLoaded = 0,
            nbToLoad = 0;
        var isFunctionCallbackOne = 'function' === typeof callbackOne;
        for (var i = 0; i < srcIndexArray.length; i++) {

            nbToLoad++;
            imgCollection[srcIndexArray[i]] = new Image();
            imgCollection[srcIndexArray[i]].onload = imgCollection[srcIndexArray[i]].onerror = imgCollection[srcIndexArray[i]].onabort = onEvent(i);

            if (!sequential) {
                imgCollection[srcIndexArray[i]].src = srcCollection[srcIndexArray[i]].src;
                imgCollection[srcIndexArray[i]].props = srcCollection[srcIndexArray[i]].props;
            }
        }
        if (sequential) {
            imgCollection[srcIndexArray[0]].src = srcCollection[srcIndexArray[0]];
        }
    }
}