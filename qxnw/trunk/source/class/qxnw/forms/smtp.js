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
qx.Class.define("qxnw.forms.smtp", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        this.setTitle(self.tr("Configuración de SMTP"));
        self.setColumnsFormNumber(0);
        var fields = [
            {
                name: "host",
                label: self.tr("Host"),
                type: "textField",
                required: true
            },
            {
                name: "debug",
                label: self.tr("Debug de errores"),
                type: "spinner",
                enabled: false,
                toolTip: self.tr("Valores diferentes a 0 únicamente para pruebas de desarrollo. Se recomienda mantener este valor en cero(0) para evitar errores en el sistema.")
            },
            {
                name: "auth",
                label: self.tr("¿Requiere autenticación?"),
                type: "checkBox"
            },
            {
                name: "smtp_secure",
                label: self.tr("Tipo de autenticación"),
                type: "selectBox"
            },
            {
                name: "port",
                label: self.tr("Puerto"),
                type: "spinner"
            },
            {
                name: "username",
                label: self.tr("Usuario"),
                type: "textField"
            },
            {
                name: "pass",
                label: self.tr("Clave"),
                type: "textField"
            },
            {
                name: "sended_from",
                label: self.tr("Enviado desde"),
                type: "textField",
                required: true,
                toolTip: self.tr("Configuración de correo desde el que se enviarán todos los comunicados. También quedará como correo de respuesta")
            }
        ];
        self.setFields(fields);
        self.ui.debug.setValue(0);

        var d = [];
        d["ssl"] = "SSL";
        d["tls"] = "TLS";
        qxnw.utils.populateSelectFromArray(self.ui.smtp_secure, d);
        self.ui.accept.addListener("tap", function () {
            if (!self.validate()) {
                return;
            }
            self.save();
        });
        self.ui.cancel.addListener("tap", function () {
            self.reject();
        });
        self.populate();
    },
    members: {
        save: function save() {
            var self = this;
            var data = self.getRecord();
            var func = function () {
                qxnw.utils.information(self.tr("Configuración guardada"));
            };
            qxnw.utils.fastAsyncRpcCall("master", "saveSmtpSettings", data, func);
            self.accept();
        },
        populate: function populate() {
            var self = this;
            var func = function (r) {
                if (r != false) {
                    if (r.auth == 1 || r.auth == "t") {
                        r.auth = true;
                    } else {
                        r.auth = false;
                    }
                    self.setRecord(r);
                }
                qxnw.utils.stopLoading();
            };
            qxnw.utils.fastAsyncRpcCall("master", "getSmtpSettings", 0, func);
        }
    }
});