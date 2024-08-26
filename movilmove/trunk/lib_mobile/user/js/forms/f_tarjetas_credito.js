nw.Class.define("f_tarjetas_credito", {
    extend: nw.forms,
    construct: function (callback) {
        var self = this;
        self.id = "f_tarjetas_credito";
        self.setTitle = "<span style='color:#fff;'>" + nw.tr("Registrar tarjeta") + "</span>";
        self.html = "";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Volver";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
//        self.transition = "slideup";
        if (nw.utils.getMobileOperatingSystem() == "IOS") {
//        self.transition = "slideup";
            self.transition = "none";
        }
        self.createBase();
        self.callback = callback;
        self.bandera = main.configCliente;
        var up = nw.userPolicies.getUserData();
        var fields = [];

        self.stripe = false;
        if (config.paymentStore === "Stripe") {
            self.stripe = true;
        }
//        self.stripe = false;
        if (self.stripe) {


            fields.push(
                    {
                        styleContainer: 'width:100%;float:left;margin:0px;',
                        name: "nombre_tarjeta",
                        car_min: "3",
                        car_max: "100",
                        label: "Nombre títular tarjeta",
                        placeholder: nw.tr('Nombre títular tarjeta'),
                        visible_label: false,
                        type: "textField",
                        required: true
                    },
                    {
                        styleContainer: 'width:100%;float:left;margin:0px;',
                        name: "email",
                        visible_label: false,
                        label: "Correo electrónico",
                        placeholder: 'Correo electrónico',
                        type: "textField",
                        mode: "email",
                        required: true
                    },
                    {
                        styleContainer: 'width:100%;float:left;margin:0px;',
                        name: "documento",
                        visible_label: false,
                        label: "Documento",
                        placeholder: 'Documento',
                        type: "numeric",
                        required: true
                    }
            );

            nw.require("https://js.stripe.com/v3/", function () {
                show();
            }, true);

            function show() {


                var data = {};
                var rpc = new nw.rpc(nw.getRpcUrl(), "stripeApi");
                rpc.setAsync(true);
                rpc.setLoading(true);
                var func = function (r) {
                    console.log("credentialsStripeApi:::responseServer", r);

                    var paymentForm = document.createElement('form');
                    paymentForm.id = 'payment-form';

                    var cardElementContainer = document.createElement('div');
                    cardElementContainer.id = 'card-element';

                    var cardErrorsContainer = document.createElement('div');
                    cardErrorsContainer.id = 'card-errors';
                    cardErrorsContainer.setAttribute('role', 'alert');

                    var submitButton = document.createElement('button');
                    submitButton.type = 'submit';
                    submitButton.className = 'submitBtnStripe';
                    submitButton.textContent = nw.utils.tr('Guardar');

                    paymentForm.appendChild(cardElementContainer);
                    paymentForm.appendChild(cardErrorsContainer);
                    paymentForm.appendChild(submitButton);

//                document.body.appendChild(paymentForm);
                    console.log("self.canvas", self.canvas);
                    document.querySelector(self.canvas).appendChild(paymentForm);

//                    self.stripeApi = Stripe('pk_test_51OboQsCTT79Q0XWPlBWrfIXafIgl3nrfMeLnpEY640jiECkT53Vxx7J6HuYjDgCn0l4NgMX2QDkUEx8kOFRlu4H000Ag0sqmW5');
                    self.stripeApi = Stripe(r.llavePublica);
                    console.log("STIPE", self.stripeApi);

                    var elements = self.stripeApi.elements();

                    var card = elements.create('card');
                    card.mount('#card-element');

                    var form = document.getElementById('payment-form');
                    form.addEventListener('submit', function (event) {
                        event.preventDefault();

                        console.log("card", card);

                        self.stripeApi.createToken(card).then(function (result) {
                            console.log("RESULLL:: ", result)
                            console.log("RESULLL::ID_CARD", result.token.id);
                            if (result.error) {
                                var errorElement = document.getElementById('card-errors');
                                errorElement.textContent = result.error.message;
                            } else {
                                console.log(result);
                                self.responseStripe = result;
                                self.save();
//                    stripeTokenHandler(result.token);
                            }
                        });
                    });

                };
                rpc.exec("credentialsStripeApi", data, func);
            }
        } else {



            fields.push(
                    {
                        label: "",
                        name: "card-form",
                        modeForm: "form",
                        type: "startGroup"
                    },
                    {
                        styleContainer: 'width:50%;float:left;margin:0px;',
                        name: "price",
                        label: "Price",
                        visible_label: true,
                        placeholder: 'Price',
                        type: "textField",
                        required: true,
                        enabled: false,
                        visible: false
                    },
                    {
                        styleContainer: 'width:50%;float:left;margin:0px;',
                        name: "cuotas",
                        label: "Cuotas",
                        visible_label: true,
                        placeholder: 'Cuotas',
                        type: "selectBox",
                        required: true,
                        enabled: false,
                        visible: false
                    },
                    {
                        styleContainer: 'width:100%;float:left;margin:0px;',
                        name: "nombre_tarjeta",
                        car_min: "3",
                        car_max: "100",
                        label: "Nombre títular tarjeta",
                        placeholder: nw.tr('Nombre títular tarjeta'),
                        visible_label: false,
                        type: "textField",
                        required: true
                    });
            if (config.paymentStore === "epayco") {
                fields.push({
                    styleContainer: 'width:100%;float:left;margin:0px;',
                    name: "apellido_tarjeta",
                    car_min: "3",
                    car_max: "100",
                    label: "Apellido",
                    visible_label: false,
                    placeholder: 'Apellido',
                    type: "textField",
                    required: false
                });
            }
            fields.push(
                    {
                        styleContainer: 'width:100%;float:left;margin:0px;',
                        name: "tipo_documento",
                        visible_label: false,
                        label: "Tipo Documento",
                        placeholder: 'Tipo Documento',
                        type: "selectBox",
                        required: true
                    },
                    {
                        styleContainer: 'width:100%;float:left;margin:0px;',
                        name: "documento",
                        visible_label: false,
                        label: "Documento",
                        placeholder: 'Documento',
                        type: "numeric",
                        required: true
                    },
                    {
                        styleContainer: 'width:100%;float:left;margin:0px;',
                        name: "email",
                        visible_label: false,
                        label: "Correo electrónico",
                        placeholder: 'Correo electrónico',
                        type: "textField",
                        mode: "email",
                        required: true
                    },
                    {
                        styleContainer: 'width:100%;float:left;margin:0px;',
                        name: "nombre_banco",
                        visible_label: false,
                        label: "Banco",
                        placeholder: 'Banco',
//                type: "selectBox",
                        type: "radio",
                        required: true
                    },
                    {
                        styleContainer: 'width:100%;float:left;margin:0px;',
                        name: "numero_tarjeta",
                        visible_label: false,
                        label: "Número de tarjeta",
                        placeholder: 'Número de tarjeta',
                        type: "numeric",
                        required: true
                    },
                    {
                        styleContainer: 'width:31%;float:left;margin:0px 5px 0px 0px;',
                        style: "font-size:12px;padding-top: 10px;padding-bottom: 10px;",
                        name: "mes_vencimiento",
                        label: "Mes",
                        placeholder: 'Mes de vto',
                        type: "selectBox",
                        required: true
                    },
                    {
                        styleContainer: 'width:31%;float:left;margin:0px 5px 0px 0px;',
                        style: "font-size:12px;padding-top: 10px;padding-bottom: 10px;",
                        name: "anio_vencimiento",
                        label: "Año",
                        placeholder: 'Año de vto',
                        type: "selectBox",
                        required: true
                    },
                    {
                        styleContainer: 'width:31%;float:left;margin:0px 5px 0px 0px;',
                        style: "font-size:12px;padding-top: 10px;padding-bottom: 10px;",
                        name: "codigo_seguridad",
                        label: "CCV",
                        visible_label: true,
                        placeholder: 'CCV',
                        type: "numeric",
                        required: true
                    },
                    {
                        styleContainer: 'width:100%;float:left;margin:0px 0;',
                        name: "pais",
                        label: "País",
                        placeholder: 'País',
                        type: "selectBox",
                        required: true
                    },
                    {
                        modeForm: "form",
                        type: "endGroup"
                    }
            );
        }
        self.setFields(fields);

        if (!self.stripe) {
            self.buttons = [
                {
                    style: "border: 0;background-color:#f18107;color:#ffffff;margin:0px;",
                    icon: "material-icons check_circle normal",
                    colorBtnBackIOS: "#ffffff",
//                position: "top",
                    name: "aceptar",
                    label: "Guardar",
                    callback: function () {
                        if (config.paymentStore === "Conekta") {
                            self.submitConekta();
                        } else {
                            self.save();
                        }
                    }
                }
            ];
        }

        self.show();

        if (self.stripe) {
            if (nw.evalueData(up.email)) {
                self.ui.email.setValue(up.email);
//            self.ui.email.disabled(false);
            }
            var name = "";
//        var last_name = "";
            if (nw.evalueData(up.nombre)) {
                name += up.nombre;
            }
            if (nw.evalueData(up.apellido)) {
//            last_name = up.apellido;
                name += " " + up.apellido;
            }
            if (nw.evalueData(name)) {
                self.ui.nombre_tarjeta.setValue(name);
//            self.ui.nombre_tarjeta.disabled(false);
            }
            if (nw.evalueData(up.nit)) {
                self.ui.documento.setValue(up.nit);
//            self.ui.documento.disabled(false);
            }
        }
        if (!self.stripe) {
            var data = {};
            data[""] = "Seleccione";
            self.ui.pais.populateSelectFromArray(data);
//        self.ui.mes_vencimiento.populateSelectFromArray(data);

            console.log("self.bandera.tipo_documentos", self.bandera.tipo_documentos);
            console.log("main.configCliente", main.configCliente);
            console.log("main.configCliente.tipo_documentos", main.configCliente.tipo_documentos);
//        if (self.bandera.tipo_documentos != 'undefined' && self.bandera.tipo_documentos != "" && self.bandera.tipo_documentos !="\n\n\n") {
            if (nw.utils.evalueData(main.configCliente.tipo_documentos)) {
                var data = JSON.parse(self.bandera.tipo_documentos);
            } else {
                var data = {};
                data[""] = "Tipo documento";
                data["CC"] = "Cédula de ciudadanía";
                data["PP"] = "Pasaporte";
            }

            self.ui.tipo_documento.populateSelectFromArray(data);
            self.ui.tipo_documento.setValue("");

            var data = {};
            data["VISA"] = "<div class='creditscards visa'></div>";
            data["MASTERCARD"] = "<div class='creditscards mastercard'></div>";
            data["AMEX"] = "<div class='creditscards amex'></div>";
            data["DINERS"] = "<div class='creditscards diners'></div>";
            self.ui.nombre_banco.populateSelectFromArray(data);

            var data = {};
            data["0"] = "-" + nw.str("Año") + "-";
            for (var i = 21; i < 34; i++) {
                data["20" + i] = i;
            }
            self.ui.anio_vencimiento.populateSelectFromArray(data);
            self.ui.anio_vencimiento.setValue("0");

            var data = {};
            for (var i = 1; i < 13; i++) {
                data[i] = i;
            }
            self.ui.cuotas.populateSelectFromArray(data);
            self.ui.cuotas.setValue("1");

            var data = {};
            data["0"] = "-" + nw.str("Mes") + "-";
            for (var i = 0; i < 12; i++) {
                var n = i + 1;
                n = n.toString();
                if (n.length === 1) {
                    n = "0" + n;
                }
                data[n] = n;
            }
            self.ui.mes_vencimiento.populateSelectFromArray(data);
            self.ui.mes_vencimiento.setValue("0");

            self.ui.pais.changeValue(function (e) {
                var d = e.value;
                console.log("d", d);
                console.log("self.ui.pais.getValue", self.ui.pais.getValue());
            });

            var data = {};
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            data.perfil = up.perfil;
            self.ui.pais.populateSelect('app_user', 'populatePaises', data, function (a) {
                if (nw.evalueData(up.pais)) {
                    self.ui.pais.setValue(up.pais);
                }
            }, true);

            var name = "";
//        var last_name = "";
            if (nw.evalueData(up.nombre)) {
                name += up.nombre;
            }
            if (nw.evalueData(up.apellido)) {
//            last_name = up.apellido;
                name += " " + up.apellido;
            }
            if (nw.evalueData(name)) {
//            self.ui.nombre_tarjeta.setValue(name);
//            self.ui.nombre_tarjeta.disabled(false);
            }
//        if (nw.evalueData(last_name)) {
//            self.ui.apellido_tarjeta.setValue(last_name);
//            self.ui.apellido_tarjeta.disabled(false);
//        }
            if (nw.evalueData(up.email)) {
//            self.ui.email.setValue(up.email);
//            self.ui.email.disabled(false);
            }
            if (nw.evalueData(up.nit)) {
//            self.ui.documento.setValue(up.nit);
//            self.ui.documento.disabled(false);
            }

            self.ui.nombre_banco.changeValue(function (e) {
                self.setValueBanco(e.value);
            });

            self.ui.numero_tarjeta.changeValue(function (e) {
                var d = e.value;
                var k = self.detectCardType(d);
                if (nw.evalueData(k)) {
                    self.ui.nombre_banco.setValue(k);
                    self.setValueBanco(k);
                } else {
                    self.setValueBanco(false);
                    self.ui.nombre_banco.setValue("");
                }
            });

            var valorMinimo = "5000";
            if (nw.utils.evalueData(main.configCliente.valor_minimo_activacion_tarjeta_credito)) {
                valorMinimo = main.configCliente.valor_minimo_activacion_tarjeta_credito;
            }
            self.ui.price.setValue(valorMinimo);

            self.testing = false;
//        self.testing = true;
            if (self.testing) {
//////FALSA
                self.ui.nombre_banco.setValue("VISA");
                self.ui.numero_tarjeta.setValue("4122761896646819");
                self.ui.mes_vencimiento.setValue("12");
                self.ui.anio_vencimiento.setValue("2025");
                self.ui.codigo_seguridad.setValue("123");
                self.ui.documento.setValue("1096957503");
                self.ui.tipo_documento.setValue("CC");
                self.setValueBanco("VISA");
            }


            self.conektaLoad = false;
            self.conektaToken = false;
            if (config.paymentStore === "Conekta") {
                var lo = nw.loading2();
                console.log("lo", lo);
                nw.require("https://cdn.conekta.io/js/latest/conekta.js", function () {
                    lo.remove();
                    //producción
                    var key = 'key_YqdyrbWJrh6aqoPGwvzPrxA';
                    if (config.paymentStorePruebas === true) {
                        //pruebas
                        key = 'key_Bks5AsVrZxP5ro3G79YaHzg';
                    }
                    Conekta.setPublicKey(key);
                    self.conektaSuccessResponseHandler = function (token) {
                        console.log("token", token);
                        console.log("token.id", token.id);
                        self.conektaToken = token.id;
                        self.saveConekta();
//                    var $form = $("#card-form");
//                    $form.append($('<input type="hidden" name="conektaTokenId" id="conektaTokenId">').val(token.id));
                    };
                    self.conektaErrorResponseHandler = function (response) {
                        console.log("ERROR:::", response);
                        nw.dialog(response.message_to_purchaser);
//                    var $form = $("#card-form");
//                    $form.find(".card-errors").text(response.message_to_purchaser);
//                    $form.find("button").prop("disabled", false);
                    };


                    $(function () {
                        $("#card-form").submit(function (event) {
                            var $form = $(this);
//                        $form.find("button").prop("disabled", true);
                            Conekta.Token.create($form, self.conektaSuccessResponseHandler, self.conektaErrorResponseHandler);
                            return false;
                        });
                    });

//                self.ui.apellido_tarjeta.setVisibility(false);
                    self.ui.tipo_documento.setVisibility(false);
                    self.ui.pais.setVisibility(false);

                    document.querySelector(".nombre_tarjeta").setAttribute("data-conekta", "card[name]");
                    document.querySelector(".numero_tarjeta").setAttribute("data-conekta", "card[number]");
                    document.querySelector(".codigo_seguridad").setAttribute("data-conekta", "card[cvc]");
                    document.querySelector(".mes_vencimiento").setAttribute("data-conekta", "card[exp_month]");
                    document.querySelector(".anio_vencimiento").setAttribute("data-conekta", "card[exp_year]");

                    self.conektaLoad = true;
                }, true);
            }
        }


    },
    destruct: function () {
    },
    members: {
        submitConekta: function submitConekta() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            if (!self.conektaLoad) {
                nw.dialog("Un momento, la API no ha cargado");
                return false;
            }
            $("#card-form").submit();
        },
        saveConekta: function saveConekta() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            if (!self.conektaLoad) {
                nw.dialog("Un momento, la API no ha cargado");
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord();
            var d = self.getRecord();
//            var d = {};
            d.token_id = self.conektaToken;
            d.payment_method_type = "card";
            d.more_info = "";
            d.reference = "123456789";
            d.ruta = "/app/pagos/";
            d.name = data.nombre_tarjeta;
            d.email = data.email;
            d.usuario = up.usuario;
            d.perfil = up.perfil;
            d.empresa = up.empresa;
            d.terminal = up.terminal;
            d.phone = up.celular;
            d.itemName = "Inscripción tarjeta";
            d.itemDescription = "Inscripción tarjeta";
            d.item_unit_price = 300;
            d.itemQuantity = 1;
            d.street1 = "Calle 123, int 2";
            d.postal_code = "06100";
            d.country = "MX";
            console.log("data", data);
            console.log("d", d);
            var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log("saveConekta:::saveConekta:::r", r);
                if (r === true) {
                    nw.dialog("Creada correctamente");
                    if (nw.evalueData(self.callback)) {
                        nw.back();
                        self.callback(data);
                    }
                    return true;
                } else {
                    nw.dialog(r);
                }
            };
            rpc.exec("validaCardConektaByApi", d, func);
        },
        save: function save() {
            var self = this;

            if (!self.validate()) {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord();
            console.log("data", data);
            if (!self.stripe) {
                if (!nw.evalueData(data.nombre_banco)) {
                    nw.dialog("Debe seleccionar un banco");
                    return false;
                }
//            data.pais = data.pais_model_selected.alias;
//            data.currency = data.pais_model_selected.moneda;
                var pais = self.ui.pais.getValue();
                console.log("pais", pais);
                data.pais = pais.data_array.alias;
                data.currency = pais.data_array.moneda;
                data.fecha_vencimiento = data.anio_vencimiento + "/" + data.mes_vencimiento;
            }
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.usuario_text = up.nombre;
            data.id_usuario = up.id_usuario;
            data.type = config.paymentStore;
            if (typeof config.apiKeyEpayco !== 'undefined' && config.apiKeyEpayco != "") {
                data.apiKeyEpayco = config.apiKeyEpayco;
            }
            if (typeof config.privateKeyEpayco !== 'undefined' && config.privateKeyEpayco != "") {
                data.privateKeyEpayco = config.privateKeyEpayco;
            }
            data.test = "NO";
            console.log("main.configCliente.pagosPruebas", main.configCliente.pagosPruebas);
            if (nw.utils.evalueData(main.configCliente.pagosPruebas)) {
                data.test = main.configCliente.pagosPruebas;
            }
            var met = "nwMaker";
            var fu = "apiNwPayTesting";
            if (config.paymentStore === "Stripe") {
//                data.test = "SI";
                met = "stripeApi";
                fu = "saveApiStripe";
            }
            if (typeof self.responseStripe != "undefined") {
                data.stripe = self.responseStripe;
            }
            data.pago_unico_mensual = "UNICO";
            data.description = "Suscripción de tarjeta en " + config.name;
            console.log("send:::", data);
            console.log("met:::", met);
            console.log("fu:::", fu);
            var rpc = new nw.rpc(nw.getRpcUrl(), met);
            rpc.setAsync(true);
            rpc.setLoading(true);
            var func = function (r) {
                console.log("tarjeta_credito:::responseServer", r);
                if (typeof self.responseStripe != "undefined") {
                    if (typeof r == "string") {
                        nw.utils.information(r);
                    }
                    if (typeof r == "object") {
                        nw.utils.information(r.status);
                        if (r.status == "succeeded") {
                            nw.dialog("Creada correctamente");
                            if (nw.evalueData(self.callback)) {
                                nw.back();
                                self.callback(data);
                            }
                            return true;
                        }
                    }
                    return r;
                }
                if (config.paymentStore === "Stripe") {
                    if (r.status) {
                        nw.dialog("Creada correctamente");
                        if (nw.evalueData(self.callback)) {
                            nw.back();
                            self.callback(data);
                        }
                        return true;
                    } else {
                        var html = "";
                        html += "Rechazada";
                        nw.dialog(html);
                        return;
                    }
                }
                if (config.paymentStore === "epayco") {
//                    if (r.status === "Rechazada") {
                    if (r.estado !== "Aceptada") {
                        var html = "";
                        html += r.estado + ". " + r.respuesta + ". Referencia de seguimiento #" + r.ref_payco;
                        nw.dialog(html);
                        return;
                    } else
                    if (r.status === "OK") {
                        var html = "";
                        html += "¡Creada correctamente! " + r.estado + ". " + r.respuesta + ". Referencia de seguimiento #" + r.ref_payco;
                        nw.dialog(html);
                        if (nw.evalueData(self.callback)) {
                            nw.back();
                            self.callback(data);
                        }
                        return true;
                    } else {
                        var html = "";
                        html += r.estado + ". " + r.respuesta + ". Referencia de seguimiento #" + r.ref_payco;
                        return false;
                    }
                }

                if (config.paymentStore === "payu") {
                    var rta = nw.validateNwPayments(r.result);
                    console.log(rta);
                    if (!rta.approved) {
                        var h = "";
                        h += rta.status_description + ". <br />";
                        h += rta.responseCode + " <br />";
                        if (nw.evalueData(rta.responseMessage)) {
                            h += rta.responseMessage + ". <br />";
                        }
                        h += rta.status + ". <br />";
                        nw.dialog(h);
                        return false;
                    }
//                        if (rta.modo_pruebas === true) {
                    var h = "";
                    h += rta.status_description + ". <br />";
                    h += rta.responseCode + ". <br />";
                    h += rta.responseMessage + ". <br />";
                    var accept = function () {
                        if (nw.evalueData(self.callback)) {
                            nw.back();
                            self.callback(data);
                        }
                    }
                    nw.dialog(h, accept);
//                            return false;
//                        }
//                    if (rta.approved === true || rta.status == "APPROVED") {
                    if (nw.evalueData(self.callback)) {
                        nw.back();
                        self.callback(data);
                    }
//                    }
                }
            };
            rpc.exec(fu, data, func);
        },
        setValueBanco: function setValueBanco(d) {
            var self = this;
            self.ui.numero_tarjeta.removeClass("selected_tarjet_input_VISA");
            self.ui.numero_tarjeta.removeClass("selected_tarjet_input_MASTERCARD");
            self.ui.numero_tarjeta.removeClass("selected_tarjet_input_AMEX");
            self.ui.numero_tarjeta.removeClass("selected_tarjet_input_DINERS");
            if (nw.evalueData(d)) {
                self.ui.numero_tarjeta.addClass("selected_tarjet_input_" + d);
            }
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        },
        detectCardType: function (number) {
            var re = {
                VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
                MASTERCARD: /^5[1-5][0-9]{14}$/,
                AMEX: /^3[47][0-9]{13}$/,
                DINERS: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
                electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
                maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
                dankort: /^(5019)\d+$/,
                interpayment: /^(636)\d+$/,
                unionpay: /^(62|88)\d+$/,
                discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
                jcb: /^(?:2131|1800|35\d{3})\d{11}$/
            };
            for (var key in re) {
                if (re[key].test(number)) {
                    return key;
                }
            }
            return false;
        }
    }
});