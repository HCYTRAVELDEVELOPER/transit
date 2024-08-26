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
 * A cell editor factory creating select boxes.
 */
qx.Class.define("qxnw.celleditor.textArea", {
    extend: qx.ui.table.celleditor.AbstractField,
    members: {
        __enabled: true,
        _getFilterRegExp: function _getFilterRegExp(type) {
            var filterRegExp;
            switch (type) {
                case "money":
                    filterRegExp = /[0-9$.,]+/;
                    break;
                case "string" :
                    filterRegExp = /[\D ]+/;
                    break;
                case "numeric" :
                    //filterRegExp = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;
                    filterRegExp = /[0-9.,]+/;
                    break;
                case "integer" :
                    filterRegExp = /[0-9]+/;
                    break;
                case "email" :
                    filterRegExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    break;
                case "lowerCase" :
                    filterRegExp = /[a-z]/g;
                    break;
                case "upperCase" :
                    filterRegExp = /[A-Z]/g;
                    break;
                case "special_characteres" :
                    filterRegExp = /[^\\]/g;
                    break;
            }
            return filterRegExp;
        },
        setEnabled: function setEnabled(bool) {
            this.__enabled = bool;
        },
        createCellEditor: function createCellEditor(cellInfo) {
            var self = this;
            var cellEditor = new qxnw.widgets.textArea();
            cellEditor.addListener("changeEnabled", function (e) {
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
            });
            cellEditor.setEnabled(self.__enabled);
            cellEditor.setAppearance("table-editor-textfield");
            cellEditor.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    var data = {
                        data: this.getValue(),
                        col: cellInfo.col,
                        row: cellInfo.row,
                        type: "textArea",
                        widget: this
                    };
                    cellInfo.table.fireDataEvent("editCell", data);
                }
            });
            var value = cellInfo.value;
            if (typeof value != 'undefined' && value != null && value != '') {
                cellEditor.setValue(value);
            }
            var mode = cellInfo.table.getMode(cellInfo.col);
            if (typeof mode != 'undefined' && mode != null) {
                var arrMode = mode.split(",");
                for (var i = 0; i < arrMode.length; i++) {
                    var modes = arrMode[i].split(":");
                    if (modes.length > 0) {
                        if (typeof modes[0] != 'undefined') {
                            if (modes[0] != null) {
                                if (modes[0] != '') {
                                    if (modes[0] == "maxCharacteres") {
                                        cellEditor.setUserData("maxCharacteres", modes[1]);
                                        cellEditor.addListener("input", function (e) {
                                            if (this.getValue().length > this.getUserData("maxCharacteres")) {
                                                this.setValue(this.getUserData("oldValue"));
                                                this.setUserData("oldValue", this.getUserData("oldValue"));
                                            }
                                            this.setUserData("oldValue", this.getValue());
                                        });
                                    }
                                }
                            }
                        }
                    }
                    if (arrMode[i] == "Integer" || arrMode[i] == "integer") {
                        cellEditor.setFilter(self._getFilterRegExp("integer"));
                    }
                    if (arrMode[i] == "String" || arrMode[i] == "string") {
                        cellEditor.setFilter(self._getFilterRegExp("string"));
                    }
                    if (arrMode[i] == "numeric" || arrMode[i] == "Numeric") {
                        cellEditor.setFilter(self._getFilterRegExp("numeric"));
                    }
                    if (arrMode[i] == "lowerCase") {
                        cellEditor.setFilter(self._getFilterRegExp("string"));
                        cellEditor.addListener("input", function (e) {
                            var upper = new qx.type.BaseString(this.getValue());
                            this.setValue(upper.toLowerCase());
                        });
                    }
                    if (arrMode[i] == "upperCase") {
                        cellEditor.setFilter(self._getFilterRegExp("string"));
                        cellEditor.addListener("input", function (e) {
                            var upper = new qx.type.BaseString(this.getValue());
                            this.setValue(upper.toUpperCase());
                        });
                    }
                }
            }
            return cellEditor;
        },
        // overridden
        getCellEditorValue: function (cellEditor) {
            var value = cellEditor.getValue();
            // validation function will be called with new and old value
            var validationFunc = this.getValidationFunction();
            if (validationFunc) {
                value = validationFunc(value, cellEditor.originalValue);
            }

            if (typeof cellEditor.originalValue == "number") {
                if (value != null) {
                    value = parseFloat(value);
                }
            }
            if (value == 0 || value == "0") {
                value == "";
            }
            return value;
        }
    }
});