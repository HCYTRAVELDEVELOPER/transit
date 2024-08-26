qx.Class.define("nwsites.forms.f_opciones_productos", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Opciones Productos ");
        var fields = [
            {
                name: "id",
                label: "ID",
                type: "textField",
                visible: false
            },
            {
                name: "nombre",
                label: "Nombre",
                type: "textField",
                required: true
            },
            {
                name: "requerido",
                label: "Requerido",
                type: "selectBox",
                required: true
            },
            {
                name: "multiseleccion",
                label: "Multiselección",
                type: "selectBox",
                required: true
            },
            {
                name: "descripcion",
                label: "Descripción",
                type: "textArea"
            }
        ];
        self.setFields(fields);
//        var data = {};
//        data["table"] = "pv_productos_opciones";
//        qxnw.utils.populateSelect(self.ui.opcion, "master", "populate", data);
        var data = {};
        data["NO"] = "NO";
        data["SI"] = "SI";
        qxnw.utils.populateSelectFromArray(self.ui.requerido, data);
        qxnw.utils.populateSelectFromArray(self.ui.multiseleccion, data);
        self.setGroupHeader("Agregar Acciones");
        self.ui.accept.addListener("execute", function() {
            if (!self.validate()) {
                return;
            }
            if (qxnw.utils.evalue(self.tipo)) {
                if (self.tipo == "Vista") {
                    self.slotSave();
                }
            } else {
                self.accept();

            }
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
    },
    destruct: function() {
    },
    members: {
        pr: null,
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.tipo = pr.tipo;
            self.id_cliente = pr.id_cliente;
            return true;
        },
        setParamRecordEditar: function setParamRecordEditar(pr) {
            var self = this;
            self.setRecord(pr);
            return true;
        }
//        slotSave: function slotSave(pr) {
//            var self = this;
//            var data = self.getRecord();
//            data.id_cliente = self.id_cliente;
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
//            rpc.setAsync(true);
//            var func = function (r) {
//                self.accept();
//
//            };
//            rpc.exec("saveOpciones", data, func);
//            return true;
//        }
    }
});
