time = "";
equis = "";
equisDos = "";
anchoTotal = $("body").width();
time = setTimeout("corre(0,1,0)", 1);

function mouse() {
    document.onmousemove = function(e) {
        var x = e.pageX;
        var y = e.pageY;
        quintos = anchoTotal / 5;
        ultraizquierda = quintos;
        izquierda = quintos * 2;
        derecha = quintos * 3;
        ultraderecha = quintos * 4;
        if (x > ultraderecha) {
            left("ultraDerecha");
        }
        if (x < ultraizquierda) {
            left("ultraIzquierda");
        }
        if (x < ultraderecha && x > derecha) {
            left("derecha");
        }
        if (x > ultraizquierda && x < izquierda) {
            left("izquierda");
        }
        if (x > izquierda && x < derecha) {
            left("centro");
        }

    };
}
function left(x) {
    var param = "";
    var stop = "";
    if (x == "ultraDerecha") {
        equis -= 5;
        param = 3;
        stop = 0;
        clearTimeout(time);
    } else
    if (x == "ultraIzquierda") {
        equis += 5;
        param = 4;
        stop = 0;
        clearTimeout(time);
    } else
    if (x == "derecha") {
        equis -= -2;
        param = 1;
        stop = 0;
        clearTimeout(time);
    } else
    if (x == "izquierda") {
        equis += -2;
        param = 2;
        stop = 0;
        clearTimeout(time);
    } else
    if (x == "centro") {
//            equis = 0;
        param = 1;
        stop = 1;
        clearTimeout(time);
    }

    corre(equis, param, stop);
}
function corre(x, p, s) {
    if (s == 1) {
        return;
    }
    if (p == 1) {
        equis -= 2;
    }
    if (p == 2) {
        equis += 2;
    }
    if (p == 3) {
        equis -= 10;
    }
    if (p == 4) {
        equis += 10;
    }
    document.getElementById("panorama").style.backgroundPosition = x + 'px ' + 0 + 'px';
    time = setTimeout("corre(" + equis + "," + p + "," + s + ")", 1);
}

$('.controlPlay').click(function() {
    $("#panorama").removeClass("pause");
    $("#panorama").addClass("panoStatic");
    $("#panorama").css({left: 0, top: 0});
    $(".controlPlay").removeClass("play");
    $(".controlPlay").fadeOut(500);
    mouse();
    time = setTimeout("corre(" + equis + ",1,0)", 1);
    $("#panorama")
            .css('-webkit-transform', 'scale(1)')
            .css('-webkit-transform', 'scale(1)')
            .css('-moz-transform', 'scale(1)')
            .css('-o-transform', 'scale(1)')
            .css('transform', 'scale(1)');
    $('.panorama-container').draggable("disable");
});
$('.panorama-container').click(function() {
    clearTimeout(time);
    $("#panorama").addClass("pause");
    $("#panorama").removeClass("panoStatic");
    $(".controlPlay").addClass("play");
    $(".controlPlay").html("play");
    document.onmousemove = function(e) {
        clearTimeout(time);
        return;
    };
    $('.panorama-container').draggable("enable");
});
$('.close_popup').click(function() {
    $('#popup_carga_note').fadeOut('slow');
    $("#popup_carga_note").empty();
    $("#popup_carga_note").dialog('destroy');
});

mouse();

$(function() {
    $('.panorama-container').draggable({cursor: "move"});
    $('.panorama-container').draggable("disable");
});





$("[data-slider]")
        .each(function() {
    var input = $(this);
    $("<p>")
            .addClass("output")
            .insertAfter($(this));
})
        .bind("slider:ready slider:changed", function(event, data) {
    $(this)
            .nextAll(".output:first")
            .html(data.value.toFixed(3));
    var suma = data.value * 2;
    var resta = 1;
    if (suma > 1) {
        resta = resta / suma;
    } else
    if (suma < 1) {
        resta = resta / suma;
    }
    $("#panorama")
            .css('-webkit-transform', 'scale(' + suma + ')')
            .css('-webkit-transform', 'scale(' + suma + ')')
            .css('-moz-transform', 'scale(' + suma + ')')
            .css('-o-transform', 'scale(' + suma + ')')
            .css('transform', 'scale(' + suma + ')');
});