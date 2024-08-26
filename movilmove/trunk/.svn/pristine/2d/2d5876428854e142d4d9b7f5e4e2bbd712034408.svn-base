qx.Class.define("transmovapp.lists.l_tiempos", {
    extend: qxnw.lists,
    construct: function (table) {
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
                label: "Usuario",
                caption: "usuario"
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "ID Empresa",
                caption: "empresa"
            },
            {
                label: "Empresa",
                caption: "empresa_text"
            },
            {
                label: "ID Subcategoria",
                caption: "subcategoria"
            },
            {
                label: "Subcategoria",
                caption: "subcategoria_text"
            },
            {
                label: "ID Recargo",
                caption: "recargo"
            },
            {
                label: "Recargo",
                caption: "recargo_text"
            },
            {
                label: "Origen/Destino",
                caption: "desde"
            },
            {
                label: "Tiempo (Minutos)",
                caption: "tiempo"
            }
        ];
        self.setColumns(columns);

        var filters = [
            {
                name: "empresa",
                caption: "empresa",
                label: "empresa",
                type: "textField",
                visible: false
            },
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
        self.hideColumn("usuario");
        self.hideColumn("empresa");
        self.hideColumn("subcategoria");
        self.hideColumn("fecha");
        self.hideColumn("recargo");
        self.applyFilters();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu() {
            var self = this;
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
            var r = rpc.exec("tiemposEmpresa", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.setModelData(r);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var f = new qxnw.forms();
            var f = new qxnw.forms();
            f.setTitle("Establecer tiempos de espera");
            var fields = [
                {
                    name: " ",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "id",
                    label: "ID",
                    caption: "id",
                    type: "textField",
                    visible: false
                },
                {
                    name: "empresa",
                    label: "ID Empresa",
                    caption: "empresa",
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    name: "empresa_text",
                    label: "Empresa",
                    caption: "empresa_text",
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    name: "label",
                    label: "<strong>Seleccione el tiempo de espera para la subcategoria o el recargo.</strong>",
                    caption: "label",
                    type: "label"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: " ",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "subcategoria",
                    label: "Subcategoria",
                    caption: "subcategoria",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "recargo",
                    label: "Recargo",
                    caption: "recargo",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: " ",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "desde",
                    label: "Origen/Destino",
                    caption: "desde",
                    type: "selectBox"
                },
                {
                    name: "tiempo",
                    label: "Tiempo espera (min)",
                    caption: "tiempo",
                    type: "textField",
                    mode: "integer",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                }
            ];
            f.setFields(fields);
            f.setModal(true);
            f.setFieldVisibility(f.ui.desde, "excluded");

            var data = {};
            data[""] = "Todas";
            qxnw.utils.populateSelectFromArray(f.ui.subcategoria, data);
            data.table = "edo_subcategoria";
            qxnw.utils.populateSelect(f.ui.subcategoria, "master", "populate", data);
            var data = {};
            data[""] = "Todas";
            qxnw.utils.populateSelectFromArray(f.ui.recargo, data);
            data.table = "edo_recargos";
            qxnw.utils.populateSelect(f.ui.recargo, "master", "populate", data);
            var data = {};
            data["Origen"] = "Origen";
            data["Destino"] = "Destino";
            qxnw.utils.populateSelectFromArray(f.ui.desde, data);

            f.ui.subcategoria.addListener("changeSelection", function () {
                var r = this.getValue();
                console.log(r);
                if (r.subcategoria != "") {
                    f.ui.recargo.setEnabled(false);
                    f.ui.recargo.setValue("");
                    f.setRequired("recargo", false);
                } else {
                    f.ui.recargo.setEnabled(true);
                    f.setRequired("recargo", true);
                }
            });
            f.ui.recargo.addListener("changeSelection", function () {
                var r = this.getValue();
                if (r.recargo != "") {
                    f.ui.subcategoria.setEnabled(false);
                    f.ui.subcategoria.setValue("");
                    f.setRequired("subcategoria", false);
                } else {
                    f.ui.subcategoria.setEnabled(true);
                    f.setRequired("subcategoria", true);
                }
            });
            f.ui.recargo.addListener("changeSelection", function () {
                var r = this.getValue();
                if (r.recargo === "1") {
                    f.setFieldVisibility(f.ui.desde, "visible");
                    f.setRequired("desde", true);
                } else {
                    f.setFieldVisibility(f.ui.desde, "excluded");
                    f.setRequired("desde", false);
                }
            });
            f.setRecord(r);
            f.show();
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var data = f.getRecord();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
                rpc.setAsync(true);
                var func = function () {
                    f.accept();
                    self.applyFilters();
                };
                rpc.exec("tiempo_espera", data, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "empresas");
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