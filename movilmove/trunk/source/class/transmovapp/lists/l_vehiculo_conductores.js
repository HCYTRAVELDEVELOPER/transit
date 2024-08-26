qx.Class.define("transmovapp.lists.l_vehiculo_conductores", {
    extend: qxnw.lists,
    construct: function () {
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
                label: "Usuario",
                caption: "usuario_cliente"
            },
            {
                label: "Nombre",
                caption: "nombre_completo"
            },
            {
                label: "Usando",
                caption: "principal"
            }
        ];
        self.setColumns(columns);

        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            }
        ];
        self.createFilters(filters);
        self.setAllPermissions(true);

        self.ui.deleteButton.addListener("click", function () {
            self.slotEliminar();
        });
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

        self.execSettings();
//        self.hideColumn("id");
//        self.applyFilters();
//        var up = qxnw.userPolicies.getUserData();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Desvincular", "icon/16/actions/document-properties.png", function (e) {
                self.slotDesvincular();
            });
//            m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function (e) {
//                qxnw.utils.question("¿Está seguro de eliminar el registro?", function (e) {
//                    if (e) {
//                        self.slotEliminar();
//                    } else {
//                        return;
//                    }
//                });
//            });
            m.exec(veteapp);
        },
        slotDesvincular: function slotDesvincular() {
            var self = this;
            var r = self.selectedRecord();
            console.log("r", r);
            console.log("self.datav", self.datav);
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            qxnw.utils.question("<h3 style='color: red;'>¿Realmente desea desvincular el usuario " + r.nombre_completo + " (" + r.usuario_cliente + ") de este vehículo?</h3><p>Recuerde que el usuario no podrá realizar viajes con este vehículo.</p>", function (e) {
                if (e) {
                    var data = r;
                    data.id_vehiculo = self.datav.id;
                    console.log("slotDesvincular:::dataSendServer:::data", data);
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "vehiculos_admin", true);
                    var func = function (r) {
                        console.log("slotDesvincular:::responseServer", r);
                        if (r === true) {
                            qxnw.utils.information("¡Desvinculado correctamente!");
                            self.accept();
                            self.reject();
                        }
                    };
                    rpc.exec("desvincularConductorOfVehiculo", data, func);

                }
            });
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.usuarios = self.datav.id_usuario;
            console.log("self.datav.id_usuario", self.datav.id_usuario);
            if (qxnw.utils.evalueData(self.datav.id_otros_conductores)) {
                var conducts = self.datav.id_otros_conductores;
                conducts = conducts.replace(/{/gi, '');
                conducts = conducts.replace(/}/gi, ',');
                conducts = conducts.slice(0, -1);

                var coma = ",";
                if (!qxnw.utils.evalueData(self.datav.id_usuario)) {
                    coma = "";
                }
                data.usuarios += coma + conducts;
            }
            console.log("dataSend:::data y self.datav", data, self.datav);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "vehiculos_admin", true);
            var func = function (r) {
                console.log("applyFilters:::responseServer", r);
                for (var i = 0; i < r.records.length; i++) {
                    if (r.records[i].usuario_cliente == self.datav.usuario_usando) {
                        r.records[i].principal = "Usando";
                    }
                }
                self.setModelData(r);
            };
            rpc.exec("getConductoresByVehiculo", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.datav = pr;
            self.applyFilters();
        }
    }
});