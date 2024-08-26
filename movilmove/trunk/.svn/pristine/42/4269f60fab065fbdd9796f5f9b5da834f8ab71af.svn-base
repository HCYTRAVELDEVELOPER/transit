qx.Class.define("transmovapp.lists.l_servicios_fotos", {
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
        self.setTitle("Fotos de viaje ::: servicio " + self.data.id);

        qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", 20);

        var columns = [
            {
                caption: "id",
                label: "ID"
            },
            {
                caption: "imagen",
                label: "Imagen",
                type: "image",
                mode: "phpthumb"
            },
            {
                caption: "fecha",
                label: "Fecha",
                mode: "toolTip"
            },
            {
                caption: "usuario",
                label: "Usuario",
                mode: "toolTip"
            },
            {
                caption: "comentarios",
                label: "Comentarios",
                mode: "toolTip"
            },
            {
                caption: "comentarios_user",
                label: "Comentarios user",
                mode: "toolTip"
            },
            {
                caption: "estado",
                label: "Estado",
                mode: "toolTip"
            },
            {
                caption: "tipo",
                label: "Tipo",
                mode: "toolTip"
            },
            {
                caption: "id_servicio",
                label: "ID servicio"
            },
            {
                caption: "id_parada",
                label: "ID parada"
            }
        ];
        self.setColumns(columns);

        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Buscar...",
                type: "textField"
            },
            {
                name: "id_servicio",
                caption: "id_servicio",
                label: "ID Servicio...",
                type: "textField",
                required: true
            },
            {
                name: "id_parada",
                caption: "id_parada",
                label: "ID Parada...",
                type: "textField"
            },
            {
                name: "tipo",
                caption: "tipo",
                label: "Tipo",
                type: "selectBox"
            }
        ];
        self.createFilters(filters);
        self.setAllPermissions(true);

        self.hideColumn("id");

        var data = {};
        data[""] = "TODOS";
        data["id_servicio"] = "Viaje";
        data["id_parada"] = "Parada";
        qxnw.utils.populateSelectFromArray(self.ui.tipo, data);

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
//        self.applyFilters();
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
            var rpc = new qxnw.rpc(self.rpcUrl, "servicios_admin");
            rpc.setAsync(true);
            var func = function (res) {
                self.setModelData(res);
            };
            rpc.exec("verFotosViaje", ds, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            console.log("pr", pr);
            self.ui.id_servicio.setValue(pr.id_servicio.toString());
            if (qxnw.utils.evalueData(pr.id_parada)) {
                self.ui.id_parada.setValue(pr.id_parada.toString());
            }
            if (qxnw.utils.evalueData(pr.tipo)) {
                self.ui.tipo.setValue(pr.tipo);
            }
            self.applyFilters();
            return true;
        }
    }
});