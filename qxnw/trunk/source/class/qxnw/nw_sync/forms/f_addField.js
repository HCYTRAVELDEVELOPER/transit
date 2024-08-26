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

qx.Class.define("qxnw.nw_sync.forms.f_addField", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        self.base(arguments);
        self.setModal(true);
        self.setTitle(self.tr("Modificar campo :: QXNW"));
        var fields = [
            {
                name: "id",
                label: self.tr("ID"),
                type: "textField",
                visible: false
            },
            {
                name: "tabla",
                label: self.tr("Tabla"),
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
                name: "nivel",
                label: self.tr("Nivel"),
                type: "selectBox",
                required: true
            },
            {
                name: "nivel_pariente",
                label: self.tr("Nivel Pariente"),
                type: "selectBox",
                enabled: false
            },
            {
                name: "tabla_a_conectar",
                label: self.tr("Pariente"),
                type: "selectBox",
                enabled: false
            },
            {
                name: "camposDisponibles",
                label: self.tr("Campo Tabla Origen"),
                type: "selectBox"
            },

            {
                name: "campos_tabla_destino",
                label: self.tr("Campo Tabla Destino"),
                type: "selectBox",
                enabled: false
            },
            {
                name: "orden",
                label: self.tr("Orden"),
                type: "textField",
                required: true
            },
            {
                name: "validacion",
                label: self.tr("Validacion"),
                type: "selectBox",
                required: true
            }, {
                name: "campo_validar",
                label: self.tr("Campo a Validar"),
                type: "selectBox"
            }
        ];
        self.setFields(fields);
        var d = {};
        d["ENVIAR"] = self.tr("Enviar");
        d["RECIBIR"] = self.tr("Recibir");
        qxnw.utils.populateSelectFromArray(self.ui.tipo, d);
        var d = {};
        d["NO"] = self.tr("NO");
        d["SI"] = self.tr("SI");
        qxnw.utils.populateSelectFromArray(self.ui.validacion, d);
        var d = {};
        d["0"] = self.tr("0");
        d["1"] = self.tr("1");
        d["2"] = self.tr("2");
        d["3"] = self.tr("3");
        d["4"] = self.tr("4");
        d["5"] = self.tr("5");
        d["6"] = self.tr("6");
        d["7"] = self.tr("7");
        d["8"] = self.tr("8");
        d["9"] = self.tr("9");
        d["10"] = self.tr("10");
        qxnw.utils.populateSelectFromArray(self.ui.nivel, d);
        qxnw.utils.populateSelectFromArray(self.ui.nivel_pariente, d);
        self.createDeffectButtons();
        self.ui.accept.addListener("execute", function () {
            self.save();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        qxnw.utils.populateSelectAsync(self.ui.tabla, "nw_sync", "searchTables", 0);
        self.ui.nivel.addListener("changeSelection", function () {
            var val = this.getValue();
            if (parseInt(val.nivel) <= 1) {
                self.ui.nivel_pariente.setEnabled(false);
                self.ui.tabla_a_conectar.setEnabled(false);
                self.ui.campos_tabla_destino.setEnabled(false);
                self.ui.nivel_pariente.setValue("0");
                self.ui.campos_tabla_destino.setValue("");
            } else {
                self.ui.nivel_pariente.setEnabled(true);
                self.ui.tabla_a_conectar.setEnabled(true);
                self.ui.campos_tabla_destino.setEnabled(true);
                self.ui.nivel_pariente.setValue("0");
            }
        });
        self.ui.nivel_pariente.addListener("changeSelection", function () {
            var val = this.getValue();
            if (parseInt(val.nivel_pariente) >= 1) {
                self.ui.tabla_a_conectar.removeAll();
                qxnw.utils.populateSelectAsync(self.ui.tabla_a_conectar, "nw_sync", "getTablesByEncAndModel", val);
            }
        });
        self.ui.validacion.addListener("changeSelection", function () {
            var val = this.getValue();
            if (val.validacion == "NO") {
                self.ui.campo_validar.setValue("");
            }
        });
        self.ui.tabla.addListener("changeSelection", function () {
            var val = this.getValue();
            self.ui.camposDisponibles.removeAll();
            self.ui.campo_validar.removeAll();
            qxnw.utils.populateSelectAsync(self.ui.camposDisponibles, "nw_sync", "searchFieldsByTable", val);
            qxnw.utils.populateSelectAsync(self.ui.campo_validar, "nw_sync", "searchFieldsByTable", val);

        });
        self.ui.tabla_a_conectar.addListener("changeSelection", function () {
            var val = this.getValue();
            val.tabla = val.tabla_a_conectar_text;
            self.ui.campos_tabla_destino.removeAll();
            qxnw.utils.populateSelectAsync(self.ui.campos_tabla_destino, "nw_sync", "searchFieldsByTable", val);

        });

    },
    members: {
        enc: null,
        table: null,
        setParamRecord: function setParamRecord(enc) {
            this.enc = enc;
        },
        setParamRecordEdit: function setParamRecordEdit(r) {
            var self = this;
            self.ui.id.setValue(r.id);
            self.ui.nombre_campo.setValue(r.nombre);
            if (r.tipo != null) {
                self.ui.tipo.setValue(r.tipo);
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
            qxnw.utils.fastAsyncRpcCall("nw_sync", "saveNewFields", r, func);
        }
    }
});
