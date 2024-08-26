/* 
 * Licence Grupo Nw - creator: alexf 2018-02-01
 */
objectNwTutoEditing = false;
objectNwTutoEditingOrden_one = false;
objectNwTutoEditingOrden_two = false;
function nwTutoAdmin(padre) {
    var self = this;
    self.get = padre.get;
    self.url = padre.url;
    var get = self.get;
    self.createAdmin = createAdmin;
    self.creatorConsole = creatorConsole;
    self.mouseX = 0;
    self.mouseY = 0;
    self.itemsNwTuto = [];
    self.objectSelected = null;
    self.createItemsList = createItemsList;
    issel = false;
    if (typeof localStorage["itemsNwTuto"] === "undefined") {
        localStorage["itemsNwTuto"] = "";
    } else {
        if (localStorage["itemsNwTuto"] != "") {
            self.itemsNwTuto = JSON.parse(localStorage["itemsNwTuto"]);
        }
    }

    function createAdmin() {
        var styles = self.url + "/nwlib6/nwproject/modules/nw_tuto/css/admin.css";
        var newSS = document.createElement('link');
        newSS.rel = 'stylesheet';
        newSS.type = 'text/css';
        newSS.href = styles;
        document.getElementsByTagName("head")[0].appendChild(newSS);
        window.onmousemove = function () {
            var x = window.event.clientX;
            var y = window.event.clientY;
            self.mouseX = x;
            self.mouseY = y;
        };
        creatorConsole();
    }
    function creatorConsole() {
        var get = self.get;
        if (typeof get.nwtutoediting !== "undefined") {
            issel = false;
            createMenuEdit();
            alistaEvents();
        }
    }
    function createMenuEdit() {
        var as = document.querySelectorAll(".tuto-box-enc");
        for (var i = 0; i < as.length; i++) {
            as[i].remove();
        }
        var html = "";
        html += "<span class='btn-tuto tuto-items-num-enc'>(<span class='numberNwTutoEnc'></span>) <span class='nameNwTutoEnc'></span></span>";
        html += "<span class='btn-tuto tuto-items-admin'>Elementos</span>";
        html += "<span class='tuto-items-admin-container'></span>";
        html += "<span class='btn-tuto tuto-init'>Seleccionar elemento</span>";
        html += "<span class='btn-tuto tuto-sel-play'>Play</span>";
        html += "<span class='btn-tuto tuto-sel-save'>Guardar</span>";
        html += "<span class='tuto-index-selected'>";
        html += "<span class='tuto-text-index-sel'></span>";
        html += "<span class='tuto-admin-enc-maximice'>+</span>";
        html += "<span class='tuto-admin-enc-minimice'>-</span>";
        html += "<span class='tuto-admin-enc-close'>x</span>";
        html += "</span>";

        var d = document.createElement("span");
        d.className = "tuto-box-enc";
        d.draggable = "true"
        d.innerHTML = html;
        document.body.appendChild(d);
        console.log("SI");

        var res = document.querySelector(".uto-admin-resalta-object");
        if (!res) {
            var da = document.createElement("span");
            da.className = "tuto-admin-resalta-object";
            document.body.appendChild(da);
        }
        document.querySelector(".tuto-admin-enc-close").addEventListener("click", function () {
            d.remove();
        });
        document.querySelector(".tuto-admin-enc-minimice").addEventListener("click", function () {
            tutoAddClass(d, "nwtuto-enc-min");
            document.querySelector(".tuto-admin-enc-maximice").style.display = "block";
            document.querySelector(".tuto-admin-enc-minimice").style.display = "none";
        });
        document.querySelector(".tuto-admin-enc-maximice").addEventListener("click", function () {
            tutoRemoveClass(d, "nwtuto-enc-min", true);
            document.querySelector(".tuto-admin-enc-minimice").style.display = "block";
            document.querySelector(".tuto-admin-enc-maximice").style.display = "none";
        });

//        d.onmousemove = function () {
//                   console.log(self.mouseX);
//            console.log(self.mouseY);
//        };
//        d.addEventListener('mousedown', function () {
//            console.log(self.mouseX);
//            console.log(self.mouseY);
//        });
//        d.addEventListener('drag', handleDragStart, false);
//        function handleDragStart(e) {
//            console.log(self.mouseX);
//            console.log(self.mouseY);
//        }
        createItemsList();

        var s = "";
        s += "<input type='hidden' name='item' class='tutoformhidden tutoform-item' />";
        s += "<input type='hidden' name='itemBySameGroup' class='tutoformhidden tutoform-itemBySameGroup' />";
        s += "<input type='hidden' name='idAndClassBySameGroup' class='tutoformhidden tutoform-idAndClassBySameGroup' />";
        s += "<textarea style='display:none;'  name='object' class='nwtuto-admin-object' ></textarea>";
        s += "<span class='inptformendt'>";
        s += "<label>Título</label>";
        s += "<input type='text' name='title' />";
        s += "</span>";
        s += "<span class='inptformendt'>";
        s += "<label>Descripción</label>";
        s += "<textarea  name='description' ></textarea>";
        s += "</span>";
        s += "<span class='btnformendt'>";
        s += "<input type='button' value='Cancelar' class='cancelFormNwt' />";
        s += "<input type='button' value='Aceptar'  class='saveFormNwt' />";
        s += "</span>";

        var xx = document.createElement("form");
        xx.innerHTML = s;
        xx.className = "formNwTutos";
        xx.id = "formNwTutos";
        if (document.querySelector(".formNwTutos")) {
            document.querySelector(".formNwTutos").remove();
        }
        document.querySelector(".tuto-pointOnMap").appendChild(xx);

        visPointData("none");

        document.querySelector(".cancelFormNwt").addEventListener("click", function () {
            var s = self.objectSelected;
            if (typeof s == "undefined" || s == null) {
                cleanonClicAll();
                return;
            }
            padre.cleanAll();
            cleanForm();
        });
        document.querySelector(".saveFormNwt").addEventListener("click", function () {
            var s = self.objectSelected;
            if (typeof s === "undefined" || s === null && objectNwTutoEditing == false) {
                cleanonClicAll();
                return;
            }
            var data = serializeForm(document.querySelector(".formNwTutos"));
            if (typeof objectNwTutoEditing.data !== "undefined") {
                var gh = objectNwTutoEditing.data;
                console.log(gh);
                gh.title = data.title;
                gh.description = data.description;
                self.itemsNwTuto[gh.indx] = gh;
            } else {
                self.itemsNwTuto.push(data);
            }
            localStorage["itemsNwTuto"] = JSON.stringify(self.itemsNwTuto);
            createItemsList();
            padre.cleanAll();
            cleanForm();
        });
        document.querySelector(".tuto-items-admin").addEventListener("click", function () {
            createItemsList();
        });
        document.querySelector(".tuto-sel-play").addEventListener("click", function () {
            padre.changeContainer(document.body);
            var r = JSON.parse(localStorage["itemsNwTuto"]);
            padre.init(r);
            document.querySelector(".formNwTutos").style.display = "none";
            visPointData("block");
        });
        document.querySelector(".tuto-sel-save").addEventListener("click", function () {
            var r = JSON.parse(localStorage["itemsNwTuto"]);
            var frame = document.querySelector('#iframeNwTutoMoonIframe');
            var s = {};
            s.detalle = r;
            s.id_enc = __nwTutoID;
            s.func = "savedata";
            frame.contentWindow.postMessage(s, '*');
        });
    }

    function cleanonClicAll() {
//        tutoRemoveClass("*", "tuto-selected");
        padre.cleanAll();
        cleanForm();
    }

    function visPointData(elm) {
        document.querySelector(".tuto-contain-btns").style.display = elm;
    }

    function cleanForm() {
        objectNwTutoEditing = false;
    }

    function createItemsList(items) {
        var j = self.itemsNwTuto;
        if (self.itemsNwTuto.length <= 0) {
            return;
        }
        if (typeof items != "undefined") {
            j = items;
        }
        var con = document.querySelector(".tuto-items-admin-container");
        con.innerHTML = "";
        for (var i = 0; i < j.length; i++) {
            var k = j[i];
            k.indx = i;
            var num = Math.floor((Math.random() * 10000) + 1);
            var c = "tuto-removed-" + num;
            var ca = "tuto-edited-row-" + num;
            var co = "tuto-ordened-row-" + num;
            var cg = "tuto-changed-row-" + num;
            var ht = "";
            ht += "<span class='tu-item'>";
            ht += "ITEM: " + k.item;
            ht += "</span>";
            ht += "<span class='tu-title'>";
            ht += "Title: " + k.title;
            ht += "</span>";
            ht += "<span class='tu-desc'>";
            ht += "Description: " + k.description;
            ht += "</span>";
            ht += "<span class='tu-remove " + c + "' indx='" + i + "' >x</span>";
            ht += "<span class='tu-ordened " + co + "' indx='" + i + "' >Ordenar</span>";
            ht += "<span class='tu-changed " + cg + "' indx='" + i + "' >Cambiar</span>";
            ht += "<span class='tu-edited " + ca + "' indx='" + i + "' >Editar</span>";
            var cl = "contain-item-in-list-" + i;
            var s = document.createElement("span");
            s.innerHTML = ht;
            s.className = "contain-item-in-list " + cl;
            s.data = k;
            con.appendChild(s);

            document.querySelector("." + ca).data = k;
            document.querySelector("." + co).data = k;
            document.querySelector("." + cg).data = k;

            document.querySelector("." + c).addEventListener("mousedown", function () {
                var indx = this.getAttribute("indx");
                var a = document.querySelector(".contain-item-in-list-" + indx);
                a.remove();
                var s = self.itemsNwTuto;
                var m = 0;
                var nw = [];
                for (var x = 0; x < s.length; x++) {
                    var sa = s[x];
                    if (x !== parseInt(indx)) {
                        nw[m] = sa;
                        m++;
                    }
                }
                self.itemsNwTuto = nw;
                localStorage["itemsNwTuto"] = JSON.stringify(self.itemsNwTuto);
                createItemsList();
            });
            document.querySelector("." + ca).addEventListener("mousedown", function () {
                var d = this.data;
                d.isAdmin = false;
                objectNwTutoEditing = this;
                padre.ubicaPoint(d);
            });
            document.querySelector("." + co).addEventListener("mousedown", function () {
                var d = this.data;
                objectNwTutoEditingOrden_one = this;
                var da = document.querySelectorAll(".tu-changed");
                for (var i = 0; i < da.length; i++) {
                    da[i].style.display = "block";
                }
            });
            document.querySelector("." + cg).addEventListener("mousedown", function () {
                var d = this.data;
                objectNwTutoEditingOrden_two = this;

                var g = objectNwTutoEditingOrden_one.data;
                var gh = objectNwTutoEditingOrden_two.data;
                self.itemsNwTuto[g.indx] = gh;
                self.itemsNwTuto[gh.indx] = g;
                localStorage["itemsNwTuto"] = JSON.stringify(self.itemsNwTuto);
                createItemsList();

                var da = document.querySelectorAll(".tu-changed");
                for (var i = 0; i < da.length; i++) {
                    da[i].style.display = "none";
                }

            });
        }
    }

    function alistaEvents() {
        document.querySelector(".tuto-init").addEventListener("click", function () {
            issel = true;
//            console.log("sda")
            alistaDocument();
        });
        document.body.addEventListener("mousedown", function () {
            if (issel === true) {
                issel = false;
            }
            setTimeout(function () {
                removeCapaInt();
            }, 3000);
        });
    }

    function removeCapaInt() {
        var na = document.querySelectorAll(".capaTutoInt");
        for (var i = 0; i < na.length; i++) {
            na[i].remove();
        }
    }
    function alistaDocument() {
        var f = document.querySelector(".formNwTutos");
        if (f) {
            f.style.display = "block";
        }
        visPointData("none");
        var el = __documentNwTuto;
        var divs = el.querySelectorAll("div");
        var t = divs.length;
        for (var i = 0; i < t; i++) {
            var d = divs[i];
            d.data = i;
            d.addEventListener("mouseenter", function () {
                var s = this;
                action(s);
            });
        }
    }
    function action(s) {
        if (issel === false) {
            return;
        }

        var nodes = [], values = [];
        for (var att, i = 0, atts = s.attributes, n = atts.length; i < n; i++) {
            att = atts[i];
            nodes.push(att.nodeName);
            values.push(att.nodeValue);
        }
        var nod = "div";
        if (nodes.length > 0) {
            if (nodes[0] == "id") {
                nod += "#" + values[0];
            }
            if (nodes[0] == "class") {
                nod += "." + values[0].replace(/\ /gi, ".");
            } else
            if (nodes[1] == "class") {
                nod += "." + values[1].replace(/\ /gi, ".");
            }
        }
        if (nod !== "div") {
            var divs = __documentNwTuto.querySelectorAll(nod);
            var tt = divs.length;
            for (var i = 0; i < tt; i++) {
                var d = divs[i];
                if (d === s) {
                    s.itemBySameGroup = i;
                    break;
                }
            }
        } else {
            s.itemBySameGroup = s.data;
        }

        self.objectSelected = s;
        var text = cortaText(get_content(s), 60);
        text = text.replace(/\ /g, "_");
        text = text.replace(/\ /gi, "_");
        text = text.replace(/  /gi, "_");
        text = text.replace(/_/gi, "");
        var cls = s.classList;
        var obHTML = s.outerHTML;
        var it = s.data;
        var itemBySameGroup = s.itemBySameGroup;
        var idAndClassBySameGroup = nod;
        padre.createResaltador(self.objectSelected);
        var di = document.querySelector(".tuto-text-index-sel");
        var ah = "";
        ah += "Item: <span class='item-sel-tuto'>" + it + "</span> Text: <span class='text-sel-tuto'>" + text + "</span> Classes: <span class='classes-sel-tuto'>" + cls + "</span>";
        ah += " itemBySameGroup: <span class='itemBySameGroup-sel-tuto'>" + itemBySameGroup + "</span>";
        ah += " idAndClassBySameGroup: <span class='idAndClassBySameGroup-sel-tuto'>" + idAndClassBySameGroup + "</span>";
        ah += " Object: <span class='object-sel-tuto' style='display:none;'>" + obHTML + "</span>";
        di.innerHTML = ah;
        if (s) {
            var pass = false;
            s.addEventListener("mousedown", function () {
                if (pass === true) {
                    return;
                }
                var self = this;
                var it = document.querySelector(".item-sel-tuto");
                if (!it) {
                    return;
                }
                padre.hiddenResaltador();
                removeCapaInt();
                var ne = document.createElement("div");
                ne.className = "capaTutoInt";
                self.appendChild(ne);
                var it = it.innerHTML;
                var d = {};
                d.item = it;
                d.description = "";
                d.indexArray = it;
                d.title = "";
                d.position = "absolute";
                d.indexArray = 0;
                d.isAdmin = true;
                padre.ubicaPoint(d);

                document.querySelector(".tutoform-item").value = it;

                var it = document.querySelector(".idAndClassBySameGroup-sel-tuto").innerHTML;
                document.querySelector(".tutoform-idAndClassBySameGroup").value = it;

                var it = document.querySelector(".itemBySameGroup-sel-tuto").innerHTML;
                document.querySelector(".tutoform-itemBySameGroup").value = it;

                var it = document.querySelector(".object-sel-tuto").innerHTML;
                var obf = it;
                obf = obf.replace('<div class="capaTutoInt"></div>', "");
                var obHTML = obf;
                var af = padre.createElementFromHTML(obf);
                obHTML = padre.generateDiv(af);
                document.querySelector(".nwtuto-admin-object").value = obHTML;

                pass = true;

                setTimeout(function () {
                    removeCapaInt();
                }, 2000);
            });
        }
    }
    function cortaText(text, numMax) {
        return text.slice(0, numMax);
    }
    function get_content(el) {
        var html = el.innerHTML;
        return html.replace(/<[^>]*>/g, "");
    }
    function tutoRemoveClass(el, cls, isWidget) {
        var di = null;
        if (isWidget === true) {
            di = el;
            di.classList.remove(cls);
        } else {
            di = document.querySelectorAll(el);
        }
        var t = di.length;
        for (var i = 0; i < t; i++) {
            var d = di[i];
            d.classList.remove(cls);
        }
    }
    function tutoAddClass(el, cls) {
        if (el.classList) {
            el.classList.add(cls);
        } else {
            var cur = ' ' + (el.getAttribute('class') || '') + ' ';
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                setClass(el, (cur + cls).trim());
            }
        }
    }

    HTMLElement.prototype.serialize = function () {
        var obj = {};
        var elements = this.querySelectorAll("input, select, textarea");
        for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            var name = element.name;
            var value = element.value;

            if (name) {
                obj[ name ] = value;
            }
        }
        return JSON.stringify(obj);
    };

    function serializeForm(form, evt) {
        var data = form.serialize();
        return JSON.parse(data);
    }
}
