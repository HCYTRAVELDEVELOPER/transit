qx.Class.define("nwsites.lists.l_empresas_clientes", {
    extend: qxnw.lists,
    construct: function() {
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
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "NIT",
                caption: "nit"
            },
            {
                label: "Razon Social",
                caption: "razon_social"
            },
            {
                label: "Telefono",
                caption: "telefono"
            },
            {
                label: "Celular",
                caption: "celular"
            },
            {
                label: "Dirección",
                caption: "direccion"
            },
            {
                label: "Estado",
                caption: "estado"
            },
            {
                label: "Contacto Directo",
                caption: "contacto_directo"
            },
            {
                label: "Logo",
                caption: "logo"
            },
            {
                label: "Imagen Portada",
                caption: "imagen_portada"
            },
            {
                label: "Url",
                caption: "url"
            }
            
        ];
        this.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            },
            {
                name: "fecha_inicial",
                caption: "fecha_inicial",
                label: "Fecha Inicial",
                type: "dateField"
//                required: true
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: "Fecha Final",
                type: "dateField"
//                required: true
            }
        ];
        self.createFilters(filters);
        var render = new qxnw.rowRenderer();
        render.setHandleData(1, "1", "orange");
        render.setHandleData(1, "2", "#fff");
        self.table.setDataRowRenderer(render);
        self.spinnerUpdate.setValue(5);
        self.updateCheck.setValue(true);
        self.table.setRowHeight(40);
        var data = {};
        data["TODAS"] = "Todas";

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
        self.applyFilters();
    },
    destruct: function() {
    },
   members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Imprimir Inventario Total", "icon/16/actions/document-properties.png", function (e) {
                self.slotImprimir();
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consultaEmpresaCLientes", data, func);
        },
        slotImprimir: function slotImprimir() {
            var self = this;
            var f = new qxnw.forms("Ingresos");
            var data = self.selectedRecord();
            var r = qxnw.config.getPrinterData("configuraciones", "getData");
            f.createPrinterToolBar("Ingreso", data, 1);
            f.addFrame("/imp/inventario.php", true, data);
            f.hidePrinterSelect();
            f.show();
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new nwsites.forms.f_empresas_clientes();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        }
    }
});