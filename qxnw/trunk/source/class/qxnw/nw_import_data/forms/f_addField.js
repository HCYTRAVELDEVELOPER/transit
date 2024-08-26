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

qx.Class.define("qxnw.nw_import_data.forms.f_addField", {
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
                name: "title",
                label: self.tr("Nombre campo"),
                type: "textField",
                required: true
            },
            {
                name: "orden",
                label: self.tr("Orden"),
                type: "spinner",
                required: true
            },
            {
                name: "data_type",
                label: self.tr("Tipo de dato"),
                type: "textField",
                required: false
            },
            {
                name: "useful",
                label: self.tr("Se usa"),
                type: "checkBox",
                required: false
            },
            {
                name: "char_len",
                label: self.tr("Número de caracteres"),
                type: "textField"
            },
            {
                name: "clean_spaces",
                label: self.tr("Limpiar espacios"),
                type: "checkBox"
            },
            {
                name: "remove_zero_left",
                label: self.tr("Limpiar ceros a la izquierda"),
                type: "checkBox"
            }
        ];
        self.setFields(fields);
        self.ui.title.setFilter(/[a-z0-9A-Z_]/g);
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
            qxnw.utils.fastAsyncRpcCall("nw_import_data", "saveNewFields", r, func);
        }
    }
});
