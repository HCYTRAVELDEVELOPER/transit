qx.Class.define("qxnw.nw_printer.lists.l_printer", {
    extend: qxnw.lists,
    construct: function() {
        this.base(arguments);
        var self = this;
        self.setButtonsAutomatic(true);
        self.createBase();
        var columns = [
            {
                label: self.tr("ID"),
                caption: "id"
            },
            {
                label: self.tr("Nombre"),
                caption: "nombre"
            },
            {
                label: self.tr("Ancho"),
                caption: "ancho"
            },
            {
                label: self.tr("Alto"),
                caption: "alto"
            },
            {
                label: self.tr("Transformación del texto"),
                caption: "text_transform"
            },
            {
                label: self.tr("Ancho tabla"),
                caption: "ancho_tabla"
            },
            {
                label: self.tr("Margen superior"),
                caption: "margen_superior"
            },
            {
                label: self.tr("Margen inferior"),
                caption: "margen_inferior"
            },
            {
                label: self.tr("Margen derecha"),
                caption: "margen_derecha"
            },
            {
                label: self.tr("Margen izquierda"),
                caption: "margen_izquierda"
            },
            {
                label: self.tr("Fuente"),
                caption: "fuente"
            },
            {
                label: self.tr("Tamaño fuente"),
                caption: "tamano_fuente"
            },
            {
                label: self.tr("Centrar contenido"),
                caption: "centrar"
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            },
            {
                label: self.tr("Fecha"),
                caption: "fecha"
            },
            {
                label: self.tr("Empresa"),
                caption: "empresa"
            }
        ];

        self.setColumns(columns);
        self.ui.newButton.addListener("click", function() {
            self.slotNew();
        });
        self.ui.deleteButton.addListener("click", function() { //mensaje de eliminar 
            qxnw.utils.question(self.tr("¿Está seguro de eliminar el registro?"), function(e) {
                if (e) {
                    self.slotDelete();
                }
            });
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
        self.setAllPermissions(true);
        self.execSettings();
    },
    destruct: function() {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var sl = self.selectedRecord();
            m.addAction("Editar", "icon/16/actions/document-properties.png", function(e) {
                self.slotEdit();
            });
            m.addAction("Duplicar", "icon/16/actions/document-properties.png", function(e) {
                self.slotDuplicity(sl);
            });
            if (sl.usuario != qxnw.userPolicies.getUser()) {
                m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function(e) {
                    qxnw.utils.question(self.tr("¿Está seguro de eliminar la impresión?"), function(e) {
                        if (e) {
                            self.slotDelete();
                        }
                    });
                });
            }
            m.exec(pos);
        },
        slotDuplicity: function slotDuplicity(sl) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_printer");
            rpc.setAsync(true);
            var func = function() {
                self.applyFilters();
            };
            rpc.exec("duplicityPrinter", sl.id, func);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_printer");
            rpc.setAsync(true);
            var func = function(r) {
                self.setModelData(r);
            };
            rpc.exec("consult", data, func);
        },
        slotNew: function slotNew() {
            var self = this;
            var d = new qxnw.nw_printer.forms.f_printer();
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotEdit: function slotEdit() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_printer.forms.f_printer();
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotDelete: function slotDelete() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_printer");
            rpc.setAsync(true);
            var func = function(r) {
                self.applyFilters();
            };
            rpc.exec("delete", r, func);
        }
    }
});