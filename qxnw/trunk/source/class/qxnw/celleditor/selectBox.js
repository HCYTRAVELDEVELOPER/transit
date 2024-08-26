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
 * A cell editor factory creating select boxes.
 */
qx.Class.define("qxnw.celleditor.selectBox", {
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
            var cellEditor = new qxnw.fields.selectBox().set({
                appearance: "table-editor-selectbox"
            });

            cellEditor.setEnabled(this.__enabled);

            cellEditor.setUserData("enabled", this.__enabled);

            cellEditor.setValue = function (value) {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getModel() == value) {
                        this.setSelection([items[i]]);
                    }
                }
                return true;
            };
            //cellEditor.setUserData("name", name);
            cellEditor.getValue = function () {
                var data = {};
                if (!this.isSelectionEmpty()) {
                    var selectModel = this.getSelection()[0].getModel();
                    var selectText = this.getSelection()[0].getLabel();
                    data["id"] = selectModel;
                    data["text"] = selectText;
                    this.setUserData("val", data["id"]);
                } else {
                    return "";
                }
                return data;
            };

            cellEditor.addListener("changeSelection", function (e) {
                var data = {
                    data: e.getData(),
                    col: cellInfo.col,
                    row: cellInfo.row,
                    widget: this,
                    type: "selectBox",
                    value: this.getValue()
                };
                cellInfo.table.fireDataEvent("editCell", data);
            });
            cellEditor.addListener("focusout", function (e) {
                var data = {
                    col: cellInfo.col,
                    row: cellInfo.row,
                    widget: this,
                    type: "selectBox",
                    value: this.getValue()
                };
                cellInfo.table.fireDataEvent("focusoutInput", data);
            });

            var value = cellInfo.value;
            cellEditor.originalValue = value;

            // check if renderer does something with value
            var cellRenderer = cellInfo.table.getTableColumnModel().getDataCellRenderer(cellInfo.col);
            var label = cellRenderer._getContentHtml(cellInfo);
            if (value != label) {
                //value = label;
            }

            // replace null values
            if (value === null) {
                value = "";
            }
            var method = cellInfo.table.getMethod(cellInfo.col, cellInfo.row);
            var df = 0;
            //TODO: SE QUITA PARA QUE FUNCIONE EN NAVTABLES
            //value = cellInfo.value;
            if (typeof value != 'undefined') {
                if (value != null) {
                    if (typeof value.id != 'undefined') {
                        if (value.id != null) {
                            if (value.id != '') {
                                df = value.id;
                            }
                        }
                    }
                }
            }
            if (method != null) {
                method = method.split(".");
                if (typeof method[1] != 'undefined') {
                    if (method[0] == "array") {
                        var arr = {};
                        var f = method[1].split(":");
                        for (var iz = 0; iz < f.length; iz++) {
                            arr[f[iz]] = f[iz];
                        }
                        qxnw.utils.populateSelectFromArray(cellEditor, arr);
                    } else {
                        var pr = {};
                        pr.row = cellInfo.table.getTableModel().getRowDataAsMap(cellInfo.row);
                        pr.value = value;

                        var haveWhere = false;

                        if (typeof cellInfo.table.getSelectWhere != 'undefined') {
                            var w = cellInfo.table.getSelectWhere(cellInfo.col, cellInfo.row);
                            if (typeof w != 'undefined') {
                                if (w != null) {
                                    if (w != "") {
                                        pr.where = w;
                                        haveWhere = true;
                                    }
                                }
                            }
                        }

                        if (typeof method[3] != 'undefined') {
                            pr.order = method[3];
                        }

                        if (typeof method[2] != 'undefined') {
                            pr["table"] = method[2];
                            if (haveWhere) {
                                qxnw.utils.populateSelectAsync(cellEditor, method[0], method[1], pr, 0, df, cellInfo.row);
                            } else {
                                qxnw.utils.populateSelectAsyncRecorder(cellEditor, method[0], method[1], pr, 0, df, cellInfo.row);
                            }
                        } else {
                            if (haveWhere) {
                                qxnw.utils.populateSelectAsync(cellEditor, method[0], method[1], pr, 0, df);
                            } else {
                                qxnw.utils.populateSelectAsyncRecorder(cellEditor, method[0], method[1], pr, 0, df);
                            }
                        }
                    }
                } else {
                    var data = {};
                    data["table"] = method[0];
                    if (this.__enabled) {
                        qxnw.utils.populateSelectAsyncRecorder(cellEditor, "master", "populate", data, 0, df, cellInfo.row);
                    }
                }
            }

            cellEditor.addListener("appear", function () {
                try {
                    if (this.getUserData("enabled")) {
                        cellEditor.open();
                        var timer = new qx.event.Timer(500);
                        timer.start();
                        timer.addListener("interval", function (e) {
                            this.stop();
                            cellEditor.getChildControl("list").activate();
                            cellEditor.getChildControl("list").addListener("keypress", function (d) {
                                var k = d.getKeyIdentifier();
                                if (k == "Enter" || k == "Escape") {
                                    var selection = cellEditor.getChildControl("list").getSelection();
                                    if (selection.length > 0) {
                                        cellEditor.setSelection(selection);
                                    }
                                    cellEditor.close();
                                    var data = {
                                        data: "",
                                        col: cellInfo.col,
                                        row: cellInfo.row,
                                        widget: this,
                                        type: "selectBox",
                                        value: cellEditor.getValue()
                                    };
                                    cellInfo.table.fireDataEvent("editCell", data);
//                                    cellInfo.table.stopEditing();
                                }
                            });
                        });
                    }
                } catch (e) {
                    qxnw.utils.error(e);
                }
            });

            return cellEditor;
        },
        //overriden
        open: function () {
            try {
                var popup = this.getChildControl("popup");
                if (popup == null) {
                    return;
                }
                popup.placeToWidget(this, true);
                popup.show();
            } catch (e) {

            }
        },
        // interface implementation
        getCellEditorValue: function getCellEditorValue(cellEditor) {
            var value = cellEditor.getValue();
            value["name"] = value["text"];
            return value;
        }
    }
});