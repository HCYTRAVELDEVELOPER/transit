nw.Class.define("f_resolveStatus", {
    extend: nw.lists,
    construct: function (self) {
//        if (self.debugConstruct) {
            console.log("3:::START_LAUNCH:::::::::::::: f_resolveStatus");
//        }

        var up = nw.userPolicies.getUserData();
        var r = self.data_service;
//        if (self.debug) {
            console.log("resolveStatus", r);
            console.log("resolveStatus estado", r.estado);
            console.log("resolveStatus conductor_id", r.conductor_id);
            console.log("UP id_usuario", up.id_usuario);
//        }
        self.resolveReziseMap();
        if (self.loadedFirst === false) {
            if (r === false) {
                self.initIntervalo();
            }
        }
        if (typeof r.id === 'undefined') {
            return;
        }
        var isMostrado = self.searchServiceMostrado(r.id);
        if (!isMostrado && up.id_usuario !== r.conductor_id && r.estado === "SOLICITUD") {
            self.constructServiceSolicitud();
        } else
        if (r.estado === "EN_RUTA") {
            self.activeEnRuta(r);
//            var d = document.querySelector(".cont-radar");
//            if (d) {
//                d.remove();
//            }
        } else
        if (r.estado === "EN_SITIO") {
            self.activeEnSitio(r);
//            var d = document.querySelector(".cont-radar");
//            if (d) {
//                d.remove();
//            }
        } else
        if (r.estado === "ABORDO") {
            self.activeAbordo(r);
//            var d = document.querySelector(".cont-radar");
//            if (d) {
//                d.remove();
//            }
        } else
        if (r.estado === "LLEGADA_DESTINO" && !nw.evalueData(r.calificacion)) {
            self.clearIntervalo();
            self.LimpiarTodo();
            main.resumenFinal(r, "cliente");
        } else {
            self.activeNormal();
            if (self.status !== "activo") {
                self.ponerOnOffline("offline");
            } else {
                self.ponerOnOffline("online");
            }
        }
        self.loadedFirst = true;
    },
    destruct: function () {
    },
    members: {
    }
});