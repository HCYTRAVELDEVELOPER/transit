var url = "/nwlib6/modulos/juegos/";
function prepareLinks() {
    $(".cincu_cincu").click(function() {
        var id = $(this).attr('id');
        ayudaCincu(id);
    });

}
$(document).ready(function() {
    prepareLinks();
});
function load_mi_espacioNWSites(i, p, sesion, nivel) {
    $.ajax({
        url: url + 'millonario/src/response.php',
        type: 'post',
        data: {
            id: i,
            pr: p,
            sesion: sesion,
            nivel: nivel
        },
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            setTimeout(function() {
                $(".contendResponsesResponse").html(data);
            }, 2000);
        }
    });
}
function ayudaCincu(id) {
    if(id == undefined) {
        return;
    }
    if(id == "") {
        return;
    }
    $(".helps").load(url + 'millonario/src/ayudas/cincu.php', {id: id});
}
