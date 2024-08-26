nw.Class.define("f_paradas_adicionales", {
    extend: nw.lists,
    construct: function (self) {
        if (self.debugConstruct) {
            console.log("START_LAUNCH:::::::::::::: f_paradas_adicionales");
        }

        var list = document.querySelector('.list-paradas');
        if (list) {
            list.remove();
        }
        var up = nw.userPolicies.getUserData();
        console.log("up", up);
        var data = {};
        var dataService = {};
        data.id_service = self.id_service;
        data.empresa = up.empresa;
        if (nw.utils.evalueData(self.data_service) && nw.utils.evalueData(self.data_service.observacion_ultima_ubicacion)) {
            self.observacion_ultima_ubicacion = self.data_service.observacion_ultima_ubicacion;
        }
        console.log("paradasAdicionales:::dataService.observacion_ultima_ubicacion", self.observacion_ultima_ubicacion);
        console.log("paradasAdicionales:::dataSendServer:::data", data);
        var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
        rpc.setAsync(true);
        rpc.setLoading(false);
        nw.utils.validateElementIfExist(".nw_widget_div_finalizar_viaje", function (e) {
            if (e) {
                nw.addClass(e, "btn_finalizar_viaje_hidden");
                self.validaExistMarker(function (r) {
                    r.setVisible(false);
//                            self.validaExistPoly(function (rs) {
//                                rs.setVisible(false);
//                            });
                });
            }
            nw.utils.validateElementIfExist(".btn_waze", function (e) {
                if (e) {
                    nw.addClass(e, "btn_waze_hidden");
                }
            });
        });
        var func = function (r) {
            console.log("paradasAdicionales:::responseServer:::data", r);

            self.totalParadas = 0;

            if (typeof self.markerParada !== 'undefined') {
                nwgeo.removeMarker(self.markerParada);
            }
            var en_reparto = false;

            var muestraFinalizar = false;
            if (!r) {
                muestraFinalizar = true;
            }
            if (r.length == 0) {
                muestraFinalizar = true;
            }
            if (muestraFinalizar === true) {
                nw.utils.validateElementIfExist(".nw_widget_div_finalizar_viaje", function (e) {
                    if (e) {
                        nw.removeClass(".nw_widget_div_finalizar_viaje", "btn_finalizar_viaje_hidden");
                        setTimeout(function () {
                            self.validaExistMarker(function (r) {
                                r.setVisible(true);
                                self.pintarLinea(true);
//                                    self.validaExistPoly(function (rs) {
//                                        rs.setVisible(true);
//                                    });
                            });
                            nw.utils.validateElementIfExist(".btn_waze", function (e) {
                                if (e) {
                                    nw.removeClass(".btn_waze", "btn_waze_hidden");
                                }
                            });
                        }, 1000);
                    }
                });
            } else {
//                    setTimeout(function () {
//                        self.validaExistMarker(function (r) {
//                            r.setVisible(true);
//                            self.validaExistPoly(function (r) {
//                                r.setVisible(true);
//                            });
//                        });
//                    }, 1000);
            }

            if (r) {
                if (r.length > 0) {

                    nw.remove(".list-paradas");

                    self.totalParadas = r.length;

                    self.countParada = r.length;

                    var html = "<li class='list-paradas-count'> <i class='material-icons'>golf_course</i>";
                    html += "<div class='paradas-view'>" + r.length + "</div>";
                    html += "<div class='paradas-view-title'> " + nw.tr("Paradas. Iniciar servicios") + ".</div>";
                    html += "</li>";
                    html += "<li class='list-paradas-close'> <i class='material-icons'>close</i></li>";

                    self.parada_list = document.createElement('div');
                    self.parada_list.className = 'list-paradas';
                    self.parada_list.innerHTML = html;
                    var head = document.querySelector('#foo');
                    if (!head) {
                        return false;
                    }
                    head.appendChild(self.parada_list);

                    self.containtParadaItms = document.createElement('div');
                    self.containtParadaItms.className = "containtParadaItms";
                    self.parada_list.appendChild(self.containtParadaItms);

                    self.containtShade = document.createElement('div');
                    self.containtShade.className = "containtShade";
                    self.containtShade.innerHTML = nw.tr("Seleccione un servicio a gestionar (puede ser parada, pasajero o mercancía)");
                    self.parada_list.appendChild(self.containtShade);

                    for (var i = 0; i < r.length; i++) {
                        var parada = r[i];
                        console.log("parada::::::::::::::", parada);

                        if (!nw.utils.evalueData(parada.estado_origendestino)) {
                            if (nw.utils.evalueData(parada.origen_manual_direccion) || nw.utils.evalueData(parada.origen_manual_latitud) || nw.utils.evalueData(parada.origen_manual_longitud) || nw.utils.evalueData(parada.origen_manual_ciudad)) {
                                parada.direccion = parada.origen_manual_direccion;
                                parada.latitud_parada = parada.origen_manual_latitud;
                                parada.longitud_parada = parada.origen_manual_longitud;
                                parada.ciudad_parada = parada.origen_manual_ciudad;
                            }
                        }
                        var num = i + 1;
                        var nams = "<p class='titleproxpar'><span>" + num + ")</span>" + parada.direccion + "</p>";
                        nams += "<strong>" + nw.tr("Estado") + ":</strong> " + nw.tr(parada.estado) + "<br />";
                        if (parada.estado === "REPARTO" && !en_reparto) {
                            openParada(parada, false);
                            en_reparto = true;
                        }
                        if (nw.evalueData(parada.nombre_pasajero)) {
                            nams += "<strong>" + nw.tr("Nombre") + ":</strong> " + parada.nombre_pasajero;
                        }
                        if (nw.evalueData(parada.telefono)) {
                            nams += "<br /><strong>" + nw.tr("Teléfono") + ":</strong> " + parada.telefono;
                        }
                        if (nw.evalueData(parada.descripcion_carga)) {
                            nams += "<br /><strong>" + nw.tr("Comentarios") + ":</strong> " + parada.descripcion_carga;
                        }
                        var html = "";
                        html += "<div class='namspard'>" + nams + "</div>";

                        var paradal = document.createElement('div');
                        paradal.className = "list-paradas-item";
                        paradal.innerHTML = html;
                        paradal.data = parada;
//                        self.parada_list.appendChild(paradal);
                        self.containtParadaItms.appendChild(paradal);

                        var paradalbtn = document.createElement('div');
                        paradalbtn.className = "ver_parada";
                        paradalbtn.innerHTML = nw.tr("Iniciar servicio");
                        paradalbtn.data = parada;
                        paradalbtn.onclick = function () {
                            openParada(this.data);
                        };
                        paradal.appendChild(paradalbtn);

                    }

                    $(document).on('touchstart', '.list-paradas-close', function () {
//                            closeParadas();
                        nw.removeClass(self.parada_list, "parada_list_show", true);
                        nw.removeClass(self.parada_list, "parada_list_open", true);
                        if (typeof self.markerParada !== 'undefined') {
                            nwgeo.removeMarker(self.markerParada);
                        }
                        nw.remove(".vista_parada");
                        nwgeo.centerMap(self.map, self.marker1, self.marker2);
                        self.cleanParadasPoly();
                    });

                    $(document).on('touchstart', '.list-paradas-count', function () {
//                        nw.loading({text: "Por favor espere...", title: "Por favor espere..."});
                        nw.addClass(self.parada_list, "parada_list_show");
//                        setTimeout(function () {
//                            nw.loadingRemove();
//                        }, 2000);
                    });
                }
            }


            function openParada(dataParada, actualizar) {
                console.log("openParada:::START");
                console.log("openParada:::dataParada", dataParada);
                console.log("openParada:::actualizar", actualizar);
                if (nw.utils.evalueData(dataParada.token_usuario)) {
                    nw.sendNotificacion({
                        title: "Tu conductor ha iniciado tu viaje",
                        body: "Prepárate, el conductor se dirige a tu ubicación",
                        icon: "fcm_push_icon",
                        sound: "default",
                        data: "nw.dialog('" + nw.utils.tr("El conductor ha iniciado tu viaje") + "')",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: dataParada.token_usuario
                    });
                }
                if (actualizar === false) {
                    return openParadaContinue(dataParada);
                }
                console.log("openParada:::CONTINUE");
                self.cambiaEstadoParada(dataParada, "REPARTO", function () {
                    return openParadaContinue(dataParada);
                });
            }

            function openParadaContinue(dataParada) {
                closeParadas();

                main.dataServiceOpenHistory = false;

                var data = dataParada;
                console.log("data", data);

                console.log("self.data_service:::data_service", self.data_service);

                if (typeof self.markerParada !== 'undefined') {
                    nwgeo.removeMarker(self.markerParada);
                }
//                    var id = widget.getAttribute('id-len');
                var id = data.id;
                console.log("id", id);
                var parada = data;

                console.log("parada", parada);

                nw.remove(".vista_parada");

                var html1 = "<div class='conDetPard'>" + nw.tr("Detalles de Entrega") + "</div>";
                html1 += "<div class='contdatpardopen'>";
                html1 += "<strong>" + nw.tr("Dirección:") + "</strong> " + parada.direccion;
                if (nw.evalueData(parada.nombre_pasajero))
                    html1 += "</br><strong>" + nw.tr("Nombre:") + " </strong> " + parada.nombre_pasajero;
                if (nw.evalueData(parada.descripcion_carga))
                    html1 += "</br><strong>" + nw.tr("Comentarios de viaje/parada/mercancía") + ": </strong> " + parada.descripcion_carga;
                if (nw.evalueData(self.observacion_ultima_ubicacion))
                    html1 += "</br><strong>" + nw.tr("Obsevaciones Ubicación") + ": </strong> " + self.observacion_ultima_ubicacion;
                html1 += "</div>";

                html1 += "<div class='conDetPardBtns'><div class='conDetPardBtnsEnc'></div>";
                html1 += "</div>";

                var parada_vista = document.createElement('div');
                parada_vista.className = 'vista_parada';
                parada_vista.innerHTML = html1;
                var grupo = document.querySelector('.grupo_nueva_solicitud');
                if (!grupo) {
                    return false;
                }
                grupo.appendChild(parada_vista);

                var volverParada = document.createElement("div");
                volverParada.className = "btn_vistcancel btn_vistapara";
                volverParada.innerHTML = nw.tr("Detener");
                volverParada.data = parada;
                volverParada.onclick = function () {

                    main.dataServiceOpenHistory = false;

                    self.cambiaEstadoParada(dataParada, "REPARTO_DETENIDO", function () {
////                                closeParadas();
//                        nw.removeClass(self.parada_list, "parada_list_show", true);
//                        nw.removeClass(self.parada_list, "parada_list_open", true);
//                        if (typeof self.markerParada !== 'undefined') {
//                            nwgeo.removeMarker(self.markerParada);
//                        }
//                        nw.remove(".vista_parada");
//                        nwgeo.centerMap(self.map, self.marker1, self.marker2);
//                        self.cleanParadasPoly();
//                        self.paradasAdicionales();
                        self.resetParadasAdicionales();

                    });
                };
                parada_vista.querySelector(".conDetPardBtnsEnc").appendChild(volverParada);

                var gpsParada = document.createElement("div");
                gpsParada.className = "confirmar_parada_gps btn_vistapara";
                gpsParada.innerHTML = "GPS";
                gpsParada.data = parada;
                gpsParada.onclick = function () {
                    var da = this.data;
                    console.log("da", da);
                    var opts = {};
                    opts.latitude = da.latitud_parada;
                    opts.longitude = da.longitud_parada;
                    opts.mode = "waze,googleMaps";
                    nw.launchNavigatorUbication(opts);
                };
                parada_vista.querySelector(".conDetPardBtnsEnc").appendChild(gpsParada);

                if (main.configCliente.telefono_pasajero_visible_para_conductor !== "NO") {
                    if (nw.evalueData(parada.telefono) || main.configCliente.telefono_pasajero_visible_para_conductor == "SI") {
                        var tel = parada.telefono;
                        if (main.configCliente.use_telefono_principal_en_paradas == "SI") {
                            tel = self.data_service.celular;
                        }
                        var indicativo = "57";
                        if (nw.evalueData(config.indicativo)) {
                            indicativo = config.indicativo;
                        }
                        var telParada = document.createElement("a");
                        telParada.className = "confirmar_parada_gps btn_vistapara";
                        telParada.innerHTML = "<i class='material-icons'>call</i>";
                        telParada.data = parada;
                        telParada.href = "tel:+" + indicativo + tel;
//                    telParada.onclick = function () {
//                        var da = this.data;
//                        console.log("da", da);
//                        main.llamarCelular(da.telefono);
//                    };
                        parada_vista.querySelector(".conDetPardBtnsEnc").appendChild(telParada);
                    }
                }

                var chatParada = document.createElement("div");
                chatParada.className = "confirmar_parada_gps btn_vistapara";
                chatParada.innerHTML = "<i class='material-icons'>chat</i>";
                chatParada.data = parada;
                chatParada.onclick = function () {
                    var da = this.data;
                    console.log("da", da);

                    var data = {};
                    data.id = "_parada_" + da.id;
                    data.cliente_nombre = "Chat pasajero";
                    data.all_data = da;
                    if (nw.evalueData(da.nombre_pasajero)) {
                        data.cliente_nombre = da.nombre_pasajero;
                    }

                    if (self.configCliente.use_chat_principal_en_paradas == "SI") {
                        var data = self.data_service;
                    }

                    var d = new f_chat();
                    d.construct(data);

                    main.dataServiceOpenHistory = da;

                };
                parada_vista.querySelector(".conDetPardBtnsEnc").appendChild(chatParada);

                var finalNovedad = document.createElement("div");
                finalNovedad.className = "confirmar_parada_novedad btn_vistapara";
                finalNovedad.innerHTML = nw.tr("Finalizar con novedad");
                finalNovedad.data = parada;
                finalNovedad.onclick = function () {
                    var da = this.data;
                    console.log("da", da);
                    self.actualizaParadaNovedad(da);
                };
                parada_vista.querySelector(".conDetPardBtnsEnc").appendChild(finalNovedad);

                if (self.configCliente.informacion_primer_conductor == "SI") {
                    var ampliarDetalle = document.createElement("div");
                    ampliarDetalle.className = "ampliar_detalle btn_vistapara";
                    ampliarDetalle.innerHTML = nw.tr("Ampliar");
                    ampliarDetalle.data = parada;
                    ampliarDetalle.onclick = function () {
                        var da = this.data;
                        console.log("da", self.data_service);
                        main.ampliar(self.data_service);
                    };
                    parada_vista.querySelector(".conDetPardBtnsEnc").appendChild(ampliarDetalle);
                }

                var final = document.createElement("div");
                final.className = "confirmar_parada btn_vistapara";
                final.innerHTML = nw.tr("Finalizar servicio");
                final.data = parada;
                final.onclick = function () {
                    var da = this.data;
                    console.log("self.configCliente", self.configCliente);
                    console.log("self.configCliente.parada_registro_foto", self.configCliente.parada_registro_foto);
                    if (self.configCliente.parada_registro_foto === "SI") {
                        self.actualizaParadaFoto(da);
                    } else {
                        self.actualizaParada(da);
                    }
                };
                parada_vista.querySelector(".conDetPardBtns").appendChild(final);

                if (nw.evalueData(parada.latitud_parada) && nw.evalueData(parada.longitud_parada)) {
                    self.markerParadas(parada);
                }
            }
            function closeParadas() {
                console.log("self.parada_list", self.parada_list)
                nw.removeClass(self.parada_list, "parada_list_show", true);
                nw.addClass(self.parada_list, "parada_list_open");
            }

            self.createParadas = true;
        };
        rpc.exec("paradasAdicionalesApp", data, func);
//            nw.rpcNw("rpcNw", rpc, func, true);

    },
    destruct: function () {
    },
    members: {
    }
});