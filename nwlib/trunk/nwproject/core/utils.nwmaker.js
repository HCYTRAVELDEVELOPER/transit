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
var NWMUtils = function () {
    this.createElement = function (type, className, mode) {
        var elm = document.createElement(type);
        elm.className = className;
        if (typeof mode == "object") {
            if (typeof mode.src != "undefined") {
                elm.src = mode.src;
            }
        }
        return elm;
    };
    this.error = function (msg, time, showLoading) {
        var text = msg;
        if (typeof msg == "object") {
            text = msg.message;
        }
        if (showLoading) {
            console.log(msg);
            this.showLoading(text, time);
        }
    };
    this.stopLoading = function () {
        var lo = document.querySelector(".loadingNwRingow");
        if (lo) {
            lo.remove();
        }
    };
    this.loading = function (msg, time) {
        this.showLoading(msg, time);
    };
    this.showLoading = function (msg, time) {
        this.stopLoading();
        var loading = document.querySelector(".loadingNwRingow");
        if (loading == null) {
            var loadingHtml = this.loadingRingow();
            loadingHtml = loadingHtml.replace("%replace%", msg);
            document.body.insertAdjacentHTML("beforebegin", loadingHtml);
        }
        if (typeof time != 'undefined') {
            setTimeout(NWMUtils.stopLoading, time);
        }
    };
    this.loadingRingow = function () {
        var html = " <div id='loadingNwRingow' class='loadingNwRingow' style='position: absolute;top: 80px;left: 0;width: 100%;height: 100%;background: #fff;z-index: 1;'>\n\
<div class='cEftVf_ringow' style='top: 10%;position: relative;'></div>\n\
            <style>\n\
                @-webkit-keyframes iECmZH {\n\
                    0% {\n\
                        -webkit-transform: rotate(0deg);\n\
                        -ms-transform: rotate(0deg);\n\
                        transform: rotate(0deg);\n\
                    }\n\
                    100% {\n\
                        -webkit-transform: rotate(360deg);\n\
                        -ms-transform: rotate(360deg);\n\
                        transform: rotate(360deg);\n\
                    }\n\
                }\n\
                @keyframes iECmZH {\n\
                    0% {\n\
                        -webkit-transform: rotate(0deg);\n\
                        -ms-transform: rotate(0deg);\n\
                        transform: rotate(0deg);\n\
                    }\n\
                    100% {\n\
                        -webkit-transform: rotate(360deg);\n\
                        -ms-transform: rotate(360deg);\n\
                        transform: rotate(360deg);\n\
                    }\n\
                }\n\
                .cEftVf_ringow {\n\
                    margin-left: auto;\n\
                    margin-right: auto;\n\
                    border: 4px solid #358EFF;\n\
                    border-top: 4px solid transparent;\n\
                    height: 3rem;\n\
                    width: 3rem;\n\
                    box-sizing: border-box;\n\
                    -webkit-animation: iECmZH 1100ms infinite linear;\n\
                    animation: iECmZH 1100ms infinite linear;\n\
                    border-radius: 50%;\n\
                }\n\
            </style>\n\
\n\<div style='position: relative; text-align: center; top: 12%;'>%replace%</div>\n\
        </div>";
        return html;
    };
};
