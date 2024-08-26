nw.Class.define("main", {
    extend: nw.menu,
    construct: function () {
        var self = this;
        self.androidMinVersionPermissions = 13;

        console.log("device", device);
        nw.console.log("device", device);
        if (typeof newRouteRelease != "undefined") {
            self.carpet_files_extern = newRouteRelease + "/driver/";
        } else {
            self.carpet_files_extern = "/lib_mobile/driver/";
        }

        console.log("self.carpet_files_extern:::", self.carpet_files_extern);

        config.addTextInAccountOtherData = "";
        config.addButtonsInAccountOtherData = [];
        main.sumAddbtns = -1;

        if (typeof device != "undefined") {
            if (typeof device.version != "undefined") {
                config.addTextInAccountOtherData += "<br />Versión OS: " + device.version;
            }
        }

        var up = nw.userPolicies.getUserData();
        var os = nw.utils.getMobileOperatingSystem();
        console.log("os", os);
        self.debugConstruct = false;
        self.show_services = [];
        self.configCliente = [];

        main.selfMapaDriver = {};
        main.selfMapaDriver.serviceActive = false;
        main.selfMapaDriver.serviceActive = false;
        main.selfMapaDriver.data_service = false;

//        self.onBackgroundModeNew();

//        var sign = new signature_pad();
//        sign.construct(function (data) {
//            console.log("data", data);
//        });
//        return;
//        self.resolvePreoperacional();
//        return;
        if (os === "IOS") {
//        if (os === "IOS") {
            nw.requireCss(config.domain_rpc + self.carpet_files_extern + "css/iphone.css?v=" + config.version + config.version_in_this_device, "body", false, function () {

            });
        }

//        self.initDataBaseLocal();
        var online = nw.isOnline();
        if (!online) {
            nw.dialog("Por favor verifique su conexión a internet");
//            return false;
        }

        var d = document.createElement("style");
        d.innerHTML = ".InfoIdService, .infoServiceCompany{color: #656363; text-align: left; font-size: 14px;}";
        document.body.appendChild(d);


        if (nw.evalueData(up.servicios_activos) && up.servicios_activos !== "NO") {
            var servicios = JSON.parse(up.servicios_activos);
            var dr = document.createElement("div");
            dr.className = "dataServicesEnc";
            var htd = "";
            if (nw.utils.evalueData(up.placa_activa)) {
                htd += "<div class='placaActivaSpan'><i class='material-icons'>directions_car</i> " + nw.tr("Placa en uso") + ": <span class='placaActivaSpanText'>" + up.placa_activa + "</span></div>";
            }
            htd += "<i class='material-icons'>room_service</i> " + nw.tr("Servicios activos") + ": ";
            for (var i = 0; i < servicios.length; i++) {
                var sr = servicios[i];
                htd += "<span class='serviceSpan'>" + sr.nombre + " (" + sr.id + ")</span>, ";
            }
            dr.innerHTML = htd;
            document.querySelector(".dataUserLeft").appendChild(dr);
        }


//        self.initHome();
        self.configuracionServi(function () {
//            self.initHome();
            if (self.configCliente.usa_bloqueo_conductores === "SI") {
                self.initBloqueoApp();
            }
            if (self.configCliente.pide_documentos_conductores === "SI") {
                if (nw.evalueData(up.foto_perfil) === false || up.foto_perfil === "false") {
                    if (typeof navigator.splashscreen !== "undefined") {
                        navigator.splashscreen.hide();
                    }
                    $(".containMapAndOpened").remove();
                    var da = new f_documentos_conductor();
                    da.construct(false, true);
                    nw.dialog("<h1 class='titlevehione'>" + nw.tr("Por favor ingrese los documentos de conducción") + "</h1>");
                    main.removeLoadingInitial();
                    return false;
                }
            }
            if (self.configCliente.pide_vehiculo_conductores === "SI" || up.rechazado === "SI") {
                self.datosVehiculos(initVehiculo);
                function initVehiculo(d) {
                    console.log("initVehiculo:::d", d);
//                    nw.inactivateBackgroundMode();
                    if (d === false || d === true && up.rechazado === "SI") {
                        if (typeof navigator.splashscreen !== "undefined") {
                            navigator.splashscreen.hide();
                        }
                        $(".containMapAndOpened").remove();
                        var da = new f_vehiculo();
                        da.construct(false, true);
                        nw.dialog(nw.tr("Para continuar debe registrar un vehículo."));
                        main.removeLoadingInitial();
//                        da.show();
//                        da.addHeaderNote("<h1 class='titlevehione'>Por favor registre los datos de su vehículo</h1>");
                        return false;
                    }
                    if (!nw.evalueData(self.vehiculo.id) || d.estado_activacion.toString() != "1") {
                        $(".containMapAndOpened").remove();
//                        nw.dialog("Por favor active el vehículo con el que se va a trabajar.");
                        var options = {};
                        options.textAccept = nw.tr("Ir a mis vehículos");
                        nw.dialog(nw.tr("Lo sentimos, para continuar, debe tener activo y aprobado un vehículo."));
                        var d = new l_vehiculos();
                        d.construct(true);
                        main.removeLoadingInitial();
                        return d;
                    }
                    self.initHome();
                }
            } else {
                self.initHome();
            }
//            self.initHome();

            if (self.configCliente.usa_banners_promo === "SI") {
                setTimeout(function () {
                    nw.getPromotionsApp();
                }, 5000);
            }
        });

//        var urlc = config.domain_rpc + "/lib_mobile/driver/nwmaker/css/nwmaker-2.css?v=" + versionInAppLibDevice;
//        urlc = urlc.replace("//lib_mobile", "/lib_mobile", urlc);
//        var linkcssmain = document.querySelector("link[href='" + urlc + "']");
//        if (linkcssmain) {
//            linkcssmain.href = urlc + config.version_in_this_device;
//        }
//        var urlc = config.domain_rpc + "/lib_mobile/driver/css/main.css?v=" + versionInAppLibDevice;
//        urlc = urlc.replace("//lib_mobile", "/lib_mobile", urlc);
//        var linkcssmain = document.querySelector("link[href='" + urlc + "']");
//        if (linkcssmain) {
//            linkcssmain.href = urlc + config.version_in_this_device;
//        }
    },
    destruct: function () {
    },
    members: {
        selfCrearViaje: null,
        selfMapaDriver: null,
        id_service_active: null,
        vehiculo: {
            id: null,
            marca_text: null,
            placa: null,
            color: null
        },
        configCliente: null,
        cobro_con: null,
        addBtnAccount: function addBtnAccount(title, description, icone, callback) {
            main.sumAddbtns = main.sumAddbtns + 1;
            config.addButtonsInAccountOtherData[main.sumAddbtns] = function () {
                var con = ".menuProfile";
                var type = "center";
                var icon = "material-icons " + icone + " normal false";
                var addClass = "btn_others_account";
                var di = nw.generateLink(nw.tr(title), callback, type, 0, nw.tr(description), icon, "lists_simple", addClass);
                nw.appendLinkMenu(di, con);
            };
        },
        permissionsInDevice: function permissionsInDevice(callback) {
            var self = this;
            console.log("device", device);
            nw.console.log("device", device);
            console.log("parseInt(device.version)", parseInt(device.version));

            self.allPermissionGranted = true;
            if (typeof nw.permissions != "undefined" && parseInt(device.version) >= self.androidMinVersionPermissions) {
                nw.remove(".div_container_skips_notificacions");
                nw.remove(".popup_intered_permissions");

                var container = document.createElement("div");
                container.className = "div_container_skips_notificacions";
                document.body.appendChild(container);

                nw.permissions.get("ACCESS_FINE_LOCATION", "Por favor activa la ubicación precisa para poder ubicarte en el mapa", function (response, text) {
                    console.log("response", response);
                    console.log("text", text);
                    var msg = "<span style='color: green;'>" + nw.tr("Permiso concedido ubicación precisa.") + "</span>";
                    if (response === "rejected" || response === "skip") {
                        self.allPermissionGranted = false;
                        var msg = "<span style='color: red;'>" + nw.tr("Denegaste/omitiste la ubicación precisa, podrías presentar problemas de ubicación.") + "</span>";
                        var div = document.createElement("div");
                        div.className = "popup_intered_permissions";
                        div.innerHTML = nw.tr("La ubicación precisa está actualmente desactivada, toca para activarla.");
                        div.onclick = function () {
                            this.remove();
                            window.cordova.plugins.settings.open("application_details", function () {
                                console.log('opened settings');
                            }, function () {
                                console.log('failed to open settings');
                            });
                        };
                        container.appendChild(div);
                    }
                    config.addTextInAccountOtherData += "<br />" + msg;
                    self.addBtnAccount("Ubicación", "Configurar permisos de ubicación", "edit_location", function () {
                        window.cordova.plugins.settings.open("application_details", function () {
                            console.log('opened settings');
                        }, function () {
                            console.log('failed to open settings');
                        });
                    });
                    self.savePerm(text);

                    nw.permissions.get("POST_NOTIFICATIONS", nw.tr("Por favor activa las notificaciones para recibir mensajes de chat, nuevos servicios y otros"), function (response, text) {
                        console.log("response", response);
                        console.log("text", text);
                        var msg = "<span style='color: green;'>" + nw.tr("Permiso concedido notificaciones.") + "</span>";
                        if (response === "rejected" || response === "skip") {
                            self.allPermissionGranted = false;
                            var msg = "<span style='color: red;'>" + nw.tr("Denegaste las notificaciones, podrías presentar problemas de comunicación.") + "</span>";
                            var div = document.createElement("div");
                            div.className = "popup_intered_permissions";
                            div.innerHTML = nw.tr("Las notificaciones están actualmente desactivadas, toca para activarlas.");
                            div.onclick = function () {
                                this.remove();
                                window.cordova.plugins.settings.open("notification_id", function () {
                                    console.log('opened settings');
                                }, function () {
                                    console.log('failed to open settings');
                                });
                            };
                            container.appendChild(div);
                        }
                        config.addTextInAccountOtherData += "<br />" + msg;
                        self.addBtnAccount("Notificaciones", "Configurar permisos de notificaciones", "notifications", function () {
                            window.cordova.plugins.settings.open("notification_id", function () {
                                console.log('opened settings');
                            }, function () {
                                console.log('failed to open settings');
                            });
                        });
                        self.savePerm(text);

                        nw.permissions.get("ACCESS_BACKGROUND_LOCATION", nw.tr("Por favor activa la ubicación en segundo plano"), function (response, text) {
                            console.log("response", response);
                            console.log("text", text);
                            var msg = "<span style='color: green;'>" + nw.tr("Permiso concedido ubicación en segundo plano.") + "</span>";
                            if (response === "rejected" || response === "skip") {
                                self.allPermissionGranted = false;
                                var msg = "<span style='color: red;'>" + nw.tr("Denegaste/omitiste la ubicación en segundo plano, podrías presentar problemas de ubicación.") + "</span>";
                                var div = document.createElement("div");
                                div.className = "popup_intered_permissions";
                                div.innerHTML = nw.tr("La ubicación en segundo plano está actualmente desactivada, toca para activarla.");
                                div.onclick = function () {
                                    this.remove();
                                    window.cordova.plugins.settings.open("location", function () {
                                        console.log('opened settings');
                                    }, function () {
                                        console.log('failed to open settings');
                                    });
                                };
                                container.appendChild(div);
                            }

                            if (typeof app.startBackgroundQuestion != "undefined") {
                                app.startBackgroundQuestion();
                            }

                            config.addTextInAccountOtherData += "<br />" + msg;
                            self.addBtnAccount("Ubicación segundo plano", "Configurar permisos de ubicación en segundo plano", "edit_location", function () {
                                window.cordova.plugins.settings.open("application_details", function () {
                                    console.log('opened settings');
                                }, function () {
                                    console.log('failed to open settings');
                                });
                            });
                            self.savePerm(text);

                            if (typeof callback != "undefined") {
                                callback();
                            }

                            console.log("self.allPermissionGranted", self.allPermissionGranted);
                            if (!self.allPermissionGranted) {
//                                setTimeout(function () {
//                                    self.permissionsInDevice();
//                                }, 120000);
                            }

                        }, function () {
                            window.cordova.plugins.settings.open("application_details", function () {
                                console.log('opened settings');
                            }, function () {
                                console.log('failed to open settings');
                            });
                        });
                    }, function () {
                        window.cordova.plugins.settings.open("notification_id", function () {
                            console.log('opened settings');
                        }, function () {
                            console.log('failed to open settings');
                        });
                    });
                }, function () {
                    window.cordova.plugins.settings.open("application_details", function () {
                        console.log('opened settings');
                    }, function () {
                        console.log('failed to open settings');
                    });
                });
                return;
            }

            if (typeof app.startBackgroundQuestion != "undefined") {
                app.startBackgroundQuestion();
            }

            var up = nw.userPolicies.getUserData();
            var os = nw.utils.getMobileOperatingSystem();
            if (os != "IOS") {
                if (typeof cordova.plugins != "undefined") {
                    if (typeof cordova.plugins.diagnostic != "undefined") {
                        cordova.plugins.diagnostic.requestRuntimePermissions(function (statuses) {
                            console.log("statuses", statuses);
                            for (var permission in statuses) {
                                switch (statuses[permission]) {
                                    case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                                        console.log("Permission granted to use " + permission);
                                        break;
                                    case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                                        console.log("Permission to use " + permission + " has not been requested yet");
                                        break;
                                    case cordova.plugins.diagnostic.permissionStatus.DENIED:
                                        console.log("Permission denied to use " + permission + " - ask again?");
                                        break;
                                    case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                                        console.log("Permission permanently denied to use " + permission + " - guess we won't be using it then!");
                                        break;
                                }
                            }
                            self.savePerm(JSON.stringify(statuses));
                        }, function (error) {
                            console.log("The following error occurred: ", error);
//                        console.error("The following error occurred: " + error);
                            self.savePerm(error);
                        }, [
                            cordova.plugins.diagnostic.permission.RECEIVE_WAP_PUSH,
                            cordova.plugins.diagnostic.permission.MANAGE_EXTERNAL_STORAGE,
                            cordova.plugins.diagnostic.permission.READ_MEDIA_IMAGES,
                            cordova.plugins.diagnostic.permission.READ_MEDIA_VIDEO,
                            cordova.plugins.diagnostic.permission.WRITE_EXTERNAL_STORAGE,
//                cordova.plugins.diagnostic.permission.ACTION_CREATE_DOCUMENT,
//                cordova.plugins.diagnostic.permission.ACTION_OPEN_DOCUMENT,
//                cordova.plugins.diagnostic.permission.ACTIVITY_RECOGNITION,
                            cordova.plugins.diagnostic.permission.ACCESS_COARSE_LOCATION,
                            cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION,
                            cordova.plugins.diagnostic.permission.ACCESS_MEDIA_LOCATION,
                            cordova.plugins.diagnostic.permission.ACCESS_BACKGROUND_LOCATION,
                            cordova.plugins.diagnostic.permission.POST_NOTIFICATIONS,
                            cordova.plugins.diagnostic.permission.CAMERA,
                            cordova.plugins.diagnostic.permission.READ_EXTERNAL_STORAGE,
                            cordova.plugins.diagnostic.permission.SAVE_TO_ALBUM_SEC,
                            cordova.plugins.diagnostic.permission.READ_PHONE_STATE
                        ]);

                        cordova.plugins.diagnostic.requestCameraAuthorization(
                                function (status) {
                                    console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
                                }, function (error) {
                            console.error("The following error occurred: " + error);
                        }, false
                                );

                        cordova.plugins.diagnostic.isRemoteNotificationsEnabled(function () {
//                            alert("SIII")
                        }, function () {
//                            alert("NOOOO")
                        });


//                    cordova.plugins.diagnostic.isLocationAuthorized(function (authorized) {
//                        var estado = (authorized ? "authorized" : "unauthorized");
//                        console.log("Location is ", estado);
//                        if(estado == "unauthorized") {
//                            nw.dialog("La solicitud de autorización para el uso de ubicación fue DENEGADA. Por favor active los servicios de localización");
//                        }
//                    }, function (error) {
//                        console.error("The following error occurred: " + error);
//                    });
                        cordova.plugins.diagnostic.requestExternalStorageAuthorization(function (status) {
                            var estado = status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied";
                            console.log("requestExternalStorageAuthorization:::estado", estado);
                            console.log("Authorization request for external storage use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
                            if (estado == "denied") {
//                            nw.dialog("La solicitud de autorización para el uso de almacenamiento externo fue DENEGADA");
                            }
                        }, function (error) {
                            console.error("cordova.plugins.diagnostic.requestExternalStorageAuthorization", error);
                        });

                        cordova.plugins.diagnostic.getExternalStorageAuthorizationStatus(function (status) {
                            if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
                                console.log("External storage use is authorized");
                            }
                        }, function (error) {
                            console.error("The following error occurred: " + error);
                        });

                        cordova.plugins.diagnostic.isExternalStorageAuthorized(function (authorized) {
                            console.log("App is " + (authorized ? "authorized" : "denied") + " access to the external storage");
                        }, function (error) {
                            console.error("The following error occurred: " + error);
                        });
                    }
                }
            }
            if (typeof cordova.plugins != "undefined") {
                if (typeof cordova.plugins.firebase != "undefined") {
                    if (typeof cordova.plugins.firebase.messaging != "undefined") {
                        cordova.plugins.firebase.messaging.requestPermission({forceShow: false}).then(function (e) {
                            console.log("Push messaging is allowed", e);
                        }).catch((function (error) {
                            console.log('Error: ' + error);
//                            nw.dialog("Por favor active las notificaciones", function () {
//                                cordova.plugins.firebase.messaging.requestPermission().then(function () {
//                                    console.log("Push messaging is allowed");
//                                });
//                            }, function () {
//                                return true;
//                            }, {original: true});
                        }));
//        setTimeout(function () {
//            nw.dialog("Activar notificaciones", function () {
//                cordova.plugins.firebase.messaging.requestPermission({forceShow: true}).then(function () {
//                    console.log("Push messaging is allowed");
//                });
//            }, function () {
//                return true;
//            });
//        }, 3000);
//        cordova.plugins.firebase.messaging.getToken().then(function (token) {
//            console.log("Got device token: ", token);
//        });
                    }
                }
            }

            nw.getPermission([
                'android.permission.POST_NOTIFICATIONS',
                'android.permission.RECEIVE_WAP_PUSH',
                'android.permission.READ_MEDIA_IMAGES',
                'android.permission.READ_MEDIA_VIDEO',
                'android.permission.ACTIVITY_RECOGNITION',
                'android.permission.ACCESS_FINE_LOCATION',
                'android.permission.ACCESS_COARSE_LOCATION',
                'android.permission.READ_PHONE_STATE',
                'android.permission.READ_EXTERNAL_STORAGE',
                'android.permission.SAVE_TO_ALBUM_SEC',
                'android.permission.RECORD_VIDEO',
                'android.permission.WRITE_EXTERNAL_STORAGE',
                'android.permission.ACCESS_WIFI_STATE',
                'android.permission.ACCESS_NETWORK_STATE',
                'android.permission.RECORD_AUDIO',
                'android.permission.MODIFY_AUDIO_SETTINGS',
                'android.permission.FLASHLIGHT',
                'android.permission.RECORD_AUDIO',
                'android.permission.CAMERA',
                'android.permission.MICROPHONE'
            ], function () {
                console.log("Permisos concedidos");
            });

//            if (typeof window.plugins === "undefined") {
//                callback();
//            }

            nw.getPermission([
                'android.permission.POST_NOTIFICATIONS'
            ], function (res) {
                if (!res) {
                    console.log("NO Permisos concedidos noti");
                } else {
                    console.log("Permisos concedidos noti");
                }

                nw.getPermission([
                    'android.permission.ACCESS_FINE_LOCATION'
                ], function () {
                    console.log("Permisos concedidos");

                    if (typeof callback != "undefined") {
                        callback();
                    }

                });

            });


            if (typeof cordova.plugins != "undefined") {
                if (typeof cordova.plugins.notification != "undefined") {

                    cordova.plugins.notification.local.setDummyNotifications();

                    cordova.plugins.notification.local.hasPermission(function (granted) {
//                alert("cordova.plugins.notification.local.hasPermission granted");
//                alert(granted);
//                    nw.dialog("Activar notificaciones", function () {
//
//                    }, function() {
//                        return true;
//                    });
                    });

                    cordova.plugins.notification.local.requestPermission(function (granted) {
//                alert("cordova.plugins.notification.local.requestPermission granted");
//                alert(granted);
                    });

                    cordova.plugins.notification.local.schedule({
                        title: '¡Bienvenido!',
                        text: 'Hola ' + up.nombre,
                        foreground: true
                    });
                }
            }

            if (typeof callback != "undefined") {
                callback();
            }
        },
        savePerm: function savePerm(text) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var os = nw.utils.getMobileOperatingSystem();
            var update = "NO";
            if (nw.utils.evalueData(window.localStorage.getItem("userPermissionsSet"))) {
                console.log("text", text);
                console.log("window.localStorage.getItem(userPermissionsSet)", window.localStorage.getItem("userPermissionsSet"));
                if (window.localStorage.getItem("userPermissionsSet") == text) {
                    update = "SI";
                }
            }

            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.os = os;
            data.text = text;
            data.actualizar = update;
            data.token = null;
            if (nw.evalueData(window.localStorage.getItem("token"))) {
                data.token = window.localStorage.getItem("token");
            }
            var rpc = new nw.rpc(nw.getRpcUrl(), "app_user");
            rpc.setAsync(true);
            rpc.setLoading(false);
            console.log("savePermisos:::dataSend", data);
            var funcs = function (r) {
                window.localStorage.setItem("userPermissionsSet", text);
                console.log("savePermisos:::responseServer", r);
            };
            rpc.exec("savePermisos", data, funcs);
        },
        loadInitFirebase: function loadInitFirebase() {
            var self = this;
            var up = nw.userPolicies.getUserData();
//            console.log("up", up);
            var usaInrealTime = "NO";
            if (main.configCliente.usa_firebase == "SI") {
                usaInrealTime = "SI";
            }
            var firebasePruebas = false;
            //movilmove producción services 20nov2023
            var domain = config.domain_rpc;
            domain = nw.utils.str_replace("/", "", domain);
            domain = nw.utils.str_replace("//", "", domain);
            domain = nw.utils.str_replace(":", "", domain);
            domain = nw.utils.str_replace("https", "", domain);
            domain = nw.utils.str_replace("http", "", domain);
            console.log("domain", domain);
            var firebaseConfig = false;
            if (domain == "app.movilmove.com" || domain == "app.transfershcy.com") {
                firebasePruebas = nw.tr("PRODUCCIÓN");
                firebaseConfig = {
                    apiKey: "AIzaSyCANJzxDNeSj-MFeOdEtOEmapAiR0r5Yvw",
                    authDomain: "movilmove-services.firebaseapp.com",
                    projectId: "movilmove-services",
                    storageBucket: "movilmove-services.appspot.com",
                    messagingSenderId: "766196491813",
                    appId: "1:766196491813:web:9f1e67fa80f885094d01cc"
                };
            }
            if (domain == "test.movilmove.com" || domain == "ultimamilla.sitca.co" || domain == "eu.movilmove.com" || domain == "192.168.1.45" || domain == "movilmove.loc" || domain == "192.168.1.7") {
                firebasePruebas = nw.tr("PRUEBAS");
//            }
//            if (config.usa_firebase_modo_pruebas == "SI") {
                //movilmove test services 21nov2023
                firebaseConfig = {
                    apiKey: "AIzaSyDficCW6wxBnN_9uuwrp7yUBQVukXmhMBg",
                    authDomain: "movilmove-services-test.firebaseapp.com",
                    projectId: "movilmove-services-test",
                    storageBucket: "movilmove-services-test.appspot.com",
                    messagingSenderId: "496616900417",
                    appId: "1:496616900417:web:13ae352d745983daed03c0"
                };
            }
            if (!firebasePruebas || !firebaseConfig) {
                nw.utils.dialog("NO puede activar Firebase en este dominio " + domain + ". No autorizado.");
                return false;
            }
            var msg = "¡Realtime active (LoadServices: " + usaInrealTime + ") in mode " + firebasePruebas + "! " + domain;
            config.addTextInAccountOtherData += "<br />" + msg;

            nw.firebase.load(firebaseConfig, function () {
                if (main.configCliente.usa_firebase == "SI") {
                    self.getServiceInFirebase();
                }
                self.getNotificationsInFirebase();
            });
        },
        readNotificationsInFirebase: function readNotificationsInFirebase(datarow) {
            var up = nw.userPolicies.getUserData();
            console.log("datarow", datarow);
//            for (var i = 0; i < array.length; i++) {
//                var dat = array[i];
            var dat = datarow;
            var p = {};
            p.collection = dat.collection;
            p.document = dat.document;
            p.fields = {};
//            p.fields.open = "SI";
//            p.fields.count = 0;
            p.fields["open_" + nw.utils.cleanUserNwC(up.usuario)] = "SI";
            p.fields["count_" + nw.utils.cleanUserNwC(up.usuario)] = 0;
            nw.firebase.update(p);
//            }
        },
        getNotificationsInFirebase: function getNotificationsInFirebase() {
//            if (main.configCliente.usa_firebase != "SI") {
//                return;
//            }
            var selfthis = this;
            nw.utils.createContainerNotifications();

            app.readNotificationsInFirebase = selfthis.readNotificationsInFirebase;

            var up = nw.userPolicies.getUserData();

            var ops = {};
//            ops.table = "notifications";
            ops.table = "chats";
            var sum = 0;
            ops.where_array = [];
            ops.where_array[sum] = {variable: "empresa", operator: "==", equal: up.empresa};
//            sum = sum + 1;
//            ops.where_array[sum] = {variable: "perfil", operator: "==", equal: up.perfil};
//            sum = sum + 1;
//            ops.where_array[sum] = {variable: "usuario", operator: "==", equal: up.usuario};
            sum = sum + 1;
            ops.where_array[sum] = {variable: "usuarios", operator: "array-contains", equal: up.usuario};

            ops.limit = 20;
            ops.order = true;
            ops.orderField = "date";
            ops.orderAscDesc = "desc";
            ops.getModelData = false;
            ops.destroyQuery = false;
            ops.callback = function (r, snapshot, query) {
//                    console.log("query", query);
                snapshot.docChanges().forEach(function (change) {
                    var data = change.doc.data();
//                    console.log("getNotificationsInFirebase:::snapshot.empty", snapshot.empty);
//                    console.log("getNotificationsInFirebase:::change.type", change.type);
                    console.warn("getNotificationsInFirebase:::data:::change.type", change.type, data);

                    var chatOpen = document.querySelector(".framechat_conversation_" + data.room);
                    for (var i = 0; i < data.usuarios_more_data.length; i++) {
                        var us = data.usuarios_more_data[i];
                        if (us.usuario != up.usuario) {
                            data.title = us.nombre;
                            data.envia_foto = us.foto;
                        }
                    }
                    data.others = "Servicio#" + data.id_viaje + " para el " + data.id_servicio_fecha + " " + data.id_servicio_hora + " (Room " + data.room + ")";
                    if (nw.utils.evalueData(data.all_data_travel)) {
                        if (nw.utils.evalueData(data.all_data_travel.placa)) {
                            data.others += " - Placa " + data.all_data_travel.placa;
                        }
                    }
                    var key;
                    for (key in data) {
                        if (key == "count_" + nw.utils.cleanUserNwC(up.usuario)) {
                            data.count = data["count_" + nw.utils.cleanUserNwC(up.usuario)];
                        }
                        if (key == "total_" + nw.utils.cleanUserNwC(up.usuario)) {
                            data.total = data["total_" + nw.utils.cleanUserNwC(up.usuario)];
                        }
                        if (key == "open_" + nw.utils.cleanUserNwC(up.usuario)) {
                            data.open = data["open_" + nw.utils.cleanUserNwC(up.usuario)];
                        }
                    }

                    if (chatOpen) {
                        selfthis.readNotificationsInFirebase(data);
                    } else {
                        nw.utils.addBellNewNotification(data, change.type);
                    }
                    data.callback = function (da) {
                        console.log("da", da);
                        if (da.type == "chat_principal") {
                            main.contextMenuServiceFirebase({id: da.id_viaje});
                            return;
                        }
                        var data = {};
                        data.id = da.room;
//                        data.cliente_nombre = up.nombre;
                        data.cliente_nombre = da.title;
                        var d = new f_chat();
                        d.construct(data);
                    };
                    nw.utils.addNewNotification(data);
                });
            };
            nw.firebase.select(ops);
        },
        getServiceInFirebase: function getServiceInFirebase() {
            if (main.configCliente.usa_firebase != "SI") {
                return;
            }
            if (main.configCliente.usa_firebase_account == "NO") {
                return false;
            }
            var selfthis = this;
            var self = main.driver;
            var up = nw.userPolicies.getUserData();
            var date = nw.utilsDate.getActualFullDate();

            var ops = {};
            ops.table = "servicios";
            var sum = 0;
            ops.where_array = [];
            ops.where_array[sum] = {variable: "empresa", operator: "==", equal: up.empresa};
            sum = sum + 1;
            ops.where_array[sum] = {variable: "estado", operator: "==", equal: "SOLICITUD"};
//            ops.where_array[1] = {variable: "estado", operator: "in", equal: ["SOLICITUD", "CONDUCTOR_ASIGNADO", "CONDUCTOR_REASIGNADO"]};
//            ops.where_array[1] = {variable: "estado", operator: "array-contains", equal: ["SOLICITUD", "CONDUCTOR_ASIGNADO", "CONDUCTOR_REASIGNADO"]};
//            ops.where_array[1] = {variable: "estado_array", operator: "array-contains", equal: ["SOLICITUD", "CONDUCTOR_ASIGNADO", "CONDUCTOR_REASIGNADO"]};
//            ops.where_array[1] = {variable: "estado_array", operator: "array-contains-any", equal: ["SOLICITUD", "CONDUCTOR_ASIGNADO", "CONDUCTOR_REASIGNADO"]};

//            console.log("self.idServicesMostrados", self.idServicesMostrados);

//            ops.where_array[sum++] = {variable: "drivers_rechazan_array", operator: "!=", equal: [up.usuario]};
//            ops.where_array[2] = {variable: "drivers_rechazan_array", operator: "array-contains", equal: up.usuario};
//            ops.where_array[2] = {variable: "estado", operator: "array-contains", equal: ["SOLICITUD", "CONDUCTOR_ASIGNADO", "CONDUCTOR_REASIGNADO"]};

            if (main.configCliente.tomarServiciosReservadosAutomatic == "SI") {
                sum = sum + 1;
                ops.where_array[sum] = {variable: "conductor_usuario", operator: "==", equal: up.usuario};
            } else {
                if (nw.utils.evalueData(up.servicios_activos)) {
                    var servicios = JSON.parse(up.servicios_activos);
//                    console.log("servicios", servicios);
                    var servs = [];
                    for (var i = 0; i < servicios.length; i++) {
                        servs.push(servicios[i].id);
                    }
                    console.log("servs", servs);
//                    ops.where_array[sum++] = {variable: "subcategoria_servicio", operator: "in", equal: servs};
                }
                sum = sum + 1;
                ops.where_array[sum] = {variable: "conductores_disponibles", operator: "array-contains", equal: up.usuario};
            }
//            ops.where_array[sum++] = {variable: "drivers_rechazan_array", operator: "not-in", equal: [up.usuario]};

            ops.limit = 10;
            ops.order = true;
            ops.orderField = "fecha";
            ops.orderAscDesc = "desc";
            ops.orderField2 = ["hora", "desc"];
            ops.getModelData = false;
            ops.destroyQuery = false;
            ops.callback = function (r, snapshot, query) {
//                console.log("r", r);
//                console.log("snapshot", snapshot);
                console.log("snapshot.empty", snapshot.empty);
//                    console.log("query", query);
                snapshot.docChanges().forEach(function (change) {
                    var data = change.doc.data();
//                    console.log("snapshot.empty", snapshot.empty);
//                    console.log("change.type", change.type);
//                    console.log("data", data);
                    var noityExist = document.querySelector(".newServiceBar_" + data.id);
                    if (noityExist) {
                        nw.remove(noityExist);
                    }
                    if (change.type == "added" || change.type == "modified") {
                        console.log("%c<<<<FIREBASE_GET_SERVICES_SOLICITUD::: change.type " + change.type + " - ID: " + data.id + "!!!!!!!!!!!!!>>>>", 'background: orange; color: #000');
                        console.log("change.type:::data", change.type, data);
//                    alert("change in service firebase");
                        if (data.estado == "CONDUCTOR_ASIGNADO" || data.estado == "CONDUCTOR_REASIGNADO") {
                            data.estado = "SOLICITUD";
                        }
                        if (selfthis.validaRechazados(data)) {
                            self.constructServiceSolicitud(data);
                        }
                    }
                });
            };
            nw.firebase.select(ops);
        },
        validaServicioActivoFirebase: function validaServicioActivoFirebase() {
            if (main.configCliente.usa_firebase != "SI") {
                return;
            }
            if (main.configCliente.usa_firebase_account == "NO") {
                return false;
            }
            var selfthis = this;
            var self = main.driver;
            var up = nw.userPolicies.getUserData();

            var ops = {};
            ops.table = "servicios";
            var sum = 0;
            ops.where_array = [];
            ops.where_array[sum] = {variable: "empresa", operator: "==", equal: up.empresa};
            sum = sum + 1;
            ops.where_array[sum] = {variable: "conductor_id", operator: "==", equal: up.id_usuario};
            sum = sum + 1;
            ops.where_array[sum] = {variable: "estado", operator: "in", equal: ["EN_RUTA", "ABORDO", "EN_SITIO", "CANCELADO_POR_USUARIO"]};
            sum = sum + 1;
            ops.where_array[sum] = {variable: "calificacion_cliente", operator: "==", equal: null};
            ops.limit = 1;
            ops.order = true;
            ops.orderField = "id";
            ops.orderAscDesc = "desc";
//            ops.orderField2 = ["fecha_ultima_interaccion", "desc"];
            ops.getModelData = false;
            ops.destroyQuery = false;
            ops.callback = function (r, snapshot, query) {
//                console.log("r", r);
//                console.log("snapshot", snapshot);
//                console.log("snapshot.empty", snapshot.empty);
//                    console.log("query", query);
                snapshot.docChanges().forEach(function (change) {
                    var data = change.doc.data();
//                    console.log("change.type", change.type);
//                    console.log("data", data);
                    console.log("%c<<<<FIREBASE_GET_SERVICES_ACTIVES::: change.type " + change.type + " - ID: " + data.id + "!!!!!!!!!!!!!>>>>", 'background: orange; color: #000');
                    console.log("change.type:::data", change.type, data);

                    self.validaServiceActive(false, function () {
//                        alert("validando...");
                    }, data);

                });
            };
            nw.firebase.select(ops);
        },
        validaRechazados: function validaRechazados(data) {
            var self = main.driver;

            var isMostrado = self.searchServiceMostrado(data.id);
//            console.log("isMostrado", isMostrado);
            if (!isMostrado) {
                return false;
            }
            if (!nw.utils.evalueData(window.localStorage.getItem("addRechazadoServiceMostrado"))) {
                return true;
            }
            var d = window.localStorage.getItem("addRechazadoServiceMostrado");
            d = JSON.parse(d);

//            var d = self.idServicesMostrados;
//            console.log("dddddddddddd", d);
//            console.log("datadata", data);
            var show = true;
            for (var i = 0; i < d.length; i++) {
//                console.log("data.id", data.id);
//                console.log("d[i].id", d[i].id);
                if (d[i].id == data.id) {
                    show = false;
                }
            }
            return show;
        },
        registerServiceInFirebase: function registerServiceInFirebase(id, callback) {
//            if (main.configCliente.usa_firebase != "SI") {
//                return;
//            }
            if (main.configCliente.usa_firebase_account == "NO") {
                return false;
            }
            var up = nw.userPolicies.getUserData();
//            console.log("id", id);
            id = id.toString();
//            console.log("id", id);
            var data = {};
            data.ids = id.split("#");
            data.empresa = up.empresa;
            console.log("registerInFirebase:::sendData", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("registerInFirebase:::responseServer", r);
                for (var i = 0; i < r.length; i++) {
                    var ra = r[i];
                    console.log("ra", ra);
                    var p = {};
                    p.collection = "servicios";
                    p.document = ra.id;
                    for (var item in ra) {
                        p[item] = ra[item];
                    }
                    nw.firebase.set(p);
                    console.log("%c<<<<FIREBASE_REGISTER_SERVICE::: ID: " + ra.id + "!!!!!!!!!!!!!>>>>", 'background: orange; color: #000');
                    console.log("p:::data", p);
                    if (typeof callback != "undefined") {
                        callback(p);
                    }
                }
            };
            rpc.exec("getTravelsForFirebase", data, func);
        },
        updateOnlyFieldsServiceInFirebase: function updateOnlyFieldsServiceInFirebase(id, ra) {
//            if (main.configCliente.usa_firebase != "SI") {
//                return;
//            }
            if (main.configCliente.usa_firebase_account == "NO") {
                return false;
            }
//            console.log("id", id);
            var p = {};
            p.collection = "servicios";
            p.document = id;
            p.fields = {};
            for (var item in ra) {
//                console.log("item", item);
//                console.log("ra[item]", ra[item]);
                p.fields[item] = ra[item];
            }
            nw.firebase.update(p);
            console.log("%c<<<<FIREBASE_UPDATE_ONLY_FIELD_SERVICE::: ID: " + id + "!!!!!!!!!!!!!>>>>", 'background: orange; color: #000');
            console.log("ra:::data", ra);
        },
        saveOfertaServiceInFirebase: function saveOfertaServiceInFirebase(id, callback) {
//            if (main.configCliente.usa_firebase != "SI") {
//                callback();
//                return;
//            }
            if (main.configCliente.usa_firebase_account == "NO") {
                return false;
            }
//            console.log("id", id);
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id = id;
            data.empresa = up.empresa;
            console.log("saveOfertaServiceInFirebase:::sendData", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("saveOfertaServiceInFirebase:::responseServer", r);
                var p = {};
                p.collection = "servicios_ofertas";
                p.document = id.toString();
                for (var item in r) {
//                    console.log("item", item);
//                    console.log("ra[item]", r[item]);
                    p[item] = r[item];
                }
                nw.firebase.set(p);
                setTimeout(function () {
                    callback();
                }, 1000);
                console.log("%c<<<<FIREBASE_SAVE_OFERTA::: ID: " + id + "!!!!!!!!!!!!!>>>>", 'background: orange; color: #000');
                console.log("p:::data", p);
            };
            rpc.exec("getOffersByTravelsForFirebase", data, func);
        },
        destroyQueryOfertas: function () {
            if (typeof queryGetOffers !== "undefined") {
                queryGetOffers();
            }
        },
        destroyRadar: function () {
            var con = document.querySelector(".stylenoradar");
            if (!con) {
                var css = ".cont-radar{display:none!important;}";
                var cs = document.createElement("style");
                cs.innerHTML = css;
                cs.className = "stylenoradar";
                document.body.appendChild(cs);
            }
        },
        contextMenuServiceFirebase: function contextMenuServiceFirebase(data) {
            var self = this;
            console.log("data", data);
            var typemenu = "bottom"; //normal
            var m = new nw.contextmenu(this, typemenu); //vertical, bottom
            m.addAction("Paradas o pasajeros adicionales", "material-icons streetview normal", function (e) {
                main.editaParadasAdicionales(data);
            });
            m.addAction("Ampliar", "material-icons info normal", function (e) {
                main.ampliar(data, function () {
                    self.iniciar();
                });
            }, function () {
                self.cancelarServicio();
            });
            if (main.configCliente.ver_voucher === "SI") {
                m.addAction("Ver Voucher", "material-icons info normal", function (e) {
                    main.imprimir("VER_VOUCHER", data.id);
                });
            }
            if (main.configCliente.ver_cartel_vuelo === "SI") {
                m.addAction("Ver Cartel de Vuelo", "material-icons info normal", function (e) {
                    main.imprimir("CARTEL_VUELO", data.id);
                });
            }
            if (main.configCliente.pide_fuec === "SI") {
                m.addAction("Ver FUEC", "nwmaker/img/baseline-create-24px.svg", function (e) {
                    main.verFuec(data);
                });
            }
            if (data.tipo_servicio === "reservado") {
                if (self.configCliente.cancela_conductor === "SI") {
                    if (data.estado === "SOLICITUD" || data.estado === "ACEPTADO_RESERVA") {
                        m.addAction("Cancelar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                            self.cancelarServicio();
                        });
                    }
                }
                if (data.estado === "ACEPTADO_RESERVA") {
                    m.addAction("Iniciar servicio", "nwmaker/img/baseline-create-24px.svg", function (e) {
                        self.iniciarViaje();
                    });
                }
            }
        },
        onBackgroundModeNew: function () {
            var self = this;
            console.log("typeof BackgroundGeolocation", typeof BackgroundGeolocation);
            if (typeof BackgroundGeolocation == "undefined") {
                return false;
            }

            var up = nw.userPolicies.getUserData();

            var g = new nw.geolocationBackground();
            g.construct();

            g.optionsDefault = {};
//            g.optionsDefault.url = config.domain_rpc + "/lib_mobile/recibeLocationBackground.php";
//            g.optionsDefault.syncUrl = config.domain_rpc + "/lib_mobile/recibeLocationBackground.php";
            g.optionsDefault.debug = false;
            g.optionsDefault.interval = 5000;
            g.optionsDefault.fastestInterval = 1000;
            g.optionsDefault.activitiesInterval = 10000;
            g.optionsDefault.locationProvider = BackgroundGeolocation.DISTANCE_FILTER_PROVIDER; // BackgroundGeolocation.ACTIVITY_PROVIDER BackgroundGeolocation.DISTANCE_FILTER_PROVIDER
            g.optionsDefault.desiredAccuracy = BackgroundGeolocation.HIGH_ACCURACY; //BackgroundGeolocation.DESIRED_ACCURACY_HIGH BackgroundGeolocation.HIGH_ACCURACY
            g.optionsDefault.stationaryRadius = 0; // 50
            g.optionsDefault.distanceFilter = 0; // 50
            g.optionsDefault.stopOnStillActivity = false;
            g.optionsDefault.notificationsEnabled = true;
            g.optionsDefault.stopOnTerminate = false;
            g.optionsDefault.startOnBoot = true;
            g.optionsDefault.startForeground = true;
            g.optionsDefault.notificationTitle = config.name + " Seguimiento en segundo plano";
            g.optionsDefault.notificationText = config.name + " Seguimiento en segundo plano";

//            var data = {};
//            data.lat = '@latitude';
//            data.lon = '@longitude';
//            data.fecha = nw.utilsDate.getActualFullDate();
//            data.perfil = up.perfil;
//            data.empresa = up.empresa;
//            data.id_usuario = up.id_usuario;
//            data.usuario = up.usuario;
//            if (nw.utils.evalueData(up.placa_activa)) {
//                data.placa = up.placa_activa;
//            }
//            g.optionsDefault.postTemplate = data;

            g.configure();

//            BackgroundGeolocation.headlessTask(function (event) {
            console.log("%cBackgroundGeolocation.headlessTask", 'background: #ff3366; color: #fff');
            console.log("event", event);
//                if (event.name === 'location' ||
//                        event.name === 'stationary') {
//                    var xhr = new XMLHttpRequest();
////                xhr.open('POST', 'http://192.168.81.14:3000/headless');
//                    xhr.open('POST', g.url);
//                    xhr.setRequestHeader('Content-Type', 'application/json');
//                    xhr.send(JSON.stringify(event.params));
//                }
//                return 'Processing event: ' + event.name; // will be logged
//            });
//        BackgroundGeolocation.start();
            g.http_authorization(function () {

            });
            g.abort_requested(function () {

            });
            g.onForeground(function () {

            });
            g.onBackground(function () {

            });
            g.onAuthorization(function () {

            });
            var saveLoc = function (location) {
                console.log("%cBackgroundGeolocation.location", 'background: #ff3366; color: #fff');
                console.log("%cBackgroundGeolocation.location:::location", location);
                console.log("main.selfMapaDriver.serviceActive", main.selfMapaDriver.serviceActive);
                console.log("main.selfMapaDriver.data_service", main.selfMapaDriver.data_service);

                console.log("up", up);

                var data = {};
                data.lat = '@latitude';
                data.lon = '@longitude';
                data.fecha = nw.utilsDate.getActualFullDate();
                data.perfil = up.perfil;
                data.empresa = up.empresa;
                data.id_usuario = up.id_usuario;
                data.usuario = up.usuario;
                if (nw.utils.evalueData(main.selfMapaDriver.data_service) && main.selfMapaDriver.serviceActive != false) {
                    data.serviceActive = main.selfMapaDriver.serviceActive;
//                    data.data_service = main.selfMapaDriver.data_service.id;
                    data.data_service = main.selfMapaDriver.data_service;
                    data.tipo = main.selfMapaDriver.data_service.estado;
                    if (nw.utils.evalueData(main.selfMapaDriver.data_service.placa)) {
                        data.placa = main.selfMapaDriver.data_service.placa;
                    }
                } else if (nw.utils.evalueData(up.placa_activa)) {
                    data.placa = up.placa_activa;
                }
                console.log("data", data);
                console.log("%cBackgroundGeolocation.location", 'background: #ff3366; color: #fff');
//                BackgroundGeolocation.configure({postTemplate: data});
                var rpc = new nw.rpc(nw.getRpcUrl(), "locationBackground");
                rpc.setAsync(true);
                rpc.setLoading(false);
                var funcs = function (r) {
                    console.log("main.selfMapaDriver.responseServer", r);
                };
                rpc.exec("saveLocation", data, funcs);
            };
            g.onLocation(false, saveLoc);

            g.checkStatus(function () {

            });
            g.onStationary(function () {

            });
            g.onStart(function () {

            });
            g.onError(function () {

            });
            g.onStop(function () {

            });
        },
        resolvePreoperacional: function () {
            var hoy = nw.utilsDate.getActualDate();
            var hoyclean = nw.utils.replace("-", "", hoy);
            if (nw.utils.evalueData(main.configCliente.usar_preoperacional_dynamic)) {
                if (main.configCliente.usar_preoperacional_dynamic == "SI") {
                    var da = new f_preoperacional_dynamic();
                    da.construct(false, false, function (rs) {
//                    console.log("rs");
                        window.localStorage.setItem("preoperacional_hoy_" + hoyclean, hoy);
                        nw.changePage("");
                        window.location.reload();

                    }, true);
                    return;
                }
            }
            var da = new f_preoperacional();
            da.construct(false, false, function (rs) {
                window.localStorage.setItem("preoperacional_hoy_" + hoyclean, hoy);
                nw.changePage("");
                window.location.reload();
            }, true);
        },
        configuracionServi: function (callback) {
            var self = this;
            if (nw.utils.evalueData(window.localStorage.getItem("configurationInitAccountMovilmove"))) {
                if (nw.utils.evalueData(window.localStorage.getItem("lastVersionCacheCloud"))) {
                    var r = window.localStorage.getItem("configurationInitAccountMovilmove");
                    r = JSON.parse(r);
                    var cacheStorage = window.localStorage.getItem("version_in_this_device");
                    var versionCache = window.localStorage.getItem("lastVersionCacheCloud");
                    console.log("versionCache", versionCache);
                    console.log("cacheStorage", cacheStorage);
                    console.log("cacheStorage.split(-)[0]", cacheStorage.split("-")[0]);
                    if (cacheStorage.split("-")[0] == versionCache) {
                        console.log("configuracionServi:::responseServer", r);
                        self.configuracionServiContinue(r, callback);
//                        alert("configuracionServi local");
                        console.log("configuracionServi local");
                        config.addTextInAccountOtherData += "<br />Configuration Movilmove from cache. ";
                        return true;
                    }
                }
            }

            config.addTextInAccountOtherData += "<br />Configuration Movilmove from Cloud. ";

            var up = nw.userPolicies.getUserData();
            var data = {};
            data.empresa = up.empresa;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(true);
            console.log("configuracionServi:::dataSendServer", data);
            var funcs = function (r) {
                console.log("configuracionServi:::responseServer", r);
                console.log("configuracionServi cloud");
//                alert("configuracionServi cloud");
                window.localStorage.setItem("configurationInitAccountMovilmove", JSON.stringify(r));
                self.configuracionServiContinue(r, callback);
            };
            rpc.exec("consultaConfiguracion", data, funcs);
        },
        configuracionServiContinue: function (r, callback) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            main.cobro_con = r.cobro_con;
            main.configCliente = r;
            if (nw.utils.evalueData(main.configCliente.paymentStore)) {
                config.paymentStore = main.configCliente.paymentStore;
            }
            if (nw.utils.evalueData(main.configCliente.privateKeyEpayco)) {
                config.privateKeyEpayco = main.configCliente.privateKeyEpayco;
            }
            if (nw.utils.evalueData(main.configCliente.apiKeyEpayco)) {
                config.apiKeyEpayco = main.configCliente.apiKeyEpayco;
            }
            if (nw.utils.evalueData(main.configCliente.keyGoogleNotificacionPush)) {
                config.keyGoogleNotificacionPush = main.configCliente.keyGoogleNotificacionPush;
            }
            if (typeof callback !== "undefined") {
                callback();
            }

            if (nw.evalueData(r.css_app_driver)) {
                var d = document.createElement("style");
                d.className = "css_app_driver";
                d.innerHTML = r.css_app_driver;
                document.body.appendChild(d);
            }
        },
        initHome: function () {
            var self = this;
            var up = nw.userPolicies.getUserData();

//            window.localStorage.getItem("userDriverActive");
            if (nw.utils.evalueData(window.localStorage.getItem("userDriverActive"))) {
                if (window.localStorage.getItem("userDriverActive") == "SI") {
                    continuar();
                    return true;
                }
            }

            self.myEstado(function (e) {
                var imgcar = config.domain_rpc + '/lib_mobile/driver/img/carro-off.png';
                if (nw.evalueData(config.iconCarOffline)) {
                    imgcar = config.iconCarOffline;
                }

                up.estado_activacion = e.estado_activacion;
                if (up.estado_activacion === "2") {
                    if (typeof navigator.splashscreen !== "undefined") {
                        navigator.splashscreen.hide();
                    }
                    $(".containMapAndOpened").remove();

                    var html = "";
                    html += "<div class='div_ofline'><h3>Su estado es Inactivo, por favor espere a ser activado por el administrador de la sucursal</h3><img src='" + imgcar + "'></div>";
                    var ra = document.createElement("div");
                    ra.innerHTML = html;
                    document.body.appendChild(ra);
                    self.intervalDatos = setInterval(function () {
                        self.datosConductor();
                    }, 15000);
                    return false;
                }
                if (up.estado_activacion === "6") {
                    if (typeof navigator.splashscreen !== "undefined") {
                        navigator.splashscreen.hide();
                    }
                    $(".containMapAndOpened").remove();
                    var html = "";
                    html += "<div class='div_ofline'><h3>Su estado es bloqueado, por tardanzas, incumplimiento o rechazo de servicios, por favor comuníquese con el administrador</h3><img src='" + imgcar + "'></div>";
                    var ra = document.createElement("div");
                    ra.innerHTML = html;
                    document.body.appendChild(ra);
                    self.intervalDatos = setInterval(function () {
                        self.datosConductor();
                    }, 15000);
                    return false;
                }
                if (up.estado_activacion === "3" || !nw.evalueData(up.estado_activacion)) {
                    if (typeof navigator.splashscreen !== "undefined") {
                        navigator.splashscreen.hide();
                    }
                    $(".containMapAndOpened").remove();
                    var html = "";
                    html += "<div class='div_ofline'><h3>Su estado es Pre-Registrado, por favor espere a ser activado por el administrador de la sucursal</h3><img src='" + imgcar + "'></div>";
                    var ra = document.createElement("div");
                    ra.innerHTML = html;
                    document.body.appendChild(ra);
                    self.intervalDatos = setInterval(function () {
                        self.datosConductor();
                    }, 15000);
                    return false;
                }
                if (self.configCliente.usa_servicios === "SI") {
                    var tieneServicios = false;
                    if (nw.evalueData(up.servicios_activos) && up.servicios_activos !== "NO") {
                        var servicios = JSON.parse(up.servicios_activos);
                        if (nw.evalueData(servicios)) {
                            if (servicios.length > 0) {
                                tieneServicios = true;
                            }
                        }
                    }
                    if (tieneServicios === false) {
                        if (typeof navigator.splashscreen !== "undefined") {
                            navigator.splashscreen.hide();
                        }
                        $(".containMapAndOpened").remove();
                        var html = "";
                        html += "<div class='div_ofline'><h3>" + nw.tr("No tiene servicios activos, consulte con el administrador del sistema") + "</h3><br /></div>";
                        var ra = document.createElement("div");
                        ra.innerHTML = html;
                        document.body.appendChild(ra);
                        self.intervalServices = setInterval(function () {
                            self.datosServicios();
                        }, 15000);
                        return true;
                    }
                }
                window.localStorage.setItem("userDriverActive", "SI");
                continuar();
            });
            function continuar() {
                if (main.configCliente.pide_preoperacional === "SI") {
                    main.validaPreoperacionalRequerido(function (res) {
                        if (res === true) {
                            main.cargaHome();
                        }
                    });
                    return false;
                }
                main.cargaHome();
            }
        },
        cargaHome: function cargaHome() {
            var self = this;

            nw.remove(".main_loading_initial_without_lib");
            nw.remove(".loading_home_localiz");
            self.permissionsInDevice(continuar);

            function continuar() {

                self.addInProfile();
                if (nw.evalueData(config.fechaLanzamiento)) {
                    nw.utils.conteoRegresivoPorFechaHora(config.fechaLanzamiento, "Para el gran lanzamiento");
                }
                if (typeof navigator.splashscreen !== "undefined") {
                    navigator.splashscreen.hide();
                }
                nw.loading({text: "", title: nw.tr("Ubicando por GPS, por favor espere"), addClass: "loading_home_localiz"});

                var libs = "";
                setTimeout(function () {
                    if (os = "IOS") {
                        if (!nw.evalueData(window.localStorage.getItem("updategpsfirsttime_ios"))) {
                            window.localStorage.setItem("updategpsfirsttime_ios", "SI");
//                        window.location.reload();
                            nw.remove(".main_loading_initial_without_lib");
                            nw.remove(".loading_home_localiz");
                            return;
                        }
                    }
                }, 10000);

                main.position_initial = false;
                var buscaGpstime = 1000;
                var maxintentos = 5;
                var intentos = 0;
                setTimeout(function () {
                    validaIniciaGPS();
                }, 5000);
                if (nw.utils.evalueData(window.localStorage.getItem("userPermissionsSet_ACCESS_FINE_LOCATION"))) {
                    if (window.localStorage.getItem("userPermissionsSet_ACCESS_FINE_LOCATION") == "rejected" || window.localStorage.getItem("userPermissionsSet_ACCESS_FINE_LOCATION") == "skip") {
                        nw.remove(".loading_home_localiz");
                        nw.remove(".loading_home_localiz_2");
                        nw.remove(".main_loading_initial_without_lib");
                    }
                }
                function validaIniciaGPS() {
                    console.log("main.position_initial", main.position_initial);
                    if (nw.utils.evalueData(window.localStorage.getItem("userPermissionsSet_ACCESS_FINE_LOCATION"))) {
                        if (window.localStorage.getItem("userPermissionsSet_ACCESS_FINE_LOCATION") == "rejected" || window.localStorage.getItem("userPermissionsSet_ACCESS_FINE_LOCATION") == "skip") {
                            nw.remove(".loading_home_localiz");
                            nw.remove(".loading_home_localiz_2");
                            nw.remove(".main_loading_initial_without_lib");
                            return;
                        }
                    }
                    if (main.position_initial !== false) {
                        return;
                    }
                    nw.loading({text: "", title: nw.tr("Buscando tu ubicación, por favor espera"), addClass: "loading_home_localiz_2"});
                    setTimeout(function () {
                        if (main.position_initial === false) {
                            console.log("maxintentos", maxintentos);
                            console.log("intentos", intentos);
                            if (intentos > maxintentos) {
                                window.location.reload();
                                return false;
                            }
                            intentos++;
                            nw.remove(".loading_home_localiz_2");
                            nw.remove(".main_loading_initial_without_lib");
                            validaIniciaGPS();
                        } else {
                            nw.remove(".main_loading_initial_without_lib");
                            nw.remove(".loading_home_localiz_2");
                        }
                    }, buscaGpstime);
                    buscaGpstime = 1000;
                }

                nwgeo.getMapLocation(function (position) {
                    console.log("STAR::nwgeo.getMapLocation:::position", position);
                    main.position_initial = position;
                    if (!nwgeo.native) {
                        nwgeo.initialize(function () {
                            console.log("STAR::nwgeo.initialize:::position", position);
                            setTimeout(function () {
                                nw.remove(".loading_home_localiz");
                                nw.remove(".main_loading_initial_without_lib");
                            }, 1000);
                            self.driverMapaServicios();
                        }, true, libs);
                    } else {
                        setTimeout(function () {
                            nw.remove(".loading_home_localiz");
                            nw.remove(".main_loading_initial_without_lib");
                        }, 1000);
                        nwgeo.initialize(function () {
                            console.log("STAR::nwgeo.initialize:::position", position);
                        }, true, libs);
                        self.driverMapaServicios();
                    }
                }, false, true);
            }
        },
        slotRecargas: function slotRecargas() {
            var self = this;
            var da = new f_recargas();
            da.construct();
        },
        reloadApp: function () {
            var version_in_this_device = parseInt(config.version_in_this_device) + 1;
            version_in_this_device = version_in_this_device.toString();
            window.localStorage.setItem("version_in_this_device", version_in_this_device);
            config.version_in_this_device = version_in_this_device;

            nw.changePage("");
            window.location.reload();
        },
        misComentarios: function () {
            var da = new l_comentarios();
            da.construct();
        },
        resumenFinal: function (r) {
            if (main.configCliente.driver_mostrar_califica_viaje === "NO") {
                window.location.reload();
                return false;
            }
            var da = new f_resumen_final();
            da.construct();
            da.populate(r);
        },
        addInProfile: function () {
            var self = this;
            nw.addProfile = function (parent) {
                var con = "." + parent.id;
                var title = "Comentarios";
                var description = nw.tr("Comentarios que me han realizado");
                var type = "center";
                var icon = "material-icons email normal false";
                var addClass = "btn_correo";
                var callback = function () {
//                    self.misTarjetasCredito();
                    self.misComentarios();
                };
                var di = nw.generateLink(title, callback, type, 0, description, icon, "lists_simple", addClass);
                nw.appendLinkMenu(di, con);
            };
        },
        timeEsperaConfirmationUser: function () {
            return 3000;
        },
        timeLlegadaDelConductor: function () {
            return 3000;
        },
        preOperacional: function () {
            var da = new l_preoperacional();
            da.construct();
        },
        misDocumentos: function () {
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id_usuario = up.id_usuario;
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            data.perfil = up.perfil;
            var rpc = new nw.rpc(nw.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            rpc.setLoading(false);
            nw.loading({text: nw.tr("Por favor espere..."), title: nw.tr("Consultando documentos...")})
            var func = function (r) {
                nw.loadingRemove();
                console.log(r);

                var da = new f_documentos_conductor();
                da.construct(r, false);
                da.actualizar = true;
//                da.onAppear(function () {
                da.populate(r);
//                });
                return da;
            };
            rpc.exec("consultaDatosConductor", data, func);
        },
        myEstado: function (callBack) {
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id_usuario = up.id_usuario;
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            data.perfil = up.perfil;
            var rpc = new nw.rpc(nw.getRpcUrl(), "conductores");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                callBack(r);
            };
            rpc.exec("myEstado", data, func);
        },
        misVehiculos: function (createInHomeSend) {
            var d = new l_vehiculos();
            d.construct(createInHomeSend);
            return d;
        },
        driverMapaServicios: function (idService) {
            var self = this;
            if (typeof navigator.splashscreen !== "undefined") {
                navigator.splashscreen.hide();
            }
            if (nw.isOnline()) {
                if (typeof google === "undefined") {
                    setTimeout(function () {
                        self.driverMapaServicios(idService);
                    }, 300);
//                    nw.dialog("La API de mapas no ha cargado totalmente, espere por favor.");
                    return false;
                }
            } else {
                nw.dialog(nw.tr("La API de mapas no cargó debido a que no cuenta con conexión a internet, red deficiente o nula."));
            }
            if (nw.evalueData(self.selfCrearViaje) && nw.evalueData(idService)) {
                if (typeof navigator.splashscreen !== "undefined") {
                    navigator.splashscreen.hide();
                }
                self.selfCrearViaje.validaServiceActive();
                return true;
            }

            main.driver = new f_driver_mapa_servicios();
            main.driver.construct();

//            if (main.configCliente.usa_firebase == "SI") {
            self.loadInitFirebase();
//            }

        },
        cerrarNotificacion: function () {
            main.driver.cerrarNotificionMain();
            nw.dialog("El usuario a cancelado el servicio");
        },
        serviceDriveCancelInterval: function () {
            clearTimeout(main.interval);
            main.interval = setTimeout(function () {
                main.serviceDriveCancelExec();
            }, 5000);
        },
        serviceDriveCancelExec: function () {
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id_usuario = up.id_usuario;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                if (r === false) {
                    return false;
                }
                if (r.estado === "CANCELADO_POR_USUARIO") {
                    nw.cleanAllWindow();
                    nw.home();
                    nw.dialog("El cliente canceló el servicio");
                    return false;
                }
                main.serviceDriveCancelInterval();
            };
            rpc.exec("servicioActivoConductor", data, func);
        },
        validaPreoperacionalRequerido: function (callback) {
            var self = this;
            var hoy = nw.utilsDate.getActualDate();
            var hoyclean = nw.utils.replace("-", "", hoy);
            var prehoy = window.localStorage.getItem("preoperacional_hoy_" + hoyclean);
//            console.log("hoy", hoy);
//            console.log("prehoy", prehoy);
//            console.log("hoyclean", hoyclean);
            if (nw.evalueData(prehoy)) {
                if (prehoy == hoy) {
                    callback(true);
                    return true;
                }
            }
            var up = nw.userPolicies.getUserData();

            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            var meth = "preoperacional_hoy";
            if (self.configCliente.usar_preoperacional_dynamic == "SI") {
                meth = "preoperacional_hoy_nuevo";
            }
            var func = function (r) {
                console.log("r", r);
                if (r === true) {
                    callback(true);
                    window.localStorage.setItem("preoperacional_hoy_" + hoyclean, hoy);
                    return true;
                }
                nw.utils.menuResetInitial();
                nw.dialog("Debe registrar el formato preoperacional");
                main.removeLoadingInitial();
                self.resolvePreoperacional();
            };
            rpc.exec(meth, data, func);
        },
        removeLoadingInitial: function () {
            nw.remove(".main_loading_initial_without_lib");
        },
        datosConductor: function () {
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            var func = function (r) {
                if (r === false) {
//                    window.location.reload();
                    return false;
                }
                clearInterval(main.intervalDatos);
                nw.setUserInfo(r, function () {
                    window.location.reload();
                });
            };
            rpc.exec("datosConductor", data, func);
        },
        datosServicios: function () {
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("datosServicios", r);
                if (r === false) {
                    return false;
                }
                clearInterval(main.intervalServices);
                nw.setUserInfo(r, function () {
                    window.location.reload();
                });
            };
            rpc.exec("datosServicios", data, func);
        },
        statusDriver: function () {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            var func = function (r) {
                if (r === false) {
                    nw.dialog("Su usuario no se encuentra activo para iniciar servicios de socio conductor.");
                    return false;
                }
                self.conductorStatus = true;
            };
            rpc.exec("conductorActivo", data, func);
        },
        conductorStatus: false,
        openHistoricoViajes: function () {
            var d = new l_historico_viajes();
            d.construct();
            return d;
        },
        datosVehiculos: function datosVehiculos(callBack) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.id_usuario = up.id_usuario;
            console.log("datosVehiculos:::up", up);
            console.log("datosVehiculos:::dataSendServer", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("datosVehiculos:::responseServer", r);

                window.localStorage.setItem("datosVehiculos", JSON.stringify(r));

                self.vehiculo = r;
                callBack(r);
            };
            rpc.exec("datosVehiculos", data, func);
        },
        readMessage: function readMessage(data) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            var func = function (r) {
            };
            rpc.exec("readMessage", data, func);
        },
        initDataBaseLocal: function () {
            var self = this;
            var sucess = function (data) {
                main.db = data.db;
                main.consultaServicio();
                nw.loadingRemove();
            };
            var error = function (event, code) {
                console.log("error", event, code);
            };
            var finisCreateDb = function (data) {
                var db = data.db;
                var array = {};
                array.db = db;
                array.name = "show_services";
                array.key = "id";
                array.fields = [
                    {
                        name: "id",
                        unique: false
                    }
                ];
                nw.bd_offline.createTable(array);
            };
            nw.bd_offline.create_or_read_database("prueba7", 1, finisCreateDb, sucess, error);
        },
        guardaServicio: function (id) {
            var self = this;
            var array = {};
            var data = {};
            var up = nw.userPolicies.getUserData();
            array.db = main.db;
            array.table = "show_services";
            data.id = id;
            array.fields = data;
            array.callback = function (r) {
                console.log("insert", r);
//                callback(r);
            };
            nw.bd_offline.insert(array);
        },
        consultaArrayServicio: function (id, callback) {
            var self = this;
            var r = self.show_services;
            if (r.indexOf(id) === -1) {
                r = false;
            } else {
                var leng = r.indexOf(id);
                console.log(leng);
                r = r[leng];
            }
            callback(r);
        },
        consultaServicio: function () {
            var self = this;
            var array = {};
            array.db = main.db;
            array.table = "show_services";
            array.callback = function (r) {
                console.log("consultaServicioActivo::responseServer", r);
                if (r.length > 0) {
                    for (var i = 0; i < r.length; i++) {
                        var row = r[i];
                        self.show_services.push(row.id);
                    }
                }
            };
            nw.bd_offline.select(array);
        },
        deleteRecord: function deleteRecord(id) {
            var array = {};
            array.db = main.db;
            array.table = "show_services";
            array.id = id;
            array.callback = function (r) {
                console.log("deleteRecord:::update", r);
//                callback(r);
            };
            nw.bd_offline.deleteRecord(array);
        },
        initBloqueoApp: function initBloqueoApp() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            if (up.estado_activacion != "6") {
                if (nw.evalueData(self.configCliente.bloqueo_incumplimiento)) {
                    if (parseInt(self.configCliente.bloqueo_incumplimiento) > 0) {
                        var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                        rpc.setAsync(true);
                        rpc.setLoading(false);
                        var func = function (r) {
                            console.log("servicios", r);
//                            console.log(self.configCliente);
                            var incumplimiento = r.length;
                            if (self.configCliente.bloqueo_incumplimiento <= incumplimiento) {
                                data.motivo_bloqueo = "INCUMPLIMIENTO SERVICIOS";
                                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                                rpc.setAsync(true);
                                rpc.setLoading(false);
                                var funcs = function (r) {
                                    self.reloadApp();
                                    clearInterval(self.intervalBloqueo);
                                };
                                rpc.exec("actualizaEstadoConductor", data, funcs);
                            }
                        };
                        rpc.exec("consultaIncumplimiento", data, func);
                        if (typeof self.intervalBloqueo === "undefined") {
                            self.intervalBloqueo = setInterval(function () {
                                self.initBloqueoApp();
                            }, 300000);
                        }
                    }
                }
                if (nw.evalueData(self.configCliente.bloqueo_tardanzas)) {
                    if (parseInt(self.configCliente.bloqueo_tardanzas) > 0) {
                        if (parseInt(self.configCliente.minutos_adicionar_tardanzas) > 0) {
                            data.minutos_adicionar_tardanzas = self.configCliente.minutos_adicionar_tardanzas;
                        }
                        var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                        rpc.setAsync(true);
                        rpc.setLoading(false);
                        var func = function (r) {
                            console.log("servicios tardanzas", r);
                            var tardanzas = r.length;
                            if (self.configCliente.bloqueo_tardanzas <= tardanzas) {
                                data.motivo_bloqueo = "TARDANZAS SERVICIOS";
                                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                                rpc.setAsync(true);
                                rpc.setLoading(false);
                                var funcs = function (r) {
                                    self.reloadApp();
                                    clearInterval(self.intervalBloqueo);
                                };
                                rpc.exec("actualizaEstadoConductor", data, funcs);
                            }
                        };
                        rpc.exec("consultaTardanzas", data, func);
                        if (typeof self.intervalBloqueo === "undefined") {
                            self.intervalBloqueo = setInterval(function () {
                                self.initBloqueoApp();
                            }, 300000);
                        }

                    }
                }
                if (nw.evalueData(self.configCliente.bloqueo_no_aceptacion_servicios)) {
                    if (parseInt(self.configCliente.bloqueo_no_aceptacion_servicios) > 0) {
                        var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                        rpc.setAsync(true);
                        rpc.setLoading(false);
                        var func = function (r) {
                            console.log("servicios no aceptado", r);
//                            console.log(self.configCliente);
                            if (r == 0) {
                                return false;
                            }

                            var rechazos = r.numero_rechazados;
//                            console.log(rechazos);
//                            console.log(self.configCliente.bloqueo_no_aceptacion_servicios);
                            if (self.configCliente.bloqueo_no_aceptacion_servicios <= rechazos) {
                                data.motivo_bloqueo = "NO ACEPTACIÓN SERVICIOS";
                                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                                rpc.setAsync(true);
                                rpc.setLoading(false);
                                var funcs = function (r) {
//                                    console.log("incumplido no atendido");
//                                    console.log("bloqueado")
                                    self.reloadApp();
                                    clearInterval(self.intervalBloqueo);
                                };
                                rpc.exec("actualizaEstadoConductor", data, funcs);
                            }
                        };
                        rpc.exec("consultaRechazados", data, func);
                        if (typeof self.intervalBloqueo === "undefined") {
                            self.intervalBloqueo = setInterval(function () {
                                self.initBloqueoApp();
                            }, 300000);
                        }

                    }
                }
            }
        },
        labels: function labels(fields) {
            if (!nw.evalueData(config.labels)) {
                return fields;
            }
            var lab = config.labels;
            for (var i = 0; i < fields.length; i++) {
                for (var j = 0; j < lab.length; j++) {
                    if (lab[j].name == fields[i].name) {
                        if (nw.evalueData(lab[j].label)) {
                            fields[i].label = lab[j].label;
                            fields[i].placeholder = lab[j].label;
                        }
                        if (typeof lab[j].placeholder !== 'undefined') {
                            fields[i].placeholder = lab[j].placeholder;
                        }
                        if (typeof lab[j].required !== 'undefined') {
                            fields[i].required = lab[j].required;
                        }
                        if (typeof lab[j].car_min !== 'undefined') {
                            fields[i].car_min = lab[j].car_min;
                        }
                        if (typeof lab[j].car_max !== 'undefined') {
                            fields[i].car_max = lab[j].car_max;
                        }
                        if (typeof lab[j].visible !== 'undefined') {
                            fields[i].visible = lab[j].visible;
                        }
                    }

                }
            }
            return fields;
        },
        tipoDoc: function tipoDoc() {
            var data = {};
            data[""] = "Seleccione";
            data["CC"] = "Cédula de ciudadanía";
            data["CE"] = "Cédula de extranjería";
            data["NI"] = "Nit";
            data["PP"] = "Pasaporte";
            if (!nw.evalueData(config.tipo_doc)) {
                return data;
            }
            return config.tipo_doc;
        },
        llamarCelular: function llamarCelular(numero) {
            var indicativo = "57";
            if (nw.evalueData(config.indicativo)) {
                indicativo = config.indicativo;
            }
            window.open("tel:+" + indicativo + "" + numero, '_BLANK');
        },
        actualizarApp: function actualizarApp() {
            var version_in_this_device = parseInt(config.version_in_this_device) + 1;
            version_in_this_device = version_in_this_device.toString();
            window.localStorage.setItem("version_in_this_device", version_in_this_device);
            config.version_in_this_device = version_in_this_device;

            nw.loading({"text": "Actualizando... Por favor espere."});
            setTimeout(function () {
                window.location.reload();
            }, 3000);
        },
        verFuec: function verFuec(data) {
            var datas = {};
            datas.id = data.vehiculo;
            console.log("verFuec:::dataSend", datas);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log("verFuec:::responseServer", r);
                if (r.vehiculo_publico_particular == "publico_taxi") {
                    nw.dialog("Este vehículo tipo taxi no maneja FUEC");
                    return false;
                }
                var url = config.domain_rpc + "/app/fuec_2021.php?service=" + data.id;
//            var params = {};
//            params.html = url;
//            params.id = "iframeFuecForm";
//            params.showBack = true;
//            params.closeBack = false;
//            nw.createDialog(params);
                nw.utils.openIframe(url);

//                var url = config.domain_rpc + "/app/fuec_2021.php?service=" + data.id;
//                var html = "<button class='sharefuec'>Compartir</button><input value='" + url + "'/>";
//                html += "<iframe class='iframeFuec' src='" + url + "'></iframe>";
//                var params = {};
//                params.html = html;
//                params.id = "iframeFuecForm";
//                params.showBack = true;
//                params.closeBack = false;
//                nw.createDialog(params);
//                document.querySelector(".sharefuec").addEventListener("click", function () {
//                    var title = "Compartir FUEC";
//                    var body = "FUEC " + url;
//                    nw.shareSocial(body, title);
//                });
            };
            rpc.exec("validaFuecPorTipo", datas, func);
        },
        imprimir: function imprimir(ruta_php, id, data = null) {
            if (ruta_php == "VER_INFORME_CONDUCTOR") {
                var url = config.domain_rpc + "/app/plantilla_impresiones.php?id_service=" + id + "&tipo=" + ruta_php + "&fecha_inicio=" + data.fecha_inicial + "&fecha_final=" + data.fecha_final;
            } else {
                var url = config.domain_rpc + "/app/plantilla_impresiones.php?id_service=" + id + "&tipo=" + ruta_php;
            }
//            var params = {};
//            params.html = url;
//            params.id = "iframeFuecForm";
//            params.showBack = true;
//            params.closeBack = false;
//            nw.createDialog(params);
            nw.utils.openIframe(url);
        },
        ampliar: function ampliar(data, callback_iniciar, callback_cancelarsevicio) {
//            var self = this;
//            var data = self.selectedRecord();
//            var d = new f_ver_viaje();
            var d = new f_ver_viaje_mapstatic();
            d.setTitle = "<span style='color:#fff;'>Viaje</span>";
            d.construct(data);
            if (data.estado !== "SOLICITUD" && data.estado !== "LLEGADA_DESTINO") {
                d.buttons.push(
                        {
                            style: "",
                            icon: "",
                            colorBtnBackIOS: "#ffffff",
                            position: "top",
                            name: "problema",
                            label: "Reportar problema",
                            callback: function () {
                                var d = new f_novedades();
                                d.construct();
                                d.populate(data);
                            }
                        }
//                        ,
//                        (function () {
//                            if (main.configCliente.app_para == "CARGA" || nw.evalueData(main.configCliente.permitir_tomar_servicios_ocupado) && main.configCliente.permitir_tomar_servicios_ocupado == "SI") {
//                                var datas = {
//                                    style: "",
//                                    icon: "",
//                                    colorBtnBackIOS: "#ffffff",
//                                    position: "top",
//                                    name: "ir_al_viaje",
//                                    label: "Ir al viaje",
//                                    callback: function () {
//                                        self.event.detail = data;
//                                        document.dispatchEvent(self.event);
//                                        nw.home();
//                                    }
//                                }
//                                return datas;
//                            } else {
//                                return false;
//                            }
//                        })()
                );
            }
            if (nw.evalueData(callback_cancelarsevicio)) {
                if (data.estado === "EN_RUTA" || data.estado === "ACEPTADO_RESERVA") {
                    d.buttons.push(
                            {
                                style: "",
                                icon: "",
                                colorBtnBackIOS: "#ffffff",
                                position: "top",
                                name: "cancelar",
                                label: "Cancelar",
                                callback: function () {
                                    callback_cancelarsevicio();
                                }
                            }
                    );
                }
            }
            if (!main.selfMapaDriver.serviceActive && nw.evalueData(callback_iniciar)) {
                if (data.estado === "ACEPTADO_RESERVA") {
                    d.buttons.push(
                            {
                                style: "",
                                icon: "",
                                colorBtnBackIOS: "#ffffff",
                                position: "top",
                                name: "start",
                                label: "Iniciar viaje",
                                callback: function () {
                                    callback_iniciar();
                                }
                            }
                    );
                }
            }
            d.show();
            console.log(data);

            var html = "";
            html += "<div class='separatorLine'></div>";
            html += "<p><strong>" + nw.tr("Estado:") + "</strong> " + nw.tr(data.estado) + "</p>";
            if (nw.evalueData(data.fecha_hora)) {
                html += "<p><strong>" + nw.tr("Fecha:") + "</strong> " + data.fecha_hora + "</p>";
            }
            if (nw.evalueData(data.valor_total_servicio)) {
                if (main.configCliente.mostrar_valor_conductor === "SI") {
                    html += "<p><strong>" + nw.tr("Valor estimado:") + "</strong> $" + nw.addNumber(data.valor) + "</p>";
                    if (nw.evalueData(data.valor_total_servicio)) {
                        html += "<p><strong>" + nw.tr("Valor final:") + "</strong> $" + nw.addNumber(data.valor_total_servicio) + "</p>";
                    }
                }
            }
            if (nw.evalueData(data.subcategoria_servicio_text)) {
                html += "<p><strong>" + nw.tr("Tipo servicio:") + " </strong>" + data.subcategoria_servicio_text + "</p>";
            }
            html += "<p><strong>" + nw.tr("De:") + " </strong> " + data.ciudad_origen + " " + data.origen + "</p>";
            html += "<p><strong>" + nw.tr("Hasta:") + " </strong> " + data.ciudad_destino + " " + data.destino + "</p>";

            if (nw.evalueData(data.cliente_nombre)) {
                html += "<p><strong>" + nw.tr("Cliente:") + " </strong> <br />" + data.cliente_nombre;
                if (main.configCliente.telefono_pasajero_visible_para_conductor !== "NO") {
                    if (nw.evalueData(data.celular)) {
                        html += ", " + nw.tr("Celular:") + " <a href='tel:+57 " + data.celular + "'>" + data.celular + "</a></p>";
                    }
                }
            }

            if (nw.evalueData(data.total_metros)) {
                html += "<p><strong>" + nw.tr("Distancia (metros):") + " </strong>" + data.total_metros + "</p>";
            }
            if (nw.evalueData(data.hora_inicio)) {
                html += "<p><strong>" + nw.tr("Inicio:") + " </strong>" + data.hora_inicio + "</p>";
            }
            if (nw.evalueData(data.hora_fin_servicio)) {
                html += "<p><strong>" + nw.tr("Llegada:") + " </strong>" + data.hora_fin_servicio + "</p>";
            }
            if (main.configCliente.mostrar_valor_conductor === "SI") {
                html += "<p><strong>" + nw.tr("Descuento aplicado:") + " </strong>$" + nw.addNumber(data.descuento_aplicado) + "</p>";
            }
            if (nw.evalueData(data.datos_vehiculo_elegido)) {
                html += "<p><strong>" + nw.tr("Datos vehículo elegido:") + " </strong>" + data.datos_vehiculo_elegido + "</p>";
            }
            html += "<p><strong>ID: </strong>" + data.id + "</p>";
            if (main.configCliente.app_para == "CARGA") {
                if (nw.evalueData(data.numero_auxiliares)) {
                    html += "<p><strong>" + nw.tr("Numero Auxiliares:") + " </strong>" + data.numero_auxiliares + "</p>";
                }
                if (nw.evalueData(data.salida_periferia)) {
                    html += "<p><strong>" + nw.tr("Salida periferia:") + " </strong>" + data.salida_periferia + "</p>";
                }
                if (nw.evalueData(data.despacho)) {
                    html += "<p><strong>" + nw.tr("Despacho:") + " </strong>" + data.despacho + "</p>";
                }
                if (nw.evalueData(data.retorno)) {
                    html += "<p><strong>" + nw.tr("Retorno:") + " </strong>" + data.retorno + "</p>";
                }
                if (nw.evalueData(data.cargue)) {
                    html += "<p><strong>" + nw.tr("Cargue:") + " </strong>" + data.cargue + "</p>";
                }
                if (nw.evalueData(data.descargue)) {
                    html += "<p><strong>" + nw.tr("Descargue:") + " </strong>" + data.descargue + "</p>";
                }
                if (nw.evalueData(data.observaciones_servicio)) {
                    html += "<p><strong>" + nw.tr("Observaciones servicio:") + " </strong>" + data.observaciones_servicio + "</p>";
                }
                if (nw.evalueData(data.contacto_recogida)) {
                    html += "<p><strong>" + nw.tr("Contacto recogida:") + " </strong>" + data.contacto_recogida + "</p>";
                }
                if (nw.evalueData(data.telefono_recogida)) {
                    html += "<p><strong>" + nw.tr("Telefono recogida:") + " </strong>" + data.telefono_recogida + "</p>";
                }
                if (nw.evalueData(data.observaciones_recogida)) {
                    html += "<p><strong>" + nw.tr("Observaciones recogida:") + " </strong>" + data.observaciones_recogida + "</p>";
                }
                if (nw.evalueData(data.contacto_entrega)) {
                    html += "<p><strong>" + nw.tr("Contacto entrega:") + " </strong>" + data.contacto_entrega + "</p>";
                }
                if (nw.evalueData(data.telefono_entrega)) {
                    html += "<p><strong>" + nw.tr("Telefono entrega:") + " </strong>" + data.telefono_entrega + "</p>";
                }
                if (nw.evalueData(data.observaciones_entrega)) {
                    html += "<p><strong>" + nw.tr("Observaciones entrega:") + " </strong>" + data.observaciones_entrega + "</p>";
                }
                if (nw.evalueData(data.cantidad)) {
                    html += "<p><strong>" + nw.tr("cantidad:") + " </strong>" + data.cantidad + "</p>";
                }
                if (nw.evalueData(data.volumen)) {
                    html += "<p><strong>" + nw.tr("Volumen:") + " </strong>" + data.volumen + "</p>";
                }
                if (nw.evalueData(data.peso)) {
                    html += "<p><strong>" + nw.tr("Peso:") + " </strong>" + data.peso + "</p>";
                }
                if (nw.evalueData(data.empaque)) {
                    html += "<p><strong>" + nw.tr("Empaque:") + " </strong>" + data.empaque + "</p>";
                }
                if (nw.evalueData(data.valor_declarado)) {
                    html += "<p><strong>" + nw.tr("Valor declarado:") + " </strong>" + data.valor_declarado + "</p>";
                }
            }
            if (nw.evalueData(data.observacion_ultima_ubicacion)) {
                html += "<p><strong>" + nw.tr("Observación ubicación:") + " </strong>" + data.observacion_ultima_ubicacion + "</p>";
            }
            if (nw.evalueData(data.firma_recibido)) {
                html += "<p style='margin-top: 38px;margin-bottom: 48px;'><strong>" + nw.tr("Firma recibido:") + " </strong><span \n\
                    style='background-image: url(" + config.domain_rpc + data.firma_recibido + ");padding: 27px 42px;background-size: contain;left: 11px;position: relative;' \n\
                    class='fotoFirma'></span></p>";
            }
            if (nw.evalueData(data.calificacion_conductor)) {
                var glob = 5;
                var Total = parseInt(data.calificacion_conductor);
                var ht = "<p><strong style='top: -8px;position: relative;'>" + nw.tr("Calificación:") + " </strong>";
                for (var ca = 0; ca < glob; ca++) {
                    if (Total > ca) {
                        ht += "<i class='ico_1 material-icons' style='color: #e04935;'>star</i>";
                    } else {
                        ht += "<i class='ico_1 material-icons'>star_border</i>";
                    }
                }
                ht += "</p>";
                html += ht;
            }
            html += "<div class='nav_paradas'></div>";
            html += "<div class='nav_adicion'></div>";
            html += "<div class='otros_adjuntos'></div>";
            d.ui.observaciones_html.setValue(html);

            d.direccion_origen = data.origen;
            d.direccion_destino = data.destino;
            d.latitude = data.latitudOri;
            d.longitude = data.longitudOri;
            d.latitudDes = data.latitudDes;
            d.longitudDes = data.longitudDes;
            d.createMapa(d);


            createNavTableTarAdic(data);

            createNavTableParadas(data);
            createNavTableAdjuntos(data);

            function createNavTableTarAdic(datos) {
//                var canvas = "#f_ver_viaje #observaciones_html .nav_adicion";
                var canvas = d.canvas + " #observaciones_html .nav_adicion";
//                var div = document.querySelector("#f_ver_viaje #observaciones_html .nav_adicion");
                var div = document.querySelector(d.canvas + " #observaciones_html .nav_adicion");
                var ele = document.createElement('div');
                ele.style = "font-size: 16px;text-align: center;font-weight: bold;text-decoration: underline;";
                ele.innerHTML = nw.tr("Descripción de adicionales");
                div.appendChild(ele);
                var nav = new l_navtable_tareas_adicionales();
                nav.construct(canvas, datos);
                d.navTable = nav;
            }

            function createNavTableParadas(datos) {
//                var canvas = "#f_ver_viaje #observaciones_html .nav_paradas";
                var canvas = d.canvas + " #observaciones_html .nav_paradas";
//                var div = document.querySelector("#f_ver_viaje #observaciones_html .nav_paradas");
                var div = document.querySelector(d.canvas + " #observaciones_html .nav_paradas");
                var ele = document.createElement('div');
                ele.style = "font-size: 16px;text-align: center;font-weight: bold;text-decoration: underline;";
                ele.innerHTML = nw.tr("Paradas adicionales");
                div.appendChild(ele);
                var nav = new l_navtable_paradas();
                nav.construct(canvas, datos);
                d.navTable = nav;
            }

            function createNavTableAdjuntos(datos) {
//                var canvas = "#f_ver_viaje #observaciones_html .nav_paradas";
                var canvas = d.canvas + " #observaciones_html .otros_adjuntos";
//                var div = document.querySelector("#f_ver_viaje #observaciones_html .nav_paradas");
                var div = document.querySelector(d.canvas + " #observaciones_html .otros_adjuntos");
                var ele = document.createElement('div');
                ele.style = "font-size: 16px;text-align: center;font-weight: bold;text-decoration: underline;";
                ele.innerHTML = '';
                div.appendChild(ele);
                var nav = new l_navtable_agregar_imagenes();
                nav.construct(canvas, datos, "ADJUNTOS_VIAJE");
                d.navTable = nav;
            }
        },
        editaParadasAdicionales: function editaParadasAdicionales(data, estado) {
            var paradasAdd = new nw.forms();
            var up = nw.userPolicies.getUserData();
            paradasAdd.id = "f_padas_add";
            paradasAdd.setTitle = "Paradas / Pasajeros";
            paradasAdd.showBackCallBack = function () {
                nw.back();
            };
            paradasAdd.createBase();
            var fields = [
                {
                    label: "",
                    name: "paradas_group",
                    type: "startGroup",
                    visible: true
                },
                {
                    type: "endGroup"
                }
            ];
            paradasAdd.setFields(fields);
            paradasAdd.buttons = [];
            if (main.configCliente.agrega_paradas_pasajero == "SI") {
                if (estado !== "PASADOS") {
                    paradasAdd.buttons.push({
                        style: "border: 0;background-color:#1abbd7;color:#fff;margin:0px;",
                        icon: "material-icons check_circle normal",
                        colorBtnBackIOS: "#fff",
                        position: "top",
                        name: "aceptar_detalle_servicio",
                        label: "Nuevo",
                        callback: function () {
                            paradasAdd.guardar_paradas = true;
                            var d = new f_crear_parada();
                            d.construct(paradasAdd);
                        }
                    });
                }
            }

            paradasAdd.show();
            paradasAdd.saveParada = function saveParada(pr, callback) {
                console.log(pr);
                var datos = pr;
                datos.empresa = up.empresa;
                datos.perfil = up.perfil;
                datos.usuario = up.usuario;
                datos.id_servicio_edit = data.id;
                console.log(datos);
//                        return;
                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                rpc.setLoading(false);
                var func = function (ra) {
                    paradasAdd.navTable.applyFilters(data.id);
                    nw.dialog("Parada creada correctamente.");
                    if (typeof callback != "undefined") {
                        callback();
                    }
                };
                rpc.exec("saveParada", datos, func);
            };
            paradasAdd.createNavTableParadas = function createNavTableParadas() {
                var canvas = "#f_padas_add .paradas_group";
                var nav = new l_navtable_paradas();
                nav.construct(canvas, data);
                paradasAdd.navTable = nav;
            };
            paradasAdd.createNavTableParadas();
        },
        ofertaNotificaRecibe: function (estado) {
            console.log("estado", estado);
        },
        newServiceRutaCliente: function () {
//            nw.dialog("Tienes un nuevo servicio, revisa tu historial.");
        },
        nueva_recarga: function () {
            nw.dialog("Tienes una nueva recarga.", function () {
                window.location.reload();
            });
        },
        newNotificationChat: function (title, name, body) {
            var msg = nw.utils.tr(title) + " " + name + ": " + body;
//            nw.dialog(msg);
            nw.utils.toast({html: msg, timeRemove: 5000, addClass: "toast-enviado"});
        },
        templateMailEnd: function templateMailEnd() {
            var d = {
                asunto_viaje_finalizado: nw.utils.tr("Tu viaje ha finalizado"),
                tipo_pago: nw.utils.tr("Tipo pago:"),
                origen: nw.utils.tr("Origen:"),
                destino: nw.utils.tr("Destino:"),
                fecha: nw.utils.tr("Fecha:"),
                gracias: nw.utils.tr("gracias por preferirnos"),
                esperamos_viaje: nw.utils.tr("Esperamos que hayas disfrutado tu viaje")
            };
            return d;
        }
    }
});

//window.addEventListener('message', function (e) {
//    var r = e.data;
//    console.log("window.addEventListener", r);
//    if (r.tipo == "saveMessageChat") {
//        var data = false;
//        if (typeof main.listDriverMap.data_service !== "undefined") {
//            console.log("main.listDriverMap.data_service", main.listDriverMap.data_service);
//            if (nw.evalueData(main.listDriverMap.data_service)) {
//                data = main.listDriverMap.data_service;
//            }
//        }
//        if (typeof main.dataServiceOpenHistory !== "undefined") {
//            console.log("main.dataServiceOpenHistory", main.dataServiceOpenHistory);
//            if (nw.evalueData(main.dataServiceOpenHistory)) {
//                data = main.dataServiceOpenHistory;
//            }
//        }
//        var token = false;
//        if (nw.evalueData(data.token_usuario)) {
//            token = data.token_usuario;
//        }
//        console.log("dataChat::::", data);
//        if (nw.evalueData(data) && nw.evalueData(token)) {
//            var up = nw.userPolicies.getUserData();
//            var message = false;
//            if (typeof r.text !== "undefined") {
//                message = r.text;
//            }
//            if (typeof r.message !== "undefined") {
//                message = r.message;
//            }
//            if (!message) {
//                return false;
//            }
//            var room = e.data.room;
//            if (room) {
//                nw.sendNotificacion({
//                    title: "Nuevo mensaje de " + up.nombre,
//                    body: up.nombre + " " + message,
//                    icon: "fcm_push_icon",
//                    sound: "default",
//                    data: "nw.dialog('Nuevo mensaje en el chat " + message + "')",
//                    callback: "FCM_PLUGIN_ACTIVITY",
//                    to: token
//                });
//                console.log("OK send notify push to " + token);
//            }
//        }
//    }
//});