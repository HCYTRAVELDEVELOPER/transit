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
 * Manage a special way to create all forms in your application
 */
qx.Class.define("qxnw.forms", {
    extend: qx.ui.window.Window,
    construct: function construct(name, orientation) {
        this.base(arguments);
        var self = this;
        if (typeof orientation == 'undefined' || orientation == null) {
            orientation = "vertical";
        }
        if (typeof name != 'undefined' && name != null) {
            name = name.toString().replace(/ /g, "_");
            self.setUserData("form", name);
        }
        self.populateConfig();
        self.setAlwaysOnTop(true);
        self.addListener("minimize", function (e) {
            if (self.getAddToMainOnMinimize()) {
                main.addMinimizedWindow(self);
            }
        });
        self.set({
            contentPadding: 2
        });
        self.addListener("click", function (e) {
            try {
                var target = e.getTarget();
                if (target == null) {
                    return;
                }
                var ud = target.getUserData("nw_name_focus_form");
                if (ud == "dateTimeField") {
                    return;
                }
                for (var i = 0; i < self.__haveDateTimeField.length; i++) {
                    var name = self.__haveDateTimeField[i];
                    var isListOpen = self.ui[name].getChildControl("popup").isVisible();
                    if (isListOpen) {
                        self.ui[name].close();
                    }
                }
            } catch (e) {
                qxnw.utils.hiddenError(e);
            }
        });
        self.saveMove = qxnw.config.getSavePositionForm();
        var listenerMove = self.addListener("move", function (e) {
            if (self.saveMove == true) {
                self.storePosition(e.getData());
            }
        });
        self.setListenerIdMove(listenerMove);
        var listenerResize = self.addListener("resize", function (e) {
            if (self.__isShow) {
                if (typeof e.getData == 'undefined') {
                    var v = {};
                    var bounds = self.getBounds();
                    v.width = bounds.width;
                    v.height = bounds.height;
                    self.storeSize(v);
                } else {
                    self.storeSize(e.getData());
                }
            }
            if (self.__containerMain != null) {
                if (self.__isHandled) {
                    if (self.__isShow) {
                        if (self.__isPosicioned) {
                            self.__containerMain.resetMaxHeight();
                            self.__containerMain.resetMinHeight();
                        }
                    }
                }
            }
            self.__isMovedBySplitter = false;
        });
        self.setListenerIdResize(listenerResize);
        var listenerAppear = self.addListener("appear", function (e) {
            self.setStoredPosition();
            self.setStoredSize();
            if (self.saveMove == true) {
                self.__isShow = true;
            } else {
                self.__isShow = false;
            }
            self.handleFocus();

            try {
//                console.log(self.getChildControl("maximize-button").getContentElement().getDomElement());
//                console.log(self.getChildControl("minimize-button").getContentElement().getDomElement());
//                console.log(self.getChildControl("close-button").getContentElement().getDomElement());
//                qx.bom.element.Class.add(self.getChildControl("maximize-button").getContentElement().getDomElement(), "nw_maximize_button");
//                qx.bom.element.Class.add(self.getChildControl("minimize-button").getContentElement().getDomElement(), "nw_minimize_button");
//                qx.bom.element.Class.add(self.getChildControl("close-button").getContentElement().getDomElement(), "nw_close_button");
            } catch (e) {
//            qx.bom.element.Class.add(self.getChildControl("maximize-button").getContentElement().getDomElement(), "nw_maximize_button");
//            qx.bom.element.Class.add(self.getChildControl("minimize-button").getContentElement().getDomElement(), "nw_minimize_button");
//            qx.bom.element.Class.add(self.getChildControl("close-button").getContentElement().getDomElement(), "nw_close_button");
            }
        });
        self.setListenerIdAppear(listenerAppear);
        var listenerIdClose = self.addListener("close", function (e) {
            self.cleanAll();
        });

        self.setListenerIdClose(listenerIdClose);

        if (self.__isCreatedBase) {
            return;
        }

        self.addListener("beforeClose", function (e) {
            if (self.getAskOnClose() === true) {
                e.preventDefault();
                qxnw.utils.question(self.tr("¿Está segur@ de cerrar la ventana?"), function (ea) {
                    if (ea) {
                        self.setAskOnClose(false);
                        self.reject();
                    }
                });
            }
        });

        self.setRpcUrl();
        self.settings = {};
        self.ui = {};
        if (!self.__isCentered) {
            self.center;
        }
        self.count = 0;
        self.baseLayout = new qx.ui.layout.VBox();
        self.setLayout(this.baseLayout);
        //TODO: EN TEST
        self.addListener("changeModal", function (e) {
            try {
                if (e.getData()) {
                    qx.core.Init.getApplication().getRoot().setBlockerColor("black");
                    qx.core.Init.getApplication().getRoot().setBlockerOpacity(0.2);
                } else {
                    qx.core.Init.getApplication().getRoot().resetBlockerColor();
                    qx.core.Init.getApplication().getRoot().resetBlockerOpacity();
                    qx.core.Init.getApplication().getRoot().forceUnblock();
                }
            } catch (e) {
                console.log(e);
            }
        });
        self.scrollContainer = new qx.ui.container.Scroll().set({
            height: null,
            width: null
        });
        self.masterContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());

        self.scrollContainer.add(self.masterContainer);
        self.add(self.scrollContainer, {
            flex: 1
        });
        self.createButtons();
        self.__isCreatedBase = true;
        self.__fields = [];
        self.__permissions = [];
        self.processFired = [];
        self.__containersUser = [];
        self.__col = 0;
        self.__row = 0;
        self.__updateId = 1;
        self.__cleanFrame = false;
        self.labelForm = {};
        self.labelUi = {};
        self.navTables = {};
        self.__groupsAll = {};
        self.haveNavTables = false;
        self.navTables = [];
        self.embedNavTables = [];
        self.up = qxnw.userPolicies.getUserData();
        self.isRealMaximized = "setted";
        self.__arraySelectBoxSuspended = [];
        self.__haveDateTimeField = [];
        self.pageTabView = [];
        self.__tabViewsLibrary = [];
        self.__areCreatedDeffectButtons = false;
        self.__areCreatedOtherWidgets = false;
        self.__cleanFrame = null;
        //prevenir que con el borrado vuelva a otra página sobre los widgets
        self.addListener("keypress", function (e) {
            var key = e.getKeyIdentifier();
            var target = e.getTarget();
            if (key == "Backspace") { // 8 == backspace
                if (self.__enableBackspaceCK == true) {
                    self.__enableBackspaceCK = false;
                    return;
                }
                if (qxnw.config.checkBackspaceClass(target.classname, self) === true) {
                    e.preventDefault();
                }
            }
            return;
        });

        qx.ui.core.FocusHandler.getInstance().addRoot(self);

        self.addListener("appear", function () {
            self.handleTabIndex();
        });

        self.__addedButtons = [];
        self.__countPopups = [];
        self.__countPopupsWords = [];
        self.insertedNavTables = [];
        self.containerFieldsArray = [];

        qxnw.utils.addClass(self, "qx_window_form");

        //qx.bom.History.getInstance().addToHistory(self.classname, self.getTitle());
    },
    destruct: function destruct() {

        try {

            if (qxnw.utils.isDebug()) {
                if (qxnw.config.getShowDestroyObjects() == true) {
                    console.log("%c<<<< Destroy FORM >>>>", 'background: #53674F; color: #bada55');
                    console.log("Form name: ", this.getAppWidgetName());
                    console.log("Class: ", this.classname);
                    console.log("%c<<<< END >>>>", 'background: #53674F; color: #bada55');
                }
            }

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

            this.destroy();

            this._disposeMap("this.__containersUser");

            this._disposeObjects("this.__manager");
            this._disposeObjects("this.containerDateTool");
            this._disposeObjects("this.baseLayout");
            this._disposeObjects("this.__containerMain");
            this._disposeObjects("this.navTableContainer");
            this._disposeObjects("floatContainer");
            this._disposeObjects("splitter");

            this._disposeObjects("this.gridLayout");
            this._disposeObjects("this.__tabIndex");
            this._disposeObjects("this.__containerMain");
            this._disposeObjects("form");
            this._disposeObjects("this.__fields");
            this._disposeObjects("this.__permissions");
            if (this.buttonsContainer !== null) {
                this._disposeObjects("buttonsContainer");
            }
            this._disposeObjects("__htmlEmbed");
            this._disposeObjects("this.labelUi");
            this._disposeObjects("this.labelForm");

            this._disposeObjects("this.ui.printButton");
            this._disposeObjects("this.ui.accept");
            this._disposeObjects("this.ui.cancel");

            this._disposeObjects("this.ui");
            this._disposeObjects("this.__countPopups");
            this._disposeObjects("this.__countPopupsWords");
            this._disposeObjects("this.__tabView");
            this._disposeObjects("this.__tabViewsLibrary");

            if (typeof this.ui != 'undefined') {
                if (this.ui != null) {
                    for (var i = 0; i < this.ui.length; i++) {
                        this._disposeObjects(this.fields[i]);
                    }
                }
            }
            this._disposeObjects("this.ui");
            this.dispose();
        } catch (e) {
            if (qxnw.utils.isDebug()) {
                console.log("ERROR DISPOSING: ", e);
            }
            this.dispose();
        }
    },
    events: {
        "accept": "qx.event.type.Event",
        "reject": "qx.event.type.Event",
        "loaded": "qx.event.type.Event",
        "modified": "qx.event.type.Data",
        "NWChangeFieldVisibility": "qx.event.type.Event",
        "NWClickTabView": "qx.event.type.Data"
    },
    properties: {
        createHelpButton: {
            init: true,
            check: "Boolean"
        },
        cleanSpecialWords: {
            init: true,
            check: "Boolean"
        },
        canPrint: {
            init: false,
            check: "Boolean"
        },
        cleanHTML: {
            init: true,
            check: "Boolean"
        },
        isInsideTree: {
            init: false,
            check: "Boolean"
        },
        askOnClose: {
            init: false,
            //apply: "_setAskOnClose"
            check: "Boolean"
        },
        handleCountryPermissons: {
            init: true,
            check: "Boolean"
        },
        handleTerminalPermissons: {
            init: true,
            check: "Boolean"
        },
        addToMainOnMinimize: {
            init: true,
            check: "Boolean"
        },
        allPermissions: {
            init: null,
            check: "Boolean"
        },
        params: {
            init: "",
            check: "String"
        },
        appName: {
            init: false,
            apply: "_applyAppName"
        },
        numberFormat: {
            check: "qx.util.format.NumberFormat",
            nullable: true
        },
        widget: {
            check: "qx.ui.container.Composite"
        },
        qxnwType: {
            init: "qxnw_form"
        },
        name: {
            init: null
        },
        listenerIdClose: {
            init: 0
        },
        listenerIdAppear: {
            init: 0
        },
        beforeCloseListenerId: {
            init: 0
        },
        listenerIdMove: {
            init: 0
        },
        listenerIdResize: {
            init: 0
        },
        invalidateStore: {
            init: false,
            check: "Boolean",
            apply: "__invalidateStore"
        },
        columnsFormNumber: {
            init: 1,
            check: "Integer"
        },
        frameUrl: {
            init: null,
            check: "String"
        }
    },
    members: {
        containerFieldsArray: null,
        containerDateTool: null,
        self: null,
        up: null,
        labelForm: null,
        __rowCount: 0,
        isRealMaximized: false,
        __isMovedBySplitter: false,
        __cleanFrame: null,
        splitter: null,
        __fields: null,
        __isCreatedMainForm: false,
        __containerMain: null,
        __areCreatedOtherWidgets: false,
        __areCreatedFooterBar: false,
        __areCreatedDeffectButtons: false,
        gridLayout: null,
        __manager: false,
        ui: null,
        __frame: null,
        count: null,
        groupHeader: null,
        buttonAccept: null,
        buttonCancel: null,
        settings: null,
        rpcUrl: null,
        m_pr: null,
        tableAuto: null,
        __tableMethod: null,
        tableExec: null,
        e: null,
        pr: null,
        __isCreatedBase: false,
        __serialField: null,
        __func: null,
        __columnForTotal: null,
        __permissions: null,
        __isMovedPosition: false,
        __isMovedSize: false,
        __executedCount: 0,
        __isCentered: true,
        __effect: null,
        __tabView: null,
        __title: null,
        __isPosicioned: false,
        navTableContainer: null,
        areCreatedButtons: false,
        isCreatedTabView: false,
        __isShow: false,
        __footerBar: null,
        __footerNote: null,
        __tabIndex: 1,
        buttonsContainer: null,
        __htmlEmbed: null,
        processFired: null,
        __isHandled: false,
        __isCreatedToolBar: false,
        __group: null,
        isAddedGroup: false,
        __areCreatedHeaderBar: false,
        __headerBar: null,
        __headerNote: null,
        __updateId: null,
        __labelReplace: null,
        __groupsAll: null,
        navTables: null,
        haveNavTables: false,
        embedNavTables: null,
        saveMove: true,
        __generateSequence: false,
        __arraySelectBoxSuspended: null,
        __haveDateTimeField: null,
        __tabViewsLibrary: null,
        pageTabView: null,
        closeTimeOut: 0,
        __oldData: null,
        printerPropertiesButton: null,
        helpButton: null,
        useOtherDB: null,
        showCronometer: false,
        cronometer: null,
        __addedButtons: null,
        __enableBackspaceCK: false,
        __countPopups: null,
        __countPopupsWords: null,
        insertedNavTables: null,
        __putFieldsIntoFormTag: null,
        getLocale: function getLocale() {
            var locale = qxnw.local.getOpenData("locale");
            return locale;
        },
        _applyAppName: function _applyAppName(name) {
            this.setUserData("form", name);
        },
        sendNextTab: function sendNextTab(w) {
            var self = this;
            try {
                var zi = w.getTabIndex();
                var fields = this.__fields;
                for (var i = 0; i < fields.length; i++) {
                    if (typeof self.ui[fields[i].name] != 'undefined') {
                        if (typeof self.ui[fields[i].name].getTabIndex != 'undefined') {
                            var z = self.ui[fields[i].name].getTabIndex();
                            if (z > zi) {
                                self.ui[fields[i].name].focus();
                                break;
                            }
                        }
                    }
                }
            } catch (e) {
                qxnw.utils.nwconsole(e);
            }
        },
        setEnableBackspaceCK: function setEnableBackspaceCK(e) {
            this.__enableBackspaceCK = e;
        },
        startCronometer: function startCronometer() {
            this.cronometer = new qxnw.forms.cronometer(24);
            this.cronometer.start();
            this.add(this.cronometer.masterContainer);
        },
        handleTabIndex: function handleTabIndex() {
            var self = this;
            if (self.__containerMain == null) {
                return;
            }
            if (typeof self.ui["printButton"] != 'undefined') {
                if (self.ui["printButton"] != null) {
//                    self.ui["printButton"].setTabIndex(qxnw.config.getActualTabIndex());
                }
            }
            if (typeof self.ui["accept"] != 'undefined') {
                if (self.ui["accept"] != null) {
                    self.ui["accept"].setTabIndex(qxnw.config.getActualTabIndex());
                }
            }
            if (typeof self.ui["cancel"] != 'undefined') {
                if (self.ui["cancel"] != null) {
                    self.ui["cancel"].setTabIndex(qxnw.config.getActualTabIndex());
                }
            }
            for (var i = 0; i < self.__addedButtons.length; i++) {
                try {
                    self.ui[self.__addedButtons[i].name].setTabIndex(qxnw.config.getActualTabIndex());
                } catch (e) {

                }
            }
        },
        setOtherDB: function setOtherDB(useOtherDB) {
            this.useOtherDB = useOtherDB;
        },
        getOtherDB: function getOtherDB() {
            return this.useOtherDB;
        },
        addBeforeGroup: function addBeforeGroup(nameGroup, widget) {
            this.__groupsAll[nameGroup].add(widget, {
                flex: 1
            });
            var minHeight = 300;

            try {
                if (typeof widget.getQxnwType !== 'undefined') {
                    var type = widget.getQxnwType();
                    switch (type) {
                        case "qxnw_navtable":
                            widget.set({
                                minHeight: minHeight
                            });
                            if (typeof widget.setResizable != 'undefined') {
                                widget.setResizable(false);
                            }
                            break;
                        case "qxnw_list_master_container":
                            break;
                        case "qxnw_list":
                            widget.removeListenerById(widget.getListenerIdAppear());
                            widget.removeListenerById(widget.getMoveListenerId());
                            widget.removeListenerById(widget.getListenerIdResize());
                            widget.set({
                                showClose: false,
                                showMinimize: false,
                                showMaximize: false,
                                minHeight: minHeight
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
                                showMaximize: false,
                                minHeight: minHeight
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
                                showMaximize: false,
                                minHeight: minHeight
                            });
                            widget.setResizable(false);
                            widget.getChildControl("captionbar").setVisibility("excluded");
                            break;
                    }
                }
            } catch (e) {
                console.log(e);
            }
        },
        getGroup: function getGroup(nameGroup) {
            return this.__groupsAll[nameGroup];
        },
        getGroups: function getGroups() {
            return this.__groupsAll;
        },
        setGroupLayout: function setGroupLayout(nameGroup, type) {
            if (type == "horizontal") {
                this.__groupsAll[nameGroup].setLayout(new qx.ui.layout.HBox().set({
                    spacing: 5
                }));
            } else if (type == "vertical") {
                this.__groupsAll[nameGroup].setLayout(new qx.ui.layout.VBox().set({
                    spacing: 5
                }));
            }
        },
        /*
         * 
         * Función para cambiar la imagen de fondo de los formularios
         * 
         * @param String {img} La imagen a agregar
         * @returns {undefined}  
         * */
        setBackgroundImage: function setBackgroundImage(img, type, repeat) {
            var content = this.getChildrenContainer().getContentElement();
            content.setStyle("background-image", "url(" + img + ")");
            if (typeof repeat == 'undefined') {
                repeat = "no-repeat";
            }
            if (repeat != "") {
                content.setStyle("background-repeat", repeat);
            }
            if (typeof type == 'undefined') {
                type = "cover";
            }
            if (type != "") {
                content.setStyle("background-size", type);
            }
        },
        printerProperties: function printerProperties(html) {
            var self = this;
            var f = new qxnw.nw_printer.forms.f_printer_properties(html);
            f.show();
        },
        _setAskOnClose: function _setAskOnClose(value, old) {
            var self = this;
            try {
                if (value === true) {
                    var listenerBeforeClose = self.getBeforeCloseListenerId();
                    if (listenerBeforeClose != null && typeof listenerBeforeClose == "integer") {
                        self.removeListenerById(listenerBeforeClose);
                    }
                    listenerBeforeClose = self.addListener("beforeClose", function (e) {
                        e.preventDefault();
                        qxnw.utils.question(self.tr("¿Está segur@ de cerrar la ventana?"), function (ea) {
                            if (ea) {
                                var internalListenerId = self.getBeforeCloseListenerId();
                                if (internalListenerId != null && typeof internalListenerId == "integer") {
                                    self.removeListenerById(internalListenerId);
                                }
                                self.reject();
                            }
                        });
                    });
                    self.setBeforeCloseListenerId(listenerBeforeClose);
                } else {
                    var listenerBeforeClose = self.getBeforeCloseListenerId();
                    if (typeof listenerBeforeClose != 'undefined' && listenerBeforeClose != null && listenerBeforeClose != 0) {
                        self.removeListenerById(listenerBeforeClose);
                    }
                }
            } catch (e) {

            }
        },
        /**
         * Función para limpiar un formulario
         * @param removeListeners {Boolean} si se deben remover los listeners o no al limpiar
         * @returns {void} 
         */
        clean: function clean(removeListeners) {
            var self = this;
            var fields = this.__fields;
            if (removeListeners === true) {
                try {
                    if (fields[i].type != "startGroup") {
                        if (fields[i].type != "endGroup") {
                            self.ui[fields[i].name].removeListener("keypress", function () {});
                            self.ui[fields[i].name].removeListener("keyinput", function () {});
                            self.ui[fields[i].name].removeListener("changeSelection", function () {});
                        }
                    }
                } catch (e) {

                }
            }
            for (var i = 0; i < fields.length; i++) {
                switch (fields[i].type) {
                    case "selectListCheck":
                        self.ui[fields[i].name].unCheckAllListItem();
                        self.ui[fields[i].name].deselectAllItems();
                        self.ui[fields[i].name].setValue("");
                        break;
                    case "selectTokenField":
                        self.ui[fields[i].name].cleanAll();
                        self.ui[fields[i].name].setValue("");
                        break;
                    case "spinner":
                        self.ui[fields[i].name].setValue(0);
                        break;
                    case "checkBox":
                        self.ui[fields[i].name].setValue(false);
                        break;
                    case "signer":
                        self.ui[fields[i].name].clean();
                        break;
                    case "canvasWriter":
                        self.ui[fields[i].name].clean();
                        break;
                    case "listCheck":
                        self.ui[fields[i].name].cleanAndRestoreItems();
                        break;
                    case "tokenField":
                        self.ui[fields[i].name].reset();
                        break;
                    case "selectBox":
                        self.ui[fields[i].name].resetSelection();
                        break;
                    case "camera":
                        self.ui[fields[i].name].clean();
                        break;
                    case "uploader":
                        self.ui[fields[i].name].clean();
                        break;
                    case "timeField":
                        self.ui[fields[i].name].clean();
                        break;
                    case "dateTimeField":
                        self.ui[fields[i].name].clean();
                        break;
                    case "ocrReader":
                        self.ui[fields[i].name].clean();
                        break;
                    case "startGroup":
                        break;
                    case "label":
                        break;
                    case "endGroup":
                        break;
                    case "button":
                        break;
                    default:
                        try {
                            self.ui[fields[i].name].setValue("");
                        } catch (e) {

                        }
                        break;
                }
            }
        },
        cleanFormlib: function cleanFormlib(posicion) {
            var self = this;
            var fields = this.__fields;
            for (var i = 0; i < fields.length; i++) {
                if (i > posicion) {
                    switch (fields[i].type) {
                        case "selectListCheck":
                            self.ui[fields[i].name].unCheckAllListItem();
                            self.ui[fields[i].name].deselectAllItems();
                            self.ui[fields[i].name].setValue("");
                            break;
                        case "selectTokenField":
                            self.ui[fields[i].name].cleanAll();
                            self.ui[fields[i].name].setValue("");
                            break;
                        case "textField":
                            self.ui[fields[i].name].setValue("");
                            break;
                        case "textArea":
                            self.ui[fields[i].name].setValue("");
                            break;
                        case "checkBox":
                            self.ui[fields[i].name].setValue(false);
                            break;
                        case "spinner":
                            self.ui[fields[i].name].setValue(0);
                            break;
                        case "signer":
                            self.ui[fields[i].name].clean();
                            break;
                        case "listCheck":
                            self.ui[fields[i].name].cleanAndRestoreItems();
                            break;
                        case "tokenField":
                            self.ui[fields[i].name].reset();
                            break;
                        case "selectBox":
                            self.ui[fields[i].name].resetSelection();
                            break;
                        case "startGroup":
                            break;
                        case "endGroup":
                            break;
                        case "uploader":
                            self.ui[fields[i].name].clean();
                            break;
                        case "label":
                            break;
                        case "button":
                            break;
                        default:
                            try {
                                self.ui[fields[i].name].setValue("");
                            } catch (e) {

                            }
                            break;
                    }
                }
            }
        },
        /**
         * ES: Función usada para llenar rápidamente un selectTokenField
         * 
         * EN: Function used to full fast a selectTokenField
         * 
         * @param field {object} el campo (como objeto)
         * @param e {Event} el evento
         * @param table {string} la tabla
         * @returns {undefined}
         */
        setModelDataField: function setModelDataField(field, e, table) {
            var self = this;
            var data = {};
            data["token"] = e.getData();
            data["table"] = table;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                field.setModelData(r);
            };
            rpc.exec("populateToken", data, func);
        },
        populateSelectFromArray: function populateSelectFromArray(name, array, defaultValue) {
            qxnw.utils.populateSelectFromArray(this.ui[name], array, defaultValue);
        },
        populateSelectAsync: function populateSelectAsync(name, method, exec, data, options, defaultValue) {
            if (method == null || method == 0) {
                method = "master";
            }
            if (exec == null || exec == 0) {
                exec = "populate";
            }
            if (typeof data == "string") {
                data = {table: data};
            }
            qxnw.utils.populateSelectAsync(this.ui[name], method, exec, data, options, defaultValue);
        },
        /**
         * ES: Opción rápida para llenar un selectBox
         * 
         * EN: Fast option to fill a selectBox
         * 
         * @param name {object} el objeto selectBox 
         * @param method {String} la clase PHP
         * @param exec {String} la función de PHP
         * @param data {Array} el array con la data como parámetro
         * @param options {Map} el mapa o array con las opciones  
         * @param defaultValue {Integer} el id como default 
         * @returns {void}
         */
        populateSelect: function populateSelect(name, method, exec, data, options, defaultValue) {
            if (method == null || method == 0) {
                method = "master";
            }
            if (exec == null || exec == 0) {
                exec = "populate";
            }
            if (typeof data == "string") {
                data = {table: data};
            }
            qxnw.utils.populateSelect(this.ui[name], method, exec, data, options, defaultValue);
        },
        /**
         * With the permissions setted, enable or disable the elements 
         * 
         */
        processPermissions: function processPermissions() {
            var self = this;
            if (self.ui == null) {
                return;
            }
            var p = qxnw.userPolicies.getPermissions(self.getAppWidgetName());
            if (p == null || typeof p == 'undefined') {
                p = {};
                p["edits"] = false;
                p["creates"] = false;
                p["deletes"] = false;
                p["modulo"] = null;
                p["exports"] = false;
                p["imports"] = false;
                p["prints"] = false;
                p["send_email"] = false;
                p["hidden_cols"] = false;
                p["terminal"] = false;
                p["pais"] = false;
            }
            if (self.getAllPermissions()) {
                p["edits"] = true;
                p["creates"] = true;
                p["deletes"] = true;
                p["modulo"] = null;
                p["terminal"] = null;
                p["pais"] = true;
                p["exports"] = true;
                p["imports"] = true;
                p["hidden_cols"] = false;
                p["prints"] = true;
                p["send_email"] = true;
            } else if (self.getAllPermissions() === false) {
                p["edits"] = false;
                p["creates"] = false;
                p["deletes"] = false;
                p["modulo"] = null;
                p["terminal"] = null;
                p["pais"] = null;
                p["exports"] = false;
                p["imports"] = false;
                p["hidden_cols"] = true;
                p["prints"] = false;
                p["send_email"] = false;
            }
            self.__permissions = p;
            try {

                /****************PERMISOS TERMINALES*****************/

                if (typeof p["terminal"] != 'undefined' && typeof p["terminal"] == "boolean") {
                    if (typeof self.ui.terminal != 'undefined') {
                        if (self.getHandleTerminalPermissons()) {
//                            self.ui.terminal.setEnabled(p["terminal"]);
                            if (typeof self.up.terminal != null && self.up.terminal != 0) {
                                if (typeof self.up.terminal != "string") {
                                    self.up.terminal = self.up.terminal.toString();
                                }
                                self.ui.terminal.setValue(self.up.terminal);
                            }
                        }
                    }
                } else {
                    if (typeof self.ui.terminal != 'undefined') {
                        if (self.getHandleTerminalPermissons()) {
//                            self.ui.terminal.setEnabled(false);
                        }
                        if (typeof self.up.terminal != null && self.up.terminal != 0) {
                            if (typeof self.up.terminal != "string") {
                                self.up.terminal = self.up.terminal.toString();
                            }
                            self.ui.terminal.setValue(self.up.terminal);
                        }
                    }
                }

                /****************PERMISOS PAÍSES******************/
//                if (typeof p["pais"] != 'undefined' && typeof p["pais"] == "boolean") {
//                    if (typeof self.ui.pais != 'undefined') {
//                        if (self.getHandleCountryPermissons()) {
//                            self.ui.pais.setEnabled(p["pais"]);
//                            if (typeof self.up.parameters != 'undefined' && self.up.parameters != null) {
//                                for (var iee = 0; iee < self.up.parameters.length; iee++) {
//                                    if (typeof self.up.parameters[iee] != 'undefined' && typeof self.up.parameters[iee].pais != 'undefined') {
//                                        self.ui.pais.setValue(self.up.parameters[iee].pais);
//                                    }
//                                }
//                            }
//                        }
//                    }
//                } else {
//                    if (typeof self.ui.pais != 'undefined') {
//                        if (self.getHandleCountryPermissons()) {
//                            self.ui.pais.setEnabled(false);
//                        }
//                        if (typeof self.up.parameters != 'undefined' && self.up.parameters != null) {
//                            for (var iee = 0; iee < self.up.parameters.length; iee++) {
//                                if (typeof self.up.parameters[iee] != 'undefined' && typeof self.up.parameters[iee].pais != 'undefined') {
//                                    self.ui.pais.setValue(self.up.parameters[iee].pais);
//                                }
//                            }
//                        }
//                    }
//                }

            } catch (e) {
                qxnw.utils.nwconsole(e);
            }
        },
        __invalidateStore: function __invalidateStore(val) {
            this.invalidateStore = val;
        },
        disableAll: function disableAll() {
            this.enableAll(false);
        },
        handleSplitter: function handleSplitter() {
            var self = this;
//            self.splitter.getChildControl("splitter").addListener("move", function(e) {
//                if (self.__isShow) {
//                    if (self.__isHandled) {
//                        var data = e.getData();
//                        console.log(data);
//                        qxnw.local.storeData("qxnw_scroll_" + self.getAppWidgetName(), data["top"]);
//                    } else {
//                        var data = qxnw.local.getData("qxnw_scroll_" + self.getAppWidgetName());
//                        console.log(data);
//                        self.splitter.setOffset(data);
//                        self.__isHandled = true;
//                    }
//                }
//            });
        },
        /**
         * Return an unique id for the form
         * @returns {String}
         */
        getAppWidgetName: function getAppWidgetName() {
//          TODO: se quita también en el lists para que tome cualquier nombre que se cambie en tiempo de ejecución
//          if (this.getAppName() != false) {
//                return this.getAppName();
//          }
            var name = this.classname;
            if (name == "qxnw.forms") {
                name = this.getUserData("form");
            }
            if (name == null) {
                name = "qxnw.forms";
                //TODO: VERIFICAR PORQUÉ SE INVALIDA
                //this.invalidateStore = true;
            }
            this.setAppName(name);
            return name;
        },
        createToolBar: function createToolBar() {
            var self = this;
            if (!self.__areCreatedOtherWidgets) {
                self.createOtherWidgets();
            }
            if (!self.__isCreatedToolBar) {
                self.containerPrinter = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
                    spacing: 2
                })).set({
                    padding: 2,
                    allowGrowY: false,
                    allowShrinkY: true
                });
                self.navTableContainer.resetMaxHeight();
                self.navTableContainer.add(self.containerPrinter);
                self.__isCreatedToolBar = true;
            }
            return true;
        },
        printFrame: function printFrame() {
            this.__frame.getWindow().print();
        },
        hideSelectPrinters: function hideSelectPrinters(bool) {
            if (!bool) {
                try {
                    this.ui["selectPrinterSettings"].setVisibility("visible");
                } catch (e) {

                }
            } else {
                try {
                    this.ui["selectPrinterSettings"].setVisibility("hidden");
                } catch (e) {

                }
            }
        },
        updateFrame: function updateFrame(data, getConstructed) {
            var self = this;
            if (self.__frame != null) {
                var params = "";
                var v;
                if (typeof data != 'undefined') {
                    if (data != false) {
                        if (typeof data == 'object') {
                            for (v in data) {
                                params += "&";
                                params += v;
                                params += "=";
                                params += data[v];
                            }
                            url += params;
                            self.setParams(params);
                        }
                    }
                }
                if (typeof getConstructed != 'undefined') {
                    params += getConstructed;
                }
                var url = self.getFrameUrl() + "&update=" + self.getUpdateId().toString() + params;
                self.__frame.setSource(url);
            }
        },
        /**
         * Create a printer tool bar. Just add a name of the new form, very important to handle the form settings.
         * @param name {String} the name of the new form
         * @param data {Array} an array containing the data for the printer
         * @param selected {Integer} the default id printer
         * @param specialButtons {Boolean} if have to add the configurations buttons
         * @param html {String} the html to one of the special button
         * @returns {void}
         */
        createPrinterToolBar: function createPrinterToolBar(name, data, selected, specialButtons, html) {
            var self = this;
            if (typeof selected == 'undefined' || selected == false) {
                selected = 0;
            }
            if (self.createToolBar()) {
                var printerButton = new qx.ui.form.Button(self.tr("Imprimir"), qxnw.config.execIcon("document-print-preview"));
                if (self.ui != null) {
                    self.ui.printButton = printerButton;
                }
                self.containerPrinter.add(printerButton);
                printerButton.addListener("execute", function () {
                    self.printFrame();
                });
                self.setQxnwType("qxnw_printer");
                self.setUserData("form", typeof name == 'undefined' ? "qxnw_printer" : name);

//                if (typeof specialButtons != 'undefined' && specialButtons === true) {
//                var printerProperties = new qx.ui.form.Button(self.tr("Encabezado y pie"), qxnw.config.execIcon("document-print-preview"));
//                if (self.ui != null) {
//                    self.ui.printerPropertiesButton = sendFileByEmailButton;
//                }
//                self.containerPrinter.add(printerProperties);
//                printerProperties.addListener("execute", function () {
//                    self.printerProperties(html);
//                });

//                var sendFileByEmailButton = new qx.ui.form.Button(self.tr("Enviar por correo"), qxnw.config.execIcon("document-send"));
//                if (self.ui != null) {
//                    self.ui.sendFileByEmail = sendFileByEmailButton;
//                }
//                self.containerPrinter.add(sendFileByEmailButton);
//                sendFileByEmailButton.setEnabled(false);

//                self.ui.pdfPrintButton = new qx.ui.form.Button(self.tr("Descargar PDF"), qxnw.config.execIcon("pdf", "qxnw"));
//                self.containerPrinter.add(self.ui.pdfPrintButton);
//                self.ui.pdfPrintButton.setEnabled(true);
//                self.ui.pdfPrintButton.addListener("execute", function () {
//                    var urlRequest = "&load_pdf&selectPrinterSettings=" + self.ui["selectPrinterSettings"].getValue()["selectPrinterSettings"];
//                    var url = self.getFrameUrl() + urlRequest + "&update=" + self.getUpdateId().toString();
//                    self.__frame.setSource(url);
//                    qxnw.utils.createIdeaPopUp(this, self.tr("La descarga empezará en breve..."), 5000, true);
//                });
//                }

                var command_print = new qx.ui.command.Command('Control+Alt+P');
                command_print.addListener("execute", function () {
                    try {
                        self.printFrame();
                    } catch (e) {

                    }
                });
                var updatePrinterButton = new qx.ui.form.Button(self.tr("Actualizar"), qxnw.config.execIcon("dialog-apply"));
                if (self.ui != null) {
                    self.ui.updatePrinterButton = updatePrinterButton;
                }
                self.containerPrinter.add(updatePrinterButton);
                updatePrinterButton.addListener("execute", function () {
                    var urlRequest = "&selectPrinterSettings=" + self.ui["selectPrinterSettings"].getValue()["selectPrinterSettings"];
                    var url = self.getFrameUrl() + urlRequest + "&update=" + self.getUpdateId().toString();
                    self.__frame.setSource(url);
                });

                var openWindowPrinterButton = new qx.ui.form.Button(self.tr("Abrir en nueva ventana"), qxnw.config.execIcon("dialog-apply"));
                if (self.ui != null) {
                    self.ui.openWindowPrinterButton = openWindowPrinterButton;
                }
                self.containerPrinter.add(openWindowPrinterButton);
                openWindowPrinterButton.addListener("execute", function () {
                    var urlRequest = "&selectPrinterSettings=" + self.ui["selectPrinterSettings"].getValue()["selectPrinterSettings"];
                    var url = self.getFrameUrl() + urlRequest + "&update=" + self.getUpdateId().toString();
                    var w = window.open(url, '_blank');
//                    var w = window.open(url);
//                    var w = window.open(url + "&print_direct=true", 'thePopup', 'width=350,height=350');
//                    w.onload = function () {
//                        w.window.print();
//                        alert("fdsafsda");
//                    };
////                    w.document.close();
                });

                self.ui.helpButton = new qx.ui.form.Button(self.tr("Ayuda"), qxnw.config.execIcon("help-contents"));
                self.containerPrinter.add(self.ui.helpButton);
                self.ui.helpButton.setEnabled(true);
                self.ui.helpButton.addListener("execute", function () {
                    qxnw.main.slotBtnTicketsNw();
                });

                var closePrinterButton = new qx.ui.form.Button(self.tr("Cerrar"), qxnw.config.execIcon("dialog-close"));
                if (self.ui != null) {
                    self.ui.closePrinterButton = closePrinterButton;
                }
                self.containerPrinter.add(closePrinterButton);
                closePrinterButton.addListener("execute", function () {
                    self.close();
                });
                self.containerPrinter.add(new qx.ui.core.Spacer(10, 10), {flex: 1});
                self.ui["selectPrinterSettings"] = new qxnw.fields.selectBox();
                self.ui["selectPrinterSettings"].set({
                    maxHeight: 25, minHeight: 25
                });
                self.ui["selectPrinterSettings"].setValue = function (value) {
                    var items = this.getSelectables(true);
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].getModel() == value) {
                            this.setSelection([items[i]]);
                        }
                    }
                    return true;
                };
                self.ui["selectPrinterSettings"].setUserData("name", "selectPrinterSettings");
                self.ui["selectPrinterSettings"].getValue = function () {
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
                self.containerPrinter.add(self.ui["selectPrinterSettings"]);
                self.ui["selectPrinterSettings"].addListener("changeSelection", function () {
                    var urlRequest = "&selectPrinterSettings=" + self.ui["selectPrinterSettings"].getValue()["selectPrinterSettings"];
                    var url = self.getFrameUrl() + urlRequest + "&update=" + self.getUpdateId().toString();
                    if (self.__frame != null) {
                        self.__frame.setSource(url);
                    }
                });
//                var dat = {};
//                dat[""] = "";
//                qxnw.utils.populateSelectFromArray(self.ui["selectPrinterSettings"], dat);
                qxnw.utils.populateSelectAsync(self.ui["selectPrinterSettings"], "nw_printer", "getPrinterSettings", 0, 0, selected);
//
//                var model;
//                var v;
//                var params;
//                if (typeof data != 'undefined') {
//                    if (typeof data == 'object') {
//                        for (v in data) {
//                            model = v;
//                            params += "&";
//                            params += v;
//                            params += "=";
//                            params += data[v];
//                        }
//                        self.setParams(params);
//                    }
//                }
                if (typeof data != 'undefined' && data != null) {
                    self.__oldData = data;
                    self.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/printer.php?none", false, data);
                } else {
                    self.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/printer.php?none", false);
                }
                self.__cleanFrame = true;
            }
        },
        createFlexPrinterToolBar: function createFlexPrinterToolBar(downloadPath) {
            var self = this;
            if (self.createToolBar()) {
                var printerButton = new qx.ui.form.Button(self.tr("Imprimir"), qxnw.config.execIcon("document-print-preview"));
                if (self.ui != null) {
                    self.ui.printButton = printerButton;
                }
                printerButton.addListener("execute", function () {
                    self.printFrame();
                });
                self.containerPrinter.add(printerButton);
                var downloadButton = new qx.ui.form.Button(self.tr("Descargar"), qxnw.config.execIcon("document-save-as"));
                if (self.ui != null) {
                    self.ui.downloadButton = downloadButton;
                    self.ui["downloadButton"] = self.ui.downloadButton;
                }
                if (downloadPath) {
                    downloadButton.addListener("execute", function () {

                        //TODO: andresf. modificaciones para la descarga de imágenes

                        var img = null;
                        if (typeof downloadPath.image_light == 'undefined') {
                            img = downloadPath;
                        } else {
                            img = downloadPath.image_light;
                        }

                        var dispExts = qxnw.config.getImagesExtensions();

                        var imgExt = img.split('.').pop();
                        if (dispExts.includes(imgExt)) {
                            var link = document.createElement('a');
                            link.href = img;
                            link.download = img;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } else {
                            window.open(downloadPath.image_light, 'Descarga de archivos', 'width=400,height=200');
                        }
                    });
                }
                self.containerPrinter.add(downloadButton);

                self.ui.helpButton = new qx.ui.form.Button(self.tr("Ayuda"), qxnw.config.execIcon("help-contents"));
                self.containerPrinter.add(self.ui.helpButton);
                self.ui.helpButton.setEnabled(true);
                self.ui.helpButton.addListener("execute", function () {
                    qxnw.main.slotBtnTicketsNw();
                });

                var closeButton = new qx.ui.form.Button(self.tr("Cerrar"), qxnw.config.execIcon("dialog-close"));
                closeButton.addListener("execute", function () {
                    self.reject();
                });
                self.containerPrinter.add(closeButton);
//                var zoomInButton = new qx.ui.form.Button(self.tr("Zoom+"), qxnw.config.execIcon("zoom-in"));
//                zoomInButton.addListener("execute", function () {
//                    self.zoomIn();
//                });
//                self.containerPrinter.add(zoomInButton);
//                var zoomOutButton = new qx.ui.form.Button(self.tr("Zoom-"), qxnw.config.execIcon("zoom-out"));
//                zoomOutButton.addListener("execute", function () {
//                    self.zoomOut();
//                });
//                self.containerPrinter.add(zoomOutButton);
            }
        },
        zoomOut: function zoomOut() {
            var self = this;
            var css = "transform: scale(1.2)";
//            var css = "height:280%;width: 300%";
            var el = document.getElementsByName("andresf")[0];
//            var css = "'height':'280%','width': '300%','-ms-zoom': '0.3','-moz-transform': 'scale(0.3)','-moz-transform-origin': '0 0','-o-transform': 'scale(0.3)','-o-transform-origin':' 0 0','-webkit-transform': 'scale(0.3)','-webkit-transform-origin': '0 0'";
            qx.bom.element.Style.setCss(el, css);
        },
        zoomIn: function zoomIn() {
            var self = this;
            var css = "transform: scale(1.2)";
//            var css = "'height':'100%','width': '100%','-ms-zoom': '0.3','-moz-transform': 'scale(0.3)','-moz-transform-origin': '0 0','-o-transform': 'scale(0.3)','-o-transform-origin':' 0 0','-webkit-transform': 'scale(0.3)','-webkit-transform-origin': '0 0'";
            qx.bom.element.Style.setCss(self.__frame.getBody(), css);
        },
        hidePrinterSelect: function hidePrinterSelect(bool) {
            var visibility;
            if (typeof bool == 'undefined') {
                visibility = "excluded";
            } else if (bool) {
                visibility = "excluded";
            } else if (!bool) {
                visibility = "visible";
            }
            if (typeof this.ui["selectPrinterSettings"] != 'undefined') {
                if (typeof this.ui["selectPrinterSettings"] == 'object') {
                    this.ui["selectPrinterSettings"].setVisibility(visibility);
                }
            }
        },
        getUpdateId: function getUpdateId() {
            return this.__updateId++;
        },
        setAppWidgetName: function setAppWidgetName(name) {
            name = name.replace(/ /g, "_");
            this.setAppName(name);
        },
        /**
         * Adds encapsulated html to form in the footer
         * Agrega HTML encapsulado a un formulario en el footer
         * @param html {String} el HTML a agregar al footer del formulario
         * @param flex {Boolean} si el html es flexible y cambia el tamaño del formulario
         * @param clean {Boolean} true para limpiar el html existente
         * @param scrollable {Boolean} true/false para que se cree el scroll sobre el HTML
         * @returns {void}
         */
        addHtml: function addHtml(html, flex, clean, scrollable) {
            var self = this;
            if (typeof flex === 'undefined') {
                flex = false;
            }
            if (typeof clean === 'undefined') {
                clean = false;
            }
            if (typeof scrollable === 'undefined') {
                scrollable = true;
            }
            if (self.__htmlEmbed === null) {
                self.__htmlEmbed = new qx.ui.embed.Html();
                self.__htmlEmbed.setHtml(html);
                if (scrollable) {
                    self.__htmlEmbed.setOverflowY("scroll");
                }
                if (this.__footerBar == null) {
                    self.createFooterBar("horizontal", flex);
                }
                self.__footerBar.resetMaxHeight();
                var flexible = 1;
                if (flex === false) {
                    flexible = 0;
                }
                //TODO: PUEDE CAMBIAR OTRAS COSAS
                //                this.masterContainer.add(self.__htmlEmbed, {
//                    flex: flexible
//                });

                this.__footerBar.add(self.__htmlEmbed, {
                    flex: 0
                });
            } else {
                var htmlOld = self.__htmlEmbed.getHtml();
                var toAdd = "";
                if (clean) {
                    toAdd = html;
                } else {
                    toAdd = htmlOld + html;
                }
                self.__htmlEmbed.setHtml(toAdd);
            }
        },
        /*
         * Add a note in text to the footer of a form
         * Agrega una nota de texto en el footer de un formulario
         * @param {String} textNote el texto
         * @param {Boolean} addStyle si se debe agregar un estilo gris por defecto
         * @returns {void}
         */
        addFooterNoteReplace: function addFooterNoteReplace(textNote, addStyle) {
            var self = this;
            if (typeof addStyle === 'undefined') {
                addStyle = true;
            }
            this.__footerNote = textNote;
            var text = "";
            if (addStyle) {
                text += "<p style='color: gray; font-size: 11;'>";
                text += this.__footerNote;
                text += "</p>";
            } else {
                text += this.__footerNote;
            }
            var labelExists = false;
            if (self.__labelReplace == null) {
                self.__labelReplace = new qx.ui.basic.Label(text).set({
                    rich: true
                });
                labelExists = true;
            } else {
                self.__labelReplace.set({
                    value: textNote
                });
            }
            if (this.__footerBar == null) {
                self.createFooterBar();
            }
            self.__footerBar.resetMaxHeight();
            if (labelExists) {
                this.__footerBar.add(self.__labelReplace);
            }
        },
        /**
         * Add a note (supports HTML) on the footer of the form         
         * @param textNote {String} 
         * @param newNote {Boolean}
         * @returns {void}
         */
        addFooterNote: function addFooterNote(textNote, newNote) {
            var self = this;
            if (typeof newNote == 'undefined') {
                newNote = false;
            }
            this.__footerNote = textNote;
            var text = "";
            text += "<p style='color: gray; font-size: 11;'>";
            text += this.__footerNote;
            text += "</p>";
            var rta = null;
            if (newNote) {
                var label = new qx.ui.basic.Label(text).set({
                    rich: true
                });
                rta = label;
            } else {
                self.__labelReplace = new qx.ui.basic.Label(text).set({
                    rich: true
                });
                rta = self.__labelReplace;
            }
            if (this.__footerBar == null) {
                self.createFooterBar();
            }
            self.__footerBar.resetMaxHeight();
            //TODO: FIX FLEX 1-TEST!
            if (newNote) {
                this.__footerBar.add(label, {
                    flex: 1
                });
            } else {
                this.__footerBar.add(self.__labelReplace, {
                    flex: 1
                });
            }
            return rta;
        },
        addHeaderWidget: function addHeaderWidget(widget) {
            if (this.__headerBar === null) {
                this.createHeaderBar();
            }
            this.__headerBar.add(widget, {
                flex: 1
            });
            this.__headerBar.resetMaxHeight();
            this.__headerBar.set({
                minHeight: 250
            });
        },
        addHeaderNote: function addHeaderNote(textNote, replace) {
            var self = this;
            var label = new qx.ui.basic.Label(textNote).set({
                rich: true
            });
            if (self.__headerBar === null) {
                self.createHeaderBar();
            }
            self.__headerBar.resetMaxHeight();
            self.__headerBar.set({
                zIndex: -1000
            });

            //TODO: FIX FLEX 1-TEST!

            if (typeof replace != 'undefined' && replace == true) {
                self.__headerBar.removeAll();
            }

            self.__headerBar.add(label, {
                flex: 0
            });
        },
        setMaxHeightHeaderBar: function setMaxHeightHeaderBar(height) {
            this.__headerBar.setMaxHeight(height);
        },
        /**
         * Adds an image to footer form 
         * @param path {String} the path of the image
         * @returns {void}
         */
        addFooterImage: function addFooterImage(path) {
            var image = new qx.ui.basic.Image(path);
            this.__footerBar.resetMaxHeight();
            this.__footerBar.add(image, {
                flex: 1
            });
        },
        /**
         * Crates the footer bar
         * @param orientation {string} the orientation widget. i.e horizontal or vertical
         * @param flex {boolean} object param
         * @returns {void}
         */
        createFooterBar: function createFooterBar(orientation, flex) {
            var self = this;
            if (typeof orientation == 'undefined') {
                orientation = "horizontal";
            }
            if (!self.__areCreatedFooterBar) {
                var hLayout;
                if (orientation == "horizontal") {
                    hLayout = new qx.ui.layout.HBox().set({
                        spacing: 1
                    });
                } else {
                    hLayout = new qx.ui.layout.VBox().set({
                        spacing: 1
                    });
                }
                self.__footerBar = new qx.ui.container.Composite(hLayout).set({
                    maxHeight: 0
                });
                //TODO: SE CAMBIO A NO FLEX POR QUE ESTIRA LA VISTA HACIA ABAJO SIN NECESIDAD
                if (flex === true) {
                    self.masterContainer.add(self.__footerBar, {
                        flex: 1
                    });
                } else {
                    self.masterContainer.add(self.__footerBar), {
                        flex: 0
                    };
                }
                self.__areCreatedFooterBar = true;
            }
        },
        createHeaderBar: function createHeaderBar() {
            var self = this;
            if (!self.__areCreatedHeaderBar) {
                var hLayout = new qx.ui.layout.VBox().set({
                    spacing: 10
                });
                self.__headerBar = new qx.ui.container.Composite(hLayout).set({
                    maxHeight: 0
                });
                //self.addBefore(self.__headerBar, self.scrollContainer);
                self.addBefore(self.__headerBar, self.scrollContainer, {
                    flex: 0
                });
                self.__areCreatedHeaderBar = true;
            }
        },
        /**
         * Return the real class name, like an id
         * @returns {String}
         */
        getRealClassName: function getRealClassName() {
            var self = this;
            return self.getAppWidgetName();
        },
        replaceFrame: function replaceFrame(url) {
            var self = this;
            self.__frame.destroy();
            self.__cleanFrame = false;
            self.addFrame(url);
        },
        removeFrame: function removeFrame() {
            var self = this;
            self.__frame.destroy();
            self.__cleanFrame = false;
        },
        /**
         * Adds an frame to form
         * @param url {String} the url of the frame 
         * @param noToolBar {Boolean} if have tool bar or not
         * @param data {Array} the array data for the header
         * @returns {Boolean} if the operation was successfull
         */
        addFrame: function addFrame(url, noToolBar, data) {
            var self = this;
            if (typeof noToolBar == 'undefined') {
                noToolBar = false;
            }
            var v;
            var model;
            var params = "";
            if (typeof data != 'undefined') {
                if (typeof data == 'object') {
                    for (v in data) {
                        model = v;
                        params += "&";
                        params += v;
                        params += "=";
                        if (v == 'file' || v == 'source') {
                            params += encodeURIComponent(data[v]);
                        } else {
                            params += data[v];
                        }
                    }
                    url += params;
                }
            }
//            if (typeof self.__oldData != 'undefined') {
//                if (self.__oldData != null) {
//                    if (typeof self.__oldData == 'object') {
//                        for (v in self.__oldData) {
//                            model = v;
//                            params += "&";
//                            params += v;
//                            params += "=";
//                            params += self.__oldData[v];
//                        }
//                        url += params;
//                    }
//                }
//            }
            self.setParams(params);
            if (!self.__cleanFrame) {
                self.__frame = new qx.ui.embed.Iframe();
            }
            self.__frame.setNativeContextMenu(true);
            self.__frame.setFrameName("andresf");
            if (noToolBar) {
                self.createToolBar();
                if (self.ui.printButton == null) {
                    var updatePrinterButton = new qx.ui.form.Button(self.tr("Actualizar"), qxnw.config.execIcon("dialog-apply"));
                    if (self.ui != null) {
                        self.ui.updatePrinterButton = updatePrinterButton;
                    }
                    self.containerPrinter.add(updatePrinterButton);
                    updatePrinterButton.addListener("execute", function () {
                        var url = self.getFrameUrl() + "?update=" + qxnw.utils.getRandomName();
                        self.__frame.setSource(url);
                    });
                } else {
                    url = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/printer.php?source=" + url;
                }
            }
            self.__frame.setSource(url);
            if (!self.__areCreatedOtherWidgets) {
                self.createOtherWidgets();
            }
            if (!self.__cleanFrame) {
                self.navTableContainer.add(self.__frame, {
                    flex: 1
                });
            }
            self.navTableContainer.resetMaxHeight();
            self.setQxnwType("qxnw_files");
            if (self.getUserData("form") == null) {
                self.setUserData("form", url);
            }
            self.setFrameUrl(url);
            return self.__frame;
        },
        getFrame: function getFrame() {
            return this.__frame;
        },
        /**
         * DIsable the main button sin a form
         * @param bool {Boolean} the bool parameter
         * @returns {void}
         */
        disableMainButtons: function disableMainButton(bool) {
            var self = this;
            try {
                self.ui["accept"].setEnabled(bool);
                self.ui["cancel"].setEnabled(bool);
            } catch (e) {

            }
        },
        /**
         * Inserts a widget into the form
         * @param widget {Widget} the widget to add
         * @param title {String} the title of the added widget
         * @param showCloseButton {Boolean} if shows the close button 
         * @param block {Boolean} to block the content
         * @param icon {String} the icon
         * @returns {void}
         */
        insertWidget: function insertWidget(widget, title, showCloseButton, block, icon) {
            return this.insertNavTable(widget, title, showCloseButton, block, 0, 0, icon);
        },
        /**
         * Función para agregar un Widget a un formulario
         * @param widget {object} el widget a agregar 
         * @param title {String} el título de la pestaña del widget 
         * @param showCloseButton {boolean} si se debe mostrar el botón para cerrar e widget o no 
         * @param block {boolean} si se debe bloquear el contenido del widget 
         * @param name {string} para agregar un navTable al tabView con el mismo nombre
         * @param icon {string} el ícono que se desea salga en la pestaña del navTable
         * @returns {void}                 */
        addNewWidget: function addNewWidget(widget, title, showCloseButton, block, name, icon) {
            return this.insertNavTable(widget, title, showCloseButton, block, true, name, icon);
        },
        getNumberOfNavTables: function getNumberOfNavTables() {
            return this.getNumberOfNavtables();
        },
        getNumberOfNavtables: function getNumberOfNavtables() {
            var count = 0;
            if (this.__tabView == null) {
                return 0;
            }
            try {
                count = this.__tabView.getChildren().length;
                if (this.__tabViewsLibrary != null) {
                    for (var v in this.__tabViewsLibrary) {
                        count += this.__tabViewsLibrary[v].getChildren().length;
                    }
                }
            } catch (e) {
                qxnw.utils.error(e, this);
            }
            return count;
        },
        insertNavTable: function insertNavTable(navTable, title, showCloseButton, block, add, name, icon) {
            var self = this;
            if (typeof block == 'undefined' || block == 0 || block == "") {
                block = false;
            }
            if (typeof add == 'undefined' || add == 0 || add == "") {
                add = false;
            }
            if (typeof showCloseButton == 'undefined' || showCloseButton == 0 || showCloseButton == "") {
                showCloseButton = false;
            }

            //TODO: EN OBSERVACIÓN
            if (typeof self.__containerMain != 'undefined' && self.__containerMain != null) {
                self.__containerMain.setAllowStretchY(false);
            }
            if (!self.isCreatedTabView && !add) {
                self.__tabView = new qx.ui.tabview.TabView();
                self.__tabView.setContentPadding(2);
                if (self.navTableContainer == null) {
                    self.navTableContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                        "spacing": 5
                    }));
                    self.masterContainer.add(self.navTableContainer, {
                        flex: 1
                    });
                }
                self.navTableContainer.add(self.__tabView, {
                    flex: 1
                });
                self.isCreatedTabView = true;
            } else if (add) {
                var existsInTabViewLibrary = false;
                if (typeof name != 'undefined' && name != 0) {
                    if (typeof self.__tabViewsLibrary[name] != 'undefined') {
                        existsInTabViewLibrary = true;
                    }
                }
                if (existsInTabViewLibrary === false) {
                    var __tabView = new qx.ui.tabview.TabView();
                    if (typeof name != 'undefined' && name != 0) {
                        self.__tabViewsLibrary[name] = __tabView;
                    }
                    __tabView.setContentPadding(2);
                    if (self.navTableContainer == null) {
                        self.navTableContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                            "spacing": 10
                        }));
                        self.masterContainer.add(self.navTableContainer, {
                            flex: 1
                        });
                    }
                    self.navTableContainer.add(__tabView, {
                        flex: 1
                    });
                }
                self.isCreatedTabView = true;
            }
            if (typeof title == 'undefined') {
                title = self.tr("Detalle");
            }

            if (self.__containerMain != null) {
                if (self.__isHandled) {
                    self.__containerMain.resetMaxHeight();
                    self.__containerMain.resetMinHeight();
                }
            }

            self.navTableContainer.resetMaxHeight();
            /*
             //var scrollContainer = new qx.ui.container.Scroll();
             //var desktop = new qx.ui.container.Composite(new qx.ui.layout.VBox());
             //scrollContainer.add(desktop);
             */
            var desktop = new qx.ui.window.Desktop().set({
                allowShrinkX: true,
                allowShrinkY: false
            });

            if (block) {
                desktop.block();
            }
            var iconPage = qxnw.config.execIcon("office-project", "apps");
            if (typeof icon != 'undefined' && icon != 0) {
                iconPage = icon;
            }
            var page = new qx.ui.tabview.Page(title, iconPage);
            page.getChildControl("button").setPadding(0);

            page.addListener("appear", function () {
                var target = this.getContentElement().getDomElement();
                qx.bom.element.Style.set(target, "overflow-y", "scroll");
            });

            page.setPaddingRight(10);

            var displayHeight = qx.bom.Viewport.getHeight();
            var bestHeight = displayHeight / 2;
            page.setMinHeight(Math.round(bestHeight));

            page.getChildControl("button").addListener("click", function (e) {
                var name = this.getLabel();
                self.fireDataEvent("NWClickTabView", name);
            });

            self.pageTabView.push(page);
            page.setLayout(new qx.ui.layout.VBox());
            page.add(desktop, {
                flex: 1
            });
            if (showCloseButton) {
                page.setShowCloseButton(true);
            }
            var type = false;
            try {
                type = navTable.getQxnwType();
            } catch (e) {

            }
            var isList = false;

            switch (type) {
                //TODO: (andresf 01 jun 2018) es inservible porque los focus se manejan dentro del navtable
//                case "qxnw_navtable":
//                    try {
//                        var addButton = navTable.getAddButton();
//                        var removeButton = navTable.getRemoveButton();
//                        addButton.setTabIndex(qxnw.config.getActualTabIndex());
//                        removeButton.setTabIndex(qxnw.config.getActualTabIndex());
//                        console.log("entra??");
////                        if (typeof navTable.ui["cleanFiltersButton"] != 'undefined') {
//                        navTable.ui["cleanFiltersButton"].setTabIndex(qxnw.config.getActualTabIndex());
////                        }
//                    } catch (e) {
//                        console.log(e);
//                    }
//                    break;
                case "qxnw_list":
                    navTable.removeListenerById(navTable.getListenerIdAppear());
                    navTable.removeListenerById(navTable.getMoveListenerId());
                    navTable.removeListenerById(navTable.getListenerIdResize());
                    if (self.__containerMain != null) {
                        if (self.__containerMain.getHeight() > 0) {
                            navTable.setMaxHeight(350);
                        }
                    }
                    navTable.set({
                        showClose: false,
                        showMinimize: false,
                        showMaximize: false
                    });
                    navTable.setResizable(false);
                    navTable.getChildControl("captionbar").setVisibility("excluded");
                    navTable.show();
                    isList = true;
                    break;
                case "qxnw_form":
                    navTable.removeListenerById(navTable.getListenerIdAppear());
                    navTable.removeListenerById(navTable.getListenerIdMove());
                    navTable.removeListenerById(navTable.getListenerIdResize());
                    navTable.set({
                        showClose: false,
                        showMinimize: false,
                        showMaximize: false
                    });

                    //****TODO: INTENTO DE VER EL ALTO DEL PAGE EN TESTING****/////
                    page.addListenerOnce("appear", function () {
                        if (self.getIsInsideTree() == true) {
                            var boundsForm = self.getBounds();
                            if (self.__containerMain == null) {
                                return;
                            }
                            var boundsUp = self.__containerMain.getBounds();
                            if (boundsUp.height > boundsForm.height) {
                                return;
                            }
                            var pag = this.getUserData("nw_associate_form");
                            var newHeight = boundsForm.height - (boundsUp.height + 58);
                            if (pag != null) {
                                pag.setMaxHeight(newHeight);
                            }
                        }
                    });

                    navTable.setResizable(false);
                    navTable.getChildControl("captionbar").setVisibility("excluded");
                    navTable.show();
                    break;
            }
            page.setUserData("nw_associate_form", navTable);
            desktop.setUserData("nw_associate_page", page);

            if (type != false) {
                desktop.getQxnwType = function () {
                    return type;
                };
            }

            desktop.add(navTable, {
                width: "100%",
                height: "100%",
                top: 0,
                left: 0
            });
            if (isList === true) {
                navTable.maximize();
            }

            if (add) {
                if (existsInTabViewLibrary === true) {
                    self.__tabViewsLibrary[name].add(page);
                } else {
                    __tabView.add(page);
                }
            } else {
                if (self.__tabView == null) {
                    qxnw.utils.error("El contenedor para la navTable no está creado. Probablemente ya ha insertado otro listado a este formulario. Pruebe pasando el 6 parámetro como true");
                    return;
                }
                self.__tabView.add(page);
            }
            self.insertedNavTables.push(navTable);
            return desktop;
        },
        hideTabButton: function hideTabButton(index, type) {
            if (typeof type == 'undefined') {
                type = "excluded";
            }
            //TODO: no actualiza el widget
            this.pageTabView[index].getChildControl("button").setVisibility(type);
        },
        showTabView: function showTabView(index) {
            var page = this.pageTabView[index];
            var indexOfTab = this.__tabView.indexOf(page);
            if (indexOfTab != -1) {
                this.__tabView.setSelection([page]);
            }
            return false;
        },
        destroyNavTable: function destroyNavTable(index) {
            var page = this.pageTabView[index];
            var finded = false;
            var indexOfTab = this.__tabView.indexOf(page);
            if (indexOfTab != -1) {
                this.__tabView.remove(page);
                this.pageTabView.splice(index, 1);
                finded = true;
            }
            indexOfTab = 0;
            if (!finded) {
                if (this.__tabViewsLibrary != null) {
                    for (var v in this.__tabViewsLibrary) {
                        indexOfTab = this.__tabViewsLibrary[v].indexOf(page);
                        if (indexOfTab != -1) {
                            this.__tabViewsLibrary[v].remove(page);
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        getNavTableIndex: function getNavTableIndex(page) {
            var index = this.__tabView.indexOf(page);
            return index;
        },
        setModalWindow: function setModalWindow() {
            this.getRoot().setBlockerColor("black");
            this.getRoot().setBlockerOpacity(0.2);
        },
        addToFields: function addToFields(widget) {
            if (this.__containerMain) {
                widget.setMaxHeight(50);
                this.__containerMain.add(widget, {
                    column: 0,
                    row: this.__rowCount + 1
                });
            }
        },
        addToSplitter: function addToSplitter(widget) {
            this.masterContainer.add(widget);
        },
        addWidget: function addWidget(widget, flex) {
            var self = this;
            if (typeof flex == 'undefined') {
                flex = 1;
            }
            if (typeof flex == 'object') {
                flex = 1;
            }
            self.createOtherWidgets();
            self.navTableContainer.add(widget, {
                flex: flex
            });
            self.navTableContainer.resetMaxHeight();
        },
        putFieldsIntoFormTag: function putFieldsIntoFormTag() {
            this.__putFieldsIntoFormTag = true;
        },
        insert: function insert(widget) {
            var self = this;
            self.createOtherWidgets();
            self.navTableContainer.add(widget, {
                flex: 1
            });
            self.navTableContainer.resetMaxHeight();
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
        populateConfig: function populateConfig() {
            var size = qxnw.config.getFontSize();
            var family = qxnw.config.getFontFamilys();
            var font = new qx.bom.Font(size, family);
            this.setFont(font);
        },
        byDeffect: function byDeffect(sender) {
            sender.ui["accept"].addListener("execute", function () {
                sender.accept();
            });
            sender.ui["cancel"].addListener("execute", function () {
                sender.reject();
            });
        },
        /**
         * Use this function to store a position of a window. i.e:
         * * <code>
         * Object {left: 877, top: 35, width: 316, height: 193} 
         * </code>         * 
         * @param p {Array} contain an array. 
         * @returns {Boolean} if the operation is ok
         */
        storePosition: function storePosition(p) {
            var self = this;
            if (self.__isMovedPosition == false) {
                self.__isMovedPosition = true;
                return false;
            }
            try {
                qxnw.local.storeData(self.getAppWidgetName() + "_form_pos", p);
            } catch (e) {
                qxnw.utils.nwconsole(e, qx.dev.StackTrace.getStackTrace().toString());
                self.center;
                return false;
            }
        },
        /**
         * Use this function to store a size of a window
         * 
         * @param p {Array} contain an array with dimensions of a window
         * @returns {Boolean} if the operation is ok
         */
        storeSize: function storeSize(p) {
            var self = this;
            //            if (self.__isMovedSize == false) {
            //                self.__isMovedSize = true;
//                return false; //            }
            if (self.invalidateStore) {
                return false;
            }
            try {
                qxnw.local.storeData(self.getAppWidgetName() + "_form_size", p);
            } catch (exc) {
                qxnw.utils.nwconsole(exc, qx.dev.StackTrace.getStackTrace().toString());
                //self.center;
                return false;
            }
            return true;
        },
        /**
         * Set the dimensions from a stored data
         * 
         * @returns {Boolean} if the operation is ok
         */
        setStoredPosition: function setStoredPosition() {
            var self = this;
            if (self.invalidateStore) {
                return;
            }
            var pos = qxnw.local.getData(self.getAppWidgetName() + "_form_pos");
            if (pos == null) {
                self.center();
                return false;
            }
            self.__isPosicioned = true;
            //self.setDomPosition(pos.left, pos.top);
            if (pos.top < 0) {
                pos.top = 0;
            }
            self.moveTo(pos.left, pos.top);
            //TODO: IMPORTANTE POR RESOLVER!!!! ES MEJOR USAR SETUSERBOUNDS PORQUE LA OTRA DEMANDA MUCHA MEMORIA
            //self.setUserBounds(pos.left, pos.top, pos.width, pos.height);
            return true;
        },
        /**
         * Store the size of the widget, when the event "resize" is fired
         * @returns {void}
         */
        setStoredSize: function setStoredSize() {
            var self = this;
            if (self.invalidateStore) {
                return;
            }
            var pos = qxnw.local.getData(self.getAppWidgetName() + "_form_size");
            if (pos == null) {
                var maxHeight = qx.bom.Viewport.getHeight();
                var formHeight = self.getBounds();
                if (maxHeight == null) {
                    return;
                }
                if (formHeight == null) {
                    return;
                }
                if (formHeight.height > maxHeight) {
                    self.setHeight(maxHeight);
                }
                return;
            }
            self.__isMovedSize = true;
            self.setWidth(pos.width);
            self.setHeight(pos.height);
            self.fireDataEvent("modified", pos);
        },
        /**
         * Sets the permissions into this application
         * @param permissions {Array} an array containing the permissions to be set in this class
         * @return {Boolean} if the operation is ok
         */
        setPermissions: function setPermissions(permissions) {
            var self = this;
            self.__permissions["edits"] = permissions["edits"];
            self.__permissions["creates"] = permissions["creates"];
            self.__permissions["deletes"] = permissions["deletes"];
            self.__permissions["consult"] = permissions["consult"];
            self.__permissions["terminal"] = permissions["terminal"];
            return true;
        },
        /**
         * Sets the function to call when the form saves the content. This is fired when the user saves the form.
         * @param func {Object} the function to call
         * @return {void}
         */
        setFunctionOnSave: function setFunctionOnSave(func) {
            this.__func = func;
        },
        /**
         * Sets the table method for automatized forms
         * @param method {String} the method
         * @returns {Boolean} if the operation is ok
         */
        setTableMethod: function setTableMethod(method) {
            this.__tableMethod = method;
            return true;
        },
        /**
         * Return the table method for automatized forms
         * @param method {String} the method
         * @returns {Boolean} if the operation is ok
         */
        getTableMethod: function getTableMethod(method) {
            return this.__tableMethod;
        },
        getTabView: function getTabView() {
            return this.__tabView;
        },
        /**
         * Returns the total from a column, passing as variable the column name
         * @param column {String}
         * @return {void}          */
        getTotalFromColumn: function getTotalFromColumn(column) {
            var self = this;
            self.__columnForTotal = column;
        },
        createFromTableGenerateSeq: function createFromTableGenerateSeq(table, createButtons, paramRecord, paramRecordData) {
            this.__generateSequence = true;
            this.createFromTable(table, createButtons, paramRecord, paramRecordData);
        },
        processDescriptions: function processDescriptions(fields) {
            var self = this;
            var desc = "";
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].description != null) {
                    desc = fields[i].description.split(",");
                } else {
                    fields[i].description = "";
                    desc = fields[i].description.split(",");
                }
                var type = desc[0];
                if (typeof desc[2] != 'undefined') {
                    if (type != "dateField" && type != "checkBox") {
                        self.ui[fields[i].name].setValue("");
                    }
                }
                if (typeof desc[1] != 'undefined') {
                    if (desc[1] != 0) {
                        var dataTable = desc[1];
                        var func = desc[1].split(".");
                        var data = {};
                        data["table"] = dataTable;
                        switch (type) {
                            case "selectBox":
                                if (desc[1] == "boolean") {
                                    var d = {};
                                    d["SI"] = "SI";
                                    d["NO"] = "NO";
                                    qxnw.utils.populateSelectFromArray(self.ui[fields[i].name], d);
                                } else if (desc[1] == "boolean_numeric") {
                                    var d = {};
                                    d["1"] = "SI";
                                    d["0"] = "NO";
                                    qxnw.utils.populateSelectFromArray(self.ui[fields[i].name], d);
                                } else if (desc[1] == "array") {
                                    self.__arraySelectBoxSuspended.push(fields[i].name);
                                } else {
                                    qxnw.utils.populateSelect(self.ui[fields[i].name], func.length == 1 ? self.__tableMethod : func[0], typeof func[1] == 'undefined' ? "populate" : func[1], data);
                                }
                                break;
                            case "tokenField":
                                var userData = {};
                                userData["table"] = dataTable;
                                userData["type"] = type;
                                userData["name"] = fields[i].name;
                                userData["func"] = typeof func[1] == 'undefined' ? "populateTokenField" : func[1];
                                userData["method"] = func.length == 1 ? self.__tableMethod : func[0];
                                self.ui[fields[i].name].setUserData("tokenField", userData);
                                self.ui[fields[i].name].addListener("loadData", function (e) {
                                    var str = e.getData();
                                    var userData = e.getTarget().getUserData("tokenField");
                                    if (userData == null) {
                                        return;
                                    }
                                    data["text"] = str;
                                    data["table"] = userData["table"];
                                    var rpc = new qxnw.rpc(self.getRpcUrl(), userData["method"]);
                                    rpc.setAsync(true);
                                    var func = function (r) {
                                        self.ui[userData["name"]].populateList(str, r);
                                    };
                                    rpc.exec(userData["func"], data, func);
                                }, this);
                                break;
                            case "selectTokenField":
                                var userData = {};
                                userData["table"] = dataTable;
                                userData["type"] = type;
                                userData["name"] = fields[i].name;
                                userData["func"] = typeof func[1] == 'undefined' ? "populateTokenField" : func[1];
                                userData["method"] = func.length == 1 ? self.__tableMethod : func[0];
                                self.ui[fields[i].name].setUserData("selectTokenField", userData);
                                self.ui[fields[i].name].addListener("loadData", function (e) {
                                    var str = e.getData();
                                    var userData = e.getTarget().getUserData("selectTokenField");
                                    if (userData == null) {
                                        return;
                                    }
                                    data["text"] = str;
                                    data["token"] = str;
                                    data["table"] = userData["table"];
                                    var rpc = new qxnw.rpc(self.getRpcUrl(), userData["method"]);
                                    rpc.setAsync(true);
                                    var func = function (r) {
                                        self.ui[userData["name"]].setModelData(r);
                                    };
                                    rpc.exec(userData["func"], data, func);
                                }, this);
                                break;
                        }
                    }
                }
            }
        },
        /**
         * Automatizes the creation of a form passing as variable the table name
         * @param table {String} table name
         * @param createButtons {Boolean} if the buttons have to be created
         * @param paramRecord {Boolean} if have param record to update navTables
         * @param paramRecordData {Array} array containing the line and the id
         * @param tableFields {Array} array containing the same of the consult to the db transfered by list
         * @return {void}
         */
        createFromTable: function createFromTable(table, createButtons, paramRecord, paramRecordData, tableFields) {
            var self = this;
            self.tableAuto = table;
            self.setUserData("form", "nw_forms_".table);
            self.fireEvent("loaded");
            self.createBase();
            if (typeof self.__tableMethod == 'undefined' || self.__tableMethod == null || self.__tableMethod == '') {
                if (self.tableAuto != null) {
                    self.__tableMethod = "master";
                }
            }

            //TODO: intento de omitir la 2 consulta
//            if (typeof tableFields == 'undefined') {
//                var fields = self.getTableFields();
//            } else {
//                var fieldsList = tableFields.cols;
//                var fields = [];
//                for (var i = 0; i < fieldsList.length; i++) {
//                    if (fieldsList[i].type != "ignore") {
//                        fields.push(fieldsList[i]);
//                    } else {
//                        console.log(fieldsList[i]);
//                    }
//                }
//            }
            var fields = self.getTableFields();
            if (self.getColumnsFormNumber() == null) {
                if (fields.length > 5 && fields.length < 10) {
                    self.setColumnsFormNumber(3);
                } else if (fields.length > 11 && fields.length < 20) {
                    self.setColumnsFormNumber(5);
                } else if (fields.length > 21 && fields.length < 40) {
                    self.setColumnsFormNumber(6);
                }
            }
            for (var i = 0; i < fields.length; i++) {
                fields[i].name = fields[i].column_name;
                fields[i].label = qxnw.utils.ucfirst(fields[i].column_name).replace("_", " ");
                if (fields[i].description == null || fields[i].description == "") {
                    fields[i].description = "textField";
                }
                var desc = fields[i].description.split(",");
                //TYPE: 0
                //table: 1
                //VISIBLE: 2
                //REQUIRED: 3
                //MODE: 4
                //LABEL: 5
                //FILTER: 6
                //ENABLED: 7
                fields[i].type = desc[0];
                if (typeof desc[2] != 'undefined') {
                    if (desc[2] != 0) {
                        if (desc[2] === true || desc[2] === false || desc[2] == "true" || desc[2] == "false") {
                            fields[i].visible = desc[2];
                        }
                    }
                }
                if (typeof desc[3] != 'undefined') {
                    if (desc[3] != 0) {
                        if (desc[3] == "true") {
                            desc[3] = true;
                        }
                        if (desc[3] == "false") {
                            desc[3] = false;
                        }
                        if (desc[3] == true || desc[3] == false) {
                            fields[i].required = desc[3];
                        }
                    }
                }
                if (typeof desc[4] != 'undefined') {
                    if (desc[4] != 0) {
                        if (desc[4] != '') {
                            fields[i].mode = desc[4];
                        }
                    }
                }
                if (fields[i].type == "textField") {
                    if (typeof fields[i].character_maximum_length != 'undefined' && fields[i].character_maximum_length != null && fields[i].character_maximum_length > 0) {
                        if (fields[i].mode == "") {
                            fields[i].mode = "maxCharacteres:" + fields[i].character_maximum_length;
                        } else {
                            fields[i].mode += ".maxCharacteres:" + fields[i].character_maximum_length;
                        }
                    }
                }
                if (fields[i].type == "ckeditor") {
                    if (fields[i].mode == "false") {
                        fields[i].maximize = false;
                    }
                }
                if (typeof desc[5] != 'undefined') {
                    if (desc[5] != 0) {
                        if (desc[5] != '') {
                            fields[i].label = desc[5];
                        }
                    }
                }
//UNUSED
//                if (typeof desc[6] != 'undefined') {
//                    if (desc[6] != 0) {
//                        if (desc[6] != '') {
//                            fields[i].mode += "," + desc[6];
//                        }
//                    }
//                }
                if (typeof desc[7] != 'undefined') {
                    fields[i].enabled = desc[7];
                }
                if (this.__serialField != null) {
                    if (fields[i].name == self.__serialField) {
                        fields[i].visible = false;
                    }
                }
            }
            self.setTitle(self.tr("Nuevo/Editar ") + qxnw.utils.ucfirst(table).replace(/_/gi, " "));
            self.setFields(fields);
            if (typeof createButtons == 'undefined') {
                createButtons = true;
            }
            if (createButtons === true) {
                self.addButtonsFunctions();
            }
            desc = null;
            for (i = 0; i < fields.length; i++) {
                desc = fields[i].description.split(",");
                var type = desc[0];
                if (typeof desc[2] != 'undefined') {
                    if (type != "dateField" && type != "checkBox") {
                        self.ui[fields[i].name].setValue("");
                    }
                }
                if (typeof desc[1] != 'undefined') {
                    if (desc[1] != 0) {
                        var dataTable = desc[1];
                        var func = desc[1].split(".");
                        var data = {};
                        data["table"] = dataTable;

                        var useOtherDB = self.getOtherDB();
                        if (useOtherDB != null) {
                            data["useOtherDB"] = useOtherDB;
                        }

                        switch (type) {
//                            TODO PUEDE FALLAR!
//                            case "checkBox":
//                                self.ui[fields[i].name] = new qx.ui.form.CheckBox();
//                                break;
//                            case "uploader":
//                                self.ui[fields[i].name] = new qxnw.uploader();
//                                break;
                            case "selectBox":
                                if (desc[1] === "boolean") {
                                    var d = {};
                                    d["SI"] = "SI";
                                    d["NO"] = "NO";
                                    qxnw.utils.populateSelectFromArray(self.ui[fields[i].name], d);
                                } else if (desc[1] === "boolean_numeric") {
                                    var d = {};
                                    d["1"] = "SI";
                                    d["0"] = "NO";
                                    qxnw.utils.populateSelectFromArray(self.ui[fields[i].name], d);
                                } else if (desc[1] === "array") {
                                    self.__arraySelectBoxSuspended.push(fields[i].name);
                                } else if (desc[1] === "none") {
                                    var d = {};
                                    d[""] = self.tr("Seleccione");
                                    qxnw.utils.populateSelectFromArray(self.ui[fields[i].name], d);
                                } else {
                                    var d = {};
                                    d[""] = self.tr("Seleccione");
                                    qxnw.utils.populateSelectFromArray(self.ui[fields[i].name], d);
                                    qxnw.utils.populateSelect(self.ui[fields[i].name], func.length == 1 ? self.__tableMethod : func[0], typeof func[1] == 'undefined' ? "populate" : func[1], data);
                                }
                                break;
                            case "tokenField":
                                var userData = {};
                                userData["table"] = dataTable;
                                userData["type"] = type;
                                userData["name"] = fields[i].name;
                                userData["func"] = typeof func[1] == 'undefined' ? "populateTokenField" : func[1];
                                userData["method"] = func.length == 1 ? self.__tableMethod : func[0];
                                self.ui[fields[i].name].setUserData("tokenField", userData);
                                self.ui[fields[i].name].addListener("loadData", function (e) {
                                    var str = e.getData();
                                    var userData = e.getTarget().getUserData("tokenField");
                                    if (userData == null) {
                                        return;
                                    }
                                    data["text"] = str;
                                    data["table"] = userData["table"];
                                    var rpc = new qxnw.rpc(self.getRpcUrl(), userData["method"]);
                                    rpc.setAsync(true);
                                    var func = function (r) {
                                        self.ui[userData["name"]].populateList(str, r);
                                    };
                                    rpc.exec(userData["func"], data, func);
                                }, this);
                                break;
                            case "selectTokenField":
                                var userData = {};
                                userData["table"] = dataTable;
                                userData["type"] = type;
                                userData["name"] = fields[i].name;
                                userData["func"] = typeof func[1] == 'undefined' ? "populateTokenField" : func[1];
                                userData["method"] = func.length == 1 ? self.__tableMethod : func[0];
                                self.ui[fields[i].name].setUserData("selectTokenField", userData);
                                self.ui[fields[i].name].addListener("loadData", function (e) {
                                    var str = e.getData();
                                    var userData = e.getTarget().getUserData("selectTokenField");
                                    if (userData == null) {
                                        return;
                                    }
                                    data["text"] = str;
                                    data["token"] = str;
                                    data["table"] = userData["table"];
                                    var rpc = new qxnw.rpc(self.getRpcUrl(), userData["method"]);
                                    rpc.setAsync(true);
                                    var func = function (r) {
                                        self.ui[userData["name"]].setModelData(r);
                                    };
                                    rpc.exec(userData["func"], data, func);
                                }, this);
                                break;
                        }
                    }
                }
            }
            self.processPermissions();
            self.applyConditions();
            self.createNavTable(table, paramRecord, paramRecordData);
            return true;
        },
        applyConditions: function applyConditions() {
            var self = this;
            var description = self.getDescriptionByObjectName("conditions");
            if (typeof description != 'undefined' && description != false) {
                if (description.length > 0) {
                    for (var i = 0; i < description.length; i++) {
                        var r = description[i];
                        var conditions = ["=", ">", "<", "!="];
                        switch (r.action) {
                            case "setMax":
                                var fields = r.widget.split(",");
                                for (var ia = 0; ia < fields.length; ia++) {
                                    var cols = fields[ia];
                                    if (typeof self.ui[cols] !== 'undefined') {
                                        self.ui[cols].setMaximum(r.value);
                                    }
                                }
                                break;
                            case "setMin":
                                var fields = r.widget.split(",");
                                for (var ia = 0; ia < fields.length; ia++) {
                                    var cols = fields[ia];
                                    if (typeof self.ui[cols] !== 'undefined') {
                                        self.ui[cols].setMinimum(r.value);
                                    }
                                }
                                break;
                            case "hide":
                                var condition = "";
                                var where = "";
                                for (var ia = 0; ia < conditions.length; ia++) {
                                    var v = conditions[ia];
                                    where = r.where.split(v);
                                    if (where.length > 0) {
                                        condition = v;
                                        break;
                                    }
                                }
                                var fields = r.widget.split(",");
                                if (condition == "=") {
                                    if (self.up[where[0]] == where[1]) {
                                        for (var ia = 0; ia < fields.length; ia++) {
                                            var cols = fields[ia];
                                            if (typeof self.ui[cols] != 'undefined') {
                                                self.hideField(self.ui[cols]);
                                            }
                                        }
                                    }
                                }
                                break;
                            case "disable":
                                var condition = "";
                                var where = "";
                                for (var ia = 0; ia < conditions.length; ia++) {
                                    var v = conditions[ia];
                                    where = r.where.split(v);
                                    if (where.length > 0) {
                                        condition = v;
                                        break;
                                    }
                                }
                                var fields = r.widget.split(",");
                                if (condition == "=") {
                                    if (self.up[where[0]] == where[1]) {
                                        for (var ia = 0; ia < fields.length; ia++) {
                                            var cols = fields[ia];
                                            if (typeof self.ui[cols] != 'undefined') {
                                                self.ui[cols].setEnabled(false);
                                            }
                                        }
                                    }
                                }
                                break;
                            case "disable_only":
                                if (typeof self.ui[r.widget] != 'undefined') {
                                    self.ui[r.widget].setEnabled(false);
                                }
                                break;
                            case "set":
                                var condition = "";
                                var where = "";
                                for (var ia = 0; ia < conditions.length; ia++) {
                                    var v = conditions[ia];
                                    where = r.where.split(v);
                                    if (where.length > 0) {
                                        condition = v;
                                        break;
                                    }
                                }
                                var fields = r.widget.split(",");
                                if (condition == "=") {
                                    if (self.up[where[0]] == where[1]) {
                                        for (var ia = 0; ia < fields.length; ia++) {
                                            var cols = fields[ia];
                                            if (typeof self.ui[cols] != 'undefined') {
                                                var type = self.getFieldTypeByName(cols);
                                                if (type == "spinner") {
                                                    self.ui[cols].setValue(parseInt(r.value));
                                                } else {
                                                    self.ui[cols].setValue(r.value);
                                                }
                                            }
                                        }
                                    }
                                }
                            case "no_filter_special_characteres":
                                var fields = r.widget.split(",");
                                for (var ia = 0; ia < fields.length; ia++) {
                                    var cols = fields[ia];
                                    if (typeof self.ui[cols] != 'undefined') {
                                        try {
                                            self.ui[cols].setFilter(/[^\\\|]/g);
                                        } catch (e) {

                                        }
                                    }
                                }
                                break;
                            case "populateSelectBox":
                                try {
                                    if (typeof self.ui[r.widget] != 'undefined') {
                                        self.ui[r.widget].addListener(r.where, function () {
                                            var sr = this.getValue();
                                            self.ui[r.widget_receive].removeAll();
                                            var d = {};
                                            d["field"] = r.conector_field;
                                            d["table"] = r.conector_table;
                                            d["id"] = sr[r.widget];
                                            if (typeof r.order_by != 'undefined') {
                                                d["order"] = r.order_by;
                                            }
                                            qxnw.utils.populateSelectAsync(self.ui[r.widget_receive], "master", "populateByTableId", d);
                                        });
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                                break;
                        }
                    }
                }
            }
        },
        createAutoNavTable: function createAutoNavTable(name, cols, title, toolTip) {
            if (typeof title == 'undefined') {
                title = "";
            }
            if (typeof toolTip == 'undefined') {
                toolTip = false;
            }
            this.ui[name] = new qxnw.navtable(this);
            if (toolTip) {
                this.ui[name].setHaveToolTip(true);
            }
            this.ui[name].setTitle(title);
            this.ui[name].createBase();
            this.ui[name].setColumns(cols);
            this.insertNavTable(this.ui[name].getBase(), title);
            this.ui[name]["addNavButton"] = this.ui[name].ui["addButton"];
            this.ui["addNavButton"] = this.ui[name].ui["addButton"];
            this.ui[name]["removeNavButton"] = this.ui[name].ui["removeButton"];
            this.ui["removeNavButton"] = this.ui[name].ui["removeButton"];
            return this.ui[name];
        },
        createNavTable: function createNavTable(table, paramRecord, paramRecordData) {
            var self = this;
            var d = {};
            d["table"] = table;
            var funcs = function (r) {
                if (typeof r == 'undefined' || r == null || !r) {
                    return;
                }
                try {
                    var json = qx.lang.Json.parse(r);
                } catch (e) {
                    qxnw.utils.error(e);
                    return;
                }
                var size = json.length;
                if (size > 0) {
                    self.haveNavTables = true;
                }
                for (var i = 0; i < size; i++) {
                    //CREATE NAVTABLES
                    if (typeof json[i] != 'undefined') {
                        if (typeof json[i].selectBoxArrays != 'undefined') {
                            for (var ib = 0; ib < json[i].selectBoxArrays.length; ib++) {
                                var slboxdata = json[i].selectBoxArrays[ib];
                                for (var ic = 0; ic < self.__arraySelectBoxSuspended.length; ic++) {
                                    var nameObj = self.__arraySelectBoxSuspended[ic];
                                    if (nameObj == slboxdata["name"]) {
                                        var dd = slboxdata["data"];
                                        qxnw.utils.populateSelectFromArray(self.ui[nameObj], dd);
                                    }
                                }
                            }
                        }
                        if (typeof json[i].config != 'undefined') {
                            if (typeof json[i].config.setMovable != 'undefined') {
                                self.setMovable(false);
                            }
                            if (typeof json[i].config.setSimpleWindow != 'undefined') {
                                self.setSimpleWindow();
                            }
                            if (typeof json[i].config.cleanHtml != 'undefined') {
                                r["cleanHtml"] = json[i].config.cleanHtml;
                            }
                        }
                        if (typeof json[i].navTables != 'undefined') {
                            for (var ia = 0; ia < json[i].navTables.length; ia++) {
                                var data = json[i].navTables[ia];
                                self.embedNavTables[data["name"]] = new qxnw.navtable(self, true);
                                self.navTables.push(self.embedNavTables[data["name"]]);
                                self.embedNavTables[data["name"]].setTitle(data["title"]);
                                self.embedNavTables[data["name"]].setUserData("navTableName", data["name"]);
                                self.embedNavTables[data["name"]].setUserData("navTableTable", data["table"]);
                                self.embedNavTables[data["name"]].setUserData("navTableReference", data["reference"]);
                                self.embedNavTables[data["name"]].createBase();
                                //TRY CONTEXT MENU

                                self.embedNavTables[data["name"]].createFromTable(data["table"], data["reference"], false);
                                self.embedNavTables[data["name"]].table.setUserData("navTableName", data["name"]);
                                self.embedNavTables[data["name"]].table.setUserData("navTableTable", data["table"]);
                                self.embedNavTables[data["name"]].table.setUserData("navTableReference", data["reference"]);
                                self.embedNavTables[data["name"]].table.addListener("contextmenu", function (e) {
                                    var that = this;
                                    var name = that.getUserData("navTableName");
                                    var navTable = self.embedNavTables[that.getUserData("navTableName")];
                                    var table = that.getUserData("navTableTable");
                                    var reference = that.getUserData("navTableReference");
                                    var m = new qxnw.contextmenu(navTable);
                                    var sl = navTable.getSelectedRecord();
                                    if (sl == null) {
                                        return;
                                    }
                                    m.addAction(self.tr("Editar"), qxnw.config.execIcon("document-revert"), function (e) {
                                        var d = new qxnw.forms();
                                        d.setModal(true);
                                        d.createFromTable(table, false);
                                        d.setParamRecord(sl);
                                        d.setFieldVisibility(d.ui[reference], "excluded");
                                        d.ui.accept.addListener("execute", function () {
                                            if (!d.validate()) {
                                                return;
                                            }
                                            var r = d.getRecord();
                                            r["table"] = table;
                                            r["reference"] = reference;
                                            r["id"] = self.ui.id.getValue();
                                            r["update"] = true;
                                            r["nw_save_sub_nav_table_new_id"] = sl.id;
                                            if (r["id"] == "") {
                                                var key;
                                                for (key in r) {
                                                    if (key.indexOf("_text") != -1) {
                                                        r["nombre_" + key.replace("_text", "")] = r[key];
                                                    }
                                                }
                                                self.embedNavTables[name].addRows([r]);
                                                d.accept();
                                                navTable.removeSelectedRow();
                                                //qxnw.utils.error("No se encontró un id asociativo. Comuníquese con el administrador.", self);
                                                return;
                                            }
                                            var func = function () {
                                                var key;
                                                for (key in r) {
                                                    if (key.indexOf("_text") != -1) {
                                                        r["nombre_" + key.replace("_text", "")] = r[key];
                                                    }
                                                }
                                                self.embedNavTables[name].addRows([r]);
                                                d.accept();
                                                navTable.removeSelectedRow();
                                            };
                                            var p = self.getDescriptionByObjectName("config");
                                            if (p != false) {
                                                if (typeof p.cleanHtml != 'undefined') {
                                                    r["cleanHtml"] = p.cleanHtml;
                                                }
                                            }
                                            qxnw.utils.fastAsyncRpcCall("master", "saveSubNavTable", r, func);
                                        });
                                        d.ui.cancel.addListener("execute", function () {
                                            d.reject();
                                        });
                                        d.show();
                                    });
                                    m.addAction(self.tr("Eliminar"), qxnw.config.execIcon("edit-delete"), function (e) {
                                        qxnw.utils.question(self.tr("¿Está segur@ de eliminar definitivamente el registro?"), function (e) {
                                            if (e) {
                                                var r = sl;
                                                if (r == 'undefined') {
                                                    qxnw.utils.information("Seleccione un registro para eliminar");
                                                    return;
                                                }
                                                if (r.id == "") {
                                                    self.embedNavTables[name].removeSelectedRow();
                                                    return;
                                                }
                                                var dataNavTable = {};
                                                dataNavTable["table"] = table;
                                                dataNavTable["id"] = r.id;
                                                var func = function () {
                                                    self.embedNavTables[name].removeSelectedRow();
                                                };
                                                qxnw.utils.fastAsyncRpcCall("master", "delete", dataNavTable, func);
                                            }
                                        });
                                    });
                                    m.exec(e);
                                });
                                if (typeof paramRecord != 'undefined' && paramRecord === true) {
                                    if (typeof paramRecordData != 'undefined' && typeof paramRecordData.id != 'undefined') {
                                        var dataNavTable = {};
                                        dataNavTable["table"] = data["table"];
                                        dataNavTable["reference"] = data["reference"];
                                        dataNavTable["id_parent"] = paramRecordData.id;
                                        var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
                                        var rb = rpc.exec("populateAutoNavTable", dataNavTable);
                                        if (rpc.isError()) {
                                            qxnw.utils.error(rpc.getError());
                                            return;
                                        }
                                        self.embedNavTables[data["name"]].setModelData(rb.records);
                                    }
                                }
                                var agregarButton = self.embedNavTables[data["name"]].getAddButton();
                                var deleteButton = self.embedNavTables[data["name"]].getRemoveButton();
                                deleteButton.setUserData("parent_nav_table", data["name"]);
                                deleteButton.setUserData("parent_nav_table_table", data["table"]);
                                deleteButton.addListener("execute", function () {
                                    var these = this;
                                    qxnw.utils.question(self.tr("¿Está segur@ de eliminar definitivamente el registro?"), function (e) {
                                        if (e) {
                                            var parent_user_data = these.getUserData("parent_nav_table");
                                            var name_navtable = these.getUserData("parent_nav_table_table");
                                            var r = self.embedNavTables[parent_user_data].selectedRecord();
                                            if (r == 'undefined') {
                                                qxnw.utils.information("Seleccione un registro para eliminar");
                                                return;
                                            }
                                            if (r.id == "") {
                                                self.embedNavTables[parent_user_data].removeSelectedRow();
                                                return;
                                            }
                                            var dataNavTable = {};
                                            dataNavTable["table"] = name_navtable;
                                            dataNavTable["id"] = r.id;
                                            var func = function () {
                                                self.embedNavTables[parent_user_data].removeSelectedRow();
                                            };
                                            qxnw.utils.fastAsyncRpcCall("master", "delete", dataNavTable, func);
                                        }
                                    });
                                });
                                agregarButton.setUserData("table", data["table"]);
                                agregarButton.setUserData("name", data["name"]);
                                agregarButton.setUserData("reference", data["reference"]);
                                agregarButton.addListener("execute", function () {
                                    var that = this;
                                    var d = new qxnw.forms();
                                    d.setModal(true);
                                    d.createFromTable(that.getUserData("table"), false);
                                    d.setFieldVisibility(d.ui[that.getUserData("reference")], "excluded");
                                    d.ui.accept.addListener("execute", function () {
                                        if (!d.validate()) {
                                            return;
                                        }
                                        var r = d.getRecord();
                                        r["table"] = that.getUserData("table");
                                        r["reference"] = that.getUserData("reference");
                                        r["id"] = self.ui.id.getValue();
                                        r["generateSequence"] = true;
                                        var func = function () {
                                            var key;
                                            for (key in r) {
                                                if (key.indexOf("_text") != -1) {
                                                    r["nombre_" + key.replace("_text", "")] = r[key];
                                                }
                                            }
                                            self.embedNavTables[that.getUserData("name")].addRows([r]);
                                            d.accept();
                                        };
                                        var p = self.getDescriptionByObjectName("config");
                                        if (p != false) {
                                            if (typeof p.cleanHtml != 'undefined') {
                                                r["cleanHtml"] = p.cleanHtml;
                                                self.embedNavTables[that.getUserData("name")].setUserData("cleanHtml", r["cleanHtml"]);
                                            }
                                        }
                                        if (r["id"] == "") {
                                            func();
                                        } else {
                                            qxnw.utils.fastAsyncRpcCall("master", "saveSubNavTable", r, func);
                                        }
                                    });
                                    d.ui.cancel.addListener("execute", function () {
                                        d.reject();
                                    });
                                    d.show();
                                });
                                self.insertNavTable(self.embedNavTables[data["name"]].getBase(), data["title"]);
                            }
                        }
                    }
                }
            };
            var descVar = self.getTableDescription();
            if (descVar == null || descVar == "") {
                qxnw.utils.fastAsyncRpcCall("master", "getTableDescription", d, funcs);
            } else {
                funcs(descVar);
            }
        },
        /**
         * Sets the serial field
         * @param field {String} 
         * @returns {void}
         */
        serialField: function serialField(field) {
            this.__serialField = field;
        },
        /**
         * Set the form content enabled or disabled
         * @param bool {Boolean} deffect true
         * @returns {void}
         */
        setEnabledAll: function setEnabledAll(bool) {
            var self = this;
            var fields = this.getFields();
            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].name;
                try {
                    if (fields[i].type == "dateField") {
                        self.ui[name].getChildControl("textfield").setEnabled(bool);
                        self.ui[name].getChildControl("textfield").setReadOnly(!bool ? true : bool);
                        self.ui[name].getChildControl("textfield").setSelectable(bool);
                        self.ui[name].getChildControl("textfield").setFocusable(bool);
                        if (self.ui[name].getUserData("focus_id_listener") != null) {
                            self.ui[name].removeListenerById(self.ui[name].getUserData("focus_id_listener"));
                        }
                        self.ui[name].setEnabled(bool);
                        self.ui[name].setReadOnly(!bool ? true : bool);
                        self.ui[name].setSelectable(bool);
                    } else if (fields[i].type == "textField") {
                        self.ui[name].setEnabled(bool);
                    } else if (fields[i].type == "textArea") {
                        self.ui[name].setEnabled(bool);
                    } else {
                        self.ui[name].setEnabled(bool);
                        self.ui[name].setReadOnly(!bool ? true : bool);
                        self.ui[name].setSelectable(bool);
                    }
                } catch (e) {

                }
            }
        },
        /**
         * Try to save the textField value into local storage.
         * @param textField {Object} the textField object
         * @param name {String} the field name
         * @returns {Boolean}
         */
        saveValue: function saveValue(textField, name) {
            var self = this;
            var data = textField.getValue();
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
        /**
         * Take all form objects created and returns the values in an array
         * @param noLabel {Boolean} if returns label value or not (deffect returns it)
         * @return {Array} containing          */
        getRecord: function getRecord(noLabel) {
            var self = this;
            var fields = this.getFields();
            var data = {};
            if (typeof noLabel == 'undefined') {
                noLabel = false;
            }
            var d = new Array();
            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].name;
                var type = fields[i].type;
                var mode = fields[i].mode;
                try {
                    switch (type) {
                        case "canvasWriter":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "signer":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "address":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "addressV2":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "imageSelector":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "image":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "uploader_multiple":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "label":
                            if (noLabel == false) {
                                data[name] = self.ui[name].getValue();
                            }
                            break;
                        case "listCheck":
                            var d = [];
                            var typeItem = self.ui[name].getTypeListItem();
                            if (typeItem == "checkBox") {
                                var childs = self.ui[name].getChildren();
                                for (var ia = 0; ia < childs.length; ia++) {
                                    if (childs[ia].getValue()) {
                                        var r = childs[ia].getModel();
                                        d.push(r);
                                    }
                                }
                            } else {
                                var childs = self.ui[name].getSelection();
                                for (var ia = 0; ia < childs.length; ia++) {
                                    var r = childs[ia].getModel();
                                    d.push(r);
                                }
                            }
                            data[name] = d;
                            break;
                        case "radioCheck":
                            var d = [];
                            var childs = self.ui[name].getChildren();
                            for (var ia = 0; ia < childs.length; ia++) {
                                if (childs[ia].getValue()) {
                                    var r = childs[ia].getModel();
                                    d.push(r);
                                }
                            }
                            if (typeof d[0] != 'undefined') {
                                data[name] = d[0].id;
                                data[name + "_array"] = d[0];
                                if (typeof d[0].nombre != 'undefined') {
                                    data[name + "_text"] = d[0];
                                }
                            }
                            break;
                        case "selectListCheck":
                            var d = [];
                            data[name] = self.ui[name].getValue();
                            break;
                        case "ckeditor":
                            data[name] = self.ui[name].getEditorValue();
                            if (data[name] == null) {
                                data[name] = self.ui[name].getValue();
                            }
                            break;
                        case "uploader":
                            data[name] = self.ui[name].getResponse();
                            break;
                        case "uploader_images":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "textFieldSearch":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "textField":
                            var isMoney = false;
                            if (typeof self.ui[name].getValue() != 'undefined') {
                                data[name] = self.ui[name].getValue();
                            } else {
                                data[name] = "";
                            }
                            if (typeof mode != 'undefined') {
                                var arrMode = mode.split(".");
                                for (var ia = 0; ia < arrMode.length; ia++) {
                                    if (arrMode[ia] == "Integer" || arrMode[ia] == "integer") {
                                        if (data[name] != null) {
                                            data[name] = parseInt(data[name]);
                                            if (isNaN(data[name])) {
                                                data[name] = null;
                                            }
                                        }
                                    }
                                    if (arrMode[ia] == "search") {
                                        self.ui[name].saveValue(name);
                                    }
                                    if (arrMode[ia] == "money" || arrMode[ia] == "Money") {
                                        isMoney = true;
                                        if (data[name] != null) {
                                            //data[name] = accounting.unformat(data[name], ",");
                                            //data[name] = parseInt(data[name]);
                                        }
                                    }
                                    if (arrMode[ia] == "md5" || arrMode[ia] == "Md5") {
                                        if (data[name] != null) {
                                            data[name] = qxnw.md5.MD5(self.ui[name].getValue());
                                        }
                                    }
                                    if (arrMode[ia] == "accounting") {
                                        if (data[name] != null) {
                                            data[name] = accounting.unformat(data[name], ".");
                                            data[name] = parseInt(data[name]);
                                        }
                                    }
                                    if (arrMode[ia] == "upperCase") {
                                        if (data[name] != null) {
                                            var upper = new qx.type.BaseString(data[name]);
                                            data[name] = upper.toUpperCase();
                                        }
                                    }
                                }
                            }
                            if (data[name] !== null && isMoney === true) {
                                if (data[name].toString() === ".") {
                                    data[name] = 0;
                                }
                            }
                            break;
                        case "tokenField":
                            if (typeof self.ui[name].getSelection()[0] === "undefined") {
                                data[name] = null;
                                data[name + "_text"] = null;
                            } else {
                                data[name] = self.ui[name].getSelection()[0].getModel().$$user_id;
                                data[name + "_text"] = self.ui[name].getSelection()[0].getModel().$$user_nombre;
                            }
                            break;
                        case "selectTokenField":
                            var arr = self.ui[name].getData();
                            if (typeof arr[0] === 'undefined') {
                                data[name] = null;
                                data[name + "_array"] = null;
                                data[name + "_text"] = null;
                                try {
                                    data[name + "_value"] = self.ui[name].getChildControl("textfield").getValue();
                                } catch (e) {

                                }
                            } else {
                                data[name] = arr[0]["id"];
                                data[name + "_array"] = arr[0];
                                data[name + "_array_all"] = arr;
                                try {
                                    data[name + "_value"] = self.ui[name].getChildControl("textfield").getValue();
                                } catch (e) {

                                }
                                data[name + "_text"] = typeof arr[0]["name"] == 'undefined' ? arr[0]["nombre"] : arr[0]["name"];
                            }
                            break;
                        case "textArea":
                            data[name] = self.ui[name].getValue();
                            if (typeof mode != 'undefined') {
                                var arrMode = mode.split(".");
                                for (var ia = 0; ia < arrMode.length; ia++) {
                                    if (arrMode[ia] == "upperCase") {
                                        if (data[name] != null) {
                                            var upper = new qx.type.BaseString(data[name]);
                                            data[name] = upper.toUpperCase();
                                        }
                                    }
                                }
                            }
                            break;
                        case "camera":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "spinner":
                            data[name] = self.ui[name].getValue();
                            if (isNaN(data[name])) {
                                data[name] = null;
                            }
                            break;
                        case "passwordField":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "checkBox":
                            data[name] = self.ui[name].getValue();
                            if (self.tableAuto != null) {
                                if (data[name]) {
                                    data[name] = "true";
                                } else {
                                    data[name] = "false";
                                }
                            } else {
                                if (data[name]) {
                                    data[name] = "true";
                                } else {
                                    data[name] = "false";
                                }
                            }
                            break;
                        case "timeField":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "colorButton":
                            data[name] = self.ui[name].getValue();
                            break;
                        case "dateField":
                            data[name] = self.ui[name].getChildControl("textfield").getValue();
                            data[name + "_obj"] = self.ui[name].getValue();
                            break;
                        case "dateTimeField":
                            data[name] = self.ui[name].getChildControl("textfield").getValue();
                            break;
                        case "dateChooser":
                            var date = self.ui[name].getValue();
                            data[name] = qxnw.utils.formatDate(date, "/");
                            break;
                        case "selectBox":
                            var val = self.ui[name].getValue();
                            data[name] = val[name];
                            data[name + "_text"] = val[name + "_text"];
                            data[name + "_model"] = val[name + "_model"];
                            break;
                        case "button":
                            break;
                    }
                } catch (e) {
                    qxnw.utils.nwconsole(e, qx.dev.StackTrace.getStackTrace().toString());
                }
            }
            return data;
        },
        setTableDescription: function setTableDescription(description) {
            this.__tableDescription = description;
        },
        getTableDescription: function getTableDescription() {
            return this.__tableDescription;
        },
        processTableDescription: function processTableDescription() {
            var desc = qx.lang.Json(this.__tableDescription);
        },
        /**
         * In automatic mode, return the fields from the db          
         * @returns {Boolean}
         */
        getTableFields: function getTableFields() {
            var data = {};
            data["table"] = this.tableAuto;
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), this.__tableMethod);
            if (this.getTableDescription() == null) {
                data["getTableDescription"] = true;
            }
            var useOtherDB = this.getOtherDB();
            if (useOtherDB != null) {
                data["useOtherDB"] = useOtherDB;
            }
            var r = rpc.exec("getColumnsAndDescriptions", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return false;
            }
            if (this.getTableDescription() == null) {
                this.__tableDescription = r.table_description;
            }
            return r.cols;
        },
        addAutomatedFunctions: function addAutomatedFunctions() {
            var self = this;
            if (typeof self.ui["accept"] != 'undefined') {
                self.ui["accept"].addListener("execute", function () {
                    self.accept();
                });
            }
            if (typeof self.ui["cancel"] != 'undefined') {
                self.ui["cancel"].addListener("execute", function () {
                    self.reject();
                });
            }
        },
        /**
         * Adds the buttons functions          * @returns {void}
         */
        addButtonsFunctions: function addButtonsFunctions() {
            var self = this;
            self.ui["accept"].addListener("execute", function () {
                self.slotSave();
            });
            self.ui["cancel"].addListener("execute", function () {
                self.reject();
            });
        },
        findIntoDescriptionFields: function (fields, index, tableDescription) {
            if (typeof tableDescription != 'undefined' && tableDescription != false && tableDescription != null) {
                if (typeof tableDescription.length != 'undefined') {
                    for (var iy = 0; iy < tableDescription.length; iy++) {
                        if (typeof tableDescription[iy] != 'undefined') {
                            if (typeof tableDescription[iy].action != 'undefined') {
                                if (typeof tableDescription[iy].where != 'undefined') {
                                    if (tableDescription[iy].where == fields[index].name) {
                                        if (tableDescription[iy].action == 'startGroup') {
                                            var startGroup = {
                                                type: "startGroup"
                                            };
                                            if (typeof tableDescription[iy].color != 'undefined') {
                                                startGroup.color = tableDescription[iy].color;
                                            }
                                            if (typeof tableDescription[iy].border != 'undefined') {
                                                startGroup.border = tableDescription[iy].border;
                                            }
                                            if (typeof tableDescription[iy].mode != 'undefined') {
                                                startGroup.mode = tableDescription[iy].mode;
                                            }
                                            startGroup.description = "";
                                            fields.splice(index + 1, 0, startGroup);
                                        } else if (tableDescription[iy].action == 'endGroup') {
                                            var endGroup = {
                                                type: "endGroup"
                                            };
                                            endGroup.description = "";
                                            fields.splice(index + 1, 0, endGroup);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        /**
         * In automatic mode, save the form and accept
         * @returns {void}
         */
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            data["table"] = self.tableAuto;
            data["e"] = self.e;
            data["haveNavTable"] = self.haveNavTables;
            if (self.haveNavTables === true) {
                if (self.navTables.length > 0) {
                    data["sizeNavTable"] = self.navTables.length;
                    for (var i = 0; i < self.navTables.length; i++) {
                        data["detail" + i] = self.navTables[i].getAllData();
                        data["detail_table" + i] = self.navTables[i].getUserData("navTableTable");
                        data["nav_table_referencie" + i] = self.navTables[i].getUserData("navTableReference");
                        data["nav_table_cleanHtml" + i] = self.navTables[i].getUserData("cleanHtml");
                    }
                }
            }
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), this.__tableMethod);
            rpc.setAsync(true);
            var func = function (r) {
                self.accept(r);
            };

            data["generateSequence"] = true;

            var p = self.getDescriptionByObjectName("config");
            if (typeof p != 'undefined' && p != false) {
                if (typeof p.cleanHtml != 'undefined') {
                    data["cleanHtml"] = p.cleanHtml;
                }
                if (typeof p.uniqueFields != 'undefined') {
                    data["uniqueFields"] = p.uniqueFields;
                }
                if (typeof p.cleanSpecialWords != 'undefined') {
                    data["cleanSpecialWords"] = p.cleanSpecialWords;
                }
            }
            if (self.getCleanHTML() != true && typeof data["cleanHtml"] == 'undefined') {
                data["cleanHtml"] = false;
            }
            if (self.getCleanSpecialWords() != true) {
                data["cleanSpecialWords"] = false;
            }

            var useOtherDB = self.getOtherDB();
            if (useOtherDB != null) {
                data["useOtherDB"] = useOtherDB;
            }

            rpc.exec("save", data, func);
        },
        getDescriptionByObjectName: function getDescriptionByObjectName(name) {
            var descVar = this.getTableDescription();
            if (descVar != null && descVar != "") {
                try {
                    var json = qx.lang.Json.parse(descVar);
                } catch (e) {
                    qxnw.utils.error(e);
                    return;
                }
                for (var ia = 0; ia < json.length; ia++) {
                    var r = json[ia];
                    if (typeof r[name] != 'undefined') {
                        return r[name];
                    }
                }
                return false;
            } else {
                return false;
            }
        },
        setRpcUrl: function setRpcUrl() {
            this.rpcUrl = qxnw.userPolicies.rpcUrl();
        },
        /**
         * Set the window title
         * @param title {String}  the title
         * @returns {setTitle}
         */
        setTitle: function setTitle(title) {
            try {
                this.set({
                    caption: title
                });
                this.__title = title;
                if (typeof title != 'undefined' && title != null && title != "") {
                    if (this.getUserData("form") == "" || this.getUserData("form") == null) {
                        if (typeof title == "object") {
                            title = title.getMessageId();
                            title = title.replace(/ /g, "_");
                            this.setUserData("form", title);
                        } else {
                            title = title.replace(/ /g, "_");
                            this.setUserData("form", title);
                        }
                    }
                }
            } catch (e) {
                qxnw.utils.bindError(e, this);
            }
        },
        getTitle: function getTitle() {
            return this.__title;
        },
        /**
         * Set the icon dialog
         * @param icon {Object} 
         * @returns {void}          */
        setIconDialog: function setIconDialog(icon) {
            this.setIcon(icon);
        },
        createBase: function createBase() {
            return true;
        },
        setNewDimensions: function setNewDimensions(e) {
            var data = e.getData();
            //console.log(e.getData());
            //console.log("draw");
            //self.subCanvas.update();
            //self.setWidth(data.width);
            //this.form.setWidth(e.width);
        },
        /**
         * Return the layout
         * @returns {qx.ui.layout}
         */
        getLayout: function getLayout() {
            return this.baseLayout;
        }, /**
         * Make the window simple, without caption bar, no buttons, width shadow (if any)          
         * @param bool {Boolean} 
         * @returns {void}          
         */
        setSimpleWindow: function setSimpleWindow(bool) {
            var self = this;
            self.set({
                showClose: false,
                showMinimize: false,
                alwaysOnTop: true,
                modal: false
            });
        },
        setParamRecord: function setParamRecord(pr) {
            this.pr = pr;
            this.setRecord(pr);
            return true;
        },
        removeAllListeners: function removeAllListeners() {
            this.removeListenerById(this.getListenerIdClose());
            this.removeListenerById(this.getListenerIdAppear());
            this.removeListenerById(this.getListenerIdMove());
            this.removeListenerById(this.getListenerIdResize());
        },
        resetAllFields: function resetAllFields() {
            var self = this;
            var fields = this.__fields;
            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].name;
                self.ui[name].resetValue();
            }
            return true;
        },
        addFields: function addFields(fields) {
            var self = this;
            self.setFields(fields);
        },
        addFooterFields: function addFooterFields(fields) {
            var self = this;
            self.serializeFields(fields);
            var modeGroup;
            var isGroup = false;
            if (this.__footerBar == null) {
                self.createFooterBar();
            }
            for (var i = 0; i < fields.length; i++) {
                var required = fields[i].required;
                var label = fields[i].label;
                var type = fields[i].type;
                var name = fields[i].name;
                var width = fields[i].width;
                var mode = fields[i].mode;
                if (type == "startGroup") {
                    var icon = fields[i].icon;
                    self.__group = new qx.ui.groupbox.GroupBox(name, icon).set({
                        contentPadding: 2
                    });

                    self.__group.getChildControl("legend").setRich(true);
                    if (typeof fields[i].textColor != 'undefined') {
                        self.__group.getChildControl("legend").setTextColor(fields[i].textColor);
                    }
                    var colorTextGroups = qxnw.userPolicies.getColorLabelGroups();
                    if (colorTextGroups != null) {
                        if (typeof colorTextGroups != "undefined") {
                            if (typeof colorTextGroups != "") {
                                self.__group.getChildControl("legend").setTextColor(colorTextGroups);
                            }
                        }
                    }
                    if (typeof fields[i].border != 'undefined') {
                        self.__group.setBackgroundColor(fields[i].border);
                    }
                    if (typeof fields[i].color != 'undefined') {
                        self.__group.getChildControl("frame").setBackgroundColor(fields[i].color);
                    }
                    if (typeof width != 'undefined') {
                        self.__group.set({
                            maxWidth: width
                        });
                    }
                    if (mode == "horizontal") {
                        self.__group.setLayout(new qx.ui.layout.HBox().set({
                            spacing: 5
                        }));
                        modeGroup = mode;
                    } else if (mode == "vertical") {
                        self.__group.setLayout(new qx.ui.layout.VBox().set({
                            spacing: 5
                        }));
                        modeGroup = mode;
                    } else if (mode == "grid") {
                        self.__group.setLayout(new qx.ui.layout.Grid().set({
                            spacing: 5
                        }));
                        modeGroup = mode;
                    } else {
                        self.__group.setLayout(new qx.ui.layout.VBox().set({
                            spacing: 5
                        }));
                        modeGroup = "vertical";
                    }
                    if (name == "") {
                        self.__group.getChildControl("legend").setVisibility("excluded");
                    }
                    self.isAddedGroup = false;
                    isGroup = true;
                    continue;
                }
                if (type == "endGroup") {
                    isGroup = false;
                    continue;
                }
                var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                var asterisk = "";
                if (required) {
                    asterisk = "<b style='color:red' class='require_qxnw'>*</b>";
                    self.ui[name].setRequired(required);
                }
                if (label != "null") {
                    label = qxnw.utils.replaceAll(label, "_", "") + asterisk;
                } else {
                    label = "null";
                }
                self.labelForm[name] = new qx.ui.basic.Label(label).set({
                    rich: true
                });
                if (label != "null") {
                    if (mode != "no_show_label") {
                        container.add(self.labelForm[name], {flex: 1});
                    }
                }
                if (type == "uploader") {
                    container.add(self.ui[name].getContainer(), {flex: 1});
                } else {
                    container.add(self.ui[name], {flex: 1});
                }
                self.__footerBar.setMaxHeight(1000);
                //self.__footerBar.add(container);
//                self.ui[name].setTabIndex(self.__tabIndex++);
                if (isGroup) {
                    self.__group.add(container, {
                        flex: 1
                    });
                    if (!self.isAddedGroup) {
                        self.__footerBar.add(self.__group, {
                            flex: 1
                        });
                        self.isAddedGroup = true;
                    }
                } else {
                    self.__footerBar.add(container);
                }
            }
            return true;
        },
        getFooterBar: function getFooterBar() {
            return this.__footerBar;
        },
        addFieldsByContainer: function addFieldsByContainer(fields, container_user, container_type) {
            var self = this;
            self.serializeFields(fields);
            var widget_dates = false;
            var widget_dates_position = false;
            for (var i = 0; i < fields.length; i++) {
                var required = fields[i].required;
                var label = fields[i].label;
                var type = fields[i].type;
                var name = fields[i].name;
                var toolTip = fields[i].toolTip;
                var mode = fields[i].mode;

                if (name === "widget_dates") {
                    widget_dates_position = 0;
                    if (i === 0) {
                        widget_dates_position = 0;
                    } else if (i >= 2) {
                        widget_dates_position = i - 2;
                    } else {
                        widget_dates_position = i;
                    }
//                    console.log("widget_dates_position", widget_dates_position);
                    widget_dates = true;
                    continue;
                }

                var width = false;
                if (type == "startGroup") {
                    continue;
                }
                if (fields[i].visible == false || fields[i].type == "not_visible" || fields[i].type == "serial" || fields[i].visible == "false") {
                    label = "";
                    self.ui[name].setVisibility("excluded");
                    continue;
                }
                if (typeof fields[i].width != 'undefined') {
                    width = fields[i].width;
                }
                var vLayout = null;
                if (type == "radioButton" || type == "checkBox") {
                    vLayout = new qx.ui.layout.HBox().set({
                        spacing: 5
                    });
                } else {
                    vLayout = new qx.ui.layout.VBox();
                }
                var container = new qx.ui.container.Composite(vLayout).set({
                    padding: 3
                });
                self.containerFieldsArray[name] = container;
                var asterisk = "";
                if (required) {
                    asterisk = "<b style='color:red' class='require_qxnw'>*</b>";
                }

                if (typeof label !== 'undefined') {
                    if (typeof label.classname !== 'undefined') {
                        if (label.classname === "qx.locale.LocalizedString") {
                            if (label.getMessageId() === "") {
                                label = "";
                            }
                        }
                    }
                }

                if (typeof toolTip != 'undefined' && typeof toolTip != null) {
                    self.labelUi[name] = new qx.ui.basic.Atom(label.replace("_", " ") + asterisk, qxnw.config.execIcon("dialog-information.png", "status")).set({
                        rich: true
                    });
                    self.labelForm[name] = self.labelUi[name];
                    var tT = new qx.ui.tooltip.ToolTip(toolTip, qxnw.config.execIcon("help-faq"));
                    if (type == "button") {
                        self.ui[name].setToolTip(tT);
                    }
                    self.labelUi[name].setGap(-3);
                    self.labelUi[name].setIconPosition("right");
                    self.labelUi[name].setToolTip(tT);
                } else {
                    self.labelUi[name] = new qx.ui.basic.Label(label.replace("_", " ") + asterisk).set({
                        rich: true
                    });
                    self.labelForm[name] = self.labelUi[name];
                }

                self.labelUi[name].setUserData("name", name);
                if (type === "button" || type === "spacer") {
                    self.labelUi[name].setValue("");
                    self.labelUi[name].setVisibility("excluded");
                } else if (type === "label") {
                    if (typeof mode !== 'undefined' && mode === "showLegend") {

                    } else {
                        self.labelUi[name].setValue("");
                    }
                } else if (type == "ckeditor") {
                    container.getLayout().set({
                        alignX: "right"
                    });
                } else if (type == "selectBox") {
                    container.getLayout().set({
                        alignY: "top"
                    });
                } else if (type == "checkBox") {
                    container.getLayout().set({
                        alignX: "left",
                        alignY: "middle"
                    });
                }
                if (label != "null" && type != "checkBox") {
                    container.add(self.labelUi[name], {flex: 1});
                } else if (type == "checkBox") {
                    self.ui[name].setUserData("labelUi", self.labelUi[name]);
                    self.labelUi[name].addListener("click", function () {
                        try {
                            var name = this.getUserData("name");
                            var val = self.ui[name].getValue();
                            self.ui[name].setValue(val == false ? true : false);
                        } catch (e) {
                            qxnw.utils.error(e, this);
                        }
                    });
                }
                if (type == "ckeditor") {
                    self.ui[name].set({
                        height: 370
                    });
                    container.add(self.ui[name], {flex: 1});
                } else if (type == "uploader") {
                    container.add(self.ui[name].getContainer(), {flex: 1});
                } else {
                    container.add(self.ui[name], {flex: 1});
                    if (type == "checkBox") {
                        container.add(self.labelUi[name], {flex: 1});
                    }
                }
                if (width != false) {
                    if (width > 0) {
                        try {
                            self.ui[name].setMinWidth(width);
                            self.ui[name].setMaxWidth(width);
                        } catch (e) {
                            try {
                                qxnw.utils.nwconsole("No se encontró la función min y max width en el elemento " + name, qx.dev.StackTrace.getStackTrace().toString());
                            } catch (e) {

                            }
                        }
                    }
                }
                if (typeof container_type == 'undefined') {
                    container_user.add(container, {
                        flex: 1
                    });
                } else if (container_type == "grid") {
                    if (typeof fields[i].column == 'undefined' || fields[i].column == null) {
                        qxnw.utils.error(self.tr("Para un tipo GRID debe agregar la columna (i.e column: 0) "));
                        return;
                    }
                    if (typeof fields[i].row == 'undefined' || fields[i].row == null) {
                        qxnw.utils.error(self.tr("Para un tipo GRID debe agregar la row (i.e row: 0) "));
                        return;
                    }
                    container_user.add(container, {
                        column: fields[i].column,
                        row: fields[i].row
                    });
                }
            }
            if (widget_dates) {
                self.containerDateTool = new qxnw.widgets.dateWidgetContainer(new qx.ui.layout.VBox(), self, container_user, widget_dates_position).set({
                    padding: 2
                });
            }
            self.__containersUser.push(container_user);
            return true;
        },
        setFields: function setFields(fields) {
            var self = this;
            self.createValidationManager();
            self.serializeFields(fields);
            self.createForm(fields);
            self.createOtherWidgets();
            self.createFooterBar();
            self.createDeffectButtons();

            if (self.cronometer != null) {
                self.cronometer.pause();
            }
        },
        createValidationManager: function createValidationManager() {
            if (this.__manager == null) {
                this.__manager = new qxnw.validator();
            }
        },
        changeCheckBoxValues: function changeCheckBoxValues(bool, noChange) {
            var fields = this.getFields();
            for (var i = 0; i < fields.length; i++) {
                if (typeof noChange != 'undefined') {
                    if (fields[i]["type"] == "checkBox" && fields[i]["name"] != noChange) {
                        this.ui[fields[i]["name"]].setValue(bool);
                    }
                } else {
                    if (fields[i]["type"] == "checkBox") {
                        this.ui[fields[i]["name"]].setValue(bool);
                    }
                }
            }
        },
        setGroupHeader: function setGroupHeader(header) {
            this.groupHeader = header;
        },
        getFields: function getFields() {
            return this.__fields;
        },
        changeLabel: function changeLabel(name, text) {
            var rq = this.labelForm[name].getUserData("required");
            if (rq) {
                this.labelForm[name].setValue(text + "<b style='color:red' class='require_qxnw'>*</b>");
            } else {
                this.labelForm[name].setValue(text);
            }
        },
        setRequired: function setRequired(name, bool) {
            var fields = this.getFields();
            for (var i = 0; i < fields.length; i++) {
                if (name == fields[i].name) {
                    fields[i].required = bool;
                    if (bool) {
                        var label = this.labelForm[name].getValue().replace("<b style='color:red' class='require_qxnw'>*</b>", "");
                        this.labelForm[name].setValue(label + "<b style='color:red' class='require_qxnw'>*</b>");
                    } else {
                        if (typeof this.labelForm[name] != 'undefined') {
                            var label = this.labelForm[name].getValue().replace("<b style='color:red' class='require_qxnw'>*</b>", "");
                            this.labelForm[name].setValue(label.replace("<b style='color:red' class='require_qxnw'>*</b>", ""));
                        } else {
                            var label = this.labelUi[name].getValue().replace("<b style='color:red' class='require_qxnw'>*</b>", "");
                            this.labelUi[name].setValue(label.replace("<b style='color:red' class='require_qxnw'>*</b>", ""));
                        }
                    }
                    break;
                }
            }
        },
        validateForm: function validateForm() {
            return this.validate();
        },
        validate: function validate() {
            var self = this;
            var fields = self.getFields();
            var r = self.getRecord();
            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].name;
                var required = fields[i].required;
                var mode = fields[i].mode;
                var type = fields[i].type;
                var label = fields[i].label;
                var valid = true;

                try {
                    if (type != "startGroup" && type != "endGroup") {
                        var minCharacteres = self.ui[name].getUserData("minCharacteres");
                        if (minCharacteres != null) {
                            if (typeof required == 'undefined' || required == null) {
                                required = false;
                            }
                            if (self.ui[name].isEnabled() == true && required == true) {
                                var valMin = self.ui[name].getValue();
                                if (valMin == null) {
                                    valMin = "";
                                }
                                if (valMin.length < minCharacteres) {
                                    valid = false;
                                    var msg = self.tr("Se requiere información mínima ");
                                    self.ui[name].setValid(valid);
                                    if (!valid) {
                                        self.ui[name].setInvalidMessage(msg);
                                        if (qxnw.config.getShakeOnValidate()) {
                                            qxnw.animation.startEffect("shake", self);
                                        }
                                        if (self.ui[name].isFocusable()) {
                                            self.ui[name].focus();
                                        }
                                        if (qxnw.config.getShowInformationOnValidate() && msg != "") {
                                            var call = function () {
                                                if (self.ui[name].isFocusable()) {
                                                    self.ui[name].focus();
                                                }
                                            };
                                            qxnw.utils.information(msg + self.tr(" para el campo ") + label, call);
                                        }
                                        return valid;
                                    }
                                }
                            } else {
                                self.ui[name].setValid(true);
                            }
                        }
                    }
                } catch (e) {
                    qxnw.utils.nwconsole(e);
                }

                try {
                    if (type == "dateField" && required == true) {
                        valid = self.ui[name].validate();
                        if (!valid) {
                            self.ui[name].setInvalidMessage(msg);
                            if (qxnw.config.getShakeOnValidate()) {
                                qxnw.animation.startEffect("shake", self);
                            }
                            if (self.ui[name].isFocusable()) {
                                self.ui[name].focus();
                            }
                            if (qxnw.config.getShowInformationOnValidate() && msg != "") {
                                var call = function () {
                                    if (self.ui[name].isFocusable()) {
                                        self.ui[name].focus();
                                    }
                                };
                                qxnw.utils.information(msg + self.tr(" para el campo ") + label, call);
                            }
                            return valid;
                        } else {
                            self.ui[name].setValid(true);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }

                if (required) {

                    var msg = self.tr(" no puede estar vacío.");
                    if (type == "textFieldSearch" || type == "tokenField" || type == "selectTokenField" || type == "selectListCheck") {
                        msg = self.tr(" no puede estar vacío.");
                    }
                    if (typeof label == 'undefined' || label == undefined) {
                        return false;
                    }
                    label = label.replace("<b style='color:red' class='require_qxnw'>*</b>", "");
                    label = label.replace("<strong>", "");
                    label = label.replace("</strong>", "");
                    self.ui[name].setInvalidMessage(label + msg);

                    switch (type) {
                        case "dateField":
                            if (r[name] == null || r[name] == '') {
                                valid = false;
                                break;
                            }
                            var di = r[name].split("-");
                            if (di.length < 3) {
                                valid = false;
                            }
                            break;
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
                        case "signer":
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

                            if (typeof r[name] == "string") {
                                r[name] = r[name].trim();
                            }

                            var haveSome = false;
                            var isMoney = false;
                            var isInteger = false;
                            var isString = false;

                            if (typeof mode != 'undefined') {
                                if (mode != null) {
                                    var arrMode = mode.split(".");
                                    for (var ia = 0; ia < arrMode.length; ia++) {
                                        if (arrMode[ia] == "money") {
                                            isMoney = true;
                                            haveSome = true;
                                            break;
                                        } else if (arrMode[ia] == "integer") {
                                            isInteger = true;
                                            haveSome = true;
                                            break;
                                        } else if (arrMode[ia] == "string") {
                                            isString = true;
                                            haveSome = true;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (!haveSome) {
                                if (r[name] == null || r[name] === '') {
                                    valid = false;
                                }
                            } else {
                                if (isMoney) {
                                    if (r[name] == null || r[name] === '' || r[name] === ".00" || r[name] === ".") {
                                        valid = false;
                                    }
                                } else if (isInteger) {
                                    if (r[name] == null || r[name] === '') {
                                        valid = false;
                                    }
                                } else if (isString) {
                                    if (r[name] == null || r[name] === '') {
                                        valid = false;
                                    }
                                }
                            }
                            break;
                        case "textFieldSearch":
                            if (r[name] == null || r[name] == '' || r[name] == ".00" || r[name] == ".") {
                                valid = false;
                            }
                            if (self.ui[name].isEnabled()) {
                                valid = false;
                                msg = self.tr(" no es válido.");
                                self.ui[name].setInvalidMessage(label + msg);
                            }
                            break;
                        case "uploader_multiple":
                            if (r[name].length == 0) {
                                valid = false;
                            }
                            break;
                        case "uploader":
                            if (r[name] == null || r[name] == '0' || r[name] == '') {
                                valid = false;
                            }
                            break;
                        case "textArea":
                            if (r[name] == null || r[name] == '') {
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
                        if (self.ui[name].isFocusable()) {
                            self.ui[name].focus();
                        }
                        if (qxnw.config.getShowInformationOnValidate() && msg != "") {
                            var call = function () {
                                if (self.ui[name].isFocusable()) {
                                    self.ui[name].focus();
                                }
                            };
                            qxnw.utils.information(label + msg, call);
                        }
                        return valid;
                    }
                }
                if (typeof mode != 'undefined') {
                    if (mode != null) {
                        var arrMode = mode.split(".");
                        var msg = "";
                        for (var ia = 0; ia < arrMode.length; ia++) {
                            switch (arrMode[ia]) {
                                case "numeric":
                                    if (r[name] != null && r[name] != '') {
                                        if (isNaN(r[name])) {
                                            valid = false;
                                            msg = label + self.tr(" debe ser un número con estructura numérica lógica");
                                            self.ui[name].setInvalidMessage(msg);
                                            self.ui[name].setValid(valid);
                                            self.ui[name].focus();
                                            break;
                                        }
//                                        else {
//                                            var lastChar = r[name].toString().substr(r[name].toString().length - 1);
//                                            if (lastChar == ".") {
//                                                valid = false;
//                                                msg = label + self.tr(" debe ser un número con estructura numérica lógica");
//                                                self.ui[name].setInvalidMessage(msg);
//                                                self.ui[name].setValid(valid);
//                                                self.ui[name].focus();
//                                                break;
//                                            }
//                                        }
                                    }
                                    break;
                                case "integer":
                                    if (!isNaN(r[name]) && r[name] != null && required) {
                                        if (!qxnw.utils.validateIsInteger(r[name])) {
                                            valid = false;
                                            msg = label + self.tr(" debe ser un número entero, sin decimales");
                                            self.ui[name].setInvalidMessage(msg);
                                            self.ui[name].setValid(valid);
                                            self.ui[name].focus();
                                        }
                                        break;
                                    }
                                case "string":
                                    if (r[name] != "" && required) {
                                        if (!qxnw.utils.validateIsString(r[name])) {
                                            valid = false;
                                            msg = label + self.tr(" debe ser un texto");
                                            self.ui[name].setInvalidMessage(msg);
                                            self.ui[name].setValid(valid);
                                            self.ui[name].focus();
                                        }
                                        break;
                                    }
                                case "email":
                                    if (r[name] != "" && required) {
                                        if (!qxnw.utils.validateIsEmail(r[name])) {
                                            valid = false;
                                            msg = label + self.tr(" debe ser un correo electrónico válido");
                                            self.ui[name].setInvalidMessage(msg);
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
        setMinCharacterByTypeOnValidate: function setMinCharacterByTypeOnValidate(type, max) {
            var self = this;
            var fields = self.getFields();
            for (var i = 0; i < this.__fields.length; i++) {
                if (this.__fields[i].type == type) {
                    var name = fields[i].name;
                    self.ui[name].setUserData("minCharacteres", max);
                }
            }
        },
        setMaxCharacterByType: function setMaxCharacterByType(type, max) {
            var self = this;
            var fields = self.getFields();
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].type == type) {
                    var name = fields[i].name;
                    self.ui[name].setUserData("maxCharacteres", max);
                    self.ui[name].addListener("keypress", function (e) {
                        if (this.getValue() != null) {
                            if (this.getValue().length > this.getUserData("maxCharacteres")) {
                                this.setValue(this.getUserData("oldValue"));
                                this.setUserData("oldValue", this.getUserData("oldValue"));
                            }
                            this.setUserData("oldValue", this.getValue());
                        }
                    });
                }
            }
        },
        setNoFilter: function setNoFilter(nameWidget) {
            this.ui[nameWidget].setFilter(/[^\'\\|]/g);
        },
        getFilterRegExp: function getFilterRegExp(type) {
            this._getFilterRegExp(type);
        },
        _getFilterRegExp: function _getFilterRegExp(type) {
            var filterRegExp;
            switch (type) {
                case "money":
                    filterRegExp = /[0-9$.,]+/;
                    break;
                case "string" :
                    filterRegExp = /(?:(?!'))[\D ]+/;
                    break;
                case "numeric" :
                    filterRegExp = /[0-9.]+/;
                    break;
                case "integer" :
                    filterRegExp = /[0-9-]+/;
                    break;
                case "integer_positive" :
                    filterRegExp = /[0-9]+/;
                    break;
                case "email" :
                    filterRegExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    break;
                case "lowerCase" :
                    filterRegExp = /(?:(?!'))[a-z]/g;
                    break;
                case "upperCase" :
                    filterRegExp = /(?:(?!'))[A-Z]/g;
                    break;
                case "special_characteres" :
                    filterRegExp = qxnw.userPolicies.getRegexSpecialCharacteres();
                    break;
            }
            return filterRegExp;
        },
        createFields: function createFields(type, name, label, mode, icon) {
            var self = this;
            var modeMoney = false;
            switch (type) {
                case "ocrReader":
                    self.ui[name] = new qxnw.widgets.ocrReaderButton();
                    break;
                case "spacer":
                    self.ui[name] = new qx.ui.core.Spacer();
                    break;
                case "signer":
                    self.ui[name] = new qxnw.widgets.signer();
                    break;
                case "canvasWriter":
                    self.ui[name] = new qxnw.widgets.signer();
                    break;
                case "dynamicImage":
                    self.ui[name] = new qxnw.widgets.dynamicImage();
                    break;
                case "recorder":
                    //TODO: en stand by por retraso de los navegadores en HTML5
                    self.ui[name] = new qxnw.widgets.recorder();
                    break;
                case "address":
                    self.ui[name] = new qxnw.widgets.addressWidget("co");
                    break;
                case "addressV2":
                    self.ui[name] = new qxnw.widgets.addressWidgetV2();
                    break;
                case "imageSelector":
                    self.ui[name] = new qxnw.widgets.imageSelector();
                    break;
                case "uploader_multiple":
                    var fullPath = false;
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(".");
                        var isCreatedWidget = false;
                        var randomName = false;
                        var destination = "";
                        for (var i = 0; i < arrMode.length; i++) {
                            switch (arrMode[i]) {
                                case "fullPath":
                                    fullPath = true;
                                    break;
                                case "rename":
                                    randomName = true;
                                    break;
                                case "rename_random":
                                    randomName = "rename_random";
                                    break;
                                default:
                                    try {
                                        var dz = arrMode[i].split("=");
                                        if (dz[0] == "destination") {
                                            if (typeof dz[1] != "undefined") {
                                                destination = dz[1];
                                            }
                                        }
                                    } catch (e) {
                                        qxnw.utils.nw_console(e);
                                    }
                                    break;
                            }
                        }
                    }
                    if (destination !== "") {
                        self.ui[name] = new qxnw.upload_multiple.init(self.tr("Subir archivo(s)"), qxnw.config.execIcon("utilities-graphics-viewer", "apps"), fullPath, randomName, destination, self.getAppWidgetName());
                    } else {
                        self.ui[name] = new qxnw.upload_multiple.init(self.tr("Subir archivo(s)"), qxnw.config.execIcon("utilities-graphics-viewer", "apps"), fullPath, randomName, false, self.getAppWidgetName());
                    }
                    break;
                case "colorButton":
                    self.ui[name] = new qxnw.widgets.colorButton();
                    break;
                case "label":
                    if (typeof label !== 'undefined') {
                        if (typeof label.classname !== 'undefined') {
                            if (label.classname === "qx.locale.LocalizedString") {
                                if (label.getMessageId() === "") {
                                    label = "";
                                }
                            }
                        }
                    }
                    self.ui[name] = new qx.ui.basic.Label(label).set({
                        rich: true
                    });
                    break;
                case "colorPopup":
                    self.ui[name] = new qx.ui.control.ColorSelector();
                    self.setValue = function setValue(val) {

                    };
                    self.getValue = function getValue() {

                    };
                    break;
                case "camera":
                    var height = 250;
                    var width = 400;
                    var isSimple = false;
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(":");
                        if (typeof arrMode == 'array' || typeof arrMode == "object") {
                            if (arrMode.length > 0) {
                                if (arrMode[0] == "size") {
                                    if (arrMode[1] != 'undefined') {
                                        var dat = arrMode[1].split(",");
                                        try {
                                            width = parseInt(dat[0]);
                                            height = parseInt(dat[1]);
                                        } catch (e) {

                                        }
                                    }
                                } else if (arrMode[0] == "simple") {
                                    isSimple = true;
                                }
                            }
                        }
                    }
                    if (isSimple == true) {
                        self.ui[name] = new qxnw.camera(height, width, "simple");
                    } else {
                        self.ui[name] = new qxnw.camera(height, width);
                    }
                    self.ui[name].addListener("upload", function (e) {
                        this.setValue(e.getData());
                    });
                    break;
                case "ckeditor":
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(".");
                        for (var i = 0; i < arrMode.length; i++) {
                            if (arrMode[i] == "simple") {
                                self.ui[name] = new qxnw.widgets.ckeditor('', 0, "simple");
                            } else if (arrMode[i] == "cero") {
                                self.ui[name] = new qxnw.widgets.ckeditor('', 0, "cero");
                            } else {
                                self.ui[name] = new qxnw.widgets.ckeditor();
                            }
                            break;
                        }
                    } else {
                        self.ui[name] = new qxnw.widgets.ckeditor();
                    }
                    self.ui[name].setParentCKEditor(self);
                    self.ui[name].setMinHeight(370);
                    break;
                case "meet":
                    self.ui[name] = new qxnw.meet.widget();
                    break;
                case "uploader":
                    var fullPath = false;
                    var addToLabel = false;
                    var sizes = false;
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(".");
                        var isCreatedWidget = false;
                        var randomName = false;
                        var server = false;
                        var destination = "";
                        for (var i = 0; i < arrMode.length; i++) {
                            var ri = arrMode[i];
                            ri = ri.split(":");
                            switch (ri[0]) {
                                case "size":
                                    addToLabel = self.tr("Max: ");
                                    addToLabel += ri[1];
                                    sizes = ri[1];
                                    break;
                                case "fullPath":
                                    fullPath = true;
                                    break;
                                case "rename":
                                    randomName = true;
                                    break;
                                case "rename_random":
                                    randomName = "rename_random";
                                    break;
                                case "server":
                                    server = true;
                                    break;
                                default:
                                    try {
                                        var dz = arrMode[i].split("=");
                                        if (dz[0] == "destination") {
                                            if (typeof dz[1] != "undefined") {
                                                destination = dz[1];
                                            }
                                        }
                                    } catch (e) {
                                        qxnw.utils.nw_console(e);
                                    }
                                    break;
                            }
                        }
                    }
                    if (destination !== "") {
                        self.ui[name] = new qxnw.uploader(fullPath, randomName, false, addToLabel, false, destination, self.getAppWidgetName(), sizes);
                    } else {
                        self.ui[name] = new qxnw.uploader(fullPath, randomName, false, addToLabel, false, false, self.getAppWidgetName(), sizes);
                    }
                    if (server === true) {
                        self.ui[name].setOpenServer(true);
                    }
                    break;
                case "uploader_images":
                    self.ui[name] = new qxnw.widgets.imageSelector();
                    break;
                case "timeField":
                    self.ui[name] = new qxnw.widgets.timeField();
                    break;
                case "radioButton":
                    self.ui[name] = new qx.ui.form.RadioButton();
                    break;
                case "textFieldSearch":
                    self.ui[name] = new qxnw.widgets.textFieldSearch();
                    if (typeof mode != 'undefined') {
                        self.ui[name].setMode(mode, self.getAppWidgetName());
                    } else {
                        self.ui[name].setMode("search", self.getAppWidgetName());
                    }
                    isCreatedWidget = true;
                    self.ui[name].getChildControl("textfield").addListener("changeEnabled", function (e) {
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
                    break;
                case "button":
                    self.ui[name] = new qxnw.widgets.button(label);
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(":");
                        if (typeof arrMode[0] != 'undefined' && arrMode[0] == "icon") {
                            if (typeof arrMode[1] != 'undefined') {
                                self.ui[name].setIcon(arrMode[1]);
                            }
                        }
                    }
                    if (typeof icon != 'undefined' && icon != null) {
                        self.ui[name].setIcon(icon);
                    }
                    break;
                case "textField":
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(".");
                        var isCreatedWidget = false;
                        for (var i = 0; i < arrMode.length; i++) {
                            if (arrMode[i] == "search") {
                                if (!isCreatedWidget) {
                                    self.ui[name] = new qxnw.widgets.textField().set({
                                        minWidth: 100
                                    });
                                    self.ui[name].setMode("search", self.getAppWidgetName());
                                    isCreatedWidget = true;
                                    self.ui[name].getChildControl("textfield").addListener("changeEnabled", function (e) {
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
                                }
                            } else if (arrMode[i] == "searchOnDb") {
                                if (!isCreatedWidget) {
                                    self.ui[name] = new qxnw.widgets.textField().set({
                                        minWidth: 100
                                    });
                                    isCreatedWidget = true;
                                    self.ui[name].getChildControl("textfield").addListener("changeEnabled", function (e) {
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
                                }
                            } else if (arrMode[i] == "money") {
                                if (!isCreatedWidget) {
                                    modeMoney = true;
                                    self.ui[name] = new qxnw.widgets.NumericField();
                                    isCreatedWidget = true;
                                }
                            } else {
                                if (!isCreatedWidget) {
                                    self.ui[name] = new qxnw.widgets.normalTextField().set({
                                        minWidth: 100
                                    });
                                    isCreatedWidget = true;
                                    self.ui[name].addListener("changeEnabled", function (e) {
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
                                }
                            }
                            var modes = arrMode[i].split(":");
                            if (modes.length > 0) {
                                if (typeof modes[0] != 'undefined') {
                                    if (modes[0] != null) {
                                        if (modes[0] != '') {
                                            if (modes[0] == "maxCharacteres") {
                                                self.ui[name].setMaxLength(parseInt(modes[1]));
                                                continue;
                                            } else if (modes[0] == "minCharacteres") {
                                                self.ui[name].setMinLength(parseInt(modes[1]));
                                                continue;
                                            }
                                        }
                                    }
                                }
                            }
                            self.ui[name].setUserData("key", name);
                            if (arrMode[i] == "Integer" || arrMode[i] == "integer") {
                                self.ui[name].setFilter(self._getFilterRegExp("integer"));
                                continue;
                            } else if (arrMode[i] == "String" || arrMode[i] == "string") {
                                self.ui[name].setFilter(self._getFilterRegExp("string"));
                                continue;
                            } else if (arrMode[i] == "numeric" || arrMode[i] == "Numeric") {
                                self.ui[name].setFilter(self._getFilterRegExp("numeric"));
                                self.ui[name].addListener("keypress", function (e) {
                                    var key = e.getKeyIdentifier();
                                    var val = this.getValue();
                                    if (key == ".") {
                                        if (val != null) {
                                            if (val.indexOf(".") != -1) {
                                                e.stop();
                                                return;
                                            }
                                            var point = val.substr(val.length - 1);
                                            if (point == ".") {
                                                e.stop();
                                            }
                                        }
                                    }
                                });
                                continue;
                            } else if (arrMode[i] == "lowerCase") {
                                self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                                self.ui[name].addListener("input", function (e) {
                                    var upper = new qx.type.BaseString(this.getValue());
                                    this.setValue(upper.toLowerCase());
                                });
                                continue;
                            } else if (arrMode[i] == "upperCase") {
                                //self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                                self.ui[name].addListener("appear", function () {
                                    this.getContentElement().addClass("qxnw_textarea_uppercase");
                                });
//                                self.ui[name].addListener("input", function (e) {
//                                    var upper = new qx.type.BaseString(this.getValue());
//                                    this.setValue(upper.toUpperCase());
//                                });
                                continue;
                            } else if (arrMode[i] == "speech") {
                                self.ui[name].getContentElement().setAttribute("x-webkit-speech", true);
                                self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                                continue;
                            } else if (arrMode[i] == "readOnlyCopy") {
                                self.ui[name].setSelectable(true);
                                self.ui[name].setReadOnly(true);
                                self.ui[name].setFocusable(true);
                                continue;
                            } else if (arrMode[i] == "email") {
                                self.ui[name].addListener("focusout", function (e) {
                                    var v = this.getValue();
                                    if (v == null || v == "") {
                                        return;
                                    }
                                    if (!qxnw.utils.validateIsEmail(v)) {
                                        if (qxnw.config.getShakeOnValidate()) {
                                            qxnw.animation.startEffect("shake", self);
                                        }
                                        self.ui[name].setInvalidMessage(label + self.tr(" debe ser un correo electrónico válido"));
                                        self.ui[name].setValid(false);
                                    } else {
                                        self.ui[name].setValid(true);
                                    }
                                });
                                continue;
                            } else {
                                try {
                                    self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        }
                    } else {
                        self.ui[name] = new qxnw.widgets.normalTextField().set({
                            minWidth: 100
                        });
                        self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                        self.ui[name].addListener("changeEnabled", function (e) {
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
                    }
                    break;
                case "not_visible":
                    self.ui[name] = new qx.ui.form.TextField();
                    break;
                case "serial":
                    self.ui[name] = new qx.ui.form.TextField();
                    break;
                case "selectBox":
//                    self.ui[name] = new qx.ui.form.VirtualSelectBox();
                    self.ui[name] = new qxnw.fields.selectBox(self);
                    self.ui[name].set({
                        maxHeight: 27,
                        minHeight: 27
                    });
                    self.ui[name].setUserData("name", name);
                    break;
                case "passwordField":
                    self.ui[name] = new qxnw.widgets.password();
                    self.ui[name].addListener("changeEnabled", function (e) {
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
                    self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                    self.ui[name].getContentElement().setAttribute("autocomplete", "password");
                    break;
                case "dateField":
                    self.ui[name] = new qxnw.widgets.dateField();
                    break;
                case "dateTimeField":
                    self.ui[name] = new qxnw.widgets.dateTimeField();
                    self.ui[name].setDateFormat(new qx.util.format.DateFormat("yyyy-MM-dd"));
                    self.__haveDateTimeField.push(name);
                    break;
                case "dateChooser":
                    self.ui[name] = new qx.ui.control.DateChooser();
                    break;
                case "textArea":
                    self.ui[name] = new qxnw.widgets.textArea();
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(".");
                        for (var i = 0; i < arrMode.length; i++) {
                            if (arrMode[i] == "noSpellCheck") {
                                self.ui[name].getContentElement().setAttribute("spellcheck", false);
                            }
                            if (arrMode[i] == "readOnlyCopy") {
                                self.ui[name].setExecuteChangeEnabled(false);
                                self.ui[name].setSelectable(true);
                                self.ui[name].setReadOnly(true);
                                self.ui[name].setFocusable(true);
                            }
                            var modes = arrMode[i].split(":");
                            if (modes.length > 0) {
                                if (typeof modes[0] != 'undefined') {
                                    if (modes[0] != null) {
                                        if (modes[0] != '') {
                                            if (modes[0] == "maxCharacteres") {
                                                self.ui[name].setMaxLength(parseInt(modes[1]));
                                                continue;
                                            }
                                        }
                                    }
                                }
                            }
                            if (arrMode[i] == "Integer" || arrMode[i] == "integer") {
                                self.ui[name].setFilter(self._getFilterRegExp("integer"));
                            } else if (arrMode[i] == "String" || arrMode[i] == "string") {
                                self.ui[name].setFilter(self._getFilterRegExp("string"));
                            } else if (arrMode[i] == "speech" || arrMode[i] == "Speech") {
                                self.ui[name].getContentElement().setAttribute("x-webkit-speech", true);
                                self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                            } else if (arrMode[i] == "numeric" || arrMode[i] == "Numeric") {
                                self.ui[name].setFilter(self._getFilterRegExp("numeric"));
                            } else if (arrMode[i] == "lowerCase") {
                                self.ui[name].addListener("input", function (e) {
                                    var upper = new qx.type.BaseString(this.getValue());
                                    this.setValue(upper.toLowerCase());
                                });
                            } else if (arrMode[i] == "upperCase") {
                                self.ui[name].addListener("appear", function () {
                                    this.getContentElement().addClass("qxnw_textarea_uppercase");
                                });
                                //TODO: ANDRESF, SE CAMBIA POR LA CLASE
//                                self.ui[name].addListener("input", function (e) {
//                                    var upper = new qx.type.BaseString(this.getValue());
//                                    this.setValue(upper.toUpperCase());
//                                });
                            }
                        }
                    }
                    break;
                case "spinner":
                    self.ui[name] = new qx.ui.form.Spinner(-1000000000, 0, 1000000000);
                    self.ui[name].set({
                        maxHeight: 25
                    });
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(",");
                        for (var i = 0; i < arrMode.length; i++) {
                            var splitted = arrMode[i].split(":");
                            if (typeof splitted[0] != "undefined") {
                                if (splitted[0] == "maximum") {
                                    if (typeof splitted[1] != "undefined") {
                                        self.ui[name].set({
                                            maximum: parseInt(splitted[1])
                                        });
                                    }
                                }
                                if (splitted[0] == "minimum") {
                                    if (typeof splitted[1] != "undefined") {
                                        self.ui[name].set({
                                            minimum: parseInt(splitted[1])
                                        });
                                    }
                                }
                            }
                        }
                    }
                    self.ui[name].addListener("keypress", function (e) {
                        var val = this.getValue();
                        if (e.getKeyIdentifier(e) == "Backspace") {
                            if (val != null) {
                                if (val != "") {
                                    if (val != 0) {
                                        if (val < 10) {
                                            this.setValue(0);
                                        }
                                    }
                                }
                            }
                        }
                    });
                    break;
                case "tokenField":
                    self.ui[name] = new qxnw.tokenField();
                    self.ui[name].setSelectionMode('single');
                    break;
                case "checkBox":
                    self.ui[name] = new qxnw.widgets.checkBox();
                    break;
                case "selectTokenField":
                    self.ui[name] = new qxnw.widgets.selectTokenField();
                    self.ui[name].setUniqueName(self.getAppWidgetName() + name + type + label);
                    self.ui[name].setSelectionMode('single');
                    self.ui[name].set({
                        minHeight: 25
                    });
                    // se quita porque no se ven los items - maxHeight: 25, 
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(".");
                        var isCreatedWidget = false;
                        for (var i = 0; i < arrMode.length; i++) {
                            if (arrMode[i] == "Integer" || arrMode[i] == "integer") {
                                self.ui[name].setFilter(self._getFilterRegExp("integer"));
                                continue;
                            } else if (arrMode[i] == "String" || arrMode[i] == "string") {
                                self.ui[name].setFilter(self._getFilterRegExp("string"));
                                continue;
                            } else if (arrMode[i] == "gun") {
                                self.ui[name].setIsGun(true);
                                continue;
                            } else if (arrMode[i] == "numeric" || arrMode[i] == "Numeric") {
                                self.ui[name].setFilter(self._getFilterRegExp("numeric"));
                                continue;
                            } else if (arrMode[i] == "lowerCase") {
                                self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                                self.ui[name].addListener("input", function (e) {
                                    var upper = new qx.type.BaseString(this.getValue());
                                    this.setValue(upper.toLowerCase());
                                });
                                continue;
                            } else if (arrMode[i] == "upperCase") {
                                self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                                self.ui[name].addListener("input", function (e) {
                                    var upper = new qx.type.BaseString(this.getValue());
                                    this.setValue(upper.toUpperCase());
                                });
                                continue;
                            } else if (arrMode[i] == "speech") {
                                self.ui[name].getContentElement().setAttribute("x-webkit-speech", true);
                                self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                                continue;
                            } else if (arrMode[i] == "email") {
                                self.ui[name].addListener("focusout", function (e) {
                                    var v = this.getValue();
                                    if (!qxnw.utils.validateIsEmail(v)) {
                                        if (qxnw.config.getShakeOnValidate()) {
                                            qxnw.animation.startEffect("shake", self);
                                        }
                                        self.ui[name].setInvalidMessage(label + self.tr(" debe ser un correo electrónico válido"));
                                        self.ui[name].setValid(false);
                                        self.ui[name].focus();
                                    } else {
                                        self.ui[name].setValid(true);
                                    }
                                });
                                continue;
                            } else {
                                try {
                                    self.ui[name].setFilter(self._getFilterRegExp("special_characteres"));
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        }
                    }
                    break;
                case "image":
                    self.ui[name] = new qxnw.widgets.imageViewer();
                    break;
                case "listCheck":
                    self.ui[name] = new qxnw.widgets.list();
                    break;
                case "list":
                    self.ui[name] = new qx.ui.form.List();
                    self.ui[name].populate = function (method, exec, data) {
                        var self = this;
                        var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method);
                        rpc.setAsync(true);
                        var func = function (r) {
                            self.removeAll();
                            for (var i = 0; i < r.length; i++) {
                                var d = r[i];
                                var item = new qx.ui.form.CheckBox(d["nombre"]).set({
                                    rich: true
                                });
                                item.setValue(d["value"] == "true" || d["value"] == true || d["value"] == "t" ? true : false);
                                item.setModel(d);
                                self.add(item);
                            }
                        };
                        rpc.exec(exec, data, func);
                    };
                    break;
                case "radioCheck":
                    self.ui[name] = new qx.ui.form.RadioButtonGroup();
                    self.ui[name].populate = function (method, exec, data) {
                        var self = this;
                        var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), method);
                        rpc.setAsync(true);
                        var func = function (r) {
                            self.removeAll();
                            for (var i = 0; i < r.length; i++) {
                                var d = r[i];
                                var item = new qx.ui.form.RadioButton(d["nombre"]);
                                item.setValue(d["value"] == "true" || d["value"] == true || d["value"] == "t" ? true : false);
                                item.setModel(d);
                                self.add(item);
                            }
                        };
                        rpc.exec(exec, data, func);
                    };
                    break;
                case "selectListCheck":
                    self.ui[name] = new qxnw.widgets.selectListCheck();
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(".");
                        for (var i = 0; i < arrMode.length; i++) {
                            var arr = arrMode[i].split(":");
                            if (arr[0] == "maxItems" && typeof arr[1] != 'undefined') {
                                self.ui[name].setMaxItems(arr[1]);
                            }
                        }
                    }
                    break;
                default:
                    qxnw.utils.error(self.tr("Error en el tipo de objeto:") + type + ". Nombre: " + name);
                    break;
            }

            if (type == "spacer") {
                return;
            }
            if (type == "dateTimeField" || type == "camera") {
                self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
            } else if (type == "timeField") {
                self.ui[name].setAllTabIndex(qxnw.config.getActualTabIndex());
            } else if (type == "uploader_multiple") {
                self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
                self.ui[name].setAllTabIndex(qxnw.config.getActualTabIndex());
            } else if (type == "addressV2") {
                self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
            } else if (type == "address") {
                self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
                self.ui[name].setAllTabIndex(qxnw.config.getActualTabIndex());
            } else if (modeMoney == true) {
                self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
                self.ui[name].setAllTabIndex(qxnw.config.getActualTabIndex());
            } else if (typeof self.ui[name].isFocusable != 'undefined' && self.ui[name].isFocusable() && self.ui[name].isVisible()) {
                self.ui[name].setTabIndex(qxnw.config.getActualTabIndex());
            }
        },
        getFieldTypeByName: function getFieldTypeByName(name) {
            var fields = this.getFields();
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].name == name) {
                    return fields[i].type;
                }
            }
        },
        hideField: function hideField(field) {
            this.setFieldVisibility(field, "excluded");
        },
        setFieldVisibility: function setFieldVisibility(field, visible) {
            var content = field.getLayoutParent();
            content.setVisibility(visible);

            if (typeof field.setParentCKEditor !== 'undefined') {
                var cont = content.getLayoutParent();
                cont.setVisibility(visible);
            }

            this.fireEvent("NWChangeFieldVisibility");
        },
        setFieldWidth: function setFieldWidth(field, width) {
            var content = field.getLayoutParent();
            content.setWidth(width);
        },
        _onPopupChangeVisibility: function _onPopupChangeVisibility(e) {
            return;
        },
        serializeFields: function serializeFields(fields) {
            var self = this;
            var oldName = null;
            if (typeof fields == 'undefined') {
                return;
            }
            var widget_dates = false;
            for (var i = 0; i < fields.length; i++) {
                if (typeof fields[i] === 'undefined') {
                    continue;
                }
                var name = fields[i].name;

                if (name === "widget_dates") {
                    continue;
                }

                var label = fields[i].label;
                var type = fields[i].type;
                var mode = fields[i].mode;
                var validation = fields[i].validation;
                var required = fields[i].required;
                if (required == 1) {
                    required = true;
                }
                if (required == 0) {
                    required = false;
                }
                var enabled = fields[i].enabled;
                if (type == "startGroup") {
                    self.__fields.push(fields[i]);
                    continue;
                }
                if (type == "endGroup") {
                    self.__fields.push(fields[i]);
                    continue;
                }
                if (typeof fields[i].visible == 'undefined') {
                    fields[i].visible = true;
                }
                var enabled = typeof fields[i].enabled == 'undefined' ? true : fields[i].enabled;
                var icon = typeof fields[i].icon == 'undefined' ? null : fields[i].icon;

                //SE CREAN LOS UI
                self.createFields(type, name, label, mode, icon);

                if (fields[i].readOnly) {
                    self.ui[name].setReadOnly(true);
                }
                if (required === true && type != "button") {
                    self.ui[name].setRequired(required);
                }
                if (typeof validation != 'undefined') {
                    try {
                        self.__manager.setValidator(self.ui[name], validation);
                    } catch (e) {
                    }
                }

                if (typeof fields[i].tabIndex != 'undefined') {
                    self.ui[name].setTabIndex(fields[i].tabIndex);
                }

                if (enabled == "false" || enabled == false) {
                    self.ui[name].setEnabled(false);
                }
                try {
                    if (type == "selectTokenField" || type == "selectListCheck" || type == "dateTimeField" || type == "timeField" || type == "uploader_multiple") {
//                        self.ui[name].setAllTabIndex(self.__tabIndex++);
                    } else if (type == "uploader") {
//                        self.ui[name].setTabIndex(self.__tabIndex++);
                    } else if (type == "textField" && mode == "money") {
//                        self.ui[name].setAllTabIndex(self.__tabIndex++);
                    } else {
                        if (type != "radioCheck") {
                            if (type != "ckeditor") {
                                if (mode == "search") {
//                                    self.ui[name].getChildControl('textfield').setTabIndex(self.__tabIndex++);
                                } else {
                                    try {
//                                        self.ui[name].setTabIndex(self.__tabIndex++);
                                    } catch (e) {

                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    qxnw.utils.error(e);
                }
                if (i + 1 == fields.length) {
                    try {
                        if (fields[i].visible != true) {
                            self.ui[oldName].addListener("keypress", function (e) {
                                var key = e.getKeyIdentifier();
                                if (key == "Enter") {
                                    self.ui["accept"].getFocusElement().focus();
                                }
                            });
                        }
                    } catch (e) {

                    }
                }
                oldName = name;
                this.count++;
                self.__fields.push(fields[i]);
            }
        }
        ,
        getSavedValue: function getSavedValue(key, text) {
            var self = this;
            var data = qxnw.local.getData(key + self.getAppWidgetName());
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].toLowerCase().indexOf(text.toLowerCase()) != -1) {
                        return data[i];
                    }
                }
            }
            return false;
        }
        ,
        getManagerValidator: function getManagerValidator() {
            return this.__manager;
        },
        createButtons: function createButtons() {
            var self = this;
            this.buttonAccept = new qx.ui.form.Button(self.tr("Aceptar"), qxnw.config.execIcon("dialog-apply"));
            self.ui["accept"] = this.buttonAccept;
            this.buttonCancel = new qx.ui.form.Button(self.tr("Cancelar"), qxnw.config.execIcon("dialog-close"));
            self.ui["cancel"] = this.buttonCancel;
            //self.addListener("appear", function() {
            //    var colorMgr = qx.theme.manager.Color.getInstance();
            // self.addListener("appear", function () {
            //     var colorMgr = qx.theme.manager.Color.getInstance();
//                var nuevoColor = colorMgr.resolve("window-caption-active-start");
//                var nuevoColor2 = colorMgr.resolve("window-caption-active-end");
            // qx.bom.element.Class.add(self.buttonsContainer.getContentElement().getDomElement(), "pie_foot");
            //     qx.bom.element.Class.add(this.buttonAccept.getContentElement().getDomElement(), "button_accept");

//                qx.bom.element.Style.set(self.getChildControl("pane").getContentElement().getDomElement(), "color", "#999");
//                qx.bom.element.Style.set(self.buttonsContainer.getContentElement().getDomElement(), "height", "100%");

//                qx.bom.element.Style.set(self.buttonAccept.getContentElement().getDomElement(), "background-color", nuevoColor.toString());
//                qx.bom.element.Style.set(self.buttonAccept.getContentElement().getDomElement(), "background-image", "-webkit-linear-gradient(top,  " + nuevoColor.toString() + ", " + nuevoColor.toString() + " 20%, " + nuevoColor2.toString() + ")");
//                qx.bom.element.Style.set(self.buttonAccept.getContentElement().getDomElement(), "color", "#fff");
//                qx.bom.element.Style.set(self.buttonAccept.getContentElement().getDomElement(), "padding", "10px");
//                qx.bom.element.Style.set(self.buttonAccept.getContentElement().getDomElement(), "border", "1px solid #ccc");
//                qx.bom.element.Style.set(self.buttonAccept.getContentElement().getDomElement(), "box-shadow", "rgba(0, 0, 0, 0.0980392) 0px 0px 9px 1px, rgba(0, 0, 0, 0.0980392) 0px 0px 1px");
//                qx.bom.element.Style.set(self.buttonAccept.getChildControl("label").getContentElement().getDomElement(), "color", "#fff");
//
//                qx.bom.element.Style.set(self.buttonCancel.getContentElement().getDomElement(), "border", "1px solid #ccc");
            //});
            self.areCreatedButtons = true;
        },
        /*
         * Agregar botones en la parte baja del formulario. La sintaxis es:
         * [
         * {
         *  label : "Test",
         *  icon: qxnw.config.execIcon("test"),
         *  name: "nombre_ui" (nombre para llamarlo de la forma self.ui.nombre_ui.addListener...
         * }
         * ]
         */
        addButtons: function addButtons(buttons, after) {
            var self = this;
            var hLayout = new qx.ui.layout.HBox();
            hLayout.setSpacing(4);
            if (self.buttonsContainer == null) {
                var hLayout = new qx.ui.layout.HBox();
                hLayout.setSpacing(4);
                self.buttonsContainer = new qx.ui.container.Composite(hLayout).set({
                    padding: 2,
                    maxHeight: 50
                });
                self.add(self.buttonsContainer, {flex: 0});
                self.buttonsContainer.add(new qx.ui.core.Spacer(30, 40), {flex: 1});
            }
            for (var i = 0; i < buttons.length; i++) {
                var button;
                button = new qx.ui.form.Button(buttons[i].label, buttons[i].icon);
                self.ui[buttons[i].name] = button;
                if (typeof after !== 'undefined') {
                    self.buttonsContainer.addAfter(self.ui[buttons[i].name].set({maxHeight: 30}), after);
                } else {
                    self.buttonsContainer.add(self.ui[buttons[i].name].set({maxHeight: 30}));
                }
                self.__addedButtons.push(buttons[i]);
            }
        },
        setRecord: function setRecord(r) {
            var self = this;
            var fields = this.__fields;
            var focused = false;
            if (qxnw.utils.evalue(r)) {
                for (var i = 0; i < fields.length; i++) {
                    var name = fields[i].name;
                    var type = fields[i].type;
                    var enabled = typeof fields[i].enabled == 'undefined' ? true : fields[i].enabled;
                    if (typeof fields[i].visible == 'undefined') {
                        fields[i].visible = true;
                    }
                    var items = null;
                    var ia = 0;
                    if (type == "startGroup" || type == "endGroup" || r[name] == null) {
                        continue;
                    }

                    if (typeof self.ui[name] != 'undefined') {
                        switch (type) {
                            case "image":
                                self.ui[name].setValue(r[name].toString());
                                break;
                            case "camera":
                                self.ui[name].setValue(r[name].toString());
                                self.ui[name].addImage(r[name].toString());
                                break;
                            case "ckeditor":
                                self.ui[name].setValue(r[name].toString());
                                self.ui[name].setParseValue(r[name].toString());
                                break;
                            case "timeField":
                                self.ui[name].setValue(r[name]);
                                break;
                            case "dateTimeField":
                                self.ui[name].setValue(r[name]);
                                break;
                            case "uploader_images":
                                self.ui[name].setValue(r[name]);
                                break;
                            case "checkBox":
                                if (r[name].toString() == "t" || r[name].toString() == "true") {
                                    self.ui[name].setValue(true);
                                } else if (r[name].toString() == "f" || r[name].toString() == "false") {
                                    self.ui[name].setValue(false);
                                } else if (r[name] == "") {
                                    self.ui[name].setValue(false);
                                } else if (r[name] == null) {
                                    self.ui[name].setValue(false);
                                } else if (r[name] == 0) {
                                    self.ui[name].setValue(false);
                                } else if (r[name] == 1) {
                                    self.ui[name].setValue(true);
                                } else {
                                    self.ui[name].setValue(r[name]);
                                }
                                break;
                            case "uploader":
                                if (r[name] != null && r[name] != false && r[name] != "") {
                                    r[name] = r[name].replace("/html/", "/");
                                }

                                self.ui[name].setValue(r[name]);
                                break;
                            case "colorButton":
                                self.ui[name].setValue(r[name]);
                                break;
                            case "textField":
                                if (this.tableAuto != "") {
                                    if (name == "id") {
                                        self.ui[name].setEnabled(false);
                                    }
                                }
                                if (typeof r[name] != 'undefined') {
                                    if (r[name] == null) {
                                        continue;
                                    }
                                    self.ui[name].setValue(r[name].toString());
                                }
//                            if (self.ui[name].isHidden()) {
//                                self.model["$$user_" + name] = r[name].toString();
//                            }
                                break;
                            case "tokenField":
                                if (typeof r["nombre_" + name] == 'undefined') {
                                    continue;
                                }
                                var token = {};
                                if (qxnw.utils.evalue(r[name])) {
                                    if (qxnw.utils.evalue(r["nombre_" + name])) {
                                        token["id"] = r[name];
                                        token["nombre"] = typeof r["nombre_" + name] == 'undefined' ? "" : r["nombre_" + name];
                                        self.ui[name].addToken(token, true);
                                    }
                                }
                                break;
                            case "selectTokenField":
                                if (typeof r["nombre_" + name] == 'undefined') {
                                    continue;
                                }
                                var token = {};
                                if (qxnw.utils.evalue(r[name])) {
                                    if (qxnw.utils.evalue(r["nombre_" + name])) {
                                        token["id"] = r[name];
                                        token["nombre"] = typeof r["nombre_" + name] == 'undefined' ? "" : r["nombre_" + name];
                                        self.ui[name].addToken(token, true);
                                    }
                                }
                                break;
                            case "selectBox":
                                self.ui[name].setValue(r[name]);
                                break;
                            case "ckeditor":
                                self.ui[name].setValue(r[name]);
                                break;
                            case "passwordField":
                                self.ui[name].setValue(r[name].toString());
//                            if (self.ui[name].isHidden()) {
//                                self.model["$$user_" + name] = r[name].toString();
//                            }
                                break;
                            case "dateField":
                                if (this.tableAuto != "") {
                                    if (i == 0) {
                                        self.ui[name].setEnabled(false);
                                    }
                                }
                                self.ui[name].getChildControl("textfield").setValue(r[name].toString());
                                break;
                            case "date":
                                if (this.tableAuto != "") {
                                    if (i == 0) {
                                        self.ui[name].setEnabled(false);
                                    }
                                }
                                self.ui[name].getChildControl("textfield").setValue(r[name].toString());
                                break;
                            case "spinner":
                                if (this.tableAuto != "") {
                                    if (i == 0) {
                                        self.ui[name].setEnabled(false);
                                    }
                                }
                                if (parseInt(r[name])) {
                                    self.ui[name].setValue(parseInt(r[name]));
                                }
                                break;
                            case "textArea":
                                if (this.tableAuto != "") {
                                    if (i == 0) {
                                        self.ui[name].setEnabled(false);
                                    }
                                }
                                self.ui[name].setValue(r[name].toString());
                                break;
                            case "signer":
                                if (this.tableAuto != "") {
                                    if (i == 0) {
                                        self.ui[name].setEnabled(false);
                                    }
                                }
                                self.ui[name].setValue(r[name].toString());
                                break;
                            case "canvasWriter":
                                if (this.tableAuto != "") {
                                    if (i == 0) {
                                        self.ui[name].setEnabled(false);
                                    }
                                }
                                self.ui[name].setValue(r[name].toString());
                                break;
                            case "address":
                                if (this.tableAuto != "") {
                                    if (i == 0) {
                                        self.ui[name].setEnabled(false);
                                    }
                                }
                                self.ui[name].setValue(r[name].toString());
                                break;
                            case "addressV2":
                                if (this.tableAuto != "") {
                                    if (i == 0) {
                                        self.ui[name].setEnabled(false);
                                    }
                                }
                                self.ui[name].setValue(r[name].toString());
                                break;
                            default:
//                                TODO:: LADy lo quite por que si es button o label no deberia actuar un setRecord, me sale error cuando es button;
//                                if (this.tableAuto != "") {
//                                    if (i == 0) {
//                                        self.ui[name].setEnabled(false);
//                                    }
//                                }
//                                self.ui[name].setValue(r[name].toString());
//                                
//                                
//                                
//                            if (self.ui[name].isHidden()) {
//                                self.model["$$user_" + name] = r[name].toString();
//                            }
                                break;
                        }

                    }
                    if (!focused && type != "uploader") {
                        if (fields[i].visible != "false") {
                            if (enabled) {
                                try {
                                    self.ui[name].focus();
                                } catch (e) {

                                }
                                focused = true;
                            }
                        }
                    }
                }
//                try {
//                    this.model.setE(1);
//                } catch (e) {
//
//                }
                this.e = 1;
            }
        },
        enableAll: function enableAll(bool) {
            var self = this;
            var fields = this.__fields;
            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].name;
                if (fields[i].type == "image") {
                    continue;
                }
                try {
                    self.ui[name].setEnabled(bool);
                } catch (e) {
                }
            }
            try {
                self.ui["accept"].setEnabled(bool);
            } catch (e) {

            }
//TODO: PILAS! SE DEBE DESABILITAR TODO DE LOS NAVTABLES
//            if (self.__tabView == null) {
//                return;
//            }
//            var childs = self.__tabView.getChildren();
//            for (var ia = 0; ia < childs.length; ia++) {
//                var son = childs[ia].getChildren();
//                //son[0].disableButtons();
//            }
        },
        enableDeffectButtons: function enableDeffectButtons(bool) {
            var self = this;
            self.ui["accept"].setEnabled(bool);
            self.ui["cancel"].setEnabled(bool);
        },
        createAutomaticButtons: function createAutomaticButtons() {
            this.createDeffectButtons();
        },
        createDeffectButtons: function createDeffectButtons() {
            var self = this;
            if (!self.areCreatedButtons) {
                self.createButtons();
            }
            if (!self.__areCreatedDeffectButtons) {
                if (self.buttonsContainer == null) {
                    var hLayout = new qx.ui.layout.HBox();
                    hLayout.setSpacing(4);
                    self.buttonsContainer = new qx.ui.container.Composite(hLayout).set({
                        padding: 2,
                        maxHeight: 30
                    });
                    self.add(self.buttonsContainer);
                    if (qxnw.utils.isDebug() || self.getCanPrint() == true) {
                        self.ui["printButton"] = new qx.ui.form.Button("Imprimir", qxnw.config.execIcon("document-print")).set({
                            maxWidth: 35,
                            maxHeight: 35,
                            show: "icon"
                        });
                        self.ui["printButton"].addListener("execute", function () {
                            qxnw.utils.activePrincipalSkinner(self, true);
                        });
                        self.buttonsContainer.add(self.ui["printButton"]);
                    }

                    if (self.getCreateHelpButton()) {
                        self.ui.helpButton = new qx.ui.form.Button(self.tr("Ayuda"), qxnw.config.execIcon("help-contents")).set({
                            maxWidth: 35,
                            maxHeight: 35,
                            show: "icon"
                        });
                        var tT = new qx.ui.tooltip.ToolTip("Solicite ayuda al equipo de NW", qxnw.config.execIcon("help-faq"));
                        self.ui.helpButton.setToolTip(tT);
                        self.buttonsContainer.add(self.ui.helpButton);
                        self.ui.helpButton.setEnabled(true);
                        self.ui.helpButton.addListener("execute", function () {
                            qxnw.main.slotBtnTicketsNw();
                        });
                    }

                    self.buttonsContainer.add(new qx.ui.core.Spacer(30, 40), {flex: 1});
                    self.buttonsContainer.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "pie_foot");
                    });
                }
                self.buttonsContainer.add(self.ui["accept"].set({maxHeight: 30}));
                self.buttonsContainer.add(self.ui["cancel"].set({maxHeight: 30}));
//                self.ui["accept"].setTabIndex(self.__tabIndex++);
//                self.ui["cancel"].setTabIndex(self.__tabIndex++);
                if (qxnw.utils.isDebug()) {
//                    self.ui["printButton"].setTabIndex(self.__tabIndex++);
                }
                self.__areCreatedDeffectButtons = true;

//                if (typeof self.ui["printButton"] != 'undefined') {
//                    if (self.ui["printButton"] != null) {
//                        self.ui["printButton"].setTabIndex(qxnw.config.getActualTabIndex());
//                    }
//                }
//                if (typeof self.ui["accept"] != 'undefined') {
//                    if (self.ui["accept"] != null) {
//                        self.ui["accept"].setTabIndex(qxnw.config.getActualTabIndex());
//                    }
//                }
//                if (typeof self.ui["cancel"] != 'undefined') {
//                    if (self.ui["cancel"] != null) {
//                        self.ui["cancel"].setTabIndex(qxnw.config.getActualTabIndex());
//                    }
//                }
//                var len = self.__fields.length;
//                if (qxnw.utils.isDebug() || self.getCanPrint() == true) {
//                    len = len + 1;
//                    self.ui["printButton"].setTabIndex(len);
//                }
//                len = len + 1;
//                self.ui["accept"].setTabIndex(len);
//                len = len + 1;
//                self.ui["cancel"].setTabIndex(len);
            }
        },
        printForm: function printForm(widget, callback, useHeight) {
            if (typeof html2canvas == 'undefined') {
                callback("");
                return "";
            }
            if (qx.core.Environment.get("browser.name") == "ie" && parseFloat(qx.core.Environment.get("browser.version")) < 9) {
                callback("");
                return "";
            }
            html2canvas(widget, {
                onrendered: function (canvas) {
                    var dato = canvas.toDataURL("image/jpeg");
                    dato = dato.replace("image/jpeg", "image/octet-stream");
                    callback(dato);
                    return dato;
                },
                background: "white",
                height: useHeight
            });
        },
        setGroupVisibility: function setGroupVisibility(name, visible) {
            try {
                if (typeof this.__groupsAll[name] != 'undefined') {
                    this.__groupsAll[name].setVisibility(visible);
                }
            } catch (e) {
                qxnw.utils.error(e);
            }
        },
        setGroupHeight: function setGroupHeight(name, height) {
            try {
                if (typeof this.__groupsAll[name] != 'undefined') {
                    this.__groupsAll[name].setMaxHeight(height);
                    this.__groupsAll[name].setMinHeight(height);
                }
            } catch (e) {
                qxnw.utils.error(e);
            }
        },
        setGroupWidth: function setGroupWidth(name, width) {
            try {
                if (typeof this.__groupsAll[name] != 'undefined') {
                    this.__groupsAll[name].setMaxWidth(width);
                    this.__groupsAll[name].setMinWidth(width);
                }
            } catch (e) {
                qxnw.utils.error(e);
            }
        },
        setMaxHeightContainer: function setMaxHeightContainer(name, height) {
            switch (name) {
                case "containerMain":
                    this.__containerMain.setMaxHeight(height);
                    break;
            }
            return true;
        },
        setMaxWidthContainer: function setMaxWidthContainer(name, width) {
            switch (name) {
                case "containerMain":
                    this.__containerMain.setMaxWidth(width);
                    break;
            }
            return true;
        },
        getContainerFields: function getContainerFields() {
            return this.__containerMain;
        },
        addCounterWords: function addCounterWords(widget) {
            var self = this;
            var splited = widget.split(",");
            self.__countPopupsWords = [];
            for (var i = 0; i < splited.length; i++) {
                self.__countPopupsWords[splited[i]] = qxnw.utils.createPopUp(self.ui[splited[i]], self.tr("Palabras: 0"), qxnw.config.execIcon("check-spelling"), false, true);
                var zindex = self.ui[splited[i]].getZIndex();
                self.__countPopupsWords[splited[i]].set({
                    autoHide: true,
                    placeMethod: "widget",
                    position: "top-right",
                    zIndex: zindex
                });
                self.ui[splited[i]].setUserData("nw_char_count_tool_tip", self.__countPopupsWords[splited[i]]);
                self.__countPopupsWords[splited[i]].setUserData("nw_char_count_name", splited[i]);
                self.ui[splited[i]].setUserData("nw_char_count_name", splited[i]);
                self.__countPopupsWords[splited[i]].hide();
                self.ui[splited[i]].addListener("focusin", function () {
                    var val = this.getValue();
                    if (val == null) {
                        val = "";
                    }
                    var w = val.split(" ");
                    var t = this.getUserData("nw_char_count_tool_tip");
                    var child = t.getChildren();
                    child[0].setLabel("Palabras: " + w.length);
                    var n = this.getUserData("nw_char_count_name");
                    self.__countPopupsWords[n].show();
                });
                self.ui[splited[i]].addListener("focusout", function () {
                    var n = this.getUserData("nw_char_count_name");
                    self.__countPopupsWords[n].hide();
                });
                self.__countPopupsWords[splited[i]].addListener("appear", function () {
                    var n = this.getUserData("nw_char_count_name");
                    try {
                        this.placeToElement(self.ui[n].getContentElement().getDomElement(), true);
                    } catch (e) {
                        this.placeToElement(self.ui[n].getContentElement().getDomElement(), true);
                    }
                });
                self.ui[splited[i]].addListener("disappear", function () {
                    var t = this.getUserData("nw_char_count_tool_tip");
                    t.hide();
                    t = null;
                });
                self.ui[splited[i]].addListener("input", function () {
                    var val = this.getValue();
                    if (val == null) {
                        val = "";
                    }
                    var w = val.split(" ");
                    var t = this.getUserData("nw_char_count_tool_tip");
                    var child = t.getChildren();
                    child[0].setLabel("Palabras: " + w.length);
                });
            }
        },
        addCounterLetters: function addCounterLetters(widget) {
            var self = this;
            var splited = widget.split(",");
            self.__countPopups = [];
            for (var i = 0; i < splited.length; i++) {
                self.__countPopups[splited[i]] = qxnw.utils.createPopUp(self.ui[splited[i]], self.tr("Letras: 0"), qxnw.config.execIcon("check-spelling"), false, true);
                self.__countPopups[splited[i]].set({
                    autoHide: false,
                    placeMethod: "widget",
                    position: "top-right"
                });
                self.__countPopups[splited[i]].setUserData("nw_char_count_name", splited[i]);
                self.ui[splited[i]].setUserData("nw_char_count_tool_tip", self.__countPopups[splited[i]]);
                self.ui[splited[i]].setUserData("nw_char_count_name", splited[i]);
                self.ui[splited[i]].addListener("focusin", function () {
                    var val = this.getValue();
                    if (val == null) {
                        val = "";
                    }
                    var t = this.getUserData("nw_char_count_tool_tip");
                    var child = t.getChildren();
                    child[0].setLabel("Letras: " + val.length);
                    var n = this.getUserData("nw_char_count_name");
                    self.__countPopups[n].show();
                });
                self.ui[splited[i]].addListener("focusout", function () {
                    var n = this.getUserData("nw_char_count_name");
                    self.__countPopups[n].hide();
                });
                self.__countPopups[splited[i]].hide();
                self.__countPopups[splited[i]].addListener("appear", function () {
                    var n = this.getUserData("nw_char_count_name");
                    try {
                        this.placeToElement(self.ui[n].getContentElement().getDomElement(), true);
                    } catch (e) {

                    }
                });
                self.ui[splited[i]].addListener("disappear", function () {
                    var t = this.getUserData("nw_char_count_tool_tip");
                    t.hide();
                    t = null;
                });
                self.ui[splited[i]].addListener("input", function () {
                    var val = this.getValue();
                    if (val == null) {
                        val = "";
                    }
                    var t = this.getUserData("nw_char_count_tool_tip");
                    var child = t.getChildren();
                    child[0].setLabel("Letras: " + val.length);
                });
            }
        },
        createForm: function createForm(fields) {
            var self = this;
            if (typeof fields == 'undefined') {
                return;
            }
            var col = self.__col;
            var row = self.__row;
            //var fields = this.__fields;
            if (!self.__isCreatedMainForm) {
                self.gridLayout = new qx.ui.layout.Grid().set({
                    spacingX: 3, spacingY: 3
                });
                self.__containerMain = new qx.ui.container.Composite(self.gridLayout).set({
                    padding: 0
                });

                if (self.__putFieldsIntoFormTag == true) {
                    var formTag = new qxnw.forms.compositeForm();
                    formTag.add(self.__containerMain);
                    self.masterContainer.add(formTag, {
                        flex: 1
                    });
                } else {
                    //self.__containerMain.setAllowStretchY(true);
                    self.masterContainer.add(self.__containerMain, {
                        flex: 1
                    });
                }
                self.__containerMain.addListener("resize", function (e) {
                    var data = e.getData();
                    if (self.__isMovedBySplitter) {
                        qxnw.local.storeData("qxnw_scroll_" + self.getAppWidgetName(), data["height"]);
                        self.__isHandled = true;
                    }
                });
                self.__isCreatedMainForm = true;
            }
            var columnsFormNumber = self.getColumnsFormNumber();
            for (var ia = 0; ia < 50; ia++) {
                self.gridLayout.setRowFlex(ia, 1);
                self.gridLayout.setColumnFlex(ia, 1);
            }
            var isGroup = false;
            var focused = false;
            var modeGroup = null;

            var tableDescription = self.getDescriptionByObjectName("conditions");

            for (var i = 0; i < fields.length; i++) {
                var name = fields[i].name;
                var label = fields[i].label;
                var type = fields[i].type;
                var required = fields[i].required;
                var toolTip = fields[i].toolTip;
                var width = false;
                var height = false;
                var rowGroup = fields[i].row;
                var columnGroup = fields[i].column;
                if (typeof fields[i].height != 'undefined') {
                    height = fields[i].height;
                }
                if (typeof fields[i].width != 'undefined') {
                    width = fields[i].width;
                }
                if (required == 1) {
                    required = true;
                }
                if (required == 0) {
                    required = false;
                }
                var mode = fields[i].mode;
                var enabled = typeof fields[i].enabled == 'undefined' ? true : fields[i].enabled;

                self.findIntoDescriptionFields(fields, i, tableDescription);

                if (type == "startGroup") {
                    var icon = fields[i].icon;
                    if (typeof icon === "undefined") {
                        icon = "";
                    }
                    if (name == "") {
                        name = "empty";
                    }
                    if (typeof name !== 'undefined') {
                        if (typeof name.classname !== 'undefined') {
                            if (name.classname === "qx.locale.LocalizedString") {
                                if (name.getMessageId() === "") {
                                    name = "";
                                }
                            }
                        }
                    }
                    if (typeof label !== 'undefined' && label !== "") {
                        if (typeof name === 'undefined' || name === "") {
                            name = label;
                        }
                        self.__group = new qx.ui.groupbox.GroupBox(label, icon).set({
                            contentPadding: 2
                        });
                    } else {
                        self.__group = new qx.ui.groupbox.GroupBox(name, icon).set({
                            contentPadding: 2
                        });
                    }

                    self.__group.getChildControl("legend").setRich(true);
                    if (typeof fields[i].textColor !== 'undefined') {
                        self.__group.getChildControl("legend").setTextColor(fields[i].textColor);
                    }

                    var atom = new qx.ui.basic.Atom(self.tr("Minimizar"), qxnw.config.execIcon("view-restore")).set({
                        cursor: "pointer",
                        show: "icon",
                        focusable: false
                    });
                    if (typeof fields[i].maximize != 'undefined') {
                        if (fields[i].maximize == false) {
                            atom.setVisibility("excluded");
                        }
                    }
                    var n = name;
                    if (typeof name != 'undefined' && name.classname == "qx.locale.LocalizedString") {
                        n = name.getMessageId();
                    }
                    var nameGroup = qxnw.utils.normalizeChar(n);
                    self.__groupsAll[nameGroup] = self.__group;
                    atom.setUserData("nw_frame_groupbox", self.__groupsAll[nameGroup]);
                    atom.setUserData("nw_groupbox_state", "open");
                    atom.addListener("tap", function () {
                        var state = atom.getUserData("nw_groupbox_state");
                        var frame = this.getUserData("nw_frame_groupbox");
                        if (state == "open") {
                            this.setLabel(self.tr("Maximizar"));
                            this.setIcon(qxnw.config.execIcon("view-fullscreen"));
                            frame.getChildControl("frame").setMaxHeight(15);
                            atom.setUserData("nw_groupbox_state", "closed");
                        } else {
                            this.setLabel(self.tr("Minimizar"));
                            this.setIcon(qxnw.config.execIcon("view-restore"));
                            frame.getChildControl("frame").resetMaxHeight();
                            atom.setUserData("nw_groupbox_state", "open");
                        }
                    });
                    self.__group._add(atom, {top: 0, right: -1});

                    var colorTextGroups = qxnw.userPolicies.getColorLabelGroups();
                    if (colorTextGroups != null) {
                        if (typeof colorTextGroups != "undefined") {
                            if (typeof colorTextGroups != "") {
                                self.__group.getChildControl("legend").setTextColor(colorTextGroups);
                            }
                        }
                    }
                    if (typeof fields[i].border != 'undefined') {
                        self.__group.setBackgroundColor(fields[i].border);
                    }
                    if (typeof fields[i].color != 'undefined') {
                        self.__group.getChildControl("frame").setBackgroundColor(fields[i].color);
                    }

                    self.__group.setUserData("name", nameGroup);
                    if (mode == "horizontal") {
                        self.__group.setLayout(new qx.ui.layout.HBox().set({
                            spacing: 2
                        }));
                        modeGroup = mode;
                    } else if (mode == "vertical") {
                        self.__group.setLayout(new qx.ui.layout.VBox().set({
                            spacing: 2
                        }));
                        modeGroup = mode;
                    } else if (mode == "grid") {
                        self.__group.setLayout(new qx.ui.layout.Grid().set({
                            spacing: 2
                        }));
                        modeGroup = mode;
                    } else {
                        self.__group.setLayout(new qx.ui.layout.VBox().set({
                            spacing: 2
                        }));
                        modeGroup = "vertical";
                    }
                    if (name == "empty") {
                        self.__group.getChildControl("legend").setVisibility("excluded");
                    }
                    self.isAddedGroup = false;
                    isGroup = true;
                    if (typeof toolTip != 'undefined' && typeof toolTip != null) {
                        var tT = new qx.ui.tooltip.ToolTip(toolTip, qxnw.config.execIcon("help-faq"));
                        self.__groupsAll[nameGroup].setToolTip(tT);
                    }
                    continue;
                }
                if (type == "endGroup") {
                    isGroup = false;
                    continue;
                }
                if (fields[i].visible == false || fields[i].type == "not_visible" || fields[i].type == "serial" || fields[i].visible == "false") {
                    label = "";
                    self.ui[name].setVisibility("excluded");
                    continue;
                }

                var vLayout = null;
                if (type == "radioButton" || type == "checkBox") {
                    if (typeof fields[i].containerMode != 'undefined') {
                        switch (fields[i].containerMode) {
                            case "vertical":
                                vLayout = new qx.ui.layout.VBox().set({
                                    spacing: 5
                                });
                                break;
                            case "horizontal":
                                vLayout = new qx.ui.layout.HBox().set({
                                    spacing: 5
                                });
                                break;
                        }
                    } else {
                        vLayout = new qx.ui.layout.HBox().set({
                            spacing: 5
                        });
                    }
                } else if (typeof fields[i].containerMode != 'undefined') {
                    switch (fields[i].containerMode) {
                        case "vertical":
                            vLayout = new qx.ui.layout.VBox();
                            break;
                        case "horizontal":
                            vLayout = new qx.ui.layout.HBox();
                            break;
                    }
                } else if (type == "button" || type == "ocrReader") {
                    vLayout = new qx.ui.layout.HBox().set({
                        spacing: 5
                    });
                } else if (type == "textArea") {
                    vLayout = new qx.ui.layout.Canvas();
                } else {
                    vLayout = new qx.ui.layout.VBox();
                }
                if (type == "textArea") {
                    var container = new qx.ui.container.Resizer(vLayout).set({
                        resizable: false,
                        appearance: "widget",
                        minHeight: 80,
                        width: 50
                    });
                    container.setResizableBottom(true);
                } else {
                    var container = new qx.ui.container.Composite(vLayout);
                }
                container.addListener("appear", function () {
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_container_fields_form");

                    var cl = "qxnwfield_" + type;
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), cl);

                    if (columnGroup != 'undefined' && typeof rowGroup != 'undefined') {
                        var cl = "qxnw_column";
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), cl);
                    }

                });
                if (type == "textArea" || type == "passwordField" || type == "selectBox" || type == "textField" || type == "dateField" || type == "tokenField" || type == "selectTokenField" || type == "spinner" || type == "button"
                        || type == "uploader_multiple" || type == "label" || type == "dateTimeField") {
                    self.gridLayout.setRowFlex(row, 0);
                }
                if (isGroup) {
                    if (modeGroup === "grid" && typeof columnGroup != 'undefined' && typeof rowGroup != 'undefined') {
                        self.__group.getLayout().setRowFlex(rowGroup, 1);
                        self.__group.getLayout().setColumnFlex(columnGroup, 1);
                        var colSpan = self.getColumnsFormNumber();
                        var expand = 0;
                        if (typeof mode != 'undefined') {
                            var arrMode = mode.split(":");
                            if (typeof arrMode == 'object') {
                                if (arrMode.length > 0) {
                                    mode = arrMode[0];
                                    expand = arrMode[1];
                                }
                            }
                        }
                        switch (mode) {
                            case "colSpan":
                                self.__group.add(container, {
                                    column: columnGroup,
                                    row: rowGroup,
                                    colSpan: parseInt(expand)
                                });
                                columnGroup = columnGroup + parseInt(expand) - 1;
                                break;
                            case "rowSpan":
                                self.__group.add(container, {
                                    column: columnGroup,
                                    row: rowGroup,
                                    rowSpan: parseInt(expand)
                                });
                                rowGroup = rowGroup + parseInt(expand) - 1;
                                break;
                            case "maxWidth":
                                self.__group.add(container, {
                                    column: columnGroup,
                                    row: rowGroup,
                                    colSpan: colSpan + 1
                                });
                            default :
                                self.__group.add(container, {
                                    column: columnGroup,
                                    row: rowGroup
                                });
                                break;
                        }
                    } else {
                        if (type == "uploader") {
                            self.__group.add(container, {
                                flex: 0
                            });
                        } else {
                            self.__group.add(container, {
                                flex: 1
                            });
                        }
                    }
                    if (!self.isAddedGroup) {
                        self.__containerMain.add(self.__group, {
                            column: col,
                            row: row
                        });
                    }
                } else {
                    var colSpan = self.getColumnsFormNumber();
                    var expand = 0;
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(":");
                        if (typeof arrMode == 'object') {
                            if (arrMode.length > 0) {
                                mode = arrMode[0];
                                expand = arrMode[1];
                            }
                        }
                    }
                    switch (mode) {
                        case "colSpan":
                            self.__containerMain.add(container, {
                                column: col,
                                row: row,
                                colSpan: parseInt(expand)
                            });
                            col = col + parseInt(expand) - 1;
                            break;
                        case "rowSpan":
                            self.__containerMain.add(container, {
                                column: col,
                                row: row,
                                rowSpan: parseInt(expand)
                            });
                            row = row + parseInt(expand) - 1;
                            break;
                        case "maxWidth":
                            self.__containerMain.add(container, {
                                column: col,
                                row: row,
                                colSpan: colSpan + 1
                            });
                        case "maxHeight":
                            self.__containerMain.add(container, {
                                column: col,
                                row: row
                            });
                            self.gridLayout.setRowFlex(row, 1);
                            break;
                        default :
                            self.__containerMain.add(container, {
                                column: col,
                                row: row
                            });
                            break;
                    }
                }
                var asterisk = "";
                if (required) {
                    asterisk = "<b style='color:red' class='require_qxnw'>*</b>";
                }
                if (typeof toolTip != 'undefined' && typeof toolTip != null) {
                    if (label != "null") {
                        label.replace("_", " ") + asterisk;
                    } else {
                        label = "null";
                    }
                    var tT = new qx.ui.tooltip.ToolTip(toolTip, qxnw.config.execIcon("help-faq"));
                    if (type == "button") {
                        self.ui[name].setToolTip(tT);
                    }
                    if (name == "") {
                        name = "empty";
                    }
                    if (typeof label !== 'undefined') {
                        if (typeof label.classname !== 'undefined') {
                            if (label.classname === "qx.locale.LocalizedString") {
                                if (label.getMessageId() === "") {
                                    label = "";
                                }
                            }
                        }
                    }
                    self.labelForm[name] = new qx.ui.basic.Atom(label.replace("_", " ") + asterisk, qxnw.config.execIcon("dialog-information.png", "status")).set({
                        rich: true
                    });
                    if (type == "button") {
                        self.ui[name].setToolTip(tT);
                        self.labelForm[name].setVisibility("excluded");
                    }
                    self.labelUi[name] = self.labelForm[name];
                    self.labelForm[name].setValue = function (text) {
                        this.setLabel(text);
                    };
                    self.labelForm[name].getValue = function () {
                        return this.getLabel();
                    };
                    self.labelForm[name].setGap(-3);
                    self.labelForm[name].setIconPosition("right");
                    self.labelForm[name].setToolTip(tT);
                } else {
                    if (typeof label == 'undefined' || label == null) {
                        label = "";
                    }
                    if (typeof label !== 'undefined') {
                        if (typeof label.classname !== 'undefined') {
                            if (label.classname === "qx.locale.LocalizedString") {
                                if (label.getMessageId() === "") {
                                    label = "";
                                }
                            }
                        }
                    }
                    label = label.toString().replace("_", " ") + asterisk;
                    self.labelForm[name] = new qx.ui.basic.Label(label).set({
                        rich: true
                    });
                    self.labelUi[name] = self.labelForm[name];
                    if (type == "label" || type == "button") {
                        self.labelUi[name].setVisibility("excluded");
                    }
                }
                if (required) {
                    self.labelForm[name].setUserData("required", required);
                }
                self.labelForm[name].setUserData("name", name);

                if (type == "button" || type == "label") {
                    self.labelForm[name].setValue("");
                    self.labelForm[name].setVisibility("excluded");
                } else if (type == "ckeditor") {
                    container.setUserData("nw_name_ckeditor", name);
                    container.addListener("resize", function (e) {
                        var d = e.getData();
                        var n = this.getUserData("nw_name_ckeditor");
                        if (d != null) {
                            if (d.height != null) {
                                self.ui[n].setFinalHeight(d.height);
                            }
                        }
                    });
                    container.addListener("appear", function () {
                        var target = this.getContentElement().getDomElement();
                        qx.bom.element.Style.set(target, "overflow-y", "scroll");
                        qx.bom.element.Style.set(target, "overflow-x", "scroll");
                        this.setMinWidth(620);
                    });
                } else if (type == "checkBox") {
                    container.getLayout().set({
                        alignX: "left",
                        alignY: "middle"
                    });
                }
                if (label != "null" && type != "checkBox" && type != "textArea" && type != "ckeditor") {
                    container.add(self.labelForm[name], {flex: 1});
                } else if (type == "ckeditor") {
                    var cont = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                    var contan = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                        cursor: "pointer",
                        maxHeight: 25
                    });
                    contan.setUserData("nw_ckeditor", self.ui[name]);
                    contan.addListener("click", function () {
                        var that = this;
                        var f = new qxnw.forms().set({
                            showMinimize: false,
                            showMaximize: false
                        });
                        var field = [
                            {
                                name: "ckeditor_append_to",
                                label: f.tr("Editor"),
                                type: "ckeditor",
                                maximize: false
                            }
                        ];
                        f.setFields(field);
                        f.setModal(true);
                        f.setTitle(f.tr("Vista WYSIWYG :: QXNW"));
                        f.ui.accept.addListener("execute", function () {
                            f.reject();
                        });
                        f.ui.cancel.setVisibility("excluded");
                        var ck = that.getUserData("nw_ckeditor");
                        var d = ck.getCKEditor().getData();
                        f.ui.ckeditor_append_to.setValue(d);
                        f.show();
                        f.addListener("close", function () {
                            var ck = that.getUserData("nw_ckeditor");
                            var dat = f.ui.ckeditor_append_to.getCKEditor().getData();
                            ck.getCKEditor().setData(dat);
                        });
                        f.maximize();
                    });
                    var atom = new qx.ui.basic.Atom(self.tr("Maximizar"), qxnw.config.execIcon("view-fullscreen"));
                    if (typeof fields[i].maximize != 'undefined') {
                        if (fields[i].maximize == false) {
                            atom.setVisibility("excluded");
                        }
                    }
                    var spacer = new qx.ui.core.Spacer();
                    var spacer_end = new qx.ui.core.Spacer(25);
                    contan.add(self.labelForm[name], {flex: 1});
                    contan.add(spacer, {flex: 1});
                    contan.add(atom, {flex: 0});
                    contan.add(spacer_end, {flex: 0});
                    container.add(contan, {flex: 1});
                } else if (type == "textArea") {
                    container.add(self.labelForm[name], {top: 0, left: 0});
                } else if (type == "checkBox") {
                    self.ui[name].setUserData("labelUi", self.labelForm[name]);
                    self.labelForm[name].addListener("click", function () {
                        try {
                            var name = this.getUserData("name");
                            var val = self.ui[name].getValue();
                            var lbl = this.getValue();
                            if (val == false) {
                                this.setValue("<b>" + lbl + "</b>");
                            } else {
                                lbl = lbl.replace("<b>", "");
                                lbl = lbl.replace("</b>", "");
                                this.setValue(lbl);
                            }
                            self.ui[name].setValue(val == false ? true : false);
                        } catch (e) {
                            qxnw.utils.error(e, this);
                        }
                    });
                    if (enabled == "false" || enabled == false) {
                        container.setEnabled(false);
                    }
                }

                if (type == "button") {

                }

                if (width != false) {
                    if (width > 0) {
                        try {
                            self.ui[name].setMinWidth(width);
                            self.ui[name].setMaxWidth(width);
                            self.labelForm[name].setMinWidth(width);
                            self.labelForm[name].setMaxWidth(width);
                            container.setMinWidth(width);
                            container.setMaxWidth(width);
                        } catch (e) {
                            try {
                                qxnw.utils.nwconsole("No se encontró la función min y max width en el elemento " + name, qx.dev.StackTrace.getStackTrace().toString());
                            } catch (e) {

                            }
                        }
                    }
                }
                if (height != false) {
                    if (height > 0) {
                        try {
                            self.ui[name].setMinHeight(height);
                            self.ui[name].setMaxHeight(height);
                        } catch (e) {
                            try {
                                qxnw.utils.nwconsole("No se encontró la función min y max height en el elemento " + name, qx.dev.StackTrace.getStackTrace().toString());
                            } catch (e) {

                            }
                        }
                    }
                }

                if (type == "textArea") {
                    self.gridLayout.setRowFlex(row, 1);
                }

                if (type == "ckeditor") {
                    cont.add(self.ui[name], {width: "50%", flex: 1});
                    container.add(cont, {flex: 1});
                } else if (type == "uploader") {
                    container.add(self.ui[name].getContainer(), {flex: 0});
                } else if (type == "camera") {
                    var a = 440;
                    var l = 200;
                    if (typeof mode != 'undefined') {
                        var arrMode = mode.split(":");
                        if (typeof arrMode == 'array' || typeof arrMode == "object") {
                            if (arrMode[0] == "size" && typeof arrMode[1] != 'undefined') {
                                try {
                                    var dat = arrMode[1].split(",");
                                    l = dat[0];
                                    a = dat[1];
                                } catch (e) {

                                }
                            }
                        }
                    }
                    var newVersion = false;
                    if (window.location.protocol == "https:") {
                        newVersion = true;
                    }
                    if (newVersion == true) {
                        container.add(self.ui[name], {flex: 1});
                    } else {
                        container.add(self.ui[name], {flex: 1});
                    }
                } else if (type == "textArea") {
                    container.add(self.ui[name], {left: 0, right: 0, top: 15, height: "85%"});
                    container.setUserData("textAreaBinded", name);
                    var lblLine = new qx.ui.basic.Label("<hr>").set({
                        rich: true,
                        width: qx.bom.Viewport.getWidth(),
                        maxHeight: 7
                    });
                    container.add(lblLine, {bottom: 0});
                    container.addListener("losecapture", function () {
                        var h = this.getHeight();
                        var name = this.getUserData("textAreaBinded");
                        self.ui[name].setHeight(h - 20);
                        self.ui[name].resetMinHeight();
                        self.ui[name].resetMaxHeight();
                    });
                } else {
                    container.add(self.ui[name], {flex: 1});
                    if (type == "checkBox") {
                        container.add(self.labelForm[name], {
                            flex: 1
                        });
                    }
                }
                var enabled = typeof fields[i].enabled == 'undefined' ? true : fields[i].enabled;
                if (!focused) {
                    if (fields[i].visible != false || fields[i].type != "not_visible" || fields[i].type != "serial" || fields[i].visible != "false") {
                        if (enabled) {
                            self.setFocusAsync(type, name);
                            focused = true;
                        }
                    }
                }

                if (columnsFormNumber > 0) {
                    if (col == columnsFormNumber) {
                        col = 0;
                    } else {
                        if (isGroup) {
                            //TODO: NO HAGA NADA
                        } else {
                            col++;
                            self.__col = col;
                        }
                        //TODO: VERIFICAR!!!!! ESTÁ CORRECTO. AL PRINCIPIO LO AGREGA PERO LA BANDERA QUEDA EN FALSE
                        if (isGroup) {
                            if (!self.isAddedGroup) {
                                row++;
                                self.isAddedGroup = true;
                            }
                        }
                        continue;
                    }
                }
                if (isGroup) {
                    if (!self.isAddedGroup) {
                        row++;
                        self.isAddedGroup = true;
                    }
                } else {
                    row++;
                }
                self.__col = col;
                self.__row = row;
                self.__rowCount = self.__rowCount + row;
            }

            var modelData = {};
            for (i = 0; i < fields.length; i++) {
                if (fields[i].type != "startGroup" && fields[i].type != "endGroup") {
                    modelData[fields[i].name] = "";
                }
            }

            modelData["e"] = "";
            if (self.tableAuto != null) {
                modelData["table"] = self.tableAuto;
            }
//            self.addListener("appear", function() {
//                // qx.bom.element.Class.add(self.getContentElement().getDomElement(), "pie_foot");
////                qx.bom.element.Style.set(self.getContentElement().getDomElement(), "border", "1px solid #ccc");
////                qx.bom.element.Style.set(self.getContentElement().getDomElement(), "box-shadow", "rgba(0, 0, 0, 0.5) 1px 1px 15px 1px");
////                //qx.bom.element.Style.set(self.getChildControl("label").getContentElement().getDomElement(), "color", "#999");
////                //qx.bom.element.Style.set(self.getChildControl("fields").getContentElement().getDomElement(), "border", "none");
////                qx.bom.element.Style.set(self.getChildControl("captionbar").getContentElement().getDomElement(), "border", "none");
////                qx.bom.element.Style.set(self.getChildControl("pane").getContentElement().getDomElement(), "background", "#f1f1f1");
////                qx.bom.element.Style.set(self.getChildControl("pane").getContentElement().getDomElement(), "border", "none");
////                qx.bom.element.Style.set(self.getChildControl("pane").getContentElement().getDomElement(), "padding", "0px");
////                qx.bom.element.Style.set(self.getChildControl("pane").getContentElement().getDomElement(), "color", "#999");
//            });
//            try {
//                self.model = qx.data.marshal.Json.createModel(modelData);
//            } catch (e) {
//
//            }
            return true;
        },
        setFocusAsync: function setFocusAsync(type, name) {
            var self = this;
            self.__focusElement = {
                type: type,
                name: name
            };
        },
        hideButtons: function hideButtons() {
            this.hideAutomaticButtons();
        },
        hideAutomaticButtons: function hideAutomaticButtons() {
            if (this.buttonsContainer != null) {
                this.buttonsContainer.setVisibility("excluded");
            }
        },
        slotTabIndexAll: function slotTabIndexAll() {
            var self = this;
            var fields = this.__fields;
            var count = 1;
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].type == "selectListCheck" || fields[i].type == "selectTokenField" || fields[i].type == "button" || fields[i].type == "textField" || fields[i].type == "checkBox" || fields[i].type == "textArea" || fields[i].type == "dateField" || fields[i].type == "selectBox" || fields[i].type == "uploader" || fields[i].type == "address" || fields[i].type == "addressV2" || fields[i].type == "signer") {
                    self.ui[fields[i].name].setTabIndex(count);
                    if (fields[i].type == "address") {
                        self.ui.direccion.setTabIndex(count);
                        count++;
                        self.ui.direccion.via.setTabIndex(count);
                        count++;
                        self.ui.direccion.prefix.setTabIndex(count);
                        count++;
                        self.ui.direccion.prefix_a.setTabIndex(count);
                        count++;
                        self.ui.direccion.generadora.setTabIndex(count);
                        count++;
                        self.ui.direccion.generadora_a.setTabIndex(count);
                        count++;
                        self.ui.direccion.placa.setTabIndex(count);
                        count++;
                        self.ui.direccion.cuadrante.setTabIndex(count);
                        count++;
                        self.ui.direccion.complemento.setTabIndex(count);
                        count++;
                        self.ui.direccion.adicional.setTabIndex(count);
                    }
                    count++;
                }
            }
        },
        slotHideIdSelectTokenField: function slotHideIdSelectTokenField() {
            var self = this;
            var fields = this.__fields;
            var count = 1;
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].type == "selectTokenField") {
                    self.ui[fields[i].name].hideColumn("id");
                }
            }
        },
        handleFocus: function handleFocus() {
            var self = this;
            if (this.__focusElement == null) {
                return;
            }
            if (self.__focusElement["type"] != 'camera') {
                if (self.ui[self.__focusElement["name"]].isFocusable() || self.__focusElement["type"] == "textField") {
                    try {
                        self.ui[self.__focusElement["name"]].focus();
                        if (self.__focusElement["type"] == "dateField") {
                            self.ui[self.__focusElement["name"]].getChildControl("popup").addListenerOnce("appear", function () {
                                self.ui[self.__focusElement["name"]].close();
                            });
                        }
                        if (self.__focusElement["type"] == "dateChooser") {
                            return;
                        } else if (self.__focusElement["type"] == "spinner") {
                            self.ui[self.__focusElement["name"]].getChildControl("textfield").setLiveUpdate(true);
                            self.ui[self.__focusElement["name"]].getChildControl("textfield").getFocusElement().focus();
                        } else if (self.__focusElement["type"] == "selectTokenField") {
//self.ui[self.__focusElement["name"]].getChildControl("textfield").setLiveUpdate(true);
                            self.ui[self.__focusElement["name"]].focus();
                        } else if (self.__focusElement["type"] == "dateField") {
                            self.ui[self.__focusElement["name"]].getChildControl("textfield").setLiveUpdate(true);
                            self.ui[self.__focusElement["name"]].getChildControl("textfield").getFocusElement().focus();
                        } else if (self.__focusElement["type"] == "uploader") {
                            self.ui[self.__focusElement["name"]].focus();
                        } else {
                            self.ui[self.__focusElement["name"]].focus();
                            self.ui[self.__focusElement["name"]].getFocusElement().focus();
                        }
                    } catch (e) {
                        qxnw.utils.nwconsole(e, qx.dev.StackTrace.getStackTrace().toString());
                    }
                }
            }
        },
        createOtherWidgets: function createOtherWidgets() {
            var self = this;
            if (!self.__areCreatedOtherWidgets) {
                self.navTableContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                    "spacing": 5
                })).set({
                    maxHeight: 0
                });
                self.masterContainer.add(self.navTableContainer, {
                    flex: 1
                });
                self.__areCreatedOtherWidgets = true;
            }
        },
        accept: function accept(r) {
            var self = this;
            self.setAskOnClose(false);
            if (typeof self.settings.accept != 'undefined') {
                try {
                    self.settings.accept(r);
                } catch (e) {
                    qxnw.utils.error(e);
                }
            }
            self.close();
            self.fireEvent("accept");
        },
        getModel: function getModel() {
            return this.model;
        },
        getRpcUrl: function getRpcUrl() {
            return this.rpcUrl;
        },
        reject: function reject() {
            var self = this;
            self.setAskOnClose(false);
            try {
                self.close();
            } catch (e) {
                console.log(e);
            }
            if (typeof self.settings.reject != 'undefined') {
                self.settings.reject();
            }
            self.fireEvent("reject");
        }
    }
});

