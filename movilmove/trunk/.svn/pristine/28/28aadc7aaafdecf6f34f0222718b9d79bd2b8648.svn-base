nw.Class.define("f_formDatosCarga", {
    extend: nw.lists,
    construct: function (self, callback) {
        self.detalle = new nw.forms();
        self.detalle.id = "f_pagos_empresa";
        self.detalle.setTitle = "Detalle del servicio";
//            self.detalle.showBack = true;
//            self.detalle.closeBack = true;
        self.showBackCallBack = function () {
            nw.loadHome();
        };
        self.detalle.createBase();

        traeConfig(function () {

            var fields = [
                {
                    label: "Detalle servicio",
                    name: 'detalle_servicio',
                    type: "startGroup"
                },
                {
                    name: "numero_auxiliares",
                    label: "Número Auxiliares",
                    type: "selectBox"
                },
                {
                    name: "observaciones_servicio",
                    label: "Observaciones generales del servicio",
                    type: "textArea"
                },
                {
                    name: "",
                    type: "endGroup"
                },
                {
                    label: "Datos Recogida",
                    name: "datos_recogida",
                    type: "startGroup"
                },
                {
                    name: "contacto_recogida",
                    label: "Contacto",
                    type: "textField"
                },
                {
                    name: "telefono_recogida",
                    label: "Teléfono",
                    type: "numeric"
                },
                {
                    name: "observaciones_recogida",
                    label: "Observaciones",
                    type: "textArea"
                },
                {
                    name: "",
                    type: "endGroup"
                },
                {
                    label: "Datos Entrega",
                    name: "datos_entrega",
                    type: "startGroup"
                },
                {
                    name: "contacto_entrega",
                    label: "Contacto",
                    type: "textField"
                },
                {
                    name: "telefono_entrega",
                    label: "Teléfono",
                    type: "numeric"
                },
                {
                    name: "observaciones_entrega",
                    label: "Observaciones",
                    type: "textArea"
                },
                {
                    name: "",
                    type: "endGroup"
                },
                {
                    label: "Datos mercancía",
                    name: "datos_mercancia",
                    type: "startGroup"
                },
                {
                    name: "descripcion_carga",
                    label: "Descripción de la carga que transportas",
                    type: "textArea"
                },
                {
                    name: "empaque",
                    label: "Empaque. (Bultos, Estivas, Cajas)",
                    type: "textField"
                },
                {
                    name: "cantidad",
                    label: "Cantidad",
                    type: "numeric"
                },
                {
                    name: "volumen",
                    label: "Volumen",
                    type: "textField"
                },
                {
                    name: "peso",
                    label: "Peso",
                    type: "textField"
                },
                {
                    name: "valor_declarado",
                    label: "Valor Declarado",
                    type: "numeric"
                },
//                {
//                    name: "",
//                    type: "endGroup"
//                },
//                {
//                    label: "Detalle adicional",
//                    name: 'detalle_ubica',
//                    type: "startGroup"
//                },
                {
                    name: "salida_periferia",
                    label: "Salida Periferia",
                    type: 'switch',
                    options: "<option value='NO'>NO</option><option value='SI'>SI</option>"
                },
                {
                    name: "despacho",
                    label: "Despacho Nacional",
                    type: 'switch',
                    options: "<option value='NO'>NO</option><option value='SI'>SI</option>"
                },
                {
                    name: "retorno",
                    label: "Retorno",
                    type: 'switch',
                    options: "<option value='NO'>NO</option><option value='SI'>SI</option>"
                },
                {
                    name: "cargue",
                    label: "Cargue",
                    type: 'switch',
                    options: "<option value='NO'>NO</option><option value='SI'>SI</option>"
                },
                {
                    name: "descargue",
                    label: "Descargue",
                    type: 'switch',
                    options: "<option value='NO'>NO</option><option value='SI'>SI</option>"
                },
                {
                    name: "",
                    type: "endGroup"
                }
            ];
            self.detalle.setFields(fields);
            self.detalle.buttons = [
                {
                    style: "border: 0;background-color:#1abbd7;color:#fff;margin:0px;",
                    icon: "material-icons check_circle normal",
                    colorBtnBackIOS: "#fff",
                    position: "top",
                    name: "aceptar_detalle_servicio",
                    label: "Aceptar",
                    callback: function () {
                        document.activeElement.blur();
                        if (!self.detalle.validate()) {
                            return;
                        }
                        nw.loading({text: "Enviando datos...", title: "Por favor espere..."});
                        setTimeout(function () {
                            nw.loadingRemove();
                            var data = self.detalle.getRecord();
                            console.log("data", data);
                            self.numeroAuxiliares = data.numero_auxiliares;
                            self.data_carga = data;
                            nw.home();

                            callback(data);
                        }, 1000);
                    }
                }
            ];
            self.detalle.show();

            var data = {};
            for (var i = 0; i < 5; i++) {
                data[i] = i;
            }
            self.detalle.ui.numero_auxiliares.populateSelectFromArray(data);
            self.detalle.ui.numero_auxiliares.setValue("0");

            console.log("main.configCliente.documentos_carga", main.configCliente.documentos_carga);
            if (typeof main.configCliente.documentos_carga !== "undefined") {
                $.each(main.configCliente.documentos_carga, function (key, value) {
                    if (key != "id") {
                        var vis = true;
                        if (value === "NO") {
                            vis = false;
                        }
                        if (typeof self.detalle.ui[key] !== "undefined") {
                            if (value === "SI_REQUIRED_FALSE") {
                                self.detalle.ui[key].setVisibility(true);
                                self.detalle.ui[key].setRequired(false);
                            } else {
                                self.detalle.ui[key].setVisibility(vis);
                                self.detalle.ui[key].setRequired(vis);
                            }
                        }
                    }
                });
            }

        });

        function traeConfig(callback) {
            if (nw.utils.evalueData(main.configCliente.documentos_carga)) {
                return callback();
            }
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.empresa = up.empresa;
            var rpc = new nw.rpc(nw.getRpcUrl(), "app_user");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log("traeConfig", r);
                main.configCliente.documentos_carga = r;
                callback();
            };
            rpc.exec("traeConfigCarga", data, func);
        }
    },
    destruct: function () {
    },
    members: {

    }
});