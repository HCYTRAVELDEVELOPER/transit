qx.Class.define("qxnw.basics.forms.f_pqr", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        this.setTitle("Petición o Sugerencia");
        self.setColumnsFormNumber(0);
        var fields = [
            {
                name: "tipo_solicitud",
                label: self.tr("Tipo de solicitud"),
                type: "selectBox",
                required: true
            },
            {
                name: "nombre",
                label: self.tr("Nombres"),
                type: "textField",
                required: true
            },
            {
                name: "correo",
                label: self.tr("Correo electronico"),
                type: "textField",
                required: true
            },
            {
                name: "asunto",
                label: self.tr("Asunto de la PQR"),
                type: "textField",
                visible: false
            },
            {
                name: "mensaje",
                label: self.tr("Mensaje"),
                type: "textArea",
                required: true
            }
        ];
        this.setFields(fields);
        var data = {};
        data[""] = "Seleccione";
        data["peticion"] = "Petición";
        data["queja"] = "Queja";
        data["recurso"] = "Sugerencia";
////        data["Venta"] = self.tr("Venta");
        qxnw.utils.populateSelectFromArray(self.ui.tipo_solicitud, data);
        self.ui.asunto.setValue("Sugerencia de mejora");
        this.ui.accept.addListener("click", function () {
            self.save();
        });
        self.ui.cancel.addListener("click", function () {
            self.reject();
        });
    },
    destruct: function () {
    }
    ,
    members: {
        save: function save() {
            var self = this;
            var url = window.location;
            var data = self.getRecord();

            data.url = url.origin;
            if (!self.validate()) {
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones", true);
            var func = function (r) {
                self.accept();
                qxnw.utils.information(self.tr("Se ha enviado la información"));
                return;
            };
            rpc.exec("enviopqrService", data, func);
        }
    }
});
