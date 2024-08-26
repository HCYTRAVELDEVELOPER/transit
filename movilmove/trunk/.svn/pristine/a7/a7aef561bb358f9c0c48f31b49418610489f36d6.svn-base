nw.Class.define("f_2_createActionsInputsSearchDirections", {
    extend: nw.lists,
    construct: function (self) {
        if (self.debugConstruct) {
            console.log("%c<<<<DEBUG: START_LAUNCH:::::::::::::: f_2_createActionsInputsSearchDirections>>>>",
                    'background: #33A51F; color: #2B0902');
            console.log("START_LAUNCH:::::::::::::: f_2_createActionsInputsSearchDirections");
        }

        var otherOptions = {};
        otherOptions.strictBounds = false;


        var input = document.querySelector('.address');
        nwgeo.autocomplete(input, self.map, function (r) {
            if (nw.evalueData(r.results.type)) {
                if (r.results.type === "airport") {
                    self.__typeOriginOne = r.results.type;
                } else {
                    self.__typeOriginOne = false;
                }
            }
            var se = {};
            se.results = r.place;
            se.address = r.address;
            se.lat = r.place.geometry.location.lat();
            se.lng = r.place.geometry.location.lng();

            console.log("%c<<<<DEBUG: START_LAUNCH:::::::::::::: f_2_createActionsInputsSearchDirections>>>>",
                    'background: #33A51F; color: #2B0902');
            console.log("r", r);
            console.log("se", se);

            self.setUbicOne(se, r.results);

            self.activeNormalV = false;
            self.muestraAddressInit();

            if (self.configCliente.pedir_datos_viaje_airpot == "SI" && r.results.type == "airport") {
                self.pedirDataAirpot(function (e) {

                });
            }

        }, main.configCliente.paises_iso_relation_autocomplete_maps, otherOptions);

        var input = document.querySelector('.address_destino');
        nwgeo.autocomplete(input, self.map, function (r) {
            if (self.debugConstruct) {
                console.log("RESULT::::::f_2_createActionsInputsSearchDirections:::INPUT addres_destino:r", r);
            }
            console.log("self.configCliente.pedir_datos_viaje_airpot", self.configCliente.pedir_datos_viaje_airpot)
            if (self.configCliente.app_para == "CARGA") {
                self.formDatosCarga(function () {
                    self.pointMapDestino(r);
                });
            } else
//            if (self.configCliente.pedir_datos_viaje_airpot == "SI" && self.__typeOrigin == "airport") {
            if (self.configCliente.pedir_datos_viaje_airpot == "SI" && r.results.type == "airport") {
                self.pedirDataAirpot(function (e) {
                    self.pointMapDestino(r);
                });
            } else {
                self.pointMapDestino(r);
            }
            self.activeNormalV = true;
        }, main.configCliente.paises_iso_relation_autocomplete_maps, otherOptions);
    },
    destruct: function () {
    },
    members: {
    }
});