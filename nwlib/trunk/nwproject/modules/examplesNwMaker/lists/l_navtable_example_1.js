function l_navtable_example_1(selfPadre) {
    var divPadreContainer = selfPadre;
    var classDocument = ".l_navtable_example_1";
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
                label: "Nombre",
                caption: "nombre"
            }
        ];
        createList(columns, self);
        var html = "<h2 class='subtitles_bloques'>NavTable listado example title</h2>";
        addHeaderNoteList(html, self);
        setMaxWidthList(1100, self);
        listScroll(self, false);
        var update = getButtonUpdateFilter(self, "update");
        update.click(function () {
            thisDoc.updateContend();
        });
        var nuevo = createButtonListEnc(self, "Subir Archivo");
        nuevo.click(function () {
            var d = new f_navtable_example_1(selfPadre);
            d.constructor();
        });
        listAddCssFor(self, "", {"width": "100%", "display": "inline-block"});
        thisDoc.updateContend();
    }

    function updateContend() {
        var data = {};
        data["filters"] = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nw_drive";
        rpc["method"] = "consulta_files";
        rpc["data"] = data;
        var func = function (r) {
                removeLoading(self);
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            setModelData(r, self);
            var options = {};
            options["max-height"] = "initial";
            listAddCss(self, options);

            showRowInMobile(self, "nombre");

            var eliminar = addButtonContextMenu(self, "Eliminar");
            eliminar.click(function () {
                var r = getSelectedRecord(self);
                var selfNew = generateSelf();
                createNwForms(selfNew, false, "popUp");
                addHeaderNote(selfNew, "¿Desea eliminar este usuario del grupo?");
                setModal(true);
                setWidth(selfNew, 300);
                var accept = addButtonNwForm("Aceptar", selfNew);
                accept.click(function () {
                    var data = {};
                    data["id"] = r["id"];
                    data["table"] = "nwtask_grupos_usuarios";
                    deleteRecordForId(data);
                    reject(selfNew);
                    thisDoc.updateContend();
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