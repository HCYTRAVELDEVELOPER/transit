qx.Class.define("qxnw.nw_admin_db.forms.f_tables", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("Tablas");
        self.navTable = new qxnw.navtable(self);
        self.navTable.setContextMenu("contextMenu");
        self.navTable.createBase();
        var columns = [
            {
                label: self.tr("Tabla Pública"),
                caption: "table_name"
            },
            {
                label: self.tr("Nombre Campo"),
                caption: "field_name"
            },
            {
                label: self.tr("Tipo Campo"),
                caption: "field_type"
            },
            {
                label: self.tr("Tamaño"),
                caption: "size"
            },
            {
                label: self.tr("Posición"),
                caption: "ordinal_position"
            },
            {
                label: self.tr("Llave"),
                caption: "primary_key",
                type: "checkbox"
            },
            {
                label: self.tr("Unico"),
                caption: "unique",
                type: "checkbox"
            },
            {
                label: self.tr("No nulo"),
                caption: "not_null",
                type: "checkbox"
            },
            {
                label: self.tr("Default"),
                caption: "default"
            },
            {
                label: self.tr("Descripción"),
                caption: "descripcion"
            }];
        self.navTable.setColumns(columns);
        self.insertNavTable(self.navTable.getBase(), self.tr("Campos"));
        var refrescar = self.navTable.getAddButton();
        var nuevo_campo = self.navTable.getRemoveButton();
        self.navTable.ui.exportButton.setVisibility("excluded");
        self.navTable.ui.autoWidthButton.setVisibility("excluded");
        refrescar.set({
            label: self.tr("Actualizar"),
            icon: qxnw.config.execIcon("view-refresh"),
            width: 100
        });
        nuevo_campo.set({
            label: self.tr("Nuevo"),
            icon: qxnw.config.execIcon("list-add"),
            width: 90
        });
        var data = {};
        data.label = "Editar";
        data.name = "editar";
        data.icon = qxnw.config.execIcon("dialog-cancel");
        self.navTable.addButtons(data);
        data = {};
        data.label = "Borrar";
        data.name = "borrar";
        data.icon = qxnw.config.execIcon("edit-delete");
        self.navTable.addButtons(data);
        data = {};
        data.label = "Renombrar";
        data.name = "renombrar";
        data.icon = qxnw.config.execIcon("edit-clear");
        self.navTable.addButtons(data);
        data = {};
        data.label = "Duplicar";
        data.name = "duplicar";
        data.icon = qxnw.config.execIcon("dialog-ok");
        self.navTable.addButtons(data);
        data = {};
        data.label = "Ordenar Campos";
        data.name = "ordenar";
        data.icon = qxnw.config.execIcon("format-justify-fill");
        self.navTable.addButtons(data);
        self.navTable.ui.ordenar.set({
            width: 140
        });
        self.navTable.ui.editar.set({
            width: 90
        });
        self.navTable.ui.duplicar.set({
            width: 90
        });
        self.navTable.ui.borrar.set({
            width: 90
        });
        self.navTable.ui.renombrar.set({
            width: 110
        });
        refrescar.addListener("click", function () {
            self.populateFields();
        });
        nuevo_campo.addListener("click", function () {
            self.slotNewField();
        });
        self.navTable.ui.ordenar.addListener("click", function () {
            self.slotRecorderFields();
        });
        self.navTable.ui.duplicar.addListener("click", function () {
            self.slotDuplicateField();
        });
        self.navTable.ui.borrar.addListener("click", function () {
            self.slotDeleteField();
        });
        self.navTable.ui.renombrar.addListener("click", function () {
            self.slotRenameField();
        });
        self.navTable.ui.editar.addListener("click", function () {
            self.slotEditField();
        });
        self.data = new qxnw.nw_admin_db.lists.l_data();
        self.insertWidget(self.data, self.tr("Data"));
        self.desc = new qxnw.forms();
        var fields_desc = [
            {
                name: "description",
                label: "Descripción",
                type: "textArea"
            }
        ];
        self.desc.setFields(fields_desc);
        self.desc.setNoFilter("description");
        self.desc.ui.accept.addListener("click", function () {
            var data = self.desc.getRecord();
            data.tabla = self.pr.nombre;
            data.model = self.pr.model;
            var funcs = function () {
                qxnw.utils.information("Descripción actualizada");
                return;
            };
            qxnw.utils.fastRpcAsyncCall("nw_admin_table_init", "setCommentNewTable", data, funcs);
        });
        self.insertWidget(self.desc, self.tr("Descripción"));

        self.ddl = new qxnw.forms();
        var fields_desc = [
            {
                name: "ddl",
                label: "DDL",
                type: "textArea"
            }
        ];
        self.ddl.setFields(fields_desc);
        self.ddl.setNoFilter("ddl");
        self.insertWidget(self.ddl, self.tr("Indices"));
        self.insertWidget(self.ddl, self.tr("Permisos"));
        self.insertWidget(self.ddl, self.tr("DDL"));
        var table = self.navTable.getTable();
        table.addListener("cellClick", function (e) {
            self.slotEditField();
        });

    },
    destruct: function () {
    },
    members: {pr: null,
        box1: null,
        deleteButton: null,
        navTable: null,
        data: null,
        texto: null,
        populateFields: function populateFields(table) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
            rpc.setAsync(true);
            var func = function (r) {
                for (var i = 0; i < r.length; i++) {
                    if (qxnw.utils.evalue(r[i].unica)) {
                        r[i].unique = r[i].unica;
                    }
                }
                self.navTable.setModelData(r);
                r.tabla = self.pr.nombre;
                r.model = self.pr.model;
                self.data.slotColumns(r);
            };
            rpc.exec("populateFieldsByTable", self.pr, func);
        },
        populateUpdate: function populateUpdate(table) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
            rpc.setAsync(true);
            var func = function (r) {
                var data = self.navTable.getAllData();
                for (var i = 0; i < r.length; i++) {
                    if (qxnw.utils.evalue(r[i].unica)) {
                        r[i].unique = r[i].unica;
                    }
                }
                self.navTable.setModelData(r);
                r.tabla = self.pr.nombre;
            };
            rpc.exec("populateFieldsByTable", self.pr, func);
        },
        slotNewField: function slotNewField(table) {
            var self = this;
            var d = new qxnw.nw_admin_db.forms.f_field();
            var sl = self.navTable.selectedRecord();
            d.setParamRecordNew(self.pr);
            d.settings.accept = function () {
                self.populateUpdate();
            };
            d.show();
        },
        slotRenameField: function slotRenameField(pr) {
            var self = this;
            var si = self.navTable.selectedRecord();
            var d = new qxnw.forms();
            var fields = [
                {
                    name: "rename_field",
                    label: "Nombre",
                    type: "textField",
                    required: true
                }
            ];
            d.setFields(fields);
            d.ui.rename_field.setValue(si.field_name.toString());
            d.ui.rename_field.setTextSelection(0);
            d.ui.cancel.addListener("execute", function () {
                d.reject();
            });
            d.ui.accept.addListener("execute", function () {
                if (!d.validate()) {
                    return;
                }
                self.data = d.getRecord();
                if (self.data.rename_field == si.field_name) {
                    d.accept();
                    return;
                }
                qxnw.utils.question("<b>¿Esta Seguro de renombrar este campo public." + si.field_name, function (e) {
                    if (e) {
                        d.accept();
                        self.data.detalle = si;
                        self.data.model = self.pr.model;
                        var funcs = function () {
                            self.populateUpdate();
                        };
                        qxnw.utils.fastRpcAsyncCall("nw_admin_table_init", "renameField", self.data, funcs);
                    } else {
                        return;
                    }
                });
            });
            d.show();
        },
        slotDeleteField: function slotDeleteField(pr) {
            var self = this;
            var si = self.navTable.selectedRecord();
            qxnw.utils.question("<b>¿Esta Seguro de borrar este campo public." + si.field_name, function (e) {
                if (e) {
                    self.data.detalle = si;
                    si.model = self.pr.model;
                    var funcs = function () {
                        self.populateUpdate();
                    };
                    qxnw.utils.fastRpcAsyncCall("nw_admin_table_init", "deleteField", si, funcs);
                }
            });
        },
        Description: function Description(pr) {
            var self = this;
            var si = self.navTable.selectedRecord();
            var funcs = function (r) {
                if (r) {
                    self.desc.ui.description.setValue(r);
                }
            };
            qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "populateDescriptionTable", self.pr, funcs);
        },
        DDL: function DDL(pr) {
            var self = this;
            var si = self.navTable.selectedRecord();
            var funcs = function (r) {
                if (r) {
                    self.ddl.ui.ddl.setValue(r);
                }
            };
            qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "populateDDL", self.pr, funcs);
        },
        slotEditField: function slotEditField(sl) {
            var self = this;
            var sl = self.navTable.selectedRecord();
            var d = new qxnw.nw_admin_db.forms.f_field();
            if (sl == null) {
                qxnw.utils.information("Seleccione un campo por editar");
                return;
            }
            sl.model = self.pr.model;
            d.setParamRecordField(sl);
            d.settings.accept = function () {
                self.populateUpdate();
            };
            d.show();
        },
        slotDuplicateField: function slotDuplicateField(sl) {
            var self = this;
            var sl = self.navTable.selectedRecord();
            var d = new qxnw.nw_admin_db.forms.f_field();
            if (sl == null) {
                qxnw.utils.information("Seleccione un campo por editar");
                return;
            }
            d.setParamRecordDplicate(sl);
            d.settings.accept = function () {
                self.populateUpdate();
            };
            d.show();
        },
        slotRecorderFields: function slotRecorderFields(sl) {
            var self = this;
            var sl = self.navTable.selectedRecord();
            var d = new qxnw.nw_admin_db.forms.f_ordenar();
            if (sl == null) {
                qxnw.utils.information("Seleccione un campo por editar");
                return;
            }
            d.setParamRecordNew(self.pr);
            d.settings.accept = function () {
                self.populateUpdate();
            };
            d.show();
        },
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            data.detalle = self.navTable.getAllData();
            data.texto = self.texto;
            data.model = self.pr.model;
            if (!self.validate()) {
                return;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "geimp_vista");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept();
            };
            rpc.exec("save_transito_proceso_aduanas", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.pr = pr;
            self.pr.model = pr.model;
            self.data.ui.tabla.setValue(pr.nombre);
            self.populateFields();
            self.Description();
            self.DDL();
            return true;
        }
    }
});