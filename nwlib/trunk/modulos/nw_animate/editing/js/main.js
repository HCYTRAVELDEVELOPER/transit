var zoom = 1;
function jsLoadContextMenu() {
    var especial = $(".box_object");
    var especialLeft = $(".listObjectLeft");
    especial.bind("contextmenu", function(e) {
        var self = this;
        var data = $(self).attr("name");
        var type = $(self).attr("type");
        var x = e.pageX;
        var y = e.pageY;
        menuContextObjects(data, type, x, y);
    });
    especialLeft.bind("contextmenu", function(e) {
        var self = this;
        var data = $(self).attr("name");
        var type = $(self).attr("type");
        var x = e.pageX;
        var y = e.pageY;
        menuContextObjects(data, type, x, y);
    });
}
function menuContextObjects(data, type, x, y) {
    selectedObject(data);
    $(".contextmenu").remove();
    var html = "<div class='contextmenu' style='left: " + x + "px; top: " + y + "px;' >";
    html += "<div class='contextmenuIntern'>";
    html += "<div class='contextmenuButtons buttonEditarNw '  >Editar</div>";
    html += "<div class='contextmenuButtons buttonEliminarNw '  >Eliminar</div>";
    html += "<div class='contextmenuButtons buttonAnimarNw '  >Movimiento</div>";
    html += "<div class='contextmenuButtons buttonDeleteAnimarNw '  >Borrar Animación</div>";
    html += "<div class='contextmenuButtons buttonBloquearNw  '  >Bloquear</div>";
    html += "<div class='contextmenuButtons buttonAddaCapaNw '  >Agregar a capa</div>";
    html += "</div>";
    html += "</div>";
    $("body").append(html);
    $(".buttonEditarNw").click(function() {
        formNew(data);
    });
    $(".buttonEliminarNw").click(function() {
        deleteObjects(data);
    });
    $(".buttonBloquearNw").click(function() {
        bloquearObjects(data);
    });
    $(".buttonDeleteAnimarNw").click(function() {
        buttonDeleteAnimar(data);
    });
    $(".buttonAnimarNw").click(function() {
        anima = "si";
        $(".buttonEnc").fadeOut();
        var da = data.split(",");
        var id = da[0];
        var v = da[1];
        var r = da[2];
        activaInterpolacionMovimiento(id, v, r);
        insertFotogramasObject();
    });
    $(".buttonAddaCapaNw").click(function() {
        addACapaObjects(data);
    });
    $(".contextmenu").mouseleave(function() {
        $(".contextmenu").remove();
    });
    if (type == "capa") {
        $(".buttonAnimarNw").remove();
        $(".buttonDeleteAnimarNw").remove();
        $(".buttonAddaCapaNw").remove();
    }
    return false;
}
function selectedObject(d) {
    $(".box_object").removeClass("selectedObject");
    $("#object_" + d).addClass("selectedObject");
    $(".imgObject").removeClass("selectedObject_inter");
    $("#imgObject_" + d).addClass("selectedObject_inter");
    $(".objectList").removeClass("selectedObjectLeft");
    $(".objectList_" + d).addClass("selectedObjectLeft");
}
function zoomCenter(p) {
    if (p == 1) {
//        zoom += 0.5;
        zoom += 0.2;
    } else
    if (p == 0) {
//        zoom -= 0.5;
        zoom -= 0.2;
    }
    if (zoom <= 0.2) {
        zoom = 0.2;
    }
    $('.contendImg').animate({zoom: zoom});
//    $('.contendImg').animate({borderSpacing: zoom}, {
//        step: function(now) {
//            if (now <= 1) {
//                now = 1;
//            }
//            $(this).css('zoom', now);
////            $(this).css('-webkit-transform', 'scale(' + now + ')');
////            $(this).css('-moz-transform', 'scale(' + now + ') ');
////            $(this).css('-ms-transform', 'scale(' + now + ') ');
////            $(this).css('-o-transform', 'scale(' + now + ') ');
////            $(this).css('transform', 'scale(' + now + ') ');
//        },
//        duration: 'fast'
//    }, 'linear');
}
function creaRastro(id, x, y, xx, yy) {
    var height = $("#object_" + id).height();
    var left = y + height;
//    $("#object_" + id).append("<div class='rastroOne rastro_" + id + "'></div>");
//    $("#contendImg").append("<div class='rastroOne rastro_" + id + "'></div>");
//    $(".rastro_" + id).css("left", x);
//    $(".rastro_" + id).css("top", left);
//    $(".rastro_" + id).css("margin-left", xx);
//    $(".rastro_" + id).css("margin-top", yy);
}
function savePropertiresEscena(id) {
    var background = $(".fondo").val();
    var url = "srv/savePropertiresEscena.php";
    $.ajax({
        type: "POST",
        url: url,
        data: {id: id, background: background},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
            }
            loadObjectsCenter();
//            window.location.reload();
        }
    });
}
function resizeCenter() {
    var w = $("body").width();
    var w_left = $(".capas").width();
    var width = w - w_left;
    $("#center").width(width);
}
function loadObjects() {
//    var escena = $(".addBox").attr("name");
    var escena = $("#center").attr("data-escena");
//    $("#loadObjects").load("/nwlib6/modulos/nw_animate/editing/src/objectsLeft.php", {escena: escena});
    $.ajax({
        url: 'src/objectsLeft.php',
        data: {escena: escena},
        type: 'post',
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $("#loadObjects").html(" ");
            $("#loadObjects").append(data);
        }
    });
}
function loading() {
    $("body").append("<div class='loading_div'><h1>Cargando...</h1></div>");
}
function createRastroObjectEditing(x, y, m) {
    $(".movimientosTest").append("<div class='movimientosPuntos' style='left: " + x + m + "; top: " + y + m + ";'></div>");
}
function openCodeOcult(d, e) {
    var existe = $(".popup").val();
    if (existe != undefined) {
        return;
    }
    var ruta = "src/codeOcult.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {id_enc: d, escena: e},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $(data).dialog({
                resizable: true,
                modal: true,
                height: '600',
                width: '800',
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
                        saveCode(d, e);
                    }
                }
            });
            $(".codigo").focus();
        }
    });
}
function saveCode(d, e) {
    var data = $("#form_code").serialize();
    data += "&d=" + d + "&e=" + e;
    $.ajax({
        url: "srv/codeOcult.php",
        type: 'post',
        data: data,
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
//            alert(data);
            loadObjectsCenter();
            loadObjects();
        }
    });
}
function formNew(id, type) {
    if (id == undefined) {
        id = 0;
    }
    var existe = $(".popup").val();
    if (existe != undefined) {
        return;
    }
    var ruta = "src/newObject.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {id: id, tipo: type},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $('body').append("<div class='popup'></div>");
            $(".popup").dialog({
                resizable: true,
                modal: true,
                height: '600',
                width: '800',
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
                        save(id);
                        $(this).dialog('close');
                        $(this).empty();
                        $(".popup").remove();
                    }
                }
            });
            $(".popup").append(data);
        }
    });
}
function loadObjectsCampus(id) {
    var ruta = "src/objectCampus.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {id: id, im: im},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            im++;
            $('#contendImg').append(data);
            $("#object_" + id).draggable();
            $("#object_" + id).resizable();
        }
    });
}
function save(id) {
    if (id == undefined) {
        id = 0;
    }
    var url = "srv/saveObject.php";
    var data = $("#form").serialize();
    var id_enc = $(".addBox").attr("id");
    var escena = $(".addBox").attr("name");
    data += "&id_enc=" + id_enc + "&escena=" + escena;
    if (id != undefined && id != 0) {
        data += "&id=" + id;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
            }
//            loadObjects();
//            
//        saveFinal();
//        loadObjectsCampus(data);
//            window.location.reload();
            loadObjectsCenter();
            loadObjects();
        }
    });
    return false;
}
function buttonDeleteAnimar(id) {
    if (!confirm("Advertencia de Seguridad!  \n ¿desea eliminar la animación de este objeto? ")) {
        return;
    }
    var url = "srv/deleteAnimationObject.php";
    $.ajax({
        type: "POST",
        url: url,
        data: {id: id},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            alert(data);
            loadObjectsCenter();
            loadObjects();
//            window.location.reload();
        }
    });
}
function deleteObjects(id) {
    if (!confirm("Advertencia de Seguridad!  \n ¿desea eliminar este objecto? ")) {
        return;
    }
    var url = "srv/deleteObject.php";
    $.ajax({
        type: "POST",
        url: url,
        data: {id: id},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
                return;
            }
            loadObjectsCenter();
            loadObjects();
//            window.location.reload();
        }
    });
}
function activaInterpolacionMovimiento(id, vel, rep) {
    $("#velocidad").val(vel);
    $("#reproducir option[value=" + rep + "]").attr("selected", "selected");
    $("#object_" + id).addClass("mover_inicial");
    $(".encOptions").fadeIn();
    $(".center").css("top", "80px");
//    $(".capas").css("top", "40px");
    $(".buttonAnimarButton").addClass("display_none");
    $("#center").append("<div class='mensajeStartAnimation'></div>");
    $(".mensajeStartAnimation").load("src/mensajeStartAnimation.php");
    $(".mensajeStartAnimation").addClass("buttonBlue");
    $(".mensajeStartAnimation").fadeIn();
    $(".box_object").addClass("no_anima");
    $("#object_" + id).removeClass("no_anima");
    $(".guardarAnimation").attr("name", id);
//    $(".mover_inicial").mouseup(function() {
//        moverAnimationSrv(id);
//    });
}
function activaInterpolacionMovimientoFinal(id, left, top, opa) {
    $("#object_" + id).removeClass("mover_inicial");
    $("#object_" + id).addClass("mover_inicial_final");
    $(".mensajeStartAnimation").remove();
    $(".mensajeStartAnimation").fadeOut();
    $("#center").append("<div class='mensajeStartAnimation'></div>");
    $(".mensajeStartAnimation").load("src/mensajeStartAnimationFinal.php");
    $(".mensajeStartAnimation").addClass("buttonGreen");
    $(".mensajeStartAnimation").fadeIn();
    $(".mover_inicial").mousedown(function() {
        return false;
    });
    $(".mover_inicial_final").mouseup(function() {
        moverFinal(id, left, top, opa);
    });
}
function cerrarAnimationStart() {
    $(".box_object").removeClass("no_anima");
    $(".box_object").removeClass("mover_inicial");
    $(".mensajeStartAnimation").remove();
    $(".buttonAnimarButton").removeClass("display_none");
//    loadObjectsCenter();
//    loadObjects();
    window.location.reload();
}
function moverInicial(id_object) {
    $("#object_" + id_object).removeClass("mover_inicial");
    var p = $("#object_" + id_object).position();
    var width = $("#object_" + id_object).width();
    var height = $("#object_" + id_object).height();
//    var myMarginTop = $("#object_" + id_object).css("marginTop");
//    alert(myMarginTop);
    var opa = $("#opacidad").val();
    var lefto = p.left;
    var topo = p.top;
    activaInterpolacionMovimientoFinal(id_object, lefto, topo, opa);
}
function moverFinal(id_object, left, top, opa) {
    var p = $("#object_" + id_object).position();
    var width = $("#object_" + id_object).width();
    var height = $("#object_" + id_object).height();
    var lefto = p.left - left;
    var topo = p.top - top;
    var url = "srv/saveAnimateMovObjectFinal.php";
//    var data = p;
    var data = $("#formOptions").serialize();
    data += "&id=" + id_object + "&pos_x_final=" + lefto + "&pos_y_final=" + topo + "&pos_x=" + left + "&pos_y=" + top + "&opacidad_inicial=" + opa;
    $.ajax({
        type: "POST",
        url: url,
//        data: {id: id_object, pos_x_final: lefto, pos_y_final: topo, pos_x_inicial: 0, pos_y_inicial: 0, pos_x: left, pos_y: top, velocidad: velocidad_objeto, reproducir: reproducir},
        data: data,
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            cerrarAnimationStart();
        }
    });
}
function moverAnimationSrv(id_object) {
    var p = $("#object_" + id_object).position();
    var rotacion = $("#object_" + id_object).attr("nwrotation");
    var perspectiveX = $("#imgObject_" + id_object).attr("perspectiveX");
    var perspectiveY = $("#imgObject_" + id_object).attr("perspectiveY");
    var width = $("#object_" + id_object).width();
    var height = $("#object_" + id_object).height();
    var p = $("#object_" + id_object).position();
    var punteroLinetime = $(".punteroLinetime").position();
    var lefto = p.left;
    var topo = p.top;
//    var velocidad = punteroLinetime.left / 100;
    var velocidad = punteroLinetime.left;
    if (punteroLinetime.left > 10) {
        velocidad = punteroLinetime.left + "0";
    }
//    var lefto = p.left - left;
//    var topo = p.top - top;
    var data = $("#formOptions").serialize();
    var velocidad_anterior = $("#velocidad_anterior").val();
    var opacidad = $("#opacityObjecTempInput").val() / 100;
    var easing_object = $(".easing_object").val();
    data += "&id=" + id_object + "&pos_x=" + lefto + "&pos_y=" + topo + "&velocidad=" + velocidad + "&opacidad=" + opacidad + "&width=" + width + "&height=" + height + "&easing_object=" + easing_object + "&velocidad_anterior_ok=" + velocidad_anterior;
    data += "&rotacion=" + rotacion;
    data += "&perspectivex=" + perspectiveX;
    data += "&perspectivey=" + perspectiveY;
    console.log(data);
    $.ajax({
        type: "POST",
        url: "srv/saveAnimateMovObject.php",
        data: data,
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
//            var dato = parseInt(data);
//            var vel = dato;
            console.log(data);
            var l = $(".listObject" + id_object).position();
            var t = $(".punteroLinetime").position();
            $(".contendFotogramas").append("<div class='fotogramaLineTime fotogramaLineTimeGrant' style=' top: " + l.top + "px; left: " + t.left + "px; '></div>");
            $("#velocidad_anterior").val(data);
//            $("#velocidad_anterior").val(vel);
        }
    });
}
function saveAnim(id_object) {
    var data = $("#formOptions").serialize();
    data += "&id=" + id_object;
    var url = "srv/saveAnimateMovObjectEnd.php";
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            console.log(data);
            alert("guardado correctamente!");
            cerrarAnimationStart();
        }
    });
}
function duplicarObject(id) {
    $.ajax({
        url: 'srv/duplicarObject.php',
        data: {id: id},
        type: 'post',
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
                return;
            } else {
                loadObjectsCenter();
//                window.location.reload();
            }
        }
    });
}
function reordenar(orden) {
    $.ajax({
        url: 'srv/reorder.php',
        data: {data: orden},
        type: 'post',
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
                return;
            } else {
                loadObjectsCenter();
//                loadObjects();
//                window.location.reload();
            }
        }
    });
}
function loadObjectsCenter() {
    var id_enc = $("#center").attr("data-id");
    var escena = $("#center").attr("data-escena");
    var play = $("#center").attr("data-play");
    $.ajax({
        url: 'src/loadObjects.php',
        data: {id_enc: id_enc, escena: escena, play: play},
        type: 'post',
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $("#contendImg").html(" ");
            $("#contendImg").append(data);
        }
    });
}
var points = [];
function animateInlineObject(left, id) {
    var afterRow = null;
    for (var i = 0; i < points.length; i++) {
        if (i == 0) {
            afterRow = points[i];
            continue;
        }
        var des_x = "";
        var des_y = "";
        if (left <= points[i]["time"]) {
            if (i == 1) {
//                console.log(afterRow);
//                console.log(points[i]);
                des_x = (points[i]["left"] / points[i]["time"]) * left;
                des_y = (points[i]["top"] / points[i]["time"]) * left;
                $("#object_" + id).css("margin-left", des_x);
                $("#object_" + id).css("margin-top", des_y);
//               $("#opacityObjecTempInput").val();
            } else {
//                console.log(points[i - 1]);
                des_x = (points[i - 1]["left"] / points[i - 1]["time"]) * left;
                des_y = (points[i - 1]["top"] / points[i - 1]["time"]) * left;
                $("#object_" + id).css("margin-left", des_x);
                $("#object_" + id).css("margin-top", des_y);
            }
            break;
        }
    }
}
function removeLoadint() {
    $("#loading").fadeOut();
//    $("#loading").fadeOut().remove();
}
function createLineTime() {
    var id = $(".guardarAnimation").attr("name");
    $(".imagenes").append('<div id="lineTimeContend"></div>');
    $("#lineTimeContend").append('<div class="lineTime"><div class="punteroLinetime"></div></div>');
//    $(".punteroLinetime").draggable({
//        cursor: 'pointer',
//        axis: 'x',
//        containment: 'parent',
//        start: function() {
////            counts[ 0 ]++;
////        console.log( counts[ 0 ] );
//        },
//        drag: function() {
//            var p = $(this).position();
//            animateInlineObject(p.left, id);
//        },
//        stop: function() {
////            counts[ 2 ]++;
////        console.log(counts[ 2 ] );
//        }
//    });
//    $(".punteroLinetime").mousedown(function() {
//        $(".punteroLinetime").mousemove(function() {
//         var p =   $(this).position();
//            console.log(p.left);
//        });
//    });
    var segs = 0;
    for (var i = 0; i < 100; i++) {
        segs = i * 100;
        $(".lineTime").append("<div class='separateSeg' style='left: " + segs + "px'><p>" + i + " Segs</p></div>");
    }
    $(".lineTime").append("<div class='contendFotogramas'><div class='firsFotogram'></div></div>");
    insertFotogramasObject();
}
function insertFotogramasObject(d) {
    var id = "";
    if (d != undefined) {
        var id = d;
    } else {
        id = $(".guardarAnimation").attr("name");
    }
    $(".punteroLinetime").draggable({
        cursor: 'pointer',
        axis: 'x',
        containment: 'parent',
        start: function() {
//            counts[ 0 ]++;
//        console.log( counts[ 0 ] );
        },
        drag: function() {
            var p = $(this).position();
//            animateInlineObject(p.left, id);
        },
        stop: function() {
//            counts[ 2 ]++;
//        console.log(counts[ 2 ] );
        }
    });
    var url = "src/insertFotogramasObject.php";
    $.ajax({
        type: "POST",
        url: url,
        data: {id: id},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            data = JSON.parse(data);
            points = data.data;
            var l = $(".listObject" + id).position();
////            $(".lineTime").append(data.points.join(""));
            $(".contendFotogramas").append(data.points.join(""));
            $(".fotograma_" + id).css("top", l.top);
////            $(".listObject" + id).append(data.points.join(""));
        }
    });
}
function bloquearObjects(id) {
    $("#object_" + id).addClass("divBloqueado");
}
function addACapaObjects(id) {
    var existe = $(".popup").val();
    if (existe != undefined) {
        return;
    }
    var id_enc = $("#center").attr("data-id");
    var escena = $("#center").attr("data-escena");
    var ruta = "src/addACapaOcult.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {id: id, id_enc: id_enc, escena: escena},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $(data).dialog({
                resizable: true,
                modal: true,
                height: '200',
                width: '300',
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
                        saveCapaAdd();
                    }
                }
            });
            $("#capa").focus();
        }
    });
}
function saveCapaAdd() {
    var data = $("#form_addcapa").serialize();
    $.ajax({
        url: "srv/saveCapaAdd.php",
        type: 'post',
        data: data,
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            alert(data);
            loadObjectsCenter();
            loadObjects();
        }
    });
}