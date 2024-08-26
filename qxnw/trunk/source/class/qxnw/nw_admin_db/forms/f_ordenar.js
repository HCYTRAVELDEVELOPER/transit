qx.Class.define("qxnw.nw_admin_db.forms.f_ordenar", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("Nuevo / Editar Campo");
        self.orden_cargue = {};
        self.setGroupHeader("Descripción tabla");

        self.setFields([]);
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.navTable_table = new qxnw.navtable(self);
        self.navTable_table.setContextMenu("contextMenu");
        self.navTable_table.createBase();
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
        self.navTable_table.setColumns(columns);
        self.insertNavTable(self.navTable_table.getBase(), self.tr("NavTables"));
        self.agregarButton_nav = self.navTable_table.getAddButton();
        self.deleteButton_nav = self.navTable_table.getRemoveButton();
        self.agregarButton_nav.set({
            icon: qxnw.config.execIcon("go-top"),
            label: "up"
        });
        self.deleteButton_nav.set({
            icon: qxnw.config.execIcon("go-bottom"),
            label: "down"
        });
        self.agregarButton_nav.addListener("click", function () {
            self.orderArrayUp();
        });
        self.deleteButton_nav.addListener("click", function () {
            self.orderArrayDown();
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
        orderArrayUp: function orderArrayUp() {
            var self = this;
            var data = self.navTable_table.getAllData();
            var sl = self.navTable_table.selectedRecord();
            if (sl.ordinal_position == "1") {
                qxnw.utils.information("No hay mas posiciónes sobre esta columna");
                return;
            }
            var position = parseInt(sl.ordinal_position) - 1;
            var count = 1;
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                if (count == position) {
                    var pt = parseInt(i) + 1;
                    data[pt].ordinal_position = position;
                    arr.push(data[pt]);
                } else if (count == sl.ordinal_position) {
                    var pt = parseInt(i) - 1;
                    data[pt].ordinal_position = sl.ordinal_position;
                    arr.push(data[pt]);
                } else {
                    arr.push(data[i]);
                }
                count++;
            }
            self.navTable_table.setModelData(arr);
        },
        orderArrayDown: function orderArrayDown() {
            var self = this;
            var data = self.navTable_table.getAllData();
            var sl = self.navTable_table.selectedRecord();
            if (sl.ordinal_position == data.length) {
                qxnw.utils.information("No hay mas posiciónes bajo esta columna");
                return;
            }
            var position = parseInt(sl.ordinal_position) + 1;
            var count = 1;
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                if (count == position) {
                    var pt = parseInt(i) - 1;
                    data[pt].ordinal_position = position;
                    arr.push(data[pt]);
                } else if (count == sl.ordinal_position) {
                    var pt = parseInt(i) + 1;
                    data[pt].ordinal_position = sl.ordinal_position;
                    arr.push(data[pt]);
                } else {
                    arr.push(data[i]);
                }
                count++;
            }
            self.navTable_table.setModelData(arr);
        },
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            data.fields = self.navTable_table.getAllData();
            data.table_name = self.pr.nombre;
            data.field = qxnw.utils.getCommaValueByColumn(data.fields, "field_name", ",");
            data.model = self.pr.model;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
            rpc.setAsync(true);
            var func = function (r) {
                self.accept();
            };
            rpc.exec("orderTable", data, func);
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
                self.navTable_table.setModelData(r);
                r.tabla = self.pr.nombre;
            };
            rpc.exec("populateFieldsByTable", self.pr, func);
        }
        ,
        setParamRecordNew: function setParamRecordNew(pr) {
            var self = this;
            self.pr = pr;
            self.pr.model = pr.model;
            self.populateFields();
            return true;
        }
    }
});