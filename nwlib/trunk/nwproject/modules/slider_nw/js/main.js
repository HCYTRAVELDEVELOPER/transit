//creado por Alexander Flórez
//Netwoods
//2014 Nov
$(document).ready(function () {
    loadCss("/nwlib6/nwproject/modules/slider_nw/css/slider_nw.css");
});

function all_slider(dat) {
    var banner_speed = dat.banner_speed;
    var banner_autoslide = dat.banner_autoslide;
    var banner_bar = dat.banner_bar;
    var banner_height = dat.banner_height;
    var banner_width = dat.banner_width;
    var banner_easing = dat.banner_easing;
    var thumbnails = dat.thumbnails;
    var tipo_thumbs_textos = dat.tipo_thumbs_textos;
    var imagen_mode = dat.imagen_mode;
    var tipo = dat.tipo;
    var timeoutID = "";
    var div = 0;
    var slide_thumbs = "NO";
    var ElementosMitexto = $(".boxSliderNw" + tipo);
    var total = ElementosMitexto.length;

    $(".controlLeft" + tipo).click(function () {
        clearAlert();
        var d = div - 1;
        $(".controlPlay").fadeOut(0);
        $(".controlStop").fadeIn(0);
        slide(d);
    });

    $(".contenedor_slidernw" + tipo + " .controlRight").click(function () {
//    $(".controlRight" + tipo).click(function () {
        clearAlert();
//        $(".controlPlay").fadeOut(0);
//        $(".controlStop").fadeIn(0);
        $(".contenedor_slidernw" + tipo + " .controlPlay").fadeOut(0);
        $(".contenedor_slidernw" + tipo + " .controlStop").fadeIn(0);
        slide();
    });
    $(".controlStop").click(function () {
//        $(".controlStop").fadeOut(0);
//        $(".controlPlay").fadeIn(0);
//        $(".barInt").stop();
        $(".contenedor_slidernw" + tipo + " .controlStop").fadeOut(0);
        $(".contenedor_slidernw" + tipo + " .controlPlay").fadeIn(0);
        $(".contenedor_slidernw" + tipo + " .barInt").stop();
        clearAlert();
    });
    $(".controlPlay").click(function () {
        $(".controlPlay").fadeOut(0);
        $(".controlStop").fadeIn(0);
    });
    createThumbs(tipo, thumbnails);
    slide();
    if (dat.paginacion != "no")
        createPagination();


    function moveThumbs() {
        if (slide_thumbs == "SI") {
            var left = $(".thumbSnw_active").position().left;
            var move = "-" + left;
            $(".controlsSliderNwThumbs").animate({"left": move});
        }
    }


    function delayedAlert(func, time) {
        timeoutID = window.setTimeout(func, time);
    }
    function clearAlert() {
        window.clearTimeout(timeoutID);
    }
    function startAlert() {
//    window.setTimeout(timeoutID, 8000);
    }
    var yapasa = 0;
    function slide(d, dd) {
        var time = banner_speed;
//    saco el total de elementos con la clase en la página web
        var ElementosMitexto = $(".boxSliderNw" + tipo);
        var total = ElementosMitexto.length;
//    miro si han hecho clic en atras o adelante
        if (d == 1) {
            if (div == 1) {
                div = total;
            } else
            if (div <= 0) {
                div = total;
            } else
            if (div > total) {
                div = 1;
            }
        } else {
            if (div >= total) {
                div = 0;
            } else
            if (div < 0) {
                div = 0;
            }
        }
//    vuelvo a declarar el siguiente div
        if (d != undefined) {
            if (div == 1) {
                div = total;
            } else {
                div = d;
            }
        } else {
            div++;
        }
        if (dd != undefined) {
            div = dd;
        }
        $(".pagina_p").removeClass("pagina_active");
        $(".pagina_p" + div).addClass("pagina_active");
        $(".thumbSnw").removeClass("thumbSnw_active");
        $(".thumb_" + div).addClass("thumbSnw_active");
        if (banner_easing == "easing") {
            actionEasing(div);
        } else
        if (banner_easing == "slide_elastic") {
            yapasa++;
            if (yapasa == 1) {
                var data = $(".contenedor_slidernw_interno" + tipo).html();
//            $(".contenedor_slidernw_interno").append("<div class='controls_tapa'></div>");
                $(".contenedor_slidernw" + tipo).append("<div class='tapaElastic tapaDer'></div>");
                $(".contenedor_slidernw" + tipo).append("<div class='tapaElastic tapaIzq'></div>");
                $(".contenedor_slidernw_interno" + tipo).append(data);
                $(".contenedor_slidernw_interno" + tipo).append(data);
            }
            actionSlideElastic(div, total);
        } else
        if (banner_easing == "slide") {
            actionSlide(div, total);
        } else
        if (banner_easing == "slide_v") {
            $(".contenedor_slidernw").css("overflow", "hidden");
            actionSlideVertical(div, total);
        } else
        if (banner_easing == "slide_vd") {
            actionSlideVerticalDos(div, total);
        } else {
            actionEasing(div);
        }

        var divun = $(".controlsSliderNwThumbs" + tipo);
        if (tipo_thumbs_textos == "down_h_fuera") {
            $(".controlsSliderNw" + tipo).css("bottom", "-40px");
        } else
        if (tipo_thumbs_textos == "down_uno") {
            divun.css("width", "25%");
            divun.css("top", "0px");
            divun.css("left", "10%");
            $(".controlsSliderNwPagination" + tipo).addClass("controlsSliderNwPaginationOne");

//            $(".contenedor_slidernw" + tipo + "

            $(".thumbSnw_active").addClass("thumbSnw_activeOne");
            $(".thumbSnw").fadeOut(0);
        } else
        if (tipo_thumbs_textos == "bloques_img") {
            $(".thumbSnw").css({"width": "15%", "left": "25%", "height": "350px", "margin": "20px", "top": "0px", "transition": "all 0.5s ease 0s", "background": "#ffffff", "box-shadow": "none"});
            $(".thumbs_p").css({"color": "#333333", "border": "0"});
            $(".controlsSliderNw").css({"bottom": "-340px"});
            divun.css({"overflow": "inherit"});
            $(".thumbSnw_active").css({"top": "-30px", "box-shadow": "0px 0px 15px #000"});
        } else
        if (tipo_thumbs_textos == "miniaturas") {
            var anchoMinsContend = 100 * total;
            $(".thumbSnw").addClass("divMiniaturas");
            $(".img_thumb").addClass("img_thumbdivMiniaturas");
            $(".thumbs_p").addClass("thumbs_pMiniaturas");
            $(".textThumbsOnly").addClass("textThumbsOnlyMiniaturas");
            $(".controlsSliderNw").css({"bottom": "-115px"});
            divun.css({"overflow": "inherit"});
            $(".contenedor_slidernw" + tipo).css({"marginBottom": "150px"});
            divun.css({"width": anchoMinsContend + "px"});
        } else
        if (tipo_thumbs_textos == "miniaturas_slide") {
            var anchoMinsContend = 100 * total;
            $(".thumbSnw").addClass("divMiniaturas_slide");
            $(".img_thumb").addClass("img_thumbdivMiniaturas_slide");
            $(".thumbs_p").addClass("thumbs_pMiniaturas_slide");
            $(".textThumbsOnly").addClass("textThumbsOnlyMiniaturas");
            $(".controlsSliderNw").css({"position": "relative", "margin": "20px 60px", "width": "auto", "height": "150px", "overflow": "hidden"});
            $(".controlsSliderNwThumbs").css({"width": "1000%"});
            $(".barProgress").css({"position": "relative"});
            $(".textThumbsOnly").remove();
            $(".controlsSliderNwPagination").remove();
            $(".controlsDirections").css({"top": "inherit", "bottom": "40px", "z-index": "100000000", "opacity": "1"});
            slide_thumbs = "SI";
        }
//    lanzo de nuevo la función
        function resizeBann(d) {
            var h = "";
            var h_body = $(window).height();
//            var h_body = $("body").height();
            var h_header = $(".header ").height();
            var h_menu = $("#menu").height();
            var h_resta = h_header + h_menu;
            var h_imd = $(".img_slider_nw" + div).height();
            var posHeader = $(".header").css("position");
            var heightHeader = $(".header").height();
            var h_d = h_body - h_resta;
            if (d.thumbnails == "no" && banner_height != "auto") {
                h_d = h_body;
            }
            if (h_body < h_imd) {
                h = h_d;
            } else {
                h = h_imd;
            }

            if (posHeader == "fixed") {
                h_d = parseInt(h_d) + parseInt(heightHeader);
            }

            h = h_d;
//            $(".contenedor_slidernw" + tipo).animate({height: h}, 0);
            $(".contenedor_slidernw" + tipo).css({height: h}, 0);
        }
        if (imagen_mode == "contain") {
            $(".contenedor_slidernw" + tipo).animate({height: "auto"}, 0);
        } else
        if (banner_height == "auto") {
            resizeBann(dat);
//        $(window).resize(function() {
//            resizeBann(dat);
//        });
        } else {
            $(".contenedor_slidernw" + tipo).animate({height: banner_height}, 0);
        }
        if (banner_bar == "no") {
            $(".barProgress" + tipo).remove();
        }
        if (banner_autoslide == "si") {
            $(".barInt" + tipo).stop();
            $(".barInt" + tipo).animate({width: "0"}, 0);
            $(".barInt" + tipo).animate({width: "100%"}, time);
            delayedAlert(slide, time);
        }
        moveThumbs();
    }

    function createPagination() {
        var ElementosMitexto = $(".boxSliderNw" + tipo);
        var total = ElementosMitexto.length;
        for (var i = 0; i < total; i++) {
            var number = i + 1;
            $(".controlsSliderNwPagination" + tipo).append("<div class='pagina pagina" + tipo + " pagin_" + number + "' name='" + number + "'><p class='pagina_p pagina_p" + number + "'>" + number + "</p></div>");
        }
        $(".pagina" + tipo).click(function () {
            clearAlert();
            var dd = $(this).attr("name");
            slide("0", dd);
        });
    }
    function createThumbs(tipo, thumbs) {
        if (thumbs == "no") {
            $(".controlsSliderNwThumbs" + tipo).remove();
            return;
        }
        var ElementosMitexto = $(".boxSliderNw" + tipo);
        var total = ElementosMitexto.length;
        var width = $(".controlsSliderNwThumbs" + tipo).width();
        var widthThumbs = 100 / total;
        widthThumbs = widthThumbs + "%";
        for (var i = 0; i < total; i++) {
            var number = i + 1;
            var html = $(".titleSnw_" + number).html();
            html = "<div class='textThumbsOnly'>" + html + "</div>";
            var img = $(".imgBgSnw_" + number).attr("name");
            var texto = $(".textSnw_" + number).html();
            if (tipo_thumbs_textos == "bloques_img") {
                html += "<div class='img_thumb' style='background-image: url(/nwproject/includes/phpthumb/phpThumb.php?src=" + img + "&w=350);'></div><div class='text_thumbs'>" + texto + "</div>";
            }
            if (tipo_thumbs_textos == "miniaturas") {
                html += "<div class='img_thumb' style='background-image: url(/nwproject/includes/phpthumb/phpThumb.php?src=" + img + "&w=350);'></div>";
                widthThumbs = "100px";
            }
            if (tipo_thumbs_textos == "miniaturas_slide") {
                html += "<div class='img_thumb' style='background-image: url(/nwproject/includes/phpthumb/phpThumb.php?src=" + img + "&w=350);'></div>";
                widthThumbs = "100px";
            }
            $(".controlsSliderNwThumbs" + tipo).append("<div style='width: " + widthThumbs + ";' class='thumbSnw thumbSnw" + tipo + " thumb_" + number + "' name='" + number + "'><div class='thumbs_p thumbs_p" + number + "'>" + html + "</div></div>");
        }
        $(".thumbSnw" + tipo).click(function () {
            clearAlert();
            var dd = $(this).attr("name");
            slide("0", dd);
        });
    }

    function actionEasing(d) {

//        $(".contenedor_slidernw" + tipo + "
        $(".boxSliderNw" + tipo).removeClass("slidernw_visible");
//        $(".contenedor_slidernw" + tipo + " .boxSliderNw").removeClass("slidernw_visible");
//        $(".slidernw_" + d).addClass("slidernw_visible");
        $(".contenedor_slidernw" + tipo + " .slidernw_" + d).addClass("slidernw_visible");
        $(".boxSliderNw" + tipo).animate({opacity: 0}, 0);
//        $(".slidernw_" + d).animate({opacity: 1}, 500);
        $(".contenedor_slidernw" + tipo + " .slidernw_" + d).animate({opacity: 1}, 500);
    }
    function actionSlide(d, t) {
        $(".boxSliderNw" + tipo).animate({opacity: 1}, 0);
        $(".boxSliderNw" + tipo).fadeIn(0);
        var w = $(".img_slider_nw" + d).width();
        var wall = w * t;
        var left = (w * d) - w;
        $(".contenedor_slidernw_interno" + tipo).animate({width: wall}, 0);
        $(".boxSliderNw" + tipo).animate({width: w}, 0);
        $(".contenedor_slidernw_interno" + tipo).animate({left: "-" + left}, 1000);
    }

    $(window).resize(function () {
//    slide();
    });
    leftContend = 0;
    function actionSlideElastic(d, t) {
//    var wi = 1250;
        var wi = banner_width;
        var dives = $(".boxSliderNw" + tipo);
        dives.css("max-width", wi);
        var anchoSlides = dives.width();
        var wBod = $("body").width();
        var w = $(".img_slider_nw" + d).width();
//    var la = (wBod - 1250) / 2;
        var la = (wBod - anchoSlides) / 2;
        var wall = (wBod * t) * 2;
        var left = (w * d) - w;
//           var left = (anchoSlides * d) - w;
        leftContend = left;
        dives.animate({opacity: 1}, 0);
        dives.fadeIn(0);
        if (yapasa == 1) {
            dives.css("width", anchoSlides);
            var l = (anchoSlides * t) - la;
            dives.css("left", "-" + l + "px");
            $(".tapaElastic").css("width", la);
            $(".controlsDirections").remove();
            $(".contenedor_slidernw_interno" + tipo).animate({width: wall}, 0);
        }
        $(".contenedor_slidernw_interno" + tipo).animate({left: "-" + left}, 1000);
    }
    function actionSlideVertical(d, t) {
        $(".boxSliderNw").animate({opacity: 1}, 0);
        $(".boxSliderNw").fadeIn(0);
        var h = "";
        var h_body = $("body").height();
        var h_imd = $(".img_slider_nw" + div).height();
        var h_d = h_body - 100;
        h = h_d;
        var wall = h * t;
        var left = (h * d) - h;
        $(".contenedor_slidernw_interno" + tipo).animate({height: wall}, 0);
        $(".boxSliderNw").animate({height: h}, 0);
        $(".contenedor_slidernw_interno" + tipo).animate({top: "-" + left}, 500);
    }
    function actionSlideVerticalDos(d, t) {
        $(".boxSliderNw").animate({opacity: 1}, 0);
        $(".boxSliderNw").fadeIn(0);
        function resizeBannV() {
            var h = "";
            var h_body = $("body").height();
//        var h_d = h_body - 100;
            var h_d = h_body - 55;
            h = h_d;
            $(".boxSliderNw").animate({height: h}, 0);
        }
        resizeBannV();
        $(window).resize(function () {
            resizeBannV();
        });
        $(".contenedor_slidernw").css("background", "#000000");
        $(".boxSliderNw").css("position", "absolute");
        $(".boxSliderNw").css("z-index", "auto");
        $(".text_slider_nw").fadeOut();
        $(".text_slider_nw").animate({top: "20%", opacity: "0"}, 500);
        $(".boxSliderNw").removeClass("slideanimArrowDown");
        $(".slidernw_" + div).addClass("slideanimArrowDown");
        setTimeout(function () {
            $(".text_slider_nw_n" + div).fadeIn().animate({top: "10%", opacity: "1"}, 500);
        }, 700);
        var div_before = div - 1;
        $(".slidernw_" + div_before).css("z-index", "1");
        $(".slidernw_" + div_before).fadeOut(500);
    }
}