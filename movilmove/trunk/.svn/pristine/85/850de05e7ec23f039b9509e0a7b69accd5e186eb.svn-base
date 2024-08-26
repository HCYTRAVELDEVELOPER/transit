qx.Class.define("maestros.forms.f_tarifas", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle(self.tr("Nuevo/Editar tarifas (Edo Taximetro)"));
        var fields = [
            {
                name: "id",
                label: self.tr("Id"),
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "",
                type: "startGroup",
                icono: "",
                mode: "grid"
            },
            {
                name: "metros",
                label: self.tr("Metros"),
                type: "textField",
                row: 0,
                column: 0
            },
            {
                name: "tiempo",
                label: self.tr("Tiempo (segundos)"),
                type: "textField",
                row: 0,
                column: 1
            },
            {
                name: "valor_unidad_tiempo",
                label: self.tr("Valor unidad tiempo"),
                type: "textField",
                mode: "money",
                row: 0,
                column: 2
            },
            {
                name: "valor_unidad_metros",
                label: self.tr("Valor unidad metros"),
                type: "textField",
                mode: "money",
                row: 0,
                column: 3
            },
            {
                name: "valor_banderazo",
                label: self.tr("Valor banderazo"),
                type: "textField",
                mode: "money",
                row: 1,
                column: 0
            },
            {
                name: "iva",
                label: self.tr("Iva"),
                type: "textField",
                row: 1,
                column: 1
            },
            {
                name: "minima",
                label: self.tr("Tarifa Mínima"),
                type: "textField",
                mode: "money",
                row: 1,
                column: 2
            },
            {
                name: "tipo_servicio",
                label: self.tr("Tipo servicio"),
                type: "textField",
                row: 1,
                column: 3
            },
            {
                name: "valor_mascota",
                label: self.tr("Valor auxiliar"),
                type: "textField",
                mode: "money",
                row: 2,
                column: 0
            },
            {
                name: "icono",
                label: self.tr("Icono"),
                type: "uploader",
                row: 2,
                column: 1
            },
            {
                name: "minutosMinimosParaPedirService",
                label: self.tr("Minutos mínimos duración servicio"),
                type: "textField",
                row: 2,
                column: 2
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "grid"
            },
            {
                name: "solo_para_mujeres",
                label: self.tr("Solo para mujeres"),
                type: "selectBox",
                row: 0,
                column: 0
            },
            {
                name: "orden",
                label: self.tr("Orden"),
                type: "textField",
                row: 0,
                column: 1
            },
            {
                name: "pide_vehiculo_cliente",
                label: self.tr("Pide vehiculo cliente"),
                type: "selectBox",
                row: 0,
                column: 2
            },
            {
                name: "mostrar_fecha_hora",
                label: self.tr("Mostrar fecha hora"),
                type: "selectBox",
                row: 0,
                column: 3
            },
            {
                name: "minutos_agregar_a_fecha",
                label: self.tr("Minutos agregar a fecha"),
                type: "textField",
                row: 1,
                column: 0
            },
            {
                name: "descuento_maximo",
                label: self.tr("Descuento maximo"),
                type: "textField",
                row: 1,
                column: 1
            },
            {
                name: "reservar",
                label: self.tr("Reservar"),
                type: "selectBox",
                row: 1,
                column: 2
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                type: "textField",
                row: 1,
                column: 3
            },
            {
                name: "cargue",
                label: self.tr("Cargue"),
                type: "textField",
                row: 2,
                column: 0
            },
            {
                name: "descargue",
                label: self.tr("Descargue"),
                type: "textField",
                row: 2,
                column: 1
            },
            {
                name: "porcentaje_valor_declarado",
                label: self.tr("Porcentaje valor declarado"),
                type: "textField",
                row: 2,
                column: 2
            },
            {
                name: "retorno",
                label: self.tr("Retorno"),
                type: "textField",
                row: 2,
                column: 3
            },
            {
                name: "",
                type: "endGroup"
            }

        ];

        self.setFields(fields);
        self.ui.accept.addListener("execute", function () {
            self.slotSaveTarifas();
        });

        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        var data = {};
        data[""] = self.tr("Seleccione");
        data["SI"] = self.tr("Si");
        data["NO"] = self.tr("No");
        qxnw.utils.populateSelectFromArray(self.ui.solo_para_mujeres, data);
        qxnw.utils.populateSelectFromArray(self.ui.pide_vehiculo_cliente, data);
        qxnw.utils.populateSelectFromArray(self.ui.mostrar_fecha_hora, data);
        qxnw.utils.populateSelectFromArray(self.ui.reservar, data);
//        
//        self.setParamRecord();
    },
    destruct: function () {
    },
    members: {

        slotSaveTarifas: function slotSaveTarifas() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "configuracion_maestros", true);
            rpc.setAsync(true);
            var func = function () {
                self.accept();
            };
            rpc.exec("SaveTarifa", data, func);
        },

        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
        }
    }

});


