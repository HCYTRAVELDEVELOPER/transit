nw.Class.define("f_activeEnSitio", {
    extend: nw.lists,
    construct: function (self, r) {
//        if (self.debugConstruct) {
        console.log("LAUNCH:::f_activeEnSitio", r);
//        }
//        if (!self.conductorLlegaASitio) {
        if (self.actEnRuta == true) {
            if (typeof self.polylineRuta !== "undefined" && self.polylineRuta !== null) {
                self.polylineRuta.setMap(null);
                delete self.polylineRuta;
            }
            self.actEnRuta = false;
        }
        nwgeo.removeAllPolyLines();
        self.hiddenWaitingDriver();

        document.querySelector(".centrar_mapa").style.display = "block";
        self.ui.driver_en_camino.addClass("driver_en_camino_show");

        var ht = "<span class='infoDriverText'>" + nw.utils.tr("¡Tu conductor ha llegado!");
        if (self.configCliente.usa_codigos_verificacion_servicio === "SI") {
            ht += "<br> Tu código de verificación es: " + r.code_verifi_service;
        }
        if (nw.utils.evalueData(r.id_parada)) {
            ht += "<br> Parada#" + r.id_parada;
        }
        ht += "<br> Service#" + r.id;
        ht += "</span>";

//            var da = document.querySelector(".containInfoDriver");
//            if (!da) {
        var h = self.htmlDatosConductor(r, ht);
        self.ui.html_driver_en_camino.setValue(h);
//            } else {
//                document.querySelector(".titleInfoDriver").innerHTML = ht;
//                self.dataHtmlConductor = da.innerHTML;
//            }
        self.useChat(r);

        var he = self.ui.driver_en_camino.height();
        self.reziseMap(he);
//        }
        self.conductorLlegaASitio = true;

//        var lt1 = self.positionConductor.lat;
//        var lg1 = self.positionConductor.lng;
//        var lt2 = r.latitudOri;
//        var lg2 = r.longitudOri;
//        if (!nw.evalueData(lt1) || !nw.evalueData(lg1) || !nw.evalueData(lt2) || !nw.evalueData(lg2)) {
//            console.log("ERROR:::centerMapByGeo::: lat/lng de driver/origen desconocido, relanzando:::lt1, lg1, lt2, lg2:::" + lt1 + " " + lg1 + " " + lt2 + " " + lg2);
//            setTimeout(function () {
//                self.centerMapByGeo(lt1, lg1, lt2, lg2);
//            }, 500);
//        } else {
//            self.centerMapByGeo(lt1, lg1, lt2, lg2);
//        }
        if (self.debugConstruct) {
            console.log("END::CHANGE:::f_activeEnSitio:::CENTERMAP_ORIG/DRIVER");
        }
    },
    destruct: function () {
    },
    members: {
    }
});