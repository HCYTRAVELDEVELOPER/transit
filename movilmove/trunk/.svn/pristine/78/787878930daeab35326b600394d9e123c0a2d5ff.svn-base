nw.Class.define("f_favoritos", {
    extend: nw.forms,
    construct: function (callback) {
        var self = this;
        self.id = "f_favoritos";
        self.setTitle = "<span style='color:#fff;'>Ubicaciones</span>";
        self.html = "Crear / editar lugar";
        self.showBack = true;
        self.closeBack = false;
        self.textClose = "Volver";
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
        self.transition = "slide";
        self.createBase();
        self.callback = callback;
        self.results = "";
        self.orden = "100";
        self.tipo = "favorite";
        self.event = new Event('loadApply');

        var fields = [
            {
                name: "id",
                label: "ID",
                placeholder: 'id',
                type: "textField",
                required: false,
                visible: false
            },
            {
                name: "nombre",
                label: "Personalizar nombre de lugar",
                placeholder: 'Personalizar nombre de lugar',
                type: "textField",
                required: true,
                visible: true
            },
            {
                name: "direccion",
                label: "Dirección",
                placeholder: 'Dirección',
                type: "textField",
                required: true,
                enabled: true,
                visible: true
            }
        ];
        self.setFields(fields);

        self.buttons = [
            {
                style: "border: 0;background-color:#ffffff;color:#f18107;margin:0px;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "#f18107",
//                position: "top",
                name: "aceptar",
                label: "Guardar",
                callback: function () {
                    self.save();
                }
            }
        ];

        self.show();

        var input = document.querySelector('.direccion');
        nwgeo.autocomplete(input, false, function (r) {
            var d = {
                "lat": r.place.geometry.location.lat(),
                "lng": r.place.geometry.location.lng(),
                "name": r.place.name,
                "icon": r.place.icon,
                "name_place": r.place.name,
                "ciudad": r.results.ciudad
            };
            if (self.tipo === "favorite") {
                self.ui.nombre.setVisibility(true);
                self.ui.nombre.setValue(r.place.name);
            }
            d.type = r.results.type;
            console.log("dataresult", r);
            console.log(d);
            console.log(self.tipo);
            self.results = JSON.stringify(d);
//            self.results = JSON.stringify(r);
        }, main.configCliente.paises_iso_relation_autocomplete_maps);

    },
    destruct: function () {
    },
    members: {
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return false;
            }
            var up = nw.userPolicies.getUserData();
            var data = self.getRecord(true);
            data.usuario = up.usuario;
            data.empresa = up.empresa;
            if (nw.evalueData(self.results)) {
                data.results = self.results;
            }
            data.orden = self.orden;
            data.tipo = self.tipo;
            console.log(data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "servicios");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("save", r);
                if (r === true) {
//                    document.dispatchEvent(self.event);
//                    self.reject();
                    nw.back();
                    console.log("self.callback", self.callback);
                    if (nw.evalueData(self.callback)) {
                        self.callback();
                    }
//                    if (self.callback != false) {
//                        var d = new l_navtable_favoritos();
//                        d.construct();
//                    } else {
//                        nw.loadHome();
//                    }
                    return true;
                }
                nw.dialog(r);
            };
            rpc.exec("savePreferidos", data, func);
        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});