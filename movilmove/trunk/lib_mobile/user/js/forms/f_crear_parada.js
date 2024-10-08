nw.Class.define("f_crear_parada", {
    extend: nw.forms,
    construct: function (parent, map) {
        var self = this;
        self.id = "f_crear_parada";
        self.setTitle = "<span style='color:#fff;'>Agregar parada</span>";
        self.transition = "slide";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Atrás";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
        self.map = map;
        self.bandera = main.configCliente;
        console.log(self.bandera);
        console.log(self.bandera.requerir_campos_paradas_apk);
        self.closeBackCallBack = function () {
            nw.back();
        };
        if (nw.utils.getMobileOperatingSystem() == "IOS") {
//        self.transition = "slideup";
            self.transition = "none";
        }
        self.createBase();

        var fields = [
            {
                icon: "n",
                name: "direccion",
                label: "Dirección de la parada",
                placeholder: "Dirección de la parada",
                type: "search",
                required: true
            },
            {
                type: 'textField',
                label: 'Nombre del pasajero',
                placeholder: 'Nombre pasajero',
                name: 'nombre_pasajero',
                visible: true
            },
            {
                type: 'textArea',
                label: 'Comentarios, indicaciones',
                placeholder: 'Comentarios, indicaciones',
                name: 'descripcion_carga',
                visible: true
            },
            {
                type: 'textField',
                label: '',
                placeholder: 'Latitud',
                name: 'latitud',
                visible: false
            },
            {
                type: 'textField',
                label: '',
                placeholder: 'Longitud',
                name: 'longitud',
                visible: false
            }
        ];
        self.setFields(fields);
        if (main.configCliente.requerir_campos_paradas_apk === 'SI') {
            self.ui.nombre_pasajero.setRequired(true);
            self.ui.descripcion_carga.setRequired(true);
        }
        self.buttons = [
            {
                style: "background-color: var(--color_verde);color: #ffffff;",
                icon: "material-icons how_to_reg normal",
//                position: "top",
                position: "bottom",
                name: "aceptar",
                label: "Aceptar",
                callback: function () {
                    var data = self.getRecord();
                    if (!self.validate()) {
                        return false;
                    }
//                    var com = "";
//                    if (nw.evalueData(data.nombre_pasajero)) {
//                        com = "<strong>Nombre pasajero:</strong> " + data.nombre_pasajero;
//                        if (nw.evalueData(data.descripcion_carga)) {
//                            com += "<br />";
//                        }
//                    }
//                    if (nw.evalueData(data.descripcion_carga)) {
//                        com += "<strong>Comentarios:</strong> " + data.descripcion_carga;
//                    }
//                    data.descripcion_carga = com;
//                    console.log("parent", parent);
//                    console.log("data", data);
                    if (typeof parent.guardar_paradas !== "undefined") {
                        parent.saveParada(data);
                        nw.back();
                        return;
                    }
                    if (typeof parent.update_paradas !== "undefined") {
                        parent.updateParada(data);
                        nw.back();
                        return;
                    } else {

                        console.log("parent.arrayParadas", parent.arrayParadas);
                        console.log("parent.arrayParadas.length", parent.arrayParadas.length);
                        console.log("parent.markersParadas", parent.markersParadas);
                        console.log("parent.markersParadas.length", parent.markersParadas.length);

                        data.index_arrayParadas = parent.arrayParadas.length;
                        data.index_markersParadas = parent.markersParadas.length;

                        console.log("data", data);
                        parent.navTable.addRow(data);

                        parent.arrayParadas.push(data);
//                        parent.arrayParadas[data.index_arrayParadas] = data;

                        var marker = new nwgeo.addMarker();
                        marker.map = parent.map;
                        marker.latitude = data.latitud;
                        marker.longitude = data.longitud;
                        marker.label = "";
                        marker.icon = config.domain_rpc + '/lib_mobile/driver/img/marker_v.png';
                        marker.draggable = false;
                        marker.animation = false;
                        var m = marker.show(function () {});
                        parent.markersParadas.push(m);
//                        parent.markersParadas[data.index_markersParadas] = m;

//                        parent.traeTarifas.continuarConPoliLyne();
                        parent.traeTarifas.evalueContinuarPoliLyne();

                    }
                    nw.back();
                }
            }
        ];
        self.show();
        var input = document.querySelector(self.canvas + ' .direccion');
        nwgeo.autocomplete(input, self.map, function (r) {
            var se = {};
            se.results = r.place;
            se.address = r.address;
            se.lat = r.place.geometry.location.lat();
            se.lng = r.place.geometry.location.lng();
            self.ui.latitud.setValue(se.lat);
            self.ui.longitud.setValue(se.lng);
//            self.setUbicOne(se);
        }, main.configCliente.paises_iso_relation_autocomplete_maps);
    },
    destruct: function () {
    },
    members: {
        canvas: function canvas(canvas) {
            this.canvas = canvas;
        }
    }
});