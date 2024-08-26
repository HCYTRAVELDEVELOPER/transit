function f_select_service(p) {
    var self = createDocument(".f_select_service");
    if (typeof p.self !== "undefined") {
        self = p.self;
    }
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    var up = getUserInfo();
    function constructor(r) {
        var fields = [
            {
                title: "Zona de Pagos",
                mode: "horizontal",
                name_group: "contenedor_1",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'selectBox',
                nombre: 'Seleccione la forma de pago',
                name: 'forma',
                required: true
            },
            {
                tipo: "endGroup"
            }
        ];

        var typeForm = "popup";
        if (typeof p.mode !== "undefined") {
            typeForm = p.mode;
        }
        createNwFormsNew(self, fields, typeForm);
        setColumnsFormNumber(self, 2);
        setModal(true);
        setWidth(self, 700);

        var h = "<h1>Zona de pagos</h1>";
        if (typeof p.html !== "undefined") {
            h += p.html;
        }
        addHeaderNote(self, h);

        var data = {};
        data[""] = "(Seleccione)";
        if (typeof p.credito !== "undefined")
            data["credito"] = "Crédito";
        if (typeof p.debito !== "undefined")
            data["debito"] = "Débito";
        if (typeof p.saldo !== "undefined")
            data["saldo"] = "Saldo";
        populateSelectFromArray("forma", data);

        var accept = addButtonNwForm("Continuar", self);
        var cancel = addButtonNwForm("Cancelar", self);

        cancel.click(function () {
            rejectForm(self, typeForm);
        });

        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);
            if ("saldo" == data["forma"]) {
                p["saldo"]();
                return;
            }
            if ("credito" == data["forma"]) {
                p["credito"]();
                return;
            }
            if ("debito" == data["forma"]) {
                p["debito"]();
                return;
            }
//            reject(self);
        });

        removeLoadingNw();
    }

}