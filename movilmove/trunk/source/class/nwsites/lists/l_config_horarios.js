qx.Class.define("nwsites.lists.l_config_horarios", {
    extend: qxnw.lists,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Días",
                caption: "nombre"
            },
            {
                label: "Usuario",
                caption: "usuario"
            },
            {
                label: "Empresa",
                caption: "empresa"
            },
            {
                label: "Empresa ID",
                caption: "empresa_cliente"
            }
        ];
        this.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            }];
        this.createFilters(filters);
        self.ui.newButton.addListener("click", function() {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("click", function() {
            self.slotEliminar();
        });
        self.ui.editButton.addListener("click", function() {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("click", function() {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function() {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function() {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function() {
            self.applyFilters();
        });
        self.hideColumn("id");
        self.hideColumn("usuario");
        self.hideColumn("empresa");
        self.hideColumn("empresa_cliente");
        this.applyFilters();
    },
    destruct: function() {

    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
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
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(this.rpcUrl, "nwsites");
            var r = rpc.exec("consulta_config_horarios", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.setModelData(r);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new nwsites.forms.f_config_horarios();
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined)
            {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new nwsites.forms.f_config_horarios();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
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
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "nwsites");
            rpc.exec("eliminar_config_horarios", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        }
    }
});
