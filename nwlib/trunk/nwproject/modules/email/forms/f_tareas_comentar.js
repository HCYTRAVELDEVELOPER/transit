function f_tareas_comentar(datos, self, docReferer) {
    self = generateSelf(self, false, true);
    var thisDoc = this;
    this.constructor = constructor;
    this.self = self;

    function constructor() {
        var fields = [
            {
                tipo: 'textArea',
                nombre: 'Comentario',
                texto_ayuda: 'Escribe un comentario...',
                name: 'descripcion',
                requerido: "SI"
            }
        ];
        createNwForms(self, fields, "nopopUp");
        setColumnsFormNumber(self, 1);

        listAddCssFor(self, "textarea", {"min-width": "100%", "max-height": "36px"});
        listAddCssFor(self, ".contain_input_name_descripcion p", {"display": "none"});

        setValue(self, "tarea_id", datos["id"]);
        var accept = addButtonNwForm("Enviar", self);
        $(self + " .footerButtonsNwForms").remove();

        var descripcion = actionInColForm(self, "descripcion");
        descripcion.keypress(function (e) {
            if (e.which == 13) {
                if (!validateRequired(self)) {
                    return false;
                }
                var data = getRecordNwForm(self);
                data["tarea_id"] = datos["id"];
                data["grupo"] = datos["grupo"];
                data["grupo_text"] = datos["grupo_text"];
                data["asignado_por"] = datos["asignado_por"];
                data["asignado_a_username"] = datos["asignado_a_username"];
                data["tipo"] = datos["tipo"];
                var rpc = {};
                rpc["service"] = "nwTask";
                rpc["method"] = "saveCommentTask";
                rpc["data"] = data;
                var func = function (r) {
                    if (r) {
                        if (datos["tipo"] == "tarea") {
                            var d = new createListTaskNw();
                            d.updateContend();
                        } else
                        if (datos["tipo"] == "muro") {
                            docReferer.updateContend(true);
                        }
                        reject(self, "popup");
                    } else {
                        nw_dialog("A ocurrido un error: " + r);
                    }
                };
                rpcNw("rpcNw", rpc, func, true);
            }
        });
    }
}