qx.Class.define("transmovapp.lists.l_operarios", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        self.__conf = main.getConfiguracion();
        var columns = [
            {
                label: "Código",
                caption: "id"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Apellido",
                caption: "apellido"
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
                label: "E-mail",
                caption: "email"
            },
            {
                label: "Telefono",
                caption: "celular"
            },
            {
                label: "Perfil",
                caption: "perfil_text"
            },
            {
                label: "ID Perfil",
                caption: "perfil"
            },
            {
                label: "Conectado",
                caption: "estado_conexion"
            },
            {
                label: "País ID",
                caption: "pais"
            },
            {
                label: "País",
                caption: "nom_pais"
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
                label: "Terminal ID",
                caption: "terminal"
            },
            {
                label: "Terminal",
                caption: "terminal_text"
            },
            {
                label: "Estado",
                caption: "estado"
            },
            {
                label: "Firma",
                caption: "firma",
                type: "image"
            },
            {
                label: "Tipo Empresa",
                caption: "tipo_empresa"
            },
            {
                label: "Empresa cliente ID",
                caption: "bodega"
            },
            {
                label: "Empresa cliente",
                caption: "bodega_text"
            },
            {
                label: "Centro costo",
                caption: "centro_costo"
            },
            {
                label: "Permisos",
                caption: "permisos"
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
                name: "tabla",
                caption: "tabla",
                label: "tabla",
                type: "textField",
                visible: false
            }
        ];
//        setInterval(self.applyFilters(), 10000);
        self.createFilters(filters);
        self.setAllPermissions(true);

        //            self.hideColumn("perfil");
        self.hideColumn("clave");
        self.hideColumn("cliente");
        self.hideColumn("bodega");
        self.hideColumn("terminal");
        self.hideColumn("permisos");

//        self.ui.tabla.setValue(table);

//        self.ui.deleteButton.addListener("click", function () {
//            self.slotEliminar();
//        });
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

//        self.execSettings();
        self.hideColumn("perfil");
        self.hideColumn("ciudad");
        self.hideColumn("bodega");
        self.hideColumn("centro_costo");
//        if (self.__conf.usa_flotas_clientes == "SI") {
//            self.hideColumn("tipo_empresa", true);
//        } else {
//            self.excludeColumn("tipo_empresa");
//        }
        self.applyFilters();

//        var up = qxnw.userPolicies.getUserData();
//        console.log(up.profile);
//        if (up.profile == "1" || up.profile == "7") {
//            self.ui.exportButton.setEnabled(true);
//        }
//        if (up.profile == "1230") {
//            self.ui.editButton.setEnabled(false);
//            self.ui.deleteButton.setEnabled(false);
//        }
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var r = self.selectedRecord();
            if (up.profile != "1223") {
                var m = new qxnw.contextmenu(this);
                m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                    self.slotEditar();
                });
                m.addAction("Permisos", "icon/16/actions/document-properties.png", function (e) {
                    main.slotPermisos(r, function () {
                        self.applyFilters();
                    });
                });
//                m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function (e) {
//                    qxnw.utils.question("¿Está seguro de eliminar el registro?", function (e) {
//                        if (e) {
//                            self.slotEliminar();
//                        } else {
//                            return;
//                        }
//                    });
//                });
                m.exec(veteapp);
            }
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            if (self.__conf.usa_flotas_clientes == "SI") {
                data.tipoEmpresa = true;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios");
            var r = rpc.exec("execPageO", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.setModelData(r);
        },
        slotNuevo: function slotNuevo(table) {
            var self = this;
            table = self.ui.tabla.getValue();
            var d = new transmovapp.forms.f_operarios(table);
            d.ui.tabla.setValue(table);
//            d.ui.perfil.setEnabled(false);
//            d.ui.perfil.setValue(1);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.addListener("appear", function () {
                var element = d.ui.email.getContentElement().getDomElement();
                var element1 = d.ui.clave.getContentElement().getDomElement();
                console.log(element);
                element.setAttribute("autocomplete", "new-password");
                element1.setAttribute("autocomplete", "new-password");
            });
            d.setModal(true);
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            table = self.ui.tabla.getValue();
            var d = new transmovapp.forms.f_operarios();
            d.ui.tabla.setValue(table);
//            d.ui.clave.setValue("0");
//            d.setFieldVisibility(d.ui.clave, "excluded");
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
            var rpc = new qxnw.rpc(this.rpcUrl, "usuarios");
            rpc.exec("eliminarB", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            } else {
                self.removeSelectedRow();
                self.applyFilters();
            }
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.applyFilters();
            return true;
        }
    }
});