function butons_enc() {
    $(".td_all").mousedown(function(e) {
        var self = this;
        if (e.which == "1") {
            context_menu = "NO";
            selec_varios_row = "SI";
            var div = $(this).attr("id");
//            $(".contextmenu").remove();
            $("#" + div).addClass("select_rows_marge");
            if (focus_igual == "NO") {
                if (selec_varios_row == "NO") {
                    selected_field(this);
                }
            } else
            if (focus_igual == "SI") {
                selected_field_focus(this);
            } else {
                selected_field(this);
            }
        }
//        if (focus_igual == "NO") {
//            if (selec_varios_row == "NO") {
//                selected_field(this);
//            }
//        } else
//        if (focus_igual == "SI") {
//            selected_field_focus(this);
//        }
        if (e.which == "3") {
            context_menu = "SI";
            removeContextMenu();
            var data = $(self).attr("name");
            var type = "celda";
            var x = e.pageX;
            var y = e.pageY;
            menuContextObjects(data, type, x, y);
        }
    });
    $(".td_all").mouseup(function(e) {
        tdAllMouseUp(e);
    });
    $(".td_all").mouseenter(function() {
        var id = $(this).attr("id");
        var data = "ID: " + id;
        data += " - Class: " + $(this).attr("class");
        data += " - Value: " + $(this).text();
        $(".field_footer_show").text(data);
        $(".field_footer").text(id);
        field_hover = id;
        if (selec_varios_row == "SI") {
            var div = $(this).attr("id");
            select_varias_celdas($("#" + div));
        }
    });
//    activeColsRowsClick();
//    var especial = $(".th_rows");
//    especial.bind("contextmenu", function(e) {
//        var self = this;
//        contextmenudos(self, "columna_principal", e);
//    });
//    especial.click(function() {
//        selected_row(this.id);
//    });
//    var columna = $(".column_enc");
//    columna.bind("contextmenu", function(e) {
//        var self = this;
//        contextmenudos(self, "columna", e);
//    });
//    columna.click(function() {
//        selected_row(this.id);
//    });
}
function activeColsRowsClick() {
    var especial = $(".th_rows");
    especial.bind("contextmenu", function(e) {
        var self = this;
        contextmenudos(self, "columna_principal", e);
    });
    especial.click(function() {
        selected_row(this.id);
    });
    var columna = $(".column_enc");
    columna.bind("contextmenu", function(e) {
        var self = this;
        contextmenudos(self, "columna", e);
    });
    columna.click(function() {
        selected_row(this.id);
    });
}
function tdAllMouseUp(e) {
    if (e.which == "1") {
        context_menu = "NO";
    }
    if (e.which == "3") {
        context_menu = "SI";
    }
    selec_varios_row = "NO";
}
function contextmenudos(self, type, e) {
    var select = $(self).attr("row_selected");
    var data = $(self).attr("name");
    var x = e.pageX;
    var y = e.pageY;
    if (select == "selected") {
        menuContextObjects(data, type, x, y);
    } else {
        selected_row(self.id);
        menuContextObjects(data, type, x, y);
    }
}
function select_varias_celdas(div) {
    div.addClass("select_rows_marge");
    div.attr("select_rows_marge", "true");
}
function td_all_dblclick(d) {
    var self = d;
    $(".td_all").attr("contenteditable", "false");
    $(".td_all").attr("edit", "false");
    $(self).attr("contenteditable", "true");
    $(self).addClass("td_editing");
    select_text = "SI";
    edit_field = "SI";
    $(self).attr("edit", "true");
    var func = $(self).attr("func");
    if (func != "" && func != undefined) {
        $(self).text(func);
    }
    $(self).focus();
}
function td_all_click(d, com) {
    var self = d;
    if (com != true)
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
        //AL DIGITAR BORRO EL TEXTO ANTERIOR SI NO SON LAS SIGUIENTES TECLAS
        if (t != 13 && t != 37 && t != 38 && t != 39 && t != 40 && t != 17 && t != 9 && t != 20 && t != 16 && t != 18 && t != 91 && t != 225 && t != 93 && t != 36 && t != 33 && t != 34 && t != 35 && t != 113) {
            if (celdadigita != $(".td_selected").attr("id")) {
                $(".td_selected").text(" ");
            }
        }
        celdadigita = $(".td_selected").attr("id");
        if (t == 17) {
            control_pulsado = "SI";
        }
        if (t == 13) {
            control_pulsado = "NO";
        }
        if (control_pulsado == "NO") {
            tecla_enter(t);
        }
        if (edit_field == "NO") {
            teclasMover(t);
            if (t == 39 || t == 40 || t == 38 || t == 37)
                return false;
        } else {
            move_fields(t);
        }
    });
}
function move_fields(t) {
    if (focus_formula == "NO") {
        if (edit_field == "NO") {
            if (t != 13 && t != 17 && t != 18 && t != 91 && t != 16 && t != 20 && t != 9 && t != 33 && t != 34 && t != 225 && t != 93 && t != 112 && t != 114 && t != 115 && t != 116 && t != 117 && t != 118 && t != 119 && t != 120 && t != 121 && t != 122 && t != 123) {
                var div = $(".td_selected");
                $(".td_all").attr("contenteditable", "false");
                $(".td_all").attr("edit", "false");
                div.attr("contenteditable", "true");
                div.addClass("td_editing");
                select_text = "SI";
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
        control_pulsado = "NO";
        var div = $(".td_selected");
        var col = div.attr("id");
        var text = div.text();
        eval_values("#" + col, text);
        values();
        $(".td_all").attr("edit", "false");
        $(".td_all").attr("contenteditable", "false");
        $(".td_all").removeClass("td_editing");
        select_text = "NO";
        focus_igual = "NO";
        edit_field = "NO";

        chooseFormat(div);

        move_left_right_top_down("down");
        op();
        return false;
    }
}
//chooseFormat($("#C4"));
function chooseFormat(div) {
    if (div.attr("format") != undefined) {
        if (div.attr("format") == "money") {
            formatCelda(div);
        } else
        if (div.attr("format") == "numeric") {
            formatCelda(div, false);
        }
    }
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
        var let = parseInt(col) + 1;
        letter = letras(let);
        row = parseInt(fila);
    }
    if (dir == "left") {
        if (col <= 1) {
            col = 1;
        }
        if (col == undefined) {
            col = 1;
        }
        letter = letras(parseInt(col) - 1);
        row = parseInt(fila);
    }
    if (dir == "top") {
        if (fila <= parseInt(initBucle) + parseInt(1)) {
            fila = parseInt(initBucle) + parseInt(1);
        }
        if (fila == undefined) {
            fila = 1;
        }
        letter = $(".td_selected").attr("letra-columna");
        row = parseInt(fila) - 1;
    }
    if (dir == "down") {
        letter = $(".td_selected").attr("letra-columna");
        row = parseInt(fila) + 1;
    }
    $(".td_all").attr("edit", "false");
    $(".td_all").attr("contenteditable", "false");
    $(".td_all").removeClass("td_editing");
    select_text = "NO";
    $(".td_all").removeClass("td_selected");
    var newcampo = "#" + letter + row;
    selected_field(newcampo);
    var visible = $(newcampo).css("display");
    if (visible == "none") {
        move_left_right_top_down(dir);
    }
    if (initBucle == 1) {
//    var altoFormulas = $(".formulas_enc").height();
        var leftGeneral = $("#form_general").scrollLeft();
        var anchoSel = $(".td_selected").width();
        var leftSel = $(".td_selected").position().left;
        var leftReal = anchoSel + leftSel;
        var altoSel = $(".td_selected").height();
        var topSel = $(".td_selected").position().top;
        var rest = altoSel + 100;
        var topReal = rest + topSel;
//    altoBodySum = altoBodySum - altoFormulas;
//    if (leftReal <= anchoBodySum) {
//        anchoBodySum = anchoBodySum - anchoBodySumInit;
//    }
        if (topReal <= altoBodySum) {
            altoBodySum = altoBodySum - altoBodySumInit;
        }
        if (dir == "right") {
            if (leftReal >= anchoBodySum) {
//        $("#form_general").scrollLeft(anchoBodySum - anchoSel);
//        $("#form_general").scrollLeft(leftGeneral + anchoSel);
//        $("#form_general").scrollLeft(leftGeneral + anchoBodySum);
//        $("#form_general").scrollLeft(anchoBodySum);
                $("#form_general").scrollLeft(leftGeneral + anchoSel);
//        anchoBodySum = anchoBodySum + anchoBodySumInit;
//        anchoBodySum = leftGeneral + anchoBodySumInit;
//        anchoBodySum = anchoBodySum + anchoBodySumInit;
            }
        }
        if (dir == "left") {
            if (leftReal >= anchoBodySum) {
                $("#form_general").scrollLeft(leftGeneral - anchoSel);
//        if (anchoBodySum >= anchoBodySumInit) {
//            if (leftReal <= anchoBodySum) {
//                anchoBodySum = anchoBodySum - anchoBodySumInit;
//        anchoBodySum = leftGeneral - anchoBodySumInit;
//            }
            }
        }
        if (topReal >= altoBodySum) {
            $("#form_general").scrollTop(altoBodySum - rest);
            altoBodySum = altoBodySum + altoBodySumInit;
        }
    }
}