qx.Class.define("qxnw.basics.lists.l_paises", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();

        var columns = [
            { label: self.tr("ID"),          caption: "id"},
            { label: self.tr("Nombre"),      caption: "nombre"},
            { label: self.tr("Abreviatura"), caption: "alias"},
            { label: self.tr("Empresa"),     caption: "empresa"},
            { label: self.tr("Usuario"),     caption: "usuario"}
        ];
        self.setColumns(columns);
        self.hideColumn("id");

        var filters = [
            {name: "buscar", label: self.tr("Filtro..."), type: "textField"},
            {name: "nombre", label: self.tr("Nombre"), type: "textField"}
        ];
        self.createFilters(filters);

/*         var data = {};
        data["TODOS"] = "Todos";
        qxnw.utils.populateSelectFromArray(self.ui.departamento, data);
        qxnw.utils.populateSelectFromArray(self.ui.empresa, data);
        qxnw.utils.populateSelectFromArray(self.ui.usuario, data);
        qxnw.utils.populateSelect(self.ui.departamento, "nw_configuraciones", "getAllDepartamentos", 0);
        qxnw.utils.populateSelect(self.ui.empresa, "nw_permissions", "getEmpresas");
        qxnw.utils.populateSelect(self.ui.usuario, "nw_configuraciones", "getAllPaises", 0); */

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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_paises", true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consultar", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.basics.forms.f_paises();
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
            var d = new qxnw.basics.forms.f_paises();
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_paises", true);
            var func = function () {
                self.removeSelectedRow();
            };
            rpc.exec("eliminar", r, func);
        }
    }
});
