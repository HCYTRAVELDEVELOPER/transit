qx.Class.define("transmovapp.lists.l_codigos", {
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
                label: "No. Código Promocional",
                caption: "codigo"
            },
            {
                label: "Tipo Valor",
                caption: "tipo_valor"
            },
            {
                label: "Valor",
                caption: "valor"
            },
            {
                label: "Características",
                caption: "caracteristicas"
            },
            {
                label: "ID Tipo de Empresa",
                caption: "tipo_empresa"
            },
            {
                label: "Tipo de Empresa",
                caption: "tipo_empresa_text"
            },
            {
                label: "ID Empresa",
                caption: "empresa"
            },
            {
                label: "Empresa",
                caption: "empresa_text"
            }
        ];
        self.setColumns(columns);

        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            }
        ];
        self.createFilters(filters);
        self.setAllPermissions(true);

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
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });

        self.execSettings();
        self.hideColumn("id");
        self.hideColumn("tipo_empresa");
        self.hideColumn("empresa");
        self.applyFilters();
        var up = qxnw.userPolicies.getUserData();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                self.slotEditar();
            });
            m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function (e) {
                qxnw.utils.question("¿Está seguro de eliminar el registro?", function (e) {
                    if (e) {
                        self.slotEliminar();
                    } else {
                        return;
                    }
                });
            });
            m.exec(veteapp);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "codigos");
            var r = rpc.exec("execPage", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.setModelData(r);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new transmovapp.forms.f_codigos();
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
            var d = new transmovapp.forms.f_codigos();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.ui.num_codigos.setValue("1");
            d.ui.num_codigos.setEnabled(false);
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
            var rpc = new qxnw.rpc(this.rpcUrl, "codigos");
            rpc.exec("eliminar", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.applyFilters();
            return true;
        }
    }
});