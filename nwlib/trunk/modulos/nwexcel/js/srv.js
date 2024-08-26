function crearCondicional() {
    var id_documento = $("#form_general").attr("data-id");
    var campo_div = $(".td_selected").attr("id");
    var val = $(".td_selected").text();
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/src/condicionales.php",
        type: 'post',
        data: {id_documento: id_documento, campo_div: campo_div, val: val},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $("<div calss='popup_gen'>" + data + "</div>").dialog({
                title: 'Condicionales',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: '600',
                width: '500',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                },
                buttons: {
                    'Aceptar': function() {
                        save_conditions();
                    },
                    'Cancelar': function() {
                        $(this).dialog('close');
                        $(this).empty();
                    }
                }
            });
        }
    });
}
function save_conditions() {
    var data = $("#form_conditions").serialize();
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save_condicionales.php",
        type: 'post',
        data: data,
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
            return;
        },
        success: function(data) {
            if (data != "")
                alert(data);
            $(".ui-dialog").remove();
        }
    });
}
function share_file() {
    var id = $("#form_general").attr("data-id");
    var name = $("#name_file").val();
    var url = window.location.href;
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/src/permisos.php",
        type: 'post',
        data: {id: id, url: url},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $("<div calss='popup_gen'>" + data + "</div>").dialog({
                title: 'Compartir Archivo',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: '300',
                width: '500',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                },
                buttons: {
                    'Aceptar': function() {
                        save_permisos();
                    },
                    'Cancelar': function() {
                        $(this).dialog('close');
                        $(this).empty();
                    }
                }
            });
        }
    });
}
function save_permisos() {
    var id = $("#form_general").attr("data-id");
    var acceso = $("#acceso").val();
    var permisos = $("#permisos").val();
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save_permisos.php",
        type: 'post',
        data: {id: id, acceso: acceso, permisos: permisos},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
            return;
        },
        success: function(data) {
            alert(data);
            $(".ui-dialog").remove();
        }
    });
}
function code() {
    var id = $("#form_general").attr("data-id");
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/src/load_code.php",
        type: 'post',
        data: {id: id},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            var html = "<h2>Código Javascript de Funciones</h2>< script ><textarea class='code_text' name='code_text' id='code_text' >" + data + "</textarea>< / script >";
            $("<div class='div_code'>" + html + "</div>").dialog({
                title: 'Guardar',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: '650',
                width: '800',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                },
                buttons: {
                    'Aceptar': function() {
                        save_code();
                    },
                    'Cancelar': function() {
                        $(this).dialog('close');
                        $(this).empty();
                    }
                }
            });
        }
    });
}
function codeCss() {
    var id = $("#form_general").attr("data-id");
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/src/load_code_css.php",
        type: 'post',
        data: {id: id},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            var html = "<h2>Código CSS</h2>< style ><textarea class='code_text' name='code_text' id='code_text' >" + data + "</textarea>< / style >";
            $("<div class='div_code'>" + html + "</div>").dialog({
                title: 'Guardar',
                stack: true,
                autoOpen: true,
                resizable: false,
                modal: true,
                height: '650',
                width: '800',
                sticky: true,
                close: function() {
                    $(this).empty();
                    $(this).dialog('destroy');
                },
                buttons: {
                    'Aceptar': function() {
                        save_code_css();
                    },
                    'Cancelar': function() {
                        $(this).dialog('close');
                        $(this).empty();
                    }
                }
            });
        }
    });
}
function save_code_css() {
    var id = $("#form_general").attr("data-id");
    var code_css = $("#code_text").val();
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save_code_css.php",
        type: 'post',
        data: {id: id, code_js: code_css},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
            } else {
                $(".div_code").dialog('close');
                $(".div_code").empty();
                loadCode();
            }
        }
    });
}
function save_code() {
    var id = $("#form_general").attr("data-id");
    var code_js = $("#code_text").val();
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save_code.php",
        type: 'post',
        data: {id: id, code_js: code_js},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            if (data != "") {
                alert(data);
            } else {
                $(".div_code").dialog('close');
                $(".div_code").empty();
                loadCode();
            }
        }
    });
}
function loadCode() {
    var id = $("#form_general").attr("data-id");
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/src/execute_code.php",
        type: 'post',
        data: {id: id},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            $("#contain_code_js").html(data);
            values();
        }
    });
}
function save() {
    createLoading();
    //SACO VARIABLES GLOBALES, ID PLANTILLA, OTROS
    var id = $("#form_general").attr("data-id");
    var plantilla = $("#form_general").attr("data-plantilla");
    var guardar = $("#form_general").attr("data-guardar");
    //GUARDO LAS VARIABLES GLOBALES PRIMERO O PUEDE SER DE ÚLTIMO
    var global = $(".varGlobal");
    var t_globals = global.length;
    if (t_globals > 0) {
        //ELIMINO TODAS LAS VARIABLES DE LA HOJA
        $.ajax({
            url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/delete_variables_globales.php",
            type: 'post',
            data: {hoja: id},
            error: function() {
                console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
            },
            success: function(data) {
                if (data != "") {
                    alert("Error al borrar variables. data: " + data);
                    return;
                }
            }
        });
        //GUARDO LAS VRIABLES DE LA HOJA
        for (var g = 0; g < t_globals; g++) {
            var dat = $(global[g]).text();
            $.ajax({
                url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save_variables_globales.php",
                type: 'post',
                data: {hoja: id, nombre: dat},
                error: function() {
                    console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    if (data != "") {
                        alert("Error al guardar variables. data: " + data);
                        return;
                    }
                }
            });
        }
    }
//LÍMPIO EL HTML A GUARDAR, LE QUITO LA PRIMERA FILA Y LA PRIMERA COLUMNA QUE SON DE LETRAS Y OTRO
    var texto = cleanDocumentHtml();
    var nombre = $("#nombre").val();
    var tipo = $("#tipo").val();
    if (nombre == undefined) {
        nombre = "";
    }
    $.ajax({
        url: "/nwlib" + vnwlib + "/modulos/nwexcel/srv/save.php",
        type: 'post',
        data: {id: id, texto: texto, nombre: nombre, tipo: tipo, plantilla: plantilla, guardar: guardar},
        error: function() {
            console.log("La operación no pudo ser procesada. Inténtelo de nuevo. ");
        },
        success: function(data) {
            var de = data.split("||");
            if (de[0] == "error") {
                alert(data);
            } else {
                alert("Guardado correctamente");
//                console.log(data);
//                return;
                window.location = data;
            }
        }
    });
}
function guardar_como() {
    var name = $("#name_file").val();
    var html = "";
    html += "<h2>Nombre del archivo</h2>";
    html += "<input type='text' name='nombre' id='nombre' value='" + name + "' />";
    html += "<p><br />Opciones Avanzadas";
    html += "<p>Tipo: <select name='tipo' id='tipo'>";
    html += "<option value='normal'>Normal</value>";
    html += "<option value='plantilla'>Plantilla</value>";
    html += "</select></p>";
    $("<div>" + html + "</div>").dialog({
//        position: 'top',
        title: 'Guardar',
        stack: true,
        autoOpen: true,
        resizable: false,
        modal: true,
        height: '300',
        width: '500',
        sticky: true,
        close: function() {
            $(this).empty();
            $(this).dialog('destroy');
        },
        buttons: {
            'Aceptar': function() {
                validate_doc();
            },
            'Cancelar': function() {
//                $(".container").removeClass("efectBlur");
                $(this).dialog('close');
//                        $(this).dialog('destroy');
                $(this).empty();
            }
        }
    });
}