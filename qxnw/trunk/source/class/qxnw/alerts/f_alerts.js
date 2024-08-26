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
 * Class only for static mode. A composition of util code who help you in entire your application
 */
qx.Class.define("qxnw.alerts.f_alerts", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Procesamiento de alarmas"));
        self.setColumnsFormNumber(0);
        var fields = [
            {
                name: "id",
                label: "ID",
                type: "textField",
                visible: false
            },
            {
                name: "fecha",
                label: "Fecha",
                type: "dateTimeField"
            },
            {
                name: "tiempo_alerta",
                label: "Minutos de aviso antes",
                type: "spinner"
            },
            {
                name: "texto",
                label: "Observaciones",
                type: "textArea"
            }
        ];
        self.setFields(fields);
        self.ui.accept.addListener("click", function() {
            self.save();
        });
        self.ui.cancel.addListener("click", function() {
            self.reject();
        });
    },
    members: {
        save: function save() {
            var self = this;
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function(r) {
                self.accept();
            };
            rpc.exec("saveAlert", data, func);
        }
    }
});