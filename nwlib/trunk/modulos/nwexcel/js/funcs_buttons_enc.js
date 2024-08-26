function compruebaSelected(func, param) {
//    var div = $(".td_selected");
    var div = ".td_selected";
    var select = $(".select_rows_marge");
    var total_selected = select.length;
    if (total_selected > 1) {
        for (var i = 0; i < total_selected; i++) {
            func($(select[i]), param);
        }
    } else {
        func(div, param);
    }
}
function styles(div_ref, css) {
//    var html = div.html();
    var div = $(div_ref);
    var html = div.html();
    var text = div.text();
    var id = div.attr("id");
    if (css == "negrilla") {
        div.css("font-weight", "bold");
        div.html("<b>" + text + "</b>");
    }
    if (css == "borde") {
        var bordecolor = $("#borde").val();
//        div.css("border", "1px solid " + bordecolor);
        div.css("border-top-color", bordecolor);
        div.css("border-right-color", bordecolor);
        div.css("border-bottom-color", bordecolor);
        div.css("border-left-color", bordecolor);
        div.css("border-top-width", "1px");
        div.css("border-top-style", "solid");
        div.css("border-bottom-width", "1px");
        div.css("border-bottom-style", "solid");
        div.css("border-right-width", "1px");
        div.css("border-right-style", "solid");
        div.css("border-left-width", "1px");
        div.css("border-left-style", "solid");
    }
    if (css == "cleanformat") {
        clean_format_celda(div);
    }
    if (css == "clean_celda") {
        clean_format_celda(div, "SI");
    }
    if (css == "color_fuente") {
        var size = div.attr("size");
        var color = $("#color_fuente").val();
//        div.css("color", color);
        div.attr("color", color);
        createFontCell(id, div, text, color, size);
//        div.html("<font class='" + id + "_font' color='" + color + "' >" + html + "</font>");
    }
    if (css == "fondocolor") {
        var bg = $("#fondocolor").val();
        div.css("background-color", bg);
        div.attr("bgcolor", bg);
    }
    if (css == "texto_centrar") {
        div.css("text-align", "center");
        div.attr("align", "center");
    }
    if (css == "texto_izquierda") {
        div.css("text-align", "left");
        div.attr("align", "left");
    }
    if (css == "texto_derecha") {
        div.css("text-align", "right");
        div.attr("align", "right");
    }
    if (css == "texto_tamano") {
        var size = $("#texto_tamano").val();
        var color = div.attr("color");
        div.css("font-size", size + "px");
        createFontCell(id, div, text, color, size);
//        div.html("<font color='' size='" + tamtext + "' >" + html + "</font>");
    }
    if (css == "altura_celda") {
        div.css("padding-top", $("#altura_celda").val() + "px");
        div.css("padding-bottom", $("#altura_celda").val() + "px");
    }
    if (css == "ancho_celda") {
        div.css("padding-left", $("#ancho_celda").val() + "px");
        div.css("padding-right", $("#ancho_celda").val() + "px");
    }
}
function createFontCell(id, div, text, color, size) {
    if (color == undefined)
        color = "#000";
    if (size == undefined)
        size = "12px";
//    div.html("<font class='" + id + "_font' color='" + color + "' size='" + size + "' >" + text + "</font>");
    div.html("<font class='" + id + "_font' color='" + color + "'  >" + text + "</font>");
}
function clean_format_celda(div, clean) {
    div.text(div.text());
    div.attr("style", "");
    div.attr("func", "");
    div.attr("bgcolor", "");
    div.removeClass("format_money");
    div.attr("format", "");
    if (clean == "SI")
        div.html("");
    control_pulsado = "NO";
}
function normalizar() {
    var div = $(".td_all");
    var total_td = $(div).length;
    for (var i = 0; i < total_td; i++) {
        var d = div[i];
        var height = $(d).attr("height");
        var rowspan = $(d).attr("rowspan");
        console.log(height);
        console.log(rowspan);
        $(d).attr("height", "0");
        $(d).attr("rowspan", "0");
    }
}
function downloadExcel() {
    $("body").append("<div class='descargando_nwc'><h1>Descargando, por favor espere...</h1></div>");
    var div = $(".td_all");
    var total_td = $(div).length;
    for (var i = 0; i < total_td; i++) {
        var d = div[i];
        var data = $(d).attr("func");
        var display = $(d).css("display");
        if (display == "none") {
            $(d).remove();
        } else {
            if (data != undefined && data != "") {
//                $(d).text(data);
            }
        }
    }
    $(".th_enc").remove();
    $(".field_enc").remove();
    $("#datos_a_enviar").val($("<div>").append($(".axTable").eq(0).clone()).html());
//    $("#datos_a_enviar").val($("<div>").append($("table").first().eq(0).clone()).html());
//    $("#datos_a_enviar").val($(".axTable").html());
    $("#FormularioExportacion").submit();
    setTimeout(function() {
        window.location.reload();
    }, 2000);
}
function clean_fields() {
    var div = $(".td_all");
    var total_td = $(div).length;
    for (var i = 0; i < total_td; i++) {
        var d = div[i];
        var html = $(d).html();
        var text = $(d).text();
        html = html.replace(/ /gi, "");
        if (html == " ") {
            html = html.replace(" ", "");
        }
        text = text.replace(/ /gi, "");
        if (text == " ") {
            text = text.replace(" ", "");
            $(d).html(text);
        } else {
            $(d).html(html);
        }
    }
}
function complete_td() {
    var div = $("tr");
    var total_enc = $(".column_enc").length;
    var html = "";
    var total_td = $(div).length;
    if (total_td > 0) {
        for (var i = 0; i < total_td; i++) {
            var d = div[i];
            var id = d.id;
            html = "";
            if (id != "") {
                var div_filas = $("#" + id + " > td");
                var total_filas = div_filas.length;
                if (total_filas < total_enc) {
                    var diferencia = parseInt(total_enc) - parseInt(total_filas);
                    for (var e = 0; e < diferencia - 1; e++) {
                        html += "<td></td>";
                    }
                    $("#" + id + " > td").last().after(html);
                }
            }
        }
        loadInitial();
//        reinitAll();
    }
}

function execute_functionQXNW() {
    var func = $("#form_general").attr("functionQXNW");
    var html = cleanDocumentHtml();
    parent.qxnw.main.openAnyFunction(func, html);
}