qx.Class.define("qxnw.alerts.l_alerts", {
    extend: qxnw.lists,
    construct: function() {
        var self = this;
        this.base(arguments);
        self.setCaption(self.tr("Administración de alarmas"));
        self.setButtonsAutomatic(true);
        self.createBase();
        var columns = [
            {
                label: "id",
                caption: "id"
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Texto",
                caption: "texto"
            },
            {
                label: "Tiempo alerta",
                caption: "tiempo_alerta"
            },
            {
                label: "Estado",
                caption: "estado"
            }
        ];
        self.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                label: "Filtro...",
                type: "textField"
            },
            {
                name: "estado",
                label: "Estado",
                type: "selectBox"
            }
        ];
        self.createFilters(filters);
        var data = {};
        data["VIGENTE"] = "Vigentes";
        data["DESCARTADA"] = "Descartadas";
        data["TODAS"] = "Todas";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);
        self.ui.newButton.addListener("execute", function() {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("execute", function() {
            self.slotEliminar();
        });
        self.ui.editButton.addListener("execute", function() {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("execute", function() {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("execute", function() {
            self.selectAll();
        });
        self.ui.updateButton.addListener("execute", function() {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function() {
            self.applyFilters();
        });
        self.hideColumn("id");
        self.applyFilters();
    },
    destruct: function() {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var sl = self.selectedRecord();
            if (sl == 'undefined') {
                return;
            }
            if (sl.estado == "VIGENTE") {
                m.addAction("Editar", "icon/16/actions/document-properties.png", function(e) {
                    self.slotEditar();
                });
                m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function(e) {
                    qxnw.utils.question("¿Está seguro de eliminar el registro?", function(e) {
                        if (e) {
                            self.slotEliminar();
                        } else {
                            return;
                        }
                    });
                });
            }
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function(r) {
                self.setModelData(r);
            };
            rpc.exec("getAlerts", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.alerts.f_alerts();
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (typeof r == 'undefined') {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.alerts.f_alerts();
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (typeof r == 'undefined') {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function(r) {
                self.removeSelectedRow();
            };
            r["table"] = "nw_alerts";
            rpc.exec("eliminar", r, func);
        }
    }
});