var url = "/nwlib6/modulos/";

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

$(".p_inmediatas").click(function() {
   $(".into_hidden_more").fadeIn(100); 
});

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
//    $(".weekend").animate({left: -leff}, 1100);
    $("html,body").animate({scrollTop: topp + 'px'}, 1100);
//    $("#calendar_nw").animate({scrollTop: topp + 'px'}, 1100);
    $(".weekend").animate({scrollTop: topp + 'px'}, 1100);
//    $( "#calendar_nw" ).scrollTop(topp);
//    $(".weekend").draggable({axis: "x"});
    $(".weekend").draggable({axis: "y"});
    $(".weekend").draggable();
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