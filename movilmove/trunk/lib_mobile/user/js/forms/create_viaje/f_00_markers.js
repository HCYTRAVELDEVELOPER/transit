nw.Class.define("f_00_markers", {
    extend: nw.lists,
    construct: function (self) {
        if (self.debugConstruct) {
            console.log("START_LAUNCH:::::::::::::: f_00_markers");
        }
        var selft = this;
        $.each(selft.members, function (key, value) {
            self[key] = value;
        });
    },
    destruct: function () {
    },
    members: {
        setMyUbication: function setMyUbication(gps, ubicar) {
            var self = this;
//            if (self.debugConstruct) {
            console.log("%c<<<<DEBUG: START:::f_00_markers:::setMyUbication>>>>",
                    'background: #33A51F; color: #2B0902');
            console.log("START:::f_00_markers:::setMyUbication", gps);
            nw.console.log("START:::f_00_markers:::setMyUbication:::gps", gps);
//            }
            console.log("GPS results::::::::::::", gps);
            if (typeof gps.address_components !== "undefined") {
                if (nw.evalueData(gps.address_components.sublocality))
                    self.geo.localidad_origen = gps.address_components.sublocality;
                else
                if (nw.evalueData(gps.address_components.route))
                    self.geo.localidad_origen = gps.address_components.route;

                self.geo.barrio_origen = "N/A";
                if (nw.evalueData(gps.address_components.neighborhood))
                    self.geo.barrio_origen = gps.address_components.neighborhood;
                else
                if (nw.evalueData(gps.address_components.route))
                    self.geo.barrio_origen = gps.address_components.route;

                if (gps.address_components.locality) {
                    self.geo.ciudad_origen = gps.address_components.locality;
                    self.geo.ciudad = gps.address_components.locality;
                } else
                if (gps.address_components.sublocality) {
                    self.geo.ciudad_origen = gps.address_components.sublocality;
                    self.geo.ciudad = gps.address_components.sublocality;
                } else {
                    self.geo.ciudad_origen = gps.address_components.administrative_area_level_1;
                    self.geo.ciudad = gps.address_components.administrative_area_level_1;
                }
                self.geo.pais_origen = gps.address_components.country;
            }

            gps.geometry = {
                lat: function () {
                    return gps.lat;
                },
                lng: function () {
                    return gps.lng;
                }
            };
            self.results = gps;
            if (typeof gps == "string") {
                self.results = JSON.stringify(gps);
            }
            self.address = gps.address;
            self.geo.dir = gps.direccion;
            self.geo.localidad_origen = "N/A";

            self.geo.ciudad = gps.ciudad;

            self.geo.latitude = gps.lat;
            self.geo.longitude = gps.lng;
            self.geo.latitudOri = gps.lat;
            self.geo.longitudOri = gps.lng;
            self.name_place_origen = self.geo.ciudad;
            if (nw.evalueData(gps.allData)) {
                if (nw.evalueData(gps.allData.name)) {
                    self.name_place_origen = gps.allData.name;
                } else
                if (nw.evalueData(gps.allData.formatted_address)) {
                    self.name_place_origen = gps.allData.formatted_address;
                }
            }

            console.log("self.ciudad_origen", self.ciudad_origen);
//            if (!nw.evalueData(self.ciudad_origen)) {
            self.ciudad_origen = self.geo.ciudad;
//            }
            console.log("self.ciudad_origen", self.ciudad_origen);

//            if (!nw.evalueData(self.ciudad_origen)) {
//                var d = new f_ciudad_confirmar();
//                d.construct(self);
//            }

            self.address_cord = {};
            self.address_cord.latitud = gps.lat;
            self.address_cord.longitud = gps.lng;
            self.pos = {
                lat: gps.lat,
                lng: gps.lng
            };
            if (ubicar !== true) {
                self.cleanMarkerOne();
                self.markerMyUbication(true);
            }
            console.log("gps.address", gps.address);

            nw.console.log("setMyUbication:::gps", gps);
            nw.console.log("setMyUbication:::gps.address", gps.address);

            self.ui.address.setValue(gps.address);
            if (self.debugConstruct) {
                console.log("SET_DATA:::f_00_markers:::setMyUbication:::gps", gps);
            }
        },
        yaFueUbicadoInicial: false,
        initialMyUbication: function initialMyUbication(centrar) {
            var self = this;
            if (self.debugConstruct) {
                console.log("START:::f_00_markers:::initialMyUbication");
            }
            nw.console.log("START:::f_00_markers:::initialMyUbication");

            nw.console.log("START:::f_00_markers:::initialMyUbication typeof main.gps", typeof main.gps);

            if (centrar === true) {
                var zoom = false;
                var bounds = [
                    {"lat": self.geo.latitude, "lng": self.geo.longitude}
                ];
                var multiplePoints = false;
                nwgeo.centerMap(self.map, self.markerMyPosition, false, zoom, bounds, multiplePoints);
                nwgeo.setPositionMarker(self.markerMyPosition, self.geo.latitude, self.geo.longitude);
                if (self.debugConstruct) {
                    console.log("CENTER_SET_POSITION:::f_00_markers:::initialMyUbication");
                }
            }
            if (typeof main.gps !== "undefined") {
                if (self.debugConstruct) {
                    console.log("START_GET_GPS_INFO_NATIVE:::f_00_markers:::initialMyUbication", main.gps);
                }
                self.execInitMyUb(main.gps, true);
            } else {
//                nwgeo.getLocation(function (gps) {
//                    main.gps = gps;
//                    self.execInitMyUb(gps, false);
//                });

                var e = main.position_initial;

                var lat = false;
                var lng = false;
                var coords = false;
                if (nw.utils.evalueData(e.coords)) {
                    lat = e.coords.latitude;
                    lng = e.coords.longitude;
                    coords = e.coords;
                }
                if (nw.utils.evalueData(e.latLng)) {
                    lat = e.latLng.lat;
                    lng = e.latLng.lng;
                    coords = e.latLng;
                }
                console.log("eeeeeeeeeeeeeeeeeeeeeeeee", e);

                nw.console.log("START:::f_00_markers:::initialMyUbication:::eeeeeeeeeee", e);

                nwgeo.api_geocodeInverse(nwgeo.latitude, nwgeo.longitude, function (results, status) {

                    nw.console.log("START:::f_00_markers:::initialMyUbication:::results", results);

                    if (results !== false) {

                        nw.console.log("START:::f_00_markers:::initialMyUbication:::results[0]", results[0]);
//                        nw.console.log("getLocation:::nwgeo.api_geocodeInverse:::results", results);

                        console.log("getLocation:::nwgeo.api_geocodeInverse:::results", results);
                        var d = nwgeo.extraerDataResult(results[0], results);

                        nw.console.log("START:::f_00_markers:::initialMyUbication:::d", d);
//                      
//                        d.lat = e.latitude;
//                        d.lng = e.longitude;
//                        d.lat = e.latLng.lat;
//                        d.lng = e.latLng.lng;
                        d.lat = lat;
                        d.lng = lng;
                        d.coords = coords;
//                        d.coords = e.latLng;
                        d.responseAll = e;
//                        callback(d);
                        main.gps = d;
                        self.execInitMyUb(d, false);
                    }
                });

            }
        },
        execInitMyUb: function execInitMyUb(gps, ubicar) {
            var self = this;
//            if (self.debugConstruct) {
            console.log("START:::f_00_markers:::execInitMyUb");
            nw.console.log("START:::f_00_markers:::execInitMyUb:::gps", gps);
//            }
            if (!self.loadedInitialMyUbication) {
                ubicar = true;
            }
            nw.console.log("START:::f_00_markers:::execInitMyUb:::pasa SI");
            self.setMyUbication(gps, ubicar);

            if (!self.loadedInitialMyUbication) {
                if (self.debugConstruct) {
                    console.log("VALIDA_SERVICES_ACTIVES:::f_00_markers:::validaServiceActive");
                }
                if (main.configCliente.usa_firebase != "SI") {
                    self.validaServiceActive(true);
                }
            }
            self.loadedInitialMyUbication = true;
        },
        centerMarkerOne: function centerMarkerOne() {
            var self = this;
            var lat = self.geo.latitude;
            var lng = self.geo.longitude;
            self.map.setCenter(new google.maps.LatLng(lat, lng), 16);
        },
        cleanMarkerOne: function cleanMarkerOne() {
            var self = this;
            if (nw.evalueData(self.markerMyPosition)) {
                nwgeo.removeMarker(self.markerMyPosition);
            }
            if (self.debugConstruct) {
                console.log("CLEAR_MARKER_ONE:::f_00_markers:::cleanMarkerOne");
            }
        },
        cleanMarkerDestino: function cleanMarkerDestino() {
            var self = this;
            if (nw.evalueData(self.markerDestino)) {
                nwgeo.removeMarker(self.markerDestino);
                if (self.debug) {
                    console.log("cleanMarkerDestino");
                }
            }
        },
        setPositionOne: function setPositionOne(posadd) {
            var self = this;
            var lat = false;
            var lng = false;
//            var pos = false;
            if (nw.evalueData(posadd)) {
                if (typeof posadd.lat == "function") {
                    lat = posadd.lat();
                } else {
                    lat = posadd.lat;
                }
                if (typeof posadd.lng == "function") {
                    lng = posadd.lng();
                } else {
                    lng = posadd.lng;
                }
            } else {
                var pos = self.markerMyPosition.getPosition();
                lat = pos.lat();
                lng = pos.lng();
            }
            console.log("%c<<<<DEBUG: START:::f_00_markers:::setPositionOne>>>>", 'background: #33A51F; color: #2B0902');
            console.log("lat", lat);
            console.log("lng", lng);
            nwgeo.api_geocodeInverse(lat, lng, function (results, status) {
                if (results !== false) {
                    var d = nwgeo.extraerDataResult(results[0], results);
                    var se = {};
                    se.results = results[0];
                    se.address = d.address;
                    se.lat = lat;
                    se.lng = lng;
                    console.log("%c<<<<DEBUG: START:::f_00_markers:::setUbicOne 2>>>>", 'background: #33A51F; color: #2B0902');
                    self.setUbicOne(se);
                }
            });
        },
        setUbicOne: function setUbicOne(data, gpso) {
            var self = this;
//            if (self.debugConstruct) {
            console.log("%c<<<<DEBUG: START:::f_00_markers:::setUbicOne>>>>", 'background: #33A51F; color: #2B0902');
            console.log("START:::f_00_markers:::setUbicOne", data);
//            }
            self.cleanMarkerOne();
            var d = false;
            if (nw.evalueData(gpso)) {
                d = gpso;
            } else {
                d = nwgeo.extraerDataResult(data.results);
            }
            d.address = data.address;
            d.lat = data.lat;
            d.lng = data.lng;
            self.setMyUbication(d, false);

            self.ui.fijar_en_mapa_origen.setVisibility(false);

            var pag = document.querySelector('.buttons_group_fix_pago_group');
            if (!pag) {
                if (self.circu == false) {
                    self.muestraAddressInit();
                }
            }
        },
        markerMyUbication: function markerMyUbication(centrar) {
            var self = this;
            if (self.debugConstruct) {
                console.log("START:::f_00_markers:::markerMyUbication");
            }
            nw.console.log("START:::f_00_markers:::markerMyUbication");

            var marker = new nwgeo.addMarker();
            marker.map = self.map;
            marker.latitude = self.geo.latitude;
            marker.longitude = self.geo.longitude;
            marker.label = "";
            marker.icon = config.domain_rpc + config.carpet_files_extern + '/img/pin46.png';
            if (nw.evalueData(config.iconDriverPuntoA)) {
                marker.icon = config.iconDriverPuntoA;
            }
            if (nw.evalueData(config.iconUserMap)) {
                marker.icon = config.iconUserMap;
            }
            marker.draggable = false;
            marker.animation = true;
            self.markerMyPosition = marker.show(function () {
                nw.loadingRemove();
                if (!self.orienta) {
                    setTimeout(function () {
                        self.enableOrientationArrow();
                    }, 10000);
                    self.orienta = true;
                }
                if (self.debugConstruct) {
                    console.log("CREATE_MARKER:::f_00_markers:::markerMyUbication");
                }
            });
            if (centrar === true) {
                if (self.debugConstruct) {
                    console.log("CENTER:::f_00_markers:::markerMyUbication");
                }
                nwgeo.centerMap(self.map, self.markerMyPosition, false);
            }
        },
        removeMarker3: function removeMarker3() {
            var self = this;
            if (nw.evalueData(self.marker3)) {
                nwgeo.removeMarker(self.marker3);
                nwgeo.centerMap(self.map, self.marker3);
            }
            if (self.debugConstruct) {
                console.log("START_REMOVE_MARKER3:::f_00_markers:::removeMarker3");
            }
        },
        createMarker3: function createMarker3() {
            var self = this;
            self.removeMarker3();

            var lat = self.latitudMapaDrag;
            var lng = self.longitudMapaDrag;
            var marker = new nwgeo.addMarker(false);
            marker.map = self.map;
            marker.latitude = lat;
            marker.longitude = lng;
            marker.title = "";
            marker.label = "";
            marker.icon = config.domain_rpc + config.carpet_files_extern + '/img/pin46.png';
            if (nw.evalueData(config.iconDriverPuntoA)) {
                marker.icon = config.iconDriverPuntoA;
            }
            if (nw.evalueData(config.iconUserMap)) {
                marker.icon = config.iconUserMap;
            }
            marker.draggable = false;
            marker.animation = false;
            self.marker3 = marker.show();

            if (self.debugConstruct) {
                console.log("START_CREATE_MARKER3:::f_00_markers:::createMarker3");
            }
        },
        removeMarker4: function removeMarker4() {
            var self = this;
            if (nw.evalueData(self.markerDriver)) {
                nwgeo.removeMarker(self.markerDriver);
                self.markerDriver = false;
            }
            if (self.debugConstruct) {
                console.log("START_REMOVE_MARKER4:::f_00_markers:::removeMarker4");
            }
        },
        positionDriverPass: null,
        createMarkerDriver: function createMarkerDriver(posSend, posInArray) {
            var self = this;
            var pos = false;
            if (self.debugConstruct) {
                console.log("START:::f_00_markers:::createMarkerDriver:::posSend", posSend);
                console.log("START:::f_00_markers:::createMarkerDriver:::posInArray", posInArray);
            }
            if (typeof posInArray !== "undefined") {
                pos = posInArray;
            } else {
                if (typeof posSend.data.text !== "undefined" && typeof posSend.data.tipo !== "undefined") {
                    if (self.debug) {
                        console.log("posSend", posSend);
                    }
                    if (posSend.data.tipo !== "add_msg") {
                        pos = JSON.parse(posSend.data.text);
                    }
                } else {
                    return;
                }
            }
            if (self.debug) {
                console.log("pos driver", pos);
            }
            if (pos === false) {
                return false;
            }
            self.positionConductor = pos;
            var lat = pos.lat;
            var lng = pos.lng;
            if (self.markerDriver === false) {
                self.removeMarker4();
                var marker = new nwgeo.addMarker(false);
                marker.map = self.map;
                marker.latitude = lat;
                marker.longitude = lng;
                marker.title = "";
                marker.label = "";
                marker.icon = config.domain_rpc + config.carpet_files_extern + '/img/ubicacion-carro.png';
                if (nw.evalueData(config.iconDriverPuntoDriver)) {
                    marker.icon = config.iconDriverPuntoDriver;
                }
                if (nw.evalueData(config.iconDriverMap)) {
                    marker.icon = config.iconDriverMap;
                }
                marker.draggable = false;
                marker.animation = false;
                if (typeof pos.rotation !== "undefined") {
                    marker.rotation = pos.rotation;
                }
                self.markerDriver = marker.show();
                if (self.debugConstruct) {
                    console.log("CREATE:::createMarkerDriver:::self.markerDriver");
                }
            } else {
                nwgeo.setPositionMarker(self.markerDriver, lat, lng);
                if (self.debugConstruct) {
                    console.log("MOVED_POSITION_WEB:::createMarkerDriver:::self.markerDriver");
                }
            }
            self.recibeGeoDriver = true;
            self.timeNoRecibeGeoDriver = 0;
            self.positionDriverPass = pos;
        },
        markerPolylineActiveEnRuta: function markerPolylineActiveEnRuta(callback) {
            var self = this;
            /*
             var map = self.map;
             var lat2 = self.geo.latitudOri;
             var lng2 = self.geo.longitudOri;
             var latDriver = self.positionConductor.lat;
             var lngDriver = self.positionConductor.lng;
             var coords = {lat: latDriver, lng: lngDriver, lat2: lat2, lng2: lng2};
             if (!nw.evalueData(lat2) || !nw.evalueData(lng2) || !nw.evalueData(latDriver) || !nw.evalueData(lngDriver)) {
             if (self.debugConstruct) {
             console.log("ERROR:::f_00_markers:::markerPolylineActiveEnRuta::: lat/lng de driver/origen desconocido, relanzando:::coords", coords);
             }
             setTimeout(function () {
             self.markerPolylineActiveEnRuta();
             }, 2000);
             return;
             }
             var func_one = function (response) {
             if (self.debugConstruct) {
             console.log("CREATE:::self.markerPolylineActiveEnRuta()::response", response);
             }
             if (typeof callback !== "undefined") {
             if (nw.evalueData(callback)) {
             callback();
             }
             }
             if (typeof response[0] === "undefined") {
             return false;
             }
             self.polyti = {};
             self.pathDriverToOrigin = JSON.stringify(response.pathOnetoOne);
             self.polyti.tiempo = response[0].legs[0].duration.value;
             self.polyti.tiempo_text = response[0].legs[0].duration.text;
             self.polyti.distance_text = response[0].legs[0].distance.text;
             var div = document.querySelector('.tiempo_es');
             if (div) {
             div.innerHTML = self.polyti.tiempo_text;
             }
             var div = document.querySelector('.distancia_es');
             if (div) {
             div.innerHTML = self.polyti.distance_text;
             }
             };
             var multipleCoords = true;
             var animateOrCenter = "center"; //center nothing
             var onlyGetData = false;
             console.log("self.dataServiceActive", self.dataServiceActive);
             alert("addLineStreet one");
             self.polylineRuta = nwgeo.addLineStreet(map, coords, func_one, main.colorPolyLine, onlyGetData, animateOrCenter, multipleCoords);
             if (self.debugConstruct) {
             console.log("LAUNCH:::self.markerPolylineActiveEnRuta()::coords", coords);
             }
             */
        },
        centerMapByGeo: function centerMapByGeo(lt1, lg1, lt2, lg2) {
            var self = this;
//            var latDriver = self.positionConductor.lat;
//            var lngDriver = self.positionConductor.lng;
            var zoom = false;
            var bounds = [
//                        {"lat": self.geo.latitude, "lng": self.geo.longitude},
//                        {"lat": self.geo.latitudOri, "lng": self.geo.longitudOri},
//                {"lat": latDriver, "lng": lngDriver},
//                        {"lat": self.geo.latitude, "lng": self.geo.longitude},
//                {"lat": self.geoDestino.latitudOri, "lng": self.geoDestino.longitudOri}
                {"lat": lt1, "lng": lg1},
                {"lat": lt2, "lng": lg2}
            ];
            var multiplePoints = true;
            var animate = true;
//            var lat1 = self.geoDestino.latitudOri;
//            var lng1 = self.geoDestino.longitudOri;
//            var lat1 = lt1;
//            var lng1 = lg1;
            var lat1 = false;
            var lng1 = false;
            if (!nw.evalueData(lt1) || !nw.evalueData(lg1) || !nw.evalueData(lt2) || !nw.evalueData(lg2)) {
                console.log("ERROR:::centerMapByGeo::: lat/lng de driver/origen desconocido, relanzando:::lt1, lg1, lt2, lg2:::" + lt1 + " " + lg1 + " " + lt2 + " " + lg2);
//                setTimeout(function () {
//                    self.centerMapByGeo(lt1, lg1, lt2, lg2);
//                }, 2000);
                return;
            }
            nwgeo.centerMap(self.map, self.markerMyPosition, self.markerDestino, zoom, bounds, multiplePoints, animate, lat1, lng1);
            if (self.debugConstruct) {
                console.log("CHANGE:::centerMapByGeo:::CENTERMAP::lt1, lg1, lt2, lg2:::" + lt1 + " " + lg1 + " " + lt2 + " " + lg2);
            }
        },
        removeCarsMap: function removeCarsMap() {
            var self = this;
//            if (nwgeo.native) {
            var t = self.markersCalor.length;
//            console.log(t);
            for (var i = 0; i < t; i++) {
                nwgeo.removeMarker(self.markersCalor[i]);
            }
            return true;
//            }
        },
        createCarsMap: function createCarsMap() {
            var self = this;
            self.removeCarsMap();
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.usuario = up.usuario;
            var rpc = new nw.rpc(self.getRpcUrl(), "conductores");
            rpc.setAsync(true);
            rpc.setLoading(false);
            self.markersCalor = [];
            var func = function (r) {
                if (self.debug) {
                    console.log("createMapa get conductores", r);
                }
                for (var x = 0; x < r.length; x++) {
                    var ra = r[x];
                    var angle = numeroAleatorio(0, 360);
                    var data = {
                        val: function () {
                            var data = {};
                            data.angle = angle;
                            data.lat = parseFloat(ra.latitud);
                            data.lng = parseFloat(ra.longitud);
                            return data;
                        }
                    };
                    AddCar(data, x);
                }
            };
            rpc.exec("getConductoresCerca", data, func);

            function numeroAleatorio(min, max) {
                return Math.round(Math.random() * (max - min) + min);
            }

            function AddCar(data, i) {
                if (typeof google === "undefined") {
                    setTimeout(function () {
                        AddCar(data, i);
                    }, 300);
                    return false;
                }
                if (nwgeo.native) {

                    var icon = config.domain_rpc + config.carpet_files_extern + '/img/normal1.png';
                    if (config.iconCarsMap) {
                        icon = config.iconCarsMap;
                    }
//                    console.log("icon", icon);
                    self.markersCalor[i] = self.map.addMarker({
                        position: {
                            lat: data.val().lat,
                            lng: data.val().lng
                        },
                        'icon': {
                            'url': icon
                        },
                        scale: 0.5,
//                        scale: .075,
                        offset: '15%',
                        strokeColor: '#000000',
                        strokeWeight: 0.3,
                        fillColor: "#f15228",
                        fillOpacity: 1,
                        anchor: new google.maps.Point(0, 5),
                        rotation: data.val().angle
                    });
                } else {
                    var car = 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805';
                    var icon = {
                        path: car,
                        scale: 0.5,
                        offset: '15%',
                        strokeColor: '#000000',
                        strokeWeight: 0.3,
                        fillColor: "#f15228",
                        fillOpacity: 1,
                        anchor: new google.maps.Point(0, 5),
                        rotation: data.val().angle
                    };
                    var uluru = {lat: data.val().lat, lng: data.val().lng};
                    var marker = new google.maps.Marker({
                        position: uluru,
                        icon: icon,
                        map: self.map
                    });
                    self.markersCalor[i] = marker;
                    return marker;
                }
            }
        },
        removeLine: function removeLine() {
            var self = this;
            if (nw.evalueData(self.line)) {
                nwgeo.removeLine(self.line);
                self.line = false;
            }
        },
        setPositionTwo: function setPositionTwo(posAdd) {
            var self = this;
            var lat = false;
            var lng = false;
//            var pos = false;
            if (nw.evalueData(posAdd)) {
                if (typeof posAdd.lat == "function") {
                    lat = posAdd.lat();
                } else {
                    lat = posAdd.lat;
                }
                if (typeof posAdd.lng == "function") {
                    lng = posAdd.lng();
                } else {
                    lng = posAdd.lng;
                }
            } else
            if (nw.evalueData(self.markerDestino)) {
                var pos = self.markerDestino.getPosition();
                lat = pos.lat;
                lng = pos.lng;
            }
//            console.log("setPositionTwo pos", pos);
//            if (!nw.evalueData(pos)) {
//                return false;
//            }

//            var lat = pos.lat();
//            var lng = pos.lng();
//            var lat = pos.lat;
//            var lng = pos.lng;
            console.log("lat", lat);
            console.log("lng", lng);
//            nw.nativeGeoCoder(lat, lng, function (r) {
//                console.log("nativeGeoCoder", r);
//                if (r !== false && typeof r.error === "undefined") {
//                    var dat = {};
//                    dat.lat = lat;
//                    dat.lng = lng;
//                    dat.name = r.address;
//                    dat.ciudad = r.address_components.sublocality;
//                    dat.name_place = r.address_components.sublocality;
//                    self.pointMapDestinoExec(dat);
//                    if (self.campo === "address_destino") {
//                        self.ui.listo_fijar_label.setVisibility(false);
//                        self.ui.listo_fijar.setVisibility(true);
//                    }
//                } else {
            nwgeo.api_geocodeInverse(lat, lng, function (results, status) {
                if (results !== false) {
                    var d = nwgeo.extraerDataResult(results[0], results);
                    self.dataMarkerDestino = results;
                    var dat = {};
//                    dat.lat = d.allData.geometry.location.lat();
//                    dat.lng = d.allData.geometry.location.lng();
                    dat.lat = lat;
                    dat.lng = lng;
                    dat.ciudad = d.ciudad;
                    dat.name = d.direccion;
                    dat.name_place = d.ciudad;
                    self.pointMapDestinoExec(dat);
                    if (self.campo === "address_destino") {
                        self.ui.listo_fijar_label.setVisibility(false);
                        self.ui.listo_fijar.setVisibility(true);
                    }
                }
            });
//                }
//            });
        },
        pointMapDestino: function pointMapDestino(r) {
            var self = this;
            var dat = {};
            if (self.debug) {
                console.log("pointMapDestino()", r);
            }
            dat.lat = r.place.geometry.location.lat();
            dat.lng = r.place.geometry.location.lng();
            dat.name = r.results.address;
            dat.icon = r.place.icon;
            dat.name_place = r.place.name;
            dat.ciudad = r.results.ciudad;
            dat.type = r.results.type;
            if (!nw.evalueData(dat.ciudad) && nw.evalueData(dat.name_place)) {
                dat.ciudad = dat.name_place;
            }
            if (self.debug) {
                console.log("pointMapDestino", r);
            }
            self.pointMapDestinoExec(dat);
        },
        pointMapDestinoExec: function pointMapDestinoExec(r) {
            var self = this;

//            if (self.debugConstruct) {
            console.log("CREATE::pointMapDestinoExec", r);
//            }

            self.__typeOrigin = r.type;

            var dataform = self.getRecord();
            console.log("dataform", dataform);
            console.log("dataform.address", dataform.address);
            console.log("dataform.address_destino", dataform.address_destino);
            console.log("self.campo", self.campo);
            if (self.campo == "address_destino" && !nw.utils.evalueData(dataform.address)) {
                $(".address").click();
                $(".address").trigger("click");
                $(".address").trigger("touch");
                $(".address").focus();
                nw.dialog("Ingresa la dirección de partida");
                return;
            }
//            if (!nw.utils.evalueData(dataform.address) || !nw.utils.evalueData(dataform.address_destino)) {
//                nw.dialog("Debe completar las direcciones de partida y/o destino");
//                return;
//            }

            if (self.serviceActive !== true) {
                if (self.campo === "address") {
                    self.campo = "address_destino";
                    var pos = {
                        lat: r.lat,
                        lng: r.lng
                    };
                    self.launch = true;
                    nwgeo.removeAllPolyLines();
                    self.ui.listo_fijar.setVisibility(false);
                    self.markerSelected = false;
                    nwgeo.removeMarker(self.marker3);

                    self.ui.fijar_en_mapa_origen.setVisibility(false);
                    self.ui.address_destino.setVisibility(true);
                    self.ui.fijar_en_mapa_destino.setVisibility(true);
                    self.ui.address_destino.focus();

                    if (nw.utils.evalueData(r.ciudad)
                            || nw.utils.evalueData(r.lat)
                            || nw.utils.evalueData(r.lng)
                            || nw.utils.evalueData(r.name)
                            || nw.utils.evalueData(r.name_place)) {

                        var se = {};
//                        se.results = results[0];
                        se.address = r.name;
                        se.direccion = r.name;
                        se.ciudad = r.ciudad;
                        se.lat = r.lat;
                        se.lng = r.lng;
                        self.setUbicOne(se, se);
                    } else {
                        self.setPositionOne(pos);
                    }

                    return false;
                }
            }
            self.cleanMarkerDestino();
            self.fijaMarkerMapDestino(r);
        },
        fijaMarkerMapDestino: function fijaMarkerMapDestino(r) {
            var self = this;

            self.resetValuesHome();


            console.log("fijaMarkerMapDestino:::START", r);
            if (nw.evalueData(r.ciudad)) {
                self.ciudad_destino = r.ciudad;
            }
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

            r.type = self.__typeOrigin;

            marker.label = "";
            marker.icon = config.domain_rpc + config.carpet_files_extern + '/img/pin_negro_44.png';
            if (nw.evalueData(config.iconDriverPuntoB)) {
                marker.icon = config.iconDriverPuntoB;
            }
            marker.draggable = false;
            marker.animation = false;
            self.markerDestino = marker.show(function () {});
            if (self.debugConstruct) {
                console.log("fijaMarkerMapDestino::CREATE::MARKER", marker);
            }
            if (nw.evalueData(r.name)) {
                self.ui.address_destino.setValue(r.name);
                self.dataGeoTwo = r;
                self.dataGeoTwoName = r.name;
                self.geoDestino.latitudDes = r.lat;
                self.geoDestino.longitudDes = r.lng;
                self.geoDestino.ciudad_destino = r.ciudad;
                var pag1 = document.querySelector('.driver_en_camino_show');
                if (!pag1) {
                    if (self.debugConstruct) {
                        console.log("CREATE::fijaMarkerMapDestino::create services continuar");
                    }
                    self.continuar();
                }
            }
        }
    }
});