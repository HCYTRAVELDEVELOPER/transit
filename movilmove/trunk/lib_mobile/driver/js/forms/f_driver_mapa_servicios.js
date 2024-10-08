nw.Class.define("f_driver_mapa_servicios", {
    extend: nw.forms,
    construct: function (idService) {
        var self = this;

        main.f_drive_mapa_servicios = self;

        nw.activateBackgroundMode();
        var createInHome = true;
        if (createInHome) {
            self.canvas = "#foo";
            self.id_form = "f_driver_mapa_servicios";
        } else {
            self.id = "f_crear_viaje";
            self.setTitle = "<span style='color:#fff;'>Mapa driver</span>";
            self.showBack = false;
            self.closeBack = true;
            self.html = "";
            self.textClose = "";
            self.colorBtnBackIOS = "#ffffff;";
            self.styleCloseIOS = "top: 3px;";
            self.createBase();
        }
        self.recorridosave = null;
        self.map = null;
        self.timeToValideServiceActive = 10000;
        self.deviceRotation = 0;
        self.oncal = false;
        self.debug = false;
        self.debugConstruct = main.debugConstruct;
        self.drag = false;
//        self.debug = true;
        self.zoom = 16;
        self.valor_total_digitado = 0;
        self.intervalService = null;
        self.intervalServiceCount = null;
        self.actEnRuta = false;
//        self.configCliente = null;
//        self.cobro_con = null;
        self.configCliente = main.configCliente;
        if (nw.evalueData(self.configCliente.valor_minimo_retiro)) {
            config.valor_minimo_retiro = self.configCliente.valor_minimo_retiro;
        }
        self.positionConductor = {};
        self.__intvHours = false;
        self.cobro_con = main.cobro_con;
        self.execCallBakWatchInitial = false;
        self.trazaLineaCreada = false;
        self.timeIntervaloSearchServices = 10000;
        self.frameChat = null;
        self.serviceActive = false;
        self.latitudDestino = null;
        self.longitudDestino = null;
        self.idServicesMostrados = [];
        if (nw.evalueData(window.localStorage.getItem("addRechazadoServiceMostrado"))) {
            var ras = window.localStorage.getItem("addRechazadoServiceMostrado");
            self.idServicesMostrados = JSON.parse(ras);
        } else {
            window.localStorage.setItem("addRechazadoServiceMostrado", "[]");
        }
//        console.log("self.idServicesMostrados", self.idServicesMostrados)
//        console.log("self.configCliente", self.configCliente);

        self.idServicesRechazados = [];
        self.id_service = false;
        self.data_service = false;
        self.loadedFirst = false;
        self.interval = null;
        self.marker1 = false;
        self.marker2 = false;
        self.markerSelected = false;
        self.line = false;
        self.launch = true;
        self.dragMapa = true;
        self.time = 0;
        self.heatmap = false;
        self.vehiculo = main.vehiculo;
        self.numServicio = new Array();
        self.hora_inicio_viaje = "";
        self.estado_activacion = "";
        self.finalizaServiceActive = false;
        self.poly = {};
        self.geo = {};
        self.geoDestino = {};
        self.ui_servi = {};
        self.heightMap = $("body").height();
        self.cancela_conductor = false;
        var confirmar_abordaje = 'Confirmar abordaje';
        if (typeof self.configCliente.texto_boton_confirmar_abordaje === 'string' && self.configCliente.texto_boton_confirmar_abordaje != "" && self.configCliente.texto_boton_confirmar_abordaje != "0") {
            if (self.configCliente.texto_boton_confirmar_abordaje.length <= 25) {
                confirmar_abordaje = self.configCliente.texto_boton_confirmar_abordaje;
            }
        }
//        var texto_boton_llegada_destino = 'Desliza a la derecha para finalizar viaje';
        var texto_boton_llegada_destino = 'Finalizar viaje';
        if (nw.evalueData(self.configCliente.texto_boton_llegada_destino)) {
            texto_boton_llegada_destino = self.configCliente.texto_boton_llegada_destino;
        }
        if (self.configCliente.cancela_conductor == "SI") {
            self.cancela_conductor = true;
        }
        var fields = [
            {
                styleContainer: "margin:0;",
//                style: "min-width: 200px; min-height: 200px;width: 300px; height: 300px;",
                label: "",
                name: "mapa",
                mode: "div",
                type: "startGroup"
            },
            {
                mode: "div",
                type: "endGroup"
            },
            {
                styleContainer: "margin:0;",
                style: "",
                label: "",
                name: "ofline",
                type: "startGroup"
            },
            {
                type: "endGroup"
            },
            {
                style: '',
                label: '',
                name: "buttons_driver",
                type: "startGroup"
            },
            {
                type: 'button',
                label: 'Desconectarme, no recibir nuevos servicios',
                name: 'status_driver',
                visible: false
            },
            {
                type: 'button',
                label: 'Poner online',
                name: 'driver_online',
                visible: false
            },
            {
                type: 'button',
                label: 'Ob',
                name: 'driver_novedad'
            },
            {
                type: "endGroup"
            },
            {
                style: '',
                label: '',
                name: "grupo_nueva_solicitud",
                type: "startGroup"
            },
            {
                type: 'html',
                label: '',
                name: 'html_grupo_nueva_solicitud'
            },
            {
                icon: "material-icons timer tiempo",
                visible: false,
                required: true,
                label: "Llegaré en",
                name: "tiempo_estimado",
                type: "selectBox"
            },
            (function () {
                var data = {};
                if (self.cancela_conductor == true) {
                    var data = {
                        type: 'button',
                        label: 'Cancelar',
                        name: 'cancelar_pedido'
                    }
                }
                return data;
            })(),
            {
                type: 'button',
                label: 'Confirmar llegada',
                name: 'confirmar_llegada'
            },
            {
                type: 'button',
                label: confirmar_abordaje,
                name: 'confirmar_abordaje'
            },
            {
                type: 'numeric',
                label: 'precio viaje',
                name: 'precio_viaje',
                required: true
            },
            {
                type: 'button',
                label: 'Cobrar',
                name: 'cobrar'
            },
            {
                type: 'button',
//                type: 'switch',
//                type: 'range',
                rangeMax: '100',
                rangeMin: '1',
//                options: "<option value='encurso'>Finalizar</option><option value='encursofsd'>prueba</option><option value='finalizar'>Terminando viaje</option>",
                label: texto_boton_llegada_destino,
                name: 'finalizar_viaje'
            },
            {
                type: 'button',
                label: 'Rechazar',
                name: 'rechazar_pedido_driver'
            },
            {
                type: 'button',
                label: 'Aceptar',
                name: 'aceptar_pedido_driver'
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                name: "widget_hours",
                type: "startGroup",
                mode: "vertical"
            },
            {
                name: "state_travel",
                label: "Estado del viaje",
                placeholder: "Escriba  el estado o descripción del viaje",
                type: "textArea"
            },
            {
                type: "button",
                name: "save_state",
                label: "Guardar"
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                name: "widget_verifica_codigo",
                type: "startGroup",
                mode: "vertical"
            },
            {
                label: "Ingrese el código de verificación",
                name: "widget_verifica_codigo_inter",
                type: "startGroup",
                mode: "vertical"
            },
            {
                name: "codigo1",
                label: "",
                placeholder: "",
                car_max: 4,
                type: "numeric",
            },
            {
                type: "button",
                name: "cancel_code",
                label: "Cancelar"
            },
            {
                type: "button",
                name: "confirmar_code",
                label: "Confirmar"
            },
            {
                type: "endGroup"
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                name: "frame",
                type: "startGroup",
                mode: "vertical"
            },
            {
                type: "endGroup"
            }
        ];
        self.setFields(fields);
        self.buttons = [];
        self.buttons.push(
                {
                    colorBtnBackIOS: "#19b8d3",
                    icon: "material-icons my_location mi_ubication_pin_geo",
                    position: "top",
                    name: "centrar_mapa",
                    label: "",
                    callback: function () {
                        self.dragMapa = true;
                        self.drag = false;
                        if (typeof self.timeDrag !== 'undefined') {
                            clearTimeout(self.timeDrag);
                            delete self.timeDrag;
                        }
                        self.centerUbication();
//                        nwgeo.centerMap(self.map, self.marker1, false, 17);
                    }
                },
                {
                    colorBtnBackIOS: "rgb(25, 24, 23)",
                    icon: "material-icons blur_off map_cal",
                    position: "top",
                    name: "map_calor",
                    label: "",
                    callback: function () {
                        var element = document.querySelector('.map_calor .map_cal');
                        if (self.oncal) {
                            element.innerHTML = "blur_off";
                            element.style = "rgb(25, 24, 23);";
                            self.oncal = false;
                            self.removeMapaDeCalorService();
                        } else {
                            element.innerHTML = "blur_on";
                            element.style = "color:#c04025;";
                            self.oncal = true;
                            self.mapaDeCalorService();
                        }
                    }
                }
        );
        self.show();


        var click = "click touch";
        (function () {
            $('body').delegate('.cliente_foto', click, function () {
                var foto = this.getAttribute("data");
                if (nw.evalueData(foto)) {
                    nw.nw_dialog("<div class='imgClienteOpen' style='background-image: url(" + foto + ");'></div>");
                }
            });
        })();

        nw.addClass(document.querySelector(self.canvas), "f_driver_mapa_servicios");

        self.removeStateTravel();

        if (self.cancela_conductor == true) {
            var contbt0 = document.querySelector('.nw_widget_div_confirmar_llegada');
            if (contbt0) {
                contbt0.classList.add("nw_widget_div_parent_cancel");
            }
            var bt0 = document.querySelector('#confirmar_llegada');
            if (bt0) {
                bt0.classList.add("parent_cancel");
            }
            var contbt1 = document.querySelector('.nw_widget_div_confirmar_abordaje');
            if (contbt1) {
                contbt1.classList.add("nw_widget_div_parent_cancel");
            }
            var bt1 = document.querySelector('#confirmar_abordaje');
            if (bt1) {
                bt1.classList.add("parent_cancel");
            }
            self.ui.cancelar_pedido.addListener("click", function () {
                var d = new f_cancelar_servicio();
                d.construct(self.data_service);
            });
        }
        self.ui.grupo_nueva_solicitud.setVisibility(false);
        self.ui.confirmar_llegada.setVisibility(false);
        self.ui.confirmar_abordaje.setVisibility(false);
        self.ui.finalizar_viaje.setVisibility(false);
        self.ui.precio_viaje.setVisibility(false);
        self.ui.cobrar.setVisibility(false);
        self.ui.ofline.setVisibility(false);
        self.ui.driver_novedad.setVisibility(false);

        self.ui.rechazar_pedido_driver.addListener("click", function () {
            self.idServicesRechazados.push(self.id_service);
            self.activeNormal();
        });

        self.ui.confirmar_code.addListener("click", function () {
            var codigo_ingresado = self.ui.codigo1.getValue();
            if (codigo_ingresado == "") {
                nw.dialog("Ingrese un código por favor.");
                return;
            }
            var code_verifi_service = 0;
            if (self.finalizaServiceActive == false) {
                code_verifi_service = self.data_service.code_verifi_service;
            } else {
                code_verifi_service = self.data_service.code_verifi_service_fin;
            }

            if (code_verifi_service === codigo_ingresado) {
                if (self.finalizaServiceActive == false) {
                    self.confirmarAbordaje();
                } else {
                    self.finalizaServiceActive = false;
                    if (self.cobro_con === "LIBRE") {
                        self.precio_viaje();
                    } else {
                        self.finalizarViaje();
                    }
                }
                self.ui.widget_verifica_codigo.removeClass("widget_verifica_codigo_visible");
            } else {
                nw.dialog("El código ingresado no es correcto.");
            }

            console.log(codigo_ingresado);
            console.log(self.data_service);

        });
        self.ui.cancel_code.addListener("click", function () {
            self.ui.widget_verifica_codigo.removeClass("widget_verifica_codigo_visible");
        });
        self.ui.confirmar_llegada.addListener("click", function () {
            self.confirmarLlegada();
        });
        self.ui.confirmar_abordaje.addListener("click", function () {
            if (self.configCliente.usa_codigos_verificacion_servicio === "SI") {
                self.ui.codigo1.setValue("");
                self.ui.widget_verifica_codigo.addClass("widget_verifica_codigo_visible");
            } else {
                self.confirmarAbordaje();
            }
        });

        self.ui.finalizar_viaje.addListener("click", function () {
            if (self.totalParadas !== 0) {
                nw.remove(".popup_pil");
                nw.dialog("No puede finalizar el servicio, aún tiene paradas adicionales pendientes por cumplir.");
                self.ui.finalizar_viaje.setValue("1");
                return false;
            }
            var showcode = false;
            if (self.configCliente.usa_codigos_verificacion_servicio === "SI") {
                showcode = true;
            }
            if (self.configCliente.usa_codigos_verificacion_solo_al_iniciar === "SI") {
                showcode = false;
            }
            if (showcode) {
                self.ui.codigo1.setValue("");
                self.finalizaServiceActive = true;
                self.ui.widget_verifica_codigo.addClass("widget_verifica_codigo_visible");
            } else {
                if (self.cobro_con === "LIBRE") {
                    self.precio_viaje();
                } else {
                    self.finalizarViaje();
                }
            }
        });

        self.ui.status_driver.addListener("click", function () {
            self.ponerOnOffline("offline");
        });
        self.ui.driver_online.addListener("click", function () {
            self.ponerOnOffline("online");
            self.initIntervalo();
            nw.dialog("Activando... por favor espere", false, false, {original: true});
            setTimeout(function () {
                window.location.reload();
            }, 5000);
        });
        self.ui.cobrar.addListener("click", function () {
            var valor_total = self.ui.precio_viaje.getValue();
            if (!nw.evalueData(valor_total)) {
                nw.dialog("Debe ingresar el valor del servicio");
                return false;
            }
            self.valor_total_digitado = valor_total;
            self.finalizarViaje();
        });
        document.addEventListener('ver_viaje', function (e) {
//            self.activeFinalizado();
            self.ui.finalizar_viaje.setVisibility(false);
            self.data_service = e.detail;
            self.resolveStatus();
        });
        document.addEventListener('cancelServi', function (e) {
            self.clearIntervaloInService();
            self.sendMsgFrameCancel(e.detail);
//            var animate = true;
//            var zoom = false;
//            var bounds = [
//                {"lat": self.positionConductor.lat, "lng": self.positionConductor.lng}
//            ];
//            var multiplePoints = false;
//            nwgeo.centerMap(self.map, self.marker1, false, zoom, bounds, multiplePoints, animate);

            self.centerUbication();

        });
        document.addEventListener('calificaService', function (e) {
//            var animate = true;
//            var zoom = false;
//            var bounds = [
//                {"lat": self.positionConductor.lat, "lng": self.positionConductor.lng}
//            ];
//            var multiplePoints = false;
//            nwgeo.centerMap(self.map, self.marker1, false, zoom, bounds, multiplePoints, animate);
            self.centerUbication();
        });

        var up = nw.userPolicies.getUserData();
        if (self.debug) {
            console.log("servicios activos conductor", JSON.parse(up.servicios_activos));
        }

//        self.ui.save_state.addListener("execute", function () {
//            var up = nw.userPolicies.getUserData();
//            var data = self.getRecord();
//            data.id_service = self.id_service;
//            data.empresa = up.empresa;
//            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
//            rpc.setAsync(true);
//            var func = function (r) {
//                self.removeStateTravel();
//            };
//            rpc.exec("saveStateTravel", data, func);
//        });

        $("body").delegate("#novelty", "click", function () {
            var novedades = function () {
                var d = new f_novedades();
                d.populate(self.data_service);
                d.construct();
            };
            var retrasos = function () {
                var d = new f_chat();
                d.construct(self.data_service, true);

                var up = nw.userPolicies.getUserData();
                console.log(self.data_service);
                nw.sendNotificacion({
                    title: nw.utils.tr("Nuevo mensaje de") + " " + up.nombre,
                    body: up.nombre + ": " + nw.utils.tr("Me encuentro retrasado"),
                    icon: "fcm_push_icon",
                    sound: "default",
//                            data: "nw.dialog('Nuevo mensaje de ', function(){nw.examplesDevelopers()},function(){})",
                    data: "nw.dialog('" + nw.utils.tr("Nuevo mensaje: Me encuentro retrasado") + "')",
                    callback: "FCM_PLUGIN_ACTIVITY",
                    to: self.data_service.token_usuario
                });
            };
            var options = {};
            options.iconAccept = "<i class='material-icons' style='top: 5px;position: relative;'>report</i>";
            options.iconCancel = "<i class='material-icons' style='top: 5px;position: relative;'>access_time</i> ";
            options.useDialogNative = false;
            options.closeEnc = true;
            options.autocierre = true;
            options.cleanHtml = false;
            options.textAccept = "Problema";
            options.textCancel = "Retraso";
            nw.dialog("¿Qué desea reportar?", novedades, retrasos, options);
        });

        main.selfMapaDriver = self;

        self.status = "activo";
        if (self.configCliente.conductores_siempre_online == "SI") {
            self.status = "activo";
            window.localStorage.setItem("status_driver_online_offline", "activo");
        } else {
            if (typeof window.localStorage.getItem("status_driver_online_offline") === "undefined" || window.localStorage.getItem("status_driver_online_offline") === null || window.localStorage.getItem("status_driver_online_offline") === "activo") {
                window.localStorage.setItem("status_driver_online_offline", "activo");
            } else {
                self.status = window.localStorage.getItem("status_driver_online_offline");
            }
        }

        var d = new f_activeChangeStatus();
        d.construct(self);

        console.log("self.status", self.status);
        $(".dataUserNameMail").append("<span class='dataUser dataUserStatus'>" + nw.utils.tr(self.status) + "</span>");

        setTimeout(function () {
            iniciarMapa();
        }, 600);

        function iniciarMapa() {
            var div = document.querySelector("#mapa");
            if (div.offsetWidth < 100 || div.offsetHeight < 100) {
                setTimeout(function () {
                    iniciarMapa();
                }, 500);
                return;
            }
            self.createMapa(function () {
//                nwgeo.getLatitudLongitud(function (position) {
//                self.positionConductor = {lat: position.coords.latitude, lng: position.coords.longitude};
                self.positionConductor = {lat: nwgeo.latitude, lng: nwgeo.longitude};
//            self.createMapa(function () {
//                if (typeof navigator.splashscreen !== "undefined") {
//                    navigator.splashscreen.hide();
//                }
                self.initialMyUbication();
                self.eventsDrag();

                if (self.status === "activo") {
                    nw.activateBackgroundMode();
                    self.ponerOnOffline("online", false);
                } else {
                    self.ponerOnOffline("offline", false);
                }
                if (main.configCliente.soat == "SI") {
                    self.validaSoatVigente();
                }

                setTimeout(function () {
                    if (main.configCliente.usa_firebase == "SI") {
                        main.validaServicioActivoFirebase();
                    } else {
                        self.validaServiceActive();
                    }
                }, 2000);
            });
        }

        main.listDriverMap = self;

    },
    destruct: function () {
    },
    members: {
        validateCodeVerifiService: function validateCodeVerifiService() {
            var self = this;

        },
        createParadas: false,
        totalParadas: 0,
        validaExistMarker: function validaExistMarker(callback) {
            var self = this;
            var marker = self.marker2;
            if (typeof marker !== "undefined") {
                if (marker !== null && marker !== false && marker !== "") {
                    return callback(marker);
                }
            }
            setTimeout(function () {
                self.validaExistMarker(callback);
            }, 500);
            return false;
        },
        validaExistPoly: function validaExistPoly(callback) {
            var self = this;
            var marker = self.polylineRuta;
            console.log("self.line", self.line);
            console.log("self.polylineRuta", marker);
            if (typeof marker !== "undefined") {
                if (marker !== null && marker !== false && marker !== "") {
                    return callback(marker);
                }
            }
            setTimeout(function () {
                self.validaExistPoly(callback);
            }, 500);
            return false;
        },
        paradasAdicionales: function paradasAdicionales() {
            var self = this;
            if (typeof f_paradas_adicionales == "undefined") {
                nw.dialog("Debe actualizar la aplicación (code 23)", function () {
                    main.actualizarApp();
                });
                return false;
            }
            var d = new f_paradas_adicionales();
            d.construct(self);
            return;
        },
        resetParadasAdicionales: function resetParadasAdicionales() {
            var self = this;
            nw.removeClass(self.parada_list, "parada_list_show", true);
            nw.removeClass(self.parada_list, "parada_list_open", true);
            if (typeof self.markerParada !== 'undefined') {
                nwgeo.removeMarker(self.markerParada);
            }
            nw.remove(".vista_parada");
            nwgeo.centerMap(self.map, self.marker1, self.marker2);
            self.cleanParadasPoly();

            self.paradasAdicionales();
        },
        cambiaEstadoParada: function (dataParada, estado, callback) {
            var self = this;
            console.log("cambiaEstadoParada:::START");
            console.log("cambiaEstadoParada:::dataParada", dataParada);
//                    return openParadaContinue(widget);
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.latitud = self.geo.latitude;
            data.longitud = self.geo.longitude;
            data.id = dataParada.id;
            data.id_servicio = dataParada.id_servicio;
            data.estado = estado;
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            data.observacion = "";
            data.numero_guia = dataParada.descripcion_carga;
            data.imagen_guia = "";
            if (nw.evalueData(dataParada.detalleRegistroFoto)) {
                if (nw.evalueData(dataParada.detalleRegistroFoto.registro_fotografico)) {
                    data.imagen_guia = config.domain_rpc + dataParada.detalleRegistroFoto.registro_fotografico;
                }
            }
            if (nw.evalueData(dataParada.detalleNovedad)) {
                data.observacion = dataParada.detalleNovedad.novedad_text + " Observaciones driver" + dataParada.detalleNovedad.observaciones;
                data.novedad_causa = dataParada.detalleNovedad.novedad;
            }
            data.usaSitca = "NO";
            if (self.configCliente.usaSitca === "SI") {
                data.usaSitca = "SI";
            }
            console.log("cambiaEstadoParada:::data", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "api_movilmove");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log("cambiaEstadoParada:::RESPONSE_SERVER:::", r);
                if (typeof r === "object") {
                    if (r.result != true) {
                        var nov = "";
                        $.each(r, function (index, val) {
                            if (nw.evalueData(val)) {
                                nov += index + ": " + val + "<br />";
                            }
                        });
                        nw.dialog("<strong>Ha ocurrido una novedad:</strong> <br />" + nov, false, false, {original: true});
                        if (nov.indexOf("No existe la guía") === -1) {
                            return false;
                        }
                    }
                }
                callback(dataParada);
                main.registerServiceInFirebase(dataParada.id);
            };
            rpc.exec("actualizaGuiaSitca", data, func);
        },
        actualizaParadaNovedad: function actualizaParadaNovedad(parada) {
            var self = this;
            var form = self.subirImagenes(function (e) {
                var tiene_novedad = "";
                console.log("e", e);
                var data = {};
                if (e != false) {
                    data.registro_fotografico_comentarios = e.comentarios;
                    if (nw.utils.evalueData(e.files)) {
                        if (nw.utils.evalueData(e.files[0])) {
                            data.registro_fotografico = e.files[0].imagen;
                            data.registro_fotografico_otras_fotos = e.files;
                        }
                    }
                    data.all_data = e;
                    data.novedad = e.novedad;
                    data.novedad_text = e.novedad_text;
                    data.observaciones = e.comentarios;
                    if (typeof e.rotulos != "undefined") {
                        data.rotulos = e.rotulos;
                    }
                    tiene_novedad = "SI";
                }
                parada.tiene_novedad = tiene_novedad;
                parada.detalleNovedad = data;
                parada.detalleRegistroFoto = data;
                parada.numero_guia = parada.descripcion_carga;
                console.log("data", data);
                console.log("parada", parada);
//                return;
//                nw.remove(".pruebauno_container");
                self.actualizaParada(parada, "NOVEDAD");
                return false;
            }, {mostrarNovedades: true, permitirOmitir: false, data: parada});
        },
        subirImagenes: function subirImagenes(callback, opts) {
            var self = this;
            var d = new f_agregar_imagenes();
            d.construct(callback, opts);
            return d;
        },
        actualizaParadaFoto: function actualizaParadaFoto(parada, callback) {
            var self = this;
            var form = self.subirImagenes(function (e) {
                console.log("e", e);
                var data = {};
                if (e != false) {
                    data.registro_fotografico_comentarios = e.comentarios;
                    if (typeof e.files != "undefined") {
                        data.registro_fotografico_otras_fotos = e.files;
                        if (typeof e.files[0] != "undefined") {
                            data.registro_fotografico = e.files[0].imagen;
                        }
                    }
                    if (typeof e.rotulos != "undefined") {
                        data.rotulos = e.rotulos;
                    }
                }
                if (nw.evalueData(callback)) {
                    return callback(data);
                }
                parada.numero_guia = parada.descripcion_carga;
                parada.detalleRegistroFoto = data;
                console.log("data", data);
                console.log("parada", parada);
//                nw.remove(".pruebauno_container");
                self.actualizaParada(parada);
                return false;
            }, {data: parada});
            console.log("form", form);
        },
        actualizaParada: function actualizaParada(parada, estado) {
            console.log("actualizaParada:::START");
            console.log("actualizaParada:::parada", parada);
            if (!nw.evalueData(estado)) {
                estado = "ENTREGADO";
            }
            console.log("actualizaParada:::estado", estado);
            var self = this;
            if (self.configCliente.paradaValidaFinalizar == "SI") {
                var op = {};
                op.original = true;
                op.textAccept = "Si, finalizar";
                op.textCancel = "Volver";
                nw.dialog("¿Realmente quiere finalizar esta parada?", function () {
                    siFinaliza();
                }, function () {
                    return true;
                }, op);
            } else {
                siFinaliza();
            }

            function siFinaliza() {
                main.dataServiceOpenHistory = false;
                console.log("CLEAN:::::main.dataServiceOpenHistory");

                nw.remove(".pruebauno_container");
//                self.cambiaEstadoParada(parada, estado, function () {
                var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
                rpc.setAsync(true);
                rpc.setLoading(true);
                console.log("parada", parada);
                console.log("self.data_service", self.data_service);
                console.log("self.data_service.paradas_adicional_numero_total", self.data_service.paradas_adicional_numero_total);
                parada.estado = estado;
                parada.latitud_final = self.geo.latitude;
                parada.longitud_final = self.geo.longitude;
                parada.paradas_adicional_valor_unitario = 0;
                if (nw.utils.evalueData(self.configCliente.recargos_valor_parada_adicional)) {
                    parada.paradas_adicional_valor_unitario = self.configCliente.recargos_valor_parada_adicional;
                }
                parada.usaSitca = "NO";
                if (self.configCliente.usaSitca === "SI") {
                    parada.usaSitca = "SI";
                }

                if (!nw.utils.evalueData(parada.estado_origendestino)) {
                    if (nw.utils.evalueData(parada.origen_manual_direccion) || nw.utils.evalueData(parada.origen_manual_latitud) || nw.utils.evalueData(parada.origen_manual_longitud) || nw.utils.evalueData(parada.origen_manual_ciudad)) {
                        parada.estado_origendestino = "ORIGEN_FINALIZADO";
                    }
                }

                console.log("paradaparadaparadaparadaparadaparadaparadaparada", parada);
//                return;
                var func = function (r) {
                    console.log("parada:::rrrrrrrrrrrrrrr", r);
                    if (r) {
//                            nw.dialog("¡Parada confirmada exitosamente!");
                        self.paradasAdicionales();
                        nw.remove(".vista_parada");
                        if (typeof self.markerParada !== 'undefined') {
                            nwgeo.removeMarker(self.markerParada);
                        }
                        nwgeo.centerMap(self.map, self.marker1, self.marker2);
                        console.log("self.polylineParadaAdd", self.polylineParadaAdd);
                        self.cleanParadasPoly();

                        main.registerServiceInFirebase(parada.id_servicio);

                    }
                };
                rpc.exec("actualizaParada", parada, func);
//                });
            }
        },
        markerParadas: function markerParadas(parada) {
            var self = this;

            var lat = parseFloat(parada.latitud_parada);
            var lng = parseFloat(parada.longitud_parada);
            var marker1 = new nwgeo.addMarker();
            marker1.map = self.map;
            marker1.latitude = lat;
            marker1.longitude = lng;
            marker1.title = parada.direccion;
            marker1.label = "";
            marker1.icon = config.domain_rpc + config.carpet_files_extern + "img/ubicacion-usuario.png";
            if (nw.evalueData(config.iconDriverPuntoB)) {
                marker1.icon = config.iconDriverPuntoB;
            }
            marker1.draggable = false;
            marker1.animation = true;
            marker1.rotation = self.deviceRotation;
            self.markerParada = marker1.show(function () {
//                nwgeo.centerMap(self.map, self.markerParada, self.marker1);
            });

            nwgeo.centerMap(self.map, self.marker1, self.markerParada);


//            self.centerUbication();
            setTimeout(function () {
                var animate = "center"; // true false center
                var zoom = false;
                var multiplePoints = true;
                var bounds = [
                    {"lat": self.positionConductor.lat, "lng": self.positionConductor.lng},
                    {"lat": parseFloat(parada.latitud_parada), "lng": parseFloat(parada.longitud_parada)}
                ];
                nwgeo.centerMap(self.map, self.markerParada, self.marker1, zoom, bounds, multiplePoints, animate);
            }, 2000);

            /*
             var coords = {lat2: lat, lng2: lng, lat: self.geo.latitude, lng: self.geo.longitude};
             var multipleCoords = true;
             var animateOrCenter = "animate"; //center animate nothing
             var onlyGetData = false;
             var func_one = function (response) {
             console.log("response", response);
             nwgeo.centerMap(self.map, self.markerParada, self.marker1);
             };
             var funcGetNamePoly = function (polyline) {
             console.log("polyline", polyline)
             self.__polyParadas.push(polyline);
             };
             var polyLineName = false;
             var removeAllPolys = false;
             var color = self.ColorCode();
             nwgeo.addLineStreet(self.map, coords, func_one, color, onlyGetData, animateOrCenter, multipleCoords, polyLineName, removeAllPolys, funcGetNamePoly);
             */
        },
        __polyParadas: new Array(),
        cleanParadasPoly: function cleanParadasPoly() {
            var self = this;

            nwgeo.removeAllPolyLines(self.__polyParadas);

//            if (nw.evalueData(self.polylineParadaAdd)) {
//                nwgeo.removePolyLine(self.polylineParadaAdd);
//            }
//            delete self.polylineParadaAdd;
        },
        dataByBooking: function dataByBooking(estado) {
            var self = this;
            var data = {};
            data = self.data_service;
            data.config = self.configCliente;
            data.estado_nuevo = estado;
            data.latitude = nwgeo.latitude;
            data.longitude = nwgeo.longitude;
            return data;
        },
        ColorCode: function ColorCode() {
            var makingColorCode = '0123456789ABCDEF';
            var finalCode = '#';
            for (var counter = 0; counter < 6; counter++) {
                finalCode = finalCode + makingColorCode[Math.floor(Math.random() * 16)];
            }
            return finalCode;
        },
        getTimeToCoords: function getTimeToCoords(lat1, lon1, lat2, lon2, callback) {
            var self = this;
            var coords = {lat: lat1, lng: lon1, lat2: lat2, lng2: lon2};
            var func_one = function (response) {
                callback(response);
            };
            var onlyGetData = true;
            self.lineNotify = nwgeo.addLineStreet(self.map, coords, func_one, "#dc471e", onlyGetData);
        },
        getDistanceToCoords: function getDistanceToCoords(lat1, lon1, lat2, lon2) {
            function _deg2rad(deg) {
                return deg * (Math.PI / 180);
            }
            var R = 6378137; // Radius of the earth in km
            var dLat = _deg2rad(lat2 - lat1); // deg2rad below
            var dLon = _deg2rad(lon2 - lon1);
            var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(_deg2rad(lat1)) * Math.cos(_deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d.toFixed(3);
        },
        removeMapaDeCalorService: function removeMapaDeCalorService() {
            var self = this;
            if (nwgeo.native) {
                var t = self.markersCalor.length;
                for (var i = 0; i < t; i++) {
                    nwgeo.removeMarker(self.markersCalor[i]);
                }
                return true;
            }
            var map = self.map;
            if (self.heatmap) {
                self.heatmap.setMap(null);
                self.heatmap = false;
            }
        },
        mapaDeCalorService: function mapaDeCalorService() {
            var self = this;
            if (self.heatmap == false) {
                var up = nw.userPolicies.getUserData();
                var servicios = JSON.parse(up.servicios_activos);
                var data = {};
                data.empresa = up.empresa;
                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                rpc.setAsync(true);
                rpc.setLoading(false);
                self.markersCalor = [];
                var func = function (r) {
//                    if (nwgeo.native) {
                    for (var i = 0; i < r.length; i++) {
                        var row = r[i];
                        self.markersCalor[i] = self.map.addMarker({
                            position: {
                                lat: row.latitudOri,
                                lng: row.longitudOri
                            },
                            'icon': {
                                'url': config.domain_rpc + config.carpet_files_extern + '/img/calor1.png'
                            },
                            scale: 0.5,
                            offset: '15%',
                            strokeColor: '#000000',
                            strokeWeight: 0.3,
                            fillColor: "#f15228",
                            fillOpacity: 1,
                            anchor: new google.maps.Point(0, 5),
                            rotation: 0
                        });
                    }
                    return true;
//                    }
                    /*
                     var heatmapData = [];
                     if (r) {
                     if (r.length > 0) {
                     for (var i = 0; i < r.length; i++) {
                     var row = r[i];
                     for (var j = 0; j < servicios.length; j++) {
                     if (servicios[j].id === row.servicio) {
                     var pos = {location: new google.maps.LatLng(row.latitudOri, row.longitudOri), weight: 20};
                     heatmapData.push(pos);
                     }
                     }
                     }
                     }
                     }
                     console.log("heatmapData", heatmapData);
                     if (self.heatmap == false) {
                     self.heatmap = new google.maps.visualization.HeatmapLayer({
                     data: heatmapData,
                     radius: 40,
                     //                    gradient: ['rgba(0, 255, 255, 0)',
                     //                        'rgba(0, 0, 255, 1)',
                     //                        'rgba(0, 0, 223, 1)',
                     //                        'rgba(0, 0, 191, 1)',
                     //                        'rgba(251, 214, 42, 0.98)',
                     //                        'rgba(245, 213, 62, 0.86)',
                     //                        'rgba(239, 211, 77, 0.72)',
                     //                        'rgba(127, 0, 63, 1)',
                     //                        'rgba(191, 0, 31, 1)',
                     //                        'rgba(255, 0, 0, 1)']
                     });
                     console.log("self.heatmap", self.heatmap)
                     self.heatmap.setMap(self.map);
                     }
                     */
//                var trafficLayer = new google.maps.TrafficLayer();
//                trafficLayer.setMap(map);
                };
                rpc.exec("consultaTotalServicios", data, func);
            }
        },
        cerrarNotificionMain: function cerrarNotificionMain() {
            var self = this;
            self.activeNormal();
//            nwgeo.removeAllPolyLines();
            self.LimpiarTodo();
            self.cleanMarkerTwo();
            self.initIntervalo();
        },
        useWaze: function useWaze() {
            var self = this;
            var latitud = self.latitudDestino;
            var logitud = self.longitudDestino;
            $(".btn_waze").remove();
            var cla = "";
            if (self.cancela_conductor == true) {
                cla = "parent_btn_waze";
            }
            var b = document.createElement("div");
            b.className = "btn_waze " + cla;
            b.innerHTML = "<i class='material-icons'>navigation</i> <span>" + nw.tr("Navegar") + "</span>";
            b.data = {
                latitud: latitud,
                logitud: logitud
            };
            b.onclick = function () {
                var opts = {};
                opts.latitude = this.data.latitud;
                opts.longitude = this.data.logitud;
                opts.mode = "waze,googleMaps";
                nw.launchNavigatorUbication(opts);
            };
            document.querySelector('.grupo_nueva_solicitud').appendChild(b);

            self.useMoreInfoInTravel();
            if (self.configCliente.informacion_primer_conductor == "SI") {
                self.useMoreInformation();
            }
        },
        useMoreInfoInTravel: function useMoreInfoInTravel() {
            var self = this;
            $(".btn_more_info_intravel").remove();
            var b = document.createElement("div");
            b.className = "btn_more_info_intravel";
            b.innerHTML = "<i class='material-icons'>more_vert</i> <span>" + nw.tr("Más info") + "</span>";
            b.onclick = function () {

                var html = "<div class='containMoreInfo'>";
                html += "<h3>Seleccione la opción que desea ampliar del servicio</h3>";
                html += "<div class='listoMoreInfo'></div>";
                html += "</div>";
                var s = nw.dialog(html, false, false, {original: true, textAccept: "Volver"});
                console.log("s", s);

                if (main.configCliente.ver_voucher === "SI") {
                    var bt = document.createElement("div");
                    bt.className = "rowMoreInfoLIst";
                    bt.innerHTML = nw.utils.tr("Ver voucher");
                    bt.onclick = function () {
                        console.log("self.data_service", self.data_service);
                        main.imprimir("VER_VOUCHER", self.data_service.id);
                    };
                    s.querySelector(".listoMoreInfo").appendChild(bt);
                }

                if (main.configCliente.ver_cartel_vuelo === "SI") {
                    var bt = document.createElement("div");
                    bt.className = "rowMoreInfoLIst";
                    bt.innerHTML = nw.utils.tr("Ver cartel de vuelo");
                    bt.onclick = function () {
                        console.log("self.data_service", self.data_service);
                        main.imprimir("CARTEL_VUELO", self.data_service.id);
                    };
                    s.querySelector(".listoMoreInfo").appendChild(bt);
                }
                if (main.configCliente.pide_fuec == "SI") {
                    var bt = document.createElement("div");
                    bt.className = "rowMoreInfoLIst";
                    bt.innerHTML = nw.utils.tr("Ver FUEC");
                    bt.onclick = function () {
                        console.log("self.data_service", self.data_service);
                        main.verFuec(self.data_service);
                    };
                    s.querySelector(".listoMoreInfo").appendChild(bt);
                }

                var bt = document.createElement("div");
                bt.className = "rowMoreInfoLIst";
                bt.innerHTML = nw.utils.tr("Ampliar");
                bt.onclick = function () {
                    console.log("self.data_service", self.data_service);
                    main.ampliar(self.data_service);
                    s.remove();
                };
                s.querySelector(".listoMoreInfo").appendChild(bt);

                var bt = document.createElement("div");
                bt.className = "rowMoreInfoLIst";
                bt.innerHTML = nw.utils.tr("Paradas o pasajeros");
                bt.onclick = function () {
                    console.log("self.data_service", self.data_service);
                    main.editaParadasAdicionales(self.data_service, "PASADOS");
                    s.remove();
                };
                s.querySelector(".listoMoreInfo").appendChild(bt);

            };
            document.querySelector('.grupo_nueva_solicitud').appendChild(b);
        },
        useVoucherInTravel: function useVoucherInTravel() {
            var self = this;
            $(".btn_more_info_intravel").remove();
            var b = document.createElement("div");
            b.className = "btn_more_info_intravel";
            b.innerHTML = "<i class='material-icons'>more_vert</i> <span>" + nw.tr("Más info") + "</span>";
            b.onclick = function () {

            };
            document.querySelector('.grupo_nueva_solicitud').appendChild(b);
        },
        useChat: function useChat() {
            var self = this;

            self.creatBtnVerPasajeros();

            if (main.configCliente.mostrar_chat_a_conductor_de_pax_principal == "NO") {
                return false;
            }
            var btn_chat = document.querySelector('.btn_chat');
            if (!btn_chat) {
                var div = document.createElement('div');
                div.innerHTML = '<i class="material-icons">chat_bubble</i>';
                div.className = 'btn_chat btn_chat_initservice';
                div.onclick = function () {
//                    nw.inactivateBackgroundMode();
                    var d = new f_chat();
                    d.construct(self.data_service);
                };
                var cont = document.querySelector('.containChatCallCliente');
                if (cont) {
                    cont.appendChild(div);
                } else {
                    setTimeout(function () {
                        self.useChat();
                    }, 2000);
                }
            }
        },
        creatBtnVerPasajeros: function creatBtnVerPasajeros() {
            var self = this;
            if (main.configCliente.mostrar_boton_ver_pasajeros_a_conductor_en_pax_principal != "SI") {
                return false;
            }
            var btn_chat = document.querySelector('.btn_pasajeros');
            if (!btn_chat) {
                var div = document.createElement('div');
                div.innerHTML = '<i class="material-icons">group</i>';
                div.className = 'btn_pasajeros btn_pasajeros_initservice';
                div.onclick = function () {
                    console.log("self.data_service", self.data_service);
                    main.editaParadasAdicionales(self.data_service);
                };
                var cont = document.querySelector('.containChatCallCliente');
                if (cont) {
                    cont.appendChild(div);
                } else {
                    setTimeout(function () {
                        self.creatBtnVerPasajeros();
                    }, 2000);
                }
            }
        },
        useMoreInformation: function useMoreInformation() {
            var self = this;
            var btn_chat = document.querySelector('.btn_more_info');
            if (!btn_chat) {
                var div = document.createElement('div');
                div.innerHTML = '<i class="material-icons">group</i>';
                div.className = 'btn_more_info btn_more_info_initservice';
                div.onclick = function () {
                    console.log("self.data_service", self.data_service);
                    main.ampliar(self.data_service);
                };
                var cont = document.querySelector('.containChatCallCliente');
                if (cont) {
                    cont.appendChild(div);
                } else {
                    setTimeout(function () {
                        self.useMoreInformation();
                    }, 2000);
                }
            }
        },
        ponerOnOffline: function ponerOnOffline(mode, consult) {
            var self = this;
            var d = new f_ponerOnOffline();
            d.construct(self, mode, consult);
        },
        createMapa: function createMapa(callback) {
            var self = this;
            var d = new f_0_createMapa();
            d.construct(self, callback);
        },
        enableOrientationArrow: function enableOrientationArrow() {
            var self = this;
            var promise = FULLTILT.getDeviceOrientation({'type': 'world'});
            promise.then(function (deviceOrientation) {
                deviceOrientation.listen(function () { // Get the current *screen-adjusted* device orientation angles 
                    var currentOrientation = deviceOrientation.getScreenAdjustedEuler();
                    var compassHeading = 360 - currentOrientation.alpha;
                    self.deviceRotation = compassHeading;
                    if (nw.evalueData(self.marker1)) {
                        self.marker1.setRotation(self.deviceRotation);
                    }
//                    if (self.map !== null) {
//                        self.map.setCameraBearing(self.deviceRotation);
//                    }
                });
            }).catch(function (errorMessage) {
                console.log(errorMessage);
            });
//            if (window.DeviceOrientationEvent) {
//
//                window.addEventListener("compassneedscalibration", function (event) {
//                    console.log('Your compass needs calibrating! Wave your device in a figure-eight motion');
//                    event.preventDefault();
//                }, true);
//
//                window.addEventListener('deviceorientation', function (event) {
//                    var compassdir = null;
//                    if (event.webkitCompassHeading) {
//                        compassdir = event.webkitCompassHeading;
//                    } else {
//                        compassdir = event.alpha;
//                    }
//                    self.deviceRotation = 360 - compassdir;
//                    console.log("event", event)
//                    console.log("compassdir", compassdir)
//                    console.log("self.deviceRotation", self.deviceRotation)
////                if (nw.evalueData(self.marker1)) {
////                    self.marker1.setRotation(compassdir);
////                }
//                    if (self.map !== null) {
//                        self.map.setCameraBearing(self.deviceRotation);
//                    }
//                });
//            }
        },
        eventsDrag: function eventsDrag() {
            var self = this;
            nwgeo.dragMap("dragstart", self.map, function (e) {
                self.drag = true;
                if (typeof self.timeDrag !== 'undefined') {
                    clearTimeout(self.timeDrag);
                    delete self.timeDrag;
                }
            });
            nwgeo.dragMap("dragend", self.map, function (e) {
                self.timeDrag = setTimeout(function () {
                    self.drag = false;
                }, 1000);
            });
        },
        initialMyUbication: function initialMyUbication() {
            var self = this;
            self.setMyUbication();
//            setTimeout(function () {
//            nwgeo.getMapLocation(function (pos) {
//                if (typeof pos.latLng === 'undefined') {
//                    self.positionConductor = {lat: pos.coords.latitude, lng: pos.coords.longitude};
//                    config.latitud = pos.coords.latitude;
//                    config.longitud = pos.coords.longitude;
//                } else {
//                    self.positionConductor = pos.latLng;
//                    config.latitud = pos.latLng.lat;
//                    config.longitud = pos.latLng.lng;
//                }
            self.positionConductor = {lat: nwgeo.latitude, lng: nwgeo.longitude};
            config.latitud = nwgeo.latitude;
            config.longitud = nwgeo.longitude;

            self.iniciarWatchPosition();
//            nw.activeLatsConnect(true);
            // trae la ciudad
            nwgeo.api_geocodeInverse(nwgeo.latitude, nwgeo.longitude, function (r) {
//                nw.nativeGeoCoder(nwgeo.latitude, nwgeo.longitude, function (r) {
//                    if (r !== false && typeof r.error === "undefined") {
//                    config.ciudad_text = r.allData.locality;
                config.ciudad_text = r.locality;
//                    }
            });
//            });
//            }, 500);
        },
        setMyUbication: function setMyUbication() {
            var self = this;
            self.geo.latitude = self.positionConductor.lat;
            self.geo.longitude = self.positionConductor.lng;
            self.geo.latitudOri = self.positionConductor.lat;
            self.geo.longitudOri = self.positionConductor.lng;
            self.markerMyUbication();
        },
        markerMyUbication: function markerMyUbication() {
            var self = this;
            var marker = new nwgeo.addMarker();
            marker.map = self.map;
            marker.latitude = self.geo.latitude;
            marker.longitude = self.geo.longitude;
            marker.title = "";
            marker.label = "";
            marker.icon = config.domain_rpc + config.carpet_files_extern + "img/normal1.png";
            if (nw.evalueData(config.iconDriverMap)) {
                marker.icon = config.iconDriverMap;
            }
//            marker.icon = config.domain_rpc + config.carpet_files_extern + "img/pindriver_1_35.png";
//            marker.icon = config.domain_rpc + config.carpet_files_extern + "img/normal2.png";
            marker.draggable = false;
            marker.animation = true;
            marker.rotation = self.deviceRotation;
            self.marker1 = marker.show(function () {
                nw.loadingRemove();
            });
        },
        iniciarWatchPosition: function iniciarWatchPosition() {
            var self = this;
//            var op = 2;
//            self.intervalosParaMensaje = 10;
//            self.countMensajes = 1;
//            self.lastEnvioMensaje = 0;
//            setInterval(function () {
//                self.countMensajes++;
//            }, 1000);

            clearInterval(self.interIframeSend);
            self.numIntSet = 0;
            self.interIframeSend = setInterval(function () {
                self.numIntSet++;
            }, 1000);
            var op = 1;
            if (op === 1) {
                nwgeo.watchMapPosition(function (position) {
                    self.execPositionMove(position);
                });
                return true;
            }
            setInterval(function () {
                //                if (nw.workInBackgroundMode === true) {
                //                    return false;
                //                }
                nwgeo.getLatitudLongitud(function (position) {
                    self.execPositionMove(position);
                });
            }, 5000);
        },
        execPositionMove: function execPositionMove(position) {
            var self = this;
            if (self.numIntSet > 5) {
                self.numIntSet = 0;
                var up = nw.userPolicies.getUserData();
                var sendPos = {};
                sendPos.lat = position.coords.latitude;
                sendPos.lng = position.coords.longitude;
                sendPos.id = up.id_usuario;
                sendPos.usuario = up.usuario;
                sendPos.empresa = up.empresa;
                sendPos.perfil = up.perfil;
                sendPos.ciudad = config.ciudad_text;
                sendPos.nombre = up.nombre;
                sendPos.apellido = up.apellido;
                sendPos.nit = up.nit;
                sendPos.placa = self.vehiculo.placa;
                sendPos.up = {};
                sendPos.up.nit = up.nit;
                sendPos.up.nombre = up.nombre;
                sendPos.up.apellido = up.apellido;
                config.latitud = sendPos.lat;
                config.longitud = sendPos.lng;
                sendDataPosition = true;
                if (self.debug) {
                    console.log("PPPPP self.positionConductor", sendPos.lat + ", " + sendPos.lng);
                }
                self.positionConductor = sendPos;
                self.geo.latitude = sendPos.lat;
                self.geo.longitude = sendPos.lng;
//            if (self.debug) {
//                console.log("self.countMensajes", self.countMensajes)
//                console.log("self.lastEnvioMensaje", self.lastEnvioMensaje)
//            }
//            if (self.countMensajes >= self.lastEnvioMensaje) {
//                self.sendMsgFrameConductor();
//                self.lastEnvioMensaje = self.countMensajes + self.intervalosParaMensaje;
//            }
                if (self.serviceActive === true) {
//                if (self.countMensajes >= self.lastEnvioMensaje) {
                    if (self.debug) {
                        console.log("SENDDDDDD sendMsgFrame");
                    }
                    self.sendMsgFrame();
//                }
                }
                if (nw.workInBackgroundMode === false) {
                    nwgeo.setPositionMarker(self.marker1, self.positionConductor.lat, self.positionConductor.lng);
//                    self.marker1.setPosition(new google.maps.LatLng(self.positionConductor.lat, self.positionConductor.lng));
                    if (self.serviceActive != true) {
                        self.centerUbication();
                    }
                }
            }
        },
        centerUbication: function centerUbication() {
            var self = this;
            if (self.serviceActive === true) {
                if (self.drag == false) {
//                    var animate = true;
//                    var zoom = false;
//                    var bounds = [
//                        {lat: self.positionConductor.lat, lng: self.positionConductor.lng},
//                        {lat: self.latitudDestino, lng: self.longitudDestino}
//                    ];
//                    var multiplePoints = true;
//                    nwgeo.centerMap(self.map, self.marker1, false, zoom, bounds, multiplePoints, animate);

                    nwgeo.centerMap(self.map, self.marker1, self.marker2);

                }
            } else {
                if (self.drag == false) {
//                    var animate = false;
//                    var zoom = false;
//                    var bounds = [
//                        {"lat": self.positionConductor.lat, "lng": self.positionConductor.lng}
//                    ];
//                    var multiplePoints = false;
//                    nwgeo.centerMap(self.map, self.marker1, false, zoom, bounds, multiplePoints, animate);

                    nwgeo.centerMap(self.map, self.marker1);

                }
            }
        },
        cleanMarkerTwo: function cleanMarkerTwo() {
            var self = this;
            if (nw.evalueData(self.marker2)) {
                nwgeo.removeMarker(self.marker2);
            }
        },
        removeLine: function removeLine() {
            var self = this;
            if (nw.evalueData(self.line)) {
                nwgeo.removeLine(self.line);
            }
        },
        initIntervalo: function initIntervalo() {
            var self = this;
            self.clearIntervalo();
            if (self.status !== "activo") {
                return false;
            }
            self.totalSolicitudesServer = 0;
            self.searchServiceSolicitud(function () {
                if (self.debugConstruct) {
                    console.log("Buscando servicios...", self.timeIntervaloSearchServices);
                }
                var num = 0;
                self.intervalSearchCount = setInterval(function () {
                    num++;
                    if (self.debugConstruct) {
                        console.log("Buscando servicios", num);
                    }
                }, 1000);
                self.interval = setTimeout(function () {
                    self.clearIntervalo();
                    self.initIntervalo();
                }, self.timeIntervaloSearchServices);
            });
//            self.searchServiceSolicitud();
//            self.interval = setInterval(function () {
//                self.searchServiceSolicitud();
//            }, self.timeIntervaloSearchServices);
        },
        clearIntervalo: function clearIntervalo() {
            var self = this;
            clearTimeout(self.interval);
            clearInterval(self.interval);
            clearInterval(self.intervalSearchCount);
            clearTimeout(self.intervalSearchCount);
        },
        initIntervaloService: function initIntervaloService() {
            var self = this;
            if (main.configCliente.usa_firebase == "SI") {
                return;
            }
            self.clearIntervaloInService();
            self.validaServiceActive(true, function () {
                if (self.debugConstruct) {
                    console.log("Validando servicio activo si cambia o es cancelado o modificado por admin o user en ", self.timeToValideServiceActive);
                }
                var num = 0;
                self.intervalServiceCount = setInterval(function () {
                    num++;
                    if (self.debugConstruct) {
                        console.log("Validando servicio activo", num);
                    }
                }, 1000);
                self.intervalService = setTimeout(function () {
                    self.clearIntervaloInService();
                    self.initIntervaloService();
                }, self.timeToValideServiceActive);
            });
        },
        clearIntervaloInService: function clearIntervaloInService() {
            var self = this;
            clearTimeout(self.intervalService);
            clearTimeout(self.intervalServiceCount);
            clearInterval(self.intervalService);
            clearInterval(self.intervalServiceCount);
        },
        constructServiceSolicitud: function constructServiceSolicitud(r) {
            var self = this;
            var d = new f_constructServiceSolicitud();
            d.construct(self, r);
        },
        tiempoPagos: function tiempoPagos() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var conf = self.configCliente;
            console.log("conf", conf);
            console.log("conf.saldo_minimo_para_tomar_servicios_conductor", conf.saldo_minimo_para_tomar_servicios_conductor);
            if (nw.evalueData(conf.saldo_minimo_para_tomar_servicios_conductor) && config.usaRecargas === true) {
                if (parseFloat(up.saldo) < 0) {
                    if (!isNaN(parseInt(conf.dias_maximo_pago))) {
                        var fecha_actual = new Date();
                        fecha_actual.setDate(fecha_actual.getDate() - parseInt(conf.dias_maximo_pago));
                        if (nw.evalueData(up.fecha_ultimo_pago)) {
                            var fecha_ultimo_pago = new Date(up.fecha_ultimo_pago);
                            if (fecha_ultimo_pago < fecha_actual) {
                                if ((parseFloat(up.saldo) * (-1)) > (parseInt(conf.tope_maximo_pago))) {
                                    nw.dialog("No hemos registrado tu ultimo pago", function () {
                                        main.slotRecargas();
                                    });
                                    return false;
                                }
                            }
                        }
                    }
                    if ((parseFloat(up.saldo) * (-1)) > (parseInt(conf.tope_maximo_pago))) {
                        nw.dialog("Has excedido el tope maximo, por favor recarga para continuar trabajando.", function () {
                            main.slotRecargas();
                        });
                        return false;
                    }
                }
            }
            return true;
        },
        inactiveVehiculo: function inactiveVehiculo() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var vhei = self.vehiculo;
//            console.log(vhei);
//            return;
            if (typeof vhei.id === 'undefined') {
                return false;
            }
            var data = {};
            data.id = up.id_usuario;
            data.id_vehiculo = vhei.id;
            data.usuario = up.usuario;
            data.tipo = "ahora";
            data.empresa = up.empresa;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                if (r) {
                    nw.dialog("El vehículo se ha inactivado por vencimiento de soat actualiza los datos de tu vehiculo.", function () {
                        window.location.reload();
                    });
                }
            };
            rpc.exec("inactiveVehiculo", data, func);
        },
        validaSoatVigente: function validaSoatVigente() {
            var self = this;
            var d = new f_validaSoatVigente();
            d.construct(self);
        },
        addRechazadoServiceMostrado: function addRechazadoServiceMostrado(id) {
            var self = this;
            self.idServicesMostrados.push(id);
            console.log("self.idServicesMostrados", self.idServicesMostrados);
            window.localStorage.setItem("addRechazadoServiceMostrado", JSON.stringify(self.idServicesMostrados));
        },
        searchServiceMostrado: function searchServiceMostrado(id) {
            var self = this;
            for (var i = 0; i < self.idServicesMostrados.length; i++) {
                var ra = self.idServicesMostrados[i];
                if (ra.id === id) {
                    return false;
                }
            }
            return true;
        },
        searchServiceRechazado: function searchServiceRechazado(id) {
            var self = this;
            for (var i = 0; i < self.idServicesRechazados.length; i++) {
                var ra = self.idServicesRechazados[i];
                if (ra === id) {
                    return false
                }
            }
            return true;
        },
        cleanServiceSolicitud: function cleanServiceSolicitud() {
            var self = this;
            self.data_service = false;
            self.id_service = false;
            self.ui.grupo_nueva_solicitud.setVisibility(false);
            self.ui.rechazar_pedido_driver.setVisibility(false);
            self.ui.aceptar_pedido_driver.setVisibility(false);
            self.ui.tiempo_estimado.setVisibility(false);
        },
        searchServiceSolicitud: function searchServiceSolicitud(callback) {
            var self = this;
            var d = new f_searchServiceSolicitud();
            d.construct(self, callback);
        },
        validaServiceActive: function validaServiceActive(action, callback, datafirebase) {
            var self = this;
            var d = new f_validaServiceActive();
            d.construct(self, action, callback, datafirebase);
        },
        resolveStatus: function resolveStatus() {
            var self = this;
            var d = new f_resolveStatus();
            d.construct(self);
        },
        LimpiarTodo: function LimpiarTodo() {
            var self = this;
            self.reziseNormalMap();
            self.clearIntervaloInService();
            console.log("se limpia");
            self.frameChat = null;
            var isframe = document.querySelector('.framechat');
            if (isframe) {
                isframe.remove();
            }
            var query = document.querySelector(".mapIframe");
            if (query) {
                $(".mapIframe").remove();
            }
            var waze = document.querySelector(".btn_waze");
            if (waze) {
                $('.btn_waze').remove();
            }
            self.serviceActive = false;
            nwgeo.removeAllPolyLines();
            self.trazaLineaCreada = false;
        },
        htmlDataCliente: function htmlDataCliente(title, tel) {
            var self = this;
            var r = self.data_service;
            var foto_origin = config.domain_rpc + "/nwlib6/icons/personb1.svg";
            var foto = foto_origin;
            var fotoclass = "";
            console.log("rrrrrrrrrrrrrrrrr", r);
            if (nw.evalueData(r.cliente_foto)) {
                foto_origin = config.domain_rpc + r.cliente_foto;
                foto = config.domain_rpc + nw.utils.getFileByType(r.cliente_foto, 100);
                fotoclass = "foto_cliente_existe";
            }
            var name = "Pasajero";
            if (nw.evalueData(r.cliente_nombre)) {
                name = r.cliente_nombre;
            }
            if (nw.evalueData(r.vuelo_numero)) {
                name += "<br /><span class='numerovuelospan'>Vuelo " + r.vuelo_numero + "</span>";
            }
            if (nw.evalueData(r.observaciones_servicio)) {
                name += "<br /><span class='numerovuelospan'>" + r.observaciones_servicio + "</span>";
            }

            var h = "";
            h += "<div class='containInfoDriver'>";

            h += "<div class='containDataForClienteContain'>";
            h += "<div class='InfoDriverPhotoAndTitle'>";
            h += "<div class='nameDriver'><span data='" + foto_origin + "' class='cliente_foto " + fotoclass + "' style='background-image: url(" + foto + ");'></span>";
            h += "<span class='namecliente'>" + name + "</span>";
            h += "</div>";
            h += "<div class='containerPuntajeConductorSpan'>";
            h += self.showStarsCliente();
            var indicativo = "57";
            if (nw.evalueData(config.indicativo)) {
                indicativo = config.indicativo;
            }
            h += "</div>";
            h += "<div class='InfoIdService' style='color: #656363;text-align: left;font-size: 14px;'>ID: " + r.id + "</div>";
            h += "</div>";
            h += "<div class='InfoDriverPlacasEtc'>";
            h += "<div class='titleInfoDriver'>" + title + "</div>";
            h += "</div>";
            h += "</div>";

            //containChatCallCliente
            h += "<div class='containChatCallCliente'>";
            if (main.configCliente.telefono_pasajero_visible_para_conductor !== "NO" && main.configCliente.mostrar_telefono_a_conductor_de_pax_principal != "NO") {
                if (typeof tel === 'undefined') {
                    h += "<div class='Infotel btninfo_tel'>";
                    h += "<i class='material-icons'>local_phone</i>";
                    h += "<a href='tel:+" + indicativo + " " + r.celular + "'/>";
                    h += "</div>";
                }
            }
            h += "<div class='Infotel btninfo_problem' id='novelty'>";
            h += "<i class='material-icons'>report_problem</i>";
            h += "</div>";
            h += "</div>";
            //containChatCallCliente
            h += "</div>";
            return h;
        },
        showStarsCliente: function showStarsCliente(callBack) {
            var self = this;
            var r = self.data_service;
            var puntaje = r.puntaje;
            if (!puntaje) {
                puntaje = 0;
            }
            var dataPuntaje = "";
            dataPuntaje += "<span class='puntajeClienteSpan'> <span style='color:#656363; margin-right: 4px;'>" + puntaje + "</span>";
            var glob = 5;
            var prome = Math.round(parseFloat(puntaje));
            for (var i = 0; i < glob; i++) {
                if (prome > i) {
                    dataPuntaje += "<i class='material-icons' style='color: #e04935;'>star</i>";
                } else {
                    dataPuntaje += "<i class='material-icons'>star_border</i>";
                }
            }
            dataPuntaje += "</span>";
            return dataPuntaje;
        },
        precio_viaje: function precio_viaje() {
            var self = this;
            self.ui.grupo_nueva_solicitud.setVisibility(true);
            self.ui.rechazar_pedido_driver.setVisibility(false);
            self.ui.aceptar_pedido_driver.setVisibility(false);
            self.ui.tiempo_estimado.setVisibility(false);
            self.ui.confirmar_llegada.setVisibility(false);
            self.ui.confirmar_abordaje.setVisibility(false);
            self.ui.precio_viaje.setVisibility(false);
            self.ui.cobrar.setVisibility(true);
            self.ui.finalizar_viaje.setVisibility(false);
            self.ui.html_grupo_nueva_solicitud.setValue("Escriba el precio del viaje:<br /> ");
            self.ui.precio_viaje.setVisibility(true);
            self.ui.precio_viaje.focus();
        },
        trazaLinea: function trazaLinea(centrar, crear) {
            var self = this;
            if (self.trazaLineaCreada && nw.evalueData(crear) === false) {
                return false;
            }
            self.reziseMap();
//            var func_one = function (response) {
//                self.tiempo_estimado = response[0].legs[0].duration.text;
            if (centrar) {
                nwgeo.centerMap(self.map, self.marker1, self.marker2);
            }
//            };
//            var coords = {lat: self.geo.latitude, lng: self.geo.longitude, lat2: self.latitudDestino, lng2: self.longitudDestino};
//            self.line = nwgeo.addLineStreet(self.map, coords, func_one);
            self.pintarLinea();
            self.trazaLineaCreada = true;
        },
        pintarLinea: function pintarLinea(creapoly) {
            var self = this;
            nwgeo.centerMap(self.map, self.marker1, self.marker2);
            self.centerUbication();
            /*
             var func_one = function (response) {
             //                var animate = true;
             //                var zoom = false;
             //                var bounds = [
             //                    {lat: self.geo.latitude, lng: self.geo.longitude},
             //                    {lat: self.latitudDestino, lng: self.longitudDestino}
             //                ];
             //                var multiplePoints = true;
             //                nwgeo.centerMap(self.map, self.marker1, false, zoom, bounds, multiplePoints, animate);
             //                self.tiempo_estimado = response[0].legs[0].duration.text;
             //                nwgeo.centerMap(self.map, self.marker1, self.marker2);
             self.centerUbication();
             };
             var coords = {lat2: self.latitudDestino, lng2: self.longitudDestino, lat: self.geo.latitude, lng: self.geo.longitude};
             var multipleCoords = true;
             var animateOrCenter = "animate"; //"nothing"
             var onlyGetData = false;
             if (creapoly === true) {
             self.polylineRuta = nwgeo.addLineStreet(self.map, coords, func_one, "#dc471e", onlyGetData, animateOrCenter, multipleCoords);
             } else {
             self.centerUbication();
             }
             //            self.line = nwgeo.addLineStreet(self.map, coords, func_one);
             */
        },
        saveAcceptService: function saveAcceptService(ra) {
            var self = this;
            var d = new f_saveAcceptService();
            d.construct(self, ra);
        },
        widgetTwoHours: function widgetTwoHours() {
            var self = this;
            //comentado por alexf 10may2023 depreciado
//            var tiempo = 60000 * 30;//cada 30 minutos
//            if (self.__intvHours == false) {
//                self.__intvHours = setInterval(function () {
//                    self.ui.save_state.setVisibility(true);
//                    self.ui.state_travel.setVisibility(true);
//                    document.querySelector("#widget_hours").style = "display: block";
//                }, tiempo);
//            }
        },
        clearIntvHours: function clearIntvHours() {
            var self = this;
            clearInterval(self.__intvHours);
            self.removeStateTravel();
        },
        removeStateTravel: function removeStateTravel() {
            var self = this;
            self.ui.save_state.setVisibility(false);
            self.ui.state_travel.setVisibility(false);
            self.ui.state_travel.setValue("");
            document.querySelector("#widget_hours").style = "display: none";
        },
        sendMsgFrameCancel: function sendMsgFrameCancel(data) {
            var self = this;
            if (nw.evalueData(self.frameChat)) {
                var m = {};
                m.tipo = "send_message_ringow";
                m.message = "CANCELADO_DRIVER";
                console.log("self.frameChat", self.frameChat);
                self.frameChat.contentWindow.postMessage(m, '*');
                nw.dialog(nw.tr("Servicio cancelado, el coste de cancelación es de") + " " + data.recargo + " " + config.moneda, function () {
                    self.userCancelaService(true);
                });
            }
        },
        sendMsgFrame: function sendMsgFrame() {
            var self = this;
            if (self.frameChat === null) {
                return false;
            }
            self.positionConductor.rotation = self.deviceRotation;
            var msg = JSON.stringify(self.positionConductor);
            console.log("msg", msg)
            var m = {};
            m.tipo = "send_message_ringow";
            m.message = msg;
            self.frameChat.contentWindow.postMessage(m, '*');
            self.trazaLinea();
        },
        framePosition: function framePosition() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var d = document.querySelector(".mapIframe");
            if (!d) {
                self.serviceActive = true;
                self.frameChat = document.createElement("iframe");
                self.frameChat.className = "mapIframe";
                self.frameChat.style = "position:fixed;top:0;left:0;width:100%;height:150px;z-index:1000000;display:none;";
//                self.frameChat.src = config.domain_rpc + "/nwlib6/nwproject/modules/webrtc/v4/index.html?myID=" + up.id_usuario + "&onlyChat=true&room=movilmove_number_" + self.id_service;
                self.frameChat.src = "nwlib6/nwproject/modules/webrtc/v4/index.html?myID=" + up.id_usuario + "&onlyChat=true&room=movilmove_number_" + self.id_service + "&domain=" + config.domain_rpc;
//                self.frameChat.src = "nwlib6/nwproject/modules/webrtc/v2/index.html?room=movilmove_number_" + self.id_service + "&video=false&audio=false&usejoin=false&chat=true&openchat=true&useServer=false";
                document.body.appendChild(self.frameChat);
                self.frameChat.onload = function () {
                    self.sendMsgFrame();
                    window.addEventListener('message', function (e) {
                        if (self.debug) {
                            console.log("e.data", e.data);
                        }
                        if (e.data.room === "movilmove_number_" + self.id_service) {
                            if (e.data.text === "CANCELADO") {
                                self.userCancelaService();
                            }
                        }
                    });
                };
            }
        },
        validateGpsActive: function validateGpsActive() {
            console.log("nwgeo.latitude", nwgeo.latitude);
            console.log("nwgeo.longitude", nwgeo.longitude);
            if (!nw.utils.evalueData(nwgeo.latitude) || !nw.utils.evalueData(nwgeo.longitude)) {
                nw.dialog("Lo sentimos, no se registró GPS latitud y/o longitud activo. Revise que tenga el GPS activo, permisos y conexión a internet. Intente cerrar la app y volver a abrirla.");
                return false;
            }
            return true;
        },
        sendMsgFrameConductor: function sendMsgFrameConductor() {
            var self = this;
            var pos = JSON.stringify(self.positionConductor);
            var ms = {};
            ms.tipo = "send_message_ringow";
            ms.message = pos;
            if (self.debug) {
                console.log("SEND sendMsgFrameConductor ", pos);
            }
            self.frameConductor.contentWindow.postMessage(ms, '*');
        },
        confirmarLlegada: function confirmarLlegada() {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var ra = self.data_service;
            var d = nwgeo.distance(parseFloat(ra.latitudOri), parseFloat(ra.longitudOri), self.positionConductor.lat, self.positionConductor.lng);
            console.log("dddddddddddddddddddddd", d);
            console.log("parseInt(d)", parseInt(d));
//            var k = parseFloat(d) / 1000;
//            console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", k);
//            console.log("parseInt(k)", parseInt(k));
            console.log("parseInt(self.configCliente.metros_para_confirmar_llegada)", parseInt(self.configCliente.metros_para_confirmar_llegada));
            var estalejos = false;
            if (self.configCliente.usar_distancia_punto_recogida == "SI") {
                estalejos = true;
                if (nw.evalueData(self.configCliente.metros_para_confirmar_llegada)) {
                    if (parseInt(d) <= parseInt(self.configCliente.metros_para_confirmar_llegada)) {
                        estalejos = false;
                    }
                }
            }
//            if (parseInt(k) <= parseInt(self.configCliente.metros_para_confirmar_llegada)) {
            if (estalejos == false) {
                if (self.configCliente.foto_para_confirmar_llegada == "SI") {
                    self.subirImagenes(function (files) {
                        console.log("files", files);
                        sigue(files, function () {
                            nw.remove(".pruebauno_container");
                        });
                    });
                } else {
                    sigue();
                }

                function sigue(files, callback) {
                    if (self.actEnRuta == true) {
                        self.actEnRuta = false;
                        if (self.polylineRuta) {
                            self.polylineRuta.setMap(null);
                        }
                        delete self.polylineRuta;
                    }
                    self.cleanMarkerTwo();

                    var gps = self.positionConductor;
                    var data = {};
                    data.usuario = up.usuario;
//                    data.latitudConfirmaLlegada = gps.lat;
//                    data.longitudConfirmaLlegada = gps.lng;
                    data.latitudConfirmaLlegada = nwgeo.latitude;
                    data.longitudConfirmaLlegada = nwgeo.longitude;
                    data.id = ra.id;
                    if (nw.evalueData(files)) {
                        data.files = files;
                    }
                    if (!self.validateGpsActive()) {
                        return false;
                    }

                    //api Booking
                    data.dataService = self.dataByBooking("EN_SITIO");
                    //api Booking

                    console.log("confirmarLlegada:::sendData:::", data);
                    var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                    rpc.setAsync(true);
                    var func = function (r) {
                        console.log("confirmarLlegada:::responseServer:::", r);
                        if (nw.evalueData(callback)) {
                            callback();
                        }
                        self.cleanMarkerTwo();
//                        var data = {};
//                        data.id = ra.id;
                        self.activeEnSitio();
                        nw.sendNotificacion({
                            title: "Tu conductor ha llegado",
                            body: "Dirígete al punto de origen",
                            icon: "fcm_push_icon",
                            sound: "default",
                            data: "main.crearViaje('" + r.id + "')",
                            callback: "FCM_PLUGIN_ACTIVITY",
                            to: ra.token_usuario
                        });

                        main.registerServiceInFirebase(data.id);
                    };
                    rpc.exec("llegadaServicioCon", data, func);
                }
            } else {
                nw.dialog("Estás lejos del punto de encuentro para iniciar el servicio");
            }
        },
        confirmarAbordaje: function confirmarAbordaje() {
            var self = this;
            if (self.configCliente.foto_para_confirmar_abordaje == "SI") {
                self.subirImagenes(function (files) {
                    console.log("files", files);
                    sigue(files, function () {
                        nw.remove(".pruebauno_container");
                    });
                });
            } else {
                sigue();
            }

            function sigue(files, callback) {
                var paradas_adicional_valor_unitario = 0;
                if (nw.utils.evalueData(self.configCliente.recargos_valor_parada_adicional)) {
                    paradas_adicional_valor_unitario = self.configCliente.recargos_valor_parada_adicional;
                }
                var recargos_espera_minuto_inicia_cobro = 0;
                if (nw.utils.evalueData(self.configCliente.recargos_espera_minuto_inicia_cobro)) {
                    recargos_espera_minuto_inicia_cobro = self.configCliente.recargos_espera_minuto_inicia_cobro;
                }
                var valorMinutoEspera = 0;
                if (nw.utils.evalueData(self.configCliente.recargos_valor_minuto_espera)) {
                    valorMinutoEspera = self.configCliente.recargos_valor_minuto_espera;
                }
                var valor_espera = 0;
                if (self.minutosDeEspera >= recargos_espera_minuto_inicia_cobro) {
//                    valor_espera = parseFloat(self.minutosDeEspera) * parseFloat(valorMinutoEspera);
                    valor_espera = (parseFloat(self.minutosDeEspera) - parseFloat(self.configCliente.recargos_espera_minuto_inicia_cobro)) * parseFloat(valorMinutoEspera);
                }
                console.log("valor_espera", valor_espera);
                self.trazaLineaCreada = false;
                var up = nw.userPolicies.getUserData();
                var ra = self.data_service;
                var data = {};
                var gps = self.positionConductor;
                data.perfil = up.perfil;
                data.usuario = up.usuario;
//                data.latitudConfirmaAbordaje = gps.lat;
//                data.longitudConfirmaAbordaje = gps.lng;
                data.latitudConfirmaAbordaje = nwgeo.latitude;
                data.longitudConfirmaAbordaje = nwgeo.longitude;
                data.id = ra.id;
                data.recargo_valor_minuto_valor_espera = valorMinutoEspera;
                data.tiempo_espera = self.minutosDeEspera;
                data.valor_espera = valor_espera;
                if (nw.evalueData(files)) {
                    data.files = files;
                }
                if (!self.validateGpsActive()) {
                    return false;
                }

                data.dataService = self.dataByBooking("ABORDO");


                console.log("confirmarAbordaje:::sendData:::", data);
                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
                rpc.setAsync(true);
                var func = function (r) {
                    console.log("confirmarAbordaje:::responseServer:::", r);
                    if (nw.evalueData(callback)) {
                        callback();
                    }
                    self.activeAbordo();
                    nw.sendNotificacion({
                        title: "Ha iniciado tu viaje",
                        body: "¡Buen viaje!",
                        icon: "fcm_push_icon",
                        sound: "default",
                        data: "main.crearViaje('" + r.id + "')",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: ra.token_usuario
                    });

                    main.registerServiceInFirebase(data.id);
                };
                rpc.exec("confirmarAbordaje", data, func);
            }
        },
        saldoRecarga: function saldoRecarga(dat, callback) {
            var self = this;
            var data = {};
            data.id_usuario = dat.id_usuario;
            data.usuario = dat.usuario;
            data.empresa = dat.empresa;
            if (self.debugConstruct) {
                console.log("saldoRecarga::data::", data);
                console.log("saldoRecarga::dat::", dat);
            }
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(false);
            rpc.setLoading(false);
            nw.loading({text: "Por favor espere...", title: "Consultando saldo billetera del pasajero..."});
            var func = function (r) {
                nw.loadingRemove();
                if (self.debugConstruct) {
                    console.log("RESPONSE_SERVER:::saldoRecarga billetera:::r", r);
                }
                callback(r);
            };
            rpc.exec("saldoRecargaUser", data, func);
        },
        saverecorr: function saverecorr(tipo) {
            var self = this;
            clearTimeout(self.recorridosave);
            self.saveRecorrido(function () {
                self.recorridosave = setTimeout(function () {
                    self.saverecorr(tipo);
                }, 10000);
            }, tipo);
        },
        recorridoLatitud: null,
        recorridoLongitud: null,
        saveRecorrido: function saveRecorrido(callback, tipo) {
            var self = this;
            clearTimeout(self.recorridosave);
            var element = document.querySelector(".grupo_nueva_solicitud");
            console.log("element.style.display", element.style.display);
            if (element) {
                if (element.style.display === 'none') {
                    self.cerrarNotificionMain();
                    self.centerUbication();
                    return false;
                }
            }
            var up = nw.userPolicies.getUserData();
            var gps = self.positionConductor;
            if (!nw.evalueData(self.recorridoLatitud)) {
//                self.recorridoLatitud = gps.lat;
                self.recorridoLatitud = nwgeo.latitude;
            }
            if (!nw.evalueData(self.recorridoLongitud)) {
//                self.recorridoLongitud = gps.lng;
                self.recorridoLongitud = nwgeo.longitude;
            }
            var data = {};
            data.latitud = self.recorridoLatitud;
            data.longitud = self.recorridoLongitud;
//            data.latitudEnd = gps.lat;
//            data.longitudEnd = gps.lng;
            data.latitudEnd = nwgeo.latitude;
            data.longitudEnd = nwgeo.longitude;
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            data.nombre_usuario = up.nombre;
            data.id_usuario = up.id_usuario;
            data.id_servicio = self.data_service.id;
            if (nw.utils.evalueData(self.data_service.placa)) {
                data.placa = self.data_service.placa;
            }
            data.tipo = tipo;
            data.speed = nwgeo.speed;

            var metros = self.getDistanceToCoords(data.latitud, data.longitud, data.latitudEnd, data.longitudEnd);
            console.log("metros", metros);
            metros = parseInt(metros);
            console.log("metros", metros);
            data.metros = metros;
            console.log("saveRecorrido:::self.recorridoLatitud", self.recorridoLatitud);
            console.log("saveRecorrido:::gps", gps);
            console.log("saveRecorrido:::dataSend", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                if (self.debugConstruct) {
                    console.log("saveRecorrido:::resposeServer:::r", r);
                }
                self.recorridoLatitud = data.latitudEnd;
                self.recorridoLongitud = data.longitudEnd;
                if (typeof callback !== "undefined") {
                    if (nw.evalueData(callback)) {
                        callback(r);
                    }
                }

                main.updateOnlyFieldsServiceInFirebase(self.data_service.id, {
                    latitud_actual: nwgeo.latitude,
                    longitud_actual: nwgeo.longitude,
                    driver_latitud: nwgeo.latitude,
                    driver_longitud: nwgeo.longitude
                });
            };
            rpc.exec("saveRecorrido", data, func);
        },
        finalizarViaje: function finalizarViaje() {
            var self = this;
            var d = new f_z100_finalizarViaje_valida();
            d.construct(self);
        },
        totalPorcentajes: function totalPorcentajes(r, callback) {
            var self = this;
            var d = new f_z102_finalizarViaje_traecomisiones();
            return d.construct(self, r, callback);
        },
        showPriceEnd: function showPriceEnd(data) {
            var self = this;
            if (self.debugConstruct) {
                console.log("showPriceEnd", data);
            }
            console.log("data.precio_viaje", data.precio_viaje)
            if (nw.evalueData(config.decimalesFixed)) {
                data.precio_viaje = parseFloat(data.precio_viaje).toFixed(config.decimalesFixed);
            }
            console.log("data.precio_viaje", data.precio_viaje);
            var up = nw.userPolicies.getUserData();
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            data.nombre_usuario = up.nombre;
            data.id_usuario = up.id_usuario;
            data.email = up.email;
            data.perfil = up.perfil;
            if (data.tipo_pago === "tarjeta_credito" && nw.evalueData(data.id_tarjeta_credito) === true) {
                self.cobrarConTarjeta(data);
            } else {
                if (self.configCliente.app_para == "CARGA") {
                    self.firmaConfirma(function (pr) {
                        data.firma_recibido = pr.firma_recibido;
                        self.finalizarServicio(data);
                    });
                } else {
                    data.firma_recibido = "";
                    self.finalizarServicio(data);
                }
            }
        },
        restarHoras: function restarHoras(llave, inicio, fin) {
            console.log("inicio", inicio);
            console.log("fin", fin);
            if (!nw.evalueData(inicio) || !nw.evalueData(fin)) {
                return "";
            }
            var inicioMinutos = parseInt(inicio.substr(3, 2));
            var inicioHoras = parseInt(inicio.substr(0, 2));
            var finMinutos = parseInt(fin.substr(3, 2));
            var finHoras = parseInt(fin.substr(0, 2));
            var transcurridoMinutos = finMinutos - inicioMinutos;
            var transcurridoHoras = finHoras - inicioHoras;
            if (transcurridoMinutos < 0) {
                transcurridoHoras--;
                transcurridoMinutos = 60 + transcurridoMinutos;
            }

            var horas = transcurridoHoras.toString();
            var minutos = transcurridoMinutos.toString();
            if (horas.length < 2) {
                horas = "0" + horas;
            }
            if (llave == "espera") {
                var tiempo = {
                    "horas": horas,
                    "minutos": minutos
                }
                return tiempo;
            }
        },
//        cobrarConTarjeta: function cobrarConTarjeta(data, callback) {
//            var self = this;
//            if (config.paymentStore === "Conekta") {
//                return self.cobrarConTarjetaConekta(data, callback);
//            }
//            if (config.paymentStore === "epayco") {
//                return self.cobrarConTarjetaEpayco(data, callback);
//            }
//            if (config.paymentStore === "payu") {
//                return self.cobrarConTarjetaPayu(data, callback);
//            }
//            nw.dialog("No existe configuración de proveedor de pagos con tarjeta de crédito, consulte con el administrador del sistema.");
//            return false;
//        },
//        cobrarConTarjetaEpayco: function cobrarConTarjetaEpayco(data) {
//            var self = this;
//            data.app_name = config.name;
//            data.id_relational_pay = data.id;
//            if (typeof config.apiKeyEpayco !== 'undefined' && config.apiKeyEpayco != "") {
//                data.apiKeyEpayco = config.apiKeyEpayco;
//            }
//            if (typeof config.privateKeyEpayco !== 'undefined' && config.privateKeyEpayco != "") {
//                data.privateKeyEpayco = config.privateKeyEpayco;
//            }
//            console.log("cobrarConTarjetaEpayco::data", data);
//            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
//            rpc.setAsync(true);
//            rpc.setLoading(true);
//            var func = function (r) {
//                console.log("cobrarConTarjeta", r);
//                self.cobroCardEnd(r, data);
//            };
//            rpc.exec("makePagoCreditEpayco", data, func);
//        },
//        cobrarConTarjetaPayu: function cobrarConTarjetaPayu(data, callback) {
//            var self = this;
//            data.app_name = config.name;
//            data.id_relational_pay = data.id;
//            console.log("cobrarConTarjetaPayu::data", data);
//            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
//            rpc.setAsync(true);
//            rpc.setLoading(true);
//            var func = function (r) {
//                console.log("cobrarConTarjetaPayu:::response", r);
//
//                if (r === "pago_en_ceros_aprobada") {
//                    self.finalizarServicio(data);
//                    return;
//                }
//
//                var rta = nw.validateNwPayments(r.result);
//
//                console.log("rta", rta);
//                rta.status = "OK";
//                var h = "";
//                h += rta.status_description + ". <br />";
//                h += rta.responseCode + " <br />";
//                if (nw.evalueData(rta.responseMessage)) {
//                    h += rta.responseMessage + ". <br />";
//                }
//                if (!rta.approved || !r.APPROVED) {
//                    rta.status = "Rechazada";
//                } else {
//                    rta.ref_payco = rta.orderId;
//                }
//                rta.respuesta = h;
//                self.cobroCardEnd(rta, data);
//            };
//            rpc.exec("makePagoCreditPayu", data, func);
//        },
//        cobrarConTarjetaConekta: function cobrarConTarjetaConekta(data) {
//            var self = this;
//            data.ruta = "/app/pagos/";
//            data.itemName = "Pago de viaje ID " + data.id;
//            data.itemDescription = "Pago de viaje ID " + data.id + " dir_origen: " + data.dir_origen + " dir_destino: " + data.dir_destino;
//            data.item_unit_price = data.precio_viaje.toString().replace(".", "");
//            data.itemQuantity = 1;
//            data.street1 = "Calle 123, int 2";
//            data.postal_code = "06100";
//            data.country = "MX";
//            data.currency = "MXN";
//            data.more_info = "";
//            data.reference = "123456789";
//            console.log("START:::cobrarConTarjetaConekta:::DATA", data);
//            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
//            rpc.setAsync(true);
//            rpc.setLoading(true);
//            var func = function (r) {
//                console.log("RESPONSE_SERVER_CONEKTA:::cobrarConTarjetaConekta:::r", r);
//                self.cobroCardEnd(r, data);
//            };
//            rpc.exec("makePagoCreditConekta", data, func);
//        },
//        cobroCardEnd: function cobroCardEnd(r, data) {
//            console.log("cobroCardEnd::: r ::: data", r, data);
//            var self = this;
//            self.ui.finalizar_viaje.setValue("1");
//            var options = {
//                cleanHtml: false,
//                textCancel: "Cambiar a efectivo",
//                textAccept: "Volver"
//            };
//            var volverIntentar = function () {
//                return true;
//            };
//            var cambiarFormaPago = function () {
//                self.cambiarFormaPago(data.id, "efectivo");
//                return true;
//            };
//            if (r.status === "Rechazada") {
//                var html = "";
//                if (nw.evalueData(r.estado)) {
//                    html += r.estado + ". ";
//                }
//                if (nw.evalueData(r.respuesta)) {
//                    html += r.respuesta + ". ";
//                }
//                if (nw.evalueData(r.ref_payco)) {
//                    html += ". Ref: " + r.ref_payco;
//                }
//                nw.dialog(html, volverIntentar, cambiarFormaPago, options);
//                return;
//            } else
//            if (r.status === "OK") {
//                self.finalizarServicio(data);
//            } else {
//                nw.dialog(r, volverIntentar, cambiarFormaPago, options);
//            }
//        },
        firmaConfirma: function firmaConfirma(callback) {
            var fa = new nw.forms();
            fa.id = "generarFirma";
            fa.html = "<h1 style='text-align:center;'>Ingrese la firma de recibido</h1><br />";
            fa.showBack = true;
            fa.createBase();
            var fields = [
                {
                    name: "firma_recibido",
                    label: "Firma Recibido",
                    type: "signature",
//                    type: "button",
//                    mode: "camera_files",
                    required: true
                }
            ];
            fa.setFields(fields);
            fa.buttons = [
                {
                    style: "text-shadow: none;font-weight: lighter;border: 0;",
                    className: "btn_maxwidth",
                    name: "aceptar",
                    label: "Enviar",
                    callback: function () {
                        if (!fa.validate()) {
                            return false;
                        }
                        var data = fa.getRecord();
                        callback(data);
                    }
                }
            ];
            fa.show();
        },
        finalizarServicio: function finalizarServicio(data) {
            var self = this;
            var d = new f_z101_finalizarViaje_guarda();
            d.construct(self, data);
        },
        cambiarFormaPago: function cambiarFormaPago(id, tipo_pago) {
            var self = this;
            var data = {};
            data.id = id;
            data.tipo_pago = tipo_pago;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                if (r === true) {
                    self.data_service.tipo_pago = tipo_pago;
                    nw.dialog("Forma de pago actualizada correctamente");
                } else {
                    nw.dialog(r);
                }
            };
            rpc.exec("cambiarFormaPago", data, func);
        },
        resolveReziseMap: function resolveReziseMap() {
            var self = this;
//        var show = document.querySelector(".nw_widget_div_driver_online").style.display;
//        console.log("show", show);
        },
        reziseMap: function reziseMap() {
            var self = this;
            self.ui.mapa.addClass("mapa_maxheight");
            var d = document.querySelector(".grupo_nueva_solicitud");
            if (d) {
                var h = d.offsetHeight;
                var ds = document.createElement("style");
                ds.className = "styleRootAltoMax";
                ds.innerHTML = ":root {--alto_maximo_map: " + h + "px;}";
                document.querySelector(".f_driver_mapa_servicios").appendChild(ds);

//                var rad = document.querySelector(".cont-radar");
//                if (rad) {
//                    rad.style.display = "none";
//                }

            }
        },
        reziseNormalMap: function reziseNormalMap() {
            var self = this;
            self.ui.mapa.removeClass("mapa_maxheight");
            self.ui.mapa.css({"max-height": "100%"});

//            var rad = document.querySelector(".cont-radar");
//            if (rad) {
//                rad.style.display = "none";
//            }
        },
        cleanMarkerNotify: function cleanMarkerNotify() {
            var self = this;
            if (nw.evalueData(self.markerNotify)) {
                nwgeo.removeMarker(self.markerNotify);
            }
            if (nw.evalueData(self.lineNotify)) {
                nwgeo.removeLine(self.lineNotify);
                self.lineNotify = false;
            }
            self.removeLine();
            nwgeo.removeAllPolyLines();
            nwgeo.centerMap(self.map, self.marker1, false, 17);
        },
        stopSound: function stopSound() {
            var d = document.querySelector(".sound_nuevo_viaje");
            if (d) {
                d.remove();
            }
        },
        consultaTareasAdicionales: function consultaTareasAdicionales(t) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.empresa = up.empresa;
            data.id_service = self.id_service;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                if (r) {
                    var t = nw.createNotificacionBarInter({
                        addClass: "notifyRedirect",
                        timeToRemove: 15000,
                        title: "Nueva tarea",
                        body: "Tienes una nueva tarea para este servicio revisa el etalle del servicio para mas información.",
                        icon: false,
                        data: r,
                        callback: function () {
                            main.openHistoricoViajes();
                        }
                    });
                }
            };
            rpc.exec("populateTareasAdicionales", data, func);
        },
        updateRechazados: function updateRechazados(t, callback) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = t;
            data.id_service = self.id_service;
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            console.log("updateRechazados::data", data);
            var func = function (r) {
                console.log("updateRechazados::responseServer", r);
                callback();
                main.registerServiceInFirebase(data.id, function (p) {
                    console.log("p.conductores_disponibles", p.conductores_disponibles);
                    for (var i = 0; i < p.conductores_disponibles.length; i++) {
                        if (p.conductores_disponibles[i] == up.usuario) {
//                            p.conductores_disponibles.splice(i, 1);
                            p.conductores_disponibles[i] = up.usuario + "_(rechaza)";
                        }
                    }
                    console.log("p.conductores_disponibles", p.conductores_disponibles);
                    main.updateOnlyFieldsServiceInFirebase(data.id, {
//                        conductores_disponibles: firebase.firestore.FieldValue.arrayUnion(p.conductores_disponibles)
                        conductores_disponibles: p.conductores_disponibles
                    });
                });
            };
            rpc.exec("updateRechazados", data, func);
        },
        userCancelaService: function userCancelaService(t) {
            var self = this;
            self.cerrarNotificionMain();
            self.reziseNormalMap();
            self.actEnRuta = false;
            if (self.polylineRuta) {
                self.polylineRuta.setMap(null);
            }
            delete self.polylineRuta;
            if (typeof t === 'undefined') {
                var obs = "";
                if (typeof self.data_service.observacion_cancelado_adm === "string" && self.data_service.observacion_cancelado_adm != "") {
                    obs = " Observaciones: " + self.data_service.observacion_cancelado_adm;
                }
                nw.dialog("El usuario ha cancelado el servicio" + obs);
            }

            self.activeNormal();
            nwgeo.removeAllPolyLines();
            nw.openAppToFront();
            nw.turnScreenOn();
            nw.turnScreenOnAndUnlocked();
            if (!document.querySelector(".cont-radar")) {
                self.getIcon();
            }
        },
        getIcon: function getIcon() {
            var icon = '<svg viewBox="0 0 370 370">';
            icon += '<g id="radar-bg">';
            icon += '<path fill="#FFFFFF" d="M185,365C85.75,365,5,284.25,5,185C5,85.75,85.75,5,185,5c99.25,0,180,80.75,180,180C365,284.25,284.25,365,185,365z"/>';
            icon += '<path id="radar-path" fill="#CC0000" d="M185,10c96.65,0,175,78.35,175,175s-78.35,175-175,175S10,281.65,10,185S88.35,10,185,10 M185,0c-24.97,0-49.2,4.89-72.01,14.54c-22.03,9.32-41.81,22.66-58.8,39.64s-30.32,36.77-39.64,58.8C4.89,135.8,0,160.03,0,185s4.89,49.2,14.54,72.01c9.32,22.03,22.66,41.81,39.64,58.8c16.99,16.99,36.77,30.32,58.8,39.64C135.8,365.11,160.03,370,185,370s49.2-4.89,72.01-14.54c22.03-9.32,41.81-22.66,58.8-39.64c16.99-16.99,30.32-36.77,39.64-58.8C365.11,234.2,370,209.97,370,185s-4.89-49.2-14.54-72.01c-9.32-22.03-22.66-41.81-39.64-58.8c-16.99-16.99-36.77-30.32-58.8-39.64C234.2,4.89,209.97,0,185,0L185,0z"/>';
            icon += '</g>';
            icon += '<path id="radar-pattern" opacity="0.2" fill="none" stroke="#CC0000" stroke-width="4" stroke-miterlimit="10" d="M308.5,185c0,68.21-55.29,123.5-123.5,123.5S61.5,253.21,61.5,185S116.79,61.5,185,61.5S308.5,116.79,308.5,185z M185,114.5c-38.94,0-70.5,31.56-70.5,70.5s31.56,70.5,70.5,70.5s70.5-31.56,70.5-70.5S223.94,114.5,185,114.5z"/>'
//            icon += '<image overflow="visible" opacity="0.9" width="100%" height="100%" id="radar-gradient" xlink:href="https://raw.githubusercontent.com/fladireis/fladireis.github.io/master/angle-gradient2.png" >'
//            icon += '</image>'
            icon += '<g id="radar-icons" transform="translate(44.000000, 38.000000)" fill="#CC0000" fill-rule="nonzero">'
            icon += '<path d="M94.5,1.77635684e-15 C88.7102687,1.77635684e-15 84,4.72398352 84,10.5305158 C84,17.7366039 93.3964714,28.3155625 93.7965345,28.7623935 C94.172305,29.1821353 94.8283745,29.181397 95.2034655,28.7623935 C95.6035286,28.3155625 105,17.7366039 105,10.5305158 C105,4.72398352 100.289675,1.77635684e-15 94.5,1.77635684e-15 Z M94.5000303,16.1538462 C91.3824349,16.1538462 88.8461538,13.6175317 88.8461538,10.4999697 C88.8461538,7.38240769 91.3824955,4.84615385 94.5000303,4.84615385 C97.6175651,4.84615385 100.153846,7.38246829 100.153846,10.5000303 C100.153846,13.6175923 97.6175651,16.1538462 94.5000303,16.1538462 Z" id="Shape-Copy-11"></path>'
            icon += '<path d="M27.5,62 C21.7102687,62 17,66.7239835 17,72.5305158 C17,79.7366039 26.3964714,90.3155625 26.7965345,90.7623935 C27.172305,91.1821353 27.8283745,91.181397 28.2034655,90.7623935 C28.6035286,90.3155625 38,79.7366039 38,72.5305158 C38,66.7239835 33.2896746,62 27.5,62 Z M27.5000303,78.1538462 C24.3824349,78.1538462 21.8461538,75.6175317 21.8461538,72.4999697 C21.8461538,69.3824077 24.3824955,66.8461538 27.5000303,66.8461538 C30.6175651,66.8461538 33.1538462,69.3824683 33.1538462,72.5000303 C33.1538462,75.6175923 30.6175651,78.1538462 27.5000303,78.1538462 Z" id="Shape-Copy-10"></path>'
            icon += '<path d="M77.5,89 C71.7102687,89 67,93.7239835 67,99.5305158 C67,106.736604 76.3964714,117.315562 76.7965345,117.762394 C77.172305,118.182135 77.8283745,118.181397 78.2034655,117.762394 C78.6035286,117.315562 88,106.736604 88,99.5305158 C88,93.7239835 83.2896746,89 77.5,89 Z M77.5000303,105.153846 C74.3824349,105.153846 71.8461538,102.617532 71.8461538,99.4999697 C71.8461538,96.3824077 74.3824955,93.8461538 77.5000303,93.8461538 C80.6175651,93.8461538 83.1538462,96.3824683 83.1538462,99.5000303 C83.1538462,102.617592 80.6175651,105.153846 77.5000303,105.153846 Z" id="Shape-Copy-9"></path>'
            icon += '<path d="M10.5,143 C4.71026873,143 0,147.723984 0,153.530516 C0,160.736604 9.39647139,171.315562 9.79653449,171.762394 C10.172305,172.182135 10.8283745,172.181397 11.2034655,171.762394 C11.6035286,171.315562 21,160.736604 21,153.530516 C21,147.723984 16.2896746,143 10.5,143 Z M10.5000303,159.153846 C7.38243487,159.153846 4.84615385,156.617532 4.84615385,153.49997 C4.84615385,150.382408 7.38249548,147.846154 10.5000303,147.846154 C13.6175651,147.846154 16.1538462,150.382468 16.1538462,153.50003 C16.1538462,156.617592 13.6175651,159.153846 10.5000303,159.153846 Z" id="Shape-Copy-8"></path>'
            icon += '<path d="M66.5,175 C60.7102687,175 56,179.723984 56,185.530516 C56,192.736604 65.3964714,203.315562 65.7965345,203.762394 C66.172305,204.182135 66.8283745,204.181397 67.2034655,203.762394 C67.6035286,203.315562 77,192.736604 77,185.530516 C77,179.723984 72.2896746,175 66.5,175 Z M66.5000303,191.153846 C63.3824349,191.153846 60.8461538,188.617532 60.8461538,185.49997 C60.8461538,182.382408 63.3824955,179.846154 66.5000303,179.846154 C69.6175651,179.846154 72.1538462,182.382468 72.1538462,185.50003 C72.1538462,188.617592 69.6175651,191.153846 66.5000303,191.153846 Z" id="Shape-Copy-7"></path>'
            icon += '<path d="M94.5,246 C88.7102687,246 84,250.723984 84,256.530516 C84,263.736604 93.3964714,274.315562 93.7965345,274.762394 C94.172305,275.182135 94.8283745,275.181397 95.2034655,274.762394 C95.6035286,274.315562 105,263.736604 105,256.530516 C105,250.723984 100.289675,246 94.5,246 Z M94.5000303,262.153846 C91.3824349,262.153846 88.8461538,259.617532 88.8461538,256.49997 C88.8461538,253.382408 91.3824955,250.846154 94.5000303,250.846154 C97.6175651,250.846154 100.153846,253.382468 100.153846,256.50003 C100.153846,259.617592 97.6175651,262.153846 94.5000303,262.153846 Z" id="Shape-Copy-6"></path>'
            icon += '<path d="M199.5,240 C193.710269,240 189,244.723984 189,250.530516 C189,257.736604 198.396471,268.315562 198.796534,268.762394 C199.172305,269.182135 199.828375,269.181397 200.203466,268.762394 C200.603529,268.315562 210,257.736604 210,250.530516 C210,244.723984 205.289675,240 199.5,240 Z M199.50003,256.153846 C196.382435,256.153846 193.846154,253.617532 193.846154,250.49997 C193.846154,247.382408 196.382495,244.846154 199.50003,244.846154 C202.617565,244.846154 205.153846,247.382468 205.153846,250.50003 C205.153846,253.617592 202.617565,256.153846 199.50003,256.153846 Z" id="Shape-Copy-5"></path>'
            icon += '<path d="M178.5,178 C172.710269,178 168,182.723984 168,188.530516 C168,195.736604 177.396471,206.315562 177.796534,206.762394 C178.172305,207.182135 178.828375,207.181397 179.203466,206.762394 C179.603529,206.315562 189,195.736604 189,188.530516 C189,182.723984 184.289675,178 178.5,178 Z M178.50003,194.153846 C175.382435,194.153846 172.846154,191.617532 172.846154,188.49997 C172.846154,185.382408 175.382495,182.846154 178.50003,182.846154 C181.617565,182.846154 184.153846,185.382468 184.153846,188.50003 C184.153846,191.617592 181.617565,194.153846 178.50003,194.153846 Z" id="Shape-Copy-4"></path>'
            icon += '<path d="M256.5,168 C250.710269,168 246,172.723984 246,178.530516 C246,185.736604 255.396471,196.315562 255.796534,196.762394 C256.172305,197.182135 256.828375,197.181397 257.203466,196.762394 C257.603529,196.315562 267,185.736604 267,178.530516 C267,172.723984 262.289675,168 256.5,168 Z M256.50003,184.153846 C253.382435,184.153846 250.846154,181.617532 250.846154,178.49997 C250.846154,175.382408 253.382495,172.846154 256.50003,172.846154 C259.617565,172.846154 262.153846,175.382468 262.153846,178.50003 C262.153846,181.617592 259.617565,184.153846 256.50003,184.153846 Z" id="Shape-Copy-3"></path>'
            icon += '<path d="M264.5,91 C258.710269,91 254,95.7239835 254,101.530516 C254,108.736604 263.396471,119.315562 263.796534,119.762394 C264.172305,120.182135 264.828375,120.181397 265.203466,119.762394 C265.603529,119.315562 275,108.736604 275,101.530516 C275,95.7239835 270.289675,91 264.5,91 Z M264.50003,107.153846 C261.382435,107.153846 258.846154,104.617532 258.846154,101.49997 C258.846154,98.3824077 261.382495,95.8461538 264.50003,95.8461538 C267.617565,95.8461538 270.153846,98.3824683 270.153846,101.50003 C270.153846,104.617592 267.617565,107.153846 264.50003,107.153846 Z" id="Shape-Copy-2"></path>'
            icon += '<path d="M202.5,89 C196.710269,89 192,93.7239835 192,99.5305158 C192,106.736604 201.396471,117.315562 201.796534,117.762394 C202.172305,118.182135 202.828375,118.181397 203.203466,117.762394 C203.603529,117.315562 213,106.736604 213,99.5305158 C213,93.7239835 208.289675,89 202.5,89 Z M202.50003,105.153846 C199.382435,105.153846 196.846154,102.617532 196.846154,99.4999697 C196.846154,96.3824077 199.382495,93.8461538 202.50003,93.8461538 C205.617565,93.8461538 208.153846,96.3824683 208.153846,99.5000303 C208.153846,102.617592 205.617565,105.153846 202.50003,105.153846 Z" id="Shape-Copy"></path>'
            icon += '<path d="M194.5,15 C188.710269,15 184,19.5490212 184,25.1404967 C184,32.0796927 193.396471,42.2668379 193.796534,42.6971197 C194.172305,43.1013155 194.828375,43.1006046 195.203466,42.6971197 C195.603529,42.2668379 205,32.0796927 205,25.1404967 C205,19.5490212 200.289675,15 194.5,15 Z M194.500029,31 C191.467267,31 189,28.5327009 189,25.4999705 C189,22.4672401 191.467326,20 194.500029,20 C197.532733,20 200,22.4672991 200,25.5000295 C200,28.5327599 197.532733,31 194.500029,31 Z" id="Shape"></path>'
            icon += '</g>'
            icon += '<circle id="radar-radius" opacity="0.1" fill="rgb(15, 91, 230)" cx="185" cy="185" r="45.67"/>'
            icon += '<circle id="radar-stem" fill="#CC0000" cx="185" cy="185" r="17.33"/>'
            icon += '<line id="radar-hand" fill="none" stroke="#CC0000" stroke-width="3" stroke-miterlimit="10" x1="185" y1="185" x2="185" y2="10"/>'
            icon += '</svg>';

            var div = document.createElement('div');
            div.className = 'cont-radar';
            div.innerHTML = "<p>" + nw.tr("Buscando Servicios") + "</p>" + icon;
            document.querySelector('.buttons_driver').append(div);

            var p = document.querySelectorAll('#radar-icons path');
            var d = [], i = 0;
            for (var e = 0; e < p.length; e++) {
                d.push(p[e]);
            }
            d = d.reverse();

            setInterval(function () {
                if (i < 12) {
                    var r = d[i];
                    r.style.opacity = "2";
                    r.style.transition = "5s";
                    if (i > 0) {
                        var t = d[i - 1];
                        t.style.opacity = "0";
                    }
                }
                i++;
                if (i == 13) {
                    i = 0;
                    var h = d[11];
                    h.style.opacity = "0";
                }
            }, 1500);
        },
        calcularMinutos: function calcularMinutos(hI, hF) {
            var self = this;
            var horaInicial = self.devolverMinutos(hI);
            var horaFinal = self.devolverMinutos(hF);
            var dif = horaFinal - horaInicial;
            return dif;
        },
        devolverMinutos: function devolverMinutos(horaMinutos) {
            console.log("horaMinutos", horaMinutos);
            if (!nw.evalueData(horaMinutos)) {
                return "";
            }
            return (parseInt(horaMinutos.split(":")[0]) * 60) + parseInt(horaMinutos.split(":")[1]);
        }
    }
});