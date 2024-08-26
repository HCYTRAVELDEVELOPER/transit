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
select_text = "NO";
context_menu = "NO";
//VERSIÓN INICIAL PARA CLARO - NO CONTIENE COLUMNAS Y FILAS PRINCIPALES ESTÁTICAS
// INICIA EN 0 LAS FILAS Y NO MUEVEN LAS TECLAS FLECHAS EL SCROLL
initBucle = 0;
//HACE TODO LO ANTERIOR
//initBucle = 1;

///////////////////////////NUEVAS TABLAS CON DIVS EN PRUEBAS FALSE//////////////////
testdivs = false;
//testdivs = true;

$(document).ready(function() {
    var altoFormulas = $(".formulas_enc").height();
    anchoBodySum = $("#contenedor").width();
    anchoBodySumInit = $("#contenedor").width();
    altoBodySumInit = $("#contenedor").height();
    altoBodySumInit = altoBodySumInit - altoFormulas - 30;
//    altoBodySum = $("#contenedor").height();
    altoBodySum = altoBodySumInit;
    altoDocument();
    $(window).resize(function() {
        altoDocument();
    });
    file_ya_existe = $("#name_file").val();
    var permisos = $("#form_general").attr("permisos");
    if (permisos == "lectura") {
        $("head").after("<div class='css_vista_previa'><link href='" + carpeta + "css/solo_lectura.css' rel='stylesheet' type='text/css' charset='utf-8' /></div>");
        $(document).keyup(function(tecla) {
            return false;
        });
    }
    document.onselectstart = function() {
        if (select_text == "NO")
            return false;
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
    $(".botonExcel").click(function(event) {
        downloadExcel();
    });
    $(".styles").click(function() {
        var c = $(this).attr("tipo");
        compruebaSelected(styles, c);
    });
    $(".colorButton").change(function() {
        var c = $(this).attr("tipo");
        compruebaSelected(styles, c);
    });
    tr();
//    if (testdivs) {
//        replaceNewDivs();
//        addClassNewDivs();
//    }
    loadInitial();
    active_functions_teclas();
    field_formula();
    mouse_hover_info();
    clean_fields();
//    loadCode();
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
//    values();
//    $(".column_enc").click(function() {
//        if ($(this).attr("id") == "") {
//            select_varias_celdas($("td"));
//        }
//    });
    $(".execute_functionQXNW").click(function() {
        execute_functionQXNW();
    });

    $(".objectFloatAbsolute").draggable();
    $(".objectFloatAbsolute").resizable();
//    $(".draggable").draggable();
//    $(".resizable").resizable();

    remove_loading();
    loadCode();
    createBarEnc();
    if (initBucle == 1) {
        $("#form_general").css({"position": "absolute", "top": "99px", "left": "40px"});
        $("#form_general").scroll(function() {
            var scrollTop = $("#form_general").scrollTop();
            var scrollLeft = $("#form_general").scrollLeft();
            $(".barEnc").css({"left": "-" + scrollLeft + "px"});
            $(".rowsEnc").css({"top": "-" + scrollTop + "px"});
        });
    }
});

function replaceNewDivs() {
    $('.axTable').replaceWith($('table').html()
            .replace(/<tbody/gi, "<div id='table' class='axTable Table' ")
            .replace(/<tr/gi, "<div")
            .replace(/<\/tr>/gi, "</div>")
            .replace(/<th/gi, "<div")
            .replace(/<\/th>/gi, "</div>")
            .replace(/<td/gi, "<div")
            .replace(/<\/td>/gi, "</div>")
            .replace(/<\/tbody/gi, "<\/div")
            );
}

function addClassNewDivs() {
    $(".trtr").addClass("Row");
    $(".th_enc").addClass("Row");
    $(".column_enc").addClass("Cell");
    $(".td_all").addClass("Cell");
}

function createBarEnc() {
    if (initBucle == 1) {
        var line = "<div class='barEnc'><table><tr class='th_enc'>" + $(".th_enc").html() + "</tr></table></div>";
        var rows = "<div class='rowsEnc'><table>";
        var row_enc = $(".th_rows");
        var total_rows = row_enc.length;
        var init = initBucle;
        for (var i = init; i < total_rows; i++) {
            //        var text = $(row_enc[i]).html();
            rows += "<tr><th class='th_rows field_enc th_rows_first row_enc_" + i + "' id='" + i + "'>" + i + "</th></tr>";
        }
        rows += "</table></div>";

        $(".barEnc").remove();
        $(".rowsEnc").remove();
        $(".formulas_enc").after(rows);
        $(".formulas_enc").after(line);

        $(".th_enc_created").remove();
        $(".th_rows_created").remove();
        if (initBucle != 0) {
            $(".trtr").first().remove();
        }
    }
    activeColsRowsClick();
    activeResizable();
}
function activeResizable() {
    $(".fixed_column").resizable({
        handles: 'e, w, se',
        resize: function(event, ui) {
            $(this).css("height", '');
            var id = $(this).attr("data");
            var w = $(this).width();
            $("#" + id).width(w);
            $("#" + id + "0").width(w);
            $(".fixed_column_td" + id).width(w);
        }
    });
    $(".th_rows").resizable({
        handles: 'e, w, se',
        resize: function(event, ui) {
            $(this).css("width", '');
            var id = this.id;
            var w = $(this).height();
            $(".fixed_column_td" + id).first().height(w);
        },
        stop: function(event, ui) {

        }
    });
}