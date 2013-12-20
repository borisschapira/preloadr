function preloadr(srcCollection, callbackOne, callbackAll, sequential) {
    var imgCollection = srcCollection instanceof Array ? [] : {};
    var srcIndexArray = [];
    for (var key in srcCollection) {
        srcIndexArray.push(key)
    }
    if (srcIndexArray.length) {
        var nbLoaded = nbToLoad = 0;
        var isFunctionCallbackOne = 'function' === typeof callbackOne;
        for (var i = 0; i < srcIndexArray.length; i++) {

            nbToLoad++;
            imgCollection[srcIndexArray[i]] = new Image;
            imgCollection[srcIndexArray[i]].onload = imgCollection[srcIndexArray[i]].onerror = imgCollection[srcIndexArray[i]].onabort = (function (index) {
                return function () {
                    load(imgCollection[srcIndexArray[index]], (function () {
                        if (sequential && index < srcIndexArray.length - 1) {
                            return function () {
                                var newIndex = srcIndexArray[index + 1];
                                imgCollection[newIndex].src = srcCollection[newIndex]
                            }
                        } else {
                            return null
                        }
                    })())
                }
            })(i);
            if (!sequential) {
                imgCollection[srcIndexArray[i]].src = srcCollection[srcIndexArray[i]]
            }
        }
        if (sequential) {
            imgCollection[srcIndexArray[0]].src = srcCollection[srcIndexArray[0]];
        }

        function load(image, callback) {
            if (isFunctionCallbackOne) {
                callbackOne(image)
            }
            if (callback && 'function' === typeof callback)
                callback();
            if (++nbLoaded >= nbToLoad)
                'function' === typeof callbackAll && callbackAll(imgCollection)
        }
    }
}