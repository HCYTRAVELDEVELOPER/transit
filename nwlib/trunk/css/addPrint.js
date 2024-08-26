document.addEventListener("DOMContentLoaded", function () {
    var get = getGET();
    var boby = "";
    if (get) {
        boby = get.type.replace(/\ /gi, "_");
        boby = boby.replace(/á/gi, "a");
        boby = boby.replace(/é/gi, "e");
        boby = boby.replace(/í/gi, "i");
        boby = boby.replace(/ó/gi, "o");
        boby = boby.replace(/ú/gi, "u");
        boby = boby.replace(/ñ/gi, "n");
    }
    var body = document.querySelector("body");
    addClass(body, "containerBody_" + boby);

    var da = document.querySelectorAll(".nw_container_fields_form");
    for (var x = 0; x < da.length; x++) {
        var h = da[x];
        addClass(h, "contaFieldsIndex_" + x);
    }
    var da = document.querySelectorAll(".containerFields > div");
    for (var x = 0; x < da.length; x++) {
        var h = da[x];
        addClass(h, "isgruoupinitial");
        addClass(h, "qxuigroupboxGroupBox");

        var text = get_content(h);
        if (text === "") {
            addClass(h, "divEmptya");
        }
    }

    var d = document.querySelectorAll("div");
    for (var x = 0; x < d.length; x++) {
        var h = d[x];
        var text = get_content(h);
        if (text === "Seleccione") {
//            h.remove();
//            continue;
//            h.innerHTML = "NO REFIERE";
            h.innerHTML = "";
        }
        var ic = h.style.backgroundImage;
        if (ic === 'url("/resource/qx/icon/Tango/16/actions/view-restore.png")' || ic === 'url("/resource/qx/icon/Tango/16/apps/office-calendar.png")') {
            h.remove();
            continue;
        }
        if (ic === 'url("/resource/qx/decoration/Modern/form/checked.png")' || ic === 'url("qx/decoration/Modern/form/checked.png")') {
            addClass(h, "bloqueCheck");
        }
        var has = h.getAttribute("qxclass");
        var cl = h.getAttribute("class");
        if (cl != null) {
            var padre = h.parentNode;
            if (padre) {
                addClass(padre, cl.replace(/ /gi, "_") + "_padre");
                addClass(padre, cl.replace(/\ /gi, "_") + "_padre");
            }
        }
        if (has === "qx.ui.groupbox.GroupBox") {
            addClass(h, "isgruoupinitial");
        }
        if (typeof has !== "undefined") {
            if (has !== null && has !== "") {
                var cc = has.replace(/\./gi, "");
                cc = cc.replace(/\-/gi, "");
                if (cc.length > 0) {
                    addClass(h, cc);
                }
            }
        }
    }

    var f = document.querySelectorAll(".containerForm");
    for (var i = 0; i < f.length; i++) {
        var e = f[i];
        addClass(e, "containerForm_" + i);
        var g = document.querySelectorAll(".containerForm_" + i + " .qxuigroupboxGroupBox");
        for (var m = 0; m < g.length; m++) {
            var gr = g[m];
            addClass(gr, "qxuigroupboxGroupBox_" + m);
            var fa = document.querySelectorAll(".containerForm_" + i + " .qxuigroupboxGroupBox_" + m + " .qxuibasicAtom");
            if (fa !== null) {
                if (fa.length > 0) {
                    var x = fa[0];
                    addClass(x, "containTitleGroup");
                    var div = document.createElement("div");
                    div.className = "containTitleGroup_" + m;
                    div.innerHTML = x.innerHTML;
                }
            }
            var fa2 = document.querySelectorAll(".containerForm_" + i + " .qxuigroupboxGroupBox_" + m + " .qx-group");
            if (fa2 !== null) {
                if (fa2.length > 0) {
                    var xx = fa2[0];
                    addClass(xx, "nwContainFields");
                    var div2 = document.createElement("div");
                    div2.className = "nwContainFields nwContainFields_" + m;
                    div2.innerHTML = xx.innerHTML;
                }
            }
        }
    }
    normaliceInputs("textarea");
    normaliceInputs("input");

    setPadres();
    setPadres();
    setPadres();

    var da = document.querySelectorAll(".qx-group_padre");
    for (var x = 0; x < da.length; x++) {
        var h = da[x];
        addClass(h, "qx-group_padre_" + x);
    }

});

function setPadres() {
    var d = document.querySelectorAll("div");
    for (var x = 0; x < d.length; x++) {
        var h = d[x];
        var cl = h.getAttribute("class");
        if (cl !== null) {
            var padre = h.parentNode;
            if (padre) {
                var at = padre.getAttribute("class");
                var add = true;
                if (at) {
                    if (at.indexOf("_padre") !== -1) {
                        add = false;
                    }
                }
                if (add === true) {
                    addClass(padre, cl.replace(/ /gi, "_") + "_padre");
                    addClass(padre, cl.replace(/\ /gi, "_") + "_padre");
//                    addClass(padre, "divnono_" + x);
                }
            }
        }
    }
}

function normaliceInputs(type) {
    var g = document.querySelectorAll(type);
    for (var i = 0; i < g.length; i++) {
        var x = g[i];
        var attr = x.getAttribute("value");
        if (attr === null) {
            continue;
        }
        if (attr.length === 0) {
//            attr = "NO REFIERE";
            attr = "";
        }
        var txt = document.createTextNode(attr);
        x.appendChild(txt);
        var t = x.value;
        var classNoRefiere = "";
        if (t.length === 0) {
//            t = "NO REFIERE";
            t = "";
            classNoRefiere = " field_no_refiere";
        }
        var top = x.style.top;
        var left = x.style.left;
        var div = document.createElement("div");
        div.className = "convertedInputs convertedInputs_" + type + classNoRefiere;
        div.innerHTML = t;
        div.style.top = top;
        div.style.left = left;
        x.parentNode.insertBefore(div, x.firsChild);
        x.remove();
    }
}

function getGET() {
    var loc = document.location.href;
    var getString = loc.split('?')[1];
    if (getString === undefined) {
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

function addClass(el, cls) {
    if (el === null) {
        console.log("El elemento no existe para agregar la clase " + cls);
        return;
    }
    if (el.classList) {
        el.classList.add(cls);
    } else {
        var cur = ' ' + (el.getAttribute('class') || '') + ' ';
        if (cur.indexOf(' ' + cls + ' ') < 0) {
            setClass(el, (cur + cls).trim());
        }
    }
}
function convertedRowInHeight(rows, height, form, group) {
    var object = ".containerForm_" + form + " .qxuigroupboxGroupBox_" + group + "";
    var s = document.querySelector(object);
    addClass(s, "groupTable");
    var a = document.querySelectorAll(object + " .qx-group .qooxdoo-table-cell");
    var t = a.length;
    var n = height;
    var ro = rows;
    if (t > 0) {
        for (var i = 0; i < t; i++) {
            var m = i + 1;
            if (m >= rows) {
                n = parseInt(n) + parseInt(height);
                rows = ro + rows;
            }
        }
        var b = document.querySelector(object + " .qx-group .qx-tabview-pane");
        b.style.height = n + "px";
        addClass(b, "tablenw");
    }
    if (t === 0) {
        var no = document.querySelector(object + " .nwContainFields");
        no.innerHTML = "<h2 class='sin_registros'>Sin registros</h2>";
        organizeFields(form, group);
    }
    return n;
}
function organizeFields(form, group, usamidle, wpar, wimpar, classcomplet) {
    var classname = ".containerForm_" + form + " .qxuigroupboxGroupBox_" + group;
    if (typeof classcomplet !== "undefined") {
        classname = classcomplet;
    }
    var ag = document.querySelector(classname);
    addClass(ag, "fieldsOrgan");
    configWidthCols(form, group, wpar, wimpar, classcomplet);
    if (usamidle !== false)
        addMidle(form, group, classcomplet);
}

function addMidle(form, group, classcomplet) {
    var classname = ".containerForm_" + form + " .qxuigroupboxGroupBox_" + group;
    if (typeof classcomplet !== "undefined") {
        classname = classcomplet;
    }
    var agg = document.querySelectorAll(classname + " .nw_container_fields_form");
    var f = 0;
    for (var i = 0; i < agg.length; i++) {
        f++;
        if (f >= 4) {
            var s = agg[i];
            var div = document.createElement("span");
            div.className = "clear lineMidle";
            s.parentNode.insertBefore(div, s.nextSibling);
            f = 0;
        }
    }
}

function configWidthCols(form, group, wpar, wimpar, classcomplet) {
    var get = getGET();
    var name = get.type;
    if (typeof wpar === "undefined") {
        wpar = "350";
    }
    if (typeof wimpar === "undefined") {
        wimpar = "140";
    }
    var classname = ".containerForm_" + form + " .qxuigroupboxGroupBox_" + group;
    if (typeof classcomplet !== "undefined") {
        classname = classcomplet;
    }
    var agg = document.querySelectorAll(classname + " .nw_container_fields_form");
    for (var i = 0; i < agg.length; i++) {
        var s = agg[i];
        var n = i + 1;
        var w = wpar;
        if (n % 2 === 1) {
            //impar
            w = wimpar;
        }
        addClass(s, "fieldsOrganEnded_form_" + form + "_group_" + group + "_item_" + i);
        anchoinDivChild(name, form, group, n, w, s, false, classcomplet);
    }
}


function get_content(el) {
    var html = el.innerHTML;
    return html.replace(/<[^>]*>/g, "");
}

function cssTable(name, form, group) {
    var h = "<style>";

    h += ".containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-group{margin-top: 20px;}";

    /*CUERPO TABLA*/
    h += ".containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + ",\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-group,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .nw_container_fields_form_qxnwfield_textArea_qxnw_column_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .nw_container_fields_form,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .nw_container_fields_form div,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-tabview-pane_padre > div,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-scrollbar-horizontal_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-scrollbar-horizontal_padre > div,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-scrollbar-horizontal_padre > div > div,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-tabview-pane_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-toolbar_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-scroller-header_padre_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-scroller-header_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .nw_container_fields_form_qxnwfield_endGroup_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-scrollbar-vertical_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-toolbar_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-tabview-pane_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre_qooxdoo-table-cell_qooxdoo-table-cell-right_padre_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre_qooxdoo-table-cell_qooxdoo-table-cell-right_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre_qooxdoo-table-cell_qooxdoo-table-cell-right_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-tabview-pane_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre_qooxdoo-table-cell_qooxdoo-table-cell-icon_padre_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre_qooxdoo-table-cell_qooxdoo-table-cell-icon_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-scrollbar-horizontal_padre_qx-scrollbar-vertical_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-scrollbar-horizontal_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-scrollbar-vertical_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-statusbar_padre_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-statusbar_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-statusbar_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-statusbar_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-scroller-focus-indicator_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-scroller-focus-indicator_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-scroller-header_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-scroller-header_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-scroller-header,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-scroller-focus-indicator_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-tabview-pane,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-tabview-pane > div,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-tabview-pane > div > div,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-tabview-pane > div > div > div,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-tabview-pane > div > div > div > div,\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-group > div:nth-child(1),\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-group > div:nth-child(2),\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-group > div:nth-child(3),\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-group > div:nth-child(4)\n\
{\n\
    position: relative!important;\n\
    width: 100%!important;\n\
    height: auto!important;\n\
    top: auto!important;\n\
    overflow: hidden!important;\n\
    left: auto!important;\n\
}";

    /*FILAS*/
    h += ".containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell_padre{\n\
    display: inline-table;\n\
}";

    /*COLUMNAS ENCABEZADO*/
    h += ".containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-header-cell\n\
{\n\
    position: relative!important;\n\
    top: auto!important;\n\
    float: left;\n\
    left: auto!important;\n\
}";
    /*COLUMNAS REGISTROS*/
    h += ".containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell\n\
{\n\
    position: relative!important;\n\
    top: auto!important;\n\
    float: left;\n\
    left: auto!important;\n\
    min-height: 1px!important;\n\
}</style>";

    var s = document.createElement("div");
    s.innerHTML = h;
    document.body.appendChild(s);
}
function anchoColTable(name, form, group, num, w, last) {
    var g = "nth-child(" + num + ")";
    if (last === "last") {
        g = "nth-last-child(" + num + ")";
    }
    var h = "<style>";
    h += ".containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qx-table-header-cell:" + g + ",\n\
.containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " .qooxdoo-table-cell:" + g + "\n\
{\n\
    width: " + w + "px!important;\n\
    padding: 0px!important;\n\
}</style>";
    var s = document.createElement("div");
    s.innerHTML = h;
    document.body.appendChild(s);
}


function orderTextOfSelectBox(name, form, group, total, wSelect, wText) {
    for (var i = 1; i < total + 1; i++) {
        var tipo = i % 2;
        if (tipo === 1) {
            anchoinDivChild(name, form, group, i, wSelect);
        }
        if (tipo === 0) {
            anchoinDivChild(name, form, group, i, wText);
        }
    }
}

function anchoinDivChild(name, form, group, item, w, widget, cssAdd, classcomplet) {
    var cssone = "";
    var csstwo = "";
    w = w + "px";
    if (w === "autopx") {
        w = w.replace("px");
    }
    cssone += "max-width:" + w + "!important;width:" + w + "!important;min-width:" + w + "!important;vertical-align:top;";
    if (typeof cssAdd !== "undefined") {
        if (cssAdd !== false) {
            cssone += cssAdd;
        }
    }
    csstwo += "display: block!important;";
    if (typeof widget !== "undefined" && widget !== false) {
        var d = widget;
        if (d) {
            d.style = cssone;
        }
        return true;
    }
    var g = "nth-child(" + item + ")";
    if (item === "last") {
        g = "nth-last-child(1)";
    }
    var classname = ".containerBody_" + name + " .containerForm_" + form + " .qxuigroupboxGroupBox_" + group;
    if (typeof classcomplet !== "undefined") {
        classname = classcomplet;
    }
    var s = "";
    s += "<style>";
    s += classname + " .nw_container_fields_form:" + g + "{" + cssone + "}";
    s += classname + " .nw_container_fields_form:" + g + " > div {" + csstwo + "}";
    s += "</style>";
    var c = document.createElement("div");
    c.innerHTML = s;
    document.body.appendChild(c);
}

function addCss(form, group, classOrID, css) {
    var d = document.querySelector(".containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " " + classOrID);
    if (d) {
        d.style = css;
    }
}

function pageBreak(form, group, mode) {
    var s = "";
    s += "<style>";
    s += ".containerForm_" + form + " .qxuigroupboxGroupBox_" + group + " {page-break-" + mode + ": always;}";
    s += "</style>";
    var c = document.createElement("div");
    c.innerHTML = s;
    document.body.appendChild(c);
}