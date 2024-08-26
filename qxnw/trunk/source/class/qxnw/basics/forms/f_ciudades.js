qx.Class.define("qxnw.basics.forms.f_ciudades", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Administración de ciudades");
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
                name: "pais",
                label: self.tr("País"),
                caption: "pais",
                type: "selectBox",
                required: true
            },
            {
                name: "departamento",
                label: self.tr("Departamento"),
                caption: "departamento",
                type: "selectBox",
                required: true
            }];
        self.setFields(fields);

        var data = {};
        data["TODOS"] = "Todos";
        qxnw.utils.populateSelectFromArray(self.ui.departamento, data);
        qxnw.utils.populateSelectFromArray(self.ui.pais, data);
        qxnw.utils.populateSelect(self.ui.pais, "nw_configuraciones", "getAllPaises", 0);
        
        self.ui.pais.addListener("changeSelection", function (e) {
            var sl = self.getRecord();
            self.ui.departamento.removeAll();
            qxnw.utils.populateSelect(self.ui.departamento, "nw_configuraciones", "getAllDepartamentos", sl);
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
        pr: null,
        slotSave: function slotSave() {
            var self = this;
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_ciudades", true);
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
