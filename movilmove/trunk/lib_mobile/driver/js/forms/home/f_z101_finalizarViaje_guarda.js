nw.Class.define("f_z101_finalizarViaje_guarda", {
    extend: nw.lists,
    construct: function (self, data) {
//        if (self.debugConstruct) {
        console.log("START_LAUNCH:::::::::::::: f_z101_finalizarViaje_valida");
//        }
//        nw.activeLatsConnect();

        var dataSend = data;
        dataSend.templateEmail = main.templateMailEnd();

        var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
        rpc.setAsync(true);
        rpc.setLoading(false);
        nw.loading({text: "Por favor espere...", title: "Actualizando saldos, viaje y liberando conductor..."});
        var func = function (r) {
            nw.loadingRemove();
//            if (self.debugConstruct) {
            console.log("RESPONSE_SERVER:::finalizarServicio:::r", r);
//            }
            if (r !== true) {
                nw.dialog(r);
                return false;
            }
            if (typeof self.markerParada !== 'undefined') {
                nwgeo.removeMarker(self.markerParada);
            }
            var list = document.querySelector('.list-paradas');
            if (list) {
                list.remove();
            }

            config.activesaveAllPosition = false;
            config.id_servi_ubic = false;
            self.reziseNormalMap();
            nwgeo.removeAllPolyLines();
            nw.sendNotificacion({
                title: "Tu viaje ha finalizado",
                body: "Tu viaje ha finalizado",
                icon: "fcm_push_icon",
                sound: "default",
                data: "nw.dialog('Viaje finalizado')",
                callback: "FCM_PLUGIN_ACTIVITY",
                to: dataSend.serv.token_usuario
            });
            if (!document.querySelector(".cont-radar")) {
                self.getIcon();
            }
            self.clearIntvHours();

            self.ui.finalizar_viaje.setValue("1");
            nw.refreshSessionApp(function () {});

            self.activeFinalizado(dataSend.array1);
        };
        rpc.exec("llegadaServicioDestiono", dataSend, func);


        return;




//            data.tarifaViaje = self.dataTarifaViaje;
        data.nit = "";
        data.telefono = "";
        data.remitente = self.data_service.contacto_recogida;
        data.telefono_recogida = self.data_service.telefono_recogida;
        data.destinatario = self.data_service.contacto_entrega;
        data.telefono_entrega = self.data_service.telefono_entrega;
        data.placa = self.data_service.placa;
        data.conductor = self.data_service.conductor;
        data.identificacion_conductor = self.data_service.identificacion_conductor;
        data.tipo_vehiculo = self.vehiculo.tipo_vehiculo_text;
        data.punto_punto = "NO";
        data.dia = "NO";
        data.horas_adicionales = "NO";
        data.medio_dia = "NO";
        data.retorno = self.data_service.retorno == "" ? "NO" : self.data_service.retorno;
        data.numero_auxiliares = self.data_service.numero_auxiliares == null ? "" : self.data_service.numero_auxiliares;
        data.empaque = self.data_service.empaque == null ? "" : self.data_service.empaque;
        data.cantidad = self.data_service.cantidad == null ? "" : self.data_service.cantidad;
        data.descricion_carga = self.data_service.observaciones_recogida == null ? "" : self.data_service.observaciones_recogida;
        data.aplico_peaje = self.data_service.aplico_peaje == null ? "" : self.data_service.aplico_peaje;
        data.volumen = self.data_service.volumen == null ? "" : self.data_service.volumen;
        data.valor_declarado = self.data_service.valor_declarado == null ? "" : self.data_service.valor_declarado;
        data.remesa = self.data_service.remesa == null ? "" : self.data_service.remesa;

        if (typeof self.data_service.subservicio_text === "string" && self.data_service.subservicio_text != "") {
            var subserv = self.data_service.subservicio_text.toLowerCase();
            switch (subserv) {
                case "punto a punto":
                    data.punto_punto = "SI";
                    break;
                case "medio día":
                    data.medio_dia = "SI";
                    break;
                case "día completo":
                    data.dia = "SI";
                    break;
            }
        }
        if (typeof self.data_service.cliente_empresa_nit === 'string' && typeof self.data_service.bodega === 'string') {
            data.nit = self.data_service.cliente_empresa_nit;
        } else {
            data.nit = self.data_service.cliente_nit;
        }
        if (typeof self.data_service.cliente_empresa_telefono === 'string' && typeof self.data_service.bodega === 'string') {
            data.telefono = self.data_service.cliente_empresa_telefono;
        } else {
            data.telefono = self.data_service.cliente_telefono;
        }

        if (nw.evalueData(self.filesEnd)) {
            data.files = self.filesEnd;
        }


        var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
        rpc.setAsync(true);
        rpc.setLoading(false);
        nw.loading({text: "Por favor espere...", title: "Actualizando saldos, viaje y liberando conductor..."});

        if (self.debugConstruct) {
            console.log("DATA:::finalizarServicio:::", data);
        }
        console.log("data.precio_viaje", data.precio_viaje);
//        si el valor es menor al inicial
        if (self.configCliente.precioMinimoIgualInicio === "SI") {
            console.log("precioMinimoIgualInicio", self.configCliente.precioMinimoIgualInicio);
            if (parseFloat(data.precio_viaje) < parseFloat(data.valor_servicio_inicial)) {
                data.precio_viaje = data.valor_servicio_inicial;
            }
        }
        data.templateEmail = main.templateMailEnd();
        var func = function (r) {

            nw.loadingRemove();
            if (self.debugConstruct) {
                console.log("RESPONSE_SERVER:::finalizarServicio:::r", r);
            }
            if (r !== true) {
                nw.dialog(r);
                return false;
            }
            if (self.configCliente.paradas_adicional == "SI") {
                if (typeof self.markerParada !== 'undefined') {
                    nwgeo.removeMarker(self.markerParada);
                }
                var list = document.querySelector('.list-paradas');
                if (list) {
                    list.remove();
                }
            }
            config.activesaveAllPosition = false;
            config.id_servi_ubic = false;
            self.reziseNormalMap();
            nwgeo.removeAllPolyLines();
            nw.sendNotificacion({
                title: "Tu viaje ha finalizado",
                body: "Tu viaje ha finalizado",
                icon: "fcm_push_icon",
                sound: "default",
                data: "main.crearViaje('" + data.id + "')",
                callback: "FCM_PLUGIN_ACTIVITY",
                to: data.token_usuario
            });
            if (!document.querySelector(".cont-radar")) {
                self.getIcon();
            }
            self.clearIntvHours();
            self.activeFinalizado(data);
            self.ui.finalizar_viaje.setValue("1");
            nw.refreshSessionApp(function () {});
        };
        rpc.exec("llegadaServicioDestiono", data, func);
    },
    destruct: function () {
    },
    members: {
    }
});