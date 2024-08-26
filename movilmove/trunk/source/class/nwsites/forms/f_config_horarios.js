qx.Class.define("nwsites.forms.f_config_horarios", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setTitle("Crear/Editar Config Horarios");
        self.setColumnsFormNumber(1);
        self.createBase();
        var fields = [
            {
                name: "id",
                label: self.tr("ID"),
                type: "textField",
                visible: false
            },
            {
                name: "nombre",
                label: self.tr("Nombre"),
                type: "textField",
                required: true
            },
            {
                name: "empresa_cliente",
                label: self.tr("Empresa Cliente"),
                type: "selectBox"
            }
        ];
        self.setFields(fields);

        var data = {};
        data[""] = self.tr("Seleccione");
        qxnw.utils.populateSelectFromArray(self.ui.empresa_cliente, data);
        data.table = "pv_empresas_clientes";
        qxnw.utils.populateSelect(self.ui.empresa_cliente, "master", "populate", data);

        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        self.navTable = new qxnw.navtable(self);
        self.navTable.setContextMenu("contextMenu");
        self.navTable.createBase();
        var columns = [
            {
                label: self.tr("ID"),
                caption: "id"
            },
            {
                label: self.tr("Hora Inicial"),
                caption: "hora_inicial"
            },
            {
                label: self.tr("Hora Final"),
                caption: "hora_final"
            },
            {
                label: self.tr("Fecha"),
                caption: "fecha"
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            }
        ];
        self.navTable.setColumns(columns);
        self.navTable.hideColumn("id");
        self.navTable.hideColumn("fecha");
        self.navTable.hideColumn("usuario");
        var agregarButton = self.navTable.getAddButton();
        self.deleteButton = self.navTable.getRemoveButton();
        self.deleteButton.addListener("click", function () {
            self.navTable.removeSelectedRow();
        });
        agregarButton.addListener("click", function () {
            self.abreItem();
        });
        self.insertNavTable(self.navTable.getBase(), self.tr("Horas Atención"));


        self.navTableDos = new qxnw.navtable(self);
        self.navTableDos.setContextMenu("contextMenu_dos");
        self.navTableDos.createBase();
        var columns = [
            {
                label: self.tr("ID"),
                caption: "id"
            },
            {
                label: self.tr("Día (número) de la Semana"),
                caption: "dia_semana"
            },
            {
                label: self.tr("Fecha"),
                caption: "fecha"
            },
            {
                label: self.tr("Usuario"),
                caption: "usuario"
            }
        ];
        self.navTableDos.setColumns(columns);
        self.navTableDos.hideColumn("id");
        self.navTableDos.hideColumn("fecha");
        self.navTableDos.hideColumn("usuario");
        var agregarButton = self.navTableDos.getAddButton();
        self.deleteButton = self.navTableDos.getRemoveButton();
        self.deleteButton.addListener("click", function () {
            self.navTableDos.removeSelectedRow();
        });
        agregarButton.addListener("click", function () {
            self.abreItem("", "dos");
        });
        self.insertNavTable(self.navTableDos.getBase(), self.tr("Días de la semana de atención"));
    },
    destruct: function () {
    },
    members: {
        pr: null,
        abreItem: function abreItem(pr, tipo, mode) {
            var self = this;
            if (tipo == "dos") {
                var fields = [
                    {
                        name: "id",
                        type: "textField",
                        label: self.tr("ID"),
                        visible: false
                    },
                    {
                        name: "dia_semana",
                        type: "textField",
                        label: self.tr("Día (número) de la Semana"),
                        required: true
                    }
                ];
            } else {
                var fields = [
                    {
                        name: "id",
                        type: "textField",
                        label: self.tr("ID"),
                        visible: false
                    },
                    {
                        name: "hora_inicial",
                        type: "textField",
                        label: self.tr("Hora Inicial"),
                        required: true
                    },
                    {
                        name: "hora_final",
                        type: "textField",
                        label: self.tr("Hora Final"),
                        required: true
                    }
                ];
            }
            var f = qxnw.utils.dialog(fields, this.tr("Horas Tienda Ventana"), true);
            f.setModal(true);
            f.setWidth(400);
            f.setHeight(180);
            if (mode == "edit") {
                f.ui.cancel.setVisibility("hidden");
            }
            if (pr != "" && pr != undefined) {
                f.setRecord(pr);
            }
            f.settings.accept = function () {
                var r = f.getRecord();
                f.reject();
                if (tipo == "dos") {
                    self.navTableDos.addRows([r]);
                } else {
                    self.navTable.addRows([r]);
                }
            };
        },
        slotEliminar: function slotEliminar(r) {
            var self = this;
            var rpc = new qxnw.rpc(this.rpcUrl, "nwforms");
            rpc.setAsync(true);
            var func = function () {
                self.navTable.removeSelectedRow();
            };
            rpc.exec("eliminarCampo", r, func);
        },
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(self);
            m.addAction("Editar", qxnw.config.execIcon("document-properties"), function (e) {
                self.slotEditar();
            });
            m.setParentWidget(self.navTable);
            m.exec(pos);
        },
        slotEditar: function slotEditar() {
            var self = this;
            var data = self.navTable.selectedRecord();
            if (data == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            self.navTable.removeSelectedRow();
            self.abreItem(data, "uno", "edit");
        },
        contextMenu_dos: function contextMenu_dos(pos) {
            var self = this;
            var m = new qxnw.contextmenu(self);
            m.addAction("Editar", qxnw.config.execIcon("document-properties"), function (e) {
                self.slotEditar_dos();
            });
            m.setParentWidget(self.navTableDos);
            m.exec(pos);
        },
        slotEditar_dos: function slotEditar_dos() {
            var self = this;
            var data = self.navTableDos.selectedRecord();
            if (data == undefined) {
                qxnw.utils.alert(self.tr("Seleccione un registro"));
                return;
            }
            self.navTableDos.removeSelectedRow();
            self.abreItem(data, "dos", "edit");
        },
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var data = this.getRecord();
            data.detalle = self.navTable.getAllData();
            data.dias = self.navTableDos.getAllData();
            var rpc = new qxnw.rpc(this.rpcUrl, "nwsites");
            rpc.exec("save_config_horarios", data);
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return false;
            }
            self.accept();
        },
        populateNavTable: function populateNavTable(id, tabla, buscar, tipo) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nwsites");
            rpc.setAsync(true);
            var func = function (r) {
                if (tipo == "dos") {
                    self.navTableDos.setModelData(r);
                } else {
                    self.navTable.setModelData(r);
                }
            };
            var data = {};
            data["tabla"] = tabla;
            data["id"] = id;
            data["buscar"] = buscar;
            rpc.exec("populateHorariosHoras", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            self.populateNavTable(pr.id, "pv_horarios_tiendas_horas", "id_grupo");
            self.populateNavTable(pr.id, "pv_horarios_tiendas", "grupo", "dos");
            return true;
        }
    }
});