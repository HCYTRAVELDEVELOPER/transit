qx.Class.define("qxnw.nw_admin_db.forms.f_server", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("Nueva Conexión");
        self.setGroupHeader("Nueva Conexión");
        var fields = [
            {
                name: "Configuración de servidores",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "vertical"
            },
            {
                label: self.tr("Driver"),
                name: "driver",
                type: "selectBox",
                required: true
            },
            {
                label: self.tr("Nombre"),
                name: "nombre",
                type: "textField",
                required: true
            },
            {
                label: self.tr("Host"),
                name: "host",
                type: "textField",
                required: true
            },
            {
                label: self.tr("User Name"),
                name: "user_name",
                type: "textField",
                required: true
            },
            {
                label: self.tr("Password"),
                name: "password",
                type: "passwordField",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }];
        self.setFields(fields);
        self.ui.accept.addListener("execute", function () {
            if (!self.validate()) {
                return false;
            }
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
//        var button = [
//            {
//                name: "test_conection",
//                label: "Probar Conexión",
//                type: "button"
//            }
//        ];
//        self.addButtons(button);
//        self.ui.test_conection.set({
//            icon: qxnw.config.execIcon("application-exit", "actions")
//        });
        qxnw.utils.populateSelectFromArray(self.ui.driver, {"": "Seleccione", "MYSQL": "MYSQL", "PGSQL": "PGSQL", "ORACLE": "ORACLE"});
//        self.ui.test_conection.addListener("execute", function () {
//            if (!self.validate()) {
//                return false;
//            }
//            self.testConection();
//        });
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
        testConection: function testConection() {
            var self = this;
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables", true);
            var funcs = function (s) {
                qxnw.utils.information("Conexión realizada");
                self.ui.accept.setEnabled(true);
            };
            rpc.exec("testConection", data, funcs);
        },
        slotSave: function slotSave() {
            var self = this;
            var data = self.getRecord();
            data.tipo = self.tipo;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables", true);
            var funcs = function (s) {
                self.accept();
            };
            rpc.exec("saveServers", data, funcs);
        }
    }
});