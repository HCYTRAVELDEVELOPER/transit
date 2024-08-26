qx.Class.define("qxnw.selectTokenField.list", {
    extend: qx.ui.table.Table,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.__model = new qx.ui.table.model.Simple();
        self.set({
            decorator: null
        });
        self.getTableColumnModel().addListener("widthChanged", function (e) {
            self.storeWidthColumn(e);
        });
        self.addListener("cellTap", function (e) {
            var row = this.getFocusedRow();
            if (row == null) {
                return;
            }
            var data = self.getTableModel().getRowData(row);
            for (var i = 0; i < data.length; i++) {
                data[i] = self.clearB(data[i]);
            }
            self.responseTable(data);
        });
        self.addListener("keypress", function (e) {
            var key = e.getKeyIdentifier();
            var row = null;
            var data = null;
            if (key == 'Enter') {
                //key=='Space'
                row = this.getFocusedRow();
                if (row == null) {
                    return;
                }
                data = this.getTableModel().getRowData(row);
                for (var i = 0; i < data.length; i++) {
                    data[i] = self.clearB(data[i]);
                }
                self.responseTable(data);
            }
        });
        self.setShowCellFocusIndicator(false);
        return self;
    },
    members: {
        __model: null
    }
});