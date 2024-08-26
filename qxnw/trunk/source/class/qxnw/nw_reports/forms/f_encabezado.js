qx.Class.define("qxnw.nw_reports.forms.f_encabezado", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle("Agregar Encabezado");
        this.createBase();
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "nombre",
                label: "Nombre",
                caption: "nombre",
                type: "textField",
                required: true
            },
            {
                name: "tipo",
                label: "Tipo",
                caption: "tipo",
                type: "selectBox"
            },
            {
                name: "ancho",
                label: "Ancho",
                caption: "ancho",
                type: "textField"
            },
            {
                name: "alto",
                label: "Alto",
                caption: "alto",
                type: "textField"
            },
            {
                name: "sql_query",
                label: "SQL Query",
                type: "textArea",
                mode: "maxWidth"
            }
        ];

        this.setFields(fields);
        var data = {};
        data.table = "nw_reports_types";

        qxnw.utils.populateSelectAsync(self.ui.tipo, "master", "populate", data);

        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });

        self.navTableFormulario = new qxnw.navtable(self);
        self.navTableFormulario.setContextMenu("contextMenu");
        self.navTableFormulario.setTitle("");
        self.navTableFormulario.createBase();

        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Orden",
                caption: "orden"
            }];


        self.navTableFormulario.setColumns(columns);
        var agregarButton = self.navTableFormulario.getAddButton();
        self.deleteButton = self.navTableFormulario.getRemoveButton();
        self.deleteButton.addListener("click", function() {
            self.navTableFormulario.removeSelectedRow();
        });
        agregarButton.addListener("click", function() {
            var d = new qxnw.nw_reports.forms.f_columnas();
            d.settings.accept = function() {
                var data = d.getRecord();
                self.navTableFormulario.addRows([data]);
            };
            d.show();
        });

        self.insertNavTable(self.navTableFormulario.getBase(), "Columnas");

        //navtable2        

        self.navTableFormulario2 = new qxnw.navtable(self);
        self.navTableFormulario2.setContextMenu("contextMenu2");
        self.navTableFormulario2.setTitle("");
        self.navTableFormulario2.createBase();

        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: "Nombre",
                caption: "nombre"
            },
            {
                label: "Label",
                caption: "label"
            },
            {
                label: "Type",
                caption: "type"
            },
            {
                label: "Required",
                caption: "required"
            },
            {
                label: "Required",
                caption: "required_nom"
            }
        ];

        self.navTableFormulario2.setColumns(columns);
        self.navTableFormulario2.hideColumn("required");
        var agregarButton = self.navTableFormulario2.getAddButton();
        self.deleteButton = self.navTableFormulario2.getRemoveButton();
        self.deleteButton.addListener("execute", function() {
            self.navTableFormulario2.removeSelectedRow();
        });
        agregarButton.addListener("execute", function() {
            var d = new qxnw.nw_reports.forms.f_filtros();
            d.settings.accept = function() {
                var data = d.getRecord();
                if (data["required"] == false) {
                    data["required_nom"] = "NO";
                } else {
                    data["required_nom"] = "SI";
                }
                self.navTableFormulario2.addRows([data]);
            };
            d.show();
        });

        self.insertNavTable(self.navTableFormulario2.getBase(), "Filtros");

    },
    destruct: function() {
    },
    members: {
        navTableFormulario: null,
        navTableFormulario2: null,
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function(e) {
                self.slotEditar();
            });
            m.setParentWidget(self.navTableFormulario);
            m.exec(pos);
        },
        contextMenu2: function contextMenu2(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function(e) {
                self.slotEditar2();
            });
            m.setParentWidget(self.navTableFormulario2);
            m.exec(pos);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.navTableFormulario.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_reports.forms.f_columnas();
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function() {
                var data = d.getRecord();
                self.navTableFormulario.removeSelectedRow();
                self.navTableFormulario.addRows([data]);
            };
            d.show();
        },
        slotEditar2: function slotEditar2() {
            var self = this;
            var r = self.navTableFormulario2.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_reports.forms.f_filtros();
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function() {
                var data = d.getRecord();
                self.navTableFormulario2.removeSelectedRow();
                self.navTableFormulario2.addRows([data]);
            };
            d.show();
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            data.detalleColumnas = self.navTableFormulario.getAllData();
            data.detalleFiltros = self.navTableFormulario2.getAllData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "encabezado");
            rpc.setAsync(true);
            var func = function(r) {
                if (self.pr != null) {
                    qxnw.utils.question(self.tr("Guardado correctamente. ¿Desea cerrar la ventana?"), function(e) {
                        if (e) {
                            self.accept();
                        }
                    });
                } else {
                    self.accept();
                }
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.pr = pr;
            self.setRecord(pr);
            var buttons = [
                {
                    name: "vista_previa",
                    label: self.tr("Vista Previa"),
                    icon: qxnw.config.execIcon("office-spreadsheet", "apps")
                }
            ];
            self.addButtons(buttons);

            self.ui.vista_previa.addListener("execute", function() {
                var re = new qxnw.reports();
                re.start(pr.id);
                re.show();
            });
            var rpc = new qxnw.rpc(self.getRpcUrl(), "columnas"); //hace la consulta 
            rpc.setAsync(true);
            var func = function(r) {
                self.navTableFormulario.setModelData(r);
                self.setParamRecord2(pr);
            };
            rpc.exec("consulta", pr, func);
            return true;
        },
        setParamRecord2: function setParamRecord2(pr) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "filtros"); //hace la consulta 
            rpc.setAsync(true);
            var func = function(r) {
                self.navTableFormulario2.setModelData(r);
            };
            rpc.exec("consulta", pr, func);
            return true;
        }

    }
});