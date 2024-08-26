nw.Class.define("f_constructServiceSolicitud", {
    extend: nw.lists,
    construct: function (self, r) {
        var up = nw.userPolicies.getUserData();
        if (self.debug) {
            console.log("constructServiceSolicitud", r);
            console.log("constructServiceSolicitud estado", r.estado);
            console.log("constructServiceSolicitud conductor_id", r.conductor_id);
            console.log("UP id_usuario", up.id_usuario);
        }
        var selfForm = this;
        selfForm.intervalOffer = null;
        selfForm.selfAll = self;
        self.numServicio = r;
        self.__subservicio = r.subservicio;

        console.log(r.id);
        console.log(r.tipo_servicio);


        if (main.configCliente.driver_puede_ofertar_valor_servicio === "SI") {
            if (typeof self.cancelaTodasOfertas == "undefined") {
                self.cancelaTodasOfertas = true;
                var data = {};
                data.usuario = up.usuario;
                data.empresa = up.empresa;
                data.perfil = up.perfil;
                data.estado = "OFERTADO";
                var rpc = new nw.rpc(nw.getRpcUrl(), "app_driver");
                rpc.setAsync(true);
                rpc.setLoading(false);
                console.log("ofertarViaje:::cancelaTodasOfertas:::dataSend", data);
                var funcs = function (rrr) {
                    console.log("ofertarViaje:::cancelaTodasOfertas:::responseServer", rrr);
                };
                rpc.exec("cancelaTodasOfertas", data, funcs);
            }
        }

//        if (r.tipo_servicio === "reservado") {
//            main.consultaArrayServicio(r.id, function (pr) {
//                console.log("main.consultaArrayServicio", pr);
//                if (pr != false) {
//                    r = false;
//                } else {
//                    main.guardaServicio(r.id);
//                }
//            });
//        }
        //        if (self.debugConstruct) {
        console.log("START_LAUNCH:::::::::::::: f_constructServiceSolicitud", r);
//        }
//        var search = true;
//        if (search) {
//            var isMostrado = self.searchServiceMostrado(r.id);
//            console.log("isMostrado", isMostrado);
//            if (!isMostrado) {
//                return false;
//            }
//        }
        if (document.querySelector(".newServiceBar_" + r.id)) {
            return false;
        }
        if (document.querySelector(".grupo_nueva_solicitud")) {
            var display = document.querySelector(".grupo_nueva_solicitud").style.display;
            console.log("display", display);
            if (display != "none") {
                $(".liBarEncNotify").remove();
                return false;
            }
        }

        if (r !== false) {
            contin();

            self.timeContin = null;
            function contin() {
                clearTimeout(self.timeContin);
//                if (!nw.evalueData(r.latitudOri) || !nw.evalueData(r.longitudOri) || !nw.evalueData(self.positionConductor.lat) || !nw.evalueData(self.positionConductor.lng)) {
//                    self.timeContin = setTimeout(function () {
//                        contin();
//                    }, 500);
//                }
//                var h = self.getDistanceToCoords(parseFloat(r.latitudOri), parseFloat(r.longitudOri), self.positionConductor.lat, self.positionConductor.lng);
                var d = nwgeo.distance(parseFloat(r.latitudOri), parseFloat(r.longitudOri), self.positionConductor.lat, self.positionConductor.lng);
                console.log("nwgeo.distance", d);
                d = d.toFixed(0);
                var distanceDriverMetros = parseFloat(d);
//                console.log(distanceDriverMetros);
//                function applyTime(response) {
//                    console.log(response);
//                    self.pathDriverToOrigin = JSON.stringify(response.pathOnetoOne);
//                    var showdistanceaprox = response[0].legs[0].distance.text;
//                    var showminutesaprox = response[0].legs[0].duration.text;
//                    r.showdistanceaprox = showdistanceaprox;
//                    r.showminutesaprox = showminutesaprox;
//                    document.querySelector(".showdistanceaprox").innerHTML = response[0].legs[0].distance.text;
//                    document.querySelector(".showminutesaprox").innerHTML = response[0].legs[0].duration.text;
                console.log("self.configCliente.pedir_datos_viaje_airpot", self.configCliente.pedir_datos_viaje_airpot);
                console.log("r.num_maletas", r.num_maletas);
                console.log("self.vehiculo.num_maletas", self.vehiculo.num_maletas);
                console.log("r.num_personas", r.num_personas);
                console.log("self.vehiculo.capacidad_pasajeros", self.vehiculo.capacidad_pasajeros);
//                if (self.configCliente.pedir_datos_viaje_airpot == "SI") {
//                    if (r.num_maletas !== null && r.num_maletas > self.vehiculo.num_maletas) {
//                        return false;
//                    }
//                    if (r.num_personas !== null && r.num_personas > self.vehiculo.capacidad_pasajeros) {
//                        return false;
//                    }
//                }


//                    var distanceDriverMetros = response[0].legs[0].distance.value;
//                self.configCliente.metros_para_aceptar_servicio = '1000';
//                var metros_para_aceptar_servicio = parseFloat(self.configCliente.metros_para_aceptar_servicio) * 1000;
                var metros_para_aceptar_servicio = parseFloat(self.configCliente.metros_para_aceptar_servicio);
                console.log("self.configCliente.metros_para_aceptar_servicio", self.configCliente.metros_para_aceptar_servicio);
                console.log("metros_para_aceptar_servicio", metros_para_aceptar_servicio);
                console.log("distanceDriverMetros", distanceDriverMetros);
                if (distanceDriverMetros <= metros_para_aceptar_servicio ||
                        r.tipo_servicio === "reservado" && r.conductor_id === up.id_usuario ||
                        r.conductor_id === up.id_usuario) {
//                    var marker = new nwgeo.addMarker();
//                    marker.map = self.map;
//                    marker.latitude = parseFloat(r.latitudOri);
//                    marker.longitude = parseFloat(r.longitudOri);
////                        marker.title = clientenom + " " + r.origen;
//                    marker.title = clientenom;
//                    marker.label = "";
////                        marker.icon = "img/icono-marker-desti.png";
//                    marker.draggable = false;
//                    marker.animation = false;
//                    self.markerNotify = marker.show(function () {
////                            self.map.setZoom(self.zoom);
//                    });
//                    nwgeo.centerMap(self.map, self.marker1, self.markerNotify);

                    var showdistanceaprox = distanceDriverMetros / 1000;
                    showdistanceaprox = showdistanceaprox.toFixed(2);
                    var km = showdistanceaprox;
                    var showminutesaprox = nwgeo.getTimeToDistanceAndSpeed(km, 15);
                    showminutesaprox = Math.round(showminutesaprox);
                    var time = 59000;
                    if (nw.evalueData(self.configCliente.tiempo_notificacion_servicio)) {
                        if (parseInt(self.configCliente.tiempo_notificacion_servicio) > 0) {
                            time = parseInt(self.configCliente.tiempo_notificacion_servicio) * 60;
                            time = time * 1000;
                        }
                    }
//                    $('.cont-radar').remove();

                    var textreserv = "";
                    if (r.tipo_servicio === "reservado") {
                        textreserv = "reservado";
                    }

                    var title = nw.utils.tr("Nuevo servicio") + " #" + r.id + " " + nw.utils.tr(r.tipo_servicio);
                    var textButton = "Tomar viaje";
                    if (typeof config.textBtnAcceptService !== 'undefined') {
                        textButton = config.textBtnAcceptService;
                    }
                    var classNoty = "notify_ahora";
                    if (r.tipo_servicio === 'reservado') {
                        textButton = "Confirmar";
                        classNoty = "notify_reservado";
                    }
                    if (r.tipo_servicio === "reservado" && r.conductor_id === up.id_usuario || r.conductor_id === up.id_usuario) {
                        title = nw.tr("Te han asignado un servicio") + " #" + r.id + " " + nw.tr(r.tipo_servicio);
                        time = 900000;
                        textButton = nw.tr("Confirmar");
                        classNoty = "notify_reservado";
                    }
                    if (r.tipo_servicio === "ahora" && r.conductor_id === up.id_usuario) {
                        time = 300000;
                    }
                    var body = "<div class='containBodyNotydriver'>";
                    body += "<div class='newservice_cont'>";
                    if (self.configCliente.mostrar_valor_conductor === "SI" && nw.utils.evalueData(r.valor)) {
                        body += "<div><p>" + nw.tr("Tarifa") + "</p><span>$" + nw.addNumber(r.valor) + "</span></div>";
                    }
                    body += "<div><p>" + nw.tr("Distancia") + "</p><span>" + showdistanceaprox + "km</span></div>";
                    body += "<div><p>" + nw.utils.tr("Tiempo") + "</p><span>" + showminutesaprox + "m</span></div>";
                    body += "</div>";

                    body += "<span class='datefull_not'>" + r.fecha + " " + r.hora + "</span>";

                    body += "<p class='newserv_desdehast newserv_desde'><span class='pointCircleDis pointCircleDis_a'>A</span> " + nw.tr("De:") + " " + r.origen + "</p>";
                    if (self.configCliente.mostrar_direccion_destino === "SI") {
                        body += "<p class='newserv_desdehast newserv_destino'><span class='pointCircleDis pointCircleDis_b'>B</span>  " + nw.tr("Hasta:") + " " + r.destino + "</p>";
                    }
                    r.showminutesaprox = showminutesaprox;
//                    body += "<span class='datadistanceminutesnot'>Estás a <span class='showdistanceaprox'>" + showdistanceaprox + "km </span><span class='showminutesaprox'>" + showminutesaprox + "m </span></span>";
                    if (nw.evalueData(r.cliente_nombre)) {
                        body += "<span>" + r.cliente_nombre + " " + r.usuario + "</span>";
                    }
                    if (self.configCliente.usa_subservicios == "SI") {
                        if (nw.evalueData(r.subservicio_text)) {
                            body += "<span>" + nw.tr("Tipo servicio") + ": " + r.subservicio_text + "</span>";
                        }
                    }
                    if (nw.evalueData(r.bodega_text)) {
                        body += "<br /><span>" + nw.tr("Empresa") + ": " + r.bodega_text + "</span>";
                    }
                    if (nw.evalueData(r.descricion_carga)) {
                        body += "<br /><span>" + nw.tr("Descripción") + ": " + r.descricion_carga + "</span>";
                    }
                    if (nw.evalueData(r.observaciones_servicio)) {
                        body += "<br /><span class='notas'>" + nw.tr("Notas") + ": " + r.observaciones_servicio + "</span>";
                    }
                    if (nw.evalueData(r.observaciones_entrega)) {
                        body += "<br /><span class='notas'>" + nw.tr("Notas") + ": " + r.observaciones_entrega + "</span>";
                    }
                    if (nw.evalueData(r.datos_vehiculo_elegido)) {
                        body += "<br /><span class='notas datos_vehiculo_elegido'>" + nw.tr("Notas") + ": " + r.datos_vehiculo_elegido + "</span>";
                    }
                    if (nw.evalueData(r.numero_auxiliares)) {
                        body += "<br /><span class='notas'>" + nw.tr("Auxiliares") + ": " + r.numero_auxiliares + "</span>";
                    }
//                    if (r.tipo_servicio === "reservado") {
//                        body += "<span><strong>RESERVADO</strong></span>";
//                    }
                    if (nw.evalueData(r.paradas_adicionales_iniciales_creacion)) {
                        body += "<span>" + r.paradas_adicionales_iniciales_creacion + " " + nw.tr("paradas") + "</span><br />";
                    }
                    if (nw.evalueData(r.observacion_ultima_ubicacion)) {
                        body += "<br /><span class='notas'>" + nw.tr("Observación ubicación") + ": " + r.observacion_ultima_ubicacion + "</span>";
                    }
                    body += "<br /><span class='subcate_not'>" + r.subcategoria_servicio_text + "</span>";
//                    body += "<br /><span class='datefull_not'>" + r.fecha + " " + r.hora + "</span>";
                    body += "</div>";

                    //botones aceptar y rechazar
                    body += "<div class='newservice_containbns'>";
                    body += "</div>";

                    var t = nw.createNotificacionBarInter({
                        addClass: classNoty + " newServiceBar_" + r.id,
                        timeToRemove: time,
                        title: title,
                        body: body,
                        icon: false,
                        data: r,
                        callbackEndTime: function () {
                            console.log("callbackEndTime");
                            main.deleteRecord(r.id);
                            if (!document.querySelector(".cont-radar") || typeof (document.querySelector(".cont-radar")) == null) {
                                self.getIcon();
                            }
                            self.cleanMarkerNotify();
//                            if (nw.evalueData(self.configCliente.bloqueo_no_aceptacion_servicios)) {
//                                if (parseInt(self.configCliente.bloqueo_no_aceptacion_servicios) > 0) {
//                                    if (self.ui_servi[r.id]) {
//                                        self.ui_servi[r.id] = false;
//                                    } else {
//                                        self.updateRechazados(r, function () {
//                                            main.initBloqueoApp();
//                                        });
//                                    }
//                                }
//                            }
                        },
                        callbackEnd: function () {
//                            self.addRechazadoServiceMostrado(r);
                            self.cleanMarkerNotify();
                        },
                        createbtn: true,
                        callback: function () {
                            self.cleanMarkerNotify();
//                                self.saveAcceptService(r);
                        }
                    });
                    console.log("tttttttttttttt", t);

                    var btn = document.createElement("div");
                    btn.className = "newservice_containbns_unit containbuttonacceptservice";
                    btn.innerHTML = "<button>" + nw.utils.tr(textButton) + "</button>";
                    btn.data = r;
                    btn.parent_widget = t;
                    btn.onclick = function () {
                        var r = this.data;
                        var t = this.parent_widget;
                        selfForm.aceptaViaje(r, t, function (res) {
                            console.log("res", res);
                        });
                    };
                    t.querySelector(".newservice_containbns").appendChild(btn);

                    if (main.configCliente.driver_puede_ofertar_valor_servicio === "SI") {
                        var btn = document.createElement("div");
                        btn.className = "newservice_containbns_unit containbuttonofertarservices";
                        btn.innerHTML = "<button>" + nw.utils.tr("Ofertar") + "</button>";
                        btn.data = r;
                        btn.parent_widget = t;
                        btn.onclick = function () {
                            if (!selfForm.validateSaldo()) {
                                return false;
                            }
                            var r = this.data;
                            var t = this.parent_widget;
                            console.log("OFERTAR_SERVICE:::r", r);
                            console.log("OFERTAR_SERVICE:::t", t);
                            selfForm.ofertar(r, t);
                        };
                        t.querySelector(".newservice_containbns").appendChild(btn);
                    }

                    if (main.configCliente.usa_informe_paradas === "SI") {
                        var btn = document.createElement("div");
                        btn.className = "newservice_containbns_unit containbuttonparadasservices";
                        btn.innerHTML = "<button>" + nw.utils.tr("Paradas") + "</button>";
                        btn.data = r;
                        btn.parent_widget = t;
                        btn.onclick = function () {
                            main.editaParadasAdicionales(r);
                        };
                        t.querySelector(".newservice_containbns").appendChild(btn);
                    }

//                    if (config.usaRechazarServicios !== false || main.configCliente.driver_puede_rechazar_servicios !== "NO") {
                    if (main.configCliente.driver_puede_rechazar_servicios !== "NO") {
                        var btn = document.createElement("div");
                        btn.className = "newservice_containbns_unit containbuttoncancelservices";
                        btn.innerHTML = "<button>" + nw.utils.tr("Rechazar") + "</button>";
                        btn.data = r;
                        btn.parent_widget = t;
                        btn.onclick = function () {
                            var r = this.data;
                            var t = this.parent_widget;
                            console.log("RECHAZA_SERVICE:::", r.id);
                            self.cleanMarkerNotify();
                            self.stopSound();
                            self.addRechazadoServiceMostrado(r);

                            r.bloqueo_no_aceptacion_servicios = "NO";
                            if (nw.evalueData(self.configCliente.bloqueo_no_aceptacion_servicios)) {
                                if (parseInt(self.configCliente.bloqueo_no_aceptacion_servicios) > 0) {
                                    self.ui_servi[r.id] = true;
                                    r.bloqueo_no_aceptacion_servicios = "SI";
                                }
                            }
                            self.updateRechazados(r, function () {
                                main.initBloqueoApp();
                            });
//                            nw.removeClass(t, "liBarEncNotifyShow", true);
                            if (!document.querySelector(".cont-radar") || typeof (document.querySelector(".cont-radar")) == null) {
                                self.getIcon();
                            }
//                            setTimeout(function () {
                            t.remove();
//                            }, 1000);
                        };
                        t.querySelector(".newservice_containbns").appendChild(btn);
                    }

//                    if (nw.evalueData(window.localStorage.getItem("token"))) {
//                        nw.sendNotificacion({
//                            title: title,
//                            body: "Haga clic para ver el servicio",
//                            icon: "fcm_push_icon",
//                            sound: "push",
//                            data: "",
//                            callback: "FCM_PLUGIN_ACTIVITY",
//                            to: window.localStorage.getItem("token")
//                        });
//                    }

                    nw.playSound("SD_ALERT_44.mp3", {className: "sound_nuevo_viaje"});
                    nw.openAppToFront();
                    nw.turnScreenOn();
                    nw.turnScreenOnAndUnlocked();

                    if (typeof navigator !== "undefined") {
                        if (typeof navigator.vibrate !== "undefined") {
                            navigator.vibrate([1000, 1000, 3000, 1000, 5000]);
                        }
                        if (typeof navigator.notification !== "undefined") {
                            if (typeof navigator.notification.beep !== "undefined") {
                                navigator.notification.beep(5);
                            }
                        }
                    }
                }
//                }
//                self.getTimeToCoords(self.positionConductor.lat, self.positionConductor.lng, parseFloat(r.latitudOri), parseFloat(r.longitudOri), applyTime);
            }
        }
    },
    destruct: function () {
    },
    members: {
        validateSaldo: function validateSaldo() {
            var up = nw.userPolicies.getUserData();
            var selfForm = this;
            var self = selfForm.selfAll;
            if (typeof self.configCliente.saldo_minimo_para_tomar_servicios_conductor != "undefined") {
                if (parseFloat(self.configCliente.saldo_minimo_para_tomar_servicios_conductor) != 0) {
                    console.log("parseFloat(up.saldo)", parseFloat(up.saldo));
                    console.log("parseFloat(self.configCliente.saldo_minimo_para_tomar_servicios_conductor)", parseFloat(self.configCliente.saldo_minimo_para_tomar_servicios_conductor));
                    if (parseFloat(up.saldo) < parseFloat(self.configCliente.saldo_minimo_para_tomar_servicios_conductor)) {
                        nw.dialog(nw.tr("El valor mínimo para tomar servicios es de") + " " + self.configCliente.saldo_minimo_para_tomar_servicios_conductor + ", " + nw.tr("Recarga saldo y sigue disfrutando de nuestros servicios."));
                        return false;
                    }
                }
            }
            return true;
        },
        aceptaViaje: function aceptaViaje(r, t, callback) {
            var selfForm = this;
            var self = selfForm.selfAll;
            var up = nw.userPolicies.getUserData();
            //                        if (self.debugConstruct) {
            console.log("CLICK_ACCEPT_SERVICE::::::r", r);
            console.log("CLICK_ACCEPT_SERVICE::::::widget", t);
            console.log("CLICK_ACCEPT_SERVICE::::::up.saldo", up.saldo);
            console.log("CLICK_ACCEPT_SERVICE::::::self.configCliente.saldo_minimo_para_tomar_servicios_conductor", self.configCliente.saldo_minimo_para_tomar_servicios_conductor);
//                        }
//                        
            if (!selfForm.validateSaldo()) {
                return false;
            }
            self.ui.finalizar_viaje.setVisibility(false);
//                        var d = self.tiempoPagos();
//                        if (!d && typeof d !== 'undefined') {
//                            t.remove();
//                            return;
//                        }
            self.cleanMarkerNotify();
            self.stopSound();
            self.saveAcceptService(r);
//                        nw.removeClass(t, "liBarEncNotifyShow", true);
//                        setTimeout(function () {
//                        console.log("t", t);
            t.remove();
            if (nw.evalueData(callback)) {
                callback(true);
            }
//                        }, 1000);

        },
        confirmaValor: function confirmaValor(data, callback) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var html = "";
            var options = {};
            options.setTitle = "Confirmar valor";
            options.id = "taskConfirmaTime";
            options.html = "<div class='titleconfirmatime'>Confirmar valor</div>";
            options.changeHash = true;
            options.showBack = true;
            options.closeBack = false;
            options.destroyAutomaticOnAccept = false;
            if (nw.isMobile()) {
                options.role = "page";
                options.transition = "slide";
            }
            options.fields = [];
            options.fields.push(
                    {
                        label: "Confirma tu oferta",
                        name: "valorfijargrupo",
                        type: "startGroup"
                    },
                    {
                        name: "moneda",
                        label: "",
                        type: "label"
                    },
                    {
                        name: "valor_fijado",
                        label: "Confirma el valor del servicio",
                        placeholder: "Confirma el valor del servicio",
                        type: "numeric",
                        required: true
                    },
                    {
                        type: "endGroup"
                    }
            );

            var accept = function () {
                var data = ds.getRecord();
                console.log("data", data);
                if (!ds.validate()) {
                    return false;
                }
                nw.remove(".container_valorfijo");
                return callback(data);
            };
            var cancel = function () {
                nw.remove(".container_valorfijo");
                return true;
            };

            var d = nw.dialog("<div id='valorfijo' class='valorfijo'></div>", accept, cancel, {
                addClass: "container_valorfijo",
                original: true,
                destroyAutomaticOnAccept: false,
                iconAccept: "<i class='material-icons' style='top: 5px;position: relative;'>check_circle</i>",
                iconCancel: "<i class='material-icons' style='top: 5px;position: relative;'>cancel</i>"
            });
            options.showButtons = false;
            options.createInHome = true;
            options.canvas = "#valorfijo";
            options.id = "valorfijo_list";
            options.id_form = "valorfijo_list_int";
            var ds = nw.dialog2(html, false, false, options);

            ds.ui.valor_fijado.setValue(data.valor);
            ds.ui.valor_fijado.focus();
            ds.ui.moneda.setValue(config.moneda);
            $(".valor_fijado").focus();
        },
        ofertar: function ofertar(r, t) {
            var selfForm = this;
            var self = selfForm.selfAll;
            var up = nw.userPolicies.getUserData();

            selfForm.confirmaValor(r, function (pr) {
                console.log("pr", pr);
                console.log("up", up);
                var conductor_foto_carro = "";
                var conductor_marca_carro = "";
                console.log("up.datosVehiculos", up.datosVehiculos);
                if (nw.evalueData(up.datosVehiculos)) {
                    var datosVeh = JSON.parse(up.datosVehiculos);
                    console.log("datosVeh", datosVeh);
                    conductor_marca_carro = datosVeh.marca_text;
                    conductor_marca_carro += " " + datosVeh.modelo;

                    if (nw.evalueData(datosVeh.imagen_vehi)) {
                        conductor_foto_carro = datosVeh.imagen_vehi;
                    }

                }
                console.log("up.placa_activa", up.placa_activa);
                console.log("conductor_marca_carro", conductor_marca_carro);
                var data = {};
                data.conductor_nombre = up.nombre + " " + up.apellido;
                data.conductor_foto = up.foto_perfil;
                data.conductor_marca_carro = conductor_marca_carro;
                data.conductor_foto_carro = conductor_foto_carro;
                data.placa_activa = up.placa_activa;
                data.usuario = up.usuario;
                data.empresa = up.empresa;
                data.perfil = up.perfil;
                data.id_servicio = r.id;
                data.usuario_pasajero = r.usuario;
                data.oferta = pr.valor_fijado;
                data.estado = "OFERTADO";
                data.token = null;
                if (nw.evalueData(window.localStorage.getItem("token"))) {
                    data.token = window.localStorage.getItem("token");
                }
                var rpc = new nw.rpc(nw.getRpcUrl(), "app_driver");
                rpc.setAsync(true);
                rpc.setLoading(false);
                nw.loading({text: "Estamos enviando su oferta por $" + pr.valor_fijado + "" + config.moneda + " en el servicio #" + data.id_servicio + ", por favor espere", title: "Enviado su oferta, por favor espere..."});
                console.log("ofertarViaje:::dataSend", data);
                var funcs = function (rr) {
                    console.log("ofertarViaje:::responseServer", rr);
                    nw.loadingRemove();
                    self.cleanMarkerNotify();
                    self.stopSound();

                    main.saveOfertaServiceInFirebase(rr, function () {
                        continuar();
                    });

                    function continuar() {

                        if (rr == false) {
                            nw.dialog("Servicio no disponible (1)");
                            nw.remove(".newServiceBar_" + r.id);
                            nw.remove(".form_ofertando");
                            return false;
                        }

                        if (nw.evalueData(r.token_usuario)) {
                            var title = "Nueva oferta para su servicio";
                            nw.sendNotificacion({
                                title: title,
                                body: title,
                                icon: "fcm_push_icon",
                                sound: "default",
                                data: "main.ofertaNotificaRecibe('nueva_oferta')",
//                            data: "nw.dialog('" + title + "')",
                                callback: "FCM_PLUGIN_ACTIVITY",
                                to: r.token_usuario
                            });
                        }

                        var html = "";
                        html += "<div class='loadingCenterTextIcon'><div class='cEftVf cEftVf_wtext'></div><div class='textLoading'>" + nw.utils.tr("Enviando su oferta por") + " " + pr.valor_fijado + " " + nw.utils.tr("en el servicio") + " #" + data.id_servicio + ", " + nw.utils.tr("por favor espere") + "</div></div>";
                        nw.dialog(html, function () {
                            var data = {};
                            data.usuario = up.usuario;
                            data.empresa = up.empresa;
                            data.perfil = up.perfil;
                            data.id_servicio = r.id;
                            data.id_oferta = rr;
                            data.estado = "CANCELA_CONDUCTOR";
                            data.token = null;
                            if (nw.evalueData(window.localStorage.getItem("token"))) {
                                data.token = window.localStorage.getItem("token");
                            }
                            var rpc = new nw.rpc(nw.getRpcUrl(), "app_driver");
                            rpc.setAsync(true);
                            rpc.setLoading(false);
                            nw.loading({text: "Cancelando oferta, por favor espere", title: "Cancelando oferta, por favor espere..."});
                            console.log("ofertarViaje:::rechazar:::dataSend", data);
                            var funcs = function (rrr) {
                                console.log("ofertarViaje:::rechazar:::responseServer", rrr);
                                nw.loadingRemove();
                                nw.remove(".form_ofertando");
                                if (rrr == false) {
                                    nw.dialog("Servicio no disponible (2)");
                                    nw.remove(".newServiceBar_" + r.id);
                                    nw.remove(".form_ofertando");
                                    return false;
                                }
                                if (nw.evalueData(r.token_usuario)) {
                                    var title = "Oferta cancelada";
                                    nw.sendNotificacion({
                                        title: title,
                                        body: title,
                                        icon: "fcm_push_icon",
                                        sound: "default",
                                        data: "main.ofertaNotificaRecibe('cancela_oferta')",
//                                    data: "nw.dialog('" + title + "')",
                                        callback: "FCM_PLUGIN_ACTIVITY",
                                        to: r.token_usuario
                                    });
                                }
                                main.saveOfertaServiceInFirebase(rr, function () {

                                });
                            };
                            rpc.exec("ofertarViaje", data, funcs);
                            return true;
                        }, false, {original: true, textAccept: "Cancelar oferta", addClass: "form_ofertando"});


                        if (main.configCliente.usa_firebase == "SI") {
                            validaAceptaFirebase();
                        } else {
                            validaAcepta();
                        }
                        function validaAceptaFirebase() {
                            main.destroyQueryOfertas();
                            var ops = {};
                            ops.table = "servicios_ofertas";
                            var sum = 0;
                            ops.where_array = [];
                            ops.where_array[sum] = {variable: "id", operator: "==", equal: rr.toString()};
                            ops.getModelData = false;
                            ops.destroyQuery = false;
                            ops.callback = function (r, snapshot, query) {
                                queryGetOffers = query;
                                console.log("r", r);
                                console.log("snapshot", snapshot);
                                console.log("snapshot.empty", snapshot.empty);
                                snapshot.docChanges().forEach(function (change) {
                                    var data = change.doc.data();
                                    console.log("snapshot.empty", snapshot.empty);
                                    console.log("change.type", change.type);
                                    console.log("data", data);
                                    console.log("ofertarViaje:::validaAceptacion:::responseFirebase", data);
                                    if (change.type == "removed") {

                                    } else
                                    if (change.type == "modified") {
                                        validaAceptaResolve(data);
                                    } else
                                    if (change.type == "added") {
                                        validaAceptaResolve(data);
                                    }
                                });
                            };
                            nw.firebase.select(ops);
                        }
                        function validaAcepta() {
                            selfForm.intervalOffer = setTimeout(function () {
                                var data = {};
                                data.usuario = up.usuario;
                                data.empresa = up.empresa;
                                data.perfil = up.perfil;
                                data.id_servicio = r.id;
                                data.id_oferta = rr;
                                var rpc = new nw.rpc(nw.getRpcUrl(), "app_driver");
                                rpc.setAsync(true);
                                rpc.setLoading(true);
                                console.log("ofertarViaje:::validaAceptacion:::dataSend", data);
                                var funcs = function (rra) {
                                    console.log("ofertarViaje:::validaAceptacion:::responseServer", rra);
                                    validaAceptaResolve(rra, function () {
                                        validaAcepta();
                                    });
                                };
                                rpc.exec("validaAceptacionViaje", data, funcs);
                            }, 5000);
                        }

                        function validaAceptaResolve(rra, callback) {

                            console.log("validaAceptaResolve:::data", rra);

                            if (rra == "VIAJE_NO_DISPONIBLE") {
                                nw.dialog("Servicio no disponible (3)");
                                nw.remove(".form_ofertando");
                                nw.remove(".newServiceBar_" + r.id);
                                return false;
                            }

                            if (rra) {
//                                if (nw.evalueData(window.localStorage.getItem("token"))) {
//                                    var title = "Oferta " + rra.estado;
//                                    nw.sendNotificacion({
//                                        title: title,
//                                        body: title,
//                                        icon: "fcm_push_icon",
//                                        sound: "default",
//                                        data: "main.ofertaNotificaRecibe('" + rra.estado + "')",
////                                            data: "nw.dialog('" + title + "')",
//                                        callback: "FCM_PLUGIN_ACTIVITY",
//                                        to: window.localStorage.getItem("token")
//                                    });
//                                }
                                if (rra.estado == "ACEPTA_CLIENTE") {
                                    nw.remove(".form_ofertando");
                                    nw.dialog("¡Oferta aceptada por el cliente!");
                                    clearTimeout(selfForm.intervalOffer);
                                    selfForm.aceptaViaje(r, t, function (res) {
                                        console.log("res", res);
                                    });
                                    return false;
                                }
                                if (rra.estado == "RECHAZADO_POR_USUARIO") {
                                    nw.remove(".form_ofertando");
                                    nw.dialog("¡Oferta RECHAZADA por el cliente! Realiza una nueva oferta.");

                                    clearTimeout(selfForm.intervalOffer);
                                    return false;
                                }
                            }
                            if (typeof callback != "undefined") {
                                callback();
                            }
                        }
                    }
                };
                rpc.exec("ofertarViaje", data, funcs);
            });
        }
    }
});