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

qx.Class.define("qxnw.nw_exp.forms.f_addFieldCondi", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setModal(true);
        self.setTitle(self.tr("Agregar campo CONDICIONAL :: QXNW"));
        var fields = [
            {
                name: "id",
                label: self.tr("ID"),
                type: "textField",
                visible: false
            },
            {
                name: "tipo",
                label: self.tr("Tipo"),
                type: "selectBox",
                required: true
            },
            {
                name: "tabla",
                label: self.tr("Tabla"),
                type: "selectBox"
            },
            {
                name: "nombre_campo",
                label: self.tr("Campo"),
                type: "selectBox"
            },
            {
                name: "nombre_mostrar",
                label: self.tr("Nombre a mostrar"),
                type: "textField"
            },
            {
                name: "operacion",
                label: self.tr("Operación"),
                type: "selectBox"
            },
            {
                name: "valor_comparativo",
                label: self.tr("Valor a comparar"),
                type: "textField"
            },
            {
                name: "campo_fijoa",
                label: self.tr("Campo condicional verdadero"),
                type: "textField"
            },
            {
                name: "campo_fijob",
                label: self.tr("Campo condicional falso"),
                type: "textField"
            }
        ];
        self.setFields(fields);
        self.ui.nombre_mostrar.setFilter(/[a-z0-9A-Z_]/g);
        self.ui.campo_fijoa.setFilter(/[a-z0-9A-Z_]/g);
        self.ui.campo_fijob.setFilter(/[a-z0-9A-Z_]/g);
        var d = {};
        d["CONDICIONAL"] = self.tr("Condicional");
        qxnw.utils.populateSelectFromArray(self.ui.tipo, d);
        d = {};
        d["="] = self.tr("=");
        d[">"] = self.tr(">");
        d["<"] = self.tr("<");
        qxnw.utils.populateSelectFromArray(self.ui.operacion, d);
        self.ui.tabla.addListener("changeSelection", function (d) {
            var v = this.getValue();
            var table = v.tabla_text;
            var func = function (rta) {
                var data = {};
                for (var i = 0; i < rta.length; i++) {
                    data[rta[i].column_name] = rta[i].column_name;
                }
                qxnw.utils.populateSelectFromArray(self.ui.nombre_campo, data);
            };
            qxnw.utils.fastAsyncRpcCall("master", "getOnlyColumns", {table: table}, func);
        });
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
        __nombre_campo: null,
        __tabla: null,
        setParamRecord: function setParamRecord(id) {
            var self = this;
            this.enc = id;
            var data = {};
            data.model = this.enc;
            var func = function (rta) {
                var d = {};
                for (var i = 0; i < rta.length; i++) {
                    d[rta[i].id] = rta[i].nombre;
                }
                qxnw.utils.populateSelectFromArray(self.ui.tabla, d);
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "getTablesByEnc", data, func);
        },
        setParamRecordEdit: function setParamRecordEdit(r) {
            var self = this;
            self.__tabla = r.tabla;
            self.__nombre_campo = r.nombre_campo;
            self.ui.id.setValue(r.id);
            self.ui.nombre_campo.setValue(r.nombre);
            if (r.tipo != null) {
                self.ui.tipo.setValue(r.tipo);
            }
            if (r.tabla != null) {
                self.ui.tipo.removeAll();
                var d = {};
                d["FECHA"] = self.tr("Fecha");
                d["CAMPO"] = self.tr("Campo modificado");
                qxnw.utils.populateSelectFromArray(self.ui.tipo, d);
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
            r.nombre_alterno = self.__nombre_campo;
            var func = function () {
                qxnw.utils.information(self.tr("Registro guardado correctamente"));
                self.accept();
                return;
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "saveCondFields", r, func);
        }
    }
});
