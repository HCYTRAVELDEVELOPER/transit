qx.Class.define("nwsites.lists.l_sitios", {
    extend: qxnw.lists,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "ID terminal",
                caption: "id"
            },
            {
                label: "ID local",
                caption: "productID"
            },
            {
                label: "Activo",
                caption: "active"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Categoria ID",
                caption: "categoria"
            },
            {
                label: "Categoria",
                caption: "categoria_text"
            },
            {
                label: "Dirección",
                caption: "direccion"
            },
            {
                label: "Teléfono",
                caption: "telefono"
            },
            {
                label: "Piso",
                caption: "piso"
            },
            {
                label: "Mapa",
                caption: "id_map_enc"
            },
            {
                label: "Correo",
                caption: "correo"
            },
            {
                label: "Url",
                caption: "url"
            },
            {
                label: "Imagen Logo",
                caption: "imagen_logo",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: "Imagen de Portada",
                caption: "productImage",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: "Descripción Corta",
                caption: "descripcion_corta"
            },
            {
                label: "Tags",
                caption: "tags"
            },
            {
                label: "ID User",
                caption: "id_user"
            }
        ];
        this.setColumns(columns);

        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            }
        ];

        this.createFilters(filters);
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
        self.hideColumn("id");
        self.hideColumn("categoria");
        self.hideColumn("id_user");
        self.hideColumn("productID");
        this.applyFilters();
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
            m.addAction("Crear Nuevo Usuario", "icon/16/actions/system-search.png", function(e) {
                self.slotCrearUsuarios();
            });
            m.addAction("Ver Usuarios", "icon/16/actions/system-search.png", function(e) {
                self.slotVerUsuarios();
            });
//            m.addAction("Ver Informacion Comercial", "icon/16/actions/system-search.png", function(e) {
//                self.slotVerInformarcionComercial();
//            });
//            m.addAction("Ver Informacion Administrador", "icon/16/actions/system-search.png", function(e) {
//                self.slotVerInformarcionAdministrador();
//            });
//            m.addAction("Ver Informacion Inmobiliaria", "icon/16/actions/system-search.png", function(e) {
//                self.slotVerInformarcionInmobiliaria();
//            });
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
        slotVerUsuarios: function slotVerUsuarios() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new nwsites.lists.l_usuariosnwsites();
            if (!d.setParamRecordLocales(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotCrearUsuarios: function slotCrearUsuarios() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new nwsites.forms.f_usuarios();
            if (!d.setParamRecordLocales(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(this.rpcUrl, "nwsites");
            //var r = rpc.exec("consulta", data);
            var r = rpc.exec("consultSitios", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            this.setModelData(r);
            this.hideColumn("ciudad");
            this.hideColumn("id");
        },
        slotNuevo: function slotNuevo()
        {
            var self = this;
            var d = new nwsites.forms.f_sitios();
            d.settings.accept = function() {
                self.applyFilters();
            }
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined)
            {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new nwsites.forms.f_sitios();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            }
            d.show();
        },
        slotVerInformarcionComercial: function slotVerInformarcionComercial()
        {
            var d = new nwsites.cc.lists.l_infoComercial();
            d.show();
        },
        slotVerInformarcionAdministrador: function slotVerInformarcionAdministrador()
        {
            var d = new nwsites.cc.lists.l_infoAdministrador();
            d.show();
        },
        slotVerInformarcionInmobiliaria: function slotVerInformarcionInmobiliaria()
        {
            var d = new nwsites.cc.lists.l_infoInmobiliaria();
            d.show();
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "nwsites");
            rpc.exec("eliminar", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        }
    }
});
