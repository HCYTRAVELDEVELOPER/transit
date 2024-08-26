nw.Class.define("f_showPrice", {
    extend: nw.lists,
    construct: function (self, valor_estimado, iva, distancia, tiempo, servi, valor_tarifa_fija, others, count) {

        var selthis = this;
        selthis.self = self;
        selthis.servi = servi;

//        if (self.debugConstruct) {
        console.log("f_showPrice:::servi, valor_estimado", servi, valor_estimado);
//        }


        var up = nw.userPolicies.getUserData();
        console.log("datos de sesion", up);
        var ivaporccent = iva;
        iva = valor_estimado * iva / 100;
        var valor_total = valor_estimado + iva;
        var saldo = up.saldo;
        var pri = "$";
        if (!nw.evalueData(valor_estimado)) {
            iva = "";
            pri = "";
            valor_estimado = "Por demanda";
            valor_total = "Por demanda";
        }
        if (self.cobro !== "LIBRE") {
            var val = "";
            var tol = valor_total;

            var saldo_text = "";
            var descuento = self.getMaxDiscount(valor_total, servi.descuento_maximo);
            self.descuento = 0;
            if (descuento > 0) {
                //self.descuento = descuento;
//                    saldo_text += "<span class='spanSaldo'>Desc saldo:<br> $" + nw.addNumber(descuento) + "</span>";
            }
            others.descuento = descuento;

//                if (others.valor_recargo > 0) {
//                    saldo_text += "<span class='spanSaldo'>" + others.concepto_recargo + ": $" + nw.addNumber(others.valor_recargo) + "</span>";
//                }
//                if (others.valor_peajes > 0) {
//                    saldo_text += "<span class='spanSaldo'>Peajes: $" + nw.addNumber(others.valor_peajes) + "</span>";
//                }
            saldo_text += "<span class='spanSaldo spanInfoService'><i class='material-icons'>info</i></span>";

            var classAdd = "";
            if (count === 1) {
//                    classAdd = "acti";
            }
            var img = servi.icono;
            var adicional = "";
            if (nw.evalueData(servi.valor_mascota)) {
                if (self.configCliente.app_para != "CARGA") {
                    adicional = " + " + servi.valor_mascota + " x mascota.";
                }
            }
            if (nw.evalueData(valor_tarifa_fija)) {
                tol = valor_tarifa_fija;
            }
            if (self.configCliente.moneda_por_defecto == "USD" || self.configCliente.moneda_por_defecto == "EUR") {
                tol = parseFloat(tol);
            } else {
                tol = parseInt(tol);
            }
            var valor_sin_desc = "";
            main.cuponInUse(function () {
                continuar();
            }, false, false);


            function continuar() {
                var valorDescuentoCupon = 0;
                if (typeof up.cupon === "string" && up.cupon != "") {
                    var cupon = JSON.parse(up.cupon);
                    console.log("este es el dato de cupo", cupon);
                    var aplicar_cupon = true;
                    if (nw.evalueData(cupon.servicio) && cupon.servicio != null && cupon.servicio != "") {
                        if (cupon.servicio != servi.id) {
                            aplicar_cupon = false;
                        }
                    }
                    var valorSinDescuento = tol;
                    var valorDescuentoCupon = 0;
                    if (aplicar_cupon == true) {
                        var porc = cupon.tipo_descuento == "porcentaje" ? cupon.valor : '';
                        if (porc == '') {
                            valor_sin_desc = "<div class='valuedesc_end'><span class='spanDesc' >$" + nw.addNumber(tol.toFixed(2)) + "</span></div>";
                        } else {
                            valor_sin_desc = "<div class='valuedesc_end valuedesc_end_padd'><span class='spanDesc'>$" + nw.addNumber(tol.toFixed(2)) + "</span> " + porc + "%</div>";
                        }
                        descuento = servi.descuento_maximo;
                        saldo_text = "";
                        if (cupon.tipo_descuento == "porcentaje") {
                            var descuento_cupon = (tol * parseInt(cupon.valor) / 100).toFixed();
                            tol = tol - descuento_cupon;
                        } else if (cupon.tipo_descuento == "valor") {
                            var val_cup = parseInt(cupon.valor);
                            if (parseInt(descuento) > 0) {
                                if (parseInt(descuento) < val_cup) {
                                    val_cup = parseInt(descuento);
                                }
                            }
                            if (val_cup >= tol) {
                                tol = 0;
                            } else {
                                tol = tol - val_cup;
                            }
                        }

                        if (servi.descuento_maximo > 0 && cupon.tipo_descuento == "valor") {
                            saldo_text += "<span class='spanSaldo'>Desc max cupon:<br> $" + nw.addNumber(servi.descuento_maximo) + "</span>";
                        }
                        saldo_text += "<span class='spanSaldo spanInfoService'><i class='material-icons'>info</i></span>";
                    }
                    valorDescuentoCupon = parseFloat(valorSinDescuento) - parseFloat(tol);
                }
                servi.valorDescuentoCupon = valorDescuentoCupon;
                
                console.log("valorDescuentoCupon", valorDescuentoCupon);

                console.log("valor_total", valor_total);
                console.log("tol", tol);
                if (isNaN(tol)) {
                    tol = 0;
                }
                valor_total = tol;
                console.log("tol", tol);
                console.log("valor_total", valor_total);

                var textCities = "";
                if (servi.ciudad_o_lugar_origen !== servi.ciudad_o_lugar_destino) {
                    textCities = "<span class='citiesdif'>" + servi.ciudad_o_lugar_origen + " - " + servi.ciudad_o_lugar_destino + "</span>";
                }

                var textServices = servi.tipo_servicio + textCities;
                if (nw.utils.evalueData(self.numeroAuxiliares)) {
                    textServices += "<span class='spannumeroauxiliarespricesshow'>" + self.numeroAuxiliares + " aux de carga</span>";
                }

                val += "<div class='cars_options'>";
                val += "<img class='icon_service' src='" + config.domain_rpc + img + "' />";
                val += "<div>";
                val += "<div class='textContainServices'>";
                val += " <span class='nameService'>" + textServices + "</span>";

                console.log("valor_sin_desc", valor_sin_desc);
                console.log("adicional", adicional);
                console.log("saldo_text", saldo_text);

                var valFixed = tol;
                console.log("toltoltoltoltoltoltoltoltoltoltol", tol);
                if (nw.utils.evalueData(tol)) {
                    valFixed = nw.addNumber(tol.toFixed(2));
                }
                console.log("valFixed", valFixed);

                var valueEnd = valFixed + valor_sin_desc + adicional + saldo_text;
                console.log("valueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEndvalueEnd", valueEnd);
                console.log("toltoltoltoltoltoltoltoltoltoltol", tol);
                val += "<span class='spanValueEnd'>" + pri + valueEnd + "</span>";
                val += "<div>";

                var estimado = document.querySelector('.estimado');
                var div = document.createElement('div');
                div.className = 'estimadoInt ' + classAdd;
                div.innerHTML = val;
                div.data = {
                    data: servi,
                    others: others,
                    valorDescuentoCupon: valorDescuentoCupon,
                    descuento: descuento,
                    valor: valor_total,
                    serv: servi.id,
                    id_tarifa: servi.id_service_tarifa_fija
                };
                self.__mas = false;
                div.onclick = function () {
//                var btn = this;
                    selthis.clickInTarifa(this);
                };
                estimado.appendChild(div);

                if (count === 1) {
                    div.click();
                }

                others.servi = servi;
                self.__mas = true;
                div.querySelector(".spanInfoService").data = others;
                div.querySelector(".spanInfoService").onclick = function () {
                    var others = this.data;
                    console.log("others", others);
                    var ops = {};
                    ops.cleanHtml = false;
                    ops.useDialogNative = false;

                    var accept = function () {
                        selthis.self.servicioTarifas(false, 0);
                        return true;
                    };
//                var cancel = function () {
//
//                };
                    var cancel = false;

                    var ht = "<div class='containMoreInfoService'>";
                    ht += "<span class='valorfixedpopup'>" + nw.addNumber(tol.toFixed(2)) + " </span>";
                    ht += "<span class='span_moreinf span_moreinf_valorbase'>" + nw.utils.tr("Valor base") + ": $" + nw.addNumber(others.valorbase) + "</span>";

                    ht += "<span  class='span_moreinf span_moreinf_totalmtrs'> + X km (" + (others.totalunimetros / 1000) + "km): $" + nw.addNumber(others.valordistancia.toFixed(2)) + "</span>";
                    ht += "<span  class='span_moreinf span_moreinf_totalmins'>+ X min (" + others.totaluniminutos + "min): $" + nw.addNumber(others.valorminutos.toFixed(2)) + "</span>";
                    if (others.valor_peajes > 0) {
                        ht += "<span  class='span_moreinf span_moreinf_peajes'>" + nw.utils.tr("Peajes") + ": " + nw.addNumber(others.valor_peajes) + "</span>";
                    }
                    if (others.valor_recargo > 0 && nw.evalueData(others.concepto_recargo)) {
                        ht += "<span  class='span_moreinf span_moreinf_conceprec'>" + others.concepto_recargo + ": " + nw.addNumber(others.valor_recargo) + "</span>";
                    }
                    if (others.recargos > 0) {
                        ht += "<span  class='span_moreinf span_moreinf_otros'>" + nw.utils.tr("Otros recargos") + ": " + nw.addNumber(others.recargos) + "</span>";
                    }
                    if (others.descuento > 0) {
                        ht += "<span  class='span_moreinf span_moreinf_desc'>" + nw.utils.tr("Descuento") + ": " + nw.addNumber(others.descuento) + "</span>";
                    }
                    if (parseFloat(others.valordistancia) + parseFloat(others.valorminutos) + parseFloat(others.servi.valor_banderazo) < parseFloat(others.servi.minima)) {
                        ht += "<span  class='span_moreinf span_moreinf_valmin'>" + nw.utils.tr("Valor mínimo") + ": " + nw.addNumber(parseFloat(others.servi.minima).toFixed(2)) + "</span>";
                    }
                    if (iva > 0) {
                        ht += "<span  class='span_moreinf span_moreinf_imp'>+ " + nw.utils.tr("Impuestos") + " (" + ivaporccent + "%): $" + nw.addNumber(iva.toFixed(2)) + "</span>";
                    }
                    if (nw.utils.evalueData(self.numeroAuxiliares) && nw.utils.evalueData(self.configCliente.valor_auxiliar_carga)) {
                        ht += "<span  class='span_moreinf span_moreinf_auxs'>" + nw.utils.tr("Auxs de carga") + " (" + self.numeroAuxiliares + "): $" + parseInt(self.numeroAuxiliares) * parseInt(self.configCliente.valor_auxiliar_carga) + "</span>";
                    }
                    if (nw.utils.evalueData(others.servi.id_foraneo)) {
                        ht += "<span  class='span_moreinf span_moreinf_id'>ID(" + others.servi.id_foraneo + ")</span>";
                    }

                    var name_place_destino = self.ciudad_destino;
                    if (nw.evalueData(self.name_place_destino)) {
                        name_place_destino += " " + self.name_place_destino;
                    }

                    var type = "urbano";
                    if (self.ciudad_origen === self.ciudad_destino) {
                        type = "urbano";
                    } else
                    if (self.ciudad_origen !== self.ciudad_destino) {
                        if (typeof self.ciudad_origen.split(self.ciudad_destino)[1] != "undefined" || typeof self.ciudad_destino.split(self.ciudad_origen)[1] != "undefined") {
                            type = "urbano";
                        } else {
                            type = "intermunicipal";
                        }
                    }

                    console.log("self.typeInTravelget", self.typeInTravelget);
                    type = self.typeInTravelget;
                    var html = "<br />";
                    html += "<div class='origienesYDestinos'>";
                    html += nw.utils.tr("Origen y destino") + ".<br />";
                    html += "<br /><strong>" + nw.utils.tr("Tipo") + "</strong>: " + type + "</strong>";
                    html += "<br /><strong>" + nw.utils.tr("Dirección origen") + "</strong>: " + self.ui.address.getValue() + "</strong>";
                    html += "<br /><strong>" + nw.utils.tr("Ciudad origen") + "</strong>: " + self.ciudad_origen + "</strong>";
                    html += "<br /><strong>" + nw.utils.tr("Lugar origen") + "</strong>: " + self.ciudad_origen + " " + self.name_place_origen + "</strong>";
                    html += "<br /><br />";
                    html += "<br /><strong>" + nw.utils.tr("Dirección Destino") + "</strong>: " + self.ui.address_destino.getValue() + "</strong>";
                    html += "<br /><strong>" + nw.utils.tr("Ciudad destino") + "</strong>: " + self.ciudad_destino + "</strong>";
                    html += "<br /><strong>" + nw.utils.tr("Lugar destino") + "</strong>: " + name_place_destino + "</strong>";
                    html += "</div>";

                    ht += html;

                    ht += "</div>";

                    nw.dialog(ht, accept, cancel, ops);
                };
            }
        } else {
            $(".estimado").remove();
            var val = "";
            val += "<div class='estimado'>";
            val += "<div class='estimadoInt'>";
            var priceShow = valor_total;
            var priceEnd = valor_total;
            if (valor_total !== "Por demanda") {
                if (valor_total > saldo) {
                    priceEnd = valor_total - saldo;
                    priceShow = nw.addNumber(priceEnd);
                }
            }
            self.valor_total = priceEnd;
            val += "<span class='cars_options'></span> <span class='spanValueEnd'>" + pri + priceShow + "</span></br>";
            val += "</div>";
            val += "</div>";

            self.ui.pago_group.prepend(val);
        }
        if (self.configCliente.usa_subservicios == "SI") {
            $('.spanValueEnd').addClass("spanValueEnd_subservicios");
        }
//            self.ui.pago_group.addClass("buttons_group_fix_pago_group");
//            $(".btnMenuHeader").addClass("btnMenuHeader_hidden");
//            self.ui.contenedor_azul.addClass("containBtnFooter_group_fix");
//            self.ui.paradas_group.addClass("containBtnFooter_group_fix");
    },
    destruct: function () {
    },
    members: {
        clickInTarifa: function (btn) {
            var selthis = this;
            var self = selthis.self;
            var servi = selthis.servi;
            var acti = document.querySelector('.acti');
            if (acti) {
                acti.classList.remove('acti');
            }
            self.ui.datos_vehiculo_elegido.setVisibility(false);
            self.ui.datos_vehiculo_elegido.setRequired(false);
//            self.ui.datos_vehiculo_elegido.setValue("");
//            self.ui.fecha.setValue("");
//            self.ui.hora.setValue("");
            btn.classList.add("acti");

            var others = btn.data.others;
            self.concepto_recargo_ruta_fija = others.concepto_recargo;
            self.valor_recargo_ruta_fija = others.valor_recargo;
            self.valor_peajes = others.valor_peajes;
            self.metros_cobro_recargo = others.metros_cobro_recargo;
            self.metros_cobro_peaje = others.metros_cobro_peaje;
            self.inicia_metros_add = others.inicia_metros_add;
            self.valor_metros_add = others.valor_metros_add;
            self.valordistancia = others.valordistancia;
            self.valorbase = others.valorbase;
            self.valorminutos = others.valorminutos;
            self.valor_unidad_tiempo = others.valor_unidad_tiempo;
            self.valor_unidad_metros = others.valor_unidad_metros;
            self.__id_tarifa = servi.id_service_tarifa_fija;

            var serv = btn.data.serv;
            var valor_total = btn.data.valor;
            self.descuento_maximo = btn.data.descuento;
            self.servicioAllData = btn.data.data;
            self.subcategoria_servicio_text = btn.data.data.tipo_servicio;

            self.servicio_nom = serv;
            self.servicio_array = btn.data;
            self.num_mascota = 0;

            if (servi.reservar === "SI") {
                self.ui.tipo_servicio.setVisibility(false);
                self.ui.tipo_servicio.setRequired(false);
                self.ui.tipo_servicio.setValue("reservado");
            }
//            else {
//                self.ui.tipo_servicio.setVisibility(true);
//                self.ui.tipo_servicio.setRequired(true);
//                self.ui.tipo_servicio.setValue("ahora");
//            }

            if (servi.pide_vehiculo_cliente === "SI") {
                self.ui.datos_vehiculo_elegido.setVisibility(true);
                self.ui.datos_vehiculo_elegido.setRequired(true);
            }

            if (servi.mostrar_fecha_hora === "SI") {
                var minsadd = self.minutos_agregar_hora;
                if (nw.evalueData(servi.minutos_agregar_a_fecha)) {
                    minsadd = servi.minutos_agregar_a_fecha;
                    self.minutos_agregar_hora = minsadd;
                } else {
                    self.minutos_agregar_hora = 60;
                }
                self.showHiddenDate(true, parseInt(minsadd));
            }
//            else {
//                self.showHiddenDate(self.__show, 0);
//            }

            if (self.configCliente.app_para == "CARGA") {
                if (typeof self.detalle !== 'undefined') {
                    self.num_mascota = self.detalle.ui.numero_auxiliares.getValue();
                } else {
                    if (typeof self.dataServiceActive !== 'undefined') {
                        self.num_mascota = self.dataServiceActive.numero_auxiliares;
                    }
                }
            } else {
                self.num_mascota = 0;
            }
            self.servicio_nom = serv;
            self.valor_total = valor_total;
            self.reziseMap();
        }
    }
});