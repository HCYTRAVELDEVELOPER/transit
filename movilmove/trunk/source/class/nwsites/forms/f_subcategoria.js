qx.Class.define("nwsites.forms.f_subcategoria", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Subcategorias");
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
                type: "textField",
                visible: true,
                required: true
            },
            {
                name: "categoria",
                label: "Categoria",
                caption: "categoria",
                type: "selectBox",
                required: true
            },
            {
                name: "empresa_cliente",
                label: "Empresa Cliente",
                caption: "empresa_cliente",
                type: "selectBox",
                required: true
            },
            {
                name: "fecha",
                label: "Fecha",
                caption: "fecha",
                type: "dateTimeField"
            }

        ];
        self.setFields(fields);
        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
        var data = {};
        data[""] = "Ninguno";
        data = {};
        data.table = "pv_empresas_clientes";
        qxnw.utils.populateSelect(self.ui.empresa_cliente, "master", "populate", data);
        data = {};
        data.table = "pv_categorias";
        qxnw.utils.populateSelect(self.ui.categoria, "master", "populate", data);

    },
    destruct: function() {
    },
    members: {
        pr: null,
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function(r) {
                self.accept();
            }
            rpc.exec("saveBubcategoria", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            return true;
        }
    }
});
