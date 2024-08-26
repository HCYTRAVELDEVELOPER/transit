var inApp = false;
var app = {
    debug: false,
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // Bind any cordova events here. Common events are: 'pause', 'resume', etc.
    onDeviceReady: function () {
        var self = this;
        self.version = "0.0.0.2";
        self.receivedEvent('deviceready');
        document.addEventListener("pause", this.onPause, false);
        document.addEventListener("resume", this.onResume, false);

        nw.appMode = "web";
        if (typeof cordova.plugins !== "undefined") {
            nw.appMode = "app";
        }

        nw.initialize(function () {
            if (typeof FCMPlugin !== "undefined") {
                self.pushNotification();
            }
//        this.geoLocation();
            if (typeof window.plugins !== "undefined") {
                if (typeof window.plugins.insomnia !== "undefined") {
                    window.plugins.insomnia.keepAwake();
                }
            }
            if (typeof cordova.plugins !== "undefined") {
                if (typeof cordova.plugins.backgroundMode !== "undefined") {
                    self.inBackground();
                }
            }

            self.setupOpenwith();

//            nw.barcodeScanner(function (r) {
//                nw.dialog(r);
//            });

//        setTimeout(function () {
//            var accept = function (results) {
//                alert(results);
//                nw.dialogRemove();
//            }
//            var cancel = function () {
//                nw.dialogRemove();
//            }
//            nw.dialog("<div class=det_cant_mas>Ingresa el número de mascotas<br></div>", accept, cancel, {cleanHtml: false, autoCierre: true, isprompt: true});
//        }, 2000);
//        nw.getPositionByIP();
//        nw.getDataCountryIP();
//        self.testingContextMenuNative();
//            self.testingLoadingNative();
//            self.testingDialogsNative();
//        var ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');
//        cordova.plugins.autoStart.enable();
//        this.diagnosticSettings();
            // Create a Google Maps native view under the map_canvas div.
//        var div = document.getElementById("foo");
//        var map = plugin.google.maps.Map.getMap(div);
//        setTimeout(function () {
//            inApp = true;
//        }, 3000);
//        this.statusBarEnc();
        });
    },
    setupOpenwith: function (r) {
        var self = this;

        if (typeof cordova.openwith === "undefined") {
            return false;
        }
        // Increase verbosity if you need more logs
        cordova.openwith.setVerbosity(cordova.openwith.DEBUG);

        // Initialize the plugin
        cordova.openwith.init(initSuccess, initError);

        function initSuccess() {
            console.log('init success!');
        }
        function initError(err) {
            console.log('init failed: ' + err);
        }

        // Define your file handler
        cordova.openwith.addHandler(myHandler);

        function myHandler(intent) {
            nw.getPermission([
                'android.permission.WRITE_EXTERNAL_STORAGE',
                'android.permission.CAMERA'
            ], function () {


                console.log('intent received');

                console.log('  action: ' + intent.action); // type of action requested by the user
                console.log('  exit: ' + intent.exit); // if true, you should exit the
                // app after processing

                var file = "";
                var items = [];
                for (var i = 0; i < intent.items.length; ++i) {
                    var item = intent.items[i];
                    console.log('  type: ', item.type);   // mime type
                    console.log('  uri:  ', item.uri);     // uri to the file, probably NOT a web uri

                    // some optional additional info
                    console.log('  text: ', item.text);   // text to share alongside the item, iOS only
                    console.log('  name: ', item.name);   // suggested name of the image, iOS 11+ only
                    console.log('  utis: ', item.utis);
                    console.log('  path: ', item.path);   // path on the device, generally undefined
                    file = item.path;
                    items.push(item);
                }

                // ...
                // Here, you probably want to do something useful with the data
                // ...
                // An example...

                // For simplicity, only handle sharing a single file.
                if (intent.items.length > 0) {
                    cordova.openwith.load(intent.items[0], function (data, item) {
                        // data is a long base64 string with the content of the file
                        console.log("item loaded, it weights " + data.length + " bytes");

//                    console.log(data);
                        console.log("file", file);
                        console.log("items", items);

                        if (typeof nw.openWithMain !== "undefined") {
                            nw.openWithMain(items);
                        }

//                    var populate = true;
//                    var hoy = nw.getActualDate();
//                    var hour = nw.getActualHour();
//                    var sl = {};
//                    sl.fecha = hoy;
//                    sl.hora_inicial = hour;
//                    sl.hora_final = hour;
//                    sl.prioridad = "Normal";
//                    sl.adjunto = file;
//
//                    var d = new f_tarea_crear_editar();
//                    d.construct(self, function () {
//                        self.applyFilters();
//                    }, populate, sl, function () {
//                        nw.uploadFileCamera("adjunto", "camera", true, file);
//                    });
//                    d.populate(sl);


//                    cordova.openwith.exit();
                        // upload to your server, confirm to the user.
                        // uploadToServer(item, function() {
                        //   if (intent.exit) { cordova.openwith.exit(); }
                        // });
                    });
                } else {
                    // if (intent.exit) { cordova.openwith.exit(); }
                }
            });
        }
    },
    intervaloInBackground: null,
    inBackground: function (r) {
        var self = this;
        // Android customization
        // To indicate that the app is executing tasks in background and being paused would disrupt the user.
        // The plug-in has to create a notification while in background - like a download progress bar.

        cordova.plugins.backgroundMode.setDefaults({
            title: config.name,
            text: 'Activo. Toca para abrir.',
            icon: 'icon',
            color: 'F14F4D',
            resume: true,
            hidden: false,
            bigText: false
        });
        // Enable background mode
        cordova.plugins.backgroundMode.enable();
        //pasar a primer plano
//        cordova.plugins.backgroundMode.moveToForeground();
//        pasar a segundo plano
//        cordova.plugins.backgroundMode.moveToBackground();
//        detectar status de la pantalla
//        cordova.plugins.backgroundMode.isScreenOff(function(bool) {
//    ...
//});
//Desbloqueo y activación Un despertador enciende la pantalla mientras que el desbloqueo mueve la aplicación a primer plano incluso cuando el dispositivo está bloqueado.
//// Turn screen on
//cordova.plugins.backgroundMode.wakeUp();
// Turn screen on and show app even locked
//cordova.plugins.backgroundMode.unlock();
        cordova.plugins.backgroundMode.on('activate', function () {
            cordova.plugins.backgroundMode.disableWebViewOptimizations();
            nw.workInBackgroundMode = true;
            if (self.debug) {
                console.log("BACKGROUND activate");
            }
            clearInterval(self.intervaloInBackground);
            var total = 0;
            sendDataPosition = false;
//            console.log(nw.mainActivityBackgroundMode);
//            nwgeo.getLatitudLongitud(function (position) {
//                if (nw.mainActivityBackgroundMode !== false) {
//                    nw.mainActivityBackgroundMode(position);
//                }
//            });
            if (config.useGPSBackgroundMode !== false) {
                self.intervaloInBackground = setInterval(function () {
                    total++;
                    if (self.debug) {
                        console.log("sendDataPosition", sendDataPosition);
                        console.log("ESTO EN BACKGROUND MODE " + total + ", sendDataPosition: " + sendDataPosition);
                    }
                    if (total <= 2) {
                        sendDataPosition = false;
                    }
                    if (!sendDataPosition && total > 20) {
                        window.plugins.bringtofront();
                    }
                }, 1000);
            }
        });
        cordova.plugins.backgroundMode.on('deactivate', function () {
            nw.workInBackgroundMode = false;
            if (self.debug) {
                console.log("BACKGROUND deactivate ");
            }
            clearInterval(self.intervaloInBackground);
        });
        cordova.plugins.backgroundMode.on('failure', function (ra) {
            nw.dialog("background failure " + ra);
        });
        cordova.plugins.backgroundMode.ondeactivate = function () {
            if (self.debug) {
                console.log("BACKGROUND ondeactivate");
            }
            clearInterval(self.intervaloInBackground);
        };
        cordova.plugins.backgroundMode.onactivate = function () {
            cordova.plugins.backgroundMode.disableWebViewOptimizations();
        };
        cordova.plugins.backgroundMode.overrideBackButton();
    },
    onPause: function (r) {
        var self = this;
//        console.log("onPause", r);
        inApp = false;
        clearInterval(self.intervaloInBackground);
    },
    onResume: function (r) {
        var self = this;
//        console.log("onResume", r);
        inApp = true;
        clearInterval(self.intervaloInBackground);
    },
    receivedEvent: function (id) {
//        console.log('Received Event: ' + id);
//        nw.console.log('Received Event: ' + id);
    },
    prueba: function (id) {
        alert("SI prueba " + id);
    },
    testingContextMenuNative: function () {
        var self = this;
        if (typeof ContextMenu === "undefined") {
            return false;
        }
        var fun = function () {
            self.prueba(1);
        };
        var entries = [];
        entries.push({
            title: 'Entry 1',
            id: "one",
            callback: fun
        });
        entries.push({
            title: 'Entry 2',
            id: 'foo'
        });
        entries.push({
            title: '',
            id: '',
            isSeparator: true
        });
        entries.push({
            title: 'Entry 3',
            id: 'bar'
        });

        var context = {
            title: 'Title',
            items: entries,
            x: 0,
            y: 0
        };
        ContextMenu.open(context, function (ele) {
            nw.dialog('You clicked the entry with an id of ' + ele);
            console.log(ele);
            try {
                eval(ele);
            } catch (e) {
                nw.dialog("ele failed " + e);
                nw.console.log("ele failed " + e);
            }
        });
    },
    testingLoadingNative: function () {
//        nw.loading();
//        nw.loading({text: "Buscando..."});
//        nw.loading({title: "Información"});
        nw.loading({text: "Buscando...", title: "Información"});
//        nw.loading({text: "Buscando...", title: "Información", "container": ".test"});
    },
    testingDialogsNative: function () {
        var accept = function () {
            alert("Acepto!");
            return true;
        };
        var cancel = function () {
            alert("Cancela!");
            return true;
        };
        nw.dialog("accept", accept, cancel);
//        navigator.vibrate([1000, 1000, 3000, 1000, 5000]);
//        function alertDismissed() {
//            // do something
//        }
//        navigator.notification.alert(
//                'Esta es una alerta simple', // message
//                alertDismissed, // callback
//                'Título', // title
//                'Aceptar'                 // buttonName
//                );
//        function onConfirm(buttonIndex) {
//            alert('You selected button ' + buttonIndex);
//        }
//        navigator.notification.confirm(
//                'Notificación de confirmación', // message
//                onConfirm, // callback to invoke with index of button pressed
//                'Game Over', // title
//                ['Restart', 'Exit']     // buttonLabels
//                );
//
//        function onPrompt(results) {
//            alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
//        }
//        navigator.notification.prompt(
//                'Please enter your name', // message
//                onPrompt, // callback to invoke
//                'Registration', // title
//                ['Ok', 'Exit'], // buttonLabels
//                'Jane Doe'                 // defaultText
//                );
//        navigator.notification.beep(2);
    },
    statusBarEnc: function () {
//        if (window.StatusBar) {
        StatusBar.overlaysWebView(true);
        StatusBar.styleLightContent();
        StatusBar.backgroundColorByHexString('#ffffff');
//        }
    },
    diagnosticSettings: function () {
        cordova.plugins.diagnostic.switchToSettings(function () {
            console.log("Successfully switched to Settings app");
        }, function (error) {
            console.error("The following error occurred: " + error);
        });
    },
    geoLocation: function () {
        try {
            var onSuccess = function (position) {

                navigator.notification.confirm('Ubicación ' + position);

                app.geolocation = position;
            };
            function onError(error) {
                alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
//                alert('Por favor verifique que tenga su GPS activo y vuelva a intentarlo');
            }
//            navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
            navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true});
        } catch (e) {
            alert("Error " + e);
            nw.dialog("navigator catch error " + e);
            console.log(e);
            nw.console.log(e);
        }
    },
    pushNotification: function () {
        try {
            nw.suscribedUserNotificacionPush();

            FCMPlugin.onTokenRefresh(function (token) {
                nw.console.log("onTokenRefresh", token);
            });

//            FCMPlugin.subscribeToTopic('topicExample');

            FCMPlugin.onNotification(
                    function (data) {
                        if (data.wasTapped) {
                            nw.console.log("Recived notify", JSON.stringify(data));
                        } else {
                            nw.console.log("False recived notify", JSON.stringify(data));
                        }
//                        alert("SII");
//                        nw.dialog(JSON.stringify(data.title) + " " + JSON.stringify(data.body));
                        try {
                            eval(data.data);
                        } catch (e) {
                            nw.loadingRemove();
                            nw.dialog("callback failed " + e);
                            nw.console.log("callback failed " + e);
                            console.log("callback failed " + e);
                        }
                    },
                    function (msg) {
                        nw.console.log('onNotification callback successfully registered: ' + msg);
//                        alert(JSON.stringify(msg));
                    },
                    function (err) {
                        nw.console.log('Error registering onNotification callback: ' + err);
//                        alert(JSON.stringify(err));
                    }
            );
        } catch (e) {
            nw.console.log("pushNotification failed " + e);
            console.log(e);
        }
    }
};
app.initialize();
var showconsolerpcresult = false;
var mainNW = false;
var questionExit = false;
var exit = false;
var inhome = true;
var activebar = false;
var timebar;
__infoUser = {};
var nw = {
    mainActivityBackgroundMode: false,
    workInBackgroundMode: false,
    initialize: function (callback) {
        var self = this;
        var up = nw.userPolicies.getUserData();
        var versionNwMaker = "0.0.0.1";
        var f = [];
        f.push("nwmaker/fastclick.js");
        f.push("nwmaker/config.js");
        f.push("nwmaker/menu.js");
        f.push("nwmaker/files.js");
        var t = f.length;
        var n = 0;
        var os = nw.getMobileOperatingSystem();
        if (os === "ANDROID") {
            nw.requireCss("nwmaker/css/android.css");
        } else
        if (os === "IOS") {
            nw.requireCss("nwmaker/css/ios.css");
        } else
        if (os === "WINDOWS_PHONE") {
            nw.requireCss("nwmaker/css/windows_phone.css");
        }

        $.each(f, function (index, val) {
            nw.require(val, function () {
                n++;
                if (n === t) {
                    config = new config();
//                    config.dataPosition = "fixed";
                    config.dataPosition = "relative";
                    config.construct();

//                    nw.console.log("version actual", config.version);

                    var m = new menu().construct();
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
                        if (nw.evalueData(window.localStorage.getItem("domain_rpc"))) {
                            config.domain_rpc = window.localStorage.getItem("domain_rpc");
                        } else {
                            window.localStorage.setItem("domain_rpc", config.domain_rpc);
                        }
                        if (nw.evalueData(window.localStorage.getItem("testing"))) {
                            config.testing = window.localStorage.getItem("testing");
                        } else {
                            window.localStorage.setItem("testing", config.testing);
                        }
                        if (nw.evalueData(window.localStorage.getItem("defaultPageTransition"))) {
                            config.defaultPageTransition = window.localStorage.getItem("defaultPageTransition");
                        } else {
                            window.localStorage.setItem("defaultPageTransition", config.defaultPageTransition);
                        }
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
                    fi.push("nwmaker/main.js?v=" + config.version);

                    $(document).bind("mobileinit", function () {
                        $.mobile.page.prototype.options.keepNative = "select, input.foo, textarea.bar";
                        $.mobile.loader.prototype.options.disabled = true;
                        $.mobile.allowCrossDomainPages = true;
                    });
                    nw.actionsButtons();
                    nw.onNavigateActive();
                    nw.actionNavigate();

                    if (nw.evalueData(up.usuario)) {
                        if (!nw.evalueData(up.celular_validado) && config.config_crear_cuenta.verificar_celular_con_codigo === true || up.celular_validado === "NO" && config.config_crear_cuenta.verificar_celular_con_codigo === true) {
                            nw.ingresaPhoneParaValidar();
                            return false;
                        }
                        if (!nw.evalueData(up.cambio_clave) && config.changePass === true) {
                            nw.changePass();
                            return false;
                        }
                        var c = config.config_crear_cuenta;
                        if (c.pedir_politicas === true && c.pedir_politicas_in_session_create === true && !nw.evalueData(up.acepto_terminos_condiciones)) {
                            nw.politicasApp();
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
                            nw.searchUpdatesApp(true, function (rd) {
                                self.loadFilesAndMainHome(fi, callback);
                            });
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
            });
        });
    },
    loadFilesAndMainHome: function (fi, callback) {
        var self = this;
        config.homeLoaded(function () {
            var tt = fi.length;
            var nn = 0;
            $.each(fi, function (indexx, vala) {
                nw.loadJs(vala + "?v=" + config.version, function () {
                    nn++;
                    if (nn === tt) {

//                        self.getPermission();

                        main = new main();
                        main.construct();
                        callback();
                        self.activeLatsConnect();
                    }
                });
            });
            nw.loadFastClick();
        });
    },
    barcodeScanner: function (callback) {
        if (typeof cordova.plugins === "undefined") {
            return false;
        }
        if (typeof cordova.plugins.barcodeScanner === "undefined") {
            nw.dialog("No tiene instalado el plugin phonegap-plugin-barcodescanner");
            return false;
        }
        cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (!result.cancelled) {
                        var value = result.text;
                        callback(value);
//                        // En este caso solo queremos que procese código QR
//                        if (result.format == "QR_CODE") {
//                            var value = result.text;
//                            callback(value);
//                            console.log(value);
//                        } else {
//                            nw.dialog("Ops, se escaneo un código pero al parecer no es QR");
//                        }
//                    } else {
//                        nw.dialog("El usuario se ha saltado el escaneo.");
                    }
                },
                function (error) {
                    nw.dialog("Ha ocurrido un error: " + error);
                }
        );
    },
    backgroundMode: function (mode) {
        if (mode === "disable") {
            if (typeof cordova !== "undefined") {
                if (typeof cordova.plugins !== "undefined") {
                    if (typeof cordova.plugins.backgroundMode !== "undefined") {
                        cordova.plugins.backgroundMode.disable();
                    }
                }
            }
        } else {
            if (typeof cordova !== "undefined") {
                if (typeof cordova.plugins !== "undefined") {
                    if (typeof cordova.plugins.backgroundMode !== "undefined") {
                        cordova.plugins.backgroundMode.enable();
                    }
                }
            }
        }
    },
    execnclick: function (widget, callback) {
        nw.console.log("Execute nclick");
        try {
            callback(widget);
        } catch (e) {
            nw.dialog("execnclick failed " + e);
            console.log(e);
            nw.console.log(e);
            nw.loadingRemove();
        }
    },
    focus: function (widget, callback) {
        try {
//            widget.focusin(function () {
//                callback(widget);
//            });
            widget.focus(function () {
                callback(widget);
            });
//            $(widget).on("click touch", function () {
//                console.log("focus", widget);
//                callback(widget);
//            });
//            $(widget).on("vmouseup", function () {
//                console.log("focus", widget);
//                callback(widget);
//            });
//            $(document).on("vmouseup", widget, function () {
//                callback(widget);
//            });
        } catch (e) {
            nw.dialog("nclick failed");
            console.log(e);
            nw.console.log(e);
            nw.loadingRemove();
        }
    },
    focusout: function (widget, callback) {
        try {
            $(widget).on("vmouseover", function () {
                console.log("focusout", widget);
                callback(widget);
            });
//            $(document).on("vmousemove", widget, function () {
//                callback(widget);
//            });
//            widget.focusout(function () {
//                callback(widget);
//            });
        } catch (e) {
            nw.dialog("nclick failed");
            console.log(e);
            nw.console.log(e);
            nw.loadingRemove();
        }
    },
    nclick: function (widget, callback) {
        try {
            widget.on('click touch', function () {
                nw.execnclick(this, callback);
            });
        } catch (e) {
            nw.dialog("nclick failed");
            console.log(e);
            nw.console.log(e);
            nw.loadingRemove();
        }
    },
    actionsButtons: function () {
        var self = this;
        $(".swiperight").on("swiperight", function () {
            nw.back();
        });
//        var click = "tap";
        var click = "click touch";
        (function () {
            $('body').delegate('.btnExec', click, function (e) {
                nw.execnclick(this, function (ethis) {
                    var self = ethis;
                    if (typeof self.callback !== "undefined") {
                        if (nw.evalueData(self.callback)) {
                            nw.closeConnection();
                            self.callback(self);
                        }
                    }
                    $("#leftpanel1").panel("close");
                });
            });
        })();
        (function () {
            $('body').delegate('.close_developt', click, function () {
                $(".consoleEventsNw").css({"height": "0"});
            });
        })();
        (function () {
            $('body').delegate('.setMoney', "keyup", function () {
                var regex = /(\d+)/g;
                var val = this.value;
                var re = /,/g;
                var val = val.replace(re, '');
                val = val.match(regex);
                if (val == null) {
                    val = "";
                }
                if (val != null && val[0] == '0') {
                    val = "";
                }
                var dato = nw.addNumber(val);
                this.value = dato;
            });
        })();
        (function () {
            $('body').delegate('.open_img_popup', click, function () {
                var img = $(this).attr("data-file");
                nw.showImg(img);
            });
        })();
        (function () {
            $('body').delegate('.dataUserLeft', click, function () {
                nw.menuProfile();
            });
        })();
        (function () {
            $('body').delegate('.open_developt', click, function () {
                $(".consoleEventsNw").css({"height": ""});
            });
        })();
        (function () {
            $('body').delegate(':file', 'change', function () {
                nw.uploadFile(this);
            });
        })();
        (function () {
            $('body').delegate('.nwButtonCameraAndFiles', click, function () {
                var name = this.name;
                var quality = 50;
                var width = false;
                var height = false;
                var allowEdit = false;
                if (nw.evalueData(this.getAttribute("data-quality"))) {
                    quality = parseInt(this.getAttribute("data-quality"));
                }
                if (nw.evalueData(this.getAttribute("data-cameraWidth"))) {
                    width = parseInt(this.getAttribute("data-cameraWidth"));
                }
                if (nw.evalueData(this.getAttribute("data-cameraHeight"))) {
                    height = parseInt(this.getAttribute("data-cameraHeight"));
                }
                if (nw.evalueData(this.getAttribute("data-allowEdit"))) {
                    allowEdit = this.getAttribute("data-allowEdit");
                    if (allowEdit === "true") {
                        allowEdit = true;
                    }
                }
                var camera = function () {
                    self.uploadFileCamera(name, "camera", false, false, quality, width, height, allowEdit);
                };
                var files = function () {
                    self.uploadFileCamera(name, "files", false, false, quality, width, height, allowEdit);
                };
                var options = {};
                options.iconAccept = "<i class='material-icons' style='top: 5px;position: relative;'>camera_alt</i> ";
                options.iconCancel = "<i class='material-icons' style='top: 5px;position: relative;'>photo_library</i> ";
                options.useDialogNative = false;
                options.closeEnc = true;
                options.autocierre = true;
                options.cleanHtml = false;
                options.textAccept = "Cámara";
                options.textCancel = "Archivos";
                nw.dialog("Seleccione", camera, files, options);
            });
        })();
        (function () {
            $('body').delegate('.nwButtonCamera', click, function () {
                var quality = 50;
                var width = false;
                var height = false;
                var allowEdit = false;
                if (nw.evalueData(this.getAttribute("data-quality"))) {
                    quality = parseInt(this.getAttribute("data-quality"));
                }
                if (nw.evalueData(this.getAttribute("data-cameraWidth"))) {
                    width = parseInt(this.getAttribute("data-cameraWidth"));
                }
                if (nw.evalueData(this.getAttribute("data-cameraHeight"))) {
                    height = parseInt(this.getAttribute("data-cameraHeight"));
                }
                if (nw.evalueData(this.getAttribute("data-allowEdit"))) {
                    allowEdit = this.getAttribute("data-allowEdit");
                    if (allowEdit === "true") {
                        allowEdit = true;
                    }
                }
                self.uploadFileCamera(this.name, "camera", false, false, quality, width, height, allowEdit);
            });
        })();
        (function () {
            $('body').delegate('.nwButtonCameraFiles', click, function () {
                var quality = 50;
                var width = false;
                var height = false;
                var allowEdit = false;
                if (nw.evalueData(this.getAttribute("data-quality"))) {
                    quality = parseInt(this.getAttribute("data-quality"));
                }
                if (nw.evalueData(this.getAttribute("data-cameraWidth"))) {
                    width = parseInt(this.getAttribute("data-cameraWidth"));
                }
                if (nw.evalueData(this.getAttribute("data-cameraHeight"))) {
                    height = parseInt(this.getAttribute("data-cameraHeight"));
                }
                if (nw.evalueData(this.getAttribute("data-allowEdit"))) {
                    allowEdit = this.getAttribute("data-allowEdit");
                    if (allowEdit === "true") {
                        allowEdit = true;
                    }
                }
                self.uploadFileCamera(this.name, "files", false, false, quality, width, height, allowEdit);
            });
        })();
        (function () {
            $('body').delegate('input', 'keyup', function (e) {
                nw.fadeInOutLabelInput(this);
            });
        })();
        (function () {
            $('body').delegate('input', 'focusout', function (e) {
                nw.validaValType(this);
            });
        })();
        (function () {
            $('body').delegate('input', 'change', function (e) {
                nw.validaValType(this);
                nw.fadeInOutLabelInput(this);
            });
        })();
        (function () {
            $('body').delegate('.nw_selectBox', 'change', function (e) {
                nw.setValSpanSel(this);
            });
        })();
        (function () {
            $('body').delegate('.optionToken', 'click', function (e) {
                $(".containTokenResult").remove();
            });
        })();
        (function () {
            $('body').delegate('.dateTimeLocal', "tap", function (e) {
                $(this).attr({type: 'datetime-local'});
//                $(this).click();
                setTimeout(function () {
                    $(this).trigger('click');
//                    $(this).click();
                }, 10);
            });
        })();
        (function () {
            $('body').delegate('.dateField_input', "tap", function (e) {
                $(this).attr({type: 'date'});
//                $(this).click();
                setTimeout(function () {
                    $(this).trigger('click');
//                    $(this).click();
                }, 10);
            });
        })();
        (function () {
            $('body').delegate('.time_input', "tap", function (e) {
                $(this).attr({type: 'time'});
//                $(this).click();
                setTimeout(function () {
                    $(this).trigger('click');
//                    $(this).click();
                }, 10);
            });
        })();
    },
    Class: {
        define: function (className, callback) {
            window[className] = function () {
                var self = new callback.extend;
                self.id = nw.createRandomId();
                self.setTitle = "";
                self.html = "";
                self.showBack = true;
                self.closeBack = false;
                self.closeBackCallBack = false;
                self.styleCloseIOS = config.styleCloseIOS;
                self.colorBtnBackIOS = config.colorBtnBackIOS;
                self.createBase = function () {
                    var c = new nw.newPage();
                    c.id = self.id;
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
                    c.createAndShow();
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
    },
    loadFastClick: function loadFastClick() {
        if (typeof FastClick === "undefined") {
            return false;
        }
        new FastClick(document.body);
    },
    showImg: function showImg(img) {
        var html = "";
        html += "<div class='show_img_pop_contain'><img class='show_img_pop' src='" + img + "' /></div>";
        var self = new nw.newPage();
        self.id = "openImage";
        self.title = "Imagen";
        self.textClose = "Atrás";
        self.html = html;
        self.create();
        self.show();
    },
    loadSDKFB: function loadSDKFB(appid) {
        nw.console.log(appid);
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id))
                return;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = function () {
            FB.init({
                appId: appid,
                cookie: true,
                xfbml: true,
                version: 'v3.2'
            });
            /*
             FB.getLoginStatus(function (response) {
             nw.statusChangeCallback(response);
             });
             */
        };
    },
    statusChangeCallback: function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        nw.console.log('statusChangeCallback');
        console.log(response);
        nw.console.log(response);
        if (response.status === 'connected') {
            nw.connectFB();
        }
    },
    checkLoginState: function checkLoginState() {
        console.log("checkLoginState");
        nw.console.log("checkLoginState");
//        nw.connectFB();
        FB.getLoginStatus(function (response) {
            console.log(response);
            nw.statusChangeCallback(response);
        });
    },
    connectFB: function connectFB() {
        FB.api('/me?fields=name,email,gender,age_range,picture,location{location{country, country_code, city, city_id, latitude, longitude, region, region_id, state, street, name}}', {fields: 'name,last_name,first_name,email,picture,birthday'}, function (response) {
            FB.login(function (response) {}, {scope: 'email,public_profile,user_location'});
            console.log('Successful login for: ' + response.name, response);
            nw.console.log('Successful login for: ' + response.name, response);
            nw.saveOrLoginFBConnect(response);
        });
    },
    fb_logout: function fb_logout() {
        if (typeof facebookConnectPlugin !== "undefined") {
            facebookConnectPlugin.logout(ok, error);
            function ok(response) {
                nw.console.log("[facebookConnectPlugin.logout OK] response: " + JSON.stringify(response));
            }
            function error(response) {
                nw.console.log("[facebookConnectPlugin.logout ERROR] response: " + JSON.stringify(response));
            }
        }
    },
    fb_login: function fb_login() {
        facebookConnectPlugin.login(["public_profile", "email"], function (result) {
            loginSuccess(result);
        }, function (error) {
            loginError(error);
        });
        function loginSuccess(result) {
            facebookConnectPlugin.api("/me?fields=email,name,picture",
                    ["public_profile", "email"]
                    , function (userData) {
                        //API success callback
                        nw.console.log(JSON.stringify(userData));
                        nw.console.log(userData);
                        nw.saveOrLoginFBConnect(userData);
                    },
                    function (error) {
                        loginError(error);
                    });
        }
        function loginError(error) {
            nw.console.log(error);
            nw.console.log(JSON.stringify(error));
//            alert(JSON.stringify(error));
        }
    },
    saveOrLoginFBConnect: function saveOrLoginFBConnect(response) {
        var c = config.config_crear_cuenta;
        var showcreate = false;
        if (c.pedir_pais === true || c.pedir_departamento_geo === true || c.pedir_ciudad === true || c.pedir_documento === true || c.pedir_celular === true || c.pedir_direccion === true || c.pedir_fecha_nacimiento === true || c.pedir_politicas_in_session_create === false && c.pedir_politicas === true) {
            showcreate = true;
        }
        nw.loading({text: "Por favor espere...", textVisible: true, html: "", theme: "b"});
        var data = response;
        data.page = c.page;
        data.email = response.email;
        data.usuario = response.email;
        data.id = response.id;
        data.nombre = response.name;
        data.foto_perfil = response.picture.data.url;
        data.showcreate = showcreate;
        nw.console.log(data);
        var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
        rpc.setAsync(true);
        rpc.setLoading(false);
        var func = function (r) {
            nw.console.log("connectFB", r);
            if (r === "noexisteuser" && showcreate) {
                var r = {};
                r.nombre = response.first_name;
                if (c.pedir_apellido === false) {
                    r.nombre = response.name;
                }
                r.email = response.email;
                r.apellido = response.last_name;
                r.fecha_nacimiento = response.birthday;
                r.foto_perfil = response.picture.data.url;
                nw.createAccount(r);
                return false;
            }
            nw.responseLogin(r);
        };
        rpc.exec("validaUserFBCreate", data, func);
    },
    suscribedUserNotificacionPush: function suscribedUserNotificacionPush() {
        var up = nw.userPolicies.getUserData();
        if (typeof up.usuario !== "undefined") {
            FCMPlugin.getToken(function (token) {
                if (window.localStorage.getItem("token") === token) {
                    nw.console.log("token a registrar ya existe", token);
                    return false;
                }
                window.localStorage.setItem("token", token);
                nw.console.log("getToken", token);
                var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
                var data = {};
                data.usuario = up.usuario;
                data.token = token;
                data.device = config.device;
                rpc.setAsync(true);
                rpc.setLoading(false);
                var func = function (r) {
                    nw.console.log("Token register", r);
                };
                rpc.exec("saveTokenPush", data, func);

                FCMPlugin.subscribeToTopic('topicExample');
            }, function (err) {
                nw.console.log(err);
                nw.dialog(err);
            });
        }
    },
    unSuscribedUserNotificacionPush: function unSuscribedUserNotificacionPush(callback) {
        FCMPlugin.unsubscribeFromTopic('topicExample', function (msg) {
            nw.console.log(msg);
        }, function (err) {
            nw.console.log(err);
            nw.dialog(err);
        });
    },
//    suscribedUser: function suscribedUser() {
//        var up = nw.userPolicies.getUserData();
//        if (typeof up.usuario !== "undefined") {
//            FCMPlugin.getToken(function (token) {
//                if (window.localStorage.getItem("token") === token) {
//                    nw.console.log("token a registrar ya existe", token);
//                    return false;
//                }
//                window.localStorage.setItem("token", token);
//                nw.console.log("getToken", token);
//                var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
//                var data = {};
//                data.usuario = up.usuario;
//                data.token = token;
//                rpc.setAsync(true);
//                rpc.setLoading(false);
//                var func = function (r) {
//                    nw.console.log("Token register", r);
//                };
//                rpc.exec("saveTokenPush", data, func);
//            });
//        }
//    },
    sendNotificacion: function sendNotificacion(array, callback) {
        var key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';
        var to = array.to;
        var notification = {
            'title': array.title,
            'body': array.body,
            'icon': array.icon,
            'click_action': array.callback,
            "priority": "high",
            "content_available": true,
            "show_in_foreground": true,
            'sound': array.sound,
            'vibrate': true,
        };
        fetch('https://fcm.googleapis.com/fcm/send', {
            'method': 'POST',
            "content_available": true,
            'headers': {
                'Authorization': 'key=' + key,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'to': to,
                'notification': notification,
                "show_in_foreground": true,
                "content_available": true,
                'priority': 'high',
//                "restricted_package_name":""
                data: {
                    data: array.data,
                    callback: array.callback.toString(),
                    title: array.title,
                    body: array.body
                }
            })
        }).then(function (response) {
            console.log(response);
            if (nw.evalueData(callback)) {
                callback(response);
            }
        }).catch(function (error) {
            console.error(error);
            nw.console.error(error);
        });
    },
    uploadFileCamera: function uploadFileCamera(name, type, uploadDirect, imageURIDirect, quality, width, height, allowEdit) {
        console.log("Start uploadFileCamera");
        console.log("uploadDirect", uploadDirect);
        var self = this;
//        var qualityPhoto = 50;
        var qualityPhoto = 35;
//        var qualityPhoto = 20;
        if (nw.evalueData(quality)) {
            qualityPhoto = quality;
        }
        nw.loading({text: "Por favor espere...<span class='statusUploadFile'></span>", textVisible: true, html: "", theme: "b"});
        if (uploadDirect === true) {
            onSuccess(imageURIDirect);
        } else
        if (type === "files") {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: qualityPhoto,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true
            });
        } else {
            var ops = {};
            ops.quality = qualityPhoto;
            if (nw.evalueData(allowEdit)) {
                ops.allowEdit = allowEdit;
            }
            ops.saveToPhotoAlbum = true;
            ops.correctOrientation = true;
            ops.destinationType = Camera.DestinationType.FILE_URI;
            if (nw.evalueData(width)) {
                if (width !== "auto" && width !== false && width !== null) {
                    ops.targetWidth = width;
                }
            }
            if (nw.evalueData(height)) {
                if (height !== "auto" && height !== false && height !== null) {
                    ops.targetHeight = height;
                }
            }
            navigator.camera.getPicture(onSuccess, onFail, ops);
//            navigator.camera.getPicture(onSuccess, onFail, {
//                quality: qualityPhoto,
//                targetWidth: targetWidth,
//                targetHeight: targetHeight,
//                saveToPhotoAlbum: true,
//                correctOrientation: true,
//                destinationType: Camera.DestinationType.FILE_URI
//            });
        }
        function onSuccess(imageURI) {
            console.log(imageURI);

            var nameFileTemp = imageURI + '?' + Math.random();

            if (document.querySelector(".fileUpShow_" + name)) {
                document.querySelector(".fileUpShow_" + name).style.display = "block";
                document.querySelector(".fileUpShow_" + name).style.backgroundImage = "url(" + nameFileTemp + ")";
            }

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.name = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            var params = {};
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;
            options.chunkedMode = false;

            var ft = new FileTransfer();
            ft.upload(imageURI, mainNW.domain_rpc + "/nwlib6/uploader_camera.php", function (result) {

                nw.loadingRemove();

                console.log('successfully uploaded ', result);
                console.log('successfully uploaded ', result.response);
//                        nw.dialog('successfully uploaded ' + result.response);

                if (document.querySelector(".fileUpShow_" + name))
                    document.querySelector(".fileUpShow_" + name).style.backgroundImage = "url(" + mainNW.domain_rpc + result.response + ")";
                if (document.querySelector(".nw_textField_" + name))
                    document.querySelector(".nw_textField_" + name).value = result.response;

            }, function (error) {
                nw.loadingRemove();
                console.log('error : ', error);
                alert('error : ' + JSON.stringify(error));
            }, options);

            var statusDom = document.querySelector('.statusUploadFile');

            ft.onprogress = function (progressEvent) {
                if (progressEvent.lengthComputable) {
                    var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                    statusDom.innerHTML = perc + "% loaded...";
                } else {
                    if (statusDom.innerHTML == "") {
                        statusDom.innerHTML = "Loading";
                    } else {
                        statusDom.innerHTML += ".";
                    }
                }
            };
        }

        function onFail(message) {
            nw.loadingRemove();
            console.log('Failed because: ' + message);
        }
    },
    uploadFile: function uploadFile(elm, callback) {
        var self = this;
//        var self = elm.parent;
//        var archivo = $(elm).val();
//        if (!nw.evalueData(archivo)) {
//            return false;
//        }

        nw.loading({text: "Por favor espere...", textVisible: true, html: "", theme: "b"});
        console.log(elm);
        var file = elm.files[0];
        var name_file = file.name;
//        if (!nw.evalueData(fileName)) {
//            name_file = fileName;
//        }
//        var name = $(elm).attr("name");
//        $(elm).attr("data-file", name_file);
        var data = new FormData();

//        console.log("name", name);
//        console.log("file", file);
//        console.log("elm", elm);
//        console.log("archivo", archivo);
//        console.log("data", data);
//        console.log("name_file", name_file);

        uploadToPHPServer(function (response, fileDownloadURL) {
            if (response !== 'ended') {
                console.log("upload progress", response);
                return;
            }
//            document.body('header').innerHTML = '<a href="' + fileDownloadURL + '" target="_blank">' + fileDownloadURL + '</a>';
            console.log('Successfully uploaded recorded blob. fileDownloadURL:', fileDownloadURL);
//            nw.dialog('Successfully uploaded recorded blob. fileDownloadURL:' + fileDownloadURL);
            elm.ui.setValue(fileDownloadURL);
            nw.loadingRemove();
            if (typeof callback !== "undefined") {
                callback();
            }
            // preview uploaded file
//            document.getElementById('your-video-id').srcObject = null;
//            document.getElementById('your-video-id').src = fileDownloadURL;
            // open uploaded file in a new tab
//            window.open(fileDownloadURL);
        });
        function uploadToPHPServer(callback) {
            var nameFile = getFileName(name_file);
            var formData = new FormData();
//            formData.append('video-filename', name_file);
            formData.append('video-filename', nameFile);
            formData.append('video-blob', file);

            callback('Uploading recorded-file to server.');
            var upload_url = mainNW.domain_rpc + "/nwlib6/uploader_app.php";
            var upload_directory = "/imagenes/";
            makeXMLHttpRequest(upload_url, formData, function (progress) {
                if (progress !== 'upload-ended') {
                    callback(progress);
                    return;
                }
                var initialURL = upload_directory + nameFile;
                callback('ended', initialURL);
            });
        }

        function makeXMLHttpRequest(url, data, callback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    if (request.responseText === 'success') {
                        callback('upload-ended');
                        return;
                    }
                    alert(request.responseText);
                    return;
                }
            };
            request.upload.onloadstart = function () {
                callback('PHP upload started...');
            };
            request.upload.onprogress = function (event) {
                callback('PHP upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
            };
            request.upload.onload = function () {
                callback('progress-about-to-end');
            };
            request.upload.onload = function () {
                callback('PHP upload ended. Getting file URL.');
            };
            request.upload.onerror = function (error) {
                nw.loadingRemove();
                callback('PHP upload failed.', error);
            };
            request.upload.onabort = function (error) {
                nw.loadingRemove();
                callback('PHP upload aborted.', error);
            };
            request.open('POST', url, true);
            request.send(data);
        }

        function getFileName(fileExtension) {
            var d = new Date();
            var year = d.getUTCFullYear();
            var month = d.getUTCMonth();
            var date = d.getUTCDate();
            var seconds = d.getSeconds();
            var minutes = d.getMinutes();
            var hour = d.getHours();
//            var name = year + month + date + '-' + getRandomString() + '.' + fileExtension;
//            var name = year + '_' + month + '_' + date + '__' + hour + '_' + minutes + '_' + seconds + '__' + fileExtension;
            var name = year + '_' + month + '_' + date + '__' + hour + '_' + minutes + '_' + seconds + '__' + getRandomString() + self.getExtensionFile(fileExtension);
            return name;
        }

        function getRandomString() {
            if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
                var a = window.crypto.getRandomValues(new Uint32Array(3)),
                        token = '';
                for (var i = 0, l = a.length; i < l; i++) {
                    token += a[i].toString(36);
                }
                return token;
            } else {
                return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
            }
        }





        return;
        data.append("name", name);
//        data.append("name", archivo);
//        data.append("name", name_file);
        data.append("archivo", archivo);
        data.append("name_file", name);
        data.append("uploadfile", "uploader_" + name);
//        data.append("name_file", name_file);
//        data.append("uploadfile", "uploader_" + name_file);
        data.append("rename_random", "rename_random");

        console.log("file", file);
        console.log("elm", elm);
        console.log("archivo", archivo);
        console.log("data", data);
        console.log("name_file", name_file);
        elm.ui.setValue(name_file);

//        document.querySelector(".img_preview_uploader_" + name).style.backgroundImage = "url(" + archivo + ")";
        $.ajax({
//            url: mainNW.domain_rpc + "/nwlib6/uploader.php",
            url: mainNW.domain_rpc + "/nwlib6/uploader_app.php",
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
            },
            success: function (data) {
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            }
        });
//        var func = function (rta) {
//            var lbl = $(elm).prev();
//            if (rta == "no_valid") {
//                $(elm).attr("nw_data", "no_valid");
//                information_dialog("archivo_no_valido");
//                lbl.html("+ Seleccionar archivo");
//                $(elm).replaceWith(elm = $(elm).clone(true));
//                return;
//            } else if (rta == "file_size_exceed") {
//                $(elm).attr("nw_data", "no_valid");
//                information_dialog("archivo_supera_tamano");
//                lbl.html("+ Seleccionar archivo");
//                $(elm).replaceWith(elm = $(elm).clone(true));
//                return;
//            } else if (rta == "") {
//                $(elm).attr("nw_data", "no_valid");
//                lbl.html("+ Seleccionar archivo");
//                $(elm).replaceWith(elm = $(elm).clone(true));
//                return;
//            }
//            $(elm).attr("nw_data", "valid");
//            lbl.html(rta);
//            $(elm).data("nwuploaderfile", rta.replace('C:\fakepath\\'));
//            $(elm).attr("nwuploaderfile", rta.replace('C:\fakepath\\'));
//            if (typeof callback != 'undefined') {
//                callback();
//            }
//        };
//        var rpc = new nw.rpc(mainNW.domain_rpc + "/nwlib6/uploader.php", "nwMaker");
//        var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
//        rpc.setAsync(true);
//        var func = function (r) {
//            nw.console.log(r);
//            console.log(r);
//        };
//        rpc.exec("uploadFile", data, func);
//        nw.nw_ajax(mainNW.domain_rpc + "/nwlib6/uploader.php", data, func, true, false, true);

    },
    openLink: function (url, target, optionsPopUp) {
        if (typeof target === "undefined") {
            target = "_self";
        }
        if (target === "blank") {
            target = "_blank";
        }
        if (target === "self") {
            target = "_self";
        }
        var popup = "";
        if (target === "popup") {
            if (!evalueData(optionsPopUp)) {
                optionsPopUp = "top=0,left=0,width=800,height=800";
            }
            popup = "toolbar=yes,scrollbars=yes,resizable=yes," + optionsPopUp;
        }
        window.open(url, target, popup);
    },
    userPolicies: {
        getUserData: function () {
            return localStorage;
        }
    },
    setUserInfo: function (df, callback) {
        window.localStorage.setItem("initSession", "true");
        $.each(df, function (key, value) {
            var val = value;
            if (typeof value === "object") {
                val = JSON.stringify(value);
            }
            window.localStorage.setItem(key, val);
        });
        if (nw.evalueData(callback)) {
            callback();
        }
    },
    searchUpdatesApp: function (mode, callback) {
        console.log("Init search updates app");
//        nw.console.log("Init search updates app");
        var dialog = true;
        if (mode !== true) {
            var c = new nw.newPage();
            c.id = "searchUpdatesApp";
            c.title = "Actualizar app";
            c.html = "<div class='textbuscaupdateapp'><h3>Buscando actualizaciones... Por favor espere.</h3><div>";
            c.create();
            c.show();
            dialog = false;
        }
        var up = nw.userPolicies.getUserData();
        var os = nw.getMobileOperatingSystem();
        var data = {};
        data.os = os;
        data.empresa = up.empresa;
        data.perfil = up.perfil;
        var hoy = nw.getActualDate();
        var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
        rpc.setAsync(true);
        rpc.setLoading(true);
        var func = function (r) {
            var fecha_version = r.fecha;
            console.log("Data new version: ", r);
            console.log("fecha_version", fecha_version);
            console.log("hoy", hoy);
            var getUpdate = false;
            var textFound = "No tiene actualizaciones";
            var icon = "";
            var url = "";
            var os = nw.getMobileOperatingSystem();
            if (os === "ANDROID") {
                url = config.url_play_store;
            } else
            if (os === "IOS") {
                url = config.url_app_store;
            }
            window.localStorage.setItem("fecha_last_pregunta_update", hoy);
            if (r === false && nw.evalueData(config.requiredUpdateLastVersion)) {
                if (typeof callback !== "undefined") {
                    callback(true);
                }
            } else
            if (r !== false) {
                window.localStorage.setItem("fecha_version", fecha_version);
                if (fecha_version <= hoy) {
                    var versionNew = parseInt(r.version.replace(/\./gi, ''));
                    var versionAppActual = parseInt(config.version.replace(/\./gi, ''));
                    if (versionNew > versionAppActual) {
                        textFound = "Nueva actualización disponible";
                        getUpdate = true;
                        icon = "material-icons offline_pin normal";
                        if (dialog === true) {
                            var aceptar = function () {
                                nw.openLink(url, "blank");
                                window.location.reload();
                                return false;
                            };
                            var cancelar = function () {
                                window.location.reload();
                                return true;
                            };
                            var options = {
                                textAccept: "Actualizar",
                                textCancel: "Omitir"
                            };
                            var msg = "Hay una nueva versión de la aplicación. Recomendamos actualizarla. Ingrese a la tienda de aplicaciones y actualice.";
                            if (nw.evalueData(config.requiredUpdateLastVersion)) {
                                cancelar = false;
                                msg = "Hay una nueva versión de la aplicación, debe actualizarla para continuar";
                            }
                            nw.dialog(msg, aceptar, cancelar, options);
                        } else {
                            if (typeof callback !== "undefined") {
                                callback(true);
                            }
                        }
                    } else {
                        if (typeof callback !== "undefined") {
                            callback(true);
                        }
                    }
                } else {
                    if (typeof callback !== "undefined") {
                        callback(true);
                    }
                }
            } else {
                if (typeof callback !== "undefined") {
                    callback(true);
                }
            }
            if (dialog === false) {
                var fa = new nw.forms();
                fa.canvas = "#" + c.id;
                var fields = [
                    {
                        icon: icon,
                        name: "encontrada",
                        label: textFound,
                        type: "label"
                    }
                ];
                fa.setFields(fields);
                fa.buttons = [];
                if (getUpdate) {
                    fa.buttons.push({
                        style: "text-shadow: none;font-weight: lighter;border: 0;",
                        className: "btn_maxwidth",
                        name: "aceptar",
                        label: "Obtener la versión " + r.version.toString(),
                        callback: function () {
                            nw.openLink(url, "blank");
                        }
                    });
                }
                fa.show();
                fa.addHeaderNote("<style>.textbuscaupdateapp{display:none;}</style>");
            }
        };
        rpc.exec("getCurrentVersion", data, func);
    },
    testing: function () {
        if (config.testing === true || config.testing === "true" || config.testing == true || config.testing === "SI" || config.testing === "YES" || config.testing === "si" || config.testing === "t") {
            return true;
        }
        return false;
    },
    getGeoLocation: function (callback) {
        nw.loadJs("nwmaker/nwmaker-geolocation.js", function () {
            nwgeo.initialize(callback);
        });
    },
    getMobileOperatingSystem: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "WINDOWS_PHONE";
        }
        if (/android/i.test(userAgent)) {
            return "ANDROID";
        }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "IOS";
        }
        return "NONE";
    },
    closeConnection: function () {
        nw.openConnection(false);
        $(".msgConnecStatus").remove();
//        $(".ui-loader").remove();
    },
    openConnection: function (mode) {
        if (typeof mode !== "undefined")
            nw.initConnectionRPC = mode;
        return nw.initConnectionRPC;
    },
    initConnectionRPC: false,
    validateBtnMaterialIcons: function (icon) {
        if (!nw.evalueData(icon)) {
            return false;
        }
        if (icon.indexOf("material-icons ") === -1) {
            return false;
        }
        return true;
    },
    getBtnMaterialIcons: function (icon) {
//         icono size color agregaclase
        if (!nw.validateBtnMaterialIcons(icon)) {
            return false;
        }
        var img = icon.split(" ")[1];
        var size = "";
        if (typeof icon.split(" ")[2] !== "undefined") {
            size = icon.split(" ")[2];
        }
        var style = ' style="';
        if (typeof icon.split(" ")[3] !== "undefined") {
            if (icon.split(" ")[3] !== "false") {
                style += "color:" + icon.split(" ")[3] + ";";
            }
        }
        style += '" ';
        var addClass = "";
        if (typeof icon.split(" ")[4] !== "undefined") {
            addClass = icon.split(" ")[4];
        }
        return '<i class="material-icons ' + size + ' ' + addClass + '" ' + style + '>' + img + '</i>';
    },
    createButton: function (array) {
        var id = "";
        var name = "";
        var text = "";
        var type = "button";
        var position = "center";
        var classN = "btnExec btnForm ";
        if (nw.evalueData(array.getHTML)) {
            if (array.getHTML === true) {
                classN = " btnForm ";
            }
        }
        var icon = "";
        var href = "#";
        var callback = false;
        var data = false;
        if (nw.evalueData(array.position)) {
            position = array.position;
        }
        if (position === "center") {
            classN += " ui-shadow ui-btn ui-corner-all ui-btn-inline Btn";
        } else
        if (position === "header") {
            classN += "ui-btn ui-btn-up-a ui-shadow ui-btn-corner-all";
        } else
        if (position === "header_left") {
            classN += "ui-btn ui-btn-up-a ui-shadow ui-btn-corner-all ui-btn-left";
        } else
        if (position === "header_right") {
            classN += "ui-btn ui-btn-up-a ui-shadow ui-btn-corner-all ui-btn-right ";
        } else
        if (position === "header_right_nav_enc") {
            classN += "ui-btn ui-btn-up-a ui-btn-inline";
        }
        if (nw.evalueData(array.icon)) {
            icon = array.icon;
            if (position === "header_left") {
                classN += " ui_btn_icon_left";
            } else
            if (position === "header_right") {
                classN += " ui_btn_icon_right";
            } else {
                classN += " ui_btn_icon_left";
            }
        }
        if (nw.evalueData(array.className)) {
            classN += " " + array.className;
        }

        if (nw.evalueData(array.text)) {
            text = array.text;
        }
        if (nw.evalueData(array.type)) {
            type = array.type;
        }
        if (nw.evalueData(array.callback)) {
            callback = array.callback;
        }
        if (nw.evalueData(array.data)) {
            data = array.data;
        }
        if (nw.evalueData(array.name)) {
            name = array.name;
        }
        if (nw.evalueData(array.id)) {
            id = array.id;
        }
        if (position === "header_right_nav_enc") {
            text = "<span class='ui-btn-inner'>" + text + "</span>";
        }
        if (text === "" || text === false || text === null) {
            classN += " ui_btn_icon_vacio";
        }
        var style = "";
        if (nw.evalueData(array.style)) {
            style = array.style;
        }
        style = style.replace("style='", "");
        style = style.replace("'", "");
        var btn = "";
        if (nw.evalueData(icon) && style.indexOf("background-image") === -1) {
            var colorBtnBackIOS = "#000000";
            if (nw.evalueData(array.colorBtnBackIOS)) {
                colorBtnBackIOS = array.colorBtnBackIOS;
            }
            if (nw.validateBtnMaterialIcons(icon) !== false) {
                btn = nw.getBtnMaterialIcons(icon + " " + colorBtnBackIOS);
            } else
            if (icon.indexOf("material-icons") !== -1) {
                btn = icon;
            } else
            if (icon.indexOf(".svg") !== -1) {
                btn = "<span class='iconButton' style='-webkit-mask: url(" + icon + ") no-repeat 50% 50%;mask: url(" + icon + ") no-repeat 50% 50%;background-color:" + colorBtnBackIOS + ";-webkit-mask-size: cover;mask-size: cover;'></span>";
            } else {
                style += "background-image: url(" + icon + ");";
            }
        }
        var returnOnlyHTML = false;
        if (nw.evalueData(array.getHTML)) {
            if (array.getHTML === true) {
                returnOnlyHTML = true;
            }
        }
        var div = document.createElement(type);
        div.href = href;
        div.className = classN;
        div.innerHTML = btn + text;
        div.callback = callback;
        div.data = data;
        div.name = name;
        if (nw.evalueData(style)) {
            div.style = style;
        }
        if (returnOnlyHTML === false) {
            if (nw.evalueData(array.addAttributes)) {
                for (var i = 0; i < array.addAttributes.length; i++) {
                    var name = array.addAttributes[i].name;
                    var value = array.addAttributes[i].value;
                    div[name] = value;
                }
            }
        }
        div.id = id;
        if (returnOnlyHTML === true) {
            var rta = div.outerHTML;
            var addAttr = "";
            if (nw.evalueData(array.addAttributes)) {
                for (var i = 0; i < array.addAttributes.length; i++) {
                    var name = array.addAttributes[i].name;
                    var value = array.addAttributes[i].value;
                    addAttr += " data-" + name + "='" + value + "' ";
                }
            }
            rta = rta.replace("<button", "<button " + addAttr);
            return rta;
        }
        return div;
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
    require: function (url, callBack) {
        return nw.loadJs(url, callBack);
    },
    loadJs: function (url, callBack) {
        try {
            var async = true;
            var id = url.replace(/\//gi, "");
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
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.id = id;
            script.className = id;
            script.charset = "UTF-8";
            script.async = "async";
            script.src = url;
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
            console.log(e);
            nw.console.log(e);
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
    strip_tags: function (str) {
        if (!nw.evalueData(str)) {
            return false;
        }
        str = str.toString();
        return str.replace(/<\/?[^>]+>/gi, '');
    },
    back: function () {
        history.back();
    },
    toDatetimeLocal: function (date) {
        if (typeof date === "string") {
            var d = date.substring(0, 16);
            d = d.replace(' ', 'T');
        } else {
            var d = new Date(date).toDatetimeLocal();
        }
        return d;
    },
    loadingRemove: function (options) {
        if (!nw.evalueData(options)) {
            options = {};
        }
//        if (typeof window.plugins !== "undefined") {
//            if (typeof window.plugins.spinnerDialog !== "undefined") {
//                window.plugins.spinnerDialog.hide();
//            }
//        }
        if (typeof options.container === "undefined") {
            options.container = "body";
        }
//        if (typeof options.container !== "undefined") {
        if (typeof options.container === "string") {
//            $(options.container).find(".ui-loader").remove();
            $(options.container).find(".loadingNwChat").remove();
        } else {
//            options.container.find(".ui-loader").remove();
            options.container.find(".loadingNwChat").remove();
        }
        $(".loadingNwChat").remove();
//        }
//        $.mobile.loading("hide");
    },
    loading: function (options) {
        if (!nw.evalueData(options)) {
            options = {};
        }
        if (typeof options.text === "undefined") {
            options.text = null;
        }
        if (typeof options.textVisible === "undefined") {
            options.textVisible = true;
        }
        if (typeof options.theme === "undefined") {
            options.theme = mainNW.theme;
        }
        if (typeof options.html === "undefined") {
            options.html = "";
        }
//        if (typeof window.plugins !== "undefined" && typeof options.container === "undefined") {
//            if (typeof window.plugins.spinnerDialog !== "undefined") {
//                var textloading = null;
//                var title = null;
//                if (nw.evalueData(options.html)) {
//                    textloading = options.html;
//                }
//                if (nw.evalueData(options.text)) {
//                    textloading = options.text;
//                }
//                if (nw.evalueData(options.title)) {
//                    title = options.title;
//                }
//                var message = textloading;
//                var cancelCallback = true;
//                window.plugins.spinnerDialog.show(title, message, cancelCallback);
//                return true;
//            }
//        }
        if (typeof options.container === "undefined") {
            options.container = "body";
        }
        var classCenter = "loadingNwChat_onlyicon";
        var classIcon = "";
        if (nw.evalueData(options.text) || nw.evalueData(options.title)) {
            classCenter = "";
        }
        if (nw.evalueData(options.text)) {
            classIcon = "cEftVf_wtext";
        }
//        if (typeof options.container !== "undefined") {
//            var html = '<div class="loaderNw ui-loader ui-corner-all ui-body-' + options.theme + ' ui-loader-verbose"><span class="ui-icon-loading"></span><h1></h1></div>';
        var html = '<div id="loadingNwChat" class="loadingNwChat">';
        html += '<div class="loadingCenter ' + classCenter + '">';
        if (nw.evalueData(options.title)) {
            html += '<div class="titleLoading">' + options.title + '</div>';
        }
        html += '<div class="loadingCenterTextIcon">';
        html += '<div class="cEftVf ' + classIcon + '"></div>';
        if (nw.evalueData(options.text)) {
            html += '<div class="textLoading">' + options.text + '</div>';
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
        if (typeof options.append !== "undefined") {
            if (options.append === "after") {
                $(options.container).after(html);
            } else
            if (options.append === "before") {
                $(options.container).after(html);
            } else
            if (options.append === "prepend") {
                $(options.container).after(html);
            } else {
                $(options.container).append(html);
            }
        } else {
            $(options.container).append(html);
        }
//        }
//        else {
//            $.mobile.loading('show', {
//                text: options.text,
//                textVisible: options.textVisible,
//                theme: options.theme,
//                html: options.html
//            });
//        }
//        if (typeof options.css !== "undefined") {
//            $(".ui-loader").attr("style", options.css);
//        }
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
        var device = navigator.userAgent;
        if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
        {
            return true;
        }
        return false;
    },
    console_log: function (event, add, type) {
        nw.consoleEvent(event, add, type);
    },
    consoleLog: function (event, add, type) {
        nw.consoleEvent(event, add, type);
    },
    consolelog: function (event, add, type) {
        nw.consoleEvent(event, add, type);
    },
    console: {
        log: function (event, add, type) {
            nw.consoleEvent(event, add, type);
        }
    },
    consoleEvent: function (event, add, type) {
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
        var showcon = true;
        if (showcon) {
            if (nw.evalueData(add)) {
                console.log(event, add);
            } else {
//                console.log(event);
            }
        }
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
        if (showConsoleDeveloper === true || showConsoleDeveloper === "true") {
            $(".consoleEventsNw").append("<br />" + e);
        }
        $(".consoleEventsNw").scrollTop(100000000000);
    },
    home: function () {
        nw.loadHome();
    },
    loadHome: function () {
        nw.changePage("");
        nw.consoleEvent("load home", false, "controls");
        setTimeout(function () {
            nw.cleanAllWindow();
        }, 300);
    },
    changePage: function (id, options) {
        $.mobile.changePage(id, options);
    },
    cleanAllWindow: function () {
        $(".pageNew").remove();
    },
    onNavigateActive: function () {
        $(window).on("navigate", function (event, data) {
            var dir = data.state.direction;
//        console.log(data.state.info);
//        console.log(data.state.url);
//        console.log(data.state.hash);
            nw.consoleEvent("navigate direction", dir, "controls");
            if (questionExit === true) {
                nw.closeApp();
                return false;
            }
            nw.closeConnection();
            if (dir === "back") {
                console.log("Back page");
                nw.loadingRemove();
            }
//            if (dir === "back") {
            var p = $(".ui-page");
            nw.console.log("Total pages", p.length);
            if (typeof p.length !== "undefined") {
                if (p.length <= 2) {
                    nw.loadHome();
                    nw.console.log("Clear all pages, load home");
                    if (inhome === true) {
                        nw.dialogExit();
                        return false;
                    }
                    return false;
                }
            }
            setTimeout(function () {
                $(".ui-page").last().remove();
            }, 500);
//            }
        });
    },
    actionNavigate: function () {
        $(document).on("pagechangefailed", function (e, data) {
            nw.console.log("pagechangefailed", data);
        });
        $(document).on("pagechange", function (e, data) {
//            nw.consoleEvent("pagechange", false, "controls");
            nw.consoleEvent("Page active: " + $.mobile.navigate.history.getActive().url, false, "controls");
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
        nw.popupSimple("No es posible cerrar la aplicación. El dispositivo no está listo.");
        questionExit = false;
    },
    appendLinkMenu: function (di, parent) {
        if (nw.evalueData(parent)) {
            $(parent + " .containerCenterHomeUl").append(di);
        } else {
            $(".containerCenterHomeUl").append(di);
        }
    },
    containerLinksMenu: function () {
        var ah = "";
        ah += "<div class='containerCenterHome' data-role='navbar' data-iconpos='right'>";
        ah += "<ul data-role='listview' class='containerCenterHomeUl ui-listview ui-listview-inset ui-corner-all ui-shadow'>";
        ah += "</ul>";
        ah += "</div>";
        return ah;
    },
    generateLink: function (name, callback, mode, number, description, icon, style, addClass) {
        var classl = "nav_center_left ui-li-has-thumb";
        if (mode === "left") {
            classl = "nav_left";
        }
        if (style === "lists_simple") {
            classl += " nav_simple ";
        }
        if (style === "bloq") {
            classl += " nav_bloq ";
        }
        if (!nw.evalueData(callback)) {
            classl += " nav_off_callback";
        }
        if (nw.evalueData(addClass)) {
            classl += " " + addClass;
        }
        var ht = "";
        if (mode === "center") {
            ht = '<a href="#" class="alinknavcenter ui-btn ui-btn-icon-right ui-icon-carat-r">';
            if (nw.evalueData(icon)) {
                var iconim = '<div class="alinknavcenter_img" style="background-image: url(' + icon + ');" ></div>';
                icon += " alinknavcenter_img";
                var iconmat = nw.getBtnMaterialIcons(icon);
                if (iconmat !== false) {
                    iconim = iconmat;
                }
                ht += iconim;
            }
            ht += '<h2>' + name + '</h2>';
            if (nw.evalueData(description)) {
                ht += '<p>' + description + '</p>';
            }
            ht += '</a>';
        } else {
            var iconim = "<span class='iconlinksNavLeft' style='background-image: url(" + icon + ");'></span>";
            icon += " iconlinksNavLeft";
            var iconmat = nw.getBtnMaterialIcons(icon);
            if (iconmat !== false) {
                iconim = iconmat;
            }
            ht = "<div class='liNavInt'>" + iconim + "<span class='textlinksNavLeft'>" + name + "</span></div>";
        }
        var di = document.createElement("li");
        di.className = "btnExec linksNavLeft linksNavLeft_" + number + " " + classl;
        di.innerHTML = ht;
        di.callback = callback;
//        di.onclick = function () {
//            callback();
//        };
        return di;
    },
    setValSpanSel: function (self) {
        var parent = $(self).attr('data-parent');
        var name = $(self).attr('name');
        var text = $(self).find('option:selected').text();
        $(parent + " .spanTextShow_" + name + "").text(text);
    },
    createRandomId: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    scrollPage: function (p, vel, toped, divScroll) {
        if (!nw.evalueData(vel)) {
            vel = 2000;
        }
        if (!nw.evalueData(toped)) {
            toped = 100;
        }
        var pos = $(p).offset();
        if (!nw.evalueData(pos)) {
            return;
        }
        var topp = parseInt(pos.top) - parseInt(toped);
        var divMoveScroll = "html, body";
        if (nw.evalueData(divScroll)) {
            divMoveScroll = divScroll;
        }
        $(divMoveScroll).animate({
            scrollTop: topp
        }, parseInt(vel));
    },
    createFields: function (div_dest, filters, html_add_start, html_add_end, columnsForm, parent) {
        var html = "";
        if (typeof html_add_start != 'undefined') {
            if (html_add_start != '') {
                html += html_add_start;
            }
        }
        var div_dest_old = div_dest.replace("#", "");
        div_dest_old = div_dest_old.replace(".", "");

        if (typeof columnsForm == 'undefined') {
            columnsForm = 1;
        }

        var rounds = 1;

        html += "<div id='form_" + div_dest_old + "' class='nw_main_form_div' >";

        if (columnsForm > 1) {
            rounds = Math.round(filters.length / columnsForm);
        }

        var haveCkeditor = [];

        for (var i = 0; i < filters.length; i++) {
            var input = "";
            if (columnsForm > 1) {
                if (i == 0) {
                }
                if (i == rounds) {
                }
            }
            var v = filters[i];
            var required = typeof v.required == 'undefined' ? "" : v.required;
            if (required == true) {
                required = " required ";
            }
            var enabled = true;
            if (typeof v.enabled != 'undefined') {
                enabled = v.enabled;
            }
            if (enabled == false) {
                enabled = "disabled readonly";
            } else
            if (enabled == true) {
                enabled = "";
            }

            var divStyleContainer = "style='";
            var divStyle = "style='";
            if (typeof v.style != 'undefined') {
                divStyle += " " + v.style + " ";
            }
            if (typeof v.styleContainer != 'undefined') {
                divStyleContainer += " " + v.styleContainer + " ";
            }
            var minlength = "";
            if (typeof v.car_min !== 'undefined') {
                minlength = " minlength='" + v.car_min + "'";
            }
            var maxlength = "";
            if (typeof v.car_max !== 'undefined') {
                maxlength = " maxlength='" + v.car_max + "'";
            }
            var visibleLabel = "";
            var classVisibleLabel = "";
            if (typeof v.visible != 'undefined' && v.visible == false) {
                divStyle += "display: none;";
                divStyleContainer += "display: none;";
                visibleLabel = " style='display: none;' ";
            }
            if (typeof v.visible_label != 'undefined' && v.visible_label == false) {
                visibleLabel = " style='display: none!important;' ";
                classVisibleLabel = "label_hidden";
            }
            divStyle += "'";
            divStyleContainer += "'";

            if (v.type != "startGroup" && v.type != "endGroup") {
                input += "<div " + divStyleContainer + " class='nw_widget_div nw_widget_div_" + v.name + "'>";
            }
            v.labelClean = v.label;
            var className = "";
            if (typeof v.className != 'undefined') {
                className = v.className;
            }
            var placeholder = "";
            if (typeof v.placeholder != 'undefined') {
                placeholder = " placeholder='" + v.placeholder + "' ";
            }
            var classInIcon = "";
            var elinicon = "";
            if (nw.evalueData(v.icon)) {
                classInIcon = " modeiconField";
                elinicon = "<div class='elinicon' style='background-image: url(" + v.icon + ");'></div>";
                if (nw.validateBtnMaterialIcons(v.icon) !== false) {
                    elinicon = nw.getBtnMaterialIcons(v.icon + " false elinicon");
                }
            }
            var typeOriginal = ' data-type="' + v.type + '" ';
            var modeOriginal = ' data-mode="' + v.mode + '" ';

            if (v.mode === "camera" || v.mode === "files" || v.mode === "camera_files") {
                if (typeof navigator.camera === "undefined") {
                    v.type = "uploader_frame";
                }
            }

            switch (v.type) {
                case "startGroup":
//                    input += "<fieldset " + divStyle + " class='nw_form_start_group " + v.name + "' id='nw_form_start_group_" + div_dest_old + "_" + i + "'>";
                    if (v.mode === "div") {
                        input += "<div " + divStyle + " class='nw_form_start_group " + v.name + "' id='" + v.name + "'>";
                    } else {
                        input += "<fieldset " + divStyle + " class='nw_form_start_group " + v.name + "' id='" + v.name + "'>";
                    }
                    if (typeof v.label != 'undefined') {
                        if (v.label != '<b>undefined</b>') {
                            if (v.label != '<b></b>') {
                                if (v.label != '') {
                                    input += "<div><span class='titleStartGroup'>" + v.label + "</span></div><div class='containIntStartGroup'>";
                                }
                            }
                        }
                    }
                    break;
                case "endGroup":
                    if (v.mode === "div") {
                        input += "</div></div>";
                    } else {
                        input += "</div></fieldset>";
                    }
                    break;
                case "uploader":
                    var typeFile = "";
                    if (v.mode == "takePhoto") {
                        typeFile = ' accept="image/*" capture="camera" ';
                    } else
                    if (v.mode == "images") {
                        typeFile = ' accept="image/*" ';
                    }
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="nw_uploader_div_cover ' + classInIcon + '" >';
                    input += '<label class="nw_uploader_label" style="display: none" >+ Seleccionar archivo</label>';
                    if (enabled === "disabled readonly") {
                        divStyle = "style='display:none;'";
                    }
                    input += '<input ' + typeOriginal + ' ' + divStyle + ' type="file" id="' + v.name + '" ' + enabled + ' name="' + v.name + '" ' + typeFile;
                    input += 'class="nw_uploader text nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += className;
                    input += " ";
                    input += ' "';
                    input += required;
                    input += " ";
                    input += placeholder;
                    input += '/ >';
                    input += '</div>';
                    break;
                case "uploader_frame":
                    var val = "";
                    if (nw.evalueData(v.data)) {
                        val = "&data=" + v.data;
                    }
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ' + classInIcon + ' ">';
                    input += '<input ' + typeOriginal + ' ' + divStyle + ' type="hidden" id="' + v.name + '" name="' + v.name + '" ' + enabled + ' data-clear-btn="true" ';
                    input += 'class="text nw_textField nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += " ";
                    input += className;
                    input += " ";
                    input += ' "';
                    input += required;
                    input += " ";
                    input += placeholder;
                    input += '/ >';
                    input += '<iframe class="iframe_uploader iframe_uploader_' + v.name + '" src="' + config.domain_rpc + '/nwlib6/nwproject/modules/uploader/index.php?nameInput=' + v.name + val + '"></iframe></div>';
                    break;
                case "html":
                    input += elinicon;
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all containerLabel ' + classInIcon + '">';
                    input += '<label class="nw_label nw_widgets ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div ' + typeOriginal + ' ' + divStyle + ' type="html" id="' + v.name + '" name="' + v.name + '" ' + enabled + ' data-clear-btn="true" ';
                    input += 'class="text nwlabel_input nw_html nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += addClass;
                    input += " ";
                    input += className;
                    input += " ";
                    input += alterClass;
                    input += ' "';
                    input += " ";
                    input += required;
                    input += placeholder;
                    input += ' " value="' + v.labelClean + '" ';
                    input += '></div>';
                    input += '</div>';
                    break;
                case "label":
                    input += elinicon;
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all containerLabel ' + classInIcon + '">';
                    input += '<label class="nw_label nw_widgets ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<input readonly="readonly" ' + typeOriginal + ' ' + divStyle + ' type="textField" id="' + v.name + '" name="' + v.name + '" ' + enabled + ' data-clear-btn="true" ';
                    input += 'class="text nwlabel_input nw_textField nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += addClass;
                    input += " ";
                    input += className;
                    input += " ";
                    input += alterClass;
                    input += ' "';
                    input += " ";
                    input += required;
                    input += placeholder;
                    input += ' " value="' + v.labelClean + '" ';
                    input += '/ >';
                    input += '</div>';
                    break;
                case "switch":
                    input += elinicon;
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all containerLabel ' + classInIcon + '">';
                    input += '<label class="nw_label nw_widgets ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += "<select " + required + " " + placeholder + " " + typeOriginal + " " + divStyle + " id='" + v.name + "' name='" + v.name + "' " + enabled + " class='selectSwitch " + v.name + " " + addClass + " " + alterClass + " " + className + "' data-role='slider'>" + v.options + "</select>";
                    input += '</div>';
                    break;
                case "search":
                    var addClass = " ";
                    var alterClass = "";
                    if (typeof v.alterClass != 'undefined') {
                        alterClass = v.alterClass;
                    }
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ' + classInIcon + '">';
                    input += '<input ' + typeOriginal + ' ' + divStyle + ' type="search" id="' + v.name + '" name="' + v.name + '" ' + enabled + ' data-clear-btn="true" ';
                    input += 'class="text nw_textField nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += addClass;
                    input += " ";
                    input += className;
                    input += " ";
                    input += alterClass;
                    input += ' "';
                    input += " ";
                    input += required;
                    input += placeholder;
                    input += ' "';
                    input += '/ >';
                    input += '</div>';
                    break;
                case "textField":
                    var addClass = " ";
                    var type = "textField";
                    if (typeof v.mode != 'undefined') {
                        if (v.mode == "line") {
                            addClass = " line ";
                        }
                        if (v.mode == "password") {
                            type = "password";
                        }
                        if (v.mode == "money") {
                            addClass = " setMoney";
                        }
                    }
                    var alterClass = "";
                    if (typeof v.alterClass != 'undefined') {
                        alterClass = v.alterClass;
                    }
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ' + classInIcon + ' ">';
                    input += '<input   ' + minlength + ' ' + maxlength + ' ' + typeOriginal + ' ' + divStyle + ' type="' + type + '" id="' + v.name + '" name="' + v.name + '" ' + enabled + ' data-clear-btn="true" ';
                    input += 'class="text nw_textField nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += addClass;
                    input += " ";
                    input += className;
                    input += " ";
                    input += alterClass;
                    input += ' "';
                    input += required;
                    input += " ";
                    input += placeholder;
                    input += '/ >';
                    input += '</div>';
                    break;
                case "numeric":
                    var addClass = " ";
                    if (typeof v.mode != 'undefined') {
                        if (v.mode == "line") {
                            addClass = " line ";
                        }
                    }
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ' + classInIcon + '">';
                    input += '<input ' + minlength + ' ' + maxlength + ' ' + typeOriginal + ' min=0 ' + enabled + ' ' + divStyle + ' type="number" id="' + v.name + '" name="' + v.name + '" ';
                    input += 'class="text nw_textField nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += addClass;
                    input += " ";
                    input += className;
                    input += ' "';
                    input += placeholder;
                    input += " ";
                    input += required;
                    input += '/ >';
                    input += '</div>';
                    break;
                case "dateField":
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '"  ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-insetV ' + classInIcon + '">';
                    input += '<input ' + typeOriginal + ' ' + divStyle + ' type="text" ' + enabled + ' id="' + v.name + '" name="' + v.name + '" ';
//                    input += '<input ' + typeOriginal + ' ' + divStyle + ' type="date" ' + enabled + ' id="' + v.name + '" name="' + v.name + '" ';
                    input += 'class="nw_dateField nw_widgets dateField_input ';
                    input += v.name;
                    input += " ";
                    input += className;
                    input += ' "';
                    input += placeholder;
                    input += required;
                    input += '/ ></div>';
                    break;
                case "time":
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '"  ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ' + classInIcon + '">';
                    input += '<input ' + typeOriginal + ' ' + divStyle + ' type="time" ' + enabled + ' id="' + v.name + '" name="' + v.name + '" ';
                    input += 'class="nw_dateField nw_widgets time_input ';
                    input += v.name;
                    input += " ";
                    input += className;
                    input += ' "';
                    input += placeholder;
                    input += required;
                    input += '/ ></div>';
                    break;
                case "dateTime":
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '"  ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ' + classInIcon + '">';
                    input += '<input ' + typeOriginal + '  type="text" ' + enabled + ' id="' + v.name + '" name="' + v.name + '" ' + divStyle + ' ';
                    input += 'class="nw_dateField nw_widgets dateTimeLocal ';
                    input += v.name;
                    input += " ";
                    input += className;
                    input += ' "';
                    input += placeholder;
                    input += required;
                    input += '/ ></div>';
                    break;
                case "selectBox":
                    var multi = "";
                    var multiData = "";
                    if (typeof v.mode != "undefined") {
                        if (v.mode == "multi" || v.mode == "multiple") {
                            multi = 'multiple ';
                            multiData = ' data-nwmultiple="true" ';
                        }
                    }

                    if (enabled == false) {
                        enabled = " disabled ";
                    } else if (enabled == true) {
                        enabled = "";
                    }
                    input += elinicon;
                    input += '<label class="select nw_label nw_label_selectbox nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + '  for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-select ' + classInIcon + '">';
                    input += '<div id="' + v.name + '-button" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow" ' + divStyle + ' ><span class="spanTextShow spanTextShow_' + v.name + '">Seleccione</span>';
                    input += '<select ' + typeOriginal + ' ' + multiData + '  ' + multi + ' type="' + v.type + '" id="' + v.name + '" name="' + v.name + '" ' + divStyle + ' ';
                    input += 'class="nw_selectBox nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += enabled;
                    input += " ";
                    input += className;
                    input += ' "';
                    input += placeholder;
                    input += required;
                    input += ' >';
                    input += '</select>';
                    input += '</div>';
                    input += '</div>';
                    if (typeof v.buttonQuit != 'undefined') {
                        if (v.buttonQuit == true) {
                            input += "<button type='button' id='button_" + v.name + "' name='button_" + v.name + "' style='float: right'>Quitar</button>";
                        }
                    }
                    break;
                case "radio":
                    input += elinicon;
                    input += '<label class="select nw_label nw_label_selectbox nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + '  for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-controlgroup-controls  ' + classInIcon + '">';
                    input += '<fieldset data-type="radio" id="' + v.name + '" class="radio_fieldset_nwform radio_for_' + v.name + '" data-role="controlgroup" data-iconpos="right"></fieldset>';
                    input += '</div>';
                    if (typeof v.buttonQuit != 'undefined') {
                        if (v.buttonQuit == true) {
                            input += "<button type='button' id='button_" + v.name + "' name='button_" + v.name + "' style='float: right'>Quitar</button>";
                        }
                    }
                    break;
                case "button":
                    input += '<div class="ui-input-text ">';
                    if (v.width != 'undefined') {
                        if (v.width == 'center') {
                            input += "<center>";
                        }
                    }
                    var inputClassCamera = "";
                    var addClassCamera = "";
                    if (typeof v.mode != "undefined") {
                        if (v.mode === "camera_files") {
                            addClassCamera = "nwButtonCameraAndFiles";
                        } else
                        if (v.mode === "camera") {
                            addClassCamera = "nwButtonCamera";
                        } else
                        if (v.mode === "files") {
                            addClassCamera = "nwButtonCameraFiles";
                        }
                        if (v.mode === "camera" || v.mode === "files" || v.mode === "camera_files") {
                            inputClassCamera = "<div class='fileUpShow fileUpShow_" + v.name + "'></div>";
                        }
                    }
                    var array = {};
                    array.className = "nw_button " + addClassCamera + " btnForm ui-shadow ui-btn ui-corner-all ui-btn-inline " + className + " " + v.name;
                    array.id = v.name;
                    array.name = v.name;
                    array.text = v.label;
                    array.type = "button";
                    array.position = "center";
                    if (nw.validateBtnMaterialIcons(v.icon) !== false) {
                        array.icon = v.icon + " false elinicon_form";
                    } else {
                        array.icon = v.icon;
                    }
                    array.style = divStyle;
                    array.colorBtnBackIOS = v.colorBtnBackIOS;
                    array.getHTML = true;
                    array.addAttributes = [];
                    var totalAttr = 0;
                    if (nw.evalueData(v.quality)) {
                        array.addAttributes[totalAttr] = {
                            name: "quality",
                            value: v.quality
                        };
                        totalAttr++;
                    }
                    if (nw.evalueData(v.cameraWidth)) {
                        array.addAttributes[totalAttr] = {
                            name: "cameraWidth",
                            value: v.cameraWidth
                        };
                        totalAttr++;
                    }
                    if (nw.evalueData(v.cameraHeight)) {
                        array.addAttributes[totalAttr] = {
                            name: "cameraHeight",
                            value: v.cameraHeight
                        };
                        totalAttr++;
                    }
                    if (nw.evalueData(v.allowEdit)) {
                        array.addAttributes[totalAttr] = {
                            name: "allowEdit",
                            value: v.allowEdit
                        };
                        totalAttr++;
                    }
                    input += nw.createButton(array);
                    if (v.width != 'undefined') {
                        if (v.width == 'center') {
                            input += "</center>";
                        }
                    }
                    input += inputClassCamera;
                    if (v.mode === "camera" || v.mode === "files" || v.mode === "camera_files") {
                        input += '<input ' + typeOriginal + ' ' + modeOriginal + ' ' + divStyle + ' type="hidden" id="' + v.name + '" name="' + v.name + '" ' + enabled + ' data-clear-btn="true" ';
                        input += 'class="text nw_textField nw_widgets nw_textField_' + v.name + ' ';
                        input += v.name;
                        input += " ";
                        input += " ";
                        input += className;
                        input += " ";
                        input += ' "';
                        input += required;
                        input += " ";
                        input += placeholder;
                        input += '/ >';
                    }

                    input += '</div>';
                    break;
                case "textArea":
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classInIcon + ' ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset ' + classInIcon + '">';
                    input += '<textarea ' + minlength + ' ' + maxlength + ' ' + typeOriginal + ' ' + divStyle + '  ' + enabled + ' type="' + v.type + '" id="' + v.name + '" name="' + v.name + '" ';
                    input += 'class="nw_textArea nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += className;
                    input += ' "';
                    input += placeholder;
                    input += required;
                    input += '  >';
                    input += '</textarea></div>';
                    break;
                case "checkBox":
                    input += elinicon;
                    input += '<input ' + typeOriginal + ' ' + enabled + ' type="' + v.type + '" id="' + v.name + '" name="' + v.name + '" ' + divStyle + ' ';
                    input += 'class="nw_checkBox nw_widgets ' + classInIcon + ' ';
                    input += v.name;
                    input += " ";
                    input += className;
                    input += ' "';
                    input += required;
                    input += '  >';
                    input += '</input>';
                    input += '<label class="nw_label nw_label_checkbox nw_widgets ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    break;
                case "ckeditor":
                    haveCkeditor.push(v.name);
                    input += elinicon;
                    input += '<label class="nw_label nw_widgets ' + classVisibleLabel + '" type="label" id="label_' + v.name + '" ' + visibleLabel + ' for="' + v.name + '">' + v.label + '</label>';
                    input += '<textarea ' + typeOriginal + ' style="display: inline;" ' + enabled + ' type="' + v.type + '" id="' + v.name + '" name="' + v.name + '" ' + divStyle + ' cols="40" ';
                    input += 'class="nw_textArea nw_ckeditor ckeditor nw_widgets ';
                    input += v.name;
                    input += " ";
                    input += className;
                    input += ' "';
                    input += placeholder;
                    input += required;
                    input += '  >';
                    input += '</textarea>';
                    break;
                default :
                    console.log("No existe el tipo seleccionado " + v.type);
                    nw.console.log("No existe el tipo seleccionado " + v.type);
                    break;
            }
            if (v.type != "startGroup" && v.type != "endGroup") {
                input += "</div>";
            }
//            parent.ui[v.name] = $(input);
//            parent.setFielsUI($(input));
            html += input;
        }
        html += "</div>";
        if (typeof html_add_end != 'undefined') {
            if (html_add_end != '') {
                html += html_add_end;
            }
        }
        if (haveCkeditor.length > 0) {
            for (var ia = 0; ia < haveCkeditor.length; ia++) {
                try {
                    CKEDITOR.replace(haveCkeditor[ia]);
                } catch (e) {

                }
            }
        }
        return html;
    },
    addRequiredMessage: function (div, msg, top) {
        var text = "Requerido";
        if (nw.evalueData(msg)) {
            text = msg;
        }
        if (!nw.evalueData(top)) {
            top = 50;
        }
        var mensaje = "<span class='errorNwForm'>" + text + "</span>";
        $(div).focus().after(mensaje);
        nw.scrollPage(div, 300, top);
    },
    evalInput: function (d) {
        var input = $(d);
        var id = input.attr("id");
        var value = input.val();
        var type = input.attr("type");
        var error = false;
        if (input.is(':checked')) {

        }
        if (type == "file" || type == "uploader") {
            value = input.attr('data-file');
        } else
        if (type == "checkbox") {
            value = input.prop('checked');
        } else
        if (value == undefined || value == "") {
            error = true;
        } else
        if (input.attr("multiple") == "multiple") {
            if ($("#" + id + " option").length == 0) {
                error = true;
            } else {
                error = false;
            }
        }
        if (error === true) {
            $(input).addClass("errorNwFormDiv");
            nw.addRequiredMessage(input);
            $(input).keydown(function () {
                $(".errorNwForm").remove();
                $(input).removeClass("errorNwFormDiv");
            });
            $(input).change(function () {
                $(".errorNwForm").remove();
                $(input).removeClass("errorNwFormDiv");
            });
            return false;
        }
        return true;
    },
    validateForm: function (form) {
        nw.removeErrorField();
        var div_required = $(form).find('.required');
        var total = div_required.length;
        for (var i = 0; i < total; i++) {
            if (nw.evalInput(div_required[i]) === false) {
                return false;
            }
            var div = $(div_required[i]);
            //caracteres mínimos y máximos
            var totalcaracteres = div.val() == null ? 0 : div.val().length;
            var car_min = div.attr("minlength");
            var car_max = div.attr("maxlength");
            if (car_min != undefined) {
                if (totalcaracteres < car_min) {
                    div.addClass("errorNwFormDiv");
                    div.focus().after("<span class='errorNwForm'>Faltan caracteres, mínimo " + car_min + " </span>");
                    div.keyup(function () {
                        if ($(this).val() != "") {
                            $(".errorNwForm").remove();
                            div.removeClass("errorNwFormDiv");
                            return false;
                        }
                    });
                    div.change(function () {
                        if ($(this).val() != "") {
                            $(".errorNwForm").remove();
                            div.removeClass("errorNwFormDiv");
                            return false;
                        }
                    });
                    return false;
                }
                if (totalcaracteres > car_max) {
                    div.addClass("errorNwFormDiv");
                    div.focus().after("<span class='errorNwForm'>Máximo de caracteres " + car_max + " </span>");
                    div.keyup(function () {
                        if ($(this).val() != "") {
                            $(".errorNwForm").remove();
                            div.removeClass("errorNwFormDiv");
                            return false;
                        }
                    });
                    div.change(function () {
                        if ($(this).val() != "") {
                            $(".errorNwForm").remove();
                            div.removeClass("errorNwFormDiv");
                            return false;
                        }
                    });
                    return false;
                }
            }
        }
        return true;
    },
    removeErrorField: function () {
        $(".errorNwForm").remove();
    },
    getDomain: function () {
        return location.hostname;
    },
    checkConnection: function (callback, urldom) {
        var time = 5000;
        var ok = nw.openConnection();
        if (!ok) {
            return false;
        }
        var t = nw.isOnline();
        var ton = " Internet estable";
        if (t === false) {
            ton = "<br />Sin internet, compruebe su conexión. ";
        }
        var url = config.domain_rpc;
        if (typeof urldom !== "undefined") {
            url = urldom;
        }

        function reqListener() {
//            console.log("response", this.responseText);
        }
        function reqError(error) {
            console.log('Fetch Error :-S', error);
            console.log('Problema al realizar la solicitud: ' + error.message);
            nw.console.log('Problema al realizar la solicitud: ' + error.message);
            $(".msgConnecStatus").remove();
            var m = "Sin conexión con el servidor " + url + ".<br />" + ton + " <br /> Intentando recuperar, por favor espere...";
            $("body").append("<div class='msgConnecStatus'>" + m + "</div>");
            setTimeout(function () {
                nw.checkConnection(callback, urldom);
            }, time);
            nw.reject(error);
        }
        var oReq = new XMLHttpRequest();
        oReq.onreadystatechange = function () {
            if (oReq.readyState == 4 && oReq.status == 200) {
                $(".msgConnecStatus").remove();
                callback();
            }
        };
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', url, true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send();
        return;


        fetch(url).then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
                // Parece que hay acceso a Internet, pero la respuesta no ha sido ok. También se puede comprobar el código de estado con response.status Y hacer algo específico según el estado exacto recibido
            }
            return response;
        }).then(function (response) {
            $(".msgConnecStatus").remove();
            callback(response);
            // response.ok fue true
        }).catch(function (error) {
            console.log('Problema al realizar la solicitud: ' + error.message);
            nw.console.log('Problema al realizar la solicitud: ' + error.message);
            $(".msgConnecStatus").remove();
            var m = "Sin conexión con el servidor " + url + ".<br />" + ton + " <br /> Intentando recuperar, por favor espere...";
            $("body").append("<div class='msgConnecStatus'>" + m + "</div>");
            setTimeout(function () {
                nw.checkConnection(callback, urldom);
            }, time);
            nw.reject(error);
        });
    },
    rpc: function (url, className) {
        this.permanent = false;
        this.async = false;
        this.setAsync = function (async) {
            this.async = async;
            return async;
        };
        this.loading = true;
        this.setLoading = function (boolean) {
            this.loading = boolean;
            return boolean;
        };
        this.exec = function (method, data, callback) {
            var self = this;
            var rpc = {};
            rpc["service"] = className;
            rpc["method"] = method;
            rpc["data"] = data;
            var func = function (r) {
                callback(r);
            };
            nw.rpcNw(url, rpc, func, self.async, self.permanent, self.loading);
        };
    },
    rpcNw: function (url, rpc, func, async, permanent, loading) {
        var asyncEnd = true;
        if (async === false) {
            asyncEnd = false;
        }
        rpc.data = rpc.data;
        rpc.data.dataPaginationInit = 0;
        rpc.data.dataPaginationEnd = 1000;

        rpc.server_data = {};
        rpc.server_data.key = "nwcaf2323";
        if (url === "rpcNw") {
            url = mainNW.domain_rpc + "/nwlib6/nwproject/testRPC.php";
        }
        nw.nw_ajax(url, rpc, func, asyncEnd, permanent, loading);
    },
    nw_ajax: function (url, array, func, async, permanent, loading) {
        nw.openConnection(true);
        if (loading === true) {
            nw.loading();
        }
        nw.checkConnection(function (r) {
            nw.exec_nw_ajax(url, array, func, async, loading);
        }, url, permanent);
    },
    exec_nw_ajax: function (url, array, func, async, loading) {
        var pass = true;
        $.each(array.data, function (key, val) {
            if (typeof val === "function") {
                nw.loadingRemove();
                nw.dialog("ERROR: Está enviando un dato incorrecto al servidor. Field: " + key + ", tipo: " + typeof val + ". Ver consola para más info.");
                console.log("field", key);
                console.log("model", val);
                pass = false;
                return false;
            }
        });
        if (!pass) {
            return false;
        }
        $.ajax({
            async: async,
            type: "POST",
            url: url,
            crossDomain: true,
            cache: false,
            data: array,
            success: function (result) {
//                console.log("exec_nw_ajax", result);
                nw.console.log(result);
                if (loading === true) {
                    nw.loadingRemove();
//                $.mobile.loading("hide");
                }
                var resultjson = $.parseJSON(result);
//                if (typeof result === "object") {
                if (nw.evalueData(resultjson)) {
                    if (nw.evalueData(resultjson.error)) {
                        if (nw.evalueData(resultjson.error.message)) {
                            nw.loadingRemove();
                            nw.dialog(resultjson.error.message);
                            console.log(result);
                            nw.console.log(result);
                            return false;
                        }
                    }
                }
//                }
//                if (typeof result === "string") {
//                    if (result.indexOf("error") !== -1 || result.indexOf("Error") !== -1 || result.indexOf("ERROR") !== -1) {
//                        nw.dialog(result);
//                        console.log(result);
//                        nw.console.log(result);
//                        return false;
//                    }
//                }
                if (showconsolerpcresult === true) {
                    console.log(result);
                }
                result = $.parseJSON(result);
//                console.log(result);
//                if (nw.evalueData(result)) {
//                    nw.console.log(result);
//                }

                if (typeof result.error !== "undefined") {
                    var h = "";
                    $.each(result.error, function (key, value) {
                        h += key + ": " + value + ". ";
                    });
                    nw.loadingRemove();
                    nw.nw_dialog(h);
                    return false;
                }
                func(result);
                return false;
            },
            error: function (e) {
                nw.loadingRemove();
                $.mobile.loading("hide");
                console.log("ERROR: ", e);
                nw.console.log("ERROR: ", e);
                var h = "";
                $.each(e.error, function (key, value) {
                    h += key + ": " + value + ". ";
                });
                nw.popupSimple("<h1>ERROR</h1><br /><br />" + h);
            }
        });
    },
    getRecords: function (divID, simple, selfParent) {
        if (typeof simple == 'undefined') {
            simple = false;
        }
        return nw.getFilterRecords(divID, simple, selfParent);
    },
    getFilterRecords: function (divID, arraySimple, selfParent) {
        var r = [];
        if (typeof arraySimple != 'undefined' && arraySimple == true) {
            r = {};
        }
        var self = $(divID);
        $(divID).find('input, input:password, input:file, input:checkBox, select, textarea, radio')
                .each(function () {
                    var type = $(this).attr('type');
                    var id = $(this).attr('id');
                    var name = $(this).attr('name');
                    if (type === "radio") {
                        if ($(divID + " .label_radio_" + id).hasClass('ui-radio-on')) {
                            r[name] = typeof $(this).val() == 'undefined' ? "" : $(this).val();
                            r[name + "_text"] = $(divID + " .label_radio_" + id).text();
                        }
                    } else
                    if (type == "selectBox") {
                        var multiple = self.find("#" + id).data("nwmultiple");
                        if (multiple == true) {
                            r[id] = self.find("#" + id).getAllSelectOptions();
                            r[id + "_values"] = implodeArray(r[id], id);
                            r[id + "_texts"] = implodeArray(r[id], id + "_text");
                        } else {
                            r[id] = typeof self.find("#" + id + " option:selected").val() == 'undefined' ? "" : self.find("#" + id + " option:selected").val();
                            r[id + "_text"] = self.find("#" + id + " option:selected").text();
                            /*
                             var model = self.find("#" + id + " option:selected").data("populateData");
                             if (typeof model == 'undefined') {
                             model = "";
                             } else if (model == null) {
                             model = "";
                             }
                             */
                            var model = selfParent.ui[id].data;
                            if (typeof model === "object") {
                                r[id + "_model"] = model;
                                r[id + "_all_data"] = model;
                            }
                        }
                    } else
                    if (type == "file") {
//                        r[id] = typeof $(this).val() == 'undefined' ? "" : $(this).val();
                        r[id] = typeof $(this).attr("data-file") == 'undefined' ? "" : $(this).attr("data-file");
                        r[id] = r[id].replace('C:\\fakepath\\', '');
                    } else
                    if (type == "date" || $(this).hasClass("nw_dateField")) {
                        r[id] = typeof $(this).val() == 'undefined' ? "" : $(this).val();
                        var date = r[id];
                        var parts = r[id].split('-');
                        if (parts.length > 1) {
                            date = new Date(parts[0], parts[1] - 1, parts[2]);
                        }
                        r[id + "_object"] = date;
                    } else
                    if (type == "checkBox") {
                        r[id] = $(this).prop('checked');
                    } else {
                        r[id] = typeof $(this).val() == 'undefined' ? "" : $(this).val();
                    }
                });
        return r;
    },
    evalueData: function (d, exception) {
        if (typeof d == "undefined") {
            return false;
        }
        if (nw.evalueData(exception)) {
            if (d == exception) {
                return true;
            }
        }
        if (d == undefined) {
            return false;
        }
        if (d == null) {
            return false;
        }
        if (d == "null") {
            return false;
        }
        if (d == false) {
            return false;
        }
        if (d == "") {
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
        return text;
    },
    closeSession: function () {
        nw.loading({"text": "Cerrando sesión..."});
        var c = config.config_crear_cuenta;
        var up = nw.userPolicies.getUserData();

        var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
        var data = {};
        data.usuario = up.usuario;
        data.terminal = up.terminal;
        if (nw.evalueData(window.localStorage.getItem("token"))) {
            data.token = window.localStorage.getItem("token");
        }
        data.session_id = config.session_id;
        rpc.setAsync(true);
        rpc.setLoading(false);
        var func = function (r) {
            nw.console.log("Close session OK!", r);
            localStorage["initSession"] = "undefined";
            localStorage["outputMenuLeft"] = "undefined";
            localStorage["outputMenuCenter"] = "undefined";
            $.each(localStorage, function (key, value) {
                localStorage.removeItem(key);
            });
            if (c.permitir_registro_login_con_facebook === true) {
                nw.fb_logout();
            }
            if (typeof FCMPlugin !== "undefined") {
                nw.unSuscribedUserNotificacionPush();
            }
            setTimeout(function () {
                var url = location.pathname;
                window.location = url;
            }, 500);
        };
        rpc.exec("closeSessionInApp", data, func);
        return;
    },
    reject: function (s) {
        var d = document.querySelector(s.canvas);
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
    createNotificacionBarInter: function (options) {
        var timeremove = 4000;
        if (nw.evalueData(options.timeToRemove) !== false) {
            timeremove = options.timeToRemove;
        }
        var d = document.querySelector(".notifyBarEnc");
        if (!d) {
            var d = document.createElement("div");
            d.className = "notifyBarEnc";
            document.body.append(d);
        }
        var addClass = "";
        if (nw.evalueData(options.addClass) !== false) {
            addClass = options.addClass;
            var iam = document.querySelector("." + addClass);
            if (iam) {
                return true;
//                iam.remove();
            }
        }
        var htmlPhoto = "";
        if (nw.evalueData(options.icon)) {
            htmlPhoto = "<div class='barPhoto' style='background-image: url(" + options.icon + ")'></div>";
        }
        var p = document.createElement("div");
        p.className = "liBarEncNotify " + addClass;
        p.innerHTML = htmlPhoto;
        d.appendChild(p);

        setTimeout(function () {
            nw.addClass(p, "liBarEncNotifyShow");
        }, 100);

        var text = document.createElement("div");
        text.className = "barTexts";
        text.innerHTML = "<span class='barTitle'>" + options.title + "</span><span class='barBody'>" + options.body + "</span>";
        text.onclick = function () {
            if (nw.evalueData(options.callback)) {
                try {
                    options.callback();
                    nw.removeClass(p, "liBarEncNotifyShow", true);
                    setTimeout(function () {
                        p.remove();
                    }, 1000);
                } catch (e) {
                    nw.dialog("callback failed " + e);
                    console.log(e);
                    nw.console.log(e);
                    nw.loadingRemove();
                }
            } else {
                nw.removeClass(p, "liBarEncNotifyShow", true);
                setTimeout(function () {
                    p.remove();
                }, 1000);
            }
        };
        p.appendChild(text);

        var close = document.createElement("div");
        close.className = "barClose";
        close.innerHTML = "<i class='material-icons'>close</i>";
        if (options.htmlClose) {
            close.innerHTML = options.htmlClose;
        }
        close.onclick = function () {
            if (nw.evalueData(options.callbackClose) !== false) {
                options.callbackClose();
            }
            nw.removeClass(p, "liBarEncNotifyShow", true);
            setTimeout(function () {
                p.remove();
            }, 1000);
        };
        p.appendChild(close);
        setTimeout(function () {
            nw.removeClass(p, "liBarEncNotifyShow", true);
            setTimeout(function () {
                p.remove();
            }, 1000);
        }, timeremove);

        if (nw.evalueData(options.callbackEnd) !== false) {
            options.callbackEnd();
        }

    },
    dialogRemove: function () {
        $(".popup_pil").remove();
    },
    dialog: function (text, callbackAccept, callbackCancel, options) {
        nw.createPopUp(text, callbackAccept, callbackCancel, options);
    },
    popupSimple: function (text, callbackAccept, callbackCancel, options) {
        nw.createPopUp(text, callbackAccept, callbackCancel, options);
    },
    createPopUp: function (text, callbackAccept, callbackCancel, options) {
        var self = this;
        if (typeof text == "object") {
            text = text.html;
        }
        self.dialogRemove();
        var taccept = "Aceptar";
        var tcancel = "Cancelar";
        var icon_a = "";
        var icon_c = "";
        var classw = "";
        var autocierre = false;
        var textShow = nw.strip_tags(text);
        var useDialogNative = true;
        if (nw.evalueData(options)) {
            if (options.useDialogNative !== "undefined") {
                if (options.useDialogNative === false) {
                    useDialogNative = false;
                }
            }
            if (options.cleanHtml !== "undefined") {
                if (options.cleanHtml === false) {
                    textShow = text;
                }
            }
            if (nw.evalueData(options.textAccept)) {
                taccept = options.textAccept;
            }
            if (nw.evalueData(options.autoCierre)) {
                autocierre = options.autoCierre;
            }
            if (nw.evalueData(options.textCancel)) {
                tcancel = options.textCancel;
            }
            if (nw.evalueData(options.iconAccept)) {
                icon_a = options.iconAccept;
            }
            if (nw.evalueData(options.iconCancel)) {
                icon_c = options.iconCancel;
            }
            if (nw.evalueData(options.isprompt) && typeof navigator.notification === "undefined") {
                textShow += "<div class='contain_prompt_input'><input class='prompt_input' /></div>";
            }
        }
        if (typeof navigator.notification !== "undefined" && useDialogNative === true) {
            var message = nw.strip_tags(textShow);
            var title = "";
            var buttonName = taccept;
            function onConfirm(results) {
                var buttonIndex = results;
                if (typeof results.buttonIndex !== "undefined") {
                    buttonIndex = results.buttonIndex;
                }
                var dataReturn = "";
                if (typeof results.input1 !== "undefined") {
                    dataReturn = results.input1;
//                    if (!nw.evalueData(dataReturn)) {
//                        return false;
//                    }
                }
                if (buttonIndex.toString() === "1" || buttonIndex.toString() === "0") {
                    if (nw.evalueData(callbackAccept)) {
                        callbackAccept(dataReturn);
                    }
                } else {
                    if (nw.evalueData(callbackCancel)) {
                        callbackCancel(dataReturn);
                    }
                }
            }
            if (nw.evalueData(callbackCancel)) {
                if (nw.evalueData(options) && nw.evalueData(options.isprompt)) {
                    navigator.notification.prompt(message, onConfirm, title, [taccept, tcancel]);
                } else {
                    navigator.notification.confirm(message, onConfirm, title, [taccept, tcancel]);
                }
            } else {
                navigator.notification.alert(message, onConfirm, title, buttonName);
            }
            return true;
        }

        var d = document.createElement("div");
        d.className = "popup_pil";
        d.innerHTML = "<div class='popup_pil_int'><div class='closeEncPil'></div><div class='popup_pil_text'>" + textShow + "</div><div class='popup_pil_btns'></div></div>";
        document.body.appendChild(d);

        if (typeof options !== "undefined") {
            if (typeof options.closeEnc !== "undefined") {
                if (nw.evalueData(options.closeEnc)) {
                    var close = document.createElement("div");
                    close.className = "barCloseEnc";
                    close.innerHTML = "<i class='material-icons'>close</i>";
                    close.onclick = function () {
                        $(".popup_pil").remove();
                    };
                    document.querySelector(".closeEncPil").appendChild(close);
                }
            }
        }


        if (nw.evalueData(callbackCancel)) {
            classw = " width_midd";
            var btd = {};
            btd.colorBtnBackIOS = "#7f7f7f";
            btd.style = "box-shadow: none;border: 0;background-color: transparent;color:#7f7f7f;";
            btd.text = tcancel;
            btd.className = "btnpil_cancel " + classw;
            btd.type = "button";
            btd.icon = icon_c;
            btd.position = "center";
            btd.callback = function () {
                callbackCancel();
                $(".popup_pil").remove();
            };
            var div = nw.createButton(btd);
            document.querySelector(".popup_pil_btns").appendChild(div);
        }

        var btd = {};
        btd.colorBtnBackIOS = config.colorBtnBackIOS;
        btd.style = config.styleCloseIOS;
        btd.text = taccept;
        btd.type = "button";
        btd.className = "btnpil_acept " + classw;
        btd.icon = icon_a;
        btd.position = "center";
        btd.callback = function () {
            var dataReturn = "";
            if (nw.evalueData(options)) {
                if (nw.evalueData(options.isprompt)) {
                    dataReturn = $(".prompt_input").val();
                    if (!nw.evalueData(dataReturn)) {
                        $(".prompt_input").focus();
                        return false;
                    }
                }
            }
            if (nw.evalueData(callbackAccept)) {
                callbackAccept(dataReturn);
            }
            if (!autocierre) {
                $(".popup_pil").remove();
            }
        };
        var div = nw.createButton(btd);
        document.querySelector(".popup_pil_btns").appendChild(div);
    },
    cleanTokenField: function () {
        $(".containTokenResult").remove();
    },
    addZero: function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    semanadelanio: function (date) {
        var fecha = new Date(date);
        var f2 = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0);
        var f1 = new Date(fecha.getFullYear(), 0, 1, 0, 0);
        var day = f1.getDay();
        if (day == 0)
            day = 7;
        if (day < 5)
        {
            var FW = parseInt(((Math.round(((f2 - f1) / 1000 / 60 / 60 / 24)) + (day - 1)) / 7) + 1);
            if (FW == 53 || FW == 0)
                FW = 1;
        } else
        {
            FW = parseInt(((Math.round(((f2 - f1) / 1000 / 60 / 60 / 24)) + (day - 1)) / 7));
            if (FW == 0)
                FW = 52;
            if (FW == 53)
                FW = 1;
        }
        return(FW);
    },
    addMinutesToDate: function (date, minutes, format) {
        var dateTime = date.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");
        var t = date.split(/[- :]/);
        var da = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        var actiondate = new Date(da);
        var d = actiondate;
        var v = actiondate;
        dateTime = v.setMinutes(d.getMinutes() + minutes);
        dateTime = nw.toDatetimeLocal(dateTime);
        var onlyd = dateTime.split("T");
        if (format === "date") {
            return onlyd[0];
        }
        if (format === "hour") {
            return onlyd[1];
        }
        return dateTime;
    },
    dataOfDate: function (date) {
        var onlyF = date;
        if (date == undefined) {
            date = getActualFullDate();
        }
        if (date.split(" ").length == 1) {
            date = date + " 00:00:00";
        }
        onlyF = date.split(" ")[0];

        var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");

        var dateString = date;
        dateString = dateString.replace(/-/g, '/');

        var d = new Date(dateString);
        var r = {};
        r["fecha_sin_hora"] = onlyF;
        r["fecha_completa"] = date;
        r["fecha_anio"] = d.getFullYear();
        r.fecha_mes = d.getMonth() + 1;
        r["fecha_mes_string"] = r["fecha_mes"].toString();
        if (r["fecha_mes_string"].length == 1) {
            r["fecha_mes_string"] = "0" + r["fecha_mes_string"];
        }
        r["fecha_mes_text"] = nw.lettersArray(r.fecha_mes);
        r["fecha_mes_text_english"] = nw.mesTextEnglish(r["fecha_mes_string"]);
        r["fecha_dia"] = d.getDate();
        r["fecha_dia_semana"] = d.getDay();
        r.fecha_dia_text = diasSemana[d.getDay()];
        /*    r["fecha_dia_text"] = diasArray(r["fecha_dia_semana"]);*/

        var habil = "SI";
        var festivo = "NO";
        if (r["fecha_dia_semana"] == 6 || r["fecha_dia_semana"] == 0) {
            habil = "NO";
        }
        if (r["fecha_dia_semana"] == 0) {
            festivo = "SI";
        }
        r["fecha_dia_habil"] = habil;
        r["fecha_dia_festivo"] = festivo;
        r["fecha"] = r["fecha_anio"] + "-" + r["fecha_mes"] + "-" + r["fecha_dia"];
        r["semana"] = nw.semanadelanio(r["fecha"]);
        r["hora_ex"] = d.getTime();
        r["hora_horas"] = d.getHours();
        r["hora_minutos"] = d.getMinutes();
        r["hora_segundos"] = d.getSeconds();
        r["hora_completa"] = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return r;
    },
    diffEntreFechas: function (fechaIni, fechaFin) {
        if (fechaFin == undefined) {
            fechaFin = nw.getActualFullDate();
        }
        var diaEnMils = 1000 * 60 * 60 * 24,
                desde = new Date(fechaIni.substr(0, 10)),
                hasta = new Date(fechaFin.substr(0, 10)),
                diff = hasta.getTime() - desde.getTime() + diaEnMils;/* +1 incluir el dia de ini*/

        var r = diff / diaEnMils;
        r = r - 1;
        return r;
    },
    diferenciaHoras: function (hourEnd, hourInit, clean) {
        var f = new Date();
        var separadorHoras = ":";
        var hNow = f.getHours() + separadorHoras + f.getMinutes() + separadorHoras + f.getSeconds();
        if (nw.evalueData(hourInit)) {
            hNow = hourInit;
        }
        var hDay = hourEnd;
        var hora2 = (hNow).split(":"),
                hora1 = (hDay).split(":"),
                t1 = new Date(),
                t2 = new Date();
        t1.setHours(hora1[0], hora1[1], hora1[2]);
        t2.setHours(hora2[0], hora2[1], hora2[2]);
        t1.setHours(t1.getHours() - t2.getHours(), t1.getMinutes() - t2.getMinutes(), t1.getSeconds() - t2.getSeconds());
        var hora = (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? "" : "") : "");
        var min = (t1.getMinutes() ? +t1.getMinutes() + (t1.getMinutes() > 1 ? "" : "") : "");
        var seg = (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? "" : "") + t1.getSeconds() + (t1.getSeconds() > 1 ? "" : "") : "");

        if (hora.length == 1) {
            hora = "0" + hora;
        }
        if (hora == "") {
            hora = "00";
        }
        if (min == "") {
            min = "00";
        }
        if (min.length == 1) {
            min = "0" + min;
        }
        if (seg == "") {
            seg = "00";
        }
        if (seg.length == 1) {
            seg = "0" + seg;
        }
        var separator = ":";
        if (clean === true) {
            separator = "";
            if (hora == 00 || hora == "00") {
                hora = "";
            }
        }
        var total = hora + separator + min + separator + seg;
        return total;
    },
    calcularTiempoDosFechas: function (date1, date2) {
        if (typeof date2 === "undefined") {
            date2 = nw.getActualFullDate();
        }
        var hoy = nw.getActualHour();
        var start_actual_time = new Date(date1);
        var end_actual_time = new Date(date2);
        var diff = end_actual_time - start_actual_time;
        var diffSeconds = diff / 1000;
        var HH = Math.floor(diffSeconds / 3600);
        var MM = Math.floor(diffSeconds % 3600) / 60;
        var SS = diffSeconds % 60;
        var days = nw.diffEntreFechas(date1, date2);
        var hours = (HH < 10) ? ("0" + HH) : HH;
        var infoDate = nw.dataOfDate(date1);
        var infoDate2 = nw.dataOfDate(hoy);
        var mesDate = infoDate.fecha_mes;
        var mesDateText = infoDate.fecha_mes_text;
        var dayDate = infoDate.fecha_dia;
        var dayDateText = infoDate.fecha_dia_text;
        var hoursDate = infoDate.hora_horas;
        var minutesDate = infoDate.hora_minutos;
        var minutes = ((MM < 10) ? ("0" + MM) : MM);
        var seconds = ((MM < 10) ? ("0" + MM) : SS);
        var formatted = hours + ":" + minutes;
        minutes = parseInt(minutes);
        var isMayor = false;

        if (date1 > hoy) {
            isMayor = true;
        }

        var r = {};
        r.hoy = hoy;
        r.fecha_mayor_a_hoy = isMayor;
        r.date1 = date1;
        r.date2 = date2;
        r.time_complet = formatted;
        r.days = days;
        r.hours = hours;
        r.mesDate = mesDate;
        r.mesDateText = mesDateText;
        r.dayDate = dayDate;
        r.dayDateText = dayDateText;
        r.hoursDate = hoursDate;
        r.minutesDate = minutesDate;
        r.minutes = minutes;
        r.seconds = seconds;

        var dateInFormat = mesDateText + " " + dayDate + " a las " + hoursDate + ":" + minutesDate;
        if (isMayor == true) {
            /*        dateInFormat = "En " + hoursDate + ":" + minutesDate;*/
        } else {
            if (days > 0) {
                if (days == 1) {
                    dateInFormat = nw.str("Ayer a las") + " " + hoursDate + ":" + minutesDate;
                } else {
                    dateInFormat = mesDateText + " " + dayDate + " a las " + hoursDate + ":" + minutesDate;
                }
            } else {
                if (hours < 24) {
                    if (hours < 1) {
                        if (minutes < 59) {
                            dateInFormat = nw.str("Hace") + " " + minutes + " " + nw.str("minutos");
                        }
                    } else {
                        dateInFormat = nw.str("Hace") + " " + hours + " " + nw.str("horas") + " " + nw.str("y") + " " + minutes + " " + nw.str("minutos");
                    }
                }
            }
        }
        r["dateInFormat"] = dateInFormat;
        return r;
    },
    lettersArray: function (i) {
        var r = {};
        r["1"] = "Enero";
        r["2"] = "Febrero";
        r["3"] = "Marzo";
        r["4"] = "Abril";
        r["5"] = "Mayo";
        r["6"] = "Junio";
        r["7"] = "Julio";
        r["8"] = "Agosto";
        r["9"] = "Septiembre";
        r["10"] = "Octubre";
        r["11"] = "Noviembre";
        r["12"] = "Diciembre";
        return r[i.toString()];
    },
    mesesArray: function (i) {
        return lettersArray(i);
    },
    mesTextEnglish: function (i) {
        var d = {};
        d["01"] = "January";
        d["02"] = "February";
        d["03"] = "March";
        d["04"] = "April";
        d["05"] = "May";
        d["06"] = "June";
        d["07"] = "July";
        d["08"] = "August";
        d["09"] = "September";
        d["10"] = "October";
        d["11"] = "November";
        d["12"] = "December";
        return d[i];
    },
    diasArray: function (i) {
        var r = {};
        r["1"] = "Lunes";
        r["2"] = "Martes";
        r["3"] = "Miércoles";
        r["4"] = "Jueves";
        r["5"] = "Viernes";
        r["6"] = "Sábado";
        r["0"] = "Domingo";
        return r[i];
    },
    getActualFullDate: function (format) {
        var hoy = nw.getActualDate(format);
        var hour = nw.getActualHour(format);
        if (format == "datetime-local") {
            return hoy + "T" + hour;
        }
        return hoy + " " + hour;
    },
    getActualHour: function (format) {
        var d = new Date();
        var h = nw.addZero(d.getHours());
        var m = nw.addZero(d.getMinutes());
        var s = nw.addZero(d.getSeconds());
        if (format == "datetime-local") {
            return h + ":" + m;
        }
        return h + ":" + m + ":" + s;
    },
    getActualDate: function (format) {
        var d = new Date();
        var day = nw.addZero(d.getDate());
        var month = nw.addZero(d.getMonth() + 1);
        var year = nw.addZero(d.getFullYear());
        return year + "-" + month + "-" + day;
    },
    isOnline: function () {
        return navigator.onLine;
    },
    uiOptions: function () {
        this.array = {};
        return this.array;
    },
    addButtonsPage: function (self) {
        if (nw.evalueData(self.buttons)) {
            var t = self.buttons.length;
            if (t === 1) {
                var li = self.buttons[0];
                var className = " " + li.name;
                var position = "center";
                if (li.position === "top") {
                    position = "header_right";
                }
                if (typeof li.className !== "undefined") {
                    className += " " + li.className;
                }
                if (typeof li.position !== "undefined") {
                    className += " ui-btn-position-" + li.position + " ";
                }
                var colorBtnBackIOS = config.colorBtnBackIOS;
                if (typeof li.colorBtnBackIOS !== "undefined") {
                    colorBtnBackIOS = li.colorBtnBackIOS;
                }
                var array = {};
                array.text = li.label;
                array.type = "button";
                array.position = position;
                array.icon = li.icon;
                array.className = className;
                array.callback = li.callback;
                array.style = li.style;
                array.data = li;
                array.colorBtnBackIOS = colorBtnBackIOS;
                var div = nw.createButton(array);
                if (li.position === "top") {
                    var da = document.querySelector(self.canvas);
                    if (da) {
                        $(self.canvas + " .my-header").append(div);
                    } else {
                        $("." + self.id + " .my-header").append(div);
                    }
                } else {
                    $("." + self.id_form + " .containBtnFooter").append(div);
                }
            } else {
                $(self.canvas + " .my-header").append('<div data-role="navbar" class="ui-navbar ui-mini" role="navigation"> <ul class="ui-nav-enc ui-grid-b"></ul></div>');
                for (var i = 0; i < t; i++) {
                    var li = self.buttons[i];
                    var className = " " + li.name;
                    var position = "center";
                    if (li.position === "top") {
                        position = "header_right_nav_enc";
                    }
                    if (typeof li.className !== "undefined") {
                        className += " " + li.className;
                    }
                    var styleContainer = "";
                    if (typeof li.styleContainer !== "undefined") {
                        styleContainer = " style='" + li.styleContainer + "' ";
                    }
                    var colorBtnBackIOS = config.colorBtnBackIOS;
                    if (typeof li.colorBtnBackIOS !== "undefined") {
                        colorBtnBackIOS = li.colorBtnBackIOS;
                    }
                    var array = {};
                    array.text = li.label;
                    array.type = "a";
                    array.position = position;
                    array.icon = li.icon;
                    array.className = className;
                    array.callback = li.callback;
                    array.style = li.style;
                    array.data = li;
                    array.colorBtnBackIOS = colorBtnBackIOS;
                    var div = nw.createButton(array);
                    if (li.facebook === true) {
//                        div = "<div class='fb-login-button' data-size='large' data-button-type='continue_with' data-auto-logout-link='false' data-use-continue-as='true' onlogin='nw.checkLoginState();'></div>";
                    }
                    if (li.position === "top") {
                        $(self.canvas + " .my-header .ui-nav-enc").append("<li class='ui-block-b ui-block-" + i + "' " + styleContainer + "></li>");
                        $(self.canvas + " .my-header .ui-nav-enc .ui-block-" + i).append(div);
                    } else {
                        $("." + self.id_form + " .containBtnFooter").append(div);
                    }
                    if (li.facebook === true) {
                        $(".fb-login-button").attr("onlogin", "nw.checkLoginState()");
                        $(".fb-login-button").attr("data-size", "large");
                        $(".fb-login-button").attr("data-button-type", "continue_with");
                        $(".fb-login-button").attr("data-auto-logout-link", "false");
                        $(".fb-login-button").attr("data-use-continue-as", "true");
                    }
                }
            }
        }
        nw.loadFastClick();
    },
    addHeaderNote: function (div, text) {
        $(div).prepend("<div class='addHeaderNote'>" + text + "</div>");
    },
    addFooterNote: function (div, text) {
        $(div).after("<div class='addHeaderNote'>" + text + "</div>");
    },
    forms: function () {
        this.id = nw.createRandomId();
        this.setTitle = "";
        this.html = "";
        this.showBack = true;
        this.closeBack = false;
        this.closeBackCallBack = false;
        this.textClose = false;
        this.styleCloseIOS = config.styleCloseIOS;
        this.id_form = 'nw_form_' + nw.createRandomId();
        this.canvas = "#" + mainNW.id;
        this.popup = false;
        this.title = "::NW::";
        this.columnsForm = 1;
        this.columnsHTML = "";
        this.buttons = [];
        this.backgroundColor = function (color) {
            var self = this;
            nw.backgroundColor(self, color);
        };
        this.ui = new nw.uiOptions();
        this.settings = {};
        this.dialog = function (text, accept, cancel) {
            nw.dialog(text, accept, cancel);
        };
        this.addRequiredMessage = function (className, text) {
            nw.addRequiredMessage(className, text);
        };
        this.loadingRemove = function () {
            nw.loadingRemove();
        };
        this.cleanTokenField = function () {
            nw.cleanTokenField();
        };
        this.reject = function () {
            var self = this;
            nw.reject(self);
        };
        this.clean = function () {
            var self = this;
            var classOrId = "." + self.id_form;
            $(':input', classOrId)
                    .not(':button, :submit, :reset, :hidden')
                    .val('')
                    .removeAttr('checked')
                    .removeAttr('selected');
            $(".showImage").html(" ");
            var d = $(':input', classOrId);
            var t = d.length;
            for (var i = 0; i < t; i++) {
                var ta = $(d[i]);
                var type = ta.attr("type");
                var typenwmaker = ta.attr("typenwmaker");
                if (typenwmaker == "file") {
                    ta.val('');
                }
            }
        };
        this.back = function () {
            nw.back();
        };
        this.evalueData = function (value) {
            return nw.evalueData(value);
        };
        this.validate = function () {
            var self = this;
            if (!nw.validateForm("." + self.id_form)) {
                return false;
            }
            return true;
        };
        this.addHeaderNote = function (text) {
            var self = this;
            nw.addHeaderNote("." + self.id_form, text);
        };
        this.addFooterNote = function (text) {
            var self = this;
            nw.addFooterNote("." + self.id_form, text);
        };
        this.setFielsUI = function (bt) {
            var self = this;
            nw.setFields(self, bt);
        };
        this.getRpcUrl = function () {
            return nw.getRpcUrl();
        };
        this.setFields = function (fields) {
            var self = this;
            self.columnsHTML = nw.createFields("#" + self.id_form, fields, "", "", self.columnsForm, self);
            $("#" + self.id_form).find('button, label, input, .radio_fieldset_nwform, input:password, input:file, select, textarea, button, .nw_html, .nw_form_start_group').each(function () {
                self.setFielsUI(this);
            });
        };
        this.getRecords = function (simple) {
            if (typeof simple == 'undefined') {
                simple = false;
            }
            return nw.getRecords("#" + this.id_form, simple);
        };
        this.getRecord = function (simple) {
            var self = this;
            simple = true;
            if (typeof simple == 'undefined') {
                simple = false;
            }
            var ra = nw.getRecords("#" + self.id_form, simple, self);
            return ra;
        };
        this.setRecord = function (r) {
            if (nw.evalueData(r) === false) {
                return false;
            }
            var self = this;
            $.each(self.ui, function (key, val) {
                var value = "";
                if (nw.evalueData(r[key])) {
                    value = r[key];
                }
                val.setValue(value);
            });
            return true;
        };
        this.createBase = function () {
            var c = new nw.newPage();
            c.id = this.id;
            c.showBack = this.showBack;
            c.closeBack = this.closeBack;
            c.textClose = this.textClose;
            c.styleCloseIOS = this.styleCloseIOS;
            c.closeBackCallBack = this.closeBackCallBack;
            c.logotipo_text = "<span class='setTitle'>" + this.setTitle + "</span>";
            c.html = this.html;
            c.createAndShow();
            this.canvas = "#" + c.id;
        };
        this.show = function () {
            var self = this;
            var html = self.columnsHTML;
            html += " <div class='ui-field-contain containBtnFooter'></div>";

            var div = document.createElement("div");
            div.id = self.id_form;
            div.className = "nwform " + self.id_form;
            div.innerHTML = html;

            $(self.canvas + " .contentCenter").append(div);

            $("#" + self.id_form).find('button, label, input, input:password,.radio_fieldset_nwform, input:file, select, textarea, button, .nw_html, .nw_form_start_group').each(function () {
                self.setFielsUI(this);
            });

            nw.addButtonsPage(self);
            $(self.canvas + ' .selectSwitch').slider();
            self.setmargin();
        };
        this.setmargin = function () {
            var self = this;
            var he = document.querySelector(self.canvas + " .header");
            if (he) {
                var h = he.clientHeight + "px";
                if (!nw.evalueData(h.replace("px", ""))) {
                    h = config.enc_height;
                }
                document.querySelector(self.canvas + " .contentCenter").style.marginTop = h;
            }
        };
    },
    setFields: function (self, bt) {
        if ($(bt).data("nwenabled") == false) {
            $(bt).prop("disabled", "disabled");
        }
        if ($(bt).attr("disabled") == "disabled") {
            $(bt).addClass("disabled_nw");
        }
        if ($(bt).attr("required") == "required") {
            $(bt).addClass("required");
        }
        var id = $(bt).attr('id');
        var type = $(bt).attr('data-type');
        $("#" + self.id_form + " .nw_widget_div_" + id + " .nw_label").addClass("nw_label_" + id);

        bt.parent = self;

        self.ui[id] = $(bt);
        bt.ui = self.ui[id];
        self.ui[id].setRequired = function (option) {
            if (option === false) {
                $(self.ui[id]).removeClass("required");
            } else {
                $(self.ui[id]).addClass("required");
            }
        };
        self.ui[id].setVisibility = function (option) {
            if (option === false) {
                $(".nw_widget_div_" + id + " .nw_label_" + id).css({"display": "none"});
                $(".nw_widget_div_" + id + " ." + id).css({"display": "none"});
                $("#" + id).css({"display": "none"});
                $(".nw_widget_div_" + id + " #" + id).css({"display": "none"});
                $(".nw_widget_div_" + id + " .nw_widget_div_" + id).css({"display": "none"});
                $(".nw_widget_div_" + id).css({"display": "none"});
                $("#" + id + "-button").css({"display": "none"});
            } else {
                $(".nw_widget_div_" + id + " .nw_label_" + id).css({"display": ""});
                $(".nw_widget_div_" + id + " ." + id).css({"display": ""});
                $("#" + id).css({"display": ""});
                $(".nw_widget_div_" + id + " #" + id).css({"display": ""});
                $(".nw_widget_div_" + id + " .nw_widget_div_" + id).css({"display": ""});
                $(".nw_widget_div_" + id).css({"display": ""});
                $("#" + id + "-button").css({"display": ""});
            }
        };
        self.ui[id].actionSearch = function (dat) {
            var settime;
            self.ui[id].on("input propertychange", function () {
                $(".errorNwForm").remove();
                var e = this;
                var name = $(e).attr("name");
                var container = ".nw_widget_div_" + name;
                var parent = self;
                var val = e.value;
                clearTimeout(settime);
                nw.cleanTokenField();
                nw.loadingRemove({"container": container});
                if (!nw.evalueData(val)) {
                    return false;
                }
                var up = nw.userPolicies.getUserData();
                nw.loading({"container": container});
                settime = setTimeout(function () {
                    var data = parent.getRecord(true);
                    data.token = val;
                    if (nw.evalueData(dat.sendData))
                        data.sendData = dat.sendData;
                    if (nw.evalueData(dat.fields_search))
                        data.fields_search = dat.fields_search;
                    if (nw.evalueData(dat.fields_get))
                        data.fields_get = dat.fields_get;
                    if (nw.evalueData(dat.table))
                        data.table = dat.table;
                    data.terminal = up.terminal;
                    data.usuario = up.usuario;
                    data.empresa = up.empresa;
                    data.perfil = up.perfil;

                    var rpc = new nw.rpc(nw.getRpcUrl(), dat.service);
                    rpc.setAsync(true);
                    rpc.setLoading(false);
                    var func = function (r) {
                        nw.loadingRemove({"container": container});
                        nw.cleanTokenField();
                        $("." + parent.id_form + " .containTokenResult_" + $(e).attr("id")).remove();
                        var showsinresult = true;
                        if (typeof dat.showsinresult !== "undefined") {
                            if (dat.showsinresult === false) {
                                showsinresult = false;
                            }
                        }
                        if (r === false) {
                            if (showsinresult) {
                                var g = document.createElement("div");
                                g.className = "containTokenResult containTokenResult_" + $(e).attr("id");
                                $(e).after(g);
                                var ht = document.createElement("div");
                                ht.className = "optionToken optionToken_" + $(e).attr("id");
                                ht.data = false;
                                ht.innerHTML = "Sin resultados";
                                $("." + parent.id_form + " .containTokenResult_" + $(e).attr("id")).append(ht);
                            }
                            return false;
                        }
                        if (r.length === false) {
                            return;
                        }
                        var g = document.createElement("div");
                        g.className = "containTokenResult containTokenResult_" + $(e).attr("id");
                        g.innerHTML = nw.listStructureTable();
                        $(e).after(g);
                        for (var i = 0; i < r.length; i++) {
                            var ya = r[i];
                            var ds = {row: ya, input: e, parent: parent};
                            var ht = document.createElement("li");
                            ht.className = "ui-btn ui-btn-icon-right ui-icon-carat-r optionToken optionToken_" + $(e).attr("id");
                            ht.data = ds;
                            ht.innerHTML = ya.nombre;
                            $("." + parent.id_form + " .containTokenResult_" + $(e).attr("id") + " .uiListRows").append(ht);
                        }
                    };
                    rpc.exec(dat.method, data, func);
                }, 1000);
            });
        };
        self.ui[id].changeValue = function (callback) {
            var type = self.ui[id].attr("type");
            var type_alter = self.ui[id].attr("data-type");
            if (type === "radio" || type_alter === "radio") {
                self.ui[id].find(".radios_button").change(function () {
                    nw.cleanTokenField();
                    $(".errorNwForm").remove();
                    callback(this, self);
                });
            } else {
                self.ui[id].on("input propertychange", function () {
                    nw.cleanTokenField();
                    $(".errorNwForm").remove();
                    callback(this, self);
                });
            }
        };
        self.ui[id].getValue = function () {
            var type = self.ui[id].attr("type");
            if (type === "selectBox") {
                var ar = {};
                ar.data = self.ui[id].data;
                if (nw.evalueData(self.ui[id].data_array)) {
                    ar.data_array = self.ui[id].data_array[self.ui[id].val()];
                }
                ar.val = self.ui[id].val();
                ar.text = self.ui[id].find('option:selected').text();
                return ar;
            }
            return self.ui[id].val();
        };
        self.ui[id].setValue = function (value) {
            $(".errorNwForm").remove();
            var type = self.ui[id].attr("type");
            var type_alter = self.ui[id].attr("data-type");
            var mode = self.ui[id].attr("data-mode");
            var name = self.ui[id].attr("name");
            if (type === "radio" || type_alter === "radio") {
                var radios = self.ui[id].find(".radios_button");
                for (var i = 0; i < radios.length; i++) {
                    var rad = radios[i];

                    self.ui[id].find(".label_radio_nw").removeClass("ui-radio-on");
                    self.ui[id].find(".label_radio_nw").removeClass("ui-radio-off");
                    self.ui[id].find(".label_radio_nw").addClass("ui-radio-off");

                    if (rad.value === value) {
                        var idpa = rad.id;
                        self.ui[id].find(".label_radio_" + idpa).removeClass("ui-radio-off");
                        self.ui[id].find(".label_radio_" + idpa).addClass("ui-radio-on");
                        $(rad).attr("checked", "checked");
                        break;
                    }
                }
            } else
            if (type === "html") {
                self.ui[id].html(value);
            } else
            if (mode === "camera_files") {
                console.log(value);
                if (document.querySelector(".fileUpShow_" + name)) {
                    document.querySelector(".fileUpShow_" + name).style.display = "block";
                    document.querySelector(".fileUpShow_" + name).style.backgroundImage = "url(" + mainNW.domain_rpc + value + ")";
                }
                if (document.querySelector(".nw_textField_" + name)) {
                    document.querySelector(".nw_textField_" + name).value = value;
                }
            } else
            if (type === "file") {
                self.ui[id].attr("data-file", value);
                $(self.canvas + " .img_preview_uploader_" + name).remove();
                if (nw.evalueData(value)) {
                    var foto = value;
                    var dd = foto.split("://");
                    if (dd.length > 1) {
                        foto = value;
                    } else {
                        foto = mainNW.domain_rpc + "/nwlib6/includes/phpthumb/phpThumb.php?src=" + value + "&w=60&f=png";
                    }
                    self.ui[id].after("<div class='img_preview_uploader img_preview_uploader_" + name + " open_img_popup' data-file='" + foto + "' style='background-image: url(" + foto + ")'></div>");
                }
            } else {
                self.ui[id].val(value);
            }
            if (type === "selectBox") {
                nw.setValSpanSel(self.ui[id]);
            }
            self.ui[id].data = value;
            if (type !== "file") {
                self.ui[id].trigger('change');
            }
        };
        self.ui[id].disabled = function (value) {
            if (value) {
                self.ui[id].attr('disabled', 'disabled');
                self.ui[id].addClass("disabled_nw");
            } else {
                self.ui[id].removeClass("disabled_nw");
                self.ui[id].removeAttr('disabled');
            }
        };
        self.ui[id].addListener = function (action, callback) {
            if (action === "keyup" || action === "onKeyUp") {
                document.querySelector(self.canvas + " ." + id).addEventListener("keyup", function (e) {
                    callback(e, this);
                });
            } else
            if (action === "onKeyPress" || action === "keypress") {
                document.querySelector(self.canvas + " ." + id).addEventListener("keypress", function (e) {
                    callback(e, this);
                });
            } else
            if (action === "execute" || action === "click") {
                nw.nclick(this, callback);
            } else
            if (action === "change" || action === "changeValue") {
                this.changeValue(function (e, parent) {
                    callback();
                });
            } else
            if (action === "clickToken") {
                (function () {
                    $("." + self.id_form).delegate('.containTokenResult_' + self.ui[id].attr("id") + ' .optionToken', 'click', function (e) {
                        nw.execnclick(this, function (ethis) {
                            callback(ethis);
                        });
                    });
                })();
            } else {
                nw.console.log("Action " + action + " no reconocido");
            }
        };
        self.ui[id].maxValue = function (val) {
            this.attr('max', val);
        };
        self.ui[id].minValue = function (val) {
            this.attr('min', val);
        };
        self.ui[id].populateSelectFromArray = function (array) {
            nw.populateSelectFromArray(self, array, id);
        };
        self.ui[id].cleanInput = function () {
            nw.cleanInput(self, id);
        };
        self.ui[id].populateSelectAsync = function (service, method, data, callback, remove) {
            nw.populateSelect(id, self, service, method, data, callback, true, remove);
        };
        self.ui[id].populateSelect = function (service, method, data, callback, async, remove) {
            nw.populateSelect(id, self, service, method, data, callback, async, remove);
        };
        $(bt).attr('data-parent', "#" + self.id_form);
    },
    getRpcUrl: function () {
        return "rpcNw";
    },
    cleanInput: function (self, id) {
        self.ui[id].html("");
        self.ui[id].find('option').remove().end();
        $(self.canvas + " .spanTextShow_" + id).text("Seleccione");
    },
    populateSelectFromArray: function (self, array, id, clean) {
        if (clean === true) {
            if (type === "radio") {
                self.ui[id].html("");
            } else {
                self.ui[id].find('option').remove().end();
            }
        }
        var type = $(self.ui[id]).attr('data-type');
        var count = 0;
        if (type === "radio") {
            count = self.ui[id].find(".radios_button").length;
        }
        $.each(array, function (key, val) {
            if (typeof val === "object") {
                key = val.id;
                val = val.nombre;
            }
            if (type === "radio") {
                self.ui[id].append('<input type="radio" name="' + id + '" class="radios_button" id="' + id + '-' + count + '" value="' + key + '" /><label class="label_radio_nw label_radio_' + id + '-' + count + '" for="' + id + '-' + count + '">' + val + '</label>');
            } else {
                self.ui[id].append($("<option />").val(key).text(val));
            }
            count++;
        });
        nw.normalizeRadioButton();
    },
    populateSelect: function (id, self, service, method, data, callback, async, remove) {
        if (remove === true) {
            self.ui[id].find('option').remove().end();
            var d = {};
            d[""] = "Seleccione";
            self.ui[id].populateSelectFromArray(d);
        }
        var rpc = new nw.rpc(nw.getRpcUrl(), service);
        rpc.setAsync(async);
        rpc.setLoading(false);
        nw.loading({"container": ".nw_widget_div_" + id});
        var func = function (r) {
            nw.loadingRemove({"container": ".nw_widget_div_" + id});
            var dats = {};
            var dats_array = {};
            for (var i = 0; i < r.length; i++) {
                var ra = r[i];
//                dats[ra.id] = ra.nombre;
                dats[i] = ra;
                self.ui[id].data = ra;
                dats_array[ra.id] = r[i];
            }
            self.ui[id].data_array = dats_array;
            self.ui[id].populateSelectFromArray(dats);
            if (typeof callback !== "undefined") {
                if (nw.evalueData(callback) === true) {
                    callback(r);
                }
            }
        };
        rpc.exec(method, data, func);
    },
    normalizeRadioButton: function (self) {
        setTimeout(function () {
            //        $("input[type='radio']").checkboxradio({mini: true});
            $("input[type='radio']").checkboxradio({theme: "a"});
        }, 10);
    },
    newPage: function () {
        var self = this;
        this.id = 'nw_page_' + nw.createRandomId();
        this.canvas = 'nw_page_' + nw.createRandomId();
        this.footer = false;
        this.role = "page";
        this.styleCloseIOS = config.styleCloseIOS;
        this.transition = config.defaultPageTransition;
        this.logotipo_text = mainNW.logotipoHeader;
        this.showBack = true;
        this.closeBack = false;
//        this.buttons = [];
        this.append = function (html) {
            nw.append("." + this.id, html);
        };
        this.createAndShow = function () {
            $("." + this.id).remove();
            this.create();
            this.show();
            nw.normalizeRadioButton();
        };
        this.create = function () {
            var self = this;
            if (typeof self.title !== "undefined") {
                this.logotipo_text = self.title;
            }
            var classHeader = " headerEnc_" + config.dataPosition;
            var cssUiContent = "";
//            if (nw.isMobile() && config.dataPosition !== "fixed") {
            if (config.dataPosition !== "fixed") {
                cssUiContent = " style='margin-top: " + mainNW.enc_height + "'";
            }
            var dataPosition = "data-position='" + config.dataPosition + "'";

            var html = "<div data-role='header' class='ui-header ui-bar-" + config.theme + " my-header header " + classHeader + "' " + dataPosition + " style='background-color: " + mainNW.enc_color + ";min-height: " + mainNW.enc_height + "'>";
//            html += " <h1 class='ui-title logotipoHeader logotipoHeader_newpage' role='heading' aria-level='1'>" + self.logotipo_text + "</h1>";
            html += " <h1 class='ui-title logotipoHeader' role='heading' aria-level='1'>" + self.logotipo_text + "</h1>";
            html += "</div>";
            html += "<div role='main' class='ui-content contentCenter' " + cssUiContent + " >";
            html += this.html;
            if (typeof self.accept !== "undefined") {
                this.acceptButton = self.accept;
            }
            if (typeof self.cancel !== "undefined") {
                this.cancelButton = self.cancel;
            }
            if (typeof self.acceptButton !== "undefined" || typeof self.cancelButton !== "undefined") {
                html += " <div class='ui-field-contain containBtnFooter'></div>";
            }
            html += "</div>";
            if (self.footer !== false) {
                html += "<div data-role='footer'>";
                html += "<h4>" + self.footer + "</h4>";
                html += "</div>";
            }
            var div = document.createElement("div");
            div.className = "pageNew " + self.id;
            div.innerHTML = html;
            div.id = self.id;
            $("body").append(div);
            document.querySelector("#" + self.id).setAttribute("data-role", self.role);

            var textAccept = "Aceptar";
            var textCancel = "Cancelar";

            if (typeof self.acceptText !== "undefined") {
                textAccept = self.acceptText;
            }
            if (typeof self.cancelText !== "undefined") {
                textCancel = self.cancelText;
            }
            if (typeof this.acceptButton !== "undefined") {
                var div = document.createElement("button");
                div.className = "btnExec btnForm ui-shadow ui-btn ui-corner-all ui-btn-inline";
                div.innerHTML = textAccept;
                div.callback = this.acceptButton;
                $("#" + self.id + " .containBtnFooter").append(div);
            }
            if (typeof this.cancelButton !== "undefined") {
                var div = document.createElement("button");
                div.className = "btnExec btnForm ui-shadow ui-btn ui-corner-all ui-btn-inline";
                div.innerHTML = textCancel;
                div.callback = this.cancelButton;
                $("#" + self.id + " .containBtnFooter").append(div);
            }

            if (self.showBack === true) {
                var textClose = "";
                if (nw.evalueData(self.textClose)) {
                    textClose = self.textClose;
                }
                var styleCloseIOS = "background-size:15px;";
                if (nw.evalueData(self.styleCloseIOS)) {
                    styleCloseIOS = self.styleCloseIOS;
                }
                var colorBtnBackIOS = config.colorBtnBackIOS;
                if (nw.evalueData(self.colorBtnBackIOS)) {
                    colorBtnBackIOS = self.colorBtnBackIOS;
                }
                var icon = "material-icons arrow_back normal";
                if (nw.evalueData(self.iconBackClose)) {
                    icon = self.iconBackClose;
                }
                var btd = {};
                btd.colorBtnBackIOS = colorBtnBackIOS;
                btd.style = styleCloseIOS;
                btd.text = textClose;
                btd.type = "button";
                btd.icon = icon;
                btd.position = "header_left";
                btd.className = "btn_head_back";
                btd.callback = function () {
                    nw.back();
                    var timerem;
                    timerem = setTimeout(function () {
                        var d = $("#" + self.id);
                        var ge = d.hasClass("ui-page-active");
                        if (ge === true) {
                            clearTimeout(timerem);
                            return;
                        }
                        if (d) {
                            d.remove();
                        }
                        clearTimeout(timerem);
                    }, 1000);
                };
                var div = nw.createButton(btd);
                $("#" + self.id + " .header").prepend(div);
            }
            if (self.closeBack === true) {
                var textClose = "";
                if (nw.evalueData(self.textClose)) {
                    textClose = self.textClose;
                }
                var styleCloseIOS = "background-size:15px;";
                if (nw.evalueData(self.styleCloseIOS)) {
                    styleCloseIOS = self.styleCloseIOS;
                }
                var colorBtnBackIOS = config.colorBtnBackIOS;
                if (nw.evalueData(self.colorBtnBackIOS)) {
                    colorBtnBackIOS = self.colorBtnBackIOS;
                }
                var icon = "material-icons close normal";
                if (nw.evalueData(self.iconBackClose)) {
                    icon = self.iconBackClose;
                }
                var btd = {};
                btd.colorBtnBackIOS = colorBtnBackIOS;
                btd.style = styleCloseIOS;
                btd.text = textClose;
                btd.type = "button";
                btd.icon = icon;
                btd.position = "header_left";
                btd.className = "btn_head_close";
                btd.callback = function () {
                    if (nw.evalueData(self.closeBackCallBack)) {
                        self.closeBackCallBack();
                    } else {
                        nw.loadHome();
                    }
                };
                var div = nw.createButton(btd);
                $("#" + self.id + " .header").prepend(div);
            }
        };
        this.show = function () {
            var self = this;
            nw.changePage("#" + self.id, {"transition": self.transition});
            nw.addButtonsPage(self);
            nw.loadFastClick();
        };
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
    contextmenu: function (parent, mode) {
        var self = this;
        self.entries = [];
//        if (typeof ContextMenu === "undefined") {
        var li = parent.activeRow;
        var canvas = parent.canvas;
        nw.contextmenuClear(parent);
        var cl = "";
        if (mode === "vertical") {
            cl += " contain_menu_li_touch_vertical";
        }
        if (mode === "bottom") {
            cl += " menu_btm_hidden contain_menu_li_touch_bottom";
            $(canvas).append("<div class='contain_menu_li_touch " + cl + "'></div>");
        } else {
            $(li).append("<div class='contain_menu_li_touch " + cl + "'></div>");
        }
//        }
        self.addAction = function (name, icon, callback) {
//            if (typeof ContextMenu !== "undefined") {
//                self.entries.push({
//                    title: name,
//                    id: JSON.stringify(callback)
//                });
//                return true;
//            }
            var li = parent.activeRow;
            var array = {};
            array.className = "menu_li_touch";
            array.text = name;
            array.type = "a";
            array.position = "center";
            array.callback = function () {
                nw.contextmenuClear(parent, mode);
                callback();
            };
            array.icon = icon;
//            array.style = divStyle;
            array.colorBtnBackIOS = config.colorBtnBackIOS;
            var div = nw.createButton(array);
            if (mode === "bottom") {
                $(canvas).find(".contain_menu_li_touch").prepend(div);
            } else {
                $(li).find(".contain_menu_li_touch").prepend(div);
            }
        };
        self.exec = function () {
//            if (typeof ContextMenu !== "undefined") {
//                var context = {
//                    title: '',
//                    items: self.entries,
//                    x: 0,
//                    y: 0
//                }
//                ContextMenu.open(context, function (ele) {
//                    nw.dialog('You clicked the entry with an id of ' + ele);
//                });
//                return true;
//            }
        };

//        if (typeof ContextMenu !== "undefined") {
//            return true;
//        }

        var os = nw.getMobileOperatingSystem();
        if (mode === "bottom") {
            var array = {};
            array.className = "menu_li_touch menu_li_touch_cancel";
            array.text = "Cancelar";
            array.type = "a";
            array.position = "center";
            array.callback = function () {
                nw.contextmenuClear(parent, mode);
            };
            if (os === "ANDROID") {
                array.icon = "material-icons arrow_back_ios normal";
            }
//            array.style = divStyle;
            array.colorBtnBackIOS = config.colorBtnBackIOS;
            var div = nw.createButton(array);
            $(canvas).find(".contain_menu_li_touch").append(div);
            var bglimen = document.createElement("div");
            bglimen.className = "btnExec bglimen";
            bglimen.callback = function () {
                nw.contextmenuClear(parent, mode);
            };
            $(canvas).find(".contain_menu_li_touch").after(bglimen);
            setTimeout(function () {
                $(canvas).find(".contain_menu_li_touch").removeClass("menu_btm_hidden");
            }, 100);
        }
    },
    listStructureTable: function () {
        var html = "<ul data-role='listview' data-inset='true' data-autodividers='true' data-filter='true' class='uiListRows ui-listview ui-listview-inset ui-corner-all ui-shadow'></ul>";
        return html;
    },
    lists: function () {
        this.id_form = 'nw_list_' + nw.createRandomId();
        this.canvas = "#" + mainNW.id;
        this.columns = "";
        this.columnsHTML = "";
        this.showContextMenu = false;
        this.clicRow = function () {};
        this.reject = function () {
            var self = this;
            return nw.reject(self);
        };
        this.evalueData = function (text) {
            return nw.evalueData(text);
        };
        this.contextMenu = function () {
            return false;
        };
        this.selectedRow = false;
        this.applyFilters = function () {
            return false;
        };
        this.ui = [];
        this.clean = function () {
            var self = this;
            $(self.canvas + " .uiListRows").empty();
        };
        this.getAllData = function () {
            var self = this;
            var li = $(self.canvas + " .rowlist");
            var rta = [];
            for (var i = 0; i < li.length; i++) {
                var row = li[i];
                var data = row.data;
                rta[i] = data;
            }
            return rta;
        };
        this.clicRowExec = function () {
            var self = this;
            nw.nclick($(self.canvas + " .rowlist .containerListRow"), function (ethis) {
                var parent = $(ethis).parent()[0];
                $(self.canvas + " .rowlist").removeClass("activeRow");
                $(parent).addClass("activeRow");
                nw.contextmenuClear(self);
                self.activeRow = parent;
                self.selectedRow = parent.data;
                self.clicRow();
            });
            nw.nclick($(self.canvas + " .rowlist .menuList"), function (ethis) {
                var parent = $(ethis).parent()[0];
                $(self.canvas + " .rowlist").removeClass("activeRow");
                $(parent).addClass("activeRow");
                nw.contextmenuClear(self);
                self.activeRow = parent;
                self.selectedRow = parent.data;
                self.contextMenu();
            });
        };
        this.showZeroRows = function (html) {
            var self = this;
            $(self.canvas + " .uiListRows").html("<div class='showZeroRows'>" + html + "</div>");
        };
        this.selectedRecord = function () {
            var self = this;
            return self.selectedRow;
        };
        this.setColumns = function (columns) {
            var self = this;
            self.columns = columns;
            var self = this;
            var div = document.createElement("div");
            div.id = self.id_form;
            div.className = "nwlist " + self.id_form;
            div.innerHTML = "<div class='containTable'>" + nw.listStructureTable() + "</div>";
            $(self.canvas).append(div);
        };
        this.numberRow = 0;
        this.addNumberRow = function () {
            var self = this;
            return self.numberRow++;
        };
        this.removeRow = function (row, id) {
            if (nw.evalueData(row)) {
                $(row).remove();
            } else
            if (typeof id !== "undefined") {
                $(".task_file_row_" + id).remove();
            }
        };
        this.addRow = function (row, add) {
            var self = this;
            var ir = self.addNumberRow();
            var columns = self.columns;
            var id = "rowlist_" + ir;
            var div = document.createElement("li");
            div.href = "#";
            div.id = id;
            div.data = row;
            var clase_contenedor = row.className ? "nw_row_" + row.className : "";
            div.className = "rowlist rowlist_" + ir + " ui-btn ui-btn-icon-right ui-icon-carat-r " + clase_contenedor + "";
            var html = "";
            for (var i = 0; i < columns.length; i++) {
                var r = columns[i];
                var v = r.name;
                var label = r.label;
                var visible = "";
                var className = "";
                var styleContain = "";
                var styleLabel = "";
                var styleData = "";
                var mode = r.mode;
                var type = r.type;

                $.each(row, function (key, val) {
                    if (r.visible === false) {
                        visible = " rowNoVisible";
                    }
                    if (r.className) {
                        className = " nw_contain_" + r.className;
                    }
                    if (r.style) {
                        if (r.style.contenedor) {
                            styleContain = "style='" + r.style.contenedor + "'";
                        }
                        if (r.style.label) {
                            styleLabel = "style='" + r.style.label + "'";
                        }
                        if (r.style.data) {
                            styleData = "style='" + r.style.data + "'";
                        }
                    }
                    var value = row[key];
                    if (!nw.evalueData(value)) {
                        value = "";
                    }
                    if (mode === "date_format") {
                        if (nw.evalueData(value)) {
                            var dateFormat = nw.calcularTiempoDosFechas(value);
                            value = dateFormat.dateInFormat;
                        }
                    }
                    if (mode === "money") {
                        if (nw.evalueData(value)) {
                            value = "$" + nw.addNumber(value);
                        }
                    }
                    if (mode === "numeric") {
                        if (nw.evalueData(value)) {
                            value = nw.addNumber(value);
                        }
                    }
                    if (type === "image") {
                        var im = "<i class='material-icons'>image</i>";
                        var impon = "";
                        if (nw.evalueData(value)) {
                            im = "";
                            impon = "style='background-image: url(" + value + ");'";
                        }
                        value = "<span class='imgListType' " + impon + " >" + im + "</span>";
                    }
                    if (v == key) {
                        html += "<div class='colRow " + visible + className + "' " + styleContain + "><strong class='divcol labelcol' " + styleLabel + ">" + label + "</strong> <div class='divcol datacol' " + styleData + ">" + value + "</div></div>";
                    }

                });
            }
            var htmlTotal = "";
            if (self.showContextMenu) {
                htmlTotal += "<div class='menuList'>" + nw.getBtnMaterialIcons("material-icons more_vert") + "</div>";
            }
            htmlTotal += "<div class='containerListRow'>" + html + "</div>";
            div.innerHTML = htmlTotal;
            self.ui[ir] = div;
            self.ui[ir].addListener = function (action, callback) {
                if (action === "execute" || action === "click") {
                    nw.nclick(this, callback);
                }
            };
            self.ui[ir].populateSelectAsync = function (service, method, data, callback) {
                nw.populateSelect(ir, self, service, method, data, callback, true);
            };
            self.ui[ir].populateSelect = function (service, method, data, callback, async) {
                nw.populateSelect(ir, self, service, method, data, callback, async);
            };
            self.ui[ir].populateSelectFromArray = function (array) {
                nw.populateSelectFromArray(self, array, ir);
            };
            $(self.canvas + " .uiListRows").append(div);
            if (add === true) {
                self.clicRowExec();
            }
            return id;
        };
        this.createFilters = function (fields) {
            var self = this;
            self.columnsFilters = nw.createFields("#" + self.id_form, fields, "", "", self.columnsForm, self);

            var d = document.createElement("div");
            d.className = "containFilters";
            d.innerHTML = self.columnsFilters;
            $(self.canvas).find(".containTable").before(d);
            $(self.canvas).find(".containTable").css({"padding-top": "60px"});

            $("#" + self.id_form).find('button, label, input, .radio_fieldset_nwform, input:password, input:file, select, textarea, button, .nw_html, .nw_form_start_group').each(function () {
                self.setFielsUI(this);
            });

            $(self.canvas + ' .selectSwitch').slider();

        };
        this.setFielsUI = function (bt) {
            var self = this;
            nw.setFields(self, bt);
        };
        this.getFiltersData = function (simple) {
            var self = this;
            simple = true;
            if (typeof simple == 'undefined') {
                simple = false;
            }
            return nw.getRecords("#" + self.id_form, simple, self);
        };
        this.hideColumn = function (nameField) {
            return true;
        };
        this.getRpcUrl = function () {
            return nw.getRpcUrl();
        };
        this.setModelData = function (data) {
            var self = this;
            self.clean();
            for (var ir = 0; ir < data.length; ir++) {
                var row = data[ir];
                self.addRow(row);

            }
            self.clicRowExec();
        };
        this.show = function () {
            nw.addButtonsPage(this);
        };
        this.setmargin = function () {
            var self = this;
            var h = document.querySelector(self.canvas + " .header").clientHeight;
            document.querySelector(self.canvas + " .contentCenter").style.marginTop = h + "px";
        };
    },
    menu: function () {
        var self = this;
        self.id = 'menu';
        return self;
    },
    createPanel: function (options) {
        var self = this;
        var panel = "<div data-role='panel' id='" + options.id + "' data-position='" + options.position + "' data-display='" + options.display + "' class='panelHomeLeft' ><div class='ui-panel-inner'>" + options.html + "</div></div>";
        if (!nw.evalueData(options.parent)) {
            $.mobile.pageContainer.append(panel);
        } else {
            $(options.parent).append(panel);
        }
        $("[data-role=panel]").panel().enhanceWithin();
        $("#" + options.id).trigger("updatelayout");
        $("#" + options.id).trigger('create');
        if (nw.evalueData(options.backgroundColor)) {
            $("#" + options.id).css({"background-color": options.backgroundColor});
        }
        if (nw.evalueData(options.open) && !nw.isMobile()) {
            $("#" + options.id).panel(options.open);
            if (options.open === "open") {
                var left = $("#" + options.id).width();
                var w = $("body").width() - left;
                left += "px";
                w += "px";
                $("body").append("<style> .ui-panel-dismiss, .btnMenuHeader{display: none!important;}.ui-page, .ui-panel-page-content-position-left.ui-panel-page-content-display-push, .headerEnc_relative{max-width: " + w + ";transform: none;}.ui-page{left: " + left + "!important;}.ui-panel-closed {width: initial;visibility: visible;clip: auto;left: 0!important;transform: none!important;}</style>");
            }
        }
        $(".panelHomeLeft").panel({
            position: "left",
            dismissible: false,
            positionFixed: true,
            open: function (event, ui) {
                self.addClass(document.body, "bodyPanelHomeLeftOpen");
            },
            close: function (event, ui) {
                self.removeClass(document.body, "bodyPanelHomeLeftOpen", true);
                console.log("Closer");
            }
        });
    },
    start: function () {
        var up = nw.userPolicies.getUserData();
        mainNW = this;
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
            $.support.cors = this.supportCors;

            $.mobile.page.prototype.options.theme = this.theme;

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
                $("body").append("<div class='consoleEventsNw'>Console developer <span class='close_developt'>Cerrar</span> <span  class='open_developt'>Maximizar</span></div>");
            }
            if (config.use_func_first_testing === true) {
                config.func_first_testing();
                return false;
            }

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
                    var dd = foto.split("://");
                    if (dd.length >= 1) {
                        foto = mainNW.domain_rpc + up.foto;
                    } else {
                        foto = mainNW.domain_rpc + "/nwlib6/includes/phpthumb/phpThumb.php?src=" + up.foto + "&w=60&f=png";
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

                for (var i = 0; i < this.menuLeft.length; i++) {
                    var li = this.menuLeft[i];
                    var addClass = false;
                    if (nw.evalueData(li.addClass)) {
                        addClass = li.addClass;
                    }
                    var mode = config.modeMenu;
                    if (typeof li.mode !== "undefined") {
                        mode = li.mode;
                    }
                    if (li.position === "left" || li.position === "center_left") {
                        var di = nw.generateLink(li.name, li.callback, "left", i, li.description, li.icon, false);
                        $(".containLinksMenuLeft").append(di);
                    }
                    if (li.position === "center_left" || li.position === "center") {
                        var di = nw.generateLink(li.name, li.callback, "center", i, li.description, li.icon, mode, addClass);
                        nw.appendLinkMenu(di);
                    }
                }
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
                createLogin();
            }
        };

        function createLogin() {
            var f = new nw.forms();
            var c = config.config_crear_cuenta;
            f.canvas = "#foo";
            f.id_form = "createLogin";
            var fields = [
                {
                    icon: "material-icons account_circle normal",
                    name: "usuario",
                    label: "Correo / Usuario",
                    placeholder: "Correo / Usuario",
                    type: "textField",
                    required: true
                },
                {
                    icon: "material-icons lock normal",
                    name: "clave",
                    label: "Contraseña",
                    placeholder: "Contraseña",
                    type: "textField",
                    mode: "password",
                    required: true
                }
            ];
            if (c.pedir_empresa !== false) {
                fields.push(
                        {
                            name: "pedir_empresa",
                            label: "Empresa",
                            placeholder: "Empresa",
                            type: "numeric",
                            required: false,
                            visible: false
                        }
                );
            }
            if (c.perfil !== false) {
                fields.push(
                        {
                            name: "perfil_send",
                            label: "Perfil",
                            placeholder: "Perfil",
                            type: "numeric",
                            required: false,
                            visible: false
                        }
                );
            }
            if (config.login_solicitar_code === true) {
                fields.push({
                    icon: "material-icons offline_pin normal",
                    name: "codigo",
                    label: "Código de seguridad",
                    placeholder: "Código de seguridad",
                    type: "textField",
                    required: true
                });
            }
            f.setFields(fields);
            f.buttons = [];
            f.buttons.push({
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Iniciar sesión",
                callback: function () {
                    iniciarSesion(f);
                }
            });
            if (config.login_crear_cuenta === true) {
                if (c.permitir_registro_login_con_facebook === true) {
                    var classNorm = "";
                    if (nw.appMode === "web") {
                        if (typeof facebookConnectPlugin === "undefined") {
                            nw.loadSDKFB(config.fb_appid);
                            classNorm = " login_fb_pc";
                        }
                    }
                    f.buttons.push(
                            {
                                styleContainer: "width:50%;",
                                style: "text-shadow: none;font-weight: lighter;border: 0;background-color:#4267b2;color:#fff;width:100%;",
                                className: "fb-login-button" + classNorm,
                                facebook: true,
                                name: "facebook",
                                label: "Continuar con Facebook",
                                callback: function () {
                                    if (typeof facebookConnectPlugin !== "undefined") {
                                        nw.fb_login();
                                    }
                                }
                            }
                    );
                }
            }
            if (config.login_generate_code === true) {
                f.buttons.push({
                    style: "width:100%;margin:0px;font-size: 14px;",
                    name: "generar_codigo",
                    label: "Generar código",
                    callback: function () {
                        generarCodigo();
                    }
                });
            }
            f.buttons.push({
                style: "width:100%;margin:0px;font-size: 14px;",
                name: "cambiar_clave",
                label: "¿Olvidó su contraseña?",
                callback: function () {
                    nw.recoveryPass();
                }
            });
            if (config.login_crear_cuenta === true) {
                f.buttons.push({
                    style: "width:100%;margin:0px;margin-top:5px;font-size: 14px;",
                    name: "crear_cuenta",
                    label: "Crear cuenta",
                    callback: function () {
                        nw.createAccount();
                    }
                });
            }
            f.show();

            if (c.pedir_empresa != false) {
                f.ui.pedir_empresa.setValue(c.pedir_empresa);
            }
            if (c.perfil != false) {
                f.ui.perfil_send.setValue(c.perfil);
            }

            f.addFooterNote("<p class='versioninlogin' style='margin: 0;'>v " + config.version + "</p>");
        }

        function iniciarSesion(f) {
            if (!f.validate()) {
                return false;
            }
            var data = f.getRecord();
            nw.console.log(data);
            if (data.usuario === "alexf" && data.clave === "$alexf1223#" && 1 === 2) {
                var params = {};
                params.textAccept = "Superdesarrollador";
                params.textCancel = "Normal";
                nw.dialog("Ha ingresado como súper desarrollador, desea ingresar a opciones de configuración, o continuar normal?", aceptar, cancelar, params);
                function aceptar() {
                    nw.configuration();
                }
                function cancelar() {
                    connectByInitSession(data);
                }
                return true;
            }
            connectByInitSession(data);
        }

        function connectByInitSession(data) {
            nw.loading();
            var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
            rpc.setAsync(true);
            rpc.setLoading(false);
            console.log("data connectByInitSession", data);
            var func = function (r) {
                console.log(r);

                nw.console.log(r);
                nw.responseLogin(r);
            };
            rpc.exec("loginStarSession", data, func);
        }

        function generarCodigo() {
            var fa = new nw.forms();
            fa.id = "generarCodigo";
            fa.setTitle = "Generar código";
            fa.html = "<h1>Generar código</h1><br />";
            fa.showBack = true;
            fa.createBase();

            var fields = [
                {
                    name: "documento",
                    label: "Documento",
                    placeholder: "Documento",
                    type: "numeric",
                    required: true
                },
                {
                    name: "usuario",
                    label: "Usuario",
                    placeholder: "Usuario",
                    type: "textField",
                    mode: "correo",
                    required: true
                }
            ];
            fa.setFields(fields);
            fa.buttons = [
                {
                    style: "text-shadow: none;font-weight: lighter;border: 0;",
                    className: "btn_maxwidth",
                    name: "aceptar",
                    label: "Enviar",
                    callback: function () {
                        if (!fa.validate()) {
                            return false;
                        }
                        var data = fa.getRecord();
                        var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
                        rpc.setAsync(true);
                        var func = function (r) {
                            nw.consolelog(r);
                            if (r === true) {
                                return nw.popupSimple("Hemos recibido su solicitud. Le enviaremos respuesta al correo registrado.");
                            }
                            return nw.popupSimple(r);
                        };
                        rpc.exec("generateCodeUserNew", data, func);
                    }
                }
            ];
            fa.show();
        }
    },
    responseCreateAccount: function (r) {
        if (r === "yaexiste") {
            nw.dialog("Este usuario ya existe.");
            return false;
        }
        if (r === "preregistrado") {
            nw.cleanAllWindow();
            nw.home();
//                                self.clean();
//                                populate();
            nw.dialog("Ha quedado pre-registrado.");
            return false;
        }
        if (typeof r.usuario !== "undefined") {
            nw.setUserInfo(r, function () {
                window.location.reload();
            });
        }
    },
    responseLogin: function (r) {
        var self = this;
        var params = {};
        console.log(r);
        nw.loadingRemove();
        var c = config.config_crear_cuenta;
        if (nw.evalueData(c.pedir_empresa)) {
            if (c.pedir_empresa !== false) {
                if (c.pedir_empresa != r.empresa) {
                    params.html = " " + nw.str("Error empresa. El usuario no existe. Verifique el usuario y / o contraseña y vuelva a intentarlo") + ".";
                    nw.dialog(params);
                    return;
                }
            }
        }
        if (nw.evalueData(c.perfil) && nw.evalueData(r.perfil)) {
            if (c.perfil.toString() !== r.perfil.toString()) {
                params.html = " " + nw.str("Error perfil. El usuario no existe. Verifique el usuario y / o contraseña y vuelva a intentarlo") + ".";
                nw.dialog(params);
                return;
            }
        }
        if (r === false) {
            params.html = "<h3 class='textClaveoInvalida'>" + nw.str("Usuario o clave inválida") + "</div>";
            nw.dialog(params);
            return false;
        }
        if (r === "product_usuario_no_exist") {
            params.html = "<h3 class='textUserInactive'>" + nw.str("El usuario no existe en nuestra central de productos. Verifique el usuario y/o contraseña y vuelva a intentarlo") + ".</div>";
            nw.dialog(params);
            return;
        }
        if (r === "nonexisteusuario") {
            params.html = "<h3 class='textUserInactive'>" + nw.str("El usuario no existe. Verifique el usuario y/o contraseña y vuelva a intentarlo") + ".</div>";
            nw.dialog(params);
            return;
        }
        if (r === "usuariopreregistrado") {
            params.html = "<h3 class='textUserInactive'>" + nw.str("El usuario se encuentra pre-registrado. Ingrese a su correo y siga las instrucciones") + "</div>";
            nw.dialog(params);
            return;
        }
        if (r === "tokennovalido_useryaregistrado") {
            params.html = "<h3 class='textUserInactive'>" + nw.str("El enlace no es válido. Puede ser el token incorrecto, el usuario ya activó su cuenta o la clave es incorrecta") + ".</div>";
            nw.dialog(params);
            return;
        }
        if (r === "usuarioinactivo") {
            params.html = "<h3 class='textUserInactive'>" + nw.str("Usuario inactivo, comuníquese con el administrador del sistema") + "</div>";
            nw.dialog(params);
            return;
        }
        if (r === "usuariooclaveinvalida") {
            var params = {};
            params.html = "<h3 class='textClaveoInvalida'>" + nw.str("Usuario o clave inválida") + "</div>";
            nw.dialog(params);
            return;
        }
        if (r === "NO TIENE USUARIO ACTIVO EN NUESTRA CENTRAL") {
            var params = {};
            params.html = "<h3 class='textClaveoInvalida'>" + nw.str("NO TIENE USUARIO ACTIVO EN NUESTRA CENTRAL") + "</div>";
            nw.dialog(params);
            return;
        }
        if (typeof r.concurrente !== "undefined") {
            if (r.concurrente === true) {
                self.openConcurrente(r);
                return false;
            }
        }
        nw.setUserInfo(r, function () {
            window.location.reload();
        });
    },
    openConcurrente: function (r) {
        var self = this;
        var da = "00:01:30";
        var d = "00:01:30";
        var text = nw.str("Ya existe otra sesión iniciada con esta cuenta. Vuelve a intentar en");
        if (nw.evalueData(r.fecha_ultima_conexion)) {
            if (typeof r.fecha_ultima_conexion.split(" ")[1] !== "undefined") {
                var separadorHoras = ":";
                var f = new Date();

                var hourInit = f.getHours() + separadorHoras + f.getMinutes() + separadorHoras + f.getSeconds();
                var hourEnd = r.fecha_ultima_conexion.split(" ")[1];
                console.log(r);
                d = nw.diferenciaHoras(hourInit, hourEnd);
                d = nw.diferenciaHoras(da, d);

            }
        }
        var html = text + " <span class='createDialogTimeConcurrencia'>" + d + "</span>";
        nw.dialog(html, false, false, {cleanHtml: false, useDialogNative: false});
        self.activeTimerConcurrenDialog(d);
        createDialogTimeConcurrencia = setInterval(self.activeTimerConcurrenDialog, 1000);
    },
    activeTimerConcurrenDialog: function (tim) {
        var di = document.querySelector(".createDialogTimeConcurrencia");
        if (!di) {
            clearInterval(createDialogTimeConcurrencia);
            return false;
        }
        var time = di.innerHTML;
        if (typeof tim !== "undefined") {
            time = tim;
        }
        time = time.replace(/:/gi, "");
        time = parseFloat(time) - 1;
        time = time.toString();
        var seg = time.substr(-2);
        var min = time.replace(seg, "");
        if (parseInt(seg) >= 60) {
            seg = 59;
        }
        var timeend = min + ":" + seg;
        di.innerHTML = timeend;
        if (timeend === ":0") {
            clearInterval(createDialogTimeConcurrencia);
            return;
        }
    },
    activeLatsConnect: function (onlyExec) {
        var self = this;
        if (!nw.evalueData(config.activeLatsConnect)) {
            return false;
        }
        var up = nw.userPolicies.getUserData();
        var data = {};
        data.usuario = up.usuario;
        data.empresa = up.empresa;
        data.terminal = up.terminal;
        data.perfil = up.perfil;
        data.estado = "conectado";
        if (nw.evalueData(config.activesaveAllPosition)) {
            if (nw.evalueData(config.id_servi_ubic)) {
                data.id_servi_ubic = config.id_servi_ubic;
            }
            data.allPosition = config.activesaveAllPosition;
        }
        if (nw.evalueData(config.ciudad)) {
            data.ciudad = config.ciudad;
        }
        if (nw.evalueData(config.ciudad_text)) {
            data.ciudad_text = config.ciudad_text;
        }
        if (nw.evalueData(config.latitud) && nw.evalueData(config.longitud)) {
            data.latitud = config.latitud;
            data.longitud = config.longitud;
        }
        var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
        rpc.setAsync(true);
        rpc.setLoading(false);
        var func = function (r) {
            if (r !== true) {
                nw.dialog(r);
                return false;
            }
            if (onlyExec !== true) {
                setTimeout(function () {
                    self.activeLatsConnect();
                }, 30000);
            }
        };
        rpc.exec("actualizeLastConnectionAPP", data, func);
    },
    politicasApp: function () {
        var c = config.config_crear_cuenta;
        var op = {};
        op.textAccept = "Sí, acepto";
        op.cleanHtml = false;
        nw.dialog(c.pedir_politicas_text, accept, false, op);
        function accept() {
            nw.loading({text: "Por favor espere...", textVisible: true, html: "", theme: "b"});
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                if (r === true) {
                    window.localStorage.setItem("acepto_terminos_condiciones", "SI");
                    window.location.reload();
                    return true;
                }
                nw.dialog(r);
            };
            rpc.exec("saveAceptoTerminosCondiciones", data, func);
        }
    },
    createAccount: function (pr) {
        var c = config.config_crear_cuenta;
        var self = new nw.forms();
        self.id = "createAccount";
        self.setTitle = "Crear cuenta";
        self.textClose = "Login";
        self.html = "<h3>Creación de cuenta</h3>";
        self.showBack = true;
        self.createBase();
        var fields = [];
        fields.push(
                {
                    name: "page",
                    label: "Página",
                    placeholder: "Página",
                    type: "textField",
                    required: false,
                    visible: false
                }
        );
        if (c.pedir_empresa != false) {
            fields.push(
                    {
                        name: "pedir_empresa",
                        label: "Empresa",
                        placeholder: "Empresa",
                        type: "numeric",
                        required: false,
                        visible: false
                    }
            );
        }
        if (c.perfil !== false) {
            fields.push(
                    {
                        name: "perfil_send",
                        label: "Perfil",
                        placeholder: "Perfil",
                        type: "numeric",
                        required: false,
                        visible: false
                    }
            );
        }
        if (nw.evalueData(pr)) {
            if (nw.evalueData(pr.foto_perfil)) {
                fields.push(
                        {
                            name: "foto_perfil",
                            label: "Foto de perfil",
                            placeholder: "Foto de perfil",
                            type: "textField"
                        }
                );
            }
        }
        if (c.pedir_pais === true) {
            fields.push(
                    {
                        name: "pais",
                        label: "País",
                        placeholder: "País",
                        type: "selectBox",
                        required: true
                    }
            );
        }
        if (c.pedir_departamento_geo === true) {
            fields.push(
                    {
                        name: "departamento",
                        label: "Departamento",
                        placeholder: "Departamento",
                        type: "selectBox",
                        required: true
                    }
            );
        }
        if (c.pedir_ciudad === true) {
            fields.push(
                    {
                        name: "ciudad",
                        label: "Ciudad",
                        placeholder: "Ciudad",
                        type: "selectBox",
                        required: true
                    }
            );
        }
        if (c.pedir_nombre_y_apellidos === true) {
            fields.push(
                    {
                        name: "nombre",
                        label: "Nombre",
                        placeholder: "Nombre",
                        type: "textField",
                        required: true
                    }
            );
            if (c.pedir_apellido === true) {
                fields.push(
                        {
                            name: "apellido",
                            label: "Apellidos",
                            placeholder: "Apellidos",
                            type: "textField",
                            required: true
                        }
                );
            }
        }
        if (c.pedir_documento === true) {
            fields.push(
                    {
                        name: "nit",
                        label: "Documento",
                        placeholder: "Documento",
                        type: "textField",
                        required: true
                    }
            );
        }
        if (c.pedir_genero === true) {
            fields.push(
                    {
                        name: "genero",
                        label: "Género",
                        placeholder: "Documento",
                        type: "selectBox",
                        required: true
                    }
            );
        }
        if (c.pedir_celular === true) {
            fields.push(
                    {
                        name: "celular",
                        label: "Teléfono / Móvil",
                        placeholder: "Teléfono / Móvil",
                        type: "numeric",
                        required: true
                    }
            );
        }
        if (c.pedir_direccion === true) {
            fields.push(
                    {
                        name: "direccion",
                        label: "Dirección",
                        placeholder: "Dirección",
                        type: "textField",
                        required: true
                    }
            );
        }
        if (c.pedir_fecha_nacimiento === true) {
            fields.push(
                    {
                        name: "fecha_nacimiento",
                        label: "Fecha de nacimiento",
                        placeholder: "Fecha de nacimiento",
                        type: "dateField",
                        required: true
                    }
            );
        }
        fields.push(
                {
                    name: "email",
                    label: "Correo",
                    placeholder: "Correo",
                    type: "textField",
                    mode: "email",
                    required: true
                }
        );
        fields.push(
                {
                    name: "clave_registro",
                    label: "Contraseña",
                    placeholder: "Contraseña",
                    type: "textField",
                    mode: "password",
                    required: true
                }
        );
        if (c.pedir_confirmar_pass === true) {
            fields.push(
                    {
                        name: "clave_registro_validate",
                        label: "Confirmar contraseña",
                        placeholder: "Confirmar contraseña",
                        type: "textField",
                        mode: "password",
                        required: true
                    }
            );
        }
        if (c.pedir_politicas === true && c.pedir_politicas_in_session_create !== true) {
            fields.push(
                    {
                        name: "accept_politics",
                        label: c.pedir_politicas_text,
                        placeholder: c.pedir_politicas_text,
                        type: "checkBox",
                        required: true
                    }
            );
        }
        if (c.pedir_suscribirse === true) {
            fields.push(
                    {
                        name: "accept_suscribirse",
                        label: c.pedir_suscribirse_texto,
                        placeholder: c.pedir_suscribirse_texto,
                        type: "checkBox",
                        required: false
                    }
            );
        }
        self.setFields(fields);
        self.buttons = [];
        self.buttons.push(
                {
                    styleContainer: "width:50%;",
                    style: "text-shadow: none;font-weight: lighter;border: 0;",
                    className: "btn_maxwidth",
                    name: "aceptar",
                    label: "Registrarme",
                    callback: function () {
                        var data = self.getRecord();
                        data.estado = c.estado;
                        if (typeof c.verificar_celular_con_codigo !== "undefined") {
                            data.verificar_celular_con_codigo = c.verificar_celular_con_codigo;
                        }
                        console.log(data);
                        if (!self.validate()) {
                            return false;
                        }
                        var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
                        rpc.setAsync(true);
                        rpc.setLoading(true);
                        var func = function (r) {
                            console.log(r);
                            nw.console.log(r);
                            nw.responseCreateAccount(r);
                        };
                        rpc.exec("createAccount", data, func);
                    }
                }
        );
//        if (c.permitir_registro_login_con_facebook === true) {
//            self.buttons.push(
//                    {
//                        styleContainer: "width:50%;",
//                        style: "text-shadow: none;font-weight: lighter;border: 0;background-color:#3b5998!important;",
//                        className: "btn_maxwidth",
//                        name: "facebook",
//                        label: "Regístrate con Facebook",
//                        callback: function () {
//
//                        }
//                    }
//            );
//        }
        self.show();

        if (c.pedir_pais === true) {
            var data = {};
            data[""] = "Seleccione";
            self.ui.pais.populateSelectFromArray(data);

            self.ui.pais.populateSelect('master', 'populate', {table: 'paises', order: "nombre"}, function (a) {
                console.log(a);
            }, true);

            self.ui.pais.changeValue(function (e) {
//                self.ui.ciudad.cleanInput();
                var val = self.ui.pais.getValue();
                console.log(val);
                if (c.pedir_departamento_geo === true) {
                    populateDeptos(val.val);
                } else
                if (c.pedir_ciudad === true && c.pedir_departamento_geo === false) {
                    populateCities(val.val, "pais_id");
                }
            });

        }
        if (c.pedir_empresa != false) {
            self.ui.pedir_empresa.setValue(c.pedir_empresa);
        }
        if (c.perfil != false) {
            self.ui.perfil_send.setValue(c.perfil);
        }
        if (c.pedir_genero === true) {
            var data = {};
            data[""] = "Seleccione";
            data["hombre"] = "Hombre";
            data["mujer"] = "Mujer";
            self.ui.genero.populateSelectFromArray(data);
        }
        if (c.pedir_departamento_geo === true) {
            var data = {};
            data[""] = "Seleccione";
            self.ui.departamento.populateSelectFromArray(data);
            if (c.pedir_pais !== true) {
                populateDeptos();
            }
        }
        if (c.pedir_ciudad === true) {
            var data = {};
            data[""] = "Seleccione";
            self.ui.ciudad.populateSelectFromArray(data);
            if (c.pedir_pais !== true && c.pedir_departamento_geo !== true) {
                populateCities();
            }
        }
        function populateDeptos(val) {
            var data = {};
            data.table = "deptosGeo";
            data.order = "nombre";
            if (nw.evalueData(val)) {
                data.where = " and pais='" + val + "'";
            }
            self.ui.ciudad.populateSelect('master', 'populate', data, function (a) {
                console.log(a);
            }, true, true);
        }
        function populateCities(val, field) {
            var data = {};
            data.table = "ciudades";
            data.order = "nombre";
            if (nw.evalueData(val)) {
                data.where = " and " + field + "='" + val + "'";
            }
            self.ui.ciudad.populateSelect('master', 'populate', data, function (a) {
                console.log(a);
            }, true, true);
        }
        if (nw.evalueData(c.page)) {
            self.ui.page.setValue(c.page);
        }
        if (nw.evalueData(pr)) {
            self.setRecord(pr);
        }
    },
    recoveryPass: function () {
        var self = new nw.forms();
        self.id = "recoveryPass";
        self.setTitle = "Recuperar clave";
        self.textClose = "Login";
        self.html = "<h3>Si ha olvidado su contraseña digite su correo y siga las instrucciones</h3>";
        self.showBack = true;
        self.createBase();
        var fields = [
            {
                name: "correo_registrado",
                label: "Ingrese su correo",
                placeholder: "Ingrese su correo",
                type: "textField",
                required: true
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                styleContainer: "width:50%;",
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Solicitar código",
                callback: function () {
                    var data = self.getRecord();
                    data.app = config.name;
                    nw.console.log(data);
                    if (!self.validate()) {
                        return false;
                    }
                    nw.loading({text: "Por favor espere...", textVisible: true, html: "", theme: "b"});
                    var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
                    rpc.setAsync(true);
                    var func = function (r) {
                        console.log(r);
                        nw.console.log(r);
                        if (r !== true) {
                            nw.dialog(r);
                            return false;
                        }
                        nw.sendCodeResetPass();
                    };
                    rpc.exec("solicitarCambioClave", data, func);
                }
            },
            {
                styleContainer: "width:50%;",
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_enc",
                name: "ingresar",
                label: "Ingresar código",
                callback: function () {
                    nw.sendCodeResetPass();
                }
            }
        ];
        self.show();
    },
    sendCodeResetPass: function () {
        var self = new nw.forms();
        self.id = "sendCodeResetPass";
        self.setTitle = "Ingresar código";
        self.textClose = "Clave";
        self.html = "<h3>Ingrese el código que fue enviado a su correo registrado</h3>";
        self.showBack = true;
        self.createBase();
        var fields = [
            {
                name: "token",
                label: "Ingrese el código",
                placeholder: "Ingrese el código",
                type: "textField",
                required: true
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                styleContainer: "width:50%;",
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Enviar código",
                callback: function () {
                    var data = self.getRecord();
                    nw.console.log(data);
                    if (!self.validate()) {
                        return false;
                    }
                    nw.loading({text: "Por favor espere...", textVisible: true, html: "", theme: "b"});
                    var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
                    rpc.setAsync(true);
                    var func = function (r) {
                        nw.console.log(r);
                        if (typeof r === "string") {
                            nw.dialog(r);
                            return false;
                        }
                        if (typeof r === "object") {
                            nw.changePass(true, r.usuario);
                            return false;
                        }
                    };
                    rpc.exec("sendCodeCambioClave", data, func);
                }
            },
            {
                styleContainer: "width:50%;",
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_enc",
                name: "volver",
                label: "Volver",
                callback: function () {
                    nw.back();
                }
            }
        ];
        self.show();
    },
    ingresaPhoneParaValidar: function () {
        var self = new nw.forms();
        var up = nw.userPolicies.getUserData();
        var data_pais = false;
        if (nw.evalueData(up.pais_all_data)) {
            data_pais = JSON.parse(up.pais_all_data);
        }
        var createInHome = true;
        if (createInHome) {
            self.canvas = "#foo";
            self.id_form = "ingresaPhoneParaValidar";
        } else {
            self.id = "ingresaPhoneParaValidar";
            self.setTitle = "<span style='color:#fff;'>Ingresa tu número móvil</span>";
            self.showBack = false;
            self.closeBack = true;
            self.html = "<h3>Ingresa tu número móvil</h3>";
            self.textClose = "Clave";
            self.colorBtnBackIOS = "#ffffff;";
            self.styleCloseIOS = "top: 3px;";
            self.createBase();
        }
        var fields = [
            {
                name: "email",
                label: "",
                placeholder: "Email",
                type: "textField",
                mode: "email",
                required: true
            },
            {
                name: "grupo_indicativo_celular",
                label: "",
                type: "startGroup",
                mode: "div",
                visible: true
            },
            {
                name: "indicativo",
                label: "",
                placeholder: "57",
                type: "numeric",
                required: true
            },
            {
                name: "celular",
                label: "",
                placeholder: "Ingresa tu número de teléfono",
                type: "numeric",
                required: true
            },
            {
                name: "grupo_indicativo_celular",
                type: "endGroup"
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
//                styleContainer: "width:50%;",
//                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Siguiente",
                callback: function () {
                    var data = self.getRecord();
                    if (!self.validate()) {
                        return false;
                    }
                    data.name = config.name;
                    var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
                    rpc.setAsync(true);
                    rpc.setLoading(true);
                    var func = function (r) {
                        console.log(r);
                        if (r === true) {
                            nw.ingresaCodePhone(data.celular, data.indicativo);
                        } else {
                            nw.dialog(r);
                        }
                    };
                    rpc.exec("sendPhoneVerificarByCode", data, func);
                }
            },
            {
                name: "salir",
                label: "Salir",
                callback: function () {
                    nw.closeSession();
                }
            }
        ];
        self.show();

        if (nw.evalueData(data_pais)) {
            self.ui.indicativo.setValue(data_pais.indicativo_celular);
        }
        if (nw.evalueData(up.celular)) {
            self.ui.celular.setValue(up.celular);
        }
        if (nw.evalueData(up.email)) {
            self.ui.email.setValue(up.email);
        }
        self.addHeaderNote("<div class='titlecelular'>Ingresa tu número móvil y correo</div>");
        $("#foo").addClass("foo_phone");
    },
    ingresaCodePhone: function (celular, indicativo) {
        var self = new nw.forms();
        self.id = "ingresaCodePhone";
        self.setTitle = "Código de verificación";
        self.textClose = "Enviar";
        self.html = "<h3>El código de verificación se ha enviado al +" + indicativo + " " + celular + "</h3>";
        self.showBack = true;
        self.createBase();
        var fields = [
            {
                name: "token",
                label: "Código de 6 dígitos",
                placeholder: "Código de 6 dígitos",
                type: "numeric",
                required: true
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                styleContainer: "width:50%;",
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Enviar",
                callback: function () {
                    if (!self.validate()) {
                        return false;
                    }
                    var up = nw.userPolicies.getUserData();
                    var data = self.getRecord();
                    data.celular = indicativo + "" + celular;
                    data.user = indicativo + "" + celular;
                    data.use = true;
                    data.empresa = up.empresa;
                    data.usuario = up.usuario;
                    nw.console.log(data);
                    if (!self.validate()) {
                        return false;
                    }
                    var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
                    rpc.setAsync(true);
                    rpc.setLoading(true);
                    var func = function (r) {
                        nw.console.log(r);
                        if (r === true) {
                            self.reject();
                            window.localStorage.setItem("celular", celular);
                            window.localStorage.setItem("celular_validado", "true");
                            setTimeout(function () {
                                window.location.reload();
                            }, 500);
                        } else {
                            nw.dialog("El código no coincide, intente nuevamente");
                        }
                    };
                    rpc.exec("verificarCodeByPhone", data, func);
                }
            },
            {
                className: "btn_reenviar_code",
                name: "reenviar",
                label: "Reenviar código",
                callback: function () {
                    nw.back();
                }
            }
        ];
        self.show();
        $("#foo").addClass("foo_phone");
    },
    changePass: function (inter, user) {
        var p = config.edit_profile;
        if (p.permitir_cambiar_clave === false) {
            return false;
        }
        var canvas = "#foo";
        if (inter === true) {
            var c = new nw.newPage();
            c.id = "changePass";
            c.title = "Cambiar clave";
            c.html = "";
            c.create();
            canvas = "#" + c.id;
        }
        var up = nw.userPolicies.getUserData();
        var usuario = up.usuario;
        if (nw.evalueData(user)) {
            usuario = user;
        }
        var fa = new nw.forms();
        fa.canvas = canvas;
        fa.id_form = "changePass";
        var fields = [
            {
                name: "grupo_horario_open",
                label: "<div style='text-align:center;'><h1>Actualizar contraseña</h1><p>Ingrese los siguientes datos para cambiar su contraseña</p></div>",
                type: "startGroup",
                visible: true
            },
            {
                name: "nueva",
                label: "Clave nueva",
                placeholder: "Clave nueva",
                type: "textField",
                mode: "password",
                required: true
            },
            {
                name: "repetida",
                label: "Repita su clave nueva",
                placeholder: "Repita su clave nueva",
                type: "textField",
                mode: "password",
                required: true
            },
            {
                name: "grupo_horario_close",
                type: "endGroup"
            }
        ];
        fa.setFields(fields);
        fa.buttons = [
            {
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Enviar",
                callback: function () {
                    if (!fa.validate()) {
                        return false;
                    }
                    var data = fa.getRecord();
                    data.showFirst = false;
                    data.usuario = usuario;
                    nw.console.log(data);
                    var rpc = new nw.rpc(fa.getRpcUrl(), "nw_session");
                    rpc.setAsync(true);
                    var func = function (r) {
                        nw.console.log(r);
                        console.log(r);
                        if (r === true) {
                            window.localStorage.setItem("cambio_clave", "1");
                            nw.cleanAllWindow();
                            var params = {};
                            params.id = "claveCambiada";
                            params.title = "";
                            params.html = "<h2 style='text-align:center;'>¡Clave cambiada correctamente!</h2>";
                            params.acceptButtonText = "";
                            params.acceptButton = function () {
                                window.location.reload();
                            };
                            params.showBack = false;
                            nw.createDialog(params);
                            return true;
                        }
                        nw.dialog(r);
                    };
                    rpc.exec("cambiar_clave", data, func);
                }
            }
        ];
        fa.show();
        if (inter === true) {
            c.show();
        }
    },
    configuration: function () {
        var up = nw.userPolicies.getUserData();
        var c = new nw.newPage();
        c.id = "configuration";
        c.title = "Configuración";
        c.textClose = "Inicio";
        c.html = "";
        c.create();
        c.show();
        var con = "." + c.id;

        var ah = nw.containerLinksMenu();
        $(con).append(ah);
        var mode = "lists_simple";

        var t = nw.isOnline();
        var ton = " Internet estable";
        if (t === false) {
            ton = "Sin internet, compruebe su conexión. ";
        }
        var title = "Estado de red";
        var description = ton;
        var type = "center";
        var icon = "";
        var addClass = "btn_estado_red";
        imdev = 0;
        var callback = function () {
            if (nw.evalueData(window.localStorage.getItem("IAmDeveloper"))) {
                return false;
            }
            imdev++;
            if (imdev >= 5) {
                window.localStorage.setItem("IAmDeveloper", "YEAH");
                nw.dialog("Ahora cuenta con la opción de developer en configuración", function () {
                    nw.loadHome();
                    window.location.reload();
                });
            }
        };
        var di = nw.generateLink(title, callback, type, 0, description, icon, mode, addClass);
        nw.appendLinkMenu(di, con);

        var title = "Cambiar tema";
        var description = "";
        var type = "center";
        var icon = "";
        var callback = function () {
            nw.changeThema();
        };
        var addClass = "btn_cambiar_tema";
        var di = nw.generateLink(title, callback, type, 0, description, icon, mode, addClass);
        nw.appendLinkMenu(di, con);

        var title = "Transición de ventanas";
        var description = "";
        var type = "center";
        var icon = "";
        var callback = function () {
            nw.changeTransicionWindow();
        };
        var addClass = "btn_transicion_ventanas";
        var di = nw.generateLink(title, callback, type, 0, description, icon, mode, addClass);
        nw.appendLinkMenu(di, con);

        var title = "Zoom";
        var description = "";
        var type = "center";
        var icon = "";
        var callback = function () {
            nw.changeZoomWindow();
        };
        var addClass = "btn_zoom";
        var di = nw.generateLink(title, callback, type, 0, description, icon, mode, addClass);
        nw.appendLinkMenu(di, con);

        var title = "Ayuda";
        var description = "";
        var type = "center";
        var icon = "";
        var callback = false;
        var addClass = "btn_help";
        var di = nw.generateLink(title, callback, type, 0, description, icon, mode, addClass);
        nw.appendLinkMenu(di, con);

        var title = "Acerca de";
        var description = "";
        var type = "center";
        var icon = "";
        var callback = function () {
            nw.about();
        };
        var addClass = "btn_acerca_de";
        var di = nw.generateLink(title, callback, type, 0, description, icon, mode, addClass);
        nw.appendLinkMenu(di, con);

        if (nw.evalueData(window.localStorage.getItem("IAmDeveloper"))) {
            var title = "Developer";
            var description = "";
            var type = "center";
            var icon = "";
            var callback = function () {
                nw.optionsDevelopers();
            };
            var addClass = "btn_developers";
            var di = nw.generateLink(title, callback, type, 0, description, icon, mode, addClass);
            nw.appendLinkMenu(di, con);
        }
    },
    optionsDevelopers: function () {
        var self = new nw.forms();
        self.id = "optionsDevelopers";
        self.setTitle = "Developers";
        self.showBack = true;
        self.textClose = "Configurar";
        self.createBase();
        var fields = [
            {
                icon: "material-icons person_add normal",
                name: "examples",
                label: "Examples",
                placeholder: "Examples",
                type: "button"
            },
            {
                icon: "material-icons person_add normal",
                name: "notify",
                label: "Test notification",
                placeholder: "Test notification",
                type: "button"
            },
            {
                name: "mostrar_consola",
                label: "Mostrar consola",
                placeholder: "Mostrar consola",
                type: "selectBox",
                required: true
            },
            {
                name: "eventos_consola",
                label: "Mostrar eventos en consola",
                placeholder: "Mostrar eventos en consola",
                type: "selectBox",
                required: true
            },
            {
                name: "domain_rpc",
                label: "Dominio SRV",
                placeholder: "Dominio SRV",
                type: "textField",
                required: true
            },
            {
                name: "testing",
                label: "Testing",
                placeholder: "Testing",
                type: "selectBox",
                required: true
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Aceptar",
                callback: function () {
                    if (!self.validate()) {
                        return false;
                    }
                    var data = self.getRecord(true);
                    window.localStorage.setItem("showConsoleDeveloper", data.mostrar_consola);
                    window.localStorage.setItem("showConsoleEvents", data.eventos_consola);
                    window.localStorage.setItem("domain_rpc", data.domain_rpc);
                    window.localStorage.setItem("testing", data.testing);
                    nw.loading();
                    nw.loadHome();
                    window.location.reload();
                }
            }
        ];
        self.show();

        self.ui.notify.addListener("execute", function () {
            nw.testingSendNotificactions();
        });

        self.ui.examples.addListener("execute", function () {
            nw.examplesDevelopers();
        });

        var data = {};
        data[false] = "NO";
        data[true] = "SI";
        self.ui.testing.populateSelectFromArray(data);
        self.ui.mostrar_consola.populateSelectFromArray(data);
        self.ui.eventos_consola.populateSelectFromArray(data);
        self.ui.mostrar_consola.setValue(window.localStorage.getItem("showConsoleDeveloper"));
        self.ui.eventos_consola.setValue(window.localStorage.getItem("showConsoleEvents"));
        if (nw.evalueData(window.localStorage.getItem("domain_rpc"))) {
            self.ui.domain_rpc.setValue(window.localStorage.getItem("domain_rpc"));
        } else {
            self.ui.domain_rpc.setValue(config.domain_rpc);
        }
        self.ui.testing.setValue(window.localStorage.getItem("testing"));
    },
    testingSendNotificactions: function () {
        var self = new nw.forms();
        self.id = "testingSendNotificactions";
        self.setTitle = "Examples";
        self.textClose = "Developers";
        self.html = "";
        self.showBack = true;
        self.createBase();
        var fields = [
            {
                icon: "material-icons check normal",
                name: "user",
                label: "User",
                placeholder: "User",
                type: "selectBox"
            },
            {
                icon: "material-icons check normal",
                name: "token",
                label: "Token",
                placeholder: "Token",
                type: "textArea"
            },
            {
                icon: "material-icons check normal",
                name: "title",
                label: "Title",
                placeholder: "Title",
                type: "textField"
            },
            {
                icon: "material-icons check normal",
                name: "body",
                label: "Body",
                placeholder: "Body",
                type: "textField"
            },
            {
                icon: "material-icons check normal",
                name: "callback",
                label: "CallBack",
                placeholder: "CallBack",
                type: "textArea"
            },
            {
                icon: "material-icons check normal",
                name: "send",
                label: "Send",
                placeholder: "Send",
                type: "button"
            }
        ];
        self.setFields(fields);
        self.show();
        self.ui.user.addListener("change", function () {
            var d = self.ui.user.getValue();
            self.ui.token.setValue(d.val);
        });
        self.ui.send.addListener("execute", function () {
            var data = self.getRecord();
            nw.sendNotificacion({
                title: data.title,
                body: data.body,
                icon: "fcm_push_icon",
                sound: "default",
                data: data.callback,
                callback: "FCM_PLUGIN_ACTIVITY",
                to: data.token
            }, function (r) {
                nw.dialog("Notify send OK to " + data.token + "! " + r);
            });
        });
        self.ui.token.setValue(window.localStorage.getItem("token"));
        self.ui.title.setValue("Título...");
        self.ui.body.setValue("Escribe lo que quieras");
        self.ui.callback.setValue("nw.dialog('¿Abrir consola developers?', function(){nw.examplesDevelopers()},function(){})");

        var data = {};
        data[""] = "Seleccione";
        self.ui.user.populateSelectFromArray(data);

        var up = nw.userPolicies.getUserData();
        var data = {};
        data.usuario = up.usuario;
        self.ui.user.populateSelect('nwMaker', 'getUsersTokens', data, function (a) {
            console.log(a);
        }, true);
    },
    menuProfile: function () {
        var up = nw.userPolicies.getUserData();
        var p = config.edit_profile;
        var self = new nw.newPage();
        self.id = "menuProfile";
        self.title = "Mi cuenta";
        self.textClose = "Atrás";
        self.html = "";
        self.buttons = [];
        if (p.permitir_editar === true) {
            self.buttons.push(
                    {
                        style: "background-color:#fff;border-radius: 5px;",
                        colorBtnBackIOS: "#000",
                        icon: "material-icons edit normal",
                        position: "top",
                        name: "editar_account",
                        label: "",
                        callback: function () {
                            nw.editProfile();
                        }
                    }
            );
        }
        self.create();
        self.show();
        var con = "." + self.id;

        var ah = nw.containerLinksMenu();
        self.append(ah);

        var foto = "";
        if (nw.evalueData(up.foto)) {
            foto = up.foto;
        }
        var dd = foto.split("://");
        if (dd.length > 1) {
            foto = up.foto;
        } else {
            foto = mainNW.domain_rpc + "/nwlib6/includes/phpthumb/phpThumb.php?src=" + up.foto + "&w=60&f=png";
        }
        var addClass = "btn_mi_perfil";
        var title = "Mi perfil";
        var description = up.nombre + "<br />" + up.email;
        if (nw.evalueData(up.documento)) {
            description += "<br />" + up.documento;
        }
        var type = "center";
        var icon = foto;
        var callback = function () {
            nw.editProfile();
        };
        var di = nw.generateLink(title, callback, type, 0, description, icon, "bloq", addClass);
        nw.appendLinkMenu(di, con);

        var title = "Correo electrónico";
        var description = up.email;
        var type = "center";
        var icon = "material-icons email normal false";
        var addClass = "btn_correo";
        var callback = false;
        var di = nw.generateLink(title, callback, type, 0, description, icon, "lists_simple", addClass);
        nw.appendLinkMenu(di, con);

        if (p.ver_saldo === true) {
            var title = "Saldo";
            var description = "Su saldo es: " + up.saldo + " " + config.moneda;
            var type = "center";
            var icon = "material-icons attach_money normal false";
            var addClass = "btn_correo";
            var callback = false;
            var di = nw.generateLink(title, callback, type, 0, description, icon, "lists_simple", addClass);
            nw.appendLinkMenu(di, con);
        }

        if (p.ver_puntaje === true) {
            var title = "Puntaje";
            var description = "Puntaje : " + up.puntaje;
            var type = "center";
            var icon = "material-icons star normal false";
            var addClass = "btn_correo";
            var callback = false;
            var di = nw.generateLink(title, callback, type, 0, description, icon, "lists_simple", addClass);
            nw.appendLinkMenu(di, con);
        }

        if (p.permitir_cambiar_clave === true) {
            var title = "Cambiar contraseña";
            var description = "";
            var type = "center";
            var icon = "material-icons security normal false";
            var addClass = "btn_cambiar_contrasena";
            var callback = function () {
                nw.changePass(true);
            };
            var di = nw.generateLink(title, callback, type, 0, description, icon, "lists_simple", addClass);
            nw.appendLinkMenu(di, con);
        }

        if (p.eliminar_cuenta === true) {
            var title = "Eliminar mi cuenta";
            var description = "Si elimina su cuenta, no podrá recuperar sus datos";
            var type = "center";
            var icon = "";
            var addClass = "btn_eliminar_cuenta";
            var callback = function () {
                nw.dialog("¿Está seguro de eliminar su cuenta?", accept, cancel);
                function accept() {
//                nw.loading({text: "Por favor espere...", textVisible: true, html: "", theme: "b"});
//                var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
//                rpc.setAsync(true);
//                var func = function (r) {
//                    console.log(r);
//                    nw.console.log(r);
//                    nw.responseCreateAccount(r);
//                };
//                rpc.exec("createAccount", up, func);
                }
                function cancel() {

                }
            };
            var di = nw.generateLink(title, callback, type, 0, description, icon, "bloq", addClass);
            nw.appendLinkMenu(di, con);
        }

    },
    empty: function (widget) {
        $(widget).empty();
    },
    remove: function (widget) {
        $(widget).remove();
    },
    editProfile: function (home) {
        var up = nw.userPolicies.getUserData();
        var c = config.edit_profile;
        if (c.permitir_editar === false) {
            return false;
        }
        var self = new nw.forms();
        if (home === true) {
            $(".containerCenterHome").empty();
            self.canvas = "#foo";
            self.id_form = "editProfile";
        } else {
            self.id = "editProfile";
            self.setTitle = "Perfil";
            self.textClose = "Atrás";
            self.html = "";
            self.showBack = true;
            self.createBase();
        }
        var foto_perfil = "";
        if (nw.evalueData(up.foto)) {
            foto_perfil = up.foto;
        }
        if (nw.evalueData(up.foto_perfil)) {
            foto_perfil = up.foto_perfil;
        }
        var fields = [];
        fields.push(
                {
                    style: "border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;margin:0px;overflow:hidden;padding:20px 0;",
                    name: "grupo_fotografia",
                    label: "Fotografía",
                    type: "startGroup",
                    visible: JSON.parse(c.foto_perfil.split(" ")[0])
                },
                {
                    icon: "material-icons check normal",
//                    type: "uploader_frame",
                    type: "button",
                    mode: "camera_files",
                    name: "foto_perfil",
                    data: foto_perfil,
                    label: "Foto de perfil",
                    placeholder: "Foto de perfil",
                    visible: JSON.parse(c.foto_perfil.split(" ")[0]),
                    enabled: JSON.parse(c.foto_perfil.split(" ")[1]),
                    required: JSON.parse(c.foto_perfil.split(" ")[2])
                },
                {
                    name: "grupo_visitantes_open",
                    type: "endGroup"
                }
        );
        fields.push({
            style: "border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;margin:0px;overflow:hidden;padding:20px 0;",
            name: "grupo_usuario",
            label: "Usuario",
            type: "startGroup",
            visible: true
        });
        fields.push({
            icon: "material-icons check normal",
            name: "email",
            label: "Correo",
            placeholder: "Correo",
            type: "textField",
            mode: "email",
            visible: JSON.parse(c.email.split(" ")[0]),
            enabled: JSON.parse(c.email.split(" ")[1]),
            required: JSON.parse(c.email.split(" ")[2])
        });
        fields.push({
            icon: "material-icons check normal",
            name: "nombre",
            label: "Nombre",
            placeholder: "Nombre",
            type: "textField",
            visible: JSON.parse(c.nombre.split(" ")[0]),
            enabled: JSON.parse(c.nombre.split(" ")[1]),
            required: JSON.parse(c.nombre.split(" ")[2])
        });
        fields.push({
            icon: "material-icons check normal",
            name: "apellido",
            label: "Apellidos",
            placeholder: "Apellidos",
            type: "textField",
            visible: JSON.parse(c.apellido.split(" ")[0]),
            enabled: JSON.parse(c.apellido.split(" ")[1]),
            required: JSON.parse(c.apellido.split(" ")[2])
        });
        fields.push({
            icon: "material-icons check normal",
            name: "nit",
            label: "Documento de identificación",
            placeholder: "Documento de identificación",
            type: "textField",
            visible: JSON.parse(c.nit.split(" ")[0]),
            enabled: JSON.parse(c.nit.split(" ")[1]),
            required: JSON.parse(c.nit.split(" ")[2])
        });
        fields.push({
            icon: "material-icons check normal",
            name: "celular",
            label: "Celular / móvil",
            placeholder: "Celular / móvil",
            type: "numeric",
            visible: JSON.parse(c.celular.split(" ")[0]),
            enabled: JSON.parse(c.celular.split(" ")[1]),
            required: JSON.parse(c.celular.split(" ")[2])
        });
        fields.push({
            icon: "material-icons check normal",
            name: "fecha_nacimiento",
            label: "Fecha de nacimiento",
            placeholder: "Fecha de nacimiento",
            type: "dateField",
            visible: JSON.parse(c.fecha_nacimiento.split(" ")[0]),
            enabled: JSON.parse(c.fecha_nacimiento.split(" ")[1]),
            required: JSON.parse(c.fecha_nacimiento.split(" ")[2])
        });
        fields.push({
            name: "grupo_usuario",
            type: "endGroup"
        });
        fields.push({
            style: "border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;margin:0px;overflow:hidden;padding:20px 0;",
            name: "grupo_ubicacion",
            label: "Ubicación",
            type: "startGroup",
            visible: c.ubicacion
        });
        fields.push({
            icon: "material-icons check normal",
            name: "pais",
            label: "País",
            placeholder: "País",
            type: "selectBox",
            visible: JSON.parse(c.pais.split(" ")[0]),
            enabled: JSON.parse(c.pais.split(" ")[1]),
            required: JSON.parse(c.pais.split(" ")[2])
        });
        fields.push({
            icon: "material-icons check normal",
            name: "departamento",
            label: "Departamento",
            placeholder: "Departamento",
            type: "selectBox",
            visible: JSON.parse(c.departamento.split(" ")[0]),
            enabled: JSON.parse(c.departamento.split(" ")[1]),
            required: JSON.parse(c.departamento.split(" ")[2])
        });
        fields.push({
            icon: "material-icons check normal",
            name: "ciudad",
            label: "Ciudad",
            placeholder: "Ciudad",
            type: "selectBox",
            visible: JSON.parse(c.ciudad.split(" ")[0]),
            enabled: JSON.parse(c.ciudad.split(" ")[1]),
            required: JSON.parse(c.ciudad.split(" ")[2])
        });
        fields.push({
            name: "grupo_ubicacion",
            type: "endGroup"
        });
        self.setFields(fields);
        self.buttons = [
            {
                styleContainer: "width:50%;",
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "green",
                className: "btn_enc",
                position: "top",
                name: "aceptar",
                label: "Guardar",
                callback: function () {
                    if (!self.validate()) {
                        return false;
                    }
                    var data = self.getRecord();
                    data.usuario = up.usuario;
                    data.empresa = up.empresa;
                    data.perfil = up.perfil;
                    nw.console.log(data);
                    console.log(data);
                    nw.loading({text: "Por favor espere...", title: "Actualizando..."});
                    var rpc = new nw.rpc(nw.getRpcUrl(), "nwprojectOut");
                    rpc.setAsync(true);
                    rpc.setLoading(false);
                    var func = function (r) {
                        nw.loadingRemove();
                        console.log(r);
                        nw.console.log(r);
                        if (typeof r === "string") {
                            nw.dialog(r);
                            return false;
                        }
                        nw.setUserInfo(r, function () {
                            window.location.reload();
                        });
                    };
                    rpc.exec("updateInfoUserperfil", data, func);
                }
            }
        ];
        self.show();
        self.backgroundColor("#fff");

        if (JSON.parse(c.pais.split(" ")[0])) {
            var data = {};
            data[""] = "Seleccione";
            self.ui.pais.populateSelectFromArray(data);

            self.ui.pais.populateSelect('master', 'populate', {table: 'paises', order: "nombre"}, function (a) {
                console.log(a);
                if (nw.evalueData(up.pais)) {
                    self.ui.pais.setValue(up.pais);
                    populateCities(up.pais, "pais_id");
                }
            }, true);

            self.ui.pais.changeValue(function (e) {
                var val = self.ui.pais.getValue();
                if (JSON.parse(c.departamento.split(" ")[0])) {
                    populateDeptos(val.val);
                } else
                if (JSON.parse(c.ciudad.split(" ")[0]) && !JSON.parse(c.departamento.split(" ")[0])) {
                    populateCities(val.val, "pais_id");
                }
            });
        }
        if (JSON.parse(c.departamento.split(" ")[0])) {
            var data = {};
            data[""] = "Seleccione";
            self.ui.departamento.populateSelectFromArray(data);
            if (!JSON.parse(c.pais.split(" ")[0])) {
                populateDeptos();
            }
        }
        if (JSON.parse(c.ciudad.split(" ")[0])) {
            var data = {};
            data[""] = "Seleccione";
            self.ui.ciudad.populateSelectFromArray(data);
            var cit = true;
            if (!JSON.parse(c.pais.split(" ")[0]) || !JSON.parse(c.departamento.split(" ")[0])) {
                cit = false;
            }
            if (nw.evalueData(up.ciudad)) {
                cit = true;
            }
            if (cit) {
                populateCities();
            }
        }
        function populateDeptos(val) {
            var data = {};
            data.table = "deptosGeo";
            data.order = "nombre";
            if (nw.evalueData(val)) {
                data.where = " and pais='" + val + "'";
            }
            self.ui.departamento.populateSelect('master', 'populate', data, function (a) {
                console.log(a);
                if (nw.evalueData(up.departamento)) {
                    self.ui.departamento.setValue(up.departamento);
                }
            }, true, true);
        }
        function populateCities(val, field) {
            var data = {};
            data.table = "ciudades";
            data.order = "nombre";
            if (nw.evalueData(val)) {
                data.where = " and " + field + "='" + val + "'";
            }
            self.ui.ciudad.populateSelect('master', 'populate', data, function (a) {
                console.log(a);
                if (nw.evalueData(up.ciudad)) {
                    self.ui.ciudad.setValue(up.ciudad);
                }
            }, true, true);
        }

        console.log(up);
        self.setRecord(up);
    },
    examplesDevelopers: function (home) {
        var self = new nw.forms();
        if (home === true) {
            $(".containerCenterHome").empty();
            self.canvas = "#foo";
            self.id_form = "f_crear_viaje";
        } else {
            self.id = "examplesDevelopers";
            self.setTitle = "Examples";
            self.textClose = "Developers";
            self.html = "examplesDevelopers() in nwmaker-2.js";
            self.showBack = true;
            self.createBase();

        }
        var fields = [
            {
                icon: "material-icons check normal",
                name: "scaner",
                visible_label: true,
                label: "Scan QR / barras",
                placeholder: "Scan QR / barras",
                type: "button"
            },
            {
                icon: "material-icons check normal",
                name: "camera_files",
                visible_label: true,
                label: "Take photo camera and files (type: 'button', mode: 'camera_files')",
                placeholder: "Take photo camera and files (type: 'button', mode: 'camera_files')",
                mode: "camera_files",
                type: "button"
            },
            {
                icon: "material-icons check normal",
                name: "camera",
                visible_label: true,
                label: "Take photo camera (type: 'button', mode: 'camera')",
                placeholder: "Take photo camera (type: 'button', mode: 'camera')",
                mode: "camera",
                quality: "50",
                cameraWidth: "auto", // en pixeles
                cameraHeight: "auto", // en pixeles
                allowEdit: true,
                type: "button"
            },
            {
                icon: "material-icons check normal",
                name: "files",
                visible_label: true,
                label: "UUse uploader files (type: 'button', mode: 'files')",
                placeholder: "Use uploader files (type: 'button', mode: 'files')",
                mode: "files",
                type: "button"
            },
            {
                icon: "material-icons check normal",
                visible_label: true,
                name: "money",
                label: "Money",
                type: "textField",
                mode: "money"
            },
            {
                icon: "material-icons check normal",
                type: "uploader_frame",
                name: "uploader_frame",
                label: "Uploader by frame (type: 'uploader_frame')",
                data: "https://www.movilmove.com/imagenes/logomovilmove.png",
                placeholder: "Uploader by frame"
            },
            {
                icon: "material-icons check normal",
                type: "uploader",
                mode: "images",
                name: "adjunto_only_images",
                label: "field uploader only images (type: 'uploader', mode: 'images')",
                placeholder: "field uploader only images (type: 'uploader', mode: 'images')"
            },
            {
                icon: "material-icons check normal",
                type: "uploader",
                mode: "takePhoto",
                name: "adjunto_take_photo",
                label: "field uploader only photo (type: 'uploader', mode: 'takePhoto')",
                placeholder: "field uploader only photo (type: 'uploader', mode: 'takePhoto')"
            },
            {
                icon: "material-icons check normal",
                type: "uploader",
                name: "adjunto",
                label: "field uploader",
                placeholder: "field uploader"
            },
            {
                icon: "material-icons check normal",
                name: "selectbox",
                label: "field selectBox",
                placeholder: "field selectBox",
                type: "selectBox"
            },
            {
                icon: "material-icons check normal",
                name: "button",
                label: "Field button",
                placeholder: "Field button",
                type: "button"
            },
            {
                name: "checkBox",
                label: "Field checkBox",
                placeholder: "Field checkBox",
                type: "checkBox"
            },
            {
                icon: "material-icons check normal",
                type: "label",
                name: "label",
                label: "field label, el de abajo es switch",
                placeholder: "field label, el de abajo es switch"
            },
            {
                icon: "material-icons check normal",
                type: "switch",
                name: "switch",
                label: "field switch",
                options: "<option value='SI'>SI</option><option value='NO'>NO</option>",
                placeholder: "field switch"
            },
            {
                icon: "material-icons check normal",
                name: "dateField",
                label: "Field dateField",
                placeholder: "Field dateField",
                type: "dateField"
            },
            {
                icon: "material-icons check normal",
                name: "dateTime",
                label: "Field dateTime",
                placeholder: "Field dateTime",
                type: "dateTime"
            },
            {
                icon: "material-icons check normal",
                name: "time",
                label: "Field time",
                placeholder: "Field time",
                type: "time"
            },
            {
                icon: "material-icons check normal",
                name: "numeric",
                label: "Field numeric",
                placeholder: "Field numeric",
                type: "numeric"
            },
            {
                icon: "material-icons check normal",
                name: "search",
                label: "Field search (usuarios)",
                placeholder: "Field search (usuarios)",
                type: "search"
            },
            {
                style: "border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;margin:0px;overflow:hidden;padding:20px 0;",
                name: "grupo_visitantes_open",
                label: "Visitantes",
                type: "startGroup",
                visible: true
            },
            {
                name: "grupo_visitantes_open",
                type: "endGroup"
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                styleContainer: "width:50%;",
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "green",
                className: "btn_enc",
//                position: "top",
                name: "aceptar",
                label: "Aceptar",
                callback: function () {
                    var data = self.getRecord();
                    data.navtable = self.navTable.getAllData();
                    console.log(data);
                    if (!self.validate()) {
                        return false;
                    }
                }
            },
            {
                styleContainer: "width:50%;",
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "green",
                className: "btn_enc",
//                position: "top",
                name: "cancelar",
                label: "Cancelar",
                callback: function () {
                    var data = self.getRecord();
                    data.navtable = self.navTable.getAllData();
                    nw.console.log(data);
                    if (!self.validate()) {
                        return false;
                    }
                }
            },
            {
                styleContainer: "width:50%;",
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "green",
                className: "btn_enc",
                position: "top",
                name: "dialog",
                label: "Dialog",
                callback: function () {
                    var data = self.getRecord();
                    data.navtable = self.navTable.getAllData();
                    nw.console.log(data);
                    nw.dialog("nw.dialog('texto...', callbackAccept, callbackCancel, {textAccept:'SI',textCancel:'NO'})");
                    if (!self.validate()) {
                        return false;
                    }
                }
            }
        ];
        self.show();
        var data = {};
        data["normal"] = "Normal";
        data["mediana"] = "Mediana";
        data["grande"] = "Grande";
        self.ui.selectbox.populateSelectFromArray(data);

        var data = {};
        data.fields_search = "nombre";
        data.fields_get = "nombre";
        data.table = "usuarios";
        data.service = "nwMaker";
        data.method = "populateSelectTokenFieldGeneric";
        data.showsinresult = true;
        self.ui.search.actionSearch(data);

        self.ui.search.addListener("clickToken", function (e) {
            var thi = e;
            if (!thi.data) {
                nw.cleanTokenField();
                return false;
            }
            self.ui.search.setValue();
            var row = {};
            row.nombre = thi.data.row.nombre;
            self.navTable.addRow(row, true);
        });
        self.ui.button.addListener("execute", function (e) {
            nw.dialog("Click!");
        });
        self.ui.scaner.addListener("execute", function (e) {
            nw.barcodeScanner(function (r) {
                nw.dialog(r);
            });
        });

        var fechaDateTime = nw.getActualFullDate("datetime-local");
        var fecha = nw.getActualDate();
        var time = nw.getActualHour();
        self.ui.dateTime.setValue(fechaDateTime);
        self.ui.dateTime.minValue(fechaDateTime);
        self.ui.dateField.setValue(fecha);
        self.ui.dateField.minValue(fecha);
        self.ui.time.setValue(time);
        self.ui.time.minValue(time);

        nw.testNavTable();
        var nav = new l_navtable_test();
        nav.construct(self.canvas + " .grupo_visitantes_open");
        self.navTable = nav;

        self.ui.selectbox.changeValue(function (e) {
            var v = self.ui.selectbox.getValue();
            nw.dialog("self.ui.selectbox.changeValue " + v.val);
        });
        self.ui.adjunto.setValue("/hola.png");
    },
    testNavTable: function () {
        nw.Class.define("l_navtable_test", {
            extend: nw.lists,
            construct: function (canvas) {
                var self = this;
                self.showContextMenu = true;
                self.canvas = canvas;
                var columns = [
                    {
                        name: "nombre",
                        label: "Nombre"
                    }
                ];
                self.setColumns(columns);
                return self;
            },
            destruct: function () {
            },
            members: {
                contextMenu: function contextMenu() {
                    var self = this;
                    var up = nw.userPolicies.getUserData();
                    var sl = self.selectedRecord();
                    var m = new nw.contextmenu(this, "bottom");//vertical, bottom
                    m.addAction("Quitar de la lista", "material-icons create normal", function (e) {
                        var li = self.activeRow;
                        $(li).remove();
                    });
                },
                clicRow: function clicRow() {
                    var self = this;
                    var data = self.selectedRecord();
                    nw.console.log("clicRow", data);
                }
            }
        });
    },
    changeZoomWindow: function () {
        var self = new nw.forms();
        self.id = "changeZoomWindow";
        self.setTitle = "Zoom";
        self.textClose = "Configurar";
        self.html = "";
        self.showBack = true;
        self.createBase();
        var fields = [
            {
                name: "zoomPage",
                label: "Zoom",
                placeholder: "Zoom",
                type: "selectBox",
                required: true
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Aceptar",
                callback: function () {
                    if (!self.validate()) {
                        return false;
                    }
                    var data = self.getRecord(true);
                    window.localStorage.setItem("zoomPage", data.zoomPage);
                    nw.loading();
                    nw.loadHome();
                    window.location.reload();
                }
            }
        ];
        self.show();
        var data = {};
        data["normal"] = "Normal";
        data["1.035"] = "Mediana";
        data["1.060"] = "Grande";
        self.ui.zoomPage.populateSelectFromArray(data);
        if (nw.evalueData(window.localStorage.getItem("zoomPage"))) {
            self.ui.zoomPage.setValue(window.localStorage.getItem("zoomPage"));
        }
    },
    changeTransicionWindow: function () {
        var self = new nw.forms();
        self.id = "changeTransicionWindow";
        self.setTitle = "Ventanas";
        self.textClose = "Configurar";
        self.html = "";
        self.showBack = true;
        self.createBase();
        var fields = [
            {
                name: "defaultPageTransition",
                label: "Default Page Transition",
                placeholder: "Default Page Transition",
                type: "selectBox",
                required: true
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Aceptar",
                callback: function () {
                    if (!self.validate()) {
                        return false;
                    }
                    var data = self.getRecord(true);
                    window.localStorage.setItem("defaultPageTransition", data.defaultPageTransition);
                    nw.loading();
                    nw.loadHome();
                    window.location.reload();
                }
            }
        ];
        self.show();
        var data = {};
        data["slide"] = "slide";
        data["slideup"] = "slideup";
        data["slidedown"] = "slidedown";
        data["slidefade"] = "slidefade";
        data["fade"] = "fade";
        data["flip"] = "flip";
        data["pop"] = "pop";
        data["turn"] = "turn";
        data["flow"] = "flow";
        data["none"] = "none";
        self.ui.defaultPageTransition.populateSelectFromArray(data);
        self.ui.defaultPageTransition.setValue(window.localStorage.getItem("defaultPageTransition"));
    },
    changeThema: function () {
        var self = new nw.forms();
        self.id = "changeThema";
        self.setTitle = "Cambiar tema";
        self.textClose = "Configurar";
        self.html = "<h1>Seleccione el tema</h1>";
        self.showBack = true;
        self.createBase();

        var fields = [
            {
                name: "tema",
                label: "Tema",
                placeholder: "Tema",
                type: "selectBox",
                required: true
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "aceptar",
                label: "Aceptar",
                callback: function () {
                    if (!self.validate()) {
                        return false;
                    }
                    var data = self.getRecord(true);
                    window.localStorage.setItem("theme", data.tema);
                    nw.loading();
                    nw.loadHome();
                    window.location.reload();
                }
            }
        ];
        self.show();

        var data = {};
        data["a"] = "Claro";
        data["b"] = "Oscuro";
        self.ui.tema.populateSelectFromArray(data);
        self.ui.tema.setValue(window.localStorage.getItem("theme"));
    },
    about: function () {
        var token = window.localStorage.getItem("token");
        var html = "<h1>" + config.name + " versión " + config.version + "</h1></p> ";
        html += "<br /><p>Nwmaker-lib versión " + app.version + "</p></p> ";
        html += "<p>" + config.description + "</p>";
        html += "<p>Co creator: " + config.co_creator + "</p>";
        html += "<p>Domain public: " + config.domain_rpc + "</p> ";
        if (nw.evalueData(token)) {
            html += "<p>Token Notify <textarea>" + token + "</textarea></p>"
        }
        var c = new nw.newPage();
        c.footer = "Powered by Grupo Nw<br /><a href='https://www.gruponw.com' target='_BLANK'>gruponw.com</a></p>";
        c.id = "about";
        c.title = "Acerca de";
        c.html = html;
        c.create();
        c.show();
    },
    addClass: function (el, cls) {
        if (el.classList) {
            el.classList.add(cls);
        } else {
            var cur = ' ' + (el.getAttribute('class') || '') + ' ';
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                setClass(el, (cur + cls).trim());
            }
        }
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
    },
    cleanUserNwC: function (u) {
        u = u.toString();
        var id = u.replace(/\//gi, "");
        id = id.replace(/\?/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\./gi, "");
        id = id.replace(/\,/gi, "");
        id = id.replace(/\&/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\@/gi, "");
        id = id.replace(/\-/gi, "");
        id = id.replace(/\./gi, "");
        id = id.replace(/\_/gi, "");
        id = id.replace(/\-/gi, "");
        id = id.replace(/\ /gi, "");
        id = id.replace(/\!/gi, "");
        id = id.replace(/\:/gi, "");
        id = id.replace(".", "");
        var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
        var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
        for (var i = 0; i < acentos.length; i++) {
            id = id.replace(acentos.charAt(i), original.charAt(i));
        }
        return id;
    },
    playSound: function (urlFileSound, options) {
        var self = this;
        var className = "";
        var d = document.createElement("audio");
        var padre = document.body;
        if (typeof options !== "undefined") {
            if (options.controls === true) {
                d.controls = "true";
            }
            if (options.loop === true) {
                d.loop = "true";
            }
            if (options.muted === true) {
                d.muted = "true";
            }
            if (options.className !== "undefined") {
                className = options.className;
            }
        }
        if (className !== "") {
            if (document.querySelector("." + className)) {
                document.querySelector("." + className).remove();
            }
        }
        d.className = "soundNewAddUser " + className;
        d.src = urlFileSound;
        d.autoplay = "true";
        d.onloadstart = function () {
//            console.log('onloadstart');
        };
        padre.appendChild(d);
        d.play();
        return d;
    },
    getDataCountryIP: function (callback) {
        var self = this;
        window.visitor_loaded = function () {
            var r = visitor;
            console.log("visitor_loaded", r);
        };
        window.visitor_opts = {enable_location: true, session_days: 5};
        nw.require("nwmaker/visitor.js", function () {

        });
        return true;
    },
    getPositionByIP: function (ip) {
        var self = this;
        ip = "190.130.72.175";
        function reqListener() {
            var data = JSON.parse(this.responseText);
            console.log("getPositionByIP", data);
        }
        function reqError(err) {
            console.log("ERROR getposition", err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('get', 'https://api.ipstack.com/' + ip + "?access_key=87ed7b19bd04ce21b2c4f2623c35508d", true);
        oReq.send();
    },
    validateNwPayments: function (r) {
        var d = {};
        d["allLog"] = r;
        d["responseMessage"] = r["transactionResponse"]["responseMessage"];
        d["status"] = "";
        d["status_description"] = "";
        d["approved"] = "";
        d["responseCode"] = "";
        d["modo_pruebas"] = false;
        d.orderId = r["transactionResponse"]["transactionId"];

        var testing = false;
        if (r["transactionResponse"]["responseCode"] === "DECLINED_TEST_MODE_NOT_ALLOWED") {
//            d["responseCode"] = "DECLINED_TEST_MODE_NOT_ALLOWED / MODO DE PRUEBA DECLINADA NO PERMITIDO";
            d["responseCode"] = "DECLINED_TEST_MODE_NOT_ALLOWED";
            testing = true;
        }
        if (r["transactionResponse"]["responseCode"] === "INVALID_CARD") {
            d["responseCode"] = "La tarjeta es inválida.";
        }
        if (r["transactionResponse"]["responseCode"] === "ERROR") {
            d["responseCode"] = "Ocurrió un error general.";
        }
        if (r["transactionResponse"]["responseCode"] === "APPROVED") {
            d["responseCode"] = "La transacción fue aprobada.";
        }
        if (r["transactionResponse"]["responseCode"] === "ANTIFRAUD_REJECTED") {
            d["responseCode"] = "La transacción fue rechazada por el sistema anti-fraude.";
        }
        if (r["transactionResponse"]["responseCode"] === "PAYMENT_NETWORK_REJECTED") {
            d["responseCode"] = "La red financiera rechazó la transacción.";
        }
        if (r["transactionResponse"]["responseCode"] === "ENTITY_DECLINED") {
            d["responseCode"] = "La transacción fue declinada por el banco o por la red financiera debido a un error.";
        }
        if (r["transactionResponse"]["responseCode"] === "INTERNAL_PAYMENT_PROVIDER_ERROR") {
            d["responseCode"] = "Ocurrió un error en el sistema intentando procesar el pago.";
        }
        if (r["transactionResponse"]["responseCode"] === "INACTIVE_PAYMENT_PROVIDER") {
            d["responseCode"] = "El proveedor de pagos no se encontraba activo.";
        }
        if (r["transactionResponse"]["responseCode"] === "DIGITAL_CERTIFICATE_NOT_FOUND") {
            d["responseCode"] = "La red financiera reportó un error en la autenticación.";
        }
        if (r["transactionResponse"]["responseCode"] === "INVALID_EXPIRATION_DATE_OR_SECURITY_CODE") {
            d["responseCode"] = "El código de seguridad o la fecha de expiración estaba inválido.";
        }
        if (r["transactionResponse"]["responseCode"] === "INVALID_RESPONSE_PARTIAL_APPROVAL") {
            d["responseCode"] = "Tipo de respuesta no válida. La entidad aprobó parcialmente la transacción y debe ser cancelada automáticamente por el sistema.";
        }
        if (r["transactionResponse"]["responseCode"] === "INSUFFICIENT_FUNDS") {
            d["responseCode"] = "La cuenta no tenía fondos suficientes.";
        }
        if (r["transactionResponse"]["responseCode"] === "CREDIT_CARD_NOT_AUTHORIZED_FOR_INTERNET_TRANSACTIONS") {
            d["responseCode"] = "La tarjeta de crédito no estaba autorizada para transacciones por Internet.";
        }
        if (r["transactionResponse"]["responseCode"] === "INVALID_TRANSACTION") {
            d["responseCode"] = "La red financiera reportó que la transacción fue inválida.";
        }
        if (r["transactionResponse"]["responseCode"] === "EXPIRED_CARD") {
            d["responseCode"] = "La tarjeta ya expiró.";
        }
        if (r["transactionResponse"]["responseCode"] === "RESTRICTED_CARD") {
            d["responseCode"] = "La tarjeta presenta una restricción.";
        }
        if (r["transactionResponse"]["responseCode"] === "CONTACT_THE_ENTITY") {
            d["responseCode"] = "Debe contactar al banco.";
        }
        if (r["transactionResponse"]["responseCode"] === "REPEAT_TRANSACTION") {
            d["responseCode"] = "Se debe repetir la transacción.";
        }
        if (r["transactionResponse"]["responseCode"] === "ENTITY_MESSAGING_ERROR") {
            d["responseCode"] = "La red financiera reportó un error de comunicaciones con el banco.";
        }
        if (r["transactionResponse"]["responseCode"] == "BANK_UNREACHABLE") {
            d["responseCode"] = "El banco no se encontraba disponible.";
        }
        if (r["transactionResponse"]["responseCode"] == "EXCEEDED_AMOUNT") {
            d["responseCode"] = "La transacción excede un monto establecido por el banco.";
        }
        if (r["transactionResponse"]["responseCode"] == "NOT_ACCEPTED_TRANSACTION") {
            d["responseCode"] = "La transacción no fue aceptada por el banco por algún motivo.";
        }
        if (r["transactionResponse"]["responseCode"] == "ERROR_CONVERTING_TRANSACTION_AMOUNTS") {
            d["responseCode"] = "Ocurrió un error convirtiendo los montos a la moneda de pago.";
        }
        if (r["transactionResponse"]["responseCode"] == "EXPIRED_TRANSACTION") {
            d["responseCode"] = "La transacción expiró.";
        }
        if (r["transactionResponse"]["responseCode"] === "PENDING_TRANSACTION_REVIEW") {
            d["responseCode"] = "La transacción fue detenida y debe ser revisada, esto puede ocurrir por filtros de seguridad.";
        }
        if (r["transactionResponse"]["responseCode"] === "PENDING_TRANSACTION_CONFIRMATION") {
            d["responseCode"] = "La transacción está pendiente de ser confirmada.";
        }
        if (r["transactionResponse"]["responseCode"] === "PENDING_TRANSACTION_TRANSMISSION") {
            d["responseCode"] = "La transacción está pendiente para ser trasmitida a la red financiera. Normalmente esto aplica para transacciones con medios de pago en efectivo.";
        }
        if (r["transactionResponse"]["responseCode"] === "PAYMENT_NETWORK_BAD_RESPONSE") {
            d["responseCode"] = "El mensaje retornado por la red financiera es inconsistente.";
        }
        if (r["transactionResponse"]["responseCode"] === "PAYMENT_NETWORK_NO_CONNECTION") {
            d["responseCode"] = "No se pudo realizar la conexión con la red financiera.";
        }
        if (r["transactionResponse"]["responseCode"] === "PAYMENT_NETWORK_NO_RESPONSE") {
            d["responseCode"] = "La red financiera no respondió.";
        }
        if (r["transactionResponse"]["responseCode"] === "FIX_NOT_REQUIRED") {
            d["responseCode"] = "Clínica de transacciones: Código de manejo interno.";
        }
        if (r["transactionResponse"]["responseCode"] === "AUTOMATICALLY_FIXED_AND_SUCCESS_REVERSAL") {
            d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
        }
        if (r["transactionResponse"]["responseCode"] === "AUTOMATICALLY_FIXED_AND_UNSUCCESS_REVERSAL") {
            d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
        }
        if (r["transactionResponse"]["responseCode"] === "AUTOMATIC_FIXED_NOT_SUPPORTED") {
            d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
        }
        if (r["transactionResponse"]["responseCode"] === "NOT_FIXED_FOR_ERROR_STATE") {
            d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
        }
        if (r["transactionResponse"]["responseCode"] === "ERROR_FIXING_AND_REVERSING") {
            d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
        }
        if (r["transactionResponse"]["responseCode"] === "ERROR_FIXING_INCOMPLETE_DATA") {
            d["responseCode"] = "Clínica de transacciones: Código de manejo interno. Sólo aplica para la API de reportes.";
        }
        if (r["transactionResponse"]["state"] === "APPROVED") {
            d["status"] = "APPROVED";
            d["status_description"] = "Transacción aprobada";
            d["approved"] = true;
        } else
        if (r["transactionResponse"]["state"] === "DECLINED") {
            d["status"] = "DECLINED";
            d["status_description"] = "Transacción rechazada";
            d["approved"] = false;
        } else
        if (r["transactionResponse"]["state"] === "ERROR") {
            d["status"] = "ERROR";
            d["status_description"] = "Error procesando la transacción";
            d["approved"] = false;
        } else
        if (r["transactionResponse"]["state"] === "EXPIRED") {
            d["status"] = "EXPIRED";
            d["status_description"] = "Transacción expirada";
            d["approved"] = false;
        } else
        if (r["transactionResponse"]["state"] === "PENDING") {
            d["status"] = "PENDING";
            d["status_description"] = "Transacción pendiente o en validación";
            d["approved"] = false;
        } else
        if (r["transactionResponse"]["state"] === "SUBMITTED") {
            d["status"] = "PENDING";
            d["status_description"] = "Transacción enviada a la entidad financiera y por algún motivo no terminó su procesamiento. Sólo aplica para la API de reportes.";
            d["approved"] = false;
        }
        if (testing === true) {
            d["status"] = "APPROVED";
            d["status_description"] = "Transacción aprobada (modo pruebas)";
            d["approved"] = true;
//            d["responseCode"] = "La transacción fue aprobada (modo pruebas)";
        }
        d["modo_pruebas"] = testing;
        return d;
    },
    addNumber: function addNumber(nStr) {
        var x, x1, x2;
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    getToken: function getToken() {
        var token = null;
        if (nw.evalueData(window.localStorage.getItem("token"))) {
            token = window.localStorage.getItem("token");
        }
        return token;
    },
    getPermission: function (permissionType, callback) {
        var self = this;
        if (typeof window.plugins === "undefined") {
            return false;
        }
        var Permission = window.plugins.Permission;
// request grant for a permission
//        var permission = 'android.permission.RECORD_AUDIO';
//        Permission.request(permission, function (results) {
//            if (results[permission]) {
//                // permission is granted
//                alert("permission is granted");
//            }
//        }, function (error) {
//            alert(error);
//        });

// request grant for multiple permissions
//        var permissions = ['android.permission.RECORD_AUDIO', 'android.permission.CAMERA', 'android.permission.MICROPHONE'];
//        var permissions = config.permissions;
//        var permissions = ['android.permission.RECORD_AUDIO'];
        Permission.request(permissionType, function (results) {
            var total = permissionType.length;
            var totalPerms = 0;
            for (var i = 0; i < total; i++) {
                var perm = permissionType[i];
                if (results[perm]) {
                    totalPerms++;
                    console.log("permission is granted " + perm);
                }
            }
            console.log("results", results);
            console.log("permissionType", permissionType);
            console.log("totalPerms", totalPerms);
            console.log("total", total);
            if (totalPerms >= total) {
                console.log("Todos los permisos concedidos");
                if (typeof callback !== "undefined") {
                    callback();
                }
            }
//            if (results['android.permission.RECORD_AUDIO']) {
//                // permission is granted
//                console.log("permission is granted RECORD_AUDIO");
//            }
        }, function (error) {
            alert(error);
        });
    },
    getExtensionFile: function (archivo) {
        return (archivo.substring(archivo.lastIndexOf("."))).toLowerCase();
    }
};
//nw.initialize();

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
        }
    }
});