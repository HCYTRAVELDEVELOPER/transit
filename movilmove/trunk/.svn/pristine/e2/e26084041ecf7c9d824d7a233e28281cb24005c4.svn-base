qx.Class.define("nwsites.forms.f_asociados", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Asociar Productos");
        var fields = [
            {
                name: "id_producto",
                label: self.tr("ID"),
                caption: "id_producto",
                type: "textField",
                visible: false
            },
            {
                name: "id",
                label: self.tr("ID"),
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "categoria",
                label: self.tr("Categoría"),
                caption: "categoria",
                type: "selectBox",
                visible: true,
                required: true
            },
            {
                name: "producto",
                label: self.tr("Producto"),
                caption: "producto",
                type: "selectBox",
                visible: true,
                required: true
            },
            {
                name: "valor",
                label: self.tr("Valor"),
                type: "textField",
                mode: "money",
                required: true
            },
            {
                name: "color",
                label: self.tr("Color"),
                caption: "color",
                type: "colorButton",
                visible: true,
                required: true
            },
            {
                name: "orden",
                label: self.tr("Orden"),
                type: "textField",
                visible: true,
                required: true
            },
            {
                name: "opcion",
                label: self.tr("Opción"),
                caption: "opcion",
                type: "selectBox",
                visible: true
            },
            {
                name: "descripcion",
                label: self.tr("Descripción"),
                type: "textArea"
            }
        ];
        self.setFields(fields);
        var data = {};
        data[""] = self.tr("Todas");
        qxnw.utils.populateSelectFromArray(self.ui.categoria, data);
        qxnw.utils.populateSelectFromArray(self.ui.producto, data);
        data = {};
        data.table = "pv_categorias";
        qxnw.utils.populateSelect(self.ui.categoria, "master", "populate", data);
        self.ui.categoria.addListener("changeSelection", function() {
            var r = this.getValue();
            self.ui.producto.removeAll();
            var data = {};
            data[""] = self.tr("Elija producto");
            qxnw.utils.populateSelectFromArray(self.ui.producto, data);
//            qxnw.utils.populateSelectAsync(self.ui.producto, "pv_nwsites", "populateByProductos", r.categoria);
            qxnw.utils.populateSelect(self.ui.producto, "pv_nwsites", "populateByProductos", r.categoria);
        });
        self.ui.producto.addListener("changeSelection", function() {
            if (qxnw.utils.evalue(this.getValue()["producto"])) {
                self.ui.valor.setValue("0");
                var data = self.getRecord();
                if (qxnw.utils.evalue(data.producto_model.valor)) {
                    self.ui.valor.setValue(data.producto_model.valor);
                } else {
                    self.ui.valor.setValue("0");
                }
            }
            return;
        });
        self.setGroupHeader("Agregar Acciones");
        self.ui.accept.addListener("execute", function() {
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
        setParamRecordEditar: function setParamRecordEditar(pr) {
            var self = this;
            self.setRecord(pr);
            return true;
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.tipo = pr.tipo;
            self.id_cliente = pr.id_cliente;
            return true;
        },
        slotSave: function slotSave(pr) {
            var self = this;
            var data = self.getRecord();
            data.id_cliente = self.id_cliente;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function(r) {
                self.accept();

            };
            rpc.exec("saveAsociado", data, func);
            return true;
        }
    }
});
