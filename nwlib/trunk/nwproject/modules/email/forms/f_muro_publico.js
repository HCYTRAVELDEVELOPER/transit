function f_muro_publico() {
    var divPadreContainer = ".container-main-center-nwtask";
    var classDocument = ".f_muro_publico";
    createContainer(divPadreContainer, true, classDocument);
    var self = createDocument(classDocument);

    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;

    function constructor(r) {
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
                nombre: 'Publica ahora',
                name: 'publicacion',
                texto_ayuda: '¿En qué estás trabajando ahora?',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: 'Tipo',
                name: 'tipo',
                requerido: "SI"
            },
            {
                tipo: 'selectBox',
                nombre: 'Proyecto',
                name: 'grupo',
                requerido: "NO"
            },
            {
                tipo: 'selectBox',
                nombre: '¿Quién puede verla?',
                name: 'privacidad',
                requerido: "SI"
            }
        ];

        var typeForm = "nopopup";
        createNwForms(self, fields, typeForm);

        setColumnsFormNumber(self, 1);

        var data = {};
        data["Noticia"] = "Noticia";
        data["Tarea"] = "Tarea";
        data["Muro de proyecto"] = "Muro de proyecto";
        populateSelectFromArray("tipo", data);

        var data = {};
        data["Público"] = "Todos";
        data["Solo yo"] = "Solo yo";
        data["Integrantes del  proyecto"] = "Integrantes del proyecto";
        populateSelectFromArray("privacidad", data);

        var data = {};
        data["0"] = "Ninguno";
        populateSelectFromArray("grupo", data);

        var up = getUserInfo();
        var data = {};
        data["table"] = "nwtask_grupos";
        data["bindValues"] = {};
        data["bindValues"]["usuario"] = up.usuario;
        populateSelect(self, "grupo", "nwTask", "consultaGrupos", data);

        setModal(true);

        addHeaderNote(self, "<h2 class='subtitles_bloques'>Última Actividad</h2>");

        var up = getUserInfo();

        listAddCssFor(self, "#publicacion", {"height": "auto"});
        listAddCssFor(self, ".divContainInputIntern", {"margin": "0px"});
        listAddCssFor(self, ".contain_input_name_tipo", {"width": "auto", "max-width": "140px"});
        listAddCssFor(self, ".contain_input_name_privacidad", {"width": "auto", "max-width": "140px"});
        listAddCssFor(self, ".contain_input_name_grupo", {"width": "auto", "max-width": "140px"});


        var accept = addButtonNwForm("Enviar", self);
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);

            var rpc = {};
            rpc["service"] = "nwTask";
            rpc["method"] = "insertWallNoticePublic";
            rpc["data"] = data;
            var func = function (r) {
//                resetForm(self);
                setValue(self, "publicacion", "");
                var d = new l_muro_publico();
                d.constructor();
            };
            rpcNw("rpcNw", rpc, func, true);
        });
    }

    function updateContend(ra) {
        var up = getUserInfo();
        if (evalueData(ra)) {
            setRecord(self, ra);
        } else {
            var r = {};
            r["asignado_a"] = up.id_usuario;
            r["fecha"] = getFechaHoy();
            r["hora"] = traerHoraActual();
            setRecord(self, r);
        }
    }
}