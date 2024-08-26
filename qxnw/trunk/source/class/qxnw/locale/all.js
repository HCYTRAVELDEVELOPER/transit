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
/**
 * Form to control the behavior of system
 */
qx.Class.define("qxnw.locale.all", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        this.setTitle("Configuraciones regionales");
        self.setColumnsFormNumber(0);
        var fields = [
            {
                name: "Formato de fechas",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-calendar"),
                mode: "vertical"
            },
            {
                name: "fecha_normal",
                label: self.tr("Fecha corta"),
                type: "textField"
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(fields);
        self.ui.accept.addListener("click", function () {
            self.save();
        });
        self.ui.cancel.addListener("click", function () {
            self.reject();
        });
        self.loadConfig();
    },
    members: {
        loadConfig: function loadConfig() {
            var self = this;
            qxnw.utils.fastAsyncCallRpc("NWUtils", "readConfig", null, function (rta) {
                if (rta == null) {
                    return;
                }
                self.setRecord(rta);
            });
        },
        save: function save() {
            var self = this;
            var r = self.getRecord();
            qxnw.utils.fastAsyncCallRpc("NWUtils", "writeConf", r, function (rta) {
                if (rta) {
                    qxnw.utils.information(self.tr("Configuración guardada correctamente. Para aplicar algunos cambios, es posible que deba actualizar el navegador."));
                }
            });
            self.accept();
        }
    }
});