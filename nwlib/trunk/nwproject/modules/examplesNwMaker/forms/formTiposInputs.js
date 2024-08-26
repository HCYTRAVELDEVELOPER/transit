function formTiposInputs(pr) {
    var self = createDocument(".formTiposInputs");
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    function constructor() {
        var fields = [
            {
                title: "Fechas",
                mode: "horizontal",
                name_group: "contenedor_fechas",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'textField',
                nombre: 'Tipo textField',
                name: 'textField',
                requerido: "NO"
            },
            {
                tipo: 'dateField',
                nombre: 'Tipo dateField',
                name: 'dateField',
                requerido: "NO"
            },
            {
                tipo: 'time',
                nombre: 'Tipo time',
                name: 'time',
                requerido: "NO"
            },
            {
                tipo: 'datetime',
                nombre: 'Tipo datetime',
                name: 'datetime',
                requerido: "NO"
            },
            {
                tipo: "endGroup"
            },
            {
                tipo: 'uploader',
                nombre: 'Tipo uploader',
                name: 'uploader',
                requerido: "NO"
            },
            {
                tipo: 'selectBox',
                nombre: 'Tipo SelectBox',
                name: 'selectBox',
                requerido: "NO"
            },
            {
                tipo: 'selectTokenField',
                nombre: 'Tipo selectTokenField',
                name: 'selectTokenField',
                requerido: "NO"
            },
            {
                tipo: 'textArea',
                nombre: 'Tipo textArea',
                name: 'textArea'
            }
        ];
        createNwForms(self, fields, "popup");

        activeSelectTokenField(self, "selectTokenField", "nwMaker", "populateselectTokenField");


        var data = {};
        data[""] = "(Seleccione)";
        data["uno"] = "Opción 1";
        data["dos"] = "Opción 2";
        populateSelectFromArray("selectBox", data);

        var x = {};
        x.dateField = getFechaHoy();
        x.time = traerHoraActual();
        x.datetime = traeFechaHoraActual();
        x.selectBox = "dos";
        x.textArea = "testing";
        x.uploader = "/nwlib6/icons/play_store.png";
        x.selectTokenField = {
            id: 1,
            name: "alexf@netwoods.net"
        };
        setRecord(self, x);

        setColumnsFormNumber(self, 2);
        var html = "Diferentes tipos de inputs para formularios";
        addHeaderNote(self, html);
        setModal(true);
        setWidth(self, 700);
        var accept = addButtonNwForm("Aceptar", self);
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            rejectForm(self);
        });
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);
            console.log(data);
            return;
            loading("Validando...", "rgba(255, 255, 255, 0.76)!important", self);
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "checkWebSite";
            rpc["data"] = data;
            var func = function (r) {
                console.log(r);
                if (!verifyErrorNwMaker(r)) {
                    return;
                }
                setValue(self, "response", r);
                removeLoading(self);
            };
            rpcNw("rpcNw", rpc, func);
        });
        removeLoadingNw();
    }
}