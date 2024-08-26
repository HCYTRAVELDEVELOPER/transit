function selected_row(id) {
    unselected_row();
//    console.log(id);
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
//        console.log(id + i);
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
        
        if (context_menu == "NO") {
            $("td").removeClass("select_rows_marge");
        }
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
    select_text = "NO";
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