nw.Class.define("f_activeEnRuta", {
    extend: nw.lists,
    construct: function (self, r) {
        if (self.debugConstruct) {
            console.log("LAUNCH:::f_activeEnRuta", r);
        }
        self.pathDriverToOrigin = r.pathDriverToOrigin;
//        if (!self.actEnRuta) {
        self.cleanPre();
        self.ui.cancelar_pedido_en_ruta.setVisibility(true);
        document.querySelector(".centrar_mapa").style.display = "block";
        self.hiddenWaitingDriver();

        self.ui.contenedor_address.removeClass("contenedor_address_show");
        self.ui.driver_en_camino.addClass("driver_en_camino_show");
        var tiempo = nw.utils.tr("calculando") + "...";
        var distancia = nw.utils.tr("calculando") + "...";
        if (typeof self.polyti !== 'undefined') {
            tiempo = self.polyti.tiempo_text;
            distancia = self.polyti.distance_text;
        }
//        var da = document.querySelector(".containInfoDriver");
//        if (!da) {
        var htm = "<span class='infoDriverText'>" + nw.utils.tr("Tu conductor está en camino") + "</span>";
        if (nw.utils.evalueData(r.id_parada)) {
            htm += "</br><span class='titlepaxintravel' style='    font-weight: bold;'>" + nw.utils.tr("Pasajero / Parada") + ": <span>#" + r.id_parada + "</span></span>";
        }
        htm += "</br>" + nw.utils.tr("Tiempo estimado") + ": <span class='tiempo_es'>" + tiempo + "</span>";
        htm += "</br>" + nw.utils.tr("Distancia") + ": <span class='distancia_es'>" + distancia + "</span>";
        htm += "</br>" + nw.utils.tr("Servicio #") + "<span class='servicionum_es'>" + r.id + "</span>";
        var h = self.htmlDatosConductor(r, htm);
        self.ui.html_driver_en_camino.setValue(h);
//        }
        self.useChat(r);
        var he = self.ui.driver_en_camino.height();
        self.reziseMap(he);
//            if (typeof self.polylineRuta === 'undefined') {
//                self.markerPolylineActiveEnRuta();
//            }
        if (self.debugConstruct) {
            console.log("CREATE:::f_activeEnRuta:::HTML_EN_CAMINO_POLYLINE");
        }
//        } else {
//                if (self.actEnRuta === true) {
//                if (typeof self.polylineRuta === 'undefined') {
//                    self.markerPolyline();
//                }
//                }

//        console.log("getDistanceMatrix::self.geo.latitudOri", self.geo.latitudOri);
//        console.log("getDistanceMatrix::self.geo.longitudOri", self.geo.longitudOri);
        console.log("getDistanceMatrix::self.geo.latitudOri", r.latitudOri);
        console.log("getDistanceMatrix::self.geo.longitudOri", r.longitudOri);
        console.log("getDistanceMatrix::r.driver_latitud", r.driver_latitud);
        console.log("getDistanceMatrix::r.driver_longitud", r.driver_longitud);
//        if (nw.evalueData(self.geo.latitudOri)
//                && nw.evalueData(self.geo.longitudOri)
        if (nw.evalueData(r.latitudOri)
                && nw.evalueData(r.longitudOri)
                && nw.evalueData(r.driver_latitud)
                && nw.evalueData(r.driver_longitud)
                ) {
            var d = nwgeo.distance(parseFloat(self.geo.latitudOri), parseFloat(self.geo.longitudOri), parseFloat(r.driver_latitud), parseFloat(r.driver_longitud));
            console.log("nwgeo.distance", d);
            d = d.toFixed(0);
            var distance_metros = parseFloat(d);
            var distance_km = distance_metros / 1000;
            console.log("distance_metros", distance_metros);
            console.log("distance_km", distance_km);

            var div = document.querySelector('.distancia_es');
            if (div) {
                div.innerHTML = distance_km + " Km";
            }

            var velocidad_km = 10;
            var tiempo = distance_km / velocidad_km;
            console.log("tiempo", tiempo);
            tiempo = tiempo.toFixed(2);
            var distance_tiempo_horas = parseFloat(tiempo);
            console.log("distance_tiempo_horas", distance_tiempo_horas);

            var distance_tiempo_minutos = distance_tiempo_horas * 60;
            console.log("distance_tiempo_minutos", distance_tiempo_minutos);
            var div = document.querySelector('.tiempo_es');
            if (div) {
                div.innerHTML = distance_tiempo_minutos.toFixed(2) + " mins";
            }

//            var myLatlng = new google.maps.LatLng(parseFloat(self.geo.latitudOri), parseFloat(self.geo.longitudOri));
//            var myLatlng2 = new google.maps.LatLng(parseFloat(r.driver_latitud), parseFloat(r.driver_longitud));
//            var distance = google.maps.geometry.spherical.computeDistanceBetween(myLatlng, myLatlng2);
//            console.log("distancedistancedistancedistance", distance);


//            if (typeof self.serviceMatrix === 'undefined') {
//                self.serviceMatrix = new google.maps.DistanceMatrixService();
//            }

            /*
             var origin1 = new google.maps.LatLng(parseFloat(r.driver_latitud), parseFloat(r.driver_longitud));
             var destinationB = new google.maps.LatLng(parseFloat(self.geo.latitudOri), parseFloat(self.geo.longitudOri));
             console.log("getDistanceMatrix");
             alert("getDistanceMatrix");
             self.serviceMatrix.getDistanceMatrix(
             {
             origins: [origin1],
             destinations: [destinationB],
             travelMode: 'DRIVING',
             //                            transitOptions: TransitOptions,
             //                            drivingOptions: DrivingOptions,
             unitSystem: google.maps.UnitSystem.METRIC,
             avoidHighways: false,
             avoidTolls: false
             }, callback);
             function callback(response, status) {
             if (status == "OK") {
             var result = response.rows[0].elements[0];
             if (result && typeof result.duration !== 'undefined') {
             if (typeof result.duration.text !== 'undefined') {
             var div = document.querySelector('.tiempo_es');
             if (div) {
             div.innerHTML = result.duration.text;
             }
             }
             if (typeof result.distance.text !== 'undefined') {
             var div = document.querySelector('.distancia_es');
             if (div) {
             div.innerHTML = result.distance.text;
             }
             }
             }
             }
             }
             */
        }
//            self.markerPolylineActiveEnRuta(function () {
//                if (self.dragMap === false) {
//                    var latDriver = self.positionConductor.lat;
//                    var lngDriver = self.positionConductor.lng;
//                    var zoom = 18;
//                    var bounds = [
//                        {"lat": latDriver, "lng": lngDriver},
//                        {"lat": self.geoDestino.latitudOri, "lng": self.geoDestino.longitudOri}
//                    ];
//                    var multiplePoints = false;
//                    var animate = true;
//                    var lat1 = false;
//                    var lng1 = false;
//                    nwgeo.centerMap(self.map, self.markerMyPosition, self.markerDestino, zoom, bounds, multiplePoints, animate, lat1, lng1);
//                    if (self.debugConstruct) {
//                        console.log("CHANGE:::f_activeEnRuta:::HTML_DISTANCE_TIME_CENTERMAP_ORIG/DRIVER");
//                    }
//                }
//            });
//        }
        self.actEnRuta = true;
    },
    destruct: function () {
    },
    members: {
    }
});