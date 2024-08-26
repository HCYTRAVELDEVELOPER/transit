function l_categorias_lista() {
    var classDocument = ".l_categorias_lista";
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
                label: "Nombre",
                caption: "nombre"
            }
        ];
        createList(columns, self);
        setMaxWidthList(190, self);
        listScroll(self, false);
        thisDoc.updateContend();
    }

    function updateContend() {
        var data = {};
        data["filters"] = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nwdelivery";
        rpc["method"] = "consultaCategorias";
        rpc["data"] = data;
        var func = function (r) {
            if (r == "0" || r == 0) {
                return false;
            } else
            if (r) {
                setModelData(r, self);

                $(self + " .menuList").remove();

                listAddCssFor(self, "1", {"font-weight": "bold"});
                listAddCssFor(self, ".namedColMob", {"display": "none"});
                listAddCssFor(self, "1", {"font-weight": "bold"}, "mobile");
                listAddCssFor(self, ".colsMobil", {"cursor": "pointer", "padding": "5px"});
                listAddCssFor(self, ".colsMobil p", {"padding": "8px 0px", "margin": "0px"});

                removeMainColumns(self);
                removeColorsRows(self);
                showRowInMobile(self, "tarea");

                var b = actionInRow(self, true);
                b.click(function () {
                    var este = this;
                    var data = getSelectedRecord(self);
                    scrollPage("titleCategorie_" + data["id"], 1000, 100, false);
                    setTimeout(function () {
                        $(self + " .colsMobil").removeClass("activeLInkMenu");
                        $(este).addClass("activeLInkMenu");
                    }, 1060);
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