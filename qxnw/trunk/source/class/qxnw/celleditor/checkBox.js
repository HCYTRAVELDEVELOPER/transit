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
qx.Class.define("qxnw.celleditor.checkBox", {
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
            var editor = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                alignX: "center",
                alignY: "top"
            })).set({
                focusable: true
            });

            cellInfo.value = cellInfo.value == 't' ? true : cellInfo.value == 'f' ? false : cellInfo.value;

            if (cellInfo.value === undefined) {
                cellInfo.value = false;
            }
            
            //TODO: SE CAMBIA PARA EVITAR CONTRADICCIONES CON EL ARCHIVO EN WIDGETS
            var checkbox = new qx.ui.form.CheckBox().set({
                marginTop: 6
            });
//            var checkbox = new qxnw.widgets.checkBox().set({
//                marginTop: 6
//            });

            if (typeof cellInfo.value != 'undefined') {
                if (cellInfo.value != null) {
                    if (cellInfo.value != '') {
                        checkbox.setValue(cellInfo.value);
                    }
                }
            }

            editor.add(checkbox);

            editor.setUserData("nw_cell_info", cellInfo);
            checkbox.setUserData("nw_cell_info", cellInfo);

            checkbox.addListener("changeValue", function (e) {
                var val = e.getData();
                var intern = this.getUserData("nw_cell_info");
                var rta = {};
                rta["col"] = intern.col;
                rta["row"] = intern.row;
                rta["xPos"] = intern.xPos;
                rta["value"] = val;
                rta["type"] = "checkBox";
                intern.table.fireDataEvent("cellCheckbox", rta);
            });

            // propagate focus
            editor.addListener("focus", function () {
                checkbox.focus();
            });

            // on appear change
//            editor.addListener("appear", function () {
//                var v = checkbox.getValue();
//                if (v === true) {
//                    checkbox.setValue(false);
//                } else {
//                    checkbox.setValue(true);
//                }
//            });
            editor.addListener("activate", function () {
                checkbox.activate();
            });

            //on all area clicked the checkBox have to react
            editor.addListener("click", function (e) {
                if (e.getTarget().classname == "qx.ui.container.Composite") {
                    var v = checkbox.getValue();
                    if (v === true) {
                        checkbox.setValue(false);
                    } else {
                        checkbox.setValue(true);
                    }
                }
            });

            // propagate stopped enter key press to the editor
//            checkbox.addListener("keydown", function (e) {
//                if (e.getKeyIdentifier() == "Enter") {
//                    var clone = qx.event.Pool.getInstance().getObject(qx.event.type.KeySequence);
//                    var target = editor.getContentElement().getDomElement();
//                    clone.init(e.getNativeEvent(), target, e.getKeyIdentifier());
//                    clone.setType("keypress");
//                    qx.event.Registration.dispatchEvent(target, clone);
//                }
//            }, this);

            editor.setEnabled(this.__enabled);

            return editor;
        },
        // interface implementation
        getCellEditorValue: function (cellEditor) {
            var value = cellEditor.getChildren()[0].getValue() === 'undefined' ? false : cellEditor.getChildren()[0].getValue();
            return value;
        }
    }
});