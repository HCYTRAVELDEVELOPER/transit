nw.Class.define("f_crear_parada", {
    extend: nw.forms,
    construct: function (parent, map) {
        var self = this;
        self.id = "f_crear_parada";
        self.setTitle = "<span style='color:#fff;'>Agregar parada</span>";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Atrás";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
        self.map = map;
        self.closeBackCallBack = function () {
            nw.back();
        };
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


        self.buttons = [
            {
//                style: "background-size:20px;box-shadow: none;border: 0;background-color: transparent;color: #ffffff;",
                style: "background-color: green;color: #ffffff;",
                icon: "material-icons how_to_reg normal",
//                colorBtnBackIOS: "#ffffff",
//                position: "top",
                position: "bottom",
                name: "aceptar",
                label: "Guardar",
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
                    console.log("parent", parent);
                    console.log("data", data);
                    console.log("typeof main.selfMapaDriver", typeof main.selfMapaDriver);
                    console.log("document.querySelector(.btn_more_info_intravel)", document.querySelector(".btn_more_info_intravel"));

                    if (typeof parent.guardar_paradas !== "undefined") {
                        parent.saveParada(data, function () {
                            if (document.querySelector(".btn_more_info_intravel") && typeof main.selfMapaDriver != "undefined") {
                                main.selfMapaDriver.resetParadasAdicionales();
                            }
                        });
                        nw.back();
                    } else
                    if (typeof parent.update_paradas !== "undefined") {
                        parent.updateParada(data);
                        nw.back();
                    } else {
                        parent.navTable.addRow(data);

                        parent.arrayParadas.push(data);

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

//                        parent.traeTarifas.continuarConPoliLyne();
                        parent.traeTarifas.evalueContinuarPoliLyne();

//                        parent.mostrarServicios(false, 'undefined', 'undefined', true);
                        nw.back();
                    }
                }
            }
        ];
        self.show();

        if (main.configCliente.requerir_campos_paradas_apk === 'SI') {
            self.ui.nombre_pasajero.setRequired(true);
            self.ui.descripcion_carga.setRequired(true);
        }

//        var input = document.querySelector('#f_crear_parada .direccion');
        var input = document.querySelector(self.canvas + ' .direccion');
        console.log("input", input);
        console.log("self.canvas", self.canvas);
        nwgeo.autocomplete(input, self.map, function (r) {
            console.log("result.:::::::::::direction::::::::::", r);
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