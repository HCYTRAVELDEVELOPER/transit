qx.Class.define("qxnw.nw_admin_db.forms.f_description_table", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("Nuevo / Editar Campo");
        self.orden_cargue = {};
        self.setGroupHeader("Descripción tabla");
        var fields = [
            {
                name: "Descripción tabla",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "cleanhtml",
                label: self.tr("<strong>Clean Html</strong>"),
                type: "checkBox"
            },
            {
                name: "unique_fields",
                label: self.tr("<strong>Uniqiue Fields</strong>"),
                type: "textField"
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }];
        self.setFields(fields);
        self.ui.cleanhtml.setValue(true);
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.navTable_table = new qxnw.navtable(self);
        self.navTable_table.setContextMenu("contextMenu");
        self.navTable_table.createBase();
        var columns = [
            {
                label: self.tr("Nombre Navtable"),
                caption: "navtable_name"
            },
            {
                label: self.tr("Titulo"),
                caption: "tittle"
            },
            {
                label: self.tr("Tabla"),
                caption: "table"
            },
            {
                label: self.tr("Campo"),
                caption: "reference"
            }];
        self.navTable_table.setColumns(columns);
        self.insertNavTable(self.navTable_table.getBase(), self.tr("NavTables"));
        self.agregarButton_nav = self.navTable_table.getAddButton();
        self.deleteButton_nav = self.navTable_table.getRemoveButton();
        self.deleteButton_nav.addListener("click", function () {
            self.navTable_table.removeSelectedRow();
        });
        self.agregarButton_nav.addListener("click", function () {
            var f = new qxnw.forms();
            var fields = [
                {
                    name: "tittle",
                    label: "Titulo",
                    type: "textField",
                    required: true
                },
                {
                    name: "table",
                    label: "Tabla",
                    type: "selectBox",
                    required: true
                },
                {
                    name: "navtable_name",
                    label: "Nombre",
                    type: "textField",
                    required: true
                },
                {
                    name: "reference",
                    label: "Referencia",
                    type: "textField",
                    required: true
                }
            ];
            f.setFields(fields);
            qxnw.utils.populateSelectFromArray(f.ui.table, {"": "Seleccione"});
            qxnw.utils.populateSelectAsync(f.ui.table, "nw_admin_tables", "populateTables", 0);
            f.ui.cancel.addListener("click", function () {
                f.reject();
            });
            f.ui.accept.addListener("click", function () {
                if (!self.validate()) {
                    return;
                }
                f.accept();
                var data = f.getRecord();
                self.navTable_table.addRows([data]);
            });
            f.show();
        });
        self.navTable_selectBox = new qxnw.navtable(self);
        self.navTable_selectBox.setContextMenu("contextMenu");
        self.navTable_selectBox.createBase();
        var columns = [
            {
                label: self.tr("Name"),
                caption: "name"
            },
            {
                label: self.tr("Data"),
                caption: "data"
            }];
        self.navTable_selectBox.setColumns(columns);
        self.insertNavTable(self.navTable_selectBox.getBase(), self.tr("SelectBox"));
        self.agregarButton_sel = self.navTable_selectBox.getAddButton();
        self.deleteButton_sel = self.navTable_selectBox.getRemoveButton();
        self.agregarButton_sel.addListener("click", function () {
            var f = new qxnw.forms();
            var fields = [
                {
                    name: "name",
                    label: "Name",
                    type: "textField",
                    required: true
                },
                {
                    name: "data",
                    label: "Data",
                    type: "textArea",
                    required: true
                }];
            f.setFields(fields);
            f.ui.cancel.addListener("click", function () {
                f.reject();
            });
            f.ui.accept.addListener("click", function () {
                if (!self.validate()) {
                    return;
                }
                f.accept();
                var data = f.getRecord();
                self.navTable_selectBox.addRows([data]);
            });
            f.show();
        });
        self.deleteButton_sel.addListener("click", function () {
            self.navTable_selectBox.removeSelectedRow();
        });
        self.navTable_contex = new qxnw.navtable(self);
        self.navTable_contex.setContextMenu("contextMenu");
        self.navTable_contex.createBase();
        var columns = [
            {
                label: self.tr("label"),
                caption: "label"
            },
            {
                label: self.tr("Icon"),
                caption: "icon"
            },
            {
                label: self.tr("Slot"),
                caption: "slot"
            },
            {
                label: self.tr("Question"),
                caption: "question"
            },
            {
                label: self.tr("Question Ask"),
                caption: "question_ask"
            },
        ];
        self.navTable_contex.setColumns(columns);
        self.insertNavTable(self.navTable_contex.getBase(), self.tr("ContexMenu"));
        self.agregarButton_con = self.navTable_contex.getAddButton();
        self.deleteButton_con = self.navTable_contex.getRemoveButton();
        self.agregarButton_con.addListener("click", function () {
            self.res = new qxnw.forms();
            var fields = [
                {
                    name: "label",
                    label: "Label",
                    type: "textField",
                    required: true
                },
                {
                    name: "tipo_icono",
                    label: self.tr("<strong>Tipo Icono</strong>"),
                    type: "selectBox"
                },
                {
                    name: "tamano_icono",
                    label: self.tr("<strong>Tamaño Icono</strong>"),
                    type: "selectBox"
                },
                {
                    name: "icono",
                    label: self.tr("<strong>Icono</strong>"),
                    type: "selectBox"
                },
                {
                    name: "slot",
                    label: self.tr("<strong>Slot</strong>"),
                    type: "textField",
                    required: true
                },
                {
                    name: "question",
                    label: self.tr("<strong>Question</strong>"),
                    type: "checkBox"
                },
                {
                    name: "question_ask",
                    label: self.tr("<strong>Question Ask</strong>"),
                    type: "textField",
                    required: true
                }];
            self.res.setFields(fields);
            self.res.ui.cancel.addListener("click", function () {
                self.res.reject();
            });
            self.res.ui.accept.addListener("click", function () {
                if (!self.res.validate()) {
                    return;
                }
                f.accept();
                var data = self.res.getRecord();
                self.navTable_contex.addRows([data]);
            });
            self.res.show();
            var data = {};
            data[""] = "Seleccione";
            qxnw.utils.populateSelectFromArray(self.res.ui.tipo_icono, data);
            qxnw.utils.populateSelectFromArray(self.res.ui.icono, data);
            data = {};
            data["qxnw"] = "QXNW";
            qxnw.utils.populateSelectFromArray(self.res.ui.tipo_icono, data);
            qxnw.utils.populateSelectFromArray(self.res.ui.tipo_icono, qxnw.config.getIconsCategories2DArray());

            data = ["16", "22", "32", "48", "64"];
            qxnw.utils.populateSelectFromArray(self.res.ui.tamano_icono, data);
            self.res.ui.tipo_icono.addListener("changeSelection", function () {
                self.populateIconsByType(this.getValue());
            });
        });
        self.deleteButton_con.addListener("click", function () {
            self.navTable_contex.removeSelectedRow();
        });
    },
    members: {pr: null,
        res: null,
        deleteButton: null,
        navTable: null,
        texto: null,
        populateIconsByType: function populateIconsByType(d) {
            var self = this;
            self.res.ui.icono.removeAll();
            var ti = self.res.ui.tamano_icono.getValue();
            var data = {};
            var prefix = "";
            if (qx.core.Environment.get("qx.debug")) {
                prefix = "/source";
            }
            if (d["tipo_icono"] == "qxnw") {
                data["ubicacion"] = prefix + "/resource/qxnw/icon/" + ti.tamano_icono_text + "/";
            } else {
                data["ubicacion"] = prefix + "/resource/qx/icon/Tango/" + ti.tamano_icono_text + "/" + d["tipo_icono"];
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_menu", true);
            var func = function (r) {
                var item;
                var mod;
                var v = new Array();
                for (v in r) {
                    mod = v;
                    item = r[v];
                    var selectItem = new qxnw.widgets.listItem(qxnw.utils.ucfirst(item.replace(".png", "")),
                            data["ubicacion"] + "/" + mod);
                    var model = mod;
                    if (d["tipo_icono"] == "qxnw") {
                        selectItem.setModel(d["tipo_icono"] + "/" + ti.tamano_icono_text + "/" + model);
                    } else {
                        selectItem.setModel("/" + d["tipo_icono"] + "/" + model);
                    }
                    self.res.ui.icono.add(selectItem);
                }
            };
            rpc.exec("getSystemIcons", data, func);
        },
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
        }
        ,
        createFooterInfo: function createFooterInfo(secs) {
            var text = "";
            text += " ";
            text += "<b><font color='red'>";
            text += secs;
            text += "</font><b>";
            if (this.pr == null) {
                this.addFooterNoteReplace(text);
            }
        }
        ,
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
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept();
            };
            rpc.exec("alterField", data, func);
        }
        ,
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

            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept();
            };
            rpc.exec("addField", data, func);
        }
        ,
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.ui.accept.addListener("execute", function () {
                var data = self.getRecord();
                console.log(data);
                if (data.descript == "true") {
                    var descripcion = qxnw.nw_admin_db.functions.processDescriptions(data);
                    self.ui.descripcion.setValue(descripcion);
                }
                self.accept();
            });
            return true;
        }
        ,
        setParamRecordField: function setParamRecordField(pr) {
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
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"class": "Clase / Metodo"});
                            self.ui.clase.setValue(res[1]);
                        } else if (res[1] == 0) {
                            self.ui.method.removeAll();
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"0": "0"});
                        } else {
                            if (qxnw.utils.evalue(res[1])) {
                                self.ui.method.removeAll();
                                qxnw.utils.populateSelectFromArray(self.ui.method, {"table": "Tabla"});
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
            }
            var upper = new qx.type.BaseString(pr.field_type);
            pr.field_type = upper.toUpperCase(pr.field_type);
            self.setRecord(pr);
            self.ui.field_name.setEnabled(false);
            self.ui.accept.addListener("execute", function () {
                self.slotEdit();
            });
            return true;
        }
        ,
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
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"class": "Clase / Metodo"});
                            self.ui.clase.setValue(res[1]);
                        } else if (res[1] == 0) {
                            self.ui.method.removeAll();
                            qxnw.utils.populateSelectFromArray(self.ui.method, {"0": "0"});
                        } else {
                            if (qxnw.utils.evalue(res[1])) {
                                self.ui.method.removeAll();
                                qxnw.utils.populateSelectFromArray(self.ui.method, {"table": "Tabla"});
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
            }
            var upper = new qx.type.BaseString(pr.field_type);
            pr.field_type = upper.toUpperCase(pr.field_type);
            self.setRecord(pr);
            self.ui.field_name.setTextSelection(0);
            self.ui.accept.addListener("execute", function () {
                self.slotNew();
            });
            return true;
        }
        ,
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