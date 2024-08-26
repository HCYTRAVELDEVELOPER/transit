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
qx.Class.define("qxnw.table.headRender", {
    extend: qx.ui.table.headerrenderer.Default,
    members: {
        insideWidget: null,
        getInsideWidget: function getInsideWidget() {
            return this.insideWidget;
        },
        // overridden
        createHeaderCell: function (cellInfo) {
            var self = this;
            var widget = new qx.ui.table.headerrenderer.HeaderCell();
            var textField = new qx.ui.form.TextField();
            textField.setTabIndex(qxnw.config.getActualTabIndex());
            this.insideWidget = textField;
            textField.setPlaceholder(textField.tr("Buscar..."));
            var info = [];
            info["col"] = cellInfo.col;
            textField.setUserData("cellInfo", info);
//            qxnw.utils.addBorder(textField, "black", 1);
            cellInfo.table.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Space") {
                    var w = self.getInsideWidget();
                    var val = w.getValue();
                    if (val != null) {
                        w.setValue(val.replace(/\s+$/, '') + " ");
                    }
                }
            });
            textField.addListener("input", function (e) {
                try {
                    var v = e.getData();
                    var cellData = this.getUserData("cellInfo");
                    var tableModel = cellInfo.table.getTableModel();
                    var name = tableModel.getColumnId(cellData["col"]);
                    var evt = {};
                    evt["col"] = cellData["col"];
                    evt["name"] = name;
                    evt["value"] = v;
                    cellInfo.table.fireDataEvent("headerColInput", evt);
                    if (v == "") {
                        return;
                    }
                    for (var i = 0; i < tableModel.Filters.length; i++) {
                        if (tableModel.Filters[i][2] == name && tableModel.Filters[i][1] == v) {
                            return;
                        }
                    }
                    tableModel.addNotRegex(v, name, true);
                    tableModel.applyFilters();
                } catch (e) {
                    qxnw.utils.error(e);
                }
                //SEND EVENT
            });
            textField.addListener("keypress", function (e) {
                try {
                    var cellData = this.getUserData("cellInfo");
                    var key = e.getKeyIdentifier();
                    var tableModel = cellInfo.table.getTableModel();
                    var name = tableModel.getColumnId(cellData["col"]);
                    var evt = {};
                    evt["col"] = cellData["col"];
                    evt["name"] = name;
                    evt["old_value"] = this.getValue();
                    evt["key"] = key;
                    cellInfo.table.fireDataEvent("headerColKeyPress", evt);

                    if (key == "Backspace" && this.getValue().length == this.getTextSelectionLength()) {
                        tableModel.resetHiddenRows();
                        cellInfo.table.changeFilterRows();
                        tableModel.applyFilters();
                    } else if (key == "Backspace" && this.getValue() != "") {
                        for (var i = 0; i < tableModel.Filters.length; i++) {
                            if (tableModel.Filters[i][2] == name && tableModel.Filters[i][1] == this.getValue()) {
                                tableModel.Filters.splice(i, 1);
                            }
                        }
                        var filtersOld = tableModel.Filters;
                        tableModel.resetHiddenRows();
                        tableModel.Filters = filtersOld;
                        cellInfo.table.changeFilterRows();
                        tableModel.applyFilters();
                    } else if (key == "Backspace" && this.getValue() == "") {
                        for (var i = 0; i < tableModel.Filters.length; i++) {
                            if (tableModel.Filters[i][2] == name) {
                                tableModel.Filters.splice(i, 1);
                            }
                        }
                        var filtersOld = tableModel.Filters;
                        tableModel.resetHiddenRows();
                        tableModel.Filters = filtersOld;
                        cellInfo.table.changeFilterRows();
                        tableModel.applyFilters();
                    }
                } catch (e) {
                    qxnw.utils.error(e);
                }
            });
            widget.getLayout().setColumnFlex(2, 0);
            widget.add(textField, {
                column: 1,
                row: 1,
                rowSpan: 2
            });

            widget.showFilterIcon = function (value, icon) {
                this.getChildControl("filter-icon").setSource(icon);
                if (value) {
                    this._showChildControl("filter-icon");
                } else {
                    this._excludeChildControl("filter-icon");
                }
            };
            widget.setUserData("cellAllInfo", info);
            this.updateHeaderCell(cellInfo, widget);
            return widget;
        }
    }
});