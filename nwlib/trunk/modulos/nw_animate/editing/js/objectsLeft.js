function jsObjectsLeft() {
    createLineTime();
    removeLoadint();
    $(".ulLeftObjects").scroll(function() {
        var t = $(this).scrollTop();
        $(".contendFotogramas").scrollTop(t);
    });
    $(".objectList").click(function() {
        var d = $(this).attr("name");
        $(".box_object").removeClass("selectedObject");
        $("#object_" + d).addClass("selectedObject");
        $(".objectList").removeClass("selectedObjectLeft");
        $(".objectList_" + d).addClass("selectedObjectLeft");

        $(".opacityObjecTempInput").fadeIn();
    });
    $(".buttonDuplicarLeft").click(function() {
        var id = $(this).attr("name");
        duplicarObject(id);
    });
    $(".buttonDelete").click(function() {
        var id = $(this).attr("id");
        deleteObjects(id);
    });
    $(".buttonAnimarLeft").click(function() {
        anima = "si";
        $(".buttonEnc").fadeOut();
        var str = $(this).attr("name");
        var data = str.split(",");
        var id = data[0];
        var v = data[1];
        var r = data[2];
        activaInterpolacionMovimiento(id, v, r);
        createLineTime();
        $("#object_" + id).stop();
    });
    $(".ulLeftObjects").sortable({
        connectWith: ".objectList",
        handle: ".buttonMove",
        cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder ui-corner-all",
        update: function(event, ui) {
            var data = $(this).sortable('toArray').toString();
            reordenar(data);
        }
    });
    $(".objectListImg").click(function() {
        var id = $(this).attr("name");
        formNew(id);
    });
    $(".objectList").mouseenter(function() {
        var id = $(this).attr("name");
        $(".box_object").removeClass("box_object_hover");
        $("#object_" + id).addClass("box_object_hover");
    });
    $(".objectList").mouseleave(function() {
        $(".box_object").removeClass("box_object_hover");
    });
}