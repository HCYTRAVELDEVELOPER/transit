qx.Class.define("qxnw.selectTokenField.cellEditorFactory", {
    extend: qx.ui.table.celleditor.TextField,
    members: {
        cellInfo: null,
        value: null,
        createCellEditor: function(cellInfo) {
            if (cellInfo.row != 0) {
                return null;
            }
            var self = this;

            var cellEditor = this.base(arguments, cellInfo);
            this.cellInfo = cellEditor;

            cellEditor.addListener("keypress", function(e) {
                var iden = e.getKeyIdentifier();
                if (iden == "Enter") {
                    self.value = cellEditor.getValue();
                    cellEditor.setValue("");
                }
            }, this);
            return cellEditor;
        },
        //OVERRIDEN
        getCellEditorValue: function(cellEditor) {
            var value = this.value;
            return value;
        },
        clear: function(cellEditor) {
            this.cellInfo.setValue("");
            this.value = "";
        }

    }
});