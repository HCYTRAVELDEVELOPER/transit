qx.Class.define("qxnw.examples.f_testing", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setTitle(self.tr("Psicologia Antecedentes"));
        this.createBase();
//        self.setGroupHeader("Psicologia Antecedentes");
        var fields = [
            {
                name: "Antecedentes Clinicos",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "grid",
                border: "#4FA800"
            },
            {
                name: "acompanamiento",
                label: "Ha tenido acompañamiento psicológico <br /> o psiquiátrico a nivel personal o familiar?",
                type: "uploader",
                column: 0,
                row: 0,
                mode: "rowSpan:8"
            },
            {
                name: "acompanamiento_desc",
                label: self.tr(""),
                type: "textField",
                column: 1,
                row: 1
            },
            {
                name: "consumido",
                label: "Consume o ha consumido <br /> sustancias psicoactivas?",
                type: "selectBox",
                column: 2,
                row: 1
            },
            {
                name: "consumido_desc",
                label: self.tr(""),
                type: "textField",
                column: 3,
                row: 1
            },
            {
                name: "problemas",
                label: "Ha tenido problemas con el <br /> alcohol a nivel personal o familiar?",
                type: "selectBox",
                column: 1,
                row: 2
            },
            {
                name: "problemas_desc",
                label: "&nbsp<br />&nbsp",
                type: "textField",
                column: 2,
                row: 2
            },
            {
                name: "hipocondriasis",
                label: "Hipocondriasis",
                type: "selectBox",
                required: true,
                column: 1,
                row: 4
            },
            {
                name: "depresion",
                label: "Depresión",
                type: "selectBox",
                required: true,
                column: 2,
                row: 4
            },
            {
                name: "histeria",
                label: "Histeria",
                type: "selectBox",
                required: true,
                column: 3,
                row: 4

            },
            {
                name: "paranoia",
                label: "Paranoia",
                type: "selectBox",
                required: true,
                column: 4,
                row: 4
            },
            {
                name: "desviacion_psicopatica",
                label: "Desviación Psicopatica",
                type: "selectBox",
                required: true,
                column: 1,
                row: 5
            },
            {
                name: "psicastenia",
                label: "Psicastenia",
                type: "selectBox",
                required: true,
                column: 2,
                row: 5
            },
            {
                name: "esquizofrenia",
                label: "Esquizofrenia",
                type: "selectBox",
                required: true,
                column: 3,
                row: 5
            },
            {
                name: "hipomania",
                label: "Hipomania",
                type: "selectBox",
                required: true,
                column: 4,
                row: 5
            },
            {
                name: "otra_psicotecnica",
                label: "Otra",
                type: "textArea",
                mode: "colSpan:4",
                column: 1,
                row: 6
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        this.setFields(fields);
        var data = {};
        data[""] = self.tr("Seleccione");
        data["SI"] = self.tr("SI");
        data["NO"] = self.tr("NO");
        qxnw.utils.populateSelectFromArray(self.ui.hipocondriasis, data);
        qxnw.utils.populateSelectFromArray(self.ui.depresion, data);
        qxnw.utils.populateSelectFromArray(self.ui.histeria, data);
        qxnw.utils.populateSelectFromArray(self.ui.paranoia, data);
        qxnw.utils.populateSelectFromArray(self.ui.desviacion_psicopatica, data);
        qxnw.utils.populateSelectFromArray(self.ui.psicastenia, data);
        qxnw.utils.populateSelectFromArray(self.ui.esquizofrenia, data);
        qxnw.utils.populateSelectFromArray(self.ui.hipomania, data);
        //qxnw.utils.populateSelectFromArray(self.ui.acompanamiento, data);
        qxnw.utils.populateSelectFromArray(self.ui.consumido, data);
        qxnw.utils.populateSelectFromArray(self.ui.problemas, data);

        self.ui.accept.addListener("execute", function () {
            if (!self.validate()) {
                return;
            }
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        
        self.ui.acompanamiento.setShowPdf(true, 700, 500);

    },
    destruct: function () {
    },
    members: {
        __total: null,
        navTable: null,
        __addButon: null,
        __removeButton: null,
        contextMenu: function contextMenu(pos) {

        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            if (qxnw.utils.evalue(pr.producto)) {
                var token = {};
                token["id"] = pr.producto;
                token["nombre"] = pr.nom_producto;
                self.ui.producto.addToken(token);
            }

            return true;
        }

    }
});