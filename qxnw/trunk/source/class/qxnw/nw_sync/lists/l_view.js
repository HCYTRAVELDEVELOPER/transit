qx.Class.define("qxnw.nw_sync.lists.l_view", {
    extend: qxnw.lists,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.setButtonsAutomatic(true);
        self.createBase();
        var columns = [
            {
                label: "Data",
                caption: "data"
            }
        ];

        self.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                label: "Filtro...",
                type: "textField"
            }];
        self.createFilters(filters);
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("click", function () { //mensaje de eliminar 
            qxnw.utils.question("¿Está seguro de eliminar el registro?", function (e) {
                if (e) {
                    self.slotEliminar();
                }
            });
        });

        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("click", function () {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
        self.setAllPermissions(true);
    },
    destruct: function () {
    },
    members: {
        enc: null,
        setEnc: function setEnc(enc) {
            this.enc = enc;
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_exp");
            rpc.setAsync(true);
            var func = function (r) {
                var columns = [];
                for (var i = 0; i < r.records.length; i++) {
                    for (var v in r.records[i]) {
                        var z = {};
                        z["caption"] = v;
                        z["label"] = v;
                        columns.push(z);
                    }
                    break;
                }
                self.setColumns(columns);
                self.setModelData(r);
            };
            rpc.exec("getQueryById", self.enc, func);
        }
    }
});