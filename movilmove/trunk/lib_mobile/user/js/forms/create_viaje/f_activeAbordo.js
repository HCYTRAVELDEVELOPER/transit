nw.Class.define("f_activeAbordo", {
    extend: nw.lists,
    construct: function (self, r) {
//        if (self.debugConstruct) {
        console.log("START:::ABORDO:::f_activeAbordo", r);
//        }

        self.fijaMarkerMapDestino({lat: r.latitudDes, lng: r.longitudDes});
        if (self.debugConstruct) {
            console.log("CREATE:::MARKER_DESTINY:::f_activeAbordo", r);
        }

        if (self.configCliente.mostrar_valor_despues_abordaje == "SI") {
            var val = localStorage.getItem('valor_aproximado_viaje');
            if (val) {
                var value = Intl.NumberFormat().format(val);
                nw.dialog("El valor del viaje aproximado es $" + value, function (e) {
                    localStorage.removeItem('valor_aproximado_viaje');
                });
                $('.popup_pil_text').css("cssText", "border-radius: 5px;");
                $('.popup_pil_text').css("cssText", "font-weight:400;font-family:Arial, Helvetica, sans-serif;font-size:20px;padding:30px 10px;border-radius: 5px;");
                $('.popup_pil_btns').css("cssText", "font-size:24px;font-weight: bold; padding:10px 10px 20px 10px;");
                $('.btnpil_acept').css("cssText", "width: 150px;");
            }
        }
//        if (self.initAbordo === false) {
        self.hiddenWaitingDriver();
        document.querySelector(".centrar_mapa").style.display = "block";
        self.ui.driver_en_camino.addClass("driver_en_camino_show");
//        var da = document.querySelector(".containInfoDriver");
//        if (!da) {

        var html = nw.tr("En camino a") + " " + r.destino + " <span class='timeAndKmToArrive'></span>";
        html += "<span class='formapago'>" + nw.tr(r.tipo_pago) + "</span>";
        if (nw.utils.evalueData(r.id_parada)) {
            html += "<br> Parada#" + r.id_parada;
        }
        html += "<br> Service#" + r.id;
        if (r.tipo_pago == "Wompi") {
            html += "<span class='formapagobtn'></span>";
        }


        var h = self.htmlDatosConductor(r, html, true);
        self.ui.html_driver_en_camino.setValue(h);
        self.useChat(r);

        if (r.tipo_pago == "Wompi") {
            var btn = document.createElement("button");
            btn.className = "formapagobtn_btn";
            btn.innerHTML = "Pagar con <strong>Wompi</strong>";
            btn.data = r;
            btn.onclick = function () {
                var data = this.data;
                console.log("dataaaaaaaaaaaaa", data);
                console.log("data.valor", data.valor);
                var price = parseFloat(Math.trunc(data.valor.toString()) + "00");
                console.log("price", price);
                var pay = {};
                pay.reference = data.id + "-" + Math.random();
                pay.price = price;
                pay.email = data.usuario;
                pay.fullName = data.cliente_nombre;
                pay.phoneNumber = data.celular;
                pay.phoneNumberPrefix = "+" + config.indicativo;
                var d = new nw.payWompi();
                d.start(pay);
            };
            document.querySelector(".formapagobtn").appendChild(btn);
        }

        var htm = "";
        if (self.configCliente.usa_codigos_verificacion_servicio === "SI") {
            htm += "<br> " + nw.tr("Tu código de seguridad es:") + " <strong>" + r.code_verifi_service_fin + "</strong>";
        }
        document.querySelector(".timeAndKmToArrive").innerHTML = htm;
//        }
//            }
//            if (self.initAbordo === false) {
        $(".containInfoDriver").addClass("containInfoDriver_enrutafinal");
        self.ui.cancelar_pedido_en_ruta.setVisibility(false);
        if (!nw.evalueData(self.activeWatchPosition)) {
            self.iniciarWatchPosition();
        }
        var he = self.ui.driver_en_camino.height();
        self.reziseMap(he);
        if (self.debugConstruct) {
            console.log("CHANGE:::HTML:::f_activeAbordo:::EN_CAMINO_TIME", r);
        }
//        }
        /*
         var func_one = function (response) {
         if (!response) {
         return false;
         }
         var da = document.querySelector(".containInfoDriver");
         if (da) {
         document.querySelector(".titleInfoDriver").innerHTML = "En camino a " + r.destino + " <span class='timeAndKmToArrive'></span>";
         self.dataHtmlConductor = da.innerHTML;
         self.useChat(r);
         }
         var htm = "";
         htm += response[0].legs[0].distance.text + " - Llegarás en " + response[0].legs[0].duration.text;
         if (self.configCliente.usa_codigos_verificacion_servicio === "SI") {
         htm += "<br> Tu código de verificación es: " + r.code_verifi_service_fin;
         }
         document.querySelector(".timeAndKmToArrive").innerHTML = htm;
         
         if (self.dragMap === false) {
         //                setTimeout(function () {
         var latDriver = self.positionConductor.lat;
         var lngDriver = self.positionConductor.lng;
         var zoom = false;
         var bounds = [
         {"lat": latDriver, "lng": lngDriver},
         {"lat": self.geoDestino.latitudDes, "lng": self.geoDestino.longitudDes}
         ];
         var multiplePoints = true;
         if (self.debugConstruct) {
         console.log("CHANGE:::ABORDO:::f_activeAbordo:::POLYLINE_HTML_TIME_CENTER_MAP_DESTINY/DRIVER");
         }
         nwgeo.centerMap(self.map, self.markerMyPosition, self.markerDestino, zoom, bounds, multiplePoints);
         //                }, 2500);
         self.polyLineDestino = true;
         }
         self.activeAbordoCenterFirsTime = true;
         };
         */

        /*
         var lat = self.positionConductor.lat; //driver latitud
         var lng = self.positionConductor.lng; //driver longitud
         var lat2 = self.geoDestino.latitudDes; //destino latitud
         var lng2 = self.geoDestino.longitudDes; //destino longitud
         var coords = {lat: lat, lng: lng, lat2: lat2, lng2: lng2};
         var onlyGetData = false;
         var colorLine = main.colorPolyLine;
         var animateOrCenter = "nothing";
         var multipleCoords = true;
         console.log("self.dataServiceActive", self.dataServiceActive);
         alert("addLineStreet two");
         self.lineRutaFinal = nwgeo.addLineStreet(self.map, coords, func_one, colorLine, onlyGetData, animateOrCenter, multipleCoords);
         */

        if (self.initAbordo === false) {
            if (self.markerDestino !== false) {
//                nwgeo.setPositionMarker(self.markerDestino, self.geoDestino.latitudDes, self.geoDestino.longitudDes);
                nwgeo.setPositionMarker(self.markerDestino, r.latitudDes, r.longitudDes);
            }
            if (self.fram === false) {
                self.framePositionConductor();
            }
            self.useChat(r);
        }
        self.initAbordo = true;
    },
    destruct: function () {
    },
    members: {
    }
});