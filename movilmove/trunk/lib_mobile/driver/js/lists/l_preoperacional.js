nw.Class.define("l_preoperacional", {
    extend: nw.lists,
    construct: function () {
        var self = this;
        self.configCliente = main.configCliente;
        self.showContextMenu = true;
        self.id = "l_preoperacional";
        self.setTitle = nw.tr("Pre-operacional");
        self.html = nw.tr("Pre-operacional");
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Volver";
        self.createBase();

        var columns = [
            {
                name: "id",
                label: "ID",
                visible: false
            },
            {
                name: "fecha",
                label: "Fecha"
            },
            {
                name: "marca",
                label: "Marca"
            },
            {
                name: "tipo",
                label: "Tipo"
            },
            {
                name: "placa",
                label: "Placa"
            },
            {
                name: "modelo",
                label: "Modelo"
            },
            {
                name: "observaciones",
                label: "Observaciones"
            }
        ];
        self.setColumns(columns);
//        if (config.preoperacional_obligatorio !== true) {
        /*
         self.buttons = [];
         self.buttons.push(
         {
         icon: "material-icons add normal",
         position: "top",
         name: "nuevo",
         label: "",
         callback: function () {
         var da = new f_preoperacional();
         da.construct(self);
         }
         }
         );
         */
//        }
        self.show();

        self.onAppear(function () {
            setTimeout(function () {
                self.applyFilters();
            }, 100);
        });
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var sl = self.selectedRecord();
            var m = new nw.contextmenu(this, "bottom");//vertical, bottom
            m.addAction("Ver Pre-operacional", "material-icons create normal", function (e) {
                var da = new f_preoperacional();
                da.construct(self, sl);
                da.populate(sl);
                da.disabledAll();
                setTimeout(function () {
                    document.querySelector(".f_preoperacional .aceptar").remove();
                }, 1000);
            });
        },
        clicRow: function clicRow() {
            var self = this;
//            var sl = self.selectedRecord();
//            var d = new f_preoperacional();
//            d.construct(self, sl);
//            d.populate(sl);
//            d.disabledAll();
//            setTimeout(function () {
//                document.querySelector(".f_preoperacional .aceptar").remove();
//            }, 1000);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var up = nw.userPolicies.getUserData();
//            nw.loading({text: "Cargando...", textVisible: true, html: "", theme: "b", "container": self.canvas});
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(self.getRpcUrl(), "preoperacional");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log(r);
//                nw.loadingRemove({"container": self.canvas});
                self.setModelData(r);
            };
            rpc.exec("consultaPreoperacionalApp", data, func);
        }
    }
});