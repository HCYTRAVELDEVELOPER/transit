qx.Class.define("qxnw.nw_chat.lists.l_vistaGeneral", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setButtonsAutomatic(true);
        this.createBase();
        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Usuario Envia",
                caption: "usuario_envia"
            },
            {
                label: "Usuario Recibe",
                caption: "usuario_recibe"
            },
            {
                label: "Mensaje",
                caption: "mensaje"
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Hora",
                caption: "hora"
            },
            {
                label: "Empresa",
                caption: "empresa"
            },
            {
                label: "Fecha y Hora",
                caption: "fecha_timestamp"
            },
            {
                label: "Leido Envia",
                caption: "leido_envia"
            },
            {
                label: "Leido Recibe",
                caption: "leido_recibe"
            },
            {
                label: "Sala",
                caption: "nombre"
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
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("click", function () { //mensaje de eliminar 
            qxnw.utils.question("¿Está seguro de eliminar el registro?", function (e) {
                if (e) {
                    self.slotEliminar();
                } else {

                    return;
                }
            });
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
        self.hideColumn("id");
        self.hideColumn("empresa");
        self.hideColumn("fecha_timestamp");
        self.hideColumn("fecha");
        //    self.hideColumn("sala");

        this.applyFilters();
    },
    destruct: function () {
    },
    members: {
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "vistaGeneral");
            rpc.setAsync(true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        }
    }
})

