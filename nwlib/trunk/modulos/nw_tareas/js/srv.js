var url = "/nwlib6/modulos/";
dialogExtendOptions = {
    "maximize": true,
    "minimize": true,
    "close": true,
    "dblclick": 'maximize',
    "titlebar": false
};

var usuario_inactivo;
function ini() {
    usuario_inactivo = setTimeout('location="' + url + 'nw_tareas/inactive.php"', 100000); // 100 segundos
}
function parar() {
    clearTimeout(usuario_inactivo);
    usuario_inactivo = setTimeout('location="' + url + 'nw_tareas/inactive.php"', 100000); // 100 segundos
}


//document.body.onclick = function() {
//    parar();
//};
//document.body.onmousemove = function() {
//    parar();
//};

//$(window).load(function() {
////    ini();
//    loadEncUser();
//    loadMain();
//    loadCalendar(1, 0, 0, 0, 0);
//    notifications();
//    loadNotifications();
//
//    setInterval("loadMain()", 10000);
//    setInterval("notifications()", 10000);
////setInterval("loadCalendar(1, 0, 0, 0, 0)", 10000);
//
//});

function searchTask(form) {
    var url_data = "/nwlib6/modulos/nw_tareas/src/buscar/resultados.php";
    var data_form = $("#" + form).serialize();
    showLoading();
    $('.loadSearchResults').dialog('destroy');
    $('.loadSearchResults').empty();
    $('.loadSearchResults').remove();
    $.ajax({
        type: "POST",
        url: url_data,
        data: data_form,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            removeLoading();
            $("<div class='loadSearchResults'>" + data + "</div>").dialog({
                position: 'center',
                show: "slide",
                title: "Tarea",
                closeOnEscape: true,
                autoOpen: true,
                resizable: true,
                modal: true,
                height: '500',
                width: '900',
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    removeLoading();
                },
                buttons: {
                    'Salir': function() {
                        $(this).empty();
                        $(this).dialog('close');
                        $(this).dialog('destroy');
                        removeLoading();
                    }
                }
            }).dialogExtend(dialogExtendOptions).parent('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
            ;
        }
    });
}
function setParamRecordListTwo(user, priority, estado) {
    $("#formListTaskHome").empty();
    $("#formListTaskHome").load(url + 'nw_tareas/list_tareas.php', {user: user, priority: priority, estado: estado});
}
function setParamRecordList(user, priority, estado) {
    history.pushState(null, "Lista de Tareas", "?lists=nw&pr=" + priority + "&u=" + user + "&e=" + estado + "#list");
    showLoading();
    $('.show_contend_popup').dialog('destroy');
    $(".show_contend_popup").load(url + 'nw_tareas/list_tareas.php', {
        user: user, priority: priority, estado: estado
    }, function() {
        $("#show_contend_popup").dialog({
            position: 'center',
            title: "Lista de Tareas",
            closeOnEscape: true,
            resizable: false,
            modal: true,
            height: '500',
            width: '97%',
            close: function() {
                $(this).empty();
                $(this).dialog('destroy');
                removeLoading();
                history.pushState(null, "Tarea", "tareas");
            },
            buttons: {
                'Salir': function() {
                    $(this).empty();
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                    removeLoading();
                    history.pushState(null, "Tarea", "tareas");
                }
            }
        });
        ;
    });
}

function seetareaDialog(id, a, b, c, d, div, tmov, type) {
//    window.location.hash = "task" + id;
    history.pushState(null, "Tarea" + id, "/ShowT/" + id + "/" + a + "/" + b + "/" + c + "/" + d + "/" + div + "#" + id);
    showLoading();
    $('body').append("<div id='show_contend_popup" + id + "'></div>");
    $("#show_contend_popup" + id + "").load(url + 'nw_tareas/see_tarea.php', {
        id: id,
        a: a, b: b, c: c, d: d, e: div, tmov: tmov
    }, function() {
        $("#body_max").addClass("efectBlur");
        $("#show_contend_popup" + id + "").dialog({
            position: 'center',
//            show: "slide",
            title: "Tarea #" + id,
            stack: true,
            closeOnEscape: false,
            autoOpen: true,
            resizable: false,
            modal: true,
            height: '500',
            width: '1900',
            close: function() {
                $(this).empty();
                $(this).dialog('destroy');
                removeLoading();
                loadCalendarBlock(a, b, c, d, div);
                history.pushState(null, "Tarea", "/tareas");
                $("#body_max").removeClass("efectBlur");
            },
            buttons: {
                'Salir': function() {
                    $(this).empty();
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                    removeLoading();
                    loadCalendarBlock(a, b, c, d, div, type, type);
                    history.pushState(null, "Tarea", "/tareas");
                    $("#body_max").removeClass("efectBlur");
                }
            }
        }).dialogExtend(dialogExtendOptions).parent('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
        ;
    });
}
function SeeCronograma(id) {
//    window.location.hash = "task" + id;
    //   history.pushState(null, "Tarea" + id, "/ShowT/" + id + "/" + a + "/" + b + "/" + c + "/" + d + "/" + div + "#" + id);
    //   window.location = "?task=" + id + "&a=" + a + "&b=" + b + "&c=" + c + "&d=" + d + "&div=" + div + "#" + id;
    showLoading();
    $('.show_contend_popup').dialog('destroy');
    $(".show_contend_popup").load(url + 'projectplan/projectplan_vista.php', {
        id: id
    }, function() {
        $("#show_contend_popup").dialog({
            position: 'center',
            show: "slide",
            title: "Tarea",
            closeOnEscape: true,
            autoOpen: true,
            resizable: true,
            modal: true,
            height: '500',
            width: '900',
            close: function() {
                $(this).empty();
                $(this).dialog('destroy');
                removeLoading();
            },
            buttons: {
                'Salir': function() {
                    $(this).empty();
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                    removeLoading();
//                    loadCalendarBlock(a, b, c, d, div);
//                    history.pushState(null, "Tarea", "/tareas");
                }
            }
        });
        ;
    });
}
function loadUsersList() {
    $("#lists_tasks_users").empty();
    $("#lists_tasks_users").load(url + 'nw_tareas/src/lists/list_users.php');
}
function loadList(scroll) {
    if (scroll == undefined) {
        scroll = 0;
    }
    var data = $("#formListTask").serialize();
    $("#lists_tasks").empty();
    $("#lists_tasks").load(url + 'nw_tareas/src/lists/list_task.php', {data: data, scroll: scroll});
//    setTimeout(function() {
//        $("#lists_tasks").scrollTop(scroll);
//    }, 2000);
}
function SeeTarea(id, a, b, c, d, div, type) {
    showLoadingSee();
    history.pushState(null, "Tarea" + id, "?Stask=" + id + "&a=" + a + "&b=" + b + "&c=" + c + "&d=" + d + "&div=" + div + "#" + id);
    $("#see").load(url + 'nw_tareas/see_tarea.php', {
        id: id,
        a: a, b: b, c: c, d: d, e: div, type: type
    });
    $("body").append("<style>.closeWindow{display: block;}</style>");
    $("#see").fadeIn();
}
function loadCalendarBlock(a, b, c, d, div, divclass, type) {
    if (div < 10) {
        div = "0" + div;
    } else {
        div = "" + div;
    }
    if (type == undefined) {
        type = "";
    }
    if (type == "") {
        type = "";
    }
    if (divclass == undefined) {
        divclass = "box_contend_notes";
    }
    if (divclass == "") {
        divclass = "box_contend_notes";
    }
    var div_box = "." + divclass + div;
    $(div_box).load(url + 'nw_tareas/src/calendar/nw_calendar_blocks.php', {
        a: a,
        b: b,
        c: c,
        d: d,
        type: type
    });
}

function listTaskPr(i, p) {
    $(".show_contend_popup").load(url + 'nw_tareas/src/projects/lists_taks.php', {
        id: i,
        id_enc: p
    }, function() {
        $("#show_contend_popup").dialog({
            show: "slide",
            closeOnEscape: false,
            stack: true,
            autoOpen: true,
            resizable: true,
            modal: true,
            height: '600',
            width: '700',
            close: function() {
                $(this).empty();
                $(this).dialog('destroy');
            },
            buttons: {
                'Salir': function() {
                    $(this).empty();
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                }
            }
        });
    });
}


function notifications() {
    $("#notifications").load(url + 'nw_tareas/notifications.php');
}

function loadMain(us) {
    $("#main").load(url + 'nw_tareas/nw_tareas.php', {us: us});
}
function loadEncUser() {
    $("#enc_main_user_dats").append("<div class='usersEnc'></div>");
    $(".usersEnc").load(url + 'nw_tareas/user_enc.php');
}
function loadFilters() {
    $("#enc_main_user_dats").append("<div class='filteres'></div>");
    $(".filteres").load(url + 'nw_tareas/src/filters.php');
}
function loadCalendar(v, m, y, d, u) {
    showLoading();
//     $("#calendar_nw").remove();
//     $("body").append("<div id='calendar_nw'></div>");
    if (v == 1) {
        v = "lista";
    } else
    if (v == 2) {
        v = "cuadros";
    }
    $("#calendar_nw").load(url + 'nw_tareas/nw_calendar.php', {vista: v, month: m, year: y, day: d, users: u});
}
function loadCalendarInto(v, m, y, d, u) {
    showLoading();
    $("#calendar_nw").remove();
    $(".selecione_this").fadeOut();
    $("#see_calendar").append("<div id='calendar_nw'></div>");
    if (v == 1) {
        v = "lista";
    }
    else
    if (v == 2) {
        v = "cuadros";
    }
    else
    if (v == 3) {
        v = "lista_inicial";
    }
    $("#calendar_nw").load(url + 'nw_tareas/nw_calendar.php', {vista: v, month: m, year: y, day: d, users: u});
    $("#see_calendar").append(" <link rel='stylesheet' type='text/css' href='/nwlib6/modulos//nw_tareas/css/calendarInto.css' />");
}
//document.onselectstart = new Function("return false");
//if (window.sidebar) {
//    document.onmousedown = disableselect();
//    document.onclick = reEnable();
//}
bPreguntar = true;
time = "";
function ConteoAscendente(h, m, s, id) {
    var segundos = s++;
    var minutos = m;
    var horas = h;
    if (segundos == 59) {
        s = 0;
        minutos = m++;
    }
    if (minutos == 59 && segundos == 59) {
        m = 0;
        horas = h++;
    }
    var divSegundo = document.getElementById("segundos" + id);
    var divMinuto = document.getElementById("minutos" + id);
    var divHora = document.getElementById("horas" + id);
    divSegundo.innerHTML = "<font>" + segundos + "</font>";
    divMinuto.innerHTML = "<font>" + minutos + "</font>";
    divHora.innerHTML = "<font>" + horas + "</font>";
    time = setTimeout("ConteoAscendente(" + h + "," + m + "," + s + ", " + id + ")", 1000);
    window.onbeforeunload = preguntarAntesDeSalir;
}
function pausarConteo(id, tiempo) {
    clearTimeout(time);
    updateTaskConteo(id, tiempo);
    window.onbeforeunload = nada;
}
function nada() {
    return;
}
function preguntarAntesDeSalir() {
    if (bPreguntar)
        return "Ha iniciado una tarea y ha transcurrido tiempo desde que la inició. Si cierra la tarea y no guarda puede perder el tiempo dedicado.  ¿Seguro que quieres salir?";
}
function saveTimeInterval(id, tiempo) {
    var url_data = url + "nw_tareas/srv/saveTimeInterval.php";
    $.ajax({
        type: "POST",
        url: url_data,
        data: {id: id, tiempo: tiempo},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $(this).empty();
            $(this).dialog('destroy');
        }
    });
    return false;
}
function updateTaskConteo(id, tiempo) {
    showLoading();
    var url_data = url + "nw_tareas/srv/updateTaskConteo.php";
    $.ajax({
        type: "POST",
        url: url_data,
        data: {id: id, tiempo: tiempo},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            removeLoading();
            $(this).empty();
            $(this).dialog('destroy');
        }
    });
    return false;
}
function insertTaskConteo(id, tiempo) {
    showLoading();
    var url_data = url + "nw_tareas/srv/insertTaskConteo.php";
    $.ajax({
        type: "POST",
        url: url_data,
        data: {id: id, tiempo: tiempo},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            removeLoading();
            $(this).empty();
            $(this).dialog('destroy');
        }
    });
    return false;
}

function reLoad() {
    $('.box_tareas').fadeIn(300);
    $(".box_tareas").load(url + "nw_tareas.php");
}
function loadWalk(p, u) {
    if (p == undefined) {
        p = 0;
    }
    $('#walk').fadeIn(300);
    $("#walk").load(url + "nw_tareas/walk.php", {id: p, us: u});
}

function setParamRecordOld(user, priority) {
    $(".carg").load(url + 'nw_tareas/list_tareas.php', {
        user: user, priority: priority
    }, function() {
        $("#carg").dialog({
            closeOnEscape: true,
            resizable: true,
            modal: true,
            height: '600',
            width: '800',
            close: function() {
                $(this).empty();
                $(this).dialog('destroy');
            },
            buttons: {
                'Salir': function() {
                    $(this).empty();
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                }
            }
        });
    });
}

function update(a, b, c, d, div) {
    showLoading();
    var url_data = url + "nw_tareas/srv/update.php";
    var data_form = $("#form_two").serialize();
    if (data_form.usuario_asignado == "") {
        data_form.usuario_asignado = 0;
    }
//    alert(data_form);
    $.ajax({
        type: "POST",
        url: url_data,
        data: data_form,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
//                alert(data);
            }
            var positionList = $(".list_tarea").scrollTop();
            if (a == "none") {
                window.location.reload();
                return;
            }
            removeLoading();
            $(this).empty();
            $(this).dialog('destroy');
            loadCalendarBlock(a, b, c, d, div);
            loadList(positionList);
            $("#see").empty();
            $("#see").fadeOut();
        }
    });
    return false;
}
function ubication(lat, lon, dir, id) {
    var url_data = url + "nw_tareas/srv/ubication.php";
    var data_form = {};
    $.ajax({
        type: "POST",
        url: url_data,
        data: {lat: lat, lon: lon, dir: dir, id: id},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
//            alert("ubicación guardada correctamente");
            $(this).empty();
            $(this).dialog('destroy');
        }
    });
    return false;
}
function comentBox(id, tipo) {
    $(".comments" + id).load(url + 'nw_tareas/src/comments/comments.php', {id: id, tipo: tipo});
}
function commentInt(p) {
    showLoading();
    var url_data = url + "nw_tareas/src/comments/agregar.php";
    var data_form = $("#form_comment" + p).serialize();
    $.ajax({
        type: "POST",
        url: url_data,
        data: data_form,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
//            removeLoading();
//            $(this).dialog('close');
//            $(this).empty();
//            $(this).dialog('destroy');
            removeLoading();
            comentBox(p, 1);
            //  window.location.reload();
        }
    });
    return false;
}
function publicatInt() {
//    showLoading();
    if ($("#comentario").val() == "") {
        alert("Por favor, ingrese el mensaje.");
        $("#comentario").focus();
        return false;
    }
    var url_data = url + "nw_tareas/src/walk/agregar.php";
    var data_form = $("#form_public").serialize();
    $.ajax({
        type: "POST",
        url: url_data,
        data: data_form,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
//            alert(data);
//            $("<div>" + data + "</div>").dialog({
//                buttons: {
//                    'Salir': function() {
//                        $(this).dialog('close');
//                        $(this).empty();
//                        $(this).dialog('destroy');
//                        removeLoading();
//                        window.location.reload();
//                    }
//                }
//            });
//            removeLoading();
//            $(this).dialog('close');
//            $(this).empty();
//            $(this).dialog('destroy');
//            removeLoading();
            window.location.reload();
        }
    });
    return false;
}
function validate() {
    if ($("#comentario").val() == "") {
        alert("Por favor, ingrese el mensaje.");
        $("#comentario").focus();
        return false;
    }
    return true;
}
function deletField(p) {
    showLoading();
    var url_data = url + "nw_tareas/src/walk/delete.php";
    var data_form = {};
    data_form["id"] = p;
    $.ajax({
        type: "POST",
        url: url_data,
        data: data_form,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
//            $("<div>" + data + "</div>").dialog({
//                buttons: {
//                    'Salir': function() {
//                        $(this).dialog('close');
//                        $(this).empty();
//                        $(this).dialog('destroy');
//                        removeLoading();
//                        window.location.reload();
//                    }
//                }
//            });
            removeLoading();
            $(this).dialog('close');
            $(this).empty();
            $(this).dialog('destroy');
            removeLoading();
            window.location.reload();
        }
    });
    return false;
}
function FromUpdate(id, estado, fecha, v, m, y, d, u) {
    showLoading();
    $("#update_for").dialog("destroy");
    $("#update_for").load(url + 'nw_tareas/srv/form_update.php', {
        id: id, estado: estado, fecha: fecha,
        a: v, b: m, c: y, d: d, e: u
    }, function() {
        $("#body_max").addClass("efectBlur");
        $("#update_for").dialog({
//            show: "slide",
            closeOnEscape: true,
            autoOpen: true,
            resizable: false,
            modal: true,
            height: '500',
            width: '600',
            close: function() {
                $(this).empty();
                $(this).dialog('destroy');
            },
            buttons: {
                'Guardar': function() {
                    var publico = $("#publico").val();
                    var hora = $("#hora_task").val();
                    var hora_estimada = $("#hora_estimada_task").val();
                    var respuesta = $("#respuesta").val();
                    if (hora == "" && publico == "SI") {
                        $("#hora_task").focus().after("<span class='error_ax'>Ingrese la hora</span>");
                        return false;
                    } else {
                        $("#hora_task").val("8:00");
                        $(".error_ax").fadeOut();
                    }
                    if (hora_estimada == "" && publico == "SI" || hora_estimada == "0:00" && publico == "SI") {
                        $("#hora_estimada_task").focus().after("<span class='error_ax'>Ingrese la hora estimada</span>");
                        return false;
                    } else {
                        $("#hora_estimada_task").val("0:30");
                        $(".error_ax").fadeOut();
                    }
                    if (respuesta == "") {
                        $("#respuesta").focus().after("<span class='error_ax'>Ingrese la descripción</span>");
                        return false;
                    } else {
                        $(".error_ax").fadeOut();
                    }
                    $("#form_two").submit();
                    removeLoading();
                    $(this).dialog('close');
                    $(this).empty();
                    $(this).dialog('destroy');
                    $("#body_max").removeClass("efectBlur");
//                    $(this).empty();
//                    $(this).dialog('destroy');
                },
                'Salir': function() {
                    $(this).dialog('close');
                    $(this).empty();
                    $(this).dialog('destroy');
                    removeLoading();
                    $("#body_max").removeClass("efectBlur");
                }
            }
        });
    });
}
function loadNotifications() {
    $("#box_notifications_load").load(url + 'nw_tareas/notifications_lists.php');
}
function loadNotificationsVencidas() {
    $("#box_notifications_load").load(url + 'nw_tareas/notifications_lists_vencidas.php');
}
function loadMainProyects() {
    $("#proyects").load(url + 'nw_tareas/src/projects/projects.php');
}