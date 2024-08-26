qx.Class.define("qxnw.nw_admin_db.forms.f_query", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("Nueva Tabla");
        var text = "<h3>New Query</h3>";
        self.addHeaderNote(text);
        self.orden_cargue = {};
        self.setGroupHeader("New Query");
        var fields = [
            {
                name: self.tr("Query"),
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "query",
                label: "",
                type: "textArea",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }];
        self.setFields(fields);
        self.createAutomaticButtons();
        self.ui.accept.addListener("execute", function () {
            self.clean();
        });
        self.ui.accept.set({
            label: "Ejecutar"
        });
        self.ui.cancel.set({
            label: "Limpiar"
        });
        self.ui.query.setFilter(/[^\\\|]/g);

    },
    members: {pr: null,
        box1: null,
        deleteButton: null,
        navTable: null,
        texto: null,
        clean: function clean() {
            var self = this;
            var col = self.getNumberOfNavTables();
            self.slotSave();
        }
        ,
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
        }
        ,
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            data.model = self.model;
            if (!self.validate()) {
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
            rpc.setAsync(true);
            var func = function (r) {
                if (qxnw.utils.evalue(r)) {
                    if (self.parent == null) {
                        self.parent = new qxnw.navtable(self);
                        self.parent.setContextMenu("contextMenu");
                        self.insertNavTable(self.parent.getBase(), "Result");
                    }
                    var columns = [];
                    var column = {};
                    for (var v in r[0]) {
                        var upper = new qx.type.BaseString(v);
                        column = {
                            label: upper.toUpperCase(),
                            caption: v
                        };
                        columns.push(column);
                    }
                    self.parent.setColumns(columns);
                    self.parent.setModelData(r);
                } else {
                    if (self.parent == null) {

                    }
                }

            };
            rpc.exec("executeQuery", data, func);
        }
    }
});