document.addEventListener('DOMContentLoaded', function() {
//    var lunch = document.querySelector("#containNwAnimate");
//    var fries = document.createElement("div");
//    var links = "";
//    links += "<link href='/nwlib6/modulos/nw_animate/editing/css/play.css' rel='stylesheet' type='text/css' charset='utf-8'/>";
//    links += "<script src='/nwlib6/modulos/nw_animate/editing/js/nwanim.js' type='text/javascript'></script>";
//    fries.innerHTML = links;
//    lunch.appendChild(fries);

    var styles = "/nwlib6/modulos/nw_animate/editing/css/play.css";
    var newSS = document.createElement('link');
    newSS.rel = 'stylesheet';
    newSS.type = 'text/css';
    newSS.href = styles;
    document.body.appendChild(newSS);
    
//    var styles = "/nwlib6/modulos/nw_animate/editing/js/nwanim.js";
//    var newSS = document.createElement('script');
//    newSS.type = 'text/javascript';
//    newSS.src = styles;
//    document.body.appendChild(newSS);
});
$(document).ready(function() {
    //    //////////////////////////////////////////////////////////NO PERMITE SELECCIONAR TEXTO ////////////////////////////////////
//    document.onselectstart = function() {
//        return false;
//    };
//// Firefox
//    document.onmousedown = function() {
//        return false;
//    };
//    ///////////////////////////////////////////////INHABILITA CLIC DERECHO
//    document.oncontextmenu = function() {
//        return false;
//    };
//    //////////////INHABILITA CONTROL U ALT ETC ///////////////////////////////////
//    document.onkeydown = function(e) {
//        if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 117 || e.keycode === 17 || e.keycode === 85)) {
//        }
//        return false;
//    };
    var escena = $("#containNwAnimate").attr("data-escena");
    $(".containNwAnimate" + escena).ready(function() {
        nwAnimation();
    });
});
function animated(id, rep, vel) {
//    var width = $("#object_" + id).width();
    var width = $("#imgObject_" + id).width();
//    width = width / 10;
    var width_al = width * rep;
    vel += width;
    if (vel >= width_al) {
        vel = 0;
    }
//    $('#object_' + id).css('backgroundPosition', "-" + vel + "px 0px");
    $('#imgObject_' + id).css('background-size', "cover");
    $('#imgObject_' + id).css('transition', "none");
    $('#imgObject_' + id).css('backgroundPosition', "-" + vel + "px 0px");
    setTimeout(function() {
        animated(id, rep, vel);
    }, 100);
//    $("#object_" + id).sprite({fps: 12, no_of_frames: rep});
}
function animatedMovimiento(id, top_final, left_final, veloc, reprod, opFin, delay, me, play, reproduce, w, h, easing) {
//    var velocidad = vel + "000";
    function animation() {
        if (reprod == "una_vez") {
//            $('#object_' + id).delay(delay).animate({"margin-left": left_final + me, "margin-top": top_final + me, "opacity": opFin}, {duration: veloc, easing: "swing"});
//            $('#imgObject_' + id).animate({"opacity": opFin}, {duration: veloc, easing: "linear"});
            $('#imgObject_' + id).animate({"opacity": opFin}, {duration: veloc, easing: easing});
            $('#object_' + id).animate({"margin-left": left_final + me, "margin-top": top_final + me, "width": w + me, "height": h + me}, {duration: veloc, easing: easing});
        } else {
            $('#imgObject_' + id).animate({"opacity": opFin}, {duration: veloc, easing: easing});
//            $('#object_' + id).delay(delay).animate({"margin-left": left_final + me, "margin-top": top_final + me, "opacity": opFin}, {duration: veloc, easing: "swing"}).animate({"border": "0"}, 10, animation);
            $('#object_' + id).animate({"margin-left": left_final + me, "margin-top": top_final + me, "width": w + me, "height": h + me}, {duration: veloc, easing: easing}).animate({"border": "0"}, 10, animation);
        }
    }
    animation();
    if (play != "si") {
        $("#object_" + id).mouseover(function() {
//            $("#object_" + id).stop();
        });
        $("#object_" + id).mouseenter(function() {
//            $("#object_" + id).stop();
        });
        $("#object_" + id).click(function() {
            $("#object_" + id).stop();
        });
        $("#object_" + id).mouseleave(function() {
            if (anima != "si") {
//            animation();
            }
        });
    }
    if (reproduce == "no") {
        $("#object_" + id).stop();
    }
}
function transitionFadeIn(id_enc, escena, duracion, alto, transicion, transicion_final) {
    $(".nw-animation" + escena).fadeOut(0);
    $(".nw-animation" + escena).fadeIn();
    loadEscene(id_enc, escena, duracion, alto, transicion, transicion_final);
}
function transitionFadeOut(id_enc, data, p, alto) {
    var st = data;
    var split = st.split(",");
    var id = split[0];
    var duracion = split[1];
    var transicion = split[2];
    var background = split[3];
    var transicion_final = split[4];
    $(".nw-animation" + id).fadeOut();
//    nwAnimation(id_enc, id, p, alto, duracion, transicion, background, transicion_final);
}
function transitionTopFadeIn(id_enc, escena, duracion, alto, transicion, transicion_final) {
    $(".nw-animation" + escena).fadeOut(0);
    $(".nw-animation" + escena).fadeIn();
    $(".nw-animation" + escena).css("top", "-1000px");
    $(".nw-animation" + escena).animate({"top": "300px"}, {duration: 1000, easing: "swing"}).animate({"top": "0px"}, {duration: 500, easing: "swing"});
    setTimeout(function() {
        loadEscene(id_enc, escena, duracion, alto, transicion, transicion_final);
    }, 1500);
}
function transitionTopFadeOut(id_enc, data, p, alto) {
    var st = data;
    var split = st.split(",");
    var id = split[0];
    var duracion = split[1];
    var transicion = split[2];
    var background = split[3];
    var transicion_final = split[4];
    $(".nw-animation" + id).animate({"top": "300px"}, {duration: 1000, easing: "swing"}).animate({"top": "-1000px"}, {duration: 500, easing: "swing"}).fadeOut(0);
    setTimeout(function() {
        nwAnimation(id_enc, id, p, alto, duracion, transicion, background, transicion_final);
    }, 1500);
}
function transitionIzFadeIn(id_enc, escena, duracion, alto, transicion) {
    $(".nw-animation" + escena).fadeOut(0);
    $(".nw-animation" + escena).fadeIn();
    $(".nw-animation" + escena).css("left", "3000px");
    $(".nw-animation" + escena).animate({"left": "-300px"}, {duration: 1000, easing: "swing"}).animate({"left": "0px"}, {duration: 500, easing: "swing"});
    setTimeout(function() {
        loadEscene(id_enc, escena, duracion, alto, transicion, transicion_final);
    }, 1500);
}
function transitionIzFadeOut(id_enc, data, p, alto) {
    var st = data;
    var split = st.split(",");
    var id = split[0];
    var duracion = split[1];
    var transicion = split[2];
    var background = split[3];
    var transicion_final = split[4];
    $(".nw-animation" + id).animate({"left": "-300px"}, {duration: 1000, easing: "swing"}).animate({"left": "3000px"}, {duration: 500, easing: "swing"}).fadeOut(0);
    setTimeout(function() {
        nwAnimation(id_enc, id, p, alto, duracion, transicion, background, transicion_final);
    }, 1500);
}
function transitionZoomFadeIn(id_enc, escena, duracion, alto, transicion) {
    $(".nw-animation" + escena).css('-webkit-transform', 'scale(0)');
    $(".nw-animation" + escena).css('-moz-transform', 'scale(0) ');
    $(".nw-animation" + escena).css('-ms-transform', 'scale(0) ');
    $(".nw-animation" + escena).css('-o-transform', 'scale(0) ');
    $(".nw-animation" + escena).css('transform', 'scale(0) ');
    $(".nw-animation" + escena).fadeOut(0);
    $(".nw-animation" + escena).fadeIn();
    $('.nw-animation') + escena.animate({borderSpacing: "1"}, {
        step: function(now) {
//            $(this).css('zoom', now);
            $(this).css('-webkit-transform', 'scale(' + now + ')');
            $(this).css('-moz-transform', 'scale(' + now + ') ');
            $(this).css('-ms-transform', 'scale(' + now + ') ');
            $(this).css('-o-transform', 'scale(' + now + ') ');
            $(this).css('transform', 'scale(' + now + ') ');
        },
        duration: 2000
    }, 'linear');
    setTimeout(function() {
        loadEscene(id_enc, escena, duracion, alto, transicion, transicion_final);
    }, 1500);
}
function transitionZoomFadeOut(id_enc, data, p, alto) {
    var st = data;
    var split = st.split(",");
    var id = split[0];
    var duracion = split[1];
    var transicion = split[2];
    var background = split[3];
    var transicion_final = split[4];
    $('.nw-animation' + id).animate({borderSpacing: "10"}, {
        step: function(now) {
            $(this).css('-webkit-transform', 'scale(' + now + ')');
            $(this).css('-moz-transform', 'scale(' + now + ') ');
            $(this).css('-ms-transform', 'scale(' + now + ') ');
            $(this).css('-o-transform', 'scale(' + now + ') ');
            $(this).css('transform', 'scale(' + now + ') ');
        },
        duration: 2000
    }, 'linear');
    $(".nw-animation" + id).fadeOut();
    setTimeout(function() {
        nwAnimation(id_enc, id, p, alto, duracion, transicion, background, transicion_final);
    }, 2000);
}
function nwAnimation(id_enc, escena, play, alto, duracion, transicion, background, transicion_final) {
//function nwAnimation() {
    if (id_enc == undefined) {
        controlsEscenas();
        id_enc = $("#containNwAnimate").attr("data-id");
    }
    console.log(escena);
    if (escena == undefined) {
        escena = $("#containNwAnimate").attr("data-escena");
    }
//    escena = $("#containNwAnimate").attr("data-escena");
    if (play == undefined) {
        play = $("#containNwAnimate").attr("data-play");
    }
    if (alto == undefined) {
        alto = $("#containNwAnimate").attr("data-alto");
    }
    if (duracion == undefined) {
        duracion = $("#containNwAnimate").attr("data-duracion");
    }
    if (transicion == undefined) {
        transicion = $("#containNwAnimate").attr("data-transicion-inicial");
    }
    if (background == undefined) {
        background = $("#containNwAnimate").attr("data-transicion-background");
    }
    if (transicion_final == undefined) {
        transicion_final = $("#containNwAnimate").attr("data-transicion-transicion_final");
    }
//    $("body").animate({backgroundColor: background}, 50);
    $("#containNwAnimate").animate({backgroundColor: background}, 50);
//    $("#nw-animation" + escena).remove();
    $(".nw-animation-class").remove();
    $("#containNwAnimate").attr("class", "containNwAnimate" + escena);
    $("#containNwAnimate").attr("data-escena", escena);
//    $("body").append("<div id='nw-animation'></div>");
//    $("#containNwAnimate").append("<div id='nw-animation'></div>");
//    $(".containNwAnimate" + idiv).append("<div id='nw-animation'></div>");
    $(".containNwAnimate" + escena).append("<div class='nw-animation-class' id='nw-animation" + escena + "'></div>");
    $("#nw-animation" + escena + "").append("<div class='nw-animation nw-animation" + escena + "'></div>");
    $(".nw-animation" + escena + "").load("/nwlib6/modulos/nw_animate/editing/src/loadObjects.php", {id_enc: id_enc, escena: escena, play: play});
    $(".nw-animation" + escena + "").css("height", alto);
//     $( "#nw-animation" ).animate({
//          backgroundColor: "#aa0000",
//          color: "#fff"
//        }, 1000 );
//    $("body").css("background", background);
//    $(".nw-animation").css("background-color", background);
//    $("#nw-animation").css("background-color", "red");
//    $("#nw-animation").animate({backgroundColor: 'red'}, 1000);
//    $("body").animate({background: "#db1a35"}, 1200);
    if (duracion != undefined && duracion != "") {
        if (transicion == "desaparece") {
            transitionFadeIn(id_enc, escena, duracion, alto, transicion, transicion_final);
        } else
        if (transicion == "sube_desaparece") {
            transitionTopFadeIn(id_enc, escena, duracion, alto, transicion, transicion_final);
        } else
        if (transicion == "iz_desaparece") {
            transitionIzFadeIn(id_enc, escena, duracion, alto, transicion, transicion_final);
        } else
        if (transicion == "zoom") {
            transitionZoomFadeIn(id_enc, escena, duracion, alto, transicion, transicion_final);
        }
        else {
            transitionFadeIn(id_enc, escena, duracion, alto, transicion, transicion_final);
        }
    }
}
function loadEscene(id_enc, id_escena, duracion, alto, transicion, transicion_final) {
    var ruta = "src/loadNextEscene.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: {id_enc: id_enc, id_escena: id_escena},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                setTimeout(function() {
                    if (transicion_final == "desaparece") {
                        transitionFadeOut(id_enc, data, "si", alto, duracion);
                    } else
                    if (transicion_final == "sube_desaparece") {
                        transitionTopFadeOut(id_enc, data, "si", alto, duracion);
                    } else
                    if (transicion_final == "iz_desaparece") {
                        transitionIzFadeOut(id_enc, data, "si", alto, duracion);
                    } else
                    if (transicion_final == "zoom") {
                        transitionZoomFadeOut(id_enc, data, "si", alto, duracion);
                    }
                    else {
                        transitionFadeOut(id_enc, data, "si", alto, duracion);
                    }
                }, duracion + "000");
            }
        }
    });
}
function controlsEscenas() {
    var controls = "<div class='controlsButton controlsLeft'><p><</p></div><div class='controlsButton controlsRightt'><p>></p></div><div class='controlsButton fullScreen'></div>";
    $("#containNwAnimate").append(controls);
    $(".controlsRightt").click(function() {
        actionsNextEscenas("next");
    });
    $(".controlsLeft").click(function() {
        actionsNextEscenas("back");
    });
    $(".fullScreen").click(function() {
        maxWindow();
    });
    $(document).keydown(function(tecla) {
        var suma = 1;
        if (tecla.keyCode == 39) {
            actionsNextEscenas("next");
        }
        if (tecla.keyCode == 37) {
            actionsNextEscenas("back");
        }
    });
}
function actionsNextEscenas(control) {
    var id_enc = $("#containNwAnimate").attr("data-id");
    var escena = $("#containNwAnimate").attr("data-escena");
    $.ajax({
        url: "srv/loadNextEscena.php",
        type: 'post',
        data: {escena: escena, control: control},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function(data) {
            if (data == "no") {
                return;
            } else {
//                var loc = "?id_enc=" + id_enc + "&escena=" + data + "&play=true";
//                window.location = loc;
                nwAnimation(0, data);
            }
        }
    });
}
function maxWindow() {
    /////////////////////////////////////////////FULLSCREEN OK ///////////////////////////////////////////////////
    var element = document.body;
    var elem = element;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
////////////////POPUP SIRVE OPCION 2/////////////////////////////////////////////////////////////
//    var id_enc = $("#containNwAnimate").attr("data-id");
//    var escena = $("#containNwAnimate").attr("data-escena");
//    var loc = "?id_enc=" + id_enc + "&escena=" + escena + "&play=true";
//    window.open(loc, '', 'fullscreen=yes, scrollbars=auto');
}