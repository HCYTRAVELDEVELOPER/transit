qx.Class.define("qxnw.nw_reports.forms.f_filtros", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle("Agregar Filtros");
        this.createBase();
        var fields = [
            {
                name: "nombre",
                label: "Nombre",
                caption: "nombre",
                type: "textField",
                required: true,
                mode: "lowerCase"
            },
            {
                name: "label",
                label: "Label",
                caption: "label",
                type: "textField"
            },
            {
                name: "type",
                label: "Tipo de Filtro",
                caption: "type",
                type: "selectBox"
            },
            {
                name: "required",
                label: "Requerido",
                caption: "required",
                type: "selectBox"
            },
            {
                name: "descripcion",
                label: "Descripcion",
                type: "textArea"
            }];

        this.setFields(fields);
        var data = {};
        data = {
            "selectBox": "SelectBox",
            "dateField": "DateField",
            "textField": "TextField",
            "spinner": "Spinner (Sólo números)",
            "timeField": "TimeField",
            "radioButton": "radioButton",
            "button": "Button",
            "dateTimeField": "DateTimeField",
            "tokenField": "TokenField",
            "selectTokenField": "SelectTokenField"
        };
        qxnw.utils.populateSelectFromArray(self.ui.type, data);
        data = {"true": "Si", "false": "No"};
        qxnw.utils.populateSelectFromArray(self.ui.required, data);
        self.ui.accept.addListener("execute", function() {
            self.accept();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
    },
    destruct: function() {
    }
});


