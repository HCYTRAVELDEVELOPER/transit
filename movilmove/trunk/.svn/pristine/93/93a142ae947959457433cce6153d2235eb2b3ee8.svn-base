qx.Class.define("nwsites.forms.f_salidas", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setTitle(self.tr("Detalle Salida"));
        this.setColumnsFormNumber(0);
        this.createBase();
        var data = {};
        var fields = [
            {
                name: "DATOS DEL CLIENTE",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "cliente",
                label: "Cliente",
                caption: "cliente",
                type: "selectTokenField",
                required: true
            },
            {
                name: "telefono",
                label: "Telefono",
                caption: "telefono",
                type: "textField"
            },
            {
                name: "cedula",
                label: "Cedula",
                caption: "cedula",
                type: "textField",
                mode: "numeric",
                enabled: false,
                visible: false
            },
            {
                name: "direccion",
                label: "Direccion",
                caption: "direccion",
                type: "textField"
                
            },
            {
                name: "barrio",
                label: "Barrio",
                caption: "barrio",
                type: "textField",
                visible: true
            },
            {
                name: "email",
                label: "Mail",
                caption: "email",
                type: "textField",
                mode: "mail"
            },
            {
                name: "zona",
                label: "Zona",
                caption: "zona",
                type: "selectBox",
                visible: false
            },
            {
                name: "cantidad_total",
                label: "Cantidad Total",
                caption: "cantidad_total",
                type: "textField",
                required: true
            },
            {
                name: "valor_total",
                label: "Valor Total",
                caption: "valor_total",
                type: "textField",
                mode: "money",
                required: true,
                enabled: false
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Productos",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "categoria",
                label: "Categoria",
                caption: "categoria",
                type: "selectBox"
            },
            {
                name: "medio",
                label: "Medio",
                caption: "medio",
                type: "selectBox"
            },
            {
                name: "observaciones",
                label: "Observaciones",
                caption: "observaciones",
                type: "textArea"
            },
            {
                name: "",
                type: "endGroup"
            }];
        self.setFields(fields);

        self.ui.cliente.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.cliente.setModelData(r);
            };
            rpc.exec("populateTokenClientes", data, func);
        }, this);
        self.ui.cliente.addListener("addItem", function (e) {
            var data = {};
            data = e.getData();
            if (qxnw.utils.evalue(data.zona)) {
                self.ui.zona.setValue(data.zona);
            }
            if (qxnw.utils.evalue(data.telefono)) {
                self.ui.telefono.setValue(data.telefono);
            }
            if (qxnw.utils.evalue(data.cedula)) {
                self.ui.cedula.setValue(data.cedula.toString());
            }
            if (qxnw.utils.evalue(data.direccion)) {
                self.ui.direccion.setValue(data.direccion.toString());
            }
            if (qxnw.utils.evalue(data.barrio)) {
                self.ui.barrio.setValue(data.barrio.toString());
            }
        }, this);
        data.table = "pv_categorias";
        qxnw.utils.populateSelect(self.ui.categoria, "master", "populate", data);
        data.table = "pv_medios";
        qxnw.utils.populateSelect(self.ui.medio, "master", "populate", data);
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.setEnabledAll(false);
//        self.ui.accept.addListener("execute", function () {
//            self.slotSaveOrdenPedido();
//        });
    },
    destruct: function () {
        this._disposeObjects("deleteButton");
    },
    members: {
        pr: null,
        deleteButton: null,
        r: null,
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(self.navTable);
            m.addAction("Imprimir Inventario Total", "icon/16/actions/document-print-preview.png", function (e) {
                self.slotImprimir();
            });
            m.exec(pos);
        },
        crearForm: function crearForm() {
            var self = this;
            var f = new qxnw.forms();
            f.createFromTableGenerateSeq("pv_clientes");
            f.settings.accept = function (r) {
                var data = f.getRecord();
                if (qxnw.utils.evalue(data.direccion)) {
                    self.ui.direccion.setValue(data.direccion);
                }
                if (qxnw.utils.evalue(data.telefono)) {
                    self.ui.telefono.setValue(data.telefono.toString());
                }
                if (qxnw.utils.evalue(data.cedula)) {
                    self.ui.cedula.setValue(data.cedula.toString());
                }
                if (qxnw.utils.evalue(data.zona)) {
                    self.ui.zona.setValue(data.zona);
                }
                if (qxnw.utils.evalue(data.nombre)) {
                    var ciudad = {
                        id: r,
                        nombre: data.nombre
                    };
                    self.ui.cliente.addToken(ciudad);
                }
            };
            f.setModal(true);
            f.show();
            return true;
        },
        editForm: function editForm(model) {
            var self = this;
            var f = new qxnw.forms();
            f.createFromTableGenerateSeq("pv_clientes");
            f.setRecord(model);
            f.settings.accept = function (r) {
                var data = f.getRecord();
                if (qxnw.utils.evalue(data.direccion)) {
                    self.ui.direccion.setValue(data.direccion);
                }
                if (qxnw.utils.evalue(data.telefono)) {
                    self.ui.telefono.setValue(data.telefono.toString());
                }
                if (qxnw.utils.evalue(data.cedula)) {
                    self.ui.cedula.setValue(data.cedula.toString());
                }
                if (qxnw.utils.evalue(data.zona)) {
                    self.ui.zona.setValue(data.zona);
                }
                if (qxnw.utils.evalue(data.nombre)) {
                    var ciudad = {
                        id: r,
                        nombre: data.nombre
                    };
                    self.ui.cliente.addToken(ciudad);
                }
            };
            f.setModal(true);
            f.show();
            return true;
        },
        slotSaveOrdenPedido: function slotSaveOrdenPedido() {
            var self = this;
            var data = this.getRecord();
            if (!self.validate()) {
                return;
            }
            data.detalle = self.navTable.getAllData();
            if (data.detalle.length > 0)
            {

                var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
                rpc.setAsync(true);
                var func = function (r) {
                    qxnw.utils.information("Se ha creado la orden de pedido N° " + r);
                    self.accept();
                };
                rpc.exec("saveSalidasNwsites", data, func);
            }
            else {
                qxnw.utils.information("No puede continuar si no tiene productos que ingresar");
                return;
            }
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.pr = pr;
            self.setRecord(pr);
            if (qxnw.utils.evalue(pr.cliente)) {
                var cliente = {
                    id: pr.cliente,
                    nombre: pr.cliente_text
                }
                self.ui.cliente.addToken(cliente);
            }
            return true;
        }
    }
});

