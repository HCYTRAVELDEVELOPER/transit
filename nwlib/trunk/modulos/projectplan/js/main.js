$(document).ready(function() {
    $(".newTask").click(function() {
        formNewTask("form_update");
    });
    $(".completedTask").click(function() {
        var da = $(this).attr('name');
        formNewTask("completed", da, "end");
    });
    $(".commentTask").click(function() {
        var da = $(this).attr('name');
        formCommentTask(da);
    });
    $("#combo").change(function() {
        var op = $("#combo option:selected").val();
        $('#capa').html(op);
    });
});
function formCommentTask(da) {
    var existe = $(".popup").val();
        history.pushState(null, "Tarea", "#" + da);
    if (existe != undefined) {
        return;
    }
    var ruta = "/nwlib6/modulos/projectplan/src/comment.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {id: da},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $('body').append("<div class='popup'></div>");
            $(".popup").dialog({
                resizable: true,
                modal: true,
                height: '500',
                width: '700px',
                position: 'center top',
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    $(".popup").remove();
                },
                buttons: {
                    'Salir': function() {
                        $(this).dialog('close');
                        $(this).empty();
                        $(".popup").remove();

                    },
                    'Guardar': function() {
                        updateComment(da);
                    }
                }
            });
            removeLoading();
            $(".popup").append(data);
        }
    });
}
function updateComment(da) {
    var type = $("#contenedor").attr('class');
    var project = $("#contenedor").attr('name');
    var adjunto = $("#adjunto").val();
    var observaciones = $("#observaciones").val();
    var ruta = "/nwlib6/modulos/projectplan/srv/updateComment.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {id: da, adjunto: adjunto, observaciones: observaciones, type: type, project: project},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            alert(data);
            removeLoading();
            window.location.reload();
        }
    });
}
function formNewTask(f, da, t) {
    var existe = $(".popup").val();
    if (existe != undefined) {
        return;
    }
    var ruta = "/nwlib6/modulos/projectplan/srv/" + f + ".php";
    var type = $("#contenedor").attr('class');
    $.ajax({
        url: ruta,
        type: 'post',
        data: {type: type, id: da, upType: t},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $('body').append("<div class='popup'></div>");
            $(".popup").dialog({
                resizable: true,
                modal: true,
                height: '500',
                width: '700px',
                position: 'center top',
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    $(".popup").remove();
                },
                buttons: {
                    'Salir': function() {
                        $(this).dialog('close');
                        $(this).empty();
                        $(".popup").remove();

                    },
                    'Aceptar': function() {
                        update(f);
                    }
                }
            });
            removeLoading();
            $(".popup").append(data);
        }
    });
}
function openAll(file, save) {
    var existe = $(".popup").val();
    if (existe != undefined) {
        return;
    }
    var ruta = "/nwlib6/modulos/projectplan/src/" + file + ".php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $('body').append("<div class='popup'></div>");
            $(".popup").dialog({
                resizable: true,
                modal: true,
                height: '500',
                width: '700px',
                position: 'center top',
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    $(".popup").remove();
                },
                buttons: {
                    'Salir': function() {
                        $(this).dialog('close');
                        $(this).empty();
                        $(".popup").remove();

                    },
                    'Aceptar': function() {
                        save();
                    }
                }
            });
            removeLoading();
            $(".popup").append(data);
        }
    });
}
function openLogin() {
    var existe = $(".popup").val();
    if (existe != undefined) {
        return;
    }
    var ruta = "/nwlib6/modulos/login_qxnw/index.php";
    $.ajax({
        url: ruta,
        type: 'get',
        data: {loginqxnw: "login"},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $('body').append("<div class='popup'></div>");
            $(".popup").dialog({
                resizable: true,
                modal: true,
                height: '500',
                width: '700px',
                position: 'center top',
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    $(".popup").remove();
                },
                buttons: {
//                    'Salir': function() {
//                        $(this).dialog('close');
//                        $(this).empty();
//                        $(".popup").remove();
//
//                    },
//                    'Aceptar': function() {
//                        save();
//                    }
                }
            });
            removeLoading();
            $(".popup").append(data);
        }
    });
}
function iniciarSesion() {
    $("<div>Sesión Inválida. <div class='iniciar_sesion'><h3>Inicie sesión haciendo clic aquí.</h3></div></div>").dialog({
        buttons: {
            'Salir': function() {
                $(this).dialog('close');
                $(this).empty();
                $(this).dialog('destroy');
                removeLoading();
                window.location.reload();
            }
        }
    });
    $(".iniciar_sesion").click(function() {
        openLogin();
    });
    $(".popup").dialog('close');
    $(".popup").empty();
    $("#fond_gen_mod_oculto").unload();
    $("#fond_gen_mod_oculto").empty();
}
function update() {
    showLoading();
    var type = $("#contenedor").attr('class');
    var project = $("#contenedor").attr('name');
    var id = $("#id_task").val();
    var upType = $("#upType").val();
    var observaciones = $("#observaciones").val();
    var fecha_final = $("#fecha_final").val();
    var tipo = $("#tipo").val();
    var hora_final = $("#hora_final").val();
    var adjunto = $("#adjunto").val();
    var file = "newTask";
    if (id != "" || id != undefined) {
        file = "updateTask";
    }
    var url_data = "/nwlib6/modulos/projectplan/srv/" + file + ".php";
    var data_form = {
        id: id,
        upType: upType,
        fecha_final: fecha_final,
        tipo: tipo,
        adjunto: adjunto,
        hora_final: hora_final,
        observaciones: observaciones,
        type: type,
        project: project
    };
    alert(data_form);
    if (observaciones == "" || observaciones == undefined) {
        alert("El campo Observación no puede estar vacío.");
        removeLoading();
        return;
    }
    if (fecha_final == undefined || fecha_final == "") {
        alert("El campo Fecha de Entrega no puede estar vacío.");
        removeLoading();
        return;
    }
    $.ajax({
        type: "POST",
        url: url_data,
        data: data_form,
        modal: true,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                removeLoading();
                $("<div>" + data + "</div>").dialog({
                    position: 'center',
                    title: "Información",
                    stack: true,
                    closeOnEscape: false,
                    autoOpen: true,
                    resizable: true,
                    modal: true,
                    height: '200',
                    width: '250',
                    buttons: {
                        'Salir': function() {
                            $(this).dialog('close');
                            $(this).empty();
                            $(this).dialog('destroy');
                            removeLoading();
                            window.location.reload();
                        }
                    }
                });
            } else {
                removeLoading();
                $(".popup").empty();
                $(".popup").dialog('destroy');
                $(".popup").remove();
                window.location.reload();
            }
        }
    });
    return false;
}

function showLoading() {
    $("body").append("<div id='loading'><div>Cargando</div></div>");
    $('#loading').fadeIn(100);
}
function removeLoading() {
    $('#loading').fadeOut(100);
    $("#loading").remove();
}