qx.Class.define("maestros.forms.f_enrutamiento", {
    extend: qxnw.dragDropWidget,
    construct: function (tipo) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader("Enrutamiento");
        self.setTitle("Enrutamiento");
        var fields = [
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "usuario",
                label: "Usuario",
                caption: "usuario",
                type: "textField",
                visible: false
            },
            {
                name: "empresa",
                label: "empresa",
                type: "textField",
                visible: false
            },
            {
                name: "fecha",
                label: "fecha",
                type: "dateField",
                visible: false
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                caption: "nombre",
                type: "textField",
                required: true
            },
            {
                name: "direccion_parada",
                label: self.tr("Dirección"),
                caption: "direccion_parada",
                type: "textField",
                required: true
            },
            {
                name: "longitud",
                label: self.tr("Longitud"),
                caption: "longitud",
                type: "textField"
            },
            {
                name: "latitud",
                label: self.tr("Latitud"),
                caption: "latitud",
                type: "textField"
            },
            {
                caption: "observacion",
                name: "observacion",
                label: self.tr("Observación"),
                type: "textField",
                required: true
            },
            {
                name: "agregar",
                label: self.tr("Agregar"),
                type: "button"
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
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.setFields(fields);
        var filters = [
            {
                name: "fecha_inicial",
                label: "Fecha Inicial",
                type: "dateField",
                required: true
            },
            {
                name: "fecha_fin",
                label: "Fecha Fin",
                type: "dateField",
                required: true
            }
        ];
        self.createFilters(filters);
        self.buttonSearch.addListener("click", function () {
            self.slotApplyFilters();
        });
        self.ui.agregar.addListener("execute", function () {
            self.slotSaveParada();
        });
        self.ui.agregar.set({
            icon: qxnw.config.execIcon("dialog-apply")
        });
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.addListener("appear", function () {
            qx.bom.element.Class.add(self.ui.direccion_parada.getLayoutParent().getContentElement().getChildren()[1].getDomElement(), "direccion_parada");
            self.autocomplete(".direccion_parada", self.googleMap, function (e) {
                var locat = e.location;
                self.ui.longitud.setValue(String(locat.lng()));
                self.ui.latitud.setValue(String(locat.lat()));
            });
        });

    },
    destruct: function () {
    },
    members: {
        slotSaveParada: function slotSaveParada() {
            var self = this;
            var data = self.getRecord();
            if (data.nombre == "" || data.nombre == null) {
                qxnw.utils.information("El campo nombre esta vacio!");
                return;
            }
            if (data.direccion_parada == "" || data.direccion_parada == null) {
                qxnw.utils.information("El campo Dirección esta vacio");
                return;
            }
            if (data.observacion == "" || data.observacion == null) {
                qxnw.utils.information("El campo Observacion esta vacio");
                return;
            }
            var rpc = new qxnw.rpc(self.rpcUrl, "enrutamiento");
            rpc.setAsync(true);
            var func = function (r) {
                if (r) {
                    self.ui.direccion_parada.setValue("");
                    self.ui.nombre.setValue("");
                    self.ui.observacion.setValue("");
                    self.ui.latitud.setValue("");
                    self.ui.longitud.setValue("");
                    qxnw.utils.information("Se ha creado Correctamente");
                }
            };
            rpc.exec("saveParada", data, func);
        },
        slotSave: function slotSave() {
            var self = this;
            var data = self.getRecord();
            var t = main.getConfiguracion();
            data.enrutamiento = self.getRightListRecords();
            self.accept();
            var d = new transmovapp.tree.conf_servicio(t);
            setTimeout(function () {
                d.slotConfirmarInicioDestino(data);
//                self.accept();
            }, 3000);
            d.settings.accept = function () {

            };
            d.maximize();
            d.show();
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            console.log("setParamRecord", pr);
            self.setRecord(pr);
            self.ui.clave.setValue("12345");
//            self.populateNavTableFromParams(pr.usuario);
            return true;
        },

        formatoFecha: function formatoFecha(fecha, formato) {
            var dia = fecha.getDate();
            var mes = fecha.getMonth() + 1;
            var anio = fecha.getFullYear();

            console.log(mes.toString.length);
            if (mes.toString.length == 1) {
                mes = "0" + mes;
            }
            return anio + "-" + mes + "-" + dia;
        },
        
        slotApplyFilters: function slotApplyFilters() {
            var self = this;
            var data = {};
            let fecha_inicial = new Date(self.ui.fecha_inicial.getValue());
            let fecha_final = new Date(self.ui.fecha_fin.getValue());
            var fechai = self.formatoFecha(fecha_inicial, "yyyy-mm-dd");
            var fechaf = self.formatoFecha(fecha_final, "yyyy-mm-dd");
            data.fecha_inicial = fechai;
            data.fecha_final = fechaf;
            self.list1.removeAll();
            var list2 = self.list2.getAllData();
            data.list2 = list2;
            self.list1.populate("enrutamiento", "populateConsulta", data, "html");
        },
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
                        return callback(rta);

                    } else {
                        error("Geocoding fallo debido a : " + status);
                    }
                }
            });

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
        extraerDataResult: function extraerDataResult(results) {
            var self = this;
            var data = {};
            var a = self.getDataResult(results);
//        console.log(a);
            data.address_components = a;
            data["address"] = results.formatted_address;
            data["direccion"] = results.formatted_address;
            data["barrio"] = a.neighborhood;
            data["localidad"] = a.sublocality;
            var pais = "";
            var address = results.address_components;
            //recorremos todos los elementos de address
            for (var p = address.length - 1; p >= 0; p--) {
                //si es un pais
                if (address[p].types.indexOf("country") !== -1) {
                    var v = address[p].long_name;
                    if (v !== undefined) {
                        pais = v;
                    }
                }
            }
            var ciudad = "";
            //recorremos todos los elementos de address
            address.reverse();
            for (var p = address.length - 1; p >= 0; p--) {
                //si es una ciudad 
                if (address[p].types.indexOf("locality") !== -1) {
                    var v = address[p].long_name;
                    if (v !== undefined) {
                        ciudad = v;
                    }
                }
                if (ciudad === "") {
                    //si es una ciudad de nivel 2
                    if (address[p].types.indexOf("administrative_area_level_1") !== -1) {
                        var v = address[p].long_name;
                        if (v !== undefined) {
                            ciudad = v;
                        }
                    }
                    if (address[p].types.indexOf("administrative_area_level_2") !== -1) {
                        var v = address[p].long_name;
                        if (v !== undefined) {
                            ciudad = v;
                        }
                    }
                }
            }
            var poblacion = "";
//recorremos todos los elementos de address
            for (var p = address.length - 1; p >= 0; p--) {
                //si es una población
                if (address[p].types.indexOf("administrative_area_level_1") !== -1) {
                    var v = address[p].long_name;
                    if (v !== undefined) {
                        poblacion = v;
                    }
                }
            }
            data.poblacion = poblacion;
            data.ciudad = ciudad;
//        data.ciudad = a.locality;
//        data["pais"] = a.country;
            data.pais = pais;
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
        }
    }
});
