nw.Class.define("f_reprograma", {
    extend: nw.forms,
    construct: function (selfparent, data) {
        var self = this;
        var up = nw.userPolicies.getUserData();
        self.id = "f_reprograma";
        self.setTitle = "Reprogramar";
        self.showBack = true;
        self.closeBack = false;
        self.createBase();

        self.parent = selfparent;
        self.data = data;

        console.log("self.data", self.data);
        var fields = [
            {
                label: "",
                name: 'detalle_repro',
                type: "startGroup"
            },
            {
                styleContainer: '',
                style: '',
                type: 'dateField',
                label: 'Fecha',
                required: true,
                placeholder: 'Fecha',
                visible_label: false,
                name: 'fecha'
            },
            {
                styleContainer: '',
                style: '',
                type: 'time',
                label: 'Hora',
                required: true,
                placeholder: 'Hora',
                visible_label: false,
                name: 'hora'
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(fields);
        self.buttons = [
            {
                style: "border: 0;background-color:#1abbd7;color:#fff;margin:0px;",
                icon: "material-icons check_circle normal",
                colorBtnBackIOS: "#fff",
                position: "bottom",
                name: "aceptar_detalle_servicio",
                label: "Aceptar",
                callback: function () {
                    if (!self.validate()) {
                        return;
                    }
                    var hoy = nw.getActualDate();
                    var datos = {};
                    datos.empresa = up.empresa;
                    datos.perfil = up.perfil;
                    datos.usuario = up.usuario;
                    datos.nombre = up.nombre;
                    datos.id_servicio_edit = data.id;
                    datos.fecha = self.ui.fecha.getValue();
                    datos.hora = self.ui.hora.getValue();
                    datos.tipo = "user";
                    if (nw.evalueData(self.data.conductor_usuario) && self.data.conductor_usuario !== "Sin asignar") {
                        datos.conductor_usuario = self.data.conductor_usuario;
                    }
//                        var fecha = new Date();
                    var fecha = hoy;
//                        var fechaeligi = new Date(datos.fecha);
                    console.log("hoy", hoy);
                    console.log("datos.fecha", datos.fecha);
                    var fechaeligi = datos.fecha;
                    if (fecha > fechaeligi) {
                        nw.dialog("La fecha no puede menor a la actual");
                        return;
                    }
                    console.log("datos", datos);
                    console.log("self.data", self.data);
                    var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
                    rpc.setAsync(true);
                    rpc.setLoading(true);
                    var func = function (ra) {
                        console.log("ra", ra);
                        nw.back();
                        nw.dialog("Se ha reprogramado correctamente.");
                        self.parent.applyFilters();
                    };
                    rpc.exec("updateServiceFecha", datos, func);
                }
            }
        ];
        self.show();
        self.ui.fecha.setValue(self.data.fecha);
        self.ui.hora.setValue(self.data.hora);
    },
    destruct: function () {
    },
    members: {
    }
});