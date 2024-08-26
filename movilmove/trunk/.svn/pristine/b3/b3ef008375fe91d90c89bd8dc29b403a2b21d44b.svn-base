qx.Class.define("usuarios_app.forms.f_usuarios_saldo", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.rest_s = false;
        self.setGroupHeader("Saldo usuarios");
        self.setTitle("Saldo usuario");
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: true,
                enabled: false
            },
            {
                name: "nombre",
                label: "Nombre",
                type: "textField",
                enabled: false
            },
            {
                name: "apellido",
                label: "Apellido",
                type: "textField",
                enabled: false
            },
            {
                name: "usuario",
                label: "Usuario",
                caption: "usuario",
                type: "textField",
                visible: false,
                enabled: false
            },
            {
                name: "saldo",
                label: "Saldo",
                caption: "saldo",
                type: "textField",
                required: true,
                enabled: false
            },
            {
                name: "saldo_add",
                label: "Saldo a agregar",
                caption: "saldo_add",
                type: "textField",
                required: true
            },
            {
                name: "saldo_new",
                label: "Nuevo Saldo",
                caption: "saldo_new",
                type: "textField",
                required: true,
                enabled: false
            },
            {
                name: "fecha_vencimiento_saldo",
                label: "Fecha vencimiento saldo",
                caption: "fecha_vencimiento_saldo",
                type: "dateTimeField",
                required: false,
                enabled: true
            }
        ];
        this.setFields(fields);

        self.ui.saldo_new.setValue("0");

        self.ui.saldo_add.addListener("input", function () {
            var up = qxnw.userPolicies.getUserData();
//            if (typeof up.bodega === "string") {
            var r = main.getPermiserv();
            console.log("rrrrrrrrrrrrr", r);
            if (qxnw.utils.evalueData(r)) {
                if (r.administrar_saldo == "true" || r.administrar_saldo == true) {
                    self.rest_s = true;
                }
            }
//            }
            var saldo_old = self.ui.saldo.getValue();
            var saldo_add = self.ui.saldo_add.getValue();
            var saldo_new = "";
            console.log("saldo_add", saldo_add);
            if (saldo_add < 0) {
                saldo_new = parseFloat(saldo_old) - (parseFloat(saldo_add) * (-1));
            } else {
                saldo_new = parseFloat(saldo_old) + parseFloat(saldo_add);
            }
            console.log("saldo_new", saldo_new);
            if (isNaN(saldo_new)) {
                saldo_new = saldo_old;
            }

            console.log("saldo_new", saldo_new);
            console.log("saldo_old", saldo_old);
            console.log("saldo_add", saldo_add);
            self.ui.saldo_new.setValue(saldo_new.toString());
        });
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
        navTable: null,
        slotSave: function slotSave() {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();
            data.rest_s = self.rest_s;
            data.bodega = up.bodega;
            data.empresa = up.company;
            var rpc = new qxnw.rpc(this.rpcUrl, "usuarios");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept(r);

                for (var i = 0; i < r.tokens.length; i++) {
                    var re = r.tokens[i];
                    console.log("re", re);
                    main.sendNotificacion({
                        title: "Nueva recarga",
                        body: "Tienes una nueva recarga",
                        icon: "fcm_push_icon",
                        sound: "default",
                        data: "main.nueva_recarga('nueva_recarga')",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: re.json
                    });
                }

            };
            rpc.exec("changeSaldo", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            return true;
        }
    }
});
