qx.Class.define("nwsites.forms.f_pedido_rechazar", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Observación Rechazo Pedido");
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "observaciones",
                label: "Observaciones",
                caption: "observaciones",
                type: "textArea",
                required: true
            },
            {
                name: "estado",
                label: "Estado",
                caption: "estado",
                type: "textField",
                required: true,
                visible: false
            }

        ];
        self.setFields(fields);
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        var button = [
        ];

        self.addButtons(button);
    },
    destruct: function () {
    },
    members: {
        pr: null,
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "pv_nwsites");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept();
            }
            rpc.exec("savePedidosRechazar", data, func);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var data = self.getRecord();
            var r = self.navTable.selectedRecord();
            r["repuestos_usados"] = data.id;
            r["repuestos_usados_text"] = data.nombre;
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new repuestos_usados.forms.f_pqr();
            if (!d.setParamRecordEditar(r)) {
                return;
            }
            d.settings.accept = function () {
                self.navTable.removeSelectedRow();
                var r = d.getRecord();
                self.navTable.addRows([r]);
            };
            d.show();
        },
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            return true;
        }
    }
});
