function l_salas_usuarios(selfPadre, addDat) {
    var divPadreContainer = selfPadre;
    var classDocument = ".l_salas_usuarios";
    createContainer(divPadreContainer, true, classDocument);
    var self = createDocument(classDocument);

    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    function constructor() {
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Sala ID",
                caption: "seccion",
                visible: false
            },
            {
                label: "Nombre",
                caption: "seccion_text"
            },
            {
                label: "Tiempo mínimo de cita",
                caption: "tiempo_minimo_duracion_cita"
            }
        ];
        createList(columns, self);
//        var html = "<h2 class='subtitles_bloques'>NavTable listado example title</h2>";
//        addHeaderNoteList(html, self);
        setMaxWidthList(1100, self);
        listScroll(self, false);
//estilos para el listado
        listAddCssFor(self, "", {"width": "100%", "display": "inline-block"});

        console.log(addDat);
        if (evalueData(addDat)) {
            updateContend(addDat);
        }
    }

    function updateContend(addDat) {
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "consultaSalasByUser";
        rpc["data"] = addDat;
        var func = function (r) {
            resetList(self);
            console.log(r);
            removeLoading(self);
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            setModelData(r, self);
            var options = {};
            options["max-height"] = "initial";
            listAddCss(self, options);

            showRowInMobile(self, "nombre");

            var eliminar = addButtonContextMenu(self, "Eliminar", "contextList");
            eliminar.click(function () {
                var r = getSelectedRecord(self);
                var selfNew = generateSelf();
                createNwForms(selfNew, false, "popUp");
                addHeaderNote(selfNew, "¿Desea eliminar este registro?");
                setModal(true);
                setWidth(selfNew, 300);
                var accept = addButtonNwForm("Aceptar", selfNew);
                accept.click(function () {
                    var data = {};
                    data["id"] = r["id"];
                    data["table"] = "sop_secciones_usuarios";
                    deleteRecordForId(data);
                    reject(selfNew);
                    thisDoc.updateContend(addDat);
                });
                var cancel = addButtonNwForm("Cancelar", selfNew);
                cancel.click(function () {
                    reject(selfNew);
                });
            });
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}