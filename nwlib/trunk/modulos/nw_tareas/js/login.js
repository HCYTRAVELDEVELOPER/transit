
var url = "/nwlib/modulos/";

function crearCuenta() {
    $('#popup_carga_note').fadeIn(200);
    $("#popup_carga_note").load(url + "nw_tareas/src/login_qxnw/src/cuenta/crear_cuenta.php");
}
function create_user() {
    var url_data = url + "nw_tareas/src/login_qxnw/src/cuenta/create_user.php";
    $.ajax({
        type: "POST",
        url: url_data,
        data: $("#form_create").serialize(),
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
//            alert(data);
            $("#respuesta").html(data);
        }
    });
    return false;
}

function autentica_user() {
    var url_data = url + "nw_tareas/src/cuenta/autentica.php";
    var data_form = $("#form_login_two").serialize();
    $.ajax({
        type: "POST",
        url: url_data,
        data: data_form,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            // alert(data);
            $("#respuesta").html(data);
        }
    });
    return false;
}

function autentica_user_cookie() {
    var url_data = url + "nw_tareas/src/cuenta/autentica_cookie.php";
    var data_form = {};
    $.ajax({
        type: "POST",
        url: url_data,
        data: data_form,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            alert(data);
//            $("#respuesta").html(data);
        }
    });
    return false;
}