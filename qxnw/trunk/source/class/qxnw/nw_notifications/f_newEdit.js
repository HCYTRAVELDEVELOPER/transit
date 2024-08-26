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
 * Manage a special way to create all forms in your application
 */
qx.Class.define("qxnw.nw_notifications.f_newEdit", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle(self.tr("Nuevo-editar Notificaciones"));
        self.setColumnsFormNumber(3);
        this.createBase();
        var fields = [
            {
                name: "id",
                label: "ID",
                type: "textField",
                visible: false
            },
            {
                name: "adjunto",
                label: "Adjunto",
                type: "uploader"
            },
            {
                name: "prioridad",
                label: "Prioridad",
                type: "selectBox",
                required: true
            },
            {
                name: "accion",
                label: "Acción",
                type: "textField",
                required: true
            },
            {
                name: "enviar_por_correo",
                label: "Enviar por correo",
                type: "checkBox",
                required: true
            },
            {
                name: "fecha_final",
                label: "Fecha final",
                type: "dateField"
            },
            {
                name: "tipo",
                label: "Tipo",
                type: "selectBox"
            }
        ];
        self.setFields(fields);
        var data = {};
        data["ALTA"] = "ALTA";
        data["MEDIA"] = "MEDIA";
        data["BAJA"] = "BAJA";
        qxnw.utils.populateSelectFromArray(self.ui.prioridad, data);
        
        data = {};
        data["POPUP"] = "Popup en ventana";
        qxnw.utils.populateSelectFromArray(self.ui.tipo, data);

        self.f_texto = new qxnw.forms("qxnw_f_text");
        fields = [
            {
                name: "texto",
                label: "Texto",
                type: "ckeditor",
                required: true
            }
        ];
        self.f_texto.setFields(fields);
        self.f_texto.hideAutomaticButtons();
        self.insertNavTable(self.f_texto, "Cuerpo");

        self.listCheck = new qxnw.forms("qxnw_users");
        fields = [
            {
                name: "users",
                label: "Usuarios",
                type: "selectListCheck",
                mode: "maxItems:100000"
            }
        ];
        self.listCheck.setFields(fields);
        self.listCheck.ui.users.populate("master", "getAllActiveUsers");
        self.listCheck.hideAutomaticButtons();
        self.insertNavTable(self.listCheck, "Usuarios asociados");

        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
    },
    destruct: function() {
    },
    members: {
        slotSave: function slotSave() {
            var self = this;
            if (!self.validate()) {
                return;
            }
            if (!self.f_texto.validate()) {
                return;
            }
            if (!self.listCheck.validate()) {
                return;
            }
            var data = self.getRecord();
            data.body = self.f_texto.getRecord();
            data.users = self.listCheck.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_notifications");
            rpc.setAsync(true);
            var func = function() {
                self.accept();
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.setRecord(pr);
            self.f_texto.setRecord(pr);
            var func = function(r) {
                for (var i = 0; i < r.length; i++) {
                    if (r[i].value === "t") {
                        self.listCheck.ui.users.addToken(r[i]);
                    }
                }
            };
            qxnw.utils.fastAsyncRpcCall("nw_notifications", "getUsersByNotification", pr, func);
            return true;
        }
    }
});