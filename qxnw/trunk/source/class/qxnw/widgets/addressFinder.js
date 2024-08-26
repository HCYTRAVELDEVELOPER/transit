qx.Class.define("qxnw.widgets.addressFinder", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setTitle(self.tr("Buscador de coordenadas"));
        this.setWidth(530);
        this.setHeight(400);

//        main.loadGoogleMaps();

        var timer = new qx.event.Timer(2000);
        timer.start();
        qxnw.utils.loading();
        timer.addListener("interval", function (e) {
            timer.stop();
            var fields = [
                {
                    name: "address",
                    type: "textField",
                    label: self.tr("Dirección"),
                    mode: "search"
                },
                {
                    name: "pais",
                    type: "textField",
                    label: self.tr("País"),
                    mode: "search"
                },
                {
                    name: "ciudad",
                    type: "textField",
                    label: self.tr("Ciudad"),
                    mode: "search"
                },
                {
                    name: "latitude",
                    type: "textField",
                    label: self.tr("Latitud")
                },
                {
                    name: "longitude",
                    type: "textField",
                    label: self.tr("Longitud")
                }
            ];
            self.setFields(fields);

            self.ui.pais.setValue("CO");

            self.ui.address.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    self.ui.accept.focus();
                }
            });
            self.ui.pais.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    self.ui.accept.focus();
                }
            });
            self.ui.ciudad.addListener("keypress", function (e) {
                if (e.getKeyIdentifier() == "Enter") {
                    self.ui.accept.focus();
                }
            });

            self.ui.accept.addListener("execute", function (e) {
                self.ui.address.focus();
            });

            self.ui.cancel.addListener("execute", function (e) {
                self.close();
            });

            var latitude = 4.598056;
            var longitude = -74.075833;
            self.googleMap = new qxnw.maps(latitude, longitude);
            self.googleMap.setZoom(12);
            var mapWidget = self.googleMap.createGoogleMap();
            self.insertNavTable(mapWidget);
            self.googleMap.setManageCoordinates(true);

            self.googleMap.setLatitudeUpdate(self.ui.latitude);
            self.googleMap.setLongitudeUpdate(self.ui.longitude);

            self.ui.accept.addListener("execute", function () {
                var data = self.getRecord();
                var address = data.address;
                var geocoder = new google.maps.Geocoder();
                if (geocoder) {
                    qxnw.utils.loading("Cargando coordenadas...");
                    geocoder.geocode(
                            {
                                'address': address,
                                'region': "CO",
                                'componentRestrictions': {
                                    'country': self.ui.pais.getValue(),
                                    'locality': self.ui.ciudad.getValue()
                                }
                            }, function (results, status) {
                        qxnw.utils.stopLoading();
                        if (status == google.maps.GeocoderStatus.OK) {
                            self.googleMap.setPosition(results[0].geometry.location);
                            if (self.__oldMarker != null) {
                                self.__oldMarker.setMap(null);
                            }
                            var marker = self.googleMap.placeMarker(results[0].geometry.location, address);
                            self.__oldMarker = marker;
                        } else {
                            alert("Geocode was not successful for the following reason: " + status);
                        }
                    });
                }
            });
            qxnw.utils.stopLoading();
        });
    },
    members: {
        __oldMarker: null
    }
});