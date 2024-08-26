nw.Class.define("f_activeChangeStatus", {
    extend: nw.lists,
    construct: function (self) {
//        if (self.debugConstruct) {
        console.log("1:::START_LAUNCH:::::::::::::: f_activeChangeStatus");
//        }
        var selft = this;
        $.each(selft.members, function (key, value) {
            self[key] = value;
        });

//         self.initIntervalo();
    },
    destruct: function () {
    },
    members: {
        activeAbordo: function activeAbordo() {
            var self = this;
            var r = self.data_service;
            if (self.configCliente.paradas_adicional == "SI") {
                self.paradasAdicionales();
            }
            if (self.configCliente.app_para != "CARGA") {
                if (nw.evalueData(self.configCliente.permitir_tomar_servicios_ocupado) && self.configCliente.permitir_tomar_servicios_ocupado != "SI") {
                    self.clearIntervalo();
                }
            }
//            if (self.configCliente.app_para == "CARGA") {
//                if (self.__intvHours == false) {
//                    self.widgetTwoHours();
//                }
//            }
            config.activesaveAllPosition = true;
            config.id_servi_ubic = r.id;
//            nw.activeLatsConnect();
            self.initIntervaloService();
            if (self.cancela_conductor == true) {
                self.ui.cancelar_pedido.setVisibility(false);
            }
            self.ui.grupo_nueva_solicitud.setVisibility(true);
            self.ui.rechazar_pedido_driver.setVisibility(false);
            self.ui.aceptar_pedido_driver.setVisibility(false);
            self.ui.tiempo_estimado.setVisibility(false);
            self.ui.confirmar_llegada.setVisibility(false);
            self.ui.confirmar_abordaje.setVisibility(false);
            self.ui.precio_viaje.setVisibility(false);
            self.ui.finalizar_viaje.setVisibility(true);
            self.ui.precio_viaje.setVisibility(false);
            self.ui.cobrar.setVisibility(false);
            var empresa = "";
            if (nw.evalueData(r.bodega_text)) {
                empresa = "<div class='infoServiceCompany'>" + nw.tr("Empresa") + ": " + r.bodega_text + "</div>";
            }

            var ht = empresa + "<span class='infoDriverText'>" + nw.tr("Servicio en curso, al destino:") + "</span><br /> <span class='infoDriverDirec'>" + r.destino + "</span>";
            if (nw.utils.evalueData(r.tipo_pago)) {
                ht += "<span class='infoDriverTextvisibles infoDrivertipo_pago'>" + nw.tr(r.tipo_pago) + "</span>";
            }
            ht += "<span class='infoDriverEnServicioText' style='color: #000;display: block;'>" + nw.tr("Inicio del viaje...") + " <span class='infoDriverEnServicio'>0</span></span><br /> ";
            var msg = self.htmlDataCliente(ht, true);
            self.ui.html_grupo_nueva_solicitud.setValue(msg);
            nwgeo.removeAllPolyLines();
            self.serviceActive = true;
            self.cleanMarkerTwo();

            self.minutosDeServicio = 0;
            var fechaInicio = "";
            if (nw.utils.evalueData(r.fecha_inicio)) {
                fechaInicio = r.fecha_inicio;
            } else {
                fechaInicio = nw.utilsDate.getActualDate();
            }
            if (nw.utils.evalueData(r.hora_inicio)) {
                fechaInicio += " " + r.hora_inicio;
            } else {
                fechaInicio += " " + nw.utilsDate.getActualHour();
            }
            validaTiempoEspera();
            self.intervalTiempoEnServicio = setInterval(function () {
                validaTiempoEspera();
            }, 5000);
            function validaTiempoEspera() {
                var fechaFin = nw.getActualFullDate();
                var waiting = nw.utilsDate.calcularTiempoDosFechas(fechaInicio, fechaFin);
                var conw = document.querySelector(".infoDriverEnServicio");
                if (conw) {
                    conw.innerHTML = waiting.dateInFormat;
                    self.minutosDeServicio = waiting.minutes;
                } else {
                    clearInterval(self.intervalTiempoEnServicio);
                }
            }



//            var image = {url: "img/Punto-de-llegada.png",
//                size: new google.maps.Size(30, 45),
//                origin: new google.maps.Point(0, 0),
//                anchor: new google.maps.Point(15, 45),
//                scaledSize: new google.maps.Size(30, 45),
//            };
//            var image = {
////                url: 'https://image.flaticon.com/icons/svg/727/727598.svg',
//                url: 'https://image.flaticon.com/icons/svg/149/149059.svg',
//                scaledSize: new google.maps.Size(35, 35),
//                origin: new google.maps.Point(0, 0),
//                anchor: new google.maps.Point(20, 30)
//            };
            var marker = new nwgeo.addMarker();
            marker.map = self.map;
            marker.latitude = r.latitudDes;
            marker.longitude = r.longitudDes;
//            marker.title = r.destino;
            marker.title = "";
            marker.label = "";
            marker.icon = config.domain_rpc + '/lib_mobile/driver/img/marker_b.png';
            marker.draggable = false;
            self.marker2 = marker.show();
//            self.map.setZoom(16);
            self.latitudDestino = r.latitudDes;
            self.longitudDestino = r.longitudDes;
            var query = document.querySelector(".mapIframe");
            if (query) {
                $(".mapIframe").remove();
            }
            self.framePosition();
//            self.trazaLinea(true, true);
            self.useWaze();
//            self.pintarLinea();
            self.useChat();

            self.saverecorr("ABORDO_DESTINO_EN_CAMINO");

//            var func_one = function (response) {
//                nwgeo.centerMap(self.map, self.marker1, self.marker2);
//            };
//            var coords = {lat: self.geo.latitude, lng: self.geo.longitude, lat2: r.latitudDes, lng2: r.longitudDes};
//            self.line = nwgeo.addLineStreet(self.map, coords, func_one);
        },
        activeEnSitio: function activeEnSitio() {
            var self = this;
            if (self.data_service.estado == "EN_RUTA") {
                self.data_service.estado = "EN_SITIO";
            }
//            if (self.configCliente.app_para == "CARGA") {
//                if (self.__intvHours == false) {
//                    self.widgetTwoHours();
//                }
//            }
            var r = self.data_service;
            self.initIntervaloService();
            self.ui.grupo_nueva_solicitud.setVisibility(true);
            self.ui.rechazar_pedido_driver.setVisibility(false);
            self.ui.aceptar_pedido_driver.setVisibility(false);
            self.ui.tiempo_estimado.setVisibility(false);
            self.ui.confirmar_llegada.setVisibility(false);
            self.ui.confirmar_abordaje.setVisibility(true);
            var empresa = "";
            if (nw.evalueData(r.bodega_text)) {
                empresa = "<div class='infoServiceCompany'>Empresa: " + r.bodega_text + "</div>";
            }

            console.log("rrrrrrrrrrrrrrrrrrrrrrr", r);
            var ht = empresa;
            ht += "<span class='infoDriverText'>" + nw.tr("¡En sitio!") + "</span><br /> ";
            ht += "<span class='infoDriverWaitingText' style='color: #000;'>" + nw.tr("Llegaste...") + " <span class='infoDriverWaiting'>0</span></span><br /> ";
            ht += "<span class='infoDriverDirec'>" + r.origen + "</span>";
            if (nw.utils.evalueData(r.tipo_pago)) {
                ht += "<span class='infoDriverTextvisibles infoDrivertipo_pago'>" + nw.tr(r.tipo_pago) + "</span>";
            }
            var msg = self.htmlDataCliente(ht);
            self.ui.html_grupo_nueva_solicitud.setValue(msg);
            nwgeo.removeAllPolyLines();

            self.minutosDeEspera = 0;

            console.log("rrrrrrrrrrrrrrrrrrrr", r);
            console.log("r.fecha_llegada", r.fecha_llegada);
            console.log("r.hora_llegada", r.hora_llegada);

            var fechallegada = "";
            if (nw.utils.evalueData(r.fecha_llegada)) {
                fechallegada = r.fecha_llegada;
            } else {
                fechallegada = nw.utilsDate.getActualDate();
            }
            if (nw.utils.evalueData(r.hora_llegada)) {
                fechallegada += " " + r.hora_llegada;
            } else {
                fechallegada += " " + nw.utilsDate.getActualHour();
            }
            validaTiempoEspera();
            self.intervalTiempoEspera = setInterval(function () {
                validaTiempoEspera();
            }, 5000);
            function validaTiempoEspera() {
                var fechaFin = nw.getActualFullDate();
                var waiting = nw.utilsDate.calcularTiempoDosFechas(fechallegada, fechaFin);
                var conw = document.querySelector(".infoDriverWaiting");
                if (conw) {
                    conw.innerHTML = waiting.dateInFormat;
                    self.minutosDeEspera = waiting.minutes;
                } else {
                    clearInterval(self.intervalTiempoEspera);
                }
            }

//            self.serviceActive = false;
            self.cleanMarkerTwo();
//            var image = {
//                url: 'https://image.flaticon.com/icons/svg/149/149059.svg',
//                scaledSize: new google.maps.Size(35, 35),
//                origin: new google.maps.Point(0, 0),
//                anchor: new google.maps.Point(20, 30)
//            };
            var marker = new nwgeo.addMarker();
            marker.map = self.map;
            marker.latitude = r.latitudOri;
            marker.longitude = r.longitudOri;
            marker.title = r.origen;
            marker.label = "";
            marker.icon = config.domain_rpc + config.carpet_files_extern + '/img/pin46.png';
            marker.draggable = false;
            self.marker2 = marker.show();
//            self.map.setZoom(17);
            var query = document.querySelector(".mapIframe");
            if (query) {
                $(".mapIframe").remove();
            }
            if (self.configCliente.app_para != "CARGA") {
                if (nw.evalueData(self.configCliente.permitir_tomar_servicios_ocupado) && self.configCliente.permitir_tomar_servicios_ocupado != "SI") {
                    self.clearIntervalo();
                }
            }
            self.framePosition();
            $(".btn_waze").remove();
            self.useChat();
            if (self.configCliente.informacion_primer_conductor == "SI") {
                self.useMoreInformation();
            }

            clearTimeout(self.recorridosave);
            self.saveRecorrido(false, "LLEGA_SITIO_ORIGEN_ESPERA_ABORDAJE");
        },
        activeEnRuta: function activeEnRuta() {
            var self = this;
            if (self.debugConstruct) {
                console.log("START_LAUNCH:::::::::::::: f_activeEnRuta");
            }

            if (self.data_service.estado == "SOLICITUD") {
                self.data_service.estado = "EN_RUTA";
            }
//            if (self.configCliente.app_para == "CARGA") {
//                if (self.__intvHours == false) {
//                    self.widgetTwoHours();
//                }
//            }
            var r = self.data_service;
            self.initIntervaloService();
            if (self.cancela_conductor == true) {
                self.ui.cancelar_pedido.setVisibility(true);
            }
            self.ui.grupo_nueva_solicitud.setVisibility(true);
            self.ui.rechazar_pedido_driver.setVisibility(false);
            self.ui.aceptar_pedido_driver.setVisibility(false);
            self.ui.tiempo_estimado.setVisibility(false);
            self.ui.confirmar_llegada.setVisibility(true);
            self.ui.confirmar_abordaje.setVisibility(false);
            var empresa = "";
            if (nw.evalueData(r.bodega_text)) {
                empresa = "<div class='infoServiceCompany'>Empresa: " + r.bodega_text + "</div>";
            }

            var ht = empresa;
//            ht += empresa;
            ht += "<span class='infoDriverText'>" + nw.tr("Dirígete al punto de encuentro") + "</span><br /> <span class='infoDriverDirec'>" + r.origen + "</span>";
            if (nw.utils.evalueData(r.tipo_pago)) {
                ht += "<span class='infoDriverTextvisibles infoDrivertipo_pago'>" + nw.tr(r.tipo_pago) + "</span>";
            }
            var msg = self.htmlDataCliente(ht);
            self.ui.html_grupo_nueva_solicitud.setValue(msg);
//            nwgeo.removeAllPolyLines();
            self.cleanMarkerTwo();
            if (self.configCliente.app_para != "CARGA") {
                if (nw.evalueData(self.configCliente.permitir_tomar_servicios_ocupado) && self.configCliente.permitir_tomar_servicios_ocupado != "SI") {
                    self.clearIntervalo();
                }
            }
//            var image = {
//                url: 'https://image.flaticon.com/icons/svg/149/149059.svg',
//                scaledSize: new google.maps.Size(35, 35),
//                origin: new google.maps.Point(0, 0),
//                anchor: new google.maps.Point(20, 30)
//            };
            var marker = new nwgeo.addMarker();
            marker.map = self.map;
            marker.latitude = r.latitudOri;
            marker.longitude = r.longitudOri;
            marker.title = r.origen;
            marker.label = "";
            marker.icon = config.domain_rpc + config.carpet_files_extern + '/img/pin46.png';
            marker.draggable = false;
            self.marker2 = marker.show();
//            self.map.setZoom(15);
            self.latitudDestino = r.latitudOri;
            self.longitudDestino = r.longitudOri;
            var query = document.querySelector(".mapIframe");
            if (query) {
                $(".mapIframe").remove();
            }
            self.framePosition();
            self.trazaLinea();
            self.useWaze();
            self.useChat();
            if (self.configCliente.informacion_primer_conductor == "SI") {
                self.useMoreInformation();
            }
            self.actEnRuta = true;

            self.saverecorr("ACEPTA_SERVICIO_EN_CAMINO");

//             nw.sendNotificacion({
//                    title: "Viaje aceptado",
//                    body: text,
//                    icon: "fcm_push_icon",
//                    sound: "default",
//                    data: "main.serviceToken('" + servi + "')",
//                    callback: "FCM_PLUGIN_ACTIVITY",
//                    to: ra.token_usuarioself.data_service
//                });
        },
        activeNormal: function activeNormal() {
            var self = this;
            self.clearIntervaloInService();
            self.ui.grupo_nueva_solicitud.setVisibility(false);
            self.ui.rechazar_pedido_driver.setVisibility(false);
            self.ui.aceptar_pedido_driver.setVisibility(false);
            self.ui.tiempo_estimado.setVisibility(false);
            self.ui.confirmar_llegada.setVisibility(false);
            self.ui.confirmar_abordaje.setVisibility(false);
            self.ui.finalizar_viaje.setVisibility(false);
            self.ui.precio_viaje.setVisibility(false);
            self.ui.cobrar.setVisibility(false);
            self.ui.html_grupo_nueva_solicitud.setValue("");
//            if (self.loadedFirst === false) {
//                self.initIntervalo();
//            } else {
//            }
            self.zoom;
            self.initIntervalo();
        },
        activeFinalizado: function activeFinalizado(p) {
            var self = this;
            console.log("finalizarServicio", p)
            var r = self.data_service;
            self.clearIntervaloInService();
            self.ui.grupo_nueva_solicitud.setVisibility(true);
            self.ui.rechazar_pedido_driver.setVisibility(false);
            self.ui.aceptar_pedido_driver.setVisibility(false);
            self.ui.tiempo_estimado.setVisibility(false);
            self.ui.confirmar_llegada.setVisibility(false);
            self.ui.confirmar_abordaje.setVisibility(false);
            self.ui.finalizar_viaje.setVisibility(false);
            self.ui.precio_viaje.setVisibility(false);
            self.ui.cobrar.setVisibility(false);
            self.ui.html_grupo_nueva_solicitud.setValue("");
            self.cleanMarkerTwo();
            self.trazaLineaCreada = false;
            self.LimpiarTodo();
            main.resumenFinal(r, "driver", p);
        },
    }
});