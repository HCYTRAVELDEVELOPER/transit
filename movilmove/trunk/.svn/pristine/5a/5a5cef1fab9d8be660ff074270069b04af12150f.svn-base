qx.Class.define("nwsites.lists.l_productos", {
    extend: qxnw.lists,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "ID Producto",
                caption: "id"
            },
            {
                label: "Nombre Producto",
                caption: "nombre"
            },
            {
                label: "Referencia",
                caption: "referencia"
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Orden",
                caption: "orden"
            },
            {
                label: "Categoria ID",
                caption: "categoria"
            },
            {
                label: "Categoria",
                caption: "nom_categoria"
            },
            {
                label: "Puntaje",
                caption: "puntaje"
            },
            {
                label: "Destacado",
                caption: "destacado"
            },
            {
                label: "Publicado",
                caption: "mostrar_producto"
            },
            {
                label: "Integrado",
                caption: "integrado"
            },
            {
                label: "Empresa Cliente",
                caption: "empresa_cliente"
            },
            {
                label: "Foto",
                caption: "foto",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: "Precio Costo",
                caption: "precio_costo",
                type: "money"
            },
            {
                label: "Precio Venta",
                caption: "precio",
                type: "money"
            },
            {
                label: "IVA",
                caption: "iva",
                type: "money"
            },
            {
                label: "Valor IVA",
                caption: "valor_iva",
                type: "money"
            },
            {
                label: "Valor",
                caption: "valor",
                type: "money"
            },
            {
                label: "Valor Total",
                caption: "valor",
                type: "money"
            },
            {
                label: "Proveedor ID",
                caption: "proveedor"
            },
            {
                label: "Proveedor",
                caption: "nom_proveedor"
            },
            {
                label: "Descripción Corta",
                caption: "descripcion_corta"
            },
            {
                label: "Descripción",
                caption: "descripcion"
            },
            {
                label: "Lote",
                caption: "lote"
            }];
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            },
            {
                name: "empresa_cliente",
                caption: "empresa_cliente",
                label: "Empresa / Tienda",
                type: "selectBox"
            },
            {
                name: "categoria",
                caption: "categoria",
                label: "Categoria",
                type: "selectBox"
            }
        ];
        self.setColumns(columns);
        self.createFilters(filters);
        self.processPermissions();
        self.ui.searchButton.addListener("execute", function() {
            self.applyFilters();
        });
        var data = {};
        data["TODAS"] = "Todas";
        qxnw.utils.populateSelectFromArray(self.ui.categoria, data);
        qxnw.utils.populateSelectFromArray(self.ui.empresa_cliente, data);
        data = {};
        data.table = "pv_categorias";
        qxnw.utils.populateSelect(self.ui.categoria, "master", "populate", data);
        data = {};
        data.table = "pv_empresas_clientes";
        qxnw.utils.populateSelect(self.ui.empresa_cliente, "master", "populate", data);

        self.hideColumn("categoria");
        self.hideColumn("proveedor");
        self.hideColumn("usuario");
        self.hideColumn("empresa");
        self.hideColumn("unidad_medida");
        self.hideColumn("color");
        self.hideColumn("talla");
        self.hideColumn("marca");
        self.hideColumn("id");
        self.hideColumn("puntaje");
        self.hideColumn("integrado");
        self.hideColumn("empresa_cliente");
        self.hideColumn("nom_proveedor");
        self.hideColumn("descripcion_corta");
        self.hideColumn("descripcion");
        self.hideColumn("lote");
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

        self.execSettings();
        self.processPermissions();
        self.ui.newButton.setEnabled(true);
        self.applyFilters();

    },
    destruct: function() {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/zoom-in.png", function(e) {
                self.slotEditar();
            });
            m.addAction("Productos Asociados", "icon/16/actions/zoom-in.png", function(e) {
                self.slotAsociarProducto();
            });
            m.addAction("Eliminar", "icon/16/actions/dialog-close.png", function(e) {
                self.slotEliminar();
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function(r) {
                self.setModelData(r);
            };
            rpc.exec("consultaProductos", data, func);
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            qxnw.utils.question("¿Está seguro de eliminar este registro?", function(e) {
                if (e) {
                    self.slotEliminarOk();
                } else {
                    return false;
                }
            });
        },
        slotEliminarOk: function slotEliminarOk() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function() {
                self.applyFilters();
            };
            rpc.exec("eliminarProductos", r, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;

            var d = new nwsites.forms.f_productos();
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotAsociarProducto: function slotAsociarProducto() {
            var self = this;
            var pr = self.selectedRecord();
            if (pr == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new nwsites.forms.f_productos_asociados();
            if (!d.setParamRecord(pr)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var pr = self.selectedRecord();
            if (pr == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new nwsites.forms.f_productos();
            if (!d.setParamRecord(pr)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        }
    }
});