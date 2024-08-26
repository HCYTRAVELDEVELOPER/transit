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
 * For editing boolean data in a checkbox. It is advisable to use this in
 * conjunction with {@link qx.ui.table.cellrenderer.Boolean}.
 */
qx.Class.define("qxnw.celleditor.dateField", {
    extend: qx.core.Object,
    implement: qx.ui.table.ICellEditorFactory,
    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members: {
        __enabled: true,
        setEnabled: function setEnabled(bool) {
            this.__enabled = bool;
        },
        // interface implementation
        createCellEditor: function (cellInfo) {
            var editor = new qxnw.widgets.dateField();

            if (cellInfo.value === undefined) {
                cellInfo.value = false;
            }

            var format = new qx.util.format.DateFormat("yyyy-MM-dd");
            var value = cellInfo.value;
            if (typeof value != 'undefined') {
                if (value != null) {
                    if (value != false) {
                        editor.setValue(value);
                    }
                }
            }
            editor.setDateFormat(format);
            editor.set({maxHeight: 25});
            var listenerFocus = editor.addListener("focus", function (e) {
                this.open();
            });
            editor.setUserData("focus_id_listener", listenerFocus);
            editor.getChildControl("button").addListener("click", function (e) {
                if (editor.getUserData("enabled") != null) {
                    if (!editor.getUserData("enabled")) {
                        e.preventDefault();
                        e.stop();
                        return;
                    }
                }
            });
            editor.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    var data = {
                        data: this.getValue(),
                        col: cellInfo.col,
                        row: cellInfo.row,
                        type: "dateField",
                        widget: this
                    };
                    cellInfo.table.fireDataEvent("editCell", data);
                }
            });
            editor.addListener("changeValue", function (e) {
                var data = {
                    data: this.getValue(),
                    col: cellInfo.col,
                    row: cellInfo.row,
                    type: "dateField",
                    widget: this
                };
                cellInfo.table.fireDataEvent("changeData", data);
                cellInfo.table.fireDataEvent("changeDate", data);
            });
            editor.addListener("focusout", function (e) {
                var data = {
                    data: this.getValue(),
                    col: cellInfo.col,
                    row: cellInfo.row,
                    type: "dateField",
                    widget: this
                };
                cellInfo.table.fireDataEvent("focusOutDate", data);
            });
            editor.addListener("click", function (e) {
                if (editor.getUserData("enabled") != null) {
                    if (!editor.getUserData("enabled")) {
                        return;
                    }
                }
                this.open();
            });
            editor.setStringValue = function (value) {
                if (typeof value == "string") {
                    this.getChildControl("textfield").setValue(format.parse(value));
                    return;
                } else if (typeof value == "object") {
                    this.setValue(value);
                }
            };
            editor.getChildControl("textfield").addListener("changeEnabled", function (e) {
                var bool = e.getData();
                if (bool) {
                    this.setReadOnly(false);
                    this.setSelectable(true);
                    this.setFocusable(true);
                } else {
                    this.setReadOnly(true);
                    this.setSelectable(false);
                    this.setFocusable(true);
                }
                editor.setUserData("enabled", bool);
            });

            editor.setEnabled(this.__enabled);

            return editor;
        },
        // interface implementation
        getCellEditorValue: function (cellEditor) {
            var v = cellEditor.getValue();
            console.log(v);
            return v;
        }
    }
});