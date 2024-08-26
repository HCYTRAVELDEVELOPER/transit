qx.Class.define("transmovapp.forms.f_codigos", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader(self.tr("Editar usuarios"));
        var fields = [
            {
                name: "id",
                label: self.tr("ID"),
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: " ",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "codigo",
                label: self.tr("Codigo Promoción"),
                type: "textField",
                visible: false
            },
            {
                name: "num_codigos",
                label: self.tr("Cantidad de Códigos"),
                type: "textField",
                required: true,
                mode: "integer"
            },
            {
                name: "tipo_empresa",
                label: self.tr("Tipo Empresa"),
                caption: "tipo_empresa",
                type: "selectBox",
                required: true
            },
            {
                name: "empresa",
                label: self.tr("Empresa"),
                caption: "empresa",
                type: "selectBox",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: " ",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "tipo_valor",
                label: self.tr("Tipo Valor"),
                type: "selectBox",
                required: true
            },
            {
                name: "valor",
                label: self.tr("Porcentaje o Valor"),
                type: "textField",
                required: true,
                mode: "integer"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: " ",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "caracteristicas",
                label: self.tr("Características"),
                type: "textArea",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        this.setFields(fields);
        this.setTitle(self.tr("Códigos Promocionales"));

        var data = {};
        data[""] = self.tr("Seleccione");
        data["Porcentaje"] = self.tr("Porcentaje");
        data["Valor"] = self.tr("Valor");
        qxnw.utils.populateSelectFromArray(self.ui.tipo_valor, data);

        var data = {};
        data[""] = self.tr("Seleccione");
        qxnw.utils.populateSelectFromArray(self.ui.tipo_empresa, data);
        data.table = "trans_tipo_empresas";
        qxnw.utils.populateSelect(self.ui.tipo_empresa, "master", "populate", data);

        self.ui.tipo_empresa.addListener("changeSelection", function () {
            var tipo_empresa = self.ui.tipo_empresa.getValue();
            self.ui.empresa.removeAll();
            if (tipo_empresa["tipo_empresa"] != "" && tipo_empresa["tipo_empresa"] != null) {
                var data = {};
                data[""] = self.tr("Seleccione");
                qxnw.utils.populateSelectFromArray(self.ui.empresa, data);
                qxnw.utils.populateSelect(self.ui.empresa, "empresas", "populateEmpresas", tipo_empresa["tipo_empresa"]);
            } else {
                var data = {};
                data[""] = self.tr("Seleccione");
                qxnw.utils.populateSelectFromArray(self.ui.empresa, data);
            }
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
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();
            var rpc = new qxnw.rpc(this.rpcUrl, "codigos");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept(r);
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            return true;
        }
    }
});
