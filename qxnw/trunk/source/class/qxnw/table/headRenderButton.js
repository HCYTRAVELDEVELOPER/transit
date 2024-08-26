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
qx.Class.define("qxnw.table.headRenderButton", {
    extend: qx.ui.table.headerrenderer.Default,
    members: {
        insideWidget: null,
        getInsideWidget: function getInsideWidget() {
            return this.insideWidget;
        },
        // overridden
        createHeaderCell: function (cellInfo) {
            var widget = new qx.ui.table.headerrenderer.HeaderCell();
            var textField = new qxnw.widgets.button("Subir archivo").set({
                minHeight: 20,
                appearance: "button"
            });
            widget.setMinHeight(45);
            this.insideWidget = textField;
            var info = [];
            info["col"] = cellInfo.col;
            textField.setUserData("cellInfo", info);
            qxnw.utils.addBorder(textField, "black", 1);
            textField.addListener("click", function (e) {
                try {
                    var cellData = this.getUserData("cellInfo");
                    var tableModel = cellInfo.table.getTableModel();
                    var name = tableModel.getColumnId(cellData["col"]);
                    var evt = {};
                    evt["col"] = cellData["col"];
                    evt["name"] = name;
                    cellInfo.table.fireDataEvent("headerColClick", evt);
                } catch (e) {
                    qxnw.utils.error(e);
                }
                //SEND EVENT
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