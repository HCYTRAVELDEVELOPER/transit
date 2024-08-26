
url = "/nwlib/modulos/";

$(document).ready(function() {
    var especial = $(".box_object");
    especial.bind("contextmenu", function(e) {
//    especial.bind("click", function(e) {
//        var id = this.id;
        var self = this;
        var data = $(self).attr("name");
        var x = e.pageX;
        var y = e.pageY;
        $(".contextmenu").remove();
        var html = "<div class='contextmenu' style='left: " + x + "px; top: " + y + "px;' >";
        html += "<div class='contextmenuIntern'>";
        html += "<div class='contextmenuButtons " + data + " '  > Editar</div>";
        html += "</div>";
        html += "</div>";
        $("body").append(html);
        $(".buttonEnviarFondoDiv").click(function() {
//            enviarFondoDiv(this);
            $(self).attr("inhabilitado", "true");
            $(self).addClass("divAlFondo");
        });
        $(".contextmenu").mouseleave(function() {
            $(".contextmenu").remove();
        });
        return false;
    });
});

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
function cargar_object_hoja(id, cat, id_atras) {
//    setTimeout(function() {
//
//    }, 600);
//    $('.hoja_man_carga').fadeOut(0);
    $('.hoja_man_carga').fadeIn(0);
    $(".hoja_man_carga").load(url + "nw_learning/objetos_carga.php", {id: id, cat: cat, id_atras: id_atras});

}
function cargar_object_atras(id, cat, id_atras) {
    $('.hoja_man_carga').fadeIn('slow');
    $(".hoja_man_carga").load(url + "nw_learning/objetos_carga.php", {id: id, cat: cat, id_atras: id_atras});
}

function cargar_popup(id) {
    $('#popup_carga_note').fadeIn(0);
    $("#popup_carga_note").load(url + "nw_learning/info_popup.php", {id: id});
}
//function cargar_popup(id) {
//   $('#popup_carga_note').fadeIn(0);
//    $("#popup_carga_note").load(url + 'nw_learning/info_popup.php', {
//        id: id
//    }, function() {
//        $("#popup_carga_note").dialog({
//            position: 'center',
//            show: "slide",
//            title: "Tarea",
//            closeOnEscape: true,
//            autoOpen: true,
//            resizable: true,
//            modal: true,
//            height: '500',
//            width: '900',
//            close: function() {
//                $(this).empty();
//                $(this).dialog('destroy');
//            },
//            buttons: {
//                'Salir': function() {
//                    $(this).empty();
//                    $(this).dialog('close');
//                    $(this).dialog('destroy');
//                }
//            }
//        });
//        ;
//    });
//}

function editMan(id) {
    $('#popup_carga_note').fadeIn(200);
    $("#popup_carga_note").load(url + "nw_learning/src/tablas/manual.php", {id: id});
}
function newMan(id) {
    $('#popup_carga_note').fadeIn(200);
    $("#popup_carga_note").load(url + "nw_learning/src/tablas/manual.php", {terminal_uss: id});
}
function fram_voic(id) {
    $("#carga_voice").load(url + "nw_learning/src/frame_voice.php", {id: id});
}
function drag_anime_object(z, x, y) {
//    $('.hoja_man_carga').draggable();
//    $(".hoja_man_carga").animate({left: x, top: y}, 2000);
    $(".img_full").animate({left: x, top: y}, 2000);
    $(".img_full")
            .css('-webkit-transform', 'scale(' + z + ')')
            .css('-webkit-transform', 'scale(' + z + ')')
            .css('-moz-transform', 'scale(' + z + ')')
            .css('-o-transform', 'scale(' + z + ')')
            .css('transform', 'scale(' + z + ')');
}
function log_in() {
    $('#popup_carga_note').fadeIn(200);
    $("#popup_carga_note").load(url + "nw_learning/log_in.php");
}
function autentica_user() {
    var url_data = url + "/nw_learning/src/cuenta/autentica.php";
    $.ajax({
        type: "POST",
        url: url_data,
        data: $("#form_login_two").serialize(),
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
function FormEditM() {
    var url = "/nwproject/php/modulos/nw_learning/src/tablas/modificar.php";
    var data = $("#form_edit").serialize();
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            alert(data);
            window.location.reload();
            // $("#respuesta").html(data);
        }
    });
    return false;
}

var navegador = navigator.userAgent;

if (navegador.indexOf('MSIE') != -1) {
    document.write("<div class='navegador'>Está usando Internet Explorer</div>");
} else if (navegador.indexOf('Firefox') != -1) {
    document.write("<div class='navegador'>Está usando Firefox</div>");
} else if (navegador.indexOf('Chrome') != -1) {
    document.write("<div class='navegador'>Está usando chrome</div>");
} else if (navegador.indexOf('Opera') != -1) {
    document.write("<div class='navegador'>Está usando Opera</div>");
} else {
    document.write('está usando un navegador no identificado ...');
}

//setInterval("myTimer()", 1000);

function myTimer() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("hora").innerHTML = t;
}
function launchFullScreen(element) {
    if (element.requestFullScreen) {
        element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}
$(function() {
    $("#log").click(function() {
        log_in();
    });
    $("#ingresar").click(function() {
        autentica_user();
    });
    var goFS = document.getElementById("goFS");
    var element = document.documentElement;
    goFS.addEventListener("click", function() {
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }, false);
});

function scroll_object_x_y(s, y, x) {
    oculta();
    $('.box_object').fadeIn('slow');
    var xx = x / 5;
    $("html,body").animate({scrollTop: s}, 1100);
    $("html,body").animate({scrollLeft: xx}, 1100);
    $(".box_object").animate({top: y, left: x}, 1100);
}

function oculta() {
    $('#myDivLoadingObject').fadeOut(0);
}
function oculta_box() {
    $('.cerrar_opacity').mouseover(function() {
        $('.box_object').animate({opacity: '0.1'});
    });
    $('.cerrar_opacity').mouseout(function() {
        $('.box_object').animate({opacity: '1'});
    });
}

function autenticar() {
    var str = $("#form_login_two").serialize();
    $.ajax({
        url: '/nwproject/php/modulos/nw_learning/src/cuenta/autentica.php',
        data: str,
        global: false,
        cache: false,
        type: 'post',
//        beforeSend: function() {
//            $("#final").hide();
//            $("#loading").show();
//        },
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function() {
//            $("#loading").hide('slow');
//            $("#final").show();
            //   document.form_login_two.reset();
            alert(str);
        }
    });
}

function autenticar_dos() {
    // var user = $("#userID").val();
    var str = $("#form_login_two").serialize();
    alert(str);
    alert("jquery");
    $.post("/nwproject/php/modulos/nw_learning/index.php", {data: str});

}









//$.ajaxPrefilter( "json script", function( options ) {
//  options.crossDomain = true;
//});
//$.support.cors = true;


function cargarExterno(datos, divID) {
    var peticion = new XMLHttpRequest();
    if (window.XMLHttpRequest) {
        peticion = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        peticion = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (peticion) {
        var obj = document.getElementById(divID);
        peticion.open("GET", datos, true);
        peticion.withCredentials = true;
        contentType: "application/json",
                peticion.onreadystatechange = function() {
            if (peticion.readyState == 4) {
//                obj.innerHTML = peticion.responseText;
                obj.innerText = peticion.responseText;
            }
        }
        peticion.send();
    }
}

function open_details(id) {
    // alert("hola" + id);
    $('.detalles' + id).fadeIn(0);
    $('.equis' + id).fadeIn(0);
    $(".booked" + id).addClass("open_book");
}
function close_details(id) {
    $('.detalles' + id).fadeOut(100);
    $('.equis' + id).fadeOut(100);
    $(".booked" + id).removeClass("open_book");
}

function open_details_gal(id) {
    // alert("hola" + id);
    $('.detalles' + id).fadeIn(0);
    $('.equis' + id).fadeIn(0);
    $(".booked_gal" + id).addClass("open_book");
}
function close_details_gal(id) {
    $('.detalles' + id).fadeOut(100);
    $('.equis' + id).fadeOut(100);
    $(".booked_gal" + id).removeClass("open_book");
}

function galery_user() {
    $(".figura_man_gal").addClass("class1");
    $(".booked_galery").addClass("class2");
    $(".links_manual_galery").addClass("display_none");
    $(".firma_man").addClass("display_none");
    $(".detalles_manu_galery").addClass("class3");
}
function scale(p) {
    $("[data-slider]")
            .each(function() {
        var input = $(this);
        $("<p>")
                .addClass("output")
                .insertAfter($(this));
    })
            .bind("slider:ready slider:changed", function(event, data) {
        $(this)
                .nextAll(".output:first")
                .html(data.value.toFixed(3));
        var suma = data.value * 2;
//        $(".hoja_man_carga").effect("scale",{percent: suma},"1000");
        $(".hoja_man_carga")
                .css('-webkit-transform', 'scale(' + suma + ')')
                .css('-webkit-transform', 'scale(' + suma + ')')
                .css('-moz-transform', 'scale(' + suma + ')')
                .css('-o-transform', 'scale(' + suma + ')')
                .css('transform', 'scale(' + suma + ')');
        //   $(".hoja_man_carga").css({zoom: suma});
    });
}
function scaleNormal() {
    $(".hoja_man_carga")
            .css('-webkit-transform', 'scale(1)')
            .css('-webkit-transform', 'scale(1)')
            .css('-moz-transform', 'scale(1)')
            .css('-o-transform', 'scale(1)')
            .css('transform', 'scale(1)');
    $(".hoja_man_carga").animate({left: 0, top: 0}, 1000);
}
function decide_taman(l) {
    he = document.getElementById("contenedor").offsetWidth;
    width_img = document.getElementById("img_id").offsetWidth;
    left = l;
    max = 700;
    if (he >= 1350) {
        max = 850;
    } else
    if (he >= 1000) {
        if (width_img >= 1000) {
            // $(".hoja_man_carga").addClass("img_zoom_medium");
            $(".hoja_man_carga")
                    .css('-webkit-transform', 'scale(0.91) translate(-5%)')
                    .css('-webkit-transform', 'scale(0.91) translate(-5%)')
                    .css('-moz-transform', 'scale(0.91) translate(-5%)')
                    .css('-o-transform', 'scale(0.91) translate(-5%)')
                    .css('transform', 'scale(0.91) translate(-5%)');
        }
        max = 630;
    }
    if (left > max) {
        $(".object_float").addClass("box_object_right");
        $(".punta_top_two").addClass("punta_top_right");
        $(".object_float").removeClass("box_object_left");
    } else
    if (left < max) {
        $(".object_float").addClass("box_object_left");
        $(".object_float").removeClass("box_object_right");
        $(".punta_top_two").removeClass("punta_top_right");
    } else {
        $(".object_float").addClass("box_object_left");
        $(".object_float").removeClass("box_object_right");
        $(".punta_top_two").removeClass("punta_top_right");
    }
}

//$( document ).ready(function() {
$(function() {
    $('.hoja_man_carga').draggable({cursor: "move"});

    $('.hoja_man_carga').mousedown(function() {
        $(".hoja_man_carga").addClass("cursor_move");
    });
    $('.hoja_man_carga').mouseup(function() {
        $(".hoja_man_carga").removeClass("cursor_move");
//    });
    });
});


