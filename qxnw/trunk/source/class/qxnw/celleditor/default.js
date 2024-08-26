/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.celleditor.default", {
    extend: qx.ui.table.celleditor.AbstractField,
    members: {
        // overridden
        getCellEditorValue: function (cellEditor) {
            var value = cellEditor.getValue();

            // validation function will be called with new and old value
            var validationFunc = this.getValidationFunction();
            if (validationFunc) {
                value = validationFunc(value, cellEditor.originalValue);
            }

            cellEditor.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    var data = {
                        data: this.getValue(),
                        col: cellEditor.col,
                        row: cellEditor.row,
                        type: "numericField",
                        widget: this
                    };
                    cellEditor.table.fireDataEvent("editCell", data);
                }
            });

            if (typeof cellEditor.originalValue == "number") {
                if (value != null) {
                    value = parseFloat(value);
                }
            }
            return value;
        },
        _createEditor: function () {
            var cellEditor = new qx.ui.form.TextField();
            cellEditor.setAppearance("table-editor-textfield");
            return cellEditor;
        }
    }
});
