qx.Class.define("qxnw.basics.lists.l_menu", {
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
                caption: "nombre"
            },
            {
                label: "Grupo",
                caption: "grupo"
            },
            {
                label: "Grupo",
                caption: "nom_grupo"
            },
            {
                label: "Orden",
                caption: "orden"
            },
            {
                label: "Nivel",
                caption: "nivel"
            },
            {
                label: "Callback",
                caption: "callback"
            },
            {
                label: "Pariente",
                caption: "nom_pariente"
            },
            {
                label: "Componente",
                caption: "nom_modulo"
            },
            {
                label: "Módulo",
                caption: "modulo"
            },
            {
                label: "Pariente",
                caption: "pariente"
            },
            {
                label: "Ícono",
                caption: "icono"
            },
            {
                label: "Ícono",
                caption: "img_icono",
                type: "image"
            }
        ];
        this.setColumns(columns);
        var filters = [
            {
                name: "empresa",
                caption: "empresa",
                label: self.tr("Empresa"),
                type: "selectBox"
            },
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            },
            {
                name: "grupo",
                caption: "grupo",
                label: "Módulo",
                type: "selectBox"
            },
            {
                name: "nivel",
                caption: "nivel",
                label: "Nivel",
                type: "selectBox"
            }
        ];
        self.createFilters(filters);

        self.hideColumn("id");
        self.hideColumn("grupo");
        self.hideColumn("pariente");
        self.hideColumn("modulo");
        self.hideColumn("icono");

        var data = {};
        data["TODOS"] = "Todos";
        qxnw.utils.populateSelectFromArray(self.ui.nivel, data);
        qxnw.utils.populateSelectFromArray(self.ui.grupo, data);

        data = {};
        data["General"] = "General";
        qxnw.utils.populateSelectFromArray(self.ui.grupo, data);

        qxnw.utils.populateSelectAsync(self.ui.grupo, "master", "populate", {table: "nw_modulos_grupos"});

        qxnw.utils.populateSelect(self.ui.empresa, "nw_permissions", "getEmpresas");

        data = {};
        data["1"] = "1";
        data["2"] = "2";
        data["3"] = "3";
        data["4"] = "4";
        qxnw.utils.populateSelectFromArray(self.ui.nivel, data);

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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_menu", true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.basics.forms.f_menu();
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
            r.empresa = self.ui.empresa.getValue().empresa;
            var d = new qxnw.basics.forms.f_menu();
            d.ui.empresa.setValue(self.ui.empresa.getValue().empresa);
            qxnw.utils.populateSelect(d.ui.grupo, "nw_permisos", "getGrupos", self.ui.empresa.getValue());
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
            if (typeof r == 'undefined') {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_menu", true);
            var func = function () {
                self.removeSelectedRow();
            };
            rpc.exec("eliminar", r, func);
        }
    }
});
