var anima;
$(document).ready(function() {
    //////////////////////////////////////////////////////////NO PERMITE SELECCIONAR TEXTO ////////////////////////////////////
    document.onselectstart = function() {
//        return false;
    };
// Firefox
    document.onmousedown = function() {
//        return false;
    };
    ///////////////////////////////////////////////INHABILITA CLIC DERECHO
    document.oncontextmenu = function() {
        return false;
    };
    //////////////INHABILITA CONTROL U ALT ETC ///////////////////////////////////
    document.onkeydown = function(e) {
        if (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 117 || e.keycode === 17 || e.keycode === 85)) {
        }
//        return false;
    };
    $(document).keydown(function(tecla) {
        var div = $(".selectedObject");
        if (div.length == 0) {
            return;
        }
        var suma = 1;
        var left = div.position().left;
        var leftN = left + suma;
        var leftM = left - suma;
        var top = div.position().top;
        var topN = top + suma;
        var topM = top - suma;
        if (tecla.keyCode == 39) {
            div.css({left: leftN});
        }
        if (tecla.keyCode == 37) {
            div.css({left: leftM});
        }
        if (tecla.keyCode == 40) {
            div.css({top: topN});
        }
        if (tecla.keyCode == 38) {
            div.css({top: topM});
        }
    });
    $(".buttonDeleteAnimar").click(function() {
        var d = $(this).attr("name");
        buttonDeleteAnimar(d);
    });
    $(".code_ocult").click(function() {
        var d = $(this).attr("data-e");
        var o = $(this).attr("data-o");
        openCodeOcult(d, o);
    });
//    $("body").click(function(e) {
    $(".center").click(function(e) {
        if (e.target.id == ".box_object" || $(e.target).parents(".box_object").size()) {
//            alert("Inside div");
        } else {
            $(".imgObject").removeClass("selectedObject_inter");
            $(".objectList").removeClass("selectedObjectLeft");
            $(".box_object").removeClass("selectedObject");
        }
    });
    $(".box_object").click(function() {
        var d = $(this).attr("name");
//        var width = $(this).attr("width");
//        var height = $(this).attr("height");
//        var left = $(this).attr("left");
//        var top = $(this).attr("top");
        var rotation = $(this).attr("nwrotation");
        var width = $(this).width();
        var height = $(this).height();
        var post = $(this).position();
        var left = post.left;
        var top = post.top;
        selectedObject(d);
//        $(".box_object").removeClass("selectedObject");
        $("#ancho").val(width);
        $("#alto").val(height);
        $("#left").val(left);
        $("#top").val(top);
        $("#rotacion").val(rotation);
//        $("#object_" + d).addClass("selectedObject");
//        $(".imgObject").removeClass("selectedObject_inter");
//        $("#imgObject_" + d).addClass("selectedObject_inter");
//        $(".objectList").removeClass("selectedObjectLeft");
//        $(".objectList_" + d).addClass("selectedObjectLeft");
//         $(".opacityObjecTempInput").fadeIn();
        $(".opacityObjecTemp").fadeIn();

        var h = $(".listObject" + d).position();
        $(".ulLeftObjects").scrollTop(h.top);
    });

    $(".box_object").mousedown(function() {
        var d = $(this).attr("name");
        $("#object_" + d).addClass("selectedObjectHandler");
    });
    $(".box_object").mouseup(function() {
        $(".box_object").removeClass("selectedObjectHandler");
    });
    $(".opacityObjecTempInput").change(function() {
        var v = $(this).val();
        var opac = v / 100;
        $(".selectedObject_inter").css("opacity", opac);
    });
    $(".rotacion").change(function() {
        var v = $(this).val();
        $(".selectedObject").attr("nwrotation", v);
        $(".selectedObject").css("transform", "rotate(" + v + "deg)");
    });
    $(".perspectiveX").change(function() {
        var v = $(this).val();
        var div = $(".selectedObject_inter");
        div.attr("perspectiveX", v);
        var y = div.attr("perspectiveY");
        console.log(y);
        div.css("transform", "rotateX(" + v + "deg) rotateY(" + y + "deg) ");
    });
    $(".perspectiveY").change(function() {
//        var v = $(this).val();
//        $(".selectedObject_inter").attr("perspectiveY", v);
//        $(".selectedObject_inter").css("transform", "rotateY(" + v + "deg)");
        var v = $(this).val();
        var div = $(".selectedObject_inter");
        div.attr("perspectiveY", v);
        var y = div.attr("perspectiveX");
        div.css("transform", "rotateX(" + y + "deg) rotateY(" + v + "deg) ");
    });
    $("#ancho").change(function() {
        var v = $(this).val();
        $(".selectedObject").width(v);
    });
    $("#alto").change(function() {
        var v = $(this).val();
        $(".selectedObject").height(v);
    });
    $("#top").change(function() {
        var v = $(this).val();
        $(".selectedObject").css({"top": v + "px"});
    });
    $("#left").change(function() {
        var v = $(this).val();
        $(".selectedObject").css({"left": v + "px"});
    });
    $(".fondo").change(function() {
        var v = $(this).val();
        $(".contendImg").css("background-color", v);
    });
    $(".box_object").draggable();
    $(".box_object").resizable();
    $(".remove").click(function() {
        var id = $(this).attr("name");
        $(".box_object" + id).remove();
    });
    $(".addBox").click(function() {
        var type = $(this).attr("nwclass");
        formNew(0, type);
    });
    $("#save").click(function() {
        saveFinal();
    });
    $(".cerrarAnimationStart").click(function() {
        cerrarAnimationStart();
    });
    $(".zoomMas").click(function() {
        zoomCenter(1);
    });
    $(".zoomMenos").click(function() {
        zoomCenter(0);
    });
    $(".buttonAnimar").click(function() {
        anima = "si";
        $(".buttonEnc").fadeOut();
        var str = $(this).attr("name");
        var data = str.split(",");
        var id = data[0];
        var v = data[1];
        var r = data[2];
        activaInterpolacionMovimiento(id, v, r);
//        createLineTime();
        insertFotogramasObject();
    });
    $(".crearFotograma").click(function() {
        var id = $(".mover_inicial").attr("name");
        moverAnimationSrv(id);
    });
    $(".box_object").resize(function() {
        var w = $(this).width();
        var h = $(this).height();
        var id = $(this).attr("name");
        $(".div_pos_" + id).html(w + "px  *  " + h + "px");
    });
    $(".guardarAnimation").click(function() {
        var id = $(this).attr("name");
        saveAnim(id);
    });
    loadObjects();
});