function f_files() {
    var self = createDocument(".f_files");
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
                title: "Sube tu archivo",
                mode: "horizontal",
                name_group: "contenedor_1",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'uploader',
                nombre: 'Archivo',
                name: 'ruta',
                requerido: "SI"
            },
            {
                tipo: "endGroup"
            },
            {
                title: "Comparte",
                mode: "horizontal",
                name_group: "contenedor_2",
                numberCols: "1",
                tipo: "startGroup"
            },
            {
                tipo: 'selectBox',
                nombre: 'Compartir con',
                name: 'compartir',
                requerido: "SI"
            },
            {
                tipo: "endGroup"
            }
        ];
        var typeForm = "popup";
        createNwForms(self, fields, typeForm);
        setColumnsFormNumber(self, 1);

        $(self + " .uploader_ruta").attr("self-div", self + " #nwform");

        setModal(true);
        setWidth(self, 700);
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
            loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);
            var data = getRecordNwForm(self);
            data["nombre"] = nombre($(self + " .uploader_filenw").val());
            var rpc = {};
            rpc["service"] = "nw_drive";
            rpc["method"] = "subir_file";
            rpc["data"] = data;
            var func = function (r) {
                if (!verifyErrorNwMaker(r)) {
                    return;
                }
                if (r) {
                    var d = new l_files();
                    d.updateContend();
                    rejectForm(self, typeForm);
                } else {
                    nw_dialog("A ocurrido un error: " + r);
                }
                removeLoading(self);
            };
            rpcNw("rpcNw", rpc, func, true);
        });

        thisDoc.updateContend(r);
        removeLoadingNw();
    }
    function updateContend(ra) {
        setRecord(self, ra);
    }
    function nombre(fic) {
        fic = fic.split('\\');
        return fic[fic.length - 1];
    }

}