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

qx.Class.define("qxnw.nw_exp.forms.f_addField", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setModal(true);
        self.setTitle(self.tr("Agregar campo :: QXNW"));
        var fields = [
            {
                name: "id",
                label: self.tr("ID"),
                type: "textField",
                visible: false
            },
            {
                name: "nombre_campo",
                label: self.tr("Nombre campo"),
                type: "textField",
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
                name: "comodin",
                label: self.tr(""),
                type: "textField"
            }
        ];
        self.setFields(fields);
        self.ui.nombre_campo.setFilter(/[a-z0-9A-Z_]/g);
        self.ui.comodin.setEnabled(false);
        var d = {};
        d["VACIO"] = self.tr("Vacío");
        d["CONSECUTIVO"] = self.tr("Consecutivo");
        d["FIJO"] = self.tr("Fijo");
        qxnw.utils.populateSelectFromArray(self.ui.tipo, d);
        self.ui.tipo.addListener("changeSelection", function () {
            var v = this.getValue()["tipo"];
            switch (v) {
                case "CONSECUTIVO":
                    self.labelUi["comodin"].setValue(self.tr("Asigne el número inicial del consecutivo"));
                    self.ui.comodin.setEnabled(true);
                    self.setRequired("comodin", true);
                    break;
                case "FIJO":
                    self.labelUi["comodin"].setValue("Asigne el valor fijo de la columna");
                    self.ui.comodin.setEnabled(true);
                    self.setRequired("comodin", true);
                    break;
                case "FECHA":
                    self.labelUi["comodin"].setValue("Escriba el formato deseado");
                    self.ui.comodin.setValue("yyyy-mm-dd");
                    self.ui.comodin.setEnabled(true);
                    self.setRequired("comodin", true);
                    break;
                default:
                    self.ui.comodin.setEnabled(false);
                    self.ui.comodin.setValue("");
                    self.setRequired("comodin", false);
                    break;
            }
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
            this.enc = id;
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
            r.tabla = self.__tabla;
            var func = function () {
                qxnw.utils.information(self.tr("Registro guardado correctamente"));
                self.accept();
                return;
            };
            qxnw.utils.fastAsyncRpcCall("nw_exp", "saveNewFields", r, func);
        }
    }
});
