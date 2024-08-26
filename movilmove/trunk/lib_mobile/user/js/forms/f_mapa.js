nw.Class.define("f_mapa", {
    extend: nw.forms,
    construct: function (datos, callback) {
        var self = this;
        self.id = "f_mapa";
        self.setTitle = "<span>Mapa</span>";
        self.showBack = true;
        self.closeBack = false;
        self.data_service = datos;
        self.poly = {};
        self.geo = {};
        self.geoDestino = {};
        self.callback = callback;
        self.createBase();

        self.markerMove = null;
        self.add = false;
        self.mapType = "hybrid";
        self.markersCalor = [];
        var fields = [
            {
                styleContainer: "margin:0;",
                style: "",
                label: "",
                name: "mapa_edit",
                mode: "div",
                type: "startGroup"
            },
            {
                mode: "div",
                type: "endGroup"
            },
            {
                style: '',
                label: "",
                mode: "div",
                name: "contenedor_btn_fijar",
                type: "startGroup",
//                visible: false,
            },
            {
                styleContainer: 'margin: 0;',
                style: '',
                icon: "material-icons location_on normal",
                type: 'search',
                label: 'Origen',
                visible_label: false,
                name: 'address',
                required: true,
                enabled: false,
                placeholder: 'Mi ubicación actual',
//                visible: true
            },
            {
                styleContainer: 'margin: 0;',
                style: '',
                icon: "material-icons near_me normal",
                type: 'search',
                label: 'Destino',
                visible_label: false,
                name: 'address_destino',
                required: true,
                placeholder: 'Destino',
//                visible: true
            },
            {
                mode: "div",
                type: "endGroup"
            }
        ];
        self.setFields(fields);
        self.buttons = [];
        self.buttons.push(
                {
                    icon: "",
                    position: "bottom",
                    name: "cancelar",
                    label: "Cancelar",
                    callback: function (a) {
                        nw.back();
                    }
                },
                {
                    icon: "",
                    position: "bottom",
                    name: "guardar",
                    label: "Guardar",
                    callback: function (a) {
                        self.updateService();
                    }
                }
        );
        self.show();
        self.createMapa();
        self.createActionsInputsSearchDirections();
        console.log("datos", datos);
        self.ui.address.setValue(datos.origen);
    },
    destruct: function () {
    },
    members: {
        createMapa: function (callback) {
            var latitude = nwgeo.latitude;
            var longitude = nwgeo.longitude;
            if (!nw.evalueData(latitude) && nw.evalueData(window.localStorage.getItem("nwgeo_latitude"))) {
                latitude = parseFloat(window.localStorage.getItem("nwgeo_latitude"));
            }
            if (!nw.evalueData(longitude) && nw.evalueData(window.localStorage.getItem("nwgeo_longitude"))) {
                longitude = parseFloat(window.localStorage.getItem("nwgeo_longitude"));
            }
            var self = this;
            var mape = new nwgeo.getMap();
//            mape.styleMap = nwgeo.styleDark();
            mape.mapType = "roadmap";
            mape.zoomControl = true;
            mape.mapTypeControl = true;
            mape.animate = true;
            mape.bearing = 0;
            mape.tilt = 0;
            mape.durationAnimation = 2000;
            mape.iconMarker = 'img/pin_negro_44.png';
            if (nw.evalueData(config.iconDriverPuntoB)) {
                mape.iconMarker = config.iconDriverPuntoB;
            }
            mape.canvas = document.querySelector(self.canvas + ' .mapa_edit');
            mape.latitude = latitude;
            mape.longitude = longitude;
            mape.zoom = 16;
            self.map = mape.show(function () {
            });
            self.newMarker();
            nwgeo.dragMap("drag", self.map, function (e) {
//                console.log("drag");
//                if (self.add === true) {
//                    var pos = self.getPosCenterMap();
//                    nwgeo.setPositionMarker(self.markerMove, pos.lat, pos.lng);
//                }
            });
//            nwgeo.dragMap("dragstart", self.map, function (e) {
//                console.log("dragstart");
//                if (self.add === true) {
//
//                }
//            });
//            nwgeo.dragMap("dragend", self.map, function (e) {
//                console.log("dragend");
//                if (self.add === true) {
////                    nwgeo.removeMarker(self.markerMove);
//                }
//            });
        },
        createActionsInputsSearchDirections: function createActionsInputsSearchDirections() {
            var self = this;

            var input = document.querySelector('#f_mapa .address_destino');
            nwgeo.autocomplete(input, self.map, function (r) {
                self.pointMapDestino(r);
            }, main.configCliente.paises_iso_relation_autocomplete_maps);
        },
        updateService: function updateService(r) {
            var self = this;
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = self.nuevos_datos;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.usuario = up.usuario;
            data.id_servicio_edit = self.data_service.id;
            console.log(data);
//            return;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (ra) {
                self.callback();
                nw.dialog("Se guardo correctamente.");
                nw.back();
            };
            rpc.exec("updateServiceDirOrigen", data, func);
        },
        pointMapDestino: function pointMapDestino(r) {
            var self = this;
            nwgeo.removeAllPolyLines();
            if (self.markerDestino) {
                nwgeo.removeMarker(self.markerDestino);
            }
            var dat = {};
            if (self.debug) {
                console.log("pointMapDestino()", r)
            }
            dat.lat = r.place.geometry.location.lat();
            dat.lng = r.place.geometry.location.lng();
            dat.name = r.results.address;
            dat.icon = r.place.icon;
            dat.name_place = r.place.name;
            dat.ciudad = r.results.ciudad;
            self.dataDestino = dat;
            if (!nw.evalueData(dat.ciudad) && nw.evalueData(dat.name_place)) {
                dat.ciudad = dat.name_place;
            }
            self.pointMapDestinoExec(dat);
        },
        pointMapDestinoExec: function pointMapDestinoExec(r) {
            var self = this;
//            self.cleanMarkerDestino();
            if (nw.evalueData(r.ciudad)) {
                self.ciudad_destino = r.ciudad;
            }
            console.log(r);
            if (nw.evalueData(r.name_place)) {
                self.name_place_destino = r.name_place;
                self.name_place_destino_text = r.name_place;
            }
            if (nw.evalueData(r.name)) {
                self.name_place_destino = r.name;
            }
            var marker = new nwgeo.addMarker();
            marker.map = self.map;
            marker.latitude = r.lat;
            marker.longitude = r.lng;
            if (nw.evalueData(r.name)) {
                marker.title = r.name;
            }
            marker.label = "";
            marker.icon = config.domain_rpc + config.carpet_files_extern + '/img/pin_negro_44.png';
            if (nw.evalueData(config.iconDriverPuntoB)) {
                marker.icon = config.iconDriverPuntoB;
            }
            marker.draggable = false;
            marker.animation = false;
            self.markerDestino = marker.show(function () {});
            if (nw.evalueData(r.name)) {
                self.ui.address_destino.setValue(r.name);
                self.dataGeoTwo = r;
                self.dataGeoTwoName = r.name;
                self.geoDestino.latitudDes = r.lat;
                self.geoDestino.longitudDes = r.lng;
                self.geoDestino.ciudad_destino = r.ciudad;
                self.continuar();
            }
        },
        continuar: function continuar() {
            var self = this;
            var recargos = {};
            recargos.total = 0;
            recargos.paradas = 0;
            nw.loading();
            self.recargosConsult(function (e) {
                if (e.length > 0) {
                    for (var f = 0; f < e.length; f++) {
                        var val = e[f].valor;
                        if (e[f].nombre.toLowerCase() == "parada adicional") {
                            recargos.paradas = val;
                        } else {
                            recargos.total = parseFloat(recargos.total) + parseFloat(val);
                        }
                    }
                }

                var up = nw.userPolicies.getUserData();
                var usu = {};
                usu.empresa = up.empresa;
                usu.ciudad_origen = self.data_service.ciudad_origen;
                usu.name_place_origen = self.data_service.origen;
                usu.ciudad_destino = self.ciudad_destino;
                usu.name_place_destino = self.name_place_destino;
                usu.name_place_destino_text = self.name_place_destino_text;
                self.name_place_origen = usu.name_place_origen;
                if (nw.evalueData(nwgeo.type)) {
                    usu.type = nwgeo.type;
                }
                var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                rpc.setLoading(false);
                var func = function (r) {
                    console.log(r);
//                    self.__data_service = r;
                    var leng = r.length;
                    if (leng === 0) {
                        nw.loadingRemove();
                        nw.dialog("Lo sentimos, no tenemos cobertura para el sitio indicado");
                        return false;
                    }
                    var func_one = function (response) {
                        console.log(response)
                        self.pathOriginToDestiny = JSON.stringify(response.pathOnetoOne);
//                        self.poly.tiempo = response[0].legs[0].duration.value;
                        self.poly.tiempo = response[0].legs[0].duration_in_traffic.value;
//                        self.poly.tiempo_text = response[0].legs[0].duration.text;
                        self.poly.tiempo_text = response[0].legs[0].duration_in_traffic.text;
                        self.poly.total_metros = response[0].legs[0].distance.value;
                        self.poly.total_metros_text = response[0].legs[0].distance.text;
                        self.mostrarServicios(r, recargos);
                        self.__recargos = recargos;
                    }

                    var map = self.map;
                    console.log(map)
                    var coords = {lat: parseFloat(self.data_service.latitudOri), lng: parseFloat(self.data_service.longitudOri), lat2: self.geoDestino.latitudDes, lng2: self.geoDestino.longitudDes};
                    console.log(coords)
                    var multipleCoords = true;
                    var onlyGetData = false;
                    var animateOrCenter = "animate";
                    self.line = nwgeo.addLineStreet(map, coords, func_one, main.colorPolyLine, onlyGetData, animateOrCenter, multipleCoords);
                    var zoom = false;
                    var bounds = [
                        {"lat": parseFloat(self.data_service.latitudOri), "lng": parseFloat(self.data_service.longitudOri)},
                        {"lat": self.geoDestino.latitudDes, "lng": self.geoDestino.longitudDes}
                    ];
                    var multiplePoints = true;
                    nwgeo.centerMap(self.map, self.markerMove, self.markerDestino, zoom, bounds, multiplePoints);
                    nw.loadingRemove();

                };
                rpc.exec("consultaTarifasAllApp", usu, func);
            });
        },
        mostrarServicios: function mostrarServicios(r, recargos) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            self.datosServicio = {'r': r, 'recargos': recargos};
//            var paradas = self.navTable.getAllData();
//            var cant_para = paradas.length;
            var cant_para = 0;
            var recargos_total = recargos.total;
            if (cant_para > 0 && parseFloat(recargos.paradas) > 0) {
                var valor_para = parseInt(cant_para) * parseFloat(recargos.paradas);
                recargos_total = parseFloat(recargos.total) + parseInt(valor_para);
            }
            var leng = r.length;
            var count = 0;
            for (var i = 0; i < leng; i++) {
                var servi = r[i];
                var others = {};
                var totalunimetros = 0;
                console.log(self.poly.total_metros);
                console.log(servi.metros);
                console.log(self.poly.tiempo);
                console.log(servi.tiempo);
                if (typeof servi.metros !== 'undefined' && servi.metros != "" && parseFloat(servi.metros) > 0) {
                    totalunimetros = parseFloat(self.poly.total_metros) / parseFloat(servi.metros);
                }
                console.log(totalunimetros);
                var valordistancia = parseFloat(totalunimetros) * parseFloat(servi.valor_unidad_metros);
                if (isNaN(valordistancia)) {
                    valordistancia = 0;
                }
                console.log(valordistancia);

                var totaluniminutos = 0;
                if (typeof servi.tiempo !== 'undefined' && servi.tiempo != "" && parseFloat(servi.tiempo) > 0) {
                    var totaluniminutos = parseFloat(self.poly.tiempo) / parseFloat(servi.tiempo);
                }
                console.log(totaluniminutos);
                var valorminutos = parseFloat(totaluniminutos) * parseFloat(servi.valor_unidad_tiempo);
                if (isNaN(valorminutos)) {
                    valorminutos = 0;
                }
                console.log(valorminutos);
                var valor_estimado = parseFloat(valordistancia) + parseFloat(valorminutos) + parseFloat(servi.valor_banderazo) + parseFloat(recargos_total);
                var minima = parseFloat(servi.minima);
                console.log(recargos);
                others.recargos = recargos_total;
                others.valorbase = servi.valor_banderazo;
                others.totaluniminutos = parseInt(totaluniminutos);
                others.valorminutos = valorminutos;
                others.totalunimetros = parseInt(self.poly.total_metros);
                others.valordistancia = parseFloat(valordistancia);
                others.unidad_metros = servi.metros;
                others.valor_unidad_metros = servi.valor_unidad_metros;
                others.unidad_tiempo = servi.tiempo;
                others.valor_unidad_tiempo = servi.valor_unidad_tiempo;
                others.valor_metros_add = servi.valor_metros_add;
                others.inicia_metros_add = servi.inicia_metros_add;
                others.concepto_recargo = "";
                others.metros_cobro_recargo = 0;
                others.valor_recargo = 0;
                console.log(servi.valor_recargo);
                if (nw.evalueData(servi.valor_recargo)) {
                    others.metros_cobro_recargo = servi.metros_cobro_recargo;
                    others.valor_recargo = servi.valor_recargo;
                    others.concepto_recargo = servi.concepto_recargo;
                }
                valor_estimado = parseFloat(valor_estimado) + parseFloat(others.valor_recargo);
                console.log(valor_estimado);
                others.valor_peajes = 0;
                others.metros_cobro_peaje = 0;
                if (nw.evalueData(servi.valor_peajes)) {
                    others.valor_peajes = servi.valor_peajes;
                    others.metros_cobro_peaje = servi.metros_cobro_peaje;
                }
                valor_estimado = parseFloat(valor_estimado) + parseFloat(others.valor_peajes);

                if (valor_estimado < minima) {
                    valor_estimado = minima;
                }

                if (self.cobro === "LIBRE") {
                    valor_estimado = 0;
                }
                if (servi.solo_para_mujeres === "SI" && up.genero === "hombre") {
                    continue;
                }
                var valor_tarifa_fija = false;


                if (nw.evalueData(servi.ciudad_o_lugar_origen) && nw.evalueData(servi.ciudad_o_lugar_destino)) {
                    var patt = new RegExp(self.name_place_destino_text);
                    var conincid = patt.test(servi.ciudad_o_lugar_destino);
                    console.log(self.data_service.ciudad_origen);
                    console.log(servi.ciudad_o_lugar_origen);
                    console.log("yy");
                    console.log(self.ciudad_destino);
                    console.log(servi.ciudad_o_lugar_destino);

                    console.log(self.name_place_origen);
                    console.log(servi.ciudad_o_lugar_origen);
                    console.log("yy");
                    console.log(self.name_place_destino);
                    console.log(servi.ciudad_o_lugar_destino);

                    console.log(self.data_service.ciudad_origen);
                    console.log(servi.ciudad_o_lugar_origen);
                    console.log("yy");
                    console.log(conincid);
                    console.log(self.name_place_destino_text);
                    console.log("ee");


                    if (self.data_service.ciudad_origen === servi.ciudad_o_lugar_origen && self.ciudad_destino === servi.ciudad_o_lugar_destino
                            || self.data_service.ciudad_origen === servi.ciudad_o_lugar_origen && self.name_place_destino === servi.ciudad_o_lugar_destino
                            || self.name_place_origen === servi.ciudad_o_lugar_origen && self.name_place_destino === servi.ciudad_o_lugar_destino
                            || self.name_place_origen === servi.ciudad_o_lugar_origen && self.ciudad_destino === servi.ciudad_o_lugar_destino
                            || self.data_service.ciudad_origen === servi.ciudad_o_lugar_origen && conincid) {
                        if (servi.valor_tarija_fija !== "trayecto") {
                            valor_tarifa_fija = servi.valor_tarija_fija;
                            count++;
                        } else {
                            count++;
                        }
                    } else {
                        continue;
                    }
                }
//                count++;
                var dt = {};
                dt.valor_estimado = valor_estimado;
                dt.iva = parseInt(servi.iva);
                dt.ptm = self.poly.total_metros_text;
                dt.pt = self.poly.tiempo_text;
                dt.total_metros = self.poly.total_metros;
                dt.tiempo = Math.round(self.poly.tiempo / 60);
                dt.servi = servi;
                dt.others = others;
                dt.id_servi = servi.id;
                dt.id_tarifa = servi.id_service_tarifa_fija;
                dt.iva = valor_estimado * dt.iva / 100;
                dt.valor_estimado = valor_estimado + dt.iva;
                dt.valor_estimado = Math.round(dt.valor_estimado);
                console.log(self.dataDestino);
                dt.destino = self.dataDestino.name;
                dt.ciudad_destino = self.dataDestino.ciudad;
                dt.latitudDes = self.dataDestino.lat;
                dt.longitudDes = self.dataDestino.lng;
                console.log(dt);
                if (self.data_service.tarifa != "trayecto") {
                    dt.valor_estimado = self.data_service.valor;
                }
                if (servi.id === self.data_service.servicio) {
                    self.nuevos_datos = dt;
                    break;
                }
//                self.showPrice(valor_estimado, servi.iva, self.poly.total_metros_text, self.poly.tiempo_text, servi, valor_tarifa_fija, others, count);
            }
            if (count === 0) {
                nw.loadingRemove();
                nw.dialog("Lo sentimos, no hay cobertura para tu zona");
                return false;
            }
        },
        recargosConsult: function recargosConsult(callback) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.usuario = up.usuario;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (ra) {
                if (self.debug) {
                    console.log("recargosConsult", ra);
                }
                if (ra === "USUARIO_NO_EXISTE") {
                    nw.dialog("El usuario no existe o está inactivo");
                    return false;
                }
                var r = ra.recargos;
                callback(r);
            };
            rpc.exec("populateRecargos", data, func);
        },
        newMarker: function newMarker() {
            var self = this;
            self.add = true;
            console.log(self.map);
//            self.ui.contenedor_btn_fijar.setVisibility(true);
//            var pos = self.getPosCenterMap();
            var marker = new nwgeo.addMarker();
            marker.map = self.map;
            marker.latitude = parseFloat(self.data_service.latitudOri);
            marker.longitude = parseFloat(self.data_service.longitudOri);
            marker.title = "";
            marker.label = "";
            marker.icon = config.domain_rpc + config.carpet_files_extern + '/img/pin46.png';
            if (nw.evalueData(config.iconDriverPuntoA)) {
                marker.icon = config.iconDriverPuntoA;
            }
            marker.draggable = false;
            marker.animation = false;
            console.log(marker);
            self.markerMove = marker.show();
        },
        removeMarkersMap: function removeMarkersMap() {
            var self = this;
            var t = self.markersCalor.length;
            for (var i = 0; i < t; i++) {
                nwgeo.removeMarker(self.markersCalor[i]);
            }
            return true;
        },
        getPosCenterMap: function () {
            var self = this;
            var lat = 0;
            var lng = 0;
            if (!nwgeo.native) {
                lat = self.map.center.lat();
                lng = self.map.center.lng();
            } else {
                var target = self.map.getCameraTarget();
                lat = target.lat;
                lng = target.lng;
            }
            return {lat: lat, lng: lng};
        }

    }
});