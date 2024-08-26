qx.Class.define("enrutamiento.forms.f_agregar_pasajero", {
    extend: qxnw.forms,
    construct: function (callbackOnAdd, data_parent) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader("Agregar pasajero");
        self.setTitle("Agregar pasajero");
        self.callbackOnAdd = callbackOnAdd;
        self.dataParent = data_parent;
        var fields = [
            {
                name: "Buscar pasajero o parada",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "buscar_pasajero",
                label: "Buscar por correo, nombre, documento, teléfono o dirección a un pasajero existente",
                caption: "buscar_pasajero",
                type: "selectTokenField",
                required: false
            },
            {
                name: "tipo",
                label: "Tipo",
                caption: "tipo",
                type: "selectBox",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Ubicación de origen",
                type: "startGroup",
                icon: "",
                mode: "horizontal",
                visible: false
            },
            {
                name: "origen_manual_direccion",
                label: "Dirección partida",
                caption: "origen_manual_direccion",
                type: "textField",
                required: false
            },
            {
                name: "origen_manual_latitud",
                label: "Latitud origen",
                caption: "origen_manual_latitud",
                type: "textField",
                visible: false,
                enabled: true
            },
            {
                name: "origen_manual_longitud",
                label: "Longitud origen",
                caption: "origen_manual_longitud",
                type: "textField",
                visible: false,
                enabled: true
            },
            {
                name: "origen_manual_pais",
                label: "País partida",
                caption: "origen_manual_pais",
                type: "textField",
                visible: true,
                enabled: true
            },
            {
                name: "origen_manual_ciudad",
                label: "Ciudad partida",
                caption: "origen_manual_ciudad",
                type: "textField",
                visible: true,
                enabled: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Ubicación de destino",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "direccion_parada",
                label: "Dirección destino",
                caption: "direccion_parada",
                type: "textField",
                required: false
            },
            {
                name: "latitud",
                label: "Latitud",
                caption: "latitud",
                type: "textField",
                visible: false,
                enabled: true
            },
            {
                name: "longitud",
                label: "Longitud",
                caption: "longitud",
                type: "textField",
                visible: false,
                enabled: true
            },
            {
                name: "pais",
                label: "País",
                caption: "pais",
                type: "textField",
                visible: true,
                enabled: true
            },
            {
                name: "ciudad",
                label: "Ciudad",
                caption: "ciudad",
                type: "textField",
                visible: true,
                enabled: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Datos básicos del pasajero",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "nombre",
                label: "Nombre",
                caption: "nombre",
                type: "textField",
                required: false
            },
            {
                name: "telefono",
                label: "Teléfono / Móvil",
                caption: "telefono",
                type: "textField",
                required: false
            },
            {
                name: "correo",
                label: "Correo",
                caption: "correo",
                type: "textField",
                required: false
            },
            {
                name: "documento",
                label: "Documento",
                caption: "documento",
                type: "textField",
                required: false
            },
            {
                name: "usuario_pasajero",
                label: "Usuario de app",
                caption: "usuario_pasajero",
                type: "textField",
                required: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Observaciones",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            }, {
                name: "observacion",
                label: "Observaciones",
                caption: "observacion",
                type: "textArea",
                required: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.setFields(fields);

        self.ui.direccion_parada.setMaxWidth(490);
        self.ui.direccion_parada.setMinWidth(490);

        self.ui.origen_manual_direccion.setMaxWidth(490);
        self.ui.origen_manual_direccion.setMinWidth(490);
//        self.ui.pais.setMaxWidth(100);
//        self.ui.pais.setMinWidth(100);
//        self.ui.ciudad.setMaxWidth(100);
//        self.ui.ciudad.setMinWidth(100);

        self.grupoOrigen = self.getGroup("ubicacion_de_origen");
        self.grupoOrigen.setVisibility("excluded");

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.addListener("appear", function () {
            self.addCl(self.ui.direccion_parada, function (e) {
                var lat = e.location.lat().toString();
                var lng = e.location.lng().toString();
                self.ui.latitud.setValue(lat);
                self.ui.longitud.setValue(lng);
                self.ui.ciudad.setValue(e.ciudad);
                self.ui.pais.setValue(e.pais);
            });
//            self.addCl(self.ui.origen_manual_direccion);
        });

        self.ui.buscar_pasajero.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("populateTokenPasajerosapp", r);
//                self.ui.buscar_pasajero.cleanAll();
//                if (r.length == 0) {
//                    return false;
//                }
                self.ui.buscar_pasajero.setModelData(r);
            };
            rpc.exec("populateTokenPasajerosapp", data, func);
        }, this);
        self.ui.buscar_pasajero.addListener("addItem", function (e) {
            var val = e.getData();
            var data = self.getRecord();
            console.log("data", data);
            console.log("val", val);
            if (!qxnw.utils.evalueData(val)) {
                return false;
            }

//            if (data.tipo == "PARADA") {
//                return false;
//            }
//            if (data.tipo == "PASAJERO_EJECUTIVO" || data.tipo == "PASAJERO_RUTA") {
            if (qxnw.utils.evalueData(val.nombre)) {
                self.ui.nombre.setValue(val.nombre.toString());
            }
            if (qxnw.utils.evalueData(val.telefono)) {
                self.ui.telefono.setValue(val.telefono.toString());
            }
            if (qxnw.utils.evalueData(val.correo)) {
                self.ui.correo.setValue(val.correo.toString());
            }
            if (qxnw.utils.evalueData(val.documento)) {
                self.ui.documento.setValue(val.documento.toString());
            }
            if (qxnw.utils.evalueData(val.usuario_pasajero)) {
                self.ui.usuario_pasajero.setValue(val.usuario_pasajero.toString());
            }
            if (self.dataParent.sentido === "EJECUTIVO") {
                return;
            }
            if (qxnw.utils.evalueData(val.direccion_parada)) {
                self.ui.direccion_parada.setValue(val.direccion_parada.toString());
            }
//            } else {
//                self.ui.nombre.setValue("");
//                self.ui.telefono.setValue("");
//                self.ui.correo.setValue("");
//                self.ui.documento.setValue("");
//                self.ui.usuario_pasajero.setValue("");
//            }
//            if (data.tipo == "PASAJERO_RUTA" || data.tipo == "PARADA") {
            if (qxnw.utils.evalueData(val.latitud)) {
                self.ui.latitud.setValue(val.latitud.toString());
            }
            if (qxnw.utils.evalueData(val.longitud)) {
                self.ui.longitud.setValue(val.longitud.toString());
            }
            if (qxnw.utils.evalueData(val.ciudad)) {
                self.ui.ciudad.setValue(val.ciudad.toString());
            }
            if (qxnw.utils.evalueData(val.pais)) {
                self.ui.pais.setValue(val.pais.toString());
            }
//            } else {
//                self.ui.direccion_parada.setValue("");
//                self.ui.latitud.setValue("");
//                self.ui.longitud.setValue("");
//                self.ui.ciudad.setValue("");
//                self.ui.pais.setValue("");
//            }

            if (qxnw.utils.evalueData(val.observacion)) {
                self.ui.observacion.setValue(val.observacion.toString());
            }
        }, this);

//        self.ui.tipo.setEnabled(false);

        var data = {};
        if (self.dataParent.sentido !== "EJECUTIVO") {
            data["PASAJERO_RUTA"] = "PASAJERO RUTA";
        }
        data["PASAJERO_EJECUTIVO"] = "PASAJERO EJECUTIVO";
        data["PARADA"] = "PARADA";
        data["PASAJERO_PRINCIPAL"] = "PASAJERO PRINCIPAL";
        data["PARADA_ORIGENDESTINO"] = "PARADA CON ORIGEN Y DESTINO";
//        data["USUARIO_PRINCIPAL"] = "USUARIO APP PRINCIPAL";
        qxnw.utils.populateSelectFromArray(self.ui.tipo, data);
        if (self.dataParent.sentido !== "EJECUTIVO") {
            self.ui.tipo.setValue("PASAJERO_RUTA");
        }

        if (self.dataParent.sentido === "EJECUTIVO") {
//            self.ui.tipo.setEnabled(true);
            self.ui.tipo.setValue("PASAJERO_EJECUTIVO");
            self.resolveByType("PASAJERO_EJECUTIVO");
        }

        self.ui.tipo.addListener("changeSelection", function (e) {
            var data = this.getValue();
            console.log("data", data);
            self.resolveByType(data.tipo);
        });

        self.setAllowClose(false);
        self.setAllowMinimize(false);

    },
    destruct: function () {
    },
    members: {
        cargaWidgetOrigen: false,
        addCl: function addCl(widget, callback) {
            var self = this;
            if (!main.evalueData(widget)) {
                setTimeout(function () {
                    self.addCl(widget, callback);
                }, 500);
                return false;
            }
            if (!main.evalueData(widget.getContentElement())) {
                setTimeout(function () {
                    self.addCl(widget, callback);
                }, 500);
                return false;
            }
            if (!main.evalueData(widget.getContentElement().getDomElement())) {
                setTimeout(function () {
                    self.addCl(widget, callback);
                }, 500);
                return false;
            }
            qx.bom.element.Class.add(widget.getContentElement().getDomElement(), "direccion_search");
            main.autocomplete(".direccion_search", false, function (e) {
                console.log("e", e);
                callback(e);
//                var lat = e.location.lat().toString();
//                var lng = e.location.lng().toString();
//                self.ui.latitud.setValue(lat);
//                self.ui.longitud.setValue(lng);
//                self.ui.ciudad.setValue(e.ciudad);
//                self.ui.pais.setValue(e.pais);
            });
        },
        resolveByType: function resolveByType(type) {
            var self = this;
            console.log("resolveByType:::type", type);
            self.grupoOrigen.setVisibility("excluded");
            self.ui.origen_manual_latitud.setValue("");
            self.ui.origen_manual_longitud.setValue("");
            self.ui.origen_manual_pais.setValue("");
            self.ui.origen_manual_ciudad.setValue("");
            if (type == "PARADA_ORIGENDESTINO") {
                self.grupoOrigen.setVisibility("visible");
                if (!self.cargaWidgetOrigen) {
                    self.addCl(self.ui.origen_manual_direccion, function (e) {
                        console.log("e", e);
                        var lat = e.location.lat().toString();
                        var lng = e.location.lng().toString();
                        self.ui.origen_manual_latitud.setValue(lat);
                        self.ui.origen_manual_longitud.setValue(lng);
                        self.ui.origen_manual_pais.setValue(e.pais);
                        self.ui.origen_manual_ciudad.setValue(e.ciudad);
                    });
                }
                self.cargaWidgetOrigen = true;
            }
            if (type == "PASAJERO_PRINCIPAL") {
                self.ui.nombre.setRequired(true);
                self.setRequired("nombre", true);

                self.ui.direccion_parada.setRequired(false);
                self.setRequired("direccion_parada", false);
                return;
            } else {
                self.ui.nombre.setRequired(false);
                self.setRequired("nombre", false);

                self.ui.direccion_parada.setRequired(true);
                self.setRequired("direccion_parada", true);
            }
            if (type == "PASAJERO_EJECUTIVO") {
//                self.ui.latitud.setEnabled(false);
//                self.ui.longitud.setEnabled(false);
//                self.ui.pais.setEnabled(false);
//                self.ui.ciudad.setEnabled(false);
//                self.ui.direccion_parada.setEnabled(false);
                self.ui.direccion_parada.setRequired(false);
                self.setRequired("direccion_parada", false);

//                self.ui.buscar_pasajero.setEnabled(true);
//                self.ui.nombre.setEnabled(true);
//                self.ui.telefono.setEnabled(true);
//                self.ui.correo.setEnabled(true);
//                self.ui.documento.setEnabled(true);
//                self.ui.usuario_pasajero.setEnabled(true);

                self.ui.latitud.setValue("");
                self.ui.longitud.setValue("");
                self.ui.ciudad.setValue("");
                self.ui.pais.setValue("");


            } else
            if (type == "PARADA") {
//                self.ui.latitud.setEnabled(true);
//                self.ui.longitud.setEnabled(true);
//                self.ui.pais.setEnabled(true);
//                self.ui.ciudad.setEnabled(true);
//                self.ui.direccion_parada.setEnabled(true);
//                self.ui.direccion_parada.setRequired(true);
                self.setRequired("direccion_parada", true);

//                self.ui.buscar_pasajero.setEnabled(false);
//                self.ui.nombre.setEnabled(false);
//                self.ui.telefono.setEnabled(false);
//                self.ui.correo.setEnabled(false);
//                self.ui.documento.setEnabled(false);
//                self.ui.usuario_pasajero.setEnabled(false);

//                self.ui.direccion_parada.setValue("");
//                self.ui.nombre.setValue("");
//                self.ui.telefono.setValue("");
//                self.ui.correo.setValue("");
//                self.ui.documento.setValue("");
//                self.ui.usuario_pasajero.setValue("");

            } else {
//                self.ui.latitud.setEnabled(true);
//                self.ui.longitud.setEnabled(true);
//                self.ui.pais.setEnabled(true);
//                self.ui.ciudad.setEnabled(true);
//                self.ui.direccion_parada.setEnabled(true);
//                self.ui.direccion_parada.setRequired(true);
                self.setRequired("direccion_parada", true);

//                self.ui.buscar_pasajero.setEnabled(true);
//                self.ui.nombre.setEnabled(true);
//                self.ui.telefono.setEnabled(true);
//                self.ui.correo.setEnabled(true);
//                self.ui.documento.setEnabled(true);
//                self.ui.usuario_pasajero.setEnabled(true);
            }

            self.ui.latitud.setValue("");
            self.ui.longitud.setValue("");
            self.ui.ciudad.setValue("");
            self.ui.pais.setValue("");
            self.ui.direccion_parada.setValue("");
            self.ui.nombre.setValue("");
            self.ui.telefono.setValue("");
            self.ui.correo.setValue("");
            self.ui.documento.setValue("");
            self.ui.usuario_pasajero.setValue("");
            self.ui.observacion.setValue("");
            self.ui.buscar_pasajero.cleanAll();
//            self.clean();
//            self.cleanAll();

        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var dat = self.getRecord();
            var nombre = dat.direccion_parada;
            if (main.evalueData(dat.nombre)) {
                nombre = dat.nombre;
            }
            dat.pasajero = nombre + " " + dat.direccion_parada;
            if (main.evalueData(dat.documento)) {
                dat.pasajero += " - " + dat.documento;
            }
            if (main.evalueData(dat.observacion)) {
                dat.pasajero += " - " + dat.observacion;
            }
            dat.id = Math.random() + "_pasajeros";
            console.log("dat", dat);
            self.ui.nombre.setValue("");
            self.ui.direccion_parada.setValue("");
            self.ui.latitud.setValue("");
            self.ui.longitud.setValue("");
            self.ui.documento.setValue("");
            self.ui.usuario_pasajero.setValue("");
            self.ui.telefono.setValue("");
            self.ui.correo.setValue("");
            self.ui.observacion.setValue("");
            if (typeof self.callbackOnAdd !== "undefined") {
//                self.callbackOnAdd(data);
                self.callbackOnAdd(dat);
                self.reject();
            }
            self.ui.direccion_parada.focus();
            self.ui.buscar_pasajero.setValue("");
        }
    }
});
