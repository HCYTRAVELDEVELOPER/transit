qx.Class.define("booking.lists.l_booking_getavailableoffers", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;

//        self.classNameClean = "container_form_bookingoffers";
        self.classNameClean = "container_form_bookingoffers" + qxnw.utils.getRandomName();
        self.className = "." + self.classNameClean;
        console.log("self.className", self.className);

        if (document.querySelector(self.className)) {
            return false;
        }
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        self.setTitle("Booking trae ofertas");
        self.conf = main.getConfiguracion();

        self.creado = false;
        self.arrayData = [];
        self.idsShow = [];
        self.inter = null;

        if (self.conf.booking_activo != "SI") {
            qxnw.utils.information("El módulo Booking no está activo para esta cuenta. Consulte con su asesor comercial Movilmove.");
            return false;
        }
        if (main.isCustomer()) {
            qxnw.utils.information("No tiene permisos para portal clientes.");
            return false;
        }
        qxnw.local.storeData(self.getAppWidgetName() + "_max_show_rows", 20);

        var columns = [
            {
                caption: "aceptar",
                label: "",
                type: "html"
            },
            {
                caption: "rechazar",
                label: "",
                type: "html"
            },
            {
                caption: "ver",
                label: "",
                type: "html"
            },
            {
                caption: "id",
                label: "ID offer"
            },
            {
                caption: "id_journey",
                label: "ID journey"
            },
            {
                caption: "code",
                label: "Código"
            },
            {
                caption: "fecha_viaje",
                label: "Fecha del viaje",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "pax",
                label: "Pax",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "vehicleCategory",
                label: "Vehículo",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "origen",
                label: "Origen",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "origen_latitud",
                label: "Origen latitud"
            },
            {
                caption: "origen_longitud",
                label: "Origen longitud"
            },
            {
                caption: "destino",
                label: "Destino",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "destino_latitud",
                label: "Destino latitud"
            },
            {
                caption: "precio",
                label: "Precio",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "moneda",
                label: "Moneda",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "destino_longitud",
                label: "Destino longitud"
            },
            {
                caption: "distancia",
                label: "Distancia",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "distancia_unidad",
                label: "Distancia unidad",
                type: "html",
                mode: "toolTip"
            }
        ];
        self.setColumns(columns);

        self.hideColumn("id");
        self.hideColumn("id_journey");
        self.hideColumn("origen_latitud");
        self.hideColumn("origen_longitud");
        self.hideColumn("destino_latitud");
        self.hideColumn("destino_longitud");

//        var filters = [
//            {
//                name: "buscar",
//                caption: "buscar",
//                label: "Buscar...",
//                type: "textField"
//            }
//        ];
//        self.createFilters(filters);
        self.setAllPermissions(true);

//        self.ui.deleteButton.addListener("click", function () {
//            self.slotEliminar();
//        });
//        self.ui.editButton.addListener("click", function () {
//            self.slotEditar();
//        });
        self.ui.unSelectButton.addListener("click", function () {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function () {
            self.creado = false;
            self.applyFilters();
            self.initInterval();
        });

//        self.ui.searchButton.addListener("execute", function () {
//            self.creado = false;
//            self.applyFilters();
//            self.initInterval();
//        });
//        self.ui.newButton.addListener("click", function () {
//            self.slotNuevo();
//        });
        self.ui.newButton.setVisibility("excluded");
        self.ui.editButton.setVisibility("excluded");
        self.ui.deleteButton.setVisibility("excluded");

        self.table.addListener("cellTap", function (e) {
            var col = e.getColumn();
            var data = self.selectedRecord();
            console.log("col", col);
            console.log("data", data);
            console.log("self.arrayData", self.arrayData);
            console.log("self.arrayData[data.id]", self.arrayData[data.id]);
            if (col == 0) {
                main.bookingAcceptTravelForm(self.arrayData[data.id], "accept", function (res) {
                    self.applyFilters();
                });
            }
            if (col == 1) {
                main.bookingCancelTravelForm(self.arrayData[data.id], "decline", function (res) {
                    self.applyFilters();
                });
            }
            if (col == 2) {
                self.slotVer(self.arrayData[data.id]);
            }
        });

//        self.ui["part1"].setVisibility("excluded");
//        self.ui["part2"].setVisibility("excluded");
//        self.ui["part3"].setVisibility("excluded");

        self.table.getTableColumnModel().setColumnWidth(3, 70);
        self.table.getTableColumnModel().setColumnWidth(4, 70);
        self.table.getTableColumnModel().setColumnWidth(5, 70);
        self.table.getTableColumnModel().setColumnWidth(7, 40);
        self.table.getTableColumnModel().setColumnWidth(8, 80);
        self.table.getTableColumnModel().setColumnWidth(9, 200);
        self.table.getTableColumnModel().setColumnWidth(10, 200);

        self.table.setRowHeight(80);

        self.creadoOnAppear = false;
        self.addListener("appear", function () {
            if (!self.creadoOnAppear) {
                qx.bom.element.Class.add(self.getContentElement().getDomElement(), "container_form_bookingoffers");
                qx.bom.element.Class.add(self.getContentElement().getDomElement(), self.classNameClean);

                setTimeout(function () {
                    self.nosize = document.createElement("div");
                    self.nosize.className = "nosize_div";
                    self.nosize.innerHTML = "No hay artículos";
                    self.nosize.style = "display: none;";
                    document.querySelector(self.className).appendChild(self.nosize);

                    self.applyFilters();
                    self.initInterval();

                }, 500);
            }
            self.creadoOnAppear = true;
        });

        self.execSettings();

//        self.applyFilters();
//        self.initInterval();
    },
    destruct: function () {
    },
    members: {
        initInterval: function initInterval() {
            var self = this;
            clearInterval(self.inter);
            self.inter = setInterval(function () {
                if (!document.querySelector(self.className)) {
                    clearInterval(self.inter);
                    return false;
                }
                self.applyFilters();
//            }, 30000); // 30 segs
            }, 10000); //10 segs      
        },
        slotVer: function slotVer(r) {
            var self = this;
            var d = new booking.tree.vista_general();
//                d.setWidth(1200);
//                d.setMaxWidth(1200);
//                d.setHeight(600);
//                d.setMaxHeight(600);
            d.maximize(true);
            d.setModal(true);
            d.setParamRecord(r);
            d.populateTree(r);
            d.settings.accept = function () {
                self.applyFilters();
            };
            d.show();

            var pr = r;
            d.addListener("appear", function () {

                var val = {};
                val.latitud = pr.origen_latitud;
                val.longitud = pr.origen_longitud;
                val.icon = "/lib_mobile/driver/img/marker_a.png";
                val.centerMap = false;
                val.openAtClick = true;
                val.title = "";
                val.titleHover = pr.origen;
//                val.callbackMarker = function (marker) {
//                    self.markerOrigen = marker;
//                };
                d.markerOrigen = d.addMarkerInMap(val);

                var val = {};
                val.latitud = pr.destino_latitud;
                val.longitud = pr.destino_longitud;
                val.icon = "/lib_mobile/driver/img/marker_b.png";
                val.centerMap = false;
                val.openAtClick = true;
                val.title = "";
                val.titleHover = pr.destino;
//                val.callbackMarker = function (marker) {
//                    self.markerOrigen = marker;
//                };
                d.markerOrigen = d.addMarkerInMap(val);

                var location = new google.maps.LatLng(pr.origen_latitud, pr.origen_longitud);
                d.mapa.googleMap.map.setCenter(location);
                d.mapa.googleMap.setZoom(9);

            });
        },
        contextMenu: function contextMenu(veteapp) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var r = self.selectedRecord();
            console.log("r", r);
            var m = new qxnw.contextmenu(this);
//            m.addAction("Aceptar", "icon/16/actions/document-properties.png", function (e) {
//                self.slotEditar();
//            });
//            m.addAction("Ver", "icon/16/actions/document-properties.png", function (e) {
//                console.log("r", r);
//                self.slotVer(r);
//            });
            m.exec(veteapp);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var ds = {};
            ds.key = self.conf.booking_key;
            ds.url_endpoint = self.conf.booking_url_endpoint;
            console.log("ds", ds);
            var rpc = new qxnw.rpc(self.rpcUrl, "booking");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            if (!self.creado) {
                qxnw.utils.loadingnw("Conectándose a Booking (getAvailableOffers)... Por favor espere...", "cargando_axtest");
            }
            var func = function (rta) {
                console.log("l_booking_getavailableoffers:::applyFilters:::responseServer", rta);

                qxnw.utils.loadingnw_remove("cargando_axtest");

                if (typeof rta == "object") {
                    if (rta.offers == null) {
                        rta = [];
                    }
                }

                var res = [];
                console.log("res", res);
                if (rta.length == 0) {
//                    qxnw.utils.information("No hay ofertas");
                    self.nosize.style.display = "block";
                } else {
                    self.nosize.style.display = "none";
                    res = rta.offers;
                }
                if (res.length == 0) {
//                    qxnw.utils.information("No hay ofertas");
                    self.nosize.style.display = "block";
                } else {
                    self.nosize.style.display = "none";
                }
                for (var i = 0; i < res.length; i++) {
                    var r = res[i];
                    res[i].aceptar = "<div class='btnlist btnlist_accept'>Aceptar</div>";
                    res[i].rechazar = "<div class='btnlist btnlist_rechazar'>Rechazar</div>";
                    res[i].ver = "<div class='btnlist btnlist_ver'>Ver</div>";
                    res[i].id_journey = r.journey.id;
                    res[i].code = r.journey.code;
                    res[i].fecha_viaje = r.journey.pickupTime.localTime;
                    res[i].pax = r.journey.travellerInfo.passengerCount;
                    res[i].vehicleCategory = r.journey.vehicleCategory;
                    res[i].origen = r.journey.pickup.resolvedAddress;
                    res[i].origen_latitud = r.journey.pickup.latitude;
                    res[i].origen_longitud = r.journey.pickup.longitude;
                    res[i].destino = r.journey.dropoff.resolvedAddress;
                    res[i].destino_latitud = r.journey.dropoff.latitude;
                    res[i].destino_longitud = r.journey.dropoff.longitude;
                    res[i].distancia = r.journey.distance;
                    res[i].distancia_unidad = r.journey.distanceUnit;
                    res[i].precio = r.journey.fareSummary.includingVat;
                    res[i].moneda = r.journey.fareSummary.currency;

                    self.arrayData[res[i].id] = res[i];

//                    if (typeof self.idsShow[res[i].id] == "undefined") {
                    var array = {};
                    array.title = "Nueva oferta (booking)";
                    array.icon = "";
                    array.body = r.journey.pickup.resolvedAddress;
                    array.callback = function () {
                        main.slotBookingGetAvailableOffers();
                    };
                    main.newNotificacion(array);
//                    }

                    self.idsShow[res[i].id] = res[i].id;

                }
                console.log("res modify", res);
                self.setModelData(res);

                self.creado = true;
            };
            rpc.exec("getavailableoffers", ds, func);
        }
    }
});