nw.Class.define("l_navtable_preoperacional_otros_documentos", {
    extend: nw.lists,
    construct: function (canvas, datos) {
        var self = this;
        self.id_form = "l_navtable_preoperacional_otros_documentos";
        self.showContextMenu = true;
        self.setTitle = "Otros Documentos preoperacional";
        self.canvas = canvas;
        self.datos = datos;
        var columns = [
            {
                label: "ID",
                name: "id",
                visible: false

            },
            {
                label: "Documento Adjunto url ",
                name: "adjunto",
                visible: true
            },
            {
                style: {contenedor: "display: flex;"},
                label: "Documento:::  ",
                name: "adjunto_show",
                visible: true,
                type: "image"
            }
        ];
        self.setColumns(columns);
        self.applyFilters();
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
            console.log("data", data);
            var rpc = new nw.rpc(self.getRpcUrl(), "preoperacional");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("documentos", r);
                for (var i = 0; i < r.length; i++) {
                    var row = r[i];
                    row.adjunto = config.domain_rpc + row.adjunto;
                }
                self.setModelData(r);
            };
            rpc.exec("consultaPreoperacionalDocumentos", data, func);
        }
    }
});