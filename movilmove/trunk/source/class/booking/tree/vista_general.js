qx.Class.define("booking.tree.vista_general", {
    extend: qxnw.treeWidget,
    construct: function (r) {
        this.base(arguments);
        var self = this;
        self.setGroupHeader("Booking travel - Vistal general");
        self.setTitle("Booking travel - Vistal general");

        console.log("r", r);
        self.dataTravel = r;
        console.log("self.dataTravel", self.dataTravel);

        self.config = main.getConfiguracion();

        self.up = qxnw.userPolicies.getUserData();

        self.createSecondLayer();

        self.markerc = {};
        self.allMarkers = [];

        self.form = new qxnw.forms();
        var fields = [
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "code",
                caption: "code",
                label: "Código",
                type: "textField",
                enabled: false
            },
            {
                name: "fecha_viaje",
                caption: "fecha_viaje",
                label: "Fecha del viaje",
                type: "textField",
                enabled: false
            },
            {
                name: "pax",
                caption: "pax",
                label: "Pax",
                type: "textField",
                enabled: false
            },
            {
                name: "vehicleCategory",
                caption: "vehicleCategory",
                label: "Vehículo",
                type: "textField",
                enabled: false
            },
            {
                name: "origen",
                caption: "origen",
                label: "Origen",
                type: "textField",
                enabled: false
            },
            {
                name: "destino",
                caption: "destino",
                label: "Destino",
                type: "textField",
                enabled: false
            },
            {
                name: "distancia_text",
                caption: "distancia_text",
                label: "Distancia",
                type: "textField",
                enabled: false
            },
            {
                name: "precio_text",
                caption: "precio_text",
                label: "Precio",
                type: "textField",
                enabled: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.form.setFields(fields);

        self.container = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            marginTop: 0
        });
        self.containerLeft = new qx.ui.container.Composite(new qx.ui.layout.VBox());
        self.container.add(self.containerLeft, {
            flex: 100
        });
        self.containerFilters.add(self.form.masterContainer, {
            flex: 1
        });
        self.mapa = new enrutamiento.forms.f_mapa_libre();
        self.containerLeft.add(self.mapa.masterContainer, {
            flex: 10
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
        self.setAllowMinimize(false);

        self.creadoOnAppear = false;
        self.addListener("appear", function () {
            if (!self.creadoOnAppear) {
                if (typeof self.dataTravel.acceptTravels == "undefined") {
                    self.addDataSecondLayer();
                }
            }
            self.creadoOnAppear = true;
        });


    },
    members: {
        aceptarViaje: function aceptarViaje() {
            var self = this;
            console.log("self.data", self.data);
            main.bookingAcceptOrDeclineTravel(self.data, "accept", function (res) {
                self.accept();
            });
        },
        rechazarViaje: function rechazarViaje() {
            var self = this;
            console.log("self.data", self.data);
            main.bookingAcceptOrDeclineTravel(self.data, "decline", function (res) {
                self.accept();
            });
        },
        addDataSecondLayer: function addDataSecondLayer() {
            var self = this;
            var element = self.leftWidget.getChildren()[1].getContentElement().getDomElement();

            console.log("self.dataTravel", self.dataTravel);

            var aceptar = document.createElement("div");
            aceptar.innerHTML = "<span>Aceptar</span>";
            aceptar.className = "btntreeac btntreeac_accept";
            aceptar.onclick = function () {
                self.aceptarViaje();
            };
            element.appendChild(aceptar);

            var rechazar = document.createElement("div");
            rechazar.innerHTML = "<span>Rechazar</span>";
            rechazar.className = "btntreeac btntreeac_rechazar";
            rechazar.onclick = function () {
                self.rechazarViaje();
            };
            element.appendChild(rechazar);

            var cerrar = document.createElement("div");
            cerrar.innerHTML = "<span>Cerrrar</span>";
            cerrar.className = "btntreeac btntreeac_cerrar";
            cerrar.onclick = function () {
                self.reject();
            };
            element.appendChild(cerrar);

        },
        populateTree: function populateTree(pr) {
            var self = this;
            console.log("populateTree:::START");
            self.conductor = false;
            self.addTreeHeader(self.tr("Información"), qxnw.config.execIcon("view-sort-descending"));

            var icon = qxnw.config.execIcon("green", "qxnw");

            console.log("pr", pr);
            self.addTreeFolder(pr.fecha_viaje, icon, false, true, true, true);
            self.addTreeFolder(pr.vehicleCategory, icon, false, true, true, true);
            self.addTreeFolder(pr.origen, icon, false, true, true, true);
            self.addTreeFolder(pr.destino, icon, false, true, true, true);
            self.addTreeFolder(pr.precio_text, icon, false, true, true, true);

            if (qxnw.utils.evalueData(pr.travellerInfo)) {
                self.addTreeFolder(pr.travellerInfo, icon, false, true, true, true);
            }
            if (qxnw.utils.evalueData(pr.meetingPoint)) {
                self.addTreeFolder(pr.meetingPoint, icon, false, true, true, true);
            }

        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.data = pr;
            pr.distancia_text = pr.distancia + " " + pr.distancia_unidad;
            pr.precio_text = pr.precio + " " + pr.moneda;
            self.form.setRecord(pr);
            console.log("self.mapa", self.mapa);
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
        }
    }
});