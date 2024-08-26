nw.Class.define("f_showHiddenDate", {
    extend: nw.lists,
    construct: function (self, show, minutesAdd) {
        console.log("self",self);
        console.log("show",show);
        console.log("minutesAdd",minutesAdd);
        if (self.debugConstruct) {
            console.log("START:::f_showHiddenDate:::minutesAdd", minutesAdd);
        }
        self.__show = true;
        if (minutesAdd != 0) {
            self.setHours(minutesAdd);
            self.ui.fechas_group.setVisibility(true);
//            self.ui.fecha.focus();
            self.ui.fecha.setRequired(true);
            self.ui.hora.setRequired(true);
//            setTimeout(function () {
//                $(self.ui.fecha).trigger('click');
//                $(self.ui.fecha).click();
//                $(".fecha").trigger('click');
//                $(".fecha").click();
//            }, 400);
        } else {
            self.ui.fechas_group.setVisibility(false);
        }

        if (show === true) {
            if (self.configCliente.usa_subservicios == "SI") {
                var ele = document.querySelector('.conta_mod');
                if (ele) {
                    ele.remove();
                }
            }
            var data = {};
            data.empresa = self.__up.empresa;
            data.id_tarifa = self.__id_tarifa;
            data.id_sevice = self.servicioAllData.id;
            if (self.configCliente.usa_subservicios == "SI") {
                if (self.debugConstruct) {
                    console.log("START:::f_showHiddenDate:::SUBSERVICIOS");
                }
                var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                rpc.setLoading(false);
                var func = function (r) {
//                    if (self.debugConstruct) {
                        console.log("RESULT_SERVER:::f_showHiddenDate:::r", r);
//                    }
                    var val = "";
                    var domain = config.domain_rpc;
                    var id_element = false;
                    if (self.__select && self.__select != "") {
                        id_element = self.__select.getAttribute("id");
                    }
                    for (var i = 0; i < r.length; i++) {
                        var mod = r[i];
                        console.log("mod", mod);
                        if (nw.evalueData(mod.icono)) {
                            var icon = domain + mod.icono;
                        } else {
                            var icon = config.domain_rpc + config.carpet_files_extern + 'img/iconos_servi/modalidad_check.png';
                        }
                        if (mod.valor == 'trayecto') {
                            var dt = self.__vl_services[mod.servicio_id];
//                                console.log(dt);
                            self.showPrecioSubservice(dt.valor_estimado, dt.iva, dt.ptm, dt.pt, dt.servi, mod.valor, dt.others);
                            var value_service = self.valor_total;
                            mod.valor = self.valor_total;
                        } else {
                            var value_service = mod.valor;
                        }
                        
                        console.log("value_servicevalue_servicevalue_service", value_service);

                        //////////////////inicia cupones/////////
                        var servi = self.__vl_services[mod.servicio_id];
                        var saldo_text = "";
                        var descuento = 0;
                        var up = nw.userPolicies.getUserData();
                        if (self.debugConstruct) {
                            console.log("START:::f_showHiddenDate:::INICIA_CUPONES::up.cupon, servi", up.cupon, servi);
                        }
                        var valor_sin_desc = 0;
                        if (typeof up.cupon === "string" && up.cupon != "") {
                            var cupon = JSON.parse(up.cupon);
                            var aplicar_cupon = true;
                            if (nw.evalueData(cupon.servicio) && cupon.servicio != null && cupon.servicio != "") {
                                if (cupon.servicio != servi.id) {
                                    aplicar_cupon = false;
                                }
                            }
                            if (aplicar_cupon == true) {
                                var porc = cupon.tipo_descuento == "porcentaje" ? cupon.valor : '';
                                if (porc == '') {
                                    valor_sin_desc = "<div class='valuedesc_end_dos'><span class='spanDesc' >$" + nw.addNumber(value_service) + "</span></div>";
                                } else {
                                    valor_sin_desc = "<div class='valuedesc_end_dos'><span class='spanDesc' style='padding-right: 10px;'>$" + nw.addNumber(value_service) + "</span> " + porc + "%</div>";
                                }
                                descuento = servi.servi.descuento_maximo;
                                saldo_text = "";
                                if (cupon.tipo_descuento == "porcentaje") {
//                            console.log(cupon.valor);
                                    var descuento_cupon = (value_service * parseInt(cupon.valor) / 100).toFixed();
//                            if (parseInt(descuento) > 0) {
//                                if (parseInt(descuento) < descuento_cupon) {
//                                    descuento_cupon = parseInt(descuento);
//                                }
//                            }
                                    value_service = value_service - descuento_cupon;
                                } else if (cupon.tipo_descuento == "valor") {
                                    var val_cup = parseInt(cupon.valor);
                                    if (parseInt(descuento) > 0) {
                                        if (parseInt(descuento) < val_cup) {
                                            val_cup = parseInt(descuento);
                                        }
                                    }
                                    if (val_cup >= value_service) {
                                        value_service = 0;
                                    } else {
                                        value_service = value_service - val_cup;
                                    }
                                }
                                if (descuento > 0 && cupon.tipo_descuento == "valor") {
                                    saldo_text += "<span class='spanSaldo'>Desc max cupon:<br> $" + nw.addNumber(descuento) + "</span>";
                                }
//                                saldo_text += "<span class='spanSaldo spanInfoService'><i class='material-icons'>priority_high</i></span>";
                            }
                        }
                        /////////////////////////////fin cupones///////////////////////////

                        console.log("mod.porcentaje_aumento", mod.porcentaje_aumento);

                        var value_subservice = mod.valor;
                        if (nw.evalueData(mod.porcentaje_aumento)) {
                            var aum = parseFloat(value_service) * parseFloat(mod.porcentaje_aumento) / 100;
                            value_service = parseFloat(value_service) + parseFloat(aum);
                            value_subservice = value_service;
                        }

                        console.log("value_service", value_service);
                        console.log("value_subservice", value_subservice);
                        console.log("valor_sin_desc", valor_sin_desc);
                        console.log("saldo_text", saldo_text);

                        val += "<div class='modalidad' id='mod" + i + "'>";
                        if (self.configCliente.mostrar_valor_despues_abordaje != "SI") {
                            if (typeof dt !== 'undefined' && typeof dt.servi !== 'undefined' && typeof dt.servi.valor_mascota !== 'undefined' && dt.servi.valor_mascota && dt.servi.valor_mascota > 0 && self.num_mascota > 0) {
                                val += "<div class='mod_options'><img alt='' src='" + icon + "' /></div> <div class='mod_text' data-valor='" + value_subservice + "' data='" + JSON.stringify(mod) + "'><div>" + mod["nombre"] + "</div><div>$" + Intl.NumberFormat().format(value_service) + " " + valor_sin_desc + saldo_text + "</div><div>Aux. x " + dt.servi.valor_mascota + "</div></div>";
                            } else {
                                val += "<div class='mod_options'>";
                                val += "<img alt='' src='" + icon + "' />";
                                val += "</div>";
                                val += "<div class='mod_text' data-valor='" + value_subservice + "' data='" + JSON.stringify(mod) + "'>";
                                val += "<div>" + mod["nombre"] + "</div>";
                                val += "<div>$" + Intl.NumberFormat().format(value_service);
                                if (nw.evalueData(valor_sin_desc) && nw.evalueData(saldo_text)) {
                                    val += " " + valor_sin_desc + saldo_text;
                                }
                                val += "</div>";
                                val += "</div>";
                            }
                        } else {
                            localStorage.setItem("valor_aproximado_viaje", value_service);
                            val += "<div class='mod_options'><img alt='' src='" + icon + "' /></div> <div class='mod_text' data-valor='" + value_subservice + "' data='" + JSON.stringify(mod) + "'><div>" + mod["nombre"] + "</div><div></div></div>";

                        }
                        val += "</div>";
                    }
                    var ele = document.querySelector('.conta_mod');
                    if (ele) {
                        ele.remove();
                    }
                    var div = document.createElement('div');
                    div.innerHTML = val;
                    div.className = "conta_mod";
                    var ele = document.querySelector('.fechas_group');
                    ele.after(div);

                    self.__select = "";

                    for (var e = 0; e < r.length; e++) {
                        var mod = "#mod" + e;
                        var moda = document.querySelector(mod);
                        moda.addEventListener("click", function (e) {
                            if (self.__select && self.__select != "") {
                                self.__select.style.color = '#db0e32';
                                self.__select.style.border = '1.1px solid #db0e32';
                                self.__select.style.background = 'linear-gradient(239deg, rgba(211, 200, 203, 0.85), #f1f5f6)';
                            }
                            this.style.color = 'rgb(49, 52, 50)';
                            this.style.border = '1.1px solid #1e7f26';
                            this.style.background = 'linear-gradient(239deg, rgb(123, 228, 132), rgb(172, 178, 173)';
                            self.__select = this;
                            self.__subservice = JSON.parse(this.querySelector('.mod_text').getAttribute("data"));
//                            self.valor_total = self.__subservice["valor"];
                            self.valor_total = JSON.parse(this.querySelector('.mod_text').getAttribute("data-valor"));
                        });
                        if (e == 0) {
                            moda.click();
                        }
                    }
                    if (id_element) {
                        var selecAnt = document.querySelector("#" + id_element);
                        if (selecAnt) {
                            selecAnt.style.color = 'rgb(49, 52, 50)';
                            selecAnt.style.border = '1.1px solid #1e7f26';
                            selecAnt.style.background = 'linear-gradient(239deg, rgb(123, 228, 132), rgb(172, 178, 173)';
                        }
                    }
                };
                rpc.exec("querySubService", data, func);
            }
        } else {
            self.setHours(0);
            self.ui.fechas_group.setVisibility(false);
            self.ui.fecha.setRequired(false);
            self.ui.hora.setRequired(false);
            self.reziseNormalMap();
            if (self.configCliente.usa_subservicios == "SI") {
                var ele = document.querySelector('.conta_mod');
                if (ele) {
                    ele.remove();
                }
            }
        }
    },
    destruct: function () {
    },
    members: {
    }
});