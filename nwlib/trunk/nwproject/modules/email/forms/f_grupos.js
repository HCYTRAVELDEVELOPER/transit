
function newNwTaskGroup(ref, ra, self) {
    self = generateSelf(self);
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;

    function constructor(ra) {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'id',
                requerido: "NO",
                visible: false
            },
            {
                tipo: 'textField',
                nombre: 'Nombre',
                name: 'nombre',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: 'Estado',
                name: 'estado',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: '¿Quién puede esto en noticias?',
                name: 'privacidad',
                requerido: "SI"
            },
            {
                tipo: 'textArea',
                nombre: 'Descripción',
                name: 'descripcion',
                requerido: "NO"
            }
        ];

        createNwForms(self, fields, "popUp");
        setColumnsFormNumber(self, 3);
//        setWidth(self, 800);

        var data = {};
        data["activo"] = "Activo";
        data["inactivo"] = "Inactivo";
        populateSelectFromArray("estado", data);

        var data = {};
        data["Público"] = "Todos";
        data["Solo yo"] = "Solo yo";
        data["Integrantes del  proyecto"] = "Integrantes del proyecto";
        populateSelectFromArray("privacidad", data);

        var accept = addButtonNwForm("Guardar", self);
        var cancel = addButtonNwForm("Cancelar", self);

        cancel.click(function () {
            reject(self);
        });

        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);
            var rpc = {};
            rpc["service"] = "nwTask";
            rpc["method"] = "saveGrupo";
            rpc["data"] = data;
            var func = function (r) {
                if (r) {

                    var d = new createListGroupsNw();
                    d.updateContend(ref);
                    reject(self, "popup");

                } else {
                    nw_dialog("A ocurrido un error: " + r);
                }
            };
            rpcNw("rpcNw", rpc, func, true);
        });
        removeLoadingNw();

        if (ra != undefined) {
            thisDoc.updateContend(ra);
        }

    }

    function updateContend(pr) {
        setRecord(self, pr);
    }

}