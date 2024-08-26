qx.Class.define("qxnw.basics.forms.f_terminales", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Administración del menú");
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
                type: "selectBox",
                required: true
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
                name: "ciudad",
                label: self.tr("Ciudad"),
                caption: "ciudad",
                type: "selectBox",
                required: true
            },
            {
                name: "telefono",
                label: self.tr("Telefono"),
                caption: "telefono",
                type: "textField"
            },
            {
                name: "direccion",
                label: self.tr("Dirección"),
                caption: "direccion",
                type: "textField"
            },
            {
                name: "codigo",
                label: self.tr("Codigo"),
                caption: "codigo",
                type: "textField",
                mode: "integer"
            },
            {
                name: "latitud",
                label: self.tr("Latitud"),
                caption: "latitud",
                type: "textField"
            },
            {
                name: "longitud",
                label: self.tr("Longitud"),
                caption: "longitud",
                type: "textField"
            }];
        self.setFields(fields);
        var data = {};
        data[""] = "Seleccione";
        qxnw.utils.populateSelectFromArray(self.ui.ciudad, data);
        qxnw.utils.populateSelectFromArray(self.ui.empresa, data);
        qxnw.utils.populateSelectFromArray(self.ui.pais, data);

        qxnw.utils.populateSelect(self.ui.empresa, "nw_permissions", "getEmpresas");
        qxnw.utils.populateSelect(self.ui.pais, "nw_configuraciones", "getAllPaises", 0);
        
        self.ui.pais.addListener("changeSelection", function (e) {
            var sl = self.getRecord();
            self.ui.ciudad.removeAll();
             qxnw.utils.populateSelect(self.ui.ciudad, "nw_configuraciones", "getAllCiudades", sl);
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_terminales", true);
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
