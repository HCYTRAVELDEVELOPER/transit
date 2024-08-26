function f_grupos_files(grupo) {
    var self = createDocument(".f_grupos_files");
    var thisDoc = this;
    this.constructor = constructor;
//    this.updateContend = updateContend;
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
                tipo: 'uploader',
                nombre: 'Archivo',
                name: 'ruta',
                requerido: "SI"
            }
        ];
        var typeForm = "popup";
        createNwForms(self, fields, typeForm);
        setColumnsFormNumber(self, 1);
        setModal(true);
        setWidth(self, 500);
        
        $(self + " .uploader_ruta").attr("self-div", self + " #nwform");

        var data = {};
        data["publico"] = "Público";
        data["solo_yo"] = "Solo yo";
        populateSelectFromArray("compartir", data);

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
            data["nombre"] = nombre($(".uploader_filenw").val());
            data["grupo"] = grupo;
            var rpc = {};
            rpc["service"] = "nwTask";
            rpc["method"] = "subir_file";
            rpc["data"] = data;
            var func = function (r) {
                console.log(r);
                if (r) {
                    var d = new l_grupos_files(grupo);
                    d.updateContend();
                    rejectForm(self, typeForm);
                } else {
                    nw_dialog("A ocurrido un error: " + r);
                }
            };
            rpcNw("rpcNw", rpc, func);
        });
//        thisDoc.updateContend(r);
        removeLoadingNw();
    }
//    function updateContend(ra) {
//        setRecord(self, ra);
//    }
    function nombre(fic) {
        fic = fic.split('\\');
        return fic[fic.length - 1];
    }

}