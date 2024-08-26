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
 * List style and all functionality for your lists. You can create a list very fast! <code>var f = new qxnw.forms(); f.show();</code> 
 */
qx.Class.define("qxnw.lists", {
    extend: qxnw.forms,
    construct: function construct(empty) {
        var self = this;
        self.up = qxnw.userPolicies.getUserData();
        if (typeof empty != 'undefined') {
            self.__empty = empty;
        }
        this.base(arguments);
        self.setAlwaysOnTop(true);
        this.__font = qxnw.utils.populateConfig(this);
        self.addListener("focusin", function (e) {
            self.__isFocused = true;
            if (typeof self.__command_copy !== 'undefined' && self.__command_copy !== null) {
                self.__command_copy.setEnabled(true);
            }
        });
        self.addListener("focusout", function (e) {
            self.__isFocused = false;
            if (typeof self.__command_copy !== 'undefined' && self.__command_copy !== null) {
                self.__command_copy.setEnabled(false);
            }
        });
        self.setRpcUrl();
        self.ui = {};

        self.tabView = new qx.ui.tabview.TabView();
        self.tabView.setBarPosition("left");
        self.tabView.setContentPadding(0);
        self.__parentContainer = new qx.ui.tabview.Page("", qxnw.config.execIcon("utilities-log-viewer", "apps"));
        self.__parentContainer.getChildControl("button").setShow("icon");
        var tT = new qx.ui.tooltip.ToolTip(self.tr("Listado general de datos"), qxnw.config.execIcon("help-faq"));
        self.__parentContainer.getChildControl("button").setToolTip(tT);
        self.__parentContainer.getChildControl("button").setAllowGrowY(false);
        self.__parentContainer.getChildControl("button").setAllowGrowX(false);
        self.__parentContainer.getChildControl("button").setPadding(1);
        self.__parentContainer.getChildControl("button").setVisibility('excluded');
        self.__parentContainer.setLayout(new qx.ui.layout.HBox());
        self.tabView.add(self.__parentContainer);
        self.__verticalContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
        self.__parentContainer.add(self.__verticalContainer, {
            flex: 1
        });

        self.masterContainer.getQxnwType = function () {
            return "qxnw_list_master_container";
        };

        self.masterContainer.add(self.tabView, {
            flex: 1
        });

        self.baseLayout = new qx.ui.layout.HBox();
        self.setLayout(this.baseLayout);
        self.setContentPadding(1);
        self.settings = {};
        self.columns = [];
        self.captions = [];
        self.types = [];
        self.type = [];
        self.containerFieldsArray = [];
        self.count = 0;
        self.__permissionsLists = [];
        self.__columnDataWidth = [];
        self.createBase();
        self.processFired = [];
        self.__visibleColumns = [];
        self.__focusTablePaneScroll = true;
        self.addListener("appear", function () {
            self.handleFocus();
            self.populateColumnColors();
            self.hideAllColumns();
            self.execSettings();
        });

        self.__colorHeaders = [];

        self.labelForm = {};
        self.__dataTableTextInformation = {};
//        qx.ui.core.FocusHandler.getInstance().addRoot(self);

        self.__hiddenColumns = [];
        self.__hiddenColumnsModel = [];
        self.__columnsImages = [];
        self.__toolTipColumns = [];
        self.__separatorsnw = [];
        self.__columnTypesSetted = [];
        self.__filtersRequireds = [];
        self.__aproxWidthCols = {};
        self.__formSaveCmi = null;

        self.addListener("close", function (e) {
            self.cleanAll();
        });
    },
    destruct: function () {
        if (qxnw.utils.isDebug()) {
            if (qxnw.config.getShowDestroyObjects() == true) {
                console.log("%c<<<< Destroy LIST >>>>", 'background: #53674F; color: #bada55');
                console.log("Form name: ", this.getAppWidgetName());
                console.log("%c<<<< END >>>>", 'background: #53674F; color: #bada55');
            }
        }
        try {
            if (this.__timer != null) {
                if (this.__timer.classname == "qx.event.Timer") {
                    if (this.__timer.getEnabled()) {
                        this.__timer.stop();
                        this._disposeObjects("__timer");
                    }
                }
            }
            this.destroy();

            if (this.__command_copy !== null) {
                try {
                    this.__command_copy.removeListenerById(this.__command_copy_listener);
                } catch (e) {
                    console.log(e);
                }
            }

            this._disposeArray("__aproxWidthCols");
            this.__columnsImages = null;
            this._disposeArray("__separatorsnw");
            this._disposeArray("labelForm");

            this._disposeObjects("__applyFiltersCommand");
            this._disposeObjects("__orderBy");
            this._disposeObjects("containerFooterTools");
            this._disposeObjects("containerTable");
            this._disposeObjects("containerTools");
            this._disposeObjects("containerFilters");
            this._disposeObjects("containerFiltersInputs");
            this._disposeObjects("table");
            this._disposeObjects("widget");
            this._disposeObjects("baseLayout");
            this._disposeObjects("composite");
            this._disposeObjects("propertyCellEditorFactory");
            this._disposeObjects("__containerPagination");
            this._disposeObjects("__metaColumn");
            if (typeof this.ui != 'undefined') {
                if (this.ui != null) {
                    for (var i = 0; i < this.ui.length; i++) {
                        this._disposeObjects(this.fields[i]);
                    }
                }
            }
            this.dispose();
        } catch (e) {
            console.log(e);
            this.dispose();
            //qxnw.utils.bindError(e, this, 0, true, false);
        }
    },
    events: {
        "populated": "qx.event.type.Event",
        "loadedTable": "qx.event.type.Event",
        "storedSize": "qx.event.type.Event",
        "NWChangeFieldVisibility": "qx.event.type.Event",
        "returnModelData": "qx.event.type.Event",
        "returnModelDataQuery": "qx.event.type.Event",
        "applyFilters": "qx.event.type.Event",
        "headerColKeyPress": "qx.event.type.Data",
        "headerColInput": "qx.event.type.Data",
        "areLoadedColumns": "qx.event.type.Data",
        "populateTotalColumns": "qx.event.type.Data"
    },
    properties: {
        normalizeColumns: {
            init: false,
            check: "Boolean"
        },
        isListEdit: {
            init: false
        },
        handleCountryPermissons: {
            init: true,
            refine: true
        },
        handleTerminalPermissons: {
            init: true,
            refine: true
        },
        totalListRecords: {
            init: 0
        },
        numeroModulo: {
            init: null,
            check: "Integer"
        },
        allPermissions: {
            init: null,
            refine: true
        },
        appName: {
            init: false,
            refine: true
        },
        colorsRendererId: {
            init: 1,
            check: "Integer"
        },
        qxnwType: {
            init: "qxnw_list",
            refine: true
        },
        showCellFocusIndicator: {
            init: true,
            check: "Boolean"
        },
        closeListenerId: {
            init: null
        },
//        resizeListenerId: {
//            init: null
//        },
        moveListenerId: {
            init: null
        },
        appearListenerId: {
            init: null
        },
        showLoading: {
            init: true,
            check: "Boolean"
        },
        haveUpdateConfig: {
            init: true,
            check: "Boolean"
        },
        forceContextMenu: {
            init: false,
            check: "Boolean"
        },
        disableConfigPosition: {
            init: false,
            check: "Boolean"
        },
        name: {
            init: null,
            refine: true
        },
        table: {
            init: null,
            check: "String"
        },
        frameUrl: {
            init: null,
            refine: true
        },
        metaColumnStatic: {
            init: false,
            check: "Boolean"
        },
        saveFooterToolbarSettings: {
            init: true,
            check: "Boolean"
        }
    },
    members: {
        __formSaveCmi: null,
        containerDateTool: null,
        lblStatusDate: null,
        containerFieldsArray: null,
        __queryLoaded: null,
        __getQuery: false,
        __command_copy: null,
        __command_copy_listener: null,
        __developerContainer: null,
        __note: "",
        __toolTipColumns: null,
        __alreadyMakeAutoUpdate: false,
        __colorHeaders: null,
        totalCompareCol: null,
        __isNewFilter: true,
        __leftOptionsContainer: null,
        __compositeOrderBy: null,
        __toolsButton: null,
        containerPagination: null,
        totalCompareValue: null,
        totalValue: null,
        part4: null,
        tabView: null,
        __applyFiltersCommand: null,
        __closeOrMinimize: null,
        __parentContainer: null,
        __isPopulated: false,
        __separImp: null,
        __printIdListener: null,
        __exportIdListener: null,
        __importIdListener: null,
        __contextMenuIdListener: null,
        __acceptExportButton: null,
        __empty: false,
        page: null,
        totalText: null,
        __dataTableTextInformation: null,
        areSubWindow: false,
        skeleton: null,
        mainContainer: null,
        baseLayout: null,
        modal: null,
        composite: null,
        ui: null,
        settings: null,
        __labelTotalPags: null,
        __exportDataVar: false,
        model: null,
        columns: null,
        captions: null,
        types: null,
        allColumnsData: null,
        decoration: null,
        lineEdit: null,
        buttonAdd: null,
        buttonEdit: null,
        buttonDelete: null,
        buttonCancel: null,
        buttonSearch: null,
        __containerPagination: null,
        table: null,
        buttonsAutomatic: false,
        toolBar: null,
        filters: null,
        __orderBy: null,
        selectAllButton: null,
        rpcUrl: null,
        type: null,
        count: null,
        containerTools: null,
        containerFilters: null,
        containerTable: null,
        tableAuto: null,
        __tableMethodLists: null,
        tableExec: null,
        __mainForm: true,
        __serialColumn: null,
        __funcLists: null,
        __cm: null,
        __totalColumn: null,
        __typeOfCalc: null,
        __behavior: null,
        __multiCell: false,
        __permissionsLists: null,
        __havePermissions: false,
        __columnDataWidth: null,
        __saveVisibility: true,
        __storedConfiguration: null,
        __font: null,
        __timerInit: 0,
        __timer: null,
        __isTimerCreated: null,
        __isPutCatchedContent: false,
        __isCreatedBaseLists: false,
        m: null,
        __name: null,
        __isExecSettings: false,
        __isPosicionedLists: false,
        __spacer: null,
        __frameListsUrl: null,
        __frameLists: null,
        __isFocused: false,
        containerFooterTools: null,
        __footerNotesBar: null,
        __columnEditable: null,
        propertyCellEditorFactory: null,
        __tabIndexLists: qxnw.config.getActualTabIndex(),
        __tabIndexListsFooter: qxnw.config.getActualTabIndex(),
        processFired: null,
        mantainFirstColumn: null,
        __visibleColumns: null,
        __metaColumn: null,
        labelMaxRows: null,
        maxRows: null,
        maxRowsValue: null,
        isStartedToolTip: false,
        __focusTablePaneScroll: true,
        up: null,
        __hiddenColumns: null,
        p_filter: null,
        __areChangeFilterModel: false,
        __columnsImages: null,
        moduloId: 0,
        desktop: null,
        dynamicFiltersWidget: null,
        dt: null,
        __idListenerCellTap: null,
        __tableDescription: null,
        __functionsCount: 0,
        functionsNavTable: null,
        functionsSavedNavTable: null,
        realColumsData: null,
        __timerMeta: null,
        metaColumnAdded: null,
        __haveAlreadyMulticellFunctionsButtons: false,
        focusOnModelData: true,
        __tableFields: null,
        useOtherDB: null,
        __separatorsnw: null,
        __dateFormat: null,
        __formatter: null,
        __aproxWidthCols: null,
        __counterLetters: null,
        __counterWords: null,
        __autoWidthButton: null,
        getAutoWidthButton: function getAutoWidthButton() {
            return this.__autoWidthButton;
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

                    if (typeof self.captions[w] != 'undefined') {
                        if (width < self.captions[w].length || isNaN(width)) {
                            width = self.captions[w].length;
                        }
                    }

                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var text = ctx.measureText("0".repeat(width));
                    var rw = parseInt(text.width) + 22;

                    try {
                        if (typeof self.captions[w] != 'undefined') {
                            var type = self.getColumnTypeFromId(self.captions[w]);
                            if (type == "money") {
                                rw = rw + 20;
                            } else if (type == "image") {
                                continue;
                            } else if (type == "html") {
                                continue;
                            }
                        }
                    } catch (e) {

                    }

                    if (rw > 450) {
                        rw = 450;
                        if (typeof self.captions[w] != 'undefined') {
                            for (var i = 0; i < self.allColumnsData.length; i++) {
                                if (self.allColumnsData[i].caption == self.captions[w]) {
                                    if (typeof self.allColumnsData[i].mode == 'undefined' || self.allColumnsData[i].mode == null) {
                                        self.allColumnsData[i].mode = "toolTip";
                                    } else {
                                        if (self.allColumnsData[i].mode.indexOf("toolTip") == -1) {
                                            self.allColumnsData[i].mode = self.allColumnsData[i].mode + ",toolTip";
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    if (typeof rw == 'undefined') {
                        continue;
                    }
                    if (typeof w == 'undefined') {
                        continue;
                    }
                    try {
                        cm.setColumnWidth(parseInt(w), rw);
                    } catch (e) {
                        continue;
                    }

                    self.table.storeColumnsWidth(false, parseInt(w), rw);

                    delete canvas;
                    delete ctx;
                    delete text;

                    canvas = null;
                    ctx = null;
                    text = null;
                }
                self.startToolTip();
            } catch (e) {
                qxnw.utils.error(e);
            }
        },
        setColumnWidth: function setColumnWidth(index, width) {
            var tcm = this.table.getTableColumnModel();
            var columns = tcm.getVisibleColumns();
            for (var i = 0; i < columns.length; i++) {
                if (i == index) {
                    tcm.setColumnWidth(i, width);
                    break
                }
            }
        },
        setOtherDB: function setOtherDB(useOtherDB) {
            this.useOtherDB = useOtherDB;
        },
        getOtherDB: function getOtherDB() {
            return this.useOtherDB;
        },
        setFocusOnModelData: function setFocusOnModelData(val) {
            this.focusOnModelData = val;
            this.__focusTablePaneScroll = val;
        },
        removeFromImagesOnTap: function removeFromImagesOnTap(index) {
            if (this.__columnsImages != null) {
                for (var i = 0; i < this.__columnsImages.length; i++) {
                    if (this.__columnsImages[i] == index) {
                        this.__columnsImages.splice(i, 1);
                    }
                }
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
        addRows: function addRows(data) {
            var self = this;
            if (data.length == 0) {
                self.model.addRows(data);
                self.model.addRowInTempModel(data);
            } else {
                var fixedArray = self.objectToArrayOnColumns(data);
                self.model.addRows(fixedArray);
                try {
                    self.model.addRowInTempModel(fixedArray);
                } catch (e) {
                    qxnw.utils.hiddenError(e);
                }
                self.table.setTableModel(self.model);
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
        getHeaderWidgetColumnSearchByColId: function getHeaderWidgetColumnSearchByColId(col) {
            var paneHeaderWidget = this.table.getPaneScroller(0).getHeader();
            var hcr = paneHeaderWidget.getHeaderWidgetAtColumn(col);
            var rta = null;
            if (typeof hcr.getInsideWidget == 'function') {
                rta = hcr.getInsideWidget();
            }
            return rta;
        },
        getHtmlTableAndFilters: function getHtmlTableAndFilters(data) {
            var html = "";
            var filtersData = this.getFiltersData();
            var html = "<table border='0'>";
            html += "<tbody>";
            html += "<tr>";
            var count = 0;
            for (var v in filtersData) {
                if (filtersData[v] != null) {
                    if (filtersData[v] != '') {
                        if (typeof filtersData[v] != "array") {
                            if (typeof filtersData[v] != "object") {
                                if (v != "sort") {
                                    if (v != "export") {
                                        if (v != "count") {
                                            if (v != "page") {
                                                if (v != "part") {
                                                    if (v != "sorted") {
                                                        if (v != "sorted_name") {
                                                            if (v != "rowHeight") {
                                                                if (v.indexOf("_label") == -1) {
                                                                    html += "<th>";
                                                                    html += "<b>" + qxnw.utils.ucfirst(v.replace("_", " ")) + "</b>";
                                                                    html += ":  ";
                                                                    html += "</th>";
                                                                    html += "<th>";
                                                                    html += filtersData[v];
                                                                    html += "</th>";
                                                                    count++;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (count > 0) {
                html += "<tr>";
                for (var i = 0; i < count; i++) {
                    html += "<th>";
                    html += "</th>";
                }
                html += "</tr>";
            }
            html += "</tr>";
            html += "</tbody>";
            html += "</table>";
            html += this.getHtmlTable(data);
            return html;
        },
        getHtmlTable: function getHtmlTable(data) {
            var self = this;
            var r = [];
            if (typeof data == 'undefined') {
                r = self.getAllRecords();
            } else {
                r = data;
            }
            var colModel = self.table.getTableColumnModel();
            var tableModel = self.table.getTableModel();
            var colNum = colModel.getOverallColumnCount();
            var table = "<table border='1'>";
            table += "<tbody>";
            table += "<tr>";
            var cols = [];
            for (var i = 0; i < colNum; i++) {
                if (colModel.isColumnVisible(i)) {
                    table += "<th>";
                    var colName = tableModel.getColumnName(i);
                    var colId = tableModel.getColumnId(i);
                    cols.push(colId);
                    table += "<b>" + colName + "</b>";
                    table += "</th>";
                }
            }
            table += "</tr>";
            for (var i = 0; i < r.length; i++) {
                table += "<tr>";
                for (var ia = 0; ia < cols.length; ia++) {
                    table += "<td>";
                    table += r[i][cols[ia]];
                    table += "</td>";
                }
                table += "</tr>";
            }
            table += "</tbody>";
            table += "</table>";
            return table;
        },
        getBase: function getBase() {
            var rta = this.masterContainer;
            return rta;
        },
        validateFilters: function validateFilters() {
            this.validate();
        },
        validate: function validate() {
            var self = this;
            var fields = self.filters;
            if (fields == null) {
                return true;
            }
            var r = self.getFiltersData(false);
            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].name;
                var required = fields[i].required;
                var mode = fields[i].mode;
                var type = fields[i].type;
                var label = fields[i].label;
                var valid = true;
                if (required === true || required == "true" || required === "true" || required === "t") {
                    var msg = self.tr(" no puede estar vacío.");
                    if (type == "textFieldSearch" || type == "tokenField" || type == "selectTokenField" || type == "selectListCheck") {
                        msg = self.tr(" no puede estar vacío.");
                    }
                    self.ui[name].setInvalidMessage(label + msg);
                    switch (type) {
                        case "selectListCheck":
                            if (typeof r[name].length != 'undefined') {
                                if (r[name].length == 0) {
                                    valid = false;
                                }
                            }
                            break;
                        case "selectTokenField":
                            if (r[name] == null || r[name] == '') {
                                valid = false;
                            }
                            break;
                        case "dateTimeField":
                            if (r[name] == null || r[name] == '') {
                                valid = false;
                            }
                            break;
                        case "dateField":
                            if (r[name] == null || r[name] == '') {
                                valid = false;
                            }
                            break;
                        case "textField":
                            if (r[name] == null || r[name] == '' || r[name] == ".00") {
                                valid = false;
                            }
                            break;
                        case "textFieldSearch":
                            if (r[name] == null || r[name] == '' || r[name] == ".00") {
                                valid = false;
                            }
                            break;
                        default:
                            if (r[name] == "") {
                                valid = false;
                            } else if (r[name] == null) {
                                valid = false;
                            }
                            break;
                    }
                    self.ui[name].setValid(valid);
                    if (!valid) {
                        if (qxnw.config.getShakeOnValidate()) {
                            qxnw.animation.startEffect("shake", self);
                        }
                        if (self.ui[name].isFocusable()) {
                            self.ui[name].focus();
                        }
                        return valid;
                    }
                }
                if (typeof mode != 'undefined') {
                    if (mode != null) {
                        var arrMode = mode.split(":");
                        for (var ia = 0; ia < arrMode.length; ia++) {
                            switch (arrMode[ia]) {
                                case "numeric":
                                    if (!isNaN(r[name]) && r[name] != null && r[name] != '' && required) {
                                        if (!qxnw.utils.validateIsNumeric(r[name])) {
                                            valid = false;
                                            self.ui[name].setInvalidMessage(label + self.tr(" debe ser un número con decimales"));
                                            self.ui[name].setValid(valid);
                                            self.ui[name].focus();
                                        }
                                        break;
                                    }

                                case "integer":
                                    if (!isNaN(r[name]) && r[name] != null && required) {
                                        if (!qxnw.utils.validateIsInteger(r[name])) {
                                            valid = false;
                                            self.ui[name].setInvalidMessage(label + self.tr(" debe ser un número entero, sin decimales"));
                                            self.ui[name].setValid(valid);
                                            self.ui[name].focus();
                                        }
                                        break;
                                    }
                                case "string":
                                    if (r[name] != "" && required) {
                                        if (!qxnw.utils.validateIsString(r[name])) {
                                            valid = false;
                                            self.ui[name].setInvalidMessage(label + self.tr(" debe ser un texto"));
                                            self.ui[name].setValid(valid);
                                            self.ui[name].focus();
                                        }
                                        break;
                                    }
                                case "email":
                                    if (r[name] != "" && required) {
                                        if (!qxnw.utils.validateIsEmail(r[name])) {
                                            valid = false;
                                            self.ui[name].setInvalidMessage(label + self.tr(" debe ser un correo electrónico válido"));
                                            self.ui[name].setValid(valid);
                                            self.ui[name].focus();
                                        }
                                        break;
                                    }
                            }
                        }
                        if (!valid) {
                            if (qxnw.config.getShakeOnValidate()) {
                                qxnw.animation.startEffect("shake", self);
                            }
                            return valid;
                        }
                    }
                }
            }
            return true;
        },
        addTabWidget: function addTabWidget(widget, icon, toolTip) {
            var self = this;
            if (typeof icon == 'undefined') {
                icon = qxnw.config.execIcon("utilities-terminal", "apps");
            }
            var page = new qx.ui.tabview.Page("", icon);
            page.getChildControl("button").getChildControl("label").setVisibility("excluded");

            if (typeof toolTip != 'undefined') {
                var tT = new qx.ui.tooltip.ToolTip(toolTip, qxnw.config.execIcon("help-faq"));
                page.getChildControl("button").setToolTip(tT);
            }

            page.getChildControl("button").setPadding(1);
            page.getChildControl("button").setAllowGrowY(false);
            page.getChildControl("button").setAllowGrowX(false);
            page.setLayout(new qx.ui.layout.VBox());
            page.add(widget, {
                flex: 1
            });
            self.tabView.add(page, {
                flex: 1
            });
            self.__parentContainer.getChildControl("button").setVisibility('visible');
        },
        startToolTip: function startToolTip() {
            if (this.isStartedToolTip) {
                return;
            }
            this.tooltip = new qx.ui.tooltip.ToolTip("").set({
                rich: true,
                zIndex: -10000,
                maxWidth: 500
            });
            this.isStartedToolTip = true;
            this.table.setToolTip(this.tooltip);
            this.table.addListener("mousemove", this.showTooltip, this);
            try {
                this.table.getPaneScroller(0).setEnabled(true);
                this.table.getPaneScroller(0).addListener("mousemove", this.showTooltip, this);
            } catch (e) {

            }
            this.table.addListener("mouseout", function (e) {
                this.tooltip.hide();
                this.tooltip.setVisibility("excluded");
                this.table.setToolTip(null);
            }, this);
        },
        showTooltip: function (e) {
            var self = this;
            var v = null;
            var pageX = e.getDocumentLeft();
            var pageY = e.getDocumentTop();
            var sc = this.table.getTablePaneScrollerAtPageX(pageX);
            var haveToolTip = false;
            if (sc != null) {
                var tm = this.table.getTableModel();
                if (tm != null) {
                    var row = sc._getRowForPagePos(pageX, pageY);
                    var col = sc._getColumnForPageX(pageX); /**/
                    var columns = self.allColumnsData;
                    if (columns == null) {
                        return;
                    }
                    for (var i = 0; i < columns.length; i++) {
                        var mode = columns[i].mode;
                        var columnName = columns[i].caption;
                        if (typeof mode != 'undefined' && mode != null && mode != "" && mode == "toolTip") {
                            var columnIndex = self.columnIndexFromName(columnName);
                            if (col == columnIndex) {
                                if (row >= 0 && col >= 0) {
                                    try {
                                        v = tm.getToolTip(col, row);
                                        haveToolTip = true;
                                    } catch (az) {
                                        v = "";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (v != null & v != "" && haveToolTip) {
                this.tooltip.placeToPointer(e);
                this.tooltip.setLabel(v.toString());
                this.tooltip.show();
                this.tooltip.setVisibility("visible");
            } else {
                this.tooltip.hide();
                this.tooltip.setVisibility("excluded");
            }
        },
        disableAutoPrinter: function disableAutoPrinter() {
            var self = this;
            try {
                self.ui.printButton.removeListenerById(self.__printIdListener);
            } catch (e) {

            }
        },
        disableAutoImport: function disableAutoImport() {
            var self = this;
            try {
                self.ui.importButton.removeListenerById(self.__importIdListener);
            } catch (e) {

            }
        },
        showDeferred: function showDeferred(secs) {
            window.setInterval(function () {
                window.clearInterval();
            }, secs);
        },
        /**
         * Adds the module id
         * @param note {String} the module id
         * @returns {void}
         */
        addModuleNote: function addModuleNote(note) {
            var self = this;
            if (self.__developerContainer === null) {
                console.log("No está creado el widget .__developerContainer");
                return;
            }
            self.__developerContainer.removeAll();
            self.__developerContainer.add(new qx.ui.core.Spacer(), {
                flex: 1
            });

            var text = "";
            self.__note += note + "<br />";
            text += "<p style='color: gray; font-size: 10;'>";
            text += self.__note;
            text += "</p>";
            var label = new qx.ui.basic.Label(text).set({
                rich: true
            });
            self.developerContainer = self.__developerContainer;
            self.__developerContainer.add(label, {
                flex: 0
            });
        },
        /**
         * Set if the first columns is editable
         * @param bool {Boolean} 
         * @returns {void}
         */
        setColumnEditable: function setColumnEditable(bool) {
            this.__columnEditable = bool;
        },
        /**
         * Add a note (supports HTML) on the footer of the form
         * @param note {String} 
         * @returns {void}
         */
        addFooterNote: function addFooterNote(note) {
            var self = this;
            var text = "";
            text += "<p style='color: gray; font-size: 10;'>";
            text += note;
            text += "</p>";
            var label = new qx.ui.basic.Label(text).set({
                rich: true
            });
            self.__footerNotesBar.add(label);
        },
        getColumnNameByLabel: function getColumnNameByLabel(label) {
            var self = this;
            var columns = self.allColumnsData;
            label = self.cleanColorHeaders(label);
            var columnLabel = null;
            for (var i = 0; i < columns.length; i++) {
                columnLabel = self.cleanColorHeaders(columns[i].label);
                if (columnLabel == label) {
                    return columns[i].caption;
                    break;
                }
            }
        },
        setColumnLabelByName: function setColumnLabelByName(name, label) {
            var self = this;
            var columns = self.allColumnsData;
            var tableModel = this.table.getTableModel();
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].caption == name) {
                    var col = tableModel.getColumnIndexById(name);
                    if (col == null) {
                        break;
                    }
                    var paneHeaderWidget = this.table.getPaneScroller(0).getHeader();
                    var w = paneHeaderWidget.getHeaderWidgetAtColumn(col);
                    w.setLabel(label);
                    break;
                }
            }
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
        /**
         * Populate the selectBox with the columns and ids
         * @returns {void}
         */
        populateTotalColumns: function populateTotalColumns() {
            var self = this;
            var item = new qxnw.widgets.listItem("Ninguno");
            var itemMeta = new qxnw.widgets.listItem("Ninguno");
            var itemOrder = new qxnw.widgets.listItem("");
            item.setModel("Ninguno");
            itemMeta.setModel("Ninguno");
            itemOrder.setModel("");
            self.totalText.add(item);
            self.totalCompareCol.add(item.clone());
            var columns = self.table.getTableColumnModel().getVisibleColumns();

            var paneHeaderWidget = self.table.getPaneScroller(0).getHeader();

            for (var i = 0; i < columns.length; i++) {
                var model = self.table.getTableModel().getColumnName(columns[i]).replace("<b style='color:red'>*</b>", "");
                var idCol = self.table.getTableModel().getColumnId(columns[i]);
                var data = {};
                //data["columnName"] = model;
                data["columnId"] = idCol;
                data["value"] = data["columnId"];
                //TODO: AJUSTE IMPORTANTE POR APARENTE ERROR
                //data["name"] = self.getColumnNameByLabel(idCol);
                data["name"] = self.getColumnNameByLabel(model);
                data["nombre"] = model;
                self.__visibleColumns.push(data);
                try {
                    model = model.replace(/<div id='div_[0-9][0-9]{0,3}' color='[#a-zA-Z0-9]*'><.div>/gi, "");
                } catch (e) {

                }
                var item = new qxnw.widgets.listItem(model);
                item.setModel(idCol);
                self.totalText.add(item);
                self.totalCompareCol.add(item.clone());
                itemMeta = new qxnw.widgets.listItem(model);
                itemMeta.setModel(i);
                self.__metaColumn.add(itemMeta);
//                try {
//                    itemOrder = new qxnw.widgets.listItem(model);
//                    itemOrder.setModel(data["columnId"]);
//                    self.__orderBy.add(itemOrder);
//                } catch (e) {
//                    qxnw.utils.nwconsole(e);
//                }

                var haveTooltip = self.columnHaveTooltip(idCol);
                if (haveTooltip != false) {
                    var headerColumnWidget = paneHeaderWidget.getHeaderWidgetAtColumn(columns[i]);
                    if (headerColumnWidget.getToolTip() == null) {
                        var toolTip = new qx.ui.tooltip.ToolTip(haveTooltip.tooltipHeader);
                        headerColumnWidget.setToolTip(toolTip);
                        qxnw.utils.addClass(headerColumnWidget, "nw_table_tooltip_header");
                        qx.util.DisposeUtil.disposeTriggeredBy(toolTip, headerColumnWidget);
                    }
                }

            }

            var conf = self.__getStoredConfiguration();
            if (conf != null) {
                if (conf["totalColumn"] != null) {
                    if (conf["totalColumn"]["totalText"] != null) {
                        if (conf["totalColumn"]["totalText"] != "Ninguno") {
                            self.totalText.setValue(conf["totalColumn"]["totalText"]);
                            self.__totalColumn = conf["totalColumn"]["totalText"];
                        }
                    }
                }
                if (conf["typeCalc"] != null) {
                    if (conf["typeCalc"]["typeCalc"] != null) {
                        self.tipoCalculo.setValue(conf["typeCalc"]["typeCalc"]);
                        self.setTypeOfCalc(conf["typeCalc"]["typeCalc"]);
                    }
                }
                if (conf["totalCompareCol"] != null) {
                    if (conf["totalCompareCol"]["totalCompareCol"] != null) {
                        self.totalCompareCol.setValue(conf["totalCompareCol"]["totalCompareCol"]);
                    }
                }
                if (conf["totalCompareValue"] != null) {
                    if (conf["totalCompareValue"]["totalCompareValue"] != null) {
                        self.totalCompareValue.setValue(conf["totalCompareValue"]["totalCompareValue"]);
                    }
                }
                if (conf["totalValue"] != null) {
                    self.totalValue.setValue(conf["totalValue"]);
                }
//                if (conf["orderBy"] != null) {
//                    self.ui["order_by"].setValue(conf["orderBy"]);
//                }
                if (conf["minimize_footer_bar"] != null) {
                    if (conf["minimize_footer_bar"] == true) {
                        self.addToLeftOptions(self.__closeOrMinimize);
                        self.footerToolBar.setVisibility("excluded");
                        self.__closeOrMinimize.setIcon(qxnw.config.execIcon("view-fullscreen"));
                    }
                }
                if (conf["minimize_container_tools"] != null) {
                    if (conf["minimize_container_tools"] == true) {
                        self.addToLeftOptions(self.ui["minimizeOptionsButton"]);
                        self.containerTools.setVisibility("excluded");
                        self.ui["minimizeOptionsButton"].setIcon(qxnw.config.execIcon("view-fullscreen"));
                    }
                }

                if (conf["typeCalc"] != null) {
                    if (conf["typeCalc"]["typeCalc"] != null) {
                        switch (conf["typeCalc"]["typeCalc"]) {
                            case "SUM":
                                if (self.totalValue != null) {
                                    self.totalValue.setVisibility("excluded");
                                }
                                if (self.totalCompareValue != null) {
                                    self.totalCompareValue.setVisibility("excluded");
                                }
                                if (self.totalCompareCol != null) {
                                    self.totalCompareCol.setVisibility("excluded");
                                }
                                if (self.totalText != null) {
                                    self.totalText.setVisibility("visible");
                                }
                                break;
                            case "SUM_BY_COL":
                                if (self.totalValue != null) {
                                    self.totalValue.setVisibility("visible");
                                }
                                if (self.totalCompareValue != null) {
                                    self.totalCompareValue.setVisibility("visible");
                                }
                                if (self.totalCompareCol != null) {
                                    self.totalCompareCol.setVisibility("visible");
                                }
                                if (self.totalText != null) {
                                    self.totalText.setVisibility("visible");
                                }
                                break;
                            case "PROM":
                                if (self.totalValue != null) {
                                    self.totalValue.setVisibility("excluded");
                                }
                                if (self.totalCompareValue != null) {
                                    self.totalCompareValue.setVisibility("excluded");
                                }
                                if (self.totalCompareCol != null) {
                                    self.totalCompareCol.setVisibility("excluded");
                                }
                                if (self.totalText != null) {
                                    self.totalText.setVisibility("visible");
                                }
                                break;
                            case "RECUENTO":
                                if (self.totalValue != null) {
                                    self.totalValue.setVisibility("visible");
                                }
                                if (self.totalCompareValue != null) {
                                    self.totalCompareValue.setVisibility("visible");
                                }
                                if (self.totalCompareCol != null) {
                                    self.totalCompareCol.setVisibility("visible");
                                }
                                if (self.totalText != null) {
                                    self.totalText.setVisibility("visible");
                                }
                                break;
                        }
                    }
                }
                self.calculateByColumn();
            }
            self.totalText.addListener("changeSelection", function () {
                var val = this.getValue();
                self.setTotalColumn(val["totalText"]);
                self.saveFooterToolbarSettings();
                self.calculateByColumn();
            });
            self.tipoCalculo.addListener("changeSelection", function () {
                var val = this.getValue();
                self.setTypeOfCalc(val["typeCalc"]);
                self.saveFooterToolbarSettings();
                self.calculateByColumn();
            });
            self.totalCompareCol.addListener("changeSelection", function () {
                self.saveFooterToolbarSettings();
                self.calculateByColumn();
            });
            self.totalCompareValue.addListener("changeSelection", function () {
                self.saveFooterToolbarSettings();
                self.calculateByColumn();
            });
//            self.__metaColumn.addListener("changeSelection", function () {
//                var selected = self.mantainFirstColumn.getValue();
//                var column = self.__metaColumn.getValue()["metaColumn"];
//                column = parseInt(column) + 1;
//                qxnw.local.storeData(self.getAppWidgetName() + "_metaColumn", selected);
//                if (selected) {
//                    self.table.setMetaColumnCounts([column, -1]);
//                    self.populateColumnColorsRetarded();
//                } else {
//                    self.table.setMetaColumnCounts([0, -1]);
//                    self.populateColumnColorsRetarded();
//                }
//                self.saveFooterToolbarSettings();
//            });
            self.fireEvent("populateTotalColumns");
            self.__isPopulated = true;
        },
        /**
         * Put conditionals changin the row colors
         * 
         * @param column {String} the column name
         * @param dataArray {Array} the array object
         * @returns {void}
         */
        addConditionalColorColumn: function addConditionalColorColumn(column, dataArray) {
            var self = this;
            var newRenderer = null;
            var col = self.columnIndexFromName(column);
            newRenderer = new qx.ui.table.cellrenderer.Conditional();
            for (var i = 0; i < dataArray.length; i++) {
                var align = null;
                if (typeof dataArray[i].align != 'undefined') {
                    align = dataArray[i].align;
                }
                if (qxnw.utils.validateIsInteger(dataArray[i].value)) {
                    newRenderer.addNumericCondition(dataArray[i].condition, dataArray[i].value, align, dataArray[i].color);
                } else if (qxnw.utils.validateIsString(dataArray[i].value)) {
                    newRenderer.addRegex(dataArray[i].value, null, dataArray[i].color, "background", null, null);
                }
            }
            self.table.getTableColumnModel().setDataCellRenderer(col, newRenderer);
        },
        /**
         * Adds an frame to form
         * @param url {String} the url of the frame 
         * @returns {Boolean} if the operation was successfull
         */
        addFrame: function addFrame(url) {
            var self = this;
            self.setFrameUrl(url);
            self.__frameLists = new qx.ui.embed.ThemedIframe();
            self.__frameLists.setSource(url);
            self.__verticalContainer.add(self.__frameLists, {
                flex: 1
            });
            if (self.getQxnwType() == "qxnw_reports") {
                var filtersData = self.getFiltersData();
                var urlRequest = "?";
                for (var v in filtersData) {
                    urlRequest += v;
                    urlRequest += "=";
                    urlRequest += filtersData[v];
                    urlRequest += "&";
                }
                var url = self.getFrameUrl() + urlRequest;
                self.catchFiltersValues();
                self.__frameLists.setSource(url);
            }
            return true;
        },
        /**
         * Return the real class name, like an id
         * @returns {String}
         */
        getRealClassName: function getRealClassName() {
            var self = this;
            return self.getAppWidgetName();
        },
        getIndexColumnFromName: function getIndexColumnFromName(name) {
            var self = this;
        },
        /**
         * Create semaphore from a descriptive array, inside a group, having a title and icon i.e: 
         * <pre class='javascript'>
         * var ie = {
         *      color: "green",
         *      toolTip: "Tool"
         * };
         * this.createCompleteSemaphore(ie, "semaphore", "Date semaphore", qxnw.config.execIcon("dialog-ok"));
         * </pre>
         * @param colors {Array} 
         * @param name {String} the name of the semaphore 
         * @param title {String} the title of groupBox
         * @param iconTitle {String} the icon path
         * @returns {void}
         */
        createCompleteSemaphore: function createCompleteSemaphore(colors, name, title, iconTitle) {
            var self = this;
            if (typeof self.ui["widget_" + name] != 'undefined') {
                self.removeFromFiltersBar(self.ui["widget_" + name]);
            }
            var layout = new qx.ui.layout.HBox();
            layout.setAlignX("center");
            layout.setAlignY("middle");
            var group = new qx.ui.groupbox.GroupBox(title, iconTitle).set({
                maxHeight: 40,
                contentPadding: 0
            });
            group.setLayout(new qx.ui.layout.HBox().set({
                spacing: 1
            }));
            var composite = new qx.ui.container.Composite(layout);
            var radioGroup = new qx.ui.form.RadioGroup();
            var oldItems = radioGroup.getChildren();
            for (var i = 0; i < oldItems.length; i++) {
                radioGroup.remove(oldItems[i]);
            }
            for (var i = 0; i < colors.length; i++) {
                var radioButton = new qx.ui.form.RadioButton();
                radioButton.setModel(colors[i]);
                var imgDisp = ["red", "green", "yellow"];
                if (imgDisp.indexOf(colors[i].color) != -1) {
                    var image = new qx.ui.basic.Image(qxnw.config.execIcon(colors[i].color, "qxnw"));
                } else {
                    var html = '<div style="border-radius: 50%; behavior: url(PIE.htc); width: 12px; height: 12px; border: 1px solid black; background: ';
                    html += colors[i].color;
                    html += ';" class="circleBase type1"></div>';
                    var image = new qx.ui.basic.Label(html).set({
                        rich: true
                    });
//                    qx.bom.element.Style.setStyles(image.getContentElement(), {
//                        border: "2x solid black"
//                    });
                }
                radioGroup.add(radioButton);
                if (colors[i].toolTip != "") {
                    var toolTip = new qx.ui.tooltip.ToolTip(colors[i].toolTip);
                    radioButton.setToolTip(toolTip);
                }
                composite.add(radioButton);
                composite.add(image);
            }
            var data = {
                name: name,
                label: self.tr("Filtro rápido").toString(),
                type: "radioGroup"
            };
            if (self.filters != null) {
                self.filters.push(data);
            }
            self.ui[name] = radioGroup;
            self.ui[name].getValue = function () {
                if (!self.ui[name].isSelectionEmpty()) {
                    var selection = self.ui[name].getSelection();
                    return selection[0].getModel();
                } else {
                    return "";
                }
            };
            self.ui[name].setValue = function (val, item) {
                var childs = this.getItems();
                for (var i = 0; i < childs.length; i++) {
                    var model = childs[i].getModel();
                    if (model == item) {
                        childs[i].setModel(val);
                        childs[i].setValue(true);
                    }
                }
            };
            group.add(composite);
            self.ui["widget_" + name] = group;
            self.addWidgetToFiltersBar(group);
        },
        /**
         * Create a simple semaphore
         * @param colors {Array} containing the colors
         * @param name {String} the widget name
         * @returns {void}
         */
        createSemaphore: function createSemaphore(colors, name) {
            var self = this;
            var layout = new qx.ui.layout.HBox();
            layout.setAlignX("center");
            layout.setAlignY("middle");
            var composite = new qx.ui.container.Composite(layout);
            var radioGroup = new qx.ui.form.RadioGroup();
            for (var col in colors) {
                var radioButton = new qx.ui.form.RadioButton();
                radioButton.setModel(colors[col]);
                var image = new qx.ui.basic.Image("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/" + colors[col] + ".png");
                radioGroup.add(radioButton);
                composite.add(radioButton);
                composite.add(image);
            }
            var data = {
                name: name,
                label: self.tr("Filtro rápido").toString(),
                type: "radioGroup"
            };
            self.filters.push(data);
            self.ui[name] = radioGroup;
            self.ui[name].getValue = function () {
                if (!self.ui[name].isSelectionEmpty()) {
                    var selection = self.ui[name].getSelection();
                    return selection[0].getModel();
                } else {
                    return "";
                }
            };
            self.ui[name].setValue = function (val, item) {
                var childs = this.getItems();
                for (var i = 0; i < childs.length; i++) {
                    var model = childs[i].getModel();
                    if (model == item) {
                        childs[i].setModel(val);
                        childs[i].setValue(true);
                    }
                }
            };
            self.addWidgetToFiltersBar(composite);
        },
        removeFromFiltersBar: function removeFromFiltersBar(widget) {
            try {
                this.containerFilters.remove(widget);
            } catch (e) {

            }
        },
        /**
         * Adds widgets to filters bar
         * @param widget {Object} the widget
         * @returns {void}
         */
        addWidgetToFiltersBar: function addWidgetToFiltersBar(widget) {
            var self = this;
            if (typeof self.ui.minimizeFiltersButton != 'undefined') {
                self.containerFilters.addBefore(widget, self.ui.minimizeFiltersButton);
            } else {
                if (typeof self.ui.searchButton != 'undefined') {
                    self.containerFilters.addBefore(widget, self.ui.searchButton);
                }
            }
        },
        cleanAll: function cleanAll() {
            if (this.__command_copy !== null) {
                try {
                    this.__command_copy.removeListenerById(this.__command_copy_listener);
                } catch (e) {
                    console.log(e);
                }
            }
            this.destroy();
        },
        setTableFocus: function setTableFocus() {
            var self = this;
            self.table.getPaneScroller(0).getTablePane().activate();
        },
        adjustCenter: function adjustCenter() {
            var self = this;
            self.center();
        },
        /**
         * Set the dimensions from a stored data
         * 
         * @returns {Boolean} if the operation is ok
         */
        setStoredPosition: function setStoredPosition() {
            var self = this;
            if (self.disableConfigPosition) {
                self.adjustCenter();
                return;
            }
            self.__isPosicionedLists = true;
            var pos = qxnw.local.getData(self.getAppWidgetName() + "_lists_pos");
            if (pos == null) {
                self.adjustCenter();
                return false;
            }
            self.setDomPosition(pos.left, pos.top);
            self.setWidth(pos.width);
            self.setHeight(pos.height);
            return true;
        },
        /**
         * Use this function to store a size of a window
         * 
         * @param p {Array} contain an array with dimensions of a window
         * @returns {Boolean} if the operation is ok
         */
//        storeSize: function storeSize(p) {
//            var self = this;
//            if (!self.__isMovedSize) {
//                return false;
//            }
//            try {
//                qxnw.local.storeData(self.getAppWidgetName() + "_lists_size", p);
//            } catch (e) {
//                self.center;
//                return false;
//            }
//            return true;
//        },
        /**
         * Use this function to store a position of a window. i.e:
         * * <code>
         * Object {left: 877, top: 35, width: 316, height: 193} 
         * </code>
         *  
         * @param p {Array} contain an array in this way: 
         * @returns {Boolean} if the operation is ok
         */
        storePosition: function storePosition(p) {
            var self = this;
            if (!self.__isPosicionedLists) {
                return;
            }
            if (self.__isMovedPosition == false) {
                self.__isMovedPosition = true;
                return false;
            }
            try {
                qxnw.local.storeData(self.getAppWidgetName() + "_lists_pos", p);
            } catch (e) {
                self.center;
                return false;
            }
        },
        removeAll: function removeAll() {
            this.clearRows();
        },
        removeAllRows: function removeAllRows() {
            this.clearRows();
        },
        /**
         * NOT READY FOR PRODUCTION
         * @returns {undefined}
         */
        clearRows: function clearRows() {
            var self = this;

            self.table.setSaveVisibility(false);

            self.table.resetCellFocus();
            self.createModel();
            self.table.updateContent();

            self.table.setStoredColumnsWidth();
            self.table.restoreOrder();
            self.table.setTheStoredVisibilityColumns();

            self.populateTotalColumns();

            self.table.setSaveVisibility(true);
        },
        execSettings: function execSettings() {
            var self = this;
            if (self.__isExecSettings) {
                return;
            }
            try {
                self.execPermissions();
                self.putCatchedContent();
            } catch (e) {
                qxnw.utils.nwconsole(e);
                //qxnw.utils.bindError(e, self, data);
            }
            self.__isExecSettings = true;
        },
        /**
         * Return the array of set permissions
         * 
         * @return {Array} return an array containing the permissions
         */
        getPermissions: function getPermissions() {
            var self = this;
            return self.__permissionsLists;
        },
        /**
         * Return if is setted the main form
         * @returns {Boolean} boolean if is main form or not
         */
        getIsMainForm: function getIsMainForm() {
            return this.__mainForm;
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
            if (typeof self.__dataTableTextInformation["other"] == 'undefined') {
                self.__dataTableTextInformation["other"] = "";
            }
            self.table.setAdditionalStatusBarText(quote + self.__dataTableTextInformation["totalRecords"] + self.__dataTableTextInformation["totalColumns"] + self.__dataTableTextInformation["other"]);
            return true;
        },
        execPermissions: function execPermissions(isSync) {
            var self = this;

            if (self.__isExecSettings) {
                return;
            }

            qxnw.utils.loading(self.tr("Cargando permisos..."));

            if (typeof isSync == 'undefined') {
                isSync = false;
            }
            var p = qxnw.userPolicies.getPermissions(self.getAppWidgetName());

            if (typeof p == 'undefined' || p == null) {
                var func = function (r) {
                    if (r != false && typeof r == "object") {
                        for (var v in r) {
                            if (r[v] == "t" || r[v] == true || r[v] == "true") {
                                r[v] = true;
                            } else if (r[v] == "f" || r[v] == false || r[v] == "false") {
                                r[v] = false;
                            }
                        }
                        self.processPermissions(r);
                        qxnw.utils.stopLoading();
                    }
                };
                var d = {};
                d["clase"] = self.classname;
                if (self.tableAuto != null) {
                    d["clase"] = self.tableAuto;
                }
                var isProduct = qxnw.userPolicies.isProduct();
                if (isProduct === true) {
                    d["isProduct"] = true;
                }
                if (isSync == false) {
                    qxnw.utils.fastAsyncCallRpc("nw_permissions", "getPermissionsByClass", d, func);
                } else {
                    var r = qxnw.utils.fastSyncRpcCall("nw_permissions", "getPermissionsByClass", d);
                    func(r);
                }
            } else {
                self.processPermissions(p);
            }
        },
        /**
         * With the permissions setted, enable or disable the elements 
         * @param perm {Array} the permissions setted
         * @returns {void}
         */
        processPermissions: function processPermissions(perm) {
            var self = this;

            if (self.ui == null) {
                return;
            }
            var p = qxnw.userPolicies.getPermissions(self.getAppWidgetName());
            if (typeof perm != 'undefined') {
                p = perm;
            }
            if (p == null || typeof p == 'undefined') {
                p = {};
                p["edits"] = false;
                p["creates"] = false;
                p["deletes"] = false;
                p["modulo"] = null;
                p["exports"] = false;
                p["imports"] = false;
                p["prints"] = false;
                p["send_email"] = false;
                p["hidden_cols"] = false;
                p["terminal"] = false;
                p["pais"] = false;
                p["dynamicTableButton"] = true;
            }
            if (self.getAllPermissions()) {
                p["edits"] = true;
                p["creates"] = true;
                p["deletes"] = true;
                p["modulo"] = null;
                p["terminal"] = true;
                p["pais"] = true;
                p["exports"] = true;
                p["imports"] = true;
                p["hidden_cols"] = false;
                p["prints"] = false;
                p["send_email"] = false;
                p["dynamicTableButton"] = true;
            } else if (self.getAllPermissions() === false) {
                p["edits"] = false;
                p["creates"] = false;
                p["deletes"] = false;
                p["modulo"] = null;
                p["terminal"] = null;
                p["pais"] = null;
                p["exports"] = true;
                p["imports"] = false;
                p["hidden_cols"] = false;
                p["prints"] = false;
                p["send_email"] = false;
                p["dynamicTableButton"] = true;
            }

            // SE DEJA EN TRU SIEMPRE POR PROBLEMA CON EL ORDENAMIENTO DE LAS COLUMNAS
            p["hidden_cols"] = false;

            self.__permissionsLists = p;

            self.moduloId = p["modulo"];
            try {
                if (typeof self.ui.editButton == 'undefined') {
                    return;
                }
                if (typeof p["modulo"] != 'undefined') {
                    if (p["modulo"] != null) {
                        if (p["modulo"] != false) {
                            self.addModuleNote("Módulo: " + p["modulo"]);
                        }
                    }
                }
                self.ui.editButton.setEnabled(p["edits"]);
                self.ui.newButton.setEnabled(p["creates"]);
                self.ui.deleteButton.setEnabled(p["deletes"]);
                if (typeof p["exports"] != 'undefined' && typeof p["exports"] == "boolean") {
                    self.ui.exportButton.setEnabled(p["exports"]);
                } else {
                    self.ui.exportButton.setEnabled(false);
                }
                if (typeof p["prints"] != 'undefined' && typeof p["prints"] == "boolean") {
                    self.ui.printButton.setEnabled(p["prints"]);
                } else {
                    self.ui.printButton.setEnabled(false);
                }
                if (typeof p["send_email"] != 'undefined' && typeof p["send_email"] == "boolean") {
                    self.ui.emailButton.setEnabled(p["send_email"]);
                } else {
                    self.ui.emailButton.setEnabled(false);
                }

                if (typeof p["imports"] != 'undefined' && typeof p["imports"] == "boolean") {
                    self.ui.importButton.setEnabled(p["imports"]);
                } else {
                    self.ui.importButton.setEnabled(false);
                }

                if (typeof p["dynamicTableButton"] != 'undefined' && typeof p["dynamicTableButton"] == "boolean") {
                    self.ui.dynamicTableButton.setEnabled(p["dynamicTableButton"]);
                } else {
                    self.ui.dynamicTableButton.setEnabled(true);
                }
                if (typeof p["terminal"] != 'undefined' && typeof p["terminal"] == "boolean") {
                    if (typeof self.ui.terminal != 'undefined') {
                        if (self.getHandleTerminalPermissons()) {
                            self.ui.terminal.setEnabled(p["terminal"]);
                        }
                        if (typeof self.up.terminal != null && self.up.terminal != 0) {
                            self.ui.terminal.setValue(self.up.terminal);
                        }
                    }
                } else {
                    if (typeof self.ui.terminal != 'undefined') {
                        if (self.getHandleTerminalPermissons()) {
                            self.ui.terminal.setEnabled(false);
                        }
                    }
                }

                /******************PERMISOS PAíSES**************/
                if (typeof p["pais"] != 'undefined' && typeof p["pais"] == "boolean") {
                    if (typeof self.ui.pais != 'undefined') {
                        if (self.getHandleCountryPermissons()) {
                            self.ui.pais.setEnabled(p["pais"]);
                        }
                        if (typeof self.up.parameters != 'undefined' && self.up.parameters != null) {
                            for (var iee = 0; iee < self.up.parameters.length; iee++) {
                                if (typeof self.up.parameters[iee] != 'undefined' && typeof self.up.parameters[iee].pais != 'undefined') {
                                    self.ui.pais.setValue(self.up.parameters[iee].pais);
                                }
                            }
                        }
                    }
                } else {
                    if (typeof self.ui.pais != 'undefined') {
                        if (self.getHandleCountryPermissons()) {
                            self.ui.pais.setEnabled(false);
                        }
                        if (typeof self.up.parameters != 'undefined' && self.up.parameters != null) {
                            for (var iee = 0; iee < self.up.parameters.length; iee++) {
                                if (typeof self.up.parameters[iee] != 'undefined' && typeof self.up.parameters[iee].pais != 'undefined') {
                                    self.ui.pais.setValue(self.up.parameters[iee].pais);
                                }
                            }
                        }
                    }
                }

                if (p["hidden_cols"]) {
                    if (typeof self.table != 'undefined') {
                        self.table.setColumnVisibilityButtonVisible(false);
                    }
                }
            } catch (e) {
                qxnw.utils.nwconsole(e);
            }
            qxnw.utils.stopLoading();
        },
        setColumnVisibilityButtonVisible: function setColumnVisibilityButtonVisible(bool) {
            this.table.setColumnVisibilityButtonVisible(bool);
        },
        getRecordById: function getRecordById(id) {
            var self = this;
            var r = self.getAllRecords();
            for (var i = 0; i < r.length; i++) {
                if (typeof r[i].id != 'undefined' && r[i].id == id) {
                    return r[i];
                }
            }
            return {};
        },
        getAllData: function getAllData() {
            return this.getAllRecords();
        },
        getAllRows: function getAllRows() {
            return this.getAllRecords();
        },
        getAllRecords: function getAllRecords(considerFilters) {
            if (this.table == null) {
                return false;
            }
            if (typeof considerFilters == 'undefined') {
                considerFilters = false;
            }
            var model = this.table.getTableModel();
            if (considerFilters == true) {
                var filters = null;
                if (typeof model != 'undefined') {
                    if (typeof model.Filters != 'undefined') {
                        filters = model.Filters;
                    }
                }
                model.resetHiddenRows();
            }
            var rta = model.getDataAsMapArray();
            if (considerFilters == true) {
                if (typeof filters != 'undefined') {
                    if (filters != null) {
                        if (typeof filters.length != 'undefined') {
                            if (filters.length > 0) {
                                model.Filters = filters;
                                model.applyFilters();
                            }
                        }
                    }
                }
            }
            return rta;
        },
        setRequired: function setRequired(name, bool) {
            var fields = this.filters;
            for (var i = 0; i < fields.length; i++) {
                if (name == fields[i].name) {
                    fields[i].required = bool;
                    if (bool) {
                        var label = this.labelForm[name].getValue().replace("<b style='color:red'>*</b>", "");
                        this.labelForm[name].setValue(label + "<b style='color:red'>*</b>");
                    } else {
                        var label = this.labelForm[name].getValue().replace("<b style='color:red'>*</b>", "");
                        this.labelForm[name].setValue(label.replace("<b style='color:red'>*</b>", ""));
                    }
                    break;
                }
            }
        },
        /**
         * Exports in Excel connected to a <code>master</code> class in PHP
         * 
         * @param arr {Array} an array of columns to export
         * @param recordsArray {Array} the records to export (optional)
         * @param canHtml {Boolean} if the html records have to be exported
         * @param img_plot {String} the image to export inside the tables
         * @param callback {Function} the callback to execute returning the URL of the document to download
         * @param execute {Boolean} if have to close the form and fire the event named "execute"
         * @returns {String} string containing a URL to download the document 
         */
        exportData: function exportData(arr, recordsArray, canHtml, img_plot, callback, execute) {
            var self = this;

            var columnsNames = [];
            if (typeof canHtml == 'undefined') {
                canHtml = false;
            }

            var columns = self.table.getTableColumnModel().getVisibleColumns();
            for (var i = 0; i < columns.length; i++) {
                var columName = self.table.getTableModel().getColumnName(columns[i]);
                var columnId = self.table.getTableModel().getColumnId(columns[i]);
                var type = self.getColumnTypeFromId(columnId);
                if (canHtml == false) {
                    //TODO: se retira type == "html" porque los clientes lo requieren
                    if (type == "button") {
                        continue;
                    }
                }
                columnsNames.push(
                        {
                            name: columName,
                            id: columnId
                        }
                );
            }
            var fcs = new qxnw.forms("columns_export_selector_" + self.getAppWidgetName());
            fcs.setModal(true);
            fcs.setMaxHeight(500);
            fcs.setTitle(self.tr("Seleccione las opciones para exportar"));
            var fields = [
                {
                    name: self.tr("Opciones"),
                    type: "startGroup",
                    mode: "vertical"
                },
                {
                    name: "seleccion_version",
                    type: "selectBox",
                    label: self.tr("Seleccione la versión para exportar")
                },
                {
                    name: "vista_previa",
                    type: "button",
                    label: self.tr("Vista previa hoja de cálculo")
                },
                {
                    name: "especial",
                    type: "radioButton",
                    label: self.tr("Especial (recomendada para menos de 10000 registros)")
                },
                {
                    name: "sencilla",
                    type: "radioButton",
                    label: self.tr("Sencilla (Separado por tabulaciones para más de 10000 registros)")
                },
                {
                    name: "separado_por",
                    type: "selectBox",
                    label: self.tr("Separado por")
                },
                {
                    name: "",
                    type: "endGroup"
                },
                {
                    name: self.tr("Formatos"),
                    type: "startGroup",
                    mode: "horizontal"
                },
                {
                    name: "encabezado",
                    type: "button",
                    label: self.tr("Administrar encabezado")
                },
                {
                    name: "encabezado_max_rows",
                    type: "spinner",
                    label: self.tr("Filas")
                },
                {
                    name: "encabezado_boolean",
                    type: "checkBox",
                    label: self.tr("Usar encabezado")
                },
                {
                    name: "",
                    type: "endGroup"
                },
                {
                    name: self.tr("Seleccionar modelo"),
                    type: "startGroup",
                    mode: "horizontal"
                },
                {
                    name: "todas",
                    type: "checkBox",
                    label: self.tr("Todas las columnas")
                },
                {
                    name: "seleccion_modelo",
                    type: "selectBox",
                    label: self.tr("Seleccionar plantilla")
                },
                {
                    name: "guardar_configuracion",
                    label: self.tr("Nueva plantilla"),
                    icon: qxnw.config.execIcon("list-add"),
                    type: "button"
                },
                {
                    name: "guardar_modelo",
                    label: self.tr("Guardar plantilla"),
                    icon: qxnw.config.execIcon("dialog-ok"),
                    type: "button"
                },
                {
                    name: "eliminar_configuracion",
                    label: self.tr("Eliminar plantilla"),
                    icon: qxnw.config.execIcon("edit-delete"),
                    type: "button",
                    enabled: false
                },
                {
                    name: "",
                    type: "endGroup"
                },
                {
                    name: self.tr("Columnas disponibles"),
                    type: "startGroup",
                    mode: "grid"
                }
            ];
            var counter = 0;
            var col = 0;
            var row = 0;
            var orderColumns = [];
            for (var i = 0; i < columnsNames.length; i++) {
                if (col > 3) {
                    row++;
                    col = 0;
                }
                var f = {
                    name: columnsNames[i]["id"],
                    label: columnsNames[i]["name"],
                    type: "checkBox",
                    column: col,
                    row: row
                };
                orderColumns.push(columnsNames[i]["id"]);
                fields.push(f);
                counter++;
                col++;
            }
            fcs.setUserData("nw_export_order_columns", orderColumns);
            fcs.setFields(fields);
            fcs.ui.especial.addListener("changeValue", function () {
                if (this.getValue() == true) {
                    fcs.ui.separado_por.setEnabled(false);
                } else {
                    fcs.ui.separado_por.setEnabled(true);
                }
            });
            var d = {};
            d["v2"] = self.tr("Versión 2.0");
            d["v1"] = self.tr("Versión 1.0");
            qxnw.utils.populateSelectFromArray(fcs.ui.seleccion_version, d);
            fcs.ui.seleccion_version.saveUserData("ui.seleccion_version.saveUserData");

            var d = {};
            d["\t"] = self.tr("Tabulaciones");
            d[","] = self.tr("Comas");
            d[";"] = self.tr("Punto y coma");
            qxnw.utils.populateSelectFromArray(fcs.ui.separado_por, d);
            fcs.ui.separado_por.setEnabled(false);
            fcs.labelUi["seleccion_modelo"].setVisibility("excluded");
            fcs.ui.guardar_configuracion.setMaxWidth(200);

            fcs.ui.guardar_modelo.addListener("execute", function () {
                var prefix = fcs.ui.seleccion_modelo.getValue().seleccion_modelo;
//                prefix = prefix + "_" + self.getAppWidgetName();
                var z = [];
                qxnw.local.setData("nw_no_import_column_model_" + prefix, null);
                for (var i = 0; i < orderColumns.length; i++) {
                    var val = fcs.ui[orderColumns[i]].getValue();
                    var name = orderColumns[i];
                    if (val == false) {
                        z.push(name);
                    }
                }
                qxnw.local.setData("nw_no_import_column_model_" + prefix, z);
                var od = fcs.getUserData("nw_export_order_columns");
                qxnw.local.setData("nw_export_mode_order_columns_" + prefix, od);
                qxnw.utils.information(self.tr("Modelo guardado correctamente"));
            });

            fcs.ui.guardar_configuracion.addListener("execute", function () {
                var f = new qxnw.forms();
                f.setTitle(self.tr("Nuevo modelo de exportación"));
                f.setModal(true);
                var fields = [
                    {
                        name: "nuevo_nombre",
                        label: self.tr("Nombre"),
                        type: "textField"
                    }
                ];
                f.setFields(fields);
                f.ui.nuevo_nombre.setFilter(/[a-zA-Z_-]/g);
                f.ui.nuevo_nombre.addListener("keypress", function (e) {
                    var key = e.getKeyIdentifier();
                    if (key == "Enter") {
                        var r = f.getRecord();
                        var export_model = qxnw.local.getData("nw_export_model_" + self.getAppWidgetName());
                        if (export_model == null) {
                            export_model = [];
                            export_model.push(r["nuevo_nombre"]);
                        } else {
                            export_model.push(r["nuevo_nombre"]);
                        }
                        var od = fcs.getUserData("nw_export_order_columns");
                        qxnw.local.setData("nw_export_mode_order_columns_" + r["nuevo_nombre"], od);
                        qxnw.local.setData("nw_export_model_" + self.getAppWidgetName(), export_model);
                        var d = {};
                        d[r["nuevo_nombre"]] = r["nuevo_nombre"];
                        qxnw.utils.populateSelectFromArray(fcs.ui.seleccion_modelo, d);
                        fcs.ui.seleccion_modelo.setValue(r["nuevo_nombre"]);
                        f.reject();
                    }
                });
                f.ui.accept.addListener("execute", function () {
                    var r = f.getRecord();
                    var export_model = qxnw.local.getData("nw_export_model_" + self.getAppWidgetName())
                    if (export_model == null) {
                        export_model = [];
                        export_model.push(r["nuevo_nombre"]);
                    } else {
                        export_model.push(r["nuevo_nombre"]);
                    }
                    var od = fcs.getUserData("nw_export_order_columns");
                    qxnw.local.setData("nw_export_mode_order_columns_" + r["nuevo_nombre"], od);
                    qxnw.local.setData("nw_export_model_" + self.getAppWidgetName(), export_model);
                    var d = {};
                    d[r["nuevo_nombre"]] = r["nuevo_nombre"];
                    qxnw.utils.populateSelectFromArray(fcs.ui.seleccion_modelo, d);
                    fcs.ui.seleccion_modelo.setValue(r["nuevo_nombre"]);
                    f.reject();
                });
                f.ui.cancel.addListener("execute", function () {
                    f.reject();
                });
                f.show();
            });

            var addListenerToColumns = function (fields) {
                for (var i = 0; i < fields.length; i++) {
                    if (fields[i]["type"] == "checkBox" && fields[i]["name"] != "encabezado_boolean") {
                        fcs.ui[fields[i]["name"]].setUserData("nw_field_name", fields[i]["name"]);
                    }
                }
            };
            addListenerToColumns(fields);

            fcs.ui.eliminar_configuracion.addListener("execute", function () {
                var export_model = qxnw.local.getData("nw_export_model_" + self.getAppWidgetName());
                if (export_model == null) {
                    return;
                }
                var prefix = fcs.ui.seleccion_modelo.getValue().seleccion_modelo;
                var d = {};
                d["por_defecto"] = self.tr("Por defecto");
                for (var i = 0; i < export_model.length; i++) {
                    if (prefix == export_model[i]) {
                        export_model.splice(i, 1);
                        break;
                    }
                }
                for (var i = 0; i < export_model.length; i++) {
                    d[export_model[i]] = export_model[i];
                }
                fcs.ui.seleccion_modelo.removeAll();
                qxnw.utils.populateSelectFromArray(fcs.ui.seleccion_modelo, d);
                qxnw.local.setData("nw_export_model_" + self.getAppWidgetName(), export_model);
            });
            fcs.ui.seleccion_modelo.addListener("changeSelection", function () {
                var prefix = fcs.ui.seleccion_modelo.getValue().seleccion_modelo;
                if (prefix != "por_defecto") {
                    fcs.ui.eliminar_configuracion.setEnabled(true);
                } else {
                    fcs.ui.eliminar_configuracion.setEnabled(false);
                }

                if (prefix == "por_defecto") {
                    var g = fcs.getGroup("columnas_disponibles");
                    var col = 0;
                    var row = 0;
                    var fi = [];
                    for (var i = 0; i < columnsNames.length; i++) {
                        if (col > 3) {
                            row++;
                            col = 0;
                        }
                        var f = {
                            name: columnsNames[i]["id"],
                            label: columnsNames[i]["name"],
                            type: "checkBox",
                            column: col,
                            row: row
                        };
                        fi.push(f);
                        counter++;
                        col++;
                    }
                    g.removeAll();
                    fcs.addFieldsByContainer(fi, g, "grid");
                    addListenerToColumns(fields);
                    for (var i = 0; i < fi.length; i++) {
                        if (fi[i]["type"] == "checkBox" && fi[i]["name"] != "encabezado_boolean") {
                            fcs.ui[fi[i]["name"]].setValue(true);
                        }
                    }
                    return;
                } else {
                    //CAMBIO DE ORDEN
                    var od = qxnw.local.getData("nw_export_mode_order_columns_" + prefix);
                    if (od != null) {
                        var g = fcs.getGroup("columnas_disponibles");
                        var col = 0;
                        var row = 0;
                        var fi = [];
                        for (var i = 0; i < od.length; i++) {
                            if (col > 3) {
                                row++;
                                col = 0;
                            }
                            var f = {
                                name: od[i],
                                label: fcs.labelForm[od[i]].getValue(),
                                type: "checkBox",
                                column: col,
                                row: row
                            };
                            fi.push(f);
                            col++;
                        }
                        g.removeAll();
                        fcs.addFieldsByContainer(fi, g, "grid");
                    }
                }

                addListenerToColumns(fields);

                //VALORES
                var z = qxnw.local.getData("nw_no_import_column_model_" + prefix);
                for (var i = 0; i < fields.length; i++) {
                    if (fields[i]["type"] == "checkBox" && fields[i]["name"] != "encabezado_boolean") {
                        fcs.ui[fields[i]["name"]].setValue(true);
                    }
                }
                if (z != null) {
                    for (var i = 0; i < z.length; i++) {
                        fcs.ui[z[i]].setValue(false);
                    }
                }
            });
            var export_model = qxnw.local.getData("nw_export_model_" + self.getAppWidgetName());
            if (export_model != null) {
                if (typeof export_model.length != 'undefined') {
                    var d = {};
                    d["por_defecto"] = self.tr("Por defecto");
                    for (var i = 0; i < export_model.length; i++) {
                        d[export_model[i]] = export_model[i];
                    }
                    qxnw.utils.populateSelectFromArray(fcs.ui.seleccion_modelo, d);
                }
            } else {
                var d = {};
                d["por_defecto"] = self.tr("Por defecto");
                qxnw.utils.populateSelectFromArray(fcs.ui.seleccion_modelo, d);
                for (var i = 0; i < fields.length; i++) {
                    if (fields[i]["type"] == "checkBox" && fields[i]["name"] != "encabezado_boolean") {
                        fcs.ui[fields[i]["name"]].setValue(true);
                    }
                }
            }

            fcs.ui.encabezado.setIcon(qxnw.config.execIcon("bookmark-new"));
            fcs.ui.vista_previa.setIcon(qxnw.config.execIcon("excel", "qxnw"));

            fcs.ui.encabezado_boolean.addListener("changeValue", function (e) {
                var selected = e.getData();
                qxnw.local.setData("nw_enc_selected_boolean", selected);
                fcs.ui.encabezado.setEnabled(selected);
                fcs.ui.encabezado_max_rows.setEnabled(selected);
                if (selected === true) {
                    fcs.ui.especial.setValue(true);
                }
            });

            var enc_selected_boolean = qxnw.local.getData("nw_enc_selected_boolean");
            if (enc_selected_boolean != null) {
                fcs.ui.encabezado_boolean.setValue(enc_selected_boolean);
                if (enc_selected_boolean === false) {
                    fcs.ui.encabezado.setEnabled(false);
                    fcs.ui.encabezado_max_rows.setEnabled(false);
                }
            } else {
                fcs.ui.encabezado.setEnabled(false);
                fcs.ui.encabezado_max_rows.setEnabled(false);
            }

            var enc_max_rows = qxnw.local.getData("nw_enc_max_rows");
            if (enc_max_rows != null) {
                fcs.ui.encabezado_max_rows.setValue(enc_max_rows);
            } else {
                fcs.ui.encabezado_max_rows.setValue(10);
            }

            fcs.ui.vista_previa.addListener("execute", function () {
                self.exportToExcel();
            });

            fcs.ui.encabezado.addListener("execute", function () {
                var f = new qxnw.forms();
                f.setModal(true);
                f.setTitle(self.tr("Edición de encabezado de exportación por NW-Calculate"));
                f.setWidth(800);
                f.setHeight(600);
                f.createAutomaticButtons();
                f.ui.cancel.addListener("execute", function () {
                    f.close();
                });
                f.ui.accept.addListener("execute", function () {
                    qxnw.utils.question(f.tr("¿Está segur@ de reiniciar su configuración?"), function (e) {
                        if (e) {
                            var funcReset = function (rta) {
                                if (rta == true) {
                                    var maxCols = self.getTotalColumns();
                                    qxnw.utils.information(f.tr("Configuración reiniciada correctamente"));
                                    f.replaceFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() +
                                            "/modulos/nwexcel/file.php?file=/nwlib" + qxnw.userPolicies.getNwlibVersion() +
                                            "/nw_calculate/nw_enc_user.inc.php&functionQXNW=receiveHTMLCalculateEnc&maxRows=" + maxRows + "&maxCols=" + maxCols);
                                }
                            };
                            qxnw.utils.fastAsyncCallRpc("master", "restartExportConfig", 0, funcReset);
                        }
                    });
                });
                f.ui.accept.setLabel(f.tr("Reiniciar configuración"));
                var maxRows = fcs.ui.encabezado_max_rows.getValue();
                qxnw.local.setData("nw_enc_max_rows", maxRows);
                var maxCols = self.getTotalColumns();
                f.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() +
                        "/modulos/nwexcel/file.php?file=/nwlib" + qxnw.userPolicies.getNwlibVersion() +
                        "/nw_calculate/nw_enc_user.inc.php&functionQXNW=receiveHTMLCalculateEnc&maxRows=" + maxRows + "&maxCols=" + maxCols);
                f.show();
            });

            var radioGroup = new qx.ui.form.RadioGroup();
            radioGroup.add(fcs.ui.especial);
            radioGroup.add(fcs.ui.sencilla);

            self.ui["specialDownload"] = fcs.ui.especial;
            var part = self.getAppWidgetName();

            var selectSencilla = qxnw.local.getData("saveSencilla" + part);

            fcs.ui.sencilla.addListener("changeValue", function (e) {
                var sel = e.getData();
                if (sel === true) {
                    fcs.ui.encabezado_boolean.setValue(false);
                }
            });

            if (selectSencilla == true) {
                fcs.ui.sencilla.setValue(true);
            }

            fcs.ui.cancel.addListener("execute", function () {
                fcs.reject();
            });
            fcs.ui.todas.addListener("changeValue", function (e) {
                var d = e.getData();
                fcs.changeCheckBoxValues(d, "encabezado_boolean");
            });
            self.__acceptExportButton = fcs.ui.accept;

            fcs.ui.accept.addListener("execute", function () {
                if (fcs.ui.sencilla.getValue() == true) {
                    this.setEnabled(false);
                    var cols = fcs.getRecord();
                    var colsArray = [];
                    var noExportColumns = [];
                    var labels = {};
                    for (var za in cols) {
                        if (cols[za] != "todas") {
                            if (cols[za] == "false" || cols[za] == false) {
                                if (za != "encabezado_boolean") {
                                    noExportColumns.push(za);
                                    colsArray.push(za);
                                }
                            }
                        }
                    }
                    var columns = self.getTotalColumns();
                    var columnModel = self.table.getTableColumnModel();
                    var label = 0;
                    for (var zb = 0; zb < columns; zb++) {
                        var index = self.getColumnIdFromIndex(zb);
                        label = self.model.getColumnName(zb);
                        labels[index] = label;
                        if (columnModel.isColumnVisible(zb) && colsArray.indexOf(index) == -1) {
                            colsArray.push(index);
                        }
                    }
                    var r = {};
                    if (typeof recordsArray != 'undefined' && typeof recordsArray == "object") {
                        r["records"] = {
                            0: recordsArray
                        };
                    } else {
                        r["records"] = {
                            0: self.getAllRecords()
                        };
                    }
                    r["separado_por"] = cols.separado_por;
                    r["cols"] = colsArray;
                    r["labels"] = labels;
                    r["noExportColumns"] = noExportColumns;
                    var d = {};
                    d["part"] = part;
                    self.saveNoExportColumns(noExportColumns, d["part"]);
                    qxnw.local.storeData("saveSencilla" + d["part"], true);
                    var funcExport = function (data) {
                        try {
                            if (typeof data.id != 'undefined') {
                                if (data.id != "") {
                                    if (data.id != null) {
                                        if (typeof data.id != 'undefined') {
                                            if (typeof data.id != "") {
                                                if (typeof data.id != null) {
                                                    if (typeof callback != 'undefined') {
                                                        callback("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key);
                                                        return;
                                                    }
                                                    if (qx.core.Environment.get("browser.name") == "ie") {
                                                        main.isClosedApp = true;
                                                        window.open(window.location + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key, "ExportDataIE", "width=200, height=100");
                                                    } else {
                                                        main.isClosedApp = true;
                                                        window.location.href = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key;
                                                    }
                                                    try {
                                                        self.__acceptExportButton.setEnabled(true);
                                                    } catch (e) {

                                                    }
                                                    self.__exportDataVar = false;
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

//                    console.log("EXPORT SIMPLE:");
//                    console.log(r);
//                    
//                    console.log(fcs.ui.seleccion_version.getValue()["seleccion_version"]);

                    if (fcs.ui.seleccion_version.getValue()["seleccion_version"] == "v1") {
                        qxnw.utils.fastAsyncRpcCall("exportExcel", "exportSimple", r, funcExport);
                    } else if (fcs.ui.seleccion_version.getValue()["seleccion_version"] == "v2") {
                        qxnw.utils.fastAsyncRpcCall("exportExcelV2", "exportSimple", r, funcExport);
                    }
                    return;
                } else {
                    var records_list = {};
                    if (typeof recordsArray != 'undefined' && typeof recordsArray == "object") {
                        records_list = recordsArray;
                    } else {
                        records_list = self.getAllRecords();
                    }
                    if (parseInt(records_list.length) > 10000) {
                        qxnw.utils.information(self.tr("Para mantener la eficiencia del servidor no es recomendable exportar más de 10000 registros con esta opción, por favor use la exportación sencila o contáctese con el administrador"));
                        return;
                    }
                    var cols = fcs.getRecord();
                    var colsArray = [];
                    var noExportColumns = [];
                    var labels = {};
                    for (var za in cols) {
                        if (cols[za] != "todas" && cols[za] != "vista_previa" && cols[za] != "encabezado" && cols[za] != "encabezado_max_rows" && cols[za] != "encabezado_boolean") {
                            if (cols[za] == "false" || cols[za] == false) {
                                noExportColumns.push(za);
                                colsArray.push(za);
                            }
                        }
                    }
                    var columns = self.getTotalColumns();
                    var columnModel = self.table.getTableColumnModel();
                    var label = 0;
                    for (var zb = 0; zb < columns; zb++) {
                        var index = self.getColumnIdFromIndex(zb);
                        label = self.model.getColumnName(zb);
                        labels[index] = label;
                        if (!columnModel.isColumnVisible(zb) && colsArray.indexOf(index) == -1) {
                            colsArray.push(index);
                        }
                    }
                    var dt = [];
                    var noExportColumns = [];
                    var exportColumns = [];
                    var colorsArray = qxnw.local.getData(self.getAppWidgetName() + "_colors");
                    var columns = self.table.getTableColumnModel().getVisibleColumns();
                    for (var i = 0; i < columns.length; i++) {
                        var columnId = self.table.getTableModel().getColumnId(columns[i]);
                        var columName = self.table.getTableModel().getColumnName(columns[i]);
                        var columType = self.getColumnTypeFromId(columnId);
                        if (cols[columnId] != "true") {
                            noExportColumns.push(columnId);
                        } else {
                            var d = {};
                            var color = null;
                            d[0] = columnId;
                            d[1] = columName;
                            d[2] = columType;
                            if (qxnw.utils.evalue(colorsArray)) {
                                if (typeof colorsArray == 'object') {
                                    for (var ia = 0; ia < colorsArray.length; ia++) {
                                        if (typeof colorsArray[ia]["column"] != 'undefined') {
                                            if (colorsArray[ia]["column"] == columnId) {
                                                if (colorsArray[ia]["type"] == "Sólo letra") {
                                                    colorsArray[ia]["type"] = "SOLO_LETRA";
                                                }
                                                color = colorsArray[ia]["color"] + "::" + colorsArray[ia]["condition"] + ";;" + colorsArray[ia]["value"] + ";;" + colorsArray[ia]["type"];
                                                continue;
                                            }
                                        }
                                    }
                                }
                            }
                            if (canHtml == false) {
                                if (columType == "button") {
                                    continue;
                                }
                            }
                            d[3] = color;
                            exportColumns.push(d);
                        }
                    }
                    dt.push(d);
                    var d = {};
                    d["part"] = part;
                    self.saveNoExportColumns(noExportColumns, d["part"]);
                    qxnw.local.storeData("saveSencilla" + d["part"], false);
                    qxnw.local.storeData("saveExportColumns" + d["part"], exportColumns);
                    self.__exportDataVar = true;
                    this.setEnabled(false);
                    var funcExport = function (data) {
                        try {
                            if (typeof data.id != 'undefined') {
                                if (data.id != "") {
                                    if (data.id != null) {
                                        if (typeof data.id != 'undefined') {
                                            if (typeof data.id != "") {
                                                if (typeof data.id != null) {
                                                    if (typeof callback != 'undefined') {
                                                        callback("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key);
                                                        return;
                                                    }
                                                    if (qx.core.Environment.get("browser.name") == "ie") {
                                                        main.isClosedApp = true;
                                                        window.open(window.location + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key, "ExportDataIE", "width=200, height=100");
                                                    } else {
                                                        main.isClosedApp = true;
                                                        window.location.href = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.id + "&key=" + data.key;
                                                    }
                                                    try {
                                                        self.__acceptExportButton.setEnabled(true);
                                                    } catch (e) {

                                                    }
                                                    self.__exportDataVar = false;
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
                    var r = {};
                    if (typeof recordsArray != 'undefined' && typeof recordsArray == "object") {
                        r["records"] = [];
                        r["records"].push(recordsArray);
                        //r["records"] = recordsArray;
                    } else {
                        //r["records"] = self.getAllRecords();
                        r["records"] = [];
                        r["records"].push(self.getAllRecords());
                    }
                    r["cols"] = colsArray;
                    r["labels"] = labels;
                    r["part"] = self.getAppWidgetName();
                    r["exportCols"] = exportColumns;
                    r["rowHeight"] = self.table.getRowHeight();

                    r["encBoolean"] = cols.encabezado_boolean;
                    r["maxEncRows"] = cols.encabezado_max_rows;

                    qxnw.local.setData("nw_enc_max_rows", cols.encabezado_max_rows);

                    if (typeof img_plot == 'undefined') {
                        img_plot = false;
                    }
                    r["img_plot"] = img_plot;

//                    console.log("PARA EXPORTAR:");
//                    console.log(r);

                    if (fcs.ui.seleccion_version.getValue()["seleccion_version"] == "v1") {
                        qxnw.utils.fastAsyncRpcCall("exportExcel", "exportPHPExcelSimple", r, funcExport);
                    } else if (fcs.ui.seleccion_version.getValue()["seleccion_version"] == "v2") {
                        qxnw.utils.fastAsyncRpcCall("exportExcelV2", "exportPHPExcelSimple", r, funcExport);
                    }
                }
            });
            fcs.show();
            if (typeof execute != 'undefined') {
                fcs.ui.accept.fireEvent("execute");
                fcs.close();
            }
            return true;
        },
        /**
         * Save the columns not exported
         * @param columns {string} the columns array
         * @param part {string} the part key to save
         * @returns {void}
         */
        saveNoExportColumns: function saveNoExportColumns(columns, part) {
            qxnw.local.storeData("saveNoExportColumns" + part, columns);
        },
        /**
         * Exports the selected records to Excel
         * @returns {Boolean}
         */
        exportSelected: function exportSelected() {
            var self = this;
            var rl = self.selectedRecords();
            if (rl.length == 0) {
                qxnw.utils.information(self.tr("Seleccione los registros a exportar"));
                return false;
            }
            self.exportData(rl);
            return true;
        },
        /**
         * Set if the list are multiselect or not
         * @param bool {Boolean} 
         * @return {void}
         */
        setSelectMultiCell: function setSelectMultiCell(bool) {
            var self = this;
            self.__multiCell = bool;
            self.selectAllButton.set({
                enabled: bool
            });
            if (bool === false) {
                self.selectAllButton.setVisibility("excluded");
            }
            if (self.table != null) {
                try {
                    var selectionMode = null;
                    if (bool) {
                        selectionMode = qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION;
                        self.table.getSelectionModel().setSelectionMode(selectionMode);
                    } else {
                        selectionMode = qx.ui.table.selection.Model.SINGLE_SELECTION;
                        self.table.getSelectionModel().setSelectionMode(selectionMode);
                    }
                } catch (e) {
                    //qxnw.utils.bindError(e, self, bool);
                }
            }
            try {
                if (self.__haveAlreadyMulticellFunctionsButtons === false) {
                    self.ui["unSelectButton"].addListener("click", function () {
                        self.clearSelection();
                    });
                    self.ui["selectAllButton"].addListener("click", function () {
                        self.selectAll();
                    });
                    self.__haveAlreadyMulticellFunctionsButtons = true;
                }
            } catch (e) {

            }
        },
        /**
         * Set if the list will have all the buttons or not
         * @param mainForm {Boolean} 
         * @return {void}
         */
        setMainForm: function setMainForm(mainForm) {
            this.__mainForm = mainForm;
        },
        /**
         * Set if the buttons in the list bar will be created or not
         * @param selector {Boolean} 
         * @returns {setButtonsAutomatic}
         */
        setButtonsAutomatic: function setButtonsAutomatic(selector) {
            this.buttonsAutomatic = selector;
        },
        /**
         * Set the serial column
         * @param column {String} the column name. i.e 'id'
         * @return {void}
         */
        serialColumn: function serialColumn(column) {
            this.__serialColumn = column;
        },
        /**
         * Return the serial column
         * @returns {String} the serial column
         */
        getSerialColumn: function getSerialColumn() {
            return this.__serialColumn;
        },
        /**
         * Set the rpcUrl of all class
         * @return {void}
         */
        setRpcUrl: function setRpcUrl() {
            this.rpcUrl = qxnw.userPolicies.rpcUrl();
        },
        /**
         * Return the set rpcUrl
         * @return {String}
         */
        getRpcUrl: function getRpcUrl() {
            return this.rpcUrl;
        },
        addCounterLetters: function addCounterLetters(counterLetters) {
            this.__counterLetters = counterLetters;
        },
        addCounterWords: function addCounterWords(counterWords) {
            this.__counterWords = counterWords;
        },
        /**
         * Set the function to call when the user save in auto table-mode
         * @param func {Object} the function
         * @returns {void}
         */
        setFunctionOnSave: function setFunctionOnSave(func) {
            this.__funcLists = func;
        },
        /**
         * Try to show an automatic form and save the data. Uses the <code>PHP master</code>.
         * @return {void}
         */
        __slotNew: function __slotNew() {
            var self = this;
            var d = new qxnw.forms();

            if (self.getAllPermissions() == true) {
                d.setAllPermissions(true);
            }

            if (self.getHandleTerminalPermissons() == false) {
                d.set({
                    handleTerminalPermissons: false
                });
            }

            var useOtherDB = self.getOtherDB();
            if (useOtherDB != null) {
                d.setOtherDB(useOtherDB);
            }
            var description = self.getDescriptionByObjectName("config");
            if (typeof description.masterOpenModal != 'undefined' && typeof description.masterOpenModal == 'boolean') {
                d.setModal(description.masterOpenModal);
            } else {
                d.setModal(false);
            }
            try {
                d.setTableDescription(self.getTableDescription() == "" ? "[]" : self.getTableDescription());
                d.serialField(self.__serialColumn);
                d.setTableMethod(self.__tableMethodLists);
                if (self.__tableFields == null) {
                    d.createFromTable(self.tableAuto, true, false);
                } else {
                    d.createFromTable(self.tableAuto, true, false, undefined, self.__tableFields);
                }
                if (this.__funcLists != null) {
                    d.setFunctionOnSave(self.__funcLists);
                }
            } catch (e) {
                qxnw.utils.error(e, d);
                return;
            }
            if (self.__counterLetters != null) {
                d.addCounterLetters(self.__counterLetters);
            }
            if (self.__counterWords != null) {
                d.addCounterWords(self.__counterWords);
            }
            var cleanHtml = self.getCleanHTML();
            if (cleanHtml != true) {
                d.setCleanHTML(cleanHtml);
            }
            var cleanSpecialWords = self.getCleanSpecialWords();
            if (cleanSpecialWords != true) {
                d.setCleanSpecialWords(cleanSpecialWords);
            }
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.addListener("reject", function () {
                self.setTableFocus();
            });
            d.setModal(true);
            d.show();
            list_div = d;
        },
        /**
         * Return the ID of an selected record
         * @return {Integer}
         */
        getSelectedRecordId: function getSelectedRecordId() {
            var self = this;
            var r = self.selectedRecord();
            if (typeof r.id == "undefined") {
                r.id = null;
            }
            return r.id;
        }
        ,
        /**
         * In automatic mode, creates an automatic form and try to save the data
         * @return {void}
         */
        __slotEdit: function __slotEdit() {
            var self = this;
            var r = self.selectedRecord();
            if (typeof r == 'undefined') {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var d = new qxnw.forms();

            if (self.getHandleTerminalPermissons() == false) {
                d.set({
                    handleTerminalPermissons: false
                });
            }

            var useOtherDB = self.getOtherDB();
            if (useOtherDB != null) {
                d.setOtherDB(useOtherDB);
            }
            var description = self.getDescriptionByObjectName("config");
            if (typeof description.masterOpenModal != 'undefined' && typeof description.masterOpenModal == 'boolean') {
                d.setModal(description.masterOpenModal);
            } else {
                d.setModal(false);
            }
            d.setTableDescription(self.getTableDescription() == "" ? "[]" : self.getTableDescription());
            d.setTableMethod(self.__tableMethodLists);


            if (self.__tableFields == null) {
                if (!d.createFromTable(self.tableAuto, true, true, r)) {
                    return;
                }
            } else {
                if (!d.createFromTable(self.tableAuto, true, true, r, self.__tableFields)) {
                    return;
                }
            }

            if (!d.setParamRecord(r)) {
                qxnw.utils.alert(self.tr("No se usó el setParamRecord"));
                return;
            }
            var cleanHtml = self.getCleanHTML();
            if (cleanHtml != true) {
                d.setCleanHTML(cleanHtml);
            }
            var cleanSpecialWords = self.getCleanSpecialWords();
            if (cleanSpecialWords != true) {
                d.setCleanSpecialWords(cleanSpecialWords);
            }
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.addListener("reject", function () {
                self.setTableFocus();
            });

            if (self.__counterLetters != null) {
                d.addCounterLetters(self.__counterLetters);
            }
            if (self.__counterWords != null) {
                d.addCounterWords(self.__counterWords);
            }
            d.setModal(true);
            d.show();
            list_edit_div = d;
        }
        ,
        getTotalSelectedRows: function getTotalSelectedRows() {
            var self = this;
            var selection = self.table.getSelectionModel().getSelectedCount();
            return selection;
        },
        /**
         * Try to delete the selected record. This used the <code>PHP master</code>.
         * @return {void}
         */
        __slotDelete: function __slotDelete() {
            var self = this;

            var sm = self.table.getSelectionModel();
            var srs = sm.getSelectedRanges();

            var selectedRows = self.getTotalSelectedRows();
            var r = {};
            if (selectedRows > 1) {
                r.detail = self.selectedRecords();
                r["records"] = selectedRows;
            } else {
                r = self.selectedRecord();
            }
            if (r == 'undefined' || r == null) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            r["table"] = this.tableAuto;

            var useOtherDB = self.getOtherDB();
            if (useOtherDB != null) {
                r["useOtherDB"] = useOtherDB;
            }

            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), this.__tableMethodLists);
            rpc.setAsync(true);
            var func = function () {

                self.removeSelectedRows();

                if (srs !== null && typeof srs.length !== 'undefined') {
                    if (typeof srs[0] !== 'undefined') {
                        if (typeof srs[0].minIndex !== 'undefined' && typeof srs[0].maxIndex !== 'undefined') {
                            sm.setSelectionInterval(srs[0].minIndex, srs[0].maxIndex);
                        }
                    }
                }
//                self.ui["deleteButton"].focus();
            };
            rpc.exec("delete", r, func);
        }
        ,
        /**
         * In automatic creation mode, set the table method
         * @param method {String} the table name
         * @return {Boolean}
         */
        setTableMethod: function setTableMethod(method) {
            this.__tableMethodLists = method;

            //TRY TO FIX AUTO UPDATE
            if (this.__alreadyMakeAutoUpdate === false) {
                var data = this.__getStoredConfiguration();
                if (data == null) {
                    data = {};
                    data["autoUpdate"] = true;
                    this.__saveConfiguration(data);
                }
                this.__alreadyMakeAutoUpdate = true;
            }
            return true;
        }
        ,
        /**
         * Return the table method. Id dont have one, return false
         * @return {Boolean}
         */
        getTableMethod: function getTableMethod() {
            if (this.__tableMethodLists) {
                return this.__tableMethodLists;
            } else {
                return false;
            }
        }
        ,
        getTableDescription: function getTableDescription() {
            return this.__tableDescription;
        },
        /**
         * Create a <code>qxnw.lists</code> passing as variable the table name
         * @param table {String} the table name
         * @returns {void}
         */
        createFromTable: function createFromTable(table) {
            var self = this;
            self.setTable(table);
            self.setSelectMultiCell(false);
            self.tableAuto = table;
            self.__separImp.setVisibility("visible");
            self.ui.importButton.setVisibility("visible");
            self.__containerPagination.setVisibility("visible");
            self.setUserData("table", table);
            self.fireEvent("loadedTable");
            self.buttonsAutomatic = true;
            var data = {};
            data["table"] = table;
            if (typeof self.__tableMethodLists == 'undefined' || self.__tableMethodLists == null || self.__tableMethodLists == '') {
                if (self.tableAuto != null) {
                    self.__tableMethodLists = "master";
                }
            }
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), self.__tableMethodLists);
            rpc.setAsync(true);

            var useOtherDB = self.getOtherDB();
            if (useOtherDB != null) {
                data["useOtherDB"] = useOtherDB;
            }

            var func = function (r) {

                self.__tableFields = r;

                var columns = r.cols;

                self.__tableDescription = r.table_description;
                var filters = [];
                var filt = {
                    name: "search",
                    label: "Filtro...",
                    type: "textField"
                };
                filters.push(filt);
                var filter_dates = [];
                var hiddenSbox = true;
                var haveTime = false;
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
                            if (typeof description[1] != 'undefined') {
                                if (description[1] == "array") {
                                    hiddenSbox = false;
                                }
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
                            if (typeof columns[i].alter_label != 'undefined') {
                                if (columns[i].alter_label != "") {
                                    if (columns[i].alter_label != "0") {
                                        if (columns[i].alter_label != 0) {
                                            columns[i].label = qxnw.utils.ucfirst(qxnw.utils.replaceAll(columns[i].alter_label, "_", ""));
                                        }
                                    }
                                }
                            }
                            if (typeof description[6] != 'undefined' && (description[6] === true || description[6] === "true")) {
                                if (description[6]) {
                                    if (columns[i].type == "dateField") {
                                        filter_dates.push(columns[i]);
                                    } else if (columns[i].type == "dateTimeField") {
                                        haveTime = true;
                                        filter_dates.push(columns[i]);
                                    } else {
                                        filters.push(columns[i]);
                                    }
                                }
                            }
                        }
                    } else {
                        columns[i].visible = true;
                        columns[i].desc = "";
                    }
                    if (columns[i].type == "selectBox" && hiddenSbox == true) {
                        columns[i].hide = false;
                    }
                    hiddenSbox = true;
                }
                self.setColumns(columns);

                if (filter_dates.length > 0) {
                    var typeFilter = "dateField";
                    if (haveTime == true) {
                        typeFilter = "dateTimeField";
                    }
                    var d = {
                        name: "dateFieldFilter",
                        caption: "dateFieldFilter",
                        type: "selectBox",
                        label: self.tr("Filtro fechas")
                    };
                    filters.push(d);
                    d = {
                        name: "fecha_inicial_filters",
                        caption: "fecha_inicial_filters",
                        type: typeFilter,
                        label: self.tr("Fecha inicial")
                    };
                    filters.push(d);
                    d = {
                        name: "fecha_final_filters",
                        caption: "fecha_final_filters",
                        type: typeFilter,
                        label: self.tr("Fecha final")};
                    filters.push(d);
                }
                self.createFilters(filters);

                for (var iaa = 0; iaa < filter_dates.length; iaa++) {
                    var dd = {};
                    dd[filter_dates[iaa].name] = qxnw.utils.replaceAll(filter_dates[iaa].label, "<b style='color:red'>*</b>", "");
                    qxnw.utils.populateSelectFromArray(self.ui.dateFieldFilter, dd);
                }
                for (var i = 0; i < columns.length; i++) {
                    var description = null;
                    if (typeof columns[i].hide != 'undefined' && columns[i].hide == false) {
                        //self.hideColumn(columns[i].name, false);
                    }
                    if ((columns[i].description != "") && (typeof columns[i].description != 'undefined')) {
                        if (columns[i].description != null) {
                            description = columns[i].description.split(",");
                            if (typeof description[6] != 'undefined' && (description[6] === true || description[6] === "true")) {
                                switch (description[0]) {
                                    case "selectBox":
                                        var desc = description[1].split(".");
                                        if (typeof desc[1] == 'undefined' || desc[1] != "label") {

                                            if (description[1] == "array") {
                                                var d = {};
                                                var descriptionSelectBox = self.getDescriptionByObjectName("selectBoxArrays");
                                                qxnw.utils.populateSelectFromArray(self.ui[columns[i]["name"]], descriptionSelectBox[0]["data"]);
                                            } else {
                                                var d = {};
                                                d[""] = "Todos";
                                                var param = {};
                                                param["table"] = description[1];
                                                if (typeof useOtherDB != 'undefined') {
                                                    param["useOtherDB"] = useOtherDB;
                                                }
                                                //TODO: SE QUITA EL Async PARA QUE SE SELECCIONE AUTOMÁTICAMENTE                                            
                                                qxnw.utils.populateSelectFromArray(self.ui[columns[i]["name"]], d);
                                                var param = {};
                                                param["table"] = description[1];
                                                if (typeof useOtherDB != 'undefined') {
                                                    param["useOtherDB"] = useOtherDB;
                                                }
                                                qxnw.utils.populateSelect(self.ui[columns[i]["name"]], "master", "populate", param);
//                                                qxnw.utils.populateSelect(self.ui[columns[i]["name"]], "master", "populate", {table: description[1]});
                                            }
                                            continue;
                                        }
                                        break;
                                    case "selectTokenField":
                                        var desc = description[1].split(".");
                                        var userData = {};
                                        userData["table"] = description[1];
                                        userData["type"] = description[0];
                                        userData["name"] = columns[i].caption;
                                        userData["func"] = typeof desc[1] == 'undefined' ? "populateTokenField" : desc[1];
                                        userData["method"] = desc.length == 1 ? self.__tableMethodLists : desc[0];
                                        self.ui[columns[i].name].setUserData("selectTokenField", userData);
                                        self.ui[columns[i].name].addListener("loadData", function (e) {
                                            var str = e.getData();
                                            var userData = e.getTarget().getUserData("selectTokenField");
                                            if (userData == null) {
                                                return;
                                            }
                                            data["text"] = str;
                                            data["token"] = str;
                                            data["table"] = userData["table"];
                                            var rpc = new qxnw.rpc(self.getRpcUrl(), userData["method"]);
                                            rpc.setAsync(true);
                                            var func = function (r) {
                                                self.ui[userData["name"]].setModelData(r);
                                            };
                                            rpc.exec(userData["func"], data, func);
                                        }, this);
                                        break;
                                }
                            } else {
                                continue;
                            }
                        } else {
                            continue;
                        }
                    }
                }
                self.table.applySavedConfigurations();
                self.ui.searchButton.addListener("execute", function () {
                    self.applyFilters();
                });
                if (self.buttonsAutomatic) {
                    self.addButonsFunctions();
                }
                self.execSettings();

                self.applyConditions();

                self.fireDataEvent("areLoadedColumns");
            };
            rpc.exec("getColumns", data, func);
        },
        applyConditions: function applyConditions() {
            var self = this;
            var description = self.getDescriptionByObjectName("conditions");
            if (typeof description != 'undefined' && description != false) {
                if (description.length > 0) {
                    for (var i = 0; i < description.length; i++) {
                        var r = description[i];
                        var conditions = ["=", ">", "<", "!="];
                        switch (r.action) {
                            case "colorHeader":
                                var newColor = {
                                    col: r.where,
                                    color: r.color
                                };
                                if (qxnw.utils.searchIntoArrayByKey(self.__colorHeaders, r.where, "col") == false) {
                                    self.__colorHeaders.push(newColor);
                                }
                                continue;
                            case "hide":
                                var condition = "";
                                var where = "";
                                for (var ia = 0; ia < conditions.length; ia++) {
                                    var v = conditions[ia];
                                    where = r.where.split(v);
                                    if (where.length > 0) {
                                        condition = v;
                                        break;
                                    }
                                }
                                var columns = r.widget.split(",");
                                if (condition == "=") {
                                    if (self.up[where[0]] == where[1]) {
                                        for (var ib = 0; ib < columns.length; ib++) {
                                            var cols = columns[ib];
                                            self.hideColumn(cols);
                                        }
                                    }
                                }
                                continue;
                            case "disable":
                                var condition = "";
                                var where = "";
                                for (var ic = 0; ic < conditions.length; ic++) {
                                    var v = conditions[ic];
                                    where = r.where.split(v);
                                    if (where.length > 0) {
                                        condition = v;
                                        break;
                                    }
                                }
                                var columns = r.widget.split(",");
                                if (self.up[where[0]] == where[1]) {
                                    for (var id = 0; id < columns.length; id++) {
                                        var cols = columns[id];
                                        if (typeof self.ui[cols] != 'undefined') {
                                            self.ui[cols].setEnabled(false);
                                        }
                                    }
                                }
                                continue;
                            case "set":
                                var condition = "";
                                var where = "";
                                for (var ig = 0; ig < conditions.length; ig++) {
                                    var v = conditions[ig];
                                    where = r.where.split(v);
                                    if (where.length > 0) {
                                        condition = v;
                                        break;
                                    }
                                }
                                var columns = r.widget.split(",");
                                if (self.up[where[0]] == where[1]) {
                                    if (condition == "=") {
                                        for (var ih = 0; ih < columns.length; ih++) {
                                            var cols = columns[ih];
                                            if (typeof self.ui[cols] != 'undefined') {
                                                self.ui[cols].setValue(r.value);
                                            }
                                        }
                                    }
                                }
                                continue;
                        }
                    }
                }
            }
        }
        ,
        getFirstColumnVisible: function getFirstColumnVisible() {
            var self = this;
            var last = self.getTotalColumns();
            for (var i = 0; i < last; i++) {
                if (self.table.getTableColumnModel().isColumnVisible(i)) {
                    return i;
                }
            }
        },
        flushEditing: function flushEditing() {
            if (this.table == null) {
                return;
            }
            if (this.table.isEditing()) {
                this.table.stopEditing();
            }
        },
        flushEditor: function flushEditor() {
            this.flushEditing();
        },
        setFocusCell: function setFocusCell(col, row) {
            this.table.setFocusedCell(col, row);
        },
        startTimer: function startTimer() {
            var self = this;
            var data = self.__getStoredConfiguration();
            if (data == null) {
                return;
            }
            //TODO: posible problema del timer
            data.secsToUpdate = data.secsToUpdate * 1000;
            if (data.secsToUpdate > 0 && typeof data.secsToUpdate != 'undefined') {
                if (self.__timerInit != data.secsToUpdate) {
                    if (self.__isTimerCreated) {
                        if (!self.__timer.getEnabled()) {
                            self.__timer.start();
                        }
                        self.__timer.setInterval(data.secsToUpdate);
                        self.__timerInit = data.secsToUpdate;
                    } else {
                        self.__timerInit = data.secsToUpdate;
                        self.__timer = new qx.event.Timer(data.secsToUpdate);
                        self.__timer.start();
                        self.__timer.addListener("interval", function (e) {
                            self.setShowLoading(false);
                            if (typeof self.applyFilters == 'function') {
                                qxnw.userPolicies.setShowLoading(false);
                                var fr = self.table.getFocusedRow();
                                var fc = self.table.getFocusedColumn();
                                self.applyFilters();
                                self.addListenerOnce("returnModelData", function () {
                                    self.table.setFocusedCell(fc, fr);
                                    qxnw.userPolicies.setShowLoading(true);
                                });
                            }
                            self.setShowLoading(true);
                        });
                        self.__isTimerCreated = true;
                    }
                }
            } else {
                if (self.__isTimerCreated) {
                    self.__timer.stop();
                }
            }
        }
        ,
        /**
         * Add a <code>qxnw.contextMenu</code> with your oun values
         * @param name {String} the name and label of the context menu
         * @param icon {String} the path of the icon 
         * @param func {Function} the function to invoque as callback 
         * @param parent {Object} the parent of the context menu 
         * @returns {void}
         */
        addAutoContextMenu: function addAutoContextMenu(name, icon, func, parent) {
            this.cm = {
                name: name,
                icon: icon,
                func: func,
                parent: parent
            };
            var alterCm = {
                name: name,
                icon: icon,
                func: func
            };
            qxnw.local.storeData("qxnw_subwindow_contextmenu", alterCm);
        }
        ,
        getContextMenuAdedItems: function getContextMenuAdedItems() {
            return this.cm;
        },
        setContextMenuAdedItems: function setContextMenuAdedItems(cmi) {
            this.cm = cmi;
        },
        __slotDuplicity: function __slotDuplicity() {
            var self = this;
            var func = function () {
                self.applyFilters();
            };
            var sl = self.getSelectedRecord();
            if (sl.length == 0) {
                return;
            }
            qxnw.utils.fastAsyncCallRpc("master", "duplicarRow", {table: self.tableAuto, row: sl.id}, func);
        }
        ,
        /**
         * Sets the automated context menu when a automatic list is set
         * @param pos {qx.ui.event.type.Mouse} the mouse event
         * @returns {void}
         */
        contextMenu: function contextMenu(pos) {
            var self = this;
            if (self.tableAuto == null) {
                return;
            }
            var target = pos.getTarget();
            if (target != null && typeof target == 'object') {
                if (typeof target.classname != 'undefined') {
                    if (target.classname == "qx.ui.table.pane.Pane") {
                        return;
                    }
                    if (target.classname == "qx.ui.basic.Label") {
                        return;
                    }
                }
            }
            var sl = self.selectedRecord();
            if (sl == null || typeof sl == 'undefined') {
                return;
            }
            self.m = new qxnw.contextmenu(this);

            if (self.__permissionsLists["edits"] !== false) {
                self.m.addAction(self.tr("Editar"), qxnw.config.execIcon("edit-select-all"), function () {
                    self.__slotEdit();
                });
            }
            self.m.addAction(self.tr("Duplicar"), qxnw.config.execIcon("edit-copy"), function () {
                self.__slotDuplicity();
            });
            if (self.__permissionsLists["deletes"] !== false) {
                self.m.addAction(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete"), function () {
                    qxnw.utils.question(self.tr("¿Está seguro de eliminar el registro? Recuerde que de estos ítems depende la funcionalidad del sistema."), function (e) {
                        if (e) {
                            self.__slotDelete();
                        }
                    });
                });
            }
            var description = self.getDescriptionByObjectName("contextMenu");
            if (description != false) {
                if (description.length > 0) {
                    for (var i = 0; i < description.length; i++) {
                        var v = description[i];
                        self.m.addAction(v.label, qxnw.config.execIcon(v.icon), function () {
                            if (typeof v.question != 'undefined' && typeof v.questionAsk != 'undefined' && v.question == true) {
                                qxnw.utils.question(v.questionAsk, function (e) {
                                    if (e) {
                                        main[v.slot](sl, self);
                                    }
                                });
                            } else {
                                main[v.slot](sl, self);
                            }
                        });
                    }
                }
            }
            if (self.cm != null) {
                self.m.addAction(self.cm.name, self.cm.icon, function () {
                    var id = self.getSelectedRecordId();
                    var sl = self.getSelectedRecords();
                    self.cm.parent[self.cm.func](id, sl, self);
                });
            }
            self.m.exec(pos);
        },
        /**
         * Create the automatic buttons of a table bar. If a <code>mainForm</code> is true, it will not create some buttons
         * @return {void}
         */
        addButonsFunctions: function addButonsFunctions() {
            var self = this;
            if (this.__mainForm) {
                self.ui["newButton"].addListener("click", function () {
                    self.__slotNew();
                });
                self.ui["deleteButton"].addListener("click", function () {
                    var r = self.selectedRecord();
                    if (typeof r == 'undefined') {
                        qxnw.utils.information(self.tr("No hay registros seleccionados"));
                        return;
                    }
                    qxnw.utils.question(self.tr("¿Está segur@ de eliminar el registro?"), function (e) {
                        if (e) {
                            self.__slotDelete();
                        }
                    });
                });
                self.ui["editButton"].addListener("click", function () {
                    self.__slotEdit();
                });
            }
            if (self.__haveAlreadyMulticellFunctionsButtons === false) {
                self.ui["unSelectButton"].addListener("click", function () {
                    self.clearSelection();
                });
                self.ui["selectAllButton"].addListener("click", function () {
                    self.selectAll();
                });
                self.__haveAlreadyMulticellFunctionsButtons = true;
            }
            self.ui["updateButton"].addListener("click", function () {
                self.applyFilters();
            });
//            self.ui["exportButton"].addListener("click", function() {
//                self.exportData();
//            });
            //            self.ui["printButton"].addListener("click", function() {
//                self.printData();
//            });
            //            self.ui["emailButton"].addListener("click", function() {
            //                self.sendLineByEmail();
//            });
        }
        ,
        /**
         * Returns the table fields calling a PHP set in the variable <code>__tableMethodLists</code>, 
         * with the method in execution <code>getColumns</code>
         * @param table {String} the table name
         * @returns {Array} the array containing all the called information
         */
        getTableFields: function getTableFields(table) {
            var data = {};
            data["table"] = table;
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), this.__tableMethodLists);
            var r = rpc.exec("getColumns", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError().message);
                return false;
            }
            return r;
        }
        ,
        /**
         * Return the columns set 
         * @returns {Array} the array containing the information of columns
         */
        getColumns: function getColumns() {
            return this.columns;
        },
        /**
         * Return the captions set 
         * @returns {Array} the array containing the information of captions
         */
        getCaptions: function getCaptions() {
            return this.captions;
        },
        getFilters: function getFilters() {
            return this.filters;
        },
        /**
         * Apply filters and call to a PHP file. Need the method and call the execution method <code>execPage</code>
         * @returns {void}
         */
        applyFilters: function applyFilters() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            if (self.__tableMethodLists == null) {
                return;
            }
            var data = {};
            data["table"] = this.tableAuto;
            data.filters = self.getFiltersData();

            var useOtherDB = self.getOtherDB();
            if (useOtherDB != null) {
                data["useOtherDB"] = useOtherDB;
            }

            var rpc = new qxnw.rpc(self.getRpcUrl(), self.__tableMethodLists);
            if (!self.getShowLoading()) {
                rpc.setShowLoading(false);
            }
            rpc.setAsync(true);
            var func = function (r) {
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
        /**
         * Set centered the list
         * @returns {void}
         */
        setCenter: function setCenter() {
            this.addListener("resize", this.center);
        }
        ,
        /**
         * 
         * @returns {createBase}
         */
        createBase: function createBase() {
            var self = this;
            if (self.__isCreatedBaseLists) {
                return;
            }
            this.__createContainers();
            this.__createToolBar();
            if (!self.__empty) {
                this.__createFooterToolBar();
            }
            self.__isCreatedBaseLists = true;
            if (!self.__empty) {
                self.createTable();
            }
//            var listenerIdAppear = self.addListener("appear", function (e) {
//                self.setStoredPosition();
//                self.setStoredSize();
//            });
//            self.setAppearListenerId(listenerIdAppear);
            var listenerIdMove = self.addListener("move", function (e) {
                self.storePosition(e.getData(), "move");
            });
            self.setMoveListenerId(listenerIdMove);
//            var listenerIdResize = self.addListener("resize", function (e) {
//                self.storeSize(e.getData());
//            });
//            self.setResizeListenerId(listenerIdResize);
            var listenerIdClose = self.addListener("close", function (e) {
                self.cleanAll();
            });
            self.setCloseListenerId(listenerIdClose);
        }
        ,
        haveMinimizedTools: function haveMinimizedTools() {
            var children = this.__leftOptionsContainer.getChildren();
            if (children.length > 0) {
                return true;
            } else {
                return false;
            }

        }
        ,
        /**
         * Add minimized to toolbar options
         * @param widget {object} the button
         * @returns {void}
         */
        addToLeftOptions: function addToLeftOptions(widget) {
            if (typeof widget == 'undefined') {
                return;
            }
            widget.resetMaxHeight();
            widget.resetMaxWidth();
            qxnw.utils.addBorder(widget, "black", 1);
            widget.setUserData("stateAll", "minimized");
            this.__leftOptionsContainer.resetMaxWidth();
            this.__leftOptionsContainer.setMaxWidth(30);
            var lbl = widget.getLabel();
            widget.setUserData("name", lbl.toString());
            var expl = lbl.split("");
            var newLbl = "";
            for (var i = 0; i < expl.length; i++) {
                newLbl += expl[i];
                newLbl += "<br />";
            }
            widget.setRich(true);
            widget.getChildControl("label").setValue(newLbl);
            widget.setIconPosition("bottom");
//            var el = widget.getContentElement().getDomElement();
//            qx.bom.element.Animation.animate(el, {
            //                duration: 1000, timing: "ease", keep: 100, keyFrames: {
            //                    0: {rotate: "0deg"}, // ["0deg"] for flipping effect
//                    100: {rotate: "-90deg"}  // ["180deg"] for flipping effect
//                }
//            });
            widget.setShow("both");
            //this.__leftOptionsContainer.setWidth(25);
            //widget.setHeight(20);
            //            var ela = this.__leftOptionsContainer.getContentElement().getDomElement();
            //            qx.bom.element.Style.set(ela, "maxWidth", 20);
            //qx.bom.element.Transform.rotate(el, "-90deg");             //qxnw.utils.addBorder(this.__leftOptionsContainer);
            var children = this.__leftOptionsContainer.getChildren();
            switch (children.length) {
                case 1:
                    var userData = children[0].getUserData("name");
                    if (userData == "Pie") {
                        this.__leftOptionsContainer.addBefore(widget, children[0]);
                    } else if (userData == "Filtros") {
                        if (lbl.toString() == "Pie") {
                            this.__leftOptionsContainer.addAfter(widget, children[0]);
                        } else {
                            this.__leftOptionsContainer.addBefore(widget, children[0]);
                        }
                    } else if (userData == "Herramientas") {
                        if (lbl.toString() == "Pie") {
                            this.__leftOptionsContainer.add(widget);
                        } else {
                            this.__leftOptionsContainer.addBefore(widget, children[0]);
                        }
                    }
                    break;
                case 2:
                    var userData = children[0].getUserData("name");
                    var userDataOther = children[1].getUserData("name");
                    if (userData == "Herramientas" && userDataOther == "Pie") {
                        this.__leftOptionsContainer.addBefore(widget, children[1]);
                    } else if (userData == "Filtros" && userDataOther == "Pie") {
                        this.__leftOptionsContainer.addBefore(widget, children[0]);
                    } else if (userData == "Filtros" && userDataOther == "Herramientas") {
                        this.__leftOptionsContainer.add(widget);
                    } else if (userData == "Herramientas" && userDataOther == "Pie") {
                        this.__leftOptionsContainer.addBefore(widget, children[1]);
                    } else if (userData == "Herramientas" && userDataOther == "Filtros") {
                        this.__leftOptionsContainer.add(widget);
                    }
                    break;
                default:
                    this.__leftOptionsContainer.add(widget);
                    break;
            }
            this.__haveMinimizedTools = true;
        }
        ,
        /**
         * Create the 3 containers of this class.
         * @return {void}
         */
        __createContainers: function __createContainers() {
            this.__leftOptionsContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 0,
                maxWidth: 0
            });
            this.__parentContainer.addBefore(this.__leftOptionsContainer, this.__verticalContainer, {
                flex: 0
            });
            this.__leftOptionsContainer.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_lists_right_minimized");
            });
            this.chartsContainer = new qx.ui.container.Resizer(new qx.ui.layout.Canvas()).set({
                padding: 3,
                height: 0
            });
            this.chartsContainer.setVisibility("excluded");
            this.__verticalContainer.add(this.chartsContainer, {
                flex: 1
            });
            this.containerTools = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 3
            });
            this.__verticalContainer.add(this.containerTools, {
                flex: 0
            });
            this.containerFilters = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                spacing: 5
            })).set({
                padding: 5,
                allowGrowY: false,
                allowShrinkY: true
            });
            this.__verticalContainer.add(this.containerFilters, {
                flex: 1
            });
            var centerLayout = new qx.ui.layout.VBox();
            this.containerTable = new qx.ui.container.Composite(centerLayout);
            this.__verticalContainer.add(this.containerTable, {
                flex: 1
            });
            this.containerFooterTools = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 3
            });
            this.__verticalContainer.add(this.containerFooterTools);
        }
        ,
        hideFooterTools: function hideFooterTools() {
            this.containerFooterTools.setVisibility("excluded");
        },
        setMaximizedDynamicTable: function setMaximizedDynamicTable(desktop, containerModes) {
            this.setMaximizedDynamicTable = true;
            this.desktop = desktop;
            this.dynamicFiltersWidget = containerModes;
        },
        hideFilters: function hideFilters() {
            this.containerFilters.setVisibility("excluded");
        },
        hideTools: function hideTools() {
            this.containerTools.setVisibility("excluded");
        },
        excludeColumn: function excludeColumn(columnName) {
            this.hideColumn(columnName, false);
            this.__hiddenColumns.push(columnName);
            this.table.setExcludedColumns(this.__hiddenColumns);
        },
        hideAllColumns: function hideAllColumns() {
            var self = this;
            if (self.__hiddenColumnsModel !== null) {
                for (var i = 0; i < self.__hiddenColumnsModel.length; i++) {
                    var v = self.__hiddenColumnsModel[i];
                    self.table.getTableColumnModel().setColumnVisible(v["column"], v["visible"]);
                }
            }
        },
        /**
         * Hide a column by name
         * @param columnName {String}  the column name
         * @param bool {Boolean} hide or show
         * @return {void}
         */
        hideColumn: function hideColumn(columnName, bool) {
            var self = this;
            if (typeof bool == 'undefined') {
                bool = false;
            }
            var column = self.columnIndexFromName(columnName);
            if (column === -1) {
                return;
            }
            if (typeof column == 'undefined') {
                return;
            }
            var d = {};
            d["columnName"] = columnName;
            d["column"] = column;
            d["visible"] = bool;
            self.__hiddenColumnsModel.push(d);
            return;
//            
//            console.log(columnName);
//            console.log(column);
//            console.log(bool);
//            return;
//            try {
//                this.table.getTableColumnModel().setColumnVisible(column, bool);
//            } catch (e) {
//                return;
//            }
        },
        /**          * Send the selected line by email
         * @returns {Boolean} if the operation was successfull
         */
        sendLineByEmail: function sendLineByEmail() {
            var self = this;
            var sl = self.selectedVisibleRecord();
            if (typeof sl == 'undefined') {
                qxnw.utils.information(self.tr("Seleccione el registro a enviar"));
                return false;
            }
            var f = new qxnw.forms();
            f.setAppWidgetName("lists_send_email_" + self.getAppWidgetName());
            f.setCaption(self.tr("Enviar líneas por correo electrónico"));
            var fields = [
                {
                    name: "nombre",
                    label: "Nombre",
                    type: "textField",
                    required: true,
                    mode: "search.string"
                },
                {
                    name: "enviar_a",
                    label: "Enviar a un correo",
                    type: "textField",
                    mode: "search.email"
                },
                {
                    name: "enviar_a_grupo",
                    label: "Enviar a un grupo",
                    type: "selectBox"
                },
                {
                    name: "observaciones",
                    label: "Observaciones",
                    type: "textArea"
                }
            ];
            f.setFields(fields);
            var data = {
                "": "Seleccione..."
            };
            qxnw.utils.populateSelectFromArray(f.ui.enviar_a_grupo, data);
            qxnw.utils.populateSelect(f.ui.enviar_a_grupo, "email", "getGroupsByUser");
            f.ui.enviar_a_grupo.addListener("changeSelection", function () {
                var s = this.getValue();
                if (s.enviar_a_grupo == "") {
                    f.ui.enviar_a.setValue("");
                    f.ui.enviar_a.setEnabled(true);

                    f.ui.nombre.setValue("");
                    f.ui.nombre.setEnabled(true);
                } else {
                    f.ui.enviar_a.setValue("");
                    f.ui.enviar_a.setEnabled(false);

                    f.ui.nombre.setValue("");
                    f.ui.nombre.setEnabled(false);
                }
            });
            f.ui.accept.addListener("execute", function () {
                sl.detail = f.getRecord();
                var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "master");
                rpc.setAsync(true);
                var func = function (r) {
                    var func = function (rta) {
                        if (rta === true) {

                        } else {
                            f.accept();
                        }
                    };
                    qxnw.utils.question(r, func);
                };
                rpc.exec("sendLineByEmail", sl, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
            f.show();
            return true;
        }
        ,
        /**
         * Return the column index from a column name
         * @param index {String} the column name
         * @return {Number} the column index
         */
        columnNameFromIndex: function columnNameFromIndex(index) {
            var self = this;
            if (self.captions.length == 0) {
                return;
            }
            for (var i = 0; i < self.captions.length; i++) {
                if (i == index) {
                    return this.captions[i];
                }
            }
            return -1;
        }
        ,
        /**
         * Return the column index from a column name
         * @param columnName {String} the column name
         * @return {Number} the column index
         */
        columnIndexFromName: function columnIndexFromName(columnName) {
            var self = this;
            if (self.captions.length == 0) {
                return;
            }
            for (var i = 0; i < self.captions.length; i++) {
                if (this.captions[i] == columnName) {
                    return i;
                }
            }
            return -1;
        },
        getMaxShowRows: function getMaxShowRows() {
            if (this.maxRowsValue != null) {
                return this.maxRowsValue;
            } else {
                var data = qxnw.local.getData(this.getAppWidgetName() + "_max_show_rows");
                return data;
            }
        },
        setMaxShowRows: function setMaxShowRows(maxRows) {
            this.maxRowsValue = maxRows;
        },
        hideFooterColumnStill: function hideFooterColumnStill() {
            this.__metaAllContainer.setVisibility("excluded");
        },
        createUpColumns: function createUpColumns(columns, colorLabel, fontSize, minHeight) {
            var self = this;
            if (typeof minHeight == 'undefined') {
                minHeight = 54;
            }
            var filt = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                minHeight: minHeight
            });
            var tableModel = self.table.getPaneScroller(0).getTablePaneModel();
            var cm = self.table.getTableColumnModel();
            var total = tableModel.getColumnCount();
            var paneHeaderWidget = self.table.getPaneScroller(0).getHeader();
            var currentColumn = 0;
            for (var i = 0; i < columns.length; i++) {
                var r = columns[i];
                switch (r.type) {
                    case "spacer":
                        var width = 0;
                        for (var ia = currentColumn; ia < currentColumn + r.columns; ia++) {
                            if (!cm.isColumnVisible(ia)) {
                                currentColumn++;
                                continue;
                            }
                            var w = cm.getColumnWidth(ia);
                            width = width + w;
                            if (ia == total) {
                                return;
                            }
                        }
                        var spacer = new qx.ui.core.Spacer(width, 5);
                        filt.add(spacer);
                        currentColumn = r.columns + currentColumn;
                        break;
                    case "container":
                        var width = 0;
                        for (var ia = currentColumn; ia < currentColumn + r.columns; ia++) {
                            var w = cm.getColumnWidth(ia);
                            width = width + w;
                            if (!cm.isColumnVisible(ia)) {
                                currentColumn++;
                            }
                            var hr = paneHeaderWidget.getHeaderWidgetAtColumn(ia);
//                            var h = hr.getHeight();
                            if (hr != null) {
                                hr.getChildControl("label").set({
                                    alignY: "bottom"
                                });
                            }
                            if (ia == total) {
                                return;
                            }
                        }
                        var container = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                            minWidth: width,
                            maxHeight: 25
                        });
                        qxnw.utils.addBorder(container, "gray", 1);
                        var size = "";
                        if (typeof fontSize != 'undefined') {
                            size = " size='" + fontSize + "' ";
                        }
                        if (typeof r.colorLabel != 'undefined') {
                            r.label = "<font " + size + " color='" + r.colorLabel + "'>" + r.label + "</font>";
                        } else {
                            if (typeof colorLabel != 'undefined') {
                                r.label = "<font " + size + " color='" + colorLabel + "'>" + r.label + "</font>";
                            }
                        }
                        var lbl = new qx.ui.basic.Label(r.label).set({
                            rich: true,
                            alignX: "center",
                            alignY: "middle"
                        });
                        container.add(lbl, {
                            flex: 1
                        });
                        container.setBackgroundColor(r.color);
                        filt.add(container);
                        currentColumn = r.columns + currentColumn;
                        break;
                }
            }
            var ps = self.table.getPaneScroller(0);
            var containerHeader = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            containerHeader.add(filt);
            ps.getHeaderClipper()._add(containerHeader);
            var t = new qx.event.Timer(1000);
            t.start();
            t.addListener("interval", function (e) {
                t.stop();
                self.blockHeaderElements();
            });
        },
        blockHeaderElements: function blockHeaderElements() {
            if (this.table != null) {
                this.table.blockHeaderElements();
            }
        },
        hideFooterCalculate: function hideFooterCalculate() {
            this.__totalContainer.setVisibility("excluded");
        },
        hideFooterUpdateBySecs: function hideFooterUpdateBySecs() {
            this.spinnerUpdate.setVisibility("excluded");
        },
        /**
         * Create the footer tool bar
         * @returns {void}
         */
        __createFooterToolBar: function __createFooterToolBar() {
            var self = this;
            self.footerToolBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(5).set({
                alignY: "middle"
            })).set({
                maxHeight: 47
            });
            var themeName = qx.theme.manager.Meta.getInstance().getTheme().name;
            if (themeName != "qxnw.themes.aristo.Aristo") {
                self.footerToolBar.getLayout().setSeparator("separator-horizontal");
            }

            var containerPagination = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignY: "middle",
                alignX: "center",
                spacing: 5
            }));
            self.containerPagination = containerPagination;

//            var compositeOrderBy = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
//                alignY: "middle"
//            }));
//            var labelOrderBy = new qx.ui.basic.Label(self.tr("Ordenar por"));
//            //self.__orderBy = new qx.ui.form.SelectBox();
//            self.__orderBy = new qxnw.fields.selectBox();
//
//            self.__orderBy.setTabIndex(qxnw.config.getActualTabIndex());
//
//            var itemOrder = new qxnw.widgets.listItem(self.tr("Ninguno"));
//            itemOrder.setModel("");
//            self.__orderBy.add(itemOrder);
//            self.__orderBy.setToolTip(self.__toolTipsManager("order_by"));
//            self.__orderBy.setMaxHeight(25);
//            self.__orderBy.getChildControl("popup").setKeepActive(true);
//            self.__orderBy.getChildControl("popup").setAutoHide(false);
//            self.__orderBy.setValue = function (value) {
//                var items = this.getSelectables(true);
//                for (var i = 0; i < items.length; i++) {
//                    if (items[i].getModel() == value) {
//                        this.setSelection([items[i]]);
//                    }
//                }
//                return true;
//            };
//            self.__orderBy.getValue = function () {
//                var data = {};
//                if (!this.isSelectionEmpty()) {
//                    var selectModel = this.getSelection()[0].getModel();
//                    data = selectModel;
//                } else {
//                    return "";
//                }
//                return data;
//            };
//            self.ui["order_by"] = self.__orderBy;
//            compositeOrderBy.add(labelOrderBy);
//            compositeOrderBy.add(self.__orderBy, {
//                flex: 1
//            });
//            self.__compositeOrderBy = compositeOrderBy;
//            containerPagination.add(compositeOrderBy);

            var compositeMaxRows = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                alignY: "middle"
            }));
            var labelMaxRows = new qx.ui.basic.Label(self.tr("<b><font color='red'>Registros por página</font></b>")).set({
                rich: true
            });
            self.maxRows = new qx.ui.form.Spinner(100).set({
                minWidth: 90,
                maxWidth: 90,
                maxHeight: 25,
                maximum: 10000000000000,
                minimum: 1
            });
            self.maxRows.setTabIndex(qxnw.config.getActualTabIndex());
            self.maxRows.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    try {
                        self.__focusTablePaneScroll = false;
                        self.applyFilters();
                        this.getChildControl("textfield").focus();
                    } catch (e) {

                    }
                }
            });
            self.maxRows.addListener("changeValue", function () {
                qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", this.getValue());
            });
            self.maxRows.setToolTip(self.__toolTipsManager("maxRows"));
            compositeMaxRows.add(labelMaxRows);
            compositeMaxRows.add(self.maxRows);
            self.compositeMaxRows = compositeMaxRows;
            containerPagination.add(compositeMaxRows);
            self.ui["maxRowsField"] = self.maxRows;

            var containerPage = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                alignY: "middle"
            }));
            var labelPage = new qx.ui.basic.Label(self.tr("Página")).set({
                rich: true
            });
            self.page = new qx.ui.form.Spinner(1).set({
                minWidth: 60,
                maxWidth: 60,
                maxHeight: 25,
                maximum: 10000000000000,
                minimum: 1
            });
            self.page.setTabIndex(qxnw.config.getActualTabIndex());
            self.page.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    try {
                        self.__focusTablePaneScroll = false;
                        self.applyFilters();
                        this.getChildControl("textfield").focus();
                    } catch (e) {

                    }
                }
            });
            self.page.setToolTip(self.__toolTipsManager("actual_page"));
            containerPage.add(labelPage);
            containerPage.add(self.page);
            self.ui["page"] = self.page;
            containerPagination.add(containerPage);

            self.__labelTotalPags = new qx.ui.basic.Label(self.tr("Total <br />páginas: 0")).set({
                rich: true
            });
            self.ui["labelTotalPags"] = self.__labelTotalPags;
            containerPagination.add(self.__labelTotalPags, {
                flex: 1
            });

            var paginationSelect = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignY: "middle"
            }));
            self.initIcon = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("go-first")).set({
                show: "icon",
                maxHeight: 30
            });
            self.initIcon.setTabIndex(qxnw.config.getActualTabIndex());
            self.initIcon.addListener("execute", function () {
                var oldValue = self.ui["page"].getValue();
                if (oldValue != 1) {
                    self.page.setValue(1);
                    self.applyFilters();
                }
            });
            self.nextIcon = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("go-next")).set({
                show: "icon",
                maxHeight: 30
            });
            self.nextIcon.addListener("execute", function () {
                var oldValue = self.ui["page"].getValue();
                if (oldValue != self.__maxPages) {
                    if (oldValue < self.__maxPages) {
                        oldValue = oldValue + 1;
                        self.ui["page"].setValue(oldValue);
                        self.applyFilters();
                    }
                }
            });
            self.previousIcon = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("go-previous")).set({
                show: "icon",
                maxHeight: 30
            });
            self.previousIcon.setTabIndex(qxnw.config.getActualTabIndex());
            self.nextIcon.setTabIndex(qxnw.config.getActualTabIndex());
            self.previousIcon.addListener("execute", function () {
                var oldValue = self.ui["page"].getValue();
                if (oldValue > 1) {
                    oldValue = oldValue - 1;
                    self.ui["page"].setValue(oldValue);
                    self.applyFilters();
                }
            });
            self.lastIcon = new qx.ui.form.Button(self.tr("Test"), qxnw.config.execIcon("go-last")).set({
                show: "icon",
                maxHeight: 30
            });
            self.lastIcon.setTabIndex(qxnw.config.getActualTabIndex());
            self.lastIcon.addListener("execute", function () {
                if (self.__maxPages != null) {
                    self.page.setValue(self.__maxPages);
                    self.applyFilters();
                }
            });
            paginationSelect.add(self.initIcon);
            paginationSelect.add(self.previousIcon);
            paginationSelect.add(self.nextIcon);
            paginationSelect.add(self.lastIcon);
            containerPagination.add(paginationSelect);
            self.__containerPagination = containerPagination;
            //self.__containerPagination.setVisibility("excluded");
            self.footerToolBar.add(containerPagination);

            var metaAllContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                alignY: "middle"
            }));
            var metaContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignY: "middle"
            }));
            self.__metaAllContainer = metaAllContainer;
            self.metaAllContainer = metaAllContainer;
            var labelMaxRows = new qx.ui.basic.Label(self.tr("Mantener columna inmóvil"));
            metaAllContainer.add(labelMaxRows);
            self.__metaColumn = new qxnw.fields.selectBox;
            self.__metaColumn.setTabIndex(qxnw.config.getActualTabIndex());
            self.__metaColumn.setMaxHeight(25);
            self.__metaColumn.setMaxWidth(120);
            self.__metaColumn.getChildControl("popup").setKeepActive(true);
            self.__metaColumn.setToolTip(self.__toolTipsManager("mantainFirstColumn"));
            self.__metaColumn.setValue = function (value) {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getModel() == value) {
                        this.setSelection([items[i]]);
                    }
                }
                return true;
            };
            self.__metaColumn.getValue = function () {
                var data = {};
                if (!this.isSelectionEmpty()) {
                    var selectModel = this.getSelection()[0].getModel();
                    data["metaColumn"] = selectModel;
                } else {
                    return "";
                }
                return data;
            };
            self.mantainFirstColumn = new qx.ui.form.ToggleButton("", qxnw.config.execIcon("format-text-direction-ltr"));
            self.mantainFirstColumn.setTabIndex(qxnw.config.getActualTabIndex());
            self.mantainFirstColumn.setToolTip(self.__toolTipsManager("mantainFirstColumn"));
            self.mantainFirstColumn.set({
                maxWidth: 35,
                maxHeight: 25
            });
            self.mantainFirstColumn.addListener("execute", function (e) {
                var selected = e.getTarget().getValue();
                var column = self.__metaColumn.getValue()["metaColumn"];
                column = parseInt(column) + 1;
                qxnw.local.storeData(self.getAppWidgetName() + "_metaColumn", selected);
                if (selected) {
                    self.table.setMetaColumnCounts([column, -1]);
                    self.populateColumnColorsRetarded();
                } else {
                    self.table.setMetaColumnCounts([0, -1]);
                    self.populateColumnColorsRetarded();
                }
                self.saveFooterToolbarSettings();
            });
            metaContainer.add(self.__metaColumn, {
                flex: 1
            });
            metaContainer.add(self.mantainFirstColumn, {flex: 0
            });
            metaAllContainer.add(metaContainer);
            self.footerToolBar.add(metaAllContainer, {
                flex: 0
            });

            self.spinnerUpdate = new qx.ui.form.Spinner();
            self.spinnerUpdate.setToolTip(self.__toolTipsManager("updateTime"));
            self.spinnerUpdate.setTabIndex(self.__tabIndexListsFooter++);
            self.spinnerUpdate.set({
                minimum: 0,
                maximum: 1000,
                maxWidth: 50,
                minWidth: 50,
                maxHeight: 30
            });
            self.addListener("loadedTable", function () {
                if (!self.isProcessFired("checks")) {
                    var data = self.__getStoredConfiguration();
                    if (data != null) {
//                        if (typeof data.orderBy != 'undefined') {
//                            self.ui["order_by"].setValue(data.orderBy);
//                        }
                        self.updateCheck.setValue(data.autoUpdate);
                        if (data.autoUpdate) {
                            var t = new qx.event.Timer(1000);
                            t.start();
                            t.addListener("interval", function (e) {
                                t.stop();
                                self.applyFilters();
                            });
                        }
                        if (typeof data.secsToUpdate != 'undefined') {
                            self.spinnerUpdate.setValue(data.secsToUpdate);
                        }
                    }
                    if (qxnw.local.isFavorite(self.getAppWidgetName())) {
                        self.favoritesCheck.setValue(true);
                    }
                    self.favoritesCheck.addListener("changeValue", function (e) {
                        if (this.getValue() == true) {
                            var data = {
                                "tableMethod": self.__tableMethodLists,
                                "classname": self.getAppWidgetName(),
                                "isMainForm": self.getIsMainForm(),
                                "serialColumn": self.__serialColumn,
                                "table": self.tableAuto != null ? self.tableAuto : false,
                                "label": self.getName(),
                                "modulo": self.moduloId
                            };
                            qxnw.local.saveFavorite(data);
                        } else {
                            var data = {
                                "tableMethod": self.__tableMethodLists,
                                "classname": self.getAppWidgetName(),
                                "isMainForm": self.getIsMainForm(),
                                "serialColumn": self.__serialColumn,
                                "table": self.tableAuto != null ? self.tableAuto : false,
                                "label": self.getName(),
                                "modulo": self.moduloId
                            };
                            qxnw.local.removeFavorite(data);
                        }
                    });
                }
            });
            self.spinnerUpdate.addListener("focusout", function () {
                self.saveFooterToolbarSettings();
            });
            self.spinnerUpdate.addListener("changeValue", function () {
                self.saveFooterToolbarSettings();
            });
            var nf = new qx.util.format.NumberFormat();
            nf.setMaximumFractionDigits(2);
            self.spinnerUpdate.setNumberFormat(nf);

            var totalContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                alignY: "middle"
            }));
            var totalAllContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignY: "middle"
            }));
            self.__totalContainer = totalContainer;
            self.totalContainer = totalContainer;
            self.__totalAllContainer = totalAllContainer;
            self.totalAllContainer = totalAllContainer;

            var labelTotalize = new qx.ui.basic.Label(self.tr("<b><font color='red'>Cálculos</font></b>")).set({
                rich: true
            });
            self.tipoCalculo = new qxnw.fields.selectBox();
            self.tipoCalculo.setTabIndex(qxnw.config.getActualTabIndex());
            self.tipoCalculo.setMaxHeight(25);
//            self.tipoCalculo.setMaxWidth(70);
            self.tipoCalculo.setMinWidth(90);
            self.tipoCalculo.setUserData("name", "typeCalc");
            var calcs = {};
            calcs["SUM"] = self.tr("Suma");
            calcs["SUM_BY_COL"] = self.tr("Suma con condicional");
            calcs["PROM"] = self.tr("Promedio");
            calcs["RECUENTO"] = self.tr("Recuento");
            qxnw.utils.populateSelectFromArray(self.tipoCalculo, calcs);
            self.tipoCalculo.addListener("changeSelection", function () {
                switch (this.getValue()["typeCalc"]) {
                    case "SUM":
                        if (self.totalValue != null) {
                            self.totalValue.setVisibility("excluded");
                        }
                        if (self.totalCompareValue != null) {
                            self.totalCompareValue.setVisibility("excluded");
                        }
                        if (self.totalCompareCol != null) {
                            self.totalCompareCol.setVisibility("excluded");
                        }
                        if (self.totalText != null) {
                            self.totalText.setVisibility("visible");
                        }
                        break;
                    case "SUM_BY_COL":
                        if (self.totalValue != null) {
                            self.totalValue.setVisibility("visible");
                        }
                        if (self.totalCompareValue != null) {
                            self.totalCompareValue.setVisibility("visible");
                        }
                        if (self.totalCompareCol != null) {
                            self.totalCompareCol.setVisibility("visible");
                        }
                        if (self.totalText != null) {
                            self.totalText.setVisibility("visible");
                        }
                        break;
                    case "PROM":
                        if (self.totalValue != null) {
                            self.totalValue.setVisibility("excluded");
                        }
                        if (self.totalCompareValue != null) {
                            self.totalCompareValue.setVisibility("excluded");
                        }
                        if (self.totalCompareCol != null) {
                            self.totalCompareCol.setVisibility("excluded");
                        }
                        if (self.totalText != null) {
                            self.totalText.setVisibility("visible");
                        }
                        break;
                    case "RECUENTO":
                        if (self.totalValue != null) {
                            self.totalValue.setVisibility("visible");
                        }
                        if (self.totalCompareValue != null) {
                            self.totalCompareValue.setVisibility("visible");
                        }
                        if (self.totalCompareCol != null) {
                            self.totalCompareCol.setVisibility("visible");
                        }
                        if (self.totalText != null) {
                            self.totalText.setVisibility("visible");
                        }
                        break;
                }
            });
            self.tipoCalculo.setToolTip(self.__toolTipsManager("type_calc"));
            self.tipoCalculo.setValue = function (value) {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getModel() == value) {
                        this.setSelection([items[i]]);
                    }
                }
                return true;
            };
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

            self.totalText = new qxnw.fields.selectBox();
            self.totalText.setTabIndex(qxnw.config.getActualTabIndex());
            self.totalText.setMaxHeight(25);
            self.totalText.setMinWidth(100);
            self.totalText.setToolTip(self.__toolTipsManager("totalColumn"));
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

            self.totalCompareValue = new qxnw.fields.selectBox();
            self.totalCompareValue.setTabIndex(qxnw.config.getActualTabIndex());
            self.totalCompareValue.setVisibility("excluded");
            self.totalCompareValue.setMaxHeight(25);
            self.totalCompareValue.setMaxWidth(40);
            self.totalCompareValue.setToolTip(self.__toolTipsManager("totalCompareColumn"));
            self.totalCompareValue.setValue = function (value) {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getModel() == value) {
                        this.setSelection([items[i]]);
                    }
                }
                return true;
            };
            self.totalCompareValue.getValue = function () {
                var data = {};
                if (!this.isSelectionEmpty()) {
                    var selectModel = this.getSelection()[0].getModel();
                    data["totalCompareValue"] = selectModel;
                } else {
                    return "";
                }
                return data;
            };
            calcs = {};
            calcs["="] = "=";
            calcs[">"] = ">";
            calcs["<"] = "<";
            qxnw.utils.populateSelectFromArray(self.totalCompareValue, calcs);

            self.totalCompareCol = new qxnw.fields.selectBox();
            self.totalCompareCol.setMaxHeight(25);
            self.totalCompareCol.setVisibility("excluded");
            self.totalCompareCol.setMinWidth(100);
            self.totalCompareCol.setToolTip(self.__toolTipsManager("totalCompareColumnSelect"));
            self.totalCompareCol.setValue = function (value) {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getModel() == value) {
                        this.setSelection([items[i]]);
                    }
                }
                return true;
            };
            self.totalCompareCol.getValue = function () {
                var data = {};
                if (!this.isSelectionEmpty()) {
                    var selectModel = this.getSelection()[0].getModel();
                    data["totalCompareCol"] = selectModel;
                } else {
                    return "";
                }
                return data;
            };

            self.totalValue = new qx.ui.form.TextField();
            self.totalValue.setTabIndex(qxnw.config.getActualTabIndex());
            self.totalValue.setVisibility("excluded");
            self.totalValue.setMaxHeight(25);
            self.totalValue.setMinWidth(50);
            self.totalValue.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    self.saveFooterToolbarSettings();
                    self.calculateByColumn();
                } else {
                    if (e.isPrintable() && this.getValue() != null && this.getValue().length > 5) {
                        this.resetMaxWidth();
                    }
                }
            });


            self.spinnerUpdate.setTabIndex(qxnw.config.getActualTabIndex());

            self.updateCheck = new qx.ui.form.CheckBox(self.tr("Actualizar"));

            self.updateCheck.setTabIndex(qxnw.config.getActualTabIndex());

            self.updateCheck.setToolTip(self.__toolTipsManager("update_on_enter"));
            self.updateCheck.addListener("execute", function (e) {
                self.saveFooterToolbarSettings();
            });
            self.favoritesCheck = new qx.ui.form.CheckBox(this.tr("Favoritos"));

            self.favoritesCheck.setTabIndex(qxnw.config.getActualTabIndex());

            self.favoritesCheck.setToolTip(self.__toolTipsManager("favorites"));
            self.favoritesCheck.setVisibility("excluded");

//            var colorButton = new qx.ui.form.Button();
//            colorButton.setTabIndex(qxnw.config.getActualTabIndex());
//            colorButton.setIcon(qxnw.config.execIcon("utilities-color-chooser", "apps"));
//            colorButton.setToolTip(self.__toolTipsManager("colors"));
//            colorButton.addListener("click", function (e) {
//                self.__showColors(e);
//            });

            totalContainer.add(labelTotalize, {
                flex: 0
            });
            totalContainer.add(totalAllContainer, {
                flex: 0
            });
            totalAllContainer.add(self.tipoCalculo, {
                flex: 0
            });
            totalAllContainer.add(self.totalText, {
                flex: 1
            });
            totalAllContainer.add(self.totalCompareCol, {
                flex: 1
            });
            totalAllContainer.add(self.totalCompareValue, {
                flex: 0
            });
            totalAllContainer.add(self.totalValue, {
                flex: 1
            });
            self.footerToolBar.add(totalContainer, {
                flex: 0
            });
//            self.footerToolBar.add(self.favoritesCheck, {
//                flex: 0
//            });
            self.footerToolBar.add(self.spinnerUpdate, {
                flex: 1
            });
            self.footerToolBar.add(self.updateCheck, {
                flex: 0
            });
//            self.footerToolBar.add(colorButton, {
//                flex: 0
//            });
            var toolTip = new qx.ui.tooltip.ToolTip(self.tr("Minimizar/maximizar opciones del listado"));
            self.__closeOrMinimize = new qx.ui.toolbar.Button(self.tr("Pie"), qxnw.config.execIcon("view-restore")).set({
                maxWidth: 20,
                maxHeight: 20,
                show: "icon",
                toolTip: toolTip
            });
            self.__closeOrMinimize.addListener("click", function (e) {
                var state = this.getUserData("stateAll");
                if (state === "minimized") {
                    self.footerToolBar.setVisibility("visible");
                    self.footerToolBar.add(this);
                    if (!self.haveMinimizedTools()) {
                        self.__leftOptionsContainer.setMaxWidth(0);
                    }
                    qxnw.utils.removeBorders(this);
                    this.setShow("icon");
                    this.setIcon(qxnw.config.execIcon("view-restore"));
                    this.setUserData("stateAll", "maximized");
                } else {
                    self.addToLeftOptions(this);
                    self.footerToolBar.setVisibility("excluded");
                    this.setIcon(qxnw.config.execIcon("view-fullscreen"));
                }
                self.saveFooterToolbarSettings();
            });

            self.__developerContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignY: "middle"
            }));

            self.__developerContainer.add(new qx.ui.core.Spacer(), {
                flex: 1
            });

            self.footerToolBar.add(self.__developerContainer, {
                flex: 1
            });

            if (self.up != null) {
                var index = qxnw.userPolicies.getDevelopers().indexOf(self.up.user);
                if (index != -1) {
                    self.addModuleNote(self.classname);
                }
            }

            self.footerToolBar.add(self.__closeOrMinimize, {
                flex: 0
            });

            self.containerFooterTools.add(self.footerToolBar, {
                flex: 1
            });
            var hLayout = new qx.ui.layout.VBox().set({
                alignX: "center",
                alignY: "middle"
            });
            self.__footerNotesBar = new qx.ui.container.Composite(hLayout);
            self.containerFooterTools.add(self.__footerNotesBar, {
                flex: 1
            });
        },
        /**
         * Save all the data in the toolbar
         * @returns {undefined}
         */
        saveFooterToolbarSettings: function saveFooterToolbarSettings() {
            var self = this;
            if (!self.getSaveFooterToolbarSettings()) {
                return;
            }
            var data = {};
            data["autoUpdate"] = self.updateCheck.getValue();
            data["secsToUpdate"] = self.spinnerUpdate.getValue();
//            data["orderBy"] = self.ui["order_by"].getValue();
            if (self.__isPopulated) {
                data["totalColumn"] = self.totalText.getValue();
                data["typeCalc"] = self.tipoCalculo.getValue();
                data["totalCompareCol"] = self.totalCompareCol.getValue();
                data["totalValue"] = self.totalValue.getValue();
                data["totalCompareValue"] = self.totalCompareValue.getValue();
            }
            var conf = self.__getStoredConfiguration();
            if (data["orderBy"] == "" && conf != null && typeof conf.orderBy != 'undefined' && conf.orderBy != '') {
                data["orderBy"] = conf.orderBy;
            }
            if (self.footerToolBar.getVisibility() == "visible") {
                data["minimize_footer_bar"] = false;
            } else {
                data["minimize_footer_bar"] = true;
            }
            if (self.containerTools.getVisibility() == "visible") {
                data["minimize_container_tools"] = false;
            } else {
                data["minimize_container_tools"] = true;
            }
            if (self.containerFilters.getVisibility() == "visible") {
                data["minimize_container_filters"] = false;
            } else {
                data["minimize_container_filters"] = true;
            }
            if (self.mantainFirstColumn.getValue() === true) {
                qxnw.local.storeData(self.getAppWidgetName() + "_metaColumnIndex", self.__metaColumn.getValue()["metaColumn"]);
            }
            self.__saveConfiguration(data);
            self.startTimer();
        }
        ,
        /**
         * Return the stored meta column
         * @returns {getStoredMetaColumnStatic.data}
         */
        getStoredMetaColumnStatic: function getStoredMetaColumnStatic() {
            var self = this;
            var rta = null;
            var data = qxnw.local.getData(self.getAppWidgetName() + "_metaColumn");
            if (data == null) {
                rta = null;
            } else {
                rta = data;
            }
            return rta;
        }
        ,
        addToolbarButton: function addToolbarButton(name, label, icon, afterOf, toolTip) {
            this.addToolBarButton(name, label, icon, afterOf, toolTip);
        },
        addToolBarButton: function addToolBarButton(name, label, icon, toolTip) {
            var self = this;
            if (self.toolBar) {
                if (self.part4) {
                    var button = new qx.ui.toolbar.Button(label, typeof icon != 'undefined' ? icon : qxnw.config.execIcon("dialog-apply"));
                    if (typeof toolTip != 'undefined') {
                        if (typeof toolTip == "string") {
                            var tT = new qx.ui.tooltip.ToolTip(toolTip);
                            button.setToolTip(tT);
                        } else {
                            if (typeof toolTip.classname != 'undefined' && toolTip.classname == "qx.locale.LocalizedString") {
                                var tT = new qx.ui.tooltip.ToolTip(toolTip);
                                button.setToolTip(tT);
                            } else {
                                button.setToolTip(toolTip);
                            }
                        }
                    }
                    self.part4.add(new qx.ui.toolbar.Separator());
                    self.part4.add(button);
                    self.ui[name] = button;
                    return self.ui[name];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        addToogleButton: function addToogleButton(name, label, icon, toolTip) {
            var self = this;
            if (self.toolBar) {
                if (self.part4) {
                    var button = new qx.ui.toolbar.Button(label, typeof icon != 'undefined' ? icon : qxnw.config.execIcon("dialog-apply"));
                    if (typeof toolTip != 'undefined') {
                        if (typeof toolTip == "string") {
                            var tT = new qx.ui.tooltip.ToolTip(toolTip);
                            button.setToolTip(tT);
                        } else {
                            if (typeof toolTip.classname != 'undefined' && toolTip.classname == "qx.locale.LocalizedString") {
                                var tT = new qx.ui.tooltip.ToolTip(toolTip);
                                button.setToolTip(tT);
                            } else {
                                button.setToolTip(toolTip);
                            }
                        }
                    }
                    self.part4.add(new qx.ui.toolbar.Separator());
                    self.part4.add(button);
                    self.ui[name] = button;
                    return self.ui[name];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        addCheckBox: function addCheckBox(name, label, icon, toolTip) {
            var self = this;
            if (self.toolBar) {
                if (self.part4) {
                    var button = new qx.ui.toolbar.CheckBox(label, typeof icon != 'undefined' ? icon : qxnw.config.execIcon("dialog-apply"));
                    if (typeof toolTip != 'undefined') {
                        if (typeof toolTip == "string") {
                            var tT = new qx.ui.tooltip.ToolTip(toolTip);
                            button.setToolTip(tT);
                        } else {
                            if (typeof toolTip.classname != 'undefined' && toolTip.classname == "qx.locale.LocalizedString") {
                                var tT = new qx.ui.tooltip.ToolTip(toolTip);
                                button.setToolTip(tT);
                            } else {
                                button.setToolTip(toolTip);
                            }
                        }
                    }
                    self.part4.add(new qx.ui.toolbar.Separator());
                    self.part4.add(button);
                    self.ui[name] = button;
                    return self.ui[name];
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        setImportTable: function setImportTable(table) {
            var self = this;
            self.ui.importButton.setVisibility("visible");
            self.ui.importButton.addListener("execute", function () {
                var f = new qxnw.nw_import_data.main();
                f.setTable(table);
                f.show();
                f.maximize();
            });
        },
        copyAllOnHtmlTable: function copyAllOnHtmlTable() {
            var html = this.getHtmlTable();
            window.prompt(this.tr("Texto a copiar: (Presiona nuevamente CTRL+C)"), html);
        },
        getToolMenu: function getToolMenu(menu) {
            var self = this;
            var m = menu.addMenu(self.tr("Herramientas"), 0, self, "categories/system.png");
            self.ui["printButton"] = menu.addMenuAction(self.tr("Imprimir"), "actions/document-print-preview.png", "printList", self);
            self.ui["emailButton"] = menu.addMenuAction(self.tr("Enviar registro por correo"), "actions/mail-message-new.png", "sendLineByEmail", self);
            self.ui["functionsButton"] = menu.addMenuAction(self.tr("Columnas nuevas con funciones de mes/año"), "qxnw/function.png", "startFunctionsManager", self);
            self.ui["colorsButton"] = menu.addMenuAction(self.tr("Colores en registros"), "apps/utilities-color-chooser.png", false, self);
            self.ui["colorsButton"].addListener("click", function (e) {
                self.__showColors(e);
            });
            self.ui["colorsButton"].setToolTip(self.__toolTipsManager("colors"));

            self.ui["copyAllButton"] = menu.addMenuAction(self.tr("Copiar listado en HTML (desarrolladores)"), "actions/edit-copy.png", "copyAllOnHtmlTable", self);
            self.ui["copyAllButton"].setVisibility("hidden");
            if (qxnw.userPolicies.isDeveloper(self.up.user)) {
                self.ui["copyAllButton"].setVisibility("visible");
            }
            self.ui["dynamicTableButton"] = menu.addMenuAction(self.tr("Informes dinámicos"), "apps/office-spreadsheet.png", "dynamicTable", self);
        },
        /**
         * Create the generic tool bar
         * @return {void}
         */
        __createToolBar: function __createToolBar() {
            var self = this;

//            var menu = new qx.ui.menu.Menu();
//            var popup = new qx.ui.popup.Popup(new qx.ui.layout.HBox());

            var separators = {};
            self.toolBar = new qx.ui.toolbar.ToolBar(new qx.ui.layout.HBox());
            self.toolBar.setSpacing(1);
            var part1 = new qx.ui.toolbar.Part();
            self.ui["part1"] = part1;
            var updateButton = new qx.ui.toolbar.Button(self.tr("Actualizar"), qxnw.config.execIcon("view-refresh", "actions", 16)).set({
                show: "icon"
            });

            var hideButtons = qxnw.config.getHideButtonsText();
            updateButton.setToolTip(self.__toolTipsManager("update"));
            part1.add(updateButton);
            self.ui["updateButton"] = updateButton;

//            var applyCommand = new qx.ui.core.Command("Ctrl+A");
//            self.ui["updateButton"].setCommand(applyCommand);

//            if (typeof self.applyFilters == "function") {
//                self.ui["updateButton"].addListener("execute", function(e) {
//                    self.fireEvent("applyFilters", e);
//                    self.ui["updateButton"].setEnabled(false);
//                    self.applyFilters();
//                    var interval = setInterval(function() {
//                        clearInterval(interval);
            //                        if (!self.ui.updateButton.isEnabled()) { //                            self.ui.updateButton.setEnabled(true);
            //                        }
//                    }, 15000);
//                });
//            }

            self.toolBar.add(part1);
            var part2 = new qx.ui.toolbar.Part();
            self.ui["part2"] = part2;
            if (this.__mainForm) {
                var newButton = new qx.ui.toolbar.Button(self.tr("Nuevo"), qxnw.config.execIcon("document-new"));
                newButton.setToolTip(self.__toolTipsManager("new"));
                var command_new = new qx.ui.command.Command('Control+Alt+N');
                command_new.addListener("execute", function () {
                    try {
                        self.slotNuevo();
                    } catch (e) {

                    }
                });
                var editButton = new qx.ui.toolbar.Button(self.tr("Editar"), qxnw.config.execIcon("document-properties.png"));
                editButton.setToolTip(self.__toolTipsManager("edit"));
                var command_edit = new qx.ui.command.Command('Control+Alt+E');
                command_edit.addListener("execute", function () {
                    try {
                        self.slotEditar();
                    } catch (e) {

                    }
                });
                var deleteButton = new qx.ui.toolbar.Button(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete.png"));
//                deleteButton.setFocusable(true);
                deleteButton.setToolTip(self.__toolTipsManager("delete"));
                part2.add(newButton);
                separators["newButton"] = new qx.ui.toolbar.Separator();
                part2.add(separators["newButton"]);
                part2.add(editButton);
                separators["editButton"] = new qx.ui.toolbar.Separator();
                part2.add(separators["editButton"]);
                part2.add(deleteButton);
                self.ui["newButton"] = newButton;
                self.ui["newButton"].addListener("changeVisibility", function (e) {
                    var d = e.getData();
                    separators["newButton"].setVisibility(d);
                });
                self.ui["editButton"] = editButton;
                self.ui["editButton"].addListener("changeVisibility", function (e) {
                    var d = e.getData();
                    separators["editButton"].setVisibility(d);
                });
                self.ui["deleteButton"] = deleteButton;
                self.toolBar.add(part2);
            }

            var part3 = new qx.ui.toolbar.Part();
            self.ui["part3"] = part3;
            self.selectAllButton = new qx.ui.toolbar.Button(self.tr("Seleccionar todo"), qxnw.config.execIcon("edit-redo"));
            self.selectAllButton.setToolTip(self.__toolTipsManager("selectAll"));
            if (!self.__multiCell) {
                self.selectAllButton.set({
                    enabled: false
                });
            }
            var unSelectButton = new qx.ui.toolbar.Button(self.tr("Desactivar todo"), qxnw.config.execIcon("edit-undo"));
            unSelectButton.setToolTip(self.__toolTipsManager("unSelectAll"));
            part3.add(self.selectAllButton);
            separators["selectAllButton"] = new qx.ui.toolbar.Separator();
            part3.add(separators["selectAllButton"]);
            part3.add(unSelectButton);
            self.ui["selectAllButton"] = self.selectAllButton;
            self.ui["selectAllButton"].addListener("changeVisibility", function (e) {
                var d = e.getData();
                separators["selectAllButton"].setVisibility(d);
            });
            self.ui["unSelectButton"] = unSelectButton;
            self.ui["unSelectButton"].addListener("changeVisibility", function (e) {
                var d = e.getData();
                separators["selectAllButton"].setVisibility(d);
            });
            self.toolBar.add(part3);
            /*TODO: es necesario verificar si se pone el botón de actualización automática*/
            var part4 = new qx.ui.toolbar.Part();
            self.ui["part4"] = part4;
            var exportButton = new qx.ui.toolbar.Button(self.tr("Exportar"), qxnw.config.execIcon("document-save"));
            exportButton.setToolTip(self.__toolTipsManager("exportAll"));
            exportButton.addListener("click", function () {
                self.exportData();
            });
//            var excelButton = new qx.ui.toolbar.Button("", qxnw.config.execIcon("excel", "qxnw"));
//            excelButton.setShow("icon");
//            excelButton.setToolTip(self.__toolTipsManager("excel"));
//            excelButton.addListener("click", function () {
//                self.exportToExcel();
//            });

            var importButton = new qx.ui.toolbar.Button(self.tr("Importar"), qxnw.config.execIcon("list-add"));
            importButton.setToolTip(self.__toolTipsManager("import"));
            self.__importIdListener = importButton.addListener("execute", function () {
                if (self.tableAuto != null) {
                    var f = new qxnw.nw_import_data.main();
                    f.setTable(self.tableAuto);
                    f.show();
                    f.maximize();
                }
            });
            importButton.setVisibility("excluded");
//            var printButton = new qx.ui.menu.Button(self.tr("Imprimir"), qxnw.config.execIcon("document-print-preview"));
            //printButton.setShow("icon");
//            printButton.setToolTip(self.__toolTipsManager("printAll"));
//            self.__printIdListener = printButton.addListener("execute", function () {
            //self.getWidget().print();
            //this.print();
//                self.printList();
//            });
//            var emailButton = new qx.ui.menu.Button(self.tr("Enviar por correo"), qxnw.config.execIcon("mail-message-new"));
//            emailButton.setToolTip(self.__toolTipsManager("sendEmail"));
//            emailButton.addListener("click", function () {
//                self.sendLineByEmail();
//            });
            var cleanFiltersButton = new qx.ui.toolbar.Button(self.tr("Limpiar filtros"), qxnw.config.execIcon("edit-redo"));
            cleanFiltersButton.setToolTip(self.__toolTipsManager("cleanFilters"));
            cleanFiltersButton.addListener("click", function () {
                self.table.cleanFiltersOnList();
            });
            self.__cleanFiltersButton = cleanFiltersButton;
            //cleanFiltersButton.setVisibility("excluded");
//            var index = qxnw.userPolicies.getDevelopers().indexOf(self.up.user);
//            if (index != -1) {
//                cleanFiltersButton.setVisibility("visible");
//            }

//            var dynamicTableButton = new qx.ui.toolbar.Button(self.tr("Informes"), qxnw.config.execIcon("office-spreadsheet", "apps"));
//            dynamicTableButton.setToolTip(self.__toolTipsManager("dynamicTable"));
//            dynamicTableButton.addListener("click", function () {
//                self.dynamicTable();
//            });
//            dynamicTableButton.setEnabled(true);

//            var functionsButton = new qx.ui.menu.Button(self.tr("Funciones"), qxnw.config.execIcon("function", "qxnw"));
//            functionsButton.setShow("icon");
//            functionsButton.setToolTip(self.__toolTipsManager("functions"));
//            functionsButton.addListener("click", function () {
//                self.startFunctionsManager();
//            });

            var autoWidthButton = new qx.ui.toolbar.Button(self.tr("Ancho automático de columnas"), qxnw.config.execIcon("format-justify-fill"));
            autoWidthButton.setShow("icon");
            qxnw.utils.addBorder(autoWidthButton, "green", 1);
            autoWidthButton.setToolTip(self.__toolTipsManager("autoWidth"));
            autoWidthButton.addListener("click", function () {
                self.setAutoWidth();
            });
            self.__autoWidthButton = autoWidthButton;

//            var copyAllButton = new qx.ui.toolbar.Button(self.tr("Copiar todo"), qxnw.config.execIcon("edit-copy"));
//            copyAllButton.setShow("icon");
//            copyAllButton.setToolTip(self.__toolTipsManager("copy_all"));
//            copyAllButton.addListener("click", function () {
//                self.copyAllOnHtmlTable();
//            });
            //cmiButton.setEnabled(false);

            var minimizeOptionsButton = new qx.ui.toolbar.Button(self.tr("Herramientas"), qxnw.config.execIcon("view-restore")).set({
                maxWidth: 20,
                maxHeight: 20,
                show: "icon"
            });
            minimizeOptionsButton.setToolTip(self.__toolTipsManager("minimizeOptions"));

            minimizeOptionsButton.addListener("click", function () {
                var state = this.getUserData("stateAll");
                if (state === "minimized") {
                    self.containerTools.setVisibility("visible");
                    part4.add(this);
                    if (!self.haveMinimizedTools()) {
                        self.__leftOptionsContainer.setMaxWidth(0);
                    }
                    qxnw.utils.removeBorders(this);
                    this.setShow("icon");
                    this.setIcon(qxnw.config.execIcon("view-restore"));
                    this.setUserData("stateAll", "maximized");
                } else {
                    self.addToLeftOptions(this);
                    self.containerTools.setVisibility("excluded");
                    this.setIcon(qxnw.config.execIcon("view-fullscreen"));
                }
                self.saveFooterToolbarSettings();
            });

//            toolsButton.setToolTip(self.__toolTipsManager("minimizeOptions"));
//            toolsButton.addListener("click", function (e) {
//                menu.placeToWidget(this);
//                menu.show();
//                popup.placeToPointer(e);
//                popup.placeToWidget(this);
//                popup.show();
//            });

            self.ui["autoUpdateButton"] = updateButton;
            self.ui["exportButton"] = exportButton;
//            self.ui["emailButton"] = emailButton;
            self.ui["importButton"] = importButton;
            self.ui["cleanFiltersButton"] = cleanFiltersButton;
            self.ui["minimizeOptionsButton"] = minimizeOptionsButton;
//            self.ui["dynamicTableButton"] = dynamicTableButton;

//            self.ui["functionsButton"] = functionsButton;
//            self.ui["copyAllButton"] = copyAllButton;
            self.ui["autoWidthButton"] = autoWidthButton;
            //self.ui["excelButton"] = excelButton;
            part4.add(exportButton);

            self.part4 = part4;

            separators["exportButton"] = new qx.ui.toolbar.Separator();
            part4.add(separators["exportButton"]);

//            self.ui["exportButton"].addListener("changeVisibility", function (e) {
//                var d = e.getData();
//                separators["exportButton"].setVisibility(d);
//            });
            self.ui["importButton"].addListener("changeVisibility", function (e) {
                var d = e.getData();
                separators["exportButton"].setVisibility(d);
            });

            //part4.add(excelButton);
            //part4.add(new qx.ui.toolbar.Separator());
            part4.add(importButton);

            self.__separImp = new qx.ui.toolbar.Separator();
            part4.add(self.__separImp);
            self.__separImp.setVisibility("excluded");


//            separators["printButton"] = new qx.ui.toolbar.Separator();

//            part4.add(separators["printButton"]);

//            self.ui["printButton"].addListener("changeVisibility", function (e) {
//                var d = e.getData();
//                separators["printButton"].setVisibility(d);
//            });

//            popup.add(emailButton);

//            separators["emailButton"] = new qx.ui.toolbar.Separator();

//            part4.add(separators["emailButton"]);

//            self.ui["emailButton"].addListener("changeVisibility", function (e) {
//                var d = e.getData();
//                separators["emailButton"].setVisibility(d);
//            });

            part4.add(cleanFiltersButton);

            separators["cleanFiltersButton"] = new qx.ui.toolbar.Separator();

            self.ui["cleanFiltersButton"].addListener("changeVisibility", function (e) {
                var d = e.getData();
                separators["cleanFiltersButton"].setVisibility(d);
            });

            part4.add(separators["cleanFiltersButton"]);

//            popup.add(functionsButton);

            part4.add(autoWidthButton);

            part4.add(minimizeOptionsButton);
            self.toolBar.add(part4);

            self.toolBar.addSpacer();

            var part5 = new qx.ui.toolbar.Part();
//            self.__toolsButton = new qx.ui.form.Button();
//            self.__toolsButton.setIcon(qxnw.config.execIcon("office-project", "apps"));
//            self.__toolsButton.setToolTip(self.__toolTipsManager("tools"));
//            self.ui["toolsButton"] = self.__toolsButton;
//            part5.add(self.__toolsButton);
//            self.__toolsButton.addListener("execute", function () {
//                if (self.__toolParent != null) {
//                    if (!self.__toolParent.isVisible()) {
//                        self.__toolParent.show();
//                        if (!self.__isPopulated) {
//                            self.populateTotalColumns();
//                        }
//                    }
//                }
//            });
//            self.__toolsButton.setVisibility("excluded");


            var helpButton = new qx.ui.form.Button();
            helpButton.setIcon(qxnw.config.execIcon("help-contents"));
            helpButton.setToolTip(self.__toolTipsManager("help"));
            self.ui["helpButton"] = helpButton;
            part5.add(helpButton);
            helpButton.addListener("execute", function () {
                qxnw.main.slotBtnTicketsNw();
            });

//            if (typeof dynamicTableButton != 'undefined') {
//                part5.add(dynamicTableButton);
//
//                self.ui["dynamicTableButton"].addListener("changeVisibility", function (e) {
//                    var d = e.getData();
//                    separators["cleanFiltersButton"].setVisibility(d);
//                });
//            }

            var configContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            var menu = new qxnw.menu(configContainer);
            self.getToolMenu(menu);
            menu.exec(true, configContainer);

            part5.add(configContainer, {
                flex: 1
            });

            self.toolBar.add(part5);
            self.containerTools.add(self.toolBar, {
                flex: 1
            });
            if (hideButtons) {
                updateButton.setShow("icon");
                newButton.setShow("icon");
                editButton.setShow("icon");
                deleteButton.setShow("icon");
                self.selectAllButton.setShow("icon");
                unSelectButton.setShow("icon");
                exportButton.setShow("icon");
                //importButton.setShow("icon");
                cleanFiltersButton.setShow("icon");
            }
        },
        exportToExcel: function exportToExcel() {
            var self = this;
            var html = self.getHtmlTable();
            var func = function (id) {
                var f = new qxnw.forms();
                f.setModal(true);
                f.setTitle(self.tr("Exportación directa a NWCalculate"));
                f.setWidth(800);
                f.setHeight(600);
                f.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/modulos/nwexcel/file.php?id_qxnwlist=" + id);
                f.show();
            };
            qxnw.utils.fastAsyncCallRpc("excelReport", "saveHtmlToExportToExcel", html, func);
        }
        ,
        getFunctionsDisp: function getFunctionsDisp() {
            var da = [];
            var d = {};
            d["nombre"] = "SUMAR";
            d["value"] = "SUMAR";
            da.push(d);
            return da;
        },
        setFunctionResult: function setFunctionResult(result, formule) {
            var self = this;
            self.functionsForm.ui.resultado.setValue(result.toString());
            if (typeof formule == 'undefined') {
                self.functionsForm.ui.formula.setValue(result.toString());
            } else {
                self.functionsForm.ui.formula.setValue(formule.toString());
            }
        },
        processFunctions: function processFunctions(functionType, colFuncName, columns, rows, addColumn, haveSeparator) {
            var self = this;
            var result = 0;
            var formule = "";
            var rowCount = 0;
            switch (functionType) {
                case "SUMAR":
                    if (colFuncName == "") {
                        colFuncName = "FUNC SUMAR " + self.__functionsCount;
                    }
                    var val = 0;
                    formule += "SUMAR(";
                    var formuleArr = [];
                    if (typeof addColumn != 'undefined' && addColumn === true) {
                        for (var i = 0; i < rows.length; i++) {
                            result = 0;
                            for (var colName in columns) {
                                val = parseInt(rows[i][columns[colName]["columna"]]);
                                result = result + val;
                                formuleArr.push(columns[colName]["columna"]);
                            }
                            for (var r in rows[i]) {
                                rows[i][colFuncName] = result;
                            }
                        }
                    } else {
                        for (var i = 0; i <= rowCount; i++) {
                            for (var colName in columns) {
                                val = parseInt(rows[i][columns[colName]["columna"]]);
                                result = result + val;
                                formuleArr.push(columns[colName]["columna"]);
                            }
                        }
                    }
                    formule += formuleArr.join(";");
                    formule += ")";
                    break;
                case "RESTAR":
                    if (colFuncName == "") {
                        colFuncName = "FUNC RESTAR " + self.__functionsCount;
                    }
                    var val = 0;
                    formule += "RESTAR(";
                    var formuleArr = [];
                    if (typeof addColumn != 'undefined' && addColumn === true) {
                        for (var i = 0; i < rows.length; i++) {
                            result = 0;
                            for (var colName in columns) {
                                val = parseInt(rows[i][columns[colName]["columna"]]);
                                result = val - result;
                                formuleArr.push(columns[colName]["columna"]);
                            }
                            for (var r in rows[i]) {
                                rows[i][colFuncName] = result;
                            }
                        }
                    } else {
                        for (var i = 0; i <= rowCount; i++) {
                            for (var colName in columns) {
                                val = parseInt(rows[i][columns[colName]["columna"]]);
                                result = val - result;
                                formuleArr.push(columns[colName]["columna"]);
                            }
                        }
                    }
                    formule += formuleArr.join(";");
                    formule += ")";
                    break;
                case "MULTIPLICAR":
                    if (colFuncName == "") {
                        colFuncName = "FUNC MULTIPLICAR " + self.__functionsCount;
                    }
                    var val = 0;
                    formule += "MULTIPLICAR(";
                    var formuleArr = [];
                    if (typeof addColumn != 'undefined' && addColumn === true) {
                        for (var i = 0; i < rows.length; i++) {
                            result = 1;
                            for (var colName in columns) {
                                val = parseInt(rows[i][columns[colName]["columna"]]);
                                result = (val * result);
                                formuleArr.push(columns[colName]["columna"]);
                            }
                            for (var r in rows[i]) {
                                rows[i][colFuncName] = result;
                            }
                        }
                    } else {
                        result = 1;
                        for (var i = 0; i <= rowCount; i++) {
                            for (var colName in columns) {
                                val = parseInt(rows[i][columns[colName]["columna"]]);
                                result = (val * result);
                                formuleArr.push(columns[colName]["columna"]);
                            }
                        }
                    }
                    formule += formuleArr.join(";");
                    formule += ")";
                    break;
                case "EXTRAER_MES":
                    if (colFuncName == "") {
                        colFuncName = "FUNC EXTRAER_MES " + self.__functionsCount;
                    }
                    var val = 0;
                    formule += "EXTRAER_MES(";
                    var formuleArr = [];
                    if (typeof addColumn != 'undefined' && addColumn === true) {
                        for (var i = 0; i < rows.length; i++) {
                            result = 1;
                            for (var colName in columns) {
                                val = qxnw.utils.convertDate(rows[i][columns[colName]["columna"]]);
                                var testIsValid = val.getTime();
                                if (isNaN(testIsValid) === true) {
                                    result = "";
                                    formuleArr.push(columns[colName]["columna"]);
                                    continue;
                                }
                                var n = val.getMonth();
//                                n = n - 1;
                                var month = qxnw.utils.getMonthNameByIndex(n);
                                result = month;
                                formuleArr.push(columns[colName]["columna"]);
                            }
                            for (var r in rows[i]) {
                                rows[i][colFuncName] = result;
                            }
                        }
                    } else {
                        result = 1;
                        for (var i = 0; i <= rowCount; i++) {
                            for (var colName in columns) {
                                val = qxnw.utils.convertDate(rows[i][columns[colName]["columna"]]);
                                var n = val.getMonth();
                                n = n - 1;
                                var month = qxnw.utils.getMonthNameByIndex(n);
                                result = month;
                                formuleArr.push(columns[colName]["columna"]);
                            }
                        }
                    }
                    formule += formuleArr.join(";");
                    formule += ")";
                    break;
                case "EXTRAER_AÑO":
                    if (colFuncName == "") {
                        colFuncName = "FUNC EXTRAER_AÑO " + self.__functionsCount;
                    }
                    var val = 0;
                    formule += "EXTRAER_AÑO(";
                    var formuleArr = [];
                    if (typeof addColumn != 'undefined' && addColumn === true) {
                        for (var i = 0; i < rows.length; i++) {
                            result = 1;
                            for (var colName in columns) {
                                val = qxnw.utils.convertDate(rows[i][columns[colName]["columna"]]);
                                var year = val.getFullYear();
                                result = year;
                                formuleArr.push(columns[colName]["columna"]);
                            }
                            for (var r in rows[i]) {
                                rows[i][colFuncName] = result.toString();
                            }
                        }
                    } else {
                        result = 1;
                        for (var i = 0; i <= rowCount; i++) {
                            for (var colName in columns) {
                                val = qxnw.utils.convertDate(rows[i][columns[colName]["columna"]]);
                                var year = val.getFullYear();
                                result = year;
                                formuleArr.push(columns[colName]["columna"]);
                            }
                        }
                    }
                    formule += formuleArr.join(";");
                    formule += ")";
                    break;
                case "CONCATENAR":
                    if (colFuncName == "") {
                        colFuncName = "FUNC CONC " + self.__functionsCount;
                    }
                    var val = 0;
                    formule += "CONCATENAR(";
                    var formuleArr = [];
                    result = "";
                    if (typeof self.functionsForm != 'undefined' && self.functionsForm != null) {
                        if (self.functionsForm.ui != null) {
                            if (self.functionsForm.ui.separador != null) {
                                var separator = self.functionsForm.ui.separador.getValue();
                            }
                        }
                    }
                    if (haveSeparator && haveSeparator != "" && haveSeparator != null) {
                        separator = haveSeparator;
                    }
                    if (separator == null) {
                        separator = "";
                    }
                    if (typeof addColumn != 'undefined' && addColumn === true) {
                        for (var i = 0; i < rows.length; i++) {
                            result = "";
                            for (var colName in columns) {
                                val = rows[i][columns[colName]["columna"]];
                                if (result == "") {
                                    result = result.toString() + "" + val.toString();
                                } else {
                                    result = result.toString() + separator + val.toString();
                                }
                                formuleArr.push(columns[colName]["columna"]);
                            }
                            for (var r in rows[i]) {
                                rows[i][colFuncName] = result;
                            }
                        }
                    } else {
                        for (var i = 0; i <= rowCount; i++) {
                            var counter = 0;
                            for (var colName in columns) {
                                val = rows[i][columns[colName]["columna"]];
                                if (result == "") {
                                    result = result.toString() + "" + val.toString();
                                } else {
                                    result = result.toString() + separator + val.toString();
                                }
                                formuleArr.push(columns[colName]["columna"]);
                                counter++;
                            }
                        }
                    }
                    formule += formuleArr.join(";");
                    formule += ")";
                    break;
            }
            var d = {
                rows: rows,
                formule: formule,
                result: result,
                column_name: colFuncName,
                separator: typeof separator != 'undefined' ? separator : null
            };
            return d;
        }
        ,
        calculateFunction: function calculateFunction(addColumn) {
            var self = this;
            if (self.functionsForm.ui.guardar.getValue() === true && addColumn === true) {
                if (self.checkColumnNameFunctionExists(self.functionsForm.ui.nombre_columna.getValue()) === true) {
                    qxnw.utils.information(self.tr("El nombre de la columna ya existe en otras funciones pre-existentes"));
                    return false;
                }
            }
            var columns = self.functionsNavTable.getAllData();
            if (columns.length == 0) {
                return;
            }
            var d = {};
            var functionType = self.functionsForm.ui.funciones.getValue();
            if (functionType == "") {
                qxnw.utils.information(self.tr("Seleccione una función"));
                return;
            }
            d["type"] = functionType.funciones_text;
            var rows = self.getAllRecords();
            if (rows.length == 0) {
                var msg = self.tr("No hay filas para realizar la función");
                qxnw.utils.information(msg);
                self.setFunctionResult(msg);
                return;
            }
            if (typeof addColumn != 'undefined' && addColumn === true) {
                self.__functionsCount++;
                d["function_num"] = self.__functionsCount;
            }
            var colFuncName = self.functionsForm.ui.nombre_columna.getValue();

            var rta = self.processFunctions(functionType.funciones, colFuncName, columns, rows, addColumn);

            d["column_name"] = rta["column_name"];
            d["columns"] = columns;

            if (typeof rta["separator"] != 'undefined' && rta["separator"] != null) {
                d["separator"] = rta["separator"];
            }

            //PREPARE LIST TO ADD COLUMN
            if (addColumn === true) {
                var newModel = rta["rows"];
                var newColumn = {
                    caption: rta["column_name"],
                    label: rta["column_name"]
                };
                var cols = self.allColumnsData.slice();

                for (var ia = 0; ia < cols.length; ia++) {
                    var ra = cols[ia];
                    ra.label = qxnw.utils.replaceAll(ra.label, "<b style='color:red'>*</b>", "");
                }

                cols.push(newColumn);
                self.setColumns(cols);
                //self.setModelData(newModel, true);
                self.model.setData(self.objectToArrayOnColumns(newModel));
                self.table.changeFilterRows();
            }
            // END

            self.setFunctionResult(rta["result"], rta["formule"]);

            if (self.functionsForm.ui.guardar.getValue() === true && addColumn === true) {
                self.saveFunctions(d);
            }

            var timer = new qx.event.Timer(500);
            timer.start();
            timer.addListener("interval", function (e) {
                this.stop();
                self.populateColumnColors();
            });

            return true;
        }
        ,
        saveFunctions: function saveFunctions(data) {
            var self = this;
            var toSave = [];
            var saved = qxnw.local.getData(self.getAppWidgetName() + "_functions");
            if (saved == null) {
                toSave.push(data);
            } else {
                toSave = saved;
                toSave.push(data);
            }
            qxnw.local.storeData(self.getAppWidgetName() + "_functions", toSave);
        }
        ,
        deleteSavedFunctions: function deleteSavedFunctions(data) {
            var self = this;
            var saved = qxnw.local.getData(self.getAppWidgetName() + "_functions");
            if (saved == null) {
                return;
            } else {
                for (var i = 0; i < saved.length; i++) {
                    if (data.column_name == saved[i].column_name) {
                        saved.splice(i);
                        break;
                    }
                }
            }
            qxnw.local.storeData(self.getAppWidgetName() + "_functions", saved);
        }
        ,
        checkColumnNameFunctionExists: function checkColumnNameFunctionExists(name) {
            var self = this;
            var savedFunctions = qxnw.local.getData(self.getAppWidgetName() + "_functions");
            if (savedFunctions != null) {
                for (var i = 0; i < savedFunctions.length; i++) {
                    var r = savedFunctions[i];
                    if (name == r["column_name"]) {
                        return true;
                    }
                }
            }
            return false;
        }
        ,
        startFunctionsManager: function startFunctionsManager() {
            var self = this;
            self.functionsForm = new qxnw.forms();
            var lbl = self.functionsForm.addFooterNote("Recuerde que este widget es una muestra y se encuentra en estado de pruebas. Agradecemos sus comentarios para mejorar esta herramienta haciendo clic <b>aquí</b>");
            lbl.addListener("click", function () {
                main.showPQR(false);
            });
            self.functionsForm.setTitle(self.tr("Funciones dinámicas"));
            var fields = [
                {
                    name: "funciones",
                    label: self.tr("Funciones disponibles"),
                    type: "selectBox",
                    required: true
                },
                {
                    name: "formula",
                    label: self.tr("Fórmula"),
                    type: "textField",
                    enabled: false
                },
                {
                    name: "resultado",
                    label: self.tr("Resultado fila 1"),
                    type: "textField",
                    enabled: false
                },
                {
                    name: "nombre_columna",
                    label: self.tr("Nombre columna"),
                    type: "textField",
                    required: true
                },
                {
                    name: "guardar",
                    label: self.tr("Guardar en el navegador"),
                    type: "checkBox"
                },
                {
                    name: "separador",
                    label: self.tr("Separador"),
                    type: "textField"
                }
            ];
            self.functionsForm.setFields(fields);
            self.functionsForm.ui.guardar.setValue(true);
            self.setFieldVisibility(self.functionsForm.ui.separador, "excluded");
            var arr = {};
            arr[""] = self.tr("Seleccione...");
            arr["EXTRAER_MES"] = "EXTRAER_MES";
            arr["EXTRAER_AÑO"] = "EXTRAER_AÑO";
            arr["SUMAR"] = "SUMAR";
            arr["RESTAR"] = "RESTAR";
            arr["MULTIPLICAR"] = "MULTIPLICAR";
            arr["CONCATENAR"] = "CONCATENAR";
            qxnw.utils.populateSelectFromArray(self.functionsForm.ui.funciones, arr);
            self.functionsForm.ui.separador.addListener("input", function () {
                self.calculateFunction();
            });
            self.functionsForm.ui.funciones.addListener("changeSelection", function () {
                if (self.functionsForm.ui.funciones.getValue().funciones_text === "CONCATENAR") {
                    self.setFieldVisibility(self.functionsForm.ui.separador, "visible");
                } else {
                    self.setFieldVisibility(self.functionsForm.ui.separador, "excluded");
                }
                self.calculateFunction();
            });
            var columns = [
                {
                    label: self.tr("Columna"),
                    caption: "columna"
                }
            ];
            self.functionsNavTable = self.functionsForm.createAutoNavTable("functionsNavTable", columns, self.tr("Columnas"), self.tr("Agregue las columnas para el cálculo"));
            self.functionsNavTable.ui.addButton.addListener("click", function () {
                var fieldsColumns = [
                    {
                        name: "columna",
                        type: "selectListCheck",
                        label: self.tr("Seleccione la columna"),
                        required: true
                    }
                ];
                var da = qxnw.utils.dialog(fieldsColumns, self.tr("Seleccione las columnas para el cálculo"), true);
                da.ui.columna.populateFromArray(self.__visibleColumns);
                da.settings.accept = function () {
                    var ra = da.getRecord();
                    var data = [];
                    for (var i = 0; i < ra.columna.length; i++) {
                        var re = {};
                        re["columna"] = ra.columna[i].name;
                        data.push(re);
                    }
                    self.functionsNavTable.addRows(data);
                    self.calculateFunction();
                };
            });
            self.functionsNavTable.ui.removeButton.addListener("click", function () {
                self.functionsNavTable.removeSelectedRow();
                self.calculateFunction();
            });
            self.functionsForm.ui.cancel.addListener("click", function () {
                self.functionsForm.close();
                self.functionsForm = null;
            });
            self.functionsForm.ui.accept.addListener("click", function () {
                if (!self.functionsForm.validate()) {
                    return;
                }
                if (self.calculateFunction(true)) {
                    self.functionsForm.close();
                }
            });
            var columns1 = [
                {
                    label: self.tr("Función"),
                    caption: "type"
                },
                {
                    label: self.tr("Nombre columna"),
                    caption: "column_name"
                },
                {
                    label: self.tr("Columnas"),
                    caption: "columns"
                }
            ];
            self.functionsSavedNavTable = self.functionsForm.createAutoNavTable("functionsSavedNavTable", columns1, self.tr("Funciones guardadas"), self.tr("Vea las funciones guardadas"));
            var populateSavedNavTable = function () {
                var savedFunctions = qxnw.local.getData(self.getAppWidgetName() + "_functions");
                if (savedFunctions != null) {
                    for (var i = 0; i < savedFunctions.length; i++) {
                        var r = savedFunctions[i];
                        var v = "";
                        var counter = 0;
                        var cm = ",";
                        for (var va in r["columns"]) {
                            if (counter == 0) {
                                v += r["columns"][va]["columna"];
                            } else {
                                v += cm + r["columns"][va]["columna"];
                            }
                            counter++;
                        }
                        r["columns"] = v;
                    }
                    self.functionsSavedNavTable.setModelData(savedFunctions);
                }
            };
            self.functionsSavedNavTable.ui.addButton.setVisibility("excluded");
            self.functionsSavedNavTable.ui.removeButton.addListener("execute", function () {
                var rec = self.functionsSavedNavTable.getSelectedRecord();
                if (rec == null) {
                    qxnw.utils.information(self.tr("Seleccione un registro"));
                    return;
                }
                self.deleteSavedFunctions(rec);
                populateSavedNavTable();
                self.tryToGetSavedFunctions();
            });
            populateSavedNavTable();
            self.functionsForm.show();
        },
        dynamicTable: function dynamicTable(isMaximized) {
            var self = this;
            qxnw.utils.loading(self.tr("Cargando informe..."));
            var t = new qx.event.Timer(100);
            t.start();

            t.addListener("interval", function (e) {
                t.stop();
                qxnw.utils.stopLoading();
                if (typeof isMaximized == 'undefined') {
                    isMaximized = false;
                }
                if (self.getAllRecords().length == 0) {
                    qxnw.utils.information(self.tr("No hay registros para generar la tabla dinámica. Intente modificar los filtros y consulte de nuevo."));
                    return;
                }
                var filtersTransfer = null;
                if (typeof self.desktop != 'undefined' && self.desktop != null) {
                    filtersTransfer = true;
                }
                if (self.dt != null) {
                    self.dt.destroy();
                }

                self.dt = new qxnw.dynamicTable.initAlterV3(self, filtersTransfer);
                self.dt.setModal(true);
                if (typeof self.desktop != 'undefined' && self.desktop != null) {
                    //self.dt.getFooterBar().setVisibility("excluded");
                    self.dt.transferFilters();
                    self.dt.getChildControl("captionbar").setVisibility("excluded");
                    self.dt.ui.cancel.setVisibility("excluded");
                    self.dt.addButtons([{name: "ver_data_button", icon: qxnw.config.execIcon("view-restore"), label: self.tr("Ver data")}]);
                    self.dt.ui["ver_data_button"].addListener("execute", function () {
                        self.dt.hide();
                        var maximizeButton = new qx.ui.form.Button(self.tr("Maximizar gráficos"), qxnw.config.execIcon("view-restore"));
                        maximizeButton.set({
                            cursor: "pointer"
                        });
                        maximizeButton.setMinWidth(130);
                        maximizeButton.setAppearance("label");
                        qxnw.utils.addBorder(maximizeButton, "black", 1);
                        maximizeButton.addListener("execute", function () {
                            self.dt.show();
                            this.destroy();
                        });
                        self.dynamicFiltersWidget.add(maximizeButton);
                    });
                    self.desktop.add(self.dt);
                }
                self.dt.show();
                if (isMaximized == true) {
                    self.dt.maximize();
                }
                return;

                self.dt.filtersChartContainer.setVisibility("excluded");
                self.dt.closeChartButton.setVisibility("visible");
                self.dt.closeChartButton.addListener("execute", function () {
                    self.chartsContainer.removeAll();
                    self.chartsContainer.setVisibility("excluded");
                    self.chartsContainer.setHeight(0);
                    self.table.resetMinHeight();
                });
                self.chartsContainer.setHeight(500);
                self.chartsContainer.add(self.dt.masterContainer, {edge: 0});
                self.chartsContainer.setVisibility("visible");

                self.table.setMinHeight(500);
                isMaximized == true;
            });
        },
        printList: function printList() {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "excelReport");
            rpc.setTimeOut(500000000);
            rpc.setAsync(true);
            var html = self.getHtmlTableAndFilters();
            var func = function (id) {
                var printer = new qxnw.forms();
                printer.setTitle("Impresión dinámica de listados :: " + qxnw.utils.ucfirst(self.getAppWidgetName()));
                printer.createPrinterToolBar("printer", null, false, true, html);
                printer.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/modulos/nwexcel/file.php?id_qxnwlist=" + id + "&file=/nwlib6/nw_calculate/nw_enc_user.inc.php&functionQXNW=receiveHTMLCalculateEnc&maxRows=10", false);
                printer.ui.selectPrinterSettings.setVisibility("excluded");
                printer.show();
            };
            rpc.exec("saveHtmlToExportToExcel", html, func);
            return true;
        }
        ,
        setHelpContent: function setHelpContent(content) {
            if (typeof this.ui["helpButton"] != 'undefined') {
                this.ui["helpButton"].setEnabled(true);
                this.ui["helpButton"].addListener("execute", function () {
                    qxnw.utils.createIdeaPopUp(this, content, 5000, true);
                });
            }
        },
        saveAsCmi: function saveAsCmi(valChildren, filaRotulos, filaColumnas, graphicType) {
            var self = this;

            self.__formSaveCmi = new qxnw.dynamicTable.saveAsCmi();

            self.__formSaveCmi.ui.select_charts.setValue(graphicType);

            self.__formSaveCmi.show();

            var saveCmi = function (r) {
                var permisos = "";

                if (self.__permissionsLists != null && typeof self.__permissionsLists == "object") {
                    permisos = self.__permissionsLists;
                }
                var filters = self.getFiltersData();
                var fields = self.filters;
                for (var i = 0; i < fields.length; i++) {
                    if (filters[fields[i]["name"]]) {
                        filters[fields[i]["name"] + "_type"] = fields[i]["type"];
                    }
                }
                var data = {
                    "nombre": r["nombre"],
                    "module": self.moduloId,
                    "permisos": permisos,
                    "tableMethod": self.__tableMethodLists,
                    "classname": self.getAppWidgetName(),
                    "isMainForm": self.getIsMainForm(),
                    "serialColumn": self.__serialColumn,
                    "table": self.tableAuto != null ? self.tableAuto : false,
                    "label": self.getName(),
                    "filters": filters,
                    "valores": valChildren,
                    "rotulos_fila": filaRotulos,
                    "rotulos_columna": filaColumnas,
                    "tipo_grafico": graphicType,
                    "privado": r["privado"],
                    "perfiles": r["perfiles"],
                    "descripcion": r["descripcion"],
                    "usuarios": r["usuarios"]
                };
                data.query = self.__queryLoaded;
                self.__queryLoaded = null;
                var funcAsy = function () {
                    self.__formSaveCmi.accept();
                };
                qxnw.utils.fastAsyncRpcCall("cmi", "saveListAsCmi", data, funcAsy);
            };
            self.__formSaveCmi.ui.accept.addListener("execute", function () {
                if (!self.__formSaveCmi.validate()) {
                    return;
                }
                self.__getQuery = true;
                self.applyFilters();
                self.__getQuery = false;
                self.addListenerOnce("returnModelDataQuery", function (ra) {
                    var r = self.__formSaveCmi.getRecord();
                    if (r["privado"] == "false") {
                        qxnw.utils.question(self.tr("El informe va a ser visible para todos los usuarios. ¿Desea continuar?"), function (e) {
                            if (e) {
                                saveCmi(r);
                            }
                        });
                    } else {
                        saveCmi(r);
                    }
                });
            });
        },
        /**
         * Manage all the tool tips
         * @param type {String} the type of tool tip
         * @return {String} the tool tip text
         */
        __toolTipsManager: function __toolTipsManager(type) {
            var self = this;
            var toolTipText = "unknown";
            switch (type) {
                case "autoWidth":
                    toolTipText = self.tr("Establezca automáticamente el ancho de las columnas.");
                    break;
                case "cmi":
                    toolTipText = self.tr("Guardar en el cuadro de mando integral. Una forma de mantener la información de este \n\
                                            listado disponible para estadísticas de seguimiento.");
                    break;
                case "functions":
                    toolTipText = self.tr("Cree funciones sobre su tabla");
                    break;
                case "excel":
                    toolTipText = self.tr("Exporte su tabla a nuestra nueva hoja de cálculo NWCalculate (versión BETA) ");
                    break;
                case "copy_all":
                    toolTipText = self.tr("Copie todo el listado en HTML (sólo para desarroladores)");
                    break;
                case "dynamicTable":
                    toolTipText = self.tr("Tabla dinámica avanzada");
                    break;
                case "minimizeFilters":
                    toolTipText = self.tr("Minimizar filtros");
                    break;
                case "minimizeOptions":
                    toolTipText = self.tr("Minimizar opciones");
                    break;
                case "cleanFilters":
                    toolTipText = self.tr("Limpiar todos los filtros configurados en el listado");
                    break;
                case "actual_page":
                    toolTipText = self.tr("Ingrese la página del total general del listado");
                    break;
                case "order_by":
                    toolTipText = self.tr("Seleccione la columna para ordenar el listado. Para ser ascendente o descendente puede dar click en el encabezado de la columna.");
                    break;
                case "favorites":
                    toolTipText = self.tr("Agregar a favoritos");
                    break;
                case "update_on_enter":
                    toolTipText = self.tr("Actualizar al abrir el listado");
                    break;
                case "sendEmail":
                    toolTipText = self.tr("Envíe uno o varios registros por correo electrónico");
                    break;
                case "autoUpdate":
                    toolTipText = self.tr("Seleccione si desea que siempre que ingrese a esta vista, se actualize automáticamente");
                    break;
                case "maxRows":
                    toolTipText = self.tr("Ingrese el máximo de filas mostradas");
                    break;
                case "mantainFirstColumn":
                    toolTipText = self.tr("Mantener una columna inmóvil (puede desactivar la opción de filtros en algunos casos)");
                    break;
                case "new":
                    toolTipText = self.tr("Click aquí para crear un nuevo ítem");
                    break;
                case "edit":
                    toolTipText = self.tr("Edite un registro");
                    break;
                case "delete":
                    toolTipText = self.tr("Elimine un registro");
                    break;
                case "selectAll":
                    toolTipText = self.tr("Seleccione todos los registros");
                    break;
                case "unSelectAll":
                    toolTipText = self.tr("Desactive todos los registros seleccionados previamente");
                    break;
                case "exportAll":
                    toolTipText = self.tr("Exporte todos los elementos a un archivo en Excel");
                    break;
                case "import":
                    toolTipText = self.tr("Importe registros desde un archivo en delimitado por tabulaciones");
                    break;
                case "printAll":
                    toolTipText = self.tr("Imprima todos los datos de esta vista en un formulario dinámico");
                    break;
                case "configuration":
                    toolTipText = self.tr("Desde aquí puede administrar la configuración de esta vista");
                    break;
                case "colors":
                    toolTipText = self.tr("Configuración personalizada de los colores de las celdas");
                    break;
                case "help":
                    toolTipText = self.tr("Acceda al menú de ayuda en línea de la aplicación");
                    break;
                case "tools":
                    toolTipText = self.tr("Herramientas de hoja de cálculo");
                    break;
                case "totalColumn":
                    toolTipText = self.tr("Seleccione la columna sobre la que desea realizar el cálculo");
                    break;
                case "totalCompareColumn":
                    toolTipText = self.tr("Seleccione el operador de comparación");
                    break;
                case "totalCompareColumnSelect":
                    toolTipText = self.tr("Seleccione la columna sobre la que desea realizar la comparación");
                    break;
                case "type_calc":
                    toolTipText = self.tr("Seleccione el tipo de cálculo que desea realizar");
                    break;
                case "updateTime":
                    toolTipText = self.tr("Ingrese los segundos para actualizar el listado automáticamente");
                    break;
                case "update":
                    toolTipText = self.tr("Actualice los registros en este listado");
                    break;
            }
            var toolTip = new qx.ui.tooltip.ToolTip();
            toolTip.addListener("appear", function (e) {
                var label = toolTipText;
                toolTip.setLabel(label);
            });
            return toolTip;
        }
        ,
        setSimpleWindow: function setSimpleWindow(bool) {
            var self = this;
            self.set({
                'decorator': "shadow-popup",
                showClose: false,
                showMinimize: false,
                showMaximize: false,
                alwaysOnTop: true
            });
        }
        ,
        /**
         * Show the config window          * @param pos {Event} the mouse event
         * @return {void}
         */
        __showColors: function __showColors(pos) {
            var self = this;
            pos.preventDefault();
            var d = new qxnw.forms();
            d.addFooterNote(self.tr("Desde este espacio puede poner colores en los listados. Ej: En la columna 'id' que sea igual a 5 será verde. <b>Es posible que deba actualizar el listado</b>"));
            d.setColumnsFormNumber(1);
//            d.setInvalidateStore(true);
            //d.setSimpleWindow(true);
            //d.setShowClose(false);
//            d.setShowMinimize(false);
//            d.setShowMaximize(false);
            d.setTitle(self.tr("Colores de las celdas"));
            d.setAppWidgetName("form_lists_colors_" + self.getAppWidgetName());
            var fields = [
                {
                    name: "column",
                    label: self.tr("Seleccione la columna"),
                    type: "selectBox"
                },
                {
                    name: "condition",
                    label: self.tr("Condición"),
                    type: "selectBox"
                },
                {
                    name: "value",
                    label: self.tr("Valor a comparar"),
                    type: "textField",
                    required: true
                },
                {
                    name: "color",
                    label: self.tr("Color"),
                    type: "colorButton"
                },
                {
                    name: "color_render",
                    label: self.tr("Tipo de coloreado"),
                    type: "selectBox"
                },
                {
                    name: "color_comment",
                    label: self.tr("Comentario"),
                    type: "textField"
                }
            ];
            d.setFields(fields);
            var columns = self.table.getTableColumnModel().getVisibleColumns();
            var data = {};
            for (var i = 0; i < columns.length; i++) {
                var model = self.table.getTableModel().getColumnName(columns[i]);
                var idCol = self.table.getTableModel().getColumnId(columns[i]);
                data[idCol] = model;
            }
            qxnw.utils.populateSelectFromArray(d.ui.column, data);

            data = {};
            data["Sólo letra"] = "Sólo letra";
            data["Por fila"] = "Por fila";
            //data["Por columna"] = "Por columna";
            qxnw.utils.populateSelectFromArray(d.ui.color_render, data);

            data = {};
            data["=="] = "== Igual que";
            data[">"] = "> Mayor que";
            data[">="] = ">= Mayor o igual que";
            data["<"] = "< Menor que";
            data["<="] = "<= Menor o igual que";
            data["!="] = "!= Diferente de";
            qxnw.utils.populateSelectFromArray(d.ui.condition, data);
            d.settings.accept = function () {
                var rows = navTable.getAllData();
                if (rows.length == 0) {
                    if (rows == null) {
                        return;
                    }
                }
                qxnw.local.removeByKey(self.getAppWidgetName() + "_colors");
                for (var i = 0; i < rows.length; i++) {
                    var arr = Array();
                    var r = {};
                    r["label"] = rows[i].label;
                    r["column"] = rows[i].column;
                    r["value"] = rows[i].value;
                    r["condition"] = rows[i].condition;
                    r["color"] = rows[i].color;
                    r["type"] = rows[i].type;
                    r["comment"] = rows[i].comment;
                    var id = self.getColorsRendererId() + 1;
                    self.setColorsRendererId(id);
                    r["id"] = id;
                    arr.push(r);
                    var data = qxnw.local.getData(self.getAppWidgetName() + "_colors");
                    if (data == null) {
                        qxnw.local.storeData(self.getAppWidgetName() + "_colors", arr);
                        continue;
                    }
                    for (var ia = 0; ia < data.length; ia++) {
                        if (data[ia].id == r["id"]) {
                            data.splice(ia, 1, r);
                            qxnw.local.storeData(self.getAppWidgetName() + "_colors", data);
                            continue;
                        }
                    }
                    data.push(r);
                    qxnw.local.storeData(self.getAppWidgetName() + "_colors", data);
                }
                self.renderColorsCells();

                self.manageSemaphore();
                try {
                    //self.applyFilters();
                } catch (e) {
                    return;
                }
            };
            d.ui.accept.setLabel("Guardar todo");
            d.ui.accept.addListener("click", function (e) {
                d.accept();
            });
            d.ui.cancel.addListener("click", function (e) {
                d.reject();
            });
            var navTable = new qxnw.navtable(self);
            navTable.setHaveParentContextMenu(false);
            navTable.setMaxHeight(300);
            navTable.setTitle("Columnas configuradas");
            navTable.createBase();
            var columns = [
                {
                    label: "column",
                    caption: "column"
                },
                {
                    label: self.tr("Columna"),
                    caption: "label"
                },
                {
                    label: self.tr("Condición"),
                    caption: "condition"
                },
                {
                    label: self.tr("Valor"),
                    caption: "value"
                },
                {
                    label: self.tr("Color"),
                    caption: "color"
                },
                {
                    label: self.tr("Tipo"),
                    caption: "type"
                },
                {
                    label: self.tr("Comentario"),
                    caption: "comment"
                }
            ];
            navTable.setColumns(columns);
            navTable.hideColumn("column");
            var agregarButton = navTable.getAddButton();
            agregarButton.addListener("execute", function () {
                var r = {};
                r["label"] = d.ui.column.getValue().column_text;
                r["column"] = d.ui.column.getValue().column;
                r["value"] = d.ui.value.getValue();
                r["condition"] = d.ui.condition.getValue().condition;
                r["color"] = d.ui.color.getValue();
                r["type"] = d.ui.color_render.getValue()["color_render"];
                r["comment"] = d.ui.color_comment.getValue();
                navTable.addRows([r]);
            });
            var deleteButton = navTable.getRemoveButton();
            deleteButton.addListener("click", function () {
                var r = navTable.selectedRecord();
                if (r == undefined) {
                    qxnw.utils.information("Seleccione un registro para eliminar");
                    return;
                }
                navTable.removeSelectedRow();
            });
            var sd = qxnw.local.getData(self.getAppWidgetName() + "_colors");
            if (sd != null) {
                navTable.addRows(sd);
            }
            d.insertNavTable(navTable.getBase(), "Configuraciones de columnas");
            d.show();
            d.addListener("appear", function () {
//                var bounds = this.getBounds();
//                d.setUserBounds(pos.getDocumentLeft() - bounds.width, 100, bounds.width, bounds.height);
//                qxnw.animation.startEffect("rotateIn", d);
            });
        }
        ,
        manageSemaphore: function manageSemaphore() {
            var self = this;
            var data = qxnw.local.getData(self.getAppWidgetName() + "_colors");
            if (data == null) {
                return;
            }
            if (self.containerFilters == null) {
                return;
            }
            var colors = [];
            var d = {};
            d["color"] = "white";
            d["toolTip"] = self.tr("Todos");
            d["condition"] = "none";
            d["handledColumn"] = 0;
            d["handledVal"] = 0;
            colors.push(d);
            for (var i = 0; i < data.length; i++) {
                d = {};
                d["color"] = data[i].color;
                d["toolTip"] = data[i].comment;
                d["condition"] = data[i].condition;
                var tableModel = this.table.getTableModel();
                var col = tableModel.getColumnIndexById(data[i].column);
                d["handledColumn"] = col;
                d["handledVal"] = data[i].value;
                colors.push(d);
            }
            if (colors.length == 0) {
                if (typeof self.ui["widget_nw_color_filter"] != 'undefined') {
                    self.removeFromFiltersBar(self.ui["widget_nw_color_filter"]);
                }
                return;
            }
            self.createCompleteSemaphore(colors, "nw_color_filter", self.tr("Filtro de colores"), qxnw.config.execIcon("utilities-color-chooser", "apps"));
            self.ui.nw_color_filter.addListener("changeSelection", function (e) {
                var d = e.getData();
                var model = d[0].getModel();
                if (model.condition == "none") {
                    self.table.cleanFiltersOnList();
                } else {
                    self.table.changeFilterRowsOnlyColors("color", model);
                }
            });
        }
        ,
        /**
         * Save the configuration in the client side
         * @param config {Array} the array 
         * @return {void}
         */
        __saveConfiguration: function __saveConfiguration(config) {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            qxnw.local.storeData(self.getAppWidgetName() + "_config", config);
        }
        ,
        /**
         * Return the stored user configuration about this class.
         * @return {Array} the configuration data
         */
        __getStoredConfiguration: function __getStoredConfiguration() {
            var self = this;
            var data = qxnw.local.getData(self.getAppWidgetName() + "_config");
            return data;
        }
        ,
        searchInRowArray: function searchInRowArray(val, arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].id === val.id) {
                    return i;
                }
            }
            return -1;
        }
        ,
        /**
         * Remove the selected rows
         * @return {void}
         */
        removeSelectedRows: function removeSelectedRows() {
            var self = this;
            // ANDRESF - JULIO 2020: SE QUITA PARA QUE NO SE DAÑE LA FORMA DE SELECCIONAR
//            self.table.getSelectionModel().setBatchMode(true);

            var sm = self.table.getSelectionModel();
            var ranges = sm.getSelectedRanges();
            var lastCell = 0;
            for (var i = 0; i <= ranges.length; i++) {
                if (typeof ranges[i] == 'undefined') {
                    break;
                }
                //TODO: PILAS!
                try {
                    self.model.removeRows(ranges[i].minIndex, (ranges[i].maxIndex + 1) - ranges[i].minIndex);
                    lastCell = ranges[i].maxIndex - 1;
                } catch (e) {
                    if (qxnw.utils.isDebug()) {
                        console.log(e);
                    }
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

//            self.table.getSelectionModel().setBatchMode(false);
        },
        removeRowsByRanges: function removeRowsByRanges(ranges) {
            var self = this;
            if (typeof ranges == 'undefined' || ranges == null || ranges == '') {
                return;
            }
            for (var i = 0; i <= ranges.length; i++) {
                if (typeof ranges[i] == 'undefined') {
                    return;
                }
                self.model.removeRows(ranges[i].minIndex, (ranges[i].maxIndex + 1) - ranges[i].minIndex);
                ranges = self.table.getSelectionModel().getSelectedRanges();
                self.removeRowsByRanges(ranges);
            }
        }
        ,
        /**
         * Remove one row passing the row index
         * @param row {Integer} 
         * @returns {void}
         */
        deleteRecordByRow: function deleteRecordByRow(row) {
            var self = this;
            self.model.removeRows(row, 1);
        }
        ,
        enableAllButtons: function enableAllButtons(bool) {
            for (var i = 0; i < this.filters.length; i++) {
                if (this.filters[i].type == "button") {
                    this.ui[this.filters[i].name].setEnabled(bool);
                }
            }
        }
        ,
        removeSelectedRecord: function removeSelectedRecord() {
            this.removeSelectedRow();
        }
        ,
        /**
         * Remove the selected row
         * @return {void}
         */
        removeSelectedRow: function removeSelectedRow() {
            var self = this;

            var sm = self.table.getSelectionModel();
            var srs = sm.getSelectedRanges();

            var row = self.table.getFocusedRow();
            if (row == null) {
                qxnw.utils.information("Seleccione un registro");
                return;
            }

            self.model.removeRows(row, 1);

            self.table.setShowCellFocusIndicator(self.getShowCellFocusIndicator());

            var pane = self.table.getPaneScroller(0);
            var tablePane = pane.getTablePane();
            pane.activate();
            tablePane.activate();

            if (srs !== null && typeof srs.length !== 'undefined') {
                if (typeof srs[0] !== 'undefined') {
                    if (typeof srs[0].minIndex !== 'undefined' && typeof srs[0].maxIndex !== 'undefined') {
                        sm.setSelectionInterval(srs[0].minIndex, srs[0].maxIndex);
                    }
                }
            }
        },
        /**
         * Return an record {Array} passing the row ({Integer})
         * @param row {Integer} 
         * @return {Array}
         */
        getRecordByRow: function getRecordByRow(row) {
            var self = this;
            if (row == null) {
                return undefined;
            }
            var columns = self.model.getColumnCount();
            var r = {};
            for (var i = 0; i < columns; i++) {
                try {
                    var data = self.model.getValue(i, row);
                } catch (e) {
                    return 0;
                }
                r[self.captions[i]] = data;
            }
            return r;
        }, /**
         * Return the selected records
         * @return {Array} the selected records
         */
        selectedRecords: function selectedRecords() {
            var self = this;
            var selection = self.table.getSelectionModel().getSelectedRanges();
            var data = [];
            var count = 0;
            for (var i = 0; i < selection.length; i++) {
                var ranges = selection[i];
                while (ranges.minIndex <= ranges.maxIndex) {
                    data[count] = self.getRecordByRow(ranges.minIndex);
                    ranges.minIndex++;
                    count++;
                }
            }
            return data;
        },
        getFocusedRow: function getFocusedRow() {
            return this.table.getFocusedRow();
        },
        /**
         * Devuelve el record seleccionado
         * @return {Array}
         */
        selectedRecord: function selectedRecord() {
            var self = this;
            var row = self.table.getFocusedRow();
            if (row == null) {
                return undefined;
            }
            var columns = self.model.getColumnCount();
            var r = {};
            var format = null;
            for (var i = 0; i < columns; i++) {
                try {
                    var data = self.model.getValue(i, row);
                } catch (e) {
                    if (typeof e == 'object' && e.message.indexOf("of bounds")) {
                        return null;
                    } else {
                        qxnw.utils.error(e);
                    }
                }
                switch (self.types[i]) {
                    case "dateField":
                        //var formatT = qx.locale.Date.getDateFormat("medium");
                        //format = new qx.util.format.DateFormat(formatT, qx.locale.Manager.getInstance().getLocale());
                        format = new qx.util.format.DateFormat("yyyy-MM-dd");
                        if (typeof data != 'undefined' && data != null && data != '') {
                            if (typeof data == "object") {
                                r[self.captions[i]] = format.format(data);
                            } else {
                                r[self.captions[i]] = data;
                            }
                        }
                        break;
                    case "dateTimeField":
                        format = new qx.util.format.DateFormat("yyyy-MM-dd H:m:s");
                        if (typeof data != 'undefined' && data != null && data != '') {
                            if (typeof data == "object") {
                                r[self.captions[i]] = format.format(data);
                            } else {
                                r[self.captions[i]] = data;
                            }
                        }
                        break;
                    default:
                        r[self.captions[i]] = data;
                        break;
                }
            }
            return r;
        }
        ,
        /**
         * Devuelve el record seleccionado
         * @return {Array}
         */
        getSelectedRecord: function getSelectedRecord() {
            return this.selectedRecord();
        }
        ,
        /**
         * Devuelve los rows seleccionados
         * @return {Array}
         */
        getSelectedRecords: function getSelectedRecords() {
            return this.selectedRecords();
        }
        ,
        /**
         * Return the table
         * @returns {unresolved}          */
        getMainTable: function getMainTable() {
            return this.table;
        }
        ,
        /**
         * Return the selected record
         * @return {Array}
         */
        selectedVisibleRecord: function selectedVisibleRecord() {
            var self = this;
            var row = self.table.getFocusedRow();
            if (row == null) {
                return undefined;
            }
            var columns = self.model.getColumnCount();
            var r = {};
            for (var i = 0; i < columns; i++) {
                var columnModel = self.table.getTableColumnModel();
                if (columnModel.isColumnVisible(i)) {
                    var data = self.model.getValue(i, row);
                    r[self.captions[i]] = data;
                }
            }
            return r;
        }
        ,
        getVisibleRecordByRow: function getVisibleRecordByRow(row) {
            var self = this;
            var columns = self.model.getColumnCount();
            var r = {};
            for (var i = 0; i < columns; i++) {
                var columnModel = self.table.getTableColumnModel();
                if (columnModel.isColumnVisible(i)) {
                    var data = self.model.getValue(i, row);
                    r[self.captions[i]] = data;
                }
            }
            return r;
        }
        ,
        /**
         * return the records in the table array map. You can choose 
         * @returns {Array}
         */
        selectedVisibleRecords: function selectedVisibleRecords() {
            var self = this;
            var selection = self.table.getTableModel().getDataAsMapArray();
            var data = {};
            var count = 0;
            for (var i = 0; i < selection.length; i++) {
                var ranges = selection[i];
                while (ranges.minIndex <= ranges.maxIndex) {
                    data[count] = self.getVisibleRecordByRow(ranges.minIndex);
                    ranges.minIndex++;
                    count++;
                }
            }
            return data;
        }
        ,
        getTotalColumns: function getTotalColumns() {
            return this.allColumnsData == null ? 0 : this.allColumnsData.length;
        }
        ,
        /**
         * Set the total column. When this is set, the class try to totalize all the data of the column
         * @param column {String} the column name
         * @return {void}
         */
        setTotalColumn: function setTotalColumn(column) {
            var self = this;
            self.__totalColumn = column;
        }
        ,
        setTypeOfCalc: function setTypeOfCalc(type) {
            var self = this;
            self.__typeOfCalc = type;
        }
        ,
        /**
         * Return the sum of a column set in method {setTotalColumn}
         * @return {Numeric} the total
         */
        getTotalColumn: function getTotalColumn() {
            var self = this;
            var model = self.model.getData();
            var col = self.columnIndexFromName(self.__totalColumn);
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
            return qxnw.utils.formatCurrency(total);
        },
        /**
         * Return the sum of a column set in method {setTotalColumn}
         * @return {Numeric} the total
         */
        getTotalColumnByColumn: function getTotalColumnByColumn() {
            var self = this;
            var model = self.model.getData();
            var col = self.columnIndexFromName(self.__totalColumn);
            var colCompare = self.columnIndexFromName(self.totalCompareCol.getValue()["totalCompareCol"]);
            var total = 0;
            var r = null;
            var operator = self.totalCompareValue.getValue()["totalCompareValue"];
            var totalValue = self.totalValue.getValue();
            for (var i = 0; i < model.length; i++) {
                r = model[i];
                for (var ia = 0; ia < r.length; ia++) {
                    if (colCompare == ia) {
                        if (operator == "=") {
                            if (totalValue == r[ia] == "" ? 0 : r[ia]) {
                                total = total + parseFloat(r[col] == "" ? 0 : r[col]);
                            }
                        } else if (operator == ">") {
                            if (parseInt(totalValue) < parseFloat(r[ia] == "" ? 0 : r[ia])) {
                                total = total + parseFloat(r[col] == "" ? 0 : r[col]);
                            }
                        } else if (operator == "<") {
                            if (parseInt(totalValue) > parseFloat(r[ia] == "" ? 0 : r[ia])) {
                                total = total + parseFloat(r[col] == "" ? 0 : r[col]);
                            }
                        }
                    }
                }
            }
            return qxnw.utils.formatCurrency(total);
        }
        ,
        /**
         * Return the num of rows by the column compare and value
         * @return {Numeric} the total
         */
        getRecuentoByColumn: function getRecuentoByColumn() {
            var self = this;
            var model = self.model.getData();
            var col = self.columnIndexFromName(self.__totalColumn);
            var colCompare = self.columnIndexFromName(self.totalCompareCol.getValue()["totalCompareCol"]);
            var total = 0;
            var r = null;
            var operator = self.totalCompareValue.getValue()["totalCompareValue"];
            var totalValue = self.totalValue.getValue();
            for (var i = 0; i < model.length; i++) {
                r = model[i];
                for (var ia = 0; ia < r.length; ia++) {
                    if (colCompare == ia) {
                        if (operator == "=") {
                            if (totalValue == r[ia] == "" ? 0 : r[ia]) {
                                total++;
                            }
                        } else if (operator == ">") {
                            if (parseInt(totalValue) < parseInt(r[ia] == "" ? 0 : r[ia])) {
                                total++;
                            }
                        } else if (operator == "<") {
                            if (parseInt(totalValue) > parseInt(r[ia] == "" ? 0 : r[ia])) {
                                total++;
                            }
                        }
                    }
                }
            }
            return qxnw.utils.formatCurrency(total);
        }
        ,
        getPromColumn: function getPromColumn() {
            var self = this;
            var model = self.model.getData();
            var col = self.columnIndexFromName(self.__totalColumn);
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
            return qxnw.utils.formatCurrency(total / model.length);
        },
        createFiltersReport: function createFiltersReport(filters) {
            var self = this;
            var focused = false;
            self.filters = filters;
            self.setQxnwType("qxnw_reports");
            if (self.containerFilters == null) {
                self.containerFilters = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                    spacing: 5
                })).set({
                    padding: 5,
                    allowGrowY: false,
                    allowShrinkY: true
                });
                self.__verticalContainer.add(self.containerFilters, {
                    flex: 1
                });
            }
            for (var i = 0; i < filters.length; i++) {
                var name = filters[i].name;
                var label = filters[i].label;
                var type = filters[i].type;
                if (typeof filters[i].visible == 'undefined') {
                    filters[i].visible = true;
                }
                var enabled = typeof filters[i].enabled == 'undefined' ? true : filters[i].enabled;
                switch (type) {
                    case "textField":
                        self.ui[name] = new qx.ui.form.TextField();
                        break;
                    case "selectBox":
                        //self.ui[name] = new qx.ui.form.SelectBox();
                        self.ui[name] = new qxnw.fields.selectBox();
                        self.ui[name].setValue = function (value) {
                            var items = this.getSelectables(true);
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].getModel() == value) {
                                    this.setSelection([items[i]]);
                                }
                            }
                            return true;
                        };
                        break;
                    case "dateField":
                        self.ui[name] = new qx.ui.form.DateField();
                        var format = new qx.util.format.DateFormat("yyyy-MM-dd");
                        self.ui[name].setDateFormat(format);
                        self.ui[name].addListener("focus", function (e) {
                            this.open();
                        });
                        self.ui[name].addListener("click", function (e) {
                            this.open();
                        });
                        break;
                }

                self.type[name] = type;
                self.ui[name].setAllowGrowY(false);
                self.ui[name].addListener("keypress", function (e) {
                    if (e._identifier == "Enter") {
                        self.ui["searchButton"].focus();
                    }
                });
                if (type == "textField" || type == "textArea") {
                    self.ui[name].setPlaceholder(label);
                }

                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                container.add(new qx.ui.basic.Label(label), {
                    flex: 1
                });
                container.add(self.ui[name], {
                    flex: 1
                });
                self.containerFilters.add(container, {
                    flex: 0
                });
                if (!focused) {
                    if (filters[i].visible) {
                        if (enabled) {
                            if (type == "spinner") {
                                self.ui[name].getChildControl("textfield").setLiveUpdate(true);
                                self.ui[name].getChildControl("textfield").getFocusElement().focus();
                            } else {
                                self.ui[name].focus();
                            }
                            focused = true;
                        }
                    }
                }
                self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
                self.count++;
            }
            self.buttonSearch = new qx.ui.form.Button(self.tr("Generar"), qxnw.config.execIcon("dialog-apply")).set({
                maxHeight: 30
            });
            self.buttonSearch.setAllowGrowX(false);
            self.containerFilters.add(self.buttonSearch, {
                flex: 0
            });
            self.__spacer = new qx.ui.core.Spacer(30, 40);
            self.containerFilters.add(self.__spacer, {
                flex: 1
            });
            self.ui["searchButton"] = self.buttonSearch;
            self.buttonSearch.setTabIndex(qxnw.config.getActualTabIndex());
            self.buttonSearch.addListener("execute", function (e) {
                if (self.__frameLists != null) {
                    var filtersData = self.getFiltersData();
                    var urlRequest = "?";
                    for (var v in filtersData) {
                        urlRequest += v;
                        urlRequest += "=";
                        urlRequest += filtersData[v];
                        urlRequest += "&";
                    }
                    var url = self.getFrameUrl() + urlRequest;
                    self.catchFiltersValues();
                    self.__frameLists.setSource(url);
                }
            });
            self.putCatchedContent();
        },
        createFilterWidget: function createFilterWidget(name, type, label, mode) {
            var self = this;
            switch (type) {
                case "button":
                    self.ui[name] = new qx.ui.form.Button().set({
                        rich: true,
                        alignY: "middle"
                    });
                    break;
                case "radioButton":
                    self.ui[name] = new qx.ui.form.RadioButton();
                    break;
                case "textField":
                    self.ui[name] = new qx.ui.form.TextField();
                    break;
                case "money":
                    self.ui[name] = new qxnw.widgets.NumericField();
                    break;
                case "selectBox":
                    self.ui[name] = new qxnw.fields.selectBox();
                    self.ui[name].setUserData("name", name);
                    break;
                case "dateField":
                    self.ui[name] = new qxnw.widgets.dateField();
                    break;
                case "dateTimeField":
                    self.ui[name] = new qxnw.widgets.dateTimeField();
                    self.ui[name].setDateFormat(new qx.util.format.DateFormat("yyyy-MM-dd"));
                    break;
                case "passwordField":
                    self.ui[name] = new qx.ui.form.PasswordField();
                    break;
                case "dateChooser":
                    //TESTING 
                    self.ui[name] = new qx.ui.control.DateChooser();
                    break;
                case "textArea":
                    self.ui[name] = new qx.ui.form.TextArea();
                    self.ui[name].set({
                        allowShrinkY: false
                    });
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
                case "selectTokenField":
                    self.ui[name] = new qxnw.widgets.selectTokenField();
                    self.ui[name].setUniqueName(self.getAppWidgetName() + name + type + label);
                    //self.ui[name].setSelectionMode('single');
                    break;
                case "selectListCheck":
                    self.ui[name] = new qxnw.widgets.selectListCheck();
                    break;
                default:
                    qxnw.utils.alert(self.tr("Error en el tipo de objeto:") + name);
                    break;
            }

        },
        addFiltersButtons: function addFiltersButtons(filters) {
            var self = this;
            for (var i = 0; i < filters.length; i++) {
                self.createFilterWidget(filters[i].name, filters[i].type);
                if (typeof filters[i].icon != 'undefined') {
                    self.ui[filters[i].name].setIcon(filters[i].icon);
                }
                if (typeof filters[i].label != 'undefined') {
                    self.ui[filters[i].name].setLabel(filters[i].label);
                }
                self.containerFilters.add(self.ui[filters[i].name]);
                self.filters.push(filters[i]);
            }
        },
        setRequired: function setRequired(name, bool) {
            var fields = this.getFilters();
            for (var i = 0; i < fields.length; i++) {
                if (name == fields[i].name) {
                    fields[i].required = bool;
                    if (bool) {
                        var label = this.labelForm[name].getValue().replace("<b style='color:red' class='require_qxnw'>*</b>", "");
                        this.labelForm[name].setValue(label + "<b style='color:red' class='require_qxnw'>*</b>");
                    } else {
                        if (typeof this.labelForm[name] != 'undefined') {
                            var label = this.labelForm[name].getValue().replace("<b style='color:red' class='require_qxnw'>*</b>", "");
                            this.labelForm[name].setValue(label.replace("<b style='color:red' class='require_qxnw'>*</b>", ""));
                        } else {
                            var label = this.labelUi[name].getValue().replace("<b style='color:red' class='require_qxnw'>*</b>", "");
                            this.labelUi[name].setValue(label.replace("<b style='color:red' class='require_qxnw'>*</b>", ""));
                        }
                    }
                    break;
                }
            }
        },
        checkRequiredFilters: function checkRequiredFilters(keyIdentifier, nameWidget) {
            var self = this;
            setTimeout(function () {
                var val = self.ui[nameWidget].getValue();
                var filters = self.filters;
                var setRequired = false;

                for (var i = 0; i < filters.length; i++) {
                    var v = filters[i];

                    var type = filters[i]["type"];

                    if (type === "checkBox") {
                        continue;
                    }
                    if (type === "button") {
                        continue;
                    }

                    var name = filters[i]["name"];
                    var required = filters[i]["required"];
                    var val = self.ui[name].getValue();

                    if (val === null) {
                        setRequired = true;
                        continue;
                    }
                    if (typeof val == "object" && val.length == 0) {
                        setRequired = true;
                        continue;
                    }
                    if (typeof val == "object") {
                        setRequired = true;
                        continue;
                    }
                    if (val !== "" && val !== null) {
                        setRequired = false;
                        break;
                    } else {
                        setRequired = true;
                    }
                }

                var r = self.__filtersRequireds;

                for (var i = 0; i < r.length; i++) {
                    var name = r[i]["name"];
                    self.setRequired(name, setRequired);
                }

                return;
            }, 500);
        },
        setFilters: function setFilters(filters) {
            this.createFilters(filters);
        },
        /**
         * Create the filters of class. You can create the filters in this way:
         * <pre class='javascript'>
         * var filters = [
         * {
         * name : "buscar", 
         * label : "Filtro...", 
         * type : "textField"
         * },
         * {
         * name : "nivel",
         * caption : "nivel",
         * label : "Nivel",
         * type : "selectBox"
         * }];
         * this.createFilters(filters);
         * </pre>
         * Then, you can use the filters. i.e:
         * <pre class='javascript'>
         * self.ui.buscar.setEnabled(true);
         * 
         * Additionally, the search button is created. You can use it:
         * <pre class='javascript'>
         * self.ui.searchButton
         * </pre>
         * @param filters {Array} 
         * @param addclass {Boolean} 
         * @return {void}
         */
        createFilters: function createFilters(filters, addclass) {
            var self = this;
            var focused = false;
            if (typeof filters == 'undefined') {
                return;
            }
            self.filters = filters;
            if (self.containerFilters == null) {
                self.containerFilters = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                    spacing: 5
                })).set({
                    padding: 5,
                    allowGrowY: false,
                    allowShrinkY: true
                });
                if (typeof self.__verticalContainer != 'undefined') {
                    self.__verticalContainer.add(self.containerFilters, {
                        flex: 1
                    });
                }
            }
            var isDateWidgetStart = false;
            var isDateWidgetEnd = false;
            for (var i = 0; i < filters.length; i++) {
                var mode = filters[i].mode;
                var name = filters[i].name;
                var label = filters[i].label;
                var type = filters[i].type;
                var required = filters[i].required;
                var enabled = filters[i].enabled;
                var toolTip = filters[i].toolTip;
                var visible = filters[i].visible;
                if (required == 1) {
                    required = true;
                }
                if (required == 0) {
                    required = false;
                }
                if (typeof filters[i].visible == 'undefined') {
                    filters[i].visible = true;
                }
                var enabled = typeof filters[i].enabled == 'undefined' ? true : filters[i].enabled;
                self.createFilterWidget(name, type, label, mode);
                if (name === "fecha_inicial" || name === "fecha_inicio" || name === "fecha_inicial_filters") {
                    isDateWidgetStart = true;
                } else if (name === "fecha_final" || name === "fecha_fin" || name === "fecha_final_filters") {
                    isDateWidgetEnd = true;
                }
                self.type[name] = type;
                self.ui[name].setAllowGrowY(false);
                self.ui[name].addListener("keypress", function (e) {
                    if (e._identifier == "Enter") {
                        self.ui["searchButton"].focus();
                        try {
                            self.ui["searchButton"].setFocusParent(this);
                        } catch (e) {
                            qxnw.utils.nwconsole(e);
                        }
                    } else {
                        self.checkRequiredFilters(e._identifier, this.getUserData("name"));
                    }
                });
                if (type == "textField" || type == "textArea" || type == "selectTokenField") {
                    if (type == "selectTokenField") {
                        self.ui[name].getChildControl('textfield').setPlaceholder(label);
                    } else {
                        label = qxnw.utils.replaceAll(label, "<b style='color:red'>*</b>", "");
                        self.ui[name].setPlaceholder(label);
                    }
                }
                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                self.containerFieldsArray[name] = container;
                ////////////////////////////////AGREGO CLASE CSS A CONTENEDORES DE FILTROS
                if (addclass == true) {
                    container.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_div_filters_inputs");
                    });
                }
                var asterisk = "";
                if (required === true) {
                    asterisk = "<b style='color:red' class='require_qxnw'>*</b>";

                    var index = self.__filtersRequireds.findIndex(function (object) {
                        object.name === filters[i].name;
                    });
                    if (index === -1) {
                        self.__filtersRequireds.push(filters[i]);
                    }
                }
                if (typeof toolTip != 'undefined' && typeof toolTip != null) {
                    if (label != "null") {
                        label = label.replace("_", " ");
                        label = qxnw.utils.replaceAll(label, "<b style='color:red' class='require_qxnw'>*</b>", "");
                    } else {
                        label = "null";
                    }
                    self.labelForm[name] = new qx.ui.basic.Atom(label.replace("_", " ") + asterisk, qxnw.config.execIcon("dialog-information.png", "status")).set({
                        rich: true
                    });
                    self.labelForm[name].setGap(-3);
                    self.labelForm[name].setIconPosition("right");
                    var tT = new qx.ui.tooltip.ToolTip(toolTip, qxnw.config.execIcon("help-faq"));
                    self.labelForm[name].setToolTip(tT);
                } else {
                    if (typeof label == 'undefined' || label == null) {
                        label = "";
                    }
                    label = qxnw.utils.replaceAll(label, "<b style='color:red' class='require_qxnw'>*</b>", "");
                    label = label.toString().replace("_", " ") + asterisk;
                    self.labelForm[name] = new qx.ui.basic.Label(label).set({
                        rich: true
                    });
                }
                if (required) {
                    self.labelForm[name].setUserData("required", required);
                }
                self.labelForm[name].setUserData("name", name);
                self.ui[name].setUserData("name", name);
                if (type === "button" || type === "label") {
                    self.labelForm[name].setValue("");
                    self.labelForm[name].setVisibility("excluded");
                } else if (type === "ckeditor") {
                    container.getLayout().set({
                        alignX: "right"
                    });
                } else if (type === "checkBox") {
                    container.getLayout().set({
                        alignX: "left"
                    });
                }
                container.add(self.labelForm[name], {
                    flex: 1
                });
                if (type === "button") {
                    container.add(self.ui[name], {
                        flex: 1
                    });
                    self.ui[name].setAllowGrowY(true);
                } else {
                    container.add(self.ui[name]);
                }

                self.containerFilters.add(container, {
                    flex: 0
                });

                if (isDateWidgetStart && isDateWidgetEnd) {
                    isDateWidgetStart = false;
                    isDateWidgetEnd = false;
                    self.containerDateTool = new qxnw.widgets.dateWidgetContainer(new qx.ui.layout.VBox(), this).set({
                        padding: 2
                    });
                }

                if (!focused) {
                    if (filters[i].visible) {
                        if (enabled) {
                            focused = true;
                            self.setFocusAsync(type, name);
                        }
                    }
                }

                if (type == "selectTokenField") {
                    self.ui[name].handleTabIndex(qxnw.config.getActualTabIndex());
                    self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
                } else if (filters[i].type == "money") {
                    self.ui[name].setAllTabIndex(qxnw.config.getActualTabIndex());
                } else if (filters[i].type == "textField") {
                    self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
                } else {
                    self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
                }

                if (visible == false) {
                    self.setFieldVisibility(self.ui[name], "excluded");
                }
                if (typeof enabled != 'undefined') {
                    try {
                        self.ui[name].setEnabled(enabled);
                    } catch (e) {

                    }
                }
                self.count++;
            }
            self.createButtonSearch();

            //TODO: andresf, se retira porque se ejecuta al appear con el execSettings
            //self.putCatchedContent();

            self.manageSemaphore();
        },
        addRenderColors: function addRenderColors(json) {
            var self = this;
            var savedData = qxnw.local.getData(self.getAppWidgetName() + "_colors");
            if (savedData == null) {
                savedData = [];
            }
            var finded = false;
            for (var ia = 0; ia < json.length; ia++) {
                for (var i = 0; i < savedData.length; i++) {
                    if (savedData[i].column == json[ia].column) {
                        finded = true;
                    }
                }
                if (!finded) {
                    savedData.push(json[ia]);
                }
                finded = false;
            }
            qxnw.local.storeData(self.getAppWidgetName() + "_colors", savedData);
        },
        setFieldVisibility: function setFieldVisibility(field, visible) {
            if (typeof field != 'undefined') {
                var content = field.getLayoutParent();
                content.setVisibility(visible);
                this.fireEvent("NWChangeFieldVisibility");
            }
        },
        setFocusAsync: function setFocusAsync(type, name) {
            var self = this;
            self.__focusElement = {
                type: type,
                name: name
            };
        },
        handleFocus: function handleFocus() {
            var self = this;
            if (this.__focusElement == null) {
                return;
            }
            try {
                if (self.ui[self.__focusElement["name"]].isFocusable()) {
                    self.ui[self.__focusElement["name"]].focus();
                }
            } catch (e) {
                if (self.__focusElement["type"] == "dateChooser") {
                    return;
                } else if (self.__focusElement["type"] == "spinner") {
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").setLiveUpdate(true);
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").getFocusElement().focus();
                } else if (self.__focusElement["type"] == "selectTokenField") {
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").setLiveUpdate(true);
                    self.ui[self.__focusElement["name"]].focus();
                } else if (self.__focusElement["type"] == "dateField") {
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").setLiveUpdate(true);
                    self.ui[self.__focusElement["name"]].getChildControl("textfield").getFocusElement().focus();
                    self.ui[self.__focusElement["name"]].focus();
                } else {
                    if (self.ui[self.__focusElement["name"]].isFocusable()) {
                        self.ui[self.__focusElement["name"]].focus();
                    }
                    self.ui[self.__focusElement["name"]].getFocusElement().focus();
                }
            }
        },
        /**
         * Take the stored values of filters, and put them inself
         * @return {void}
         */
        putCatchedContent: function putCatchedContent() {
            var self = this;
            var catched = self.getCatchedFiltersValues();
            if (catched == null) {
                return;
            }
            if (catched == false) {
                return;
            }
            self.__isPutCatchedContent = true;
            self.setFiltersData(catched);
        }
        ,
        /**
         * Set data on the filters. i.e:
         * <pre class='javascript'>
         * var data = {
         *      "search" = 5,
         *      "initial_date" = '2013-03-03'
         * };
         * this.setFiltersData(data);
         * </pre>
         * @param data {Array} the array data
         * @return {void}          */
        setFiltersData: function setFiltersData(data) {
            if (data == null) {
                return;
            }
            var self = this;
            var filters = self.filters;
            if (filters == null) {
                return;
            }
            var items = null;
            for (var i = 0; i < filters.length; i++) {
                var name = filters[i].name;
                switch (filters[i]["type"]) {
                    case "textField":
                        continue;
                        if (data[name] == null) {
                            continue;
                        }
                        self.ui[name].setValue(data[name]);
                        break;
                    case "selectListCheck":
                        if (data[name] == null) {
                            continue;
                        }
                        var arr = [];
                        if (typeof data[name + "_array_all"] !== 'undefined') {
                            if (typeof data[name + "_array_all"].length !== 'undefined') {
                                arr = data[name + "_array_all"];
                                for (var ia = 0; ia < arr.length; ia++) {
                                    var va = arr[ia];
                                    self.ui[name].addToken(va);
                                }
                            }
                        }
                        break;
                    case "selectBox":
                        if (data[name] == null) {
                            continue;
                        }
                        self.ui[name].setValue(data[name]);
                        break;
                    case "dateField":
                        if (data[name] == null) {
                            continue;
                        }
                        self.ui[name].getChildControl("textfield").setValue(data[name].toString());
                        break;
                    case "radioGroup":
                        if (data[name] == null) {
                            continue;
                        }
                        self.ui[name].setValue(data[name], data[name]);
                        break;
                }
            }
            if (typeof data["widget_dates"] !== 'undefined' && data["widget_dates"] !== null) {
                if (self.containerDateTool) {
                    self.containerDateTool.switchDateType(data["widget_dates"]);
                }
            }
        }
        ,
        /*
         * An alias to getFiltersData
         * @returns {array}
         */
        getRecord: function getRecord() {
            return this.getFiltersData();
        }
        ,
        /**
         * Return all the data of filters
         * @return {Array} the filters data
         */
        getFiltersData: function getFiltersData() {
            var self = this;
            var filters = self.filters;
            var r = {};
            if (filters == null) {
                return;
            }
            for (var i = 0; i < filters.length; i++) {
                var name = filters[i].name;
                switch (filters[i].type) {
                    case "tokenField":
                        if (typeof self.ui[name].getSelection()[0] == "undefined") {
                            r[name] = null;
                            r[name + "_text"] = null;
                        } else {
                            r[name] = self.ui[name].getSelection()[0].getModel().$$user_id;
                            r[name + "_text"] = self.ui[name].getSelection()[0].getModel().$$user_nombre;
                        }
                        break;
                    case "selectTokenField":
                        var arr = self.ui[name].getData();
                        if (arr == null) {
                            r[name] = null;
                            r[name + "_array"] = null;
                            r[name + "_array_all"] = [];
                            r[name + "_text"] = null;
                        } else if (typeof arr[0] == 'undefined') {
                            r[name] = null;
                            r[name + "_array"] = null;
                            r[name + "_array_all"] = [];
                            r[name + "_text"] = null;
                        } else {
                            r[name] = arr[0]["id"];
                            r[name + "_array"] = arr[0];
                            r[name + "_array_all"] = arr;
                            r[name + "_text"] = arr[0]["nombre"];
                        }
                        break;
                    case "selectListCheck":
                        var arr = self.ui[name].getData();
                        if (arr == null) {
                            r[name] = null;
                            r[name + "_array"] = null;
                            r[name + "_array_all"] = [];
                            r[name + "_text"] = null;
                        } else if (typeof arr[0] == 'undefined') {
                            r[name] = null;
                            r[name + "_array"] = null;
                            r[name + "_array_all"] = [];
                            r[name + "_text"] = null;
                        } else {
                            r[name] = arr[0]["id"];
                            r[name + "_array"] = arr[0];
                            r[name + "_array_all"] = arr;
                            r[name + "_text"] = arr[0]["nombre"];
                        }
                        break;
                    case "textArea":
                        r[name] = self.ui[name].getValue();
                        break;
                    case "spinner":
                        r[name] = self.ui[name].getValue();
                        break;
                    case "passwordField":
                        r[name] = self.ui[name].getValue();
                        break;
                    case "checkBox":
                        r[name] = self.ui[name].getValue();
                        break;
                    case "textField":
                        r[name] = self.ui[name].getValue();
                        //self.ui[name].saveValue(name);
                        break;
                    case "money":
                        r[name] = self.ui[name].getValue();
                        //self.ui[name].saveValue(name);
                        break;
                    case "selectBox":
                        if (!self.ui[name].isSelectionEmpty()) {
                            var selection = self.ui[name].getSelection();
                            r[name + "_label"] = selection[0].getLabel();
                            r[name] = selection[0].getModel();
                        } else {
                            r[name + "_label"] = "";
                            r[name] = "";
                        }
                        break;
                    case "dateField":
                        r[name + "_label"] = self.ui[name].getChildControl("textfield").getValue();
                        r[name] = self.ui[name].getChildControl("textfield").getValue();
                        break;
                    case "dateTimeField":
                        r[name + "_label"] = self.ui[name].getChildControl("textfield").getValue();
                        r[name] = self.ui[name].getChildControl("textfield").getValue();
                        break;
                    case "radioGroup":
                        if (!self.ui[name].isSelectionEmpty()) {
                            var selection = self.ui[name].getSelection();
                            r[name] = selection[0].getModel();
                        } else {
                            r[name] = "";
                        }
                        break;
                }
            }

            if (self.containerDateTool) {
                r["widget_dates"] = self.containerDateTool.getSelectedType();
            }

            r["count"] = self.ui["maxRowsField"].getValue();
            r["page"] = self.ui["page"].getValue();
//            r["sort"] = self.ui["order_by"].getValue();
            r["export"] = self.__exportDataVar;
            r["part"] = self.getAppWidgetName();
            if (typeof self.ui["specialDownload"] != 'undefined') {
                r["special"] = self.ui["specialDownload"].getValue();
            }
            try {
                r["sorted"] = self.table.getTableModel().getSortColumnIndex();
                r["sorted_name"] = self.columnNameFromIndex(r["sorted"]);
                r["sorted_method"] = self.table.getTableModel().isSortAscending();
            } catch (e) {
                r["sorted"] = "";
                r["sorted_name"] = "";
                r["sorted_method"] = "";
            }
            try {
                if (self.__exportDataVar) {
                    //r["noExport"] = qxnw.local.getData("saveNoExportColumns" + self.getAppWidgetName());
                    r["exportCols"] = qxnw.local.getData("saveExportColumns" + self.getAppWidgetName());
                }
            } catch (e) {
                qxnw.utils.error(e, self);
            }
            try {
                r["rowHeight"] = self.table.getRowHeight();
            } catch (e) {

            }
            try {
                r["subfilters"] = self.table.getAllSubFilters();
            } catch (e) {
                r["subfilters"] = "";
            }

            if (self.__getQuery === true) {
                r["getQuery"] = true;
            }

            return r;
        }
        ,
        onlyPopulate: function onlyPopulate(arr) {
            //TODO: en revisión
            this.table.setTableModel(this.model);
            this.model.setData(this.objectToArrayOnColumns(arr));
            this.table.changeFilterRows();
        }
        ,
        isSelectedId: function isSelectedId() {
            //NOT READY FOR PRODUCTION
            //            var self = this;
            //            var cols = self.table.getTableColumnModel().getVisibleColumns();
            //            var colsCount = self.table.getTableColumnModel().getOverallColumnCount();
            return 0;
        }
        ,
        /**
         * Create de search button or another buttons 
         * @return {void}
         */
        createButtonSearch: function createButtonSearch() {
            var self = this;
            self.buttonSearch = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("dialog-apply"));

            self.buttonSearch.setShow("icon");
            self.buttonSearch.setAllowGrowX(false);
            self.containerFilters.add(self.buttonSearch, {
                flex: 0
            });
            self.__spacer = new qx.ui.core.Spacer(30, 40);
            self.containerFilters.add(self.__spacer, {
                flex: 1
            });
            self.ui["searchButton"] = self.buttonSearch;

            var minimizeOptionsButton = new qx.ui.toolbar.Button(self.tr("Filtros"), qxnw.config.execIcon("view-restore")).set({
                maxWidth: 20,
                maxHeight: 20,
                show: "icon"
            });
            self.minimizeOptionsButton = minimizeOptionsButton;
            minimizeOptionsButton.setToolTip(self.__toolTipsManager("minimizeFilters"));
            minimizeOptionsButton.addListener("click", function () {
                var state = this.getUserData("stateAll");
                if (state === "minimized") {
                    self.containerFilters.setVisibility("visible");
                    self.containerFilters.addBefore(this, self.ui["searchButton"]);
                    if (!self.haveMinimizedTools()) {
                        self.__leftOptionsContainer.setMaxWidth(0);
                    }
                    qxnw.utils.removeBorders(this);
                    this.setShow("icon");
                    this.setIcon(qxnw.config.execIcon("view-restore"));
                    this.setUserData("stateAll", "maximized");
                } else {
                    self.addToLeftOptions(this);
                    self.containerFilters.setVisibility("excluded");
                    this.setIcon(qxnw.config.execIcon("view-fullscreen"));
                }
                self.saveFooterToolbarSettings();
            });
            self.ui["minimizeFiltersButton"] = minimizeOptionsButton;
            self.containerFilters.addBefore(self.ui["minimizeFiltersButton"], self.ui["searchButton"]);

            var conf = self.__getStoredConfiguration();
            if (conf != null) {
                if (typeof conf["minimize_container_filters"] != 'undefined') {
                    if (conf["minimize_container_filters"] != null) {
                        if (conf["minimize_container_filters"] == true) {
                            self.addToLeftOptions(self.ui["minimizeFiltersButton"]);
                            self.containerFilters.setVisibility("excluded");
                            self.ui["minimizeFiltersButton"].setIcon(qxnw.config.execIcon("view-fullscreen"));
                        }
                    }
                }
            }

            //PARA DEVOLVER CTRL+TAB AL LUGAR DONDE ESTABA
            self.ui["searchButton"].setFocusParent = function (parent) {
                this.__parentFocus = parent;
            };
            self.ui["searchButton"].getFocusParent = function () {
                return this.__parentFocus;
            };
            self.ui["searchButton"].addListener("execute", function (e) {
                self.__focusTablePaneScroll = false;
                if (typeof this.__parentFocus != 'undefined' && typeof this.__parentFocus != null) {
                    try {
                        this.__parentFocus.focus();
                    } catch (e) {
                        qxnw.utils.nwconsole(e);
                    }
                }
            });
            self.buttonSearch.setTabIndex(qxnw.config.getActualTabIndex());
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
            try {
                qxnw.local.storeClassColumnsData(self.getAppWidgetName() + "_list", self.__columnDataWidth);
            } catch (exc) {
                //qxnw.utils.error(exc, self);
            }
        },
        storeSortedColumn: function storeSortedColumn(e) {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            var data = e.getData();
            var newData = {};
            newData["sorted_column"] = data.columnIndex;
            newData["sorted_ascending"] = data.ascending;
            try {
                qxnw.local.storeData(self.getAppWidgetName() + "_list_sorted", newData);
            } catch (exc) {
                //qxnw.utils.error(exc, self);
            }
        },
//        setMaxHeight: function setMaxHeight(val) {
//            console.log("enter!");
//            this.masterContainer.setMaxHeight(val);
//            this.masterContainer.setMinHeight(val);
//        },
        verifyColumnType: function verifyColumnType() {
            var self = this;
            var columns = self.allColumnsData;
            var tcm = self.table.getTableColumnModel();
            var heigthAumented = false;
            var numberAumented = 0;
            var rowHeight = false;
            var haveSearch = false;
            var haveButtonHeader = false;

            self.table.setBlockHeaderUpdate(true);

            var currency = "$ ";
            var locale = self.getLocale();
            if (locale !== null && typeof locale.currency !== 'undefined' && locale.currency !== null && locale.currency !== "") {
                currency = locale.currency.concat(" ");
            }

            for (var i = 0; i < columns.length; i++) {

                var mode = columns[i].mode;

                var search = false;
                var buttonHeader = false;

                var colorHeader = "";

                if (typeof columns[i].colorHeader != 'undefined') {
                    colorHeader = columns[i].colorHeader;
                    if (colorHeader != "") {
                        var newColor = {
                            col: typeof columns[i].caption != 'undefined' ? columns[i].caption : columns[i].name,
                            color: colorHeader
                        };
                        if (qxnw.utils.searchIntoArrayByKey(self.__colorHeaders, newColor.col, "col") == false) {
                            self.__colorHeaders.push(newColor);
                        }
                    }
                }

                if (typeof columns[i].search != 'undefined') {
                    search = columns[i].search;
                    if (haveSearch == false) {
                        haveSearch = search;
                    }
                }
                if (typeof columns[i].buttonHeader != 'undefined') {
                    buttonHeader = columns[i].buttonHeader;
                    if (haveButtonHeader == false) {
                        haveButtonHeader = buttonHeader;
                    }
                }

                if (typeof mode != 'undefined' && mode != null && mode != '') {
                    var splMode = mode.split(".");
                    for (var ia = 0; ia < splMode.length; ia++) {
                        if (splMode[ia] == "money" || splMode == "numeric") {
                            self.types[i] = splMode[ia];
                            columns[i].type = splMode[ia];
                            break;
                        }
                    }
                }
                //SE AUMENTA EL HEIGHT SI UN LABEL TIENE MÁS DE 40 CARACTERES
                var label = "";

                var addition = 0;

                if (search == true || haveSearch == true) {
                    addition = 13;
                }

                var heigthHeader = addition + 32;
                if (qx.core.Environment.get("browser.name") == "ie") {
                    heigthHeader = addition + 35;
                }
                if (typeof columns[i].label != 'undefined' && columns[i].label != null) {
                    label = columns[i].label.replace("<b style='color:red'>*</b>", "");
                }
                if (typeof columns[i].visible != 'undefined') {
                    if (columns[i].visible == "false" || columns[i].visible === false) {
                        self.hideColumn(columns[i].caption);
                    }
                }

                if (label.length > 20 && !heigthAumented && search == false) {
                    self.table.setHeaderCellHeight(heigthHeader);
                    heigthAumented = true;
                    numberAumented = heigthHeader;
                } else if (search == true && !heigthAumented) {
                    if (typeof self.table != 'undefined') {
                        self.table.setHeaderCellHeight(heigthHeader);
                        heigthAumented = true;
                        numberAumented = heigthHeader;
                    }
                } else if (haveSearch == true && numberAumented < heigthHeader) {
                    if (typeof self.table != 'undefined') {
                        self.table.setHeaderCellHeight(heigthHeader);
                        heigthAumented = true;
                        numberAumented = heigthHeader;
                    }
                } else if (haveButtonHeader == true && heigthAumented == false) {
                    if (typeof self.table != 'undefined') {
                        self.table.setHeaderCellHeight(heigthHeader);
                        heigthAumented = true;
                        numberAumented = heigthHeader;
                    }
                }

                if (typeof columns[i].sortable != 'undefined') {
                    if (columns[i].sortable == "false" || columns[i].sortable === false) {
                        self.model.setColumnSortable(i, false);
                    }
                }

                if (typeof columns[i].tooltipHeader != 'undefined') {
                    self.__toolTipColumns.push(columns[i]);
                }
                switch (self.types[i]) {
                    case "no_html":
                        var htmlRender = new qx.ui.table.cellrenderer.Html();
                        tcm.setDataCellRenderer(i, htmlRender);
                        break;
                    case "button":
                        var imageRender = new qxnw.cellrenderer.image(width, height);
                        tcm.setDataCellRenderer(i, imageRender);
                        break;
                    case "html":
                        var htmlRender = new qx.ui.table.cellrenderer.Html();
                        tcm.setDataCellRenderer(i, htmlRender);
                        break;
                    case "boolean":
                        var htmlRender = new qx.ui.table.cellrenderer.Boolean();
                        tcm.setDataCellRenderer(i, htmlRender);
                        break;
                    case "passwordField":
                        var htmlRender = new qx.ui.table.cellrenderer.Password();
                        tcm.setDataCellRenderer(i, htmlRender);
                        break;
                    case "checkBox":
                        var htmlRender = new qx.ui.table.cellrenderer.Boolean();
                        tcm.setDataCellRenderer(i, htmlRender);
                        break;
                    case "numeric":
                        var numberRender = new qx.ui.table.cellrenderer.Number();
                        var numberFormat = new qx.util.format.NumberFormat();
                        numberFormat.set({
                            minimumFractionDigits: 2,
                            groupingUsed: true
                        });
                        numberRender.setNumberFormat(numberFormat);
                        tcm.setDataCellRenderer(i, numberRender);
                        break;
                    case "integer":
                        var numberRender = new qx.ui.table.cellrenderer.Number();
                        tcm.setDataCellRenderer(i, numberRender);
                        break;
                    case "percent":
                        var numberRender = new qx.ui.table.cellrenderer.Number();
                        var numberFormat = new qx.util.format.NumberFormat().set({
                            postfix: "%",
                            maximumFractionDigits: 2
                        });
                        numberRender.setNumberFormat(numberFormat);
                        tcm.setDataCellRenderer(i, numberRender);
                        break;
                    case "money":
                        var numberRender = new qx.ui.table.cellrenderer.Number();
                        var numberFormat = new qx.util.format.NumberFormat().set({
                            prefix: currency,
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
                    case "image":
                        //                        if (!rowHeight) {
                        //                            rowHeight = true;
                        //                            self.table.setRowHeight(100);
                        //                        }                         
                        var height = 100;
                        var width = 100;
                        var modePhpthumb = false;
                        var repeat = false;
                        var haveSizes = false;
                        var haveActionOnClick = false;
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
                                                haveActionOnClick = true;
                                            } catch (e) {

                                            }
                                        }
                                    } else if (arrMode[0] == "phpthumb") {
                                        modePhpthumb = true;
                                        haveActionOnClick = true;
                                    } else if (arrMode[0] == "expand") {
                                        repeat = true;
                                        haveActionOnClick = true;
                                    }
                                }
                            }
                        }
                        if (haveSizes == false && repeat == false) {
                            width = false;
                            height = false;
                        } else {
                            repeat = true;
                            self.table.setRowHeight(height + 10);
                        }
                        var isPhpThumb = false;
                        if (modePhpthumb) {
                            width = 100;
                            height = 100;
                            self.table.setRowHeight(height + 10);
                            isPhpThumb = true;
                        }
                        var imageRender = new qxnw.cellrenderer.image(width, height, isPhpThumb);
                        if (repeat) {
                            imageRender.setRepeat("scale");
                        }
                        if (haveActionOnClick == true) {
                            self.__columnsImages.push(i);
                        }
                        tcm.setDataCellRenderer(i, imageRender);
                        break;
                    case "uploader":
                        //                        if (!rowHeight) {
                        //                            rowHeight = true;
                        //                            self.table.setRowHeight(100);
                        //                        }   
//                        var htmlRender = new qx.ui.table.cellrenderer.Html();
//                        tcm.setDataCellRenderer(i, htmlRender);
                        var height = 100;
                        var width = 100;
                        self.table.setRowHeight(height + 10);
                        var imageRender = new qxnw.cellrenderer.image(width, height, false);
                        imageRender.setRepeat("scale");
                        self.__columnsImages.push(i);
                        tcm.setDataCellRenderer(i, imageRender);
                        break;
                    case "camera":
                        //                        var imageRender = new qx.ui.table.cellrenderer.Html();
                        //                        tcm.setDataCellRenderer(i, imageRender);
                        //                        self.table.setRowHeight(80);                         
                        var height = 100;
                        var width = 100;
                        var modePhpthumb = false;
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
                                            } catch (e) {

                                            }
                                        }
                                    } else if (arrMode[0] == "phpthumb") {
                                        modePhpthumb = true;
                                    }
                                }
                            }
                        }
                        self.table.setRowHeight(height);
                        var imageRender;
                        if (modePhpthumb) {
                            imageRender = new qxnw.cellrenderer.image(width, height);
                        } else {
                            imageRender = new qx.ui.table.cellrenderer.Image(width, height);
                            imageRender.setRepeat("scale");
                        }
                        self.__columnsImages.push(i);
                        tcm.setDataCellRenderer(i, imageRender);
                        break;
                    case "dateField":
                        tcm.setHeaderCellRenderer(i, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", ""));
                        var dateRender = new qxnw.cellrenderer.date("left");
                        tcm.setDataCellRenderer(i, dateRender);
                        break;
                    case "dateTimeField":
                        tcm.setHeaderCellRenderer(i, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", ""));
                        var dateRender = new qxnw.cellrenderer.dateTime("left");
                        //var dateRender = new qx.ui.table.cellrenderer.Date("left");
                        tcm.setDataCellRenderer(i, dateRender);
                        break;
                    case "date":
                        tcm.setHeaderCellRenderer(i, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", ""));
                        var dateRender = new qx.ui.table.cellrenderer.Date("left");
                        //var DateFormat = new qx.util.format.DateFormat("Y-m-d");
                        //dateRender.setDateFormat(DateFormat);
                        tcm.setDataCellRenderer(i, dateRender);
                        break;
                    case "semaphore":
                        tcm.setHeaderCellRenderer(i, new qx.ui.table.headerrenderer.Icon(qxnw.config.execIcon("green", "qxnw")), "");
                        var imageRender = new qxnw.cellrenderer.image(16, 16, false);
                        tcm.setDataCellRenderer(i, imageRender);
                        break;
                }
                if (self.types[i] != "dateField" && search == true) {
                    tcm.setHeaderCellRenderer(i, new qxnw.table.headRender);
                } else if (self.types[i] != "dateField" && buttonHeader == true) {
                    tcm.setHeaderCellRenderer(i, new qxnw.table.headRenderButton);
                }
            }
            self.table.setBlockHeaderUpdate(false);
        },
        getDefaultDateFormatter: function getDefaultDateFormatter() {
            var format = qx.locale.Date.getDateFormat("medium").toString();
            if (format == this.__dateFormat) {
                return this.__formatter;
            }
            if (this.__formatter) {
                this.__formatter.dispose();
            }
            this.__formatter = new qx.util.format.DateFormat(format, qx.locale.Manager.getInstance().getLocale());
            this.__dateFormat = format;
            return this.__formatter;
        },
        /*
         * An alias for the method setColumns
         * @param columns {Array}
         * @returns {void}
         */
        createColumns: function createColumns(columns) {
            this.setColumns(columns);
        },
        /**
         * Set the columns of a list. i.e 
         * <pre class='javascript'>
         * var columns = [
         * {
         * label : "ID",
         * caption : "id"
         * },
         * {
         * label : "Nombre",
         * caption : "nombre"
         * }];
         * this.setColumns(columns);
         * </pre>
         * @param columns {Array} the columns array
         * @returns {void}
         */
        setColumns: function setColumns(columns) {
            var self = this;
            if (typeof self.table == 'undefined' || self.table == null) {
                return;
            }
            //TODO: TESTING FIX VISX
            self.__visibleColumns = [];
            self.table.resetCellFocus();
            self.columns = [];
            self.captions = [];
            for (var i = 0; i < columns.length; i++) {
                var label = columns[i].label;
                if (typeof label !== 'undefined') {
                    if (typeof label.classname !== 'undefined') {
                        if (label.classname === "qx.locale.LocalizedString") {
                            if (label.getMessageId() === "") {
                                label = "";
                            }
                        }
                    }
                }
                if (typeof columns[i].required !== 'undefined') {
                    if (columns[i].required === true || columns[i].required === 'true') {
                        qxnw.utils.replaceAll(columns[i].label, "<b style='color:red'>*</b>", "");
                        var asterisk = "<b style='color:red'>*</b>";
                        columns[i].label = columns[i].label + asterisk;
                        label = columns[i].label;
                    }
                }

                self.columns[i] = label.replace("_", " ");

                columns[i].label = self.columns[i];

                self.captions[i] = columns[i].caption;
                self.captions[i] = qxnw.utils.cleanHtml(self.captions[i]);

                if (self.getNormalizeColumns() === true) {
                    self.captions[i] = qxnw.utils.replaceAll(self.captions[i], " ", "_");
                }

                columns[i].caption = self.captions[i];

                if (typeof columns[i].type !== 'undefined') {
                    self.types[i] = columns[i].type;
                } else {
                    self.types[i] = null;
                }
                if (columns[i].mode == "toolTip") {
                    try {
                        self.startToolTip();
                    } catch (e) {
                        qxnw.utils.error(e);
                    }
                }
            }

            self.allColumnsData = columns;

            self.fireEvent("loadedTable");
            self.createModel();
            self.startTimer();
            if (self.isVisible()) {
                self.populateTotalColumns();
            } else {
                self.addListener("appear", function () {
                    if (typeof self.__toolParent == 'undefined' || self.__toolParent == null) {
                        if (!self.__isPopulated) {
                            self.populateTotalColumns();
                        }
                    }
                });
            }
        },
        getModel: function getModel() {
            return this.model;
        },
        columnHaveTooltip: function columnHaveTooltip(colId) {
            for (var i = 0; i < this.__toolTipColumns.length; i++) {
                if (this.__toolTipColumns[i].tooltipHeader != 'undefined') {
                    if (colId == this.__toolTipColumns[i].caption) {
                        return this.__toolTipColumns[i];
                    }
                }
            }
            return false;
        },
        populateColumnColorsRetarded: function populateColumnColorsRetarded() {
            var self = this;
            var t = new qx.event.Timer(100);
            t.start();
            t.addListener("interval", function (e) {
                this.stop();
                self.populateColumnColors();
            });
        },
        populateColumnColors: function populateColumnColors() {
            var self = this;
            try {
                if (self.__colorHeaders.length > 0) {
                    var reCheck = self.table.getMetaColumnCounts();
                    for (var ia = 0; ia < reCheck.length; ia++) {
                        var pane = self.table.getPaneScroller(ia).getHeader();
                        var model = self.table.getTableModel();
                        for (var i = 0; i < self.__colorHeaders.length; i++) {
                            var index = model.getColumnIndexById(self.__colorHeaders[i].col);
                            var headerColumn = pane.getHeaderWidgetAtColumn(index);
                            if (typeof headerColumn == 'undefined') {
                                continue;
                            }
                            var label = headerColumn.getLabel();
                            label = label.replace("<div id='div_" + i + "' color='" + self.__colorHeaders[i].color + "'></div>", "");
                            label = self.cleanColorHeaders(label);
                            label = label + "<div id='div_" + i + "' color='" + self.__colorHeaders[i].color + "'></div>";
                            model.setColumnName(index, label);
                            var element = headerColumn.getContentElement().getDomElement();
                            if (element != null) {
                                qx.bom.element.Style.set(element, "background", self.__colorHeaders[i].color);
                            }
                        }
                    }
                }
            } catch (e) {
                qxnw.utils.error(e, self);
            }
        },
        actionsOnMetaDataChanged: function actionsOnMetaDataChanged() {
            var self = this;
            var columns = self.table.getTableColumnModel().getVisibleColumns();
            var paneHeaderWidget = self.table.getPaneScroller(0).getHeader();
            for (var i = 0; i < columns.length; i++) {
                var idCol = self.table.getTableModel().getColumnId(columns[i]);
                var haveTooltip = self.columnHaveTooltip(idCol);
                if (haveTooltip != false) {
                    var headerColumnWidget = paneHeaderWidget.getHeaderWidgetAtColumn(columns[i]);
                    if (typeof headerColumnWidget === 'undefined' || headerColumnWidget === null) {
                        return;
                    }
                    if (headerColumnWidget.getToolTip() == null) {
                        var toolTip = new qx.ui.tooltip.ToolTip(haveTooltip.tooltipHeader);
                        headerColumnWidget.setToolTip(toolTip);
                        qxnw.utils.addClass(headerColumnWidget, "nw_table_tooltip_header");
                        qx.util.DisposeUtil.disposeTriggeredBy(toolTip, headerColumnWidget);
                    } else {
                        headerColumnWidget.getToolTip().setValue(haveTooltip.tooltipHeader);
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
        createModel: function createModel() {
            var self = this;
            self.model = new qxnw.table.modelFiltered();
            self.model.setParent(self);

            self.model.setColumns(self.columns, self.captions);
            self.model.getToolTip = function (column, row) {
                if (column >= 0 && row >= 0) {
                    try {
                        return this.getValue(column, row);
                    } catch (e) {
                        return null;
                    }
                }
            };
            self.table.setTableModel(self.model);

            self.table.addListener("appear", function () {
                qx.bom.element.Class.add(self.table.getContentElement().getDomElement(), "table_list_qxnw");
//                qx.bom.element.Class.add(self.table.getTableColumnModel().getContentElement().getDomElement(), "columns_list_qxnw");
            });

            //self.model.addListener("metaDataChanged", function () {
            //self.populateColumnColors();
            //});

            //TODO: ordenamiento organizado para integer y texto
            var sortNormalMethod = function (row1, row2) {
                try {
                    var a = row1[arguments.callee.columnIndex];
                    var b = row2[arguments.callee.columnIndex];

                    try {
                        a = qxnw.utils.cleanHtml(a);
                        b = qxnw.utils.cleanHtml(b);
                        a = a.replace('%', '');
                        b = b.replace('%', '');
                    } catch (e) {

                    }

                    if (typeof a == "string") {
                        a = a.toLowerCase();
                    }
                    if (typeof b == "string") {
                        b = b.toLowerCase();
                    }
                    if (isNaN(a) || isNaN(b)) {
                        if (a > b)
                            return 1;
                        else
                            return -1;
                    }
                } catch (e) {
                    qxnw.utils.error(e, self, 0, false, true);
                }
                return a - b;
            };
            var columns = self.model.getColumnCount();
            for (var i = 0; i < columns; i++) {
                self.model.setSortMethods(i, sortNormalMethod);
            }

            var maxRows = parseInt(self.getMaxShowRows());
            if (maxRows == null || isNaN(maxRows)) {
                maxRows = parseInt(qxnw.config.getMaxShowRows());
            }
            self.maxRows.setValue(maxRows);
            //self.table.setTheStoredVisibilityColumns();

            if (self.tableAuto == null) {
                self.table.applySavedConfigurations();
            }

            self.verifyColumnType();
            self.renderColorsCells();

            if (self.__columnEditable) {
                var columns = self.model.getColumnCount();
                for (var i = 0; i < columns; i++) {
                    self.table.getTableModel().setColumnEditable(i, true);
                    self.table.getTableColumnModel().setCellEditorFactory(i, new qxnw.widgets.selectTokenField.cellEditorFactory());
                }
            }

            if (self.__columnsImages.length > 0) {
                if (self.__idListenerCellTap != null) {
                    try {
                        self.table.removeListenerById(self.__idListenerCellTap);
                    } catch (e) {
                        qxnw.utils.bindError(e, this, 0, true, false);
                    }
                }
                self.__idListenerCellTap = self.table.addListener("cellTap", function (e) {
                    var col = e.getColumn();
                    if (self.__columnsImages.indexOf(col) != -1) {
                        var row = e.getRow();
                        var value = self.model.getValue(col, row);
                        //TODO: por probar bien: && e.getButton() == "left"
                        if (value != null && value != "") {
                            var dispExts = qxnw.config.getImagesExtensions();
                            var imgExt = value.split('.').pop();
                            if (dispExts.includes(imgExt)) {
                                var f = new qxnw.forms();
                                f.setModal(true);
                                f.setWidth(800);
                                f.setHeight(700);
                                f.setTitle(self.tr("Visor de imágenes :: QXNW "));
                                var c = new qxnw.widgets.imageViewer();
                                c.addListener("imageData", function (rta) {
                                    var r = rta.getData();
                                    if (r != false) {
                                        f.setHeight(r.height + 80);
                                        f.setWidth(r.width + 10);
                                    }
                                });
                                c.addListener("createdToolBar", function (rta) {
                                    var r = rta.getData();
                                    if (r == true) {
                                        f.add(c.getToolBar(), {
                                            flex: 0
                                        });
                                    }
                                });
                                c.setValue(encodeURI(value));
                                self.contain = c.createToolBar();
                                f.masterContainer.add(self.contain);
                                f.masterContainer.add(c);
                                f.center();
                                f.show();
                            } else {
                                var first = value.charAt(0);
                                if (first === "/") {
                                    value = qxnw.utils.getProtocol() + '//' + location.hostname + value;
                                }
                                value = encodeURI(value);
                                if (qxnw.utils.checkImageExists(value) === false) {
                                    qxnw.utils.information(self.tr("La imagen no fue encontrada"));
                                    return;
                                }
                                var link = document.createElement('a');
                                link.href = value;
                                link.download = value;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }
                        }
                    }
                });
            }
            //var end = new Date().getTime();
            //var time = end - start;
            //console.log("Tiempo despues:" + (time / 1000));
        },
        renderColorsCellsFonts: function renderColorsCellsFonts() {
            var self = this;
            var sd = qxnw.local.getData(self.getAppWidgetName() + "_colors");
            if (sd == null) {
                return;
            }
            sd.sort();
            var oldColumn = null;
            var data = Array();
            for (var i = 0; i < sd.length; i++) {
                if (i == 0) {
                    oldColumn = sd[i].column;
                }
                data.push(sd[i]);
                if (sd[i].type == "Sólo letra" || sd[i].type == "" || sd[i].type == null) {
                    if (sd[i].column == oldColumn && i + 1 == sd.length) {
                        self.addConditionalColorColumn(sd[i].column, data);
                    } else {
                        self.addConditionalColorColumn(sd[i].column, data);
                    }
                    oldColumn = sd[i].column;
                }
            }
            self.setColorsRendererId(sd.length);
        },
        renderColorsCells: function renderColorsCells() {
            var self = this;
            var sd = qxnw.local.getData(self.getAppWidgetName() + "_colors");
            var render = new qxnw.rowRenderer(self);
            if (sd == null) {
                render.restoreNormalValues();
                self.table.setDataRowRenderer(render);
                self.table.updateContent();
                return;
            }
            sd.sort();
            //RENDER QUE QUEDA MUY BUENO
            for (var i = 0; i < sd.length; i++) {
                render.setHandleData(self.columnIndexFromName(sd[i].column), sd[i].value, sd[i].color, sd[i].condition, sd[i].type);
            }
            self.table.setDataRowRenderer(render);
            self.table.updateContent();

            //self.renderColorsCellsFonts();
        },
        /**
         * Clear all selected rows
         * @return {void}
         */
        clearSelection: function clearSelection() {
            if (typeof this.table != 'undefined' && this.table != null) {
                this.table.resetSelection();
                this.table.resetCellFocus();
            } else {
                qxnw.utils.hiddenError("La tabla no está creada al usar el método clearSelection");
            }
        }
        ,
        /**
         * Set selection multiple
         * @return {void}
         */
        setSelectionMultiple: function setSelectionMultiple() {
            this.selectAllButton.set({
                enabled: true
            });
            this.table.setSelectionMultiple();
        }
        ,
        /**
         * Select all in the list
         * @return {void}
         */
        selectAll: function selectAll() {
            this.table.getSelectionModel().setSelectionInterval(0, this.model.getRowCount() - 1);
        }
        ,
        /*
         * Alias from getColumnTypeFromName
         * @param name {String} the column name
         * @returns {undefined}
         */
        getColumnTypeByName: function getColumnTypeByName(name) {
            this.getColumnTypeFromName(name);
        },
        getColumnTypeById: function getColumnTypeById(name) {
            this.getColumnTypeFromId(name);
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
        getColumnLabelFromName: function getColumnLabelFromName(name) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].caption == name) {
                    if (typeof columns[i].label != 'undefined') {
                        return columns[i].label;
                    } else {
                        return "";
                    }
                }
            }
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
        getColumnTypeFromColumn: function getColumnTypeFromColumn(column, row) {
            var self = this;

            if (typeof row != 'undefined') {
                if (self.__columnTypesSetted.length > 0) {
                    for (var i = 0; i < self.__columnTypesSetted.length; i++) {
                        var r = self.__columnTypesSetted[i];
                        if (r["col"] == column) {
                            if (r["row"] == row) {
                                return r["method"];
                            }
                        }
                    }
                }
            }

            var columns = self.allColumnsData;
            var colModel = self.table.getTableModel();
            var colNum = colModel.getColumnCount();
            var tableModel = self.table.getTableModel();
            //TODO: REVISAR FUNCIONALIDAD CON UPLOADERS URGENTE!
            for (var i = 0; i <= colNum; i++) {
                if (i == column) {
                    var colId = tableModel.getColumnId(i);
                    for (var ia = 0; ia < columns.length; ia++) {
                        if (columns[ia].caption == colId) {
                            return columns[ia].type;
                        }
                    }
                }
            }
        },
        getColumnIdFromIndex: function getColumnIdFromIndex(index) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                if (i === index) {
                    var c = columns[i].caption;
                    return c;
                }
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
        objectToArrayOnColumns: function objectToArrayOnColumns(obj) {
            var self = this;
            if (obj == null) {
                return;
            }
            var cols = new Array();
            var data = new Array();
            for (var i = 0; i < obj.length; i++) {
                var count = 0;
                var dat = [];
                for (cols in obj[i]) {
                    var type = self.getColumnTypeFromId(cols);
                    if (cols == "id" || type == "integer" || type == "money" || type == "numeric") {
                        dat[qxnw.utils.lowerFirst(self.columnIndexFromName(cols))] = obj[i][cols] == null ? "" : parseFloat(obj[i][cols] == "" ? 0 : obj[i][cols]);
                    } else if (type == "numeric") {
                        dat[qxnw.utils.lowerFirst(self.columnIndexFromName(cols))] = obj[i][cols] == null ? "" : obj[i][cols];
                    } else if (type == "semaphore") {
                        var valRow = obj[i][cols];
                        if (valRow === true) {
                            valRow = qxnw.config.execIcon("green", "qxnw");
                        } else if (valRow == true) {
                            valRow = qxnw.config.execIcon("green", "qxnw");
                        } else if (valRow === 'true') {
                            valRow = qxnw.config.execIcon("green", "qxnw");
                        } else if (valRow === 'SI') {
                            valRow = qxnw.config.execIcon("green", "qxnw");
                        } else if (valRow === 'si') {
                            valRow = qxnw.config.execIcon("green", "qxnw");
                        } else if (valRow === 't') {
                            valRow = qxnw.config.execIcon("green", "qxnw");
                        } else if (valRow > 1) {
                            valRow = qxnw.config.execIcon("green", "qxnw");
                        } else {
                            valRow = qxnw.config.execIcon("red", "qxnw");
                        }
                        dat[qxnw.utils.lowerFirst(self.columnIndexFromName(cols))] = valRow;
                    } else {
                        dat[qxnw.utils.lowerFirst(self.columnIndexFromName(cols))] = obj[i][cols] == null ? "" : obj[i][cols];
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
                        if (type == "html") {
                            var tmp = document.createElement("DIV");
                            tmp.innerHTML = obj[i][cols];
                            var txt = tmp.textContent || tmp.innerText || "";
                            var w = txt.length;
                            tmp = null;
                            txt = null;
                        } else {
                            var w = (typeof obj[i][cols] != 'undefined' && obj[i][cols] != null) ? obj[i][cols].toString().length : 0;
                        }
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
        __handleExecPages: function __handleExecPages(settings) {
            var self = this;
            if (typeof settings.recordsPerPage != 'undefined') {
                self.ui["maxRowsField"].setValue(parseInt(settings.recordsPerPage));
                if (self.__containerPagination == null) {
                    return;
                }
                self.__containerPagination.setVisibility("visible");
            }
            if (typeof settings.currentPage != 'undefined') {
                self.ui["page"].setValue(parseInt(settings.currentPage));
            }
            if (typeof settings.pageCount != 'undefined') {
                if (settings.pageCount > settings.currentPage) {
                    self.ui["page"].setMaximum(parseInt(settings.pageCount));
                } else {
                    self.ui["page"].setMaximum(parseInt(settings.currentPage));
                }
                self.__maxPages = settings.pageCount;
                self.ui["labelTotalPags"].setValue(self.tr("Total páginas: ") + "<b>" + settings.pageCount + "</b>");
            }
            if (typeof settings.recordCount != 'undefined') {
                self.setTotalListRecords(settings.recordCount);
                self.addInformation("<b>Total registros: " + settings.recordCount.toString() + "</b>", "totalRecords");
            }
        }
        ,
        isShowingPagination: function isShowingPagination() {
            var self = this;
            if (self.__containerPagination.getVisibility() == "visible") {
                return true;
            } else {
                return false;
            }
        }
        ,
        /** Set the data in the lists.
         * @param data {Array} the data array
         * @param noFunction {Boolean} the data array
         * @return {Boolean} if the process is sucessfull
         */
        setModelData: function setModelData(data, noFunction) {
            var self = this;

            if (typeof data == 'undefined' || data == null) {
                return;
            }

            if (typeof data.getQuery !== 'undefined' && data.getQuery !== false) {
                self.__queryLoaded = data.getQuery;
                self.fireEvent("returnModelDataQuery");
                return;
            }

            if (typeof self.ui.updateButton != "undefined" && !self.ui.updateButton.isEnabled()) {
                try {
                    self.ui.updateButton.setEnabled(true);
                } catch (e) {

                }
            }
            var settings = {
                currentPage: data.currentPage,
                recordsPerPage: data.recordsPerPage,
                pageCount: data.pageCount,
                recordCount: data.recordCount
            };
            try {
                if (typeof data.exportId != 'undefined') {
                    if (data.exportId != "") {
                        if (data.exportId != null) {
                            if (typeof data.exportKey != 'undefined') {
                                if (typeof data.exportKey != "") {
                                    if (typeof data.exportKey != null) {
                                        //                                        if (qx.core.Environment.get("browser.name") == "ie" && parseInt(qx.core.Environment.get("browser.version")) <= 8) {
                                        if (qx.core.Environment.get("browser.name") == "ie") {
                                            main.isClosedApp = true;
                                            //                                            window.open("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.exportId + "&key=" + data.exportKey);  //                                            return false;
                                            window.open(window.location + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.exportId + "&key=" + data.exportKey, "ExportDataIE", "width=200, height=100");
                                        } else {
                                            main.isClosedApp = true;
                                            window.location.href = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.exportId + "&key=" + data.exportKey;
                                        }
                                        try {
                                            self.__acceptExportButton.setEnabled(true);
                                        } catch (e) {

                                        }
                                        self.__exportDataVar = false;
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
            self.__exportDataVar = false;
            self.__handleExecPages(settings);
            if (typeof data.records != 'undefined') {
                if (data.records.length > 0) {
                    data = data.records;
                }
            }
            try {
                if (typeof self.table == 'undefined' || self.table == null || self.model == null) {
                    return;
                }

                self.table.cancelEditing();
                try {
                    self.model.setData(self.objectToArrayOnColumns(data));
                } catch (e) {
                    if (qxnw.utils.isDebug()) {
                        console.log(e);
                    }
                    return;
                }
                self.table.setTableModel(self.model);
                self.table.setShowCellFocusIndicator(self.getShowCellFocusIndicator());
                self.catchFiltersValues();
                if (self.__font != null) {
                    self.table.setFont(self.__font);
                }

                self.loadMetaColumnsSaved();
                //self.calculateByColumn();
                //TODO: CAMBIO PARA RECUPERAR LA FUNCIONALIDAD SORTED

                setTimeout(function () {
                    self.table.changeFilterRows();
                    self.model.setStoredColumnSorted();
                    self.selectPreviousCell(data);
                    var areOrdered = qxnw.local.getData("nw_auto_width_" + self.getAppWidgetName());
                    if (areOrdered === null || !areOrdered) {
                        self.setAutoWidth();
                        qxnw.local.setData("nw_auto_width_" + self.getAppWidgetName(), true);
                    }
                }, 100);

            } catch (e) {
                console.log(e);
                qxnw.utils.error(e, data);
            }
            if (typeof noFunction == 'undefined') {
                self.tryToGetSavedFunctions();
            }
            if (self.setMaximizedDynamicTable == true) {
                self.dynamicTable(true);
            }
            self.fireEvent("returnModelData");
//            if (qxnw.utils.verifyUser(self, "andresf") === true) {
//                self.dynamicTable(true);
//            }
            return true;
        },
        loadMetaColumnsSaved: function loadMetaColumnsSaved() {
            var self = this;
            if (self.getStoredMetaColumnStatic()) {
                var conf = qxnw.local.getData(self.getAppWidgetName() + "_metaColumnIndex");
                if (conf !== null) {
                    if (conf !== null) {
                        var stored = self.getStoredMetaColumnStatic();
                        self.mantainFirstColumn.setValue(stored = stored == null ? false : stored);
                        self.__metaColumn.setValue(conf);
                        if (stored) {
                            self.table.setMetaColumnCounts([conf + 1, -1]);
                            self.populateColumnColorsRetarded();
                            if (self.metaColumnAdded != null) {
                                self.table.getPaneScroller(1).getHeader().removeListenerById(self.metaColumnAdded);
                            }
                            self.metaColumnAdded = self.table.getPaneScroller(1).getHeader().addListener("contextmenu", function (e) {
                                if (self.table.getEnabledFilters() == false) {
                                    e.stop();
                                    return;
                                }
                                self.table.createFilterForm(e);
                                e.stop();
                            }, this);
                            self.__timerMeta = null;
                        }
                    }
                }
            }
        },
        selectPreviousCell: function selectPreviousCell(data) {
            var self = this;
            if (self.__focusTablePaneScroll) {
                if (typeof self.table.getPaneScroller(0) != 'undefined') {
                    if (typeof data != 'undefined' && data.length > 0) {
                        var sm = self.table.getSelectionModel();
                        var srs = sm.getSelectedRanges();
                        var pane = self.table.getPaneScroller(0);
                        var tablePane = pane.getTablePane();
                        pane.activate();
                        tablePane.activate();
                        if (srs !== null && typeof srs.length !== 'undefined') {
                            if (typeof srs[0] !== 'undefined') {
                                if (typeof srs[0].minIndex !== 'undefined' && typeof srs[0].maxIndex !== 'undefined') {
                                    sm.setSelectionInterval(srs[0].minIndex, srs[0].maxIndex);
                                }
                            }
                        }
                    }
                }
            } else {
                if (self.focusOnModelData) {
                    self.__focusTablePaneScroll = true;
                }
            }
        },
        tryToGetSavedFunctions: function tryToGetSavedFunctions() {
            var self = this;
            var saved = qxnw.local.getData(self.getAppWidgetName() + "_functions");
            if (saved == null) {
                return;
            }
            for (var i = 0; i < saved.length; i++) {
                var r = saved[i];
                var rows = self.getAllRecords();
                var rta = self.processFunctions(r.type, r.column_name, r.columns, rows, true, r.separator);
                var newModel = rta["rows"];
                var newColumn = {
                    caption: rta["column_name"],
                    label: rta["column_name"]
                };
                var cols = self.allColumnsData.slice();
                var noExists = false;
                for (var ia = 0; ia < cols.length; ia++) {
                    var ra = cols[ia];
                    ra.label = qxnw.utils.replaceAll(ra.label, "<b style='color:red'>*</b>", "");
                    if (rta["column_name"] == ra["caption"]) {
                        noExists = true;
                    }
                }
                if (!noExists) {
                    cols.push(newColumn);
                    self.setColumns(cols);
                }
                self.onlyPopulate(newModel);
                //self.setModelData(newModel, true);
            }
            var timer = new qx.event.Timer(500);
            timer.start();
            timer.addListener("interval", function (e) {
                this.stop();
                self.populateColumnColors();
            });

            self.table.setStoredColumnsWidth();
        }
        ,
        calculateByColumn: function calculateByColumn() {
            var self = this;
            if (typeof self.__typeOfCalc == 'undefined' || self.__typeOfCalc == null || self.__typeOfCalc == '') {
                self.__typeOfCalc = "SUM";
            }
            if (self.__totalColumn != null) {
                var total = 0;
                var noPossible;
                var lblKnd;
                if (self.__typeOfCalc == "SUM") {
                    total = self.getTotalColumn();
                    noPossible = self.tr(", Total no posible para esta columna");
                    lblKnd = "Total";
                } else if (self.__typeOfCalc == "SUM_BY_COL") {
                    total = self.getTotalColumnByColumn();
                    noPossible = self.tr(", Total no posible para esta columna");
                    lblKnd = "Total";
                } else if (self.__typeOfCalc == "RECUENTO") {
                    total = self.getRecuentoByColumn();
                    noPossible = self.tr(", Recuento no posible para esta columna");
                    lblKnd = "Recuento";
                } else {
                    total = self.getPromColumn();
                    noPossible = self.tr(", Promedio no posible para esta columna");
                    lblKnd = "Promedio";
                    total = Math.round(total);
                }
                total = isNaN(parseInt(total)) ? noPossible : total;
                var prefix = ": ";
                if (isNaN(parseInt(total))) {
                    prefix = "";
                    lblKnd = "";
                    total = lblKnd + " no disponible para la columna " + self.__totalColumn;
                    self.addInformation("<b style='color: blue'>" + lblKnd + prefix + total.toString() + "</b>", "totalColumns");
                    return;
                }
                if (self.isShowingPagination()) {
                    prefix = " en esta hoja: ";
                }
                self.addInformation("<b style='color: blue'>" + lblKnd + prefix + total.toString() + "</b>", "totalColumns");
            }
        },
        /**
         * Catch the filters values and save it in the client side.
         * @return {void}
         */
        catchFiltersValues: function catchFiltersValues() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            var catched = self.getFiltersData();
            if (typeof catched == 'undefined') {
                return;
            }
            try {
                qxnw.local.storeData(self.getAppWidgetName() + "_catched_values", catched);
            } catch (e) {
                qxnw.utils.nwconsole(e, self);
            }
        },
        getAppWidgetName: function getAppWidgetName() {
            var self = this;
//            TODO: se quita porque al principio guardaba la variable null si se llamaba desde antes de instanciar su nombre 30 MAT 2016
//            if (self.getAppName() != false) {
//                return self.getAppName();
//            }
            var name = self.classname;
            if (name == "qxnw.lists") {
                name = self.getUserData("table");
            }
            if (name == null) {
                name = "qxnw.lists";
            }
            self.setAppName(name);
            return name;
        }
        ,
        /**
         * Return the stored filters values.
         * @return {Array}
         */
        getCatchedFiltersValues: function getCatchedFiltersValues() {
            var self = this;
            var filtersValues = qxnw.local.getData(self.getAppWidgetName() + "_catched_values");
            if (filtersValues == null) {
                return false;
            }
            return filtersValues;
        },
        adjustTableColumnBehavior: function adjustTableColumnBehavior(minwidth, maxwidth) {
            if (typeof minwidth == 'undefined') {
                minwidth = 10;
            }
            if (typeof maxwidth == 'undefined') {
                maxwidth = 10;
            }
            //l.table.setNewTableColumnModel(tableColumnModel);
            var tcm = this.table.getTableColumnModel();
            var resizeBehavior = tcm.getBehavior();
            resizeBehavior.set(0, {
                width: "1*",
                minWidth: minwidth,
                maxWidth: maxwidth
            });
        },
        setWidthAllColumns: function setWidthAllColumns(width) {
            var tcm = this.table.getTableColumnModel();
            var columns = tcm.getVisibleColumns();
            for (var i = 0; i < columns.length; i++) {
                tcm.setColumnWidth(i, width);
            }
        },
        isProcessFired: function isProcessFired(process) {
            if (typeof this.processFired[process] == 'undefined') {
                this.processFired[process] = true;
                return false;
            }
            return this.processFired[process];
        },
        getCurrentRow: function getCurrentRow() {
            return this.table != null ? this.table.getFocusedRow() : null;
        },
        getCurrentCol: function getCurrentCol() {
            return this.table != null ? this.table.getFocusedColumn() : null;
        },
        getCurrentColumn: function getCurrentColumn() {
            return getCurrentCol();
        },
        setCellValue: function setCellValue(col, row, val) {
            if (this.table != null) {
                this.table.getTableModel().setValue(col, row, val);
            }
        },
        getCellValue: function getCellValue(col, row) {
            if (this.table != null) {
                return this.table.getTableModel().getValue(col, row);
            }
            return false;
        },
        setFocusRow: function setFocusRow(row) {
            this.table.setFocusedCell(0, row);
        },
        setToolBarParent: function setToolBarParent(parent) {
            this.__toolParent = parent;

            var toolBar = new qx.ui.toolbar.ToolBar();
            var part = new qx.ui.toolbar.Part();
            toolBar.add(part);

            if (typeof this.__totalContainer != 'undefined') {
                part.add(this.__totalContainer);
                part.add(new qx.ui.toolbar.Separator());
            }
            if (typeof this.__compositeOrderBy != 'undefined' && this.__compositeOrderBy != null) {
                part.add(this.__compositeOrderBy);
                part.add(new qx.ui.toolbar.Separator());
            }
            if (typeof this.__metaAllContainer != 'undefined') {
                part.add(this.__metaAllContainer);
                part.add(new qx.ui.toolbar.Separator());
            }
            //            if (typeof this.__cleanFiltersButton != 'undefined') {
//                part.add(this.__cleanFiltersButton);
            //                part.add(new qx.ui.toolbar.Separator());
            //            }

            if (typeof this.spinnerUpdate != 'undefined' && this.spinnerUpdate != null) {
                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                    alignY: "middle"
                }));
                var lbl = new qx.ui.basic.Label(this.tr("Actualizar cada:"));
                container.add(lbl);
                container.add(this.spinnerUpdate);
                part.add(container);
            }

            this.__toolParent.addWidget(toolBar);

            //this.__cleanFiltersButton.setMaxHeight(35);

            this.__toolsButton.setVisibility("visible");
            if (typeof this.tipoCalculo != 'undefined' && this.tipoCalculo != null) {
                this.tipoCalculo.resetMaxWidth();
            }
            if (typeof this.totalText != 'undefined' && this.totalText != null) {
                this.totalText.resetMaxWidth();
            }
            if (typeof this.totalCompareValue != 'undefined' && this.totalCompareValue != null) {
                this.totalCompareValue.resetMaxWidth();
            }
            if (typeof this.__metaColumn != 'undefined' && this.__metaColumn != null) {
                this.__metaColumn.resetMaxWidth();
            }
            if (typeof this.__totalContainer != 'undefined' && this.__totalContainer != null) {
                this.__totalContainer.resetMaxWidth();
            }
        }
        , getToolBarParent: function getToolBarParent(parent) {
            return this.__toolParent;
        },
        restoreFilteredValues: function restoreFilteredValues() {
            var self = this;
            var tableModel = self.table.getTableModel();
            tableModel.resetHiddenRows();
            for (var i = 0; i < self.p_filter.length; i++) {
                if (typeof self.p_filter[i] != 'undefined') {
                    var children = self.p_filter[i].getChildren();
                    for (var ia = 0; ia < children.length; ia++) {
                        if (typeof children[ia].getUserData("valueHide") != 'undefined') {
                            var val = children[ia].getUserData("valueHide");
                            if (val != null) {
                                self.table.changeFilterRows(true, self.p_filter[i].getUserData("colInfo"), val);
                            }
                        }
                    }
                }
            }
        },
        /**
         * 
         * @returns {undefined}
         */
        createTable: function createTable() {
            var self = this;
            var decoration = null;
            if (self.decoration != null) {
                decoration = this.decoration;
            }
            //TODO: RESIZABLE
//            var custom = {
//                tableColumnModel: function (obj) {
//                    return new qx.ui.table.columnmodel.Resize(obj);
//                }
//            };
            var simple = new qxnw.table.modelFiltered();
//            self.table = new qxnw.table.table(simple, {
//                tablePaneModel: function (obj) {
//                    return new qxnw.table.optimizedTablePaneModel(obj);
//                }
//            }).set({
//                decorator: decoration
//            });
            self.table = new qxnw.table.table(simple).set({
                decorator: decoration
            });

            self.table.setAppWidgetName(self.getAppWidgetName());

            self.table.addListener("storeOrderSaved", function (e) {
                self.__metaColumn.removeAll();
                var columns = self.table.getTableColumnModel().getVisibleColumns();
                for (var i = 0; i < columns.length; i++) {
                    var model = self.table.getTableModel().getColumnName(columns[i]).replace("<b style='color:red'>*</b>", "");
                    var idCol = self.table.getTableModel().getColumnId(columns[i]);
                    try {
                        model = model.replace(/<div id='div_[0-9][0-9]{0,3}' color='[#a-zA-Z0-9]*'><.div>/gi, "");
                    } catch (e) {

                    }
                    var item = new qxnw.widgets.listItem(model);
                    item.setModel(idCol);
                    self.totalText.add(item);
                    self.totalCompareCol.add(item.clone());
                    var itemMeta = new qxnw.widgets.listItem(model);
                    itemMeta.setModel(i);
                    self.__metaColumn.add(itemMeta);
                }
            });


//            self.table.setMinHeight(500);
//            });
//            self.table.setDragScrollSlowDownFactor(0.5);
            self.table.addListener("appear", function (e) {
                self.updateCheck.addListener("changeValue", function (e) {
                    self.saveFooterToolbarSettings();
                    var selected = e.getData();
                    if (selected === true) {
                        var data = self.__getStoredConfiguration();
                        if (data == null) {
                            return;
                        }
                        if (data.autoUpdate) {
                            self.applyFilters();
                        }
                    }
                });
            });
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
            self.table.setParent(self);

            var tcm = self.table.getTableColumnModel();
            tcm.addListener("orderChanged", function () {
                var timer = new qx.event.Timer(100);
                timer.start();
                timer.addListener("interval", function (e) {
                    timer.stop();
                    timer = null;
                    self.populateColumnColors();
                });
                self.actionsOnMetaDataChanged();
            });

            self.table.getChildControl("statusbar").setRich(true);

            self.table.getChildControl("statusbar").addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "qxnw_div_foot_information");
            });

            if (self.__multiCell) {
                var selectionMode = qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION;
                self.table.getSelectionModel().setSelectionMode(selectionMode);
            }

            self.__command_copy = new qx.ui.command.Command('Control+C');
            var func = function () {
                if (self.__isFocused) {
                    if (typeof self.table != 'undefined') {
                        var text = self.table.getTableModel().getValue(self.table.getFocusedColumn(), self.table.getFocusedRow());
                        window.prompt(self.tr("Texto a copiar: (Presiona nuevamente CTRL+C)"), text);
                    }
                }
            };
            self.__command_copy_listener = self.__command_copy.addListener('execute', func, this);
            self.__command_copy.setEnabled(false);
//          DELETED ON 27 SEP 2015
//            self.addListener("loadedTable", function() {
//                if (!self.isProcessFired("column_static")) {
//
//                }
//            });
            //self.table.setKeepFirstVisibleRowComplete(true);

            self.__contextMenuIdListener = null;
            if (this.__mainForm) {
                self.__contextMenuIdListener = self.table.addListener("contextmenu", function (e) {
                    // TODO: INTENTO DE SELECCIONAR EN EL CONTEXT MENU
//                    var selection = [];
                    //                    self.table.getSelectionModel().iterateSelection(function(rowNumber) {
                    //                        selection.push(rowNumber + "");
//                    });
//                    console.log(selection.join(", "));
//                    try {
//                        var target = e.getTiltX();
//                        console.log(target);
//                        return;
//                        self.table.moveFocusedCell(target.screenX, target.screenY);
//                        //self.table.updateContent();
//                    } catch (e) {
//                        console.log(e);
//                        //qxnw.utils.hiddenError(e);
//                    }
                    self.contextMenu(e);
                });
            } else {
                if (self.getForceContextMenu()) {
                    self.__contextMenuIdListener = self.table.addListener("contextmenu", function (e) {
                        try {
                            var target = e.getNativeEvent();
                            self.table.moveFocusedCell(target.clientX, target.clientY);
                        } catch (e) {
                            qxnw.utils.hiddenError(e);
                        }
                        self.contextMenu(e);
                    });
                }
            }

//            INICIOS DE ELIMINAR CON EL TECLADO
//
//            self.table.addListener("keypress", function(e) {
//                var key = e.getKeyIdentifier();
            //                if (key == "Backspace" || key == "Delete") {
//                    try {
            //                        self.slotEliminar();
            //                    } catch (e) {
//
            //                    }
            //                }
//            });

            self.table.addListener("cellContextmenu", function (e) {
                var row = e.getRow();
                var col = e.getColumn();
                self.table.setFocusedCell(col, row);
                self.table.updateContent();
            });
            self.table.addListener("beforeContextmenuOpen", function () {
                self.table.resetContextMenu();
                self.table.setContextMenu(null);
            });
            self.containerTable.add(self.table, {
                flex: 1
            });
        },
        disableContextMenu: function disableContextMenu() {
            if (this.__contextMenuIdListener != null) {
                try {
                    this.table.removeListenerById(this.__contextMenuIdListener);
                    this.table.resetContextMenu();
                    this.table.setContextMenu(null);
                } catch (e) {
                }
            }
        },
        /**
         * Close the list and returns true
         * @returns {void}
         */
        accept: function accept() {
            var self = this;
            if (self.settings.accept !== undefined) {
                try {
                    self.settings.accept();
                } catch (e) {
                    qxnw.utils.bindError(e, self);
                }
            }
            self.close();
        },
        /**          * Close the list and returns false
         * @returns {void}
         */
        reject: function reject() {
            var self = this;
            if (self.settings.reject !== undefined) {
                try {
                    self.settings.reject();
                } catch (e) {
                    qxnw.utils.bindError(e, self);
                }
            }
            self.close();
        }
    }
});
