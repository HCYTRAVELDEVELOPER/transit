qx.Class.define("maestros.forms.f_configuracion", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle(self.tr("Configuraciones"));
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "Configuracion vehiculo",
                type: "startGroup",
                icon: "",
                mode: "grid"
            },
            {
                name: "marca",
                label: "Marca",
                type: "selectBox",
                row: 0,
                column: 0
            },
            {
                name: "modelo",
                label: "Modelo",
                type: "selectBox",
                row: 0,
                column: 1
            },
            {
                name: "color",
                label: "Color",
                type: "selectBox",
                row: 0,
                column: 2
            },
            {
                name: "imagen_vehi",
                label: "Imagen vehiculo",
                type: "selectBox",
                row: 0,
                column: 3
            },
            {
                name: "numero_puertas",
                label: "Numero puertas",
                type: "selectBox",
                row: 0,
                column: 4
            },
            {
                name: "capacidad_pasajeros",
                label: "Capacidad pasajeros",
                type: "selectBox",
                row: 0,
                column: 5
            },

            {
                //p
                name: "usar_descripcion_carroceria",
                label: "Usar descripcion carroceria",
                type: "selectBox",
                row: 1,
                column: 0
            },
            {

                name: "capacidad_carga_kg",
                label: "Capacidad carga Kg",
                type: "selectBox",
                row: 1,
                column: 1
            },
            {
                name: "capacidad_volumen_m3",
                label: "Capacidad volumen m3",
                type: "selectBox",
                row: 1,
                column: 2
            },
            {
                name: "tarjeta_propiedad_trasera",
                label: "Tarjeta propiedad trasera",
                type: "selectBox",
                row: 1,
                column: 3
            },
            {
                name: "revision_tegnomecanica",
                label: "Revision tecnomecanica",
                type: "selectBox",
                row: 1,
                column: 4
            },
            {
                name: "soat",
                label: "Soat",
                type: "selectBox",
                row: 1,
                column: 5
            },
            {
                name: "fecha_vencimiento_soat",
                label: "Fecha vencimiento Soat",
                type: "selectBox",
                row: 2,
                column: 0
            },
            {
                name: "foto_soat",
                label: "Foto soat",
                type: "selectBox",
                row: 2,
                column: 1
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "Configuracion datos conductor",
                type: "startGroup",
                icon: "",
                mode: "grid"
            },
            {
                name: "direccion_domicilio",
                label: "Direccion domicilio",
                type: "textField",
                row: 0,
                column: 0
            },
            {
                name: "telefono",
                label: "Telefono",
                type: "textField",
                row: 0,
                column: 1
            },
            {
                name: "afp",
                label: "Afp",
                type: "selectBox",
                row: 0,
                column: 2
            },
            {
                name: "eps",
                label: "Eps",
                type: "selectBox",
                row: 0,
                column: 3
            },
            {
                name: "hoja_vida",
                label: "Hoja vida",
                type: "selectBox",
                row: 0,
                column: 4
            },
            {
                name: "antecedentes",
                label: "Antecedentes",
                type: "selectBox",
                row: 0,
                column: 5
            },
            {
                name: "referencias_per_lab",
                label: "Referencia Per Lab",
                type: "selectBox",
                row: 1,
                column: 0
            },
            {
                name: "documento_imagen_respaldo",
                label: "Documento imagen respaldo",
                type: "selectBox",
                row: 1,
                column: 1
            },
            {
                name: "pedir_datos_propietario_vehiculo",
                label: "Pedir datos propietario vehiculo",
                type: "selectBox",
                row: 1,
                column: 2
            },
            {
                name: "arl",
                label: "Arl",
                type: "selectBox",
                row: 1,
                column: 3
            },
            {
                name: "documentos_adic",
                label: "Documentos Adic",
                type: "selectBox",
                row: 1,
                column: 4
            },
            {
                name: "pide_documentos_conductores",
                label: "Pide documentos conductores",
                type: "selectBox",
                row: 1,
                column: 5
            },
            {
                name: "",
                type: "endGroup"
            },

            {
                name: "Configuracion servicios",
                type: "startGroup",
                icon: "",
                mode: "grid"
            },

            {

                name: "usa_servicios",
                label: "Usa servicios",
                type: "selectBox",
                row: 0,
                column: 0
            },
            {
                name: "tipo_servicio",
                label: "Tipo servicio",
                type: "selectBox",
                row: 0,
                column: 1
            },
            {
                name: "servicios_para",
                label: "Servicios para",
                type: "selectBox",
                row: 0,
                column: 2
            },

            {
                name: "cobro_con",
                label: "Cobro con",
                type: "selectBox",
                row: 0,
                column: 3
            },

            {
                name: "cod_promocional",
                label: "Cod promocional",
                type: "selectBox",
                row: 0,
                column: 4
            },
            {
                name: "tipo_pago",
                label: "Tipo pago",
                type: "selectBox",
                row: 0,
                column: 5
            },
            {
                name: "paradas_adicional",
                label: "Paradas adicional",
                type: "selectBox",
                row: 1,
                column: 0
            },

            {
                name: "metros_para_aceptar_servicio",
                label: "Metros para aceptar servicio",
                type: "textField",
                row: 1,
                column: 1
            },
            {
                name: "metros_para_confirmar_llegada",
                label: "Metros para confirmar llegada",
                type: "textField",
                row: 1,
                column: 2
            },
            {
                name: "tarifa",
                label: "Tarifa",
                type: "selectBox",
                row: 1,
                column: 3
            },

            {
                name: "valor_minimo_pago_credito",
                label: "Valor minimo valor credito",
                mode: "money",
                type: "textField",
                row: 1,
                column: 4
            },
            {
                name: "app_para",
                label: "App para",
                type: "selectBox",
                row: 1,
                column: 5
            },
            {
                name: "mostrar_valor_conductor",
                label: "Mostrar valor conductor",
                type: "selectBox",
                row: 2,
                column: 0
            },

            {
                name: "cancela_conductor",
                label: "Cancela conductor",
                type: "selectBox",
                row: 2,
                column: 1
            },

            {
                name: "mostrar_direccion_destino",
                label: "Mostar direccion desctino",
                type: "selectBox",
                row: 2,
                column: 2
            },
            {
                name: "pide_vehiculo_conductores",
                label: "Pide vehiculo conductores",
                type: "selectBox",
                row: 2,
                column: 3
            },
            {
                name: "valor_minimo_retiro",
                label: "Valor minimo retiro",
                mode: "money",
                type: "textField",
                row: 2,
                column: 4
            },
            {
                name: "dias_maximo_pago",
                label: "Dias maximo pago",
                type: "textField",
                row: 2,
                column: 5
            },
            {
                name: "tope_maximo_pago",
                label: "Tope maximo pago",
                type: "textField",
                mode: "money",
                row: 3,
                column: 0
            },
            {
                name: "rango_modelo_vheiculo",
                label: "Rango modelo vehiculo",
                type: "textField",
                row: 3,
                column: 1
            },
            {
                name: "texto_boton_a_donde_vas",
                label: "Texto boton a donde vas",
                type: "textField",
                row: 3,
                column: 2
            },
            {
                name: "texto_boton_confirmar_abordaje",
                label: "Texto boton confirmar abordaje",
                type: "textField",
                row: 3,
                column: 3
            },
            {
                name: "texto_boton_llegada_destino",
                label: "Texto boton llegada destino",
                type: "textField",
                row: 3,
                column: 4
            },
            {
                name: "",
                type: "endGroup"
            }

        ];
        self.setFields(fields);

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });

        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        var data = {};
        data[""] = "Seleccione";
        data["AHORA"] = "Ahora";
        data["RESERVA"] = "Reserva";
        data["AMBOS"] = "Ambos";
        qxnw.utils.populateSelectFromArray(self.ui.servicios_para, data);

        var data = {};
        data[""] = "Seleccione";
        data["EFECTIVO"] = "Efectivo";
        data["CREDITO"] = "Credito";
        data["AMBOS"] = "Ambos";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_pago, data);

        var data = {};
        data[""] = "Seleccione";
        data["SI"] = "Si";
        data["NO"] = "No";
        qxnw.utils.populateSelectFromArray(self.ui.cod_promocional, data);
        qxnw.utils.populateSelectFromArray(self.ui.paradas_adicional, data);
        qxnw.utils.populateSelectFromArray(self.ui.marca, data);
        qxnw.utils.populateSelectFromArray(self.ui.modelo, data);
        qxnw.utils.populateSelectFromArray(self.ui.color, data);
        qxnw.utils.populateSelectFromArray(self.ui.imagen_vehi, data);
        qxnw.utils.populateSelectFromArray(self.ui.numero_puertas, data);
        qxnw.utils.populateSelectFromArray(self.ui.capacidad_pasajeros, data);
        qxnw.utils.populateSelectFromArray(self.ui.usar_descripcion_carroceria, data);
        qxnw.utils.populateSelectFromArray(self.ui.capacidad_carga_kg, data);
        qxnw.utils.populateSelectFromArray(self.ui.capacidad_volumen_m3, data);
        qxnw.utils.populateSelectFromArray(self.ui.tarjeta_propiedad_trasera, data);
        qxnw.utils.populateSelectFromArray(self.ui.revision_tegnomecanica, data);
        qxnw.utils.populateSelectFromArray(self.ui.afp, data);
        qxnw.utils.populateSelectFromArray(self.ui.eps, data);
        qxnw.utils.populateSelectFromArray(self.ui.referencias_per_lab, data);
        qxnw.utils.populateSelectFromArray(self.ui.documento_imagen_respaldo, data);
        qxnw.utils.populateSelectFromArray(self.ui.pedir_datos_propietario_vehiculo, data);
        qxnw.utils.populateSelectFromArray(self.ui.arl, data);
        qxnw.utils.populateSelectFromArray(self.ui.soat, data);
        qxnw.utils.populateSelectFromArray(self.ui.fecha_vencimiento_soat, data);
        qxnw.utils.populateSelectFromArray(self.ui.foto_soat, data);
        qxnw.utils.populateSelectFromArray(self.ui.tarifa, data);
        qxnw.utils.populateSelectFromArray(self.ui.documentos_adic, data);
        qxnw.utils.populateSelectFromArray(self.ui.usa_servicios, data);
//        qxnw.utils.populateSelectFromArray(self.ui.metros_para_aceptar_servicio, data);
//        qxnw.utils.populateSelectFromArray(self.ui.metros_para_confirmar_llegada, data);
        qxnw.utils.populateSelectFromArray(self.ui.pide_vehiculo_conductores, data);
        qxnw.utils.populateSelectFromArray(self.ui.pide_documentos_conductores, data);
        qxnw.utils.populateSelectFromArray(self.ui.mostrar_direccion_destino, data);
        qxnw.utils.populateSelectFromArray(self.ui.mostrar_valor_conductor, data);
        qxnw.utils.populateSelectFromArray(self.ui.hoja_vida, data);
        qxnw.utils.populateSelectFromArray(self.ui.antecedentes, data);
        qxnw.utils.populateSelectFromArray(self.ui.cancela_conductor, data);


        var data = {};
        data[""] = "Seleccione";
        data["TRAYECTO"] = "Trayecto";
        data["HORAS"] = "Horas";
        data["AMBOS"] = "Ambos";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_servicio, data);

        var data = {};
        data[""] = "Seleccione";
        data["TARIFA"] = "Tarifa";
        data["LIBRE"] = "Libre";
        qxnw.utils.populateSelectFromArray(self.ui.cobro_con, data);

        var data = {};
        data[""] = "Seleccione";
        data["CARGA"] = "Carga";
        qxnw.utils.populateSelectFromArray(self.ui.app_para, data);

        self.ui.app_para.addListener("changeSelection", function () {
            self.slotServicios();
        });
        self.setParamRecord();
    },

    destruct: function () {
    },

    members: {

        slotServicios: function slotServicios() {
            var self = this;
//            self.ui.app_para.setValue();
            if (self.ui.app_para == "CARGA") {
                var d = new maestros.forms.f_services();
                d.settings.accept = function () {

                };
                d.show();
            }

        },

        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros", true);
            rpc.setAsync(true);
            var func = function () {
                self.accept();
            };
            rpc.exec("Save", data, func);
        },
        setParamRecord: function setParamRecord() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros", true);
            rpc.setAsync(true);
            var func = function (r) {
                console.log(r);
                if (r) {
                    self.setRecord(r);
                }
            };
            rpc.exec("queryConfiguration", "", func);
        }
    }
});