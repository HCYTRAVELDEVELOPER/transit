function remove_loading() {
    $("#loading").remove();
}
function createLoading() {
    $.ajax({
        url: "/nwlib" + vnwlib + "/includes/loading/index.php",
        type: 'post',
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            var html = "<div id='loading'>" + data + "</div>";
            $("body").append(html);
        }
    });
}