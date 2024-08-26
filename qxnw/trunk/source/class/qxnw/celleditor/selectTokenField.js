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
 * List style and all functionality for your lists. You can create a <code>list</code> very fast!
 */
qx.Class.define("qxnw.celleditor.selectTokenField", {
    extend: qx.core.Object,
    implement: qx.ui.table.ICellEditorFactory,
    properties: {
        /**
         * function that validates the result
         * the function will be called with the new value and the old value and is
         * supposed to return the value that is set as the table value.
         **/
        validationFunction: {
            check: "Function",
            nullable: true,
            init: null
        },
        /** array of data to construct ListItem widgets with */
        listData: {
            check: "Array",
            init: null,
            nullable: true
        }

    },
    events: {
        "setModelDataSTF": "qx.event.type.Data"
    },
    members: {
        __enabled: true,
        setEnabled: function setEnabled(bool) {
            this.__enabled = bool;
        },
        // interface implementation
        createCellEditor: function (cellInfo) {
            var cellEditor = new qxnw.widgets.selectTokenField();
            var value = cellInfo.value;

            cellEditor.setEnabled(this.__enabled);

            if (typeof value != 'undefined') {
                if (value != null) {
                    if (typeof value.id != 'undefined') {
                        if (value.id != null) {
                            if (value.id != '') {
                                var token = {};
                                token["id"] = value.id;
                                token["nombre"] = typeof value.name != 'undefined' ? value.name : 'n/a';
                                cellEditor.addToken(token);
                                cellEditor.tabFocus();
                            }
                        }
                    }
                }
            }

            cellEditor.originalValue = value;
            var method = cellInfo.table.getMethod(cellInfo.col);
            if (method != null) {
                method = method.split(".");
                if (typeof method[1] != 'undefined') {
                    cellEditor.addListener("loadData", function (e) {
                        var data = {};
                        data["token"] = e.getData();
                        var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method[0]);
                        rpc.setAsync(true);
                        var func = function (r) {
                            cellEditor.setModelData(r);
                            var d = {};
                            d["widget"] = cellEditor;
                            d["data"] = r;
                            d["column"] = cellInfo.col;
                            d["row"] = cellInfo.row;
                            cellInfo.table.fireDataEvent("setModelDataSTF", d);
                        };
                        rpc.exec(method[1], data, func);
                    }, cellEditor);
                } else {
                    cellEditor.addListener("loadData", function (e) {
                        var data = {};
                        data["text"] = e.getData();
                        var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
                        rpc.setAsync(true);
                        var func = function (r) {
                            cellEditor.setModelData(r);
                            var d = {};
                            d["widget"] = cellEditor;
                            d["data"] = r;
                            d["column"] = cellInfo.col;
                            d["row"] = cellInfo.row;
                            cellInfo.table.fireDataEvent("setModelDataSTF", d);
                        };
                        rpc.exec("populateTokenField", {table: method[0], text: data["text"]}, func);
                    }, cellEditor);
                }
            }
            var hiddenColumns = cellInfo.table.getHiddenColumns(cellInfo.col);
            if (typeof hiddenColumns != 'undefined' && hiddenColumns != null && hiddenColumns != '') {
                var hiddenColumnsExpl = hiddenColumns.split(",");
                for (var i = 0; i < hiddenColumnsExpl.length; i++) {
                    cellEditor.hideColumn(hiddenColumnsExpl[i]);
                }
            }
            cellEditor.addListener("addItem", function (e) {
                var d = cellEditor.getValue();
                var rta = {};
                if (typeof d[0] == 'undefined') {
                    rta["id"] = null;
                    rta["options"] = null;
                    rta["name"] = null;
                } else {
                    rta["id"] = d[0]["id"];
                    rta["options"] = d[0];
                    rta["name"] = d[0]["nombre"];
                }
                var data = {
                    data: e.getData(),
                    value: rta,
                    oldValue: e.getOldData(),
                    type: "selectTokenField",
                    col: cellInfo.col,
                    row: cellInfo.row,
                    widget: this
                };
                cellInfo.table.fireDataEvent("editCell", data);
            });
            return cellEditor;
        },
        // interface implementation
        getCellEditorValue: function (cellEditor) {
            var rta = {};
            var arr = cellEditor.getValue();
            if (typeof arr[0] == 'undefined') {
                rta["id"] = null;
                rta["options"] = null;
                rta["name"] = null;
            } else {
                rta["id"] = arr[0]["id"];
                rta["options"] = arr[0];
                rta["name"] = arr[0]["nombre"];
            }
            return rta;
        }
    }
});