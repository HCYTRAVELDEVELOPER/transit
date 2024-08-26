nw.Class.define("f_z100_finalizarViaje_valida", {
    extend: nw.lists,
    construct: function (self) {
//        if (self.debugConstruct) {
        console.log("START_LAUNCH:::::::::::::: f_z100_finalizarViaje");
//        }

        if (main.configCliente.foto_para_finalizar_servicio == "SI" || self.data_service.tipo_pago == "Wompi") {
            self.usaRotulos = "NO";
            self.subirImagenes(function (files) {
                console.log("files", files);
                self.filesEnd = files;
                nw.remove(".pruebauno_container");
                start();
            }, self);
            if (self.data_service.tipo_pago == "Wompi") {
                nw.dialog("El pago es con Wompi, recuerda tomar foto del comprobante de pago");
            }
        } else {
            self.filesEnd = false;
            start();
        }

        function start() {
            nwgeo.getLatitudLongitud(function (position) {
                self.execPositionMove(position);
                var data = {};
                data.id = self.data_service.id;
                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                rpc.setAsync(true);
                rpc.setLoading(true);
                var func = function (r) {
                    continuar(r);
                };
                rpc.exec("consultaSolit", data, func);
            });
        }

        function continuar(r) {
            var up = nw.userPolicies.getUserData();

            self.clearIntervaloInService();

            clearTimeout(self.recorridosave);

//            var serv = self.data_service;
            var serv = r;
            serv.usuario_cliente = r.usuario;
            serv.nombre_cliente = r.cliente_nombre;
            serv.precio_viaje = parseInt(r.precio_viaje);
            serv.usuario_cliente = r.usuario_cliente;

            console.log("rrrrrrrrrrrrrrrrrr", r);
            console.log("serv", serv);

            var unidadTiempo = 60;
            var unidadDistancia = 1000;

            var gps = self.positionConductor;
            var coords = {
                lat: parseFloat(serv.latitudConfirmaAbordaje),
                lng: parseFloat(serv.longitudConfirmaAbordaje),
                lat2: parseFloat(gps.lat),
                lng2: parseFloat(gps.lng)
            };
            console.log("serv", serv);
            console.log("coords", coords);

            var hl = new Date();
            var hi = serv.hora_inicio;
            var hf = hl.getHours() + ":" + hl.getMinutes() + ":" + hl.getSeconds();
            var totalMinutos = self.calcularMinutos(hi, hf);

            console.log("totalMinutos", totalMinutos);
            var totaluniminutos = parseInt(totalMinutos);
            var valor_minutos = parseInt(totaluniminutos) * parseInt(serv.valor_unidad_tiempo);
            console.log("valor_minutos", valor_minutos);


            var distanceDriverMtrs = nwgeo.distance(coords.lat, coords.lng, coords.lat2, coords.lng2);
            console.log("distanceDriverMtrs", distanceDriverMtrs);
            distanceDriverMtrs = distanceDriverMtrs.toFixed(0);
            console.log("distanceDriverMtrs fixed", distanceDriverMtrs);
            var valor_distancia = distanceDriverMtrs / unidadDistancia;
            valor_distancia = valor_distancia * serv.valor_unidad_metros;
            var valor_distancia = parseFloat(valor_distancia);
            console.log("valor_distancia", valor_distancia);

            var formaCobroFinalAutomatico = "tiempo_+_distancia";
            var valor_final = valor_minutos + valor_distancia;
            if (self.configCliente.precioFinalIgualInicio === "SI") {
                if (valor_final > serv.valor) {
                    valor_final = parseFloat(serv.valor);
                    formaCobroFinalAutomatico = "precioFinalIgualInicio";
                }
            }
            if (self.configCliente.precioMinimoIgualInicio === "SI") {
                if (parseFloat(valor_final) < parseFloat(serv.valor)) {
                    valor_final = parseFloat(serv.valor);
                    formaCobroFinalAutomatico = "precioMinimoIgualInicio";
                }
            }
            if (serv.tarifa == "tarifa_fija") {
                valor_final = parseFloat(serv.valor);
                formaCobroFinalAutomatico = "tarifa_fija";
            }
//            var iva = parseFloat(valor_final).toFixed(2) * parseFloat(r.iva) / 100;

            var cobraMinima = false;
            if (nw.utils.evalueData(serv.valor_tarifa_minima)) {
                if (valor_final < parseFloat(serv.valor_tarifa_minima)) {
                    valor_final = parseFloat(serv.valor_tarifa_minima);
                    cobraMinima = true;
                    formaCobroFinalAutomatico = "valor_tarifa_minima";
                }
            }

            //RECARGOS
            var aplicaRecargos = "NO";
            if (nw.utils.evalueData(serv.valor_espera)) {
                valor_final = parseFloat(valor_final) + parseFloat(serv.valor_espera);
                aplicaRecargos = "SI";
            }
            if (nw.utils.evalueData(serv.paradas_adicional_valor_total)) {
                valor_final = parseFloat(valor_final) + parseFloat(serv.paradas_adicional_valor_total);
            }

            console.log("valor_final", valor_final);

            var porcentajeConductor = 0;
            if (nw.utils.evalueData(self.configCliente.comision_conductor_porcentaje)) {
                porcentajeConductor = self.configCliente.comision_conductor_porcentaje;
            }
            var utilidadConductor = parseFloat(valor_final) * porcentajeConductor / 100;
            var porcentajeEmpresa = 100 - porcentajeConductor;
            var utilidadInterna = parseFloat(valor_final) * porcentajeEmpresa / 100;

            var iva = 0;
            var iva_porcentaje = 0;
            if (nw.utils.evalueData(serv.iva)) {
                iva = serv.iva;
            }
            if (nw.utils.evalueData(serv.iva_porcentaje)) {
                iva_porcentaje = serv.iva_porcentaje;
            }

            var up = nw.userPolicies.getUserData();

            var dataSend = {};
            dataSend.empresa = up.empresa;
            dataSend.usuario = up.usuario;
            dataSend.nombre_usuario = up.nombre;
            dataSend.id_usuario = up.id_usuario;
            dataSend.email = up.email;
            dataSend.usuario_cliente = serv.usuario_cliente;
            dataSend.perfil = up.perfil;
            dataSend.id = serv.id;
            dataSend.paradas_adicional_numero_total = serv.paradas_adicional_numero_total;
            dataSend.precio_viaje = parseFloat(valor_final).toFixed(2);

            serv.precio_viaje = dataSend.precio_viaje;

            dataSend.tiempo = totalMinutos;
            dataSend.total_metros_final = distanceDriverMtrs;
            dataSend.valor_final_distancia = parseFloat(valor_distancia).toFixed(2);
            dataSend.valor_final_tiempo = parseFloat(valor_minutos).toFixed(2);
//            dataSend.latitudFinalizaServicio = gps.lat;
//            dataSend.longitudFinalizaServicio = gps.lng;
            dataSend.latitudFinalizaServicio = nwgeo.latitude;
            dataSend.longitudFinalizaServicio = nwgeo.longitude;
            dataSend.descuento_aplicado = 0;
            dataSend.aplico_recargo = aplicaRecargos;
            dataSend.iva = iva;
            dataSend.iva_porcentaje = iva_porcentaje;

            if (!self.validateGpsActive()) {
                return false;
            }

//            dataSend.usuario_cliente = serv.usuario;
//            dataSend.nombre_cliente = serv.cliente_nombre;
//            dataSend.dir_origen = serv.origen;
//            dataSend.dir_destino = serv.destino;

            dataSend.comision_porcentaje = porcentajeConductor;
            dataSend.utilidad_conductor = parseFloat(utilidadConductor).toFixed(2);
            dataSend.utilidad_interna = parseFloat(utilidadInterna).toFixed(2);
            dataSend.porcentaje_proveedor = porcentajeConductor;
            dataSend.porcentaje_empresa = porcentajeEmpresa;

            dataSend.paradas_adicional_valor_total = serv.paradas_adicional_valor_total;
            dataSend.cobraMinima = cobraMinima;
            dataSend.formaCobroFinalAutomatico = formaCobroFinalAutomatico;
            dataSend.valor_servicio_inicial = serv.valor;
            dataSend.tipo_pago = serv.tipo_pago;
            dataSend.serv = serv;
            if (nw.evalueData(self.filesEnd)) {
                dataSend.files = self.filesEnd;
            }

            var array1 = {};
//            $.each(serv, function (key, value) {
            $.each(dataSend.serv, function (key, value) {
                array1[key] = value;
            });
            $.each(dataSend, function (key, value) {
                array1[key] = value;
            });
            dataSend.array1 = array1;

            console.log("dataSend.array1", dataSend.array1);
            console.log("DATA:::finalizarServicio:::dataSend", dataSend);
            console.log("DATA:::finalizarServicio:::serv", serv);

            console.log("serv", serv);
            console.log("serv.tipo_pago", serv.tipo_pago);
            console.log("serv.id_tarjeta_credito", serv.id_tarjeta_credito);
            console.log("self.configCliente.tipo_pago", self.configCliente.tipo_pago);
//            if (serv.tipo_pago === "Wompi") {
//                var pay = {};
//                pay.reference = "11";
//                pay.price = 45000000;
////                self.pagarWompi(pay, function () {
////                    finalizarServicio(dataSend);
////                });
//
//                var d = new nw.payWompi();
//                d.start(pay);
//            } else

            if (self.configCliente.tipo_pago == "CREDITO" && !nw.utils.evalueData(serv.id_tarjeta_credito)) {
//                nw.dialog("El usuario no configuró una tarjeta de crédito.");
                var d = new f_z100_finalizarViaje_paga_tarjeta_credito();
                d.construct(self, dataSend, function () {
                    finalizarServicio(dataSend);
                });
                d.cobroCardEnd({status: "Rechazada", respuesta: "El usuario no configuró una tarjeta de crédito."}, serv);

//                return false;
            }

            if (serv.tipo_pago === "tarjeta_credito" && nw.evalueData(serv.id_tarjeta_credito) === true) {
                var d = new f_z100_finalizarViaje_paga_tarjeta_credito();
                d.construct(self, dataSend, function () {
                    finalizarServicio(dataSend);
                });
            } else {
                if (self.configCliente.app_para == "CARGA") {
                    self.firmaConfirma(function (pr) {
                        dataSend.firma_recibido = pr.firma_recibido;
                        finalizarServicio(dataSend);
                    });
                } else {
                    dataSend.firma_recibido = "";
                    finalizarServicio(dataSend);
                }
            }


            function finalizarServicio() {

                dataSend.configCliente = main.configCliente;

                dataSend.dataService = self.dataByBooking("LLEGADA_DESTINO");

                dataSend.templateEmail = main.templateMailEnd();


                if (nw.utils.evalueData(dataSend.dataService.otros_conductores)) {
//                    if (dataSend.dataService.otros_conductores.length > 0) {
                    var conds = JSON.parse(dataSend.dataService.otros_conductores);
                    console.log("conds", conds);

                    if (!nw.utils.evalueData(dataSend.dataService.conductor_proximo)) {
                        var con = conds[0];
                        if (nw.utils.evalueData(con)) {
                            con = nw.utils.str_replace("{", "", con);
                            con = nw.utils.str_replace("}", "", con);
                            dataSend.duplica_viaje = "SI";
                            dataSend.dataService.conductor_proximo = con;
                        }
                    }
//                    }
                }

                console.log("finalizarServicio:::serv", serv);
                console.log("finalizarServicio:::dataSend", dataSend);
//                return;
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
                        data: "nw.dialog('" + nw.utils.tr("Viaje finalizado") + "')",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: serv.token_usuario
                    });
                    if (!document.querySelector(".cont-radar")) {
                        self.getIcon();
                    }
                    self.clearIntvHours();

                    self.ui.finalizar_viaje.setValue("1");
                    nw.refreshSessionApp(function () {}, "noupdate");

                    self.activeFinalizado(dataSend.array1);

                    main.registerServiceInFirebase(dataSend.id);

                };
                rpc.exec("llegadaServicioDestiono", dataSend, func);
            }
        }
        return;
//        //PASO 1: TRAE INFO DEL VIAJE COMPLETO
//        var p = self.data_service;
//        var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
//        rpc.setAsync(true);
//        rpc.setLoading(false);
//        nw.loading({text: "Por favor espere...", title: "Consultando datos de viaje..."});
//        var func = function (r) {
//            nw.loadingRemove();
//            if (self.debugConstruct) {
//                console.log("consultaServicio", r);
//            }
//            if (self.configCliente.foto_para_finalizar_servicio == "SI") {
//                self.subirImagenes(function (files) {
//                    console.log("files", files);
//                    self.filesEnd = files;
//                    nw.remove(".pruebauno_container");
//                    start(r);
//                });
//            } else {
//                start(r);
//            }
//        };
//        rpc.exec("getDataServiceFinal", p, func);
//
//        //PASO 2 TRAE VALORES DE TIEMPO DE ESPERA POR FECHA DE HORA LLEGADA
//        function calculaValorEspera(tiempo_espera, callBack) {
//            if (self.debugConstruct) {
//                console.log("START:::calculaValorEspera:::calcula_tiempo", tiempo_espera);
//            }
//            var up = nw.userPolicies.getUserData();
//            var data = {};
//            data.empresa = up.empresa;
//            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
//            rpc.setAsync(false);
//            rpc.setLoading(false);
//            nw.loading({text: "Por favor espere...", title: "Consultando tiempos espera..."});
//            var func = function (r) {
//                nw.loadingRemove();
//                if (self.debugConstruct) {
//                    console.log("RESPONSE_SERVER:::calculaValorEspera:::r", r);
//                }
//                var total = 0;
//                if (nw.evalueData(r)) {
//                    if (r.length > 0) {
//                        for (var i = 0; i < r.length; i++) {
//                            if (parseInt(tiempo_espera.minutos) > parseInt(r[i].minutos)) {
//                                total = r[i].valor;
//                            }
//                        }
//                    }
//                }
//                return callBack(total);
//            };
//            rpc.exec("consultaTiempoEspera", data, func);
//        }
//
//        //PASO 3 TRAE INFO DE RECARGOS (VALORES PARADAS ADICIONALES, NOCTURNO OTROS)
//        function recargosConsult(confirma_parada, callback) {
//            if (self.debugConstruct) {
//                console.log("START:::recargosConsult:::confirma_parada", confirma_parada);
//            }
//            var hoy = nw.utilsDate.getActualFullDate();
//            var up = nw.userPolicies.getUserData();
//            var data = {};
//            data.empresa = up.empresa;
//            data.confirma_parada = confirma_parada;
//            data.id_service = self.id_service;
//            data.fecha_ahora = hoy;
//
//            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
//            rpc.setAsync(true);
//            rpc.setLoading(false);
//            nw.loading({text: "Por favor espere...", title: "Consultando recargos, paradas adicionales..."});
//            var func = function (r) {
//                nw.loadingRemove();
//                if (self.debugConstruct) {
//                    console.log("RESPONSE_SERVER:::recargosConsult:::r", r);
//                }
//                callback(r);
//            };
//            rpc.exec("populateRecargos", data, func);
//        }
//
//        //PASO 4 TRAE DATOS DE TRAYECTO REAL
//        function trayectoRecorrido(coords, callback) {
////            nw.loading({text: "Por favor espere...", title: "Consultando trayecto recorrido..."});
//            var func_one = function (response) {
//                callback(response);
//            };
//            var multipleCoords = true;
//            var onlyGetData = true;
//            var animateOrCenter = "nothing";
//            self.line = nwgeo.addLineStreet(self.map, coords, func_one, "#dc471e", onlyGetData, animateOrCenter, multipleCoords);
//        }
//
//        //PASO 5 TRAE TARIFAS
//        function traeTarifas(dataConsultaTarifas, callback) {
//            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
//            rpc.setAsync(true);
//            rpc.setLoading(false);
//            nw.loading({text: "Por favor espere...", title: "Consultando tarifas..."});
//            var func = function (r) {
//                callback(r);
//            };
//            rpc.exec("consultaTarifas", dataConsultaTarifas, func);
//        }
//
//
//        //PASO 0 INICIA AQUÍ
//        function start(dataService) {
////            if (self.debugConstruct) {
//            console.log("RESPONSE_DATOS_VIAJE:::::::::::::: f_z100_finalizarViaje", dataService);
////            }
//            var tiempo_espera = self.restarHoras("espera", dataService.hora_llegada, dataService.hora_inicio);
//
//            //PASO 2
//            calculaValorEspera(tiempo_espera, function (valor_espera) {
//
////                console.log("valor_espera", valor_espera)
////                console.log("tiempo_espera", tiempo_espera)
//
//                var recargos = {};
//                recargos.total = 0;
//                recargos.paradas = 0;
//                var confirma_parada = false;
//                if (self.configCliente.paradas_adicional == "SI") {
//                    confirma_parada = true;
//                }
//
//                //PASO 3
//                recargosConsult(confirma_parada, function (data_recargos) {
//                    var consultrecargos = [];
//                    if (confirma_parada == true) {
//                        consultrecargos = data_recargos.recargos;
//                    } else {
//                        consultrecargos = data_recargos;
//                    }
//                    recargos.paradas = 0;
//                    if (consultrecargos.length > 0) {
//                        for (var f = 0; f < consultrecargos.length; f++) {
//                            var val = consultrecargos[f].valor;
//                            if (consultrecargos[f].nombre.toLowerCase() == "parada adicional") {
//                                recargos.paradas = val;
//                            } else {
//                                recargos.total = parseFloat(recargos.total) + parseFloat(val);
//                            }
//                        }
//                    }
//                    var recargos_total = recargos.total;
//                    var cant_para = 0;
//                    var total_valor_paradas = 0;
//                    if (self.configCliente.paradas_adicional == "SI") {
//                        cant_para = data_recargos.countparadas.confirmadas;
//                        if (cant_para > 0 && parseFloat(recargos.paradas) > 0) {
//                            var valor_para = parseInt(cant_para) * parseFloat(recargos.paradas);
//                            recargos_total = parseFloat(recargos.total) + parseInt(valor_para);
//                            total_valor_paradas = parseFloat(recargos.total) + parseInt(valor_para);
//                        }
//                    }
//                    console.log("self.configCliente.paradas_adicional", self.configCliente.paradas_adicional)
//                    console.log("consultrecargos", consultrecargos)
//                    console.log("confirma_parada", confirma_parada)
//                    console.log("data_recargos", data_recargos)
//                    console.log("recargos_total", recargos_total)
//
//                    var dat = self.getRecord();
//                    var ra = self.data_service;
//                    var dataConsultaTarifas = self.data_service;
//                    self.tarifa = ra.tarifa;
//                    var data = {};
//                    data.id = ra.id;
//                    data.tiempo_espera = tiempo_espera.minutos;
//                    data.valor_espera = valor_espera;
//                    data.id = ra.id;
//                    data.empresa = ra.empresa;
//                    data.subservicio = self.__subservicio;
//                    var gps = self.positionConductor;
//                    data.latitudFinalizaServicio = gps.lat;
//                    data.longitudFinalizaServicio = gps.lng;
//                    var coords = {
//                        lat: dataService.latitudConfirmaAbordaje,
//                        lng: dataService.longitudConfirmaAbordaje,
//                        lat2: gps.lat,
//                        lng2: gps.lng
//                    };
//
//                    data.paradas_adicional_numero_total = cant_para;
//                    data.paradas_adicional_valor_unitario = recargos.paradas;
//                    data.paradas_adicional_valor_total = total_valor_paradas;
//
//                    console.log("data.paradas_adicional_numero_total", data.paradas_adicional_numero_total);
//
//                    //PASO 4 CALCULA TIEMPO Y DISTANCIA DESDE QUE ABORDÓ HASTA LA UBICACIÓN ACTUAL QUE FINALIZA EL CONDUCTOR
//                    trayectoRecorrido(coords, function (response) {
//                        console.log("coordscoordscoordscoordscoords", response);
//
//
//                        var distanceDriverKm = 0;
//                        if (response) {
//                            distanceDriverKm = response[0].legs[0].distance.value;
//                        }
//
//
//
//                        nw.loadingRemove();
//                        if (self.debugConstruct) {
//                            console.log("POLYLINEGOOGLE_RESPONSE:::trayecto recorrido:::response", response);
//                        }
//                        if (response == "" || response == false) {
//                            self.poly.tiempo = "0";
//                            self.poly.tiempo_text = "0";
//                            self.poly.total_metros = "0";
//                            self.poly.total_metros_text = "0";
//                        } else
//                        if (response) {
//                            self.poly.tiempo = response[0].legs[0].duration.value;
//                            self.poly.tiempo_text = response[0].legs[0].duration.text;
//                            self.poly.total_metros = response[0].legs[0].distance.value;
//                            self.poly.total_metros_text = response[0].legs[0].distance.text;
//                        } else {
//                            self.poly.tiempo = "";
//                            self.poly.tiempo_text = "";
//                            self.poly.total_metros = "";
//                            self.poly.total_metros_text = "";
//                        }
//                        nwgeo.removeAllPolyLines();
//
//                        //PASO 5
//                        traeTarifas(dataConsultaTarifas, function (r) {
//                            if (self.debugConstruct) {
//                                console.log("SERVER_RESPONSE:::Consultando recargos", r);
//                            }
//                            nw.loadingRemove();
//                            self.dataTarifaViaje = r;
//                            self.minima = r.minima;
//                            var totalunimetros = 0;
////                                console.log(self.poly.total_metros);
////                                console.log(r.metros);
//                            if (typeof r.metros !== 'undefined' && r.metros != "" && parseFloat(r.metros) > 0) {
//                                var totalunimetros = parseFloat(self.poly.total_metros) / parseFloat(r.metros);
//                            } else {
//                                totalunimetros = 0;
//                            }
//                            console.log("totalunimetros", totalunimetros);
//                            console.log("r.valor_unidad_metros", r.valor_unidad_metros);
//                            console.log("r.metros", r.metros);
//                            console.log("self.poly.total_metros", self.poly.total_metros);
//                            self.dataTarifaViaje.total_metros = totalunimetros;
//                            var valordistancia = parseInt(totalunimetros) * parseInt(r.valor_unidad_metros);
////                                console.log(valordistancia);
//                            if (isNaN(valordistancia)) {
//                                valordistancia = 0;
//                            }
//
//                            self.dataTarifaViaje.valordistancia = valordistancia;
//                            var hl = new Date();
//                            var hi = dataService.hora_inicio;
//                            var valor_servicio_inicial = dataService.valor;
//                            var hf = hl.getHours() + ":" + hl.getMinutes() + ":" + hl.getSeconds();
//                            var TotalMinutos = self.calcularMinutos(hi, hf);
//
//                            data.total_metros_final = self.poly.total_metros;
//
//                            var totaluniminutos = parseInt(TotalMinutos);
//                            var valorminutos = parseInt(totaluniminutos) * parseInt(r.valor_unidad_tiempo);
//                            if (self.debugConstruct) {
//                                console.log("valor_espera " + valor_espera);
//                            }
//                            var valor_estimado = parseFloat(valordistancia) + parseFloat(valorminutos) + parseInt(r.valor_banderazo) + parseFloat(recargos_total) + parseFloat(valor_espera);
//                            if (isNaN(valor_estimado)) {
//                                valor_estimado = 0;
//                            }
//                            console.log("TotalMinutos", TotalMinutos);
//                            console.log("totaluniminutos", totaluniminutos);
//                            console.log("valor_estimado", valor_estimado);
//                            console.log("r.iva", r.iva);
//                            if (!nw.evalueData(r.iva)) {
//                                r.iva = 0;
//                            }
//
//
//                            if (parseFloat(valor_estimado) <= parseFloat(self.minima)) {
//                                valor_estimado = self.minima;
//                            }
//
//                            console.log("valor_estimado", valor_estimado);
//
//                            var iva = parseFloat(valor_estimado).toFixed(2) * parseFloat(r.iva) / 100;
//
//                            console.log(":::::IVA", iva);
//
//                            self.valor_total = parseFloat(valor_estimado) + parseFloat(iva);
//                            self.valor_total = parseFloat(self.valor_total).toFixed(2);
//
//                            data.iva = iva;
//                            data.iva_porcentaje = r.iva;
//                            data.valor_tarifa_minima = self.minima;
//
//                            console.log("self.valor_total", self.valor_total);
////                                /inicia
////                                data.valor_metros_add = ra.valor_metros_add;
////                                data.inicia_metros_add = ra.inicia_metros_add;
//                            data.hora_inicio_calcu = hi;
//                            data.hora_fin_calcu = hf;
//                            data.aplico_recargo = "NO";
//                            data.aplico_peaje = "NO";
//
//                            //PASO 6
//                            nw.loading({text: "Por favor espere...", title: "Consultando tiempos de trayecto..."});
////                            self.getTimeToCoords(self.positionConductor.lat, self.positionConductor.lng, parseFloat(ra.latitudDes), parseFloat(ra.longitudDes), function (response) {
////                                if (self.debugConstruct) {
//                            console.log("POLYLINEGOOGLE_RESPONSE:::Consultando tiempos de trayecto:::response", response);
////                                }
//                            nw.loadingRemove();
//
////                                if (response) {
////                                    var distanceDriverKm = response[0].legs[0].distance.value;
////                                } else {
////                                    var distanceDriverKm = 0;
////                                }
//                            data.valor_recargo = 0;
//                            if (parseFloat(ra.metros_cobro_recargo) > 0) {
//                                if (distanceDriverKm <= parseFloat(ra.metros_cobro_recargo)) {
//                                    data.aplico_recargo = "SI";
//                                    if (nw.evalueData(ra.valor_recargo_ruta_fija)) {
//                                        data.valor_recargo = ra.valor_recargo_ruta_fija;
//                                    }
//                                    self.valor_total = parseFloat(self.valor_total) + parseFloat(data.valor_recargo);
//                                }
//                            }
//                            data.valor_peajes = 0;
//                            if (parseFloat(ra.metros_cobro_peaje) > 0) {
//                                if (distanceDriverKm <= parseFloat(ra.metros_cobro_peaje)) {
//                                    data.aplico_peaje = "SI";
//                                    if (nw.evalueData(ra.valor_peajes)) {
//                                        data.valor_peajes = ra.valor_peajes;
//                                    }
//                                    self.valor_total = parseFloat(self.valor_total) + parseFloat(data.valor_peajes);
//                                }
//                            }
//
////                                    if (r.id === 7 || self.configCliente.app_para == "CARGA") {
//                            if (self.configCliente.app_para == "CARGA") {
//                                self.valor_mascotas = parseInt(ra.num_mascota) * parseInt(r.valor_mascota);
//                                self.valor_total += self.valor_mascotas;
//                            }
//                            if (nw.evalueData(r.retorno)) {
//                                if (nw.evalueData(ra.retorno)) {
//                                    if (ra.retorno == "true" || ra.retorno == true || ra.retorno == 1) {
//                                        self.valor_total = parseFloat(self.valor_total) + parseInt(r.retorno);
//                                    }
//                                }
//                            }
//                            if (nw.evalueData(r.cargue)) {
//                                if (nw.evalueData(ra.cargue)) {
//                                    if (ra.cargue == "true" || ra.cargue == true || ra.cargue == 1) {
//                                        self.valor_total = parseFloat(self.valor_total) + parseInt(r.cargue);
//                                    }
//                                }
//                            }
//                            if (nw.evalueData(r.descargue)) {
//                                if (nw.evalueData(ra.descargue)) {
//                                    if (ra.descargue == "true" || ra.descargue == true || ra.descargue == 1) {
//                                        self.valor_total = parseFloat(self.valor_total) + parseInt(r.descargue);
//                                    }
//                                }
//                            }
//                            if (nw.evalueData(r.porcentaje_valor_declarado)) {
//                                if (nw.evalueData(ra.valor_declarado)) {
//                                    if (ra.valor_declarado != "") {
//                                        var declarado = (parseInt(r.porcentaje_valor_declarado) * parseInt(ra.valor_declarado)) / 100;
//                                        self.valor_total = parseFloat(self.valor_total) + parseInt(declarado);
//                                    }
//                                }
//                            }
//
//                            console.log("self.valor_total", self.valor_total);
//                            console.log("self.minima", self.minima);
//                            console.log("iva", iva);
//
//                            if (parseFloat(self.valor_total) <= parseFloat(self.minima)) {
//                                data.precio_viaje = self.minima;
//                            } else {
//                                data.precio_viaje = self.valor_total;
//                            }
//
//                            console.log("data.precio_viaje", data.precio_viaje);
//
//                            if (self.tarifa === "fija") {
//                                data.precio_viaje = "";
//                            }
//                            if (self.dataTarifaViaje.tarifa == "FIJA") {
//                                data.precio_viaje = self.dataTarifaViaje.valor_total;
//                            }
//                            data.tiempo = totaluniminutos;
//                            data.valor_servicio_inicial = valor_servicio_inicial;
//                            if (self.cobro_con === "LIBRE") {
//                                self.valor_total = self.valor_total_digitado;
//                                data.valor_servicio_inicial = self.valor_total_digitado;
//                                data.precio_viaje = self.valor_total_digitado;
//                            }
//                            data.descuento_aplicado = 0;
//
//                            console.log("data.precio_viaje(1)", data.precio_viaje);
//
//                            console.log("data", data);
//                            console.log("dataService", dataService);
//                            console.log("data.total_metros_final", data.total_metros_final);
//                            console.log("dataService.total_metros", dataService.total_metros);
//                            console.log("parseFloat(dataService.total_metros) - 3000", parseFloat(dataService.total_metros) - 3000);
//                            console.log("data.precio_viaje(2)", data.precio_viaje);
//                            console.log("data.valor_servicio_inicial", data.valor_servicio_inicial);
//                            if (self.configCliente.precioFinalIgualInicio === "SI") {
////                                    data.precio_viaje = data.valor_servicio_inicial;
//                                if (nw.evalueData(data.total_metros_final) && nw.evalueData(dataService.total_metros)) {
//                                    var terceraParteMetros = parseFloat(dataService.total_metros) / 3;
//                                    var diferenciaMetrosParaTotal = parseFloat(dataService.total_metros) - terceraParteMetros;
//                                    console.log("terceraParteMetros", terceraParteMetros);
//                                    console.log("diferenciaMetrosParaTotal", diferenciaMetrosParaTotal);
//                                    console.log("parseFloat(data.total_metros_final)", parseFloat(data.total_metros_final));
//                                    if (parseFloat(data.total_metros_final) >= diferenciaMetrosParaTotal) {
//                                        data.precio_viaje = data.valor_servicio_inicial;
//                                    }
//                                }
//                            }
//                            console.log("data.precio_viaje(END)", data.precio_viaje);
////                                return;
//
//
//                            if (nw.evalueData(ra.datos_cupon)) {
//                                var cupon = JSON.parse(ra.datos_cupon);
////                                        var cupon = ra.datos_cupon;
//                                data.cupon_nombre = cupon.nombre;
//                                data.cupon_valor = cupon.valor;
//                                data.tipo_descuento = cupon.tipo_descuento;
//                                if (nw.evalueData(cupon.quemar_cupon) && cupon.quemar_cupon == "SI") {
//                                    data.quemar_cupon = "SI";
//                                }
//                                if (cupon.tipo_descuento == "porcentaje") {
////                                            console.log(cupon.valor);
//                                    data.descuento_aplicado = (data.precio_viaje * parseInt(cupon.valor) / 100).toFixed();
////                                            if (parseInt(ra.descuento_maximo) > 0) {
////                                                if (parseInt(ra.descuento_maximo) < data.descuento_aplicado) {
////                                                    data.descuento_aplicado = parseInt(ra.descuento_maximo);
////                                                }
////                                            }
//                                    data.precio_viaje = data.precio_viaje - data.descuento_aplicado;
//                                } else if (cupon.tipo_descuento == "valor") {
//                                    var val_cup = parseInt(cupon.valor);
//                                    if (parseInt(ra.descuento_maximo) > 0) {
//                                        if (parseInt(ra.descuento_maximo) < val_cup) {
//                                            val_cup = parseInt(ra.descuento_maximo);
//                                        }
//                                    }
//                                    if (val_cup >= data.precio_viaje) {
//                                        data.descuento_aplicado = data.precio_viaje;
//                                        data.precio_viaje = 0;
//                                    } else {
//                                        data.descuento_aplicado = val_cup;
//                                        data.precio_viaje = data.precio_viaje - val_cup;
//                                    }
//                                }
//                            }
//
//                            self.saldoRecarga(ra, function (sr) {
//                                if (nw.evalueData(sr.saldo) && sr.saldo > 0) {
//                                    if (parseFloat(sr.saldo) > parseFloat(data.precio_viaje)) {
//                                        data.saldo_user = parseFloat(sr.saldo) - data.precio_viaje;
//                                        data.precio_viaje = 0;
//                                        data.saldo_user_aplicado = parseFloat(sr.saldo) - parseFloat(data.saldo_user);
//                                    } else {
//                                        data.precio_viaje = parseFloat(data.precio_viaje) - parseFloat(sr.saldo);
//                                        data.saldo_user_aplicado = sr.saldo;
//                                        data.saldo_user = 0;
//                                    }
//                                }
////                                    if (parseInt(ra.descuento_maximo) > 0) {
////                                        data.precio_viaje = data.precio_viaje - parseInt(ra.descuento_maximo);
////                                        data.descuento_aplicado = ra.descuento_maximo;
////                                    }
//                                data.tipo_pago = ra.tipo_pago;
//                                if (ra.tipo_pago === "tarjeta_credito") {
//                                    data.id_tarjeta_credito = ra.id_tarjeta_credito;
//                                }
//                                data.usuario_cliente = ra.usuario;
//                                data.token_usuario = ra.token_usuario;
//                                r.code_referido_cliente = ra.code_referido_cliente;
//                                r.precio_viaje = data.precio_viaje;
//
//                                console.log("r", r)
//                                console.log("r.porcentaje", r.porcentaje)
//
//                                nw.loading({text: "Por favor espere...", title: "Consultando total porcentajes comisiones..."});
//                                self.totalPorcentajes(r, function (res) {
//                                    nw.loadingRemove();
////                                            if (self.debugConstruct) {
//                                    console.log("RETURN:::totalPorcentajes", res);
//
//                                    data.porcentaje_empresa = res.porcentaje_empresa;
//                                    data.porcentaje_proveedor = res.porcentaje_proveedor;
//
////                                            }
////                                        return;
//                                    if (nw.evalueData(res.referidos_viaje)) {
//                                        data.referidos_viaje = res.referidos_viaje;
//                                    }
//                                    if (nw.evalueData(res.numero_referidos)) {
//                                        data.numero_referidos = res.numero_referidos;
//                                    }
//                                    if (nw.evalueData(res.porcentaje_referidos)) {
//                                        data.porcentaje_referidos = res.porcentaje_referidos;
//                                    }
//                                    if (nw.evalueData(res.valor_referido)) {
//                                        data.valor_referido = res.valor_referido;
//                                    }
//                                    if (nw.evalueData(res.utilidad_interna_neto)) {
//                                        data.utilidad_interna_neto = res.utilidad_interna_neto;
//                                    }
//                                    if (nw.evalueData(res.bono_referido)) {
//                                        data.bono_referido = res.bono_referido;
//                                    }
//                                    data.comision_porcentaje = res.comision_porcentaje;
//                                    data.utilidad_conductor = res.utilidad_conductor;
//                                    data.utilidad_interna = res.utilidad_interna;
//                                    data.nombre_cliente = dataService.cliente_nombre;
//                                    data.dir_origen = dataService.origen;
//                                    data.dir_destino = dataService.destino;
//
//                                    self.showPriceEnd(data);
//                                });
//                                var isframe = document.querySelector('.framechat');
//                                if (isframe) {
//                                    isframe.remove();
//                                }
//                                var btn_chat = document.querySelector('.btn_chat');
//                                if (btn_chat) {
//                                    btn_chat.remove();
//                                }
//                            });
////                            });
//                        });
//                    });
//                });
//            });
//        }
    },
    destruct: function () {
    },
    members: {
    }
});