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
 * TextField with table
 */
qx.Class.define("qxnw.examples.listOracle", {
    extend: qxnw.lists,
    construct: function() {
        this.base(arguments);
        var self = this;
        var columns = [
            {
                label: "ID",
                caption: "ID"
            },
            {
                label: "NOMBRE",
                caption: "NOMBRE"
            }
        ];
        self.setColumns(columns);
        //self.setMaxHeight(350);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "N° caso",
                type: "textField"
            },
            {
                name: "fecha_inicial",
                caption: "fecha_inicial",
                label: "Fecha inicial",
                type: "dateField"
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: "Fecha final",
                type: "dateField"
            },
            {
                name: "fecha_time",
                caption: "fecha_time",
                label: "Fecha time",
                type: "dateTimeField"
            }
        ];
        self.createFilters(filters);

        self.ui.newButton.addListener("execute", function() {

            self.removeAllRows();
            return;
            self.addEmptyRow();
            //self.setCellEnabled(1, 1, true);
            //self.setCellEnabled(2, 3, false);
            //self.table.setFocusedCell(3, 0);
            //self.setCellEnabled(1, 1, true);
            //self.setCellEnabled(1, 3, false);
        });
        self.addListener("headerColInput", function(e) {
            var data = e.getData();
            var text = self.getHeaderColumnSearchByColId(data["col"]);
            text.setValue("");
            self.table.cleanFiltersOnList();
        });
        self.addListener("headerColKeyPress", function(e) {
            var data = e.getData();
            var text = self.getHeaderColumnSearchByColId(data["col"]);
            //var text = self.getHeaderColumnSearchByColName(data["col"]);
            text.setValue("");
            self.table.cleanFiltersOnList();
        });
        self.ui.updateButton.addListener("execute", function() {
            self.applyFilters();
        });
        self.ui.editButton.addListener("execute", function() {
            self.save();
        });
        self.ui.deleteButton.addListener("execute", function() {
            self.removeSelectedRow();
        });
        self.applyFilters();
        self.execPermissions();
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var sl = self.getSelectedRecord();
            if (typeof sl != 'undefined') {
                m.addAction("Editar", "icon/16/actions/document-properties.png", function(e) {
                    self.slotEditar();
                });
            }
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function(r) {
                self.setModelData(r);
            };
            rpc.exec("testOracle", data, func);
        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getAllData();
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master", true);
            var func = function(e) {

            };
            rpc.exec("saveListEdit", data, func);
        }
    }
});