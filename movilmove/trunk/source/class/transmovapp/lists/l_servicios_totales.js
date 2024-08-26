qx.Class.define("transmovapp.lists.l_servicios_totales", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var t = main.getConfiguracion();
        self.conf = main.getConfiguracion();
        self.permisos = main.permisos_usuario;
        self.creado = false;

        self.classNameClean = "container_list_historico_" + qxnw.utils.getRandomName();
        self.className = "." + self.classNameClean;
//        console.log("self.className", self.className);

//        qxnw.config.setShowRpcDebug(true);

//        self.setSelectMultiCell(true);

//        qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", 20);
        var columns = [
//            {
//                label: "Ampliar",
//                caption: "ampliar",
//                type: "html",
//                visibleExtend: false
//            },
            {
                label: "Aprobar cotización",
                caption: "aprobar",
                type: "html",
                visibleExtend: false
            },
            {
                label: "Rechazar cotización",
                caption: "rechazar",
                type: "html",
                visibleExtend: false
            },
            {
                label: "Mes",
                caption: "mes",
                visibleExtend: false
            },
            {
                label: "ID",
                caption: "id",
                visibleExtendGroup: "Datos generales",
                visibleExtendGroupStart: "Datos generales"
            },
            {
                label: "País origen",
                caption: "pais_origen",
                visibleExtendGroup: "Datos generales",
                visibleExtendGroupStart: "Datos generales"
            },
            {
                label: "BookingCode",
                caption: "booking_id_journey",
                visibleExtendGroup: "Datos generales"
            },
            {
                label: "ID Booking",
                caption: "booking_id_real_journey",
                visibleExtend: false
            },
            {
                label: "Origen",
                caption: "creado_por_pc",
                type: "html",
                mode: "toolTip",
                visibleExtendGroup: "Datos generales"
            },
            {
                label: "TRF",
                caption: "trf"
            },
            {
                label: "TRF",
                caption: "trf_text"
            },
            {
                label: "Paradas/pasajeros",
                caption: "paradas_adicionales_iniciales_creacion",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Paradas / Pasajeros",
                caption: "paradas_adicionales_iniciales_creacion_html",
                type: "html",
                mode: "toolTip",
                visibleExtend: false
            },
            {
                label: "Estado",
                caption: "estado"
            },
            {
                label: "Status",
                caption: "estatus",
                type: "html",
                mode: "toolTip",
                visibleExtend: false
            },
            {
                label: "Fecha servicio",
                caption: "hora_fecha_servicio",
                type: "timeField",
                mode: "toolTip"
            },
            {
                label: "Fecha",
                caption: "fecha",
                mode: "toolTip",
                type: "timeField"
            },
            {
                label: "Hora",
                caption: "hora",
                mode: "toolTip",
                type: "timeField"
            },
            {
                label: "Fecha de creación",
                caption: "fecha_creacion",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Tipo/Servicio",
                caption: "tipo_servicio"
            },
            {
                label: "Urbano/Intermunicipal",
                caption: "tipo_urbanrural"
            },
            {
                label: "Tipo",
                type: "html",
                caption: "tipo_servicio_html",
                visibleExtend: false
            },
            {
                label: "Servicio ID",
                caption: "subcategoria_servicio",
                visibleExtend: false
            },
            {
                label: "Servicio",
                caption: "subcategoria_servicio_text",
                mode: "toolTip"
            },
            {
                label: "Sub Servicio",
                caption: "subservicio_text",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Sentido",
                caption: "sentido",
                visibleExtendGroupEnd: ""
            },
            {
                label: "Vehículo",
                caption: "vehiculo_html",
                type: "html",
                mode: "toolTip",
                visibleExtend: false
            },
            {
                label: "Conductor-status",
                caption: "conductor_html",
                type: "html",
                mode: "toolTip",
                visibleExtend: false
            },
            {
                label: "<span class='divOrigenDest divOrigenA'>A</span>Punto partida",
                caption: "origen_html",
                type: "html",
                mode: "toolTip",
                visibleExtend: false
            },
            {
                label: "Dirección partida",
                caption: "origen",
                visibleExtendGroupStart: "Origen - Destino"
            },
            {
                label: "Ciudad partida",
                caption: "ciudad_origen",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Pais partida",
                caption: "pais_origen",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "<span class='divOrigenDest divOrigenB'>B</span>Punto destino",
                caption: "destino_html",
                type: "html",
                mode: "toolTip",
                visibleExtend: false
            },
            {
                label: "Dirección destino",
                caption: "destino",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Ciudad destino",
                caption: "ciudad_destino",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "# Vuelo",
                caption: "vuelo_numero",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Observaciones ubicación",
                caption: "observacion_ultima_ubicacion",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Observaciones cliente recogida",
                caption: "datos_vehiculo_elegido",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Observaciones",
                caption: "observaciones_servicio",
                type: "html",
                mode: "toolTip"
            },
            {
                label: "Operario ID",
                caption: "operario",
                visibleExtend: false
            },
            {
                label: "Operario",
                caption: "operario_text"
            },
            {
                label: "Forma de pago",
                caption: "tipo_pago",
                mode: "toolTip"
            },
            {
                label: "Forma de pago",
                caption: "tipo_pago_id"
            },
            {
                label: "Flota ID",
                caption: "flota_id",
                visibleExtend: false
            },
            {
                label: "Flota",
                caption: "flota_text",
                mode: "toolTip",
                visibleExtendGroupEnd: ""
            },
            {
                label: "Usuario APP ID",
                caption: "id_usuario",
                type: "html",
                mode: "toolTip",
                colorHeader: "#4d90fe",
                visibleExtend: false
            },
            {
                label: "Usuario APP Nombre",
                caption: "nombre_cliente",
                type: "html",
                mode: "toolTip",
                colorHeader: "#4d90fe",
                visibleExtendGroupStart: "Datos pasajero"
            },
            {
                label: "Usuario APP teléfono móvil",
                caption: "celular",
                type: "html",
                mode: "toolTip",
                colorHeader: "#4d90fe"//azul
            },
            {
                label: "Usuario APP usuario",
                caption: "usuario",
                type: "html",
                mode: "toolTip",
                colorHeader: "#4d90fe"//azul
            },
            {
                label: "Usuario APP email",
                caption: "email",
                type: "html",
                mode: "toolTip",
                colorHeader: "#4d90fe"//azul
            },
            {
                label: "Usuario APP empresa",
                caption: "empresa_cliente",
                type: "html",
                mode: "toolTip",
                colorHeader: "#4d90fe"//azul
            },
            {
                label: "Usuario APP Empresa ID",
                caption: "bodega",
                colorHeader: "#4d90fe",
                visibleExtend: false
            },
            {
                label: "Usuario APP Empresa",
                caption: "bodega_text",
                mode: "toolTip",
                colorHeader: "#4d90fe"//azul
            },
            {
                label: "Empresa a facturar ID",
                caption: "cliente_empresa_id",
                mode: "toolTip",
                colorHeader: "#689967", //azul
                visible: false,
                visibleExtend: false
            },
            {
                label: "Empresa a facturar",
                caption: "cliente_empresa_id_text",
                mode: "toolTip",
                colorHeader: "#689967",
                visibleExtend: false
            },
            {
                label: "Sede a facturar ID",
                caption: "cliente_sede_id",
                mode: "toolTip",
                colorHeader: "#689967", //azul
                visible: false,
                visibleExtend: false
            },
            {
                label: "Sede a facturar",
                caption: "cliente_sede_id_text",
                mode: "toolTip",
                colorHeader: "#689967",
                visibleExtendGroupEnd: ""
            },
            {
                label: "Conductor nombre",
                caption: "conductor",
                type: "html",
                mode: "toolTip",
                colorHeader: "#FF8000",
                visibleExtendGroupStart: "Datos Conductor"
            },
            {
                label: "Conductor ID",
                caption: "conductor_id",
                colorHeader: "#FF8000",
                visibleExtend: false
            },
            {
                label: "Conductor usuario",
                caption: "conductor_usuario",
                colorHeader: "#FF8000"//orange
            },
            {
                label: "Vehículo ID",
                caption: "vehiculo",
                mode: "toolTip",
                colorHeader: "#FF8000"//orange
            },
            {
                label: "Placa",
                caption: "placa",
                type: "html",
                mode: "toolTip",
                colorHeader: "#FF8000"//orange
            },
            {
                label: "Marca",
                caption: "vehiculo_text",
                type: "html",
                mode: "toolTip",
                colorHeader: "#FF8000",
                visibleExtendGroupEnd: ""
            },
            {
                label: "(EST) Valor total",
                caption: "valor",
                type: "money",
                mode: "toolTip",
                colorHeader: "#ff71a9",
                visibleExtendGroupStart: "Valores Estimados"
            },
            {
                label: "(EST) Valor transferz",
                caption: "valor_viaje_booking",
                type: "money",
                mode: "toolTip",
                colorHeader: "#ff71a9"
            },
            {
                label: "(EST) Valor total tiempo",
                caption: "valorminutos",
                mode: "toolTip",
                type: "money",
                colorHeader: "#ff71a9"
            },
            {
                label: "(EST) Valor total distancia",
                caption: "valordistancia",
                mode: "toolTip",
                type: "money",
                colorHeader: "#ff71a9"
            },
            {
                label: "(EST) Tiempo total mins",
                caption: "tiempo_estimado",
                mode: "toolTip",
                colorHeader: "#ff71a9"
            },
            {
                label: "(EST) Distancia total mtrs",
                caption: "total_metros",
                mode: "toolTip",
                colorHeader: "#ff71a9",
                visibleExtendGroupEnd: ""
            },
            {
                label: "Valor Final Servicio",
                caption: "valor_total_servicio",
                type: "money",
                mode: "toolTip",
                colorHeader: "#2fff00",
                visibleExtendGroupStart: "Valores Reales Finales"
            },
            {
                label: "Forma Cobro Final Automatico",
                caption: "formaCobroFinalAutomatico_text",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Moneda",
                caption: "moneda",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Tipo tarifa",
                caption: "tarifa",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Descuento Aplicado",
                caption: "descuento_aplicado",
                type: "money",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Valor tarifa mínima",
                caption: "valor_tarifa_minima",
                type: "money",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Valor unidad tiempo",
                caption: "valor_unidad_tiempo",
                mode: "toolTip",
                type: "money",
                colorHeader: "#2fff00"
            },
            {
                label: "Valor unidad distancia",
                caption: "valor_unidad_metros",
                mode: "toolTip",
                type: "money",
                colorHeader: "#2fff00"
            },
            {
                label: "Valor total tiempo (FINAL)",
                caption: "valor_final_tiempo",
                mode: "toolTip",
                type: "money",
                colorHeader: "#2fff00"
            },
            {
                label: "Valor total distancia (FINAL)",
                caption: "valor_final_distancia",
                mode: "toolTip",
                type: "money",
                colorHeader: "#2fff00",
                visibleExtendGroupEnd: ""
            },
            {
                label: "Metros cobro recargo",
                caption: "metros_cobro_recargo",
                mode: "toolTip",
                colorHeader: "#2fff00",
                visibleExtendGroupStart: "Valores Reales Finales"
            },
            {
                label: "Metros cobro peaje",
                caption: "metros_cobro_peaje",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Aplica peaje",
                caption: "aplico_peaje",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Aplica recargo",
                caption: "aplico_recargo",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Valor espera",
                caption: "valor_espera",
                mode: "toolTip",
                type: "money",
                colorHeader: "#2fff00"
            },
            {
                label: "Impuesto porcentaje(%)",
                caption: "iva_porcentaje",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Impuesto valor final (IVA)",
                caption: "iva",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "% empresa ganacia",
                caption: "porcentaje_empresa",
                type: "money",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "% conductor ganancia",
                caption: "porcentaje_proveedor",
                type: "money",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Utilidad conductor",
                caption: "utilidad_conductor",
                mode: "toolTip",
                type: "money",
                colorHeader: "#2fff00"
            },
            {
                label: "Utilidad empresa",
                caption: "utilidad_empresa",
                mode: "toolTip",
                type: "money",
                colorHeader: "#2fff00"
            },
            {
                label: "Usuario liquidación",
                caption: "liquida_usuario",
                mode: "toolTip",
                colorHeader: "#2fff00",
                visibleExtendGroupEnd: ""
            },
            {
                label: "Fecha liquidación",
                caption: "liquida_fecha",
                mode: "toolTip",
                colorHeader: "#2fff00",
                visibleExtendGroupStart: "Tiempos de viaje"
            },
            {
                label: "Observaciones liquidación",
                caption: "observaciones_liquidacion",
                mode: "toolTip",
                colorHeader: "#2fff00"
            },
            {
                label: "Fecha servicio",
                caption: "hora_fecha",
                type: "html",
                mode: "toolTip",
                colorHeader: "#8bc4ef"
            },
            {
                label: "Fecha acepta servicio driver",
                caption: "fecha_conductor",
                type: "html",
                mode: "toolTip",
                colorHeader: "#8bc4ef"
            },
            {
                label: " Hora llegada origen driver",
                caption: "hora_llegada",
                type: "html",
                mode: "toolTip",
                colorHeader: "#8bc4ef"
            },
            {
                label: " Hora abordaje",
                caption: "hora_inicio",
                type: "html",
                mode: "toolTip",
                colorHeader: "#8bc4ef"
            },
            {
                label: " Hora finaliza servicio driver",
                caption: "hora_fin_servicio",
                type: "html",
                mode: "toolTip",
                colorHeader: "#8bc4ef"
            },
            {
                label: "Fecha finaliza driver viaje",
                caption: "fecha_finaliza_servicio_driver",
                mode: "toolTip",
                colorHeader: "#8bc4ef"
            },
            {
                label: "Tiempo de espera (origen) mins",
                caption: "tiempo_espera",
                mode: "toolTip",
                colorHeader: "#8bc4ef"
            },
            {
                label: "Tiempo total final (abordo-finaliza) (Mins)",
                caption: "tiempo",
                mode: "toolTip",
                colorHeader: "#8bc4ef"
            },
            {
                label: "Tiempo total del viaje (acepta-finaliza) (Mins)",
                caption: "tiempo_finalizado",
                mode: "toolTip",
                colorHeader: "#8bc4ef"
            },
            {
                label: "Distancia total final mtrs",
                caption: "total_metros_final",
                mode: "toolTip",
                colorHeader: "#8bc4ef",
                visibleExtendGroupEnd: ""
            },
            {
                label: "Calificación cliente",
                caption: "calificacion_cliente",
                colorHeader: "#cddc39",
                visibleExtendGroupStart: "Calificaciones - comentarios - novedades - cancelaciones"
            },
            {
                label: "Comentarios calificación cliente",
                caption: "calificacion_cliente_comentarios",
                colorHeader: "#cddc39"
            },
            {
                label: "Calificación conductor",
                caption: "calificacion_conductor",
                colorHeader: "#cddc39"
            },
            {
                label: "Comentarios calificación conductor",
                caption: "calificacion_conductor_comentarios",
                colorHeader: "#cddc39"
            },
            {
                label: "Cancelado por",
                caption: "cancelado_por",
                type: "html",
                mode: "toolTip",
                colorHeader: "gray"
            },
            {
                label: "Usuario cancela",
                caption: "usuario_cancela",
                type: "html",
                mode: "toolTip",
                colorHeader: "gray"
            },
            {
                label: "Cancelado fecha",
                caption: "cancelado_fecha",
                type: "html",
                mode: "toolTip",
                colorHeader: "gray"
            },
            {
                label: "Cancelado motivo",
                caption: "cancelado_motivo",
                type: "html",
                mode: "toolTip",
                colorHeader: "gray"
            },
            {
                label: "Cancelado notas",
                caption: "cancelado_notas",
                type: "html",
                mode: "toolTip",
                colorHeader: "gray"
            },
            {
                label: "Observación Cancelado pasajero",
                caption: "observacion_cancelado_usu",
                type: "html",
                mode: "toolTip",
                colorHeader: "gray"
            },
            {
                label: "Observación Cancelado conductor",
                caption: "observacion_cancelado_con",
                type: "html",
                mode: "toolTip",
                colorHeader: "gray"
            },
            {
                label: "Observación Cancelado admin OP",
                caption: "observacion_cancelado_adm",
                type: "html",
                mode: "toolTip",
                colorHeader: "gray"
            },
            {
                label: "Motivo rechazo",
                caption: "motivo_rechazo",
                type: "html"
            },
            {
                label: "Motivo rechazo",
                caption: "motivo_rechazo_text",
                type: "html"
            },
            {
                label: "Observaciones rechazo",
                caption: "observaciones_rechazo",
                type: "html"
            },
            {
                label: "Fecha rechazo",
                caption: "fecha_rechazo",
                type: "timeField",
                mode: "toolTip",
                visibleExtendGroupEnd: ""
            },
            {
                label: "Paradas adicionales totales",
                caption: "paradas_adicional_numero_total",
                mode: "toolTip",
                colorHeader: "yellow",
                visibleExtendGroupStart: "Otros"
            },
            {
                label: "Paradas adicionales valor unitario",
                caption: "paradas_adicional_valor_unitario",
                mode: "toolTip",
                colorHeader: "yellow"
            },
            {
                label: "Paradas adicionales valor total",
                caption: "paradas_adicional_valor_total",
                mode: "toolTip",
                colorHeader: "yellow"
            },
            {
                label: "Firma recibido",
                caption: "firma_recibido",
                type: "image",
                mode: "expand"
            },
//            {
//                label: "Estados del viaje",
//                caption: "stated_travel",
//                type: "html",
//                mode: "toolTip"
//            },
            {
                label: "Centro de costo ID",
                caption: "centro_costo",
                mode: "toolTip"
            },
            {
                label: "Rechazado por conductores (IDS)",
                caption: "drivers_rechazan"
            },
            {
                label: "Otros conductores IDS",
                caption: "otros_conductores"
            },
            {
                label: "ID grupo servicios",
                caption: "id_relation_group_travel"
            },
            {
                label: "Número expediente",
                caption: "numero_expediente"
            },
            {
                label: self.tr("Documento Adjunto"),
                caption: "adjunto_cotizacion",
                type: "image",
                mode: "phpthumb.expand"
            },
            {
                label: self.tr("Documento Adjunto firmado"),
                caption: "adjunto_cotizacion_aprobada",
                type: "image",
                mode: "phpthumb.expand"
            },
            {
                label: "Centro de costo",
                caption: "centro_costo_text",
                mode: "toolTip",
                visibleExtendGroupEnd: ""
            }
//            ,
//            {
//                label: "Remesa",
//                caption: "remesa"
//            }
            ,
            {
                label: "Latitud actual driver",
                caption: "latitud_actual",
                colorHeader: "#00f0ff",
                visibleExtendGroupStart: "Coordenadas"
            },
            {
                label: "Longitud actual driver",
                caption: "longitud_actual",
                colorHeader: "#00f0ff",
                visibleExtendGroupStart: "Coordenadas"
            },
            {
                label: "Latitud Origen",
                caption: "latitudOri",
                colorHeader: "#00f0ff",
                visibleExtendGroupStart: "Coordenadas"
            },
            {
                label: "longitud Origen",
                caption: "longitudOri",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "Latitud Destino",
                caption: "latitudDes",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "Longitud Destino",
                caption: "longitudDes",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "Latitud acepta servicio driver",
                caption: "latitudAceptaService",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "longitud acepta servicio driver",
                caption: "longitudAceptaService",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "Latitud confirma llegada driver",
                caption: "latitudConfirmaLlegada",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "longitud confirma llegada driver",
                caption: "longitudConfirmaLlegada",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "Latitud confirma abordaje",
                caption: "latitudConfirmaAbordaje",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "longitud confirma abordaje",
                caption: "longitudConfirmaAbordaje",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "Latitud finaliza servicio",
                caption: "latitudFinalizaServicio",
                colorHeader: "#00f0ff"//azul celeste
            },
            {
                label: "longitud finaliza servicio",
                caption: "longitudFinalizaServicio",
                colorHeader: "#00f0ff",
                visibleExtendGroupEnd: ""
            }
        ];

        if (t.usa_codigos_verificacion_servicio === "SI") {
            columns.push(
                    {
                        label: "Código inicio",
                        caption: "code_verifi_service"
                    },
                    {
                        label: "Código fin",
                        caption: "code_verifi_service_fin"
                    }
            );
        }

        if (t.app_para == "CARGA") {
            columns.push(
                    {
                        label: "Descripción carga",
                        caption: "descricion_carga"
                    },
                    {
                        label: "Número Auxiliares",
                        caption: "numero_auxiliares"
                    },
                    {
                        label: "Salida periferia",
                        caption: "salida_periferia"
                    },
                    {
                        label: "Despacho",
                        caption: "despacho"
                    },
                    {
                        label: "Retorno",
                        caption: "retorno"
                    },
                    {
                        label: "Cargue",
                        caption: "cargue"
                    },
                    {
                        label: "Descargue",
                        caption: "descargue"
                    },
                    {
                        label: "Contacto recogida",
                        caption: "contacto_recogida"
                    },
                    {
                        label: "Telefono recogida",
                        caption: "telefono_recogida"
                    },
                    {
                        label: "Observaciones recogida",
                        caption: "observaciones_recogida"
                    },
                    {
                        label: "Contacto entrega",
                        caption: "contacto_entrega"
                    },
                    {
                        label: "Telefono entrega",
                        caption: "telefono_entrega"
                    },
                    {
                        label: "Observaciones entrega",
                        caption: "observaciones_entrega"
                    },
                    {
                        label: "Cantidad",
                        caption: "cantidad"
                    },
                    {
                        label: "Volumen",
                        caption: "volumen"
                    },
                    {
                        label: "Peso",
                        caption: "peso"
                    },
                    {
                        label: "Empaque",
                        caption: "empaque"
                    },
                    {
                        label: "Valor declarado",
                        caption: "valor_declarado"
                    },
                    {
                        label: "Código autorizacion compra",
                        caption: "cod_compra"
                    }
            );
        }

        self.columnsForm = columns;
        self.setColumns(columns);
        var up = qxnw.userPolicies.getUserData();

        self.hideColumn("flota_id");
        self.hideColumn("bodega_text");
        self.hideColumn("empresa_cliente");
        self.hideColumn("origen");
        self.hideColumn("booking_id_real_journey");
//        self.hideColumn("ciudad_origen");
        self.hideColumn("destino");
//        self.hideColumn("ciudad_destino");
        self.hideColumn("subservicio_text");
        self.hideColumn("fecha_creacion");
        self.hideColumn("tipo_servicio");
        self.hideColumn("paradas_adicionales_iniciales_creacion");
        self.hideColumn("operario");
        self.hideColumn("vehiculo");
        self.hideColumn("conductor_id");
        self.hideColumn("bodega");
        self.hideColumn("subcategoria_servicio");
        self.hideColumn("centro_costo");
        self.hideColumn("estado");
        self.hideColumn("otros_conductores");
        self.hideColumn("cliente_empresa_id");
        self.hideColumn("cliente_sede_id");
        self.hideColumn("id_usuario");
        self.hideColumn("hora_fecha_servicio");
        self.hideColumn("motivo_rechazo");
        self.hideColumn("motivo_rechazo_text");
        self.hideColumn("fecha_rechazo");
        self.hideColumn("observaciones_rechazo");
        self.hideColumn("tipo_pago_id");
        self.hideColumn("trf");
        if (up.profile.toString() == "1234") {
            self.hideColumn("valor");
            self.hideColumn("descuento_aplicado");
            self.hideColumn("valor_tarifa_minima");
            self.hideColumn("valor_total_servicio");
            self.hideColumn("valor_unidad_tiempo");
            self.hideColumn("valor_unidad_metros");
            self.hideColumn("valordistancia");
            self.hideColumn("valorminutos");
            self.hideColumn("metros_cobro_recargo");
            self.hideColumn("valor_espera");
            self.hideColumn("iva_porcentaje");
            self.hideColumn("porcentaje_empresa");
            self.hideColumn("porcentaje_proveedor");
            self.hideColumn("utilidad_conductor");
            self.hideColumn("utilidad_empresa");

        }
        self.hideColumn("metros_cobro_peaje");
        self.hideColumn("aplico_peaje");

        if (self.conf.booking_activo != "SI") {
//            if (self.permisos.ver_booking != "true") {
            self.hideColumn("booking_id_journey");
            self.hideColumn("valor_viaje_booking");
//            }
        }
        self.hideColumn("latitudOri");
        self.hideColumn("longitudOri");
        self.hideColumn("latitudDes");
        self.hideColumn("longitudDes");
        self.hideColumn("latitudAceptaService");
        self.hideColumn("longitudAceptaService");
        self.hideColumn("latitudConfirmaLlegada");
        self.hideColumn("longitudConfirmaLlegada");
        self.hideColumn("latitudConfirmaAbordaje");
        self.hideColumn("longitudConfirmaAbordaje");
        self.hideColumn("latitudFinalizaServicio");
        self.hideColumn("longitudFinalizaServicio");


//        self.table.getTableColumnModel().setColumnWidth(0, 50);
//        self.table.getTableColumnModel().setColumnWidth(1, 60);
//        self.table.getTableColumnModel().setColumnWidth(3, 80);
//        self.table.getTableColumnModel().setColumnWidth(3, 50);
//        self.table.getTableColumnModel().setColumnWidth(4, 50);
//        self.table.getTableColumnModel().setColumnWidth(5, 60);

        self.table.setRowHeight(30);


        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Buscar...",
                type: "textField"
            },
            {
                name: "empresa",
                caption: "empresa",
                label: "Empresa cliente",
                type: "selectTokenField"
            },
            {
                name: "ciudad_origen",
                caption: "ciudad_origen",
                label: "Ciudad partida",
//                type: "selectTokenField"
                type: "textField"
            },
            {
                name: "ciudad_destino",
                caption: "ciudad_destino",
                label: "Ciudad destino",
//                type: "selectTokenField"
                type: "textField"
            },
            {
                name: "estado",
                caption: "estado",
                label: "Estado",
                type: "selectBox"
            },
            {
                name: "origen_estado",
                caption: "origen_estado",
                label: "Origen",
                type: "selectBox"
            },
            {
                name: "fecha_inicio",
                caption: "fecha_inicio",
                label: "Fecha Inicial",
                required: true,
                type: "dateField"
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: "Fecha Final",
                required: true,
                type: "dateField"
            },
            {
                name: "ids",
                caption: "ids",
                label: "id",
                visible: false,
                type: "textField"
            }
//            ,
//            {
//                name: "calendar",
//                caption: "calendar",
//                label: "Calendario",
//                type: "button"
//            }
        ];

        filters.push(
//                {
//                    name: "booking_offers",
//                    caption: "booking_offers",
//                    label: "Booking",
//                    type: "button"
//                },
//                {
//                    name: "booking_accepts",
//                    caption: "booking_accepts",
//                    label: "Booking accepted",
//                    type: "button"
//                },
//                {
//                    name: "mapa_conductores",
//                    caption: "mapa_conductores",
//                    label: "Mapa conductores",
//                    type: "button"
//                }
                );
        self.createFilters(filters);

        if (!main.isCustomer()) {
            self.ui.empresa.addListener("loadData", function (e) {
                var data = {};
                data.token = e.getData();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
                rpc.setAsync(true);
                var func = function (r) {
                    self.ui.empresa.setModelData(r);
                };
                rpc.exec("populateTokenClientes", data, func);
            }, this);
        } else {
            if (main.evalueData(up.bodega)) {
                var item = {
                    id: up.bodega,
                    nombre: "My company"
                };
                self.ui.empresa.addToken(item);
            } else {
                qxnw.utils.information("Este usuario no tiene configurado una empresa de cliente");
            }
        }

        self._up = qxnw.userPolicies.getUserData();
        console.log(self._up);
        if (self._up.profile != 1232) {
            self.hideColumn("aprobar");
            self.hideColumn("rechazar");
        }


        self.table.addListener("cellTap", function (e) {
            var sl = self.selectedRecord();
            var col = e.getColumn();
            console.log("col", col);
//            if (col == 0) {
//                self.slotAmpliar();
//            }
            console.log(sl);
            if (self._up.profile == 1232 && sl.estado == 'COTIZACION_CONFIRMADA') {
                if (col == 1) {
                    self.slotRechazar('rechazar');
                } else
                if (col == 0) {
                    var dat = self.selectedRecord();
                    var d = new transmovapp.forms.f_confirma_cotizacion_cliente(dat);
//                    d.ui.tiempo.setVisibility("excluded");
//                d.ui.valor_final.setVisibility("excluded");
                    d.ui.valor_final.setEnabled(false);
                    d.ui.tiempo.setEnabled(false);
                    d.ui.total_metros_final.setEnabled(false);
                    d.ui.valor_final.setValue(sl.valor_total_servicio);
                    d.ui.recogiendo.setValue(sl.valor_total_servicio);


                    d.getChildControl("close-button").addListener("click", function () {
                        self.applyFilters();
                    });
                    d.settings.accept = function () {
                        self.applyFilters();
                    };
//                d.maximize();
                    d.setWidth(700);
                    d.setHeight(600);
                    d.setModal(true);
                    d.show();
                }
            } else {
                return;
            }
        });
        /*
         self.ui.ciudad_origen.addListener("loadData", function (e) {
         var data = {};
         data.token = e.getData();
         var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
         rpc.setAsync(true);
         var func = function (r) {
         self.ui.ciudad_origen.setModelData(r);
         };
         rpc.exec("populateTokenCiudades", data, func);
         }, this);
         //        self.ui.ciudad_origen.addListener("addItem", function (e) {
         //            var val = e.getData();
         //        }, this);
         self.ui.ciudad_destino.addListener("loadData", function (e) {
         var data = {};
         data.token = e.getData();
         var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
         rpc.setAsync(true);
         var func = function (r) {
         self.ui.ciudad_destino.setModelData(r);
         };
         rpc.exec("populateTokenCiudades", data, func);
         }, this);
         //        self.ui.ciudad_destino.addListener("addItem", function (e) {
         //            var val = e.getData();
         //        }, this);
         */


        self.addListener("appear", function () {
            if (!self.creado) {

                qx.bom.element.Class.add(self.getContentElement().getDomElement(), self.classNameClean);

//                var fecha = new Date();
//                var faño = fecha.getFullYear();
//                var fsmes = fecha.getMonth();
//                var fsdia = fecha.getDate();
//                self.ui.fecha_final.setValue(new Date());
//                self.ui.fecha_inicio.setValue(faño + "-" + fsmes + "-" + fsdia);
//                self.ui.fecha_final.setValue("");
//                self.ui.fecha_inicio.setValue("");
                self.ui.estado.setValue("");
                self.ui.origen_estado.setValue("");
                var t = new qx.event.Timer(1000);
                t.start();
                t.addListener("interval", function (e) {
                    this.stop();
                    self.applyFilters();
                });
            }
            self.creado = true;
        });

        var data = {};
        data[""] = "TODOS";
        data["EN_SERVICIO"] = "EN SERVICIO ACTIVO";
        data["SOLICITUD"] = "SOLICITUD";
        data["COTIZACION"] = "COTIZACION";
        data["ACEPTADO_RESERVA"] = "ACEPTADO RESERVA";
        data["ASIGNADO"] = "ASIGNADO";
//        data["DESPLAZANDOSE_AL_PUNTO"] = "DESPLAZANDOSE AL PUNTO";
//        data["INICIA_SERVICIO"] = "INICIA SERVICIO";
        data["EN_RUTA"] = "EN_RUTA - DESPLAZANDOSE AL PUNTO DE PARTIDA";
        data["EN_SITIO"] = "EN_SITIO - ESPERANDO EN PUNTO DE PARTIDA";
        data["ABORDO"] = "ABORDO - DIRIGE A DESTINO";
        data["LLEGADA_DESTINO"] = "LLEGADA DESTINO- FINALIZADO";
        data["SIN_ATENDER"] = "SIN ATENDER";
        data["SIN_ATENDER_ARCHIVADO"] = "SIN ATENDER ARCHIVADO";
        data["CANCELADO_POR_CONDUCTOR"] = "CANCELADO POR CONDUCTOR";
        data["CANCELADO_POR_ADMIN"] = "CANCELADO POR ADMINISTRADOR";
        data["CANCELADO_POR_USUARIO"] = "CANCELADO POR USUARIO";
        data["CANCELADO_POR_USUARIO"] = "CANCELADO POR USUARIO";
        if (self.permisos.ver_booking == "true" || self.conf.booking_activo == "SI") {
            data["CANCELLED_FREE"] = "CANCELLED_FREE";
            data["CANCELLED_WITH_COSTS"] = "CANCELLED_WITH_COSTS";
        }
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);


        var data = {};
        data[""] = "TODOS";
        data["Back"] = "Desde plataforma PC";
        data["AppPax"] = "Aplicación pasajero";
        data["Booking"] = "Booking";
        qxnw.utils.populateSelectFromArray(self.ui.origen_estado, data);

        self.ui.unSelectButton.addListener("click", function () {
            self.clearSelection();
        });
//        self.ui.selectAllButton.addListener("click", function () {
//            self.selectAll();
//        });


        qxnw.utils.addClassToElement(self.ui.updateButton, "btn_blueAdmi_counter");
        self.ui.updateButton.setLabel(self.tr("0"));
//        qxnw.utils.addClassToElement(self.ui.updateButton, "btn_blueAdmi");
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });

        self.ui.selectAllButton.setEnabled(true);

//        self.ui.emailButton.setVisibility("excluded");
        self.ui.printButton.setVisibility("excluded");
//        self.ui.deleteButton.setVisibility("excluded");

//        self.ui.deleteButton.setIcon(qxnw.config.execIcon("zoom-fit-best"));
//        qxnw.utils.addClassToElement(self.ui.deleteButton, "btn_redAdmi");
//        qxnw.utils.addClassToElement(self.ui.deleteButton, "btn_others");
//        self.ui.deleteButton.setLabel(self.tr("Mapa"));
//        self.ui.deleteButton.setShow("both");
//        self.ui.deleteButton.setMaxWidth(70);
//        self.ui.deleteButton.setMinWidth(70);
//        self.ui.deleteButton.setMaxHeight(30);
//        self.ui.deleteButton.setMinHeight(30);
//        self.ui.deleteButton.addListener("click", function () {
//            var d = new transmovapp.forms.f_mapa_conductores();
//            d.slotUbicaciones();
//            d.setWidth(1100);
//            d.setHeight(640);
//            d.show();
//        });

        self.ui.emailButton.setLabel(self.tr("Nueva versión"));
//        self.ui.emailButton.setShow("both");
        self.ui.emailButton.setMaxWidth(100);
        self.ui.emailButton.setMinWidth(100);
//        self.ui.emailButton.setMaxHeight(30);
//        self.ui.emailButton.setMinHeight(30);
        self.ui.emailButton.addListener("click", function () {
            var d = new transmovapp.lists.l_servicios_totales_v2();
            d.setParamRecord();
            main.addSubWindow("Histórico viajes (V.new)", d);
        });

        self.ui.editButton.setIcon(qxnw.config.execIcon("zoom-fit-best"));
        qxnw.utils.addClassToElement(self.ui.editButton, "btn_redAdmi");
        qxnw.utils.addClassToElement(self.ui.editButton, "btn_others");
        self.ui.editButton.setLabel(self.tr("Abordaje"));
        self.ui.editButton.setShow("both");
        self.ui.editButton.setMaxWidth(90);
        self.ui.editButton.setMinWidth(90);
        self.ui.editButton.setMaxHeight(30);
        self.ui.editButton.setMinHeight(30);
        self.ui.editButton.addListener("click", function () {
            main.slotParadasAdicionales();
        });

        qxnw.utils.addClassToElement(self.ui.newButton, "btn_blueAdmi");
        self.ui.newButton.setLabel(self.tr("Nuevo"));
        self.ui.newButton.setShow("both");
        self.ui.newButton.setMaxWidth(90);
        self.ui.newButton.setMinWidth(90);
        self.ui.newButton.setMaxHeight(30);
        self.ui.newButton.setMinHeight(30);
        self.ui.newButton.addListener("click", function () {
            var d = new enrutamiento.tree.enrutamiento();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.maximize();
            d.setModal(true);
            d.show();
        });

//        qxnw.utils.addClassToElement(self.ui.deleteButton, "btn_blueAdmi");
//        self.ui.deleteButton.setLabel(self.tr("Booking"));
//        self.ui.deleteButton.setShow("both");
//        self.ui.deleteButton.setMaxWidth(120);
//        self.ui.deleteButton.setMinWidth(120);
//        self.ui.deleteButton.setMaxHeight(30);
//        self.ui.deleteButton.setMinHeight(30);
//        self.ui.deleteButton.addListener("click", function () {
//            main.slotBookingGetAvailableOffers();
//        });

//        qxnw.utils.addClassToElement(self.ui.selectAllButton, "btn_blueAdmi");
//        self.ui.selectAllButton.setLabel(self.tr("Mapa en vivo"));
//        self.ui.selectAllButton.setShow("both");
//        self.ui.selectAllButton.setMaxWidth(140);
//        self.ui.selectAllButton.setMinWidth(140);
//        self.ui.selectAllButton.setMaxHeight(30);
//        self.ui.selectAllButton.setMinHeight(30);
//        self.ui.selectAllButton.addListener("click", function () {
////            var d = new transmovapp.tree.mapa_conductores(false);
////            d.maximize();
////            d.show();
//            main.slotMapaConductores();
//        });

//        qxnw.utils.addClassToElement(self.ui.unSelectButton, "btn_blueAdmi");
//        self.ui.unSelectButton.setLabel(self.tr("Calendario"));
//        self.ui.unSelectButton.setShow("both");
//        self.ui.unSelectButton.setMaxWidth(140);
//        self.ui.unSelectButton.setMinWidth(140);
//        self.ui.unSelectButton.setMaxHeight(30);
//        self.ui.unSelectButton.setMinHeight(30);
//        self.ui.unSelectButton.addListener("click", function () {
//            main.slotCalendar();
//        });


//        var render = new qxnw.rowRenderer();
//        render.setHandleData(3, "Back", "#ffffff");
//        render.setHandleData(3, "AppPax", "#ffffff");
//        render.setHandleData(3, "Booking", "#ffffff");
//        self.table.setDataRowRenderer(render);

//        self.execSettings();
//        self.setAllPermissions(true);
        self.execPermisos();

    },
    destruct: function () {
    },
    members: {
        initIntervalNew: function initIntervalNew() {
            var self = this;
            clearInterval(self.inter);
            clearInterval(self.intercounter);
            self.inter = setInterval(function () {
                if (!document.querySelector(self.className)) {
                    clearInterval(self.inter);
                    return false;
                }
                self.applyFilters(true);
//            }, 30000); // 30 segs
            }, 15000); //20 segs  

            var count = 0;
            self.intercounter = setInterval(function () {
                count++;
                var btn = document.querySelector(".btn_blueAdmi_counter");
                if (btn) {
                    btn.innerHTML = count;
                }
                if (count >= 15) {
                    count = 0;
                }
            }, 1000);
        },
        initIntervalTraeNuevosServicios: function initIntervalTraeNuevosServicios() {
            var self = this;
            return;

            clearInterval(self.inter);
            self.inter = setInterval(function () {
                if (!document.querySelector(".container_form_bookingoffers")) {
                    clearInterval(self.inter);
                    return false;
                }
                self.applyFilters();
//            }, 30000); // 30 segs
            }, 10000); //10 segs      
        },
        execPermisos: function execPermisos() {
            var self = this;
            console.log("self.permisos", self.permisos);
            if (self.permisos.ver_precios == "false") {
                self.hideColumn("valor_declarado");
                self.hideColumn("valor");
                self.hideColumn("descuento_aplicado");
                self.hideColumn("valor_tarifa_minima");
                self.hideColumn("valor_total_servicio");
                self.hideColumn("valor_unidad_tiempo");
                self.hideColumn("valor_unidad_metros");
                self.hideColumn("valordistancia");
                self.hideColumn("valorminutos");
                self.hideColumn("metros_cobro_recargo");
                self.hideColumn("metros_cobro_peaje");
                self.hideColumn("aplico_peaje");
                self.hideColumn("aplico_recargo");
                self.hideColumn("valor_espera");
                self.hideColumn("iva_porcentaje");
                self.hideColumn("iva");
                self.hideColumn("porcentaje_empresa");
                self.hideColumn("porcentaje_proveedor");
                self.hideColumn("utilidad_conductor");
                self.hideColumn("utilidad_empresa");
                self.hideColumn("liquida_usuario");
                self.hideColumn("liquida_fecha");
            }
            if (self.permisos.ver_placa_servicio == "false") {
                self.hideColumn("vehiculo_html");
                self.hideColumn("placa");
                self.hideColumn("conductor_usuario");
            }
            if (self.permisos.crear_servicios == "false") {
                self.ui.newButton.setVisibility("excluded");
            }
            if (self.permisos.ve_informe_abordaje == "false") {
                self.ui.editButton.setVisibility("excluded");
            }
            if (self.permisos.ve_mapa_conductores == "false") {
                self.ui.selectAllButton.setVisibility("excluded");
            }
            if (self.permisos.ver_calendario == "false") {
                self.ui.unSelectButton.setVisibility("excluded");
            }
            if (self.permisos.ver_booking == "false" || self.conf.booking_activo != "SI") {
                self.ui.deleteButton.setVisibility("excluded");
//                self.ui.booking_offers.setVisibility("excluded");
//                self.ui.booking_accepts.setVisibility("excluded");
            }

        },
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var data = self.selectedRecord();
            var m = new qxnw.contextmenu(this);
            console.log("data", data);

            if (main.isCustomer()) {
                if (data.estado === "COTIZACION") {
                    m.addAction("Rechazar servicio", "icon/16/actions/document-properties.png", function (e) {
                        data.option_reasignar = "SI";
                        self.slotReasignarConductor(data);
                    });
                }
            }
            if (!main.isCustomer()) {

                m.addAction("Línea de tiempo", "icon/16/actions/view-sort-descending.png", function (e) {
                    var d = new transmovapp.lists.l_linea_tiempo(data);
//                    d.setWidth(900);
//                    d.setMaxWidth(900);
//                    d.setHeight(700);
//                    d.setMaxHeight(700);
                    d.setModal(true);
                    d.maximize();
                    d.show();
                });

                if (data.estado == "COTIZACION_RECHAZADA") {
                    m.addAction("Ver motivo rechazo", "icon/16/apps/utilities-log-viewer.png", function (e) {
                        self.slotRechazar('ver');
                    });
                }

                if (data.estado == "COTIZACION" || data.estado === "LLEGADA_DESTINO" || data.estado === "COTIZACION_RECHAZADA") {
                    var ms = "Asignar/cambiar conductor";
//                data.option_reasignar = "SI";
                    data.permitirReasignarConductor = true;

                    if (data.estado == "COTIZACION" || data.estado === "COTIZACION_RECHAZADA") {
                        m.addAction("Confirmar cotización", "icon/16/actions/dialog-apply.png", function (e) {
                            var d = new transmovapp.forms.f_confirma_cotizacion_servicio(data);
                            d.getChildControl("close-button").addListener("click", function () {
                                self.applyFilters();
                            });
                            d.settings.accept = function () {
                                self.applyFilters();
                            };
//                            d.maximize();
                            d.setWidth(700);
                            d.setHeight(600);
                            d.setModal(true);
                            d.show();
                        });
                    }
                    if (data.estado === "LLEGADA_DESTINO") {
                        ms = "Liquidar servicio";
                        data.permitirReasignarConductor = false;
                        data.liquidarServicio = true;
                        m.addAction("Liquidar servicio", "icon/16/actions/dialog-apply.png", function (e) {
                            self.slotReasignarConductor(data);
                        });
                    }
                }
            }

            var msg = "Debe tener asignado un conductor";

            var showTiempoReal = true;
            if (main.isCustomer()) {
                if (self.conf.cliente_ve_ubicacion_conductor_en_viaje == "NO") {
                    showTiempoReal = false;
                }
            }
            if (showTiempoReal === true) {
                m.addAction("Tracking", "icon/16/apps/internet-web-browser.png", function (e) {
                    self.slotMapa();
                });
            }

            if (self.permisos.cambiar_estados_viaje != "false") {
//            if (data.estado !== "LLEGADA_DESTINO") {
                if (!main.isCustomer()) {
                    m.addAction("Cambiar estado", "icon/16/apps/office-project.png", function (e) {
                    });
                    m.addSubAction("SOLICITUD (Esperando conductor)", "icon/16/status/dialog-information.png", function (e) {
                        self.slotCambiarEstado(data, "SOLICITUD", true);
                    });
                    m.addSubAction("ACEPTADO_RESERVA (Conductor asociado)", "icon/16/status/security-low.png", function (e) {
                        self.slotCambiarEstado(data, "ACEPTADO_RESERVA", true);
                    });
                    m.addSubAction("COTIZACION", "icon/16/status/mail-replied.png", function (e) {
                        self.slotCambiarEstado(data, "COTIZACION", true);
                    });
                    m.addSubAction("EN_RUTA (En camino a punto de partida)", "icon/16/actions/appointment-new.png", function (e) {
                        if (!self.evalueData(data.conductor_id)) {
                            qxnw.utils.information(msg);
                            return true;
                        }
                        self.slotCambiarEstado(data, "EN_RUTA", false);
                    });
                    m.addSubAction("EN_SITIO (Llega y espera abordaje)", "icon/16/actions/document-open-recent.png", function (e) {
                        if (!self.evalueData(data.conductor_id)) {
                            qxnw.utils.information(msg);
                            return true;
                        }
                        self.slotCambiarEstado(data, "EN_SITIO", false);
                    });
                    m.addSubAction("ABORDO (En camino a destino)", "icon/16/actions/edit-redo.png", function (e) {
                        if (!self.evalueData(data.conductor_id)) {
                            qxnw.utils.information(msg);
                            return true;
                        }
                        self.slotCambiarEstado(data, "ABORDO", false);
                    });
                    m.addSubAction("LLEGADA_DESTINO (Finaliza servicio)", "icon/16/actions/dialog-apply.png", function (e) {
                        if (!self.evalueData(data.conductor_id)) {
                            qxnw.utils.information(msg);
                            return true;
                        }
                        self.slotCambiarEstado(data, "LLEGADA_DESTINO", true);
                    });
                    m.addSubAction(self.tr("SIN_ATENDER"), "icon/16/status/dialog-warning.png", function () {
                        self.slotCambiarEstado(data, "SIN_ATENDER", true);
                    }, self);
                    m.addSubAction(self.tr("SIN_ATENDER_ARCHIVADO"), "icon/16/mimetypes/archive.png", function () {
                        self.slotCambiarEstado(data, "SIN_ATENDER_ARCHIVADO", true);
                    }, self);
                    m.addSubAction("CANCELADO_POR_ADMIN", "icon/16/actions/edit-delete.png", function (e) {
                        self.slotCambiarEstado(data, "CANCELADO_POR_ADMIN", true);
                    });
                    m.addSubAction("CANCELADO_POR_CONDUCTOR", "icon/16/status/dialog-error.png", function (e) {
                        if (!self.evalueData(data.conductor_id)) {
                            qxnw.utils.information(msg);
                            return true;
                        }
                        self.slotCambiarEstado(data, "CANCELADO_POR_CONDUCTOR", true);
                    });
                    m.addSubAction("CANCELADO_POR_USUARIO", "icon/16/emblems/emblem-important.png", function (e) {
                        self.slotCambiarEstado(data, "CANCELADO_POR_USUARIO", true);
                    });
                }
//            }
                m.addAction("Novedades reportadas", "icon/16/status/dialog-warning.png", function (e) {
                    self.Novedades(data);
                });

                if (!main.isCustomer()) {
                    if (data.estado !== "LLEGADA_DESTINO") {
                        if (data.estado !== "LIQUIDADO") {

                            if (self.permisos.editar_servicios != "false") {
//                                m.addAction("Configurar servicio (partida, destino, fecha, pasajeros, paradas, otros)", "icon/16/actions/document-properties.png", function (e) {
                                m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                                    if (data.estado === "LLEGADA_DESTINO") {
                                        qxnw.utils.information("Los viajes en estado LLEGADA_DESTINO no pueden ser editados, pruebe cambiar de estado e intente nuevamente.");
                                        return false;
                                    }
                                    self.slotEditar();
                                });
                            }
                            if (self.permisos.asignar_conductor != "false") {
                                m.addAction("Configurar conductores", "icon/16/actions/appointment-new.png", function (e) {
                                    if (data.estado === "LLEGADA_DESTINO") {
                                        qxnw.utils.information("Los viajes en estado LLEGADA_DESTINO no pueden ser editados, pruebe cambiar de estado e intente nuevamente.");
                                        return false;
                                    }
                                    self.conductoresAdicionales();
                                });
                            }
                        }
                    }
                }
            }
            if (self.permisos.duplicar_viaje != "false") {
                m.addAction("Duplicar", "icon/16/actions/edit-copy.png", function (e) {
                    self.slotEditar("duplicar");
                });
            }
//            m.addAction("Finalizar servicio", "icon/16/actions/document-properties.png", function (e) {
//                self.slotFinalizar(data);
//            });
//            m.addAction("Cancelar servicio", "icon/16/actions/document-properties.png", function (e) {
//                self.slotCancelar(data);
//            });
            if (self.permisos.ve_informe_abordaje != "false") {
                m.addAction("Informe abordaje / paradas", "icon/16/categories/science.png", function (e) {
                    self.slotParadasAdicionales(data);
                });
            }
            if (self.permisos.ve_voucher != "false") {
                m.addAction("Ver Voucher", "icon/16/categories/science.png", function (e) {
                    self.imprimir("VER_VOUCHER", data);
                });
            }
            if (self.permisos.ve_cartel_vuelo != "false") {
                m.addAction("Ver Cartel de Vuelo", "icon/16/categories/science.png", function (e) {
                    self.imprimir("CARTEL_VUELO", data);
                });
            }
            if (self.permisos.ve_no_show != "false") {
                m.addAction("Ver informe de No presentación a viaje (No Show)", "icon/16/categories/science.png", function (e) {
                    self.imprimir("NO_SHOW", data);
                });
            }
            var vefuec = true;
            if (self.conf.pide_fuec == "NO") {
                vefuec = false;
            }
            if (self.permisos.ve_informe_abordaje == "false") {
                vefuec = false;
            }
            if (vefuec) {
                m.addAction("FUEC", "icon/16/apps/utilities-log-viewer.png", function (e) {
                    self.slotFuec();
                });
            }
            m.addAction("Fotos adjuntas del viaje", "icon/16/actions/view-sort-descending.png", function (e) {
                var d = new transmovapp.lists.l_servicios_fotos();
//                    d.setWidth(900);
//                    d.setMaxWidth(900);
//                    d.setHeight(700);
//                    d.setMaxHeight(700);
                d.setModal(true);
                d.maximize();
                d.show();

                var pr = {};
                pr.id_servicio = data.id;
                d.setParamRecord(pr);
            });
//            m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function (e) {
//                qxnw.utils.question("¿Está seguro de eliminar el registro?", function (e) {
//                    if (e) {
//                        self.slotEliminar();
//                    } else {
//                        return;
//                    }
//                });
//            });


            m.addAction("Conductores notificados", "icon/16/actions/view-sort-descending.png", function (e) {
                var d = new transmovapp.lists.l_conductores_notificados(data);
//                    d.setWidth(900);
//                    d.setMaxWidth(900);
//                    d.setHeight(700);
//                    d.setMaxHeight(700);
                d.setModal(true);
                d.maximize();
                d.show();
            });

            m.addAction("Chat pasajero principal y conductor", "icon/16/actions/view-sort-descending.png", function (e) {
                main.chat(data);
            });

            m.exec(veteapp);
        },
        applyFilters: function applyFilters(push) {
            var self = this;
            if (!self.validate()) {
                return;
            }
            if (push != true) {
//                self.initIntervalNew();
            }
            var data = {};
            if (self.getFiltersData()) {
                data.filters = self.getFiltersData();
            }
            var up = qxnw.userPolicies.getUserData();
            if (main.isCustomer()) {
                data.filters.bodega = up.bodega;
//                console.log("self.conf", self.conf);
//                if (self.conf.usa_flotas_clientes == "SI") {
//                    data.filters.tipo_empresa = main.getTipoempresa();
//                }
            }
            data.empresa_o_flota = main.empresa_o_flota;
            data.permisos = main.permisos_usuario;
            console.log("l_servicios_totales:::applyFilters:::dataSendServer", data);

            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            rpc.setShowLoading(true);
            var func = function (r) {
                console.log("l_servicios_totales:::applyFilters:::responseServer:::r", r);
                for (var i = 0; i < r.records.length; i++) {
                    r.records[i] = self.resolveStatus(r.records[i]);

//                    r.records[i].ampliar = "<span class='tipo_servicio_html tipo_servicio_ampliar'>" + "Ampliar " + "</span>";

                    r.records[i].tipo_servicio_html = "<span class='tipo_servicio_html tipo_servicio_" + r.records[i].tipo_servicio + "'>" + r.records[i].tipo_servicio + "</span>";
                    if (r.records[i].estado == 'COTIZACION_CONFIRMADA') {
                        r.records[i].aprobar = "<span class='tipo_servicio_html tipo_servicio_ahora'>" + "Aprobar cotizacion " + "</span>";
                        r.records[i].rechazar = "<span class='tipo_servicio_html rechazar'>" + "Rechazar cotizacion " + "</span>";
                    }
                    r.records[i].paradas_adicionales_iniciales_creacion_html = "<span class='totalpax_html'><img src='/lib_mobile/pax.svg' /> x " + r.records[i].paradas_adicionales_iniciales_creacion + "</span>";
                    if (qxnw.utils.evalueData(r.records[i].placa)) {
                        r.records[i].vehiculo_html = "<span class='vehiculo_contain_html'>";
                        if (qxnw.utils.evalueData(r.records[i].vehiculo_text)) {
                            r.records[i].vehiculo_html += "<span class='vehiculo_contain_html_marca'>" + r.records[i].vehiculo_text + "</span> ";
                        }
                        r.records[i].vehiculo_html += "<span class='vehiculo_contain_html_placa'>" + r.records[i].placa + "</span></span>";
                    }
                    var namedriver = "Sin asignar";
                    if (qxnw.utils.evalueData(r.records[i].conductor)) {
                        namedriver = "<strong>" + r.records[i].conductor + "</strong>";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].moneda)) {
                        r.records[i].moneda = self.conf.moneda_por_defecto;
                    }
                    r.records[i].conductor_html = namedriver;

                    r.records[i].origen_html = r.records[i].origen + " <br />" + r.records[i].ciudad_origen;
                    r.records[i].destino_html = r.records[i].destino + " <br />" + r.records[i].ciudad_destino;

                    if (!qxnw.utils.evalueData(r.records[i].valor_final_tiempo) || r.records[i].valor_final_tiempo == NaN || isNaN(r.records[i].valor_final_tiempo)) {
                        r.records[i].valor_final_tiempo = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].valor_final_distancia) || r.records[i].valor_final_distancia == NaN || isNaN(r.records[i].valor_final_distancia)) {
                        r.records[i].valor_final_distancia = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].valordistancia) || r.records[i].valordistancia == NaN || isNaN(r.records[i].valordistancia)) {
                        r.records[i].valordistancia = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].valor) || r.records[i].valor == NaN || isNaN(r.records[i].valor)) {
                        r.records[i].valor = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].valorminutos) || r.records[i].valorminutos == NaN || isNaN(r.records[i].valorminutos)) {
                        r.records[i].valorminutos = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].valor_total_servicio) || r.records[i].valor_total_servicio == NaN || isNaN(r.records[i].valor_total_servicio)) {
                        r.records[i].valor_total_servicio = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].valor_tarifa_minima) || r.records[i].valor_tarifa_minima == NaN || isNaN(r.records[i].valor_tarifa_minima)) {
                        r.records[i].valor_tarifa_minima = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].valor_unidad_tiempo) || r.records[i].valor_unidad_tiempo == NaN || isNaN(r.records[i].valor_unidad_tiempo)) {
                        r.records[i].valor_unidad_tiempo = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].valor_unidad_metros) || r.records[i].valor_unidad_metros == NaN || isNaN(r.records[i].valor_unidad_metros)) {
                        r.records[i].valor_unidad_metros = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].valor_espera) || r.records[i].valor_espera == NaN || isNaN(r.records[i].valor_espera)) {
                        r.records[i].valor_espera = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].porcentaje_empresa) || r.records[i].porcentaje_empresa == NaN || isNaN(r.records[i].porcentaje_empresa)) {
                        r.records[i].porcentaje_empresa = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].utilidad_conductor) || r.records[i].utilidad_conductor == NaN || isNaN(r.records[i].utilidad_conductor)) {
                        r.records[i].utilidad_conductor = "0";
                    }
                    if (!qxnw.utils.evalueData(r.records[i].utilidad_empresa) || r.records[i].utilidad_empresa == NaN || isNaN(r.records[i].utilidad_empresa)) {
                        r.records[i].utilidad_empresa = "0";
                    }

                }
                self.setModelData(r);
            };
            rpc.exec("consultaTotal", data, func);
        },
        slotRechazar: function slotRechazar(tipo) {
            var self = this;
            console.log(tipo);
            var sl = self.selectedRecord();
            console.log(sl);
            var d = new qxnw.forms();
            d.settings.accept = function () {
                self.applyFilters();
            },
                    d.setTitle(self.tr("Rechazar Cotización"));
            var fields = [
                {
                    label: "id",
                    name: "id",
                    type: "textField",
                    enabled: false,
                    visible: false
                },
                {
                    name: "motivo_rechazo",
                    label: self.tr("Motivo rechazo"),
                    type: "selectBox",
                    required: true
                },
                {
                    label: "Fecha rechazo",
                    name: "fecha",
                    type: "dateTimeField",
                    enabled: false
                },
                {
                    label: "Observaciones",
                    name: "observaciones",
                    type: "textArea",
                    required: true
                }
            ];
            d.setFields(fields);
            d.ui.id.setValue(sl.id.toString());

            if (tipo == "ver") {
                d.ui.observaciones.setValue(sl.observaciones_rechazo);
                d.ui.fecha.setValue(sl.fecha_rechazo);
                var dat = {};
                dat[sl.motivo_rechazo] = self.tr(sl.motivo_rechazo_text.toString());
                qxnw.utils.populateSelectFromArray(d.ui.motivo_rechazo, dat);
                d.ui.motivo_rechazo.setValue(sl.motivo_rechazo.toString());

                d.setEnabledAll(false);
                d.ui.accept.setEnabled(false);

            }
            if (tipo != "ver") {
                var t = {};
                t[""] = self.tr("Seleccione");
                qxnw.utils.populateSelectFromArray(d.ui.motivo_rechazo, t);
                t.table = "edo_motivos_rechazos";
                qxnw.utils.populateSelect(d.ui.motivo_rechazo, "master", "populate", t);
                d.ui.fecha.setValue(new Date());
            }
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });

            d.ui.accept.addListener("execute", function () {
                if (!d.validate()) {
                    return;
                }
                var datos = d.getRecord();
                var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin", true);
                var func = function (r) {
                    if (r) {
                        qxnw.utils.information("Cotizacón <strong>rechazada</strong> correctamente!");
                        d.accept();
                    }
                };
                rpc.exec("rechazarCotizacion", datos, func);
            });

            d.setModal(true);
            d.show();
        },

        resolveStatus: function resolveStatus(res) {
            var background = "";
            var width = "";

            if (res.estado == "LIQUIDADO") {
                background = "#95FE71";
                width = "100%";
            }
            if (res.estado == "CONDUCTOR_ASIGNADO") {
                background = "#104772";
                width = "0%";
            }
            if (res.estado == "CONDUCTOR_REASIGNADO") {
                background = "#104772";
                width = "0%";
            }
            if (res.estado == "COTIZACION") {
                background = "#104772";
                width = "0%";
            }
            if (res.estado == "SOLICITUD") {
                background = "#104772";
                width = "0%";
            }
            if (res.estado == "ASIGNADO") {
                background = "#95FE71";
                width = "5%";
            }
            if (res.estado == "ACEPTADO_RESERVA") {
                background = "#104772";
                width = "10%";
            }
            if (res.estado == "EN_RUTA") {
                background = "#104772";
                width = "20%";
            }
            if (res.estado == "EN_SITIO") {
                background = "#FEF171";
                width = "40%";
            }
            if (res.estado == "ABORDO") {
                background = "#FA8F44";
                width = "80%";
            }
            if (res.estado == "SIN_ATENDER") {
                background = "#F05A3A";
                width = "100%";
            }
            if (res.estado == "SIN_ATENDER_ARCHIVADO") {
                background = "#b3e41c";
                width = "100%";
                res.estatus = "<div class='div_state'> <div class='porcentaje_div' style='height: 100%; width: 100%; background-color: #b3e41c'></div><div class='porcent_text'> " + res.estado + "</div></div>";
            }
            if (res.estado == "CANCELADO_POR_USUARIO") {
                background = "red";
                width = "100%";
            }
            if (res.estado == "CANCELADO_POR_ADMIN") {
                background = "#6e6e6e";
                width = "100%";
            }
            if (res.estado == "CIERRE AUTOMATICO") {
                background = "#F05A3A";
                width = "100%";
            }
            if (res.estado == "CANCELADO_POR_CONDUCTOR") {
                background = "#bb1f1f";
                width = "100%";
            }
            if (res.estado == "LLEGADA_DESTINO") {
                background = "#95FE71";
                width = "100%";
            }
            if (res.estado == "INICIA_SERVICIO") {
                background = "#FA8F44";
                width = "20%";
            }
            if (res.estado == "DESPLAZANDOSE_AL_PUNTO") {
                background = "#FA44DE";
                width = "5%";
            }
            res.estatus = "<div class='div_state'><div class='porcentaje_div' style='width: " + width + "; background-color: " + background + "'></div><div class='porcent_text'>" + res.estado + "</div></div>";
            return res;
        },
        conductoresAdicionales: function conductoresAdicionales() {
            var self = this;
            var s = self.conf;
            var up = qxnw.userPolicies.getUserData();
            var data = self.selectedRecord();
            console.log("data", data);
            var d = new transmovapp.forms.f_conductores_adicionales();
            d.setParamRecord(data);

            if (qxnw.utils.evalueData(data.conductor_usuario)) {
                var con = {
                    id: data.conductor_id,
                    usuario_principal: data.conductor_usuario,
                    nombre: data.conductor
                };
                d.slotConductorPrincipal(con);
            }
            if (qxnw.utils.evalueData(data.vehiculo) && qxnw.utils.evalueData(data.placa)) {
                var con = {
                    id: data.vehiculo,
                    vehiculo_text: data.vehiculo_text,
                    placa: data.placa
                };
                d.slotVehiculoPrincipal(con);
            }

            d.settings.accept = function () {
                self.applyFilters();
            };
//            d.maximize();
            d.setWidth(600);
            d.setMaxWidth(600);
            d.setHeight(600);
            d.setMaxHeight(600);
            d.setModal(true);
            d.show();
            console.log("OK");
        },
        initInterval: function initInterval() {
            var self = this;
//            clearInterval(self.interval);
//            self.interval = setInterval(function () {
//                self.applyFilters();
//            }, 10000);
        },
        slotFuec: function slotFuec() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var datas = {};
            datas.id = r.vehiculo;
            console.log("datas", datas);
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios");
            var data = rpc.exec("validaFuecPorTipo", datas);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            console.log("data", data);
            if (data.vehiculo_publico_particular == "publico_taxi") {
                qxnw.utils.information("Este vehículo tipo taxi no maneja FUEC");
                return false;
            }


            var d = new qxnw.reports();
            d.createPrinterToolBar();
            d.hideSelectPrinters(true);
            d.addFrame("/app/fuec_2021.php?service=" + r.id, false);
            d.maximize();
            d.show();
        },
        slotMapa: function slotMapa() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            console.log("r", r);

            var d = new qxnw.reports();
            d.createPrinterToolBar();
            d.hideSelectPrinters(true);
            d.addFrame("/app/recorridoDriver.php?id=" + r.id, false);
            d.maximize();
            d.show();
        },
        slotEditar: function slotEditar(duplicar) {
            var self = this;
            var r = self.selectedRecord();
            console.log("slotEditar:::dataSelectedRecord:::r", r);
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new enrutamiento.tree.enrutamiento();
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.setModal(true);
            d.maximize();
            d.show();

            console.log("l_servicios_totales:::traeViajeByID:::dataSend", r);

            qxnw.utils.loadingnw_remove("cargando_axtest");
//            qxnw.utils.loadingnw("Cargando datos del servicio... Por favor espere...", "cargando_axtest");

//            var rpc = new qxnw.rpc(this.rpcUrl, "enrutamiento_masivo");
//            var data = rpc.exec("traeViajeByID", r);
//            if (rpc.isError()) {
//                qxnw.utils.error(rpc.getError(), self);
//                return;
//            }
//            d.addListener("appear", function () {
//                console.log("l_servicios_totales:::traeViajeByID:::resultServer", data);
//                muestraData(data);
//            });
            d.addListener("appear", function () {
                var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
                rpc.setAsync(true);
                rpc.setShowLoading(true);
                var func = function (data) {
                    console.log("enrutamiento_masivo:::response:::", data);
                    muestraData(data);
                };
                rpc.exec("traeViajeByID", r, func);
            });

            function muestraData(data) {
                if (duplicar === "duplicar") {
                    data.form.id = "";
                }

//                d.addListener("appear", function () {
//                setTimeout(function () {
                qxnw.utils.loadingnw_remove("cargando_axtest");

                if (duplicar != "duplicar") {
                    data.editaViajeDesdeHistorico = true;
                }
                data.form.edita = true;

                data.form.id_servicio_enc = data.form.id;
                data.form.fecha_edita = data.form.fecha;
                data.form.hora_edita = data.form.hora;
                if (qxnw.utils.evalueData(data.form.cliente_empresa_id) && qxnw.utils.evalueData(data.form.nombre_cliente)) {
                    data.form.cliente_array = {
                        id: data.form.cliente_empresa_id,
                        nombre: data.form.nombre_cliente
                    };
                }

                if (qxnw.utils.evalueData(data.form.flota_id) && qxnw.utils.evalueData(data.form.flota_text)) {
                    data.form.flota_array = {
                        id: data.form.flota_id,
                        nombre: data.form.flota_text
                    };
                }
                if (qxnw.utils.evalueData(data.form.ciudad_conductores_id) && qxnw.utils.evalueData(data.form.ciudad_conductores_nombre)) {
                    data.form.ciudad_array = {
                        id: data.form.ciudad_conductores_id,
                        nombre: data.form.ciudad_conductores_nombre
                    };
                }
                if (qxnw.utils.evalueData(data.form.subcategoria_servicio) && qxnw.utils.evalueData(data.form.subcategoria_servicio_text)) {
                    data.form.tipo_servicio_array = {
                        id: data.form.subcategoria_servicio,
                        nombre: data.form.subcategoria_servicio_text
                    };
                }
                var array = false;

                if (qxnw.utils.evalueData(data.form.usuario) && qxnw.utils.evalueData(data.form.id_usuario)) {
                    var array = true;
                    data.form.usuario_array = {
                        id: data.form.id_usuario,
                        usuario: data.form.usuario,
                        celular: data.form.celular,
                        nombre: data.form.cliente_nombre
                    };
                }
//                var elementosBuscados = ["id_usuario", "usuario", "celular", "cliente_nombre"];
//                const elementosEncontrados = data.form.filter(elemento => elementosBuscados.includes(elemento));
//
//                const elementosNoEncontrados = elementosBuscados.filter(elemento => !data.form.includes(elemento));
//                console.log('Elementos encontrados:', elementosEncontrados);
//                console.log('Elementos no encontrados:', elementosNoEncontrados);

                if (qxnw.utils.evalueData(data.form.usuario) && array == false) {
                    if (qxnw.utils.evalueData(data.form.cliente_nombre)) {
                        var array = true;

                        data.form.usuario_array = {
                            id: data.form.usuario,
                            usuario: data.form.usuario,
                            celular: data.form.celular,
                            nombre: data.form.cliente_nombre
                        };
                    } else if (qxnw.utils.evalueData(data.form.cliente_nombre)) {
                        var array = true;

                        data.form.usuario_array = {
                            id: data.form.usuario,
                            usuario: data.form.usuario,
                            celular: data.form.celular,
                            nombre: data.form.usuario
                        };
                    }

                }
                if (qxnw.utils.evalueData(data.form.cliente_nombre) && array == false) {
                    data.form.usuario_array = {
                        id: data.form.cliente_nombre,
                        usuario: data.form.cliente_nombre,
                        celular: data.form.celular,
                        nombre: data.form.cliente_nombre
                    };
                }
//                    else {
//                        data.form.ciudad_array = {
//                            id: data.form.ciudad_id,
//                            nombre: data.form.ciudad_origen
//                        };
//                    }
                if (qxnw.utils.evalueData(data.conductor)) {
                    var servicios = "";
                    if (main.evalueData(data.conductor.servicios_activos)) {
                        servicios = JSON.parse(data.conductor.servicios_activos);
                    }
                    data.conductor.servicios_driver = servicios;
                }

                var dat = {};
                dat.data = data;
                console.log("l_servicios_totales:::data", data);
                console.log("l_servicios_totales:::sendToFormData:::dat", dat);

                d.restaurarPlantilla(dat);

                d.ui.pre_enrutar.setVisibility("excluded");
                d.form.ui.plantillas.setVisibility("excluded");

//                }, 3000);

//                });
            }
        },
//        slotEditar: function slotEditar(t) {
//            var self = this;
//            var r = self.selectedRecord();
//            if (r == undefined) {
//                qxnw.utils.alert("Seleccione un registro");
//                return;
//            }
//            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
//            var data = rpc.exec("consulta", r);
//            if (rpc.isError()) {
//                qxnw.utils.error(rpc.getError(), self);
//                return;
//            }
//            var d = new transmovapp.forms.f_servicios(t);
//            if (!d.setParamRecord(data)) {
//                qxnw.utils.alert("No se usó el setParamRecord");
//                return;
//            }
//            d.settings.accept = function () {
//                self.applyFilters();
//            };
//            d.show();
//        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
            rpc.exec("eliminar", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.removeSelectedRow();
        },
        slotArchivar: function slotArchivar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
            rpc.exec("archivar", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError());
                return;
            }
            self.applyFilters();
        },
        slotCambiarEstado: function slotCambiarEstado(r, estado, libera_conductor) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var f = new qxnw.forms();
            f.setTitle("Cambiar estado de servicio servicio #" + r.id + " a " + estado);
            var fields = [
                {
                    name: "",
                    type: "startGroup",
                    icon: qxnw.config.execIcon("office-address-book", "apps"),
                    mode: "vertical"
                },
//                {
//                    name: "id",
//                    label: "ID",
//                    caption: "id",
//                    type: "textField",
//                    required: true,
//                    enabled: false,
//                    visible: false
//                },
                {
                    name: "estado",
                    label: "Estado",
                    caption: "estado",
                    type: "textField",
                    required: true,
                    enabled: false,
                    visible: true
                },
                {
                    name: "observacion",
                    label: "Comentarios de cambio de estado",
                    caption: "observacion",
                    type: "textArea",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup"
                }
            ];
            var html = "<div class='div_full_title_int'><h1>Actualizar estado del servicio a " + estado + "</h1>";
            if (libera_conductor) {
                html += "<p>Al realizar esta acción liberarás al conductor si cuenta con uno asignado</p>";
            }
            html += "</div>";
            f.addHeaderNote(html);

            f.setFields(fields);

//            f.ui.id.setValue(r.id.toString());

            f.ui.estado.setValue(estado);
            f.setModal(true);
            f.setWidth(700);
            f.setHeight(400);
            f.show();
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var ras = f.getRecord();
                var data = r;
                data.config = main.getConfiguracion();
                data.estado_nuevo = ras.estado;
                data.empresa = up.company;
                data.observacion = ras.observacion;
                data.latitude = r.latitudOri;
                data.longitude = r.longitudOri;
                if (isNaN(r.valor)) {
                    r.valor = 0;
                }
                data.valor = r.valor;
                if (qxnw.utils.evalue(r.conductor_id)) {
                    data.conductor_id = r.conductor_id;
                }
                data.libera_conductor = "NO";
                if (libera_conductor === true) {
                    data.libera_conductor = "SI";
                }
                console.log("actualizaEstadoServicio:::data", data);
                var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
                rpc.setAsync(true);
                var func = function (res) {
                    console.log("actualizaEstadoServicio:::responseServer", res);
                    f.accept();
                    self.applyFilters();

                    main.registerServiceInFirebase(r.id);
                };
                rpc.exec("actualizaEstadoServicio", data, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
        },
        slotFinalizar: function slotFinalizar(r) {
            var self = this;
            var f = new qxnw.forms();
            f.setTitle("Finalizar servicio");
            var fields = [
                {
                    name: "",
                    type: "startGroup",
                    icon: qxnw.config.execIcon("office-address-book", "apps"),
                    mode: "vertical"
                },
                {
                    name: "id",
                    label: "ID",
                    caption: "id",
                    type: "textField",
                    required: true,
                    enabled: false,
                    visible: true
                },
                {
                    name: "observacion",
                    label: "Comentarios de finalización",
                    caption: "observacion",
                    type: "textArea",
                    required: true
                },
                {
                    name: "",
                    type: "endGroup"
                }
            ];
            f.addHeaderNote(self.tr("<div class='div_full_title_int'><h1>Finalizar servicio</h1>\n\
                                    <p>Al finalizar este servicio, pasará a estado COMPLETADO y liberas al conductor</p></div>"));
            f.setFields(fields);
            f.ui.id.setValue(r.id.toString());
            f.setModal(true);
            f.setWidth(700);
            f.setHeight(400);
            f.show();
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                var data = f.getRecord();
                if (isNaN(r.valor)) {
                    r.valor = 0;
                }
                data.valor = r.valor;
                if (qxnw.utils.evalue(r.conductor_id)) {
                    data.conductor_id = r.conductor_id;
                }
                var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
                rpc.setAsync(true);
                var func = function () {
                    f.accept();
                    self.applyFilters();
                };
                rpc.exec("finalizarServi", data, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
        },
        slotCancelar: function slotCancelar(r) {
            var self = this;
            var f = new qxnw.forms();
            f.setTitle("Cancelar servicio");
            var fields = [
                {
                    name: "id",
                    label: "ID",
                    caption: "id",
                    type: "textField",
                    required: true,
                    enabled: false,
                    visible: true
                },
                {
                    name: "observacion",
                    label: "Comentarios de cancelación",
                    caption: "Comentarios de cancelación",
                    type: "textArea",
                    required: true
                }
            ];
            f.setFields(fields);
            f.ui.id.setValue(r.id.toString());
            f.setModal(true);
            f.show();
            f.ui.accept.addListener("execute", function () {
                if (!f.validate()) {
                    return;
                }
                self.sendNotificacionPshCancelService(r);
                var data = f.getRecord();
                if (qxnw.utils.evalue(r.conductor_id)) {
                    data.conductor_id = r.conductor_id;
                }
                var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
                rpc.setAsync(true);
                var func = function () {
                    f.accept();
                    self.applyFilters();
                };
                rpc.exec("cancelar", data, func);
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
        },
        slotParadasAdicionales: function slotParadasAdicionales(r) {
            return main.slotParadasAdicionales(r, "popup");
        },
        slotReasignarConductor: function slotReasignarConductor(r) {
            var self = this;
//            r.permitirReasignarConductor = true;
            var d = null;
//            if (r.liquidarServicio == true) {
            d = new transmovapp.forms.f_mapa_liquidar_servicio(r);
//            } else {
//                d = new transmovapp.forms.f_mapa_vista(r);
//            }
            d.getChildControl("close-button").addListener("click", function () {
                clearInterval(d.interval);
                self.applyFilters();
                self.initInterval();
            });
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.maximize();
//            d.setWidth(700);
//            d.setHeight(600);
            d.setModal(true);
            d.show();
        },
        Novedades: function Novedades(data) {
            var self = this;
            console.log(data);
            self.listNovedades = new qxnw.lists();
            var columns = [
                {
                    caption: "id",
                    label: "Id",
                    visible: false
                },
                {
                    caption: "empresa",
                    label: "Empresa",
                    visible: false
                },
                {
                    caption: "perfil",
                    label: "Perfil",
                    visible: false
                },
                {
                    caption: "id_viaje",
                    label: "Id viaje",
                    visible: false
                },
                {
                    caption: "usuario",
                    label: "Usuario"
                },
                {
                    caption: "fecha",
                    label: "Fecha"
                },
                {
                    caption: "comentario",
                    label: "Comentario"
                },
                {
                    caption: "adjunto",
                    label: "Adjunto",
                    type: "image",
                    mode: "expand"
                },
                {
                    caption: "estado",
                    label: "Estado"
                }
            ];
            self.listNovedades.setColumns(columns);
//            self.listNovedades.ui.searchButton.addListener("execute", function () {
//                alert("sds");
//                self.listNovedades.applyFilters();
//            });
            console.log(self.listNovedades.ui);
            self.listNovedades.ui.updateButton.addListener("execute", function () {
                self.listNovedades.applyFilters();
            });
            self.listNovedades.ui["part2"].setVisibility("excluded");
            self.listNovedades.ui["part3"].setVisibility("excluded");
            self.listNovedades.ui["part4"].setVisibility("excluded");
            self.listNovedades.applyFilters = function () {
                var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
                rpc.setAsync(true);
                var func = function (res) {
                    self.listNovedades.setModelData(res);
                };
                rpc.exec("consultaNovedades", data, func);
            };
            self.listNovedades.applyFilters();
            self.listNovedades.show();
        },
        evalueData: function evalueData(value) {
            if (typeof value == "undefined" || value == "undefined" || value == undefined || value === null || value === false || value === "") {
                return false;
            }
            return true;
        },
        imprimir: function imprimir(ruta_php, array) {
            var d = new qxnw.reports();
            d.createPrinterToolBar();
            d.hideSelectPrinters(true);
            d.addFrame("/app/plantilla_impresiones.php?id_service=" + array.id + "&tipo=" + ruta_php, false);
            d.maximize();
            d.show();
        },
        slotAmpliar: function slotAmpliar() {
            var self = this;
            var r = self.selectedRecord();
            console.log("r", r);
            console.log("self.columnsForm", self.columnsForm);
//            var d = new transmovapp.tree.servicio_vista_general(self.columnsForm);
            var d = new transmovapp.forms.f_servicios_totales_ampliar(self.columnsForm);
//                d.setWidth(1200);
//                d.setMaxWidth(1200);
//                d.setHeight(600);
//                d.setMaxHeight(600);
            d.maximize(true);
            d.setModal(true);
            d.setParamRecord(r);
//            d.populateTree(r);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();

//            var pr = r;
//            d.addListener("appear", function () {
//                var val = {};
//                val.latitud = pr.origen_latitud;
//                val.longitud = pr.origen_longitud;
//                val.icon = "/lib_mobile/driver/img/marker_a.png";
//                val.centerMap = false;
//                val.openAtClick = true;
//                val.title = "";
//                val.titleHover = pr.origen;
////                val.callbackMarker = function (marker) {
////                    self.markerOrigen = marker;
////                };
//                d.markerOrigen = d.addMarkerInMap(val);
//
//                var val = {};
//                val.latitud = pr.destino_latitud;
//                val.longitud = pr.destino_longitud;
//                val.icon = "/lib_mobile/driver/img/marker_b.png";
//                val.centerMap = false;
//                val.openAtClick = true;
//                val.title = "";
//                val.titleHover = pr.destino;
////                val.callbackMarker = function (marker) {
////                    self.markerOrigen = marker;
////                };
//                d.markerOrigen = d.addMarkerInMap(val);
//
//                var location = new google.maps.LatLng(pr.origen_latitud, pr.origen_longitud);
//                d.mapa.googleMap.map.setCenter(location);
//                d.mapa.googleMap.setZoom(9);
//            });
        }
    }

});