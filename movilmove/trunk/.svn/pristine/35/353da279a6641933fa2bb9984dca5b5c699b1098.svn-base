nw.Class.define("f_1_createMapa", {
    extend: nw.lists,
    construct: function (self) {
        var selfthis = this;
        var up = nw.userPolicies.getUserData();

        if (self.debugConstruct) {
            console.log("START_LAUNCH:::::::::::::: f_1_createMapa");
        }
        nw.console.log("START_LAUNCH:::::::::::::: f_1_createMapa");
        selfthis.selfparent = self;

        self.geo.latitude = nwgeo.latitude;
        self.geo.longitude = nwgeo.longitude;
        var mape = new nwgeo.getMap();
        mape.animate = false;
        mape.bearing = 0;
        mape.tilt = 0;
        mape.durationAnimation = 2000;
        mape.iconMarker = config.domain_rpc + config.carpet_files_extern + '/img/pin46.png';
        if (nw.evalueData(config.iconDriverPuntoA)) {
            mape.iconMarker = config.iconDriverPuntoA;
        }
//        if (nw.evalueData(up.foto)) {
//            mape.iconMarker = config.domain_rpc + up.foto;
//        }
//        if (nw.evalueData(up.foto_perfil)) {
//            mape.iconMarker = config.domain_rpc + up.foto_perfil;
//        }
        mape.canvas = document.querySelector(self.canvas + ' .mapa');
        mape.latitude = nwgeo.latitude;
        mape.longitude = nwgeo.longitude;
        mape.zoom = 16;
        self.map = mape.show(function () {
            nw.loadingRemove();
        });

        if (typeof navigator.splashscreen !== "undefined") {
            navigator.splashscreen.hide();
        }

        $(".gm-style").remove();
        $(".containMapAndOpened").remove();
        $(".container-grid-all").remove();
        nw.loadingRemove();

        nwgeo.initialize(function (position) {
            self.createActionsInputsSearchDirections();
        }, true);

        self.markerMyUbication();
        self.initialMyUbication();

        nwgeo.dragMap("drag", self.map, function (e) {
            if (nw.evalueData(self.marker3)) {
                var lat = 0;
                var lng = 0;
                if (!nwgeo.native) {
                    lat = self.map.center.lat();
                    lng = self.map.center.lng();
                } else {
                    var target = self.map.getCameraTarget();
                    lat = target.lat;
                    lng = target.lng;
                }
                self.latitudMapaDrag = lat;
                self.longitudMapaDrag = lng;
                nwgeo.setPositionMarker(self.marker3, lat, lng);
            }
            self.dragMap = true;
        });

        nwgeo.dragMap("dragstart", self.map, function (e) {
            if (self.markerSelected === 2) {
                self.ui.listo_fijar_label.setVisibility(true);
                self.ui.listo_fijar.setVisibility(false);
                nwgeo.removeAllPolyLines();
                self.cleanMarkerDestino();
            } else
            if (self.markerSelected === 1) {
                nwgeo.removeAllPolyLines();
                self.cleanMarkerOne();
            }
            self.dragMap = true;
        });

        nwgeo.dragMap("dragend", self.map, function (e) {
            if (self.markerSelected === 2) {
                self.ui.listo_fijar_label.setVisibility(false);
                self.ui.listo_fijar.setVisibility(true);
            } else
            if (self.markerSelected === 1) {
                self.ui.listo_fijar_label.setVisibility(false);
                self.ui.listo_fijar.setVisibility(true);
            }
            setTimeout(function () {
                self.dragMap = false;
            }, 20000);
            var center = nwgeo.getCenterMap(self.map);
            console.log("center", center);
//                nwgeo.getTrafficInMap(self.map, true);
//                nwgeo.setIndoorEnabled(self.map, true);
        });

    },
    destruct: function () {
    },
    members: {
    }
});