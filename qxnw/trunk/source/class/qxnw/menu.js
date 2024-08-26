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

qx.Class.define("qxnw.menu", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    events: {
        fireCommand: "qx.event.type.Data"
    },
    //TODO: CREAR DESTRUCTOR
    construct: function (parent, createMenu, style) {
        this.parent = parent;
        if (typeof createMenu == 'undefined') {
            createMenu = true;
        }
        if (typeof style !== 'undefined') {
            this.menuStyle = style;
        }
        if (createMenu) {
            this.createMenuBar();
        }
        this.__menuUi = {};
        this.allMenuImplicit = [];
    },
    statics: {
        handleCallback: function handleCallback(callback, parent) {
            //TODO: HACERLO TAMBIÉN CON LOS DEMÁS TIPOS DE LLAMADAS
            if (typeof callback != 'undefined') {
                if (callback != null) {
                    if (callback != '') {
                        if (callback != 0) {
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
        }
    },
    members: {
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
        menuStyle: null,
        getRpcUrl: function getRpcUrl() {
            return qxnw.userPolicies.getRpcUrl();
        },
        removeMenu: function removemenu() {
            try {
                this.menuBar.removeAll();
            } catch (e) {

            }
            qxnw.local.clearKey("menu");
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
        createMenuBar: function createMenuBar() {
            var self = this;
            self.menuBar = new qx.ui.menubar.MenuBar();
            var menuStyle = qxnw.config.getMenuStyle();
            if (self.menuStyle !== null) {
                menuStyle = self.menuStyle;
            }
            if (menuStyle === "horizontal") {
                self.menuBar._setLayout(new qx.ui.layout.VBox());
            }
            self.menuBar.setMargin(1);
            self.menuBar.setAllowGrowY(true);
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
        addMenu: function addMenu(name, callback, parent, icon) {
            var self = this;

            var menuStyle = qxnw.config.getMenuStyle();

            var settings = {
                name: name,
                callback: callback
            };
            //self.saveMenuSettings(settings);

            self.menuHeader = null;
            var mh = new qx.ui.toolbar.MenuButton().set({
                showArrow: false
            });

            self.menuHeader = mh;

            self.__menuUi[name] = mh;

            self.menuHeader.setLabel(name);
            if (self.font !== null) {
                this.menuHeader.setFont(self.font);
            }
            self.menuHeader.setMargin(1);
            self.menuBar.add(self.menuHeader, {
                flex: 1
            });

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
                self.menuHeader.setIcon(ic);
            }

            var mi = new qx.ui.menu.Menu();
            self.menuImplicit = mi;
            self.menuImplicit.setMargin(1);

            self.allMenuImplicit.push(mi);

            if (callback !== 0 && typeof callback !== 'undefined') {
                if (callback !== null) {
                    self.menuHeader.addListener("click", function (e) {
                        console.log("callback", callback);
                        self.handleCallback(callback, parent);
                    });
                }
            }
            return self.menuHeader;
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
        addSubMenuAction: function addSubMenuAction(name, icon, callback, parent, command, param) {

            var self = this;

            var settings = {
                name: name,
                callback: callback
            };

            //self.saveMenuSettings(settings);

            if (this.menu === null) {
                this.menu = new qx.ui.menu.Menu;
            }
            var menuSubAction = new qx.ui.menu.Button();
            if (typeof param != 'undefined') {
                menuSubAction.setUserData("param", param);
            }
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
            menuSubAction.setLabel(name);
            if (icon != 0) {
                menuSubAction.setIcon(ic);
            }
            menuSubAction.setMargin(1);
            if (callback != 0 && typeof callback != 'undefined') {
                menuSubAction.addListener("tap", function (e) {
                    var param = this.getUserData("param");
                    self.handleCallback(callback, parent, param);
                });
            }
            if (self.font == null) {
                this.font = qxnw.utils.populateConfig(this.menuBar);
            }
            if (self.font != null) {
                this.menu.setFont(self.font);
            }
            this.menu.add(menuSubAction);
            this.menuAction.setMenu(this.menu);
        },
        addSubSubMenuAction: function addSubSubMenuAction(name, icon, callback, parent, command) {
            var self = this;

            var settings = {
                name: name,
                callback: callback
            };
            //self.saveMenuSettings(settings);

            if (this.subMenu == null) {
                this.subMenu = new qx.ui.menu.Menu;
            }
            var menuSubAction = new qx.ui.menu.Button();
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
            menuSubAction.setLabel(name);
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
            this.menuAction.setMenu(this.menu);
        },
        handleCallback: function handleCallback(callback, parent, param) {
            var self = this;
            if (typeof param == 'undefined') {
                param = {};
            }
            if (callback === false) {
                return;
            }
            if (callback == 0) {
                return;
            }
            var callArr = callback.split(":");
            if (qxnw.utils.validateIsInteger(callback)) {
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
//                                var splited = callback.split(".");
//                                if (splited.length == 3) {
//                                    var d = new window[callback]();
//                                    d.show();
//                                } else {
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
        addMenuAction: function addMenuAction(name, icon, callback, parent, command, param, parentName) {
            var self = this;
            var settings = {
                name: name,
                callback: callback
            };

            //self.saveMenuSettings(settings);
            this.menu = null;
            var menuButtonFormTest = new qx.ui.menu.Button();
            if (typeof param !== 'undefined') {
                if (param !== null) {
                    menuButtonFormTest.setUserData("param", param);
                }
            }
            this.menuAction = menuButtonFormTest;
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
                            menuButtonFormTest.setCommand(self.createCommand(command, callback, parent));
                        }
                    }
                }
            }

            menuButtonFormTest.setLabel(name);
            if (icon != 0) {
                menuButtonFormTest.setIcon(ic);
            }
            menuButtonFormTest.setMargin(1);
            if (callback != 0 && typeof callback != 'undefined') {
                if (callback != null) {
                    menuButtonFormTest.addListener("tap", function (e) {
                        var param = this.getUserData("param");
                        self.handleCallback(callback, parent, param);
                    });
                }
            }

            if (self.font === null) {
                self.font = qxnw.utils.populateConfig(this.menuBar);
            }

            if (self.font !== null) {
                this.menuImplicit.setFont(self.font);
            }
            this.menuImplicit.add(menuButtonFormTest);
            this.menuImplicit.addSeparator();

            try {
                if (typeof parentName !== 'undefined') {
                    self.__menuUi[parentName].set({
                        showArrow: true
                    });
                }
            } catch (e) {
                console.log(e);
            }

            this.menuHeader.setMenu(this.menuImplicit);
            return menuButtonFormTest;
        },
        exec: function exec(bool, otherParent) {
            if (typeof otherParent !== 'undefined') {
                otherParent.add(this.menuBar, {
                    flex: 1
                });
            } else {
                this.parent.containerMenu.add(this.menuBar);
            }
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
