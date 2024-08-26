function muroGrupal(self) {
    self = generateSelf(self);
    var thisDoc = this;
    this.constructor = constructor;
    this.cargaMensajesMuro = cargaMensajesMuro;
    this.self = self;

    function constructor(grupo, grupo_text) {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'Mensaje',
                name: 'mensaje',
                texto_ayuda: 'Escribe tu mensaje',
                requerido: "SI",
                autocomplete: false
            },
            {
                tipo: 'button',
                nombre: 'Enviar',
                name: 'enviar'
            }
        ];
        createNwForms(self, fields);
        removeButtonsNwForm(self);
        setColumnsFormNumber(self, 2);
        $('#nwform').submit(function () {
            var data = getRecordNwForm(self);
            data["grupo"] = grupo;
            data["grupo_text"] = grupo_text;
            sendMessageMuro(self, data);
            return false;
        });

        addHeaderNote(self, "<h2 class='subtitles_bloques'>Muro Grupal</h2>");
//        addHeaderNote(self, "");

        listAddCssFor(self, ".contain_input_name_mensaje", {"width": "200px"});
        listAddCssFor(self, ".contain_input_name_enviar", {"width": "70px", "min-width": "70px", "max-width": "70px"});
        listAddCssFor(self, "#enviar", {"text-shadow": "none", "border": "0"});
        listAddCssFor(self, ".addHeaderNote", {"padding": "0", "margin": "0"});
        listAddCssFor(self, "#nwform", {"background": "#ffffff", "border": "1px solid rgb(223, 224, 228)", "border-left": "0", "border-right": "0", "box-shadow": "1px -3px 5px rgba(0, 0, 0, 0.28)"});
        listAddCssFor(self, "", {"background": "#f6f6f6", "box-shadow": "none", "border": "1px solid rgb(223, 224, 228)"});
        listAddCssFor(self, ".footerButtonsNwForms", {"display": "none"});
        listAddCssFor(self, ".divContainInput p", {"display": "none"});
        listAddCssFor(self, ".divContainInputIntern", {"margin": "0", "padding": "0"});
        listAddCssFor(self, "#nwform input, select", {"margin": "2px", "padding": "8px"});

        var send = actionInColForm(self, "enviar");
        send.click(function () {
            var data = getRecordNwForm(self);
            data["grupo"] = grupo;
            data["grupo_text"] = grupo_text;
            sendMessageMuro(self, data);
        });

        thisDoc.cargaMensajesMuro(self, false, grupo);

        $(self + " .addHeaderNote").css({"max-height": "300px", "overflow-x": "hidden", "overflow-y": "auto"});

    }

    function cargaMensajesMuro(self, leido, grupo) {
        var rpc = {};
        rpc["service"] = "nwTask";
        rpc["method"] = "consultaMuroAll";
        rpc["data"] = {leido: leido, grupo: grupo};

        var func = function (r) {
            if (r) {

                var html = createLinesConversation(r);
                addHeaderNote(self, html, "append");
//            addHeaderNote(self, html, "before");

//                scroll();

//                soundOperator();

            }

//            setTimeout(function() {
//                cargaMensajesMuro(self, true, grupo);
//            }, 5000);

        };
        rpcNw("rpcNw", rpc, func);
    }
}

function sendMessageMuro(self, data) {

    if (!validateRequired(self)) {
        return false;
    }

    var rpc = {};
    rpc["service"] = "nwTask";
    rpc["method"] = "sendMessageMuro";
    rpc["data"] = data;
    var func = function (r) {

        if (r == "0") {
            nw_dialog("Lo sentimos, no se puedo enviar el mensaje.");
        }
        if (r) {

            $(".subtitles_bloques").remove();

            var ra = Array();
            ra["mensaje"] = data["mensaje"];
            var html = lineByLineMuro(ra);
            addHeaderNote(self, html, "prepend");

//            scroll();

//            soundUser();

            resetForm(self);

        } else {
            nw_dialog("A ocurrido un error: " + r);
            console.log(r);
        }
    };
    rpcNw("rpcNw", rpc, func);
}

function createLinesConversation(ra) {
    var total = ra.length;
    var rta = "";
    if (total == undefined) {
        rta += lineByLineMuro(ra);
    } else {
        for (var i = 0; i < total; i++) {
            var r = ra[i];
            rta += lineByLineMuro(r);
        }
    }
    return rta;
}

function lineByLineMuro(r) {

    var up = getUserInfo();

    var nombre = up["nombre"] + " " + up["apellido"];
    var foto = up["foto_perfil"];

    if (typeof r["nombre_envia"] != "undefined") {
        nombre = r["nombre_envia"];
    }

    if (typeof r["foto_perfil"] != "undefined") {
        foto = r["foto_perfil"];
    }

    var rta = "";
    if (r["fecha"] == undefined) {
        r["fecha"] = getDateHour();
    }

    var hoy = getFechaHoy();
    var fecha_split = r["fecha"].split(" ");

    if (fecha_split[0] == hoy) {
        r["fecha"] = fecha_split[1];
    }
    rta += "<div class='chats_conversations'>";
    rta += "<div class='photo' style='background-image: url(/nwlib6/includes/phpthumb/phpThumb.php?src=" + foto + "&w=80&f=jpg);' ></div>";

    rta += "<div class='message_all'>";

    rta += "<div class='message_only'>";
    rta += "<p class='usuario'><span>" + nombre + ":</span></p>";
    rta += "<p class='mensaje_muro'>" + r["mensaje"] + "</p>";
    rta += "</div>";

    rta += "<p class='fecha_conversation'>" + r["fecha"] + "</p>";
    rta += "</div>";

    rta += "</div>";
    return rta;
}