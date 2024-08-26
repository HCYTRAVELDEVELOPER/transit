qx.Class.define("qxnw.tmp.ckeditor", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        self.setColumnsFormNumber(0);
        this.setTitle(self.tr("CKEditor test"));

        var fields = [
            {
                name: "name",
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
            
        });
    }
});