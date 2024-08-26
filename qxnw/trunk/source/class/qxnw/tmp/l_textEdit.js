qx.Class.define("qxnw.tmp.l_textEdit", {
    extend: qxnw.listEdit,
    construct: function construct() {
        var self = this;
        self.base(arguments);
        self.buttonsAutomatic = true;
        var columns = [
            {
                label: "Referencia",
                caption: "id"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Clase",
                caption: "clase"
            },
            {
                label: "Empresa",
                caption: "empresa"
            }
        ];
        self.setColumns(columns);

        var row = [];
        var rowItem = [""];
        row.push(rowItem);
        this.table.getTableModel().addRows(row);

        self.table.addListener("keypress", function (e) {
            self.table.startEditing();
        });

        self.table.addListener("dataEdited", function (e) {
            if (self.table.isEditing()) {
                if (typeof self.table == 'undefined' || self.table == null || self.model == null) {
                    return;
                }
                self.table.cancelEditing();
            }
            var data = e.getData();
            data["columnName"] = self.columnNameFromIndex(data["col"]);
            if (data.length == 0) {
                return;
            }
            self.table.setFocusedCell(3, data["row"]);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                if (r == null) {
                    return;
                }
                if (r.length > 0) {
                    for (var i = 0; i < r.length; i++) {
                        self.addRowData(r[i]);
                    }
                } else {
                    self.addRowData(r);
                }
            };
            rpc.exec("testTableEdit", data, func);
        });

        var filters = [
            {
                name: "fecha_inicial",
                label: "Fecha inicial",
                type: "dateField"
            },
            {
                name: "fecha_final",
                label: "Fecha final",
                type: "dateField"
            }
        ];
        self.createFilters(filters);

        self.ui.searchButton.addListener("execute", function (e) {
            self.removeSelectedRow();
        });
    }
});