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
qx.Class.define("qxnw.listEdit", {
    extend: qxnw.lists,
    construct: function construct() {
        this.base(arguments);
        this._stateColumns = [];
        this.__columnsImages = [];
        this.removedStore = [];
        this.__selectBoxMethods = [];
        this.__columnTypesSetted = [];
        this.__selectBoxWheres = [];
    },
    destruct: function destruct() {

    },
    properties: {
        verticalBehavior: {
            init: false,
            check: "Boolean"
        },
        maxEditableColumn: {
            init: 0,
            check: "Integer"
        },
        handleNormalBehavior: {
            init: true,
            check: "Boolean"
        },
        deleteAutomaticRows: {
            init: false,
            check: "Boolean"
        },
        haveToAddRow: {
            init: false,
            check: "Boolean"
        },
        dateTimeFormat: {
            init: null,
            check: "String"
        }
    },
    members: {
        __dataChanged: false,
        __rowPosition: 0,
        __method: null,
        __exec: null,
        __isListEditAppear: false,
        enableFilters: true,
        removedStore: null,
        __selectBoxMethods: null,
        __columnTypesSetted: null,
        __selectBoxWheres: null,
        __activateOnSetModelData: true,
        setEnabledFilters: function setEnabledFilters(v) {
            this.enableFilters = v;
        },
        getEnabledFilters: function getEnabledFilters() {
            return this.enableFilters;
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
        getCellValue: function getCellValue(column, row) {
            return this.table.getTableModel().getValue(column, row);
        },
        addRows: function addRows(rows) {
            var self = this;
            var data = qx.lang.Array.clone(rows);
            var columns = self.allColumnsData;
            for (var i = 0; i < data.length; i++) {
                for (var ia = 0; ia < columns.length; ia++) {
                    var type = columns[ia].type;
                    var name = columns[ia].caption;
                    if (typeof data[i][name] != 'undefined' && data[i][name] != null && data[i][name] != '') {
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
                                dt["nombre"] = typeof data[i]["nom_" + name] != 'undefined' ? data[i]["nom_" + name] : "n/a";
                                data[i][name] = dt;
                                break;
                            case "selectBox":
                                var dt = {};
                                dt["id"] = data[i][name];
                                dt["name"] = typeof data[i]["nom_" + name] != 'undefined' ? data[i]["nom_" + name] : "n/a";
                                data[i][name] = dt;
                                break;
                            case "dateField":
                                var dt = new qx.util.format.DateFormat("YYYY-M-d");
                                var date = dt.parse(data[i][name]);
                                data[i][name] = date;
                                break;
                            case "timeField":
                                var dt = new qx.util.format.DateFormat("H:mm");
                                var date = dt.parse(data[i][name]);
                                data[i][name] = date;
                                break;
                            case "dateFieldOrder":
                                var dt = new qx.util.format.DateFormat("d-M-YYYY");
                                var date = dt.parse(data[i][name]);
                                data[i][name] = date;
                                break;
                            case "dateTimeField":
                                var lang = qxnw.local.getOpenData("lang");
                                var dt = new qx.util.format.DateFormat(qxnw.config.getDateTimeFormat(lang));
                                var date = dt.parse(data[i][name]);
                                data[i][name] = date;
                                break;
                        }
                    }
                }
            }

            var fixedArray = self.objectToArrayOnColumns(data);

            self.model.addRows(fixedArray);

            try {
                self.model.addRowInTempModel(fixedArray);
            } catch (e) {
                qxnw.utils.hiddenError(e);
            }

            self.table.setTableModel(self.model);
            //TODO: NO ESTÁ HACIENDO EL FOCUS CORRECTAMENTE
            //self.table.updateContent();
        },
        setEnabledAll: function setEnabledAll(bool) {
            this.setEnableAll(bool);
        },
        setEnableAll: function setEnableAll(bool) {
            var self = this;
            self.setEnablePanel(bool);
        },
        setEnablePanel: function setEnablePanel(bool) {
            var self = this;
            self.containerTable.setEnabled(bool);
            try {
                self.table.getPaneScroller(0).getChildControl("scrollbar-y").setEnabled(true);
            } catch (e) {

            }
        },
        //TODO: CHANGED FROM VALIDATE TO VALIDATE DATA
        validateData: function validateData() {
            var self = this;
            var columns = self.allColumnsData;
            var data = this.table.getTableModel().getDataAsMapArray();
            var valid = true;
            for (var i = 0; i < data.length; i++) {
                for (var ia = 0; ia < columns.length; ia++) {
                    if (columns[ia].required) {
                        if (data[i][columns[ia].caption] == "" || data[i][columns[ia].caption] == null) {
                            valid = false;
                        } else if (typeof columns[ia].mode == 'number') {
                            valid = true;
                        } else if (columns[ia].type == 'selectListCheck' && data[i][columns[ia].caption].length > 0) {
                            valid = true;
                        } else if ((columns[ia].type == 'dateField' || columns[ia].type == 'dateFieldOrder' || columns[ia].type == 'dateTimeField' || columns[ia].type == 'dateTime') && typeof data[i][columns[ia].caption] == "object") {
                            valid = true;
                        } else if (columns[ia].type == 'selectTokenField') {
                            if (typeof data[i][columns[ia].caption] == 'object') {
                                if (data[i][columns[ia].caption] != null) {
                                    valid = true;
                                } else {
                                    valid = false;
                                }
                            } else {
                                valid = false;
                            }
                        } else if (columns[ia].type == "selectBox") {
                            valid = true;
                        } else if (typeof data[i][columns[ia].caption].trim != 'undefined') {
                            if (data[i][columns[ia].caption].trim() == "") {
                                valid = false;
                            }
                        }
                        if (!valid) {
                            if (qxnw.config.getShakeOnValidate()) {
                                qxnw.animation.startEffect("shake", self);
                            }
                            if (qxnw.config.getShowInformationOnValidate()) {
                                var call = function () {
                                    self.table.focus();
                                    self.table.setFocusedCell(ia, i);
                                    if (!self.table.isEditing()) {
                                        self.table.startEditing();
                                    }
                                };
                                qxnw.utils.information("Una celda no puede estar vacía", call);
                            } else {
                                self.table.focus();
                                self.table.setFocusedCell(ia, i);
                            }
                            return valid;
                        }
                    }
                }
            }
            return valid;
        },
        getColumnEnabledFromColumnRow: function getColumnEnabledFromColumnRow(col, row) {
            var self = this;
            var d = self._stateColumns;
            for (var i = 0; i < d.length; i++) {
                if (d[i].col == col && d[i].row == row) {
                    return d[i];
                }
            }
        },
        setRowEnabled: function setRowEnabled(row, bool) {
            var self = this;
            var columns = self.allColumnsData;
            for (var i = 0; i < columns.length; i++) {
                var d = {};
                d["col"] = i;
                d["row"] = row;
                d["enabled"] = bool;
                this._stateColumns.push(d);
            }
        },
        setColEnabled: function setColEnabled(col, bool) {
            var self = this;
            var model = self.getModel();
            model.setColumnEditable(col, bool);
        },
        setCellEnabled: function setCellEnabled(col, row, bool) {
            var d = {};
            d["col"] = col;
            d["row"] = row;
            d["enabled"] = bool;
            for (var i = 0; i < this._stateColumns.length; i++) {
                if (this._stateColumns[i].col == col && this._stateColumns[i].row == row) {
                    this._stateColumns.splice(i, 1);
                }
            }

            this._stateColumns.push(d);
        },
        getAllData: function getAllData(stopEditing) {
            var self = this;
            if (typeof stopEditing == 'undefined') {
                stopEditing = true;
            }
            if (self.table.isEditing() && stopEditing == true) {
                self.table.stopEditing();
            }
            var filters = null;
            if (typeof self.model != 'undefined') {
                if (typeof self.model.Filters != 'undefined') {
                    filters = self.model.Filters;
                }
            }
            if (self.getEnabledFilters() === true) {
                self.model.resetHiddenRows();
            }
            var data = this.table.getTableModel().getDataAsMapArray();
            var format = new qx.util.format.DateFormat("yyyy-MM-dd");
            var columns = self.allColumnsData;
            if (self.getEnabledFilters() === true) {
                var rta = self.removeStoredRows(data);
                for (var i = 0; i < data.length; i++) {
                    for (var ia = 0; ia < columns.length; ia++) {
                        var mode = columns[ia].mode;
                        switch (columns[ia].type) {
                            case "dateField":
                                if (typeof data[i][columns[ia].caption] != 'undefined' && data[i][columns[ia].caption] != null && data[i][columns[ia].caption] != '') {
                                    data[i][columns[ia].caption] = format.format(data[i][columns[ia].caption]);
                                }
                                break;
                            case "timeField":
                                format = new qx.util.format.DateFormat("H:mm");
                                if (typeof data[i][columns[ia].caption] != 'undefined' && data[i][columns[ia].caption] != null && data[i][columns[ia].caption] != '') {
                                    data[i][columns[ia].caption] = format.format(data[i][columns[ia].caption]);
                                }
                                break;
                            case "dateFieldOrder":
                                if (typeof data[i][columns[ia].caption] != 'undefined' && data[i][columns[ia].caption] != null && data[i][columns[ia].caption] != '') {
                                    data[i][columns[ia].caption] = format.format(data[i][columns[ia].caption]);
                                }
                                break;
                            case "dateTimeField":
                                var lang = qxnw.local.getOpenData("lang");
                                format = new qx.util.format.DateFormat(qxnw.config.getDateTimeFormat(lang));
                                if (typeof data[i][columns[ia].caption] != 'undefined' && data[i][columns[ia].caption] != null && data[i][columns[ia].caption] != '') {
                                    data[i][columns[ia].caption] = format.format(data[i][columns[ia].caption]);
                                }
                                break;
                            case "checkBox":
                                switch (data[i][columns[ia].caption]) {
                                    case true:
                                        data[i][columns[ia].caption] = "t";
                                        break;
                                    case 1:
                                        data[i][columns[ia].caption] = "t";
                                        break;
                                    case "1":
                                        data[i][columns[ia].caption] = "t";
                                        break;
                                    case false:
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case 0:
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case "0":
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case 'undefined':
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case undefined:
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case null:
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                }
                                break;
                        }
                    }
                }
                if (typeof filters != 'undefined') {
                    if (filters != null) {
                        if (typeof filters.length != 'undefined') {
                            if (filters.length > 0) {
                                self.model.Filters = filters;
                                self.model.applyFilters();
                            }
                        }
                    }
                }
                return rta;
            } else {
                for (var i = 0; i < data.length; i++) {
                    for (var ia = 0; ia < columns.length; ia++) {
                        var mode = columns[ia].mode;
                        switch (columns[ia].type) {
                            case "dateField":
                                if (typeof data[i][columns[ia].caption] != 'undefined' && data[i][columns[ia].caption] != null && data[i][columns[ia].caption] != '') {
                                    data[i][columns[ia].caption] = format.format(data[i][columns[ia].caption]);
                                }
                                break;
                            case "timeField":
                                format = new qx.util.format.DateFormat("H:mm");
                                if (typeof data[i][columns[ia].caption] != 'undefined' && data[i][columns[ia].caption] != null && data[i][columns[ia].caption] != '') {
                                    data[i][columns[ia].caption] = format.format(data[i][columns[ia].caption]);
                                }
                                break;
                            case "dateFieldOrder":
                                if (typeof data[i][columns[ia].caption] != 'undefined' && data[i][columns[ia].caption] != null && data[i][columns[ia].caption] != '') {
                                    data[i][columns[ia].caption] = format.format(data[i][columns[ia].caption]);
                                }
                                break;
                            case "dateTimeField":
                                var lang = qxnw.local.getOpenData("lang");
                                format = new qx.util.format.DateFormat(qxnw.config.getDateTimeFormat(lang));
                                if (typeof data[i][columns[ia].caption] != 'undefined' && data[i][columns[ia].caption] != null && data[i][columns[ia].caption] != '') {
                                    data[i][columns[ia].caption] = format.format(data[i][columns[ia].caption]);
                                }
                                break;
                            case "checkBox":
                                switch (data[i][columns[ia].caption]) {
                                    case true:
                                        data[i][columns[ia].caption] = "t";
                                        break;
                                    case 1:
                                        data[i][columns[ia].caption] = "t";
                                        break;
                                    case "1":
                                        data[i][columns[ia].caption] = "t";
                                        break;
                                    case false:
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case 0:
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case "0":
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case 'undefined':
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case undefined:
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                    case null:
                                        data[i][columns[ia].caption] = "f";
                                        break;
                                }
                                break;
                        }
                    }
                }
                return data;
            }
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
                self.table.getTableModel().removeRows(row - hidden, count, false);
                data.splice(row - hidden, count);
                hidden += count;
            }
            return data;
        },
        columnNameFromIndex: function columnNameFromIndex(index) {
            var self = this;
            for (var i = 0; i < self.captions.length; i++) {
                if (i == index) {
                    return self.captions[i];
                }
            }
            return -1;
        },
        //overided
        removeAll: function removeAll() {
            this.removeAllRows();
        },
        //overrided
        removeAllRows: function removeAllRows() {
            var self = this;
//            for (var i = 0; i < self.table.getTableModel().getRowCount(); i++) {
//                self.table.getTableModel().removeRows(i, 1);
//            }
            var self = this;
            if (self.table.isEditing()) {
                self.table.stopEditing();
            }

            self.table.setSaveVisibility(false);

            self.table.resetCellFocus();
            self.createModel();
            self.setListEdit();
            self.table.updateContent();

            self.table.setStoredColumnsWidth();
            self.table.restoreOrder();
            self.table.setTheStoredVisibilityColumns();

            self.populateTotalColumns();

            self.table.setSaveVisibility(true);
        },
        removeRowByIndex: function removeRowByIndex(row, numToDelete) {
            var self = this;
            if (row == null) {
                qxnw.utils.information("Seleccione un registro");
                return;
            }
            self.table.stopEditing();
            var tableModel = self.table.getTableModel();
            tableModel.removeRows(row, typeof numToDelete == 'undefined' ? 1 : numToDelete);
        },
        removeSelectedRow: function removeSelectedRow() {
            var self = this;
            var row = self.table.getFocusedRow();
            if (row == null) {
                qxnw.utils.information("Seleccione un registro");
                return;
            }
            if (row > 0) {
                self.setFocusRow(row - 1);
            } else {
                self.setFocusRow(self.getFirstColumnVisible());
            }
            self.removedStore.push(self.table.getTableModel().getRowDataAsMap(row));
            self.table.getTableModel().removeRows(row, 1);
        },
        getRemovedItemsFromStore: function getRemovedItemsFromStore() {
            return this.removedStore;
        },
        activate: function activate() {
            this.base(arguments);
            this.table.getPaneScroller(0).getTablePane().activate();
        },
        verifyColumnTypeEdit: function verifyColumnTypeEdit() {
            var self = this;
            var columns = self.allColumnsData;
            var tcm = self.table.getTableColumnModel();
            var heigthAumented = false;
            var uploaderHeight = false;
            for (var i = 0; i < columns.length; i++) {
                var mode = columns[i].mode;
                var heigthHeader = 32;
                if (qx.core.Environment.get("browser.name") == "ie") {
                    heigthHeader = 35;
                }
                var label = "";
                if (typeof columns[i].label != 'undefined' && columns[i].label != null) {
                    label = columns[i].label.replace("<b style='color:red'>*</b>", "");
                }
                var actualHeight = self.table.getHeaderCellHeight();
                if (label.length > 20 && !heigthAumented && heigthHeader > actualHeight) {
                    self.table.setHeaderCellHeight(heigthHeader);
                    heigthAumented = true;
                }
                switch (self.types[i]) {
                    case "uploader":
                        self.table.setColumnWidth(i, 160);
                        uploaderHeight = 170;
                        var htmlRender = new qxnw.cellrenderer.uploader();
                        tcm.setDataCellRenderer(i, htmlRender);
                        break;
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
                            prefix: "$ "
                        });
                        numberRender.setNumberFormat(numberFormat);
                        tcm.setDataCellRenderer(i, numberRender);
                        break;
                    case "button":
                        var imageRender = new qxnw.cellrenderer.image(width, height);
                        tcm.setDataCellRenderer(i, imageRender);
                        break;
                    case "progressbar":
                        var progress = new qx.ui.indicator.ProgressBar(0, 50);
                        tcm.setDataCellRenderer(i, progress);
                        break;
                    case "checkBox":
                        var dcr = new qx.ui.table.cellrenderer.Boolean();
                        tcm.setDataCellRenderer(i, dcr);
                        break;
                    case "checkbox":
                        var dcr = new qx.ui.table.cellrenderer.CheckBox();
                        tcm.setDataCellRenderer(i, dcr);
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
                            self.table.setRowHeight(height + 10);
                        }
                        var imageRender;
                        if (modePhpthumb) {
                            width = 100;
                            height = 100;
                            self.table.setRowHeight(height + 10);
                            imageRender = new qxnw.cellrenderer.image(width, height);
                        } else {
                            imageRender = new qx.ui.table.cellrenderer.Image(width, height);
                            if (repeat) {
                                imageRender.setRepeat("scale");
                            }
                        }
                        self.__columnsImages.push(i);
                        tcm.setDataCellRenderer(i, imageRender);
                        break;
                    case "camera":
                        var imageRender = new qx.ui.table.cellrenderer.Html();
                        tcm.setDataCellRenderer(i, imageRender);
                        self.table.setRowHeight(80);
                        break;
                    case "dateField":
                        var head_renderer = new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png");
                        tcm.setHeaderCellRenderer(i, head_renderer, "");
                        break;
                    case "timeField":
                        var head_renderer = new qx.ui.table.headerrenderer.Icon("icon/16/apps/preferences-clock.png");
                        tcm.setHeaderCellRenderer(i, head_renderer, "");
                        break;
                    case "dateFieldOrder":
                        var head_renderer = new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png");
                        tcm.setHeaderCellRenderer(i, head_renderer, "");
                        break;
                    case "date":
                        var head_renderer = new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png");
                        tcm.setHeaderCellRenderer(i, head_renderer, "");
                        break;
                    case "dateTimeField":
                        var head_renderer = new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png");
                        tcm.setHeaderCellRenderer(i, head_renderer, "");
                        break;
                }
            }
            if (uploaderHeight != false) {
                self.table.setRowHeight(uploaderHeight);
            }
        },
        handleExecPages: function handleExecPages(settings) {
            var self = this;
            try {
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
                    self.addInformation("<b>Total registros: " + settings.recordCount.toString() + "</b>", "totalRecords");
                }
            } catch (e) {
                qxnw.utils.nwconsole(e);
            }
        },
        //overrided
        setModelData: function setModelData(data) {
            var self = this;
            if (data == null) {
                return;
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
//                                            window.open("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.exportId + "&key=" + data.exportKey); 
//                                            return false;
                                            window.open(window.location + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.exportId + "&key=" + data.exportKey, "ExportDataIE", "width=200, height=100");
                                        } else {
                                            main.isClosedApp = true;
                                            window.location.href = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/downloader.php?id=" + data.exportId + "&key=" + data.exportKey;
                                        }
                                        self.__acceptExportButton.setEnabled(true);
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
            self.handleExecPages(settings);
            if (typeof data.records != 'undefined') {
                if (data.records.length > 0) {
                    data = data.records;
                }
            }
            try {
                var columns = self.allColumnsData;
                for (var i = 0; i < data.length; i++) {
                    for (var ia = 0; ia < columns.length; ia++) {
                        var type = columns[ia].type;
                        var name = columns[ia].caption;

                        try {
                            if (typeof columns[ia].enabled != 'undefined') {
                                self.setCellEnabled(ia, i, columns[ia].enabled);
                            }
                        } catch (e) {
                            console.log(e);
                        }

                        if (typeof data[i][name] != 'undefined' && data[i][name] != null && data[i][name] != '') {
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
                                    dt["name"] = typeof data[i]["nom_" + name] != 'undefined' ? data[i]["nom_" + name] : "n/a";
                                    data[i][name] = dt;
                                    break;
                                case "dateField":
                                    if (data[i][name] != null) {
                                        var internal = data[i][name].split(" ");
                                        //TODO: cambiar a default format
                                        var format = "yyyy-MM-dd";
                                        if (typeof internal[0] != 'undefined' && internal[0] != null) {
                                            var testDate = internal[0].split("/");
                                            if (typeof testDate[0] != 'undefined' && testDate[0] != 'undefined') {
                                                if (typeof testDate[2] != 'undefined' && testDate[2] != null) {
                                                    if (testDate[2].length == 4) {
                                                        //TODO: cambiar a default format
                                                        format = "dd/MM/YYYY";
                                                    }
                                                }
                                            }
                                        }
                                        var dt = new qx.util.format.DateFormat(format);
                                        var date = dt.parse(data[i][name]);
                                        data[i][name] = date;
                                    }
                                    break;
                                case "dateFieldOrder":
                                    if (data[i][name] != null) {
                                        var internal = data[i][name].split(" ");
                                        var format = "dd-MM-yyyy";
                                        if (typeof internal[0] != 'undefined' && internal[0] != null) {
                                            var testDate = internal[0].split("/");
                                            if (typeof testDate[0] != 'undefined' && testDate[0] != 'undefined') {
                                                if (typeof testDate[2] != 'undefined' && testDate[2] != null) {
                                                    if (testDate[2].length == 4) {
                                                        format = "dd/MM/YYYY";
                                                    }
                                                }
                                            }
                                        }
                                        var dt = new qx.util.format.DateFormat(format);
                                        var date = dt.parse(data[i][name]);
                                        data[i][name] = date;
                                    }
                                    break;
                                case "dateTimeField":
                                    var composed = true;
                                    if (typeof data[i][name] != 'undefined') {
                                        if (data[i][name] != null) {
                                            var d = data[i][name].split(" ");
                                            if (d.length == 1) {
                                                composed = false;
                                            }
                                        }
                                    }
                                    if (data[i][name] != null) {

                                        var lang = qxnw.local.getOpenData("lang");
                                        var format = qxnw.config.getDateTimeFormat(lang);

                                        if (typeof format !== 'undefined' && format !== null) {
                                            format = format.toString();
                                        } else {
                                            var format = "YYYY-M-d H:m";
                                        }

                                        var form = self.getDateTimeFormat();
                                        if (form != null) {
                                            format = self.getDateTimeFormat();
                                        }

//                                        var dt = new qx.util.format.DateFormat("yyyy-MM-dd H:m");
                                        if (composed == false) {
                                            data[i][name] = data[i][name] + " 00:00";
                                        } else {
                                            var da = d[1].split(":");
                                            if (da.length == 3) {
                                                format = format + ":00";
                                            }
                                        }
                                        var dt = new qx.util.format.DateFormat(format);
                                        var date = dt.parse(data[i][name]);
                                        data[i][name] = date;
                                    }
                                    break;
                                case "timeField":
                                    if (data[i][name] != null) {
                                        var format = "H:mm";
                                        var dt = new qx.util.format.DateFormat(format);
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
                }
                self.flushEditing();
                self.model.setData(self.objectToArrayOnColumns(data));
                if (self.table == null) {
                    return;
                }
                self.table.setTableModel(self.model);
                self.table.setShowCellFocusIndicator(self.getShowCellFocusIndicator());
                self.catchFiltersValues();
                if (self.__font != null) {
                    self.table.setFont(self.__font);
                }
                if (self.__activateOnSetModelData == true) {
                    self.table.getPaneScroller(0).getTablePane().activate();
                }
                if (self.__totalColumn != null) {
                    var total = self.getTotalColumn();
                    total = isNaN(parseInt(total)) ? self.tr(", Total no posible para esta columna") : total;
                    var prefix = ": ";
                    if (self.isShowingPagination()) {
                        prefix = " en esta hoja: ";
                    }
                    self.addInformation("<b style='color: blue'>" + "Total" + prefix + total + "</b>", "totalColumns");
                }
                self.table.getTableModel().setStoredColumnSorted();
            } catch (e) {
                qxnw.utils.nwconsole(e);
            }
            return true;
        },
        getBase: function getBase() {
            this.__activateOnSetModelData = false;
            return this.masterContainer;
        },
        checkMaxEditableColumn: function checkMaxEditableColumn() {
            var self = this;
            var columnCount = self.table.getTableModel().getColumnCount();
            columnCount = columnCount--;
            for (var i = columnCount; i > 0; i--) {
                if (!self.model.isColumnEditable(i)) {
                    return i - 1;
                }
            }
        },
        checkMinEditableColumn: function checkMinEditableColumn() {
            var self = this;
            var columnCount = self.table.getTableModel().getColumnCount();
            columnCount = columnCount--;
            for (var i = 0; i < columnCount; i++) {
                if (self.model.isColumnEditable(i)) {
                    return i;
                }
            }
        },
        setColumnTypeAlter: function setColumnTypeAlter(col, row, type) {
            var d = {};
            d["col"] = col;
            d["type"] = type;
            d["row"] = row;
            this.__columnTypesSetted.push(d);
        },
        setColumnSelectboxMethod: function setColumnSelectboxMethod(caption, row, method) {
            var d = {};
            d["caption"] = caption;
            d["method"] = method;
            d["row"] = row;
            this.__selectBoxMethods.push(d);
        },
        setSelectboxWhere: function setSelectboxWhere(col, row, where) {
            for (var i = 0; i < this.__selectBoxWheres.length; i++) {
                if (this.__selectBoxWheres[i]["col"] == col) {
                    if (this.__selectBoxWheres[i]["row"] == row) {
                        this.__selectBoxWheres[i]["where"] = where;
                        return;
                    }
                }
            }
            var d = {};
            d["col"] = col;
            d["where"] = where;
            d["row"] = row;
            this.__selectBoxWheres.push(d);
        },
//        setSelectboxWhereByCol: function setSelectboxWhereByCol(col, where) {
//            for (var i = 0; i < this.__selectBoxWheres.length; i++) {
//                if (this.__selectBoxWheres[i]["col"] == col) {
//                    if (this.__selectBoxWheres[i]["row"] == row) {
//                        this.__selectBoxWheres[i]["where"] = where;
//                        return;
//                    }
//                }
//            }
//            var d = {};
//            d["col"] = col;
//            d["where"] = where;
//            d["row"] = row;
//            this.__selectBoxWheres.push(d);
//        },
        setListEdit: function setListEdit() {
            var self = this;
            self.setIsListEdit(true);
            var propertyCellRendererFactoryFunc = function (cellInfo) {
                var metaData = self.getColumnTypeFromColumn(cellInfo.col, cellInfo.row);
                var mode = self.getColumnModeFromColumn(cellInfo.col);
                switch (metaData) {
                    case "textField":
                        if (typeof mode != 'undefined' && mode == "money") {
                            var renderer = new qx.ui.table.cellrenderer.Number();
                            var numberFormat = new qx.util.format.NumberFormat().set({
                                prefix: "$ ",
                                minimumFractionDigits: 2
                            });
                            renderer.setNumberFormat(numberFormat);
                        } else {
                            var renderer = new qx.ui.table.cellrenderer.Default;
                        }
                        return renderer;
                        break;
                    case "dateField":
                        var renderer = new qx.ui.table.cellrenderer.Date;
                        //TODO: PROBLEMA DE FORMATO INICIAL EN EL LISTEDIT
                        var format = new qx.util.format.DateFormat("yyyy-MM-dd");
                        renderer.setDateFormat(format);
                        return renderer;
                        break;
                    case "dateFieldOrder":
                        var renderer = new qx.ui.table.cellrenderer.Date;
                        //TODO: PROBLEMA DE FORMATO INICIAL EN EL LISTEDIT
                        var format = new qx.util.format.DateFormat("dd-MM-yyyy");
                        renderer.setDateFormat(format);
                        return renderer;
                        break;
                    case "dateTimeField":
                        var renderer = new qxnw.cellrenderer.dateTime;
                        //TODO: (andresf nov-2019) se cambia para perfeccionar los formatos devueltos
                        //var renderer = new qx.ui.table.cellrenderer.Date;
                        //var format = new qx.util.format.DateFormat("yyyy-MM-dd H:m");
                        //renderer.setDateFormat(format);
                        return renderer;
                        break;
                    case "timeField":
                        var renderer = new qxnw.cellrenderer.timeField;
                        return renderer;
                        break;
                    case "selectTokenField":
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
                        return renderer;
                        break;
                    case "tokenField":
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
                        return renderer;
                        break;
                    case "checkbox":
                        return new qxnw.cellrenderer.checkBox;
                        break;
                    case "checkBox":
                        return new qxnw.cellrenderer.checkBox;
                        break;
                    case "password":
                        return new qx.ui.table.cellrenderer.Password;
                        break;
                    case "integer":
                        return new qx.ui.table.cellrenderer.Number;
                        break;
                    case "html":
                        return new qx.ui.table.cellrenderer.Html;
                        break;
                    case "uploader":
                        return new qx.ui.table.cellrenderer.Html;
                        break;
                    case "selectBox":
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
                        return renderer;
                        break;
                }
                return new qx.ui.table.cellrenderer.Default();
            };
            var propertyCellRendererFactory = new qx.ui.table.cellrenderer.Dynamic(propertyCellRendererFactoryFunc);

            var propertyCellEditorFactoryFunc = function (cellInfo) {
                if (!self.table.isEditing() && cellInfo.value == 'undefined') {
                    cellInfo.table.stopEditing();
                }
                var metaData = self.getColumnTypeFromColumn(cellInfo.col, cellInfo.row);
                var mode = self.getColumnModeFromColumn(cellInfo.col);

//                var cellEditor = new qxnw.celleditor.default;
                var cellEditor = new qx.ui.table.celleditor.TextField;
                var validationFunc = null;

                var d = self.getColumnEnabledFromColumnRow(cellInfo.col, cellInfo.row);
                switch (metaData) {
                    case "money":
                        cellEditor = new qxnw.celleditor.numericField;
                        break;
                    case "textField":
                        if (typeof mode != 'undefined') {
                            if (mode == "money") {
                                cellEditor = new qxnw.celleditor.numericField;
                            } else if (mode == "upperCase") {
                                cellEditor = new qxnw.celleditor.textField;
                            }
                        } else {
                            cellEditor = new qxnw.celleditor.textField;
                        }
                        break;
                    case "dateField":
                        cellEditor = new qxnw.celleditor.dateField;
                        break;
                    case "textArea":
                        cellEditor = new qxnw.celleditor.textArea;
                        break;
                    case "dateFieldOrder":
                        cellEditor = new qxnw.celleditor.dateField;
                        break;
                    case "dateTimeField":
                        cellEditor = new qxnw.celleditor.dateTimeField;
                        break;
                    case "timeField":
                        cellEditor = new qxnw.celleditor.timeField;
                        break;
                    case "tokenField":
                        cellEditor = new qxnw.celleditor.tokenField;
                        break;
                    case "selectTokenField":
                        cellEditor = new qxnw.celleditor.selectTokenField;
                        break;
                    case "selectBox":
                        cellEditor = new qxnw.celleditor.selectBox;
                        break;
                    case "password":
                        cellEditor = new qx.ui.table.celleditor.PasswordField;
                        break;
                    case "checkBox":
                        cellEditor = new qxnw.celleditor.checkBox;
                        break;
                    case "uploader":
                        cellEditor = new qxnw.celleditor.uploader;
                        break;
                    case "email":
                        cellEditor.setValidationFunction(
                                function (newValue, oldValue) {
                                    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*\.(\w{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/;
                                    if (re.test(newValue))
                                    {
                                        return newValue;
                                    }
                                    alert("You did not enter a valid email address");
                                    return oldValue;
                                });
                        break;
                    case "regExp":
                        cellEditor.setValidationFunction(
                                function (newValue, oldValue) {
                                    var re = new RegExp(metaData['regExp']);
                                    if (re.test(newValue)) {
                                        return newValue;
                                    }
                                    alert(metaData['failMsg']);
                                    return oldValue;
                                });
                        break;
                    case "required":
                        validationFunc = function (newValue, oldValue) {
                            if (!newValue) {
                                alert("Debe ingresar un valor");
                                return oldValue;
                            }
                            return newValue;
                        };
                        break;
                }
                if (typeof d != 'undefined' && d != false) {
                    if (cellInfo.col == d.col && cellInfo.row == d.row) {
                        if (typeof d.enabled != 'undefined') {
                            cellEditor.setEnabled(d.enabled);
                        }
                    }
                }
                return cellEditor;
            };
            var propertyCellEditorFactory = new qx.ui.table.celleditor.Dynamic(propertyCellEditorFactoryFunc);

            var tcm = self.table.getTableColumnModel();
            var model = self.getModel();
            self.table.getSelectWhere = function (col, row) {
                if (typeof self.__selectBoxWheres.length != 'undefined') {
                    if (self.__selectBoxWheres.length != null) {
                        if (self.__selectBoxWheres.length > 0) {
                            for (var i = 0; i < self.__selectBoxWheres.length; i++) {
                                var r = self.__selectBoxWheres[i];
                                if (r["col"] == col) {
                                    if (r["row"] == row) {
                                        return r["where"];
                                    }
                                }
                            }
                        }
                    }
                }
            };
            self.table.getMethod = function (col, row) {
                if (typeof row != 'undefined') {
                    if (self.__selectBoxMethods.length > 0) {
                        for (var i = 0; i < self.__selectBoxMethods.length; i++) {
                            var r = self.__selectBoxMethods[i];
                            if (r["caption"] == col) {
                                if (r["row"] == row) {
                                    return r["method"];
                                }
                            }
                        }
                    }
                }
                var columns = self.allColumnsData;
                for (var i = 0; i < columns.length; i++) {
                    if (typeof columns[i].method != 'undefined') {
                        if (i == col) {
                            return columns[i].method;
                        }
                    }
                }
            };
            self.table.getHiddenColumns = function (col) {
                var columns = self.allColumnsData;
                for (var i = 0; i < columns.length; i++) {
                    if (typeof columns[i].hiddenColumns != 'undefined') {
                        if (i == col) {
                            return columns[i].hiddenColumns;
                        }
                    }
                }
            };
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
            var columns = self.allColumnsData;
            if (columns == null) {
                qxnw.utils.nwconsole(self.tr("Debe instanciar primero las columnas antes de la función {setListEdit}"));
                return;
            }
            for (var i = 0; i < columns.length; i++) {
                if (typeof columns[i].type != 'undefined') {
                    tcm.setDataCellRenderer(i, propertyCellRendererFactory);
                    tcm.setCellEditorFactory(i, propertyCellEditorFactory);

                    if (columns[i].type == "uploader") {
                        self.removeFromImagesOnTap(i);
                    }
                }
                if (typeof columns[i].editable != 'undefined') {
                    model.setColumnEditable(i, columns[i].editable);
                    self.setMaxEditableColumn(i);
                }
            }
            self.table.addListener("appear", function () {
                if (self.getHandleNormalBehavior()) {
                    var tcm = self.table.getTableColumnModel();
                    self.table.addListener("dataEdited", function (e) {
                        if (typeof self.table == 'undefined' || self.table == null || self.model == null) {
                            return;
                        }
                        self.table.cancelEditing();
                        var data = e.getData();
                        var columnCount = self.table.getTableModel().getColumnCount();
                        var maxEditable = self.checkMaxEditableColumn();
                        var minEditable = self.checkMinEditableColumn();
                        var maxRows = self.model.getRowCount();

                        if (self.getVerticalBehavior()) {
                            if (data.col <= maxEditable) {
                                if (data.col < columnCount) {
                                    if (data.row == (maxRows - 1) && data.col == maxEditable) {
                                        self.table.setFocusedCell(minEditable, -1);
                                        return;
                                    }
                                    if (data.col == maxEditable) {
                                        self.table.setFocusedCell(minEditable, data.row);
                                        return;
                                    }
                                    for (var iz = data.col; iz < columnCount; iz++) {
                                        var col = iz + 1;
                                        if (self.model.isColumnEditable(col)) {
                                            self.table.setFocusedCell(col, data.row - 1);
                                            break;
                                        }
                                    }
                                } else {
                                    self.setFocusedCell(0, data.row);
                                }
                            }
                        } else {
                            if (self.getHaveToAddRow() === true) {
                                self.addEmptyRow(data.row + 1);
                            } else {
                                if (data.row == (maxRows - 1)) {
                                    if (data.col == maxEditable) {
                                        self.table.setFocusedCell(minEditable, -1);
                                        return;
                                    }
                                    for (var i = data.col; i < maxEditable; i++) {
                                        var col = i + 1;
                                        if (self.model.isColumnEditable(col)) {
                                            self.table.setFocusedCell(col, -1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            });
            self.command_new = new qx.ui.command.Command('Control+Alt+N');
            var func = function () {
                if (self.__isFocused) {
                    self.addEmptyRow();
                }
            };
            self.command_new.addListener('execute', func, this);
            if (self.getDeleteAutomaticRows()) {
                self.table.addListener("keyup", function (e) {
                    if (!self.table.isEditing()) {
                        if (e.getKeyIdentifier() == 'Delete') {
                            qxnw.utils.question(self.tr("¿Desea eliminar los registros seleccionados?"), function (e) {
                                if (e) {
                                    self.removeSelectedRows();
                                }
                            });
                        }
                    }
                });
            }

//            self.table.setAlwaysUpdateCells(true);
            self.table.addListener("cellTap", function (e) {
                var col = e.getColumn();
                var row = e.getRow();
                var type = self.getColumnTypeFromIndex(e.getColumn());
                self.table.startEditing();
                if (type == "checkBox") {
                    for (var i = 0; i < self._stateColumns.length; i++) {
                        if (self._stateColumns[i].col == col && self._stateColumns[i].row == row) {
                            if (self._stateColumns[i].enabled == false) {
                                return;
                            }
                        }
                    }
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
            self.table.setRowFocusChangeModifiesSelection(true);
            self.verifyColumnTypeEdit();

            try {
                self.ui["unSelectButton"].addListener("click", function () {
                    self.clearSelection();
                });
            } catch (e) {

            }
        },
        setListEditCallback: function setListEditCallback(call) {

        },
        removeRow: function removeRow() {

        },
        addEmptyRow: function addEmptyRow(actualRow) {
            var self = this;
            if (typeof self.table == 'undefined' || self.table == null || self.model == null) {
                return;
            }
            self.table.cancelEditing();
            if (self.table.isEditing()) {
                self.table.stopEditing();
            }
            var row = [];
            var rowItem = [""];
            row.push(rowItem);
            this.getModel().addRows(row);
            if (typeof actualRow == 'undefined') {
                actualRow = 0;
            } else {
                actualRow = actualRow + 1;
            }
            this.table.setFocusedCell(this.getFirstColumnVisible(), actualRow);
            this.table.updateContent();
            var pane = self.table.getPaneScroller(0);
            pane.getTablePane().activate();
            pane.resetShowCellFocusIndicator();
            pane.setShowCellFocusIndicator(true);
            pane.startEditing();
            if (!self.__isListEditAppear) {
                self.addListener("appear", function () {
                    pane.getFocusElement().focus();
                    self.table.getFocusElement().focus();
                    pane.getTablePane().activate();
                    self.__isListEditAppear = true;
                });
            } else {
                pane.getFocusElement().focus();
                self.table.getFocusElement().focus();
                pane.getTablePane().activate();
            }
            return actualRow;
        },
        addRpcRow: function addRpcRow(method, exec) {
            var self = this;
            self.__method = method;
            self.__exec = exec;
            var row = [];
            var rowItem = [""];
            row.push(rowItem);
            self.getModel().addRows(row);
            self.table.addListener("keypress", function (e) {
//self.table.startEditing();
            });
            //            self.table.addListener("dataEdited", function(e) {
//                var data = e.getData();
            //                data["columnName"] = self.columnNameFromIndex(data["col"]);
            //                if (data.length == 0) {
//                    return;
            //                }
            //                var rpc = new qxnw.rpc(self.getRpcUrl(), method);
//                rpc.setAsync(true);
            //                var func = function(r) {
            //                    if (r == null) {
            //                        return;
//                    }
            //                    if (r.length > 0) {
            //                        for (var i = 0; i < r.length; i++) {
            //                            self.addRowData(r[i]);
//                        }
            //                    } else {
//                        self.addRowData(r);
//                    }
//                };
//                rpc.exec(exec, data, func);
//            });
        },
        __objectToArrayOnColumns: function objectToArrayOnColumns(obj) {
            var self = this;
            var cols = new Array();
            var data = new Array();
            for (var i = 0; i < obj.length; i++) {
                var count = 0;
                var dat = [];
                for (cols in obj[i]) {
                    if (cols == "id" || self.getColumnTypeFromId(qxnw.utils.lowerFirst(cols)) == "integer") {
                        dat[self.columnIndexFromName(qxnw.utils.lowerFirst(cols))] = obj[i][cols] == null ? "" : parseInt(obj[i][cols]);
                    } else if (self.getColumnTypeFromId(qxnw.utils.lowerFirst(cols)) == "numeric") {
                        dat[self.columnIndexFromName(qxnw.utils.lowerFirst(cols))] = obj[i][cols] == null ? "" : parseInt(obj[i][cols]);
                    } else {
                        dat[self.columnIndexFromName(cols)] = obj[i][cols] == null ? "" : obj[i][cols] == "t" ? true : obj[i][cols] == "f" ? false : obj[i][cols];
                    }
                    count++;
                }
                data.push(dat);
            }
            return data;
        },
        addRowData: function addRowData(row) {
            var self = this;
            var rowCount = getRowCount();
            try {
                var data = self.__objectToArrayOnColumns([row]);
                self.table.getTableModel().addRows(data, 1);
                rowCount = rowCount + 1;
                self.table.resetCellFocus();
                self.table.resetShowCellFocusIndicator();
                var pane = self.table.getPaneScroller(0);
                pane.setFocusedCell(self.getFirstColumnVisible(), 0, true);
                var selectionModel = self.table.getSelectionModel();
                selectionModel.resetSelection();
                selectionModel.addSelectionInterval(0, 0);
                pane.setSelectBeforeFocus(true);
                self.table.startEditing();
                var cellEditor = self.table.getTableColumnModel().getCellEditorFactory(0);
                cellEditor.clear(cellEditor);
            } catch (e) {

            }
            return rowCount;
        }
    }
});