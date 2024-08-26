qx.Class.define("qxnw.tmp.form", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.setTitle("Comprobantes de Ingreso");
        this.createBase();
        var fields = [
            {
                name: "Inicio",
                type: "startGroup",
                icon: qxnw.config.execIcon("dialog-apply"),
                mode: "horizontal",
                color: "#f1f1f1"
            },
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "cdp",
                label: "Numero CDP",
                caption: "cdp",
                type: "textField",
                required: true,
                enabled: false
            },
            {
                name: "fecha_cdp",
                label: "Fecha CDP",
                caption: "fecha_cdp",
                type: "dateField",
                required: true,
                enabled: false
            },
            {
                name: "crp",
                label: "Numero CRP",
                caption: "crp",
                type: "textField",
                required: true,
                enabled: false
            },
            {
                name: "fecha_crp",
                label: "Fecha CRP",
                caption: "fecha_crp",
                type: "dateField",
                enabled: false,
                required: true
            },
            {
                name: "saldo",
                label: "SALDO CDP",
                caption: "saldo",
                type: "spinner",
                maximum: 10000000000000000000000000000000000000000,
                minimum: -10000000000000000000000000000000000000000,
                enabled: false,
                required: true
            },
            {
                name: "numeros",
                label: "Ver CDP",
                caption: "numeros",
                type: "button",
                icon: qxnw.config.execIcon("archive", "mimetypes")
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "fecha_ingreso",
                label: "Fecha Ingreso",
                caption: "fecha_ingreso",
                type: "dateField",
                required: true
            },
            {
                name: "recibido",
                label: "Recibido de",
                caption: "recibido",
                type: "selectTokenField",
                required: true
            },
            {
                name: "valor",
                label: "Valor",
                caption: "valor",
                type: "textField",
                required: true
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "fondo",
                label: "Fondo",
                caption: "fondo",
                type: "selectBox"
            },
            {
                name: "pagos",
                label: "Pagos",
                caption: "pagos",
                type: "spinner"
            },
            {
                name: "mision",
                label: "Mision",
                caption: " mision",
                type: "textField"
            },
            {
                name: "concepto",
                label: "Concepto del Gasto",
                caption: "concepto",
                type: "selectBox"
            },
            {
                name: "articulo_presupuestal",
                label: "Articulo Presupuestal",
                caption: "articulo_presupuestal",
                type: "selectBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "tipo",
                label: "Tipo Ingreso",
                caption: "tipo",
                type: "selectBox"
            },
            {
                name: "cuenta",
                label: "Cuenta",
                caption: "cuenta",
                type: "textField",
                required: true
            },
            {
                name: "banco",
                label: "Banco",
                caption: "banco",
                type: "selectBox"
            },
            {
                name: "cuenta_haber",
                label: "Cuenta Haber",
                caption: "cuenta_haber",
                type: "selectBox"
            },
            {
                name: "cuenta_debe",
                label: "Cuenta Debe",
                caption: "cuenta_debe",
                type: "selectBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "observaciones",
                label: "Observaciones",
                caption: "observaciones",
                type: "textArea",
                mode: "maxWidth"
            }];
        this.setFields(fields);
        var buttons = [
            {
                name: "anular",
                label: "Anular",
                enabled: false,
                icon: qxnw.config.execIcon("edit-delete")
            }];
        self.addButtons(buttons);
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
    },
    destruct: function() {
    }
});