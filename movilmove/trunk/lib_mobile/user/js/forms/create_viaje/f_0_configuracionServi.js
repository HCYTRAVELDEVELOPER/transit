nw.Class.define("f_0_configuracionServi", {
    extend: nw.lists,
    construct: function (self, callback) {
        var selfthis = this;
//        if (self.debugConstruct) {
        console.log("START_LAUNCH:::::::::::::: f_0_configuracionServi");
//        }
//        if (nw.utils.evalueData(window.localStorage.getItem("configurationInitAccountMovilmove"))) {
//            if (nw.utils.evalueData(window.localStorage.getItem("lastVersionCacheCloud"))) {
//                var r = window.localStorage.getItem("configurationInitAccountMovilmove");
//                r = JSON.parse(r);
//                var cacheStorage = window.localStorage.getItem("version_in_this_device");
//                var versionCache = window.localStorage.getItem("lastVersionCacheCloud");
//                console.log("versionCache", versionCache);
//                console.log("cacheStorage", cacheStorage);
//                console.log("cacheStorage.split(-)[0]", cacheStorage.split("-")[0]);
//                if (cacheStorage.split("-")[0] == versionCache) {
//                    console.log("configuracionServi:::jsonCache", r);
//                    console.log("configuracionServi local");
//                    config.addTextInAccountOtherData += "<br />Configuration Movilmove from cache. ";
////                    alert("configuracionServi local");
//                    return selfthis.continuaConfig(r, callback, self);
//                }
//            }
//        }
        var r = main.getConfigCache();
        if (r != false) {
//            alert("configuracionServi local");
            return selfthis.continuaConfig(r, callback, self);
        }

        config.addTextInAccountOtherData += "<br />Configuration Movilmove from Cloud. ";

        var up = nw.userPolicies.getUserData();
        var data = {};
        data.empresa = up.empresa;
        var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
        rpc.setAsync(true);
        rpc.setLoading(true);
        console.log("f_0_configuracionServi:::dataSendServer", data);
        var funcs = function (r) {
            console.log("f_0_configuracionServi:::responseServer", r);
            console.log("configuracionServi cloud");
//            alert("configuracionServi cloud");
            window.localStorage.setItem("configurationInitAccountMovilmove", JSON.stringify(r));
            return selfthis.continuaConfig(r, callback, self);
        };
        rpc.exec("consultaConfiguracion", data, funcs);
    },
    destruct: function () {
    },
    members: {
        continuaConfig: function (r, callback, self) {
            if (typeof r.texto_boton_a_donde_vas === 'string' && r.texto_boton_a_donde_vas != "" && r.texto_boton_a_donde_vas != "0") {
                if (r.texto_boton_a_donde_vas.length <= 25) {
                    var btn_adv = document.querySelector('#button_adondevas');
//                        console.log(btn_adv);
                    if (btn_adv) {
                        btn_adv.innerHTML = "<i class='material-icons normal elinicon_form'>location_on</i>" + r.texto_boton_a_donde_vas;
                    }
                }
            }
            if (self.debug) {
                console.log("self.configCliente", r);
            }
            self.configCliente = r;
            main.configCliente = r;
            if (nw.utils.evalueData(main.configCliente.paymentStore)) {
                config.paymentStore = main.configCliente.paymentStore;
            }
            if (nw.utils.evalueData(main.configCliente.privateKeyEpayco)) {
                config.privateKeyEpayco = main.configCliente.privateKeyEpayco;
            }
            if (nw.utils.evalueData(main.configCliente.apiKeyEpayco)) {
                config.apiKeyEpayco = main.configCliente.apiKeyEpayco;
            }
            if (nw.utils.evalueData(main.configCliente.keyGoogleNotificacionPush)) {
                config.keyGoogleNotificacionPush = main.configCliente.keyGoogleNotificacionPush;
            }

            self.cobro = r.cobro_con;
            if (nw.evalueData(self.configCliente.valor_minimo_retiro)) {
                config.valor_minimo_retiro = self.configCliente.valor_minimo_retiro;
            }
            if (self.configCliente.tipo_pago === "AMBOS") {
                self.ui.tipo_pago.setVisibility(true);
            } else if (self.configCliente.tipo_pago === "EFECTIVO") {
                self.ui.tipo_pago.setValue(nw.tr("efectivo"));
            } else if (self.configCliente.tipo_pago === "CREDITO") {
                self.ui.tipo_pago.setValue("tarjeta_credito");
            } else {
                nw.dialog("No ha configurado la forma de pago. Consulte con el administrador del sistema");
            }

            //jasond codigo para servicios de carga
            if (self.configCliente.app_para == "CARGA") {
                self.ui.des_carga.setVisibility(true);
                self.ui.descricion_carga.setVisibility(true);
                self.ui.descricion_carga.setRequired(true);
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

            if (self.configCliente.paradas_adicional == "SI") {
                self.ui.contenedor_azul.setVisibility(true);
                self.ui.paradas_group.setVisibility(true);
                if (self.configCliente.app_para == "CARGA") {
//                        console.log(self.ui.des_carga);
                    var carga = document.querySelector('.des_carga');
                    carga.classList.add("des_carga_con_paradas");
                }
            }
//                if (self.configCliente.app_para == "CARGA") {
            if (self.configCliente.servicios_para == "AMBOS") {
                self.ui.tipo_servicio.setVisibility(true);
            }
            if (self.configCliente.servicios_para == "AHORA") {
                self.ui.tipo_servicio.setVisibility(false);
                self.ui.tipo_servicio.setValue("ahora");
            }
            if (self.configCliente.servicios_para == "RESERVA") {
                self.ui.tipo_servicio.setVisibility(false);
                self.ui.tipo_servicio.setValue("reservado");
            }

            if (nw.evalueData(callback)) {
                callback();
            }
        }
    }
});