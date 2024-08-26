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

qx.Class.define("qxnw.menuHorizontal", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    events: {
        fireCommand: "qx.event.type.Data"
    },
    //TODO: CREAR DESTRUCTOR
    construct: function (parent, createMenu) {
        this.parent = parent;
        if (typeof createMenu == 'undefined') {
            createMenu = true;
        }
        if (createMenu) {
            this.createMenuBar();
        }
        this.__menuUi = {};
        this.menuContainers = [];
        this.menuContainersSub = [];
        this.allMenuImplicit = [];
        this.menuImplicitSub = [];
        this.allMenuImplicitSub = [];
    },
    statics: {
        handleCallback: function handleCallback(callback, parent) {
            //TODO: HACERLO TAMBIÉN CON LOS DEMÁS TIPOS DE LLAMADAS
            if (typeof callback != 'undefined') {
                if (callback != null) {
                    if (callback != '') {
                        qxnw.utils.loading("Cargando elemento...");
                        var interval = setInterval(function () {
                            clearInterval(interval);
                            try {
                                parent[callback]();
                            } catch (e) {
                                qxnw.utils.error(e + "JAVASCRIPT STACK:" + qx.dev.StackTrace.getStackTrace().toString(), parent);
                                qxnw.utils.stopLoading();
                                return;
                            }
                            qxnw.utils.stopLoading();
                        }, 1);
                    }
                }
            }
        }
    },
    members: {
        menuActionContainer: null,
        menuImplicitSub: null,
        menuContainersSub: null,
        menuContainers: null,
        allMenuImplicitSub: null,
        allMenuImplicit: null,
        __menuUi: null,
        parent: null,
        menuBar: null,
        menuHeader: null,
        menuImplicit: null,
        menuAction: null,
        menu: null,
        commandsCount: 0,
        commands: [],
        font: null,
        __excelEnc: null,
        __clearedKey: false,
        createMenuBar: function createMenuBar() {
            var self = this;
            self.menuBar = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                alignX: "left"
            });
            qxnw.utils.addClassToElement(self.menuBar, "menu_main_container");
            self.menuBar.setMargin(1);
            self.menuBar.setAllowGrowY(true);
        },
        getMenuButtons1: function getMenuButtons1() {
            var self = this;
            return self.__menuUi;
        },
        addMenu: function addMenu(name, callback, parent, icon) {
            var self = this;

            var settings = {
                name: name,
                callback: callback
            };

//            console.log("addMenu: ", name);

            //self.saveMenuSettings(settings);

            var menuContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                alignX: "left",
                alignY: "middle",
                padding: 2,
                cursor: "pointer"
            });

            qxnw.utils.addClassToElement(menuContainer, "menu_level_1");

            self.menuContainers[name] = menuContainer;

            qxnw.utils.addBorder(menuContainer, "gray", 1);

            var ic = icon;

            if (this.isConfigIcon(icon)) {
                if (icon.charAt(0) == "/") {
                    icon = icon.substring(1);
                }
                ic = "icon/" + qxnw.config.getIconSize() + "/actions/" + icon + ".png";
            } else {
                if (icon == null) {
                    ic = "qx/icon/Tango/" + qxnw.config.getIconSize() + "/actions/dialog-apply.png";
                } else {
                    if (icon.charAt(0) == "/") {
                        icon = icon.substring(1);
                    }
                    var val = icon.split("/");
                    var exists = false;
                    if (typeof val[0] != 'undefined') {
                        if (val[0] == "qxnw") {
                            ic = qxnw.config.execIcon(val[1], val[0]);
                            exists = true;
                        }
                    }
                    if (!exists) {
                        ic = "qx/icon/Tango/" + qxnw.config.getIconSize() + "/" + icon;
                    }
                }
            }
            if (icon != 0) {
                var icon = new qx.ui.basic.Image(ic).set({
                    alignY: "middle"
                });
                qxnw.utils.addClassToElement(menuContainer, "menu_icon_level_1");
                menuContainer.add(icon);
            }

            self.menuHeader = null;

            var mh = new qx.ui.basic.Label(self.tr(name.toString())).set({
                rich: true,
                alignY: "middle",
                maxWidth: 150
            });

            menuContainer.add(mh);
            self.menuHeader = mh;

            self.menuHeader.setUserData("parent_name", name);

            self.__menuUi[name] = mh;

            if (self.font !== null) {
                this.menuHeader.setFont(self.font);
            }

            self.allMenuImplicit[name] = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                alignX: "left",
                visibility: "excluded"
            });

            self.menuImplicit = self.allMenuImplicit[name];

            qxnw.utils.addClassToElement(self.menuImplicit, "menu_main_container_n2");

            self.menuImplicit.setUserData("name", name);

            if (callback !== 0 && typeof callback !== 'undefined') {
                if (callback !== null) {
                    menuContainer.addListener("click", function (e) {
                        self.handleCallback(callback, parent);
                    });
                }
            }
            self.menuBar.add(menuContainer);
            self.menuBar.add(self.allMenuImplicit[name]);
            return self.menuHeader;
        },
        addMenuAction: function addMenuAction(name, icon, callback, parent, command, param, parentName) {
            var self = this;

            var settings = {
                name: name,
                callback: callback
            };

            self.menuImplicitSub = null;

//            console.log("addMenuAction: ", name);

            var menuContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                alignX: "left",
                padding: 10,
                cursor: "pointer"
            });

            self.menuActionContainer = menuContainer;

            qxnw.utils.addClassToElement(menuContainer, "menu_level_2");

            self.menuContainersSub[name] = menuContainer;
            self.menuContainersSub[name].setUserData("actionName", name);

            menuContainer.add(new qx.ui.core.Spacer(10), {
                flex: 0
            });

            //self.saveMenuSettings(settings);
            this.menu = null;
            var ic = icon;
            if (this.isConfigIcon(icon)) {
                ic = "icon/" + qxnw.config.getIconSize() + "/actions/" + icon + ".png";
            } else {
                if (icon == null) {
                    ic = "qx/icon/Tango/" + qxnw.config.getIconSize() + "/actions/dialog-apply.png";
                } else {
                    if (icon.charAt(0) == "/") {
                        icon = icon.substring(1);
                    }
                    //TODO: REVISAR
                    var val = icon.split("/");
                    var exists = false;
                    if (typeof val[0] != 'undefined') {
                        if (val[0] == "qxnw") {
                            ic = qxnw.config.execIcon(val[1], val[0]);
                            exists = true;
                        }
                    }
                    if (!exists) {
                        ic = "qx/icon/Tango/" + qxnw.config.getIconSize() + "/" + icon;
                    }
                }
            }
            if (typeof command !== 'undefined') {
                if (command !== "") {
                    if (command !== null) {
                        if (command != null) {
//                            menuButtonFormTest.setCommand(self.createCommand(command, callback, parent));
                        }
                    }
                }
            }

//            menuButtonFormTest.setLabel(name);
            if (icon != 0) {
                var icon = new qx.ui.basic.Image(ic).set({
                    alignY: "middle"
                });
                qxnw.utils.addClassToElement(menuContainer, "menu_icon_level_2");
                menuContainer.add(icon);
            }

            var menuButtonFormTest = new qx.ui.basic.Label(self.tr(name.toString())).set({
                rich: true,
                alignY: "middle",
                maxWidth: 150
            });

            if (typeof param !== 'undefined') {
                if (param !== null) {
                    menuButtonFormTest.setUserData("param", param);
                }
            }
            this.menuAction = menuButtonFormTest;

            menuContainer.add(menuButtonFormTest);

            menuButtonFormTest.setMargin(1);
            if (callback != 0 && typeof callback != 'undefined') {
                if (callback != null) {
                    menuContainer.addListener("tap", function (e) {
                        var param = this.getUserData("param");
                        self.handleCallback(callback, parent, param);
                    });
                }
            }

            if (self.font === null) {
                self.font = qxnw.utils.populateConfig(this.menuBar);
            }

            if (self.font !== null) {
//                appearance: "label"
                menuButtonFormTest.setFont(self.font);
            }

            var haveButton = self.menuImplicit.getUserData("haveButton");
            if (!haveButton) {
                var containerName = self.menuImplicit.getUserData("name");
                self.menuContainers[containerName].add(new qx.ui.core.Spacer(30), {
                    flex: 1
                });
                var menuButtonOpen = new qx.ui.form.Button("", qxnw.config.execIcon("go-next")).set({
                    show: "icon",
                    alignX: "right"
                });
                qxnw.utils.addClassToElement(menuButtonOpen, "menu_level_1_button");
                menuButtonOpen.addState("inner");
                self.menuContainers[containerName].add(menuButtonOpen);
                menuButtonOpen.setUserData("parentName", containerName);
                menuButtonOpen.setUserData("opened", false);
                menuButtonOpen.addListener("execute", function () {
                    var opened = menuButtonOpen.getUserData("opened");
                    if (!opened) {
                        var pn = menuButtonOpen.getUserData("parentName");
                        self.allMenuImplicit[pn].setVisibility("visible");
                        menuButtonOpen.setIcon(qxnw.config.execIcon("go-up"));
                        menuButtonOpen.setUserData("opened", true);
                    } else {
                        var pn = this.getUserData("parentName");
                        self.allMenuImplicit[pn].setVisibility("excluded");
                        menuButtonOpen.setIcon(qxnw.config.execIcon("go-next"));
                        menuButtonOpen.setUserData("opened", false);
                    }
                });
                menuButtonOpen.setUserData("opened", false);
                self.menuContainers[containerName].addListener("tap", function () {
                    var opened = menuButtonOpen.getUserData("opened");
                    if (!opened) {
                        var pn = menuButtonOpen.getUserData("parentName");
                        self.allMenuImplicit[pn].setVisibility("visible");
                        menuButtonOpen.setIcon(qxnw.config.execIcon("go-up"));
                        menuButtonOpen.setUserData("opened", true);
                    } else {
                        var pn = menuButtonOpen.getUserData("parentName");
                        self.allMenuImplicit[pn].setVisibility("excluded");
                        menuButtonOpen.setIcon(qxnw.config.execIcon("go-next"));
                        menuButtonOpen.setUserData("opened", false);
                    }
                });

                self.menuImplicit.setUserData("haveButton", true);
            }

            this.menuImplicit.add(menuContainer);
        },
        addSubMenuAction: function addSubMenuAction(name, icon, callback, parent, command, param) {

            var self = this;

            var settings = {
                name: name,
                callback: callback
            };

            //self.saveMenuSettings(settings);

            var menuContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
                alignX: "left",
                padding: 10,
                cursor: "pointer",
                minHeight: 25
            });

            qxnw.utils.addClassToElement(menuContainer, "menu_level_3");

            menuContainer.add(new qx.ui.core.Spacer(20), {
                flex: 0
            });

            var ic = icon;
            if (this.isConfigIcon(icon)) {
                if (icon.charAt(0) == "/") {
                    icon = icon.substring(1);
                }
                ic = "icon/" + qxnw.config.getIconSize() + "/actions/" + icon + ".png";
            } else {
                if (icon === null) {
                    ic = "qx/icon/Tango/" + qxnw.config.getIconSize() + "/actions/dialog-apply.png";
                } else {
                    if (icon.charAt(0) === "/") {
                        icon = icon.substring(1);
                    }
                    var val = icon.split("/");
                    var exists = false;
                    if (typeof val[0] !== 'undefined') {
                        if (val[0] === "qxnw") {
                            ic = qxnw.config.execIcon(val[1], val[0]);
                            exists = true;
                        }
                    }
                    if (!exists) {
                        ic = "qx/icon/Tango/" + qxnw.config.getIconSize() + "/" + icon;
                    }
                }
            }
            if (typeof command != 'undefined') {
                if (command != "") {
                    if (command != 0) {
                        if (command != null) {
                            menuSubAction.setCommand(self.createCommand(command, callback, parent));
                        }
                    }
                }
            }

            if (icon != 0) {
                var icon = new qx.ui.basic.Image(ic).set({
                    alignY: "middle"
                });
                qxnw.utils.addClassToElement(menuContainer, "menu_icon_level_3");
                menuContainer.add(icon);
            }

            var menuSubAction = new qx.ui.basic.Label(self.tr(name.toString())).set({
                rich: true,
                alignY: "middle",
                maxWidth: 150
            });

            if (typeof param != 'undefined') {
                menuSubAction.setUserData("param", param);
            }

            menuContainer.add(menuSubAction);

            menuSubAction.setMargin(1);
            if (callback != 0 && typeof callback != 'undefined') {
                menuContainer.addListener("tap", function (e) {
                    var param = this.getUserData("param");
                    self.handleCallback(callback, parent, param);
                });
            }
            if (self.font == null) {
                this.font = qxnw.utils.populateConfig(this.menuBar);
            }
            if (self.font != null) {
                menuSubAction.setFont(self.font);
            }

            if (self.menuImplicitSub === null) {
                self.allMenuImplicitSub[name] = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                    alignX: "left",
                    visibility: "excluded"
                });
                self.menuImplicitSub = self.allMenuImplicitSub[name];
                self.allMenuImplicitSub[name].setUserData("name", name);
                self.menuImplicit.add(self.allMenuImplicitSub[name]);

                qxnw.utils.addClassToElement(self.menuImplicitSub, "menu_main_container_n3");
            }

            if (self.menuImplicitSub !== null) {
                var haveButton = self.menuImplicitSub.getUserData("haveButton");

                if (!haveButton) {
                    var cn = self.menuActionContainer.getUserData("actionName");
                    self.menuContainersSub[cn].add(new qx.ui.core.Spacer(), {
                        flex: 1
                    });
                    var menuButtonOpen = new qx.ui.form.Button("", qxnw.config.execIcon("go-next")).set({
                        show: "icon",
                        alignX: "right"
                    });
                    qxnw.utils.addClassToElement(menuButtonOpen, "menu_level_2_button");
                    self.menuContainersSub[cn].add(menuButtonOpen);
                    menuButtonOpen.setUserData("parentName", name);
                    menuButtonOpen.setUserData("opened", false);
                    menuButtonOpen.addListener("execute", function () {
                        var opened = this.getUserData("opened");
                        if (!opened) {
                            var pn = this.getUserData("parentName");
                            self.allMenuImplicitSub[pn].setVisibility("visible");
                            this.setIcon(qxnw.config.execIcon("go-up"));
                            this.setUserData("opened", true);
                        } else {
                            var pn = this.getUserData("parentName");
                            self.allMenuImplicitSub[pn].setVisibility("excluded");
                            this.setIcon(qxnw.config.execIcon("go-next"));
                            this.setUserData("opened", false);
                        }
                    });
                    self.menuContainersSub[cn].addListener("tap", function () {
                        var opened = menuButtonOpen.getUserData("opened");
                        if (!opened) {
                            var pn = menuButtonOpen.getUserData("parentName");
                            self.allMenuImplicitSub[pn].setVisibility("visible");
                            menuButtonOpen.setIcon(qxnw.config.execIcon("go-up"));
                            menuButtonOpen.setUserData("opened", true);
                        } else {
                            var pn = menuButtonOpen.getUserData("parentName");
                            self.allMenuImplicitSub[pn].setVisibility("excluded");
                            menuButtonOpen.setIcon(qxnw.config.execIcon("go-next"));
                            menuButtonOpen.setUserData("opened", false);
                        }
                    });

                    self.allMenuImplicitSub[name].setUserData("haveButton", true);
                }
            }

            self.menuImplicitSub.add(menuContainer);
        },
        exec: function exec(bool) {
            this.menuBar.setMinWidth(240);
            this.parent.containerMenu.add(this.menuBar);
            try {
                if (typeof bool != 'undefined') {
                    if (bool === false) {

                    }
                } else {
                    if (typeof this.parent.setIsCreatedMenu != 'undefined') {
                        this.parent.setIsCreatedMenu(true);
                    }
                }
            } catch (e) {
                qxnw.utils.hiddenError(e, this.parent);
            }
        },
        handleCallback: function handleCallback(callback, parent, param) {
            var self = this;
            if (typeof param == 'undefined') {
                param = {};
            }
            if (callback === false) {
                return;
            }
            var callArr = callback.split(":");

            if (qxnw.utils.validateIsInteger(callback)) {
                if (callback === "0") {
                    return;
                }
                self.handleAutomateReports(callback, parent);
            } else if (callArr.length > 1) {
                var mode = callArr[0];
                var code = callArr[1];
                switch (mode) {
                    case "createExp":
                        self.handleExportReports(code, parent);
                        break;
                    case "chart_report":
                        self.handleAutomateReports(code, parent);
                        break;
                    case "excel_report":
                        self.handleExcelReports(code, parent);
                        break;
                    case "form_html":
                        self.handleFormHtml(code, parent);
                        break;
                    case "admin_files":
                        self.handleAdminFiles(code, parent);
                        break;
                    case "files_administrator":
                        self.handleFilesAdministrator(code, parent);
                        break;
                    case "createMaster":
                        self.handleMasterLists(code, parent);
                        break;
                }
            } else {
                if (typeof callback != 'undefined') {
                    if (callback != null) {
                        if (callback != '') {
                            qxnw.utils.loading(self.tr("Cargando elemento..."));
                            var interval = setInterval(function () {
                                clearInterval(interval);
                                try {
                                    parent[callback](param);
                                    qxnw.utils.stopLoading();
                                } catch (e) {
                                    qxnw.utils.stopLoading();
                                    if (typeof e.message != 'undefined' && e.message != null) {
                                        if (e.message.indexOf("ReferenceError")) {
                                            if (e.message.indexOf("is not defined")) {
                                                var makedError = "";
                                                if (typeof e.__trace != 'undefined') {
                                                    makedError += ". Error deep trace: " + e.__trace.join();
                                                }
                                                if (typeof e.line != 'undefined') {
                                                    makedError += ". LINE: " + e.line;
                                                }
                                                //qxnw.utils.information(self.tr("Hay un problema al abrir el objeto. Por favor verifique sus conexiones."));
                                                qxnw.utils.error(e + makedError + " Callback: " + callback + ". STACK FROM ERROR: " + qx.dev.StackTrace.getStackTraceFromError(e).toString() + ". JAVASCRIPT STACK:" + qx.dev.StackTrace.getStackTrace().toString() + "::PROBLEMA DE REFERENCIA DE OBJETO NULL", parent);
                                                return;
                                                callArr
                                            }
                                        }
                                    }
                                    var makedError = "";
                                    if (typeof e.__trace != 'undefined') {
                                        makedError += ". Error deep trace: " + e.__trace.join();
                                    }
                                    if (typeof e.line != 'undefined') {
                                        makedError += ". LINE: " + e.line;
                                    }
                                    qxnw.utils.error(e + makedError + " Callback: " + callback + ". STACK FROM ERROR: " + qx.dev.StackTrace.getStackTraceFromError(e).toString() + ". JAVASCRIPT STACK:" + qx.dev.StackTrace.getStackTrace().toString(), parent);
                                    return;
                                }
                            }, 1);
                        }
                    }
                }
            }
        },
        hideMenu: function hideMenu() {
            if (this.menuBar) {
                this.menuBar.setVisibility("excluded");
            }
        },
        showMenu: function showMenu() {
            if (this.menuBar) {
                this.menuBar.setVisibility("visible");
            }
        },
        removeMenu: function removemenu() {
            try {
                this.menuBar.removeAll();
                this.menuBar.resetMinWidth();
            } catch (e) {

            }
            qxnw.local.clearKey("menu");
        },
        getRpcUrl: function getRpcUrl() {
            return qxnw.userPolicies.getRpcUrl();
        },
        setVisibility: function setVisibility(visible) {
            //var self = this;
            if (this.menuBar != null) {
                //var time = 0;
                if (!qx.core.Environment.get("qx.debug")) {
                    time = 6000;
                }
                this.menuBar.setVisibility(visible);
                if (visible == "excluded" || visible == "hidden") {
//                    var interval = setInterval(function() {
//                        clearInterval(interval);
//                        //self.menuBar.setVisibility("visible");
//                    }, time);
                }
            }
        },
        getChildren: function getChildren() {
            if (this.menuBar != null) {
                return this.menuBar.getChildren();
            }
        },
        removeAt: function removeAt(index) {
            if (this.menuBar != null) {
                return this.menuBar.removeAt(index);
            }
        },
        saveMenuSettings: function saveMenuSettings(settings) {
            var saved = qxnw.local.getData("menu");
            if (saved != null) {
                if (!this.__clearedKey) {
                    qxnw.local.clearKey("menu");
                    this.__clearedKey = true;
                    saved = [settings];
                } else {
                    saved.push(settings);
                }
            } else {
                saved = [settings];
            }
            qxnw.local.storeData("menu", saved);
        },
        putWidthSuMenu: function putWidthSuMenu(width) {
            var self = this;
            for (var i = 0; i < self.allMenuImplicit.length; i++) {
                self.allMenuImplicit[i].setOffsetLeft(width);
            }
        },
        addSubMenu: function addSubMenu(name) {
            var menu = new qx.ui.menu.Menu;
            var menuButton = new qx.ui.menu.Button(name);
            menu.add(menuButton);
            this.menuAction.setMenu(menu);
        },
        processCommand: function (command, callback, parent) {
            parent[callback]();
            return;
        },
        createCommand: function (command, callback, parent) {
            var self = this;
            if (typeof self.commands[command] != 'undefined') {
                qxnw.utils.information("El comando " + command + " está repetido");
            }
            self.commands[command] = new qx.ui.command.Command(command);
            self.addListener("fireCommand", function () {
                self.processCommand(command, callback, parent);
            });
            self.commands[command].addListener("execute", function () {
                self.fireDataEvent("fireCommand", command);
            });
            return self.commands[command];
        },
        addSubSubMenuAction: function addSubSubMenuAction(name, icon, callback, parent, command) {
            var self = this;

            return;

            var settings = {
                name: name,
                callback: callback
            };
            //self.saveMenuSettings(settings);

            if (this.subMenu == null) {
                this.subMenu = new qx.ui.menu.Menu;
            }
            var menuSubAction = new qx.ui.form.Button();
            var ic = icon;
            if (this.isConfigIcon(icon)) {
                ic = "icon/" + qxnw.config.getIconSize() + "/actions/" + icon + ".png";
            } else {
                if (icon == null) {
                    ic = "qx/icon/Tango/" + qxnw.config.getIconSize() + "/actions/dialog-apply.png";
                } else {
                    var val = icon.split("/");
                    var exists = false;
                    if (typeof val[0] != 'undefined') {
                        if (val[0] == "qxnw") {
                            ic = qxnw.config.execIcon(val[1], val[0]);
                            exists = true;
                        }
                    }
                    if (!exists) {
                        ic = "qx/icon/Tango/" + qxnw.config.getIconSize() + "/" + icon;
                    }
                }
            }
            if (typeof command != 'undefined') {
                if (command != "") {
                    if (command != null) {
                        menuSubAction.setCommand(self.createCommand(command, callback, parent));
                    }
                }
            }
            menuSubAction.setLabel(self.tr(name.toString()));
            if (icon != 0) {
                menuSubAction.setIcon(ic);
            }
            menuSubAction.setMargin(1);
            if (callback != 0 && typeof callback != 'undefined') {
                menuSubAction.addListener("tap", function (e) {
                    self.handleCallback(callback, parent);
                });
            }
            if (self.font === null) {
                this.font = qxnw.utils.populateConfig(this.menuBar);
            }
            if (self.font !== null) {
                this.subMenu.setFont(self.font);
            }
            this.subMenu.add(menuSubAction);
//            this.menuAction.setMenu(this.menu);
        },
        handleExportReports: function handleExportReports(code, parent) {
            var subList = new qxnw.nw_exp.lists.l_view();
            subList.hideFooterColumnStill();
            subList.hideFooterCalculate();
            subList.setEnc(code);
            subList.ui.newButton.setVisibility("excluded");
            subList.ui.editButton.setVisibility("excluded");
            subList.ui.deleteButton.setVisibility("excluded");
            subList.setUserData("interfaceType", "DATA");
            parent.addSubWindow(this.tr("Exportación dinámica"), subList);
        },
        handleMasterLists: function handleMasterLists(code, parent) {
            var data = code.split(",");
            if (data.length == 3 || data.length == 4 || data.length == 5) {
                parent.createMasterList(data[0], data[1], data[2], typeof data[3] == 'undefined' ? false : true, typeof data[4] == 'undefined' ? null : data[4]);
            } else {
                //qxnw.utils.error("Debe crear correctamente el menú. Consulte con el administrador.");
            }
        },
        handleFilesAdministrator: function handleFilesAdministrator(code, parent) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    var ra = r[i];
                    if (ra["preguntar_al_descargar"] == true || ra["preguntar_al_descargar"] == "true" || ra["preguntar_al_descargar"] == "t") {
                        var f = new qxnw.forms();
                        var title = self.tr("::Descarga de archivos::");
                        if (ra["nombre"] != "") {
                            title = "::Descargar el archivo " + ra["nombre"] + "::";
                        }
                        f.setTitle(title);
                        var fields = [
                            {
                                name: "description",
                                label: self.tr("Escriba el motivo de descarga"),
                                type: "textArea",
                                required: true
                            }
                        ];
                        f.setFields(fields);
                        f.ui.accept.addListener("execute", function () {
                            if (!f.validate()) {
                                return;
                            }
                            f.accept();
                        });
                        f.ui.cancel.addListener("execute", function () {
                            f.reject();
                        });
                        f.settings.accept = function () {
                            var data = f.getRecord();
                            data.id = code;
                            var rpcSave = new qxnw.rpc(self.getRpcUrl(), "master");
                            rpcSave.setAsync(true);
                            rpcSave.setHandleError(false);
                            rpcSave.exec("saveDescriptionOnDownload", data);
                            self.showFileById(code, ra["salvar_al_guardar"]);
                        };
                        f.show();
                    } else {
                        self.showFileById(code, ra["salvar_al_guardar"]);
                    }
                }
            };
            rpc.exec("getFileForDownload", code, func);
        },
        showFileById: function showFileById(code, save) {
            var url = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/download_file.php?file_id=" + code;
            main.isClosedApp = true;
            window.location.href = url;
        },
        showFile: function showFile(code, ubication, save) {
            var self = this;
            var f = new qxnw.forms("qxnw_show_files_" + code);
            f.createPrinterToolBar();

            //var fileNameIndex = ubication.lastIndexOf("/") + 1;
            //var filename = ubication.substr(fileNameIndex);

            f.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/download_file.php", false);
            f.show();
            if (typeof save != 'undefined') {
                if (save == true || save == "true" || save == "t") {
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
                    rpc.setAsync(true);
                    rpc.exec("saveDownload", code);
                }
            }
        },
        handleAdminFiles: function handleAdminFiles(type, parent) {
            var self = this;
            var f = new qxnw.forms();
            var url = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/CKImageManager/CKImageManager.php?Type=Images";
            switch (type) {
                case "images":
                    url = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/CKImageManager/CKImageManager.php?Type=Images";
                    break;
                case "files":
                    url = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/CKImageManager/CKImageManager.php?Type=Files";
                    break;
                case "flash":
                    url = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/CKImageManager/CKImageManager.php?Type=Flash";
                    break;

            }
            f.addFrame(url, false);
            parent.addSubWindow("Administrador de imágenes", f);
        },
        handleFormHtml: function handleFormHtml(code, parent) {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "html_forms");
            rpc.setAsync(true);
            var htmlForm = new qxnw.forms();
            var func = function (r) {
                htmlForm.addHtml(r, true);
                parent.addSubWindow("Formulario HTML", htmlForm);
            };
            rpc.exec("getData", code, func);
        },
        handleExcelReports: function handleExcelReports(code) {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "excelReport");
            rpc.setAsync(true);
            var func = function (r) {
                self.__excelEnc = r[r.length - 1];
                if (r.length - 1 == 0) {
                    var data = {};
                    data["id"] = self.__excelEnc["id"];
                    var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "excelReport");
                    rpc.setTimeOut(50000);
                    rpc.setAsync(true);
                    var func = function (ra) {
                        if (ra == false) {
                            qxnw.utils.information(self.tr("No se crearon los datos"));
                        } else {
                            if (qx.core.Environment.get("browser.name") == "ie") {
                                window.open(ra, "ExportDataIE", "width=200, height=100");
                            } else {
                                window.location.href = ra;
                            }
                        }
                    };
                    rpc.exec("exportXLS", data, func);
                    return;
                }
                r.splice(r.length - 1, 1);
                var er = new qxnw.forms();
                er.setTitle(self.tr("Reporte automatizado para Excel"));
                er.setFields(r);
                er.setTableMethod("master");
                er.processDescriptions(r);
                er.ui.accept.addListener("execute", function () {
                    if (!er.validate()) {
                        return;
                    }
                    var data = er.getRecord();
                    data["id"] = self.__excelEnc["id"];
                    var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "excelReport");
                    rpc.setTimeOut(50000);
                    rpc.setAsync(true);
                    var func = function (r) {
                        if (r == false) {
                            qxnw.utils.information(self.tr("No se crearon los datos"));
                        } else {
                            if (qx.core.Environment.get("browser.name") == "ie") {
                                window.open(r, "ExportDataIE", "width=200, height=100");
                            } else {
                                window.location.href = r;
                            }
                        }
                    };
                    rpc.exec("exportXLS", data, func);
                });
                er.ui.cancel.addListener("execute", function () {
                    er.reject();
                });
                er.show();
            };
            rpc.exec("getFilters", code, func);
        },
        handleAutomateReports: function handleAutomateReports(id, parent) {
            var re = new qxnw.reports();
            re.start(id);
            parent.addSubWindow("Reporte automático", re);
        },
        isConfigIcon: function isConfigIcon(icon) {
            var icons = this.getDispIcons();
            for (var i = 0; i < icons.length; i++) {
                if (icon == icons[i]) {
                    return true;
                }
            }
            return false;
        },
        getDispIcons: function getDispIcons() {
            var icons = ["document-properties", "application-exit", "appointment-new", "insert-link", "contact-new", "go-next", "document-send", "mail-send", "view-restore"];
            return icons;
        }
    }

});
