url = "/nwlib/modulos/";
OnScrollDiv();
$(".header_contend").addClass("menu_fix_manuals");
$(window).scroll(function() {
    OnScrollDiv();
});
function OnScrollDiv() {
    var scrollTop = $(document).scrollTop();

    if (scrollTop < 25) {
        $(".header_contend").removeClass("menu_fix_manuals_scroll");
        $(".div_contend_header").removeClass("menu_pad");
        $(".menu_qxnw_web").removeClass("menu_li_ad");
        $(".search").removeClass("search_add");
        $(".inputbox").removeClass("inputbox_add");
        $(".input_search_locs").removeClass("input_search_locs_add");
    } else
    if (scrollTop > 25) {
        $(".header_contend").addClass("menu_fix_manuals_scroll");
        $(".div_contend_header").addClass("menu_pad");
        $(".menu_qxnw_web").addClass("menu_li_ad");
        $(".search").addClass("search_add");
        $(".inputbox").addClass("inputbox_add");
        $(".input_search_locs").addClass("input_search_locs_add");
    }
}
function OnScrollDivConsole() {
    var scrollTop = $(document).scrollTop();
    if (scrollTop < 135) {
        $(".controls_object").removeClass("controls_object_add");
        $(".header_contend").removeClass("none");
    } else
    if (scrollTop > 135) {
        $(".controls_object").addClass("controls_object_add");
        $(".header_contend").addClass("none");
    }
}

function log_in() {
    $('#popup_carga_note').fadeIn(200);
    $("#popup_carga_note").load(url + "login_qxnw/log_in.php");
}
function crearCuenta() {
    $('#popup_carga_note').fadeIn(200);
    $("#popup_carga_note").load(url + "login_qxnw/src/cuenta/crear_cuenta.php");
}
function autentica_user() {
    var url_data = url + "login_qxnw/src/cuenta/autentica.php";
    var datas = $("#form_login_two").serialize();
    $.ajax({
        type: "POST",
        url: url_data,
        data: datas,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $("#respuesta").html(data);
        }
    });
    return false;
}
function create_user() {
    var url_data = url + "/login_qxnw/src/cuenta/create_user.php";
    $.ajax({
        type: "POST",
        url: url_data,
        data: $("#form_create").serialize(),
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