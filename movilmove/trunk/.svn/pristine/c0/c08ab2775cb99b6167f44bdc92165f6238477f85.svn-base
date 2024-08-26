nw.Class.define("l_navtable_paradas_rotulos", {
    extend: nw.lists,
    construct: function (canvas, datos) {
        var self = this;
        self.id_form = "l_navtable_paradas_rotulos";
        self.showContextMenu = true;
        self.setTitle = "Rótulos";
        self.canvas = canvas;
        self.datos = datos;
        if (self.datos.appliFilters != "NO") {
            self.applyFilters(function (r) {
                var columns = [];
                columns.push(
                        {
                            label: "",
                            name: "separador"
                        }
                );
                var ra = JSON.parse(r[0].rotulos);
                $.each(ra[0], function (index, val) {
                    columns.push({
                        label: index.replace("_", " "),
                        name: index
                    });
                });
                var arr = [];
                for (var i = 0; i < ra.length; i++) {
                    var s = {};
                    $.each(ra[i], function (index, val) {
                        if (nw.utils.evalueData(val)) {
                            s[index] = val;
                        }
                    });
                    arr.push(s);
                }
                self.setColumns(columns);

                arr = nw.lists.addValueInModel(arr, "editar", "<i class='material-icons'>edit</i> Editar");
                arr = nw.lists.addValueInModel(arr, "separador", "");
                self.setModelData(arr);

            });
        } else {
            var columns = [];
            columns.push(
                    {
                        label: "",
                        name: "separador"
                    }
            );
            $.each(datos, function (index, val) {
                console.log("INDEX", index);
                console.log("VAL", val);
                if (index == "appliFilters") {
                    console.log("ESTNTAA IF");
                    var vi = false;
                } else {
                    var vi = true;
                }
                columns.push({
                    label: index.replace("_", " "),
                    name: index,
                    visible: vi
                });
            });
            var arr = [];
            var s = {};
            $.each(datos, function (index, val) {
                if (nw.utils.evalueData(val)) {
                    s[index] = val;
                }
            });
            arr.push(s);
            self.setColumns(columns);

        }

        return self;
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu() {
            var self = this;
            var data = self.selectedRecord();
            console.log("data", data);
            var typemenu = "normal"; //normal
            var native = true;
//            self.contextmenu_native = false;
            var m = new nw.contextmenu(self, typemenu, native); //vertical, bottom, normal
//            if (!nw.evalueData(data.id)) {
            m.addAction("Eliminar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                self.eliminar(data);
            });
            m.addAction("Editar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                self.editar(data);
            });
//            }
        },
        editar: function editar(data) {
            var self = this;
            console.log("editar:::data", data);
            var d = new f_registro_rotulos();
            d.construct(self, data);
        },
        eliminar: function eliminar() {
            var self = this;
            var data = self.selectedRecord();
            console.log("data", data);
            self.removeRow(self.activeRow);
        },
        applyFilters: function applyFilters(callback) {
            var self = this;
            console.log("self.datos", self.datos);
            if (!nw.evalueData(self.datos)) {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.conductor = up.usuario;
            data.empresa = up.empresa;
            data.id = self.datos.id;
            console.log("consultaRotulosPorParada:::data", data);
            var rpc = new nw.rpc(self.getRpcUrl(), "app_driver");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("consultaRotulosPorParada:::r", r);
                callback(r);
            };
            rpc.exec("consultaRotulosPorParada", data, func);
        }
    }
});