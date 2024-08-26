qx.Class.define("qxnw.basics.forms.f_ticket", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.setTitle("Generación tickets");
        this.createBase();
        var fields = [
            {
                name: "Tiempos Respuesta",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "tiempo_respuesta",
                type: "textField",
                label: "Tiempo",
                visible: false,
                mode: "numeric"
            },
            {
                name: "tiempo",
                type: "label",
                label: ""
            },
            {
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "id",
                type: "textField",
                label: self.tr("ID"),
                visible: "false"
            },
            {
                name: "cliente",
                type: "textField",
//                type: "selectTokenField",
                label: "Cliente",
                required: true,
                visible: false
            },
            {
                label: "Quien reportó",
                type: "textField",
                name: "quien_reporta",
                required: true,
                visible: false
            },
            {
                name: "fecha_reporte",
                type: "dateTimeField",
                label: self.tr("Fecha reporte"),
                required: true,
                visible: false
            },
            {
                label: "Medio ingreso",
                type: "selectBox",
                visible: false,
                name: "medio_ingreso",
                required: true
            },
            {
                label: "Programa",
                type: "selectBox",
                name: "programa",
                visible: false
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "Tipo de servicio",
                type: "selectBox",
                name: "tipo_servicio",
                required: true,
                visible: false
            },
            {
                label: "Correo de persona que reportó",
                type: "textField",
                name: "correo_quien_reporto",
                mode: "email",
                visible: false,
                required: true
            },
            {
                label: "Responsable de atención",
                type: "selectBox",
                name: "atiende",
                visible: false,
                required: true
            },
            {
                label: "Usuario atendio",
                type: "selectBox",
                name: "usuario_atiende",
                visible: false
            },
            {
                label: "Tipo Ticket",
                type: "selectBox",
                name: "tipo_ticket",
                visible: false
            },
            {
                label: "Adjunto",
                type: "uploader",
                name: "adjunto"
            },
            {
                type: "endGroup"
            },
            {
                label: "<b>Enviar Correo</b>",
                type: "checkBox",
                name: "enviar_correo",
                visible: false

            },
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "Asunto",
                type: "textField",
                name: "asunto",
                required: true
            },
            {
                type: "endGroup"
            },
            {
                label: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                label: "Descripción de la Novedad",
                type: "textArea",
                name: "novedad",
                required: true
            },
            {
                label: "Diagnóstico",
                type: "textArea",
                visible: false,
                name: "diagnostico"
            },
            {
                type: "endGroup"
            }
        ];
        self.setFields(fields);
        var grupo_tiempo = self.getGroup("tiempos_respuesta");
        grupo_tiempo.setVisibility("excluded");
        var fecha = new Date();
        self.ui.fecha_reporte.setValue(fecha);
        self.ui.enviar_correo.setValue(true);
        var data = {};
        data[""] = "Seleccione";
        data["TELEFONO"] = "TELEFONO";
        data["CORREO"] = "CORREO";
        data["WEB"] = "WEB";
        data["PERSONAL"] = "PERSONAL";
        qxnw.utils.populateSelectFromArray(self.ui.medio_ingreso, data);
        self.ui.medio_ingreso.setValue("WEB");
        var data = {};
        data[""] = "SELECCIONE";
        data["1"] = "GARANTIA";
        data["2"] = "URGENCIA";
        data["4"] = "MODIFICACIÓN DE DATA";
        data["6"] = "ASESORÍA / PREGUNTAS";
        data["9"] = "HORAS SOPORTE";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_servicio, data);
        var up = qxnw.userPolicies.getUserData();
        self.ui.cliente.setValue(up.db + " - " + up.user);
        self.ui.correo_quien_reporto.setValue(up.email);
        self.ui.quien_reporta.setValue(up.user);
        var data = {};
        data["63"] = "Diego Sánchez";
        qxnw.utils.populateSelectFromArray(self.ui.atiende, data);
        var data = {};
        data["9"] = "Sin Categorizar";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_ticket, data);
//        data.table = "tk_tipos_tiqueds";
//        qxnw.utils.populateSelect(self.ui.tipo_ticket, "master", "populate", data);

        self.ui.tipo_servicio.addListener("changeSelection", function (e) {

            var tiempo;
            if (this.getValue()["tipo_servicio"] == 1) {
                tiempo = "21600";
            } else if (this.getValue()["tipo_servicio"] == 2) {
                tiempo = "4800";
            } else if (this.getValue()["tipo_servicio"] == 4) {
                tiempo = "3600";
            } else if (this.getValue()["tipo_servicio"] == 6) {
                tiempo = "2880";
            } else if (this.getValue()["tipo_servicio"] == 9) {
                tiempo = "2888";
            }
//            self.ui.tiempo.setValue(self.tr("<b style='font-size:14px; \n\
//                             background:#F56F5C; padding:10px;'>El tiempo máximo para dar respuesta es de: " + tiempo + " minutos</b>"));
//            self.ui.tiempo_respuesta.setValue(self.tr(tiempo));
            self.slotConsultSLA();
        });
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    }
    ,
    destruct: function () {
    },
    members: {
        pr: null,
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            if (qxnw.utils.evalue(pr.cliente)) {
                var cliente = {
                    id: pr.cliente,
                    nombre: pr.cliente_text
                };
                self.ui.cliente.addToken(cliente);
            }
        },
        slotSave: function slotSave(p) {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var up = qxnw.userPolicies.getUserData();
            var URLactual = window.location.hostname;
            var data = {};
            data = self.getRecord();
            var sop = up.db;
            if (typeof (sop) == 'object') {
                data.url = URLactual;
                data.cliente = sop["cliente"];
                data.cliente_text = sop["cliente_text"];
            }
//            if (!sop["cliente"]) {
//                qxnw.utils.information("ID cliente no existe");
//                return false;
//            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones");
            rpc.setAsync(true);
            var func = function (r) {
//                if (r) {
                qxnw.utils.information("Ticket generado Exitosamente");
                self.accept(r);
//                }
            };
            rpc.exec("envioTicket", data, func);
        },
        slotConsultSLA: function slotConsultSLA(p) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var URLactual = window.location.hostname;
            var data = {};
            data = self.getRecord();
            var sop = up.db;
            if (typeof (sop) == 'object') {
                data.url = URLactual;
                data.cliente = sop["cliente"];
                data.cliente_text = sop["cliente_text"];
            }
            data.method = "populateServiciosTk";
            data.array_param = true;
            data.class_param = "tk_tickets";
            if (qxnw.utils.evalue(data.cliente)) {
                if (qxnw.utils.evalue(data.tipo_servicio)) {
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_configuraciones");
                    rpc.setAsync(true);
                    var func = function (r) {
                        console.log(r);
                        if (r) {
                            if (qxnw.utils.evalue(r)) {
                                var time = r[0].tiempo * 60;
                                var hours = Math.floor(time / 3600);
                                var minutes = Math.floor((time % 3600) / 60);
                                var seconds = time % 60;
                                minutes = minutes < 10 ? '0' + minutes : minutes;
                                seconds = seconds < 10 ? '0' + seconds : seconds;
                                hours = hours < 10 ? '0' + hours : hours;

                                var result = hours + ":" + minutes + ":" + seconds;
                                self.result = result;

                                self.ui.tiempo.setValue(self.tr("<b style='font-size:14px; \n\
                                background:#F56F5C; padding:10px;'>El tiempo máximo para dar respuesta es de: " + result + "</b>"));
                                self.ui.tiempo_respuesta.setValue(self.tr(r[0].tiempo));
                                self.ui.accept.setEnabled(true);
                            } else {
                                self.ui.tiempo.setValue(self.tr("<b style='font-size:14px; background:#F56F5C;'>Ya que no tiene incluido este servicio a la cuenta de este cliente, verifique con el lider de proyectos</b>"));
                                self.ui.accept.setEnabled(false);
                            }
                        }
                    };
                    rpc.exec("populateConsultasTK", data, func);
                }
            }
        }

    }
});
