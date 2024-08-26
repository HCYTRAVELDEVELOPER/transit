nw.Class.define("l_navtable_otros_documentos", {
    extend: nw.lists,
    construct: function (canvas, datos) {
        var self = this;
        self.id_form = "l_navtable_otros_documentos";
        self.showContextMenu = true;
        self.setTitle = "Otros Documentos";
        self.canvas = canvas;
        self.datos = datos;
//        console.log(self.datos);
        console.log(self.canvas);
        var columns = [
            {
                label: "ID",
                name: "id",
                visible: false

            },
            {
                style: {contenedor: "display: flex;"},
                label: "Documento Adjunto: ",
                name: "adjunto",
                visible: true,
                type: "image"
            },
            {
                label: "Nombre Documento",
                name: "nombre",
                visible: true
            },
            {
                label: "Fecha",
                name: "fecha",
                visible: true
            },
            {
                label: "Usuario",
                name: "usuario"
            }
        ];
        self.setColumns(columns);
        self.clicRow = function () {
            var data = self.selectedRecord();
            console.log(data);
        };
//        $("#l_navtable_otros_documentos").css("cssText", "width:95%;");
//        $("#l_navtable_otros_documentos").css("cssText", "width:95%;");
//        $("#l_navtable_tareas.rowlist").css("cssText", "background: #d1c9c9!important;");
        self.applyFilters();
        return self;
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu() {
            var self = this;
            var typemenu = "bottom"; //normal
            var m = new nw.contextmenu(this, typemenu); //vertical, bottom
            m.addAction("Eliminar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                self.eliminar();
            });
        },
        eliminar: function eliminar() {
            var self = this;
            nw.dialog("¿Esta seguro de eliminar este documento?", function () {
                var up = nw.userPolicies.getUserData();
                var data = self.selectedRecord();
                data.conductor = up.usuario;
                data.empresa = up.empresa;
                var rpc = new nw.rpc(self.getRpcUrl(), "vehiculo");
                rpc.setAsync(true);
                var func = function (r) {
                    self.applyFilters(r);
                };
                rpc.exec("borrarDocumento", data, func);
            }, function () {});
        },
        applyFilters: function applyFilters() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            console.log(up);
            data.conductor = up.usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(self.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log(r);
//                nw.loadingRemove({"container": self.canvas});
                for (var i = 0; i < r.length; i++) {
                    var row = r[i];
                    row.adjunto = config.domain_rpc + row.adjunto;
                }
                self.setModelData(r);
            };
            rpc.exec("populateDocumentos_otros", data, func);
        }
    }
});