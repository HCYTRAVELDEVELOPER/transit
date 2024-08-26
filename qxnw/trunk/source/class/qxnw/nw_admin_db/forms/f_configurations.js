qx.Class.define("qxnw.nw_admin_db.forms.f_configurations", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("Configuraciones de Administrador de Base de datos");
        var text = "<h3>Configuraciones de Administrador de Base de datos</h3>";
        self.addHeaderNote(text);
        self.orden_cargue = {};
        self.setGroupHeader("Configuraciones de Administrador de Base de Datos");
        var fields = [
            {
                name: "",
                type: "startGroup",
                icon: qxnw.config.execIcon("system-run"),
                mode: "vertical"
            },
            {
                name: "view_compilation",
                label: self.tr("Ver compilación de codigo antes de ejecutar"),
                type: "checkBox"
            },
            {
                name: "backup",
                label: self.tr("Backup .tar/.sql"),
                type: "checkBox"
            }
        ];
        self.setFields(fields);
//        var f = new qxnw.nw_admin_db.forms.f_new_table();
//        self.insertWidget(f, self.tr("Permisos"));
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        var funcs = function (r) {
            self.setRecord(r);
        };
        qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "populateConfigurations", 0, funcs);
    },
    members: {pr: null,
        box1: null,
        deleteButton: null,
        navTable: null,
        texto: null,
        slotSave: function slotSave() {
            var self = this;
            var data = self.getRecord();
            if (!self.validate()) {
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept();
            };
            rpc.exec("save_configurations", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;

            return true;
        }
    }
});