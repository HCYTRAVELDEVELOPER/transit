qx.Class.define("booking.lists.l_booking_cancelled", {
    extend: qxnw.lists,
    construct: function () {
//        if (document.querySelector(".container_form_bookingcancelled")) {
//            return false;
//        }
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        self.setTitle("Booking trae servicios cancelados");
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
                caption: "status",
                label: "Status"
            },
            {
                caption: "assignmentStatus",
                label: "Estado asignación"
            },
            {
                caption: "driverCode",
                label: "Driver Code"
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
            },
            {
                caption: "travellerInfo",
                label: "Pasajero info",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "meetingPoint",
                label: "meeting Point",
                type: "html",
                mode: "toolTip"
            },
            {
                caption: "addons",
                label: "Extras",
                type: "html",
                mode: "toolTip"
            }
        ];
        self.setColumns(columns);

//        self.hideColumn("id");
//        self.hideColumn("id_journey");
        self.hideColumn("origen_latitud");
        self.hideColumn("origen_longitud");
        self.hideColumn("destino_latitud");
        self.hideColumn("destino_longitud");

        var filters = [
            {
                name: "journeyCode",
                caption: "journeyCode",
                label: "journeyCode",
                type: "textField"
            },
            {
                name: "pageActual",
                caption: "pageActual",
                label: "pageActual",
                type: "textField"
            },
            {
                name: "size",
                caption: "size",
                label: "size",
                type: "textField"
            },
            {
                name: "sort",
                caption: "sort",
                label: "sort",
                type: "selectBox"
            },
            {
                name: "pickupDateAfter",
                caption: "createdAfter",
                label: "createdAfter",
                type: "dateTimeField"
            }
        ];
        self.createFilters(filters);

        self.setAllPermissions(true);

        self.ui.pageActual.setValue("0");
        self.ui.size.setValue("10");
        self.hideFooterTools();

        var data = {};
        data["pickup%3Basc"] = self.tr("pickup;asc");
        data["pickup%3Bdesc"] = self.tr("pickup;desc");
        data["created%3Basc"] = self.tr("created;asc");
        data["created%3Bdesc"] = self.tr("created;desc");
        qxnw.utils.populateSelectFromArray(self.ui.sort, data);

        self.ui.pickupDateAfter.setValue(qxnw.utils.getActualFullDate());

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
//            self.initInterval();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.creado = false;
            self.applyFilters();
//            self.initInterval();
        });
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
            if (col == 0) {
                self.slotVer(self.arrayData[data.id]);
            }
        });

//        self.ui["part1"].setVisibility("excluded");
//        self.ui["part2"].setVisibility("excluded");
//        self.ui["part3"].setVisibility("excluded");

//        self.table.getTableColumnModel().setColumnWidth(3, 70);
//        self.table.getTableColumnModel().setColumnWidth(4, 70);
//        self.table.getTableColumnModel().setColumnWidth(5, 70);
//        self.table.getTableColumnModel().setColumnWidth(7, 40);
//        self.table.getTableColumnModel().setColumnWidth(8, 80);
//        self.table.getTableColumnModel().setColumnWidth(9, 200);
//        self.table.getTableColumnModel().setColumnWidth(10, 200);

        self.table.setRowHeight(80);

        self.creadoOnAppear = false;
        self.addListener("appear", function () {
            if (!self.creadoOnAppear) {
                qx.bom.element.Class.add(self.getContentElement().getDomElement(), "container_form_bookingcancelled");

//                setTimeout(function () {
//                    self.nosize = document.createElement("div");
//                    self.nosize.className = "nosize_div";
//                    self.nosize.innerHTML = "No hay artículos";
//                    self.nosize.style = "display: none;";
//                    document.querySelector(".container_form_bookingcancelled").appendChild(self.nosize);
//                }, 500);
            }
            self.creadoOnAppear = true;
        });

        self.execSettings();

        self.applyFilters();

//        self.initInterval();
    },
    destruct: function () {
    },
    members: {
//        initInterval: function initInterval() {
//            var self = this;
//            clearInterval(self.inter);
//            self.inter = setInterval(function () {
//                if (!document.querySelector(".container_form_bookingcancelled")) {
//                    clearInterval(self.inter);
//                    return false;
//                }
//                self.applyFilters();
////            }, 30000); // 30 segs
//            }, 10000); //10 segs      
//        },
        slotVer: function slotVer(r) {
            var self = this;

            r.acceptTravels = true;
            var d = new booking.tree.vista_general(r);
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
            ds.filters = self.getFiltersData();
            console.log("ds", ds);
            var rpc = new qxnw.rpc(self.rpcUrl, "booking");
            rpc.setAsync(true);
            rpc.setShowLoading(false);
            if (!self.creado) {
                qxnw.utils.loadingnw("Conectándose a Booking (getJourneysCancelled)... Por favor espere...", "cargando_axtest_dos");
            }
            var func = function (rta) {
                qxnw.utils.loadingnw_remove("cargando_axtest_dos");
                console.log("rta", rta);
                var res = rta.results;
//                var res = [];
//                console.log("res", res);
//                if (rta.length == 0) {
////                    qxnw.utils.information("No hay ofertas");
//                    self.nosize.style.display = "block";
//                } else {
//                    self.nosize.style.display = "none";
//                    res = rta.offers;
//                }
//                if (res.length == 0) {
////                    qxnw.utils.information("No hay ofertas");
//                    self.nosize.style.display = "block";
//                } else {
//                    self.nosize.style.display = "none";
//                }
                for (var i = 0; i < res.length; i++) {
                    var r = res[i];
                    console.log("r", r);
//                    res[i].aceptar = "<div class='btnlist btnlist_accept'>Aceptar</div>";
//                    res[i].rechazar = "<div class='btnlist btnlist_rechazar'>Rechazar</div>";
                    res[i].ver = "<div class='btnlist btnlist_ver'>Ver</div>";
                    res[i].id_journey = r.id;
                    res[i].code = r.code;
                    res[i].fecha_viaje = r.pickupTime.localTime;
                    res[i].pax = r.travellerInfo.passengerCount;
                    res[i].vehicleCategory = r.vehicleCategory;
                    res[i].origen = r.pickup.resolvedAddress;
                    res[i].origen_latitud = r.pickup.latitude;
                    res[i].origen_longitud = r.pickup.longitude;
                    res[i].destino = r.dropoff.resolvedAddress;
                    res[i].destino_latitud = r.dropoff.latitude;
                    res[i].destino_longitud = r.dropoff.longitude;
                    res[i].distancia = r.distance;
                    res[i].distancia_unidad = r.distanceUnit;
                    res[i].precio = r.fareSummary.includingVat;
                    res[i].moneda = r.fareSummary.currency;
                    if (qxnw.utils.evalueData(r.meetingPoint)) {
                        res[i].meetingPoint = r.meetingPoint.title + " - " + r.meetingPoint.description;
                    }
                    res[i].travellerInfo = r.travellerInfo.firstName + " - " + r.travellerInfo.lastName + " - " + r.travellerInfo.email + " - " + r.travellerInfo.phone + " - " + r.travellerInfo.flightNumber;

                    if (qxnw.utils.evalueData(r.addOns)) {
                        var addOns = "";
                        for (var y = 0; y < r.addOns.length; y++) {
                            addOns += " " + r.addOns[y];
                        }
                        res[i].addons = addOns;
                    }


                    self.arrayData[res[i].id] = res[i];

//                    if (typeof self.idsShow[res[i].id] == "undefined") {
//                    var array = {};
//                    array.title = "Nueva oferta (booking)";
//                    array.icon = "";
//                    array.body = r.journey.pickup.resolvedAddress;
//                    array.callback = function () {
//                        main.slotBookingGetAvailableOffers();
//                    };
//                    main.newNotificacion(array);
//                    }

//                    self.idsShow[res[i].id] = res[i].id;

                }
                console.log("res modify", res);
                self.setModelData(res);

                self.creado = true;
            };
            rpc.exec("cancelledoffers", ds, func);
        }
    }
});