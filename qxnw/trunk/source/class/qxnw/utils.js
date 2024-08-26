/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
/**
 * Class only for static mode. A composition of util code who help you in entire your application
 */
qx.Class.define("qxnw.utils", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    events: {
        "ok": "qx.event.type.Event",
        "cancel": "qx.event.type.Event"
    },
    /**
     * The resetter of a select box 
     */
    properties: {
        resetter: {
            init: null
        },
        blocker: {
            init: null
        }
    },
    statics: {
        blocker: null,
        generatePdf: function generatePdf(url, p, destination) {
            var data = {};
            data["url"] = url;

            var v;
            var params = "";
            for (v in p) {
                params += "&";
                params += v;
                params += "=";
                params += p[v];
            }
            data["url"] += params;
            data["destination"] = destination;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "NWUtils");
            rpc.setAsync(true);
            var func = function (rta) {
                if (rta) {
                    window.open(qxnw.utils.getLocation(true) + destination);
                }
                return;
            };
            rpc.exec("generatePdf", data, func);
        },
        getLocale: function getLocale() {
            var locale = qxnw.local.getOpenData("locale");
            return locale;
        },
        removeAccents: function removeAccents() {
            return qxnw.utils.quitarAcentos();
        },
        quitarAcentos: function quitarAcentos(cadena) {
            const acentos = {'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'};
            return cadena.split('').map(letra => acentos[letra] || letra).join('').toString();
        },
        startBlocker: function (zIndex) {
            if (this.blocker !== null) {
                this.blocker.blockContent(zIndex - 1);
            }
        },
        stopBlocker: function () {
            if (this.blocker !== null) {
                this.blocker.unblock();
            }
        },
        createBlocker: function () {
            var root = qx.core.Init.getApplication().getRoot();
            if (this.blocker === null) {
                this.blocker = new qx.ui.core.Blocker(root);
                this.blocker.setOpacity(0.2);
                this.blocker.setColor("black");
            }
            return this.blocker;
        },
        versionCompare: function versionCompare(v1, v2, options) {
            var lexicographical = options && options.lexicographical,
                    zeroExtend = options && options.zeroExtend,
                    v1parts = v1.split('.'),
                    v2parts = v2.split('.');
            function isValidPart(x) {
                return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
            }

            if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
                return NaN;
            }

            if (zeroExtend) {
                while (v1parts.length < v2parts.length)
                    v1parts.push("0");
                while (v2parts.length < v1parts.length)
                    v2parts.push("0");
            }

            if (!lexicographical) {
                v1parts = v1parts.map(Number);
                v2parts = v2parts.map(Number);
            }

            for (var i = 0; i < v1parts.length; ++i) {
                if (v2parts.length == i) {
                    return 1;
                }

                if (v1parts[i] == v2parts[i]) {
                    continue;
                } else if (v1parts[i] > v2parts[i]) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (v1parts.length != v2parts.length) {
                return -1;
            }

            return 0;
        },
        processBiostarApiMsg: function processBiostarApiMsg(msg) {
            var html = "Respuesta API Suprema V1";
            html += "<br />";
            if (typeof msg != 'undefined' && msg != null) {
                if (typeof msg.message != null) {
                    html += "<br />";
                    html += "<b>Respuesta: </b>";
                    html += "<br />";
                    html += msg.message;
                }
            }
            if (typeof msg != 'undefined' && msg != null) {
                if (typeof msg.status_code != null) {
                    html += "<br />";
                    html += "<b>Código: </b>";
                    html += "<br />";
                    html += msg.status_code;
                }
            }
            qxnw.utils.information(html);
        },
        repeat: function repeat(val, count) {
            if (!String.prototype.repeat) {
                var str = val;
                count = +count;
                if (count != count) {
                    count = 0;
                }
                if (count < 0) {
                    throw new RangeError('repeat count must be non-negative');
                }
                if (count == Infinity) {
                    throw new RangeError('repeat count must be less than infinity');
                }
                count = Math.floor(count);
                if (str.length == 0 || count == 0) {
                    return '';
                }
                // Ensuring count is a 31-bit integer allows us to heavily optimize the
                // main part. But anyway, most current (August 2014) browsers can't handle
                // strings 1 << 28 chars or longer, so:
                if (str.length * count >= 1 << 28) {
                    throw new RangeError('repeat count must not overflow maximum string size');
                }
                var rpt = '';
                for (; ; ) {
                    if ((count & 1) == 1) {
                        rpt += str;
                    }
                    count >>>= 1;
                    if (count == 0) {
                        break;
                    }
                    str += str;
                }
                return rpt;
            } else {
                return val.repeat(count);
            }
        },
        addDevTooltip: function addDevTooltip(widget, tooltip, tooltipUser) {
            if (qx.core.Environment.get("qx.debug")) {
                var toolTip = new qx.ui.tooltip.ToolTip(tooltip);
                widget.setToolTip(toolTip);
            } else {
                if (typeof tooltipUser != 'undefined') {
                    var toolTip = new qx.ui.tooltip.ToolTip(tooltipUser);
                    widget.setToolTip(toolTip);
                }
            }
        },
        getExtension: function getExtension(filename) {
            return filename.split('.').pop();
        },
        hasGetUserMedia: function hasGetUserMedia() {
//            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mediaDevices.getUserMedia ||
//                    navigator.mozGetUserMedia || navigator.msGetUserMedia);
            return !!(navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia || navigator.msGetUserMedia);
        },
        checkStringIsUrl: function checkStringIsUrl(str) {
            var pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
            if (!pattern.test(str)) {
                return false;
            } else {
                return true;
            }
        },
        addClassToElement: function addClassToElement(button, cl) {
            qxnw.utils.addClassToButton(button, cl);
        },
        addClassToButton: function addClassToButton(button, cl) {
            var cn = button.classname;
            button.addListener("appear", function () {
                qx.bom.element.Class.add(button.getContentElement().getDomElement(), cl);
            });
            button.addListener("mouseover", function () {
                qx.bom.element.Class.add(button.getContentElement().getDomElement(), cl);
            });
            button.addListener("mouseout", function () {
                qx.bom.element.Class.add(button.getContentElement().getDomElement(), cl);
            });
            button.addListener("focusout", function () {
                qx.bom.element.Class.add(button.getContentElement().getDomElement(), cl);
            });
            button.addListener("focusin", function () {
                qx.bom.element.Class.add(button.getContentElement().getDomElement(), cl);
            });
            if (cn !== "qx.ui.container.Composite" && cn !== "qx.ui.menu.Button" && cn !== "qx.ui.form.Button"
                    && cn !== "qx.ui.popup.Popup" && cn !== "qx.ui.container.Scroll" && cn !== "qx.ui.toolbar.ToolBar" && cn !== "qx.ui.toolbar.SplitButton") {
                button.addListener("changeValue", function () {
                    qx.bom.element.Class.add(button.getContentElement().getDomElement(), cl);
                });
            }
            button.addListener("activate", function () {
                var timer = new qx.event.Timer(10);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    qx.bom.element.Class.add(button.getContentElement().getDomElement(), cl);
                });
            });
            button.addListener("deactivate", function () {
                var timer = new qx.event.Timer(10);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    qx.bom.element.Class.add(button.getContentElement().getDomElement(), cl);
                });
            });
        },
        getNWIconFromUrl: function  getNWIconFromUrl(url) {
            var ext = url.split('.').pop();
            return qxnw.utils.getNWIconFromExt(ext);
        },
        getNWIconFromExt: function  getNWIconFromExt(ext) {
            var icon = "image";
            switch (ext) {
                case "docx" :
                    icon = "word";
                    break;
                case "DOCX" :
                    icon = "word";
                    break;
                case "doc" :
                    icon = "word";
                    break;
                case "DOC" :
                    icon = "word";
                    break;
                case "ppp" :
                    icon = "PowerPoint-icon";
                    break;
                case "PPP" :
                    icon = "PowerPoint-icon";
                    break;
                case "xls" :
                    icon = "excel";
                    break;
                case "XLS" :
                    icon = "excel";
                    break;
                case "xlsx" :
                    icon = "excel";
                    break;
                case "XLSX" :
                    icon = "excel";
                    break;
                case "pdf" :
                    icon = "pdf";
                    break;
                case "PDF" :
                    icon = "pdf";
                    break;
                case "ODT" :
                    icon = "word";
                    break;
                case "odt" :
                    icon = "word";
                    break;
                case "rar" :
                    icon = "rar";
                    break;
                case "RAR" :
                    icon = "rar";
                    break;
            }
            return icon;
        },
        cleanLineBreaks: function cleanLineBreaks(str) {
            if (typeof str == "string") {
                return str.replace(/\n|\r/g, "");
            } else {
                return str;
            }
        },
        getURLParameter: function getURLParameter(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
        getScriptURLParameter: function getScriptURLParameter(id, tag) {
            var script_tag = document.getElementById(id);
            if (script_tag != null) {
                var search_term = script_tag.getAttribute(tag);
                return search_term;
            } else {
                return "";
            }
        },
        addClass: function addClass(element, classString) {
            qxnw.utils.addClassToButton(element, classString);
//            element.addListener("appear", function () {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), classString);
//            });
        },
        isImage: function isImage(image_url) {
            var split = image_url.split(".");
            var img_ext = qxnw.config.getImagesExtensions();
            if (img_ext.indexOf(split[split.length - 1]) == -1) {
                return false;
            }
            return true;
        },
        checkImageExists: function checkImageExists(image_url) {
            if (typeof image_url == 'undefined') {
                return false;
            }
            if (image_url == '') {
                return false;
            }
            if (image_url == null) {
                return false;
            }
            try {
                var http = new XMLHttpRequest();
                http.open('HEAD', image_url, false);
                http.send();
            } catch (e) {
                return false;
            }
            return http.status != 404;
        },
        getUrl: function getUrl() {
            var protocol = qxnw.utils.getProtocol();
            return url = protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        },
        getProtocol: function getProtocol() {
            return location.protocol;
        },
        saveIntoLocalArray: function saveIntoLocalArray(data) {
            for (var v in data) {
                qxnw.local.storeData(v, data[v]);
            }
        },
        verifyUser: function verifyUser(form, user) {
            var userIn = form.up.user;
            var index = qxnw.userPolicies.getDevelopers().indexOf(userIn);
            if (index == -1) {
                return false;
            }
            index = qxnw.userPolicies.getDevelopers().indexOf(user);
            if (index == -1) {
                return false;
            }
            var pass = false;
            if (qx.core.Environment.get("qx.debug")) {
                pass = true;
            }
            if ((userIn == user) && (pass === true)) {
                return true;
            }
            return false;
        },
        cleanSpecialCharacteres: function cleanSpecialCharacteres(val, regex) {
            var outString = "";
            if (typeof regex !== 'undefined' && regex !== null) {
                outString = val.replace(regex, '');
            } else {
                outString = val.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
            }
            return outString;
        },
        addColorToListItem: function addColorToListItem(item, color) {
            var label = qxnw.utils.cleanHtml(item.getLabel());
            label = "<font color='" + color + "'>" + label + "</font>";
            try {
                item.setUserData("nw_color", color);
            } catch (e) {
                console.log(e);
            }
            item.setLabel(label);
        },
        /*
         * Función para limpiar HTML
         * @param text {string} texto a limpiar 
         * @returns {string}
         */
        cleanHtml: function cleanHtml(text) {
            if (typeof text === "string") {
                return text.replace(/<(?:.|\n)*?>/gm, '');
            } else {
                return text;
            }
        },
        /*
         * On testing
         * @param html {String} the HTML STRING
         * @returns {String}
         */
        cleanAllHtml: function cleanAllHtml(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        },
        /*
         * Devuelve el host
         * @param complete {boolean} parámetro para devolver incluso el http o https
         * @returns {void}
         */
        getLocation: function getLocation(complete) {
            if (complete) {
                return window.location.origin;
            } else {
                return window.location.hostname;
            }
        },
        userMessage: function userMessage(p) {
            var lbl1 = "Al parecer la URL: ";
            var lbl2 = " se encuentra en mantenimiento o no funciona. \n\
                                Puede escribirnos a nuestro PQR para informar del problema.";
            qxnw.utils.information(lbl1 + p + lbl2);
        },
        getHtmlApplet: function getHtmlApplet(pathClass, pathJar, width, height, paramsArray, id) {
            if (typeof id == 'undefined') {
                id = "nw_applet";
            }
            var html = '<applet id="' + id + ' " code="' + pathClass + '" archive="' + pathJar + '" width="' + width + '" height="' + height + '" >';
            for (var v in paramsArray) {
                html += '<param name="';
                html += v + '" value="';
                html += paramsArray[v] + '"/>';
            }
            //html += '<param name="permissions" value="all-permissions" />';
            //html += '<param name="separate_jvm" value="true"/>';
            html += '</applet>';
            if (!navigator.javaEnabled()) {
                html = "Su navegador no tiene JAVA instalado";
            }
            return html;
        },
        getMonthNameByIndexMayus: function getMonthNameByIndexMayus(index) {
//            var fecha_split = fecha.split("-");
//            var mes_id = fecha_split[1].split("0");
//            if (mes_id[0] == "") {
//                mes_id = mes_id[1];
//            } else {
//                mes_id = fecha_split[1];
//            }
            var meses = {};
            meses["1"] = "ENERO";
            meses["2"] = "FEBRERO";
            meses["3"] = "MARZO";
            meses["4"] = "ABRIL";
            meses["5"] = "MAYO";
            meses["6"] = "JUNIO";
            meses["7"] = "JULIO";
            meses["8"] = "AGOSTO";
            meses["9"] = "SEPTIEMBRE";
            meses["10"] = "OCTUBRE";
            meses["11"] = "NOVIEMBRE";
            meses["12"] = "DICIEMBRE";
            return meses[index];
//            return meses[mes_id];
        },
        getMonthNameByIndex: function getMonthNameByIndex(index) {
            var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre",
                "Noviembre", "DIciembre"];
            return months[index];
        },
        createMenuButton: function createMenuButton(labelMenuButton, iconMenu) {
            var menuButtonDate = new qx.ui.toolbar.MenuButton(labelMenuButton, iconMenu);
            menuButtonDate.setShowArrow(true);
            menuButtonDate.getChildControl("arrow").setSource("decoration/arrows/right.png");
            menuButtonDate.getChildControl("arrow").setPaddingLeft(30);
            return menuButtonDate;
        },
        checkVar: function checkVar(vari, compare, type) {
            if (typeof vari == 'undefined') {
                return false;
            }
            if (typeof compare != 'undefined') {
                if (vari != compare) {
                    return false;
                }
            }
            if (typeof type != 'undefined') {
                if (typeof vari != type) {
                    return false;
                }
            }
            if (vari == null) {
                return false;
            }
            return true;
        },
        menuToButton: function menuToButton(button) {
            var p = new qx.ui.popup.Popup();
            p.setAutoHide(true);
            p.setLayout(new qx.ui.layout.VBox());
            p.setPosition("right-top");
            p.setPlaceMethod("widget");
            p.show();
            p.haveFocusOrNot = true;
            p.addListener("mousemove", function () {
                p.haveFocusOrNot = true;
            });
            p.addListener("mouseout", function () {
                p.haveFocusOrNot = false;
            });
            button.addListener("disappear", function () {
                if (p.haveFocusOrNot == false) {
                    p.hide();
                }
            });
            p.placeToWidget(button);
            p.checkBoxInside = [];
            p.buttonInside = [];
            p.callbackCheck = null;
            p.callbackButton = null;
            p.addMenu = function addMenu(name, haveCheckBox, label, options) {
                var optionsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                if (typeof options != 'undefined') {
                    if (typeof options.developerColor != 'undefined') {
                        optionsContainer.setBackgroundColor(name);
                        optionsContainer.setMinHeight(15);
                    }
                }
                if (qxnw.utils.checkVar(haveCheckBox) && haveCheckBox === true) {
                    var check = new qx.ui.form.CheckBox();
                    optionsContainer.add(check);
                    check.setUserData("saved_name", name);
                    p.checkBoxInside[name] = check;
                    check.addListener("click", function (e) {
                        if (qxnw.utils.checkVar(p.callbackCheck)) {
                            p.callbackCheck(e, this.getUserData("saved_name"));
                        }
                    });
                }
                if (typeof options != 'undefined') {
                    if (typeof options.developerColor != 'undefined') {
                        label = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    }
                }
                var menuButton = new qx.ui.form.Button(label);
                if (typeof options != 'undefined') {
                    menuButton.setUserData("options_menu", options);
                }
                menuButton.getChildControl("label").set({
                    rich: true
                });
                p.buttonInside[name] = menuButton;
                menuButton.addListener("click", function (e) {
                    if (qxnw.utils.checkVar(p.callbackButton)) {
                        p.callbackButton(e, this.getUserData("saved_name"), this.getUserData("options_menu"));
                    }
                });
                menuButton.setUserData("saved_name", name);
                menuButton.setAppearance("menu-button");
                menuButton.setShow("label");
                optionsContainer.add(menuButton);
                if (qxnw.utils.checkVar(haveCheckBox) && haveCheckBox === true) {
                    optionsContainer.add(check);
                }
                optionsContainer.add(menuButton);
                p.add(optionsContainer);
            };
            p.addCheckCallback = function (callback) {
                this.callbackCheck = callback;
            };
            p.addButtonCallback = function (callback) {
                this.callbackButton = callback;
            };
            p.getCheckBox = function (name) {
                return this.checkBoxInside[name];
            };
            p.getButton = function (name) {
                return this.buttonInside[name];
            };
            p.getAllCheckBox = function () {
                return this.checkBoxInside;
            };
            p.getAllButton = function () {
                return this.buttonInside;
            };
            return p;
        },
        betweenNumbers: function betweenNumbers(num, a, b, inclusive) {
            var min = Math.min.apply(Math, [a, b]),
                    max = Math.max.apply(Math, [a, b]);
            return inclusive ? num >= min && num <= max : num > min && num < max;
        },
        convertDate: function (d, separator) {
            // Converts the date in d to a date-object. The input can be:
            //   a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //   a number     : Interpreted as number of milliseconds
            //                  since 1 Jan 1970 (a timestamp) 
            //   a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date
            //                  attributes.  **NOTE** month is 0-11.
            if (typeof separator == 'undefined') {
                separator = "-";
            }
            var haveHour = false;
            if (typeof d == "string") {
                var v = d.split(" ");
                d = v[0].split(separator);
                if (typeof v[1] != 'undefined') {
                    var secs = v[1].split(":");
                    if (secs.length == 0) {
                        secs[1] = "00";
                        secs[2] = "00";
                    } else if (secs.length == 1) {
                        secs[2] = "00";
                    }
                    haveHour = true;
                }
            }
            return (
                    d == null ? new Date() :
                    d.constructor === Date ? d :
                    d.constructor === Array ? new Date(d[0], d[1] != 0 ? d[1] - 1 : d[1], d[2]) :
                    d.constructor === Number ? new Date(d) :
                    d.constructor === String ? new Date(d) :
                    (typeof d === "object" && haveHour == true) ? new Date(d.year, d.month, d.date, secs[0], secs[1], secs[2]) :
                    typeof d === "object" ? new Date(d.year, d.month != 0 ? d.month - 1 : d.month, d.date) : NaN
                    );
        },
        compareDates: function compareDates(a, b) {
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).
            return (
                    isFinite(a = this.convertDate(a).valueOf()) &&
                    isFinite(b = this.convertDate(b).valueOf()) ?
                    (a > b) - (a < b) :
                    NaN
                    );
        },
        dateInRange: function (d, start, end) {
            // Checks if date in d is between dates in start and end.
            // Returns a boolean or NaN:
            //    true  : if d is between start and end (inclusive)
            //    false : if d is before start or after end
            //    NaN   : if one or more of the dates is illegal.
            // NOTE: The code inside isFinite does an assignment (=).
            if (d == "") {
                return false;
            }
            return (
                    isFinite(d = this.convertDate(d).valueOf()) &&
                    isFinite(start = this.convertDate(start).valueOf()) &&
                    isFinite(end = this.convertDate(end).valueOf()) ?
                    start <= d && d <= end :
                    NaN
                    );
        },
        createInformativeForm: function createInformativeForm(path, title) {
            var reader = new qx.io.request.Xhr(path);
            reader.addListener("statusError", function (r) {
                var tg = r.getTarget();
                qxnw.utils.error(tg.getResponse());
            });
            reader.addListener("success", function (r) {
                var d = r.getTarget();
                var da = d.getResponse();
                var f = new qxnw.forms();
                f.setTitle(title);
                var fields = [
                    {
                        name: "textArea",
                        type: "textArea"
                    }
                ];
                f.setFields(fields);
                f.setNoFilter("textArea");
                f.ui.textArea.setValue(da);
                f.ui.textArea.setMinHeight(600);
                f.hideButtons();
                f.show();
                f.maximize();
            });
            reader.send();
        },
        createHtmlFromArray: function createHtmlFromArray(arr, spacer, group_start, group_end) {
            var html = "";
            for (var r in arr) {
                html += group_start + r + group_end;
                html += spacer;
            }
            return html;
        },
        plotToImgBetter: function plotToImgBetter(obj) {
            var newCanvas = document.createElement("canvas");
            newCanvas.width = obj.find("canvas.jqplot-base-canvas").width();
            newCanvas.height = obj.find("canvas.jqplot-base-canvas").height() + 10;
            var baseOffset = obj.find("canvas.jqplot-base-canvas").offset();
            // make white background for pasting
            var context = newCanvas.getContext("2d");
            context.fillStyle = "rgba(255,255,255,1)";
            context.fillRect(0, 0, newCanvas.width, newCanvas.height);
            obj.children().each(function () {
                // for the div's with the X and Y axis
                if ($(this)[0].tagName.toLowerCase() == 'div') {
                    // X axis is built with canvas
                    $(this).children("canvas").each(function () {
                        var offset = $(this).offset();
                        newCanvas.getContext("2d").drawImage(this,
                                offset.left - baseOffset.left,
                                offset.top - baseOffset.top
                                );
                    });
                    // Y axis got div inside, so we get the text and draw it on the canvas
                    $(this).children("div").each(function () {
                        var offset = $(this).offset();
                        var context = newCanvas.getContext("2d");
                        context.font = $(this).css('font-style') + " " + $(this).css('font-size') + " " + $(this).css('font-family');
                        context.fillStyle = $(this).css('color');
                        context.fillText($(this).text(),
                                offset.left - baseOffset.left,
                                offset.top - baseOffset.top + $(this).height()
                                );
                    });
                } else if ($(this)[0].tagName.toLowerCase() == 'canvas') {
                    // all other canvas from the chart
                    var offset = $(this).offset();
                    newCanvas.getContext("2d").drawImage(this,
                            offset.left - baseOffset.left,
                            offset.top - baseOffset.top
                            );
                }
            });
            // add the point labels
            obj.children(".jqplot-point-label").each(function () {
                var offset = $(this).offset();
                var context = newCanvas.getContext("2d");
                context.font = $(this).css('font-style') + " " + $(this).css('font-size') + " " + $(this).css('font-family');
                context.fillStyle = $(this).css('color');
                context.fillText($(this).text(),
                        offset.left - baseOffset.left,
                        offset.top - baseOffset.top + $(this).height() * 3 / 4
                        );
            });
            // add the title
            obj.children("div.jqplot-title").each(function () {
                var offset = $(this).offset();
                var context = newCanvas.getContext("2d");
                context.font = $(this).css('font-style') + " " + $(this).css('font-size') + " " + $(this).css('font-family');
                context.textAlign = $(this).css('text-align');
                context.fillStyle = $(this).css('color');
                context.fillText($(this).text(),
                        newCanvas.width / 2,
                        offset.top - baseOffset.top + $(this).height()
                        );
            });
            // add the legend
            obj.children("table.jqplot-table-legend").each(function () {
                var offset = $(this).offset();
                var context = newCanvas.getContext("2d");
                context.strokeStyle = $(this).css('border-top-color');
                context.strokeRect(
                        offset.left - baseOffset.left,
                        offset.top - baseOffset.top,
                        $(this).width(), $(this).height()
                        );
                context.fillStyle = $(this).css('background-color');
                context.fillRect(
                        offset.left - baseOffset.left,
                        offset.top - baseOffset.top,
                        $(this).width(), $(this).height()
                        );
            });
            // add the rectangles
            obj.find("div.jqplot-table-legend-swatch").each(function () {
                var offset = $(this).offset();
                var context = newCanvas.getContext("2d");
                context.fillStyle = $(this).css('background-color');
                context.fillRect(
                        offset.left - baseOffset.left,
                        offset.top - baseOffset.top,
                        $(this).parent().width(), $(this).parent().height()
                        );
            });
            obj.find("td.jqplot-table-legend").each(function () {
                var offset = $(this).offset();
                var context = newCanvas.getContext("2d");
                context.font = $(this).css('font-style') + " " + $(this).css('font-size') + " " + $(this).css('font-family');
                context.fillStyle = $(this).css('color');
                context.textAlign = $(this).css('text-align');
                context.textBaseline = $(this).css('vertical-align');
                context.fillText($(this).text(),
                        offset.left - baseOffset.left,
                        offset.top - baseOffset.top + $(this).height() / 2 + parseInt($(this).css('padding-top').replace('px', ''))
                        );
            });
            // convert the image to base64 format
            return newCanvas;
        },
        plotToImg: function plotToImg(obj) {
            var newCanvas = document.createElement("canvas");
            newCanvas.width = obj.find("canvas.jqplot-base-canvas").width();
            newCanvas.height = obj.find("canvas.jqplot-base-canvas").height();
            var baseOffset = obj.find("canvas.jqplot-base-canvas").offset();
            // make white background for pasting
            var context = newCanvas.getContext("2d");
            context.fillStyle = "rgba(255,255,255,1)";
            context.fillRect(0, 0, newCanvas.width, newCanvas.height);
            obj.children().each(function () {

                if ($(this)[0].tagName.toLowerCase() == 'canvas') {
                    // all canvas from the chart
                    var offset = $(this).offset();
                    newCanvas.getContext("2d").drawImage(this,
                            offset.left - baseOffset.left,
                            offset.top - baseOffset.top
                            );
                } // for the div's with the X and Y axis
            });
            obj.children().each(function () {
                if ($(this)[0].tagName.toLowerCase() == 'div') {
                    if ($(this).attr('class') == "jqplot-axis jqplot-yaxis") {

                        $(this).children("canvas").each(function () {
                            var offset = $(this).offset();
                            newCanvas.getContext("2d").drawImage(this,
                                    offset.left - baseOffset.left,
                                    offset.top - baseOffset.top
                                    );
                        });
                    } else if ($(this).attr('class') == "jqplot-axis jqplot-xaxis") {

                        $(this).children("canvas").each(function () {
                            var offset = $(this).offset();
                            newCanvas.getContext("2d").drawImage(this,
                                    offset.left - baseOffset.left,
                                    offset.top - baseOffset.top
                                    );
                        });
                    }
                }
            });
            return newCanvas;
        },
        quickSelectBox: function quickSelectBox(parent, items, type, evt, callBack) {
            var p = new qx.ui.popup.Popup();
            p.setLayout(new qx.ui.layout.VBox());
            if (type == "widget") {
                p.setPosition("right-top");
                p.placeToWidget(parent);
            } else if (type == "pointer") {
                p.placeToPointer(evt);
            } else {
                qxnw.utils.error("Not defined type. Try widget or pointer");
                return;
            }
            if (typeof items == 'undefined') {
                qxnw.utils.error("You must have to pass items in array");
                return;
            }
            for (var i = 0; i < items.length; i++) {
                var item = new qx.ui.basic.Atom("<b style='text-decoration: underline;'>" + items[i].label + "</b>").set({
                    rich: true,
                    cursor: "pointer",
                    show: "label"
                });
                if (typeof items[i].icon != 'undefined' && typeof items[i].iconType != 'undefined') {
                    item.setIcon(qxnw.config.execIcon(items[i].icon, items[i].iconType));
                    item.setShow("both");
                }
                item.setUserData("model", items[i]);
                item.addListener("click", function () {
                    p.hide();
                    callBack(this.getUserData("model"));
                });
                p.add(item);
            }
            p.show();
        },
        keysInArray: function keysInArray(a) {
            var i = 0;
            for (var key in a) {
                i++;
            }
            return i;
        },
        equalArray2d: function equalArray2d(a, b) {
            if (a == b) {
                return true;
            }
            if (qxnw.utils.keysInArray(a) != qxnw.utils.keysInArray(b)) {
                return false;
            }
            for (var key in a) {
                if (a[key] != b[key]) {
                    return false;
                }
            }
            return true;
        },
        listVerticalFilters: function listVerticalFilters(p, filters) {
            var self = p;
            self.createFilters(filters, true);
            self.containerFilters.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_div_filters_lists");
            });
            self.containerTable.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_div_table_lists");
            });
            self.buttonSearch.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_div_filters_inputs");
            });
            self.containerFooterTools.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_div_footer_lists");
            });
        },
        differenceBetweenDates: function differenceBetweenDates(fecIni, fecFin) {
            var one_day = 1000 * 60 * 60 * 24;
            var arrayFechaIni = fecIni.split("-");
            var arrayFechaFin = fecFin.split("-");
            var diaI = arrayFechaIni[2];
            var mesI = (arrayFechaIni[1]);
            var anoI = (arrayFechaIni[0]);
            var diaF = arrayFechaFin[2];
            var mesF = (arrayFechaFin[1]);
            var anoF = (arrayFechaFin[0]);
            var fechaDateIni = new Date(anoI, mesI, diaI)
            var fechaDateFin = new Date(anoF, mesF, diaF)

            var Diff = Math.ceil((fechaDateFin.getTime() - fechaDateIni.getTime()) / (one_day));
            return Diff;
        },
        base64toBlob: function base64toBlob(base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);
            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);
                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, {type: contentType});
        },
        iframeGoogleMap: function iframeGooleMap(lat, lon) {
            var frame = new qx.ui.embed.Iframe();
            frame.setSource('https://www.google.com/maps/embed/v1/view?key=AIzaSyCb2Gh4OO3A6VzEDeVBME8Mx1dS0lvMric&zoom=7&center=' + lat + ',' + lon + ' ');
            return frame;
        },
        exportTableToExcel: function exportTableToExcel(table, callb) {
            var callback = function (data) {
                try {
                    if (typeof data.exportId != 'undefined') {
                        if (data.exportId != "") {
                            if (data.exportId != null) {
                                if (typeof data.exportKey != 'undefined') {
                                    if (typeof data.exportKey != "") {
                                        if (typeof data.exportKey != null) {
                                            main.isClosedApp = true;
                                            window.location.href = "/nwlib+" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.exportId + "&key=" + data.exportKey;
                                            if (callb) {
                                                try {
                                                    callb();
                                                } catch (e) {
                                                    qxnw.utils.error(e);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    qxnw.utils.error(e);
                }
            };
            qxnw.utils.fastAsyncRpcCall("master", "execPage", {table: table, "filters": {"export": true, count: 1000000000000}}, callback, 100000000);
        },
        getUserPosition: function getUserPosition(func) {
            if (typeof func != "function") {
                qxnw.utils.error("DEBE PASAR UNA FUNCIÓN COMO PÁRÁMETRO");
                return;
            }
            var gp = qx.bom.GeoLocation.getInstance();
            gp.getCurrentPosition();
            var funct = function (r) {
                var rta = {
                    latitude: r.getLatitude(),
                    longitude: r.getLongitude(),
                    accuracy: r.getAccuracy(),
                    altitude: r.getAltitude(),
                    speed: r.getSpeed()
                };
                func(rta);
            };
            gp.addListener("position", funct);
        },
        /*
         * Create fast navTable
         * @param {type} method
         * @param {type} func
         * @param {type} data
         * @param {type} callback
         * @returns {undefined}
         */
        navTable: function navTable(columns, parent, hideButtons, title, modal) {
            var f = new qxnw.forms();
            if (typeof modal == 'undefined') {
                modal = false;
            }
            if (modal) {
                f.setModal(true);
            }
            if (typeof title != 'undefined') {
                f.setTitle(title);
            }
            f.setWidth(400);
            var nt = new qxnw.navtable(parent);
            nt.createBase();
            if (typeof hideButtons == 'undefined') {
                hideButtons = true;
            }
            if (hideButtons) {
                nt.hideButtons();
            }
            nt.setColumns(columns);
            f.insertWidget(nt.getBase());
            f.show();
            return nt;
        },
        removeLog: function removeLog() {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master", true);
            rpc.exec("cleanLogs");
        },
        /* var r = {test: 1};
         * var func = function(ret) {
         *      console.log(ret);
         * };
         * ie qxnw.utils.fastAsyncRpcCall("tk_tickets", "copyProfile", r, func); The parameter of callback is the returning value
         * @param {type} method
         * @param {type} func
         * @param {type} data
         * @param {type} callback
         * @returns {undefined}
         */
        fastAsyncCallRpc: function fastAsyncCallRpc(method, func, data, callback, timeWait) {
            qxnw.utils.fastAsyncRpcCall(method, func, data, callback, timeWait);
        },
        /* var r = {test: 1};
         * var func = function(ret) {
         *      console.log(ret);
         * };
         * ie qxnw.utils.fastAsyncRpcCall("tk_tickets", "copyProfile", r, func); The parameter of callback is the returning value
         * @param {type} method
         * @param {type} func
         * @param {type} data
         * @param {type} callback
         * @returns {undefined}
         */
        fastAsyncRpcCall: function fastAsyncRpcCall(method, func, data, callback, timeWait, showLoading) {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method, true);
            if (typeof showLoading != 'undefined' && showLoading === false) {
                rpc.setShowLoading(false);
            }
            if (typeof timeWait != 'undefined' && timeWait != 0) {
                rpc.setTimeOut(timeWait);
            }
            rpc.exec(func, data, callback);
        },
        fastSyncRpcCall: function fastSyncRpcCall(method, func, data, timeWait) {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method);
            if (typeof timeWait != 'undefined' && timeWait != null) {
                rpc.setTimeout(timeWait);
            }
            return rpc.exec(func, data);
        },
        /* 
         * An alias for fastAsyncRpcCall
         * ie qxnw.utils.fastAsyncRpcCall("tk_tickets", "copyProfile", r, func); The parameter of callback is the returning value
         * @param {type} method
         * @param {type} func
         * @param {type} data
         * @param {type} callback
         * @returns {undefined}
         */
        fastRpcAsyncCall: function fastRpcAsyncCall(method, func, data, callback, timeWait) {
            qxnw.utils.fastAsyncRpcCall(method, func, data, callback, timeWait);
        },
        /*
         * Fast dialog forms, width all functionality of qxnw.forms()
         * @param fields {array} the array fields
         * @param title {string} the title
         * @param validate {bool} if validate
         * @returns {object}
         */
        dialog: function dialog(fields, title, validate, normalBehavior, columnsNumber) {
            var f = new qxnw.forms();
            if (typeof title === 'undefined') {
                title = "QXNW Dialog";
            }
            if (typeof normalBehavior === 'undefined') {
                normalBehavior = true;
            }
            if (typeof columnsNumber != 'undefined' && (typeof columnsNumber == "integer" || typeof columnsNumber == "number")) {
                f.setColumnsFormNumber(columnsNumber);
            }
            if (typeof validate == 'undefined') {
                validate = false;
            }
            f.setTitle(title);
            f.setFields(fields);
            if (normalBehavior === true) {
                f.ui.accept.addListener("execute", function () {
                    if (validate) {
                        if (!f.validate()) {
                            return;
                        }
                        f.accept();
                    } else {
                        f.accept();
                    }
                });
                f.ui.cancel.addListener("execute", function () {
                    f.reject();
                });
            }
            f.show();
            return f;
        },
        getKeyWords: function getKeyWords(sl, key, minlenght, maxwords) {
            var parts;
            var new_parts;
            var rta = [];
            if (typeof minlenght == 'undefined') {
                minlenght = 2;
            }
            if (typeof maxwords == 'undefined') {
                maxwords = 20;
            }
            var counter = 0;
            for (var i = 0; i < sl.length; i++) {
                if (i == 0) {
                    var d = sl[i][key];
                    var text = qx.bom.String.toText(d);
                    text = qxnw.utils.replaceAll(text, ",", " ");
                    parts = text.split(" ");
                    for (var ib = 0; ib < parts.length; ib++) {
                        if (typeof parts[ib] != 'undefined') {
                            parts[ib] = parts[ib].toLowerCase();
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "(", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "<", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], ">", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "´´", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], ")", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "{", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "}", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "(", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "[", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "]", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "´", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "|", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "||", " ");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "^", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "=", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "..", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "...", "");
                            parts[ib] = qxnw.utils.replaceAll(parts[ib], "/", "");
                            if (parts[ib].length > 0 && parts[ib].length > minlenght && parts[ib] != '' && parts[ib] != null && !qxnw.utils.validateIsInteger(parts[ib])) {
                                if (counter < maxwords) {
                                    rta.push(parts[ib].toLowerCase());
                                    counter++;
                                }
                            }
                        }
                    }
                } else {
                    var d = sl[i][key];
                    var text = qx.bom.String.toText(d);
                    text = qxnw.utils.replaceAll(text, ",", " ");
                    new_parts = text.split(" ");
                    for (var ia = 0; ia < new_parts.length; ia++) {
                        var a = parts.indexOf(new_parts[ia]);
                        if (a == -1) {
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "(", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], ")", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], ">", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "<", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "´´", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "{", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "}", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "(", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "[", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "]", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "´", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "|", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "||", " ");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "^", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "=", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "..", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "...", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], "/", "");
                            new_parts[ia] = qxnw.utils.replaceAll(new_parts[ia], ",,", "");
                            if (new_parts[ia].length > 0 && new_parts[ia].length < minlenght && new_parts[ia] != '' && new_parts[ia] != null && !qxnw.utils.validateIsInteger(new_parts[ia])) {
                                if (counter < maxwords) {
                                    rta.push(new_parts[ia].toLowerCase());
                                    counter++;
                                }
                            }
                        }
                    }
                }
            }
            return rta;
        },
        normalizeChar: function normalizeChar(str) {
            if (typeof str != 'undefined') {
                str = qxnw.utils.replaceLatinChar(str);
                str = str.toLowerCase();
                str = str.replace(/\ /g, "_");
            }
            return str;
        },
        lower: function lower(str) {
            return str.toLowerCase();
        },
        replaceLatinChar: function replaceLatinChar(str) {
            if (typeof str != 'undefined') {
                var texto = str.replace(/(À|Á|Â|Ã|Ä|Å|Æ)/gi, 'A');
                texto = texto.replace(/á/i, 'a');
                texto = texto.replace(/(È|É|Ê|Ë)/gi, 'E');
                texto = texto.replace(/é/g, 'e');
                texto = texto.replace(/(Ì|Í|Î|Ï)/gi, 'I');
                texto = texto.replace(/í/g, 'i');
                texto = texto.replace(/(Ò|Ó|Ô|Ö)/gi, 'O');
                texto = texto.replace(/ó/g, 'o');
                texto = texto.replace(/(Ù|Ú|Û|Ü)/gi, 'U');
                texto = texto.replace(/ú/g, 'u');
                texto = texto.replace(/(Ñ)/gi, 'N');
                texto = texto.replace(/ñ/g, 'n');
                return texto;
            }
        },
        orderByKey: function orderByKey(array, key) {
            qxnw.utils.sortByKey(array, key);
        },
        sortByKey: function sortByKey(array, key) {
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },
        getDomElement: function getDomElement(elm) {
            return elm.getContentElement().getDomElement();
        },
        getFilterSpecialCharacteres: function getFilterSpecialCharacteres() {
            return /[^\\]/g;
        },
        isDebug: function isDebug() {
            return qx.core.Environment.get("qx.debug");
        },
        isInt: function isInt(value) {
            return !isNaN(value) &&
                    parseInt(Number(value)) == value &&
                    !isNaN(parseInt(value, 10));
        },
        tempInformation: function tempInformation() {
            var self = this;
        },
        evalue: function evalue(r, type) {
            if (typeof r == 'undefined' || r == null || r == '' || r == "") {
                return false;
            }
            if (typeof type != 'undefined') {
                switch (type) {
                    case "boolean":
                        if (r == "t") {
                            return true;
                        } else {
                            return false;
                        }
                        break;
                    case "array":
                        if (typeof r === "array" || typeof r === "object") {
                            return true;
                        } else {
                            return false;
                        }
                        break;
                    case "object":
                        if (typeof r === "object" || typeof r === "array") {
                            return true;
                        } else {
                            return false;
                        }
                        break;
                }
            }
            return true;
        },
        develop_console: function develop_console(text) {
            try {
                if (qx.core.Environment.get("qx.debug")) {
                    if (typeof console != "undefined") {
                        console.log({
                            console_log: text,
                            stack: qx.dev.StackTrace.getStackTrace().toString()
                        });
                    }
                }
            } catch (e) {

            }
        },
        nw_console: function nw_console(text, stack, show) {
            qxnw.utils.nwconsole(text, stack, show);
        },
        nwconsole: function nwconsole(text, stack, show) {

//            var ringBuffer = new qx.log.appender.RingBuffer();
//            qx.log.Logger.register(ringBuffer);
//            var events = ringBuffer.getAllLogEvents();
//            var jsonLog = qx.util.Json.stringify(events);
//            ringBuffer.clearHistory();
            if (typeof text != null && typeof text != 'undefined' && typeof text.code != 'undefined' && text.code == 103) {
                if (typeof console != "undefined") {
                    console.log({
                        console: text.message
                    });
                }
                return;
            }
            if (typeof show == 'undefined') {
                show = true;
            }
            if (typeof stack == 'undefined') {
                stack = "";
            }
            var tx = "";
            if (typeof text != 'undefined' && text != null && typeof text.message != 'undefined') {
                tx = "<b>Message header: </b>" + text.message;
            }
            if (typeof text != 'undefined' && text != null && typeof text.columnNumber != 'undefined') {
                tx = tx + ":: Column number: " + text.columnNumber;
            }
            if (typeof text != 'undefined' && text != null && typeof text.fileName != 'undefined') {
                tx = tx + ":: File: " + text.fileName;
            }
            if (typeof text != 'undefined' && text != null && typeof text.stack != 'undefined') {
                tx = tx + ":: Stack: " + text.stack;
            }
            if (typeof text == "object") {
                text = tx;
            }
            try {
                var stackError = "";
                var stackCaller = "";
                var stackTrace = "";
                var trace = trace;
                try {
                    stackError = qx.dev.getStackTraceFromError(text).toString();
                    stackCaller = qx.dev.getStackTraceFromCaller().toString();
                    stackTrace = qx.dev.StackTrace.getStackTrace().toString();
                    trace = qx.log.Logger.trace();
                } catch (e) {

                }
                stack = stack + "::" + stackTrace + "::" + trace;
                if (qx.core.Environment.get("qx.debug")) {
                    if (typeof console != "undefined") {
                        console.log({
                            text: text,
                            stack: stack,
                            stackCaller: stackCaller,
                            stackError: stackError
                        });
                    }
                    if (show) {
                        qxnw.utils.error(text + " | " + stack + "|" + stackError + "|" + stackCaller);
                    }
                } else {
                    if (typeof console != "undefined") {
                        console.log({
                            text: text,
                            stack: stack,
                            stackCaller: stackCaller,
                            stackError: stackError
                        });
                    }
                    if (show) {
                        qxnw.utils.error(text + " | " + stack + "|" + stackError + "|" + stackCaller);
                    }
                }
            } catch (e) {
                if (typeof console != "undefined") {
                    console.log({
                        text: text,
                        stack: stack,
                        stackCaller: stackCaller,
                        stackError: stackError
                    });
                }
                if (show) {
                    qxnw.utils.error(e);
                }
            }
        },
        print: function print(name, data, url) {
            var f = new qxnw.forms();
            f.createPrinterToolBar(name);
            f.addFrame(url, true, data);
            f.show();
        },
        loadCss: function loadCss(url) {
            if (document.createStyleSheet) {
                document.createStyleSheet(url);
            } else {
                var styles = url;
                var newSS = document.createElement('link');
                var id = url;
                id = id.replace(".", "");
                id = id.replace(/\//g, "");
                newSS.id = id;
                newSS.rel = 'stylesheet';
                newSS.type = 'text/css';
                newSS.href = styles;
                document.body.appendChild(newSS);
            }
        },
        require: function (url, callBack, async, addVersion) {
            try {
                var asyncText = "async";
                if (typeof async === "undefined") {
                    async = true;
                }
                if (!async) {
                    asyncText = "";
                }
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
                id = id.replace(/\</gi, "");
                id = id.replace(/\}/gi, "");
                id = id.replace(/\{/gi, "");
                id = id.replace(".", "");

                var version = "";

                var script = document.createElement("script");
                script.type = "text/javascript";
                script.id = id;
                script.className = id;
                script.charset = "UTF-8";
                script.async = asyncText;
                if (!addVersion) {
                    script.src = url;
                } else {
                    if (url.indexOf("?") !== -1) {
                        script.src = url + "&v=" + version;
                    } else {
                        script.src = url + "?v=" + version;
                    }
                }
//            script.src = url;
                var style = document.querySelector("." + id);
                if (!qxnw.utils.evalueData(style)) {
                    script.onload = function () {
                        if (qxnw.utils.evalueData(callBack)) {
                            callBack();
                        }
                    };
                    if (async === true) {
                        document.getElementsByTagName('head')[0].appendChild(script);
                    } else {
                        $("body").append(script);
                    }
                } else {
                    if (qxnw.utils.evalueData(callBack)) {
                        callBack();
                    }
                }
//            script.onload = function () {
//                callBack();
//            };
//            document.body.appendChild(script);
            } catch (e) {
                console.log("error in loadJS", e);
            }
        },
        loadMoneyConverter: function loadMoneyConverter() {
            var sl = new qx.bom.request.Script();
            var src = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/accounting.min.js";
            sl.open("GET", src);
            sl.send();
        }
        ,
        createFormByData: function createFormByData(table, data) {
            var d = new qxnw.forms();
            d.setTableMethod("master");
            if (!d.createFromTable(table)) {
                return;
            }
            d.setParamRecord(data);
            return d;
        }
        ,
        createFormById: function createFormById(id, table) {
            var d = new qxnw.forms();
            d.setTableMethod("master");
            if (!d.createFromTable(table)) {
                return;
            }
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                d.setParamRecord(r);
            };
            var data = {};
            data["id"] = id;
            data["table"] = table;
            rpc.exec("getRecordById", data, func);
            return d;
        }
        ,
        dangerousCharacteres: function dangerousCharacteres() {
            return new Array("<", ">", "|", "&", ";", "$", "%", "'", "\"", "\'", "(", ")", "+", "{", "}");
        }
        ,
        enableMouse: function enableMouse() {
            if (qx.core.Environment.get("qx.debug")) {
                qx.core.Init.getApplication().getRoot().setNativeContextMenu(true);
            }
        }
        ,
        rgbToHex: function rgbToHex(r, g, b) {
            var decColor = r + 256 * g + 65536 * b;
            return decColor.toString(16);
        }
        ,
        createColorSelector: function createColorSelector() {
            var selector = new qx.ui.control.ColorSelector();
            selector.getColors = function () {
                var c = [];
                c["hue"] = this.getHue();
                c["hex"] = this.getValue();
                c["red"] = this.getRed();
                c["blue"] = this.getBlue();
                c["green"] = this.getGreen();
                c["bright"] = this.getBrightness();
                c["saturation"] = this.getSaturation();
                return c;
            };
            return selector;
        }
        ,
        stringValuesToBoolean: function stringValuesToBoolean(data) {
            var v;
            for (v in data) {
                if (data[v] === 'false') {
                    data[v] = false;
                } else if (data[v] === 'true') {
                    data[v] = true;
                }
            }
            return data;
        }
        ,
        createListCheck: function createListCheck() {
            var list = new qx.ui.form.List();
            list.populate = function (method, exec, data) {
                var self = this;
                var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method);
                rpc.setAsync(true);
                var func = function (r) {
                    self.removeAll();
                    for (var i = 0; i < r.length; i++) {
                        var d = r[i];
                        var item = new qx.ui.form.CheckBox(d["nombre"]);
                        item.setValue(d["value"] == "true" || d["value"] == true ? true : false);
                        item.setModel(d);
                        self.add(item);
                    }
                };
                rpc.exec(exec, data, func);
            };
            list.getData = function () {
                var d = [];
                var childs = this.getChildren();
                for (var ia = 0; ia < childs.length; ia++) {
                    if (childs[ia].getValue()) {
                        var r = childs[ia].getModel();
                        d.push(r);
                    }
                }
                return d;
            };
            return list;
        }
        ,
        openFile: function openFile(file, modal) {
            var r = {};
            r["imagen"] = file;
            var d = new qxnw.nw_drive.f_visto_imagenes();
            if (!d.setParamRecord(r)) {
                return;
            }
            if (typeof modal != 'undefined' && modal) {
                d.setModal(true);
            }
            d.settings.accept = function () {
                d.reject();
            }
            d.setWidth(700);
            d.setHeight(650);
            d.show();
        },
        screenShot: function screenShot(open, callback) {
            if (typeof html2canvas == 'undefined') {
                callback("");
                return "";
            }
            if (qx.core.Environment.get("browser.name") == "ie" && parseFloat(qx.core.Environment.get("browser.version")) < 9) {
                callback("");
                return "";
            }
            html2canvas(document.body, {
                onrendered: function (canvas) {
                    var dato = canvas.toDataURL("image/jpeg");
                    dato = dato.replace("image/jpeg", "image/octet-stream");
                    if (open === true) {
                        document.location.href = dato;
                    } else {
                        callback(dato);
                    }
                    return dato;
                }
            });
        },
        getFileData: function getFileData(file) {
            var ruta = file;
            var data = {};
            var img = new Image();
            img.src = ruta;
            var myarr = ruta.split(".");
            var myName = ruta.split("/imagenes/");
            var nombre = myName[1];
            var size = ruta.fileSize;
            var extension = "";
            for (var ii = 0; ii < myarr.length; ii++) {
                var number = ii + 1;
                if (number == myarr.length) {
                    if (myarr[ii] != "") {
                        extension = myarr[ii];
                    }
                }
            }
            var imgIcon = "";
            if (extension == "jpg" || extension == "png" || extension == "gif") {
                imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/phpthumb/phpThumb.php?src=" + ruta + "&w=16&q=" + qxnw.config.getPhpThumbQuality();
            } else
            if (extension == "pdf") {
                imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/16/pdf.png";
            } else
            if (extension == "mp3" || extension == "ogg") {
                imgIcon = qxnw.config.execIcon("media-audio", "mimetypes", 32);
            } else
            if (extension == "html") {
                imgIcon = qxnw.config.execIcon("text-html", "mimetypes", 32);
            } else
            if (extension == "txt") {
                imgIcon = qxnw.config.execIcon("text-plain", "mimetypes", 32);
            } else
            if (extension == "sql") {
                imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/16/texto_sql.png";
            } else
            if (extension == "js") {
                imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/16/javascript.png";
            } else
            if (extension == "php") {
                imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/16/php.png";
            } else
            if (extension == "zip" || extension == "rar" || extension == "tar" || extension == "exe" || extension == "tgz" || extension == "deb" || extension == "gz") {
                imgIcon = qxnw.config.execIcon("zip", "qxnw", 32);
                imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/16/zip.png";
            } else
            if (extension == "pps" || extension == "ppt" || extension == "pptx") {
                imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/16/PowerPoint-icon.png";
            } else
            if (extension == "xls" || extension == "xml" || extension == "xla" || extension == "xlsx" || extension == "xlsb" || extension == "xlsm" || extension == "xltx" || extension == "xltm" || extension == "xlam" || extension == "ods") {
                imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/16/excel.png";
            } else
            if (extension == "doc" || extension == "docx" || extension == "docm" || extension == "dotx" || extension == "dotm" || extension == "odt") {
                imgIcon = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/16/word.png";
            } else
            {
                imgIcon = qxnw.config.execIcon("text-plain", "mimetypes", 32);
            }
            data["icono"] = imgIcon;
            data["nombre"] = nombre;
            data["extension"] = extension;
            data["peso"] = size;
            return data;
        },
        getFontsFamily: function getFontsFamily() {
            var data = {};
            data["Arial"] = "Arial";
            data["Helvetica"] = "Helvetica";
            data["Verdana"] = "Verdana";
            data["Georgia"] = "Georgia";
            data["Cambria"] = "Cambria";
            data["Times"] = "Times";
            data["Garamond"] = "Garamond";
            data["Tahoma"] = "Tahoma";
            data["Futura"] = "Futura";
            data["Impact"] = "Impact";
            data["Monaco"] = "Monaco";
            data["Times New Roman"] = "'Times New Roman'";
            data["Courier New"] = "'Courier New'";
            data["Comic Sans"] = "'Comic Sans'";
            return data;
        },
        addBorder: function addBorder(object, color, borderWidth) {
            if (typeof borderWidth == 'undefined') {
                borderWidth = 3;
            }
            if (typeof color == 'undefined') {
                color = "red";
            }
            var border = new qx.ui.decoration.Decorator().set({
                width: borderWidth,
                style: "solid",
                color: color
            });
            try {
                object.setDecorator(border);
            } catch (e) {
                qxnw.utils.error(e);
            }
        },
        //Para evaluar agregar color
        addColor: function addColor(object, color) {
            var colorText = new qx.ui.decoration.Decorator().set({
                color: color
            });
            try {
                object.setDecorator(colorText);
            } catch (e) {
                qxnw.utils.error(e);
            }
        },
        removeBorders: function removeBorders(object) {
            object.setDecorator(null);
        },
        addBorderToWidget: function addBorderToWidget(widget) {
            var childs = widget.getChildren();
            for (var i = 0; i < childs.length; i++) {
                qxnw.utils.addBorder(childs[i]);
            }
        },
        populateInitSettings: function populateInitSettings(parent) {

            var dataToSend = {};
            dataToSend.appTitle = qxnw.local.getAppTitle();
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setHandleError(false);
            rpc.setAsync(true);
            var func = function (r) {
                if (r === false) {
                    return;
                }
                qxnw.userPolicies.setInitSettings(r);
                var fondo = new qx.ui.basic.Image(r["fondo"]);
                fondo.setUserData("logo", r["fondo"]);
                fondo.setUserData("id", "init_background_image");
                parent.getRoot().add(fondo);
                fondo.addListener("loaded", function () {
                    fondo.addListenerOnce("appear", function () {
                        try {
                            qx.bom.element.Class.add(fondo.getContentElement().getDomElement(), "nw_bg_general");
                            fondo.getContentElement().getDomElement().id = "init_background_image";
                        } catch (e) {
                            qxnw.utils.nwconsole(e);
                        }
                    });
                });
                var image = new qx.ui.basic.Image(r["logo"]);
                image.setUserData("id", "init_logo_image");
                if (typeof r.web !== 'undefined') {
                    if (r.web != '') {
                        image.setCursor("pointer");
                        image.addListener("tap", function () {
                            var win = window.open(r.web, '_blank');
                            win.focus();
                        });
                    }
                }

                image.addListener("loaded", function () {
                    image.addListenerOnce("appear", function () {
                        try {
                            qx.bom.element.Class.add(image.getContentElement().getDomElement(), "nw_logo_inicial");
                            image.getContentElement().getDomElement().id = "init_logo_image";
                        } catch (e) {
                            qxnw.utils.nwconsole(e);
                        }
                    });
                });
                parent.getRoot().add(image, {
                    bottom: "10%",
                    left: "17%"
                });
                /*var imageFB = new qx.ui.basic.Image("/nwlib6/img/facebook.png").set({
                    width: 25,
                    height: 25,
                    scale: true,
                    cursor: "pointer"
                });*/
               // imageFB.setUserData("id", "init_fb_image");
                //imageFB.addListener("tap", function () {
                  //  var win = window.open("https://www.facebook.com/gruponw/", '_blank');
                    //win.focus();
                //});
                parent.getRoot().add(imageFB, {
                    bottom: 40,
                    left: 10
                });
                var imageIG = new qx.ui.basic.Image("/nwlib6/img/instagram_16x16.png").set({
                    width: 25,
                    height: 25,
                    scale: true,
                    cursor: "pointer"
                });
                imageIG.setUserData("id", "init_g_image");
                imageIG.addListener("tap", function () {
                    var win = window.open("", '_blank');
                    win.focus();
                });
                parent.getRoot().add(imageIG, {
                    bottom: 40,
                    left: 33
                });
//                var imageT = new qx.ui.basic.Image("/nwlib6/img/twitter.png").set({
//                    width: 25,
//                    height: 25,
//                    scale: true,
//                    cursor: "pointer"
//                });
//                imageT.setUserData("id", "init_g_image");
//                imageT.addListener("tap", function () {
//                    var win = window.open("https://twitter.com/netwoods", '_blank');
//                    win.focus();
//                });
//                parent.getRoot().add(imageT, {
//                    bottom: 40,
//                    left: 58
//                });
                if (typeof r["fondo_login"] != "undefined") {
                    if (r["fondo_login"] != "") {
                        var root = parent.getRoot();
                        var children = root.getChildren();
                        for (var ia = 0; ia < children.length; ia++) {
                            var wdg = children[ia];
                            if (wdg.classname == "qxnw.login") {
                                wdg.setBackgroundImage(r["fondo_login"], "cover", "no-repeat");
                                break;
                            }
                        }
                    }
                }

                if (typeof r["mensaje"] !== 'undefined' && r["mensaje"] != "") {
                    try {
                        var postfix = qxnw.config.getSeassonMessage();
                        var iDiv = document.createElement('div');
                        iDiv.id = 'footer_home';
                        iDiv.className = 'footer_home';
                        var innerDiv = document.createElement('div');
                        innerDiv.id = 'footer_home_sub';
                        innerDiv.className = 'footer_home_sub';
                        innerDiv.innerHTML = r["mensaje"] + postfix;
                        iDiv.appendChild(innerDiv);
                        document.getElementsByTagName('body')[0].appendChild(iDiv);
                    } catch (e) {

                    }
                }
            };
            rpc.exec("getInitSettings", dataToSend, func);
        },
        /**
         * Send automated notifications. ie qxnw.utils.sendAutomateNotification([{usuario: andresf},{usuario: alexf},{usuario: ladyg}],"Message!", true);
         * @param users {Array} the users array
         * @param message {String} the notification message
         * @param send {Boolean} if the notification had whill be send using the email
         * @returns {void}
         */
        sendAutomateNotification: function sendAutomateNotification(users, message, send) {
            var data = {};
            data.usersList = users;
            if (data.usersList.length == 0) {
                qxnw.utils.information("Seleccione los usuarios para enviar la notifiación");
                return;
            }
            data["part"] = "Desconocida";
            data["message"] = message;
            if (typeof send == 'undefined' || send == null || send == '') {
                data["send"] = qxnw.config.getSendByEmailNotifications();
            } else {
                data["send"] = send;
            }
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "nw_notifications");
            rpc.setAsync(true);
            rpc.exec("saveNotifications", data);
        }
        ,
        /*
         * Take the notificacion code and send data to replace to users already configured. ie qxnw.utils.sendAutoNotification(1, {titulo: "test"});
         * @param {type} code
         * @param {type} data
         * @returns {undefined}
         */
        sendAutoNotification: function sendAutoNotification(code, data) {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "nw_notifications");
            rpc.setAsync(true);
            var func = function (r) {
                self.sendAutomateNotification(r.usersList, r.message, r.enviar_por_correo);
            };
            if (typeof data != 'object') {
                qxnw.utils.nwconsole("Debe enviar como parámetro un array");
            }
            var dat = {};
            dat["id"] = code;
            dat["data"] = data;
            rpc.exec("getAutoNotifications", dat, func);
        }
        ,
        sendNotification: function sendNotification(parent, message) {
            var f = new qxnw.forms();
            f.setColumnsFormNumber(0);
            f.setTitle("Envío de notificaciones");
            var textMessage = new qx.ui.basic.Label("<fieldset><b>Notificación: <br />" + message + "</b></fieldset>").set({
                rich: true
            });
            f.add(textMessage, {
                flex: 1
            });
            var fields = [
                {
                    name: "send",
                    label: f.tr("Enviar por correo electrónico"),
                    type: "checkBox"
                },
                {
                    name: "fecha_entrega",
                    label: f.tr("Fecha entrega"),
                    type: "dateTimeField"
                },
                {
                    name: "observations",
                    label: f.tr("Observaciones"),
                    type: "textArea",
                    mode: "maxWidth"
                },
                {
                    name: "usersList",
                    label: f.tr("Lista de usuarios"),
                    type: "selectListCheck"
                }
            ];
            f.setFields(fields);
            f.ui.usersList.populate("master", "getAllActiveUsers");
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
            f.ui.accept.addListener("execute", function () {
                var data = f.getRecord();
                if (data.usersList.length == 0) {
                    qxnw.utils.information("Seleccione los usuarios para enviar la notifiación");
                    return;
                }
                try {
                    data["part"] = parent.getAppWidgetName();
                } catch (e) {
                    data["part"] = "Desconocida";
                }
                data["message"] = message;
                var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
                rpc.setAsync(true);
                var func = function () {
                    f.accept();
                    qxnw.utils.information("Su notificación a sido enviada con éxito");
                };
                rpc.exec("saveNotifications", data, func);
            });
            f.show();
            //main.updateNotifications();
        }
        ,
        /*
         * Hightlight a word by search value
         * @param {type} value
         * @param {type} query
         * @returns {@exp;value@call;replace}
         */
        highLight: function highLight(value, query) {
            return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + query + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<b>$1</b>");
        }
        ,
        createStringFromDate: function createStringFromDate(date) {
            var df = new qx.util.format.DateFormat("y-M-d");
            return df.format(date);
        },
        createTimestampStringFromDate: function createTimestampStringFromDate(date) {
            var df = new qx.util.format.DateFormat("y-M-d H:m");
            return df.format(date);
        },
        createDateFromString: function createDateFromString(str1) {
            var data = str1.split("-");
            var dt1;
            var mon1;
            var lengtMon;
            if (data[1].length == 1) {
                mon1 = parseInt(str1.substring(5, 6));
                lengtMon = 1;
            } else {
                lengtMon = data[1].length;
                mon1 = parseInt(str1.substring(5, 7));
            }
            if (data[2].length == 1) {
                dt1 = parseInt(str1.substring(6 + lengtMon, 10));
            } else {
                dt1 = parseInt(str1.substring(6 + lengtMon, 10));
            }
            var yr1 = parseInt(str1.substring(0, 4));
            var date1 = new Date(yr1, mon1 - 1, dt1);
            return date1;
        },
        createDateTimeFromString: function createDateTimeFromString(str1) {
            var dat = str1.split(" ");
            var data = dat[0].split("-");
            var dt1;
            var mon1;
            var lengtMon;
            if (data[1].length == 1) {
                mon1 = parseInt(str1.substring(5, 6));
                lengtMon = 1;
            } else {
                lengtMon = data[1].length;
                mon1 = parseInt(str1.substring(5, 7));
            }
            if (data[2].length == 1) {
                dt1 = parseInt(str1.substring(6 + lengtMon, 10));
            } else {
                dt1 = parseInt(str1.substring(6 + lengtMon, 10));
            }
            var yr1 = parseInt(str1.substring(0, 4));
            if (typeof dat[1] == 'undefined') {
                return new Date(yr1, mon1 - 1, dt1);
            }
            var t = dat[1].split(":");
            var h = parseInt(t[0].substring(0, 2));
            var m = parseInt(t[1].substring(0, 2));
            var s = parseInt(t[2].substring(0, 2));
            if (isNaN(h)) {
                h = 0;
            }
            if (isNaN(m)) {
                m = 0;
            }
            if (isNaN(s)) {
                s = 0;
            }
            var date1 = new Date(yr1, mon1 - 1, dt1, h, m, s);
            return date1;
        },
        replaceAll: function replaceAll(text, search, replace) {
            while (text.toString().indexOf(search) != - 1)
                text = text.toString().replace(search, replace);
            return text;
        }
        ,
        trim: function trim(val) {
            if (isNaN(val)) {
                return val;
            }
            if (typeof val == 'undefined') {
                return null;
            }
            return val.replace(/^\s+/g, '').replace(/\s+$/g, '');
        }
        ,
        /*
         * Auto save records passing the table, records and a callback
         * @param {type} table
         * @param {type} records
         * @param {type} callback
         * @returns {undefined}
         */
        saveRecords: function saveRecords(table, records, callback) {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            if (typeof callback != 'undefined') {
                var func = 0;
            } else {
                var func = function () {
                    callback();
                };
            }
            rpc.exec("saveRecords", {table: table, records: records}, func);
        }
        ,
        /*
         * Delete records by id, passing (optional) a callback
         * @param {type} table
         * @param {type} id
         * @param {type} callback
         * @returns {undefined}
         */
        deleteRecord: function deleteRecord(table, id, callback) {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            if (typeof callback != 'undefined') {
                var func = 0;
            } else {
                var func = function () {
                    callback();
                };
            }
            rpc.exec("eliminar", {table: table, id: id}, func);
        }
        ,
        /*
         * Delete attached file passing the path
         * @param {type} path
         * @returns {undefined}
         */
        deleteAttached: function deleteAttached(path) {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            qxnw.utils.loading("Borrando adjunto...");
            var func = function () {
                qxnw.utils.stopLoading();
            };
            setTimeout(function () {
                rpc.exec("deleteAttached", path, func);
            }, 1000);
        }
        ,
        /**
         * Create a random hex color 
         * @returns {String}
         */
        createRandomColor: function createRandomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        ,
        /*
         * Returns a string random word
         * @returns {String}
         */
        getRandomName: function getRandomName() {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 8;
            var randomstring = '';
            for (var i = 0; i < string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
            }
            var name = randomstring;
            return name;
        },
        getABCLetters: function getABCLetters() {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var string_length = 26;
            var d = {};
            d[""] = "";
            for (var i = 0; i < string_length; i++) {
                d[chars.substring(i, i + 1)] = chars.substring(i, i + 1);
            }
            return d;
        },
        /**
         * Create a predefined sound
         * @param soundPath {String} the sound path
         * @returns {void}
         */
        makeSound: function makeSound(soundPath) {
            if (typeof sound == 'undefined') {
                soundPath = "resource/qxnw/chat.wav";
            }
            var sound = new qx.bom.media.Audio(soundPath);
            sound.play();
        }
        ,
        /**
         * Creates a widget with semaphore automatically. You can obtain the widget and join to window
         * @param colors {Array} array containing the colors i.e {"green", "blue", " 
         * @returns {qx.ui.Widget}
         */
        createSemaphore: function createSemaphore(colors) {
            var layout = new qx.ui.layout.HBox();
            layout.setAlignX("center");
            layout.setAlignY("middle");
            var composite = new qx.ui.container.Composite(layout);
            var radioGroup = new qx.ui.form.RadioGroup();
            for (var col in colors) {
                var radioButton = new qx.ui.form.RadioButton();
                var image = new qx.ui.basic.Image("qxnw/" + colors[col] + ".png");
                radioGroup.add(radioButton);
                composite.add(image);
                composite.add(radioButton);
            }
            return composite;
        }
        ,
        /*
         * Log entirely an object in navigator console
         * @param {type} object
         * @returns {unresolved}
         */
        log: function log(object) {
            var debug = qx.dev.Debug.debugObject(object);
            return debug;
        }
        ,
        populateConfig: function populateConfig(widget) {
            var size = qxnw.config.getFontSize();
            var family = qxnw.config.getFontFamilys();
            var font = new qx.bom.Font(size, family);
            widget.setFont(font);
            return font;
        }
        ,
        /**
         * Inspect a object and return an array 
         * @param object {Object} the object to inspect
         * @returns {Array} the array containing the object information
         */
        objectInspector: function objectInspector(object) {
            var data = {};
            var objectType = null;
            if (typeof object != 'undefined') {
                if (object instanceof Object) {
                    objectType = "object";
                } else if (object instanceof String) {
                    objectType = "string";
                } else if (object instanceof Number) {
                    objectType = "integer";
                } else {
                    objectType = "unknown";
                }
            }
            var debug = qx.dev.Debug.debugObjectToString(object);
            data["type"] = objectType;
            data["debug"] = debug;
            return data;
        }
        ,
        /**
         * Save a message error and show it in a debug mode. Returns the procesed error in a String
         * @param error {Object} the error object
         * @param sender {Object} parent
         * @param object {Object} the object to get more information
         * @param save {Boolean} if need to save the report
         * @param ask {Boolean} if try to ask if the reported have to be sended
         * @param send {Boolean} if try to send the report
         * @return {String} the error formatted in a string
         */
        bindError: function bindError(error, sender, object, save, ask, send) {
            var self = this;
            if (typeof ask == 'undefined') {
                ask = true;
            }
            if (typeof send == 'undefined') {
                send = true;
            }
            if (typeof save == 'undefined') {
                save = true;
            }
            if (typeof error == 'undefined') {
                error = {};
                error.message = "Error no definido";
                error.code = 20;
            }
            var v_code = null;
            var v_trace = null;
            var error_text = null;
            if (error instanceof Object) {
                if (typeof error.rpcdetails != 'undefined') {
                    if (error.rpcdetails != null) {
                        if (error.rpcdetails instanceof Object) {
                            error = error.rpcdetails;
                        }
                    }
                }
                error_text = self.handleError(error, true, true);
            } else {
                error_text = error;
            }
            if (typeof error.code != 'undefined') {
                if (error.code == 10) {
                    self.out(error.code);
                    return;
                }
            }
            if (typeof object != 'undefined') {
                if (object != 0) {
                    var finalInspection = qxnw.utils.objectInspector(object);
                    error_text = error_text + "<br />---------------------------------------------------------------------<br />";
                    error_text = error_text + "<br />---------------------------------------------------------------------<br />";
                    try {
                        error_text = error_text + "<b>Datos de OBJETO: Tipo:" + finalInspection.type + " Debug: " + finalInspection.debug + "</b>";
                        error_text = error_text + "<b>TRACE OBJECT: " + object.trace() + "</b>";
                        error_text = error_text + "<b>TRACE Call: " + self.trace() + "</b>";
                    } catch (e) {

                    }
                }
            }

            error_text = error_text.replace("<b>", " ");
            error_text = error_text.replace("</b>", " ");
            if (typeof error.code != 'undefined') {
                v_code = error.code;
            }

            var className = null;
            if (typeof sender != 'undefined') {
                className = sender.classname;
            }
            if (typeof sender != 'undefined') {
                if (save) {
                    self.catchError(error_text, sender, v_code, v_trace);
                }
            }
            if (send) {
                if (ask) {
                    var d = new qxnw.errorReporting();
                    d.processError(error_text, sender);
                } else {
                    var d = new qxnw.errorReporting();
                    var err = d.prepareReport(error_text);
                    if (qx.core.Environment.get("qx.debug")) {
                        qxnw.utils.information(error_text);
                    }
                    d.sendReport(err, 0, false);
                }
            } else {
                return error_text;
                //qxnw.utils.information(error_text);
            }
            return error_text;
        }
        ,
        /**
         * Validate if a value is not empty
         * @param input {String} value to evaluate
         * @return {Boolean} is empty or not
         */
        validateNotEmpty: function validateNotEpty(input) {
            var strTemp = input;
            strTemp = strTemp.trim();
            if (strTemp.length > 0) {
                return true;
            }
            return false;
        }
        ,
//        formatCurrency: function formatCurrency(num) {
//            num = num.toString().replace(/\$|\,/g, '');
//            if (isNaN(num)) {
//                num = "0";
//            }
//            var sign = (num == (num = Math.abs(num)));
//            num = Math.floor(num * 100 + 0.50000000001);
//            var cents = num % 100;
//            num = Math.floor(num / 100).toString();
//            if (cents < 10)
//                cents = "0" + cents;
//            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
//                num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
//            return (((sign) ? '' : '-') + '$' + num + '.' + cents);
//        },
        /**
         * Validate is numeric with decimals.
         * @param input {Var} to validate
         * @return {Boolean} true if is numeric or false if it is not
         */
        validateIsNumeric: function validateIsNumeric(input) {
            var objRegExp = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;
            return objRegExp.test(input);
        }
        ,
        /**
         * Validate is integer.
         * @param input {Var} to validate
         * @return {Boolean} true if is string or false if it is not
         */
        validateIsInteger: function validateIsInteger(input) {
            var objRegExp = new RegExp(/^\s*(\+|-)?\d+\s*$/);
            return objRegExp.test(input);
        }
        ,
        /**
         * If the value is an mathematic operator, returns true or false if not.
         * @param input {String} 
         * @param operators {Array} the operators array
         * @returns {Boolean}
         */
        validateIsMathOperator: function validateIsMathOperator(input, operators) {
            if (typeof operators == 'undefined') {
                operators = ["+", "-", "*", "x", ".", "%", ",", "/"];
            }
            var isEqual = false;
            for (var i = 0; i < operators.length; i++) {
                if (operators[i] === input.toString()) {
                    isEqual = true;
                    break;
                }
            }
            return isEqual;
        }
        ,
        /**
         * Validate is string. Can pass a parameter with a regular expression to validate.
         * @param input {String} a string to validate
         * @param regexpr {String} a regular expression (optional). Default <code>/[a-zA-z]+/</code>
         * @return {Boolean} true if is string or false if it is not
         */
        validateIsString: function validateIsString(input, regexpr) {
            if (typeof regexpr == 'undefined') {
                regexpr = /[\D]+/;
            }
            var objRegExp = new RegExp(regexpr);
            return objRegExp.test(input);
        }
        ,
        /**
         * Validate is a string is e-mail.
         * @param strValue {Var} value to validate
         * @return {Boolean} true if is email or false if it is not
         */
        validateIsEmail: function validateIsEmail(strValue) {
//var objRegExp = /(^[a-z]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\.]*)(\.[a-z]{3})(\.[a-z]{2})*$)/i;
            var objRegExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return objRegExp.test(strValue);
        }
        ,
        /**
         * Create a string from an array.
         * @param record {Array}
         * @param field {String} in the array to construct the resulting string 
         * @param quote {Var} type of separation to the data (optional). Default <code>,</code>
         * @return {Boolean} true if is string or false if it is not
         */
        getStringFromArrayList: function getStringFromArrayList(record, field, quote) {
            if (typeof quote == 'undefined') {
                quote = ',';
            }
            var data = "";
            for (var i = 0; i < record.length; i++) {
                data += record[i][field];
                if (i + 1 < record.length) {
                    data += quote;
                }
            }
            return data;
        },
        getStringFromArray: function getStringFromArray(record, field, quote) {
            if (typeof quote == 'undefined') {
                quote = ',';
            }
            var data = "";
            for (var v in record) {
                data += record[v] + quote;
            }
            data = data.slice(0, -1);
            return data;
        },
        /**
         * Format a date in the most used format (dd(*)mm(*)yyyy)
         * @param date {Date} a date
         * @param separator {String} the separator (-,/,*)
         * @returns {String} the formatted date
         */
        formatDate: function formatDate(date, separator) {
            if (typeof separator == 'undefined') {
                separator = "/";
            }
            var curr_date = date.getDate().toString();
            if (curr_date.length == 1) {
                curr_date = "0" + curr_date;
            }
            var curr_month = date.getMonth() + 1;
            if (curr_month.toString().length == 1) {
                curr_month = "0" + curr_month;
            }
            var curr_year = date.getFullYear();
            var rta = curr_date + separator + curr_month + separator + curr_year;
            return rta;
        }
        ,
        /**
         * Format a number to decimal currency
         * @param number {Integer} the number to format
         * @param digits {Integer} the digits
         * @return {String} a formated number
         */
        formatDecimalCurrency: function formatDecimalCurrency(number, digits) {
            if (typeof digits === 'undefined') {
                digits = 2;
            }
            var num = new qx.util.format.NumberFormat("ES").set({
                minimumFractionDigits: digits,
                prefix: "$"
            });
            return num.format(number);
        },
        /**
         * Format a number to currency
         * @param number {Integer} the number to format
         * @return {String} a formated number
         */
        formatCurrency: function formatCurrency(number) {
            var num = new qx.util.format.NumberFormat("ES");
            return num.format(number);
        },
        /**
         * <b>NOT READY FOR PRODUCTION</b> Try to clear a select, removing the model and items
         * @param selectBox {Object} the {@link qx.ui.form.SelectBox} object
         * @return {void}
         */
        clearSelect: function clearSelect(selectBox) {
            this.resetter.resetItem(selectBox);
        },
        /**
         * Return the actual date in a format: <code>1985-10-20 (yyyy-mm-dd)</code>
         * @return {String} the actual date formatted
         */
        getActualDate: function getActualDate() {
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            curr_month = parseFloat(curr_month) + 1;
            if (curr_month < 10) {
                curr_month = '0' + curr_month;
            }
            if (curr_date < 10) {
                curr_date = '0' + curr_date;
            }
            var curr_year = d.getFullYear();
            return curr_year + "/" + curr_month + "/" + curr_date;
        }
        ,
        /**
         * Return the actual date and time in format: <code>1985-10-20 10:23:56 (yyyy-mm-dd H:i:s)</code>
         * @return {String} the actual date formatted
         */
        getActualCompleteDate: function getActualCompleteDate() {
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            curr_month = parseFloat(curr_month) + 1;
            if (curr_month < 10) {
                curr_month = '0' + curr_month;
            }
            if (curr_date < 10) {
                curr_date = '0' + curr_date;
            }
            var curr_year = d.getFullYear();
            return curr_year + "-" + curr_month + "-" + curr_date + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        },
        getActualCompleteDateNoTime: function getActualCompleteDateNoTime() {
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            curr_month = parseFloat(curr_month) + 1;
            if (curr_month < 10) {
                curr_month = '0' + curr_month;
            }
            if (curr_date < 10) {
                curr_date = '0' + curr_date;
            }
            var curr_year = d.getFullYear();
            return curr_year + "-" + curr_month + "-" + curr_date + " 00:00:00";
        },
        /**
         * Round a number 
         * @param num {Numeric} the number to round 
         * @param dec {Integer} the decimals 
         * @return {Numeric} the rounded number
         */
        round: function round(num, dec) {
            var result = 0;
            try {
                result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
            } catch (e) {
                qxnw.utils.nwconsole(e);
            }
            return result;
        }
        ,
        /**
         * Add days to string date
         * @param date {String} the string date
         * @param days {Integer} the days to add
         * @returns {Date} the object date
         */
        computeDate: function computeDate(date, days) {
            var num = days;
            var hoy = new Date(date);
            hoy.setTime(hoy.getTime() + num * 24 * 60 * 60 * 1000);
            var mes = hoy.getMonth();
            if (mes <= 9)
                mes = '0' + mes;
            date = hoy.getFullYear() + '/' + mes + '/' + hoy.getDate();
            return date;
        }
        ,
        ucfirst: function ucfirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        ,
        lowFirst: function lowFirst(string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        }
        ,
        /**
         * Upper the first letter of a string
         * @param str {String} the value
         * @return {String} 
         */
        ucFirst: function ucFirst(str) {
            return (str + '').replace(/^([a-z])|[\s_]+([a-z])/g, function ($1) {
                return $1.toUpperCase();
            });
        }
        ,
        /*
         * See qxnw.utils.dialog
         * @param {type} fields
         * @returns {unresolved}
         */
        createFastForm: function createFastForm(fields) {
            return qxnw.utils.dialog(fields);
        }
        ,
        /**
         * Low the first letter of a string
         * @param str {String} the value 
         * @return {String}
         */
        lowerFirst: function lowerFirst(str) {
            return (str + '').replace(/^([A-Z])|[\s_]+([A-Z])/g, function ($1) {
                return $1.toLowerCase();
            });
        }
        ,
        /**
         * Create a notify pop up with a message
         * @param sender {Widget} the sender
         * @param message {String} the message to show
         * @param secs {Integer} the seconds to dissapear (optional). Default: 5000.
         * @param showOnClick {Boolean} place the widget to mouse click
         * @param autohide {Boolean} if the popup is autohide
         * @return {void}
         */
        createNotifyPopUp: function createNotifyPopUp(sender, message, secs, showOnClick, autohide) {
            var self = this;
            if (typeof secs == 'undefined') {
                secs = 5000;
            }
            if (typeof secs != 'undefined') {
                var timer = new qx.event.Timer(secs);
                timer.addListener("interval", function () {
                    self.stopPopup();
                    timer.stop();
                });
                timer.start();
            }
            var icon = qxnw.config.execIcon("mail-message-new");
            return self.createPopUp(sender, message, icon, autohide, showOnClick);
        }
        ,
        /**
         * Create a idea pop up with a message
         * @param sender {Widget} the sender
         * @param message {String} the message to show
         * @param secs {Integer} the seconds to dissapear (optional). Default: 5000.
         * @param showOnClick {Boolean} place the widget to mouse click
         * @param autohide {Boolean} if the popup is autohide
         * @return {void}
         */
        createIdeaPopUp: function createIdeaPopUp(sender, message, secs, showOnClick, autohide) {
            var self = this;
            if (typeof secs == 'undefined') {
                secs = 5000;
            }
            var timer = new qx.event.Timer(secs);
            timer.addListener("interval", function () {
                self.stopPopup();
                timer.stop();
            });
            var icon = qxnw.config.execIcon("dialog-information", "status");
            var popup = self.createPopUp(sender, message, icon, autohide, showOnClick);
            timer.start();
            return popup;
        }
        ,
        /**
         * Create a alert pop up with a message
         * @param sender {Widget} the sender
         * @param message {String} the message to show
         * @param secs {Integer} the seconds to dissapear (optional). Default: 5000.
         * @param showOnClick {Boolean} place the widget to mouse click
         * @param autohide {Boolean} if the popup is autohide
         * @return {void}
         */
        createAlertPopUp: function createAlertPopUp(sender, message, secs, showOnClick, autohide) {
            var self = this;
            if (typeof secs == 'undefined') {
                secs = 5000;
            }
            var timer = new qx.event.Timer(secs);
            timer.addListener("interval", function () {
                self.stopPopup();
                timer.stop();
                timer = null;
            });
            var icon = qxnw.config.execIcon("process-stop");
            self.createPopUp(sender, message, icon, autohide, showOnClick);
            timer.start();
        },
        supportLink: function supportLink() {
            return "<a href='javascript: main.openSupport();'>Si desea asistencia personalizada click aquí</a>";
        },
        /**
         * Stops all the popup created
         * @return {void}
         */
        stopPopup: function stopPopup() {
            if (typeof this.popup != 'undefined') {
                this.popup.hide();
            }
        },
        /**
         * Create a popup with a message and icon
         * @param sender {Widget} the sender
         * @param message {String} the message
         * @param icon {String} the path of an icon
         * @param autohide {Boolean} if the popup is autohide or not
         * @param showOnClick {Boolean} if the popup appear on click
         * @param modal {Boolean} the modal popup
         * @return {void}
         */
        createPopUp: function createPopUp(sender, message, icon, autohide, showOnClick, modal) {
            var self = this;
            if (typeof showOnClick == 'undefined') {
                showOnClick = false;
            }
            if (typeof modal != 'undefined' && modal != 0 && modal) {
                //qx.core.Init.getApplication().getRoot().setBlockerColor("black");
                //qx.core.Init.getApplication().getRoot().setBlockerOpacity(0.2);
            }
            self.popup = new qx.ui.popup.Popup(new qx.ui.layout.HBox()).set({
                backgroundColor: "#FFFAD3"
            });
            self.popup.addListener("disappear", function () {
                if (typeof modal != 'undefined' && modal != 0 && modal) {
                    qx.core.Init.getApplication().getRoot().resetBlockerColor();
                    qx.core.Init.getApplication().getRoot().resetBlockerOpacity();
                }
            });
            if (typeof autohide != 'undefined') {
                if (autohide != 0) {
                    if (autohide != null) {
                        if (autohide != '') {
                            self.popup.setAutoHide(autohide);
                        }
                    }
                }
            }
            self.popup.add(new qx.ui.basic.Atom(message, icon), {
                flex: 1
            });
            if (showOnClick) {
                self.popup.placeToWidget(sender);
            } else {
                self.popup.addListener("appear", function () {
                    var bounds = self.popup.getBounds();
                    this.placeToPoint({
                        left: parseInt(Math.round((qx.bom.Viewport.getWidth() / 2) - (bounds.width / 2))),
                        top: parseInt(Math.round((qx.bom.Viewport.getHeight() / 2) - (bounds.height / 2)))
                    });
                });
            }
            self.popup.stopAction = function () {
                self.popup.hide();
                if (typeof modal != 'undefined' && modal != 0 && modal) {
                    qx.core.Init.getApplication().getRoot().resetBlockerColor();
                    qx.core.Init.getApplication().getRoot().resetBlockerOpacity();
                }
            };
            self.popup.show();
            return self.popup;
        }
        ,
        /**
         * Stops all the {@link qxnw.utils.loading}
         * @return {Boolean} if all was ok
         */
        stopLoading: function stopLoading() {
            //TODO: OJO CON ESTO QUE PUEDE BLOQUEAR
//            this.stopBlocker();
            if (this.__loading != null) {
//                var b = this.__loading.getUserData("nw_loading_blocker");
//                if (b != null) {
//                    try {
//                        //b.unblock();
//                        this.__loading.setUserData("nw_loading_blocker", null);
//                        b.destroy();
//                        b = null;
//                    } catch (e) {
//                        console.log(e);
//                    }
//                }
                this.__loading.hide();
                this.__loading = null;
            }
            try {
                var root = qx.core.Init.getApplication().getRoot();
                if (root != null) {
                    root.resetCursor();
                }
                if (typeof main != 'undefined') {
                    main.getWidget().resetCursor();
                }
                document.body.style.cursor = 'default';
            } catch (e) {
                return;
            }
            return true;
        }
        ,
        /**
         * Create a loading in the center of screen with a message (optional) and an icon path. Change de user cursor.
         * @param message {String} the message
         * @param icon {String} the path of icon
         * @param changeCursor {Boolean} if the cursor change to wait mode
         * @param block {Boolean} if the loading block the display
         * @return {Boolean} if the loading is executed correctly
         */
        loading: function loading(message, icon, changeCursor, block) {

            if (qxnw.userPolicies.getShowLoading() == false) {
                return;
            }

            try {
                if (typeof changeCursor == 'undefined' || changeCursor == null) {
                    changeCursor = true;
                }
                if (changeCursor) {
                    var root = qx.core.Init.getApplication().getRoot();
                    root.setCursor("wait");
                    if (typeof main != 'undefined') {
                        main.getWidget().setCursor("wait");
                    }
                    document.body.style.cursor = 'progress';
                }
            } catch (e) {

            }

            if (this.__loading != null) {
                this.__loading.show();
                return this.__loading;
            }

            var popup = new qxnw.widgets.loading(message, icon, changeCursor, block);
            this.__loading = popup;
            return this.__loading;
        },
        /**
         * Get actual date
         * @return {String}
         */
        actualDate: function actualDate() {
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            curr_month = parseFloat(curr_month) + 1;
            if (curr_month < 10) {
                curr_month = '0' + curr_month;
            }
            if (curr_date < 10) {
                curr_date = '0' + curr_date;
            }
            var curr_year = d.getFullYear();
            return curr_year + "-" + curr_month + "-" + curr_date;
        }
        ,
        addValidator: function addValidator(widget) {
            var userNameValidator = new qx.ui.form.validation.AsyncValidator(
                    function (validator, value) {
                        // use a timeout instad of a server request (async)
                        window.setTimeout(function () {
                            if (value == null || value.length == 0) {
                                validator.setValid(false, "Server said no!");
                            } else {
                                validator.setValid(true);
                            }
                        }, 1000);
                    }
            );
        }
        ,
        populateSelectFromArrays: function populateSelectFromArrays(widget, arrays) {
            for (var i = 0; i < arrays.length; i++) {
                qxnw.utils.populateSelectFromArray(widget, arrays[i]);
            }
        },
        /**
         * Populate a {@link qx.ui.form.SelectBox} from a 2D array, i.e: <code>{'name': 'Dallas', 'phone': 123456}</code>
         * The following code shows an example:
         * <pre class='javascript'>
         * var data = {};
         * data['name'] = 'Dallas';
         * data['phone'] = 123456;
         * qxnw.utils.populateSelectFromArray(self.ui.users, data, 'name');
         * </pre>
         * @param selectBox {Object} the selectBox {@link qx.ui.form.SelectBox} to populate 
         * @param array {Array} the 2D array
         * @param defaultValue {String} the default value (optional);
         * @return {Array} return the answer Array. i.e <code>{'size': 12, 'message': 'Ok', 'error': false}</code>
         */
        populateSelectFromArray: function populateSelectFromArray(selectBox, array, defaultValue) {
            var self = this;
            var rta = {};
            rta.size = 0;
            rta.message = "SelectBox populated correctly";
            rta.error = false;
            if (typeof selectBox == 'undefined') {
                self.bindError("El selectBox que intenta ingresar no existe. Trace: " + qx.dev.StackTrace.getStackTrace().toString(), self, selectBox, false);
                rta.message = 'El selectBox que intenta ingresar no existe';
                rta.error = true;
                return false;
            }
            var item;
            var model;
            var v = new Array();
            for (v in array) {
                model = v;
                item = array[v];
                if (typeof item == 'undefined') {
                    item = "";
                }
                var selectItem = new qxnw.widgets.listItem(item);
                selectItem.setModel(model);
                //selectItem.setRich(true);
                selectBox.add(selectItem);
            }
            if (this.resetter == null) {
//                this.resetter = new qx.ui.form.Resetter();
            } else {
                //self.resetter.reset();
            }
            //TODO: SE QUITA PORQUE NO SE HA USADO
            //this.resetter.add(selectBox);
            if (typeof defaultValue != 'undefined' && defaultValue != 0) {
                var items = selectBox._getItems();
                var ia = 0;
                if (defaultValue == 'lastData') {
                    for (ia = 0; ia < items.length; ia++) {
                        if (ia + 1 == items.length) {
                            selectBox.setSelection([items[ia]]);
                        }
                    }
                } else {
                    for (ia = 0; ia < items.length; ia++) {
                        if (items[ia].getModel() == defaultValue) {
                            selectBox.setSelection([items[ia]]);
                        }
                    }
                }
            }
            selectBox.fireEvent("populated");
        },
        /*
         * Auto populate select in async way
         * @param widget {object} the widget
         * @param table {string} the table
         * @returns {void}
         */
        autoPopulateSelectAsync: function autoPopulateSelectAsync(widget, table) {
            this.populateSelectAsync(widget, "master", "populate", {table: table});
        },
        populateFromByArrays: function populateFromBigArrays(widget, data) {
            for (var i = 0; i < data.length; i++) {
                var selectItem = new qxnw.widgets.listItem(data[i].nombre);
                var model = data[i].id;
                selectItem.setUserData("model_data", data[i]);
                selectItem.setModel(model);
                data.add(selectItem);
            }
        },
        /**
         * Populate ASYNC select using an {@link qxnw.rpc} who is a RPC consult.
         * <pre class='javascript'>
         * var data = {};
         * data['id'] = 1;
         * qxnw.utils.populateSelectAsync(self.ui.users, 'master', 'populateSelect', data, 0, 2);
         * </pre>
         * @param selectBox {Object} the {@link qx.ui.form.SelectBox} selectBox to populate 
         * @param method {String} the method to call
         * @param exec {String} the method to execute
         * @param data {Array} the array to pass to the consult
         * @param options {Array} the options. Other array to add first.
         * @param defaultValue {String} the default value (optional);
         * @return {Array} return the answer Array. i.e <code>{'size': 12, 'message': 'Ok', 'error': false}</code>
         */
        populateSelectAsync: function populateSelectAsync(selectBox, method, exec, data, options, defaultValue) {
            var self = this;
            if (typeof data != 'undefined' && data != null && typeof data.preload != 'undefined' && (typeof data.preload == "array" || typeof data.preload == "object")) {
                qxnw.utils.populateSelectFromArray(selectBox, data.preload);
            }
            var rta = {};
            rta.size = 0;
            rta.sended = true;
            rta.message = "SelectBox populated correctly";
            rta.error = false;
            if (typeof selectBox == 'undefined') {
                self.bindError("El selectBox que intenta ingresar no existe. Function: populateSelectAsync. Method: " + method + " Exec: " + exec, self, false);
                return false;
            }
            var rpcUrl = qxnw.userPolicies.rpcUrl();
            var rpc = new qxnw.rpc(rpcUrl, method);
            rpc.setAsync(true);
            //selectBox.removeAll();
            var name = method + "_" + exec;
            if (typeof data != 'undefined') {
                if (typeof data["table"] != 'undefined') {
                    name += "_" + data["table"];
                }
            }

            if (typeof selectBox.isQxNwObject != 'undefined') {
                if (selectBox.isQxNwObject()) {
                    selectBox.markAsLoader(true);
                }
            }
            var func = function (r, save) {
                if (r == null) {
                    return;
                }

                rta.size = r.length;
                if (typeof save == 'undefined') {
                    qxnw.arrayManager.setArray(name, r);
                }
                for (var i = 0; i < r.length; i++) {
                    selectItem = new qxnw.widgets.listItem(r[i].nombre);
                    model = r[i].id;
                    selectItem.setModel(model);
                    selectItem.setUserData("model_data", r[i]);
                    selectBox.add(selectItem);
                }
                if (typeof defaultValue != 'undefined' && defaultValue != 0) {
                    var items = selectBox._getItems();
                    var ia = 0;
                    if (defaultValue == 'lastData') {
                        for (ia = 0; ia < items.length; ia++) {
                            if (ia + 1 == items.length) {
                                selectBox.setSelection([items[ia]]);
                            }
                        }
                    } else {
                        for (ia = 0; ia < items.length; ia++) {
                            if (items[ia].getModel() == defaultValue) {
                                selectBox.setSelection([items[ia]]);
                            }
                        }
                    }
                }
                if (typeof selectBox.isQxNwObject != 'undefined') {
                    if (selectBox.isQxNwObject()) {
                        selectBox.fireDataEvent("loaded", rta);
                    }
                }
//selectBox.fireEvent("changeModelSelection");
                return rta;
            };
//            var savedArray = qxnw.arrayManager.getArray(name);
            var savedArray = null;
            if (savedArray == null) {
                if (typeof data != undefined && typeof data != 0 && data != 0) {
                    rpc.exec(exec, data, func);
                } else {
                    rpc.exec(exec, 0, func);
                }
            } else {
                func(savedArray, false);
            }
            var selectItem = null;
            var model = null;
            var item;
            var v = new Array();
            if (typeof options != 'undefined' && typeof options != 0 && options != 0) {
                for (v in options) {
                    item = options[v];
                    selectItem = new qxnw.widgets.listItem(item);
                    model = v;
                    selectItem.setModel(model);
                    selectBox.add(selectItem);
                }
            }
        },
        /*
         * Populate select saving the values the first time and trying not call the server every moment
         * @param {type} selectBox
         * @param {type} method
         * @param {type} exec
         * @param {type} data
         * @param {type} options
         * @param {type} defaultValue
         * @returns {Boolean}
         */
        populateSelectAsyncRecorder: function populateSelectAsyncRecorder(selectBox, method, exec, data, options, defaultValue, addedName) {
            var self = this;
            var rta = {};
            rta.size = 0;
            rta.sended = true;
            rta.message = "SelectBox populated correctly";
            rta.error = false;
            if (typeof selectBox == 'undefined') {
                self.bindError("El selectBox que intenta ingresar no existe. Function: populateSelectAsync. Method: " + method + " Exec: " + exec, self, false);
                return false;
            }
            var rpcUrl = qxnw.userPolicies.rpcUrl();
            var rpc = new qxnw.rpc(rpcUrl, method);
            rpc.setAsync(true);
            //selectBox.removeAll();
            var name = method + "_" + exec;
            if (typeof data != 'undefined') {
                if (typeof data["table"] != 'undefined') {
                    name += "_" + data["table"];
                }
                if (typeof addedName != 'undefined') {
                    name += addedName;
                }
            }

            if (typeof selectBox.isQxNwObject != 'undefined') {
                if (selectBox.isQxNwObject()) {
                    selectBox.markAsLoader(true);
                }
            }
            var func = function (r, save) {
                rta.size = r.length;
                qxnw.arrayManager.setArray(name, r);
                for (var i = 0; i < r.length; i++) {
                    selectItem = new qxnw.widgets.listItem(r[i].nombre);
                    model = r[i].id;
                    selectItem.setModel(model);
                    selectItem.setUserData("model_data", r[i]);
                    selectBox.add(selectItem);
                }
                if (typeof defaultValue != 'undefined' && defaultValue != 0) {
                    var items = selectBox._getItems();
                    var ia = 0;
                    if (defaultValue == 'lastData') {
                        for (ia = 0; ia < items.length; ia++) {
                            if (ia + 1 == items.length) {
                                selectBox.setSelection([items[ia]]);
                            }
                        }
                    } else {
                        for (ia = 0; ia < items.length; ia++) {
                            if (items[ia].getModel() == defaultValue) {
                                selectBox.setSelection([items[ia]]);
                            }
                        }
                    }
                }
                if (typeof selectBox.isQxNwObject != 'undefined') {
                    if (selectBox.isQxNwObject()) {
                        selectBox.fireDataEvent("loaded", rta);
                    }
                }
//selectBox.fireEvent("changeModelSelection");
                return rta;
            };
            var savedArray = qxnw.arrayManager.getArray(name);
            if (savedArray == null) {
                if (typeof data != undefined && typeof data != 0 && data != 0) {
                    rpc.exec(exec, data, func);
                } else {
                    rpc.exec(exec, 0, func);
                }
            } else {
                func(savedArray, false);
            }
            var selectItem = null;
            var model = null;
            var item;
            var v = new Array();
            if (typeof options != undefined && typeof options != 0 && options != 0) {
                for (v in options) {
                    item = options[v];
                    selectItem = new qxnw.widgets.listItem(item);
                    model = v;
                    selectItem.setModel(model);
                    selectBox.add(selectItem);
                }
            }
        },
        /**
         * Populate select using an {@link qxnw.rpc} who is a RPC consult in a SYNC way.
         * <pre class='javascript'>
         * var data = {};
         * data['id'] = 1;
         * qxnw.utils.populateSelect(self.ui.users, 'master', 'populateSelect', data, 0, 2);
         * </pre>
         * @param selectBox {Object} the {@link qx.ui.form.SelectBox} selectBox to populate 
         * @param method {String} the method to call
         * @param exec {String} the method to execute
         * @param data {Array} the array to pass to the consult
         * @param options {Array} the options. Other array to add first.
         * @param defaultValue {String} the default value (optional);
         * @return {Array} return the answer Array. i.e <code>{'size': 12, 'message': 'Ok', 'error': false}</code>
         */
        populateSelect: function populateSelect(selectBox, method, exec, data, options, defaultValue) {
            var self = this;
            var rta = {};
            rta.size = 0;
            rta.message = "SelectBox populated correctly";
            rta.error = false;
            if (typeof selectBox == 'undefined') {
                self.bindError("El selectBox que intenta ingresar no existe. Function: populateSelect. Method: " + method + " Exec: " + exec, self, selectBox, false, true);
                rta.message = 'El selectBox que intenta ingresar no existe';
                rta.error = true;
                return false;
            }
            var r;
            var name = method + "_" + exec;
            if (typeof data != 'undefined' && data != null) {
                if (typeof data["table"] != 'undefined') {
                    name += "_" + data["table"];
                }
            }
//var savedArray = qxnw.arrayManager.getArray(name);
            var savedArray = null;
            if (typeof data != 'undefined') {
                if (data != null) {
                    if (data != 0) {
                        savedArray = null;
                    }
                }
            }
            if (savedArray == null) {
                var rpcUrl = qxnw.userPolicies.rpcUrl();
                var rpc = new qxnw.rpc(rpcUrl, method);
                if (typeof data != 'undefined' && typeof data != 0 && data != 0 && data != null) {
                    r = rpc.exec(exec, data);
                } else {
                    r = rpc.exec(exec, "");
                }
                if (rpc.isError()) {
                    qxnw.utils.bindError(rpc.getError(), self);
                    rta.message = 'La consulta realizada no fue exitosa.';
                    rta.error = true;
                    return rta;
                }
                qxnw.arrayManager.setArray(name, r);
            } else {
                r = savedArray;
            }
            var selectItem = null;
            var model = null;
            var item;
            var v = new Array();
            if (typeof options != 'undefined' && typeof options != null && typeof options != 0 && options != 0) {
                for (v in options) {
                    item = options[v];
                    selectItem = new qxnw.widgets.listItem(item);
                    model = v;
                    selectItem.setModel(model);
                    selectBox.add(selectItem);
                }
            }
            if (r == false || r == null) {
                return;
            }
            rta.size = r.length;
            if (rta.size === 0) {
                rta.message = "The length of data is 0";
            } else {
                rta.message = "The length of data is " + rta.size;
            }
            for (var i = 0; i < r.length; i++) {
                selectItem = new qxnw.widgets.listItem(r[i].nombre);
                model = r[i].id;
                selectItem.setUserData("model_data", r[i]);
                selectItem.setModel(model);
                selectBox.add(selectItem);
            }

            if (typeof defaultValue != 'undefined' && defaultValue != "" && defaultValue != null) {
                var items = selectBox._getItems();
                var ia = 0;
                if (defaultValue == 'lastData') {
                    for (ia = 0; ia < items.length; ia++) {
                        if (ia + 1 == items.length) {
                            selectBox.setSelection([items[ia]]);
                        }
                    }
                } else {
                    for (ia = 0; ia < items.length; ia++) {
                        var item = items[ia].getModel();
                        if (!isNaN(item)) {
                            item = parseInt(item);
                        }
                        if (!isNaN(defaultValue)) {
                            defaultValue = parseInt(defaultValue);
                        }
                        if (item == defaultValue) {
                            selectBox.setSelection([items[ia]]);
                        }
                    }
                }
            }
            if (this.resetter == null) {
                //this.resetter = new qx.ui.form.Resetter();
            }
            //this.resetter.add(selectBox);
            selectBox.fireEvent("populated");
            return rta;
        },
        /**
         * Returns the user data policies
         * @return {Object} the user policies in array
         */
        up: function up() {
            var user = qxnw.userPolicies.getInstance();
            return user.getData();
        }
        ,
        /**
         * Handle the errors, split the content and returns a text with all the finded information of error
         * @param error {Object} the error object
         * @param isClean {Boolean} indicate if the error message console have rich text or not
         * @param isTrace {Boolean} if the trace is show or not
         * @return {String} the string created
         */
        handleError: function handleError(error, isClean, isTrace) {
            var self = this;
            var errorText = "";
            var undefined = false;
            var errVar = {};
            var b = "<b>";
            var bc = "</b>";
            if (isClean) {
                b = "";
                bc = "";
            }
            errVar.number = typeof error.number == 'undefined' ? "unknown" : error.number;
            errVar.name = typeof error.name == 'undefined' ? "unknown" : error.name;
            errVar.message = typeof error.message == 'undefined' ? "unknown" : error.message;
            errVar.description = typeof error.description == 'undefined' ? "unknown" : error.description;
            errVar.stack = typeof error.stack == 'undefined' ? "unknown" : error.stack;
            errVar.fileName = typeof error.fileName == 'undefined' ? "unknown" : error.fileName;
            errVar.lineNumber = typeof error.lineNumber == 'undefined' ? "unknown" : error.lineNumber;
            errVar.trace = typeof error.trace == 'undefined' ? "unknown" : error.trace;
            if (isTrace) {
                if (errVar.number != 'unknown') {
                    errorText += b + "Number:" + bc + errVar.number.toString();
                    undefined = true;
                }
                if (errVar.name != 'unknown' && errVar.name != null) {
                    errorText += b + " Name: " + bc + errVar.name.toString();
                    undefined = true;
                }
            }
            if (errVar.message != 'unknown') {
                errorText += b + " Message: " + bc + errVar.message.toString();
                undefined = true;
            }
            var hightError = "";
            switch (errVar.number) {
                case 1:
                    hightError = "Illegal Service The service name contains illegal characters or is otherwise deemed unacceptable to the JSON-RPC server.";
                    break;
                case 2:
                    hightError = "Service Not Found The requested service does not exist at the JSON-RPC server.";
                    break;
                case 3:
                    hightError = "Class Not Found If the JSON-RPC server divides service methods into subsets (classes), this indicates that the specified class was not found. ";
                    break;
                case 4:
                    hightError = "Method Not Found The method specified in the request is not found in the requested service.";
                    break;
                case 5:
                    hightError = "Parameter Mismatch If a method discovers that the parameters (arguments) provided to it do not match the requisite types for the method's parameters, it should return this error code to indicate so to the caller.";
                    break;
                case 6:
                    hightError = "Permission Denied A JSON-RPC service provider can require authentication, and that authentication can be implemented such the method takes authentication parameters, or such that a method or class of methods requires prior authentication.";
                    break;
            }
            errVar.description = "Información técnica adicional: " + hightError + ". " + errVar.description;
            if (isTrace) {
                if (errVar.description != 'unknown') {
                    errorText += b + " Description: " + bc + errVar.description.toString();
                    undefined = true;
                }
                if (errVar.stack != 'unknown') {
                    errorText += b + " Stack: " + bc + errVar.stack.toString();
                    undefined = true;
                }
                if (errVar.fileName != 'unknown') {
                    errorText += b + " File Name: " + bc + errVar.fileName.toString();
                    undefined = true;
                }
                if (errVar.lineNumber != 'unknown') {
                    errorText += b + " Line Number: " + bc + errVar.lineNumber.toString();
                    undefined = true;
                }
                if (errVar.trace != 'unknown') {
                    errorText += b + " PHP Trace: " + bc + errVar.trace.toString();
                    undefined = true;
                }
            }
            if (!undefined) {
                errorText += error;
            }
            return errorText;
        }
        ,
        /*
         * Deprecated
         * @param {type} error
         * @returns {undefined}
         */
        errorConnection: function errorConnection(error) {
            var self = this;
            if (typeof error == 'undefined') {
                error = {};
                error.message = "Error no definido";
                error.code = 20;
            }
            var error_text = null;
            if (error instanceof Object) {
                error_text = self.handleError(error, false, true);
            } else {
                error_text = error;
            }

            var window = new qx.ui.window.Window("::Se ha presentado un error de conexión::", qxnw.config.execIcon("dialog-error", "status"));
            this.window = window;
            window.set({
                showClose: false,
                showMinimize: false,
                showMaximize: false,
                modal: true
            });
            window.addListener("resize", window.center);
            var baseLayout = new qx.ui.layout.Grid();
            baseLayout.setSpacing(5);
            //baseLayout.setColumnMaxWidth(0, 300);
            window.setLayout(baseLayout);
            var vbox = new qx.ui.layout.Grow();
            var container = new qx.ui.container.Container(vbox);
            var label = new qx.ui.basic.Label();
            label.set({
                rich: true,
                value: error_text,
                selectable: true
            });
            container.add(label);
            window.add(container, {
                row: 0,
                column: 0
            });
            var buttonOk = new qx.ui.form.Button("Ok", qxnw.config.execIcon("dialog-apply")).set({
                maxWidth: 80,
                alignX: "center"
            });
            window.add(buttonOk, {
                row: 1,
                column: 0
            });
            buttonOk.addListener("execute", function () {
                window.close();
                window.destroy();
            });
            buttonOk.addListener("appear", function () {
                buttonOk.focus();
            }, this);
        },
        searchIntoArrayByKey: function searchIntoArrayByKey(arr, val, key) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][key] == val) {
                    return true;
                }
            }
            return false;
        },
        findIsSameValue: function findIsSameValue(sls, column) {
            var d;
            for (var i = 0; i < sls.length; i++) {
                if (i == 0) {
                    d = sls[i][column];
                    continue;
                }
                if (d != sls[i][column]) {
                    return false;
                }
                d = sls[i][column];
            }
            return true;
        },
        /*
         * Returns a comma string quoted passing an array data, the column and quote (optional)
         * @param {type} data
         * @param {type} column
         * @param {type} quote
         * @returns {Boolean|@exp;ids@call;join}
         */
        getCommaValueByColumn: function getCommaValueByColumn(data, column, quote) {
            if (typeof quote == 'undefined') {
                quote = ",";
            }
            if (data.length == 0) {
                return false;
            }
            var ids = new Array();
            for (var i = 0; i < data.length; i++) {
                ids.push(data[i][column]);
            }
            return ids.join(quote);
        }
        ,
        /**
         * Shows a window with the error. If it is possible, save using an {@link qxnw.rpc} method.
         * <pre class='javascript'>
         * } catch (e) {
         *     var func = function(e) {
         *          if (e) {
         *              console.log('The user press OK');
         *              window.reload();
         *          } else {
         *              console.log("The user press 'Cancel');
         *          }
         *     }
         *     qxnw.utils.error(e, self, func, false);
         * }
         * </pre>
         * @param error {Object} object or string containing an error 
         * @param sender {Object} the parent 
         * @param callback {Function} the function to call when the user press <code>OK</code>
         * @param show {Boolean} if the window is show or not. If not, try to save the error and show them in a console
         * @param silent {Boolean} if sends an silent alarm
         * @param object {Object} the object (if any)
         * @param caller {String} the caller
         * @return {void}
         */
        error: function error(error, sender, callback, show, silent, object, caller) {
            var self = this;
            if (typeof silent == 'undefined') {
                silent = false;
            }
//            if (show) {
//                self.bindError(error, sender);
//                return;
//            }
//            if (typeof error != 'Sesión Inválida') {
//                self.out(10);
//                return;
//            }

            if (typeof error == 'undefined') {
                error = {};
                error.message = "Error no definido";
                error.code = 20;
            }
            try {
                if (typeof error != "undefined") {
                    if (typeof error === "string") {
                        if (error != null) {
                            if (error.trim() == "Sesión Inválida" || error.trim() == "Sesi&oacute;n Inv&aacute;lida") {
                                self.out(10);
                                return;
                            }
                            if (error.indexOf("Possibly due to a cross-domain") != -1) {
                                qxnw.utils.information("Su conexión a internet es deficiente / Your Internet connection is poor");
                                return;
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }

            if (typeof error.classname != "undefined") {
                if (error.classname == "qx.locale.LocalizedString") {
                    error = error.getMessageId();
                }
            }

            if (typeof show == 'undefined') {
                show = true;
            }
            if (typeof callback != 'undefined') {
                if (callback != 0) {
                    self.callBack = callback;
                }
            }
            if (typeof error.message != 'undefined') {
                if (error.message.indexOf("Unknown") != -1) {
                    if (error.message.indexOf("status") != -1) {
                        if (error.message.indexOf("Possibly") != -1) {
                            if (error.message.indexOf("cross-domain") != -1) {
                                qxnw.utils.information(self.tr("Su conexión a internet es inestable. Esto puede reducir su experiencia en el sistema."));
                                return;
                            }
                        }
                    }
                }
            }
            var v_code = null;
            var v_trace = null;
            var error_text = null;
            if (error instanceof Object) {
                if (typeof error.trace != 'undefined') {
                    if (error.trace != null) {
                        v_trace = error.trace;
                    }
                }

                if (typeof error.rpcdetails != 'undefined') {
                    if (error.rpcdetails != null) {
                        if (error.rpcdetails instanceof Object) {
                            error = error.rpcdetails;
                        }
                    }
                }
                var showDetErrors = qxnw.config.getShowDetErrors();
                var showTrace = false;
                if (showDetErrors != null) {
                    if (showDetErrors) {
                        showTrace = showDetErrors;
                    }
                }
                error_text = self.handleError(error, false, showTrace);
            } else {
                error_text = error;
            }

            if (typeof error.code != 'undefined') {
                v_code = error.code;
                if (v_code == 10) {
                    self.out(v_code);
                    return;
                }
            }

            if (typeof object != 'undefined') {
                if (object != 0) {
                    var finalInspection = qxnw.utils.objectInspector(object);
                    error_text += error_text + "<br />---------------------------------------------------------------------<br />";
                    error_text += error_text + "<br />---------------------------------------------------------------------<br />";
                    try {
                        error_text += error_text + "<b>Datos de OBJETO: Tipo:" + finalInspection.type + " Debug: " + finalInspection.debug + "</b>";
                        error_text += error_text + "<b>TRACE OBJECT: " + object.trace() + "</b>";
                        error_text += error_text + "<b>TRACE Call: " + object.trace() + "</b>";
                    } catch (e) {

                    }
                    if (typeof error.other != 'undefined') {
                        error_text += error_text + error.other;
                    }
                }
            }

            if (typeof error_text != 'number' && typeof error_text == "string") {
                error_text = error_text.replace(/'/g, '$', error_text);
            } else {
                error_text = error_text.toString();
            }

            if (typeof callback != 'undefined') {
                self.callBack = callback;
            }

            var trac = qx.log.Logger.trace();
            if (typeof trac == 'undefined') {
                trac = "";
            }
            var nw_stack_trace = "";
            try {
                nw_stack_trace = qx.dev.StackTrace.getStackTrace();
            } catch (e) {

            }
            error_text = error_text + "::" + trac + "::" + nw_stack_trace.toString();
            if (typeof caller != 'undefined') {
                error_text = error_text + "<b>Caller: " + caller + "</b>";
            } else {
                try {
                    var funcCall = qx.lang.Function.getCaller(arguments);
                    var funcCaller = qx.lang.Function.getName(funcCall);
                    error_text = error_text + "<b>Caller: " + funcCaller + "</b>";
                } catch (e) {
                }
            }
            if (v_trace != 'undefined') {
                if (v_trace != null) {
                    error_text = error_text + "::" + v_trace;
                }
            }
            if (typeof error != 'undefined' && typeof error.origin != 'undefined') {
                error_text = error_text + "::<b>Origin code: " + error.origin;
                var err_t = "UNKNOWN";
                switch (error.origin) {
                    case 1:
                        err_t = "SERVER";
                        break;
                    case 2:
                        err_t = "SERVER";
                        break;
                    case 3:
                        err_t = "TRANSPORTE";
                        break;
                    case 4:
                        err_t = "LOCAL";
                        break;
                    default:
                        err_t = "UNKNOWN";
                        break;
                }
                error_text = error_text + "::<b>Origin name: " + err_t;
            }
            var d = new qxnw.errorReporting();
            d.processError(error_text, sender, 0, false, silent, error, show);
            if (typeof sender != 'undefined') {
                self.catchError(error_text, sender, v_code, v_trace);
            }
            return;
        },
        /**
         * Catch the error an try to save using a {@link qxnw.rpc} class. The method is <code>master</code> and
         * the execution method is <code>saveErrors</code>, saving an array, 
         * e.g <code>{'error': 'error text', 'ubicacion': 'qxnw.utils', 'codigo': 1}</code>
         * @param error {String} created text of error object
         * @param sender {Object} the parent or sender
         * @param code {type} the code of error
         * @param trace {type} the trace (optional)
         * @return {Boolean} if the transaction is ok or not
         */
        catchError: function catchError(error, sender, code, trace) {
            var data = {};
            //TODO: NO SE REQUIERE GUARDAR LOS ERRORES EN LAS BASES DE DATOS LOCAL POR EL WS
            return;
            data["error"] = error;
            data["ubicacion"] = sender.classname;
            data["codigo"] = code;
            if (qxnw.userPolicies.getMainMethod() != "") {
                var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "master");
                rpc.setAsync(true);
                rpc.setHandleError(false);
                rpc.exec("saveErrors", data);
            }
            return true;
        }
        ,
        /**
         * Try to call an RPC using {@link qxnw.rpc} method. The method is <code>master</code> and 
         * the execution method is <code>out</code> to remove the session in the server
         * @param v_code {Integer} the code of the out 
         * @return {void}
         */
        out: function out(v_code) {
            var self = this;
            var data = {};
            data.code = v_code;
            if (typeof main != 'undefined') {
                qxnw.utils.information("Su sesión ha vencido por inactividad / Your session has expired due to inactivity", function () {
                    try {
                        if (!qxnw.userPolicies.getModeReAuth()) {
                            var login = new qxnw.login(false);
                            login.ui.usuario.setEnabled(false);
                            login.ui.empresa.setEnabled(false);
                            login.set({
                                opacity: 1,
                                resizable: false
                            });
                            login.addHeaderNote(login.tr("<div style='font-size: 12px; color:#444;'><h2>Tu sesión ha caducado...</h2><p>Confirma tu usuario y contraseña para continuar</p></div>"), true);
                            login.setModal(true);
                            login.addListener("loadedCompany", function () {
                                this.ui.empresa.setValue(this.up.company);
                            });
                            login.addListener("logged", function () {
                                login.close();
                            });
                            login.show();
                            var t = new qx.event.Timer(100);
                            t.start();
                            t.addListener("interval", function (e) {
                                this.stop();
                                login.ui.clave.focus();
                            });
                            qxnw.userPolicies.setModeReAuth(true);
                        } else {
                            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
                            rpc.exec("out", data);
                            if (typeof main != 'undefined') {
                                main.isClosedApp = true;
                                var urlOut = qxnw.config.getUrlOut();
                                if (urlOut == null) {
                                    window.location.reload();
                                } else {
                                    window.location.href = urlOut;
                                }
                            }
                        }
                    } catch (e) {
                        var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
                        rpc.exec("out", data);
                        if (typeof main != 'undefined') {
                            main.isClosedApp = true;
                            var urlOut = qxnw.config.getUrlOut();
                            if (urlOut == null) {
                                window.location.reload();
                            } else {
                                window.location.href = urlOut;
                            }
                        }
                    }
                });
            } else {
                var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
                rpc.exec("out", data);
                if (typeof main != 'undefined') {
                    main.isClosedApp = true;
                    var urlOut = qxnw.config.getUrlOut();
                    if (urlOut == null) {
                        window.location.reload();
                    } else {
                        window.location.href = urlOut;
                    }
                }
            }
        },
        /**
         * Open a window showing a message. The <code>error</code> can be a error object. 
         * If the <code>error</code> code is 10, this function try to set of the user session and
         * update the application. i.e out and remove the actual user session.
         * Calls the <code>callback</code> function when the user press OK. 
         * @param error {Object} a error-object or string message to show in the window
         * @param callback {Function} the function to call when the user press <code>OK</code>
         * @return {void}
         */
        alert: function alert(error, callback) {
            var self = this;
            if (typeof callback != 'undefined') {
                if (callback != 0) {
                    self.callBack = callback;
                }
            }
            var v_code = null;
            var error_text = null;
            if (error instanceof Object) {
                if (typeof error.rpcdetails != 'undefined') {
                    error_text = error.rpcdetails.message;
                } else if (typeof error.message != 'undefined') {
                    error_text = error.message;
                } else {
                    error_text = error;
                }
            } else {
                error_text = error;
            }

            if (typeof error != 'undefined' && typeof error.code != 'undefined') {
                v_code = error.code;
                if (v_code == 10) {
                    self.out(v_code);
                }
            }
            var win = new qx.ui.window.Window("::" + qx.locale.Manager.tr("Alerta") + "::", qxnw.config.execIcon("dialog-warning", "status"));
            //this.window = win;
            win.set({
                showClose: false,
                showMinimize: false,
                showMaximize: false,
                modal: true
            });
            win.addListener("resize", win.center);
            function keyHandler(keyEvent) {
                var key = keyEvent.getKeyIdentifier();
                if (key === "Escape") {
                    win.close();
                }
            }
            win.addListener("keypress", keyHandler, this);
            var baseLayout = new qx.ui.layout.Grid();
            baseLayout.setSpacing(5);
            baseLayout.setColumnMaxWidth(0, 70);
            win.setLayout(baseLayout);
            var vbox = new qx.ui.layout.VBox;
            var container = new qx.ui.container.Composite(vbox).set({
                width: 300
            });
            var label = new qx.ui.basic.Label();
            label.set({
                rich: true,
                value: error_text,
                selectable: true
            });
            container.add(label);
            win.add(container, {
                row: 0,
                column: 0
            });
            var buttonOk = new qx.ui.form.Button("Ok", qxnw.config.execIcon("dialog-apply")).set({
                maxWidth: 80,
                alignX: "center"
            });
            win.add(buttonOk, {
                row: 1,
                column: 0
            });
            buttonOk.addListener("execute", function () {
                win.close();
                win.destroy();
                self.handleOk();
            });
            buttonOk.addListener("appear", function () {
                buttonOk.focus();
            }, this);
            win.open();
        }
        ,
        /**
         * Create an information dialog message, with a callback
         * @param text {String} the message
         * @param callback {Function} the callback
         * @param icon {String} the icon string url
         * @return {void}
         */
        loadLibCalendar: function (classContainer, callback) {

            var cal = document.createElement("div");
            cal.className = "calendar_div";
            document.querySelector(classContainer).appendChild(cal);

            qxnw.utils.loadCss("/nwlib6/nwproject/modules/fullcalendar/lib/main.css?v=0016");
            qxnw.utils.cargaJs("/nwlib6/nwproject/modules/fullcalendar/lib/main.min.js?v=0016", function () {
                callback(cal);
            }, false, true);
        },
        loadCss: function (url, div, onlyAdd, callback) {
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
                    if (qxnw.utils.evalueData(callback)) {
                        callback();
                    }
                };
                if (onlyAdd === true) {
                    document.getElementsByTagName("head")[0].appendChild(ob);
                } else {
                    var style = document.querySelector("#" + id);
                    if (!qxnw.utils.evalueData(style)) {
                        if (qxnw.utils.evalueData(div)) {
                            document.querySelector(div).appendChild(ob);
                        } else {
                            document.getElementsByTagName("head")[0].appendChild(ob);
                        }
                    }
                }
            }
        },
        cargaJs: function (url, callback, idDiv, async) {
            var version = "v=0";
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
                if (qxnw.utils.evalueData(idDiv)) {
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
                        if (qxnw.utils.evalueData(callback)) {
                            callback();
                        }
                    };
                    if (async === true) {
                        document.getElementsByTagName('head')[0].appendChild(a);
                    } else {
                        $("body").append(a);
                    }
                } else {
                    if (qxnw.utils.evalueData(callback)) {
                        callback();
                    }
                }
            } catch (e) {
                console.log(e);
            }
        },
        addMinutes: function addMinutes(date, minutes) {
            var d1 = new Date(date);
            var d2 = new Date(d1);
            d2.setMinutes(d1.getMinutes() + minutes);
            return d2;
        },
        str_replace: function (fields, fieldsChange, variable) {
            var replace = fields;
            var re = new RegExp(replace, "g");
            var str = variable.replace(re, fieldsChange);
            return str;
        },
        strip_tags: function (str) {
            if (!qxnw.utils.evalueData(str)) {
                return false;
            }
            str = str.toString();
            return str.replace(/<\/?[^>]+>/gi, '');
        },
        validaElementExist: function validaElementExist(widget, callback, all) {
            var ele = widget;
            if (typeof widget == "string") {
                ele = document.querySelector(widget);
                if (qxnw.utils.evalueData(all)) {
                    ele = document.querySelectorAll(widget)[all];
                }
            }
            if (!ele || !qxnw.utils.evalueData(ele) || typeof ele == "undefined") {
                setTimeout(function () {
                    qxnw.utils.validaElementExist(widget, callback, all);
                }, 500);
                return false;
            }
            callback(ele);
            return true;
        },
        addClassField: function addClassField(widget, classname, callback) {
            if (!qxnw.utils.evalueData(widget)) {
                setTimeout(function () {
                    qxnw.utils.addClassField(widget, classname, callback);
                }, 500);
                return false;
            }
            if (!qxnw.utils.evalueData(widget.getContentElement())) {
                setTimeout(function () {
                    qxnw.utils.addClassField(widget, classname, callback);
                }, 500);
                return false;
            }
            if (!qxnw.utils.evalueData(widget.getContentElement().getDomElement())) {
                setTimeout(function () {
                    qxnw.utils.addClassField(widget, classname, callback);
                }, 500);
                return false;
            }
            qx.bom.element.Class.add(widget.getContentElement().getDomElement(), classname);
            if (typeof callback !== "undefined") {
                if (qxnw.utils.evalueData(callback)) {
                    callback();
                }
            }
        },
        tr: function (text) {
            return text;
        },
        str: function (text) {
            return qxnw.utils.tr(text);
        },
        lettersArray: function (i) {
            var r = {};
            r["1"] = qxnw.utils.tr("Enero");
            r["2"] = qxnw.utils.tr("Febrero");
            r["3"] = qxnw.utils.tr("Marzo");
            r["4"] = qxnw.utils.tr("Abril");
            r["5"] = qxnw.utils.tr("Mayo");
            r["6"] = qxnw.utils.tr("Junio");
            r["7"] = qxnw.utils.tr("Julio");
            r["8"] = qxnw.utils.tr("Agosto");
            r["9"] = qxnw.utils.tr("Septiembre");
            r["10"] = qxnw.utils.tr("Octubre");
            r["11"] = qxnw.utils.tr("Noviembre");
            r["12"] = qxnw.utils.tr("Diciembre");
            return r[i.toString()];
        },
        mesTextEnglish: function (i) {
            var d = {};
            d["01"] = "January";
            d["02"] = "February";
            d["03"] = "March";
            d["04"] = "April";
            d["05"] = "May";
            d["06"] = "June";
            d["07"] = "July";
            d["08"] = "August";
            d["09"] = "September";
            d["10"] = "October";
            d["11"] = "November";
            d["12"] = "December";
            return d[i];
        },
        dataOfDate: function (date) {
            var onlyF = date;
//            console.log("date", date);
            if (!qxnw.utils.evalueData(date)) {
                date = qxnw.utils.getActualFullDate();
            }
            if (typeof date === "object") {
                date = qxnw.utils.getActualFullDate();
                console.log("dataOfDate::: tipo de dato incorrecto para date");
            }
            if (date.split(" ").length == 1) {
                date = date + " 00:00:00";
            }
//            console.log("date", date);
            onlyF = date.split(" ")[0];

            var diasSemana = new Array(
                    qxnw.utils.tr("Domingo"),
                    qxnw.utils.tr("Lunes"),
                    qxnw.utils.tr("Martes"),
                    qxnw.utils.tr("Miércoles"),
                    qxnw.utils.tr("Jueves"),
                    qxnw.utils.tr("Viernes"),
                    qxnw.utils.tr("Sábado"));

            var dateString = date;
            dateString = dateString.replace(/-/g, '/');

            var d = new Date(dateString);
            var r = {};
            r.fecha_sin_hora = onlyF;
            r.fecha_completa = date;
            r.fecha_anio = d.getFullYear();
            r.fecha_mes = d.getMonth() + 1;
            r.fecha_mes_string = r.fecha_mes.toString();
            if (r.fecha_mes_string.length === 1) {
                r.fecha_mes_string = "0" + r.fecha_mes_string;
            }
            r.fecha_mes_text = qxnw.utils.lettersArray(r.fecha_mes);
            r.fecha_mes_text_english = qxnw.utils.mesTextEnglish(r.fecha_mes_string);
            r.fecha_dia = d.getDate();
            r.fecha_dia_semana = d.getDay();
            r.fecha_dia_text = diasSemana[d.getDay()];
            /*    r.fecha_dia_text = diasArray(r.fecha_dia_semana);*/

            var habil = "SI";
            var festivo = "NO";
            if (r.fecha_dia_semana == 6 || r.fecha_dia_semana == 0) {
                habil = "NO";
            }
            if (r.fecha_dia_semana == 0) {
                festivo = "SI";
            }
            r.fecha_dia_habil = habil;
            r.fecha_dia_festivo = festivo;
            r.fecha = r.fecha_anio + "-" + r.fecha_mes + "-" + r.fecha_dia;
            r.semana = qxnw.utils.semanadelanio(r.fecha);
            r.hora_ex = d.getTime();
            r.hora_horas = d.getHours();
            r.hora_minutos = d.getMinutes();
            r.hora_segundos = d.getSeconds();
            r.hora_completa = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            return r;
        },
        semanadelanio: function (date) {
            var fecha = new Date(date);
            var f2 = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0);
            var f1 = new Date(fecha.getFullYear(), 0, 1, 0, 0);
            var day = f1.getDay();
            if (day == 0)
                day = 7;
            if (day < 5)
            {
                var FW = parseInt(((Math.round(((f2 - f1) / 1000 / 60 / 60 / 24)) + (day - 1)) / 7) + 1);
                if (FW == 53 || FW == 0)
                    FW = 1;
            } else
            {
                FW = parseInt(((Math.round(((f2 - f1) / 1000 / 60 / 60 / 24)) + (day - 1)) / 7));
                if (FW == 0)
                    FW = 52;
                if (FW == 53)
                    FW = 1;
            }
            return(FW);
        },
        diffEntreFechas: function (fechaIni, fechaFin) {
            if (!qxnw.utils.evalueData(fechaFin)) {
                fechaFin = qxnw.utils.getActualFullDate();
            }
//            console.log("fechaIni", fechaIni)
//            console.log("typeof fechaIni", typeof fechaIni)
//            console.log("fechaFin", fechaFin)
//            console.log("typeof fechaFin", typeof fechaFin)
            if (typeof fechaIni === "object") {
                fechaIni = qxnw.utils.getActualFullDate();
                console.log("diffEntreFechas::: tipo de dato incorrecto para fechaIni");
            }
            if (typeof fechaFin === "object") {
                fechaFin = qxnw.utils.getActualFullDate();
                console.log("diffEntreFechas::: tipo de dato incorrecto para fechaFin");
            }
            var diaEnMils = 1000 * 60 * 60 * 24,
                    desde = new Date(fechaIni.substr(0, 10)),
                    hasta = new Date(fechaFin.substr(0, 10)),
                    diff = hasta.getTime() - desde.getTime() + diaEnMils;/* +1 incluir el dia de ini*/

            var r = diff / diaEnMils;
            r = r - 1;
            return r;
        },
        calcularTiempoDosFechas: function (date1, date2, abreviado) {
            if (typeof date2 === "undefined" || !qxnw.utils.evalueData(date2)) {
                date2 = qxnw.utils.getActualFullDate();
            }
            var hoy = qxnw.utils.getActualFullDate();
            var start_actual_time = new Date(date1);
            var end_actual_time = new Date(date2);
            var diff = end_actual_time - start_actual_time;
            var diffSeconds = diff / 1000;
            var HH = Math.floor(diffSeconds / 3600);
            var MM = Math.floor(diffSeconds % 3600) / 60;
            var SS = diffSeconds % 60;
            var days = qxnw.utils.diffEntreFechas(date1, date2);
            var hours = (HH < 10) ? ("0" + HH) : HH;
            var infoDate = qxnw.utils.dataOfDate(date1);
            var infoDate2 = qxnw.utils.dataOfDate(date2);
            var fecha_anioDate = infoDate.fecha_anio;
            var mesDate = infoDate.fecha_mes;
            var mesDateText = infoDate.fecha_mes_text;
            var dayDate = infoDate.fecha_dia;
            var dayDateText = infoDate.fecha_dia_text;
            var hoursDate = infoDate.hora_horas;
            var minutesDate = infoDate.hora_minutos;
            var minutes = ((MM < 10) ? ("0" + MM) : MM);
            var seconds = ((MM < 10) ? ("0" + MM) : SS);
            var formatted = hours + ":" + minutes;
            minutes = parseInt(minutes);
            var isMayor = false;
            if (date1 > date2) {
                isMayor = true;
            }
            var r = {};
            r.hoy = hoy;
            r.fecha_mayor_a_hoy = isMayor;
            r.date1 = date1;
            r.date2 = date2;
            r.time_complet = formatted;
            r.days = days;
            r.hours = hours;
            r.mesDate = mesDate;
            r.mesDateText = mesDateText;
            r.dayDate = dayDate;
            r.dayDateText = dayDateText;
            r.hoursDate = hoursDate;
            r.minutesDate = minutesDate;
            r.minutes = minutes;
            r.seconds = seconds;
//            var dateInFormat = mesDateText + " " + dayDate + " a las " + hoursDate + ":" + minutesDate;
            var dateInFormat = mesDateText + " " + dayDate + " " + qxnw.utils.tr("a las") + " " + hoursDate + ":" + minutesDate + " " + qxnw.utils.tr("del") + " " + fecha_anioDate;
            if (isMayor === true) {
//                dateInFormat = "En " + hoursDate + ":" + minutesDate;
                dateInFormat = mesDateText + " " + dayDate + " " + qxnw.utils.tr("a las") + " " + hoursDate + ":" + minutesDate + " " + qxnw.utils.tr("del") + " " + fecha_anioDate;
            } else {
                if (days > 0) {
                    if (abreviado === true) {
                        dateInFormat = days + " " + qxnw.utils.tr("días");
                    } else {
                        if (days === 1) {
                            dateInFormat = qxnw.utils.str("Ayer a las") + " " + hoursDate + ":" + minutesDate;
                        } else {
//                            dateInFormat = mesDateText + " " + dayDate + " a las " + hoursDate + ":" + minutesDate;
                            dateInFormat = mesDateText + " " + dayDate + " " + qxnw.utils.tr("a las") + " " + hoursDate + ":" + minutesDate + " " + qxnw.utils.tr("del") + " " + fecha_anioDate;
                        }
                    }
                } else {
                    if (parseFloat(hours) < 24) {
                        if (parseFloat(hours) < 1) {
                            if (minutes < 59) {
                                if (abreviado === true) {
                                    dateInFormat = minutes + " " + qxnw.utils.str("mins");
                                } else {
                                    if (qxnw.utils.getLang == "EN") {
                                        dateInFormat = minutes + " " + qxnw.utils.str("minutos") + " " + qxnw.utils.str("hace");
                                    } else {
                                        dateInFormat = qxnw.utils.str("Hace") + " " + minutes + " " + qxnw.utils.str("minutos");
                                    }
                                }
                            }
                        } else {
                            if (abreviado === true) {
                                dateInFormat = parseFloat(hours) + " " + qxnw.utils.str("hrs") + ", " + minutes + " " + qxnw.utils.str("mins");
                            } else {
                                if (qxnw.utils.getLang == "EN") {
                                    dateInFormat = parseFloat(hours) + " " + qxnw.utils.str("horas") + " " + qxnw.utils.str("y") + " " + minutes + " " + qxnw.utils.str("minutos") + " " + qxnw.utils.str("hace");
                                } else {
                                    dateInFormat = qxnw.utils.str("Hace") + " " + parseFloat(hours) + " " + qxnw.utils.str("horas") + " " + qxnw.utils.str("y") + " " + minutes + " " + qxnw.utils.str("minutos");
                                }
                            }
                        }
                    }
                }
            }
            r.dateInFormat = dateInFormat;
            return r;
        },
        getLang: function getLang() {
            var res = "ES";
            return res;
        },
        getActualFullDate: function (format, datep) {
            var hoy = qxnw.utils.getActualDate(format, datep);
            var hour = qxnw.utils.getActualHour(format, datep);
            if (format == "datetime-local") {
                return hoy + "T" + hour;
            }
            return hoy + " " + hour;
        },
        getActualHour: function (format, datep) {
            var d = new Date();
            if (qxnw.utils.evalueData(datep)) {
                d = datep;
            }
            var h = qxnw.utils.addZero(d.getHours());
            var m = qxnw.utils.addZero(d.getMinutes());
            var s = qxnw.utils.addZero(d.getSeconds());
            if (format == "datetime-local") {
                return h + ":" + m;
            }
            return h + ":" + m + ":" + s;
        },
        getActualDate: function (format, datep) {
            var d = new Date();
            if (qxnw.utils.evalueData(datep)) {
                d = datep;
            }
            var day = qxnw.utils.addZero(d.getDate());
            var month = qxnw.utils.addZero(d.getMonth() + 1);
            var year = qxnw.utils.addZero(d.getFullYear());
            return year + "-" + month + "-" + day;
        },
        addZero: function (i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        },
        isOnline: function () {
            if (!navigator.onLine) {
                return false;
            }
            if (typeof navigator.connection !== "undefined") {
//            console.log("navigator.connection", navigator.connection);
                if (navigator.connection.type === "none") {
                    return false;
                }
                return true;
            }
            return navigator.onLine;
        },
        getExtensionFile: function (archivo) {
            archivo = archivo.toString();
            var ext = (archivo.substring(archivo.lastIndexOf("."))).toLowerCase();
//            return ext;

//            console.log("ext.split()", ext.split("?"))
//            if (typeof ext.split("?")[1] !== "undefined") {
            return ext.split("?")[0];
//            }
//            return ext;
        },
        getArraysFile: function (mode) {
            var arr = {};
            arr.extensiones_img = new Array(".gif", ".jpg", ".png", ".JPG", ".JPEG", ".jpeg", ".PNG", ".GIF", ".svg", ".SVG", ".bmp", ".BMP", ".tif", ".TIF");
            arr.extensiones_pdf = new Array(".pdf", ".PDF");
            arr.extensiones_excel = new Array(".xls", ".XLS", ".xlsx", ".XLSX");
            arr.extensiones_word = new Array(".doc", ".DOC", ".docx", ".DOCX", ".odt", ".ODT");
            arr.extensiones_apk = new Array(".apk", ".APK");
            arr.extensiones_html = new Array(".html", ".htm", ".HTML", ".HTM");
            arr.extensiones_zip = new Array(".zip", ".ZIP", ".rar", ".RAR", ".tar", ".TAR", ".war", ".WAR");

            return arr[mode];
        },
        getFileByType: function (file, w, mode) {
            if (!qxnw.utils.evalueData(file)) {
                return "";
            }
            if (qxnw.utils.evalueData(w) === false) {
                w = "200";
            }
            var extensiones_img = qxnw.utils.getArraysFile("extensiones_img");
            var extensiones_pdf = qxnw.utils.getArraysFile("extensiones_pdf");
            var extensiones_excel = qxnw.utils.getArraysFile("extensiones_excel");
            var extensiones_word = qxnw.utils.getArraysFile("extensiones_word");
            var extensiones_apk = qxnw.utils.getArraysFile("extensiones_apk");
            var extensiones_html = qxnw.utils.getArraysFile("extensiones_html");
            var extensiones_zip = qxnw.utils.getArraysFile("extensiones_zip");

            var ext = qxnw.utils.getExtensionFile(file);
            var extreate = false;
            var phpthumb = "/nwlib6/includes/phpthumb/phpThumb.php?src=";
            var phpthumbEnd = "&w=" + w + "&f=";
            if (mode == "nophpthumb") {
                phpthumb = "";
                phpthumbEnd = "";
            }
            for (var i = 0; i < extensiones_img.length; i++) {
                if (extensiones_img[i] == ext) {
                    ext = ext.replace(".", "");
                    if (phpthumbEnd == "") {
                        ext = "";
                    }
                    file = phpthumb + file + phpthumbEnd + ext;
                    extreate = true;
                    break;
                }
            }
            for (var i = 0; i < extensiones_pdf.length; i++) {
                if (extensiones_pdf[i] == ext) {
                    file = "/nwlib6/icons/48/pdf.png";
                    extreate = true;
                    break;
                }
            }
            for (var i = 0; i < extensiones_word.length; i++) {
                if (extensiones_word[i] == ext) {
                    file = "/nwlib6/icons/48/word.png";
                    extreate = true;
                    break;
                }
            }
            for (var i = 0; i < extensiones_excel.length; i++) {
                if (extensiones_excel[i] == ext) {
                    file = "/nwlib6/icons/48/excel.png";
                    extreate = true;
                    break;
                }
            }
            for (var i = 0; i < extensiones_apk.length; i++) {
                if (extensiones_apk[i] == ext) {
                    file = "/nwlib6/icons/apk_icon.png";
                    extreate = true;
                    break;
                }
            }
            for (var i = 0; i < extensiones_html.length; i++) {
                if (extensiones_html[i] == ext) {
                    file = "/nwlib6/icons/html_48.png";
                    extreate = true;
                    break;
                }
            }
            for (var i = 0; i < extensiones_zip.length; i++) {
                if (extensiones_zip[i] == ext) {
                    file = "/nwlib6/icons/zip.svg";
                    extreate = true;
                    break;
                }
            }
            if (extreate === false) {
                file = "/nwlib6/icons/support2.png";
//                file = "/nwlib6/icons/48/upload.png";
//                file = "/nwlib6/icons/attach_file_white_48dp.png";
            }
            return file;
        },
        isMobile: function () {
            var device = navigator.userAgent;
            if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
            {
                return true;
            }
            return false;
        },
        createRandomId: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },
        addNumber: function addNumber(nStr) {
            var x, x1, x2;
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },
        remove: function remove(classOrWidget) {
            if (typeof classOrWidget == "string") {
                const buttons = document.querySelectorAll(classOrWidget);
                buttons.forEach(button => {
                    button.remove();
                });
                return;
            }
            classOrWidget.remove();
        },
        cleanUserNwC: function cleanUserNwC(u) {
            if (u === null) {
                return "";
            }
            u = u.toString();
            var id = u.replace(/\//gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\@/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(/\ /gi, "");
            id = id.replace(/\!/gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(".", "");
            var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
            var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
            for (var i = 0; i < acentos.length; i++) {
                id = id.replace(acentos.charAt(i), original.charAt(i));
            }
            return id;
        },
        evalueData: function evalueData(data, cero) {
            if (typeof data === "undefined") {
                return false;
            }
            if (data === false || data === "" || data === null) {
                return false;
            }
            if (cero == true) {
                if (data == "0") {
                    return false;
                }
            }
            if (typeof data === "number") {
                if (isNaN(parseInt(data))) {
                    return false;
                }
            }
            return true;
        },
        getGET: function (url) {
            var loc = document.location.href;
            if (typeof url !== "undefined") {
                loc = url;
            }
            var getString = loc.split('?')[1];
            if (getString == undefined) {
                return false;
            }
            var GET = getString.split('&');
            var get = {};
            for (var i = 0, l = GET.length; i < l; i++) {
                var tmp = GET[i].split('=');
                get[tmp[0]] = unescape(decodeURI(tmp[1]));
            }
            return get;
        },
        loadingnw_remove: function loadingnw_remove(classnam) {
//            var el = document.querySelectorAll("." + classnam);
            var el = document.querySelector("." + classnam);
            try {
                if (el) {
                    for (var i = 0; i < el.length; i++) {
                        if (el[i]) {
                            el[i].remove();
                        }
                    }
                    el.remove();
                }
            } catch (e) {
                console.log(e);
            }

        },
        loadingnw: function loadingnw(text, classnam, style) {
            var cl = "";
            if (classnam !== null && classnam !== false && typeof classnam !== "undefined") {
                cl = classnam;
            }
            var t = "Cargando, por favor espere...";
            if (text !== null && text !== false && typeof text !== "undefined") {
                t = text;
            }
            var html = ' <h1 class="h1_carga">\n\
                <span class="textloadingnw">' + t + '</span>\n\
                <div class="la-anim-10 la-animate"></div>\n\
            </h1>';
            var div = document.createElement("div");
            div.className = "loadingnw " + cl;
            div.innerHTML = html;
            if (qxnw.utils.evalueData(style)) {
                div.style = style;
            }
            document.body.appendChild(div);
        },
        information: function information(text, callback, icon) {
            // TODO: SE QUITA EL MODAL PARA PROBAR
            var self = this;
            if (text != null && typeof text.code != 'undefined') {
                if (text.code == 10) {
                    self.out(text.code);
                    return;
                }
            }
            if (typeof callback != 'undefined') {
                if (callback != 0) {
                    self.callBack = callback;
                }
            }
            var window = new qx.ui.window.Window("::" + qx.locale.Manager.tr("Información") + "::", qxnw.config.execIcon("dialog-information", "status"));
            window.set({
                showClose: false,
                showMinimize: false,
                showMaximize: false,
                modal: true,
                maxWidth: 700,
                zIndex: 10000000
            });
            //prevenir que con el borrado vuelva a otra página sobre los widgets
            window.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                var target = e.getTarget();
                if (key == "Backspace") { // 8 == backspace
                    if (qxnw.config.checkBackspaceClass(target.classname, self) === true) {
                        e.preventDefault();
                    }
                }
                return;
            });
            window.setAlwaysOnTop(true);
            window.addListener("resize", window.center);
            var baseLayout = new qx.ui.layout.VBox();
            function keyHandler(keyEvent) {
                var key = keyEvent.getKeyIdentifier();
                if (key === "Escape") {
                    window.close();
                }
            }
            window.addListener("keypress", keyHandler, this);
            //baseLayout.setSpacing(5);
            //baseLayout.setColumnMaxWidth(0, 100);
            window.setLayout(baseLayout);
            var vbox = new qx.ui.layout.Grow();
            var container = new qx.ui.container.Composite(vbox);
            if (typeof icon != 'undefined') {
                var image = new qx.ui.basic.Image(icon);
                window.add(image);
            }
            //var embed = new qx.ui.embed.Html(text);
            var embed = new qx.ui.basic.Label(text.toString()).set({
                rich: true,
                selectable: true
            });
//            var embed
            //embed.setWidth(300);
            //embed.setHeight(20);
            //embed.setOverflow("auto", "auto");
            //embed.setDecorator("main");
            container.add(embed);
//            var label = new qx.ui.basic.Label();
//            label.set({
//                rich: true,
//                value: text,
//                selectable: true
//            });
//            container.add(label);


            window.add(container, {
                flex: 1
            });
            var buttonOk = new qx.ui.form.Button("Ok", qxnw.config.execIcon("dialog-apply")).set({
                maxWidth: 80,
                alignX: "center"
            });
            window.add(buttonOk);
            buttonOk.addListener("execute", function () {
                window.close();
                window.destroy();
                if (typeof callback != 'undefined' && callback != 0) {
                    self.handleOk(null, callback);
                } else {
                    self.handleOk(null, function () {

                    });
                }

            });
            buttonOk.addListener("appear", function () {
                buttonOk.focus();
            }, window);
            this.window = window;
            embed.setRich(true);
//            window.setModal(true);
            window.open();
            return window;
        },
        error_show: function error_show(text, callback, icon) {
            var self = this;
            if (typeof text.code != 'undefined') {
                if (text.code == 10) {
                    self.out(text.code);
                    return;
                }
            }
            if (typeof callback != 'undefined') {
                if (callback != 0) {
                    self.callBack = callback;
                }
            }
            var window = new qxnw.forms();
            window.setIcon(qxnw.config.execIcon("dialog-information", "status"));
            window.setTitle("::" + qx.locale.Manager.tr("Error report") + "::");
            window.set({
                showClose: false,
                showMinimize: false,
                showMaximize: false,
                modal: true,
                width: 700
            });
            window.addListener("resize", window.center);
            var baseLayout = new qx.ui.layout.VBox();
            function keyHandler(keyEvent) {
                var key = keyEvent.getKeyIdentifier();
                if (key === "Escape") {
                    window.close();
                }
            }
            window.addListener("keypress", keyHandler, this);
            window.setLayout(baseLayout);
            //var vbox = new qx.ui.layout.Grow();
            var container = new qx.ui.container.Scroll();
            if (typeof icon != 'undefined') {
                var image = new qx.ui.basic.Image(icon);
                window.add(image);
            }
            var embed = new qx.ui.embed.Html(text).set({
                overflowX: "scroll",
                overflowY: "scroll"
            });
            container.add(embed);
            window.masterContainer.add(container, {
                flex: 1
            });
            var buttonOk = new qx.ui.form.Button("Ok", qxnw.config.execIcon("dialog-apply")).set({
                maxWidth: 80,
                alignX: "center"
            });
            window.add(buttonOk);
            buttonOk.addListener("execute", function () {
                window.close();
                window.destroy();
                self.handleOk();
            });
            buttonOk.addListener("appear", function () {
                buttonOk.focus();
            }, this);
            this.window = window;
            window.open();
        },
        /**
         * Static function for create a question dialog, with an Ok button and Cancel button. Can receive a callback, returning if "OK
         * was pressed <code>true</code> or <code>false</code> if the "Cancel" button was pressed
         * @param text {String} the message
         * @param callback {Function} the callback function. In the callback, returns a {Boolean} data, indicating if the user press "Ok" or "Cancel" and the parameter (if exists)
         * @param param {object} the parameter returned on ok or cancel
         * @param colSpan {Numeric} the parameter for the colSpan atribute of the above widget
         * @return {undefined}
         */
        question: function question(text, callback, param, colSpan, options) {
            var self = this;
            var textAccept = "Ok";
            var textAcceptMaxWidth = 100;
            var textCancel = "Cancelar";
            var textCancelMaxWidth = 100;
            var containerWidth = 300;
            if (qxnw.utils.evalueData(options)) {
                if (qxnw.utils.evalueData(options.textAccept)) {
                    textAccept = options.textAccept;
                }
                if (qxnw.utils.evalueData(options.textAcceptMaxWidth)) {
                    textAcceptMaxWidth = options.textAcceptMaxWidth;
                }
                if (qxnw.utils.evalueData(options.textCancel)) {
                    textCancel = options.textCancel;
                }
                if (qxnw.utils.evalueData(options.textCancelMaxWidth)) {
                    textCancelMaxWidth = options.textCancelMaxWidth;
                }
                if (qxnw.utils.evalueData(options.containerWidth)) {
                    containerWidth = options.containerWidth;
                }
            }

            if (typeof colSpan == 'undefined') {
                colSpan = 2;
            }
            if (typeof callback != 'undefined') {
                self.callBack = callback;
            }
            var title = "::" + qx.locale.Manager.tr("Confirmación") + "::";
            var window = new qx.ui.window.Window(title, qxnw.config.execIcon("dialog-information", "status"));
            this.window = window;
            //prevenir que con el borrado vuelva a otra página sobre los widgets
            this.window.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                var target = e.getTarget();
                if (key == "Backspace") { // 8 == backspace
                    if (qxnw.config.checkBackspaceClass(target.classname, self) === true) {
                        e.preventDefault();
                    }
                }
                return;
            });
            window.set({
                showClose: false,
                showMinimize: false,
                showMaximize: false,
                modal: true
            });
            function keyHandler(keyEvent) {
                var key = keyEvent.getKeyIdentifier();
                if (key === "Escape") {
                    window.close();
                }
            }
            window.addListener("keypress", keyHandler, this);
            window.addListener("resize", window.center);
            var baseLayout = new qx.ui.layout.Grid();
            baseLayout.setSpacing(5);
            baseLayout.setColumnFlex(0, 1);
            baseLayout.setColumnMaxWidth(0, 70);
            baseLayout.setColumnMaxWidth(1, 70);
            baseLayout.setColumnMinWidth(0, 70);
            baseLayout.setColumnMinWidth(1, 70);
            window.setLayout(baseLayout);
            var vbox = new qx.ui.layout.VBox;
            var container = new qx.ui.container.Composite(vbox).set({
                width: containerWidth
            });
            var label = new qx.ui.basic.Label();
            label.set({
                rich: true,
                value: text
            });
            container.add(label);
            window.add(container, {
                row: 0,
                column: 0,
                colSpan: colSpan
            });
            var buttonOk = new qx.ui.form.Button(qx.locale.Manager.tr(textAccept), qxnw.config.execIcon("dialog-apply")).set({
                maxWidth: textAcceptMaxWidth,
                alignX: "center"
            });
            window.add(buttonOk, {
                row: 1,
                column: 0
            });
            var buttonCancel = new qx.ui.form.Button(qx.locale.Manager.tr(textCancel), qxnw.config.execIcon("dialog-close")).set({
                maxWidth: textCancelMaxWidth,
                alignX: "center"
            });
            window.add(buttonCancel, {
                row: 1,
                column: 1
            });
            if (typeof param != 'undefined') {
                buttonOk.setUserData("param", param);
            }
            if (typeof callback != 'undefined') {
                buttonOk.setUserData("nw_callback", callback);
            }
            buttonOk.addListener("execute", function () {
                window.close();
                window.destroy();
                var param = null;
                var call = this.getUserData("nw_callback");
                if (this.getUserData("param") != null) {
                    param = this.getUserData("param");
                }
                self.handleOk(param, call);
            });
            if (typeof param != 'undefined') {
                buttonCancel.setUserData("param", param);
            }
            window.setUserData("nw_question_accept_button", buttonOk);
            window.setUserData("nw_question_cancel_button", buttonCancel);
            window.getAcceptButton = function () {
                return this.getUserData("nw_question_accept_button");
            };
            window.getCancelButton = function () {
                return this.getUserData("nw_question_cancel_button");
            };
            buttonCancel.addListener("execute", function () {
                window.close();
                window.destroy();
                var param = null;
                if (this.getUserData("param") != null) {
                    param = this.getUserData("param");
                }
                self.handleCancel(param);
            });
            buttonOk.addListener("appear", function () {
                buttonOk.focus();
            }, this);
            self.close = function () {
                self.window.close();
                self.window.destroy();
            };
            window.open();
            return window;
        },
        /*
         * Función para mostrar una imagen en una ventana rápida 
         * @param path {string} el path de la imagen 
         * @returns {void}
         */
        findIP: function findIP(onNewIP) {
            console.log("find");
        },
        getIPs: function getIPs(callback) {
//            var ip = false;
//            window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || false;
//            if (window.RTCPeerConnection)
//            {
//                ip = [];
//                var pc = new RTCPeerConnection({iceServers: []}), noop = function () {};
//                pc.createDataChannel('');
//                pc.createOffer(pc.setLocalDescription.bind(pc), noop);
//
//                pc.onicecandidate = function (event) {
//                    if (event && event.candidate && event.candidate.candidate) {
//                        var s = event.candidate.candidate.split('\n');
//                        ip.push(s[0].split(' ')[4]);
//
//                        console.log("IP", ip);
//
//                        callback(ip);
//                    }
//                };
//            }
//            return;

            console.log("Start search IP");
            var iceServers = [];
            var moz = !!navigator.mozGetUserMedia;
            if (moz) {
                iceServers.push({
                    url: 'stun:23.21.150.121'
                });
                iceServers.push({
                    url: 'stun:stun.services.mozilla.com'
                });
            } else {
                iceServers.push({
                    url: 'stun:stun.l.google.com:19302'
                });
                iceServers.push({
                    url: 'stun:stun.anyfirewall.com:3478'
                });
            }
            iceServers.push({
                'url': 'turn:192.158.29.39:3478?transport=udp',
                'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                'username': '28224511:1379330808'
            });
            iceServers.push({
                'url': 'turn:192.158.29.39:3478?transport=tcp',
                'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                'username': '28224511:1379330808'
            });
            iceServers.push({
                url: 'turn:turn.bistri.com:80',
                username: 'homeo',
                credential: 'homeo'
            });
            iceServers.push({
                url: 'stun:stun.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stun1.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stun2.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stu3.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stun4.l.google.com:19302'
            });
            iceServers.push({
                url: 'stun:stun.ekiga.net'
            });
            iceServers.push({
                url: 'stun:stun.ideasip.com'
            });
            iceServers.push({
                url: 'stun:stun.iptel.org'
            });
            iceServers.push({
                url: 'stun:stun.rixtelecom.se'
            });
            iceServers.push({
                url: 'stun:stun.schlund.de'
            });
            iceServers.push({
                url: 'stun:stunserver.org'
            });
            iceServers.push({
                url: 'stun:stun.softjoys.com'
            });
            iceServers.push({
                url: 'stun:stun.voiparound.com'
            });
            iceServers.push({
                url: 'stun:stun.voipbuster.com'
            });
            iceServers.push({
                url: 'stun:stun.voipstunt.com'
            });
            iceServers.push({
                url: 'stun:stun.stunprotocol.org:3478'
            });
            iceServers.push({
                url: 'stun:stun.services.mozilla.com'
            });
            iceServers.push({
                url: 'stun:stun.sipgate.net'
            });
            iceServers.push({
                url: 'turn:numb.viagenie.ca:3478',
                username: 'assdres@gmail.com',
                credential: 'padre08'
            });
            iceServers.push({
                url: 'stun:stun.l.google.com:19302?transport=udp'
            });

            iceServers.push({
                url: 'turn:turn.gruponw.com:3478',
                username: 'andresf',
                credential: 'padre08'
            });
            iceServers.push({
                url: 'turn:turn.gruponw.com:5349',
                username: 'andresf',
                credential: 'padre08'
            });
            var peerConnectionConfig = {
                iceServers: iceServers
            };
            console.log("peerConnectionConfig", peerConnectionConfig);
            console.log("peerConnectionConfig.iceServers", peerConnectionConfig.iceServers);

            var os = {}; //  onNewIp - your listener function for new IPs
            var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
//            var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
            var servers = {iceServers: peerConnectionConfig.iceServers};
            var mediaConstraints = {
                optional: [{RtpDataChannels: true}]
            };
//            var pc = new myPeerConnection({iceServers: []}),
            var pc = new myPeerConnection(servers, mediaConstraints),
                    noop = function () {},
                    localIPs = {},
                    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
                    key;
            function ipIterate(ip) {
                if (!localIPs[ip])
                    var d = {
                        ip: ip,
                        id_red: os[0]
                    };
                console.log("Search found IP:::", d);
                if (typeof d !== "undefined") {
                    if (d !== null && d !== false && d !== "") {
                        callback(d);
                        localIPs[ip] = true;
                    }
                }
            }
            pc.createDataChannel(""); //create a bogus data channel
            pc.createOffer(function (sdp) {
                console.log("Start search IP:::pc.createOffer:::sdp:::", sdp);
                sdp.sdp.split('\n').forEach(function (line) {
                    console.log("Start search IP:::pc.createOffer:::line:::", line);
                    if (line.indexOf('candidate') < 0)
                        return;
//                    line.match(ipRegex).forEach(ipIterate);
                    var lineMatch = line.match(ipRegex);
                    for (var i = 0; i < lineMatch.length; i++) {
                        ipIterate(lineMatch[i]);
                        break;
                    }
                });
                pc.setLocalDescription(sdp, noop, noop);
            }, noop); // create offer and set local description
            pc.onicecandidate = function (ice) { //listen for candidate events
//                console.log(ice.candidate.candidate);
                console.log("Start search IP:::ice.candidate.candidate:::", ice.candidate.candidate);
                if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) {
                    qxnw.utils.information("Error al traer ice candidate.");
                    console.log("ERROR:::Start search IP:::ice.candidate.candidate:::ice:::", ice);
                    console.log("ERROR:::Start search IP:::ice.candidate.candidate:::ice.candidate:::", ice.candidate);
                    console.log("ERROR:::Start search IP:::ice.candidate.candidate:::ice.candidate.candidate:::", ice.candidate.candidate);
                    console.log("ERROR:::Start search IP:::ice.candidate.candidate:::ice.candidate.candidate.match(ipRegex):::", ice.candidate.candidate.match(ipRegex));
                    return;
                }
                os = ice.candidate.candidate.split(":")[1];
                os = os.split(" ");
//                var iceMatch = ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
                console.log("Start search IP:::ice.candidate.candidate:::os:::", os);
                var iceMatch = ice.candidate.candidate.match(ipRegex);
                for (var i = 0; i < iceMatch.length; i++) {
                    ipIterate(iceMatch[i]);
                    break;
                }
            };
        },
        activePrincipalSkinner: function activePrincipalSkinner(self, click) {
            var buttons = [
                {
                    label: 'Imprimir Skinner',
                    name: 'imprimir_skinner',
                    icon: qxnw.config.execIcon("document-print")
                }
            ];
            self.addButtons(buttons);
            qxnw.utils.addClassToElement(self, "principalSkinner");
            if (click === true) {
                self.ui.imprimir_skinner.addListener("click", function () {
                    qxnw.utils.printSkinnerLaunch(self, "general");
                });
            }
        },
        printSkinnerLaunch: function printSkinnerLaunch(self, tipo, htmlEnc, htmlFooter, id_relation, codeHtml, selfOfArrays, opcional, dontPrint) {
            qxnw.utils.loading("Cargando, por favor espere...");
            function dataCajas(tipo) {
                var g = document.querySelectorAll(".principalSkinner " + tipo);
                for (var i = 0; i < g.length; i++) {
                    var x = g[i];
                    var t = x.value;
                    x.setAttribute("value", t);
//                    if (tipo == "input") {
//                        x.setAttribute("value", t);
//                    } else {
//                        var txt = document.createTextNode(t);
//                        x.value = "";
//                        x.innerHTML(txt);
//                        x.appendChild(txt);
//                        x.value = t;
//                    }
                }
            }
            function addStyles(self) {
                var boundsForm = self.getBounds();
                var w = boundsForm.width;
                var h = boundsForm.height;
                self.setWidth(1000);
                self.setMaxWidth(1000);
                qxnw.utils.addClassToElement(self, "principalSkinner");
            }
            var boundsForm = self.getBounds();
            var w = boundsForm.width;
            function cleanStyles(self) {
                self.setWidth(w);
                self.setMaxWidth(w);
            }
            numnav = 0;
            function htmlForms(self, htmlEnc, htmlFooter, isArray) {
                var w = "";
                var h = "";
                if (self != false) {
                    var boundsForm = self.getBounds();
                    w = boundsForm.width;
                    h = boundsForm.height;
                }
                var htmlOb = "";
                htmlOb += "<div class='containerForm' style='width: " + w + "px; height: " + h + "px'>";
                if (typeof htmlEnc != "undefined") {
                    if (htmlEnc != false && htmlEnc != null && isArray != true) {
                        htmlOb += "<div class='containGroup'>" + htmlEnc + "</div>";
                    } else {
                        if (htmlEnc != false) {
                            htmlOb += "<div class='titleGroup'>" + htmlEnc + "</div>";
                        }
                    }
                }
                if (self != false) {
                    self.show();
                    self.focus();
                    if (self.getContainerFields().getContentElement().getDomElement() == null) {
                        qxnw.utils.stopLoading();
                        if (isArray === true) {
                            qxnw.utils.information("Por favor abra la pestaña " + htmlEnc + " para poder imprimir.");
                        } else {
                            qxnw.utils.information("El ítem que intenta imprimir no existe.");
                        }
                        qxnw.utils.stopLoading();
                        if (typeof codeHtml != "undefined" && codeHtml != false) {
                            for (var x = 0; x < codeHtml.length; x++) {
                                var s = codeHtml[x];
                                cleanStyles(s.self);
                            }
                        } else {
                            cleanStyles(self);
                        }
                        return false;
                    }
                    htmlOb += "<div class='containerFields'>" + self.getContainerFields().getContentElement().getDomElement().innerHTML + "</div>";
                    numnav++;
                }
                if (typeof htmlFooter != "undefined") {
                    if (htmlFooter != false && htmlFooter != null && isArray != true)
                        htmlOb += htmlFooter;
                }
                htmlOb += "</div>";
                return htmlOb;
            }

            addStyles(self);
            if (typeof codeHtml != "undefined" && codeHtml != false) {
                for (var x = 0; x < codeHtml.length; x++) {
                    var s = codeHtml[x];
                    addStyles(s.self);
                }
            }

            dataCajas("textarea");
            dataCajas("input");
            var time = 1500;
            if (typeof codeHtml != "undefined" && codeHtml != false) {
                time = 500;
                console.log(selfOfArrays);
                selfOfArrays.showTabView(1);
                if (codeHtml.length > 1) {
                    setTimeout(function () {
                        selfOfArrays.showTabView(2);
                        dataCajas("textarea");
                        dataCajas("input");
                    }, time);
                }
                if (codeHtml.length >= 2) {
                    time = time + 1500;
                    setTimeout(function () {
                        selfOfArrays.showTabView(3);
                        dataCajas("textarea");
                        dataCajas("input");
                    }, time);
                }
                if (codeHtml.length >= 3) {
                    time = time + 1500;
                    setTimeout(function () {
                        selfOfArrays.showTabView(4);
                        dataCajas("textarea");
                        dataCajas("input");
                    }, time);
                }
                if (codeHtml.length >= 4) {
                    time = time + 1500;
                    setTimeout(function () {
                        selfOfArrays.showTabView(5);
                        dataCajas("textarea");
                        dataCajas("input");
                    }, time);
                }
                if (codeHtml.length >= 5) {
                    time = time + 1500;
                    setTimeout(function () {
                        selfOfArrays.showTabView(6);
                        dataCajas("textarea");
                        dataCajas("input");
                    }, time);
                }
                if (codeHtml.length >= 6) {
                    time = time + 1500;
                    setTimeout(function () {
                        selfOfArrays.showTabView(7);
                        dataCajas("textarea");
                        dataCajas("input");
                    }, time);
                }
            }

            setTimeout(function () {
                dataCajas("textarea");
                dataCajas("input");
                var htmlOb = "";
                if (typeof codeHtml != "undefined" && codeHtml != false) {
                    var ht = "";
                    ht += htmlForms(false, htmlEnc, false);
                    for (var x = 0; x < codeHtml.length; x++) {
                        var s = codeHtml[x];
                        var d = htmlForms(s.self, s.title, false, true);
                        if (!d) {
                            cleanStyles(self);
                            return;
                        }
                        ht += d;
                    }
                    ht += htmlForms(false, false, htmlFooter);
                    htmlOb = ht;
                } else {
                    htmlOb = htmlForms(self, htmlEnc, htmlFooter);
                }

                var data = {};
                data.html = htmlOb;
                if (typeof id_relation != "undefined") {
                    if (id_relation != false && id_relation != null)
                        data.id_relation = id_relation;
                }
                data.nombre = tipo;
                data.opcional = opcional;
                var rpc = new qxnw.rpc(self.getRpcUrl(), "nwMaker", true);
                var func = function (r) {
                    if (typeof codeHtml != "undefined" && codeHtml != false) {
                        for (var x = 0; x < codeHtml.length; x++) {
                            var s = codeHtml[x];
                            cleanStyles(s.self);
                        }
                    } else {
                        cleanStyles(self);
                    }
                    qxnw.utils.stopLoading();
                    if (dontPrint !== true) {
                        if (window.location.hostname == "soandes.loc" || window.location.hostname == "192.168.1.53" || window.location.hostname == "army.gruponw.com" || window.location.hostname == "soandes.gruponw.com" || window.location.hostname == "armyweb.soandes.co") {
                            var WindowObject = window.open("/nwlib6/css/addPrint_soandes.php?id=" + r + "&type=" + tipo + "&relacion=" + id_relation + "&opcional=" + opcional, 'Forms printer skinner', 'height=' + screen.height + ',width=' + screen.width);
                        } else {
                            var WindowObject = window.open("/nwlib6/css/addPrint.php?id=" + r + "&type=" + tipo, 'Forms printer skinner', 'height=' + screen.height + ',width=' + screen.width);
                        }
                        setTimeout(function () {
                            WindowObject.focus();
                            WindowObject.print();
                        }, 2000);
                    } else {
                        if (window.location.hostname == "soandes.loc" || window.location.hostname == "192.168.1.53" || window.location.hostname == "army.gruponw.com" || window.location.hostname == "soandes.gruponw.com" || window.location.hostname == "armyweb.soandes.co") {
                            console.log("Skinner guardado correctamente.");
                        } else {
                            qxnw.utils.information("Skinner guardado correctamente.");
                        }
                    }
                };
                rpc.exec("savePrintSkinner", data, func);
            }, time + 500);
        },
        notificationNormal: function notificationNormal(theBody, theIcon, theTitle, array, sonido, rutaSonido, timeRemove) {
            if (typeof timeRemove == "undefined") {
                timeRemove = 5000;
            }
            if (timeRemove == false) {
                timeRemove = 5000;
            }
            Notification.requestPermission().then(function (result) {
                if (result == "granted") {
                    var options = {
                        body: theBody,
                        icon: theIcon,
                        requireInteraction: false,
                        silent: false,
                        vibrate: true,
                        tag: theBody,
                        dir: 'ltr'
                    };
                    var n = new Notification(theTitle, options);
                    setTimeout(n.close.bind(n), timeRemove);
                    if (sonido != false) {
                        if (typeof rutaSonido != "undefined") {
                            var sound = new qx.bom.media.Audio(rutaSonido);
                        } else {
                            var sound = new qx.bom.media.Audio("/nwlib6/audio/household020.mp3");
                        }
                        sound.play();
                    }
                    n.onclick = function (event) {
                        window.focus();
                        n.close.bind(n);
                        if (typeof array != "undefined") {
                            if (array != false && array != null) {
                                if (typeof array.callBack != "undefined") {
                                    array.callBack();
                                    return;
                                }
                            }
                        }
                    };
                }
            });
        },
        /*
         * Función para mostrar una imagen en una ventana rápida 
         * @param path {string} el path de la imagen 
         * @returns {void}
         */
        showImageViewer: function showImageViewer(path) {
            var container = new qxnw.widgets.imageViewer();
            var f = new qxnw.forms();
            f.masterContainer.add(container, {
                flex: 1
            });
            container.setValue(path);
            f.show();
        },
        /**
         * <NOT READY FOR PRODUCTION> Try to handle the show property of {@link qxnw.forms}
         * @return {void}
         */
        showWindow: function showWindow() {
            if (this.isUseBlocker()) {
                var root = this.window.getApplicationRoot();
                root.setBlockerOpacity(this.window.getBlockerOpacity());
                root.setBlockerColor(this.window.getBlockerColor());
                var zIndex = this.window.getZIndex();
                this.window.setZIndex(zIndex + 1);
                new qx.util.DeferredCall(function () {
                    root.blockContent(zIndex);
                }).schedule();
            }
            this.window.__previousFocus = qx.ui.core.FocusHandler.getInstance().getActiveWidget();
            this.window.open();
        },
        /**
         * Returns the callback set
         * @return {Function} the callback
         */
        getCallBack: function getCallBack() {
            return this.callback;
        },
        /**
         * Reset the callback (if any)
         * @return {void}
         */
        resetCallBack: function resetCallBack() {
            this.callBack = null;
        },
        /**
         * Handle the hide property of all class
         * @return {void}
         */
        hide: function hide() {
            this.window.setVisibility("hidden");
            if (this.window.isUseBlocker()) {
                this.window.getApplicationRoot().unblockContent();
            }

            if (this.window.__previousFocus) {
                try {
                    this.window.__previousFocus.focus();
                } catch (e) {

                }
            }
            this.window.close();
            this.window.destroy();
        },
        hiddenError: function hiddenError(e) {
            qxnw.utils.bindError(e, this, 0, true, false);
        },
        /**
         * Handles the process when the user press "Ok" in any part of this class and fire events. Then, reset the callback set.
         * @param param {object} el parámetro de la función
         * @param p_callback {object} el callback a llamar si se tiene
         * @return {void}
         */
        handleOk: function handleOk(param, p_callback) {
            var self = this;
            if (typeof this.window != 'undefined') {
                this.window.fireEvent("ok");
            }
            if (typeof p_callback != 'undefined' && p_callback != null) {
                if (typeof p_callback == "function") {
                    p_callback(true, param);
                }
            } else {
                if (typeof self.callBack != 'undefined' && self.callBack != null && typeof self.callBack != 'number') {
                    if (typeof self.callBack == "function") {
                        self.callBack(true, param);
                    }
                }
            }
            this.resetCallBack();
        },
        /**
         * Handle the process when the user press "Cancel" in any part of this class. Then, reset the callback set.
         * @param param {object} el parámetro de la función
         * @return {void}
         */
        handleCancel: function handleCancel(param) {
            var self = this;
            this.window.fireEvent("cancel");
            if (self.callBack != null) {
                self.callBack(false, param);
            }
            this.resetCallBack();
        },
        strip_tags: function strip_tags(str) {
            console.log("entra");
            str = str.toString();
            return str.replace(/<\/?[^>]+>/gi, '');
        }
    },
    members: {
        baseLayout: null,
        /*
         * The callback
         */
        callback: null,
        /*
         * The window
         */
        window: null,
        /*
         * The loading object
         */
        __loading: null
    }

});
