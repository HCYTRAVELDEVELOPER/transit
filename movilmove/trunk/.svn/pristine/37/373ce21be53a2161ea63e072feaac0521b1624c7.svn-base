qx.Class.define("nwsites.lists.l_domicilios_clientes", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        self.setSelectMultiCell(true);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "N° Pedido",
                caption: "id"
            },
            {
                label: "Fecha Salida",
                caption: "fecha_salida"
            },
            {
                label: "Cliente ID",
                caption: "cliente"
            },
            {
                label: "Cliente",
                caption: "cliente_text"
            },
            {
                label: "Mail",
                caption: "email"
            },
            {
                label: "Dirección",
                caption: "direccion"
            },
            {
                label: "Telefono",
                caption: "telefono"
            },
            {
                label: "Sub Total",
                caption: "sub_total",
                type: "money"
            },
            {
                label: "Valor Domicilio",
                caption: "costo_domicilio",
                type: "money"
            },
            {
                label: "Valor Total",
                caption: "valor_total",
                type: "money"
            },
            {
                label: "Cantidad Total",
                caption: "cantidad_total"
            },
            {
                label: "Medio ID",
                caption: "medio"
            },
            {
                label: "Medio",
                caption: "nom_medio"
            },
            {
                label: "Barrio",
                caption: "barrio"
            },
            {
                label: "Observaciones",
                caption: "observaciones"
            },
            {
                label: "Estado ID",
                caption: "estado"
            },
            {
                label: "Estado",
                caption: "nom_estado"
            },
            {
                label: "Operador",
                caption: "usuario"
            },
            {
                label: "Operador ID",
                caption: "nom_usuario"
            }
        ];
        this.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            },
            {
                name: "modo_estado",
                label: "Seleccionar modo",
                type: "selectBox"
            },
            {
                name: "estado",
                caption: "estado",
                label: "Estado",
                type: "selectBox"
            },
            {
                name: "terminal",
                caption: "terminal",
                label: "Tienda",
                type: "selectBox",
                enabled: false
                
            },
            {
                name: "cliente",
                caption: "Cliente",
                label: "Cliente",
                type: "selectTokenField"
            },
            {
                name: "fecha_inicial",
                caption: "fecha_inicial",
                label: "Fecha Inicial",
                type: "dateField",
                required: true
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: "Fecha Final",
                type: "dateField",
                required: true
            }
        ];
        self.createFilters(filters);
        var data = {};
        data[""] = "Todas";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);
        qxnw.utils.populateSelectFromArray(self.ui.terminal, data);
        data = {};
        data.table = "terminales";
        qxnw.utils.populateSelect(self.ui.terminal, "master", "populate", data);

        data.table = "pv_estados_salidas";
        qxnw.utils.populateSelect(self.ui.estado, "master", "populate", data);

        data = {
            "": "Mostrar todo",
            "excluir": "Excluir",
            "incluir": "Incluir"
        };
        qxnw.utils.populateSelectFromArray(self.ui.modo_estado, data);
        self.ui.cliente.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.cliente.setModelData(r);
            };
            rpc.exec("populateTokenClientes", data, func);
        }, this);
        self.ui.modo_estado.setValue("incluir");
        self.ui.estado.setValue(2);
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("click", function () {
            self.slotEliminar();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("click", function () {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
        self.applyFilters();
        self.execSettings();
        self.ui.terminal.setEnabled(true);
        self.hideColumn("cliente");
        self.hideColumn("estado");
        self.hideColumn("medio");
        self.hideColumn("zona");
        self.hideColumn("fecha_salida");
        self.table.setRowHeight(35);
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var sl = self.selectedRecord();
            m.addAction("Visualizar Domicilio", "icon/16/actions/document-properties.png", function (e) {
                self.slotEditar();
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            data.tipo = self.tipo;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "salidas");
            rpc.setAsync(true);
            var func = function (r) {
                var total = r.recordCount;
                if (total > 0) {
                    qxnw.utils.makeSound();
                }
                self.setModelData(r);
            };
            rpc.exec("consultaDomiciliosClientes", data, func);
        },
        slotNuevo: function slotNuevo()
        {
            var self = this;
            qxnw.utils.loading("Un momento por favor, cargando elementos de tiquet...");
            var interval = setInterval(function () {
                var d = new pos.forms.f_salidas();
                d.settings.accept = function () {
                    self.applyFilters();
                };
                d.setWidth(1300);
                d.setHeight(800);
                d.setModal(true);
                d.show();
                clearInterval(interval);
                qxnw.utils.stopPopup();
            }, 100);
        },
        slotEditar: function slotEditar()
        {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined)
            {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new nwsites.forms.f_domicilios_clientes();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function () {
                self.applyFilters();
            }
            d.show();
        },
        setParamOrdenPedido: function setParamOrdenPedido(pr)
        {
            var self = this;
            self.tipo = pr.tipo;
            var up = qxnw.userPolicies.getUserData();
            if (up.profile != "1" && up.profile != "7" && up.profile != "6") {
                self.ui.terminal.removeAll();
                var data = {};
                data[up.terminal] = up.nom_terminal;
                qxnw.utils.populateSelectFromArray(self.ui.terminal, data);
                self.ui.terminal.setEnabled(false);
                if (qxnw.utils.evalue(up.parameters[0].bodega)) {
                    self.ui.bodega.removeAll();
                    data = {};
                    data[up.parameters[0].bodega] = up.parameters[1].nom_bodega;
                    qxnw.utils.populateSelectFromArray(self.ui.bodega, data);
                    self.ui.bodega.setEnabled(false);
                }
                self.setFieldVisibility(self.ui.ciudad, "excluded");
            }
        },
        slotEliminar: function slotEliminar()
        {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "terminales");
            rpc.exec("eliminar", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        }
    }
});
