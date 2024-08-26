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
qx.Class.define("qxnw.celleditor.timeField", {
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
            var editor = new qxnw.widgets.timeField();

            if (cellInfo.value === undefined) {
                cellInfo.value = null;
            }

            var format = new qx.util.format.DateFormat("H:mm");
            var value = null;
            //var value = cellInfo.value;
            if (cellInfo.value != null) {
                if (cellInfo.value != '') {
                    value = format.format(cellInfo.value);
                }
            }

            if (typeof value != 'undefined') {
                if (value != null) {
                    if (value != false) {
                        editor.setValue(value);
                    }
                }
            }
            //editor.setDateFormat(format);
            editor.set({maxHeight: 25});
            var listenerFocus = editor.addListener("focus", function (e) {
                this.open();
            });
            editor.setUserData("focus_id_listener", listenerFocus);
            editor.addListener("click", function (e) {
                if (editor.getUserData("enabled") != null) {
                    if (!editor.getUserData("enabled")) {
                        return;
                    }
                }
                try {
                    var t = e.getTarget();
                    if (t.classname == "qx.ui.form.Button") {
                        return;
                    }
                } catch (e) {
                    console.log(e);
                }
            });
            editor.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() === "Backspace") {
                    this.getChildControl('textfield').setValue('');
                } else if (e.getKeyIdentifier() === "Escape") {
                    this.close();
                } else {
                    e.preventDefault();
                }
                if (e.getKeyIdentifier() == "Enter") {
                    var data = {
                        data: this.getValue(),
                        col: cellInfo.col,
                        row: cellInfo.row,
                        type: "timeField",
                        widget: this
                    };
                    cellInfo.table.fireDataEvent("editCell", data);
                }
            });
            editor.setStringValue = function (value) {
                if (typeof value == "string") {
                    this.getChildControl("textfield").setValue(format.parse(value));
                    return;
                } else if (typeof value == "object") {
                    this.setValue(value);
                }
            };
//            editor.getChildControl("textfield").addListener("changeEnabled", function (e) {
//                var bool = e.getData();
//                if (bool) {
//                    this.setReadOnly(false);
//                    this.setSelectable(true);
//                    this.setFocusable(true);
//                } else {
//                    this.setReadOnly(true);
//                    this.setSelectable(false);
//                    this.setFocusable(true);
//                }
//                editor.setUserData("enabled", bool);
//            });

            editor.setEnabled(this.__enabled);

            return editor;
        },
        // interface implementation
        getCellEditorValue: function (cellEditor) {
            var v = cellEditor.getValue();
            if (v == null) {
                return v;
            }
            if (v == "") {
                return v;
            }
            var format = new qx.util.format.DateFormat("H:mm");
            v = format.parse(v);
            return v;
        }
    }
});