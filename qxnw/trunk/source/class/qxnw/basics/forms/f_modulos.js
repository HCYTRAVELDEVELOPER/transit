qx.Class.define("qxnw.basics.forms.f_modulos", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle(self.tr("Módulos"));
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
                label: self.tr("Nombre"),
                caption: "nombre",
                type: "textField"
            },
            {
                name: "parte",
                label: self.tr("Parte"),
                caption: "parte",
                type: "textField"
            },
            {
                name: "icono",
                label: self.tr("Icono"),
                caption: "icono",
                type: "uploader"
            },
            {
                name: "pariente",
                label: self.tr("Pariente"),
                caption: "pariente",
                type: "selectBox",
                required: true
            },
            {
                name: "orden",
                label: self.tr("Orden"),
                caption: "orden",
                type: "textField"
            },
            {
                name: "mostrar_en_el_home",
                label: self.tr("Mostrar en el home"),
                caption: "mostrar_en_el_home",
                type: "selectBox"
            },
            {
                name: "empresa",
                caption: "empresa",
                label: self.tr("Empresa"),
                type: "textField",
                enabled: false
            }
        ];
        self.setFields(fields);
        var data = {};
        data["SI"] = "SI";
        data["NO"] = "NO";
        qxnw.utils.populateSelectFromArray(self.ui.mostrar_en_el_home, data);
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
            var data = self.getRecord();
            if (!self.validate()) {
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_modulos", true);
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
