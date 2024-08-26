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
qx.Class.define("qxnw.celleditor.tokenField", {
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
    members: {
        __enabled: true,
        setEnabled: function setEnabled(bool) {
            this.__enabled = bool;
        },
        // interface implementation
        createCellEditor: function (cellInfo) {

            var cellEditor = new qxnw.tokenField();
            cellEditor.setSelectionMode('single');
            cellEditor.setEnabled(this.__enabled);
            var value = cellInfo.value;

            cellEditor.originalValue = value;

            var method = cellInfo.table.getMethod(cellInfo.col);
            if (method != null) {
                method = method.split(".");
                cellEditor.addListener("loadData", function (e) {
                    var data = {};
                    data["token"] = e.getData();
                    var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method[0]);
                    rpc.setAsync(true);
                    var func = function (r) {
                        cellEditor.populateList(data["token"], r);
                    };
                    rpc.exec(method[1], data, func);
                }, cellEditor);
            }

            cellEditor.addListener("addItem", function (e) {
                var data = {
                    data: e.getData(),
                    col: cellInfo.col,
                    row: cellInfo.row,
                    type: "tokenField",
                    widget: this
                };
                cellInfo.table.fireDataEvent("editCell", data);
            });
            if (typeof value != 'undefined') {
                if (value != null) {
                    if (typeof value.id != 'undefined') {
                        if (value.id != null) {
                            if (value.id != '') {
                                var token = {};
                                token["id"] = value.id;
                                token["nombre"] = typeof value.name != 'undefined' ? value.name : 'n/a';
                                cellEditor.addToken(token, true);
                            }
                        }
                    }
                }
            }
            return cellEditor;
        },
        // interface implementation
        getCellEditorValue: function (cellEditor) {
            var data = {};
            if (typeof cellEditor.getSelection()[0] == "undefined") {
                data["id"] = null;
                data["nombre"] = null;
                data["name"] = null;
            } else {
                data["id"] = qx.util.Serializer.toNativeObject(cellEditor.getSelection()[0].getModel()).id;
                data["nombre"] = cellEditor.getSelection()[0].getLabel();
                data["name"] = cellEditor.getSelection()[0].getLabel();
            }
            return data;
        }
    }
});