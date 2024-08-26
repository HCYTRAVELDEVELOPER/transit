qx.Class.define("qxnw.treeWidget", {
    extend: qxnw.forms,
    construct: function (createAutoFilter) {
        this.base(arguments);
        var self = this;
        self.createAll();
        self.labelForm = [];
        self.__filtersRequireds = [];
//        self.insertedNavTables = [];
        if (typeof createAutoFilter === 'undefined' || createAutoFilter === true) {
            self.createAutoFilter();
        }
        self.addListener("close", function (e) {
            self.cleanAll();
        });
        self.addListener("appear", function () {
            if (self.textFiedlAutoFilter != null) {
                self.textFiedlAutoFilter.focus();
            }
        });
        self.containerFieldsArray = [];
    },
    destruct: function destruct() {

        try {

            if (qxnw.utils.isDebug()) {
                if (qxnw.config.getShowDestroyObjects() == true) {
                    console.log("%c<<<< Destroy TREE >>>>", 'background: #53674F; color: #bada55');
                    console.log("Tree name: ", this.getAppWidgetName());
                    console.log("Class: ", this.classname);
                    console.log("%c<<<< END >>>>", 'background: #53674F; color: #bada55');
                }
            }

            this.destroy();

            this._disposeObjects("leftScroller");
            this._disposeObjects("rightWidget");
            this._disposeObjects("parentContainerWidget");
            this._disposeObjects("tabWidget");
            this._disposeObjects("splitter");
            this._disposeObjects("tabView");

            if (typeof this.ui != 'undefined') {
                if (this.ui != null) {
                    for (var i = 0; i < this.ui.length; i++) {
                        this._disposeObjects(this.fields[i]);
                    }
                }
            }
            if (this.tree != null) {
                this.cleanTree();
            }
            this._disposeObjects("tree");

            if (typeof this.insertedNavTables != 'undefined') {
                if (this.insertedNavTables != null) {
                    for (var i = 0; i < this.insertedNavTables.length; i++) {
                        this.insertedNavTables[i].dispose();
                        this.insertedNavTables[i].destroy();
                        this._disposeObjects(this.insertedNavTables[i]);
                    }
                }
            }

            this.insertedNavTables = null;

            this.dispose();
        } catch (e) {
            if (qxnw.utils.isDebug()) {
                console.log("ERROR DISPOSING: ", e);
            }
            this.dispose();
        }
    },
    events: {
        "NWChangeFieldVisibility": "qx.event.type.Event"
    },
    properties: {
        createButton: {
            init: true,
            check: "Boolean"
        },
        totalListRecords: {
            init: 0
        },
        askOnCloseSubWindow: {
            init: false,
            check: "Boolean",
            apply: "_changeCloseEvent"
        }
    },
    members: {
        containerFieldsArray: null,
        insertedNavTables: null,
        tree: null,
        leftScroller: null,
        __root: null,
        __isMinimizedTreeWidget: false,
        rightWidget: null,
        splitter: null,
        ui: null,
        type: null,
        treeFolders: null,
        treeFiles: null,
        isFirst: null,
        __secondLayer: null,
        __oldWidget: null,
        isFirstLeft: true,
        __isPutCatchedContent: false,
        parentContainerWidget: null,
        tabWidget: null,
        labelForm: null,
        allLeftContainer: null,
        __paginationLayer: null,
        maxRows: null,
        page: null,
        __labelTotalPags: null,
        initIconWidget: null,
        nextIconWidget: null,
        previousIconWidget: null,
        lastIconWidget: null,
        __maxPages: null,
        informationLbl: null,
        firstItems: null,
        titleHeader: null,
        titleHeaderIcon: null,
        scrollerPagination: null,
        ctnr: null,
        lblAutoFilter: null,
        textFiedlAutoFilter: null,
        __settingsButton: null,
        __treeLabel: null,
        //TODO: IMPORTANTE->AGREGAR EL SIGUIENTE MÉTODO A LA FUNCIÓN _onPageClose DE LA CLASE: qx.ui.tabview.TabView
//        if (typeof this.getAskOnCloseSubWindow != 'undefined' && this.getAskOnCloseSubWindow === true) {
//                var these = this;
//                // reset the old close button states, before remove page
//                // see http://bugzilla.qooxdoo.org/show_bug.cgi?id=3763 for details
//                var page = e.getTarget();
//                qxnw.utils.question(this.tr("¿Está segur@ de cerrar la ventana?"), function (ea, page) {
//                    if (ea) {
//                        var closeButton = page.getButton().getChildControl("close-button");
//                        closeButton.reset();
//                        these.remove(page);
//                    }
//                }, page);
//            } else {
//                var page = e.getTarget();
//                var closeButton = page.getButton().getChildControl("close-button");
//                closeButton.reset();
//                this.remove(page);
//            }
        addLabelToTree: function addLabelToTree(str, replace) {
            var self = this;
            if (typeof replace == 'undefined') {
                replace = false;
            }
            if (!replace) {
                var c = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                    padding: 5
                });
                qxnw.utils.addBorder(c, "green", 1);
                var label = new qx.ui.basic.Label(str);
                c.add(label);
            } else {
                if (self.__treeLabel == null) {
                    var c = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                        padding: 5
                    });
                    qxnw.utils.addBorder(c, "green", 1);
                    var label = new qx.ui.basic.Label(str);
                    self.__treeLabel = label;
                    c.add(label);
                } else {
                    self.__treeLabel.setValue(str);
                    return;
                }
            }
            self.allLeftContainer.add(c);
        },
        createSettingsButton: function createSettingsButton(contextMenu) {
            var self = this;
            var container = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: qxnw.config.getPaddingTreeWidget()
            });
            self.ui["settingsButton"] = new qx.ui.form.Button(self.tr("Configuración")).set({
                padding: 1,
                icon: qxnw.config.execIcon("system-run"),
                show: "icon"
            });
            var tT = new qx.ui.tooltip.ToolTip(self.tr("Opciones generales de configuración"), qxnw.config.execIcon("help-faq"));
            self.ui["settingsButton"].setToolTip(tT);

            container.add(self.ui["settingsButton"], {
                flex: 1
            });
            self.containerFilters.add(container, {
                flex: 0
            });
            self.ui["settingsButton"].addListener("click", function () {
                self.ui["settingsButton"].setContextMenu(self[contextMenu]());
            });
        },
        _changeCloseEvent: function _changeCloseEvent(value) {
            var self = this;
            if (self.tabView != null) {
                self.tabView.getAskOnCloseSubWindow = value;
            }
        },
        createAutoFilter: function createAutoFilter() {
            var self = this;
            var ctnr = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: qxnw.config.getPaddingTreeWidget()
            });

            self.ctnr = ctnr;

            var lbl = new qx.ui.basic.Atom(self.tr("Auto filtro"), qxnw.config.execIcon("dialog-information", "status")).set({
                iconPosition: "right",
                gap: 1,
                rich: true
            });
            self.lblAutoFilter = lbl;
            var tT = new qx.ui.tooltip.ToolTip(self.tr("Filtro rápido sin ejecutar la base de datos. (Los datos no se actualizarán directamente del servidor)"), qxnw.config.execIcon("help-faq"));
            lbl.setToolTip(tT);

            ctnr.add(lbl);
            var sl = new qxnw.widgets.normalTextField().set({
                maxHeight: 25,
                minHeight: 25
            });
            self.textFiedlAutoFilter = sl;
            sl.setTabIndex(qxnw.config.getActualTabIndex());
            self.ui["texfield_auto_filter"] = sl;
            sl.addListener("input", function (e) {
                var key = e.getData();
                self.toSearch(key);
            });
            sl.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                if (key == "Backspace" || key == "Delete" && this.getValue() != "") {
                    self.toSearch(this.getValue(), true);
                } else if (key == "Enter") {
                    try {
                        self.ui["searchButton"].focus();
                    } catch (e) {

                    }
                }
            });
            sl.setPlaceholder(self.tr("Buscar..."));
            ctnr.add(sl);
            self.containerFilters.add(ctnr);
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
            var items = self.tree.getItems(true);
            var oldItems = qx.lang.Object.clone(items, false);
            if (self.firstItems == null) {
                self.firstItems = oldItems;
            }
            var haveChildren = true;
            var toDelete = false;
            var itemNo = 0;
            for (var i = 0; i < oldItems.length; i++) {
                var itemLabel = oldItems[i].getChildControl("label").getValue();
                itemLabel = itemLabel.toLowerCase();
                itemLabel = qxnw.utils.cleanHtml(itemLabel);
                toDelete = false;
                if (itemLabel.indexOf(key.toLowerCase()) == -1) {
                    toDelete = true;
                }
                var level = oldItems[i].getLevel();
                var deleteParentToo = false;
                haveChildren = oldItems[i].hasChildren();
//                console.log({
//                    hasChildren: haveChildren,
//                    label: itemLabel,
//                    key: key,
//                    finded: itemLabel.indexOf(key.toLowerCase()),
//                    toDelete: toDelete,
//                    level: level
//                });
                if (toDelete && !haveChildren) {
                    var parent = oldItems[i].getParent();
                    if (parent != null && level > 0) {
                        if (parent.getChildControl("label") != null) {
                            var itemLabelParent = parent.getChildControl("label").getValue();
                            itemLabelParent = itemLabelParent.toLowerCase();
                            itemLabelParent = qxnw.utils.cleanHtml(itemLabelParent);
                            if (itemLabelParent.indexOf(key.toLowerCase()) == -1) {
                                deleteParentToo = true;
                            }
//                        console.log({
//                            itemNo: itemNo,
//                            deleteParentToo: deleteParentToo,
//                            parentChildren: parent.getChildren().length
//                        });
                            var parentLevel = parent.getLevel();
                            if (parentLevel == 0) {

                            }
                            if (deleteParentToo) {
                                parent.remove(oldItems[i]);
                            }
                        }
                    } else {
                        self.__root.remove(oldItems[i]);
                    }
                }
            }
        },
        toSearchAfter: function toSearchAfter(key, back) {
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
                }
            }
            var items = self.tree.getItems(true);
            var oldItems = qx.lang.Object.clone(items, false);
            if (self.firstItems == null) {
                self.firstItems = oldItems;
            }
            var haveChildren = true;
            var afterItem = null;
            for (var i = 0; i < oldItems.length; i++) {
                var itemLabel = oldItems[i].getChildControl("label").getValue();
                itemLabel = itemLabel.toLowerCase();
                itemLabel = qxnw.utils.cleanHtml(itemLabel);
//                console.log({
//                    hasChildren: oldItems[i].hasChildren(),
//                    label: itemLabel,
//                    key: key,
//                    finded: itemLabel.indexOf(key.toLowerCase())
//                });
                haveChildren = oldItems[i].hasChildren();
                if (itemLabel.indexOf(key.toLowerCase()) == -1) {
                    if (!haveChildren) {
                        var parent = oldItems[i].getParent();
                        if (parent != null) {
                            parent.remove(oldItems[i]);
                        } else {
                            self.__root.remove(oldItems[i]);
                        }
                    }
                }
                afterItem = itemLabel[i];
            }
        },
        cleanAndRestoreItems: function cleanAndRestoreItems() {
            var self = this;
            var children = self.tree.getItems(true);
            for (var i = 0; i < children.length; i++) {
                var parent = children[i].getParent();
                if (parent != null) {
                    parent.remove(children[i]);
                } else {
                    self.__root.remove(children[i]);
                }
            }
            var old = null;
            if (self.firstItems != null) {
                old = self.firstItems[0];
                for (var i = 0; i < self.firstItems.length; i++) {
                    if (i != 0) {
                        var level = self.firstItems[i].getUserData("level");
                        if (level == 3 && old != null) {
                            old.add(self.firstItems[i]);
                            continue;
                        } else {
                            self.__root.add(self.firstItems[i]);
                        }
                        old = self.firstItems[i];
                    }
                }
            }
        },
        addLeftWidget: function addLeftWidget(widget) {
            var self = this;
            self.allLeftContainer.add(widget);
        },
        addInformation: function addInformation(str) {
            var self = this;
            if (self.informationLbl == null) {
                var lbl = new qx.ui.basic.Label(str).set({
                    rich: true,
                    alignY: "middle"
                });
                self.informationLbl = lbl;
            } else {
                self.informationLbl.setValue(str);
            }
            self.__paginationLayer.add(self.informationLbl);
        },
        handleExecPages: function handleExecPages(r) {
            var self = this;
            var settings = {
                currentPage: r.currentPage,
                recordsPerPage: r.recordsPerPage,
                pageCount: r.pageCount,
                recordCount: r.recordCount
            };
            if (typeof settings.recordsPerPage != 'undefined') {
                self.ui["maxRowsField"].setValue(parseInt(settings.recordsPerPage));
                if (self.__paginationLayer == null) {
                    return;
                }
                self.__paginationLayer.setVisibility("visible");
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
            if (typeof settings.pageCount != 'undefined') {
                self.scrollerPagination.setVisibility("visible");
            }
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
        /**
         * Adds widgets to filters bar
         * @param widget {Object} the widget
         * @returns {void}
         */
        addWidgetToFiltersBar: function addWidgetToFiltersBar(widget) {
            var self = this;
            self.containerFilters.addBefore(widget, self.buttonSearch);
        },
        validate: function validate() {
            var self = this;
            var fields = self.filters;
            var r = self.getFiltersData(false);
            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].name;
                var required = fields[i].required;
                var mode = fields[i].mode;
                var type = fields[i].type;
                var label = fields[i].label;
                var valid = true;
                if (required) {
                    var msg = self.tr(" no puede estar vacío.");
                    if (type == "tokenField" || type == "selectTokenField" || type == "selectListCheck") {
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
                        case "textField":
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
                        if (qxnw.config.getShowInformationOnValidate() && msg != "") {
                            var call = function () {
                                if (self.ui[name].isFocusable()) {
                                    self.ui[name].focus();
                                }
                            };
                            qxnw.utils.information(label + msg, call);
                        }
                        if (self.ui[name].isFocusable()) {
                            try {
                                self.ui[name].focus();
                            } catch (e) {

                            }
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
                            if (qxnw.config.getShowInformationOnValidate() && msg != "") {
                                qxnw.utils.information(msg);
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
            self.tabWidget.add(page, {
                flex: 1
            });
            self.parentContainerWidget.getChildControl("button").setVisibility('visible');
        },
        getCatchedFiltersValues: function getCatchedFiltersValues() {
            var self = this;
            var filtersValues = qxnw.local.getData(self.getAppWidgetName() + "_catched_values");
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
        removeOnLayer: function removeOnLayer() {
            if (this.__secondLayer != null) {
                this.__secondLayer.removeAll();
            }
        },
        replaceOnLayer: function replaceOnLayer(html) {
            var self = this;
            if (typeof html == "string") {
                html = new qx.ui.basic.Label(html).set({
                    rich: true,
                    selectable: true
                });
            }
            var padding = 5;
            html.setPadding(padding, padding, padding, padding);
            var group = new qx.ui.groupbox.GroupBox(self.tr("Información adicional"), qxnw.config.execIcon("dialog-information", "status")).set({
                contentPadding: 2
            });
            group.setLayout(new qx.ui.layout.HBox());
            group.add(html);
            self.__secondLayer.removeAll();
            self.__secondLayer.add(group, {
                flex: 1
            });
            html.addListener("appear", function () {
                qx.bom.element.Class.add(html.getContentElement().getDomElement(), "nw_second_layer");
            });
            self.__oldWidget = html;
        },
        createSecondLayer: function createSecondLayer() {
            var self = this;
            var heightLeft = qxnw.local.getData("qxnw_tree_left");
            if (heightLeft == null) {
                heightLeft = 250;
            }
            self.__secondLayer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            self.__secondLayer.addListener("resize", function (e) {
                var data = e.getData();
                if (self.isFirstLeft) {
                    self.isFirstLeft = false;
                    return;
                }
                qxnw.local.storeData("qxnw_tree_left", data.height);
            });
            var scroller = new qx.ui.container.Scroll().set({
                decorator: "main",
                height: heightLeft
            });
            scroller.add(self.__secondLayer);
            self.leftWidget.add(scroller, 0);
        },
        createAll: function createAll() {
            var self = this;
            self.ui = {};
            self.treeFolders = [];
            self.treeFiles = [];
            self.type = [];

            self.tabWidget = new qx.ui.tabview.TabView();
            self.tabWidget.setBarPosition("right");
            self.tabWidget.setContentPadding(0);
            self.tabWidget.setPadding(0);
            self.masterContainer.set({
                padding: 0
            });
            self.masterContainer.add(self.tabWidget, {
                flex: 1
            });
            self.parentContainerWidget = new qx.ui.tabview.Page("", qxnw.config.execIcon("utilities-log-viewer", "apps"));
            self.parentContainerWidget.setPadding(0);
            self.parentContainerWidget.getChildControl("button").setShow("icon");
            var tT = new qx.ui.tooltip.ToolTip(self.tr("Listado general de datos"), qxnw.config.execIcon("help-faq"));
            self.parentContainerWidget.getChildControl("button").setToolTip(tT);
            self.parentContainerWidget.getChildControl("button").setAllowGrowY(false);
            self.parentContainerWidget.getChildControl("button").setAllowGrowX(false);
            self.parentContainerWidget.getChildControl("button").setPadding(1);
            self.parentContainerWidget.getChildControl("button").setVisibility('excluded');

            self.tabWidget.getChildControl("bar").setVisibility('excluded');

            self.parentContainerWidget.setLayout(new qx.ui.layout.VBox());
            self.tabWidget.add(self.parentContainerWidget);

            var verticalLayout = new qx.ui.layout.VBox();
            self.setLayout(verticalLayout);

            self.addListener("beforeContextmenuOpen", function () {
                self.resetContextMenu();
                self.setContextMenu(null);
            });

            self.containerFilters = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                spacing: 2
            })).set({
                padding: 0,
                allowGrowY: false,
                allowShrinkY: false
            });

            var scroller = new qx.ui.container.Scroll().set({
                padding: 0,
                contentPadding: 0
            });

            var containerInsideScroller = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 0
            });

            containerInsideScroller.add(self.containerFilters, {
                flex: 0
            });
            scroller.add(containerInsideScroller);

            self.parentContainerWidget.add(scroller, {
                flex: 1
            });

            self.splitter = new qx.ui.splitpane.Pane("horizontal").set({
                padding: 0
            });

            containerInsideScroller.add(self.splitter, {
                flex: 1
            });
            //var widthLeft = qxnw.local.getData("asignaciones_scroll") == null ? 250 : qxnw.local.getData("asignaciones_scroll");
            var widthLeft = qxnw.local.getData("qxnw_tree_ge");
            if (widthLeft == null) {
                widthLeft = 250;
            }
            self.leftScroller = new qx.ui.container.Scroll().set({
                decorator: "main",
                width: widthLeft,
                padding: 0,
                contentPadding: 0
            });

            //self.leftWidget = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            self.leftWidget = new qx.ui.splitpane.Pane("vertical").set({
                padding: 0,
                offset: 0
            });

//            self.leftWidget.getChildControl("splitter").setMaxWidth(1);

            this.captions = [];

            self.allLeftContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 0
            });

            var miniToolsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                padding: 0
            });
            self.miniToolsContainer = miniToolsContainer;

            self.miniToolsContainer.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "tree_folder_path");
            });

            var minimize = new qx.ui.form.Button("", qxnw.config.execIcon("view-restore")).set({
                show: "icon",
                cursor: "pointer",
                focusable: false
            });
            minimize.setAppearance("label");
            minimize.set({
                maxHeight: 10,
                maxWidth: 10
            });
            minimize.addListener("execute", function () {
                var oldValues = null;
                if (!self.__isMinimizedTreeWidget) {
                    oldValues = self.tree.getBounds().width;
                    qxnw.local.storeData(self.getAppWidgetName() + "_minimizeTreeWidget", oldValues);
                    self.tree.setWidth(2);
                    self.leftScroller.setWidth(20);
                    self.__isMinimizedTreeWidget = true;
                } else {
                    var dt = qxnw.local.getData(self.getAppWidgetName() + "_minimizeTreeWidget");
                    if (dt != null) {
                        self.tree.setWidth(dt);
                        self.leftScroller.setWidth(dt);
                        qxnw.local.storeData(self.getAppWidgetName() + "_minimizeTreeWidget", null);
                    }
                    self.__isMinimizedTreeWidget = false;
                }
            });
            var tree = self.createTree();

            miniToolsContainer.add(tree, {
                flex: 1
            });
            miniToolsContainer.add(minimize, {
                flex: 0
            });

            var treeMinimizeAuth = qxnw.config.getTreeLeftWidget();
            if (treeMinimizeAuth === true) {
                self.leftScroller.setWidth(20);
                self.tree.setWidth(2);
                self.leftWidget.addListener("mouseover", function () {
                    self.leftScroller.setWidth(300);
                    self.tree.setWidth(300);
                });
                self.leftWidget.addListener("mouseout", function () {
                    self.tree.setWidth(2);
                    self.leftScroller.setWidth(20);
                });
            }

            self.allLeftContainer.add(miniToolsContainer, {
                flex: 1
            });

            self.leftWidget.add(self.allLeftContainer, 1);
            self.leftScroller.add(self.leftWidget, 1);
            self.splitter.add(self.leftScroller, 0);
            self.rightWidget = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 0
            });
            self.tabView = new qx.ui.tabview.TabView().set({
                contentPadding: 0,
                padding: 0
            });
            self.isFirst = true;
            self.leftScroller.addListener("resize", function (e) {
                if (self.isFirst) {
                    self.isFirst = false;
                    return;
                }
                var v = self.leftScroller.getWidth();
                if (!self.__isMinimizedTreeWidget) {
                    qxnw.local.storeData(self.getAppWidgetName() + "_minimizeTreeWidget", v);
                }
                qxnw.local.storeData("qxnw_tree_ge", v);
            });

            self.rightWidget.add(self.tabView, {
                flex: 1
            });
            self.splitter.add(self.rightWidget, 1);

            self.createPagination();
        },
        populate: function populate(method, funct, param, icon, callback) {
            var self = this;
            if (typeof icon == 'undefined' || icon == 0 || icon == false) {
                icon = qxnw.config.execIcon("preferences-users", "apps");
            }
            var func = function (rta) {
                for (var i = 0; i < rta.length; i++) {
                    var r = rta[i];
                    if (typeof r.icon != 'undefined') {
                        icon = r.icon;
                    }
                    var item = self.addTreeFile(r.nombre, icon, r);
                    if (typeof callback != 'undefined') {
                        item.addListener("click", function () {
                            callback(this.getModel());
                        });
                    }
                }
            };
            qxnw.utils.fastAsyncCallRpc(method, funct, param, func);
        },
        createPagination: function createPagination() {
            var self = this;
            self.__paginationLayer = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignY: "top",
                alignX: "center",
                spacing: 5
            }));

            self.__paginationLayer.setVisibility("excluded");
            var scroller = new qx.ui.container.Scroll().set({
                decorator: null,
                maxHeight: 70,
                minHeight: 70
            });

            self.scrollerPagination = scroller;
//height: 40,
            scroller.add(self.__paginationLayer);

            //MAX ROWS
            var compositeMaxRows = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                alignY: "middle"
            }));
            var labelMaxRows = new qx.ui.basic.Label(self.tr("Registros por <br />página")).set({
                rich: true
            });
            self.maxRows = new qx.ui.form.Spinner(20).set({
                minWidth: 70,
                maxWidth: 70,
                maxHeight: 25,
                maximum: 10000000000000,
                minimum: 1
            });
            self.maxRows.setToolTip(self.__toolTipsManager("maxRows"));
            self.maxRows.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    try {
                        if (typeof self.applyFilters != 'undefined') {
                            self.applyFilters();
                        } else {
                            self.populateTree();
                        }
                        this.getChildControl("textfield").focus();
                    } catch (e) {

                    }
                }
            });
            self.maxRows.addListener("changeValue", function () {
                qxnw.local.storeData(self.getAppWidgetName() + "_nav_max_show_rows", this.getValue());
            });
            compositeMaxRows.add(labelMaxRows);
            compositeMaxRows.add(self.maxRows);
            self.__paginationLayer.add(compositeMaxRows);
            self.ui["maxRowsField"] = self.maxRows;

            //PÁGINA ACTUAL
            var containerPage = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                alignY: "middle"
            }));
            var labelPage = new qx.ui.basic.Label(self.tr("Página actual"));
            self.page = new qx.ui.form.Spinner(1).set({
                minWidth: 70,
                maxWidth: 70,
                maxHeight: 25,
                maximum: 10000000000000,
                minimum: 1
            });
            self.page.addListener("keyup", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    try {
                        self.__focusTablePaneScroll = false;
                        self.executePopulate();
                        this.getChildControl("textfield").focus();
                    } catch (e) {

                    }
                }
            });
            self.page.setToolTip(self.__toolTipsManager("actual_page"));
            containerPage.add(labelPage);
            containerPage.add(self.page);
            self.ui["page"] = self.page;
            self.__paginationLayer.add(containerPage);

            //LABEL Y BOTONES:
            self.__labelTotalPags = new qx.ui.basic.Label(self.tr("Total páginas: 0")).set({
                rich: true,
                alignY: "middle"
            });
            self.ui["labelTotalPags"] = self.__labelTotalPags;
            self.__paginationLayer.add(self.__labelTotalPags, {
                flex: 1
            });

            var paginationSelect = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                alignY: "middle"
            }));
            self.initIconWidget = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("go-first")).set({
                show: "icon",
                maxHeight: 30
            });
            self.initIconWidget.addListener("execute", function () {
                var oldValue = self.ui["page"].getValue();
                if (oldValue != 1) {
                    self.page.setValue(1);
                    self.executePopulate();
                }
            });
            self.nextIconWidget = new qx.ui.form.Button(self.tr(""), qxnw.config.execIcon("go-next")).set({
                show: "icon",
                maxHeight: 30
            });
            self.nextIconWidget.addListener("execute", function () {
                var oldValue = self.ui["page"].getValue();
                if (oldValue != self.__maxPages) {
                    if (oldValue < self.__maxPages) {
                        oldValue = oldValue + 1;
                        self.ui["page"].setValue(oldValue);
                        self.executePopulate();
                    }
                }
            });
            self.previousIconWidget = new qx.ui.form.Button("", qxnw.config.execIcon("go-previous")).set({
                show: "icon",
                maxHeight: 30
            });
            self.previousIconWidget.addListener("execute", function () {
                var oldValue = self.ui["page"].getValue();
                if (oldValue > 1) {
                    oldValue = oldValue - 1;
                    self.ui["page"].setValue(oldValue);
                    self.executePopulate();
                }
            });
            self.lastIconWidget = new qx.ui.form.Button("", qxnw.config.execIcon("go-last")).set({
                show: "icon",
                maxHeight: 30
            });
            self.lastIconWidget.addListener("execute", function () {
                if (self.__maxPages != null) {
                    self.page.setValue(self.__maxPages);
                    self.executePopulate();
                }
            });
            paginationSelect.add(self.initIconWidget);
            paginationSelect.add(self.previousIconWidget);
            paginationSelect.add(self.nextIconWidget);
            paginationSelect.add(self.lastIconWidget);
            self.__paginationLayer.add(paginationSelect);

            //TODO: EN REVISIÓN 18-ENE-2016
            //scroller.add(self.__paginationLayer);
            //self.allLeftContainer.add(scroller);

            var spaceBottom = new qx.ui.container.Composite((new qx.ui.layout.HBox())).set({
                minHeight: 50
            });
            self.__paginationLayer.add(spaceBottom);

            scroller.setVisibility("excluded");

            self.allLeftContainer.add(scroller);
        },
        changeLabel: function changeLabel(name, text) {
            var rq = this.labelForm[name].getUserData("required");
            if (rq) {
                this.labelForm[name].setValue(text + "<b style='color:red'>*</b>");
            } else {
                this.labelForm[name].setValue(text);
            }
        },
        setRequired: function setRequired(name, bool) {
            var self = this;
            var fields = self.filters;
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
        executePopulate: function executePopulate() {
            var self = this;
            try {
                if (typeof self.applyFilters != 'undefined') {
                    self.applyFilters();
                } else {
                    self.populateTree();
                }
            } catch (e) {
                qxnw.utils.error(e, self);
            }
        },
        __toolTipsManager: function __toolTipsManager(type) {
            var self = this;
            var toolTipText = "unknown";
            switch (type) {
                case "cmi":
                    toolTipText = self.tr("Guardar en el cuadro de mando integral. Una forma de mantener la información de este \n\
                                            listado disponible para estadísticas de seguimiento.");
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
        },
        getTreeSelection: function getTreeSelection() {
            var self = this;
            var selection = self.tree.getSelection();
            if (selection.length == 0) {
                return;
            }
            var data = [];
            for (var i = 0; i < selection.length; i++) {
                data[i] = selection[i].getModel();
            }
            return data;
        },
        addTreeHeader: function addTreeHeader(title, icon, hide) {
            var self = this;
            self.tree.resetRoot();
            if (typeof hide != 'undefined') {
                self.tree.setHideRoot(hide);
            }
            self.tree.setDecorator(null);
            self.titleHeader = title;
            self.titleHeaderIcon = icon;
            self.titleHeaderHide = hide;
            self.__root = new qx.ui.tree.TreeFolder(title).set({
                icon: icon
            });
            self.__root.setOpen(true);
            self.tree.setRootOpenClose(true);
            self.tree.setRoot(self.__root);
            return self.tree;
        },
        addTreeFolder: function addTreeFolder(title, icon, model, type, open) {
            var self = this;

            var options = {};
            if (qxnw.utils.evalueData(icon)) {
                options.icon = icon;
            }
            var treeFolders = new qx.ui.tree.TreeFolder(title).set(options);
            treeFolders.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "tree_folder_row");
            });
            treeFolders.setUserData("level", 2);
            treeFolders.getChildControl("label").setRich(true);
            if (typeof type != 'undefined') {
                if (type != 0) {
                    if (type != null) {
                        switch (type) {
                            case "checkbox":
                                var checkBox = new qx.ui.form.CheckBox();
                                checkBox.setFocusable(false);
                                checkBox.setTriState(true);
                                treeFolders.setUserData("checkbox", checkBox);
                                treeFolders.addWidget(checkBox);
                                break;
                        }
                    }
                }
            }
            if (typeof model != 'undefined') {
                if (model != 0) {
                    treeFolders.setModel(model);
                }
            }
            if (typeof open != 'undefined') {
                if (typeof open != 0) {
                    treeFolders.setOpen(open);
                }
            }
            self.__root.add(treeFolders);
            return treeFolders;
        },
        addTreeFile: function addTreeFile(title, icon, model, parent, type, open) {
            var self = this;
            var icon = typeof icon == 'undefined' ? self.getLevelOneIcon() : icon;
            var treeFiles = new qx.ui.tree.TreeFile(title).set({
                icon: icon
            });
            treeFiles.setUserData("level", 3);
            treeFiles.getChildControl("label").setRich(true);
            if (typeof type != 'undefined') {
                if (type != 0) {
                    if (type != null) {
                        switch (type) {
                            case "checkbox":
                                var checkBox = new qx.ui.form.CheckBox();
                                treeFiles.addWidget(checkBox);
                                break;
                        }
                    }
                }
            }
            if (typeof model != 'undefined') {
                if (model != 0) {
                    treeFiles.setModel(model);
                }
            }
            if (typeof open != 'undefined') {
                if (typeof open != 0) {
                    treeFiles.setOpen(open);
                }
            }
            var parentTree = typeof parent == 'undefined' ? self.__root : parent;
            parentTree.add(treeFiles);
            return treeFiles;
        },
        getRoot: function getRoot() {
            return this.__root;
        },
        getRpcUrl: function getRpcUrl() {
            return qxnw.userPolicies.getRpcUrl();
        },
        cleanAll: function cleanAll() {
            var self = this;
            self.closeTimeOut = new qx.event.Timer(1000);
            self.closeTimeOut.start();
            self.closeTimeOut.addListener("interval", function (e) {
                this.stop();
                try {
                    if (typeof self.insertedNavTables != 'undefined') {
                        if (self.insertedNavTables !== null) {
                            for (var i = 0; i < self.insertedNavTables.length; i++) {
                                if (typeof self.insertedNavTables[i].close != 'undefined') {
                                    self.insertedNavTables[i].close();
                                }
                                self.insertedNavTables[i].destroy();
                            }
                        }
                    }
                    if (self !== null) {
                        self.destroy();
                    }
                    self.ui = null;
                } catch (e) {
                    console.log(e);
                }
                self.closeTimeOut = null;
            });
        },
        /**
         * An alias of getSelectedItem
         * @returns {void}
         */
        selectedRecord: function selectedRecord() {
            return this.getSelectedItem();
        },
        getSelectedItem: function getSelectedItem() {
            var self = this;
            var items = self.tree.getSelection();
            if (typeof items[0] == 'undefined') {
                return new Array();
            }
            var item = items[0].getModel();
            if (item == null) {
                return new Array();
            }
            return item;
        },
        setSelectionMode: function setSelectionMode(type) {
            if (typeof this.tree != 'undefined') {
                this.tree.setSelectionMode(type);
            }
        },
        getSelectedItems: function getSelectedItems() {
            var self = this;
            var items = self.tree.getSelection();
            var data = new Array();
            for (var i = 0; i < items.length; i++) {
                var item = items[i].getModel();
                data.push(item);
            }
            return data;
        },
        createButtonSearch: function createButtonSearch(tabIndex) {
            var self = this;
            if (!self.getCreateButton()) {
                return;
            }
            var ctnr = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: qxnw.config.getPaddingTreeWidget(),
                alignY: "middle"
            });
            self.buttonSearch = new qx.ui.form.Button(self.tr("Actualizar"), qxnw.config.execIcon("dialog-apply")).set({
                maxHeight: 35
            });
            self.ui["buttonSearch"] = self.buttonSearch;
            //self.buttonSearch.setAllowGrowY(false);
            ctnr.add(self.buttonSearch, {
                flex: 1
            });
//            qxnw.utils.addBorder(ctnr);
            self.containerFilters.add(ctnr, {
                flex: 0
            });
            self.__spacer = new qx.ui.core.Spacer(30, 40);
            self.containerFilters.add(self.__spacer, {
                flex: 1
            });
            self.buttonSearch.addListener("execute", function () {
                self.catchFiltersValues();
            });
            self.ui["searchButton"] = self.buttonSearch;
            if (typeof tabIndex != 'undefined') {
                self.buttonSearch.setTabIndex(qxnw.config.getActualTabIndex());
            }
        },
        setFieldVisibility: function setFieldVisibility(field, visible) {
            var content = field.getLayoutParent();
            content.setVisibility(visible);
            this.fireEvent("NWChangeFieldVisibility");
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
        createFilters: function createFilters(filters) {
            var self = this;
            var focused = false;
            self.filters = filters;
            var isDateWidgetStart = false;
            var isDateWidgetEnd = false;
            for (var i = 0; i < filters.length; i++) {
                var name = filters[i].name;
                var label = filters[i].label;
                var type = filters[i].type;
                var required = filters[i].required;
                var toolTip = filters[i].toolTip;
                if (required == 1) {
                    required = true;
                }
                if (required == 0) {
                    required = false;
                }
                if (typeof filters[i].visible == 'undefined') {
                    filters[i].visible = true;
                }
                var visible = filters[i].visible;
                var enabled = typeof filters[i].enabled == 'undefined' ? true : filters[i].enabled;
                switch (type) {
                    case "selectTokenField":
                        self.ui[name] = new qxnw.widgets.selectTokenField();
                        self.ui[name].setUniqueName(self.getAppWidgetName() + name + type + label);
                        self.ui[name].setSelectionMode('single');
                        break;
                    case "button":
                        self.ui[name] = new qx.ui.form.Button(label).set({
                            padding: 1,
                            maxHeight: 35
                        });
//                        self.ui[name].setAllowGrowY(false);
                        if (typeof filters[i].icon != 'undefined') {
                            self.ui[name].setIcon(filters[i].icon);
                        }
                        break;
                    case "textField":
                        // TODO: ANDRESF 31 may 2018: mejora en los focus
                        self.ui[name] = new qxnw.widgets.normalTextField();
//                        self.ui[name].setFilter(/[^\'\\{}|]/g);
//                        self.ui[name] = new qxnw.widgets.textField();
//                        self.ui[name].setUserData("key", name);
//                        self.ui[name].setMode("search", self.getAppWidgetName());
                        break;
                    case "selectBox":
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
                        self.ui[name].setUserData("name", name);
                        self.ui[name].getValue = function () {
                            var data = {};
                            if (!this.isSelectionEmpty()) {
                                var selectModel = this.getSelection()[0].getModel();
                                var selectText = this.getSelection()[0].getLabel();
                                data[this.getUserData("name")] = selectModel;
                                data[this.getUserData("name") + "_text"] = selectText;
                            } else {
                                return "";
                            }
                            return data;
                        };
                        self.ui[name].set({
                            minHeight: 25,
                            maxHeight: 35
                        });
                        break;
                    case "dateField":
                        self.ui[name] = new qxnw.widgets.dateField();
                        break;
                    case "dateTimeField":
                        self.ui[name] = new qxnw.widgets.dateTimeField();
                        self.ui[name].setDateFormat(new qx.util.format.DateFormat("yyyy-MM-dd"));
                        break;
                    case "selectListCheck":
                        self.ui[name] = new qxnw.widgets.selectListCheck();
                        self.ui[name].setUniqueName(self.getAppWidgetName() + name + type + label);
                        self.ui[name].setSelectionMode('single');
                        self.ui[name].set({
                            minHeight: 25
                        });
                        break;
                }

                self.ui[name].setUserData("name", name);
                self.ui[name].setUserData("type", type);

                if (name === "fecha_inicial" || name === "fecha_inicio" || name === "fecha") {
                    isDateWidgetStart = true;
                } else if (name === "fecha_final" || name === "fecha_fin") {
                    isDateWidgetEnd = true;
                }

                self.type[name] = type;
                if (type != "selectTokenField") {
                    if (type != "button") {
                        if (type != "selectBox") {
                            self.ui[name].setAllowGrowY(false);
                            self.ui[name].addListener("keypress", function (e) {
                                if (e._identifier == "Enter") {
                                    self.ui["searchButton"].focus();
                                    try {
                                        self.ui["searchButton"].focus();
                                    } catch (e) {
                                        qxnw.utils.nwconsole(e);
                                    }
                                } else {
                                    if (this.getUserData("type") != "selectBox") {
                                        self.checkRequiredFilters(e._identifier, this.getUserData("name"));
                                    }
                                }
                            });
                        }
                    }
                }
                if (type == "textField" || type == "textArea") {
                    self.ui[name].setPlaceholder(label);
                }

                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                    padding: qxnw.config.getPaddingTreeWidget()
                });
                self.containerFieldsArray[name] = container;
                var asterisk = "";
                if (required === true) {
                    asterisk = "<b style='color:red'>*</b>";
                    var index = self.__filtersRequireds.findIndex(function (object) {
                        object.name === filters[i].name;
                    });
                    if (index === -1) {
                        self.__filtersRequireds.push(filters[i]);
                    }
                }
                if (typeof toolTip != 'undefined' && typeof toolTip != null) {
                    if (label != "null") {
                        label.replace("_", " ") + asterisk;
                    } else {
                        label = "null";
                    }
                    self.labelForm[name] = new qx.ui.basic.Atom(label.replace("_", " ") + asterisk, qxnw.config.execIcon("dialog-information.png", "status")).set({
                        rich: true
                    });
                    self.labelForm[name].setValue = function (text) {
                        this.setLabel(text);
                    };
                    self.labelForm[name].setGap(-3);
                    self.labelForm[name].setIconPosition("right");
                    var tT = new qx.ui.tooltip.ToolTip(toolTip, qxnw.config.execIcon("help-faq"));
                    self.labelForm[name].setToolTip(tT);
                } else {
                    if (typeof label == 'undefined' || label == null) {
                        label = "";
                    }
                    label = label.toString().replace("_", " ") + asterisk;
                    self.labelForm[name] = new qx.ui.basic.Label(label).set({
                        rich: true
                    });
                }
                if (required) {
                    self.labelForm[name].setUserData("required", required);
                }
                if (type !== 'button') {
                    container.add(self.labelForm[name], {
                        flex: 1
                    });
                }
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
                if (visible == false) {
                    self.setFieldVisibility(self.ui[name], "excluded");
                } else {
                    var ti = qxnw.config.getActualTabIndex();
                    self.ui[name].setTabIndex(ti);
                    self.count++;
                }
            }

            if (isDateWidgetStart && isDateWidgetEnd) {
                isDateWidgetStart = false;
                isDateWidgetEnd = false;
                self.containerDateTool = new qxnw.widgets.dateWidgetContainer(new qx.ui.layout.VBox(), self).set({
                    padding: 2
                });
            }

            self.createButtonSearch(qxnw.config.getActualTabIndex());

            var canUpdate = false;
            if (typeof self.applyFilters != 'undefined') {
                canUpdate = true;
            } else if (typeof self.populateTree != 'undefined') {
                canUpdate = true;
            }
            if (canUpdate) {
                self.ui.autoUpdate = new qx.ui.form.CheckBox(self.tr("Actualizar")).set({
                    alignX: "center",
                    alignY: "top"
                });
                self.containerFilters.addAt(self.ui.autoUpdate, 20);
                var isSelected = qxnw.local.getData("nw_tree_autoupdate");
                if (typeof isSelected != 'undefined' && isSelected != null && isSelected == true) {
                    self.ui.autoUpdate.setValue(isSelected);
                    self.addListener("appear", function () {
                        try {
                            if (typeof self.applyFilters != 'undefined') {
                                self.applyFilters();
                            } else if (typeof self.populateTree != 'undefined') {
                                self.populateTree();
                            } else {
                                self.ui.autoUpdate.setVisibility("excluded");
                            }
                        } catch (e) {

                        }
                    });
                }
                self.ui.autoUpdate.addListener("changeValue", function () {
                    var v = this.getValue();
                    qxnw.local.setData("nw_tree_autoupdate", v);
                    if (v === true) {
                        if (typeof self.applyFilters != 'undefined') {
                            self.applyFilters();
                        } else if (typeof self.populateTree != 'undefined') {
                            self.populateTree();
                        }
                    }
                });
            }
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
        },
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
                    case "selectTokenField":
                        var arr = self.ui[name].getData();
                        if (arr == null) {
                            r[name] = null;
                            r[name + "_array"] = null;
                            r[name + "_text"] = null;
                            r[name + "_array_all"] = [];
                        } else if (typeof arr[0] == 'undefined') {
                            r[name] = null;
                            r[name + "_array"] = null;
                            r[name + "_text"] = null;
                            r[name + "_array_all"] = typeof arr == 'undefined' ? [] : arr;
                        } else {
                            r[name] = arr[0]["id"];
                            r[name + "_array"] = arr[0];
                            r[name + "_text"] = arr[0]["nombre"];
                            r[name + "_array_all"] = typeof arr == 'undefined' ? [] : arr;
                        }
                        break;
                    case "selectListCheck":
                        var d = [];
                        var childs = self.ui[name]._getChildren();
                        for (var ia = 0; ia < childs.length; ia++) {
                            var ra = null;
                            if (typeof childs[ia] != 'undefined') {
                                if (childs[ia].getAppearance() == 'tokenitem') {
                                    ra = childs[ia].getUserData("model");
                                    if (ra != null) {
                                        d.push(ra);
                                    }
                                }
                            }
                        }
                        r[name] = d;
                        break;
                    case "textField":
                        r[name] = self.ui[name].getValue();
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
            r["count"] = self.ui["maxRowsField"].getValue();
            r["page"] = self.ui["page"].getValue();
            //r["sort"] = self.ui["order_by"].getValue();
            //r["export"] = self.__exportDataVar;
            r["part"] = self.getAppWidgetName();
            r["sorted"] = "";
            r["sorted_name"] = "";
            r["sorted_method"] = "";
            return r;
        },
        closeAllSubWindows: function closeAllSubWindows() {
            var self = this;
            if (self.tabWidget != null) {
                var pages = self.tabView.getChildren();
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].classname == "qx.ui.tabview.Page") {
                        self.tabView.remove(pages[i]);
                        i--;
                    }
                }
            }
        },
        closeSubWindow: function closeSubWindow(page) {
            if (this.tabView != null) {
                this.tabView.remove(page);
            }
        },
        selectPage: function selectPage(page) {
            var self = this;
            if (self.tabView != null) {
                try {
                    self.tabView.setSelection([page]);
                } catch (e) {
                    qxnw.utils.error(e);
                }
            }
        },
        getNumSubWindows: function getNumSubWindows() {
            if (this.tabView == null) {
                return 0;
            }
            var rta = this.tabView.getChildren();
            return rta.length;
        },
        addSubWindow: function addSubWindow(title, widget, showClose, callback, iconClose) {
            var self = this;
            try {

                var page = new qx.ui.tabview.Page(title);
                page.getChildControl("button").addListener("dblclick", function (e) {
                    if (typeof callback != 'undefined') {
                        if (callback != null) {
                            callback(e);
                        }
                    }
                });

                page.addListener("close", function () {
                    var children = this.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].classname == "qx.ui.container.Scroll") {
                            var childScroll = children[i].getChildren();
                            for (var ia = 0; ia < childScroll.length; ia++) {
                                if (childScroll[ia].classname == "qx.ui.window.Desktop") {
                                    var childDesktop = childScroll[ia].getChildren();
                                    for (var ib = 0; ib < childDesktop.length; ib++) {
                                        try {
                                            childDesktop[ib].destroy();
                                        } catch (e) {

                                        }
                                        break;
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }
                });

                if (typeof showClose != 'undefined' && showClose != null) {
                    page.set({
                        showCloseButton: showClose
                    });
                }

                if (typeof iconClose != 'undefined') {
                    if (iconClose != null) {
                        var tabButton = page.getChildControl("button");
                        var iconPageClose = tabButton.getChildControl("close-button");
                        iconPageClose.setIcon(iconClose);
                    }
                }

                page.setLayout(new qx.ui.layout.Grow());
                self.tabView.add(page);
                var scrollContainer = new qx.ui.container.Scroll();
                var desktop = new qx.ui.window.Desktop();
                desktop.set({
                    decorator: "main",
                    backgroundColor: "black"
                });

                scrollContainer.add(desktop);

                page.setUserData("nw_treewidget_desktop", desktop);
                page.setUserData("nw_treewidget_scroll", scrollContainer);
                self.pageTabView.push(page);
                page.getChildControl("button").setPadding(1);
                page.setPadding(2);
                page.add(scrollContainer);
                try {
                    var type = widget.getQxnwType();

                    switch (type) {
                        case "qxnw_list":
                            widget.removeListenerById(widget.getListenerIdAppear());
                            widget.removeListenerById(widget.getMoveListenerId());
                            widget.removeListenerById(widget.getListenerIdResize());
                            widget.set({
                                showClose: false,
                                showMinimize: false,
                                showMaximize: false
                            });
                            widget.setResizable(false);
                            widget.getChildControl("captionbar").setVisibility("excluded");
                            break;
                        case "qxnw_form":
                            widget.removeListenerById(widget.getListenerIdAppear());
                            widget.removeListenerById(widget.getListenerIdMove());
                            widget.removeListenerById(widget.getListenerIdResize());
                            widget.setIsInsideTree(true);
                            widget.set({
                                showClose: false,
                                showMinimize: false,
                                showMaximize: false
                            });
                            widget.setResizable(false);
                            widget.getChildControl("captionbar").setVisibility("excluded");
                            break;
                        case "qxnw_maps_widget":
                            widget.removeListenerById(widget.getListenerIdAppear());
                            widget.removeListenerById(widget.getListenerIdMove());
                            widget.removeListenerById(widget.getListenerIdResize());
                            widget.set({
                                showClose: false,
                                showMinimize: false,
                                showMaximize: false
                            });
                            widget.setResizable(false);
                            widget.getChildControl("captionbar").setVisibility("excluded");
                            break;
                    }
                } catch (e) {
                }
                widget.open();
                try {
                    widget.maximize();
                } catch (e) {

                }
                desktop.add(widget, {
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0
                });
                try {
                    self.tabView.setSelection([page]);
                } catch (e) {
                    qxnw.utils.nwconsole(e);
                }
                self.insertedNavTables.push(widget);

            } catch (e) {
                qxnw.utils.error(e);
            }

            return page;
        },
        showTabView: function showTabView(index) {
            var self = this;
            var page = this.pageTabView[index];
            var indexOfTab = self.tabView.indexOf(page);
            if (indexOfTab != -1) {
                self.tabView.setSelection([page]);
            }
            return false;
        },
        updateAll: function updateAll() {
            var self = this;
            self.populateTree();
        },
        cleanTree: function cleanTree() {
            if (this.tree == null) {
                return;
            }
            if (this.ui !== null && this.ui["texfield_auto_filter"] != null) {
                try {
                    this.ui["texfield_auto_filter"].setValue("");
                } catch (e) {

                }
            }
            this.toSearch("", true);
            this.tree.resetRoot();
            var children = this.tree.getItems(true);
            for (var i = 0; i < children.length; i++) {
                children[i].removeAll();
                children[i].dispose();
            }
            //this.__root = null;
        },
        createTree: function createTree() {
            var self = this;
            self.tree = null;
            var tree = new qx.ui.tree.Tree().set({
                focusable: false
            });
            self.tree = tree;

            self.tree.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "tree_folder_container");
            });
            self.tree.addListener("click", function (e) {
                var target = e.getTarget();
                if (target.classname == "qx.ui.tree.core.FolderOpenButton") {
                    return;
                }
                if (target.classname == "qx.ui.tree.TreeFolder" || target.classname == "qx.ui.tree.TreeFile") {
                    try {
                        var children = this.getItems();
                        for (var i = 0; i < children.length; i++) {
                            if (target != children[i]) {
                                children[i].removeState("selected");
                            }
                        }
                    } catch (e) {

                    }
                }
            });
            self.tree.addListener("contextmenu", function (e) {
                try {
                    var target = e.getTarget();
                    if (target.classname == "qx.ui.tree.TreeFile" || target.classname == "qx.ui.tree.TreeFolder") {
                        var children = this.getItems();
                        for (var i = 0; i < children.length; i++) {
                            children[i].removeState("selected");
                        }
                        this.setSelection([target]);
                        target.addState("selected");
                    } else {
                        e.stop();
                        e.preventDefault();
                        return;
                    }
                } catch (e) {

                }
                self.contextMenu(e);
            });

            self.tree.addListener("beforeContextmenuOpen", function () {
                self.tree.resetContextMenu();
                self.tree.setContextMenu(null);
            });

            return tree;
        }
    }
});