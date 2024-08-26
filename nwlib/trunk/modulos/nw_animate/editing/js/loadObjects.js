function jsLoadObjects() {
    $(".buttonAddaCapa").click(function() {
        var id = $(this).attr("name");
        addACapaObjects(id);
    });
    $(".buttonBloquear").click(function() {
        var id = $(this).attr("name");
        bloquearObjects(id);
    });
    $(document).keydown(function(tecla) {
        var div = $(".selectedObject");
        if (div.length == 0) {
            return;
        }
        var suma = -0.7;
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
        $(".box_object").removeClass("selectedObject");
        $("#ancho").val(width);
        $("#alto").val(height);
        $("#left").val(left);
        $("#top").val(top);
        $("#rotacion").val(rotation);
        $("#object_" + d).addClass("selectedObject");
        $(".imgObject").removeClass("selectedObject_inter");
        $("#imgObject_" + d).addClass("selectedObject_inter");
        $(".objectList").removeClass("selectedObjectLeft");
        $(".objectList_" + d).addClass("selectedObjectLeft");
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
    $(".contendImg").append("<div class='border_plano border_plano_left'></div><div class='border_plano border_plano_right'></div><div class='border_plano border_plano_top'></div><div class='border_plano border_plano_bottom'></div>");
    $(".box_object").draggable();
    $(".box_object").resizable();
    $(".remove").click(function() {
        var id = $(this).attr("name");
        $(".box_object" + id).remove();
    });
    $(".buttonEliminar").click(function() {
        var id = $(this).attr("name");
        deleteObjects(id);
    });
    $(".buttonEditar").click(function() {
        var id = $(this).attr("name");
        formNew(id);
    });
    $(".cerrarAnimationStart").click(function() {
        cerrarAnimationStart();
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
    $(".box_object").resize(function() {
        var w = $(this).width();
        var h = $(this).height();
        var id = $(this).attr("name");
        $(".div_pos_" + id).html(w + "px  *  " + h + "px");
    });
}