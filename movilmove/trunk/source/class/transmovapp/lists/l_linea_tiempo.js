qx.Class.define("transmovapp.lists.l_linea_tiempo", {
    extend: qxnw.lists,
    construct: function (r) {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        self.data = {};
        if (qxnw.utils.evalueData(r)) {
            self.data = r;
        }
        self.setTitle("Línea de tiempo ::: servicio " + self.data.id);

        qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", 20);

        var columns = [
            {
                caption: "id",
                label: "ID"
            },
            {
                caption: "fecha_server",
                label: "Fecha servidor",
                mode: "toolTip"
            },
            {
                caption: "fecha",
                label: "Fecha usuario",
                mode: "toolTip"
            },
            {
                caption: "usuario",
                label: "Usuario",
                mode: "toolTip"
            },
            {
                caption: "accion",
                label: "Acción",
                mode: "toolTip"
            },
            {
                caption: "comentarios",
                label: "Comentarios",
                mode: "toolTip"
            },
            {
                caption: "modulo",
                label: "Módulo",
                mode: "toolTip"
            },
            {
                caption: "perfil",
                label: "Perfil",
                mode: "toolTip"
            },
            {
                caption: "dispositivo",
                label: "Dispositivo",
                mode: "toolTip"
            },
            {
                caption: "latitud",
                label: "Latitud",
                mode: "toolTip"
            },
            {
                caption: "longitud",
                label: "Longitud",
                mode: "toolTip"
            }
        ];
        self.setColumns(columns);

        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Buscar...",
                type: "textField"
            }
        ];
        self.createFilters(filters);
        self.setAllPermissions(true);

        self.hideColumn("perfil");

//        self.ui.deleteButton.addListener("click", function () {
//            self.slotEliminar();
//        });
        self.ui.editButton.addListener("click", function () {
//            self.slotEditar();
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

        self.ui["part2"].setVisibility("excluded");
        self.ui["part3"].setVisibility("excluded");
        self.ui["part4"].setVisibility("excluded");


        self.execSettings();
        self.applyFilters();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var r = self.selectedRecord();
            console.log("r", r);
            var m = new qxnw.contextmenu(this);
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
        },
        applyFilters: function applyFilters() {
            var self = this;
            var ds = {};
            ds.filters = self.getFiltersData();
            ds.id = self.data.id;
            console.log("ds", ds);
            var rpc = new qxnw.rpc(self.rpcUrl, "lineTime");
            rpc.setAsync(true);
            var func = function (res) {
                self.setModelData(res);
            };
            rpc.exec("consultaLineaTiempoByIDService", ds, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.applyFilters();
            return true;
        }
    }
});