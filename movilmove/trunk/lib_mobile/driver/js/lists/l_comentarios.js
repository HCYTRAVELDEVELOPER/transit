nw.Class.define("l_comentarios", {
    extend: nw.lists,
    construct: function () {
        var self = this;
        self.showContextMenu = false;
        self.id = "l_comentarios";
        self.setTitle = "Comentarios";
        self.html = "Comentarios";
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
                name: "puntaje",
                label: "Puntaje"
            },
            {
                name: "comentarios",
                label: "Comentario"
            }
        ];
        self.setColumns(columns);
        self.applyFilters();
        self.show();
    },
    destruct: function () {
    },
    members: {
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
        applyFilters: function applyFilters() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            nw.loading({text: "Cargando...", textVisible: true, html: "", theme: "b", "container": self.canvas});
            var data = {};
            data.usuario = up.usuario;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            var func = function (r) {
                nw.loadingRemove({"container": self.canvas});
                self.setModelData(r);
            };
            rpc.exec("consulataMisComentarios", data, func);
        }
    }
});