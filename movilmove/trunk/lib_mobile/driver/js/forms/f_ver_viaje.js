nw.Class.define("f_ver_viaje", {
    extend: nw.forms,
    construct: function (datos) {
        var self = this;
        self.id = "f_ver_viaje";
        self.showBack = true;
        self.closeBack = false;
        self.transition = "slide";
        self.datos = datos;
        self.createBase();
        var fields = [
            {
                styleContainer: "margin:0;",
                style: "height:400px;margin:0;width: 100%;",
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
        createNavTableTarAdic: function createNavTableTarAdic() {
            var self = this;
            var datos = self.datos;
            console.log(datos);
            var canvas = "#f_ver_viaje #observaciones_html .nav_adicion";
            var div = document.querySelector("#f_ver_viaje #observaciones_html .nav_adicion");
            var ele = document.createElement('div');
            ele.style = "font-size: 16px;text-align: center;font-weight: bold;text-decoration: underline;"
            ele.innerHTML = nw.tr('Descripción de adicionales');
            div.appendChild(ele);
            console.log(div);
            var nav = new l_navtable_tareas_adicionales();
            nav.construct(canvas, datos);
            self.navTable = nav;
        },
        createNavTableParadas: function createNavTableParadas() {
            var self = this;
            var datos = self.datos;
            console.log(datos);
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
        createMapa: function createMapa() {
            var self = this;
            var mape = new nwgeo.getMap(false);
            mape.canvas = document.querySelector(self.canvas + ' .mapa');
            mape.zoom = 10;
            self.map = mape.show();
        },
        createLine: function createLine() {
            var self = this;
            var map = self.map;

            var marker = new nwgeo.addMarker();
            marker.map = map;
            marker.latitude = self.latitude;
            marker.longitude = self.longitude;
            marker.title = self.direccion_origen;
            marker.label = "";
            marker.icon = "";
            marker.draggable = false;
            marker.native = false;
            self.marker1 = marker.show();

            var marker = new nwgeo.addMarker();
            marker.map = map;
            marker.latitude = self.latitudDes;
            marker.longitude = self.longitudDes;
            marker.title = self.direccion_destino;
            marker.label = "";
            marker.icon = "";
            marker.draggable = false;
            marker.native = false;
            self.marker2 = marker.show();
            var func = function (response) {
                nwgeo.centerMap(map, self.marker1, self.marker2);
//                map.setZoom(nwgeo.zoom);
                self.callback(response);
            };
            var coords = {lat: self.latitude, lng: self.longitude, lat2: self.latitudDes, lng2: self.longitudDes};
            nwgeo.addLineStreet(map, coords, func);
        }
    }
});