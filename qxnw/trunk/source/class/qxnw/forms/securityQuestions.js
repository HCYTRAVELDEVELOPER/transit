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

qx.Class.define("qxnw.forms.securityQuestions", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Configuraciones de seguridad"));
        var fields = [
            {
                name: "email",
                label: self.tr("Su correo electrónico de recuperación"),
                type: "textField",
                mode: "email",
                required: true
            },
            {
                name: "updateEmailButton",
                type: "button",
                label: self.tr("Actualice su correo")
            }
        ];
        self.setFields(fields);
        self.ui.updateEmailButton.addListener("tap", function () {
            var f = new qxnw.forms();
            f.setModal(true);
            f.set({
                showMinimize: false,
                showMaximize: false,
                showClose: false
            });
            f.setTitle(self.tr("Actualice su correo de contacto"));
            var fiel = [
                {
                    name: "email",
                    type: "textField",
                    mode: "email",
                    label: self.tr("Correo electrónico")
                }
            ];
            f.setFields(fiel);
            f.show();
            f.ui.cancel.addListener("tap", function () {
                f.reject();
            });
            f.ui.accept.addListener("tap", function () {
                if (!f.validate()) {
                    return;
                }
                var r = f.getRecord();
                var da = {};
                da["table"] = "usuarios";
                da["fields"] = "email";
                da["values"] = r.email;
                da["type"] = "update";
                da["where"] = "usuario='" + self.up.user + "' and id=" + self.up.code;
                qxnw.utils.fastAsyncCallRpc("Master", "autoQuery", da, function () {
                    var daa = {};
                    daa["key"] = "email";
                    daa["value"] = r.email;
                    self.ui.email.setValue(r.email);
                    f.close();
                    qxnw.utils.fastAsyncCallRpc("Master", "updateSessionVariable", daa);
                });
            });
        });
        if (typeof self.up.email != 'undefined' && self.up.email != "") {
            self.ui.email.setValue(self.up.email);
        } else {
            qxnw.utils.information(self.tr("¿Desea configurar su correo?"), function () {
                var f = new qxnw.forms();
                f.setModal(true);
                f.setTitle(self.tr("Actualice su correo de contacto"));
                var fiel = [
                    {
                        name: "email",
                        type: "textField",
                        mode: "email",
                        label: self.tr("Correo electrónico")
                    }
                ];
                f.setFields(fiel);
                f.show();
                f.ui.accept.addListener("tap", function () {
                    if (!f.validate()) {
                        return;
                    }
                    var r = f.getRecord();
                    var da = {};
                    da["table"] = "usuarios";
                    da["fields"] = "email";
                    da["values"] = r.email;
                    da["type"] = "update";
                    da["where"] = "usuario='" + self.up.user + "' and id=" + self.up.code;
                    qxnw.utils.fastAsyncCallRpc("Master", "autoQuery", da, function () {
                        var daa = {};
                        daa["key"] = "email";
                        daa["value"] = r.email;
                        self.ui.email.setValue(r.email);
                        f.close();
                        qxnw.utils.fastAsyncCallRpc("Master", "updateSessionVariable", daa);
                    });
                });
            });
        }
        self.addButtonsFunctions();
        self.ui["accept"].setVisibility("excluded");
        var nav = new qxnw.navtable(self, false);
        nav.createFromTable("nw_security_questions");
        self.insertNavTable(nav.getBase(), "Preguntas de seguridad", false, 0, 0, 0, qxnw.config.execIcon("document-revert"));
    },
    members: {
    }
});