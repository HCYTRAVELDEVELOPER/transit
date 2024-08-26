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
 * List style and all functionality for your lists. You can create a <code>list</code> very fast!
 */
qx.Class.define("qxnw.table.modelFiltered", {
    extend: qx.ui.table.model.Filtered,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.addListener("dataChanged", function (e) {
            if (self.__isSendedEventDataChanged === false) {
                self.addListener("sorted", function (e) {
                    self.__storeSortedColumn(e);
                });
            }
        });
        //TODO: TESTING PARA QUE ORDENE BIEN! VER ANOTACIÓN: COMPROBAR CON SOPORTE HAY UN ERROR Uncaught TypeError: Cannot read property 'toLowerCase' of undefined Simple.js 87
        //self.setCaseSensitiveSorting(false);
    },
    members: {
        parent: null,
        __columnDataWidth: null,
        __isSendedEventDataChanged: false,
        __isSortedColumn: false,
        clean: function () {
            this.setData([]);
        },
        //PILAS AL ACTUALIZAR LAS VERSIONES: HAY QUE AGREGAR LA FUNCIÓN setColumnName DE ESTA CLASE DIRECTAMENTE EN qx.ui.table.model.Abstract en QOOXDOO
        //setColumnName: function setColumnName(columnIndex, name) {
//            console.log(this.__columnNameArr);
//            if (typeof this.__columnNameArr != 'undefined' && this.__columnNameArr != 'undefined') {
//                this.__columnNameArr[columnIndex] = name;
//            }
//        }, 
//        PILAS AL ACTUALIZAR LAS VERSIONES: HAY QUE AGREGAR LA FUNCIÓN ADDROWINTEMPMODEL DE ESTA CLASE DIRECTAMENTE EN qx.ui.table.model.Filtered en QOOXDOO
//        addRowInTempModel: function addRowInTempModel(rowArray) {
//            if (!this.__fullArr) {
//                return;
//            } else {
//                //var startIndex = this.__fullArr.length;
//                //rowArray.splice(0, 0, startIndex, 0);
//                Array.prototype.splice.apply(this.__fullArr, rowArray);
//            }
//        },
        getAllData: function () {
            if (!this.__applyingFilters) {
                return this.__rowArr;
            } else {
                return this.__fullArr;
            }
        },
        /**
         * Returns the stored columns width in array.
         * 
         * @returns {var} The stored data in qxnw.local
         */
        getStoredSortedColumn: function getStoredSortedColumn() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            return qxnw.local.getData(self.parent.getAppWidgetName() + "_list_sorted");
        },
        setStoredColumnSorted: function setStoredColumnSorted() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            var columnSorted = self.getStoredSortedColumn();
            if (columnSorted == null) {
                return;
            }
            if (self.__isSortedColumn === false) {
                try {
                    self.sortByColumn(columnSorted.sorted_column, columnSorted.sorted_ascending);
                } catch (e) {
                    qxnw.utils.bindError(e, self, self.model);
                }
                //TODO: SE ELIMINA PARA QUE ORDENE EN TODOS LOS APPLYFILTERS
                //self.__isSortedColumn = true;
            }
        },
        /*
         * Sets the parent of the model
         * @param {type} parent the parent model
         * @returns {void}
         */
        setParent: function setParent(parent) {
            this.parent = parent;
        },
        /*
         * Saves the sorted column
         * @param {type} e the event
         * @returns {unresolved}
         */
        __storeSortedColumn: function __storeSortedColumn(e) {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            var data = e.getData();
            var newData = {};
            newData["sorted_column"] = data.columnIndex;
            newData["sorted_ascending"] = data.ascending;
            try {
                qxnw.local.storeData(self.parent.getAppWidgetName() + "_list_sorted", newData);
            } catch (exc) {
                qxnw.utils.hiddenError(exc);
                //qxnw.utils.error(exc, self);
            }
        },
        /**
         * Store the changed order when user change the columns order
         * @param r {Object} the event object <code>orderChanged</code>
         * @return {void}
         */
        __storeOrderChanged: function __storeOrderChanged(r) {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            var cols = self.getVisibleColumns();
            var colsCount = self.getOverallColumnCount();
            for (var i = 0; i < colsCount; i++) {
                if (cols.indexOf(i) == -1) {
                    cols.push(i);
                }
            }
            qxnw.local.storeData(self.parent.getAppWidgetName() + "_order", cols);
        },
        getStoredColumnWidth: function getStoredColumnWidth() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            return qxnw.local.getData(self.parent.getAppWidgetName() + "_list");
        },
        setStoredColumnsWidth: function setStoredColumnsWidth() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            if (self.parent === null) {
                return;
            }
            var columnWidth = self.getStoredColumnWidth();
            if (columnWidth == null) {
                return;
            }
            for (var i = 0; i < columnWidth.length; i++) {
                var col = columnWidth[i];
                if (typeof col == 'undefined' || col == null) {
                    continue;
                }
                for (var key in col) {
                    if (key != null) {
                        if (col[key] != null) {
                            if (typeof key != 'undefined' && typeof col[key] != 'undefined' && typeof col != 'undefined') {
                                if (self.isColumnVisible(parseInt(key))) {
                                    try {
                                        self.setColumnWidth(parseInt(key), parseInt(col[key]));
                                    } catch (e) {
                                        qxnw.local.clearKey(self.parent.getAppWidgetName() + "_list");
                                    }
                                } else {
                                    continue;
                                }
                            } else {
                                continue;
                            }
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
            }
        }
    }
});