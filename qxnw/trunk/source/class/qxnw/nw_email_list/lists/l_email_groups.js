qx.Class.define("qxnw.nw_email_list.lists.l_email_groups", {
    extend: qxnw.lists,
    construct: function() {
        var self = this;
        this.base(arguments);
        self.setButtonsAutomatic(true);
        self.createBase();
        self.hideTools();
        self.setAllPermissions(true);
        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Usuario",
                caption: "usuario"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Email",
                caption: "email"
            },
            {
                label: "Empresa",
                caption: "empresa"
            }];
        self.setColumns(columns);
        self.hideColumn("id");
        self.hideColumn("usuario");
        self.hideColumn("empresa");
    },
    destruct: function() {
    },
    members: {
        group: null,
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function(e) {
                qxnw.utils.question("¿Está seguro de eliminar el registro?", function(e) {
                    if (e) {
                        self.slotEliminar();
                    }
                });
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters(group) {
            var self = this;
            if (typeof group == 'undefined') {
                group == 0;
            }
            self.group = group;
            var data = {
                group: group
            };
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "email");
            rpc.setAsync(true);
            var func = function(r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            r["grupo"] = self.group;
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "email");
            rpc.setAsync(true);
            var func = function() {
                self.applyFilters(self.group);
            };
            rpc.exec("deleteUserFromGroup", r, func);
        }
    }
});