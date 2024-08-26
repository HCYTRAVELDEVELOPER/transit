nw.Class.define("f_ver_viaje", {
    extend: nw.forms,
    construct: function (datos) {
        var self = this;
        self.id = "f_ver_viaje";
        self.closeBack = false;
        self.showBack = true;
        if (main.previsualiza === true) {
            self.showBack = false;
            self.changeHash = false;
            self.transition = "pop";
        }
        self.createBase();
        self.datos = datos;
        var fields = [
            {
                styleContainer: "margin:0;",
                style: "height:400px;margin:0;",
                label: "Mapa",
                name: "mapa",
                type: "startGroup"
            },
            {
                type: "endGroup"
            },
            {
                visible: true,
                label: "",
                name: "observaciones_html",
                type: "html"
            }
        ];
        self.setFields(fields);
        self.buttons = [];
    },
    destruct: function () {
    },
    members: {
        createMapa: function createMapa() {
            var self = this;
            var mape = new nwgeo.getMap(false);
            mape.canvas = document.querySelector(self.canvas + ' .mapa');
            mape.zoom = 10;
            self.map = mape.show();
        },
        createNavTableParadas: function createNavTableParadas() {
            var self = this;
            var datos = self.datos;
            var canvas = "#f_ver_viaje #observaciones_html .nav_paradas";
            var div = document.querySelector("#f_ver_viaje #observaciones_html .nav_paradas");
            var ele = document.createElement('div');
            ele.style = "font-size: 16px;text-align: center;font-weight: bold;text-decoration: underline;"
            ele.innerHTML = nw.tr('Paradas adicionales');
            div.appendChild(ele);
            var nav = new l_navtable_paradas();
            nav.construct(canvas, datos);
            self.navTable = nav;
        },
        createLine: function createLine() {
            var self = this;
            var map = self.map;

            console.log("self.marker1", self.marker1);
            console.log("self.marker1", self.marker2);
            if (nw.evalueData(self.marker1)) {
                nwgeo.removeMarker(self.marker1);
            }
            if (nw.evalueData(self.marker2)) {
                nwgeo.removeMarker(self.marker2);
            }

            var marker = new nwgeo.addMarker();
            marker.map = map;
            marker.latitude = self.latitude;
            marker.longitude = self.longitude;
            marker.title = self.direccion_origen;
            marker.label = "";
            marker.icon = self.icon1;
            marker.native = false;
            marker.draggable = false;
            self.marker1 = marker.show();

            var marker = new nwgeo.addMarker();
            marker.map = map;
            marker.latitude = self.latitudDes;
            marker.longitude = self.longitudDes;
            marker.title = self.direccion_destino;
            marker.label = "";
            marker.icon = self.icon2;
            marker.draggable = false;
            marker.native = false;
            self.marker2 = marker.show();

            var func = function (response) {
                nwgeo.centerMap(map, self.marker1, self.marker2);
                self.callback(response);
            };
            var coords = {lat: self.latitude, lng: self.longitude, lat2: self.latitudDes, lng2: self.longitudDes};


            var onlyGetData = false;
            var colorLine = main.colorPolyLine;
            var animateOrCenter = "animate";
            var multipleCoords = true;
            nwgeo.addLineStreet(map, coords, func, colorLine, onlyGetData, animateOrCenter, multipleCoords);
        }
    }
});