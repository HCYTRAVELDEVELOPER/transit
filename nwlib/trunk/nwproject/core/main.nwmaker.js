/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */
NWMMain = function () {
    this.onStart = function () {
        var self = this;
        self.loadJs("../../../core/utils.nwmaker.js", function () {
            self.loadJs("../../../core/rpc.nwmaker.js", function () {
                self.sendEvent("load");
            });
        });
    };
    this.loadJs = function (url, callBack, async) {
        if (typeof async == 'undefined') {
            async = true;
        }
        try {
            var id = url.replace(/\//gi, "");
            id = id.replace(/\@/gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(".", "");
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.id = id;
            script.className = id;
            script.charset = "UTF-8";
            script.async = "async";
            script.src = url;
            script.onload = function () {
                if (typeof callBack !== "undefined") {
                    callBack(true);
                }
            };
            if (async === true) {
                document.getElementsByTagName('head')[0].appendChild(script);
            } else {
                $("body").append(script);
            }
            return true;
        } catch (e) {
            NWUtils.error(e);
            console.log(e);
            return false;
        }
    };
    this.listenEvent = function (name, callback) {
        document.body.addEventListener(name, function (e) {
            callback(e);
        }, false);
    };
    this.sendEvent = function (name, data, callback) {
        console.log("ENVIANDO EVENTO");
        var event = new CustomEvent(name, {
            bubbles: true,
            detail: {
                text: data
            }
        });
        document.body.dispatchEvent(event);
        if (typeof callback != 'undefined') {
            callback(data);
        }
    };
};