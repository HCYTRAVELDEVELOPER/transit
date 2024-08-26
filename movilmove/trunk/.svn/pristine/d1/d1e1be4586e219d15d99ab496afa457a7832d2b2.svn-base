nw.Class.define("l_navtable_agregar_imagenes", {
    extend: nw.lists,
    construct: function (canvas, datos, type) {
        var self = this;
        self.id_form = "l_navtable_agregar_imagenes";
        self.showContextMenu = true;
        self.setTitle = "Otras imágenes";
        self.canvas = canvas;
        self.datos = datos;
        self.type = type;
        var columns = [
            {
                label: "",
                name: "imagen",
                visible: false
            },
            {
                label: "",
                name: "imagen_show",
                visible: true,
                type: "image"
            }
        ];
        self.setColumns(columns);
        if (nw.evalueData(self.type) && self.type == "ADJUNTOS_VIAJE") {
            self.showContextMenu = false;
            self.applyFilters();
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
            var typemenu = "bottom"; //normal
            var m = new nw.contextmenu(this, typemenu); //vertical, bottom
            if (!nw.evalueData(data.id)) {
                m.addAction("Quitar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                    self.eliminar();
                });
            }
        },
        eliminar: function eliminar() {
            var self = this;
            var data = self.selectedRecord();
            console.log("data", data);
            self.removeRow(self.activeRow);
//            self.onRemoveNavRow();
//            nw.dialog("¿Esta seguro de eliminar este documento?", function () {
//                var up = nw.userPolicies.getUserData();
//                data.conductor = up.usuario;
//                data.empresa = up.empresa;
//                var rpc = new nw.rpc(self.getRpcUrl(), "vehiculo");
//                rpc.setAsync(true);
//                var func = function (r) {
//                    self.applyFilters(r);
//                };
//                rpc.exec("borrarDocumento", data, func);
//            }, function () {});
        },
        applyFilters: function applyFilters() {
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
            data.id_service_initial = self.datos.id_service_initial;
            var met = "preoperacional";
            var fun = "consultaPreoperacionalDocumentos";
            if (nw.evalueData(self.type) && self.type == "ADJUNTOS_VIAJE") {
                met = "addPhotos";
                fun = "consultaFotosViaje";
            }
            console.log("l_navtable_agregar_imagenes:::data", data);
            console.log("l_navtable_agregar_imagenes:::met", met);
            console.log("l_navtable_agregar_imagenes:::fun", fun);
            var rpc = new nw.rpc(self.getRpcUrl(), met);
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("l_navtable_agregar_imagenes:::responseServer", r);
                for (var i = 0; i < r.length; i++) {
                    var row = r[i];
                    row.imagen_show = config.domain_rpc + row.imagen;
                }
                console.log("documentos", r);
                self.setModelData(r);
            };
            rpc.exec(fun, data, func);
        }
    }
});