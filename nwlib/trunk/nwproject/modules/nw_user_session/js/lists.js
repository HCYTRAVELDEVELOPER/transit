$(document).ready(function () {
    if (isMobile()) {
        (function () {
            $('body').delegate('.FiltrarBtnListMobile', 'click', function () {
                var s = this;
                var self = getAttributeNw($(this), "docum");
                var container = self + " .nwformFiltersEncList";
                var data = $(s).attr("abierto");
                if (data == undefined) {
                    $(s).attr("abierto", "NO");
                    $(s).text("Filtrar");
                    data = "NO";
                }
                if (data == "SI") {
                    $(s).attr("abierto", "NO");
                    $(s).text("Filtrar");
                    $(container).removeClass("nwformFiltersEncListShow");
                } else {
                    $(s).text("Cerrar filtro");
                    $(container).addClass("nwformFiltersEncListShow");
                    $(s).attr("abierto", "SI");
                }
            });
        })();
    }
    (function () {
        $('body').delegate('.imageListNwMaker2', 'click', function () {
            /*
             var file = $(this).attr("file");
             var clickable = $(this).attr("clickable");
             if (clickable != "NO") {
             window.open(file, '_blank');
             }
             */
        });
    })();
    (function () {
        var modeClick = "mousedown";
        if (isMobile()) {
            /*modeClick = "click";*/
        }
        $('body').delegate('.colsMobil', modeClick, function () {
            activeSelectedRow($(this), this);
        });
    })();
    (function () {
        $('body').delegate('.colsMenu', 'click', function () {
            showContextMenu(this);
        });
    })();
    (function () {
        $('body').delegate('.colsMenuOpenPopup', 'click', function () {
            hiddenContextMenu();
        });
    })();
    (function () {
        $('body').delegate('.colsMenuInt', 'mouseleave', function () {
            hiddenContextMenu();
        });
    })();
    var lo = document.querySelector(".loadingNwMakerHome");
    if (lo) {
        remove($(".loadingNwMakerHome"));
    }
});


function createList(columns, div, popup, params) {
    var colsEncMobil = "";
    var totalCols = columns.length;
    var col = 0;
    for (var i = 0; i < totalCols; i++) {
        var c = columns[i];
        var widtimg = "";
        if (typeof c.widthImage !== "undefined") {
            widtimg = " data-width-image='" + c.widthImage + "' ";
        }
        var width = "";
        if (typeof c.width !== "undefined") {
            width = " data-width='" + c.width + "' ";
        }
        var corta_text = "";
        if (typeof c.corta_text !== "undefined") {
            corta_text = " data-corta_text='" + c.corta_text + "' ";
        }
        var visible = "visible_col";
        if (c.visible == false) {
            visible = "hidden_col";
        } else {
            col++;
        }
        var label = c.label;
        var caption = c.caption;
        var type = c.type;
        var mode = "";
        var order = i;
        if (typeof c.modo != "undefined") {
            mode = c.modo;
        }
        if (typeof c.mode != "undefined") {
            mode = c.mode;
        }
        var clickable = " clickable='SI' ";
        if (typeof c.clickable != "undefined") {
            if (c.clickable === false) {
                clickable = " clickable='NO' ";
            }
        }
        colsEncMobil += "<div " + corta_text + " " + width + " " + widtimg + " " + clickable + " id='col_" + caption + "' mode='" + mode + "' order='" + order + "' class='colEncMobil colEncMobil_num_" + i + " colEncMobil_" + label + " colMobil " + visible + "' visible='" + visible + "' type='" + type + "' caption='" + caption + "' label='" + label + "'  >";
        colsEncMobil += "<p>" + str(label) + "</p>";
        colsEncMobil += "</div>";
    }
    var classmobi = "";
    if (isMobile()) {
        classmobi = "list_classmobi";
    }
    var rta = "";
    rta += "<div class='tableListMakerMobil " + classmobi + "' t-cols='" + totalCols + "' >";
    rta += "<div class='containerButtonListEnc'>";
    rta += "</div>";
    rta += "<div class='container-table-list' >";
    rta += "<div class='colsMobilEnc' >";
    rta += colsEncMobil;
    rta += "</div>";
    rta += "<div class='containDataCols' >";
    rta += "<div class='containDataColsInt' >";
    rta += "</div>";
    rta += "</div>";
    rta += "</div>";
    rta += "</div>";
    var response = true;
    if (popup == "popup") {
        response = addInWIndow(rta, div, "createListPopup", params);
    } else {
        addInWIndow(rta, div, "createList");
    }
    var width = 100 / col;
    $(div + " .colEncMobil").css({"width": width + "%"});
    if ($(div + " .containerFilters").length == 0) {
        var fil = "<div class='containerFilters' ></div>";
        addInWIndow(fil, div + " .container-table-list", "before");
    }
    $(div).addClass("contand_mainw");
    $(div).addClass("list_mainw");
    return response;
}

function setModelDataNew(r, self, dontEmpty, cleanHtml) {
    setModelData(r, self, true, dontEmpty, cleanHtml);
}
function setModelData(r, self, newMode, dontEmpty, cleanHtml) {
    if (dontEmpty != true) {
        resetList(self);
    }
    if (!verifyErrorNwMaker(r)) {
        return;
    }
    if (self == undefined) {
        self = ".containFileDir";
    }
    var total = r.length;
    for (var i = 0; i < total; i++) {
        var row = r[i];
        addRowInList(self, row, i, cleanHtml, false, newMode);
    }
    addDataPagination(self, total);
    $(self + " .colsMobilEnc").css({"display": "block"});
    $(self + " .colMobil").css({"float": "left", "max-width": "initial", "min-width": "auto"});
    return true;
}

function addDataPagination(self, total) {
    if ($(".container-pagination-nwlist-unique").length > 0) {
        $(self + " .paglist-total").text(total);
    }
}

function createPaginationNwList(self) {
    var html = "";
    html += "<div class='container-pagination-nwlist container-pagination-nwlist-unique' type='next' data-box='paglist-final'  >";
    html += "<p style='display: none;' >Registros <span class='paglist-initial'>0</span> a <span class='paglist-final'>12</span> de <span class='paglist-total'>0</span></p>";
    html += "<p>";
    /*    html += "<span class='btn-linkpaglistnw  pagNwlist-back' type='back' data-box='paglist-initial' >Atrás</span>";*/
    html += "<span class='btn-linkpaglistnw  pagNwlist-next' type='next' data-box='paglist-final' >" + str("Cargar más") + "</span>";
    html += "</p>";
    html += "</div>";
    $(self).append(html);
}

function removeRow(self) {
    if ($(self + " .colsMobil_show_row").length < 1) {
        nw_dialog("Seleccione un registro");
        return;
    }
    remove(self + " .colsMobil_show_row");
    return true;
}

function addRowInListNew(self, row, position, cleanHtml, addClassName) {
    addRowInList(self, row, position, cleanHtml, addClassName, true);
}
function addRowInList(self, row, position, cleanHtml, addClassName, newMode, modeappend) {
    var i = position;
    var id = "";
    if (row.id != undefined) {
        id = row.id;
    }
    var colsEnc = $(self + " .colEncMobil");
    var totalCols = colsEnc.length;
    var colsEncVisibles = $(self + " .visible_col");
    var totalColsVis = colsEncVisibles.length;
    var width = 100 / totalColsVis;
    var colsMobil = "";
    var identificador_row = "colsMobil_" + i;
    var identificador_row2 = "colsMobilID_" + id;
    var classRow = " row_nw_inpar";
    if (i % 2 == 0) {
        classRow = " row_nw_par";
    }
    if (typeof addClassName == "undefined" || addClassName == false || addClassName === null) {
        addClassName = "";
    }
    /* open row */
    colsMobil += "<div class='colsMobil " + identificador_row + " " + identificador_row2 + " " + addClassName + " " + classRow + " '  >";
    colsMobil += "<div class='rowinterlistnwmaker'>";

    /*contextmenú*/
    colsMobil += "<div self='" + self + "' class='colsMenu colsMenu_" + i + "' n='" + i + "'>";
    colsMobil += "<div class='menuList' >";
    colsMobil += "<span></span>";
    colsMobil += "<span></span>";
    colsMobil += "<span></span>";
    colsMobil += "</div>";

    colsMobil += "<div class='colsMenuInt colsMenuInt_" + i + " colsMenuIntID_" + id + "' >";
    colsMobil += "<div class='colsMenuInterno colsMenuInterno_" + i + " colsMenuInternoID_" + id + "' >";
    colsMobil += "</div>";
    colsMobil += "</div>";

    colsMobil += "</div>";

    var array = row;
    var x = 0;
    var isFirsColVisible = true;
    var spanordivs = "span";
    var pordivs = "p";
    if (newMode === true) {
        spanordivs = "div";
        pordivs = "div";
    }
    for (var z = 0; z < totalCols; z++) {
        var c = colsEnc[z];

        var labelEnc = c.id;
        labelEnc = labelEnc.replace("col_", "");
        var visible = $(c).attr("visible");
        var clickable = $(c).attr("clickable");

        var classVisible = "";

        if (visible == "hidden_col") {
            classVisible = "hidden_col";
        }

        var classVisibleMobile = "";
        if (isMobile()) {
            if (classVisible != "hidden_col") {
                if (isFirsColVisible) {
                    classVisibleMobile = " show_column";
                    isFirsColVisible = false;
                } else {
                    classVisibleMobile = " hidden_column";
                }
            }
        }

        var corta_text = $(c).attr("data-corta_text");
        var widthimage = $(c).attr("data-width-image");
        var widthadd = $(c).attr("data-width");
        var type = $(c).attr("type");
        var mode = $(c).attr("mode");
        var colText = $(c).text();

        $.each(array, function (key, value) {
            if (key == labelEnc) {
                var cssadd = "";
                if (!evalueData(value, "0")) {
                    value = "";
                }
                if (cleanHtml === true) {
                    value = strip_tags(value);
                }
                var w = 200;
                if (evalueData(widthimage)) {
                    w = widthimage;
                }
                if (evalueData(widthadd)) {
                    width = widthadd;
                }
                var text_show_others = "";
                if (type == "image" || type == "image") {
                    var file = getFileByType(value, mode, w);
                    if (mode === "normal") {
                        file = value;
                    }
                    var valFile = value;
                    var ex = getExtensionFile(valFile);
                    if (ex == ".docx" || ex == ".doc" || ex == ".xls" || ex == ".xlsx") {
                        valFile = "/nwlib6/nwproject/modules/nwdrive/viewFile.php?file=" + value;
                    }
                    text_show_others = "<span clickable='" + clickable + "' style='background-image: url(" + file + ");' file='" + valFile + "' class='imageListNwMaker2 numberColList_" + x + "' /></span>";
                    cssadd = "style='display: none;' ";
                }

                var text_show = value;
                if (type == "money") {
                    text_show = "$" + value;
                }
                if (type == "button") {
                    /*
                     text_show = "<input type='button' value='" + value + "' />";
                     */
                    text_show = "<button type='button' >" + value + "</button>";
                }
                if (evalueData(corta_text)) {
                    text_show = cortaText(text_show, corta_text);
                }
                if (mode === "money") {
                    text_show = formatearNumeroMoney(text_show);
                }
                if (type == "selectBox") {
                    if (typeof array[key + "_text"] != "undefined") {
                        if (array[key + "_text"] != null) {
                            text_show_others = "<span class='otherTextChildrenVal otherTextChildrenVal_" + key + "'>" + array[key + "_text"] + "</span>";
                            cssadd = "style='display: none;' ";
                        }
                    }
                }

                if (type === "textField" || type === "editable") {
                    text_show = "<span class='span_editable' contenteditable='true'>" + text_show + "</span>";
                }

                var classColf = "";
                if (x == 0) {
                    classColf = " namedColMobFirst";
                }
                colsMobil += "<div class='colMobil colListNum_" + x + " colMobil_" + id + " colMobilLabel_" + key + "  " + classVisible + "' key='" + x + "' named='" + key + "' style='width: " + width + "%' >";
                colsMobil += "<" + pordivs + " class='pColsIntList pColsIntList_" + x + " pColsIntListName_" + key + " " + classVisibleMobile + "' >";

                /*label*/
                colsMobil += "<span class='namedColMob" + classColf + " namedColMob_" + id + " namedColMobLabel_" + key + " ' name='" + key + "' >" + str(colText) + "</span>";
                /*contenido*/
                colsMobil += "<" + spanordivs + " class='childrenValuesList valueColMob_" + id + " numberColList_" + x + " nameColList_" + key + "' name='" + key + "' key='" + x + "' " + cssadd + " >";
                colsMobil += text_show;
                colsMobil += "</" + spanordivs + ">";
                colsMobil += text_show_others;
                /*fin contenido*/

                colsMobil += "</" + pordivs + ">";
                colsMobil += "</div>";
                x++;
            }
        });
    }
    /* close row */
    colsMobil += "</div>";
    colsMobil += "</div>";

    if (modeappend === "prepend") {
        $(self + " .containDataColsInt").prepend(colsMobil);
    } else {
        $(self + " .containDataColsInt").append(colsMobil);
    }
    $(self + " ." + identificador_row).append("<div class='clear'></div>");
    $(self + " ." + identificador_row + " .rowinterlistnwmaker").append("<div class='clear'></div>");
    return "." + identificador_row;
}

function populateRowList(self, id, row, columns) {
    console.log(columns);
    $.each(row, function (key, value) {
        setValueColListByID(self, id, key, value);
    });
}

function setValueColListByID(self, id, field, value) {
    return setValueColList(self, false, field, value, id);
}
function setValueColList(self, row, field, value, id) {
    var classname = ".colsMobil_" + row;
    if (evalueData(id) && row === false) {
        classname = ".colsMobilID_" + id;
    }
    $(self + " " + classname + " .nameColList_" + field).html(value);
}

function setMinHeightList(param, self) {
    if (self == undefined) {
        self = ".containFileDir";
    }
    $(self + " .containDataCols").css({"min-height": param});
}

function setMaxHeightList(param, self) {
    if (self == undefined) {
        self = ".containFileDir";
    }
    $(self + " .containDataCols").css({"max-height": param});
}
function setWidthList(self, width) {
    $(self).css({"width": width});
}

function setMaxWidthList(w, div) {
    if (div == undefined) {
        div = ".containFileDir";
    }
    $(div).css({"max-width": w});
}

function setMinWidthList(w, div) {
    if (div == undefined) {
        div = ".containFileDir";
    }
    $(div).css({"min-width": w});
}
function createFilters(filters, self, execFilters) {
    var rta = "";
    rta += "<form class='nwformFiltersEncList' >";
    if (isMobile()) {
        rta += "<div class='FiltrarBtnListMobile' docum='" + self + "'>" + str("Filtrar") + "</div>";
    }
    var fechas = [];
    var inps = [];
    for (var i = 0; i < filters.length; i++) {
        var d = filters[i];
        var tipo = "";
        if (evalueData(d.tipo)) {
            tipo = d.tipo;
        }
        if (evalueData(d.type)) {
            tipo = d.type;
        }
        if (tipo == "dateField" || tipo == "date") {
            d.type = "textField";
            fechas[i] = d.name;
        }
        inps[i] = d;
    }
    rta += createInputsFor(filters);
    rta += "</form>";
    addInWIndow(rta, self + " .containerFilters", "append");
    activeDatePickerInCol(fechas, self);
    $(self + " .containerFilters").append("<div class='clear clearfilterslist_nwmaker'></div>");

    $(self + ' .nwformFiltersEncList').submit(function () {
        if (typeof execFilters !== "undefined") {
            if (evalueData(execFilters)) {
                execFilters();
            }
        }
        return false;
    });

}

function getButtonUpdateFilter(self, type) {
    var consultar = createButtonListEnc(self + " .containerFilters", "Consultar", "filterUpdate");
    return consultar;
}

function getDataFilters(self) {
    var data = getRecordNwForm(self, ".nwformFiltersEncList");
    return data;
}
function removeColorsRows(div) {
    if (div == undefined) {
        div = ".containFileDir";
    }
    $(div + " .colsMobil").css({"background": "transparent"});
}

function removeMainColumns(div) {
    if (div == undefined) {
        div = ".containFileDir";
    }
    addCss(div, ".colsMobilEnc", {"display": "none"});
}

function hiddenMainColumns(div) {
    if (div == undefined) {
        div = ".containFileDir";
    }
    $(div + " .colsMobilEnc").css({"display": "none"});
}
function listBloqs(div, numColumnas) {
    if (typeof div === "undefined") {
        div = ".containFileDir";
    }
    if (typeof numColumnas === "undefined") {
        numColumnas = 4;
    }
    hiddenMainColumns(div);
    /*
     $(div + " .clear").remove();
     */
    var width = 100 / numColumnas;
    var css = {};
    css["float"] = "left";
    css["width"] = width + "%";
    $(div + " .colsMobil").css(css);
    $(div + " .colMobil").css({"float": "none", "max-width": "100%", "min-width": "100%"});
}
function listAddCss(div, css) {
    if (div == undefined) {
        div = ".containFileDir";
    }
    $(div + " .colsMobil").css(css);
}

function listWidthByColumn(self, cell, width) {
    if (self == undefined) {
        self = ".containFileDir";
    }
    if (isNaN(parseInt(cell))) {
        return;
    }
    $(self + " .colEncMobil_num_" + cell).width(width);
    $(self + " .colListNum_" + cell).width(width);
}

function listScroll(self, option) {
    if (self == undefined) {
        self = ".containFileDir";
    }
    if (!option) {
        $(self + " .containDataColsInt").css({"position": "relative", "height": "auto"});
        $(self + " .containDataCols").css({"min-height": "initial", "height": "auto"});
    } else {
        $(self + " .containDataColsInt").css({"position": "absolute"});
    }
}

function moveDataToColumn(self, colData, colOrigen) {
    if (self == undefined) {
        self = ".containFileDir";
    }
    /*primero quito la columna encabezado*/
    if ($(".colEncMobil_num_" + colData).length > 0) {
        $(self + " .colEncMobil_num_" + colData).remove();
    }
    /*luego reviso cuantas filas existes de la colData*/
    var totalFilas = $(self + " .colsMobil").length;
    /*le agrego a colOrigen todas las columnas de colData*/
    for (var i = 0; i < totalFilas; i++) {
        $(self + " .colsMobil_" + i + " .colListNum_" + colData).appendTo(self + " .colsMobil_" + i + " .colListNum_" + colOrigen);
    }
    /*agrego estilos a las p de las dos columnas para que no se vean muy separadas*/
    $(self + " .colListNum_" + colOrigen + " p").css({"margin": "15px 0px 3px 5px", "padding": "0 15px"});
    $(self + " .colListNum_" + colData + " p").css({"margin": "3px 0px 3px 5px", "padding": "0 15px"});
    /*le pongo por defecto el ancho al 100% de la columna que se movió*/
    listWidthByColumn(self, colData, "100%");
}

function columnsBelowEachOther(self) {
    if (self == undefined) {
        self = ".containFileDir";
    }
    $(self + " .colMobil").css({"float": "none", "width": "auto"});
}
function listShowDataMobile() {
    if (isMobile()) {
        $(".showRowMax .hidden_column").addClass("show_column");
        $(".showRowMax .namedColMob").addClass("show_column");
    }
}

function cleanListShowMobile() {
    $(".showRowMax .hidden_column").removeClass("show_column");
    $(".showRowMax .namedColMob").removeClass("show_column");
}
function addHeaderNoteList(html, self, divInside) {
    addHtmlList(html, "header", self, divInside);
}
function addFooterNoteList(self, html) {
    addHtmlList(html, "footer", self);
}
function addHtmlList(html, mode, self, divInside) {
    if (self == undefined) {
        self = ".containFileDir";
    }
    var ob = ".tableListMakerMobil";
    if (mode == "header") {
        $(self + " " + ob).prepend("<div class='addHtmlList addHeaderNoteList'>" + html + "</div>");
    } else
    if (mode == "footer") {
        $(self + " " + ob).append("<div class='addHtmlList addFooterNoteList'>" + html + "</div>");
    }
}
function removeHoverInList(self) {
    $(self + " .colsMobil").addClass("no_hover");
}

function resetList(self) {
    remove(self + " .no_rows");
    $(self + " .containDataColsInt").empty();
}
function hideColumn(self, input, mode) {
    return hiddenColumn(self, input, mode);
}
function hiddenColumn(self, input, mode) {
    if (mode == "showRow") {
        $(self + " .colMobilLabel_" + input).addClass("hiddenColumnInShowRow");
    }
    $(self + " .colMobilLabel_" + input).removeClass("showColumn");
    $(self + " .colMobilLabel_" + input).addClass("hiddenColumn");
}

function showColumn(self, input, mode) {
    $(self + " .colMobilLabel_" + input).removeClass("hiddenColumn");
    $(self + " .colMobilLabel_" + input).addClass("showColumn");
}
function showRowInMobile(self, input) {
    $(self + " .pColsIntListName_" + input).removeClass("hidden_column");
    $(self + " .pColsIntListName_" + input).addClass("show_column");
    $(self + " .colMobilLabel_" + input).removeClass("hidden_column");
    $(self + " .colMobilLabel_" + input).addClass("show_column");
}
function actionInColList(self, ui, onlyclass) {
    var u = self + " .nameColList_" + ui;
    var div = $(u);
    if (onlyclass === true) {
        div = u;
    }
    return div;
}
function actionInRow(self, option) {
    if (option == undefined) {
        option = "false";
    }
    var div = $(self + " .colsMobil");
    div.attr("clicHabilitado", option);
    return div;
}

function inactiveClicInRow(self) {
    var div = actionInRow(self, "false");
    return div;
}

function activeClicInRow(self) {
    var div = actionInRow(self, "true");
    return div;
}
function activeClickDontOpen(self) {
    if (isMobile()) {
        $(self + " .colsMobil").addClass("colsMobil_show");
        $(self + " .colsMobil").addClass("colsMobil_show_row");
        var d = document.querySelectorAll(self + " .colsMobil");
        for (var x = 0; x < d.length; x++) {
            d[x].setAttribute("inactiverow", "true");
        }
    }
}
function modoContextMenu(self, mode) {
    if (mode == "popup") {
        $(self + " .colsMenu").attr("modoContextMenu", "popup");
        $(self + " .colsMenuInt").addClass("contextMenuPopUp");
    }
}
function getNamesRows(self) {
    var da = document.querySelectorAll(self + " .colsMobil");
    var td = da.length;
    var ra = [];
    for (var p = 0; p < td; p++) {
        var a = da[p];
        var d = $(a).find(".childrenValuesList");
        var t = d.length;
        var r = {};
        for (var i = 0; i < t; i++) {
            var x = d[i];
            var name = x.getAttribute("name");
            var value = strip_tags(x.innerHTML);
            if ($(".otherTextChildrenVal_" + name).length > 0) {
                value = $(".otherTextChildrenVal_" + name).html();
            }
            r[name] = value;
        }
        ra[p] = r;
    }
    return ra;
}

function createTableOfList(self) {
    var d = getNamesRows(self);
    var c = getNamesCols(self);
    var cols = "";
    var filas = "";
    for (var i = 0; i < c.length; i++) {
        var cc = c[i];
        var v = cc.visible;
        var ca = "";
        if (v != "hidden_col") {
            cols += "<th " + ca + ">";
            /* REVISAR CON CALIDAD
             cols += str(cc.caption);
             */
            cols += str(cc.name);
            cols += "</th>";
        }
    }
    for (var ia = 0; ia < d.length; ia++) {
        var cca = d[ia];
        filas += "<tr>";
        for (var i = 0; i < c.length; i++) {
            var cc = c[i];
            var v = cc.visible;
            var labelEnc = cc.caption;
            $.each(cca, function (key, value) {
                if (key == labelEnc) {
                    if (v != "hidden_col") {
                        filas += "<td>";
                        filas += value;
                        filas += "</td>";
                    }
                }
            });
        }
        filas += "</tr>";
    }
    var html = "";
    html += "<table class='tableExportExcelNwMaker'>";
    html += "<tr>";
    html += cols;
    html += "</tr>";
    html += filas;
    html += "</table>";
    return html;
}

function exportListExcel(self) {
    var html = createTableOfList(self);
    var params = {};
    params.html = "<h1>" + str("Previsualización de datos a exportar") + "</h1>" + html;
    params.textAccept = str('Exportar a Excel');
    params.onSave = function () {
        downloadExcel(html);
        return true;
    };
    params.width = 500;
    params.height = 500;
    params.title = 'Exportar';
    createDialogNw(params);
}

function downloadExcel(h, name) {
    var div = document.createElement("form");
    div.class = "FormularioExportacion";
    div.id = "FormularioExportacion";
    div.action = "/nwlib6/modulos/nwexcel/srv/ficheroExcel.php";
    div.method = "POST";
    document.querySelector("body").appendChild(div);

    var btn = document.createElement("input");
    btn.type = "hidden";
    btn.name = "datos_a_enviar";
    btn.value = h;
    document.querySelector("#FormularioExportacion").appendChild(btn);
    document.querySelector("#FormularioExportacion").submit();

    var n = document.createElement("input");
    n.type = "hidden";
    n.name = "name";
    if (evalueData(name)) {
        n.value = name;
    } else {
        n.value = "ficheroExcel";
    }
    document.querySelector("#FormularioExportacion").appendChild(n);

    setTimeout(function () {
        document.querySelector("#FormularioExportacion").remove();
    }, 500);

}
function fadeOutMainColumns(self) {
    $(self + " .colsMobilEnc").fadeOut(0);
}
function createButtonListEnc(self, text, type) {
    var num = Math.floor((Math.random() * 10000) + 1);
    var div = "btn-linkEnc-" + num;
    var divAgregar = self + " .containerFilters";

    if (type == "filterUpdate") {
        divAgregar = self;
        div = "filterUpdateEnc";
        $(divAgregar).append("<div class='btn btn_enc_" + text + " btn-red-cuadro " + div + "' >" + str(text) + "</div>");
    } else {
        if (isMobile()) {
            $(divAgregar).append("<div class='btn btn_enc_" + text + " btn-red-cuadro " + div + "' >" + str(text) + "</div>");
        } else {
            $(divAgregar).prepend("<div class='btn btn_enc_" + text + " btn-red-cuadro " + div + "' >" + str(text) + "</div>");
        }
    }
    remove(divAgregar + " .clearfilterslist_nwmaker");
    $(divAgregar).append("<div class='clear clearfilterslist_nwmaker'></div>");
    return $(self + " ." + div);
}

function addButtonContextMenu(self, text, textIsMaster) {
    var num = Math.floor((Math.random() * 10000) + 1);
    var div = "btn-contextMenu-" + num;
    $(self + " .colsMenuInterno").append("<p class='btn-contextMenu " + div + " " + textIsMaster + "'  mode='edit' >" + str(text) + "</p>");
    return $(self + " ." + div);
}

function removeButtonContextMenu(self, clase) {
    $(self + " .colsMenuInt").find(clase).remove();
    return;
}

function getSelectedRecord(self, allForm, array) {

    var total = $(self + " .tableListMakerMobil").attr("t-cols");
    /*
     var div = $(self + " .colsMobil_show");
     */
    var rta = "";
    var div = $(self + " .visibleForData");
    if (div.length == 0) {
        div = $(self + " .colsMobil");
    }
    if (allForm === true) {
        var g = $(self + " .colsMobil");
        var t = g.length;
        if (array) {
            var r = [];
        } else {
            var r = {};
        }
        var num = 0;
        for (var i = 0; i < t; i++) {
            var y = $(g[i]);
            var p = getDataByColList(self, total, y);
            var size = Object.keys(p).length;
            if (size > 0) {
                r[num] = p;
                num++;
            }
        }
        rta = r;
    } else {
        rta = getDataByColList(self, total, div);
    }
    return rta;
}

function getDataByColList(self, total, div) {
    var d = div;
    var r = {};
    for (var i = 0; i < total; i++) {
        var x = d.find(".numberColList_" + i);
        var key = x.attr("name");
        if (evalueData(key)) {
            /*
             var value = x.text();
             */
            var value = x.html();
            r[key] = value;
        }
    }
    return r;
}

function applyFilters(self, service, method, data) {
    var rpc = {};
    rpc["service"] = service;
    rpc["method"] = method;
    rpc["data"] = data;

    var func = function (r) {
        $(self + " .containDataColsInt").empty();
        if (r == "0" || r == 0) {
            return false;
        } else
        if (r) {
            setModelData(r, self);
        } else {
            nw_dialog("A ocurrido un error: " + r);
            console.log(r);
        }
    };
    rpcNw("rpcNw", rpc, func, false);
}

function deleteRecordForId(data, callBack) {
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "deleteFromTableById";
    rpc["data"] = data;
    var func = function (r) {
        if (typeof callBack != "undefined") {
            callBack(r);
        }
        if (r == "0" || r == 0) {
            return false;
        } else
        if (r) {
            return true;
        } else {
            nw_dialog("A ocurrido un error: " + r);
            console.log("A ocurrido un error: " + r);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}
function hiddenContextMenu() {
    $(".colsMenuInt").removeClass("colsMobil_show_menu");
    $("body").removeClass("noScroll");
    $(".bgContextMenuPopUp").remove();
    $(".colsMenu").attr("openpopup", "false");
    $(".colsMenu").removeClass("colsMenuOpenPopup");

    /*    removeFromUrl("openContextMenu=true");*/

}
function showContextMenu(thi) {
    var modo = $(thi).attr("modoContextMenu");
    var d = $(thi).attr("n");
    var self = $(thi).attr("self");
    var openPopUp = $(thi).attr("openpopup");
    if (openPopUp == "true") {
        return false;
    }
    $(thi).addClass("colsMobil_show");
    /*
     $(".colsMobil").removeClass("colsMobil_show");
     */
    $(".colsMenuInt").removeClass("colsMobil_show_menu");

    $(self + " .colsMenuInt_" + d).addClass("colsMobil_show_menu");

    if (modo == "popup") {
        /*        addDataUrlGet("openContextMenu=true");*/
        $(thi).attr("openpopup", "true");
        $(thi).addClass("colsMenuOpenPopup", "true");
        $("body").addClass("noScroll");
    }
}
function activeSelectedRow(widget, thi) {
    var dontclick = widget.attr("dontclick");
    var inactiverow = widget.attr("inactiverow");
    if (dontclick === "false") {
        return;
    }
    /*    if (inactiverow !== "true" || isMobile() === true) { */
    $(".colsMobil").removeClass("visibleForData");
    if (inactiverow !== "true") {
        $(".colsMobil").removeClass("colsMobil_show");
        $(".colsMobil").removeClass("colsMobil_show_row");
    }

    widget.addClass("visibleForData");
    widget.addClass("colsMobil_show");
    widget.addClass("colsMobil_show_row");

    var clicHabil = false;
    if (isMobile()) {
        /*clicHabil = true;*/
    }
    var clic = widget.attr("clicHabilitado");
    if (typeof clic != "undefined") {
        if (clic == "false") {
            clicHabil = false;
        } else
        if (clic == "true") {
            clicHabil = true;
        }
    }
    if (clicHabil) {
        var self = generateSelf();
        var data = widget.html();
        addWindowSlide(self, data, true, thi);
    }
}

function showRowSelected() {
    var row = document.querySelector(".colsMobil_show");
    var self = generateSelf();
    var data = $(row).html();
    $(".colsMobil_show").addClass("colsMobil_show_inrow");
    var k = addWindowSlide(self, data, true, row);
    $(".colsMobil_show_inrow").attr("dontclick", "false");
    return k;
}
function loadingList(self, cols, rows, cssitem, car) {
    var html = "<div class='timeline-wrapper'>";
    for (var i = 0; i < rows; i++) {
        html += "<div class='timeline-item' style='" + cssitem + "'>";
        html += "<div class='animated-background'>";
        for (var ia = 0; ia < cols; ia++) {
            html += "<div class='animated-background-bloque' style='" + car[ia] + "'></div>";
        }
        html += "</div>";
        html += "</div>";
    }
    html += "</div>";
    $(self + " .containDataCols").append(html);
}

function removeLoadingList(self) {
    remove(self + " .timeline-wrapper");
}
function activepagination(self, callback) {
    createPaginationNwList(self);
    $(self + " .container-pagination-nwlist").click(function () {
        removeLoading(self);
        loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self + " .container-pagination-nwlist");
        activeLinkPaginationList(this);
        callback();
    });
}

function activeLinkPaginationList(self) {
    $(".btn-linkpaglistnw").removeClass("activeLinkPaginationList");
    $(self).addClass("activeLinkPaginationList");
    var type = $(self).attr("type");
    var div = $(self).attr("data-box");
    var data = $("." + div).text();
    var suma = parseInt(data) + 10;
    $("." + div).text(suma);
}
function loadCssButtonsMobile(mode) {
    if (mode == "lista") {
        loadCss("/nwlib6/nwproject/modules/nw_user_session/css/lista.css");
    }
}
function adapterSizeList(self) {
    var di = $(self + " .containDataCols");
    if (di.length == 0) {
        return;
    }
    var pos = di.offset();
    var wpage = window.innerHeight;
    var ww = parseInt(wpage) - parseInt(pos.top) - 50;
    di.height(ww);

    $(window).resize(function () {
        adapterSizeList(self);
    });
}
function appendData(self, div, html, type) {
    $(self + " " + div).append(html);
}

function applyMediaCssMobile(self, option) {
    if (option === false) {
        $(self + " .tableListMakerMobil").removeClass("list_classmobi");
    }
}