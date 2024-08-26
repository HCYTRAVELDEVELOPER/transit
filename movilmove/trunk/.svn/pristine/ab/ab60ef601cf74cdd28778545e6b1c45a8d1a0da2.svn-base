nw.Class.define("l_historico_viajes", {
    extend: nw.lists,
    construct: function () {
        var self = this;
        self.showContextMenu = true;
        self.id = "l_historico_viajes";
        self.setTitle = "Viajes";
        self.html = "Viajes";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Volver";
        self.createBase();
//        self.estado = "PASADOS";
        self.estado = "RESERVADO";
        self.configCliente = main.configCliente;
        self.icon = false;
        main.dataServiceOpenHistory = false;

        var top = "margin-bottom:8px;";
        var columns = [
//            {
//                name: "id",
//                label: "ID service",
//                mode: "toolTip"
//            },
//            {
//                name: "id_parada",
//                label: "ID pasajero (parada)",
//                mode: "toolTip"
//            },
            {
                name: "id_enc",
                label: "",
                mode: "toolTip"
            },
            {
                name: "origen",
//                label: "<i class='material-icons icon-historico'>place</i><div class='divOrigenDest divOrigenA'>A</div>"
                label: "<i class='material-icons icon-historico icon-historicoA'>place</i>"
//                style: {data: "width: 81%; text-overflow: ellipsis; overflow: hidden; margin-left: 3px;", contenedor: "display: flex; " + top}
            },
            {
                name: "destino",
//                label: "<i class='material-icons icon-historico'>place</i><div class='divOrigenDest divOrigenB'>B</div>"
                label: "<i class='material-icons icon-historico icon-historicoB'>place</i>"
//                label: "Hasta",
//                style: {data: "width: 81%; text-overflow: ellipsis; overflow: hidden; margin-left: 3px;", contenedor: "display: flex; " + top}
            },
            {
//                style: {contenedor: "margin-top: 10px;" + top},
                name: "fechas_horas",
                label: ""
            },
//            {
////                style: {contenedor: "margin-top: 10px;" + top},
//                name: "fecha_hora_format",
//                label: "<i class='material-icons icon-historico'>date_range</i>",
//                mode: "date_format"
//            },
            {
                name: "conductor_html",
                label: ""
            },
//            {
//                name: "tipo_pago",
//                label: ""
//            },
            {
                name: "tipo_pago_text",
                label: ""
            },
            {
                name: "valor_total_servicio",
                label: "",
                mode: "money"
            },
            {
                name: "abordo",
                label: "Abordó",
                mode: "toolTip"
            },
            {
                name: "sentido",
                label: "Sentido",
                mode: "toolTip"
            },
//            {
//                name: "conductor_usuario",
//                label: "Conductor user"
//            },
//            {
//                name: "conductor",
//                label: "Conductor"
//            },
//            {
//                name: "conductor_foto",
//                label: "Conductor foto",
//                type: "image"
//            },
            {
                name: "descricion_carga",
//                label: "Descripción:",
                label: "",
                mode: "toolTip"
            },
            {
                name: "iniciar_servicio",
                label: "",
                type: "button"
            },
            {
                name: "chat_conductor",
                label: "",
                type: "button"
            }
        ];
        self.setColumns(columns);
        self.buttons = [];
        var css = "background-color: #ffffff;color:#333;font-weight: bold;border-bottom: 1px solid #ccc;";
        self.buttons.push(
                {
                    style: css,
//                    style: "color:#6a6767;",
                    colorBtnBackIOS: "#6a6767",
//                    icon: "material-icons playlist_add normal",
                    position: "top",
                    name: "programados",
                    label: "Próximos Reservas",
                    callback: function (a) {
                        self.icon = "playlist_add";
                        self.action("RESERVADO", a);
                    }
                },
                {
                    style: "color:#6a6767;",
                    colorBtnBackIOS: "#6a6767",
//                    icon: "material-icons playlist_play normal",
                    position: "top",
                    name: "activos",
                    label: "Activos En ruta",
                    callback: function (a) {
                        self.icon = "playlist_play";
                        self.action("ACTIVOS", a);
                    }
                },
                {
//                    style: css,
                    style: "color:#6a6767;",
                    colorBtnBackIOS: "#333",
//                    icon: "material-icons playlist_add_check normal",
                    position: "top",
                    name: "pasados",
                    label: "Pasados Histórico",
                    callback: function (a) {
                        self.icon = "playlist_add_check";
                        self.action("PASADOS", a);
                    }
                }
        );
        self.show();

        var click = 'click'; //touchstart click
        var col = "iniciar_servicio";
//        $(self.canvas).on(click, ".rowName_" + col, function () {
//            $(this.parentElement).trigger({type: 'click'});
//                 var data = self.selectedRecord();
//            console.log("iniciar:::data", data);
//            self.iniciarViaje();
//        });
        (function () {
            $(self.canvas).delegate(".rowName_" + col, click, function (e, ev) {
                $(this.parentElement).trigger({type: 'click'});
//            callback(this);
                var data = self.selectedRecord();
                console.log("iniciar:::data", data);
                self.openViajeParada(data);
            });
        })();
        (function () {
            $(self.canvas).delegate(".rowName_chat_conductor", click, function (e, ev) {
                $(this.parentElement).trigger({type: 'click'});
//            callback(this);
                var data = self.selectedRecord();
                console.log("iniciar:::data", data);
                self.openChatConductor(data);
            });
        })();
//        self.actionCol("iniciar_servicio", function () {
//             self.openViajeParada(data);
//        });

        self.onAppear(function () {
            setTimeout(function () {
                self.varsClean();
                self.applyFilters();
            }, 100);
        });

    },
    destruct: function () {
    },
    members: {
        action: function action(status, a) {
            var self = this;
            var cssinactive = {"background-color": "#f6f6f6", "color": "#6a6767", "font-weight": "lighter", "border-bottom": "none"};
            var cssactive = {"background-color": "#ffffff", "color": "#333", "font-weight": "bold", "border-bottom": "1px solid #ccc"};
            $(".ui-block-b .btnExec").css(cssinactive);
            $(".l_historico_viajes .material-icons").css({"color": "#6a6767"});
            $(a).css(cssactive);
            $(a).find(".l_historico_viajes .material-icons").css({"color": "#333"});
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
        applyFilters: function applyFilters() {
            var self = this;
            var elementCont = document.querySelector(".contConsole");
            if (elementCont) {
                elementCont.remove();
            }
//            self.clean();
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
            var data = {};
            data.usuario = up.usuario;
            data.id_usuario = up.id_usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.estado = self.estado;
            data.filters = self.getFiltersData();
            data.configCliente = self.configCliente;
            data.limit_old = self.limit_old;
            data.limit_new = self.limit_new;

            var rpc = new nw.rpc(self.getRpcUrl(), "app_user");
            rpc.setAsync(true);
            rpc.setLoading(true);
            console.log("l_historico_viajes:::applyFilters:::sendData:::data", data);
            nw.empty(".showZeroRows");
            var func = function (r) {
                console.log("l_historico_viajes:::applyFilters:::responseServer:::r", r);
                if (!r || r.length == 0) {
                    self.console();
                }
                var ra = [];
                for (var i = 0; i < r.length; i++) {
                    var rr = r[i];
                    if (!nw.evalueData(rr.conductor_usuario)) {
                        rr.conductor_usuario = nw.tr("Sin asignar");
                    }
                    if (!nw.evalueData(rr.conductor)) {
                        rr.conductor = nw.tr("Sin asignar");
                    }
                    if (nw.evalueData(rr.conductor_foto)) {
                        var fotoThumb = config.domain_rpc + nw.utils.getFileByType(rr.conductor_foto, 50);
                        rr.conductor_foto = fotoThumb;
                    }
                    rr.fecha_hora_format = rr.fecha_hora;

                    console.log("rr.estado_parada", rr.estado_parada);

                    if (nw.evalueData(rr.estado_parada)) {
                        rr.abordo = "NO";
                        if (rr.estado_parada == "CONFIRMADO" || rr.estado_parada == "ENTREGADO") {
                            rr.abordo = "SI";
                        }
                    }

                    var enc = "<div class='enc_trav'>";

                    enc += "<div class='enc_trav_ids_idsorparada'>";
                    enc += "<span class='rowestadoids rowestadoids_id'>" + nw.tr("Servicio") + " #" + rr.id;
                    if (nw.utils.evalueData(rr.booking_id_journey)) {
                        enc += " CodeBooking #" + rr.booking_id_journey;
                    }
                    enc += "</span>";
                    enc += "<span class='rowcolorstado'><span class='colorstado'></span> " + nw.tr(rr.estado) + "</span>";
                    enc += "</div>";

                    if (nw.utils.evalueData(rr.id_parada)) {
                        enc += "<div class='enc_trav_ids_idsorparada'>";
                        enc += "<span class='rowestadoids rowestadoids_id'>Parada #" + nw.tr(rr.id_parada);
                        enc += "</span>";
                        enc += "<span class='rowcolorstado'><span class='colorstado'></span> " + nw.tr(rr.estado_parada) + "</span>";
                        enc += "</div>";
                    }
                    enc += "</div>";

                    rr.id_enc = enc;


                    var fechas_horas = "<div class='fechas_horas'>";
                    fechas_horas += "<div class='fechas_horas_e fechas_horas_fecha'><i class='material-icons'>date_range</i> " + rr.fecha + "</div>";
                    fechas_horas += "<div class='fechas_horas_e fechas_horas_hora'><i class='material-icons'>access_time</i> " + rr.hora + "</div>";
                    fechas_horas += "</div>";

                    rr.fechas_horas = fechas_horas;
                    rr.tipo_pago_text = nw.tr(rr.tipo_pago);

                    console.log("rrrrrrrrrrrrrrrrrrr", r);

                    var conductor_html = "<div class='conductor_html'>";
                    conductor_html += "<i class='material-icons'>directions_car</i>";
                    if (nw.utils.evalueData(rr.placa)) {
                        conductor_html += "<span class='vehiculo_contain_html_placa'>" + nw.tr(rr.placa) + "</span>";
                    }
                    if (nw.utils.evalueData(rr.vehiculo_text)) {
                        conductor_html += "<span>" + nw.tr(rr.vehiculo_text) + "</span>";
                    }
                    conductor_html += "<span>" + nw.tr(rr.conductor) + "</span>";
                    conductor_html += "</div>";
                    rr.conductor_html = nw.tr(conductor_html);

                    rr.iniciar_servicio = "<i class='material-icons'>expand_more</i> " + nw.tr("Ampliar");
                    rr.chat_conductor = "<i class='material-icons'>chat_bubble_outline</i>" + nw.tr("Chat");


                    ra.push(rr);
                }
                var normal = false;
                var complex = true;
                var clean = false;
                self.setModelData(ra, normal, complex, clean);
            };
            rpc.exec("consulta_historico_servicios", data, func);
        },
        contextMenu: function contextMenu() {
            var self = this;
            var data = self.selectedRecord();
            console.log("data", data)
            var m = new nw.contextmenu(self, "bottom"); //vertical, bottom
            if (nw.evalueData(data.id_parada)) {
                m.addAction("Ampliar", "material-icons expand_more normal", function (e) {
                    self.openViajeParada(data);
                });
                if (self.configCliente.pasajero_puede_cancelar_parada == "SI") {
                    m.addAction("Cancelar parada", "material-icons expand_more normal", function (e) {
                        nw.dialog("¿Está seguro de cancelar esta cancelación?", function () {
                            self.cancelarParada(data);
                        }, function () {
                            return true;
                        }, {textAccept: "Si, cancelar", textCancel: "Volver"});
                    });
                }
            } else {
                if (data.tipo_servicio === "reservado") {
                    if (data.estado === "SOLICITUD" || data.estado === "ACEPTADO_RESERVA") {
                        m.addAction("Cancelar servicio", "material-icons expand_more normal", function (e) {
                            self.cancelarServicio();
                        });
                        if (config.editarDireccionServiciosReservados === true) {
                            m.addAction("Cambiar dirección de destino", "material-icons expand_more normal.svg", function (e) {
                                self.editaDireccion();
                            });
                        }
                        if (config.reagendarServiciosReservados === true) {
                            m.addAction("Reagendar", "material-icons expand_more normal", function (e) {
                                self.editaFecha();
                            });
                        }
                    }
                }
                m.addAction("Paradas / pasajeros", "material-icons expand_more normal", function (e) {
                    self.editaParadasAdicionales();
                });
                m.addAction("Ampliar", "material-icons expand_more normal", function (e) {
                    self.openViajeParada(data);
                });
            }
            m.addAction("Chat / conductor", "material-icons expand_more normal", function (e) {
                console.log("data", data);
                self.openChatConductor(data);
            });
        },
        openChatConductor: function openChatConductor(data) {
            var self = this;
            var ds = {};
            ds.id = data.id;
            if (nw.evalueData(data.id_parada)) {
                ds.id = "_parada_" + data.id_parada;
            }
            ds.conductor = "Conductor";
            if (nw.evalueData(data.conductor)) {
                ds.conductor = data.conductor;
            }
            console.log("dsdsdsdsds", ds);
            var d = new f_chat();
            d.construct(ds);
            main.dataServiceOpenHistory = data;
        },
        openViajeParada: function openViajeParada(data) {
            var self = this;
//            var link = config.domain_rpc + config.carpet_files_extern + "index.html";
//            link += "?conf=" + domainExternConfigName + "&service=" + data.id + "#f_ver_viaje";
//            nw.utils.openIframe(link);
            main.openTravelByID(data.id);
        },
        cancelarParada: function cancelarParada(data) {
            var self = this;
            var rpc = new nw.rpc(self.getRpcUrl(), "app_user");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (ra) {
                console.log("ra", ra);
                nw.dialog("Parada cancelada correctamente.");
                self.removeSelectedRecord();
            };
            rpc.exec("cancelarParada", data, func);
        },
        editaParadasAdicionales: function editaParadasAdicionales() {
            var self = this;
            var data = self.selectedRecord();
            self.paradasAdd = new nw.forms();
            var up = nw.userPolicies.getUserData();
            self.paradasAdd.id = "f_padas_add";
            self.paradasAdd.setTitle = "Paradas";
            self.showBackCallBack = function () {
                nw.back();
            };
            self.paradasAdd.createBase();
            var fields = [
                {
                    label: "",
                    name: "paradas_group",
                    type: "startGroup",
                    visible: true
                },
                {
                    type: "endGroup"
                }
            ];
            self.paradasAdd.setFields(fields);
            self.paradasAdd.buttons = [];
            if (main.configCliente.agrega_paradas_pasajero == "SI") {
                if (self.estado !== "PASADOS") {
                    self.paradasAdd.buttons.push(
                            {
                                style: "border: 0;background-color:#1abbd7;color:#fff;margin:0px;",
                                icon: "material-icons check_circle normal",
                                colorBtnBackIOS: "#fff",
                                position: "top",
                                name: "aceptar_detalle_servicio",
                                label: "Crear parada",
                                callback: function () {
                                    self.paradasAdd.guardar_paradas = true;
                                    var d = new f_crear_parada();
                                    d.construct(self.paradasAdd);
                                }
                            }
                    );
                }
            }
            self.paradasAdd.show();
            self.paradasAdd.saveParada = function saveParada(pr) {
                console.log(pr);
                var datos = pr;
                datos.empresa = up.empresa;
                datos.perfil = up.perfil;
                datos.usuario = up.usuario;
                datos.id_servicio_edit = data.id;
                console.log(datos);
//                        return;
                var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                rpc.setLoading(false);
                var func = function (ra) {
                    self.paradasAdd.navTable.applyFilters(data.id);
                    nw.dialog("Parada creada correctamente.");
                };
                rpc.exec("saveParada", datos, func);
            }
            self.paradasAdd.createNavTableParadas = function createNavTableParadas() {
                var canvas = "#f_padas_add .paradas_group";
                var nav = new l_navtable_paradas();
                nav.construct(canvas, data);
                self.paradasAdd.navTable = nav;
            }
            self.paradasAdd.createNavTableParadas();
        },
        editaFecha: function editaFecha() {
            var self = this;
            var data = self.selectedRecord();
            var d = new f_reprograma();
            d.construct(self, data);
        },
        editaDireccion: function editaDireccion() {
            var self = this;
            var data = self.selectedRecord();
            var d = new f_mapa();
            d.construct(data, function () {

                self.varsClean();
                self.applyFilters();
            });
        },
        console: function console() {
            var self = this;
            var elementCont = document.querySelector(".contConsole");
            if (elementCont) {
                elementCont.remove();
            }
            var element = document.querySelector("#" + self.id);
            var divcont = document.createElement('div');
            divcont.className = "contConsole";
            divcont.innerHTML = "<div class='cont-left'>\n\
<div class='rad'><i class='material-icons' style='color:#fff!important;'>" + self.icon + "</i></div>\n\
<div class='lupa'>\n\
<div class='rad'><i class='material-icons' style='color:#fff;'>" + self.icon + "</i></div>\n\
</div>\n\
</div>\n\
<div class='cont-right'>" + nw.tr("Lo sentimos, no se encontraron datos.") + "</div>";
            element.appendChild(divcont);
        },
        clicRow: function clicRow() {
            var self = this;
//            self.contextMenu();
        },
        canvas: function canvas(canvas) {
            var self = this;
            self.canvas = canvas;
        },
        cancelarServicio: function cancelarServicio() {
            var self = this;
            var data = self.selectedRecord();
            console.log("data", data);
            self.datos_servicio_activo = data;
            var d = new f_cancelar_servicio();
            d.construct(self);
            d.ui.id.setValue(data.id);
        },
        cancelservice: function () {
            var self = this;
//            nw.back();
            self.varsClean();
            self.applyFilters();
        }
    }
});