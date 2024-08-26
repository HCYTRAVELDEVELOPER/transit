qx.Class.define("movilmove.main", {
    extend: qxnw.main,
    properties: {
        configuracion: {
            init: null,
            check: "Object"
        },
        tipoempresa: {
            init: "",
            check: "String"
        },
        permiserv: {
            init: null,
            check: "Object"
        },
        pos: {
            init: null,
            check: "Object"
        },
        usercc: {
            init: {},
            check: "Object"
        }
    },
    events: {
        loadConfiguration: "qx.event.type.Data"
    },
    construct: function () {
        var self = this;
        this.base(arguments);

        self.configCliente = {};
        self.empresa_o_flota = null;
        self.geocoder = false;
        
        console.log("0.0.0.1");

        var get = self.getGET();
        if (get) {
            if (self.evalueData(get.token)) {
                if (self.evalueData(window.localStorage.getItem("data_session_get"))) {
                    if (window.localStorage.getItem("data_session_get") != get.token) {
                        qxnw.main.slotSalir();
                        return false;
                    }
                }
                window.localStorage.setItem("data_session_get", get.token);
            }
        }

//        var up = qxnw.userPolicies.getUserData();
        this.loadGoogleMaps("libraries=geometry,places");
//        if (up.profile == "1232") {
        self.clientePermisos();
//        }
//        this.slotCrearVehiculo();
//        this.slotPagos();

//        self.slotMasivos();

//        var newSS = document.createElement('link');
//        newSS.rel = 'stylesheet';
//        newSS.type = 'text/css';
//        newSS.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
//        document.getElementsByTagName("head")[0].appendChild(newSS);

        var version = qxnw.userPolicies.getVersion();
        var styles = "/rpcsrv/css/servicios.css?v=" + version;
        var newSS = document.createElement('link');
        newSS.rel = 'stylesheet';
        newSS.type = 'text/css';
        newSS.href = styles;
        document.getElementsByTagName("head")[0].appendChild(newSS);
//        self.addListener("loadConfiguration", function () {
//            if (up.profile == "1232") {
//                movilmove.utils.initDasboard(self);
//                self.usuarioCentro();
//            } else {
//                movilmove.utils.initPortalClientes(self);
//            }
//        });

//        self.slotTarifaMaestro();
//        self.slotTarifaFija();
//        setTimeout(function () {
//            console.log("self.slotEnrutamiento");
//            self.slotEnrutamiento();
//        }, 3000);
//        self.addListener("appear", function () {
        setTimeout(function () {
            self.start();
////            self.slotConfigModCon();
        }, 3000);

        self.createEncBtns();

        this.slotConfiguracion(function () {
            var config = main.getConfiguracion();
//            if (config.usa_firebase == "SI") {
            self.loadFirebase();
//            }
        });
    },
    destruct: function () {
    },
    statics: {
        addNotificationFirebase: function addNotificationFirebase(array) {
            var p = {};
            p.collection = "notifications";
            p.document = Math.floor((Math.random() * 10000000) + 1);
            for (var item in array) {
                console.log("item", item);
                console.log("ra[item]", array[item]);
                p[item] = array[item];
            }
            nw.firebase.set(p);
        }
    },
    members: {
        menu: null,
        isCreated: null,
        permisos: [],
        permisos_usuario: [],
        createEncBtns: function createEncBtns() {
            var self = this;
            var con = document.querySelector(".toolbar_up");
            if (!con) {
                setTimeout(function () {
                    self.createEncBtns();
                }, 1000);
                return;
            }
            self.containerButtonsEnc = document.createElement("div");
            self.containerButtonsEnc.className = "enc_buttons";
            con.appendChild(self.containerButtonsEnc);
        },
        addBtnInEncBtns: function addBtnInEncBtns(ar) {
            var self = this;
            var con = document.querySelector(".enc_buttons");
            if (!con) {
                setTimeout(function () {
                    self.addBtnInEncBtns(ar);
                }, 1000);
            }

            var div = document.createElement("div");
            div.className = "enc_button " + ar.className;
            div.innerHTML = ar.innerHTML;
            self.containerButtonsEnc.appendChild(div);
        },
        loadFirebase: function loadFirebase() {
            var config = main.getConfiguracion();
            var firebaseActivo = "NO";
            var firebasePruebas = false;
//            var firebasePruebas = "SI";
            if (config.usa_firebase == "SI") {
                firebaseActivo = "SI";
            }
//            if (config.usa_firebase_modo_pruebas != "SI") {
//                firebasePruebas = "NO";
//            }
            var self = this;
//            var up = qxnw.userPolicies.getUserData();
//            var fecha = qxnw.utils.getActualFullDate();
//            console.log("up", up);
            //movilmove services 20nov2023
            var domain = window.location.host;
            console.log("domain", domain);
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
            if (domain == "test.movilmove.com" || domain == "ultimamilla.sitca.co" || domain == "eu.movilmove.com" || domain == "192.168.1.45" || domain == "movilmove.loc") {
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
                qxnw.utils.information("NO puede activar Firebase en este dominio " + domain + ". No autorizado.");
                return false;
            }
            console.log("firebaseConnection", firebasePruebas);
            qxnw.firebase.load(firebaseConfig, function () {
                self.addBtnInEncBtns({
                    className: "enc_button_firebase",
                    innerHTML: "" + domain + " <strong>Realtime Active:</strong> " + firebaseActivo + ". <strong>Realtime Mode:</strong> " + firebasePruebas + ". <strong>Realtime Blocked:</strong> " + config.usa_firebase_account + "."
                });
            });
        },
        registerServiceInFirebase: function registerServiceInFirebase(id) {
            var config = main.getConfiguracion();
            if (config.usa_firebase_account == "NO") {
                return;
            }
            var up = qxnw.userPolicies.getUserData();
            console.log("id", id);
            id = id.toString();
            console.log("id", id);
            var self = this;
            var data = {};
            data.ids = id.split("#");
            data.empresa = up.company;
            console.log("registerInFirebase:::sendData", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
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
                    qxnw.firebase.set(p);

                    console.log("ra.conductores_disponibles", ra.conductores_disponibles);
                    for (var i = 0; i < ra.conductores_disponibles.length; i++) {
                        var con = ra.conductores_disponibles[i];
                        console.log("con", con);

                        var usersAllData = [];
                        var users = [];
                        var da = {};
                        da.usuario = ra.conductor_usuario;
                        da.nombre = ra.conductor;
                        da.foto = ra.conductor_foto;
                        usersAllData.push(da);
                        users.push(ra.conductor_usuario);
                        var room = ra.id;
                        var type = "chat_principal";
                        var message = "Pulsa aquí para ver más opciones.";
                        var title = "#" + ra.id + " (Admin)";
                        self.addChatNotifyFirebase(ra, users, usersAllData, message, room, type, title);

                    }
                    for (var x = 0; x < ra.parada_data.length; x++) {
                        var par = ra.parada_data[x];
                        if (qxnw.utils.evalueData(par.usuario_pasajero)) {
                            var usersAllData = [];
                            var users = [];
                            var da = {};
                            da.usuario = par.usuario_pasajero;
                            da.nombre = par.nombre_pasajero;
//                                da.foto = ra.conductor_foto;
                            usersAllData.push(da);
                            users.push(par.usuario_pasajero);
                            var room = "_parada_" + par.id;
                            var type = "chat";
                            var message = "Pulsa para chatear con el conductor";
                            var title = "#" + ra.id + " (Admin)";
                            if (qxnw.utils.evalueData(ra.conductor)) {
                                title = ra.conductor + " (Driver)";
                            }
                            self.addChatNotifyFirebase(ra, users, usersAllData, message, room, type, title);
                        }
                    }
                }
            };
            rpc.exec("getTravelsForFirebase", data, func);
        },
        addChatNotifyFirebase: function addChatNotifyFirebase(ra, users, usersAllData, message, room, type, title) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();

            var p = {};
            p.collection = "chats";
            p.document = room;
            var fields = {
                all_data_travel: ra,
                id_servicio_fecha: ra.fecha,
                id_servicio_hora: ra.hora,
                id_viaje: ra.id,
                usuarios: users,
                usuarios_more_data: usersAllData,
                title: title,
                description: message,
                type: type,
                empresa: up.company.toString(),
                date: qxnw.utils.getActualFullDate(),
                count: firebase.firestore.FieldValue.increment(1),
                total: firebase.firestore.FieldValue.increment(1)
            };
            for (var i = 0; i < users.length; i++) {
                fields["count_" + qxnw.utils.cleanUserNwC(users[i])] = 1;
                fields["total_" + qxnw.utils.cleanUserNwC(users[i])] = 1;
//                fields["count_" + qxnw.utils.cleanUserNwC(users[i])] = firebase.firestore.FieldValue.increment(1);
//                fields["total_" + qxnw.utils.cleanUserNwC(users[i])] = firebase.firestore.FieldValue.increment(1);
                fields["open_" + qxnw.utils.cleanUserNwC(users[i])] = "NO";
            }
            firebase.firestore().collection(p.collection).doc(p.document).update(fields).then(function () {
                console.log("FIREBASE::UPDATE:: collection: " + p.collection + " document: " + p.document);
            }).catch(function (error) {
                console.error("Error writing document: ", error, p);
//                p.usuarios = firebase.firestore.FieldValue.arrayUnion(rta);
                for (var i = 0; i < users.length; i++) {
                    p["count_" + qxnw.utils.cleanUserNwC(users[i])] = 1;
                    p["total_" + qxnw.utils.cleanUserNwC(users[i])] = 1;
                    p["open_" + qxnw.utils.cleanUserNwC(users[i])] = "NO";
                }
                p.all_data_travel = ra;
                p.usuarios_more_data = usersAllData;
                p.usuarios = users;
                p.empresa = up.company.toString();
                p.id_servicio_fecha = ra.fecha;
                p.id_servicio_hora = ra.hora;
                p.id_viaje = ra.id;
                p.title = title;
                p.description = message;
                p.date = qxnw.utils.getActualFullDate();
                p.type = type;
                p.room = room;
                p.count = 1;
                p.total = 1;
                p.callback = "main.openNotificationFirebase(p)";
                console.log("p", p);
                firebase.firestore().collection(p.collection).doc(p.document).set(p);
            });
            console.log("Chat created!");
        },
        start: function start() {
            console.log("start");
            var self = this;
            var m = self.menuCreateApp.addMenu(self.tr("Cambiar Sede"), "changeTerminal", self, "actions/mail-receive.png");
            var menuStyle = qxnw.config.getMenuStyle();
            if (menuStyle === "vertical") {
                m.set({
                    showArrow: true
                });
            }
        },
        changeTerminal: function changeTerminal() {
            var self = this;
            main.slotConfigModCon();
        },
        slotConfigModCon: function slotConfigModCon(da) {
            var self = this;
            var d = new qxnw.forms();
            d.getChildControl("captionbar").setVisibility("excluded");
            d.setColumnsFormNumber(1);
            var fields = [
                {
                    name: "",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "terminal",
                    label: "Sede",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                }
            ];
            d.setFields(fields);
            var data = {};
            data[""] = self.tr("Seleccione");
            qxnw.utils.populateSelectFromArray(d.ui.terminal, data);
            qxnw.utils.populateSelect(d.ui.terminal, "usuarios", "getTerminales");

            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.ui.accept.addListener("click", function () {
                if (!d.validate()) {
                    return;
                }
                var data = d.getRecord();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios", true);
                var func = function (r) {
                    d.reject();
                    self.cleanStorage();

                    qxnw.utils.information(self.tr("Sede configurada correctamente"), function () {
                        window.location.reload();
                    });
                };
                rpc.exec("configModCon", data, func);
            });
            d.setTitle(self.tr("Configuración de Sede"));
            d.setModal(true);
            d.show();
        },
        cleanStorage: function cleanStorage() {
            localStorage.removeItem("data_session_get");
            localStorage.removeItem("session");
        },

        isCustomer: function isCustomer() {
            var up = qxnw.userPolicies.getUserData();
            if (up.profile == "1232") {
                return true;
            }
            return false;
        },
        evalueData: function evalueData(data) {
            return qxnw.utils.evalueData(data);
//            if (typeof data === "undefined") {
//                return false;
//            }
//            if (data === false || data === "" || data === null) {
//                return false;
//            }
//            if (typeof data === "number") {
//                if (isNaN(parseInt(data))) {
//                    return false;
//                }
//            }
//            return true;
        },
        getDate: function getDate(addMinutos, restMinutos) {
            var now = new Date();
            if (main.evalueData(addMinutos)) {
                now.setMinutes(now.getMinutes() + addMinutos);
            }
            if (main.evalueData(restMinutos)) {
                now.setMinutes(now.getMinutes() - restMinutos);
            }
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            if (month.toString().length == 1) {
                month = '0' + month;
            }
            if (day.toString().length == 1) {
                day = '0' + day;
            }
            return year + '-' + month + '-' + day;
        },
        getDateTime: function getDateTime(addMinutos, restMinutos) {
            var now = new Date();
            if (main.evalueData(addMinutos)) {
                now.setMinutes(now.getMinutes() + addMinutos);
            }
            if (main.evalueData(restMinutos)) {
                now.setMinutes(now.getMinutes() - restMinutos);
            }
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            if (month.toString().length == 1) {
                month = '0' + month;
            }
            if (day.toString().length == 1) {
                day = '0' + day;
            }
            if (hour.toString().length == 1) {
                hour = '0' + hour;
            }
            if (minute.toString().length == 1) {
                minute = '0' + minute;
            }
            if (second.toString().length == 1) {
                second = '0' + second;
            }
            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        },
        newNotificacion: function newNotificacion(array) {
            var self = this;
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            } else {
                if (document.querySelector('.soundNewAddUser')) {
                    document.querySelector('.soundNewAddUser').remove();
                }
                var body = document.querySelector("body");
                var d = document.createElement("audio");
                d.className = "soundNewAddUser";
                d.src = "/nwlib6/audio/2019/point.mp3";
                d.autoplay = "true";
                d.onloadstart = function () {};
                body.appendChild(d);
                d.play();

                var tag = array.title;
                var callback = false;
                if (qxnw.utils.evalueData(array.callback)) {
                    callback = array.callback;
                }
                var notificacion = new Notification(array.title,
                        {
                            tag: tag,
                            icon: array.icon,
                            body: array.body
                        }
                );
                notificacion.onclick = function () {
                    var d = document.querySelector(".soundNewAddUser");
                    if (d) {
                        d.remove();
                    }
                    if (qxnw.utils.evalueData(callback)) {
                        callback();
                    }
                    window.focus();
                }
            }
        },
        alertNotifications: function alertNotifications() {
            var self = this;
            var d = document.querySelector("body");
        },
        slotBookingGetServicesAccept: function slotBookingGetServicesAccept() {
            var self = this;
            var d = new booking.lists.l_booking_getavailableoffers();
            self.addSubWindow("Booking accept services", d);
//            d.maximize();
//            d.setModal(true);
////            d.setWidth(1100);
////            d.setMaxWidth(1100);
////            d.setHeight(800);
////            d.setMaxHeight(800);
//            d.show();
        },
        slotCalendar: function slotCalendar() {
            var self = this;
            var d = new calendar.forms.f_calendar();
            self.addSubWindow("Calendario", d);
//            d.maximize();
//            d.setModal(true);
////            d.setWidth(1100);
////            d.setMaxWidth(1100);
////            d.setHeight(800);
////            d.setMaxHeight(800);
//            d.show();
        },
        slotBookingGetAvailableOffers: function slotBookingGetAvailableOffers() {
            var self = this;
//            var d = new booking.lists.l_booking_getavailableoffers();
            var d = new booking.tree.menu();
            self.addSubWindow("Booking - Transferz", d);
//            d.maximize();
//            d.setModal(true);
////            d.setWidth(1100);
////            d.setMaxWidth(1100);
////            d.setHeight(800);
////            d.setMaxHeight(800);
//            d.show();
        },
//        bookingAcceptOrDeclineTravel: function bookingAcceptOrDeclineTravel(dataTravel, type, callback) {
//            console.log("dataTravel", dataTravel);
//            if (type == "decline") {
//                return main.bookingAcceptOrDeclineTravelExec(dataTravel, type, callback);
//            }
//        },
        bookingCancelTravelForm: function bookingCancelTravelForm(dataTravel, type, callback) {
            var form = new qxnw.forms();
            var up = qxnw.userPolicies.getUserData();
            form.setTitle("Rechazar viaje booking");
//            form.addHeaderNote("<div class='div_title_sed'>Seleccione la sede a la que asignará la administración del viaje</div>");
            var fields = [
                {
                    name: "razon",
                    label: "Razón",
                    type: "selectBox",
                    required: true
                }
            ];
            form.setFields(fields);

            console.log("up", up);

            var data = {};
            data[""] = "Elija";
            data["FARE_TOO_LOW"] = "The fare does not meet your requirements for the given journey details.";
            data["NO_VEHICLE_AVAILABILITY"] = "You do not have any available vehicles at the given pickup time.";
            data["NO_DRIVER_AVAILABILITY"] = "You do not have any available drivers at the given pickup time.";
            data["ADDONS_NOT_AVAILABLE"] = "You cannot accomodate the requested add-ons with the specified vehicle category.";
            data["HOLIDAY"] = "There is no availability due to a (public) holiday(s).";
            data["STRIKE"] = "There is no availability due to a (temporary) strike.";
            data["DISTANCE_TOO_SHORT_OR_LONG"] = "The journey is either too long or short.";
            data["OTHER"] = "Some other reason.";
            qxnw.utils.populateSelectFromArray(form.ui.razon, data);

            form.setModal(true);
            form.show();
            form.ui.cancel.addListener("execute", function () {
                form.reject();
            });
            form.ui.accept.addListener("execute", function () {
                var dat = form.getRecord();
                console.log("dat", dat);
//                console.log("dtaPoints", dtaPoints);
                if (!form.validate()) {
                    return false;
                }
                form.reject();
                dataTravel.reason = dat.razon;
                dataTravel.description = dat.razon_text;
                main.bookingAcceptOrDeclineTravelExec(dataTravel, type, callback);
            });
        },
        bookingAcceptTravelForm: function bookingAcceptTravelForm(dataTravel, type, callback) {
            var form = new qxnw.forms();
            var up = qxnw.userPolicies.getUserData();
            form.setTitle("Terminar a asignar viaje booking");
//            form.addHeaderNote("<div class='div_title_sed'>Seleccione la sede a la que asignará la administración del viaje</div>");
            var fields = [
                {
                    name: "terminal",
                    label: "Sede",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "meetingPoint",
                    label: "Punto de encuentro",
                    type: "selectBox"
                }
            ];
            form.setFields(fields);

            console.log("up", up);

            var data = {};
            data[""] = "Elija";
            qxnw.utils.populateSelectFromArray(form.ui.terminal, data);
            qxnw.utils.populateSelectFromArray(form.ui.meetingPoint, data);

            var data = {
                table: "terminales",
                where: "empresa=" + up.company
            };
            qxnw.utils.populateSelect(form.ui.terminal, "master", "populate", data);

//            var dtaPoints = {};

            if (dataTravel.meetingPointRequired === true) {
                if (dataTravel.meetingPoints.length > 0) {

                    for (var i = 0; i < dataTravel.meetingPoints.length; i++) {

                        var rt = dataTravel.meetingPoints[i];

                        var data = {};
                        data[rt.id + "-" + rt.type] = rt.title + " - " + rt.description;
                        qxnw.utils.populateSelectFromArray(form.ui.meetingPoint, data);

                    }

                    form.setRequired(form.ui.meetingPoint, true);
                    form.ui.meetingPoint.setRequired(true);
                }
            }

//            form.ui.meetingPoint.addListener("changeValue", function (e) {
////            var data = self.form.getRecord();
////            console.log("fecha:::data", data);
//                var val = this.getValue();
//                console.log("fecha:::changeValue:::val", val);
//                dtaPoints = val;
//            });

//            d.maximize();
            form.setModal(true);
//            form.setWidth(1100);
//            form.setMaxWidth(1100);
//            form.setHeight(800);
//            form.setMaxHeight(800);
            form.show();

            form.ui.cancel.addListener("execute", function () {
                form.reject();
            });
            form.ui.accept.addListener("execute", function () {
                var dat = form.getRecord();
                console.log("dat", dat);
//                console.log("dtaPoints", dtaPoints);
                if (!form.validate()) {
                    return false;
                }
                if (dataTravel.meetingPointRequired === true) {
                    if (!qxnw.utils.evalueData(dat.meetingPoint)) {
                        qxnw.utils.information("Seleccione el punto de encuentro");
                        return false;
                    }
                }
                form.reject();
                dataTravel.terminal = dat.terminal;
                if (dataTravel.meetingPointRequired === true) {
                    dataTravel.meetingPointId = dat.meetingPoint.split("-")[0];
                    dataTravel.meetingPointIdType = dat.meetingPoint.split("-")[1];
                }
                main.bookingAcceptOrDeclineTravelExec(dataTravel, type, callback);
            });
        },
        bookingAcceptOrDeclineTravelExec: function bookingAcceptOrDeclineTravelExec(dataTravel, type, callback) {
            console.log("dataTravel", dataTravel);
            var up = qxnw.userPolicies.getUserData();
            console.log("up", up);
            var self = this;
            var config = main.getConfiguracion();
            var data = {};
            data.id = dataTravel.id;
            data.terminal = dataTravel.terminal;
            data.empresa = up.company;
            data.type = type;
            data.key = config.booking_key;
            data.url_endpoint = config.booking_url_endpoint;
            if (qxnw.utils.evalueData(dataTravel.meetingPointId)) {
                data.meetingPointId = dataTravel.meetingPointId;
            }
            if (qxnw.utils.evalueData(dataTravel.meetingPointIdType)) {
                data.meetingPointIdType = dataTravel.meetingPointIdType;
            }
            if (qxnw.utils.evalueData(dataTravel.reason)) {
                data.reason = dataTravel.reason;
            }
            if (qxnw.utils.evalueData(dataTravel.description)) {
                data.description = dataTravel.description;
            }
//            if (dataTravel.meetingPointRequired === true) {
//                data.meetingPointId = dataTravel.meetingPoints[0].id;
//                data.meetingPointIdType = dataTravel.meetingPoints[0].type;
//            }
            console.log("bookingAcceptOrDeclineTravel:::dataSend::data", data);
//            return;
            qxnw.utils.loadingnw("Conectándose a Booking (getAvailableOffers)... Por favor espere...", "cargando_axtest");
            var rpc = new qxnw.rpc(self.getRpcUrl(), "booking");
            rpc.setAsync(true);
//            rpc.setShowLoading(true);
            rpc.setAsync(true);
            var func = function (res) {
                console.log("bookingAcceptOrDeclineTravel:::responseServer::res", res);
                console.log("bookingAcceptOrDeclineTravel:::responseServer::typeof res", typeof res);
                qxnw.utils.loadingnw_remove("cargando_axtest");
                var msgerr = "Ha ocurrido un error, console error.";
                var error = false;
                if (!qxnw.utils.evalueData(res)) {
                    if (type != "decline") {
                        error = true;
                    }
                }
                if (qxnw.utils.evalueData(res)) {
                    if (typeof res == "object") {
                        if (typeof res.error !== "undefined") {
                            error = true;
                            console.log("res.error", res.error)
                            console.log("typeof res.error", typeof res.error)
                            if (typeof res.error == "string") {
                                msgerr += " Error: " + res.error;
                            }
                        }
                    }
                }
                if (error) {
                    qxnw.utils.information(msgerr);
                } else {
                    if (type == "accept") {
                        qxnw.utils.information("Viaje aceptado correctamente.");
                    } else
                    if (type == "decline") {
//                        qxnw.utils.information("Viaje rechazado correctamente.");
                    }
                }
                if (typeof callback !== "undefined") {
                    callback(res);
                }
            };
            rpc.exec("acceptOrDecline", data, func);

        },
        slotParadasAdicionales: function slotParadasAdicionales(r, mode) {
            var self = this;
            var d = new transmovapp.lists.l_paradas_adicionales(r);
            if (mode == "popup") {
                d.maximize();
                d.show();
            } else {
                self.addSubWindow("Informe abordaje", d);
            }
        },
        slotConfiguracionMaestro: function slotConfiguracionMaestro() {
            var self = this;
            var d = new maestros.forms.f_configuracion();
            d.show();
        },
        slotTarifaMaestro: function slotTarifaMaestro() {
            var self = this;
            var d = new maestros.lists.l_tarifas();
            self.addSubWindow("Tarifas", d);
//            d.show();
        },
        slotTarifaFija: function slotTarifaFija() {
            var self = this;
            var d = new maestros.lists.l_tarifas_fijas();
            self.addSubWindow("Tarifas fijas", d);
//            d.show();
        },
        slotPagos: function slotPagos() {
            var self = this;
            var d = new transmovapp.lists.l_pagos();
            self.addSubWindow("Pagos", d);
        },
        slotCodigos: function slotCodigos() {
            var self = this;
            var d = new transmovapp.lists.l_codigos();
            self.addSubWindow("Códigos Promocionales", d);
        },
        slotSoporte: function slotSoporte() {
            var self = this;
            var d = new transmovapp.lists.l_soporte();
            self.addSubWindow("Soporte", d);
        },
        slotCodigosPromocionales: function slotCodigosPromocionales() {
            var self = this;
            var d = new qxnw.lists();
//            d.setAllPermissions(true);
            d.setTableMethod("master");
            d.createFromTable("edo_cupones");
            d.ui.deleteButton.setVisibility("excluded");
            self.addSubWindow(this.tr("Códigos promocionales"), d);
            return;
        },
        slotServicios: function slotServicios() {
            var self = this;

            self.slotEnrutamiento();
            return;

            var d = new transmovapp.lists.l_servicios();
            d.setParamRecord();
            self.addSubWindow("Servicios", d);
        },
        slotServiciosTotales: function slotServiciosTotales() {
            var self = this;
            var d = new transmovapp.lists.l_servicios_totales();
//            var d = new transmovapp.lists.l_servicios_totales_v2();
            d.setParamRecord();
            self.addSubWindow("Histórico viajes", d);
        },
        slotUsuarios: function slotUsuarios() {
            var self = this;
            var table = "usuarios";
            var d = new transmovapp.lists.l_operarios(table);
            d.applyFilters(table);
            self.addSubWindow("Usuarios ADMIN", d);
        },
        slotEdo_novedades: function slotEdo_novedades() {
            var self = this;
            var d = new qxnw.lists();
            d.setTableMethod("master");
            d.createFromTable("edo_novedades");
            d.serialColumn("id");
            self.addSubWindow("Novedades", d);
        },
        slotEmpresas: function slotEmpresas() {
            var self = this;
            var d = new transmovapp.lists.l_empresas_flotas();
            self.addSubWindow("Empresas / Flotas", d);
        },
        slotEmpresas2: function slotEmpresas2() {
            var self = this;
            var d = new transmovapp.lists.l_clientes(true);
            self.addSubWindow("Clientes / Contratos", d);
        },
        slotUsuariosApp: function slotUsuariosApp() {
            var self = this;
            var d = new usuarios_app.lists.l_usuarios();
            self.addSubWindow("Users pax drivers APP", d);
        },
        slotMasivos: function slotMasivos() {
            var self = this;
            var d = new transmovapp.forms.f_masivos();
            d.setParamRecord();
            d.show();
//            self.addSubWindow("Comunicaciones", d);
        },
        slotConductores: function slotConductores() {
            var self = this;
            var d = new transmovapp.lists.l_conductor();
            d.setParamRecord();
            self.addSubWindow("Conductores", d);
        },
        iconEstadoDriverByData: function iconEstadoDriverByData(data) {
            var self = this;
            var icon = "/lib_mobile/driver/img/pindriver_libre_desconectado.png";
            var d = self.estadoDriverByData(data);
            //ocupado y desconectado
            if (!d.estado_boolean && !d.conectado_boolean) {
                icon = "/lib_mobile/driver/img/pindriver_ocupado_desconectado.png";
            }
            //ocupado y conectado
            if (!d.estado_boolean && d.conectado_boolean) {
                icon = "/lib_mobile/driver/img/pindriver_ocupado_conectado.png";
            }
            //libre y desconectado
            if (d.estado_boolean && !d.conectado_boolean) {
                icon = "/lib_mobile/driver/img/pindriver_libre_desconectado.png";
            }
            //libre y conectado
            if (d.estado_boolean && d.conectado_boolean) {
                icon = "/lib_mobile/driver/img/pindriver_libre_conectado.png";
            }
            return icon;
        },
        estadoDriverByData: function estadoDriverByData(data) {
            console.log("data", data);
            var estado = "Libre";
            var estado_boolean = true;
//            data.offline // online
//            data.ocupado // SI NO
//            data.fecha_ultima_conexion

            var conectado = "Desconectado";
            var conectado_boolean = false;
            if (qxnw.utils.evalueData(data.fecha_ultima_conexion)) {
                var hoy = qxnw.utils.getActualFullDate();

                var minutes = -5;
                var fecha = qxnw.utils.addMinutes(hoy, minutes);
                console.log("fecha", fecha);
                var date = qxnw.utils.getActualFullDate(false, fecha);
                console.log("date", date);
                console.log("data.fecha_ultima_conexion", data.fecha_ultima_conexion);
                if (data.fecha_ultima_conexion > date) {
                    conectado = "En línea";
                    conectado_boolean = true;
                }
            }

            var servicios_apagados = "Activo";
            var servicios_apagados_boolean = true;
            if (data.offline == "offline") {
                servicios_apagados = "Apagado";
                servicios_apagados_boolean = false;
            }
            if (data.ocupado == "SI") {
                estado = "Ocupado";
                estado_boolean = false;
            }

            var todo_in_html = "<span class='statusdri statusdri_estado statusdri_estado_" + estado_boolean + "'>" + estado + "</span>";
            todo_in_html += " <span class='statusdri statusdri_conectado statusdri_conectado_" + conectado_boolean + "'>" + conectado + "</span>";
            todo_in_html += " <span class='statusdri statusdri_servapag statusdri_servapag_" + servicios_apagados_boolean + "'>" + servicios_apagados + "</span>";

            var rta = {};
            rta.estado = estado;
            rta.estado_boolean = estado_boolean;
            rta.conectado = conectado;
            rta.conectado_boolean = conectado_boolean;
            rta.servicios_apagados = servicios_apagados;
            rta.servicios_apagados_boolean = servicios_apagados_boolean;
            rta.todo = estado + " " + conectado + " " + servicios_apagados;
            rta.todo_in_html = todo_in_html;
            return rta;
        },
        slotMapaConductores: function slotMapaConductores() {
            var self = this;
//            var d = new transmovapp.forms.f_mapa_conductores();
//            d.slotUbicaciones();
            var d = new transmovapp.tree.mapa_conductores(false);
//            d.maximize();
//            d.show();
            self.addSubWindow("Mapa de conductores", d);
        },
        slotEnrutamiento: function slotEnrutamiento() {
            var self = this;
            main.slotEnrutamientoMasivo();
//            var d = new maestros.lists.l_enrutamiento();
//            d.setParamRecord();
//            self.addSubWindow("Enrutamiento", d);
        },
        slotEnrutamientoMasivo: function slotEnrutamientoMasivo() {
            var self = this;
            var d = new enrutamiento.tree.enrutamiento();
//            self.addSubWindow("Enrutamiento masivo", d);
            d.maximize();
            d.show();
        },
        slotPreoperacional: function slotPreoperacional(data) {
            var self = this;
            var config = main.getConfiguracion();

            if (config.usar_preoperacional_dynamic == "SI") {
                var options = {
                    textAccept: "New",
                    textAcceptMaxWidth: 250,
                    textCancel: "Old",
                    textCancelMaxWidth: 250,
                    containerWidth: 600
                };
                var colSpan = 4;
                qxnw.utils.question("<h2>Preoperacional,</h2> Seleccione la versión que desea consultar.", function (e) {
                    if (e) {
                        var d = new transmovapp.lists.l_preoperacional_new(data);
                        if (!qxnw.utils.evalueData(data)) {
                            self.addSubWindow("Preoperacional informe", d);
                        } else {
                            d.show();
                        }
                    } else {
                        var d = new transmovapp.lists.l_preoperacional(data);
                        if (!qxnw.utils.evalueData(data)) {
                            self.addSubWindow("Preoperacional informe", d);
                        } else {
                            d.show();
                        }
                    }
                }, false, colSpan, options);
                return;
            }

            var d = new transmovapp.lists.l_preoperacional(data);
            if (!qxnw.utils.evalueData(data)) {
                self.addSubWindow("Preoperacional informe", d);
            } else {
                d.show();
            }
        },
        slotOperariosGO: function slotOperariosGO() {
            var self = this;
            var d = new transmovapp.lists.l_operarios();
            d.setParamRecord();
            self.addSubWindow("Operarios", d);
        },
        slotVehiculos: function slotVehiculos() {

            var self = this;
            var d = new transmovapp.lists.l_vehiculos();
            d.setParamRecord();
            self.addSubWindow("Vehículos", d);
        },
        slotPermisos: function slotPermisos(r, callback_end) {
            var self = this;
            var form = new qxnw.forms();
            form.setTitle("Permisos");
            var fields = [
                {
                    name: "id",
                    label: "ID",
                    caption: "id",
                    type: "textField",
                    required: true,
                    visible: false
                },
                {
                    name: "Permisos Generales",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "filtrar_por_terminal",
                    label: "Filtrar por terminal",
                    type: "checkBox"
                },
                {
                    name: "filtrar_por_flota",
                    label: "Filtrar por flota",
                    type: "checkBox"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: "Permisos Módulo Conductores",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "eliminar_conductores",
                    label: "Eliminar",
                    type: "checkBox"
                },
                {
                    name: "activar_inactivar",
                    label: "Activar e Inactivar",
                    type: "checkBox"
                },
                {
                    name: "rechazar",
                    label: "Rechazar",
                    type: "checkBox"
                },
//                {
//                    name: "administrar_saldo",
//                    label: "Administrar Saldo",
//                    type: "checkBox"
//                },
//                {
//                    name: "tope_saldo",
//                    label: "Saldo para recargar",
//                    type: "textField"
//                },
                {
                    name: "enviar_correo",
                    label: "Enviar Correo",
                    type: "checkBox"
                },
                {
                    name: "form_conductor_flota",
                    label: "Editar flota",
                    type: "checkBox"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: "Permisos Módulo Vehículos",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "rechazar_aprobar_vehiculos",
                    label: "Rechazar y Aprobar",
                    type: "checkBox"
                },
                {
                    name: "eliminar_vehiculos",
                    label: "Eliminar vehículo",
                    type: "checkBox"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: "Permisos Módulo usuarios app",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "eliminar_usuarios_app",
                    label: "Eliminar usuarios de app",
                    type: "checkBox"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: "Permisos Módulo Servicios",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "cancelar_servicios",
                    label: "Cancelar",
                    type: "checkBox"
                },
                {
                    name: "finalizar_servicios",
                    label: "Finalizar Servicios",
                    type: "checkBox"
                },
                {
                    name: "ver_precios",
                    label: "Ver precios",
                    type: "checkBox"
                },
                {
                    name: "ver_placa_servicio",
                    label: "Ver placa servicio",
                    type: "checkBox"
                },
                {
                    name: "ve_mapa_conductores",
                    label: "Ve mapa conductores",
                    type: "checkBox"
                },
                {
                    name: "ve_fuec",
                    label: "Ve FUEC",
                    type: "checkBox"
                },
                {
                    name: "ve_novedades_reportadas",
                    label: "Ve novedades reportadas",
                    type: "checkBox"
                },
                {
                    name: "crear_servicios",
                    label: "Crear servicios",
                    type: "checkBox"
                },
                {
                    name: "ver_booking",
                    label: "Ver Booking",
                    type: "checkBox"
                },
                {
                    name: "ver_calendario",
                    label: "Ver Calendario",
                    type: "checkBox"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: "Permisos Módulo Servicios menú",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "ve_voucher",
                    label: "Ve voucher",
                    type: "checkBox"
                },
                {
                    name: "ve_cartel_vuelo",
                    label: "Ve cartel vuelo",
                    type: "checkBox"
                },
                {
                    name: "ve_no_show",
                    label: "Ve informe de No presentación a viaje (No Show)",
                    type: "checkBox"
                },
                {
                    name: "editar_servicios",
                    label: "Editar servicios",
                    type: "checkBox"
                },
                {
                    name: "asignar_conductor",
                    label: "Asignar conductores",
                    type: "checkBox"
                },
                {
                    name: "ve_informe_abordaje",
                    label: "Ve informe abordaje",
                    type: "checkBox"
                },
                {
                    name: "cambiar_estados_viaje",
                    label: "Cambiar estados",
                    type: "checkBox"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                }
//                ,
//                {
//                    name: "Permisos Módulo Crear viaje",
//                    type: "startGroup",
//                    icon: "",
//                    mode: "horizontal"
//                },
//                {
//                    name: "fields_crear_viaje",
//                    label: "Campos crear viaje (JSON)",
//                    type: "textArea"
//                },
//                {
//                    name: "",
//                    type: "endGroup",
//                    icon: ""
//                }
            ];
            form.setFields(fields);
            form.show();
            form.ui.id.setValue(r.id.toString());
//            form.setFieldVisibility(form.ui.tope_saldo, "excluded");
//            form.ui.administrar_saldo.addListener("changeValue", function () {
//                var data = this.getValue();
//                console.log(data);
//                if (data == "false" || data == false) {
//                    form.setFieldVisibility(form.ui.tope_saldo, "excluded");
//                } else {
//                    form.setFieldVisibility(form.ui.tope_saldo, "visible");
//                }
//            });
            form.ui.cancel.addListener("execute", function () {
                form.reject();
            });
            form.ui.accept.addListener("execute", function () {
                var dat = form.getRecord();
                var data = {};
                console.log(data);
                data.id = dat.id;
                data.permisos = JSON.stringify(dat);
//                data.tope_saldo = dat.tope_saldo;
                console.log(data);
                var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas");
                rpc.setAsync(true);
                var func = function () {
                    qxnw.utils.information("Permisos guardados correctamente");
                    form.accept();
                    callback_end();
                };
                rpc.exec("permisosClientes", data, func);
            });

            console.log("rrrr", r);
            if (qxnw.utils.evalue(r.permisos)) {
                var data = JSON.parse(r.permisos);
                console.log(data);
                form.setRecord(data);
            }
        },
        slotConfiguracion: function slotConfiguracion(callback) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var data = {};
            data.empresa = up.company;
            console.log("slotConfiguracion:::dataSendServer:::data", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios", true);
            rpc.setShowLoading(true);
            var func = function (r) {
                console.log("slotConfiguracion:::responseServer:::r", r);
                if (!r) {
                    var text = "No existe configuración en Movilmove (edo_conf) para esta empresa (ID: " + up.company + "). Consulte con el administrador del sistema.";
                    text += "¿Desea crear uno por defecto?";
                    qxnw.utils.question(text, function (e) {
                        if (e) {
                            self.slotConfiguracionCopyInitial();
                        } else {
                            main.slotSalir();
                        }
                    });
                    return false;
                }
                if (qxnw.utils.evalue(r)) {
                    self.fireDataEvent("loadConfiguration");
                    console.log('ingresa a la consulta', r);
                    self.setConfiguracion(r);
//                    qxnw.utils.stopLoading();
                }
                if (typeof callback != "undefined") {
                    callback();
                }
            };
            rpc.exec("consultaConfiguracion", data, func);
        },
        slotConfiguracionCopyInitial: function slotConfiguracionCopyInitial() {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var data = {};
            var rpc = new qxnw.rpc(self.getRpcUrl(), "usuarios", true);
            rpc.setShowLoading(true);
            var func = function (r) {
                console.log("slotConfiguracionCopyInitial:::responseServer:::r", r);
                qxnw.utils.information("¡Configuración creada correctamente!", function () {
                    window.location.reload();
                });
            };
            rpc.exec("permisosGeneralesCopiarInitial", data, func);
        },
        clientePermisos: function clientePermisos() {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            console.log("clientePermisos:::dataSendServer", up);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas", true);
            var func = function (r) {
                console.log("clientePermisos:::responseServer", r);
                if (qxnw.utils.evalue(r)) {
                    if (qxnw.utils.evalue(r.permisos)) {
                        var data = JSON.parse(r.permisos);
                        self.setPermiserv(data);
                        console.log("clientePermisos:::data", data);
                        main.permisos_usuario = data;
                    }
                    main.empresa_o_flota = r.bodega;
//                    if (r.tipo_empresa) {
//                        self.setTipoempresa(r.tipo_empresa);
//                    }
                } else {
                    qxnw.utils.information("Su usuario no está asociado con ninguna empresa, verifique con el administrador del sistema");
                }
            };
            rpc.exec("consultaClientesPermisos", up, func);
        },
        usuarioCentro: function usuarioCentro() {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "empresas", true);
            var func = function (r) {
                console.log(r);
                if (qxnw.utils.evalue(r)) {
                    if (qxnw.utils.evalue(r)) {
                        self.setUsercc(r);
                    }
                }
            };
            rpc.exec("userCentroCostos", up.code, func);
        },
        readMessage: function readMessage(data) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin", true);
            var func = function (r) {
                if (qxnw.utils.evalue(r)) {

                }
            };
            rpc.exec("readMessage", data, func);
        },
        sendNotificacion: function sendNotificacion(array, callback) {
            var self = this;
            var config = main.getConfiguracion();
            var key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';//nwMaker (alexf) la de siempre
            if (qxnw.utils.evalueData(config.keyGoogleNotificacionPush) && !qxnw.utils.evalueData(array.key)) {
                setTimeout(function () {
                    var sendData = array;
                    sendData.key = config.keyGoogleNotificacionPush;
                    main.sendNotificacion(sendData, callback);
                }, 1000);
            }
            if (qxnw.utils.evalueData(array.key)) {
                key = array.key;
            }
            console.log("sendNotificacion:::key", key);
            console.log("sendNotificacion:::array", array);

            console.log("%cOK:::sendNotificationTo:::" + array.to + ">>>>", 'background: #ff3366; color: #fff');

            var to = array.to;
            var notification = {
                'title': array.title,
                'body': array.body,
                'sound': array.sound,
                'icon': array.icon,
                'click_action': array.callback,
                "priority": "high",
                "content_available": true,
                "show_in_foreground": true
            };
            fetch('https://fcm.googleapis.com/fcm/send', {
                'method': 'POST',
                "content_available": true,
                'headers': {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'notification': notification,
                    "show_in_foreground": true,
                    "content_available": true,
                    'priority': 'high',
                    'to': to,
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
            });
        },
        labels: function labels(fields, destino) {
            var self = this;
            if (!qxnw.utils.evalue(destino)) {
                destino = false;
            }
            var up = qxnw.userPolicies.getUserData();
            var domain = window.location.host;
            if (domain !== "rmovil.gruponw.com" && domain !== "rmovil.movilmove.com") {
                return fields;
            }
            //rmovil
            var lab = [
                {
                    name: "antecedentes_judiciales",
                    label: self.tr("Antecedentes no penales")
                },
                {
                    name: "tarjeta_propiedad",
                    label: self.tr("Tarjeta de circulación")
                },
                {
                    name: "nit",
                    label: self.tr("C.U.R.P.")
//                    ,
//                    mode: "maxCharacteres:17"
                },
                {
                    name: "foto_soat",
                    label: self.tr("Foto de póliza de seguro")
                },
                {
                    name: "fecha_vencimiento_soat",
                    label: self.tr("Fecha vencimiento póliza de seguro")
                },
                {
                    name: "hoja_vida",
                    required: false
                },
                {
                    name: "fecha_vencimiento_tegnomecanica",
                    required: false
                }
            ];
            if (destino == "empresas") {
                var lab = [
                    {
                        name: "nit",
                        label: self.tr("RFC")
                    }
                ]
            }
            for (var i = 0; i < fields.length; i++) {
                for (var j = 0; j < lab.length; j++) {
                    if (typeof fields[i].name !== 'undefined') {
                        if (lab[j].name == fields[i].name) {
                            if (typeof lab[j].label !== 'undefined') {
                                fields[i].label = lab[j].label;
                                fields[i].placeholder = lab[j].label;
                            }
                            if (typeof lab[j].required !== 'undefined') {
                                fields[i].required = lab[j].required;
                            }
                            console.log(fields[i].mode)
                            if (typeof lab[j].mode !== 'undefined') {
                                fields[i].mode = lab[j].mode;
                            }
                        }
                    }
                    if (typeof fields[i].caption !== 'undefined') {
                        if (lab[j].name == fields[i].caption) {
                            if (typeof lab[j].label !== 'undefined') {
                                fields[i].label = lab[j].label;
                            }
                        }
                    }
                }
            }
            return fields;
        },
        autocomplete: function autocomplete(inputs, map, callback) {
            var self = this;
            if (!qxnw.utils.isOnline()) {
                console.log("Compruebe su conexión a internet.");
                return false;
            }
            var config = main.getConfiguracion();
            var input = document.querySelector(inputs);

            console.log("config.paises_iso_relation_autocomplete_maps", config.paises_iso_relation_autocomplete_maps);
            var options = {}; //CO es el ISO de Colombia};
//            options.componentRestrictions = {country: "CO"};
            options.strictBounds = false;
            console.log("options", options);

            var autocomplete = new google.maps.places.Autocomplete(input, options);
//            autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
            autocomplete.setFields(['formatted_address', 'adr_address', 'geometry', 'name']);

            if (qxnw.utils.evalueData(config.paises_iso_relation_autocomplete_maps)) {
                var countries = JSON.parse(config.paises_iso_relation_autocomplete_maps);
                console.log("countries", countries);
                autocomplete.setComponentRestrictions({
//                    country: ["us", "pr", "vi", "gu", "mp"]
                    country: countries
                });
            }
            autocomplete.setOptions({strictBounds: false});

            autocomplete.addListener('place_changed', function () {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    qxnw.utils.information("No details available for input: '" + place.name + "'");
                    return;
                }
                console.log("place", place);
//            var address = place.formatted_address;
                var address = place.name + " " + place.formatted_address;
                var bt = place.adr_address;
                console.log("bt", bt);

                var countryName = self.getPlaceByHtml(bt, "country-name");
                console.log("countryName", countryName);

                var region = self.getPlaceByHtml(bt, "region");
                console.log("region", region);

                var ciudad = self.getPlaceByHtml(bt, "locality");
                console.log("ciudad", ciudad);

                var streetAddress = self.getPlaceByHtml(bt, "street-address");
                console.log("streetAddress", streetAddress);

                var postalCode = self.getPlaceByHtml(bt, "postal-code");
                console.log("postalCode", postalCode);

                if (!qxnw.utils.evalueData(ciudad) && qxnw.utils.evalueData(region)) {
                    ciudad = region;
                }
                console.log("ciudad", ciudad);

                var type = "";
                if (address.toLowerCase().indexOf("airport") != -1 || address.toLowerCase().indexOf("aeropuerto") != -1) {
                    console.log("address", address);
                    console.log("address.airport", address.toLowerCase().indexOf("airport"));
                    console.log("address.aeropuerto", address.toLowerCase().indexOf("aeropuerto"));
                    type = "airport";
                }

                var rta = {};
                rta.address = address;
                rta.direccion = address;
                rta.ciudad = ciudad;
                rta.pais = countryName;
                rta.type = type;
                rta.postalCode = postalCode;
                rta.region = region;
                rta.location = place.geometry.location;
                callback(rta);
            });

            var classRand = "loading_" + qxnw.utils.createRandomId();
            input.classRandAuto = "." + classRand;
//            $(input).after("<div class='loadingAutocomplete " + classRand + "' style='display: none;'>Buscando...</div>");
            var timeWait = 1500;
            self.intervalInput = null;
            input.addEventListener("input", nonePassiveHandler, false);
            function nonePassiveHandler(event) {
                console.log("input");
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();

//                $(".pac-container").removeClass("pac-container-hidde");
//                $(".pac-container").addClass("pac-container-hidde");
                var loa = document.querySelector(this.classRandAuto);
                if (loa) {
                    loa.style.display = "block";
                }
                clearTimeout(self.intervalInput);
                self.intervalInput = setTimeout(function () {
                    console.log("start input show!!!!!!!!!!!!!!!!!!");
//                    google.maps.event.trigger($(input)[0], 'focus', {});
                    google.maps.event.trigger(input, 'focus', {});
//                    $(".pac-container").removeClass("pac-container-hidde");
                    if (loa) {
                        loa.style.display = "none";
                    }
                }, timeWait);
            }
        },
        getPlaceByHtml: function getPlaceByHtml(bt, place) {
            var one = bt.split('class="' + place + '">');
            if (qxnw.utils.evalueData(one[1])) {
                var two = one[1].split("</span");
                if (qxnw.utils.evalueData(two[0])) {
                    return two[0];
                }
            }
            return false;
        },
        extraerDataResult: function extraerDataResult(results) {
            var self = this;
            var data = {};
            var a = self.getDataResult(results);
//        console.log(a);
            data.address_components = a;
            data["address"] = results.formatted_address;
            data["direccion"] = results.formatted_address;
            data["barrio"] = a.neighborhood;
            data["localidad"] = a.sublocality;
            var pais = "";
            var address = results.address_components;
            //recorremos todos los elementos de address
            for (var p = address.length - 1; p >= 0; p--) {
                //si es un pais
                if (address[p].types.indexOf("country") !== -1) {
                    var v = address[p].long_name;
                    if (v !== undefined) {
                        pais = v;
                    }
                }
            }
            var ciudad = "";
            //recorremos todos los elementos de address
            address.reverse();
            for (var p = address.length - 1; p >= 0; p--) {
                //si es una ciudad 
                if (address[p].types.indexOf("locality") !== -1) {
                    var v = address[p].long_name;
                    if (v !== undefined) {
                        ciudad = v;
                    }
                }
                if (ciudad === "") {
                    //si es una ciudad de nivel 2
                    if (address[p].types.indexOf("administrative_area_level_1") !== -1) {
                        var v = address[p].long_name;
                        if (v !== undefined) {
                            ciudad = v;
                        }
                    }
                    if (address[p].types.indexOf("administrative_area_level_2") !== -1) {
                        var v = address[p].long_name;
                        if (v !== undefined) {
                            ciudad = v;
                        }
                    }
                }
            }
            var poblacion = "";
//recorremos todos los elementos de address
            for (var p = address.length - 1; p >= 0; p--) {
                //si es una población
                if (address[p].types.indexOf("administrative_area_level_1") !== -1) {
                    var v = address[p].long_name;
                    if (v !== undefined) {
                        poblacion = v;
                    }
                }
            }
            data.poblacion = poblacion;
            data.ciudad = ciudad;
//        data.ciudad = a.locality;
//        data["pais"] = a.country;
            data.pais = pais;
            data.allData = results;
            return data;
        },
        getDataResult: function getDataResult(results) {
            var re = results;
            var d = re.address_components;
            var total = d.length;
            var r = {};
            for (var i = 0; i < total; i++) {
                var x = d[i];
                var val = x.long_name;
                var t = x.types;
                for (var y = 0; y < t.length; y++) {
                    var g = t[y];
                    if (g == "political") {
                        continue;
                    }
                    r[g] = val;
                }
            }
            if (typeof r.route != "undefined") {
                if (typeof r.route.split(" ")[0] != "undefined") {
                    r.mode = r.route.split(" ")[0];
                }
                if (typeof r.route.split(" ")[1] != "undefined") {
                    r.mode_number = r.route.split(" ")[1];
                }
            }
            if (results.length > 1) {
                var d = results[1].address_components;
                var total = d.length;
                for (var i = 0; i < total; i++) {
                    var x = d[i];
                    var val = x.long_name;
                    var t = x.types;
                    for (var y = 0; y < t.length; y++) {
                        var g = t[y];
                        if (typeof r.neighborhood == "undefined" && g == "neighborhood" || typeof r.sublocality == "undefined" && g == "sublocality" || typeof r.sublocality_level_1 == "undefined" && g == "sublocality_level_1") {
                            r[g] = val;
                        }
                    }
                }
            }
            return r;
        },
        formatoFecha: function formatoFecha(fecha, formato) {
            var dia = fecha.getDate();
            var mes = fecha.getMonth() + 1;
            var anio = fecha.getFullYear();
            if (mes.toString().length == 1) {
                mes = "0" + mes.toString();
            }
            return anio + "-" + mes + "-" + dia;
        },
        getDataOfDirection: function getDataOfDirection(data, callback) {
            var self = this;
            if (!qxnw.utils.evalueData(self.geocoder)) {
                self.geocoder = new google.maps.Geocoder();
            }

            var pattern = /[\^*@'",.“‘'\'/')(⁰°|!"$%/()=?¡!¿'\\]/gi;
            data.direccion = data.direccion.toString().replace(pattern, '');

            var direccion = data.direccion + ' ' + data.pais + ' ' + data.ciudad;
            self.geocoder.geocode({"address": direccion}, function (results, status) {
                console.log("google.maps.GeocoderStatus", google.maps.GeocoderStatus);
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log("dirección " + direccion + " OK");
                    console.log("results[0].geometry.location.lat()", results[0].geometry.location.lat());
                    console.log("results[0].geometry.location.lng()", results[0].geometry.location.lng());
                    data.latitud = results[0].geometry.location.lat();
                    data.longitud = results[0].geometry.location.lng();
                    callback(data);
                } else {
                    console.log("dirección " + direccion + " ERROR");
                    data.latitud = "0";
                    data.longitud = "0";
                    callback(data);
                }

            });
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
        str_replace: function (fields, fieldsChange, variable) {
            var replace = fields;
            var re = new RegExp(replace, "g");
            var str = variable.replace(re, fieldsChange);
            return str;
        },
        getGET: function (url) {
            return qxnw.utils.getGET(url);
//            var loc = document.location.href;
//            if (typeof url !== "undefined") {
//                loc = url;
//            }
//            var getString = loc.split('?')[1];
//            if (getString == undefined) {
//                return false;
//            }
//            var GET = getString.split('&');
//            var get = {};
//            for (var i = 0, l = GET.length; i < l; i++) {
//                var tmp = GET[i].split('=');
//                get[tmp[0]] = unescape(decodeURI(tmp[1]));
//            }
//            return get;
        },
        distance: function (lat1, lng1, lat2, lng2) {
//        var center = {"lat": lat1, "lng": lng1};
//        var newValue = {"lat": lat2, "lng": lng2};
//        var distance = plugin.google.maps.geometry.spherical.computeDistanceBetween(center, newValue);
//        console.log("Distance in Meters: ", distance);
//        console.log("Distance in Kilometers: ", (distance * 0.001));
//        return distance;
            /**
             * Converts degrees to radians.
             * 
             * @param degrees Number of degrees.
             */
            function degreesToRadians(degrees) {
                return degrees * Math.PI / 180;
            }
            /*
             * Returns the distance between 2 points of coordinates in Google Maps
             */
            // The radius of the planet earth in meters
            var R = 6378137;
            var dLat = degreesToRadians(lat2 - lat1);
            var dLong = degreesToRadians(lng2 - lng1);
            var a = Math.sin(dLat / 2)
                    *
                    Math.sin(dLat / 2)
                    +
                    Math.cos(degreesToRadians(lat1))
                    *
                    Math.cos(degreesToRadians(lat1))
                    *
                    Math.sin(dLong / 2)
                    *
                    Math.sin(dLong / 2);

            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distance = R * c;
            return distance;
        },
        getTimeToDistanceAndSpeed: function (km, speed) {
            if (typeof speed === "undefined" || !qxnw.utils.evalueData(speed)) {
                speed = 5;
            }
            var time = km / speed;
            time = time * 60;
            return time;
        },
        slotEnviarMsgByUser: function (user, perfil) {
            var self = this;
            var d = new transmovapp.forms.f_enviar_mensajes_push_correo_user(user, perfil);
//            self.addSubWindow("Booking - Transferz", d);
//            d.maximize();
            d.setModal(true);
            d.setWidth(1100);
//            d.setMaxWidth(1100);
            d.setHeight(800);
////            d.setMaxHeight(800);
            d.show();
        },
        chat: function (datos) {
            var selfmain = this;
            var config = main.getConfiguracion();
            console.log("datos", datos);
            var self = new qxnw.reports();
            self.setTitle = "Chat con " + datos.cliente_nombre;
            self.datos = datos;

            datos.id = datos.id.toString();

            self.tokens = false;
            self.id_clean = datos.id;
            self.isParada = "NO";
            console.log("datos.id", datos.id);
            console.log("datos.id.indexOf(parada)", datos.id.indexOf("parada"));
            if (datos.id.indexOf("parada") != -1) {
                self.isParada = "SI";
                console.log("datos.id.split(_parada_)", datos.id.split("_parada_"));
                self.id_clean = datos.id.split("_parada_")[1];
            }
            console.log("self.id_clean", self.id_clean);
            console.log("self.datos", self.datos);


            getTokens(function () {
                frame();
            });

            function getTokens(callback) {
//            nw.loading();
//            if (nw.evalueData(window.localStorage.getItem("tokensInChat_" + self.id_clean))) {
//                var r = window.localStorage.getItem("tokensInChat_" + self.id_clean);
//                r = JSON.parse(r);
//                self.tokens = r;
//                console.log("getTokens:::local_data", r);
//                return callback();
//            }
                var up = qxnw.userPolicies.getUserData();
                var data = {};
                data.id = self.id_clean;
                data.es_parada = self.isParada;
                data.empresa = up.company;
                data.usuario = up.usuario;
                data.perfil = "admin";
                var rpc = new qxnw.rpc(main.getRpcUrl(), "servicios");
                console.log("getTokens:::dataSend", data);
                rpc.setAsync(true);
                rpc.setShowLoading(true);
                var func = function (r) {
                    console.log("getTokens:::responseServer", r);
                    if (typeof r == "string") {
                        if (r == "pasajero_no_configurado") {
                            qxnw.utils.information("El servicio no tiene configurado un pasajero");
                        } else {
                            var res = "<strong style='color:red;'>¡Importante! No podrás comunicarte por el siguiente motivo: </strong>";
                            res += "<br />" + r;
                            qxnw.utils.information(res);
                        }
                        return false;
                    }
                    var existDriver = false;
                    var existPax = false;
                    for (var i = 0; i < r.length; i++) {
                        if (r[i].perfil == "1") {
                            existPax = true;
                        }
                        if (r[i].perfil == "2") {
                            existDriver = true;
                        }
                    }
                    if (!existPax) {
                        qxnw.utils.information("No existen datos de inicio de sesión del pasajero, no te podrás comunicar");
                    }
                    if (!existDriver) {
                        qxnw.utils.information("No existen datos de inicio de sesión del conductor, no te podrás comunicar");
                    }
                    self.tokens = r;
                    callback();
                    console.log("getTokens:::server_data", JSON.stringify(r));
                    window.localStorage.setItem("tokensInChat_" + self.id_clean, JSON.stringify(r));
                };
                rpc.exec("getTokensByChat", data, func);
            }

            function frame() {
                var datos = self.datos;
                var up = qxnw.userPolicies.getUserData();
                console.log("up", up);

                var url = "";
                url += "/nwlib6/nwproject/modules/webrtc/v6/chat/index.html?";
                url += "room=" + datos.id;
                url += "&setUserName=" + up.name + " (Admin)";
                url += "&setUserPhoto=" + up.photo;
                url += "&setUserEmail=" + up.email;
                url += "&id_user=" + up.code;
                url += "&saveToken=true";
                url += "&useMicroMsg=false";
                if (qxnw.utils.evalueData(config.keyGoogleNotificacionPush)) {
                    url += "&keyGoogleNotificacionPush=" + config.keyGoogleNotificacionPush;
                }
                if (qxnw.utils.evalueData(self.tokens)) {
                    var tokens = JSON.stringify(self.tokens);
                    var encodedString = btoa(tokens);
                    url += "&tokensAllGroup=" + encodedString;
                }
                var c = main.getConfiguracion();
                var conf = {is_movilmove: true, usa_firebase: c.usa_firebase, usa_firebase_modo_pruebas: c.usa_firebase_modo_pruebas};
                conf = JSON.stringify(conf);
                url += "&configAditional=" + btoa(conf);
                console.log("url", url);
                self.createPrinterToolBar();
                self.hideSelectPrinters(true);
                self.addFrame(url, false);
                self.maximize();
                self.show();
            }
        },
        setConfiguracion: function (r) {
            var self = this;
            self.configCliente = r;
        },
        getConfiguracion: function () {
            var self = this;
            return self.configCliente;
        }
    }
});
window.addEventListener('message', function (e) {
    console.log(e);
//    if (e.data.tipo == "saveMessageChat") {
//        var data = e.data;
//        var date = qxnw.utils.getActualFullDate();
//        for (var i = 0; i < data.tokensConversation; i++) {
//            var us = data.tokensConversation[i];
//            console.log("us", us);
//            movilmove.main.addNotificationFirebase({
//                usuario: us.usuario,
//                title: "Test",
//                description: "Description tester",
//                date: date,
//                callback: function () {
//                    alert("KO");
//                }
//            });
//        }
//    }
});
