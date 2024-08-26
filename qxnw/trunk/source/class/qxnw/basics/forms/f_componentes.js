qx.Class.define("qxnw.basics.forms.f_componentes", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Administración de componentes");
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "empresa",
                label: self.tr("Empresa"),
                caption: "empresa",
                type: "textField",
                enabled: false
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                caption: "nombre",
                type: "textField"
            },
            {
                name: "clase",
                label: self.tr("Clase"),
                caption: "clase",
                type: "textField"
            },
            {
                name: "grupo",
                label: self.tr("Grupo"),
                caption: "grupo",
                type: "selectBox"
            },
            {
                name: "iconos_home",
                label: self.tr("Iconos Home"),
                caption: "icnos_home",
                type: "uploader"
            }];
        self.setFields(fields);

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
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_componentes", true);
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
