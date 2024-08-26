qx.Class.define("transmovapp.forms.f_masivos", {
    extend: qxnw.forms,
    construct: function (datos) {
        var self = this;
        self.base(arguments);
        self.editar = false;
        self.setTitle(self.tr("Comunicaciones"));
        self.createBase();
        var fields = [
            {
                name: self.tr("Datos Basicos"),
                type: "startGroup",
                mode: "vertical"
            },
            {
                name: "id",
                label: self.tr("Id"),
                type: "textField",
                visible: false
            },
            {
                name: "dirigido",
                label: self.tr("Dirigido"),
                type: "selectBox",
                required: true
            },
            {
                name: "estado",
                label: self.tr("Estado"),
                type: "selectBox"
            },
            {
                name: "consultar",
                label: self.tr("Consultar"),
                type: "button"
            },
            {
                name: "tipo",
                label: self.tr("Tipo"),
                type: "selectBox",
                required: true
            },
            {
                name: "asunto",
                label: self.tr("Asunto"),
                type: "textField"
            },
            {
                name: "descripcion",
                label: self.tr("Descripción"),
                type: "textArea",
                required: true
            },
            {
                name: "saldo",
                label: self.tr("Saldo"),
                type: "textField",
                mode: "money",
                enabled: false
            },
            {
                name: "consultar_saldo",
                label: self.tr("Consultar saldo"),
                type: "button"
            },
            {
                name: "recargar_saldo",
                label: self.tr("Recargar saldo"),
                type: "button",
                visible: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: self.tr("Usuarios"),
                type: "startGroup",
                mode: "vertical"
            },
            {
                name: "campo_no",
                label: self.tr("Descripción"),
                type: "textArea"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.setFields(fields);
        self.ui.consultar.setMaxWidth(300);
        self.ui.consultar.setMinWidth(300);
        self.ui.consultar.setMaxHeight(50);
        self.ui.consultar.setMinHeight(50);
        self.ui.dirigido.setMaxWidth(300);
        self.ui.dirigido.setMinWidth(300);
        self.ui.estado.setMaxWidth(300);
        self.ui.estado.setMinWidth(300);
        self.ui.tipo.setMaxWidth(300);
        self.ui.tipo.setMinWidth(300);

        var t = {};
        t[""] = self.tr("Seleccione");
        qxnw.utils.populateSelectFromArray(self.ui.dirigido, t);
        qxnw.utils.populateSelectFromArray(self.ui.tipo, t);
        qxnw.utils.populateSelectFromArray(self.ui.estado, t);

        var t = {};
        t["1"] = self.tr("Cliente");
        t["2"] = self.tr("Conductor");
        qxnw.utils.populateSelectFromArray(self.ui.dirigido, t);

        var t = {};
        t["notificacion"] = self.tr("Notificación Push");
        t["correo"] = self.tr("Correo");
        t["mensaje_text"] = self.tr("SMS");
        qxnw.utils.populateSelectFromArray(self.ui.tipo, t);

        var t = {};
        t["1"] = self.tr("Activo");
        t["2"] = self.tr("Inactivo");
        t["3"] = self.tr("Pre-Registrado");
        t["4"] = self.tr("Creación cuenta");
        qxnw.utils.populateSelectFromArray(self.ui.estado, t);


        self.list = new qxnw.listEdit();
        var columns = [
            {
                label: self.tr("Nombre"),
                caption: "nombre",
                name: "nombre"
            },
            {
                label: self.tr("Email"),
                caption: "email",
                name: "email"
            },
            {
                label: self.tr("Celular"),
                caption: "celular",
                name: "celular"
            },
            {
                label: self.tr("Numero servicios"),
                caption: "numero_servicios",
                name: "numero_servicios"
            },
            {
                label: self.tr("perfil"),
                caption: "perfil",
                name: "perfil",
                visible: false
            }];
        self.list.setColumns(columns);
        self.addBeforeGroup("usuarios", self.list.getBase());
        self.setFieldVisibility(self.ui.campo_no, "excluded");
        self.list.hideFooterTools();
        self.list.ui.part1.setVisibility("excluded");
        self.list.ui.part2.setVisibility("excluded");
        self.list.ui.part3.setVisibility("excluded");
        self.list.ui.part4.setVisibility("excluded");
        self.ui.consultar.addListener("execute", function () {
            self.setRequired("descripcion", false);
            self.setRequired("tipo", false);
            self.applyfilters();
        });
//        self.list.hideHeaderTools();
//        t = {};
//        t.table = "edo_tipo_vehiculo";
//        qxnw.utils.populateSelect(self.ui.tipo_vehiculo, "master", "populate", t);
        self.setRequired("descripcion", false);
        self.setRequired("estado", false);
        self.setRequired("tipo", false);

        self.addListener("appear", function () {
            var d = self.ui.consultar.getContentElement().getDomElement();
            d.id = "btn_rj";
//            qx.bom.element.Id.add(d, "btn_rj");
            var head = document.querySelector('head');
            var style = document.createElement('style');
            style.innerHTML = '#btn_rj{background:#de481b!important;padding:30px!important;}\n\
            #btn_rj div{    color: #ffff!important;width: 66px!important;height: 22px!important;font-size: 14px!important;font-weight: bold;}'
            head.appendChild(style);
            console.log(d);

        });
        self.setFieldVisibility(self.ui.estado, "excluded");
//        self.setFieldVisibility(self.ui.saldo, "excluded");
        self.ui.dirigido.addListener("changeSelection", function () {
            var data = this.getValue();
            console.log(data);
            if (data.dirigido == "2") {
                self.setFieldVisibility(self.ui.estado, "visible");
//                self.setFieldVisibility(self.ui.saldo, "visible");
                self.setRequired("estado", true);
            } else {
//                self.setFieldVisibility(self.ui.saldo, "excluded");
                self.setFieldVisibility(self.ui.estado, "excluded");
                self.setRequired("estado", false);
            }
        });

        self.setFieldVisibility(self.ui.asunto, "excluded");
        self.setRequired("asunto", false);
        self.ui.tipo.addListener("changeSelection", function () {
            self.ui.saldo.setValue("0");
            var data = this.getValue();
            if (data.tipo == "mensaje_text") {
                self.setFieldVisibility(self.ui.asunto, "excluded");
                self.setRequired("asunto", false);
            } else {
                self.setFieldVisibility(self.ui.asunto, "visible");
                self.setRequired("asunto", true);
            }
            self.getSaldo();
        });

        self.ui.recargar_saldo.addListener("execute", function () {
            window.open('https://www.movilmove.com/recargar-saldo', '_blank');
        });
        self.ui.consultar_saldo.addListener("execute", function () {
            self.getSaldo();
        });
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

    },
    destruct: function () {
    },
    members: {
        __total: null,
        navTable: null,
        __addButon: null,
        __removeButton: null,
        getSaldo: function getSaldo() {
            var self = this;
            var data = self.getRecord();
            if (data.tipo == "") {
                qxnw.utils.information("Elija el tipo de notificación para consultar el saldo.");
                return;
            }
            if (data.tipo == "notificacion") {
                self.ui.saldo.setValue("1");
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin", true);
            var func = function (r) {
                console.log("getSaldo", r);
                if (r.saldo == "null" || r.saldo == null) {
                    r.saldo = 0;
                }
                console.log(r);
                console.log(data);
                if (data.tipo == "correo" || data.tipo == "mensaje_text") {
                    if (r.usuCreden == "" || r.usuCreden == null || r.passCreden == "" || r.passCreden == null) {
                        var text = "correos.";
                        if (data.tipo == "mensaje_text") {
                            text = "menjajes de texto."
                        }
                        qxnw.utils.information("No tiene credenciales para envío de " + text);
                        return;
                    }
                }
                self.ui.saldo.setValue(r.saldo.toString());
            };
            rpc.exec("getSaldo", data, func);
        },
        applyfilters: function applyfilters() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin", true);
            var func = function (r) {
                if (r) {
                    for (var i = 0; i < r.length; i++) {
                        var row = r[i];
                        if (row.numero_servicios == 'null' || row.numero_servicios == null) {
                            row.numero_servicios = "0";
                        }
                    }
                    self.list.setModelData(r);
                }
            };
            rpc.exec("consultaMasivo", data, func);
        },
        slotSave: function slotSave() {
            var self = this;
            self.setRequired("descripcion", true);
            self.setRequired("tipo", true);
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            data.filters = self.list.getAllRecords();
            data.total = data.filters.length;
            if (data.saldo.toString() === "0") {
                qxnw.utils.information("No tiene saldo suficiente.");
                return;
            }
            if (data.total == 0) {
                qxnw.utils.information("No tiene usuarios a quien enviar.");
                return;
            }
            if (data.tipo == "mensaje_text" || data.tipo == "notificacion") {
                var lng = data.descripcion.length;
                if (lng > 140) {
                    qxnw.utils.information("lo sentimos para enviar " + data.tipo_text + " la descripción debe de ser menor a 140 caracteres.");
                }
            }

            var tipoText = "";
            if (data.tipo === "mensaje_text") {
                tipoText = "mensajes de texto";
            }
            if (data.tipo === "correo") {
                tipoText = "correos";
            }
            if (data.tipo === "notificacion") {
                tipoText = "notificaciones push";
            }
            data.tipoText = tipoText;
            console.log("f_masivos:::slotSave:::sendDataServer", data);
            qxnw.utils.question("¿Está segur@ de enviar " + data.total + " " + tipoText + "?", function (e) {
                if (e) {
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "masivo_comunicaciones", true);
                    var func = function (r) {
                        console.log("f_masivos:::slotSave:::responseServer", r);
                        qxnw.utils.information(r);
                        self.getSaldo();
                    };
                    rpc.exec("envioMasivo", data, func);
                }
            });

        }
    }
});