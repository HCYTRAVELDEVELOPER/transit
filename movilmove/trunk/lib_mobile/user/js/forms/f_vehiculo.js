nw.Class.define("f_vehiculo", {
    extend: nw.forms,
    construct: function (callback) {
        var self = this;
        self.id = "f_vehiculo";
        self.setTitle = "<span style='color:#fff;'>"+nw.tr("Vehículo")+"</span>";
        self.html = nw.tr("Crear / editar vehículo");
        self.showBack = true;
        self.closeBack = false;
        self.colorBtnBackIOS = "#ffffff;";
        self.styleCloseIOS = "color:#ffffff;color: rgb(255, 255, 255);background-color: transparent;border: 0;box-shadow:none;";
        self.createBase();
        self.callback = callback;

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
                name: "imagen_vehi",
                label: "Foto",
                placeholder: 'Foto',
                type: "uploader",
                required: false,
                visible: true
            },
            {
                name: "placa",
                label: "Placa",
                placeholder: 'Placa',
                type: "textField",
                required: true,
                visible: true
            },
            {
                name: "marca_text",
                label: "Marca",
                placeholder: 'Marca',
                type: "textField",
                required: true,
                visible: true
            },
            {
                name: "modelo",
                label: "Modelo",
                placeholder: 'Modelo',
                type: "textField",
                required: true,
                visible: true
            },
            {
                name: "color",
                label: "Color",
                placeholder: 'Color',
                type: "textField",
                required: true,
                visible: true
            },
            {
                name: "fecha_vencimiento_soat",
                label: "Fecha vencimiento SOAT",
                placeholder: 'Fecha vencimiento SOAT',
                type: "dateField",
                required: true,
                visible: true
            }
        ];
        self.setFields(fields);

        self.buttons = [
            {
                style: "border: 0;background-color:#ffffff;color:#f18107;margin:0px;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "#f18107",
                position: "top",
                name: "aceptar",
                label: "Guardar",
                callback: function () {
                    self.save();
                }
            }
        ];

        self.show();

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
            data.usuario_text = up.nombre;
            data.id_usuario = up.id_usuario;
            console.log(data);
            var rpc = new nw.rpc(nw.getRpcUrl(), "vehiculo");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("save", r);
                if (r === true) {
                    self.reject();
                    nw.dialog("Vehículo guardado correctamente");
                    if (nw.evalueData(self.callback)) {
                        self.callback();
                    } else {
                        nw.home();
                    }
                    return true;
                }
                nw.dialog(r);
            };
            rpc.exec("save", data, func);

        },
        populate: function populate(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }
});