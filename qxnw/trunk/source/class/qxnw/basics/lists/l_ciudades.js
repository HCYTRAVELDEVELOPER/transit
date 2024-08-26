qx.Class.define("qxnw.basics.lists.l_ciudades", {
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
                label: "Departamento ID",
                caption: "departamento"
            },
            {
                label: "Departamento",
                caption: "nom_departamento"
            },
            {
                label: "País ID",
                caption: "pais"
            },
            {
                label: "País",
                caption: "nom_pais"
            }, {
                label: "Usuario",
                caption: "usuario"
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
                name: "pais",
                caption: "pais",
                label: "País",
                type: "selectBox"
            },
            {
                name: "departamento",
                caption: "departamento",
                label: "Departamento",
                type: "selectBox"
            }];
        self.createFilters(filters);

        self.hideColumn("id");
        self.hideColumn("ciudad");
        self.hideColumn("departamento");
        self.hideColumn("pais");

        var data = {};
        data["TODOS"] = "Todos";
        qxnw.utils.populateSelectFromArray(self.ui.departamento, data);
        qxnw.utils.populateSelectFromArray(self.ui.pais, data);
        qxnw.utils.populateSelect(self.ui.departamento, "nw_configuraciones", "getAllDepartamentos", 0);
        qxnw.utils.populateSelect(self.ui.pais, "nw_configuraciones", "getAllPaises", 0);

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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_ciudades", true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.basics.forms.f_ciudades();
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
            var d = new qxnw.basics.forms.f_ciudades();
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_ciudades", true);
            var func = function () {
                self.removeSelectedRow();
            };
            rpc.exec("eliminar", r, func);
        }
    }
});
