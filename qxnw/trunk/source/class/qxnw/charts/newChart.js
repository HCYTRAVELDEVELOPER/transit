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
qx.Class.define("qxnw.charts.newChart", {
    extend: qxnw.forms,
    construct: function construct() {
        this.base(arguments);
        var self = this;
        this.setTitle("Creación de informes dinámicos");
        self.setColumnsFormNumber(3);
        var fields = [
            {
                name: "Campos de filtro",
                type: "startGroup",
                icon: qxnw.config.execIcon("office-address-book", "apps"),
                mode: "vertical"
            },
            {
                name: "showSendReports",
                label: "Preguntar antes de enviar un reporte de error",
                type: "checkBox"
            },
            {
                name: "showServerResponse",
                label: "Mostrar la respuesta de la central al enviar un error",
                type: "checkBox"
            },
            {
                name: "",
                type: "endGroup"
            },
            {
                name: "showErrorsDialog",
                label: "Mostrar los diálogos de errores",
                type: "checkBox"
            },
            {
                name: "SQL",
                type: "startGroup",
                icon: qxnw.config.execIcon("utilities-network-manager", "apps"),
                mode: "vertical"
            },
            {
                name: "showDetErrors",
                label: "Ver configuración detallada en los errores",
                type: "checkBox"
            }
        ];
        this.setFields(fields);
        var send = qxnw.config.getSendErrorFlag();
        var show = qxnw.config.getShowErrorResponse();
        var showErrors = qxnw.config.getShowErrorDialog();
        var showDetErrors = qxnw.config.getShowDetErrors();
        self.ui.showSendReports.setValue(send);
        self.ui.showServerResponse.setValue(show);
        self.ui.showErrorsDialog.setValue(showErrors);
        self.ui.showDetErrors.setValue(showDetErrors);
        this.ui.accept.addListener("click", function() {
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
            qxnw.local.storeData("config_ask_error_report", data["showSendReports"]);
            qxnw.local.storeData("config_show_server_response", data["showServerResponse"]);
            qxnw.local.storeData("config_show_error_dialogs", data["showErrorsDialog"]);
            qxnw.local.storeData("config_show_det_errors", data["showDetErrors"]);
            qxnw.utils.information("Configuración guardada");
        }
    }
});