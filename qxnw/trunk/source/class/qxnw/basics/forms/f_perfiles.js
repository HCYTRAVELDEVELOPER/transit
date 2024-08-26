qx.Class.define("qxnw.basics.forms.f_perfiles", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Perfiles");
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "nombre",
                label: "Nombre",
                caption: "nombre",
                type: "textField"
            },
            {
                name: "tipo",
                label: "Tipo",
                caption: "tipo",
                type: "textField"
            },
            {
                name: "empresa",
                caption: "empresa",
                label: self.tr("Empresa"),
                type: "selectBox"
            }
        ];
        this.setFields(fields);
        qxnw.utils.populateSelect(self.ui.empresa, "nw_permissions", "getEmpresas");
        this.setGroupHeader("Editar");
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
        pr: null,
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "perfiles", true);
            var func = function () {
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
