function altoDocument() {
    var altoMas = 27;
    var anchoRowsEnc = 0;
    if (initBucle == 1) {
        altoMas = 54;
        anchoRowsEnc = 40;
    }
    var altoBody = $("#contenedor").height();
    var altoFormulas = $(".formulas_enc").height();
    var alto = parseInt(altoBody) - parseInt(altoFormulas) - altoMas;
    var anchoBody = $("#contenedor").width();
    var ancho = parseInt(anchoBody) - parseInt(anchoRowsEnc);
    $("#form_general").height(alto);
    $("#form_general").width(ancho);
}
function tr() {
    $("table").addClass("axTable");
    $("tr").removeAttr("class");
    $("tr").addClass("trtr");
    var div = $("tr");
    var total_td = $(div).length;
    var init = initBucle;
//    var init = 0;
    //LE PONGO A TODAS LAS FILAS EL ID EN NÚMERO

    for (var i = init; i < total_td; i++) {
//    for (var i = 0; i < total_td; i++) {
        var let = i;
        var d = div[i];
        d.id = let;
        $(d).addClass("trtr_" + i);
    }
    var t_columns = $("#" + init + " > td").length;
    var html = "";
    var fixedc = "";
    //CREO LAS COLUMNAS CON LETRAS
    var maxCols = t_columns + 10;
    if (initBucle == 1) {
        maxCols = t_columns;
    }
    var getMaxCols = $("#form_general").attr("maxCols");
    if (getMaxCols != "" && getMaxCols != "0") {
//        maxCols = getMaxCols;
        maxCols = t_columns;
    }
    html = "<tr class='th_enc th_enc_created'>";
    for (var a = -1; a < maxCols; a++) {
//        var letter = letras()[a];
//        var letter = abc(a, true);
        var classFirstCol = "";
        var letter = letras(a);
        if (letter == undefined) {
            letter = "";
            fixedc = "";
        } else {
            fixedc = "<div class='fixed_column' data='" + letter + "' ></div>";
        }
        if (a == -1)
            classFirstCol = " firstCol";
        html += "<th id='" + letter + "' class='column_enc field_enc" + classFirstCol + "'><div class='name_enc_column' >" + letter + "</div>" + fixedc + "</th>";
    }
    html += "</tr>";
    td();
    $("#" + init).before(html);
//    $(".fixed_column").resizable({
//        // Handles left right and bottom right corner
//        handles: 'e, w, se',
//        // Remove height style
//        resize: function(event, ui) {
//            $(this).css("height", '');
//            var id = $(this).attr("data");
//            var w = $(this).width();
//            $("#" + id).width(w);
//            $("#" + id + "0").width(w);
//            $(".fixed_column_td" + id).width(w);
//        }
//    });

//    $(".th_rows").resizable();
//    $(".th_rows").resizable({
//        // Handles left right and bottom right corner
//        handles: 'e, w, se',
//        // Remove height style
//        resize: function(event, ui) {
//            $(this).css("width", '');
//            var id = this.id;
//            var w = $(this).height();
////            $(".fixed_column_td" + id).remove();
//            $(".fixed_column_td" + id).first().height(w);
//        },
//        stop: function(event, ui) {
//
//        }
//    });
}
function td() {
    var div = $("tr");
    var total_td = $(div).length;
    var existe = $(".th_enc").length;
//    $(".fixed_column_td").remove();
    var fix = "";
    if (existe == 0) {
        var init = initBucle;
        var num = initBucle;     //SACO TODAS LAS FILAS EXISTENTES
//        var num = 0;     //SACO TODAS LAS FILAS EXISTENTES
        for (var i = init; i < total_td; i++) {
//        for (var i = 1; i < total_td; i++) {
//            console.log(i);
            var d = div[i];
            var id = d.id;
            var div_filas = $("#" + id + " > td");
            var total_filas = div_filas.length;
            //POR CADA FILA EXISTENTE  LE PONGO EL ID A CADA COLUMNA O CAMPO
            var maxRows = total_filas + 10;
            if (initBucle == 1) {
                maxRows = total_filas;
            }
            var getMaxRows = $("#form_general").attr("maxRows");
            if (getMaxRows != "" && getMaxRows != "0") {
//                maxRows = getMaxRows;
                maxRows = total_filas;
            }
            for (var a = 0; a < maxRows; a++) {
                var c = div_filas[a];
//                var letter = letras()[a];
//                var letter = abc(a, true, true, true);
                var letter = letras(a);
                if (c != undefined) {
                    c.id = letter + id;
                    //AGREGO DIV PARA EL ANCHO DE COLUMNA
//                    var w_fixtd = $(".fixed_column_td" + letter).width();
                    fix = "<div class='fixed_column_td fixed_column_td" + letter + " fixed_column_td" + id + " '  ></div>";
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
                        var html = "<th class='th_rows th_rows_created field_enc row_enc_" + num + "' id='" + num + "' >" + num + "</th>";
                        num++;
                        $("#" + c.id).before(html);
                    }
                }
            }
        }
    }
}