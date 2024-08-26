/* ************************************************************************
 
 Copyright:
 2015 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
qx.Class.define("qxnw.nw_cron.l_cron", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setButtonsAutomatic(true);
        this.createBase();
        var columns = [
            {
                label: self.tr("ID"),
                caption: "id"
            },
            {
                label: self.tr("Descripción trabajo"),
                caption: "nombre"
            },
            {
                label: self.tr("Trabajo"),
                caption: "trabajo"
            },
            {
                label: self.tr("Minutos (0-59)"),
                caption: "horario"
            },
            {
                label: self.tr("Hora (0-23)"),
                caption: "horario"
            },
            {
                label: self.tr("Día del mes (0-31)"),
                caption: "horario"
            },
            {
                label: self.tr("Mes (0-11)"),
                caption: "horario"
            },
            {
                label: self.tr("Día de la semana (0-6)"),
                caption: "horario"
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            },
            {
                label: self.tr("Fecha"),
                caption: "fecha"
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            }
        ];

        self.setColumns(columns);

        self.hideColumn("id");
        self.hideColumn("empresa");

        var filters = [
            {
                name: "filtro",
                caption: "filtro",
                label: "Buscar...",
                type: "textField"
            }
        ];
        self.createFilters(filters);

        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.deleteButton.addListener("click", function () { //mensaje de eliminar 
            qxnw.utils.question("¿Está segur@ de eliminar el registro?", function (e) {
                if (e) {
                    self.slotEliminar();
                } else {
                    return;
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
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", qxnw.config.execIcon("document-properties"), function (e) {
                self.slotEditar();
            });
            m.addAction("Eliminar", qxnw.config.execIcon("dialog-close"), function (e) {
                qxnw.utils.question("¿Está segur@ de eliminar el registro?", function (e) {
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_cron", true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new qxnw.nw_cron.f_cronNe();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == 'undefined') {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_cron.f_cronNe();
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == 'undefined') {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_cron", true);
            var func = function () {
                self.removeSelectedRecord();
            };
            rpc.exec("eliminar", r.id, func);
        }
    }
});