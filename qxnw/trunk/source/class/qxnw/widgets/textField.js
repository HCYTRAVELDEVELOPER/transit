qx.Class.define("qxnw.widgets.textField", {
    extend: qx.ui.form.AbstractSelectBox,
    events: {
        "input": "qx.event.type.Data"
    },
    construct: function construct() {
        this.base(arguments);
        var self = this;
        var layout = new qx.ui.layout.Flow();
        this._setLayout(layout);
        //layout.setAlignY("middle");
        var textField = this._createChildControl("textfield");

        self.__textField = textField;
        //label.setAppearance(textField.getAppearance());

        //self.setAppearance("textfield");

        self.bind("width", textField, "width");

        var filterRegExp = qxnw.userPolicies.getRegexSpecialCharacteres();
        textField.setFilter(filterRegExp);
        textField.addListener("input", function (e) {
            self.fireDataEvent("input", e.getData());
        });
        textField.setLiveUpdate(true);
        textField.addListener("mousedown", function (e) {
            e.stop();
        });
//        textField.addListener("appear", function(e) {
//            var bounds = self.getBounds();
//            if (typeof bounds != 'undefined' && bounds != null && bounds != '') {
//                textField.setWidth(bounds["width"]);
//            }
//        }, this);
        this.addListener("focusin", function (e) {
            textField.fireNonBubblingEvent("focusin", qx.event.type.Focus);
        }, this);
        this.addListener("focusout", function (e) {
            textField.fireNonBubblingEvent("focusout", qx.event.type.Focus);
        }, this);
        textField.addListener("focusout", function (e) {
            var list = self.getChildControl("popup");
            if (list.isVisible()) {
                self.close();
            }
        }, textField);
        self.setFocusable(true);
    },
    properties: {
        appWidgetName: {
            init: null,
            check: "String"
        }
    },
    members: {
        __finded: null,
        __method: null,
        __func: null,
        __options: null,
        __col: null,
        __textField: null,
        setLiveUpdate: function setLiveUpdate() {

        },
        _onKeyPress: function (e) {
            var self = this;
            var key = e.getKeyIdentifier();
            var list = this.getChildControl("popup");
            if (key == "Down" && !list.isVisible() && self.__finded != null) {
                this.open();
                e.stopPropagation();
                e.stop();
            } else if (key == "Backspace" || key == "Delete") {
                var textfield = this.getChildControl('textfield');
                var value = textfield.getValue();
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

            } else if (key == "Escape") {
                this.close();
            } else if (key != "Left" && key != "Right") {
                this.getChildControl("list").handleKeyPress(e);
            }
        },
        setPlaceHolder: function setPlaceHolder(text) {
            this.setPlaceholder(text);
        },
        setPlaceholder: function setPlaceholder(text) {
            this.getChildControl('textfield').setPlaceholder(text);
        },
        /**
         * Try to save the textField value into local storage.
         * @param name {String} the field name
         * @returns {Boolean}
         */
        saveValue: function saveValue(name) {
            var self = this;
            var data = self.getValue();
            var key = name + self.getAppWidgetName();
            var savedData = qxnw.local.getData(key);
            if (savedData) {
                for (var i = 0; i < savedData.length; i++) {
                    if (savedData[i] == data) {
                        return;
                    }
                }
                savedData.push(data);
            } else {
                savedData = new Array();
                savedData.push(data);
            }
            qxnw.local.storeData(key, savedData);
        },
        getSavedValue: function getSavedValue(key, text) {
            var self = this;
            var data = qxnw.local.getData(key + self.getAppWidgetName());
            var findedArray = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i] != null && text != null) {
                        if (data[i].toLowerCase().indexOf(text.toLowerCase()) != -1) {
                            self.__finded = data[i];
                            findedArray.push(data[i]);
                        }
                    }
                }
            }
            return findedArray;
        },
        getFromDb: function getFromDb(text) {
            var self = this;
            var d = {};
            d["table"] = self.__options["table"];
            var data = qxnw.utils.fastSyncRpcCall(self.__method, self.__func, d);
            var findedArray = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i][self.__col] != null && text != null) {
                        if (data[i][self.__col].toLowerCase().indexOf(text.toLowerCase()) != -1) {
                            self.__finded = data[i][self.__col];
                            findedArray.push(data[i]);
                        }
                    }
                }
            }
            return findedArray;
        },
        populate: function populate(method, func, col, options, callback) {
            this.__method = method;
            this.__func = func;
            this.__options = options;
            this.__col = col;
            this.__searchFunc = callback;
            this.setMode("searchOnDb", this.getUserData("key"));
            this._createChildControl("button");
            this.setPlaceholder(this.tr("Enter para buscar..."));
        },
        searchAndPopulate: function searchAndPopulate(elm, e) {
            var selfField = this;
            var self = this;
            var text = self.getChildControl("textfield").getValue();
            if (qxnw.utils.trim(text) == "") {
                if (selfField.getChildControl('popup').isVisible()) {
                    selfField.getChildControl('popup').hide();
                }
                return;
            }
            var finded = self.getFromDb(text);
            if (finded) {
                selfField.toggle();
                var list = selfField.getChildControl('list');
                list.removeAll();
                if (!selfField.getChildControl('popup').isVisible()) {
                    selfField.getChildControl('popup').show();
                }
                for (var i = 0; i < finded.length; i++) {
                    var item = new qxnw.widgets.listItem(qxnw.utils.highLight(finded[i][self.__col], text));
                    item.setRich(true);
                    item.setModel(finded[i]);
                    //TODO: TO FIX
                    item.addListener("action", function (e) {
                        var mod = this.getModel();
                        if (selfField.getChildControl('popup').isVisible()) {
                            selfField.setValue(mod[self.__col]);
                            selfField.getChildControl('popup').hide();
                            if (self.__searchFunc != null) {
                                self.__searchFunc(mod);
                            }
                        }
                        e.stop();
                    });
                    item.addListener("click", function () {
                        var mod = this.getModel();
                        if (selfField.getChildControl('popup').isVisible()) {
                            selfField.getChildControl('popup').hide();
                        }
                        selfField.setValue(mod[self.__col]);
                        if (self.__searchFunc != null) {
                            self.__searchFunc(mod);
                        }
                    });
                    list.add(item);
                }
                selfField.getChildControl('list').show();
            } else {
                selfField.getChildControl('list').removeAll();
                if (selfField.getChildControl('popup').isVisible()) {
                    selfField.getChildControl('popup').hide();
                }
            }
        },
        setMode: function setMode(mode, appName) {
            var self = this;
            self.setAppWidgetName(appName);
            switch (mode) {
                case "searchOnDb":
                    self.addListener("keypress", function (e) {
                        if (e.getKeyIdentifier() == "Enter") {
                            self.searchAndPopulate(this, e);
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    });
                    break;
                case "search":
                    self.addListener("input", function (e) {
                        var selfField = this;
                        var text = e.getData();
                        if (qxnw.utils.trim(text) == "") {
                            if (selfField.getChildControl('popup').isVisible()) {
                                selfField.getChildControl('popup').hide();
                            }
                            return;
                        }
                        var finded = self.getSavedValue(this.getUserData("key"), text);
                        if (finded) {
                            selfField.toggle();
                            selfField.getChildControl('list').removeAll();
                            if (!selfField.getChildControl('popup').isVisible()) {
                                selfField.getChildControl('popup').show();
                            }
                            for (var i = 0; i < finded.length; i++) {
                                var item = new qxnw.widgets.listItem(qxnw.utils.highLight(finded[i], text));
                                item.setRich(true);
                                item.setModel(finded[i]);
                                item.addListener("action", function (e) {
                                    if (selfField.getChildControl('popup').isVisible()) {
                                        selfField.setValue(this.getModel());
                                        selfField.getChildControl('popup').hide();
                                    }
                                });
                                item.addListener("click", function () {
                                    if (selfField.getChildControl('popup').isVisible()) {
                                        selfField.getChildControl('popup').hide();
                                    }
                                    selfField.setValue(this.getModel());
                                });
                                selfField.getChildControl('list').add(item);
                            }
                            selfField.getChildControl('list').show();
                        } else {
                            selfField.getChildControl('list').removeAll();
                            if (selfField.getChildControl('popup').isVisible()) {
                                selfField.getChildControl('popup').hide();
                            }
                        }
                    });
                    break;
            }
        },
        _onListPointerDown: function () {
            return false;
        },
        _onListChangeSelection: function (e) {
            return null;
        },
        tabFocus: function () {
            var field = this.getChildControl("textfield");
            field.getFocusElement().focus();
        },
        tabBlur: function () {
            var field = this.getChildControl("textfield");
            field.getFocusElement().blur();
        },
        _onPopupChangeVisibility: function (e) {
            this.tabFocus();
        },
        _onBlur: function (e) {
            return;
        },
        focus: function focus() {
            this.getChildControl('textfield').focus();
        },
        setValue: function setValue(val) {
            if (typeof val !== 'undefined' && val !== null && (typeof val === "number" || typeof val === "numeric")) {
                val = val.toString();
            }
            this.getChildControl('textfield').setValue(val);
        },
        getValue: function getValue(val) {
            return this.getChildControl('textfield').getValue(val);
        },
        // overridden
        getFocusElement: function () {
            var el = this.getContentElement();
            if (el) {
                return el;
            }
        },
        setFilter: function setFilter(arg) {
            this.getChildControl('textfield').setFilter(arg);
        },
        _createChildControlImpl: function (id) {
            var self = this;
            var control;
            switch (id) {
                case "label":
                    control = new qx.ui.basic.Label();
                    control.hide();
                    break;
                case "button":
                    control = new qx.ui.form.Button();
                    control.setIcon(qxnw.config.execIcon("system-search"));
                    control.setFocusable(false);
                    control.setKeepActive(true);
                    control.addState("inner");
                    control.addListener("execute", this.toggle, this);
                    control.setAppearance("label");

                    control.addListener("click", function (e) {
                        self.searchAndPopulate(this, e);
                        e.stopPropagation();
                    });

                    this._add(control);
                    break;
                case "textfield":
                    control = new qx.ui.form.TextField();
                    control.addState("inner");
                    //control.setFocusable(false);
                    control.addListener("blur", this.close, this);
                    this._add(control, {
                        stretch: true
                    });
                    break;
                case "list":
                    control = this.base(arguments, id);
                    control.setSelectionMode("single");
                    break;
                case "popup":
                    control = new qx.ui.popup.Popup(new qx.ui.layout.VBox);
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