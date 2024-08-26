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
qx.Class.define("qxnw.widgets.selectListCheck", {
    extend: qxnw.widgets.selectTokenField,
    properties: {
        maxItems: {
            init: 30,
            refine: true
        },
        itemLabel: {
            init: "nombre",
            refine: true
        }
    },
    construct: function () {
        this.base(arguments);
        var self = this;
        this.__items = [];
        this.__selectedIds = [];
        var textField = this.getChildControl("textfield");

        var placeHolder = self.tr("Digite para buscar...");
        textField.setPlaceholder(placeHolder);

        self.hasResults = true;

        this.getValue = () => this.getData();
//        this.getChildControl("list").setFocusable(true);
        //this.getChildControl("list").setKeepFocus(true);
    },
    members: {
        SELECTION_MANAGER: qxnw.tokenfield.SelectionManager,
        __items: null,
        __selectedIds: null,
        selected: null,
        getData: function getData() {
            // andresf 2021: mejora para que tome los modelos reales de cada item
            var data = [];
            var selection = this._getChildren();
            for (var i = 0; i < selection.length; i++) {
                if (selection[i].classname == "qx.ui.form.TextField") {
                    continue;
                }
                var w = selection[i].getUserData("model");
                data.push(w);
            }
            return data;
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
        restoreItems: function restoreItems() {
            var self = this;
            var items = self.__items;
            self.getChildControl("list").removeAll();
            for (var i = 0; i < items.length; i++) {
                self.getChildControl("list").add(items[i]);
            }
        },
        _selectItem: function _selectItem(data) {
            var self = this;
            var selection = self.getCountAddedItems();
            if (selection >= self.getMaxItems()) {
                return false;
            }
            var item = new qxnw.widgets.listItem();
            item.setAppearance("tokenitem");
            if (typeof data[self.getItemLabel()] == 'undefined') {
                return;
            }
            item.setLabel(data[self.getItemLabel()] == 0 ? '' : data[self.getItemLabel()]);

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
            self.fireDataEvent("addItem", data);
            self.getChildControl('textfield').setValue("");
            self.getChildControl('textfield').getFocusElement().focus();
            self.__itemsCount++;
            self.__isAddedItem = true;

            if (self.__itemsCount == self.getMaxItems()) {
                self.getChildControl('textfield').setVisibility("excluded");
            }
            self.restoreItems();

            self.checkPopulatedData(data);

            return true;
        },
        checkPopulatedData: function checkPopulatedData(data) {
            var self = this;
            if (typeof data.id === 'undefined') {
                return;
            }
            var items = self.__items;
            for (var i = 0; i < items.length; i++) {
                var w = items[i];
                var m = w.getModel();
                if (typeof m.id !== 'undefined') {
                    if (w.classname === "qx.ui.form.CheckBox") {
                        if (m.id === data.id) {
                            w.setUserData("changeValueItem", false);
                            w.setValue(true);
                            w.setUserData("changeValueItem", true);
                            break;
                        }
                    }
                }
            }
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
        onTextChange: function onTextChange(e) {
            var self = this;
            if (e.classname === "qx.event.type.KeySequence") {
                return;
            }
            var str = e.getData();
            if (str == null || str == "") {
                self.restoreItems();
                return false;
            }
            if (str.length < self.getMinChars()) {
                return;
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
        populate: function populate(method, exec, data) {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method);
            rpc.setAsync(true);
            var func = function (r) {
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
                    item.setUserData("changeValueItem", true);
                    item.setRich(true);
                    item.addListener("changeValue", function (e) {
                        var changeValue = this.getUserData("changeValueItem");
                        if (changeValue === true) {
                            if (e.getData()) {
                                if (!self._selectItem(this.getUserData("model"))) {
                                    this.setValue(false);
                                }
                            } else {
                                self._deselectItemByModel(this.getUserData("model"));
                            }
                        }
                    });
                    self.getChildControl("list").add(item);
                    self.__items.push(item);
                }
                if (r.length > 0) {
                    self.__hasResults = true;
                }
            };
            rpc.exec(exec, data, func);
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
        keydown: function keydown(key) {
            var self = this;
            if (key.getKeyIdentifier() === "Down") {
                var list = self.getChildControl("list");
                var children = list.getChildren();
                console.log(children);
                console.log(children.length);
                list.activate();
                list.setSelection(children[0]);
            }
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
//                    control.addListener("keydown", this.keydown, this);
                    this._add(control, {
                        stretch: true
                    });
                    break;
                case "list":
                    control = this.base(arguments, id);
//                    control.setFocusable(true);
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
        }
    }
});