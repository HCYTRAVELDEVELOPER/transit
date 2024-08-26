/* 
 Created on : Nov 20, 2018, 10:13:40 PM
 Author     : alexf Grupo Nw. this file is for lib nwmaker-2
 */
var showconsolerpcresult = false;
var mainNW = false;
var questionExit = false;
var exit = false;
var inhome = true;
var activebar = false;
var timebar;
var versionNwMakerLibMobile = 1.1;
__infoUser = {};
var nw = {
    initConnectionRPC: false,
    mainActivityBackgroundMode: false,
    workInBackgroundMode: false,
    saldo: false,
    puntucom: false,
    initialize: function (callback) {
        var self = this;
//        nw.utils.setDebug();
        var get = self.getGET();

        self.versionIndevice = "1";
        if (nw.evalueData(window.localStorage.getItem("version_in_this_device"))) {
            self.versionIndevice = window.localStorage.getItem("version_in_this_device");
        } else {
            window.localStorage.setItem("version_in_this_device", "1");
            self.versionIndevice = "1";
        }
        console.log("self.versionIndevice", self.versionIndevice);

        if (typeof versionInAppLibDevice !== "undefined") {
            self.versionIndevice = self.versionIndevice + "-" + versionInAppLibDevice;
            console.log("self.versionIndevice+versionInAppLibDevice", self.versionIndevice);
        }

        versionIndeviceGralDocument = self.versionIndevice;

        var nameConfig = "config.js";
        if (typeof domainExternConfigName !== "undefined") {
            nameConfig = domainExternConfigName;
        }
        var file_config = "nwmaker/" + nameConfig + "?v=" + self.versionIndevice;
        if (typeof domainExternConfig !== "undefined") {
            file_config = domainExternConfig + "nwmaker/" + nameConfig + "?v=" + self.versionIndevice;
        }
        if (get) {
            if (nw.evalueData(get.conf)) {
                file_config = "nwmaker/" + get.conf + "?v=" + self.versionIndevice;
            } else
            if (nw.evalueData(get.empresa)) {
                file_config = "nwmaker/config_" + get.empresa + ".js?v=" + self.versionIndevice;
            }
        }
        var up = nw.userPolicies.getUserData();
        var versionNwMaker = "0.0.0.1";
        var f = [];
        f.push("nwmaker/fastclick.js");
//        f.push("nwmaker/fastclick2.js");
//        f.push(file_config);
        f.push("nwmaker/menu.js?v=" + self.versionIndevice);
        f.push("nwmaker/files.js?v=" + self.versionIndevice);
//        f.push("nwmaker/nwmaker-geolocation.js");
        var t = f.length;
        var n = 0;
        var os = nw.getMobileOperatingSystem();

//        var domaincss = config.domain_files_manage + config.carpet_files_extern;
        var domaincss = "";
        if (typeof domainLib !== "undefined") {
            domaincss = domainLib;
        }
        if (os === "ANDROID") {
            nw.requireCss(domaincss + "css/android.css");
        } else if (os === "IOS") {
            nw.requireCss(domaincss + "css/ios.css");
        } else
        if (os === "WINDOWS_PHONE") {
            nw.requireCss(domaincss + "css/windows_phone.css");
        }

        //PRIMERO LEE EL CONFIG ANTES QUE TODO
        nw.require(file_config, function () {
            config = new config();
            config.dataPosition = "relative";
            config.construct();

            if (typeof config.config_crear_cuenta.pedir_empresa != "undefined") {
                window.localStorage.setItem("empresa", config.config_crear_cuenta.pedir_empresa);
            }
            if (typeof config.config_crear_cuenta.perfil != "undefined") {
                window.localStorage.setItem("perfil", config.config_crear_cuenta.perfil);
            }

            var up = nw.userPolicies.getUserData();
//            if (!nw.utils.evalueData(window.localStorage.getItem("idioma_config")) && config.idiomaPorDefecto && !nw.utils.evalueData(up.usuario)) {
            if (config.idiomaPorDefecto && !nw.utils.evalueData(up.usuario)) {
                window.localStorage.setItem("idioma_config", config.idiomaPorDefecto);
            }

            if (config.useTranslateStr === true) {
                nw.utils.getTranslateServer(function () {
                    continueLoadFiles();
                });
            } else {
                continueLoadFiles();
            }

            function continueLoadFiles() {
                config.domain_files_manage = config.domain_rpc;
                if (nw.evalueData(config.domain_files)) {
                    config.domain_files_manage = config.domain_files;
                }

                if (nw.utils.getDebug()) {
                    console.log("config.domain_rpc", config.domain_rpc);
                    console.log("config.domain_files_manage", config.domain_files_manage);
                }

                if (config.useGeoLocation === true) {
                    if (config.use_files_extern_by_domain_rpc === true) {
                        f.push("/nwmaker-geolocation.js");
                    } else {
                        f.push("nwmaker/nwmaker-geolocation.js");
                    }
                    t++;
                }

                config.version_in_this_device = self.versionIndevice;

                $.each(f, function (index, val) {
                    if (config.use_files_extern_by_domain_rpc === true) {
                        if (val === "/nwmaker-geolocation.js") {
                            val = domainLib + "/" + val + "?vdevice=" + config.version_in_this_device + "&v=" + config.version;
                        } else {
                            val = config.domain_files_manage + config.carpet_files_extern + val + "?vdevice=" + config.version_in_this_device + "&v=" + config.version;
                        }
                    }
                    nw.require(val, function () {
                        n++;
                        if (n === t) {
                            var m = new menu();
                            if (typeof m.members.start === "undefined") {
                                m.construct();
                                createStart(m);
                            } else {
                                m.construct(function (m) {
                                    createStart(m);
                                });
                            }
                        }
                        function createStart(m) {
                            config.menuLeft = m.menuLeft;
                            config.versionNwMaker = versionNwMaker;

                            if (nw.evalueData(up.usuario)) {
                                if (nw.evalueData(window.localStorage.getItem("theme"))) {
                                    config.theme = window.localStorage.getItem("theme");
                                } else {
                                    window.localStorage.setItem("theme", config.theme);
                                }
                                if (nw.evalueData(window.localStorage.getItem("showConsoleDeveloper"))) {
                                    config.showConsoleDeveloper = window.localStorage.getItem("showConsoleDeveloper");
                                } else {
                                    window.localStorage.setItem("showConsoleDeveloper", config.showConsoleDeveloper);
                                }
                                if (nw.evalueData(window.localStorage.getItem("showConsoleEvents"))) {
                                    config.showConsoleEvents = window.localStorage.getItem("showConsoleEvents");
                                } else {
                                    window.localStorage.setItem("showConsoleEvents", config.showConsoleEvents);
                                }
//                            if (nw.evalueData(window.localStorage.getItem("domain_rpc"))) {
//                                config.domain_rpc = window.localStorage.getItem("domain_rpc");
//                            } else {
//                                window.localStorage.setItem("domain_rpc", config.domain_rpc);
//                            }
//                            if (nw.evalueData(window.localStorage.getItem("testing"))) {
//                                config.testing = window.localStorage.getItem("testing");
//                            } else {
                                window.localStorage.setItem("testing", config.testing);
//                            }

                                if (typeof config.soundNotificacionDesktop === "undefined") {
                                    config.soundNotificacionDesktop = true;
                                }
                                if (nw.evalueData(window.localStorage.getItem("soundNotificacionDesktop"))) {
                                    config.soundNotificacionDesktop = JSON.parse(window.localStorage.getItem("soundNotificacionDesktop"));
                                } else {
                                    window.localStorage.setItem("soundNotificacionDesktop", config.soundNotificacionDesktop);
                                }

                                if (typeof config.soundNotificacionDesktopVolume === "undefined") {
                                    config.soundNotificacionDesktopVolume = "1.0";
                                }
                                if (typeof window.localStorage.getItem("soundNotificacionDesktopVolume") !== "undefined" && window.localStorage.getItem("soundNotificacionDesktopVolume") !== null) {
                                    config.soundNotificacionDesktopVolume = window.localStorage.getItem("soundNotificacionDesktopVolume");
                                } else {
                                    window.localStorage.setItem("soundNotificacionDesktopVolume", config.soundNotificacionDesktopVolume);
                                }
                                if (nw.utils.getDebug()) {
                                    console.log("config.soundNotificacionDesktopVolume", config.soundNotificacionDesktopVolume)
                                    console.log("config.soundNotificacionDesktopVolume", config.soundNotificacionDesktopVolume)
                                    console.log("window.localStorage.getItem(soundNotificacionDesktopVolume)", window.localStorage.getItem("soundNotificacionDesktopVolume"))
                                    console.log("config.soundNotificacionDesktopVolume", config.soundNotificacionDesktopVolume)
                                }

                                if (typeof config.notificacionDesktop === "undefined") {
                                    config.notificacionDesktop = true;
                                }
                                if (typeof config.nativeTransitions === "undefined") {
                                    config.nativeTransitions = false;
                                }
                                if (typeof window.plugins !== "undefined") {
                                    if (typeof window.plugins.nativepagetransitions !== "undefined") {
                                        config.nativeTransitions = true;
                                    }
                                }
                                if (nw.utils.getDebug()) {
                                    console.log("config.nativeTransitions:::", config.nativeTransitions);
                                    console.log("app.version nwmaker:::", app.version)
                                }
                                if (nw.evalueData(window.localStorage.getItem("notificacionDesktop"))) {
                                    config.notificacionDesktop = JSON.parse(window.localStorage.getItem("notificacionDesktop"));
                                } else {
                                    window.localStorage.setItem("notificacionDesktop", config.notificacionDesktop);
                                }

//                            if (nw.evalueData(window.localStorage.getItem("defaultPageTransition"))) {
//                                config.defaultPageTransition = window.localStorage.getItem("defaultPageTransition");
//                            } else {
                                window.localStorage.setItem("defaultPageTransition", config.defaultPageTransition);
//                            }
                                if (nw.evalueData(window.localStorage.getItem("zoomPage"))) {
                                    if (window.localStorage.getItem("zoomPage") !== "normal") {
                                        $("body").append("<style>div,p,h1,h2,input,span, label {zoom: " + window.localStorage.getItem("zoomPage") + ";}</style>");
                                    }
                                }
                            }
                            if (nw.evalueData(config.showLabel)) {
                                if (config.showLabel === "true" || config.showLabel === true) {
                                    $("body").append("<style>.ui-page .nw_label{opacity: 1;top: 0;position: relative;height: auto;}</style>");
                                }
                            }
                            if (!nw.evalueData(config.login_generate_code)) {
                                config.login_generate_code = false;
                            }
                            if (!nw.evalueData(config.login_solicitar_code)) {
                                config.login_solicitar_code = false;
                            }
                            if (typeof device !== "undefined") {
                                config.device = device.platform + " " + device.model + " " + device.version;
                            }

                            var css = "";
                            if (typeof up.usuario !== "undefined") {
                                if (nw.evalueData(config.home_background_color)) {
                                    css += ".home_background_color{background-color:" + config.home_background_color + ";}";
                                }
                                if (nw.evalueData(config.home_background_image)) {
                                    css += ".home_background_image{background-image:url(" + config.home_background_image + ");}";
                                }
                            } else {
                                if (nw.evalueData(config.login_background_color)) {
                                    css += ".home_background_color{background-color:" + config.login_background_color + ";}";
                                }
                                if (nw.evalueData(config.login_background_image)) {
                                    css += ".home_background_image{background-image:url(" + config.login_background_image + ");}";
                                }
                            }
                            if (css !== "") {
                                $("body").append("<style>" + css + "</style>");
                            }

                            var fil = new files();
                            fil.construct();
                            var fi = fil.files;

                            var file_main = "nwmaker/main.js?vdevice=" + config.version_in_this_device + "&v=" + config.version;
                            if (config.use_files_extern_by_domain_rpc === true) {
                                file_main = config.domain_files_manage + config.carpet_files_extern + "nwmaker/main.js?vdevice=" + config.version_in_this_device + "&v=" + config.version;
                            }
                            fi.push(file_main);

                            if (typeof compileAndMinify !== 'undefined' && compileAndMinify === true) {
                                var filesMin = [];
                                var domainFinal = "";
                                if (typeof domainLib == 'undefined') {
                                    domainFinal = "";
                                } else {
                                    domainFinal = domainLib.replace("nwmaker/", "");
                                    domainFinal = domainFinal.replace("nwmaker", "");
                                }
                                filesMin.push(domainFinal + "code.min.js?vdevice=" + config.version_in_this_device + "&v=" + config.version);
                                fi = filesMin;
                            }

                            console.log("files!", fi);

                            $(document).bind("mobileinit", function () {
                                $.mobile.page.prototype.options.keepNative = "select, input.foo, textarea.bar";
                                $.mobile.loader.prototype.options.disabled = true;
                                $.mobile.allowCrossDomainPages = true;
                                $.mobile.ajaxEnabled = false;
                                $.mobile.buttonMarkup.hoverDelay = 0;
                                $.mobile.touchOverflowEnabled = true;
                                $.mobile.phonegapNavigationEnabled = true;
                                $.mobile.page.prototype.options.domCache = true;
                                $.mobile.transitionFallbacks.slideout = "none";
//                            $.mobile.silentScroll(300);
                            });
                            nw.actionsButtons();
                            nw.onNavigateActive();
                            nw.actionNavigate();

                            if (nw.evalueData(up.usuario)) {
                                if (!nw.evalueData(up.cambio_clave) && config.changePass === true) {
                                    nw.changePass();
                                    return false;
                                }
                                var c = config.config_crear_cuenta;
                                if (c.pedir_politicas === true && c.pedir_politicas_in_session_create === true && !nw.evalueData(up.acepto_terminos_condiciones)) {
                                    nw.createAccount.politicasApp();
                                    return;
                                }
                                var hoy = nw.getActualDate();
                                var fv = window.localStorage.getItem("fecha_last_pregunta_update");
                                var launch = false;
                                if (fv < hoy) {
                                    launch = true;
                                }
                                if (!nw.evalueData(fv)) {
                                    launch = true;
                                }
                                if (nw.evalueData(config.requiredUpdateLastVersion)) {
                                    launch = true;
                                }
                                if (launch) {
                                    self.loadFilesAndMainHome(fi, callback);
                                    setTimeout(function () {
                                        nw.searchUpdatesApp(true, function (rd) {
                                        });
                                    }, 3000);

                                    nw.buscarActualizaciones.searchUpdatesAppInBack();

                                    if (nw.evalueData(config.requiredUpdateLastVersion)) {
                                        return true;
                                    }
                                } else {
                                    self.loadFilesAndMainHome(fi, callback);
                                }
                            } else {
                                self.loadFilesAndMainHome(fi, callback);
                            }
                        }
                    }, true);
                });
            }
        });
    },
    createStar: function (m) {

    },
    loadFilesAndMainHome: function (fi, callback) {
        var self = this;
        config.homeLoaded(function () {
            var tt = fi.length;
            var nn = 0;
            $.each(fi, function (indexx, vala) {
                if (config.use_files_extern_by_domain_rpc === true && vala.indexOf("js/") !== -1) {
                    vala = config.domain_files_manage + config.carpet_files_extern + vala + "?vdevice=" + config.version_in_this_device;
                }
                var sig = "?";
                if (vala.indexOf("?") !== -1) {
                    sig = "&";
                }
                nw.loadJs(vala + sig + "v=" + config.version, function () {
                    nn++;
                    if (nn === tt) {
                        function accept() {
                            var up = nw.userPolicies.getUserData();

                            nw.utils.validateLang();

                            if (!nw.evalueData(up.celular_validado) && config.config_crear_cuenta.verificar_celular_con_codigo === true || up.celular_validado === "NO" && config.config_crear_cuenta.verificar_celular_con_codigo === true) {
                                nw.utils.menuResetInitial();
                                nw.ingresaPhoneParaValidar();
                                nw.utils.addCss(".ui-navbar{display:none;}");
                                return false;
                            }
                            main = new main();
                            main.construct();
                            callback();

                            setTimeout(function () {
                                self.activeLatsConnect();
                            }, 30000);

                            if (!nw.isMobile()) {
                                if (nw.evalueData(config.activeLastConnectDetectInactivity)) {
                                    if (config.activeLastConnectDetectInactivity === true) {
                                        nw.utils.inactivityTime();
                                    }
                                }
                            }
                        }
                        accept();
                        if (config.validateSession === true && nw.isOnline() === true) {
                            setTimeout(function () {
                                self.refreshSessionApp();
                            }, 2000);
                        }
                    }
                });
            });
            nw.loadFastClick();
        });
    },
    removeSplash: function removeSplash() {
        nw.utils.removeSplash();
    },
    barcodeScanner: function (callback) {
        nw.utils.barcodeScanner(callback);
    },
    backgroundMode: function (mode) {
        nw.utils.backgroundMode(mode);
    },
    execnclick: function (widget, callback) {
        nw.buttons.execnclick(widget, callback);
    },
    focus: function (widget, callback) {
        nw.buttons.focus(widget, callback);
    },
    focusout: function (widget, callback) {
        nw.buttons.focusout(widget, callback);
    },
    nclick: function (widget, callback) {
        nw.buttons.nclick(widget, callback);
    },
    actionsButtons: function () {
        nw.buttons.actionsButtons();
    },
    object: function () {
        this.base = function () {};
    },
    Class: {
        define: function (className, callback) {
            var parts = className.split(".");
            var name = className;
            if (typeof parts[1] != 'undefined') {
                // ANDRESF: USO DE nw.clase o sit.clase para los nuevos JS
                if (typeof window[parts[0]] == 'undefined') {
                    window[parts[0]] = [];
                }
                window[parts[0]][parts[1]] = function () {
                    try {
                        var p = {};
                        p[0] = arguments[0];
                        p[1] = arguments[1];
                        p[2] = arguments[2];
                        callback.construct(p[0], p[1], p[3]);
                        var self = new callback.extend;
                        self.id = nw.createRandomId();
                    } catch (e) {
                        nw.utils.errorReport("Error creating page", e);
                    }
                    self.setTitle = "";
                    self.role = "page";
                    self.changeHash = true;
                    self.showMinimize = false;
                    self.html = "";
                    self.showBack = true;
                    self.closeBack = false;
                    self.closeBackCallBack = false;
                    self.isCreateInPageShow = false;
                    self.container = "body";
//                    if (nw.isMobile()) {
                    self.transition = config.defaultPageTransition;
//                    }
                    if (typeof config != 'undefined') {
                        self.styleCloseIOS = config.styleCloseIOS;
                        self.colorBtnBackIOS = config.colorBtnBackIOS;
                    }
                    self.createBase = function () {
                        var c = new nw.newPage();
                        c.id = self.id;
                        self.isCreateInPageShow = true;
                        c.isCreateInPageShow = true;
                        c.role = self.role;
                        if (nw.utils.getDebug()) {
                            console.log("self.role", self.role)
                        }
                        c.changeHash = self.changeHash;
                        c.drag = self.drag;
                        c.showMinimize = self.showMinimize;
                        c.showBack = self.showBack;
                        c.closeBack = self.closeBack;
                        c.transition = self.transition;
                        c.textClose = self.textClose;
                        c.styleCloseIOS = self.styleCloseIOS;
                        c.iconBackClose = self.iconBackClose;
                        c.colorBtnBackIOS = self.colorBtnBackIOS;
                        c.closeBackCallBack = self.closeBackCallBack;
                        c.logotipo_text = "<span class='setTitle'>" + self.setTitle + "</span>";
                        c.html = self.html;
                        c.container = self.container;
                        c.createBase();
                        self.canvas = "#" + c.id;
                    };
                    $.each(callback, function (index, val) {
                        self[index] = val;
                    });
                    $.each(callback.members, function (index, val) {
                        self[index] = val;
                    });
                    return self;
                };
                //ANDRESF: Funcionamiento de funciones estáticas como nw.utils.information();
                if (typeof callback.statics != 'undefined') {
                    $.each(callback.statics, function (index, val) {
                        if (nw.evalueData(val)) {
                            window[parts[0]][parts[1]][val.name] = val;
                        }
                    });
                }
            } else {
                window[name] = function () {
                    var self = new callback.extend;
                    self.id = nw.createRandomId();
                    self.setTitle = "";
                    self.role = "page";
                    self.changeHash = true;
                    self.showMinimize = false;
                    self.html = "";
                    self.showBack = true;
                    self.closeBack = false;
                    self.closeBackCallBack = false;
                    self.isCreateInPageShow = false;
                    self.transition = config.defaultPageTransition;
//                    if (typeof config != 'undefined') {
                    self.styleCloseIOS = config.styleCloseIOS;
                    self.colorBtnBackIOS = config.colorBtnBackIOS;
                    self.container = "body";
//                    }
                    self.createBase = function () {
                        var c = new nw.newPage();
                        c.id = self.id;
                        c.role = self.role;
                        c.drag = self.drag;
                        self.isCreateInPageShow = true;
                        c.isCreateInPageShow = true;
                        c.changeHash = self.changeHash;
                        c.showMinimize = self.showMinimize;
                        c.showBack = self.showBack;
                        c.closeBack = self.closeBack;
                        c.transition = self.transition;
                        c.textClose = self.textClose;
                        c.styleCloseIOS = self.styleCloseIOS;
                        c.iconBackClose = self.iconBackClose;
                        c.colorBtnBackIOS = self.colorBtnBackIOS;
                        c.closeBackCallBack = self.closeBackCallBack;
                        c.logotipo_text = "<span class='setTitle'>" + nw.utils.tr(self.setTitle) + "</span>";
                        c.html = self.html;
                        c.container = self.container;
                        c.createBase();
                        self.canvas = "#" + c.id;
                    };
                    $.each(callback, function (index, val) {
                        self[index] = val;
                    });
                    $.each(callback.members, function (index, val) {
                        self[index] = val;
                    });
                    return self;
                };
            }
        }
    },
    loadFastClick: function loadFastClick() {
        nw.utils.loadFastClick();
    },
    showImg: function showImg(img) {
        nw.utils.showImg(img);
    },
    loadSDKFB: function loadSDKFB(appid) {
        nw.fb.loadSDKFB(appid);
    },
    statusChangeCallback: function statusChangeCallback(response) {
        nw.fb.statusChangeCallback(response);
    },
    checkLoginState: function checkLoginState() {
        nw.fb.checkLoginState();
    },
    connectFB: function connectFB() {
        nw.fb.connectFB();
    },
    fb_logout: function fb_logout() {
        nw.fb.fb_logout();
    },
    fb_login: function fb_login() {
        nw.fb.fb_login();
    },
    saveOrLoginFBConnect: function saveOrLoginFBConnect(response) {
        nw.fb.saveOrLoginFBConnect(response);
    },
    suscribedUserNotificacionPush: function suscribedUserNotificacionPush() {
        nw.notificationPush.suscribedUserNotificacionPush();
    },
    unSuscribedUserNotificacionPush: function unSuscribedUserNotificacionPush(callback) {
        nw.notificationPush.unSuscribedUserNotificacionPush(callback);
    },
    sendNotificacion: function sendNotificacion(array, callback) {
        nw.notificationPush.sendNotificacion(array, callback);
    },
    devicePrinter: function devicePrinter() {
        nw.bluetooth.devicePrinter();
    },
    deviceConnect: function deviceConnect(data) {
        nw.bluetooth.deviceConnect(data);
    },
    bluetoothSerialList: function bluetoothSerialList() {
        nw.bluetooth.bluetoothSerialList();
    },
    conectDevice: function conectDevice(y) {
        nw.bluetooth.conectDevice(y);
    },
    uploadFileCamera: function uploadFileCamera(name, type, uploadDirect, imageURIDirect, quality, width, height, allowEdit, callback, offline) {
        return nw.uploaderFileSrv.uploadFileCamera(name, type, uploadDirect, imageURIDirect, quality, width, height, allowEdit, callback, offline);
    },
    uploadFile: function uploadFile(elm, callback) {
        nw.uploaderFileSrv.uploadFile(elm, callback);
    },
    openLink: function (url, target, optionsPopUp) {
        nw.utils.openLink(url, target, optionsPopUp);
    },
    conteoRegresivoPorFechaHora: function (endDate, msg) {
        nw.utils.conteoRegresivoPorFechaHora(endDate, msg);
    },
    userPolicies: {
        getUserData: function () {
            return localStorage;
        }
    },
    setUserInfo: function (df, callback) {
        nw.account.setUserInfo(df, callback);
    },
    searchUpdatesApp: function searchUpdatesApp(mode, callback) {
        return nw.buscarActualizaciones.searchUpdatesApp(mode, callback);
    },
    testing: function () {
        return nw.utils.testing();
    },
    getGeoLocation: function (callback, loadGoogleMaps, libraries) {
        var url = "nwmaker/nwmaker-geolocation.js";
        if (typeof domainLib !== "undefined") {
            url = domainLib + "nwmaker-geolocation.js";
        }
        nw.loadJs(url, function () {
            nwgeo.initialize(callback, loadGoogleMaps, libraries);
        });
    },
    getMobileOperatingSystem: function () {
        return nw.utils.getMobileOperatingSystem();
    },
//    initConnectionRPC: false,
    validateBtnMaterialIcons: function validateBtnMaterialIcons(icon) {
        return nw.buttons.validateBtnMaterialIcons(icon);
    },
    getBtnMaterialIcons: function getBtnMaterialIcons(icon) {
        return nw.buttons.getBtnMaterialIcons(icon);
    },
    createButton: function createButton(array) {
        return nw.buttons.createButton(array);
    },
    requireCss: function (url, div) {
        if (document.createStyleSheet) {
            document.createStyleSheet(url);
        } else {
            var id = url.replace(/\//gi, "");
            id = id.replace(/\#/gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(".", "");
            var styles = url;
            var ob = document.createElement('link');
            ob.id = id;
            ob.rel = 'stylesheet';
            ob.type = 'text/css';
            ob.href = styles;
            var style = document.querySelector("#" + id);
            if (!nw.evalueData(style)) {
                if (typeof div != "undefined") {
                    $(div).append(ob);
                } else {
                    document.getElementsByTagName("head")[0].appendChild(ob);
                }
            }
        }
    },
    getElement: function (classOrID) {
        return nw.utils.getElement(classOrID);
    },
    require: function (url, callBack, async) {
        return nw.loadJs(url, callBack, async);
    },
    loadJs: function (url, callBack, async, addVersion) {
        try {
            var asyncText = "async";
            if (typeof async === "undefined") {
                async = true;
            }
            if (!async) {
                asyncText = "";
            }
            var id = url.replace(/\//gi, "");
            id = id.replace(/\@/gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(/\</gi, "");
            id = id.replace(/\}/gi, "");
            id = id.replace(/\{/gi, "");
            id = id.replace(".", "");

            var version = "";
            if (typeof versionIndeviceGralDocument !== "undefined") {
                version = versionIndeviceGralDocument;
            }

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.id = id;
            script.className = id;
            script.charset = "UTF-8";
            script.async = asyncText;
            if (!addVersion) {
                script.src = url;
            } else {
                if (url.indexOf("?") !== -1) {
                    script.src = url + "&v=" + version;
                } else {
                    script.src = url + "?v=" + version;
                }
            }
//            script.src = url;
            var style = document.querySelector("." + id);
            if (!nw.evalueData(style)) {
                script.onload = function () {
                    if (nw.evalueData(callBack)) {
                        callBack();
                    }
                };
                if (async === true) {
                    document.getElementsByTagName('head')[0].appendChild(script);
                } else {
                    $("body").append(script);
                }
            } else {
                if (nw.evalueData(callBack)) {
                    callBack();
                }
            }
//            script.onload = function () {
//                callBack();
//            };
//            document.body.appendChild(script);
        } catch (e) {
            console.log("error in loadJS", e);
            nw.utils.errorReport("error in loadJS e:::: " + e);
        }
    },
    fadeInOutLabelInput: function (inputObject) {
        var name = $(inputObject).attr("name");
        var value = inputObject.value;
        var parent = inputObject.parent;
        var type = $(inputObject).attr("type");
        if (type === "checkBox") {
            return false;
        }
        if (nw.evalueData(parent)) {
            $(parent.canvas + " .nw_label_" + name).removeClass("showLabelClick");
            if (nw.evalueData(value)) {
                $(parent.canvas + " .nw_label_" + name).addClass("showLabelClick");
            }
        }
    },
    stripTags: function (str) {
        return nw.utils.stripTags(str);
    },
    strip_tags: function (str) {
        return nw.utils.strip_tags(str);
    },
    back: function () {
        history.back();
    },
    toDatetimeLocal: function toDatetimeLocal(date) {
        return nw.utils.toDatetimeLocal(date);
    },
    loadingRemove: function loadingRemove(options) {
        return nw.preloader.loadingRemove(options);
    },
    loading: function loading(options) {
        return nw.preloader.loading(options);
    },
    loading2: function loading2(options) {
        return nw.preloader.loading2(options);
    },
    validaValType: function (self) {
        var type = $(self).attr("data-type");
        var value = $(self).val();
        if (type === "dateField") {
            if (nw.evalueData(value)) {
                $(self).attr({type: 'date'});
            } else {
                $(self).attr({type: 'text'});
            }
        } else
        if (type === "time") {
            if (nw.evalueData(value)) {
                $(self).attr({type: 'time'});
            } else {
                $(self).attr({type: 'text'});
            }
        } else
        if (type === "dateTime") {
            if (nw.evalueData(value)) {
                $(self).attr({type: 'datetime-local'});
            } else {
                $(self).attr({type: 'text'});
            }
        }
    },
    isMobile: function () {
        return nw.utils.isMobile();
    },
    console_log: function (event, add, type, self) {
        nw.consoleEvent(event, add, type, self);
    },
    consoleLog: function (event, add, type, self) {
        nw.consoleEvent(event, add, type, self);
    },
    consolelog: function (event, add, type, self) {
        nw.consoleEvent(event, add, type, self);
    },
    console: {
        log: function (event, add, type, self) {
//            console.log("myFunc.caller", nw.console.log.caller);
//            console.log("myFunc.caller", nw.console.log.caller.toString());

//            console.log(new Error);
//            var caller_line = (new Error).stack.split("\n")[2];
//            console.log("caller_line", caller_line);
            nw.consoleEvent(event, add, type, self);
        }
    },
    consoleEvent: function (event, add, type, self) {
        var selfi = this;
//        console.log("myFunc.caller", nw.consoleEvent.caller);
//        console.log("myFunc.caller", selfi.consoleEvent.caller);
        var showConsoleEvents = false;
        if (nw.evalueData(mainNW.showConsoleEvents)) {
            showConsoleEvents = mainNW.showConsoleEvents;
        }
        if (nw.evalueData(window.localStorage.getItem("showConsoleEvents"))) {
            showConsoleEvents = window.localStorage.getItem("showConsoleEvents");
        }
        var showConsoleDeveloper = false;
        if (nw.evalueData(mainNW.showConsoleDeveloper)) {
            showConsoleDeveloper = mainNW.showConsoleDeveloper;
        }
        if (nw.evalueData(window.localStorage.getItem("showConsoleDeveloper"))) {
            showConsoleDeveloper = window.localStorage.getItem("showConsoleDeveloper");
        }
        if (type === "controls") {
            if (showConsoleEvents === false || showConsoleEvents === "false") {
                return false;
            }
        }
        var e = ":: ";
        if (typeof event == "object") {
            $.each(event, function (index, val) {
                e += index + ": ";
                if (nw.evalueData(val, 0)) {
                    if (typeof val == "object") {
                        $.each(val, function (index2, val2) {
                            e += index2 + ": " + val2 + ",";
                        });
                    } else {
                        e += val + "<br />";
                    }
                }
                e += "<br /><br />";
            });
        } else {
            e += event + " ";
            if (nw.evalueData(add)) {
                if (typeof add == "object") {
                    e += " ";
                    $.each(add, function (index, val) {
                        e += " " + index + ": " + val + "<br />";
                    });
                } else {
                    e += add + " ";
                }
            }
        }
//        console.log("self", self)
        var line = "";
        if (nw.evalueData(self)) {
            if (nw.evalueData(self.id)) {
                line = self.id + "::::::<br />";
            }
        }

//        console.log(new Error);
        var caller_line = (new Error).stack.split("\n");
        for (var i = 0; i < caller_line.length; i++) {
            line += caller_line[i] + "<br />";
        }
//        console.log("(new Error).stack", (new Error).stack);
//        line += "<br />" + (new Error).stack + "<br />";

        if (showConsoleDeveloper === true || showConsoleDeveloper === "true") {
            $(".consoleEventsNw").append("<br /><div class='bloqConsoleLog'><div class='containOriginConsoleNw'>" + line + "</div><div class='containEventConsoleNw'>" + e + "</div></div>");
        }
        $(".consoleEventsNw").scrollTop(100000000000);

        var showcon = true;
        if (showcon) {
            if (nw.evalueData(add)) {
//                console.log(line + event, add);
            } else {
//                console.log(event);
            }
        }

    },
    home: function () {
        nw.loadHome();
    },
    loadHome: function () {
        if (nw.utils.getDebug()) {
            console.log("loadHome");
            console.log("%c<<<<loadHome>>>>", 'background: blue; color: #fff');
        }
        nw.changePage("");
        nw.consoleEvent("load home", false, "controls");
        if (config.useCleanAllWindow !== false) {
            setTimeout(function () {
                nw.cleanAllWindow();
            }, 300);
        }
        window.location.href.split('#')[0];
    },
    changePage: function (id, options) {
        $.mobile.changePage(id, options);
    },
    cleanAllWindow: function () {
        if (nw.utils.getDebug()) {
            console.log("cleanAllWindow");
        }
        $(".pageNew").remove();
    },
    onNavigateActive: function () {
        //        window.addEventListener("hashchange", function (e) {
//            if (e.oldURL.length > e.newURL.length)
//                nw.dialog("back")
//        });
        $(window).on("navigate", function (event, data) {
            var dir = data.state.direction;
//            console.log(data.state.info);
//            console.log(data.state.url);
//            console.log(data.state.hash);

            nw.consoleEvent("navigate direction", dir, "controls");
            if (questionExit === true) {
                nw.closeApp();
                return false;
            }
            var timeremove = 300;
            nw.rpc.closeConnection();
            if (dir === "back") {
                if (nw.utils.getDebug()) {
                    console.log("Back page");
                }
                nw.loadingRemove();
                timeremove = 70;
                if (nw.utils.getDebug()) {
                    console.log("nw.newPage.lastTransition", nw.newPage.lastTransition)
                }
                if (nw.evalueData(nw.newPage.lastTransition)) {
//                    nw.newPage.lastTransition
                    if (config.nativeTransitions) {
                        var transition = config.nativeTransitions;
                        var direction = "right";
                        if (config.nativeTransitions === "slideup") {
                            direction = "down";
                        }
                        if (config.nativeTransitions === "slidedown") {
                            direction = "up";
                        }
                        var flipOptions = {
//                        "href": "#" + self.id,
                            "direction": direction, // 'left|right|up|down', default 'left' (which is like 'next')
                            "duration": 300, // in milliseconds (ms), default 400
                            "iosdelay": 60, //60, // ms to wait for the iOS webview to update before animation kicks in, default 60
                            "androiddelay": 70, //70, // same as above but for Android, default 70
                            slowdownfactor: 4
                        };
                        var sucess = function (msg) {
                            console.log("flip success: " + msg);
                        };
                        var error = function (msg) {
                            console.log("flip error: " + msg);
                            nw.errorLogger.process("flip error: " + msg);
                        };
                        if (nw.utils.getDebug()) {
                            console.log("transition", transition)
                        }
                        if (transition === "slidefade") {
                            window.plugins.nativepagetransitions.fade(flipOptions, sucess, error);
                        } else
                        if (transition === "slide" || transition === "slideup" || transition === "slidedown") {
                            window.plugins.nativepagetransitions.slide(flipOptions, sucess, error);
                        } else
                        if (transition === "flip") {
                            window.plugins.nativepagetransitions.flip(flipOptions, sucess, error);
                        } else {
                            window.plugins.nativepagetransitions.slide(flipOptions, sucess, error);
                        }
                    }
                }
//                $(".ui-page").last().removeClass("pageActiveNwSlideup");
//                setTimeout(function () {
//                    $(".ui-page").last().removeClass("pagePreActiveNwSlideup");
//                }, 400);
            }
//            if (dir === "back") {
            var p = $(".ui-page");
            if (nw.utils.getDebug()) {
                nw.console.log("Total pages", p.length);
            }
            if (typeof p.length !== "undefined") {
                if (p.length <= 2) {
                    nw.loadHome();
                    if (nw.utils.getDebug()) {
                        nw.console.log("Clear all pages, load home");
                        console.log("config.closeAppToDetectBack", config.closeAppToDetectBack)
                    }
                    if (inhome === true && config.closeAppToDetectBack !== false) {
                        nw.dialogExit();
                        return false;
                    }
                    return false;
                }
            }
            setTimeout(function () {
                $(".ui-page").last().remove();
            }, timeremove);
//            }
        });
    },
    actionNavigate: function () {
        $(document).on("pagechangefailed", function (e, data) {
            if (nw.utils.getDebug()) {
//                nw.console.log("pagechangefailed", data);
            }
        });
        $(document).on("pagechange", function (e, data) {
//            nw.consoleEvent("pagechange", false, "controls");
//            console.log("Page active: " + $.mobile.navigate.history.getActive().url, false, "controls");
//            nw.consoleEvent("Stack: (active index = " + $.mobile.navigate.history.activeIndex + " -previous index: " + $.mobile.navigate.history.previousIndex + " )", false, "controls");
//            nw.consoleEvent("ACTIVE", $.mobile.navigate.history.stack[$.mobile.navigate.history.activeIndex].url, "controls");
//            if (nw.evalueData($.mobile.navigate.history.previousIndex)) {
//                nw.consoleEvent("ATRÁS", $.mobile.navigate.history.stack[$.mobile.navigate.history.previousIndex].url, "controls");
//            }
//            $.each($.mobile.navigate.history.stack, function (index, val) {
//                nw.consoleEvent(index + "-" + val.url, false, "controls");
//            });
            if (!exit) {
                var page = data.toPage;
                var other = $.mobile.path.parseUrl(data.toPage).filename;
                var absUrl = data.absUrl;
                var domain = location.protocol + "//" + location.host + location.pathname;
                if (absUrl === domain + "#" || absUrl === domain) {
                    inhome = true;
                } else {
                    inhome = false;
                }
            }
        });
        $(document).on("pagebeforechange", function (e, data) {
            if (exit) {
                history.back();
            }
        });
    },
    dialogExit: function () {
        questionExit = true;
        var os = nw.getMobileOperatingSystem();
        if (os !== "ANDROID") {
            return false;
        }
        nw.popupSimple("<p>¿Desea cerrar la aplicación?</p>", accept, cancel);
        function accept() {
            nw.closeApp();
        }
        function cancel() {
            questionExit = false;
        }
    },
    closeApp: function () {
        if (nw.evalueData(navigator.app) === true) {
            navigator.app.exitApp();
            return true;
        }
        nw.dialog("No es posible cerrar la aplicación. El dispositivo no está listo.");
        questionExit = false;
    },
    appendLinkMenu: function appendLinkMenu(di, parent) {
        return nw.menuPanel.appendLinkMenu(di, parent);
    },
    containerLinksMenu: function containerLinksMenu() {
        return nw.menuPanel.containerLinksMenu();
    },
    generateLink: function generateLink(name, callback, mode, number, description, icon, style, addClass) {
        return nw.menuPanel.generateLink(name, callback, mode, number, description, icon, style, addClass);
    },
    setValSpanSel: function setValSpanSel(self) {
        return nw.utils.setValSpanSel(self);
    },
    createRandomId: function createRandomId() {
        return nw.utils.createRandomId();
    },
    scrollPage: function scrollPage(p, vel, toped, divScroll) {
        return nw.utils.scrollPage(p, vel, toped, divScroll);
    },
    createFields: function createFields(div_dest, filters, html_add_start, html_add_end, columnsForm, parent) {
        return nw.createFieldsForms.createFields(div_dest, filters, html_add_start, html_add_end, columnsForm, parent);
    },
    addRequiredMessage: function addRequiredMessage(div, msg, top, useScroll) {
        return nw.forms.addRequiredMessage(div, msg, top, useScroll);
    },
    evalInput: function evalInput(d, useScroll) {
        return nw.forms.evalInput(d, useScroll);
    },
    validateForm: function (form, useScroll) {
        return nw.forms.validateForm(form, useScroll);
    },
    removeErrorField: function () {
        $(".errorNwForm").remove();
    },
    getDomain: function () {
        return location.hostname;
    },
    getRecords: function getRecords(divID, simple, selfParent) {
        return nw.getFiltersRecords.getRecords(divID, simple, selfParent);
    },
    getFilterRecords: function getFilterRecords(divID, arraySimple, selfParent) {
        return nw.getFiltersRecords.getFilterRecords(divID, arraySimple, selfParent);
    },
    evalueData: function evalueData(d, exception) {
//        if (typeof nw.utils !== "undefined") {
//            return nw.utils.evalueData(d, exception);
//        }
        if (typeof d === "undefined") {
            return false;
        }
        if (typeof exception !== "undefined") {
            if (d == exception) {
                return true;
            }
        }
        if (d === undefined) {
            return false;
        }
        if (d === null) {
            return false;
        }
        if (d === "null") {
            return false;
        }
        if (d === false) {
            return false;
        }
        var permiteCero = true;
        if (typeof permiteCeroException !== "undefined") {
            if (permiteCeroException === false) {
                permiteCero = false;
            }
        }
        if (permiteCero) {
            if (d == false || d == null) {
                return false;
            }
        }
        if (d === "") {
            return false;
        }
        return true;
    },
    createDialog: function (params) {
        return nw.createDialogNw(params);
    },
    createDialogNw: function (params) {
        var c = new nw.newPage();
        $.each(params, function (key, value) {
            c[key] = value;
        });
        c.createAndShow();
        return c;
    },
    nw_dialog: function (html) {
        var params = {};
        params.html = html;
        return nw.createDialogNw(params);
    },
    str: function (text) {
        return nw.utils.tr(text);
    },
    tr: function (text) {
        return nw.utils.tr(text);
    },
    closeSession: function closeSession(loading, callback) {
        return nw.account.closeSession();
    },
    reject: function (s) {
        var d = document.querySelector(s.canvas);
        if (d) {
            d.remove();
        }
        var d = document.querySelector("." + s.id);
        if (d) {
            d.remove();
        }
    },
    backgroundColor: function (s, color) {
        var d = document.querySelector(s.canvas);
        if (d) {
            d.style.backgroundColor = color;
        }
    },
    append: function (s, html) {
        $(s).append(html);
    },
    createNotificacionBarInter: function createNotificacionBarInter(options) {
        return nw.dialogs.createNotificacionBarInter(options);
    },
    dialogRemove: function dialogRemove() {
        nw.dialogs.dialogRemove();
    },
    dialog: function dialog(text, callbackAccept, callbackCancel, options) {
        return nw.dialogs.dialog(text, callbackAccept, callbackCancel, options);
    },
    information: function information(text, callbackAccept, callbackCancel, options) {
        return nw.dialogs.dialog(text, callbackAccept, callbackCancel, options);
    },
    popupSimple: function popupSimple(text, callbackAccept, callbackCancel, options) {
        nw.dialogs.popupSimple(text, callbackAccept, callbackCancel, options);
    },
    createPopUp: function createPopUp(text, callbackAccept, callbackCancel, options) {
        return nw.dialogs.createPopUp(text, callbackAccept, callbackCancel, options);
    },
    cleanTokenField: function () {
        $(".containTokenResult").remove();
    },
    addZero: function addZero(i) {
        return nw.utilsDate.addZero(i);
    },
    semanadelanio: function semanadelanio(date) {
        return nw.utilsDate.semanadelanio(date);
    },
    addMinutesToDate: function addMinutesToDate(date, minutes, format) {
        return nw.utilsDate.addMinutesToDate(date, minutes, format);
    },
    dataOfDate: function dataOfDate(date) {
        return nw.utilsDate.dataOfDate(date);
    },
    diffEntreFechas: function diffEntreFechas(fechaIni, fechaFin) {
        return nw.utilsDate.diffEntreFechas(fechaIni, fechaFin);
    },
    diferenciaHoras: function diferenciaHoras(hourEnd, hourInit, clean) {
        return nw.utilsDate.diferenciaHoras(hourEnd, hourInit, clean);
    },
    calcularTiempoDosFechas: function calcularTiempoDosFechas(date1, date2, abreviado) {
        return nw.utilsDate.calcularTiempoDosFechas(date1, date2, abreviado);
    },
    lettersArray: function lettersArray(i) {
        return nw.utilsDate.lettersArray(i);
    },
    mesesArray: function mesesArray(i) {
        return nw.utilsDate.mesesArray(i);
    },
    mesTextEnglish: function mesTextEnglish(i) {
        return nw.utilsDate.mesTextEnglish(i);
    },
    diasArray: function diasArray(i) {
        return nw.utilsDate.diasArray(i);
    },
    getActualFullDate: function getActualFullDate(format) {
        return nw.utilsDate.getActualFullDate(format);
    },
    hoyfull: function hoyfull(format) {
        return nw.getActualFullDate(format);
    },
    getActualHour: function getActualHour(format) {
        return nw.utilsDate.getActualHour(format);
    },
    hora: function hora(format) {
        return nw.getActualHour(format);
    },
    getActualDate: function getActualDate(format) {
        return nw.utilsDate.getActualDate(format);
    },
    hoy: function hoy(format) {
        return nw.getActualDate(format);
    },
    isOnline: function () {
        if (!navigator.onLine) {
            return false;
        }
        if (typeof navigator.connection !== "undefined") {
//            console.log("navigator.connection", navigator.connection);
            if (navigator.connection.type === "none") {
                return false;
            }
            return true;
        }
        return navigator.onLine;
    },
    uiOptions: function () {
        this.array = {};
        return this.array;
    },
    addButtonsPage: function addButtonsPage(self) {
        return nw.buttons.addButtonsPage(self);
    },
    addHeaderNote: function (div, text) {
        $(div).prepend("<div class='addHeaderNote'>" + nw.utils.tr(text) + "</div>");
    },
    addFooterNote: function (div, text) {
        $(div).after("<div class='addHeaderNote'>" + text + "</div>");
    },
    setFields: function setFields(self, bt) {
        return nw.setUiFields.setFields(self, bt);
    },
    getRpcUrl: function () {
        return "rpcNw";
    },
    cleanInput: function cleanInput(self, id) {
        nw.forms.cleanInput(self, id);
    },
    populateSelectFromArray: function populateSelectFromArray(self, array, id, clean) {
        nw.forms.populateSelectFromArray(self, array, id, clean);
    },
    populateSelect: function populateSelect(id, self, service, method, data, callback, async, remove) {
        nw.forms.populateSelect(id, self, service, method, data, callback, async, remove);
    },
    normalizeRadioButton: function () {
        nw.utils.normalizeRadioButton();
    },
    contextmenuClear: function (parent, mode) {
        $(".contain_menu_li_touch").remove();
        $(".bglimen").remove();
        if (mode === "bottom") {
            $("body").find(".contain_menu_li_touch").addClass("menu_btm_hidden");
            $("body").find(".bglimen").remove();
            setTimeout(function () {
                $("body").find(".contain_menu_li_touch").remove();
            }, 400);
            return true;
        }
        $("." + parent.id).find(".contain_menu_li_touch").remove();
        $("." + parent.id).find(".bglimen").remove();
    },
    menu: function () {
        var self = this;
        self.id = 'menu';
        return self;
    },
    createPanel: function createPanel(options) {
        return nw.menuPanel.createPanel(options);
    },
    start: function () {
        mainNW = this;
        var up = nw.userPolicies.getUserData();
        this.id = 'foo';
        this.enc_height = '40px';
        this.enc_color = '#e9e9e9';
        this.logotipoHeader = 'Logo';
        this.contentCenter = '';
        this.contentCenterInLogin = '';
        this.contentFooter = '';
        this.domain_rpc = 'http://localhost:8000';
        this.menuLeft = [];
        this.defaultPageTransition = "slide";
        this.defaultPageTransitionDesktop = "fade";
        this.supportCors = true;
        this.showConsoleDeveloper = false;
        this.showConsoleEvents = false;
        this.theme = "a";
        this.homeLoaded = function (callback) {
            var self = this;
            var get = nw.getGET();
            var execcreateAccountByGet = false;
            if (get) {
                if (nw.evalueData(get.createAccount)) {
                    execcreateAccountByGet = true;
                }
            }

            var showConsoleDeveloper = false;
            if (nw.evalueData(this.showConsoleDeveloper)) {
                showConsoleDeveloper = this.showConsoleDeveloper;
            }
            if (nw.evalueData(window.localStorage.getItem("showConsoleDeveloper"))) {
                showConsoleDeveloper = window.localStorage.getItem("showConsoleDeveloper");
            }

            if (nw.isMobile()) {
                $.mobile.defaultPageTransition = this.defaultPageTransition;
            } else {
                $.mobile.defaultPageTransition = this.defaultPageTransitionDesktop;
            }

            $.mobile.ajaxEnabled = false;
            $.mobile.page.prototype.options.domCache = true;
            $.mobile.page.prototype.options.allowCrossDomainPages = true;
            $.mobile.transitionFallbacks.slideout = "none";
//            $.mobile.silentScroll(300);

            $.support.cors = this.supportCors;

            $.mobile.page.prototype.options.theme = this.theme;

            if (nw.utils.getDebug()) {
                console.log("this.theme", this.theme)
            }

            nw.addClass(document.body, "themeBody_" + this.theme);

            if (config.nativeTransitions === true) {
                var cs = document.createElement("style");
                cs.className = "stylesTransitionsNative";
                cs.innerHTML = ".ui-mobile .ui-page {opacity: 1!important;display: block!important;animation: none!important;}";
                document.body.appendChild(cs);

                $.mobile.defaultPageTransition = "none";
//                $.mobile.defaultDialogTransition = "none";
            }
//            $.mobile.buttonMarkup.hoverDelay = 0;
//            $.mobile.touchOverflowEnabled = true;
//            $.mobile.phonegapNavigationEnabled = true;

            var classPage = "";

            $(".ui-page").removeClass("ui-page-theme-a");
            $(".ui-page").addClass("ui-page-theme-" + self.theme);
            if (nw.evalueData(this.enc_color)) {
                document.querySelector(".my-header").style.backgroundColor = this.enc_color;
            }
            document.querySelector(".my-header").style.minHeight = this.enc_height;
            document.querySelector(".logotipoHeader").innerHTML = this.logotipoHeader;
            $(".my-header").addClass("headerEnc_" + config.dataPosition);
            $(".my-header").addClass("ui-bar-" + config.theme);
            $(".my-header").attr("data-position", config.dataPosition);
//            if (nw.isMobile() && config.dataPosition !== "fixed") {
            if (config.dataPosition !== "fixed") {
                document.querySelector(".contentCenter").style.marginTop = this.enc_height;
            }

            if (showConsoleDeveloper === true || showConsoleDeveloper === "true") {
                $("body").append("<div class='consoleEventsNw'><div class='encConsoleEvents'>ConsoleDeveloper<button class='close_developt'>Close</button> <button class='open_developt'>Min</button> <button class='open_developt_maximice'>Max</button> <button class='open_developt_clean'>Clean</button></div></div>");
            }
            if (config.use_func_first_testing === true) {
                config.func_first_testing();
                return false;
            }


            if (typeof functionsStartedAppLoadAllFiles !== "undefined") {
                functionsStartedAppLoadAllFiles();
            }

            if (typeof up.usuario !== "undefined") {
                setTimeout(function () {
                    nw.utils.validaVersionCache();
                }, 5000);
            } else {
                nw.utils.validaVersionCache();
            }


            if (execcreateAccountByGet === true) {
                nw.createAccount.formCreateAccount();
            } else
            if (config.useFree === true) {
                if (typeof callback !== "undefined") {
                    callback();
                }
                return false;
            } else
            if (typeof up.usuario !== "undefined") {
                nw.createPanel({id: "leftpanel1", position: "left", display: config.panelDisplay, html: "<ul class='containLinksMenuLeft'></ul>", backgroundColor: config.panelBackgroundColor, open: config.panelOpen});

                var ah = this.contentCenter;
                ah += nw.containerLinksMenu();
                ah += "<div class='contentFooterHome'></div>";
                document.querySelector(".contentCenter").innerHTML = ah;

                $(".btnMenuHeader").fadeIn(0);
                $(".btnMenuHeader").append("<i class='material-icons menuBarEnc'>menu</i>");

                var foto = "";
                if (nw.evalueData(up.foto)) {
                    var dd = up.foto.split("://");
                    if (dd.length > 1) {
                        foto = up.foto;
                    } else {
                        foto = config.domain_files_manage + nw.getFileByType(up.foto, 60);
                    }
                }
                var ht = "";
                ht += "<p class='dataUser dataUserFoto' style='background-image: url(" + foto + ");'></p>";
                ht += "<p class='dataUser dataUserNameMail'><span class='dataUser dataUserName'>" + up.nombre + "</span> ";
                ht += "<span class='dataUser dataUserMail'>User: " + up.usuario + "</span> ";
                if (up.email !== up.usuario) {
                    ht += "<span class='dataUser dataUserMail'>" + up.email + "</span> ";
                }
                if (nw.evalueData(up.nom_perfil)) {
                    ht += "<span class='dataUser dataUserMail'>" + up.nom_perfil + "</span></p>";
                }
                var da = document.createElement("div");
                da.className = "dataUserLeft";
                da.innerHTML = ht;
                $("#leftpanel1").prepend(da);

//                console.log("config.menuLeft", config.menuLeft)
//                console.log("this.menuLeft", this.menuLeft)

                nw.menuPanel.createMenuHomeCenter();

//                for (var i = 0; i < config.menuLeft.length; i++) {
//                    var li = config.menuLeft[i];
//                    var addClass = false;
//                    if (nw.evalueData(li.addClass)) {
//                        addClass = li.addClass;
//                    }
//                    var mode = config.modeMenu;
//                    if (typeof li.mode !== "undefined") {
//                        mode = li.mode;
//                    }
//                    if (li.position === "left" || li.position === "center_left") {
//                        var di = nw.generateLink(li.name, li.callback, "left", i, li.description, li.icon, false, addClass);
//                        $(".containLinksMenuLeft").append(di);
//                    }
//                    if (li.position === "center_left" || li.position === "center") {
//                        var di = nw.generateLink(li.name, li.callback, "center", i, li.description, li.icon, mode, addClass);
//                        nw.appendLinkMenu(di);
//                    }
//                }
                $("#leftpanel1").append("<div class='footCredits'>" + config.contentFooter + "</div>");

                if (typeof callback !== "undefined") {
                    callback();
                }
            } else {
                classPage = "login_page";
                $("#ff").addClass(classPage);
                $(".contentCenter").html(this.contentCenterInLogin);
                $(".contentCenter").addClass("contentCenterInLogin");
                document.querySelector(".btnMenuHeader").remove();
                nw.login.createLogin();
            }
        };
    },
    createMenuCenter: function () {

    },
    responseLogin: function (r) {
        nw.login.responseLogin(r);
    },
    openConcurrente: function (r) {
        nw.login.openConcurrente(r);
    },
    activeTimerConcurrenDialog: function (tim) {
        nw.login.activeTimerConcurrenDialog(tim);
    },
    refreshSessionApp: function (callback) {
        nw.account.refreshSessionApp(callback);
    },
    activeLatsConnect: function (onlyExec) {
        nw.account.activeLatsConnect(onlyExec);
    },
    ingresaPhoneParaValidar: function (dialog) {
        nw.createAccount.ingresaPhoneParaValidar(dialog);
    },
    dialog2: function (text, accept, cancel, options) {
        return nw.dialogs.dialog2(text, accept, cancel, options);
    },
    pagosEmpresa: function () {
        nw.account.pagosEmpresa();
    },
    pagosHistorico: function () {
        nw.account.pagosHistorico();
    },
    historicoRetiros: function () {
        nw.account.historicoRetiros();
    },
    retiroFondos: function () {
        return nw.account.retiroFondos();
    },
    datosBancarios: function () {
        return nw.account.datosBancarios();
    },
    changePass: function (inter, user) {
        return nw.account.changePass(inter, user);
    },
    menuProfile: function () {
        nw.account.menuProfile();
    },
    editProfile: function (home) {
        return nw.account.editProfile(home);
    },
    empty: function (widget) {
        nw.utils.empty(widget);
    },
    remove: function (widget) {
        nw.utils.remove(widget);
    },
    changeZoomWindow: function () {
        nw.configuration.changeZoomWindow();
    },
    changeTransicionWindow: function () {
        nw.configuration.changeTransicionWindow();
    },
    changeThema: function () {
        nw.configuration.changeThema();
    },
    about: function () {
        nw.configuration.about();
    },
    addClass: function (el, cls) {
        return nw.utils.addClass(el, cls);
    },
    removeClass: function (el, cls, isWidget) {
        return nw.utils.removeClass(el, cls, isWidget);
    },
    cleanUserNwC: function (u) {
        return nw.utils.cleanUserNwC(u);
    },
    playSound: function (urlFileSound, options) {
        return nw.utils.playSound(urlFileSound, options);
    },
    getDataCountryIP: function () {
        return nw.utils.getDataCountryIP();
    },
    getPositionByIP: function (ip) {
        nw.utils.getPositionByIP(ip);
    },
    validateNwPayments: function (r) {
        return nw.utils.validateNwPayments(r);
    },
    addNumber: function addNumber(nStr) {
        return nw.utils.addNumber(nStr);
    },
    getToken: function getToken() {
        return nw.utils.getToken();
    },
    getPermission: function (permissionType, callback) {
        return nw.utils.getPermission(permissionType, callback);
    },
    getExtensionFile: function (archivo) {
        return nw.utils.getExtensionFile(archivo);
    },
    activateBackgroundMode: function () {
        nw.utils.activateBackgroundMode();
    },
    inactivateBackgroundMode: function () {
        nw.utils.inactivateBackgroundMode();
    },
    openAppToFront: function () {
        nw.utils.openAppToFront();
    },
    turnScreenOn: function () {
        nw.utils.turnScreenOn();
    },
    turnScreenOnAndUnlocked: function () {
        nw.utils.turnScreenOnAndUnlocked();
    },
    shareSocial: function (text, title, mimetype) {
        return nw.utils.shareSocial(text, title, mimetype);
    },
    getGET: function (url) {
        return nw.utils.getGET(url);
    },
    set saldoVal(saldo) {
        this.saldo = saldo;
    },
    get saldoVal() {
        return this.saldo;
    },
    consultaPuntaje: function consultaPuntaje(data, callback) {
        nw.utils.consultaPuntaje(data, callback);
    },
    launchNavigatorUbication: function (opts) {
        return nw.utils.launchNavigatorUbication(opts);
    },
    launchNavigatorUbicationGoogleMaps: function (opts) {
        return nw.utils.launchNavigatorUbicationGoogleMaps(opts);
    },
    launchNavigatorUbicationWaze: function (opts) {
        return nw.utils.launchNavigatorUbicationWaze(opts);
    },
    nativeGeoCoder: function nativeGeoCoder(latitude, longitude, callback) {
        nw.utils.nativeGeoCoder(latitude, longitude, callback);
    },
    getPromotionsApp: function getPromotionsApp() {
        nw.utils.getPromotionsApp();
    },
    showPromotionsApp: function showPromotionsApp(data) {
        nw.utils.showPromotionsApp(data);
    },
    validateEmail: function (email) {
        return nw.utils.validateEmail(email);
    },
    initVideoCallNw: function (roomId, token, callback, parametrosGet) {
        nw.utils.initVideoCallNw(roomId, token, callback, parametrosGet);
    },
    getFileByType: function (file, w, mode) {
        return nw.utils.getFileByType(file, w, mode);
    },
    cortaText: function (text, numMax) {
        return nw.utils.cortaText(text, numMax);
    },
    isBrowser: function () {
        return nw.utils.isBrowser();
    },
    getPlatformID: function () {
        return nw.utils.getPlatformID();
    },
    find: function (element, className) {
        return nw.utils.find(element, className);
    },
    examplesDevelopers: function () {
        var d = new nw.developers();
        d.construct();
    }
};

Date.prototype.toDatetimeLocal =
        function toDatetimeLocal() {
            var
                    date = this,
                    ten = function (i) {
                        return (i < 10 ? '0' : '') + i;
                    },
                    YYYY = date.getFullYear(),
                    MM = ten(date.getMonth() + 1),
                    DD = ten(date.getDate()),
                    HH = ten(date.getHours()),
                    II = ten(date.getMinutes()),
                    SS = ten(date.getSeconds())
                    ;
            return YYYY + '-' + MM + '-' + DD + 'T' +
                    HH + ':' + II + ':' + SS;
        };

Date.prototype.fromDatetimeLocal = (function (BST) {
    return new Date(BST).toISOString().slice(0, 16) === BST ?
            function () {
                return new Date(
                        this.getTime() +
                        (this.getTimezoneOffset() * 60000)
                        ).toISOString();
            } :
            Date.prototype.toISOString;
}('2006-06-06T06:06'));


window.addEventListener('message', function (e) {
    if (typeof e.data !== "undefined") {
        var r = e.data;
        if (r.tipo === "uploaderFileFrame") {
            document.querySelector("." + r.field).value = r.data.urlFile;
            $("." + r.field).trigger("change");

//            $("." + r.field).val(777).trigger("change");

        }
    }
});

/*
 app.initialize();
 */
/*
 window.onerror = function (msg, url, lineNo, columnNo, error) {
 var string = msg.toLowerCase();
 var substring = "script error";
 var t = substring;
 if (string.indexOf(substring) > -1) {
 t = 'Revisa la consola o informa al administrador del sistema.';
 } else {
 t = [
 'Message: ' + msg,
 'URL: ' + url,
 'Line: ' + lineNo,
 'Column: ' + columnNo,
 'Error object: ' + JSON.stringify(error)
 ].join(' - ');
 }
 nw.utils.errorReport("Script Error: Error desconocido", t);
 return false;
 };
 */nw.require('nwmakerlib_mobile/class/nw.account.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.app.js', function f() {
                                        try {
//                                            app.initialize();
//                                            app.debug = true;
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.audio.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.bd_offline.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.bluetooth.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.buscarActualizaciones.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.buttons.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.calendar.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.configuration.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.contextmenu.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.createAccount.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.createFieldsForms.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.cube.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.developers.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.dialogs.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.errorLogger.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.fb.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.filesPhotosCamera.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.firebase.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.forms.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.geolocationBackground.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.getFiltersRecords.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.google.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.lists.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.localStorage.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.login.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.mainPolicies.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.maskedInput.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.md5.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.menuPanel.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.newPage.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.notificationDesktop.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.notificationPush.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.notificationPushFirebaseMessaging.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.payConekta.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.payWompi.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.permissions.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.preloader.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.printer.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.rpc.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.setUiFields.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.signature_pad.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.uploaderFileSrv.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.utils.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.utilsDate.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.video.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);nw.require('nwmakerlib_mobile/class/nw.videocall.js', function f() {
                                        try {
                                            console.log("Cargado " + files[i]);
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }, false);app.initialize();app.debug = true;