qx.Class.define("qxnw.basics.lists.l_usuarios", {
    extend: qxnw.lists,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "Codigo",
                caption: "id"
            },
            {
                label: self.tr("Details"),
                caption: "details",
                type: "html"
            },
            {
                label: self.tr("Nombre"),
                caption: "nombre"
            },
            {
                label: self.tr("Apellido"),
                caption: "apellido"
            },
            {
                label: self.tr("Documento"),
                caption: "documento"
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            },
            {
                label: self.tr("Clave"),
                caption: "clave"
            },
            {
                label: self.tr("Celular"),
                caption: "celular"
            },
            {
                label: self.tr("Cargo"),
                caption: "cargo"
            },
            {
                label: self.tr("Terminal"),
                caption: "nom_terminal"
            },
            {
                label: self.tr("E-mail"),
                caption: "email"
            },
            {
                label: self.tr("ID Terminal"),
                caption: "terminal"
            },
            {
                label: self.tr("Perfil"),
                caption: "nom_perfil"
            },
            {
                label: self.tr("ID Perfil"),
                caption: "perfil"
            },
            {
                label: self.tr("País"),
                caption: "nom_pais"
            },
            {
                label: self.tr("ID Pais"),
                caption: "pais"
            },
            {
                label: self.tr("Conectado"),
                caption: "conectado"
            },
            {
                label: self.tr("Ver Chat"),
                caption: "ver_chat"
            },
            {
                label: self.tr("Cliente"),
                caption: "cliente"
            },
            {
                label: self.tr("Cliente"),
                caption: "nom_cliente"
            },
            {
                label: self.tr("Fecha Nacimiento"),
                caption: "fecha_nacimiento"
            },
            {
                label: self.tr("Foto"),
                caption: "foto",
                type: "image"
            },
            {
                label: self.tr("Estado"),
                caption: "estado"
            },
            {
                label: self.tr("Estado Empleado"),
                caption: "estado_empleado"
            }
        ];
        self.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            },
            {
                name: "terminal",
                caption: "terminal",
                label: "Terminal...",
                type: "selectBox"
            },
            {
                name: "activo",
                caption: "activo",
                label: "Activo",
                type: "selectBox"
            }
        ];
        self.createFilters(filters);
        var data = {};
        data["TODAS"] = "Todas";
        qxnw.utils.populateSelectFromArray(self.ui.terminal, data);
        qxnw.utils.populateSelect(self.ui.terminal, "nw_usuarios", "getTerminales");
        try {
            self.ui.terminal.setValue(self.up.terminal);
        } catch (e) {

        }
        
        data = {};
        data["activo"] = "SI";
        data["inactivo"] = "NO";
        data["TODOS"] = "Todos";
        qxnw.utils.populateSelectFromArray(self.ui.activo, data);
        
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
        self.hideColumn("terminal");
        self.hideColumn("perfil");
        self.hideColumn("clave");
        self.hideColumn("cliente");
        self.hideColumn("pais");
//        self.ui.newButton.setEnabled(true);
        self.ui.deleteButton.setEnabled(true);
//        self.execSettings();
        self.ui.terminal.setEnabled(true);
//        self.execSettings();
        self.table.setRowHeight(40);
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
            m.addAction("Habilitar", "icon/16/actions/dialog-cancel.png", function(e) {
                qxnw.utils.question("¿Está seguro de habilitar este usuario?", function(e) {
                    if (e) {
                        self.slotDesinactivar();
                    } else {
                        return;
                    }
                });
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_usuarios");
            rpc.setAsync(true);
            var func = function(r) {
                self.setModelData(r);
            };
            rpc.exec("execPage", data, func);
        },
        slotDesinactivar: function slotDesinactivar() {
            var self = this;
            var r = self.selectedRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_usuarios");
            rpc.setAsync(true);
            var func = function(r) {
                qxnw.utils.information("Se ha activado el usuario correctamente");
                self.applyFilters();
            };
            rpc.exec("activationUser", r, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.basics.forms.f_usuarios();
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
            var d = new qxnw.basics.forms.f_usuarios();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_usuarios");
            rpc.exec("eliminar", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        }
    }
});