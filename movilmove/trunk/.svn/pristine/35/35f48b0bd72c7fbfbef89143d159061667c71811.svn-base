nw.Class.define("f_3_validaServiceActive", {
    extend: nw.lists,
    construct: function (self, first, callback, onlyResolveDataFirebase, dataFirebaseService) {
        if (self.debugConstruct) {
            console.log("START_LAUNCH::::::f_3_validaServiceActive");
        }
        var selfThis = this;
        var firstInitial = first;
        if (!self.recibeGeoDriver && self.timeNoRecibeGeoDriver >= 3) {
            first = true;
        }
        if (self.serviceActive === true && self.servicioTomado === false) {
            first = true;
            self.servicioTomado = true;
        }
        if (self.debug) {
            console.log("self.servicioTomado", self.servicioTomado);
            console.log("self.serviceActive", self.serviceActive);
            console.log("first", first);
            console.log("self.recibeGeoDriver", self.recibeGeoDriver);
            console.log("self.timeNoRecibeGeoDriver", self.timeNoRecibeGeoDriver);
        }

        selfThis.selfAll = self;
        self.buscaOfertasMain = selfThis.buscaOfertas;

        var up = nw.userPolicies.getUserData();
        var data = {};
        data.usuario = up.usuario;
        data.empresa = up.empresa;
        data.perfil = up.perfil;
        data.buscaOfertas = "NO";
        data.configCliente = self.configCliente;
        console.log("self.serviceActive", self.serviceActive);
        console.log("firstInitial", firstInitial);
        console.log("self.configCliente.driver_puede_ofertar_valor_servicio", self.configCliente.driver_puede_ofertar_valor_servicio);
        if (self.serviceActive == false && self.configCliente.driver_puede_ofertar_valor_servicio === "SI") {
            data.buscaOfertas = "SI";
        }
        if (self.debug) {
            console.log("self.createDataDriver", self.createDataDriver);
        }
        if (first === true || !self.createDataDriver || !self.puntajeDriver) {
            data.getDataGeoDriver = true;
        }
        if (self.debug) {
            console.log("data.getDataGeoDriver", data.getDataGeoDriver);
            console.log("first", first);
        }


//        if (onlyResolveDataFirebase === true) {
        if (main.configCliente.usa_firebase == "SI") {
            console.log("dataFirebaseService", dataFirebaseService);
            resolveData(dataFirebaseService);
        } else {
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            console.log("f_3_validaServiceActive:::dataSend::::data", data);
            var func = function (ra) {
//                alert("validaServiceActive from server");
                console.log("f_3_validaServiceActive:::responseServer::::ra, r", ra);
                resolveData(ra);
            };
            rpc.exec("servicioActivoUser", data, func);
        }

        function resolveData(ra) {
            var r = ra;
            if (typeof ra[0] != "undefined") {
                r = ra[0];
            }
            nw.remove(".form_ofertando_esperando");
            nw.remove(".ofertas_container");
//            if (self.debugConstruct) {
            console.log("f_3_validaServiceActive:::resolveData::::ra, r", ra, r);
//            }
            if (ra === false && self.activeNormalV == false || ra === false) {
                self.activeNormal();
                return false;
            }

            if (!nw.utils.evalueData(r.puntaje)) {
                r.puntaje = "0";
            }
            if (r.puntaje === "0") {
                r.puntaje = "0.1";
            }

            self.arrayDataBuscaOfertas = null;
            if (r.estado == "SOLICITUD" && !nw.evalueData(r.conductor_id)) {
                if (data.buscaOfertas == "SI") {

//                    self.servicio_nom = r;

                    var dataform = self.getRecord();
                    console.log("dataform", dataform);
                    console.log("r", r);
//                    alert("alexf:000");

                    if (!nw.utils.evalueData(dataform.address)) {
                        self.ui.address.setValue(r.origen);
                    }
                    if (!nw.utils.evalueData(dataform.address_destino)) {
                        self.ui.address_destino.setValue(r.destino);
                    }
                    if (!nw.utils.evalueData(dataform.datos_vehiculo_elegido)) {
                        self.ui.datos_vehiculo_elegido.setValue(r.datos_vehiculo_elegido);
                    }
                    if (!nw.utils.evalueData(dataform.descricion_carga)) {
                        self.ui.descricion_carga.setValue(r.descricion_carga);
                    }
                    selfThis.buscaOfertas(r);
                }
            }
            var vencidos = [];
//            for (var i = 0; i < ra.length; i++) {
//                var d = ra[i];
//                if (d.estado == "SOLICITUD" && d.tipo_servicio != "reservado") {
//                    console.log("d.fecha", d.fecha);
//                    console.log("self.hoyDate", self.hoyDate);
//                    if (d.fecha < self.hoyDate) {
//                        vencidos.push(d.id);
//                    }
//                }
//            }
            console.log("vencidos", vencidos);
            if (vencidos.length > 0) {
                self.updateVencidos(vencidos);
            }

            self.recibeGeoDriver = false;
            self.timeNoRecibeGeoDriver++;

            if (r) {
                r.type = "cliente";
                main.id_service_active = r.id;
                self.resolveStatus(r);
            }
//            alert(r.estado + " " + r.id);
//            if (!self.shotFirstUbicationDriver) {
            if (nw.evalueData(r.driver_latitud) && nw.evalueData(r.driver_longitud)) {
                if (r.estado === "EN_RUTA" || r.estado === "EN_SITIO" || r.estado === "ABORDO") {
                    self.positionConductor = {
                        lat: r.driver_latitud,
                        lng: r.driver_longitud
                    };
                    self.createMarkerDriver(false, self.positionConductor);
                    self.shotFirstUbicationDriver = true;

                    self.serviceActive = r;

                    if (nw.evalueData(r.puntaje)) {
                        self.puntajeDriver = r.puntaje;
                        var da = document.querySelector(".containerPuntajeDriverSpan");
                        if (da) {
                            document.querySelector(".containerPuntajeDriverSpan").innerHTML = self.showStarsDriver();
                            self.dataHtmlConductor = da.innerHTML;
                        }
                    }
                }
            }
            if (nw.evalueData(callback)) {
                callback(r);
            }
        }

    },
    destruct: function () {
    },
    members: {
        buscaOfertas: function buscaOfertas(r, origen) {
            console.log("buscaOfertas", r, origen);
//            alert("buscaOfertas");
            var selfThis = this;
            if (origen != "main") {
                var self = selfThis.selfAll;
                self.arrayDataBuscaOfertas = r;
            }

            nw.remove(".ofertas_container");

            var container = document.createElement("div");
            container.className = "ofertas_container";
            document.body.appendChild(container);

            var up = nw.userPolicies.getUserData();

            main.destroyQueryOfertas();
            if (main.configCliente.usa_firebase == "SI") {
                var ops = {};
                ops.table = "servicios_ofertas";
                var sum = 0;
                ops.where_array = [];
                ops.where_array[sum] = {variable: "empresa", operator: "==", equal: up.empresa};
                ops.where_array[sum++] = {variable: "id_servicio", operator: "==", equal: r.id};
                ops.where_array[sum++] = {variable: "estado", operator: "==", equal: "OFERTADO"};
                ops.limit = 10;
                ops.order = false;
//            ops.orderField = "estado";
//            ops.orderAscDesc = "desc";
//            ops.orderField2 = ["fecha_ultima_interaccion", "desc"];
                ops.getModelData = false;
                ops.destroyQuery = false;
                console.log("ops", ops);
                ops.callback = function (r, snapshot, query) {
                    queryGetOffers = query;

                    console.log("r", r);
                    console.log("snapshot:::buscaOfertas", snapshot);
                    console.log("snapshot.empty:::buscaOfertas", snapshot.empty);
                    snapshot.docChanges().forEach(function (change) {
                        var data = change.doc.data();
                        console.log("snapshot.empty:::buscaOfertas", snapshot.empty);
                        console.log("change.type:::buscaOfertas", change.type);
                        console.log("data:::buscaOfertas", data);
                        nw.remove(".ofertas_offer_" + data.id);
                        if (change.type == "removed") {

                        } else
                        if (change.type == "modify") {

                        }
                        if (change.type == "added") {
                            createBloque(data, selfThis);
                        }
                    });
                };
                nw.firebase.select(ops);
            } else {
                var up = nw.userPolicies.getUserData();
                var data = r;
                data.usuario_buscaoffer = up.usuario;
                var rpc = new nw.rpc(selfThis.getRpcUrl(), "app_user");
                rpc.setAsync(true);
                rpc.setLoading(false);
                console.log("buscaOfertas:::sendDataServer", data);
                var func = function (r) {
                    nw.loadingRemove();
                    console.log("buscaOfertas:::responseServer", r);
                    if (!r) {
                        return false;
                    }
                    for (var i = 0; i < r.length; i++) {
                        var ra = r[i];
                        createBloque(ra, selfThis);
                    }
                };
                rpc.exec("buscaOfertas", data, func);
            }

            function createBloque(ra, selfThis) {

                console.log("ra", ra);
                var foto = ra.conductor_foto;
                if (nw.evalueData(ra.conductor_foto_carro)) {
                    foto = ra.conductor_foto_carro;
                }
                var html = "";
                html += "<div class='offer_datatravel'>";
                html += "<div class='offer_foto' style='background-image: url(" + config.domain_rpc + foto + ");'></div>";
                html += "<div class='offer_datos'>";
                html += "<div class='offer_row offer_nombre'>" + ra.conductor_nombre + "</div>";
                html += "<div class='offer_row offer_marcacarro'>" + ra.conductor_marca_carro + "</div>";
                html += "</div>";
                html += "<div class='offer_precios'>";
                html += "<div class='offer_row offer_oferta'>" + ra.oferta + "</div>";
                html += "</div>";
                html += "</div>";
                html += "<div class='offer_buttons'>";
                html += "</div>";

                var offer = document.createElement("div");
                offer.className = "ofertas_offer ofertas_offer_" + ra.id;
                offer.innerHTML = html;
                container.appendChild(offer);

                var btn = document.createElement("button");
                btn.className = "offer_btn offer_aceptar";
                btn.innerHTML = nw.str("Aceptar");
                btn.data = {data: ra, row: offer};
                btn.onclick = function () {
                    nw.remove(this.data.row);
                    selfThis.rechazarAceptarOferta(this.data.data, "ACEPTA_CLIENTE", function (rta) {
                        if (!rta) {
                            return nw.dialog("La oferta ya no está disponible");
                        }
//                            nw.remove(".form_ofertando_esperando");
                        var html = "";
                        html += '<div class="loadingCenterTextIcon"><div class="cEftVf cEftVf_wtext"></div><div class="textLoading">Confirmando, por favor espere</div></div>';
                        nw.dialog(html, function () {
                            return false;
                        }, false, {original: true, textAccept: "Ok", addClass: "form_ofertando_esperando", destroyAutomaticOnAccept: false});
                    });
                };
                offer.querySelector(".offer_buttons").appendChild(btn);

                var btn = document.createElement("button");
                btn.className = "offer_btn offer_rechazar";
                btn.innerHTML = nw.str("Ignorar");
                btn.data = {data: ra, row: offer};
                btn.onclick = function () {
                    nw.remove(this.data.row);
                    selfThis.rechazarAceptarOferta(this.data.data, "RECHAZADO_POR_USUARIO", function (rta) {

                    });
                    var all = document.querySelectorAll(".ofertas_offer");
                    if (all.length == 0) {
//                        nw.remove(".ofertas_container");
                        nw.remove(".form_ofertando_esperando");
                    }
                };
                offer.querySelector(".offer_buttons").appendChild(btn);
            }
        },
        rechazarAceptarOferta: function rechazarAceptarOferta(ra, estado, callback) {
            var selfThis = this;
            var self = selfThis.selfAll;
            self.arrayDataBuscaOfertas = null;

            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.id = ra.id;
            data.estado = estado;
            var rpc = new nw.rpc(nw.getRpcUrl(), "app_user");
            rpc.setAsync(true);
            rpc.setLoading(false);
            console.log("ofertarViaje:::rechazarAceptarOferta:::dataSend", data);
            console.log("ofertarViaje:::rechazarAceptarOferta:::ra", ra);
            var funcs = function (rrr) {

                main.rechazarAceptarOfertaInFirebase(ra.id);

                var title = "El usuario ha aceptado su oferta";
                if (estado == "RECHAZADO_POR_USUARIO") {
                    title = "El usuario ha rechazado su oferta";
                }
                nw.sendNotificacion({
                    title: title,
                    body: title,
                    icon: "fcm_push_icon",
                    sound: "default",
                    data: "nw.dialog('" + title + "')",
                    callback: "FCM_PLUGIN_ACTIVITY",
                    to: ra.token
                });

                console.log("ofertarViaje:::rechazarAceptarOferta:::responseServer", rrr);
                callback(rrr);
            };
            rpc.exec("rechazaAceptaOferta", data, funcs);
        }
    }
});