qx.Class.define("qxnw.examples.form_payu", {
    extend: qxnw.forms,
    ///TEST
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setColumnsFormNumber(2);
        var fields = [
            {
                name: "Configuración general",
                label: "Start",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "referencia",
                label: self.tr("Referencia"),
                type: "textField",
                required: true
            },
            {
                name: "descripcion",
                label: self.tr("Descripción"),
                type: "textField",
                required: true
            },
            {
                name: "valor",
                label: self.tr("Valor"),
                type: "textField",
                required: true
            },
            {
                name: "apiKey",
                label: self.tr("Api Key"),
                type: "textField",
                required: true
            },
            {
                name: "apiLogin",
                label: self.tr("Api Login"),
                type: "textField",
                required: true
            },
            {
                name: "merchantId",
                label: self.tr("Merchant Id"),
                type: "textField",
                required: true
            },
            {
                name: "isTest",
                label: self.tr("En modo pruebas"),
                type: "checkBox",
                required: true
            },
            {
                name: "PaymentsCustomUrl",
                label: self.tr("URL de Pagos"),
                type: "textField"
            },
            {
                name: "ReportsCustomUrl",
                label: self.tr("URL de Reportes"),
                type: "textField"
            },
            {
                name: "SubscriptionsCustomUrl",
                label: self.tr("URL de Suscripciones"),
                type: "textField"
            },
            {
                name: "cuenta_payu",
                label: self.tr("Cuenta PaYU"),
                type: "textField",
                required: true
            },
            {
                type: "endGroup"
            },
            {
                name: "Datos cliente",
                label: "Start",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "nombre_completo",
                label: self.tr("Nombre y apellido"),
                type: "textField"
            },
            {
                name: "correo",
                label: self.tr("Correo"),
                type: "textField"
            },
            {
                name: "telefono",
                label: self.tr("Teléfono"),
                type: "textField"
            },
            {
                name: "identificacion",
                label: self.tr("Identificación"),
                type: "textField"
            },
            {
                name: "direccion_principal",
                label: self.tr("Dirección principal"),
                type: "textField"
            },
            {
                name: "direccion_secundaria",
                label: self.tr("Dirección secundaria"),
                type: "textField"
            },
            {
                name: "ciudad",
                label: self.tr("Ciudad"),
                type: "textField"
            },
            {
                name: "departamento",
                label: self.tr("Departamento"),
                type: "textField"
            },
            {
                name: "pais",
                label: self.tr("Pais"),
                type: "selectBox"
            },
            {
                name: "telefono_fijo",
                label: self.tr("Teléfono fijo"),
                type: "textField"
            },
            {
                name: "codigo_postal",
                label: self.tr("Código postal"),
                type: "textField"
            },
            {
                type: "endGroup"
            },
            {
                name: "Datos pagador",
                label: "Start",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "pagador_nombre_completo",
                label: self.tr("Nombre y apellido"),
                type: "textField",
                required: true
            },
            {
                name: "pagador_correo",
                label: self.tr("Correo"),
                type: "textField"
            },
            {
                name: "pagador_telefono",
                label: self.tr("Teléfono"),
                type: "textField"
            },
            {
                name: "pagador_identificacion",
                label: self.tr("Identificación"),
                type: "textField"
            },
            {
                name: "pagador_direccion_principal",
                label: self.tr("Dirección principal"),
                type: "textField"
            },
            {
                name: "pagador_direccion_secundaria",
                label: self.tr("Dirección secundaria"),
                type: "textField"
            },
            {
                name: "pagador_ciudad",
                label: self.tr("Ciudad"),
                type: "textField"
            },
            {
                name: "pagador_departamento",
                label: self.tr("Departamento"),
                type: "textField"
            },
            {
                name: "pagador_pais",
                label: self.tr("Pais"),
                type: "selectBox"
            },
            {
                name: "pagador_codigo_postal",
                label: self.tr("Código postal"),
                type: "textField"
            },
            {
                name: "pagador_telefono_fijo",
                label: self.tr("Teléfono fijo"),
                type: "textField"
            },
            {
                type: "endGroup"
            },
            {
                name: "Datos tarjeta",
                label: "Start",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "numero_tarjeta",
                label: self.tr("Número tarjeta"),
                type: "textField",
                required: true
            },
            {
                name: "fecha_vencimiento",
                label: self.tr("Fecha vencimiento"),
                type: "textField",
                required: true
            },
            {
                name: "codigo_seguridad",
                label: self.tr("Código seguridad"),
                type: "textField",
                required: true
            },
            {
                name: "nombre_banco",
                label: self.tr("Banco"),
                type: "selectBox",
                required: true
            },
            {
                name: "cuotas",
                label: self.tr("Cuotas"),
                type: "textField",
                required: true
            },
            {
                type: "endGroup"
            }
        ];
        self.setFields(fields);

        var data = {};
        data['CO'] = 'CO';
        qxnw.utils.populateSelectFromArray(self.ui.pais, data);
        qxnw.utils.populateSelectFromArray(self.ui.pagador_pais, data);

        var data = {};
        data['VISA'] = 'VISA';
        data['MASTERCARD'] = 'MASTERCARD';
        data['AMEX'] = 'AMEX';
        data['DINERS'] = 'DINERS';
        data['BALOTO'] = 'BALOTO';
        qxnw.utils.populateSelectFromArray(self.ui.nombre_banco, data);

        self.ui.referencia.setValue("xcdf");
        self.ui.descripcion.setValue("Desc");
        self.ui.valor.setValue("10000");

        self.ui.apiKey.setValue("4Vj8eK4rloUd272L48hsrarnUA");
        self.ui.apiLogin.setValue("pRRXKOl8ikMmt9u");
        self.ui.merchantId.setValue("508029");
        self.ui.isTest.setValue(true);
        self.ui.PaymentsCustomUrl.setValue("https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi");
        self.ui.ReportsCustomUrl.setValue("https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi");
        self.ui.SubscriptionsCustomUrl.setValue("https://sandbox.api.payulatam.com/payments-api/rest/v4.3/");

//        self.ui.PaymentsCustomUrl.setValue("https://api.payulatam.com/payments-api/4.0/service.cgi");
//        self.ui.ReportsCustomUrl.setValue("https://api.payulatam.com/reports-api/4.0/service.cgi");
        //self.ui.SubscriptionsCustomUrl.setValue("https://api.payulatam.com/payments-api/rest/v4.3/");

//        self.ui.nombre_completo.setValue("César Andrés Flórez E");
//        self.ui.correo.setValue("assdres@gmail.com");
//        self.ui.telefono.setValue("3144304998");
//        self.ui.identificacion.setValue("80821912");
//        self.ui.direccion_principal.setValue("Tv 02 # 68 - 04");
//        self.ui.direccion_secundaria.setValue("");
//        self.ui.ciudad.setValue("Bogota");
//        self.ui.departamento.setValue("Cundinamarca");
//        self.ui.pais.setValue("CO");
//        self.ui.codigo_postal.setValue("11001000");
//        self.ui.telefono_fijo.setValue("");

        self.ui.pagador_nombre_completo.setValue("CESAR ANDRES FLOREZ");
//        self.ui.pagador_correo.setValue("assdres@gmail.com");
//        self.ui.pagador_telefono.setValue("3144304998");
//        self.ui.pagador_identificacion.setValue("80821912");
//        self.ui.pagador_direccion_principal.setValue("Tv 02 # 68 - 04");
//        self.ui.pagador_direccion_secundaria.setValue("");
//        self.ui.pagador_ciudad.setValue("Bogota");
//        self.ui.pagador_departamento.setValue("Cundinamarca");
//        self.ui.pagador_pais.setValue("CO");
//        self.ui.pagador_codigo_postal.setValue("11001000");
//        self.ui.pagador_telefono_fijo.setValue("");

        self.ui.numero_tarjeta.setValue("4673417737644306");
        self.ui.fecha_vencimiento.setValue("2022/02");
        self.ui.codigo_seguridad.setValue("988");
        self.ui.nombre_banco.setValue("VISA");
        self.ui.cuotas.setValue("1");

        self.ui.cuenta_payu.setValue("512321");

        var ta = new qxnw.widgets.textArea();
        self.ui.nuevo_textarea = ta;
        self.insertWidget(ta, self.tr("Respuesta"));

        self.ui.accept.addListener("click", function () {
            self.verificar(false);
        });

//        var buttons = [
//            {
//                label: self.tr("Validar tarjeta"),
//                name: "validar_tarjeta"
//            }
//        ];
//        self.addButtons(buttons);
//
//        self.ui.validar_tarjeta.addListener("click", function () {
//            self.verificar(true);
//        });
    },
    members: {
        verificar: function verificar(solo_validar) {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var d = self.getRecord();
            if (solo_validar == true) {
                d.solo_validar = true;
            }
            console.log(d);
            if (d.nombre_banco == "BALOTO") {
                if (d.pagador_identificacion == "") {
                    qxnw.utils.information(self.tr("La identificación es requerida"), function () {
                        self.ui.pagador_identificacion.setFocus();
                    });
                    return;
                }
            }
            qxnw.utils.fastAsyncCallRpc("NWPayments", "test", d, function (rta) {
                self.ui.nuevo_textarea.setValue(JSON.stringify(rta));
            });
        }
    }
});