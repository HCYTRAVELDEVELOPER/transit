nw.Class.define("f_saveAcceptService", {
    extend: nw.lists,
    construct: function (self, ra) {
        if (self.debugConstruct) {
            console.log("START_LAUNCH:::::::::::::: f_saveAcceptService");
        }

//        if (self.debugConstruct) {
        console.log("START:::saveAcceptService:::ra", ra);
//        }
        if (self.configCliente.pide_vehiculo_conductores === "SI") {
            if (!nw.evalueData(self.vehiculo.id)) {
                var options = {};
                options.textAccept = "Ir a mis vehículos";
                nw.dialog("Para continuar, debe activar un vehículo.", function () {
                    main.misVehiculos();
                }, false, options);
                return false;
            }
        }
        if (self.configCliente.app_para != "CARGA") {
            if (nw.evalueData(self.configCliente.permitir_tomar_servicios_ocupado) && self.configCliente.permitir_tomar_servicios_ocupado != "SI") {
                self.clearIntervalo();
            }
        }

        self.data_service = ra;
        self.id_service = ra.id;
//            self.clearintervalCerrar();
//            var ra = self.data_service;
        var up = nw.userPolicies.getUserData();
        var da = {};
        da.id = self.id_service;
        da.conductor_usuario = up.usuario;
        da.id_usuario = up.id_usuario;
        da.nombre = up.nombre;
        da.apellido = up.apellido;
        da.empresa = up.empresa;

        if (!nw.utils.evalueData(ra.vehiculo) && nw.utils.evalueData(self.vehiculo.id)) {
            da.vehiculo = self.vehiculo.id;
        }
        if (!nw.utils.evalueData(ra.vehiculo_text) && nw.utils.evalueData(self.vehiculo.marca_text)) {
            da.vehiculo_text = self.vehiculo.marca_text;
        }
        if (!nw.utils.evalueData(ra.placa) && nw.utils.evalueData(self.vehiculo.placa)) {
            da.placa = self.vehiculo.placa;
        }
        if (!nw.utils.evalueData(ra.color) && nw.utils.evalueData(self.vehiculo.color)) {
            da.color = self.vehiculo.color;
        }

        da.foto = up.foto_perfil;
        da.celular = up.celular;
        da.domain_rpc = config.domain_rpc;
        if (up.bodega != "" && up.bodega != "null" && up.bodega !== null) {
            da.bodega = up.bodega;
            da.bodega_text = up.bodega_text;
        }
        var token = null;
        if (nw.evalueData(window.localStorage.getItem("token"))) {
            token = window.localStorage.getItem("token");
        }
        var gps = self.positionConductor;
//        da.latitudAceptaService = gps.lat;
//        da.longitudAceptaService = gps.lng;
        da.latitudAceptaService = nwgeo.latitude;
        da.longitudAceptaService = nwgeo.longitude;
        if (!self.validateGpsActive()) {
            return false;
        }
        da.token_conductor = token;
        da.empresa = up.empresa;
        da.usuario = up.usuario;
        da.estado = "EN_RUTA";
        da.estado_inicial = ra.estado;
        if (ra.tipo_servicio === "reservado" && ra.estado === "SOLICITUD") {
            da.estado = "ACEPTADO_RESERVA";
        }
        if (config.usaFechaVencimientoSaldo === true) {
            da.usaFechaVencimientoSaldo = "SI";
        }
//        var map = self.map;
//            var coords = {lat: self.geo.latitude, lng: self.geo.longitude, lat2: ra.latitudOri, lng2: ra.longitudOri};
//            var func_one = function (response) {
//                self.poly.tiempo = response[0].legs[0].duration.value;
//                self.poly.tiempo_text = response[0].legs[0].duration.text;
//                self.time = Math.round(self.poly.tiempo / 60);
//                nwgeo.removeAllPolyLines();
//            };
//            nwgeo.addLineStreet(map, coords, func_one);

//falta sacar el tiempo y el pathDriverToOrigin
        da.tiempo_estimado = self.time;
        da.pathDriverToOrigin = self.pathDriverToOrigin;
        da.dataService = self.dataByBooking("EN_RUTA");
        da.dataAll = ra;
        console.log("up", up);

//        da.dataService = self.data_service;
//        da.dataService.config = self.configCliente;
//        da.dataService.estado_nuevo = "EN_RUTA";
//        da.dataService.latitude = nwgeo.latitude;
//        da.dataService.longitude = nwgeo.longitude;
//        if (self.debugConstruct) {
        console.log("saveAcceptService:::sendDataServer", da);
//        }
//        return;
        var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
        rpc.setAsync(true);
        var func = function (r) {
//            if (self.debugConstruct) {
            console.log("saveAcceptService:::responseServer", r);
//            }
            self.clearIntervalo();
            if (r === false) {
                self.activeNormal();
                self.initIntervalo();
                nwgeo.removeAllPolyLines();
                nw.dialog("El servicio no está disponible");
                return false;
            }
            if (r !== true) {
                self.activeNormal();
                self.initIntervalo();
                nwgeo.removeAllPolyLines();
                nw.dialog(r);
                return false;
            }


//                var text = "Tu conductor está en camino, llegará en " + self.time + " minutos";
//                console.log(ra.showminutesaprox);
            if (typeof ra.showminutesaprox === "undefined" || !nw.evalueData(ra.showminutesaprox)) {
                ra.showminutesaprox = nw.utils.tr("calculando") + "...";
            }
            var text = nw.utils.tr("Tu conductor") + " " + up.nombre + " " + nw.utils.tr("está en camino, llegará en") + " " + ra.showminutesaprox + " " + nw.utils.tr("minutos");
            if (ra.tipo_servicio === "reservado" && da.estado === "ACEPTADO_RESERVA") {
                text = nw.utils.tr("Servicio aceptado por el conductor") + " " + up.nombre + ", " + nw.utils.tr("revisa tu agenda");
            }
            var servi = da.token_conductor;
            var calleject = "main.serviceToken('" + servi + "', '" + nw.utils.tr("Servicio aceptado por el conductor") + " " + up.nombre + "')";
//            if (ra.creado_por_pc == "si") {
//                calleject = "nw.dialog('Servicio aceptado por el conductor " + up.nombre + "',function(){main.reloadApp()})";
//            }
            nw.sendNotificacion({
                title: nw.utils.tr("Viaje aceptado por") + " " + up.nombre + "",
                body: text,
                icon: "fcm_push_icon",
                sound: "default",
                data: calleject,
                callback: "FCM_PLUGIN_ACTIVITY",
                to: ra.token_usuario
            });

            main.registerServiceInFirebase(da.id);

            if (da.estado === "ACEPTADO_RESERVA") {
                nw.dialog("Aceptaste el servicio. Revisa tu agenda para iniciar la ruta de este servicio");
                self.activeNormal();
                self.initIntervalo();
                nwgeo.removeAllPolyLines();
                if (!document.querySelector(".cont-radar")) {
                    self.getIcon();
                }
                return true;
            } else {
                $(".liBarEncNotify").remove();
            }
            var dia = new Date();
            self.hora_inicio_viaje = dia.getHours() + ":" + dia.getMinutes();
            self.framePosition(da, servi);
            self.activeEnRuta();
//            if (self.configCliente.app_para == "CARGA") {
//                if (self.__intvHours == false) {
//                    self.widgetTwoHours();
//                }
//            }
        };
        rpc.exec("acceptSolit", da, func);
    },
    destruct: function () {
    },
    members: {
    }
});