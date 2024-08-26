var url = "/nwlib6/modulos/";

$('#open').click(function() {
    $('#popup_carga_note').fadeIn('slow');
});

$('#close').click(function() {
    //$('#popup_carga_note').fadeOut('slow');
});

function cargar_notice_h(id) {
    $('#popup_carga_note').fadeIn('slow');
    //$("#popup_carga_note").dialog('destroy');
//    $("#popup_carga_note").load(url + "nw_maps/visita_virtual.php", {id: id});
    $("#popup_carga_note").load(url + "nw_maps/src/visita_virtual/tourAx.php", {id: id});
}
function cargar_info_local(id, t, l) {
    var left = l;
    var top = t;
    if (left < 15) {
        left = 15;
    } else
    if (left > 30 & left < 40) {
        left = -10;
    } else
    if (left > 40 & left < 50) {
        left = -15;
    } else
    if (left > 50 & left < 60) {
        left = -35;
    } else
    if (left > 60 & left < 90) {
        left = -60;
    }
    var topTop = "";
    if (top < 5) {
        top = 12;
        topTop = 12;
    } else
    if (top > 5 & top <= 10) {
        top = 7;
        topTop = 7;
    } else
    if (top <= 20) {
        top = 0;
        topTop = 0;
    } else
    if (top > 30) {
        top = 0;
        topTop = -40;
    }
    $(".map").animate({
        left: left + "%",
        top: top + "%"
    },
    500);
    $(".map_scale").animate({
        marginTop: topTop + "%"
    },
    500);
    if (top != undefined) {

        $(".map_scale")
                .css('-webkit-transform', 'scale(1)')
                .css('-webkit-transform', 'scale(1)')
                .css('-moz-transform', 'scale(1)')
                .css('-o-transform', 'scale(1)')
                .css('transform', 'scale(1)');
        $(".ubic_loc")
                .css('-webkit-transform', 'scale(1)')
                .css('-webkit-transform', 'scale(1)')
                .css('-moz-transform', 'scale(1)')
                .css('-o-transform', 'scale(1)')
                .css('transform', 'scale(1)');
    }

    $('.ubic_' + id).append("<div id='charg_inf' class='charg_inf" + id + "'>");
    setTimeout(function() {
        $('.charg_inf' + id).fadeIn(300);
    }, 200);
    $('.ubic_' + id).addClass("active_point");
    $('.charg_inf' + id).load(url + "nw_maps/info_local_interno.php", {
        id: id,
        left: left,
        top: top
    });
    $('.ubic_' + id).append("</div>");
}
function destroy_cargar_info_local(id) {
    $('.ubic_' + id).removeClass("active_point");
    $('.charg_inf' + id).fadeOut(200);
    setTimeout(function() {
        $('.charg_inf' + id).remove();
    }, 200);
}
function mouseMove() {
    document.onmousemove = function() {
        var left = $("#map").css("left");
        var top = $("#map").css("top");
        var mystr = left;
        var splitTop = top.split("px");
        var splitLeft = left.split("px");
        var x = splitLeft[0] + "px";
        var y = splitTop[0] + "px";
        var rotate = 0;
        if (localStorage["zoom"] == 5) {
//            rotate = 25;
        }
//        if (localStorage["zoom"] == 1) {
//            x = left;
//            y = top;
//        } else
//        if (localStorage["zoom"] == 2) {
//            x = splitLeft[0] / 2 + "px";
//            y = splitTop[0] / 2 + "px";
//        } else
//        if (localStorage["zoom"] == 3) {
//            x = splitLeft[0] / 3 + "px";
//            y = splitTop[0] / 3 + "px";
//        } else
//        if (localStorage["zoom"] == 4) {
//            x = splitLeft[0] / 4 + "px";
//            y = splitTop[0] / 4 + "px";
//        } else
//        if (localStorage["zoom"] == 5) {
//            x = splitLeft[0] / 5 + "px";
//            y = splitTop[0] / 5 + "px";
//        } else {
//            x = splitLeft[0] + "px";
//            y = splitTop[0] + "px";
//        }
        $(".map")
                .css('-webkit-transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(0deg) scale(1)')
                .css('-webkit-transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(0deg) scale(1)')
                .css('-moz-transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(0deg) scale(1)')
                .css('-o-transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(0deg) scale(1)')
                .css('transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(0deg) scale(1)');
        $(".maped")
                .css('-webkit-transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(' + rotate + 'deg) scale(1)')
                .css('-webkit-transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(' + rotate + 'deg) scale(1)')
                .css('-moz-transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(' + rotate + 'deg) scale(1)')
                .css('-o-transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(' + rotate + 'deg) scale(1)')
                .css('transform', 'translate3d(' + x + ', ' + y + ', 0px) rotateX(' + rotate + 'deg) scale(1)');
    };
}
function mouseStop() {
    document.onmousemove = function(e) {
        return;
    };
}

function zoom(suma) {
    var resta = 1;
    var menos = 1;
    var top = 0;
    var perspective = 0;
    var xUbic = 0;
    var yUbic = 0;
    var rotate = 0;
    if (suma > 1) {
        resta = resta / suma;
    } else
    if (suma < 1) {
        resta = resta / suma;
    }
    if (suma <= 1) {
        suma = 1;
    }
    if (suma >= 5) {
        rotate = 85;
        perspective = 300;
        top = 300;
        xUbic = "0";
        yUbic = 80;
    } else
    if (suma < 5) {
        rotate = 0;
        perspective = 0;
        top = 0;
        xUbic = 0;
        yUbic = 0;
    }
//    mouseMoveOrigin();
    menos = 1.5 / suma;
    if (suma < 5) {
        $('.map_scale').animate({borderSpacing: suma}, {
            step: function(now) {
                if (now <= 1) {
                    now = 1;
                }
                $(this).css('-webkit-transform', 'scale(' + now + ') rotateX(0deg)');
                $(this).css('-moz-transform', 'scale(' + now + ') rotateX(0deg)');
                $(this).css('-ms-transform', 'scale(' + now + ') rotateX(0deg)');
                $(this).css('-o-transform', 'scale(' + now + ') rotateX(0deg)');
                $(this).css('transform', 'scale(' + now + ') rotateX(0deg)');
                $(this).css('-webkit-filter', 'blur(' + now + 'px)');
                $(this).css('top', top + 'px');

                $(".mapedUbics").css('-webkit-transform', 'scale(' + now + ') rotateX(0deg)');
                $(".mapedUbics").css('-moz-transform', 'scale(' + now + ') rotateX(0deg)');
                $(".mapedUbics").css('-ms-transform', 'scale(' + now + ') rotateX(0deg)');
                $(".mapedUbics").css('-o-transform', 'scale(' + now + ') rotateX(0deg)');
                $(".mapedUbics").css('transform', 'scale(' + now + ') rotateX(0deg)');
                $(".mapedUbics").css('top', top + 'px');
            },
            duration: 'slow'
        }, 'linear');
    }
    else
    if (suma == 5) {
        menos = "5, 1";
        var scal = "4, 10";
        $('.map_scale').animate({borderSpacing: rotate}, {
            step: function(now) {
                if (now <= 1) {
                    now = 1;
                }
                $(this).css('-webkit-transform', 'scale(' + scal + ') rotateX(' + now + 'deg)');
                $(this).css('-moz-transform', 'scale(' + scal + ') rotateX(' + now + 'deg)');
                $(this).css('-ms-transform', 'scale(' + scal + ') rotateX(' + now + 'deg)');
                $(this).css('-o-transform', 'scale(' + scal + ') rotateX(' + now + 'deg)');
                $(this).css('transform', 'scale(' + scal + ') rotateX(' + now + 'deg)');
                $(this).css('top', top + 'px');

                $(".mapedUbics").css('-webkit-transform', 'scale(4) rotateX(' + now + 'deg)');
                $(".mapedUbics").css('-moz-transform', 'scale(4) rotateX(' + now + 'deg)');
                $(".mapedUbics").css('-ms-transform', 'scale(4) rotateX(' + now + 'deg)');
                $(".mapedUbics").css('-o-transform', 'scale(4) rotateX(' + now + 'deg)');
                $(".mapedUbics").css('transform', 'scale(4) rotateX(' + now + 'deg)');
                $(".mapedUbics").css('top', top + 'px');
            },
            duration: 'slow'
        }, 'linear');
    }
    $(".show_map").css('-webkit-perspective', '' + perspective + 'px');
    $(".show_map").css('-moz-perspective', '' + perspective + 'px');
    $(".show_map").css('-ms-perspective', '' + perspective + 'px');
    $(".show_map").css('-o-perspective', '' + perspective + 'px');
    $(".show_map").css('perspective', '' + perspective + 'px');
    if (perspective == 300) {
//        $(".show_map").css('height', 'auto');
//        $(".show_map").css('top', '150px');
    }
    $(".ubic_loc").css('-webkit-transform', 'rotateX(' + xUbic + 'deg) rotateY(' + yUbic + 'deg) scale(' + menos + ')');
    $(".ubic_loc").css('-moz-transform', 'rotateX(' + xUbic + 'deg) rotateY(' + yUbic + 'deg) scale(' + menos + ')');
    $(".ubic_loc").css('-ms-transform', 'rotateX(' + xUbic + 'deg) rotateY(' + yUbic + 'deg) scale(' + menos + ')');
    $(".ubic_loc").css('-o-transform', 'rotateX(' + xUbic + 'deg) rotateY(' + yUbic + 'deg) scale(' + menos + ')');
    $(".ubic_loc").css('transform', 'rotateX(' + xUbic + 'deg) rotateY(' + yUbic + 'deg) scale(' + menos + ')');
    setTimeout(function() {
        $(".map_scale").css('-webkit-filter', 'blur(0px)');
    }, 800);
}

function mouseMoveOrigin() {
    var diviv = 1;
    var x = event.clientX / diviv;
    var y = event.clientY / diviv;
//                $(".map_scale").css('transform-origin', x + 'px ' + y + 'px');
    return;
}
function createWidthImg(img) {
    var foto = new Image();
    foto.src = img;
    document.images[0].src = foto.src;
    var ancho = foto.width;
    var alto = foto.height;
    $(".map").animate({width: ancho + "px", height: alto + "px"});
}
$(function() {
    num = 1;
    localStorage["zoom"] = 1;
    $(document).ready(function() {
        $(".acercar").click(function() {
            if (num >= 5) {
                return;
            }
            num++;
            localStorage["zoom"] = num;
            zoom(localStorage["zoom"]);
        });
        $(".alejar").click(function() {
            if (num <= 0) {
                return;
            }
            num--;
            localStorage["zoom"] = num;
            zoom(localStorage["zoom"]);
        });



    });
    $(".map_scale").dblclick(function() {
        if (num >= 5) {
            return;
        }
        if (num <= 0) {
            return;
        }
        num++;
        localStorage["zoom"] = num;
        zoom(localStorage["zoom"]);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////ZOOM WITH SCROLL////////////////////////////////////////////////////////////////////////////////////////
//    $("#map").mousewheel(function(objEvent, intDelta) {
//        if (intDelta > 0) {
//            if (num >= 5) {
//                return;
//            }
//            num++;
//            localStorage["zoom"] = num;
//            zoom(localStorage["zoom"]);
//        }
//        else
//        if (intDelta < 0) {
//            if (num < 1) {
//                zoom(1);
//                return;
//            }
//            num--;
//            localStorage["zoom"] = num;
//            zoom(localStorage["zoom"]);
//        }
//    });
//    $('.map').draggable({cursor: "move"});
    $('.map').mousedown(function() {
        mouseMove();
        $(".map").addClass("cursor_move");
    });
    $('.map').mouseup(function() {
        mouseStop();
        $(".map").removeClass("cursor_move");
    });
});

$('.info_local').mouseout(function() {
    $(".display_loc_listtt").remove();
    $('.info_local').removeClass("clasecss");
    $('#charg_inf').fadeOut('slow');
});
