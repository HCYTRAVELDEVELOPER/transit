/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.dragDropWidget", {
    extend: qxnw.forms,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("dragDropWidget form"));
        self.createStartBase();
        self.createPanel1();
        self.createPanel2();
        self.onDropRight = null;
        self.onDropLeft = null;
        self.onlyIcons = false;
        self.labelForm = [];
    },
    members: {
        splitterDragDrop: null,
        filterContainerDragDrop1: null,
        filterContainerDragDrop2: null,
        filters: null,
        labelForm: null,
        onlyIcons: true,
        __tabIndexLists: 1,
        containerFilters: null,
        buttonSearch: null,
        list1: null,
        list2: null,
        setOnlyIcons: function setOnlyIcons(val) {
            var self = this;
            self.onlyIcons = val;
        },
        addToList: function addToList(list, item) {
            var children = list.getChildren();
            if (children.length == 0) {
                list.add(item);
                return;
            }
            var modItem = item.getModel();
            var isAdded = false;
            for (var i = 0; i < children.length; i++) {
                var mod = children[i].getModel();
                if (mod["id"] > modItem["id"]) {
                    list.addBefore(item, children[i]);
                    isAdded = true;
                    break;
                }
                if (i + 1 == children.length) {
                    list.addAfter(item, children[i]);
                    isAdded = true;
                }
                if (!isAdded) {
                    list.add(item);
                }
            }
        },
        addButtons: function addButtons(arr) {
            var self = this;
            for (var i = 0; i < arr.length; i++) {
                var icon = qxnw.config.execIcon("dialog-apply");
                var button = new qx.ui.form.Button(arr[i].label, icon).set({
                    maxHeight: 30
                });
                self.ui[arr[i].name] = button;
                self.containerFilters.add(button);
            }
        },
        createStartBase: function createStartBase() {
            var self = this;
            self.splitterDragDrop = new qx.ui.splitpane.Pane("horizontal");
            self.masterContainer.add(self.splitterDragDrop, {
                flex: 1
            });
        },
        setDropable: function setDropable(bool) {
            this.list1.list.setDroppable(bool);
            this.list2.list.setDroppable(bool);
        },
        setDraggable: function setDraggable(bool) {
            this.list1.list.setDraggable(bool);
            this.list2.list.setDraggable(bool);
        },
        createPanel1: function createPanel1() {
            var self = this;

            this.panel1 = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 2
            });

            this.panel1.add(this.createFiltersDragDropLeft());

            this.list1 = new qxnw.widgets.list(null).set({
                selectionMode: "multi"
            });

            this.list1.list.setDraggable(true);
            this.list1.list.setDroppable(true);
            this.list1.setSelectionMode("multi");

            this.list1.addListener("dragstart", function (e) {
                e.addType("items");
                e.addType("value");
                e.addAction("copy");
                e.addAction("move");
            });
            this.list1.addListener("droprequest", function (e) {
                var action = e.getCurrentAction();
                var type = e.getCurrentType();
                var result;
                var selection = this.getSelection();
                var dragTarget = e.getDragTarget();

                dragTarget.setUserData("nw_state_drop", true);
                if (selection.length === 0) {
                    selection.push(dragTarget);
                } else if (selection.indexOf(dragTarget) == -1) {
                    selection = [dragTarget];
                }

                switch (type) {
                    case "items":
                        result = selection;
                        if (action == "copy") {
                            var copy = [];
                            for (var i = 0, l = result.length; i < l; i++) {
                                copy[i] = result[i].clone();
                            }
                            result = copy;
                        }
                        break;

                    case "value":
                        result = selection[0].getLabel();
                        break;
                }

                // Remove selected items on move
                if (action == "move") {
                    for (var i = 0, l = selection.length; i < l; i++) {
                        try {
                            this.remove(selection[i]);
                        } catch (e) {
                            qxnw.utils.error(e);
                        }
                    }
                }
                // Add data to manager
                e.addData(type, result);
            });

            this.list1.addListener("drop", function (e) {
                var items = e.getData("items");
                for (var i = 0, l = items.length; i < l; i++) {
                    self.addToList(self.list1, items[i]);
                }
            });

            this.panel1.add(this.list1, {
                flex: 1
            });

            this.splitterDragDrop.add(this.panel1);
        },
        createPanel2: function createPanel2() {
            var self = this;

            this.panel2 = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 2
            });

            this.panel2.add(this.createFiltersDragDropRight());

            this.list2 = new qxnw.widgets.list(null).set({
                selectionMode: "multi"
            });

            this.list2.list.setDraggable(true);
            this.list2.list.setDroppable(true);
            this.list2.setSelectionMode("multi");

            this.list2.addListener("dragstart", function (e) {
                e.addType("items");
                e.addType("value");
                e.addAction("copy");
                e.addAction("move");
            });
            this.list2.addListener("droprequest", function (e) {
                var action = e.getCurrentAction();
                var type = e.getCurrentType();
                var result;
                var selection = this.getSelection();
                var dragTarget = e.getDragTarget();

                dragTarget.setUserData("nw_state_drop", true);
                if (selection.length === 0) {
                    selection.push(dragTarget);
                } else if (selection.indexOf(dragTarget) == -1) {
                    selection = [dragTarget];
                }

                switch (type) {
                    case "items":
                        result = selection;
                        if (action == "copy") {
                            var copy = [];
                            for (var i = 0, l = result.length; i < l; i++) {
                                copy[i] = result[i].clone();
                            }
                            result = copy;
                        }
                        break;

                    case "value":
                        result = selection[0].getLabel();
                        break;
                }

                // Remove selected items on move
                if (action == "move") {
                    for (var i = 0, l = selection.length; i < l; i++) {
                        try {
                            this.remove(selection[i]);
                        } catch (e) {
                            qxnw.utils.error(e);
                        }
                    }
                }
                // Add data to manager
                e.addData(type, result);
            });

            this.list2.addListener("drop", function (e) {
                var items = e.getData("items");
                for (var i = 0, l = items.length; i < l; i++) {
                    self.list2.add(items[i]);
                    if (self.onDropRight !== null) {
                        self.onDropRight(items[i]);
                    }
                }
            });

            this.panel2.add(this.list2, {
                flex: 1
            });

            this.splitterDragDrop.add(this.panel2);
        },
        createFiltersDragDropLeft: function createFiltersDragDropLeft() {
            var self = this;
            this.leftTools = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                padding: 2
            });
            var selectAllButton = new qxnw.widgets.button(this.tr("Sel todo"), qxnw.config.execIcon("edit-redo"));

            var tT1 = new qx.ui.tooltip.ToolTip(self.tr("Seleccione todos los registros"), qxnw.config.execIcon("help-faq"));
            selectAllButton.setToolTip(tT1);

            var unselectAllButton = new qxnw.widgets.button(this.tr("Limpiar"), qxnw.config.execIcon("edit-undo"));

            var tT2 = new qx.ui.tooltip.ToolTip(self.tr("Libere todos los registros"), qxnw.config.execIcon("help-faq"));
            unselectAllButton.setToolTip(tT2);

            selectAllButton.addListener("execute", function () {
                self.list1.selectAll();
            });
            unselectAllButton.addListener("execute", function () {
                self.list1.resetSelection();
            });

            this.leftTools.add(selectAllButton);
            this.leftTools.add(unselectAllButton);

            var to = null;
            var icon = "";
            var spacer = new qx.ui.core.Spacer();
            icon = qxnw.config.execIcon("go-next");
            this.leftTools.add(spacer, {
                flex: 1
            });

            var text = self.tr("Enviar derecha");
            if (self.onlyIcons) {
                text = "";
            }
            to = new qxnw.widgets.button(text, icon);

            var tT = new qx.ui.tooltip.ToolTip(self.tr("Mueva los registros seleccionados al panel derecho"), qxnw.config.execIcon("help-faq"));
            to.setToolTip(tT);

            to.addListener("execute", function () {
                var s = self.list1.getSelection();
                if (s.length == 0) {
                    qxnw.utils.information(self.tr("No hay registros seleccionados"));
                    return;
                }
                for (var i = 0; i < s.length; i++) {
                    self.list2.add(s[i]);
                    if (self.onDropRight !== null) {
                        self.onDropRight(s[i]);
                    }
                }
            });

            this.leftTools.add(to);
            return this.leftTools;
        },
        createFiltersDragDropRight: function createFiltersDragDropRight() {
            var self = this;

            var to = null;
            var icon = "";
            var spacer = new qx.ui.core.Spacer();
            icon = qxnw.config.execIcon("go-previous");

            var text = self.tr("Enviar izquierda");
            if (self.onlyIcons) {
                text = "";
            }
            to = new qxnw.widgets.button(text, icon);

            var tT = new qx.ui.tooltip.ToolTip(self.tr("Mueva los registros seleccionados al panel izquierdo"), qxnw.config.execIcon("help-faq"));
            to.setToolTip(tT);

            this.rightTools = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                padding: 2
            });
            var selectAllButton = new qxnw.widgets.button(this.tr("Sel todo"), qxnw.config.execIcon("edit-redo"));

            var tT1 = new qx.ui.tooltip.ToolTip(self.tr("Seleccione todos los registros"), qxnw.config.execIcon("help-faq"));
            selectAllButton.setToolTip(tT1);

            var unselectAllButton = new qxnw.widgets.button(this.tr("Limpiar"), qxnw.config.execIcon("edit-undo"));

            var tT2 = new qx.ui.tooltip.ToolTip(self.tr("Libere todos los registros"), qxnw.config.execIcon("help-faq"));
            unselectAllButton.setToolTip(tT2);

            selectAllButton.addListener("execute", function () {
                self.list2.selectAll();
            });
            unselectAllButton.addListener("execute", function () {
                self.list2.resetSelection();
            });

            this.rightTools.add(to);

            this.rightTools.add(spacer, {
                flex: 1
            });

            this.rightTools.add(selectAllButton);
            this.rightTools.add(unselectAllButton);

            to.addListener("execute", function () {
                var s = self.list2.getSelection();
                if (s.length == 0) {
                    qxnw.utils.information(self.tr("No hay registros seleccionados"));
                    return;
                }
                for (var i = 0; i < s.length; i++) {
                    self.addToList(self.list1, s[i]);
                    if (self.onDropLeft !== null) {
                        self.onDropLeft(s[i]);
                    }
                }
            });

            return this.rightTools;
        },
        createFilters: function createFilters(filters) {
            this.setFilters(filters);
        },
        setFilters: function setFilters(filters) {
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
                self.masterContainer.addBefore(self.containerFilters, self.splitterDragDrop, {
                    flex: 1
                });
                var lblLine = new qx.ui.basic.Label("<hr>").set({
                    rich: true,
                    width: qx.bom.Viewport.getWidth(),
                    maxHeight: 7
                });
                self.masterContainer.addBefore(lblLine, self.splitterDragDrop, {
                    flex: 1
                });
            }
            var counter = 0;
            for (var i = 0; i < filters.length; i++) {
                var name = filters[i].name;
                var label = filters[i].label;
                var type = filters[i].type;
                var required = filters[i].required;
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
                self.createFilterWidget(name, type, label);
                self.ui[name].setAllowGrowY(false);
                self.ui[name].addListener("keypress", function (e) {
                    if (e._identifier == "Enter") {
                        self.ui["searchButton"].focus();
                        try {
                            self.ui["searchButton"].setFocusParent(this);
                        } catch (e) {
                            qxnw.utils.nwconsole(e);
                        }
                    }
                });
                if (type == "textField" || type == "textArea" || type == "selectTokenField") {
                    if (type == "selectTokenField") {
                        self.ui[name].getChildControl('textfield').setPlaceholder(label);
                    } else {
                        self.ui[name].setPlaceholder(label);
                    }
                }
                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                var asterisk = "";
                if (required === true) {
                    asterisk = "<b style='color:red'>*</b>";
                }
                if (typeof toolTip != 'undefined' && typeof toolTip != null) {
                    if (label != "null") {
                        label = label.replace("_", " ");
                        label = qxnw.utils.replaceAll(label, "<b style='color:red'>*</b>", "");
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
                    label = qxnw.utils.replaceAll(label, "<b style='color:red'>*</b>", "");
                    label = label.toString().replace("_", " ") + asterisk;
                    self.labelForm[name] = new qx.ui.basic.Label(label).set({
                        rich: true
                    });
                }
                if (required) {
                    self.labelForm[name].setUserData("required", required);
                }
                self.labelForm[name].setUserData("name", name);
                if (type == "button" || type == "label") {
                    self.labelForm[name].setValue("");
                } else if (type == "ckeditor") {
                    container.getLayout().set({
                        alignX: "right"
                    });
                } else if (type == "checkBox") {
                    container.getLayout().set({
                        alignX: "left"
                    });
                }
                container.add(self.labelForm[name], {
                    flex: 1
                });
                container.add(self.ui[name]);
                self.containerFilters.add(container, {
                    flex: 0
                });
                if (!focused) {
                    if (filters[i].visible) {
                        if (enabled) {
                            focused = true;
                            self.setFocusAsync(type, name);
                        }
                    }
                }

                if (type == "selectTokenField") {
                    self.ui[name].handleTabIndex(self.__tabIndexLists++);
                } else if (filters[i].type == "textField") {
                    self.ui[name].getChildControl('textfield').setTabIndex(self.__tabIndexLists++);
                } else {
                    self.ui[name].setTabIndex(self.__tabIndexLists++);
                }

                if (visible == false) {
                    self.setFieldVisibility(self.ui[name], "excluded");
                }
                counter++;
                self.count++;
            }
            if (counter > 0) {
                self.buttonSearch = new qx.ui.form.Button(self.tr("Consultar"), qxnw.config.execIcon("dialog-apply")).set({
                    maxHeight: 30
                });
                self.containerFilters.add(self.buttonSearch);
            }
        },
        getRightListRecords: function getRightListRecords() {
            var children = this.list2.getChildren();
            var rta = [];
            for (var i = 0; i < children.length; i++) {
                rta.push(children[i].getModel());
            }
            return rta;
        },
        getLeftListRecords: function getLeftListRecords() {
            var children = this.list1.getChildren();
            var rta = [];
            for (var i = 0; i < children.length; i++) {
                rta.push(children[i].getModel());
            }
            return rta;
        },
        createFilterWidget: function createFilterWidget(name, type, label) {
            var self = this;
            switch (type) {
                case "button":
                    self.ui[name] = new qx.ui.form.Button();
                    break;
                case "radioButton":
                    self.ui[name] = new qx.ui.form.RadioButton();
                    break;
                case "textField":
                    self.ui[name] = new qxnw.widgets.textField();
                    self.ui[name].setUserData("key", name);
                    self.ui[name].setMode("search", self.getAppWidgetName());
                    break;
                case "selectBox":
                    self.ui[name] = new qxnw.fields.selectBox();
                    self.ui[name].setUserData("name", name);
                    break;
                case "dateField":
                    self.ui[name] = new qxnw.widgets.dateField();
                    break;
                case "dateTimeField":
                    self.ui[name] = new qxnw.widgets.dateTimeField().set({
                        minWidth: 170
                    });
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
                    break;
                case "selectListCheck":
                    self.ui[name] = new qxnw.widgets.selectListCheck();
                    break;
                default:
                    qxnw.utils.alert(self.tr("Error en el tipo de objeto:") + name);
                    break;
            }

        }
    }
});
