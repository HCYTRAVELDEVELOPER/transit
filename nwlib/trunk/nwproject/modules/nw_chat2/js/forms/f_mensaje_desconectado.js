function f_mensaje_desconectado(thisDoc) {
    var up = getUserDataNwChat();
    var divPadreContainer = "body";
    var classDocument = ".container-mensaje-disconected" + thisDoc.rand;
    createContainer(divPadreContainer, true, classDocument);
    var self = createDocument(classDocument);
    var get = getGET();
    var fields = [
        {
            tipo: 'textArea',
            nombre: 'Mensaje',
            name: 'mensaje',
            requerido: "SI"
        }
    ];
    var tipo = "nopopup";
    if (isMobile()) {
        tipo = "popup";
    }
    createNwForms(self, fields, tipo);
    setRecord(self, up);
    setColumnsFormNumber(self, 1);
    noSubmitForm(self);
    addHeaderNote(self, "<div class='containMenOff'><h3></h3><p>Por favor déjanos tu mensaje, te responderemos en breve.</p></div>");
    addCss(self, "#nwform", {"max-width": "100%"});
    addCss(self, "", {"background-color": "#fff"});

    var data = {};
    data.id_sess = setDataSend();
    var rpc = {};
    rpc["service"] = "nwchat";
    rpc["method"] = "reinitNwChat";
    rpc["data"] = data;
    var func = function (r) {
    };
    rpcNw("rpcNw", rpc, func, true);

    if (!isMobile()) {
        addCss(self, ".divContainInputIntern", {"margin": "0", "padding": "0px"});
        addCss(self, ".mensaje", {"height": "70px", "padding": "3px"});
    }

    var accept = addButtonNwForm("Enviar", self);
    accept.click(function () {
        if (!validateRequired(self)) {
            return false;
        }
        var data = getRecordNwForm(self);
        data.origen = "form_desconectado";
        data.domain = get.href;
        data.url = get.origin;
        data.id_sess = setDataSend();
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "sendMessageDisconected";
        rpc["data"] = data;
        var func = function (r) {
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            var params = {};
            params.html = "<div class='divDisconecUserNwChat'>Hemos recibido tu mensaje, gracias por escribirnos.</div>";
            params.onSave = function () {
                resetForm(self);
                window.location.reload();
                return true;
            }
            params.textAccept = 'Aceptar';
            params.no_cancel_button = true;
            params.no_buttons_enc = true;
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);

            resetForm(self);
        };
        rpcNw("rpcNw", rpc, func, true);
    });
    removeLoadingNw();
    removedLoadingNwChat();
}