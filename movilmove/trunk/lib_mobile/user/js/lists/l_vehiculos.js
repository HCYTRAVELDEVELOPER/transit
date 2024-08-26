nw.Class.define("l_vehiculos", {
    extend: nw.lists,
    construct: function () {
        var self = this;
        self.showContextMenu = true;
//        var self = new nw.lists();
        self.id = "l_vehiculos";
        self.setTitle = "Mis vehículos";
        self.html = "Mis vehículos";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Atrás";
        self.createBase();

        var columns = [
            {
                name: "id",
                label: "ID",
                visible: false
            },
            {
                name: "placa",
                label: "Placa"
            },
            {
                name: "marca_text",
                label: "Marca",
                mode: "Marca",
                visible: true
            },
            {
                name: "color",
                label: "Color",
                visible: false
            },
            {
                name: "modelo",
                label: "Modelo",
                visible: false
            },
            {
                name: "imagen_vehi",
                label: "Foto",
                mode: "phpthumb",
                visible: false
            },
            {
                name: "fecha_vencimiento_soat",
                label: "Soat",
                mode: "date_format",
                visible: false
            }
        ];
        self.setColumns(columns);

        self.buttons = [];
        self.buttons.push(
                {
                    icon: "material-icons add normal",
                    position: "top",
                    name: "nuevo",
                    label: "Nuevo",
                    callback: function () {
                        var d = new f_vehiculo();
                        d.construct(function () {
                            main.misVehiculos();
                        });
                    }
                }
        );
        self.applyFilters();
        self.show();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var sl = self.selectedRecord();
            var m = new nw.contextmenu(this, "bottom");//vertical, bottom
            m.addAction("Eliminar", "material-icons delete normal", function (e) {
                self.eliminar(sl);
            });
            m.addAction("Editar", "material-icons create normal", function (e) {
                var d = new f_vehiculo();
                d.construct(function () {
                    main.misVehiculos();
                });
                d.populate(sl);
            });
        },
        clicRow: function clicRow() {
            var self = this;
            var sl = self.selectedRecord();
            console.log(sl);
            var d = new f_vehiculo();
            d.construct(function () {
                main.misVehiculos();
            });
            d.populate(sl);
        },
        canvas: function canvas(canvas) {
            var self = this;
            self.canvas = canvas;
        },
        eliminar: function eliminar(data) {
            var self = this;
            nw.dialog("¿Desea eliminar este vehículo?", accept, cancel);
            function accept() {
                nw.loading({text: "Eliminando...", textVisible: true, html: "", theme: "b", "container": self.canvas});
                var rpc = new nw.rpc(self.getRpcUrl(), "vehiculo");
                rpc.setAsync(true);
                var func = function (r) {
                    nw.loadingRemove({"container": self.canvas});
                    nw.dialog("Eliminado correctamente");
                    main.misVehiculos();
                };
                rpc.exec("eliminarVehiculo", data, func);
            }
            function cancel() {

            }
        },
        applyFilters: function applyFilters() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            nw.loading({text: "Cargando visitas...", textVisible: true, html: "", theme: "b", "container": self.canvas});
            var data = {};
            data.id_usuario = up.id_usuario;
            data.list = true;
            data.filters = self.getFiltersData();
            var rpc = new nw.rpc(self.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            var func = function (r) {
                nw.loadingRemove({"container": self.canvas});
                self.setModelData(r);
            };
            rpc.exec("consulataVehiculos", data, func);
        }
    }
});