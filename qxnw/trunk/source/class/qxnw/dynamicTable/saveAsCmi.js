/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */

qx.Class.define("qxnw.dynamicTable.saveAsCmi", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Indique el título para este reporte"));
        var fields = [
            {
                name: "id",
                type: "textField",
                required: false,
                visible: false,
                label: self.tr("ID")
            },
            {
                name: "nombre",
                type: "textField",
                mode: "maxCharacteres:50",
                required: true,
                label: self.tr("Nombre")
            },
            {
                name: "privado",
                type: "checkBox",
                required: true,
                label: self.tr("¿Uso privado?")
            },
            {
                name: "perfiles",
                type: "selectBox",
                label: self.tr("Perfiles disponibles")
            },
            {
                name: "select_charts",
                type: "selectBox",
                label: self.tr("Tipo de gráfico")
            },
            {
                name: "usuarios",
                type: "selectListCheck",
                label: self.tr("Usuarios autorizados")
            },
            {
                name: "descripcion",
                type: "textArea",
                label: self.tr("Descripción")
            }
        ];
        self.setFields(fields);

        var d = {};
        d["bars"] = self.tr("Barras");
        d["horizontalBar"] = self.tr("Barras horizontales");
        d["lines"] = self.tr("Líneas");
        d["pie"] = self.tr("Torta");
        d["bars3d"] = self.tr("Barras apiladas");
        d["funnel"] = self.tr("Tunel");
        qxnw.utils.populateSelectFromArray(self.ui.select_charts, d);

        var data = {
            "": "Seleccione"
        };
        qxnw.utils.populateSelectFromArray(self.ui.usuarios, data);
        self.ui.usuarios.populate("master", "buscarUsuariosActivosPorEmpresa");

        self.ui.usuarios.addListener("addItem", function () {
            console.log("addItem");
            self.ui.privado.setValue(true);
        });

        self.setModal(true);

        var d = {};
        d[""] = self.tr("Seleccione...");
        qxnw.utils.populateSelectFromArray(self.ui.perfiles, d);
        qxnw.utils.populateSelectAsync(self.ui.perfiles, "master", "populate", {table: "perfiles"});
        self.ui.perfiles.addListener("changeSelection", function (e) {
            var val = this.getValue();
            if (val["perfiles"] === "") {
                self.ui.privado.setValue(false);
                self.ui.privado.setEnabled(true);
            } else {
                self.ui.privado.setValue(true);
                self.ui.privado.setEnabled(false);
            }
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
    },
    members: {
        setParamRecord: function (p) {
            var self = this;
            self.setRecord(p);
            var ua = JSON.parse(p.usuarios_autorizados);
            for (var i = 0; i < ua.length; i++) {
                self.ui.usuarios.addToken(ua[i]);
            }
        }
    }
});