function f_llamada_video() {
    var esteDoc = this;
    esteDoc.constructor = constructor;
    var get = getGET();
    var datosCliente = getUserDataNwChat();
    function constructor() {
        var divPadreContainer = "body";
        var classDocument = ".container-conversations";
        createContainer(divPadreContainer, true, classDocument);
        var self = createDocument(classDocument);
        var fields = [];
        createNwForms(self, fields, "nopopup");
        removeButtonsNwForm(self);
        $(self).append("<div class='conectadoCall'>Conectando... Por favor espere. <div class='finalizarCh'><span>Finalizar</span></div> </div>");
        var d = new f_chat();
        console.log(datosCliente);

        var data = {};
        data.id_sess = setDataSend();
        data.getEnc = get;
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "initCallVideo";
        rpc["data"] = data;
        var func = function (r) {
            console.log(r);
            if (!verifyErrorNwMaker(r)) {
                return;
            }
        };
        rpcNw("rpcNw", rpc, func, false);

        d.cargaMensajesAll(self, false, false, false, false, function (ra, d) {
            var esteDoc = d.esteDoc;
            if (ra.length > 0) {
                for (var i = 0; i < ra.length; i++) {
                    var g = ra[i];
                    console.log(g);
                    if (g.usuario == "Autocontestador" && g.status == "FINALIZADO") {
                        $(self).html("<div class='conectadoCall'>" + g.texto + "</div>");
                        esteDoc.reinitNwChat();
                        return;
                    }
                    if (g.usuario != "Autocontestador" && g.usuario != datosCliente.correo && g.usuario != datosCliente.nombre && g.texto.indexOf("__automensaje__") === -1) {
                        var data = {};
                        data.id_sess = setDataSend();
                        data.getEnc = get;
                        data.operador = g.usuario;
                        var rpc = {};
                        rpc["service"] = "nwchat";
                        rpc["method"] = "insertMessageVideocall";
                        rpc["data"] = data;
                        var func = function (r) {
                            console.log(r);
                            if (!verifyErrorNwMaker(r)) {
                                return;
                            }
                            initVideoCallNwC(g.usuario);
                        };
                        rpcNw("rpcNw", rpc, func, true);
                        return;
                    }
                }
            }
        });
    }
}
removedLoadingNwChat();