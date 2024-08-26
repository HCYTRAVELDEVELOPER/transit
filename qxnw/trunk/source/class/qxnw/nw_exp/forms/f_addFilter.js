/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */

qx.Class.define("qxnw.nw_exp.forms.f_addFilter", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setModal(true);
        self.setTitle(self.tr("Agregar filtro :: QXNW"));
        var fields = [
            {
                name: "id",
                label: self.tr("ID"),
                type: "textField",
                visible: false
            },
            {
                name: "nombre",
                label: self.tr("Nombre campo"),
                type: "selectBox",
                required: true
            },
            {
                name: "tipo",
                label: self.tr("Tipo"),
                type: "selectBox",
                required: true
            },
            {
                name: "nombre_mostrar",
                label: self.tr("Nombre a mostrar"),
                type: "textField"
            },
            {
                name: "comparativo",
                label: self.tr("Comparativo"),
                type: "selectBox"
            },
            {
                name: "tabla_llenado",
                label: self.tr("Tabla asociada"),
                type: "selectTokenField",
                required: false
            },
            {
                name: "campo_nombre",
                label: self.tr("Campo a mostrar"),
                type: "selectBox",
                required: false
            }
        ];
        self.setFields(fields);
        self.setFieldVisibility(self.ui.tabla_llenado, "excluded");
        self.setFieldVisibility(self.ui.campo_nombre, "excluded");
        var d = {};
        d["textField"] = self.tr("Cuadro de texto");
        d["dateField"] = self.tr("Fecha");
        d["selectBox"] = self.tr("Lista desplegable");
        qxnw.utils.populateSelectFromArray(self.ui.tipo, d);

        self.ui.tabla_llenado.addListener("loadData", function (e) {
            var data = {};
            data["token"] = e.getData();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                self.ui.tabla_llenado.setModelData(r);
            };
            rpc.exec("tableAllTables", data, func);
        }, this);

        self.ui.tabla_llenado.addListener("addItem", function (d) {
            var v = d.getData();
            var table = v.id;
            var func = function (rta) {
                var data = {};
                for (var i = 0; i < rta.length; i++) {
                    data[rta[i].column_name] = rta[i].column_name;
                }
                qxnw.utils.populateSelectFromArray(self.ui.campo_nombre, data);
            };
            qxnw.utils.fastAsyncRpcCall("master", "getOnlyColumns", {table: table}, func);
        });

        self.ui.tipo.addListener("changeSelection", function () {
            var val = self.ui.tipo.getValue();
            self.ui.comparativo.removeAll();
            if (val.tipo == "selectBox") {
                var d = {};
                d["ig"] = self.tr("Igual");
                qxnw.utils.populateSelectFromArray(self.ui.comparativo, d);
                self.setFieldVisibility(self.ui.tabla_llenado, "visible");
                self.setFieldVisibility(self.ui.campo_nombre, "visible");
                self.ui.tabla_llenado.setRequired(true);
            } else if (val.tipo == "dateField") {
                var d = {};
                d["en"] = self.tr("Entre");
                qxnw.utils.populateSelectFromArray(self.ui.comparativo, d);
                self.ui.tabla_llenado.setRequired(false);
            } else {
                var d = {};
                d["="] = self.tr("Igual");
                d["!="] = self.tr("Diferente");
                d[">"] = self.tr("Mayor que");
                d["<"] = self.tr("Menor que");
                d["=="] = self.tr("Parecido");
                qxnw.utils.populateSelectFromArray(self.ui.comparativo, d);
                self.ui.tabla_llenado.setRequired(false);
            }
        });

        d = {};
        d["="] = self.tr("Igual");
        d["!="] = self.tr("Diferente");
        d[">"] = self.tr("Mayor que");
        d["<"] = self.tr("Menor que");
        d["=="] = self.tr("Parecido");
        qxnw.utils.populateSelectFromArray(self.ui.comparativo, d);
        self.createDeffectButtons();
        self.ui.accept.addListener("execute", function () {
            self.save();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    members: {
        enc: null,
        table: null,
        populateNombre: function populateNombre() {
            var self = this;
            var func = function (rta) {
                var d = {};
                for (var i = 0; i < rta.length; i++) {
                    var r = rta[i];
                    if (r.nombre_campo == null) {
                        continue;
                    }
                    var sp = r.nombre_campo.split(".");
                    if (sp.length > 0) {
                        d[r.nombre_campo] = r.nombre_campo;
                    }
                }
                qxnw.utils.populateSelectFromArray(self.ui.nombre, d);
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "getFieldsFromTableByEnc", this.enc, func);
        },
        setParamRecord: function setParamRecord(id) {
            this.enc = id;
            this.populateNombre();
        },
        setParamRecordEdit: function setParamRecordEdit(r) {
            var self = this;
            self.ui.id.setValue(r.id);
            self.ui.nombre_campo.setValue(r.nombre);
            if (r.tipo != null) {
                self.ui.tipo.setValue(r.tipo);
            }
            if (r.tabla != null) {
                self.ui.tipo.removeAll();
                var d = {};
                d["FECHA"] = self.tr("Fecha");
                qxnw.utils.populateSelectFromArray(self.ui.tipo, d);
                self.ui.nombre_campo.setEnabled(false);
            }
            if (r.comodin != null) {
                self.ui.comodin.setValue(r.comodin);
            }
        },
        save: function save() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            var r = self.getRecord();
            r.enc = self.enc;
            var func = function () {
                qxnw.utils.information(self.tr("Registro guardado correctamente"));
                self.accept();
                return;
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "saveNewFilters", r, func);
        }
    }
});
