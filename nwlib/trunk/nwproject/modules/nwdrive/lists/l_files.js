function l_files() {
    var self = createDocument(".l_files");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;

    function constructor(grupo) {
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Usuario",
                caption: "usuario",
                visible: false
            },
            {
                label: "Archivo",
                caption: "ruta",
                type: "image",
                mode: "phpthumb"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Extensión",
                caption: "extension",
                visible: false
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Peso",
                caption: "peso"
            }
        ];
        createList(columns, self);

        var html = "<h2 class='subtitles_bloques'>My NwDrive</h2>";
        addHeaderNoteList(html, self);

        setMaxWidthList(1100, self);
        listScroll(self, false);

        var update = getButtonUpdateFilter(self, "update");
        update.click(function () {
            thisDoc.updateContend();
        });

        var nuevo = createButtonListEnc(self, "Subir Archivo");
        nuevo.click(function () {
            var d = new f_files();
            d.constructor();
        });

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
            if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) == 0) {
                return;
            }
            setModelData(r, self);

            listBloqs(self, 2);
            var options = {};
            if (isMobile()) {
                options["margin"] = "0px";
                options["width"] = "33.33%";
                options["height"] = "auto";
                options["padding"] = "0";
            } else {
                options["margin"] = "10px";
                options["width"] = "150px";
                options["height"] = "250px";
                options["padding"] = "10px";
            }
            options["max-height"] = "initial";
            listAddCss(self, options);

            showRowInMobile(self, "nombre");

            listAddCssFor(self, ".imageListNwMaker2", {"background-position": "center"});
            listAddCssFor(self, ".namedColMob", {"display": "none"});

            var eliminar = addButtonContextMenu(self, "Eliminar");
            eliminar.click(function () {
                var r = getSelectedRecord(self);
                var selfNew = generateSelf();
                createNwForms(selfNew, false, "popUp");
                addHeaderNote(selfNew, "¿Realmente desea eliminar este registro?");
                setModal(true);
                setWidth(selfNew, 300);
                var accept = addButtonNwForm("Aceptar", selfNew);
                accept.click(function () {
                    var data = {};
                    data["id"] = r["id"];
                    data["table"] = "nw_drive_files";
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