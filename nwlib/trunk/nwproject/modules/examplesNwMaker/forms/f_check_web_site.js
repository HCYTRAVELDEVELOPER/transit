function f_check_web_site(pr) {
    var self = createDocument(".f_check_web_site");
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;
    function constructor(r) {
        var fields = [
            {
                tipo: 'dateField',
                nombre: 'Fecha',
                name: 'fecha',
                requerido: "NO"
            },
            {
                tipo: 'time',
                nombre: 'Hora',
                name: 'hora',
                requerido: "NO"
            },
            {
                tipo: 'datetime',
                nombre: 'Fecha yHora',
                name: 'fecha_hora',
                requerido: "NO"
            },
            {
                tipo: 'textField',
                nombre: 'URL sitio web',
                name: 'url',
                requerido: "SI"
            },
            {
                tipo: 'textArea',
                nombre: 'Respuesta',
                name: 'response'
            }
        ];
        createNwForms(self, fields, "popup");

        setColumnsFormNumber(self, 1);
        var html = "Comprueba si un sitio web se encuentra al online / offline";
        addHeaderNote(self, html);
//        setModal(true);
//        setWidth(self, 700);
        var accept = addButtonNwForm("Verificar", self);
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            rejectForm(self);
        });
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            loading("Validando...", "rgba(255, 255, 255, 0.76)!important", self);
            var data = getRecordNwForm(self);
            console.log(data);
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
            rpcNw("rpcNw", rpc, func, true);
        });
        removeLoadingNw();
    }
}