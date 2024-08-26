nw.Class.define("f_crear_viaje", {
    extend: nw.forms,
    construct: function (callback) {
        var self = this;
        var createInHome = true;
        if (createInHome) {
            self.canvas = "#foo";
            self.id_form = "l_visitantes";
        } else {
            self.id = "f_crear_viaje";
            self.setTitle = "<span style='color:#fff;'>Crear viaje</span>";
            self.showBack = false;
            self.closeBack = true;
            self.html = "";
            self.textClose = "";
            self.colorBtnBackIOS = "#ffffff;";
            self.styleCloseIOS = "top: 3px;";
            self.createBase();
        }

        self.stepValue = 500;
        self.valor_total = 0;
        self.data_carga = false;
        self.numeroAuxiliares = 0;
        self.arrayParadas = [];
        self.markersParadas = [];
        self.data_aeropuerto_servicio = false;
        self.__vl_services = [];
        self.orienta = false;
        self.markersCalor = [];
        self.createDataDriver = false;
        self.__show = false;
        self.puntajeDriver = false;
        self.shotFirstUbicationDriver = false;
//        self.usePoliLyneInSolicitudService = false;
        self.moveInter = null;
        self.animations3D = true;
        self.debugConstruct = main.debugConstruct;
        self.debug = false;
        self.hoyDate = nw.getActualDate();
        self.servicioTomado = false;
        self.serviceActive = false;
        self.recibeGeoDriver = false;
        self.timeNoRecibeGeoDriver = 0;
        self.ciudad_destino = false;
        self.name_place_destino = false;
        self.name_place_destino_text = false;
        self.subcategoria_servicio_text = "";
        self.descuento_maximo = 0;
        self.configCliente = {};
        self.dragMap = false;
        self.latitudMapaDrag = 0;
        self.longitudMapaDrag = 0;
        self.activeWatchPosition = false;
        self.dataHtmlConductor = false;
//        self.timeIntervalo = 10000; //10 segundos
        self.timeIntervalo = 13000; //13 segundos
        self.loadedInitialMyUbication = false;
        self.loadedFirst = false;
        self.cobro = false;
        self.num_mascota = 0;
        self.interval = null;
        self.infoWindow = null;
        self.fram = false;
        self.servicioAllData = false;
        self.servicio_nom = false;
        self.markerMyPosition = false;
        self.markerDestino = false;
        self.marker3 = false;
        self.markerDriver = false;
        self.markerSelected = false;
        self.inte = "";
        self.initAbordo = false;
        self.initservice = false;
        self.campo = "address";
        self.tipo = "";
        self.fin = false;
        self.line = false;
        self.lineRutaFinal = false;
        self.launch = true;
        self.circu = false;
        self.activeNormalV = false;
        self.actEnRuta = false;
        self.positionConductor = false;
        self.conductorLlegaASitio = false;
        self.datosServicio = false;
        self.mostrar_group_detalle = true;
        self.cancela_conductor = false;
        self.minutos_agregar_hora = 60;
        self.poly = {};
        self.geo = {};
        self.geoDestino = {};
        self.heightMap = $("body").height();
        var fields = [
            {
                label: "",
                name: "contenedor_adondevamos",
                type: "startGroup"
            },
            {
                type: 'html',
                label: '',
                visible_label: true,
                name: 'labelname_adondevas'
            },
            {
                icon: "material-icons location_on normal",
                type: 'button',
                label: '¿A dónde vas?',
                visible_label: true,
                name: 'button_adondevas'
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                style: '',
                name: "contenedor_address",
                type: "startGroup",
                visible: true
            },
            {
                type: 'button',
                name: 'backAdondevamos',
                label: '<i class="material-icons">arrow_back</i>'
            },
            {
                label: "",
                name: "contenedor_direcciones_enc",
                type: "startGroup"
            },
            {
                styleContainer: 'margin: 0;',
                style: '',
                icon: "material-icons location_on normal",
                type: 'search',
                label: 'Origen',
                visible_label: false,
                name: 'address',
                required: true,
                placeholder: 'Lugar o dirección de recogida',
                visible: true
            },
            {
                styleContainer: 'margin: 0;',
                style: '',
                icon: "material-icons near_me normal",
                type: 'search',
                label: 'Destino',
                visible_label: false,
                name: 'address_destino',
                required: true,
                placeholder: '¿A dónde vamos?',
                visible: true
            },
            {
                styleContainer: 'margin: 0;',
                style: '',
                icon: "material-icons check_circle normal",
                type: 'button',
                label: 'Confirmar ubicación de origen',
                name: 'confirmar_ub',
                visible: false
            },
            {
                styleContainer: '',
                style: '',
                icon: "material-icons person_pin_circle normal",
                type: 'button',
                label: 'Fijar en el mapa',
                visible_label: false,
                visible: false,
                name: 'fijar_en_mapa_origen'
            },
            {
                styleContainer: '',
                style: '',
                icon: "material-icons person_pin_circle normal",
                type: 'button',
                label: 'Fijar en el mapa',
                visible_label: false,
                visible: false,
                name: 'fijar_en_mapa_destino'
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                name: "favoritos_group",
                type: "startGroup",
                visible: true
            },
            {
                type: "endGroup"
            },
            {
                type: "endGroup"
            },
            {
                styleContainer: "margin:0;",
//                style: "min-width: 200px; min-height: 200px;width: 100%; height: 100%;",
                label: "",
                name: "mapa",
                type: "startGroup"
            },
            {
                type: "endGroup"
            },
            {
                style: '',
                label: "",
                name: "contenedor_btn_fijar",
                type: "startGroup"
            },
            {
                type: 'html',
                label: 'Mueve el mapa para ubicar tu destino',
                visible: false,
                name: 'listo_fijar_label'
            },
            {
                styleContainer: '',
                style: '',
                icon: "",
                type: 'button',
                label: 'Listo',
                visible_label: false,
                visible: false,
                name: 'listo_fijar'
            },
            {
                type: "endGroup"
            },
//            {
//                label: "",
//                name: "contenedor_azul",
//                type: "startGroup"
//            },
//            {
//                styleContainer: 'width:45%;float:left;margin:5px 0;',
//                style: 'font-size: 13px;margin: 0px;width:100%;',
//                type: 'button',
//                icon: "material-icons golf_course normal",
//                label: 'Agregar parada',
//                name: 'add_parada'
//            },
//            {
//                type: "endGroup"
//            },
//            {
//                label: "",
//                name: "paradas_group",
//                type: "startGroup",
//                visible: true
//            },
//            {
//                type: "endGroup"
//            },
            {
                style: '',
                label: '',
                name: "pago_group",
                type: "startGroup"
            },
            {
                styleContainer: '',
                style: '',
                icon: 'material-icons card_giftcard normal',
                type: 'button',
                label: 'Mis cupones',
                visible_label: false,
                placeholder: '',
                name: 'codigo_promo'
            },
            {
                styleContainer: '',
                type: 'switch',
                label: 'Tipo',
                name: 'tipo_servicio',
                options: "<option value='ahora'>" + nw.utils.tr("Inmediato") + "</option><option value='reservado'>" + nw.utils.tr("Programado") + "</option>",
//                required: false,
                visible: false
            },
            {
                styleContainer: '',
                type: 'switch',
                label: 'Forma',
                name: 'forma',
//                options: "<option value='trayecto'>Tarifa por trayecto</option><option value='fija'>Tarifa fija</option>",
                options: "<option value='trayecto'>Trayecto</option><option value='horas'>Horas</option>",
//                required: false,
                visible: false
            },
            {
                styleContainer: '',
                type: 'radio',
                label: 'Pago',
                name: 'tipo_pago',
//                required: true,
                visible: false
            },
            {
                type: 'textField',
                label: 'Tarjeta ID',
                name: 'tarjeta_id',
                visible: false
            },
            {
                styleContainer: '',
                style: '',
                type: 'textField',
                visible_label: false,
                label: 'Tarjeta',
                placeholder: 'Sin tarjeta',
                enabled: false,
                name: 'tarjeta',
                visible: false
            },
            {
                label: "",
                name: "fechas_group",
                type: "startGroup",
                visible: false
            },
            {
                styleContainer: '',
                style: '',
                type: 'dateField',
                label: 'Fecha',
                placeholder: 'Fecha',
                visible_label: false,
                name: 'fecha',
                visible: true
            },
            {
                styleContainer: '',
                style: '',
                type: 'time',
                label: 'Hora',
                placeholder: 'Hora',
                visible_label: false,
                name: 'hora',
                visible: true
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                name: "des_carga",
                type: "startGroup",
                visible: false
            },
            {
                type: 'textArea',
                label: '',
                placeholder: 'Observaciones, indicaciones',
                name: 'descricion_carga',
                visible: false
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                name: "contenedor_azul",
                type: "startGroup"
            },
            {
                type: 'selectBox',
                label: 'Total pax',
                placeholder: 'Total pax',
                name: 'paradas_adicionales_iniciales_creacion',
                visible: false
            },
            {
                styleContainer: 'width:98%;float:left;margin:5px -2px',
                style: 'font-size: 13px;margin: 0px;width:100%;',
                type: 'button',
                icon: "material-icons golf_course normal",
                label: 'Agregar parada',
                name: 'add_parada'
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                name: "paradas_group",
                type: "startGroup",
                visible: true
            },
            {
                type: "endGroup"
            },
            {
                type: 'textArea',
                label: 'Ingresa placa y color del vehículo',
                placeholder: 'Ingresa placa y color del vehículo',
                visible_label: false,
                car_min: "10",
                name: 'datos_vehiculo_elegido',
                visible: false
            },
//            {
//                type: 'numeric',
//                label: '',
//                name: 'cant_mascota',
//                visible: false
//            },
            {
                type: 'button',
                label: 'Confirmar',
                name: 'pedir'
            },
            {
                type: "endGroup"
            },
            {
                label: '',
                style: '',
                name: "buscando_driver",
                type: "startGroup"
            },
            {
                type: 'html',
                label: "<span class='countWait' style='display:block;'>1</span>" + nw.utils.tr("Buscando conductor, por favor espera") + "...",
                name: 'html_buscando'
            },
            {
                label: '',
                style: '',
                name: "actualizar_precio",
                mode: "div",
                type: "startGroup",
                visible: false
            },
            {
                type: 'button',
                label: '-',
                name: 'bajar_precio'
            },
            {
                type: 'numeric',
                label: 'Precio actual',
                name: 'actual_precio'
//                ,
//                enabled: false
            },
            {
                type: 'button',
                label: '+',
                name: 'aumentar_precio'
            },
            {
                type: 'button',
                label: 'Confirmar precio',
                name: 'confirmar_precio'
            },
            {
                mode: "div",
                type: "endGroup"
            },
            {
                type: 'button',
                label: 'Cancelar',
                name: 'cancelar_pedido'
            },
            {
                type: "endGroup"
            },
            {
                style: '',
                label: '',
                name: "driver_en_camino",
                type: "startGroup"
            },
            {
                type: 'html',
                label: '',
                name: 'html_driver_en_camino'
            },
            {
                type: 'button',
                label: 'Cancelar',
                name: 'cancelar_pedido_en_ruta'
            },
            {
                type: "endGroup"
            }
        ];

        self.setFields(fields);
        self.buttons = [];
        self.buttons.push(
                {
                    icon: "material-icons my_location mi_ubication_pin_geo",
                    position: "top",
                    name: "centrar_mapa",
                    label: "",
                    callback: function () {
                        self.centrarMapaGPS();
                    }
                }
        );
        self.show();

        if (config.usaCupones === false || main.configCliente.cod_promocional != "SI") {
            self.ui.codigo_promo.setVisibility(false);
        }

        var headerHome = document.querySelector('.headerHome');
        var codigo_pro = document.querySelector('.nw_widget_div_codigo_promo');
        headerHome.appendChild(codigo_pro);

        self.ui.des_carga.setVisibility(false);
        nw.addClass(document.querySelector(self.canvas), "f_crear_viaje");

        self.setDataPago();

        var up = nw.userPolicies.getUserData();

        self.__up = up;
        self.ui.labelname_adondevas.setValue(nw.utils.tr("Hola") + ", " + up.nombre);

        self.ui.contenedor_btn_fijar.setVisibility(false);

        self.ui.contenedor_azul.setVisibility(false);
        self.ui.paradas_group.setVisibility(false);

        self.backInShowServices = document.createElement("div");
        self.backInShowServices.innerHTML = '<i class="material-icons">arrow_back</i>';
        self.backInShowServices.className = "backInShowServices";
        self.backInShowServices.onclick = function () {
            nw.back();
            self.loadInitial();
            self.activeNormal();
            self.resetValuesHome();
        };
        $(".btnMenuHeader").after(self.backInShowServices);

        self.ui.backAdondevamos.addListener("click", function () {
            nw.back();
            self.muestraAdondeVamos();
        });


        self.ui.button_adondevas.addListener("click", function () {
            self.openAdondeVamosButton();
        });

        self.ui.address_destino.changeValue(function () {
            var d = self.ui.address_destino.getValue();
            if (!nw.evalueData(d)) {
                self.ui.favoritos_group.addClass("favoritos_group_show");
                return false;
            }
            self.ui.favoritos_group.removeClass("favoritos_group_show");
        });
        self.ui.listo_fijar.addListener("click", function () {
            self.launch = true;
            nwgeo.removeAllPolyLines();
            self.ui.listo_fijar.setVisibility(false);
            if (self.markerSelected === 2) {

                var position = self.marker3.getPosition();

//                self.setPositionTwo(self.marker3.getPosition());
//                self.ui.pago_group.addClass("buttons_group_fix_pago_group");
//                document.querySelector(".nw_widget_div_codigo_promo").classList.add('visibe_promo');
//                sigue();
                if (self.configCliente.app_para == "CARGA") {
                    self.formDatosCarga(function () {
                        sigue();
                    });
                } else {
                    sigue();
                }
                function sigue() {
                    console.log("position", position);
                    self.setPositionTwo(position);
                    self.ui.pago_group.addClass("buttons_group_fix_pago_group");
                    document.querySelector(".nw_widget_div_codigo_promo").classList.add('visibe_promo');
                    self.continuar();
                }
            } else
            if (self.markerSelected === 1) {
                self.setPositionOne(self.marker3.getPosition());
            }
            self.markerSelected = false;
            nwgeo.removeMarker(self.marker3);
        });
        self.ui.fijar_en_mapa_destino.addListener("click", function () {
            self.cleanMarkerDestino();
            nwgeo.removeAllPolyLines();
            self.removeLine();
            self.ui.pago_group.removeClass("buttons_group_fix_pago_group");
            document.querySelector(".nw_widget_div_codigo_promo").classList.remove('visibe_promo');
            self.ui.favoritos_group.removeClass("favoritos_group_show");
            self.campo = "address_destino";
            self.ui.contenedor_address.removeClass("contenedor_address_show");
            self.ui.listo_fijar_label.setVisibility(true);
            self.launch = false;
            self.createMarker3();
            self.markerSelected = 2;
        });
        self.ui.fijar_en_mapa_origen.addListener("click", function () {
            self.cleanMarkerOne();
            nwgeo.removeAllPolyLines();
            self.removeLine();
            self.ui.pago_group.removeClass("buttons_group_fix_pago_group");
            document.querySelector(".nw_widget_div_codigo_promo").classList.remove('visibe_promo');
            self.ui.favoritos_group.removeClass("favoritos_group_show");
            self.ui.contenedor_address.removeClass("contenedor_address_show");
            self.ui.listo_fijar_label.setVisibility(true);
            self.launch = false;
            self.createMarker3();
            self.markerSelected = 1;
        });
        self.ui.address.changeValue(function () {
            var data = self.getRecord(true);
            if (!nw.evalueData(data.address)) {
                self.ui.fijar_en_mapa_origen.setVisibility(false);
            } else {
                self.ui.fijar_en_mapa_origen.setVisibility(true);
            }
        });
        self.ui.address_destino.changeValue(function () {
            var data = self.getRecord(true);
            if (!nw.evalueData(data.address_destino)) {
//                self.ui.address.setVisibility(true);
                self.ui.fijar_en_mapa_destino.setVisibility(false);
            } else {
//                self.ui.address.setVisibility(false);
                self.ui.fijar_en_mapa_destino.setVisibility(true);
            }
        });
        self.ui.fecha.changeValue(function () {
            self.validaFecha("fecha", "Recuerde que la fecha del servicio no puede ser menor a la actual");
        });
        self.ui.fecha.focusout(function () {
            self.validaFecha("fecha", "Recuerde que la fecha del servicio no puede ser menor a la actual");
        });
        self.ui.hora.changeValue(function () {
            self.validaHora();
        });
        self.ui.address.addListener("click", function () {
            self.ui.address_destino.focus();
            self.activeNormalV = true;
            self.campo = "address";
            self.ui.favoritos_group.addClass("favoritos_group_show");
//            self.ui.favoritos_group.removeClass("favoritos_group_show");
            self.ui.fijar_en_mapa_origen.setVisibility(true);
            self.ui.address_destino.setVisibility(false);
            self.ui.fijar_en_mapa_destino.setVisibility(false);
        });
        self.ui.address_destino.addListener("click", function () {
            self.campo = "address_destino";
            self.activeNormalV = true;
            self.ui.favoritos_group.addClass("favoritos_group_show");
            self.ui.fijar_en_mapa_destino.setVisibility(true);
            self.ui.fijar_en_mapa_origen.setVisibility(false);
            self.ui.contenedor_btn_fijar.setVisibility(true);
        });
        self.ui.address_destino.addListener("focusout", function () {
            console.log("ACTION:::FOCUS");
            self.ui.favoritos_group.removeClass("favoritos_group_show");
            self.ui.fijar_en_mapa_destino.setVisibility(false);
        });
        self.ui.add_parada.addListener("click", function () {
            var d = new f_crear_parada();
            d.construct(self);
        });

        self.pedirVar = false;
        self.ui.pedir.addListener("click", function () {
            var data = self.getRecord();
            console.log("data", data);
            console.log("main.configCliente", main.configCliente);
            console.log("main.configCliente.tipo_pago", main.configCliente.tipo_pago);
            if (!self.validate()) {
                return false;
            }
            if (main.configCliente.tipo_pago == "CREDITO" && !nw.utils.evalueData(data.tarjeta_id)) {
                nw.dialog("Debe registrar una tarjeta de crédito para continuar. Vaya a Menú - Métodos de pago - Agregar tarjeta.");
                return false;
            }
            if (self.pedirVar == false) {
                self.pedirVar = true;
                self.pedir();
            }
        }, false);

        document.addEventListener('calificaFin', function (e) {
            self.ui.address.setVisibility(true);
            self.ui.address_destino.setValue("");

            var animate = false;
            var zoom = 17;
            var bounds = [
                {"lat": self.geo.latitude, "lng": self.geo.longitude}
            ];
            var multiplePoints = false;
            nwgeo.centerMap(self.map, self.markerMyPosition, false, zoom, bounds, multiplePoints, animate);

//            self.activeNormal();
            self.servicio_nom = false;
            self.num_mascota = 0;
            self.campo = "address";
            self.initAbordo = false;
        });

        self.ui.cancelar_pedido.addListener("click", function () {
            var d = new f_cancelar_servicio();
            d.construct(self);
        });

        self.ui.cancelar_pedido_en_ruta.addListener("click", function () {
            var d = new f_cancelar_servicio();
            d.construct(self);
        });

        self.ui.codigo_promo.addListener("click", function () {
            main.redimirCupon(function () {
                self.mostrarServicios(false, 'undefined', 'undefined', true);
                nw.back();
            });
        });

        self.ui.confirmar_ub.addListener("click", function () {
            self.continuar();
        });

        self.actionButtonsNegociar();

        self.setHours(0);

        self.changeForma();
        self.changeServicio();
        self.reziseNormalMap();

        var fil = new f_00_markers();
        fil.construct(self);

        self.configuracionServi(function () {
            console.log("main.configCliente", main.configCliente);
            console.log("up", up);
            console.log("up.foto", up.foto);
            var foto = false;
            if (nw.utils.evalueData(up.foto)) {
                foto = up.foto;
            }
            if (nw.utils.evalueData(up.foto_perfil)) {
                foto = up.foto_perfil;
            }
//            var foto = false;
            var getDataProfile = false;
            if (nw.evalueData(self.configCliente.foto_usuario_app)) {
                if (!nw.evalueData(foto) && self.configCliente.foto_usuario_app == 'SI') {
                    getDataProfile = true;
                }
            }
            if (getDataProfile) {
                nw.dialog(nw.tr("Por favor completa tu perfil"));
                nw.addClass(nw.getElement("body"), "foo_editprofile");
                nw.utils.empty("#foo .contentCenter");
                nw.account.editProfile(true);
                nw.remove(".loadingNwChat");
            } else
            if (!getDataProfile) {
                setTimeout(function () {
//                    self.createMapa();
                    iniciarMapa();
                }, 1);

                function iniciarMapa() {
                    var div = document.querySelector("#mapa");
                    if (div.offsetWidth < 100 || div.offsetHeight < 100) {
                        setTimeout(function () {
                            iniciarMapa();
                        }, 500);
                        return;
                    }
                    self.createMapa();
                }

                if (self.configCliente.usa_favoritos_app_user != "NO") {
                    setTimeout(function () {
                        self.createNavTableFavoritos();
                    }, 3000);
                }
                if (self.configCliente.paradas_adicional == "SI") {
                    setTimeout(function () {
                        self.createNavTableParadas();
                    }, 3000);
                }
                if (nw.evalueData(self.configCliente.tarifas_fijas_usa_valor_por_paradas)) {
                    if (self.configCliente.tarifas_fijas_usa_valor_por_paradas == 'SI') {
                        self.actionInPaxTotal();
                    }
                }
                if (nw.utils.evalueData(self.configCliente.ofertar_valor_salto_mas_menos)) {
                    self.stepValue = parseFloat(self.configCliente.ofertar_valor_salto_mas_menos);
                }

//                alert(main.configCliente.cod_promocional);
                if (main.configCliente.cod_promocional == "SI") {

                    main.addBtnAccount(nw.utils.tr("Ver cupón activo"), nw.utils.tr("Valida si tienes un cupón activo para usar"), "edit_location", function () {
                        main.cuponInUse(false, true, true);
                    });
//                    main.cuponInUse();

                    setTimeout(function () {
                        nw.getPromotionsApp();
                    }, 2000);
                }
                if (typeof callback != "undefined") {
                    callback();
                }
                if (nw.utils.evalueData(main.configCliente.btn_adondevamos_texto)) {
                    document.querySelector(".button_adondevas").innerHTML = main.configCliente.btn_adondevamos_texto;
                }
                if (main.configCliente.paradas_adicional === "NO") {
                    self.ui.add_parada.setVisibility(false);
                }
            }
        });
        main.selfCrearViaje = self;
    },
    destruct: function () {

    },
    members: {
        openAdondeVamosButton: function openAdondeVamosButton() {
            var self = this;
            if (self.debugConstruct) {
                console.log("CLICK::::::self.ui.button_adondevas");
            }
            if (self.configCliente.btn_adondevamos_abre_historico === "SI") {
                main.openHistoricoViajes();
                return;
            }
            self.data_aeropuerto_servicio = false;
            self.hoursAttention(undefined, function (r) {
                self.muestraAddressInit();
                window.location.hash = 'searchDirections';
            });
        },
        resetValuesHome: function resetValuesHome() {
            var self = this;
            var div = document.querySelector(".nw_widget_div_backAdondevamos_show");
            if (div) {
                return false;
            }
            for (var i = 0; i < self.markersParadas.length; i++) {
                nwgeo.removeMarker(self.markersParadas[i]);
            }
            self.arrayParadas = [];
            self.markersParadas = [];
            self.numeroAuxiliares = 0;
            self.data_carga = false;

            $(".pac-container").addClass("pac-container-hidde");

            nw.removeClass(".contenedor_adondevamos", "contenedor_adondevamos_hidden");

            nw.remove(".containBtnsShareWarn");

            self.ui.address.setVisibility(true);
            self.ui.address_destino.setVisibility(true);
            self.ui.address_destino.setValue("");

//            $(".pac-container").remove();

            console.log("resetValuesHome!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        },
        actionButtonsNegociar: function actionButtonsNegociar() {
            var self = this;
            self.ui.confirmar_precio.setVisibility(false);

            self.precioInicialSinConfirmar = false;

            self.ui.actual_precio.addListener("keyup", function (e) {
                var val = self.ui.actual_precio.getValue();
                console.log("e", e);
                console.log("val", val);
                if (!nw.utils.evalueData(self.precioInicialSinConfirmar)) {
                    self.precioInicialSinConfirmar = self.valor_total;
                }
                self.valor_total = parseFloat(val);
//                self.ui.actual_precio.setValue(self.valor_total);
                self.ui.confirmar_precio.setVisibility(true);
            });

            self.ui.bajar_precio.addListener("click", function () {
                if (!nw.utils.evalueData(self.precioInicialSinConfirmar)) {
                    return false;
                }
                if (self.valor_total <= self.precioInicialSinConfirmar) {
                    return false;
                }
                self.valor_total = parseFloat(self.valor_total) - self.stepValue;
                self.ui.actual_precio.setValue(self.valor_total);
                self.ui.confirmar_precio.setVisibility(true);
            });
            self.ui.aumentar_precio.addListener("click", function () {
                if (!nw.utils.evalueData(self.precioInicialSinConfirmar)) {
                    self.precioInicialSinConfirmar = self.valor_total;
                }
                self.valor_total = parseFloat(self.valor_total) + self.stepValue;
                self.ui.actual_precio.setValue(self.valor_total);
                self.ui.confirmar_precio.setVisibility(true);
            });
            self.ui.confirmar_precio.addListener("click", function () {
                self.precioInicialSinConfirmar = false;
                self.updatePrice(self.valor_total);
            });
        },
        updatePrice: function updatePrice(value) {
            var self = this;
            console.log("value", value);
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id = main.id_service_active;
            data.value = value;
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            var rpc = new nw.rpc(self.getRpcUrl(), "app_user");
            rpc.setAsync(true);
            rpc.setLoading(true);
            console.log("updatePrice:::RESPONSE_SERVER::data", data);
            var func = function (r) {
                console.log("updatePrice:::RESPONSE_SERVER::r", r);
                main.registerServiceInFirebase(main.id_service_active);
            };
            rpc.exec("actualizarPrecioViaje", data, func);

        },
        centrarMapaGPS: function centrarMapaGPS() {
            var self = this;
            if (self.debug) {
                console.log("self.serviceActive", self.serviceActive);
            }
            if (self.serviceActive === true) {
                console.log("self.initAbordo", self.initAbordo);
                var zoom = false;
                var bounds = [];
                if (self.initAbordo === true) {
                    bounds = [
                        {"lat": self.geo.latitude, "lng": self.geo.longitude},
                        {"lat": self.geoDestino.latitudDes, "lng": self.geoDestino.longitudDes}
                    ];
                } else {
                    bounds = [
                        {"lat": self.geo.latitude, "lng": self.geo.longitude},
                        {"lat": self.positionConductor.lat, "lng": self.positionConductor.lng}
                    ];
                }
                var multiplePoints = true;
                var animate = "center";
                nwgeo.centerMap(self.map, self.markerMyPosition, self.markerDriver, zoom, bounds, multiplePoints, animate);
            } else {
                self.initialMyUbication(true);
            }
        },
        hoursAttention: function hoursAttention(data, callback) {
            var self = this;
            if (self.debugConstruct) {
                console.log("START:::hoursAttention:::self.configCliente", self.configCliente);
            }
            var date = new Date();
            var hora = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            var inicio = self.configCliente.hora_inicio_atencion;
            var fin = self.configCliente.hora_fin_atencion;
            if (typeof inicio == "undefined" || typeof fin == "undefined" || !nw.evalueData(inicio) || !nw.evalueData(fin) || inicio === null || fin === null || inicio == "00:00:00" && fin == "00:00:00") {
                callback(true);
                return;
            }
            var dt = inicio.split(":");
            var hora_inicio = parseInt(dt[0]) + parseInt(1) + ":" + dt[1] + ":" + dt[2]
            if (typeof data !== "undefined") {
                if (data.hora >= hora_inicio) {
                    callback(true);
                } else {
                    nw.dialog(nw.tr("la hora del servicio tiene que ser igual o mayor a") + " " + hora_inicio);
                    self.pedirVar = false;
                    return;
                }
            } else {
                if (inicio > hora || fin < hora) {
                    nw.dialog(nw.tr("Nuestro horario de atención es de") + " " + inicio + " " + nw.tr("hasta") + " " + fin + " " + nw.tr("solo se podrán reservar servicios una hora despues de la hora inicio de atención"), aceptar, cancelar, {textCancel: "Cancelar", textAccept: "Continuar"});
                } else {
                    callback(true);
                }
                function cancelar() {
                    return;
                }
                function aceptar() {
                    self.__hourAttention = hora;
                    callback(true);
                }
            }
        },
        createActionsInputsSearchDirections: function createActionsInputsSearchDirections() {
            var self = this;
            var fil = new f_2_createActionsInputsSearchDirections();
            fil.construct(self);
        },
        cancelservice: function cancelservice() {
            var self = this;
            clearInterval(self.inte);
            self.circu = false;
            self.servicio_nom = false;
            self.num_mascota = 0;
            self.ui.address.setVisibility(true);
            self.ui.address_destino.setValue("");

            var zoom = 17;
            var bounds = [
                {"lat": self.geo.latitude, "lng": self.geo.longitude}
            ];
            var multiplePoints = false;
            nwgeo.centerMap(self.map, self.markerMyPosition, false, 17, zoom, bounds, multiplePoints);

            self.activeNormal();
            self.hiddenWaitingDriver();
            self.loadInitial();
            self.campo = "address";
            self.initservice = false;


            if (self.actEnRuta == true) {
                if (typeof self.polylineRuta !== "undefined" && self.polylineRuta !== null) {
                    self.polylineRuta.setMap(null);
                    delete self.polylineRuta;
                }
                self.actEnRuta = false;
            }
            if (self.markerDriver !== false) {
                self.markerDriver.setMap(null);
            }
            self.fram = document.querySelector(".iframe");
            if (self.fram) {
                self.fram.remove();
            }

        },
        iniciarWatchPosition: function iniciarWatchPosition() {
            var self = this;
            nwgeo.watchMapPosition(function (position) {
                if (self.debug) {
                    console.log("self.serviceActive", self.serviceActive);
                }
                if (self.serviceActive === true) {
                    if (self.debug) {
                        console.log("PPPPP position", position);
                    }
                    var sendPos = {};
                    sendPos.lat = position.coords.latitude;
                    sendPos.lng = position.coords.longitude;

                    self.geo.latitude = sendPos.lat;
                    self.geo.longitude = sendPos.lng;

                    if (self.debug) {
                        console.log("self.markerMyPosition", self.markerMyPosition);
                    }
                    if (nw.evalueData(self.markerMyPosition)) {
                        nwgeo.setPositionMarker(self.markerMyPosition, sendPos.lat, sendPos.lng);
                    }
                }
                self.activeWatchPosition = true;
            });
        },
        configuracionServi: function configuracionServi(callback) {
            var self = this;
            var fil = new f_0_configuracionServi();
            fil.construct(self, callback);
        },
        setHours: function setHours(mins) {
            var self = this;
            var actual = nw.getActualFullDate();
            var fecha = self.ui.fecha.getValue();
            var hora = self.ui.hora.getValue();
//            var fecha = actual.split(" ")[0];
//            var hora = actual.split(" ")[1];
            var fechahora = fecha + "T" + hora;
            var f_init = nw.addMinutesToDate(actual, parseInt(mins));
            console.log("fechahora", fechahora);
            console.log("f_init", f_init);
            var spl = f_init.split("T");
            var fecha_add = spl[0];
            var hora_add = spl[1];
            var changeDate = true;
            var changeHour = true;
            if (nw.utils.evalueData(fecha) && nw.utils.evalueData(hora)) {
                if (fechahora > f_init) {
                    if (nw.utils.evalueData(fecha)) {
                        if (nw.utils.str_replace("-", "", fecha) >= nw.utils.str_replace("-", "", fecha_add)) {
                            changeDate = false;
                        }
                    }
                    if (nw.utils.evalueData(hora)) {
                        if (nw.utils.str_replace(":", "", hora) + ":00" >= nw.utils.str_replace(":", "", hora_add)) {
                            changeHour = false;
                        }
                    }
                }
            }
            if (changeDate) {
                self.ui.fecha.setValue(fecha_add);
            }
            if (changeHour) {
                self.ui.hora.setValue(hora_add);
            }
        },
        createNavTableFavoritos: function createNavTableFavoritos() {
            var self = this;
            var canvas = self.canvas + " .favoritos_group";
            var nav = new l_navtable_favoritos();
            nav.construct(canvas, self);
            self.navTableFavoritos = nav;
            main.navTableFavoritos = self.navTableFavoritos;
        },
        createNavTableParadas: function createNavTableParadas() {
            var self = this;
            var canvas = self.canvas + " .paradas_group";
            var nav = new l_navtable_paradas();
            nav.construct(canvas, false, self);
            self.navTable = nav;
        },
        actionInPaxTotal: function actionInPaxTotal() {
            var self = this;

            nw.utils.addClass(".contenedor_azul", "containBtnFooter_group_fix_show_pass");

            self.ui.paradas_adicionales_iniciales_creacion.setVisibility(true);
            var max = 10;
            if (nw.utils.evalueData(self.configCliente.tarifas_fijas_usa_valor_por_paradas_pax_maximos)) {
                max = parseInt(self.configCliente.tarifas_fijas_usa_valor_por_paradas_pax_maximos);
            }
            var data = {};
            for (var i = 0; i < max; i++) {
                data[i + 1] = i + 1;
            }
            self.ui.paradas_adicionales_iniciales_creacion.populateSelectFromArray(data);
            self.ui.paradas_adicionales_iniciales_creacion.setValue(1);

            self.ui.paradas_adicionales_iniciales_creacion.change(function () {
                if (!document.querySelector(".buttons_group_fix_pago_group")) {
                    return false;
                }
                var val = self.ui.paradas_adicionales_iniciales_creacion.getValue();
                var valMax = "10";
                if (nw.utils.evalueData(self.configCliente.tarifas_fijas_usa_valor_por_paradas_pax_maximos)) {
                    valMax = self.configCliente.tarifas_fijas_usa_valor_por_paradas_pax_maximos;
                }
                console.log("val", val);
                console.log("val.val", val.val);
                console.log("valMax", valMax);
                if (parseInt(val.val) >= parseInt(valMax)) {
                    var msg = "Lo sentimos, ha excedido el límite de pasajeros, póngase en contacto con la central.";
                    if (nw.utils.evalueData(self.configCliente.tarifas_fijas_usa_valor_por_paradas_mensaje_maximo)) {
                        msg = self.configCliente.tarifas_fijas_usa_valor_por_paradas_mensaje_maximo;
                    }
                    nw.dialog(msg);
                    self.ui.paradas_adicionales_iniciales_creacion.setValue(parseInt(valMax) - 1);
                    return false;
                }
                self.traeTarifas.evalueContinuarPoliLyne();

            });
        },
        changeForma: function changeForma() {
            var self = this;
            self.ui.forma.change(function () {
                var val = self.ui.forma.getValue();
                if (val === "horas") {
                    self.tipo = "horas";
//                    self.ui.confirmar_ub.setVisibility(true);
                    self.ui.address_destino.setVisibility(false);
                    self.ui.address_destino.setRequired(false);
//                    self.ui.address_destino.setValue("");
                    nwgeo.removeMarker(self.markerDestino);
                    nwgeo.centerMap(self.map, self.markerMyPosition, false, 17);
                    nwgeo.removeAllPolyLines();
                } else {
                    self.campo = "address_destino";
                    self.cleanPre();
                    self.setPositionTwo();
                    self.ui.confirmar_ub.setVisibility(false);
                    self.ui.address_destino.setVisibility(true);
                    self.ui.address_destino.setRequired(true);
                }
            });
        },
        setDataPago: function setDataPago(pp) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            if (typeof pp !== "undefined") {
                up = pp;
            }
            var tipo = "efectivo";
            self.ui.tipo_pago.html("");
            var data = {};
            data["efectivo"] = nw.tr("Efectivo");
            self.ui.tipo_pago.populateSelectFromArray(data);
            self.ui.tipo_pago.setValue(nw.tr("efectivo"));
            if (!nw.evalueData(up.metodo_de_pago)) {
                up.metodo_de_pago = "efectivo";
            }
            if (up.metodo_de_pago === "credito") {
                self.ui.tipo_pago.html("");
                tipo = "tarjeta_credito";
                var data = {};
                data["tarjeta_credito"] = "Tarjeta Crédito";
                self.ui.tipo_pago.populateSelectFromArray(data);
                self.ui.tipo_pago.setValue("tarjeta_credito");
                self.ui.tarjeta_id.setValue(up.id_tarjeta_credito_metodo);
                self.ui.tarjeta.setValue(up.name_tarjeta_credito_metodo);
            } else if (up.metodo_de_pago != "credito" && up.metodo_de_pago != "efectivo") {
                self.ui.tipo_pago.html("");
                tipo = "tarjeta_credito";
                var data = {};
                data[up.metodo_de_pago] = up.metodo_de_pago;
                self.ui.tipo_pago.populateSelectFromArray(data);
                self.ui.tipo_pago.setValue(up.metodo_de_pago);
                self.ui.tarjeta_id.setValue(up.id_tarjeta_credito_metodo);
                self.ui.tarjeta.setValue(up.name_tarjeta_credito_metodo);
            }


            self.changePago(tipo);

            self.ui.tipo_pago.changeValue(function (e) {
                var d = new f_metodo_pago();
                d.construct(function (ls) {
                    ls.metodo_de_pago = ls.metodo;
                    self.setDataPago(ls);
                });
            });
        },
        changePago: function changePago(pr) {
            var self = this;
            nw.removeErrorField();
            var val = self.ui.tipo_pago.getValue();
            if (typeof pr !== "undefined") {
                val = pr;
            }
            if (val === "tarjeta_credito") {
                self.ui.tarjeta.setVisibility(true);
                self.ui.tarjeta.setRequired(true);
            } else {
                self.ui.tarjeta.setVisibility(false);
                self.ui.tarjeta.setRequired(false);
            }
            self.reziseMap();
        },
        reziseMap: function reziseMap(he) {
            var self = this;
            self.ui.mapa.addClass("mapa_maxheight");
            var h = 0;
            if (nw.evalueData(he)) {
                h = he;
            } else {
                h = self.ui.pago_group.height();
            }
            if (self.debug) {
                console.log("height", he);
                console.log("reziseMap h", h);
            }
            self.ui.mapa.css({"max-height": "calc(100% - " + h + "px)"});
        },
        reziseNormalMap: function reziseNormalMap() {
            var self = this;
            self.ui.mapa.removeClass("mapa_maxheight");
            self.ui.mapa.css({"max-height": "100%"});
        },
        pedir: function pedir() {
            var self = this;
            var data = self.getRecord();
            console.log("data", data);
            var up = nw.userPolicies.getUserData();
            console.log("datos up en guardar", up);
            console.log("datos hourattencion", self.__hourAttention);
//            if (!self.validate()) {
//                return false;
//            }
            if (self.debugConstruct) {
                console.log("START:::pedir");
            }
            self.segundosespera = 0;
            if (typeof self.__hourAttention !== "undefined") {
                self.hoursAttention(data, function (callback) {
                    self.save();
                });
            } else {
                self.save();
            }
            document.querySelector(".countWait").innerHTML = "0";
        },
        noHayServicios: function noHayServicios() {
            var self = this;
            nw.remove(".ofertas_container");
            self.notService(function () {
                self.segundosespera = 0;
                self.reziseNormalMap();
                function aceptar() {
                    self.pedir();
                }
                function cerrar() {
                    nw.loadHome();
                    self.loadInitial();
                    self.activeNormal();
                    self.servicesNotAttended();
                }
                var options = {"textAccept": "Volver a intentar", "textCancel": "Cancelar viaje"};
                nw.dialog("Lo sentimos, no hemos encontrado un conductor para su destino.", aceptar, cerrar, options);
                nw.remove(".ofertas_container");
                main.destroyQueryOfertas();
            });
        },
        servicesNotAttended: function servicesNotAttended() {
            var self = this;
//            if (self.debugConstruct) {
            console.log("START_LAUNCH:::::::::::::: servicesNotAttended");
//            }
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id = main.id_service_active;
            data.nombre = up.nombre;
            data.apellido = up.apellido;
            data.email = up.email;
            data.celular = up.celular;
            data.empresa = up.empresa;
            data.domain_rpc = config.domain_rpc;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
//                if (self.debugConstruct) {
                console.log("RESPONSE_SERVER:::::::::::::: servicesNotAttended", r);
//                }
                console.log("servicesNotAttended", r);
            };
            rpc.exec("sendEmailNotAttended", data, func);
        },
        notService: function notService(callback) {
            var self = this;
            nw.remove(".ofertas_container");
            self.reziseNormalMap();
            clearInterval(self.inte);
            self.circu = false;
            self.clearIntervalo();
            self.ui.address_destino.setVisibility(true);
            self.ui.address.setVisibility(true);
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id = main.id_service_active;
            data.usuario = up.usuario;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                main.registerServiceInFirebase(main.id_service_active);
                nwgeo.removeAllPolyLines();
                self.hiddenWaitingDriver();
                nw.remove(".ofertas_container");
                callback();
            };
            rpc.exec("notService", data, func);
        },
        servicioTarifas: function servicioTarifas() {
            var self = this;
            var val = self.ui.tipo_servicio.getValue();
            console.log("self.ui.tipo_servicio", val);
            if (val === "reservado") {
                var minsadd = self.minutos_agregar_hora;
                console.log(self.minutos_agregar_hora)
                console.log(minsadd)
                if (self.minutos_agregar_hora) {
                    minsadd = self.minutos_agregar_hora;
                    self.showHiddenDate(true, minsadd);
                } else {
                    self.showHiddenDate(true, minsadd);
                }
            } else {
//                self.showHiddenDate(self.__show, 0);
                self.showHiddenDate(true, 0);
            }
        },
        changeServicio: function changeServicio() {
            var self = this;
            self.ui.tipo_servicio.change(function () {
//            $(self.canvas + " .tipo_servicio").change(function () {
                var val = self.ui.tipo_servicio.getValue();
                console.log("self.ui.tipo_servicio", val);
                if (val === "reservado") {
                    var minsadd = self.minutos_agregar_hora;
                    console.log(self.minutos_agregar_hora)
                    console.log(minsadd)
                    if (self.minutos_agregar_hora) {
                        minsadd = self.minutos_agregar_hora;
                        self.showHiddenDate(true, minsadd);
                    } else {
                        self.showHiddenDate(true, minsadd);
                    }
                } else {
                    self.showHiddenDate(self.__show, 0);
                }
            });
        },
        validaFecha: function validaFecha(campo, texto) {
            var self = this;
            var data = self.ui[campo].getValue();
            if (nw.evalueData(data)) {
                var hoy = nw.getActualDate();
                var fecha = data;
//                var hoy = new Date().toJSON().slice(0, 10);
//                var fecha = new Date(data).toJSON().slice(0, 10);
                if (fecha < hoy) {
                    self.ui[campo].setValue(hoy);
                    nw.dialog(texto);
                    return;
                }
            }
            self.validaHora();
        },
        validaHora: function validaHora() {
            var self = this;
            var hora_servicio = self.ui.hora.getValue();
            var data = self.getRecord();
            if (data.tipo_servicio == "reservado" && nw.evalueData(hora_servicio)) {
                var fecha_minima_servi = self.revHora();
                var res = fecha_minima_servi.toString().split("/");
                var horaminima_res = res[1];

                hora_servicio = hora_servicio.split(":");
                if (hora_servicio[0].toString().length == 1) {
                    hora_servicio[0] = "0" + hora_servicio[0]
                }
                if (hora_servicio[1].toString().length == 1) {
                    hora_servicio[1] = "0" + hora_servicio[1];
                }
                if (hora_servicio[0] == "00") {
                    hora_servicio[0] == "01"
                }
                hora_servicio = hora_servicio[0] + ":" + hora_servicio[1] + ":00";
                if (horaminima_res > hora_servicio) {
                    var dat = data.fecha;
                    if (nw.evalueData(dat)) {
//                        var hoy = new Date().toJSON().slice(0, 10);
                        var hoy = nw.getActualDate();
                        var fecha = dat;
                        if (fecha < hoy) {
                            nw.dialog("Debe seleccionar una Hora mayor o igual a la actual para reservar.Verifique por favor");
                            self.ui.hora.setValue(horaminima_res);
                        }
                    }
                }
            }

        },
        revHora: function revHora() {
            var self = this;
            var fecha_actual = new Date();
            var fecha_minima_servi = new Date(fecha_actual.getTime() + self.minutos_agregar_hora * 60000);
            Date.prototype.toString = function () {
                var mes = (this.getMonth() + 1).toString();
                if (mes.length == 1) {
                    mes = "0" + mes;
                }
                var hora = this.getHours().toString(), minutos = this.getMinutes().toString(), segundos = this.getSeconds().toString();
                if (hora.length == 1) {
                    hora = "0" + hora;
                }
                if (minutos.length == 1) {
                    minutos = "0" + minutos;
                }
                if (segundos.length == 1) {
                    segundos = "0" + segundos;
                }
                return this.getFullYear() + "-" + mes + "-" + this.getDate() + "/" + hora + ":" + minutos + ":00";
            }
            return fecha_minima_servi;
        },
        showHiddenDate: function showHiddenDate(show, minutesAdd) {
            var self = this;
            var fil = new f_showHiddenDate();
            fil.construct(self, show, minutesAdd);
        },
        clearCircul: function clearCircul() {

        },
        createMapa: function createMapa() {
            var self = this;
            var fil = new f_1_createMapa();
            fil.construct(self);
        },
        enableOrientationArrow: function enableOrientationArrow() {
//            var self = this;
//            var fil = new f_enableOrientationArrow();
//            fil.construct(self);
        },
        continuar: function continuar(no_line) {
            var self = this;
            var fil = new f_traeTarifasContinua();
            fil.construct(self, no_line);
        },
//        no_data se usa para actualizar el valor con paradas adicionales
        mostrarServicios: function mostrarServicios(no_line, r, recargos, no_data) {
            var self = this;
            var fil = new f_pedir_0_mostrarServicios();
            fil.construct(self, no_line, r, recargos, no_data);
        },
        recargosConsult: function recargosConsult(callback) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.usuario = up.usuario;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (ra) {
                if (self.debug) {
                    console.log("recargosConsult", ra);
                }
                if (ra === "USUARIO_NO_EXISTE") {
                    nw.dialog("El usuario no existe o está inactivo");
                    return false;
                }
                window.localStorage.setItem("saldo", ra.saldo.saldo);
                var r = ra.recargos;
                callback(r);
            };
            rpc.exec("populateRecargos", data, func);
        },
        showPrecioSubservice: function showPrecioSubservice(valor_estimado, iva, distancia, tiempo, servi, others, count) {
            var self = this;
            var fil = new f_showPrecioSubservice();
            fil.construct(self, valor_estimado, iva, distancia, tiempo, servi, others, count);
        },
        showPrice: function showPrice(valor_estimado, iva, distancia, tiempo, servi, valor_tarifa_fija, others, count) {
            var self = this;
            var fil = new f_showPrice();
            fil.construct(self, valor_estimado, iva, distancia, tiempo, servi, valor_tarifa_fija, others, count);
        },
        getMaxDiscount: function getMaxDiscount(valor_total, descuento_maximo) {
            var self = this;
            var descuento = 0;
            var up = nw.userPolicies.getUserData();
            var saldo = up.saldo;
            if (parseInt(saldo) > 0) {
                var saldoCupo = parseInt(saldo);
                var y = parseInt(valor_total);
                var descuMaximo = parseInt(descuento_maximo);
                if (saldoCupo <= descuMaximo) {
                    descuMaximo = saldoCupo;
                }
                var disp = y - descuMaximo;
                if (disp < 0) {
                    descuento = y;
                } else
                if (disp >= 0) {
                    descuento = descuMaximo;
                }
            }
            return descuento;
        },
        cleanPre: function cleanPre() {
            var self = this;
            $(".estimado").remove();
            $(".mapa").removeClass("mapa_fix");
            self.ui.pago_group.removeClass("buttons_group_fix_pago_group");
            document.querySelector(".nw_widget_div_codigo_promo").classList.remove('visibe_promo');
            self.ui.contenedor_azul.removeClass("containBtnFooter_group_fix");
            self.ui.paradas_group.removeClass("containBtnFooter_group_fix");
            $(".btnMenuHeader").removeClass("btnMenuHeader_hidden");
            nwgeo.removeAllPolyLines();
        },
        generateCodeVerifi: function generateCodeVerifi(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        confirmaValor: function confirmaValor(callback) {
            var self = this;
            var fil = new f_confirmar_valor_negociacion();
            return  fil.construct(self, callback);
        },
        save: function save() {
            var self = this;
            if (main.configCliente.user_confirma_valor_pedir_service === "SI") {
                self.confirmaValor(function () {
                    cont();
                });
            } else {
                cont();
            }
            function cont() {
                var fil = new f_save_pedir_servicio();
                fil.construct(self);
            }
        },
        initIntervalo: function initIntervalo() {
            var self = this;
            if (main.configCliente.usa_firebase == "SI") {
                return;
            }
            clearTimeout(self.interval);
            clearInterval(self.interval);
            if (self.debugConstruct) {
                console.log("START::::: initIntervalo");
            }
            var time = self.timeIntervalo;
            self.interval = setInterval(function () {
                if (document.querySelector(".backInShowServices_show")) {
                    return false;
                }
                console.log("EJECUTA::::initIntervalo::::validaServiceActive::time", time);
                self.execFuncInterval();
            }, time);
        },
        execFuncInterval: function execFuncInterval() {
            var self = this;
            if (main.configCliente.usa_firebase == "SI") {
                return;
            }
            self.validaServiceActive(false, function (r) {
//                if (self.debugConstruct) {
                console.log("RESULT::::execFuncInterval::::validaServiceActive::", r);
//                }
            });
        },
        clearIntervalo: function clearIntervalo() {
            var self = this;
            clearTimeout(self.interval);
            if (self.debugConstruct) {
                console.log("START_CLEAR_INTERVAL::::clearIntervalo");
            }
        },
        updateVencidos: function updateVencidos(vencidos) {
            var self = this;
            if (self.debugConstruct) {
                console.log("START::::updateVencidos");
            }
//            return false;
            if (vencidos.length < 1) {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.vencidos = vencidos;
            data.usuario = up.usuario;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            console.log("updateVencidos:::sendDataServer", data);
            var func = function (r) {
//                if (self.debugConstruct) {
                console.log("updateVencidos:::responseServer", r);
//                }
            };
            rpc.exec("actualizaVencidos", data, func);
        },
        validaServiceActive: function validaServiceActive(first, callback, onlyResolveDataFirebase, dataFirebaseService) {
            var self = this;
            var fil = new f_3_validaServiceActive();
            fil.construct(self, first, callback, onlyResolveDataFirebase, dataFirebaseService);
        },
        resolveStatus: function resolveStatus(r) {
            var self = this;
            var fil = new f_4_resolveStatus();
            fil.construct(self, r);
        },
        showActualizarPrecio: function showActualizarPrecio() {
            var self = this;

            self.ui.actualizar_precio.setVisibility(true);

            console.log("showActualizarPrecio:::self.valor_total", self.valor_total);
            if (!nw.evalueData(self.valor_total)) {
                setTimeout(function () {
                    self.showActualizarPrecio();
                }, 5000);
            }
            self.ui.actual_precio.setValue(self.valor_total);

        },
        showWaitingDriver: function showWaitingDriver(dd, espera) {
            var self = this;
            if (self.debugConstruct) {
                console.log("START:::showWaitingDriver");
            }
            self.ui.actual_precio.setValue("");
            self.ui.actualizar_precio.setVisibility(false);
//            self.ui.confirmar_precio.setVisibility(false);

//            console.log("main.id_service_active", main.id_service_active);
//            alert("KO");

            if (self.serviceActive == false && self.configCliente.driver_puede_ofertar_valor_servicio === "SI") {
                self.showActualizarPrecio();
            }


//                alert("START:::showWaitingDriver");
            self.ui.address_destino.setVisibility(false);
            self.ui.address.setVisibility(false);
            $(".backInShowServices").removeClass("backInShowServices_show");
            document.querySelector(".centrar_mapa").style.display = "block";
//            self.ui.codigo_promo.setVisibility(false);
            self.ui.buscando_driver.addClass("buscando_driver_show");

            var animate = true;
            var zoom = 17;
            var bounds = [
                {"lat": self.geo.latitude, "lng": self.geo.longitude}
            ];
            var multiplePoints = false;
            nwgeo.centerMap(self.map, self.markerMyPosition, false, zoom, bounds, multiplePoints, animate);

            clearInterval(self.interCount);
            var count = 0;
            var min = 60;
            var minutosEspera = 1;
            if (nw.evalueData(self.configCliente.tiempo_notificacion_servicio)) {
                if (parseFloat(self.configCliente.tiempo_notificacion_servicio) > 0) {
                    min = parseFloat(self.configCliente.tiempo_notificacion_servicio) * 60;
                    minutosEspera = self.configCliente.tiempo_notificacion_servicio;
                }
            }

            if (!nw.evalueData(dd)) {
                dd = 0;
            }

            var mins = dd.toString().split(".")[0];
            var segs = dd.toString().split(".")[1];

            var id = "";
            if (nw.utils.evalueData(main.id_service_active)) {
                id = main.id_service_active;
            }
            nw.utils.remove(".titleesperaviaje");
            nw.utils.after(".countWait", "<span class='titleesperaviaje'>" + nw.utils.tr("Minutos de espera máximo") + ": <span class='spantimewait'>" + minutosEspera + " (mins)</span> #" + id + " </span> ");

            if (typeof self.segundosespera === "undefined") {
                self.segundosespera = 0;
            }

//            console.log("espera", espera)
//            console.log("dd", dd)
//            console.log("segs", segs);
            if (segs <= 0 && segs <= 1) {
                self.segundosespera = 0;
            }
            if (segs == 2) {
                self.segundosespera = 10;
            }
            if (segs >= 3 && segs <= 4) {
                self.segundosespera = 20;
            }
            if (segs >= 5 && segs <= 6) {
                self.segundosespera = 30;
            }
            if (segs >= 7 && segs <= 8) {
                self.segundosespera = 40;
            }
            if (segs >= 9 && segs <= 10) {
                self.segundosespera = 50;
            }
            self.interCount = setInterval(function () {
                var po = document.querySelector(".countWait");
//                var co = po.innerHTML;
//                count = parseInt(co) + 1;
//                count++;
                self.segundosespera++;
                var count = self.segundosespera;
                if (count <= min) {
                    var segundos = count.toString();
                    if (count >= 59) {
                        self.segundosespera = 0;
                    }
                    segundos = segundos.toString();
                    if (segundos.length == 1) {
                        segundos = "0" + segundos;
                    }
                    po.innerHTML = mins + ":" + segundos;
//                    po.innerHTML = count;
                }
            }, 1000);
            if (!document.querySelector(".cont-radar")) {
                self.getIcon();
            }
        },
        hiddenWaitingDriver: function hiddenWaitingDriver() {
            var self = this;
            self.ui.buscando_driver.removeClass("buscando_driver_show");
            var d = document.querySelector(".cont-radar");
            if (d) {
                d.remove();
            }
        },
        activeNormal: function activeNormal() {
            var self = this;
            var fil = new f_activeNormal();
            fil.construct(self);
        },
        activeAbordoCenterFirsTime: false,
        activeAbordo: function activeAbordo(r) {
            var self = this;
            var fil = new f_activeAbordo();
            fil.construct(self, r);
        },
        activeEnSitio: function activeEnSitio(r) {
            var self = this;
            var fil = new f_activeEnSitio();
            fil.construct(self, r);
        },
        activeEnRuta: function activeEnRuta(r) {
            var self = this;
            var fil = new f_activeEnRuta();
            fil.construct(self, r);
        },
        useChat: function useChat(datos) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            self.datos_servicio_activo = datos;

            var contw = document.querySelector('.containBtnsShareWarn');
            if (!contw) {
                var cont = document.querySelector('.f_crear_viaje');
                var divcon = document.createElement('div');
                divcon.className = "containBtnsShareWarn";
                if (cont) {
                    cont.appendChild(divcon);
                }
                var btn_share_travel = document.querySelector('.btn_share_travel');
                if (!btn_share_travel) {
                    var div = document.createElement('button');
                    div.innerHTML = '<i class="material-icons">share</i>';
                    div.className = 'btn_share_travel btn_sharetravel_initservice';
                    div.onclick = function () {
                        var link = config.domain_rpc + config.carpet_files_extern + "index.html?conf=" + domainExternConfigName + "&service=" + datos.id + "#f_ver_viaje";
                        var title = nw.utils.tr("Te comparto mi viaje en") + " " + config.name + "";
                        var body = nw.utils.tr("¡Hola! Soy") + " " + up.nombre + ", " + nw.utils.tr("te estoy compartiendo mi viaje en") + " " + config.name + ", " + nw.utils.tr("abre el siguiente link") + " " + link;
                        var li = nw.shareSocial(body, title);
                        if (!li) {
                            nw.utils.openLink(link, "_BLANK");
                        }
                    };
//                var cont = document.querySelector('.centrar_mapa');
                    if (divcon) {
                        divcon.appendChild(div);
                    }
                }
                if (!document.querySelector('.btn_warning')) {
                    var div = document.createElement('button');
                    div.innerHTML = '<i class="material-icons">report_problem</i>';
                    div.className = 'btn_warning btn_warning_initservice';
                    div.onclick = function () {
                        var novedades = function () {
                            var d = new f_novedades();
                            d.construct();
                            d.populate(datos);
                        };
                        var retrasos = function () {
                            var d = new f_chat();
                            d.construct(datos);
                            if (nw.evalueData(datos.token_conductor)) {
                                var up = nw.userPolicies.getUserData();
                                nw.sendNotificacion({
                                    title: nw.utils.tr("Nuevo mensaje de") + " " + up.nombre,
                                    body: up.nombre + ": " + nw.utils.tr("Me encuentro retrasado."),
                                    icon: "fcm_push_icon",
                                    sound: "default",
                                    data: "nw.dialog('" + nw.utils.tr("Nuevo mensaje: Me encuentro retrasado") + "')",
                                    callback: "FCM_PLUGIN_ACTIVITY",
                                    to: datos.token_conductor
                                });
                            }
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
                    };
//                var cont = document.querySelector('.centrar_mapa');
//                if (cont) {
                    if (divcon) {
                        divcon.appendChild(div);
                    }
                }
            }

            nw.remove('.btn_chat');
            var div = document.createElement('button');
            div.innerHTML = '<i class="material-icons">chat_bubble</i>';
            div.className = 'btn_chat btn_chat_initservice';
            div.onclick = function () {

                console.log("datos", datos);
                if (nw.evalueData(datos.id_parada)) {
                    datos.id = "_parada_" + datos.id_parada;
                }
                var d = new f_chat();
                d.construct(datos);
            };
            var cont = document.querySelector('.InfoDriverPlacasEtc');
            if (cont) {
                cont.appendChild(div);
            } else {
                setTimeout(function () {
                    self.useChat();
                }, 2000);
            }
        },
        framePositionConductor: function framePositionConductor(callback) {
            var self = this;
            return;
            var service = main.id_service_active;
            var up = nw.userPolicies.getUserData();
            var link = config.domain_rpc + "/nwlib6/nwproject/modules/webrtc/v4/index.html?myID=" + up.id_usuario + "&onlyChat=true&room=movilmove_number_" + service + "&domain=" + config.domain_rpc;
//            var link = "nwlib6/nwproject/modules/webrtc/v4/index.html?myID=" + up.id_usuario + "&onlyChat=true&room=movilmove_number_" + service + "&domain=" + config.domain_rpc;
//            var link = "nwlib6/nwproject/modules/webrtc/v4/index.html?room=movilmove_number_" + service + "&video=false&audio=false&usejoin=false&chat=true&useServer=false&openchat=true";
            var body = document.querySelector('body');
            self.fram = document.createElement("iframe");
            self.fram.className = "iframechat iframechat_";
            self.fram.style = "display:none;"
            self.fram.name = "iframechat_";
            self.fram.id = "iframechat_";
            self.fram.src = link;
            body.appendChild(self.fram);
//            self.markerDriver = false;
            clearInterval(self.interIframeSend);
            self.countShotNumPosDriver = 0;
            self.interIframeSend = setInterval(function () {
                self.countShotNumPosDriver++;
            }, 1000);
            self.intervalEsperaFirame = null;
            self.fram.onload = function () {
                window.addEventListener('message', function (e) {
                    if (self.debugConstruct) {
                        console.log("RECEIVE_MESSAGE_DATA_IFRAME_DRIVER::framePositionConductor:::self.fram.onload::::message::::e:::", e);
                    }
                    if (e.data.room == "movilmove_number_" + service) {
                        if (e.data.text === "CANCELADO_DRIVER") {
                            console.log("CANCELADO_DRIVER", e);
                            if (self.debugConstruct) {
                                console.log("RECEIVE_MESSAGE_DATA_IFRAME_DRIVER::CANCELADO_DRIVER", e);
                            }
                            self.userCancelaService();
                            return;
                        }
                    }
                    if (e.type === "message") {
                        if (self.debugConstruct) {
                            console.log("RECEIVE_MESSAGE_DATA_IFRAME_DRIVER::createMarkerDriver", e);
                        }
                        if (self.countShotNumPosDriver > 5) {
                            clearTimeout(self.intervalEsperaFirame);
                            self.createMarkerDriver(e);
                            self.countShotNumPosDriver = 0;
                        } else {
                            self.intervalEsperaFirame = setTimeout(function () {
                                self.createMarkerDriver(e);
                                self.countShotNumPosDriver = 0;
                            }, 5000);
                        }
                    }
                });
                if (typeof callback !== "undefined") {
                    callback();
                }
            };
            if (self.debugConstruct) {
                console.log("CREATE_IFRAME_DRIVER_DATATRANSFER:::f_00_markers:::createMarkerDriver");
            }
        },
        userCancelaService: function userCancelaService(t) {
            var self = this;
            self.cancela_conductor = true;
            nw.dialog("El conductor ha cancelado el servicio");

//            nw.openAppToFront();
//            nw.turnScreenOn();
//            nw.turnScreenOnAndUnlocked();

            self.ui.address.setVisibility(true);
            self.ui.address_destino.setValue("");
            nwgeo.centerMap(self.map, self.markerMyPosition, false, 17);
            self.activeNormal();
            self.servicio_nom = false;
            self.num_mascota = 0;
            self.campo = "address";
            self.initAbordo = false;
            self.loadInitial();
            self.campo = "address";
            self.initservice = false;
            self.removeMarker4();
            self.fram = document.querySelector(".iframe");
            if (self.fram) {
                self.fram.remove();
            }

        },
        htmlDatosConductor: function htmlDatosConductor(r, title, tel) {
            var self = this;
            var h = "";
            h += "<div class='containInfoDriver'>";
            var classWid = "", classInfoColor = "";
            if (typeof tel !== 'undefined') {
//                classWid = "InfoDriverPhotoAndTitleAll";
                classInfoColor = "titleInfoColor";
            }
            h += "<div class='InfoDriverPhotoAndTitle " + classWid + "'>";
            h += "<div class='photoDriver' style='background-image: url(" + config.domain_rpc + r.conductor_foto + ")'></div>";
            h += "<div class='nameDriver'>";
            h += "<span class='nameDriverSpan'>" + r.conductor + "</span>";
            h += "<div class='containerPuntajeDriverSpan'>";
            if (nw.evalueData(self.puntajeDriver)) {
                h += self.showStarsDriver();
            }
            h += "</div>";
            h += "<div class='titleInfoDriver " + classInfoColor + "'>" + title + "</div>";
            h += "</div>";
            h += "</div>";

            var indicativo = "57";
            if (nw.evalueData(config.indicativo)) {
                indicativo = config.indicativo;
            }

//            if (typeof tel === 'undefined') {
            h += "<div class='InfoDriverPlacasEtc'>";
            h += "<div class='placaDriver'>";
            h += "<strong>" + r.placa + "</strong>";
            if (nw.evalueData(r.vehiculo_text)) {
                h += "</br><span class='infovehicle_inservice'>" + r.vehiculo_text + "</span>";
            }
            if (nw.evalueData(r.vehiculo_color)) {
                h += "</br><span class='infovehicle_inservice'>" + r.vehiculo_color + "</span>";
            }
            h += "</div>";
            if (main.configCliente.telefono_conductor_visible_para_pasajero !== "NO") {
                h += "<button class='Infotel'>";
                h += "<i class='material-icons'>local_phone</i>";
                h += "<a href='tel:+" + indicativo + " " + r.conductor_celular + "'>";
                h += "</button>";
            }

            h += "<div class='tiempoEstimadoDriver'>Tiempo estimado de llegada en " + r.tiempo_estimado + " minutos</div>";
            h += "</div>";
//            }

            h += "</div>";

            self.createDataDriver = true;

            return h;
        },
        showStarsDriver: function showStarsDriver() {
            var self = this;
            var puntaje = self.puntajeDriver;
            if (!puntaje) {
                puntaje = 0;
            }
            var dataPuntaje = "";
            dataPuntaje += "<span class='puntajeDriverSpan'><span style='color:#656363; margin-right: 4px;'>" + puntaje + "</span>";
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
        pedirDataAirpot: function pedirDataAirpot(callback) {
            var self = this;
            var fil = new f_pedirDataAirpot();
            fil.construct(self, callback);
        },
        formDatosCarga: function formDatosCarga(callback) {
            var self = this;
            var fil = new f_formDatosCarga();
            fil.construct(self, callback);
        },
        loadInitial: function loadInitial() {
            var self = this;

            self.resetValuesHome();

            var data = self.getRecord();
//            nw.console.log("loadInitial:::data", data);

            $(".backInShowServices").removeClass("backInShowServices_show");
            $(".nw_widget_div_backAdondevamos").removeClass("nw_widget_div_backAdondevamos_show");
            $(".btnMenuHeader").removeClass("btnMenuHeader_hidden");
            self.ui.contenedor_adondevamos.removeClass("contenedor_adondevamos_hidden");
            self.ui.contenedor_address.removeClass("contenedor_address_show");

//            nw.removeClass(".contenedor_adondevamos", "contenedor_adondevamos_hidden");
//            nw.removeClass(".contenedor_address", "contenedor_address_show");

//            self.ui.contenedor_address.addClass("contenedor_address_show");
            self.reziseNormalMap();
            self.clean();

            if (nw.utils.evalueData(data.address)) {
                self.ui.address.setValue(data.address);
            }

            self.clearIntervalo();
            self.cleanMarkerDestino();
            self.removeMarker4();
            self.fin = false;
//            self.ui.address_destino.setVisibility(false);
            self.showHiddenDate(false, 0);
            self.ui.datos_vehiculo_elegido.setVisibility(false);
            self.ui.datos_vehiculo_elegido.setRequired(false);

            if (self.configCliente.app_para != "CARGA") {
                self.ui.descricion_carga.setVisibility(false);
                self.ui.descricion_carga.setRequired(false);
            }
            if (self.configCliente.pasajeroDescripcionCarga == "NO") {
                self.ui.des_carga.setVisibility(false);
                self.ui.descricion_carga.setVisibility(false);
                self.ui.descricion_carga.setRequired(false);
            }
            if (self.configCliente.pasajeroDescripcionCarga == "SI") {
                self.ui.des_carga.setVisibility(true);
                self.ui.descricion_carga.setVisibility(true);
                self.ui.descricion_carga.setRequired(true);
            }

            self.lineRutaFinal = false;
            self.activeWatchPosition = false;
            self.line = false;
            self.markerDriver = false;
            self.serviceActive = false;
            self.servicioTomado = false;
            self.ciudad_destino = false;
            self.name_place_destino = false;
            self.name_place_destino_text = false;

            self.__typeOrigin = false;
            self.__typeOriginOne = false;

            self.hiddenWaitingDriver();
            document.querySelector(".centrar_mapa").style.display = "block";

            nw.remove(".containBtnsShareWarn");

            nwgeo.cleartWatchPostion();

            var frma = document.querySelector(".iframechat");
            if (frma) {
                document.body.removeChild(frma);
            }
            self.ui.pago_group.removeClass("buttons_group_fix_pago_group_hidden");
            self.ui.driver_en_camino.removeClass("driver_en_camino_show");
//            self.initialMyUbication();
            self.cleanPre();

            var animate = false;
            var zoom = 19;
            var bounds = [
                {"lat": self.geo.latitude, "lng": self.geo.longitude}
            ];
            var multiplePoints = false;
            nwgeo.centerMap(self.map, self.markerMyPosition, false, zoom, bounds, multiplePoints, animate);

            nw.loadHome();
            self.muestraAdondeVamos();

            if (nw.evalueData(self.configCliente.tarifas_fijas_usa_valor_por_paradas)) {
                if (self.configCliente.tarifas_fijas_usa_valor_por_paradas == 'SI') {
                    self.ui.paradas_adicionales_iniciales_creacion.setValue(1);
                }
            }

        },
        getIcon: function getIcon() {
            var self = this;
            var icon = '<svg viewBox="0 0 370 370">';
            icon += '<g id="radar-bg">';
            icon += '<path fill="#FFFFFF" d="M185,365C85.75,365,5,284.25,5,185C5,85.75,85.75,5,185,5c99.25,0,180,80.75,180,180C365,284.25,284.25,365,185,365z"/>';
            icon += '<path fill="#CC0000" d="M185,10c96.65,0,175,78.35,175,175s-78.35,175-175,175S10,281.65,10,185S88.35,10,185,10 M185,0c-24.97,0-49.2,4.89-72.01,14.54c-22.03,9.32-41.81,22.66-58.8,39.64s-30.32,36.77-39.64,58.8C4.89,135.8,0,160.03,0,185s4.89,49.2,14.54,72.01c9.32,22.03,22.66,41.81,39.64,58.8c16.99,16.99,36.77,30.32,58.8,39.64C135.8,365.11,160.03,370,185,370s49.2-4.89,72.01-14.54c22.03-9.32,41.81-22.66,58.8-39.64c16.99-16.99,30.32-36.77,39.64-58.8C365.11,234.2,370,209.97,370,185s-4.89-49.2-14.54-72.01c-9.32-22.03-22.66-41.81-39.64-58.8c-16.99-16.99-36.77-30.32-58.8-39.64C234.2,4.89,209.97,0,185,0L185,0z"/>';
            icon += '</g>';
            icon += '<path id="radar-pattern" opacity="0.2" fill="none" stroke="#CC0000" stroke-width="4" stroke-miterlimit="10" d="M308.5,185c0,68.21-55.29,123.5-123.5,123.5S61.5,253.21,61.5,185S116.79,61.5,185,61.5S308.5,116.79,308.5,185z M185,114.5c-38.94,0-70.5,31.56-70.5,70.5s31.56,70.5,70.5,70.5s70.5-31.56,70.5-70.5S223.94,114.5,185,114.5z"/>'
            icon += '<image overflow="visible" opacity="0.9" width="100%" height="100%" id="radar-gradient" xlink:href="https://raw.githubusercontent.com/fladireis/fladireis.github.io/master/angle-gradient2.png" >'
            icon += '</image>'
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
            icon += '</svg>'
            var div = document.createElement('div');
            div.className = 'cont-radar';
            div.innerHTML = "<p>" + nw.utils.tr("Buscando") + "...</p>" + icon;

            document.querySelector(self.canvas).append(div);
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
        muestraAdondeVamos: function muestraAdondeVamos() {
            var self = this;
            $(".nw_widget_div_backAdondevamos").removeClass("nw_widget_div_backAdondevamos_show");
            $(".btnMenuHeader").removeClass("btnMenuHeader_hidden");
            self.ui.contenedor_adondevamos.removeClass("contenedor_adondevamos_hidden");
            self.ui.contenedor_address.removeClass("contenedor_address_show");
            self.ui.favoritos_group.removeClass("favoritos_group_show");

//            nw.removeClass(".contenedor_adondevamos", "contenedor_adondevamos_hidden");
//            nw.removeClass(".contenedor_address", "contenedor_address_show");
//            nw.removeClass(".favoritos_group", "favoritos_group_show");

//        nw.back();
//        nw.loadHome();
//        window.location.hash = 'whatever';
        },
        muestraAddressInit: function muestraAddressInit() {
            var self = this;
            $(".nw_widget_div_backAdondevamos").addClass("nw_widget_div_backAdondevamos_show");
            $(".btnMenuHeader").addClass("btnMenuHeader_hidden");
            self.ui.contenedor_adondevamos.addClass("contenedor_adondevamos_hidden");
            self.ui.contenedor_address.addClass("contenedor_address_show");

//            nw.addClass(".contenedor_adondevamos", "contenedor_adondevamos_hidden");
//            nw.addClass(".contenedor_address", "contenedor_address_show");

            self.ui.address_destino.setVisibility(true);
            self.ui.address_destino.click();
            var os = nw.getMobileOperatingSystem();
            if (os === "ANDROID") {
                self.ui.address_destino.blur();
                self.ui.address_destino.focus();
            }
            setTimeout(function () {
                self.ui.favoritos_group.addClass("favoritos_group_show");
            }, 300);
//        window.location.hash = 'muestraAddressInit';
        },
        activeReceivedMsgFrame: function activeReceivedMsgFrame() {
            var self = this;
            window.addEventListener('message', function (e) {
                console.log("ReceivedMsgFrame", e);
                var service = main.id_service_active;
                if (e.data.room === "movilmove_number_" + service) {
                    if (e.data.text === "CANCELADO") {
                        self.userCancelaService();
                    }
                } else
                if (e.type === "message") {
                    if (self.countShotNumPosDriver > 5) {
                        clearTimeout(self.intervalEsperaFirame);
                        if (self.debug) {
                            console.log("create createMarkerDriver in framePositionConductor");
                        }
                        self.createMarkerDriver(e);
                        self.countShotNumPosDriver = 0;
                    } else {
                        self.intervalEsperaFirame = setTimeout(function () {
                            if (self.debug) {
                                console.log("create createMarkerDriver in framePositionConductor");
                            }
                            self.createMarkerDriver(e);
                            self.countShotNumPosDriver = 0;
                        }, 5000);
                    }
                }
            });
            if (self.debugConstruct) {
                console.log("activeReceivedMsgFrame created");
            }
        },
        validateDataSolicitudService: function validateDataSolicitudService(usu) {
            var self = this;
            if (self.debug) {
                console.log("dta", usu);
            }
            var rta = true;
//            if (!nw.evalueData(usu.ciudad_origen)) {
//                nw.dialog("La ciudad de origen está vacía, verifique por favor la dirección ingresada.");
//                rta = false;
//            }
//            if (!nw.evalueData(usu.ciudad_destino)) {
//                nw.dialog("La ciudad o municipio de destino está vacía, verifique por favor la dirección ingresada.");
//                rta = false;
//            }
            if (!rta) {
                nw.loadingRemove();
                self.loadInitial();
                self.activeNormal();
                self.reziseNormalMap();
            }
            return rta;
        }
    }
});