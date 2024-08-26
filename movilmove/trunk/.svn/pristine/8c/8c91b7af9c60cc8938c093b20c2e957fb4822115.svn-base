qx.Class.define("transmovapp.tree.conf_servicio", {
    extend: qxnw.treeWidget,
    construct: function (data) {
        this.base(arguments);
        var self = this;
        self.dat = {};
        self.dat.no_mascotas = 0;
        self.setAskOnClose(true);
        self.setGroupHeader("Servicio Ejecutivo A-B");
        this.setTitle("Servicio Ejecutivo A-B");

        var up = qxnw.userPolicies.getUserData();

        self.conductorSelected = false;
        self.pages = [];
        self.markerc = {};
//        self.createSecondLayer();
        self.eventOrigen = new Event('addMarkerOrigen');
        self.eventDestino = new Event('addMarkerDestino');
        self.eventClose = new Event('close');
        self.eventremove = new Event('removeMarker');
        self.resultsDestino = false;
        self.resultsOrigen = false;
        self.paradasAdicionalesVal = false;
        self.__oldMarker = [];
        self.parent = {};
        self.mostrar_group_detalle = true;

        self.formservi = new qxnw.forms();
        self.__conf = main.getConfiguracion();
        self.paradas_adicionales = [];
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "conductor",
                label: "Conductor",
                caption: "conductor",
                type: "textField",
                visible: false
            },
            {
                name: "motorizado",
                label: "Motorizado",
                caption: "motorizado",
                type: "textField",
                visible: false
            },
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Información General",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "tipo_servicio",
                label: self.tr("<strong>Tipo de Servicio</strong>"),
                type: "selectBox",
                required: true,
                row: 0,
                column: 1
            },
            {
                name: "subservicio",
                label: self.tr("<strong>Subservicio</strong>"),
                caption: "subservicio",
                type: "selectBox",
                required: false,
                row: 0,
                column: 2
            },
            {
                name: "servicio_para",
                label: self.tr("<strong>Servicio Para</strong>"),
                caption: "servicio_para",
                type: "selectBox",
                required: true,
                row: 0,
                column: 3
            },
            {
                name: "fecha",
                label: self.tr("<strong>Fecha</strong>"),
                caption: "fecha",
                type: "dateField",
                required: false,
//                enabled: true,
                row: 1,
                column: 1
            },
            {
                name: "hora",
                label: self.tr("<strong>Hora</strong>"),
                caption: "hora",
                type: "timeField",
                required: false,
                row: 1,
                column: 2
            },
            {
                name: "datos_vehiculo_elegido",
                label: self.tr("<strong>Placa y Color del vehículo</strong>"),
                caption: "datos_vehiculo_elegido",
                type: "textField",
                required: false,
                row: 1,
                column: 3
            },
            {
                name: "tipo_tarifa",
                label: self.tr("<strong>Tipo Tarifa</strong>"),
                caption: "tipo_tarifa",
                type: "selectBox",
                required: true,
                row: 0,
                column: 3
            },
            {
                name: "reservar",
                label: self.tr("<strong>Reservar</strong>"),
                caption: "reservar",
                type: "textField",
                visible: false
            },
            {
                name: "ahora",
                label: self.tr("<strong>Ahora</strong>"),
                caption: "ahora",
                type: "textField",
                visible: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Dirección Origen y Destino",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "origen",
                label: "Dirección Origen",
                caption: "origen",
                type: "textField",
                required: true,
                row: 0,
                column: 0
            },
            {
                name: "ciudad_origen",
                label: self.tr("<strong>Ciudad Origen</strong>"),
                caption: "ciudad_origen",
                type: "textField",
                required: true,
                enabled: false,
                row: 0,
                column: 1
            },
            {
                name: "destino",
                label: "Dirección Destino",
                caption: "destino",
                type: "textField",
                required: true,
                row: 1,
                column: 0
            },
            {
                name: "ciudad_destino",
                label: self.tr("<strong>Ciudad Destino</strong>"),
                caption: "ciudad_destino",
                type: "textField",
                required: true,
                enabled: false,
                row: 1,
                column: 1
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.formservi.setFields(fields);

        var doss = 140;
        var cien = 80;
        if (main.isCustomer()) {
            doss = 180;
            cien = 80;
        }
        self.formservi.ui.origen.setMaxWidth(doss);
        self.formservi.ui.origen.setMinWidth(doss);
        self.formservi.ui.destino.setMaxWidth(doss);
        self.formservi.ui.destino.setMinWidth(doss);
        self.formservi.ui.ciudad_destino.setMaxWidth(doss);
        self.formservi.ui.ciudad_destino.setMinWidth(doss);
        self.formservi.ui.ciudad_origen.setMinWidth(doss);
        self.formservi.ui.ciudad_origen.setMaxWidth(doss);
        self.formservi.ui.servicio_para.setMaxWidth(cien);
        self.formservi.ui.servicio_para.setMinWidth(cien);
        self.formservi.ui.tipo_servicio.setMaxWidth(cien);
        self.formservi.ui.tipo_servicio.setMinWidth(cien);

        if (self.__conf.usa_subservicios != 'SI') {
            self.setFieldVisibility(self.formservi.ui.subservicio, "excluded");
        }

        self.formservi.ui.fecha.setValue(new Date());

        var f = new Date();
        self.formservi.ui.hora.setValue(f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds());

        var t = main.getConfiguracion();

        var group = self.formservi.getGroup("informacion_general");
        var group2 = self.formservi.getGroup("direccion_origen_y_destino");

        self.mapa = new transmovapp.forms.f_mapa(data);
        self.container = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            marginTop: 0
        });
        self.containerLeft = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
            marginTop: 0
        });
        self.container.add(self.containerLeft, {
            flex: 1
        });
        self.containerRight = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
            marginTop: 0
        });
        self.container.add(self.containerRight, {
            flex: 1
        });
        self.containerLeft.add(self.mapa.masterContainer, {
            flex: 1
        });

        self.containerRight.add(group2, {
            flex: 1
        });
        self.containerRight.add(group, {
            flex: 1
        });
        self.rightWidget.addBefore(self.container, self.tabView);

        self.containerFilters.setVisibility("excluded");

        self.formservi.setRequired("datos_vehiculo_elegido", false);
        self.formservi.setFieldVisibility(self.formservi.ui.datos_vehiculo_elegido, "excluded");
        self.formservi.setRequired("fecha", false);
        self.formservi.setRequired("hora", false);
        self.formservi.ui.fecha.setEnabled(false);
        self.formservi.ui.hora.setEnabled(false);

        var m = {};
        m["ahora"] = self.tr("Ahora");
        m["reservado"] = self.tr("Reservado");
        qxnw.utils.populateSelectFromArray(self.formservi.ui.servicio_para, m);

        var data = {};
        data[""] = "Seleccione";
        qxnw.utils.populateSelectFromArray(self.formservi.ui.tipo_servicio, data);
        qxnw.utils.populateSelect(self.formservi.ui.tipo_servicio, "usuarios", "tarifa", data);

        var data = {};
        data["trayecto"] = "Trayecto";
        data["horas"] = "Horas";
        qxnw.utils.populateSelectFromArray(self.formservi.ui.tipo_tarifa, data);

        self.setFieldVisibility(self.formservi.ui.tipo_tarifa, "excluded");
        if (t.tipo_servicio == "TRAYECTO") {
            self.formservi.ui.tipo_tarifa.setValue("TRAYECTO");
            self.formservi.ui.tipo_tarifa.setEnabled(false);
        } else
        if (t.tipo_servicio == "HORAS") {
            self.formservi.ui.tipo_tarifa.setValue("HORAS");
            self.formservi.ui.tipo_tarifa.setEnabled(false);
        }

        self.formservi.ui.fecha.addListener("focusout", function () {
            self.validaFecha(self.formservi, "fecha", "Recuerde que la fecha del servicio no puede ser menor a la actual");
        });
        self.formservi.ui.servicio_para.addListener("changeSelection", function () {
            var data = self.formservi.getRecord();
            if (data.tipo_servicio == "") {
                qxnw.utils.information("Por favor Elija el tipo de servicio");
                return;
            }
            if (data.servicio_para == "ahora") {
                self.formservi.ui.reservar.setValue("NO");
                self.formservi.ui.ahora.setValue("SI");
                self.formservi.setRequired("fecha", false);
                self.formservi.setRequired("hora", false);
                self.formservi.ui.fecha.setEnabled(false);
                self.formservi.ui.hora.setEnabled(false);
//                self.formservi.setFieldVisibility(self.formservi.ui.fecha, "excluded");
//                self.formservi.setFieldVisibility(self.formservi.ui.hora, "excluded");
            } else if (data.servicio_para == "reservado") {
                self.formservi.ui.fecha.setEnabled(true);
                self.formservi.ui.hora.setEnabled(true);
                self.formservi.setFieldVisibility(self.formservi.ui.hora, "visible");
                self.formservi.setFieldVisibility(self.formservi.ui.fecha, "visible");
                self.formservi.setRequired("fecha", true);
                self.formservi.setRequired("hora", true);
                self.formservi.ui.reservar.setValue("SI");
                self.formservi.ui.ahora.setValue("NO");
                var datos = self.formservi.ui.tipo_servicio.getValue();
                self.dat.minutos_agregar_a_fecha = datos.tipo_servicio_model.minutos_agregar_a_fecha;
                if (!self.dat.minutos_agregar_a_fecha || self.dat.minutos_agregar_a_fecha == "" || self.dat.minutos_agregar_a_fecha == 0) {
                    self.dat.minutos_agregar_a_fecha = 60;
                }
                self.dat.fecha_minima_servi = self.revHora();
                var res = self.dat.fecha_minima_servi.toString().split("/");
                var fecha = res[0];
                var hora = res[1];
                self.horaminima_res = res[1];
                self.formservi.ui.hora.setValue(hora);
                self.formservi.ui.fecha.setValue(fecha);
            } else {
                self.formservi.ui.reservar.setValue("");
                self.formservi.ui.ahora.setValue("");
            }

            if (!main.isCustomer()) {
                self.initConductores();
            }
        });

        if (t.servicios_para == "AHORA") {
            self.formservi.ui.servicio_para.setValue("ahora");
            self.formservi.ui.servicio_para.setEnabled(false);
        }
        if (t.servicios_para == "RESERVA") {
            self.formservi.ui.servicio_para.setValue("Reservar");
            self.formservi.ui.servicio_para.setEnabled(false);
        }


        self.formservi.ui.subservicio.addListener("changeSelection", function () {
            var data = self.formservi.ui.tipo_servicio.getValue();
            var dat = this.getValue();
            var data = Object.assign(data, dat);
            if (dat.subservicio != "" && dat.subservicio != null) {
                self.slotTarifa(data);
            }
        });

        main.__minutosmin = false;
        self.formservi.ui.tipo_servicio.addListener("changeSelection", function () {
            var data = this.getValue();
            self.mapa.ui.recogiendo.setValue("");
            self.mapa.ui.sitio.setValue("");
            self.mapa.ui.transportando.setValue("");

            main.__minutosmin = false;

            if (data.tipo_servicio != "") {
                rebot();
                self.formservi.ui.subservicio.removeAll();
            }

            if (qxnw.utils.evalue(data.tipo_servicio_model)) {

                if (main.evalueData(data.tipo_servicio_model.minutosMinimosParaPedirService)) {
                    main.__minutosmin = data.tipo_servicio_model.minutosMinimosParaPedirService;
                }
                console.log("data.tipo_servicio_model", data.tipo_servicio_model);
                console.log("usu.servi.minutosMinimosParaPedirService", main.__minutosmin);

                if (data.tipo_servicio_model.pide_vehiculo_cliente == "SI") {
                    self.formservi.setRequired("datos_vehiculo_elegido", true);
                    self.formservi.setFieldVisibility(self.formservi.ui.datos_vehiculo_elegido, "visible");
                }
                if (data.tipo_servicio_model.reservar == "SI") {
                    self.formservi.ui.servicio_para.setValue("reservado");
                    self.formservi.ui.servicio_para.setEnabled(false);
                }
                if (data.tipo_servicio_model.reservar == "SI" && data.tipo_servicio_model.mostrar_fecha_hora != "SI") {
//                    self.setFieldVisibility(self.formservi.ui.fecha, "excluded");
//                    self.setFieldVisibility(self.formservi.ui.hora, "excluded");
                }
            }
            if (data.tipo_servicio != "") {
                self.slotTarifa(data);
            }

            function rebot() {
                self.formservi.setRequired("datos_vehiculo_elegido", false);
                self.formservi.ui.datos_vehiculo_elegido.setValue("");
                self.formservi.setFieldVisibility(self.formservi.ui.datos_vehiculo_elegido, "excluded");
                if (t.servicios_para == "AMBOS") {
                    self.formservi.ui.servicio_para.setValue("ahora");
                    self.formservi.ui.servicio_para.setEnabled(true);
                }
                if (t.servicios_para == "AHORA") {
                    self.formservi.ui.servicio_para.setValue("ahora");
                    self.formservi.ui.servicio_para.setEnabled(false);
                }
                if (t.servicios_para == "RESERVA") {
                    self.formservi.ui.servicio_para.setValue("Reservar");
                    self.formservi.ui.servicio_para.setEnabled(false);
                }
            }
            if (!main.isCustomer()) {
                self.initConductores();
            }


        });


        self.formservi.ui.hora.time.getChildControl("textfield").addListener("changeValue", function (e) {
            self.validaHora();
        });
        self.formservi.ui.hora.hour.getChildControl("textfield").addListener("changeValue", function (e) {
            if (this.getValue() == 0) {
                this.setValue("1");
            }
            self.validaHora();
        });
        self.formservi.ui.hora.ampm.getChildControl("textfield").addListener("changeValue", function (e) {
            self.validaHora();
        });

        var fecha = new Date();
        var fano = fecha.getFullYear();
        var fmes = fecha.getMonth() + 1;
        var fdia = fecha.getDate();
        self.formservi.ui.fecha.addListener("focusout", function () {
            var fecha_servicio = self.formservi.ui.fecha.getValue();
            var fsano = fecha_servicio.getFullYear();
            var fsmes = fecha_servicio.getMonth() + 1;
            var fsdia = fecha_servicio.getDate();
            if (fano > fsano) {
                qxnw.utils.information("Debe seleccionar una fecha mayor.Verifique por favor");
//                self.ui.fecha.setValue(null);
            } else {
                if (fmes > fsmes) {
                    qxnw.utils.information("Debe seleccionar una fecha mayor.Verifique por favor");
//                    self.ui.fecha.setValue(null);
                } else {
                    if (fano == fsano && fmes == fsmes) {
                        if (fdia > fsdia) {
                            qxnw.utils.information("Debe seleccionar una fecha mayor.Verifique por favor");
//                            self.ui.fecha.setValue(null);
                        }
                    }
                }
            }
        });



        self.addListener("appear", function () {

            qx.bom.element.Class.add(self.getContentElement().getDomElement(), "container_form_creaservicio");

            qx.bom.element.Class.add(self.formservi.ui.origen.getLayoutParent().getContentElement().getChildren()[1].getDomElement(), "origen");
            qx.bom.element.Class.add(self.formservi.ui.destino.getLayoutParent().getContentElement().getChildren()[1].getDomElement(), "destino");

            main.autocomplete(".origen", self.googleMap, function (e) {
                self.formservi.ui.ciudad_origen.setValue(e.ciudad);
                self.eventOrigen.data = e;
                document.dispatchEvent(self.eventOrigen);
                self.resultsOrigen = e;
                if (self.resultsDestino) {
                    self.eventDestino.data = self.resultsDestino;
                    document.dispatchEvent(self.eventDestino);
                }
                var data = self.formservi.ui.tipo_servicio.getValue();
                var dat = self.formservi.ui.subservicio.getValue();
                var data = Object.assign(data, dat);
                self.slotTarifa(data);

            });
            main.autocomplete(".destino", self.googleMap, function (e) {
                self.resultsDestino = e;
                self.eventDestino.data = e;
                document.dispatchEvent(self.eventDestino);
                self.formservi.ui.ciudad_destino.setValue(e.ciudad);

                var data = self.formservi.ui.tipo_servicio.getValue();
                var dat = self.formservi.ui.subservicio.getValue();
                var data = Object.assign(data, dat);
                self.slotTarifa(data);
            });
        });

        var buttons = [
            {
                label: 'Confirmar servicio',
                name: 'crear_servicio',
                icon: qxnw.config.execIcon("dialog-accept")
            },
            {
                label: 'Cancelar',
                name: 'cancelar',
                icon: qxnw.config.execIcon("dialog-close")
            }
        ];
        self.addButtons(buttons);
        self.encodedPolyline = false;
        self.ui.crear_servicio.addListener("execute", function () {
            self.crearServicio();
        });
        self.ui.cancelar.addListener("execute", function () {
            qxnw.utils.question("¿Deseas cancelar la operación y cerrar la ventana?", function (e) {
                if (e) {
                    clearInterval(self.interval);
//                    if (document.getElementById("iframechat_")) {
//                        var d = document.getElementById("iframechat_");
//                        d.parentNode.removeChild(d);
//                    }
                    document.dispatchEvent(self.eventClose);
                    self.reject();
                }
            });
        });
        if (main.isCustomer()) {
            self.leftScroller.setVisibility("excluded");
            self.setFieldVisibility(self.ui.texfield_auto_filter, "excluded");
        }

        self.slotConfirmarInicioDestino();
        group.setVisibility("visible");
    },
    members: {
        vistaGeneral: null,
        map: null,
        parent: null,
        crearServicio: function crearServicio() {
            var self = this;
            console.log("self.formservi::execute");
            if (!self.formservi.validate()) {
                console.log("self.formservi::no_validate");
                return;
            }
//            if (self.__conf.app_para == 'CARGA') {
//                if (!self.detalle.validate()) {
//                    if (self.detalle_ventana) {
//                        self.selectPage(self.detalle_ventana);
//                    }
//                    return;
//                }
//            }

            self.dat.latitudOri = self.mapa.coords["lat"];
            self.dat.longitudOri = self.mapa.coords["lng"];
            self.dat.latitudDes = self.mapa.coords["lat2"];
            self.dat.longitudDes = self.mapa.coords["lng2"];

            var paradas = self.navTableParadasPersonas.getAllData();


            console.log("paradas", paradas);

            if (paradas.length == 0) {
                var msg = "¿Desea continuar sin paradas adicionales?";
                qxnw.utils.question(msg, function (e) {
                    if (e) {
                        lastQuestion();
                    } else {
                        return;
                    }
                });
            } else {
                lastQuestion();
            }


            function lastQuestion() {
                console.log("self.conductorSelected", self.conductorSelected);
                if (main.evalueData(self.conductorSelected)) {
                    self.slotCond(self.conductorSelected, function () {
                        self.conductorSelected = false;
                        self.crearServicio();
                    });
                } else {
                    var msg = "¿Desea continuar sin conductor?";
                    if (main.isCustomer() && main.evalueData(self.__conf.clienteEstadoCreaServicios)) {
                        msg = "¿Desea crear el servicio para " + self.__conf.clienteEstadoCreaServicios + "?";
                    }
                    if (!self.dat.conductor) {
                        qxnw.utils.question(msg, function (e) {
                            if (e) {
                                self.slotSave();
                            } else {
                                return;
                            }

                        });
                    } else {
                        self.slotSave();
                    }
                }
            }
        },
        slotConfirmarInicioDestino: function slotConfirmarInicioDestino(sl) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            if (self.__conf.app_para == 'CARGA') {
                self.formDesc();
            }
            if (sl == null) {
                var data = self.formservi.getRecord();
            } else {
                var data = sl;
                data.origen = "Sin destino";
                data.destino = "Sin destino";
                self.formservi.ui.ciudad_destino.setValue("Sin destino");
                self.formservi.ui.origen.setValue("Sin Origen");
                self.formservi.ui.ciudad_origen.setValue("Sin Origen");
                self.formservi.ui.destino.setValue("Sin destino");

                setTimeout(function () {
                    data.origen = "";
                    data.destino = "";
                    self.formservi.ui.ciudad_destino.setValue("");
                    self.formservi.ui.origen.setValue("");
                    self.formservi.ui.ciudad_origen.setValue("");
                    self.formservi.ui.destino.setValue("");
                }, 500);
            }
            if (typeof self.createNavs !== "undefined") {
                if (self.createNavs === true) {
//                    self.selectPage(self.mapaNavTable);
                    return;
                }
            }
//            self.formDataAirport();
            self.navParadasPersonas(sl);

            self.formservi.ui.usuario.addListener("loadData", function (e) {
                var data = {};
                data["token"] = e.getData();
                if (main.isCustomer()) {
                    data.bodega = up.bodega;
                }
                var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
                rpc.setAsync(true);
                var func = function (r) {
                    self.formservi.ui.usuario.setModelData(r);
                    var item = self.formservi.getRecord();
                    if (self.editar == false) {
                    } else {
                        self.editar = false;
                    }
                };
                rpc.exec("populateTokenUsuarios", data, func);
            }, this);

            if (main.isCustomer()) {
                var usuario = {
                    bodega: "42",
                    celular: "3125729272",
                    centro_costo: "5",
                    documento: null,
                    empresa: "24",
                    id: "1",
                    nombre: "orionjafe@gmail.com",
                    nombre_usuario: "Alexander Flórez F",
                    perfil: "1"
                };
                self.formservi.ui.usuario.setModelData(usuario);
                self.formservi.ui.usuario.addToken(usuario);
            }

            var user_cc = main.getUsercc();
            console.log("user_cc", user_cc);
            console.log("main.isCustomer()", main.isCustomer());
            if (main.isCustomer()) {
//            if (main.isCustomer() && typeof user_cc !== "undefined") {
                var nombre = "";
                if (main.evalueData(up.nombre)) {
                    nombre += " " + up.nombre;
                }
                if (main.evalueData(up.name)) {
                    nombre += " " + up.name;
                }
                if (main.evalueData(up.apellido)) {
                    nombre += " " + up.apellido;
                }
                var user = {
                    bodega: up.bodega,
                    celular: up.celular,
                    centro_costo: "5",
                    documento: up.documento,
                    empresa: up.company,
                    id: up.code,
                    nombre: up.email,
                    nombre_usuario: nombre,
                    perfil: up.profile
                };
                console.log("upupupupupupupupupupupupupupupupupupupupupupupupupup", up);
                console.log("user", user);
                self.formservi.ui.usuario.addToken(user);
                self.formservi.ui.usuario.setEnabled(false);
//                self.setFieldVisibility(self.formservi.ui.usuario, "excluded");

                if (main.isCustomer()) {
                    self.formservi.ui.crear_usuario.setVisibility("excluded");
                }
            }

            self.formservi.ui.usuario.hideColumn("id");
            self.formservi.ui.usuario.addListener("addItem", function () {
                self.formservi.ui.centro_costo.setValue("");
            });
            self.formservi.ui.usuario.addListener("addItem", function () {
                var item = self.formservi.getRecord();
                console.log(item);
                if (self.editar == false) {
                } else {
                    self.editar = false;
                }
                if (qxnw.utils.evalue(item.usuario_array)) {
                    if (qxnw.utils.evalue(item.usuario_array.bodega) && qxnw.utils.evalue(item.usuario_array.centro_costo)) {
                        if (item.usuario_array.bodega !== "" && item.usuario_array.centro_costo !== "") {
                            var dat = item.usuario_array.bodega;
                            qxnw.utils.populateSelect(self.formservi.ui.centro_costo, "empresas", "populateCentros", dat);
                            self.setFieldVisibility(self.formservi.ui.centro_costo, "visible");
                            if (typeof item.usuario_array.centro_costo != 'undefined' && item.usuario_array.centro_costo != "" && item.usuario_array.centro_costo != null) {
                                self.formservi.ui.centro_costo.setValue(item.usuario_array.centro_costo);
                                self.formservi.ui.centro_costo.setEnabled(false);
                            }
                        }
                    }
                }
            }, this);

            self.formservi.ui.crear_usuario.addListener("execute", function () {
                self.crearUsuario();
            });


            console.log("self.__conf", self.__conf);
            console.log("self.__conf.clienteServicioPorDefecto", self.__conf.clienteServicioPorDefecto);
            console.log("self.__conf.clientePreciosVisibles", self.__conf.clientePreciosVisibles)
            if (main.isCustomer()) {
//                if (self.__conf.clienteServicioPorDefecto != "NO" && self.__conf.clienteServicioPorDefecto != null && self.__conf.clienteServicioPorDefecto != "0") {
                if (main.evalueData(self.__conf.clienteServicioPorDefecto)) {

                    console.log("self.__conf.clienteServicioPorDefecto", self.__conf.clienteServicioPorDefecto);
                    self.formservi.ui.tipo_servicio.setValue(self.__conf.clienteServicioPorDefecto);
                    self.formservi.ui.tipo_servicio.setEnabled(false);
                    self.formservi.ui.tipo_servicio.setVisibility("excluded");

                }
                if (self.__conf.clientePreciosVisibles == "NO") {
                    self.setFieldVisibility(self.mapa.ui.recogiendo, "hidden");
                }
            }


            var data = {};
            data[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(self.formservi.ui.centro_costo, data);
//            self.setFieldVisibility(self.formservi.ui.centro_costo, "excluded");

//            var user_cc = main.getUsercc();
            console.log("user_cc", user_cc);
            if (self.__conf.app_para == 'CARGA' ||
                    qxnw.utils.evalue(self.__conf.usa_centros_de_costo)
                    && self.__conf.usa_centros_de_costo == "SI") {
                var dat = up.bodega;
                console.log("up.bodega:::dat", dat);

                if (qxnw.utils.evalue(dat) && dat !== "") {

                    console.log("self.formservi.ui.centro_costo", self.formservi.ui.centro_costo);

                    qxnw.utils.populateSelect(self.formservi.ui.centro_costo, "empresas", "populateCentros", dat);

//                    self.setFieldVisibility(self.formservi.ui.centro_costo, "visible");

                    if (typeof user_cc.centro_costo != 'undefined' && user_cc.centro_costo != "" && user_cc.centro_costo != null) {
                        self.formservi.ui.centro_costo.setValue(user_cc.centro_costo);
                        self.formservi.ui.centro_costo.setEnabled(false);
                    }
                }
            }
//            self.selectPage(self.mapaNavTable);
            self.createNavs = true;
//            self.selectPage(self.navParadasPersons);
        },
//        autocomplete: function autocomplete(inputs, map, callback) {
//            var self = this;
//            var input = document.querySelector(inputs);
//            var autocomplete = new google.maps.places.Autocomplete(input);
//            autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
//            autocomplete.addListener('place_changed', function () {
//                var place = autocomplete.getPlace();
//                if (!place.geometry) {
//                    qxnw.utils.information("No details available for input: '" + place.name + "'");
//                    return;
//                }
//
//                var address = '';
//                if (place.address_components) {
//                    address = [
//                        (place.address_components[0] && place.address_components[0].short_name || ''),
//                        (place.address_components[1] && place.address_components[1].short_name || ''),
//                        (place.address_components[2] && place.address_components[2].short_name || '')
//                    ].join(' ');
//                }
//                var geocoder = new google.maps.Geocoder();
//                var ui = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
//                geocoder.geocode({'latLng': ui}, processGeocoderValidate);
//                function processGeocoderValidate(results, status) {
//                    if (status === google.maps.GeocoderStatus.OK) {
//                        var resultsFin = self.extraerDataResult(results[0]);
//                        var rta = {};
////                        rta.place = place;
//                        rta.address = address;
//                        rta.location = results[0].geometry.location;
//                        rta["direccion"] = resultsFin.direccion;
//                        rta["barrio"] = resultsFin.barrio;
//                        rta["localidad"] = resultsFin.localidad;
//                        rta["ciudad"] = resultsFin.ciudad;
//                        rta["pais"] = resultsFin.pais;
////                    rta.marker = marker;
////                        rta.autocomplete = autocomplete;
//                        callback(rta);
//                    } else {
//                        error("Geocoding fallo debido a : " + status);
//                    }
//                }
//            });
//        },
//        extraerDataResult: function extraerDataResult(results) {
//            var self = this;
//            var data = {};
//            var a = self.getDataResult(results);
////        console.log(a);
//            data.address_components = a;
//            data["address"] = results.formatted_address;
//            data["direccion"] = results.formatted_address;
//            data["barrio"] = a.neighborhood;
//            data["localidad"] = a.sublocality;
//            var pais = "";
//            var address = results.address_components;
//            //recorremos todos los elementos de address
//            for (var p = address.length - 1; p >= 0; p--) {
//                //si es un pais
//                if (address[p].types.indexOf("country") !== -1) {
//                    var v = address[p].long_name;
//                    if (v !== undefined) {
//                        pais = v;
//                    }
//                }
//            }
//            var ciudad = "";
//            //recorremos todos los elementos de address
//            address.reverse();
//            for (var p = address.length - 1; p >= 0; p--) {
//                //si es una ciudad 
//                if (address[p].types.indexOf("locality") !== -1) {
//                    var v = address[p].long_name;
//                    if (v !== undefined) {
//                        ciudad = v;
//                    }
//                }
//                if (ciudad === "") {
//                    //si es una ciudad de nivel 2
//                    if (address[p].types.indexOf("administrative_area_level_1") !== -1) {
//                        var v = address[p].long_name;
//                        if (v !== undefined) {
//                            ciudad = v;
//                        }
//                    }
//                    if (address[p].types.indexOf("administrative_area_level_2") !== -1) {
//                        var v = address[p].long_name;
//                        if (v !== undefined) {
//                            ciudad = v;
//                        }
//                    }
//                }
//            }
//            var poblacion = "";
////recorremos todos los elementos de address
//            for (var p = address.length - 1; p >= 0; p--) {
//                //si es una población
//                if (address[p].types.indexOf("administrative_area_level_1") !== -1) {
//                    var v = address[p].long_name;
//                    if (v !== undefined) {
//                        poblacion = v;
//                    }
//                }
//            }
//            data.poblacion = poblacion;
//            data.ciudad = ciudad;
////        data.ciudad = a.locality;
////        data["pais"] = a.country;
//            data.pais = pais;
//            data.allData = results;
//            return data;
//        },
//        getDataResult: function getDataResult(results) {
//            var re = results;
//            var d = re.address_components;
//            var total = d.length;
//            var r = {};
//            for (var i = 0; i < total; i++) {
//                var x = d[i];
//                var val = x.long_name;
//                var t = x.types;
//                for (var y = 0; y < t.length; y++) {
//                    var g = t[y];
//                    if (g == "political") {
//                        continue;
//                    }
//                    r[g] = val;
//                }
//            }
//            if (typeof r.route != "undefined") {
//                if (typeof r.route.split(" ")[0] != "undefined") {
//                    r.mode = r.route.split(" ")[0];
//                }
//                if (typeof r.route.split(" ")[1] != "undefined") {
//                    r.mode_number = r.route.split(" ")[1];
//                }
//            }
//            if (results.length > 1) {
//                var d = results[1].address_components;
//                var total = d.length;
//                for (var i = 0; i < total; i++) {
//                    var x = d[i];
//                    var val = x.long_name;
//                    var t = x.types;
//                    for (var y = 0; y < t.length; y++) {
//                        var g = t[y];
//                        if (typeof r.neighborhood == "undefined" && g == "neighborhood" || typeof r.sublocality == "undefined" && g == "sublocality" || typeof r.sublocality_level_1 == "undefined" && g == "sublocality_level_1") {
//                            r[g] = val;
//                        }
//                    }
//                }
//            }
//            return r;
//        },
        populateTree: function populateTree(data) {
            var self = this;
            var dataform = self.formservi.getRecord();
            console.log("dataform", dataform);

            self.addTreeHeader(self.tr("Conductores"), qxnw.config.execIcon("view-sort-descending"));
            self.framePositionConductor(data, allItem);
            var load = false;

            var fecha_hora = main.getDateTime(false, 2);
            console.log("fecha_hora", fecha_hora);
            var fecha_sola = main.getDateTime();
            console.log("fecha_sola", fecha_sola);

            function allItem(e) {
                console.log("dataDriver::::eeeee:::e", e);
                if (load == false) {
                    qxnw.utils.stopLoading();
                }
                load = true;
                if (self.parent[e.id]) {
                    return false;
                }
                var online = "Online";
                var color = "green";
                var fechalast = "0000-00-00 00:00:00";
                if (main.evalueData(e.fecha_ultima_conexion)) {
                    fechalast = e.fecha_ultima_conexion;
                }

                var icon = qxnw.config.execIcon("green", "qxnw");
                if (fechalast < fecha_hora) {
                    icon = qxnw.config.execIcon("white", "qxnw");
                    online = "Offline";
//                    color = "gray";
                    color = "#f3f3f3";
                }
                var colorSoat = "background-color: green;color:#fff;";
                if (e.fecha_vencimiento_soat <= fecha_sola) {
                    colorSoat = "background-color: red;color:#fff;";
                }
                var colorTecno = "background-color: green;color:#fff;";
                if (e.fecha_vencimiento_tegnomecanica <= fecha_sola) {
                    colorTecno = "background-color: red;color:#fff;";
                }
                var colorLic = "background-color: green;color:#fff;";
                if (e.fecha_vencimiento <= fecha_sola) {
                    colorLic = "background-color: red;color:#fff;";
                }
                if (!main.evalueData(e.preoperacional_novedad_encontrada)) {
                    e.preoperacional_novedad_encontrada = "Sin realizar";
                }
                var colorPreo = "background-color: red;color:#fff;";
                if (e.preoperacional_novedad_encontrada == "NO") {
                    colorPreo = "background-color: green;color:#fff;";
                }
                var html = "<p class='containDriversTree'>";
                html += "<b style='font-size: 13px;'>" + e.nombre + "</b>";
                html += "<br><b>CC:</b> " + e.nit + "";
                html += "<br><b>User:</b> " + e.usuario_cliente + "";

                html += "<br><b>Última Conexión:</b><br />" + fechalast + "";
                var horai = "00";
                if (main.evalueData(e.hora_inicio)) {
                    horai = e.hora_inicio;
                }
                var horaf = "00";
                if (main.evalueData(e.hora_fin)) {
                    horaf = e.hora_fin;
                }
                html += "<br><b>Horario:</b> " + horai + "-" + horaf + "";
                var maletas = "Sin definir";
                if (main.evalueData(e.num_maletas)) {
                    maletas = e.num_maletas;
                }
                var numpersons = "Sin definir";
                if (main.evalueData(e.num_personas)) {
                    numpersons = e.num_personas;
                }
                html += "<br><b>Licencia:</b> " + e.no_licencia + "";
                html += "<br><b>PLACA:</b> " + e.placa + "";
                html += "<br><b>Estado vehículo:</b> " + e.estado_activacion_text + "";
                html += "<br><b style='" + colorSoat + "'>SOAT vence:</b> " + e.fecha_vencimiento_soat + "";
                html += "<br><b style='" + colorTecno + "'>TECNO vence:</b> " + e.fecha_vencimiento_tegnomecanica + "";
                html += "<br><b style='" + colorLic + "'>LICENCIA vence:</b> " + e.fecha_vencimiento + "";
                html += "<br><b style='" + colorPreo + "'>Preoper novedad:</b> " + e.preoperacional_novedad_encontrada + "";
                html += "<br><b>Preoper última revisión:</b><br />" + e.preoperacional_ultima_fecha + "";
                html += "<br><b>No maletas:</b> " + maletas + "";
                html += "<br><b>No Personas  (capac max):</b> " + numpersons + "";
                html += "<br><b>" + online + "</b>";
                html += "</p>";

                self.parent[e.id] = self.addTreeFolder(html, icon, e, true, true, true);

                var open = true;
                var asign = self.addTreeFile(self.tr("Seleccionar conductor"), qxnw.config.execIcon("list-add", "actions"), e, self.parent[e.id], true, open);
                asign.addListener("click", function () {
//                    var si = self.getSelectedItem();
                    var model = this.getModel();
                    self.slotCond(model);
                });
                var agend = self.addTreeFile(self.tr("Servicios agendados"), qxnw.config.execIcon("list-add", "actions"), e, self.parent[e.id], true, open);
                agend.addListener("click", function () {
                    var model = this.getModel();
                    qxnw.utils.information(self.showAgenda(model));
                });
                var vehi = self.addTreeFile(self.tr("Otros Vehículos"), qxnw.config.execIcon("list-add", "actions"), e, self.parent[e.id], true, open);
                vehi.addListener("click", function () {
                    var model = this.getModel();
                    qxnw.utils.information(self.showVehiculosDriver(model));
                });
                self.parent[e.id].addListener("click", function () {
                    self.conductorSelected = self.getSelectedItem();
                    console.log("self.conductorSelected", self.conductorSelected);
                });
            }
        },
        htmlItem: function htmlItem() {
            var html = "<div class='asignar_viaje btn_tree'>Asignar Viaje</div>\n\
                     <div class='agenda btn_tree'>Ver Agenda</div>\n\
                     <div class='vehiculos btn_tree'>Vehiculo(s)</div>";
            return html;
        },
        ubicar: function ubicar(s, r) {
            var self = this;
            var dir = s;
            console.log("ubicar:::INIT");
            console.log("ubicar:::self.__oldMarker", self.__oldMarker);
            if (!main.evalueData(dir.lat) || !main.evalueData(dir.lng)) {
                return false;
            }
//            if (self.markerc["" + dir.id + ""]) {
            if (self.markerc["" + dir.id + ""]) {
                console.log("ubicar:::MOVE");
                self.markerc["" + dir.id + ""].setPosition(new google.maps.LatLng(dir.lat, dir.lng));
            } else {
                console.log("ubicar:::CREATE");
                var latLong = new google.maps.LatLng(dir.lat, dir.lng);

                var location = latLong;
                var title = "";
                var openAtClick = true;
                var icon = "/lib_mobile/driver/img/pindriver_1_35.png";
                var openIcon = true;
                var centerMap = false;
                var callbackonclick = function (marker) {
                    console.log("marker", marker);
                    console.log("marker.data", marker.data);
                    self.slotCond(marker.data);
                };
//                self.markerc["" + dir.id + ""] = self.mapa.googleMap.placeMarker(latLong, dir.nombre + "-" + dir.nit, true, "/app/img/icono-marker-desti.png", true);
                self.markerc["" + dir.id + ""] = self.mapa.googleMap.placeMarker(location, title, openAtClick, icon, openIcon, centerMap, callbackonclick, dir);

                self.__oldMarker.push(self.markerc["" + dir.id + ""]);
//                self.markerc["" + dir.id + ""].setMap(self.mapa.googleMap.map);
            }
        },
        framePositionConductor: function framePositionConductor(r, callback) {
            var datos_ser = r;
            var up = qxnw.userPolicies.getUserData();
            var self = this;
            var dataform = self.formservi.getRecord();
            var servp = self.formservi.ui.servicio_para.getValue();
            var data = {};
            data.service = main.id_service_active;
            data.ciudad = self.formservi.ui.ciudad_origen.getValue();
            if (self.__conf.app_para != 'CARGA') {
                data.servicio_para = servp.servicio_para;
            }
            data.conductores = "TODOS";
            data.ultimos_conectados = false;

            data.servicio_filtro = datos_ser.tipo_servicio;

            console.log("data", data);
            console.log("datos_ser", datos_ser);
            console.log("dataform", dataform);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            var func = function (r) {
                console.log("consultaConductores:::framePositionConductor:::response:::", r);
                if (r === 0 || r === false || r.length === 0) {
                    return false;
                }
                for (var i = 0; i < r.length; i++) {
                    var dc = r[i];
                    console.log("dc", dc);
                    dc.lat = parseFloat(dc.latitud);
                    dc.lng = parseFloat(dc.longitud);
                    callback(dc);
                    self.ubicar(dc, r);
                }
            };
            rpc.exec("consultaConductores", data, func);
        },
        slotTarifa: function slotTarifa(pr) {
            var self = this;
            var r = self.dat;
            var tarifa_fija = false;
            var data_form = self.formservi.getRecord();
            var up = qxnw.userPolicies.getUserData();
            var usu = {};
            usu.empresa = up.company;
            usu.bodega = up.bodega;
            usu.ciudad_origen = data_form.ciudad_origen;
            usu.name_place_origen = data_form.ciudad_origen;
            usu.ciudad_destino = data_form.ciudad_destino;
            usu.name_place_destino = data_form.ciudad_destino;
            usu.servi = pr;
            if (self.__conf.app_para == 'CARGA') {
                usu.carga = true;
            }
            if (self.__conf.usa_subservicios == 'SI') {
                usu.usa_subservice = true;
            }
            if (!main.evalueData(usu.ciudad_origen) || !main.evalueData(usu.ciudad_destino)) {
                console.log("No puede retornar tarifas sin direcciones");
                return false;
            }
            console.log("data_form.tipo_servicio", data_form.tipo_servicio);
            if (!main.evalueData(data_form.tipo_servicio)) {
                console.log("No puede retornar tarifas sin tipo de servicio");
                return false;
            }
            console.log("usu", usu);
            console.log("self.__conf", self.__conf);
            console.log("self.__conf.cobertura_por_ciudades", self.__conf.cobertura_por_ciudades);
            if (self.__conf.cobertura_por_ciudades === "SI") {
                var rpcst = new qxnw.rpc(this.rpcUrl, "servicios");
                rpcst.setShowLoading(false);
                var t = rpcst.exec("consultaTarifasAll", usu);
                if (rpcst.isError()) {
                    qxnw.utils.error(rpcst.getError(), self);
                    return;
                }
                var leng = t.length;
                console.log(leng);
                if (leng === 0) {
                    qxnw.utils.information("Lo sentimos, no tenemos cobertura para el sitio indicado");
                    self.formservi.ui.tipo_servicio.setValue("");
                    return false;
                }
                self.__id_tarifa = t[0].id_service_tarifa_fija;
                var cobert = false;
                var nocobert = false;
                for (var e = 0; e < leng; e++) {
                    var servi = t[e];
                    if (qxnw.utils.evalue(servi.ciudad_o_lugar_origen) && qxnw.utils.evalue(servi.ciudad_o_lugar_destino)) {
                        var ciudad_o_lugar_destino = servi.ciudad_o_lugar_destino.split(",");
                        self.name_place_destino_text = ciudad_o_lugar_destino[0];
                        var patt = new RegExp(self.name_place_destino_text);
                        var conincid = patt.test(servi.ciudad_o_lugar_destino);
                        if (data_form.ciudad_origen === servi.ciudad_o_lugar_origen && data_form.ciudad_destino === servi.ciudad_o_lugar_destino || data_form.name_place_origen === servi.ciudad_o_lugar_origen && data_form.name_place_destino === servi.ciudad_o_lugar_destino
                                || data_form.ciudad_origen === servi.ciudad_o_lugar_origen && conincid) {
                            if (servi.id == data_form.tipo_servicio) {

                                if (self.__conf.usa_subservicios == 'SI') {
                                    if (typeof usu.servi.subservicio === 'undefined') {
                                        var dat = {};
                                        dat[""] = "Seleccione";
                                        qxnw.utils.populateSelectFromArray(self.formservi.ui.subservicio, dat);
                                        var numSub = qxnw.utils.populateSelect(self.formservi.ui.subservicio, "servicios", "dataSubservices", servi);
                                        if (typeof numSub !== 'undefined') {
                                            self.formservi.setRequired("subservicio", true);
                                        } else {
                                            self.formservi.setRequired("subservicio", false);
                                        }
                                    }
                                }

                                if (servi.valor_tarija_fija !== "trayecto") {
                                    cobert = true;
                                    tarifa_fija = servi.valor_tarija_fija;
                                }
                                if (servi.valor_tarija_fija == "trayecto") {
                                    cobert = true;
                                }
                            }
                        }
                    }
                }
                if (leng == e) {
                    if (cobert == false && nocobert == false) {
                        nocobert = true;
                        qxnw.utils.information("Lo sentimos, no tenemos cobertura para el sitio indicado intente con otro tipo de servicio.");
                        self.formservi.ui.tipo_servicio.setValue("");
                        return false;
                    }
                }
            }

            var mapa = self.mapa;
            var rpc = new qxnw.rpc(this.rpcUrl, "conductores");
            var ts = self.formservi.ui.tipo_servicio.getValue();
            r.tipo_servicio = ts.tipo_servicio;
            r.tipo_servicio_model = ts.tipo_servicio_model;
            r.tipo_servicio_text = ts.tipo_servicio_text;
            var recargos = rpc.exec("recargos", r);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            if (recargos.length > 0) {
                var rec = 0;
                for (var i = 0; i < recargos.length; i++) {

                    if (recargos[i].nombre.toLowerCase() == "parada adicional") {
                        recargos.paradas = recargos[i].valor;
                    } else {
                        rec += parseInt(recargos[i].valor) + rec;
                    }
                }
            } else {
                var rec = 0;
            }
//            if (configura.paradas_adicional == "SI") {
            console.log(recargos.paradas);
            console.log("self.navTableParadasPersonas", self.navTableParadasPersonas);
            if (typeof recargos.paradas !== 'undefined' && qxnw.utils.evalue(self.navTableParadasPersonas)) {
                console.log(self.navTableParadasPersonas.getModelData());
                console.log(self.navTableParadasPersonas.getModelData().length);
//                if (typeof self.paradasAdicionalesVal.length !== 'undefined' && typeof self.paradasAdicionalesVal.length !== null) {
                recargos.paradas = parseInt(recargos.paradas) * parseFloat(self.navTableParadasPersonas.getModelData().length);
                rec = rec + recargos.paradas;
//                }
            }
            console.log(rec);
//            }
            var serv = {};
            serv.tipo_servicio = r.tipo_servicio;
            serv.bodega = up.bodega;
            serv.empresa = up.company;
            if (self.__conf.app_para == 'CARGA') {
                serv.app_para = 'CARGA';
            }
            if (self.__conf.usa_flotas_clientes == 'SI') {
                serv.app_para = 'CARGA';
            }

            var rpcs = new qxnw.rpc(this.rpcUrl, "conductores");
            var c = rpcs.exec("tarifa", serv);
            if (rpcs.isError()) {
                qxnw.utils.error(rpcs.getError(), self);
                return;
            }
            if (c.length > 0) {
                myVar = setTimeout(self.slotTarifas, 3000, c, rec, mapa, self.dat, tarifa_fija);
            } else {
                myVars = setTimeout(self.slotLibre, 3000, rec, mapa, self.dat);
            }
        },
        revHora: function revHora() {
            var self = this;
            var fecha_actual = new Date();
            var fecha_minima_servi = new Date(fecha_actual.getTime() + self.dat.minutos_agregar_a_fecha * 60000);
            Date.prototype.toString = function () {
                var mes = (this.getMonth() + 1).toString();
                if (mes.length == 1) {
                    mes = "0" + mes;
                }
                var hora = this.getHours().toString(), minutos = this.getMinutes().toString(), segundos = this.getSeconds().toString();
                if (hora.length == 1) {
                    hora = "0" + hora;
                }
                if (minutos.length == 1) {
                    minutos = "0" + minutos;
                }
                if (segundos.length == 1) {
                    segundos = "0" + segundos;
                }
                return this.getFullYear() + "-" + mes + "-" + this.getDate() + "/" + hora + ":" + minutos + ":00";
            }
            return fecha_minima_servi;
        },
        slotTarifas: function slotTarifas(c, rec, map, dat, tarifa_fija) {
            var self = this;
            var po = main.getPos();
            var cadr = po.distancia;
            var distancia = po.distancia;
            var durr = po.tiempo;
            var duracion = po.tiempo;
//            distancia = parseFloat(distancia) * 1000;
            var totalunimetros = parseFloat(distancia) / parseFloat(c[0].metros);
            console.log("parseInt(totalunimetros)", parseInt(totalunimetros));
//            if (isNaN(parseInt(totalunimetros))) {
//                totalunimetros = 0;
//            }
            if (!main.evalueData(parseInt(totalunimetros))) {
                totalunimetros = 0;
            }
            var valordistancia = parseFloat(totalunimetros) * parseFloat(c[0].valor_unidad_metros);
            console.log("valordistancia", valordistancia);
            console.log("parseInt(totalunimetros)", parseInt(totalunimetros));
            console.log("c[0].valor_unidad_metros", c[0].valor_unidad_metros);
            console.log("distancia", distancia);
            console.log("c[0].metros", c[0].metros);
            console.log("po", po)


            var minutos = duracion;
//            var totaluniminutos = parseInt(minutos);
            var totaluniminutos = parseFloat(minutos) / parseInt(c[0].tiempo);

            console.log("totaluniminutos", parseInt(totaluniminutos))
            console.log("main.__minutosmin", parseInt(main.__minutosmin))

            if (parseInt(totaluniminutos) < parseInt(main.__minutosmin)) {
                totaluniminutos = parseInt(main.__minutosmin);
                durr = parseInt(main.__minutosmin);
                duracion = parseInt(main.__minutosmin);
            } else {
                durr = parseInt(durr) / 60;
            }
            console.log("totaluniminutos", totaluniminutos)

            var valorminutos = parseFloat(totaluniminutos) * parseFloat(c[0].valor_unidad_tiempo);

            console.log("c", c)
            console.log("c[0]", c[0])
            console.log("c[0].valor_unidad_tiempo", c[0].valor_unidad_tiempo)
            console.log("valorminutos", valorminutos)
            console.log("rec", rec)

            var valor_estimado = parseFloat(valordistancia) + parseFloat(valorminutos) + parseInt(c[0].valor_banderazo) + parseFloat(rec);
            console.log("valor_estimado", valor_estimado);
            console.log("c[0].valor_mascota", c[0].valor_mascota);
            if (qxnw.utils.evalue(c[0].valor_mascota)) {
                if (c[0].valor_mascota != "" && c[0].valor_mascota != "0" && dat.no_mascotas != "" && dat.no_mascotas != "0" && dat.no_mascotas != null) {
                    var valor_mascota = parseFloat(dat.no_mascotas) * parseFloat(c[0].valor_mascota);
                    valor_estimado = valor_estimado + parseFloat(valor_mascota);
                }
            }
            console.log("valor_estimado", valor_estimado);
            if (qxnw.utils.evalue(c[0].retorno)) {
                if (qxnw.utils.evalue(dat.retorno)) {
                    if (dat.retorno == "true" || dat.retorno == true) {
                        valor_estimado = valor_estimado + parseInt(c[0].retorno);
                    }
                }
            }
            console.log("valor_estimado", valor_estimado);
            if (qxnw.utils.evalue(c[0].cargue)) {
                if (qxnw.utils.evalue(dat.cargue)) {
                    if (dat.cargue == "true" || dat.cargue == true) {
                        valor_estimado = valor_estimado + parseInt(c[0].cargue);
                    }
                }
            }
            console.log("valor_estimado", valor_estimado);
            if (qxnw.utils.evalue(c[0].descargue)) {
                if (qxnw.utils.evalue(dat.descargue)) {
                    if (dat.descargue == "true" || dat.descargue == true) {
                        valor_estimado = valor_estimado + parseInt(c[0].descargue);
                    }
                }
            }
            console.log("valor_estimado", valor_estimado);
            if (qxnw.utils.evalue(c[0].porcentaje_valor_declarado)) {
                if (qxnw.utils.evalue(dat.valor_declarado)) {
                    if (dat.valor_declarado != "") {
                        var declarado = (parseInt(c[0].porcentaje_valor_declarado) * parseInt(dat.valor_declarado)) / 100;
                        valor_estimado = valor_estimado + parseInt(declarado);
                    }
                }
            }
            console.log("valor_estimado", valor_estimado);
            console.log("durr", durr);
            if (tarifa_fija) {
                valor_estimado = tarifa_fija;
            }
            var convdurr = parseInt(durr) / 60;
            var convdurr = durr;
            var convcadr = parseInt(cadr) / 1000;
            console.log("valor_estimado", valor_estimado);
            if (valor_estimado > 0) {
                valor_estimado = parseFloat(valor_estimado).toFixed(2);
            }
            if (convdurr > 0) {
                convdurr = parseFloat(convdurr).toFixed(2);
            }
            console.log("convdurr", convdurr);
            console.log("valor_estimado", valor_estimado);
            map.ui.recogiendo.setValue(valor_estimado.toString());
            map.ui.sitio.setValue(convdurr.toString());
            map.ui.transportando.setValue(convcadr.toString());
        },
        slotLibre: function slotLibre(rec, map) {
            var self = this;
            var po = main.getPos();
            var cadr = po.distancia;
            var distancia = cadr.replace("km", "");
            var durr = po.tiempo;
            var duracion = durr.replace("min", "");
//            var totalunimetros = (parseInt(distancia) * parseInt(c[0].metros)) / 1000;
//            var valordistancia = parseInt(totalunimetros) * parseInt(c[0].valor_unidad_metros);
//            var minutos = duracion;
//            var totaluniminutos = parseInt(minutos);
////            var totaluniminutos = parseInt(minutos) / parseInt(c[0].tiempo);
//            var valorminutos = parseInt(totaluniminutos) * parseInt(c[0].valor_unidad_tiempo);
//            var valor_estimado = parseFloat(valordistancia) + parseFloat(valorminutos) + parseInt(c[0].valor_banderazo) + parseFloat(rec);
            map.ui.recogiendo.setEnabled(true);
            map.ui.sitio.setValue(durr.toString());
            map.ui.transportando.setValue(cadr.toString());
        },
        showAgenda: function showAgenda(conductor) {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "conductores");
            var c = rpc.exec("getAgenda", conductor);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            if (c.length > 0) {
                var html = "";
                for (var i = 0; i < c.length; i++) {

                    html += "</br><b>Hora: </b>";
                    html += c[i].hora;
                    html += "</br>";
                    html += "<b>Fecha: </b>";
                    html += c[i].fecha;
                    html += "</br>";
                    html += "<b>Origen: </b>";
                    html += c[i].origen;
                    html += "</br>";
                    html += "<b>Destino: </b>";
                    html += c[i].destino;
                    html += "</br>";
                    html += "<b>Conductor: </b>";
                    html += c[i].conductor;
                    html += "</br>";
                    html += "<b>  Vehículo: </b>";
                    html += c[i].vehiculo_text;
                    html += "</br>";
                    html += "<b>Usuario: </b>";
                    html += c[i].usuario;
                    html += "</br>";
                    html += "<b>--------------------------------------------------------</b></br>";
                }
            } else {
                var html = "<br/><br/><h3 style='text-align:center;'>No tiene viajes programados</h3><br/><br/>";
            }
            return html;
        },
        showVehiculosDriver: function showVehiculosDriver(conductor) {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "conductores");
            conductor.usuario_cond = conductor.usuario_cliente;
            var c = rpc.exec("getMotorizados", conductor);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            if (c.length > 0) {
                var html = "";
                for (var i = 0; i < c.length; i++) {

                    html += "</br><b>Tipo Vehiculo: </b>";
                    html += c[i].tipo_vehiculo_text;
                    html += "</br><b>Placa: </b>";
                    html += c[i].placa;
                    html += "</br>";
                    html += "<b>Marca: </b>";
                    html += c[i].marca_text;
                    html += "</br>";
                    html += "<b>Modelo: </b>";
                    html += c[i].modelo;
                    html += "</br>";
                    html += "<b>Color: </b>";
                    html += c[i].color;
                    html += "</br>";
                    html += "<b>Numero Puertas: </b>";
                    html += c[i].numero_puertas;
                    html += "</br>";
                    html += "<b>Fecha Vencimiento Soat: </b>";
                    html += c[i].fecha_vencimiento_soat;
                    html += "</br>";
                    html += "<b>--------------------------------------------------------</b></br>";
                }
            } else {
                var html = "<br/><br/><h3 style='text-align:center;'>No tiene Vehículos Activos </h3><br/><br/>";
            }
            return html;
        },
        validaHora: function validaHora() {
            var self = this;
            var hora_servicio = self.formservi.ui.hora.getValue();
            var data = self.formservi.getRecord();
            if (data.servicio_para == "reservado") {
                self.dat.fecha_minima_servi = self.revHora();
                var res = self.dat.fecha_minima_servi.toString().split("/");
                self.horaminima_res = res[1];
//                self.formservi.ui.hora.setValue(hora);
                hora_servicio = hora_servicio.split(":");
                if (hora_servicio[0].toString().length == 1) {
                    hora_servicio[0] = "0" + hora_servicio[0]
                }
                if (hora_servicio[1].toString().length == 1) {
                    hora_servicio[1] = "0" + hora_servicio[1];
                }
                if (hora_servicio[0] == "00") {
                    hora_servicio[0] == "01"
                }
                hora_servicio = hora_servicio[0] + ":" + hora_servicio[1] + ":00";
                if (self.horaminima_res > hora_servicio) {
                    var dat = data.fecha;
                    if (qxnw.utils.evalue(dat)) {
                        var hoy = new Date().toJSON().slice(0, 10);
                        var fecha = dat;
                        if (fecha <= hoy) {
                            qxnw.utils.information("Debe seleccionar una Hora mayor o igual a la actual para reservar.Verifique por favor");
                            self.formservi.ui.hora.setValue(self.horaminima_res);
                        }
                    }
                }
            }

        },
        validaFecha: function validaFecha(self, campo, texto) {
            var selfform = this;
            var data = self.ui[campo].getValue();
            if (qxnw.utils.evalue(data)) {
                var hoy = new Date().toJSON().slice(0, 10);
                var fecha = data.toJSON().slice(0, 10);
                if (fecha < hoy) {
                    self.ui[campo].setValue(hoy);
                    qxnw.utils.information(self.tr(texto));
                    return;
                }
            }
            selfform.validaHora();
        },
        validaDocsVencidosDriver: function validaDocsVencidosDriver(e) {
            var self = this;
            var fecha_sola = main.getDateTime();
            if (e.fecha_vencimiento_soat <= fecha_sola) {
                return false;
            }
            if (e.fecha_vencimiento_tegnomecanica <= fecha_sola) {
                return false;
            }
            if (e.fecha_vencimiento <= fecha_sola) {
                return false;
            }
            return true;
        },
        slotCond: function slotCond(si, callback) {
            var self = this;
            console.log("slotCond", si);
            if (!self.validaDocsVencidosDriver(si)) {
                qxnw.utils.information("Lo sentimos, el conductor tiene documento(s) vencido(s). Valide la información por favor.");
                return false;
            }
            var html = "";
            html += "<div class='infodrivermap'>¿Deseas asignar al conductor";
            html += " <strong>" + si.nombre + "</strong> con CC <strong>" + si.nit + "</strong> y PLACA <strong>" + si.placa + "</strong>";
            html += " al viaje?</div>";
            qxnw.utils.question(html, function (e) {
                if (e) {
                    self.dat.conductor = si.id;
                    self.dat.conductor_text = si.nombre + si.apellido;
                    self.dat.usuario_cond = si.usuario_cliente;
                }
                if (typeof callback !== "undefined") {
                    callback();
                }
            });
        },
        crearUsuario: function crearUsuario(pr) {
            var self = this;
            var tipo = {};
            tipo.tipo = 1231;
            tipo.tipo_text = "usuario";
            var d = new transmovapp.forms.f_usuarios(tipo);
            d.settings.accept = function (r) {
                var data = d.getRecord();
                var up = qxnw.userPolicies.getUserData();
                console.log(data);
                var nombre = data.nombre + " " + data.apellido;
                var token = {};
                token["id"] = r;
                token["nombre"] = data.email;
                token["nombre_usuario"] = nombre;
                token["perfil"] = data.perfil;
                token["empresa"] = up.company;
                token["documento"] = "";
                token["centro_costo"] = data.centro_costo;
                token["celular"] = data.celular;
                token["bodega"] = data.bodega;
                self.formservi.ui.usuario.addToken(token);
            };
            d.ui.perfil.setValue(1);
            d.ui.perfil.setEnabled(false);
            d.setModal(true);
            d.show();
        },
        slotSave: function slotSave() {
            var self = this;
//            var configura = main.getConfiguracion();
            var tipo = self.formservi.ui.tipo_servicio.getValue();
            self.paradasAdicionalesVal = self.navTableParadasPersonas.getAllData();
            if (!self.navTableParadasAndPersonas.validate()) {
                return;
            }
            if (self.__conf.app_para == 'CARGA') {
                self.dat.carga = "SI";
                self.dat.no_mascotas = null;
                self.dat.numero_auxiliares = self.detalle.ui.numero_auxiliares.getValue();
                self.dat.salida_periferia = self.detalle.ui.salida_periferia.getValue();
                self.dat.despacho = self.detalle.ui.despacho.getValue();
                self.dat.retorno = self.detalle.ui.retorno.getValue();
                self.dat.cargue = self.detalle.ui.cargue.getValue();
                self.dat.descargue = self.detalle.ui.descargue.getValue();
                self.dat.observaciones_servicio = self.detalle.ui.observaciones_servicio.getValue();
                self.dat.contacto_recogida = self.detalle.ui.contacto_recogida.getValue();
                self.dat.telefono_recogida = self.detalle.ui.telefono_recogida.getValue();
                self.dat.observaciones_recogida = self.detalle.ui.observaciones_recogida.getValue();
                self.dat.contacto_entrega = self.detalle.ui.contacto_entrega.getValue();
                self.dat.telefono_entrega = self.detalle.ui.telefono_entrega.getValue();
                self.dat.observaciones_entrega = self.detalle.ui.observaciones_entrega.getValue();
                self.dat.descripcion_carga = self.detalle.ui.descripcion_carga.getValue();
                self.dat.cantidad = self.detalle.ui.cantidad.getValue();
                self.dat.volumen = self.detalle.ui.volumen.getValue();
                self.dat.peso = self.detalle.ui.peso.getValue();
                self.dat.empaque = self.detalle.ui.empaque.getValue();
                self.dat.valor_declarado = self.detalle.ui.valor_declarado.getValue();
            }
            if (self.dat.conductor) {
                var conductor = {};
                conductor.id = self.dat.conductor;
                conductor.usuario_cond = self.dat.usuario_cond;
                console.log("conductor", conductor);
                console.log("self.dat", self.dat);
                var rpc = new qxnw.rpc(this.rpcUrl, "conductores");
                var c = rpc.exec("getMotorizados", conductor);
                if (rpc.isError()) {
                    qxnw.utils.error(rpc.getError(), self);
                    return;
                }
                console.log("getMotorizados", c);
                if (c === false || c === 0) {
                    qxnw.utils.information("El conductor no cuenta con un vehículo. Valide con el administrador del sistema.")
                    return false;
                }
            }
            var map = self.mapa.getRecord();
            self.dat.motorizado = document.querySelector('input[name="moto_transmov"]:checked');
            self.dat.recogiendo = map.recogiendo;
            self.dat.sitio = map.sitio;
            self.dat.transportando = map.transportando;
            var clien = self.formservi.ui.usuario.getValue();
            var datos_clien = self.formservi.getRecord();
            if (qxnw.utils.evalue(tipo.tipo_servicio_model)) {
                if (tipo.tipo_servicio_model.valor_mascota !== "" && tipo.tipo_servicio_model.valor_mascota !== "0") {
                    self.dat.num_mascota = self.dat.no_mascotas;
                }
                if (tipo.tipo_servicio_model.pide_vehiculo_cliente == "SI") {
                    self.dat.datos_vehiculo_elegido = datos_clien.datos_vehiculo_elegido;
                }
            }
            self.dat.subcategoria_servicio = datos_clien.tipo_servicio;
            self.dat.subcategoria_servicio_text = datos_clien.tipo_servicio_text;
            self.dat.tipo_tarifa = datos_clien.tipo_tarifa;


            console.log("clien", clien);
            console.log("datos_clien", datos_clien);
            console.log("datos_clien.subservicio_model", datos_clien.subservicio_model);
            if (self.__conf.usa_subservicios == 'SI') {
                if (datos_clien.subservicio_model != null && datos_clien.subservicio_model != 'null') {
                    self.dat.subservicio = datos_clien.subservicio_model.service;
                    self.dat.subservicio_text = datos_clien.subservicio_text;
                }
            }

            self.dat.id_tarifa = self.__id_tarifa;
            if (datos_clien.servicio_para == "reservado") {
                self.dat.fecha = datos_clien.fecha;
                self.dat.hora = datos_clien.hora;
            }
            self.dat.datos_get_record = datos_clien;
            self.dat.parada = self.paradasAdicionalesVal;
            self.dat.ciudad_origen = datos_clien.ciudad_origen;
            self.dat.origen = datos_clien.origen;
            self.dat.ciudad_destino = datos_clien.ciudad_destino;
            self.dat.destino = datos_clien.destino;
            self.dat.servicio_para = datos_clien.servicio_para;
            self.dat.centro_costo = null;
            if (main.evalueData(datos_clien.centro_costo)) {
                self.dat.centro_costo = datos_clien.centro_costo;
            }
            self.dat.centro_costo_text = "";
            if (main.evalueData(datos_clien.centro_costo_text)) {
                self.dat.centro_costo_text = datos_clien.centro_costo_text;
            }
            self.dat.usuario = clien[0].id;
            self.dat.usuario_text = clien[0].nombre;
            self.dat.nombre_usuario = clien[0].nombre_usuario;
            self.dat.celular_usuario = clien[0].celular;
            clien[0].usuario = clien[0].nombre;
            self.dat.celular = clien[0].celular;
            self.dat.nombre = clien[0].nombre_usuario;
            self.dat.apellido = "";
            self.dat.email = clien[0].usuario;
            self.dat.domain_rpc = window.origin;
            if (self.__conf.usa_codigos_verificacion_servicio === "SI") {
                self.dat.code_verifi_service = self.generateCodeVerifi(1000, 9999);
                self.dat.code_verifi_service_fin = self.generateCodeVerifi(1000, 9999);
            }
            var token = self.consultaTokenUsu(clien[0]);
            if (token.length > 0) {
                self.dat.token_usuario = token;
            } else {
                self.dat.token_usuario = "";
            }
            if (self.dat.conductor) {
                self.dat.placa = c[0].placa;
                self.dat.marca = c[0].marca;
                self.dat.marca_text = c[0].marca_text;
                self.dat.vehiculo_text = c[0].marca_text;
//                self.dat.vehiculo = c[0].marca;
                self.dat.vehiculo = c[0].id;
                self.dat.usuario_cond = c[0].usuario;
            }
            var up = qxnw.userPolicies.getUserData();

            var rut = self.mapa.rut;
            var toto_r = parseInt(rut.tiempo) / 60;
            self.dat.tiempo_estimado = Math.round(toto_r);

            console.log("self.__conf", self.__conf);
            console.log("self.__conf.clienteServicioPorDefecto", self.__conf.clienteEstadoCreaServicios);
            if (main.isCustomer()) {
                self.dat.bodega = up.bodega;
                self.dat.es_cliente = "SI";
                if (main.evalueData(self.__conf.clienteEstadoCreaServicios)) {
                    self.dat.estado = self.__conf.clienteEstadoCreaServicios;
                }
            }
            console.log("self.save:::data:::", self.dat);
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("self.save:::response:::r", r);
                self.paradasAdicionalesVal = false;
                self.sendNotificacionPsh(r);
                clearInterval(self.interval);
//                if (document.getElementById("iframechat_")) {
//                    var d = document.getElementById("iframechat_");
//                    d.parentNode.removeChild(d);
//                }
                qxnw.utils.information("Servicio Generado exitosamente!");
                self.reject();
                self.accept();
            };
            rpc.exec("saveServicio", self.dat, func);
        },
        generateCodeVerifi: function generateCodeVerifi(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        initConductores: function initConductores() {
            var self = this;
            clearInterval(self.interval);
            self.cleanTree();
            var len = self.__oldMarker.length;
            for (var i = 0; i < len; i++) {
                self.__oldMarker[i].setMap(null);
            }
            self.__oldMarker = [];
            self.parent = {};
            self.markerc = {};
            var data = self.formservi.getRecord();
            qxnw.utils.loading("Cargando conductores...");
            self.populateTree(data);
        },
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            var si = self.getSelectedItem();
            var up = qxnw.userPolicies.getUserData();
//            m.addAction("¿Asignar viaje?", qxnw.config.execIcon("utilities-text-editor", "apps"), function (e) {
//                self.slotCond(si);
//            });
            m.setParentWidget(this);
            m.exec(pos);
        },
        validaFechaConexion: function validaFechaConexion(campo) {
//            var self = this;
            var data = campo;
            if (qxnw.utils.evalue(data)) {
                var hoy = new Date();
                var fech_cone = new Date(data);
                var fecha_act = new Date(hoy.getTime() - 30000);
                if (fecha_act <= fech_cone) {
                    return campo;
                }
            }
        },
//        formDataAirport: function formDataAirport(pos) {
//            var self = this;
//            var d = new qxnw.forms();
//            var fields = [
//                {
//                    type: "startGroup",
//                    mode: "horizontal",
//                    name: "dataAirport",
//                    label: ""
//                },
//                {
//                    name: "num_maletas",
//                    label: "# Maletas",
//                    type: "textField",
//                    mode: "integer",
//                    required: false
//                },
//                {
//                    name: "num_personas",
//                    label: "# Personas",
//                    type: "textField",
//                    mode: "integer",
//                    required: false
//                },
////                {
////                    name: "centro_costos",
////                    label: "Centro costos",
////                    type: "textField"
////                },
//                {
//                    type: "endGroup"
//                }
//            ];
//            d.setFields(fields);
//            self.addSubWindow("Detalles del servicio", d);
//            d.ui.accept.setVisibility("excluded");
//            d.ui.cancel.setVisibility("excluded");
//            self.__dataAirport = d;
//        },
        formDesc: function formDesc(pos) {
            var self = this;
            if (typeof self.detalle === 'undefined') {
                var up = qxnw.userPolicies.getUserData();
                var require = true;
                var require2 = true;
                if (up.company == "14") {
                    require2 = false;
                    self.mostrar_group_detalle = false;
                }
                self.detalle = new qxnw.forms();
                var field = [
                    {
                        name: "Detalle servicio",
                        type: "startGroup",
                        icon: "",
                        mode: "horizontal"
                    },
                    {
                        name: "numero_auxiliares",
                        label: "Número Auxiliares",
                        caption: "numero_auxiliares",
                        type: "textField",
                        mode: "numeric",
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "salida_periferia",
                        label: "Salida Periferia",
                        caption: "salida_periferia",
                        type: "checkBox",
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "despacho",
                        label: "Despacho Nacional",
                        caption: "despacho",
                        type: "checkBox",
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "retorno",
                        label: "Retorno",
                        caption: "retorno",
                        type: "checkBox",
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "cargue",
                        label: "Cargue",
                        caption: "cargue",
                        type: "checkBox",
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "descargue",
                        label: "Descargue",
                        caption: "descargue",
                        type: "checkBox",
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "observaciones_servicio",
                        label: "Observaciones servicio",
                        caption: "observaciones_servicio",
                        type: "textField",
                        required: require2,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "",
                        type: "endGroup",
                        icon: ""
                    },
                    {
                        name: "Datos Recogida",
                        type: "startGroup",
                        icon: "",
                        mode: "horizontal"
                    },
                    {
                        name: "contacto_recogida",
                        label: "Contacto",
                        caption: "contacto",
                        type: "textField",
                        required: require,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "telefono_recogida",
                        label: "Telefono",
                        caption: "telefono_recogida",
                        type: "textField",
                        mode: "numeric",
                        required: require,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "observaciones_recogida",
                        label: "Observaciones",
                        caption: "observaciones_recogida",
                        type: "textArea",
                        required: require2,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "",
                        type: "endGroup",
                        icon: ""
                    },
                    {
                        name: "Datos Entrega",
                        type: "startGroup",
                        icon: "",
                        mode: "horizontal"
                    },
                    {
                        name: "contacto_entrega",
                        label: "Contacto",
                        caption: "contacto_entrega",
                        type: "textField",
                        required: require,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "telefono_entrega",
                        label: "Telefono",
                        caption: "telefono_entrega",
                        type: "textField",
                        mode: "numeric",
                        required: require,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "observaciones_entrega",
                        label: "Observaciones",
                        caption: "observaciones_entrega",
                        type: "textArea",
                        required: require2,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "",
                        type: "endGroup",
                        icon: ""
                    },
                    {
                        name: "Datos mercancia",
                        type: "startGroup",
                        icon: "",
                        mode: "horizontal"
                    },
                    {
                        name: "descripcion_carga",
                        label: "Descripción de la carga que transportas",
                        caption: "descripcion_carga",
                        type: "textArea",
                        required: require,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "empaque",
                        label: "Empaque. (Bultos, Estivas, Cajas)",
                        caption: "empaque",
                        type: "textField",
                        required: require,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "cantidad",
                        label: "Cantidad",
                        caption: "cantidad",
                        type: "textField",
                        mode: "numeric",
                        required: require,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "volumen",
                        label: "Volumen",
                        caption: "volumen",
                        type: "textField",
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "peso",
                        label: "Peso (Kg o Ton)",
                        caption: "peso",
                        type: "textField",
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "valor_declarado",
                        label: "Valor Declarado",
                        caption: "valor_declarado",
                        type: "textField",
                        mode: "money",
                        required: true,
                        icon: qxnw.config.execIcon("list-add")
                    },
                    {
                        name: "",
                        type: "endGroup",
                        icon: ""
                    }
                ];
                self.detalle.setFields(field);
                self.detalle.ui.retorno.addListener("changeValue", function () {
                    self.dat.retorno = this.getValue();
                    var data = self.formservi.ui.tipo_servicio.getValue();
                    var dat = self.formservi.ui.subservicio.getValue();
                    var data = Object.assign(data, dat);
                    self.slotTarifa(data);
                });
                self.detalle.ui.cargue.addListener("changeValue", function () {
                    self.dat.cargue = this.getValue();
                    var data = self.formservi.ui.tipo_servicio.getValue();
                    var dat = self.formservi.ui.subservicio.getValue();
                    var data = Object.assign(data, dat);
                    self.slotTarifa(data);
                });
                self.detalle.ui.descargue.addListener("changeValue", function () {
                    self.dat.descargue = this.getValue();
                    var data = self.formservi.ui.tipo_servicio.getValue();
                    var dat = self.formservi.ui.subservicio.getValue();
                    var data = Object.assign(data, dat);
                    self.slotTarifa(data);
                });
                self.detalle.ui.valor_declarado.addListener("focusout", function () {
                    self.dat.valor_declarado = this.getValue();
                    var data = self.formservi.ui.tipo_servicio.getValue();
                    var dat = self.formservi.ui.subservicio.getValue();
                    var data = Object.assign(data, dat);
                    self.slotTarifa(data);
                });
                self.detalle.ui.numero_auxiliares.addListener("focusout", function () {
                    self.dat.no_mascotas = this.getValue();
                    var data = self.formservi.ui.tipo_servicio.getValue();
                    var dat = self.formservi.ui.subservicio.getValue();
                    var data = Object.assign(data, dat);
                    self.slotTarifa(data);
                });
                self.detalle.ui.accept.setVisibility("excluded");
                self.detalle.ui.cancel.setVisibility("excluded");


//                self.detalle_ventana = self.addSubWindow("Detalle del servicio", self.detalle);

                self.containerRight.add(self.detalle.masterContainer);

                if (self.mostrar_group_detalle == false) {
                    self.detalle.setGroupVisibility("detalle_servicio", "excluded");
                }
            }
        },
        navParadasPersonas: function navParadasPersonas(sl) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var form = new qxnw.forms();
            var field = [
                {
                    name: "Usuario pasajero principal",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "usuario",
                    label: self.tr("<strong>Usuario pasajero principal (app)</strong>"),
                    caption: "usuario",
                    type: "selectTokenField",
                    required: true,
                    mode: "upperCase",
                    row: 1,
                    column: 3
                },
                {
                    name: "centro_costo",
                    label: self.tr("<strong>Centro costos</strong>"),
                    caption: "centro_costo",
                    type: "selectBox",
                    mode: "upperCase",
                    row: 1,
                    column: 4,
                    visible: true
                },
                {
                    name: "crear_usuario",
                    label: "Crer nuevo usuario",
                    caption: "crear_usuario",
                    type: "button",
                    icon: qxnw.config.execIcon("list-add")
//                    row: 0,
//                    column: 4,
//                    mode: "rowSpan: 2"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: "Usuario pasajero principal",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "num_maletas",
                    label: "# Maletas",
                    type: "textField",
                    mode: "integer",
                    required: false,
                    visible: false,
                    row: 1,
                    column: 4
                },
                {
                    name: "num_personas",
                    label: "# Personas",
                    type: "textField",
                    mode: "integer",
                    row: 1,
                    column: 4,
                    visible: false,
                    required: false
                },
                {
                    name: "centro_costos_text",
                    label: "Centro de costos del viaje",
                    visible: false,
                    type: "textField"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                },
                {
                    name: "Información parada o datos del pasajero",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "direccion",
                    label: "Dirección parada",
                    caption: "direccion",
                    required: false,
                    type: "textField",
                    row: 1,
                    column: 1
                },
                {
                    name: "nombre_pasajero",
                    label: "Nombre pasajero (opcional)",
                    caption: "nombre_pasajero",
                    type: "textField",
                    row: 1,
                    column: 3
                },
                {
                    name: "correo",
                    label: "Correo",
                    visible: true,
                    type: "textField"
                },
                {
                    name: "descripcion_carga",
                    label: "Comentarios, datos pasajeros (opcional)",
                    caption: "descripcion_carga",
                    type: "textArea",
                    row: 2,
                    column: 1
                },
                {
                    name: "latitud_parada",
                    label: "Latitud parada",
                    caption: "latitud_parada",
                    visible: false,
                    type: "textField",
                    mode: "numeric"
                },
                {
                    name: "longitud_parada",
                    label: "Longitud parada",
                    caption: "longitud_parada",
                    visible: false,
                    type: "textField",
                    mode: "numeric"
                },
                {
                    name: "agregar",
                    label: "Agregar",
                    caption: "agregar",
                    type: "button",
                    row: 2,
                    column: 2
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                }
            ];
            form.setFields(field);

            var w = 220;
            if (main.isCustomer()) {
                w = 450;
            }
            form.ui.usuario.setMaxWidth(w);
            form.ui.usuario.setMinWidth(w);

            form.ui.accept.setVisibility("excluded");
            form.ui.cancel.setVisibility("excluded");
//            self.navParadasPersons = self.addSubWindow("Paradas / Personas del viaje", form);

            self.containerRight.add(form.masterContainer);
//            self.container.add(form.masterContainer);
//            self.rightWidget.addBefore(self.container, self.tabView);


            self.formservi.ui.usuario = form.ui.usuario;
            self.formservi.ui.crear_usuario = form.ui.crear_usuario;
            self.formservi.ui.centro_costo = form.ui.centro_costo;
            self.formservi.ui.centro_costos_text = form.ui.centro_costos_text;


//            form.addListener("appear", function () {
            addCl();
//            });

            function addCl() {
                if (!main.evalueData(form.ui.direccion)) {
                    setTimeout(function () {
                        addCl();
                    }, 500);
                    return false;
                }
                if (!main.evalueData(form.ui.direccion.getContentElement())) {
                    setTimeout(function () {
                        addCl();
                    }, 500);
                    return false;
                }
                if (!main.evalueData(form.ui.direccion.getContentElement().getDomElement())) {
                    setTimeout(function () {
                        addCl();
                    }, 500);
                    return false;
                }
                console.log("form.ui.direccion", form.ui.direccion);
                console.log("form.ui.direccion.getContentElement()", form.ui.direccion.getContentElement());
                console.log("form.ui.direccion.getContentElement().getDomElement()", form.ui.direccion.getContentElement().getDomElement());
                qx.bom.element.Class.add(form.ui.direccion.getContentElement().getDomElement(), "parada_direccion");
                main.autocomplete(".parada_direccion", self.googleMap, function (e) {
                    var lat = e.location.lat().toString();
                    var lng = e.location.lng().toString();
                    form.ui.latitud_parada.setValue(lat);
                    form.ui.longitud_parada.setValue(lng);
                });
            }

            self.navTableParadasPersonas = new qxnw.navtable(form);
            var columns = [
                {
                    caption: "id",
                    label: form.tr("ID"),
                    visible: false
                },
                {
                    caption: "nombre_pasajero",
                    label: form.tr("Nombre pasajero")
                },
                {
                    caption: "direccion",
                    label: form.tr("Dirección parada")
                },
//                {
//                    caption: "direccion_destinocheck",
//                    label: form.tr("La dirección es la misma del destino general")
//                },
                {
                    caption: "descripcion_carga",
                    label: form.tr("Comentarios")
                },
                {
                    caption: "latitud_parada",
                    label: form.tr("Latitud parada"),
                    visible: false
                },
                {
                    caption: "longitud_parada",
                    label: form.tr("Longitud parada"),
                    visible: false
                }
            ];
            self.navTableParadasPersonas.setColumns(columns);
//            var t = main.getConfiguracion();
            form.insertNavTable(self.navTableParadasPersonas.getBase(), form.tr("Paradas Adicionales"));
            form.__addButon = self.navTableParadasPersonas.getAddButton();
            form.__addButon.setVisibility("excluded");

            form.ui.agregar.addListener("click", function () {
                var data = form.getRecord();
                if (!form.validate()) {
                    return;
                }
                console.log("data", data)
                var tipo = self.formservi.ui.tipo_servicio.getValue();
                console.log(tipo);
                if (!main.isCustomer()) {
                    if (tipo.tipo_servicio == "") {
                        qxnw.utils.information("Primero seleccione el tipo de servicio, luego agregue las paradas adicionales.");
                        return;
                    }
                }
                if (!main.evalueData(data.direccion) && !main.evalueData(data.nombre_pasajero)) {
                    qxnw.utils.information("Debe agregar una dirección de parada o nombre para agregar a la lista.");
                    return false;
                }
                self.navTableParadasPersonas.addRows([data]);
                form.ui.direccion.setValue("");
                form.ui.nombre_pasajero.setValue("");
                form.ui.descripcion_carga.setValue("");
                form.ui.latitud_parada.setValue("");
                form.ui.longitud_parada.setValue("");
//                form.clean();
            });

            form._removeButtonv = self.navTableParadasPersonas.getRemoveButton();
            form._removeButtonv.addListener("click", function () {
                var f = self.navTableParadasPersonas.selectedRecord();
                if (f == undefined || f == null) {
                    qxnw.utils.information(self.tr("Seleccione un registro para eliminar"));
                    return;
                } else {
                    self.navTableParadasPersonas.removeSelectedRow();
                }
            });
            if (self.paradasAdicionalesVal != false) {
                self.navTableParadasPersonas.setModelData(self.paradasAdicionalesVal);
            }

            self.navTableParadasAndPersonas = form;
            var ra = [];
            if (qxnw.utils.evalue(sl)) {
                if (qxnw.utils.evalue(sl.enrutamiento)) {
                    var enrutar = sl.enrutamiento;
                    for (var i = 0; i < enrutar.length; i++) {
                        var row = enrutar[i]
                        ra.push({
                            id: row.id,
                            nombre_pasajero: row.nombre,
                            direccion: row.direccion_parada,
                            descripcion_carga: row.observacion,
                            longitud_parada: row.longitud,
                            latitud_parada: row.latitud
                        });
                    }
                    console.log("sl.enrutamiento:::", sl.enrutamiento);
                    setTimeout(function () {
                        self.navTableParadasPersonas.addRows(ra);

                    }, 1000);
                }
            }
        },
        consultaTokenUsu: function consultaTokenUsu(pos) {
            var self = this;
            var token = pos;
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
            var c = rpc.exec("tokenUsuario", token);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            console.log("tokenUsuario", c);
            if (c === false || c === 0) {
                return false;
            }
            return c;
//            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
//            rpc.setAsync(true);
//            var func = function (res) {
//            };
//            rpc.exec("tokenUsuario", self.dat, func);
        },
        sendNotificacionPsh: function sendNotificacionPsh(pos) {
            var self = this;
            var token = pos;
            var res = self.dat.token_usuario;

            for (var i = 0; i < res.length; i++) {
                var tokenUser = res[i].json;
                self.sendNotificacionPushDos({
                    title: "Servicio generado",
                    body: "Ingrese a la aplicación",
                    icon: "fcm_push_icon",
                    sound: "default",
                    data: "nw.dialog('Servicio generado')",
                    callback: "FCM_PLUGIN_ACTIVITY",
                    to: tokenUser
                }, function (r) {
                    console.log("Notify send OK to" + tokenUser + r);
                });
            }
//            for (var e = 0; e < token.length; e++) {
//                var envio = token[e].json;
//                self.sendNotificacionPushDos({
//                    title: "Tienes un Servicio",
//                    body: "¿Deseas Aceptar este Viaje?",
//                    icon: "fcm_push_icon",
//                    sound: "default",
//                    data: "nw.dialog('Tienes un Servicio')",
//                    callback: "FCM_PLUGIN_ACTIVITY",
//                    to: envio
//                }, function (r) {
//                    console.log("Notify send OK to" + envio + r);
//                });
//            }
        },
        sendNotificacionPushDos: function sendNotificacionPushDos(array, callback) {
            var key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';
            var to = array.to;
            var notification = {
                'title': array.title,
                'body': array.body,
                'sound': array.sound,
                'icon': array.icon,
                'click_action': array.callback,
                "priority": "high",
                "content_available": true,
                "show_in_foreground": true
            };
            fetch('https://fcm.googleapis.com/fcm/send', {
                'method': 'POST',
                "content_available": true,
                'headers': {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'notification': notification,
                    "show_in_foreground": true,
                    "content_available": true,
                    'priority': 'high',
//                "restricted_package_name":""
                    'to': to,
                    data: {
                        data: array.data,
                        callback: array.callback.toString(),
                        title: array.title,
                        body: array.body
                    }
                })
            }).then(function (response) {
                console.log(response);
            })
//                    .catch(function (error) {
//                console.error(error);
//
//            })
        },
        addParadasAdicionalesMapa: function addParadasAdicionalesMapa(paradas) {
            var self = this;
            console.log(paradas);
            if (qxnw.utils.evalue(paradas)) {
                if (qxnw.utils.evalue(paradas.length)) {
                    if (self.paradas_adicionales.length > 0) {
                        var par = self.paradas_adicionales;
                        for (var e = 0; e < par.length; e++) {
                            var exist = par[e];
                            exist.setMap(null);
                            if (par.length == e + 1) {
                                self.paradas_adicionales = [];
                            }
                        }
                    }
                    for (var i = 0; i < paradas.length; i++) {
                        var parada = paradas[i];
                        var latLong = new google.maps.LatLng(parada.latitud_parada, parada.longitud_parada);
                        console.log(latLong);
                        var parada_add = self.mapa.googleMap.placeMarker(latLong, "Parada Adicional: " + parada.direccion);
                        self.paradas_adicionales.push(parada_add);
                    }

                }
            }
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
}
);