qx.Class.define("qxnw.basics.lists.l_traducciones_app", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: self.tr("Textos"),
                caption: "textos"
            },
            {
                label: self.tr("Idioma"),
                caption: "idioma"
            },
            {
                label: self.tr("Empresa"),
                caption: "empresa"
            },
            {
                label: self.tr("Activo"),
                caption: "activo"
            }
        ];
        self.setColumns(columns);

        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
//        self.ui.deleteButton.addListener("click", function () {
//            self.slotEliminar();
//        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
//        self.ui.unSelectButton.addListener("click", function () {
//            self.clearSelection();
//        });
//        self.ui.selectAllButton.addListener("click", function () {
//            self.selectAll();
//        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
//        self.ui.searchButton.addListener("execute", function () {
//            self.applyFilters();
//        });
//        self.ui.newButton.setEnabled(true);
//        self.ui.deleteButton.setEnabled(false);
        self.execSettings();
        self.applyFilters();
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                self.slotEditar();
            });
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nwMaker");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("applyFilters", r);
                self.setModelData(r);
            };
            rpc.exec("getTraducciones", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.basics.forms.f_traducciones_app();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.basics.forms.f_traducciones_app();
            if (!d.setParamRecord(r)) {
                qxnw.utils.alert("No se usó el setParamRecord");
                return;
            }
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        }
//        ,
//        slotEliminar: function slotEliminar() {
//            var self = this;
//            var r = self.selectedRecord();
//            if (r == undefined) {
//                qxnw.utils.alert("Seleccione un registro");
//                return;
//            }
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_usuarios");
//            rpc.exec("eliminar", r);
//            if (rpc.isError()) {
//                qxnw.utils.error(rpc.getError());
//                return;
//            }
//            self.removeSelectedRow();
//        }
    }
});