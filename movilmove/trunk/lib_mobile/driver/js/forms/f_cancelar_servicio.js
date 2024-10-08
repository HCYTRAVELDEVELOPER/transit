nw.Class.define("f_cancelar_servicio", {
    extend: nw.forms,
    construct: function (pr, callback) {
        var self = this;
        self.id = "f_cancelar_servicio";
        self.showBack = true;
        self.closeBack = false;
        self.transition = "slide";
        if (nw.utils.getMobileOperatingSystem() == "IOS") {
//        self.transition = "slideup";
            self.transition = "none";
        }
        self.setTitle = "Cancelar";
        self.html = "<p style='text-align: center;'>" + nw.tr("Recuerde que si no cancela a tiempo se podra generear recargos.") + " </br></br> " + nw.tr("¿Está seguro de cancelar este servicio?") + "</p>";
        self.data_service = pr;
        console.log(self.data_service);
        self.callback = null;
        if (nw.evalueData(callback)) {
            self.callback = callback;
        }
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
                position: "center",
                name: "aceptar",
                label: "Cancelar",
                callback: function () {
                    if (!self.validate()) {
                        return false;
                    }
                    self.cancelar();
                }
            }
        ];
        self.show();

        var up = nw.userPolicies.getUserData();
        var data = {};
        data.terminal = up.terminal;
        data.empresa = up.empresa;
        data.usuario = up.usuario;
        data.perfil = up.perfil;
        self.ui.cancelado_motivo.populateSelect('conductores', 'consultaTipologiaCancelacion', data, function (a) {
            if (a.length == 0) {
                var data = {};
//                data[""] = "Seleccione";
                data["cliente_pidio"] = "El cliente me lo ha pedido";
                data["cliente_no_llega"] = "El cliente no llega";
                data["no_alcanzo_a_llegar"] = "No alcanzo a llegar";
                data["se_encuentra_muy_lejos"] = "Se encuentra muy lejos";
                data["se_ha_varado_el_vehiculo"] = "Se ha varado el vehículo";
                self.ui.cancelado_motivo.populateSelectFromArray(data);
            }
        }, true);

        self.ui.id.setValue(self.data_service.id);

    },
    destruct: function () {
    },
    members: {
        cancelar: function cancelar() {
            var self = this;

            var data = self.getRecord();
            console.log("data", data);
            if (!nw.evalueData(data.cancelado_motivo_text)) {
                nw.dialog("Debe seleccionar un motivo de cancelación");
                return false;
            }
            data.pide_fotos = data.cancelado_motivo;
            data.cancelado_motivo = data.cancelado_motivo_text;
            console.log("data", data);

            if (data.pide_fotos == "SI") {
                main.f_drive_mapa_servicios.subirImagenes(function (files) {
                    console.log("files", files);
                    sigue(files, function () {
                        nw.remove(".pruebauno_container");
                    });
                });
            } else {
                sigue();
            }


            function sigue(files, callback) {
                var data_parent = self.data_service;
                var up = nw.userPolicies.getUserData();
                data.usuario = up.usuario;
                data.empresa = up.empresa;
                data.perfil = up.perfil;
                data.nombre = up.nombre;
                data.apellido = up.apellido;
                data.nit = up.documento;
                data.domain_rpc = config.domain_rpc;
                data.estado = "CANCELADO_POR_CONDUCTOR";
                if (nw.evalueData(config.cancelarliberaServicio)) {
                    if (config.cancelarliberaServicio == true) {
                        data.libera_servicio = "SOLICITUD";
                    }
                }
                if (config.cancelarliberaServicio)
                    if (!nw.evalueData(data.cancelado_motivo)) {
                        nw.dialog("Seleccione un motivo de cancelación");
                        return false;
                    }
                var nombre_conductor = "";
                if (up.nombre != "") {
                    nombre_conductor = up.nombre;
                }
                if (nw.evalueData(data.cancelado_motivo)) {
                    data.cancelado_motivo = data.cancelado_motivo.replace(/_/g, " ");
                } else {
                    data.cancelado_motivo = "";
                }
                if (typeof data_parent !== 'undefined') {
                    data.cancela = "cancela_conductor";
                    data.tiempo = data_parent.hora;
                    data.hora_llegada = data_parent.hora_llegada;
                    data.estado_service = data_parent.estado;
                }
                if (nw.evalueData(files)) {
                    data.files = files;
                }
                data.texto_cancel_por_conductor = nw.utils.tr("Servicio cancelado por conductor:");
                data.texto_cancel_por_cliente = nw.utils.tr("Servicio cancelado por cliente");
                var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
                rpc.setAsync(true);
                var func = function (r) {
                    if (nw.evalueData(callback)) {
                        callback();
                    }
                    if (typeof r === "string") {
                        self.recargo = r;
                    }
                    self.event.detail = {'recargo': self.recargo};

                    document.dispatchEvent(self.event);
                    nw.back();
                    nw.sendNotificacion({
                        title: "Servicio cancelado",
                        body: nw.tr("El conductor") + " " + nombre_conductor + " " + nw.utils.tr("ha cancelado el servicio por") + " " + nw.tr(data.cancelado_motivo),
                        icon: "fcm_push_icon",
                        sound: "default",
////                                    data: "main.crearVisita()",
//                    data: "nw.dialog('El conductor " + nombre_conductor + " ha cancelado el servicio por " + data.cancelado_motivo + "')",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: self.data_service.token_usuario
                    });

                    if (nw.evalueData(self.callback)) {
                        self.callback();
                    }

                    main.registerServiceInFirebase(data.id);

                };
                rpc.exec("cancelarServicio", data, func);
            }
        }
    }
});