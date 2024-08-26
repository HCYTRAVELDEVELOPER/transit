nw.Class.define("f_z100_finalizarViaje_paga_tarjeta_credito", {
    extend: nw.lists,
    construct: function (self, data, callback) {
        console.log("START_LAUNCH:::::::::::::: f_z100_finalizarViaje_paga_tarjeta_credito", data);
        var selfthis = this;
        selfthis.self = self;
        selfthis.data = data;
        selfthis.callback = callback;
        selfthis.cobrarConTarjeta();
    },
    destruct: function () {
    },
    members: {
        cobrarConTarjeta: function cobrarConTarjeta() {
            var self = this;
            if (config.paymentStore === "Conekta") {
                return self.cobrarConTarjetaConekta();
            }
            if (config.paymentStore === "epayco") {
                return self.cobrarConTarjetaEpayco();
            }
            if (config.paymentStore === "payu") {
                return self.cobrarConTarjetaPayu();
            }
            if (config.paymentStore === "Stripe") {
                return self.cobrarConTarjetaStripe();
            }
            nw.dialog("No existe configuración de proveedor de pagos con tarjeta de crédito, consulte con el administrador del sistema.");
            return false;
        },
        cobrarConTarjetaEpayco: function cobrarConTarjetaEpayco() {
            var self = this;
            var data = self.data;
            console.log("data", data);
            data.app_name = config.name;
            data.id_relational_pay = data.serv.id;
            data.id_tarjeta_credito = data.serv.id_tarjeta_credito;
            if (typeof config.apiKeyEpayco !== 'undefined' && config.apiKeyEpayco != "") {
                data.apiKeyEpayco = config.apiKeyEpayco;
            }
            if (typeof config.privateKeyEpayco !== 'undefined' && config.privateKeyEpayco != "") {
                data.privateKeyEpayco = config.privateKeyEpayco;
            }
            data.test = "NO";
//            data.test = "SI";
            if (nw.utils.evalueData(main.configCliente.pagosPruebas)) {
                data.test = main.configCliente.pagosPruebas;
            }
            console.log("cobrarConTarjetaEpayco::data", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(false);
            nw.loading({text: "Por favor espere...", title: "Pagando con tarjeta..."});
            var func = function (r) {
                nw.loadingRemove();
                console.log("cobrarConTarjeta", r);
                self.cobroCardEnd(r, data);
            };
            rpc.exec("makePagoCreditEpayco", data, func);
        },
        cobrarConTarjetaPayu: function cobrarConTarjetaPayu(data, callback) {
            var self = this;
            data.app_name = config.name;
            data.id_relational_pay = data.id;
            console.log("cobrarConTarjetaPayu::data", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log("cobrarConTarjetaPayu:::response", r);

                if (r === "pago_en_ceros_aprobada") {
                    self.finalizarServicio(data);
                    return;
                }

                var rta = nw.validateNwPayments(r.result);

                console.log("rta", rta);
                rta.status = "OK";
                var h = "";
                h += rta.status_description + ". <br />";
                h += rta.responseCode + " <br />";
                if (nw.evalueData(rta.responseMessage)) {
                    h += rta.responseMessage + ". <br />";
                }
                if (!rta.approved || !r.APPROVED) {
                    rta.status = "Rechazada";
                } else {
                    rta.ref_payco = rta.orderId;
                }
                rta.respuesta = h;
                self.cobroCardEnd(rta, data);
            };
            rpc.exec("makePagoCreditPayu", data, func);
        },
        cobrarConTarjetaStripe: function cobrarConTarjetaStripe() {
            var self = this;
            var data = self.data;
            console.log("data", data);
            data.app_name = config.name;
            data.id_relational_pay = data.serv.id;
            data.id_tarjeta_credito = data.serv.id_tarjeta_credito;
            data.cobro = true;
            data.description = "Pago viaje en " + config.name;
//            data.test = "NO";
            data.test = "SI";
            if (nw.utils.evalueData(main.configCliente.pagosPruebas)) {
                data.test = main.configCliente.pagosPruebas;
            }
            console.log("cobrarConTarjetaStripe::data", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "stripeApi");
            rpc.setAsync(true);
            rpc.setLoading(false);
            nw.loading({text: "Por favor espere...", title: "Pagando con tarjeta..."});
            var func = function (r) {
                nw.loadingRemove();
                console.log("cobrarConTarjeta", r);
                if (typeof r == "string") {
                    nw.utils.information(r);
                    var ra = {
                        status: "Rechazada",
                        respuesta: r
                    };
                    self.cobroCardEnd(ra, data);
                    return;
                }
                
                if (typeof r == "object") {
                    nw.utils.information(r.status);
                }

                self.cobroCardEnd(r, data);
            };
            rpc.exec("saveApiStripe", data, func);
        },
        cobrarConTarjetaConekta: function cobrarConTarjetaConekta(data) {
            var self = this;
            data.ruta = "/app/pagos/";
            data.itemName = "Pago de viaje ID " + data.id;
            data.itemDescription = "Pago de viaje ID " + data.id + " dir_origen: " + data.dir_origen + " dir_destino: " + data.dir_destino;
            data.item_unit_price = data.precio_viaje.toString().replace(".", "");
            data.itemQuantity = 1;
            data.street1 = "Calle 123, int 2";
            data.postal_code = "06100";
            data.country = "MX";
            data.currency = "MXN";
            data.more_info = "";
            data.reference = "123456789";
            console.log("START:::cobrarConTarjetaConekta:::DATA", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios_conductor");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log("RESPONSE_SERVER_CONEKTA:::cobrarConTarjetaConekta:::r", r);
                self.cobroCardEnd(r, data);
            };
            rpc.exec("makePagoCreditConekta", data, func);
        },
        cobroCardEnd: function cobroCardEnd(r, data) {
            console.log("cobroCardEnd::: r ::: data", r, data);
            var self = this;
            var selfparent = this.self;
            var options = {
                cleanHtml: false,
                textCancel: "Cambiar a efectivo",
                textAccept: "Volver"
            };
            var volverIntentar = function () {
                return true;
            };
            var cambiarFormaPago = function () {
                selfparent.cambiarFormaPago(data.id, "efectivo");
                return true;
            };
            if (r.status === "Rechazada") {
                var html = "";
                if (nw.evalueData(r.estado)) {
                    html += r.estado + ". ";
                }
                if (nw.evalueData(r.respuesta)) {
                    html += r.respuesta + ". ";
                }
                if (nw.evalueData(r.ref_payco)) {
                    html += ". Ref: " + r.ref_payco;
                }
                nw.dialog(html, volverIntentar, cambiarFormaPago, options);
                return;
            } else
            if (r.status === "OK" || r.status == "succeeded") {
                self.callback(data);
            } else {
                nw.dialog(r, volverIntentar, cambiarFormaPago, options);
            }
        }
    }
});