nw.Class.define("l_historico_viajes", {
    extend: nw.lists,
    construct: function () {
        var self = this;
//        self.usePagination = true;
//        self.usePaginationData = {
//            pageSize: 10
//        };
        self.showContextMenu = true;
        self.id = "l_historico_viajes";
        self.setTitle = "Viajes";
        self.html = "Viajes";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Cerrar";
        self.estado = "RESERVADO";
        self.acumulado = 0;
        self.configCliente = main.configCliente;
        var up = nw.userPolicies.getUserData();
        self.createBase();
        self.event = new Event('ver_viaje');
        console.log("self.configCliente", self.configCliente);
        var columns = [
            (function () {
                var campo = {};
                if (self.configCliente.mostrar_valor_conductor === "SI") {
                    var campo = {
                        name: "valor_total_servicio",
                        label: "",
                        mode: "money"
                    }
                } else {
                    var campo = {
                        name: "utilidad_conductor",
                        label: "",
                        mode: "money"
                    }
                }
                return campo;
            })(),
            {
                name: "estado_atiempo",
                label: "<i class='material-icons' style='visibility: hidden;'>date_range</i>"
            },
            {
                name: "fecha_hora",
                label: "<i class='material-icons' style='visibility: hidden;'>date_range</i>",
                mode: "date_format"
            },
            {
                name: "origen",
                label: "<span class='containOrigDestPoint containOrigDestPointA'>A</span>"
            },
            {
                name: "destino",
                label: "<span class='containOrigDestPoint containOrigDestPointB'>B</span>"
            },
            {
                name: "paradas_adicionales_iniciales_creacion",
                label: "<img src='" + config.domain_rpc + "/lib_mobile/pax.svg' class='img_pax_history' /> x ",
                mode: "toolTip"
            },
            {
                name: "id",
                label: "<span class='id_service_historico'>№</span> ",
                mode: "toolTip"
            },
            {
                name: "nombre_empresa_cliente",
                label: "Empresa: "
            },
            {
                name: "tipo_servicio_text",
                label: "Tipo: "
            },
            {
                name: "estado_text",
                label: ""
            },
            {
                name: "tipo_pago_text",
                label: ""
            },
            {
                name: "vuelo_numero",
                label: "",
                mode: "toolTip"
            },
            {
                name: "observaciones_servicio",
                label: "",
                mode: "toolTip"
            },
            {
                name: "descricion_carga",
                label: "",
                mode: "toolTip"
            },
            {
                name: "iniciar_servicio",
                label: "",
                type: "button"
            }
        ];
        self.setColumns(columns);

        var filters = [
            {
                type: 'dateField',
                label: '',
                placeholder: 'Fecha Inicial',
                name: 'fecha_inicial'
            },
            {
                type: 'dateField',
                label: '',
                placeholder: 'Fecha Final',
                name: 'fecha_final'
            },
//            {
//                type: 'textField',
//                label: '',
//                placeholder: 'Valor servicios',
//                name: 'valor_total',
//                enabled: false
//            },
            {
                style: 'background: red; color: #fff;',
                type: 'button',
                label: 'Buscar',
                placeholder: '',
                name: 'buscar',
                enabled: false
            }
        ];
        if (self.configCliente.usa_informe_conductor == "SI") {
            var info = {
                style: 'background: red; color: #fff;',
                type: 'button',
                label: 'Informe',
                placeholder: '',
                name: 'informe'
            };

            filters.push(info);
        }
        self.createFilters(filters);

        self.buttons = [];
        var css = "background-color: #ffffff;color:#333;font-weight: bold;border-bottom: 1px solid #ccc;";
        var css1 = "padding: 3px; background: transparent; box-shadow: 0px 0px 0px 0px; color: #ffff;";

        self.buttons.push(
                {
//                    style: "color:#6a6767;",
//                    colorBtnBackIOS: "#6a6767",
                    style: css,
                    colorBtnBackIOS: "#333",
                    icon: "material-icons playlist_add normal",
                    position: "top",
                    name: "programados",
                    label: "<span class='titlehistoenc'>Reservas</span>",
                    callback: function (a) {
                        self.action("RESERVADO", a);
                        self.mostrar(false);
                    }
                },
                {
                    style: "color:#6a6767;",
                    colorBtnBackIOS: "#6a6767",
                    icon: "material-icons playlist_play normal",
                    position: "top",
                    name: "activos",
                    label: "<span class='titlehistoenc'>Activos</span>",
                    callback: function (a) {
                        self.action("ACTIVOS", a);
                        self.mostrar(false);

                    }
                },
                {
//                    style: css,
//                    colorBtnBackIOS: "#333",
                    style: "color:#6a6767;",
                    colorBtnBackIOS: "#6a6767",
                    icon: "material-icons playlist_add_check normal",
                    position: "top",
                    name: "pasados",
                    label: "<span class='titlehistoenc'>Pasados</span>",
                    callback: function (a) {
                        self.action("PASADOS", a);
                        self.mostrar(true);
                    }
                }
        );
//        var array = {};
//        array.text = "acumulado";
//        array.type = "button";
//        array.position = "header_right";
//        array.className = "acumulado";
//        array.style = css1;
//        array.callback = function (a) {
//        };

        self.show();


        var click = 'click'; //touchstart click
        var col = "iniciar_servicio";
//        $(self.canvas).on(click, ".rowName_" + col, function () {
//            $(this.parentElement).trigger({type: 'click'});
//            self.iniciarViaje();
//        });
        (function () {
            $(self.canvas).delegate(".rowName_" + col, click, function (e, ev) {
                $(this.parentElement).trigger({type: 'click'});
//            callback(this);
                self.iniciarViaje();
            });
        })();
//        self.actionCol("iniciar_servicio", function () {
//            self.iniciarViaje();
//        });



        self.showtarde = false;
        self.tardebtn = document.createElement("div");
        self.tardebtn.className = "mostrarpasadostarde";
        self.tardebtn.onclick = function () {
            if (self.showtarde) {
                $(".estatusatiempo_row_rojo").addClass("estatusatiempo_row_show");
                self.showtarde = false;
            } else {
                $(".estatusatiempo_row_rojo").removeClass("estatusatiempo_row_show");
                self.showtarde = true;
            }
        };
        document.querySelector(self.canvas).appendChild(self.tardebtn);
        if (self.configCliente.conductor_historico_ver_viajes_tarde_en_boton == "NO") {
            self.tardebtn.style.display = "none";
        }

        self.ui.buscar.addListener("click", function (e) {
//            var data = self.getFiltersData();
//            self.applyFilters(data);

            self.varsClean();
            self.applyFilters();
        });

        if (self.configCliente.usa_informe_conductor == "SI") {
            self.ui.informe.addListener("click", function (e) {
                var data = self.getFiltersData();
                main.imprimir("VER_INFORME_CONDUCTOR", up.id_usuario, data);
            });
        }

        self.onAppear(function () {
            setTimeout(function () {
                self.varsClean();
                self.applyFilters();
                if (self.configCliente.app_para != "CARGA") {
                    self.mostrar("no_aplica");
                } else {
                    self.mostrar(true);
                }
            }, 100);
        });
    },
    destruct: function () {
    },
    members: {
        mostrar: function mostrar(mostrar) {
            var self = this;
            if (mostrar == "no_aplica") {
                $("#l_historico_viajes .containFilters").css("cssText", "display: none");
                $("#l_historico_viajes .containTable").css("cssText", "padding-top: 0px;");
                return;
            }
            if (self.configCliente.app_para == "CARGA") {
                if (mostrar) {
                    $("#l_historico_viajes .containFilters").css("cssText", "display: initial");
                    $("#l_historico_viajes .containTable").css("cssText", "padding-top: 31px!important;");
                } else {
                    $("#l_historico_viajes .containFilters").css("cssText", "display: none");
                    $("#l_historico_viajes .containTable").css("cssText", "padding-top: 0px;");
//                    self.ui.valor_total.setValue("");
//                    self.ui.fecha_inicial.setValue("");
//                    self.ui.fecha_final.setValue("");
                }
            }
        },
        action: function action(status, a) {
            var self = this;
            var cssinactive = {"background-color": "#f6f6f6", "color": "#6a6767", "font-weight": "lighter", "border-bottom": "none"};
            var cssactive = {"background-color": "#ffffff", "color": "#333", "font-weight": "bold", "border-bottom": "1px solid #ccc"};
            $(".ui-block-b .btnExec").css(cssinactive);
            $(".l_historico_viajes .material-icons").css("cssText", "color: #6a6767!important;");
            $(a).css(cssactive);
            $(a).find(".l_historico_viajes .material-icons").css("cssText", "color: #333!important;");
            self.estado = status;

            self.varsClean();
            self.applyFilters();
        },
        varsClean: function varsClean() {
            var self = this;
            self.clean();
            self.loadMore = false;
            self.limit_pagination = 10;
            self.limit_old = 0;
            self.limit_new = self.limit_pagination;
        },
        applyFilters: function applyFilters(filter) {
            var self = this;
            if (self.loadMore != false) {
//                self.clean();
            }
            self.limit_pagination = 10;
            if (!nw.evalueData(self.limit_old)) {
                self.limit_old = 0;
            }
            if (!nw.evalueData(self.limit_new)) {
                self.limit_new = self.limit_pagination;
            }
            nw.remove(".cargar_mas_list");
            var d = document.createElement("div");
            d.innerHTML = nw.utils.tr("Cargar más");
            d.className = "cargar_mas_list";
            d.onclick = function () {
                self.loadMore = true;
                self.limit_old = self.limit_old + self.limit_pagination;
                self.limit_new = self.limit_pagination + 1;

                self.applyFilters();
            };
            document.querySelector(self.canvas + " .containTable").appendChild(d);

            var up = nw.userPolicies.getUserData();
            nw.loading({text: nw.tr("Consultando servicios..."), textVisible: true, html: "", theme: "b", "container": self.canvas});

            var data = {};
            data.usuario = up.usuario;
            data.id_usuario = up.id_usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.estado = self.estado;
            data.configCliente = self.configCliente;
            data.limit_old = self.limit_old;
            data.limit_new = self.limit_new;
//            if (self.configCliente.app_para == "CARGA") {
//            if (filter) {
            data.filters = self.getFiltersData();
//            }
//            }
            console.log("l_historico_viajes:::dataSendServer:::data", data);

            var numtardes = 0;
            var hoy = nw.utilsDate.getActualFullDate();
            var rpc = new nw.rpc(self.getRpcUrl(), "app_driver");
            rpc.setAsync(true);
            rpc.setLoading(false);
            nw.empty(".showZeroRows");
            nw.removeClass(".mostrarpasadostarde", "mostrarpasadostarde_show");
            self.showtarde = false;
            var func = function (r) {
                console.log("l_historico_viajes:::responseServer:::r", r);
                nw.loadingRemove({"container": self.canvas});
                for (var i = 0; i < r.length; i++) {
                    r[i].estado_text = nw.utils.tr(r[i].estado);
                    r[i].tipo_pago_text = nw.utils.tr(r[i].tipo_pago);
                    r[i].tipo_servicio_text = nw.utils.tr(r[i].tipo_servicio);
                    if (nw.evalueData(r[i].paradas_adicionales_iniciales_creacion)) {
                        r[i].paradas_adicionales_iniciales_creacion = r[i].paradas_adicionales_iniciales_creacion;
                    }
                    if (nw.evalueData(r[i].vuelo_numero)) {
                        r[i].vuelo_numero = "Vuelo No: " + r[i].vuelo_numero;
                    }
                    if (self.estado == "RESERVADO" && self.configCliente.conductor_historico_ver_viajes_tarde_en_boton == "SI") {
                        var colorstatus = "verde";
                        var estatus = "<span class='estatusatiempo estatusatiempo_verde'>" + nw.tr("A tiempo") + "</span>";
                        if (r[i].fecha + " " + r[i].hora < hoy) {
                            colorstatus = "rojo";

                            nw.addClass(".mostrarpasadostarde", "mostrarpasadostarde_show");
                            self.showtarde = true;

                            numtardes++;
                            document.querySelector(".mostrarpasadostarde").innerHTML = nw.tr("Tienes") + " " + numtardes + " " + nw.tr("servicios tarde, click para ver");

                            estatus = "<span class='estatusatiempo estatusatiempo_tarde'>" + nw.tr("Tarde") + "</span>";
                        }
                        r[i].estado_atiempo = estatus;
                        r[i].addClassNameRow = "estatusatiempo_row estatusatiempo_row_" + nw.tr(colorstatus);
                    }
                    console.log("r[i].estado", r[i].estado)
                    if (r[i].estado == "ACEPTADO_RESERVA") {
                        r[i].iniciar_servicio = "<i class='material-icons'>play_arrow</i> " + nw.tr("Iniciar servicio");
                    }
                }


//                r = nw.lists.addValueInModel(r, "iniciar_servicio", "<i class='material-icons'>edit</i> Iniciar servicio");

                var normal = false;
                var complex = true;
                var clean = false;
                self.setModelData(r, normal, complex, clean);

                if (self.estado == "PASADOS") {
                    if (filter) {
                        if (r.length > 0) {
                            for (var i = 0; i < r.length; i++) {
                                var row = r[i];
                                self.acumulado = self.acumulado + parseFloat(row.utilidad_conductor);
//                                self.ui.valor_total.setValue(self.acumulado);
//                                var acu = document.querySelector('.acumulado');
//                                acu.innerHTML = "<div>Acumulado</div>" + self.formatCurrency("es-CO", "COP", 2, self.acumulado);
                            }
                        }
                    }
                } else {
                    self.acumulado = 0;
                }

                self.loadMore = false;
            };
            rpc.exec("consulta_historico_servicios", data, func);
        },
        formatCurrency: function formatCurrency(locales, currency, fractionDigits, number) {
            var formatted = new Intl.NumberFormat(locales, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: fractionDigits
            }).format(number);
            return formatted;
        },
        contextMenu: function contextMenu() {
            var self = this;
            var data = self.selectedRecord();
            console.log("data", data);
            var typemenu = "bottom"; //normal
            var m = new nw.contextmenu(this, typemenu); //vertical, bottom
            m.addAction("Paradas / pasajeros", "material-icons streetview normal", function (e) {
                main.editaParadasAdicionales(data, self.estado);
            });
            m.addAction("Ampliar", "material-icons info normal", function (e) {
                main.ampliar(data, function () {
                    self.iniciar();
                });
            }, function () {
                self.cancelarServicio();
            });
            if (main.configCliente.ver_voucher === "SI") {
                m.addAction("Ver Voucher", "material-icons info normal", function (e) {
                    main.imprimir("VER_VOUCHER", data.id);
                });
            }
            if (main.configCliente.ver_cartel_vuelo === "SI") {
                m.addAction("Ver Cartel de Vuelo", "material-icons info normal", function (e) {
                    main.imprimir("CARTEL_VUELO", data.id);
                });
            }
            if (main.configCliente.pide_fuec === "SI") {
                m.addAction("Ver FUEC", "nwmaker/img/baseline-create-24px.svg", function (e) {
                    main.verFuec(data);
                });
            }
            if (data.tipo_servicio === "reservado") {
                if (self.configCliente.cancela_conductor === "SI") {
                    if (data.estado === "SOLICITUD" || data.estado === "ACEPTADO_RESERVA") {
                        m.addAction("Cancelar", "nwmaker/img/baseline-create-24px.svg", function (e) {
                            self.cancelarServicio();
                        });
                    }
                }
                if (data.estado === "ACEPTADO_RESERVA") {
                    m.addAction("Iniciar servicio", "nwmaker/img/baseline-create-24px.svg", function (e) {
                        self.iniciarViaje();
                    });
                }
            }
        },
        iniciarViaje: function iniciarViaje() {
            var self = this;
            if (typeof main.selfMapaDriver.serviceActive !== "undefined") {
                if (main.selfMapaDriver.serviceActive) {
                    nw.dialog("Tiene un servicio en curso, debe finalizarlo para poder iniciar otro.");
                    return false;
                }
            }
            self.iniciar();
        },
        clicRow: function clicRow() {
            var self = this;
//            var config = self.configCliente;
//            console.log(config);
//            var data = self.selectedRecord();
//            self.contextMenu();
//            return false;
        },
        iniciar: function iniciar() {
            var self = this;
//            nw.loading({text: "Espere por favor...", textVisible: true, html: "", theme: "b", "container": self.canvas});
//            setTimeout(function () {
//                nw.loadingRemove({"container": self.canvas});

            var data = self.selectedRecord();
            console.log("iniciar:::data", data);

            if (main.configCliente.pide_preoperacional === "SI") {
                main.validaPreoperacionalRequerido(function (res) {
                    if (res === true) {
                        init();
                    }
                });
                return;
            }


            init();

            function init() {
//                if (!nw.utils.evalueData(data.id)) {
//                    self.contextMenu();
//                    return false;
//                }
                var accept = function () {
                    nw.loading({text: "Espere por favor... Iniciando viaje", textVisible: true, html: "", theme: "b", "container": self.canvas});

                    console.log("typeof main.selfMapaDriver.saveAcceptService", typeof main.selfMapaDriver.saveAcceptService)

                    startTravel();
                    function startTravel() {
                        if (typeof main.selfMapaDriver.saveAcceptService == "undefined") {
                            setTimeout(function () {
                                startTravel();
                            }, 1000);
                            return false;
                        }
                        nw.loadingRemove({"container": self.canvas});
                        main.selfMapaDriver.saveAcceptService(data);
                        var up = nw.userPolicies.getUserData();
                        nw.sendNotificacion({
                            title: "Inicio recogida",
                            body: nw.utils.tr("El conductor") + " " + up.nombre + " " + nw.utils.tr("se dirige al punto de recogida"),
                            icon: "fcm_push_icon",
                            sound: "default",
                            data: "nw.dialog('" + nw.utils.tr("El conductor") + " " + up.nombre + " " + nw.utils.tr("se dirige al punto de recogida") + "',function(){main.reloadApp()})",
                            callback: "FCM_PLUGIN_ACTIVITY",
                            to: data.token_usuario
                        });
                        nw.cleanAllWindow();
                        nw.home();
                        return true;
                    }
                };
                var cancel = function () {
                    return true;
                };
                nw.remove(".formquest");
                nw.dialog(nw.tr("¿Desea iniciar el servicio") + " # " + data.id + "?", accept, cancel, {original: true, addClass: "formquest"});
            }

//            }, 500);
        },
        canvas: function canvas(canvas) {
            var self = this;
            self.canvas = canvas;
        },
        cancelarServicio: function cancelarServicio() {
            var self = this;
            var data = self.selectedRecord();
            console.log("data", data);
            var callback = function () {

                self.varsClean();
                self.applyFilters();
            };
            var d = new f_cancelar_servicio();
            d.construct(data);
            d.ui.id.setValue(data.id, callback);
        }
    }
});