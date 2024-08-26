//add_delete_row_cell = "NO";
add_delete_row_cell = "SI";
function remove_select_marge() {
    selec_varios_row = "NO";
    $("*").removeClass("select_rows_marge");
}
function menuContextObjects(data, type, x, y) {
    if (habilitar_inspectelement == "SI") {
        return;
    }
    var divSel = $(".td_selected");
    var format = divSel.attr("format");
    var colSpan = divSel.attr("colspan");
    $(".contextmenu").remove();
    var totalSelected = divSel.length;
    var totalSelectedMage = $(".select_rows_marge").length;
    var totalColumnas = $(".row_selected_enc").length;
    var html = "<div class='contextmenu' style='left: " + x + "px; top: " + y + "px;' >";
    html += "<div class='contextmenuIntern'>";
    if (type == "columna_principal") {
        if (totalColumnas <= 1) {
            if (add_delete_row_cell == "SI")
                html += "<div class='contextmenuButtons ' type='add'  >Agregar Fila</div>";
        }
        if (add_delete_row_cell == "SI")
            html += "<div class='contextmenuButtons'   type='delete' >Eliminar fila(s) seleccionada(s)</div>";
    } else
    if (type == "columna") {
        if (totalColumnas <= 1) {
            if (add_delete_row_cell == "SI")
                html += "<div class='contextmenuButtons ' type='addColumn'  >Agregar Columna</div>";
        }
        if (add_delete_row_cell == "SI")
            html += "<div class='contextmenuButtons'   type='delete' >Eliminar columna(s) seleccionada(s)</div>";
    } else
    if (type == "celda") {
        var div = $(".td_selected");
        if (div.attr("var-global") == "true") {
            html += "<div class='contextmenuButtons ' type='variableRemove'  >Remover variable global</div>";
        } else {
            html += "<div class='contextmenuButtons ' type='variable'  >Crear variable global</div>";
        }
        html += "<div class='contextmenuButtons ' type='format'  >Formato Money</div>";
        html += "<div class='contextmenuButtons ' type='formatNumber'  >Formato Numérico</div>";
        html += "<div class='contextmenuButtons ' type='conditional'  >Condicionales</div>";
        if (totalSelectedMage > 1) {
            html += "<div class='contextmenuButtons ' type='mergecells'  >Combinar Celdas</div>";
        }
        if (colSpan >= 1)
            html += "<div class='contextmenuButtons ' type='descombinarceldas'  >Descombinar Celdas</div>";
    }
    html += "</div>";
    html += "</div>";
    $("body").append(html);

    $(".contextmenuButtons").click(function() {
        var tipo = $(this).attr("type");
        if (tipo == "add") {
            addCeldas();
            removeContextMenu();
        }
        if (tipo == "delete") {
            removeContextMenu();
            delete_celdas();
        }
        if (tipo == "copy") {
            CopyToClipboard();
        }
        if (tipo == "variable") {
            create_variable_global();
        }
        if (tipo == "variableRemove") {
            remove_variable_global();
        }
        if (tipo == "addColumn") {
            addColumnas();
            removeContextMenu();
        }
        if (tipo == "mergecells") {
            mergecells();
            removeContextMenu();
        }
        if (tipo == "format") {
            compruebaSelected(formatCelda);
            removeContextMenu();
        }
        if (tipo == "formatNumber") {
            compruebaSelected(formatCelda, false);
            removeContextMenu();
        }
        if (tipo == "conditional") {
            crearCondicional();
            removeContextMenu();
        }
        if (tipo == "descombinarceldas") {
            descombinarceldas();
            removeContextMenu();
        }
    });
    removeContextMenu();
    return false;
}
//function abc(a, toUpperCase) {
//    var abecedario = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
//    if (toUpperCase == true)
//        return abecedario[a].toUpperCase();
//    else
//        return abecedario[a];
//}
function descombinarceldas() {
    var div = $(".td_selected");
    var letracolumna = div.attr("letra-columna");
    var idcolumna = div.attr("id-columna");
    var idfila = div.attr("id-fila");
    var colspan = div.attr("colspan");
    div.attr("colspan", "0");
    for (var i = 0; i < colspan - 1; i++) {
        var num = i + 1;
        var colnext = num + parseInt(idcolumna);
//        var nextLetraCol = abecedario[colnext].toUpperCase();
//        var nextLetraCol = abc(colnext, true);
        var nextLetraCol = letras(colnext);
        var id = nextLetraCol + idfila;
        var divNew = $("#" + id);
        if (divNew.css("display") == "none") {
            divNew.css({"display": "table-cell"});
            divNew.html("");
        } else {
            div.after("<td id='" + id + "' letra-columna='" + nextLetraCol + "' id-columna='" + colnext + "' id-fila='" + idfila + "' class='td_all' contenteditable='false' edit='false' colspan='0' ></td>");
            reinitAll();
            $(".td_all").mousedown(function(e) {
                td_all_click(this, true);
            });
        }
    }
}
//var formatNumber = {
//    separador: ",", // separador para los miles
//    sepDecimal: '.', // separador para los decimales
//    formatear: function(num) {
//        num += '';
//        var splitStr = num.split('.');
//        var splitLeft = splitStr[0];
//        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
//        var regx = /(\d+)(\d{3})/;
//        while (regx.test(splitLeft)) {
//            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
//        }
//        return this.simbol + splitLeft + splitRight;
//    },
//    new : function(num, simbol) {
//        this.simbol = simbol || '';
//        return this.formatear(num);
//    }
//}
function formatCelda(div_ref, signo) {
    var div = $(div_ref);
    var text = div.text();
    var num = "0";
    if (text != "0" && text != 0) {
        var value = clean_number(text);
//    var num = formatNumber.new (value, "$");
//     num = formatNumber.new (value, "");
        num = formato_numero(value, 2, ".", ",");
//        num = Number(value).toLocaleString('en');
    }
//    var num = '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    div.removeClass("format_money");
    if (signo != false) {
        div.addClass("format_money");
        div.attr("format", "money");
    } else {
        div.attr("format", "numeric");
    }
//    div.attr("format", "money");
    div.text(num);
}
function formato_numero(numero, decimales, separador_decimal, separador_miles) {
    numero = parseFloat(numero);
    if (isNaN(numero)) {
        return "";
    }
    if (decimales !== undefined) {
        // Redondeamos
        numero = numero.toFixed(decimales);
    }
    // Convertimos el punto en separador_decimal
    numero = numero.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ",");
    if (separador_miles) {
        // Añadimos los separadores de miles
        var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
        while (miles.test(numero)) {
            numero = numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }

    return numero;
}
function mergecells() {
    var div = $(".select_rows_marge");
//    var divfirst = $(".select_rows_marge:first");
    var divfirst = $(".select_rows_marge").first();
    var total = div.length;
    var text = "";
    var cell = "";
    for (var i = 0; i < total; i++) {
        cell = $(div[i]);
        text += cell.text() + " ";
        if (i != 0) {
            cell.css("display", "none");
        }
    }
    divfirst.html(text);
    divfirst.attr("colspan", total);
    remove_select_marge();
}
function removeContextMenu() {
    $(".contextmenu").mouseleave(function() {
        $(".contextmenu").remove();
    });
    $(".contextmenu").click(function() {
        $(".contextmenu").remove();
    });
}
function addColumnas() {
    var total_td = $(".th_rows").length;
    var html = "<td></td>";
//    var html = "<tr>";
//    for (var i = 0; i < total_td; i++) {
//        html += "<td></td>";
//    }
//    html += "</tr>";
//    $(".row_selected").after(html);
    $(".row_selected").before(html);
    reinitAll();
}

//función para agregar nuevas filas
htmlFilasEnc = "";
totalFilasAdd = 0;
function addCeldas(divSelected, totalFilas, tipoAdd) {
//    }
//    html = htmlFilasEnc;


    //agrego la fila, reviso la celda seleccionada y le agrego antes de su DOM la fila nueva
    //saca el div selected
    var className = ".row_selected_enc";

    if (divSelected != undefined && divSelected != null && divSelected != false) {
        className = divSelected;
    }

    var row_selected_enc = $(className);
    var id_play = row_selected_enc.attr("id");

    //reviso el total de columnas del documento y creo una fila html
    var html = "";
//    if (htmlFilasEnc == "") {
    var total_td = $(".column_enc").length;
    var idNew = parseInt(id_play) + 1;
    html += "<tr id='" + idNew + "' class='trtr trtr_" + idNew + "' >";
//        html += "<tr>";
    for (var i = 0; i < total_td; i++) {
        html += "<td></td>";
    }
    html += "</tr>";
    htmlFilasEnc = html;
//    }
//    html = htmlFilasEnc;


    //agrego la fila, reviso la celda seleccionada y le agrego antes de su DOM la fila nueva
    if (tipoAdd == "after") {
        row_selected_enc.after(html);
    } else {
        row_selected_enc.before(html);
    }
    //en revisión    
//    var td = $("td");
//    var tdall_total = td.length;
//    for (var a = 0; a < tdall_total; a++) {
//        var fila = $(td[a]).attr("id-fila");
//        var col = $(td[a]).attr("id-columna");
//        var id_cell = $(td[a]).attr("id");
//        var func = $(td[a]).attr("func");
//        if (fila >= id_play) {
//            if (func != undefined) {
//                func = func.replace(/\)/gi, ",");
//                func = func.replace(/\(/gi, "");
//                func = func.replace(/=/gi, "");
//                func = func.replace(/\+/gi, "");
//                func = func.replace(/\*/gi, "");
//                func = func.replace(/\//gi, "");
//                func = func.replace(/\-/gi, "");
//                func = func.replace(/1/gi, "");
//                func = func.replace(/2/gi, "");
//                func = func.replace(/3/gi, "");
//                func = func.replace(/4/gi, "");
//                func = func.replace(/5/gi, "");
//                func = func.replace(/6/gi, "");
//                func = func.replace(/7/gi, "");
//                func = func.replace(/8/gi, "");
//                func = func.replace(/9/gi, "");
//                func = func.replace(/0/gi, "");
//                var func_ex = func.split(",");
//                var total_func = func_ex.length;
//                var div_change = $("#" + id_cell);
//                for (var d = 0; d < total_func; d++) {
//                    console.log(func_ex[d]);
//                }
//            }
//        }
//    }

    totalFilasAdd++;
    console.log("registro: " + totalFilasAdd);
    console.log("total: " + totalFilas);
    console.log("div: " + className);

    //reinicia todo, pone clases, id, etc
    if (totalFilas == undefined) {
        reinitAll();
    } else {
        if (parseInt(totalFilas) == parseInt(totalFilasAdd)) {
            console.log("finish");
            reinitAll();
            totalFilasAdd = 0;
            $(".td_all").mousedown(function(e) {
                td_all_click(this, true);
            });
        } else {
//            console.log("faltan mas filas...");
        }
    }

    //genera la acción al botón
//    $(".td_all").mousedown(function(e) {
//        td_all_click(this, true);
//    });

    //en pruebas...
//    loadInitial();

}
function delete_celdas() {
    $(".row_selected").remove();
    reinitAll();
}