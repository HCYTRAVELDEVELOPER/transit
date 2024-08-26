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
qx.Class.define("qxnw.celleditor.uploader", {
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

            var main = new qxnw.uploader();

            //main.setOnClickProp(false);
            
            var editor = main.getContainer();
            if (cellInfo.value === 'undefined') {
                cellInfo.value = false;
            }

            var value = cellInfo.value;
            if (typeof value != 'undefined') {
                if (value != null) {
                    if (value != false) {
                        editor.setValue(value);
                    }
                }
            }
            var rta = editor.set({
                focusable: true
            });
            return rta;
        },
        // interface implementation
        getCellEditorValue: function (cellEditor) {
            var v = cellEditor.getValue();
            return v;
        }
    }
});