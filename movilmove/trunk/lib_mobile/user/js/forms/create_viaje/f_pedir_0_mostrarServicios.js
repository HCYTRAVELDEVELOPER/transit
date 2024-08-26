nw.Class.define("f_pedir_0_mostrarServicios", {
    extend: nw.lists,
    construct: function (self, no_line, r, recargos, no_data) {
//        if (self.debugConstruct) {
        console.log("f_pedir_0_mostrarServicios:::START::::no_line : " + no_line + ", r, recargos, no_data:" + no_data, r, recargos);
//        }
        window.location.hash = 'showResultsServices';
        if (typeof no_data === "undefined") {
            no_data = false;
        }
        var up = nw.userPolicies.getUserData();
        if (no_data) {
            r = self.datosServicio.r;
            recargos = self.datosServicio.recargos;
        } else {
            self.datosServicio = {'r': r, 'recargos': recargos};
        }

        var cant_para = 0;
        if (typeof self.navTable != "undefined") {
            var paradas = self.navTable.getAllData();
            cant_para = paradas.length;

        }
        var recargos_total = recargos.total;
        if (cant_para > 0 && parseFloat(recargos.paradas) > 0) {
            var valor_para = parseInt(cant_para) * parseFloat(recargos.paradas);
            recargos_total = parseFloat(recargos.total) + parseInt(valor_para);
        }

        if (nw.utils.evalueData(self.numeroAuxiliares) && nw.utils.evalueData(self.configCliente.valor_auxiliar_carga)) {
            recargos_total = parseFloat(recargos_total) + parseInt(self.numeroAuxiliares) * parseInt(self.configCliente.valor_auxiliar_carga);
        }

        var leng = r.length;
        if (no_line === true) {
            nwgeo.removeAllPolyLines();
        } else {
            self.ui.contenedor_address.removeClass("contenedor_address_show");
        }

        $(".estimado").remove();
        var val = "";
        val += "<div class='estimado'>";
        val += "</div>";
        self.ui.pago_group.prepend(val);

        var count = 0;
        for (var i = 0; i < leng; i++) {
            var servi = r[i];
            console.log("f_pedir_0_mostrarServicios:::servi", servi);

            var recargoPaxAdicional = 0;

            if (nw.evalueData(self.configCliente.tarifas_fijas_usa_valor_por_paradas)) {
                var totalpax = self.ui.paradas_adicionales_iniciales_creacion.getValue();
                console.log("totalpax", totalpax);
                totalpax = totalpax.val;
                var iniciaPax = "1";
                if (nw.utils.evalueData(servi.pasajero_adicional_rango_inicia_cobro)) {
                    iniciaPax = servi.pasajero_adicional_rango_inicia_cobro;
                }
                console.log("iniciaPax", iniciaPax);
                console.log("totalpax", totalpax);
                console.log("servi.valor_pasajero_adicional", servi.valor_pasajero_adicional);
                console.log("self.configCliente.tarifas_fijas_usa_valor_por_paradas", self.configCliente.tarifas_fijas_usa_valor_por_paradas);
                if (nw.utils.evalueData(totalpax)) {
                    if (self.configCliente.tarifas_fijas_usa_valor_por_paradas == 'SI' && nw.utils.evalueData(servi.valor_pasajero_adicional) && totalpax > iniciaPax) {
                        recargoPaxAdicional = parseFloat(servi.valor_pasajero_adicional) * (parseFloat(totalpax) - parseFloat(iniciaPax));
                    }
                }
            }
            console.log("recargoPaxAdicional", recargoPaxAdicional);

            var others = {};
            var totalunimetros = 0;
            if (typeof servi.metros !== 'undefined' && servi.metros != "" && parseFloat(servi.metros) > 0) {
                totalunimetros = parseFloat(self.poly.total_metros) / parseFloat(servi.metros);
            }

            console.log("f_pedir_0_mostrarServicios:::servi.inicia_metros_add", servi.inicia_metros_add);
            console.log("f_pedir_0_mostrarServicios:::servi.valor_metros_add", servi.valor_metros_add);
            console.log("f_pedir_0_mostrarServicios:::self.poly.total_metros", self.poly.total_metros);

            var valorsumadistanciaAdicional = 0;
            if (nw.utils.evalueData(servi.inicia_metros_add) && nw.utils.evalueData(servi.valor_metros_add)) {
                if (self.poly.total_metros >= parseFloat(servi.inicia_metros_add)) {
                    var disAdd = self.poly.total_metros - parseFloat(servi.inicia_metros_add);
                    console.log("disAdd", disAdd);
                    disAdd = parseFloat(disAdd) / parseFloat(servi.metros);
                    console.log("disAdd", disAdd);
                    valorsumadistanciaAdicional = parseFloat(disAdd) * parseFloat(servi.valor_metros_add);
                }
            }
            console.log("f_pedir_0_mostrarServicios:::valorsumadistanciaAdicional", valorsumadistanciaAdicional);

            var valordistancia = parseFloat(totalunimetros) * parseFloat(servi.valor_unidad_metros);
            if (isNaN(valordistancia)) {
                valordistancia = 0;
            }
            var totaluniminutos = 0;
            if (typeof servi.tiempo !== 'undefined' && servi.tiempo != "" && parseFloat(servi.tiempo) > 0) {
                var totaluniminutos = parseFloat(self.poly.tiempo) / parseFloat(servi.tiempo);
            }
            var mins_final = 0;
            if (nw.evalueData(servi.minutosMinimosParaPedirService)) {
                if (parseInt(totaluniminutos) < parseInt(servi.minutosMinimosParaPedirService)) {
                    mins_final = servi.minutosMinimosParaPedirService;
                }
            }
            if (mins_final !== 0) {
                totaluniminutos = mins_final;
            } else {
                if (nw.evalueData(self.configCliente.minutosMinimosParaPedirService)) {
                    if (parseInt(totaluniminutos) < parseInt(self.configCliente.minutosMinimosParaPedirService)) {
                        totaluniminutos = self.configCliente.minutosMinimosParaPedirService;
                    }
                }
            }
            var valorminutos = parseFloat(totaluniminutos) * parseFloat(servi.valor_unidad_tiempo);
            if (isNaN(valorminutos)) {
                valorminutos = 0;
            }
            var valor_estimado = parseFloat(valordistancia) + parseFloat(valorminutos) + parseFloat(servi.valor_banderazo) + parseFloat(recargos_total);
            var minima = parseFloat(servi.minima);
            others.recargos = recargos_total;
            others.valorbase = servi.valor_banderazo;
            others.totaluniminutos = parseInt(totaluniminutos);
            others.valorminutos = valorminutos;
            others.totalunimetros = parseInt(self.poly.total_metros);
            others.valordistancia = parseFloat(valordistancia);
            others.unidad_metros = servi.metros;
            others.valor_unidad_metros = servi.valor_unidad_metros;
            others.unidad_tiempo = servi.tiempo;
            others.valor_unidad_tiempo = servi.valor_unidad_tiempo;
            others.valor_metros_add = servi.valor_metros_add;
            others.inicia_metros_add = servi.inicia_metros_add;
            others.concepto_recargo = "";
            others.metros_cobro_recargo = 0;
            others.valor_recargo = 0;
            if (nw.evalueData(servi.valor_recargo)) {
                others.metros_cobro_recargo = servi.metros_cobro_recargo;
                others.valor_recargo = servi.valor_recargo;
                others.concepto_recargo = servi.concepto_recargo;
            }
            valor_estimado = parseFloat(valor_estimado) + parseFloat(others.valor_recargo);
            others.valor_peajes = 0;
            others.metros_cobro_peaje = 0;
            if (nw.evalueData(servi.valor_peajes)) {
                others.valor_peajes = servi.valor_peajes;
                others.metros_cobro_peaje = servi.metros_cobro_peaje;
            }
            valor_estimado = parseFloat(valor_estimado) + parseFloat(others.valor_peajes);
            if (valor_estimado < minima) {
                valor_estimado = minima;
            }
            if (self.cobro === "LIBRE") {
                valor_estimado = 0;
            }
            if (servi.solo_para_mujeres === "SI" && up.genero === "hombre") {
                continue;
            }
            var valor_tarifa_fija = false;
            if (nw.evalueData(servi.ciudad_o_lugar_origen) && nw.evalueData(servi.ciudad_o_lugar_destino)) {
                if (servi.valor_tarija_fija !== "trayecto") {
                    valor_tarifa_fija = servi.valor_tarija_fija;
                }
            }

            console.log("valorsumadistanciaAdicional", valorsumadistanciaAdicional);
            console.log("valor_estimado 1", valor_estimado);
            console.log("valor_tarifa_fija 1", valor_tarifa_fija);
            if (nw.utils.evalueData(valorsumadistanciaAdicional) && nw.utils.evalueData(valor_estimado)) {
                valor_estimado = parseFloat(valor_estimado) + parseFloat(valorsumadistanciaAdicional);
            }
            if (nw.utils.evalueData(valorsumadistanciaAdicional) && nw.utils.evalueData(valor_tarifa_fija)) {
                valor_tarifa_fija = parseFloat(valor_tarifa_fija) + parseFloat(valorsumadistanciaAdicional);
            }

            if (nw.utils.evalueData(recargoPaxAdicional)) {
                valor_estimado = parseFloat(valor_estimado) + parseFloat(recargoPaxAdicional);
                if (nw.utils.evalueData(valor_tarifa_fija)) {
                    valor_tarifa_fija = parseFloat(valor_tarifa_fija) + parseFloat(recargoPaxAdicional);
                }
            }
            console.log("valor_estimado 2", valor_estimado);
            console.log("valor_tarifa_fija 2", valor_tarifa_fija);

            count++;
//            if (self.configCliente.cobertura_por_ciudades === "NO") {
//                count++;
//            }
            var dt = {};
            dt.valor_estimado = valor_estimado;
            dt.iva = servi.iva;
            dt.ptm = self.poly.total_metros_text;
            dt.pt = self.poly.tiempo_text;
            dt.servi = servi;
            dt.others = others;
            dt.id = servi.id;

            self.__count = count;
            self.__vl_services[servi.id] = dt;
            if (self.debugConstruct) {
                console.log("SHOWPRICE:::f_pedir_0_mostrarServicios:::DATA_SEND", dt);
            }
            self.showPrice(valor_estimado, servi.iva, self.poly.total_metros_text, self.poly.tiempo_text, servi, valor_tarifa_fija, others, count);
        }

        if (count === 0) {
            nw.loadingRemove();
            nw.dialog("Lo sentimos, no hay cobertura para tu zona (Code101)");
            self.loadInitial();
            self.activeNormal();
            self.reziseNormalMap();
            if (self.debugConstruct) {
                console.log("NO_COBERTURA:::f_pedir_0_mostrarServicios:::");
            }
            return false;
        }
        nw.loadingRemove();
        $(".backInShowServices").addClass("backInShowServices_show");
        if (no_line !== true && no_data == false) {
            var zoom = false;
            var bounds = [
                {"lat": self.geo.latitude, "lng": self.geo.longitude},
                {"lat": self.geoDestino.latitudDes, "lng": self.geoDestino.longitudDes}
            ];
            var multiplePoints = true;
            nwgeo.centerMap(self.map, self.markerMyPosition, self.markerDestino, zoom, bounds, multiplePoints);
            if (self.debugConstruct) {
                console.log("CENTER_MAP:::f_pedir_0_mostrarServicios:::");
            }
        }
//        if (typeof self.__hourAttention !== 'undefined') {
//            $(".tipo_servicio").prop('disabled', true);
//            self.ui.tipo_servicio.setValue("reservado");
//        }
    },
    destruct: function () {
    },
    members: {
    }
});