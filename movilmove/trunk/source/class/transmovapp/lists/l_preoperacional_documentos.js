qx.Class.define("transmovapp.lists.l_preoperacional_documentos", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: self.tr("ID"),
                caption: "id"
            },
            {
                label: self.tr("Adjunto"),
                caption: "adjunto",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: self.tr("Observaciones"),
                caption: "observaciones"
            }
        ];
        self.setColumns(columns);

        self.table.setRowHeight(50);
//        self.hideColumn("usuario");

        var filters = [
            {
                name: "buscar",
                label: self.tr("Buscar..."),
                type: "textField"
            }
        ];
        self.createFilters(filters);

//        self.ui.editButton.addListener("click", function () {
//            self.slotEditar();
//        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
//        self.execSettings();
//        self.applyFilters();

    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            this.t = t;
            var t = self.t;
            var data = self.selectedRecord();
            var m = new qxnw.contextmenu(this);
            var up = qxnw.userPolicies.getUserData();
//            m.addAction("Eliminar", "icon/16/actions/dialog-close.png", function (e) {
//                self.slotEliminar(data);
//            });
            m.exec(pos);
        },
        applyFilters: function applyFilters(pr) {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            data.id = pr.id;
            var rpc = new qxnw.rpc(this.rpcUrl, "preoperacional");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("r", r);
                self.setModelData(r);
            };
            rpc.exec("consultaPreoperacionalDocumentos", data, func);
        }
    }
});