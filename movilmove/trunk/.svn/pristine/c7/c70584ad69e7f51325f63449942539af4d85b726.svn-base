qx.Class.define("transmovapp.forms.f_mapa_conductores", {
    extend: qxnw.forms,
    properties: {
        position: {
            init: null,
            check: "Object"
        }
    },
    construct: function (dta) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.position = true;
        self.__marker = [];
        self.setGroupHeader("Mapa conductores");
        var fields = [
            {
                name: self.tr("Ciudad origen"),
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "ciudades",
                label: self.tr("<strong>Elegir:</strong>"),
                type: "selectBox",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        this.setFields(fields);

    },
    destruct: function () {
    },
    members: {navTable: null,
    }
});
