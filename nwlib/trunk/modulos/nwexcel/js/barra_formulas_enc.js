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