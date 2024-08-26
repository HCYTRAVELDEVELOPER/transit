nw.Class.define("f_4_resolveStatus", {
    extend: nw.lists,
    construct: function (self, r) {
//        if (self.debugConstruct) {
        console.log("LAUNCH::::f_4_resolveStatus", r);
//        }
        if (self.loadedFirst === false) {
            if (r.estado === "SOLICITUD" || r.estado === "EN_RUTA" || r.estado === "EN_SITIO" || r.estado === "ABORDO") {
                self.initIntervalo();
                self.ciudad_destino = r.ciudad_destino;
            }
        }
        if (r.estado === "EN_RUTA" || r.estado === "EN_SITIO" || r.estado === "ABORDO") {
            self.dataServiceActive = r;
            self.serviceActive = true;
        } else {
            self.serviceActive = false;
        }

        console.log("%c<<<<f_4_resolveStatus::: STATE " + r.estado + "!!!!!!!!!!!!!>>>>", 'background: #ff3366; color: #fff');

//        self.dataServiceActive = r;
        if (
                r.estado === "SOLICITUD" && r.tipo_servicio != "reservado" ||
                r.estado === "SOLICITUD" && r.tipo_servicio != "reservado" && !nw.evalueData(r.conductor_usuario) ||
                r.estado === "SOLICITUD" && self.configCliente.driver_puede_ofertar_valor_servicio == "SI" && !nw.evalueData(r.conductor_usuario)
                ) {
//                console.log(r);
            self.dataServiceActive = r;
            if (self.circu == false) {
                self.clearCircul();
                self.circu = true;
                self.ui.pago_group.addClass("buttons_group_fix_pago_group_hidden");
                console.log("r.origen ", r.origen);
                self.ui.address.setValue(r.origen);
                self.ui.address_destino.setValue(r.destino);
                self.geo.latitude = r.latitudOri;
                self.geo.longitude = r.longitudOri;
                self.geoDestino.latitudDes = r.latitudDes;

                if (!nwgeo.native) {
                    var latLong = new google.maps.LatLng(self.geo.latitude, self.geo.longitude);
                    self.setPositionOne(latLong);
                }

                self.geoDestino.longitudDes = r.longitudDes;

//                alert("alexf:navv")
//                self.continuar(true);
            }
            var frma = document.querySelector(".iframechat");
            if (!frma) {
                self.framePositionConductor();
            }

            var fecha2 = new Date();
            var hora_actual = fecha2.getHours() + ":" + fecha2.getMinutes() + ":" + fecha2.getSeconds();
            var dd = calcularMinutos(r.hora, hora_actual);
            function calcularMinutos(hI, hF) {
                var horaInicial = devolverMinutos(hI);
                var horaFinal = devolverMinutos(hF);
                var dif = horaFinal - horaInicial;
                return dif;
            }

            function devolverMinutos(horaMinutos) {
                return (parseInt(horaMinutos.split(":")[0]) * 60) + parseInt(horaMinutos.split(":")[1]) + (parseInt(horaMinutos.split(":")[2]) / 60);
            }

            dd = dd.toFixed(1);

            console.log("dddddddddddddddddddddddddddd", dd);

            var espera = 1;
            if (nw.evalueData(self.configCliente.tiempo_notificacion_servicio)) {
                if (parseFloat(self.configCliente.tiempo_notificacion_servicio) > 0) {
                    espera = parseFloat(self.configCliente.tiempo_notificacion_servicio);
                }
            }
            if (self.debugConstruct) {
                console.log("RESPONSE_SERVER::::f_4_resolveStatus::self.configCliente.tiempo_notificacion_servicio, espera, dd = " + dd, self.configCliente.tiempo_notificacion_servicio, espera);
            }
            if (dd < espera) {
                if (!nw.utils.evalueData(self.valor_total) && nw.utils.evalueData(r.valor)) {
                    console.log("rrrrrrrrrrrrrrrrrr", r);
                    self.valor_total = r.valor;
                }

                self.showWaitingDriver(dd, espera);
            } else {
                self.noHayServicios();
            }
        } else
        if (r.estado === "EN_RUTA") {
//            if (self.debugConstruct) {
            console.log("RESOLVE_STATUS_CHANGE:::f_4_resolveStatus:::EN_RUTA", r);
//            }
            if (self.initservice === false) {
                self.framePositionConductor();
                self.initservice = true;
            }
            clearInterval(self.inte);
            var frma = document.querySelector(".iframechat");
            if (!frma) {
                self.framePositionConductor();
            }
            self.circu = false;
            self.activeEnRuta(r);
            nw.dialogRemove();
        } else
        if (r.estado === "EN_SITIO") {
//            if (self.debugConstruct) {
            console.log("RESOLVE_STATUS_CHANGE:::f_4_resolveStatus:::EN_SITIO", r);
//            }
            var frma = document.querySelector(".iframechat");
            if (!frma) {
                self.framePositionConductor();
            }
            self.activeEnSitio(r);
        } else
        if (r.estado === "ABORDO") {
//            if (self.debugConstruct) {
            console.log("RESOLVE_STATUS_CHANGE:::f_4_resolveStatus:::ABORDO", r);
//            }
            if (!self.markerDestino) {
                self.geoDestino.latitudDes = r.latitudDes;
                self.geoDestino.longitudDes = r.longitudDes;
            }
            var frma = document.querySelector(".iframechat");
            if (!frma) {
                self.framePositionConductor();
                self.initservice = true;
            }
//                self.initAbordo = true;
            self.activeAbordo(r);
        } else
//            if (r.estado === "LLEGADA_DESTINO" && !nw.evalueData(r.calificacion)) {
        if (r.estado === "LLEGADA_DESTINO" && !nw.evalueData(r.calificacion_conductor)) {
            var frma = false;
            var isframe = document.querySelector('.framechat');
            if (isframe) {
                isframe.remove();
            }
            var btn_chat = document.querySelector('.btn_chat');
            if (btn_chat) {
                btn_chat.remove();
            }
            if (self.actEnRuta == true) {
                if (typeof self.polylineRuta !== "undefined" && self.polylineRuta !== null) {
                    self.polylineRuta.setMap(null);
                    delete self.polylineRuta;
                }
                self.actEnRuta = false;
            }
            nwgeo.removeAllPolyLines();
            self.removeMarker4();
            self.loadInitial();
            self.activeNormal();
            self.initservice = false;
            self.clearIntervalo();
            clearInterval(self.interval);
            var body = document.querySelector('body');
            frma = document.querySelector(".iframechat");
            if (frma) {
                body.removeChild(frma);
            }
//            nw.loading();
//            if (self.loadedFirst !== true) {
            setTimeout(function () {
                nw.loadingRemove();
                main.resumenFinal(r, "cliente");
            }, 2000);
//            } else {
//                main.resumenFinal(r, "cliente");
//            }
        } else
        if (r.estado === "CANCELADO_POR_CONDUCTOR" && !nw.evalueData(r.calificacion_conductor)) {
            nw.dialog("El conductor ha cancelado el servicio");
            var frma = false;
            var isframe = document.querySelector('.framechat');
            if (isframe) {
                isframe.remove();
            }
            var btn_chat = document.querySelector('.btn_chat');
            if (btn_chat) {
                btn_chat.remove();
            }
            if (self.actEnRuta == true) {
                if (typeof self.polylineRuta !== "undefined" && self.polylineRuta !== null) {
                    self.polylineRuta.setMap(null);
                    delete self.polylineRuta;
                }
                self.actEnRuta = false;
            }
            nwgeo.removeAllPolyLines();
            self.removeMarker4();
            self.loadInitial();
            self.activeNormal();
            self.initservice = false;
            self.clearIntervalo();
            clearInterval(self.interval);
            var body = document.querySelector('body');
            frma = document.querySelector(".iframechat");
            if (frma) {
                body.removeChild(frma);
            }
//            nw.loading();
//            if (self.loadedFirst !== true) {
            setTimeout(function () {
                nw.loadingRemove();
                main.resumenFinal(r, "cliente");
            }, 2000);
//            } else {
//                main.resumenFinal(r, "cliente");
//            }
        } else {
            self.activeNormal();
        }
        self.loadedFirst = true;
    },
    destruct: function () {
    },
    members: {
    }
});