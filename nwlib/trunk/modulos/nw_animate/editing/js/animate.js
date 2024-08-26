$(document).ready(function () {
    if (typeof (nwa) == "undefined") {
        //////////////////////////////////////////////////////////NO PERMITE SELECCIONAR TEXTO ////////////////////////////////////
        document.onselectstart = function () {
            return false;
        };
/* Firefox*/
        document.onmousedown = function () {
            return false;
        };
        ///////////////////////////////////////////////INHABILITA CLIC DERECHO
        document.oncontextmenu = function () {
            return false;
        };
        //////////////INHABILITA CONTROL U ALT ETC ///////////////////////////////////
        /*
        document.onkeydown = function(e) {
            if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 117 || e.keycode === 17 || e.keycode === 85)) {
            }
            return false;
        };
        loadAnime();
        */
        if ($("#containNwAnimate").attr("present") == "SI")
            createMenuNwAnimate();
        var links = "<link href='/nwlib6/modulos/nw_animate/editing/css/play.css' rel='stylesheet' type='text/css' charset='utf-8'/>";
        $("body").append(links);
        var escena = $(".containNwAnimateBox").attr("data-escena");
        $(".containNwAnimate" + escena).ready(function () {
            prepareAnimation();
        });
    } else
    if (typeof (nwa) == "string") {
        var links = "<link href='/nwlib6/modulos/nw_animate/editing/css/play.css' rel='stylesheet' type='text/css' charset='utf-8'/>";
        $("body").append(links);
    }
});
useOffline = true;
numEscena = 1;
function prepareAnimation() {
    if (typeof useOffline == "undefined") {
        useOffline = true;
    }
    if (useOffline == false) {
        nwAnimation();
        return;
    }
    traeDataEscenaImages();
}
function loadAllAnimation() {
    changeStatus("Cargando escenas");
    var div = $(".containNwAnimateBox");
    var id_enc = div.attr("data-id");
    var escena = div.attr("data-escena");
    var play = div.attr("data-play");
    $.ajax({
        type: "POST",
        url: "/nwlib6/modulos/nw_animate/editing/src/loadAllEscenes.php",
        data: {id_enc: id_enc, escena: escena},
        dataType: "json",
        error: function () {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo line 54.");
        },
        success: function (data) {
            var expData = data.split(";");
            var expEsc = expData[1].split(",");
            localStorage["arrayEscenes" + id_enc] = expEsc;
            var total = expData[0];
            localStorage["totalEscenes" + id_enc] = total;
            for (var i = 0; i < total; i++) {
                var num = i + 1;
                var newEscena = expEsc[i];
                traeDataEscena(id_enc, newEscena, play, num, total);
            }
            return true;
        }
    });
}
function traeDataEscena(id_enc, escena, play, num, total) {
    $.ajax({
        type: "POST",
        url: "/nwlib6/modulos/nw_animate/editing/src/loadObjects.php",
        data: {id_enc: id_enc, escena: escena, play: play},
        error: function () {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function (data) {
            localStorage["escena_" + escena] = data;
            changeStatus("Cargando escenas, escena " + num + " de " + total);
            if (num == total) {
                removeAllCargaInitial();
                nwAnimation();
            }
            return true;
        }
    });
}
/*PROCESS DESCARGA: 1: traeDataEscenaImages 2. loadOneImgAnim 3. loadAllAnimation 4. traeDataEscena*/
function traeDataEscenaImages() {
    loadAnime();
    $("#containNwAnimate").append("<div class='showStatusLoading'></div>");
    changeStatus("Creando animación");
    var div = $(".containNwAnimateBox");
    var id_enc = div.attr("data-id");
    $.ajax({
        type: "POST",
        url: "/nwlib6/modulos/nw_animate/editing/src/loadAllEscenesImages.php",
        data: {id_enc: id_enc},
        dataType: "json",
        error: function () {
            removeAllCargaInitial();
            nwAnimation();
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function (data) {
            changeStatus("Cargando imágenes");
            if (data == false) {
                loadAllAnimation();
            } else {
                $("body").append("<div class='containImagesAnim containImagesAnim" + id_enc + "' >" + data + "</div>");
            }
            return true;
        }
    });
}
function loadOneImgAnim(total, num, type) {
    changeStatus("Cargando imágenes. " + num + " de " + total + " mod: " + type);
    if (num == total) {
        loadAllAnimation();
    }
}
function changeStatus(status) {
    $(".showStatusLoading").html(status);
}
function removeAllCargaInitial() {
    $(".showStatusLoading").remove();
    $(".containImagesAnim").remove();
    removeLoadAnime();
}

function loadAnime() {
    $(".containNwAnimateBox").append("<div class='loadAnimeInitial' ></div>");
    $(".loadAnimeInitial").load("/nwlib6/includes/loading/onlyLoading.php");
}
function removeLoadAnime() {
    $(".loadAnimeInitial").remove();
}
function animated(id, rep, vel) {
    var width = $("#imgObject_" + id).width();
    var width_al = width * rep;
    vel += width;
    if (vel >= width_al) {
        vel = 0;
    }
    $('#imgObject_' + id).css('background-size', "cover");
    $('#imgObject_' + id).css('transition', "none");
    $('#imgObject_' + id).css('backgroundPosition', "-" + vel + "px 0px");
    setTimeout(function () {
        animated(id, rep, vel);
    }, 100);
}
function animatedMovimiento(array) {
    var id = array.id;
    var top_final = array.top_final;
    var left_final = array.left_final;
    var veloc = array.veloc;
    var reprod = array.reprod;
    var opFin = array.opFin;
    var delay = array.delay;
    var me = array.me;
    var play = array.play;
    var reproduce = array.reproduce;
    var w = array.w;
    var h = array.h;
    var easing = array.easing;
    var rotacion = array.rotacion;
    var perspectivex = array.perspectivex;
    var perspectivey = array.perspectivey;
    function animation() {
        if (reprod == "una_vez") {
            $('#imgObject_' + id).animate({"opacity": opFin}, {duration: veloc, easing: easing});
            $('#object_' + id).animate({"margin-left": left_final + me, "margin-top": top_final + me, "width": w + me, "height": h + me}, {duration: veloc, easing: easing});
        } else {
            $('#imgObject_' + id).animate({
                "opacity": opFin,
                myRotationProperty: perspectivex,
                myRotationPropertyDos: perspectivey
            },
                    {
                        step: function (now, tween) {
                            if (tween.prop === "myRotationProperty") {
                                $(this).css('-webkit-transform', 'rotateX(' + now + 'deg) rotateY(' + perspectivey + 'deg) ');
                                $(this).css('-moz-transform', 'rotateX(' + now + 'deg) rotateY(' + perspectivey + 'deg) ');
                                $(this).css('transform', 'rotateX(' + now + 'deg) rotateY(' + perspectivey + 'deg) ');
                            }
                            if (tween.prop === "myRotationPropertyDos") {
                                $(this).css('-webkit-transform', 'rotateX(' + perspectivex + 'deg) rotateY(' + now + 'deg) ');
                                $(this).css('-moz-transform', 'rotateX(' + perspectivex + 'deg) rotateY(' + now + 'deg) ');
                                $(this).css('transform', 'rotateX(' + perspectivex + 'deg) rotateY(' + now + 'deg) ');
                            }
                        },
                        duration: veloc,
                        easing: easing
                    },
                    {
                        duration: veloc,
                        easing: easing});
            $('#object_' + id).animate({
                "margin-left": left_final + me,
                "margin-top": top_final + me,
                "width": w + me,
                "height": h + me,
                myRotationProperty: rotacion
            },
                    {
                        step: function (now, tween) {
                            if (tween.prop === "myRotationProperty") {
                                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                                $(this).css('transform', 'rotate(' + now + 'deg)');
                            }
                        },
                        duration: veloc,
                        easing: easing
                    },
                    {
                        duration: veloc,
                        easing: easing
                    }).animate({"border": "0"}, 10, animation);
        }
    }
    animation();
    if (play != "si") {
        $("#object_" + id).mouseover(function () {
     /*       $("#object_" + id).stop();*/
        });
        $("#object_" + id).mouseenter(function () {
   /*         $("#object_" + id).stop();*/
        });
        $("#object_" + id).click(function () {
            $("#object_" + id).stop();
        });
        $("#object_" + id).mouseleave(function () {
            if (anima != "si") {
   /*         animation();*/
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
}
function transitionTopFadeIn(id_enc, escena, duracion, alto, transicion, transicion_final) {
    $(".nw-animation" + escena).fadeOut(0);
    $(".nw-animation" + escena).fadeIn();
    $(".nw-animation" + escena).css("top", "-1000px");
    $(".nw-animation" + escena).animate({"top": "300px"}, {duration: 1000, easing: "swing"}).animate({"top": "0px"}, {duration: 500, easing: "swing"});
    setTimeout(function () {
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
    setTimeout(function () {
        nwAnimation(id_enc, id, p, alto, duracion, transicion, background, transicion_final);
    }, 1500);
}
function transitionIzFadeIn(id_enc, escena, duracion, alto, transicion) {
    $(".nw-animation" + escena).fadeOut(0);
    $(".nw-animation" + escena).fadeIn();
    $(".nw-animation" + escena).css("left", "3000px");
    $(".nw-animation" + escena).animate({"left": "-300px"}, {duration: 1000, easing: "swing"}).animate({"left": "0px"}, {duration: 500, easing: "swing"});
    setTimeout(function () {
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
    setTimeout(function () {
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
        step: function (now) {
            $(this).css('-webkit-transform', 'scale(' + now + ')');
            $(this).css('-moz-transform', 'scale(' + now + ') ');
            $(this).css('-ms-transform', 'scale(' + now + ') ');
            $(this).css('-o-transform', 'scale(' + now + ') ');
            $(this).css('transform', 'scale(' + now + ') ');
        },
        duration: 2000
    }, 'linear');
    setTimeout(function () {
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
        step: function (now) {
            $(this).css('-webkit-transform', 'scale(' + now + ')');
            $(this).css('-moz-transform', 'scale(' + now + ') ');
            $(this).css('-ms-transform', 'scale(' + now + ') ');
            $(this).css('-o-transform', 'scale(' + now + ') ');
            $(this).css('transform', 'scale(' + now + ') ');
        },
        duration: 2000
    }, 'linear');
    $(".nw-animation" + id).fadeOut();
    setTimeout(function () {
        nwAnimation(id_enc, id, p, alto, duracion, transicion, background, transicion_final);
    }, 2000);
}
function nwAnimation(id_enc, escena, play, alto, duracion, transicion, background, transicion_final) {
    var div = $(".containNwAnimateBox");
    if (id_enc == undefined) {
        controlsEscenas();
        id_enc = div.attr("data-id");
    }
    if (escena == undefined) {
        escena = div.attr("data-escena");
    }
    if (play == undefined) {
        play = div.attr("data-play");
    }
    if (alto == undefined) {
        alto = div.attr("data-alto");
    }
    if (duracion == undefined) {
        duracion = div.attr("data-duracion");
    }
    if (transicion == undefined) {
        transicion = div.attr("data-transicion-inicial");
    }
    if (background == undefined) {
        background = div.attr("data-transicion-background");
    }
    if (transicion_final == undefined) {
        transicion_final = div.attr("data-transicion-transicion_final");
    }
    if (id_enc == 0) {
        id_enc = div.attr("data-id");
        div.animate({backgroundColor: background}, 50);
        $("#nw-animation" + escena).remove();

        $(".nw-animation-class").remove();
        div.attr("class", "containNwAnimate" + escena);
        div.addClass("containNwAnimateBox");
        div.attr("data-escena", escena);
    }
    $(".containNwAnimate" + escena).append("<div class='nw-animation-class' id='nw-animation" + escena + "'></div>");
    $("#nw-animation" + escena + "").append("<div class='nw-animation nw-animation" + escena + "'></div>");

    /*PRIMERA CARGA DE DIAPOSITIVA*/
    if (typeof useOffline == "undefined") {
        useOffline = true;
    }
    if (useOffline == false) {
        $.ajax({
            type: "POST",
            url: "/nwlib6/modulos/nw_animate/editing/src/loadObjects.php",
            data: {id_enc: id_enc, escena: escena, play: play},
            error: function () {
                console.log("La operación no pudo ser procesada. Inténtelo de nuevo.");
            },
            success: function (data) {
                $(".nw-animation" + escena).html(data);
                return true;
            }
        });
    } else {
        $(".nw-animation" + escena).html(localStorage["escena_" + escena]);
    }

    $(".nw-animation" + escena).css("height", alto);
    /*
     $( "#nw-animation" ).animate({
     backgroundColor: "#aa0000",
     color: "#fff"
     }, 1000 );
     $("body").css("background", background);
     $(".nw-animation").css("background-color", background);
     $("#nw-animation").css("background-color", "red");
     $("#nw-animation").animate({backgroundColor: 'red'}, 1000);
     $("body").animate({background: "#db1a35"}, 1200);
     */
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
        } else {
            transitionFadeIn(id_enc, escena, duracion, alto, transicion, transicion_final);
        }
    }
}
function loadEscene(id_enc, id_escena, duracion, alto, transicion, transicion_final) {
    var data = {};
    data["id_enc"] = id_enc;
    data["id_escena"] = id_escena;
    var ruta = "src/loadNextEscene.php";
    $.ajax({
        url: ruta,
        type: 'post',
        data: data,
        error: function () {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function (data) {
            if (data != "") {
                setTimeout(function () {
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
                    } else {
                        transitionFadeOut(id_enc, data, "si", alto, duracion);
                    }
                }, duracion + "000");
            }
        }
    });
}
function controlsEscenas() {
    var div = $(".containNwAnimateBox");
    var controls = "<div class='containerControlsButton'>";
    controls += "<div class='controlsButton controlsLeft'></div>";
    controls += "<div class='controlsButton controlsRightt'></div>";
    controls += "<div class='controlsButton fullScreen'></div>";
    controls += "<div class='controlsButton menuMainPresent menuMainPresentShow'></div>";
    controls += "<div class='controlsButton menuMainPresent menuMainPresentHidden'></div>";
    controls += "<div class='presentTitle'></div>";
    controls += "</div>";
    div.append(controls);
    $(".controlsRightt").click(function () {
        actionsNextEscenas("next");
    });
    $(".controlsLeft").click(function () {
        actionsNextEscenas("back");
    });
    $(".fullScreen").click(function () {
        maxWindow();
    });
    $(".menuMainPresentShow").click(function () {
        showMainMenuANim();
    });
    $(".menuMainPresentHidden").click(function () {
        hiddenMainMenuANim();
    });
    $(document).keydown(function (tecla) {
        var suma = 1;
        if (tecla.keyCode == 39) {
            actionsNextEscenas("next");
        }
        if (tecla.keyCode == 37) {
            actionsNextEscenas("back");
        }
    });
}
function actionsNextEscenas(control, escenaById) {
    var div = $(".containNwAnimateBox");
    var id_enc = div.attr("data-id");
    if (typeof useOffline == "undefined") {
        useOffline = true;
    }
    if (useOffline == true) {
        numEscena++;
        var num = parseInt(numEscena) - parseInt(1);
        var arrayEscens = localStorage["arrayEscenes" + id_enc].split(",");
        var totalEscens = localStorage["totalEscenes" + id_enc];
        data = arrayEscens[num];
        if (num == totalEscens) {
            numEscena = 0;
            finDiapo();
            return;
        } else {
            if ($(".finDiapo").length > 0) {
                removeFinDiapo();
            }
            nwAnimation(0, data);
        }
        return;
    }
    var escena = div.attr("data-escena");
    var data = {};
    data["escena"] = escena;
    if (escenaById != undefined) {
        data["escena"] = escenaById;
    }
    data["control"] = control;

    $.ajax({
        url: "/nwlib6/modulos/nw_animate/editing/srv/loadNextEscena.php",
        type: 'post',
        data: data,
        error: function () {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo.");
        },
        success: function (data) {
            if (data == "no") {
                finDiapo();
                return;
            } else {
                if ($(".finDiapo").length > 0) {
                    removeFinDiapo();
                }
                window.history.pushState(data, "Titulo", "/nwlib6/modulos/nw_animate/editing/pointOnMap.php?id_enc=" + id_enc + "&escena=" + data + "&play=true&present=true");
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
}
function finDiapo() {
    if ($(".finDiapo").length == 0)
        $("body").append("<div class='finDiapo'><h3 class='titleFinDiapo'>Fin de la presentación.</h3></div>");
}
function removeFinDiapo() {
    $(".finDiapo").remove();
}
function createMenuNwAnimate() {
    var id = $("#containNwAnimate").attr("data-id");
    $.ajax({
        type: "post",
        url: "/nwlib6/modulos/nw_animate/editing/srv/createMenuPresent.php",
        dataType: "json",
        data: {id: id},
        error: function () {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. Es probable que no tenga conexión a internet.");
            return;
        },
        success: function (data) {
            var html = "";
            html += "<div class='containerMenu' >";
            html += "<div class='containerMenuInt' >";
            html += data;
            html += "</div>";
            html += "</div>";
            $("body").append(html);
            $(".bloqEscenaInt").click(function () {
                hiddenMainMenuANim();
                var id = $(this).attr("data");
                actionsNextEscenas("escenaById", id);
            });
            $('.containerMenu').mouseleave(function () {
                hiddenMainMenuANim();
            });
            setTimeout(function () {
                hiddenMainMenuANim();
            }, 1000);
            return true;
        }
    });
}
function showMainMenuANim() {
    $(".containerControlsButton").addClass("containerControlsButtonBig");
    $(".containerMenu").removeClass("containerMenuHidden");
    $(".menuMainPresentShow").fadeOut(0);
    $(".menuMainPresentHidden").fadeIn(0);
    var escena = $("#containNwAnimate").attr("data-escena");
    var title = $(".bloqEscenaPage" + escena).attr("data-title");
    var page = $(".bloqEscenaPage" + escena).attr("data-page");
    $(".presentTitle").html("<h3>" + title + " - Hoja No " + page + "</h3>");
}
function hiddenMainMenuANim() {
    $(".containerControlsButton").removeClass("containerControlsButtonBig");
    $(".containerMenu").addClass("containerMenuHidden");
    $(".presentTitle").html(" ");
    $(".menuMainPresentHidden").fadeOut(0);
    $(".menuMainPresentShow").fadeIn(0);
}
