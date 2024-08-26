qx.Class.define("qxnw.examples.formCkeditor", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setColumnsFormNumber(2);
        var fields = [
            {
                name: "ckeditor",
                label: "textArea",
                type: "ckeditor"
            }
        ];
        self.setFields(fields);
        self.ui.ckeditor.setFilter(/[^\\\|]/g);
        self.ui.accept.addListener("execute", function () {
            console.log(self.getRecord());
        });
    }
});