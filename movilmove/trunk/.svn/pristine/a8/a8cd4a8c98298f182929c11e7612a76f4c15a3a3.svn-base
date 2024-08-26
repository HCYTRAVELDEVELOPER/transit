if (document.readyState !== 'loading') {
    validaAllReadyProductosCatalogo();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        validaAllReadyProductosCatalogo();
    });
}

function validaAllReadyProductosCatalogo() {

    domainLib = "https://app.movilmove.com/lib_mobile/driver/nwmaker/";
//            domainLib = "http://movilmove.loc/lib_mobile/driver/nwmaker/";

    var dom = "https://app.movilmove.com";
//            var dom = "http://movilmove.loc";
    domainExtern = dom + "/lib_mobile/driver/";
    domainExternConfig = dom + "/lib_mobile/driver/";
    domainExternConfigName = "config_ultravans_driver.js";

    versionInAppLibDevice = "0.0.0.3";

    loadCss("https://app.movilmove.com/lib_mobile/driver/nwmaker/css/nwmaker-2.css?v=0016");
    loadCss("https://app.movilmove.com/lib_mobile/driver/css/personalized_ultravans.css?v=0016");
    loadCss("https://app.movilmove.com/lib_mobile/driver/css/main.css?v=0016");

    cargaJs("https://app.movilmove.com/lib_mobile/driver/nwmaker/nwmaker-2.min.js?v=0016", function () {

    }, false, true);
}

function cargaJs(url, callback, idDiv, async) {
    var version = "v=0";
    if (typeof nwm != "undefined") {
        version = "v=" + nwm.getInfoApp().version;
    }
    if (url.indexOf("?") == -1) {
        version = "?" + version;
    } else {
        version = "&" + version;
    }
    url = url + version;
    try {
        var id = url.replace(/\//gi, "");
        id = id.replace(/\?/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\./gi, "");
        id = id.replace(/\,/gi, "");
        id = id.replace(/\&/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\_/gi, "");
        id = id.replace(/\-/gi, "");
        id = id.replace(/-/gi, "");
        id = id.replace(/\#/gi, "");
        id = id.replace(/#/gi, "");
        id = id.replace(/\:/gi, "");
        id = id.replace(/:/gi, "");
        id = id.replace(/{/gi, "");
        id = id.replace(/}/gi, "");
        id = id.replace(".", "");
        if (evalueData(idDiv)) {
            id = idDiv;
        }
        var a = document.createElement("script");
        a.type = "text/javascript";
        a.charset = "UTF-8";
        a.async = "async";
        a.src = url;
        a.id = id;
        var style = document.querySelector("#" + id);
        if (!style) {
            a.onload = function () {
                if (evalueData(callback)) {
                    callback();
                }
            };
            if (async === true) {
                document.getElementsByTagName('head')[0].appendChild(a);
            } else {
                $("body").append(a);
            }
        } else {
            if (evalueData(callback)) {
                callback();
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function evalueData(d, exception) {
    if (typeof d == "undefined") {
        return false;
    }
    if (typeof exception !== "undefined") {
        if (d == exception) {
            return true;
        }
    }
    if (d == undefined) {
        return false;
    }
    if (d == null) {
        return false;
    }
    if (d == "null") {
        return false;
    }
    if (d === false) {
        return false;
    }
    if (d == "") {
        return false;
    }
    return true;
}

function loadCss(url, div, onlyAdd, callback) {
    if (document.createStyleSheet) {
        document.createStyleSheet(url);
    } else {
        var id = url.replace(/\//gi, "");
        id = id.replace(/\?/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\./gi, "");
        id = id.replace(/\,/gi, "");
        id = id.replace(/\&/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\_/gi, "");
        id = id.replace(/\-/gi, "");
        id = id.replace(".", "");
        var styles = url;
        var ob = document.createElement('link');
        ob.id = id;
        ob.rel = 'stylesheet';
        ob.type = 'text/css';
        ob.href = styles;
        ob.onload = function () {
            if (evalueData(callback)) {
                callback();
            }
        };
//        if (onlyAdd === true) {
        document.getElementsByTagName("head")[0].appendChild(ob);
//        } else {
//            var style = document.querySelector("#" + id);
//            if (!evalueData(style)) {
//                if (evalueData(div)) {
//                    $(div).append(ob);
//                } else {
//                    document.getElementsByTagName("head")[0].appendChild(ob);
//                }
//            }
//        }
    }
}