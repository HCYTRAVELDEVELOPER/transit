/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on alexf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.dev.desarrollo3", {
    extend: qx.core.Object,
    statics: {
        test: function test(parent) {
            
            return;
            
            var f = new informes.forms.f_diagnosticos();
            f.show();
            return;

            var f = new qxnw.forms();
            var fields = [
                {
                    name: "select",
                    type: "selectBox",
                    label: "Selectbox"
                },
                {
                    name: "address",
                    type: "address",
                    label: "Address Widget"
                },
                {
                    name: "date",
                    type: "dateField",
                    label: "Date"
                },
                {
                    name: "numeric",
                    mode: "md5",
                    type: "textField",
                    label: "Numeric",
                    required: true
                },
                {
                    name: "timeField",
                    type: "timeField",
                    label: "Timefield"
                },
                {
                    name: "dateFieldTime",
                    type: "dateTimeField",
                    label: "Datefield Time"
                },
                {
                    name: "uploader_multiple",
                    type: "uploader_multiple",
                    label: "Uploader múltiple",
                    mode: "rename"
                },
                {
                    name: "test",
                    type: "selectListCheck",
                    label: "text",
                    toolTip: "prueba de tooltip!"
                },
                {
                    name: "test_token",
                    type: "selectTokenField",
                    label: "Select Token Field"
                },
                {
                    name: "money", type: "textField",
                    label: "money",
                    mode: "money",
                    toolTip: "prueba de tooltip!"
                },
                {
                    name: "ciudad",
                    label: "uploader",
                    type: "uploader",
                    mode: "rename_random"
                }
            ];
            f.setFields(fields);
            qxnw.utils.populateSelectAsync(f.ui.select, "master", "populate", {table: "ciudades"});
            f.ui.money.addListener("focusout", function() {
                console.log("out!");
            });
            var data = [];
            data["nombre"] = "test";
            data["id"] = "test";
            f.ui.test.addToken(data);
            var d = [];
            d["nombre"] = "dertd";
            d["id"] = "dertd";
            f.ui.test.addToken(d);
            f.ui.test_token.addListener("loadData", function(e) {
                var data = {};
                data["token"] = e.getData();
                var rpc = new qxnw.rpc(f.getRpcUrl(), "ciudades", true);
                rpc.setAsync(true);
                var func = function(r) {
                    f.ui.test_token.setModelData(r);
                };
                rpc.exec("populateTokenCiudades", data, func);
            }, this);
            var data = {};
            data["table"] = "usuarios";
            f.ui.test.populate("master", "populate", data);
            f.show();

            f.ui.accept.addListener("execute", function() {
                if (!f.validate()) {
                    return;
                }
                console.log(f.getRecord());
            });
            f.ui.cancel.addListener("execute", function() {
                f.reject();
            });

            var nav = new qxnw.navtable();
            var col = [
                {
                    caption: "id",
                    label: "ID"
                },
                {
                    caption: "usuario",
                    label: "Usuario"
                }
            ];
            nav.setColumns(col);
            f.insertNavTable(nav.getBase(), "NavTable");
            nav.populate("master", "populate", {table: "usuarios"});
            return;

            var l = new qxnw.examples.listEdit();
            l.show();
            return;

            parent.slotNWModulos();

            return;

            var l = new qxnw.examples.tree();
            l.show();
            return;

            //qxnw.utils.enableMouse(); 
            var f = new nwsa.forms.f_modify_firewall();
            f.show();
            return;
            var f = new qxnw.forms();
            f.createFromTable("nwmail_users");
            f.show();
            return;
            var f = new qxnw.forms();
            f.serialField("id");
            f.setTableMethod("master");
            f.createFromTable("afiliadoras");
            f.setTitle("navTable test");
            f.show();
        }
    }
});