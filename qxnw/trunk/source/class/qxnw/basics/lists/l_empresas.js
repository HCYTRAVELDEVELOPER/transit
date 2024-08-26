qx.Class.define("qxnw.basics.lists.l_empresas", {
    extend: qxnw.lists,
    construct: function() {
        var self = this;
        self.base(arguments);
        self.setButtonsAutomatic(true);
        self.createBase();
        var columns = [
            {
                label: "id",
                caption: "id"
            },
            {
                label: self.tr("Razón social"),
                caption: "razon_social"
            },
            {
                label: self.tr("Nombre"),
                caption: "nombre"
            },
            {
                label: self.tr("Nit"),
                caption: "nit"
            },
            {
                label: self.tr("División"),
                caption: "division"
            },
            {
                label: self.tr("Ciudad"),
                caption: "ciudad"
            },
            {
                label: self.tr("País"),
                caption: "pais"
            },
            {
                label: self.tr("Dirección"),
                caption: "direccion"
            },
            {
                label: self.tr("Teléfono"),
                caption: "telefono"
            },
            {
                label: self.tr("E-mail"),
                caption: "email"
            },
            {
                label: self.tr("País"),
                caption: "nom_pais"
            },
            {
                label: self.tr("Ciudad"),
                caption: "nom_ciudad"
            },
            {
                label: self.tr("Slogan"),
                caption: "slogan"
            },
            {
                label: self.tr("Logo"),
                caption: "logo",
                type: "image",
                mode: "phpthumb"
            }
        ];
        self.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            }];
        self.createFilters(filters);
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_empresas", true);
            var func = function(r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.basics.forms.f_empresas();
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.basics.forms.f_empresas();
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
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_empresas", true);
            var func = function() {
                self.removeSelectedRow();
            };
            rpc.exec("eliminar", r, func);
        }
    }
});