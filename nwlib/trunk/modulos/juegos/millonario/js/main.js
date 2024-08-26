var url = "/nwlib6/modulos/juegos/";
function prepareLinks() {
    $(".playButton").click(function() {
        var id = $(this).attr('id');
        newSession(id);
    });
    $(".lisRes").click(function() {
        var id = $(this).attr('id');
        alert(id);
    });

}
function newSession(id) {
    $.ajax({
        url: url + 'millonario/src/newSession.php',
        type: 'post',
        data: {terminal: id},
        error: function() {
            alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            history.pushState(null, "Sesion", "?terminal=" + id + "&session=" + data);
            play(data, 0, 0, id);
//            $("#sesion").html("Has iniciado una nueva partida, sesión #" + data + ". Estás listo para comenzar?");
//            setTimeout(function() {
//                play();
//            }, 2000);
        }
    });
}
function play(data, nivel, id, terminal) {
    if (nivel == undefined) {
        nivel = 0;
    }
    if (id == undefined) {
        id = 0;
    }
    $(".containMainNivels").remove();
    $(".containMainNivelsHome").removeClass("rightFull");
    $("#playButton").removeClass("leftFull");
    $(".contendResponsesResponse").empty();
    $("#playButton").load(url + 'millonario/src/play.php', {sesion: data, nivel: nivel, id: id, terminal: terminal});
}
function init(i) {
    inicio = i;
    ConteoRegresivo();
}
function ConteoRegresivo() {
    pasa = inicio--;
    var div = document.getElementById("time");
    div.innerHTML = "<font>" + pasa + "</font>";
    if (pasa == 0) {
        window.clearTimeout(time);
        clearTimeout(time);
        inicio = 0;
        load_mi_espacioNWSites(0, 0);
        return false;
    }
    time = setTimeout("ConteoRegresivo(pasa)", 1000);
}
$(document).ready(function() {
    prepareLinks();
});
