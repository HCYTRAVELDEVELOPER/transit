function l_mis_direcciones(referer) {
    var classDocument = ".l_mis_direcciones";
    createContainer(".container-main-nwdelivery", true, classDocument);
    var self = createDocument(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;

    function constructor(r) {
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Ciudad",
                caption: "ciudad"
            },
//            {
//                label: "Ciudad",
//                caption: "ciudad_text"
//            },
            {
                label: "Dirección",
                caption: "direccion"
            },
            {
                label: "Barrio",
                caption: "barrio"
            },
            {
                label: "Apto / Casa",
                caption: "aptocasa"
            },
            {
                label: "Latitud",
                caption: "latitud",
                visible: true
            },
            {
                label: "Longitud",
                caption: "longitud",
                visible: true
            }
        ];
        createList(columns, self);

        $(self).attr("id", "l_mis_direcciones");

        setMaxWidthList(700, self);
        listScroll(self, false);
        thisDoc.updateContend();
    }

    function updateContend() {
        var data = {};
        data["filters"] = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nwdelivery";
        rpc["method"] = "consultaMisDirecciones";
        rpc["data"] = data;
        var func = function (r) {
            if (r == "0" || r == 0) {
                return false;
            } else
            if (r) {
                setModelData(r, self);
                scrollPage("l_mis_direcciones", 500, 150, false);
                $(self + " .menuList").remove();
                listAddCssFor(self, "", {"background": "#fff", "margin": "auto", "border": "1px solid #ccc", "padding": "10px"});
//                removeMainColumns(self);
//                removeColorsRows(self);
//                showRowInMobile(self, "tarea");
                var b = actionInRow(self, true);
                b.click(function () {
                    var data = getSelectedRecord(self);
                    setRecord(referer, data);
                    reject(self);
                    scrollPage("circle_pasos", 500, 150, false);
                });
                inactiveClicInRow(self);
            } else {
                nw_dialog("A ocurrido un error: " + r);
                console.log(r);
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}