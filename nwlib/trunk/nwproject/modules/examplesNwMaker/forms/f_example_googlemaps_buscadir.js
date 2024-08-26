function f_example_googlemaps_buscadir(pr) {
    var self = createDocument(".f_example_buscadiringooglemaps");
    if (pr != undefined) {
        if (pr != "popup") {
            self = pr;
        }
    }
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    function constructor(r) {

        selfAddress = self;

        var fields = [
            {
                tipo: 'selectBox',
                nombre: 'Ciudad',
                name: 'ciudad',
                requerido: "SI",
                visible: true
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
                visible: true
            },
            {
                tipo: 'textField',
                nombre: 'Longitud',
                name: 'longitud',
                texto_ayuda: 'longitud',
                requerido: "SI",
                visible: true
            }
        ];

        var typ = "popUp";
        if (typeof pr != "undefined") {
            typ = "nopopUp";
        }
        createNwForms(self, fields, typ);

        var html = "Mensaje para developers: Este widget le devuelve la nueva dirección a una función que debe crear con el nombre de changeDirectionMap y recibe los datos, ej: changeDirectionMap(data) ";
        addHeaderNote(self, html);

        var data = {};
        data["Bogotá"] = "Bogotá";
        data["Cali"] = "Cali";
        data["Medellín"] = "Medellin";
        populateSelectFromArray("ciudad", data);

        setColumnsFormNumber(self, 4);

//        setMaxWidth(self, 800);
        setWidth(self, 800);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MAPA///////////////////////////////////
        var foot = "<div  class='mapa2'></div>";
        addFooterNote(self, foot);
        var gps = getUbicGeoUser();

        setTimeout(function () {
            var gps = getUbicGeoUser();
            var latInit = gps["lat"];
            var lngInit = gps["lng"];

            var map = createGoogleMap(latInit, lngInit, "100%", "300px", ".mapa2", 16);
            var marker1 = addPointInGoogleMap(map, latInit, lngInit);
//            centerMarkersInMap(map, marker1);
            var btn = selfButton(self, "buscar");
            btn.click(function () {
                ubicaDirEnMapa(self);
            });
            setContainerGeoSuggestions(".contain_input_name_address");
            $(".contain_input_name_address").keyup(function () {
                ubicaDirEnMapa(self, map);
            });
        }, 1000);

        var gps = getUbicGeoUser();
        var latInit = gps["lat"];
        var lngInit = gps["lng"];

        var map = createGoogleMap(latInit, lngInit, "100%", "300px", ".mapa2", 16);
        var marker1 = addPointInGoogleMap(map, latInit, lngInit);
//        centerMarkersInMap(map, marker1);

        setContainerGeoSuggestions(self + " .contain_input_name_address");
        $(self + " .contain_input_name_address").keyup(function () {
            ubicaDirEnMapa(self, map);
        });



        function ubicaDirEnMapa(self, map) {
            var data = getRecordNwForm(self);
            if (data["address"] == "") {
                return;
            }
            var address = data["ciudad"] + " " + data["address"];
            ubicaEnMapaGoogle(address, map, "getLatAndLong", self);
        }


        var cancel = addButtonNwForm("Volver", self);
        cancel.addClass("btn_forms");
        cancel.addClass("btnGray");
        cancel.addClass("btn_izq");
        cancel.click(function () {
            reject(self);
        });

        var html = "<h3>Código:</h3>";
        html += "<iframe scrolling='auto' class='framecode' src='/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_googlemaps_buscadir.js' ></iframe>";
        addFooterNote(self, html);

    }
}
function getLatAndLong(data, self) {
    setValue(self, "latitud", data["latitud"]);
    setValue(self, "longitud", data["longitud"]);
    $(self + " .btnOrange").removeClass("btnDisabled");
}
function changeDirectionMap(data) {
    $(selfAddress + " #address").val(data);
}