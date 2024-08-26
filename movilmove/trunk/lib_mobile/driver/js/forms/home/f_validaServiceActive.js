nw.Class.define("f_validaServiceActive", {
    extend: nw.lists,
    construct: function (self, action, callback, datafirebase) {
//        if (self.debugConstruct) {
        console.log("2:::START_LAUNCH:::::::::::::: f_validaServiceActive");
//        }

        if (main.configCliente.usa_firebase == "SI") {
            console.log("datafirebase", datafirebase);
            continua(datafirebase);
        } else {
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            data.id_usuario = up.id_usuario;
            data.empresa = up.empresa;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            console.log("f_validaServiceActive::::::::::::::DataSend", data);
            var func = function (r) {
                console.log("f_validaServiceActive::::::::::::::RESPONSE_SERVER", r);
                continua(r);
            };
            rpc.exec("servicioActivoConductor", data, func);
        }
        function continua(r) {
            if (nw.evalueData(callback)) {
                callback(r);
            }
            if (r === false) {
                if (nw.evalueData(self.configCliente.permitirReasignarConductor)) {
                    if (self.configCliente.permitirReasignarConductor == "SI") {
                        if (self.serviceActive == true) {
                            self.serviceActive = false;
                            self.userCancelaService(true);
                        }
                    }
                }
            }
            if (typeof self.map === "undefined") {
                return false;
            }

            if (r.estado === "CANCELADO_POR_ADMIN" || r.estado === "SIN_ATENDER" || r.estado === "CANCELADO_POR_USUARIO") {

                nw.dialog(nw.utils.tr("El servicio fue cancelado por motivo:") + " " + nw.utils.tr(nw.utils.replace("_", " ", r.estado)));

                self.clearIntervalo();
                self.LimpiarTodo();
                main.resumenFinal(r, "cliente");
                return true;
            }

            if (self.cancela_conductor == true) {
                if (r.estado === "ABORDO") {
                    var ws = document.querySelector('.parent_btn_waze');
                    if (ws) {
                        ws.classList.remove("parent_btn_waze");
                    }
                } else {
                    var ws = document.querySelector('.parent_btn_waze');
                    var wt = document.querySelector('.btn_waze');
                    if (!ws && wt) {
                        wt.classList.add("parent_btn_waze");
                    }
                }
            }
            self.data_service = r;
            if (action === true) {
                if (r !== false) {
                    if (r.estado === "EN_RUTA" || r.estado === "ABORDO" || r.estado === "EN_SITIO") {
                        if (self.configCliente.app_para == "CARGA") {
//                            self.consultaTareasAdicionales();
                        }
                    }
                    if (r.estado === "CANCELADO_POR_ADMIN" || r.estado === "SIN_ATENDER" || r.estado === "CANCELADO_POR_USUARIO") {
//                        self.data_service = r;
                        self.userCancelaService();
                        return true;
                    } else
                    if (r.estado === "LLEGADA_DESTINO" && !nw.evalueData(r.calificacion)) {
                        self.clearIntervalo();
                        self.LimpiarTodo();
                        main.resumenFinal(r, "cliente");
                        return true;
                    }
                }
                return true;
            }
            r.type = "conductor";
            self.id_service = r.id;
            self.data_service = r;
            self.resolveStatus();
        }
    },
    destruct: function () {
    },
    members: {
    }
});