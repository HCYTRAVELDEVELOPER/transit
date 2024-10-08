nw.Class.define("f_recargas", {
    extend: nw.forms,
    construct: function (callback) {
        var self = this;
        var up = nw.userPolicies.getUserData();
        self.id = "f_recargas";
        self.setTitle = "<span style='color:#fff;'>Recargas</span>";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Volver";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
//        self.transition = "slideup";
        self.createBase();
        self.callback = callback;
        self.configCliente = main.configCliente;
        var aplydec = "";
//        if (nw.evalueData(config.paymentStore) && config.paymentStore == "Conekta") {
//            aplydec = ".00";
//        }

        self.consultaPlanes(function (planes) {
            self.consultaSaldo(function (p) {
                var saldo = 0;
                if (nw.evalueData(p.saldo)) {
                    saldo = p.saldo;
                }

                var saldoTime = "";
                if (nw.evalueData(config.usaFechaVencimientoSaldo)) {
                    if (config.usaFechaVencimientoSaldo === true) {
                        saldoTime = "<br />Saldo recargado en tiempo: <span class='saldo_tit_tot'>$" + p.saldo_por_tiempo + "</span>";
                        saldoTime += "<br />Fecha vencimiento: <span class='saldo_tit_tot'>" + p.fecha_vencimiento_saldo + "</span>";
                        saldoTime += "<br />Fecha Última recarga: <span class='saldo_tit_tot'>" + p.fecha_ultima_recarga + "</span>";
                    }
                }
                var fields = [
                    {
                        label: "",
                        style: '',
                        name: "contenedor_recargas",
                        mode: "div",
                        type: "startGroup"
                    },
                    {
                        name: "my_link_img",
                        label: "<span class='imgRecargas' style='background-image: url(" + config.domain_rpc + "/lib_mobile/driver/img/recargas.png); background-size: 144px;background-position: center;'></span>",
                        type: "html"
                    },
                    {
                        name: "my_link_description",
                        label: "<span class='titleRecargas'>Recarga saldo</span><span class='descpRecargas'>Te quedaste sin saldo recarga y sigue disfrutando de nuestros servicios.</span>",
                        type: "html"
                    },
                    {
                        label: "",
                        style: '',
                        name: "contenedor_service_recargas",
                        mode: "div",
                        type: "startGroup"
                    },
                    {
                        name: "my_link_description_saldo",
                        label: "<div class='titleSaldo'>Tu saldo es <span class='saldo_tit_tot'> $" + nw.addNumber(saldo) + aplydec + "</span>" + saldoTime + "</div>",
                        type: "html"
                    },
                    {
                        name: "my_link_saldo",
                        label: "<span class='iconRecargas'><i class='material-icons'>attach_money</i></span><span class='contSaldo'>Recargar Saldo</span>",
                        type: "html"
                    },
                    {
                        label: "",
                        style: '',
                        name: "contenedor_recargas_actions",
                        mode: "div",
                        type: "startGroup",
//                visible: false
                    },
                    {
                        name: "valor_recarga",
                        label: "",
                        placeholder: 'Ingresa el valor',
                        type: "integer",
//                        required: true,
                        visible: true
                    },
                    {
                        label: "",
                        style: '',
                        name: "contenedor_recargas_buttons_actions",
                        mode: "div",
                        type: "startGroup"
                    },
                    {
                        name: "recargar",
                        label: "Pagar con " + config.paymentStore,
                        type: "button"
                    },
                    {
                        mode: "div",
                        type: "endGroup"
                    },
                    {
                        mode: "div",
                        type: "endGroup"
                    }
                ];
                for (var i = 0; i < planes.length; i++) {
                    console.log(planes[i]);
                    var f = {
                        name: "my_link_planes",
                        label: "<span class='iconContPlanes'><i class='material-icons'>library_add</i></span><span class='contPlanes' data='" + planes[i]["valor_recarga"] + "' data_id='" + planes[i]["id"] + "' data_recarga='" + planes[i]["total_recarga"] + "' data_tiempo='" + (typeof planes[i]["tiempo_vencimiento"] === 'undefined' || typeof planes[i]["tiempo_vencimiento"] !== 'undefined' && planes[i]["tiempo_vencimiento"] == null ? 0 : planes[i]["tiempo_vencimiento"]) + "'>" + planes[i]["nombre"] + "</span>",
                        type: "html"
                    }
                    fields.push(f);
                }
                var fields2 = [
                    {
                        mode: "div",
                        type: "endGroup"
                    },
                    {
                        mode: "div",
                        type: "endGroup"
                    }
                ];
                for (var e = 0; e < fields2.length; e++) {
                    fields.push(fields2[e]);
                }
                self.setFields(fields);
                self.show();
                if (nw.evalueData(self.configCliente.usar_recarga_libre_driver)) {
                    if (self.configCliente.usar_recarga_libre_driver == "NO") {
                        self.ui.my_link_saldo.setVisibility(false);
                        self.ui.valor_recarga.setVisibility(false);
                        $("#f_recargas .nw_widget_div_my_link_planes").css("cssText", "margin-top: 51px;");
                    }
                }
                $("#f_recargas .nw_label_valor_recarga").css("cssText", "display:none!important;");
//                self.ui.valor_recarga.setValue("10000");
                self.ui.recargar.addListener("click", function () {
                    var recarga = self.ui.valor_recarga.getValue();
//                    recarga = nw.utils.replace('.', '', recarga);
                    if (!nw.evalueData(recarga)) {
                        recarga = "0";
                    }
                    var valor = 300;
                    var valor_maximo = 10000;
                    console.log(self.configCliente);
                    if (nw.evalueData(self.configCliente.valor_minimo_recarga)) {
                        valor = self.configCliente.valor_minimo_recarga;
                    }
                    if (parseFloat(recarga) < parseFloat(valor)) {
                        nw.dialog("El valor debe ser superior a $" + valor);
                        self.ui.valor_recarga.setValue("");
                        return;
                    }
                    if (parseFloat(recarga) > parseFloat(valor_maximo)) {
                        nw.dialog("El valor maximo de recarga es de $" + valor_maximo);
                        self.ui.valor_recarga.setValue("");
                        return;
                    }
                    if (nw.evalueData(config.paymentStore) && config.paymentStore == "Conekta") {
                        var valor_formato = self.ui.valor_recarga.getValue();
                        recarga = recarga + "00";
                    }
                    var up = nw.userPolicies.getUserData();
                    var data = {};
                    data.valor_plan = recarga;
                    data.id_plan = 0;
                    data.total_recarga = recarga;
                    data.usuario = up.usuario;
                    data.empresa = up.empresa;
                    data.nombre = up.nombre + " " + up.apellido;
                    data.perfil = up.perfil;
                    data.tipo = "recarga";
                    data.name_empresa = config.name;
                    if (nw.evalueData(config.paymentStore) && config.paymentStore == "Conekta") {
                        data.valor_formato = valor_formato;
                    }
                    self.pago(data);
                });
//            var document.querySelector();
                $(".nw_widget_div_my_link_planes").bind("click", function () {
                    var up = nw.userPolicies.getUserData();
                    var data = {};
                    data.valor_plan = this.querySelector('.contPlanes').getAttribute("data");
                    if (!nw.evalueData(data.valor_plan)) {
                        data.valor_plan = "0";
                    }
                    var valor = 300;
                    var valor_maximo = 1000000;
                    console.log(self.configCliente);
                    if (nw.evalueData(self.configCliente.valor_minimo_recarga)) {
                        valor = self.configCliente.valor_minimo_recarga;
                    }
                    if (parseFloat(data.valor_plan) < parseFloat(valor)) {
                        nw.dialog("El valor debe ser superior a $" + valor);
                        self.ui.valor_recarga.setValue("");
                        return;
                    }
                    if (parseFloat(data.valor_plan) > parseFloat(valor_maximo)) {
                        nw.dialog("El valor maximo de recarga es de $" + valor_maximo);
                        self.ui.valor_recarga.setValue("");
                        return;
                    }
                    if (nw.evalueData(config.paymentStore) && config.paymentStore == "Conekta") {
                        data.valor_plan = data.valor_plan.slice(0, -2);
                    }
                    console.log(data.valor_plan);
//                    return;
                    data.id_plan = this.querySelector('.contPlanes').getAttribute("data_id");
                    data.total_recarga = this.querySelector('.contPlanes').getAttribute("data_recarga");
                    data.total_tiempo = this.querySelector('.contPlanes').getAttribute("data_tiempo");
                    data.usuario = up.usuario;
                    data.empresa = up.empresa;
                    data.nombre = up.nombre + " " + up.apellido;
                    data.perfil = up.perfil;
                    data.name_empresa = config.name;
                    data.tipo = "plan";
                    self.pago(data);
                });
            });
        });
    },
    destruct: function () {
    },
    members: {
        consultaSaldo: function consultaSaldo(callBack) {
            var up = nw.userPolicies.getUserData();
            var dat = {};
            dat.id = up.id_usuario;
            if (nw.evalueData(config.usaFechaVencimientoSaldo)) {
                if (config.usaFechaVencimientoSaldo === true) {
                    dat.fecha_vencimiento_saldo = "SI";
                }
            }
            var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
            rpc.setAsync(true);
            rpc.setLoading(false);
            nw.loading({text: "Por favor espere...", title: "Verificando saldos y vencimientos..."});
            var func = function (r) {
                console.log(r);
                nw.loadingRemove();
                callBack(r);
            };
            rpc.exec("consultaSaldoUserApp", dat, func);
        },
        pago: function pago(datos) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            console.log("up", up);
            console.log("datos", datos);
            console.log("config.paymentStore", config.paymentStore);
            if (config.paymentStore == "Wompi") {
                var price = parseFloat(Math.trunc(datos.total_recarga.toString()) + "00");
                console.log("price", price);

                var pay = {};
                pay.reference = datos.usuario + "-" + Math.random();
                pay.price = price;
                pay.email = up.email;
                pay.fullName = up.nombre + " " + up.apellido;
                pay.phoneNumber = up.celular;
                pay.phoneNumberPrefix = "+" + config.indicativo;
                var d = new nw.payWompi();
                d.start(pay);
                return;
            }
            if (nw.evalueData(config.paymentStore) && config.paymentStore == "Conekta") {
                var t = nw.createNotificacionBarInter({
                    addClass: "notifyRedirect",
                    timeToRemove: 2000,
                    title: "Cargando...",
                    body: "En segundos serás redireccionado a la pasarela de pagos.",
                    icon: false,
//                    data: r,
                    callbackEndTime: function () {
                    }
                });
                setTimeout(function () {
                    var d = {};
                    d.ruta = "/app/pagos/";
                    d.name = datos.nombre;
                    d.email = datos.usuario;
                    d.itemName = "Recarga saldo " + datos.name_empresa;
                    d.itemDescription = "Recarga saldo " + datos.name_empresa;
                    d.item_unit_price = datos.total_recarga;
                    d.itemQuantity = 1;
                    d.street1 = "Calle 123, int 2";
                    d.postal_code = "06100";
                    d.country = "MX";
                    d.callBackEnd = function (e) {
//                        console.log(e);
//                        var data = {};
//                        data.id = r;
//                        data.checkoutRequestId = e.checkoutRequestId;
//                        console.log(data);
//                        var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
//                        rpc.setAsync(true);
//                        var func = function (r) {
//                            console.log("actualizado");
//                        };
//                        rpc.exec("cambiacheckout", data, func);
                    };
                    d.callBackClose = function (e) {
//                        console.log(e);
//                        nw.dialog("Finalizar", function () {
                        nw.refreshSessionApp(function () {
                            main.reloadApp();
                        });
//                        });
                        return true;
                    };
                    var data_extra = {total_recarga: datos.valor_plan, tipo: datos.tipo, descripcion: "Recarga saldo " + datos.name_empresa, total_tiempo: datos.total_tiempo}
                    if (nw.evalueData(datos.valor_formato)) {
                        data_extra.valor_formato = datos.valor_formato;
                    }
                    d.extra = JSON.stringify(data_extra);
                    nw.payConekta.start(d);
                }, 1000);
                return;
            }

            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            var func = function (r) {
                var t = nw.createNotificacionBarInter({
                    addClass: "notifyRedirect",
                    timeToRemove: 15000,
                    title: "Cargando...",
                    body: "En segundos serás redireccionado a la pasarela de pagos.",
                    icon: false,
                    data: r,
                    callbackEndTime: function () {
                        nw.dialog("Finalizar", function () {
                            function accept() {
                                main.reloadApp();
                            }
                            nw.activateBackgroundMode();
                            nw.refreshSessionApp(accept);
                        });
                    }
                });
//                var keyEpayco = "ca651922534b50a5fadce54750cb4648";
                var keyEpayco = "f3566b13f1e134574b53e67121b5a588";
                if (typeof config.apiKeyEpayco !== 'undefined' && config.apiKeyEpayco !== '') {
                    keyEpayco = config.apiKeyEpayco;
                }

                setTimeout(function () {

//                    nw.inactivateBackgroundMode();
                    nw.loadJs("https://checkout.epayco.co/checkout.js", function () {
                        var handler = ePayco.checkout.configure({
                            /*
                             Netcar
                             */
                            key: keyEpayco,
                            /*
                             gruponw
                             */
//                            key: 'f3566b13f1e134574b53e67121b5a588',
                            /*
                             RDA
                             key: '15223a4c7a146373231bd5f1f5857e61',
                             */
                            test: false
                        });

                        var data = {
                            /*
                             Parametros compra (obligatorio)
                             */
                            name: "Recarga saldo " + datos.name_empresa,
                            description: "Recarga saldo " + datos.name_empresa,
                            invoice: r,
                            currency: "cop",
                            amount: datos.valor_plan,
                            tax_base: "0",
                            tax: "0",
                            country: "CO",
                            lang: "es",
                            /*
                             Onpage="false" - Standard="true"
                             */
                            external: "false",
                            /*
                             Atributos opcionales
                             */
                            extra1: datos.usuario,
                            extra2: datos.empresa,
                            extra3: datos.perfil,
                            extra4: datos.total_recarga,
                            extra5: datos.tipo,
                            confirmation: config.domain_rpc + "/app/confirmacionPayco.php?type=false",
                            response: config.domain_rpc + "/app/confirmacionPayco.php?type=true",
                            /*
                             Atributos cliente
                             */
                            name_billing: "",
                            address_billing: "",
                            type_doc_billing: "",
                            mobilephone_billing: "",
                            number_doc_billing: ""

                                    //atributo deshabilitación metodo de pago
//                    methodsDisable: ["TDC", "PSE", "SP", "CASH", "DP"]
                        };
                        handler.open(data);
                    });
//                    }
                }, 1000);
            };
            rpc.exec("saveRecarga", datos, func);

        },
        consultaPlanes: function consultaPlanes(callback) {
            var self = this;
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setLoading(false);
            nw.loading({text: "Por favor espere...", title: "Consultando planes..."});
            var func = function (r) {
                console.log(r);
                nw.loadingRemove();
                callback(r);
            };
            rpc.exec("consultaSaldo", data, func);
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});