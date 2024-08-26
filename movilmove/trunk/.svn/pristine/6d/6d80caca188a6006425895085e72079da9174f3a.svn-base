qx.Class.define("nwsites.forms.f_domicilios_clientes", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle("Confirmar Pedido");
        var fields = [
            {
                name: "DATOS GENERALES",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "id",
                label: "Pedido #",
                caption: "id",
                type: "textField",
                visible: true,
                enabled: false
            },
            {
                name: "costo_domicilio",
                label: "Costo Domicilio",
                type: "textField",
                enabled: false
            },
            {
                name: "valor_total",
                label: "Valor Total",
                type: "textField",
                enabled: false
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "DATOS CLIENTE",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "cliente_text",
                label: "Cliente",
                type: "textField",
                enabled: false
            },
            {
                name: "direccion",
                label: "Dirección",
                type: "textField",
                enabled: false
            },
            {
                name: "barrio",
                label: "Barrio",
                type: "textField",
                enabled: false
            },
            {
                name: "email",
                label: "Email",
                type: "textField",
                enabled: false
            },
            {
                name: "telefono",
                label: "Teléfono",
                type: "textField",
                enabled: false
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "DOMICILIO",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "horizontal"
            },
            {
                name: "duracion_pedido",
                label: "Duración del Pedido",
                caption: "duracion_pedido",
                type: "selectBox",
                visible: false
            },
            {
                name: "observaciones",
                label: "Observaciones",
                caption: "observaciones",
                type: "textArea",
                mode: "maxWidth",
                required: true,
                enabled: false
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(fields);
        self.iframe = self.addFrame("/nwlib6/modulos/domonline/vista_pedido_resumen.php", false);
        self.addListener("appear", function () {
            self.iframe.getContentElement().getDomElement().id = "topFrameDom";
        });
        self.iframe.addListener("appear", function () {
            setTimeout(function () {
                var id = self.ui.id.getValue().toString();
                var d = self.ui.costo_domicilio.getValue().toString();
                document.getElementById('topFrameDom').contentWindow.changeData(id, d);
            }, 1000);
        });
        var data = {};
        data[""] = "Todas";
        qxnw.utils.populateSelectFromArray(self.ui.duracion_pedido, data);
        data.table = "pv_tiempos_domicilio";
        qxnw.utils.populateSelect(self.ui.duracion_pedido, "master", "populate", data);
        self.ui.duracion_pedido.focus();
        self.ui.observaciones.setMaxHeight(50);
        var buttons = [
            {
                name: "rechazar",
                label: "Salir",
                icon: qxnw.config.execIcon("media-skip-forward")
            }
        ];
        self.addButtons(buttons);
        self.ui.rechazar.addListener("click", function () {
            self.reject();
        });
        self.ui.cancel.setVisibility("hidden");
        self.ui.accept.setVisibility("hidden");
    },
    destruct: function () {
    },
    members: {
        pr: null,
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
        },
        setParamRecordAtender: function setParamRecordAtender(data) {
            var self = this;
            var rpc = new qxnw.rpc(self.rpcUrl, "pv_nwsites");
            rpc.setAsync(true);
            var func = function (pr) {
                self.setRecord(pr[0]);
            };
            self.ui.duracion_pedido.focus();
            rpc.exec("consultaPedidoClientes", data, func);
            return true;
        }
    }
});
