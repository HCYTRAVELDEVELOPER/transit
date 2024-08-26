$(document).ready(function () {
    //CARGA LA BD QUE EXISTA
    setTimeout(function () {
        verHistorial();
        nuevoRegistro();
    }, 1000);

    (function () {
        $('body').delegate('.execInsertDb', 'click', function () {
            var table = $(this).attr("data-db");
            add(table, "#nwform");
        });
    })();
    (function () {
        $('body').delegate('.loadTableDb', 'click', function () {
            verHistorial(this);
        });
    })();
    (function () {
        $('body').delegate('.newRegistroNwForm', 'click', function () {
            nuevoRegistro();
        });
    })();
    (function () {
        $('body').delegate('.nwSync', 'click', function () {
            syncAuto();
        });
    })();
    if ($("#nwform").attr("data-consult") == "SI") {
        getDataFormEnc();
    }


    setInterval(function () {
        syncAuto();
    }, 5000);
});
function syncAuto() {
    var div = $(".nwSync");
    var table = div.attr("data-db");
    var url = div.attr("data-url");
    loadAll(table, "sendToServer", url);
}
function nuevoRegistro() {
    $(".containFormFields").fadeIn(0);
    $(".loadTableDb").fadeIn(0);
    $(".newRegistroNwForm").fadeOut(0);
    $(".elementsList").empty();
    $(".elementsList").fadeOut(0);
}
function verHistorial(self) {
    if (self == undefined)
        self = ".loadTableDb";
    var table = $(self).attr("data-db");
    $(".newRegistroNwForm").fadeIn(0);
    $(".containFormFields").fadeOut(0);
    $(".loadTableDb").fadeOut(0);
    $(".elementsList").fadeIn(0);
    loadAll(table);
//            tableHtmlToArray();
}
function loadDataExtern(url, table, fields) {
    var data = {};
    if (url == undefined) {
        data["url"] = "/nwlib6/nwproject/modules/nwforms/srv/loadDataExtern.php";
    } else {
        data["url"] = url;
    }
    data["table"] = table;
    data["fields"] = fields;
    var table = $(".loadTableDb").attr("data-db");
    $.ajax({
        type: "post",
        url: data["url"],
        data: data,
        dataType: "json",
        error: function () {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. Es probable que no tenga conexión a internet.");
            return;
        },
        success: function (data) {
            setTimeout(function () {
                for (var i = 0; i < data.length; i++) {
                    add(table, data[i]);
                }
                verHistorial();
            }, 2000);
            return true;
        }
    });
}
function getDataFormEnc() {
    var id = $("#nwform").attr("data-i");
    $.ajax({
        type: "post",
        url: "/nwlib6/nwproject/modules/nwforms/srv/getDataFormEnc.php",
        data: {id: id},
        dataType: "json",
        error: function () {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. Es probable que no tenga conexión a internet.");
            return;
        },
        success: function (data) {
            if (data.url_consulta != null) {
                loadDataExtern(data.url_consulta);
            } else
            if (data.offline_tabla_consulta != null && data.offline_campos_tabla_consulta != null) {
                loadDataExtern(undefined, data.offline_tabla_consulta, data.offline_campos_tabla_consulta);
            }
            return true;
        }
    });
}
