qx.Class.define("nwsites.lists.l_usuariosnwsites", {
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
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Usuario",
                caption: "usuario"
            },
            {
                label: "Clave",
                caption: "clave"
            },
            {
                label: "Terminal",
                caption: "nom_terminal"
            },
            {
                label: "E-mail",
                caption: "email"
            },
            {
                label: "ID Terminal",
                caption: "terminal"
            },
            {
                label: "Perfil",
                caption: "nom_perfil"
            },
            {
                label: "ID Perfil",
                caption: "perfil"
            },
            {
                label: "Conectado",
                caption: "conectado"
            },
            {
                label: "Ciudad ID",
                caption: "ciudad"
            },
            {
                label: "Ciudad",
                caption: "nom_ciudad"
            },
            {
                label: "Estado",
                caption: "estado"
            }];
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
                label: "Tienda",
                type: "textField"
            }
        ];
        self.createFilters(filters);
//        var data = {};
//        data["TODAS"] = "Todas";
//        qxnw.utils.populateSelectFromArray(self.ui.terminal, data);
//        data = {};
//        data.table = "terminales";
//        qxnw.utils.populateSelect(self.ui.terminal, "master", "populate", data);

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
//        self.execSettings();
//        self.processPermissions();
//        self.ui.newButton.setEnabled(true);
//        self.hideColumn("terminal");
//        self.hideColumn("ciudad");
//        self.hideColumn("bodega");
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            var r = rpc.exec("ConsultaUsuariosNwsites", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.setModelData(r);
//            self.hideColumn("terminal");
//            self.hideColumn("perfil");
//            self.hideColumn("clave");
//            self.hideColumn("cliente");
//            self.hideColumn("bodega");
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new nwsites.forms.f_usuariosnwsites();
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
            var d = new nwsites.forms.f_usuariosnwsites();
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
            var rpc = new qxnw.rpc(this.rpcUrl, "pv_nwsites");
            rpc.exec("eliminarUsuariosNwsites", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        },
        setParamRecordLocales: function setParamRecordLocales(pr) {
            var self = this;
            //self.setRecord(pr);
//            self.ui.terminal.setValue(pr.productID);
            console.log(pr);
            self.ui.terminal.setValue(pr.id.toString());
            self.ui.terminal.setEnabled(false);
            self.ui.newButton.setEnabled(false);
            self.ui.newButton.setVisibility("hidden");
            self.applyFilters();
            return true;
        }
    }
});