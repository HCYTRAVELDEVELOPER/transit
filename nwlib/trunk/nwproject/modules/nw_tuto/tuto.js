/* 
 Created on : Jan 31, 2018, 12:14:41 AM
 Author     : alexf
 */
__documentNwTuto = document.body;
__onClicNwTuto = false;
__nwTutoID = false;
__nwTutoActionButtons = false;
__nwTutoCreateAdmin = false;
__nwTutoLoadInit = false;
__nwTutoSelf = false;
__nwTutoDebug = true;
function nwTuto() {
    var self = this;
    __nwTutoSelf = self;
    var protocol = "https:";
    var p = document.querySelector("#nwTutoMaker").getAttribute("src");
    if (p.indexOf("https") == -1) {
        protocol = "http:";
    }
    var h = p.split(protocol);
    var hh = h[1].split("//");
    var hhh = hh[1].split("/");
    var dom = hhh[0];
    self.start = start;
    self.loadTuto = loadTuto;
    self.init = init;
    self.ubicaPoint = ubicaPoint;
    self.array = Array();
    self.domain = dom;
    self.protocol = protocol;
    self.url = self.protocol + "//" + self.domain;
    self.totalSteps = 0;
    self.step = 0;
    self.get = getGETPage();
    self.cleanAll = cleanAll;
    self.changeContainer = changeContainer;
    self.startFromFrame = startFromFrame;
    self.hpantallas = [];
    self.panAnterior = {};
    self.getStep = getStep;
    self.createAnim = createAnim;
    self.alistaEventsNextPrev = alistaEventsNextPrev;
    self.GetTopLeft = GetTopLeft;
    self.createResaltador = createResaltador;
    self.hiddenResaltador = hiddenResaltador;
    self.createElementFromHTML = createElementFromHTML;
    self.generateDiv = generateDiv;
    self.scrollTo = scrollTo;
    self.scrollPageTuto = scrollPageTuto;

    if (typeof self.get.playTutoCons !== "undefined") {
        changeContainer(document.body);
        var r = JSON.parse(localStorage["itemsNwTuto"]);
        init(r);
    }

    function startFromFrame(doc) {
        var self = __nwTutoSelf;
        var get = self.get;
        var start = true;
        if (localStorage["nwTutoFin_" + self.domain + __nwTutoID] === "SI") {
            start = false;
        }
        if (typeof get.nwtutoediting !== "undefined" || typeof get.playTutoCons !== "undefined") {
            start = true;
        }
        if (typeof get.previewPlayNwTuto !== "undefined") {
            start = true;
        }
        if (__onClicNwTuto === true) {
            start = true;
        }
        if (start === false) {
            return;
        }
        if (typeof doc != "undefined" && evalueData(doc) === true) {
            changeContainer(doc);
        } else {
            changeContainer(document.body);
        }
        var frame = document.querySelector('#iframeNwTutoMoonIframe');
        var s = {};
        s.func = "loaddata";
        s.id = __nwTutoID;
        s.adm = __nwTutoCreateAdmin;
        frame.contentWindow.postMessage(s, '*');
    }

    function start(tuto, doc, onClick) {
        var self = __nwTutoSelf;
        var get = self.get;
        console.log("self.get", self.get);
//        if (typeof self.get.document === "undefined") {
        if (typeof self.get.nwtutoediting !== "undefined") {
            createAdmin();
        }
//        }
        __onClicNwTuto = false;
        if (onClick === true) {
            __onClicNwTuto = true;
        }
        if (typeof doc != "undefined" && evalueData(doc) === true) {
            changeContainer(doc);
        } else {
            changeContainer(document.body);
        }
        __nwTutoID = tuto;
        if (typeof localStorage["nwTutoFin_" + self.domain + __nwTutoID] === "undefined") {
            localStorage["nwTutoFin_" + self.domain + __nwTutoID] = "NO";
        }
        if (typeof doc !== "undefined" && evalueData(doc) === true) {
            startFromFrame(doc);
        } else {
            startFromFrame();
        }
    }
    function init(r) {
        var self = __nwTutoSelf;
        if (r) {
            setTimeout(function () {
                self.createAnim(r);
                self.alistaEventsNextPrev(r);
            }, 500);
        }
    }
    function createAnim(r) {
        var self = __nwTutoSelf;
        self.array = r;
        self.totalSteps = r.length;
        var d = r[0];
        d.indexArray = 0;
        ubicaPoint(d);
        addOrRest("init");
        __nwTutoLoadInit = true;
    }
    function alistaEventsNextPrev() {
        if (__nwTutoActionButtons === true) {
            return;
        }
        document.querySelector(".tuto-next").addEventListener("mousedown", function () {
            self.getStep("next");
        });
        document.querySelector(".tuto-prev").addEventListener("mousedown", function () {
            self.getStep("prev");
        });
        document.querySelector(".tuto-info-omitir").addEventListener("mousedown", function () {
            cleanAll();
            localStorage["nwTutoFin_" + self.domain + __nwTutoID] = "SI";
        });
        document.querySelector(".tuto-end").addEventListener("mousedown", function () {
            cleanAll();
            localStorage["nwTutoFin_" + self.domain + __nwTutoID] = "SI";
        });
        __nwTutoActionButtons = true;
    }
    function getStep(mode) {
        var self = __nwTutoSelf;
        var r = self.array;
        var p = document.querySelector(".tuto-pointOnMap");
        var t = p.getAttribute("item-indexArray");
        var ta = false;
        if (mode == "next") {
            addOrRest("add");
            ta = parseInt(t) + 1;
        } else
        if (mode == "prev") {
            addOrRest("rest");
            ta = parseInt(t) - 1;
        } else {
            return;
        }
        var d = r[ta];
        d.indexArray = ta;
        ubicaPoint(d);
    }
    function loadTuto() {
        var self = __nwTutoSelf;
        var protocol = self.protocol;
        var host = self.domain;
        var domain = protocol + "//" + host;
        var li = "/nwlib6/nwproject/modules/nw_tuto/srv/in.php";
        var url = domain + li;
        var send = "";
        var href = location.href;
        href = href.replace(/#/gi, "(nwhashtag)");
        href = href.replace(/&/gi, "(nwampersan)");
        send += "origin=" + location.origin;
        send += "&href=" + href;
        send += "&protocol=" + protocol;
        var div = document.createElement('div');
        div.id = 'iframeNwTutoMoon';
        div.style.display = 'none';
        send = send.replace(/#/gi, "");
        var urlEnd = url + "?" + send;
        urlEnd = encodeURI(urlEnd);
        div.innerHTML = '<iframe id="iframeNwTutoMoonIframe" src="' + urlEnd + '"></iframe>';
        document.body.appendChild(div);

        generatePointFly();
    }

    function generatePointFly() {
        var styles = self.url + "/nwlib6/nwproject/modules/nw_tuto/css/tuto.css";
        var newSS = document.createElement('link');
        newSS.rel = 'stylesheet';
        newSS.type = 'text/css';
        newSS.href = styles;
        document.getElementsByTagName("head")[0].appendChild(newSS);
        createPoint();
    }

    function createPoint() {
        var p = document.createElement("span");
        p.className = "tuto-pointOnMap";
        p.draggable = "true";
        var html = "";
        html += "<span class='tuto-point-indiq tuto-point-indiq-l'></span>";
        html += "<span class='tuto-point-indiq tuto-point-indiq-r'></span>";
        html += "<span class='tuto-point-indiq tuto-point-indiq-y1'></span>";
        html += "<span class='tuto-point-indiq tuto-point-indiq-y2'></span>";
        html += "<span class='tuto-point-title'></span>";
        html += "<span class='tuto-point-text'></span>";
        html += "<span class='tuto-contain-btns'>";
        html += "<span class='btn-tutoInt'>";
        html += "<span class='btn-tuto tuto-prev'>Atrás</span>";
        html += "</span>";
        html += "<span class='btn-tutoInt'>";
        html += "<span class='btn-tuto tuto-next'>Siguiente</span>";
        html += "</span>";
        html += "<span class='btn-tutoInt'>";
        html += "<span class='btn-tuto tuto-end'>Finalizar</span>";
        html += "</span>";
        html += "<span class='tuto-separator-text'>";
        html += "<span class='tuto-info-btn tuto-info-text'>Dale clic para continuar</span>";
        html += "<span class='tuto-info-btn tuto-info-omitir'>Omitir</span>";
        html += "</span>";
        html += "</span>";
        p.innerHTML = html;
        document.body.appendChild(p);
    }

    function createElementFromHTML(htmlString) {
        if (typeof htmlString === "undefined" || htmlString === false || htmlString === null) {
            return false;
        }
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    function ubicaPoint(a) {
        var item = a.item;
        var description = a.description;
        var indexArray = a.indexArray;
        var title = a.title;
        var position = a.position;
        var next_on_clic = a.next_on_clic;
        var object = a.object;
        var idAndClassBySameGroup = a.idAndClassBySameGroup;
        var isAdm = a.isAdmin;
        var itemBySameGroup = a.itemBySameGroup;
        if (evalueData(idAndClassBySameGroup) === false) {
            idAndClassBySameGroup = "div";
        }

        var self = __nwTutoSelf;
        var b = document.body;
        var p = document.querySelector(".tuto-pointOnMap");
        var lp = document.querySelector(".tuto-point-indiq-l");
        var rp = document.querySelector(".tuto-point-indiq-r");
        var y1 = document.querySelector(".tuto-point-indiq-y1");
        var y2 = document.querySelector(".tuto-point-indiq-y2");
        if (p) {
            p.style.display = "block";
        }
//    var di = document.querySelectorAll("div").item(item);
        if (typeof object !== "undefined" && object !== false && object !== null) {
            object = object.replace(/"/gi, "'");
        }
        var el = __documentNwTuto;
        var divs = el.querySelectorAll(idAndClassBySameGroup);

        var di = false;
        if (isAdm === true) {
            var divs = el.querySelectorAll("div");
            di = divs[item];
        }
        /*
         else
         if (idAndClassBySameGroup === "div" || itemBySameGroup !== 0 && evalueData(itemBySameGroup) === false) {
         var t = divs.length;
         for (var i = 0; i < t; i++) {
         var dia = divs[i];
         var obf = dia.outerHTML;
         obf = obf.replace(/"/gi, "'");
         var obHTML1 = self.generateDiv(self.createElementFromHTML(obf));
         if (obHTML1 === object) {
         di = dia;
         break;
         } else {
         continue;
         }
         }
         } 
         */
        else {
            di = divs[itemBySameGroup];
        }
        if (di === false) {
            di = divs[item];
        }
        if (typeof di === "undefined") {
            return;
        }
        var inf = document.querySelector(".tuto-info-text");
        if (inf) {
            inf.style.display = "none";
            if (next_on_clic === "SI" || next_on_clic === true) {
                inf.style.display = "block";
                document.querySelector(".tuto-next").style.display = "none";
                di.addEventListener("mousedown", function () {
                    setTimeout(function () {
                        getStep("next");
                    }, 2000);
                });
            }
        }
        var tt = GetTopLeft(di);
        var w = di.offsetWidth;
        var h = di.offsetHeight;
//        var wbody = b.offsetWidth;
//        var hbody = b.offsetHeight;
//        var hwindow = b.clientHeight;
//        var wwindow = b.clientWidth;
        var leftInit = tt.left;
        var left = tt.left;
        var top = tt.top;
        createResaltador(di);
//    var left = di.offsetLeft;
//    var top = di.offsetTop;
//    var left = di.clientLeft;
//    var top = di.clientTop;
        if (evalueData(position) === false) {
            position = "absolute";
        }
        left = left + w;
        var wWind = window.innerWidth;
        var hWind = window.innerHeight;
        var pa = document.querySelector(".tuto-point-text");
        var hpant = 0;
        self.hpantallas = [];
        for (var x = 0; x < 100; x++) {
//            if (hpant > hbody) {
            if (hpant > hWind) {
//                break;
            }
            self.hpantallas[x] = {};
            self.hpantallas[x]["alto_init"] = hpant;
//            self.hpantallas[x]["alto_end"] = hpant + hwindow;
            self.hpantallas[x]["alto_end"] = hpant + hWind;

//            hpant = hpant + hwindow;
            hpant = hpant + hWind;
        }
        var pantBefore = self.panAnterior.index;
        for (var x = 0; x < self.hpantallas.length; x++) {
            var pan = self.hpantallas[x];
            if (top >= pan.alto_init && top <= pan.alto_end) {
                self.panAnterior = pan;
                self.panAnterior.index = x;
                break;
            }
        }
        var pantActual = self.panAnterior;

        var posX = "";
        var posY = "";
        var wPoint = p.offsetWidth;
//        var m = wbody / 2;
        var m = wWind / 2;
        var s = w + leftInit;
//        var pdu = wbody - w;
        var pdu = wWind - w;
        var sobrepasaancho = false;
        if (s >= m) {
            if (w >= wWind) {
//            if (w >= wbody) {
                p.style.left = "0px";
                sobrepasaancho = true;
            } else
//            if (w >= m && pdu < wPoint) {
            if (w >= m) {
                p.style.left = "0px";
                sobrepasaancho = true;
            } else {
                p.style.left = leftInit - wPoint - 50 + "px";
            }
            posX = "derecha";
            displayIndicator(rp);
        } else {
            p.style.left = left + "px";
            posX = "izquierda";
            displayIndicator(lp);
        }

        var hPoint = p.offsetHeight;
        var m = pantActual.alto_end / 2;
        var s = h + top;
        if (s > m + m / 2 + 50 && top >= 60) {
            posY = "abajo";
            p.style.top = top - hPoint + 25 + "px";
        } else {
            posY = "arriba";
            if (sobrepasaancho) {
                p.style.top = top + h + "px";
            } else {
                p.style.top = top + "px";
            }
        }
        var posEnd = posX + posY;
        if (posEnd === "derechaabajo") {
            displayIndicator(y1);
        } else
        if (posEnd === "izquierdaabajo") {
            displayIndicator(y2);
        }

        p.style.display = "block";
        p.style.position = position;
        p.setAttribute("item-actual", item);
        p.setAttribute("item-indexArray", indexArray);
        p.setAttribute("item-title", title);
        if (pa) {
            pa.innerHTML = "<div class='tuto-box-title'>" + title + "</div>" + description;
        }

        if (pantBefore !== pantActual.index) {
//            self.scrollPageTuto(p);
            self.scrollTo(document.querySelector("html, body"), pantActual.alto_init, 500);
        }
    }

    function scrollTo(element, to, duration) {
        if (duration <= 0)
            return;
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 10;
        setTimeout(function () {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop == to)
                return;
            scrollTo(element, to, duration - 10);
        }, 10);
    }

    function scrollPageTuto(element) {
        var tt = GetTopLeft(element);
        var top = tt.top;
        document.body.scrollTop = top - 200;
    }

    function cleanText(t) {
        if (evalueData(t) === false) {
            return false;
        }
        var text = t;
        text = text.replace(/\ /g, "_");
        text = text.replace(/\ /gi, "_");
        text = text.replace(/  /gi, "_");
        text = text.replace(/_/gi, "");
        return text;
    }

    function displayIndicator(obj) {
        var ind = document.querySelectorAll(".tuto-point-indiq ");
        for (var i = 0; i < ind.length; i++) {
            var a = ind[i];
            a.style.display = "none";
        }
        obj.style.display = "block";
    }

    function GetOffset(object, offset) {
        if (!object)
            return;
        offset.x += object.offsetLeft;
        offset.y += object.offsetTop;

        GetOffset(object.offsetParent, offset);
    }
    function GetScrolled(object, scrolled) {
        if (!object)
            return;
        scrolled.x += object.scrollLeft;
        scrolled.y += object.scrollTop;

        if (object.tagName.toLowerCase() != "html") {
            GetScrolled(object.parentNode, scrolled);
        }
    }
    function GetTopLeft(id) {
        var div = id;
        var offset = {x: 0, y: 0};
        GetOffset(div, offset);
        var scrolled = {x: 0, y: 0};
        if (typeof div !== "undefined") {
            GetScrolled(div.parentNode, scrolled);
        }
        var posX = offset.x - scrolled.x;
//        var posY = offset.y - scrolled.y;
//    var posX = offset.x;
        var posY = offset.y;
        var r = {};
        r.top = posY;
        r.left = posX;
        return r;
    }

    function createAdmin() {
        if (__nwTutoCreateAdmin === true) {
            var nwt = new nwTutoAdmin(self);
            nwt.creatorConsole();
            return;
        }
        var js = document.createElement('script');
        js.type = 'text/javascript';
        js.charset = 'UTF-8';
        js.src = self.url + '/nwlib6/nwproject/modules/nw_tuto/js/admin.js';
        js.id = 'nwTutoMakerAdmin';
        js.async = true;
        document.body.appendChild(js);
        js.onload = function () {
            var nwt = new nwTutoAdmin(self);
            nwt.createAdmin();
        };
        __nwTutoCreateAdmin = true;
    }
    function evalueData(d) {
        if (typeof d == "undefined") {
            return false;
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
        if (d == false) {
            return false;
        }
        if (d == "") {
            return false;
        }
        return true;
    }
    function getGETPage() {
        var loc = document.location.href;
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
    }
    function addOrRest(m) {
        var self = __nwTutoSelf;
        var t = self.totalSteps;
        var end = document.querySelector(".tuto-end");
        var next = document.querySelector(".tuto-next");
        var prev = document.querySelector(".tuto-prev");
        end.style.display = "none";
        next.style.display = "none";
        prev.style.display = "none";
        if (t === 1) {
            end.style.display = "block";
            return;
        }
        if (m === "add" || m === "init") {
            self.step++;
        } else {
            self.step--;
        }
        if (self.step >= t) {
            self.step = t;
            prev.style.display = "block";
            end.style.display = "block";
            next.style.display = "none";
            return false;
        }
        next.style.display = "block";
        if (self.step > 1)
            prev.style.display = "block";
        if (self.step <= 1)
            prev.style.display = "none";
    }
    function cleanAll() {
        var self = __nwTutoSelf;
        self.step = 1;
        var b = document.querySelectorAll(".bgOpacityBlackNwtuto");
        for (var i = 0; i < b.length; i++) {
            var a = b[i];
            a.style.display = "none";
        }
        var p = document.querySelector(".tuto-pointOnMap");
        if (p) {
            p.style.display = "none";
        }
        var resal = document.querySelector(".tuto-admin-resalta-object");
        if (resal) {
            resal.style.display = "none";
        }
        if (typeof funcExternForNwTuto !== "undefined") {
            funcExternForNwTuto();
        }
    }
    function changeContainer(object) {
        __documentNwTuto = object;
    }
    function createResaltador(ob) {
        var s = self.objectSelected;
        if (typeof ob != "undefined") {
            s = ob;
        }
        var tt = GetTopLeft(s);
        var w = s.offsetWidth;
        var h = s.offsetHeight;
        var left = tt.left;
        var top = tt.top;
        var resal = document.querySelector(".tuto-admin-resalta-object");
        if (!resal) {
            resal = document.createElement("span");
            resal.className = "tuto-admin-resalta-object tuto-admin-resalta-object-play";
            document.body.appendChild(resal);
        }
        resal.style.width = w + "px";
        resal.style.height = h + "px";
        resal.style.left = left + "px";
        resal.style.top = top + "px";
        resal.style.display = "block";
    }
    function hiddenResaltador() {
        var resal = document.querySelector(".tuto-admin-resalta-object");
        if (!resal)
            return false;
        resal.style.display = "none";
    }
    function generateDiv(div) {
        if (typeof div === "undefined" || div === null || div === false) {
            return false;
        }
        var nodes = [], values = [];
        for (var att, i = 0, atts = div.attributes, n = atts.length; i < n; i++) {
            att = atts[i];
            nodes.push(att.nodeName);
            values.push(att.nodeValue);
        }
        var attrs = "";
        for (var i = 0; i < nodes.length; i++) {
            var bb = nodes[i];
            var b1 = values[i];
            attrs += bb + "='" + b1 + "'";
            if (i + 1 != nodes.length)
                attrs += " ";
        }
        var nd = "<div " + attrs + "></div>";
        return nd;
    }
}

window.addEventListener('message', function (e) {
    var pr = e.data;
    if (__nwTutoDebug === true) {
        console.log(pr);
    }
    if (pr === false) {
        var s = document.querySelector(".tuto-box-enc");
        if (s) {
            s.remove();
            document.querySelector("#nwTutoMakerAdmin").remove();
        }
        return;
    }
    if (typeof pr.typenw !== "undefined") {
        if (pr.typenw === "nwtutoLoaded") {
            var d = new nwTuto();
            d.startFromFrame();
            return;
        } else
        if (pr.typenw === "nwtutosok") {
            alert("Guardado correctamente");
            return;
        } else
        if (typeof pr.rows == "string") {
            pr.rows = JSON.parse(pr.rows);
        }
        var d = new nwTuto();
        var get = d.get;
        if (typeof get.nwtutoediting !== "undefined") {
            if (document.querySelector(".numberNwTutoEnc")) {
                document.querySelector(".numberNwTutoEnc").innerHTML = __nwTutoID;
                if (typeof pr.enc !== "undefined") {
                    document.querySelector(".nameNwTutoEnc").innerHTML = pr.enc.nombre;
                }
            }
            if (typeof pr.rows !== "undefined") {
                localStorage["itemsNwTuto"] = JSON.stringify(pr.rows);
                var nwt = new nwTutoAdmin(d);
                nwt.createItemsList(pr.rows);
            } else {
                localStorage["itemsNwTuto"] = "";
                delete localStorage["itemsNwTuto"];
            }
            if (document.querySelector(".tuto-box-enc"))
                document.querySelector(".tuto-box-enc").style.display = "block";
        } else {
            d.init(pr.rows);
        }
    }
}, false);