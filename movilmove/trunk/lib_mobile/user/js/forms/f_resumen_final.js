nw.Class.define("f_resumen_final", {
    extend: nw.forms,
    construct: function () {
//        $(".f_resumen_final").remove();
        var up = nw.userPolicies.getUserData();
        var self = this;
        self.id = "f_resumen_final";
        self.setTitle = "<span style='color:#fff;'>Resumen</span>";
        self.showBack = false;
        self.closeBack = false;
        self.textClose = "Home";
        self.changeHash = true;
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
//        self.transition = "slideup";
        self.createBase();
        self.event = new Event('calificaFin');
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
                label: "Calificación",
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
//                position: "top",
            name: "aceptar",
            label: "Calificar",
            callback: function () {
                if (!self.validate()) {
                    return false;
                }
                var up = nw.userPolicies.getUserData();
                var data = self.getRecord();
                data.usuario = self.usuario;
                data.usuario_califica = up.usuario;
                data.empresa = up.empresa;
                data.perfil = up.perfil;
                data.service = self.data;
                if (nw.utils.evalueData(self.dataPopulate.id_parada)) {
                    data.id_parada = self.dataPopulate.id_parada;
                }
                console.log("data", data);
                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                rpc.setLoading(true);
                var func = function (r) {
                    document.dispatchEvent(self.event);
                    if (typeof r.saldo === "undefined") {
                        nw.dialog("Error inesperado, " + r);
                        return false;
                    }
                    window.localStorage.setItem("saldo", r.saldo);
                    nw.home();
                    main.selfCrearViaje.activeNormal();

//                    main.registerServiceInFirebase(self.data.id);
                    main.registerServiceInFirebase(data.id);

//                    nw.sendNotificacion({
//                        title: "Calificación de viaje",
//                        body: "Calificación de " + data.puntaje,
//                        icon: "fcm_push_icon",
//                        sound: "default",
////                                    data: "main.crearVisita()",
//                        data: "nw.dialog('Calificación de " + data.puntaje + "')",
//                        callback: "FCM_PLUGIN_ACTIVITY",
//                        to: self.data.token_conductor
//                    });
                };

                rpc.exec("calificarServicio", data, func);
            }
        });

        self.show();

        nw.addClass(nw.getElement(self.canvas), "f_calificar_estrellas");

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
    },
    destruct: function () {
    },
    members: {
        arrayPuntaje: function arrayPuntaje(number) {
            var re = ["", nw.utils.tr("Terrible"), nw.utils.tr("Malo"), nw.utils.tr("Regular"), nw.utils.tr("Bueno"), nw.utils.tr("Excelente")];
            var rt = re[number];
            return rt;
        },
        populate: function populate(pr, callback) {
            var self = this;
            console.log("populate:::pr", pr);
            self.valor_final = "0";
            var data = {};
            data.id = pr.id;
            self.dataPopulate = pr;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("populate", r);
                if (!r) {
//                    nw.dialog("El servicio no existe");
//                    nw.back();
//                    self.reject();
                    nw.home();
                    return false;
                }
                if (typeof callback != "undefined") {
                    callback();
                }

                self.ui.id.setValue(pr.id);

                var valortotal = 0;
                if (nw.evalueData(r.valor_total_servicio)) {
                    valortotal = r.valor_total_servicio;
                }

                self.data = r;
                var html = "<div class='resumenfinaldiv'>";
                html += "<h1 class='price_see'>" + nw.utils.tr("Total a pagar:") + " $<span class='totalapagar'>" + nw.addNumber(valortotal) + "</span></h1>";
                if (r.aplico_peaje == "SI") {
                    html += "<p class='price_see'><strong>" + nw.utils.tr("Peajes:") + "</strong> $" + nw.addNumber(r.valor_peajes) + "</p>";
                }
                if (r.aplico_recargo == "SI") {
                    html += "<p class='price_see'><strong>" + nw.utils.tr("Recargo:") + "</strong> $" + nw.addNumber(r.valor_recargo_ruta_fija) + "</p>";
                }
                if (nw.evalueData(r.valor_espera)) {
                    html += "<p class='price_see'><strong>" + nw.utils.tr("Valor espera:") + "</strong> $" + nw.addNumber(r.valor_espera) + "</p>";
                }
                if (nw.evalueData(r.saldo_user_aplicado)) {
                    html += "<p class='price_see'><strong>" + nw.utils.tr("Pago con saldo:") + "</strong> $" + nw.addNumber(r.saldo_user_aplicado) + "</p>";
                }
                if (nw.evalueData(r.descuento_aplicado)) {
                    html += "<p class='price_see'><strong>" + nw.utils.tr("Descuento:") + "</strong> $" + nw.addNumber(r.descuento_aplicado) + "</p>";
                    var valorsindescuento = parseFloat(r.valor_total_servicio) + parseFloat(r.descuento_aplicado);
                    html += "<p class='price_see'><strong>" + nw.utils.tr("Valor sin descuento:") + " </strong>$" + nw.addNumber(valorsindescuento) + "</p>";
                }
                html += "<p class='price_see'><strong>" + nw.utils.tr("Tipo pago:") + " </strong>" + r.tipo_pago + "</p>";
                html += "<p class='datafindrivres'><strong>" + nw.utils.tr("Conductor:") + " </strong> <span class='fotodrivresumenfin' style='background-image: url(" + config.domain_rpc + r.conductor_foto + ")'></span><span class='datadrivresumenfin'>" + r.conductor + " " + r.placa + "</span></p>";
                self.usuario = r.conductor_usuario;
                html += "<p><strong>" + nw.utils.tr("Origen:") + " </strong>" + r.origen + "</p>";
                html += "<p><strong>" + nw.utils.tr("Destino:") + " </strong>" + r.destino + "</p>";
                html += "<p><strong>" + nw.utils.tr("Servicio:") + " </strong>" + r.subcategoria_servicio_text + "</p>";
                html += "<p><strong>" + nw.utils.tr("Fecha del servicio:") + " </strong>" + r.fecha + " " + r.hora + "</p>";
                if (nw.evalueData(r.hora_llegada)) {
                    html += "<p><strong>" + nw.utils.tr("Hora inicio:") + " </strong>" + r.hora_llegada + "</p>";
                }
                if (nw.evalueData(r.hora_fin_servicio)) {
                    html += "<p><strong>" + nw.utils.tr("Hora finalización:") + " </strong>" + r.hora_fin_servicio + "</p>";
                }
//                html += "<p><strong>Total metros: </strong>" + r.total_metros + "</p>";
                if (nw.evalueData(pr.bodega_text)) {
                    html += "<p><strong>" + nw.utils.tr("Empresa:") + " </strong>" + pr.bodega_text + "</p>";
                }
                html += "<p><strong>" + nw.utils.tr("Servicio #:") + " </strong>" + pr.id + "</p>";
                if (nw.utils.evalueData(pr.id_parada)) {
                    html += "<p><strong>" + nw.utils.tr("Parada / pasajero #:") + " </strong>" + pr.id_parada + "</p>";
                }
                if (r.estado == "CANCELADO_POR_CONDUCTOR") {
                    html += "<p class='cancela_seeend' style='color: red; margin-top: 50px;'><strong>" + nw.utils.tr("El conductor ha cancelado el servicio, puedes otorgar la calificación que consideres y enviar tus comentarios") + "</p>";
                }
                html += "</div>";

                self.addHeaderNote(html);
//                self.ui.id.setValue(r.id);
            };
            rpc.exec("consultaSolit", data, func);
        }
    }
});