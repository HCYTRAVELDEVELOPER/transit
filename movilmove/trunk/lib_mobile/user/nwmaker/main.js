nw.Class.define("main", {
    extend: nw.menu,
    construct: function () {
        var self = this;
        self.androidMinVersionPermissions = 13;

        if (typeof newRouteRelease != "undefined") {
            self.carpet_files_extern = newRouteRelease + "/user/";
        } else {
            self.carpet_files_extern = "/lib_mobile/user/";
        }

//        var paymentForm = document.createElement('form');
//        paymentForm.id = 'payment-form';
//
//        var cardElementContainer = document.createElement('div');
//        cardElementContainer.id = 'card-element';
//
//        var cardErrorsContainer = document.createElement('div');
//        cardErrorsContainer.id = 'card-errors';
//        cardErrorsContainer.setAttribute('role', 'alert');
//
//        var submitButton = document.createElement('button');
//        submitButton.type = 'submit';
//        submitButton.textContent = 'Pagar';
//
//        paymentForm.appendChild(cardElementContainer);
//        paymentForm.appendChild(cardErrorsContainer);
//        paymentForm.appendChild(submitButton);
//
//        document.body.appendChild(paymentForm);
//
//        var stripe = Stripe('pk_test_51OboQsCTT79Q0XWPlBWrfIXafIgl3nrfMeLnpEY640jiECkT53Vxx7J6HuYjDgCn0l4NgMX2QDkUEx8kOFRlu4H000Ag0sqmW5');
//        console.log("STIPE", stripe);
//
//        var elements = stripe.elements();
//
//        var card = elements.create('card');
//        card.mount('#card-element');
//
//        var form = document.getElementById('payment-form');
//        form.addEventListener('submit', function (event) {
//            event.preventDefault();
//
//            stripe.createToken(card).then(function (result) {
//                    console.log("RESULLL:: ", result)
//                if (result.error) {
//                    var errorElement = document.getElementById('card-errors');
//                    errorElement.textContent = result.error.message;
//                } else {
//                    console.log(result)
////                    stripeTokenHandler(result.token);
//                }
//            });
//        });
//        nw.loading({text: "", title: config.logotipoHeader, addClass: "loading_home_localiz"});

//        console.log("test", window.localStorage.getItem("html_lib"));
//        if (window.localStorage.getItem("html_lib") != null) {
//            var code = window.localStorage.getItem("html_lib");
//            console.log("code", code);
//            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
//                console.log('file system open: ' + dirEntry.name);
//                var isAppend = true;
//                var mode = "create";
//                createOrLoadFile(dirEntry, "fileToAppend.js", code, isAppend, mode);
//            }, fail);
//        }
//        console.log("test", window.localStorage.getItem("css_lib"));
//        if (window.localStorage.getItem("css_lib") != null) {
//            var code = window.localStorage.getItem("css_lib");
//            console.log("code", code);
//            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
//                console.log('file system open: ' + dirEntry.name);
//                var isAppend = true;
//                var mode = "create";
//                createOrLoadFile(dirEntry, "css_lib.css", code, isAppend, mode);
//            }, fail);
//        }
//        var theUrl = "https://192.168.1.45/lib_mobile/user/nwmaker/test.html";
//        var iframe = document.createElement("iframe");
//        iframe.src = theUrl;
//        iframe.id = "myiframe";
//        iframe.allow = "geolocation; microphone; camera";
//        iframe.onload = function () {
//            console.log("this", this)
//        };
//        document.body.appendChild(iframe);



        config.addTextInAccountOtherData = "";
        config.addButtonsInAccountOtherData = [];
        main.sumAddbtns = -1;

        if (typeof device != "undefined") {
            if (typeof device.version != "undefined") {
                config.addTextInAccountOtherData += "<br />Versión OS: " + device.version;
            }
        }

        self.debugConstruct = config.debugConstruct;
        var up = nw.userPolicies.getUserData();
        var os = nw.utils.getMobileOperatingSystem();
        var online = nw.isOnline();
        if (!online) {
            nw.dialog("Por favor verifique su conexión a internet");
        }

        if (os === "IOS") {
            nw.requireCss(config.domain_rpc + self.carpet_files_extern + "css/iphone.css?v=" + config.version + config.version_in_this_device, "body", false, function () {

            });
        }

        main.configCliente = {};

        self.colorPolyLine = "#dc471e";
        if (nw.evalueData(config.colorPolyLine)) {
            self.colorPolyLine = config.colorPolyLine;
        }

        self.previsualiza = false;
        self.get = nw.getGET();
        if (self.get) {
            if (typeof self.get.service !== "undefined") {
                nwgeo.initialize(function () {
                    self.previsualiza = true;
                    var id = self.get.service.replace("#f_ver_viaje", "");
                    nw.loading({text: "Por favor espere...", title: "Cargando viaje..."});
                    if (window.location.hash === "#f_ver_viaje") {
                        window.location.href = window.location.href.replace("#f_ver_viaje", "");
                        window.location.href = window.location.href.replace("//lib_mobile", "/lib_mobile");
//                        window.location.reload
                    }
                    setTimeout(function () {
                        self.openTravelByID(id);
                        nw.loadingRemove();
                        nw.remove(".containerLoadingFirstTime");
                    }, 1000);
                }, true);
                return false;
            }
        }
        if (!nw.evalueData(up.usuario)) {
            return false;
        }

        self.validaPermisosDisp(function () {
            self.openInitWindow();
        });

        self.addInProfile();

//        setTimeout(function () {
//            nw.getPromotionsApp();
//        }, 2000);

        $(window).on("navigate", function (event, data) {
            var direction = data.state.direction;
            if (!!direction) {
                if (direction == "back") {
                    var inservicesdiv = document.querySelector(".textContainServices");
                    var div = document.querySelector(".nw_widget_div_backAdondevamos_show");
                    if (div && !inservicesdiv) {
                        main.selfCrearViaje.loadInitial();
                        main.selfCrearViaje.activeNormal();
                        main.selfCrearViaje.resetValuesHome();
                    }
                }
            }
        });

        setTimeout(function () {
            self.getDataByCustomer();
        }, 2000);

    },
    destruct: function () {
    },
    members: {
        selfCrearViaje: null,
        selfMapaDriver: null,
        id_service_active: null,
        addBtnAccount: function addBtnAccount(title, description, icone, callback) {
            main.sumAddbtns = main.sumAddbtns + 1;
            config.addButtonsInAccountOtherData[main.sumAddbtns] = function () {
                var con = ".menuProfile";
                var type = "center";
                var icon = "material-icons " + icone + " normal false";
                var addClass = "btn_others_account";
                var di = nw.generateLink(title, callback, type, 0, description, icon, "lists_simple", addClass);
                nw.appendLinkMenu(di, con);
            };
        },
        openInitWindow: function openInitWindow() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var os = nw.utils.getMobileOperatingSystem();
            var online = nw.isOnline();

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
                nw.loading({text: "", title: "Buscando tu ubicación, por favor espera", addClass: "loading_home_localiz_2"});
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
                        validaIniciaGPS();
                    } else {
                        nw.remove(".loading_home_localiz_2");
                    }
                }, buscaGpstime);
                buscaGpstime = 1000;
            }

            main.servtoke = false;
            main.usegooglenative = false;
            if (typeof plugin !== "undefined") {
                if (typeof plugin.google !== "undefined") {
                    main.usegooglenative = true;
                }
            }

            var errorOptional = false;
            var usePositionPredet = true;
            if (os = "IOS") {
                setTimeout(function () {
                    if (!nw.evalueData(window.localStorage.getItem("updategpsfirsttime_ios"))) {
                        window.localStorage.setItem("updategpsfirsttime_ios", "SI");
//                        window.location.reload();
                        nw.remove(".loading_home_localiz");
                        return;
                    }
                }, 10000);
            }
            //1 trae ubicación
            if (!online) {
                nwgeo.setDataGeoLocal({latitud: 10, longitud: 10});
                nw.remove(".loading_home_localiz");
                openMap();
            }
            main.position_initial = false;
            var libs = "";
            nwgeo.getMapLocation(function (position) {
//                console.log("1:::::::::::::::::::position", position, nwgeo);
                main.position_initial = position;
                if (!nwgeo.native) {
                    nwgeo.initialize(function (position) {
                        setTimeout(function () {
                            nw.remove(".loading_home_localiz");
                            nw.remove(".main_loading_initial_without_lib");
                        }, 1000);
                        main.gps = position;
                        openMap();
                    }, true, libs);
                } else {
                    setTimeout(function () {
                        nw.remove(".loading_home_localiz");
                        nw.remove(".main_loading_initial_without_lib");
                    }, 1000);
                    openMap();
                }
            }, errorOptional, usePositionPredet);

            function openMap() {
                self.crearViaje();
            }
        },
        getConfigCache: function getConfigCache() {
            if (nw.utils.evalueData(window.localStorage.getItem("configurationInitAccountMovilmove"))) {
                if (nw.utils.evalueData(window.localStorage.getItem("lastVersionCacheCloud"))) {
                    var r = window.localStorage.getItem("configurationInitAccountMovilmove");
                    r = JSON.parse(r);
                    var cacheStorage = window.localStorage.getItem("version_in_this_device");
                    var versionCache = window.localStorage.getItem("lastVersionCacheCloud");
                    if (cacheStorage.split("-")[0] == versionCache) {
                        return r;
                    }
                }
            }
            return false;
        },
        loadInitFirebase: function loadInitFirebase() {
            console.warn("loadInitFirebase");
            var self = this;
            var up = nw.userPolicies.getUserData();
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
            var firebaseConfig = false;
            if (domain == "app.movilmove.com" || domain == "app.transfershcy.com") {
                firebasePruebas = "PRODUCCIÓN";
                firebaseConfig = {
                    apiKey: "AIzaSyCANJzxDNeSj-MFeOdEtOEmapAiR0r5Yvw",
                    authDomain: "movilmove-services.firebaseapp.com",
                    projectId: "movilmove-services",
                    storageBucket: "movilmove-services.appspot.com",
                    messagingSenderId: "766196491813",
                    appId: "1:766196491813:web:9f1e67fa80f885094d01cc"
                };
            }
            if (domain == "test.movilmove.com" || domain == "ultimamilla.sitca.co" || domain == "eu.movilmove.com" || domain == "192.168.1.45" || domain == "movilmove.loc" || domain == "192.168.1.64" || domain == "192.168.1.7") {
                firebasePruebas = "PRUEBAS";
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

            config.addTextInAccountOtherData += "<br />" + msg + " ";

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
            ops.limit = 10;
            ops.order = true;
//            ops.order = false;
            ops.orderField = "date";
            ops.orderAscDesc = "desc";
            ops.getModelData = false;
            ops.destroyQuery = false;
            console.log("ops", ops);
            ops.callback = function (r, snapshot, query) {
//                    console.log("query", query);
                console.log("getNotificationsInFirebase:::snapshot.empty", snapshot.empty);
//                alert("SIII")
                snapshot.docChanges().forEach(function (change) {
                    var data = change.doc.data();
//                    console.log("getNotificationsInFirebase:::change.type", change.type);
//                    console.warn("getNotificationsInFirebase:::change.type:::data", change.type, data);

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
                        var data = {};
                        data.id = da.room;
                        data.conductor = da.title;
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
                return false;
            }
            if (main.configCliente.usa_firebase_account == "NO") {
                return false;
            }
            var selfthis = this;
            var self = main.selfCrearViaje;
            var up = nw.userPolicies.getUserData();
//            var date = nw.utilsDate.getActualFullDate();

            var ops = {};
            ops.table = "servicios";
//                ops.where2 = ["usuario", "==", up.usuario];
//            ops.where3 = ["parada_data_users", "array-contains", up.usuario];

            var sum = 0;
            ops.where_array = [];
            ops.where_array[sum] = {variable: "empresa", operator: "==", equal: up.empresa};
//            ops.where_array[sum++] = {variable: "usuario", operator: "==", equal: up.usuario};
            sum = sum + 1;
            ops.where_array[sum] = {variable: "parada_data_users", operator: "array-contains", equal: up.usuario};
            sum = sum + 1;
            ops.where_array[sum] = {variable: "estado", operator: "in", equal: ["SOLICITUD", "EN_RUTA", "EN_SITIO", "ABORDO", "LLEGADA_DESTINO"]};
            sum = sum + 1;
            ops.where_array[sum] = {variable: "calificacion_conductor", operator: "==", equal: null};
//            ops.where_array[sum++] = {variable: "conductor_id", operator: "!=", equal: null};

            ops.limit = 200;
            ops.order = true;
//            ops.limit = 1;
            ops.orderField = "id";
            ops.orderAscDesc = "desc";
//            ops.orderField2 = ["fecha_ultima_interaccion", "desc"];
            ops.getModelData = false;
            ops.destroyQuery = false;
//            self.inAction = false;
            ops.callback = function (r, snapshot, query) {
//                console.log("r", r);
//                console.log("snapshot", snapshot);
//                console.log("snapshot.empty", snapshot.empty);
//                    console.log("query", query);
                snapshot.docChanges().forEach(function (change) {
                    let dataOriginal = change.doc.data();
                    var data = dataOriginal;
                    if (change.type != "removed") {
                        console.warn("%c<<<<FIREBASE_GET_SERVICES_ACTIVES::: change.type " + change.type + " - ID: " + data.id + "!!!!!!!!!!!!!>>>>", 'background: orange; color: #000');
                        console.warn("change.type:::data", change.type, data);
                        console.warn("change.type:::data.estado", data.estado);

//                        if (!self.inAction) {
                        //valida query equivalente al php but in javascript
                        if (selfthis.validateQueryFirebase(dataOriginal)) {
                            data = selfthis.filteredDataFirebase(data); // arregla data para paradas
                            var onlyResolveDataFirebase = true;
                            var dataFirebaseService = data;
//                        console.log("dataFirebaseService", dataFirebaseService);
//                        console.log("data", data);
                            self.validaServiceActive(false, function (r) {
//                                    self.inAction = true;
//                            console.log("RESULT::::execFuncInterval::::validaServiceActive::", r);
                            }, onlyResolveDataFirebase, dataFirebaseService);
                        }
//                        }
                    }
                });
            };
            nw.firebase.select(ops);
        },
        validateAction: function validateAction(data) {

        },
        validateQueryFirebase: function validateQueryFirebase(data) {
//            console.log("validateQueryFirebase:::data", data);
            var up = nw.userPolicies.getUserData();
            var response = true;
            if (data.paradas == true) {
                for (var i = 0; i < data.parada_data.length; i++) {
                    var r = data.parada_data[i];
//                    console.log("r", r);
//                    console.log("r.usuario_pasajero", r.usuario_pasajero);
//                    console.log("up.usuario", up.usuario);
//                    console.log("r.estado", r.estado);
//                    console.log("r.id", r.id);
                    if (r.usuario_pasajero == up.usuario) {
                        if (r.estado == "CANCELADO_POR_CLIENTE") {
                            response = false;
                            break;
                        }
                    }
                }
            }
            if (!response) {
                return false;
            }
            var fecha_hora = "";
            if (data.estado == 'SOLICITUD' && (data.tipo_servicio != 'reservado' || data.ofertado == 'SI')) {
                return true;
            }
            if (data.estado == 'EN_RUTA' && nw.utils.evalueData(data.conductor_id)) {
                return true;
            }
            if (data.estado == 'ABORDO' && nw.utils.evalueData(data.conductor_id)) {
                return true;
            }
            if (data.estado == 'EN_SITIO' && nw.utils.evalueData(data.conductor_id)) {
                return true;
            }
            if (data.estado == 'LLEGADA_DESTINO' && !nw.utils.evalueData(data.calificacion_conductor)) {
                return true;
            }
            if (data.estado == 'CANCELADO_POR_CONDUCTOR' && nw.utils.evalueData(data.conductor_id) && !nw.utils.evalueData(data.calificacion_conductor) && (data.fecha + ' ' + data.hora) >= fecha_hora) {
                return true;
            }
            return false;
        },
        filteredDataFirebase: function filteredDataFirebase(data) {
            var up = nw.userPolicies.getUserData();
            if (data.paradas == true) {
                for (var i = 0; i < data.parada_data.length; i++) {
                    var r = data.parada_data[i];
                    if (r.usuario_pasajero == up.usuario) {
                        data.id_parada = r.id;
                        if (nw.utils.evalueData(r.latitud_parada)) {
                            data.latitudOri = r.latitud_parada;
                        }
                        if (nw.utils.evalueData(r.longitud_parada)) {
                            data.longitudOri = r.longitud_parada;
                        }

                        data.estado_parada = r.estado;
                        data.calificacion_conductor = r.calificacion_a_conductor;
                        var estado = data.estado;
                        if (r.estado == "SOLICITUD" && data.estado == "EN_RUTA" || r.estado == "SOLICITUD" && data.estado == "ABORDO") {
                            estado = "EN_RUTA";
                        }
                        if (r.estado == "NOVEDAD") {
                            estado = "LLEGADA_DESTINO";
                        }
                        if (r.estado == "REPARTO_DETENIDO") {
                            estado = "EN_SITIO";
                        }
                        if (r.estado == "ENTREGADO") {
                            estado = "ABORDO";
                        }
                        if (r.estado == "REPARTO") {
                            estado = "EN_RUTA";
                        }
                        if (data.estado == "LLEGADA_DESTINO" || data.estado == "CANCELADO_POR_ADMIN" || data.estado == "CANCELADO_POR_CONDUCTOR" || data.estado == "CANCELADO_POR_USUARIO") {
                            estado = "LLEGADA_DESTINO";
                        }
                        data.estado = estado;
                        break;
                    }
                }
            }
            return data;
        },
        registerServiceInFirebase: function registerServiceInFirebase(id) {
            if (main.configCliente.usa_firebase_account == "NO") {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            console.log("id", id);
            id = id.toString();
            console.log("id", id);
            var self = this;
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
                }
            };
            rpc.exec("getTravelsForFirebase", data, func);
        },
        rechazarAceptarOfertaInFirebase: function rechazarAceptarOfertaInFirebase(id) {
            if (main.configCliente.usa_firebase_account == "NO") {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            console.log("id", id);
            var data = {};
            data.id = id;
            data.empresa = up.empresa;
            console.log("registerInFirebase:::sendData", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("registerInFirebase:::responseServer", r);
                var p = {};
                p.collection = "servicios_ofertas";
                p.document = r.id;
                for (var item in r) {
                    p[item] = r[item];
                }
                nw.firebase.set(p);
            };
            rpc.exec("getOffersByTravelsForFirebase", data, func);
        },
        destroyQueryOfertas: function () {
            if (typeof queryGetOffers !== "undefined") {
                queryGetOffers();
            }
        },
        getDataByCustomer: function () {
            var self = this;
            var up = nw.userPolicies.getUserData();
            //trae datos si es cliente empresa
            if (nw.evalueData(up.bodega)) {
                var data = {};
                data.id = up.bodega;
                var rpc = new nw.rpc(nw.getRpcUrl(), "usuarios");
                rpc.setAsync(true);
                rpc.setLoading(false);
                var func = function (r) {
                    console.log("getDataByCustomer", r);
                    if (!r) {
                        return false;
                    }
                    var cl = document.createElement("div");
                    cl.className = "encCustomerComp";
                    cl.innerHTML = "<div class='custome custName'>" + r.razon_social + "</div><div class='custome custLogo' style='background-image: url(" + config.domain_rpc + r.logo + ");'></div>";
//                    document.body.appendChild(cl);
                    document.querySelector(".headerHome").appendChild(cl);
                };
                rpc.exec("getDataByCustomer", data, func);
            }
        },
        validaPermisosDisp: function (callback) {
            var self = this;
            self.allPermissionGranted = true;
            if (typeof nw.permissions != "undefined" && parseInt(device.version) >= self.androidMinVersionPermissions) {
                nw.remove(".div_container_skips_notificacions");
                nw.remove(".popup_intered_permissions");

                var container = document.createElement("div");
                container.className = "div_container_skips_notificacions";
                document.body.appendChild(container);

                nw.permissions.get("ACCESS_FINE_LOCATION", nw.utils.tr("Por favor activa la ubicación precisa para poder ubicarte en el mapa"), function (response, text) {
                    var msg = "<span style='color: green;'>" + nw.utils.tr("Permiso concedido ubicación precisa") + ".</span>";
                    if (response === "rejected" || response === "skip") {
                        self.allPermissionGranted = false;
                        var msg = "<span style='color: red;'>" + nw.utils.tr("Denegaste/omitiste la ubicación precisa, podrías presentar problemas de ubicación") + ".</span>";
                        var div = document.createElement("div");
                        div.className = "popup_intered_permissions";
                        div.innerHTML = nw.utils.tr("La ubicación precisa está actualmente desactivada, toca para activarla") + ".";
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
                    self.addBtnAccount("Ubicación", nw.utils.tr("Configurar permisos de ubicación"), "edit_location", function () {
                        window.cordova.plugins.settings.open("application_details", function () {
                            console.log('opened settings');
                        }, function () {
                            console.log('failed to open settings');
                        });
                    });
                    self.savePerm(text);
                    nw.permissions.get("POST_NOTIFICATIONS", nw.utils.tr("Por favor activa las notificaciones para recibir mensajes de chat, nuevos servicios y otros"), function (response, text) {
                        var msg = "<span style='color: green;'>" + nw.utils.tr("Permiso concedido notificaciones") + ".</span>";
                        if (response === "rejected" || response === "skip") {
                            self.allPermissionGranted = false;
                            var msg = "<span style='color: red;'>" + nw.utils.tr("Denegaste las notificaciones, podrías presentar problemas de comunicación") + ".</span>";
                            var div = document.createElement("div");
                            div.className = "popup_intered_permissions";
                            div.innerHTML = nw.utils.tr("Las notificaciones están actualmente desactivadas, toca para activarlas");
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
                        self.addBtnAccount("Notificaciones", nw.utils.tr("Configurar permisos de notificaciones"), "notifications", function () {
                            window.cordova.plugins.settings.open("notification_id", function () {
                                console.log('opened settings');
                            }, function () {
                                console.log('failed to open settings');
                            });
                        });
                        self.savePerm(text);
                        if (typeof callback != "undefined") {
                            callback();
                        }
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

            var up = nw.userPolicies.getUserData();
            var os = nw.utils.getMobileOperatingSystem();

//        if (os === "IOS") {
            if (typeof cordova.plugins != "undefined") {
                if (typeof cordova.plugins.notification != "undefined") {

//                cordova.plugins.notification.local.setDummyNotifications();

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
//        }


            if (os != "IOS") {
                if (typeof cordova.plugins != "undefined") {
                    if (typeof cordova.plugins.diagnostic != "undefined") {
//            checkCameraPermission();

                        function requestCameraPermission() {
                            cordova.plugins.diagnostic.requestRuntimePermission(function (status) {

                                // If result is DENIED_ALWAYS after requesting then it really is permanently denied
                                if (status === cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS) {
                                    cameraDeniedAlwaysAfterRequesting = true;
                                }

                                // Re-check permission
                                checkCameraPermission();

                            }, console.error, cordova.plugins.diagnostic.permission.CAMERA);
                        }

                        function checkCameraPermission() {
                            cordova.plugins.diagnostic.getPermissionAuthorizationStatus(function (status) {

                                // If running on Android 11+ and status is DENIED_ALWAYS, assume it can still be requested (i.e. user selected "Only once" in previous app session)
//                if (deviceOS.apiLevel >= 30 && status === cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS && !cameraDeniedAlwaysAfterRequesting) {
                                status = cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE;
//                }

                                switch (status) {
                                    case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                                        console.log("Camera permission is allowed")
                                        break;
                                    case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                                        console.log("Camera permission not requested yet - requesting...")
                                        requestCameraPermission();
                                        break;
                                    case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
                                        console.log("Camera permission denied but can still request - requesting...")
                                        requestCameraPermission();
                                        break;
                                    case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
                                        console.log("Camera permission permanently denied - can't request");
                                        break;
                                }
                            }, console.error, cordova.plugins.diagnostic.permission.CAMERA);
                        }

                        cordova.plugins.diagnostic.requestRuntimePermissions(function (statuses) {
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
                            console.error("The following error occurred: " + error);
                            self.savePerm(error);
                        }, [
//            cordova.plugins.diagnostic.permission.MANAGE_EXTERNAL_STORAGE,
//            cordova.plugins.diagnostic.permission.READ_MEDIA_IMAGES,
//            cordova.plugins.diagnostic.permission.READ_MEDIA_AUDIO,
//                cordova.plugins.diagnostic.permission.READ_MEDIA_IMAGES,
//                cordova.plugins.diagnostic.permission.READ_MEDIA_VIDEO,
//                cordova.plugins.diagnostic.permission.WRITE_EXTERNAL_STORAGE,
//                cordova.plugins.diagnostic.permission.ACTION_CREATE_DOCUMENT,
//                cordova.plugins.diagnostic.permission.ACTION_OPEN_DOCUMENT,


                            cordova.plugins.diagnostic.permission.ACCESS_COARSE_LOCATION,
                            cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION,
                            cordova.plugins.diagnostic.permission.ACCESS_MEDIA_LOCATION,
//                    cordova.plugins.diagnostic.permission.ACCESS_BACKGROUND_LOCATION,
                            cordova.plugins.diagnostic.permission.POST_NOTIFICATIONS,
                            cordova.plugins.diagnostic.permission.CAMERA,
                            cordova.plugins.diagnostic.permission.READ_EXTERNAL_STORAGE,
                            cordova.plugins.diagnostic.permission.READ_PHONE_STATE
                        ]);

                        cordova.plugins.diagnostic.requestCameraAuthorization(
                                function (status) {
                                    console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
                                }, function (error) {
                            console.error("The following error occurred: " + error);
                        }, false
                                );


                        cordova.plugins.diagnostic.requestExternalStorageAuthorization(function (status) {
                            console.log("Authorization request for external storage use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
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


            nw.utils.getPermission([
                'android.permission.CAMERA',
                'android.permission.MANAGE_EXTERNAL_STORAGE',
                'android.permission.ACCESS_BACKGROUND_LOCATION',
                'android.permission.ACCESS_FINE_LOCATION',
                'android.permission.ACCESS_COARSE_LOCATION',
                'android.permission.READ_PHONE_STATE',
                'android.permission.READ_EXTERNAL_STORAGE',
                'android.permission.READ_MEDIA_IMAGES',
                'android.permission.READ_MEDIA_AUDIO',
                'android.permission.ACTION_CREATE_DOCUMENT',
                'android.permission.ACTION_OPEN_DOCUMENT',
                'android.permission.READ_MEDIA_VIDEO',
                'android.permission.READ_MEDIA_IMAGES',
                'android.permission.POST_NOTIFICATIONS',
                //                'android.permission.RECORD_VIDEO',
                'android.permission.WRITE_EXTERNAL_STORAGE',
                'android.permission.ACCESS_MEDIA_LOCATION',
                'android.permission.ACCESS_WIFI_STATE',
                'android.permission.ACCESS_NETWORK_STATE'
                        //                    ,
                        //                    'android.permission.MODIFY_AUDIO_SETTINGS',
                        //                    'android.permission.FLASHLIGHT',
                        //                    'android.permission.RECORD_AUDIO',
                        //                    'android.permission.RECORD_AUDIO',
                        //                    'android.permission.CAMERA',
                        //                    'android.permission.MICROPHONE'
            ], function (r) {
                console.error("Permisos final result", r);
            });

            if (typeof cordova.plugins != "undefined") {
                if (typeof cordova.plugins.firebase != "undefined") {
                    if (typeof cordova.plugins.firebase.messaging != "undefined") {
                        cordova.plugins.firebase.messaging.requestPermission({forceShow: false}).then(function () {
                            console.log("Push messaging is allowed");
                        });
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

            if (typeof cordova.plugins != "undefined") {
                if (typeof cordova.plugins.notification != "undefined") {
                    if (typeof cordova.plugins.notification.local != "undefined") {

                        cordova.plugins.notification.local.setDummyNotifications();

                        cordova.plugins.notification.local.hasPermission(function (granted) {
                            console.log("granted", granted);
//                    alert("cordova.plugins.notification.local.hasPermission granted");
//                    alert(granted);
                            if (!granted) {
                                nw.dialog("Activar notificaciones", function () {
                                    cordova.plugins.notification.local.requestPermission(function (granted) {
                                        console.log("granted", granted);
                                        alert("cordova.plugins.notification.local.requestPermission granted");
                                        alert(granted);
                                    });
                                }, function () {
                                    return true;
                                });
                            }
                        });

                        cordova.plugins.notification.local.requestPermission(function (granted) {
                            console.log("granted", granted);
//                    alert("cordova.plugins.notification.local.requestPermission granted");
//                    alert(granted);
                        });

                        cordova.plugins.notification.local.schedule({
                            title: '¡Bienvenido!',
                            text: 'Hola ' + up.nombre,
                            foreground: true
                        });
                    }
                }
            }

            if (typeof callback != "undefined") {
                callback();
            }

        },
        savePerm: function (text) {
            var up = nw.userPolicies.getUserData();
            var os = nw.utils.getMobileOperatingSystem();
            var update = "NO";
            if (nw.utils.evalueData(window.localStorage.getItem("userPermissionsSet"))) {
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
//            console.log("savePermisos:::dataSend", data);
            var funcs = function (r) {
//                console.log("savePermisos:::responseServer", r);
                window.localStorage.setItem("userPermissionsSet", text);
            };
            rpc.exec("savePermisos", data, funcs);
        },
        getDataTravelByID: function (id, callback) {
            var self = this;
            var dat = {};
            dat.id = id;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("RESULT_SERVER:::openTravelByID:::", r);
                if (!r) {
                    nw.dialog("No existe el servicio");
                    return false;
                }
                callback(r);
            };
            rpc.exec("getServiceByID", dat, func);
        },
        intervalMapExtern: null,
        openTravelByID: function (id) {
            var self = this;
//            var d = new f_ver_viaje();
            var d = new f_ver_viaje_mapstatic();
            d.id = "ver_viaje_extern";
//            self.canvas = "#foo";
            d.id_form = "ver_viaje_extern";
            d.setTitle = "<div class='titleencviajeexte'>" + config.logotipoHeader + "</div>";
            d.construct();
            d.show();

            var os = nw.getMobileOperatingSystem();

            var os = nw.utils.getMobileOperatingSystem();

            var isShared = false;
            if (self.get) {
                console.log("self.get", self.get);
                if (typeof self.get.service !== "undefined") {
                    isShared = true;
                }
            }

            timed();

//            d.onAppear(function () {
//                setTimeout(function () {
//                    d.createMapa();
//                    timed();
//                }, 100);
//            });

            function timed() {
                self.getDataTravelByID(id, function (r) {
                    var data = r;

                    console.log("data", data);

                    d.icon1 = config.domain_rpc + config.carpet_files_extern + '/img/pin46.png';
                    d.icon2 = config.domain_rpc + config.carpet_files_extern + '/img/pin_negro_44.png';
//                    d.direccion_origen = "Origen: " + data.origen;
//                    d.direccion_destino = "Destino: " + data.destino;
//                    d.direccion_origen = data.origen;
//                    d.direccion_destino = data.destino;
                    d.direccion_origen = false;
                    d.direccion_destino = false;

                    var iniciado = false;

//                    if (data.estado === "ABORDO") {
                    if (data.estado === "ABORDO" && nw.utils.evalueData(data.latitud_actual) && nw.utils.evalueData(data.longitud_actual)) {
                        iniciado = true;
//                        d.latitude = r.conductor_latitud;
//                        d.longitude = r.conductor_longitud;
                        d.latitude = data.latitud_actual;
                        d.longitude = data.longitud_actual;
                        d.icon1 = config.domain_rpc + config.carpet_files_extern + '/img/ubicacion-carro.png';
                    } else {
                        d.latitude = data.latitudOri;
                        d.longitude = data.longitudOri;
                    }
                    d.latitudDes = data.latitudDes;
                    d.longitudDes = data.longitudDes;

                    if (data.estado !== "LLEGADA_DESTINO" && !isShared) {
                        d.latitudDes = nwgeo.latitude;
                        d.longitudDes = nwgeo.longitude;
                        if (nw.utils.evalueData(data.latitud_actual) && nw.utils.evalueData(data.longitud_actual)) {
                            d.latitude = data.latitud_actual;
                            d.longitude = data.longitud_actual;
                        }
                    }

                    d.createMapa(d);

                    nw.remove(".containSddInfo");
                    var html = "<div class='containSddInfo'>";
                    html += "<div class='separatorLine'></div>";
                    if (data.estado !== "LLEGADA_DESTINO") {
                        if (iniciado) {
                            html += "<p><strong>" + nw.tr("El viaje ha iniciado, en camino a destino") + "</strong></p>";
                        } else {
                            html += "<p><strong>" + nw.tr("El viaje aún no ha iniciado") + "</strong></p>";
                        }
                    }
                    html += "<p><strong>" + nw.tr("Estado") + ":</strong> " + nw.tr(data.estado) + "</p>";
                    html += "<p><strong>" + nw.tr("Fecha") + ":</strong> " + data.fecha_creacion + "</p>";
                    if (!self.get) {
                        html += "<p><strong>" + nw.tr("Valor estimado") + ":</strong> $" + nw.addNumber(data.valor) + "</p>";
                        if (nw.evalueData(data.valor_total_servicio)) {
                            html += "<p><strong>" + nw.tr("Valor final") + ":</strong> $" + nw.addNumber(data.valor_total_servicio) + "</p>";
                        }
                    }
                    html += "<p><strong>" + nw.tr("De") + ": </strong> " + data.ciudad_destino + " " + data.origen + "</p>";
                    html += "<p><strong>" + nw.tr("Hasta") + ": </strong> " + data.ciudad_origen + " " + data.destino + "</p>";
                    if (nw.evalueData(data.subcategoria_servicio_text)) {
                        html += "<p><strong>" + nw.tr("Tipo servicio") + ": </strong>" + data.subcategoria_servicio_text + "</p>";
                    }
                    if (nw.evalueData(data.conductor)) {
                        html += "<p><strong>" + nw.tr("Conductor") + ": </strong> <br /><span class='fotoConductorLista' style='background-image:url(" + config.domain_rpc + data.conductor_foto + ")'></span>" + data.conductor + "</p>";
                        if (main.configCliente.telefono_conductor_visible_para_pasajero !== "NO") {
                            html += "<p>" + data.vehiculo_text + " " + data.vehiculo_color + " " + data.placa + " " + data.conductor_celular + "</p>";
                        }
                    }

                    if (main.configCliente.telefono_conductor_visible_para_pasajero !== "NO") {
                        if (nw.evalueData(data.conductor_celular)) {
                            html += "<p class='telefono_conductor_ampliar'><strong>" + nw.tr("Teléfono conductor") + ": </strong>" + data.conductor_celular + "</p>";
                        }
                    }
                    if (nw.evalueData(data.total_metros)) {
                        html += "<p><strong>" + nw.tr("Distancia (metros)") + ": </strong>" + data.total_metros + "</p>";
                    }
                    if (nw.evalueData(data.hora_inicio)) {
                        html += "<p><strong>" + nw.tr("Inicio") + ": </strong>" + data.hora_inicio + "</p>";
                    }
                    if (nw.evalueData(data.hora_fin_servicio)) {
                        html += "<p><strong>" + nw.tr("Llegada") + ": </strong>" + data.hora_fin_servicio + "</p>";
                    }
                    if (!self.get) {
                        html += "<p><strong>" + nw.tr("Descuento aplicado") + ": </strong>$" + nw.addNumber(data.descuento_aplicado) + "</p>";
                    }
                    if (nw.evalueData(data.datos_vehiculo_elegido)) {
                        html += "<p><strong>" + nw.tr("Datos vehículo elegido") + ": </strong>" + data.datos_vehiculo_elegido + "</p>";
                    }
                    if (nw.evalueData(data.descricion_carga)) {
                        html += "<p><strong>" + nw.tr("Observaciones") + ": </strong>" + data.descricion_carga + "</p>";
                    }
                    html += "<p><strong>ID: </strong>" + data.id + "</p>";

                    html += "<div class='nav_paradas'></div>";
                    html += "</div>";
                    d.ui.observaciones_html.setValue(html);

//                    nwgeo.removeAllPolyLines();
//                    d.createLine();
//                    if (data.estado !== "ABORDO") {
//                        var marker = new nwgeo.addMarker();
//                        marker.map = d.map;
//                        marker.latitude = r.conductor_latitud;
//                        marker.longitude = r.conductor_longitud;
//                        marker.title = "Driver";
//                        marker.label = "Driver";
//                        marker.icon = config.domain_rpc + config.carpet_files_extern + '/img/ubicacion-carro.png';
//                        marker.draggable = false;
//                        marker.native = false;
//                        self.marker3 = marker.show();
//                    }
                    if (data.estado === "LLEGADA_DESTINO") {
                        if (cordova.platformId !== "browser" && os === "ANDROID" || os === "IOS") {

                        } else {
                            var html = "<h1>Viaje finalizado</h1>";
                            var accept = function () {
                                var os = nw.utils.getMobileOperatingSystem();
                                var link = config.url_play_store;
                                if (os === "ANDROID") {
                                    link = config.url_play_store;
                                }
                                if (os === "IOS") {
                                    link = config.url_app_store;
                                }
                                nw.utils.openLink(link, "_BLANK");
                                return false;
                            }
                            var cancel = function () {
                                return true;
                            };
                            var opts = {};
                            opts.original = true;
                            opts.textAccept = "¡Descarga " + config.name + "!";
                            opts.addClass = "descarga_popup";
                            nw.dialog(html, accept, cancel, opts);
                        }
                    } else {
                        self.intervalMapExtern = setTimeout(function () {
                            var fo = document.querySelector(".ver_viaje_extern");
                            if (!fo) {
                                clearTimeout(self.intervalMapExtern);
                                return false;
                            }
                            timed();
                        }, 30000);
                    }
                });
            }
        },
        misComentarios: function () {
            var da = new l_comentarios();
            da.construct();
        },
        resumenFinal: function (r, type) {
            var self = this;
            var da = new f_resumen_final();
            r.type = type;
            da.populate(r, function () {
                da.construct();
            });
        },
        configCompany: function () {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id_usuario = up.id_usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                configCompany = r;
            };
            rpc.exec("consultaConfiguracion", data, func);
        },
        addInProfile: function () {
            var self = this;
            nw.addProfile = function (parent) {
                var con = "." + parent.id;
                var title = "Comentarios";
                var description = "Comentarios que me han realizado";
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
        misTarjetasCredito: function (callback) {
            var d = new l_tarjetas_credito();
            d.construct(callback);
        },
        redimirCupon: function (callback) {
            var d = new f_redimir_cupon();
            d.construct(callback);
        },
        crearViaje: function (idService) {
            var self = this;
            var online = nw.isOnline();
            if (online) {
                if (!main.usegooglenative) {
                    if (typeof google === "undefined") {
                        setTimeout(function () {
                            self.crearViaje(idService);
                        }, 100);
//                    nw.dialog("La API de mapas no ha cargado totalmente, espere por favor.");
                        return false;
                    }
                }
            } else {
                nw.dialog("La API de mapas no cargó debido a que no cuenta con conexión a internet, red deficiente o nula.");
                google = [];
            }
            if (nw.evalueData(self.selfCrearViaje) && nw.evalueData(idService)) {
                self.selfCrearViaje.validaServiceActive();
                return true;
            }
            main.selfCrearViaje = new f_crear_viaje();
            main.selfCrearViaje.construct(function () {
                setTimeout(function () {
                    self.loadInitFirebase();
                }, 1000);
            });
        },
        timeEsperaConfirmationUser: function () {
            return 3000;
        },
        timeLlegadaDelConductor: function () {
            return 3000;
        },
        misVehiculos: function () {
            var d = new l_vehiculos();
            d.construct();
            return d;
        },
        driverMapaServicios: function (idService) {
            var self = this;
            if (typeof google === "undefined") {
                nw.dialog("La API de mapas no ha cargado totalmente, espere por favor.");
                return false;
            }
            if (nw.evalueData(self.selfCrearViaje) && nw.evalueData(idService)) {
                self.selfCrearViaje.validaServiceActive();
                return true;
            }
            var d = new f_driver_mapa_servicios();
            d.construct();
        },
        vehiculo: false,
        serviceDriveCancelInterval: function () {
            clearTimeout(main.interval);
            main.interval = setTimeout(function () {
                main.serviceDriveCancelExec();
            }, 5000);
        },
        serviceToken: function (service, msg) {
            var self = this;
            if (nw.utils.evalueData(msg)) {
                nw.utils.information(msg, function () {
                    main.reloadApp();
                });
            }
            if (self.debugConstruct) {
                console.log("LAUNCH:::serviceToken:::service", service);
            }
            main.servtoke = service;
        },
        serviceDriveCancelExec: function () {
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id_usuario = up.id_usuario;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("serviceDriveCancelExec", r);
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
        serviceDriver: function () {
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id_usuario = up.id_usuario;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("serviceDriver", r);
                if (r === false) {
                    return false;
                }
                if (r.estado === "LLEGADA_DESTINO" && !nw.evalueData(r.estado_final)) {
                    main.resumenFinal(r, "driver");
                    return false;
                }
                if (r.estado === "CANCELADO_POR_USUARIO") {
                    return false;
                }
                if (r.estado === "LLEGADA_DESTINO") {
                    return false;
                }
                var token_usuario = r.token_usuario;
                var d = new f_esperando_confirmacion();
                d.setTitle = "<span style='color:#fff;'>Servicio en ruta</span>";
                d.construct();
                d.buttons.push(
                        {
                            style: "background-size:20px;box-shadow: none;border: 0;background-color: orange;color: #ffffff;width:40%;",
                            icon: "material-icons message normal",
                            colorBtnBackIOS: "#ffffff",
                            position: "bottom",
                            name: "aceptar",
                            label: "Mensaje",
                            callback: function () {
                                var data = d.getRecord();
                                if (!d.validate()) {
                                    return false;
                                }
                            }
                        },
                        {
                            style: "background-size:20px;box-shadow: none;border: 0;background-color: red;color: #ffffff;display:none;",
                            icon: "nwmaker/img/baseline-how_to_reg-24px.svg",
                            colorBtnBackIOS: "#ffffff",
                            position: "bottom",
                            name: "finalizar",
                            label: "Finalizar viaje",
                            callback: function () {
                                var data = {};
                                data.id = r.id;
                                data.templateEmail = main.templateMailEnd();
                                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                                rpc.setAsync(true);
                                var func = function (rp) {
                                    console.log(rp);
                                    clearTimeout(main.interval);
                                    nw.cleanAllWindow();
//                                    nw.home();
                                    nw.dialog("Servicio finalizado correctamente");
                                    main.resumenFinal(r, "driver");

                                    nw.sendNotificacion({
                                        title: "Tu viaje ha finalizado",
                                        body: "Tu viaje ha finalizado",
                                        icon: "fcm_push_icon",
                                        sound: "default",
                                        data: "main.crearViaje('" + r.id + "')",
                                        callback: "FCM_PLUGIN_ACTIVITY",
                                        to: token_usuario
                                    });

                                };
                                rpc.exec("llegadaServicioDestiono", data, func);
                            }
                        },
                        {
                            style: "background-size:20px;box-shadow: none;border: 0;background-color: orange;color: #ffffff;display:none;width:100%;",
                            icon: "material-icons how_to_reg normal",
                            colorBtnBackIOS: "#ffffff",
                            position: "bottom",
                            name: "abordar",
                            label: "Confirmar abordaje",
                            callback: function () {
                                var data = {};
                                data.id = r.id;
                                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                                rpc.setAsync(true);
                                var func = function (r) {
                                    console.log(r);
                                    $(".dirigete").text("Servicio abordo activo");
                                    $(".finalizar").css({"display": "block"});
                                    $(".aceptar").css({"display": "none"});
                                    $(".abordar").css({"display": "none"});

                                    nw.sendNotificacion({
                                        title: "Ha iniciado tu viaje",
                                        body: "¡Buen viaje!",
                                        icon: "fcm_push_icon",
                                        sound: "default",
                                        data: "main.crearViaje('" + r.id + "')",
                                        callback: "FCM_PLUGIN_ACTIVITY",
                                        to: token_usuario
                                    });

                                };
                                rpc.exec("confirmarAbordaje", data, func);
                            }
                        },
                        {
                            style: "background-size:20px;box-shadow: none;border: 0;background-color: orange;color: #ffffff;width:55%;margin:0px;",
                            icon: "",
                            colorBtnBackIOS: "#ffffff",
                            position: "bottom",
                            name: "aceptar",
                            label: "Confirmar llegada",
                            callback: function () {
                                var data = {};
                                data.id = r.id;
                                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                                rpc.setAsync(true);
                                var func = function (r) {
                                    console.log(r);
                                    $(".dirigete").text("Confirmar abordaje");
                                    $(".aceptar").css({"display": "none"});
                                    $(".abordar").css({"display": "block"});

                                    nw.sendNotificacion({
                                        title: "Tu conductor ha llegado",
                                        body: "Dirígete al punto de origen",
                                        icon: "fcm_push_icon",
                                        sound: "default",
                                        data: "main.crearViaje('" + r.id + "')",
                                        callback: "FCM_PLUGIN_ACTIVITY",
                                        to: token_usuario
                                    });

                                };
                                rpc.exec("llegadaServicioCon", data, func);
                            }
                        }
                );
                d.show();
                d.createMapa();
                var html = "<h1 class='dirigete'>Dirígete al punto de origen</h1>";
                html += "<p style='margin :0px;'><strong>ID: </strong>" + r.id + "</p>";
                html += "<p style='margin :0px;'><strong>Estado: </strong>" + r.estado + "</p>";
                html += "<p style='margin :0px;'><strong>Origen: </strong>" + r.origen + "</p>";
//                html += "<p style='margin :0px;'><strong>Destino: </strong>" + r.destino + "</p>";
                d.addHeaderNote(html);
                d.latitude = nwgeo.latitude;
                d.longitude = nwgeo.longitude;
                d.latitudDes = r.latitudOri;
                d.longitudDes = r.longitudOri;
                d.callback = function (response) {
                    console.log(response);
                    d.map.setZoom(nwgeo.zoom);
                };
                d.createLine();
                if (r.estado === "EN_SITIO") {
                    $(".dirigete").text("Confirmar abordaje");
                    $(".aceptar").css({"display": "none"});
                    $(".abordar").css({"display": "block"});
                }
                if (r.estado === "ABORDO") {
                    $(".dirigete").text("Servicio abordo activo");
                    $(".finalizar").css({"display": "block"});
                    $(".aceptar").css({"display": "none"});
                    $(".abordar").css({"display": "none"});
                }
                main.serviceDriveCancelInterval();
            };
            rpc.exec("servicioActivoConductor", data, func);
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
        cuponInUse: function (callback, showmsg, showmsgno) {
            if (main.configCliente.cod_promocional != "SI") {
                if (nw.utils.evalueData(callback)) {
                    callback();
                }
                return;
            }
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.warn("cuponInUse:::responseServer:::r", r);
                if (!r) {
                    up.cupon = "";
                    if (nw.utils.evalueData(callback)) {
                        callback();
                    }
                    if (showmsgno === true) {
                        var msg = "No tienes cupones";
                        nw.dialog(msg);
                    }
//                    nw.remove(".divCoupon");
//                    var div = document.createElement("div");
//                    div.className = "divCoupon";
//                    div.innerHTML = "No tienes cupones activos";
//                    div.style = "font-size: 11px; font-style: italic; opacity: 0.7;";
//                    document.querySelector(".dataUserNameMail").appendChild(div);
                    return false;
                }
                if (showmsg != false) {
                    var msg = "¡Excelente! Tienes un cupón en tu saldo de " + r.valor + " para realizar viajes. Fecha de expiración " + r.fecha_expiracion + " ";
                    nw.dialog(msg);
//                    nw.utils.toast({html: msg, timeRemove: 5000, addClass: "toast-enviado"});
                }

                up.cupon = JSON.stringify(r);

//                nw.remove(".divCoupon");
//                var div = document.createElement("div");
//                div.className = "divCoupon";
//                div.innerHTML = msg;
//                div.style = "font-size: 11px; font-style: italic; opacity: 0.7;";
//                document.querySelector(".dataUserNameMail").appendChild(div);

                if (nw.utils.evalueData(callback)) {
                    callback();
                }
            };
            rpc.exec("consultaCuponesActive", data, func);
        },
        openHistoricoViajes: function () {
            var d = new l_historico_viajes();
            d.construct();
            return d;
        },
        slotRecargas: function slotRecargas() {
            var self = this;
            var da = new f_recargas();
            da.construct();
        },
        reloadApp: function () {
            window.location.reload();
        },
        newServiceRutaCliente: function () {
            nw.dialog("Tienes un nuevo servicio, revisa tu historial.");
        },
        ofertaNotificaRecibe: function (estado) {
            console.log("estado", estado);
            if (estado == "nueva_oferta" || estado == "cancela_oferta") {
                var title = "";
                if (estado == "nueva_oferta") {
                    title = "Nueva oferta para su servicio";
                } else
                if (estado == "cancela_oferta") {
                    title = "Oferta cancelada";
                }
//                nw.dialog(title);
//                console.log("main.selfCrearViaje.arrayDataBuscaOfertas", main.selfCrearViaje.arrayDataBuscaOfertas);
//                main.selfCrearViaje.buscaOfertasMain(main.selfCrearViaje.arrayDataBuscaOfertas, "main");
            }
//            if (estado == "ACEPTA_CLIENTE" || estado == "RECHAZADO_POR_USUARIO") {
//                var title = "";
//                if (estado == "ACEPTA_CLIENTE") {
//                    title = "Oferta aceptada";
//                }
//            }
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
                asunto_viaje_finalizado: nw.utils.tr("Tu viaje ha finalizado:"),
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

window.addEventListener('message', function (e) {
//    console.log("e", e);
//    alert("KO")
    var r = e.data;
    if (r.tipo == "getCode") {
        console.log("r", r.html);
        window.localStorage.setItem("html_lib", r.html);
    } else
    if (r.tipo == "getCodeCssMain") {
        console.log("r", r.html);
        window.localStorage.setItem("css_lib", r.html);
    }
//    if (r.tipo == "saveMessageChat") {
//        var data = {};
//        if (typeof main.selfCrearViaje !== "undefined") {
//            if (typeof main.selfCrearViaje.dataServiceActive !== "undefined") {
//                console.log("main.selfCrearViaje.dataServiceActive", main.selfCrearViaje.dataServiceActive);
//                data = main.selfCrearViaje.dataServiceActive;
//            }
//        }
//        if (typeof main.dataServiceOpenHistory !== "undefined") {
//            data = main.dataServiceOpenHistory;
//        }
//        var token = false;
//        if (nw.evalueData(data.token_conductor)) {
//            token = data.token_conductor;
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
//            var room = r.room;
//            if (room) {
//                nw.sendNotificacion({
//                    title: "Nuevo mensaje de " + up.nombre,
//                    body: up.nombre + ": " + message,
//                    icon: "fcm_push_icon",
//                    sound: "default",
//                    data: "nw.dialog('Nuevo mensaje en el chat " + message + "')",
//                    callback: "FCM_PLUGIN_ACTIVITY",
//                    to: token
//                });
//                console.log("send notify push to " + token);
//            }
//        }
//    }
});