qx.Class.define("transmovapp.forms.f_vehiculo_existente", {
    extend: qxnw.forms,
    construct: function (data) {
        var self = this;
        this.base(arguments);
        this.createBase();
        self.setGroupHeader(self.tr("Vincular vehículo existente a conductor"));
        self.setTitle(self.tr("Vincular vehículo existente a conductor"));
        self.data = data;
        var t = main.getConfiguracion();
        var fields = [
            {
                name: " ",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "id_usuario",
                label: self.tr("ID conductor"),
                type: "textField",
                visible: false,
                enabled: false
            },
            {
                name: "vehiculo_id",
                caption: "vehiculo_id",
                label: self.tr("Buscar vehículo por placa"),
                type: "selectTokenField",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }
        ];
        self.setFields(fields);

        console.log("self.data", self.data);
        self.ui.id_usuario.setValue(self.data.id.toString());

        self.ui.vehiculo_id.addListener("loadData", function (e) {
            var data = {};
            data.token = e.getData();
            data.id_usuario = self.data.id;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.vehiculo_id.setModelData(r);
            };
            rpc.exec("populateTokenVehiculos", data, func);
        }, this);

        self.ui.vehiculo_id.addListener("addItem", function (e) {
            var item = self.getRecord();
            console.log("item", item);
        }, this);

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

    },
    destruct: function () {
    },
    members: {
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            console.log("data", data);
            var rpc = new qxnw.rpc(this.rpcUrl, "servicios_admin");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("r", r);
                self.accept(r);
            };
            rpc.exec("vincularVehiculoExisteConductor", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            return true;
        }
    }
});
