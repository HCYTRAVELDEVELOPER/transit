nw.Class.define("l_navtable_tareas_adicionales", {
    extend: nw.lists,
    construct: function (canvas, datos) {
        var self = this;
        self.id_form = "l_navtable_tareas";
        self.setTitle = "Tareas Adicionales";
        self.canvas = canvas;
        self.datos = datos;
        console.log(self.datos);
        console.log(self.canvas);

        var columns = [
            {
                name: "id",
                label: "ID",
                visible: false
            },
            {
                name: "caracteristicas",
                label: "Nueva tarea",
//                style: {contenedor: "background: #d1c9c9;"}
            }
        ];
        self.setColumns(columns);
        self.clicRow = function () {
            var data = self.selectedRecord();
            console.log(data);
        };
        $("#l_navtable_tareas").css("cssText", "width:95%;");
//        $("#l_navtable_tareas.rowlist").css("cssText", "background: #d1c9c9!important;");
        self.applyFilters();
        return self;
    },
    destruct: function () {
    },
    members: {
        applyFilters: function applyFilters(id_enc) {
            var self = this;
//            var up = nw.userPolicies.getUserData();
            var data = {};
            console.log(data);
            data.id_service = self.datos.id;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log(r);
                self.setModelData(r);
            };
            rpc.exec("adicionalesServicioApp", data, func);
        }
    }
});