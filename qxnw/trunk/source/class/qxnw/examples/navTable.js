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
qx.Class.define("qxnw.examples.navTable", {
    extend: qxnw.navtable,
    construct: function() {
        this.base(arguments);
        var self = this;
         var col = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Money",
                caption: "money",
                type: "money"
            },
            {
                label: "Button",
                caption: "button",
                type: "button"
            },
            {
                label: "Ciudad",
                caption: "ciudad"
            },
            {
                label: "Pais",
                caption: "pais"
            },
            {
                label: "Imagen",
                caption: "imagen",
                type: "image",
                mode: "expand"
            },
            {
                label: "HTML",
                caption: "html",
                type: "html"
            },
            {
                label: "TextField",
                caption: "text_field",
                type: "textField",
                search: true,
                sortable: false,
                mode: "editable"
            },
            {
                label: "Date",
                caption: "date",
                type: "dateField",
                editable: true,
                required: true
            },
            {
                label: "Visible",
                caption: "visible",
                type: "checkBox",
                editable: true,
                mode: "editable"
            },
            {
                label: "selectTo",
                caption: "select_token_field",
                type: "selectTokenField",
                editable: true,
                method: "ciudades",
                search: true
            },
            {
                label: "selectBox",
                caption: "select_box",
                type: "selectBox",
                method: "ciudades",
                editable: true
            }
        ];
        self.setColumns(col);
        
        self.populate("master", "testListEdit");

        var fields = [
            {
                name: "Materiales",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "vertical"
            },
            {
                name: "select",
                label: "Select token",
                type: "selectTokenField",
                required: true
            },
            {
                name: "money",
                label: "MONEY",
                type: "textField",
                mode: "money",
                required: true
            },
            {
                name: "tokenField",
                label: "Token",
                type: "tokenField",
                required: true
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Mano obra",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "vertical"
            },
            {
                name: "proveedor",
                label: "Proveedor",
                type: "selectListCheck",
                width: 500
            },
            {
                name: "list_check",
                label: "List Check",
                type: "selectListCheck",
                required: true,
                width: 300
            },
            {
                name: "factura",
                label: "Factura",
                type: "button"
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.addFooterFields(fields);

        self.ui.factura.addListener("execute", function() {
            alert("test!");
        });
//        self.applyFilters();
    },
    members: {
        applyFilters: function applyFilters() {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "perfiles");
            rpc.setAsync(true);
            var func = function(r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", 0, func);
        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getAllData();
            console.log(data);
            return;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master", true);
            var func = function(e) {

            };
            rpc.exec("saveListEdit", data, func);
        }
    }
});