qx.Class.define("qxnw.chartReport", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle("Chat report::NW Group");
        self.type = [];
        self.classname = "qxnw.chat_reports";
        self.__uniqueName = self.getAppWidgetName();
        self.__fields = [];
    },
    members: {
        filters: null,
        type: null,
        __uniqueName: null,
        createAutomatedReport: function createAutomatedReport(id) {
            this.createFiltersReport(id["detail"]);
            this.savePersistentId("?id=" + id["id"]);
        },
        savePersistentId: function savePersistentId(id) {
            if (typeof id == 'undefined') {
                this.__persistentId = true;
            } else {
                this.__persistentId = id;
            }
        },
        getFilters: function getFilters() {
            return this.filters;
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
                if (!self.__areCreatedOtherWidgets) {
                    self.createOtherWidgets();
                }
                self.navTableContainer.resetMaxHeight();
                self.navTableContainer.add(self.containerFilters);
            }
            for (var i = 0; i < filters.length; i++) {
                var name = filters[i].name;
                var label = filters[i].label;
                var type = filters[i].type;
                var required = filters[i].required;
                var mode = filters[i].mode;
                if (typeof filters[i].visible == 'undefined') {
                    filters[i].visible = true;
                }
                var enabled = typeof filters[i].enabled == 'undefined' ? true : filters[i].enabled;
                self.createFields(type, name, label, mode);
                self.type[name] = type;
                self.ui[name].setAllowGrowY(false);
                self.ui[name].addListener("keypress", function(e) {
                    if (e._identifier == "Enter") {
                        self.ui["searchButton"].focus();
                    }
                });
                if (type == "textField" || type == "textArea") {
                    self.ui[name].setPlaceholder(label);
                }

                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());

                var asterisk = "";
                if (required) {
                    asterisk = "<b style='color:red'>*</b>";
                }
                container.add(new qx.ui.basic.Label(label.replace("_", " ") + asterisk).set({
                    rich: true
                }), {
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
                self.ui[name].setTabIndex(self.__tabIndex++);
                self.count++;
                self.__fields.push(filters[i]);
            }
            self.buttonSearch = new qx.ui.form.Button(self.tr("Actualizar"), qxnw.config.execIcon("dialog-apply")).set({
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
            self.buttonSearch.setTabIndex(self.__tabIndex++);
            self.containerFilters.add(new qx.ui.core.Spacer(30, 40), {flex: 1});
            
//            self.printButton = new qx.ui.toolbar.Button(self.tr("Imprimir"), qxnw.config.execIcon("document-print-preview"));
//            var toolTip = new qx.ui.tooltip.ToolTip();
//            toolTip.setLabel(self.tr("Imprimir el informe"));
//            self.printButton.setToolTip(toolTip);
//            self.containerFilters.add(self.printButton);
            self.putCatchedContent();
        },
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
        },
        getCatchedFiltersValues: function getCatchedFiltersValues() {
            var self = this;
            var filtersValues = qxnw.local.getData(self.__uniqueName + "_catched_values");
            if (filtersValues == null) {
                return false;
            }
            return filtersValues;
        },
        catchFiltersValues: function catchFiltersValues() {
            var self = this;
            if (!qxnw.config.getSaveLists()) {
                return;
            }
            var catched = self.getRecord();
            if (typeof catched == 'undefined') {
                return;
            }
            try {
                qxnw.local.storeData(self.__uniqueName + "_catched_values", catched);
            } catch (e) {
                qxnw.utils.error(e, self);
            }
        },
        setFiltersData: function setFiltersData(data) {
            if (data == null) {
                return;
            }
            var self = this;
            var filters = self.__fields;
            if (filters == null) {
                return;
            }
            var items = null;
            for (var i = 0; i < filters.length; i++) {
                var name = filters[i].name;
                switch (filters[i]["type"]) {
                    case "textField":
                        if (data[name] == null) {
                            continue;
                        }
                        self.ui[name].setValue(data[name]);
                        break;
                    case "selectBox":
                        if (data[name] == null) {
                            continue;
                        }
                        items = self.ui[name]._getItems();
                        for (var ia = 0; ia < items.length; ia++) {
                            if (items[ia].getModel() == data[name]) {
                                self.ui[name].setSelection([items[ia]]);
                            }
                        }
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
        }
    }
});