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

qx.Class.define("qxnw.basics.forms.f_cambiar_empresa", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setTitle(self.tr("Cambiar empresa"));
        self.createBase();
        var fields = [
            {
                name: "empresa",
                label: self.tr("Empresa"),
                caption: "empresa",
                type: "selectBox"
            }
        ];
        self.setFields(fields);
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        var data = {};
        data["usuario"] = self.up.user;
        data["version"] = qxnw.local.getAppVersion();
        self.ui.empresa.removeAll();
        var answer = qxnw.utils.populateSelect(self.ui.empresa, "nw_session", "getEmpresas", data, null, self.up.company);
        if (typeof answer == 'undefined' || answer == null || answer == "") {
            self.ui.accept.setEnabled(false);
        }
    },
    destruct: function () {
    },
    members: {
        populateSettings: function populateSettings() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_session", true);
            var func = function (r) {
                if (typeof r !== 'undefined') {
                    qxnw.utils.populateSelectFromArrays(r);
                }
            };
            rpc.exec("getEmpresas", null, func);
        },
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            data.nom_empresa = data.empresa_text;
            var perfil = self.ui.empresa.getValue();
            data.model = perfil.empresa_model;
            data.checkConcurrency = false;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_session", true);
            var func = function (r) {
                if (r) {
                    qxnw.local.storeDataWithOutPrefix("session", null, false);
                    qxnw.main.deleteMenuCache(false);
                    qxnw.local.setData("session", null);
                    self.accept();
                    qxnw.utils.information(self.tr("¡Empresa modificada correctamente!. El sistema se actualizará automaticamente en 4 segundos."));
                    setTimeout(function () {
                        location.reload();
                    }, 4000);
                }
            };
            rpc.exec("setEmpresa", data, func);
        }
    }
});