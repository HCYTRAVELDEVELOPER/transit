nw.Class.define("f_tarjetas_credito", {
    extend: nw.forms,
    construct: function (callback) {
        var self = this;
        self.id = "f_tarjetas_credito";
        self.setTitle = "<span style='color:#fff;'>Pagos</span>";
        self.html = "";
        self.showBack = true;
        self.closeBack = false;
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
        self.createBase();
        self.callback = callback;
        var up = nw.userPolicies.getUserData();

        var fields = [
            {
                styleContainer: 'width:100%;float:left;margin:0px;',
                name: "nombre_tarjeta",
                label: "Nombre como se ve en la tarjeta",
                visible_label: false,
                placeholder: 'Nombre como se ve en la tarjeta',
                type: "textField",
                required: true
            },
            {
                styleContainer: 'width:100%;float:left;margin:0px;',
                name: "documento",
                visible_label: false,
                label: "Documento",
                placeholder: 'Documento',
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
                required: true
            },
            {
                styleContainer: 'width:100%;float:left;margin:0px;',
                name: "nombre_banco",
                visible_label: false,
                label: "Banco",
                placeholder: 'Banco',
                type: "selectBox",
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
                label: "Mes de vto",
                placeholder: 'Mes de vto',
                type: "selectBox",
                required: true
            },
            {
                styleContainer: 'width:31%;float:left;margin:0px 5px 0px 0px;',
                style: "font-size:12px;padding-top: 10px;padding-bottom: 10px;",
                name: "anio_vencimiento",
                label: "Año de vto",
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
            }
        ];
        self.setFields(fields);

        self.buttons = [
            {
                style: "border: 0;background-color:#f18107;color:#ffffff;margin:0px;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "#ffffff",
//                position: "top",
                name: "aceptar",
                label: "Guardar",
                callback: function () {
                    self.save();
                }
            }
        ];

        self.show();

        var data = {};
        data["VISA"] = "VISA";
        data["MASTERCARD"] = "MASTERCARD";
        data["AMEX"] = "AMEX";
        data["DINERS"] = "DINERS";
        self.ui.nombre_banco.populateSelectFromArray(data);

        var data = {};
        data["0"] = "-" + nw.str("Año") + "-";
        for (var i = 18; i < 34; i++) {
            data["20" + i] = i;
        }
        self.ui.anio_vencimiento.populateSelectFromArray(data);

        var data = {};
        data["0"] = "-" + nw.str("Mes") + "-";
        for (var i = 0; i < 12; i++) {
            var n = i + 1;
            n = n.toString();
            console.log(n);
            if (n.length === 1) {
                n = "0" + n;
            }
            data[n] = n;
        }
        self.ui.mes_vencimiento.populateSelectFromArray(data);

        var data = {};
        data[""] = "Seleccione";
        self.ui.pais.populateSelectFromArray(data);

        var data = {};
        data.empresa = up.empresa;
        data.usuario = up.usuario;
        data.perfil = up.perfil;
        self.ui.pais.populateSelect('app_user', 'populatePaises', data, function (a) {
            if (nw.evalueData(up.pais)) {
                self.ui.pais.setValue(up.pais);
            }
        }, true);

        console.log(up);
        var name = "";
        if (nw.evalueData(up.nombre)) {
            name += up.nombre;
        }
        if (nw.evalueData(up.apellido)) {
            name += " " + up.apellido;
        }
        if (nw.evalueData(name)) {
            self.ui.nombre_tarjeta.setValue(name);
        }
        if (nw.evalueData(up.email)) {
            self.ui.email.setValue(up.email);
        }
        if (nw.evalueData(up.nit)) {
            self.ui.documento.setValue(up.nit);
        }

        self.ui.nombre_banco.setValue("VISA");
        self.ui.numero_tarjeta.setValue("4260823545422596");
        self.ui.mes_vencimiento.setValue("06");
        self.ui.anio_vencimiento.setValue("2019");
        self.ui.codigo_seguridad.setValue("621");

    },
    destruct: function () {
    },
    members: {
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord(true);
            data.pais = data.pais_text;
            data.pais = "CO";
            data.price = 11000;
            data.solo_validar = false;
            data.pruebas = true;
            data.fecha_vencimiento = data.anio_vencimiento + "/" + data.mes_vencimiento;
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.usuario_text = up.nombre;
            data.id_usuario = up.id_usuario;
            data.type = "epayco";
            if (typeof config.apiKeyEpayco !== 'undefined' && config.apiKeyEpayco != "") {
                data.apiKeyEpayco = config.apiKeyEpayco;
            }
            if (typeof config.privateKeyEpayco !== 'undefined' && config.privateKeyEpayco != "") {
                data.privateKeyEpayco = config.privateKeyEpayco;
            }
            data.test = "NO";
            data.pago_unico_mensual = "UNICO";
            data.description = "Suscripción de tarjeta en " + config.name;
            console.log(data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
            rpc.setAsync(true);
            var func = function (r) {
                nw.console.log("save", r);
                main.misTarjetasCredito();
            };
            rpc.exec("apiNwPayTesting", data, func);

        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});