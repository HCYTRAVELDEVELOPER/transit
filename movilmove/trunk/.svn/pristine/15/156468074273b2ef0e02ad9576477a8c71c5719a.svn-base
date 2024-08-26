nw.Class.define("f_activeNormal", {
    extend: nw.lists,
    construct: function (self) {
        if (self.debugConstruct) {
            console.log("START::::::f_activeNormal");
        }
        $(".containInfoDriver").remove();
        self.clearIntervalo();
        nwgeo.cleartWatchPostion();
        self.hiddenWaitingDriver();
        self.reziseNormalMap();
        nwgeo.removeAllPolyLines();
        document.querySelector(".centrar_mapa").style.display = "block";
        self.activeWatchPosition = false;
        self.markerDriver = false;
        self.serviceActive = false;
        self.servicioTomado = false;
        self.recibeGeoDriver = false;
        self.timeNoRecibeGeoDriver = 0;
        self.conductorLlegaASitio = false;
        self.polyLineDestino = false;
        self.actEnRuta = false;
        self.shotFirstUbicationDriver = false;
        self.puntajeDriver = false;
        self.createDataDriver = false;
        nwgeo.type = null;
        self.fram = document.querySelector(".iframechat_");
        if (self.fram) {
            self.fram.remove();
            self.loadInitial();
            self.ui.address.setVisibility(true);
            self.ui.address_destino.setValue("");
            console.log(self.cancela_conductor);
            if (self.cancela_conductor == true) {
                self.cancela_conductor = false;
                nw.dialog("El conductor ha cancelado el servicio");
            }
        }
        self.ui.driver_en_camino.removeClass("driver_en_camino_show");
        if (typeof self.navTable != "undefined") {
            self.navTable.clean();
        }
        self.removeCarsMap();

//        self.createCarsMap();

        if (self.configCliente.usa_subservicios == "SI") {
            var ele = document.querySelector('.conta_mod');
            if (ele) {
                ele.remove();
            }
        }
        if (self.debugConstruct) {
            console.log("END::::::f_activeNormal");
        }

        self.resetValuesHome();

        self.initIntervalo();
    },
    destruct: function () {
    },
    members: {
    }
});