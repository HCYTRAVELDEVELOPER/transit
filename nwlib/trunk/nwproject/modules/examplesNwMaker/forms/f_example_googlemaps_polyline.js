function f_example_googlemaps_polyline(pr) {
    var self = createDocument(".f_example_googlemaps_polyline");
    var thisDoc = this;
    thisDoc.constructor = constructor;
    thisDoc.self = self;
    function constructor(r) {

        selfAddress = self;

        var fields = [
            {
                tipo: 'textField',
                nombre: 'Ciudad',
                name: 'ciudad',
                requerido: "SI",
                visible: false
            },
            {
                title: "Grupo Uno",
                mode: "horizontal",
                name_group: "grupo_uno",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'textField',
                nombre: 'Digite la dirección',
                name: 'address',
                texto_ayuda: 'Calle 147',
                requerido: "SI",
                autocomplete: false
            },
            {
                tipo: 'textField',
                nombre: 'Latitud',
                name: 'latitud',
                texto_ayuda: 'latitud',
                requerido: "SI",
                visible: false
            },
            {
                tipo: 'textField',
                nombre: 'Longitud',
                name: 'longitud',
                texto_ayuda: 'longitud',
                requerido: "SI",
                visible: false
            },
            {
                tipo: "endGroup"
            },
            {
                title: "Grupo Dos",
                mode: "horizontal",
                name_group: "grupo_dos",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'textField',
                nombre: 'Digite la dirección',
                name: 'address_dos',
                texto_ayuda: 'Calle 147',
                requerido: "SI",
                autocomplete: false
            },
            {
                tipo: 'textField',
                nombre: 'Latitud',
                name: 'latitud_dos',
                texto_ayuda: 'latitud',
                requerido: "SI",
                visible: false
            },
            {
                tipo: 'textField',
                nombre: 'Longitud',
                name: 'longitud_dos',
                texto_ayuda: 'longitud',
                requerido: "SI",
                visible: false
            },
            {
                tipo: "endGroup"
            },
            {
                title: "Botones",
                mode: "horizontal",
                name_group: "grupo_botones",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'button',
                nombre: 'Buscar datos',
                name: 'buscar_datos'
            },
            {
                tipo: "endGroup"
            },
            {
                title: "Resultado de datos",
                mode: "horizontal",
                name_group: "grupo_result",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'label',
                nombre: 'Resultado',
                name: 'resultado'
            },
            {
                tipo: "endGroup"
            }
        ];

        var typ = "popUp";
        createNwForms(self, fields, typ);

        var html = "<h3>Traza una línea entre dos puntos por la mejor ruta</h3>";
        addHeaderNote(self, html);

        setColumnsFormNumber(self, 3);

        setWidth(self, 800);

        setValue(self, "address", "Calle 147 # 94c-45");
        setValue(self, "latitud", "4.742442");
        setValue(self, "longitud", "-74.0866757");

        setValue(self, "address_dos", "Calle 79 # 14-59");
        setValue(self, "latitud_dos", "4.665155899999999");
        setValue(self, "longitud_dos", "-74.05745339999999");

        var foot = "<div  class='mapa2'></div>";
        addFooterNote(self, foot);

        $(self + " .contain_input_name_address").keyup(function () {
            var map = thisDoc.map;
            ubicaDirEnMapa(self, map);
        });
        $(self + " .contain_input_name_address_dos").keyup(function () {
            var map = thisDoc.map;
            ubicaDirEnMapaDos(self, map);
        });

        createMap();
        setTimeout(function () {
            createMap();
        }, 1000);

        function createMap() {
            var self = thisDoc.self;
            getPositionGPS(function (gps) {
                if (gps == "singps") {
                    console.log("Sin permisos para el GPS f");
                    nw_dialog("Error en la configuración. Debe contar con un certificado de seguridad SSL para usar el GPS. Revise la configuración del mapa.");
                }

                setValue(self, "address", gps.direccion);
                setValue(self, "latitud", gps.lat);
                setValue(self, "longitud", gps.lng);
                setValue(self, "ciudad", gps.ciudad);

                thisDoc.map = createGoogleMap(gps.lat, gps.lng, "100%", "300px", ".mapa2");
                var map = thisDoc.map;

                thisDoc.address = addPointInGoogleMap(map, gps.lat, gps.lng);
                var marker1 = addPointInGoogleMap(map, gps.lat, gps.lng);

                dragMarkerMap(map, marker1, function (g) {
                    setValue(self, "address", g["direccion"]);
                    setValue(self, "latitud", g["lat"]);
                    setValue(self, "longitud", g["lng"]);
                });

            });
        }

        function ubicaDirEnMapa(self, map) {
            var data = getRecordNwForm(self);
            if (data["address"] == "") {
                return;
            }
            var address = data["ciudad"] + " " + data["address"];
            ubicaEnMapaGoogle(address, map, "getLatAndLong", self, self + " .contain_input_name_address");
        }

        function ubicaDirEnMapaDos(self, map) {
            var data = getRecordNwForm(self);
            if (data["address_dos"] == "") {
                return;
            }
            var address = data["ciudad"] + " " + data["address_dos"];
            ubicaEnMapaGoogle(address, map, "getLatAndLongDos", self, self + " .contain_input_name_address_dos");
        }

        var btn = selfButton(self, "buscar_datos");
        btn.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);

            var lat = data["latitud"];
            var long = data["longitud"];
            var lat2 = data["latitud_dos"];
            var long2 = data["longitud_dos"];
            directionsService(lat, long, lat2, long2, function (result) {
                var map = thisDoc.map;
                var val = "";
                if (result == "sin resultados") {
                    var params = {
                        html: "Sin resultados..."
                    };
                    createDialogNw(params);
                    return;
                }
                val += "travelMode: " + result.request.travelMode;
                for (var n = 0; n < result.routes.length; n++) {
                    var rut = result.routes[n];

                    val += " ||  Rutas: " + rut.legs.length;
                    var m = rut.legs;

                    removeAllPolyLines();
                    removeAllMakersMap();

                    pintarRutaGoogleMap(map, false, rut.overview_polyline);

                    for (var i = 0; i < m.length; i++) {
                        var km = m[i].distance["value"];
                        var km_text = m[i].distance["text"];
                        var duration = m[i].duration["value"];
                        var duration_text = m[i].duration["text"];
                        var start_address = result.routes[n].legs[i].start_address;
                        var end_address = result.routes[n].legs[i].end_address;
                        val += " <div><strong>RUTA: " + rut.summary + "</strong>";
                        val += "<p>KM: " + km_text + " en metros: " + km + "</p>";
                        val += "<p>DURACIÓN: " + duration_text + " en segundos: " + duration + "</p>";
                        val += "<p>start_address: " + start_address + "</p>";
                        val += "<p>end_address: " + end_address + "</p>";
                        val += "<div style='color:blue;cursor:pointer;text-decoration:underline;'>Pintar ruta</div>";
                        val += "</div>";
                    }
                }
                var marker1 = addMarkerMap(map, parseFloat(lat), parseFloat(long));
                var marker2 = addMarkerMap(map, parseFloat(lat2), parseFloat(long2));
                centerMarkersInMap(map, marker1, marker2);

                dragMarkerMap(map, marker1, function (g) {
                    setValue(self, "address", g["direccion"]);
                    setValue(self, "latitud", g["lat"]);
                    setValue(self, "longitud", g["lng"]);
                });

                dragMarkerMap(map, marker2, function (g) {
                    setValue(self, "address_dos", g["direccion"]);
                    setValue(self, "latitud_dos", g["lat"]);
                    setValue(self, "longitud_dos", g["lng"]);
                });

                $(self + " #resultado").html(val);
            });
        });

        var cancel = addButtonNwForm("Volver", self);
        cancel.addClass("btn_forms");
        cancel.addClass("btn_izq");
        cancel.click(function () {
            reject(self);
        });

        addCss(self, ".contain_input_name_ciudad", {"width": "100%", "float": "none"});
        addCss(self, ".contain_input_name_resultado", {"width": "100%", "float": "none"});

        var html = "<h3>Código:</h3>";
        html += "<iframe scrolling='auto' class='framecode' src='/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_googlemaps_polyline.js' ></iframe>";
        addFooterNote(self, html);

    }
}
function getLatAndLong(data, self) {
    setValue(self, "latitud", data["latitud"]);
    setValue(self, "longitud", data["longitud"]);
}
function getLatAndLongDos(data, self) {
    setValue(self, "latitud_dos", data["latitud"]);
    setValue(self, "longitud_dos", data["longitud"]);
}
function changeDirectionMap(data) {
    $(selfAddress + " #address").val(data);
}