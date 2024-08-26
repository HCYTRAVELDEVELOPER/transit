qx.Class.define("qxnw.basics.forms.f_configuracion", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle("Configuraciones generales");
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
                name: "all_top",
                label: "Margen arriba",
                type: "textField",
                required: true
            },
            {
                name: "all_left",
                label: "Margen izquierda",
                type: "textField",
                required: true
            },
            {
                name: "width",
                label: "Ancho",
                type: "textField",
                required: true
            },
            {
                name: "tipo_impresion",
                label: "Tipo de impresión",
                caption: "tipo_impresion",
                type: "selectBox"
            }];
        this.setFields(fields);
        this.setGroupHeader("Editar");
        var data = {};
        data["EPSON"] = "EPSON";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_impresion, data);
        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
        self.populateConfigurations();
    },
    destruct: function() {
    },
    members: {
        pr: null,
        populateConfigurations: function populateConfigurations() {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "nw_configuraciones");
            var r = rpc.exec("getData");
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            if (r.length != 0 && r != false) {
                self.setRecord(r);
            }
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones");
            rpc.setAsync(true);
            var func = function(r) {
                self.accept();
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            return true;
        }
    }
});
