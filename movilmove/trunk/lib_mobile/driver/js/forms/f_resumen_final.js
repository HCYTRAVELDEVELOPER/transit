nw.Class.define("f_resumen_final", {
    extend: nw.forms,
    construct: function () {
        $(".f_resumen_final").remove();
        var self = this;
        self.id = "f_resumen_final";
        self.setTitle = "<span style='color:#fff;'>Resumen</span>";
        self.showBack = false;
        self.closeBack = false;
        self.textClose = "Home";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
//        self.transition = "slideup";
//        self.transition = "slide";
        self.transition = "none";
        self.createBase();
        self.event = new Event('calificaService');
        self.configCliente = main.configCliente;
        self.usuario = null;
        self.data = null;

        var fields = [
            {
                name: "id",
                label: "ID",
                type: "textField",
                visible: false
            },
            {
                name: "label_puntaje_en_texto",
                label: "",
                type: "html"
            },
            {
                name: "puntaje",
                label: "",
                type: "radio",
                required: true
            },
            {
                name: "comentarios",
                label: "",
                placeholder: 'Comentarios',
                type: "textArea",
                required: false
            }
        ];
        self.setFields(fields);

        self.buttons = [];
        self.buttons.push({
            style: "background-color: #f18107;color: #ffffff;",
            icon: "",
            colorBtnBackIOS: "#ffffff",
            name: "aceptar",
            label: "Calificar",
            callback: function () {
                var up = nw.userPolicies.getUserData();
                var data = self.getRecord();
                if (typeof data.puntaje == "undefined") {
                    data.puntaje = 1;
                }
                data.usuario = self.usuario;
                data.usuario_califica = up.usuario;
                data.perfil = up.perfil;
                data.empresa = up.empresa;
                if (!self.validate()) {
                    return false;
                }
                console.log("data", data);
                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                rpc.setLoading(false);
                nw.loading({text: "Por favor espere...", title: "Calificando..."});
                var func = function (r) {

                    console.log("f_resumen_final", r);

                    nw.loadingRemove();

                    document.dispatchEvent(self.event);
                    nw.home();
                    main.selfMapaDriver.activeNormal();
                    main.selfMapaDriver.cerrarNotificionMain();
                    main.selfMapaDriver.centerUbication();
//                    main.selfMapaDriver.initIntervalo();
//                    nw.sendNotificacion({
//                        title: "Valor de tu viaje",
//                        body: "Valor final de " + self.data.valor_total_servicio,
//                        icon: "fcm_push_icon",
//                        sound: "default",
//                        data: "nw.dialog('Valor final de " + self.data.valor_total_servicio + "')",
//                        callback: "FCM_PLUGIN_ACTIVITY",
//                        to: self.data.token_usuario
//                    });

                    main.registerServiceInFirebase(data.id);

                };
                rpc.exec("calificarServicioConductor", data, func);
            }
        });

        self.show();

        $(self.canvas).addClass("f_calificar_estrellas");

        var data = {};
        data["1"] = "<i class='material-icons'>star_border</i>";
        data["2"] = "<i class='material-icons'>star_border</i>";
        data["3"] = "<i class='material-icons'>star_border</i>";
        data["4"] = "<i class='material-icons'>star_border</i>";
        data["5"] = "<i class='material-icons'>star_border</i>";
        self.ui.puntaje.populateSelectFromArray(data);
        self.ui.puntaje.setValue("");

        self.ui.puntaje.changeValue(function (e) {
            var d = e.value;
            self.ui.label_puntaje_en_texto.setValue(self.arrayPuntaje(d));
            var radios = self.ui.puntaje.find(".label_radio_nw");
            for (var i = 0; i < radios.length; i++) {
                var rad = radios[i];
                $(rad).removeClass("label_radio_nw_active");
                rad.innerHTML = "<i class='material-icons'>star_border</i>";
            }
            for (var i = 0; i < parseInt(d); i++) {
                var rad = radios[i];
                $(rad).addClass("label_radio_nw_active");
                rad.innerHTML = "<i class='material-icons'>star</i>";
            }
        });
        nw.remove(".list-paradas");

    },
    destruct: function () {
    },
    members: {
        arrayPuntaje: function arrayPuntaje(number) {
            var re = ["", nw.utils.tr("Terrible"), nw.utils.tr("Malo"), nw.utils.tr("Regular"), nw.utils.tr("Bueno"), nw.utils.tr("Excelente")];
            var rt = re[number];
            return nw.tr(rt);
        },
        populate: function populate(pr) {
            var self = this;
            self.valor_final = "0";
            var data = {};
            data.id = pr.id;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
//            nw.loading({text: "Por favor espere...", title: "Resumen final..."});
            var func = function (r) {
                nw.loadingRemove();
                console.log("populate", r);
                if (!r) {
//                    nw.dialog("El servicio no existe");
//                    nw.back();
                    nw.home();
                    return false;
                }

                var valortotal = 0;
                if (nw.evalueData(r.valor_total_servicio)) {
                    valortotal = r.valor_total_servicio;
                }

                self.data = r;
                var html = "<div class='resumenfinaldiv'>";
                if (self.configCliente.mostrar_valor_conductor === "SI") {
                    html += "<h1 class='price_see price_see_totalpagar'>" + nw.tr("Total a pagar:") + " $<span class='totalapagar'>" + nw.addNumber(valortotal) + "</span></h1>";
//                    if (nw.evalueData(r.formaCobroFinalAutomatico)) {
//                        html += "<p class='price_see'><strong>FormaCobroFinalAutomatico</strong> " + r.formaCobroFinalAutomatico + "</p>";
//                        if (r.formaCobroFinalAutomatico == "valor_tarifa_minima") {
//                            if (nw.evalueData(r.valor_tarifa_minima)) {
//                                html += "<p class='price_see'><strong>Valor tarifa mínima</strong> $" + nw.addNumber(r.valor_tarifa_minima) + "</p>";
//                            }
//                        }
//                    }
                    if (r.aplico_peaje == "SI") {
                        html += "<p class='price_see price_see_peajes'><strong>" + nw.tr("Peajes:") + "</strong> $" + nw.addNumber(r.valor_peajes) + "</p>";
                    }
                    if (nw.evalueData(r.paradas_adicional_valor_total)) {
                        html += "<p class='price_see price_see_recargoparadas'><strong>" + nw.tr("Recargo por paradas adicionales:") + "</strong> $" + nw.addNumber(r.paradas_adicional_valor_total) + "</p>";
                    }
                    if (nw.evalueData(r.valor_recargo_ruta_fija)) {
                        html += "<p class='price_see price_see_recargofijo'><strong>" + nw.tr("Recargo fijo:") + "</strong> $" + nw.addNumber(r.valor_recargo_ruta_fija) + "</p>";
                    }
                    if (nw.evalueData(r.valor_espera)) {
                        html += "<p class='price_see price_see_valorespera'><strong>" + nw.tr("Valor espera:") + "</strong> $" + nw.addNumber(r.valor_espera) + "</p>";
                    }
                    if (nw.evalueData(r.tiempo_espera)) {
                        html += "<p class='price_see price_see_tiempoespera'><strong>" + nw.tr("Minutos de espera:") + "</strong> " + r.tiempo_espera + " mins</p>";
                    }
                    if (nw.evalueData(r.saldo_user_aplicado)) {
                        html += "<p class='price_see price_see_saldopagouser'><strong>" + nw.tr("Pago con saldo:") + "</strong> $" + nw.addNumber(r.saldo_user_aplicado) + "</p>";
                    }
                    if (nw.evalueData(r.descuento_aplicado)) {
                        html += "<p class='price_see  price_see_descuento price_see_descuento_con'><strong>" + nw.tr("Descuento:") + "</strong> $" + nw.addNumber(r.descuento_aplicado) + "</p>";
                        var valorsindescuento = parseFloat(r.valor_total_servicio) + parseFloat(r.descuento_aplicado);
                        html += "<p class='price_see price_see_descuento price_see_descuento_sin'><strong>" + nw.tr("Valor sin descuento:") + " </strong>$" + nw.addNumber(valorsindescuento) + "</p>";
                    }
                    if (nw.evalueData(r.utilidad_conductor)) {
                        html += "<p class='price_see price_see_utilidadconductor'><strong>" + nw.tr("Utilidad conductor:") + " </strong>$" + nw.addNumber(r.utilidad_conductor) + "</p>";
                    }
                    if (nw.evalueData(r.utilidad_empresa)) {
                        html += "<p class='price_see price_see_utilidadempresa'><strong>" + nw.tr("Utilidad empresa:") + " </strong>$" + nw.addNumber(r.utilidad_empresa) + "</p>";
                    }
                    if (nw.evalueData(r.comision_porcentaje)) {
                        html += "<p class='price_see price_see_porcentajecomision'><strong>" + nw.tr("Porcentaje comisión:") + " </strong>" + r.comision_porcentaje + "%</p>";
                    }
                    if (nw.evalueData(r.numero_referidos)) {
                        html += "<p class='price_see price_see_numeroreferidos'><strong>" + nw.tr("Numero de referidos:") + " </strong>" + nw.addNumber(r.numero_referidos) + "</p>";
                    }
                    if (nw.evalueData(r.valor_referido)) {
                        html += "<p class='price_see price_see_'utilidadreferidoempresa><strong>" + nw.tr("Utilidad referido de la utilidad empresa:") + " </strong>$" + nw.addNumber(r.valor_referido) + "</p>";
                    }
                }
                if (nw.evalueData(r.cliente_nombre)) {
                    html += "<p class='price_see price_see_cliente'><strong>" + nw.tr("Cliente:") + " </strong>" + r.cliente_nombre + "</p>";
                }
                if (self.configCliente.mostrar_valor_conductor === "SI") {
                    html += "<p class='price_see price_see_formapago'><strong>" + nw.tr("Forma de pago:") + " </strong>" + nw.tr(r.tipo_pago) + "</p>";
                }
                if (nw.evalueData(pr.bodega_text)) {
                    html += "<p class='price_see price_see_empresa'><strong>" + nw.tr("Empresa:") + " </strong>" + pr.bodega_text + "</p>";
                }
                self.usuario = r.usuario;
                html += "<p class='datosend_see price_see_origen'><strong>" + nw.tr("Origen:") + " </strong>" + r.origen + "</p>";
                html += "<p class='datosend_see price_see_destino'><strong>" + nw.tr("Destino:") + " </strong>" + r.destino + "</p>";
                if (nw.evalueData(r.subcategoria_servicio_text)) {
                    html += "<p class='datosend_see price_see_servicio'><strong>" + nw.tr("Servicio:") + " </strong>" + r.subcategoria_servicio_text + "</p>";
                }
                html += "<p class='datosend_see price_see_fechaserv'><strong>" + nw.tr("Fecha del servicio:") + " </strong>" + r.fecha + " " + r.hora + "</p>";
                if (nw.evalueData(r.hora_llegada)) {
                    html += "<p class='datosend_see price_see_horainicio'><strong>" + nw.tr("Hora inicio:") + " </strong>" + r.hora_llegada + "</p>";
                }
                if (nw.evalueData(r.hora_fin_servicio)) {
                    html += "<p class='datosend_see price_see_horafin'><strong>" + nw.tr("Hora finalización:") + " </strong>" + r.hora_fin_servicio + "</p>";
                }
//                html += "<p><strong>Total metros: </strong>" + r.total_metros + "</p>";
                if (typeof r.cancelado_notas === "string" && r.cancelado_notas != "") {
                    html += "<p class='datosend_see price_see_observacionesfinales'><strong>" + nw.tr("Observación finalización:") + " </strong>" + r.cancelado_notas + "</p>";
                }
                html += "<p class='datosend_id'><strong>#</strong>" + r.id + "</p>";

                if (r.estado == "CANCELADO_POR_USUARIO") {
                    html += "<p class='cancela_seeend' style='color: red; margin-top: 50px;'><strong>" + nw.tr("El usuario ha cancelado el servicio, puedes otorgar la calificación que consideres y enviar tus comentarios") + "</p>";
                }

                html += "</div>";
                self.addHeaderNote(html);
                self.ui.id.setValue(r.id);
            };
            rpc.exec("consultaSolit", data, func);
        }
    }
});