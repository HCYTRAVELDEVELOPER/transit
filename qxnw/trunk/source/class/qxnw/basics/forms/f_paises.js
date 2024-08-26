qx.Class.define("qxnw.basics.forms.f_paises", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Administración de países");
        
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
                name: "alias",
                label: self.tr("Abreviatura"),
                caption: "alias",
                type: "textField"
            },
            {
                name: "idioma_text",
                label: self.tr("Idioma"),
                caption: "idioma_text",
                type: "textField"
            }];
        self.setFields(fields);

//        var data = {};
//        data["TODOS"] = "Todos";
//        qxnw.utils.populateSelectFromArray(self.ui.departamento, data);
//        qxnw.utils.populateSelectFromArray(self.ui.empresa, data);
//        qxnw.utils.populateSelectFromArray(self.ui.pais, data);
//        qxnw.utils.populateSelect(self.ui.departamento, "nw_configuraciones", "getAllDepartamentos", 0);
//        qxnw.utils.populateSelect(self.ui.empresa, "nw_permissions", "getEmpresas");
//        qxnw.utils.populateSelect(self.ui.pais, "nw_configuraciones", "getAllPaises", 0);

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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_paises", true);
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
