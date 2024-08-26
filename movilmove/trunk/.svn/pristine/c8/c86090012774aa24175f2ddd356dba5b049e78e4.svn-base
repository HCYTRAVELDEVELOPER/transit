nw.Class.define("l_tarjetas_credito", {
    extend: nw.lists,
    construct: function (callback) {
        var self = this;
        self.showContextMenu = true;
//        var self = new nw.lists();
        self.id = "l_tarjetas_credito";
        self.setTitle = "Pagos";
        self.html = "Mis tarjetas de crédito";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Atrás";
        self.createBase();
        self.callback = callback;

        var columns = [
            {
                name: "nombre",
                label: ""
            }
        ];
        self.setColumns(columns);
        self.buttons = [];
        self.buttons.push(
                {
                    icon: "material-icons add_circle normal",
                    position: "top",
                    name: "nuevo",
                    label: "Añadir nuevo",
                    callback: function () {
                        var d = new f_tarjetas_credito();
                        d.construct();
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
            if (!nw.evalueData(self.callback)) {
                m.addAction("Eliminar", "material-icons delete normal", function (e) {
                    self.eliminar(sl);
                });
            }
        },
        clicRow: function clicRow() {
            var self = this;
            var sl = self.selectedRecord();
            if (nw.evalueData(self.callback)) {
                self.callback(sl);
            }
        },
        eliminar: function eliminar(data) {
            var self = this;
            nw.dialog("¿Desea eliminar este registro?", accept, cancel);
            function accept() {
                nw.loading({text: "Eliminando...", textVisible: true, html: "", theme: "b", "container": self.canvas});
                var rpc = new nw.rpc(self.getRpcUrl(), "nwMaker");
                rpc.setAsync(true);
                var func = function (r) {
                    nw.loadingRemove({"container": self.canvas});
                    nw.dialog("Eliminado correctamente");
                    var d = new l_tarjetas_credito();
                    d.construct();
                };
                rpc.exec("eliminarCreditCard", data, func);
            }
            function cancel() {

            }
        },
        applyFilters: function applyFilters() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            nw.loading({text: "Cargando visitas...", textVisible: true, html: "", theme: "b", "container": self.canvas});
            var data = {};
            data.usuario = up.usuario;
            var rpc = new nw.rpc(self.getRpcUrl(), "nwMaker");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                nw.loadingRemove({"container": self.canvas});
                self.setModelData(r);
            };
            rpc.exec("myCreditsCards", data, func);
        }
    }
});