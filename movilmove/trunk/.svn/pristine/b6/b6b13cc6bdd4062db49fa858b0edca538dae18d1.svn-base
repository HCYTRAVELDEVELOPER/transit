qx.Class.define("transmovapp.forms.f_servicios", {
    extend: qxnw.forms,
    construct: function (t) {
        var self = this;
        this.base(arguments);
        this.createBase();
//        self.setAskOnClose(true);
        self.setGroupHeader("Nuevo/Editar Servicio");
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
//            {
//                name: "crear_vehiculo",
//                label: "Nuevo Vehículo",
//                caption: "crear_vehiculo",
//                type: "button",
//                icon: qxnw.config.execIcon("list-add")
//            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Informacion General",
                type: "startGroup",
                icon: "",
                mode: "grid"
            },
            {
                name: "tipo_servicio",
                label: self.tr("<strong>TIpo Servicio</strong>"),
                caption: "tipo_servicio",
                type: "selectBox",
                required: true,
                row: 0,
                column: 0
            },
            {
                name: "servicio_para",
                label: self.tr("<strong>Servicio Para</strong>"),
                caption: "servicio_para",
                type: "selectBox",
                required: true,
                row: 0,
                column: 1
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
                name: "fecha",
                label: self.tr("<strong>Fecha</strong>"),
                caption: "fecha",
                type: "dateField",
                required: false,
                row: 1,
                column: 0
            },
            {
                name: "hora",
                label: self.tr("<strong>Hora</strong>"),
                caption: "hora",
                type: "timeField",
                required: false,
                row: 1,
                column: 1
            },
            {
                name: "usuario",
                label: self.tr("<strong>Usuario</strong>"),
                caption: "usuario",
                type: "selectTokenField",
                required: true,
                mode: "upperCase",
                row: 2,
                column: 0
            },
            {
                name: "crear_usuario",
                label: "Nuevo Usuario",
                caption: "crear_usuario",
                type: "button",
                icon: qxnw.config.execIcon("list-add"),
                row: 2,
                column: 2
            },
//            {
//                name: "placa",
//                label: self.tr("<strong>Placa Vehículo</strong>"),
//                caption: "placa",
//                type: "selectBox",
//                required: true,
//                row: 1,
//                column: 1
//            },

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
                mode: "grid"
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
                row: 0,
                column: 1
            },
            {
                name: "destino",
                label: "Dirección Destino",
                caption: "destino",
                type: "textField",
//                visible: false,
                row: 1,
                column: 0
            },
            {
                name: "ciudad_destino",
                label: self.tr("<strong>Ciudad Destino</strong>"),
                caption: "ciudad_destino",
                type: "textField",
//                visible: false,
                row: 1,
                column: 1
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        this.setFields(fields);
        console.log(t);
        this.setTitle("Nuevo/Editar Servicio");
        self.setRequired("fecha", false);
        self.setFieldVisibility(self.ui.fecha, "excluded");
        self.setRequired("hora", false);
        self.setFieldVisibility(self.ui.hora, "excluded");
        self.ui.usuario.hideColumn("id");
//        self.ui.origen.addClass("origen");
//        self.ui.pago_group.addClass("buttons_group_fix_pago_group");

//        self.ui.fecha.setValue(new Date());
//        var f = new Date();
//        self.ui.hora.setValue(f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds());
        self.ui.accept.setVisibility("excluded");
        self.ui.cancel.setVisibility("excluded");


        var data = {};
        data["trayecto"] = "Trayecto";
        data["fija"] = "Fija";
        qxnw.utils.populateSelectFromArray(self.ui.tipo_tarifa, data);

        var m = {};
        m[""] = self.tr("Seleccione");
        m["ahora"] = self.tr("ahora");
        m["Reservar"] = self.tr("reservar");
        qxnw.utils.populateSelectFromArray(self.ui.servicio_para, m);
        if (t.tarifa == "SI") {
            var data = {};
            data[""] = "Todas";
            qxnw.utils.populateSelect(self.ui.tipo_servicio, "usuarios", "tarifa", data);
//            qxnw.utils.populateSelectFromArray(self.ui.tipo_servicio, t);
        } else {
            var t = {};
            t[""] = self.tr("Seleccione");
            t["Por Horas"] = self.tr("Por Horas");
            t["Por Trayecto"] = self.tr("Por Trayecto");
            qxnw.utils.populateSelectFromArray(self.ui.tipo_servicio, t);
        }
        self.ui.fecha.addListener("focusout", function () {
            self.validaFecha("fecha", "La hora del servicio no puede ser menor a la actual");
        });
        self.addListener("appear", function () {
            var data = self.ui.hora;
        });
        self.ui.hora.hour.getChildControl('textfield').addListener("input", function () {
            console.log("hola");
        });
//        self.ui.origen.setValue("calle 12 18 11");
//        self.ui.destino.setValue("calle 112 18 11");
//self.ui.ahora.setValue("");
//self.ui.ahora.setValue("");
//self.ui.ahora.setValue("");
        self.ui.servicio_para.addListener("changeSelection", function () {
            var data = self.getRecord();
            if (data.servicio_para == "ahora") {
                self.ui.reservar.setValue("NO");
                self.ui.ahora.setValue("SI");
                self.setRequired("fecha", false);
                self.setFieldVisibility(self.ui.fecha, "excluded");
                self.setRequired("hora", false);
                self.setFieldVisibility(self.ui.hora, "excluded");
            } else if (data.servicio_para == "Reservar") {
                self.setFieldVisibility(self.ui.hora, "visible");
                self.setFieldVisibility(self.ui.fecha, "visible");
                self.setRequired("fecha", true);
                self.setRequired("hora", true);
                self.ui.reservar.setValue("SI");
                self.ui.ahora.setValue("NO");
            } else {
                self.ui.reservar.setValue("");
                self.ui.ahora.setValue("");
            }
        });
        self.ui.tipo_servicio.addListener("changeSelection", function () {
            var data = self.getRecord();
//            console.log(data);
            if (data.tipo_servicio == "Por Horas") {
                self.setRequired("destino", false);
                self.setRequired("ciudad_destino", false);
                self.setFieldVisibility(self.ui.destino, "excluded");
                self.setFieldVisibility(self.ui.ciudad_destino, "excluded");
            } else if (data.tipo_servicio == "Por Trayecto") {
                self.setFieldVisibility(self.ui.destino, "visible");
                self.setFieldVisibility(self.ui.ciudad_destino, "visible");
                self.setRequired("destino", true);
                self.setRequired("ciudad_destino", true);
            }
        });
        var latitude = 4.598056;
        var longitude = -74.075833;
        self.ui.usuario.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.usuario.setModelData(r);
                var item = self.getRecord();
                if (self.editar == false) {
                } else {
                    self.editar = false;
                }
            };
            rpc.exec("populateTokenUsuarios", data, func);
        }, this);
        self.ui.fecha.addListener("focusout", function (e) {
            var self = this;
            var comp = self.ui.fecha.getValue();
//            if (comp = ) {
//
//            }
        }, this);
        self.ui.hora.addListener("focusout", function (e) {
            var hora_servicio = self.ui.hora.getValue();
            var f = new Date();
            var top = f.getHours() + 1;
            var hour = top + ":" + f.getMinutes() + ":" + f.getSeconds();
//            var fsano = fecha_servicio.getFullYear();
//            var fsmes = fecha_servicio.getMonth() + 1;
//            var fsdia = fecha_servicio.getDate();
            if (hora_servicio <= hour) {
                qxnw.utils.information("Debe seleccionar una Hora mayor superior a 1 hora a la actual para reservar.Verifique por favor");
//                self.ui.fecha.setValue(null);
            }
        });
        self.ui.usuario.addListener("addItem", function () {
            var item = self.getRecord();
            console.log(item);
            if (self.editar == false) {
            } else {
                self.editar = false;
            }
        }, this);

        var buttons = [
            {
                label: 'Siguiente',
                name: 'siguiente',
                icon: qxnw.config.execIcon("go-next")
            }
        ];
        self.addButtons(buttons);
        self.navTable = new qxnw.navtable(self);
        var columns = [
            {
                caption: "id",
                label: "ID"
            },
            {
                caption: "direccion_parada",
                label: "Dirección Parada"
            },
            {
                caption: "latitud",
                label: "Latitud "
            },
            {
                caption: "longitud",
                label: "longitud "
            },
            {
                caption: "lugar_parada",
                label: "Lugar"
            },
            {
                caption: "ciudad_parada",
                label: "ID Ciudad"
            },
            {
                caption: "ciudad_parada_text",
                label: "Ciudad"
            },
            {
                caption: "localidad",
                label: "Localidad"
            },
            {
                caption: "barrio",
                label: "Barrio"
            }
        ];
        self.navTable.setColumns(columns);
        self.navTable.hideColumn("id");
        self.navTable.hideColumn("ciudad_parada");
        self.navTable.ui.exportButton.setVisibility("excluded");
        self.navTable.ui.cleanFiltersButton.setVisibility("excluded");
        self.insertNavTable(self.navTable.getBase(), self.tr("Otra Parada (opcional)"));
        self.__addButon = self.navTable.getAddButton();
        self.__addButon.addListener("click", function () {
            self.crearForm();
        });
        self.__removeButton = self.navTable.getRemoveButton();
        self.__removeButton.addListener("click", function () {
            var r = self.navTable.selectedRecord();
            if (r == undefined) {
                qxnw.utils.information("Seleccione un registro para eliminar");
                return;
            }
            self.navTable.removeSelectedRow();
            if (r.id != undefined) {
                self.slotDelete(r);
            }
        });

        var fecha = new Date();
        var fano = fecha.getFullYear();
        var fmes = fecha.getMonth() + 1;
        var fdia = fecha.getDate();


        self.ui.fecha.addListener("focusout", function () {
            var fecha_servicio = self.ui.fecha.getValue();
            var fsano = fecha_servicio.getFullYear();
            var fsmes = fecha_servicio.getMonth() + 1;
            var fsdia = fecha_servicio.getDate();

            if (fano > fsano) {
                qxnw.utils.information("Debe selecionar una fecha mayor.Verifique por favor");
//                self.ui.fecha.setValue(null);
            } else {
                if (fmes > fsmes) {
                    qxnw.utils.information("Debe selecionar una fecha mayor.Verifique por favor");
//                    self.ui.fecha.setValue(null);
                } else {
                    if (fano == fsano && fmes == fsmes) {
                        if (fdia > fsdia) {
                            qxnw.utils.information("Debe selecionar una fecha mayor.Verifique por favor");
//                            self.ui.fecha.setValue(null);
                        }
                    }
                }
            }
        });
//        var data = {};
//        data[""] = "Todas";
//        qxnw.utils.populateSelect(self.ui.ciudad_origen, "usuarios", "ciudad", data);
//        var data = {};
//        data[""] = "Todas";
//        qxnw.utils.populateSelect(self.ui.ciudad_destino, "usuarios", "ciudad", data);
        self.ui.crear_usuario.addListener("execute", function () {
            self.crearUsuario();
        });
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.ui.siguiente.addListener("execute", function () {
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
//            console.log(data);
            if (data.tipo_servicio == "Por Horas") {
                data.destino = null;
            }
            data.parada = self.navTable.getAllData();
            data.resultsOrigen = self.resultsOrigen;
            data.resultsDestino = self.resultsDestino;
//            self.accept();
            var d = new transmovapp.tree.conf_servicio(data);
//            d.setWidth(1100);
//            d.setHeight(640);
            d.maximize();
            d.settings.accept = function () {
                self.accept();
            };
            d.settings.cancel = function () {
                self.reject();
            };
            d.show();
        });
        console.log(self.googleMap);
        self.addListener("appear", function () {
            console.log(self.ui.origen.getLayoutParent().getContentElement().getChildren()[1]);
            qx.bom.element.Class.add(self.ui.origen.getLayoutParent().getContentElement().getChildren()[1].getDomElement(), "origen");
            qx.bom.element.Class.add(self.ui.destino.getLayoutParent().getContentElement().getChildren()[1].getDomElement(), "destino");
            self.autocomplete(".origen", self.googleMap, function (e) {
                console.log(e);
                self.ui.ciudad_origen.setValue(e.ciudad);
                self.resultsOrigen = e;
            });
            self.autocomplete(".destino", self.googleMap, function (e) {
                console.log(e);
                self.resultsDestino = e;
                self.ui.ciudad_destino.setValue(e.ciudad);
            });
        });
//        var addressField = document.getElementsByClassName("origen");
//        var geocoder = new google.maps.Geocoder();
//        self.ui.origen.addListener("focusout", function () {
//            self.search(addressField,geocoder);
//        });
    },
    destruct: function () {
    },
    members: {
        validaFecha: function validaFecha(campo, texto) {
            var self = this;
            var data = self.ui[campo].getValue();
            if (qxnw.utils.evalue(data)) {
                var hoy = new Date().toJSON().slice(0, 10);
                var fecha = data.toJSON().slice(0, 10);
                if (fecha < hoy) {
                    self.ui[campo].setValue("");
                    qxnw.utils.information(self.tr(texto));
                    return;
                }
            }
        },
//        search: function search(addressField,geocoder) {
//            console.log(addressField);
//            geocoder.geocode(
//                    {'address': addressField.value},
//            function (results, status) {
//                if (status == google.maps.GeocoderStatus.OK) {
//                    var loc = results[0].geometry.location;
//                    // use loc.lat(), loc.lng()
//                }
//                else {
//                    alert("Not found: " + status);
//                }
//            }
//            );
//        },
        autocomplete: function autocomplete(inputs, map, callback) {
            var self = this;
            var input = document.querySelector(inputs);
            console.log(map);
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
            autocomplete.addListener('place_changed', function () {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    nw.dialog("No details available for input: '" + place.name + "'");
                    return;
                }

                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }
                var geocoder = new google.maps.Geocoder();
                var ui = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
                geocoder.geocode({'latLng': ui}, processGeocoderValidate);
                function processGeocoderValidate(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        console.log(results[0]);
                        var resultsFin = self.extraerDataResult(results[0]);
                        console.log(resultsFin);
                        var rta = {};
//                        rta.place = place;
                        rta.address = address;
                        rta.location = results[0].geometry.location;
                        rta["direccion"] = resultsFin.direccion;
                        rta["barrio"] = resultsFin.barrio;
                        rta["localidad"] = resultsFin.localidad;
                        rta["ciudad"] = resultsFin.ciudad;
                        rta["pais"] = resultsFin.pais;
//                    rta.marker = marker;
//                        rta.autocomplete = autocomplete;
                        callback(rta);

                    } else {
                        error("Geocoding fallo debido a : " + status);
                    }
                }
            });

        },
        extraerDataResult: function extraerDataResult(results) {
            var self = this;
            var data = {};
            var a = self.getDataResult(results);
            data.address_components = a;
            data["address"] = results.formatted_address;
            data["direccion"] = results.formatted_address;
            data["barrio"] = a.neighborhood;
            data["localidad"] = a.sublocality;
            data["ciudad"] = a.locality;
            data["pais"] = a.country;
            data.allData = results;
            return data;
        },
        getDataResult: function getDataResult(results) {
            var re = results;
            var d = re.address_components;
            var total = d.length;
            var r = {};
            for (var i = 0; i < total; i++) {
                var x = d[i];
                var val = x.long_name;
                var t = x.types;
                for (var y = 0; y < t.length; y++) {
                    var g = t[y];
                    if (g == "political") {
                        continue;
                    }
                    r[g] = val;
                }
            }
            if (typeof r.route != "undefined") {
                if (typeof r.route.split(" ")[0] != "undefined") {
                    r.mode = r.route.split(" ")[0];
                }
                if (typeof r.route.split(" ")[1] != "undefined") {
                    r.mode_number = r.route.split(" ")[1];
                }
            }
            if (results.length > 1) {
                var d = results[1].address_components;
                var total = d.length;
                for (var i = 0; i < total; i++) {
                    var x = d[i];
                    var val = x.long_name;
                    var t = x.types;
                    for (var y = 0; y < t.length; y++) {
                        var g = t[y];
                        if (typeof r.neighborhood == "undefined" && g == "neighborhood" || typeof r.sublocality == "undefined" && g == "sublocality" || typeof r.sublocality_level_1 == "undefined" && g == "sublocality_level_1") {
                            r[g] = val;
                        }
                    }
                }
            }
            return r;
        },
        initAutocomplete: function initAutocomplete() {
            var self = this;

            var latitude = 4.598056;
            var longitude = -74.075833;
            self.googleMap = new qxnw.maps(latitude, longitude);
            var mapWidget = self.googleMap.createGoogleMap();
            console.log(mapWidget);
//            var map = new google.maps.Map(document.getElementByClassName(''), {
//                center: {lat: -33.8688, lng: 151.2195},
//                zoom: 13,
//                mapTypeId: 'roadmap'
//            });

            // Create the search box and link it to the UI element.
            var input = document.querySelector('.origen');
            console.log(input);
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);
            autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
//        var marker = new google.maps.Marker({
//            map: map,
//            anchorPoint: new google.maps.Point(0, -29)
//        });
            autocomplete.addListener('place_changed', function () {
//            marker.setVisible(false);
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    nw.dialog("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(nwgeo.zoom);
                }
//            marker.setPosition(place.geometry.location);
//            marker.setVisible(true);

                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }
                var geocoder = new google.maps.Geocoder();
                var ui = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
                geocoder.geocode({'latLng': ui}, processGeocoderValidate);
                function processGeocoderValidate(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        var rta = {};
                        rta.place = place;
                        rta.address = address;
//                    rta.marker = marker;
                        rta.autocomplete = autocomplete;
                        rta.results = nwgeo.extraerDataResult(results[0]);
                        callback(rta);

                    } else {
                        error("Geocoding fallo debido a : " + status);
                    }
                }
            });
        },
        navTable: null,
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();
            data.parada = self.navTable.getAllData();

            var rpc = new qxnw.rpc(this.rpcUrl, "servicios");
            rpc.setAsync(true);
            var func = function () {
                self.accept();
            };
            rpc.exec("saveServicio", data, func);
        },
        crearForm: function crearForm(pr) {
            var self = this;
            var f = new qxnw.forms();
            f.setTitle("Parada Adicional (Opcional)");
            var fields = [
                {
                    name: "",
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                },
                {
                    name: "direccion_parada",
                    label: "<strong>Direccion<strong>",
                    caption: "direccion_parada",
                    type: "textField",
                    required: true
                },
                {
                    name: "latitud",
                    label: "<strong>Latitud<strong>",
                    caption: "latitud",
                    type: "textField",
                    required: true
                },
                {
                    name: "longitud",
                    label: "<strong>Longitud<strong>",
                    caption: "longitud",
                    type: "textField",
                    required: true
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
                    name: "lugar_parada",
                    label: self.tr("<strong>Lugar Otra Parada</strong>"),
                    caption: "lugar_parada",
                    type: "textField"
                },
                {
                    name: "ciudad_parada",
                    label: self.tr("<strong>Ciudad Parada</strong>"),
                    caption: "ciudad_parada",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "localidad",
                    label: self.tr("<strong>Localidad</strong>"),
                    caption: "localidad",
                    type: "textField"
                },
                {
                    name: "barrio",
                    label: self.tr("<strong>Barrio</strong>"),
                    caption: "barrio",
                    type: "textField"
                },
                {
                    name: "",
                    type: "endGroup",
                    icon: ""
                }
            ];
            f.setFields(fields);
            f.setModal(true);

            f.ui.lugar_parada.setPlaceholder("Apartamento,oficina,etc");

//

//            var data = {};
//            data[""] = "Todas";
//            qxnw.utils.populateSelect(self.ui.ciudad_parada, "usuarios", "ciudad", data);

            f.show();
            f.ui.accept.addListener("execute", function () {
                var r = f.getRecord();
//                r.direccion_parada = r.nomenclatura_parada_text + " " + r.no_uno_parada + " # " + r.no_dos_parada + " - " + r.no_tres_parada;
//                self.navTable.addRows([r]);
                f.accept();
            });
            f.ui.cancel.addListener("execute", function () {
                f.reject();
            });
            return true;
        },
        crearUsuario: function crearUsuario(pr) {
            var self = this;
            var tipo = {};
            tipo.tipo = 1231;
            tipo.tipo_text = "usuario";
            var d = new transmovapp.forms.f_usuarios(tipo);
            d.settings.accept = function (r) {
                var data = d.getRecord();
                var nombre = data.nombre + " " + data.apellido;
                var token = {};
                token["id"] = r;
                token["nombre"] = nombre;
                self.formservi.ui.usuario.addToken(token);
            };
            d.ui.perfil.setValue(1);
            d.ui.perfil.setEnabled(false);
            d.setModal(true);
            d.show();
        },
        crearVehiculo: function crearVehiculo(pr) {
            var self = this;
            var sl = self.getRecord();
            if (sl.usuario == "" || sl.usuario == null) {
                qxnw.utils.information("Por favor seleccione un Usuario");
            } else {
//                var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
//                rpc.setAsync(true);
//                var func = function (r) {
//                    if (r.length >= 3) {
//                        qxnw.utils.information("No puede agregar mas vehículos a este usuario, ha completado la cantidad maxima permitida");
//                    } else {
                var d = new transmovapp.forms.f_vehiculo();
                var token = {
                    id: sl.usuario,
                    nombre: sl.usuario_text
                };
                d.ui.propietario_vehiculo.addToken(token);
                d.ui.propietario_vehiculo.setEnabled(false);
                d.setModal(true);
                d.show();
//                    }
//                };
//                rpc.exec("populateCantVehiculos", sl, func);
            }
        },
        slotDelete: function slotDelete(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            rpc.exec("eliminarParada", pr);
        },
        populateNavTable: function populateNavTable(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            var func = function (r) {
//                for (var i = 0; i < r.length; i++) {
////                    r[i].direccion_parada = r[i].nomenclatura_parada_text + " " + r[i].no_uno_parada + " # " + r[i].no_dos_parada + " - " + r[i].no_tres_parada;
//                }
                self.navTable.setModelData(r);
            };
            rpc.exec("populateParadas", pr, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            pr.conductor = "";
            pr.conductor_id = "";
            console.log(pr);
            self.setRecord(pr);
            self.editar = true;
            var data = {};

            if (qxnw.utils.evalue(pr.usuario_servicio)) {
                var token = {};
                token["id"] = pr.usuario_servicio;
                token["nombre"] = pr.usuario_servicio_text;
                self.ui.usuario.addToken(token);
            }
            if (qxnw.utils.evalue(pr.usuario)) {
                var token = {};
                token["id"] = pr.usuario;
                token["nombre"] = pr.usuario;
                self.ui.usuario.addToken(token);
            }
//            if (qxnw.utils.evalue(pr.ciudadd)) {
//                var token = {};
//                token["id"] = pr.ciudadd;
//                token["nombre"] = pr.ciudad_destino;
//                self.ui.ciudad_destino.addToken(token);
//            }
//            if (qxnw.utils.evalue(pr.ciudado)) {
//                var token = {};
//                token["id"] = pr.ciudado;
//                token["nombre"] = pr.ciudad_origen;
//                self.ui.ciudad_origen.addToken(token);
//            }
//            if (qxnw.utils.evalue(pr.tipo_servicio)) {
//                var token = {};
//                token["id"] = pr.tipo_servicio;
//                token["nombre"] = pr.tipo_servicio;
//                self.ui.tipo_servicio.addToken(token);
//            }
            if (pr.id == null || pr.id == "") {
                self.navTable.setModelData(pr.parada);
            } else {
                self.populateNavTable(pr.id);
            }
            return true;
        }
    }
});
