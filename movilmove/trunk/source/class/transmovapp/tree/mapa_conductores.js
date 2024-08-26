qx.Class.define("transmovapp.tree.mapa_conductores", {
    extend: qxnw.treeWidget,
    construct: function (ok) {
        this.base(arguments);
        var self = this;
        self.setGroupHeader("Mapa Conductores");
        self.setTitle("Mapa Conductores");

        self.config = main.getConfiguracion();
        self.up = qxnw.userPolicies.getUserData();

        self.crearSegundoEspacio = false;

        if (self.crearSegundoEspacio) {
            self.createSecondLayer();
        }

        self.parent = {};
        self.markerc = {};
        self.allMarkers = [];

        self.movedMarkersOnly = false;

        self.form = new qxnw.forms();
        var fields = [
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "buscar_conductor",
                caption: "buscar_conductor",
                label: "Buscar conductor",
                type: "textField"
            },
            {
                name: "ciudad",
                caption: "ciudad",
                label: "Ciudad conductor",
                type: "selectTokenField",
                required: false
            },
            {
                name: "libres",
                caption: "libres",
                label: "Libre",
                type: "checkBox"
            },
            {
                name: "ocupados",
                caption: "ocupados",
                label: "Ocupado",
                type: "checkBox"
            },
            {
                name: "en_linea",
                caption: "en_linea",
                label: "En línea",
                type: "checkBox"
            },
            {
                name: "buscar",
                caption: "buscar",
                label: "Buscar",
                type: "button"
            },
            {
                name: "buscar_live",
                caption: "buscar_live",
                label: "Activar live",
                type: "button"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.form.setFields(fields);

        self.form.ui.buscar_conductor.setPlaceholder("Placa Doc Nombre");

        self.form.ui.buscar_conductor.addListener("keypress", function (e) {
            var val = this.getValue();
            console.log("val", val);
            if (e.getKeyIdentifier() == "Enter" && qxnw.utils.evalueData(val)) {
//            if (e.getKeyIdentifier() == "Enter") {
                self.populateTree();
            }
        });

        var alto = window.innerHeight;
        self.container = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            marginTop: 0
            ,
            height: alto
            ,
            maxHeight: alto - 200
        });
        self.containerLeft = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
            marginTop: -30
//            ,
//            height: alto
//            ,
//            maxHeight: alto - 50
        });
        self.container.add(self.containerLeft, {
            flex: 1
        });
        self.containerFilters.add(self.form.masterContainer, {
            flex: 1
        });
        self.mapa = new enrutamiento.forms.f_mapa_libre();


        self.containerLeft.add(self.mapa.masterContainer, {
            flex: 1
        });
        self.rightWidget.addBefore(self.container, self.tabView);

//        var buttons = [
//            {
//                label: 'Rechazar',
//                name: 'rechazar',
//                icon: qxnw.config.execIcon("dialog-close")
//            },
//            {
//                label: 'Aceptar',
//                name: 'aceptar',
//                icon: qxnw.config.execIcon("dialog-apply")
//            }
//        ];
//        self.addButtons(buttons);
//        self.ui.aceptar.addListener("execute", function () {
//            self.aceptarViaje();
//        });
//        self.ui.rechazar.addListener("execute", function () {
//            self.rechazarViaje();
//        });

//        self.setAllowClose(false);
//        self.setAllowMinimize(false);

        self.creadoOnAppear = false;
        self.addListener("appear", function () {
            if (!self.creadoOnAppear) {
                qx.bom.element.Class.add(self.getContentElement().getDomElement(), "container_form_mapaconductores");

                self.eventsMap();
            }
            self.creadoOnAppear = true;
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

            self.populateTree();
        }, this);

        self.form.ui.buscar.addListener("execute", function () {
            if (!self.form.validate()) {
                return false;
            }
            self.populateTree();
        });

        self.interval = null;
        self.form.ui.buscar_live.setLabel("Activar live");
        self.form.ui.buscar_live.addListener("execute", function () {
            if (!self.form.validate()) {
                return false;
            }
            clearInterval(self.interval);

            if (!self.movedMarkersOnly) {
                self.movedMarkersOnly = true;

                self.populateTree();


                self.interval = setInterval(function () {
                    if (!document.querySelector(".container_form_mapaconductores")) {
                        clearInterval(self.interval);
                        return false;
                    }
                    self.populateTree();
                }, 15000); //15 segs
//                }, 3000); //3 segs

                self.form.ui.buscar_live.setLabel("Inactivar live");
            } else {
                self.movedMarkersOnly = false;
                self.populateTree();
                self.form.ui.buscar_live.setLabel("Activar live");
            }
        });


    },
    members: {
        eventsMap: function eventsMap() {
            var self = this;
            self.mapa.googleMap.map.addListener('dragend', function (e) {
                console.log("eeee", e);
                var center = this.getCenter();
                console.log("center", center);
                console.log("center.lat()", center.lat());
                console.log("center.lng()", center.lng());

                qxnw.utils.remove(".map_buscaraqui");
                var contain = document.querySelector(".container_form_mapaconductores .mapa_widget");
                var div = document.createElement("div");
                div.innerHTML = "¿Buscar aquí?";
                div.className = "map_buscaraqui";
                div.onclick = function () {
                    qxnw.utils.remove(".map_buscaraqui");
                    self.api_geocodeInverse(center.lat(), center.lng(), function (e) {
                        console.log("inverse", e);
                        var city = "";
                        for (var i = 0; i < e.length; i++) {
                            var arr = e[i];
                            console.log("arr", arr);
                            for (var x = 0; x < arr.address_components.length; x++) {
                                if (arr.address_components[x].types[0] == "locality") {
                                    city = arr.address_components[x].long_name;
                                    break;
                                }
                            }
                            if (city != "") {
                                break;
                            }
                        }
                        console.log("city", city);
                        if (city != "") {
                            self.form.ui.buscar_conductor.setValue(city);
                            self.populateTree();
                        }
                    });
                };
                contain.appendChild(div);
            });
        },
        api_geocodeInverse: function api_geocodeInverse(lat, lng, callback) {
            console.log("lat", lat);
            console.log("lng", lng);
            console.log("main.geocoder", main.geocoder_l);
            console.log("typeof main.geocoder", typeof main.geocoder_l);
            if (typeof main.geocoder_l === 'undefined') {
                main.geocoder_l = new google.maps.Geocoder();
            }
            var ui = new google.maps.LatLng(lat, lng);
            main.geocoder_l.geocode({'latLng': ui}, processGeocoderValidate);
            function processGeocoderValidate(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    callback(results, status);
                } else {
                    console.log("Geocoding fallo debido a : " + status);
                    qxnw.utils.information("Geocoding no procesado debido a : " + status);
                }
            }
        },
//        aceptarViaje: function aceptarViaje() {
//            var self = this;
//            console.log("self.data", self.data);
//            main.bookingAcceptOrDeclineTravel(self.data, "accept", function (res) {
//                self.accept();
//            });
//        },
//        rechazarViaje: function rechazarViaje() {
//            var self = this;
//            console.log("self.data", self.data);
//            main.bookingAcceptOrDeclineTravel(self.data, "decline", function (res) {
//                self.accept();
//            });
//        },
        addDataSecondLayer: function addDataSecondLayer(data) {
            var self = this;
            if (!self.crearSegundoEspacio) {
                return false;
            }
            var element = self.leftWidget.getChildren()[1].getContentElement().getDomElement();

            var className = "vehiculo_" + data.id;
            if (document.querySelector("." + className)) {
                return false;
            }
            var container = document.querySelector(".containersAllV");
            if (!container) {
                container = document.createElement("div");
                container.className = "containersAllV";
                container.innerHTML = "<div class='titlemapcond'>Vehículos seleccionados</div>";
                element.appendChild(container);
            }

            var marca = "Sin marca";
            if (qxnw.utils.evalueData(data.marca_text)) {
                marca = data.marca_text;
            }
            var html = "";
            html += "<span class='placa_addmap'>" + data.placa + " " + marca + "</span>";
            html += "<span class='nombre_raddmap'>" + data.nombre + "</span>";
            html += "<span class='nit_raddmap'>" + data.nit + "</span>";
            html += "<span class='celular_raddmap'>" + data.celular + "</span>";

            var div = document.createElement("div");
            div.innerHTML = html;
            div.className = "vehiculoAddTreeMap " + className;
            div.data = data;
            container.appendChild(div);

            var conBtns = document.createElement("div");
            conBtns.className = "conBtns";
            div.appendChild(conBtns);

            var btn = document.createElement("div");
            btn.className = "vehiculoRemove";
            btn.innerHTML = "x";
            btn.data = data;
            btn.onclick = function () {
                var data = this.data;
                console.log("data", data);
                var classn = ".vehiculo_" + data.id;
                document.querySelector(classn).remove();
            };
            conBtns.appendChild(btn);

        },
        populateTree: function populateTree(callback) {
            var self = this;
            if (!self.movedMarkersOnly) {
                self.addTreeHeader(self.tr("Conductores"), qxnw.config.execIcon("view-sort-descending"));
            }
//            var dataform = self.form.getRecord();
            var data = self.form.getRecord();
            data.empresa_o_flota = main.empresa_o_flota;
            data.permisos = main.permisos_usuario;
//            data.ciudad = dataform.ciudad;
//            data.buscar_conductor = dataform.buscar_conductor;
            console.log("populateTree:::data:::", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "enrutamiento_masivo");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            var func = function (r) {
                console.log("populateTree:::responseServer:::", r);
                if (!self.movedMarkersOnly) {
                    self.addTreeHeader(self.tr("Conductores " + r.records.length), qxnw.config.execIcon("view-sort-descending"));
                    for (var i = 0; i < self.allMarkers.length; i++) {
                        var mark = self.allMarkers[i];
                        mark.setMap(null);
                    }
                }
                if (r === 0 || r === false || r.length === 0) {
                    return false;
                }


                var bounds = new google.maps.LatLngBounds();
                for (var i = 0; i < r.records.length; i++) {
                    var dat = r.records[i];
                    console.log("dat", dat);
                    self.addDriverInTree(dat);
                    if (!self.movedMarkersOnly) {
                        if (main.evalueData(dat.latitud) && main.evalueData(dat.longitud)) {
                            bounds.extend({lat: parseFloat(dat.latitud), lng: parseFloat(dat.longitud)});
                        }
                    }
                }
                if (!self.movedMarkersOnly) {
                    self.mapa.googleMap.map.fitBounds(bounds);
                    if (r.records.length == 1) {
                        self.mapa.googleMap.map.setCenter(bounds.getCenter());
                    }
                }


                if (qxnw.utils.evalueData(callback)) {
                    callback();
                }
            };
            rpc.exec("consultaConductores", data, func);
        },
        addDriverInTree: function addDriverInTree(e) {
            var self = this;
            console.log("addDriverInTree", e);
            var status = main.estadoDriverByData(e);
            console.log("status", status);
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
                marca_text = e.marca_text;
            }
            otros += "<span class='placaandmarca'>" + placa + " " + marca_text + "</span>";

            otros += nombre;

            otros += "<span class='statusdriver'>" + status.todo_in_html + "</span>";

            var fecha_ultima_conexion = "Nunca se ha conectado";
            if (qxnw.utils.evalueData(e.fecha_ultima_conexion)) {
                fecha_ultima_conexion = e.fecha_ultima_conexion;
            }
            otros += "<span>Last: " + fecha_ultima_conexion + "</span>";

            otros += "<span>User: " + e.usuario_cliente + " CC: " + e.nit + "</span>";
            otros += "<span>" + " - " + e.num_personas + " capMax</span>";
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
            var ht = "<div class='driverDivInTree driverDivInTree_" + e.id + "'>" + otros + "</div>";

            if (qxnw.utils.evalueData(self.parent[e.id]) && self.movedMarkersOnly) {
                var con = document.querySelector(".driverDivInTree_" + e.id);
                if (con) {
                    con.innerHTML = otros;
                }
            } else {
                self.parent[e.id] = self.addTreeFolder(ht, icon, e, true, true, true);
                self.parent[e.id].addListener("click", function () {
                    var model = this.getModel();
                    console.log("model", model);

                    self.addDataSecondLayer(model);
                    self.seleccionarDriver(model);

                    if (!main.evalueData(model.latitud) || !main.evalueData(model.longitud)) {
                        return false;
                    }
                    self.animaMarkerOutAll(model);
                    var location = new google.maps.LatLng(model.latitud, model.longitud);
                    self.mapa.googleMap.map.setCenter(location);
                });
            }

            var marca = "";
            if (qxnw.utils.evalueData(e.marca_text)) {
                marca = e.marca_text;
            }

//            var iconm = "/lib_mobile/driver/img/pindriver_1_35.png";
            var iconm = main.iconEstadoDriverByData(e);

            e.title = "";
//            e.titleHover = ht;
            e.centerMap = false;
            e.openAtClick = false;
            e.animationOnClick = false;
            e.icon = iconm;
            e.othersPropertiesArray = [
                {
                    name: "optimized",
                    value: true
                },
                {
                    name: "label",
                    value: {
                        text: e.placa + " " + marca,
//                        text: e.placa,
                        className: "map-label-veh"
                    }
                }
            ];

            e.callbackMarker = function (marker) {
                self.seleccionarDriver(marker.data);
                self.animaMarkerOutAll(marker.data);
                self.addDataSecondLayer(marker.data);
            };
            console.log("eeeeeee", e);
            var marker = self.addMarkerInMap(e);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.data = pr;
            pr.distancia_text = pr.distancia + " " + pr.distancia_unidad;
            pr.precio_text = pr.precio + " " + pr.moneda;
            self.form.setRecord(pr);
            console.log("self.mapa", self.mapa);
        },
        numDeltas: 100,
        delay: 10, //milliseconds
        transition: function (result, marker, position) {
            var self = this;
            var i = 0;
            var deltaLat = (result[0] - position[0]) / self.numDeltas;
            var deltaLng = (result[1] - position[1]) / self.numDeltas;
            self.moveMarker(marker, deltaLat, deltaLng, i, position);
        },
        moveMarker: function (marker, deltaLat, deltaLng, i, position) {
            var self = this;
            position[0] += deltaLat;
            position[1] += deltaLng;
            var latlng = new google.maps.LatLng(position[0], position[1]);
            marker.setTitle("Latitude:" + position[0] + " | Longitude:" + position[1]);
            marker.setPosition(latlng);
            if (i != self.numDeltas) {
                i++;
                setTimeout(function () {
                    self.moveMarker(marker, deltaLat, deltaLng, i, position);
                }, self.delay);
            }
        },
        addMarkerInMap: function addMarkerInMap(dir) {
            var self = this;
            console.log("addMarkerInMap", dir);
            if (!main.evalueData(dir.latitud) || !main.evalueData(dir.longitud)) {
                return false;
            }
            if (!qxnw.utils.isOnline()) {
                console.log("Compruebe su conexión a internet.");
                return false;
            }

            if (self.movedMarkersOnly) {
                var exist = self.markerc["" + dir.id + ""];
                console.log("exist", exist);
                if (exist) {
//                    var latlng = new google.maps.LatLng(dir.latitud, dir.longitud);
//                    exist.setTitle("Latitude:" + dir.latitud + " | Longitude:" + dir.longitud);
//                    exist.setPosition(latlng);
//                    return exist;

                    var position = [exist.getPosition().lat(), exist.getPosition().lng()];
                    var result = [parseFloat(dir.latitud), parseFloat(dir.longitud)];
                    self.transition(result, exist, position);
                    return exist;
                }
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
            var othersPropertiesArray = dir.othersPropertiesArray;
            self.markerc["" + dir.id + ""] = self.mapa.googleMap.placeMarker(location, title, openAtClick, icon, openIcon, centerMap, callbackonclick, dir, animationOnClick, othersPropertiesArray);

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
        }
    }
});