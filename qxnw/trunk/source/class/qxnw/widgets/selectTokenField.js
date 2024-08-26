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
 * TextField with table
 */
qx.Class.define("qxnw.widgets.selectTokenField", {
    extend: qx.ui.form.AbstractSelectBox,
    implement: [
        qx.ui.core.IMultiSelection,
        qx.ui.form.IModelSelection
    ],
    include: [
        qx.ui.core.MMultiSelectionHandling,
        qx.ui.form.MModelSelection
    ],
    events: {
        removeItem: "qx.event.type.Data",
        addItem: "qx.event.type.Data",
        loadData: "qx.event.type.Data",
        modelData: "qx.event.type.Data",
        checkGun: "qx.event.type.Data"
    },
    properties: {
//        value: {
//            apply: "_applyValue"
//        },
        uniqueIndex: {
            init: false
        },
        isListEdit: {
            init: false
        },
        isLoadedFirstModel: {
            init: false,
            check: "Boolean"
        },
        haveToSearch: {
            init: true
        },
        uniqueName: {
            init: null
        },
        minChars: {
            init: 2
        },
        itemLabel: {
            init: 1,
            check: "Integer"
        },
        itemTextLabel: {
            init: "nombre"
        },
        appearance: {
            refine: true,
            init: "token"
        },
        maxItems: {
            init: 1
        },
        hintText: {
            check: "String",
            nullable: true,
            event: "changeHintText",
            init: null
        },
        searchOnInputObligation: {
            check: "Boolean",
            init: true
        }
    },
    construct: function (placeholder) {
        this.base(arguments);
        var self = this;
        var flowLayout = new qx.ui.layout.Flow();
        this._setLayout(flowLayout);
        var textField = this._createChildControl("textfield");
        var filterRegExp = qxnw.utils.getFilterSpecialCharacteres();
        textField.setFilter(filterRegExp);
        textField.setLiveUpdate(true);
        //this.setStretch(true);

        var label = this._createChildControl("label");
        this.getApplicationRoot().add(label, {
            top: -10,
            left: -1000
        });
        textField.addListener("focusout", function (e) {
            if (self.getChildControl("list").isVisible()) {
                self.close();
            }
        });
        textField.addListener("focusin", function () {
            if (!self.getChildControl("list").isVisible()) {
                self.open();
            }
        });
        textField.addListener("changeEnabled", function (e) {
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

        label.setAppearance(textField.getAppearance());

        self.bind("width", textField, "width");

        textField.bind("value", label, "value");

        var placeHolder = self.tr("Digite para buscar...");
        if (!self.getSearchOnInput()) {
            placeHolder = self.tr("Enter para buscar...");
        }
        textField.setPlaceholder(placeHolder);
        textField.addListener("keypress", function (e) {
            self.__textFieldPressed(e);
        });
        textField.addListener("input", function (e) {
            if (self.getSearchOnInput()) {
                self.onTextChange(e);
            } else {
                self.activateTimerSearch();
            }
        });
        self.addListener("click", function () {
            if (self.hasResults) {
                self.toggle();
            }
        });
        this.addListener("focusin", function (e) {
            textField.fireNonBubblingEvent("focusin", qx.event.type.Focus);
        }, this);
        this.addListener("focusout", function (e) {
            textField.fireNonBubblingEvent("focusout", qx.event.type.Focus);
        }, this);
        textField.addListener("keydown", function (e) {
            self.onKeyInput(e);
        });
        self.setFocusable(true);
        self.__hiddenColumns = [];
        self.__columnsNames = [];
        self.columns = [];
        self.captions = [];
        self.__aproxWidthCols = {};

        self.setMinWidth(100);

        this.getValue = () => this.getData();
        this.setValue = (val) => this.setData(val);
    },
    destruct: function destruct() {
        try {
            this._disposeObjects("this.__table");
            this._disposeObjects("this.__model");
            this._disposeMap("this.__columnsNames");
            this._disposeMap("this.columns");
            this._disposeMap("this.captions");
        } catch (e) {

        }
    },
    members: {
        SELECTION_MANAGER: qxnw.tokenfield.SelectionManager,
        __table: null,
        _tries: 1,
        alterArray: null,
        __isCreatedTable: false,
        __model: null,
        __search: null,
        hasResults: false,
        __columnsNumber: null,
        __columnsNames: 0,
        selected: null,
        __itemsCount: 0,
        __old_item: null,
        __countDeleted: 0,
        __hiddenColumns: null,
        columns: null,
        captions: null,
        __handledTabIndex: null,
        __isAddedItem: false,
        __tabIndex: null,
        __timerActivated: false,
        __timerSearch: null,
        __isGun: false,
        checkBoxGun: null,
        __aproxWidthCols: null,
        checkLenVar: true,
        _applyValue: function _applyValue(val) {
            this.getChildControl('textfield').setValue(val);
        },
        setIsGun: function setIsGun(val) {
            var self = this;
            self.__isGun = val;
            if (self.checkBoxGun == null) {
                self.checkBoxGun = new qxnw.widgets.checkBox(this.tr("Pistola"));
                self.checkBoxGun.setFocusable(false);
                self.checkBoxGun.getChildControl("icon").setFocusable(false);
                self.checkBoxGun.addListener("changeValue", function (d) {
                    var data = d.getData();
                    self.__isGun = data;
                    qxnw.local.setData("nw_stf_is_gun", data);
                    if (data == true) {
                        self.setSearchOnInputObligation(false);
                    } else {
                        self.setSearchOnInputObligation(true);
                    }
                    self.fireDataEvent("checkGun", data);
                });
                self._addBefore(self.checkBoxGun, self.getChildControl("textfield"));
            }
            var isGun = qxnw.local.getData("nw_stf_is_gun");
            if (isGun != null) {
                self.checkBoxGun.setValue(isGun);
                if (isGun == true) {
                    self.setSearchOnInputObligation(false);
                } else {
                    self.setSearchOnInputObligation(true);
                }
                self.fireDataEvent("checkGun", val);
                return;
            }
            self.checkBoxGun.setValue(val);
            if (val == true) {
                this.setSearchOnInputObligation(false);
            } else {
                this.setSearchOnInputObligation(true);
            }
            self.fireDataEvent("checkGun", val);
        },
        activateTimerSearch: function activateTimerSearch() {
            var self = this;
            if (this.__timerSearch != null) {
                this.__timerSearch.stop();
            }
            var val = this.getChildControl("textfield").getValue();
            if (val.length > 4) {
                this.__timerSearch = new qx.event.Timer(2000);
                this.__timerSearch.start();
                this.__timerSearch.addListener("interval", function (e) {
                    self.onTextChange(e, true);
                    self.__timerSearch.stop();
                    self.__timerSearch.dispose();
                    self.__timerSearch = null;
                });
            }
        },
        getSearchOnInput: function getSearchOnInput() {
            var searchOnInput = qxnw.local.getData("nw_select_token_field_searchoninput");
            var searchOnInput = this.getSearchOnInputObligation();
            if (searchOnInput != true) {
                return searchOnInput;
            }
            if (searchOnInput == null) {
                return true;
            }
            return searchOnInput;
        },
        setPlaceholder: function setPlaceholder(text) {
            this.getChildControl('textfield').setPlaceholder(text);
        },
        focus: function focus() {
            var textField = this.getChildControl('textfield');
            if (textField.isVisible()) {
                textField.getFocusElement().focus();
            } else {
                this.getFocusElement().focus();
            }
        },
        setData: function setData(val) {
            this.getChildControl('textfield').setValue(val);
            return true;
        },
//        setValue: function setValue(val) {
//            console.log("SET VALUE 2");
//            this.getChildControl('textfield').setValue(val);
//            return true;
//        },
        // overridden
        getValue: function getValue() {
            var data = this.getData();
            return data;
        },
        setFilter: function setFilter(arg) {
            this.getChildControl('textfield').setFilter(arg);
        },
        _onBlur: function (e) {
            return;
        },
        _forwardStates: {
            focused: true
        },
        tabBlur: function tabBlur() {
            var field = this.getChildControl("textfield");
            field.getFocusElement().blur();
        },
        _onPopupChangeVisibility: function _onPopupChangeVisibility(e) {
            return;
        },
        _createChildControlImpl: function _createChildControlImpl(id) {
            var control;
            switch (id) {
                case "label":
                    control = new qx.ui.basic.Label();
                    control.hide();
                    break;
                case "button":
                    return null;
                    break;
                case "textfield":
                    control = new qx.ui.form.TextField();
                    control.setFocusable(false);
                    control.addState("inner");
                    control.addListener("blur", this.close, this);
                    this._add(control, {
                        stretch: true
                    });
                    break;
                case "list":
                    control = this.base(arguments, id);
                    //control.setFocusable(false);
                    //control.setKeepFocus(true);
                    control.setEnableInlineFind(false);
                    control.setSelectionMode("single");
                    break;
                case "popup":
                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
                    control.setFocusable(false);
                    control.setAutoHide(true);
                    control.setKeepActive(true);
                    //control.addListener("mouseup", this.close, this);
                    control.add(this.getChildControl("list"));
                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
                    break;
            }
            return control || this.base(arguments, id);
        },
        activateFirstRow: function activateFirstRow() {
            var self = this;
            if (self.__model !== null) {
                var rowCount = self.__model.getRowCount();
                if (rowCount == 0) {
                    return;
                }
            }
            var pane = self.__table.getPaneScroller(0);
            pane.getTablePane().activate();
        },
        onKeyInput: function onKeyInput(e) {
            var self = this;
            var key = e.getKeyIdentifier();
            if (key == "Down") {
                if (self.__table != null) {
                    self.activateFirstRow();
                }
                e.stopPropagation();
            } else if (key == "Enter") {
                if (self.__isGun == true) {
                    e.stop();
                    e.stopPropagation();
                    self.addListenerOnce("modelData", function () {
                        self.activateFirstRow();
                        var row = self.__table.getFocusedRow();
                        if (row == null) {
                            return;
                        }
                        var data = self.__table.getTableModel().getRowData(row);
                        if (typeof data != 'undefined') {
                            if (data != null) {
                                for (var i = 0; i < data.length; i++) {
                                    data[i] = self.clearB(data[i]);
                                }
                                self.responseTable(data);
                            }
                        }
                    });
                }
                if (self.__table != null) {
                    self.activateFirstRow();
                }
            }
        },
        _onListChangeSelection: function _onListChangeSelection(e) {
            var current = e.getData();
            if (current.length > 0) {
                var list = this.getChildControl("list");
                var popup = this.getChildControl("popup");
                var context = list.getSelectionContext();
                if (popup.isVisible() && (context == "quick" || context == "key")) {
                    this._preSelectedItem = current[0];
                } else {
                    this._preSelectedItem = null;
                }
            }
            return null;
        },
        handleTabIndex: function handleTabIndex(tabIndex) {
            this.__handledTabIndex = tabIndex;
            this.startHandlingIndex();
        },
        startHandlingIndex: function startHandlingIndex() {
            try {
                var childs = this._getChildren();
                var haveChildren = false;
                for (var i = 0; i < childs.length; i++) {
                    var model = null;
                    try {
                        if (typeof childs[i].getModel != 'undefined') {
                            model = childs[i].getModel();
                            haveChildren = true;
                        }
                        break;
                    } catch (e) {
                    }
                }
                if (!haveChildren && this.__handledTabIndex != null) {
                    this.getChildControl('textfield').setTabIndex(this.__handledTabIndex);
                } else if (this.__handledTabIndex != null) {
                    this.getFocusElement().setTabIndex(this.__handledTabIndex);
                }
            } catch (e) {

            }
        },
        cleanAll: function cleanAll() {
            var self = this;
            var childs = self._getChildren();
            for (var i = 0; i < childs.length; i++) {
                if (typeof childs[i] != 'undefined') {
                    try {
                        if (childs[i].getAppearance() == 'tokenitem') {
                            var item = childs[i];
                            self.removeFromSelection(item);
                            self.fireDataEvent("removeItem", item);
                            item.destroy();
                        }
                    } catch (e) {
                        qxnw.utils.nwconsole(e);
                    }
                }
            }
            if (childs.length > 0) {
                self.getChildControl('textfield').setVisibility("visible");
            }
            self.getChildControl('textfield').setValue("");
            try {
                if (self.__table != null) {
                    var arr = [];
                    var arr1 = [];
                    self.__table.getTableModel().setData(arr, arr1);
                }
            } catch (e) {
                console.log(e);
            }
        },
        clean: function clean(item) {
            var self = this;
            self.__itemsCount--;
            if (item && item.constructor == qxnw.widgets.listItem) {
                self.removeFromSelection(item);
                self.fireDataEvent("removeItem", item);
                item.destroy();
            }
//            self.startHandlingIndex();
        },
        _deselectItem: function _deselectItem(item) {
            var self = this;
            if (self.__itemsCount == 0) {
                return;
            }
            self.__itemsCount--;
            if (item && item.constructor == qxnw.widgets.listItem) {
                self.removeFromSelection(item);
                self.fireDataEvent("removeItem", item);
                item.destroy();
            }
            //self.setFocusable(false);
//            self.startHandlingIndex();
            self.__isAddedItem = false;
            self.getChildControl('textfield').setVisibility("visible");
        },
        focusAll: function focusAll() {
            this.base(arguments);
            if (this.getChildControl("textfield").isVisible()) {
                this.getChildControl("textfield").getFocusElement().focus();
            } else {
                this.getFocusElement().focus();
            }
        },
        setAllTabIndex: function setAllTabIndex(index) {
            this.getChildControl("textfield").setTabIndex(index);
            this.setTabIndex(index);
        },
        // overridden
        tabFocus: function tabFocus() {
            if (this.__isAddedItem) {
                var childs = this._getChildren();
                for (var i = 0; i < childs.length; i++) {
                    if (childs[i] instanceof qxnw.widgets.listItem) {
                        try {
                            childs[i].getFocusElement().focus();
                            childs[i].addState("head");
                            this.selected = childs[i];
                            break;
                        } catch (e) {
                            qxnw.utils.nwconsole(e);
                        }
                    }
                }
            } else {
                var field = this.getChildControl("textfield");
                field.getFocusElement().focus();
            }
        },
        // overridden
        _onKeyPress: function _onKeyPress(e) {
            var key = e.getKeyIdentifier();
            //var list = this.getChildControl("popup");
            //&& !list.isVisible()
            if (key == "Down") {
                this.open();
                if (this.__table != null) {
                    this.activateFirstRow();
                }
                e.stopPropagation();
                e.stop();
            } else if (key == "Backspace" || key == "Delete") {
                var textfield = this.getChildControl('textfield');
                var value = textfield.getValue();
                if (key == "Delete") {
                    if (value.length == 1 || value.length == 0) {
                        this.hasResults = false;
                        this.setHaveToSearch(true);
                    }
                }
                var children = this._getChildren();
                var index = children.indexOf(textfield);

                if (value == null || value == "" && !this.selected) {
                    if (key == "Delete" && index < (children.length - 1)) {
                        this.selected = children[index + 1];
                        this.selected.addState("head");
                        this.focus();
                    } else if (key == "Backspace" && index > 0) {
                        this.selected = children[index - 1];
                        this.selected.addState("head");
                        this.focus();
                    }
                } else if (this.selected) {
                    this._deselectItem(this.selected);
                    this.selected = null;
                    this.tabFocus();
                    e.stop();
                }
            } else if (key == "Left" || key == 'Right') {
                var textfield = this.getChildControl('textfield');
                var start = textfield.getTextSelectionStart();
                var length = textfield.getTextSelectionLength();
                var children = this._getChildren();
                var n_children = children.length;

                var item = this.selected ? this.selected : textfield;
                var index = children.indexOf(item);
                if (item == textfield) {
                    if (key == 'Left')
                        index -= 1;
                    else
                        index += 1;
                }

                var index_textfield = children.indexOf(textfield);

                if (key == "Left" && index >= 0 && start == 0 && length == 0) {
                    this._addBefore(textfield, children[index]);
                } else if (key == "Right" && index < n_children && start == textfield.getValue().length) {
                    this._addAfter(textfield, children[index]);
                }

                if (this.selected) {
                    this.selected.removeState("head");
                }
                this.selected = null;

                // I really don't know, but FF needs the timer to be able to set the focus right
                // when there is a selected item and the key == 'Left'
                qx.util.TimerManager.getInstance().start(function () {
                    this.tabFocus();
                }, null, this, null, 20);

            } else if (key == "Enter" || key == "Space") {
                if (key == "Enter") {
                    this.onTextChange(e, true);
                }
                if (this._preSelectedItem && this.getChildControl('popup').isVisible()) {
                    this._selectItem(this._preSelectedItem);
                    this._preSelectedItem = null;
                    this.toggle();
                } else if (key == "Space") {
                    var textfield = this.getChildControl('textfield');
                    textfield.setValue(textfield.getValue() + " ");
                    e.stop();
                }
            } else if (key == "Escape") {
                this.close();
                this.getChildControl("popup").hide();
            } else if (key != "Left" && key != "Right") {
                this.getChildControl("list").handleKeyPress(e);
            }
        },
        searchIntoModel: function searchIntoModel(str) {
            if (this.hasResults) {
                var data = this.alterArray;
                var isFinded = false;
                if (data != null && data != '') {
                    for (var i = 0; i < data.length; i++) {
                        for (var ia = 0; ia < data[i].length; ia++) {
                            if (data[i][ia] != null) {
                                if (data[i][ia].toLowerCase().indexOf(str.toLowerCase()) != -1) {
                                    data[i][ia] = this.highlight(data[i][ia], str);
                                    isFinded = true;
                                }
                            }
                        }
                        if (!isFinded) {
                            data.splice(data[i], 1);
                        }
                    }
                    if (isFinded) {
                        this.setModelData(this.alterArray);
                        return true;
                    }
                }
            }
            return false;
        },
        onTextChange: function onTextChange(e, sendedOnEnter) {
            var self = this;
            if (typeof sendedOnEnter == 'undefined') {
                sendedOnEnter = false;
            }
            if (sendedOnEnter === false) {
                var str = e.getData();
            } else {
                var str = self.getChildControl('textfield').getValue();
            }

            var len = str.length;

            if (str === null || (str !== null && len < this.getMinChars())) {
                return false;
            }

            var checkLen = self.checkLenVar;

            if (checkLen) {
                if (len % 2 != 0) {
                    return false;
                }
            } else {
                self.checkLenVar = true;
            }

            if (self.__isDelete) {
                self.__isDelete = false;
                if (this.__countDeleted >= 1) {
                    this.__countDeleted = 0;
                } else {
                    return;
                }
            }
            self.__search = str;
            if (!self.__isCreatedTable) {
                self._cleanAll();
                self.getChildControl('list').add(self.createTable(), {
                    flex: 1
                });
            }
            //if (self.getHaveToSearch()) {
            self.response(str);
            self.setHaveToSearch(false);
            //} else {
            //   self.setHaveToSearch(true);
            //}
            self.__isCreatedTable = true;
            return true;
        },
        response: function response(response) {
            this.fireDataEvent("loadData", response);
        },
        __textFieldPressed: function __textFieldPressed(e) {
            var key = e.getKeyIdentifier();
            var isCtrlPressed = e.isCtrlPressed();

            if (isCtrlPressed && (key === "v" || key === "V")) {
                this.checkLenVar = false;
            }

            var list = this.getChildControl("popup");
            if (key === "Down" && !list.isVisible()) {
                this.open();
                if (this.__table != null) {
                    this.activateFirstRow();
                }
                e.stopPropagation();
                e.stop();
            } else if (key === "Backspace" || key === "Delete") {
                this._deselectItem(this.selected);
                this.selected = null;
                this.tabFocus();
                this.__isDelete = true;
                this.__countDeleted++;
                //e.stop();
            }
        },
        _onClick: function _onClick(e) {
            this.toggle();
        },
        processAutoWidth: function processAutoWidth() {
            var self = this;
            var cm = self.__table.getTableColumnModel();

            for (var w in self.__aproxWidthCols) {
                var width = parseInt(self.__aproxWidthCols[w]);

                if (typeof self.captions[w] != 'undefined') {
                    if (width < self.captions[w].length) {
                        width = self.captions[w].length;
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

                delete canvas;
                delete ctx;
                delete text;

                canvas = null;
                ctx = null;
                text = null;

            }
        },
        setModelData: function setModelData(data) {
            var self = this;
//            if (data.length == 0) {
//                return;
//            }
            try {
                self.hasResults = true;
                var columns = self.getColumnsNames(data);
                if (columns == null) {
                    if (self.__model !== null) {
                        self.__model.clean();
                    }
                    return;
                }
                for (var i = 0; i < columns.length; i++) {
                    self.columns[i] = columns[i].replace("_", " ");
                    self.captions[i] = columns[i].toLowerCase();
                }
                if (self.__model == null) {
                    return;
                }
                if (self.__table == null) {
                    return;
                }
                self.allColumnsData = columns;
                self.__model.setColumns(self.columns, self.captions);
                var transformArray = self.objectsToArrays(data);
                self.__model.setData(transformArray);
                self.__table.setTableModel(self.__model);
                self.makeHTMLColumns();
                self.__table.setFocusedCell(0, 0, true);
                self.hideColumns();
                self.__model.setStoredColumnSorted();

                try {
                    if (data.length > 0) {
                        self.processAutoWidth();
                    }
                } catch (e) {
                    qxnw.utils.nw_console(e, "", false);
                }

                self.__table.setStoredColumnsWidth();
                self.open();
            } catch (e) {
                qxnw.utils.error(e);
            }
            var arr = {};
            self.fireDataEvent("modelData", arr);
        },
        columnIndexFromName: function columnIndexFromName(columnName) {
            var self = this;
            if (self.captions.length == 0) {
                return;
            }
            for (var i = 0; i < self.captions.length; i++) {
                if (self.captions[i] == columnName) {
                    return i;
                }
            }
            return -1;
        },
        hideColumns: function hideColumns() {
            for (var i = 0; i < this.__hiddenColumns.length; i++) {
                var column = this.columnIndexFromName(this.__hiddenColumns[i]);
                if (column == -1) {
                    return;
                }
                if (typeof column == 'undefined') {
                    return;
                }
                try {
                    this.__table.getTableColumnModel().setColumnVisible(column, false);
                } catch (e) {
                    return;
                }
            }
        },
        highlight: function highlight(value, query) {
            if (value === null) {
                return;
            }
            if (value === "") {
                return "";
            }
            if (value === 0) {
                return 0;
            }
            query = qxnw.utils.cleanSpecialCharacteres(query);
            return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + query + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<b>$1</b>");
        },
        makeHTMLColumns: function makeHTMLColumns() {
            var self = this;
            for (var i = 0; i < self.__columnsNumber; i++) {
                self.__table.getTableColumnModel().setDataCellRenderer(i, new qx.ui.table.cellrenderer.Html());
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
                    if (cols == "id" || self.getColumnTypeFromName(qxnw.utils.lowerFirst(cols)) == "integer") {
                        dat[self.columnIndexFromName(qxnw.utils.lowerFirst(cols))] = obj[i][cols] == null ? "" : parseInt(obj[i][cols]);
                    } else {
                        dat[self.columnIndexFromName(qxnw.utils.lowerFirst(cols))] = obj[i][cols] == null ? "" : obj[i][cols];
                    }
                    count++;
                }
                data.push(dat);
            }
            return data;
        },
        objectsToArrays: function objectsToArrays(object) {
            var self = this;
            var all = new Array();
            var allAlter = new Array();
            var cols = new Array();
            for (var i = 0; i < object.length; i++) {
                var arr = [];
                var alterArr = [];
                var count = 0;
                for (cols in object[i]) {
                    if (typeof object[i][cols] === 'undefined' || object[i][cols] === null) {
                        object[i][cols] = "";
                    }
                    arr[count] = self.highlight(object[i][cols], self.__search);
                    alterArr[count] = object[i][cols];
                    var w = typeof arr[count] !== 'undefined' ? arr[count].length : 0;
                    if (typeof self.__aproxWidthCols[count] !== 'undefined') {
                        if (self.__aproxWidthCols[count] < w) {
                            self.__aproxWidthCols[count] = w;
                        }
                    } else {
                        self.__aproxWidthCols[count] = w;
                    }
                    count++;
                }
                all.push(arr);
                allAlter.push(alterArr);
            }
            self.alterArray = allAlter;
            return all;
        },
        /**
         * Hide a column by name
         * @param columnName {String}  the column name
         * @return {void}
         */
        hideColumn: function hideColumn(columnName) {
            this.__hiddenColumns.push(columnName);
        },
        //var t = self.ui.selectTokenField.getTable();
        setColumnWidth: function setColumnWidth(col, width) {
            if (this.__table != null) {
                this.__table.setColumnWidth(col, width);
            }
        },
        getColumnsNames: function getColumnsNames(data) {
            var self = this;
            if (typeof data == 'undefined') {
                return null;
            }
            var cols = new Array();
            self.__columnsNumber = 0;
            if (self.__columnsNames.length == 0) {
                self.__columnsNames = new Array();
            }
            for (var i = 0; i < data.length; i++) {
                var arr = [];
                var count = 0;
                for (cols in data[i]) {
                    self.__columnsNames[count] = cols;
                    cols = qxnw.utils.ucFirst(cols);
                    arr[count] = cols;
                    count++;
                    self.__columnsNumber = count;
                }
                break;
            }
            return arr;
        },
        getData: function getData() {
            var self = this;
            var children = self._getChildren();
            var all = new Array();
            for (var i = 0; i < children.length; i++) {
                if (children[i].getAppearance() == 'tokenitem') {
                    var model = children[i].getModel();
                    all.push(model);
                }
            }
            return all;
        },
        _onListPointerDown: function _onListPointerDown() {
            return false;
        },
        _cleanAll: function _cleanAll() {
            var self = this;
            self.getChildControl('list').removeAll();
        },
        getAppWidgetName: function getAppWidgetName() {
            var name = this.classname;
            name = this.getUniqueName("table") + "_" + name;
            return name;
        },
        getTable: function getTable() {
            return this.__table;
        },
        setColumnLabelByName: function setColumnLabelByName(name, label) {
            var self = this;
            var tableModel = this.__table.getTableModel();
            for (var i = 0; i < self.captions.length; i++) {
                if (self.captions[i] == name) {
                    var col = tableModel.getColumnIndexById(name);
                    if (col == null) {
                        break;
                    }
                    var paneHeaderWidget = this.__table.getPaneScroller(0).getHeader();
                    var w = paneHeaderWidget.getHeaderWidgetAtColumn(col);
                    var t = new qx.event.Timer(100);
                    t.start();
                    t.addListener("interval", function (e) {
                        t.stop();
                        w.setLabel(label);
                    });
                    break;
                }
            }
        },
        getColumnTypeFromColumn: function getColumnTypeFromColumn() {
            return null;
        },
        createTable: function createTable() {
            var self = this;
            var con = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            self.__model = new qxnw.table.modelFiltered();
            self.getChildControl('list').addListener("appear", function () {
                var these = this;
                var timer = new qx.event.Timer(1);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    var maxW = self.getChildControl('popup').getBounds();
                    var widthDisplay = qx.bom.Viewport.getWidth();
                    var fw = parseInt(widthDisplay - maxW.left);
                    if (fw > widthDisplay) {
                        fw = widthDisplay;
                    }
                    if (self.__table != null) {

                        if (fw < 100) {
                            return;
                        }

                        self.__table.setMaxWidth(fw - 10);

//                        these.setMaxHeight(self.__table.getHeight());
                    }
                });
            });
            self.__model.setParent(self);
            self.__table = new qxnw.table.table().set({
                decorator: null,
                showCellFocusIndicator: true,
                focusable: false
            });
            self.__table.setEnabledFilters(false);
            self.__table.setParent(self);
            self.__table.addListener("cellTap", function (e) {
                var row = self.__table.getFocusedRow();
                if (row == null) {
                    return;
                }
                var data = self.__table.getTableModel().getRowData(row);
                for (var i = 0; i < data.length; i++) {
                    data[i] = self.clearB(data[i]);
                }
                self.responseTable(data);
            });
            self.__table.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                var row = null;
                var data = null;
                if (key == 'Enter') {
                    row = self.__table.getFocusedRow();
                    if (row == null) {
                        return;
                    }
                    data = self.__table.getTableModel().getRowData(row);
                    if (typeof data == 'undefined') {
                        self.close();
                        self.getChildControl("popup").hide();
                        return;
                    }
                    for (var i = 0; i < data.length; i++) {
                        data[i] = self.clearB(data[i]);
                    }
                    self.responseTable(data);
                } else if (key == "Escape") {
                    self.close();
                    self.getChildControl("popup").hide();
                }
            });
            con.add(self.__table, {
                flex: 1
            });
            return con;
        },
        reset: function reset() {
            var childs = this._getChildren();
            for (var i = 0; i < childs.length; i++) {
                var model = null;
                try {
                    model = childs[i].getModel();
                } catch (e) {
                }
                if (model != null) {
                    this._removeAt(i);
                }
                this.__itemsCount = 0;
            }
        },
        responseTable: function responseTable(response) {
            var self = this;
            if (self.getChildControl('popup').isVisible()) {
                self.getChildControl('popup').hide();
            }
            self._selectItem(response);
            this.toggle();

            var list = this.getChildControl("popup");
            if (list.isVisible()) {
                self.close();
            }
            self.setFocusable(true);
            this.getFocusElement().focus();
        },
        _selectItem: function _selectItem(data) {
            var self = this;
            if (self.__itemsCount >= self.getMaxItems()) {
                var childs = self._getChildren();
                for (var i = 0; i < childs.length; i++) {
                    var model = null;
                    try {
                        model = childs[i].getModel();
                    } catch (e) {
                    }
                    if (model != null) {
                        self._removeAt(i);
                        if (self.__itemsCount > 0) {
                            self.__itemsCount--;
                        }
                        break;
                    }
                }
            }
            var item = new qxnw.widgets.listItem();
            item.setAppearance("tokenitem");
            if (typeof data[self.getItemLabel()] == 'undefined') {
                return;
            }
            var label = data[self.getItemLabel()] == 0 ? '' : data[self.getItemLabel()];
            label = qxnw.utils.replaceAll(label, "<b>", "");
            label = qxnw.utils.replaceAll(label, "</b>", "");
            item.setLabel(label);
            //var arr = new Array();
            var arr = {};
            var model = data;
            for (var i = 0; i < model.length; i++) {
                arr[self.__columnsNames[i]] = model[i];
            }

            var uniqueIndex = self.getUniqueIndex();
            if (uniqueIndex == true) {
                var childs = self._getChildren();
                for (var i = 0; i < childs.length; i++) {
                    var model = null;
                    try {
                        model = childs[i].getModel();
                        if (model != null) {
                            if (model.id == arr["id"]) {
                                return;
                            }
                        }
                    } catch (e) {
                    }
                }
            }

            if (typeof arr["nombre"] != 'undefined' && arr["nombre"] != null && arr["nombre"] != '') {
                label = arr["nombre"];
                label = qxnw.utils.replaceAll(label, "<b>", "");
                label = qxnw.utils.replaceAll(label, "</b>", "");
                item.setLabel(label);
            }
            item.setModel(arr);
            item.getChildControl('icon').setAnonymous(false);
            item.setIconPosition("right");
            item.getChildControl('icon').addListener("mouseover", function () {
                item.addState('close');
            });
            item.getChildControl('icon').addListener("mouseout", function () {
                item.removeState('close');
            });
            item.getChildControl('icon').addListener("click", function (e) {
                if (self.selected) {
                    self.selected.removeState("head");
                    self.selected = null;
                }
                self._deselectItem(item);
                e.stop();
                this.tabFocus();
                self.getChildControl('textfield').setVisibility("visible");
            }, this);
            item.addListener("click", function (e) {
                if (item.hasState("head")) {
                    item.removeState("head");
                } else {
                    item.addState("head");
                }
                self.selected = item;
                e.stop();
            }, this);
            self._addBefore(item, self.getChildControl('textfield'));
            self.addToSelection(item);
            self.getChildControl('textfield').setValue("");
            self.getChildControl('textfield').getFocusElement().focus();
            //item.getFocusElement().focus();
            self.__itemsCount++;
            self.__isAddedItem = true;
            if (self.getMaxItems() == self.__itemsCount) {
                self.getChildControl('textfield').setVisibility("excluded");
            }
            if (self.getMaxItems() == 1) {
                item.addState("head");
            }
            if (self.getMaxItems() > 1) {
                self.resetMaxHeight();
            }
            self.fireDataEvent("addItem", arr);
        },
        clearB: function clearB(text) {
            if (typeof text === 'undefined') {
                return;
            }
            if (text === "") {
                return "";
            }
            if (text === 0) {
                return 0;
            }
            text = qxnw.utils.replaceAll(text, "<b>", "");
            text = qxnw.utils.replaceAll(text, "</b>", "");
            return text;
        },
        addTokenOK: function addTokenOK(data, name, noRemove) {
            this._selectItem(data);
        },
        addToken: function addToken(data, name, noRemove) {
            var self = this;
            var childs = self._getChildren();
            if (typeof noRemove == 'undefined') {
                noRemove = false;
            }
            if (noRemove === false) {
                for (var i = 0; i < childs.length; i++) {
                    var model = null;
                    try {
                        if (typeof childs[i].getModel != 'undefined') {
                            model = childs[i].getModel();
                        }
                    } catch (e) {
                    }
                    if (model != null) {
                        self._removeAt(i);
                    }
                    self.__itemsCount = 0;
                }
            }
            if (self.__itemsCount >= self.getMaxItems()) {
                return;
            }
            var item = new qxnw.widgets.listItem();
            item.setAppearance("tokenitem");
            var nameText = typeof data["nombre"] == 'undefined' ? typeof name == 'undefined' ? "" : name : data["nombre"];
            item.setLabel(String(nameText));
            var arr = new Array();
            arr.push(data);
            //var model = qx.data.marshal.Json.createModel(data);
            item.setModel(data);

            item.setUserData("model", data);
            item.getChildControl('icon').setAnonymous(false);
            item.setIconPosition("right");
            item.getChildControl('icon').addListener("mouseover", function () {
                item.addState('close');
            });
            item.getChildControl('icon').addListener("mouseout", function () {
                item.removeState('close');
            });
            item.getChildControl('icon').addListener("click", function (e) {
                if (self.selected) {
                    self.selected.removeState("head");
                    self.selected = null;
                }
                self._deselectItem(item);
                e.stop();
                this.tabFocus();
                self.getChildControl('textfield').setVisibility("visible");
            }, this);
            item.addListener("click", function (e) {
                if (item.hasState("head")) {
                    item.removeState("head");
                } else {
                    item.addState("head");
                }
                self.selected = item;
                e.stop();
            }, this);
            self._addBefore(item, self.getChildControl('textfield'));
            if (self == null) {
                return;
            }
            self.addToSelection(item);
            self.fireDataEvent("addItem", data);
            self.getChildControl('textfield').setValue("");
            self.getChildControl('textfield').getFocusElement().focus();
            if (self.getMaxItems() > 1) {
                self.resetMaxHeight();
            }
            if (self.getMaxItems() == 1) {
                item.addState("head");
            }
            self.__itemsCount++;
            if (self.getMaxItems() == self.__itemsCount) {
                self.getChildControl('textfield').setVisibility("excluded");
            }
            self.__old_item = item;
            self.__isAddedItem = true;
        }
    }
});