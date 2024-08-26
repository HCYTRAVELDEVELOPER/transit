qx.Class.define("transmovapp.forms.f_paradas_adicionales", {
    extend: qxnw.forms,
    construct: function (callbackOnAdd, data_parent) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader("Agregar/editar pasajero, parada");
        self.setTitle("Agregar/editar pasajero, parada");
        self.callbackOnAdd = callbackOnAdd;
        self.dataParent = data_parent;
        var fields = [
            {
                name: "Infomación",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "id",
                caption: "id",
                label: "ID",
                type: "textField",
                required: true
            },
            {
                name: "nombre_pasajero",
                caption: "nombre_pasajero",
                label: "Nombre pasajero",
                type: "textField",
                required: true
            },
            {
                name: "direccion",
                caption: "direccion",
                label: "Dirección",
                type: "textField",
                required: true
            },
            {
                name: "correo",
                caption: "correo",
                label: "Correo",
                type: "textField",
                required: false
            },
            {
                name: "telefono",
                caption: "telefono",
                label: "Teléfono",
                type: "textField",
                required: false
            },
            {
                name: "usuario_pasajero",
                caption: "usuario_pasajero",
                label: "Usuario app",
                type: "textField",
                required: false
            },
//            {
//                name: "abordo",
//                caption: "abordo",
//                label: "Abordó",
//                type: "selectBox",
//                required: true
//            },
            {
                name: "estado",
                caption: "estado",
                label: "Estado",
                type: "selectBox",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "token_usuario",
                caption: "token_usuario",
                label: "Token app",
                type: "textField",
                required: false
            }
        ];
        self.setFields(fields);

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.addListener("appear", function () {

        });

//        var data = {};
//        data["NO"] = "NO";
//        data["SI"] = "SI";
//        qxnw.utils.populateSelectFromArray(self.ui.abordo, data);
//        self.ui.abordo.setValue("NO");

        var data = {};
        data["SOLICITUD"] = "SOLICITUD";
        data["CONFIRMADO"] = "CONFIRMADO";
        data["ENTREGADO"] = "ENTREGADO";
        data["CANCELADO_POR_CLIENTE"] = "CANCELADO POR CLIENTE";
        data["NOVEDAD"] = "NOVEDAD";
        data["REPARTO"] = "REPARTO";
        data["REPARTO_DETENIDO"] = "REPARTO DETENIDO";
        data["NO_ABORDO"] = "NO ABORDÓ";
        qxnw.utils.populateSelectFromArray(self.ui.estado, data);

//        self.ui.abordo.addListener("changeSelection", function (e) {
//            var data = this.getValue();
//            console.log("data", data);
//            if (data.abordo == "NO") {
//                self.ui.estado.setValue("NOVEDAD");
//            } else {
//                self.ui.estado.setValue("ENTREGADO");
//            }
//        });


    },
    destruct: function () {
    },
    members: {
        slotSave: function slotSave() {
            var self = this;
            var data = self.getRecord();
            data.id_servicio = self.dataAll.id_servicio;
            console.log("data", data);
            console.log("self.dataAll", self.dataAll);
            var rpc = new qxnw.rpc(self.rpcUrl, "servicios_admin");
            rpc.setAsync(true);
            var func = function (res) {
                console.log("f_parada_adicional:::responseServer:::res", res);
                self.accept();
//                self.reject();

                main.registerServiceInFirebase(self.dataAll.id_servicio);

            };
            rpc.exec("saveParadasAdicionales", data, func);
        },
        setParamRecord: function setParamRecord(p) {
            var self = this;
            console.log("p", p);
            self.dataAll = p;
            self.setRecord(p);
//            if (!qxnw.utils.evalueData(p.abordo)) {
//                self.ui.abordo.setValue("NO");
//            }
            return true;
        }
    }
});
