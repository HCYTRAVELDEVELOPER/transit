id_enc = "";
requiere_login = "";
requiere_codigo = "";
function loadAll(t, r) {
    total = t;
    var width = $("#ruleta").width();
    var catetos = width / total;
    var area = catetos * 1.8;
    var height = width / 2;
    var pxx = "px";
    if (pxx == "vw") {
        height = height / 10;
        area = area / 10;
    }
    $(".pasos").css({"border-left": area + pxx + " solid transparent", "border-right": area + pxx + " solid transparent", "border-top-width": height + pxx});
    for (var i = 0; i < total + 1; i++) {
        var grados = (area / 3) * i;
        var num = i + 1;
        $(".ruleta_int" + num).css({"transform": "rotate(" + grados + "deg)"});
        $(".ruleta_int" + num).attr("nwrotation", grados);
    }
    $("#loading").fadeOut();
    $(".contenedor").fadeIn();

    $(".play").click(function() {
        if (r == "SI") {
            solicitaCodigo();
        } else {
            animation();
        }
    });
    $(".login").click(function() {
        loadLoginPopUp();
    });
    $(".registro").click(function() {
        registro();
    });
    id_enc = $(".contenedor").attr("data");
    requiere_login = $(".contenedor").attr("data-l");
}
function solicitaCodigo() {
    $.ajax({
        url: rute_files + "juegos/ruleta/src/solicitaCodigo.php",
        type: 'post',
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ")
        },
        success: function(data) {
            $("<div id='confirmCode'>" + data + "</div>").dialog({
                title: 'Confirmar Código',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: 'auto',
                width: '400px',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    $(this).remove();
                },
                buttons: {
                    'Aceptar': function() {
                        comprobarCodigo();
                    },
                    'Cerrar': function() {
                        $(this).dialog('close');
                        $(this).empty();
                        $(this).remove();
                    }
                }
            });
        }
    });
}
premio_manipuled = "";
function comprobarCodigo() {
    var d = $("#form_c").serialize();
    d += "&id=" + id_enc;
    var id_code = $(".code").val();
    $.ajax({
        url: rute_files + "juegos/ruleta/srv/comprobarCodigo.php",
        type: 'post',
        data: d,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ")
        },
        success: function(data) {
            if (data == 0) {
                $("<div><h3>Este código ya está usado o no existe.</h3></div>").dialog({
                    stack: true,
                    autoOpen: true,
                    resizable: false,
                    modal: true,
                    height: 'auto',
                    width: '400px',
                    sticky: true,
                    close: function() {
                        $(this).empty();
                        $(this).dialog('destroy');
                        $(this).remove();
                    },
                    buttons: {
                        'Cerrar': function() {
                            $(this).dialog('close');
                            $(this).empty();
                            $(this).remove();
                        }
                    }
                });
            } else
            if (data == 1) {
                var d = $("#form_c").serialize();
                $("#confirmCode").dialog('close');
                $("#confirmCode").empty();
                $("#confirmCode").remove();
                $("<div><h3>¡Que bien! ya Puedes participar. ¿Deseas jugar ahora mismo?</h3></div>").dialog({
                    stack: true,
                    autoOpen: true,
                    resizable: false,
                    modal: true,
                    height: 'auto',
                    width: '400px',
                    sticky: true,
                    close: function() {
                        $(this).empty();
                        $(this).dialog('destroy');
                        $(this).remove();
                    },
                    buttons: {
                        'Jugar': function() {
                            $(this).dialog('close');
                            $(this).empty();
                            $(this).remove();
                            if (manipuled == "SI") {
                                consultarPremioManipulado(id_code);
                            } else {
                                usarCodigo(d);
                            }
                        },
                        'Jugar Después': function() {
                            $(this).dialog('close');
                            $(this).empty();
                            $(this).remove();
                        }
                    }
                });
            }
        }
    });
}
function  consultarPremioManipulado(d) {
    $.ajax({
        type: "POST",
        url: rute_files + "juegos/ruleta/srv/consultarPremioManipulado.php",
        data: {id: id_enc, code: d},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function(data) {
            premio_manipuled = data;
            usarCodigo(d, "yes");
        }
    });
}
function  usarCodigo(d, m) {
    if (m == "yes") {
        var da = {id_enc: id_enc, code: d};
    } else {
        var da = d;
        da += "&id_enc=" + id_enc;
    }
    $.ajax({
        type: "POST",
        url: rute_files + "juegos/ruleta/srv/usarCodigo.php",
        data: da,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
            } else {
                animation();
            }
        }
    });
}
function loadLoginPopUp() {
    $("#login_nws").remove();
    $(".contenedor").append("<div id='login_nws'></div>");
    $("#login_nws").empty();
    var ruta = rute_files + "juegos/ruleta/src/login_nws.php";
    $.ajax({
        url: ruta,
        type: 'post',
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ")
        },
        success: function(data) {
            $("#login_nws").position({
                my: "center",
                at: "center"
            });
            $("#login_nws").dialog({
                title: 'Iniciar Sesión',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: 'auto',
                width: '400px',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    $("#login_nws").remove();
                },
                buttons: {
                    'Aceptar': function() {
                        comprobarFormLogin();
                    },
                    'Cerrar': function() {
                        $(this).dialog('close');
                        $(this).empty();
                        $("#login_nws").remove();
                    }
                }
            });
            $("#login_nws").append(data);
        }
    });
}
function comprobarFormLogin() {
    var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    $(".error").remove();
    if ($(".usuario_login").val() == "" || !emailreg.test($(".usuario_login").val())) {
        $(".usuario_login").focus().after("<span class='error'>Ingrese un email correcto</span>");
        return false;
    } else
    if ($(".clave_login").val() == "") {
        $(".clave_login").focus().after("<span class='error'>Ingrese su contraseña</span>");
        return false;
    }
    IniciarSesion();
}
function  IniciarSesion(d) {
    $("#respuesta").remove();
    $(".box_info_popup").append("<div id='respuesta'></div>");
    var url = rute_files + "juegos/ruleta/srv/iniciar_sesion.php";
    var data = $("#form_login").serialize();
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function(data) {
            if (data != "") {
                $("#respuesta").append(data);
            } else {
                window.location.reload();
            }
        }
    });
}
function registro() {
    var data = {};
    $.ajax({
        url: rute_files + "juegos/ruleta/src/crearcuenta.php",
        type: 'post',
        data: data,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $("#popup").position({
                my: "center",
                at: "center"
            });
            $("<div id='popup'></div>").dialog({
                create: function(event, ui) {
//                    $(".contenedor").addClass("efectBlur");
                },
//                position: "top",
                title: 'Registro de usuario Nuevo',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: 'auto',
                width: '400px',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    $("#popup").remove();
                },
                buttons: {
                    'Aceptar': function() {
                        comprobarFormRegistro();
                    },
                    'Cerrar': function() {
                        $(this).empty();
                        $(this).dialog('destroy');
                        $("#popup").remove();
                    }
                }
            });
            $("#popup").append(data);
        }
    });
}
function comprobarFormRegistro() {
    var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
    $(".error").remove();
    if ($(".nombre_crear").val() == "") {
        $(".nombre_crear").focus().after("<span class='error'>Ingrese su nombre</span>");
        return false;
    } else
    if ($(".email_crear").val() == "" || !emailreg.test($(".email_crear").val())) {
        $(".email_crear").focus().after("<span class='error'>Ingrese un email correcto</span>");
        return false;
    } else
    if ($(".clave_registro").val() == "") {
        $(".clave_registro").focus().after("<span class='error'>Ingrese su contraseña</span>");
        return false;
    }
    if ($(".telefono_registro").val() == "") {
        $(".telefono_registro").focus().after("<span class='error'>Ingrese su teléfono</span>");
        return false;
    }
    if ($(".documento_registro").val() == "") {
        $(".documento_registro").focus().after("<span class='error'>Ingrese su documento</span>");
        return false;
    }
    crearCuenta();
}
function  crearCuenta() {
    $("#respuesta_crear").remove();
    $(".div_crearCuenta_nws").append("<div id='respuesta_crear'></div>");
    var url = rute_files + "juegos/ruleta/srv/crearCuenta.php";
    var data = $("#formPedido").serialize();
    data += "&id_reunion=" + id_enc;
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function(data) {
            if (data != "") {
                $("#respuesta_crear").append(data);
            } else {
                window.location.reload();
            }
        }
    });
}
function loadResult(id) {
    $("#fond_gen_mod_oculto").empty();
    var ruta = rute_files + "juegos/ruleta/src/result.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {id: id, id_enc: id_enc, requiere_login: requiere_login},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ")
        },
        success: function(data) {
            $("#fond_gen_mod_oculto").position({
                my: "center",
                at: "center"
            });
            $("#fond_gen_mod_oculto").dialog({
                create: function(event, ui) {
                    $(".ui-widget-header").hide();
                },
                show: 'slide',
                hide: 'slide',
                title: 'Respuesta',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: 'auto',
                width: '400px',
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                },
                buttons: {
                    'Aceptar': function() {
                        window.location.reload();
                    }
                }
            });
            $("#fond_gen_mod_oculto").append(data);
        }
    });
}
function animation() {
    $(".resultado_post").html(" ");
    var init = 0;
    $('.ruleta').animate({borderSpacing: init}, {
        step: function(now) {
            $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
            $(this).css('-moz-transform', 'rotate(' + now + 'deg) ');
            $(this).css('-ms-transform', 'rotate(' + now + 'deg) ');
            $(this).css('-o-transform', 'rotate(' + now + 'deg) ');
            $(this).css('transform', 'rotate(' + now + 'deg) ');
        },
        duration: 1
    }, 'linear');
    var duracion = 10000;
    var zoom_ki = Math.floor((Math.random() * total) + 1);
    if (manipuled == "SI" && premio_manipuled != "") {
        zoom_ki = premio_manipuled;
    }
    var ruleta_int = $(".ruleta_int" + zoom_ki).attr("nwrotation");
    var zoom_antes = 360 * 7;
    var zoom = zoom_antes + parseFloat(ruleta_int);
    $('.ruleta').animate({borderSpacing: zoom}, {
        step: function(now) {
            $(this).css('-webkit-transform', 'rotate(-' + now + 'deg)');
            $(this).css('-moz-transform', 'rotate(-' + now + 'deg) ');
            $(this).css('-ms-transform', 'rotate(-' + now + 'deg) ');
            $(this).css('-o-transform', 'rotate(-' + now + 'deg) ');
            $(this).css('transform', 'rotate(-' + now + 'deg) ');
        },
        duration: duracion
    }, 'easeOutQuad');
    setTimeout(function() {
        var id_p = $(".paso" + zoom_ki).attr("name");
        loadResult(id_p);
    }, duracion);
}