qx.Class.define("enrutamiento.tree.enrutamiento", {
    extend: qxnw.treeWidget,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.setGroupHeader("Enrutamiento masivo");
        self.setTitle("Enrutamiento masivo");

        self.config = main.getConfiguracion();
        self.restaurandoPlantilla = false;
        self.editaRuta = false;
        self.editaViajeDesdeHistorico = false;
        self.usaPolyLine = true;
        self.usaPolyLineAdvance = true;
        self.times_dis_travel_gps = false;
        self.seguirsinlist1 = false;
        self.seguirsinlistDriver = false;
        self.tipoServicioSet = false;
        self.ciudadesHomologadas = "";
        self.slotHomologacionCiudades();

        self.up = qxnw.userPolicies.getUserData();

        self.createSecondLayer();

//        qxnw.local.storeData(self.getAppWidgetName() + "_nav_max_show_rows", 20);

        var html = "<div class='div_full_title'>";
        html += "<div class='ciudadesContainer'>Ciudad init: <span class='direccionACiudadSpan'>N/A</span> Ciudad final: <span class='direccionBCiudadSpan'>N/A</span></div>";
        html += "<span class='rw_en driver_icon'></span>Conductor: <span class='class_enc_driver'>Sin pasajero asignado al viaje, por favor seleccione uno</span> ";
        html += "<span class='rw_en pass_icon'></span>Pasajeros enrutados: <span class='class_enc_pasajeros'>0</span> -  sin enrutar: <span class='class_enc_pasajeros_esperan'>0</span> ";
        html += " <span class='rw_en customer_icon'></span>Cliente: <span class='class_enc_cliente'>N/A</span>";
        html += " <span class='class_enc_data_travel'></span>";
        html += "</div>";
//        self.addHeaderNote(html);

        var label = new qx.ui.basic.Label(self.tr(html)).set({
            rich: true,
            alignX: "center"
        });
        self.masterContainer.add(label, {
            flex: 1
        });

        self.parent = {};
        self.markerc = {};
        self.allMarkers = [];
        self.allMarkersPasajeros = [];
        self.allMarkersDrivers = [];
        self.conductor = false;

        self.form = new qxnw.forms();
        self.__conf = main.getConfiguracion();
        var fields = [
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "id_servicio_enc",
                caption: "id_servicio_enc",
                label: "ID",
                type: "textField",
                enabled: false,
//                visible: true,
                required: false
            },
            {
                name: "buscar_conductor",
                caption: "buscar_conductor",
                label: "Buscar conductor",
                type: "textField",
                mode: "search"
            },
            {
                name: "ciudad",
                caption: "ciudad",
                label: "Ciudad conductor",
                type: "selectTokenField",
                mode: "search"
            },
            {
                name: "terminal",
                caption: "terminal",
                label: "Terminal",
                type: "selectTokenField"
            },
            {
                name: "flota",
                caption: "flota",
                label: "Flota",
                type: "selectTokenField"
            },
            {
                name: "creado_por_pc",
                caption: "creado_por_pc",
                label: "Disp",
                type: "selectBox",
                visible: true
            },
            {
                name: "trf",
                caption: "trf",
                label: "TRF",
                type: "selectBox",
                visible: true
            },
            {
                name: "servicio_para",
                caption: "servicio_para",
                label: "Modo",
                type: "selectBox",
                visible: true,
                required: true
            },
            {
                name: "sentido",
                label: "Sentido",
                caption: "sentido",
                type: "selectBox",
                required: true
            },
            {
                name: "cliente",
                label: "Empresa",
                caption: "cliente",
                type: "selectTokenField"
//                ,
//                required: true
            },
            {
                name: "sede",
                label: "Sedes/lugares",
                caption: "sede",
                type: "selectBox"
//                ,
//                required: true
            },
            {
                name: "usuario",
                caption: "usuario",
                label: "Pax principal",
                type: "selectTokenField",
                toolTip: self.tr("Busca el usuario principal de aplicación a tomar el viaje")
//                ,
//                visible: true
//                ,
//                required: true
            },
            {
                name: "plantillas",
                label: "Plantillas",
                caption: "plantillas",
                type: "selectBox"
            },
            {
                name: "booking_id_journey",
                caption: "booking_id_journey",
                label: "No Booking",
                type: "textField",
                required: false
            },
            {
                name: "vuelo_numero",
                caption: "vuelo_numero",
                label: "No Vuelo",
                type: "textField",
                required: false
            },
            {
                name: "cod_compra",
                caption: "cod_compra",
                label: "Código autorizacion compra",
                type: "textField",
                required: false
            },
            {
                name: "observaciones_servicio",
                caption: "observaciones_servicio",
                label: "Obs",
                type: "textField"
            },
            {
                name: "observaciones_servicio_button",
                caption: "observaciones_servicio_button",
                label: "Observaciones",
                type: "button"
            },
            {
                name: "tipo_pago",
                caption: "tipo_pago",
                label: "Forma de pago",
                type: "selectBox",
                required: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "nom_rutas",
                caption: "nom_rutas",
                label: "Rutas configuradas",
                type: "selectBox"
//                ,
//                required: false
            },

            {
                name: "direccion_a",
                label: "<span class='iconMarkerLabel iconMarkerLabelA'>A</span> <strong>Dirección de partida</strong>",
                caption: "direccion_a",
                type: "textField",
//                mode: "search",
                required: false
            },
            {
                name: "direccion_a_latitud",
                label: "",
                caption: "direccion_a_latitud",
                type: "textField",
                required: false
//                ,
//                visible: false
            },
            {
                name: "direccion_a_longitud",
                label: "",
                caption: "direccion_a_longitud",
                type: "textField",
                required: false
//                ,
//                visible: false
            },
            {
                name: "direccion_a_ciudad",
                label: "",
                caption: "direccion_a_ciudad",
                type: "textField",
                required: false
//                ,
//                visible: false
            },
            {
                name: "direccion_a_pais",
                label: "",
                caption: "direccion_a_pais",
                type: "textField",
                required: false
//                ,
//                visible: false
            },
            {
                name: "direccion_invertir",
                caption: "direccion_invertir",
                label: "",
                type: "button",
                icon: qxnw.config.execIcon("object-flip-horizontal")
            },
            {
                name: "direccion_b",
                label: "<span class='iconMarkerLabel iconMarkerLabelB'>B</span> <strong>Dirección de destino</strong>",
                caption: "direccion_b",
                type: "textField",
                required: false
            },
            {
                name: "direccion_b_latitud",
                label: "",
                caption: "direccion_b_latitud",
                type: "textField",
                required: false
//                ,
//                visible: false
            },
            {
                name: "direccion_b_longitud",
                label: "",
                caption: "direccion_b_longitud",
                type: "textField",
                required: false
//                ,
//                visible: false
            },
            {
                name: "direccion_b_ciudad",
                label: "",
                caption: "direccion_b_ciudad",
                type: "textField",
                required: false
//                ,
//                visible: false
            },
            {
                name: "fecha",
                label: "Fecha servicio",
                type: "dateField"
            },
            {
                name: "hora",
                label: "Hora servicio",
                type: "timeField"
            },
            {
                name: "fecha_final_estimada",
                label: "Fecha final estimada",
                type: "dateTimeField"
            },
            {
                name: "usar_fecha_global",
                type: "checkBox",
                label: self.tr("Aplicar a rutas"),
                toolTip: self.tr("Aplica esta fecha a todas las rutas sin cambiar la hora, solo la fecha en caso de que programes varias rutas.")
            },
            {
                name: "paradas_adicionales_iniciales_creacion",
                caption: "paradas_adicionales_iniciales_creacion",
                label: "Total pax",
                type: "textField"
//                ,
//                toolTip: self.tr("Estable el total de paradas, pasajeros y/o servicios.")
            },
//            {
//                name: "",
//                type: "endGroup",
//                icon: ""
//            },
//            {
//                name: "",
//                type: "startGroup",
//                icon: "",
//                mode: "horizontal"
//            },
            {
                name: "moneda",
                caption: "moneda",
                label: "Moneda",
                type: "textField"
//                ,
//                required: false
            },
            {
                name: "tipo_servicio",
                caption: "tipo_servicio",
                label: "Tipo servicio / tarifa",
                type: "selectBox"
//                ,
//                required: false
            },
            {
                name: "valor",
                caption: "valor",
                label: "Valor servicio",
                type: "textField"
            },
            {
                name: "adjunto_cotizacion",
                label: self.tr("Adjunto"),
                type: "uploader",
                mode: "rename"
//                ,
//                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.form.setFields(fields);

//        self.form.ui.sede.setRequired(true);
//        self.form.setRequired("sede", true);

        self.setFieldVisibility(self.form.ui.booking_id_journey, "excluded");
        self.setFieldVisibility(self.form.ui.plantillas, "excluded");
        self.setFieldVisibility(self.form.ui.observaciones_servicio, "excluded");
        self.setFieldVisibility(self.form.ui.adjunto_cotizacion, "excluded");
        self.setFieldVisibility(self.form.ui.moneda, "excluded");
//        self.form.ui.observaciones_servicio_button.setMaxWidth(70);
//        self.form.ui.observaciones_servicio_button.setMinWidth(70);
//        self.setFieldVisibility(self.form.ui.tipo_pago, "excluded");
//        self.setFieldVisibility(self.form.ui.tipo_servicio, "excluded");

//        self.form.ui.paradas_adicionales_iniciales_creacion.setMaxWidth(50);
//        self.form.ui.paradas_adicionales_iniciales_creacion.setMinWidth(50);
//        self.form.ui.plantillas.setMaxWidth(50);
//        self.form.ui.plantillas.setMinWidth(50);
        self.form.ui.id_servicio_enc.setMaxWidth(50);
        self.form.ui.id_servicio_enc.setMinWidth(50);
        self.setFieldVisibility(self.form.ui.id_servicio_enc, "excluded");

        self.setFieldVisibility(self.form.ui.direccion_a_ciudad, "excluded");
        self.setFieldVisibility(self.form.ui.direccion_a_pais, "excluded");
        self.form.ui.direccion_a_ciudad.setPlaceholder("Ciudad partida");
        self.form.ui.direccion_a_pais.setPlaceholder("Pais partida");
        self.setFieldVisibility(self.form.ui.direccion_a_latitud, "excluded");
        self.form.ui.direccion_a_latitud.setPlaceholder("Latitud partida");
        self.setFieldVisibility(self.form.ui.direccion_a_longitud, "excluded");
        self.form.ui.direccion_a_longitud.setPlaceholder("Longitud partida");
        self.setFieldVisibility(self.form.ui.direccion_b_ciudad, "excluded");
        self.form.ui.direccion_b_ciudad.setPlaceholder("Ciudad destino");
        self.setFieldVisibility(self.form.ui.direccion_b_latitud, "excluded");
        self.form.ui.direccion_b_latitud.setPlaceholder("Latitud destino");
        self.setFieldVisibility(self.form.ui.direccion_b_longitud, "excluded");
        self.form.ui.direccion_b_longitud.setPlaceholder("Longitud destino");

//        self.setFieldVisibility(self.form.ui.buscar_conductor, "excluded");
        self.form.ui.buscar_conductor.setPlaceholder("Placa Doc Nombre");
//        self.form.ui.buscar_conductor.setMaxWidth(100);
//        self.form.ui.buscar_conductor.setMinWidth(100);

//        self.form.ui.servicio_para.setMaxWidth(65);
//        self.form.ui.servicio_para.setMinWidth(65);

//        self.form.ui.sentido.setMaxWidth(90);
//        self.form.ui.sentido.setMinWidth(90);

//        self.form.ui.ciudad.setMaxWidth(100);
//        self.form.ui.ciudad.setMinWidth(100);
//        self.form.ui.sede.setMaxWidth(80);
//        self.form.ui.sede.setMinWidth(80);
//        self.form.ui.cliente.setMaxWidth(80);
//        self.form.ui.cliente.setMinWidth(80);

//        self.form.ui.fecha.setMaxWidth(150);
//        self.form.ui.fecha.setMinWidth(150);
//        self.form.ui.fecha_final_estimada.setMaxWidth(160);
//        self.form.ui.fecha_final_estimada.setMinWidth(160);
//        self.form.ui.hora.setMaxWidth(160);
//        self.form.ui.hora.setMinWidth(160);
//        self.form.ui.usar_fecha_global.setMaxWidth(42);
//        self.form.ui.usar_fecha_global.setMinWidth(42);
//        self.form.ui.direccion_a.setMaxWidth(200);
//        self.form.ui.direccion_b.setMaxWidth(200);

        self.form.ui.direccion_a.setMinWidth(250);
        self.form.ui.direccion_b.setMinWidth(250);

        self.form.ui.vuelo_numero.setMaxWidth(80);
        self.form.ui.vuelo_numero.setMinWidth(80);

        self.form.ui.direccion_invertir.setMaxWidth(40);
        self.form.ui.direccion_invertir.setMinWidth(40);
//        self.form.ui.direccion_invertir.setMaxHeight(30);
//        self.form.ui.direccion_invertir.setMinHeight(30);
//        qxnw.utils.addClassToElement(self.form.ui.direccion_invertir, "btn_blueAdmi");

        self.setFieldVisibility(self.form.ui.creado_por_pc, "excluded");
        self.setFieldVisibility(self.form.ui.cod_compra, "excluded");
        self.setFieldVisibility(self.form.ui.nom_rutas, "excluded");

        self.form.ui.buscar_conductor.addListener("keypress", function (e) {
            var val = this.getValue();
            console.log("val", val);
//            if (e.getKeyIdentifier() == "Enter" && qxnw.utils.evalueData(val)) {
            if (e.getKeyIdentifier() == "Enter") {
                self.populateTree();
            }
        });

        self.container = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            marginTop: 0
        });
//        var ancho = window.innerWidth;
        var alto = window.innerHeight;
        self.containerLeft = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
            marginTop: -30,
            maxHeight: alto - 100
//            maxHeight: alto - 190
        });
        self.container.add(self.containerLeft, {
            flex: 100
        });
        self.containerRight = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            marginTop: 0,
            maxWidth: 500,
//            maxHeight: alto - 155
            maxHeight: alto - 220
        });
        self.container.add(self.containerRight, {
            flex: 1
        });
        self.containerFilters.add(self.form.masterContainer, {
            flex: 1
        });
        self.mapa = new enrutamiento.forms.f_mapa_libre();
        self.containerLeft.add(self.mapa.masterContainer, {
            flex: 10
        });
        self.rightWidget.addBefore(self.container, self.tabView);

        self.navTableEnrutarPass = new enrutamiento.forms.f_enrutamiento_pasajeros(self);

        self.containerRight.add(self.navTableEnrutarPass.masterContainer, {
            flex: 1
        });

        self.navTableEnrutarPass.list1.addListener("click", function (e) {
            var s = self.navTableEnrutarPass.list1.getSelection();
            console.log("self.navTableEnrutarPass.list1:::click:::s", s);
            if (s.length == 0) {
                console.log("No hay data");
                return false;
            }
            var model = s[0].getModel();

            console.log("model", model);

            if (!qxnw.utils.evalueData(model.latitud) || !qxnw.utils.evalueData(model.longitud)) {
                console.log("User sin coordenadas");
                return false;
            }

            self.animaMarkerOutAll(model);

            var location = new google.maps.LatLng(model.latitud, model.longitud);
            self.mapa.googleMap.map.setCenter(location);
        });
        self.navTableEnrutarPass.list2.addListener("click", function (e) {
            var s = self.navTableEnrutarPass.list2.getSelection();
            console.log("self.navTableEnrutarPass.list2:::click:::s", s);
            if (typeof s[0] !== 'undefined') {
                var model = s[0].getModel();
                self.animaMarkerOutAll(model);
                var location = new google.maps.LatLng(model.latitud, model.longitud);
                self.mapa.googleMap.map.setCenter(location);
            }
        });

        self.navTableEnrutarPass.onDropRight = function (e) {
            console.log("self.navTableEnrutarPass.onDropRight:::e", e);
            var data = e.getModel();
            console.log("self.navTableEnrutarPass.onDropRight:::data", data);

            self.navTableEnrutarPass.list2.remove(e);

            var selectItem = new qxnw.widgets.listItem(data.pasajero);
            data.item_qxnw = selectItem;
            selectItem.setModel(data);
            console.log("self.navTableEnrutarPass.onDropRight:::selectItem", selectItem);
            self.navTableEnrutarPass.list1.add(selectItem);

            var marker = self.markerc["" + data.id + ""];
            console.log("self.navTableEnrutarPass.onDropRight:::marker", marker);
            if (qxnw.utils.evalueData(marker)) {
                google.maps.event.trigger(marker, 'click');
            } else {
                self.navTableEnrutarPass.list2.add(selectItem);
//                self.navTableEnrutarPass.list1.remove(selectItem);
//                self.navTableEnrutarPass.list1.remove(e);

            }
        };

        self.navTableEnrutarPass.onDropLeft = function (e) {
            console.log("self.navTableEnrutarPass.onDropLeft", e);
            var data = e.getModel();

            self.navTableEnrutarPass.list1.remove(e);

            var selectItem = new qxnw.widgets.listItem(data.pasajero);
            data.item_qxnw = selectItem;
            selectItem.setModel(data);
            self.navTableEnrutarPass.list2.add(selectItem);

            var marker = self.markerc["" + data.id + ""];
            google.maps.event.trigger(marker, 'click');
        };

        var buttons = [
            {
                label: 'Add PAX',
                name: 'nuevo_pasajero',
                icon: qxnw.config.execIcon("list-add")
            },
            {
                label: 'Importar PAX',
                name: 'importar',
                icon: qxnw.config.execIcon("go-top")
            },
            {
                label: 'Pre-enrutar',
                name: 'pre_enrutar',
                icon: qxnw.config.execIcon("dialog-apply")
            },
            {
                label: 'Cerrar',
                name: 'cancelar',
                icon: qxnw.config.execIcon("dialog-close")
            },
            {
                label: 'Guardar',
                name: 'crear_servicio',
                icon: qxnw.config.execIcon("dialog-apply")
            }
        ];
        self.addButtons(buttons);

        //        qxnw.utils.addClassToElement(self.form.ui.nuevo_pasajero, "btn_blueAdmi");
//        self.form.ui.nuevo_pasajero.setLabel(self.tr("Crear pasajeros"));
//        self.form.ui.nuevo_pasajero.setMaxWidth(200);
//        self.form.ui.nuevo_pasajero.setMinWidth(200);
//        self.form.ui.nuevo_pasajero.setMaxHeight(30);
//        self.form.ui.nuevo_pasajero.setMinHeight(30);
//        self.form.ui.nuevo_pasajero.setIcon(qxnw.config.execIcon("list-add"));
//        self.form.ui.nuevo_pasajero.addListener("click", function () {
        self.form.ui.observaciones_servicio_button.addListener("click", function () {
            self.openObservaciones();
        });

        self.ui.nuevo_pasajero.addListener("click", function () {
            self.slotNuevo(function (data) {
                if (data.tipo == "PASAJERO_PRINCIPAL") {
                    var usuario = data.nombre;
                    if (qxnw.utils.evalueData(data.usuario_pasajero)) {
                        usuario = data.usuario_pasajero;
                    } else
                    if (qxnw.utils.evalueData(data.correo)) {
                        usuario = data.correo;
                    }
                    var telefono = null;
                    if (qxnw.utils.evalueData(data.telefono)) {
                        telefono = data.telefono;
                    }
                    var item = {
                        id: 1,
                        usuario: usuario,
                        nombre: data.nombre,
                        celular: telefono
                    };
                    console.log("item", item);
                    self.form.ui.usuario.addToken(item);
                    return;
                }
//                self.navTableEnrutarPass.addRows([data]);
                var selectItem = new qxnw.widgets.listItem(data.pasajero);
                data.item_qxnw = selectItem;
                selectItem.setModel(data);
                self.navTableEnrutarPass.list1.add(selectItem);
                self.creaMarkersEvaluePasajeros(data);
            });
        });

//        qxnw.utils.addClassToElement(self.form.ui.importar, "btn_redAdmi");
//        self.form.ui.importar.setLabel(self.tr("Importar pasajeros"));
//        self.form.ui.importar.setMaxWidth(200);
//        self.form.ui.importar.setMinWidth(200);
//        self.form.ui.importar.setMaxHeight(30);
//        self.form.ui.importar.setMinHeight(30);
//        self.form.ui.importar.setIcon(qxnw.config.execIcon("go-top"));
//        self.form.ui.importar.addListener("click", function () {
        self.ui.importar.addListener("click", function () {
            var d = new nw_import_data.imp_pasajeros_enrutamiento(function (data) {
                self.navTableEnrutarPass.populateLote();
                self.creaRutasByExcel(data);
            }, self);
            d.setModal(true);
            d.show();
        });

        qxnw.utils.addClassToElement(self.ui.crear_servicio, "btn_blueAdmi");
        qxnw.utils.addClassToElement(self.ui.crear_servicio, "btn_confirmar_servicio");
//        self.ui.crear_servicio.setLabel(self.tr("Confirmar Servicio"));
//        self.ui.crear_servicio.setIcon(qxnw.config.execIcon("dialog-apply"));
//        self.ui.crear_servicio.setMaxWidth(200);
//        self.ui.crear_servicio.setMinWidth(200);
//        self.ui.crear_servicio.setMaxHeight(30);
//        self.ui.crear_servicio.setMinHeight(30);
        self.ui.crear_servicio.addListener("execute", function () {
            self.crearServicio();
        });

//        qxnw.utils.addClassToElement(self.ui.crear_servicio, "btn_blueAdmi");
//        qxnw.utils.addClassToElement(self.ui.crear_servicio, "btn_confirmar_servicio");
//        self.ui.crear_servicio.setLabel(self.tr("Confirmar Servicio"));
//        self.ui.crear_servicio.setIcon(qxnw.config.execIcon("dialog-apply"));
//        self.ui.pre_enrutar.setMaxWidth(200);
//        self.ui.pre_enrutar.setMinWidth(200);
        self.ui.pre_enrutar.setMaxHeight(30);
        self.ui.pre_enrutar.setMinHeight(30);

        self.ui.pre_enrutar.addListener("execute", function () {
            self.preEnrutar();
        });

//        self.ui.cancelar.addListener("execute", function () {
//            qxnw.utils.question("¿Desea limpiar el formulario?", function (e) {
//                if (e) {
//                    self.closeReset();
//                }
//            });
//        });
//        self.ui.cerrar.addListener("execute", function () {
        self.ui.cancelar.addListener("execute", function () {
            qxnw.utils.question("¿Desea cerrar el formulario?", function (e) {
                if (e) {
                    self.reject();
                }
            });
        });

//        if (self.config.usa_origen_viaje == "SI") {
        var data = {};
        data.table = "edo_creacion_viajes_por";
        self.form.ui.trf.populate("master", "populate", data);
//        }
//         else {
        var data = {};
        data["Back"] = "Back";
        data["AppPax"] = "App pax";
        data["Booking"] = "Booking";
        qxnw.utils.populateSelectFromArray(self.form.ui.creado_por_pc, data);
//        }
        if (self.config.usa_medios_pago == "SI") {
            var data = {};
            data.table = "edo_formas_pago";
            self.form.ui.tipo_pago.populate("master", "populate", data);
        } else {
            var data = {};
            data[""] = "Elija";
            data["efectivo"] = "Efectivo";
            data["tarjeta_credito"] = "Tarjeta Crédito";
            data["convenio"] = "Convenio";
            qxnw.utils.populateSelectFromArray(self.form.ui.tipo_pago, data);
        }
        var data = {};
        data[""] = "Elija";
        qxnw.utils.populateSelectFromArray(self.form.ui.sede, data);

        self.form.ui.fecha.addListener("changeValue", function (e) {
//            var data = self.form.getRecord();
//            console.log("fecha:::data", data);
            var val = this.getValue();
            console.log("fecha:::changeValue:::val", val);
            if (qxnw.utils.evalueData(val)) {
                self.creaPolylineAdvanced();
            }
        });
        if (self.config.usa_destinos_conf == "SI") {
            var dat = {};
            dat[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(self.form.ui.nom_rutas, dat);
            dat.table = "edo_destino_viajes";
            self.form.ui.nom_rutas.populate("master", "populate", dat);
            self.form.ui.nom_rutas.addListener("changeValue", function (e) {
                var ruta = this.getValue();
                console.log(ruta);
//            self.form.ui.direccion_a.setValue(ruta.nom_rutas_model.ciudad_o_lugar_origen);
                if (ruta.nom_rutas_model != null && ruta.nom_rutas_model != "") {
                    self.form.ui.direccion_b.setValue(ruta.nom_rutas_model.direccion);
                    if (ruta.nom_rutas_model.latitud != null && ruta.nom_rutas_model.latitud != "0"
                            && ruta.nom_rutas_model.latitud != "" && ruta.nom_rutas_model.longitud != ""
                            && ruta.nom_rutas_model.longitud != null && ruta.nom_rutas_model.longitud != "0") {
                        self.form.ui.direccion_b_ciudad.setValue(ruta.nom_rutas_model.ciudad);
                        self.form.ui.direccion_b_latitud.setValue(ruta.nom_rutas_model.latitud);
                        self.form.ui.direccion_b_longitud.setValue(ruta.nom_rutas_model.longitud);
                    } else {
                        self.form.ui.direccion_b_ciudad.setValue("");
                        self.form.ui.direccion_b_latitud.setValue("");
                        self.form.ui.direccion_b_longitud.setValue("");

                    }

                }
            });
        }

        var data = {};
        data[""] = "Tarifas inactivas";
        qxnw.utils.populateSelectFromArray(self.form.ui.tipo_servicio, data);

        if (self.config.back_maneja_tipos_de_servicios === "SI") {
            if (self.config.back_maneja_tarifas !== "SI") {

                self.form.ui.tipo_servicio.removeAll();
                var data = {};
                data[""] = "Elija";
                qxnw.utils.populateSelectFromArray(self.form.ui.tipo_servicio, data);

                self.populateServiciosNormal();
            } else {

                self.form.ui.tipo_servicio.removeAll();
                var data = {};
                data[""] = "Primero busca origen y destino";
                qxnw.utils.populateSelectFromArray(self.form.ui.tipo_servicio, data);
            }
        }
        self.form.ui.tipo_servicio.addListener("changeValue", function (e) {
            var val = this.getValue();
            var data = self.form.getRecord();
//            console.log("hora:::changeValue:::data", data);
//            console.log("hora:::changeValue:::val", val);
//            if (qxnw.utils.evalueData(data.valor)) {
//                return;
//            }
            if (qxnw.utils.evalueData(val.tipo_servicio)) {
                if (qxnw.utils.evalueData(val.tipo_servicio_model.valor_viaje)) {

                    if (!qxnw.utils.evalueData(self.tipoServicioSet)) {
                        self.form.ui.valor.setValue(val.tipo_servicio_model.valor_viaje);
                    }

                    self.times_dis_travel_gps = {
                        distance: {
                            text: val.tipo_servicio_model.others.totalunimetros + " mtrs",
                            value: val.tipo_servicio_model.others.totalunimetros
                        },
                        duration: {
                            text: val.tipo_servicio_model.others.totaluniminutos + " mins",
                            value: val.tipo_servicio_model.others.totaluniminutos
                        },
                        duration_in_traffic: {
                            text: val.tipo_servicio_model.others.totaluniminutos + " mins",
                            value: val.tipo_servicio_model.others.totaluniminutos
                        },
                        start_address: data.direccion_a,
                        end_address: data.direccion_b,
                        via_waypoint: 0
                    };
                    self.setHTMLDistance();
                }
            }
        });

        self.form.ui.hora.hour.addListener("changeValue", function (e) {
//        self.form.ui.hora.addListener("changeValue", function (e) {
//            var data = self.form.getRecord();
//            console.log("data", data);
            var val = this.getValue();
            console.log("hora:::changeValue:::val", val);
//            console.log(e.getData());
            if (qxnw.utils.evalueData(val)) {
                self.creaPolylineAdvanced();
            }
        });

        self.timeOrDesBounds = null;
        self.form.ui.direccion_a_longitud.addListener("changeValue", function (e) {
//        self.form.ui.direccion_a.addListener("changeValue", function (e) {
//            setTimeout(function () {

            var data = self.form.getRecord();
//                console.log("self.markerOrigen", self.markerOrigen);
            console.log("direccion_a_longitud:::changeValue:::data", data);
            if (qxnw.utils.evalueData(self.markerOrigen)) {
                self.markerOrigen.setMap(null);
                self.markerOrigen = null;
            }
            var val = {};
            val.id = "origen_marker";
            val.latitud = data.direccion_a_latitud;
            val.longitud = data.direccion_a_longitud;
            val.icon = "/lib_mobile/driver/img/marker_a.png";
            val.centerMap = true;
            val.openAtClick = true;
            val.title = "";
            val.titleHover = val.nombre;
//                val.callbackMarker = function (marker) {
//                    self.markerOrigen = marker;
//                };
            self.markerOrigen = self.addMarkerInMap(val, "origen");

            self.creaPolylineAdvanced();


            clearTimeout(self.timeOrDesBounds);
            self.timeOrDesBounds = setTimeout(function () {
//                self.populateTiposServiciosTarifas();
                self.centerOrigenDestino();
            }, 800);
//            }, 1000);
        });

        self.form.ui.direccion_b_longitud.addListener("changeValue", function (e) {
//        self.form.ui.direccion_b.addListener("changeValue", function (e) {
//            setTimeout(function () {
            var data = self.form.getRecord();
            console.log("direccion_b_longitud:::changeValue:::data", data);
//                console.log("self.markerDestino", self.markerDestino);
            if (qxnw.utils.evalueData(self.markerDestino)) {
                self.markerDestino.setMap(null);
                self.markerDestino = null;
            }
            var val = {};
            val.id = "origen_marker";
            val.latitud = data.direccion_b_latitud;
            val.longitud = data.direccion_b_longitud;
            val.icon = "/lib_mobile/driver/img/marker_b.png";
            val.centerMap = true;
            val.openAtClick = true;
            val.title = "";
            val.titleHover = val.nombre;
//                val.callbackMarker = function (marker) {
//                    self.markerDestino = marker;
//                };
//                val.callbackOnCreate = function (marker) {
//                    self.markerDestino = marker;
//                };
            self.markerDestino = self.addMarkerInMap(val, "origen");

            self.creaPolylineAdvanced();


            clearTimeout(self.timeOrDesBounds);
            self.timeOrDesBounds = setTimeout(function () {
//                self.populateTiposServiciosTarifas();
                self.centerOrigenDestino();
            }, 800);

//            }, 1000);
        });

        self.form.ui.direccion_a_ciudad.addListener("changeValue", function (e) {
            self.populateTiposServiciosTarifas();
        });
        self.form.ui.direccion_b_ciudad.addListener("changeValue", function (e) {
            self.populateTiposServiciosTarifas();
        });

        self.form.ui.plantillas.addListener("changeSelection", function (e) {
            var data = this.getValue();
            var val = data.plantillas_model;
            if (!main.evalueData(val)) {
                return false;
            }
            qxnw.utils.question("¿Desea restaurar la plantilla de rutas <strong>" + val.nombre + "</strong> seleccionada?", function (e) {
                if (e) {
                    self.closeReset();
                    self.restaurarPlantilla(val);
                }
            });
        });

//        console.log("self.up", self.up);
        var item = {
            id: self.up.terminal,
            nombre: "Por defecto"
        };
//        console.log("item", item);
        self.form.ui.terminal.addToken(item);

        self.form.ui.terminal.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            var func = function (r) {
                self.form.ui.terminal.setModelData(r);
            };
            rpc.exec("populateTokenTerminales", data, func);
        }, this);
        self.form.ui.terminal.addListener("addItem", function (e) {
            var val = e.getData();
            console.log("val", val);
        }, this);

        self.form.ui.flota.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            var func = function (r) {
                self.form.ui.flota.setModelData(r);
            };
            rpc.exec("populateTokenFlotas", data, func);
        }, this);
        self.form.ui.flota.addListener("addItem", function (e) {
            var val = e.getData();
            console.log("val", val);
        }, this);

//        self.form.ui.tipo_servicio.addListener("loadData", function (e) {
//            var data = {};
//            data.token = e.getData();
//            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
//            rpc.setAsync(true);
//            var func = function (r) {
//                self.form.ui.tipo_servicio.setModelData(r);
//            };
//            rpc.exec("populateTokenTiposServicio", data, func);
//        }, this);
//        self.form.ui.tipo_servicio.addListener("addItem", function (e) {
//            var val = e.getData();
//            console.log("val", val);
//        }, this);


        self.form.ui.cliente.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            var func = function (r) {
                self.form.ui.cliente.setModelData(r);
            };
            rpc.exec("populateTokenClientes", data, func);
        }, this);
        self.markerCliente = null;
        self.form.ui.cliente.addListener("addItem", function (e) {
            if (main.evalueData(self.markerCliente)) {
                self.markerCliente.setMap(null);
                self.markerCliente = null;
            }
            var val = e.getData();
            console.log("val", val);

            self.form.ui.sede.removeAll();

            var data = {};
            data[""] = "Elija";
            qxnw.utils.populateSelectFromArray(self.form.ui.sede, data);

            var data = {
                table: "edo_centro_costos",
                where: "id_cliente=" + val.id
            };
            qxnw.utils.populateSelect(self.form.ui.sede, "master", "populate", data);
//            qxnw.utils.populateSelect(self.ui.empresa, "empresas", "populateEmpresas", tipo_empresa["tipo_empresa"]);
        }, this);

        self.form.ui.usuario.addListener("loadData", function (e) {
            var cliente = self.form.ui.cliente.getValue();
            console.log("cliente", cliente);
            var data = {};
            data.token = e.getData();
            if (qxnw.utils.evalueData(cliente)) {
                if (cliente.length > 0) {
                    data.cliente = cliente[0].id;
                }
            }
            console.log("usuario:::dataSend", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "clientes");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("usuario:::responseServer", r);
                self.form.ui.usuario.setModelData(r);
            };
            rpc.exec("traeUsuariosPopulate", data, func);
        }, this);
//        self.form.ui.usuario.addListener("addItem", function (e) {
//            var val = e.getData();
//            console.log("val", val);
//        }, this);

        self.form.ui.sede.addListener("changeSelection", function (e) {
            var data = this.getValue();
            var val = data.sede_model;
            console.log("sede:::changeSelection:::val", val);
            if (!main.evalueData(val)) {
                return false;
            }
            if (!self.restaurandoPlantilla) {
//            var item = {
//                id: val.cliente_usuario_id,
//                usuario: val.cliente_usuario,
//                nombre: val.nombre_completo,
//                celular: val.telefono
//            };
//            console.log("item", item);
//            self.form.ui.usuario.addToken(item);
                var data = {};
                data.id = val.cliente_usuario_id;
                var rpc = new qxnw.rpc(self.getRpcUrl(), "clientes");
                rpc.setAsync(true);
                var func = function (r) {
                    console.log("r", r);
//                self.form.ui.usuario.setModelData(r);
                    console.log("r[0]", r[0]);
                    self.form.ui.usuario.addToken(r[0]);
                };
                rpc.exec("traeUsuariosPopulate", data, func);

                var record = self.form.getRecord();
                var field = "direccion_b";
                if (record.sentido != "EJECUTIVO") {
                    if (record.sentido == "SALIDA") {
                        field = "direccion_a";
                    }
                    self.setDirections({
                        direccion: val.direccion,
                        latitud: val.latitud,
                        longitud: val.longitud,
                        ciudad: val.ciudad_text
                    }, field);
                }
            }

            var id = val.id;
            self.populatePlantillas(id);

            if (!main.evalueData(val.cliente_usuario) || !main.evalueData(val.cliente_usuario_id) || !main.evalueData(val.cliente_correo)) {
                qxnw.utils.information("La sede presenta novedad, debe validar que esté configurada el Correo notificaciones, Usuario APP asociado y Usuario APP asociado ID. Valide con el administrador del sistema.");
                return false;
            }
            if (!main.evalueData(val.latitud) || !main.evalueData(val.longitud)) {
                qxnw.utils.information("La sede no tiene configurada la latitud ni longitud. Valide con el administrador del sistema.");
                return false;
            }
            val.id = id + "_cliente";
            val.icon = "/lib_mobile/driver/img/pin_negro_edificio4.png";
            val.centerMap = true;
            val.openAtClick = true;
            val.title = "";
            val.titleHover = val.nombre;
            val.callbackMarker = function (marker) {
                self.markerCliente = marker;
            };
            self.addMarkerInMap(val, "cliente");

            if (typeof google == "undefined") {
                return false;
            }
            var location = new google.maps.LatLng(val.latitud, val.longitud);
            self.mapa.googleMap.map.setCenter(location);
        });

        self.form.ui.ciudad.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            var func = function (r) {
                self.form.ui.ciudad.setModelData(r);
            };
            rpc.exec("populateTokenCiudades", data, func);
        }, this);
        self.form.ui.ciudad.addListener("addItem", function (e) {
            var val = e.getData();
            self.setPositionCustomer(val);
            if (!self.restaurandoPlantilla) {
                self.populateTree();
            }
        }, this);

        var data = {};
        data["reservado"] = "Reservado";
        data["ahora"] = "Inmediato";
        qxnw.utils.populateSelectFromArray(self.form.ui.servicio_para, data);

        self.form.ui.servicio_para.addListener("changeSelection", function (e) {
            var data = this.getValue();
            console.log("self.form.ui.servicio_para.addListener(changeSelection:::data", data);
            if (data.servicio_para == "ahora") {
                self.form.ui.fecha.setValue(qxnw.utils.getActualDate());
                self.form.ui.hora.setValue(qxnw.utils.getActualHour());
//                self.setFieldVisibility(self.form.ui.fecha, "excluded");
//                self.setFieldVisibility(self.form.ui.hora, "excluded");
            } else {
//                self.setFieldVisibility(self.form.ui.fecha, "visible");
//                self.setFieldVisibility(self.form.ui.hora, "visible");
            }
        });
        if (qxnw.utils.evalueData(self.config.servicio_para_por_defecto)) {
            self.form.ui.servicio_para.setValue(self.config.servicio_para_por_defecto);
        }

        var data = {};
//        data[""] = "Elija";
        data["ENTRADA"] = "ENTRADA";
        data["SALIDA"] = "SALIDA";
        data["EJECUTIVO"] = "EJECUTIVO";
        qxnw.utils.populateSelectFromArray(self.form.ui.sentido, data);

        self.form.ui.direccion_invertir.addListener("click", function (e) {
            self.changeDirections(true);
        });

        self.form.ui.sentido.addListener("changeSelection", function (e) {
            var data = this.getValue();
            console.log("self.form.ui.sentido.addListener(changeSelection:::data", data);
            self.changeDirections();
        });


        self.isCreated = false;
        self.addListener("appear", function () {
            if (!self.isCreated) {
                qx.bom.element.Class.add(self.getContentElement().getDomElement(), "container_form_enrutamasivo");

                addCl(self.form.ui.direccion_a, "direccion_a_widget", function (e) {
                    self.form.ui.direccion_a_latitud.setValue(e.location.lat().toString());
                    self.form.ui.direccion_a_longitud.setValue(e.location.lng().toString());
                    self.form.ui.direccion_a_ciudad.setValue(e.ciudad);
                    self.form.ui.direccion_a_pais.setValue(e.pais);
                    self.setCityHtml(".direccionACiudadSpan", e.ciudad);
                });
                addCl(self.form.ui.direccion_b, "direccion_b_widget", function (e) {
                    self.form.ui.direccion_b_latitud.setValue(e.location.lat().toString());
                    self.form.ui.direccion_b_longitud.setValue(e.location.lng().toString());
                    self.form.ui.direccion_b_ciudad.setValue(e.ciudad);
                    self.setCityHtml(".direccionBCiudadSpan", e.ciudad);
                });

                self.ctnr.setVisibility("excluded");

                self.showTreeDrivers("excluded");

//            if (main.isCustomer()) {
//            self.allLeftContainer.setVisibility("excluded");
//            self.leftWidget.setVisibility("excluded");
//            self.leftScroller.setVisibility("excluded");
//            }
                self.isCreated = true;
            }
        });

        function addCl(widget, classname, callback) {
            if (!main.evalueData(widget)) {
                setTimeout(function () {
                    addCl();
                }, 500);
                return false;
            }
            if (!main.evalueData(widget.getContentElement())) {
                setTimeout(function () {
                    addCl();
                }, 500);
                return false;
            }
            if (!main.evalueData(widget.getContentElement().getDomElement())) {
                setTimeout(function () {
                    addCl();
                }, 500);
                return false;
            }
            qx.bom.element.Class.add(widget.getContentElement().getDomElement(), classname);
            main.autocomplete("." + classname, false, function (e) {
                callback(e);
            });
        }

//        self.setAllowClose(false);
//        self.setAllowMinimize(false);

        self.setDataPorDefecto();

        self.setFieldsSettings();


        self.perms = main.getPermiserv();
        var up = qxnw.userPolicies.getUserData();
//        flota
        console.log("self.perms", self.perms);
        console.log("up", up);
        console.log("up.bodega", up.bodega);
        if (self.perms.form_conductor_flota == "false" || self.perms.form_conductor_flota == false) {
            self.form.ui.flota.setEnabled(false);
            if (qxnw.utils.evalueData(up.bodega)) {
                self.form.ui.flota.setValue(up.bodega);
            }
        }

    },
    members: {
        showTreeDrivers: function showTreeDrivers(mode) {
            var self = this;
            self.allLeftContainer.setVisibility(mode);
            self.leftWidget.setVisibility(mode);
            self.leftScroller.setVisibility(mode);
        },
        setFieldsSettings: function setFieldsSettings() {
            var self = this;
            console.log("self.config.crear_viaje_fields_settings", self.config.crear_viaje_fields_settings);
            if (qxnw.utils.evalueData(self.config.crear_viaje_fields_settings, true)) {
                try {
                    var set = JSON.parse(self.config.crear_viaje_fields_settings);
                    console.log("set", set);
                    for (var i = 0; i < set.length; i++) {
                        var fi = set[i];
                        console.log("fi", fi);
                        if (!qxnw.utils.evalueData(fi.field)) {
                            continue;
                        }
                        if (!qxnw.utils.evalueData(self.form.ui[fi.field])) {
                            continue;
                        }
                        if (typeof fi.visible !== "undefined") {
                            if (fi.visible == false || fi.visible == "false") {
                                self.form.setFieldVisibility(self.form.ui[fi.field], "excluded");
                            } else
                            if (fi.visible == true || fi.visible == "true") {
                                self.form.setFieldVisibility(self.form.ui[fi.field], "visible");
                            }
                        }
                        if (typeof fi.required !== "undefined") {
                            if (fi.required == false || fi.required == "false") {
//                                self.form.ui[fi.field].setRequired(false);
                                self.form.setRequired(fi.field, false);
                            }
                            if (fi.required == true || fi.required == "true") {
//                                self.form.ui[fi.field].setRequired(true);
                                self.form.setRequired(fi.field, true);
                            }
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            if (qxnw.utils.evalueData(self.config.crearviajefields_pasajeros_filtros)) {
                if (self.config.crearviajefields_pasajeros_filtros == "NO" || self.config.crearviajefields_pasajeros_filtros == false) {
                    self.navTableEnrutarPass.containerFilters.setVisibility("excluded");
                }
            }


        },
        setDataPorDefecto: function setDataPorDefecto() {
            var self = this;
            console.log("setDataPorDefecto:::self.config", self.config);
            console.log("setDataPorDefecto:::self.config.crear_viaje_cliente_id_por_defecto", self.config.crear_viaje_sentido_por_defecto);
            if (qxnw.utils.evalueData(self.config.crear_viaje_sentido_por_defecto)) {
                self.form.ui.sentido.setValue(self.config.crear_viaje_sentido_por_defecto);
            }

            if (main.isCustomer()) {
//agregar cliente, sede y usuario
                if (qxnw.utils.evalueData(main.empresa_o_flota)) {
                    var data = {};
                    data.set_id_cliente = main.empresa_o_flota;
                    console.log("setDataPorDefectoCUSTOMER:::dataSendToServer:::data", data);
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
                    rpc.setAsync(true);
                    var func = function (r) {
                        console.log("setDataPorDefectoCUSTOMER:::responseServer:::r", r);
                        if (r.length > 0) {
                            self.form.ui.cliente.setModelData(r[0]);

                            var item = {
                                id: r[0].id,
                                nombre: r[0].nombre
                            };
                            self.form.ui.cliente.addToken(item);
                            self.form.ui.cliente.setEnabled(false);

                            self.setFieldVisibility(self.form.ui.plantillas, "excluded");
                            self.setFieldVisibility(self.form.ui.buscar_conductor, "excluded");
                            self.setFieldVisibility(self.form.ui.ciudad, "excluded");
                            self.setFieldVisibility(self.form.ui.terminal, "excluded");
                            self.setFieldVisibility(self.form.ui.flota, "excluded");
//                            self.setFieldVisibility(self.form.ui.fecha_final_estimada, "excluded");
                            self.setFieldVisibility(self.form.ui.usar_fecha_global, "excluded");
                            self.setFieldVisibility(self.form.ui.valor, "excluded");
                            self.setFieldVisibility(self.form.ui.paradas_adicionales_iniciales_creacion, "excluded");

                            self.ui.importar.setVisibility("excluded");
                            self.ui.pre_enrutar.setVisibility("excluded");

                        }
                    };
                    rpc.exec("populateTokenClientes", data, func);
                }
            }
            if (!main.isCustomer()) {
                if (qxnw.utils.evalueData(self.config.crear_viaje_cliente_id_por_defecto)) {
                    var data = {};
                    data.set_id_cliente = self.config.crear_viaje_cliente_id_por_defecto;
                    var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
                    rpc.setAsync(true);
                    var func = function (r) {
                        console.log("setDataPorDefecto:::r", r);
                        if (r.length > 0) {
                            self.form.ui.cliente.setModelData(r[0]);

                            var item = {
                                id: r[0].id,
                                nombre: r[0].nombre
                            };
                            self.form.ui.cliente.addToken(item);

                            if (qxnw.utils.evalueData(self.config.crear_viaje_sede_id_por_defecto)) {
                                self.form.ui.sede.setValue(self.config.crear_viaje_sede_id_por_defecto);
                            }

                            var fecha = qxnw.utils.getActualDate();
                            console.log("fecha", fecha);
                            self.navTableEnrutarPass.ui.fecha_inicial.setValue(fecha + " 00:01:00");
                            self.navTableEnrutarPass.ui.fecha_fin.setValue(fecha + " 23:59:00");

                            self.setFieldVisibility(self.navTableEnrutarPass.ui.lote, "excluded");

                            self.navTableEnrutarPass.ui.estado.setValue("SIN_ENRUTAR");
                            self.navTableEnrutarPass.slotApplyFilters();
                        }
                    };
                    rpc.exec("populateTokenClientes", data, func);
                }
            }
        },
        centerOrigenDestino: function centerOrigenDestino() {
            var self = this;
            var data = self.form.getRecord();
            if (!qxnw.utils.evalueData(data.direccion_a_latitud)
                    || !qxnw.utils.evalueData(data.direccion_a_longitud)
                    || !qxnw.utils.evalueData(data.direccion_b_latitud)
                    || !qxnw.utils.evalueData(data.direccion_b_longitud)
                    ) {
                return false;
            }
            var bounds = new google.maps.LatLngBounds();
            bounds.extend({lat: parseFloat(data.direccion_a_latitud), lng: parseFloat(data.direccion_a_longitud)});
            bounds.extend({lat: parseFloat(data.direccion_b_latitud), lng: parseFloat(data.direccion_b_longitud)});
            self.mapa.googleMap.map.fitBounds(bounds);
//            self.mapa.googleMap.map.setCenter(bounds.getCenter());
        },
        populateTiposServiciosTarifas: function populateTiposServiciosTarifas() {
            var self = this;
            console.log(self.ciudadesHomologadas);
            if (self.config.back_maneja_tarifas !== "SI") {
                return false;
            }
            var form = self.form.getRecord();
            var origen = form.direccion_a_ciudad;
            console.log("valor de origen", origen);
            var destino = form.direccion_b_ciudad;
            console.log("valor de destino", destino);

            var resultados_origen = self.ciudadesHomologadas.filter(item => item.ciudad_homologar === origen);
            var resultados_destino = self.ciudadesHomologadas.filter(item => item.ciudad_homologar === destino);
            console.log("Resultado origen", resultados_origen);
            console.log("resultado destino", resultados_destino);
            if (resultados_destino.length > 0) {
                console.log("resultado destino", resultados_destino[0].ciudad_homologada);
                self.form.ui.direccion_b_ciudad.setValue(resultados_destino[0].ciudad_homologada);
            }
            if (resultados_origen.length > 0) {
                console.log("resultado origen", resultados_origen[0].ciudad_homologada);
                self.form.ui.direccion_a_ciudad.setValue(resultados_origen[0].ciudad_homologada);
            }

            self.form.ui.tipo_servicio.removeAll();

            var data = {};
            data[""] = "Buscando tarifa";
            qxnw.utils.populateSelectFromArray(self.form.ui.tipo_servicio, data);

            var up = qxnw.userPolicies.getUserData();

//            console.log("populateTiposServiciosTarifas:::form", form);
//            console.log("populateTiposServiciosTarifas:::up", up);
            data.cobertura_por_ciudades = "SI";
            if (typeof self.config.cobertura_por_ciudades !== "undefined") {
                data.cobertura_por_ciudades = self.config.cobertura_por_ciudades;
            }
            if (!qxnw.utils.evalueData(form.direccion_a) ||
                    !qxnw.utils.evalueData(form.direccion_a_ciudad) ||
                    !qxnw.utils.evalueData(form.direccion_b) ||
                    !qxnw.utils.evalueData(form.direccion_b_ciudad)
                    ) {
                return false;
            }
            var usu = {};
            usu.empresa = up.company;
            usu.usuario = up.user;
            usu.perfil = up.profile;
            if (qxnw.utils.evalueData(up.bodega)) {
                usu.bodega = up.bodega;
            }
            usu.ciudad_origen = form.direccion_a_ciudad;
            usu.name_place_origen = form.direccion_a_ciudad + " " + form.direccion_a;
            usu.ciudad_destino = form.direccion_b_ciudad;
            usu.name_place_destino = form.direccion_b_ciudad;
            usu.name_place_destino += " " + form.direccion_b;

            usu.name_place_destino_text = usu.name_place_destino;

            console.log("datos variable usu", usu)
//            usu.name_place_destino_text = form.direccion_b_ciudad;

            var lugar_origen = usu.name_place_origen;
            var lugar_destino = usu.name_place_destino;
            var key = "Aeropuerto";

            if (lugar_origen.indexOf(key) !== -1 || lugar_destino.indexOf(key) !== -1) {
                usu.type = "airport";

            } else if (usu.ciudad_origen === usu.ciudad_destino) {
                usu.type = "urbano";
            } else
            if (usu.ciudad_origen !== usu.ciudad_destino) {
                if (typeof usu.ciudad_origen.split(usu.ciudad_destino)[1] != "undefined" || typeof usu.ciudad_destino.split(usu.ciudad_origen)[1] != "undefined") {
                    usu.type = "urbano";
                } else {
                    usu.type = "intermunicipal";
                }

            }
//            usu.type = self.__typeOriginOne;

            usu.cobertura_por_ciudades = data.cobertura_por_ciudades;
            console.log("populateTiposServiciosTarifas:::dataSendServer", usu);

//            qxnw.utils.loadingnw("Consultando tarifas... Por favor espere...", "cargando_axtest");
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            var func = function (r) {
                console.log("populateTiposServiciosTarifas:::responseServer", r);
//                qxnw.utils.loadingnw_remove("cargando_axtest");
                self.continuarSinPoliLyne(r);
            };
            rpc.exec("consultaTarifasAllApp", usu, func);
        },

        slotHomologacionCiudades: function slotHomologacionCiudades() {
            var self = this;
            var usu = {};
            usu.empresa = self.up.company;
            usu.usuario = self.up.user;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            var func = function (r) {
                console.log("ciudades homologadas", r);
                self.ciudadesHomologadas = r;

            };
            rpc.exec("populateCiudadesHomologadas", usu, func);

        },
        continuarSinPoliLyne: function (servicios) {
            var self = this;
            var form = self.form.getRecord();
            var d = main.distance(form.direccion_a_latitud, form.direccion_a_longitud, form.direccion_b_latitud, form.direccion_b_longitud);
            d = (d * 0.001);
            var km = d.toFixed(2);
            var time = main.getTimeToDistanceAndSpeed(km, 15);

            var poly = {};
            poly.tiempo = time * 60;
            console.log("poly.tiempo", poly.tiempo)
            poly.tiempo_text = Math.round(time) + " Minutos";
            poly.total_metros = km * 1000;
            poly.total_metros_text = km + "KM";

            self.mostrarServicios(servicios, poly);
        },
        populateServiciosNormal: function populateServiciosNormal() {
            var self = this;
//            if (self.populateServiciosLaunch) {
//                return;
//            }
            var data = {};
            qxnw.utils.populateSelect(self.form.ui.tipo_servicio, "servicios_admin", "populateTokenTipoServicio", data);

//            self.populateServiciosLaunch = true;
        },
        mostrarServicios: function mostrarServicios(r, poly) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var recargos_total = 0;
            if (r.length <= 0) {

                self.form.ui.tipo_servicio.removeAll();
                var data = {};
                data[""] = "Sin cobertura";
                qxnw.utils.populateSelectFromArray(self.form.ui.tipo_servicio, data);

                self.populateServiciosNormal();
            } else {

                self.form.ui.tipo_servicio.removeAll();

                var data = {};
                data[""] = "¡Tarifa encontrada!";
                qxnw.utils.populateSelectFromArray(self.form.ui.tipo_servicio, data);

                for (var i = 0; i < r.length; i++) {
                    var servi = r[i];
                    console.log("servi", servi);
                    var others = {};
                    var totalunimetros = 0;
                    if (typeof servi.metros !== 'undefined' && servi.metros != "" && parseFloat(servi.metros) > 0) {
                        totalunimetros = parseFloat(poly.total_metros) / parseFloat(servi.metros);
                    }
                    var valordistancia = parseFloat(totalunimetros) * parseFloat(servi.valor_unidad_metros);
                    if (isNaN(valordistancia)) {
                        valordistancia = 0;
                    }
                    var totaluniminutos = 0;
                    if (typeof servi.tiempo !== 'undefined' && servi.tiempo != "" && parseFloat(servi.tiempo) > 0) {
                        var totaluniminutos = parseFloat(poly.tiempo) / parseFloat(servi.tiempo);
                    }
                    var mins_final = 0;
                    if (qxnw.utils.evalueData(servi.minutosMinimosParaPedirService)) {
                        if (parseInt(totaluniminutos) < parseInt(servi.minutosMinimosParaPedirService)) {
                            mins_final = servi.minutosMinimosParaPedirService;
                        }
                    }
                    if (mins_final !== 0) {
                        totaluniminutos = mins_final;
                    } else {
                        if (qxnw.utils.evalueData(self.config.minutosMinimosParaPedirService)) {
                            if (parseInt(totaluniminutos) < parseInt(self.config.minutosMinimosParaPedirService)) {
                                totaluniminutos = self.config.minutosMinimosParaPedirService;
                            }
                        }
                    }
                    var valorminutos = parseFloat(totaluniminutos) * parseFloat(servi.valor_unidad_tiempo);
                    if (isNaN(valorminutos)) {
                        valorminutos = 0;
                    }
                    var valor_estimado = parseFloat(valordistancia) + parseFloat(valorminutos) + parseFloat(servi.valor_banderazo) + parseFloat(recargos_total);
                    var minima = parseFloat(servi.minima);
                    others.recargos = recargos_total;
                    others.valorbase = servi.valor_banderazo;
                    others.totaluniminutos = parseInt(totaluniminutos);
                    others.totalunimetros = parseInt(poly.total_metros);
                    others.totalunimetros_divide_unimetros = parseInt(totalunimetros);
                    others.valorminutos = valorminutos;
                    others.valordistancia = parseFloat(valordistancia);
                    others.unidad_metros = servi.metros;
                    others.valor_unidad_metros = servi.valor_unidad_metros;
                    others.unidad_tiempo = servi.tiempo;
                    others.valor_unidad_tiempo = servi.valor_unidad_tiempo;
                    others.valor_metros_add = servi.valor_metros_add;
                    others.inicia_metros_add = servi.inicia_metros_add;
                    others.concepto_recargo = "";
                    others.metros_cobro_recargo = 0;
                    others.valor_recargo = 0;
                    if (qxnw.utils.evalueData(servi.valor_recargo)) {
                        others.metros_cobro_recargo = servi.metros_cobro_recargo;
                        others.valor_recargo = servi.valor_recargo;
                        others.concepto_recargo = servi.concepto_recargo;
                    }
                    valor_estimado = parseFloat(valor_estimado) + parseFloat(others.valor_recargo);
                    others.valor_peajes = 0;
                    others.metros_cobro_peaje = 0;
                    if (qxnw.utils.evalueData(servi.valor_peajes)) {
                        others.valor_peajes = servi.valor_peajes;
                        others.metros_cobro_peaje = servi.metros_cobro_peaje;
                    }
                    valor_estimado = parseFloat(valor_estimado) + parseFloat(others.valor_peajes);
                    if (valor_estimado < minima) {
                        valor_estimado = minima;
                    }
                    if (self.cobro === "LIBRE") {
                        valor_estimado = 0;
                    }
                    if (servi.solo_para_mujeres === "SI" && up.genero === "hombre") {
                        continue;
                    }
                    var valor_tarifa_fija = false;
                    if (qxnw.utils.evalueData(servi.ciudad_o_lugar_origen) && qxnw.utils.evalueData(servi.ciudad_o_lugar_destino)) {
                        if (servi.valor_tarija_fija !== "trayecto") {
                            valor_tarifa_fija = servi.valor_tarija_fija;
                        }
                    }

                    var valor_viaje = valor_estimado;
                    if (qxnw.utils.evalueData(valor_tarifa_fija)) {
                        valor_viaje = valor_tarifa_fija;
                    }
                    valor_viaje = parseFloat(valor_viaje);
                    valor_viaje = valor_viaje.toFixed(2);
                    var dt = {};
                    dt.valor_estimado = valor_estimado;
                    dt.valor_tarifa_fija = valor_tarifa_fija;
                    dt.valor_viaje = valor_viaje;
                    dt.iva = servi.iva;
                    dt.ptm = poly.total_metros_text;
                    dt.pt = poly.tiempo_text;
                    dt.servi = servi;
                    dt.others = others;
                    dt.id = servi.id;
                    dt.nombre = "<strong>$" + qxnw.utils.addNumber(valor_viaje) + "</strong> " + r[i].nombre + " || <strong>" + servi.ciudad_o_lugar_origen + "-" + servi.ciudad_o_lugar_destino + "</strong>";
                    dt.nombre_solo = r[i].nombre;
                    console.log("dt", dt);

                    var selectItem = new qxnw.widgets.listItem(dt.nombre);
                    var model = r[i].id;
                    selectItem.setUserData("model_data", dt);
                    selectItem.setModel(model);
                    self.form.ui.tipo_servicio.add(selectItem);
                }

                if (qxnw.utils.evalueData(self.tipoServicioSet)) {
                    self.form.ui.tipo_servicio.setValue(self.tipoServicioSet);
                    self.tipoServicioSet = false;
                }

            }
        },
        openObservaciones: function openObservaciones() {
            var self = this;
            var form = new qxnw.forms();
            var data = self.form.getRecord();
            form.setTitle("Observaciones de viaje");
            var fields = [
                {
                    name: "observaciones_servicio",
                    label: "Observaciones del servicio",
                    type: "textArea",
                    required: true
                }
            ];
            form.setFields(fields);

//            d.maximize();
            form.setModal(true);
            form.setWidth(800);
            form.setMaxWidth(800);
            form.setHeight(600);
            form.setMaxHeight(600);
            form.show();

            if (qxnw.utils.evalueData(data.observaciones_servicio)) {
                form.ui.observaciones_servicio.setValue(data.observaciones_servicio);
            }

            form.ui.cancel.addListener("execute", function () {
                form.reject();
            });
            form.ui.accept.addListener("execute", function () {
                var dat = form.getRecord();
                console.log("dat", dat);
                self.form.ui.observaciones_servicio.setValue(dat.observaciones_servicio);
                form.reject();
            });
        },
        changeDirections: function changeDirections(invertir_manual) {
            var self = this;
            var data = self.form.getRecord();
            console.log("changeDirections:::data", data);
            console.log("changeDirections:::data.sentido", data.sentido);
            console.log("changeDirections:::invertir_manual", invertir_manual);
            if (data.sentido == "EJECUTIVO" && invertir_manual != true) {
//                self.form.ui.sede.setRequired(false);
//                self.form.setRequired("sede", false);
                return false;
            }
//            return false;
//            self.form.ui.sede.setRequired(true);
//            self.form.setRequired("sede", true);

            //PASA DE A a B
            if (qxnw.utils.evalueData(data.direccion_b)) {
                self.form.ui.direccion_a.setValue(data.direccion_b);
            }
            if (qxnw.utils.evalueData(data.direccion_b_latitud)) {
                self.form.ui.direccion_a_latitud.setValue(data.direccion_b_latitud);
            }
            if (qxnw.utils.evalueData(data.direccion_b_longitud)) {
                self.form.ui.direccion_a_longitud.setValue(data.direccion_b_longitud);
            }
            if (qxnw.utils.evalueData(data.direccion_b_ciudad)) {
                self.form.ui.direccion_a_ciudad.setValue(data.direccion_b_ciudad);
                self.setCityHtml(".direccionACiudadSpan", data.direccion_b_ciudad);
            }
            //PASA DE B a A
            if (qxnw.utils.evalueData(data.direccion_a)) {
                self.form.ui.direccion_b.setValue(data.direccion_a);
            }
            if (qxnw.utils.evalueData(data.direccion_a_latitud)) {
                self.form.ui.direccion_b_latitud.setValue(data.direccion_a_latitud);
            }
            if (qxnw.utils.evalueData(data.direccion_a_longitud)) {
                self.form.ui.direccion_b_longitud.setValue(data.direccion_a_longitud);
            }
            if (qxnw.utils.evalueData(data.direccion_a_ciudad)) {
                self.form.ui.direccion_b_ciudad.setValue(data.direccion_a_ciudad);
                self.setCityHtml(".direccionBCiudadSpan", data.direccion_a_ciudad);
            }

        },
        setDirections: function setDirections(array, field) {
            var self = this;
            var data = self.form.getRecord();
            console.log("setDirections:::data", data);
            if (data.sentido == "EJECUTIVO") {
                return false;
            }
//            return false;
            if (field == "direccion_a") {
                self.form.ui.direccion_a.setValue(array.direccion);
                self.form.ui.direccion_a_latitud.setValue(array.latitud);
                self.form.ui.direccion_a_longitud.setValue(array.longitud);
                self.form.ui.direccion_a_ciudad.setValue(array.ciudad);
                self.setCityHtml(".direccionACiudadSpan", array.ciudad);
            } else
            if (field == "direccion_b") {
                self.form.ui.direccion_b.setValue(array.direccion);
                self.form.ui.direccion_b_latitud.setValue(array.latitud);
                self.form.ui.direccion_b_longitud.setValue(array.longitud);
                self.form.ui.direccion_b_ciudad.setValue(array.ciudad);
                self.setCityHtml(".direccionBCiudadSpan", array.ciudad);
            }
        },
        setCityHtml: function setCityHtml(className, city) {
            var bt = document.querySelector(className);
            if (bt) {
                bt.innerHTML = city;
            }
        },
        creaRutasByExcel: function creaRutasByExcel(data) {
            var self = this;
            console.log("data", data);
            console.log("data.form", data.form);
            console.log("data.rows", data.rows);
            console.log("data.rutas", data.rutas);
            if (data.form.crear_rutas_automaticas != "SI") {
                if (data.form.forma_guardar == "GUARDAR_MOSTRAR" || data.form.forma_guardar == "NO_GUARDAR_MOSTRAR") {
                    self.navTableEnrutarPass.list1.removeAll();
                    self.navTableEnrutarPass.list2.removeAll();
                    for (var i = 0; i < self.allMarkersPasajeros.length; i++) {
                        var mark = self.allMarkersPasajeros[i];
                        mark.setMap(null);
                    }
                    self.navTableEnrutarPass.setModelDragDrop(data.rows, true, function () {
                        self.pasaIzquierdaDerecha();
                    });
                }
            }
            if (data.form.crear_rutas_automaticas == "SI") {
                self.restaurarPlantilla(data.rutas);
            }
        },
        setPositionCustomer: function setPositionCustomer(val) {
            var self = this;
            if (!main.evalueData(val.latitud) || !main.evalueData(val.longitud)) {
                return false;
            }
            if (!qxnw.utils.isOnline()) {
                console.log("Compruebe su conexión a internet.");
                return false;
            }
            var location = new google.maps.LatLng(val.latitud, val.longitud);
            self.mapa.googleMap.map.setCenter(location);
        },
        populatePlantillas: function populatePlantillas(id) {
            var self = this;
            self.setFieldVisibility(self.form.ui.plantillas, "excluded");
            if (self.config.usar_plantillas_enrutamiento == "NO") {
                return false;
            }
            if (!main.evalueData(id)) {
                return false;
            }
            self.setFieldVisibility(self.form.ui.plantillas, "visible");
            self.form.ui.plantillas.removeAll();
            var data = {};
            data[""] = "Elija";
            qxnw.utils.populateSelectFromArray(self.form.ui.plantillas, data);

            var data = {sede: id};
            qxnw.utils.populateSelect(self.form.ui.plantillas, "enrutamiento_masivo", "populatePlantillas", data);
        },
        resetPolyLine: function resetPolyLine() {
            var self = this;
            if (self.encodedPolyline) {
                self.encodedPolyline.setMap(null);
            }
            if (typeof encodedPolyline !== "undefined") {
                if (encodedPolyline !== null) {
                    encodedPolyline.setMap(null);
                }
            }
            encodedPolyline = null;
        },
        closeReset: function closeReset() {
            var self = this;
            console.log("closeReset");
            //limpia pasajeros lista y markers
            self.navTableEnrutarPass.list1.removeAll();
            self.navTableEnrutarPass.list2.removeAll();
            for (var i = 0; i < self.allMarkersPasajeros.length; i++) {
                var mark = self.allMarkersPasajeros[i];
                mark.setMap(null);
            }

            //limpia pasajeros lista y markers


            if (main.evalueData(self.markerCliente)) {
                self.markerCliente.setMap(null);
                self.markerCliente = null;
            }

            //limpia conductores tree, markers y rutas
            self.conductor = false;
            if (document.querySelector(".class_enc_driver")) {
                document.querySelector(".class_enc_driver").innerHTML = "Sin pasajero asignado al viaje, por favor seleccione uno";
            }
            self.addTreeHeader(self.tr("Conductores"), qxnw.config.execIcon("view-sort-descending"));
            for (var i = 0; i < self.allMarkersDrivers.length; i++) {
                var mark = self.allMarkersDrivers[i];
                mark.setMap(null);
            }
            var container = document.querySelector('.rutas_tree');
            if (container) {
                container.remove();
            }
            var container = document.querySelector('.class_enc_data_travel');
            if (container) {
                container.innerHTML = "";
            }
            //limpia conductores tree y markers

            self.countPasajerosHTML();

            //limpia filtros
            self.setFieldVisibility(self.form.ui.id_servicio_enc, "excluded");

            self.times_dis_travel_gps = false;
//            self.form.ui.sede.setValue("");
//            self.form.ui.sede.removeAll();
            //limpia filtros

//            var item = {
//                id: "N/A",
//                nombre: "N/A"
//            };
//            self.form.ui.cliente.addToken(item);
//            self.form.ui.cliente.removeAll();
//            self.reject();

            self.resetPolyLine();

            self.form.ui.ciudad.cleanAll();
            self.form.ui.cliente.cleanAll();
            self.form.ui.usuario.cleanAll();
            self.form.ui.sede.removeAll();

            self.clean();
            self.form.clean();
//            self.form.cleanAll();
            self.cleanTree();

//            qxnw.utils.information("Limpiado correctamente");

            return true;
        },
        openRuta: function openRuta(data, widget) {
            var self = this;
            var html = "<div class='datarutainformation'>";
            html += "Ruta con placa: " + data.conductor.placa;
            html += "Ruta con hora: " + data.form.hora;
            html += "</div>";
            html += "<div class='contain_btns'>";
            html += "<div class='btn_gral editar_btn'>Editar</div>";
            html += "<div class='btn_gral quitar_btn'>Quitar</div>";
            html += "</div>";
            var window = qxnw.utils.information(html);

            qxnw.utils.validaElementExist(".editar_btn", function (ele) {
                ele.onclick = function () {
                    console.log("editar_btn:::data", data);
                    self.editarRuta(data);
                    widget.remove();
                    window.close();
                    window.destroy();
                    qxnw.utils.information("Recuerde dar en pre-enrutar para guardar cambios.");
                };
            }, 1);
            qxnw.utils.validaElementExist(".quitar_btn", function (ele) {
//                document.querySelectorAll(".quitar_btn")[1].onclick = function () {
                ele.onclick = function () {
                    console.log("data", data);
                    qxnw.utils.question("¿Está segur@ que desea quitar esta ruta?", function (e) {
                        if (e) {
                            widget.remove();
                            window.close();
                            window.destroy();
                        }
                    });
                };
            }, 1);
        },
        editarRuta: function editarRuta(data) {
            var self = this;
            if (self.editaRuta) {
                qxnw.utils.information("Tiene una ruta en edición, finalice y guarde cambios antes de editar otra ruta.");
                return false;
            }
            console.log("editarRuta:::data", data);
            self.form.ui.fecha.setValue(data.form.fecha);
            self.form.ui.hora.setValue(data.form.hora);
            self.form.ui.sentido.setValue(data.form.sentido);

            self.seleccionarDriver(data.conductor);
            self.form.ui.sede.setValue(data.form.sede);

            self.navTableEnrutarPass.list1.removeAll();
            self.navTableEnrutarPass.list2.removeAll();
            for (var i = 0; i < self.allMarkersPasajeros.length; i++) {
                var mark = self.allMarkersPasajeros[i];
                mark.setMap(null);
            }

            self.editaRuta = true;
            self.navTableEnrutarPass.setModelDragDrop(data.pasajeros, true, function () {
                self.pasaIzquierdaDerecha();
            });
        },
        pasaIzquierdaDerecha: function pasaIzquierdaDerecha() {
            return false;
            var self = this;
            self.navTableEnrutarPass.list1.selectAll();
            var s = self.navTableEnrutarPass.list1.getSelection();
            console.log("ssss", s);
            if (s.length == 0) {
                qxnw.utils.information(self.tr("No hay registros seleccionados"));
                return;
            }
            for (var i = 0; i < s.length; i++) {
                console.log("s[i]", s[i]);
                self.navTableEnrutarPass.list2.add(s[i]);
                self.navTableEnrutarPass.onDropRight(s[i]);
//                self.navTableEnrutarPass.onDropLeft(s[i]);
            }
        },
        htmlItem: function htmlItem(data) {
            var html = "";
            html += "<span class='ruta_fecha'>" + data.form.fecha + " " + data.form.hora + "</span>";
            html += "<span class='ruta_sentido'>" + data.form.sentido + "</span>";
            html += "<span class='ruta_placa'>" + data.conductor.placa + "</span>";
            html += "<span class='ruta_pax'>" + data.pasajeros.length + " PAX</span>";
            return html;
        },
        preEnrutar: function preEnrutar() {
            var self = this;
            var title = "¿Desea crear esta pre-ruta?";
            title += "<br /><br /><br /><strong>Nota:</strong> Recuerde que debe confirmar servicio para guardarla completamente.";
            self.crearServicio(function (data) {
                qxnw.utils.information("¡Ruta agregada correctamente!<br /><br />Puede continuar creando rutas o confirmar servicio para finalizar.");
                console.log("preEnrutar:::data", data);
                self.addPreRuta(data);
                self.editaRuta = false;



            }, title, true);
        },
        addPreRuta: function addPreRuta(data) {
            var self = this;
            console.log("addPreRuta:::data", data);
            var element = self.leftWidget.getChildren()[1].getContentElement().getDomElement();

            var container = document.querySelector('.rutas_tree');
            if (!container) {
                container = document.createElement("div");
                container.innerHTML = "<span class='ruta_title'>Rutas</span>";
                container.className = "rutas_tree";
                element.appendChild(container);
            }

            var div = document.createElement('div');
            div.className = "row_ruta";
            div.data = data;
            div.innerHTML = self.htmlItem(data);
            div.onclick = function () {
                var d = this.data;

                main.removeClass(".row_ruta", "ruta_selected");
                main.addClass(this, "ruta_selected");

                console.log("ddd", d);
                self.openRuta(d, this);
            };
            container.appendChild(div);
//            element.appendChild(div);
            self.form.ui.hora.setValue("");
            self.form.ui.direccion_a.setValue("");
            self.form.ui.direccion_a_latitud.setValue("");
            self.form.ui.direccion_a_longitud.setValue("");
            self.form.ui.direccion_a_ciudad.setValue("");
            self.form.ui.direccion_b.setValue("");
            self.form.ui.direccion_b_latitud.setValue("");
            self.form.ui.direccion_b_longitud.setValue("");
            self.form.ui.direccion_b_ciudad.setValue("");

//            self.navTableEnrutarPass.list1.removeAll();
            self.navTableEnrutarPass.list2.removeAll();
            for (var i = 0; i < self.allMarkersPasajeros.length; i++) {
                var mark = self.allMarkersPasajeros[i];
                mark.setMap(null);
            }
            self.times_dis_travel_gps = false;
            self.resetPolyLine();
            var container = document.querySelector('.class_enc_data_travel');
            if (container) {
                container.innerHTML = "";
            }
        },
        validatePoints: function validatePoints(data, cancel) {
            var self = this;
            if (!qxnw.utils.evalueData(data.form.direccion_a)
//                        || !qxnw.utils.evalueData(data.form.direccion_a_latitud)
//                        || !qxnw.utils.evalueData(data.form.direccion_a_longitud)
//                        || !qxnw.utils.evalueData(data.form.direccion_a_ciudad)
                    || !qxnw.utils.evalueData(data.form.direccion_b)
//                        || !qxnw.utils.evalueData(data.form.direccion_b_latitud)
//                        || !qxnw.utils.evalueData(data.form.direccion_b_longitud)
//                        || !qxnw.utils.evalueData(data.form.direccion_b_ciudad)
                    ) {
                var te = "No presenta dirección de origen y/o de destino. Verifique por favor.";
                qxnw.utils.information(te);
                return false;
            }
            if (!qxnw.utils.evalueData(data.form.direccion_a_ciudad)) {
                self.visibleFieldPoints("direccion_a_ciudad", "ciudad de partida", cancel);
                return false;
            }
//            if (!qxnw.utils.evalueData(data.form.direccion_a_pais)) {
//                self.visibleFieldPoints("direccion_a_pais", "pais de partida", cancel);
//                return false;
//            }
            if (!qxnw.utils.evalueData(data.form.direccion_b_ciudad)) {
                self.visibleFieldPoints("direccion_b_ciudad", "ciudad de destino", cancel);
                return false;
            }
            if (!qxnw.utils.evalueData(data.form.direccion_a_latitud)) {
                self.visibleFieldPoints("direccion_a_latitud", "latitud de partida", cancel);
                return false;
            }
            if (!qxnw.utils.evalueData(data.form.direccion_a_longitud)) {
                self.visibleFieldPoints("direccion_a_longitud", "longitud de partida", cancel);
                return false;
            }
            if (!qxnw.utils.evalueData(data.form.direccion_b_latitud)) {
                self.visibleFieldPoints("direccion_b_latitud", "latitud de destino", cancel);
                return false;
            }
            if (!qxnw.utils.evalueData(data.form.direccion_b_longitud)) {
                self.visibleFieldPoints("direccion_b_longitud", "longitud de destino", cancel);
                return false;
            }
            return true;
        },
        visibleFieldPoints: function visibleFieldPoints(field, text, cancel) {
            var self = this;
            qxnw.utils.question("No presenta " + text + ", ¿Desea agregarla manualmente?", function (e) {
                if (e) {
                    self.setFieldVisibility(self.form.ui[field], "visible");

                    self.form.ui[field].focus();
                } else {
                    cancel();
                    self.form.ui[field].setValue("N/A");
                }
            });
        },
        crearServicio: function crearServicio(callback, title, esruta) {
            var self = this;
            if (!self.form.validate()) {
                return;
            }
            console.log("self.conductor", self.conductor);
            var rutas_array = [];
            if (esruta !== true) {
                var rutas = document.querySelectorAll(".row_ruta");
                for (var i = 0; i < rutas.length; i++) {
                    rutas_array.push(rutas[i].data);
                }
            }
//            if (!main.isCustomer()) {
//                if (!main.evalueData(self.conductor) && rutas_array.length == 0 && self.seguirsinlistDriver !== true) {
//                    qxnw.utils.question("<div class='advertenciadialog'>No ha seleccionado un conductor, ¿Desea continuar sin conductor para este viaje?</div>", function (e) {
//                        if (e) {
//                            self.seguirsinlistDriver = true;
//                            self.crearServicio(callback, title, esruta);
//                        }
//                    });
//                    return false;
//                }
//            }

            var data = {};
            data.conductor = self.conductor;
            data.form = self.form.getRecord();
            console.log("data.form", data.form);

            if (data.form.servicio_para == "ahora" && self.editaViajeDesdeHistorico != true) {
                data.form.fecha = qxnw.utils.getActualDate();
                data.form.hora = qxnw.utils.getActualHour();
            }

            console.log("data.form", data.form);
            var pasajerosList1 = self.navTableEnrutarPass.list1.getAllData();
            console.log("pasajerosList1", pasajerosList1);
            if (pasajerosList1.length > 0 && self.seguirsinlist1 !== true) {
                qxnw.utils.question("<div class='advertenciadialog'>Tiene algunos pasajeros/paradas sin enrutar, ¿Desea continuar?</div>", function (e) {
                    if (e) {
                        self.seguirsinlist1 = true;
                        self.crearServicio(callback, title, esruta);
                    }
                });
                return false;
            }
            data.pasajeros = self.navTableEnrutarPass.list2.getAllData();
            console.log("data.pasajeros", data.pasajeros);
            for (var i = 0; i < data.pasajeros.length; i++) {
                data.pasajeros[i].callbackMarker = "";
                data.pasajeros[i].item_qxnw = "";
                data.pasajeros[i].id = data.pasajeros[i].id.replace("_pasajeros", "");
                data.pasajeros[i].latitud_parada = data.pasajeros[i].latitud;
                data.pasajeros[i].longitud_parada = data.pasajeros[i].longitud;
                data.pasajeros[i].nombre_pasajero = data.pasajeros[i].nombre;
                data.pasajeros[i].direccion = data.pasajeros[i].direccion_parada;
                data.pasajeros[i].descripcion_carga = data.pasajeros[i].observacion;
                data.pasajeros[i].usuario_text = data.pasajeros[i].correo;
//                data.pasajeros[i].tipo = "normal";
            }
            data.conductor.callbackMarker = "";
            if (qxnw.utils.evalueData(data.form.sede_model)) {
                data.form.sede_model.callbackMarker = "";
            }
            data.form.fecha_servicio = data.form.fecha + " " + data.form.hora;
            data.lote = self.navTableEnrutarPass.ui.lote.getValue();
            data.estado = self.navTableEnrutarPass.ui.estado.getValue();

            if (data.form.sentido != "EJECUTIVO") {
                if (data.pasajeros.length == 0 && rutas_array.length == 0) {
                    qxnw.utils.information("Para servicios de ENTRADA o SALIDA, debe agregar paradas/pasajeros.");
                    return false;
                }
            }

            if (!main.evalueData(data.form.sentido) && rutas_array.length == 0) {
                qxnw.utils.information("Debe seleccionar el sentido (ENTRADA, SALIDA) del servicio.");
                return false;
            }
            console.log("data.form.fecha", data.form.fecha);
            if (!main.evalueData(data.form.fecha) && rutas_array.length == 0) {
                qxnw.utils.information("Debe seleccionar la fecha del servicio.");
                return false;
            }
            console.log("data.form.hora", data.form.hora);
            if (!main.evalueData(data.form.hora) && rutas_array.length == 0) {
                qxnw.utils.information("Debe seleccionar la hora del servicio.");
                return false;
            }
            if (data.form.usar_fecha_global === true || data.form.usar_fecha_global === "true") {
                if (!qxnw.utils.evalueData(data.form.fecha)) {
                    qxnw.utils.information("Debe configurar una fecha global para los servicios.");
                    return false;
                }
            }

            console.log("data.form.sede", data.form.sede);
            if (data.form.sentido != "EJECUTIVO") {
                if (!qxnw.utils.evalueData(data.form.sede)) {
                    qxnw.utils.information("Para servicios de ENTRADA o SALIDA, debe seleccionar el cliente y la sede.");
                    return false;
                }
            }
            if (rutas_array.length == 0) {
                var cancel = function () {
                    self.crearServicio(callback, title, esruta);
                };
                if (!self.validatePoints(data, cancel)) {
                    return false;
                }
            }

            var dataSendServer = data;
            dataSendServer.rutas = rutas_array;

            if (qxnw.utils.evalueData(self.times_dis_travel_gps)) {
                dataSendServer.times_dis_travel_gps = JSON.stringify(self.times_dis_travel_gps);
                dataSendServer.tiempo_estimado = self.times_dis_travel_gps.duration_in_traffic.value;
//                dataSendServer.tiempo = self.times_dis_travel_gps.duration_in_traffic.value;
                dataSendServer.total_metros = self.times_dis_travel_gps.distance.value;
            }

            console.log("self.config.driver_asignar_automatic_servicios_back", self.config.driver_asignar_automatic_servicios_back);
            if (self.config.driver_asignar_automatic_servicios_back === "SI") {
                dataSendServer.estado_servicio = "ACEPTADO_RESERVA";
            }

            if (main.isCustomer()) {
                if (main.evalueData(self.config.clienteEstadoCreaServicios)) {
                    dataSendServer.estado_servicio = self.config.clienteEstadoCreaServicios;
                }
            }

            if (self.editaViajeDesdeHistorico === true) {
                dataSendServer.estado_servicio = false;
                dataSendServer.fecha_creacion = false;
                dataSendServer.fecha_asignacion_para_conductor = false;
                dataSendServer.editaViajeDesdeHistorico = "SI";
            }

            dataSendServer.configCliente = self.config;

            console.log("crearServicio:::data", data);
            console.log("crearServicio:::dataSendServer", dataSendServer);

            var edite = false;
            var tit = "¿Desea confirmar la creación de este servicio?";
            var met = "crearServicio";
            if (self.editaViajeDesdeHistorico === true) {
                tit = "¿Desea confirmar la edición de este servicio?";
                edite = true;
            }
            if (rutas_array.length > 0) {
                tit += "<br /><br /> Tiene " + rutas_array.length + " rutas asociadas, recuerde que va a crear un servicio por cada ruta.";
                tit += "<br />¿Desea continuar?";
                met = "crearServicioMasivoRutas";
            }
            if (main.evalueData(title)) {
                tit = title;
            }
            qxnw.utils.question(tit, function (e) {
                if (e) {
                    if (main.evalueData(callback)) {
                        return callback(data);
                    }

                    qxnw.utils.loadingnw("Creando servicio(s)... Por favor espere...", "cargando_axtest");

                    var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
                    rpc.setAsync(true);
                    rpc.setShowLoading(false);
                    var func = function (r) {
                        console.log("crearServicio:::response:::", r);

                        console.log("dataSendServer", dataSendServer);
                        console.log("dataSendServer.form.tipo_servicio", dataSendServer.form.tipo_servicio);
                        console.log("dataSendServer.form.direccion_a_ciudad", dataSendServer.form.direccion_a_ciudad);
                        if (qxnw.utils.evalueData(dataSendServer.form.tipo_servicio) && qxnw.utils.evalueData(dataSendServer.form.direccion_a_ciudad)) {
                            self.notificaConductoresCerca(dataSendServer, r, function () {
                                self.setInFirebase(r);
                            });
                        } else {
                            self.setInFirebase(r);
                        }

                        qxnw.utils.loadingnw_remove("cargando_axtest");
                        qxnw.utils.loadingnw("Enviando notificaciones... Por favor espere...", "cargando_axtest");

                        var to = {
                            edite: edite,
                            idTravel: r,
                            data: data,
                            rutas_array: rutas_array
                        };
                        self.enviarNotificacion(to, function (nots, pax, drivers) {
                            qxnw.utils.loadingnw_remove("cargando_axtest");
                            self.closeReset();

                            var ti = "¡Proceso realizado correctamente! <br />Servicio <strong>#" + r + "</strong>.";
                            if (!nots || nots.length == 0) {
                                ti += " <strong color='red'>¡No se enviaron notificaciones!</strong>";
                            }
                            ti += "<br /><br /><strong style='color:red;'>Se enviaron " + pax.length + " notificaciones a los pasajeros</strong>";
                            ti += "<br /><strong style='color:red;'>Se enviaron " + drivers.length + " notificaciones a los conductores</strong>";
                            ti += "<br /><br /><strong style='color:red;'>Recuerda revisar esta información en la línea de tiempo</strong>";

                            if (!main.isCustomer()) {
                                if (!main.evalueData(self.conductor) && rutas_array.length == 0 && self.seguirsinlistDriver !== true) {
                                    ti += "<br /><br /><br /><div class='advertenciadialog'>Recuerda asignar un conductor a este viaje</div>";
                                }
                            }
                            if (self.config.usar_plantillas_enrutamiento == "SI") {
                                qxnw.utils.question(ti + "<br /><br />¿Desea crear una plantilla de esta(s) ruta(s)?", function (e) {
                                    if (e) {
                                        self.crearPlantilla(data, rutas_array);
                                    }
                                });
                            } else {
                                qxnw.utils.information(ti);
                            }
                            self.reject();
                            self.accept();
                        });
                    };
                    console.log("crearServicio:::dataSendServer", dataSendServer);
                    rpc.exec(met, dataSendServer, func);
                }
            });
        },
        setInFirebase: function setInFirebase(id) {
            var self = this;
            id = id.toString();
            var ids = id.split("#");
            console.log("id.indexOf(#)", id.indexOf("#"));
            console.log("ids", ids);
            if (id.indexOf("#") != -1) {

            }
            main.registerServiceInFirebase(id);
        },
        notificaConductoresCerca: function notificaConductoresCerca(dataSendServer, r_serv, callback) {
            console.log("id", r_serv);
            r_serv = r_serv.toString();
            console.log("id.indexOf(#)", r_serv.indexOf("#"));
            if (r_serv.indexOf("#") != -1) {
                callback();
                return false;
            }
            var up = qxnw.userPolicies.getUserData();
            console.log("up", up);
            var data = {};
            data.empresa = up.company;
            data.usuario = up.user;
            data.ciudad = dataSendServer.form.direccion_a_ciudad;
            data.subcategoria_servicio = dataSendServer.form.tipo_servicio;

            console.log("notificaConductoresCerca:::dataSendServer", dataSendServer);
            console.log("notificaConductoresCerca:::data", data);
//            return;
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "app_user");
            rpc.setAsync(true);
            rpc.setShowLoading(false);

            console.log("sendData:::notificaConductoresCerca::data", data);
            console.log("sendData:::notificaConductoresCerca::r_serv", r_serv);
            var func = function (r) {
                console.log("responseServer:::notificaConductoresCerca::r", r);
                if (!r) {
                    callback();
                    return false;
                }
                var drivers = [];
                for (var i = 0; i < r.length; i++) {
                    var ra = r[i];
                    if (!qxnw.utils.evalueData(ra.token) || !qxnw.utils.evalueData(ra.latitud) || !qxnw.utils.evalueData(ra.longitud)) {
                        continue;
                    }
                    var d = main.distance(parseFloat(data.latitudOri), parseFloat(data.longitudOri), parseFloat(ra.latitud), parseFloat(ra.longitud));
                    console.log("nwgeo.distance:::d", d);
                    d = d.toFixed(0);
                    var distanceDriverMetros = parseFloat(d);
                    var metros_para_aceptar_servicio = parseFloat(self.config.metros_para_aceptar_servicio);
                    console.log("self.configCliente.metros_para_aceptar_servicio", self.config.metros_para_aceptar_servicio);
                    console.log("metros_para_aceptar_servicio", metros_para_aceptar_servicio);
                    console.log("distanceDriverMetros", distanceDriverMetros);
                    console.log("ra", ra);
                    if (distanceDriverMetros > metros_para_aceptar_servicio) {
                        continue;
                    }
                    console.log("NOTIFICA_A_DRIVER::::ra", ra);
                    main.sendNotificacion({
                        title: "¡Nuevo viaje cerca!",
                        body: "Solicitud de nuevo viaje !Abre la app ahora! Y no pierdas servicios.",
                        icon: "fcm_push_icon",
                        sound: "default",
//                            data: "main.crearViaje('" + r[i].token + "')",
//                        data: "nw.dialog('Solicitud de nuevo viaje')",
                        data: "",
                        callback: "FCM_PLUGIN_ACTIVITY",
                        to: ra.token
                    });
                    drivers.push(ra);
                }
                console.log("drivers", drivers);
                data.drivers = JSON.stringify(drivers);
                data.id_servicio = r_serv;
                var rpc = new qxnw.rpc(self.getRpcUrl(), "app_user");
                rpc.setAsync(true);
                rpc.setShowLoading(false);
                console.log("sendData:::guardaConductoresCerca::data", data);
                var func = function (r) {
                    console.log("responseServer:::guardaConductoresCerca::r", r);
                    callback();
                };
                rpc.exec("guardaConductoresCerca", data, func);
            };
            rpc.exec("traeConductoresCerca", data, func);
        },
        enviarNotificacion: function enviarNotificacion(to, callback) {
            var self = this;
            var id = to.idTravel;
            var data = to.data;
            var edite = to.edite;
            var rutas_array = to.rutas_array;

            console.log("%c<<<<enviarNotificacion::: INIT!!!!!!!!!!!!!>>>>", 'background: #ff3366; color: #fff');
            console.log("enviarNotificacion:::to", to);
            console.log("enviarNotificacion:::data", data);
            console.log("enviarNotificacion:::rutas_array", rutas_array);
            console.log("enviarNotificacion:::data.pasajeros", data.pasajeros);

            var title_pasajero = "¡Hola!, tienes un nuevo servicio";
            var title_conductor = "Conductor(a), tienes un nuevo servicio";
            var body_pasajero = "¡Hola!, tienes un nuevo servicio, revisa tu agenda";
            var body_conductor = "¡Conductor(a)!, tienes un nuevo servicio, revisa tu agenda";
            if (edite) {
                title_pasajero = "¡Hola!, un servicio ha sido modificado";
                title_conductor = "¡Conductor(a)!, un servicio ha sido modificado";
                body_pasajero = "¡Hola!, un servicio que tienes ha sido modificado, revisa tu agenda";
                body_conductor = "¡Conductor(a)!, un servicio que tienes ha sido modificado, revisa tu agenda";
            }
            var dataSendServer = {};
            dataSendServer.conductores = [];
            dataSendServer.usuarios = [];
            dataSendServer.pasajeros = [];
            if (rutas_array.length > 0) {
                for (var i = 0; i < rutas_array.length; i++) {
                    var ruta = rutas_array[i];
                    for (var x = 0; x < ruta.pasajeros.length; x++) {
                        var pa = ruta.pasajeros[x];
                        if (qxnw.utils.evalueData(pa.usuario_pasajero)) {
                            dataSendServer.usuarios.push({usuario: pa.usuario_pasajero});
                            dataSendServer.pasajeros.push({usuario: pa.usuario_pasajero});
                        }
                    }
                    if (qxnw.utils.evalueData(ruta.conductor)) {
                        dataSendServer.usuarios.push({usuario: ruta.conductor.usuario_cliente});
                        dataSendServer.conductores.push({usuario: ruta.conductor.usuario_cliente});
                    }
                }
            } else
            if (rutas_array.length == 0 && qxnw.utils.evalueData(data.conductor)) {
                dataSendServer.usuarios.push({usuario: data.conductor.usuario_cliente});
                dataSendServer.conductores.push({usuario: data.conductor.usuario_cliente});
            }
            if (qxnw.utils.evalueData(data.form.usuario_array)) {
                dataSendServer.usuarios.push({usuario: data.form.usuario_array.usuario});
                dataSendServer.pasajeros.push({usuario: data.form.usuario_array.usuario});
            }
            for (var i = 0; i < data.pasajeros.length; i++) {
                if (qxnw.utils.evalueData(data.pasajeros[i].usuario_pasajero)) {
                    dataSendServer.usuarios.push({usuario: data.pasajeros[i].usuario_pasajero});
                    dataSendServer.pasajeros.push({usuario: data.pasajeros[i].usuario_pasajero});
                }
            }
            var pax = [];
            var drivers = [];
            console.log("enviarNotificacion:::dataSendServer", dataSendServer);
            if (dataSendServer.usuarios.length == 0) {
                last(false, pax, drivers);
                return false;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            var func = function (r) {
                console.log("enviarNotificacion::::::response:::", r);

                var envs = [];
                for (var i = 0; i < r.length; i++) {
                    var re = r[i];

                    if (re.perfil == "1") {
                        var exist = false;
                        for (var x = 0; x < dataSendServer.pasajeros.length; x++) {
                            if (dataSendServer.pasajeros[x].usuario == re.usuario) {
                                exist = true;
                            }
                        }
                        if (exist) {
                            console.log("%cOK:::sendNotificationTo:::" + re.usuario + " perfil " + re.perfil + ">>>>", 'background: #ff3366; color: #fff');
                            main.sendNotificacion({
                                title: title_pasajero,
                                body: body_pasajero,
                                icon: "fcm_push_icon",
                                sound: "default",
                                data: "main.newServiceRutaCliente()",
                                callback: "FCM_PLUGIN_ACTIVITY",
                                to: re.json
                            });
                            var se = {
                                usuario: re.usuario,
                                perfil: re.perfil,
                                title: title_pasajero,
                                body: body_pasajero,
                                token: re.json
                            };
                            envs.push(se);
                            pax.push(se);
                        }
                    }
                    if (re.perfil == "2") {
                        var exist = false;
                        for (var x = 0; x < dataSendServer.conductores.length; x++) {
                            if (dataSendServer.conductores[x].usuario == re.usuario) {
                                exist = true;
                            }
                        }
                        if (exist) {
                            console.log("%cOK:::sendNotificationTo:::" + re.usuario + " perfil " + re.perfil + ">>>>", 'background: #ff3366; color: #fff');
                            main.sendNotificacion({
                                title: title_conductor,
                                body: body_conductor,
                                icon: "fcm_push_icon",
                                sound: "default",
                                data: "nw.dialog('" + title_conductor + "')",
                                callback: "FCM_PLUGIN_ACTIVITY",
                                to: re.json
                            });
                            var see = {
                                usuario: re.usuario,
                                perfil: re.perfil,
                                title: title_conductor,
                                body: body_conductor,
                                token: re.json
                            };
                            envs.push(see);
                            drivers.push(see);
                        }
                    }
                }
                last(r, pax, drivers);
                self.registerLineTimeNotify(envs, id);
            };
            rpc.exec("traeTokensApp", dataSendServer, func);
            function last(r, pax, drivers) {
                callback(r, pax, drivers);
                console.log("enviarNotificacion::::::callback:::", r);
                console.log("%c<<<<enviarNotificacion::: END!!!!!!!!!!!!!>>>>", 'background: #ff3366; color: #fff');
            }
        },
        registerLineTimeNotify: function registerLineTimeNotify(users, id) {
            console.log("users", users);
            console.log("id", id);
            id = id.toString();
            console.log("id.indexOf(#)", id.indexOf("#"));
            if (id.indexOf("#") != -1) {
                return false;
            }
            var self = this;
            var data = {};
            data.id = id;
            data.users = users;
            data.modulo = "back:::envioNotificaciones:::crear/editar";
            console.log("registerLineTimeNotify:::sendData", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "notificaciones");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            var func = function (r) {
                console.log("registerLineTimeNotify:::responseServer", r);
            };
            rpc.exec("saveNotificacionesCreaViaje", data, func);
        },
        crearPlantilla: function crearPlantilla(data, rutas_array) {
            var self = this;
            var form = new qxnw.forms();
            form.setTitle("Plantilla de ruta(s)");
            var fields = [
                {
                    name: "nombre",
                    label: "Nombre",
                    caption: "nombre",
                    type: "textField",
                    required: true
                }
            ];
            form.setFields(fields);
            form.show();

            form.ui.cancel.addListener("execute", function () {
                form.reject();
            });
            form.ui.accept.addListener("execute", function () {
                console.log("rutas_array", rutas_array);
                console.log("data", data)
                var dat = form.getRecord();
                dat.data = JSON.stringify(data);
//                dat.data = btoa(dat.data);
//                dat.data = btoa(unescape(encodeURIComponent(dat.data)));
                dat.cliente = data.form.cliente;
                dat.sede = data.form.sede;
                dat.rutas = JSON.stringify(rutas_array);
//                dat.rutas = btoa(dat.rutas);
//                dat.rutas = btoa(unescape(encodeURIComponent(dat.rutas)));
                var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
                rpc.setAsync(true);
                console.log("crearPlantilla:::data:::", dat);
                rpc.setShowLoading(true);
                var func = function (r) {
                    console.log("crearPlantilla:::response:::", r);
                    qxnw.utils.information("plantilla de ruta(s) creada correctamente.");
                    form.reject();
                };
                rpc.exec("crearPlantilla", dat, func);
            });
        },
        restaurarPlantilla: function restaurarPlantilla(dat) {
            var self = this;
            self.restaurandoPlantilla = true;
            console.log("restaurarPlantilla:::dat", dat);

//            qxnw.utils.loadingnw("Restaurando ruta... Por favor espere...", "cargando_axtest");
//            setTimeout(function () {
//                qxnw.utils.loadingnw_remove("cargando_axtest");
//            }, 4000);
            if (qxnw.utils.evalueData(dat.data)) {
////                var decodedString = atob(dat.data);
//                var decodedString = decodeURIComponent(escape(window.atob(dat.data)));
//                console.log("decodedString", decodedString);
//                var json = decodedString;
                var data = {};
                var json = dat.data;
                if (typeof json == "string") {
                    json = json.replace(/"{/gi, "{");
                    json = json.replace(/}"/gi, "}");
                    json = json.replace(/"\[{/gi, "[{");
                    json = json.replace(/}]"/gi, "}]");
                    console.log("json", json);
                    data = JSON.parse(json);
                } else {
                    data = json;
                }
                console.log("restaurarPlantilla:::JSON:::data", data);
//            data.form.plantillas = "";

                if (qxnw.utils.evalueData(data.form.id_servicio_enc)) {
                    self.setFieldVisibility(self.form.ui.id_servicio_enc, "visible");
                } else {
                    self.setFieldVisibility(self.form.ui.id_servicio_enc, "excluded");
                }
//                if (data.form.creado_por_pc_id != '' && data.form.creado_por_pc_id != null) {
//                    data.form.creado_por_pc = data.form.creado_por_pc_id;
//                }
                if (data.form.tipo_pago_id != '' && data.form.tipo_pago_id != null) {
                    data.form.tipo_pago = data.form.tipo_pago_id;
                }
                console.log("valores setRecord", data.form);
                self.form.setRecord(data.form);
                console.log("serRecord", data.form);
                setTimeout(function () {

                    if (data.form.tipo_pago != "" && data.form.tipo_pago != null) {
                        self.form.ui.tipo_pago.setValue(data.form.tipo_pago);
                    }
//                    if (data.form.trf != '' && data.form.trf != null) {
//                        self.form.ui.trf.setValue(data.form.trf);
//                    }
                }, 500);
                if (qxnw.utils.evalueData(data.form.cliente_array)) {
                    self.form.ui.cliente.addToken(data.form.cliente_array);
                }
                if (qxnw.utils.evalueData(data.form.ciudad_array)) {
                    self.form.ui.ciudad.addToken(data.form.ciudad_array);
                }
                if (qxnw.utils.evalueData(data.form.usuario_array)) {
                    self.form.ui.usuario.addToken(data.form.usuario_array);
                }
                if (qxnw.utils.evalueData(data.form.flota_array)) {
                    self.form.ui.flota.addToken(data.form.flota_array);
                }
                if (qxnw.utils.evalueData(data.form.tipo_servicio_array)) {
//                    self.form.ui.tipo_servicio.addToken(data.form.tipo_servicio_array);
//                    self.form.ui.tipo_servicio.setValue(data.form.tipo_servicio_array.id);

                    self.tipoServicioSet = data.form.tipo_servicio_array.id;
                }

//            self.form.ui.sentido.setValue("");
                self.form.ui.fecha.setValue("");
                self.form.ui.hora.setValue("");

                if (qxnw.utils.evalueData(data.form.edita)) {
                    if (qxnw.utils.evalueData(data.form.fecha_edita)) {
                        self.form.ui.fecha.setValue(data.form.fecha_edita);
                    }
                    if (qxnw.utils.evalueData(data.form.hora_edita)) {
                        self.form.ui.hora.setValue(data.form.hora_edita);
                    }
                    if (qxnw.utils.evalueData(data.form.origen)) {
                        self.form.ui.direccion_a.setValue(data.form.origen);
                    }
                    if (qxnw.utils.evalueData(data.form.latitudOri)) {
                        self.form.ui.direccion_a_latitud.setValue(data.form.latitudOri);
                    }
                    if (qxnw.utils.evalueData(data.form.longitudOri)) {
                        self.form.ui.direccion_a_longitud.setValue(data.form.longitudOri);
                    }
                    if (qxnw.utils.evalueData(data.form.ciudad_origen)) {
                        self.form.ui.direccion_a_ciudad.setValue(data.form.ciudad_origen);
                        self.setCityHtml(".direccionACiudadSpan", data.form.ciudad_origen);
                    }
                    if (qxnw.utils.evalueData(data.form.pais_origen)) {
                        self.form.ui.direccion_a_pais.setValue(data.form.pais_origen);
                    }
                    if (qxnw.utils.evalueData(data.form.destino)) {
                        self.form.ui.direccion_b.setValue(data.form.destino);
                    }
                    if (qxnw.utils.evalueData(data.form.latitudDes)) {
                        self.form.ui.direccion_b_latitud.setValue(data.form.latitudDes);
                    }
                    if (qxnw.utils.evalueData(data.form.longitudDes)) {
                        self.form.ui.direccion_b_longitud.setValue(data.form.longitudDes);
                    }
                    if (qxnw.utils.evalueData(data.form.ciudad_destino)) {
                        self.form.ui.direccion_b_ciudad.setValue(data.form.ciudad_destino);
                        self.setCityHtml(".direccionBCiudadSpan", data.form.ciudad_destino);
                    }
                }

                if (qxnw.utils.evalueData(data.form.sede)) {
                    self.form.ui.sede.setValue(data.form.sede);
                }
                if (typeof data.editaViajeDesdeHistorico !== "undefined") {
                    self.editaViajeDesdeHistorico = data.editaViajeDesdeHistorico;
                }

                if (qxnw.utils.evalueData(data.lote)) {
                    self.navTableEnrutarPass.ui.lote.setValue(data.lote.lote);
                    self.navTableEnrutarPass.ui.estado.setValue(data.estado.estado);
                }

                self.navTableEnrutarPass.setModelDragDrop(data.pasajeros, true, function () {
                    self.pasaIzquierdaDerecha();

                    if (qxnw.utils.evalueData(data.form.times_dis_travel_gps)) {
                        self.creaPolylineAdvanced("1", function () {

                            console.log("data.form.times_dis_travel_gps", data.form.times_dis_travel_gps);
                            self.times_dis_travel_gps = JSON.parse(data.form.times_dis_travel_gps);
                            var html = "";
                            html += "<span><strong>Distancia:</strong> " + self.times_dis_travel_gps.distance.text + "</span>";
                            html += "<span><strong>Duración:</strong> " + self.times_dis_travel_gps.duration.text + "</span>";
                            if (qxnw.utils.evalueData(self.times_dis_travel_gps.duration_in_traffic.text)) {
                                html += "<span><strong>Duración con tráfico:</strong> " + self.times_dis_travel_gps.duration_in_traffic.text + "</span>";
                            }
                            html += "<span><strong>Inicia:</strong> " + self.times_dis_travel_gps.start_address + "</span>";
                            html += "<span><strong>Finaliza:</strong> " + self.times_dis_travel_gps.end_address + "</span>";
                            html += "<span><strong>Paradas:</strong> " + self.times_dis_travel_gps.via_waypoint + "</span>";
                            document.querySelector(".class_enc_data_travel").innerHTML = html;

                        });
                    }

                });

                var populate = true;
                if (typeof data.populate_tree !== "undefined") {
                    populate = data.populate_tree;
                }
                console.log("data.conductor", data.conductor);
                if (populate && qxnw.utils.evalueData(data.conductor)) {
                    self.populateTree(function () {
                        if (rutas.length <= 0) {
                            self.seleccionarDriver(data.conductor);
                        }
                    });
                }
            }

            var rutas = [];
            if (typeof dat.rutas == "string") {
////                var decodedStringRutas = atob(dat.rutas);
//                var decodedStringRutas = decodeURIComponent(escape(window.atob(dat.rutas)));
//                console.log("decodedStringRutas", decodedStringRutas);
//                var jsonRutas = decodedStringRutas;
                var jsonRutas = dat.rutas;
                jsonRutas = jsonRutas.replace(/"{/gi, "{");
                jsonRutas = jsonRutas.replace(/}"/gi, "}");
                jsonRutas = jsonRutas.replace(/"\[{/gi, "[{");
                jsonRutas = jsonRutas.replace(/}]"/gi, "}]");
                console.log("jsonRutas", jsonRutas);
                rutas = JSON.parse(jsonRutas);
            } else
            if (typeof dat.rutas == "object") {
                rutas = dat.rutas;
            }
            console.log("restaurarPlantilla:::rutas", rutas);
            if (rutas.length > 0) {
                for (var i = 0; i < rutas.length; i++) {
                    var rut = rutas[i];
                    self.addPreRuta(rut);
                }
            }

            self.restaurandoPlantilla = false;
            return true;
        },
        calculaTiempoFinal: function calculaTiempoFinal() {
            var self = this;
        },
        slotNuevo: function slotNuevo(callbackOnAdd) {
            var self = this;
            var record = self.form.getRecord();
            var d = new enrutamiento.forms.f_agregar_pasajero(callbackOnAdd, record);
            d.setWidth(900);
            d.setMaxWidth(900);
            d.setHeight(600);
            d.setMaxHeight(600);
            d.setModal(true);
            d.show();
        },
        populateTree: function populateTree(callback) {
            var self = this;
            console.log("populateTree:::START");

            self.perms = main.getPermiserv();
            var up = qxnw.userPolicies.getUserData();
//        flota
            console.log("self.perms", self.perms);
            console.log("up", up);
            console.log("up.bodega", up.bodega);

            self.showTreeDrivers("visible");

            self.conductor = false;
            document.querySelector(".class_enc_driver").innerHTML = "Sin pasajero asignado al viaje, por favor seleccione uno";
            self.addTreeHeader(self.tr("Conductores"), qxnw.config.execIcon("view-sort-descending"));

            var dataform = self.form.getRecord();
            var data = {};
            data.ciudad = dataform.ciudad;
            data.buscar_conductor = dataform.buscar_conductor;
//            if (self.perms.form_conductor_flota == "false" || self.perms.form_conductor_flota == false) {
//                if (qxnw.utils.evalueData(up.bodega)) {
//                    data.buscar_conductor = dataform.buscar_conductor;
//                }
//            }
            data.empresa_o_flota = main.empresa_o_flota;
            data.permisos = main.permisos_usuario;

            console.log("populateTree:::data:::", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            var func = function (r) {

                console.log("populateTree:::responseServer:::", r);

                self.addTreeHeader(self.tr(r.records.length + " conductores"), qxnw.config.execIcon("view-sort-descending"));

//                self.addLabelToTree("Total conductores: " + r.length);
                for (var i = 0; i < self.allMarkersDrivers.length; i++) {
                    var mark = self.allMarkersDrivers[i];
                    mark.setMap(null);
                }
                if (r === 0 || r === false || r.length === 0) {
                    return false;
                }
                for (var i = 0; i < r.records.length; i++) {
                    self.addDriverInTree(r.records[i]);
                }
                if (qxnw.utils.evalueData(callback)) {
                    callback();
                }
            };
            rpc.exec("consultaConductores", data, func);
        },
        animaMarkerOutAll: function animaMarkerOutAll(model) {
            var self = this;
            console.log("self.allMarkers", self.allMarkers);
            for (var i = 0; i < self.allMarkers.length; i++) {
                var mark = self.allMarkers[i];
                mark.setAnimation(null);
            }
            if (typeof self.markerc["" + model.id + ""] !== "undefined") {
                self.markerc["" + model.id + ""].setAnimation(google.maps.Animation.BOUNCE);
            }
        },
        addDriverInTree: function addDriverInTree(e) {
            var self = this;
            console.log("addDriverInTree", e);
            var status = main.estadoDriverByData(e);

            var icon = qxnw.config.execIcon("gray", "qxnw");

            var foto = "/nwlib6/icons/2017/user.png";
            if (qxnw.utils.evalueData(e.foto_perfil)) {
                var file = e.foto_perfil;
                var w = "40";
                var mode = "phpthumb";
                foto = qxnw.utils.getFileByType(file, w, mode);
            }

            var nombre = "<p class='name_driver_tree'>" + e.nombre;
            if (main.evalueData(e.apellido)) {
                nombre += e.apellido;
            }
            nombre += "</p>";
            var otros = "<div class='otros_datos_driver_tree'>";
            otros += "<div class='fotodriver' style='background-image:url(" + foto + ");'></div>";

            var placa = "Sin placa";
            if (main.evalueData(e.placa)) {
                placa = e.placa;
            }
            var marca_text = "Sin marca";
            if (qxnw.utils.evalueData(e.marca_text)) {
                marca_text = " " + e.marca_text;
            }
            otros += "<span class='placaandmarca'>" + placa + marca_text + "</span>";

            otros += nombre;

            otros += "<span class='statusdriver'>" + status.todo_in_html + "</span>";

            var fecha_ultima_conexion = "Nunca se ha conectado";
            if (qxnw.utils.evalueData(e.fecha_ultima_conexion)) {
                fecha_ultima_conexion = e.fecha_ultima_conexion;
            }
            otros += "<span>Last: " + fecha_ultima_conexion + "</span>";

            otros += "<span>User: " + e.usuario_cliente + " CC: " + e.nit + "</span>";
            otros += "<span>" + e.marca_text + " - " + e.num_personas + " capMax</span>";
            var servicios = "";
            if (main.evalueData(e.servicios_activos)) {
                servicios = JSON.parse(e.servicios_activos);
                var servs = "";
                for (var i = 0; i < servicios.length; i++) {
                    servs += servicios[i].nombre + " ";
                }
                otros += "<span>" + servs + "</span>";
            } else {
                otros += "<span>Sin servicios</span>";
            }
            e.servicios_driver = servicios;
            if (!main.evalueData(e.latitud) || !main.evalueData(e.longitud)) {
                otros += "<span>Sin ubicación</span>";
            }
            otros += "</div>";
            var ht = "<div class='driverDivInTree'>" + otros + "</div>";

            self.parent[e.id] = self.addTreeFolder(ht, icon, e, true, true, true);
            self.parent[e.id].addListener("click", function () {
                var model = this.getModel();
                console.log("model", model);
                self.seleccionarDriver(model);
                if (!main.evalueData(model.latitud) || !main.evalueData(model.longitud)) {
                    qxnw.utils.information("El usuario no cuenta con coordenadas de ubicación. Esto se debe a que no ha iniciado sesión en la aplicación o no cuenta con los permisos suficientes.");
                    return false;
                }
                self.animaMarkerOutAll(model);
                var location = new google.maps.LatLng(model.latitud, model.longitud);
                self.mapa.googleMap.map.setCenter(location);
            });

//            var iconm = "/lib_mobile/driver/img/pindriver_1_35.png";
            var iconm = main.iconEstadoDriverByData(e);

            e.title = "";
//            e.titleHover = ht;
            e.titleHover = false;
            e.centerMap = false;
            e.openAtClick = false;
            e.animationOnClick = false;
            e.icon = iconm;
            e.callbackMarker = function (marker) {
                self.seleccionarDriver(marker.data);
                self.animaMarkerOutAll(marker.data);
            };
            self.addMarkerInMap(e, "driver");
        },
        creaMarkersEvaluePasajeros: function creaMarkersEvaluePasajeros(e) {
            var self = this;
            var tipo = "pasajero";
            var e_init = e;
            e.icon = "/lib_mobile/driver/img/marker_g.png";
            e.centerMap = false;
            e.openAtClick = true;
            e.title = "";
            e.titleHover = e.pasajero;
            e.callbackMarker = function (marker) {
                console.log("creaMarkersEvaluePasajeros:::ONE:::marker.data", marker.data);
                var dat = marker.data;
                if (qxnw.utils.evalueData(dat.item_qxnw)) {
                    self.navTableEnrutarPass.list1.remove(dat.item_qxnw);
                }

                var selectItem = new qxnw.widgets.listItem(dat.pasajero);
                selectItem.setModel(dat);
                self.navTableEnrutarPass.list2.add(selectItem);

                marker.setMap(null);

                var e = dat;
                e.item_qxnw = selectItem;
                e.icon = "/lib_mobile/driver/img/marker_v.png";
                e.centerMap = false;
                e.openAtClick = true;
                e.title = "";
                e.titleHover = dat.pasajero;
                e.callbackMarker = function (marker) {
                    console.log("creaMarkersEvaluePasajeros:::TWO:::marker.data", marker.data);
                    var dat = marker.data;
                    console.log("dat", dat);
                    if (qxnw.utils.evalueData(dat.item_qxnw)) {
                        self.navTableEnrutarPass.list2.remove(dat.item_qxnw);
                    }

                    var selectItem = new qxnw.widgets.listItem(dat.pasajero);
                    selectItem.setModel(dat);
                    self.navTableEnrutarPass.list1.add(selectItem);
                    marker.setMap(null);

                    e_init.item_qxnw = selectItem;
                    self.creaMarkersEvaluePasajeros(e_init);

                    self.countPasajerosHTML();

                };
                self.addMarkerInMap(e, tipo);

                self.countPasajerosHTML();
            };
            self.addMarkerInMap(e, tipo);
        },
        creaPolyline: function creaPolyline() {
            var self = this;
            console.log("self.usaPolyLine", self.usaPolyLine);
            if (!self.usaPolyLine) {
                return false;
            }
            var pass = self.navTableEnrutarPass.list2.getAllData();

            console.log("pass", pass);

            if (self.usaPolyLineAdvance === true) {
                qxnw.utils.loadingnw_remove("cargando_axtest");
                clearTimeout(self.timer);
                if (self.config.apiGoogleTrafficBack == "SI") {
                    qxnw.utils.loadingnw("Buscando la mejor ruta... Por favor espere...", "cargando_axtest");
                    self.timer = setTimeout(function () {
                        self.creaPolylineAdvanced();
                        qxnw.utils.loadingnw_remove("cargando_axtest");
                    }, 2000);
                } else {
                    self.creaPolylineAdvanced();
                    qxnw.utils.loadingnw_remove("cargando_axtest");
                }

                if (pass.length > 0) {
                    var record = self.form.getRecord();
                    var field = "direccion_a";
                    if (record.sentido == "SALIDA" || record.sentido == "EJECUTIVO") {
                        field = "direccion_b";
                    }
                    console.log("pass[0]", pass[0]);
                    self.setDirections({
                        direccion: pass[0].direccion_parada,
                        latitud: pass[0].latitud,
                        longitud: pass[0].longitud,
                        ciudad: pass[0].ciudad
                    }, field);
                    if (self.config.usa_origen_manual == "SI") {
                        field = "direccion_a";
                        self.setDirections({
                            direccion: pass[0].origen_manual_direccion,
                            latitud: pass[0].origen_manual_latitud,
                            longitud: pass[0].origen_manual_longitud,
                            ciudad: pass[0].origen_manual_ciudad
                        }, field);
                    }
                }
                return;
            }
            console.log("creaPolyline:::START");
            console.log("pass", pass);
            if (self.encodedPolyline) {
                self.encodedPolyline.setMap(null);
            }
            var total = pass.length;
            if (total == 0) {
                return false;
            }
            var flightPlanCoordinates = [];
            for (var i = 0; i < total; i++) {
                var res = pass[i];
                if (main.evalueData(res.latitud) || main.evalueData(res.longitud)) {
                    flightPlanCoordinates.push({lat: parseFloat(res.latitud), lng: parseFloat(res.longitud)});
                }
            }
            self.encodedPolyline = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: "#ec6871",
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            self.encodedPolyline.setMap(self.mapa.googleMap.map);
        },
        creaPolylineAdvanced: function creaPolylineAdvanced(modeList, callback) {
            var self = this;

            if (self.config.apiGoogleTrafficBack != "SI") {
                return false;
            }

            if (typeof google == "undefined") {
                return false;
            }

            var record = self.form.getRecord();
            if (!qxnw.utils.evalueData(callback)) {
                callback = function () {};
            }
            var pass = self.navTableEnrutarPass.list2.getAllData();
            if (modeList == "1") {
                pass = self.navTableEnrutarPass.list1.getAllData();
            }
            if (self.encodedPolyline) {
                self.encodedPolyline.setMap(null);
            }
            if (typeof encodedPolyline !== "undefined") {
                if (encodedPolyline !== null) {
                    encodedPolyline.setMap(null);
                }
            }

            encodedPolyline = null;

            var total = pass.length;

            if (!qxnw.utils.evalueData(record.direccion_a_latitud) ||
                    !qxnw.utils.evalueData(record.direccion_a_longitud) ||
                    !qxnw.utils.evalueData(record.direccion_b_latitud) ||
                    !qxnw.utils.evalueData(record.direccion_b_longitud)
                    ) {
                return false;
            }
            var start = new google.maps.LatLng(record.direccion_a_latitud, record.direccion_a_longitud);
            var end = new google.maps.LatLng(record.direccion_b_latitud, record.direccion_b_longitud);

            if (typeof self.directionsService === 'undefined') {
                self.directionsService = new google.maps.DirectionsService();
            }

//            alert("creaPolylineAdvanced");

            var waypoints = [];
            for (var i = 0; i < total; i++) {
                var res = pass[i];
                if (main.evalueData(res.latitud) || main.evalueData(res.longitud)) {
//                    waypoints.push({lat: parseFloat(res.latitud), lng: parseFloat(res.longitud)});
                    waypoints.push({
                        location: new google.maps.LatLng(res.latitud, res.longitud),
                        stopover: false
                    });
                }
            }

            self.travelMode = "DRIVING";
//            console.log("waypoints", waypoints);
            var request = {
                origin: start,
                destination: end,
                travelMode: self.travelMode,
                waypoints: waypoints,
                drivingOptions: {
                    departureTime: new Date(Date.now()),
                    trafficModel: "pessimistic" //optimistic pessimistic
                },
                unitSystem: google.maps.UnitSystem.METRIC // IMPERIAL inglés millas, METRIC km español
            };

            var colorLine = "red";
            var map = self.mapa.googleMap.map;

            self.directionsService.route(request, function (result, status) {
                var rta = "";
                if (status == google.maps.DirectionsStatus.OK) {
                    rta = result.routes;
                } else
                if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    return callback(false);
                } else {
                    console.log("Error directionsService self.directionsService", self.directionsService);
                    console.log("Error directionsService status", status);
                    console.log("Error directionsService result", result);
                    rta = "sin resultados";
                    console.log("Error in API directionsService status: " + status, " result: " + result);
                    return callback(false);
                }
//                console.log("result", result.routes[0]);
//                console.log("result", result.routes[0].overview_path);
                if (typeof result.routes[0] === "undefined") {
                    return callback(false);
                }
                var pp = [];
                var totPath = result.routes[0].overview_path.length;
                for (var i = 0; i < totPath; i++) {
                    var pat = result.routes[0].overview_path[i];
                    pp.push({
                        lat: pat.lat(),
                        lng: pat.lng()
                    });
                }
                rta.pathOnetoOne = pp;
                for (var n = 0; n < result.routes.length; n++) {
                    var rut = result.routes[n];
                    pintarRutaGoogleMap(rut.overview_polyline);
                }

                function pintarRutaGoogleMap(encodedPoints) {
                    var decodedPoints = google.maps.geometry.encoding.decodePath(encodedPoints);
                    if (encodedPolyline === null) {
                        encodedPolyline = new google.maps.Polyline({
                            strokeColor: colorLine,
                            strokeOpacity: 2.0,
                            strokeWeight: 3,
                            map: map,
                            path: decodedPoints,
                            geodesic: true,
                            clickable: true
                        });
                    } else {
                        encodedPolyline.setPath(decodedPoints);
                    }
                }
                console.log("rta:::END:::", rta);
                var times_dis = rta[0].legs[0];
//                console.log("rta:::END:::times_dis", times_dis);

                self.times_dis_travel_gps = {
                    distance: times_dis.distance,
                    duration: times_dis.duration,
                    duration_in_traffic: times_dis.duration_in_traffic,
                    start_address: times_dis.start_address,
                    end_address: times_dis.end_address,
                    via_waypoint: times_dis.via_waypoint.length
                };
                self.setHTMLDistance();
//                console.log("times_dis", times_dis);
//                console.log("self.times_dis_travel_gps.distance", self.times_dis_travel_gps.distance);

//                var html = "";
//                html += "<span><strong>Distancia:</strong> " + self.times_dis_travel_gps.distance.text + "</span>";
//                html += "<span><strong>Duración:</strong> " + self.times_dis_travel_gps.duration.text + "</span>";
//                html += "<span><strong>Duración con tráfico:</strong> " + self.times_dis_travel_gps.duration_in_traffic.text + "</span>";
//                html += "<span><strong>Inicia:</strong> " + self.times_dis_travel_gps.start_address + "</span>";
//                html += "<span><strong>Finaliza:</strong> " + self.times_dis_travel_gps.end_address + "</span>";
//                html += "<span><strong>Paradas:</strong> " + self.times_dis_travel_gps.via_waypoint + "</span>";
//                document.querySelector(".class_enc_data_travel").innerHTML = html;
//
//                var record = self.form.getRecord();
//                var fecha_init = record.fecha;
//                var hora_init = record.hora;
//                if (!qxnw.utils.evalueData(fecha_init) || !qxnw.utils.evalueData(hora_init)) {
//                    return false;
//                }
//                var fecha_com = fecha_init + " " + hora_init;
//                var minutes = self.times_dis_travel_gps.duration_in_traffic.value / 60;
//                minutes = parseInt(minutes);
//                var fecha = qxnw.utils.addMinutes(fecha_com, minutes);
//                self.form.ui.fecha_final_estimada.setValue(fecha);
                return callback(rta);
            });
        },
        setHTMLDistance: function setHTMLDistance() {
            var self = this;
            var html = "";
            html += "<span><strong>Distancia:</strong> " + self.times_dis_travel_gps.distance.text + "</span>";
            html += "<span><strong>Duración:</strong> " + self.times_dis_travel_gps.duration.text + "</span>";
            html += "<span><strong>Duración con tráfico:</strong> " + self.times_dis_travel_gps.duration_in_traffic.text + "</span>";
            html += "<span><strong>Inicia:</strong> " + self.times_dis_travel_gps.start_address + "</span>";
            html += "<span><strong>Finaliza:</strong> " + self.times_dis_travel_gps.end_address + "</span>";
            html += "<span><strong>Paradas:</strong> " + self.times_dis_travel_gps.via_waypoint + "</span>";
            document.querySelector(".class_enc_data_travel").innerHTML = html;

            var record = self.form.getRecord();
            var fecha_init = record.fecha;
            var hora_init = record.hora;
            if (!qxnw.utils.evalueData(fecha_init) || !qxnw.utils.evalueData(hora_init)) {
                return false;
            }
            var fecha_com = fecha_init + " " + hora_init;
            var minutes = self.times_dis_travel_gps.duration_in_traffic.value / 60;
            minutes = parseInt(minutes);
            var fecha = qxnw.utils.addMinutes(fecha_com, minutes);
            self.form.ui.fecha_final_estimada.setValue(fecha);
        },
        countPasajerosHTML: function countPasajerosHTML() {
            var self = this;

            var pass = self.navTableEnrutarPass.list2.getAllData();
            var total_enrutados = pass.length;
            if (document.querySelector(".class_enc_pasajeros")) {
                document.querySelector(".class_enc_pasajeros").innerHTML = total_enrutados;
                if (qxnw.utils.evalueData(total_enrutados) && total_enrutados.toString() != "0") {
                    self.form.ui.paradas_adicionales_iniciales_creacion.setValue(total_enrutados.toString());
                }
            }

            var pass = self.navTableEnrutarPass.list1.getAllData();
            var total_esperando = pass.length;
            if (document.querySelector(".class_enc_pasajeros_esperan"))
                document.querySelector(".class_enc_pasajeros_esperan").innerHTML = total_esperando;

            console.log("total_enrutados", total_enrutados);
            console.log("total_esperando", total_esperando);
            if (total_enrutados > 0) {
                self.creaPolyline();
            }
        },
        addMarkerInMap: function addMarkerInMap(dir, tipo) {
            var self = this;
            console.log("addMarkerInMap", dir);
            if (!main.evalueData(dir.latitud) || !main.evalueData(dir.longitud)) {
                return false;
            }
            if (!qxnw.utils.isOnline()) {
                console.log("Compruebe su conexión a internet.");
                return false;
            }
            var icon = dir.icon;
            var lat = parseFloat(dir.latitud);
            var lng = parseFloat(dir.longitud);
            var latLong = new google.maps.LatLng(lat, lng);
            var location = latLong;
            var title = dir.title;
            var titleHover = dir.titleHover;
            var openAtClick = dir.openAtClick;
            var animationOnClick = dir.animationOnClick;
            var openIcon = true;
            var centerMap = dir.centerMap;
            var callbackonclick = function (marker) {
                marker.data.callbackMarker(marker);
            };
            self.markerc["" + dir.id + ""] = self.mapa.googleMap.placeMarker(location, title, openAtClick, icon, openIcon, centerMap, callbackonclick, dir, animationOnClick);
            if (tipo == "pasajero") {
                self.allMarkersPasajeros.push(self.markerc["" + dir.id + ""]);
            }
            if (tipo == "driver") {
                self.allMarkersDrivers.push(self.markerc["" + dir.id + ""]);
            }
            self.allMarkers.push(self.markerc["" + dir.id + ""]);

            if (main.evalueData(titleHover)) {
                var infowindow = new google.maps.InfoWindow({
                    content: titleHover,
                    maxWidth: 120,
                    ariaLabel: "Uluru",
                });
                var marker = self.markerc["" + dir.id + ""];
                marker.addListener('mouseover', function () {
                    infowindow.open({
                        anchor: marker
                    });
                });
                marker.addListener('mouseout', function () {
                    infowindow.close();
                });
            }
            return self.markerc["" + dir.id + ""];
        },
        seleccionarDriver: function seleccionarDriver(data) {
            var self = this;
            self.conductor = data;

            var ht = data.nombre;
            if (main.evalueData(data.apellido)) {
                ht += data.apellido;
            }
            if (main.evalueData(data.placa)) {
                ht += " placa: " + data.placa;
            }
            document.querySelector(".class_enc_driver").innerHTML = ht;

            var items = self.tree.getItems(true);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var model = item.getModel();
                if (main.evalueData(model)) {
                    if (model.id == data.id) {
                        item.addState("selected");
                        self.tree.setSelection([item]);
                    }
                }
            }
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.data = pr;
        }
    }
});
