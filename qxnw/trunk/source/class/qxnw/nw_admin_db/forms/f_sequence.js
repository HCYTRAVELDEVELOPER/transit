qx.Class.define("qxnw.nw_admin_db.forms.f_sequence", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("Sequence");
        self.orden_cargue = {};
        self.setGroupHeader("Sequence");
        var fields = [
            {
                name: "Query",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "nombre",
                label: "Sequence",
                type: "textField",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "next_value",
                label: "Next Value",
                type: "textField",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "start_value",
                label: "Start Value",
                type: "textField",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "increment",
                label: "Increment",
                type: "textField",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "minimum_value",
                label: "Min Value",
                type: "textField",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "maximum_value",
                label: "Max Value",
                type: "textField",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }];
        self.setFields(fields);
        self.ui.cancel.hide();
        self.ui.accept.set({
            label: "Ejecutar"
        });
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
//        qxnw.utils.populateSelectAsync(self.ui.owner, "nw_admin_tables", "populateOwner", 0);

    },
    members: {pr: null,
        box1: null,
        deleteButton: null,
        navTable: null,
        texto: null,
        slotValorTotal: function slotValorTotal() {
            var self = this;
            var total = 0;
            var inbound = self.ui.valor_inbound.getValue();
            var outbound = self.ui.valor_outbound.getValue();
            var gd = self.ui.gastos_liberacion.getValue();
            var fd = self.ui.fee_damco.getValue();
            var os = self.ui.otros_servicios.getValue();
            var vt = self.ui.valor_transporte.getValue();
            if (self.pr.via == "2" || self.pr.via == "4") {
                total = parseFloat(inbound) + parseFloat(outbound) + parseFloat(gd) + parseFloat(os);
                self.ui.valor_fac.setValue(total);
            }
            if (self.pr.via == "1" || self.pr.via == "3") {
                total = parseFloat(gd) + parseFloat(fd) + parseFloat(vt) + parseFloat(os);
                self.ui.valor_fac.setValue(total);
            }
        },
        setParamRecord: function setParamRecord(data) {
            var self = this;
            if (data.driver == "pgsql") {
                self.setRecord(data);
                var func = function (r) {
                    self.ui.next_value.setValue(r);
                       self.ui.nombre.setEnabled(false);
                       self.ui.maximum_value.setEnabled(false);
                       self.ui.minimum_value.setEnabled(false);
                };
                qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "populateNextvalue", data, func);
            }
            if (data.driver == "mysql") {
                var func = function (r) {
                    r.nombre = data.nombre;
                    r.next_value = r.Cardinality;
                    r.start_value = 1;
                    r.increment = r.Seq_in_index;
                    r.minimum_value = 1;
                    r.maximum_value = 88846791;
                    self.setRecord(r);
                    self.ui.start_value.setEnabled(false);
                    self.ui.increment.setEnabled(false);
                    self.ui.minimum_value.setEnabled(false);
                    self.ui.maximum_value.setEnabled(false);
                    self.ui.nombre.setEnabled(false);
                };
                qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "populateIndex", data, func);
            }
        },
        slotSave: function slotSave() {
            var self = this;
            var col = self.getNumberOfNavTables();
            if (col > 0) {
                self.destroyNavTable(0);
            }
            self.navTable_table = new qxnw.navtable(self);
            self.navTable_table.setContextMenu("contextMenu");
            self.navTable_table.createBase();
            var data = this.getRecord();
            if (!self.validate()) {
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
            rpc.setAsync(true);
            var func = function (r) {
                qxnw.utils.information("Sequencia Actualizada");
            };
            rpc.exec("populateFieldsBySequence", data, func);
        }
    }
});