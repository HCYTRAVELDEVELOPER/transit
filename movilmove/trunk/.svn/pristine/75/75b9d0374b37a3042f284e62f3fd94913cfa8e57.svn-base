nw.Class.define("f_ver_viaje_mapstatic", {
    extend: nw.forms,
    construct: function (datos) {
        var self = this;
        self.id = "f_ver_viaje_mapstatic";
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
                label: "",
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
        createMapa: function createMapa(d) {
            var self = this;
            nw.remove(".mapEmbedNw");
            var canvas = document.querySelector(self.canvas + ' .mapa');
            var data = {
                origen_latitud: d.latitude,
                origen_longitud: d.longitude,
                destino_latitud: d.latitudDes,
                destino_longitud: d.longitudDes,
                direccion_origen: d.direccion_origen,
                direccion_destino: d.direccion_destino
            };
            new nwgeo.getMapEmbed(canvas, data);
        }
    }
});