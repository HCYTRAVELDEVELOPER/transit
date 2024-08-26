
function participantesForm() {
    var self = createDocument(".participantesForm");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.newPopulate = newPopulate;
    this.self = self;

    function constructor(grupo) {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'id',
                requerido: "NO",
                visible: false
            },
            {
                tipo: 'selectBox',
                nombre: 'Participante',
                name: 'usuario_grupo',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: 'Rol',
                name: 'rol',
                requerido: "NO"
            },
            {
                tipo: 'selectBox',
                nombre: 'Estado',
                name: 'estado',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: 'Grupo',
                name: 'grupo',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: '¿Quién puede esto en noticias?',
                name: 'privacidad',
                requerido: "SI"
            }
        ];

        var typeForm = "popup";
        createNwForms(self, fields, typeForm);

        var data = {};
        data["Público"] = "Todos";
        data["Solo yo"] = "Solo yo";
        data["Integrantes del  proyecto"] = "Integrantes del proyecto";
        populateSelectFromArray("privacidad", data);

        setColumnsFormNumber(self, 2);
        setModal(true);

        var up = getUserInfo();

        var data = {};
        data[""] = "Seleccione";
        populateSelectFromArray("usuario_grupo", data);
        populateSelectFromArray("grupo", data);

        var data = {};
        data["activo"] = "Activo";
        data["inactivo"] = "InActivo";
        populateSelectFromArray("estado", data);

        populateSelect(self, "usuario_grupo", "nwTask", "populateUsersByGroupParticipan", {grupo: grupo});

        var data = {};
        data["table"] = "nwtask_grupos";
        data["bindValues"] = {};
        data["bindValues"]["usuario"] = up.usuario;
//        populateSelect(self, "grupo", "nwprojectOut", "populate", data, " and usuario=:usuario");
        populateSelect(self, "grupo", "nwTask", "consultaGrupos", data);

        var data = {};
        data["table"] = "nwtask_roles";
        populateSelect(self, "rol", "nwprojectOut", "populate", data);

        var accept = addButtonNwForm("Guardar", self);
        var cancel = addButtonNwForm("Cancelar", self);

        cancel.click(function () {
            rejectForm(self, typeForm);
        });

        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);
            var rpc = {};
            rpc["service"] = "nwTask";
            rpc["method"] = "saveParticipantes";
            rpc["data"] = data;
            var func = function (r) {
                console.log(r);
                if (r) {
                    var d = new listParticipantes();
                    d.updateContend();

//                    reject(self, "popup");
                    rejectForm(self, typeForm);

                } else {
                    nw_dialog("A ocurrido un error: " + r);
                }
            };
            rpcNw("rpcNw", rpc, func);
        });

        removeLoadingNw();
    }

    function newPopulate(ra) {
        setValue(self, "grupo", ra);
    }

    function updateContend(ra) {
        if (evalueData(ra)) {
            setRecord(self, ra);
        }
    }

}