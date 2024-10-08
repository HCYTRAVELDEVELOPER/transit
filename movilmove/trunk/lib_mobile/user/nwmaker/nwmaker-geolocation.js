var __polyGoogleMaps = new Array();
var __infoWindows = new Array();
var nwgeo = {
    latitude: false,
    longitude: false,
    zoom: 15,
    mapCanvas: document.querySelector(".mapa"),
    useNative: true,
    native: false,
    type: null,
    loadApiGoogleJavascript: false,
    timeoutLimitWaitUbica: 5000, //120000
    maximumAge: 300000, //300000
    enableHighAccuracy: true,
//    key: "AIzaSyBajx2ZPzBtciFXA9z1LNXFc3daLe-xSk4",
    //netcar
//    key: "AIzaSyDwzPL22nfy3hRDB-kxNSJLc_dpSMGQijY",
//nueva 2021-04-05
//    key: "AIzaSyACNy07A4kREm7VTt6ucGPSTJTMPfSi3nM",
    //de qxnw 2023mar03
//    key: "AIzaSyCyAdzt0ckjtvki6lNIylPzPaT3tYaGROQ",
//    key: "AIzaSyD3fDzcfPZO0BJzVJboCbu8NcGNp7GYpcM", //desarrollonw1@gmail.com 11May2023 key onlymaps
//    key: "AIzaSyA0WNbmAFS83x1YBnAcYLS9qcq3DoB1HH8", //desarrollonw1@gmail.com 03Abril2023 key back
//    key: "AIzaSyBlqkcJcLStw3Mbqou7Qa504VdJwfFpvis", //desarrollonw1@gmail.com 03Abril2023 key desarrollo
    key: "AIzaSyCgYA9SlMJf2T_Z477v9PP5DMV2E3mYzYU", //desarrollonw1@gmail.com 03Abril2023 key producción
    start: function () {
        var self = this;
        if (typeof plugin !== "undefined") {
            if (typeof plugin.google !== "undefined") {
                if (self.useNative === true) {
                    self.native = true;
                }
            }
        }
    },
    initialize: function (callback, loadGoogleMaps, libraries) {
        var self = this;
        if (self.loadApiGoogleJavascript) {
            callback();
            return false;
        }
        if (typeof plugin !== "undefined") {
            if (typeof plugin.google !== "undefined") {
                if (self.useNative === true) {
                    self.native = true;
                }
            }
        }
        if (nw.evalueData(config.keyApiGoogleMaps)) {
            self.key = config.keyApiGoogleMaps;
        }
        var addlibraries = "";
        if (typeof libraries !== "undefined") {
            if (nw.evalueData(libraries)) {
                addlibraries = libraries;
            }
        }
//        console.log("keyGoogleMaps:::self.key", self.key);
//        console.log("window", window)
//        console.log("navigator", navigator)
//        console.log("nw.isOnline()", nw.isOnline())
//        if (!nw.isOnline()) {
//            callback();
//        } else
        if (loadGoogleMaps === false) {
            callback();
        } else {
            var url = "https://maps.googleapis.com/maps/api/js";
            if (!nw.isOnline()) {
                url = domainLib + "/others/google_maps.js";
            }
            var async = true;
            var addVersion = false;
//            nw.loadJs("https://maps.googleapis.com/maps/api/js?key=AIzaSyAcgUxq50DuYJaUqhvyXzvky1EjmMDPMZ4&libraries=places&libraries=visualization", function () {
//            nw.loadJs("https://maps.googleapis.com/maps/api/js?key=AIzaSyAcgUxq50DuYJaUqhvyXzvky1EjmMDPMZ4&libraries=places" + addlibraries, function () {
//            nw.loadJs("https://maps.googleapis.com/maps/api/js?key=AIzaSyBajx2ZPzBtciFXA9z1LNXFc3daLe-xSk4&libraries=places" + addlibraries, function () {
//            nw.loadJs("https://maps.googleapis.com/maps/api/js?key=" + self.key + "&libraries=places" + addlibraries, function () {
            nw.loadJs(url + "?key=" + self.key + "&callback=initMap&language=es-419&libraries=places" + addlibraries, function () {
//                callback();
            }, async, addVersion);
            window.initMap = function () {
                callback();
            };
        }
        self.loadApiGoogleJavascript = true;
    },
    setDataGeoLocal: function (array) {
//        4.6615942 -74.0525647
        nwgeo.latitude = array.latitud;
        nwgeo.longitude = array.longitud;
        config.lat = array.latitud;
        config.lng = array.longitud;

        window.localStorage.setItem("nwgeo_latitude", array.latitud);
        window.localStorage.setItem("nwgeo_longitude", array.longitud);
    },
    returnDataStaticError: function (error, callback) {
        var self = this;

//        var latitud = 0;
//        var longitud = 0;
//
//        self.setDataGeoLocal({
////            latitud: 4.6615942,
////            longitud: -74.0525647
//            latitud: latitud,
//            longitud: longitud
//        });
//
//        var position = {};
//        position.coords = {};
////        position.coords.latitude = 4.6482837;
////        position.coords.longitude = -74.1089149;
//        position.coords.latitude = latitud;
//        position.coords.longitude = longitud;
//        position.lat = position.coords.latitude;
//        position.lng = position.coords.longitude;
//
////        position.address = "Bogotá";
////        position.formatted_address = "Bogotá";
//        position.address = "0";
//        position.formatted_address = "0";
//        position.address_components = {};
////        position.address_components.locality = "Bogotá";
//        position.address_components.locality = "0";
//
//        position.allData = {};
//        callback(position);

        nwgeo.saveConfirmaCiudad(function (e, data) {
            console.log("e:::data", e, data);

            var latitud = parseFloat(e.latitud);
            var longitud = parseFloat(e.longitud);

            self.setDataGeoLocal({
//            latitud: 4.6615942,
//            longitud: -74.0525647
                latitud: latitud,
                longitud: longitud
            });

            var position = {};
            position.coords = {};
//        position.coords.latitude = 4.6482837;
//        position.coords.longitude = -74.1089149;
            position.coords.latitude = latitud;
            position.coords.longitude = longitud;
            position.lat = position.coords.latitude;
            position.lng = position.coords.longitude;

//        position.address = "Bogotá";
//        position.formatted_address = "Bogotá";
            position.address = e.nombre;
            position.formatted_address = e.nombre;
            position.address_components = {};
//        position.address_components.locality = "Bogotá";
            position.address_components.locality = e.nombre;

            position.allData = {};

            callback(position);
//        nwgeo.onMapError(error);
        });

    },
    getMapLocation: function (callback, errorOptional, usePositionPredet) {
        var self = this;
        var errorFunc = function (error) {
            console.log("error 1");
            if (usePositionPredet) {
                self.returnDataStaticError(error, callback);
            } else {
                nwgeo.onMapError(error);
            }
        };
        if (nw.evalueData(errorOptional)) {
            console.log("error 2");
            errorFunc = function (error) {
                errorOptional(error);

                var savedirect = true;
                var loading = false;
                var show = false;
                nw.errorLogger.process(error, savedirect, loading, show);
            };
        }
        if (typeof plugin !== "undefined") {
            if (typeof plugin.google !== "undefined") {
                if (self.useNative === true) {
                    self.native = true;
                }
            }
        }
        nwgeo.gpsActivation(function (response) {
            if (self.native) {
                var option = {
                    enableHighAccuracy: self.enableHighAccuracy // use GPS as much as possible
                };
                plugin.google.maps.LocationService.getMyLocation(
                        option,
                        function (location) {
                            self.setDataGeoLocal({
                                latitud: location.latLng.lat,
                                longitud: location.latLng.lng
                            });

                            window.localStorage.setItem("nwgeo_latitude", nwgeo.latitude);
                            window.localStorage.setItem("nwgeo_longitude", nwgeo.longitude);
                            if (nw.evalueData(callback)) {
                                callback(location);
                            }
                        },
                        function (error) {
                            console.log("error", error);
                            window.localStorage.setItem("userPermissionsSet_ACCESS_FINE_LOCATION", "rejected");
                            self.returnDataStaticError(false, function (location) {
                                self.setDataGeoLocal({
                                    latitud: location.lat,
                                    longitud: location.lng
                                });

                                window.localStorage.setItem("nwgeo_latitude", nwgeo.latitude);
                                window.localStorage.setItem("nwgeo_longitude", nwgeo.longitude);
                                if (nw.evalueData(callback)) {
                                    callback(location);
                                }
                            });


                        });
            } else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(onMapSuccess, errorFunc, {
                        'enableHighAccuracy': self.enableHighAccuracy,
                        "maximumAge": self.maximumAge,
                        "timeout": self.timeoutLimitWaitUbica
                    });
                    function  onMapSuccess(position) {
                        self.setDataGeoLocal({
                            latitud: position.coords.latitude,
                            longitud: position.coords.longitude
                        });

                        window.localStorage.setItem("nwgeo_latitude", nwgeo.latitude);
                        window.localStorage.setItem("nwgeo_longitude", nwgeo.longitude);
                        if (nw.evalueData(callback)) {
                            callback(position);
                        }
                    }
                } else {
                    errorFunc;
                }
            }
        }, function (response) {
            nw.loadingRemove();
            nw.dialog("Para continuar, debe activar su GPS");
            return false;
        });
    },
    getMapEmbed: function (container, array) {
        console.log("getMapEmbed:::array", array);
        var key = nwgeo.key;
        if (typeof container == "string") {
            container = document.querySelector(container);
        }
        if (!container) {
            nw.dialog("El container al que intenta agregar el mapa no existe");
            return false;
        }
        var origin = "Bogotá";
        var destination = "Bogotá";
        var origin_coord = false;
        var destination_coord = false;
        if (nw.evalueData(array.origen_latitud) && nw.evalueData(array.origen_longitud) && nw.evalueData(array.destino_latitud) && nw.evalueData(array.destino_longitud)) {
            origin = array.origen_latitud + "," + array.origen_longitud;
            origin_coord = array.origen_latitud + "," + array.origen_longitud;
            destination = array.destino_latitud + "," + array.destino_longitud;
            destination_coord = array.destino_latitud + "," + array.destino_longitud;
        }
        if (nw.evalueData(array.direccion_origen) && nw.evalueData(array.direccion_destino)) {
//            origin = array.direccion_origen.replace("#", " ");
//            destination = array.direccion_destino.replace("#", " ");
            origin = nw.utils.str_replace("#", " ", array.direccion_origen);
            destination = nw.utils.str_replace("#", " ", array.direccion_destino);
//            origin = encodeURIComponent(array.direccion_origen);
//            destination = encodeURIComponent(array.direccion_destino);
        }
        var zoom = "13";
        if (nw.utils.evalueData(array.zoom)) {
            zoom = array.zoom;
        }

        var mode = "directions"; //place directions
        var options = "";
        options += "&mode=driving";
        options += "&units=imperial";
        options += "&origin=" + encodeURIComponent(origin) + "&destination=" + encodeURIComponent(destination);
        if (nw.utils.evalueData(origin_coord) && nw.utils.evalueData(destination_coord)) {
            options += "&waypoints=" + origin_coord + "|" + destination_coord;
        }
//        options += "&waypoints=" + origin + "|" + destination;
        options += "&zoom=" + zoom;
//        options += "&q=" + origin;
//        options += "&center=";
//        options += "&avoid=tolls|highways";
        console.log("options", options);
        var iframe = document.createElement("iframe");
        iframe.className = "mapEmbedNw";
        iframe.loading = "lazy";
//        iframe.src = "https://www.google.com/maps/embed/v1/place?key=" + key + "&&q=71.0378379,-110.05995059999998";
//        iframe.src = "https://www.google.com/maps/embed/v1/directions?key=" + key + "&origin=Oslo+Norway&destination=Telemark+Norway&avoid=tolls|highways";
        iframe.src = "https://www.google.com/maps/embed/v1/" + mode + "?key=" + key + options;
//        iframe.src = "https://www.google.com/maps/embed/v1/view?key=" + key + "&zoom=17&center=4.6988%2C-74.0481";
        container.appendChild(iframe);
    },
    getMap: function (native) {
        var self = this;
        this.latitude = nwgeo.latitude;
        this.longitude = nwgeo.longitude;
        this.canvas = nwgeo.mapCanvas;
        this.zoom = nwgeo.zoom;
        this.animate = true;
        this.iconMarker = false;
        this.tilt = 40;
        this.bearing = 100;
        this.durationAnimation = 5000;
        this.styleMap = null;
        this.mapTypeControl = null;
        this.zoomControl = null;
        this.mapType = 'roadmap';
        this.backgroundColor = 'white';
        this.show = function (callback) {
            if (nwgeo.native && native !== false) {
//            var div = document.getElementById("map_canvas");
                var div = self.canvas;
                // If your app runs this program on browser,
                // you need to set `API_KEY_FOR_BROWSER_RELEASE` and `API_KEY_FOR_BROWSER_DEBUG`
                // before `plugin.google.maps.Map.getMap()`
                //   API_KEY_FOR_BROWSER_RELEASE for `https:` protocol
                //   API_KEY_FOR_BROWSER_DEBUG for `http:` protocol
                plugin.google.maps.environment.setEnv({
//                    'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBZamoub9SCWL2GriEBRSgLGVVrF0QPakk',
                    'API_KEY_FOR_BROWSER_RELEASE': self.key,
                    'API_KEY_FOR_BROWSER_DEBUG': self.key
                })
                var mapType = plugin.google.maps.MapTypeId.ROADMAP; //SATELLITE, HYBRID, TERRAIN;
                if (this.mapType === "roadmap" || this.mapType === "ROADMAP") {
                    mapType = plugin.google.maps.MapTypeId.ROADMAP;
                }
                if (this.mapType === "satellite" || this.mapType === "SATELLITE") {
                    mapType = plugin.google.maps.MapTypeId.SATELLITE;
                }
                if (this.mapType === "hybrid" || this.mapType === "HYBRID") {
                    mapType = plugin.google.maps.MapTypeId.HYBRID;
                }
                if (this.mapType === "terrain" || this.mapType === "TERRAIN") {
                    mapType = plugin.google.maps.MapTypeId.TERRAIN;
                }
                var options = {
                    'backgroundColor': this.backgroundColor,
                    'mapType': mapType,
                    'controls': {
                        'compass': true,
                        'myLocationButton': true,
                        'indoorPicker': true,
                        'zoom': true
                    },
                    'gestures': {
                        'scroll': true,
                        'tilt': true,
                        'rotate': true,
                        'zoom': true
                    },
                    camera: {
                        target: {
                            lat: self.latitude,
                            lng: self.longitude
                        },
                        'tilt': this.tilt,
                        'bearing': this.bearing,
                        zoom: this.zoom
                    }
                };
//                if (self.animate) {
//                    self.map = plugin.google.maps.Map.getMap(div);
//                    self.map.animateCamera({
//                        target: {lat: this.latitude, lng: this.longitude},
//                        zoom: this.zoom,
//                        tilt: this.tilt,
//                        bearing: this.bearing,
//                        duration: this.durationAnimation,
//                        padding: 0
//                    });
//                } else {
//                    self.map = plugin.google.maps.Map.getMap(div, options);
//                }
                self.map = plugin.google.maps.Map.getMap(div, options);
                if (self.animate) {
                    self.map.animateCamera({
                        target: {lat: this.latitude, lng: this.longitude},
                        zoom: this.zoom,
                        tilt: this.tilt,
                        bearing: this.bearing,
                        duration: this.durationAnimation,
                        padding: 0
                    });
                }
                nwgeo.mapi = self.map;
//                var marker = self.map.addMarker({
//                    position: {
//                        lat: this.latitude,
//                        lng: this.longitude
//                    },
//                    'icon': {
//                        'url': this.iconMarker
//                    }
////                    icon: {
////                        url: this.iconMarker,
////                        size: {
////                            width: 47,
////                            height: 60
////                        }
////                    }
////                    title: "",
////                    snippet: "",
////                    animation: plugin.google.maps.Animation.BOUNCE
//                });
//                console.log("this.iconMarker", this.iconMarker);
//                marker.setIcon(this.iconMarker);

                // Show the info window
//                marker.showInfoWindow();
                if (nw.evalueData(callback)) {
                    callback(self.map);
                }
                return self.map;
            } else {
                //            var uluru = {lat: self.latitude, lng: self.longitude};
//            self.map = new google.maps.Map(self.canvas, {zoom: self.zoom, center: uluru});
//            var marker = new google.maps.Marker({position: uluru, map: self.map});
//            var estilo = nwgeo.styleMapSilver();
                var estilo = nwgeo.styleMapNetCar();
                if (nw.evalueData(config.modeMapa)) {
                    if (config.modeMapa === "styleMapNight") {
                        estilo = nwgeo.styleMapNight();
                    } else
                    if (config.modeMapa === "styleGrayWY") {
                        estilo = nwgeo.styleGrayWY();
                    }
                    if (config.modeMapa === "styleUber2") {
                        estilo = nwgeo.styleUber2();
                    }
                    if (config.modeMapa === "styleMapUber") {
                        estilo = nwgeo.styleMapUber();
                    }
                    if (config.modeMapa === "styleMapStandard") {
                        estilo = nwgeo.styleMapStandard();
                    }
                    if (config.modeMapa === "styleMapSilver") {
                        estilo = nwgeo.styleMapSilver();
                    }
                    if (config.modeMapa === "styleDark") {
                        estilo = nwgeo.styleDark();
                    }
                }
                if (nw.evalueData(self.styleMap)) {
                    estilo = self.styleMap;
                }
                var mapTypeControl = false;
                if (nw.evalueData(config.mapTypeControl)) {
                    mapTypeControl = config.mapTypeControl;
                }
                if (nw.evalueData(self.mapTypeControl)) {
                    mapTypeControl = self.mapTypeControl;
                }
                var zoomControl = false;
                if (nw.evalueData(config.zoomControl)) {
                    zoomControl = config.zoomControl;
                }
                if (nw.evalueData(self.zoomControl)) {
                    zoomControl = self.zoomControl;
                }
                var mapOptions = {

                    center: new google.maps.LatLng(this.latitude, this.longitude),
                    zoom: self.zoom,
                    styles: estilo,
                    mapTypeId: this.mapType,
                    gestureHandling: 'auto',
                    scrollwheel: true,
                    mapTypeControl: mapTypeControl,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_CENTER
                    },
                    optimized: false,
                    disableDefaultUI: false,
                    rotateControl: false,
                    scaleControl: false,
                    zoomControl: zoomControl,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_BOTTOM
                    },
                    streetViewControl: false,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    fullscreenControl: false
                };
                self.map = new google.maps.Map(self.canvas, mapOptions);
                self.map.setZoom(self.zoom);
                if (nw.evalueData(callback)) {
                    callback(self.map);
                }
                return self.map;
            }
        };
    },
    setBackgroundColorMap: function (color) {
        var self = this;
        if (self.native) {
            plugin.google.maps.environment.setBackgroundColor(color);
        }
    },
    dragMap: function (mode, map, callback) {
        var self = this;
        if (self.native) {
            map.one(plugin.google.maps.event.MAP_READY, function () {
                if (mode === "drag") {
                    map.on(plugin.google.maps.event.MAP_DRAG, function (e) {
                        return callback(e);
                    });
                }
            });
            map.one(plugin.google.maps.event.MAP_READY, function () {
                if (mode === "dragstart") {
                    map.on(plugin.google.maps.event.MAP_DRAG_START, function (e) {
                        return callback(e);
                    });
                }
            });
            map.one(plugin.google.maps.event.MAP_READY, function () {
                if (mode === "dragend") {
                    map.on(plugin.google.maps.event.MAP_DRAG_END, function (e) {
                        return callback(e);
                    });
                }
            });
        } else {
            if (mode === "drag") {
                map.addListener('drag', function (e) {
                    return callback(e);
                });
            }
            if (mode === "dragstart") {
                map.addListener('dragstart', function (e) {
                    return callback(e);
                });
            }
            if (mode === "dragend") {
                map.addListener('dragend', function (e) {
                    return callback(e);
                });
            }
        }
    },
    removePolyLine: function (polyline) {
        var self = this;
        if (self.native) {
            polyline.remove();
        } else {
            polyline.setMap(null);
        }
    },
    removeAllPolyLines: function (polys) {
        var self = this;
        var p = __polyGoogleMaps;
        if (nw.evalueData(polys)) {
            p = polys;
        }
        for (var i = 0; i < p.length; i++) {
//            if (self.native) {
//                __polyGoogleMaps[i].remove();
//            } else {
//                __polyGoogleMaps[i].setMap(null);
//            }
            self.removePolyLine(p[i]);
        }
    },
    addLineStreetStoped: false,
    addLineStreet: function (map, coords, callback, colorLine, onlyGetData, animateOrCenter, multipleCoords, polyLineName, removeAllPolys, funcGetNamePoly, arrayParadas = []) {
        var self = this;

//        alert("addLineStreet::::solicitudAPI");

        if (self.addLineStreetStoped === true) {
            return callback(false);
        }
        if (!nw.isOnline()) {
            self.addLineStreetStoped = true;
            setTimeout(function () {
                self.addLineStreetStoped = false;
            }, 2000);
            return callback(false);
        }

        if (typeof google === "undefined") {
            setTimeout(function () {
                return self.addLineStreet(map, coords, callback, colorLine, onlyGetData, animateOrCenter, multipleCoords, polyLineName, removeAllPolys, funcGetNamePoly, arrayParadas);
            }, 300);
            return false;
        }
        var coords_lat_1 = coords.lat;
        var coords_lat_2 = coords.lng;
        var coords_lat_3 = coords.lat2;
        var coords_lat_4 = coords.lng2;
        if (!nw.evalueData(colorLine)) {
            colorLine = "#970E04";
        }
        if (!nw.evalueData(coords_lat_1) || !nw.evalueData(coords_lat_2) || !nw.evalueData(coords_lat_3) || !nw.evalueData(coords_lat_4)) {
            var error = "addLineStreet:::error::: Una coordenada es inválida coords_lat_1: " + coords_lat_1;
            error += " coords_lat_2: " + coords_lat_2;
            error += " coords_lat_3: " + coords_lat_3;
            error += " coords_lat_4: " + coords_lat_4;
            console.log(error);
            var savedirect = true;
            var loading = false;
            var show = true;
//            nw.errorLogger.process(error, savedirect, loading, show);
            return callback(false);
            return false;
        }
        coords_lat_1 = parseFloat(coords_lat_1);
        coords_lat_2 = parseFloat(coords_lat_2);
        coords_lat_3 = parseFloat(coords_lat_3);
        coords_lat_4 = parseFloat(coords_lat_4);
        var start = new google.maps.LatLng(coords_lat_1, coords_lat_2);
        var end = new google.maps.LatLng(coords_lat_3, coords_lat_4);
        if (typeof self.directionsService === 'undefined') {
//            self.travelMode = google.maps.TravelMode.DRIVING;
            self.travelMode = "DRIVING";
            self.directionsService = new google.maps.DirectionsService();
        }
//        console.log("arrayParadas", arrayParadas);
        var waypoints = [];
        var total = arrayParadas.length;
        for (var i = 0; i < total; i++) {
            var res = arrayParadas[i];
            if (nw.evalueData(res.latitud) || nw.evalueData(res.longitud)) {
                waypoints.push({
                    location: new google.maps.LatLng(res.latitud, res.longitud),
                    stopover: false
                });
            }
        }
        var request = {
            origin: start,
            destination: end,
            travelMode: self.travelMode,
            waypoints: waypoints,
            drivingOptions: {
                departureTime: new Date(Date.now()),
//                trafficModel: "optimistic"
                trafficModel: "pessimistic"
            }
            ,
            unitSystem: google.maps.UnitSystem.METRIC
//            unitSystem: google.maps.UnitSystem.IMPERIAL
        };
//        console.log("self.travelMode", self.travelMode);
//        console.log("coords_lat_1", coords_lat_1);
//        console.log("coords_lat_2", coords_lat_2);
//        console.log("coords_lat_3", coords_lat_3);
//        console.log("coords_lat_4", coords_lat_4);
//        console.log("start", start);
//        console.log("end", end);
//        console.log("request", request);
        self.directionsService.route(request, function (result, status) {
//            console.log("removeAllPolys", removeAllPolys);
//            console.log("directionsService status", status);
//            console.log("directionsService result", result);
            if (removeAllPolys !== false) {
                self.removeAllPolyLines();
            }
            var rta = "";
            if (status == google.maps.DirectionsStatus.OK) {
                rta = result.routes;
            } else
            if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                self.addLineStreetStoped = true;
                setTimeout(function () {
                    self.addLineStreetStoped = false;
                }, 2000);
                return callback(false);
            } else {
                console.log("Error directionsService self.directionsService", self.directionsService);
                console.log("Error directionsService status", status);
                console.log("Error directionsService result", result);
                rta = "sin resultados";
                var error = "Error in API directionsService status: " + status + " result: " + result;
                var savedirect = true;
                var loading = false;
                var show = false;
//                nw.errorLogger.process(error, savedirect, loading, show);
                if (status !== "UNKNOWN_ERROR") {
//                    nw.dialog("Error in API directionsService status: " + status, " result: " + result);
                }
                return callback(false);
            }
            if (typeof result.routes[0] === "undefined") {
                return callback(false);
            }
            var pp = [];
            var totPath = result.routes[0].overview_path.length;
            for (var i = 0; i < totPath; i++) {
                var pat = result.routes[0].overview_path[i];
                pp.push({
                    lat: pat.lat(),
                    lng: pat.lng()
                });
            }
            rta.pathOnetoOne = pp;
            if (onlyGetData === true) {
                return callback(rta);
            }
            if (!self.native) {
                for (var n = 0; n < result.routes.length; n++) {
                    var rut = result.routes[n];
                    pintarRutaGoogleMap(rut.overview_polyline);
                }
                function pintarRutaGoogleMap(encodedPoints) {
                    var decodedPoints = google.maps.geometry.encoding.decodePath(encodedPoints);
                    if (typeof polyLineName === "undefined" || polyLineName === false || polyLineName === null) {
                        encodedPolyline = new google.maps.Polyline({
                            strokeColor: colorLine,
                            strokeOpacity: 1.0,
                            strokeWeight: 5,
                            map: map,
                            path: decodedPoints,
                            clickable: false
                        });
                        __polyGoogleMaps.push(encodedPolyline);

                        console.log("funcGetNamePoly", funcGetNamePoly);
                        if (nw.evalueData(funcGetNamePoly)) {
                            funcGetNamePoly(encodedPolyline);
                        }

                    } else {
                        encodedPolyline.setPath(decodedPoints);
                    }
                }
            }
            if (self.native && onlyGetData !== true) {
                var HND_AIR_PORT = {lat: coords_lat_1, lng: coords_lat_2};
                var SFO_AIR_PORT = {lat: coords_lat_3, lng: coords_lat_4};
                var AIR_PORTS = [
                    HND_AIR_PORT,
                    SFO_AIR_PORT
                ];
                var decodedPoints = plugin.google.maps.geometry.encoding.decodePath(result.routes[0].overview_polyline)
                map.addPolyline({
                    points: decodedPoints,
                    'color': colorLine,
                    'width': 4,
                    'geodesic': true,
                    'clickable': false
                }, function (polyline) {
                    __polyGoogleMaps.push(polyline);
                    if (nw.evalueData(funcGetNamePoly)) {
                        funcGetNamePoly(polyline);
                    }
                });
                if (animateOrCenter !== "nothing") {
                    if (animateOrCenter === "animate" && multipleCoords === true) {
                        map.animateCamera({target: SFO_AIR_PORT, zoom: 18, tilt: 40, bearing: 100, duration: 6000});
                    } else {
                        var animate = false;
                        if (animateOrCenter === "animate") {
                            animate = true;
                        }
                        var zoom = false;
                        var bounds = [
                            {"lat": coords_lat_1, "lng": coords_lat_2},
                            {"lat": coords_lat_3, "lng": coords_lat_4}
                        ];
                        var multiplePoints = true;
                        nwgeo.centerMap(map, self.marker1, false, zoom, bounds, multiplePoints, animate);
                    }
                }
            }
            return callback(rta);
        });
    },
    addPilyLineNative: function (map, coords) {
        var self = this;
        if (!self.native) {
            return;
        }
        var colorLine = "#970E04";
        var coords_lat_1 = coords.lat;
        var coords_lat_2 = coords.lng;
        var coords_lat_3 = coords.lat2;
        var coords_lat_4 = coords.lng2;
        if (!nw.evalueData(coords_lat_1) || !nw.evalueData(coords_lat_2) || !nw.evalueData(coords_lat_3) || !nw.evalueData(coords_lat_4)) {
            var error = "addLineStreet:::error::: Una coordenada es inválida coords_lat_1: " + coords_lat_1;
            error += " coords_lat_2: " + coords_lat_2;
            error += " coords_lat_3: " + coords_lat_3;
            error += " coords_lat_4: " + coords_lat_4;
            console.log(error);
            var savedirect = true;
            var loading = false;
            var show = true;
//            nw.errorLogger.process(error, savedirect, loading, show);
            return callback(false);
            return false;
        }
        coords_lat_1 = parseFloat(coords_lat_1);
        coords_lat_2 = parseFloat(coords_lat_2);
        coords_lat_3 = parseFloat(coords_lat_3);
        coords_lat_4 = parseFloat(coords_lat_4);

        var HND_AIR_PORT = {lat: coords_lat_1, lng: coords_lat_2};
        var SFO_AIR_PORT = {lat: coords_lat_3, lng: coords_lat_4};
        var AIR_PORTS = [
            HND_AIR_PORT,
            SFO_AIR_PORT
        ];
        map.addPolyline({
            'points': [
                HND_AIR_PORT,
                SFO_AIR_PORT
            ],
            'color': colorLine,
            'width': 10,
            'geodesic': true,
            idx: 0,
            'clickable': false
        }, function (polyline) {

        });
//            if (animateOrCenter === "animate" && multipleCoords === true) {
//            map.animateCamera({target: AIR_PORTS, zoom: 18, tilt: 40, bearing: 100, duration: 0});
//            } else {
//                var animate = false;
//                if (animateOrCenter === "animate") {
//                    animate = true;
//                }
//                var zoom = false;
//                var bounds = [
//                    {"lat": coords_lat_1, "lng": coords_lat_2},
//                    {"lat": coords_lat_3, "lng": coords_lat_4}
//                ];
//                var multiplePoints = true;
//                nwgeo.centerMap(map, self.marker1, false, zoom, bounds, multiplePoints, animate);
//            }
    },
    animateCamera: function (map, options) {
        var self = this;
        if (!self.native) {
            return;
        }
//        map.animateCamera({target: AIR_PORTS, zoom: 18, tilt: 40, bearing: 100, duration: 0});
        map.animateCamera(options);
    },
    addLine: function (map, coords) {
        var coords_lat_1 = coords.lat;
        var coords_lat_2 = coords.lng;
        var coords_lat_3 = coords.lat2;
        var coords_lat_4 = coords.lng2;
        var flightPlanCoordinates = [
            {lat: coords_lat_1, lng: coords_lat_2},
            {lat: coords_lat_3, lng: coords_lat_4}
        ];
        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        flightPath.setMap(map);
        return flightPath;
    },
    removeLine: function (flightPath) {
        flightPath.setMap(null);
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
    addPolyLineSimple: function (map, coords, colorLine) {
        if (!nw.evalueData(colorLine)) {
            colorLine = "#5c5c5c";
        }
        var pp = coords;
        var flightPlanCoordinates = new Array();
        for (var i = 0; i < pp.length; i++) {
            var point = new google.maps.LatLng(pp[i].lat, pp[i].lng);
            flightPlanCoordinates.push(point);
        }
        var encodedPolyline = new google.maps.Polyline({
            path: flightPlanCoordinates,
            map: map,
            geodesic: true,
            strokeColor: colorLine,
            strokeOpacity: 1.0,
            strokeWeight: 5
        });
//        __polyGoogleMaps.push(encodedPolyline);
    },
    getTimeToDistanceAndSpeed: function (km, speed) {
        if (typeof speed === "undefined" || !nw.evalueData(speed)) {
            speed = 5;
        }
        var time = km / speed;
        time = time * 60;
        return time;
    },
    centerMap: function (map, marker1, marker2, zoom, boundsNative, multiplePoints, animate, lat1, lng1) {
        var self = this;
        if (self.native) {
            if (multiplePoints) {
//            var bounds = [
//                {"lat": nwgeo.latitude, "lng": nwgeo.longitude},
//                {"lat": 37.422858, "lng": -122.085065}
//            ];
                map.moveCamera({
                    'target': boundsNative
//                    ,
//                    'tilt': 40, // ignored
//                    'zoom': 19, // ignored
//                    'bearing': 0  // ignored
                }, function () {

                });
            } else {
                var GOOGLE = {"lat": nwgeo.latitude, "lng": nwgeo.longitude};
                if (nw.evalueData(lat1) && nw.evalueData(lng1)) {
                    GOOGLE = {"lat": lat1, "lng": lng1};
                }
                if (nw.evalueData(boundsNative)) {
                    GOOGLE = boundsNative[0];
                }
                if (animate === true) {
                    map.animateCamera({
                        target: GOOGLE,
//                        zoom: 17,
//                        tilt: 60,
//                        bearing: 140,
                        zoom: 19,
                        tilt: 40,
                        bearing: 100,
                        duration: 5000
                    });
                } else {
                    map.setCameraTarget(GOOGLE);
                }
            }

            if (nw.evalueData(zoom)) {
                map.setCameraZoom(zoom);
            }

        } else {
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(marker1.position);
            if (nw.evalueData(marker2)) {
                bounds.extend(marker2.position);
            }
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
            if (nw.evalueData(zoom)) {
                map.setZoom(zoom);
            }
//        if (!nw.evalueData(marker2)) {
//            map.setZoom(nwgeo.zoom);
//        }
        }
    },
    setIndoorEnabled: function (map, trueOrFalse) {
        map.setIndoorEnabled(trueOrFalse);
    },
    getTrafficInMap: function (map, trueOrFalse) {
        map.setTrafficEnabled(trueOrFalse);
    },
    getCenterMap: function (map) {
        var self = this;
        var r = {};
        if (self.native) {
            var ra = map.getCameraPosition();
            r.lat = ra.target.lat;
            r.lng = ra.target.lng;
            r.allData = ra;
        } else {
            var ra = map.getCenter();
            r.lat = ra.lat();
            r.lng = ra.lng();
            r.allData = ra;
        }
        return r;
    },
    getPlaceByHtml: function (bt, place) {
        var one = bt.split('class="' + place + '">');
        if (nw.evalueData(one[1])) {
            var two = one[1].split("</span");
            if (nw.evalueData(two[0])) {
                return two[0];
            }
        }
        return false;
    },
    intentosLoadGoogle: 0,
    autocomplete: function (input, map, callback, countries, otherOptions) {
        if (!nw.utils.evalueData(input)) {
            return false;
        }
        var self = this;
        if (!document.querySelector(".loading_google_autocomplete")) {
            nw.loading({text: "", title: "Cargando api, por favor espera <span class='textIntentosApiGoogle'></span>", addClass: "loading_google_autocomplete"});
        }
        var test = false;
//        var test = true;
        if (typeof google == "undefined" || test === true) {
            setTimeout(function () {
                self.intentosLoadGoogle++;
                nwgeo.autocomplete(input, map, callback, countries, otherOptions);
                if (self.intentosLoadGoogle > 5) {
                    var span = document.querySelector(".textIntentosApiGoogle");
                    if (span) {
                        span.innerHTML = self.intentosLoadGoogle + " intentos, no hemos podido cargar la API autocomplete, parece que tienes conexión baja o nula, comprueba tu red";
                    }
                }
            }, 1000);
            return false;
        }
        if (typeof otherOptions == "undefined") {
            otherOptions = {};
        }
        self.intentosLoadGoogle = 0;
        nw.remove(".loading_google_autocomplete");

//        console.log("autocomplete", input);
//        console.log("autocomplete:::otherOptions", otherOptions);

        var options = {}; //CO es el ISO de Colombia};
        options.strictBounds = false;
        if (typeof otherOptions.strictBounds != "undefined") {
            options.strictBounds = otherOptions.strictBounds;
        }

        const center = {lat: nwgeo.latitude, lng: nwgeo.longitude};
        const defaultBounds = {
            north: center.lat + 0.1,
            south: center.lat - 0.1,
            east: center.lng + 0.1,
            west: center.lng - 0.1,
        };
        options.bounds = defaultBounds;

//        console.log("autocomplete:::options", options);

        var autocomplete = new google.maps.places.Autocomplete(input, options);

        if (nw.evalueData(map)) {
            autocomplete.bindTo('bounds', map);
        }
        if (nw.evalueData(countries)) {
            countries = JSON.parse(countries);
            autocomplete.setComponentRestrictions({
//                    country: ["us", "pr", "vi", "gu", "mp"]
                country: countries
            });
        }
//        autocomplete.setOptions({strictBounds: false});
        autocomplete.setOptions({strictBounds: options.strictBounds});

//        autocomplete.setFields(['formatted_address', 'adr_address', 'address_components', 'geometry', 'icon', 'name']);
        autocomplete.setFields(['formatted_address', 'adr_address', 'geometry', 'name']);
        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
//            console.log("placeplaceplaceplace", place);
            if (!place.geometry) {
                nw.dialog("No details available for input: '" + place.name + "'");
                return;
            }
//            var address = place.formatted_address;
            var address = place.name + " " + place.formatted_address;
            var bt = place.adr_address;
//            console.log("bt", bt);

            var countryName = nwgeo.getPlaceByHtml(bt, "country-name");
//            console.log("countryName", countryName);

            var region = nwgeo.getPlaceByHtml(bt, "region");
//            console.log("region", region);

            var ciudad = nwgeo.getPlaceByHtml(bt, "locality");
//            console.log("ciudad", ciudad);

            var streetAddress = nwgeo.getPlaceByHtml(bt, "street-address");
//            console.log("streetAddress", streetAddress);

            var postalCode = nwgeo.getPlaceByHtml(bt, "postal-code");
//            console.log("postalCode", postalCode);

            if (!nw.evalueData(ciudad) && nw.evalueData(region)) {
                ciudad = region;
            }
            console.log("ciudad", ciudad);

            var type = "";
            if (address.toLowerCase().indexOf("airport") != -1 || address.toLowerCase().indexOf("aeropuerto") != -1) {
//                console.log("address", address);
//                console.log("address.airport", address.toLowerCase().indexOf("airport"));
//                console.log("address.aeropuerto", address.toLowerCase().indexOf("aeropuerto"));
                type = "airport";
            }

            var data = {};
//            data.address_components = a;
            data.address = address;
            data.direccion = address;
            data.type = type;
            data.postCode = postalCode;
            data.postal_code = postalCode;
            data.ciudad = ciudad;
            data.pais_b = countryName;
            data.country = countryName;
            data.pais = countryName;
            data.name = address;
            data.formatted_address = address;
            data.allData = data;

            var rta = {};
            rta.place = place;
            rta.address = address;
            rta.autocomplete = autocomplete;
            rta.results = data;
            return callback(rta);
        });

        var classRand = "loading_" + nw.utils.createRandomId();
        input.classRandAuto = "." + classRand;
        $(input).after("<div class='loadingAutocomplete " + classRand + "' style='display: none;position: absolute; z-index: 1000; width: 100px; height: auto; background-color: #fff; padding: 10px; box-shadow: 0px 0px 5px #ccc; border-radius: 5px;'>" + nw.utils.tr("Buscando...") + "</div>");
        var timeWait = 3000;
        self.intervalInput = null;
        input.addEventListener("input", nonePassiveHandler, false);
        function nonePassiveHandler(event) {
            console.log("input");
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();

            $(".pac-container").removeClass("pac-container-hidde");
            $(".pac-container").addClass("pac-container-hidde");
            var loa = document.querySelector(this.classRandAuto);
            if (loa) {
                loa.style.display = "block";
            }
            clearTimeout(self.intervalInput);

            if (typeof loadNavigateInGeoNw == "undefined") {
                loadNavigateInGeoNw = true;
                $(window).on("navigate", function (event, data) {
                    var direction = data.state.direction;
                    console.log("direction", direction);
                    $(".pac-container").removeClass("pac-container-hidde");
                    $(".pac-container").addClass("pac-container-hidde");
                    $(".loadingAutocomplete").css({display: "none"});
                    clearTimeout(self.intervalInput);
                });
            }

            self.intervalInput = setTimeout(function () {
                console.log("start input show!!!!!!!!!!!!!!!!!!:::loa:::", loa, input);
                console.log("start input input.style.display", input.style.display);
                google.maps.event.trigger($(input)[0], 'focus', {});
                $(".pac-container").removeClass("pac-container-hidde");
                if (loa) {
                    loa.style.display = "none";
                }
            }, timeWait);
        }
    },
    gpsActivation: function (success, failure) {
        var self = this;
//        return success(true);
        if (typeof cordova.plugins === "undefined") {
            return success(true);
        }
        var os = nw.getMobileOperatingSystem();
        if (os !== "ANDROID" || typeof cordova.plugins.locationAccuracy === "undefined") {
            return success(true);
        }
        if (typeof cordova.plugins.locationAccuracy !== "undefined") {
            cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
                if (canRequest) {
                    cordova.plugins.locationAccuracy.request(function (response) {
//                        console.log("Successfully requested accuracy: " + response.message);
                        return success(true);
                    }, function (error) {
                        console.log("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
                        if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
//                            var options = {};
//                            options.textAccept = "Si";
//                            options.textCancel = "Salir de la app";
//                            function accept() {
//                                cordova.plugins.diagnostic.switchToLocationSettings();
//                            }
//                            function cancel() {
//                                nw.closeApp();
//                            }
//                            var text = "No se pudo establecer automáticamente el Modo de ubicación en 'Alta precisión'. ¿Desea cambiar a la página Configuración de ubicación y hacer esto manualmente?";
//                            nw.dialog(text, accept, cancel, options);
                            if (typeof cordova.plugins.diagnostic === "undefined") {
//                                nw.dialog("No se pudo establecer automáticamente el Modo de ubicación en 'Alta precisión'");
                                return true;
                            }
//                            if (window.confirm("No se pudo establecer automáticamente el Modo de ubicación en 'Alta precisión'. ¿Desea cambiar a la página Configuración de ubicación y hacer esto manualmente?")) {
//                                cordova.plugins.diagnostic.switchToLocationSettings();
//                                return false;
//                            }
                            return false;
                        }
                        console.log("error.code", error.code);
                        nw.errorLogger.process("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
                        if (error.code !== -1) {
                            var options = {};
                            options.textAccept = "Volverlo a intentar";
                            options.textCancel = "Salir";
                            function accept() {
                                self.gpsActivation(success, failure);
                            }
                            function cancel() {
                                nw.closeApp();
                            }
                            var text = "Ha decidido no activar su GPS, es necesario para continuar. " + error.message;
                            nw.dialog(text, accept, cancel, options);
                        }
//                        return failure(error.message);
                    }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
//                    });
                } else {

                    return success(true);

//                    navigator.geolocation.getCurrentPosition(ok, error, {
//                        enableHighAccuracy: self.enableHighAccuracy,
//                        maximumAge: self.maximumAge,
//                        timeout: self.timeoutLimitWaitUbica
//                    });
//                    function ok(e) {
//                        self.gpsActivation(success, failure);
////                        window.location.reload();
//                    }
//                    function error(e) {
//                        self.gpsActivation(success, failure);
//                    }
//                    var options = {};
//                    options.textAccept = "Volverlo a intentar";
//                    options.textCancel = "Salir";
//                    function accept() {
//                        self.gpsActivation(success, failure);
//                    }
//                    function cancel() {
//                        nw.closeApp();
//                    }
//                    var text = "Debe activar su GPS, es necesario para continuar.";
//                    nw.dialog(text, accept, cancel, options);
//                    console.log("NOPP request location permission and try again");
                    // request location permission and try again
//                    self.gpsActivation(success, failure);
//                    return success(true);
                }
            });
        }
//        return success(true);
        return true;
//plugin old
        var os = nw.getMobileOperatingSystem();
        if (os !== "ANDROID" || typeof navigator.geolocation.activator === "undefined") {
            return success(true);
        }
        navigator.geolocation.activator.askActivation(function (response) {
            return success(response);
        }, function (response) {
            return failure(response);
        });
    },
    removeMarker: function (marker) {
        var self = this;
        if (nw.evalueData(marker)) {
            if (self.native) {
                marker.remove();
            } else {
                marker.setMap(null);
            }
        }
    },
    clickMarker: function (marker, callback) {
        var self = this;
        if (self.native) {
            marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function (marker) {
                callback(marker);
            });
        } else {
            marker.addListener('touch', function (e) {
                callback(this, e);
            });
        }
    },
    dragMarker: function (marker, callback) {
        var self = this;
        if (self.native) {
            marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function (marker) {
//                marker.getPosition(function (latLng) {
//                    marker.setTitle(latLng.toUrlValue());
//                    marker.showInfoWindow();
//                });
                callback(marker);
            });
        } else {
            nwgeo.dragMap("drag", marker, function (e) {
                callback(e);
            });
        }
    },
    addMarker: function (center) {
        this.map = nwgeo.map;
        this.latitude = nwgeo.latitude;
        this.longitude = nwgeo.longitude;
        this.title = "";
        this.path = "";
        this.label = "";
        this.data = "";
        this.icon = "";
        this.infowindow = null;
        this.animation = true;
        this.draggable = false;
        this.infoWindowPush = true;
        this.titleShowInit = true;
        this.titleShowOnClick = false;
        this.centerOnClick = false;
        this.zoomCenterOnClick = 15;
        this.centerInMap = false;
        this.native = nwgeo.native;
        if (typeof center !== "undefined") {
            this.centerInMap = center;
        }
        var animate = null;
        this.show = function (callback) {
            var self = this;
//            console.log("self.native", self.native);
            if (self.native) {
                if (self.animation) {
//                    animate = plugin.google.maps.Animation.BOUNCE;
                }
                var marker = self.map.addMarker({
                    position: {
                        lat: self.latitude,
                        lng: self.longitude
                    },
                    'icon': {
                        'url': self.icon
                    },
                    animation: animate
//                    snippet: "This plugin is awesome!",
                });
                // Show the info window
//                marker.showInfoWindow();
                if (typeof callback !== "undefined") {
                    callback();
                }
                return marker;
            } else {
                if (self.animation) {
                    animate = google.maps.Animation.DROP;
                }

                var options = {
                    position: new google.maps.LatLng(self.latitude, self.longitude),
                    draggable: self.draggable,
//                    title: self.title,
                    data: self.data,
                    map: self.map,
//                    label: self.label,
//                    labelContent: self.label,
//                    labelAnchor: new google.maps.Point(18, 12),
//                    labelClass: "my-custom-class-for-label",
//                    labelInBackground: true,
                    icon: self.icon,
//                    path: self.path,
                    optimized: false,
                    animation: animate
                };
                if (self.label !== "") {
                    options.label = {
                        text: self.label,
                        color: "#000000",
                        fontSize: "16px",
                        fontWeight: "0"
                    }
                }
                var marker = new google.maps.Marker(options);
//                var marker = new MarkerWithLabel(options);
                marker.setMap(self.map);
//                marker.setTitle(self.title);
                if (self.centerInMap !== false) {
                    self.map.setCenter(marker.getPosition());
                }

                self.infowindow = new google.maps.InfoWindow({
                    content: self.title
//                    ,
//                    maxWidth: 200
                });

                if (self.titleShowInit && self.title !== "") {
                    self.infowindow.open(self.map, marker);
                }

                marker.infowindow = self.infowindow;

//                self.infowindow.close();

                if (self.infoWindowPush) {
                    __infoWindows.push(self.infowindow);
                }

                if (self.titleShowOnClick && self.title !== "") {
                    marker.addListener('click', function () {
                        nwgeo.removeAllInfoWindow();
                        if (marker.getAnimation() !== null) {
                            marker.setAnimation(null);
                        } else {
                            marker.setAnimation(google.maps.Animation.BOUNCE);
                        }
                        if (self.centerOnClick) {
                            nwgeo.centerMap(self.map, marker, false, self.zoomCenterOnClick);
                        }
                        self.infowindow.open(self.map, marker);
                    });
                }
                if (typeof callback !== "undefined") {
                    callback(marker);
                }
                return marker;
            }
        };
    },
    removeAllInfoWindow: function () {
        var self = this;
        for (var i = 0; i < __infoWindows.length; i++) {
            if (self.native) {
                __infoWindows[i].remove();
            } else {
                __infoWindows[i].close();
            }
        }
    },
    infoWindow: function () {
        this.map = nwgeo.map;
        this.text = "";
        this.marker = null;
        this.pos = false;
        this.show = function (callback) {
            var infoWindow = new google.maps.InfoWindow;
//            infoWindow.setPosition(pos);
            infoWindow.setContent(this.text);
            infoWindow.open(this.map, this.marker);

            if (typeof callback !== "undefined") {
                callback(infoWindow);
            }
            return infoWindow;
        };
    },
    getDataResultNative: function (re) {
        var direccion = re.thoroughfare + " # " + re.subThoroughfare;
        var gps = {
            lat: re.latitude,
            lng: re.longitude,
            ciudad: re.locality,
            direccion: direccion,
            address: direccion + " " + re.locality + " " + re.subAdministrativeArea + " " + re.administrativeArea,
            address_components: {
                sublocality: re.locality,
                neighborhood: re.neighborhood,
                country: re.countryName,
                locality: re.subAdministrativeArea,
                ciudad: re.locality,
                city: re.locality,
            },
            allData: re
        };
        return gps;
    },
    getDataResult: function (results) {
        var self = this;
        if (typeof nativegeocoder !== "undefined") {
            return self.getDataResultNative(results);
        }
        if (!nw.utils.evalueData(results)) {
            return {};
        }
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
    extraerDataResultNative: function (results) {
//        console.log("results", results);
//        nw.console.log("nwmaker-geolcation.js:::extraerDataResultNative:::results", results);
        var address = "My location";
        if (typeof results.addressLines != "undefined") {
            address = results.addressLines[0];
        }
        var os = nw.utils.getMobileOperatingSystem();
        if (os === "IOS") {
            address = results.thoroughfare + " " + results.subThoroughfare + " " + results.locality + " " + results.countryName + " " + results.subLocality;
        }
        var type = "";
        if (address.toLowerCase().indexOf("airport") != -1 || address.toLowerCase().indexOf("aeropuerto") != -1) {
            console.log("address", address);
            console.log("address.airport", address.toLowerCase().indexOf("airport"));
            console.log("address.aeropuerto", address.toLowerCase().indexOf("aeropuerto"));
            type = "airport";
        }

        var ciudad = results.locality;
        if (!nw.utils.evalueData(ciudad)) {
            if (nw.utils.evalueData(results.addressLines)) {
                if (nw.utils.evalueData(results.addressLines.administrativeArea)) {
                    ciudad = results.addressLines.administrativeArea;
                }
            }
        }
        if (!nw.utils.evalueData(ciudad)) {
            if (nw.utils.evalueData(results.administrativeArea)) {
                ciudad = results.administrativeArea;
            }
        }
        console.log("ciudad", ciudad);
        var a = nwgeo.getDataResult(results);
        var data = {};
        data.address_components = a;
        data.address = address;
        data.direccion = address;
        data.barrio = results.subLocality;
        data.localidad = results.subLocality;
        data.type = type;
        data.countryCode = results.countryCode;
        data.country = results.countryName;
        data.ciudad = ciudad;
        data.allData = results;
        return data;
    },
    extraerDataResult: function (results, resultsAllArrays) {
        var self = this;
        nw.console.log("nwmaker-geolcation.js:::typeof nativegeocoder:::", typeof nativegeocoder);
        if (typeof nativegeocoder !== "undefined") {
            return self.extraerDataResultNative(results);
        }

        console.log("results", results)
        if (!nw.utils.evalueData(results)) {
            return {};
        }


        var type = "";
        nwgeo.type = "";
        if (nw.evalueData(resultsAllArrays)) {
            for (var i = 0; i < resultsAllArrays.length; i++) {
                var res = resultsAllArrays[i];
                if (nw.evalueData(res.types)) {
                    for (var x = 0; x < res.types.length; x++) {
                        var ty = res.types[x];
                        if (ty === "airport") {
                            type = "airport";
                            nwgeo.type = type;
                            results = res;
                            console.log("Is airport!!", res);
                            break;
                        }
                    }
                }
            }
        }
        var a = nwgeo.getDataResult(results);

        var data = {};
        data.address_components = a;
        data.address = results.formatted_address;
        data.direccion = results.formatted_address;
        data.barrio = a.neighborhood;
        data.localidad = a.sublocality;
        data.type = type;

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
        for (var p = address.length - 1; p >= 0; p--) {
            if (ciudad === "") {
                //si es una ciudad 
                if (address[p].types.indexOf("locality") !== -1 && typeof address[p].long_name !== "undefined") {
                    console.log("locality", address[p])
                    ciudad = address[p].long_name;
                } else
                //si es una ciudad de nivel 2
//                if (address[p].types.indexOf("administrative_area_level_1") !== -1 && typeof address[p].long_name !== "undefined") {
//                    ciudad = address[p].long_name;
//                    console.log("administrative1", address[p])
//                    console.log("ciudad", ciudad)
//                } else
                if (address[p].types.indexOf("administrative_area_level_2") !== -1 && typeof address[p].long_name !== "undefined") {
                    console.log("administrative2", address[p])
                    ciudad = address[p].long_name;
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
//        console.log("results", results);
        var airport = self.extractFromAdress(results.address_components, "airport");
        var postCode = self.extractFromAdress(results.address_components, "postal_code");
        var street = self.extractFromAdress(results.address_components, "route");
        var town = self.extractFromAdress(results.address_components, "locality");
        var country = self.extractFromAdress(results.address_components, "country");
        var countryCode = self.extractFromAdress(results.address_components, "country", "short_name");

//        console.log("postCode", postCode)
//        console.log("street", street)
//        console.log("town", town)
//        console.log("country", country)

        var arrAddress = results.address_components;
        var itemRoute = '';
        var itemLocality = '';
        var itemCountry = '';
        var itemPc = '';
        var itemSnumber = '';
// iterate through address_component array
        $.each(arrAddress, function (i, address_component) {
            if (typeof address_component !== "undefined") {
                if (nw.evalueData(address_component)) {
                    if (typeof address_component.types !== "undefined") {
                        if (typeof address_component.types[0] !== "undefined") {
                            if (address_component.types[0] == "route") {
//                console.log(i + ": route:" + address_component.long_name);
                                itemRoute = address_component.long_name;
                            }

                            if (address_component.types[0] == "locality") {
//                console.log("town:" + address_component.long_name);
                                itemLocality = address_component.long_name;
                            }

                            if (address_component.types[0] == "country") {
//                console.log("country:" + address_component.long_name);
                                itemCountry = address_component.long_name;
                            }

                            if (address_component.types[0] == "postal_code_prefix") {
//                console.log("pc:" + address_component.long_name);
                                itemPc = address_component.long_name;
                            }

                            if (address_component.types[0] == "street_number") {
//                console.log("street_number:" + address_component.long_name);
                                itemSnumber = address_component.long_name;
                            }
                        }
                    }
                }
            }
            //return false; // break the loop   
        });

        var components = {};
        if (nw.evalueData(results.address_components)) {
            var address_components = results.address_components;
            jQuery.each(address_components, function (k, v1) {
                if (typeof v1 != "undefined") {
                    if (nw.evalueData(v1)) {
                        if (typeof v1.types != "undefined") {
                            if (nw.evalueData(v1.types)) {
                                jQuery.each(v1.types, function (k2, v2) {
                                    components[v2] = v1.long_name;
                                });
                            }
                        }
                    }
                }
            });
            var city, postal_code, state, country, sublocality, street_number, route;
//        console.log("components", components);
            if (components.locality) {
                city = components.locality;
                ciudad = components.locality;
            }
        }
//        if (!city) {
//            city = components.administrative_area_level_1;
//            ciudad = components.administrative_area_level_1;
//        }

        if (components.postal_code) {
            postal_code = components.postal_code;
        }
        if (components.postal_code) {
            postal_code = components.postal_code;
        }
        if (components.administrative_area_level_1) {
            state = components.administrative_area_level_1;
        }
        if (components.route) {
            route = components.route;
        }
        if (components.sublocality_level_1) {
            sublocality = components.sublocality_level_1;
        }
        if (components.country) {
            country = components.country;
        }
        if (components.street_number) {
            street_number = components.street_number;
        }

        data.itemRoute = itemRoute;
        data.itemLocality = itemLocality;
        data.itemCountry = itemCountry;
        data.itemPc = itemPc;
        data.itemSnumber = itemSnumber;
        data.airpor = airport;
        data.countryCode = countryCode;
        data.postCode = postCode;
        data.street_number = street_number;
        data.country = country;
        data.sublocality = sublocality;
        data.route = route;
        data.state = state;
        data.postal_code = postal_code;
        data.poblacion = poblacion;
        data.ciudad = ciudad;
        data.ciudad_street = street;
        data.ciudad_b = a.locality;
        data.pais_b = a.country;
        data.pais = pais;
        data.allData = results;
        console.log("ciudad:::", ciudad);
//        console.log("ENDRESULTSDATA:::", data);
        return data;
    },
    extractFromAdress: function (components, type, typename) {
        for (var i = 0; i < components.length; i++)
            for (var j = 0; j < components[i].types.length; j++)
                if (components[i].types[j] == type) {
                    if (typename === "short_name") {
                        return components[i].short_name;
                    } else {
                        return components[i].long_name;
                    }
                }
        return "";
    },
    validateGoogleDefine: function (callback) {
        var self = this;
//        console.log("validateGoogleDefine typeof google", typeof google)
        if (typeof google === "undefined") {
            setTimeout(function () {
                self.validateGoogleDefine(callback);
            }, 1000);
            return false;
        }
        callback();
    },
    api_geocodeInverse: function (lat, lng, callback) {
//        console.log("api_geocodeInverse:::lat", lat);
//        console.log("api_geocodeInverse:::lng", lng);

//        alert("api_geocodeInverse start");

        if (!nw.evalueData(lat) || !nw.evalueData(lng)) {
            nwgeo.saveConfirmaCiudad(function (e, data) {
                console.log("e:::data", e, data);
                nwgeo.api_geocodeInverse(parseFloat(e.latitud), parseFloat(e.longitud), callback);
            });
//            nw.dialog("Api geocode latitud y/o longitud inválida");
//            callback(false);
//            window.location.reload();
            return false;
        }
        var self = this;
        var os = nw.utils.getMobileOperatingSystem();
        var usanativecode = true;
//        if (os !== "IOS") {
//            usanativecode = false;
//        }
        if (typeof nativegeocoder !== "undefined" && usanativecode) {
//            alert("api_geocodeInverse NATIVE (no use)");
            console.log("!!!!!!!!api_geocodeInverse NATIVE (no use)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            nativegeocoder.reverseGeocode(success, failure, lat, lng, {
                useLocale: true,
                maxResults: 2
            });
            function success(result) {
//                console.log("api_geocodeInverse___NATIVE:::result", result);
                nw.console.log("nwmaker-geolcation.js:::api_geocodeInverse___NATIVE:::result", result);
                callback(result);
            }
            function failure(err) {
                console.error("api_geocodeInverse___NATIVE::error", err);
                return callback(false);
            }
            return;
        }
//        alert("api_geocodeInverse");
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!api_geocodeInverse!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        if (typeof nwgeo.geocoder === 'undefined') {
            nwgeo.geocoder = new google.maps.Geocoder();
        }
        var ui = new google.maps.LatLng(lat, lng);
        nwgeo.geocoder.geocode({'latLng': ui}, processGeocoderValidate);
        function processGeocoderValidate(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                callback(results, status);
            } else {
                console.log("Geocoding fallo debido a : " + status);
                nw.dialog("Geocoding no procesado debido a : " + status);
//                nw.errorLogger.process("Geocoding fallo debido a : " + status);
                errorFunc("Geocoding no procesado debido a : " + status);
//                callback(false);
            }
        }
        var errorFunc = function (error) {
            self.returnDataStaticError(error, callback);
        };
    },
    getLocation: function (callback) {
        var self = this;
        var errorFunc = function (error) {
            self.returnDataStaticError(error, callback);
        }
        nwgeo.gpsActivation(function (response) {
            self.validateGoogleDefine(function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(ok, errorFunc, {
                        'enableHighAccuracy': self.enableHighAccuracy,
                        "maximumAge": self.maximumAge,
                        "timeout": self.timeoutLimitWaitUbica
                    });
                    function ok(e) {
                        nwgeo.api_geocodeInverse(e.coords.latitude, e.coords.longitude, function (results, status) {
                            if (results !== false) {
                                console.log("getLocation:::nwgeo.api_geocodeInverse:::results", results);
                                var d = nwgeo.extraerDataResult(results[0], results);
                                d.lat = e.coords.latitude;
                                d.lng = e.coords.longitude;
                                d.coords = e.coords;
                                d.responseAll = e;
                                callback(d);
                            }
                        });
                    }
                } else {
                    nwgeo.onMapError();
                }
            });
        }, function (response) {
            nw.loadingRemove();
            nw.dialog("Para continuar, debe activar su GPS");
            return false;
        });
    },
    getLatitudLongitud: function (callback) {
        var self = this;
        console.log("getLatitudLongitud START");
        nwgeo.gpsActivation(function (response) {
            if (navigator.geolocation) {
                console.log("getLatitudLongitud GET PROMISE WAIT");

                console.log("navigator", navigator);
                console.log("navigator.permissions", navigator.permissions);

                if (typeof navigator.permissions != "undefined") {
                    navigator.permissions.query({name: 'geolocation'}).then(function (result) {
                        console.log("result", result);
                        if (result.state == "denied") {
                            self.returnDataStaticError(false, function (location) {
                                self.setDataGeoLocal({
                                    latitud: location.lat,
                                    longitud: location.lng
                                });

                                window.localStorage.setItem("nwgeo_latitude", nwgeo.latitude);
                                window.localStorage.setItem("nwgeo_longitude", nwgeo.longitude);
                                if (nw.evalueData(callback)) {
                                    callback(location);
                                }
                            });
                        }
                    });
                }

                navigator.geolocation.getCurrentPosition(showPosition, error, {
                    enableHighAccuracy: self.enableHighAccuracy,
//                    maximumAge: Infinity,
//                    timeout: 0
                    timeout: self.timeoutLimitWaitUbica,
                    maximumAge: self.maximumAge
                });
                function showPosition(position) {
                    console.log("getLatitudLongitud RESOLVE OK", position);

                    self.setDataGeoLocal({
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude
                    });
                    window.localStorage.setItem("nwgeo_latitude", nwgeo.latitude);
                    window.localStorage.setItem("nwgeo_longitude", nwgeo.longitude);

                    if (nw.evalueData(callback)) {
                        callback(position);
                    }
                }
                var error = function (error) {
                    console.log("getLatitudLongitud RESOLVE ERROR", error);
                    console.log("Error en getLatitudLongitud", error);
                    var ms = "<h2>Sin recepción de GPS</h2>";
                    ms += "<p>Lo sentimos, no hay recepción de GPS en esta ubicación. Asegúrate de estar al aire libre.</p>";
                    ms += "<br /><p>Asegúrese de tener una buena conexión a Internet si presenta fallos con la red.</p>";
                    nw.dialog(ms, function () {
                        window.location.reload();
                    });
                }
            } else {
                nw.dialog("Su dispositivo no cuenta con acceso al sistema navigator.geolocation.");
            }
        }, function (response) {
            nw.loadingRemove();
            nw.dialog("Para continuar, debe activar su GPS");
            return false;
        });
    },
    onMapError: function (error) {
        console.log("error", error);
        nw.loadingRemove();
        nw.remove(".popup_error_geolocationmaker");
        var options = {};
//        options.textAccept = "Volver a intentarlo";
        options.textAccept = "Continuar";
//        options.textCancel = "Generar ticket";
        options.original = true;
        options.className = "popup_error_geolocationmaker";
        options.addClass = "popup_error_geolocationmaker";
        function accept() {
//            window.location.reload();
//            nw.closeApp();
            return true;
        }
        var cancel = false;
//        function cancel() {
//            var savedirect = true;
//            var loading = true;
//            var show = true;
//            nw.errorLogger.process(error, savedirect, loading, show);
//            return true;
//        }
        var text = nw.utils.tr('Error al cargar su ubicación.');
        if (typeof error == "object") {
            text += 'Código: ' + error.code + ' ' + ' Mensaje: ' + error.message;
            console.log("errorerrorerrorerrorerror", error)
            if (error.code.toString() === "1") {
//            text += "<h5>Permiso denegado para usar la ubicación por GPS. Valide que cuente con los permisos de ubicación.</h5>";
                text = "<h5>No hay acceso a servicios de ubicación. Por favor asegúrate de que los servicios de ubicación estén activados.</h5>";
                nw.dialog(text);
                return false;
            }
        }
//        text += "<br /><h3>" + nw.utils.tr("¿Desea generar un ticket?") + "</h3>";
        console.log('ERROR::GEOLOCATION:::error', error);
//        nw.dialog(text, accept, cancel, options);

        error.mensaje = text;
//        nw.errorLogger.process(error);
    },
    watchMapPosition: function (callback) {
        var self = this;
        nwgeo.gpsActivation(function (response) {
            function onMapWatchSuccess(position) {
                var updatedLatitude = position.coords.latitude;
                var updatedLongitude = position.coords.longitude;
                if (updatedLatitude != this.latitude && updatedLongitude != this.longitude) {

                    self.setDataGeoLocal({
                        latitud: updatedLatitude,
                        longitud: updatedLongitude
                    });

                    callback(position);
                }
            }
            self.watchID = navigator.geolocation.watchPosition(onMapWatchSuccess, nwgeo.onMapError, {
                enableHighAccuracy: self.enableHighAccuracy
            });
            return self.watchID;
        }, function (response) {
            nw.loadingRemove();
            nw.dialog("Para continuar, debe activar su GPS");
            return false;
        });
    },
    //jason
//    getWatchPostion: function (callback) {
//        var interval = setInterval(function () {
//            nwgeo.getLocation(function (gps) {
//                callback(gps, interval);
//            });
//        }, 10000);
//    },
    cleartWatchPostion: function () {
        var self = this;
        if (self.watchID != null) {
            navigator.geolocation.clearWatch(self.watchID);
            self.watchID = null;
        }
    },
    getWatchPostion: function (callback) {
        var self = this;
        nwgeo.gpsActivation(function (response) {
            var options = {
                enableHighAccuracy: self.enableHighAccuracy
            };
            if (navigator.geolocation) {
                self.watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
                function onSuccess(position) {
                    nwgeo.api_geocodeInverse(position.coords.latitude, position.coords.longitude, function (results, status) {
                        if (results !== false) {
                            var pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            var data = nwgeo.extraerDataResult(results[0], results);
                            data.position = pos;
                            callback(data);
                        }
                    });
                }
                function onError(error) {
                    alert('code: ' + error.code + 'message: ' + error.message + '\n');
                    nw.errorLogger.process('code: ' + error.code + 'message: ' + error.message + '\n');
                }
            } else {
                alert("No navigator.geolocation");
                console.log("No navigator.geolocation");
            }
        }, function (response) {
            nw.loadingRemove();
            nw.dialog("Para continuar, debe activar su GPS");
            return false;
        });
    },
//    jason fin
    setPositionMarker: function (marker, lat, lng, rotation) {
        if (!nw.evalueData(rotation)) {
            rotation = null;
        }
        var self = this;
        if (self.native) {
            marker.setPosition({
                lat: lat,
                lng: lng
            });
            if (rotation !== null) {
                marker.setRotation(rotation);
            }
        } else {
            marker.setPosition(new google.maps.LatLng(lat, lng));
            if (rotation !== null) {
                marker.setIcon({
//                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
//                strokeColor: 'red',
//                strokeWeight: 3,
//                scale: 6,
                    rotation: rotation
                });
            }
        }
    },
    styleMapStandard: function () {
        var d = [
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ];
        return d;
    },
    styleMapSilver: function () {
        var d = [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dadada"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e5e5e5"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#c9c9c9"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            }
        ];
        return d;
    },
    styleMapNight: function () {
        var r = [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#263c3f"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#6b9a76"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#38414e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#212a37"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9ca5b3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#1f2835"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#f3d19c"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2f3948"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#515c6d"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            }
        ];
        return r;
    },
    styleMapUber: function () {
        var r = [
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#d6e2e6"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#cfd4d5"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#7492a8"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "lightness": 25
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#dde2e3"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#cfd4d5"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#dde2e3"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#7492a8"
                    }
                ]
            },
            {
                "featureType": "landscape.natural.terrain",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#dde2e3"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#588ca4"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "saturation": -100
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#a9de83"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#bae6a1"
                    }
                ]
            },
            {
                "featureType": "poi.sports_complex",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#c6e8b3"
                    }
                ]
            },
            {
                "featureType": "poi.sports_complex",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#bae6a1"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#41626b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "saturation": -45
                    },
                    {
                        "lightness": 10
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#c1d1d6"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#a6b5bb"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#9fb6bd"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "saturation": -70
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#b4cbd4"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#588ca4"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#008cb5"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "transit.station.airport",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": -5
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#a6cbe3"
                    }
                ]
            }
        ];
        return r;
    },
    styleUber2: function () {
        var r = [
            {
                "featureType": "all",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#e7ecf0"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#8ed863"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -70
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "saturation": -60
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#8abdec"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#9cbbf0"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ];
        return r;
    },
    styleGrayWY: function () {
        var r = [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e9e9e9"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dedede"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#333333"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#fefefe"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#fefefe"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            }
        ];
        return r;
    },
    styleDark: function () {
        var r = [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#181818"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1b1b1b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2c2c2c"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8a8a8a"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#373737"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#3c3c3c"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#3d3d3d"
                    }
                ]
            }
        ];
        return r;
    },
    styleMapNetCar: function () {
        var r = [];
        return r;
    },
    saveConfirmaCiudad: function saveConfirmaCiudad(callback) {
        var self = this;
        var html = "";
        nw.remove(".container_cities_nwgeo");

        var options = {};
        options.setTitle = "Confirmar ciudad";
        options.id = "taskConfirmaCiudad";
        options.html = "<div class='titleconfirmatime'>Confirma el tiempo que duraste para finalizar esta tarea</div>";
        options.changeHash = true;
        options.showBack = true;
        options.closeBack = false;
        options.destroyAutomaticOnAccept = false;
        if (nw.isMobile()) {
            options.role = "page";
            options.transition = "slide";
        }
        options.fields = [
            {
                name: "texto_confirmar_ciudad",
                label: "No hemos podido ubicar tu ciudad",
                type: "html"
            },
            {
                name: "ciudad",
                label: "Busca tu ciudad actual",
                placeholder: "Digita tu ciudad",
                type: "search",
                autocomplete: true,
                required: true
            }
        ];
        var accept = function () {
            if (!d.validate()) {
                return false;
            }
            var data = d.getRecord();
            console.log("data", data);
            console.log("d.ciudad_all_data", d.ciudad_all_data);
//            self.self_crearviaje.ciudad_origen = self.ciudad_all_data.nombre;
            callback(d.ciudad_all_data, data);
            nw.remove("." + d.id);
            nw.remove(".container_cities_nwgeo");
            return true;
        };
//        var cancel = false;
        var cancel = function () {
            nw.remove(".container_cities_nwgeo");
            return true;
        };

        nw.dialog("<div id='main_container_cities_nwgeo' class='main_container_cities_nwgeo'></div>", accept, cancel, {
            addClass: "container_cities_nwgeo",
            original: true,
            destroyAutomaticOnAccept: false
        });
        options.showButtons = false;
        options.createInHome = true;
        options.canvas = "#main_container_cities_nwgeo";
        options.id = "main_container_cities_nwgeo_list";
        options.id_form = "main_container_cities_nwgeo_list_int";
        var d = nw.dialog2(html, false, false, options);

//            var data = {};
//            data[""] = "Seleccione";
//            d.ui.ciudad.populateSelectFromArray(data);
//            d.ui.ciudad.populateSelect('app_user', 'populateCiudades', {}, function (a) {
//
//            }, true);


        var data = {};
        data.service = "nwMaker";
        data.method = "populateCiudades";
        data.showsinresult = true;
        d.ui.ciudad.actionSearch(data);
        d.ui.ciudad.addListener("clickToken", function (e) {
            var thi = e;
            console.log(thi);
            if (!thi.data) {
                nw.cleanTokenField();
                return false;
            }
            d.ciudad_all_data = thi.data.row;
            d.ui.ciudad.setValue(thi.data.row.nombre);
        });
        $(".ciudad").focus();
    }
};
nwgeo.start();