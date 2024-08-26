qx.Class.define("qxnw.nw_email_list.forms.f_email", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setTitle("Agregar Email");
        this.createBase();
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                caption: "nombre",
                type: "textField"
            },
            {
                name: "email",
                label: self.tr("Email"),
                caption: "email",
                type: "textField",
                required: true
            }
        ];

        self.setFields(fields);
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "email");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept();
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            return true;
        }
    }
});