qx.Class.define("qxnw.nw_admin_db.forms.f_field", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("Nuevo / Editar Campo");
        var text = "<h3>Nuevo / Editar Campo</h3>";
        self.addHeaderNote(text);
        self.orden_cargue = {};
        self.setGroupHeader("Nuevo / Editar Campo");
        var fields = [
            {
                name: "Campo y Tipos de Datos",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "field_name",
                label: self.tr("<strong>Nombre Campo</strong>"),
                type: "textField",
                required: true
            },
            {
                name: "table_name",
                label: self.tr("<strong>Table_name</strong>"),
                type: "textField",
                visible: false
            },
            {
                name: "field_type",
                label: self.tr("<strong>Tipo Campo</strong>"),
                type: "selectBox",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "size",
                label: self.tr("<strong>Tamaño</strong>"),
                type: "textField",
                mode: "integer",
                enabled: false
            },
            {
                name: "number_array",
                label: self.tr("<strong>Número de dimensiones de array</strong>"),
                type: "textField",
                enabled: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Valor Defecto",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "default",
                label: self.tr("<strong>Valor Default</strong>"),
                type: "textArea"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Etiquetas de Campo",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "primary_key",
                label: self.tr("<strong>Primary Key</strong>"),
                type: "checkBox"
            },
            {
                name: "not_null",
                label: self.tr("<strong>No Nulo</strong>"),
                type: "checkBox"
            },
            {
                name: "unique",
                label: self.tr("<strong>Unico</strong>"),
                type: "checkBox"
            },
            {
                name: "descript",
                label: self.tr("<strong>Descripción</strong>"),
                type: "checkBox"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Descripcion",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "widget",
                label: self.tr("<strong>Widget</strong>"),
                type: "selectBox"
            },
            {
                name: "method",
                label: self.tr("<strong>Populate</strong>"),
                type: "selectBox"
            },
            {
                name: "table",
                label: self.tr("<strong>tabla</strong>"),
                type: "selectBox"
            },
            {
                name: "clase",
                label: self.tr("<strong>Clase/Metodo</strong>"),
                type: "textField"
            },
            {
                name: "mode",
                label: self.tr("<strong>Mode</strong>"),
                type: "selectListCheck"
            },
            {
                name: "parametro",
                label: self.tr("<strong>Parametro</strong>"),
                type: "textField"
            },
            {
                name: "label",
                label: self.tr("<strong>Label</strong>"),
                type: "textField"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            },
            {
                name: "Descripcion Parametros",
                type: "startGroup",
                icon: "",
                mode: "horizontal"
            },
            {
                name: "visible",
                label: self.tr("<strong>Visible</strong>"),
                type: "checkBox"
            },
            {
                name: "required",
                label: self.tr("<strong>Required</strong>"),
                type: "checkBox"
            },
            {
                name: "filter",
                label: self.tr("<strong>Filter</strong>"),
                type: "checkBox"
            },
            {
                name: "descripcion",
                label: self.tr("<strong>Filter</strong>"),
                type: "textField",
                visible: false
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }];
        self.setFields(fields);
//        self.menu.setVisibility("excluded");
        self.ui.method.setEnabled(false);
        self.ui.widget.setEnabled(false);
        self.setRequired("widget", false);
        self.ui.visible.setEnabled(false);
        self.ui.required.setEnabled(false);
        self.ui.mode.setEnabled(false);
        self.ui.label.setEnabled(false);
        self.ui.filter.setEnabled(false);
        self.setGroupVisibility("descripcion_parametros", "excluded");
        self.setGroupVisibility("descripcion", "excluded");
        qxnw.utils.populateSelectFromArray(self.ui.field_type, {"": "Tipo dato standar..."});
        qxnw.utils.populateSelectFromArray(self.ui.widget, {"": "Widget standar..."});
        qxnw.utils.populateSelectFromArray(self.ui.method, {"0": "0"});
        qxnw.utils.populateSelectFromArray(self.ui.method, {"table": "Tabla"});
        qxnw.utils.populateSelectFromArray(self.ui.method, {"array": "Array"});
        qxnw.utils.populateSelectFromArray(self.ui.method, {"boolean": "Boolean"});
        qxnw.utils.populateSelectFromArray(self.ui.method, {"class": "Clase / Metodo"});
        qxnw.utils.populateSelectFromArrays(self.ui.field_type, qxnw.config.getDataTypes());
        qxnw.utils.populateSelectFromArrays(self.ui.widget, qxnw.config.getWidgets());
        self.setFieldVisibility(self.ui.table, "excluded");
        self.setFieldVisibility(self.ui.clase, "excluded");
        self.ui.method.addListener("changeSelection", function () {
            switch (this.getValue()["method"]) {
                case "0":
                    self.setFieldVisibility(self.ui.table, "excluded");
                    self.setFieldVisibility(self.ui.clase, "excluded");
                    break;
                case "table":
                    self.setFieldVisibility(self.ui.table, "visible");
                    self.ui.table.setEnabled(true);
                    qxnw.utils.populateSelect(self.ui.table, "nw_admin_tables", "populateTables", self.pr);
                    qxnw.utils.populateSelect(self.ui.table, "nw_admin_tables", "populateViews", self.pr);
                    self.setFieldVisibility(self.ui.clase, "excluded");
                    break;
                case "class":
                    self.setFieldVisibility(self.ui.table, "excluded");
                    self.setFieldVisibility(self.ui.clase, "visible");
                    self.ui.clase.setEnabled(true);
                    break;
                case "array":
                    self.setFieldVisibility(self.ui.table, "excluded");
                    self.setFieldVisibility(self.ui.clase, "excluded");
                    break;
            }
        });
        self.ui.field_type.addListener("changeSelection", function () {
            self.ui.number_array.setEnabled(false);
            self.ui.size.setEnabled(false);
            self.ui.primary_key.setEnabled(false);
            self.setGroupVisibility("valor_defecto", "visible");
            switch (this.getValue()["field_type"]) {
                case "BIGINT":
                    self.ui.number_array.setEnabled(true);
                    self.ui.size.setEnabled(false);
                    self.ui.size.setValue("");
                    self.setRequired("size", false);
                    break;
                case "DOUBLE PRECISION":
                    self.ui.number_array.setEnabled(true);
                    self.ui.size.setEnabled(false);
                    self.ui.size.setValue("");
                    self.setRequired("size", false);
                    break;
                case "CHAR":
                    self.ui.number_array.setEnabled(true);
                    self.ui.size.setEnabled(true);
                    self.setRequired("size", true);
                    self.ui.size.setValue(parseInt(100));
                    break;
                case "BOOLEAN":
                    self.ui.number_array.setEnabled(false);
                    self.ui.size.setEnabled(false);
                    self.ui.size.setValue("");
                    self.setRequired("size", false);
                    break;
                case "DATE":
                    self.ui.number_array.setEnabled(false);
                    self.setRequired("size", false);
                    self.ui.size.setValue("");
                    self.ui.size.setEnabled(false);
                    break;
                case "SERIAL":
                    self.ui.primary_key.setEnabled(true);
                    self.ui.number_array.setEnabled(false);
                    self.ui.size.setEnabled(false);
                    self.setRequired("size", false);
                    self.ui.size.setValue("");
                    self.setGroupVisibility("valor_defecto", "excluded");
                    break;
                case "INTEGER":
                    self.ui.number_array.setEnabled(false);
                    self.ui.size.setEnabled(false);
                    self.ui.size.setValue(0);
                    self.setRequired("size", false);
                    break;
                case "TEXT":
                    self.ui.number_array.setEnabled(false);
                    self.setRequired("size", false);
                    self.ui.size.setValue("");
                    break;
                case "NUMERIC":
                    self.ui.number_array.setEnabled(true);
                    self.ui.size.setEnabled(true);
                    self.setRequired("size", false);
                    self.ui.size.setValue("");
                    break;
                case "SMALLINT":
                    self.ui.number_array.setEnabled(true);
                    self.ui.size.setEnabled(false);
                    self.setRequired("size", false);
                    self.ui.size.setValue("");
                    break;
                case "TIME":
                    self.ui.number_array.setEnabled(true);
                    self.ui.size.setEnabled(true);
                    self.setRequired("size", false);
                    self.ui.size.setValue("");
                    break;
                case "VARCHAR":
                    self.ui.number_array.setEnabled(false);
                    self.ui.size.setEnabled(true);
                    self.setRequired("size", true);
                    break;
            }
        });
        self.ui.visible.setValue(true);
        self.ui.widget.addListener("changeSelection", function () {
            self.ui.method.setEnabled(false);
            self.ui.method.setValue("0");
            self.ui.mode.removeAll();
            self.ui.mode.cleanAll();
            self.ui.mode.setEnabled(false);
            self.ui.filter.setEnabled(false);
            switch (this.getValue()["widget"]) {
                case "camera":
                    self.ui.mode.setEnabled(true);
                    self.ui.mode.populateFromArray(qxnw.config.getModeByWidget(this.getValue()["widget"]));
                    break;
                case "ckeditor":
                    self.ui.mode.setEnabled(true);
                    self.ui.mode.populateFromArray(qxnw.config.getModeByWidget(this.getValue()["widget"]));
                    break;
                case "uploader":
                    self.ui.mode.setEnabled(true);
                    self.ui.mode.populateFromArray(qxnw.config.getModeByWidget(this.getValue()["widget"]));
                    break;
                case "textField":
                    self.ui.mode.setEnabled(true);
                    self.ui.filter.setEnabled(true);
                    self.ui.mode.populateFromArray(qxnw.config.getModeByWidget(this.getValue()["widget"]));
                    break;
                case "textArea":
                    self.ui.mode.setEnabled(true);
                    self.ui.mode.populateFromArray(qxnw.config.getModeByWidget(this.getValue()["widget"]));
                    break;
                case "selectListCheck":
                    self.ui.mode.setEnabled(true);
                    self.ui.mode.populateFromArray(qxnw.config.getModeByWidget(this.getValue()["widget"]));
                    break;
                case "selectBox":
                    self.ui.method.setEnabled(true);
                    self.ui.filter.setEnabled(true);
                    break;
                case "selectTokenField":
                    self.ui.method.setEnabled(true);
                    break;
            }
        });
        self.setFieldVisibility(self.ui.parametro, "excluded");
        self.ui.mode.addListener("addItem", function (e) {
            var item = e.getData();
//            console.log(item);
//            if (item.param == "true") {
//                self.setFieldVisibility(self.ui.parametro, "visible");
//                self.setRequired("parametro", "true");
//            } else {
//                self.setFieldVisibility(self.ui.parametro, "excluded");
//                self.setRequired("parametro", "false");
//            }
        });
        self.ui.primary_key.addListener("click", function () {
            if (this.getValue() == true) {
                self.ui.not_null.setValue(true);
                self.ui.unique.setValue(true);
                self.ui.unique.setEnabled(false);
                self.ui.not_null.setEnabled(false);
            } else {
                self.ui.not_null.setValue(false);
                self.ui.unique.setValue(false);
                self.ui.unique.setEnabled(true);
                self.ui.not_null.setEnabled(true);
            }
        });
        self.ui.descript.addListener("click", function () {
            if (this.getValue() == true) {
                self.setGroupVisibility("descripcion_parametros", "visible");
                self.setGroupVisibility("descripcion", "visible");
                self.ui.method.setEnabled(true);
                self.ui.widget.setEnabled(true);
                self.setRequired("widget", true);
                self.ui.visible.setEnabled(true);
                self.ui.required.setEnabled(true);
                self.ui.mode.setEnabled(true);
                self.ui.label.setEnabled(true);
                self.ui.filter.setEnabled(true);
            } else {
                self.setGroupVisibility("descripcion_parametros", "excluded");
                self.setGroupVisibility("descripcion", "excluded");
                self.ui.method.setEnabled(false);
                self.ui.widget.setEnabled(false);
                self.setRequired("widget", false);
                self.ui.visible.setEnabled(false);
                self.ui.required.setEnabled(false);
                self.ui.mode.setEnabled(false);
                self.ui.label.setEnabled(false);
                self.ui.filter.setEnabled(false);
            }
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    members: {pr: null,
        box1: null,
        deleteButton: null,
        navTable: null,
        texto: null,
        slotValorTotal: function slotValorTotal() {
            var self = this;
            var total = 0;
            var inbound = self.ui.valor_inbound.getValue();
            var outbound = self.ui.valor_outbound.getValue();
            var gd = self.ui.gastos_liberacion.getValue();
            var fd = self.ui.fee_damco.getValue();
            var os = self.ui.otros_servicios.getValue();
            var vt = self.ui.valor_transporte.getValue();
            if (self.pr.via == "2" || self.pr.via == "4") {
                total = parseFloat(inbound) + parseFloat(outbound) + parseFloat(gd) + parseFloat(os);
                self.ui.valor_fac.setValue(total);
            }
            if (self.pr.via == "1" || self.pr.via == "3") {
                total = parseFloat(gd) + parseFloat(fd) + parseFloat(vt) + parseFloat(os);
                self.ui.valor_fac.setValue(total);
            }
        },
        createFooterInfo: function createFooterInfo(secs) {
            var text = "";
            text += " ";
            text += "<b><font color='red'>";
            text += secs;
            text += "</font><b>";
            if (this.pr == null) {
                this.addFooterNoteReplace(text);
            }
        },
        slotEdit: function slotEdit() {
            var self = this;
            var data = this.getRecord();
            if (!self.validate()) {
                return;
            }
            if (data.descript == "true") {
                var descripcion = qxnw.nw_admin_db.functions.processDescriptions(data);
                data.descripcion = descripcion;
            }
            data.model = self.pr.model;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
            rpc.setAsync(true);
            var func = function (r) {
                var funcs = function (s) {
                    if (s == "t") {
                        var d = new qxnw.forms();
                        var fields = [
                            {
                                name: "view",
                                label: "DDL",
                                type: "ckeditor",
                                mode: "cero"
                            }
                        ];
                        d.setFields(fields);
                        d.ui.cancel.hide();
                        d.show();
                        d.setModal(true);
                        d.ui.view.setValue(r);
                        d.ui.accept.addListener("execute", function () {
                            d.accept();
                            self.accept();
                        });
                    }
                };
                qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "viewCompilate", data, funcs);
            };
            rpc.exec("alterField", data, func);
        },
        slotNew: function slotNew() {
            var self = this;
            var data = this.getRecord();
            if (!self.validate()) {
                return;
            }
            if (data.descript == "true") {
                var descripcion = qxnw.nw_admin_db.functions.processDescriptions(data);
                data.descripcion = descripcion;
            }
            data.model = self.pr.model;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
            rpc.setAsync(true);
            var func = function (r) {
                var funcs = function (s) {
                    if (s == "t") {
                        var d = new qxnw.forms();
                        var fields = [
                            {
                                name: "view",
                                label: "DDL",
                                type: "ckeditor",
                                mode: "cero"
                            }
                        ];
                        d.setFields(fields);
                        d.ui.cancel.hide();
                        d.show();
                        d.setModal(true);
                        d.ui.view.setValue(r);
                        d.ui.accept.addListener("execute", function () {
                            d.accept();
                            self.accept();
                        });
                    }
                };
                qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "viewCompilate", data, funcs);
            };
            rpc.exec("addField", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.ui.accept.addListener("execute", function () {
                var data = self.getRecord();
                if (data.descript == "true") {
                    var descripcion = qxnw.nw_admin_db.functions.processDescriptions(data);
                    self.ui.descripcion.setValue(descripcion);
                }
                self.accept();
            });
            return true;
        },
        setParamRecordField: function setParamRecordField(pr) {
            var self = this;
            self.pr = pr;
            if (qxnw.utils.evalue(pr.descripcion)) {
                pr.descript = "t";
                self.setGroupVisibility("descripcion_parametros", "visible");
                self.setGroupVisibility("descripcion", "visible");
                self.ui.method.setEnabled(true);
                self.ui.widget.setEnabled(true);
                self.setRequired("widget", true);
                self.ui.visible.setEnabled(true);
                self.ui.required.setEnabled(true);
                self.ui.mode.setEnabled(true);
                self.ui.label.setEnabled(true);
                self.ui.filter.setEnabled(true);
                var res = pr.descripcion.split(",");
                if (res.length > 0) {
                    if (qxnw.utils.evalue(res[0])) {
                        self.ui.widget.setValue(res[0]);
                    }
                    if (qxnw.utils.evalue(res[1])) {
                        var clas = res[1].split('.');
                        if (clas.length == 2) {
                            self.ui.method.removeAll();
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"class": ""});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"0": "0"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"table": "Tabla"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"array": "Array"});
                            self.ui.clase.setValue(res[1]);
                        } else if (res[1] == 0) {
                            self.ui.method.removeAll();
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"0": "0"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"table": "Tabla"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"array": "Array"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"class": "Clase / Metodo"});
                        } else {
                            if (qxnw.utils.evalue(res[1])) {
                                if (clas == "array") {
                                    self.ui.method.setValue(res[1]);
                                } else {
                                    self.ui.method.setValue("table");
                                    self.ui.table.setValue(res[1]);
                                }

                            }
                        }
                    }
                    if (qxnw.utils.evalue(res[2])) {
                        if (res[2] == "false") {
                            self.ui.visible.setValue(false);
                        } else {
                            self.ui.visible.setValue(true);
                        }
                    }
                    if (qxnw.utils.evalue(res[3])) {
                        if (res[3] == "false") {
                            self.ui.required.setValue(false);
                        } else {
                            self.ui.required.setValue(true);
                        }
                    }
                    if (qxnw.utils.evalue(res[4])) {
                        var mode = {
                            id: res[4],
                            nombre: res[4]
                        };
                        self.ui.mode.addToken(mode);
                    }
                    if (qxnw.utils.evalue(res[6])) {
                        if (res[6] == "false") {
                            self.ui.filter.setValue(false);
                        } else {
                            self.ui.filter.setValue(true);
                        }
                    }
                    if (qxnw.utils.evalue(res[5])) {
                        self.ui.label.setValue(res[5]);
                    }
                }

            }
            if (pr.field_type == "character varying") {
                pr.field_type = "varchar";
            } else {
                var type = pr.field_type.split("(");
                pr.field_type = type[0];
            }
            switch (pr.field_type) {
                case "int":
                    pr.field_type = "integer";
                    break;
                case "bigint":
                    pr.field_type = "serial";
                    break;
            }
            var upper = new qx.type.BaseString(pr.field_type);
            pr.field_type = upper.toUpperCase(pr.field_type);
            self.setRecord(pr);
            self.ui.field_name.setEnabled(false);
            self.ui.accept.addListener("execute", function () {
                self.slotEdit();
            });
            return true;
        },
        setParamRecordDplicate: function setParamRecordDplicate(pr) {
            var self = this;
            if (qxnw.utils.evalue(pr.descripcion)) {
                pr.descript = "t";
                self.setGroupVisibility("descripcion_parametros", "visible");
                self.setGroupVisibility("descripcion", "visible");
                self.ui.method.setEnabled(true);
                self.ui.widget.setEnabled(true);
                self.setRequired("widget", true);
                self.ui.visible.setEnabled(true);
                self.ui.required.setEnabled(true);
                self.ui.mode.setEnabled(true);
                self.ui.label.setEnabled(true);
                self.ui.filter.setEnabled(true);
                var res = pr.descripcion.split(",");
                if (res.length > 0) {
                    if (qxnw.utils.evalue(res[0])) {
                        self.ui.widget.setValue(res[0]);
                    }
                    if (qxnw.utils.evalue(res[1])) {
                        var clas = res[1].split('.');
                        if (clas.length == 2) {
                            self.ui.method.removeAll();
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"class": ""});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"0": "0"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"table": "Tabla"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"array": "Array"});
                            self.ui.clase.setValue(res[1]);
                        } else if (res[1] == 0) {
                            self.ui.method.removeAll();
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"0": "0"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"table": "Tabla"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"array": "Array"});
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"class": "Clase / Metodo"});
                        } else {
                            if (qxnw.utils.evalue(res[1])) {
                                self.ui.method.removeAll();
                                qxnw.utils.populateSelectFromArray(self.ui.method, {"table": "Tabla"});
                                qxnw.utils.populateSelectFromArray(self.ui.method, {"0": "0"});
                                qxnw.utils.populateSelectFromArray(self.ui.method, {"array": "Array"});
                                qxnw.utils.populateSelectFromArray(self.ui.method, {"class": "Clase / Metodo"});
                                self.ui.table.setValue(res[1]);
                            }
                        }
                    }
                    if (qxnw.utils.evalue(res[2])) {
                        if (res[2] == "false") {
                            self.ui.visible.setValue(false);
                        } else {
                            self.ui.visible.setValue(true);
                        }
                    }
                    if (qxnw.utils.evalue(res[3])) {
                        if (res[3] == "false") {
                            self.ui.required.setValue(false);
                        } else {
                            self.ui.required.setValue(true);
                        }
                    }
                    if (qxnw.utils.evalue(res[4])) {
                        var mode = {
                            id: res[4],
                            nombre: res[4]
                        };
                        self.ui.mode.addToken(mode);
                    }
                    if (qxnw.utils.evalue(res[6])) {
                        if (res[6] == "false") {
                            self.ui.filter.setValue(false);
                        } else {
                            self.ui.filter.setValue(true);
                        }
                    }
                    if (qxnw.utils.evalue(res[5])) {
                        self.ui.label.setValue(res[5]);
                    }
                }

            }
            if (pr.field_type == "character varying") {
                pr.field_type = "varchar";
            } else {
                var type = pr.field_type.split("(");
                pr.field_type = type[0];
            }
            var upper = new qx.type.BaseString(pr.field_type);
            pr.field_type = upper.toUpperCase(pr.field_type);
            self.setRecord(pr);
            self.ui.field_name.setTextSelection(0);
            self.ui.accept.addListener("execute", function () {
                self.slotNew();
            });
            return true;
        },
        setParamRecordNew: function setParamRecordNew(pr) {
            var self = this;
            self.pr = pr;
            self.ui.table_name.setValue(pr.nombre);
            self.ui.accept.addListener("execute", function () {
                self.slotNew();
            });
            return true;
        }
    }
});