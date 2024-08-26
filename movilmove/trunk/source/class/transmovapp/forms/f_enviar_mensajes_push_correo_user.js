qx.Class.define("transmovapp.forms.f_enviar_mensajes_push_correo_user", {
    extend: qxnw.forms,
    construct: function (user, perfil) {
        var self = this;
        this.base(arguments);
        this.createBase();
        console.log("user", user);
        self.setGroupHeader(self.tr("Editar mensaje push y correo"));
        var fields = [
            {
                name: "perfil",
                caption: "perfil",
                label: self.tr("Perfil"),
                type: "selectBox",
                required: true
            },
            {
                name: "usuario",
                caption: "usuario",
                label: self.tr("Usuario"),
                type: "textField",
                required: true
            },
            {
                name: "asunto",
                caption: "asunto",
                label: self.tr("Asunto"),
                type: "textField",
                required: true
            },
            {
                name: "cuerpo",
                caption: "cuerpo",
                label: self.tr("Mensaje"),
                type: "textArea",
                required: true
            }
        ];
        self.setFields(fields);
        
        self.setTitle(self.tr("Editar mensaje push y correo"));

        var data = {};
        data[""] = self.tr("Seleccione");
        data["1"] = self.tr("Pasajero");
        data["2"] = self.tr("Conductor");
        qxnw.utils.populateSelectFromArray(self.ui.perfil, data);

        self.ui.perfil.setValue(perfil);
        self.ui.usuario.setValue(user);

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

    },
    destruct: function () {
    },
    members: {
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var up = qxnw.userPolicies.getUserData();
            console.log("up", up);
            var data = self.getRecord();
            data.empresa = up.company;
            console.log("f_enviar_mensajes_push_correo_user:::slotSave:::sendData", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin", true);
            var func = function (r) {
                console.log("f_enviar_mensajes_push_correo_user:::slotSave:::responseServer", r);
                if (typeof r == "string") {
                    qxnw.utils.information(r);
                    return false;
                }
                for (var i = 0; i < r.tokens.length; i++) {
                    var re = r.tokens[i];
                    console.log("%cOK:::sendNotificationTo:::" + re.usuario + " perfil " + re.perfil + ">>>>", 'background: #ff3366; color: #fff');
                    main.sendNotificacion({
                        title: data.asunto,
                        body: data.cuerpo,
                        icon: "fcm_push_icon",
                        sound: "default",
                        data: "nw.dialog('Nuevo mensaje: " + data.cuerpo + "')",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: re.json
                    });
                }

                qxnw.utils.information("Mensaje enviado correctamente");
                self.reject();
            };
            rpc.exec("enviarMsgPushCorreo", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            return true;
        }
    }
});
