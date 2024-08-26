error_celdas = "#VALUE!";
//error_celdas = "0";
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
//                            console.log(id);
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
                                val_real = clean_number(val_real);
                                if (val_real == "NA")
                                    str = error_celdas;
                                else
                                    str = str.replace(out[i], val_real);
                            } else {
                                var val_real = "0";
                            }
                            val_real = clean_number(val_real);
                            if (val_real == "NA")
                                str = error_celdas;
                            else
                                str = str.replace(out[i], val_real);
//                            console.log(val_real);
//                            console.log(out[i]);
//                            console.log("out[i]");
                        }
                    }
                }
            }
        }
//        console.log(str);
        eval_operations(d, str, true);
    } else {
        eval_operations(d, data);
    }
}
function eval_operations(d, text, unfield) {
    var div = $(d);
    if (text != "" && text != undefined) {
        if (unfield == "SI") {
            div.html(text);
            return;
        }
        var date_sino = detecta_fecha(text);
        if (date_sino == false) {
            if (unfield == true) {
                if ($.isNumeric(text) == false) {
                    if (text != "" && text != error_celdas) {
                        text = text.replace(/=/gi, "");
                        text = text.replace(/,/gi, ".");
                        text = text.replace(/[^-()\d/*+.]/g, '');
                        try {
                            var operation = eval(text);
                        }
                        catch (e) {
                            console.log("Error en la celda " + div.attr("id") + " ERROR: " + e.message);
                            div.html(error_celdas);
                            return;
                        }
//                        var result = operation.toFixed(2);
                        var result = operation;
                        if (result == "Infinity" || result == "NaN") {
                            div.html("0");
                            return;
                        }
                        div.html(result);
                        if (div.attr("format") != undefined) {
                            if (div.attr("format") == "money") {
                                formatCelda(div);
                            } else
                            if (div.attr("format") == "numeric") {
                                formatCelda(div, false);
                            }
                        }
                    } else {
                        div.html(text);
                    }
                }
            } else {
                //                $(d).html(eval("text"));
                //                $(d).text(text);
            }
        }
        else {
            div.html(date_sino);
        }
    }
}