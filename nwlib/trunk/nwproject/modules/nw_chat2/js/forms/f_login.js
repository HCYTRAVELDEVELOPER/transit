function f_login(thisDoc) {
    var config = thisDoc.getConfigNwChat();
    var up = getUserDataNwChat();
    var divPadreContainer = "body";
    var classDocument = ".f_login" + thisDoc.rand;
    createContainer(divPadreContainer, true, classDocument);
    var self = createDocument(classDocument);
    var get = getGET();
    var fields = [];
    if (config["registro_usar_nombre"] != "NO") {
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Nombre',
                    name: 'nombre',
                    requerido: "SI"
                };
        fields.push(columnas);
    }
    if (config["registro_usar_email"] != "NO") {
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Correo',
                    name: 'correo',
                    requerido: "SI"
                };
        fields.push(columnas);
    }
    if (config["registro_usar_celular"] != "NO") {
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Celular',
                    name: 'celular',
                    mode: 'integer',
                    car_min: '10',
                    car_max: '10',
                    requerido: "SI"
                };
        fields.push(columnas);
    }

    createNwForms(self, fields);

    setColumnsFormNumber(self, 1);

    setRecord(self, up);
    addCss(self, "", {"background-color": "#fff"});
    $('#nwform').submit(function () {
        return false;
    });
    var html = "";
    html += "<div class='enc_log'>";
    if (evalueData(config["banner"])) {
        html += "<div class='img_log_enc' style='background-image: url(" + config["banner"] + ");'></div>";
    }
    html += config["texto_bienvenida"];
    html += "</div>";
    html += "<div class='texto_registro' id='pasa_form'>";
    html += config["texto_registro"];
    html += "</div>";
    addHeaderNote(self, html);
    addCss(self, ".divContainInputIntern", {"margin": "0px", "padding": "0px 5px"});
    var celular = actionInColForm(self, "celular");
    celular.keypress(function (e) {
        if (e.which == 13) {
            initChatWindow1(self, config);
            return false;
        }
    });
    var accept = addButtonNwForm("Aceptar", self);
    accept.click(function () {
        /*
        if (typeof videoCallNwChat != "undefined") {
            if (videoCallNwChat === true) {
                return;
            }
        }
        */
        initChatWindow1(self, config);
    });
    removedLoadingNwChat();

    function initChatWindow1(self, config) {
        if (!validateRequired(self)) {
            return false;
        }
        var data = getRecordNwForm(self);
        data.tipo = "chat";
        if (typeof videoCallNwChat != "undefined") {
            if (videoCallNwChat === true) {
                data.tipo = "videollamada";
            }
        }
        data.operatorsOnline = operatorsOnline;
        data.id_sess = setDataSend();
        data.get = get;
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "saveUserVisitante";
        rpc["data"] = data;
        var func = function (r) {
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            __userDataNwChat.celular = data.celular;
            __userDataNwChat.correo = data.correo;
            __userDataNwChat.email = data.correo;
            if (config.requiere_redireccion_a_seccion == "SI") {
                createSecciones(thisDoc);
                remove(self);
            } else {
                if (operatorsOnline == false) {
                    thisDoc.createWindowMessageDisconect();
                    remove(self);
                } else {
                    thisDoc.createNwChatConversation();
                }
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}