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
qx.Class.define("qxnw.examples.listSQLServer", {
    extend: qxnw.lists,
    construct: function () {
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
        self.ui.updateButton.addListener("execute", function () {
            self.applyFilters();
        });
//        self.applyFilters();
    },
    members: {
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                self.setModelData(r);
            };
            rpc.exec("testSQLServer", data, func);
        }
    }
});