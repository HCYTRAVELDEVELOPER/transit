function l_productos_lista(mainSelf, id_grupo) {
    var classDocument = ".l_productos_lista";

    if (typeof mainSelf != "undefined") {
        var m = id_grupo;
        var classDocument = ".l_productos_lista_" + m;
        createContainer(mainSelf, true, classDocument);
    } else {
        createContainer(".container-main-nwdelivery", true, classDocument);
    }
    var self = createDocument(classDocument);

    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.loadShowProduct = loadShowProduct;
    this.self = self;

    function constructor(id_grupo, row, callBack) {

        var phpthumb = "phpthumb";
        if (typeof usePhpThumb != "undefined") {
            if (usePhpThumb == false) {
                phpthumb = "nophpthumb";
            }
        }
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Foto",
                caption: "foto",
                type: "image",
                modo: phpthumb,
                clickable: false
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Descripción",
                caption: "descripcion"
            },
            {
                label: "Valor",
                caption: "valor",
                type: "money"
            },
            {
                label: "Agregar",
                caption: "agregar",
                type: "button"
            }
        ];
        createList(columns, self);
        setMaxWidthList(800, self);
        listScroll(self, false);
        thisDoc.updateContend(id_grupo, row, callBack);
    }

    function updateContend(id_grupo, row, callBack) {

        var data = {};
        if (typeof id_grupo != "undefined") {
            if (id_grupo != undefined) {
                data["categoria"] = id_grupo;
            }
        }
        data["filters"] = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nwdelivery";
        rpc["method"] = "consultaProductos";
        rpc["data"] = data;
        var func = function (r) {
            if (r == "0" || r == 0) {
                return false;
            } else
            if (r) {
                setModelData(r, self, true);

                $(self + " .menuList").remove();

                var cuadros = false;
                var cuadros = true;

                if (cuadros) {
                    listBloqs(self, 2);

                    var options = {};
                    if (isMobile()) {
                        options["height"] = "auto";
                        options["width"] = "50%";
                        options["margin"] = "0px";
                        options["padding"] = "0px";
                    } else {
                        options["height"] = "450px";
                        options["width"] = "150px";
                        options["margin"] = "10px";
                        options["padding"] = "10px";
                    }
                    options["max-height"] = "initial";
                    listAddCss(self, options);

                    listAddCssFor(self, "1", {"height": "150px", "background-position": "center", "border-radius": "5px", "background-size": "cover"});

                } else {
                    moveDataToColumn(self, "3", "2");
                    moveDataToColumn(self, "5", "4");

                    var options = {};
                    options["margin"] = "10px";
                    options["height"] = "auto";
                    options["max-height"] = "initial";
                    options["padding"] = "10px";
                    listAddCss(self, options);

                    listAddCssFor(self, "1", {"height": "90px", "width": "90px", "background-position": "center", "border-radius": "50%", "background-size": "cover"});

                    listWidthByColumn(self, "1", "100px");
                    listWidthByColumn(self, "2", "400px");
                    listWidthByColumn(self, "4", "100px");

                }

                listAddCssFor(self, "2", {"font-weight": "bold", "font-size": "14px"});
                listAddCssFor(self, ".namedColMob", {"display": "none"});

//                removeMainColumns(self);
                removeColorsRows(self);

                showRowInMobile(self, "nombre");
                showRowInMobile(self, "descripcion");
                showRowInMobile(self, "valor");
                showRowInMobile(self, "agregar");

                var btnOk = actionInColList(self, "agregar");
                btnOk.click(function () {
                    var data = getSelectedRecord(self);
//                    loadProductUnitary(self, data);
                    loadShowProduct(data);
                });

                inactiveClicInRow(self);

                if (evalueData(callBack)) {
                    callBack(row);
                }

            } else {
                nw_dialog("A ocurrido un error: " + r);
                console.log(r);
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }

    function loadShowProduct(data) {
        addHash(location.pathname + "?showProduct=" + data.id + location.hash);
        loadProductUnitary(self, data);
    }

}