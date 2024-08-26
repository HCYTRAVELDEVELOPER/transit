nw.Class.define("f_0_createMapa", {
    extend: nw.lists,
    construct: function (self, callback) {
        if (self.debugConstruct) {
            console.log("START_LAUNCH:::::::::::::: f_0_createMapa");
        }
//        var latitud = self.positionConductor.lat;
//        var longitud = self.positionConductor.lng;
        var latitud = 4.6615942;
        var longitud = -74.0525647;
        if (nw.evalueData(window.localStorage.getItem("nwgeo_latitude"))) {
            latitud = window.localStorage.getItem("nwgeo_latitude");
        }
        if (nw.evalueData(window.localStorage.getItem("nwgeo_longitude"))) {
            longitud = window.localStorage.getItem("nwgeo_longitude");
        }

        var mape = new nwgeo.getMap();
        mape.canvas = document.querySelector('.mapa');
        mape.zoom = self.zoom;
        mape.latitude = latitud;
        mape.longitude = longitud;
        mape.animate = true;
        mape.tilt = 0;
        mape.bearing = 0;
        mape.show(function (map) {
//            if (self.debugConstruct) {
                console.log("MAP_CREATE:::::::::::::: f_0_createMapa");
//            }
            self.map = map;
            callback();
        });
        $(".containMapAndOpened").remove();
        $(".container-grid-all").remove();
//            self.enableOrientationArrow();
    },
    destruct: function () {
    },
    members: {
    }
});