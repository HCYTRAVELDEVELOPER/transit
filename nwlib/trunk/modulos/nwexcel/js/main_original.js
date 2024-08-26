vnwlib = 6;
focus_formula = "NO";
focus_igual = "NO";
field_hover = "";
control_pulsado = "NO";
edit_field = "NO";
file_ya_existe = "";
carpeta = "/nwlib" + vnwlib + "/modulos/nwexcel/";
selec_varios_row = "NO";
//habilitar_inspectelement = "SI";
habilitar_inspectelement = "NO";
$(document).ready(function() {
    file_ya_existe = $("#name_file").val();
    var permisos = $("#form_general").attr("permisos");
    if (permisos == "lectura") {
        $("head").after("<div class='css_vista_previa'><link href='" + carpeta + "css/solo_lectura.css' rel='stylesheet' type='text/css' charset='utf-8' /></div>");
        $(document).keyup(function(tecla) {
            return false;
        });
    }
    document.onselectstart = function() {
//        return false;
    };
// Firefox
    document.onmousedown = function() {
//        return false;
    };
    ///////////////////////////////////////////////INHABILITA CLIC DERECHO
    document.oncontextmenu = function() {
        if (habilitar_inspectelement == "NO")
            return false;
    };
    //////////////INHABILITA CONTROL U ALT ETC ///////////////////////////////////
    document.onkeydown = function(e) {
        if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 117 || e.keycode === 17 || e.keycode === 85)) {
//            return false;
        }
    };
    $(".save").click(function() {
        save();
    });
    $(".save_como").click(function() {
        guardar_como();
    });
    $(".print_button").click(function() {
        print_document();
    });
    $(".vista_previa").click(function() {
        vista_previa();
    });
    $(".cancel_print").click(function() {
        cancel_print();
    });
    $(".code_js").click(function() {
        code();
    });
    $(".code_css").click(function() {
        codeCss();
    });
    $(".complete_celdas").click(function() {
        complete_td();
    });
    $(".compartir_file").click(function() {
        share_file();
    });
    $(".normalizar").click(function() {
        normalizar();
    });
    tr();
    loadInitial();
    active_functions_teclas();
    field_formula();
    mouse_hover_info();
    clean_fields();
    loadCode();
    butons_enc();
//    select_marge();
//    complete_td();
//    $("#body_contain").bind({
//        copy: function() {
//            alert("¡Has copiado!");
//        },
//        paste: function() {
//            alert("¡Has pegado!");
//        },
//        cut: function() {
//            alert("¡Has cortado!");
//        }
//    });
    $(".botonExcel").click(function(event) {
        downloadExcel();
    });
    $(".styles").click(function() {
        var c = $(this).attr("tipo");
        styles(c);
    });
    $("#color_fuente").change(function() {
        var c = $(this).attr("tipo");
        styles(c);
    });
    remove_loading();
});
function styles(css) {
    var div = $(".td_selected");
    if (css == "negrilla")
        div.css("font-weight", "bold");
    if (css == "borde")
        div.css("border", "1px solid #000");
    if (css == "cleanformat") {
        div.text(div.text());
        div.attr("style", "");
        div.attr("func", "");
    }
    if (css == "color_fuente") {
        var color = $("#color_fuente").val();
        div.css("color", color);
    }
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
    $("#datos_a_enviar").val($("<div>").append($("table").first().eq(0).clone()).html());
    $("#FormularioExportacion").submit();
    setTimeout(function() {
        window.location.reload();
    }, 2000);
}
//function op() {
//    
//}
//function select_marge() {
//    $(".td_all").mousedown(function(e) {
//        if (e.which == 3) {
//            selec_varios_row = "NO";
//            return false;
//        }
//        selec_varios_row = "SI";
//        var div = $(this).attr("id");
//        $("#" + div).addClass("select_rows_marge");
//        $(".td_all").mouseenter(function() {
//            if (selec_varios_row == "SI") {
//                var div = $(this).attr("id");
//                $("#" + div).addClass("select_rows_marge");
//                $("#" + div).attr("select_rows_marge", "true");
//            }
//        });
//    });
//    $(".td_all").mouseup(function() {
////        var totalSelectedMage = $(".select_rows_marge").length;
////        if (totalSelectedMage > 1) {
//        selec_varios_row = "NO";
////        }
//    });
//}
function remove_select_marge() {
    selec_varios_row = "NO";
    $("*").removeClass("select_rows_marge");
}
function share_file() {
    var id = $("#form_general").attr("data-id");
    var name = $("#name_file").val();
    var url = window.location.href;
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/src/permisos.php",
        type: 'post',
        data: {id: id, url: url},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $("<div calss='popup_gen'>" + data + "</div>").dialog({
                title: 'Compartir Archivo',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: '300',
                width: '500',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                },
                buttons: {
                    'Aceptar': function() {
                        save_permisos();
                    },
                    'Cancelar': function() {
                        $(this).dialog('close');
                        $(this).empty();
                    }
                }
            });
        }
    });
}
function save_permisos() {
    var id = $("#form_general").attr("data-id");
    var acceso = $("#acceso").val();
    var permisos = $("#permisos").val();
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save_permisos.php",
        type: 'post',
        data: {id: id, acceso: acceso, permisos: permisos},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
            return;
        },
        success: function(data) {
            alert(data);
            $(".ui-dialog").remove();
        }
    });
}
function create_variable_global() {
    var div = $(".td_selected");
    div.attr("var-global", "true");
    div.addClass("varGlobal");
}
function remove_variable_global() {
    var div = $(".td_selected");
    div.attr("var-global", "false");
    div.removeClass("varGlobal");
}
function CopyToClipboard() {
//    var CopiedTxt = document.selection.createRange();
//    console.log(CopiedTxt);
//    CopiedTxt.execCommand("Copy");
//    $("#body_contain").bind({
//        copy: function() {
//            alert("¡Has copiado!");
//        },
//        paste: function() {
//            alert("¡Has pegado!");
//        },
//        cut: function() {
//            alert("¡Has cortado!");
//        }
//    });
}
function butons_enc() {
    var especial = $(".th_rows");
    var columna = $(".column_enc");
    $(".td_all").mousedown(function(e) {
//    $(".td_all").bind("contextmenu", function(e) {
//1: izquierda, 2: medio/ruleta, 3: derecho
        var self = this;
        if (e.which == 1) {
            selec_varios_row = "SI";
//            var totalSelectedMage = $(".select_rows_marge").length;
//            if (totalSelectedMage > 0) {
            var div = $(this).attr("id");
            $("#" + div).addClass("select_rows_marge");
//            }

//            $(".td_all").mouseenter(function() {
//                var data = $(this).attr("id");
//                $(".field_footer").text(data);
//                field_hover = data;
//                if (selec_varios_row == "SI") {
//                    var div = $(this).attr("id");
//                    $("#" + div).addClass("select_rows_marge");
//                    $("#" + div).attr("select_rows_marge", "true");
//                }
//            });
        }
        if (focus_igual == "NO") {
            if (selec_varios_row == "NO") {
                selected_field(this);
            }
        } else
        if (focus_igual == "SI") {
            selected_field_focus(this);
        }
        if (e.which == 3) {
            removeContextMenu();
//            selec_varios_row = "NO";
            var data = $(self).attr("name");
            var type = "celda";
            var x = e.pageX;
            var y = e.pageY;
            menuContextObjects(data, type, x, y);
        }
//        td_all_click(this);
    });
    $(".td_all").mouseup(function() {
        selec_varios_row = "NO";
    });
    $(".td_all").mouseenter(function() {
        var id = $(this).attr("id");
        var data = "ID: " + id;
        data += " - Class: " + $(this).attr("class");
        data += " - Value: " + $(this).text();
        $(".field_footer_show").text(data);
        $(".field_footer").text(id);
//        field_hover = data;
        field_hover = id;
        if (selec_varios_row == "SI") {
            var div = $(this).attr("id");
            $("#" + div).addClass("select_rows_marge");
            $("#" + div).attr("select_rows_marge", "true");
        }
    });
    especial.bind("contextmenu", function(e) {
        var self = this;
        var select = $(this).attr("row_selected");
        var data = $(self).attr("name");
        var type = "columna_principal";
        var x = e.pageX;
        var y = e.pageY;
        if (select == "selected") {
            menuContextObjects(data, type, x, y);
        } else {
            selected_row(self.id);
            menuContextObjects(data, type, x, y);
        }
    });
    columna.bind("contextmenu", function(e) {
        var self = this;
        var select = $(this).attr("row_selected");
        var data = $(self).attr("name");
        var type = "columna";
        var x = e.pageX;
        var y = e.pageY;
        if (select == "selected") {
            menuContextObjects(data, type, x, y);
        } else {
            selected_row(self.id);
            menuContextObjects(data, type, x, y);
        }
    });
    especial.click(function() {
        selected_row(this.id);
    });
    columna.click(function() {
        selected_row(this.id);
    });



}
function selected_row(id) {
    unselected_row();
    console.log(id);
    $(".trtr_" + id).addClass("row_selected");
    $(".trtr_" + id).addClass("row_selected_enc");
    $(".row_enc_" + id).addClass("row_selected");
    $(".row_selected").attr("row_selected", "selected");

    $("#" + id).addClass("row_selected");
    $("#" + id).addClass("row_selected_enc");
//    $(".tdnw_" + id).addClass("row_selected");
    var total_td = $(".th_rows").length;
    for (var i = 0; i < total_td; i++) {
//        console.log(id);
        console.log(id + i);
        $("#" + id + i).addClass("row_selected");
//        $("#" + id).addClass("row_selected");
    }
}
function unselected_row() {
    if (control_pulsado == "NO") {
        $(".trtr").removeClass("row_selected");
        $(".trtr").removeClass("row_selected_enc");
        $(".th_rows").removeClass("row_selected");
        $(".row_selected").removeClass("row_selected");
        $(".row_selected").removeClass("row_selected_enc");
        $(".row_selected").attr("row_selected", "false");

        $("td").removeClass("row_selected");
        $("tr").removeClass("row_selected");
        $("th").removeClass("row_selected");
        $("td").removeClass("row_selected_enc");
        $("tr").removeClass("row_selected_enc");
        $("th").removeClass("row_selected_enc");
    }
}
function menuContextObjects(data, type, x, y) {
    if (habilitar_inspectelement == "SI") {
        return;
    }
    $(".contextmenu").remove();
    var totalSelected = $(".row_selected").length;
    var totalSelectedMage = $(".select_rows_marge").length;
    var totalColumnas = $(".row_selected_enc").length;
    var html = "<div class='contextmenu' style='left: " + x + "px; top: " + y + "px;' >";
    html += "<div class='contextmenuIntern'>";
    if (type == "columna_principal") {
        if (totalColumnas <= 1) {
            html += "<div class='contextmenuButtons ' type='add'  >Agregar Fila</div>";
        }
        html += "<div class='contextmenuButtons'   type='delete' >Eliminar fila(s) seleccionada(s)</div>";
    } else
    if (type == "columna") {
        if (totalColumnas <= 1) {
            html += "<div class='contextmenuButtons ' type='addColumn'  >Agregar Columna</div>";
        }
        html += "<div class='contextmenuButtons'   type='delete' >Eliminar columna(s) seleccionada(s)</div>";
    }
    else
    if (type == "celda") {
        var div = $(".td_selected");
        if (div.attr("var-global") == "true") {
            html += "<div class='contextmenuButtons ' type='variableRemove'  >Remover variable global</div>";
        } else {
            html += "<div class='contextmenuButtons ' type='variable'  >Crear variable global</div>";
        }
        html += "<div class='contextmenuButtons ' type='format'  >Formato Money</div>";
        if (totalSelectedMage > 1) {
            html += "<div class='contextmenuButtons ' type='mergecells'  >Combinar Celdas</div>";
        }
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
            formatCelda();
            removeContextMenu();
        }
    });
    removeContextMenu();
    return false;
}
var formatNumber = {
    separador: ".", // separador para los miles
    sepDecimal: ',', // separador para los decimales
    formatear: function(num) {
        num += '';
        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
        return this.simbol + splitLeft + splitRight;
    },
    new : function(num, simbol) {
        this.simbol = simbol || '';
        return this.formatear(num);
    }
}
function formatCelda() {
    var div = $(".td_selected");
    var value = div.text();
    console.log(value);
//    div.mask("999,999,999.99");
    var num = formatNumber.new (value, "$");
//    var num = '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    div.text(num);
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
function addCeldas() {
    var total_td = $(".column_enc").length;
    var html = "<tr>";
    for (var i = 0; i < total_td; i++) {
        html += "<td></td>";
    }
    html += "</tr>";
    $(".row_selected_enc").before(html);
    reinitAll();
}
function delete_celdas() {
    $(".row_selected").remove();
    reinitAll();
}
function reinitAll() {
    $(".th_enc").remove();
    $(".field_enc").remove();
    file_ya_existe = "";
    tr();
    loadInitial("pasa");
    butons_enc();
    file_ya_existe = $("#name_file").val();
}
function code() {
    var id = $("#form_general").attr("data-id");
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/src/load_code.php",
        type: 'post',
        data: {id: id},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            var html = "<h2>Código Javascript de Funciones</h2>< script ><textarea class='code_text' name='code_text' id='code_text' >" + data + "</textarea>< / script >";
            $("<div class='div_code'>" + html + "</div>").dialog({
                title: 'Guardar',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: '650',
                width: '800',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                },
                buttons: {
                    'Aceptar': function() {
                        save_code();
                    },
                    'Cancelar': function() {
                        $(this).dialog('close');
                        $(this).empty();
                    }
                }
            });
        }
    });
}
function codeCss() {
    var id = $("#form_general").attr("data-id");
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/src/load_code_css.php",
        type: 'post',
        data: {id: id},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            var html = "<h2>Código CSS</h2>< style ><textarea class='code_text' name='code_text' id='code_text' >" + data + "</textarea>< / style >";
            $("<div class='div_code'>" + html + "</div>").dialog({
                title: 'Guardar',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: '650',
                width: '800',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                },
                buttons: {
                    'Aceptar': function() {
                        save_code_css();
                    },
                    'Cancelar': function() {
                        $(this).dialog('close');
                        $(this).empty();
                    }
                }
            });
        }
    });
}
function save_code_css() {
    var id = $("#form_general").attr("data-id");
    var code_css = $("#code_text").val();
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save_code_css.php",
        type: 'post',
        data: {id: id, code_js: code_css},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
            } else {
                $(".div_code").dialog('close');
                $(".div_code").empty();
                loadCode();
            }
        }
    });
}
function save_code() {
    var id = $("#form_general").attr("data-id");
    var code_js = $("#code_text").val();
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save_code.php",
        type: 'post',
        data: {id: id, code_js: code_js},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
            } else {
                $(".div_code").dialog('close');
                $(".div_code").empty();
                loadCode();
            }
        }
    });
}
function loadCode() {
    var id = $("#form_general").attr("data-id");
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/src/execute_code.php",
        type: 'post',
        data: {id: id},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
//    console.log()
            $("#contain_code_js").html(data);
        }
    });
}
function field_get(div, data) {
    $("#" + div).html(data);
    $("." + div).html(data);
}
function vista_previa() {
    $("head").after("<div class='css_vista_previa'><link href='" + carpeta + "css/vista_previa.css' rel='stylesheet' type='text/css' charset='utf-8' /></div>");
//    $(".th_rows").addClass("display_none");
//    $(".th_enc").addClass("display_none");
//    $(".formulas_enc").addClass("display_none");
//    $("#footer").addClass("display_none");
//    $("html").addClass("show_normal");
//    $("body").addClass("show_normal");
//    $(".enc_print").addClass("show_normal");
//    $("#contenedor").addClass("show_normal");
//    $("#form_general").addClass("show_normal");
//    $("#body_contain").addClass("show_normal");
//    $("#body_contain").addClass("show_hidden_overflow");
//    $("td").addClass("td_normal");
//    $("tr").addClass("td_normal");
//    $(".divisor_page").addClass("divisor_page_vista_previa");
//    $(".varGlobal").addClass("varGlobalNo");
}
function cancel_print() {
    $(".css_vista_previa").remove();
//    $(".th_rows").removeClass("display_none");
//    $(".th_enc").removeClass("display_none");
//    $(".formulas_enc").removeClass("display_none");
//    $("#footer").removeClass("display_none");
//    $("html").removeClass("show_normal");
//    $("body").removeClass("show_normal");
//    $(".enc_print").removeClass("show_normal");
//    $("#contenedor").removeClass("show_normal");
//    $("#form_general").removeClass("show_normal");
//    $("#body_contain").removeClass("show_normal");
//    $("#body_contain").removeClass("show_hidden_overflow");
//    $("td").removeClass("td_normal");
//    $("tr").removeClass("td_normal");
//    $(".divisor_page").removeClass("divisor_page_vista_previa");
//    $(".varGlobal").removeClass("varGlobalNo");
}
function print_document() {
    window.print();
}
function save() {
    createLoading();
    //SACO VARIABLES GLOBALES, ID PLANTILLA, OTROS
    var id = $("#form_general").attr("data-id");
    var plantilla = $("#form_general").attr("data-plantilla");
    var guardar = $("#form_general").attr("data-guardar");
    //GUARDO LAS VARIABLES GLOBALES PRIMERO O PUEDE SER DE ÚLTIMO
    var global = $(".varGlobal");
    var t_globals = global.length;
    if (t_globals > 0) {
        //ELIMINO TODAS LAS VARIABLES DE LA HOJA
        $.ajax({
            url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/delete_variables_globales.php",
            type: 'post',
            data: {hoja: id},
            error: function() {
                console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
            },
            success: function(data) {
                if (data != "") {
                    alert("Error al borrar variables. data: " + data);
                    return;
                }
            }
        });
        //GUARDO LAS VRIABLES DE LA HOJA
        for (var g = 0; g < t_globals; g++) {
            var dat = $(global[g]).text();
            $.ajax({
                url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save_variables_globales.php",
                type: 'post',
                data: {hoja: id, nombre: dat},
                error: function() {
                    console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    if (data != "") {
                        alert("Error al guardar variables. data: " + data);
                        return;
                    }
                }
            });
        }
    }

    $(".th_enc").remove();
    $(".th_rows").remove();
    var texto = $("#body_contain").html();
    var nombre = $("#nombre").val();
    var tipo = $("#tipo").val();
    if (nombre == undefined) {
        nombre = "";
    }
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save.php",
        type: 'post',
        data: {id: id, texto: texto, nombre: nombre, tipo: tipo, plantilla: plantilla, guardar: guardar},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            var de = data.split("||");
            if (de[0] == "error") {
                alert(data);
            } else {
                alert("Guardado correctamente");
//                console.log(data);
//                return;
                window.location = data;
            }
        }
    });
}
function guardar_como() {
    var name = $("#name_file").val();
    var html = "";
    html += "<h2>Nombre del archivo</h2>";
    html += "<input type='text' name='nombre' id='nombre' value='" + name + "' />";
    html += "<p><br />Opciones Avanzadas";
    html += "<p>Tipo: <select name='tipo' id='tipo'>";
    html += "<option value='normal'>Normal</value>";
    html += "<option value='plantilla'>Plantilla</value>";
    html += "</select></p>";
    $("<div>" + html + "</div>").dialog({
//        position: 'top',
        title: 'Guardar',
        stack: true,
        autoOpen: true,
        resizable: false,
        modal: true,
        height: '300',
        width: '500',
        sticky: true,
        close: function() {
            $(this).empty();
            $(this).dialog('destroy');
        },
        buttons: {
            'Aceptar': function() {
                validate_doc();
            },
            'Cancelar': function() {
//                $(".container").removeClass("efectBlur");
                $(this).dialog('close');
//                        $(this).dialog('destroy');
                $(this).empty();
            }
        }
    });
}
function validate_doc() {
    $(".error").remove();
    if ($("#nombre").val() == "") {
        $("#nombre").after("<span class='error'>Debe poner un nombre al documento</span>");
        $("#nombre").focus();
        $("#nombre").keydown(function() {
            $(".error").remove();
        });
        return;
    }
    save();
}
function detecta_fecha(data) {
    var f = new Date();
//    var f = new Date('8/24/2009');
//    var f = new Date('2015-05-14');
    data = data.replace(/-/gi, "/");
    var f = new Date(data);
    if (data == 1) {
        return false;
    }
    if (f == "Invalid Date") {
        return false;
    }
    var error = 0;
    var year = f.getFullYear();
    var day = f.getDate();
    var month = f.getMonth() + 1;
    var splot_data = data.split("/");
    var date_format = year + "-" + splot_data[1] + "-" + day;
    //compruebo el año
    if (splot_data[0] == year || splot_data[2] == year) {
        error = 1;
    } else {
        error = 0;
    }
    //COMPRUEBO EL MES
    if (splot_data[1] == month) {
        error = 1;
    } else {
        error = 0;
    }
    //COMPRUEBO EL DÍA
    if (splot_data[2] == day || splot_data[0] == day) {
        error = 1;
    } else {
        error = 0;
    }
    if (error == 1) {
        return date_format;
    } else {
        return false;
    }
}
function selected_other_field(t) {
    var val = $(".td_selected").text();
    if (val == "=") {
        focus_igual = "SI";
        return false;
    }
}
function selected_field_focus() {
    var div = $(".td_selected");
    if (field_hover == div.attr("id")) {
        return false;
    }
//    console.log(field_hover);
    div.append("(" + field_hover + ")");
//    div.focus();
}
function fecha_actual() {
    var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    var f = new Date();
    var date = f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
    return date;
}
function pone_fecha_actual(div, func) {
    var date = fecha_actual();
    $(div).attr("func", func);
    $(div).text(date);
}
function mouse_hover_info() {
//    $(".td_all").mouseenter(function() {
//        var data = $(this).attr("id");
//        $(".field_footer").text(data);
//        field_hover = data;
//    });
}
function letras() {
    var letra = {};
    letra[0] = "A";
    letra[1] = "B";
    letra[2] = "C";
    letra[3] = "D";
    letra[4] = "E";
    letra[5] = "F";
    letra[6] = "G";
    letra[7] = "H";
    letra[8] = "I";
    letra[9] = "J";
    letra[10] = "K";
    letra[11] = "L";
    letra[12] = "M";
    letra[13] = "N";
    letra[14] = "O";
    letra[15] = "P";
    letra[16] = "Q";
    letra[17] = "R";
    letra[18] = "S";
    letra[19] = "T";
    letra[20] = "U";
    letra[21] = "V";
    letra[22] = "W";
    letra[23] = "X";
    letra[24] = "Y";
    letra[25] = "Z";
    return letra;
}
function loadInitial(d) {
    $("td").addClass("td_all");
    if (d != "pasa") {
        $(".td_all").dblclick(function() {
            td_all_dblclick(this);
        });
    }
    var id_get = $("#form_general").attr("data-id");
    if (id_get == "") {
        $(".td_all").removeClass("td_selected");
        $("#A0").addClass("td_selected");
    }
    if (d != "pasa") {
        $(".td_all").mousedown(function() {
            td_all_click(this);
        });
    }
    values();
}
function td_all_dblclick(d) {
//    var self = this;
    var self = d;
    $(".td_all").attr("contenteditable", "false");
    $(".td_all").attr("edit", "false");
    $(self).attr("contenteditable", "true");
    $(self).addClass("td_editing");
    $(self).attr("edit", "true");
    var func = $(self).attr("func");
    if (func != "" && func != undefined) {
        $(self).text(func);
    }
    $(self).focus();
}
function td_all_click(d) {
    //    var self = this;
    var self = d;
    $(".contextmenu").remove();
    if (focus_igual == "NO") {
        selected_field(self);
    } else
    if (focus_igual == "SI") {
//        selected_field_focus(self);
    }
}
function active_functions_teclas() {
    $(document).keyup(function(tecla) {
        var t = tecla.keyCode;
        selected_other_field(t);
        if (t == 17) {
            control_pulsado = "NO";
        }
    });
    celdadigita = "";
    $(document).keydown(function(tecla) {
        var t = tecla.keyCode;
//        console.log(t);
        //AL DIGITAR BORRO EL TEXTO ANTERIOR SI NO SON LAS SIGUIENTES TECLAS
        if (t != 37 && t != 38 && t != 39 && t != 40 && t != 17 && t != 9 && t != 20 && t != 16 && t != 18 && t != 91 && t != 225 && t != 93 && t != 36 && t != 33 && t != 34 && t != 35 && t != 113) {
            if (celdadigita != $(".td_selected").attr("id")) {
                console.log("digita entra");
                $(".td_selected").text(" ");
            }
        }
        celdadigita = $(".td_selected").attr("id");
//        document.getElementById('form_general').scrollTop = 0;
//        document.getElementById('form_general').scrollLeft = 0;
//        $("#form_general").animate({scrollTop: "0px", scrollLeft: "0px"}, 10);
        if (t == 17) {
            control_pulsado = "SI";
        }
        if (control_pulsado == "NO") {
            tecla_enter(t);
        }
        if (edit_field == "NO") {
            teclasMover(t);
        } else {
            move_fields(t);
        }
    });
}
function move_fields(t) {
    if (focus_formula == "NO") {
        if (edit_field == "NO") {
//        t != 37 && t != 38 && t != 39 && t != 40 && 
            if (t != 13 && t != 17 && t != 18 && t != 91 && t != 16 && t != 20 && t != 9 && t != 33 && t != 34 && t != 225 && t != 93 && t != 112 && t != 114 && t != 115 && t != 116 && t != 117 && t != 118 && t != 119 && t != 120 && t != 121 && t != 122 && t != 123) {
                var div = $(".td_selected");
                $(".td_all").attr("contenteditable", "false");
                $(".td_all").attr("edit", "false");
                div.attr("contenteditable", "true");
                div.addClass("td_editing");
                div.attr("edit", "true");
                var func = div.attr("func");
                if (func != "" && func != undefined) {
                    div.text(func);
                }
                div.focus();
                edit_field = "SI";
            }
        }
    }
}
function tecla_enter(t) {
    if (t == 13) {
        var col = $(".td_selected").attr("id");
        var text = $(".td_selected").text();
        eval_values("#" + col, text);
        values();
        $(".td_all").attr("edit", "false");
        $(".td_all").attr("contenteditable", "false");
        $(".td_all").removeClass("td_editing");
        focus_igual = "NO";
        edit_field = "NO";
        move_left_right_top_down("down");
        return false;
    }
}
function field_formula() {
    $("#formulas").keyup(function(tecla) {
        var value = $(this).val();
        var div = $(".td_selected");
        var s = value.split("=");
        //COMPRUEBO SI LO QUE DIGITO EN EL INPUT CONTIENE FORMULA Y LA ESCRIBO EN EL FUNC DEL TD_SELECTED
        if (s[0] == "") {
            div.attr("func", value);
        }
        div.text(value);
    });
    $("#formulas").focusin(function() {
        $(this).css("background-color", "#FFFFCC");
        focus_formula = "SI";
    });
    $("#formulas").focusout(function() {
        $(this).css("background-color", "#FFFFFF");
        focus_formula = "NO";
    });
}
function selected_field(div) {
    unselected_row();
//    var totalSelectedMage = $(".select_rows_marge").length;
//    if (totalSelectedMage > 1) {
//        if (selec_varios_row == "SI") {
//        return false;
//        }
//    }
    var edit = $(div).attr("edit");
    var select_rows_marge = $(div).attr("select_rows_marge");
    if (edit == "true") {
        return false;
    }
//    var div_action = $(".td_all");
    var div_action = $(".td_selected");
    var col = div_action.attr("id");
    var text = div_action.text();
//    eval_values("#" + col, text);
    div_action.attr("edit", "false");
    div_action.attr("contenteditable", "false");
    div_action.removeClass("td_editing");
    div_action.removeClass("td_selected");
    $(div).addClass("td_selected");
    var letter = $(div).attr("letra-columna");
    var fila = $(div).attr("id-fila");
    $(".field_enc").removeClass("enc_selected");
    $("#" + letter).addClass("enc_selected");
    $(".row_enc_" + fila).addClass("enc_selected");
//    $(div).focus();
    var val = "";
    val = $(div).text();
    var id = $(div).attr("id");
    if (val == "") {
        val = $(div).val();
    }
    var func = $(".td_selected").attr("func");
    if (func != "" && func != undefined) {
        $("#formulas").val(func);
    } else {
        $("#formulas").val(val);
        $(div).removeAttr("func");
    }
    $("#selection").val(id);
    edit_field = "NO";
    if (selec_varios_row == "NO") {
        if (select_rows_marge != "true") {
            remove_select_marge();
        }
    }
//    values();
}
function teclasMover(t) {
    var left = 37; //derecha
    var right = 39; //izquierda
    var top = 38; //arriba
    var down = 40; //abajo
    if (t == down) {
        move_left_right_top_down("down");
    } else
    if (t == top) {
        move_left_right_top_down("top");
    } else
    if (t == right) {
        move_left_right_top_down("right");
    } else
    if (t == left) {
        move_left_right_top_down("left");
    }
    else {
        move_fields(t);
    }
    return false;
}
function move_left_right_top_down(dir) {
    var col = $(".td_selected").attr("id-columna");
    var fila = $(".td_selected").attr("id-fila");
    var row = "";
    var letter = "";
    if (dir == "right") {
        letter = letras()[parseInt(col) + 1];
        row = parseInt(fila);
        $("#form_general").scrollLeft($("#form_general").scrollLeft() - 150);
    }
    if (dir == "left") {
        if (col <= 1) {
            col = 1;
        }
        if (col == undefined) {
            col = 1;
        }
        letter = letras()[parseInt(col) - 1];
        row = parseInt(fila);
    }
    if (dir == "top") {
        if (fila <= 1) {
            fila = 1;
        }
        if (fila == undefined) {
            fila = 1;
        }
        letter = $(".td_selected").attr("letra-columna");
        row = parseInt(fila) - 1;
        console.log($("#form_general").scrollTop());
        $("#form_general").scrollTop($("#form_general").scrollTop() + 40);
    }
    if (dir == "down") {
        letter = $(".td_selected").attr("letra-columna");
        row = parseInt(fila) + 1;
        $("#form_general").scrollTop($("#form_general").scrollTop() - 40);
    }
    $(".td_all").attr("edit", "false");
    $(".td_all").attr("contenteditable", "false");
    $(".td_all").removeClass("td_editing");
    $(".td_all").removeClass("td_selected");
    var newcampo = "#" + letter + row;
    selected_field(newcampo);
}
function validarSiNumero(numero) {
    if (!/^([0-9])*$/.test(numero)) {
        return false;
    } else {
        return true;
    }
    return false;
}
function tr() {
    $("tr").removeAttr("class");
    $("tr").addClass("trtr");
    var div = $("tr");
    var total_td = $(div).length;
    //LE PONGO A TODAS LAS FILAS EL ID EN NÚMERO
    for (var i = 0; i < total_td; i++) {
        var let = i;
        var d = div[i];
        d.id = let;
        $(d).addClass("trtr_" + i);
    }
    var t_columns = $("#0 > td").length;
    var html = "";
    var fixedc = "";
    //CREO LAS COLUMNAS CON LETRAS
    html = "<tr class='th_enc'>";
    for (var a = -1; a < t_columns + 10; a++) {
        var letter = letras()[a];
        if (letter == undefined) {
            letter = "";
            fixedc = "";
        } else {
            fixedc = "<div class='fixed_column' data='" + letter + "' ></div>";
        }
        html += "<th id='" + letter + "' class='column_enc field_enc'><div class='name_enc_column' >" + letter + "</div>" + fixedc + "</th>";
//        html += "<th id='" + letter + "' class='column_enc field_enc'>" + letter + "</th>";
    }
    html += "</tr>";
    td();
    $("#0").before(html);



//    $(".fixed_column").mousedown(function() {
//        fixed_column = true;
//    });
//    $(".fixed_column").mouseleave(function() {
//        fixed_column = false;
//    });
//    $('.fixed_column').resizable({
//        stop: function(event, ui) {
//            $('.fixed_column').height(ui.originalSize.height);
//        }
//    });
    $(".fixed_column").resizable({
        // Handles left right and bottom right corner
        handles: 'e, w, se',
        // Remove height style
        resize: function(event, ui) {
            $(this).css("height", '');
            var id = $(this).attr("data");
            var w = $(this).width();
            $("#" + id).width(w);
            $("#" + id + "0").width(w);
            $(".fixed_column_td" + id).width(w);
        }
    });

//    $(".th_rows").resizable();
    $(".th_rows").resizable({
        // Handles left right and bottom right corner
        handles: 'e, w, se',
        // Remove height style
        resize: function(event, ui) {
            $(this).css("width", '');
            var id = this.id;
            var w = $(this).height();
//            $(".fixed_column_td" + id).remove();
            $(".fixed_column_td" + id).first().height(w);
        },
        stop: function(event, ui) {
//            alert("fdsfdsa");
//            var id = this.id;
//            var fix = "<div class='fixed_column_td fixed_column_td" + letter + " fixed_column_td" + id + " '  ></div>";
//                    $(".fixed_column_td" + id).remove();
//            $(this).append(fix);
        }
    });
//    $(".column_enc").resizable();
//    $(".fixed_column").resize(function() {
//        fixedColumn(this);
//    });
//    $(".fixed_column").mousemove(function() {
//        fixedColumn(this);
//    });
}
function td() {
//    return;
    var div = $("tr");
    var total_td = $(div).length;
    var existe = $(".th_enc").length;
//    $(".fixed_column_td").remove();
    var fix = "";
    if (existe == 0) {
        var num = 0;     //SACO TODAS LAS FILAS EXISTENTES
        for (var i = 0; i < total_td; i++) {
            var d = div[i];
            var id = d.id;
            var div_filas = $("#" + id + " > td");
            var total_filas = div_filas.length;
            //POR CADA FILA EXISTENTE  LE PONGO EL ID A CADA COLUMNA O CAMPO
            for (var a = 0; a < total_filas + 10; a++) {
                var c = div_filas[a];
                var letter = letras()[a];
                if (c != undefined) {
                    c.id = letter + id;
                    //AGREGO DIV PARA EL ANCHO DE COLUMNA
//                    var w_fixtd = $(".fixed_column_td" + letter).width();
//                    console.log(w_fixtd);
//                    fix = "<div class='fixed_column_td fixed_column_td" + letter + " fixed_column_td" + id + " ' style='width: " + w_fixtd + "px ' ></div>";
                    fix = "<div class='fixed_column_td fixed_column_td" + letter + " fixed_column_td" + id + " '  ></div>";
//                    $(".fixed_column_td" + id).remove();
                    $(c).append(fix);
                    if (file_ya_existe == "") {
                        $(c).attr("letra-columna", letter);
                        $(c).attr("id-columna", a);
                        $(c).attr("id-fila", id);
//                        var uniq = Math.random();
                        var uniq = Math.floor((Math.random() * 10000000) + 1);
                        if ($(c).attr("unique") == undefined) {
//                            $(c).attr("unique", "unique" + uniq);
                            $(c).attr("unique", "SI");
                            $(c).addClass("tdunique_" + uniq);
                        }
                    }
                    //COMPRUEBO PARA CREAR LAS PRIMERAS FILAS CON NÚMEROS
                    if (a == 0) {
                        var html = "<th class='th_rows field_enc row_enc_" + num + "' id='" + num + "' >" + num + "</th>";
                        num++;
                        $("#" + c.id).before(html);
                    }
                }
            }
        }
    }
}
function values() {
    var div = $(".td_all");
    var total_td = $(div).length;
    for (var i = 0; i < total_td; i++) {
        var d = div[i];
        var text = $(d).text();
        var data = $(d).attr("func");
        var col = $(d).attr("id");
        var num = validarSiNumero(text);
        if (data != "" && data != undefined) {
            eval_values(d, "", data);
        }
        else
        if (num == true) {
            eval_values("#" + col, text);
        } else {
            eval_values(d, text);
        }
    }
}
function eval_values(d, data, funct) {
    var str = $(d).text();
    if (funct != "" && funct != undefined) {
        str = funct;
    }
    if (str == "fecha_actual()") {
        pone_fecha_actual(d, str);
        return;
    }
    var exp = str.split("=");
    var igual = exp[1];
    var primerBlanco = /^ /;
    var ultimoBlanco = / $/;
    var variosBlancos = /[ ]+/g;
    var texto = str;
    texto = str.replace(variosBlancos, " ");
    texto = texto.replace(primerBlanco, "");
    texto = texto.replace(ultimoBlanco, "");
    str = texto;
    var primer_caracter = str.charAt(0);
    if (primer_caracter == "=") {
        var newfunc = igual;
        $(d).attr("func", false);
        $(d).attr("func", "=" + igual);
        var separate = newfunc.split(")");
        if (separate.length > 1) {
            //DETECTO SI ES UN SOLO CAMPO Y NO HAGO OPERACIÓN, SOLO MUESTRO SU VALOR
            if (separate[1] == "") {
                var out = separate[0].split("(");
                var dd = $("#" + out[1]).text();
                if (dd == "") {
                    dd = "0";
                }
                eval_operations(d, dd, "SI");
                return;
            }
            for (var s = 0; s < separate.length; s++) {
                var val = separate[s];
                if (val != "") {
                    var out = val.split("(");
                    for (var i = 0; i < out.length; i++) {
                        if (i != 0) {
                            var id = $("#" + out[i]).text();
                            console.log(id);
                            var texto = id;
                            var texto = texto.replace(variosBlancos, " ");
                            texto = texto.replace(primerBlanco, "");
                            texto = texto.replace(ultimoBlanco, "");
                            if (texto != "" && id != undefined && id != "") {
                                var val_real = $("#" + out[i]).text();
                                val_real = val_real.replace(/[^-()\d/*+.]/g, '');
                                if (val_real == "") {
                                    val_real = 0;
                                }
                                str = str.replace(out[i], val_real);
                            } else {
                                var val_real = "0";
                            }
                            str = str.replace(out[i], val_real);
                            console.log(out[i]);
                        }
                    }
                }
            }
        }
        console.log(str);
        eval_operations(d, str, true);
    } else {
        eval_operations(d, data);
    }
}
function tiene_letras(texto) {
    texto = texto.toLowerCase();
    for (i = 0; i < texto.length; i++) {
        if (letras.indexOf(texto.charAt(i), 0) != -1) {
            return true;
        }
    }
    return false;
}
function eval_operations(d, text, unfield) {
    if (text != "" && text != undefined) {
        if (unfield == "SI") {
            $(d).html(text);
            return;
        }
        var date_sino = detecta_fecha(text);
        if (date_sino == false) {
            if (unfield == true) {
                text = text.replace(/=/gi, "");
                text = text.replace(/,/gi, ".");
                text = text.replace(/[^-()\d/*+.]/g, '');
                //                text = text.replace(/./gi, ",");
                //                text = text.replace(/,/gi, "");
//                text = text.replace(".", "");
                //                var probar = $("#" + text).text();
//                console.log(probar);
//                console.log(tiene_letras(text));
                console.log(text);
                if ($.isNumeric(text) == false) {
                    //                    var result = parseInt(eval(text));
                    var result = eval(text).toFixed(2);
                    //                    var result = eval(text);
                    //                    var result = text;
                    console.log(result);
                    if (result == "Infinity" || result == "NaN") {
                        $(d).html("0");
                        return;
                    }
                    $(d).html(result);
                }
//                    $(d).html(text);
            } else { //                $(d).html(eval("text"));
                //                $(d).text(text);
            }
        }
        else {
            $(d).html(date_sino);
        }
    }
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