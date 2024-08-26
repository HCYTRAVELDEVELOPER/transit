qx.Class.define("qxnw.nw_reports.forms.f_columnas", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle("Agregar Columnas");
        this.createBase();
        var fields = [
            {
                name: "nombre",
                label: "Nombre",
                caption: "nombre",
                type: "textField",
                required: true
            },
            {
                name: "orden",
                label: "Orden",
                caption: "orden",
                type: "textField"
            }];
        this.setFields(fields);
        var data = {
        };
        data.table = "nw_reports_cols";
        qxnw.utils.populateSelect(self.ui.proceso, "master", "populate", data);
        self.ui.accept.addListener("execute", function() {
            self.accept();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
    },
    destruct: function() {
    },
    members: {
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            return true;
        }
    }
});