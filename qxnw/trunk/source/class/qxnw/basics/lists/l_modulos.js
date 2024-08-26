qx.Class.define("qxnw.basics.lists.l_modulos", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        self.buttonsAutomatic = true;
        self.createBase();
        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Parte",
                caption: "parte"
            },
            {
                label: "Icono",
                caption: "icono"
            },
            {
                label: "Grupo ID",
                caption: "pariente"
            },
            {
                label: "Grupo",
                caption: "nom_pariente"
            },
            {
                label: "Orden",
                caption: "orden"
            },
            {
                label: "Mostrar en el Home",
                caption: "mostrar_en_el_home"
            },
            {
                label: "Empresa ID",
                caption: "empresa"
            },
            {
                label: "Empresa",
                caption: "nom_empresa"
            }];
        self.setColumns(columns);
        self.hideColumn("empresa");
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            },
            {
                name: "empresa",
                caption: "empresa",
                label: self.tr("Empresa"),
                type: "selectBox"
            }];
        self.createFilters(filters);
        qxnw.utils.populateSelect(self.ui.empresa, "nw_permissions", "getEmpresas");
        self.hideColumn("empresa");
        self.hideColumn("id");
        self.hideColumn("pariente");
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
//        self.execSettings();
        self.setAllPermissions(true);
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
                qxnw.utils.question("¿Está seguro de eliminar el registro?", function (e) {
                    if (e) {
                        self.slotEliminar();
                    }
                });
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_modulos", true);
            rpc.setAsync(true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.basics.forms.f_modulos();
            d.ui.empresa.setValue(self.ui.empresa.getValue().empresa);
            qxnw.utils.populateSelect(d.ui.pariente, "nw_permisos", "getGrupos", self.ui.empresa.getValue());
            d.settings.accept = function () {
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
            var d = new qxnw.basics.forms.f_modulos();
            d.ui.empresa.setValue(self.ui.empresa.getValue().empresa);
            qxnw.utils.populateSelect(d.ui.pariente, "nw_permisos", "getGrupos", self.ui.empresa.getValue());
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function () {
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_modulos", true);
            var func = function () {
                self.removeSelectedRow();
                self.applyFilters();
            };
            rpc.exec("eliminar", r);
        }
    }
});
