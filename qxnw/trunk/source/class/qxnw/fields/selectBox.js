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
 * QXNW selectBox
 */
qx.Class.define("qxnw.fields.selectBox", {
    extend: qx.ui.form.SelectBox,
    /**
     * Event fired on load asyncronous call
     */
    events: {
        loaded: "qx.event.type.Data"
    },
    construct: function construct(parent) {
        this.base(arguments);
        var self = this;
        self.set({
            rich: true
        });
        var self = this;
        self.addListener("changeRequired", function (e) {
            try {
                if (typeof parent !== 'undefined') {
                    var name = this.getUserData("name");
                    var label = parent.labelForm[name].getValue().replace("<b style='color:red' class='require_qxnw'>*</b>", "");
                    parent.labelForm[name].setValue(label + "<b style='color:red' class='require_qxnw'>*</b>");
                }
            } catch (e) {

            }
        });
        self.addListener("appear", function () {
            if (self.__isFiredFunction == false) {
                self.addListener("changeSelection", function () {
                    try {
                        var value = self.getValue();
                        var name = self.getUserData("name");
                        var colorHtml = value[name + "_text"];
                        var el = document.createElement('div');
                        el.innerHTML = colorHtml;
                        if (typeof el.children[0] == 'undefined' || el.children[0] == null) {
                            return;
                        }
                        var color = el.children[0].getAttribute("color");
                        var isFinded = false;
                        if (typeof color == 'undefined' || color == null) {
                            isFinded = false;
                        } else {
                            isFinded = true;
                        }
                        if (!isFinded) {
                            color = el.children[0].getAttribute("background");
                        }
                        if (typeof color == 'undefined' || color == null) {
                            isFinded = false;
                        } else {
                            isFinded = true;
                        }
                        if (!isFinded) {
                            color = el.children[0].getAttribute("style");
                            var v = null;
                            if (typeof color != 'undefined' && color != null) {
                                var toSearch = color.split(";");
                                for (var i = 0; i < toSearch.length; i++) {
                                    if (toSearch[i].indexOf("background") != -1 || toSearch[i].indexOf("color") != -1) {
                                        v = toSearch[i].split(":");
                                        if (v.length > 0) {
                                            color = v[1];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        el.removeChild(el.children[0]);
                        el.remove();
                        if (typeof color == 'undefined' || color == null || color == "" || color == 0) {
                            return;
                        }
                        qx.bom.element.Style.set(self.getChildControl("atom").getContentElement().getDomElement(), "background", color);
                        qx.bom.element.Style.set(self.getContentElement().getDomElement(), "background", color);
                    } catch (e) {
                        qxnw.utils.error(e, self);
                    }
                });
                self.__isFiredFunction = true;
            }
        });
    },
    members: {
        __isLoader: false,
        __isLoaded: false,
        __isFiredFunction: false,
        __nw_name: null,
        saveUserData: function saveUserData(key) {
            var self = this;
            var ud = qxnw.local.getData(key);
            if (ud != null) {
                if (typeof ud != 'undefined') {
                    try {
                        self.setValue(ud);
                    } catch (e) {
                        qxnw.utils.nw_console(e);
                    }
                }
            }
            self.setUserData("nw_default_user_data_value", key);
            self.addListener("changeSelection", function () {
                var v = this.getValue();
                var name = self.getUserData("name");
                var key = self.getUserData("nw_default_user_data_value");
                if (typeof v[name] != 'undefined' && key != null) {
                    qxnw.local.setData(key, v[name]);
                }
            });
        },
        clean: function clean() {
            this.resetSelection();
        },
        setName: function setName(name) {
            this.__nw_name = name;
            this.setUserData("name", name);
        },
        getName: function getName(name) {
            return this.__nw_name;
        },
        // overridden
        _createChildControlImpl: function _createChildControlImpl(id, hash) {
            var control;

            switch (id) {
                case "popup":
                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
                    control.setAutoHide(false);
                    control.setKeepActive(true);
                    control.addListener("tap", this.validateClose, this);
                    control.add(this.getChildControl("list"));

                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
                    break;

                case "spacer":
                    control = new qx.ui.core.Spacer();
                    this._add(control, {flex: 1});
                    break;

                case "atom":
                    control = new qx.ui.basic.Atom(" ").set({
                        rich: true
                    });
                    control.setCenter(false);
                    control.setAnonymous(true);

                    this._add(control, {flex: 1});
                    break;

                case "arrow":
                    control = new qx.ui.basic.Image();
                    control.setAnonymous(true);

                    this._add(control);
                    break;
            }

            return control || this.base(arguments, id);
//            return control || super._createChildControlImpl(id);
        },
        // overridden
//        _createChildControlImpl: function _createChildControlImpl(id, hash) {
//            var control;
//            switch (id) {
//                case "popup":
//                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
//                    control.setAutoHide(false);
//                    control.setKeepActive(true);
//                    control.addListener("tap", this.validateClose, this);
//                    control.add(this.getChildControl("list"));
//
//                    control.addListener("changeVisibility", this._onPopupChangeVisibility, this);
//                    break;
//            }
//            return control || this.base(arguments, id);
//        },
        validateClose: function validateClose(e) {
            if (e.getTarget().classname != "qx.ui.form.RepeatButton") {
                this.close();
            }
        },
        __handleClick: function __handleClick(e) {
            var target = e.getTarget();
            if (target instanceof qx.ui.form.RepeatButton) {
                return;
            } else {
                this.close();
            }
        },
        isLoaded: function isLoaded(bool) {
            this.__isLoaded = bool;
        },
        markAsLoader: function markAsLoader(bool) {
            this.__isLoader = bool;
        },
        isQxNwObject: function isQxNwObject() {
            return true;
        },
        setValueByLabel: function setValueByLabel(label) {
            var children = this.getChildren();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var model = child.getLabel();
                var index = child.getModel();
                if (model == label) {
                    this.setValue(index);
                    break;
                }
            }
        },
        populate: function populate(method, exec, data, options, defaultValue) {
            qxnw.utils.populateSelectAsync(this, method, exec, data, options, defaultValue);
        },
        populateFromArray: function populateFromArray(array) {
            qxnw.utils.populateSelectFromArray(this, array);
        },
        removeItemByIndex: function removeItemByIndex(index) {
            var self = this;
            var children = self.getChildren();
            for (var i = 0; i < children.length; i++) {
                if (i == index) {
                    self.removeAt(i);
                    break;
                }
            }
            return true;
        },
        setValue: function setValue(value) {
            if (typeof value == 'undefined') {
                return;
            }
            if (this.__isLoader) {
                if (!this.__isLoaded) {
                    this.addListener("loaded", function () {
                        var items = this.getSelectables(true);
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].getModel() == value) {
                                this.setSelection([items[i]]);
                            }
                        }
                    });
                } else {
                    var items = this.getSelectables(true);
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].getModel() == value) {
                            this.setSelection([items[i]]);
                        }
                    }
                }
            } else {
                var items = this.getSelectables(true);
                for (var i = 0; i < items.length; i++) {
                    if (typeof value == "object" && typeof value["id"] != 'undefined') {
                        var val = value["id"];
                        if (items[i].getModel() == val) {
                            this.setSelection([items[i]]);
                        }
                    } else {
                        if (items[i].getModel() == value) {
                            this.setSelection([items[i]]);
                        }
                    }
                }
            }
            return true;
        },
        getValue: function getValue() {
            var data = {};
            if (!this.isSelectionEmpty()) {
                var selectModel = this.getSelection()[0].getModel();
                var selectText = this.getSelection()[0].getLabel();
                var selectData = this.getSelection()[0].getUserData("model_data");
                if (this.getUserData("name") == null) {
                    return {model: selectModel, label: selectText, text: selectText, data: selectData};
                }
                data[this.getUserData("name")] = selectModel;
                if (typeof selectModel.id != 'undefined') {
                    data[this.getUserData("name") + "_id"] = selectModel.id;
                }
                data[this.getUserData("name") + "_text"] = selectText;
                try {
                    data[this.getUserData("name") + "_model"] = this.getSelection()[0].getUserData("model_data");
                } catch (e) {
                    data[this.getUserData("name") + "_model"] = null;
                }
            } else {
                data[this.getUserData("name")] = null;
                data[this.getUserData("name") + "_text"] = null;
                data[this.getUserData("name") + "_model"] = null;
            }
            return data;
        }
    }
});