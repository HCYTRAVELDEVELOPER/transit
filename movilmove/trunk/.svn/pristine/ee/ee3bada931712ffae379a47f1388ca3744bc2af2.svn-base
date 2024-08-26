nw.Class.define("f_metodo_pago", {
    extend: nw.forms,
    construct: function (callback) {
        var self = this;
        self.id = "f_metodo_pago";
        self.setTitle = "<span style='color:#fff;'>" + nw.tr("Métodos de pago") + "</span>";
        self.html = "";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Volver";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
        self.createBase();
        self.callback = callback;
        self.id_tarjeta_credito_metodo = null;
        self.name_tarjeta_credito_metodo = null;

        var up = nw.userPolicies.getUserData();
        var fields = [
            {
                name: "metodo",
                label: "",
                visible_label: true,
                placeholder: '',
                type: "radio",
                required: true
            }
        ];
        self.setFields(fields);
        self.buttons = [];
        if (typeof callback === "undefined") {
            var useCredit = true;
            if (typeof main.configCliente !== "undefined") {
                if (nw.evalueData(main.configCliente)) {
                    if (main.configCliente.tipo_pago === "EFECTIVO") {
                        useCredit = false;
                    }
                }
            }
            if (useCredit === true) {
                self.buttons.push(
                        {
                            style: "border: 0;background-color:#f18107;color:#ffffff;margin:0px;",
                            icon: "material-icons check_circle normal",
                            colorBtnBackIOS: "#ffffff",
//                    position: "top",
                            name: "nuevo_metodo",
                            label: "Agregar tarjeta crédito",
                            callback: function () {
                                var d = new f_tarjetas_credito();
                                d.construct(function (data) {
                                    self.populateMetodo(data.numero_tarjeta);
                                });
                            }
                        }
                );
            }
            self.buttons.push(
                    {
                        style: "border: 0;background-color:gray;color:#ffffff;margin:10px 0;",
                        icon: "material-icons edit normal",
                        colorBtnBackIOS: "#ffffff",
                        name: "editar",
                        label: "Editar",
//                        position: "top",
                        callback: function () {
                            main.misTarjetasCredito(function () {
                                nw.back();
                                self.populateMetodo();
                            });
                        }
                    }
            );
        }
        self.show();
        self.onAppear(function () {
            setTimeout(function () {
                self.populateMetodo();
            }, 100);
        });
    },
    destruct: function () {
    },
    members: {
        populateMetodo: function populateMetodo(metdo) {
            var self = this;
            self.ui.metodo.html("");
            var up = nw.userPolicies.getUserData();
            var met = "efectivo";
            if (nw.evalueData(up.metodo_de_pago)) {
                met = up.metodo_de_pago;
            }
//            if (nw.evalueData(up.id_tarjeta_credito_metodo) && met === "credito") {
            if (nw.evalueData(up.id_tarjeta_credito_metodo) && met !== "efectivo") {
                met = up.id_tarjeta_credito_metodo;
            }
            if (nw.evalueData(metdo)) {
                met = metdo;
            }
            var data = {};
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.type = config.paymentStore;
            console.log("f_metodo_pago:::data", data);
//            self.ui.metodo.populateSelect('nwMaker', 'myCreditsCards', data, function (a) {
            self.ui.metodo.populateSelect('app_user', 'myCreditsCards', data, function (a) {
                console.log("f_metodo_pago:::responseServer", a);

                var data = {};
                if (nw.evalueData(main.configCliente)) {
                    if (main.configCliente.tipo_pago !== "CREDITO") {
                        data["efectivo"] = "Efectivo";
                        self.ui.metodo.populateSelectFromArray(data);
                    }
                }

                self.ui.metodo.populateSelect('app_user', 'formasDePago', data, function (a) {
                    console.log("eeee");

                    self.setValueMetodo(met, true);

                    self.ui.metodo.changeValue(function (e) {
                        nw.loading();
                        setTimeout(function () {
                            console.log("e", e);
                            console.log("e.value", e.value);
                            self.setValueMetodo(e.value);
                            self.save();
                        }, 1000);
                    });
                }, true, false);
            }, true, false);
        },
        setValueMetodo: function setValueMetodo(met, initial) {
            var self = this;
            console.log("setValueMetodo::met::initial", met, initial);

            self.metodo = met;
            if (self.metodo !== "efectivo") {
                self.metodo = "credito";
                self.id_tarjeta_credito_metodo = met;
            }

            if (initial != false) {
                var data = self.getRecord(true);
                console.log("data", data);
                console.log("data", data.metodo_text);
                if (typeof data.metodo_text != "undefined") {
                    self.metodo = data.metodo_text;
                    console.log("data.metodo_text.indexOf(***)", data.metodo_text.indexOf("***"));
                    if (data.metodo_text.indexOf("***") !== -1) {
                        self.metodo = "credito";
                        self.id_tarjeta_credito_metodo = data.metodo;
                    } else
                    if (self.metodo != "efectivo") {
                        self.metodo = data.metodo_text;
                        self.id_tarjeta_credito_metodo = data.metodo;
                    }
                }
            }

            self.ui.metodo.setValue(met);
        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var data = self.getRecord(true);
            var up = nw.userPolicies.getUserData();
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            data.perfil = up.perfil;
            data.metodo = self.metodo;
            data.id_tarjeta_credito_metodo = self.id_tarjeta_credito_metodo;
            data.name_tarjeta_credito_metodo = data.metodo_text;
            console.log("f_metodo_pago:::dataSendServer:::data", data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "nwMaker");
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("f_metodo_pago:::responseServer:::r", r);
                nw.loadingRemove();
                if (r !== true) {
                    nw.dialog(r);
                    return false;
                }
                nw.dialog(nw.tr("Forma de pago cambiada correctamente a") + " " + nw.tr(self.metodo) + ".");
                self.resolveEnd(data);
            };
            rpc.exec("changeMetodoPagoUser", data, func);
        },
        resolveEnd: function resolveEnd(data) {
            var self = this;
            console.log(data);
            window.localStorage.setItem("metodo_de_pago", data.metodo);
            if (nw.evalueData(data.id_tarjeta_credito_metodo)) {
                window.localStorage.setItem("id_tarjeta_credito_metodo", data.id_tarjeta_credito_metodo);
                window.localStorage.setItem("name_tarjeta_credito_metodo", data.name_tarjeta_credito_metodo);
                window.localStorage.setItem("metodo_de_pago", data.metodo);
            }
            if (nw.evalueData(self.callback)) {
                nw.back();
                self.callback(data);
            }
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});