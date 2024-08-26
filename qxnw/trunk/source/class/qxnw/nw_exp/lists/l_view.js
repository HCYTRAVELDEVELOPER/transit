qx.Class.define("qxnw.nw_exp.lists.l_view", {
    extend: qxnw.lists,
    construct: function (parent) {
        var self = this;
        self.base(arguments);
        self.__parent = parent;
        self.setButtonsAutomatic(true);
        self.createBase();
        var columns = [
            {
                label: "Data",
                caption: "data"
            }
        ];
        self.setColumns(columns);

        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.unSelectButton.addListener("click", function () {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.setAllPermissions(true);
    },
    destruct: function () {
    },
    members: {
        __parent: null,
        enc: null,
        __isPopulatedView: false,
        populateFilters: function populateFilters() {
            var self = this;
            self.containerFilters.removeAll();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_exp");
            rpc.setAsync(true);
            var func = function (r) {
                var filters = [];
                for (var i = 0; i < r.length; i++) {
                    if (r[i].tipo == "dateField") {
                        var d = {
                            name: "fecha_inicial_filters",
                            caption: "fecha_inicial_filters",
                            type: "dateField",
                            label: self.tr("Fecha inicial")
                        };
                        filters.push(d);
                        d = {
                            name: "fecha_final_filters",
                            caption: "fecha_final_filters",
                            type: "dateField",
                            label: self.tr("Fecha final")};
                        filters.push(d);
                    } else if (r[i].tipo == "selectBox") {
                        var v = {};
                        v["caption"] = r[i].nombre;
                        v["name"] = r[i].nombre;
                        v["label"] = r[i].label;
                        v["type"] = r[i].tipo;
                        filters.push(v);
                    } else {
                        var v = {};
                        v["caption"] = r[i].nombre;
                        v["name"] = r[i].nombre;
                        v["label"] = r[i].label;
                        v["type"] = r[i].tipo;
                        filters.push(v);
                    }
                }
                self.createFilters(filters);
                for (var i = 0; i < r.length; i++) {
                    if (r[i].tipo == "selectBox") {
                        qxnw.utils.populateSelectAsync(self.ui[r[i].nombre], "nw_exp", "populateDynamic", {table: r[i].tabla_llenado, field: r[i].campo_mostrar});
                    }
                }
                self.ui.searchButton.addListener("execute", function () {
                    self.applyFilters();
                });
            };
            rpc.exec("getFiltersByEnc", self.enc, func);
        },
        setEnc: function setEnc(enc) {
            this.enc = enc;
            if (this.__isPopulatedView == false) {
                this.populateFilters();
                this.__isPopulatedView = true;
            }
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.enc = self.enc;
            data.filters = self.getFiltersData();
            if (self.__parent != null) {
                var childrenFilters = self.__parent.filtersList.getChildren();
                var childrenTables = self.__parent.filaRotulosList.getChildren();
                if ((childrenTables.length - childrenFilters.length) > 1) {
                    qxnw.utils.information(self.tr("Debe ingresar una conexión adicional"));
                    return;
                }
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_exp");
            rpc.setAsync(true);
            var func = function (r) {
                if (r.records.length == 0) {
                    qxnw.utils.information(self.tr("No se encontraron registros"));
                    self.setModelData([]);
                    return;
                }
                var columns = [];
                for (var i = 0; i < r.records.length; i++) {
                    for (var v in r.records[i]) {
                        var z = {};
                        z["caption"] = v;
                        z["label"] = v;
                        z["type"] = "string";
                        columns.push(z);
                    }
                    break;
                }
                self.setColumns(columns);
                self.setModelData(r);
            };
            rpc.exec("getQueryById", data, func);
        }
    }
});