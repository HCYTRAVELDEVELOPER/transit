/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
/**
 * Manage a special way to create all forms in your application
 */
qx.Class.define("qxnw.nw_notifications.manage", {
    extend: qxnw.lists,
    construct: function construct() {
        var self = this;
        this.base(arguments);
        this.setButtonsAutomatic(true);
        this.createBase();
        var columns = [
            {
                label: "id",
                caption: "id"
            },
            {
                label: "Texto",
                caption: "texto",
                type: "textArea"
            },
            {
                label: "Adjunto",
                caption: "uploader"
            },
            {
                label: "Enviar por correo",
                caption: "enviar_por_correo",
                type: "checkBox"
            },
            {
                label: "Prioridad",
                caption: "prioridad"
            },
            {
                label: "Tipo",
                caption: "tipo"
            },
            {
                label: "Acción",
                caption: "accion"
            },
            {
                label: "Fecha inicial",
                caption: "fecha"
            },
            {
                label: "Fecha final",
                caption: "fecha_final"
            },
            {
                label: "Usuario",
                caption: "usuario"
            }
        ];
        self.setColumns(columns);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Filtro...",
                type: "textField"
            }];
        self.createFilters(filters);
        self.ui.newButton.addListener("click", function() {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("click", function() {
            self.slotEliminar();
        });
        self.ui.editButton.addListener("click", function() {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("click", function() {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function() {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function() {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function() {
            self.applyFilters();
        });
        self.setAllPermissions(true);
        self.execSettings();
    },
    destruct: function() {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function(e) {
                self.slotEditar();
            });
            m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function(e) {
                qxnw.utils.question("¿Está seguro de eliminar el registro?", function(e) {
                    if (e) {
                        self.slotEliminar();
                    } else {
                        return;
                    }
                });
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_notifications");
            rpc.setAsync(true);
            var func = function(r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var f = new qxnw.nw_notifications.f_newEdit();
            f.settings.accept = function() {
                self.applyFilters();
            };
            f.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_notifications.f_newEdit();
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function() {
                self.applyFilters();
            };
            d.show();
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_notifications");
            rpc.setAsync(true);
            var func = function() {
                self.removeSelectedRow();
            };
            rpc.exec("delete", r, func);
        }
    }

});