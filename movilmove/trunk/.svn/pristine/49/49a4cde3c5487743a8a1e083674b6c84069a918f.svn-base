nw.Class.define("f_cancelar_servicio", {
    extend: nw.forms,
    construct: function (parent) {
        var self = this;
        self.id = "f_cancelar_servicio";
        self.showBack = true;
        self.closeBack = false;
        self.transition = "slide";
        self.setTitle = "Cancelar";
        if (nw.utils.getMobileOperatingSystem() == "IOS") {
//        self.transition = "slideup";
            self.transition = "none";
        }

        var html = "<p style='text-align: center;'>" + nw.utils.tr("Recuerde que si no cancela a tiempo se podrán generar recargos") + ".";
        html += " </br>" + nw.utils.tr("Seleccione el motivo de la cancelación");
        self.parent = parent;
        if (nw.evalueData(self.parent)) {
            if (nw.evalueData(self.parent.dataServiceActive)) {
                html += "<span style='display: block; font-size: 12px; font-style: italic; color: gray;'>" + nw.utils.tr("Servicio: ") + self.parent.dataServiceActive.id + "";
                if (nw.evalueData(self.parent.dataServiceActive.id_parada)) {
                    html += " - " + nw.utils.tr("Parada / Pasajero: ") + self.parent.dataServiceActive.id_parada + "";
                }
                html += "</span>";
            }
        }
        html += "</p>";
        self.html = html;
        self.createBase();
        self.recargo = "0";
        self.event = new Event('cancelServi');
        var fields = [
            {
                icon: "material-icons account_circle normal",
                name: "id",
                label: "ID",
                type: "textField",
                visible: false
            },
            {
                icon: "material-icons account_circle normal",
                name: "cancelado_motivo",
                label: "Motivo",
                placeholder: "Motivo",
//                type: "selectBox",
                type: "radio",
                required: true
            },
            {
                icon: "material-icons account_circle normal",
                name: "cancelado_notas",
                label: "Observaciones",
                placeholder: "Observaciones",
                type: "textArea",
                required: true
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                style: "",
                icon: "material-icons how_to_reg normal",
                colorBtnBackIOS: "#ffffff",
                position: "top", //center top
                name: "aceptar",
                label: "Cancelar",
                callback: function () {
                    self.cancelar();
                }
            }
        ];
        self.show();


        console.log("self.canvas", self.canvas);
        var css = document.createElement("style");
        css.className = "css_cancel";
        css.innerHTML = ".ofertas_container{display: none!important;}";
        document.querySelector(self.canvas).appendChild(css);


        var up = nw.userPolicies.getUserData();
        var data = {};
        data.terminal = up.terminal;
        data.empresa = up.empresa;
        data.usuario = up.usuario;
        data.perfil = up.perfil;
        self.ui.cancelado_motivo.populateSelect('conductores', 'consultaTipologiaCancelacion', data, function (a) {
            if (a.length == 0) {
                var data = {};
                data["conductor_pidio"] = "El conductor me lo ha pedido";
                data["tarda_mucho"] = "Está tardando demasiado";
                data["tengo_otro_coche"] = "Ya tengo otro coche";
                data["estoy_probando"] = "Solo estoy probando";
                self.ui.cancelado_motivo.populateSelectFromArray(data);
            }
        }, true);

        self.ui.id.setValue(main.id_service_active);

    },
    destruct: function () {
    },
    members: {
        cancelarParada: function cancelarParada(data) {
            var self = this;
            var rpc = new nw.rpc(self.getRpcUrl(), "app_user");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (ra) {
                console.log("ra", ra);
                nw.dialog("Parada cancelada correctamente.");
                main.registerServiceInFirebase(data.id);
                return self.cancelarEnd();
            };
            rpc.exec("cancelarParada", data, func);
        },
        cancelar: function cancelar() {
            var self = this;
            var data = self.getRecord();
            if (nw.evalueData(self.parent)) {
                if (nw.evalueData(self.parent.dataServiceActive)) {
                    if (nw.evalueData(self.parent.dataServiceActive.id_parada)) {
                        data.id_parada = self.parent.dataServiceActive.id_parada;
                    }
                }
            }
            console.log("self.parent", self.parent);
            console.log("self.parent.dataServiceActive", self.parent.dataServiceActive);
            console.log("data", data);
            if (!self.validate()) {
                return false;
            }
            if (!nw.evalueData(data.cancelado_motivo_text)) {
                nw.dialog("Seleccione un motivo de cancelación");
                return false;
            }

            data.pide_fotos = data.cancelado_motivo;
            data.cancelado_motivo = data.cancelado_motivo_text;

            if (nw.utils.evalueData(data.id_parada)) {
                return self.cancelarParada(data);
            }

//            if (data.pide_fotos == "SI") {
//                self.subirImagenes(function (files) {
//                    console.log("files", files);
//                    sigue(files, function () {
//                        nw.remove(".pruebauno_container");
//                    });
//                });
//            } else {
            sigue();
//            }

            function sigue(files, callback) {
                var data_parent = self.parent.datos_servicio_activo;
                console.log("data_parent", data_parent);
                var data = self.getRecord();
                data.pide_fotos = data.cancelado_motivo;
                data.cancelado_motivo = data.cancelado_motivo_text;
                var up = nw.userPolicies.getUserData();
                if (!nw.evalueData(data.cancelado_motivo)) {
                    nw.dialog("Seleccione un motivo de cancelación");
                    return false;
                }
                console.log(up);
                if (typeof data_parent !== 'undefined') {
                    data.cancela = "cancela_usuario";
                    data.tiempo = data_parent.hora;
                    data.hora_llegada = data_parent.hora_llegada;
                    data.estado_service = data_parent.estado;
                }
                data.empresa = up.empresa;
                data.perfil = up.perfil;
                data.usuario = up.usuario;
                data.nombre = up.nombre;
                data.apellido = up.apellido;
                data.terminal = up.terminal;
                data.nit = up.documento;
                data.domain_rpc = config.domain_rpc;
                data.estado = "CANCELADO_POR_USUARIO";
                data.texto_cancel_por_conductor = nw.utils.tr("Servicio cancelado por conductor:");
                data.texto_cancel_por_cliente = nw.utils.tr("Servicio cancelado por cliente");
                if (nw.evalueData(files)) {
                    data.files = files;
                }

                if (data.recargo > 0) {
                    nw.dialog(nw.tr("Servicio cancelado, el coste de cancelación es de") + " " + data.recargo + " " + config.moneda);
                }

                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                rpc.setLoading(true);
                var func = function (r) {

                    main.registerServiceInFirebase(data.id);

                    var os = nw.utils.getMobileOperatingSystem();
                    if (os === "IOS") {
                        nw.loading("Espere por favor");
                        window.location.reload();
                    } else {
                        return self.cancelarEnd(r, callback);
                    }
                };
                rpc.exec("cancelarServicio", data, func);
            }
        },
        cancelarEnd: function cancelarEnd(r, callback) {
            var self = this;
            nw.remove(".ofertas_container");
            if (nw.evalueData(callback)) {
                callback();
            }
            if (typeof r === "string") {
                self.recargo = r;
            }
            self.event.detail = {'recargo': self.recargo};

            document.dispatchEvent(self.event);

//                main.selfCrearViaje.hiddenWaitingDriver();
//                main.selfCrearViaje.loadInitial();
//                if (typeof data_parent !== 'undefined') {
//                    if (typeof data_parent.token_conductor !== 'undefined') {
//                        nw.sendNotificacion({
//                            title: "Servicio cancelado",
//                            body: "El usuario " + up.usuario + " ha cancelado el servicio por " + data.cancelado_motivo,
//                            icon: "fcm_push_icon",
//                            sound: "default",
//                            data: "main.cerrarNotificacion()",
//                            callback: "FCM_PLUGIN_ACTIVITY",
//                            to: data_parent.token_conductor
//                        });
//                    }
//                }
            nw.back();
            self.parent.cancelservice();
        }
    }
});