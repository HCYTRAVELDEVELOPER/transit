qx.Class.define("transmovapp.forms.f_vehiculo", {
    extend: qxnw.forms,
    construct: function (datos) {
        var self = this;
        self.base(arguments);
        self.editar = false;
        self.setTitle(self.tr("Agregar Vehiculo"));
        self.createBase();

        self.datadriver = datos;

        var configC = main.getConfiguracion();
        self.__conf = configC;
        var t = t;
        var conf = configC;
        self.t = configC;

        var up = qxnw.userPolicies.getUserData();
        var fields = [
            {
                name: ("Datos Basicos"),
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "id",
                label: self.tr("Id"),
                type: "textField",
                visible: true,
                enabled: false

            },
            {
                name: "imagen_vehi",
                label: self.tr("Foto Vehículo <span style='color:red; font-size: 10px;font-weight: bold;'>(Mostrando PLACA)</span>"),
                type: "uploader"
            },
            {
                name: "tipo_vehiculo",
                label: self.tr("Tipo Vehículo"),
                type: "selectBox"
            },
            {
                name: "vehiculo_publico_particular",
                label: self.tr("Vehículo público, particular o taxi"),
                type: "selectBox"
            },
            {
                name: "placa",
                label: self.tr("Placa"),
                type: "textField"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                mode: "horizontal"
            },
//            ddd
            {
                name: "descripcion_carroceria",
                label: self.tr("Descripción Carroceria"),
                type: "selectBox"
            },
            {
                name: "capacidad_carga_kg",
                label: self.tr("Capacidad Carga en Kg"),
                type: "textField",
                mode: "integer"
            },
            {
                name: "capacidad_volumen_m3",
                label: self.tr("Capacidad Volumen en M3"),
                type: "textField",
                mode: "integer"
            },
//            ssss
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "marca",
                label: self.tr("Marca"),
                type: "selectTokenField"
            },
            {
                name: "modelo",
                label: self.tr("Modelo"),
                type: "selectBox"
            },
            {
                name: "color",
                label: self.tr("Color"),
                type: "textField",
                mode: "upperCase"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "numero_puertas",
                label: self.tr("Número puertas"),
                type: "selectBox"
            },
            {
                name: "capacidad_pasajeros",
                label: self.tr("Capacidad Pasajeros"),
                type: "selectBox"
            },
            {
                name: "num_maletas",
                label: self.tr("Capacidad Maletas"),
                type: "selectBox"
            },
            {
                name: "fecha_vencimiento_soat",
                label: self.tr("Fecha Vencimiento SOAT"),
                type: "dateField"
            },
            {
                name: "vehiculo_poliza_contractual",
                label: self.tr("Fecha vencimiento póliza contractual y extracontractual"),
                type: "dateField"
            },
            {
                name: "vehiculo_poliza_todoriesgo",
                label: self.tr("Fecha vencimiento póliza todoriesgo"),
                type: "dateField"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "foto_soat",
                label: self.tr("Foto SOAT"),
                type: "uploader"
            },
            {
                name: "tarjeta_propiedad",
                label: self.tr("Tarjeta de propiedad delantera"),
                type: "uploader"
            },
            {
                name: "tarjeta_propiedad_trasera",
                label: self.tr("Tarjeta de Circulación Trasera"),
                type: "uploader"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "revision_tegnomecanica",
                label: self.tr("Revisión Tecnomecánica"),
                type: "uploader"
            },
            {
                name: "fecha_vencimiento_tegnomecanica",
                label: self.tr("Fecha vencimiento Tecnomecánica"),
                type: "dateField"
            },
            {
                name: "propietario_vehiculo",
                label: self.tr("Conductor / Propietario"),
                type: "selectTokenField"
            },
            {
                name: "estado_activacion",
                label: self.tr("Estado Activación"),
                type: "selectBox"

            },
            {
                name: "servicio_activo",
                label: self.tr("Estado Servicio"),
                type: "selectBox"

            },
            {
                name: "soat",
                label: self.tr("SOAT No."),
                type: "textField"
//                mode: "maxCharacteres:30",

            },
            {
                name: "numero_moto",
                label: self.tr("# Motocicleta"),
                type: "textField"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Datos propietario",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "nombre_propietario",
                label: self.tr("Nombre Propietario"),
                type: "textField"
            },
            {
                name: "identificacion_propietario",
                label: self.tr("Identificación Propietario"),
                type: "textField"
            },
            {
                name: "rut",
                label: self.tr("RUT"),
                type: "uploader"
            },
            {
                name: "direccion_proietario",
                label: self.tr("Dirección Propietario"),
                type: "textField"
            },
            {
                name: "telefono_proietario",
                label: self.tr("Telefono Propietario"),
                type: "textField"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                mode: "horizontal"
            },
            {
                name: "numero_interno",
                label: self.tr("Numero interno"),
                type: "textField"
            },
            {
                name: "numero_tarjeta_operacion",
                label: self.tr("Numero tarjeta operación"),
                type: "textField"
            },
            {
                name: "fecha_vencimiento_numero_tarjeta_operacion",
                label: self.tr("Fecha vencimiento tarjeta operación"),
                type: "dateField"
            },
            {
                name: "activar_servicios",
                label: self.tr("Activar Servicios"),
                type: "selectListCheck"
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(main.labels(fields));

        if (typeof self.__conf.documentos_vehiculo !== "undefined") {
            for (var key in self.__conf.documentos_vehiculo) {
                var value = self.__conf.documentos_vehiculo[key];
                if (key != "id") {
                    var vis = "visible";
                    var red = true;
                    if (value === "NO") {
                        vis = "excluded";
                        red = false;
                    }
                    if (typeof self.ui[key] !== "undefined") {
                        if (value === "SI_REQUIRED_FALSE") {
                            self.setFieldVisibility(self.ui[key], "visible");
                            self.setRequired(key, false);
                        } else {
                            self.setFieldVisibility(self.ui[key], vis);
                            self.setRequired(key, red);
                        }
                    }
                }
            }
        }


        self.setMinWidth(600);
        self.ui.marca.hideColumn("id");
        var conf = main.getConfiguracion();
        self.ui.activar_servicios.populate("servicios_admin", "populateTokenTipoServicio");
        console.log("conf", conf);
        var t = {};
        t[""] = "Seleccione";
        var ano = "1980";
        if (qxnw.utils.evalue(conf.rango_modelo_vheiculo)) {
            ano = conf.rango_modelo_vheiculo;
        }
        for (var i = 0; i < 46; i++) {
            t[ano] = ano.toString();
            ano = parseInt(ano) + 1;
        }
        qxnw.utils.populateSelectFromArray(self.ui.modelo, t);
        var t = {};
        t[""] = "Seleccione";
        var puertas = 1;
        t[0] = "0";
        for (var e = 0; e < 5; e++) {
            t[puertas] = puertas.toString();
            puertas++;
        }
        qxnw.utils.populateSelectFromArray(self.ui.numero_puertas, t);
        var t = {};
        t[""] = "Seleccione";
        var pasajeros = 1;
        for (var h = 0; h < 60; h++) {
            t[pasajeros] = pasajeros.toString();
            pasajeros++;
        }
        qxnw.utils.populateSelectFromArray(self.ui.capacidad_pasajeros, t);

        var data = {};
        data[""] = "Seleccione";
        qxnw.utils.populateSelectFromArray(self.ui.num_maletas, data);
        var data = {};
        for (var i = 1; i <= 100; i++) {
            data[i] = i.toString();
        }
        qxnw.utils.populateSelectFromArray(self.ui.num_maletas, data);

        self.setFieldVisibility(self.ui.descripcion_carroceria, "excluded");
        if (configC.usar_descripcion_carroceria == "SI") {
            var data = {};
            data[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(self.ui.descripcion_carroceria, data);
            data = {};
            data["table"] = "edo_descripcion_carroceria";
            qxnw.utils.populateSelect(self.ui.descripcion_carroceria, "master", "populate", data);
            self.setFieldVisibility(self.ui.descripcion_carroceria, "visible");
        }
//        if (configC.capacidad_carga_kg != "SI") {
//            self.setFieldVisibility(self.ui.capacidad_carga_kg, "excluded");
//        }
//        if (configC.capacidad_volumen_m3 != "SI") {
//            self.setFieldVisibility(self.ui.capacidad_volumen_m3, "excluded");
//        }
//        if (configC.tarjeta_propiedad_trasera != "SI") {
//            self.ui.tarjeta_propiedad_trasera.setVisibility("excluded");
//        }
//        if (configC.revision_tegnomecanica != "SI") {
//            self.ui.revision_tegnomecanica.setVisibility("excluded");
//            self.ui.fecha_vencimiento_tegnomecanica.setVisibility("excluded");
//        }

        self.ui.modelo.addListener("focusout", function () {
            var model = self.ui.modelo.getValue();
            var dateyear = new Date();
            var year = dateyear.getFullYear();
            if (model > year + 1) {
                self.ui.modelo.setValue("");
                qxnw.utils.information("Modelo no valido");
            }
            if (model < 1900) {
                self.ui.modelo.setValue("");
                qxnw.utils.information("El modelo no puede ser menor a 1900");
            }
        });

        self.ui.marca.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "vehiculos_admin");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.marca.setModelData(r);
                self.ui.marca.hideColumn("nombre");
            };
            rpc.exec("populateTokenMarcaV", data, func);
        }, this);

        self.ui.placa.addListener("keypress", function (e) {
            if (e.getKeyIdentifier() == "Enter") {
                self.slotFindID();
            }
        });
        var t = {};
        t[0] = self.tr("inactivo");
        t[1] = self.tr("activo");
        qxnw.utils.populateSelectFromArray(self.ui.estado_activacion, t);
        self.ui.estado_activacion.setValue(1);

        var t = {};
        t[0] = self.tr("inactivo");
        t[1] = self.tr("activo");
        qxnw.utils.populateSelectFromArray(self.ui.servicio_activo, t);
        self.ui.servicio_activo.setValue(1);

        var t = {};
        t[""] = "Seleccione";
        t["particular"] = "Particular";
        t["publico"] = "Público";
        t["publico_taxi"] = "Taxi";
        qxnw.utils.populateSelectFromArray(self.ui.vehiculo_publico_particular, t);


        var t = {};
        t[""] = self.tr("Seleccione");
        qxnw.utils.populateSelectFromArray(self.ui.tipo_vehiculo, t);

        t = {};
        t.table = "edo_tipo_vehiculo";
        qxnw.utils.populateSelect(self.ui.tipo_vehiculo, "master", "populate", t);

        self.ui.propietario_vehiculo.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.propietario_vehiculo.setModelData(r);
                var item = self.getRecord();
                if (self.editar == false) {
                } else {
                    self.editar = false;
                }
            };
            rpc.exec("populateTokenUsuarioss", data, func);
        }, this);

        self.slotConfiguracion();
        self.ui.accept.addListener("execute", function () {
            if (!self.validate()) {
                return;
            }
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
        slotVerAdjunto: function slotVerAdjunto() {
            var self = this;
            var sl = self.navTableR.selectedRecord();
            var win = window.open(sl.adjunto, '_blank');
            win.focus();
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            console.log("data.activar_servicios", data.activar_servicios)
            data.activar_servicios = JSON.stringify(data.activar_servicios);
            console.log("data", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "vehiculos_admin", true);
            var func = function (r) {
                console.log("r", r);
                if (r) {
                    self.accept(r);
                }
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr, t) {
            var self = this;
            console.log("pr", pr);
            self.setRecord(pr);
            if (pr.activar_servicios) {
                var est = JSON.parse(pr.activar_servicios);
                for (var i = 0; i < est.length; i++) {
                    var estado = {
                        id: est[i].id,
                        nombre: est[i].nombre
                    };
                    self.ui.activar_servicios.addToken(estado);
                }
            }
            var propietario = {
                id: pr.id_usuario,
                nombre: pr.usuario,
                nombre_text: pr.usuario_text
            };
            self.ui.propietario_vehiculo.addToken(propietario);
//            }
            if (qxnw.utils.evalue(pr.marca)) {
                var marca = {
                    id: pr.marca,
                    nombre: pr.marca_text
                };
                self.ui.marca.addToken(marca);
            }
            return true;
        },
        slotConfiguracion: function slotConfiguracion() {
            var self = this;
            var conf = main.getConfiguracion();
            if (qxnw.utils.evalue(conf)) {
                if (conf.documentos_adic == "NO") {
                    self.ui.tipo_vehiculo.setValue(4);
                    self.ui.tipo_vehiculo.setEnabled(false);
                    self.ui.foto_soat.setEnabled(false);
                    self.ui.soat.setEnabled(false);
                    self.ui.fecha_vencimiento_soat.setEnabled(false);
                    self.setFieldVisibility(self.ui.numero_moto, "visible");
                    self.setFieldVisibility(self.ui.modelo, "excluded");
                } else {
                    self.setFieldVisibility(self.ui.numero_moto, "excluded");
                }
            }
        },
        slotFindID: function slotFindID() {
            var self = this;
            var data = self.getRecord();
            if (qxnw.utils.evalue(data.placa)) {
                var rpc = new qxnw.rpc(self.getRpcUrl(), "vehiculos_admin");
                rpc.setAsync(true);
                var func = function (r) {
                    if (r != false && r != "false") {
                        self.ui.placa.setValue("");
                        qxnw.utils.information("El número de placa que esta ingresando, ya esta registrada. Verifique por favor!");
                        return;
                    }
                };
                rpc.exec("populateVehiculo", data, func);
            }
        }
    }
});