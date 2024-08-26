qx.Class.define("qxnw.basics.forms.f_cambiar_clave_actualizar_datos", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle("Bienvenido");
        this.setColumnsFormNumber(0);
        this.addFooterNote(self.tr("<h2>Bienvenido!</h2>Para iniciar cambie su contraseña."));
        this.setInvalidateStore(true);
        this.setModal(true);
        this.set({modal: true});
        this.setSimpleWindow(true);
        // this.getChildControl("captionbar").setVisibility("excluded");
        this.createBase();
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "vieja",
                label: "Ingrese su actual contraseña",
                caption: "vieja",
                type: "passwordField",
                required: true
            },
            {
                name: "nueva",
                label: "Ingrese su nueva Contraseña",
                caption: "nueva",
                type: "passwordField",
                required: true
            }, {
                name: "repetida",
                label: "Vuelva a ingresar su nueva contraseña",
                caption: "repetida",
                type: "passwordField",
                required: true
            }];
        this.setFields(fields);
        var data = {
        };
        var buttons = [
            {
                name: "next",
                label: "Omitir este paso",
                icon: qxnw.config.execIcon("dialog-ok")
            }
            /*
             {
             name: "back",
             label: "Volver",
             icon: qxnw.config.execIcon("dialog-cancel")
             }*/
        ];
        self.addButtons(buttons);
        var up = qxnw.userPolicies.getUserData();
        if (up.profile != 1) {
            self.ui.next.hide();
        }
        self.ui.next.addListener("click", function() {
            self.slotNext();
        });

        self.ui.accept.setLabel("Guardar y Continuar");
        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.hide();
        /*
         self.ui.cancel.addListener("execute", function() {
         self.reject();
         });*/
    },
    destruct: function() {
    },
    members:
            {
                slotNext: function slotNext() {
                    var self = this;
                    /*if (!self.validate()) {
                     return;
                     }*/
                    self.accept();
                    var self = this;
                    var r = self.getRecord();
                    if (r == null) {
                        qxnw.utils.alert("Seleccione un registro");
                        return;
                    }
                    var d = new gsh.hv.forms.f_datos_basicos();
                    d.setModal(true);
                    if (!d.setParamRecord(r)) {
                        qxnw.utils.alert("No se usó el setParamRecord");
                        return;
                    }
                    d.show();
                },
                slotSave: function slotSave() {
                    var self = this;
                    if (!self.validate()) {
                        return;
                    }
                    var data = this.getRecord();
                    var rpc = new qxnw.rpc(this.rpcUrl, "session");
                    rpc.exec("cambiar_clave", data);
                    if (rpc.isError()) {
                        qxnw.utils.error(rpc.getError(), self);
                        return;
                    }
                    qxnw.utils.information("Clave cambiada correctamente");
                    self.accept();
                   /* var self = this;
                    var r = self.getRecord();
                    if (r == null) {
                        qxnw.utils.alert("Seleccione un registro");
                        return;
                    }
                    var d = new gsh.hv.forms.f_datos_basicos();
                    d.setModal(true);
                    if (!d.setParamRecord(r)) {
                        qxnw.utils.alert("No se usó el setParamRecord");
                        return;
                    }
                    d.show();*/
                },
                setParamRecord: function setParamRecord(pr) {
                    this.setRecord(pr);
                    return true;
                }
            }
});