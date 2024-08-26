qx.Class.define("maestros.lists.l_tarifas_fijas", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: self.tr("Id"),
                caption: "id"
            },
            {
                label: self.tr("Ciudad o lugar origen"),
                caption: "ciudad_o_lugar_origen"
            },
            {
                label: self.tr("Valor"),
                caption: "valor"
            },
            {
                label: self.tr("Ciudad o lugar destino"),
                caption: "ciudad_o_lugar_destino"
            },
            {
                label: self.tr("Servicio id"),
                caption: "servicio_id"
            },
            {
                label: self.tr("Servicio text"),
                caption: "servicio_id_text"
            },
            {
                label: self.tr("Type"),
                caption: "type"
            },
            {
                label: self.tr("Nombre"),
                caption: "nombre"
            },
            {
                label: self.tr("Valor recargo"),
                caption: self.tr("valor_recargo")
            },
            {
                label: self.tr("Concepto recargo"),
                caption: "concepto_recargo"
            },
            {
                label: self.tr("Valor metros add"),
                caption: "valor_metros_add"
            },
            {
                label: self.tr("Inicia metros add"),
                caption: "inicia_metros_add"
            },
            {
                label: self.tr("Valor peajes"),
                caption: "valor_peajes"
            },
            {
                label: self.tr("Metros cobro peaje"),
                caption: "metros_cobro_peaje"
            },
            {
                label: self.tr("Metros cobro recargo"),
                caption: "metros_cobro_recargo"
            },
            {
                label: self.tr("Valor pasajero adicional"),
                caption: "valor_pasajero_adicional"
            },
            {
                label: self.tr("Pasajero adicional rango inicia cobro"),
                caption: "pasajero_adicional_rango_inicia_cobro"
            }
        ];
        self.setColumns(columns);
//        self.hideColumn("id");
//        self.hideColumn("servicio_id");

        var filters = [
            {
                name: "buscar",
                label: self.tr("Buscar..."),
                caption: "buscar",
                type: "textField"
            }
//             {
//                name: "fecha_inicial",
//                label: "Fecha inicial",
//                type: "dateField"
//            },
//            {
//                name: "fecha_final",
//                label:"Fecha final",
//                type: "dateField"
//            }
        ];
        self.createFilters(filters);
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
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
    },
    destruct: function () {
    },
    members: {

        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                self.slotEditar();
            });
            m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function (e) {
                qxnw.utils.question(self.tr("¿Está seguro de eliminar el registro?"), function (e) {
                    if (e) {
                        self.slotEliminar();
                    } else {
                        return;
                    }
                });
            });
            m.exec(pos);
        },

        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new maestros.forms.f_tarifas_fijas();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
//             d.setModal(true);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros");
            rpc.setAsync(true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consultaTarifasFijas", data, func);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var d = new maestros.forms.f_tarifas_fijas();
            d.setParamRecord(r);
            d.populateNavTable(r);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "configuracion_maestros");
            rpc.exec("EliminarTarifaFija", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        }
    }
});
