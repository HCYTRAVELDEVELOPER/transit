nw.Class.define("f_pedirDataAirpot", {
    extend: nw.lists,
    construct: function (self, callback) {
        var d = new nw.forms();
        d.id = "dataAirpot";
        d.html = "<h1 style='text-align:center;'>" + nw.utils.tr("Ingrese datos del servicio") + "</h1><br />";
        d.showBack = true;
        self.data_aeropuerto_servicio = false;
        d.createBase();
        var fields = [
            {
                name: "num_maletas",
                label: "No Maletas",
                type: "numeric",
                required: true
            },
            {
                name: "num_personas",
                label: "No Personas",
                type: "numeric",
                required: true
            },
            {
                name: "vuelo_numero",
                label: "Vuelo número (opcional)",
                type: "textField",
                required: false
            },
            {
                name: "centro_costos",
                label: "Centro costos",
                type: "textField"
            }
        ];
        d.setFields(fields);
        d.buttons = [
            {
                style: "text-shadow: none;font-weight: lighter;border: 0;",
                className: "btn_maxwidth",
                name: "save_data_airpot",
                label: "Guardar",
                callback: function () {
                    if (!d.validate()) {
                        return false;
                    }
                    self.__datAirpot = d;
                    var data = d.getRecord();
                    self.data_aeropuerto_servicio = data;
                    nw.home();
                    callback(data);
                }
            }
        ];
        d.show();
    },
    destruct: function () {
    },
    members: {
    }
});