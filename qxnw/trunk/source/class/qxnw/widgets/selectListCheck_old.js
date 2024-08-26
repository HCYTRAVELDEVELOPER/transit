/* ************************************************************************
 
 Copyright:
 2015 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */

/**
 * TextField with list check
 */
qx.Class.define("qxnw.widgets.selectListCheck_old", {
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
        loadData: "qx.event.type.Data"
    },
    properties: {
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
            init: "nombre",
            check: "string"
        },
        appearance: {
            refine: true,
            init: "token"
        },
        maxItems: {
            init: 30
        },
        hintText: {
            check: "String",
            nullable: true,
            event: "changeHintText",
            init: null
        }
    },
    construct: function (placeholder) {
        this.base(arguments);
        var self = this;
        this._setLayout(new qx.ui.layout.Flow());
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
        textField.addListener("focusout", function () {
            if (self.getChildControl("list").isVisible()) {
                self.close();
            }
        });
        textField.addListener("focusin", function () {
            if (!self.getChildControl("list").isVisible()) {
                self.open();
            }
        });
        self.getChildControl("list").setContextMenuFromDataCellsOnly = function (bol) {
            return true;
        };
        self.getChildControl("list").getTable = function () {
            return this;
        };
        self.__contextMenuIdListener = self.getChildControl("list").addListener("contextmenu", function (e) {
            var target = e.getTarget();
            if (target.classname == "qxnw.widgets.listItem" || target.classname == "qx.ui.form.CheckBox") {
                var children = this.getChildren();
                for (var i = 0; i < children.length; i++) {
                    children[i].removeState("selected");
                }
                this.setSelection([target]);
                target.addState("selected");
                self.contextMenu(e, target);
            } else {
                e.stop();
                e.preventDefault();
                return;
            }
        });

        //COPY PARAMETERS
        self.getChildControl("list").addListener("focusin", function (e) {
            self.__isFocused = true;
            if (typeof self.command_copy != 'undefined') {
                self.command_copy.setEnabled(true);
            }
        });
        self.getChildControl("list").addListener("focusout", function (e) {
            self.__isFocused = false;
            if (typeof self.command_copy != 'undefined') {
                self.command_copy.setEnabled(false);
            }
        });
        self.command_copy = new qx.ui.command.Command('Control+C');
        var func = function () {
            if (self.__isFocused) {
                self.slotCopy();
            }
        };
        self.command_copy.addListener('execute', func, this);
        self.command_copy.setEnabled(false);

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
        textField.setPlaceholder(self.tr("Digite para buscar..."));
        textField.addListener("keypress", function (e) {
            self.__textFieldPressed(e);
        });
        textField.addListener("input", function (e) {
            self.onTextChange(e);
        });
        self.addListener("click", function () {
            if (self.__hasResults) {
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
        self.columns = [];
        self.captions = [];

        self.__items = [];
        self.__selectedIds = [];
    },
    destruct: function destruct() {
        try {
            this._disposeObjects("__table");
            this._disposeObjects("__model");
            this._disposeObjects("__columnsNames");
            this._disposeObjects("columns");
            this._disposeObjects("captions");
        } catch (e) {

        }
    },
    members: {
        __items: null,
        __selectedIds: null,
        __haveToEnter: true,
        command_copy: null,
        SELECTION_MANAGER: qxnw.tokenfield.SelectionManager,
        __table: null,
        _tries: 1,
        alterArray: null,
        __isCreatedTable: false,
        __model: null,
        __search: null,
        __hasResults: false,
        __columnsNumber: null,
        __columnsNames: 0,
        __selected: null,
        __itemsCount: 0,
        __old_item: null,
        __countDeleted: 0,
        __hiddenColumns: null,
        columns: null,
        captions: null,
        __handledTabIndex: null,
        __isAddedItem: false,
        __tabIndex: null,
        __contextMenuIdListener: null,
        __isFocused: null,
        getTable: function getTable() {
            return this.getChildControl("list");
        },
        cleanAllColors: function cleanAllColors() {
            var self = this;
            var childs = self.getChildControl("list").getChildren();
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].classname == "qxnw.widgets.listItem" || childs[i].classname == "qx.ui.form.CheckBox") {
                    var label = qxnw.utils.cleanHtml(childs[i].getLabel());
                    childs[i].setLabel(label);
                }
            }
        },
        slotCopy: function slotCopy() {
            var self = this;
            var selection = self.getChildControl("list").getSelection();
            if (selection.length == 0) {
                qxnw.utils.information(self.tr("Debe seleccionar un ítem para copiar"));
                return;
            }
            var text = selection[0].getLabel();
            text = qxnw.utils.cleanHtml(text);
            window.prompt(self.tr("Texto a copiar: (Presiona nuevamente CTRL+C)"), text);
        },
        indexOf: function indexOf(widget) {
            return this.getChildControl("list").indexOf(widget);
        },
        setModelToItem: function setModelToItem(item, arr) {
            var self = this;
            var index = this.indexOf(item);
            var items = this.getChildControl("list").getChildren();
            var itemFinded = false;
            for (var i = 0; i < items.length; i++) {
                if (i == index) {
                    itemFinded = items[i];
                }
            }
            var model = null;
            var modelAfter = null;
            if (itemFinded != false) {
                model = itemFinded.getModel();
                modelAfter = itemFinded.getModel();
                for (var v in arr) {
                    model[v] = arr[v];
                }
                itemFinded.setModel(model);
            }

            var modelSelection = null;
            var childs = self._getChildren();
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].classname == "qxnw.widgets.listItem") {
                    modelSelection = childs[i].getUserData("model");
                    if (parseInt(modelAfter.id) == parseInt(modelSelection.id)) {
                        for (var v in arr) {
                            modelSelection[v] = arr[v];
                        }
                        var label = qxnw.utils.cleanHtml(childs[i].getLabel());
                        if (typeof arr.color != 'undefined') {
                            label = "<font color='" + arr.color + "'>" + label + "</font>";
                        }
                        childs[i].setLabel(label);
                        childs[i].setModel(modelSelection);
                        break;
                    }
                }
            }
            return true;
        },
        contextMenu: function contextMenu(pos, item) {
            var self = this;
            var m = new qxnw.contextmenu(self.getChildControl("list"));
            m.addAction(self.tr("Copiar"), qxnw.config.execIcon("edit-copy"), function (e) {
                self.slotCopy();
            });
            m.menu.setPosition("left-middle");
            m.menu.placeToWidget(item);
            m.menu.show();
        },
        close: function () {
            this.getChildControl("popup").hide();
            return false;
        },
        getCountAddedItems: function getCountAddedItems() {
            var selection = this._getChildren();
            var count = 0;
            for (var i = 0; i < selection.length; i++) {
                if (selection[i].classname == "qx.ui.form.TextField") {
                    continue;
                }
                count++;
            }
            return count;
        },
        _deselectItem: function _deselectItem(item) {
            var self = this;
            if (item == null) {
                return;
            }
            self.__itemsCount = self.__itemsCount--;
            var model = item.getUserData("model");
            if (item && item.constructor == qxnw.widgets.listItem) {
                self.removeFromSelection(item);
                self.fireDataEvent("removeItem", item);
                item.destroy();
            }
            self.startHandlingIndex();
            self.__isAddedItem = false;
            self.getChildControl('textfield').setVisibility("visible");
            self._unCheckListItemByModel(model);
        },
        addToken: function addToken(data) {
            var self = this;
            self._selectItem(data);
        },
        removeFromSelectedIds: function removeFromSelectedIds(model) {
            if (typeof model.id == 'undefined') {
                return;
            }
            for (var i = 0; i < this.__selectedIds.length; i++) {
                if (this.__selectedIds[i].id == model.id) {
                    this.__selectedIds.splice(i);
                }
            }
        },
        restoreItems: function restoreItems() {
            var self = this;
            var items = self.__items;
            self.getChildControl("list").removeAll();
            for (var i = 0; i < items.length; i++) {
                self.getChildControl("list").add(items[i]);
                var model = items[i].getModel();
                for (var ia = 0; ia < self.__selectedIds.length; ia++) {
                    if (parseInt(self.__selectedIds[ia].id) == parseInt(model.id)) {
                        self.__haveToEnter = false;
                        items[i].setValue(true);
                        self.__haveToEnter = true;
                    }
                }
            }
        },
        _selectItem: function _selectItem(data) {
            var self = this;
            var selection = self.getCountAddedItems();
            if (selection >= self.getMaxItems()) {
                return false;
            }
            var item = new qxnw.widgets.listItem().set({
                rich: true
            });
            item.setAppearance("tokenitem");
            if (typeof data[self.getItemLabel()] == 'undefined') {
                return;
            }
            var v = data[self.getItemLabel()] == 0 ? '' : data[self.getItemLabel()];

            var label = v;
            var color = data.color;
            if (typeof color != 'undefined') {
                label = "<font color='" + color + "'>" + v + "</font>";
            }

            item.setLabel(label);

            try {
                if (typeof data.id != 'undefined' && data.id != null) {
                    self.__selectedIds.push(data);
                }
            } catch (e) {

            }
            var model = qx.data.marshal.Json.createModel(data);
            item.setUserData("model", data);
            item.setModel(model);
            item.getChildControl('icon').setAnonymous(false);
            item.setIconPosition("right");
            item.getChildControl('icon').addListener("mouseover", function () {
                item.addState('close');
            });
            item.getChildControl('icon').addListener("mouseout", function () {
                item.removeState('close');
            });
            item.getChildControl('icon').addListener("click", function (e) {
                if (self.__selected) {
                    self.__selected.removeState("head");
                    self.__selected = null;
                }
                self._deselectItem(item);
                e.stop();
                this.tabFocus();
                self.getChildControl('textfield').setVisibility("visible");
            }, this);
            item.addListener("click", function (e) {
                item.addState("head");
                self.__selected = item;
                e.stop();
            }, this);
            self._addBefore(item, self.getChildControl('textfield'));
            self.addToSelection(item);
            self.fireDataEvent("addItem", data);
            self.getChildControl('textfield').setValue("");
            self.getChildControl('textfield').getFocusElement().focus();
            self.__itemsCount++;
            self.__isAddedItem = true;

            if (self.__itemsCount == self.getMaxItems()) {
                self.getChildControl('textfield').setVisibility("excluded");
            }
            self.restoreItems();
            return true;
        },
        setValue: function setValue(value) {
            this.getChildControl('textfield').setValue(value);
        },
        _search: function _search(text) {
            var self = this;
            if (typeof text == 'undefined' || text == null || text == '') {
                self.__populateWithoutRpc();
                return;
            }
            var children = self.__items;
            self.getChildControl("list").removeAll();
            for (var i = 0; i < children.length; i++) {
                var model = children[i].getUserData("model");
                if (model.nombre.toLowerCase().indexOf(text.toLowerCase()) != -1) {
                    var label = children[i].getLabel();
                    label = self.highlight(label, text);
                    children[i].setLabel(label);
                    self.getChildControl("list").add(children[i]);
                }
            }
        },
        __populateWithoutRpc: function __populateWithoutRpc() {
            var self = this;
            var children = self.__items;
            for (var i = 0; i < children.length; i++) {
                self.getChildControl("list").add(children[i]);
            }
        },
        _deselectItemByModel: function _deselectItemByModel(model) {
            var self = this;
            self.__itemsCount = self.__itemsCount - 1;
            if (model == null) {
                return;
            }
            var childs = self._getChildren();
            for (var i = 0; i < childs.length; i++) {
                var modelCh = null;
                if (childs[i].classname == "qxnw.widgets.listItem") {
                    modelCh = childs[i].getUserData("model");
                }
                if (modelCh != null) {
                    if (modelCh.id === model.id) {
                        self._removeAt(i);
                        break;
                    }
                }
                self.__itemsCount--;
            }
            self.startHandlingIndex();
            self.__isAddedItem = false;
        },
        deselectAllItems: function deselectAllItems() {
            var self = this;
            var childs = self._getChildren();
            for (var i = 0; i < childs.length; i++) {
                var modelCh = null;
                if (childs[i].classname == "qxnw.widgets.listItem") {
                    modelCh = childs[i].getUserData("model");
                }
                if (modelCh != null) {
                    self._removeAt(i);
                    i--;
                    //TODO: QUEDA EN EVALUACIÓN
                    //break;
                }
                self.__itemsCount--;
            }
            self.startHandlingIndex();
            self.__isAddedItem = false;
        },
        onKeyInput: function onKeyInput(e) {
            var key = e.getKeyIdentifier();
            if (key == "Down") {
                //this.getChildControl("list").getChildControl("pane").activate();
                e.stopPropagation();
            } else if (key == "Backspace") {
                var val = this.getChildControl("textfield").getValue();
                if (val == "" || val == null) {
                    this.restoreItems();
                } else if (val.length == 1) {
                    this.restoreItems();
                }
            }
        },
        onTextChange: function onTextChange(e) {
            var self = this;
            var str = e.getData();
            if (str == null || (str != null && str.length < this.getMinChars())) {
                return false;
            }
            if (self.__isDelete) {
                self.__isDelete = false;
                this.__populateWithoutRpc();
                this._search(str);
                if (this.__countDeleted == 2) {
                    this.__countDeleted = 0;
                } else {
                    return;
                }
            }
            self.__search = str;
            self.__search = str;
            self._search(str);
            self.response(str);
            self.__isCreatedTable = true;
            return true;
        },
        populateFromArray: function populateFromArray(arrays) {
            var self = this;
            for (var i = 0; i < arrays.length; i++) {
                var d = arrays[i];
                var item = new qx.ui.form.CheckBox(d["nombre"]);
                if (typeof d["value"] != 'undefined' && d["value"] != null && d["value"] != '') {
                    item.setValue(d["value"] == "true" || d["value"] == true || d["value"] == "t" ? true : false);
                }
                try {
                    if (typeof d.id != 'undefined' && d.id != null) {
                        for (var ia = 0; ia < self.__selectedIds.length; ia++) {
                            if (self.__selectedIds[ia].id == d.id) {
                                item.setValue(true);
                            }
                        }
                    }
                } catch (e) {

                }
                item.setFocusable(false);
                item.setModel(d);
                item.setUserData("model", d);
                item.setRich(true);
                item.addListener("changeValue", function (e) {
                    if (e.getData()) {
                        if (!self._selectItem(this.getUserData("model"))) {
                            this.setValue(false);
                        }
                    } else {
                        self._deselectItemByModel(this.getUserData("model"));
                    }
                });
                self.getChildControl("list").add(item);
                self.__items.push(item);
            }
            if (arrays.length > 0) {
                self.__hasResults = true;
            }
        },
        processPopulate: function processPopulate(r) {
            var self = this;
            self.removeAll();
            for (var i = 0; i < r.length; i++) {
                var d = r[i];
                var token;
                if (typeof token == 'undefined') {
                    token = '';
                }
                var item = new qx.ui.form.CheckBox(d["nombre"]);
                if (typeof d["value"] != 'undefined' && d["value"] != null && d["value"] != '') {
                    item.setValue(d["value"] == "true" || d["value"] == true || d["value"] == "t" ? true : false);
                }

                try {
                    if (typeof d.id != 'undefined' && d.id != null) {
                        for (var ia = 0; ia < self.__selectedIds.length; ia++) {
                            if (self.__selectedIds[ia].id == d.id) {
                                item.setValue(true);
                            }
                        }
                    }
                } catch (e) {

                }

                item.setFocusable(false);
                item.setModel(d);
                item.setUserData("model", d);
                item.setRich(true);
                item.addListener("click", function (e) {
                    if (e.isShiftPressed()) {
                        var childs = self.getChildControl("list").getChildren();
                        for (var i = childs.length; i >= 0; i--) {
                            var end = 0;
                            var start = 0;
                            if (this == childs[i]) {
                                end = i;
                                for (var ia = i; ia >= 0; ia--) {
                                    if (ia == i) {
                                        continue;
                                    }
                                    var check = childs[ia].getValue();
                                    if (!check) {
                                        start = ia;
                                    } else {
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        for (var ib = start; ib < end; ib++) {
                            if (self.__haveToEnter == true) {
                                if (!self._selectItem(childs[ib].getUserData("model"))) {
                                    childs[ib].setValue(false);
                                } else {
                                    childs[ib].setValue(true);
                                }
                            }
                        }
                        this.setValue(true);
                        if (self.__haveToEnter == true) {
                            if (!self._selectItem(this.getUserData("model"))) {
                                this.setValue(false);
                            }
                        }
                        return;
                    }
                    if (this.getValue()) {
                        if (self.__haveToEnter == true) {
                            if (!self._selectItem(this.getUserData("model"))) {
                                this.setValue(false);
                            }
                        }
                    } else {
                        self._deselectItemByModel(this.getUserData("model"));
                        self.removeFromSelectedIds(this.getUserData("model"));
                    }
                });
                self.getChildControl("list").add(item);
                self.__items.push(item);
            }
            if (r.length > 0) {
                self.__hasResults = true;
            }
        },
        populate: function populate(method, exec, data) {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method);
            rpc.setAsync(true);
            var func = function (r) {
                self.processPopulate(r);
            };
            rpc.exec(exec, data, func);
        },
        populateSync: function populateSync(method, exec, data) {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method);
            rpc.setAsync(false);
            var r = rpc.exec(exec, data);
            self.processPopulate(r);
        },
        unCheckAllListItem: function unCheckAllListItem() {
            var self = this;
            var item;
            var items = self.__items;
            for (var i = 0; i < items.length; i++) {
                var model = items[i].getUserData("model");
                if (model != null) {
                    item = items[i];
                    if (typeof item != 'undefined' && item.classname == "qx.ui.form.CheckBox") {
                        item.setValue(false);
                    }
                    var itemLabel = item.getLabel();
                    if (itemLabel.indexOf("color") != -1) {
                        var label = qxnw.utils.cleanHtml(itemLabel);
                        item.setLabel(label);
                    }
                }
            }
        },
        unCheckListItem: function unCheckListItem(item) {
            this._unCheckListItem(item);
        },
        _unCheckListItem: function _unCheckListItem(item) {
            var self = this;
            var label = item.getLabel();
            var item;
            var items = self.__items;
            for (var i = 0; i < items.length; i++) {
                var model = items[i].getUserData("model");
                if (model.nombre == label) {
                    item = items[i];
                }
            }
            if (typeof item != 'undefined' && item.classname == "qx.ui.form.CheckBox") {
                var value = item.getValue();
                if (value) {
                    item.setValue(false);
                }
            }
        },
        _unCheckListItemByModel: function _unCheckListItemByModel(model) {
            var self = this;
            var items = self.__items;
            for (var i = 0; i < items.length; i++) {
                var md = items[i].getUserData("model");
                if (typeof md != 'undefined' || typeof model != 'undefined') {
                    if (md.id === model.id) {
                        var value = items[i].getValue();
                        if (value) {
                            items[i].setValue(false);
                        }
                        break;
                    }
                }
            }
            return true;
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
        getValue: function getValue() {
            var data = this.getData();
            return data;
            //return this.getChildControl('textfield').getValue();
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
            e.getData() == "visible" ? this.addState("popupOpen") : this.removeState("popupOpen");
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
                    control.setFocusable(true);
                    control.setKeepFocus(true);
                    control.setEnableInlineFind(false);
                    control.setSelectionMode("multi");
                    control.setDragSelection(true);
                    break;
                case "popup":
                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
                    //control.setFocusable(true);
                    //control.setAutoHide(false);
                    //control.setKeepActive(true);
                    //control.addListener("mouseup", this.close, this);
                    control.add(this.getChildControl("list"));
                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
                    break;
            }
            return control || this.base(arguments, id);
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
                        model = childs[i].getModel();
                        haveChildren = true;
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
            self.__itemsCount = self.__itemsCount - 1;
            if (item && item.constructor == qxnw.widgets.listItem) {
                self.removeFromSelection(item);
                self.fireDataEvent("removeItem", item);
                item.destroy();
            }
            self.startHandlingIndex();
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
                            //childs[i].addState("head");
                            //this.__selected = childs[i];
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
            if (key == "Tab" || key == "Right" || key == "Left") {
                return;
            }
            var list = this.getChildControl("popup");
            //&& !list.isVisible()
            if (!list.isVisible()) {
                list.show();
            }
            if (key == "Down") {
                this.open();
                //this.getChildControl("list").handleKeyPress(e);
//                if (this.__items != null) {
//                    if (this.__items.length > 0) {
//                        this.__items[0].getFocusElement().focus();
//                    }
//                }
//                e.stopPropagation();
//                e.stop();
            } else if (key == "Backspace" || key == "Delete") {
                var textfield = this.getChildControl('textfield');
                var value = textfield.getValue();
                if (key == "Delete") {
                    if (value.length == 1 || value.length == 0) {
                        this.__hasResults = false;
                        this.setHaveToSearch(true);
                    }
                }
                var children = this._getChildren();
                var index = children.indexOf(textfield);
                if (value == null || value == "" && !this.__selected) {
                    if (key == "Delete" && index < (children.length - 1)) {
                        this.__selected = children[index + 1];
                        this.__selected.addState("head");
                        this.focus();
                    } else if (key == "Backspace" && index > 0) {
                        this.__selected = children[index - 1];
                        this.__selected.addState("head");
                        this.focus();
                    }
                } else if (this.__selected) {
                    this._deselectItem(this.__selected);
                    this.__selected = null;
                    this.tabFocus();
                    e.stop();
                } else {
                    if (value != "" && value != null) {
                        if (typeof value.length != 'undefined') {
                            if ((value.length == 1 || value.length == 0) && (key == "Backspace" || key == "Delete")) {
                                this.restoreItems();
                            }
                        }
                    }
                }
            } else if (key == "Left" || key == 'Right') {
                var textfield = this.getChildControl('textfield');
                var start = textfield.getTextSelectionStart();
                var length = textfield.getTextSelectionLength();
                var children = this._getChildren();
                var n_children = children.length;

                var item = this.__selected ? this.__selected : textfield;
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

                if (this.__selected) {
                    this.__selected.removeState("head");
                }
                this.__selected = null;

                // I really don't know, but FF needs the timer to be able to set the focus right
                // when there is a selected item and the key == 'Left'
                qx.util.TimerManager.getInstance().start(function () {
                    this.tabFocus();
                }, null, this, null, 20);

            } else if (key == "Enter" || key == "Space") {
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
                list.hide();
            } else if (key != "Left" && key != "Right") {
                this.getChildControl("list").handleKeyPress(e);
            }
        },
        searchIntoModel: function searchIntoModel(str) {
            if (this.__hasResults) {
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
        response: function response(response) {
            this.fireDataEvent("loadData", response);
        },
        __textFieldPressed: function __textFieldPressed(e) {
            var key = e.getKeyIdentifier();
            var list = this.getChildControl("popup");
            if (key == "Down" && !list.isVisible()) {
                this.open();
                if (this.__table != null) {
                    var pane = this.__table.getPaneScroller(0);
                    pane.getTablePane().activate();
                }
                e.stopPropagation();
                e.stop();
            } else if (key == "Backspace" || key == "Delete") {
                this._deselectItem(this.__selected);
                this.__selected = null;
                this.tabFocus();
                this.__isDelete = true;
                this.__countDeleted++;
                //e.stop();
            }
        },
        _onClick: function _onClick(e) {
            this.toggle();
        },
        setModelData: function setModelData(data) {
            var self = this;
            if (data.length == 0) {
                return;
            }
            self.__hasResults = true;
            var columns = self.getColumnsNames(data);
            if (columns == null) {
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
            self.__model.setColumns(self.columns, self.captions);
            self.__model.setData(self.objectsToArrays(data));
            self.__table.setTableModel(self.__model);
            self.makeHTMLColumns();
            self.__table.setFocusedCell(0, 0, true);
            self.hideColumns();
            self.__model.setStoredColumnSorted();
            self.open();
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
            if (value == null) {
                return;
            }
            if (value == 0) {
                return 0;
            }
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
                    arr[count] = self.highlight(object[i][cols], self.__search);
                    alterArr[count] = object[i][cols];
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
        getColumnsNames: function getColumnsNames(data) {
            var self = this;
            if (typeof data == 'undefined') {
                return null;
            }
            var cols = new Array();
            self.__columnsNumber = 0;
            self.__columnsNames = new Array();
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
                    var model = children[i].getUserData("model");
                    if (model != null) {
                        all.push(model);
                    }
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
        createTable: function createTable() {
            var self = this;
            self.__model = new qxnw.table.modelFiltered();
            self.__model.setParent(self);
            self.__table = new qxnw.table.table().set({
                decorator: null,
                showCellFocusIndicator: false,
                focusable: false
            });
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
                    for (var i = 0; i < data.length; i++) {
                        data[i] = self.clearB(data[i]);
                    }
                    self.responseTable(data);
                }
            });
            return self.__table;
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
            this.startHandlingIndex();
            this.getFocusElement().focus();
        },
        clearB: function clearB(text) {
            if (typeof text == 'undefined') {
                return;
            }
            if (text == 0) {
                return 0;
            }
            text = qxnw.utils.replaceAll(text, "<b>", "");
            text = qxnw.utils.replaceAll(text, "</b>", "");
            return text;
        }
    }
});