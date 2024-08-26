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
qx.Class.define("qxnw.celleditor.numericField", {
    extend: qx.ui.table.celleditor.AbstractField,
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
            var editor = new qxnw.widgets.NumericField();
            editor.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    var data = {
                        data: this.getValue(),
                        col: cellInfo.col,
                        row: cellInfo.row,
                        type: "numericField",
                        widget: this
                    };
                    cellInfo.table.fireDataEvent("editCell", data);
                }
            });

            if (cellInfo.value === 'undefined') {
                cellInfo.value = false;
            }

            if (cellInfo.value != false) {
                if (typeof cellInfo.value != 'undefined') {
                    editor.setValue(cellInfo.value.toString());
                }
            }

            editor.set({maxHeight: 25});
            editor.getChildControl("numeric-field").addListener("changeEnabled", function (e) {
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

            editor.addListener("activate", function () {
                editor.getChildControl("numeric-field").activate();
            });

            editor.setEnabled(this.__enabled);

            editor.getChildControl("numeric-field").setZIndex(100000);

            return editor;
        },
        // interface implementation
        getCellEditorValue: function (cellEditor) {
            var val = cellEditor.getValue();
            if (val == ".") {
                val = "0.00";
            }
            try {
                var parts = val.split(".");
                if (parts[0] == "") {
                    parts[0] = "0";
                }
                if (parts[1] == "") {
                    parts[1] = "00";
                }
                val = parts[0] + "." + parts[1];
            } catch (e) {

            }
            return val;
        }
    }
});