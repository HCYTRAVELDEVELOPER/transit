qx.Class.define("qxnw.nw_excel_reports.forms.f_ne_er", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setTitle(this.tr("Reporte dinámico en Excel"));
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
                type: "textField",
                required: true
            },
            {
                name: "sql_query",
                label: "SQL Query",
                type: "textArea",
                mode: "maxWidth"
            }
        ];

        self.setFields(fields);
        
        self.ui.sql_query.setFilter(/[^\\]/g);

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        self.ntFilters = new qxnw.navtable(self);
        self.ntFilters.setContextMenu("contextMenu");
        self.ntFilters.setTitle("");
        self.ntFilters.createBase();

        var columns = [
            {
                label: "ID",
                caption: "id"
            },
            {
                label: self.tr("Nombre"),
                caption: "nombre"
            },
            {
                label: self.tr("Label"),
                caption: "label"
            },
            {
                label: self.tr("Type"),
                caption: "type"
            },
            {
                label: self.tr("Required"),
                caption: "required",
                type: "boolean"
            },
            {
                label: self.tr("Required"),
                caption: "required_nom"
            },
            {
                label: self.tr("Descripción"),
                caption: "descripcion"
            }
        ];
        self.ntFilters.setColumns(columns);
        self.ntFilters.hideColumn("id");
        self.ntFilters.hideColumn("required");
        var agregarButton = self.ntFilters.getAddButton();
        self.deleteButton = self.ntFilters.getRemoveButton();
        self.deleteButton.addListener("execute", function () {
            self.ntFilters.removeSelectedRow();
        });
        agregarButton.addListener("execute", function () {
            var d = new qxnw.nw_reports.forms.f_filtros();
            d.settings.accept = function () {
                var data = d.getRecord();
                if (data["required"] == false) {
                    data["required_nom"] = "NO";
                } else {
                    data["required_nom"] = "SI";
                }
                self.ntFilters.addRows([data]);
            };
            d.show();
        });
        self.insertNavTable(self.ntFilters.getBase(), "Filtros");

        var buttons = [
            {
                name: "vista_previa",
                label: self.tr("Generar informe"),
                icon: qxnw.config.execIcon("office-spreadsheet", "apps")
            }
        ];
        self.addButtons(buttons);

        self.ui.vista_previa.addListener("execute", function () {
            self.vistaPrevia();
        });
    },
    destruct: function () {
    },
    members: {
        ntFilters: null,
        code: null,
        vistaPrevia: function vistaPrevia() {
            var self = this;
            self.code = self.ui.id.getValue();
            if (self.code == null) {
                qxnw.utils.information(self.tr("Debe guardar el informe para la vista previa"));
                return;
            }
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "excelReport");
            rpc.setAsync(true);
            var func = function (r) {
                if (r.length == 1) {
                    var data = {};
                    data["id"] = self.code;
                    var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "excelReport");
                    rpc.setTimeOut(50000);
                    rpc.setAsync(true);
                    var func = function (ra) {
                        if (ra == false) {
                            qxnw.utils.information(self.tr("No se crearon los datos"));
                        } else {
                            if (qx.core.Environment.get("browser.name") == "ie") {
                                window.open(ra, "ExportDataIE", "width=200, height=100");
                            } else {
                                window.location.href = ra;
                            }
                        }
                    };
                    rpc.exec("exportXLS", data, func);
                    return;
                }
                self.__excelEnc = r[r.length - 1];
                r.splice(r.length - 1, 1);
                var er = new qxnw.forms();
                er.setTitle(self.tr("Reporte automatizado para Excel"));
                er.setFields(r);
                er.setTableMethod("master");
                er.processDescriptions(r);
                er.ui.accept.addListener("execute", function () {
                    if (!er.validate()) {
                        return;
                    }
                    var data = er.getRecord();
                    data["id"] = self.__excelEnc["id"];
                    var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "excelReport");
                    rpc.setTimeOut(50000);
                    rpc.setAsync(true);
                    var func = function (r) {
                        if (r == false) {
                            qxnw.utils.information(self.tr("No se crearon los datos"));
                        } else {
                            if (qx.core.Environment.get("browser.name") == "ie") {
                                window.open(r, "ExportDataIE", "width=200, height=100");
                            } else {
                                window.location.href = r;
                            }
                        }
                    };
                    rpc.exec("exportXLS", data, func);
                });
                er.ui.cancel.addListener("execute", function () {
                    er.reject();
                });
                er.show();
            };
            rpc.exec("getFilters", self.code, func);
        },
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                self.slotEditar();
            });
            m.setParentWidget(self.ntFilters);
            m.exec(pos);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var r = self.ntFilters.selectedRecord();
            if (typeof r == 'undefined') {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            var d = new qxnw.nw_reports.forms.f_filtros();
            if (!d.setParamRecord(r)) {
                return;
            }
            d.settings.accept = function () {
                var data = d.getRecord();
                if (data["required"] == false) {
                    data["required_nom"] = "NO";
                } else {
                    data["required_nom"] = "SI";
                }
                self.ntFilters.removeSelectedRow();
                self.ntFilters.addRows([data]);
            };
            d.show();
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = self.getRecord();
            data.detalleFiltros = self.ntFilters.getAllData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "excelReport");
            rpc.setAsync(true);
            var func = function (r) {
                self.code = r;
                if (self.pr != null) {
                    qxnw.utils.question(self.tr("Guardado correctamente. ¿Desea cerrar la ventana?"), function (e) {
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
            pr.sql_query = qxnw.utils.replaceAll(pr.sql_query, "$", "'");
            self.code = pr.id;
            self.setRecord(pr);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "excelReport"); //hace la consulta 
            rpc.setAsync(true);
            var func = function (r) {
                self.ntFilters.setModelData(r);
            };
            rpc.exec("getSimpleFilters", pr, func);
            return true;
        }
    }
});