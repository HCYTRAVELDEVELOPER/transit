qx.Class.define("enrutamiento.forms.f_mapa_libre", {
    extend: qxnw.forms,
    properties: {
        position: {
            init: null,
            check: "Object"
        }
    },
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader("Mapa Libre");
        self.setTitle("Mapa Libre");
        self.config = main.getConfiguracion();
        var fields = [];
        self.setFields(fields);

        self.ui.accept.setVisibility("excluded");
        self.ui.cancel.setVisibility("excluded");

        var latitude = 4.598056;
        var longitude = -74.075833;
        var zoom = 12;
        if (qxnw.utils.evalueData(self.config.latitud_mapa_crear_servicios, true) && qxnw.utils.evalueData(self.config.longitud_mapa_crear_servicios, true)) {
            latitude = parseFloat(self.config.latitud_mapa_crear_servicios);
            longitude = parseFloat(self.config.longitud_mapa_crear_servicios);
        }
        if (qxnw.utils.evalueData(self.config.zoom_mapa_crear_servicios, true)) {
            zoom = parseFloat(self.config.zoom_mapa_crear_servicios);
        }


        self.googleMap = {};
        if (qxnw.utils.isOnline()) {
            self.googleMap = new qxnw.maps(latitude, longitude);
            self.googleMap.setZoom(zoom);
            self.googleMap.setDragableMap(true);
            self.googleMap.setCreateMarkers(false);
            var mapWidget = self.googleMap.createGoogleMap();
            self.insertNavTable(mapWidget);
            self.googleMap.setManageCoordinates(true);
        } else {
            console.log("Compruebe su conexión a internet.");
        }

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    destruct: function () {
    },
    members: {
        setParamRecord: function setParamRecord(pr) {
            var self = this;
        }
    }
});
