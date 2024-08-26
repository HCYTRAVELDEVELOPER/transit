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
qx.Class.define("qxnw.alerts.f_showAlert", {
    extend: qxnw.forms,
    construct: function construct(data) {
        this.base(arguments);
        var self = this;
        self.data = data;
        if (typeof data == 'undefined' || data == null) {
            return;
        }
        self.set({
            showMinimize: false,
            showMaximize: false,
            showClose: false,
            opacity: 0.9
        });
        self.setTitle("Tiene una alerta");
        var text = "";
        text += "<b>Fecha:</b> " + data["fecha"];
        text += "<br />";
        text += "<b>Observaciones:</b> " + data["texto"];
        text += "<br />";
        var label = new qx.ui.basic.Label().set({
            value: text,
            rich: true
        });
        self.add(label);
        self.createDeffectButtons();
        self.ui.accept.setLabel("Posponer");
        self.ui.cancel.setLabel("Descartar");
        self.ui.accept.addListener("click", function() {
            self.pospose();
        });
        self.ui.cancel.addListener("click", function() {
            self.discard();
        });
    },
    members: {
        data: null,
        discard: function discard() {
            var self = this;
            var data = self.data;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function(r) {
                self.accept();
            };
            rpc.exec("discardAlert", data, func);
        },
        pospose: function pospose() {
            var self = this;
            var data = self.data;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function(r) {
                qxnw.utils.information("Se a pospuesto la alerta " + data["tiempo_alerta"] + "minutos. ");
                self.accept();
            };
            rpc.exec("posposeAlert", data, func);
        }
    }
});