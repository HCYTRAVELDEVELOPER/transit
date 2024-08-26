qx.Class.define("qxnw.basics.lists.l_componentes", {
    extend: qxnw.lists,
    construct: function () {
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
                label: "Nombre",
                caption: self.tr("nombre")
            },
            {
                label: " Clase",
                caption: self.tr("clase")
            },
            {
                label: "Modulo ID",
                caption: self.tr("grupo")
            },
            {
                label: "Módulo",
                caption: self.tr("nom_grupo")
            },
            {
                label: "Empresa ID",
                caption: self.tr("empresa")
            },
            {
                label: "Empresa",
                caption: self.tr("nom_empresa")
            },
            {
                label: "Iconos Home",
                caption: self.tr("icono")
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
                name: "modulo",
                caption: "modulo",
                label: "Modulo",
                type: "selectBox"
            },
            {
                name: "empresa",
                caption: "empresa",
                label: "Empresa",
                type: "selectBox"
            }];
        self.createFilters(filters);

        self.hideColumn("id");
        self.hideColumn("empresa");
        self.hideColumn("grupo");
        var data = {};
        data[""] = "Todos";
        qxnw.utils.populateSelectFromArray(self.ui.modulo, data);
        qxnw.utils.populateSelect(self.ui.empresa, "nw_permissions", "getEmpresas");
        qxnw.utils.populateSelectAsync(self.ui.modulo, "master", "populate", {table: "nw_modulos_grupos"});

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
        //self.execSettings();
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_componentes", true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.basics.forms.f_componentes();
            d.ui.empresa.setValue(self.ui.empresa.getValue().empresa);
            qxnw.utils.populateSelect(d.ui.grupo, "nw_permisos", "getGrupos", self.ui.empresa.getValue());
            d.settings.accept = function () {
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
            var d = new qxnw.basics.forms.f_componentes();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            qxnw.utils.populateSelect(d.ui.grupo, "nw_permisos", "getGrupos", self.ui.empresa.getValue(), {}, r.grupo);
            d.settings.accept = function () {
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_componentes", true);
            var func = function () {
                self.removeSelectedRow();
            };
            rpc.exec("eliminar", r, func);
        }
    }
});
