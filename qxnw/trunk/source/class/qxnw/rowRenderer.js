qx.Class.define("qxnw.rowRenderer", {
    extend: qx.core.Object,
    implement: qx.ui.table.IRowRenderer,
    /*
     *****************************************************************************
     CONSTRUCTOR
     *****************************************************************************
     */

    construct: function (parent) {
        this.base(arguments);

        this.initThemeValues();

        // dynamic theme switch
        if (qx.core.Environment.get("qx.dyntheme")) {
            qx.theme.manager.Meta.getInstance().addListener(
                    "changeTheme", this.initThemeValues, this
                    );
        }
        this.__dataGroup = [];
        this.__parent = parent;
    },
    /*
     *****************************************************************************
     PROPERTIES
     *****************************************************************************
     */

    properties: {
        /** Whether the focused row should be highlighted. */
        highlightFocusRow: {
            check: "Boolean",
            init: true
        }
    },
    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members: {
        _colors: null,
        __fontStyle: null,
        __fontStyleString: null,
        //ADDEDD BY ANDRESF 27 SEP
        __developerColor: null,
        __developerFunc: null,
        __dataGroup: null,
        __condition: null,
        __typeData: null,
        __parent: null,
        setRowColor: function setRowColor(color) {
            this.__developerColor = color;
        },
        setHandleDataByColumn: function setHandleDataByColumn(col, val, color) {
            this.__handledColumn = col;
            this.__handledVal = val;
            this.__developerColor = color;
            var d = {};
            d["handledColumn"] = col;
            d["handledColumnName"] = col;
            d["handledVal"] = val;
            d["developerColor"] = color;
            this.__dataGroup.push(d);
        },
        getDataGroup: function getDataGroup() {
            return this.__dataGroup;
        },
        setHandleData: function setHandleData(col, val, color, condition, type) {
            this.__handledColumn = col;
            this.__handledVal = val;
            this.__developerColor = color;
            if (typeof condition == 'undefined') {
                this.__condition = "==";
            } else {
                this.__condition = condition;
            }
            if (typeof condition == 'undefined') {
                this.__typeData = "Por fila";
            } else {
                this.__typeData = type;
            }

//            this._colors.bgcolFocusedSelected = colorMgr.resolve("table-row-background-focused-selected");
//            this._colors.bgcolFocused = colorMgr.resolve("table-row-background-focused");
//            this._colors.bgcolSelected = colorMgr.resolve("table-row-background-selected");
            //this._colors.bgcolEven = color;
            //this._colors.bgcolOdd = color;
//            this._colors.colSelected = colorMgr.resolve("table-row-selected");
            //this._colors.colNormal = color;
            //this._colors.horLine = color;

            var d = {};
            d["handledColumn"] = col;
            d["developerColor"] = color;
            d["handledColumnName"] = null;
            d["handledVal"] = val;
            d["condition"] = this.__condition;
            d["typeData"] = this.__typeData;
            this.__dataGroup.push(d);
        },
        /**
         * Initializes the colors from the color theme.
         * @internal
         */
        initThemeValues: function () {
            this.__fontStyleString = "";
            this.__fontStyle = {};

            this._colors = {};

            // link to font theme
            this._renderFont(qx.theme.manager.Font.getInstance().resolve("default"));

            // link to color theme
            var colorMgr = qx.theme.manager.Color.getInstance();
            this._colors.bgcolFocusedSelected = colorMgr.resolve("table-row-background-focused-selected");
            this._colors.bgcolFocused = colorMgr.resolve("table-row-background-focused");
            this._colors.bgcolSelected = colorMgr.resolve("table-row-background-selected");
            this._colors.bgcolEven = colorMgr.resolve("table-row-background-even");
            this._colors.bgcolOdd = colorMgr.resolve("table-row-background-odd");
            this._colors.colSelected = colorMgr.resolve("table-row-selected");
            this._colors.colNormal = colorMgr.resolve("table-row");
            this._colors.horLine = colorMgr.resolve("table-row-line");
        },
        restoreNormalValues: function restoreNormalValues() {
            var colorMgr = qx.theme.manager.Color.getInstance();
            this._colors.bgcolEven = colorMgr.resolve("table-row-background-even");
            this._colors.bgcolOdd = colorMgr.resolve("table-row-background-odd");
            this._colors.colNormal = colorMgr.resolve("table-row");
        },
        /**
         * the sum of the vertical insets. This is needed to compute the box model
         * independent size
         */
        _insetY: 1, // borderBottom

        /**
         * Render the new font and update the table pane content
         * to reflect the font change.
         *
         * @param font {qx.bom.Font} The font to use for the table row
         */
        _renderFont: function (font) {
            if (font) {
                this.__fontStyle = font.getStyles();
                this.__fontStyleString = qx.bom.element.Style.compile(this.__fontStyle);
                this.__fontStyleString = this.__fontStyleString.replace(/"/g, "'");
            } else {
                this.__fontStyleString = "";
                this.__fontStyle = qx.bom.Font.getDefaultStyles();
            }
        },
        // interface implementation
        updateDataRowElement: function (rowInfo, rowElem) {
            var fontStyle = this.__fontStyle;
            var style = rowElem.style;

            // set font styles
            qx.bom.element.Style.setStyles(rowElem, fontStyle);

            var bgcolEven = this._colors.bgcolEven;
            var bgcolOdd = this._colors.bgcolOdd;
            var colNormal = this._colors.colNormal;

            if (rowInfo.focusedRow && this.getHighlightFocusRow()) {
                style.backgroundColor = rowInfo.selected ? this._colors.bgcolFocusedSelected : this._colors.bgcolFocused;
            } else {
                if (rowInfo.selected) {
                    style.backgroundColor = this._colors.bgcolSelected;
                } else {
                    if (this.__dataGroup != null && this.__dataGroup.length > 0) {
                        for (var i = 0; i < this.__dataGroup.length; i++) {
                            if (typeof rowInfo.rowData != 'undefined' && rowInfo.rowData != null) {

                                var colType = "";
                                if (this.__parent != null && typeof this.__parent != 'undefined') {
                                    try {
                                        colType = this.__parent.getColumnTypeFromIndex(this.__dataGroup[i]["handledColumn"]);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }

                                var d = rowInfo.rowData[this.__dataGroup[i]["handledColumn"]];

                                if (colType == "selectBox") {
                                    if (typeof rowInfo.rowData[this.__dataGroup[i]["handledColumn"]].name != 'undefined') {
                                        d = rowInfo.rowData[this.__dataGroup[i]["handledColumn"]].name;
                                    }
                                }
                                if (this.__dataGroup[i].condition == "==") {
                                    if (d == this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == ">") {
                                    if (parseInt(d) >
                                            parseInt(this.__dataGroup[i]["handledVal"])) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == "<") {
                                    if (d < this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == "<=") {
                                    if (d <= this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == ">=") {
                                    if (d >= this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == "!=") {
                                    if (d != this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    style.backgroundColor = (rowInfo.row % 2 == 0) ? bgcolEven : bgcolOdd;
                }
            }
            style.color = rowInfo.selected ? this._colors.colSelected : colNormal;
            style.borderBottom = "1px solid " + this._colors.horLine;
        },
        /**
         * Get the row's height CSS style taking the box model into account
         *
         * @param height {Integer} The row's (border-box) height in pixel
         * @return {String} CSS rule for the row height
         */
        getRowHeightStyle: function (height) {
            if (qx.core.Environment.get("css.boxmodel") == "content") {
                height -= this._insetY;
            }

            return "height:" + height + "px;";
        },
        // interface implementation
        createRowStyle: function (rowInfo) {
            var rowStyle = [];
            rowStyle.push(";");
            rowStyle.push(this.__fontStyleString);
            rowStyle.push("background-color:");

            var bgcolEven = this._colors.bgcolEven;
            var bgcolOdd = this._colors.bgcolOdd;
            var colNormal = this._colors.colNormal;

            if (rowInfo.focusedRow && this.getHighlightFocusRow()) {
                rowStyle.push(rowInfo.selected ? this._colors.bgcolFocusedSelected : this._colors.bgcolFocused);
            } else {
                if (rowInfo.selected) {
                    rowStyle.push(this._colors.bgcolSelected);
                } else {
                    if (this.__dataGroup != null && this.__dataGroup.length > 0) {
                        for (var i = 0; i < this.__dataGroup.length; i++) {
                            if (typeof rowInfo.rowData != 'undefined' && rowInfo.rowData != null) {

                                var colType = "";
                                if (this.__parent != null && typeof this.__parent != 'undefined') {
                                    try {
                                        colType = this.__parent.getColumnTypeFromIndex(this.__dataGroup[i]["handledColumn"]);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                                var d = rowInfo.rowData[this.__dataGroup[i]["handledColumn"]];
                                if (colType == "selectBox") {
                                    if (typeof rowInfo.rowData[this.__dataGroup[i]["handledColumn"]].name != 'undefined') {
                                        d = rowInfo.rowData[this.__dataGroup[i]["handledColumn"]].name;
                                    }
                                }

                                if (this.__dataGroup[i].condition == "==") {
                                    if (d == this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == ">") {
                                    if (parseInt(d) >
                                            parseInt(this.__dataGroup[i]["handledVal"])) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == "<") {
                                    if (d < this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == "<=") {
                                    if (d <= this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == ">=") {
                                    if (d >= this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                } else if (this.__dataGroup[i].condition == "!=") {
                                    if (d != this.__dataGroup[i]["handledVal"]) {
                                        if (this.__dataGroup[i].typeData == "Por fila") {
                                            bgcolEven = this.__dataGroup[i]["developerColor"];
                                            bgcolOdd = this.__dataGroup[i]["developerColor"];
                                        } else {
                                            colNormal = this.__dataGroup[i]["developerColor"];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    rowStyle.push((rowInfo.row % 2 == 0) ? bgcolEven : bgcolOdd);
                }
            }
            rowStyle.push(';color:');
            rowStyle.push(rowInfo.selected ? this._colors.colSelected : colNormal);

            rowStyle.push(';border-bottom: 1px solid ', this._colors.horLine);

            return rowStyle.join("");
        },
        getRowClass: function (rowInfo) {
            return "";
        },
        /**
         * Add extra attributes to each row.
         *
         * @param rowInfo {Object}
         *   The following members are available in rowInfo:
         *   <dl>
         *     <dt>table {qx.ui.table.Table}</dt>
         *     <dd>The table object</dd>
         *
         *     <dt>styleHeight {Integer}</dt>
         *     <dd>The height of this (and every) row</dd>
         *
         *     <dt>row {Integer}</dt>
         *     <dd>The number of the row being added</dd>
         *
         *     <dt>selected {Boolean}</dt>
         *     <dd>Whether the row being added is currently selected</dd>
         *
         *     <dt>focusedRow {Boolean}</dt>
         *     <dd>Whether the row being added is currently focused</dd>
         *
         *     <dt>rowData {Array}</dt>
         *     <dd>The array row from the data model of the row being added</dd>
         *   </dl>
         *
         * @return {String}
         *   Any additional attributes and their values that should be added to the
         *   div tag for the row.
         */
        getRowAttributes: function (rowInfo) {
            return "";
        }
    },
    /*
     *****************************************************************************
     DESTRUCTOR
     *****************************************************************************
     */

    destruct: function () {
        this._colors = this.__fontStyle = this.__fontStyleString = null;

        // remove dynamic theme listener
        if (qx.core.Environment.get("qx.dyntheme")) {
            qx.theme.manager.Meta.getInstance().removeListener(
                    "changeTheme", this.initThemeValues, this
                    );
        }
    }
});