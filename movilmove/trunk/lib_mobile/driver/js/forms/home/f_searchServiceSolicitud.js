nw.Class.define("f_searchServiceSolicitud", {
    extend: nw.lists,
    construct: function (self, callback) {

        console.log("main.configCliente", main.configCliente);
        if (main.configCliente.usa_firebase == "SI") {
            main.getServiceInFirebase();
        }
        if (self.configCliente.busca_servicios_conductor == 'NO') {
            main.destroyRadar();
        }
        if (self.configCliente.busca_servicios_conductor == 'NO' || main.configCliente.usa_firebase == "SI") {
            return;
        }


//        if (self.debugConstruct) {
        console.log("START_LAUNCH:::::::::::::: f_searchServiceSolicitud");
//        }

        var up = nw.userPolicies.getUserData();
//            console.log(up);
        var servicios = JSON.parse(up.servicios_activos);
        var data = {};
        data.id = up.id_usuario;
        data.usuario = up.usuario;
        data.tipo = "ahora";
        data.empresa = up.empresa;
        data.configCliente = self.configCliente;
        if (self.configCliente.usa_servicios === "SI") {
            data.servicios_driver = servicios;
            data.servicios_driver_ids = [];
            for (var i = 0; i < servicios.length; i++) {
                var serv = servicios[i];
                data.servicios_driver_ids.push(serv.id);
            }
        }
        if (typeof config.tomarServiciosReservadosAutomatic !== "undefined") {
            data.tomarServiciosReservadosAutomatic = config.tomarServiciosReservadosAutomatic;
        }
        if (typeof self.configCliente.tomarServiciosReservadosAutomatic !== 'undefined') {
            if (nw.evalueData(self.configCliente.tomarServiciosReservadosAutomatic)) {
                data.tomarServiciosReservadosAutomatic = self.configCliente.tomarServiciosReservadosAutomatic;
            }
        }
        if (typeof self.configCliente.repetir_servicio_continiuamente !== 'undefined' && self.configCliente.repetir_servicio_continiuamente == "SI") {
            data.repetir_servicio_continiuamente = true;
        }

        if (typeof self.configCliente.verServiciosReservados !== "undefined") {
            data.verServiciosReservados = self.configCliente.verServiciosReservados;
        }

        if (self.idServicesMostrados.length > 0) {
            console.log("self.idServicesMostrados", self.idServicesMostrados);
            data.id_rechazados = "";
            for (var i = 0; i < self.idServicesMostrados.length; i++) {
                var rt = self.idServicesMostrados[i];
                console.log("rtrrrrrrrrrrrrrrrrrttttttttttttttttttttttttttttttttttttttttttttttttttttt", rt);
                if (nw.evalueData(rt.id) && nw.evalueData(rt.tipo_servicio)) {
                    if (rt.tipo_servicio !== "reservado") {
                        data.id_rechazados += rt.id.toString();
                        if (i + 1 != self.idServicesMostrados.length) {
                            data.id_rechazados += ",";
                        }
                    }
                }
            }
        }
//        if (self.debugConstruct) {
        console.log("DATA_SEND:::f_searchServiceSolicitud::self.configCliente", self.configCliente);
        console.log("DATA_SEND:::f_searchServiceSolicitud::self.configCliente.minutos_de_vida_notificacion_conductores_viajes_ahora", self.configCliente.minutos_de_vida_notificacion_conductores_viajes_ahora);
        console.log("DATA_SEND:::f_searchServiceSolicitud", data);
//        }
        var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
        rpc.setAsync(true);
        rpc.setLoading(false);
        var func = function (r) {
            console.log("RESPONSE_SERVER:::f_searchServiceSolicitud", r);
            nw.remove(".liBarEncNotify");
            if (nw.evalueData(callback)) {
                callback(r);
            }
//            if (self.debug) {
//                if (!document.querySelector(".liBarEncNotify")) {
//                    if (!document.querySelector(".cont-radar")) {
//                        self.getIcon();
//                    }
//                }
//            }
            for (var i = 0; i < r.length; i++) {
                if (r[i].estado == "CONDUCTOR_ASIGNADO" || r[i].estado == "CONDUCTOR_REASIGNADO") {
                    r[i].estado = "SOLICITUD";
                }
                console.log("r[i]", r[i]);
                self.constructServiceSolicitud(r[i]);
            }
        };
        rpc.exec("consulta_new", data, func);
    },
    destruct: function () {
    },
    members: {
    }
});