//function newNwTask(ref, ra) {
function newNwTask() {
    var self = createDocument(".newNwTask");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.newPopulate = newPopulate;
    this.self = self;

    function constructor(r, grupo_text, usuarioAsignado, usuarioAsignadoText, editInCalendar) {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'ID',
                name: 'id',
                requerido: "NO",
                visible: false
            },
            {
                tipo: 'textArea',
                nombre: 'Tarea',
                name: 'tarea',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: 'Asignado a',
                name: 'asignado_a',
//                mode: 'multiple',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: 'Grupo',
                name: 'grupo',
                requerido: "NO"
            },
            {
                tipo: 'dateField',
                nombre: 'Fecha',
                name: 'fecha',
                requerido: "SI"
            },
            {
                tipo: 'time',
                nombre: 'Hora',
                name: 'hora',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: '¿Quién puede esto en noticias?',
                name: 'privacidad',
                requerido: "SI"
            }
        ];

//en pruebas, se descuadra...
//        var typeForm = "slide";
//        if (evalueData(r)) {
        var typeForm = "popup";
//        }
        createNwForms(self, fields, typeForm);

        var data = {};
        data["Público"] = "Todos";
        data["Solo yo"] = "Solo yo";
        data["Integrantes del  proyecto"] = "Integrantes del proyecto";
        populateSelectFromArray("privacidad", data);

        setColumnsFormNumber(self, 2);
        setModal(true);
//        setWidth(self, 800);

        var up = getUserInfo();

        if (evalueData(r)) {
            if (evalueData(usuarioAsignado)) {
                var data = {};
                data[usuarioAsignado] = usuarioAsignadoText;
                populateSelectFromArray("asignado_a", data);
//                setVisibility(self, "asignado_a", false);
            } else {
                var data = {};
                data["grupo"] = r;
                populateSelect(self, "asignado_a", "nwTask", "consultaParticipantesFilter", data);
            }
            var data = {};
            data[r] = grupo_text;
            populateSelectFromArray("grupo", data);
            setValue(self, "grupo", r);

        } else {
            var data = {};
            data["allusers"] = true;
            populateSelect(self, "asignado_a", "nwTask", "consultaUsuariosTerminal", data);

//            var data = {};
//            data[up.id_usuario] = up.nombre + " " + up.apellido;
//            populateSelectFromArray("asignado_a", data);
//            setEnabled(self, "asignado_a");

            var data = {};
            data[""] = "Seleccione";
            populateSelectFromArray("grupo", data);

            var data = {};
            data["table"] = "nwtask_grupos";
            data["bindValues"] = {};
            data["bindValues"]["usuario"] = up.usuario;
            populateSelect(self, "grupo", "nwTask", "consultaGrupos", data);

        }

        if (!evalueData(usuarioAsignado)) {
            setValue(self, "asignado_a", up.id_usuario);
        }

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
            rpc["method"] = "save";
            rpc["data"] = data;
            var func = function (r) {
                if (r) {
                    var d = new createListTaskNw();
                    d.updateContend();
                    rejectForm(self, typeForm);
                } else {
                    nw_dialog("A ocurrido un error: " + r);
                }
            };
            rpcNw("rpcNw", rpc, func, true);
        });

        removeLoadingNw();
    }

    function newPopulate(ra) {
        setValue(self, "grupo", ra);
    }

    function updateContend(ra, user) {
        var up = getUserInfo();
        if (evalueData(ra)) {
            setRecord(self, ra);
        } else {
            var r = {};
            if (evalueData(user)) {
                r["asignado_a"] = user;
            } else {
                r["asignado_a"] = up.id_usuario;
            }
            r["fecha"] = getFechaHoy();
            r["hora"] = traerHoraActual();
            setRecord(self, r);
        }
    }

}