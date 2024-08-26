qx.Class.define("transmovapp.forms.f_mapa_liquidar_servicio", {
    extend: qxnw.forms,
    properties: {
        position: {
            init: null,
            check: "Object"
        }
    },
    construct: function (r, e) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader("Mapa liquidar servicio");
        self.setTitle("Mapa liquidar servicio");
        self.marker = false;
        self.markerc = false;

        self.dataService = r;

        self.markerDestino = false;
        self.encodedPolyline = false;
        self.permitirReasignarConductor = false;

        self.parent = {};
        self.__oldMarker2 = {};
        self.__oldMarkerAll = [];
        self.r = r;
        self.configCliente = main.getConfiguracion();
        self.dat = {};
        var fields = [
            {
                name: "Datos del servicio iniciales",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "recogiendo",
                label: self.tr("<strong>Valor Tentativo inicial</strong>"),
                caption: "recogiendo",
                type: "textField",
                mode: "money",
                required: true,
                enabled: false
            },
            {
                name: "sitio",
                label: self.tr("<strong>Duración Tiempo Viaje (MIN)</strong>"),
                caption: "sitio",
                type: "textField",
                required: false,
                enabled: false
            },
            {
                name: "transportando",
                label: self.tr("<strong>Trayecto viaje (KM)</strong>"),
                caption: "transportando",
                type: "textField",
                required: false,
                enabled: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Datos del servicio para liquidar",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "valor_final",
                label: self.tr("<strong>Valor final del servicio</strong>"),
                caption: "valor_final",
                type: "textField",
                mode: "money",
                required: true
            },
            {
                name: "tiempo",
                label: self.tr("<strong>Duración final del viaje (MIN)</strong>"),
                caption: "tiempo",
                type: "textField",
                required: false
            },
            {
                name: "total_metros_final",
                label: self.tr("<strong>Trayecto viaje final (KM)</strong>"),
                caption: "total_metros_final",
                type: "textField",
                required: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Observaciones",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "observaciones_liquidacion",
                label: self.tr("<strong>Observaciones (paradas adicionales, otros gastos)</strong>"),
                caption: "observaciones_liquidacion",
                type: "textArea",
                required: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.setFields(fields);

        self.ui.accept.addListener("execute", function () {
//            self.slotSave();
            self.slotCond();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        console.log("f_mapa_liquidar_servicios:::r:::", r);

        if (main.evalueData(r.valor)) {
            self.ui.recogiendo.setValue(r.valor);
            self.ui.valor_final.setValue(r.valor);
        }
        if (main.evalueData(r.tiempo_estimado)) {
            self.ui.sitio.setValue(r.tiempo_estimado);
            self.ui.tiempo.setValue(r.tiempo_estimado);
        }
        if (main.evalueData(r.total_metros)) {
            self.ui.transportando.setValue(r.total_metros);
        }
        if (main.evalueData(r.total_metros_final)) {
            self.ui.total_metros_final.setValue(r.total_metros_final);
        }

        self.dat.id = r.id;
        self.dat.usuario = r.usuario;
        self.dat.usuario_anterior_service = r.conductor_id;

        console.log("self.dat", self.dat);

        self.ciudad_origen = r.ciudad_origen;
        if (r.valor_total_servicio === "" && r.estado !== "SOLICITUD") {
            if (r.conductor_id !== "undefined" && r.conductor_id !== null && r.conductor_id !== "" && r.conductor_id !== false) {
//        if (r.estado === "EN_SITIO" || r.estado === "EN_RUTA") {
                if (self.permitirReasignarConductor != true) {
                    self.framePositionCondutor(r);
                    self.interval = setInterval(function () {
                        self.framePositionCondutor(r);
                    }, 30000);
                }
            }
        }
        var coords = {};
        var latitude = 4.598056;
        var longitude = -74.075833;
        self.googleMap = new qxnw.maps(latitude, longitude);
        self.googleMap.setZoom(12);
        self.googleMap.setDragableMap(true);
        self.googleMap.setCreateMarkers(false);
        var mapWidget = self.googleMap.createGoogleMap();
        self.conductor_servi = r.conductor_id;
        self.navtable = self.insertNavTable(mapWidget);
        self.addListener("appear", function () {
            console.log(r);
            var element = self.navtable.getContentElement().getDomElement();
            var div = document.createElement('div');
            div.className = 'detalle_service';
            var html = "";
            html += "<p class='item_see'><strong>Conductor: </strong> " + r.conductor + "</p>";
            html += "<p class='item_see'><strong>Placa: </strong> " + r.placa + "</p>";
            html += "<p class='item_see'><strong>Valor Total final: </strong> " + r.valor_total_servicio + "</p>";
            html += "<p class='item_see'><strong>Fecha Solicitud: </strong> " + r.hora_fecha + "</p>";
            html += "<p class='item_see'><strong>Origen: </strong> " + r.origen + "</p>";
            html += "<p class='item_see'><strong>Destino: </strong>" + r.destino + "</p>";
            html += "<p class='item_see'><strong>Tipo Servicio: </strong>" + r.tipo_servicio + "</p>";
            html += "<p class='item_see'><strong>Valor Estimado: </strong>" + r.valor + "</p>";
            html += "<p class='item_see'><strong>Creado en PC: </strong>" + r.creado_por_pc + "</p>";
            html += "<p class='item_see'><strong>Tiempos Servicio: </strong>" + r.incio_fin + "</p>";
            html += "<p class='item_see'><strong>Tiempo Estimado LLegada: </strong>" + r.tiempo_estimado + "</p>";
            html += "<p class='item_see'><strong>Tiempo Total Del Viaje: </strong>" + r.tiempo_finalizado + "</p>";

            html += "<b class='origenInit' style='display:none;'></b></br>";
            html += "<b class='destinoEnd' style='display:none;'></b></br>";

            if (self.configCliente.app_para == "CARGA") {
                if (qxnw.utils.evalue(r.numero_auxiliares)) {
                    html += "<b><strong>Numero Auxiliares: </strong>" + r.numero_auxiliares + "</b></br>";
                }
                if (qxnw.utils.evalue(r.salida_periferia)) {
                    html += "<b><strong>Salida periferia: </strong>" + r.salida_periferia + "</b></br>";
                }
                if (qxnw.utils.evalue(r.despacho)) {
                    html += "<b><strong>Despacho: </strong>" + r.despacho + "</b></br>";
                }
                if (qxnw.utils.evalue(r.retorno)) {
                    html += "<b><strong>Retorno: </strong>" + r.retorno + "</b></br>";
                }
                if (qxnw.utils.evalue(r.cargue)) {
                    html += "<b><strong>Cargue: </strong>" + r.cargue + "</b></br>";
                }
                if (qxnw.utils.evalue(r.descargue)) {
                    html += "<b><strong>Descargue: </strong>" + r.descargue + "</b></br>";
                }
                if (qxnw.utils.evalue(r.observaciones_servicio)) {
                    html += "<b><strong>Observaciones servicio: </strong>" + r.observaciones_servicio + "</b></br>";
                }
                if (qxnw.utils.evalue(r.contacto_recogida)) {
                    html += "<b><strong>Contacto recogida: </strong>" + r.contacto_recogida + "</b></br>";
                }
                if (qxnw.utils.evalue(r.telefono_recogida)) {
                    html += "<b><strong>Telefono recogida: </strong>" + r.telefono_recogida + "</b></br>";
                }
                if (qxnw.utils.evalue(r.observaciones_recogida)) {
                    html += "<b><strong>Observaciones recogida: </strong>" + r.observaciones_recogida + "</b></br>";
                }
                if (qxnw.utils.evalue(r.contacto_entrega)) {
                    html += "<b><strong>Contacto entrega: </strong>" + r.contacto_entrega + "</b></br>";
                }
                if (qxnw.utils.evalue(r.telefono_entrega)) {
                    html += "<b><strong>Telefono entrega: </strong>" + r.telefono_entrega + "</b></br>";
                }
                if (qxnw.utils.evalue(r.observaciones_entrega)) {
                    html += "<b><strong>Observaciones entrega: </strong>" + r.observaciones_entrega + "</b></br>";
                }
                if (qxnw.utils.evalue(r.cantidad)) {
                    html += "<b><strong>cantidad: </strong>" + r.cantidad + "</b></br>";
                }
                if (qxnw.utils.evalue(r.volumen)) {
                    html += "<b><strong>Volumen: </strong>" + r.volumen + "</b></br>";
                }
                if (qxnw.utils.evalue(r.peso)) {
                    html += "<b><strong>Peso: </strong>" + r.peso + "</b></br>";
                }
                if (qxnw.utils.evalue(r.empaque)) {
                    html += "<b><strong>Empaque: </strong>" + r.empaque + "</b></br>";
                }
                if (qxnw.utils.evalue(r.valor_declarado)) {
                    html += "<b><strong>Valor declarado: </strong>" + r.valor_declarado + "</b></br>";
                }
            }
            div.innerHTML = html;
            element.appendChild(div);
        });

        self.googleMap.setManageCoordinates(true);

        var origen;
        var ciudadOrigen;
        var position = "";

        origen = "<span style='text-decoration: underline;'>Origen</span></br>" + r.origen + " " + r.ciudad_origen;
        ciudadOrigen = r.ciudad_origen;
        if (self.__oldMarker1 != null) {
            self.__oldMarker1.setMap(null);
        }
        if (r.latitudOri && r.longitudOri) {
            console.log(e);
            if (e) {
                var dir = JSON.parse(e.data.text);
                var latLong = new google.maps.LatLng(dir.lat, dir.lng);
                var marker = self.googleMap.placeMarker(latLong, false, false, "/app/img/icono-marker-desti.png", true);
                position = {lat: marker.position.lat(), lng: marker.position.lng()};
            }
            ubicarRutaReal(r);
        } else {
            document.addEventListener("addMarkerOrigen", function (e) {
                if (self.marker) {
                    self.marker.setMap(null);
                }
                self.marker = self.googleMap.placeMarker(e.data.location, e.data.address);
                self.__oldMarker1 = self.marker;
                position = {lat: self.marker.position.lat(), lng: self.marker.position.lng()};
            });
            ubicarDestino(r, position);
        }
//        self.__oldMarker1 = marker;
//        document.addEventListener("addMarkerDestino", function (e) {


//        });
        function setMark(possit, punto) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': possit}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var address = results[0]['formatted_address'];
                    console.log(address);
//                    var marker = self.googleMap.placeMarker(possit, address);
                    if (punto == "origen") {
                        var marker = self.googleMap.placeMarker(possit, "<strong style='text-decoration: underline; color: #014390;'>Origen Inicio viaje </strong>", true, "/imagenes/origen_inicio.png", true);
                        var el = document.querySelector(".origenInit");
                        if (el) {
                            el.innerHTML = "<img style='position:relative;' src='/imagenes/origen_inicio.png' alt=''><span><strong style='text-decoration: underline;'>Origen Inicio: </strong> " + address;
                            +"</span>";
                            el.style = "cursor: pointer; display: flex;align-items: center;";
                            el.addEventListener("click", function () {
                                if (self.eventMarker) {
                                    google.maps.event.trigger(self.eventMarker, "click", {});
                                }
                                self.eventMarker = marker;
                                google.maps.event.trigger(marker, "click", {});
                            });
                        }
                    }
                    if (punto == "destino") {
                        var markerd = self.googleMap.placeMarker(possit, "<strong style='text-decoration: underline; color: #f64309;'>Destino Final viaje </strong>", true, "/imagenes/destino_fin.png", true);
                        var el = document.querySelector(".destinoEnd");
                        if (el) {
                            el.innerHTML = "<img style='position:relative;' src='/imagenes/destino_fin.png' alt=''><span><strong style='text-decoration: underline;'>Destino Final: </strong>" + address;
                            +"</span>";
                            el.style = "cursor: pointer; display: flex;align-items: center;";
                            el.addEventListener("click", function () {
                                if (self.eventMarker) {
                                    google.maps.event.trigger(self.eventMarker, "click", {});
                                }
                                self.eventMarker = markerd;
                                google.maps.event.trigger(markerd, "click", {});
                            });
                        }
                    }
                }

            });
        }
        function ubicarRutaReal(r) {
            var t = self.slotConsultaPositions(r);
            var DrivePath = [];
            if (t) {
                var latLong = new google.maps.LatLng(self.r.latitudOri, self.r.longitudOri);
//                var marker = self.googleMap.placeMarker(latLong, origen);
//              marcador  origen seleccionado cliente 
                var marker = self.googleMap.placeMarker(latLong, "<strong style='text-decoration: underline;'>Origen</strong>", true, "/imagenes/origen.png", true);

                var destino;
                if (!qxnw.utils.evalue(r.mapa)) {
                    destino = "<span style='text-decoration: underline;'>Destino</span></br>" + r.destino + " " + r.ciudad_destino;
                } else {
                    var direccionDestino = r.destino.split(",");
                    destino = "<span style='text-decoration: underline;'>Destino</span></br>" + direccionDestino[0];
                }
                var latLong = new google.maps.LatLng(r.latitudDes, r.longitudDes);
//                var markerDestino = self.googleMap.placeMarker(latLong, destino);
//              marcador Destino seleccionado cliente 
                var markerDestino = self.googleMap.placeMarker(latLong, "<strong style='text-decoration: underline; color: #c31a1a;'>Destino</strong>", true, "/imagenes/destino.png", true);
                console.log(t);
                if (t.length > 0) {
                    var latLongOrigen = new google.maps.LatLng(t[0].latitud, t[0].longitud);
                    setMark(latLongOrigen, "origen");

                    var latLongDestino = new google.maps.LatLng(t[t.length - 1].latitud, t[t.length - 1].longitud);
                    setMark(latLongDestino, "destino");

                    var leng = t.length;
                    for (var k = 0; k < leng; k++) {
                        var pos = t[k];
                        var position = new google.maps.LatLng(pos.latitud, pos.longitud);
                        DrivePath.push(position);
                    }
                    for (var p = 0; p < DrivePath.length - 1; p++) {
//                        se comenta mientras se arregla
//                        self.slotTrazarAllPosition(DrivePath[p], DrivePath[p + 1]);
                    }
                }
            } else {
                var latLong = new google.maps.LatLng(self.r.latitudOri, self.r.longitudOri);
//                var marker = self.googleMap.placeMarker(latLong, origen);
                var marker = self.googleMap.placeMarker(latLong, false, false, "/imagenes/origen.png", true);
                position = {lat: marker.position.lat(), lng: marker.position.lng()};
                ubicarDestino(self.r, position);
            }

            self.addListener("appear", function () {
                var ori = document.querySelector('.origen');
                if (ori) {
                    ori.addEventListener("click", function () {
                        if (self.eventMarker) {
                            google.maps.event.trigger(self.eventMarker, "click", {});
                        }
                        self.eventMarker = marker;
                        google.maps.event.trigger(marker, "click", {});
                    });
                }
                var des = document.querySelector('.destino');
                if (des) {
                    des.addEventListener("click", function () {
                        if (self.eventMarker) {
                            google.maps.event.trigger(self.eventMarker, "click", {});
                        }
                        if (self.markerDestino) {
                            self.eventMarker = self.markerDestino;
                            google.maps.event.trigger(self.markerDestino, "click", {});
                        } else {
                            self.eventMarker = markerDestino;
                            google.maps.event.trigger(markerDestino, "click", {});
                        }
                    });
                }
            });
        }

        function ubicarDestino(r, origen) {
//            var self = this;
            var destino;
            var ciudadDestino;

            console.log("self.dataService", self.dataService)
            console.log("rrrrrrrr", r)
            console.log("origen", origen)

//            if (!qxnw.utils.evalue(r.mapa)) {
//                destino = "<span style='text-decoration: underline;'>Destino</span></br>" + r.destino + " " + r.ciudad_destino;
//                ciudadDestino = r.ciudad_destino;
//            } else {
//                var direccionDestino = r.destino.split(",");
//                destino = "<span style='text-decoration: underline;'>Destino</span></br>" + direccionDestino[0];
//                ciudadDestino = direccionDestino[1].trim();
//            }
            destino = "<span style='text-decoration: underline;'>Destino</span></br>" + r.destino + " " + r.ciudad_destino;
            ciudadDestino = r.ciudad_destino;

//            self.googleMap.setPosition(r.resultsDestino.location);
            if (self.markerDestino) {
                self.markerDestino.setMap(null);
            }
            if (r.latitudDes && r.longitudDes) {
                var latLong = new google.maps.LatLng(r.latitudDes, r.longitudDes);
//                self.markerDestino = self.googleMap.placeMarker(latLong, destino);
                self.markerDestino = self.googleMap.placeMarker(latLong, false, false, "/imagenes/destino.png", true);
            } else {
//                self.markerDestino = self.googleMap.placeMarker(r.data.location, r.data.address);
                self.markerDestino = self.googleMap.placeMarker(r.data.location, false, false, "/imagenes/destino.png", true);
            }
            self.__oldMarker = self.markerDestino;
            var coords = {lat: origen.lat, lng: origen.lng, lat2: self.markerDestino.position.lat(), lng2: self.markerDestino.position.lng()};
            self.coords = coords;
            self.coordss = {lat: origen.lat, lng: origen.lng};
            self.slotTrazar(self.googleMap, coords);
        }

        if (self.configCliente.paradas_adicional == "SI") {
            self.slotParadasAdicionales();
        }
    },
    destruct: function () {
    },
    members: {
        navTable: null,
        slotConsultaPositions: function slotConsultaPositions(pr) {
            var self = this;
            var data = pr;
            var rpc = new qxnw.rpc(self.rpcUrl, "servicios");
            var e = rpc.exec("consultaPOsitionCond", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            console.log(e);
            return e;
//            var rpc = new qxnw.rpc(this.rpcUrl, "servicios");
//            rpc.setAsync(false);
//            var func = function (e) {
//            };
//            rpc.exec("consultaPOsitionCond", data, func);
        },
        slotParadasAdicionales: function slotParadasAdicionales() {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
            rpc.setAsync(true);
            var func = function (res) {
                console.log(res);
                if (qxnw.utils.evalue(res)) {
                    if (qxnw.utils.evalue(res.length)) {
                        if (res.length > 0) {
                            for (var i = 0; i < res.length; i++) {
                                var latLong = new google.maps.LatLng(res[i].latitud_parada, res[i].longitud_parada);
                                console.log(latLong);
                                var parada_add = self.googleMap.placeMarker(latLong, "Parada Adicional: " + res[i].direccion, true, "/imagenes/destino.png", true);
                            }
                        }
                    }
                }
            };
            rpc.exec("consultaParadasAdicionales", self.r, func);
        },
        slotTrazarAllPosition: function slotTrazarAllPosition(coords1, coords2) {
            var self = this;
            if (self.encodedPolyline) {
                self.encodedPolyline.setMap(null);
            }
            var travelMode = google.maps.TravelMode.DRIVING;
            var start = coords1;
            var end = coords2;
            var directionsService = new google.maps.DirectionsService();
//            console.log(directionsService);
            var request = {
                origin: start,
                destination: end,
                travelMode: travelMode,
                drivingOptions: {
                    departureTime: new Date(Date.now()),
                    trafficModel: "optimistic"
                }
            };
            directionsService.route(request, function (result, status) {
                var rta = "";
                if (status == google.maps.DirectionsStatus.OK) {
                    rta = result;
                } else {
                    rta = "sin resultados";
                }
                console.log(result);
                for (var n = 0; n < result.routes.length; n++) {
                    var rut = result.routes[n];
                    var ruts = rut["legs"][0]["duration"].value;
                    var pas = rut["legs"][0]["distance"].value;
                    self.rut = {distancia: pas, tiempo: ruts};
                    main.setPos(self.rut);
                    pintarRutaGoogleMap(rut.overview_polyline);
                }
                function pintarRutaGoogleMap(rta) {
                    var encodedPoints = rta;
                    var decodedPoints = google.maps.geometry.encoding.decodePath(encodedPoints);
                    self.encodedPolyline = new google.maps.Polyline({
                        strokeColor: "#970E04",
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                        path: decodedPoints,
                        clickable: true
                    });
//                    __polyGoogleMaps.push(encodedPolyline);
                    self.encodedPolyline.setMap(self.googleMap.map);
                }

//                callback(result.routes);
            });
        },
        slotTrazar: function slotTrazar(mapas, coords) {
            var self = this;
            if (self.encodedPolyline) {
                self.encodedPolyline.setMap(null);
            }
            var map = self.googleMap;
            var coords_lat_1 = coords.lat;
            var coords_lat_2 = coords.lng;
            var coords_lat_3 = coords.lat2;
            var coords_lat_4 = coords.lng2;
            var travelMode = google.maps.TravelMode.DRIVING;
            var start = new google.maps.LatLng(coords_lat_1, coords_lat_2);
            var end = new google.maps.LatLng(coords_lat_3, coords_lat_4);
            var directionsService = new google.maps.DirectionsService();
            var request = {
                origin: start,
                destination: end,
                travelMode: travelMode,
                drivingOptions: {
                    departureTime: new Date(Date.now()),
                    trafficModel: "optimistic"
                }
            };
            directionsService.route(request, function (result, status) {
                var rta = "";
                if (status == google.maps.DirectionsStatus.OK) {
                    rta = result;
                } else {
                    rta = "sin resultados";
                }
                for (var n = 0; n < result.routes.length; n++) {
                    var rut = result.routes[n];
                    var ruts = rut["legs"][0]["duration"].text;
                    var pas = rut["legs"][0]["distance"].text;
                    self.rut = {distancia: pas, tiempo: ruts};
                    main.setPos(self.rut);
                    pintarRutaGoogleMap(rut.overview_polyline);
                }
                function pintarRutaGoogleMap(rta) {
                    var encodedPoints = rta;
                    var decodedPoints = google.maps.geometry.encoding.decodePath(encodedPoints);
                    self.encodedPolyline = new google.maps.Polyline({
                        strokeColor: "#970E04",
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                        path: decodedPoints,
                        clickable: true
                    });
//                    __polyGoogleMaps.push(encodedPolyline);
                    self.encodedPolyline.setMap(self.googleMap.map);
                }
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(start);
                bounds.extend(end);
                console.log(bounds);
                console.log(self.googleMap.map);
                self.googleMap.map.setZoom(7);
                console.log(self.googleMap.map);
                self.googleMap.map.setCenter(bounds.getCenter());
                self.googleMap.map.fitBounds(bounds);
//                callback(result.routes);
            });
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();
            data.parada = self.navTable.getAllData();
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios");
            rpc.setAsync(true);
            var func = function () {
                self.accept();
            };
            rpc.exec("save", data, func);
        },
        ubicarAsign: function ubicarAsign(s) {
            var self = this;
            var dir = s;
            if (self.markerc["" + dir.id + ""]) {
                self.markerc["" + dir.id + ""].setPosition(new google.maps.LatLng(dir.lat, dir.lng));
            } else {
                var latLong = new google.maps.LatLng(dir.lat, dir.lng);
                self.markerc["" + dir.id + ""] = self.googleMap.placeMarker(latLong, dir.nombre + "-" + dir.nit, true, "/app/img/icono-marker-desti.png", true);
                self.__oldMarkerAll.push(self.markerc["" + dir.id + ""]);
                self.markerc["" + dir.id + ""].setMap(self.googleMap.map);
            }
//          
        },
        ubicar: function ubicar(s) {
            var self = this;
            var dir = s;
            if (self.markerc) {
                self.markerc.setPosition(new google.maps.LatLng(dir.lat, dir.lng));
            } else {
                var latLong = new google.maps.LatLng(dir.lat, dir.lng);
                self.markerc = self.googleMap.placeMarker(latLong, dir.nombre + "-" + dir.nit, true, "/app/img/icono-marker-desti.png", true);
                self.markerc.setMap(self.googleMap.map);
            }
        },
        populateTree: function populateTree(data) {
            var self = this;

//            self.cleanTree();

            console.log("data::::::::::::::::::::::", data);
            console.log("data.subcategoria_servicio_text::::::::::::::::::::::", data.subcategoria_servicio_text)
            self.tree.addTreeHeader(self.tr("Conductores disponibles para " + data.subcategoria_servicio_text), qxnw.config.execIcon("view-sort-descending"));
            self.framePositionCondutorAsig(data, allItem);
//            self.interval = setInterval(function () {
//                self.framePositionCondutorAsig(data, allItem);
//            }, 30000);
            function allItem(e) {
                return self.allItem(e);
            }
        },
        allItem: function allItem(e) {
            var self = this;
            var fecha = main.getDateTime(false, 2);
            console.log("fecha", fecha);
            console.log("allItem", e);
//            if (self.parent[e.id]) {
//                return false;
//            }

            var online = "Online";
            var color = "green";
            var fechalast = "0000-00-00 00:00:00";
            if (main.evalueData(e.fecha_ultima_conexion)) {
                fechalast = e.fecha_ultima_conexion;
            }
            var icon = qxnw.config.execIcon("green", "qxnw");
            if (fechalast < fecha) {
                icon = qxnw.config.execIcon("white", "qxnw");
                online = "Offline";
                color = "gray";
            }
            var html = "<p style='color: " + color + ";'>";
            html += "<b style='font-size: 13px;'>" + e.nombre + " - " + e.nit + "</b>";
            html += "<br><b>User:</b> " + e.usuario_cliente + "";

            html += "<br><b>Última Conexión:</b> " + fechalast + "";
            var horai = "00";
            if (main.evalueData(e.hora_inicio)) {
                horai = e.hora_inicio;
            }
            var horaf = "00";
            if (main.evalueData(e.hora_fin)) {
                horaf = e.hora_fin;
            }
            html += "<br><b>Horario:</b> " + horai + "-" + horaf + "";
            var maletas = "Sin definir";
            if (main.evalueData(e.num_maletas)) {
                maletas = e.num_maletas;
            }
            var numpersons = "Sin definir";
            if (main.evalueData(e.num_personas)) {
                numpersons = e.num_personas;
            }
            html += "<br><b>No maletas:</b> " + maletas + "";
            html += "<br><b>No Personas  (capac max):</b> " + numpersons + "";
            html += "<br><b>" + online + "</b>";
            html += "</p>";

            self.parent[e.id] = self.tree.addTreeFolder(html, icon, e, true);

//                self.parent[e.id] = self.tree.addTreeFolder(e.nombre + " - " + e.nit + "</b><br>", icon, e, true);

            var div = document.createElement('div');
            self.parent[e.id].addListener("click", function () {
                var element = self.tree.leftWidget.getChildren()[1].getContentElement().getDomElement();
                var det = document.querySelector('.detalle_conductor');
                if (det) {
                    element.removeChild(det);
                }
                div.className = "detalle_conductor";
                div.innerHTML = self.htmlItem();
                element.appendChild(div);
                var asignar = document.querySelector('.asignar_viaje');
                var agenda = document.querySelector('.agenda');
                var vehiculos = document.querySelector('.vehiculos');
                var volver = "";

                asignar.addEventListener("click", function () {
                    var si = self.tree.getSelectedItem();
                    self.slotCond(si);
                });

                agenda.addEventListener("click", function () {
                    asignar.style.display = "none";
                    agenda.style.display = "none";
                    vehiculos.style.display = "none";
                    var html = self.createHtml(e);
                    var ele = document.createElement('div');
                    ele.innerHTML = html;
                    div.appendChild(ele);
                    volver = document.querySelector('.volver');
                    volver.addEventListener("click", function () {
                        asignar.style.display = "block";
                        agenda.style.display = "block";
                        vehiculos.style.display = "block";
                        div.removeChild(ele);
                    });
                });
                vehiculos.addEventListener("click", function () {
                    asignar.style.display = "none";
                    agenda.style.display = "none";
                    vehiculos.style.display = "none";
                    var html = self.createHtmlV(e);
                    var ele = document.createElement('div');
                    ele.innerHTML = html;
                    div.appendChild(ele);
                    volver = document.querySelector('.volver');
                    volver.addEventListener("click", function () {
                        asignar.style.display = "block";
                        agenda.style.display = "block";
                        vehiculos.style.display = "block";
                        div.removeChild(ele);
                    });
                });
            });
        },
        slotCond: function slotCond(si) {
            var self = this;
            var data = this.getRecord();
            var ms = "<h1>¿Continuar con la liquidación final del servicio?</h1>";
            qxnw.utils.question(ms, function (e) {
                if (e) {
                    data.data_service = self.dataService;
                    console.log("data", data);
                    var rpc = new qxnw.rpc(self.rpcUrl, "servicios_admin");
                    rpc.setAsync(true);
                    var func = function (r) {
                        console.log("liquidarServicio", r);
                        qxnw.utils.information("¡Servicio liquidado exitosamente!");
                        self.reject();
                        self.accept();
                    };
                    rpc.exec("liquidarServicio", data, func);
                }
            });
        },
        framePositionCondutorAsig: function framePositionCondutorAsig(re, callback) {
            var up = qxnw.userPolicies.getUserData();
            var self = this;
            var data = {};
            data.service = re.id;
            data.ciudad = self.ciudad_origen;
            data.conductores = "TODOS";
            data.ultimos_conectados = false;
            //nuevo para mezclar
            if (self.configCliente.app_para != 'CARGA') {
                data.servicio_para = re.tipo_servicio;
            }
            console.log("re", re);
            if (main.evalueData(re.subcategoria_servicio)) {
                data.servicio_filtro = re.subcategoria_servicio;
            }
            //fin para mezclar

            console.log("framePositionCondutorAsig:::re", re);
            console.log("framePositionCondutorAsig:::data", data);

//            data.fields = "latitud,longitud,id,nombre,nit";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            rpc.setShowLoading(true);
            var func = function (r) {
                console.log("CONDUCTORES_MAPA:::::::::::RESPONSE", r);
                for (var i = 0; i < r.length; i++) {
                    var dc = r[i];
//                    var inclu = false;
//                    var sevi_activos = JSON.parse(dc.servicios_activos);
//                    console.log("sevi_activos", sevi_activos);
//                    if (qxnw.utils.evalue(sevi_activos)) {
//                        if (sevi_activos.length > 0) {
//                            for (var e = 0; e < sevi_activos.length; e++) {
//                                var jj = sevi_activos[e];
//                                if (jj.nombre == re.sub_servicio || jj.nombre == re.subcategoria_servicio_text) {
//                                    inclu = true;
//                                }
//                            }
//                        }
//                    }
//                    if (inclu == false) {
//                        continue;
//                    }
                    dc.lat = parseFloat(dc.latitud);
                    dc.lng = parseFloat(dc.longitud);
                    callback(dc);
                    self.ubicarAsign(dc);
                }
            };
            rpc.exec("consultaConductores", data, func);
        },
        framePositionCondutor: function framePositionCondutor(r) {
            var up = qxnw.userPolicies.getUserData();
            var self = this;
            var data = {};
            data.service = main.id_service_active;
            data.ciudad = self.ciudad_origen;
            data.conductores = r.conductor_id;
//            data.fields = "latitud,longitud";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            var func = function (dc) {
                console.log(dc);
//                var res = self.validaFechaConexion(dc.fecha_ultima_conexion);
//                if (res) {
                dc.lat = parseFloat(dc.latitud);
                dc.lng = parseFloat(dc.longitud);
                self.ubicar(dc);
//                }
            };
            rpc.exec("consultaConductores", data, func);
        },
        validaFechaConexion: function validaFechaConexion(campo) {
//            var self = this;
            var data = campo;
            if (qxnw.utils.evalue(data)) {
                var hoy = new Date();
                var fech_cone = new Date(data);
                var fecha_act = new Date(hoy.getTime() - 30000);
                if (fecha_act <= fech_cone) {
                    return campo;
                }
            }
        },
        ubicarVehiculo: function ubicarVehiculo(r) {
//                var self = this;
            var self = this;
//            var dir = JSON.parse(e.data.text);
            var latLong = new google.maps.LatLng(0, 0);
//            var marker = self.googleMap.placeMarker(latLong, false, false, "/app/img/icono-marker-desti.png", true);
            self.markerc = self.googleMap.placeMarker(latLong, r.placa, false, "/app/img/icono-marker-desti.png", true);
//            self.__oldMarker2 = self.markerc;
            self.markerc.setMap(self.googleMap.map);
        },
        moverVehiculo: function moverVehiculo(e) {

//                var self = this;
            var self = this;
            if (self.markerc != false) {
                var dir = JSON.parse(e.data.text);
                self.markerc.setPosition(new google.maps.LatLng(dir.lat, dir.lng));
            }
        },
        htmlItem: function htmlItem() {
            var html = "<div class='asignar_viaje btn_tree'>Asignar Viaje</div>\n\
                     <div class='agenda btn_tree'>Ver Agenda</div>\n\
                     <div class='vehiculos btn_tree'>Vehiculo(s)</div>";
            return html;
        },
        createHtml: function createHtml(conductor) {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "conductores");
            var c = rpc.exec("getAgenda", conductor);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            if (c.length > 0) {
                var html = "";
                for (var i = 0; i < c.length; i++) {

                    html += "</br><b>Hora: </b>";
                    html += c[i].hora;
                    html += "</br>";
                    html += "<b>Fecha: </b>";
                    html += c[i].fecha;
                    html += "</br>";
                    html += "<b>Origen: </b>";
                    html += c[i].origen;
                    html += "</br>";
                    html += "<b>Destino: </b>";
                    html += c[i].destino;
                    html += "</br>";
                    html += "<b>Conductor: </b>";
                    html += c[i].conductor;
                    html += "</br>";
                    html += "<b>  Vehículo: </b>";
                    html += c[i].vehiculo_text;
                    html += "</br>";
                    html += "<b>Usuario: </b>";
                    html += c[i].usuario;
                    html += "</br>";
                    html += "<b>--------------------------------------------------------</b></br>";
                }
            } else {
                var html = "<br/><br/><h3 style='text-align:center;'>No tiene Viajes </h3><br/><br/>";
            }
            html += "<div class='volver'>Volver</div>";
            return html;
        },
        createHtmlV: function createHtmlV(conductor) {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "conductores");
            conductor.usuario_cond = conductor.usuario_cliente;
            console.log("conductor", conductor);
            console.log("self.dat", self.dat);
            var c = rpc.exec("getMotorizados", conductor);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            if (c.length > 0) {
                var html = "";
                for (var i = 0; i < c.length; i++) {

                    html += "</br><b>Tipo Vehiculo: </b>";
                    html += c[i].tipo_vehiculo_text;
                    html += "</br><b>Placa: </b>";
                    html += c[i].placa;
                    html += "</br>";
                    html += "<b>Marca: </b>";
                    html += c[i].marca_text;
                    html += "</br>";
                    html += "<b>Modelo: </b>";
                    html += c[i].modelo;
                    html += "</br>";
                    html += "<b>Color: </b>";
                    html += c[i].color;
                    html += "</br>";
                    html += "<b>Numero Puertas: </b>";
                    html += c[i].numero_puertas;
                    html += "</br>";
                    html += "<b>Fecha Vencimiento Soat: </b>";
                    html += c[i].fecha_vencimiento_soat;
                    html += "</br>";
                    html += "<b>--------------------------------------------------------</b></br>";
                }
            } else {
                var html = "<br/><br/><h3 style='text-align:center;'>No tiene Vehiculos Activos </h3><br/><br/>";
            }
            html += "<div class='volver'>Volver</div>";
            return html;
        },
        sendNotificacionPsh: function sendNotificacionPsh(pos) {
            var self = this;
            var token = pos;
//            var arr = {};
//            arr.terminal = 1;
//            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
//            rpc.setAsync(true);
//            var func = function (res) {
//                for (var i = 0; i < res.length; i++) {
//                    var tokenUser = res[i].json;
//                    self.sendNotificacionPushDos({
//                        title: "Servicio generado",
//                        body: "Ingrese a la aplicación",
//                        icon: "fcm_push_icon",
//                        sound: "default",
//                        data: "nw.dialog('Servicio generado')",
//                        callback: "FCM_PLUGIN_ACTIVITY",
//                        to: tokenUser
//                    }, function (r) {
//                        console.log("Notify send OK to" + tokenUser + r);
//                    });
//                }
//            };
//            rpc.exec("tokenUsuario", arr.terminal, func);
            for (var i = 0; i < token.length; i++) {
                var envio = token[i];
                self.sendNotificacionPushDos({
                    title: "Tienes un Servicio",
                    body: "¿Deseas Aceptar este Viaje?",
                    icon: "fcm_push_icon",
                    sound: "default",
                    data: "nw.dialog('Tienes un Servicio')",
                    callback: "FCM_PLUGIN_ACTIVITY",
                    to: envio
                }, function (r) {
                    console.log("Notify send OK to" + envio + r);
                });
            }
        },
        sendNotificacionPushDos: function sendNotificacionPushDos(array, callback) {
            var key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';
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
//                "restricted_package_name":""
                    'to': to,
                    data: {
                        data: array.data,
                        callback: array.callback.toString(),
                        title: array.title,
                        body: array.body
                    }
                })
            }).then(function (response) {
                console.log(response);
            })
//                    .catch(function (error) {
//                console.error(error);
//
//            })
        },
        populateNavTable: function populateNavTable(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    r[i].direccion_parada = r[i].nomenclatura_parada_text + " " + r[i].no_uno_parada + " # " + r[i].no_dos_parada + " - " + r[i].no_tres_parada;
                }
                self.navTable.setModelData(r);
            };
            rpc.exec("populateParadas", pr, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            if (qxnw.utils.evalue(pr.usuario_servicio)) {
                var token = {};
                token["id"] = pr.usuario_servicio;
                token["nombre"] = pr.usuario_servicio_text;
                self.ui.usuario.addToken(token);
            }
            self.populateNavTable(pr.id);
            return true;
        }
    }
});
