qx.Class.define("transmovapp.lists.l_conductores_notificados", {
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
        self.setTitle("Conductores notificados ::: servicio " + self.data.id);

//        qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", 20);

        var columns = [
            {
                caption: "id",
                label: "ID",
                mode: "toolTip"
            },
            {
                caption: "id_servicio",
                label: "ID servicio",
                mode: "toolTip"
            },
            {
                caption: "fecha",
                label: "Fecha",
                mode: "toolTip"
            },
            {
                caption: "usuario_cliente",
                label: "Usuario",
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
            },
            {
                caption: "token",
                label: "Token",
                mode: "toolTip"
            }
        ];
        self.setColumns(columns);

        self.setAllPermissions(true);


//        self.ui.deleteButton.addListener("click", function () {
//            self.slotEliminar();
//        });
//        self.ui.editButton.addListener("click", function () {
//            self.slotEditar();
//        });
//        self.ui.unSelectButton.addListener("click", function () {
//            self.clearSelection();
//        });
//        self.ui.selectAllButton.addListener("click", function () {
//            self.selectAll();
//        });
//        self.ui.updateButton.addListener("click", function () {
//            self.applyFilters();
//        });
//        self.ui.searchButton.addListener("execute", function () {
//            self.applyFilters();
//        });
//        self.ui.newButton.addListener("click", function () {
//            self.slotNuevo();
//        });

        self.ui["part2"].setVisibility("excluded");
        self.ui["part3"].setVisibility("excluded");
        self.ui["part4"].setVisibility("excluded");


//        self.execSettings();
        self.applyFilters();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var r = self.selectedRecord();
            var m = new qxnw.contextmenu(this);
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
                console.log("res", res);
                var ra = [];
                for (var i = 0; i < res.records.length; i++) {
                    var r = res.records[i];
                    console.log("r", r);
                    if (qxnw.utils.evalueData(r.drivers)) {
                        var drivs = JSON.parse(r.drivers);
                        console.log("drivs", drivs);
                        for (var x = 0; x < drivs.length; x++) {
                            var dr = drivs[x];
                            dr.fecha = r.fecha;
                            dr.id_servicio = r.id_servicio;
                            dr.id = r.id;
                            console.log("dr", dr);
                            ra.push(dr);
                        }
                    }
                }
                self.setModelData(ra);
            };
            rpc.exec("consultaConductoresNotificados", ds, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.applyFilters();
            return true;
        }
    }
});