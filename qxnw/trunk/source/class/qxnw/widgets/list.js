qx.Class.define("qxnw.widgets.list", {
    extend: qx.ui.core.Widget,
    construct: function (height) {
        this.base(arguments);
        var self = this;
        self._setLayout(new qx.ui.layout.VBox());

        self.createSearchWidget();

        self.list = new qx.ui.form.List();

        if (typeof height != 'undefined') {
            if (height == null) {
                height = 1000;
            }
            self.list.setHeight(height);
        }

        self.list.setContextMenuFromDataCellsOnly = function (bol) {
            return true;
        };
        self._add(self.list, {
            flex: 1
        });
        self.__contextMenuIdListener = self.list.addListener("contextmenu", function (e) {
            var target = e.getTarget();
            if (self.__enableCopy === false) {
//                self.contextMenu(e, target);
                return;
            }
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
        self.list.addListener("focusin", function (e) {
            self.__isFocused = true;
//            if (typeof self.command_copy != 'undefined') {
//                self.command_copy.setEnabled(true);
//            }
        });
        self.list.addListener("click", function (e) {
            var selection = self.getSelection();
            if (selection.length == 0) {
                return;
            }
            var hadFocus = selection[0].getUserData("nw_focus");
            if (hadFocus == true) {
                return;
            }
            var label = selection[0].getChildControl("label");
            var element = label.getContentElement().getDomElement();
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                var range = document.createRange();
                range.selectNodeContents(element);
                sel.addRange(range);
            } else if (document.selection) {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(element);
                textRange.select();
            }
            selection[0].setUserData("nw_focus", true);
        });
        self.list.addListener("focusout", function (e) {
            self.__isFocused = false;
//            if (typeof self.command_copy != 'undefined') {
//                self.command_copy.setEnabled(false);
//            }
        });
//        self.command_copy = new qx.ui.command.Command('Control+C');
//        var func = function () {
//            if (self.__isFocused) {
//                self.slotCopy();
//            }
//        };
//        self.command_copy.addListener('execute', func, this);
//        self.command_copy.setEnabled(false);
    },
    destruct: function destruct() {
        try {
            this.destroy();
            this._disposeObjects("this.list");
            if (this.firstItems != null) {
                this._disposeObjects("this.firstItems");
            }
            this.dispose();
        } catch (e) {
            this.dispose();
        }
    },
    members: {
        list: null,
        firstItems: null,
        __contextMenuIdListener: null,
        command_copy: null,
        __isFocused: null,
        labelSearch: null,
        __typeListItem: null,
        __enableCopy: true,
        fontBold: false,
        __m: null,
        getContextMenuCopy: function getContextMenuCopy() {
            return this.__m;
        },
        setTypeListItem: function setTypeListItem(typeItem) {
            this.__typeListItem = typeItem;
        },
        getTypeListItem: function getTypeListItem() {
            return this.__typeListItem;
        },
        changeColorAndModelSelectedRecords: function changeColorAndModelSelectedRecords(color) {
            var self = this;
            var child = self.getSelection();
            for (var i = 0; i < child.length; i++) {
                qx.bom.element.Style.set(child[i].getContentElement().getDomElement(), "background-color", color);
                var m = child[i].getModel();
                m["nw_color"] = color;
                child[i].setModel(m);
            }
        },
        restoreColorAndModelSelectedRecords: function restoreColorAndModelSelectedRecords() {
            var self = this;
            var child = self.getSelection();
            for (var i = 0; i < child.length; i++) {
                qx.bom.element.Style.set(child[i].getContentElement().getDomElement(), "background-color", "");
                var m = child[i].getModel();
                m["nw_color"] = "";
                child[i].setModel(m);
            }
        },
        setEnableCopy: function setEnableCopy(enable) {
            this.__enableCopy = enable;
        },
        hideLabel: function hideLabel() {
            this.labelSearch.setVisibility("excluded");
        },
        selectAll: function selectAll() {
            if (this.__typeListItem == null) {
                this.list.selectAll();
            } else {
                if (this.__typeListItem == "checkBox") {
                    var children = this.list.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        children[i].setValue(true);
                    }
                    return this.list.selectAll();
                } else {
                    return this.list.selectAll();
                }
            }
        },
        setSelection: function setSelection(widget) {
            this.list.setSelection(widget);
        },
        resetSelection: function resetSelection() {
            if (this.__typeListItem == null) {
                this.list.resetSelection();
            } else {
                if (this.__typeListItem == "checkBox") {
                    var children = this.list.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        children[i].setValue(false);
                    }
                    this.list.resetSelection();
                } else {
                    this.list.resetSelection();
                }
            }
        },
        addBefore: function addBefore(w1, w2) {
            this.list.addBefore(w1, w2);
        },
        getAllData: function getAllData() {
            var children = this.list.getChildren();
            var rta = [];
            for (var i = 0; i < children.length; i++) {
                var model = children[i].getModel();
                rta.push(model);
            }
            return rta;
        },
        getSelection: function getSelection() {
            if (this.__typeListItem == null) {
                return this.list.getSelection();
            } else {
                if (this.__typeListItem == "checkBox") {
                    var rta = [];
                    var children = this.list.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].getValue() === true) {
                            rta.push(children[i]);
                        }
                    }
                    return rta;
                } else {
                    return this.list.getSelection();
                }
            }
        },
        setSelectionMode: function setSelectionMode(mode) {
            this.list.setSelectionMode(mode);
        },
        createSearchWidget: function createSearchWidget() {
            var self = this;
            var ctnr = new qx.ui.container.Composite(new qx.ui.layout.VBox());

            var lbl = new qx.ui.basic.Atom(self.tr("Auto filtro"), qxnw.config.execIcon("dialog-information", "status")).set({
                iconPosition: "right",
                gap: 1
            });
            self.labelSearch = lbl;
            var tT = new qx.ui.tooltip.ToolTip(self.tr("Filtro rápido sin ejecutar la base de datos. (Los datos no se actualizarán directamente del servidor)"), qxnw.config.execIcon("help-faq"));
            lbl.setToolTip(tT);

            ctnr.add(lbl);
            var sl = new qxnw.widgets.textField();
            sl.addListener("input", function (e) {
                var key = e.getData();
                self.toSearch(key);
            });
            sl.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                if (key == "Backspace" || key == "Delete" && this.getValue() != "") {
                    self.toSearch(this.getValue(), true);
                }
            });
            sl.setPlaceholder(self.tr("Buscar..."));
            ctnr.add(sl, {
                flex: 1
            });
            self._add(ctnr);
        },
        toSearch: function toSearch(key, back) {
            var self = this;
            if (key == "") {
                if (self.firstItems != null) {
                    self.cleanAndRestoreItems();
                }
                self.firstItems = null;
                return;
            }
            if (typeof back != 'undefined') {
                if (back == true) {
                    self.cleanAndRestoreItems();
                    return;
                }
            }
            var items = self.list.getChildren();
            var oldItems = qx.lang.Object.clone(items, false);
            if (self.firstItems == null) {
                self.firstItems = oldItems;
            }
            for (var i = 0; i < oldItems.length; i++) {
                var itemLabel = oldItems[i].getChildControl("label").getValue();
                itemLabel = itemLabel.toLowerCase();
                itemLabel = qxnw.utils.cleanHtml(itemLabel);
                if (itemLabel.indexOf(key.toLowerCase()) == -1) {
                    self.list.remove(oldItems[i]);
                }
            }
        },
        cleanAndRestoreItems: function cleanAndRestoreItems() {
            var self = this;
            var children = self.list.getChildren();
            for (var i = 0; i < children.length; i++) {
                self.list.remove(children[i]);
            }
            if (self.firstItems != null) {
                for (var i = 0; i < self.firstItems.length; i++) {
                    if (self.firstItems[i].getUserData("nw_state_drop") !== true) {
                        self.list.add(self.firstItems[i]);
                    }
                }
            }
        },
        add: function add(widget) {
            this.list.add(widget);
        },
        addAfter: function addAfter(child, after) {
            this.list.addAfter(child, after);
        },
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(self);
            self.__m = m;
            m.addAction(self.tr("Copiar"), qxnw.config.execIcon("edit-copy"), function (e) {
                self.slotCopy();
            });
            m.exec(pos);
        },
        getModelSelection: function getModelSelection() {
            return this.list.getModelSelection();
        },
        getSelected: function getSelected() {
            var self = this;
            var selection = self.list.getSelection();
            if (selection.length == 0) {
                qxnw.utils.information(self.tr("Debe seleccionar un ítem para copiar"));
                return;
            }
            return selection[0].getModel();
        },
        getTable: function getTable() {
            return this.list;
        },
        setContextMenuFromDataCellsOnly: function setContextMenuFromDataCellsOnly(bol) {
            return true;
        },
        slotCopy: function slotCopy() {
            var self = this;
            var selection = self.list.getSelection();
            if (selection.length == 0) {
                qxnw.utils.information(self.tr("Debe seleccionar un ítem para copiar"));
                return;
            }
            var text = selection[0].getLabel();
            text = qxnw.utils.cleanHtml(text);
            window.prompt(self.tr("Texto a copiar: (Presiona nuevamente CTRL+C)"), text);
        },
        removeAll: function removeAll() {
            this.list.removeAll();
        },
        scrollByY: function scrollByY(par1, par2) {
            this.list.scrollByY(par1, par2);
        },
        scrollByX: function scrollByX(par1, par2) {
            this.list.scrollByX(par1, par2);
        },
        getChildren: function getChildren() {
            return this.list.getChildren();
        },
        remove: function remove(index) {
            return this.list.remove(index);
        },
        indexOf: function indexOf(widget) {
            return this.list.indexOf(widget);
        },
        setModelToItem: function setModelToItem(item, arr) {
            var index = this.indexOf(item);
            var items = this.list.getChildren();
            var itemFinded = false;
            for (var i = 0; i < items.length; i++) {
                if (i == index) {
                    itemFinded = items[i];
                }
            }
            if (itemFinded != false) {
                var model = itemFinded.getModel();
                for (var v in arr) {
                    model[v] = arr[v];
                }
                itemFinded.setModel(model);
            }
        },
        setBoldFonts: function setBoldFonts(val) {
            this.fontBold = val;
        },
        getBoldFonts: function getBoldFonts() {
            return this.fontBold;
        },
        populate: function populate(method, service, params, type) {
            var self = this;
            if (typeof type == 'undefined') {
                type = "listItem";
            }
            if (type != "listItem") {
                if (type != "checkBox") {
                    type = "listItem";
                    console.log("Está ingresando un tipo desconocido: " + type);
                }
            }

            //checkBox
            self.__typeListItem = type;
            if (self.list == null) {
                return;
            }
            var func = function (r) {
                if (r == false) {
                    return;
                }
                self.list.removeAll();
                for (var i = 0; i < r.length; i++) {
                    var d = r[i];
                    var label = typeof d["nombre"] == "undefined" ? d["name"] : d["nombre"];
                    if (self.getBoldFonts() == true) {
                        label = "<b>" + label + "</b>";
                    }
                    var val = typeof d["value"] == "undefined" ? d["text"] : d["value"];
                    if (type == "listItem") {
                        var item = new qxnw.widgets.listItem(label).set({
                            rich: true,
                            selectable: true,
                            focusable: true
                        });
                    } else if (type == "checkBox") {
                        var item = new qx.ui.form.CheckBox(label).set({
                            rich: true
                        });
                        item.setValue(val == "true" || val == true || val == "t" ? true : false);
                    } else {
                        var item = new qxnw.widgets.listItem(label);
                    }
                    item.addListener("focusout", function () {
                        this.setUserData("nw_focus", false);
                    });
                    item.setModel(d);
                    self.list.add(item);
                }
            };
            qxnw.utils.fastAsyncRpcCall(method, service, params, func);
        }
    }
});