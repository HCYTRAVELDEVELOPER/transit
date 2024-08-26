function l_example_list_one(pr) {
    var self = createDocument(".l_example_list_one");
    if (pr != undefined) {
        if (pr != "popup") {
            self = pr;
        }
    }
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

        var html = "<h2 class='subtitles_bloques'>Listado Ejemplo</h2>";
        addHeaderNoteList(html, self);

        setMaxWidthList(1100, self);
        setWidthList(self, 800);

        listScroll(self, false);

        var update = createButtonListEnc(self, "Exportar Excel");
        update.click(function () {
            exportListExcel(self);
        });

        var update = createButtonListEnc(self, "Enviar por correo");
        update.click(function () {
            var d = getDataNavTable(self);
            console.log(d);
        });

        var update = getButtonUpdateFilter(self, "update");
        update.click(function () {
            thisDoc.updateContend();
        });

        var nuevo = createButtonListEnc(self, "Nuevo form");
        nuevo.click(function () {
            var d = new f_example_form();
            d.constructor();
        });

        var nuevo = createButtonListEnc(self, "googleMaps Buscar dirección");
        nuevo.click(function () {
            loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_googlemaps_buscadir.js");
            var d = new f_example_googlemaps_buscadir();
            d.constructor();
        });

        var nuevo = createButtonListEnc(self, "googleMaps Trazar PolyLine");
        nuevo.click(function () {
            loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_googlemaps_polyline.js");
            var d = new f_example_googlemaps_polyline();
            d.constructor();
        });

        var html = "<h3>Código:</h3>";
        html += "<iframe scrolling='auto' class='framecode' src='/nwlib6/nwproject/modules/examplesNwMaker/lists/l_example_list_one.js' ></iframe>";
        addFooterNoteList(self, html);

        thisDoc.updateContend();
    }

    function updateContend() {
        newLoadingTwo(self, "Cargando datos...", "background-color:#fff;position: absolute;z-index: 1000000000;height: 100%;top: 0;", "append");
        var data = {};
        data["filters"] = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nw_drive";
        rpc["method"] = "consulta_files";
        rpc["data"] = data;
        var func = function (r) {
            newRemoveLoading(self + " .containDataCols");
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            console.log(r);
            setModelData(r, self);
            /*
             listBloqs(self, 2);
             */
            var options = {};
            if (isMobile()) {
                options["margin"] = "0px";
                options["width"] = "33.33%";
                options["height"] = "auto";
                options["padding"] = "0";
            } else {
                options["margin"] = "10px";
                options["height"] = "auto";
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