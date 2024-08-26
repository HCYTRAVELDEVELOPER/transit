var url = "/nwlib6/modulos/";


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


function setParamRecordList(user, priority, estado) {
    history.pushState(null, "Lista de Tareas", "?lists=nw&pr=" + priority + "&u=" + user + "&e=" + estado + "#list");
    showLoading();
    $('.show_contend_popup').dialog('destroy');
    $(".show_contend_popup").load(url + 'nw_tareas/list_tareas.php', {
        user: user, priority: priority, estado: estado
    }, function() {
        $("#show_contend_popup").dialog({
            position: 'center',
            show: "slide",
            title: "Lista de Tareas",
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

function seetareaDialog(id, a, b, c, d, div) {
//    window.location.hash = "task" + id;
    history.pushState(null, "Tarea" + id, "/ShowT/" + id + "/" + a + "/" + b + "/" + c + "/" + d + "/" + div + "#" + id);
    //   window.location = "?task=" + id + "&a=" + a + "&b=" + b + "&c=" + c + "&d=" + d + "&div=" + div + "#" + id;
    showLoading();
    $('.show_contend_popup').dialog('destroy');
    $(".show_contend_popup").load(url + 'nw_tareas/see_tarea.php', {
        id: id,
        a: a, b: b, c: c, d: d, e: div
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
                loadCalendarBlock(a, b, c, d, div);
                history.pushState(null, "Tarea", "/tareas");
            },
            buttons: {
                'Salir': function() {
                    $(this).empty();
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                    removeLoading();
                    loadCalendarBlock(a, b, c, d, div);
                    history.pushState(null, "Tarea", "/tareas");
                }
            }
        });
        ;
    });
}
function SeeTarea(id, a, b, c, d, div) {
    showLoadingSee();
    history.pushState(null, "Tarea" + id, "?Stask=" + id + "&a=" + a + "&b=" + b + "&c=" + c + "&d=" + d + "&div=" + div + "#" + id);
    $("#see").load(url + 'nw_tareas/see_tarea.php', {
        id: id,
        a: a, b: b, c: c, d: d, e: div
    });
}
function showLoading() {
    $('#loading').fadeIn(100);
}
function removeLoading() {
    $('#loading').fadeOut(100);
}
function showLoadingSee() {
    $('.loading_see').fadeIn(100);
}
function removeLoadingSee() {
    $('.loading_see').fadeOut(100);
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






function loadCalendarBlock(a, b, c, d, div, divclass, type) {
    if (div < 10) {
        div = "0" + div;
    } else {
        div = "" + div;
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

function listTaskPr(i,p) {
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

//$('#box_notifications_load').mouseout(function() {
//    console.log("hola");
//    ("#box_notifications_load").empty();
//});
//$("#box_notifications_load").on( "mouseleave", function() {
//    console.log("hola");
//   ("#box_notifications_load").empty();
//  });

function loadMain() {
    $("#main").load(url + 'nw_tareas/nw_tareas.php');
}
function loadEncUser(p) {
    $("#enc_main_user_dats").load(url + 'nw_tareas/user_enc.php', {data: p});
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

document.oncontextmenu = function() {
//    return false;
}
function disableselect(e) {
    return false;
}
function reEnable() {
    return true;
}
//document.onselectstart = new Function("return false");
//if (window.sidebar) {
//    document.onmousedown = disableselect();
//    document.onclick = reEnable();
//}


function myTimer() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("hora").innerHTML = t;
}
function moveCalendar(l, t) {
    var leff = l;
    console.log(t);
    var topp = t;
    var divide = {};
    if (window.innerWidth > 1000) {
        divide = 1.06;
    } else
    if (window.innerWidth < 400) {
        divide = 1;
    } else {
        divide = 1.005;
    }

    if (leff >= 2000) {
        leff = leff / divide;
    }
    else
    if (leff > 1000) {
        leff = leff / divide;
    }
    else
    if (leff < 400) {
        leff = leff / 50;
    }

    if (topp > 1000) {
        topp = topp / 1;
    }
    console.log(topp);
    $(".weekend").animate({left: -leff}, 1100);
    $("html,body").animate({scrollTop: topp + 'px'}, 1100);
    $(".weekend").draggable({axis: "x"});
    $('.weekend').draggable({cursor: "move"});

    $('.weekend').mouseover(function() {
        $(".weekend").addClass("cursor_move_hover");
    });
    $('.weekend').mousedown(function() {
        $(".weekend").removeClass("cursor_move_hover");
        $(".weekend").addClass("cursor_move");
    });
    $('.weekend').mouseup(function() {
        $(".weekend").removeClass("cursor_move");
        $(".weekend").addClass("cursor_move_hover");
    });
}

function removePopUp() {
    $('.carg').fadeOut(200);
    setTimeout(function() {
        $(".carg").remove();
        $(".carg").dialog('destroy');
    }, 210);
}
function reLoad() {
    $('.box_tareas').fadeIn(300);
    $(".box_tareas").load(url + "nw_tareas.php");
}
function loadWalk(p) {
    if(p == undefined) {
        p = 0;
    }
    $('#walk').fadeIn(300);
    $("#walk").load(url + "nw_tareas/walk.php", {id: p});
}

function setParamRecordOld(user, priority) {
    $(".carg").load(url + 'nw_tareas/list_tareas.php', {
        user: user, priority: priority
    }, function() {
        $("#carg").dialog({
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

$("#form_two").validate({
    rules: {
        respuesta: {
            required: true
        }
    },
    messages: {
        respuesta: "respuesta Requerido"
    },
    submitHandler: function() {
        update();
    }

});
function update(a, b, c, d, div) {
    showLoading();
    var url_data = url + "nw_tareas/srv/update.php";
    var data_form = $("#form_two").serialize();
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
            if (a == "none") {
                window.location.reload();
                return;
            }
            removeLoading();
            $(this).empty();
            $(this).dialog('destroy');
            loadCalendarBlock(a, b, c, d, div);
        }
    });
    return false;
}
function comentBox(id, tipo) {
    //showLoading();
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
            removeLoading();
            $(this).dialog('close');
            $(this).empty();
            $(this).dialog('destroy');
            removeLoading();
            comentBox(p, 1);
            //  window.location.reload();
        }
    });
    return false;
}
function publicatInt() {
    showLoading();
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
        $("#update_for").dialog({
            show: "slide",
            closeOnEscape: false,
            autoOpen: true,
            resizable: true,
            modal: true,
            height: '500',
            width: '600',
            close: function() {
                $(this).empty();
                $(this).dialog('destroy');
            },
            buttons: {
                'Guardar': function() {
                    $("#form_two").submit();
                    removeLoading();
                    $(this).dialog('close');
                    $(this).empty();
                    $(this).dialog('destroy');
//                    $(this).empty();
//                    $(this).dialog('destroy');
                },
                'Salir': function() {
                    $(this).dialog('close');
                    $(this).empty();
                    $(this).dialog('destroy');
                    removeLoading();
                }
            }
        });
    });
}