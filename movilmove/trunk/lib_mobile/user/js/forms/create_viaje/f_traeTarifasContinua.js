nw.Class.define("f_traeTarifasContinua", {
    extend: nw.lists,
    construct: function (self, no_line) {
//        if (self.debugConstruct) {
        console.log("CREATE::f_traeTarifasContinua", self);
//        alert("CREATE::f_traeTarifasContinua");
//        }
        var selfthis = this;
        self.traeTarifas = selfthis;
        selfthis.self = self;
        selfthis.no_line = no_line;
        self.__no_line = no_line;

        if (!self.launch) {
            return false;
        }
        self.removeCarsMap();
        self.ui.favoritos_group.removeClass("favoritos_group_show");
        self.ui.listo_fijar.setVisibility(false);
        self.ui.fijar_en_mapa_destino.setVisibility(false);
        self.ui.fijar_en_mapa_origen.setVisibility(false);
        self.ui.address.setVisibility(true);
        self.recargosInit = {};
        self.recargosInit.total = 0;
        self.recargosInit.paradas = 0;

        if (nw.utils.evalueData(self.configCliente.recargos_valor_parada_adicional)) {
            self.recargosInit.paradas = self.configCliente.recargos_valor_parada_adicional;
        }

        nw.loading();
        self.setDataPago();
        self.reziseNormalMap();
//        self.recargosConsult(function (e) {
//            if (e.length > 0) {
//                for (var f = 0; f < e.length; f++) {
//                    var val = e[f].valor;
//                    if (e[f].nombre.toLowerCase() == "parada adicional") {
//                        self.recargosInit.paradas = val;
//                    } else {
//                        self.recargosInit.total = parseFloat(self.recargosInit.total) + parseFloat(val);
//                    }
//                }
//            }
        if (self.tipo !== "horas") {
            self.ui.address_destino.setVisibility(true);
        }
        var data = self.getRecord(true);
        data.cobertura_por_ciudades = "SI";
        if (typeof self.configCliente.cobertura_por_ciudades !== "undefined") {
            data.cobertura_por_ciudades = self.configCliente.cobertura_por_ciudades;
        }
        if (self.debugConstruct) {
            console.log("SHOW::f_traeTarifasContinua::data.cobertura_por_ciudades", data.cobertura_por_ciudades);
        }

        if (data.forma === "trayecto" && !nw.evalueData(data.address_destino)) {
            self.ui.address_destino.setVisibility(true);
            return false;
        }
        if (data.forma === "horas") {
            $(".pago_group").addClass("buttons_group_fix_pago_group");
            document.querySelector(".nw_widget_div_codigo_promo").classList.add('visibe_promo');
            $(".buttons_group").addClass("buttons_group_fix");
            self.valor_total = "0";
            self.showPrice(0, 19, 0, 0);
            nw.loadingRemove();
            self.reziseMap();
            return false;
        }
        self.cleanPre();

        document.querySelector(".centrar_mapa").style.display = "none";
        self.ui.pago_group.addClass("buttons_group_fix_pago_group");
//                muestra promo
        document.querySelector(".nw_widget_div_codigo_promo").classList.add('visibe_promo');

        $(".btnMenuHeader").addClass("btnMenuHeader_hidden");
        self.ui.contenedor_azul.addClass("containBtnFooter_group_fix");
        self.ui.paradas_group.addClass("containBtnFooter_group_fix");

        var he = self.ui.pago_group.height();
        self.reziseMap(he);
        setTimeout(function () {
            selfthis.slotHomologacionCiudades(function (s) {
                selfthis.homologaciones = s;
                console.log("SELF.CIUDADES_ORIGEN::::", self.ciudad_origen);
                console.log("SELF.CIUDADES_DESTINO::::", self.ciudad_destino);
                var origen = self.ciudad_origen;
                var resultados_origen = selfthis.homologaciones.filter(item => {
                    console.log("Procesando item 1:", item.ciudad_homologar);
                    console.log("Procesando origen 1:", origen);
                    return item.ciudad_homologar === origen;
                });
                var resultados_destino = selfthis.homologaciones.filter(item => {
                    console.log("Procesando item 2:", item.ciudad_homologar);
                    console.log("Procesando destino 2:", self.ciudad_destino);
                    return item.ciudad_homologar === self.ciudad_destino;
                });
                if (resultados_origen.length > 0) {
                    console.log("resultado origen", resultados_origen[0].ciudad_homologada);
                    self.ciudad_origen = resultados_origen[0].ciudad_homologada;
                }
                if (resultados_destino.length > 0) {
                    console.log("resultado destino", resultados_destino[0].ciudad_homologada);
                    self.ciudad_destino = resultados_destino[0].ciudad_homologada;
                }

                console.log("resultados_origen_new::::", self.ciudad_origen);
                console.log("resultados_destino_new::::", self.ciudad_destino);

                var up = nw.userPolicies.getUserData();
                var usu = {};
                usu.empresa = up.empresa;
                usu.usuario = up.usuario;
                usu.perfil = up.perfil;
                if (nw.evalueData(up.bodega)) {
                    usu.bodega = up.bodega;
                }
                usu.ciudad_origen = self.ciudad_origen;
//            usu.name_place_origen = self.name_place_origen;
                usu.name_place_origen = self.ciudad_origen + " " + self.name_place_origen + " " + data.address;
                usu.ciudad_destino = self.ciudad_destino;
                usu.name_place_destino = self.ciudad_destino;
                if (nw.evalueData(self.name_place_destino)) {
                    usu.name_place_destino += " " + self.name_place_destino;
                }
                usu.name_place_destino_text = self.name_place_destino + " " + self.name_place_destino_text;

                if (usu.ciudad_origen === usu.ciudad_destino) {
                    usu.type = "urbano";
                } else
                if (usu.ciudad_origen !== usu.ciudad_destino) {
                    usu.type = "intermunicipal";
                }

//            if (nw.evalueData(nwgeo.type)) {
//                usu.type = nwgeo.type;
//            }
                if (nw.evalueData(self.__typeOriginOne)) {
                    if (self.__typeOriginOne === "airport") {
                        usu.type = self.__typeOriginOne;
                    }
                }
                if (nw.evalueData(self.__typeOrigin)) {
                    if (self.__typeOrigin === "airport") {
                        usu.type = self.__typeOrigin;
                    }
                }

                if (selfthis.validaAeropuerto(usu.name_place_destino) || selfthis.validaAeropuerto(usu.name_place_destino_text) || selfthis.validaAeropuerto(usu.name_place_origen)) {
                    usu.type = "airport";
                }

                console.log("usu.type", usu.type);

                self.typeInTravelget = usu.type;

                usu.cobertura_por_ciudades = data.cobertura_por_ciudades;
                usu.configCliente = self.configCliente;
                var valida = self.validateDataSolicitudService(usu);
                if (valida !== true) {
                    return false;
                }
//            if (self.debugConstruct) {
                console.log("%c<<<<DEBUG: f_traeTarifasContinua START>>>>", 'background: #33A51F; color: #2B0902');
                console.log("SHOW::f_traeTarifasContinua::DATA_SEND_SERVER:::usu", usu);
                console.log("SHOW::f_traeTarifasContinua::DATA_SEND_SERVER:::data", data);
                console.log("%c<<<<DEBUG: f_traeTarifasContinua END>>>>", 'background: #33A51F; color: #2B0902');
//            }
                var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                rpc.setLoading(false);
                var func = function (r) {
//                if (self.debugConstruct) {
//            r.dataUsuSendServer = usu;
                    console.log("%c<<<<DEBUG RESULT_SERVER: f_traeTarifasContinua START>>>>", 'background: #33A51F; color: #2B0902');
                    console.log("RESULT_SERVER::f_traeTarifasContinua::getTarifasResult:::r", r);
                    console.log("%c<<<<DEBUG RESULT_SERVER: f_traeTarifasContinua END>>>>", 'background: #33A51F; color: #2B0902');
//                }

                    self.__data_service = r;

                    var leng = r.length;
                    if (leng === 0) {
                        nw.loadingRemove();

                        var html = nw.tr("Lo sentimos, no hemos encontrado cobertura para el sitio indicado.") + "<br />";
                        html += "<div class='origienesYDestinos'>";
                        html += "<br /><strong>" + nw.tr("Tipo") + "</strong>: " + nw.tr(usu.type) + "</strong>";
                        html += "<br /><strong>" + nw.tr("Dirección origen") + "</strong>: " + self.ui.address.getValue() + "</strong>";
                        html += "<br /><strong>" + nw.tr("Ciudad origen") + "</strong>: " + usu.ciudad_origen + "</strong>";
                        html += "<br /><strong>" + nw.tr("Lugar origen") + "</strong>: " + usu.name_place_origen + "</strong>";
                        html += "<br /><br />";
                        html += "<br /><strong>" + nw.tr("Dirección Destino") + "</strong>: " + self.ui.address_destino.getValue() + "</strong>";
                        html += "<br /><strong>" + nw.tr("Ciudad destino") + "</strong>: " + usu.ciudad_destino + "</strong>";
                        html += "<br /><strong>" + nw.tr("Lugar destino") + "</strong>: " + usu.name_place_destino + "</strong>";
                        html += "</div>";

                        var options = {};
                        options.useDialogNative = false;
                        options.cleanHtml = false;
                        nw.dialog(html, false, false, options);
                        self.loadInitial();
                        self.activeNormal();
                        self.reziseNormalMap();
                        return false;
                    }
                    selfthis.evalueContinuarPoliLyne();

                };
                rpc.exec("consultaTarifasAllApp", usu, func);
            });
        }, 100);

        nw.loadingRemove();
        $(".backInShowServices").addClass("backInShowServices_show");
        self.ui.contenedor_address.removeClass("contenedor_address_show");

//        });
    },
    destruct: function () {
    },
    members: {
        evalueContinuarPoliLyne: function () {
            var selfthis = this;
            var self = selfthis.self;
//            if (self.usePoliLyneInSolicitudService === true) {
            if (self.configCliente.usar_api_polylinea_pedir_servicio === "SI") {
                return selfthis.continuarConPoliLyne();
            }
            if (self.arrayParadas.length > 0) {
                selfthis.continuarConPoliLyne();
            } else {
                selfthis.continuarSinPoliLyne();
            }
        },
        continuarConPoliLyne: function () {
            var selfthis = this;
            var self = selfthis.self;
            var no_line = selfthis.no_line;

            var func_one = function (response) {
                if (self.debugConstruct) {
                    console.log("REPONSE_POLYLINE::f_traeTarifasContinua:::response", response);
                }
                if (!response) {
                    selfthis.continuarSinPoliLyne();
                    return false;
                }
                self.pathOriginToDestiny = JSON.stringify(response.pathOnetoOne);
//                self.poly.tiempo = response[0].legs[0].duration.value;
                self.poly.tiempo = response[0].legs[0].duration_in_traffic.value;

//                self.poly.tiempo_text = response[0].legs[0].duration.text;
                self.poly.tiempo_text = response[0].legs[0].duration_in_traffic.text;
                self.poly.total_metros = response[0].legs[0].distance.value;
                self.poly.total_metros_text = response[0].legs[0].distance.text;
                self.mostrarServicios(no_line, self.__data_service, self.recargosInit);
                self.__recargos = self.recargosInit;

                var bounds = new google.maps.LatLngBounds();
                bounds.extend({lat: parseFloat(self.geo.latitude), lng: parseFloat(self.geo.longitude)});
                bounds.extend({lat: parseFloat(self.geoDestino.latitudDes), lng: parseFloat(self.geoDestino.longitudDes)});
                for (var i = 0; i < self.arrayParadas.length; i++) {
                    if (nw.evalueData(self.arrayParadas[i].latitud) && nw.evalueData(self.arrayParadas[i].longitud)) {
                        bounds.extend({lat: parseFloat(self.arrayParadas[i].latitud), lng: parseFloat(self.arrayParadas[i].longitud)});
                    }
                }
//                map.setCenter(bounds.getCenter());
                if (!nwgeo.native) {
                    self.map.fitBounds(bounds);
                }
            };
            var map = self.map;
            var coords = {lat: self.geo.latitude, lng: self.geo.longitude, lat2: self.geoDestino.latitudDes, lng2: self.geoDestino.longitudDes};
            var multipleCoords = true;
            var onlyGetData = false;
            if (no_line === true) {
                onlyGetData = true;
            }
            var animateOrCenter = "animate";
            if (!self.animations3D) {
                animateOrCenter = "center";
            }
            if (self.debug) {
                console.log("coords", coords);
            }
            var polyName = false;
            var removeAllPolys = true;
            var funcGetNamePoly = false;
            var arrayParadas = self.arrayParadas;
            self.line = nwgeo.addLineStreet(map, coords, func_one, main.colorPolyLine, onlyGetData, animateOrCenter, multipleCoords, polyName, removeAllPolys, funcGetNamePoly, arrayParadas);
        },
        continuarSinPoliLyne: function () {
            var selfthis = this;
            var self = selfthis.self;
            var no_line = selfthis.no_line;
            var origenLat = parseFloat(self.geo.latitude);
            var origenLng = parseFloat(self.geo.longitude);
            var destinoLat = parseFloat(self.geoDestino.latitudDes);
            var destinoLng = parseFloat(self.geoDestino.longitudDes);
            var d = nwgeo.distance(origenLat, origenLng, destinoLat, destinoLng);
            d = (d * 0.001);
            var km = d.toFixed(2);
            var time = nwgeo.getTimeToDistanceAndSpeed(km, 15);
            self.poly.tiempo = time * 60;
            self.poly.tiempo_text = Math.round(time) + " Minutos";
            self.poly.total_metros = km * 1000;
            self.poly.total_metros_text = km + "KM";
            self.mostrarServicios(no_line, self.__data_service, self.recargosInit);

            var coords = {lat: self.geo.latitude, lng: self.geo.longitude, lat2: self.geoDestino.latitudDes, lng2: self.geoDestino.longitudDes};
//            nwgeo.addPilyLineNative(self.map, coords);

            var HND_AIR_PORT = {lat: coords.lat, lng: coords.lng};
            var SFO_AIR_PORT = {lat: coords.lat2, lng: coords.lng2};
            var AIR_PORTS = [];
            AIR_PORTS.push({lat: coords.lat, lng: coords.lng});
            nwgeo.animateCamera(self.map, {target: {lat: coords.lat, lng: coords.lng}, zoom: 18, tilt: 40, bearing: 100, duration: 2000});

            var bounds = new google.maps.LatLngBounds();
            bounds.extend({lat: parseFloat(self.geo.latitude), lng: parseFloat(self.geo.longitude)});
            bounds.extend({lat: parseFloat(self.geoDestino.latitudDes), lng: parseFloat(self.geoDestino.longitudDes)});
            for (var i = 0; i < self.arrayParadas.length; i++) {
                if (nw.evalueData(self.arrayParadas[i].latitud) && nw.evalueData(self.arrayParadas[i].longitud)) {
                    bounds.extend({lat: parseFloat(self.arrayParadas[i].latitud), lng: parseFloat(self.arrayParadas[i].longitud)});
                    nwgeo.animateCamera(self.map, {target: {lat: parseFloat(self.arrayParadas[i].latitud), lng: parseFloat(self.arrayParadas[i].longitud)}, zoom: 18, tilt: 40, bearing: 100, duration: 2000});

                    AIR_PORTS.push({lat: parseFloat(self.arrayParadas[i].latitud), lng: parseFloat(self.arrayParadas[i].longitud)});
                }
            }

            AIR_PORTS.push({lat: coords.lat2, lng: coords.lng2});
            nwgeo.animateCamera(self.map, {target: {lat: coords.lat2, lng: coords.lng2}, zoom: 18, tilt: 40, bearing: 100, duration: 2000});

            nwgeo.animateCamera(self.map, {target: AIR_PORTS, zoom: 18, tilt: 40, bearing: 100, duration: 3000});

//            map.setCenter(bounds.getCenter());
            if (!nwgeo.native) {
                self.map.fitBounds(bounds);
            }
        },
        validaAeropuerto: function (string) {
            console.log("string", string);
            if (!nw.utils.evalueData(string)) {
                return false;
            }
            string = string.toLowerCase();
            console.log("string", string);
            if (string.indexOf("aeropuerto") != -1 || string.indexOf("airport") != -1) {
                console.log("Is Airport???? SIII");
                return true;
            }
            console.log("Is Airport???? NOOOOOO");
            return false;
        },
        slotHomologacionCiudades: function slotHomologacionCiudades(callback) {
            var selfthis = this;
            var self = selfthis.self;
            var usu = {};
            usu.empresa = self.up.company;
            usu.usuario = self.up.user;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            var func = function (r) {
                console.log("ciudades homologadas", r);
                callback(r);
            };
            rpc.exec("populateCiudadesHomologadas", usu, func);

        }
    }
});