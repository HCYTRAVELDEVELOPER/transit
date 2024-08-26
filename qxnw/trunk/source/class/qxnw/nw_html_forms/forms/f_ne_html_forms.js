qx.Class.define("qxnw.nw_html_forms.forms.f_ne_html_forms", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        self.setColumnsFormNumber(0);
        this.setTitle(self.tr("Nuevo espacio HTML"));
        var fields = [
            {
                name: "id",
                type: "textField",
                label: self.tr("ID"),
                visible: false
            },
            {
                name: "nombre",
                type: "textField",
                label: self.tr("Nombre"),
                mode: "string"
            },
            {
                name: "html",
                type: "ckeditor",
                label: self.tr("Html")
            }
        ];
        self.setFields(fields);
        self.ui.cancel.addListener("execute", function(e) {
            self.close();
        });
        self.ui.accept.addListener("execute", function() {
            self.save();
        });
    },
    members: {
        save: function save() {
            var self = this;
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "html_forms");
            rpc.setAsync(true);
            var func = function(r) {
                self.accept();
            };
            rpc.exec("save", data, func);
        }
    }
});