qx.Class.define("maestros.lists.l_configuracion", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "Id",
                caption: "id"
            },
            {
                label: "Servicios Para",
                caption: "servicios_para"
            },
            {
                label: "Tipo Pago",
                caption: "tipo_pago"
            },
            {
                label: "Cod Promocional",
                caption: "cod_promocional"
            },
            {
                label: "Paradas Adicional",
                caption: "paradas_adicional"
            },
            {
                label: "Tipo Servicio",
                caption: "tipo_servicio"
            },
            {
                label: "Cobro Con",
                caption: "cobro_con"
            },
            {
                label: "Marca",
                caption: "marca"
            },
            {
                label: "Modelo",
                caption: "modelo"
            },
            {
                label: "Color",
                caption: "color"
            },
            {
                label: "Imagen Vehi",
                caption: "imagen_vehi"
            },
            {
                label: "Numero Puertas",
                caption: "numero_puertas"
            },
            {
                label: "Capacidad Pasajeros",
                caption: "capacidad_pasajeros"
            },
            {
                label: "Usar Descripcion Carroceria",
                caption: "usar_descripcion_carroceria"
            },
            {
                label: "Capacidad Carga Kg",
                caption: "capacidad_carga_kg"
            },
            {
                label: "Capacidad Volumen m3",
                caption: "capacidad_volumen_m3"
            },
            {
                label: "Tarjeta Propiedad Trasera",
                caption: "tarjeta_propiedad_trasera"
            },
            {
                label: "Revision Tecnomecánica",
                caption: "revision_tegnomecanica"
            },
            {
                label: "Direccion Domicilio",
                caption: "direccion_domicilio"
            },
            {
                label: "Telefono",
                caption: "telefono"
            },
            {
                label: "Afp",
                caption: "afp"
            },
            {
                label: "Eps",
                caption: "eps"
            },
            {
                label: "Referencia Per Lab",
                caption: "referencias_per_lab"
            },
            {
                label: "Documento imagen respaldo",
                caption: "documento_imagen_respaldo"
            },
            {
                label: "Pedir Datos Propietario Vehiculo",
                caption: "pedir_datos_propietario_vehiculo"
            },
            {
                label: "Arl",
                caption: "arl"
            },
            {
                label: "Soat",
                caption: "soat"
            },
            {
                label: "Fecha Vencimiento Soat",
                caption: "fecha_vencimiento_soat"
            },
            {
                label: "Foto Soat",
                caption: "foto_soat"
            },
            {
                label: "Tarifa",
                caption: "tarifa"
            },
            {
                label: "Documentos Adic",
                caption: "documentos_adic"
            },
            {
                label: "Usa Servicios",
                caption: "usa_servicios"
            },
            {
                label: "Metros Para Aceptar Servicio",
                caption: "metros_para_aceptar_servicio"
            },
            {
                label: "Metros para confirmar Llegada",
                caption: "metros_para_confirmar_llegada"
            },
            {
                label: "Pide Vehiculo Conductores",
                caption: "pide_vehiculo_conductores"
            },
            {
                label: "Pide Documentos Conductores",
                caption: "pide_documentos_conductores"
            },
            {
                label: "Mostar Direccion Desctino",
                caption: "mostrar_direccion_destino"
            },
            {
                label: "Valor Minimo valor Credito",
                caption: "valor_minimo_pago_credito"
            },
            {
                label: "App Para",
                caption: "app_para"
            },
            {
                label: "Mostar Valor Conductor",
                caption: "mostrar_valor_conductor"
            },
            {
                label: "Hoja Vida",
                caption: "hoja_vida"
            },
            {
                label: "Antecedentes",
                caption: "antecedentes"
            },
            {
                label: "Cancela Conductor",
                caption: "cancela_conductor"
            },
            {
                label: "Valor Minimo Retiro",
                caption: "valor_minimo_retiro"
            },
            {
                label: "Dias Maximo Pago",
                caption: "dias_maximo_pago"
            },
            {
                label: "Tope Maximo Pago",
                caption: "tope_maximo_pago"
            },
            {
                label: "Rango Modelo Vehiculo",
                caption: "rango_modelo_vheiculo"
            },
            {
                label: "exto Boton A donde Vas",
                caption: "texto_boton_a_donde_vas"
            },
            {
                label: "Texto Boton Confirmar Abordaje",
                caption: "texto_boton_confirmar_abordaje"
            },
            {
                label: "Texto Boton Llegada Destino",
                caption: "texto_boton_llegada_destino"
            }
        ];
        self.setColumns(columns);
        self.hideColumn("id");


        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });




    },
    destruct: function () {
    },
    members: {

        contextMenu: function contextMenu(pos) {
            var self = this;
            var data = self.selectedRecord();
            var up = qxnw.userPolicies.getUserData();
        },

//             applyFilters: function applyFilters(){
//             var self = this;
//             var data = {};
//             data.filters = self.getFiltersData();
//             var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros");
//             rpc.setAsync(true);
//             var func = function (r) {
//                self.setModelData(r);
//            };
//            rpc.exec("", data, func);
//        },

        slotNuevo: function slotNuevo() {
            var self = this;
            var d = new maestros.forms.f_configuracion();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
//             d.setModal(true);
        },

        slotEditar: function slotEditar() {
            var selt = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            var d = new maestros.forms.f_configuracion();
            d.setParamRecord();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();
        }

//        SlotEliminar: function slotEliminar() {
//            var self = this;
//            var r = self.selectedRecord();
//            if (typeof r == 'undefined') {
//                qxnw.utils.alert(self.tr("Seleccione un registro"));
//                return;
//            }
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros", true);
//            var func = function (r) {
//                self.removeSelectedRow();
//            };
//            rpc.exec("", r, func);
//
//        }

    }
});


