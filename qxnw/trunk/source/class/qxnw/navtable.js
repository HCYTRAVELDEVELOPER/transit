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

qx.Class.define("qxnw.navtable", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function (parent, enabledFilters) {
        var self = this;
        this.base(arguments);
        if (typeof parent !== 'undefined') {
            self.parent = parent;
        }
        if (typeof enabledFilters != 'undefined' && typeof enabledFilters == "boolean") {
            //TODO: se deshabilita: enabledFilters
            self.setEnabledFilters(enabledFilters);
        }
        self.ui = {};
        self.__setRpcUrl();
        self.__columns = [];
        self.__captions = [];
        self.__types = [];
        self.__modes = [];
        self.__colsEditable = [];
        self._stateColumns = [];
        self.ui = [];
        self.labelForm = [];
        self.__baseLayout = new qx.ui.layout.VBox();

        self.scrollContainer = new qx.ui.container.Scroll().set({
            allowGrowY: true,
            allowGrowX: true,
            minHeight: 400
        });

        self.__containerAll = new qx.ui.container.Composite(self.__baseLayout).set({
            decorator: "main", //height: 100,
            padding: 3,
            minHeight: 100
        });
        self.scrollContainer.add(self.__containerAll);

        self.scrollContainer.getQxnwType = function () {
            return "qxnw_navtable";
        };
        self.__containerAll.getQxnwType = function () {
            return "qxnw_navtable";
        };
        self.__containerTable = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
            minHeight: 5
        });
        self.__containerControls = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
            spacing: 5
        }));
        self.__containerAll.add(self.__containerControls);
        self.__containerAll.add(self.__containerTable, {
            flex: 1
        });
        if (self.__createButtons) {
            self.__createButtons();
        }
        self.__columnsImages = [];
        self.removedStore = [];
        self.__colorHeaders = [];
        self.__hiddenColumns = [];
        self.__aproxWidthCols = {};
        self.__dataTableTextInformation = {};

        self.__createTable();

        self.createFooterWidget();

        self.addListener("returnModelData", function () {
            self.calculateOperations();
        });
    },
    destruct: function destruct() {
        try {
            this._disposeObjects("parent");
            this._disposeObjects("__baseLayout");
            this._disposeObjects("__containerAll");
            this._disposeObjects("__containerTable");
            this._disposeObjects("__containerControls");
            this._disposeObjects("__box1");
            this._disposeObjects("__box2");
            this._disposeObjects("__addButton");
            this._disposeObjects("__removeButton");
            this._disposeObjects("__autoWidthButton");
            this._disposeObjects("__exportButton");
            this._disposeObjects("_cleanFiltersButton");
            this._disposeObjects("table");
            this._disposeObjects("tableModel");
        } catch (e) {
            qxnw.utils.bindError(e, this, 0, true, false);
        }
    },
    events: {
        "headerColKeyPress": "qx.event.type.Data",
        "headerColInput": "qx.event.type.Data",
        "returnModelData": "qx.event.type.Event"
    },
    properties: {
        showFooterCalculate: {
            init: false,
            check: "Boolean",
            apply: "_applyShowFooterCalculate"
        },
        qxnwType: {
            init: "qxnw_navtable"
        },
        haveParentContextMenu: {
            init: true,
            check: "Boolean"
        },
        uniqueInteger: {
            init: "0"
        },
        isListEdit: {
            init: false
        },
        qxnwType: {
            init: "qxnw_navtable"
        },
        width: {
            check: "Number",
            init: 200
        },
        height: {
            check: "Number",
            init: "auto"
        },
        title: {
            check: "String",
            init: "Please change title",
            apply: "__setLegend"
        },
        haveToolTip: {
            check: "Boolean",
            init: false,
            apply: "startToolTip"
        }
    },
    members: {
        parent: null,
        __rpcUrl: null,
        __baseLayout: null,
        __containerAll: null,
        __containerTable: null,
        __containerControls: null,
        __box1: null,
        __box2: null,
        __addButton: null,
        __removeButton: null,
        table: null,
        tableModel: null,
        model: null,
        __columns: [],
        __captions: [],
        __types: [],
        __dataTableTextInformation: null,
        __modes: {},
        __decoration: null,
        __createButtonsAutomatic: true,
        __listener: null,
        __columnDataWidth: [],
        __contextMenu: null,
        allColumnsData: null,
        ui: null,
        labelForm: null,
        scrollContainer: null,
        __columnsImages: null,
        enableFilters: false,
        removedStore: null,
        tableAuto: null,
        command_copy: null,
        __isFocused: null,
        __colorHeaders: null,
        __hiddenColumns: null,
        __footerContainer: null,
        tipoCalculo: null,
        __maximizeNavTableButton: null,
        flushEditing: function flushEditing() {
            if (this.table == null) {
                return;
            }
            if (this.table.isEditing()) {
                this.table.stopEditing();
            }
        },
        setCellValue: function setCellValue(col, row, val) {
            if (this.table != null) {
                this.table.getTableModel().setValue(col, row, val);
            }
        },
        getColumnTypeFromIndex: function getColumnTypeFromIndex(index) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                if (i == index) {
                    if (typeof columns[i].type != 'undefined') {
                        return columns[i].type;
                    } else {
                        return "";
                    }
                }
            }
        },
        getCellValue: function getCellValue(column, row) {
            return this.table.getTableModel().getValue(column, row);
        },
        setMaxHeight: function setMaxHeight(h) {
            this.__containerAll.setMaxHeight(h);
        },
        setAutoWidth: function setAutoWidth() {
            var self = this;
            try {
                var cm = self.table.getTableColumnModel();
                for (var w in self.__aproxWidthCols) {
                    if (parseInt(w) < 0) {
                        continue;
                    }
                    var width = parseInt(self.__aproxWidthCols[w]);

                    if (typeof self.__captions[w] != 'undefined') {
                        if (width < self.__captions[w].length) {
                            width = self.__captions[w].length;
                        }
                    }

                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var text = ctx.measureText("0".repeat(width));
                    var rw = parseInt(text.width) + 20;

                    if (rw > 450) {
                        rw = 450;
                    }
                    cm.setColumnWidth(parseInt(w), rw);

                    self.table.storeColumnsWidth(false, parseInt(w), rw);

                    delete canvas;
                    delete ctx;
                    delete text;

                    canvas = null;
                    ctx = null;
                    text = null;
                }
            } catch (e) {
                qxnw.utils.error(e);
            }
        },
        _applyShowFooterCalculate: function _applyShowFooterCalculate(value, old) {
            var self = this;
            if (value == true) {
                self.__footerContainer.setVisibility("visible");
            } else {
                self.__footerContainer.setVisibility("excluded");
            }
        },
        createFooterWidget: function createFooterWidget() {
            var self = this;
            self.__footerContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignY: "middle"
            }));
            self.tipoCalculo = new qxnw.fields.selectBox();
            //self.tipoCalculo.saveState("nw_nav_table_selectbox");
            self.__footerContainer.add(self.tipoCalculo);
            self.tipoCalculo.setMaxHeight(25);
            self.tipoCalculo.setMaxWidth(100);
            var calcs = {};
            calcs[""] = self.tr("Calcular...");
            calcs["SUM"] = self.tr("Sumar");
//            calcs["SUM_BY_COL"] = self.tr("Suma con condicional");
//            calcs["PROM"] = self.tr("Promedio");
//            calcs["RECUENTO"] = self.tr("Recuento");
            qxnw.utils.populateSelectFromArray(self.tipoCalculo, calcs);
            self.__containerAll.add(self.__footerContainer);
            self.tipoCalculo.setValue = function (value) {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getModel() == value) {
                        this.setSelection([items[i]]);
                    }
                }
                return true;
            };
            self.tipoCalculo.setValue("SUM");
            self.tipoCalculo.getValue = function () {
                var data = {};
                if (!this.isSelectionEmpty()) {
                    var selectModel = this.getSelection()[0].getModel();
                    data["typeCalc"] = selectModel;
                } else {
                    return "";
                }
                return data;
            };
            self.tipoCalculo.addListener("changeSelection", function () {
                self.calculateOperations();
            });
            self.totalText = new qxnw.fields.selectBox();
            self.totalText.addListener("changeSelection", function () {
                self.calculateOperations();
            });
            self.__footerContainer.add(self.totalText);
            self.totalText.setMaxHeight(25);
            self.totalText.setMaxWidth(150);
            self.totalText.setValue = function (value) {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getModel() == value) {
                        this.setSelection([items[i]]);
                    }
                }
                return true;
            };
            self.totalText.getValue = function () {
                var data = {};
                if (!this.isSelectionEmpty()) {
                    var selectModel = this.getSelection()[0].getModel();
                    data["totalText"] = selectModel;
                } else {
                    return "";
                }
                return data;
            };
            self.__footerContainer.setVisibility("excluded");
        },
        calculateOperations: function calculateOperations() {
            var self = this;
            var op = self.tipoCalculo.getValue().typeCalc;
            if (op == "") {
                return;
            }
            var col = self.totalText.getValue().totalText;
            if (col == null) {
                return;
            }
            var model = self.tableModel.getData();
            var col = self.columnIndexFromName(col);
            var total = 0;
            var r = null;
            for (var i = 0; i < model.length; i++) {
                r = model[i];
                for (var ia = 0; ia < r.length; ia++) {
                    if (col == ia) {
                        total = total + parseFloat(r[ia] == "" ? 0 : r[ia]);
                    }
                }
            }
            total = qxnw.utils.formatCurrency(total);
            self.addInformation("<b style='color: blue'>" + "Suma: " + total.toString() + "</b> ", "totalColumns");
        },
        cleanColorHeaders: function cleanColorHeaders(val) {
            if (typeof val != 'undefined' && val != null) {
                val = val.replace(/<div id='div_[0-9]' color='[#a-zA-Z0-9]*'><.div>/gi, "");
                val = qxnw.utils.replaceAll(val, "<b style='color:red'>*</b>", "");
                return val;
            } else {
                return "";
            }
        },
        getDescriptionByObjectName: function getDescriptionByObjectName(name) {
            var descVar = this.getTableDescription();
            if (descVar != null && descVar != "") {
                try {
                    var json = qx.lang.Json.parse(descVar);
                } catch (e) {
                    qxnw.utils.error(e);
                    return;
                }
                for (var ia = 0; ia < json.length; ia++) {
                    var r = json[ia];
                    if (typeof r[name] != 'undefined') {
                        return r[name];
                    }
                }
                return false;
            } else {
                return false;
            }
        },
        /**
         * Try to show an automatic form and save the data. Uses the <code>PHP master</code>.
         * @return {void}
         */
        __slotNew: function __slotNew() {
            var self = this;
            var d = new qxnw.forms();
            var description = self.getDescriptionByObjectName("config");
            if (typeof description.masterOpenModal != 'undefined' && typeof description.masterOpenModal == 'boolean') {
                d.setModal(description.masterOpenModal);
            } else {
                d.setModal(false);
            }
            try {
                d.setTableDescription(self.getTableDescription());
                d.createFromTable(self.tableAuto, true, false);
                if (this.__funcLists != null) {
                    d.setFunctionOnSave(self.__funcLists);
                }
            } catch (e) {
                qxnw.utils.error(e, d);
                return;
            }
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.addListener("reject", function () {
                try {
                    self.setTableFocus();
                } catch (e) {
                    console.log(e);
                }
            });
            d.show();
        },
        getTableDescription: function getTableDescription() {
            return this.__tableDescription;
        },
        setEnabledAll: function setEnabledAll(bool) {
            this.setEnableAll(bool);
        },
        setEnableAll: function setEnableAll(bool) {
            var self = this;
            self.setEnablePanel(bool);
            self.enableButtons(bool);
        },
        setEnableButtons: function setEnableButtons(bool) {
            var self = this;
            self.enableButtons(bool);
        },
        setEnablePanel: function setEnablePanel(bool) {
            var self = this;
            self.__containerTable.setEnabled(bool);
            try {
                self.table.getPaneScroller(0).getChildControl("scrollbar-y").setEnabled(true);
                self.table.getPaneScroller(0).getChildControl("scrollbar-x").setEnabled(true);
            } catch (e) {

            }
        },
        getColumnModeFromColumn: function getColumnModelFromColumn(column) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                if (i == column) {
                    return columns[i].mode;
                }
            }
        },
        getColumnTypeFromColumn: function getColumnTypeFromColumn(column) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                if (i == column) {
                    return columns[i].type;
                }
            }
        },
        /**
         * Adds information to table status bar
         * @param info {String} 
         * @param type {String}
         * @returns {Boolean} if the operation was successfull or not
         */
        addInformation: function addInformation(info, type) {
            var self = this;
            if (typeof type == 'undefined') {
                type = "other";
            }
            var quote = ", ";
            switch (type) {
                case "totalRecords" :
                    self.__dataTableTextInformation["totalRecords"] = info;
                    break;
                case "totalColumns" :
                    self.__dataTableTextInformation["totalColumns"] = info;
                    break;
                case "other" :
                    if (typeof self.__dataTableTextInformation["other"] == 'undefined') {
                        self.__dataTableTextInformation["other"] = "";
                    }
                    // DISABLED ON 17 JUN 2015
                    //self.__dataTableTextInformation["other"] = self.__dataTableTextInformation["other"] + info;
                    self.__dataTableTextInformation["other"] = info;
                    break;
            }
            if (typeof self.__dataTableTextInformation["totalRecords"] == 'undefined') {
                self.__dataTableTextInformation["totalRecords"] = "";
            }
            if (typeof self.__dataTableTextInformation["totalColumns"] == 'undefined') {
                self.__dataTableTextInformation["totalColumns"] = "";
            } else {
                if (self.__dataTableTextInformation["totalColumns"] != "") {
                    self.__dataTableTextInformation["totalColumns"] = quote + self.__dataTableTextInformation["totalColumns"];
                }
            }
            var backQuote = "";
            if (typeof self.__dataTableTextInformation["other"] == 'undefined') {
                self.__dataTableTextInformation["other"] = "";
                quote = "";
            } else {
                backQuote = ", ";
                quote = "";
            }
            self.table.setAdditionalStatusBarText(quote + self.__dataTableTextInformation["totalRecords"] + self.__dataTableTextInformation["totalColumns"] + backQuote + self.__dataTableTextInformation["other"]);
            return true;
        },
        getTotalColumns: function getTotalColumns() {
            return this.allColumnsData == null ? 0 : this.allColumnsData.length;
        },
        getColumnIdFromIndex: function getColumnIdFromIndex(index) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                if (i == index) {
                    return columns[i].caption;
                }
            }
        },
        getHeaderColumnSearchByColName: function getHeaderColumnSearchByColName(colName) {
            var tableModel = this.table.getTableModel();
            var col = tableModel.getColumnIndexById(colName);
            return this.getHeaderColumnSearchByColId(col);
        },
        getHeaderColumnSearchByColId: function getHeaderColumnSearchByColId(col) {
            var tcm = this.table.getTableColumnModel();
            var hcr = tcm.getHeaderCellRenderer(col);
            var rta = null;
            if (typeof hcr.getInsideWidget == 'function') {
                rta = hcr.getInsideWidget();
            }
            return rta;
        },
        setEnabledFilters: function setEnabledFilters(v) {
            this.enableFilters = v;
        },
        getEnabledFilters: function getEnabledFilters(v) {
            return this.enableFilters;
        },
        createFromTable: function createFromTable(table, excluded, haveToUpdate) {
            var self = this;
            if (typeof haveToUpdate == 'undefined') {
                haveToUpdate = true;
            }
            self.tableAuto = table;
            self.setUserData("autoTable", table);
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "master");
            //rpc.setAsync(true);
            var columns = rpc.exec("getColumns", {table: table});
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            columns = columns["cols"];
            //var func = function(columns) {
            var d = [];
            for (var i = 0; i < columns.length; i++) {
                columns[i].caption = columns[i].column_name;
                columns[i].name = columns[i].column_name;
                columns[i].label = qxnw.utils.ucfirst(qxnw.utils.replaceAll(columns[i].column_name, "_", " "));
                var description = null;
                if ((columns[i].description != "") && (typeof columns[i].description != 'undefined')) {
                    if (columns[i].description != null) {
                        description = columns[i].description.split(",");
                        if (typeof description[0] != 'undefined') {
                            columns[i].type = description[0];
                        }
                        if (typeof description[2] != 'undefined') {
                            columns[i].visible = description[2];
                        }
                        if (typeof description[3] != 'undefined' && description[3] != 0) {
                            columns[i].required = description[3];
                        }
                        if (typeof description[4] != 'undefined' && description[4] != 0) {
                            columns[i].mode = description[4];
                        }
                        if (typeof description[5] != 'undefined') {
                            if (description[5] != 0) {
                                if (description[5] != '') {
                                    columns[i].label = qxnw.utils.ucfirst(qxnw.utils.replaceAll(description[5], "_", ""));
                                }
                            }
                        }
                    }
                } else {
                    columns[i].visible = true;
                }
                if (columns[i].type == "selectBox") {
                    columns[i].hide = false;
                }
                if (typeof excluded != 'undefined') {
                    if (columns[i].name != excluded) {
                        d.push(columns[i]);
                    }
                } else {
                    d.push(columns[i]);
                }
            }
            self.setColumns(d);
            self.table.applySavedConfigurations();

            if (self.tableAuto != null && haveToUpdate == true) {
                self.ui["addButton"].addListener("click", function () {
                    self.__slotNew();
                });
                self.ui["removeButton"].addListener("click", function () {
                    self.__slotDelete();
                });
                self.applyFilters();
            }
            //};
            //rpc.exec("getColumns", {table: table}, func);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data["table"] = this.tableAuto;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "Master");
            rpc.setAsync(true);
            var func = function (rta) {
                var r = rta.records;
                self.setModelData(r);
                //TODO: REVISAR MÉTODO!!!
                if (qxnw.local.getData(self.getAppWidgetName() + "__hidden_columns") == null) {
                    var columns = self.allColumnsData;
                    qxnw.local.storeData(self.getAppWidgetName() + "__hidden_columns", true);
                    for (var i = 0; i < columns.length; i++) {
                        if (typeof columns[i].visible != 'undefined') {
                            if (columns[i].visible == "false" || columns[i].visible == false) {
                                self.hideColumn(columns[i].caption);
                            }
                        }
                    }
                }
            };
            rpc.exec("execPage", data, func);
        },
        getRpcUrl: function getRpcUrl() {
            return this.__rpcUrl;
        },
        startToolTip: function startToolTip() {
//              if (self.getHaveToolTip()) {
//                self.startToolTip();
//            }
            this.tooltip = new qx.ui.tooltip.ToolTip("").set({
                rich: true,
                maxWidth: 500
            });
            this.table.setToolTip(this.tooltip);
            this.table.addListener("mousemove", this.showTooltip, this);
            this.table.addListener("mouseout", function (e) {
                this.tooltip.hide();
            }, this);
        },
        showTooltip: function (e) {
            var v = null;
            var pageX = e.getDocumentLeft();
            var pageY = e.getDocumentTop();
            var sc = this.table.getTablePaneScrollerAtPageX(pageX);
            if (sc != null) {
                var tm = this.table.getTableModel();
                if (tm != null) {
                    var row = sc._getRowForPagePos(pageX, pageY);
                    var col = sc._getColumnForPageX(pageX); /**/
                    if (row >= 0 && col >= 0) {
                        try {
                            v = tm.getToolTip(col, row);
                        } catch (az) {
                            v = "";
                        }
                    }
                }
            }
            if (v != null & v != "") {
                this.tooltip.placeToPointer(e);
                this.tooltip.setLabel(v != null ? v.toString() : "");
                this.tooltip.show();
            } else
                this.tooltip.hide();
        },
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
        createFooterBar: function createFooterBar() {
            var self = this;
            var hLayout = new qx.ui.layout.HBox().set({
                spacing: 10
            });
            self.__footerBar = new qx.ui.container.Composite(hLayout);
            self.__containerAll.add(self.__footerBar, {
                flex: 1
            });
            self.__areCreatedFooterBar = true;
        },
        addFooterFields: function addFooterFields(fields) {
            var self = this;
            if (this.__footerBar == null) {
                self.createFooterBar();
            }
            var modeGroup;
            var isGroup = false;
            for (var i = 0; i < fields.length; i++) {
                this.createFields(fields[i].type, fields[i].name, fields[i].label, fields[i].mode);
                var required = fields[i].required;
                var label = fields[i].label;
                var name = fields[i].name;
                var type = fields[i].type;
                var mode = fields[i].mode;
                var width = fields[i].width;
                if (type == "startGroup") {
                    var icon = fields[i].icon;
                    self.__group = new qx.ui.groupbox.GroupBox(name, icon).set({
                        contentPadding: 2
                    });
                    if (typeof width != 'undefined') {
                        self.__group.set({
                            maxWidth: width
                        });
                    }
                    if (mode == "horizontal") {
                        self.__group.setLayout(new qx.ui.layout.HBox().set({
                            spacing: 5
                        }));
                        modeGroup = mode;
                    } else if (mode == "vertical") {
                        self.__group.setLayout(new qx.ui.layout.VBox().set({
                            spacing: 5
                        }));
                        modeGroup = mode;
                    } else if (mode == "grid") {
                        self.__group.setLayout(new qx.ui.layout.Grid().set({
                            spacing: 5
                        }));
                        modeGroup = mode;
                    } else {
                        self.__group.setLayout(new qx.ui.layout.VBox().set({
                            spacing: 5
                        }));
                        modeGroup = "vertical";
                    }
                    if (name == "") {
                        self.__group.getChildControl("legend").setVisibility("excluded");
                    }
                    self.isAddedGroup = false;
                    isGroup = true;
                    continue;
                }
                if (type == "endGroup") {
                    isGroup = false;
                    continue;
                }

                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                var asterisk = "";
                if (required) {
                    asterisk = "<b style='color:red'>*</b>";
                }
                var labelUi = new qx.ui.basic.Label(label.replace("_", " ") + asterisk).set({
                    rich: true
                });
                container.add(labelUi, {flex: 1});
                if (type == "uploader") {
                    container.add(self.ui[name].getContainer(), {flex: 1});
                } else {
                    container.add(self.ui[name], {flex: 1});
                }
                if (isGroup) {
                    self.__group.add(container, {
                        flex: 1
                    });
                    if (!self.isAddedGroup) {
                        self.__footerBar.add(self.__group, {
                            flex: 1
                        });
                        self.isAddedGroup = true;
                    }
                } else {
                    self.__footerBar.add(container);
                }
            }
            return true;
        },
        setFields: function setFields(fields) {
            this.addFields(fields);
        },
        /*
         * Adds a lot of fields by array
         * @param fields {Array} the array fields
         * @returns {void}
         * 
         */
        addFields: function addFields(fields) {
            var self = this;
            if (typeof fields == 'undefined' || fields == null || fields.length == 0) {
                return;
            }
            for (var i = 0; i < fields.length; i++) {
                this.createFields(fields[i].type, fields[i].name, fields[i].label, fields[i].mode);
                var vLayout = null;
                if (fields[i].type == "radioButton" || fields[i].type == "checkBox" || fields[i].type == "checkbox") {
                    vLayout = new qx.ui.layout.HBox();
                } else {
                    vLayout = new qx.ui.layout.VBox();
                }
                var container = new qx.ui.container.Composite(vLayout);
                var asterisk = "";
                if (fields[i].required) {
                    asterisk = "<b style='color:red'>*</b>";
                }
                if (typeof fields[i].toolTip != 'undefined' && typeof fields[i].toolTip != null) {
                    self.labelForm[fields[i].name] = new qx.ui.basic.Atom(fields[i].label.replace("_", " ") + asterisk, qxnw.config.execIcon("dialog-information.png", "status")).set({
                        rich: true
                    });
                    self.labelForm[fields[i].name].setGap(-5);
                    self.labelForm[fields[i].name].setIconPosition("right");
                    var tT = new qx.ui.tooltip.ToolTip(fields[i].toolTip, qxnw.config.execIcon("help-faq"));
                    self.labelForm[fields[i].name].setToolTip(tT);
                } else {
                    self.labelForm[fields[i].name] = new qx.ui.basic.Label(fields[i].label.replace("_", " ") + asterisk).set({
                        rich: true
                    });
                }
                if (fields[i].required) {
                    self.labelForm[fields[i].name].setUserData("required", fields[i].required);
                }
                if (fields[i].type == "button" || fields[i].type == "label") {
                    self.labelForm[fields[i].name].setValue("");
                } else if (fields[i].type == "ckeditor") {
                    container.getLayout().set({
                        alignX: "right"
                    });
                }
                container.add(self.labelForm[fields[i].name], {flex: 1});
                container.add(self.ui[fields[i].name], {flex: 1});
                this.__containerControls.add(container);
            }
        },
        createFields: function createFields(type, name, label, mode) {
            var self = this;
            if (type == "startGroup") {
                return;
            }
            if (type == "endGroup") {
                return;
            }
            switch (type) {
                case "spacer":
                    self.ui[name] = new qx.ui.core.Spacer(label);
                    break;
                case "label":
                    self.ui[name] = new qx.ui.basic.Label(label).set({
                        rich: true
                    });
                    break;
                case "colorPopup":
                    self.ui[name] = new qx.ui.control.ColorSelector();
                    self.setValue = function setValue(val) {

                    };
                    self.getValue = function getValue() {

                    };
                    break;
                case "camera":
                    var height = 250;
                    var width = 400;
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(":");
                        if (typeof arrMode == 'array' || typeof arrMode == "object") {
                            if (arrMode.length > 0) {
                                if (arrMode[0] == "size") {
                                    if (arrMode[1] != 'undefined') {
                                        var dat = arrMode[1].split(",");
                                        try {
                                            width = parseInt(dat[0]);
                                            height = parseInt(dat[1]);
                                        } catch (e) {

                                        }
                                    }
                                }
                            }
                        }
                    }
                    self.ui[name] = new qxnw.camera(height, width);
                    self.ui[name].addListener("upload", function (e) {
                        this.setValue(e.getData());
                    });
                    break;
                case "ckeditor":
                    self.ui[name] = new qxnw.widgets.ckeditor();
                    break;
                case "uploader":
                    var fullPath = false;
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(",");
                        var isCreatedWidget = false;
                        var randomName = false;
                        for (var i = 0; i < arrMode.length; i++) {
                            switch (arrMode[i]) {
                                case "fullPath":
                                    fullPath = true;
                                    break;
                                case "rename":
                                    randomName = true;
                                    break;
                            }
                        }
                    }
                    self.ui[name] = new qxnw.uploader(fullPath, randomName);
                    break;
                case "uploader_images":
                    self.ui[name] = new qx.ui.form.TextField();
                    self.ui[name].setPlaceholder(self.tr("Seleccione el archivo..."));
                    self.ui[name].addListener("focusin", function () {
                        var f = new qxnw.forms();
                        f.setTitle(self.tr("Administrador de imágenes"));
                        var url = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/CKImageManager/CKImageManager.php?Type=Images";
                        f.addFrame(url, false);
                        f.show();
                    });
                    break;
                case "timeField":
                    self.ui[name] = new qxnw.widgets.timeField();
                    break;
                case "radioButton":
                    self.ui[name] = new qx.ui.form.RadioButton();
                    break;
                case "button":
                    self.ui[name] = new qx.ui.form.Button(label);
                    break;
                case "textField":
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(",");
                        var isCreatedWidget = false;
                        for (var i = 0; i < arrMode.length; i++) {
                            if (arrMode[i] == "search") {
                                if (!isCreatedWidget) {
                                    self.ui[name] = new qxnw.widgets.textField();
                                    self.ui[name].setMode("search", self.classname);
                                    isCreatedWidget = true;
                                    self.ui[name].getChildControl("textfield").addListener("changeEnabled", function (e) {
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
                                }
                            } else if (arrMode[i] == "money") {
                                if (!isCreatedWidget) {
                                    self.ui[name] = new qxnw.widgets.NumericField();
                                    isCreatedWidget = true;
                                    self.ui[name].addListener("changeEnabled", function (e) {
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
                                }
                            } else {
                                if (!isCreatedWidget) {
                                    self.ui[name] = new qx.ui.form.TextField();
                                    isCreatedWidget = true;
                                    self.ui[name].addListener("changeEnabled", function (e) {
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
                                }
                            }
                            var modes = arrMode[i].split(":");
                            if (modes.length > 0) {
                                if (typeof modes[0] != 'undefined') {
                                    if (modes[0] != null) {
                                        if (modes[0] != '') {
                                            if (modes[0] == "maxCharacteres") {
                                                self.ui[name].setUserData("maxCharacteres", modes[1]);
                                                self.ui[name].addListener("input", function (e) {
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
                            self.ui[name].setUserData("key", name);
                            if (arrMode[i] == "Integer" || arrMode[i] == "integer") {
                                self.ui[name].setFilter(self._getFilterRegExp("integer"));
                            }
                            if (arrMode[i] == "String" || arrMode[i] == "string") {
                                self.ui[name].setFilter(self._getFilterRegExp("string"));
                            }
                            if (arrMode[i] == "money" || arrMode[i] == "Money") {
                                //self.ui[name].setFilter(self._getFilterRegExp("money"));
                            }
                            if (arrMode[i] == "numeric" || arrMode[i] == "Numeric") {
                                self.ui[name].setFilter(self._getFilterRegExp("numeric"));
                            }
                            if (arrMode[i] == "lowerCase") {
                                self.ui[name].addListener("input", function (e) {
                                    var upper = new qx.type.BaseString(this.getValue());
                                    this.setValue(upper.toLowerCase());
                                });
                            }
                            if (arrMode[i] == "upperCase") {
                                self.ui[name].addListener("input", function (e) {
                                    var upper = new qx.type.BaseString(this.getValue());
                                    this.setValue(upper.toUpperCase());
                                });
                            }
                        }
                    } else {
                        self.ui[name] = new qx.ui.form.TextField();
                        //self.ui[name].setFilter(self._getFilterRegExp("string"));
                        self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                        self.ui[name].addListener("changeEnabled", function (e) {
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
                    }
                    break;
                case "not_visible":
                    self.ui[name] = new qx.ui.form.TextField();
                    break;
                case "serial":
                    self.ui[name] = new qx.ui.form.TextField();
                    break;
                case "selectBox":
                    self.ui[name] = new qxnw.fields.selectBox();
                    self.ui[name].set({
                        maxHeight: 27,
                        minHeight: 27
                    });
                    self.ui[name].setUserData("name", name);
                    break;
                case "passwordField":
                    self.ui[name] = new qx.ui.form.PasswordField();
                    self.ui[name].addListener("changeEnabled", function (e) {
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
                    self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                    break;
                case "dateField":
                    self.ui[name] = new qx.ui.form.DateField();
                    var format = new qx.util.format.DateFormat("yyyy-MM-dd");
                    self.ui[name].setDateFormat(format);
                    self.ui[name].set({
                        maxHeight: 25});
                    var listenerFocus = self.ui[name].addListener("focus", function (e) {
                        this.open();
                    });
                    self.ui[name].setUserData("focus_id_listener", listenerFocus);
                    self.ui[name].getChildControl("button").addListener("click", function (e) {
                        if (self.ui[name].getUserData("enabled") != null) {
                            if (!self.ui[name].getUserData("enabled")) {
                                e.preventDefault();
                                e.stop();
                                return;
                            }
                        }
                    });
                    self.ui[name].addListener("click", function (e) {
                        if (self.ui[name].getUserData("enabled") != null) {
                            if (!self.ui[name].getUserData("enabled")) {
                                return;
                            }
                        }
                        this.open();
                    });
                    self.ui[name].addListener("keypress", function (e) {
                        if (e.getKeyIdentifier() === "Backspace") {
                            this.getChildControl('textfield').setValue('');
                        } else if (e.getKeyIdentifier() === "Escape") {
                            this.close();
                        } else {
                            e.preventDefault();
                        }
                    });
                    self.ui[name].setStringValue = function (value) {
                        if (typeof value == "string") {
                            this.getChildControl("textfield").setValue(format.parse(value));
                            return;
                        } else if (typeof value == "object") {
                            this.setValue(value);
                        }
                    };
                    self.ui[name].getChildControl("textfield").addListener("changeEnabled", function (e) {
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
                        self.ui[name].setUserData("enabled", bool);
                    });
                    break;
                case "dateTimeField":
                    self.ui[name] = new qxnw.widgets.dateTimeField();
                    self.ui[name].setDateFormat(new qx.util.format.DateFormat("yyyy-MM-dd"));
                    break;
                case "dateChooser":
                    self.ui[name] = new qx.ui.control.DateChooser();
                    break;
                case "textArea":
                    self.ui[name] = new qx.ui.form.TextArea();
                    self.ui[name].set({
                        allowShrinkY: false
                    });
                    self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                    //overrided
                    self.ui[name].addListener("changeEnabled", function (e) {
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
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(",");
                        for (var i = 0; i < arrMode.length; i++) {
                            var modes = arrMode[i].split(":");
                            if (modes.length > 0) {
                                if (typeof modes[0] != 'undefined') {
                                    if (modes[0] != null) {
                                        if (modes[0] != '') {
                                            if (modes[0] == "maxCharacteres") {
                                                self.ui[name].setUserData("maxCharacteres", modes[1]);
                                                self.ui[name].addListener("input", function (e) {
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
                            if (arrMode[i] == "lowerCase") {
                                self.ui[name].addListener("input", function (e) {
                                    var upper = new qx.type.BaseString(this.getValue());
                                    this.setValue(upper.toLowerCase());
                                });
                            }
                            if (arrMode[i] == "upperCase") {
                                self.ui[name].addListener("input", function (e) {
                                    var upper = new qx.type.BaseString(this.getValue());
                                    this.setValue(upper.toUpperCase());
                                });
                            }
                        }
                    }
                    break;
                case "spinner":
                    self.ui[name] = new qx.ui.form.Spinner(-1000000000, 0, 1000000000);
                    self.ui[name].set({
                        maxHeight: 25
                    });
                    break;
                case "tokenField":
                    self.ui[name] = new qxnw.tokenField();
                    self.ui[name].setSelectionMode('single');
                    break;
                case "checkBox":
                    self.ui[name] = new qx.ui.form.CheckBox();
                    break;
                case "checkbox":
                    self.ui[name] = new qx.ui.form.CheckBox();
                    break;
                case "selectTokenField":
                    self.ui[name] = new qxnw.widgets.selectTokenField();
                    self.ui[name].setUniqueName(self.classname + name + type + label);
                    self.ui[name].setSelectionMode('single');
                    self.ui[name].set({
                        maxHeight: 25, minHeight: 25
                    });
                    break;
                case "image":
                    self.ui[name] = new qxnw.widgets.imageViewer();
                    break;
                case "listCheck":
                    self.ui[name] = new qx.ui.form.List();
                    self.ui[name].populate = function (method, exec, data) {
                        var that = this;
                        var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method);
                        rpc.setAsync(true);
                        var func = function (r) {
                            that.removeAll();
                            for (var i = 0; i < r.length; i++) {
                                var d = r[i];
                                var item = new qx.ui.form.CheckBox(d["nombre"]);
                                item.setValue(d["value"] == "true" || d["value"] == true || d["value"] == "t" ? true : false);
                                item.setModel(d);
                                that.add(item);
                            }
                        };
                        rpc.exec(exec, data, func);
                    };
                    break;
                case "selectListCheck":
                    self.ui[name] = new qxnw.widgets.selectListCheck();
                    break;
                default:
                    qxnw.utils.alert(self.tr("Error en el tipo de objeto:") + name);
                    break;
            }
        },
        addFilterWidget: function addFilterWidget(widget) {
            this.__containerControls.add(widget);
        },
        verifyColumnType: function verifyColumnType() {
            var self = this;
            var columns = self.allColumnsData;
            var tcm = self.table.getTableColumnModel();
            var heigthAumented = false;
            var haveSearch = false;
            for (var i = 0; i < columns.length; i++) {
                var mode = columns[i].mode;
                var label = "";

                var search = false;

                if (typeof columns[i].search != 'undefined') {
                    search = columns[i].search;
                    if (haveSearch == false) {
                        haveSearch = search;
                    }
                }

                if (typeof columns[i].label != 'undefined' && columns[i].label != null) {
                    label = columns[i].label.replace("<b style='color:red'>*</b>", "");
                }
                var addition = 0;

                if (search == true || haveSearch == true) {
                    addition = 10;
                }

                var heigthHeader = addition + 32;
                if (qx.core.Environment.get("browser.name") == "ie") {
                    heigthHeader = addition + 35;
                }
                if (label.length > 20 && !heigthAumented) {
                    if (typeof self.table != 'undefined') {
                        self.table.setHeaderCellHeight(heigthHeader);
                        heigthAumented = true;
                    }
                } else if (search == true && !heigthAumented) {
                    if (typeof self.table != 'undefined') {
                        self.table.setHeaderCellHeight(heigthHeader);
                        heigthAumented = true;
                    }
                }
                if (typeof columns[i].visible != 'undefined') {
                    if (columns[i].visible == "false" || columns[i].visible === false) {
                        self.hideColumn(columns[i].caption);
                    }
                }
                if (typeof columns[i].sortable != 'undefined') {
                    if (columns[i].sortable == "false" || columns[i].sortable === false) {
                        self.tableModel.setColumnSortable(i, false);
                    }
                }
                switch (columns[i].type) {
                    case "html":
                        var htmlRender = new qx.ui.table.cellrenderer.Html();
                        tcm.setDataCellRenderer(i, htmlRender);
                        break;
                    case "numeric":
                        var numberRender = new qx.ui.table.cellrenderer.Number();
                        tcm.setDataCellRenderer(i, numberRender);
                        break;
                    case "money":
                        var numberRender = new qx.ui.table.cellrenderer.Number();
                        var numberFormat = new qx.util.format.NumberFormat().set({
                            prefix: "$ ",
                            minimumFractionDigits: 2,
                            groupingUsed: true
                        });
                        numberRender.setNumberFormat(numberFormat);
                        tcm.setDataCellRenderer(i, numberRender);
                        break;
                    case "progressbar":
                        var progress = new qx.ui.indicator.ProgressBar(0, 50);
                        tcm.setDataCellRenderer(i, progress);
                        break;
                    case "button":
                        var imageRender = new qxnw.cellrenderer.image(width, height);
                        tcm.setDataCellRenderer(i, imageRender);
                        break;
                    case "image":
                        var height = 100;
                        var width = 100;
                        var modePhpthumb = false;
                        var repeat = false;
                        var haveSizes = false;
                        if (typeof mode != 'undefined') {
                            var arrMode = mode.split(".");
                            if (typeof arrMode == 'array' || typeof arrMode == "object") {
                                if (arrMode.length > 0) {
                                    if (arrMode[0] == "size") {
                                        if (arrMode[1] != 'undefined') {
                                            var dat = arrMode[1].split(",");
                                            try {
                                                width = parseInt(dat[0]);
                                                height = parseInt(dat[1]);
                                                haveSizes = true;
                                            } catch (e) {

                                            }
                                        }
                                    } else if (arrMode[0] == "phpthumb") {
                                        modePhpthumb = true;
                                    } else if (arrMode[0] == "expand") {
                                        repeat = true;
                                    }
                                }
                            }
                        }
                        if (haveSizes == false && repeat == false) {
                            width = false;
                            height = false;
                        } else {
                            repeat = true;
                            self.setRowHeight(height + 10);
                        }
                        var isPhpThumb = false;
                        if (modePhpthumb) {
                            width = 100;
                            height = 100;
                            self.setRowHeight(height + 10);
                            isPhpThumb = true;
                        }
                        var imageRender = new qxnw.cellrenderer.image(width, height, isPhpThumb);
                        if (repeat) {
                            imageRender.setRepeat("scale");
                        }
                        if (typeof columns[i].openOnClick == 'undefined') {
                            self.__columnsImages.push(i);
                        } else if (columns[i].openOnClick == true) {
                            self.__columnsImages.push(i);
                        }
                        tcm.setDataCellRenderer(i, imageRender);
                        break;
                    case "dateField":
                        tcm.setHeaderCellRenderer(i, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", ""));
                        var dateRender = new qx.ui.table.cellrenderer.Date("left");
                        tcm.setDataCellRenderer(i, dateRender);
                        break;
                    case "date":
                        tcm.setHeaderCellRenderer(i, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", ""));
                        var dateRender = new qx.ui.table.cellrenderer.Date("left");
                        tcm.setDataCellRenderer(i, dateRender);
                        break;
                    case "passwordField":
                        var htmlRender = new qx.ui.table.cellrenderer.Password();
                        tcm.setDataCellRenderer(i, htmlRender);
                        break;
                }
                if (columns[i].type != "dateField" && search == true) {
                    if (self.getEnabledFilters() == true) {
                        tcm.setHeaderCellRenderer(i, new qxnw.table.headRender);
                    }
                }
            }
        },
        __setLegend: function __setLegend(value) {
            return true;
            //self.__box1.setLegend(value);
        },
        createBase: function () {
            return true;
        },
        getTable: function getTable() {
            var self = this;
            return self.table;
        },
        getMainTable: function getMainTable() {
            var self = this;
            return self.table;
        },
        createButtons: function createButtons(bool) {
            this.__createButtonsAutomatic = bool;
        },
        /**
         * 
         * @param object {object} the data object containing an array
         * @returns {void}
         */
        addButtons: function addButtons(data) {
            var self = this;
            var button = new qx.ui.form.Button(data["label"]).set({
                width: 90,
                maxHeight: 30
            });
            if (typeof data["icon"] != 'undefined') {
                button.setIcon(data["icon"]);
            }
            self.ui[data["name"]] = button;
            self.__containerControls.add(button);
        },
        __createButtons: function __createButtons() {
            var self = this;
            self.__addButton = new qx.ui.form.Button("Agregar").set({
                width: 90,
                maxHeight: 30
            });
            self.__addButton.setIcon(qxnw.config.execIcon("list-add"));
            self.ui["addButton"] = self.__addButton;
            self.__removeButton = new qx.ui.form.Button("Eliminar").set({
                width: 90,
                maxHeight: 30
            });
            self.__exportButton = new qx.ui.form.Button("Exportar", qxnw.config.execIcon("excel", "qxnw")).set({
                maxHeight: 30,
                show: "icon"
            });
            var tT = new qx.ui.tooltip.ToolTip(self.tr("Exportar los datos a un formato Excel"));
            self.__exportButton.setToolTip(tT);
            self.ui["exportButton"] = self.__exportButton;
            self.ui["exportButton"].addListener("execute", function () {
                var exportColumns = [];
                var columns = self.table.getTableColumnModel().getVisibleColumns();
                for (var i = 0; i < columns.length; i++) {
                    var columnId = self.table.getTableModel().getColumnId(columns[i]);
                    var columName = self.table.getTableModel().getColumnName(columns[i]);
                    var columType = self.getColumnTypeFromId(columnId);
                    if (columType == "html" || columType == "button") {
                        continue;
                    }
                    var d = {};
                    var color = null;
                    d[0] = columnId;
                    d[1] = columName;
                    d[2] = columType;
                    d[3] = color;
                    exportColumns.push(d);
                }
                var r = {};
                r["records"] = [];
                r["exportCols"] = exportColumns;
                r["records"].push(self.getAllData());
                if (r["records"][0].length == 0) {
                    qxnw.utils.information(self.tr("No hay registros para exportar"));
                    return;
                }
                r["part"] = "NavTable";
                var func = function (data) {
                    try {
                        if (typeof data.id != 'undefined') {
                            if (data.id != "") {
                                if (data.id != null) {
                                    if (typeof data.id != 'undefined') {
                                        if (typeof data.id != "") {
                                            if (typeof data.id != null) {
                                                if (qx.core.Environment.get("browser.name") == "ie") {
                                                    main.isClosedApp = true;
                                                    window.open(window.location + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key, "ExportDataIE", "width=200, height=100");
                                                } else {
                                                    main.isClosedApp = true;
                                                    window.location.href = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key;
                                                }
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        qxnw.utils.error(e);
                    }
                };
                qxnw.utils.fastAsyncRpcCall("exportExcel", "exportPHPExcelSimple", r, func);
            });
            //TODO: terminar
//            self.__removeButton.addListener("execute", function() {
//                var timer = new qx.event.Timer(2);
//                timer.addListener("interval", function() {
//                    timer.stop();
//                    try {
//                        if (self.getAllData().length > 0) {
//                            self.table.getPaneScroller(0).getTablePane().activate();
//                        }
//                    } catch (e) {
//                        console.log(e);
//                    }
//                });
//                timer.start();
//            });
            self.__removeButton.setIcon(qxnw.config.execIcon("list-remove"));
            self.ui["removeButton"] = self.__removeButton;

            self.__autoWidthButton = new qx.ui.form.Button("Ordenar ancho", qxnw.config.execIcon("format-justify-center")).set({
                maxHeight: 30,
                show: "icon"
            });
            var tT = new qx.ui.tooltip.ToolTip(self.tr("Ordenar el ancho de las columnas automáticamente"));
            self.__autoWidthButton.setToolTip(tT);
            self.ui["autoWidthButton"] = self.__autoWidthButton;
            self.__autoWidthButton.addListener("execute", function () {
                self.setAutoWidth();
            });

            self.__maximizeNavTableButton = new qx.ui.form.Button("Maximizar", qxnw.config.execIcon("view-fullscreen")).set({
                maxHeight: 30,
                show: "icon"
            });
            var tT = new qx.ui.tooltip.ToolTip(self.tr("Maximizar la tabla para mejorar la visualización de los datos"));
            self.__maximizeNavTableButton.setToolTip(tT);
            self.ui["maximizeNavTableButton"] = self.__maximizeNavTableButton;
            self.__maximizeNavTableButton.addListener("execute", function () {
                self.maximizeNavTable();
            });

            self.__containerControls.add(self.__addButton);
            self.__containerControls.add(self.__removeButton);
            self.__containerControls.add(self.__exportButton);
            self.__containerControls.add(self.__autoWidthButton);
            self.__containerControls.add(self.__maximizeNavTableButton);

            self.__containerControls.add(new qx.ui.core.Spacer(), {
                flex: 1
            });

            self._cleanFiltersButton = new qx.ui.form.Button(self.tr("Limpiar filtros"), qxnw.config.execIcon("edit-clear"));
            var tooltip = new qx.ui.tooltip.ToolTip(self.tr("Limpie los filtros que haya usado sobre esta tabla"));
            self._cleanFiltersButton.setToolTip(tooltip);

            if (this.enableFilters == false) {
                this._cleanFiltersButton.setVisibility("excluded");
            }

            self._cleanFiltersButton.addListener("execute", function () {
                self.table.cleanFiltersOnList();
            });
            self.ui["cleanFiltersButton"] = self._cleanFiltersButton;
            self.__containerControls.add(self._cleanFiltersButton);

            if (typeof self.ui["addButton"] != 'undefined') {
                if (self.ui["addButton"] != null) {
                    self.ui["addButton"].setTabIndex(qxnw.config.getActualTabIndex());
                }
            }
            if (typeof self.ui["removeButton"] != 'undefined') {
                if (self.ui["removeButton"] != null) {
                    self.ui["removeButton"].setTabIndex(qxnw.config.getActualTabIndex());
                }
            }
            if (typeof self.ui["exportButton"] != 'undefined') {
                if (self.ui["exportButton"] != null) {
                    self.ui["exportButton"].setTabIndex(qxnw.config.getActualTabIndex());
                }
            }
            if (typeof self.ui["cleanFiltersButton"] != 'undefined') {
                if (self.ui["cleanFiltersButton"] != null) {
                    self.ui["cleanFiltersButton"].setTabIndex(qxnw.config.getActualTabIndex());
                }
            }
            if (typeof self.ui["autoWidthButton"] != 'undefined') {
                if (self.ui["autoWidthButton"] != null) {
                    self.ui["autoWidthButton"].setTabIndex(qxnw.config.getActualTabIndex());
                }
            }
            if (typeof self.ui["maximizeNavTableButton"] != 'undefined') {
                if (self.ui["maximizeNavTableButton"] != null) {
                    self.ui["maximizeNavTableButton"].setTabIndex(qxnw.config.getActualTabIndex());
                }
            }
        },
        maximizeNavTable: function maximizeNavTable() {
            var self = this;
            var f = new qxnw.forms().set({
                showMinimize: false,
                showMaximize: false
            });
            f.setModal(true);
            f.setTitle(f.tr("Vista tabla :: QXNW"));
            f.ui.accept.addListener("execute", function () {
                f.reject();
            });
            f.ui.cancel.addListener("execute", function () {
                f.close();
            });
            f.masterContainer.add(self.table, {
                flex: 1
            });
            f.show();
            f.addListener("close", function () {
                self.__containerTable.add(self.table, {
                    flex: 1
                });
            });
            f.maximize();
        },
        setContextMenu: function setContextMenu(contextMenu) {
            this.__contextMenu = contextMenu;
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
            var cols = self.table.getTableColumnModel().getVisibleColumns();
            var colsCount = self.table.getTableColumnModel().getOverallColumnCount();
            for (var i = 0; i < colsCount; i++) {
                if (cols.indexOf(i) == -1) {
                    cols.push(i);
                }
            }
            qxnw.local.storeData(self.getAppWidgetName() + "_order", cols);
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
            try {
                self.tableModel.sortByColumn(columnSorted.sorted_column, columnSorted.sorted_ascending);
            } catch (e) {
                // qxnw.utils.bindError(e, self, self.model);
            }
        },
        setRowHeight: function setRowHeight(val) {
            this.table.setRowHeight(val);
        },
        setSelectionMultiple: function setSelectionMultiple() {
            this.table.setSelectionMultiple();
        },
        __createTable: function __createTable() {
            var self = this;
            var decoration = null;
            if (self.__decoration != null) {
                decoration = self.__decoration;
            }
            self.tableModel = new qxnw.table.modelFiltered();
            self.model = new qxnw.table.modelFiltered();
            self.tableModel.getToolTip = function (column, row) {
                if (column >= 0 && row >= 0) {
                    try {
                        return this.getValue(column, row);
                    } catch (e) {
                        return null;
                    }
                }
            };
            self.table = new qxnw.table.table(self.tableModel).set({
                decorator: decoration
            });
            self.table.getChildControl("statusbar").setRich(true);
//            self.table.addListener("activate", function () {
//                console.log("cae???");
//            });
            self.table.getMode = function (col) {
                var columns = self.allColumnsData;
                for (var i = 0; i < columns.length; i++) {
                    if (typeof columns[i].mode != 'undefined') {
                        if (columns[i].mode != null && columns[i].mode != '') {
                            if (i == col) {
                                return columns[i].mode;
                            }
                        }
                    }
                }
            };
            self.table.getMethod = function (col) {
                var columns = self.allColumnsData;
                for (var i = 0; i < columns.length; i++) {
                    if (typeof columns[i].method != 'undefined') {
                        if (i == col) {
                            return columns[i].method;
                        }
                    }
                }
            };
            try {
                self.table.addListener("headerColInput", function (e) {
                    self.fireDataEvent("headerColInput", e.getData());
                });
                self.table.addListener("headerColKeyPress", function (e) {
                    self.fireDataEvent("headerColKeyPress", e.getData());
                });
            } catch (e) {
                qxnw.utils.hiddenError(e);
            }

            self.table.addListener("focusin", function (e) {
                self.__isFocused = true;
                if (typeof self.command_copy != 'undefined') {
                    self.command_copy.setEnabled(true);
                }
            });
            self.table.addListener("focusout", function (e) {
                self.__isFocused = false;
                if (typeof self.command_copy != 'undefined') {
                    self.command_copy.setEnabled(false);
                }
            });

            self.command_copy = new qx.ui.command.Command('Control+C');
            var func = function () {
                if (self.__isFocused) {
                    if (typeof self.table != 'undefined') {
                        var text = self.table.getTableModel().getValue(self.table.getFocusedColumn(), self.table.getFocusedRow());
                        window.prompt(self.tr("Texto a copiar: (Presiona nuevamente CTRL+C)"), text);
                    }
                }
            };
            self.command_copy.addListener('execute', func, this);
            self.command_copy.setEnabled(false);

            //self.table.setDataRowRenderer(new qxnw.table.rowrenderer.Default(this));
            self.table.setEnabledFilters(self.getEnabledFilters());
            self.table.setParent(self);
            self.__containerTable.add(self.table, {
                flex: 1
            });
            self.table.setShowCellFocusIndicator(false);
            self.table.addListener("contextmenu", function (e) {
                if (self.getHaveParentContextMenu() == true) {
                    try {
                        if (self.__contextMenu != null) {
                            self.parent[self.__contextMenu](e, self);
                        } else {
                            self.parent.contextMenu(e);
                        }
                    } catch (e) {
                        try {
                            self.contextMenu(e);
                        } catch (e) {

                        }
                    }
                }
            });
            self.table.addListener("beforeContextmenuOpen", function () {
                self.table.resetContextMenu();
                self.table.setContextMenu(null);
            });

            self.table.addListener("cellTap", function (e) {
                var col = e.getColumn();
                var row = e.getRow();
                var type = self.getColumnTypeFromIndex(e.getColumn());
                self.table.startEditing();
                if (type == "checkBox") {
                    var val = self.getCellValue(col, row);
                    var newVal = val == true ? false : true;
                    var timer = new qx.event.Timer(100);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        this.stop();
                        self.flushEditing();
                        self.setCellValue(col, row, newVal);
                        self.table.setFocusedCell(col, row);
                    });
                }
            });
        },
        __setRpcUrl: function __setRpcUrl() {
            this.__rpcUrl = qxnw.userPolicies.rpcUrl();
        },
        getAddButton: function getAddButton() {
            return this.__addButton;
        },
        getRemoveButton: function getRemoveButton() {
            return this.__removeButton;
        },
        getExportButton: function getExportButton() {
            return this.__exportButton;
        },
        getCleanButton: function getCleanButton() {
            return this._cleanFiltersButton;
        },
        storeWidthColumn: function storeWidthColumn(e) {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            var data = e.getData();
            if (!data.isMouseAction) {
                return;
            }
            var newData = {};
            newData[data.col] = data.newWidth;
            self.__columnDataWidth[data.col] = newData;
            self.classn = "navTable_";
            try {
                if (self.parent != null) {
                    if (self.parent.classname == "qxnw.lists") {
                        self.classn += self.parent.tableAuto;
                    } else {
                        self.classn += self.parent.classname;
                    }
                }
            } catch (e) {
                qxnw.utils.bindError(e, self, self.__columnDataWidth, true, false);
                return;
            }
            try {
                qxnw.local.storeClassColumnsData(self.classn + "_navtable_list", self.__columnDataWidth);
            } catch (exc) {
                qxnw.utils.bindError(exc, self, self.__columnDataWidth, true, false);
            }
        },
        getStoredColumnWidth: function getStoredColumnWidth() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            self.classn = "navTable_";
            if (self.parent != null) {
                if (self.parent.classname == "qxnw.lists") {
                    self.classn += self.parent.tableAuto;
                } else {
                    self.classn += self.parent.classname;
                }
            }
            return qxnw.local.getData(self.classn + "_navtable_list");
        },
        setStoredColumnsWidth: function setStoredColumnsWidth() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            var columnWidth = self.getStoredColumnWidth();
            if (columnWidth == null || typeof columnWidth == 'undefined') {
                return;
            }
            for (var i = 0; i < columnWidth.length; i++) {
                var col = columnWidth[i];
                for (var key in col) {
                    var model = self.table.getTableModel();
                    var colIndex = model.getColumnIndexById(key);
                    if (typeof colIndex != 'undefined') {
                        if (typeof key != 'undefined' && typeof col[key] != 'undefined' && typeof col != 'undefined') {
                            self.table.setColumnWidth(parseInt(key), parseInt(col[key]));
                        }
                    }
                }
            }
        },
        addRegister: function addRegister() {
            var d = new qxnw.forms();
            d.setModal(true);
            d.center();
            d.show();
        },
        excludeColumn: function excludeColumn(columnName) {
            this.hideColumn(columnName);
            this.__hiddenColumns.push(columnName);
            this.table.setExcludedColumns(this.__hiddenColumns);
        },
        getBase: function getBase() {
            //return this.__containerAll;
            return this.scrollContainer;
        },
        addRows: function addRows(data) {
            var self = this;
            if (data.length == 0) {
                self.tableModel.addRows(data);
                if (self.getEnabledFilters() === true) {
                    self.tableModel.addRowInTempModel(data);
                }
            } else {
                var fixedArray = self.__objectToArrayOnColumns(data);
                self.tableModel.addRows(fixedArray);
                if (self.getEnabledFilters() === true) {
                    try {
                        self.tableModel.addRowInTempModel(fixedArray);
                    } catch (e) {
                        qxnw.utils.hiddenError(e);
                    }
                }
                self.table.setTableModel(self.tableModel);

                var propertyCellEditorFactoryFunc = function (cellInfo) {
                    var metaData = self.getColumnTypeFromColumn(cellInfo.col);
                    var mode = self.getColumnModeFromColumn(cellInfo.col);
                    var cellEditor = new qx.ui.table.celleditor.TextField;
                    switch (metaData) {
                        case "textField":
                            if (typeof mode != 'undefined' && mode == "money") {
                                cellEditor = new qxnw.celleditor.numericField;
                            } else {
                                cellEditor = new qxnw.celleditor.textField;
                            }
                            break;
                        case "checkBox":
                            cellEditor = new qx.ui.table.celleditor.CheckBox;
                            break;
                        case "checkbox":
                            cellEditor = new qx.ui.table.celleditor.CheckBox;
                            break;
                    }
                    return cellEditor;
                };

                for (var i = 0; i < self.__columns.length; i++) {
                    if (self.__types[i] == "checkbox" || self.__types[i] == "checkBox") {
                        self.tableModel.setColumnSortable(i, false);
                        self.table.getTableColumnModel().setDataCellRenderer(i, new qx.ui.table.cellrenderer.Boolean());
                    }
                    if (self.__modes[i] == "editable") {
                        var propertyCellEditorFactory = new qx.ui.table.celleditor.Dynamic(propertyCellEditorFactoryFunc);
                        self.table.getTableColumnModel().setCellEditorFactory(i, propertyCellEditorFactory);
                        self.tableModel.setColumnEditable(i, true);
                    }
                }
                if (self.__listener != null) {
                    self.table.removeListenerById(self.__listener);
                }
                self.__listener = self.table.addListener("cellTap", self._onCellClick, this, false);
                self.setStoredColumnsWidth();
            }
        },
        calculateByColumn: function calculateByColumn() {

        },
        setModelData: function setModelData(data) {
            var self = this;
            if (self.table == null || self.tableModel == null) {
                return;
            }
            for (var i = 0; i < data.length; i++) {
                for (var ia = 0; ia < self.allColumnsData.length; ia++) {
                    var type = self.allColumnsData[ia].type;
                    var name = self.allColumnsData[ia].caption;
                    switch (type) {
                        case "selectTokenField":
                            var dt = {};
                            dt["id"] = data[i][name];
                            dt["name"] = typeof data[i]["nom_" + name] != 'undefined' ? data[i]["nom_" + name] : "n/a";
                            if (typeof data[i]["options" + name] != 'undefined') {
                                dt["options"] = data[i]["options" + name];
                            }
                            data[i][name] = dt;
                            break;
                        case "tokenField":
                            var dt = {};
                            dt["id"] = data[i][name];
                            dt["name"] = typeof data[i]["nom_" + name] != 'undefined' ? data[i]["nom_" + name] : "n/a";
                            data[i][name] = dt;
                            break;
                        case "selectBox":
                            var dt = {};
                            dt["id"] = data[i][name];
                            var dat = typeof data[i]["nom_" + name] != 'undefined' ? data[i]["nom_" + name] : "n/a";
                            if (dat == "n/a") {
                                if (typeof data[i]["nombre_" + name] != 'undefined') {
                                    dat = data[i]["nombre_" + name];
                                } else if (typeof data[i][name] == "string") {
                                    dat = data[i][name];
                                }
                            }
                            dt["name"] = dat;
                            data[i][name] = dt;
                            break;
//                        case "dateField":
//                            if (data[i][name] != null) {
//                                var dt = new qx.util.format.DateFormat("yyyy-MM-dd");
//                                var date = dt.parse(data[i][name]);
//                                data[i][name] = date;
//                            }
//                            break;
                        case "dateTimeField":
                            if (data[i][name] != null) {
                                var dt = new qx.util.format.DateFormat("YYYY-M-d K:m:s");
                                var date = dt.parse(data[i][name]);
                                data[i][name] = date;
                            }
                            break;
                        case "checkBox":
                            if (data[i][name] == "f" || data[i][name] == "false" || data[i][name] == 0 || data[i][name] == "0") {
                                data[i][name] = false;
                            } else if (data[i][name] == "t" || data[i][name] == "true" || data[i][name] == 1 || data[i][name] == "1") {
                                data[i][name] = true;
                            }
                            break;
                    }
                }
            }
            try {
                self.tableModel.setData(self.__objectToArrayOnColumns(data));
            } catch (e) {
                return;
            }
            self.table.setTableModel(self.tableModel);
            if (self.__listener != null) {
                self.table.removeListenerById(self.__listener);
            }
            self.__listener = self.table.addListener("cellTap", self._onCellClick, this, false);
            self.tableModel.setStoredColumnSorted();

            var areOrdered = qxnw.local.getData("nw_auto_width_navtable_" + self.getAppWidgetName());
            if (areOrdered === null || !areOrdered) {
                self.setAutoWidth();
                qxnw.local.setData("nw_auto_width_navtable_" + self.getAppWidgetName(), true);
            }

            self.fireEvent("returnModelData");
        },
        getTotalSelectedRows: function getTotalSelectedRows() {
            var self = this;
            var selection = self.table.getSelectionModel().getSelectedCount();
            return selection;
        },
        /**
         * Remove the selected rows
         * @return {void}
         */
        removeSelectedRows: function removeSelectedRows() {
            var self = this;
            var sm = self.table.getSelectionModel();
            //sm.setBatchMode(true);
            var ranges = sm.getSelectedRanges();
            var lastCell = 0;
            for (var i = 0; i <= ranges.length; i++) {
                if (typeof ranges[i] === 'undefined') {
                    continue;
                }
                //TODO: PILAS!
                try {
                    self.tableModel.removeRows(ranges[i].minIndex, (ranges[i].maxIndex + 1) - ranges[i].minIndex);
                    lastCell = ranges[i].maxIndex - 1;
                } catch (e) {
                    console.log(e);
                }
            }

            if (lastCell < 0) {
                lastCell = 0;
            }

            var pane = self.table.getPaneScroller(0);
            var tablePane = pane.getTablePane();
            pane.activate();
            tablePane.activate();
            sm.resetSelection();
            self.table.setFocusedCell(1, lastCell);
            sm.setSelectionInterval(lastCell, lastCell);

            //self.table.getSelectionModel().setBatchMode(false);
        },
        /**
         * Try to delete the selected record. This used the <code>PHP master</code>.
         * @return {void}
         */
        __slotDelete: function __slotDelete() {
            var self = this;
            var selectedRows = self.getTotalSelectedRows();
            var r = {};
            if (selectedRows > 1) {
                r.detail = self.selectedRecords();
                r["records"] = selectedRows;
            } else {
                r = self.selectedRecord();
            }
            if (r == 'undefined') {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            r["table"] = self.tableAuto;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "Master");
            rpc.setAsync(true);
            var func = function () {
                self.removeSelectedRows();
            };
            rpc.exec("delete", r, func);
        },
        _onCellClick: function _onCellClick(e) {
            var self = this;
            if (self.__modes[e.getColumn()] == "editable") {
                if (self.__types[e.getColumn()] == "checkbox") {
                    if (self.table.getTableModel().getValue(e.getColumn(), e.getRow()) == true) {
                        self.table.getTableModel().setValue(e.getColumn(), e.getRow(), false);
                    } else {
                        self.table.getTableModel().setValue(e.getColumn(), e.getRow(), true);
                    }
                }
            }
        },
        populate: function populate(method, func, data) {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method, true);
            var callback = function (r) {
                if (typeof r.records != 'undefined' && r.records.length > 0) {
                    self.setModelData(r.records);
                } else {
                    self.setModelData(r);
                }
            };
            rpc.exec(func, data, callback);
        },
        hideButtons: function hideButtons() {
            var self = this;
            self.__containerControls.setVisibility("excluded");
        },
        showButtons: function showButtons() {
            var self = this;
            self.__containerControls.setVisibility("visible");
        },
        disableButtons: function disableButtons() {
            var self = this;
            self.__addButton.setEnabled(false);
            self.__removeButton.setEnabled(false);
            self.__exportButton.setEnabled(false);
        },
        enableButtons: function enableButtons(bool) {
            var self = this;
            self.__addButton.setEnabled(bool);
            self.__removeButton.setEnabled(bool);
            self.__exportButton.setEnabled(bool);
            if (typeof self._cleanFiltersButton != 'undefined') {
                if (self._cleanFiltersButton != null) {
                    self._cleanFiltersButton.setEnabled(bool);
                }
            }
        },
        removeAllRowsNoModel: function removeAllRowsNoModel() {
            var self = this;
            var data = self.getAllData();
            for (var i = data.length; i >= 0; i--) {
                self.removedStore.push(self.tableModel.getRowDataAsMap(i));
                self.tableModel.removeRows(i, 1);
            }
            return false;
        },
        removeAllRows: function removeAllRows() {
            var self = this;
            self.__createModel();
            self.table.updateContent();
            return;
        },
        removeSelectedRow: function removeSelectedRow() {
            var self = this;

            var sm = self.table.getSelectionModel();
            var srs = sm.getSelectedRanges();
            var dataLen = self.tableModel.getData().length;

            var lastCell = 0;
            var row = self.table.getFocusedRow();
            var focusedColumn = self.table.getFocusedColumn();
            if (row == null) {
                qxnw.utils.information("Seleccione un registro");
                return;
            }
            self.removedStore.push(self.tableModel.getRowDataAsMap(row));
            self.tableModel.removeRows(row, 1);

            if (srs !== null && typeof srs.length !== 'undefined') {
                if (typeof srs[0] !== 'undefined') {
                    if (typeof srs[0].minIndex !== 'undefined' && typeof srs[0].maxIndex !== 'undefined') {
                        var subst = 0;
                        if (dataLen - 1 <= srs[0].maxIndex) {
                            lastCell = dataLen - 2;
                        } else {
                            lastCell = srs[0].maxIndex;
                        }
                    }
                }
            }

            self.table.setShowCellFocusIndicator(true);

            var pane = self.table.getPaneScroller(0);
            var tablePane = pane.getTablePane();
            pane.activate();

            tablePane.activate();

            if (srs !== null && typeof srs.length !== 'undefined') {
                if (typeof srs[0] !== 'undefined') {
                    if (typeof srs[0].minIndex !== 'undefined' && typeof srs[0].maxIndex !== 'undefined') {
                        try {
                            sm.setSelectionInterval(srs[0].minIndex, lastCell);
//                            sm.setSelectionInterval(srs[0].minIndex, srs[0].maxIndex);
                            self.table.setFocusedCell(focusedColumn, lastCell);
                        } catch (e) {

                        }
                    }
                }
            }

        },
        getRemovedItemsFromStore: function getRemovedItemsFromStore() {
            return this.removedStore;
        },
        removeRowByIndex: function removeRowByIndex(index, numToDelete) {
            this.tableModel.removeRows(index, typeof numToDelete == 'undefined' ? 1 : numToDelete);
        },
        removeRowById: function removeRowById(id) {
            var data = this.getAllData();
            for (var i = 0; i < data.length; i++) {
                if (typeof data[i].id != 'undefined') {
                    if (id == data[i].id) {
                        this.removeRowByIndex(i);
                        return true;
                    }
                }
            }
            return false;
        },
        getColumnTypeFromName: function getColumnTypeFromName(name) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].label == name) {
                    if (typeof columns[i].type != 'undefined') {
                        return columns[i].type;
                    } else {
                        return "";
                    }
                }
            }
        },
        getColumnTypeFromCaption: function getColumnTypeFromCaption(name) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].caption == name) {
                    if (typeof columns[i].type != 'undefined') {
                        return columns[i].type;
                    } else {
                        return "";
                    }
                }
            }
        },
        __objectToArrayOnColumns: function objectToArrayOnColumns(obj) {
            var self = this;
            var cols = new Array();
            var data = new Array();
            for (var i = 0; i < obj.length; i++) {
                var count = 0;
                var dat = [];
                for (cols in obj[i]) {
                    var type = self.getColumnTypeFromId(cols);
                    if (cols == "id" || self.getColumnTypeFromCaption(qxnw.utils.lowerFirst(cols)) == "integer") {
                        dat[self.columnIndexFromName(cols)] = obj[i][cols] == null ? "" : obj[i][cols] == "t" ? true : obj[i][cols] == "f" ? false : parseInt(obj[i][cols]);
                        if (isNaN(dat[self.columnIndexFromName(cols)])) {
                            dat[self.columnIndexFromName(cols)] = "";
                        }
                    } else if (cols == "id" || type == "integer" || type == "money" || type == "numeric") {
                        dat[qxnw.utils.lowerFirst(self.columnIndexFromName(cols))] = obj[i][cols] == null ? "" : parseFloat(obj[i][cols]);
                    } else if (self.getColumnTypeFromCaption(qxnw.utils.lowerFirst(cols)) == "checkbox" || self.getColumnTypeFromCaption(qxnw.utils.lowerFirst(cols)) == "checkBox") {
                        if (obj[i][cols] == null) {
                            dat[self.columnIndexFromName(cols)] = false;
                        } else if (obj[i][cols] == "1") {
                            dat[self.columnIndexFromName(cols)] = true;
                        } else if (obj[i][cols] == "0") {
                            dat[self.columnIndexFromName(cols)] = false;
                        } else if (obj[i][cols] == "t") {
                            dat[self.columnIndexFromName(cols)] = true;
                        } else if (obj[i][cols] == "f") {
                            dat[self.columnIndexFromName(cols)] = false;
                        } else if (obj[i][cols] == "true") {
                            dat[self.columnIndexFromName(cols)] = true;
                        } else if (obj[i][cols] == "false") {
                            dat[self.columnIndexFromName(cols)] = false;
                        } else {
                            dat[self.columnIndexFromName(cols)] = parseInt(obj[i][cols]);
                        }

                        //dat[self.columnIndexFromName(cols)] = obj[i][cols] == null ? false : obj[i][cols] == "1" ? true : obj[i][cols] == "0" ? false : parseInt(obj[i][cols]);
                    } else {
                        dat[self.columnIndexFromName(cols)] = obj[i][cols] == null ? "" : obj[i][cols] == "t" ? true : obj[i][cols] == "f" ? false : obj[i][cols];
                    }

                    if (typeof obj[i][cols] == "boolean") {
                        var w = 5;
                    } else if (typeof obj[i][cols] == "object") {
                        if (obj[i][cols] == null) {
                            var w = 5;
                        } else {
                            var w = (typeof obj[i][cols]["name"] != 'undefined' && obj[i][cols]["name"] != null) ? obj[i][cols]["name"].length : 0;
                        }
                    } else {
                        var w = (typeof obj[i][cols] != 'undefined' && obj[i][cols] != null) ? obj[i][cols].length : 0;
                    }

                    if (typeof self.__aproxWidthCols[qxnw.utils.lowerFirst(self.columnIndexFromName(cols))] != 'undefined') {
                        if (self.__aproxWidthCols[qxnw.utils.lowerFirst(self.columnIndexFromName(cols))] < w) {
                            self.__aproxWidthCols[qxnw.utils.lowerFirst(self.columnIndexFromName(cols))] = w + 1;
                        }
                    } else {
                        self.__aproxWidthCols[qxnw.utils.lowerFirst(self.columnIndexFromName(cols))] = w + 1;
                    }

                    count++;
                }
                data.push(dat);
            }
            return data;
        },
        columnNameFromIndex: function columnNameFromIndex(index) {
            var self = this;
            for (var i = 0; i < self.__captions.length; i++) {
                if (i == index) {
                    return self.__captions[i];
                }
            }
            return -1;
        },
        columnIndexFromName: function columnIndexFromName(columnName) {
            var self = this;
            for (var i = 0; i < self.__captions.length; i++) {
                if (self.__captions[i] == columnName) {
                    return i;
                }
            }
            return -1;
        },
        setColumns: function setColumns(columns) {
            var self = this;
            self.allColumnsData = columns;
            self.setUniqueInteger(columns.length);
            for (var i = 0; i < columns.length; i++) {
                self.__columns[i] = typeof columns[i].label != 'undefined' ? columns[i].label.replace("_", " ") : "";
                self.__captions[i] = columns[i].caption;
                self.__types[i] = columns[i].type;
                self.__modes[i] = columns[i].mode;
            }
            self.__createModel();

            var propertyCellEditorFactoryFunc = function (cellInfo) {
                var metaData = self.getColumnTypeFromColumn(cellInfo.col);
                var mode = self.getColumnModeFromColumn(cellInfo.col);
                var cellEditor = new qx.ui.table.celleditor.TextField;
                switch (metaData) {
                    case "textField":
                        if (typeof mode != 'undefined' && mode == "money") {
                            cellEditor = new qxnw.celleditor.numericField;
                        } else {
                            cellEditor = new qxnw.celleditor.textField;
                        }
                        break;
                    case "checkBox":
                        cellEditor = new qxnw.celleditor.checkBox;
                        break;
                    case "checkbox":
                        cellEditor = new qxnw.celleditor.checkBox;
                        break;
                    case "selectBox":
                        cellEditor = new qxnw.celleditor.selectBox();
                        break;
                }
                return cellEditor;
            };

            self.totalText.removeAll();
            var item = new qxnw.widgets.listItem(self.tr("Seleccione...")).set({
                rich: true
            });
            self.totalText.add(item);

            for (var i = 0; i < self.allColumnsData.length; i++) {
                if (self.__types[i] == "checkbox" || self.__types[i] == "checkBox") {
                    self.tableModel.setColumnSortable(i, false);
                    self.table.getTableColumnModel().setDataCellRenderer(i, new qxnw.cellrenderer.checkBox());
                } else if (self.__types[i] == "selectBox") {
                    var renderer = new qx.ui.table.cellrenderer.Replace;
                    var replaceFunction = function (cellInfo) {
                        if (typeof cellInfo == 'undefined') {
                            return;
                        }
                        var value = cellInfo.name;
                        return value;
                    };
                    renderer.setReplaceFunction(replaceFunction);
                    renderer.addReversedReplaceMap();
                    self.table.getTableColumnModel().setDataCellRenderer(i, renderer);
                }
                var editable = false;
                if (typeof self.allColumnsData[i].editable != 'undefined') {
                    if (self.allColumnsData[i].editable == true) {
                        editable = true;
                    }
                }
                if (self.__modes[i] == "editable") {
                    editable = true;
                }
                if (editable === true) {
                    self.__colsEditable.push(self.__captions[i]);
                    var propertyCellEditorFactory = new qx.ui.table.celleditor.Dynamic(propertyCellEditorFactoryFunc);
                    self.table.getTableColumnModel().setCellEditorFactory(i, propertyCellEditorFactory);
                    self.tableModel.setColumnEditable(i, true);
                }
                var item = new qxnw.widgets.listItem(typeof columns[i].label != 'undefined' ? columns[i].label.replace("_", " ") : "").set({
                    rich: true
                });
                item.setModel(self.allColumnsData[i].caption);
                self.totalText.add(item);
            }

            self.table.addListener("cellTap", function (e) {
                var col = e.getColumn();
                var caption = self.getColumnIdFromIndex(col);
                for (var i = 0; i < self.__colsEditable.length; i++) {
                    if (self.__colsEditable[i] == caption) {
                        self.table.startEditing();
                    }
                }
            });

            self.table.setRowFocusChangeModifiesSelection(true);
        },
        getAppWidgetName: function getAppWidgetName() {
            var name = this.classname;
            if (name === "qxnw.lists" || name === "qxnw.navtable") {
                name = this.getUserData("table");
            }
            if (this.parent !== null) {
                if (typeof this.parent.getAppWidgetName !== 'undefined') {
                    try {
                        name = this.parent.getAppWidgetName();
                    } catch (e) {

                    }

                }
            }
            if (name === null) {
                name = "qxnw.lists_qxnw.navtable_" + this.getUniqueInteger();
            }
            return name;
        },
        getColumnTypeFromId: function getColumnTypeFromId(name) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].caption == name) {
                    if (typeof columns[i].type != 'undefined') {
                        return columns[i].type;
                    } else {
                        return "";
                    }
                }
            }
        },
        __createModel: function __createModel() {
            var self = this;
            self.tableModel = new qxnw.table.modelFiltered();
            self.tableModel.setParent(self);
            self.tableModel.getToolTip = function (column, row) {
                if (column >= 0 && row >= 0) {
                    try {
                        return this.getValue(column, row);
                    } catch (e) {
                        return null;
                    }
                }
            };
            self.tableModel.setColumns(self.__columns, self.__captions);
            self.table.setTableModel(self.tableModel);
            self.table.setStoredColumnsWidth();

            if (self.tableAuto == null) {
                self.table.applySavedConfigurations();
            }

            self.verifyColumnType();
            if (self.__columnsImages.length > 0) {
                self.table.addListener("cellTap", function (e) {
                    var col = e.getColumn();
                    if (self.__columnsImages.indexOf(col) != -1) {
                        var row = e.getRow();
                        var value = self.tableModel.getValue(col, row);
                        //TODO: por probar bien: && e.getButton() == "left"
                        if (value != null && value != "") {
                            var f = new qxnw.forms();
                            f.setMinWidth(350);
                            f.setMinHeight(350);
                            f.setModal(true);
                            f.setTitle(self.tr("Visor de imágenes"));
                            f.createFlexPrinterToolBar(value);
                            f.addFrame(value, false);
                            f.show();
                        }
                    }
                });
            }
        },
        getData: function getData() {
            return this.getAllData();
        },
        getAllRecords: function getAllRecords() {
            return this.getAllData();
        },
        removeStoredRows: function removeStoredRows(data) {
            var self = this;
            var hidingStore = [];
            for (var ib = 0; ib < data.length; ib++) {
                var counter = 0;
                for (var i = 0; i < self.removedStore.length; i++) {
                    if (qxnw.utils.equalArray2d(self.removedStore[i], data[ib]) === true) {
                        hidingStore.push(ib);
                    }
                    counter++;
                }
            }
            var hidden = 0;
            for (var id = 0; id < hidingStore.length; id++) {
                var row = hidingStore[id];
                var count = 1;

                while (i + 1 < hidingStore.length && hidingStore[id] == hidingStore[id + 1] - 1) {
                    count++;
                    id++;
                }
                self.tableModel.removeRows(row - hidden, count, false);
                data.splice(row - hidden, count);
                hidden += count;
            }
            return data;
        },
        getAllVisibleData: function getAllVisibleData() {
            var self = this;
            var data = self.tableModel.getData();
            var all = [];
            for (var i = 0; i < data.length; i++) {
                var arr = {};
                for (var ia = 0; ia < data[i].length; ia++) {
                    arr[self.columnNameFromIndex(ia)] = data[i][ia];
                }
                all.push(arr);
            }
            return all;
        },
        getAllData: function getAllData() {
            var self = this;
            try {
                if (self.table.isEditing()) {
                    self.table.stopEditing();
                }
            } catch (e) {
                qxnw.utils.error(e);
            }
            var filters = null;
            if (typeof self.tableModel != 'undefined') {
                if (typeof self.tableModel.Filters != 'undefined') {
                    filters = self.tableModel.Filters;
                }
            }
            if (self.getEnabledFilters() === true) {
                self.tableModel.resetHiddenRows();
            }
            var data = self.tableModel.getData();
            var all = [];
            for (var i = 0; i < data.length; i++) {
                var arr = {};
                for (var ia = 0; ia < data[i].length; ia++) {
                    arr[self.columnNameFromIndex(ia)] = data[i][ia];
                }
                all.push(arr);
            }
            if (self.getEnabledFilters() === true) {
                var rta = self.removeStoredRows(all);
                if (typeof filters != 'undefined') {
                    if (filters != null) {
                        if (typeof filters.length != 'undefined') {
                            if (filters.length > 0) {
                                self.tableModel.Filters = filters;
                                self.tableModel.applyFilters();
                            }
                        }
                    }
                }
                return rta;
            } else {
                return all;
            }
        },
        getSelectedRecordIndex: function getSelectedRecordIndex() {
            return this.table.getFocusedRow();
        },
        getSelectedRecord: function getSelectedRecord() {
            return this.selectedRecord();
        },
        selectedRecord: function selectedRecord() {
            var self = this;
            var row = self.table.getFocusedRow();
            if (row == null) {
                return null;
            }
            var columns = self.tableModel.getColumnCount();
            var r = {};
            for (var i = 0; i < columns; i++) {
                var data = self.tableModel.getValue(i, row);
                r[self.__captions[i]] = data;
            }
            return r;
        },
        hideColumn: function hideColumn(columnName, bool) {
            var self = this;
            if (typeof bool == 'undefined') {
                bool = false;
            }
            var column = self.columnIndexFromName(columnName);
            if (column === -1) {
                qxnw.utils.bindError("La columna " + columnName + " no existe. Class: navTable, line 394", self, columnName);
                return;
            }
            try {
                self.table.getTableColumnModel().setColumnVisible(column, bool);
            } catch (e) {
                qxnw.utils.bindError(e, self, column);
            }
        }
    }
});