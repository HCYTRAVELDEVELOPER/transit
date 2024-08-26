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

/* global qxnw */

/**
 *
 * @asset(qx/*)
 * @asset(qxnw/*)
 * @asset(nw_charts/*)
 * @asset(chartjs/*)
 * 
 */

/**
 * Class created to be the main window. Into this class, you can put content as sub-windows, show forms, see some bars and more!
 */
qx.Class.define("qxnw.main", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    /**
     * Gets and create the session data, starts partial layout, sets the rpcUrl value and gets and save the actual theme. 
     */
    construct: function () {
        var self = this;
        self.setRpcUrl();
        self.up = qxnw.userPolicies.getUserData();
        if (self.up === null || typeof self.up.user === 'undefined') {
            var sessionData = qxnw.local.getData("session", false);
            if (typeof sessionData !== 'undefined' && sessionData !== null && sessionData !== "") {
                qxnw.local.setPrefix(sessionData.empresa + "_" + sessionData.usuario);
                qxnw.userPolicies.setUserData(sessionData);
                self.up = qxnw.userPolicies.getUserData();
                self.startPartialLayout();
                self.startMain();
                qxnw.utils.loadingnw_remove("cargando_login_class");
                self.fireEvent("loadedUP");
            } else {
                qxnw.utils.loadingnw("Cargando sesión...", "cargando_login_class");
                var func = function () {
                    self.up = qxnw.userPolicies.getUserData();
                    self.startPartialLayout();
                    self.startMain();
                    qxnw.utils.loadingnw_remove("cargando_login_class");
                    self.fireEvent("loadedUP");
                };
                qxnw.userPolicies.getInstance().getSessionData(func);
            }
        } else {
            self.startPartialLayout();
            self.startMain();
            self.fireEvent("loadedUP");
        }
    },
    destruct: function destruct() {
        try {
            this._disposeObjects("allContainer");
            this._disposeObjects("layout");
            this._disposeObjects("frame");
            this._disposeObjects("MainWindow");
            this._disposeObjects("centralWidget");
            this._disposeObjects("verticalLayout");
            this._disposeObjects("splitter");
            this._disposeObjects("toolBar");
            this._disposeObjects("tabView");
            this._disposeObjects("vAlerts");
            this._disposeObjects("wStatus");
            this._disposeObjects("centerComposite");
            this._disposeObjects("wBar");
            this._disposeObjects("menu");
            this._disposeObjects("__rightContainer");
            for (var i = 0; i < this.ui.length; i++) {
                this._disposeObjects(this.fields[i]);
            }
        } catch (e) {
            qxnw.utils.nwconsole(e);
        }
    },
    events: {
        "loadedGoogleMaps": "qx.event.type.Event",
        "loadedMenuConfig": "qx.event.type.Data",
        "loadedUP": "qx.event.type.Event",
        "loadedWelcome": "qx.event.type.Event"
    },
    properties: {
        googleMapsKey: {
            init: null
        },
        widget: {
            check: "qx.ui.container.Composite"
        },
        module: {
            check: "Integer"
        },
        isCreatedMenu: {
            init: false,
            check: "Boolean"
        }
    },
    statics: {
        setNotificationsCreated: function setNotificationsCreated(bool) {
            this.__isNotificationsCreated = bool;
        },
        isNotificationsCreated: function isNotificationsCreated() {
            return this.__isNotificationsCreated;
        },
        slotNotifications: function slotNotifications() {
            if (!main.__isNotificationsCreated) {
                main.__notification = new qxnw.widgets.notifications(main);
                main.__notification.show();
                main.__isNotificationsCreated = true;
            }
        },
        deleteMenuCache: function deleteMenuCache(preguntar) {
            if (preguntar === false) {
                proceder();
            } else {
                qxnw.utils.question("¿Realmente desea borrar la caché del menú?", function (e) {
                    if (e) {
                        proceder();
                        qxnw.utils.information("¡Caché eliminada correctamente! Se actualizará el navegador en automáticamente...");
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }
                });
            }


            function proceder() {
                localStorage.removeItem("menuHomeLocalQx");
                localStorage.removeItem("nwAdsLocalQx");
                localStorage.removeItem("data_session_get");
                localStorage.removeItem("versionLocalQxJson");

                for (var i = 0; i < localStorage.length; i++) {
                    var valor = localStorage.getItem(localStorage.key(i));
                    var clave = localStorage.key(i);
                    if (typeof clave !== "undefined") {
                        if (clave.indexOf("constructMenuQx_") !== -1
                                || clave.indexOf("menuHomeLocalQx") !== -1
                                || clave == "menuHomeLocalQx"
                                || clave.indexOf("menuHomeLocalQx_subwind_") !== -1
                                ) {
                            localStorage.removeItem(clave);
                            console.log("REMOVED:::: En el índice '" + i + "' clave= " + clave);
                        }
                    }
                }
            }
        },
        slotSalir: function slotSalir() {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "session");
            rpc.setAsync(true);
            var func = function () {

                try {
                    main.callBackOut();
                } catch (e) {
                    console.log(e);
                }

                qxnw.local.storeDataWithOutPrefix("session", null, false);
                qxnw.main.deleteMenuCache(false);

                main.isClosedApp = true;
                var urlOut = qxnw.config.getUrlOut();
                if (urlOut == null) {
                    window.location.reload();
                } else {
                    window.location.href = urlOut;
                }
//                window.location = "/nwlib6/exit.html";
//                window.location = "/";
//                console.log("fddsafa");
//                window.close();
//                parent.window.close();
            };
            var up = qxnw.userPolicies.getUserData();
            rpc.exec("salir", up, func);
        },
        openChat: function openChat() {
            var wChat = new qxnw.chat.init();
            wChat.show();
        },
        openChatMax: function openChatMax() {
            var wChat = new qxnw.chat.init();
            wChat.maximize();
            wChat.setInvalidateStore(true);
            wChat.getChildControl("captionbar").setVisibility("excluded");
            wChat.show();
        },
        openChatMaxPopUp: function openChatMaxPopUp() {
            var hostDomain = window.location.hostname;
            window.open("http://" + hostDomain + "/#chat", 'Chat Corporativo ' + hostDomain, 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=yes,dependent=no,width=600,left=0,height=600,top=0');
        },
        openNotes: function openNotes() {
            main.__wNotes = new qxnw.forms.notes(main);
            main.__wNotes.show();
        },
        slotNwExcel: function slotNwExcel() {
            var d = new qxnw.forms();
            d.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/modulos/nwexcel/index.php");
            main.addSubWindow("Nw Hojas de Cálculo", d);
        },
        slotBtnConfigQxnw: function slotBtnConfigQxnw() {
            var self = main;
            if (self.menu == null) {
                var menuStyle = qxnw.config.getMenuStyle();
                if (menuStyle === "horizontal") {
                    self.menu = new qxnw.menuHorizontal(self);
                } else {
                    self.menu = new qxnw.menu(self);
                }
            }
            self.openMenuScroller();
            self.cleanMenuDebAndConf(true);
//            self.__createAppMenu();
            self.menu.exec(false);
//            self.cleanMenuDebAndConf();
        },
        slotBtnTicketsNw: function slotBtnTicketsNw(domainAlter) {
//            var domain = "https://nwadmin.gruponw.com";
//            if (qxnw.utils.evalueData(domainAlter)) {
//                domain = domainAlter;
//            }
//            var url = domain + "/app/tickets_widget/index.php?domain=" + window.location.origin;

            var modules = "";
            if (qxnw.utils.evalueData(window.localStorage.getItem("menuHomeLocalQx"))) {
                var ra = JSON.parse(window.localStorage.getItem("menuHomeLocalQx"));
                console.log("rararara", ra);
                for (var i = 0; i < ra.modules.length; i++) {
                    var mod = ra.modules[i];
                    modules += mod.nombre;
                    modules += ",";
                    if (qxnw.utils.evalueData(window.localStorage.getItem("menuHomeLocalQx_subwind_" + mod.pariente))) {
                        var rs = JSON.parse(window.localStorage.getItem("menuHomeLocalQx_subwind_" + mod.pariente));
                        if (qxnw.utils.evalueData(rs)) {
                            if (qxnw.utils.evalueData(rs.modules)) {
                                for (var x = 0; x < rs.modules.length; x++) {
                                    modules += mod.nombre + " (" + rs.modules[x].nombre + ") ";
                                    modules += ",";
                                }
                            }
                        }
//                        console.log("rsrsrsrsrsrsrsrsrsrs", rs);
                    }
                }
            }
//            var items = document.querySelectorAll(".btnxq_btlabel");
//            for (var i = 0; i < items.length; i++) {
//                item = items[i];
//                modules += item.innerHTML + ",";
//            }
//            console.log("modules", modules);
            var url = "/nwlib6/nwproject/modules/tickets/index.php?modules=" + modules;
            var d = new qxnw.forms();
            d.setTitle(d.tr("Gestión de tickets :: QXNW"));
            d.addFrame(url);
            d.maximize();
//            if (qxnw.utils.isMobile()) {
//                d.maximize();
//            } else {
//                d.setWidth(1000);
//                d.setHeight(600);
//            }
            d.setTitle("TicketsNw");
            d.setModal(true);
            d.show();
//            main.addSubWindow("TicketsNw", d);
//            window.open(url, '_blank');
        },
        slotLoadModulePQR: function slotLoadModulePQR() {
            var f = new qxnw.basics.forms.f_pqr();
            f.setTitle("PETICIONES, QUEJAS O RECURSOS");

//            f.setModal(true);
////                    var host = window.location.hostname;
////                    var protocol = qxnw.utils.getProtocol();
//                    f.addFrame("/class/qxnw/forms/pqr.js");
////                    f.addFrame(protocol + "//" + host + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/modulos/nw_soporte.php");
//                    f.setWidth(350);
//                    var host = window.location.hostname;
////                    var protocol = qxnw.utils.getProtocol();
//            f.setHeight(470)
            f.show();
        },
        slotTicket: function slotTicket() {
            var f = new qxnw.basics.forms.f_ticket();
            f.setTitle("GENERAR TICKET");
            f.setModal(true);
            f.show();
        },
        slotCrearTicket: function slotCrearTicket(pr) {
            var self = this;
            if (typeof self.l_tickets === 'undefined') {
                self.l_tickets = new qxnw.basics.lists.l_tickets(pr);
                self.l_tickets.setTitle("MIS TICKETS");
                self.l_tickets.maximize();
                self.l_tickets.setModal(true);
                self.l_tickets.show();
                self.l_tickets.addListener("close", function () {
                    delete self.l_tickets;
                });
            } else {
                main.maximizeWindow("qxnw.basics.lists.l_tickets");
                self.l_tickets.maximize();
            }
        },
        slotLoadModule: function slotLoadModule(part, id, noMenu) {
            if (typeof part == 'undefined' || typeof part != "string") {
                qxnw.utils.information("Se presentó un problema cargando el módulo. " + qxnw.utils.supportLink());
                return;
            }
            if (part != "0") {
                var popup = qxnw.utils.createNotifyPopUp(this, "Cargando módulo " + part);
                popup.setAutoHide(false);
            }

            if (part != "0") {
                qx.io.PartLoader.require(part, function (v) {
                    popup.stopAction();
                    main.menu.setVisibility("visible");
                }, this);
            }

            if (typeof noMenu == 'undefined') {
                main.constructMenu(parseInt(id));
            }
            if (part != "0") {
                popup.stopAction();
            } else {
                main.menu.setVisibility("visible");
            }
        }
        ,
        openSupport: function openSupport() {
            var f = new qxnw.forms();
            f.setTitle(this.tr("Soporte especializado"));
            f.setModal(true);
            var host = window.location.hostname;
            var protocol = qxnw.utils.getProtocol();
            f.addFrame(protocol + "//" + host + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/modulos/nw_soporte.php");
            f.setWidth(350);
            f.setHeight(470);
            f.show();
        }
        ,
        openAnyFunction: function openAnyFunction(func, parameter, delay) {
            if (typeof delay != 'undefined') {
                qxnw.utils.loading(main.tr("Cargando componente..."));
//                qxnw.utils.loadingnw("Cargando componente...", "cargando_component_class");
                var timer = new qx.event.Timer(delay);
                timer.start();
                timer.addListener("interval", function (e) {
                    timer.stop();
                    main[func](parameter);
                    qxnw.utils.stopLoading();
//                    qxnw.utils.loadingnw_remove("cargando_component_class");
                });
            } else {
                main[func](parameter);
            }
        },
        openCreateMaster: function openCreateMaster(method, table, title, allPermissions) {
            var d = new qxnw.lists();
            d.setTableMethod(method);
            d.createFromTable(table);
            if (typeof allPermissions == 'undefined') {
                allPermissions = false;
            }
            if (allPermissions) {
                d.setAllPermissions(allPermissions);
            }
            main.addSubWindow(title, d);
        }
        ,
        returnModal: function returnModal() {
            qx.core.Init.getApplication().getRoot().resetBlockerColor();
            qx.core.Init.getApplication().getRoot().resetBlockerOpacity();
        },
        loadCmiReports: function loadCmiReports() {
            var self = this;
            var func = function (filters) {
                if (filters && typeof filters.length !== 'undefined' && filters.length > 0) {
                    var widget = new qxnw.dynamicTable.f_cmi(filters);
                    widget.removeListenerById(widget.getListenerIdAppear());
                    widget.removeListenerById(widget.getListenerIdMove());
                    widget.removeListenerById(widget.getListenerIdResize());
                    widget.setIsInsideTree(false);
                    widget.set({
                        showClose: false,
                        showMinimize: false,
                        showMaximize: false
                    });
                    widget.getChildControl("captionbar").setVisibility("excluded");
                    main.addSubWindow("Informes dinámicos", widget);
                    return;
                } else {
                    qxnw.utils.information(main.tr("No se encontraron reportes para su perfil"));
                }
            };
            var up = qxnw.userPolicies.getUserData();
            qxnw.utils.fastAsyncRpcCall("cmi", "populateScoreCards", up, func);
        }
    },
    members: {
        menuHorizontalLegend: null,
        userDataColumn: null,
        user: null,
        userName: null,
        containerMenuUp: null,
        scrollContainerMenuHorizontal: null,
        closeMenuButton: null,
        __allContainer: null,
        dashBoard: null,
        domainsProducts: {
            "SITCA": "app.sitca.co",
            "SANITCO": "app.sanitco.co",
            "VISITENTRY": "app.visitentry.com",
            "MOVILMOVE": "app.movilmove.com"
        },
        layout: null,
        MainWindow: null,
        centralWidget: null,
        verticalLayout: null,
        splitter: null,
        toolBar: null,
        tabView: null,
        isClosedApp: null,
        __rpcUrl: null,
        labelTotal: null,
        __total: null,
        vAlerts: null,
        __prefix: null,
        __label: null,
        __store: null,
        __pages: null,
        __count: 0,
        menu: null,
        wStatus: null,
        centerComposite: null,
        wBar: null,
        __rightContainer: null,
        __isFavoritesCreated: false,
        __isNotificationsCreated: false,
        __isNotesCreated: false,
        __wNotes: null,
        __timerAlerts: null,
        containerMenu: null,
        __isBaseCreated: false,
        __isCreatedStatusBar: false,
        logo: null,
        __isCreatedLogo: false,
        __notification: null,
        __areDisabledNotifications: false,
        __areAlertedNotifications: false,
        _totalNotifications: 0,
        up: null,
        permisos: [],
        isLoadedGoogleMapScript: false,
        isLoadedDigitalPersonaSDK: false,
        wChat: null,
        initPage: null,
        __timerNotificationsShake: null,
        lang_up_image: null,
        lang_lower_atom: null,
        __idListenerWebLogo: null,
        startMain: function startMain() {
            var self = this;

            if (qxnw.local.getStaredTimer() == false) {
                if (qxnw.config.getSyncLocalSettings()) {
                    var timer = new qx.event.Timer(60000);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        qxnw.local.saveConfigurationsOnServer();
                    });
                    qxnw.local.setStaredTimer(true);
                }
            }

            qxnw.local.start();

            if (qxnw.config.getShowLogo()) {
                var isFindedLogo = false;
                if (typeof self.up.logo != 'undefined') {
                    if (self.up.logo != null) {
                        if (self.up.logo != "") {
                            isFindedLogo = true;
                            var dat = {};
                            dat.logo = self.up.logo;
                            dat.web = self.up.web;
                            self.showLogo(dat);
                        }
                    }
                }
                if (!isFindedLogo) {
                    self.createFloatLogo();
                }
            }

            self.createBase();
            self.__store = [];
            self.__pages = [];

            if (qxnw.userPolicies.getVersion() === "7") {
                try {
                    if (qxnw.utils.getScriptURLParameter("nw-script-main", "version") != null) {
                        qxnw.userPolicies.setVersion(qxnw.utils.getScriptURLParameter("nw-script-main", "version"));
                    }
                } catch (e) {

                }
            }

// TODO: DEPRECATED SENDED BY NOTIFICATIONS
//        if (qxnw.config.getStartAlertsAtInit() === true) {
//            self.initializeAlerts();
//        }

            self.createStatusBar();
            if (qxnw.config.getNotifications() === true) {
                self.startNotifications();
            }

            self.isClosedApp = false;
            if (qxnw.config.getCleanCacheAtFirst()) {
                qxnw.local.clear();
                qxnw.local.storeData("cleanCacheAtFirst", false);
            }
            if (qxnw.local.getData("showScriptIe") == null && qx.core.Environment.get("browser.name") == "ie" && parseInt(qx.core.Environment.get("browser.version")) < 8) {
                qxnw.local.storeData("showScriptIe", true);
                qxnw.utils.question(self.tr("Su navegador es IE versión 8 o inferior. Es necesario instalar unas mejoras para que la experiencia en el sistema sea óptima. ¿Desea descargar la actualización?"), function (e) {
                    if (e) {
                        var win = window.open("http://gruponw.com/downloads/setup.zip", '_blank');
                        win.focus();
                        qxnw.utils.information(self.tr("Por favor descomprima el archivo descargado y realice la instalación. No requiere ninguna configuración especial."));
                    }
                });
            }

            //qxnw.utils.sendAutoNotification(1, {"test": 1});

            if (!qx.core.Environment.get("qx.debug")) {
                if (self.up != null) {
                    var index = qxnw.userPolicies.getDevelopers().indexOf(self.up.user);
                    if (index == -1) {
                        window.onbeforeunload = function (event) {
                            if (!self.isClosedApp) {
                                var message = self.tr('Su sesión en el programa sigue abierta. ¿Desea regresar y cerrarla correctamente?. Recuerde que la seguridad del sistema es un compromiso de todos.');
                                if (typeof event == 'undefined') {
                                    event = window.event;
                                }
                                if (event) {
                                    event.returnValue = message;
                                }
                                return message;
                            } else {
                                window.location.reload();
                            }
                        };
                    }
                }
            } else {
                if (self.up != null && self.up.user != 'andresf') {
                    var index = qxnw.userPolicies.getDevelopers().indexOf(self.up.user);
                    if (index != -1) {
                        var theme = qxnw.local.getOpenData("config_theme");
                        if (theme == null) {
                            qxnw.local.storeOpenData("config_theme", "qxnw_soft");
                            if (!qxnw.config.getInstance().getIsLoadedQxnw_soft()) {
//                            qxnw.utils.loadCss("/nwlib/css/light.css");
//                            qxnw.config.getInstance().setIsLoadedQxnw_soft(true);
                            }
                        }
                    }
                }
            }

            //APPLY PATCHS
            self.__applyPatchs();
            var partLoader = qx.io.PartLoader.getInstance();
            var parts = partLoader.getParts();
            var partsNum = 0;
            for (var key in parts) {
                partsNum++;
            }
            partsNum = partsNum - 1;
            self.counter = 0;
            partLoader.addListener("partLoaded", function (e) {
                self.counter++;
                if (self.counter == partsNum) {
                    if (self.menu != null) {
                        self.menu.setVisibility("visible");
                    }
                }
            });
            partLoader.addListener("partLoadingError", function (e) {
                var part = e.getData();
                qx.io.PartLoader.require(part, function () {
                }, this);
                //qxnw.utils.error(part);
            });

            //TODO: ANDRESF, REVISAR EL TEMA DE LOS BLOQUEOS AL CONSULTAR
            var app = qx.core.Init.getApplication();
            app.returnModal = function () {
                try {
                    qx.core.Init.getApplication().getRoot().resetBlockerColor();
                    qx.core.Init.getApplication().getRoot().resetBlockerOpacity();
//                    qx.core.Init.getApplication().getRoot().forceUnblock();
                } catch (e) {

                }
            };

            var up = qxnw.userPolicies.getUserData();
            if (qx.core.Environment.get("qx.debug") && up.user == "andresf") {
//            qxnw.userPolicies.setShowDashBoard(false);
            }
//        if (up.user == "andresf") {
//            var f = new qxnw.server.forms.f_execText();
//            f.show();
//        }


            //remove loading home initial on load
            var loading = document.querySelector(".h1_carga");
            if (loading) {
                loading.remove();
            }
            var loading = document.querySelector("#playground");
            if (loading) {
                loading.remove();
            }

            if (qx.core.Environment.get("qx.debug") && up.user == "andresf") {
                self.loadWelcome();
            } else {
                self.loadWelcome();
            }

            //TODO: ojo, se debe cambiar por el programador
            //self.loadGoogleMaps();
//            self.loadScreenShots();
            //self.loadAccounting();
            //self.constructMenu(); 
            if (qxnw.config.getShowChatAtInit() === true) {
                var wChat = new qxnw.chat.init();
                wChat.setWinIsMinimized(true);
                self.addMinimizedWindow(wChat);
            }

            self.MainWindow.addListener("appear", function () {
                try {
                    var root = qx.core.Init.getApplication().getRoot();
                    var children = root.getChildren();
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].getUserData("id") == "init_background_image") {
                            children[i].setVisibility("excluded");
                        } else if (children[i].getUserData("id") == "init_logo_image") {
                            children[i].setVisibility("excluded");
                        } else if (children[i].getUserData("id") == "init_fb_image") {
                            children[i].setVisibility("excluded");
                        } else if (children[i].getUserData("id") == "init_g_image") {
                            children[i].setVisibility("excluded");
                        } else if (children[i].getUserData("id") == "init_g_image") {
                            children[i].setVisibility("excluded");
                        }
                    }
                } catch (e) {

                }
            });

            // EJECUTA EL CÓDIGO DE DESARROLLADOR
            if (qxnw.userPolicies.isDeveloper(self.up.user)) {
                if (qx.core.Environment.get("qx.debug")) {
                    try {
                        switch (self.up.user) {
                            case "andresf":
                                qxnw.dev.andresf.test(self);
                                break;
                            case "AndresF":
                                qxnw.dev.andresf.test(self);
                                break;
                            case "alexf":
                                qxnw.dev.alexf.test(self);
                                break;
                            case "ladyg":
                                qxnw.dev.ladyg.test(self);
                                break;
                            case "juliand":
                                qxnw.dev.desarrollo3.test(self);
                                break;
                            case "enderg":
                                qxnw.dev.enderg.test(self);
                                break;
                        }
                    } catch (e) {
                        qxnw.utils.nwconsole(e);
                    }
                }
            }

            try {
                if (document.getElementById("footer_home") != null) {
                    document.getElementById("footer_home_sub").innerHTML = '';
                    document.getElementById("footer_home").innerHTML = '';
                    document.getElementById("footer_home").parentNode.removeChild(document.getElementById("footer_home"));
                }
            } catch (e) {
                qxnw.utils.error(e);
            }


            if (qxnw.userPolicies.getWasAuthByToken() === true) {
                self.wStatus.setVisibility("excluded");
                self.__rightContainer.setVisibility("excluded");
                var t = new qx.event.Timer(3000);
                t.start();
                t.addListener("interval", function (e) {
                    this.stop();
                    try {
                        document.querySelector('.containDateDash').style.display = 'none';
                        document.querySelector('.containerProfilebtns').style.display = 'none';
                    } catch (e) {
                        console.log(e);
                    }
                });
            }

//            self.loadCmiReports();

//        var localeManager = qx.locale.Manager.getInstance();
//        var locales = localeManager.getAvailableLocales().sort();
//        var currentLocale = localeManager.getLocale();
//        console.log(currentLocale);

            // var local = qx.locale.Manager.getInstance().getLocale();
            //console.log(local);
//        qx.locale.Manager.getInstance().setLocale("es_CO");

//        qx.locale.Manager.getInstance().addListener("changeLocale", function (e) {
//            try {
//                var locale = e.getData();
//                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_short": "yyyy-L-dd"});
//                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_full": "yyyy-L-dd"});
//                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_long": "yyyy-L-dd"});
//                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_medium": "yyyy-MM-dd"});
//                self.debug("Locale=" + locale + ", dateFormat=" + qx.locale.Date.getDateFormat("short", locale));
//                self.debug("Locale=" + locale + ", dateFormat=" + qx.locale.Date.getDateFormat("long", locale));
//            } catch (e) {
//
//            }
//        });

//        var state = qx.bom.History.getInstance().getState();
//        console.log(state);
//
//        qx.bom.History.getInstance().addListener("request", function (e) {
//            var state = e.getData();
//            console.log(state);
//            // application specific state update (= application code)
//            var app = window.application;
//            app.setApplicationState(state);
//        }, this);
//        qx.locale.Manager.getInstance().addLocale("es", {"cldr_number_group_separator": ","});
            //qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.aristo.Aristo);
            //qx.Theme.include(qxnw.theme.modern.Appearance, qx.theme.manager.Meta.getInstance().getTheme());
            //console.log(qx.locale.Date.getDateFormat("medium"));
            //qx.locale.Manager.getInstance().addLocale("es", {"cldr_number_group_separator": ","});

        },
        openSupport: function openSupport() {
            var f = new qxnw.forms();
            f.setTitle(this.tr("Soporte especializado"));
            f.setModal(true);
            var host = window.location.hostname;
            var protocol = qxnw.utils.getProtocol();
            f.addFrame(protocol + "//" + host + "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/modulos/nw_soporte.php");
            f.setWidth(350);
            f.setHeight(470);
            f.show();
        },
        slotOpenManual: function slotOpenManual(id) {
            var func = function (r) {
                var regex = /<iframe.*?src='(.*?)'/;
                var src = regex.exec(r.path)[1];
                var f = new qxnw.forms();
                f.setTitle("Manual de " + r.nombre);
                f.addFrame(src);
                f.createDeffectButtons();
                f.ui.accept.setVisibility("excluded");
                f.ui.cancel.addListener("execute", function () {
                    f.reject();
                });
                f.maximize();
                f.show();
            };
            qxnw.utils.fastAsyncRpcCall("master", "getManualById", id, func);
        },
        receiveHTMLCalculateDev: function receiveHTMLCalculateDev(html) {
            var self = this;
            var func = function (rta) {
                if (rta === true) {
                    qxnw.utils.information(self.tr("Datos guardados correctamente"));
                }
            }
            qxnw.utils.fastAsyncRpcCall("master", "saveNWCalculateHTMLDev", html, func);
        },
        receiveHTMLCalculateEnc: function receiveHTMLCalculateEnc(html) {
            var self = this;
            var func = function (rta) {
                if (rta === true) {
                    qxnw.utils.information(self.tr("Datos guardados correctamente"));
                }
            }
            qxnw.utils.fastAsyncRpcCall("master", "saveNWCalculateHTML", html, func);
        },
        setTheme: function setTheme(theme) {
            qxnw.local.setData("config_theme", theme);
        },
        loadAccounting: function loadAccounting() {
            var sl = new qx.bom.request.Script();
            var src = qx.util.ResourceManager.getInstance().toUri("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/includes/accounting.min.js");
            sl.open("GET", src);
            sl.send();
            var func = function (status) {
                if (status) {
                    accounting.settings.currency.thousand = ".";
                    accounting.settings.number.thousand = ".";
                    accounting.settings.currency.precision = "0";
                }
            };
            sl.setDetermineSuccess(func);
            return;
        },
        loadGoogleMaps: function loadGoogleMaps(placesLibrary) {
            if (!this.isLoadedGoogleMapScript) {
                window.initialize = function () {
                    var mapOptions = {};
                    main.fireEvent("loadedGoogleMaps");
                    main.isLoadedGoogleMapScript = true;
                };
                var script = document.createElement("script");
//                script.onload = function () {
//                    main.fireEvent("loadedGoogleMaps");
//                    main.isLoadedGoogleMapScript = true;
//                };
                script.type = "text/javascript";
                if (typeof placesLibrary == 'undefined') {
                    placesLibrary = "";
                } else {
                    placesLibrary = "&" + placesLibrary;
                }
                var key = "AIzaSyBlqkcJcLStw3Mbqou7Qa504VdJwfFpvis";
                if (this.getGoogleMapsKey() !== null) {
                    key = this.getGoogleMapsKey();
                }
                console.log("LOAD GOOGLE MAPS");
                script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&key=" + key + "&callback=initialize" + placesLibrary;
                document.body.appendChild(script);
            }
        },
        loadDigitalPersonaSDK: function loadDigitalPersonaSDK() {
            if (!this.isLoadedDigitalPersonaSDK) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/per/scripts/es6-shim.js";
                document.body.appendChild(script);
                script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/per/scripts/websdk.client.bundle.min.js";
                document.body.appendChild(script);
                script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/per/scripts/fingerprint.sdk.min.js";
                document.body.appendChild(script);
                this.isLoadedDigitalPersonaSDK = true;
            }
        },
        loadScreenShots: function loadScreenShots() {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/modulos/screenshot/html2canvas.js";
            document.body.appendChild(script);
        },
        removeClass: function (el, cls, isWidget) {
            var di = null;
            if (isWidget === true) {
                di = el;
                di.classList.remove(cls);
            } else {
                di = document.querySelectorAll(el);
            }
            var t = di.length;
            for (var i = 0; i < t; i++) {
                var d = di[i];
                d.classList.remove(cls);
            }
            return true;
        },
        addClass: function (el, cls) {
            if (typeof el === "string") {
                el = document.querySelector(el);
            }
            if (!el) {
                console.log("%c<<<<ERROR: nw.utils.addClass>>>>", 'background: red; color: #fff');
                console.log("El elemento no existe para la clase " + cls, el);
                return false;
            }
            if (el.classList) {
                el.classList.add(cls);
            } else {
                var cur = ' ' + (el.getAttribute('class') || '') + ' ';
                if (cur.indexOf(' ' + cls + ' ') < 0) {
                    setClass(el, (cur + cls).trim());
                }
            }
            return true;
        },
        newDashBoard: function newDashBoard() {
            var self = this;
//            var root = qx.core.Init.getApplication().getRoot();
//            this.MainWindow.addListener("appear", function () {
            var up = qxnw.userPolicies.getUserData();
            var d = new qxnw.basics.forms.f_dashboard_new();
            self.dashBoard = d;
//                d.show();
//                return;
//            var title = "Bienvenid@ " + up.name;
            var title = "Home";
            self.initPage = self.addSubWindow(title, d, false, false);
            self.initPage.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_mainTabUserWelcome");
                self.fireEvent("loadedWelcome");
            });
//            d.init();
//            });
        },
        loadWelcome: function loadWelcome() {
            var self = this;
            if (qx.core.Environment.get("qx.debug") && self.up.user == "andresf" && qxnw.userPolicies.getShowDashBoard() == false) {
                return;
            }
            if (qxnw.userPolicies.versionDashboard === 2) {
                //nuevo dashboard, alexf 2022 abril 21
                self.addClass(document.body, "bodyNewDashboard");
                self.newDashBoard();
                return;
            }

            var up = qxnw.userPolicies.getUserData();
            var d = new qxnw.forms();

//            var script_ckeditor = document.createElement("script");
//            script_ckeditor.type = "text/javascript";
//            script_ckeditor.src = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/dashboard/js/main.js";
//            document.body.appendChild(script_ckeditor);
            var lee = 0;
            d.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_mainUserWelcome");
//                 self.iframe.getContentElement().getDomElement().id = "topFrame";
                this.getContentElement().getDomElement().id = "loadWelcome";
//                document.querySelector('div.nw_mainUserWelcome').id = 'loadWelcome';
//                var timeoutID;
//                    timeoutID = window.setTimeout(load, 2000);
                function load() {
                    if (typeof qxnw.userPolicies.isProduct != 'undefined' && qxnw.userPolicies.isProduct() === true) {
                        var url_data = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/user_bienvenido.php";
                    } else {
                        var url_data = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/user_bienvenido.php";
                    }
                    var xmlhttp;
                    if (window.XMLHttpRequest) {
                        xmlhttp = new XMLHttpRequest();
                    } else {
                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            document.getElementById("loadWelcome").innerHTML = xmlhttp.responseText;
                        }
                    };
                    xmlhttp.open("GET", url_data, true);
                    xmlhttp.send();
                }
                function loadWall() {
                    var xmlhttp;
                    if (window.XMLHttpRequest) {
                        xmlhttp = new XMLHttpRequest();
                    } else {
                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            if (document.getElementById("walk") != null) {
                                document.getElementById("walk").innerHTML = xmlhttp.responseText;
                            }
                        }
                    };
                    xmlhttp.open("GET", "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/modulos/nw_tareas/walk.php");
                    xmlhttp.send();
                }
                var hash = location.hash;
                if (hash == "#chat") {
                    parent.qxnw.main.openChatMax();
                    return;
                } else {
                    if (lee == 1) {
//                         document.addEventListener("DOMContentLoaded", load);
//                         document.addEventListener("DOMContentLoaded", loadWall);
                        load();
                        loadWall();
                    }
                }
            });
            if (lee == 0) {
                if (typeof qxnw.userPolicies.isProduct != 'undefined' && qxnw.userPolicies.isProduct() === true) {
                    //var frame = d.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/user_bienvenido_productos.php");
                    var dat = {};
                    dat["products"] = true;
                    var frame = d.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/user_bienvenido.php?1=1", false, dat);
                } else {
                    var frame = d.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/user_bienvenido.php");
                }
                frame.addListener("appear", function () {
                    frame.getContentElement().getDomElement().id = "frame_home";
                });
            }
            var direccion = location.href;
            if (direccion == "http://nwposzonafria.gruponw.com/" || direccion == "https://sistemapos.zonafria.co/") {
                this.initPage = this.addSubWindow("Bienvenid@ " + up.name + ". Está conectado en la bodega: " + up.nom_bodega, d, false, false);
            } else {
                this.initPage = this.addSubWindow("Bienvenid@ " + up.name, d, false, false);
            }
            this.initPage.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_mainTabUserWelcome");
            });
        },
        __applyPatchs: function __applyPatchs() {
//TODO: INTENTO DE SOLUCIONAR EL PROBLEMA DEL ORDENAMIENTO
//            qx.Mixin.define("qxnw.table.modelSortedSimple", {
//                statics: {
//                    _defaultSortComparatorAscending: function (row1, row2) {
//                        var obj1 = row1[arguments.callee.columnIndex];
//                        var obj2 = row2[arguments.callee.columnIndex];
//                        console.log({
//                            obj1: obj1,
//                            obj2: obj2
//                        });
//                        if (qx.lang.Type.isNumber(obj1) && qx.lang.Type.isNumber(obj2)) {
//                            var result = isNaN(obj1) ? isNaN(obj2) ? 0 : 1 : isNaN(obj2) ? -1 : null;
//                            if (result != null) {
//                                return result;
//                            }
//                        }
//                        return (obj1 > obj2) ? 1 : ((obj1 == obj2) ? 0 : -1);
//                    }
//                }
//            });
//            qx.Class.patch(qx.ui.table.model.Simple, qxnw.table.modelSortedSimple);
            //TODO: IMPORTANTE, VER CLASE modelFiltered para agregar directamente al qooxdoo
            //TODO: PARA EL TAMAÑO DE LOS FONTS DE LOS LISTADOS AGREGAR: framework/source/class/qx/ui/table/cellrenderer/Abstract.js :
            //ADDED BY ANDRESF
//            var fontSize = 11;
//            var fz = qxnw.local.getData("config_font_size");
//            if (fz != null) {
//                fontSize = fz;
//            }
            //      var stylesheet =
            //        ".qooxdoo-table-cell {" +
            //        qx.bom.element.Style.compile(
            //        {
            //          position : "absolute",
            //          top: "0px",
            //          overflow: "hidden",
            //          whiteSpace : "nowrap",
            //          borderRight : "1px solid " + colorMgr.resolve("table-column-line"),
            //          padding : "0px 6px",
            //          cursor : "default",
            //	  fontSize : fontSize + "px", // <-------------- here ;-) 
            //TODO: se cambia la clase qx.event.handler.Appear línea 157:
            //if (typeof elem == 'undefined') {
            //  return;
            //}
            //TODO: IMPORTANTE->AGREGAR EL SIGUIENTE MÉTODO A LA FUNCIÓN _onPageClose DE LA CLASE: qx.ui.tabview.TabView
//        if (typeof this.getAskOnCloseSubWindow != 'undefined' && this.getAskOnCloseSubWindow === true) {
//                var these = this;
//                // reset the old close button states, before remove page
//                // see http://bugzilla.qooxdoo.org/show_bug.cgi?id=3763 for details
//                qxnw.utils.question(this.tr("¿Está segur@ de cerrar la ventana?"), function (ea) {
//                    if (ea) {
//                        var page = e.getTarget();
//                        var closeButton = page.getButton().getChildControl("close-button");
//                        closeButton.reset();
//                        these.remove(page);
//                    }
//                });
//            } else {
//                var page = e.getTarget();
//                var closeButton = page.getButton().getChildControl("close-button");
//                closeButton.reset();
//                this.remove(page);
//            }
            qx.Mixin.define("qxnw.table.columnMenuButton", {
                members: {
                    factory: function (item, options) {
                        switch (item)
                        {
                            case "menu":
                                var menu = new qx.ui.menu.Menu();
                                this.setMenu(menu);
                                return menu;
                            case "menu-button":
                                var menuButton = new qx.ui.table.columnmenu.MenuItem(options.text);
                                if (qxnw.utils.versionCompare(qx.core.Environment.get("qx.version"), "5.0.0") > 0) {
                                    menuButton.setColumnVisible(options.bVisible);
                                } else {
                                    menuButton.setVisible(options.bVisible);
                                }
                                this.getMenu().add(menuButton);
                                return menuButton;
                            case "user-button":
                                var button = new qx.ui.menu.Button(options.text);
                                button.set(
                                        {
                                            appearance: "table-column-reset-button"
                                        });
                                return button;
                            case "simple-checkbox":
                                var button = new qx.ui.menu.CheckBox(options.text);
                                button.set(
                                        {
                                            appearance: "table-column-reset-button"
                                        });
                                return button;
                            case "separator":
                                return new qx.ui.menu.Separator();
                            default:
                                throw new Error("Unrecognized factory request: " + item);
                        }
                    }
                }
            });
            qx.Class.patch(qx.ui.table.columnmenu.Button, qxnw.table.columnMenuButton);
//            qx.Mixin.define("qxnw.model.getSelectedCount", {
//                members: {
//                    getSelectedCount: function() {
//                        var selectedCount = 0;
//                        if (this.__selectedRangeArr == null) {
//                            return;
//                        }
//                        for (var i = 0; i < this.__selectedRangeArr.length; i++) {
//                            var range = this.__selectedRangeArr[i];
//                            selectedCount += range.maxIndex - range.minIndex + 1;
//                        }
//                        return selectedCount;
//                    }
//                }
//            });
//            qx.Class.patch(qx.ui.table.selection.Model, qxnw.model.getSelectedCount);

//TODO: cambiar en la clase qx.ui.table.cellrenderer.Boolean: línea 150 
            // default:
            //TODO: ADDED BY ANDRESF
            // imageHints.url = this.__iconUrlFalse;
            // break;

            qx.Mixin.define("qxnw.table.pane", {
                members: {
                    getTableContainer: function () {
                        return this.__tableContainer;
                    }
                }
            });
            qx.Class.patch(qx.ui.table.pane.Pane, qxnw.table.pane);
            qx.Mixin.define("qxnw.table.pane.scroller", {
                members: {
                    scrollCellVisible: function (col, row) {
                        try {
                            var paneModel = this.getTablePaneModel();
                            var xPos = paneModel.getX(col);
                            if (xPos != -1) {
                                var clipperSize = this._paneClipper.getInnerSize();
                                if (!clipperSize) {
                                    return;
                                }

                                var columnModel = this.getTable().getTableColumnModel();
                                var colLeft = paneModel.getColumnLeft(col);
                                var colWidth = columnModel.getColumnWidth(col);
                                var rowHeight = this.getTable().getRowHeight();
                                var rowTop = row * rowHeight;
                                var scrollX = this.getScrollX();
                                var scrollY = this.getScrollY();
                                // NOTE: We don't use qx.lang.Number.limit, because min should win if max < min
                                var minScrollX = Math.min(colLeft, colLeft + colWidth - clipperSize.width);
                                var maxScrollX = colLeft;
                                this.setScrollX(Math.max(minScrollX, Math.min(maxScrollX, scrollX)));
                                var minScrollY = rowTop + rowHeight - clipperSize.height;
                                if (this.getTable().getKeepFirstVisibleRowComplete()) {
                                    minScrollY += rowHeight;
                                }

                                var maxScrollY = rowTop;
                                this.setScrollY(Math.max(minScrollY, Math.min(maxScrollY, scrollY)), true);
                            }
                        } catch (e) {

                        }
                    }
                }
            });
            qx.Class.patch(qx.ui.table.pane.Scroller, qxnw.table.pane.scroller);
            qx.Mixin.define("qxnw.request", {
                members: {
                    _oncompleted: function (e) {

                        if (qx.core.Environment.get("qx.debug")) {
                            if (qx.core.Environment.get("qx.debug.io.remote")) {
                                if (e.getTarget()._counted) {
                                    this.__activeCount--;
                                    this.debug("ActiveCount: " + this.__activeCount);
                                }
                            }
                        }

                        // delegate the event to the handler method of the request depending
                        // on the current type of the event ( completed|aborted|timeout|failed )
                        var request = e.getTarget().getRequest();
                        var requestHandler = "_on" + e.getType();
                        // remove the request from the queue,
                        // keep local reference, see [BUG #4422]
                        this._remove(e.getTarget());
                        // It's possible that the request handler can fail, possibly due to
                        // being sent garbage data. We want to prevent that from crashing
                        // the program, but instead display an error.

                        var content = e.getContent();
                        if (content !== null) {
                            content = content.replace(/\0/g, '');
//                            content = content.replace(/\u0/g, '');
                            e.setContent(content);
                        }

                        try {
                            if (request[requestHandler]) {
                                request[requestHandler](e);
                            }
                        } catch (ex) {

                            this.error("Request " + request + ", handler " + requestHandler + " threw an error: ", ex);
                            // Issue an "aborted" event so the application gets notified.
                            // If that too fails, or if there's no "aborted" handler, ignore it.

                            qxnw.utils.error(ex);
                            try {
                                if (request["_onaborted"]) {
                                    var event = qx.event.Registration.createEvent("aborted", qx.event.type.Event);
                                    request["_onaborted"](event);
                                }
                            } catch (ex1) {

                            }
                        }
                    }
                }
            });
            qx.Class.patch(qx.io.remote.RequestQueue, qxnw.request);
            qx.Mixin.define("qxnw.defaultSortComparatorInsensitiveAscending", {
                members: {
                    _defaultSortComparatorInsensitiveAscending: function (row1, row2) {

                        var elm1 = typeof row1[arguments.callee.columnIndex] == 'undefined' ? "" : row1[arguments.callee.columnIndex];
                        var elm2 = typeof row2[arguments.callee.columnIndex] == 'undefined' ? "" : row2[arguments.callee.columnIndex];
                        var obj1 = (elm1.toLowerCase ? elm1.toLowerCase() : elm1);
                        var obj2 = (elm2.toLowerCase ? elm2.toLowerCase() : elm2);
                        if (qx.lang.Type.isNumber(obj1) && qx.lang.Type.isNumber(obj2)) {
                            var result = isNaN(obj1) ? isNaN(obj2) ? 0 : 1 : isNaN(obj2) ? -1 : null;
                            if (result != null) {
                                return result;
                            }
                        }
                        return (obj1 > obj2) ? 1 : ((obj1 == obj2) ? 0 : -1);
                    }
                }
            });
            qx.Class.patch(qx.ui.table.model.Simple, qxnw.defaultSortComparatorInsensitiveAscending);
            qx.Mixin.define("qxnw.getTempArray", {
                members: {
                    getFullArray: function () {
                        return this.__fullArr;
                    }
                }
            });
            qx.Class.patch(qx.ui.table.model.Filtered, qxnw.getTempArray);
            qx.Mixin.define("qxnw.getHeaderClipper", {
                members: {
                    getHeaderClipper: function () {
                        return this._headerClipper;
                    }
                }
            });
            qx.Class.patch(qx.ui.table.pane.Scroller, qxnw.getHeaderClipper);
            qx.Mixin.define("qxnw.scrollPane", {
                members: {
                    /**
                     * Event listener for scroll event of content
                     *
                     * @param e {qx.event.type.Event} Scroll event object
                     */
                    _onScroll: function (e) {
                        try {
                            var contentEl = this.getContentElement();
                            this.setScrollX(contentEl.getScrollX());
                            this.setScrollY(contentEl.getScrollY());
                        } catch (e) {

                        }
                    }
                }
            });
            qx.Class.patch(qx.ui.core.scroll.ScrollPane, qxnw.scrollPane);
            qx.Mixin.define("qxnw.tableInitIconMenu", {
                members: {
                    _initColumnMenu: function () {
                        var tableModel = this.getTableModel();
                        var columnModel = this.getTableColumnModel();
                        var columnButton = this.getChildControl("column-button");
                        // Remove all items from the menu. We'll rebuild it here.
                        columnButton.empty();
                        // Inform listeners who may want to insert menu items at the beginning
                        var menu = columnButton.getMenu();
                        var data =
                                {
                                    table: this,
                                    menu: menu,
                                    columnButton: columnButton
                                };
                        this.fireDataEvent("columnVisibilityMenuCreateStart", data);
                        this.__columnMenuButtons = {};
                        for (var col = 0, l = tableModel.getColumnCount(); col < l; col++) {
                            var id = tableModel.getColumnId(col);
                            var isExcluded = false;
                            if (typeof this.hiddenColumnsNW != 'undefined' && this.hiddenColumnsNW != null) {
                                for (var ia = 0; ia < this.hiddenColumnsNW.length; ia++) {
                                    if (id == this.hiddenColumnsNW[ia]) {
                                        isExcluded = true;
                                        break;
                                    }
                                }
                            }
                            if (isExcluded === false) {
                                var menuButton = columnButton.factory("menu-button", {
                                    text: tableModel.getColumnName(col),
                                    column: col,
                                    bVisible: columnModel.isColumnVisible(col)
                                });
                                menuButton.getChildControl("label").setRich(true);
                                qx.core.Assert.assertInterface(menuButton, qx.ui.table.IColumnMenuItem);
                                if (qxnw.utils.versionCompare(qx.core.Environment.get("qx.version"), "5.0.0") > 0) {
                                    menuButton.addListener("changeColumnVisible", this._createColumnVisibilityCheckBoxHandler(col), this);
                                } else {
                                    menuButton.addListener("changeVisible", this._createColumnVisibilityCheckBoxHandler(col), this);
                                }
                                this.__columnMenuButtons[col] = menuButton;
                            }
                        }

                        // Inform listeners who may want to insert menu items at the end
                        data =
                                {
                                    table: this,
                                    menu: menu,
                                    columnButton: columnButton
                                };
                        this.fireDataEvent("columnVisibilityMenuCreateEnd", data);
                    }
                }
            });
            qx.Class.patch(qx.ui.table.Table, qxnw.tableInitIconMenu);
            qx.Mixin.define("qxnw.tableCellRendererBoolean", {
                members: {
                    _identifyImage: function (cellInfo) {
                        var imageHints = {
                            imageWidth: 11,
                            imageHeight: 11
                        };
                        var aliasManager = qx.util.AliasManager.getInstance();
                        switch (cellInfo.value) {
                            case true:
                                imageHints.url = aliasManager.resolve(this.getIconTrue());
                                break;
                            case "t":
                                imageHints.url = aliasManager.resolve(this.getIconTrue());
                                break;
                            case false:
                                imageHints.url = aliasManager.resolve(this.getIconFalse());
                                break;
                            case "f":
                                imageHints.url = aliasManager.resolve(this.getIconFalse());
                                break;
                            case "":
                                imageHints.url = aliasManager.resolve(this.getIconFalse());
                                break;
                            default:
                                imageHints.url = null;
                                break;
                        }

                        return imageHints;
                    }
                }
            });
            qx.Class.patch(qx.ui.table.cellrenderer.Boolean, qxnw.tableCellRendererBoolean);
            qx.Mixin.define("qxnw.defaultHeaderRenderer", {
                members: {
                    createHeaderCell: function (cellInfo) {
                        var widget = new qx.ui.table.headerrenderer.HeaderCell();
                        widget.showFilterIcon = function (value, icon) {
                            this.getChildControl("filter-icon").setSource(icon);
                            if (value) {
                                this._showChildControl("filter-icon");
                            } else {
                                this._excludeChildControl("filter-icon");
                            }
                        };
                        var info = [];
                        info["col"] = cellInfo.col;
                        widget.setUserData("cellAllInfo", info);
                        this.updateHeaderCell(cellInfo, widget);
                        return widget;
                    }
                    // property apply
                }
            });
            qx.Class.patch(qx.ui.table.headerrenderer.Default, qxnw.defaultHeaderRenderer);
//            TODO: REVISAR MUY BIEN-FIX getChildren
//            qx.Mixin.define("qxnw.tableGetPaneScroller", {
//                members: {
//                    _getPaneScrollerArr: function _getPaneScrollerArr() {
//                        if (this.__scrollerParent != null) {
//                            return this.__scrollerParent.getChildren();
//                        } else {
//                            return [];
//                        }
//                    }
//                }
//            });
//            qx.Class.patch(qx.ui.table.Table, qxnw.tableGetPaneScroller);

            qx.Mixin.define("qxnw.colorPopupPatch", {
                members: {
                    _createColorSelector: function () {
                        if (this.__colorSelector) {
                            return;
                        }

                        var win = new qxnw.forms();
                        win.setTitle(this.tr("Selector de color"));
                        win.setShowMinimize(false);
                        win.setShowMaximize(false);
                        win.setShowClose(false);
                        this.__colorSelectorWindow = win;
                        win.setLayout(new qx.ui.layout.VBox(16));
                        win.setResizable(false);
                        this.__colorSelector = new qx.ui.control.ColorSelector;
                        this.colorSelector = this.__colorSelector;
                        win.addWidget(this.__colorSelector);
                        var buttonBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(8, "right"));
                        win.addWidget(buttonBar);
                        var btnCancel = this._createChildControl("colorselector-cancelbutton");
                        var btnOk = this._createChildControl("colorselector-okbutton");
                        buttonBar.add(btnCancel);
                        buttonBar.add(btnOk);
                    }
                }
            });
            qx.Class.patch(qx.ui.control.ColorPopup, qxnw.colorPopupPatch);
            qx.Mixin.define("qxnw.headerPatch", {
                members: {
                    _createChildControlImpl: function (id) {
                        var control;
                        switch (id) {
                            case "label":
                                control = new qx.ui.basic.Label(this.getLabel()).set({
                                    anonymous: true,
                                    allowShrinkX: true,
                                    rich: true
                                });
                                this._add(control, {row: 0, column: 1});
                                break;
                            case "sort-icon":
                                control = new qx.ui.basic.Image(this.getSortIcon());
                                control.setAnonymous(true);
                                this._add(control, {row: 0, column: 2});
                                break;
                            case "filter-icon":
                                control = new qx.ui.basic.Image(qxnw.config.execIcon("view-sort-descending"));
                                control.setAnonymous(true);
                                this._add(control, {row: 0, column: 3});
                                break;
                            case "icon":
                                control = new qx.ui.basic.Image(this.getIcon()).set({
                                    anonymous: true,
                                    allowShrinkX: true
                                });
                                this._add(control, {row: 0, column: 0});
                                break;
                        }

                        return control || this.base(arguments, id);
                    }
                }
            });
            qx.Class.patch(qx.ui.table.headerrenderer.HeaderCell, qxnw.headerPatch);
        },
        openDevelopersView: function openDevelopersView() {
            var self = this;
            self.menu.addMenu(self.tr("Developers"), 0, self, "categories/engineering.png");
            self.menu.addMenuAction(self.tr("Módulos"), "actions/window-new.png", "__slotModules", self);
            self.menu.addMenuAction(self.tr("Servidores DB"), "actions/insert-link.png", "__slotConfigServersDb", self);

            self.menu.addMenuAction(self.tr("Crear formulario HTML"), "actions/mail-send.png", "", self);
            self.menu.addSubMenuAction(self.tr("Listado general HTML"), "actions/bookmark-new.png", "slotHtmlForms", self);

            self.menu.addMenuAction(self.tr("Ayudas desarrollador"), "categories/development.png", "", self);
            self.menu.addSubMenuAction(self.tr("Muestra descripciones tablas"), "apps/internet-feed-reader.png", "slotDeveloperDescriptions", self);
            self.menu.addSubMenuAction(self.tr("Listado normal"), "apps/internet-feed-reader.png", "slotDeveloperList", self);
            self.menu.addSubMenuAction(self.tr("Listado editable"), "apps/internet-feed-reader.png", "slotDeveloperListEditable", self);
            self.menu.addSubMenuAction(self.tr("Formulario normal"), "apps/internet-feed-reader.png", "slotDeveloperForm", self);
            self.menu.addSubMenuAction(self.tr("Formulario con navTables"), "apps/internet-feed-reader.png", "slotDeveloperFormNav", self);
            self.menu.addSubMenuAction(self.tr("NavTable"), "apps/internet-feed-reader.png", "slotDeveloperNav", self);
            self.menu.addSubMenuAction(self.tr("Tester Biostar 2"), "apps/preferences-users.png", "slotTestApiBiostar2", self);

            self.menu.addMenuAction(self.tr("Informes SQL-Excel"), "actions/document-save.png", 0, self);
            self.menu.addSubMenuAction(self.tr("Listado general"), "actions/bookmark-new.png", "slotExcelReports", self);

            self.menu.addMenuAction(self.tr("Reporte"), "apps/utilities-statistics.png", 0, self);
            self.menu.addSubMenuAction(self.tr("Administración general"), "apps/utilities-graphics-viewer.png", "slotEncReports", self);
            self.menu.addSubMenuAction(self.tr("Tipos de reportes"), "apps/office-layout.png", "slotTypeReport", self);

            self.menu.addMenuAction(self.tr("Pagos"), "status/security-high.png", 0, self);
            self.menu.addSubMenuAction(self.tr("Prueba de pagos PaYU"), "apps/utilities-graphics-viewer.png", "slotPagosPayU", self);

            if (self.up.user == "andresf" || self.up.user == "alexf") {
                self.menu.addMenuAction(self.tr("Chat"), "apps/internet-messenger.png", 0, self);
                self.menu.addSubMenuAction(self.tr("Vista general"), "apps/office-layout.png", "slotChatVistaGeneral", self);
                self.menu.addSubMenuAction(self.tr("Salas"), "apps/internet-telephony.png", "slotChatSalas", self);
                self.menu.addSubMenuAction(self.tr("Usuarios por sala"), "apps/preferences-users.png", "slotChatSalasPorUsuario", self);
            }

            self.menu.addMenuAction(self.tr("Administrador de archivos"), "apps/office-database.png", 0, self);
            self.menu.addSubMenuAction(self.tr("Todos los Archivos del Servidor"), "apps/office-writer.png", "slotFileManager", self);
            self.menu.addSubMenuAction(self.tr("Archivos disponibles"), "apps/office-writer.png", "slotFilesAdministrator", self);
            self.menu.addSubMenuAction(self.tr("Listado de descargas"), "actions/document-save-as.png", "slotFilesAdministratorDownloadList", self);
            self.menu.addSubMenuAction(self.tr("Listado de observaciones al descargar"), "categories/graphics.png", "slotFilesAdministratorDownloadObs", self);

            self.menu.addMenuAction(self.tr("Administrador de impresiones y encabezados"), "actions/document-print-preview.png", 0, self);
            self.menu.addSubMenuAction(self.tr("Encabezado y pie de página"), "apps/utilities-dictionary.png", "slotPrinterSettings", self);
            self.menu.addSubMenuAction(self.tr("Encabezados exportaciones"), "actions/document-save.png", "slotManageEncExport", self);

            self.menu.addMenuAction(self.tr("Administrador de archivos / imágenes"), "apps/utilities-color-chooser.png", "slotOpenAdminFiles", self);
            self.menu.addMenuAction(self.tr("Notificaciones"), "actions/mail-mark-important.png", "slotManageNotifications", self);
            self.menu.addMenuAction(self.tr("Exportaciones dinámicas"), "actions/document-save.png", "slotExports", self);
            self.menu.addMenuAction(self.tr("Importaciones dinámicas"), "actions/document-save.png", "slotImport", self);
            self.menu.addMenuAction(self.tr("Sincronización de datos"), "actions/view-refresh.png", "slotSyncAdmin", self);
            self.menu.addMenuAction(self.tr("Importación a tablas"), "actions/list-add.png", "slotOpenImport", self);
            self.menu.addMenuAction(self.tr("Trabajos de servidor"), "apps/internet-telephony.png", "slotCronJobs", self);

            self.menu.addMenuAction(self.tr("Configuraciones generales"), "actions/go-home.png", 0, self);
            self.menu.addSubMenuAction(self.tr("Configuraciones regionales"), "apps/preferences-locale.png", "slotLocale", self);
            self.menu.addSubMenuAction(self.tr("Imágenes y mensaje de inicio"), "actions/insert-image.png", "slotInitSettings", self);
            self.menu.addSubMenuAction(self.tr("Configuración de Diseño Home"), "actions/insert-image.png", "slotInitSettingsDiseno", self);
            //self.menu.addSubMenuAction(self.tr("Direcciones IP Autorizadas"), "actions/insert-image.png", "admin_files:images", self);
            //self.menu.addSubMenuAction(self.tr("Firma"), "actions/insert-image.png", "admin_files:images", self);
            //self.menu.addSubMenuAction(self.tr("Horarios de permisos"), "actions/insert-image.png", "admin_files:images", self);
            self.menu.addSubMenuAction(self.tr("Empresas"), "apps/preferences-theme.png", "slotNWEmpresas", self);
            self.menu.addSubMenuAction(self.tr("Terminales"), "apps/preferences-theme.png", "slotNWTerminales", self);
            self.menu.addSubMenuAction(self.tr("Ciudades"), "apps/preferences-theme.png", "slotNWCiudades", self);
//            self.menu.addSubMenuAction(self.tr("Departamentos"), "apps/preferences-theme.png", "slotNWCiudades", self);
            self.menu.addSubMenuAction(self.tr("Países"), "apps/preferences-theme.png", "slotNWPaises", self);
            self.menu.addSubMenuAction(self.tr("Impresiones"), "actions/document-print-preview.png", "slotNWConfiguraciones", self);

            self.menu.addMenuAction(self.tr("Seguridad"), "status/security-high.png", 0, self);
            self.menu.addSubMenuAction(self.tr("Seguridad contraseñas/ingreso"), "status/dialog-password.png", "securityKeys", self);
            self.menu.addSubMenuAction(self.tr("Permisos"), "apps/utilities-keyring.png", "slotNWPermissions", self);
            self.menu.addSubMenuAction(self.tr("Permisos Productos"), "actions/system-run.png", "slotNWPermissionsProducts", self);
            self.menu.addSubMenuAction(self.tr("Módulos"), "apps/utilities-dictionary.png", "slotNWModulosGrupos", self);
            self.menu.addSubMenuAction(self.tr("Componentes"), "apps/office-project.png", "slotNWModulos", self);
            self.menu.addSubMenuAction(self.tr("Módulos Especiales Home"), "apps/office-project.png", "slotNWModulosHome", self);
            self.menu.addSubMenuAction(self.tr("Perfiles"), "apps/preferences-theme.png", "slotNWPerfiles", self);
            self.menu.addSubMenuAction(self.tr("Menú"), "categories/accessories.png", "slotNWMenu", self);
            self.menu.addSubMenuAction(self.tr("Usuarios"), "emotes/face-smile.png", "slotNWUsuarios", self);
            self.menu.addSubMenuAction(self.tr("Actualizar DB QXNW"), "places/network-workgroup.png", "slotNWUpdateDb", self);
            self.menu.addSubMenuAction(self.tr("Actualizar DB NWADMIN"), "places/network-workgroup.png", "slotNWUpdateNwadmin", self);
            self.menu.addSubMenuAction(self.tr("Actualizar DB PÁGINAS"), "places/network-workgroup.png", "slotNWUpdateNwproject", self);
            self.menu.addSubMenuAction(self.tr("Actualizar DB SITCA"), "places/network-workgroup.png", "slotNWUpdateSitca", self);
            self.menu.addSubMenuAction(self.tr("Actualizar DB MOVILMOVE"), "places/network-workgroup.png", "slotNWUpdateMovilmove", self);
            self.menu.addSubMenuAction(self.tr("Actualizar DB SANITCO"), "places/network-workgroup.png", "slotNWUpdateSanitco", self);
            self.menu.addSubMenuAction(self.tr("Actualizar DB VISITENTRY"), "places/network-workgroup.png", "slotNWUpdateVisitentry", self);
            self.menu.addSubMenuAction(self.tr("Actualizar DB RINGOW"), "places/network-workgroup.png", "slotNWUpdateRingow", self);
            self.menu.addSubMenuAction(self.tr("Traducciones APP"), "places/network-workgroup.png", "slotNWTraducciones", self);
            self.menu.addSubMenuAction(self.tr("Idiomas"), "places/network-workgroup.png", "slotNWIdiomas", self);
            self.menu.addSubMenuAction(self.tr("SMTP settings"), "actions/document-send.png", "slotNWSMTPSettings", self);
            self.menu.addSubMenuAction(self.tr("Equipos Terminal"), "actions/document-send.png", "slotNWEquipment", self);
            self.menu.addSubMenuAction(self.tr("Mantenimiento"), "actions/system-run.png", "slotNWMaintenance", self);
            self.menu.addSubMenuAction(self.tr("Log de Movimientos"), "actions/format-text-direction-ltr.png", "slotNWLogMovimientos", self);
            self.menu.addSubMenuAction(self.tr("Entradas y salidas"), "apps/preferences-users.png", "slotNWEntradasYSalidas", self);
            self.menu.addSubMenuAction(self.tr("Limpiar log de movimientos"), "actions/edit-clear.png", "slotNWCleanLogs", self);
            self.menu.addSubMenuAction("Error tester", "actions/process-stop.png", "test", self);
            if (self.up.user == "andresf" || self.up.user == "AndresF") {
                if (qx.core.Environment.get("qx.debug")) {
                    self.menu.addMenuAction("Administración móvil", "devices/phone.png", "slotAdminMobile", self);
                    self.menu.addMenuAction("Diseñador de formularios", "apps/utilities-color-chooser.png", "slotFormsDesigner", self);
                    self.menu.addMenuAction("Launcher", "actions/process-stop.png", "launcherTest", self);
                    self.menu.addMenuAction("Disposer", "actions/process-stop.png", "disposeAll", self);
                }
            }

            self.menu.addMenuAction("Administrador de Bases de datos", "actions/address-book-new.png", 0, self);
            self.menu.addSubMenuAction(self.tr("  de DB"), "apps/preferences-locale.png", "slotAdminDB", self);
            //  self.menu.addSubMenuAction(self.tr("Procesos"), "actions/document-open-recent.png", "slotProcess", self);

//            self.menu.addMenuAction("NwProject", "actions/address-book-new.png", 0, self);
//            self.menu.addSubMenuAction(self.tr("Actualizar Base de Datos"), "apps/preferences-locale.png", "slotUpdaterNwp", self);
//            self.menu.addSubMenuAction(self.tr("Restablecer Menú"), "apps/preferences-locale.png", "slotUpdaterNwpMenu", self);
//            self.menu.addSubMenuAction(self.tr("Configuración"), "apps/preferences-locale.png", "slotConfigNwp", self);
//            self.menu.addSubMenuAction(self.tr("Idiomas"), "apps/preferences-locale.png", "slotIdiomasNwp", self);

//            self.menu.addMenuAction("NwMaker", "actions/address-book-new.png", 0, self);
//            self.menu.addSubMenuAction(self.tr("Menú"), "apps/preferences-locale.png", "slotNwMakerMenu", self);
//            self.menu.addSubMenuAction(self.tr("Perfiles"), "apps/preferences-locale.png", "slotNwMakerPerfiles", self);
//            self.menu.addSubMenuAction(self.tr("Permisos"), "apps/preferences-locale.png", "slotNwMakerPermisos", self);
//            self.menu.addSubMenuAction(self.tr("Perfiles autorizados"), "apps/preferences-locale.png", "slotNwMakerPerfilesAutorizados", self);
//            self.menu.addSubMenuAction(self.tr("Módulos"), "apps/preferences-locale.png", "slotNwMakerModulos", self);
//            self.menu.addSubMenuAction(self.tr("Componentes"), "apps/preferences-locale.png", "slotNwMakerModulosComponentes", self);
//            self.menu.addSubMenuAction(self.tr("Módulos Home"), "apps/preferences-locale.png", "slotNwMakerModulosHome", self);
//            self.menu.addSubMenuAction(self.tr("Usuarios registrados"), "apps/preferences-locale.png", "slotNwMakerUsuariosRegistrados", self);
//            self.menu.addSubMenuAction(self.tr("Config login"), "apps/preferences-locale.png", "slotNwMakerConfigLogin", self);
//            self.menu.addSubMenuAction(self.tr("Configuración gral"), "apps/preferences-locale.png", "slotNwMakerConfigGral", self);
//            self.menu.addSubMenuAction(self.tr("Profesiones"), "apps/preferences-locale.png", "slotNwMakerProfesiones", self);
//            self.menu.addSubMenuAction(self.tr("Departamentos"), "apps/preferences-locale.png", "slotNwMakerDeptos", self);
//            self.menu.addSubMenuAction(self.tr("Domains autorizados"), "apps/preferences-locale.png", "slotNwMakerDomains", self);
//            self.menu.addSubMenuAction(self.tr("Idiomas"), "apps/preferences-locale.png", "slotNwMakerIdiomas", self);
//            self.menu.addSubMenuAction(self.tr("Planes"), "apps/preferences-locale.png", "slotNwMakerPlanes", self);
//            self.menu.addSubMenuAction(self.tr("Términos y condiciones"), "apps/preferences-locale.png", "slotNwMakerTerminos", self);
//            self.menu.addSubMenuAction(self.tr("Log de usuarios"), "apps/preferences-locale.png", "slotNwMakerLogUsuarios", self);
//            self.menu.addSubMenuAction(self.tr("Users Empresas"), "apps/preferences-locale.png", "slotNwMakerUsersEmpresas", self);
//            self.menu.addSubMenuAction(self.tr("Suscriptores push"), "apps/preferences-locale.png", "slotNwMakerSuscriptorsPush", self);
//            self.menu.addSubMenuAction(self.tr("Reset Pass"), "apps/preferences-locale.png", "slotNwMakerResetPass", self);
//            self.menu.addSubMenuAction(self.tr("Notificaciones"), "apps/preferences-locale.png", "slotNwMakerNotificaciones", self);
//            self.menu.addSubMenuAction(self.tr("Config nwchat"), "apps/preferences-locale.png", "slotNwMakerConfigNwChat", self);
//            self.menu.addSubMenuAction(self.tr("ACTUALIZAR BASE DE DATOS ESTRUCTURA"), "apps/preferences-locale.png", "slotNwMakerMenuUpdateBD", self);
        },
        __createAppMenu: function __createAppMenu(menu) {
            var self = this;
            if (self.up != null) {
                var index = qxnw.userPolicies.getDevelopers().indexOf(self.up.user);
                if (index != -1) {
//                    self.openDevelopersView();
                }
            }

            var m = menu.addMenu(self.tr("Configuración"), 0, self, "categories/system.png");
            var menuStyle = qxnw.config.getMenuStyle();
            if (menuStyle === "vertical") {
                m.set({
                    showArrow: true
                });
            }
            menu.addMenuAction(self.tr("Borrar configuración"), "actions/dialog-cancel.png", "deleteConfiguration", self);
            menu.addMenuAction(self.tr("Borrar caché de menú"), "actions/dialog-cancel.png", "deleteMenuCache", self);
            menu.addMenuAction(self.tr("Cambiar empresa"), "apps/preferences-security.png", "slotCambiarEmpresa", self);
            menu.addMenuAction(self.tr("Sincronizar"), "actions/view-refresh.png", "slotSync", self);
            menu.addMenuAction(self.tr("Seguridad"), "status/security-high.png", "", self);
            menu.addSubMenuAction(self.tr("Cambio de clave"), "status/dialog-password.png", "slotNWCambiarClave", self);
            menu.addSubMenuAction(self.tr("Preguntas de seguridad"), "status/security-medium.png", "slotNWPreguntas", self);
            //self.menu.addMenuAction(self.tr("Manuales"), "apps/internet-blog.png", "", self);
            //self.menu.addSubMenuAction(self.tr("Opciones generales"), "apps/utilities-color-chooser.png", "openGeneralManual", self);
            //self.menu.addSubMenuAction(self.tr("Herramientas"), "apps/utilities-calculator.png", "openToolsManual", self);
//            self.menu.addMenuAction(self.tr("Ver mi IP"), "devices/display.png", "slotVerMiIP", self);
            menu.addMenuAction(self.tr("Captura de Pantalla"), "devices/display.png", "slotCapturaPantalla", self);
            menu.addMenuAction(self.tr("Herramientas"), "categories/engineering.png", "", self);
            menu.addSubMenuAction(self.tr("Buscador de coordenadas"), "apps/office-address-book.png", "__addressFinder", self);
            menu.addSubMenuAction(self.tr("Envío de notificaciones"), "apps/internet-mail.png", "__sendNotification", self);
            menu.addSubMenuAction(self.tr("Creador de códigos QR"), "qxnw/qr.png", "__createQR", self);
            menu.addMenuAction(self.tr("Listas de correos"), "actions/contact-new.png", "", self);
            menu.addSubMenuAction(self.tr("Listas de envío de correos"), "actions/document-send.png", "__emailLists", self);
            menu.addSubMenuAction(self.tr("Grupos de correos"), "apps/preferences-users.png", "__groupsAndEmails", self);
            menu.addMenuAction(self.tr("Configuracion de estilos"), "actions/format-text-strikethrough.png", "__openConfigMenu", self);
            menu.addMenuAction(self.tr("Temas"), "apps/utilities-color-chooser.png", "themeSwitcher", self);
            menu.addMenuAction(self.tr("Configuracion de alertas"), "categories/internet.png", "__openConfigAlerts", self);
//            self.menu.addMenuAction(self.tr("Verificar nuevas versiones"), "apps/internet-web-browser.png", "verifyVersion", self);
            menu.addMenuAction(self.tr("Configuracion de comportamientos"), "actions/view-fullscreen.png", "__openBehaviorConfig", self);
            menu.addMenuAction(self.tr("Configuracion de impresiones"), "actions/document-print-preview.png", "__openPrinterSettings", self);
            menu.addMenuAction(self.tr("Acerca de..."), "actions/help-about.png", "slotAbout", self);
        },
        disposeAll: function disposeAll() {
            qx.core.ObjectRegistry.shutdown();
        },
        slotTestApiBiostar2: function slotTestApiBiostar2() {
            var f = new qxnw.examples.biostarTester();
            f.show();
        },
        launcherTest: function launcherTest() {
            var self = this;
            try {
                switch (self.up.user) {
                    case "alexf":
                        qxnw.dev.alexf.test(self);
                        break;
                    case "ladyg":
                        qxnw.dev.ladyg.test(self);
                        break;
                    case "andresf":
                        qxnw.dev.andresf.test(self);
                        break;
                    case "AndresF":
                        qxnw.dev.andresf.test(self);
                        break;
                }
            } catch (e) {
                qxnw.utils.nwconsole(e);
            }
        },
        slotOpenImport: function slotOpenImport() {
            var f = new qxnw.nw_import_data.main();
            f.ui.table.setEnabled(true);
            f.ui.table.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                if (key == "Enter") {
                    f.populateTable(this.getValue());
                }
            });
            f.show();
        },
        slotCambiarEmpresa: function slotCambiarEmpresa() {
            var f = new qxnw.basics.forms.f_cambiar_empresa();
            f.show();
        },
        slotSyncAdmin: function slotSyncAdmin() {
            var f = new qxnw.nw_sync.main();
            f.show();
            this.addSubWindow(this.tr("Sicronización de datos Offline"), f);
        },
        slotSync: function slotSync() {
            var f = new qxnw.nw_sync.forms.f_syncAll();
            f.show();
        },
        slotExports: function slotExports() {
            var f = new qxnw.nw_exp.main();
            f.show();
            f.maximize();
        },
        slotImport: function slotImport() {
            var f = new qxnw.nw_import_data.imp_chars_len();
            f.show();
            f.maximize();
        },
        slotManageEncExport: function slotManageEncExport() {
            var f = new qxnw.forms();
            f.setModal(true);
            f.setTitle(f.tr("Edición de encabezado de exportación por NW-Calculate"));
            var fields = [
                {
                    name: "maxRowsSpinner",
                    type: "spinner",
                    label: f.tr("Máximo de filas")
                },
                {
                    name: "maxColsSpinner",
                    type: "spinner",
                    label: f.tr("Máximo de columnas")
                }
            ];
            f.setFields(fields);
            f.setMaxHeightContainer("containerMain", 50);
            f.setWidth(800);
            f.setHeight(600);
            f.ui.maxRowsSpinner.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    var maxRows = this.getValue();
                    var maxCols = f.ui.maxColsSpinner.getValue();
                    f.replaceFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() +
                            "/modulos/nwexcel/file.php?file=/nwlib6/nw_calculate/nw_enc_user.inc.php&dev=true&functionQXNW=receiveHTMLCalculateDev&maxRows=" + maxRows + "&maxCols=" + maxCols);
                }
            });
            f.ui.maxColsSpinner.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    var maxRows = this.getValue();
                    var maxCols = f.ui.maxColsSpinner.getValue();
                    f.replaceFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() +
                            "/modulos/nwexcel/file.php?file=/nwlib6/nw_calculate/nw_enc_user.inc.php&dev=true&functionQXNW=receiveHTMLCalculateDev&maxRows=" + maxRows + "&maxCols=" + maxCols);
                }
            });
            f.ui.accept.setIcon(qxnw.config.execIcon("edit-clear"));
            f.ui.accept.setLabel(f.tr("Limpiar configuración"));
            f.ui.accept.addListener("execute", function () {
                var func = function (rta) {
                    if (rta) {
                        qxnw.utils.information(f.tr("Configuración reiniciada correctamente"));
                        var maxRows = f.ui.maxRowsSpinner.getValue();
                        var maxCols = f.ui.maxColsSpinner.getValue();
                        f.replaceFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() +
                                "/modulos/nwexcel/file.php?file=/nwlib6/nw_calculate/nw_enc_user.inc.php&dev=true&functionQXNW=receiveHTMLCalculateDev&maxRows=" + maxRows + "&maxCols=" + maxCols);
                    }
                };
                qxnw.utils.fastAsyncRpcCall("master", "cleanNWCalculateDev", null, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.close();
            });
            f.ui.maxRowsSpinner.addListener("changeValue", function () {
                qxnw.local.setData("nw_export_enc_dev_max_rows", this.getValue());
            });
            f.ui.maxColsSpinner.addListener("changeValue", function () {
                qxnw.local.setData("nw_export_enc_dev_max_cols", this.getValue());
            });
            var maxRows = qxnw.local.getData("nw_export_enc_dev_max_rows");
            if (maxRows == null) {
                maxRows = 10;
                f.ui.maxRowsSpinner.setValue(maxRows);
            } else {
                f.ui.maxRowsSpinner.setValue(maxRows);
            }
            var maxCols = qxnw.local.getData("nw_export_enc_dev_max_cols");
            if (maxCols == null) {
                maxCols = 30;
                f.ui.maxColsSpinner.setValue(maxCols);
            } else {
                f.ui.maxColsSpinner.setValue(maxCols);
            }
            f.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() +
                    "/modulos/nwexcel/file.php?file=/nwlib6/nw_calculate/nw_enc_user.inc.php&dev=true&functionQXNW=receiveHTMLCalculateDev&maxRows=" + maxRows + "&maxCols=" + maxCols);
            f.show();
        },
        slotNWEntradasYSalidas: function slotNWEntradasYSalidas() {
            var l = new qxnw.security.entradas_salidas.l_entradas_salidas();
            this.addSubWindow(this.tr("Entradas y salidas"), l);
        },
        slotOpenAdminFiles: function slotOpenAdminFiles() {
            var l = new qxnw.nw_file_manager.trees.vista_general();
            this.addSubWindow(this.tr("Administración de imágenes / archivos"), l);
        },
        slotPagosPayU: function slotPagosPayU() {
            var f = new qxnw.examples.form_payu();
            f.show();
        },
        slotLocale: function slotLocale() {
            var f = new qxnw.locale.all();
            f.show();
        },
        slotDeveloperList: function slotDeveloperList() {
            var l = new qxnw.examples.list();
            l.show();
        },
        slotDeveloperListEditable: function slotDeveloperListEditable() {
            var l = new qxnw.examples.listEdit();
            l.show();
        },
        slotDeveloperForm: function slotDeveloperForm() {
            var l = new qxnw.examples.form();
            l.show();
        },
        slotDeveloperFormNav: function slotDeveloperFormNav() {
            var l = new qxnw.examples.formNav();
            l.show();
        },
        slotDeveloperGraph: function slotDeveloperGraph() {
            var l = new qxnw.examples.charts();
            l.show();
        },
        slotDeveloperNav: function slotDeveloperNav() {
            var f = new qxnw.forms();
            f.setTitle("Formulario con navTable compuesto");
            var nav = new qxnw.examples.navTable();
            f.insertNavTable(nav.getBase());
            f.show();
        },
        slotAdminMobile: function slotAdminMobile() {
            var tree = new qxnw.mobile.treeAdmin();
            this.addSubWindow(this.tr("Administración del móvil"), tree);
        },
        __openPrinterSettings: function __openPrinterSettings() {
            var self = this;
            var fields = [
                {
                    name: "all_top",
                    type: "spinner",
                    label: self.tr("Arriba"),
                    required: true
                },
                {
                    name: "all_left",
                    type: "spinner",
                    label: self.tr("Izquierda"),
                    required: true
                },
                {
                    name: "tipo",
                    type: "selectBox",
                    label: self.tr("Tipo"),
                    required: true
                },
                {
                    name: "width",
                    type: "spinner",
                    label: self.tr("Ancho"),
                    required: false
                }
            ];
            var f = qxnw.utils.dialog(fields, self.tr("Configuración de impresiones"), true, false);
            f.ui.all_top.setValue(0);
            f.ui.all_left.setValue(0);
            qxnw.utils.populateSelectAsync(f.ui.tipo, "master", "populate", {table: "nw_printer_types"});
            f.ui.tipo.addListener("changeValue", function () {
                var d = f.getRecord();
                var func = function (r) {
                    if (r == false) {
                        return;
                    }
                    f.setRecord(r);
                };
                qxnw.utils.fastAsyncRpcCall("nw_configuraciones", "getConfigByType", d, func);
            });
            f.ui.accept.addListener("tap", function () {
                var d = f.getRecord();
//                console.log(d);
            });
            f.ui.cancel.addListener("tap", function () {
                f.close();
            });
            f.show();
        },
        slotDeveloperDescriptions: function slotDeveloperDescriptions() {
            qxnw.utils.createInformativeForm("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/dev/help/desc", "Descripciones de tabla");
        },
        slotNWCleanLogs: function slotNWCleanLogs() {
            var self = this;
            qxnw.utils.question(self.tr("¿Desea conservar una copia del log?"), function (e) {
                if (e) {
                    var func = function () {
                        qxnw.utils.information(self.tr("Se borrará el registro... presione aceptar"), function (e) {
                            qxnw.utils.removeLog();
                        });
                    };
                    qxnw.utils.exportTableToExcel("nw_registro", func);
                }
            });
        },
        slotCronJobs: function slotCronJobs() {
            var l = new qxnw.nw_cron.l_cron();
            this.addSubWindow(this.tr("Trabajos de servidor"), l);
        },
        openGeneralManual: function openGeneralManual() {
            var f = new qxnw.forms();
            f.addHtml("<iframe src='http://manuals.gruponw.com/embed/1u' width='100%' height='100%' scrolling='no' frameborder='0' style='min-height: 100%;' ></iframe>");
            this.addSubWindow(this.tr("Manual general"), f);
        },
        slotNWSMTPSettings: function slotNWSMTPSettings() {
            var f = new qxnw.forms.smtp();
            f.show();
        },
        openToolsManual: function openToolsManual() {
            var f = new qxnw.forms();
            f.addHtml("<iframe src='http://manuals.gruponw.com/embed/1v' width='100%' height='100%' scrolling='no' frameborder='0' style='min-height: 100%;' ></iframe>");
            this.addSubWindow(this.tr("Manual herramientas"), f);
        },
        __slotConfigServersDb: function __slotConfigServersDb() {
            this.createMasterList("master", "nw_server_db", "Administrador de servidores", true);
        },
        slotNWUpdateDb: function slotNWUpdateDb() {
            var self = this;
            qxnw.utils.question(self.tr("UPDATER QXNW: Es un movimiento complejo del sistema. ¿Desea continuar?"), function (e) {
                if (e) {
                    var func = function (r) {
                        qxnw.utils.information(self.tr("Actualización realizada correctamente"));
                        qxnw.utils.stopLoading();
                    };
                    qxnw.utils.fastAsyncRpcCall("qxnw_updater", "updateVersionDb", 0, func, 5000000000);
                    qxnw.utils.loading(self.tr("Realizando actualización..."));
                }
            });
        },
        slotNWTraducciones: function slotNWTraducciones() {
            var d = new qxnw.basics.lists.l_traducciones_app();
//            d.show();
            main.addSubWindow("Traducciones App", d);
        },
        slotNWIdiomas: function slotNWIdiomas() {
            var self = this;
            var d = new qxnw.lists();
            d.setTableMethod("master");
            d.createFromTable("idiomas");
            d.serialColumn("id");
            self.addSubWindow("Idiomas", d);
//            d.EditarPagosFacturas = function (id, record) {
//                var sl = record[0];
//                self.slotEditPagosFacturas(sl);
//            };
//            d.addAutoContextMenu("Editar Pagos", qxnw.config.execIcon("go-up", "actions"), "EditarPagosFacturas", d);
//            d.setAllPermissions(true);
        },
        slotNWUpdateSitca: function slotNWUpdateSitca() {
            this.updateProducts("SITCA");
        },
        slotNWUpdateMovilmove: function slotNWUpdateMovilmove() {
            this.updateProducts("MOVILMOVE");
        },
        slotNWUpdateVisitentry: function slotNWUpdateVisitentry() {
            this.updateProducts("VISITENTRY");
        },
        slotNWUpdateRingow: function slotNWUpdateRingow() {
            this.updateProducts("RINGOW");
        },
        slotNWUpdateSanitco: function slotNWUpdateSanitco() {
            this.updateProducts("SANITCO");
        },
        slotNWUpdateNwproject: function slotNWUpdateNwproject() {
            this.updateProducts("PAGINAS");
        },
        slotNWUpdateNwadmin: function slotNWUpdateNwadmin() {
            this.updateProducts("NWADMIN");
        },
        updateProducts: function updateProducts(product) {
            var self = this;
            var db_name = product.toLowerCase();
            var execute = function () {
                qxnw.utils.question(self.tr("UPDATER " + product + ": Es un movimiento complejo del sistema. ¿Desea continuar?"), function (e) {
                    if (e) {
                        var func = function (r) {
                            if (r) {
                                qxnw.utils.information(self.tr("Actualización realizada correctamente"));
                                qxnw.utils.stopLoading();
                            } else {
                                qxnw.utils.information(self.tr("Tuvimos un problema con la actualización, verifique con el adminsitrador"));
                                qxnw.utils.stopLoading();
                            }
                        };
                        qxnw.utils.fastAsyncRpcCall(db_name + "_updater", "start", 0, func, 5000000000);
                        qxnw.utils.loading(self.tr("Realizando actualización..."));
                    }
                });
            };
            if (window.location.hostname !== self.domainsProducts[product]) {
                qxnw.utils.question(self.tr("Está ejecutando el updater de " + product + " en un dominio diferente, ¿desea continuar?"), function (rta) {
                    if (rta === true) {
                        execute();
                    }
                });
                return;
            }
            execute();
        },
        slotUpdaterNwp: function slotUpdaterNwp() {
            var self = this;
            qxnw.utils.question(self.tr("Es un movimiento complejo del sistema. ¿Desea continuar?"), function (e) {
                if (e) {
                    var func = function () {
                        qxnw.utils.information(self.tr("Actualización realizada correctamente"));
                        qxnw.utils.stopLoading();
                    };
                    qxnw.utils.fastAsyncRpcCall("updaterNwp", "updaterNw", 0, func, 50000000000);
                    qxnw.utils.loading(self.tr("Realizando actualización..."));
                }
            });
        },
        slotUpdaterNwpMenu: function slotUpdaterNwpMenu() {
            var self = this;
            qxnw.utils.question(self.tr("Es un movimiento complejo del sistema. Se creará el nuevo menú de la última actualización de nwproject5, el actual desaparecerá. ¿Desea continuar?"), function (e) {
                if (e) {
                    var func = function (r) {
                        qxnw.utils.information(self.tr("Actualización realizada correctamente"));
                        qxnw.utils.stopLoading();
                    };
                    qxnw.utils.fastAsyncRpcCall("updaterNwp", "updaterNwMenu", 0, func, 5000000000);
                    qxnw.utils.loading(self.tr("Realizando actualización..."));
                }
            });
        },
        slotNwMakerMenuUpdateBD: function slotNwMakerMenuUpdateBD() {
            var self = this;
            qxnw.utils.question(self.tr("Es un movimiento complejo del sistema. Se actualizará la estructura de la base de datos de NWMAKER con la última versión, ¿Desea continuar?"), function (e) {
                if (e) {
                    var func = function (r) {
                        qxnw.utils.information(self.tr("Actualización realizada correctamente"));
                        qxnw.utils.stopLoading();
                    };
                    qxnw.utils.fastAsyncRpcCall("updaterNwp", "nwmaker", 0, func, 5000000000);
                    qxnw.utils.loading(self.tr("Realizando actualización nwmaker..."));
                }
            });
        },
        slotConfigNwp: function slotConfigNwp() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwpconfig");
            this.addSubWindow("Configurar Nwproject", d);
        },
        slotIdiomasNwp: function slotIdiomasNwp() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("idiomas");
            this.addSubWindow("Idiomas nwproject", d);
        },
        slotNwMakerConfigNwChat: function slotNwMakerConfigNwChat() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("sop_config");
            this.addSubWindow("NwMaker ConfigNwChat", d);
        },
        slotNwMakerMenu: function slotNwMakerMenu() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_menu");
            this.addSubWindow("NwMaker Menú", d);
        },
        slotNwMakerPerfiles: function slotNwMakerPerfiles() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_perfiles");
            this.addSubWindow("NwMaker Perfiles", d);
        },
        slotNwMakerPerfilesAutorizados: function slotNwMakerPerfilesAutorizados() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_perfiles_autorizados");
            this.addSubWindow("NwMaker Perfiles Autorizados", d);
        },
        slotNwMakerPermisos: function slotNwMakerPermisos() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_permisos");
            this.addSubWindow("NwMaker Permisos", d);
        },
        slotNwMakerModulos: function slotNwMakerModulos() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_modulos");
            this.addSubWindow("NwMaker Modulos", d);
        },
        slotNwMakerModulosHome: function slotNwMakerModulosHome() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_modulos_home");
            this.addSubWindow("NwMaker Modulos Home", d);
        },
        slotNwMakerModulosComponentes: function slotNwMakerModulosComponentes() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_modulos_componentes");
            this.addSubWindow("NwMaker Modulos Componentes", d);
        },
        slotNwMakerConfigLogin: function slotNwMakerConfigLogin() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_login");
            this.addSubWindow("NwMaker Config Login", d);
        },
        slotNwMakerConfigGral: function slotNwMakerConfigGral() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_codigo_oculto");
            this.addSubWindow("NwMaker Config Gral", d);
        },
        slotNwMakerUsuariosRegistrados: function slotNwMakerUsuariosRegistrados() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("pv_clientes");
            this.addSubWindow("NwMaker Usuarios registrados", d);
        },
        slotNwMakerProfesiones: function slotNwMakerProfesiones() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_login_profesiones");
            this.addSubWindow("NwMaker Profesiones", d);
        },
        slotNwMakerDeptos: function slotNwMakerDeptos() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_departamentos");
            this.addSubWindow("NwMaker Deptos", d);
        },
        slotNwMakerDomains: function slotNwMakerDomains() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_domains_autorizados");
            this.addSubWindow("NwMaker Domains Autorizados", d);
        },
        slotNwMakerIdiomas: function slotNwMakerIdiomas() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_idiomas");
            this.addSubWindow("NwMaker Idiomas", d);
        },
        slotNwMakerPlanes: function slotNwMakerPlanes() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_planes");
            this.addSubWindow("NwMaker Planes", d);
        },
        slotNwMakerTerminos: function slotNwMakerTerminos() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_terminos_condiciones");
            this.addSubWindow("NwMaker Términos", d);
        },
        slotNwMakerLogUsuarios: function slotNwMakerLogUsuarios() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_usuarios_log");
            this.addSubWindow("NwMaker Log Usuarios", d);
        },
        slotNwMakerUsersEmpresas: function slotNwMakerUsersEmpresas() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_users_empresas");
            this.addSubWindow("NwMaker UsersEmpresas", d);
        },
        slotNwMakerSuscriptorsPush: function slotNwMakerSuscriptorsPush() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_suscriptorsPush");
            this.addSubWindow("NwMaker Suscriptores Push", d);
        },
        slotNwMakerResetPass: function slotNwMakerResetPass() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_resetpass");
            this.addSubWindow("NwMaker Reset Pass", d);
        },
        slotNwMakerNotificaciones: function slotNwMakerNotificaciones() {
            var d = new qxnw.lists();
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nwmaker_notificaciones");
            this.addSubWindow("NwMaker Notificaciones", d);
        },
        slotNWEquipment: function slotNWEquipment() {
            var d = new qxnw.lists().set({
                handleTerminalPermissons: false
            });
            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("nw_equipos_ip");
            this.addSubWindow(this.tr("Equipos Terminal"), d);
        },
        slotNWMaintenance: function slotNWMaintenance() {
            var self = this;
            qxnw.utils.question(self.tr("Para el mantenimiento se bloquearán todas las tablas, habrá lentitud en las operaciones y puede tomar mucho tiempo. Sin embargo mejorará la velocidad en todos los aspectos. ¿Desea continuar?"), function (e) {
                if (e) {
                    var func = function (r) {
                        qxnw.utils.information(self.tr("Mantenimiento realizado correctamente"));
                        qxnw.utils.stopLoading();
                    };
                    qxnw.utils.fastAsyncRpcCall("master", "makeMaintenance", 0, func, 500000000000);
                    qxnw.utils.loading(self.tr("Realizando mantenimiento..."));
                }
            });
        },
        __createQR: function __createQR() {
            var self = this;
            var fields = [
                {
                    name: "text",
                    type: "textArea",
                    label: self.tr("Texto"),
                    required: true
                },
                {
                    name: "size",
                    type: "spinner",
                    label: self.tr("Tamaño"),
                    required: true
                }
            ];
            var f = qxnw.utils.dialog(fields, self.tr("Generador de códigos QR"), true, false);
            f.ui.size.setValue(3);
            var frame = null;
            f.ui.accept.addListener("tap", function () {
                var d = f.getRecord();
                if (frame == null) {
                    frame = f.addFrame("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/phpqrcode/generator.php?text=" + encodeURIComponent(d["text"]) + "&size=" + d["size"] + "&key=nwadmin123XfTr");
                } else {
                    frame.setSource("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/phpqrcode/generator.php?text=" + encodeURIComponent(d["text"]) + "&size=" + d["size"] + "&key=nwadmin123XfTr");
                }
            });
            f.ui.cancel.addListener("tap", function () {
                f.close();
            });
            f.show();
        },
        slotNWEmpresas: function slotNWEmpresas() {
            var d = new qxnw.basics.lists.l_empresas();
            this.addSubWindow(this.tr("Empresas"), d);
        },
        slotNWUsuarios: function slotNWUsuarios() {
            var d = new qxnw.basics.lists.l_usuarios();
            this.addSubWindow(this.tr("Usuarios"), d);
        },
        slotNWConfiguraciones: function slotNWConfiguraciones() {
            var d = new qxnw.basics.forms.f_configuracion();
            d.show();
        },
        slotVerMiIP: function slotVerMiIP() {
            qxnw.utils.getIPs(function (d) {
                console.log(d);
                if (typeof d == 'undefined') {
                    qxnw.utils.information("IP: Not found" + " ID RED: Not found");
                    return;
                }
                qxnw.utils.information("IP:" + d.ip + " ID RED:" + d.id_red);
            });
        },
        slotCapturaPantalla: function slotCapturaPantalla() {
            var d = new qxnw.basics.forms.f_captura_pantalla();
            d.show();
        },
        slotNWCambiarClave: function slotNWCambiarClave() {
            var d = new qxnw.basics.forms.f_cambiar_clave();
            d.show();
        },
        slotNWPreguntas: function slotNWPreguntas() {
            var d = new qxnw.forms.securityQuestions();
            d.show();
        },
        slotNWCiudades: function slotNWCiudades() {
            var d = new qxnw.basics.lists.l_ciudades();
            this.addSubWindow(this.tr("Ciudades"), d);
        },
        slotNWPaises: function slotNWPaises() {
            var d = new qxnw.basics.lists.l_paises();
            this.addSubWindow(this.tr("Paises"), d);
        },
//        slotNWBodegas: function slotNWBodegas() {
//            var d = new qxnw.basics.lists.l_bodegas();
//            this.addSubWindow(this.tr("Ciudades"), d);
//        },
        slotNWDepartamentos: function slotNWDepartamentos() {
            this.createMasterList("master", "departamenos", this.tr("Departamentos"), true);
        },
        slotNWTerminales: function slotNWTerminales() {
            var d = new qxnw.basics.lists.l_terminales();
            this.addSubWindow(this.tr("Terminales"), d);
        },
        slotNWModulosGrupos: function slotNWModulosGrupos() {
            var d = new qxnw.basics.lists.l_modulos();
            this.addSubWindow(this.tr("Modulos"), d);
        },
        slotNWModulos: function slotNWModulos() {
            var d = new qxnw.basics.lists.l_componentes();
            this.addSubWindow(this.tr("Componentes"), d);
        },
        slotNWPerfiles: function slotNWPerfiles() {
            var d = new qxnw.basics.lists.l_perfiles();
            this.addSubWindow(this.tr("Perfiles"), d);
        },
        slotNWLogMovimientos: function slotNWLogMovimientos() {
            var d = new qxnw.security.registro.l_registro();
            this.addSubWindow(this.tr("Movimientos generales"), d);
        },
        slotNWMenu: function slotNWMenu() {
            var d = new qxnw.basics.lists.l_menu();
            this.addSubWindow(this.tr("Menú"), d);
        },
        slotNWPermissions: function slotNWPermissions() {
            var d = new qxnw.forms.permissions();
            this.addSubWindow("Permisos", d);
        },
        slotNWPermissionsProducts: function slotNWPermissionsProducts() {
            var d = new qxnw.forms.permissionsProducts();
            this.addSubWindow("Permisos productos", d);
        },
        slotManageNotifications: function slotManageNotifications() {
            var l = new qxnw.nw_notifications.manage();
            this.addSubWindow(this.tr("Administrador de notificaciones"), l);
        },
        slotFormsDesigner: function slotFormsDesigner() {
            var f = new qxnw.forms();
            f.show();
        },
        slotFilesAdministratorDownloadList: function slotFilesAdministratorDownloadList() {
            this.createMasterList("master", "nw_files_downloads", this.tr("Listado de descargas"), true);
        },
        slotPrinterSettings: function slotPrinterSettings() {
            var l = new qxnw.nw_printer.lists.l_printer();
            this.addSubWindow(this.tr("Administrador de impresiones"), l);
        },
        slotFilesAdministratorDownloadObs: function slotFilesAdministratorDownloadObs() {
            this.createMasterList("master", "nw_files_records", this.tr("Listado de observaciones al descargar"), true);
        },
        __sendNotification: function __sendNotification() {
            qxnw.utils.sendNotification(this, "Envío de notificación");
        },
        slotFilesAdministrator: function slotFilesAdministrator() {
            this.createMasterList("master", "nw_files_admin", this.tr("Administrador de archivos"), true);
        },
        slotInitSettings: function slotInitSettings() {
            this.createMasterList("master", "nw_init_settings", this.tr("Configuración al inicio"), true);
        },
        slotInitSettingsDiseno: function slotInitSettingsDiseno() {
            this.createMasterList("master", "nw_design", this.tr("Configuración Diseño Home"), true);
        },
        slotNWModulosHome: function slotNWModulosHome() {
            this.createMasterList("master", "nw_modulos_home", this.tr("Administración de Módulos Especiales Home"), true);
        },
        createMasterList: function createMasterList(method, table, title, allPermissions, useOtherDB) {
            var self = this;
            var d = new qxnw.lists();
            if (typeof useOtherDB != 'undefined' && useOtherDB != null) {
                d.setOtherDB(useOtherDB);
            }
            d.setTableMethod(method);
            d.createFromTable(table);
            if (typeof allPermissions == 'undefined') {
                allPermissions = false;
            }
            if (allPermissions) {
                d.setAllPermissions(allPermissions);
            }
            self.addSubWindow(title, d);
            return d;
        },
        __emailLists: function __emailLists() {
            var d = new qxnw.nw_email_list.lists.l_email();
            this.addSubWindow(this.tr("Listas de envío de correos"), d);
        },
        __groupsAndEmails: function __groupsAndEmails() {
            var t = new qxnw.nw_email_list.tree.groupsAndEmails();
            this.addSubWindow(this.tr("Grupos de correos"), t);
        },
        slotHtmlForms: function slotHtmlForms() {
            var l = new qxnw.nw_html_forms.lists.l_html_forms();
            this.addSubWindow(this.tr("Formularios HTML"), l);
        },
        slotExcelReports: function slotExcelReports() {
            var l = new qxnw.nw_excel_reports.lists.l_er();
            this.addSubWindow(this.tr("Reportes en Excel"), l);
        },
        __slotModules: function __slotModules() {
            var d = new qxnw.lists();
            d.setTableMethod("master");
            d.createFromTable("modulos");
            d.serialColumn("id");
            d.setAllPermissions(true);
            this.addSubWindow(this.tr("Módulos"), d);
        },
        slotChatVistaGeneral: function slotChatVistaGeneral() {
            var d = new qxnw.nw_chat.lists.l_vistaGeneral();
            this.addSubWindow(this.tr("Vista general"), d);
        },
        slotChatSalas: function slotChatSalas() {
            var d = new qxnw.lists();
            d.setTableMethod("master");
            d.createFromTable("nw_chat_rooms");
            this.addSubWindow(this.tr("Sala"), d);
        },
        slotChatSalasPorUsuario: function slotChatSalasPorUsuario() {
            var d = new qxnw.nw_chat.lists.l_salasPorUsuario();
            this.addSubWindow(this.tr("Usuario Por Salas"), d);
        },
        slotEncReports: function slotEncReports() {
            var d = new qxnw.nw_reports.lists.l_encabezado();
            this.addSubWindow(this.tr("Encabezado"), d);
        },
        slotAdminDB: function slotAdminDB() {
            var self = this;
//            var d = new qxnw.forms();
//            d.setTitle("Administrador DB");
//            var up = qxnw.userPolicies.getUserData();
//            var user = qxnw.local.getData(up.user + "user");
//            var pass = qxnw.local.getData(up.user + "pass");
//            var host = qxnw.local.getData(up.host + "pass");
//            var fields = [
//                {
//                    name: "host_db",
//                    label: "Host",
//                    type: "textField",
//                    required: true
//                },
//                {
//                    name: "user_db",
//                    label: "User",
//                    type: "textField",
//                    required: true
//                },
//                {
//                    name: "pass_db",
//                    label: "Password",
//                    type: "passwordField",
//                    required: true
//                }
//            ];
//            d.setFields(fields);
//            if (qxnw.utils.evalue(user)) {
//                d.ui.user_db.setValue(user.toString());
//            }
//            if (qxnw.utils.evalue(pass)) {
//                d.ui.pass_db.setValue(pass.toString());
//            }
//            if (qxnw.utils.evalue(host)) {
//                d.ui.host_db.setValue(host.toString());
//            }
//            d.addHeaderNote("<b>Ingrese su usuario y clave para ingresar en el administrador de DB.<b></br></br>")
//            d.ui.cancel.addListener("click", function () {
//                d.reject();
//            });
//            d.ui.pass_db.addListener("keypress", function (e) {
//                if (e.getKeyIdentifier() == "Enter") {
//                    if (!d.validate()) {
//                        return;
//                    }
//                    var data = d.getRecord();
//                    var up = qxnw.userPolicies.getUserData();
//                    var func = function (r) {
//                        d.accept();
//                        qxnw.local.clearKey(up.user + "user");
//                        qxnw.local.clearKey(up.user + "pass");
//                        qxnw.local.clearKey(up.host + "user");
//                        qxnw.local.storeData(up.user + "user", data.user_db);
//                        qxnw.local.storeData(up.user + "pass", data.pass_db);
//                        qxnw.local.storeData(up.host + "pass", data.host_db);
//                        var des = new qxnw.nw_admin_db.trees.vista_general();
//                        self.addSubWindow("Administrator DB", des);
//                    };
//                    qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "setUserConection", data, func);
//                }
//            });
//            d.ui.accept.addListener("click", function () {
//                if (!d.validate()) {
//                    return;
//                }
//                var data = d.getRecord();
//                var up = qxnw.userPolicies.getUserData();
//                    d.accept();
//                    qxnw.local.clearKey(up.user + "user");
//                    qxnw.local.clearKey(up.user + "pass");
//                    qxnw.local.clearKey(up.host + "user");
//                    qxnw.local.storeData(up.user + "user", data.user_db);
//                    qxnw.local.storeData(up.user + "pass", data.pass_db);
//                    qxnw.local.storeData(up.host + "pass", data.host_db);
            var des = new qxnw.nw_admin_db.trees.vista_general();
            self.addSubWindow("Administrator DB", des);
//            });
//            d.show();
        },
        slotProcess: function slotProcess() {
            var d = new qxnw.nw_admin_db.lists.l_process();
            this.addSubWindow(this.tr("Procesos Activos"), d);
        },
        slotConfigurationsDB: function slotConfigurationsDB() {
            var d = new qxnw.nw_admin_db.forms.f_configurations();
            d.setModal(true);
            d.show();
        },
        slotTypeReport: function slotTypeReport() {
            var d = new qxnw.lists();
            d.setTableMethod("master");
            d.createFromTable("nw_reports_types");
            d.setAllPermissions(true);
            this.addSubWindow(this.tr("Tipo"), d);
        },
        testAttached: function testAttached() {
            var f = new qxnw.attached_admin.init();
            f.show();
        },
        securityKeys: function securityKeys() {
            var f = new qxnw.security.f_security_keys();
            f.setModal(true);
            f.show();
            return;
        },
        slotMyFiles: function slotMyFiles() {
            var d = new qxnw.nw_drive.trees.vista_general();
            d.createWindow();
            this.addSubWindow("Mis Documentos", d);
        },
        slotFileManager: function slotFileManager() {
            var d = new qxnw.nw_file_manager.trees.vista_general();
//            d.createWindow();
            this.addSubWindow("File Manager", d);
        },
        slotMyPersonalData: function slotMyPersonalData() {
            var d = new qxnw.forms();
            d.setTitle(d.tr("Cambio de foto de perfil :: QXNW"));
            var fields = [
                {
                    name: "foto",
                    label: "Foto",
                    type: "camera",
                    mode: "size:25,25"
                }
            ];
            d.setFields(fields);
            var up = qxnw.userPolicies.getUserData();
            d.ui.foto.addListener("saved_image", function () {
                d.ui.accept.setEnabled(true);
            });
            d.ui.accept.setEnabled(false);
            d.ui.accept.addListener("execute", function () {
                var r = d.getRecord();
                up.foto = r.foto;
                var func = function () {
                    d.accept();
                    qxnw.utils.question(d.tr("Para ver su foto debemos refrescar esta página, ¿desea continuar?"), function (e) {
                        if (e) {
                            qxnw.local.storeDataWithOutPrefix("session", null, false);
                            window.location.reload();
                        }
                    });
                };
                qxnw.utils.fastRpcAsyncCall("nw_usuarios", "editMyPersonalData", up, func);
            });
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.show();
        },
        test: function test() {

            var f = new qxnw.examples.form_lights();
            f.setModal(true);
            f.show();
            return;
            var f = new qxnw.examples.form_light();
            f.show();
            return;
            var l = new qxnw.examples.listEdit();
            l.show();
            return;
            qxnw.userPolicies.addParameterData({pais: 1});
            var d = new geimp.forms.f_transito_internacional();
            d.show();
            //d.maximize();
            return;
            this.createMasterList("master", "afiliadoras", this.tr("Afiliadoras"), true);
            return;
            this.slotUsuarios();
            return;
            var f = new qxnw.forms();
            var frame = qxnw.utils.iframeGoogleMap(-33.8569, 151.2152);
            f.add(frame, {
                flex: 1
            });
            f.show();
            return;
            var f = new qxnw.examples.form_light();
            f.setModal(true);
            f.show();
            return;
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.exec("test_security", 0);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
            }

            return;
            var func = function (r) {
//                console.log(r);
            };
            qxnw.utils.fastAsyncRpcCall("master", "createWindowsLink", 0, func);
            return;
            qxnw.utils.fastAsyncRpcCall("master", "testWs", 0, func);
            return;
            this.slotNWPermissions();
            return;
            var f = new qxnw.forms();
            var navTable = new qxnw.examples.navTable();
            f.insertNavTable(navTable.getBase(), "navtable");
            this.addSubWindow("Nav Table", f);
            return;
            var f = new qxnw.examples.form_light();
            f.setModal(true);
            f.show();
            return;
            var example = new qxnw.examples.charts();
            example.executeExample("bars");
            return;
            var f = new qxnw.forms();
            f.setTitle("Nav table test");
            var nt = new qxnw.examples.navTable();
            f.insertNavTable(nt.getBase(), "Test");
            f.show();
            return;
            //qx.locale.Manager.getInstance().setLocale("co");
//            var self = this;
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "ingresos_generales");
//            rpc.setAsync(true);
//            var func = function(r) {
//                if (r != "" && r != null && r != undefined) {
//                    if (r[0].saldo > 0)
//                    {
//                        var d = new gastos_reservados.forms.f_ingresos_generales();
//                        var up = qxnw.userPolicies.getUserData();
//                        d.populateFirmas(up);
//                        d.setModalWindow(true);
//                        d.ui.cdp.setValue(r[0].cdp);
//                        d.ui.saldo.setValue(r[0].saldo.toString());
//                        d.ui.crp.setValue(r[0].crp);
//                        d.ui.fecha_crp.getChildControl("textfield").setValue(r[0].fecha_crp);
//                        d.ui.fecha_cdp.getChildControl("textfield").setValue(r[0].fecha_cdp);
//                        d.settings.accept = function() {
//                            self.applyFilters();
//                        };
//                        d.show();
//
//                    }
//                    else {
//                        qxnw.utils.alert("No hay ningun CDP disponible.Comuniquese con el Administrador");
//                        return true;
//                    }
//                }
//                else
//                {
//                    qxnw.utils.alert("No hay ningun CDP disponible.Comuniquese con el Administrador");
//                    self.reject();
//                }
//            };
//            rpc.exec("populateSaldos", 0, func);
//            return;
//            return;
//            var data = {};
//            data["usuario"] = "Andrés Flórez";
//            data["cargo"] = "Programador";
//            qxnw.utils.sendAutoNotification(1, data);

//            var data = {};
//            data["id_factura"] = 11001000;
//            data["direccion"] = "Calle 147 No 94C 38";
//            data["email"] = "assdres@hotmail.com";
//            data["telefono"] = "6817689";
//            data["fecha"] = "2013-10-22";
//            data["usuario"] = "andresf";
//            data["water_text"] = "TEST";
            //qxnw.utils.enableMouse();

            //f.setFields(fields);

            //var container = new qx.ui.container.Composite(new qx.ui.layout.HBox());
            //f.addToFields(container);
            //f.addFieldsByContainer(fields, container);
//            var f = new qxnw.forms();
//            f.setColumnsFormNumber(0);
//            var data = [[['ranas', 3], ['buitres', 7], ['ciervos', 2.5], ['pavos', 6], ['topos', 5], ['perros', 4]]];
//            var options = function($jqplot) {
//                return{
//                    title: 'Test de charts interactivos',
//                    seriesDefaults: {renderer: $jqplot.PieRenderer, rendererOptions: {sliceMargin: 8}},
//                    legend: {show: true}
//                };
//            };
//            var plugins = ['pieRenderer'];
//            var plot = new qxnw.charts(data, options, plugins);
//            f.add(plot, {
//                flex: 1
//            });
//            f.show();
//            f.ui.accept.addListener("click", function() {
//                if (!f.validate()) {
//                    return;
//                }
//                qxnw.utils.nwconsole(f.getRecord());
//            });
            //f.createPrinterToolBar("form_liq", data, 3);
            //f.hidePrinterSelect();
            //var r = qxnw.config.getPrinterData("configuraciones", "getData");

            //f.addPrinterdata(data);
            //f.addFrame("/nwlib/test.php", true, data);
            //var f = new qxnw.tmp.ckeditor();
            //var f = new qxnw.forms.permissions();
            //this.addSubWindow("Administrador de impresiones", f);
            //f.show();
        },
        __addressFinder: function __addressFinder() {
            var f = new qxnw.widgets.addressFinder();
            f.show();
        },
        slotSalir: function slotSalir() {
            var self = this;
            qxnw.utils.loading(main.tr("Cerrando sesión..."));
            var rpc = new qxnw.rpc(self.getRpcUrl(), "session");
            rpc.setAsync(true);
            var func = function (r) {
                qxnw.utils.stopLoading();
                qxnw.local.storeDataWithOutPrefix("session", null, false);
                qxnw.main.deleteMenuCache(false);
                self.isClosedApp = true;

                try {
                    qxnw.config.callBackOut();
                } catch (e) {
                    console.log(e);
                }

                var timer = new qx.event.Timer(200);
                timer.start();
                timer.addListener("interval", function (e) {
                    timer.stop();
                    window.location.href = window.location.href;
                });
            };
            var up = qxnw.userPolicies.getUserData();
            rpc.exec("salir", up, func);
        },
        testTime: function testTime() {
            var self = this;
            var f = new qxnw.forms.permissions();
            self.addSubWindow("Permisos", f);
        },
        textEdit: function textEdit() {
            var l = new qxnw.tmp.l_textEdit();
            this.addSubWindow("Listado", l);
        },
        __openNewExcelReport: function __openNewExcelReport() {
            var self = this;
        },
        __openNewForm: function __openNewForm() {
            var f = new qxnw.forms.newForm();
            f.show();
        },
        __openNewChart: function __openNewChart() {
            var f = new qxnw.charts.newChart();
            f.show();
        },
        __openStartPage: function __openStartPage() {
            var self = this;
            var f = new qxnw.forms();
            var toolBar = new qx.ui.toolbar.ToolBar().set({
                alignY: "middle",
                alignX: "center",
                spacing: 5
            });
            f.add(toolBar);
            var showStartUp = new qx.ui.form.CheckBox("Mostrar al inicio");
            showStartUp.setValue(qxnw.config.getShowInitialPage());
            toolBar.add(showStartUp);
            showStartUp.addListener("changeValue", function (e) {
                qxnw.local.storeData("show_initial_page", e.getData());
            });
            f.addFrame("http://www.netwoods.net/paginas-web-software/nwadmin_home-117?preview=true", false);
//            f.addFrame("https://www.gruponw.com?preview=true", false);
            self.addSubWindow(self.tr("Página Inicial"), f, false);
        },
        removeLogo: function removeLogo() {
            this.logo.close();
            this.__isCreatedLogo = false;
        },
        isCreatedLogo: function isCreatedLogo() {
            return this.__isCreatedLogo;
        },
        createFloatLogo: function createFloatLogo() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                self.showLogo(r);
            };
            rpc.exec("getLogo", 0, func);
        },
        showLogo: function showLogo(r) {
            var self = this;
            if (r == null) {
                return;
            }
            if (r.logo == "1" || r.logo == "" || r.logo == 0 || r.logo == null) {
                qxnw.local.storeData("nw_init_settings_logo", null);
                return;
            }
            var baseLayout = new qx.ui.layout.Grid();
            baseLayout.setColumnMaxWidth(0, 10);
            baseLayout.setColumnMaxWidth(1, 10);
            baseLayout.setRowMaxHeight(0, 10);
            baseLayout.setRowMaxHeight(1, 10);
            self.logo = new qx.ui.container.Composite(baseLayout).set({
                padding: 5
            });
            self.logo.addListener("appear", function () {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_logo");
            });

            var image = new qx.ui.basic.Image(r.logo).set({
                allowGrowX: false,
                allowGrowY: false,
                scale: true,
                height: 35
            });
            try {
                if (typeof r.web != 'undefined') {
                    image.setUserData("web", r.web);
                    if (self.__idListenerWebLogo != null) {
                        image.removeListenerById(self.__idListenerWebLogo);
                    }
                    image.setCursor("pointer");
                    self.__idListenerWebLogo = image.addListener("click", function () {
                        var w = this.getUserData("web");
                        var win = window.open("http://" + w, '_blank');
                        win.focus();
                    });
                }
            } catch (e) {
                qxnw.utils.hiddenError(e);
            }
            image.setUserData("logo", r.logo);
            self.logo.add(image, {
                row: 0,
                column: 0
            });
            image.setVisibility("hidden");
            image.addListener("loadingFailed", function (r) {
                qxnw.local.storeData("nw_init_settings_logo", "");
                self.logo.destroy();
                this.destroy();
            });
            image.addListener("loaded", function () {
                var logo = this.getUserData("logo");
                this.setUserData("logo_loaded", this.getUserData("logo_loaded") == null ? 1 : this.getUserData("logo_loaded") + 1);
                if (this.getUserData("logo_loaded") < 2) {
                    return;
                }
                if (logo == null) {
                    return;
                }
                qxnw.local.storeData("nw_init_settings_logo", logo);
                try {
                    if (qx.io.ImageLoader.isLoaded(logo)) {
                        var width = qx.io.ImageLoader.getWidth(logo);
                        var height = qx.io.ImageLoader.getHeight(logo);
                        var maxHeight = 35 > parseInt(height) ? parseInt(height) : 35;
                        var scale = parseInt(width) * maxHeight / parseInt(height);
                        if (scale === null || scale === "" || 1 > scale) {
                            scale = 60;
                        } else {
                            scale = Math.round(scale);
                        }
                        this.setWidth(scale);
                        var menuStyle = qxnw.config.getMenuStyle();
                        self.containerMenuUp.addAt(self.logo, 0);

                        if (menuStyle === "horizontal") {
//                            this.addListener("appear", function () {
//                                console.log("ENTRA 1");
//                                var bounds = this.getBounds();
//                                self.containerMenuUp.add(self.logo);
////                                self.logo.moveTo(0, 0);
////                                self.logo.moveTo(qx.bom.Viewport.getWidth() - scale - 25, 0);
//                                qxnw.local.storeData("logo_bounds", bounds);
//                            });
                        } else if ("vertical") {
//                            self.logo.moveTo(qx.bom.Viewport.getWidth() - scale - 25, 0);
                        }
                        self.logo.setVisibility("visible");
                        image.setVisibility("visible");
                        var logoBounds = {};
                        logoBounds["width"] = width;
                        logoBounds["height"] = height;
                        logoBounds["scale"] = scale;
                        qxnw.local.storeData("logo_bounds", logoBounds);
                        this.__isCreatedLogo = true;
//                        self.logo.open();
                    }
                } catch (e) {
                    qxnw.utils.nwconsole(e);
                }
            });
            self.logo.setVisibility("hidden");
        },
        initializeAlerts: function initializeAlerts() {
            var self = this;
            self.__timerAlerts = new qx.event.Timer(15000);
            self.__timerAlerts.start();
            self.__timerAlerts.addListener("interval", function (e) {
                var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
                rpc.setShowLoading(false);
                rpc.setHandleError(false);
                rpc.setAsync(true);
                var func = function (r) {
                    if (r == false) {
                        return;
                    }
                    qxnw.utils.makeSound();
                    var d = new qxnw.alerts.f_showAlert(r);
                    d.settings.accept = function () {
                        self.__timerAlerts.start();
                    };
                    d.settings.reject = function () {
                        self.__timerAlerts.start();
                    };
                    d.show();
                    self.__timerAlerts.stop();
                };
                rpc.exec("checkAlerts", 0, func);
            });
        },
        /*
         * Starts the partial layout. You put some content before this function is called
         */
        startPartialLayout: function startPartialLayout() {
            var self = this;
            var hLayout = new qx.ui.layout.HBox();
            var allContainer = new qx.ui.container.Composite(hLayout).set({
                paddingLeft: 5
            });
            var menuStyle = qxnw.config.getMenuStyle();
            self.__allContainer = allContainer;
            var vLayout = new qx.ui.layout.VBox().set({
                alignX: "left"
            });
            self.setWidget(allContainer);
            if (menuStyle === "vertical") {
                this.layout = new qx.ui.layout.VBox();
            } else {
                this.layout = new qx.ui.layout.HBox();
            }
            this.MainWindow = new qx.ui.container.Composite(this.layout);
            this.MainWindow.setMargin(1);

            self.containerMenuUp = new qx.ui.toolbar.ToolBar().set({
                minHeight: 30
            });

            qxnw.utils.addClassToElement(self.containerMenuUp, "toolbar_up");

            self.containerMenuUp.add(new qx.ui.toolbar.Separator());

            var appTitle = qxnw.local.getAppTitle();
            if (typeof appTitle === 'undefined' || appTitle === null) {
                appTitle = "";
            }
            var lblProgram = new qx.ui.basic.Label(appTitle).set({
                rich: true,
                alignY: "middle"
            });
            self.containerMenuUp.add(lblProgram);
            self.containerMenuUp.addSpacer();
            self.containerMenuUp.addListener("appear", function () {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_containerMenu");
            });

            self.centerContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());

            self.centerContainer.add(self.containerMenuUp);

            allContainer.add(self.centerContainer, {
                flex: 1
            });

            if (menuStyle === "vertical") {
                self.containerMenu = new qx.ui.container.Composite(new qx.ui.layout.HBox);
                self.containerMenu.setAllowStretchY(false);
                self.containerMenu.addListener("appear", function () {
//                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_containerMenu");
                });
                self.MainWindow.add(self.containerMenu);
            } else if (menuStyle === "horizontal") {

                document.body.classList.add('bodyNewDashboard_h');

                self.containerMainMenu = new qx.ui.container.Composite(new qx.ui.layout.VBox());
                self.MainWindow.add(self.containerMainMenu);
                self.scrollContainerMenuHorizontal = new qx.ui.container.Scroll();
                self.containerMainMenu.add(self.scrollContainerMenuHorizontal, {
                    flex: 1
                });
                self.scrollContainerMenuHorizontal.set({
                    maxWidth: 0,
                    minWidth: 0
                });
                qxnw.utils.addClassToElement(self.scrollContainerMenuHorizontal, "menu_scroll");
                var vBoxLayoutMenu = new qx.ui.layout.VBox().set({
                    alignX: "left",
                    alignY: "top"
                });
                self.containerMenu = new qx.ui.container.Composite(vBoxLayoutMenu);
                self.scrollContainerMenuHorizontal.add(self.containerMenu, {
                    flex: 1
                });
            }
            self.centerContainer.add(this.MainWindow, {
                flex: 1
            });

            self.__rightContainer = new qx.ui.container.Composite(vLayout).set({
                maxWidth: 25
            });
            allContainer.add(self.__rightContainer);

            self.__rightContainer.addListener("appear", function () {
                if (qxnw.config.getResizeMainLeftMenu() === true) {
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_col_right");
                } else {
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_col_right_no_hover");
                }
            });
        },
        sendMinimizedAlert: function sendMinimizedAlert(sender, message) {
            var self = this;
            if (typeof message != 'undefined' && message != null) {
                qxnw.notifications.createNotifications(self, message);
            }
            if (self.wBar == null) {
                return;
            }
            var child = self.wBar.getChildren();
            for (var i = 0; child.length; i++) {
                if (typeof child[i] != 'undefined') {
                    var name = child[i].getUserData(sender.getAppWidgetName());
                    if (name) {
                        qxnw.animation.startEffect("shake", child[i]);
                        qxnw.utils.addBorder(child[i]);
                        return;
                    }
                }
            }
        },
        loadMenuCompany: function loadMenuCompany(value, menu) {
            var self = this;
            var v = value;
            var b = new qx.ui.menu.Button(v["razon_social"], qxnw.config.execIcon("go-next")).set({
                cursor: "pointer"
            });
            qxnw.utils.addClassToElement(b, "main_user_company");
            b.setUserData("model", v);
            b.setUserData("company", v["razon_social"]);
            b.setUserData("company_id", v["id"]);
            b.addListener("execute", function () {
                var empresa_id = this.getUserData("company_id");
                var razon_social = this.getUserData("company");
                var model = this.getUserData("model");
                qxnw.utils.question(self.tr("¿Desea cambiar a la empresa seleccionada?"), function (e) {
                    if (e) {
                        var data = {};
                        data.empresa = empresa_id;
                        data.nom_empresa = razon_social;
                        data.model = model;
                        data.checkConcurrency = false;
                        var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_session", true);
                        var func = function (r) {
                            if (r) {
                                qxnw.local.storeDataWithOutPrefix("session", null, false);
                                qxnw.main.deleteMenuCache(false);
                                qxnw.local.setData("session", null);
                                qxnw.utils.information(self.tr("¡Empresa modificada correctamente! El sistema se actualizará automaticamente en 5 segundos."));
                                setTimeout(function () {
                                    location.reload();
                                }, 5000);
                            }
                        };
                        rpc.exec("setEmpresa", data, func);
                    }
                });
            });
            menu.add(b);
        },
        searchCompanies: function searchCompanies(menu) {
            var self = this;
            var d = {};
            d["usuario"] = self.up.user;
            d["version"] = qxnw.local.getAppVersion();
            var func = function (rta) {
                qxnw.local.setData("nw_companies", rta);
                qxnw.config.setManyCompanies(rta.length);
                for (var i = 0; i < rta.length; i++) {
                    self.loadMenuCompany(rta[i], menu);
                }
            };
            qxnw.utils.fastAsyncRpcCall("nw_session", "getEmpresas", d, func);
        },
        /**
         * Create the right widget and make the plugins functions
         * @returns {void}
         */
        createRightWidgets: function createRightWidgets() {
            var self = this;

            var up = self.up;
            var foto = "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/dashboard/img/icon_user.png";
            if (typeof up.photo != "undefined" && up.photo != null && up.photo != "") {
                foto = up.photo;
            }

//            var html = "<img class='qxnw_imgUserMainPhoto' src='" + foto + "' width='22px' />";

            function getUserMenu() {

                var bounds = qx.bom.Viewport.getHeight();

                var menu = new qx.ui.menu.Menu();
                menu.setAllowGrowY(false);
                menu.setMaxHeight(bounds);

                var buttonChangePass = new qx.ui.menu.Button(self.tr("Cambio de clave"), qxnw.config.execIcon("security-high", "status"));
                qxnw.utils.addClassToElement(buttonChangePass, "main_user_menu_change_password");
                buttonChangePass.addListener("execute", function () {
                    self.slotNWCambiarClave();
                });
                menu.add(buttonChangePass);

                var buttonPersonalData = new qx.ui.menu.Button(self.tr("Mis datos de usuario"), qxnw.config.execIcon("preferences-users", "apps"));
                qxnw.utils.addClassToElement(buttonPersonalData, "main_user_menu_change_password");
                buttonPersonalData.addListener("execute", function () {
                    self.slotMyPersonalData();
                });
                menu.add(buttonPersonalData);

                var buttonOut = new qx.ui.menu.Button(self.tr("Salir"), qxnw.config.execIcon("system-log-out"));
                qxnw.utils.addClassToElement(buttonOut, "main_user_menu_out");
                buttonOut.addListener("execute", function () {
                    self.slotSalir();
                });
                menu.add(buttonOut);

                var companies = qxnw.local.getData("nw_companies");
                if (companies === null) {
                    self.searchCompanies(menu);
                } else {
                    for (var i = 0; i < companies.length; i++) {
                        self.loadMenuCompany(companies[i], menu);
                    }
                }
                return menu;
            }

            var configContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
            qxnw.utils.addClassToElement(configContainer, "qxnw_container_config_main");
            var menu = new qxnw.menu(configContainer, true, "vertical");
            self.menuCreateApp = menu;
            self.__createAppMenu(menu);
            menu.exec(true, configContainer);
            self.containerMenuUp.addAt(configContainer, 3, {
                flex: 0
            });
            self.containerMenuUp.addAt(new qx.ui.toolbar.Separator(), 4, {
                flex: 0
            });
            self.userDataColumn = new qx.ui.toolbar.SplitButton("", foto, getUserMenu()).set({
                allowGrowX: true,
                allowGrowY: false,
                maxWidth: 220,
                cursor: "pointer",
                alignX: "right"
            });
            qxnw.utils.addClassToElement(self.userDataColumn, "main_user_foto_button");
            self.userDataColumn.getChildControl("button").set({
                rich: true
            });
            var iconImageUser = self.userDataColumn.getChildControl("button").getChildControl("icon");
            iconImageUser.set({
                maxWidth: 35,
                maxHeight: 35,
                scale: true
            });
            var imgTmp = new qx.ui.basic.Image(foto);
            imgTmp.addListener("loadingFailed", function (r) {
                var these = this;
                var t = new qx.event.Timer(1000);
                t.start();
                t.addListener("interval", function (e) {
                    this.stop();
                    these.destroy();
                    self.userDataColumn.setIcon(qxnw.config.execIcon("preferences-users", "apps"));
                });
            });


            self.userDataColumn.addListener("appear", function () {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
            });
            self.userDataColumn.addListener("appear", function () {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right_userDataColumn");
            });
            var toolTip = new qx.ui.tooltip.ToolTip(self.tr("Configuraciones de mi perfil"));
            self.userDataColumn.setToolTip(toolTip);
            self.containerMenuUp.addAt(self.userDataColumn, 5, {
                flex: 1
            });
            self.userDataColumn.getChildControl("button").addListener("execute", function () {
                var menu = self.userDataColumn.getMenu();
                menu.placeToWidget(this);
                menu.show();
            });
            var notificationsImagenAx = new qx.ui.basic.Atom(self.tr("Notificaciones"), qxnw.config.execIcon("dialog-information", "status")).set({
                cursor: "pointer",
                allowGrowY: true,
                gap: 8,
                show: "icon",
                paddingBottom: 5
            });
            var toolTipNot = new qx.ui.tooltip.ToolTip(self.tr("Historial de notificaciones, avisos y alertas del sistema"));
            if (!qxnw.config.getNotifications()) {
                notificationsImagenAx.setEnabled(false);
            }
            notificationsImagenAx.setToolTip(toolTipNot);

            self.containerMenuUp.addAt(notificationsImagenAx, 4, {
                flex: 0
            });

            self.__notificationsImage = notificationsImagenAx;
            notificationsImagenAx.addListener("click", function (e) {
                if (!self.__isNotificationsCreated) {
                    self.__notification = new qxnw.widgets.notifications(self);
                    self.__notification.show();
                    self.__isNotificationsCreated = true;
                } else {
                    self.__notification.updateNotifications();
                    self.__notification.show();
                }
                if (typeof notification_window !== 'undefined' && notification_window) {
                    notification_window.destroy();
                    notification_window = null;
                }
                self.__notification.moveToPosition(parseInt(Math.round(qx.bom.Viewport.getWidth() - (195))), 46);
            });
            //ANDRESF 2020: SE QUITA POR SU BAJO USO
//            self.__searchImage = new qx.ui.basic.Atom(self.tr("Buscar"), qxnw.config.execIcon("busqueda", "qxnw", 6)).set({
//                cursor: "pointer"
//            });
//            self.__searchImage.addListener("appear", function () {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
//            });
//            var toolTip = new qx.ui.tooltip.ToolTip(self.tr("Búsqueda en todo el sistema"));
//            if (!qxnw.config.getNotifications()) {
//                self.__searchImage.setEnabled(false);
//            }
//            self.__searchImage.setToolTip(toolTip);
//            self.__rightContainer.add(self.__searchImage);
//            self.__searchImage.addListener("activate", function (e) {
//                var f = new qxnw.forms();
//                f.addFooterNote(self.tr("Búsqueda en todo el sistema"));
//                f.setColumnsFormNumber(1);
//                f.setInvalidateStore(true);
//                f.setShowMinimize(false);
//                f.setShowMaximize(false);
//                var fields = [
//                    {
//                        name: "menuFinder",
//                        type: "selectTokenField",
//                        label: self.tr("Buscador:")
//                    }
//                ];
//                f.setFields(fields);
//                f.ui.menuFinder.setPlaceholder("Digite");
//                f.ui.menuFinder.hideColumn("id");
//                f.ui.menuFinder.hideColumn("callback");
//                f.ui.accept.setVisibility("excluded");
//                f.ui.cancel.addListener("execute", function () {
//                    f.reject();
//                });
//                f.addListener("appear", function () {
//                    var root = qx.core.Init.getApplication().getRoot();
//                    var width = 30;
//                    f.moveTo(width, 95);
//                    qxnw.animation.startEffect("rotateIn", f);
//                });
//                f.ui.menuFinder.addListener("loadData", function (e) {
//                    var data = {};
//                    data["token"] = e.getData();
//                    var menuStored = qxnw.local.getData("menu");
//                    var modelData = [];
//                    for (var i = 0; i < menuStored.length; i++) {
//                        var dat = menuStored[i];
//                        if (typeof dat.name == "string") {
//                            if (qxnw.utils.lowerFirst(dat.name).indexOf(qxnw.utils.lowerFirst(data["token"])) != -1) {
//                                if (dat.callback != '') {
//                                    var rta = {};
//                                    rta["id"] = dat.callback;
//                                    rta["nombre"] = dat.name;
//                                    rta["callback"] = dat.callback;
//                                    modelData.push(rta);
//                                }
//                            }
//                        }
//                    }
//                    f.ui.menuFinder.setModelData(modelData);
//                }, this);
//                f.ui.menuFinder.addListener("addItem", function (e) {
//                    var data = e.getData();
//                    if (data.callback != 0 && data.callback != '' && data.callback != null) {
//                        if (typeof main != 'undefined') {
//                            if (typeof data.callback != 'undefined') {
//                                if (data.callback != null) {
//                                    if (data.callback != '') {
//                                        try {
//                                            qxnw.utils.loading("Cargando elemento...");
//                                            var interval = setInterval(function () {
//                                                clearInterval(interval);
//                                                if (typeof self.menu != 'undefined' && self.menu != null) {
//                                                    self.menu.handleCallback(data.callback, main);
//                                                } else {
//                                                    qxnw.menu.handleCallback(data.callback, main);
//                                                }
//                                                qxnw.utils.stopPopup();
//                                            }, 100);
//                                        } catch (e) {
//                                            qxnw.utils.error(e);
//                                            qxnw.utils.stopPopup();
//                                        }
//                                    }
//                                }
//                            }
//                        }
//                    }
//                });
//                f.show();
//            });
//            var calcImage = new qx.ui.basic.Atom(self.tr("Calculadora"), qxnw.config.execIcon("Calculadora", "qxnw", 6)).set({
 //               cursor: "pointer",
 //               allowGrowY: true,
 //               gap: 8,
 //               paddingBottom: 5
 //           });
 //           calcImage.addListener("appear", function () {
 //               qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
 //           });
 //           toolTip = new qx.ui.tooltip.ToolTip(self.tr("Calculadora sencilla"));
 //           calcImage.setToolTip(toolTip);
//            self.__rightContainer.add(calcImage);
//            calcImage.addListener("activate", function (e) {
//                var wCalc = new qxnw.calc.init();
 //               wCalc.show();
 //           });
  //          var configButton = new qx.ui.basic.Atom(self.tr("Configuraciones"), qxnw.config.execIcon("preferences-wallpaper", "apps", 6)).set({
  //              cursor: "pointer",
  //              allowGrowY: true,
  //              gap: 8,
  //              paddingBottom: 5
  //          });
  //          configButton.addListener("appear", function () {
  //              qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
  //          });
  //          var toolTip = new qx.ui.tooltip.ToolTip(self.tr("Configure los estilos del programa, colores, tipos de letra, tamaños de botones, entre muchas otras opciones"));
  //          configButton.setToolTip(toolTip);
  //          self.__rightContainer.add(configButton);
  //          configButton.addListener("click", function () {
  //              qxnw.main.slotBtnConfigQxnw();
//                if (self.menu == null) {
//                    self.menu = new qxnw.menu(self);
//                }
//                self.menu.exec(false);
//                self.cleanMenuDebAndConf();
//                self.__createAppMenu();
//            });
            var chronoButton = new qx.ui.basic.Atom(self.tr("Cronómetro"), qxnw.config.execIcon("appointment-new", "actions", 6)).set({
                cursor: "pointer",
                allowGrowY: true,
                gap: 8,
                paddingBottom: 5
            });
            chronoButton.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
            });
            var toolTip = new qx.ui.tooltip.ToolTip(self.tr("Cronómetro"));
            chronoButton.setToolTip(toolTip);
            //self.__rightContainer.add(chronoButton);
            chronoButton.addListener("click", function () {
                var d = new qxnw.forms.cronometer();
                d.show();
                d.addListenerOnce('appear', function () {
                    var bounds = this.getBounds();
                    this.moveTo(qx.bom.Viewport.getWidth() - (bounds.width + 30), 100);
                    qxnw.animation.startEffect("rotateIn", this);
                });

            });
//            var cmi_left = new qx.ui.basic.Atom(self.tr("Cuadro de mando integral"), qxnw.config.execIcon("cmi", "qxnw", 6)).set({
//                cursor: "pointer",
//                allowGrowY: true
//            });
//            cmi_left.addListener("appear", function () {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
//            });
//            var toolTipCmi = new qx.ui.tooltip.ToolTip(self.tr("Cuadro de mando integral. Integre sus informes en una única vista"));
//            cmi_left.setToolTip(toolTipCmi);
//            self.__rightContainer.add(cmi_left);
//            cmi_left.addListener("activate", function () {
//                var cmi = new qxnw.cmi.main();
//                main.addSubWindow(self.tr("Cuadro de mando integral"), cmi);
//            });
            if (self.up != null) {
                var index = qxnw.userPolicies.getDevelopers().indexOf(self.up.user);
                if (index != -1) {
                    var devImage = new qx.ui.basic.Atom(self.tr("Desarrolladores"), qxnw.config.execIcon("preferences-network", "apps", 6)).set({
                        cursor: "pointer",
                        allowGrowY: true,
                        gap: 8
                    });
                    devImage.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
                    });
                    devImage.addListener("activate", function () {
                        var menuStyle = qxnw.config.getMenuStyle();
                        if (self.menu === null) {
                            if (menuStyle === "horizontal") {
                                self.menu = new qxnw.menuHorizontal(self);
                            } else {
                                self.menu = new qxnw.menu(self);
                            }
                        }
                        if (menuStyle === "horizontal") {
                            if (self.menu) {
                                self.menu.showMenu();
                            }
                            self.openMenuScroller();
                            self.buttonOpener.setUserData("opened", true);
                            self.buttonOpener.setIcon(qxnw.config.execIcon("go-first"));
                            self.cleanMenuDebAndConf(true);
                            self.openDevelopersView(false);
                            self.menu.exec(false);
                        } else {
                            if (!self.getIsCreatedMenu()) {
                                self.menu.exec(true);
                            }
                            self.openDevelopersView(false);
                        }
                    });
                    toolTip = new qx.ui.tooltip.ToolTip(self.tr("Opciones avanzadas para desarrolladores"));
                    devImage.setToolTip(toolTip);
                    self.__rightContainer.add(devImage);
                }
            }

            var idiomIcon = qxnw.config.execIcon("Idiomas", "qxnw", 6);
            try {
                var langVar = qxnw.local.getOpenData("lang");
                if (langVar != null) {
                    var extract = qxnw.config.searchIntoLocales(langVar);
                    idiomIcon = qxnw.config.execIcon(extract.icon, extract.iconType);
                }
            } catch (e) {
                qxnw.utils.error(e);
            }
            var lang_left = new qx.ui.basic.Atom(self.tr("Idiomas/países disponibles"), idiomIcon).set({
                cursor: "pointer",
                allowGrowY: true,
                gap: 7,
                paddingBottom: 5,
                paddingRight: 5
            });
            lang_left.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
            });
            var toolTipLang = new qx.ui.tooltip.ToolTip(self.tr("Idiomas. El sistema seguirá integrando varios idiomas"));
            lang_left.setToolTip(toolTipLang);
            //self.__rightContainer.add(lang_left);
            lang_left.addListener("click", function (e) {
                var items = qxnw.config.getLocales();
                var func = function (r) {
                    qxnw.config.setLocaleByData(r.name);
                };
                qxnw.utils.quickSelectBox(lang_left, items, "widget", false, func);
            });
            //self.lang_up_image = lang_left;
//            var notesImage = new qx.ui.basic.Atom(self.tr("Notas personales"), qxnw.config.execIcon("Notas", "qxnw", 6)).set({
//                cursor: "pointer",
//                allowGrowY: true
//            });
//            notesImage.addListener("appear", function () {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
//            });
//            var toolTip = new qx.ui.tooltip.ToolTip(self.tr("Notas personales. Lleve sus anotaciones a cualquier lugar"));
//            notesImage.setToolTip(toolTip);
//            self.__rightContainer.add(notesImage);
//            notesImage.addListener("activate", function () {
//                self.__wNotes = new qxnw.forms.notes(self);
//                self.__wNotes.show();
//            });
            var nwdriveImage = new qx.ui.basic.Atom(self.tr("NW Drive (archivos en línea)"), qxnw.config.execIcon("Drive", "qxnw", 6)).set({
                cursor: "pointer",
                allowGrowY: true,
                gap: 7,
                paddingBottom: 5
            });
            nwdriveImage.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
            });
            //toolTip = new qx.ui.tooltip.ToolTip(self.tr("Completo sistema de administración de archivos en la nube"));
            //nwdriveImage.setToolTip(toolTip);
            //nwdriveImage.addListener("tap", function () {
              //  var d = new qxnw.nw_drive.trees.vista_general();
               // d.createWindow();
               // main.addSubWindow(self.tr("Mis Archivos"), d);
            //});
           // self.__rightContainer.add(nwdriveImage);
            var nwexcelimage = new qx.ui.basic.Atom(self.tr("NW Calculate (hojas de cálculo)"), qxnw.config.execIcon("nwexcel", "qxnw", 6)).set({
                cursor: "pointer",
                allowGrowY: true,
                gap: 7,
                paddingBottom: 5
            });
            nwexcelimage.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
            });
            //toolTip = new qx.ui.tooltip.ToolTip(self.tr("NWCalculate, Hojas de cálculo avanzadas. Edite celdas, valores, operaciones, entre muchas otras opciones"));
            //nwexcelimage.setToolTip(toolTip);
            nwexcelimage.addListener("tap", function () {
                qxnw.main.slotNwExcel();
            });
            //self.__rightContainer.add(nwexcelimage);
//            var supportImage = new qx.ui.basic.Image(qxnw.config.execIcon("help-faq", "actions")).set({
            var supportImage = new qx.ui.basic.Atom(self.tr("Soporte"), qxnw.config.execIcon("Soporte", "qxnw", 6)).set({
                cursor: "pointer",
                allowGrowY: true,
                gap: 7,
                paddingBottom: 5
            });
            //TODO: mientras se arregla o se optimiza el chat
            supportImage.setVisibility("excluded");
            supportImage.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
            });
            toolTip = new qx.ui.tooltip.ToolTip(self.tr("Soporte especializado con el equipo de NW Group"));
            supportImage.setToolTip(toolTip);
            //self.__rightContainer.add(supportImage);
            supportImage.addListener("click", function () {
                self.openSupport();
            });
//            var notesImage = new qx.ui.basic.Image(qxnw.config.execIcon("utilities-notes", "apps", 6)).set({
//            var favoritesImage = new qx.ui.basic.Image(qxnw.config.execIcon("help-about", "actions", 6)).set({
//                cursor: "pointer"
//            });
//            favoritesImage.addListener("appear", function() {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
//            });
//            toolTip = new qx.ui.tooltip.ToolTip(self.tr("Favoritos"));
//            favoritesImage.setToolTip(toolTip);
//            self.__rightContainer.add(favoritesImage);
//            favoritesImage.addListener("activate", function() {
//                if (!self.__isFavoritesCreated) {
//                    var wFavorites = new qxnw.forms.favorites(self);
//                    wFavorites.show();
//                    self.__isFavoritesCreated = true;
//                }
//            });

            var pqrImage = new qx.ui.basic.Atom(self.tr("Problemas, quejas y soluciones"), qxnw.config.execIcon("pqr", "qxnw", 6)).set({
                cursor: "pointer",
                allowGrowY: true,
                gap: 7,
                paddingBottom: 5
            });
            pqrImage.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
            });
            //toolTip = new qx.ui.tooltip.ToolTip(self.tr("Sistema en línea con el equipo NW de peticiones, quejas y reclamos"));
            pqrImage.setToolTip(toolTip);
            //self.__rightContainer.add(pqrImage);
            pqrImage.addListener("click", function () {
                self.showPQR(true);
            });
            var exit_left = new qx.ui.basic.Atom(self.tr("Salir"), qxnw.config.execIcon("salir", "qxnw", 6)).set({
                cursor: "pointer",
                allowGrowY: true,
                gap: 7,
                paddingBottom: 5
            });
            exit_left.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_icon_right");
            });
           // var toolTip = new qx.ui.tooltip.ToolTip(self.tr("Salir del sistema con seguridad"));
            exit_left.setToolTip(toolTip);
            //self.__rightContainer.add(exit_left);
            //exit_left.addListener("click", function () {
              //  self.slotSalir();
           // });
            //START botón soporte
            //andresf-06-may-2019: lo quito hasta que se modifique la ubicación porque tapa los botones de cerrar
            //self.openChatSupport();
            //FIN botón soporte
//            self.openChatSupport();

        },
        openChatSupport: function openChatSupport() {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var sop = up.db;
            qxnw.utils.loadCss("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/css/light.css");
            if (typeof (sop) == 'object') {
                var data = {};
                data.array_param = {};
                data.array_param.cliente = sop.cliente;
                data.array_param.cliente_text = sop.cliente_text;
                data.array_param.usuario = up.user;
                data.method = "consultaDestinatariosTk";
                var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones");
                rpc.setAsync(true);
                var func = function (r) {
                    var node = document.createElement("div");
                    node.innerHTML = "<span id='minimizar'>!</span><div class='icono_s'><div class='text_s'><p>¿Tienes alguna novedad?</p></div>";
                    node.className = "ticketnw";
                    document.body.appendChild(node);
                    var ticket = document.querySelector(".ticketnw");
                    ticket.onclick = function () {
                        //24/04/2020 el slot llama el listado de tickets
                        qxnw.main.slotCrearTicket(r);
                    };

                };
                rpc.exec("populateConsultasTK", data, func);
            }
        },
        openChatLeft: function openChatLeft() {
            var self = this;
            if (self.wChat == null) {
                self.wChat = new qxnw.chat.init();
                self.wChat.show();
                self.wChat.addListener("close", function () {
                    self.wChat = null;
                });
            } else {
                self.wChat.focus();
            }
        },
        cleanMenuDebAndConf: function cleanMenuDebAndConf(onlyDevelopers) {
            var self = this;
            if (typeof self.menu == 'undefined' || self.menu == null) {
                return;
            }
            var menuStyle = qxnw.config.getMenuStyle();

            if (menuStyle === "horizontal") {
                var children = self.menu.getMenuButtons1();
                var i = 0;
                for (var d in children) {
                    var lbl = children[d].getValue();

                    console.log("lbl", lbl);
                    console.log("onlyDevelopers", onlyDevelopers);

                    if (lbl == "Developers") {
                        var name = children[d].getUserData("parent_name");
                        self.menu.menuContainers[name].destroy();
                    }
                    if (typeof onlyDevelopers != 'undefined' && onlyDevelopers === true) {
                        continue;
                    }
                    if (lbl == "Configuración") {
                        var name = children[d].getUserData("parent_name");
                        self.menu.menuContainers[name].destroy();
                    }
                    i++;
                }
            } else {
                var children = self.menu.getChildren();
                for (var i = children.length - 1; i >= 0; i--) {
                    if (typeof children[i].getLabel === 'undefined') {
                        continue;
                    }
                    var lbl = children[i].getLabel();
                    lbl = lbl.toString();
                    if (lbl == "Developers") {
                        self.menu.removeAt(i);
                    }
                    if (typeof onlyDevelopers != 'undefined' && onlyDevelopers === true) {
                        continue;
                    }
                    if (lbl == "Configuración") {
                        self.menu.removeAt(i);
                    }
                }
            }
        },
        showPQR: function showPQR(isMain) {
            var self = this;
            var fs = [
                {
                    name: "tipo",
                    type: "selectBox",
                    label: self.tr("Tipo")
                },
                {
                    name: "telefono",
                    type: "textField",
                    required: true,
                    label: self.tr("Teléfono")
                },
                {
                    name: "descripcion",
                    required: true,
                    type: "textArea",
                    label: self.tr("Descripción")
                }
            ];
            var f = new qxnw.utils.dialog(fs, self.tr("Para nosotros es muy importante su opinión"), true);
            f.setModal(true);
            f.addFooterNote("Cuente con nuestro compromiso de que sus requerimientos serán atendidos. <br /> Nuestros tiempos de respuesta para todas las Peticiones, Quejas y Reclamos son de máximo 15 días hábiles.");
            if (typeof isMain != 'undefined' && isMain == true) {
                f.addListener("appear", function (e) {
                    f.moveTo(35, 190);
                    qxnw.animation.startEffect("rotateIn", f);
                });
            }
            var d = {};
            d["PETICION"] = "Petición";
            d["QUEJA"] = "Queja";
            d["RECLAMO"] = "Reclamo";
            qxnw.utils.populateSelectFromArray(f.ui.tipo, d);
            f.settings.accept = function () {
                var d = f.getRecord();
                var func = function (r) {
                    qxnw.utils.information(r);
                };
                qxnw.utils.fastAsyncRpcCall("master", "sendPqr", d, func);
            };
            f.show();
        },
        alertNotifications: function alertNotifications() {
            var self = this;
            //self.__notificationsImage.setSource(qxnw.config.execIcon("dialog-warning", "status"));
            if (qxnw.config.getNotificationsAnimation()) {
                qxnw.animation.startEffect("shake", self.__notificationsImage);
            }
//            qx.bom.element.Class.remove(self.__notificationsImage.getContentElement().getDomElement(), "no_notifications_icon");
//            qx.bom.element.Class.add(self.__notificationsImage.getContentElement().getDomElement(), "nw_icon_right");
            self.__timerNotificationsShake = new qx.event.Timer(3000);
            self.__timerNotificationsShake.start();
            self.__areDisabledNotifications = false;
            self.__timerNotificationsShake.addListener("interval", function (e) {
                if (!self.__areDisabledNotifications) {
                    if (qxnw.config.getNotificationsSound()) {
                        qxnw.utils.makeSound();
                    }
                    if (qxnw.config.getNotificationsAnimation()) {
                        qxnw.animation.startEffect("shake", self.__notificationsImage);
                    }
                }
            });
            self.__areAlertedNotifications = true;
        },
        disableNotifications: function disableNotifications() {
            try {
                this.__areAlertedNotifications = false;
                this._totalNotifications = 0;
                if (this.__timerNotificationsShake != null) {
                    this.__timerNotificationsShake.stop();
                }
            } catch (e) {
                qxnw.utils.hiddenError(e);
            }
        },
        flushNotifications: function flushNotifications() {
            //var htmlNotification = "<div class='div_chat_contain'><img class='qxnw_imgUserMain' src='/nwlib/icons/notify2.png' width='24px' /></div><div class='divAlertRight'>0</div>";
            //this.__notificationsImage.setValue(htmlNotification);
//            qx.bom.element.Class.add(this.__notificationsImage.getContentElement().getDomElement(), "no_notifications_icon");
            this.__notificationsImage.setIcon(qxnw.config.execIcon("dialog-information", "status"));
            this.__areDisabledNotifications = true;
            this.__areAlertedNotifications = false;
            this._totalNotifications = 0;
            if (this.__timerNotificationsShake != null) {
                this.__timerNotificationsShake.stop();
            }
        }
        ,
        startNotifications: function startNotifications() {
            var self = this;
            // andresf 2021: se optimiza para que se llame luego y no cada vez que arranque
            //self.checkNotifications();
            self.__timerNotifications = new qx.event.Timer(qxnw.config.getTimeNotifications());
            self.__timerNotifications.start();
            self.__timerNotifications.addListener("interval", function (e) {
                self.checkNotifications();
            });
        },
        checkNotifications: function checkNotifications() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_notifications", true);
            rpc.setShowLoading(false);
            rpc.setHandleError(false);
            var func = function (r) {
                if (r != false && typeof r.total != 'undefined' && parseInt(r.total) > 0) {
                    r.total = parseInt(r.total);
                    self.__notificationsImage.setIcon(qxnw.config.execIcon("dialog-warning", "status", 6));
                    if (r.total != self._totalNotifications) {
                        var accent = "ó";
                        var apendix = "";
                        if (parseInt(r.total) > 1) {
                            apendix = "es";
                            accent = "o";
                        }
                        var text = "";
                        if (r.total > 1) {
                            text = "Tiene " + r.total + " notificaci" + accent + "n" + apendix + " sin leer... ";
                        } else if (r.total == 1) {
                            text = r.mensaje;
                        }
                        var complementText = null;
                        if (typeof r.complement != 'undefined') {
                            complementText = r.complement;
                        }
                        var icon = qxnw.local.getData("nw_init_settings_logo");
                        if (icon == null) {
                            var locref = document.location.href.replace("source", "");
                            locref = locref.replace("index.html", "");
                            icon = locref + "nwlib" + qxnw.userPolicies.getNwlibVersion() + "/icons/notify2.png";
                        }
                        var funcOnClick = function () {
                            if (!main.__isNotificationsCreated) {
                                main.__notification = new qxnw.widgets.notifications(self);
                                main.__notification.moveToPosition(parseInt(Math.round(qx.bom.Viewport.getWidth() - (195))), 46);
                                main.__notification.show();
                                main.__isNotificationsCreated = true;

//                                var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "nw_notifications");
//                                rpc.setAsync(true);
//                                rpc.exec("setReadedNotifications");
                            }
                        };
                        var funcOnClose = function (notifications) {
                            for (var i = 0; i < notifications.length; i++) {
                                try {
                                    notifications[i].close();
                                } catch (e) {

                                }
                            }
                        };
                        var created = false;
                        try {
                            created = qxnw.notifications.createNotification(self, text, icon, funcOnClick, funcOnClose, complementText);
                        } catch (e) {
                            qxnw.utils.error(e, self);
                        }
                        self._totalNotifications = parseInt(r.total);
                    }
                    if (!self.__areAlertedNotifications) {
                        self.alertNotifications();
                    }
                } else {
                    self._totalNotifications = 0;
                    if (self.__timerNotificationsShake != null) {
                        self.__timerNotificationsShake.stop();
                    }
                }
            };
            rpc.exec("checkNotifications", 0, func);
        }
        ,
        /*
         * Create the base of the main in the project, like layouts, splitters, 
         * central widgets and restore all subwindows stored.
         * @return {Boolean} if the base is created or not
         */
        createBase: function createBase() {
            var self = this;
            if (self.__isBaseCreated) {
                return;
            }
            self.verticalLayout = new qx.ui.layout.VBox();
            self.centralWidget = new qx.ui.container.Composite(this.verticalLayout);
            self.centralWidget.setMargin(1);
//            self.splitter = new qx.ui.splitpane.Pane("horizontal");
            var centerLayout = new qx.ui.layout.VBox();
            self.centerComposite = new qx.ui.container.Composite(centerLayout);
            self.centralWidget.add(self.centerComposite, {
                flex: 1
            });
//            self.splitter.addListener("appear", function () {
//                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_verticalLayout");
//            });
            self.MainWindow.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_MainWindow");
            });
            self.centralWidget.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_centralWidget");
            });
            self.tabView = new qx.ui.tabview.TabView();
            self.tabView.setContentPadding(2);
            self.centerComposite.add(self.tabView, {
                flex: 1
            });
            self.tabView.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_tabView");
            });
//            self.splitter.add(self.centerComposite);
//            qxnw.utils.addBorder(self.centralWidget);
            self.MainWindow.add(self.centralWidget, {
                flex: 1
            });
            var menuStyle = qxnw.config.getMenuStyle();
            if (menuStyle === "horizontal") {
                self.createButtonMenu(self.centralWidget);
            }
            self.__total = 0;
            self.isCreated = true;
            self.createWindowsBar();
            self.createRightWidgets();
            if (!self.__isBaseCreated) {
                self.__isBaseCreated = true;
            }
            if (qxnw.config.getShowInitialPage() === true) {
                self.__openStartPage();
            }
            return true;
        },
        __selectSpanish: function __selectSpanish() {
            qxnw.local.storeOpenData("lang", "es");
            qx.locale.Manager.getInstance().setLocale("es");
        },
        __selectEnglish: function __selectEnglish() {
            qxnw.local.storeOpenData("lang", "en");
            qx.locale.Manager.getInstance().setLocale("en");
        },
        __openBehaviorConfig: function __openBehaviorConfig() {
            var d = new qxnw.forms.behavior();
            d.show();
        },
        /**
         * Try to get the main server version of this library and show ir in a window
         * @return {void}
         */
        verifyVersion: function verifyVersion() {
            var data = {};
            data["version"] = qxnw.userPolicies.getVersion();
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            var func = function (r) {
                qxnw.utils.information(r);
            };
            rpc.setAsync(true);
            rpc.exec("verifyVersion", data, func);
        }
        ,
        /**
         * Delete all configuration data on client side
         * @return {void}
         */
        deleteConfiguration: function deleteConfiguration() {
            var self = this;
            qxnw.utils.question(this.tr("¿Realmente desea borrar toda su configuración?"), function (e) {
                if (e) {
                    qxnw.local.clear();
                    qx.core.ObjectRegistry.shutdown();
                    self.isClosedApp = true;
                    qxnw.main.deleteMenuCache(false);
                    window.location.reload();
                }
            });
        },
        deleteMenuCache: function deleteMenuCache(preguntar) {
            qxnw.main.deleteMenuCache(preguntar);
        },
        /**
         * Open the alerts form
         * @return {void}          */
        __openConfigAlerts: function __openConfigAlerts() {
            var d = new qxnw.forms.alerts();
            d.show();
        }
        ,
        /**
         * Open the config menu settings          * @return {void}          */
        __openConfigMenu: function __openConfigMenu() {
            var d = new qxnw.forms.config();
            d.show();
        }
        ,
        /*
         * Returns the value of rpcUrl
         * @return {String} the rpcUrl value
         */
        getRpcUrl: function () {
            return this.__rpcUrl;
        },
        /*
         * Create the theme switcher, stored in the qxnw.themeSwitcher class
         */
        themeSwitcher: function themeSwitcher() {
            var d = new qxnw.forms.themeSwitcher();
            d.show();
        },
        /*
         * Set the value of the rpcUrl local-level from the user policies
         */
        setRpcUrl: function () {
            this.__rpcUrl = qxnw.userPolicies.rpcUrl();
        },
        /*
         * Shows the information of the developers of this 
         */
        slotAbout: function slotAbout() {
            var html = "";
            var leader = qxnw.userPolicies.getLeader();
            if (typeof leader != 'undefined' && leader != "") {
                html = "<br /><b>Liderado por: </b>" + leader + " <br /><br />";
            }
            html += "<center>Powered by <a style='cursor: pointer' target='_blank' href='https://www.gruponw.com'><span style='color: #d6002a;'>N</span><span style='color: #333;'>W Group©</span><a></center><br />";
            qxnw.utils.information(html);
        },
        /*
         * Remove the created base
         */
        removeBase: function removeBase() {
            this.verticalLayout.dispose();
        },
        /**
         * Return the stored selected tab
         * @return {String} the label of a tab          */
        getStoredSelectedTab: function getStoredSelectedTab() {
            var data = "";
            try {
                data = qxnw.local.getData("qxnw_tabs");
            } catch (e) {
                data = "";
                //qxnw.utils.error(e, self, 0, false);
            }
            return data;
        },
        /**
         * Store offline the label of a selected tab
         * @param tab_name {String} the label of a tab
         * @returns {void}
         */
        storeSelectedTab: function storeSelectedTab(tab_name) {
            qxnw.local.storeData("qxnw_tabs", tab_name);
        },
        closeAllSubwindows: function closeAllSubwindows() {
            var self = this;
            if (self.isCreated) {
                var children = self.tabView.getChildren();
                for (var i = 0; i < children.length; i++) {
                    self.removeSubWindowFromStore(children[i].getLabel());
                    self.tabView.remove(children[i]);
                }
                var children = self.tabView.getChildren();
                for (var i = 0; i < children.length; i++) {
                    self.removeSubWindowFromStore(children[i].getLabel());
                    self.tabView.remove(children[i]);
                }
            }
        },
        /*
         * Update the total bar
         */
        updateTotalbar: function updateTotalbar() {
            this.createAlertsBar();
        },
        /**
         * Function to update the text on the alerts bar. This function nees to be set the values fot <code>labelTotal</code>
         */
        updateAlertsBar: function updateAlertsBar() {
            var self = this;
            self.labelTotal.setValue(self.__label == null ? "" : self.__label + " " + self.__prefix == null ? "" : self.__prefix + " " + qxnw.utils.formatCurrency(self.__total));
        },
        addMinimizedWindow: function addMinimizedWindow(widget) {
            var self = this;
            var borderColor = "#333";
            var border = new qx.ui.decoration.Decorator().set({
                width: 3,
                style: "solid",
                color: borderColor
            });
            var miniLayout = new qx.ui.layout.Canvas();
            var miniContainer = new qx.ui.container.Composite(miniLayout).set({
                decorator: border,
                cursor: "pointer",
                minWidth: 100,
                minHeight: 30
            });
            miniContainer.addListener("appear", function () {
                qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_minimized_windows");
            });
            //overrided
            miniContainer.setUserData(widget.getAppWidgetName(), true);
            var caption = widget.getCaption();
            var label = new qx.ui.basic.Label(caption);
            miniContainer.add(label, {
                left: 23,
                top: 3
            });
            miniContainer.add(new qx.ui.basic.Image(qxnw.config.execIcon("view-restore")));
            miniContainer.addListener("click", function () {
                widget.open();
                self.wBar.remove(miniContainer);
                widget.getFocusElement().focus();
                try {
                    if (typeof widget.setWinIsMaximized != 'undefined') {
                        if (typeof widget.setWinIsMaximized == 'function') {
                            widget.setWinIsMaximized();
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            });
            self.wBar.add(miniContainer);
        },
        maximizeWindow: function maximizeWindow(name) {
            if (this.wBar != null) {
                var w = this.wBar.getChildren();
                for (var i = 0; i < w.length; i++) {
                    if (w[i].getUserData(name)) {
                        this.wBar.remove(w[i]);
                    }
                }
            }
        },
        createWindowsBar: function createWindowsBar() {
            var self = this;
            var wlayout = new qx.ui.layout.HBox();
            wlayout.setSpacing(5);
            self.wBar = new qx.ui.container.Composite(wlayout);
            qxnw.utils.addClassToButton(self.wBar, "nw_wBar");
            var menuStyle = qxnw.config.getMenuStyle();
            if (menuStyle === "horizontal") {
                self.centralWidget.add(self.wBar);
            } else {
                self.MainWindow.add(self.wBar);
            }
        },
        /**
         * Create the alert bar
         */
        createAlertsBar: function createAlertsBar() {
            var self = this;
            self.vAlerts = new qx.ui.layout.HBox();
            self.vAlerts.setSpacing(80);
            var wAlerts = new qx.ui.container.Composite(self.vAlerts);
            var miniLayout = new qx.ui.layout.Canvas();
            var miniContainer = new qx.ui.container.Composite(miniLayout);
            miniContainer.add(new qx.ui.basic.Image(qxnw.config.execIcon("format-text-direction-ltr")));
            self.labelTotal = new qx.ui.basic.Label("Totales: " + self.__total);
            miniContainer.add(self.labelTotal, {
                left: 23,
                top: 3
            });
            wAlerts.add(miniContainer);
            this.MainWindow.add(wAlerts);
        },
        setNameTerminal: function setNameTerminal(name) {
            this.__userTerminal.setLabel(name);
        },
        setNameDB: function setNameDB(name) {
//            this.__userDd.setLabel(name);
        },
        /**
         * Create the automated status bar
         */
        createStatusBar: function createStatusBar() {
            var self = this;
            if (self.__isCreatedStatusBar) {
                return;
            }

            qxnw.utils.populateConfig(this.MainWindow);

            var r = qxnw.userPolicies.getInstance().getData();
            self.user = r.user;
            self.userName = r.name;

            var userData = self.userName + " (" + self.user + ") <br /> " + r.name_company;
            self.userDataColumn.setLabel(userData);

            var miniLayout = new qx.ui.layout.HBox().set({
                spacing: 0
            });
            if (self.wStatus == null) {
                self.wStatus = new qx.ui.container.Composite(miniLayout);
            } else {
                self.wStatus.removeAll();
            }
            var miniContainer = self.wStatus;

            qxnw.utils.addClassToElement(miniContainer, "nw_dateContainer");

            if (typeof r.pais !== 'undefined' && r.pais !== null && r.pais_name !== "") {
                self.__countryUser = new qx.ui.basic.Atom(self.tr("País: ") + r.pais_name + " (" + r.pais + ")", qxnw.config.execIcon("text-html.png", "mimetypes")).set({
                    cursor: "pointer"
                });
                miniContainer.add(self.__countryUser, {
                    flex: 1
                });
                if (typeof r.zona_horaria !== 'undefined' && r.zona_horaria !== "") {
                    var zo = this.marktr("Zona horaria: ");
                    var toolTip = new qx.ui.tooltip.ToolTip(zo + r.zona_horaria);
                    self.__countryUser.setToolTip(toolTip);
                }
            }

            var compLbl = self.tr("Empresa: ") + r.name_company + " (" + r.company + ")";
            miniContainer.add(new qx.ui.basic.Atom(compLbl, qxnw.config.execIcon("contact-new")), {
                flex: 1
            });

            var atomUser = new qx.ui.basic.Atom(self.tr("Usuario: ") + "<b>" + r.user + " (" + r.code + ")</b>", qxnw.config.execIcon("preferences-users", "apps")).set({
                rich: true
            });
            miniContainer.add(atomUser, {
                flex: 1
            });

            var profileLbl = new qx.ui.basic.Atom(self.tr("Perfil: ") + r.nom_profile + " (" + r.profile + ")", qxnw.config.execIcon("security-medium", "status")).set({
                minWidth: 130
            });
            miniContainer.add(profileLbl, {
                flex: 1
            });
            self.__userTerminal = new qx.ui.basic.Atom(self.tr("Sede: ") + r.nom_terminal + " (" + r.terminal + ")", qxnw.config.execIcon("security-low", "status"));
            miniContainer.add(self.__userTerminal, {
                flex: 1
            });

            var lang = qxnw.local.getOpenData("lang") == null ? "ES" : qxnw.local.getOpenData("lang");
            var idiomIcon = qxnw.config.execIcon("preferences-locale", "apps");
            try {
                if (qxnw.local.getOpenData("lang") != null) {
                    var extract = qxnw.config.searchIntoLocales(lang);
                    idiomIcon = qxnw.config.execIcon(extract.icon, extract.iconType);
                }
            } catch (e) {
                qxnw.utils.error(e);
            }
            var atom = new qx.ui.basic.Atom(self.tr("Idioma: ") + lang, idiomIcon);
            self.lang_lower_atom = atom;
            miniContainer.add(atom, {
                flex: 1
            });
            miniContainer.add(new qx.ui.basic.Label(self.tr("<span style='font-zize: 11; color: gray'>Versión: <b>") + qxnw.userPolicies.getVersion() + "</b></span>").set({
                rich: true
            }), {
                flex: 1
            });
            miniContainer.add(new qx.ui.core.Spacer(30), {
                flex: 0
            });
            self.centerContainer.add(miniContainer);
            self.__isCreatedStatusBar = true;
        },
        changeUserTerminal: function changeUserTerminal(newTerminal) {
            if (this.self.__userTerminal != null) {
                self.__userTerminal.setValue(newTerminal);
            }
            return true;
        },
        restoreSubWindowByArrayData: function restoreSubWindowByArrayData(data) {
            if (data.tableMethod) {
                try {
                    var d = new qxnw.lists();
                    d.setMainForm(data.isMainForm);
                    d.setTableMethod(data.tableMethod);
                    d.createFromTable(data.table);
                    d.serialColumn(data.serialColumn);
                    this.addSubWindow(data.label, d, false);
                } catch (e) {
                    qxnw.utils.error(e);
                }
            } else {
                try {
                    var d = qx.Class.getByName(data.classname);
                    d = new d;
                    this.addSubWindow(data.label, d, false);
                } catch (e) {
                    qxnw.utils.error(e);
                }
            }
        },
        /**
         * Restore all subwindows stored in key <code>qxnw_subwindow</code>. NOT READY FOR PRODUCTION
         */
        restoreAllSubWindowStored: function restoreAllSubWindowStored() {
            var self = this;
            return;
            try {
                var store = qxnw.local.getData("qxnw_subwindow");
                if (store == null) {
                    self.tabView.addListener("changeSelection", function (e) {
                        var data = e.getData();
                        if (typeof data[0] != 'undefined') {
                            self.storeSelectedTab(data[0].getLabel());
                        }
                    });
                    return;
                }
                var cm = qxnw.local.getData("qxnw_subwindow_contextmenu");
                for (var i = 0; i < store.length; i++) {
                    if (store[i].tableMethod) {
                        try {
                            var d = new qxnw.lists();
                            d.setMainForm(store[i].isMainForm);
                            if (cm != null) {
                                d.setContextMenuAdedItems(cm);
                            }
                            d.setTableMethod(store[i].tableMethod);
                            d.createFromTable(store[i].table);
                            d.serialColumn(store[i].serialColumn);
                            self.addSubWindow(store[i].label, d, false);
                        } catch (e) {
                            //qxnw.utils.bindError(e, self, store, false, true, false);
                        }
                    } else if (store[i].qxnwType == "qxnw_reports") {
                        try {
                            var d = new qxnw.lists();
                            var filters = store[i].filtersReport;
                            if (typeof filters != 'undefined') {
                                d.createFiltersReport(filters);
                            }
                            if (typeof store[i].frameUrl != 'undefined') {
                                d.addFrame(store[i].frameUrl);
                            }
                            self.addSubWindow(store[i].label, d, false);
                        } catch (e) {
                            //qxnw.utils.bindError(e, self, store, false, true, false);
                        }
                    } else {
                        try {
                            var d = qx.Class.getByName(store[i].classname);
                            d = new d;
                            self.addSubWindow(store[i].label, d, false);
                        } catch (e) {
                            //qxnw.utils.bindError(e, self, store, false, true, false);
                        }
                    }
                }
                //**selection stored**//
                var lastOpened = self.getStoredSelectedTab();
                var pages = self.tabView.getChildren();
                for (var i = 0; i < pages.length; i++) {
                    if (pages[i].getLabel() == lastOpened) {
                        this.tabView.setSelection([pages[i]]);
                        continue;
                    }
                }
                self.tabView.addListener("changeSelection", function (e) {
                    var data = e.getData();
                    if (data.length == 0) {
                        return;
                    }
                    self.storeSelectedTab(data[0].getLabel());
                });
            } catch (e) {
                return;
            }
        },
        /**
         * Takes all data from a qxnw.lists objects and try to store. After, this function try to restore this lists
         * @param name {String} name label of the subwindow
         * @param list {qxnw.lists} qxnw.lists object to take the maximum data
         * @returns {Boolean} is stored or not
         */
        storeSubWindowSettings: function storeSubWindowSettings(name, list) {
            var self = this;
            var data = {};
            data.type = "lists";
            data.label = name;
            data.classname = list.classname;
            try {
                data.qxnwType = list.getQxnwType();
            } catch (e) {
                data.qxnwType = false;
            }
            if (data.qxnwType == "qxnw_reports") {
                data.frameUrl = list.getFrameUrl();
                data.filtersReport = list.getFilters();
            }
            try {
                data.isMainForm = list.getIsMainForm();
            } catch (e) {
                data.isMainForm = false;
            }
            try {
                data.tableMethod = list.getTableMethod();
            } catch (e) {
                data.tableMethod = null;
            }
            try {
                data.table = list.getTable();
            } catch (e) {
                data.table = null;
            }
            try {
                data.serialColumn = list.getSerialColumn();
            } catch (e) {
                data.serialColumn = null;
            }
            self.__store[self.__count] = data;
            self.__count++;
            try {
                var storedSettings = qxnw.local.getData("qxnw_subwindow");
                if (storedSettings == null) {
                    storedSettings = [];
                    storedSettings.push(data);
                    qxnw.local.storeData("qxnw_subwindow", storedSettings);
                    return;
                }
                for (var i = 0; i < storedSettings.length; i++) {
                    if (data.label == storedSettings[i].label) {
                        storedSettings.splice(i, 1, data);
                        qxnw.local.storeData("qxnw_subwindow", storedSettings);
                        return;
                    }
                }
                storedSettings.push(data);
                qxnw.local.storeData("qxnw_subwindow", storedSettings);
            } catch (e) {
                //qxnw.utils.error(e, self, 0, false);
            }
        },
        /**
         * Remove an element from the stored values in the key <code>qxnw_subwindow</code>
         * @param label {String} the string containing the label of the sub-window when a remove action is fired
         */
        removeSubWindowFromStore: function removeSubWindowFromStore(label) {
            var data = qxnw.local.getData("qxnw_subwindow");
            if (data == null) {
                return;
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].label == label) {
                    data.splice(i);
                }
            }
            qxnw.local.storeData("qxnw_subwindow", data);
        },
        /**
         * Adds a subwindow to the tabs. Takes the widget passed an put the contend in the center of screen.
         * @param name {type} title of the window
         * @param widget {type} the widget to put as sub-window
         * @param store {Boolean} if the subwindow had to be stored
         * @param showCloseButton {Boolean} if the close button is show or not
         * @param reopen {Boolean} if have to reopen
         */
        addSubWindow: function addSubWindow(name, widget, store, showCloseButton, reopen) {
            var self = this;
            if (typeof name !== "string" && name.classname !== "qx.locale.LocalizedString") {
                qxnw.utils.error(self.tr("El primer parámetro de esta función es un string"));
                return;
            }
            if (typeof store == 'undefined') {
                store = true;
            }
            if (typeof reopen == 'undefined') {
                reopen = false;
            }
            if (qxnw.config.getAddNewSubWindows() && !reopen) {
                if (typeof name.getMessageId != 'undefined') {
                    name = name.getMessageId();
                }
                for (var i = 0; i < self.__pages.length; i++) {
                    if (self.__pages[i]["name"] == name) {
                        try {
                            self.tabView.setSelection([self.__pages[i]["page"]]);
                        } catch (e) {
                            qxnw.utils.nwconsole(e);
                        }
                        return;
                    }
                }
            }
            try {
                if (typeof widget.getQxnwType() != 'undefined') {
                    if (widget.getQxnwType() == "qxnw_form") {
                        widget.removeListenerById(widget.getListenerIdAppear());
                        widget.removeListenerById(widget.getListenerIdMove());
                    } else if (widget.getQxnwType() == "qxnw_files") {
                        widget.removeListenerById(widget.getListenerIdAppear());
                        widget.removeListenerById(widget.getListenerIdMove());
                    } else if (widget.getQxnwType() == "qxnw_printer") {
                        widget.removeListenerById(widget.getListenerIdAppear());
                        widget.removeListenerById(widget.getListenerIdMove());
                    } else if (widget.getQxnwType() == "qxnw_reports") {
                        widget.removeListenerById(widget.getListenerIdAppear());
                        widget.removeListenerById(widget.getListenerIdMove());
                    } else if (widget.getQxnwType() == "qxnw_list") {
                        widget.removeListenerById(widget.getListenerIdAppear());
                        widget.removeListenerById(widget.getMoveListenerId());
                    } else if (widget.getQxnwType() == "qxnw_maps_widget") {
                        widget.removeListenerById(widget.getListenerIdAppear());
                        widget.removeListenerById(widget.getListenerIdMove());
                    } else if (widget.getQxnwType() == "qxnw_tree_widget") {

                    }
                }
                widget.setName(name);
            } catch (e) {
            }
            if (store) {
                self.storeSubWindowSettings(name, widget);
            }
            var page = new qx.ui.tabview.Page(name);
            page.addListener("close", function (e) {
                var label = this.getLabel();
                self.removeSubWindowFromStore(label);
                widget.cleanAll();
                for (var i = 0; i < self.__pages.length; i++) {
                    if (self.__pages[i]["name"] == label) {
                        try {
                            self.__pages.splice(i, 1);
                        } catch (e) {
                            qxnw.utils.nwconsole(e);
                        }
                        return;
                    }
                }
            });
            if ((typeof showCloseButton == 'undefined' || showCloseButton == 0 || showCloseButton == null) && showCloseButton != false) {
                showCloseButton = true;
            }
            page.setShowCloseButton(showCloseButton);
            page.getChildControl("button").setPadding(1);
            page.setPadding(0);
            page.setLayout(new qx.ui.layout.Grow());
            var scrollContainer = new qx.ui.container.Scroll();
            scrollContainer.setPadding(0);
            var desktop = new qx.ui.window.Desktop();
            desktop.setPadding(0);
            try {
                if (typeof widget.getQxnwType() != 'undefined') {
                    if (widget.getQxnwType() == "qxnw_list") {
                        var w = new qxnw.forms();
                        //widget.setToolBarParent(w);
                        w.setAddToMainOnMinimize(false);
                        w.setShowClose(false);
                        w.setShowMaximize(false);
                        w.setAlwaysOnTop(true);
                        w.setTitle(self.tr("Barra de herramientas"));
                        desktop.add(w);
                    }
                }
            } catch (e) {
                console.log(e);
            }
            page.getDesktop = function () {
                return desktop;
            };
            scrollContainer.add(desktop);
            page.add(scrollContainer);
            widget.set({
                showClose: false,
                showMinimize: false,
                showMaximize: false
            });
            widget.setResizable(false);
            widget.getChildControl("captionbar").setVisibility("excluded");
            widget.setAlwaysOnTop(false);
            widget.show();
            widget.maximize();
            desktop.add(widget, {
                width: "100%",
                height: "100%",
                top: 0,
                left: 0
            });
            self.tabView.add(page);
            self.tabView.setSelection([page]);
            var pages = {};
            pages["name"] = name;
            pages["page"] = page;
            if (qxnw.config.getAddNewSubWindows()) {
                self.__pages.push(pages);
            }

            page.getChildControl("button").dataSetQxPage = page;

            page.getChildControl("button").addListener("click", function (e) {
                var thi = this;
                if (thi.dataSetQxPage.isHome === true) {
                    return;
                }
                self.removeClass(".newpage_qxnw", "newpage_qxnw_active");

                setTimeout(function () {
                    self.addClass(thi.dataSetQxPage.getContentElement().getDomElement(), "newpage_qxnw_active");
                }, 10);
            });

            page.getChildControl("button").addListener("appear", function () {
                self.addClass(this.getContentElement().getDomElement(), "buttonTabQxnw");
                if (typeof main.createFirstTabPageQxnw === "undefined") {
                    self.addClass(this.getContentElement().getDomElement(), "buttonTabQxnwHome");
                    main.createFirstTabPageQxnw = true;
                }
            });

            page.addListener("appear", function () {
                var thi = this;
                if (typeof main.createFirstPageQxnw === "undefined") {
                    page.isHome = true;
                    main.createFirstPageQxnw = true;
                    qx.bom.element.Class.add(thi.getContentElement().getDomElement(), "newpage_qxnw_home");

//                    self.addClass(thi.getChildControl("button").getContentElement().getDomElement(), "buttonTabQxnwHome");


                } else {

                    self.removeClass(".newpage_qxnw", "newpage_qxnw_active");
                    qx.bom.element.Class.add(thi.getContentElement().getDomElement(), "newpage_qxnw");

                    setTimeout(function () {
                        qx.bom.element.Class.add(thi.getContentElement().getDomElement(), "newpage_qxnw_active");
                    }, 10);
                }
            });

            return page;
        },
        /**
         * Close a subwindow
         * @param page {Object} the page {qx.ui.tabview.Page} object 
         * @returns {Boolean}
         */
        removeSubWindow: function removeSubWindow(page) {
            var self = this;
            var label = page.getLabel();
            self.removeSubWindowFromStore(label);
            for (var i = 0; i < self.__pages.length; i++) {
                if (self.__pages[i]["name"] == label) {
                    try {
                        self.__pages.splice(i, 1);
                        if (this.tabView != null) {
                            this.tabView.remove(page);
                        }
                    } catch (e) {
                        qxnw.utils.nwconsole(e);
                    }
                    return;
                }
            }

        },
        closeSubWindow: function closeSubWindow(page) {
            if (this.tabView != null) {
                this.tabView.remove(page);
                return true;
            }
            return false;
        },
        slotSelectHome: function slotSelectHome() {
            if (this.initPage != null) {
                this.tabView.setSelection([this.initPage]);
            }
        },
        constructMenu: function constructMenu(module) {
            var self = this;
            var isCreated = false;
            if (self.menu === null) {
                var menuStyle = qxnw.config.getMenuStyle();
                if (menuStyle === "horizontal") {
                    self.menu = new qxnw.menuHorizontal(self);
                } else {
                    self.menu = new qxnw.menu(self);
                }
            } else {
                isCreated = true;
            }
            menu = self.menu;
            if (self.menu != null) {
                self.menu.removeMenu();
            }
            if (!qx.core.Environment.get("qx.debug")) {
                self.menu.setVisibility("excluded");
            }
            var execRpc = true;
            var versionqx = qxnw.userPolicies.versionDashboard;
            if (qxnw.basics.forms.f_dashboard_new.evalueData(window.localStorage.getItem("constructMenuQx_" + module)) && versionqx === 2) {
                var ra = JSON.parse(window.localStorage.getItem("constructMenuQx_" + module));
                self.constructMenuContinue(ra, isCreated);
                execRpc = false;
            } else {
                var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_menu");
                rpc.setAsync(true);
                var func = function (r) {
                    self.constructMenuContinue(r, isCreated);
                    window.localStorage.setItem("constructMenuQx_" + module, JSON.stringify(r));
                };
            }
            var data = {};
            if (typeof module != 'undefined') {
                data["modulo"] = module;
                self.setModule(module);
            }
            var isProduct = qxnw.userPolicies.isProduct();
            if (isProduct === true) {
                data["isProduct"] = true;
            }
            if (execRpc) {
                rpc.exec("getMenuHeader", data, func);
            }
            return true;
        },
        openMenuScroller: function openMenuScroller() {
            var self = this;
            self.scrollContainerMenuHorizontal.resetMaxWidth();
            self.scrollContainerMenuHorizontal.setWidth(250);
            var t = new qx.event.Timer(1);
            t.start();
            t.addListener("interval", function (e) {
                this.stop();
                var cmWidth = self.containerMenu.getBounds();
                if (cmWidth !== null) {
                    var elems = document.getElementsByClassName('containerNew');
                    for (var i = 0; i < elems.length; i++) {
                        var elem = elems[i];
                        var calc = "calc(100% - " + (cmWidth["width"] + 15) + "px)";
                        elem.style["maxWidth"] = calc;
                    }
                }
            });
            self.containerMenu.addListener("resize", function () {
                var cmWidth = self.containerMenu.getBounds();
                if (cmWidth !== null) {
                    var elems = document.getElementsByClassName('containerNew');
                    for (var i = 0; i < elems.length; i++) {
                        var elem = elems[i];
                        var calc = "calc(100% - " + (cmWidth["width"] + 15) + "px)";
                        elem.style["maxWidth"] = calc;
                    }
                }
            });
        },
        createButtonMenu: function createButtonMenu(parent) {
            var self = this;

            var popup = new qx.ui.popup.Popup(new qx.ui.layout.VBox()).set({
                autoHide: false,
                maxWidth: 30
            });
            popup.setPadding(0);

            self.buttonOpener = new qx.ui.form.Button("", qxnw.config.execIcon("go-last")).set({
                show: "icon",
                padding: 0,
                maxWidth: 30
            });
            qxnw.utils.addClassToElement(popup, "menu_button_resizer");
            self.buttonOpener.setUserData("opened", false);
            self.buttonOpener.addListener("execute", function (e) {
                var state = self.buttonOpener.getUserData("opened");
                if (state) {
                    self.closeHorizontalMenu();
                } else {
                    if (self.menu) {
                        self.menu.showMenu();
                    }
                    if (self.menuHorizontalLegend) {
                        self.menuHorizontalLegend.destroy();
                    }
                    self.menuHorizontalLegend = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                        backgroundColor: "red",
                        alignY: "bottom",
                        minHeight: 22
                    });
                    var lblView = new qx.ui.basic.Label(self.tr("Cambiar vista")).set({
                        rich: true,
                        alignX: "right",
                        alignY: "top",
                        cursor: "pointer"
                    });
                    lblView.addListener("tap", function () {
                        qxnw.utils.question(self.tr("Esta acción actualizará la página, ¿desea continuar?"), function (yn) {
                            if (yn) {
                                qxnw.local.storeData("menu_style", "vertical");
                                window.location.reload();
                            }
                        });
                    });
                    self.menuHorizontalLegend.add(lblView, {
                        flex: 0
                    });
                    self.containerMainMenu.add(self.menuHorizontalLegend);
                    self.openMenuScroller();
                    self.buttonOpener.setIcon(qxnw.config.execIcon("go-first"));
                    self.buttonOpener.setUserData("opened", true);
                }
            }, this);
            popup.add(self.buttonOpener);
            parent.addListener("appear", function () {
                var de = this.getContentElement().getDomElement();
                popup.placeToElement(de, true);
                popup.show();
            });
        },
        closeHorizontalMenu: function closeHorizontalMenu() {
            var self = this;
            if (self.menuHorizontalLegend) {
                self.menuHorizontalLegend.destroy();
            }
            self.scrollContainerMenuHorizontal.set({
                maxWidth: 0,
                minWidth: 0
            });
            if (self.menu) {
                self.menu.hideMenu();
            }
            var elems = document.getElementsByClassName('containerNew');
            for (var i = 0; i < elems.length; i++) {
                var elem = elems[i];
                var calc = "calc(100% - 0px)";
                elem.style["maxWidth"] = calc;
            }
            self.buttonOpener.setIcon(qxnw.config.execIcon("go-last"));
            self.buttonOpener.setUserData("opened", false);
        },
        constructMenuContinue: function constructMenuContinue(r, isCreated) {
            var self = this;
            var callback = null;
            var subCallback = null;
            var subSubCallback = null;

            var menuStyle = qxnw.config.getMenuStyle();

            console.log("constructMenuContinue", r);
            console.log("menuStyle", menuStyle);

            if (r.length === 0) {
                if (menuStyle === "horizontal") {
                    try {
                        if (self.menu) {
                            console.log("hide menu");
                            self.closeHorizontalMenu();
                        }
                    } catch (e) {
                        console.log(e);
                    }

                }
                return;
            }

            var clase = null;
            if (qxnw.userPolicies.versionDashboard === 2) {
                var menHom = self.menu.addMenu(self.tr("Menú"), false, self, "actions/go-home.png");
                menHom.addListener("appear", function () {
                    qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_home_initial");
                    this.addListener("click", function (e) {
                        qxnw.basics.forms.f_dashboard_new.menu();
                    });
                });
            }
            if (r.length > 0) {
                if (qxnw.userPolicies.versionDashboard !== 2) {
                    var menHom = self.menu.addMenu(self.tr("Homess"), "slotSelectHome", self, "actions/go-home.png");
                    menHom.addListener("appear", function () {
                        qx.bom.element.Class.add(this.getContentElement().getDomElement(), "nw_home_initial");
                    });
                }
            }

            var getInLevel1 = 0;
            var getInLevel1Name = null;

            for (var i = 0; i < r.length; i++) {
                if (r[i].nivel == 1) {
                    callback = r[i].callback;
                    clase = r[i].clase;
                    self.permisos[clase] = {};
                    self.permisos[clase]["edits"] = r[i].editar;
                    self.permisos[clase]["deletes"] = r[i].eliminar;
                    self.permisos[clase]["creates"] = r[i].crear;
                    self.permisos[clase]["consult"] = r[i].consultar;
                    self.permisos[clase]["terminal"] = r[i].terminal;
                    self.permisos[clase]["modulo"] = r[i].modulo;
                    self.permisos[clase]["prints"] = r[i].imprimir;
                    self.permisos[clase]["send_email"] = r[i].enviar_correo;
                    self.permisos[clase]["exports"] = r[i].exportar;
                    self.permisos[clase]["imports"] = r[i].importar;
                    self.permisos[clase]["hidden_cols"] = r[i].columnas_ocultas;
                    self.permisos[clase]["pais"] = r[i].pais;
                    self.permisos[clase]["callback"] = callback;

                    getInLevel1++;

                    if (callback !== null) {
                        getInLevel1Name = self.menu.addMenu(r[i].nombre, callback, self, r[i].icono);
                    } else {
                        getInLevel1Name = self.menu.addMenu(r[i].nombre, 0);
                    }
                    for (var ia = 0; ia < r.length; ia++) {
                        if (r[ia].nivel == 2) {
                            if (r[ia].pariente == r[i].id) {
                                subCallback = r[ia].callback;
                                clase = r[ia].clase;
                                self.permisos[clase] = {};
                                self.permisos[clase]["edits"] = r[ia].editar;
                                self.permisos[clase]["deletes"] = r[ia].eliminar;
                                self.permisos[clase]["creates"] = r[ia].crear;
                                self.permisos[clase]["consult"] = r[ia].consultar;
                                self.permisos[clase]["terminal"] = r[ia].terminal;
                                self.permisos[clase]["modulo"] = r[ia].modulo;
                                self.permisos[clase]["prints"] = r[ia].imprimir;
                                self.permisos[clase]["send_email"] = r[ia].enviar_correo;
                                self.permisos[clase]["exports"] = r[ia].exportar;
                                self.permisos[clase]["imports"] = r[ia].importar;
                                self.permisos[clase]["hidden_cols"] = r[ia].columnas_ocultas;
                                self.permisos[clase]["pais"] = r[ia].pais;
                                self.permisos[clase]["callback"] = subCallback;
                                if (subCallback !== null) {
                                    self.menu.addMenuAction(r[ia].nombre, r[ia].icono, subCallback, self, null, null, r[i].nombre);
                                } else {
                                    self.menu.addMenuAction(r[ia].nombre, r[ia].icono, 0, self, null, null, r[i].nombre);
                                }

                                for (var ib = 0; ib < r.length; ib++) {
                                    if (r[ib].nivel == 3) {
                                        if (r[ib].pariente == r[ia].id) {
                                            subSubCallback = r[ib].callback;
                                            clase = r[ib].clase;
                                            self.permisos[clase] = {};
                                            self.permisos[clase]["edits"] = r[ib].editar;
                                            self.permisos[clase]["deletes"] = r[ib].eliminar;
                                            self.permisos[clase]["creates"] = r[ib].crear;
                                            self.permisos[clase]["consult"] = r[ib].consultar;
                                            self.permisos[clase]["terminal"] = r[ib].terminal;
                                            self.permisos[clase]["modulo"] = r[ib].modulo;
                                            self.permisos[clase]["prints"] = r[ib].imprimir;
                                            self.permisos[clase]["send_email"] = r[ib].enviar_correo;
                                            self.permisos[clase]["exports"] = r[ib].exportar;
                                            self.permisos[clase]["imports"] = r[ib].importar;
                                            self.permisos[clase]["hidden_cols"] = r[ib].columnas_ocultas;
                                            self.permisos[clase]["pais"] = r[ib].pais;
                                            self.permisos[clase]["callback"] = subSubCallback;
                                            if (subSubCallback !== null) {
                                                self.menu.addSubMenuAction(r[ib].nombre, r[ib].icono, subSubCallback, self);
                                            } else {
                                                self.menu.addSubMenuAction(r[ib].nombre, r[ib].icono, 0, self);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            qxnw.userPolicies.setPermissions(self.permisos);
            self.menu.exec();

            if (getInLevel1 <= 1) {
                try {
                    var containerName = getInLevel1Name.getUserData("parent_name");
                    self.menu.menuContainers[containerName].fireEvent("tap");
                } catch (e) {

                }
            }

            if (menuStyle === "horizontal") {
                if (r.length === 0) {
                    return;
                }
                if (self.menuHorizontalLegend) {
                    self.menuHorizontalLegend.destroy();
                }
                if (self.menu) {
                    self.menu.showMenu();
                }
                self.menuHorizontalLegend = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                    backgroundColor: "red",
                    alignY: "bottom",
                    minHeight: 22
                });
                var lblView = new qx.ui.basic.Label(self.tr("Cambiar vista")).set({
                    rich: true,
                    alignX: "right",
                    cursor: "pointer"
                });
                lblView.addListener("tap", function () {
                    qxnw.local.storeData("menu_style", "vertical");
                    qxnw.utils.question(self.tr("Esta acción actualizará la página, ¿desea continuar?"), function (yn) {
                        if (yn) {
                            window.location.reload();
                        }
                    });
                });
                self.menuHorizontalLegend.add(lblView, {
                    flex: 0
                });
                self.containerMainMenu.add(self.menuHorizontalLegend);
                self.openMenuScroller();
                self.buttonOpener.setUserData("opened", true);
                self.buttonOpener.setIcon(qxnw.config.execIcon("go-first"));
            } else if (menuStyle === "vertical") {
                if (self.menuHorizontalLegend) {
                    self.menuHorizontalLegend.destroy();
                }
                self.menuHorizontalLegend = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                    alignY: "bottom",
                    minHeight: 22
                });
                var lblView = new qx.ui.basic.Label(self.tr("<div style='color: #fff'><b>Cambiar vista</b></div>")).set({
                    rich: true,
                    alignX: "right",
                    alignY: "bottom",
                    cursor: "pointer"
                });
                lblView.addListener("tap", function () {
                    qxnw.utils.question(self.tr("Esta acción actualizará la página, ¿desea continuar?"), function (yn) {
                        if (yn) {
                            qxnw.local.storeData("menu_style", "horizontal");
                            window.location.reload();
                        }
                    });
                });
                self.menuHorizontalLegend.add(lblView, {
                    flex: 0
                });
                self.menuHorizontalLegend.add(new qx.ui.core.Spacer(), {
                    flex: 1
                });
                self.containerMenu.add(self.menuHorizontalLegend, {
                    flex: 1
                });
            }
        }
    }
});