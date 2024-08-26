vnwlib = "6";
rute = "/nwlib" + vnwlib + "/modulos/nw_meeting/";
timeoutIDTime = "";
timeoutID = "";
timeoutIDTwo = "";
play = "inicia";
t_temas = 0;
t_asistentes = 0;
n_tema = 0;
id_reu = 0;
id_get = 0;
integrar_tareas = "NO";
function configAll(integra_tareas) {
    integrar_tareas = integra_tareas;
}
function delayedAlertTime(func, time) {
    timeoutIDTime = window.setTimeout(func, time);
}
function delayedAlert(func, time) {
    timeoutID = window.setTimeout(func, time);
}
function clearAlert() {
    window.clearTimeout(timeoutID);
}
function delayedAlertTwo(func, time) {
    timeoutIDTwo = window.setTimeout(func, time);
}
function clearAlertTwo() {
    window.clearTimeout(timeoutIDTwo);
}
function loadTimeInit(id) {
    id_get = id;
    if (localStorage["hour" + id_get] == "undefined" || localStorage["hour" + id_get] == undefined || localStorage["hour" + id_get] == "NaN") {
        localStorage["hour" + id_get] = 0;
    }
    if (localStorage["min" + id_get] == "undefined" || localStorage["min" + id_get] == undefined || localStorage["min" + id_get] == "NaN") {
        localStorage["min" + id_get] = 0;
    }
    if (localStorage["hour_p" + id_get] == "undefined" || localStorage["hour_p" + id_get] == undefined || localStorage["hour_p" + id_get] == "NaN") {
        localStorage["hour_p" + id_get] = 0;
    }
    if (localStorage["min_p" + id_get] == "undefined" || localStorage["min_p" + id_get] == undefined || localStorage["min_p" + id_get] == "NaN") {
        localStorage["min_p" + id_get] = 0;
    }
    var t = localStorage["hour" + id_get] + ":" + localStorage["min" + id_get];
    var t_lose = localStorage["hour_p" + id_get] + ":" + localStorage["min_p" + id_get];
    hour = localStorage["hour" + id_get];
    min = localStorage["min" + id_get];
    hour_p = localStorage["hour_p" + id_get];
    min_p = localStorage["min_p" + id_get];
    document.getElementById("play_times").innerHTML = t;
    document.getElementById("time_lose").innerHTML = t_lose;
    $(".actions_divs_decision").append(localStorage["decision" + id_get]);
    $(".actions_divs_idea").append(localStorage["idea" + id_get]);
    $(".actions_divs_tarea").append(localStorage["tarea" + id_get]);
    $(".actions_divs_nota").append(localStorage["nota" + id_get]);
}
var viewMen = "";
$(document).ready(function() {
    $(".buttonToday").click(function() {
        viewToday();
    });
    $(".buttonNext").click(function() {
        viewNext();
    });
    $(".buttonHistory").click(function() {
        viewHis();
    });
    $(".buttonDash").click(function() {
        viewDash();
    });
    $(".buttonArchivarReu").click(function() {
        var id = $(this).attr("data");
        archivarReu(id);
    });
    $(".iniciar_reu_home").click(function() {
        var id = $(this).attr("data");
        window.location = "?beginID=" + id;
    });
    $(".cancelar_reu_home").click(function() {
        var id = $(this).attr("data");
        cancelReu(id);
    });
    $(".list_date_reu").click(function() {
        var id = $(this).attr("data");
        viewReu(id);
    });
    $(".bt_action").click(function() {
        var tipo = $(this).attr("data");
//        createAction(tipo);
        createActionTwo(tipo);
    });
    $(".buttonAddReu").click(function() {
        addReu();
    });
    $(".buttonViewReu").click(function() {
        var id = $(this).attr("data");
        viewReu(id);
    });
    $(".btVerInv").click(function() {
        var id = $(this).attr("data");
        viewReu(id);
    });
    $(".checkUsers").click(function() {
        var id = $(this).attr("name");
        $(this).remove();
        $("#asist_" + id).addClass("asist_check");
        $("#asist_" + id).attr("data-check", "true");
    });
    $("#play_r").click(function() {
        play_r();
    });
    $(".finishReu").click(function() {
        var ElementosMitexto = $(".finish_selected_tema");
        var total_asists = ElementosMitexto.length;
        if (t_temas == total_asists) {
            finishReu();
            return;
        } else {
            $("<div><h1>Debe finalizar los temas</h1></div>").dialog({
                position: "top",
                title: 'Información',
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
                }
                ,
                buttons: {
                    'Entendido': function() {
                        history.pushState(null, "", "?");
                        $(this).dialog('close');
                        $(this).dialog('destroy');
                        $(this).empty();
                        $(this).remove();
                    },
                    'Omitir y finalizar': function() {
                        $(this).dialog('close');
//                        $(this).dialog('destroy');
                        $(this).empty();
                        $(this).remove();
                        finishReu();
                    }
                }
            });
        }
    });
    $(".finishReu").fadeOut(0);
    $(".bt_action").fadeOut(0);
    $(".temaCheck").click(function() {
        var id = $(this).attr("data");
        if (play == "inicia") {
            play_r("no");
        }
        selectTemaShowCheck(id);
    });


    readHoraReu();
});
function loadTotales(hoy, next, history, hoyNext, hoyEjecu, hoyNoEject) {
    $(".tHoy").append(hoy);
    $(".tNext").append(next);
    $(".tHis").append(history);
    $(".tHoyNext").append(hoyNext);
    $(".tHoyEjecut").append(hoyEjecu);
    $(".tHoyNoEjecut").append(hoyNoEject);
}
function viewHis() {
    history.pushState(null, "", "?viewHis=true");
    $(".div_redondButton").removeClass("menuActive");
    $(".buttonHistory").addClass("menuActive");
    $(".div_reus_home_dashb").fadeOut(0);
    $(".div_historial_reu").fadeIn();
}
function viewDash() {
    history.pushState(null, "", "?home");
    $(".div_redondButton").removeClass("menuActive");
    $(".buttonDash").addClass("menuActive");
    $(".div_historial_reu").fadeOut(0);
    $(".div_reus_home_dashb").fadeIn();
    $(".div_home").fadeIn();
    $(".div_proximas").fadeIn();
}
function viewNext() {
    history.pushState(null, "", "?next=true");
    $(".div_redondButton").removeClass("menuActive");
    $(".buttonNext").addClass("menuActive");
    $(".div_home").fadeOut(0);
    $(".div_historial_reu").fadeOut(0);
    $(".div_reus_home_dashb").fadeIn();
    $(".div_proximas").fadeIn();
}
function viewToday() {
    history.pushState(null, "", "?today=true");
    $(".div_redondButton").removeClass("menuActive");
    $(".buttonToday").addClass("menuActive");
    $(".div_proximas").fadeOut(0);
    $(".div_historial_reu").fadeOut(0);
    $(".div_reus_home_dashb").fadeIn();
    $(".div_home").fadeIn();
}
function createAction(tipo) {
    var data = {};
    data["id_reu"] = id_reu;
    data["tipo"] = tipo;
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nw_meeting/src/createAction.php",
        type: 'post',
        data: data,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $("<div id='popup'></div>").dialog({
                create: function(event, ui) {
                    alert("fdsadfdas");
                    $("#observaciones").focus();
                },
                position: "top",
                title: 'Nueva ' + tipo,
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: 'auto',
                width: '900px',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    $("#popup").remove();
                },
                buttons: {
                    'Aceptar': function() {
                        addAction();
                        $(this).empty();
                        $(this).dialog('destroy');
                        $("#popup").remove();
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
function createActionTwo(tipo) {
    var data = '<form id="actions_form">\n\
                         <div class="warp">\n\
                            <label>Descripción:</label>\n\
                            <textarea name="observaciones" id="observaciones"></textarea>\n\
                          </div>\n\
                       </form>';
    $("<div id='popup'></div>").dialog({
        create: function(event, ui) {
            $("#observaciones").focus();
        },
        position: "top",
        title: 'Nueva ' + tipo,
        stack: true,
        autoOpen: true,
        resizable: false,
        modal: true,
        height: 'auto',
        width: '900px',
        sticky: true,
        close: function() {
            $(this).empty();
            $(this).dialog('destroy');
            $("#popup").remove();
        },
        buttons: {
            'Aceptar': function() {
                addAction(tipo);
                $(this).empty();
                $(this).dialog('destroy');
                $("#popup").remove();
            },
            'Cerrar': function() {
                $(this).empty();
                $(this).dialog('destroy');
                $("#popup").remove();
            }
        }
    });
    $("#popup").append(data);
    $("#observaciones").focus();
}
save = false;
n_action = 0;
n_decision = 0;
n_idea = 0;
n_tarea = 0;
n_nota = 0;
function addAction(tipo) {
    var num = "";
    n_action++;
    num = n_action;
    var data = $("#actions_form").serialize();
    var encodedString = $("#observaciones").val();
//    var data_texto_ob = data.split("=");
//    var data_texto = data_texto_ob[1];
    var data_texto = encodedString;
    var html = "<div class='fila_action div_" + tipo + "' id='action_" + num + "' data='" + data_texto + "' data-type='" + tipo + "'>\n\
                           <div class='text_action' data='" + data_texto + "'>" + data_texto + "</div>\n\
                      </div>";
    $(".actions_divs_" + tipo).append(html);
    var datos = $(".actions_divs_" + tipo).html();
    localStorage[tipo + id_get] = datos;
    if (save == true) {
        $.ajax({
            url: "/nwlib" + vnwlib + "/modulos/nw_meeting/srv/createAction.php",
            type: 'post',
            data: data,
            error: function() {
                alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
            },
            success: function(data) {
                alert(data);
            }
        });
    }
}
function selectAsistentes(t) {
    t_asistentes = t;
}
//function finishReu() {
//    window.location = "?";
//}
function selectTemaShowCheck(id) {
    var ElementosMitexto = $(".selected_tema");
    var total_asists = ElementosMitexto.length;
    if (t_temas == total_asists) {
        return;
    }
    if (total_asists >= 1) {
        alert("debe finalizar el tema en curso antes de iniciar otro.");
        return;
    }
    $("#tema_" + id).addClass("selected_tema");
    $("#tema_" + id).attr("data-s", 2);
    $("#temaCheck_" + id).remove();
    $("#containT_" + id).append("<div class='tema_ok' id='tema_ok_" + id + "' data='" + id + "'>Finalizar Tema</div>");
    $(".tema_ok").click(function() {
        var d = $(this).attr("data");
        finalizaTemaShowCheck(d);
    });
}
function finalizaTemaShowCheck(id) {
    $("#tema_" + id).removeClass("selected_tema");
    $("#tema_" + id).addClass("finish_selected_tema");
    $("#tema_" + id).attr("data-s", 3);
    $("#tema_ok_" + id).remove();
    $("#containT_" + id).append("<div class='tema_finalizado' id='tema_finalizado" + id + "' data='" + id + "'>OK</div>");
    var ElementosMitexto = $(".finish_selected_tema");
    var total_asists = ElementosMitexto.length;
    if (t_temas == total_asists) {
        finishReu();
        return;
    }
}
function finishReu() {
    var data = "";
    var ElementosMitexto = $(".tema_finalizado");
    var total_asists = ElementosMitexto.length;
    var temas = new Array();
    for (var i = 0; i < total_asists; i++) {
        var num = i + 1;
        var tema = $("#tema_" + num).attr("data-i");
        var tema_text = $("#tema_" + num).attr("data-s");
        temas[i] = tema + "|" + tema_text;
    }
    var asists = new Array();
    for (var i = 0; i < t_asistentes; i++) {
        var nume = i + 1;
        var asist = $("#asist_" + nume).attr("data");
        var asist_text = $("#asist_" + nume).attr("data-check");
        asists[i] = asist + "|" + asist_text;
    }
    var totalActions = $(".fila_action").length;
    var actions = new Array();
    for (var i = 0; i < totalActions; i++) {
        var num = i + 1;
        var separation = " | ";
        if (i == totalActions - 1) {
            separation = "";
        }
        var actionss = $("#action_" + num).attr("data-type");
        var actions_text = $("#action_" + num).attr("data");
        actions[i] = actionss + " (/) " + actions_text + separation;
    }
    var duracion = $("#play_times").html();
    var time_lose = $("#time_lose").html();
    var hora = $("#hora").html();
    data += "duracion=" + duracion + "&time_lose=" + time_lose + "&hora=" + hora + "&reu=" + id_reu + "&temas=" + temas + "&asists=" + asists + "&actions=" + actions;
    var url = "/nwlib" + vnwlib + "/modulos/nw_meeting/srv/finishReu.php";
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo mas tarde.");
        },
        success: function(data) {
            if (data != "") {
                alert("error line 414: " + data);
            } else {
                $.ajax({
                    url: "/nwlib" + vnwlib + "/modulos/nw_meeting/src/finReunionShow.php",
                    type: 'post',
                    data: {},
                    error: function() {
                        alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                    },
                    success: function(data) {
                        $("<div>" + data + "</div>").dialog({
                            position: "top",
                            title: 'Finalización de Reunión',
                            stack: true,
                            autoOpen: true,
                            resizable: false,
                            modal: true,
                            height: 'auto',
                            width: '900px',
                            sticky: true,
                            close: function() {
                                localStorage["decision" + id_get] = "";
                                localStorage["idea" + id_get] = "";
                                localStorage["tarea" + id_get] = "";
                                localStorage["nota" + id_get] = "";
                                localStorage["min" + id_get] = 0;
                                localStorage["hour" + id_get] = 0;
                                window.location = "?";
                                window.location.reload();
                            }
                            ,
                            buttons: {
                                'Cerrar': function() {
                                    localStorage["decision" + id_get] = "";
                                    localStorage["idea" + id_get] = "";
                                    localStorage["tarea" + id_get] = "";
                                    localStorage["nota" + id_get] = "";
                                    localStorage["min" + id_get] = 0;
                                    localStorage["hour" + id_get] = 0;
                                    window.location = "?";
                                    window.location.reaload();
                                }
                            }
                        });
                    }
                });
            }
        }
    });
}
function selectTema(total, d) {
    t_temas = total;
    id_reu = d;
}
function selectTemaShow() {
    if (t_temas > 1) {
        if (n_tema == t_temas) {
            alert("Ha terminado los temas");
            return;
        }
        $("#tema_" + n_tema).addClass("selected_tema");
        n_tema++;
    }
}

function play_r(p) {
    $(".finishReu").fadeIn();
    $(".bt_action").fadeIn();
    if (p != "no") {
        if (play == "inicia") {
            selectTemaShow();
        }
    }
    if (play != true) {
        $("#play_r").html("Pausar");
        $("#play_r").removeClass("time_enpause");
        $("#play_r").addClass("time_enplay");
        clearAlertTwo();
        playTimer();
        play = true;
    } else {
        $("#play_r").html("Continuar");
        $("#play_r").removeClass("time_enplay");
        $("#play_r").addClass("time_enpause");
        clearAlert();
        playTimerLose();
        play = false;
    }
}
function readHoraReu() {
    var hora = $(".hora_reunion").html();
    $("#hora_reunion_enc").html(hora);
}
//hour = localStorage["hour" + id_get];
//min = localStorage["min" + id_get];
//hour_p = 00;
//min_p = 00;
function playTimer() {
    if (min >= 60) {
        min = 0;
        hour++;
    }
    localStorage["min" + id_get] = min;
    localStorage["hour" + id_get] = hour;
    var t = hour + ":" + min++;
    document.getElementById("play_times").innerHTML = t;
    delayedAlert(playTimer, 1000);
}
function playTimerLose() {
    if (min_p >= 60) {
        min_p = 0;
        hour_p++;
    }
    localStorage["min_p" + id_get] = min_p;
    localStorage["hour_p" + id_get] = hour_p;
    var t = hour_p + ":" + min_p++;
    document.getElementById("time_lose").innerHTML = t;
    delayedAlertTwo(playTimerLose, 1000);
}
function myTimer() {
    var d = new Date();
    var t = d.toLocaleTimeString();
    document.getElementById("hora").innerHTML = t;
    delayedAlertTime(myTimer, 1000);
}
function archivarReu(id) {
    $("<div><h1>¿Desea archivar esta reunión? </h1><p>Podrá verla luego en su archivador personal.</p></div>").dialog({
        position: "top",
        title: 'Archivar Reunión',
        stack: true,
        autoOpen: true,
        resizable: false,
        modal: true,
        height: 'auto',
        width: '500px',
        sticky: true,
        close: function() {
            $(this).empty();
            $(this).dialog('destroy');
        }
        ,
        buttons: {
            'Sí, deseo archivarla.': function() {
                $(this).empty();
                $(this).dialog('destroy');
                confirmArchivarReu(id);
            },
            'No, prefiero cancelar': function() {
                $(this).empty();
                $(this).dialog('destroy');
            }
        }
    });
}
function confirmArchivarReu(id) {
    $.ajax({
        url: rute + "srv/archivarReu.php",
        type: 'post',
        data: {id: id},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $(".row_" + id).remove();
            $("<div id='div'></div>").dialog({
                position: "top",
                title: 'Reunión Archivada',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: 'auto',
                width: '500px',
                sticky: true,
                close: function() {
                    history.pushState(null, "", "?");
//                    window.location.reload();
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                    $(this).empty();
                }
                ,
                buttons: {
                    'Aceptar': function() {
                        history.pushState(null, "", "?");
                        $(this).dialog('close');
                        $(this).dialog('destroy');
                        $(this).empty();
//                        window.location.reload();
                    }
                }
            });
            $("#div").append(data);
        }
    });
}
function cancelReu(id) {
    $("<div><h1>¿Desea cancelar esta reunión?</h1></div>").dialog({
        position: "top",
        title: '¿Cancelar Reunión?',
        stack: true,
        autoOpen: true,
        resizable: false,
        modal: true,
        height: 'auto',
        width: '500px',
        sticky: true,
        close: function() {
//            history.pushState(null, "", "?");
//            window.location.reload();
            $(this).empty();
            $(this).dialog('destroy');
        }
        ,
        buttons: {
            'Aceptar': function() {
                $(this).empty();
                $(this).dialog('destroy');
                confirmCancelReu(id);
            },
            'Cancelar': function() {
//                history.pushState(null, "", "?");
//                $(this).dialog('close');
                $(this).empty();
                $(this).dialog('destroy');
            }
        }
    });
}
function confirmCancelReu(id) {
    $.ajax({
        url: rute + "srv/cancelReu.php",
        type: 'post',
        data: {id: id},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $(".row_" + id).remove();
//            var actual = $(".tHoy").html();
//            $(".tHoy").html(actual - 1);
            $("<div id='div'></div>").dialog({
                position: "top",
                title: 'Reunión Cancelada',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: 'auto',
                width: '500px',
                sticky: true,
                close: function() {
                    history.pushState(null, "", "?");
//                    window.location.reload();
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                    $(this).empty();
                }
                ,
                buttons: {
                    'Aceptar': function() {
                        history.pushState(null, "", "?");
                        $(this).dialog('close');
                        $(this).dialog('destroy');
                        $(this).empty();
//                        window.location.reload();
                    }
                }
            });
            $("#div").append(data);
        }
    });
}
function viewReu(id) {
    var div = "view";
    $("#reu" + div).remove();
    $("body").append("<div id='reu" + div + "'></div>");
    history.pushState(null, "Nuevo", "?view=" + id);
    $("#reu" + div).empty();
    var ruta = rute + "src/viewReu.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {id: id, div: div},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
            $("#reu" + div).remove();
        },
        success: function(data) {
            $("#reu" + div).dialog({
                position: "top",
                title: 'Reunión',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: 'auto',
                width: '900px',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                    $("#reu" + div).remove();
                }
                ,
                buttons: {
                    'Cerrar': function() {
                        history.pushState(null, "", "?");
                        $(this).dialog('close');
                        $(this).dialog('destroy');
                        $(this).empty();
                        $("#reu" + div).remove();
                    }
                }
            });
            $("#reu" + div).append(data);
        }
    });
}
function addReu() {
    $("#new_reu").remove();
    $("body").append("<div id='new_reu'></div>");
    history.pushState(null, "Nuevo", "?addReu=true");
    $("#new_reu").empty();
    var ruta = rute + "src/addReu.php";
    $.ajax({
        url: ruta,
        type: 'post',
//        data: {id_cliente: id_cliente},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
            $("#new_reu").remove();
        },
        success: function(data) {
            $("body").addClass("no_scroll");
            $("#new_reu").dialog({
                position: "top",
                title: 'Nueva Reunión',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: 'auto',
                width: '900px',
                sticky: true,
                close: function() {
                    $("body").removeClass("no_scroll");
                    history.pushState(null, "", "?");
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                    $(this).empty();
                    $("#new_reu").remove();
                }
                ,
                buttons: {
                    'Aceptar': function() {
                        validateForm();
//                        $(this).dialog('close');
//                        $(this).dialog('destroy');
//                        $(this).empty();
//                        $("#new_reu").remove();
                    },
                    'Cancelar': function() {
                        $("body").removeClass("no_scroll");
                        history.pushState(null, "", "?");
                        $(this).dialog('close');
                        $(this).dialog('destroy');
                        $(this).empty();
                        $("#new_reu").remove();
                    }
                }
            });
            $("#new_reu").append(data);
        }
    });
}
function validateForm() {
    $(".error").remove();
    if ($(".titulo").val() == "") {
        $(".titulo").focus().after("<span class='error'>Ingrese el título</span>");
        return false;
    }
    if ($(".objetivo_principal").val() == "") {
        $(".objetivo_principal").focus().after("<span class='error'>Ingrese el objetivo principal</span>");
        return false;
    }
    if ($(".lugar").val() == "") {
        $(".lugar").focus().after("<span class='error'>Ingrese el lugar</span>");
        return false;
    }
    if ($(".fecha").val() == "") {
        $(".fecha").focus().after("<span class='error'>Ingrese la fecha</span>");
        return false;
    }

    if ($("#hora_task").val() == "") {
        $("#hora_task").focus().after("<span class='error'>Ingrese la hora</span>");
        return false;
    }
    if ($("#tiempo_previsto_task").val() == "") {
        $("#tiempo_previsto_task").focus().after("<span class='error'>Ingrese el tiempo previsto</span>");
        return false;
    }
//    if ($(".temas").val() == "" || !emailreg.test($(".temas").val())) {
//        $(".temas").focus().after("<span class='error'>Ingrese un email correcto</span>");
//        return false;
//    } 
    crearReu();
}
function  crearReu() {
    var ElementosMitexto = $(".list_item_asistentes");
    var total_asists = ElementosMitexto.length;
    if (total_asists == 0) {
        alert("Debe agregar mínimo un asistente");
        document.getElementById('asistentes').focus();
        return;
    }
    var ElementosTemas = $(".list_item_temas");
    var total_temas = ElementosTemas.length;
    if (total_temas == 0) {
        alert("Debe agregar mínimo un tema");
        document.getElementById('temas').focus();
        return;
    }
    $("body").append("<div class='loading_rew'>Cargando, por favor espere</div>");
    var asistents = new Array();
    for (var i = 0; i < total_asists; i++) {
        var asistente = $("#asistente_" + i).attr("email-data");
        var asistente_text = $("#asistente_" + i).attr("name-data");
        asistents[i] = asistente + "|" + asistente_text;
    }
    var temas = new Array();
    for (var ii = 0; ii < total_temas; ii++) {
        var tema = $("#tema_" + ii).attr("name");
        temas[ii] = tema;
    }
    var data = $("#new_reu_form").serialize();
    data += "&asistentes_todos=" + asistents;
    data += "&temas=" + temas;
    var url = "/nwlib" + vnwlib + "/modulos/nw_meeting/srv/crearReu.php";
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function(dat) {
            if (dat != "") {
                alert(dat);
            }
            if (integrar_tareas == "SI") {
                crearTarea(data);
            } else {
                $(".loading_rew").remove();
                window.location.reload();
            }
        }
    });
}
function crearTarea(data) {
    var url = "/nwlib" + vnwlib + "/modulos/nw_meeting/srv/crearTarea.php";
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
            }
            $(".loading_rew").remove();
            window.location.reload();
        }
    });
}
function dar_formato(num) {
    var cadena = "";
    var aux;
    var cont = 1, m, k;
    if (num < 0)
        aux = 1;
    else
        aux = 0;
    num = num.toString();
    for (m = num.length - 1; m >= 0; m--) {
        cadena = num.charAt(m) + cadena;
        if (cont % 3 == 0 && m > aux)
            cadena = "." + cadena;
        else
            cadena = cadena;
        if (cont == 3)
            cont = 1;
        else
            cont++;
    }
    cadena = cadena.replace(/.,/, ",");
    return cadena;
}