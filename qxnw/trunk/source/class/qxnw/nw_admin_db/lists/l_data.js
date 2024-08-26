qx.Class.define("qxnw.nw_admin_db.lists.l_data", {
    extend: qxnw.lists,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.buttonsAutomatic = true;
        this.createBase();
        var columns = [
            {
                label: "Valor OTROS",
                caption: "valor_otros",
                type: "money"
            }];
        self.setColumns(columns);
        var filters = [
            {
                name: "tabla",
                label: "Tabla",
                type: "textField",
                visible: false
            },
            {
                name: "buscar",
                label: "Buscar ...",
                type: "textField"
            },
            {
                name: "qxnw",
                label: "Estilo Qxnw",
                type: "checkBox"
            }];
        self.createFilters(filters);
        self.setColumns(columns);
        self.ui.qxnw.setValue(true);
        self.ui.newButton.addListener("click", function () {
            self.slotNuevo();
        });
        self.ui.editButton.addListener("click", function () {
            self.slotEditar();
        });
        self.ui.deleteButton.addListener("click", function () {
            self.slotEliminar();
        });
//        
        self.ui.unSelectButton.addListener("click", function () {
            self.clearSelection();
        });
        self.ui.selectAllButton.addListener("click", function () {
            self.selectAll();
        });
        self.ui.updateButton.addListener("click", function () {
            self.applyFilters();
        });
        self.ui.searchButton.addListener("execute", function () {
            self.applyFilters();
        });
        self.execSettings();
        self.ui.newButton.setEnabled(true);
        self.ui.editButton.setEnabled(true);
        self.ui.deleteButton.setEnabled(true);
        self.ui.unSelectButton.setEnabled(true);
        self.ui.selectAllButton.setVisibility("excluded");
        self.ui.unSelectButton.set({
            label: "Refrescar"
        });
        self.ui.unSelectButton.addListener("click", function () {
            self.populateFields(self.pr);
        });
    },
    destruct: function () {
    },
    members: {
        contextMenu: function contextMenu(pos) {
            var self = this;
            var m = new qxnw.contextmenu(this);
            m.addAction("Editar", "icon/16/actions/document-properties.png", function (e) {
                self.slotEditar();
            });
            m.addAction("Eliminar", "icon/16/actions/edit-delete.png", function (e) {
                qxnw.utils.question("¿Está seguro de eliminar el registro?", function (e) {
                    if (e) {
                        self.slotEliminar();
                    } else {
                        return;
                    }
                });
            });
            m.exec(pos);
        },
        applyFilters: function applyFilters() {
            var self = this;
            var data = {};
            data.filters = self.getFiltersData();
            data.model = self.pr.model;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
            rpc.setAsync(true);
            var func = function (r) {
                self.setModelData(r);
            };
            rpc.exec("consulta", data, func);
        },
        slotNuevo: function slotNuevo() {
            var self = this;
            var data = self.getFiltersData();
            if (data.qxnw == true) {
                var rpc = new qxnw.rpc(this.rpcUrl, "nw_admin_tables");
                var data = {};
                data.model = self.pr.model;
                var r = rpc.exec("findConection", data);
                if (rpc.isError()) {
                    qxnw.utils.error(rpc.getError(), self);
                    return;
                }
                if (r) {
                    var f = new qxnw.forms();
                    f.setOtherDB(r.id);
                    f.createFromTableGenerateSeq(self.pr.tabla);
                    f.setCleanHTML(false);
                    f.show();
                    f.settings.accept = function (r) {
                        self.applyFilters();
                    }
                }
            } else {
                var f = new qxnw.forms();
                var fields = [];
                var field = {};
                var required = false;
                var visible = true;
                for (var i = 0; i < self.pr.length; i++) {
                    var upper = new qx.type.BaseString(self.pr[i].field_name);
                    if (self.pr[i].not_null == "t") {
                        required = true;
                    } else {
                        required = false;
                    }
                    field = {
                        label: upper.toUpperCase(),
                        name: self.pr[i].field_name,
                        type: "textField",
                        required: required,
                        visible: visible
                    };
                    fields.push(field);
                }
                f.setFields(fields);
                f.ui.cancel.addListener("execute", function () {
                    f.reject();
                });
                f.ui.accept.addListener("execute", function () {
                    var data = f.getRecord();
                    data.columns = self.pr;
                    data.tabla = self.pr.tabla;
                    data.model = self.pr.model;
                    var func = function (r) {
                        f.accept();
                        self.applyFilters();
                    };
                    qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "saveTableSimple", data, func);
                });
                f.show();
            }
        },
        slotEditar: function slotEditar() {
            var self = this;
            var data = self.getFiltersData();
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            if (data.qxnw == true) {
                var r = self.selectedRecord();
                if (r == undefined) {
                    qxnw.utils.alert("Seleccione un registro");
                    return;
                }
                var f = new qxnw.forms();
                f.createFromTableGenerateSeq(self.pr.tabla);
                f.setCleanHTML(false);
                f.show();
                f.setRecord(r);
                f.settings.accept = function (r) {
                    self.applyFilters();
                };
            } else {
                var f = new qxnw.forms();
                var fields = [];
                var field = {};
                var required = false;
                var visible = true;
                for (var i = 0; i < self.pr.length; i++) {
                    var upper = new qx.type.BaseString(self.pr[i].field_name);
                    if (self.pr[i].not_null == "t") {
                        required = true;
                    } else {
                        required = false;
                    }
                    field = {
                        label: upper.toUpperCase(),
                        name: self.pr[i].field_name,
                        type: "textField",
                        required: required,
                        visible: visible
                    };
                    fields.push(field);
                }
                f.setFields(fields);
                f.ui.cancel.addListener("execute", function () {
                    f.reject();
                });
                f.ui.accept.addListener("execute", function () {
                    var data = f.getRecord();
                    data.columns = self.pr;
                    data.tabla = self.pr.tabla;
                    data.model = self.pr.model;
                    var func = function (r) {
                        f.accept();
                        self.applyFilters();
                    };
                    qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "saveTableSimple", data, func);
                });
                f.setRecord(r);
                f.show();
            }
        },
        slotEliminar: function slotEliminar() {
            var self = this;
            var r = self.selectedRecord();
            if (r == undefined) {
                qxnw.utils.alert("Seleccione un registro");
                return;
            }
            r.tabla = self.pr.tabla;
            r.model = self.pr.model;
            var func = function (r) {
                self.applyFilters();
            };
            qxnw.utils.fastRpcAsyncCall("nw_admin_tables", "deleteRowTable", r, func);
        },
        populateFields: function populateFields(model) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables");
            rpc.setAsync(true);
            var func = function (r) {
                r.tabla = self.pr.tabla;
                r.model = self.pr.model;
                self.slotColumns(r);
            };
            rpc.exec("populateFieldsByTable", model, func);
        },
        slotColumns: function slotColumns(data) {
            var self = this;
            self.pr = data;
            self.pr.model = data.model;
            self.ui.tabla.setValue(data.tabla);
            var columns = [];
            var column = {};
            for (var i = 0; i < data.length; i++) {
                var upper = new qx.type.BaseString(data[i].field_name);
                column = {
                    label: upper.toUpperCase(),
                    caption: data[i].field_name
                };
                columns.push(column);
            }
            self.setColumns(columns);
            self.applyFilters();
        }
    }
});