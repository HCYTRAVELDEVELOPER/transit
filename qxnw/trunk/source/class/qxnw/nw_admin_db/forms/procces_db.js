qx.Class.define("qxnw.nw_admin_db.forms.procces_db", {
    extend: qxnw.forms,
    construct: function (pr) {
        console.log(pr);
        var self = this;
        self.pr = pr;
        self.counter = 0;
        self.condicion = false;
        self.and = {};
        this.base(arguments);
        this.setColumnsFormNumber(1);
        this.createBase();
        this.setTitle("Nueva Tabla");
        self.orden_cargue = {};
        self.setGroupHeader("BD");
        var fields = [
            {
                name: self.tr("Proceso"),
                type: "startGroup",
                icon: "",
                mode: "grid"
            },
            {
                name: "procces",
                label: "Proceso",
                type: "selectBox",
                required: true,
                row: 0,
                column: 0
            },
            {
                name: "table",
                label: "Tabla",
                type: "selectBox",
                required: true,
                row: 0,
                column: 1
            },
            {
                name: "campo",
                label: "Campo",
                type: "selectBox",
                row: 0,
                column: 2
            },
            {
                name: "dato_new",
                label: "Dato",
                type: "textField",
                row: 0,
                column: 3
            },
            {
                name: "condicion_button",
                label: "Condición",
                type: "button",
                width: 100,
                row: 1,
                column: 0
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: self.tr("Condicion"),
                type: "startGroup",
                icon: "",
                mode: "vertical"
            },
            {
                name: "dec",
                label: self.tr("default"),
                type: "textField"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: self.tr("Query"),
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "query",
                label: "",
                type: "textField",
                enabled: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }];
        self.setFields(fields);
        self.createAutomaticButtons();

        self.setFieldVisibility(self.ui.dec, "excluded");
        qxnw.utils.addClassToElement(self.ui.condicion_button, "btn_blueAdmi");

        var data = {};
        data[""] = "Seleccione";
        qxnw.utils.populateSelectFromArray(self.ui.table, data);
        qxnw.utils.populateSelectFromArray(self.ui.campo, data);

        data["SELECT"] = "CONSULTAR";
        data["UPDATE"] = "ACTUALIZAR";
        qxnw.utils.populateSelectFromArray(self.ui.procces, data);
        qxnw.utils.populateSelect(self.ui.table, "nw_admin_tables", "populateTables", pr);

        self.setFieldVisibility(self.ui.dato_new, "excluded");
        self.ui.procces.addListener("changeSelection", function (e) {
            var data = self.getRecord();
            console.log(data);
            if (data.procces == "UPDATE") {
                self.ui.campo.removeAll();
                self.setFieldVisibility(self.ui.dato_new, "visible");
            } else {
                var d = {};
                d["*"] = "*";
                qxnw.utils.populateSelectFromArray(self.ui.campo, d);
                self.setFieldVisibility(self.ui.dato_new, "excluded");
            }

            self.slotQuery(data);
        });

        self.ui.table.addListener("changeSelection", function () {
            var data = self.getRecord();
            pr.nombre = data.table;
            self.ui.campo.removeAll();
            if (data.procces == "SELECT") {
                var d = {};
                d["*"] = "*";
                qxnw.utils.populateSelectFromArray(self.ui.campo, d);
            }
            self.populateFieldsByTableProcces(pr, function (s) {
                qxnw.utils.populateSelectFromArray(self.ui.campo, s);
            });
            self.slotQuery(data);
        });

        self.ui.campo.addListener("changeSelection", function () {
            var data = self.getRecord();
            self.slotQuery(data);
        });

        self.ui.dato_new.addListener("focusout", function () {
            var data = self.getRecord();
            self.slotQuery(data);
        });

        self.ui.condicion_button.addListener("execute", function () {
            var container = self.getGroup("condicion");
            var data = self.getRecord();
            self.condicion = true;
            if (data.table == "") {
                qxnw.utils.information("Por favor seleccione la tabla");
                return false;
            }
            var condicional = "condicional_" + self.counter;
            var campo_condicion = "campo_condicion_" + self.counter;
            var parametro = "parametro_" + self.counter;
            self.pr.condicional = condicional;
            self.pr.campo_condicion = campo_condicion;
            self.pr.parametro = parametro;
            self.pr.nombre = data.table;
            self.pr.counter = self.counter;
            var width = 100;
            var fields = [
                {
                    name: campo_condicion,
                    label: "Campo Condición",
                    type: "selectBox",
                    width: width
                },
                {
                    name: condicional,
                    label: "Condicional",
                    type: "selectBox",
                    width: width
                },
                {
                    name: parametro,
                    label: "Parámetro",
                    type: "textField",
                    width: width
                }
            ];
            self.counter++;
            self.addFieldsByContainer(fields, container);

            var a = {};
            a[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(self.ui[campo_condicion], a);
            qxnw.utils.populateSelectFromArray(self.ui[condicional], a);
            self.ui[campo_condicion].populateFromArray(self.cam);

            var b = {};
            b["="] = "Igual a";
            b["<"] = "Menor que";
            b[">"] = "Mayor que";
            qxnw.utils.populateSelectFromArray(self.ui[condicional], b);

//            self.populateFieldsByTableProcces(self.pr);


            self.ui[parametro].addListener("focusout", function () {
                var data = self.getRecord();
                console.log("DATA:: ", data);
                self.slotQuery(data, self.pr);
            });

        });


        self.ui.accept.addListener("execute", function () {
            self.clean();
        });
        self.ui.accept.set({
            label: "Ejecutar"
        });
        self.ui.cancel.set({
            label: "Limpiar"
        });
        self.ui.query.setFilter(/[^\\\|]/g);

    },
    members: {pr: null,
        box1: null,
        models: null,
        deleteButton: null,
        navTable: null,
        texto: null,
        text_query: true,
        clean: function clean() {
            var self = this;
            var col = self.getNumberOfNavTables();
            self.slotSave();
        },

        populateFieldsByTableProcces: function populateFieldsByTableProcces(dat, callback) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
            rpc.setAsync(true);
            var func = function (r) {
                var data = {};
                if (r) {
                    for (var i = 0; i < r.length; i++) {
                        data[r[i].id] = r[i].nombre;
                    }
//                    self.ui[dat.campo_condicion].populateFromArray(data);
                    self.cam = data;
                    callback(data);
//                    self.ui.campo.populateFromArray(data);
                }
            };
            rpc.exec("populateFieldsByTableProcces", dat, func);
        },

        slotQuery: function slotQuery(val, pr = null) {
            console.log("counter:: ", pr);
            var self = this;
            var dato = self.getRecord();
            self.procces = "";
            self.table = "";
            self.campo = "";
            self.dato_new = "";
            self.concat = "";
            var w = " WHERE 1=1";
            self.campo_condicion = "";

            if (qxnw.utils.evalue(val.procces) && val.procces != "") {
                self.procces = val.procces;
            }

            if (qxnw.utils.evalue(val.table) && val.table != "") {
                self.table = val.table;
            }

            if (qxnw.utils.evalue(val.campo) && val.campo != "") {
                self.campo = val.campo;
            }

            if (qxnw.utils.evalue(val.campo) && val.campo != "") {
                self.dato_new = val.dato_new;
            }

            if (self.condicion == true) {
                self["campo_condicion_" + pr.counter] = val["campo_condicion_" + pr.counter];
                console.log(self["campo_condicion_" + pr.counter]);

                self["condicional_" + pr.counter] = val["condicional_" + pr.counter];
                console.log(self["condicional_" + pr.counter]);

                self["parametro_" + pr.counter] = val["parametro_" + pr.counter];
                console.log(self["parametro_" + pr.counter]);


                console.log(self.and);


//                for (var key in self.and) {
                for (var i = 0; i < pr.counter; i++) {
                    if (typeof dato["campo_condicion_" + pr.counter] !== 'undefined') {
                        var a = " AND ";
                        var and = self["campo_condicion_" + i];
                        and += " " + self["condicional_" + i];
                        and += " " + self["parametro_" + i];

                        self.and["campo_condicion_" + i] = and;
                        for (var key in self.and) {
                            self.concat += " AND " + self.and[key];
                        }
                        console.log("La variable existe.");
                    } else {
                        console.log("La variable no existe.");
                    }
                }

//                self.concat += " AND " + self.and[key];
//                }
                console.log(self.concat);
                console.log(self.and);

            }

            if (val.procces == "SELECT") {
                self.query = self.procces + " " + self.campo + " FROM " + self.table + w + self.and;
            } else if (val.procces == "UPDATE") {
                self.query = self.procces + " " + self.table + " SET " + self.campo + " = " + self.dato_new + " ";
            }


            self.ui.query.setValue(self.query);
        },

        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            data.model = self.pr.model;
            if (!self.validate()) {
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
            rpc.setAsync(true);
            var func = function (r) {
                if (qxnw.utils.evalue(r)) {
                    if (self.parent == null) {
                        self.parent = new qxnw.navtable(self);
                        self.parent.setContextMenu("contextMenu");
                        self.insertNavTable(self.parent.getBase(), "Result");
                    }
                    var columns = [];
                    var column = {};
                    for (var v in r[0]) {
                        var upper = new qx.type.BaseString(v);
                        column = {
                            label: upper.toUpperCase(),
                            caption: v
                        };
                        columns.push(column);
                    }
                    self.parent.setColumns(columns);
                    self.parent.setModelData(r);
                } else {
                    if (self.parent == null) {

                    }
                }

            };
            rpc.exec("executeQueryProcces", data, func);
        }
    }
});