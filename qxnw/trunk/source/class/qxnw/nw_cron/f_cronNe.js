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
qx.Class.define("qxnw.nw_cron.f_cronNe", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle("Trabajos Nuevo/Editar");
        this.setColumnsFormNumber(0);
        this.createBase();
        var fields = [
            {
                name: "id",
                label: "ID",
                type: "textField",
                visible: false
            },
            {
                label: self.tr("Descripción"),
                name: "nombre",
                type: "textField",
                required: true
            },
            {
                label: self.tr("Trabajo"),
                name: "trabajo",
                type: "textArea",
                required: true
            },
            {
                label: self.tr("Minutos (0-60)"),
                name: "minuto",
                type: "spinner"
            },
            {
                label: self.tr("Hora (0-24)"),
                name: "hora",
                type: "spinner"
            },
            {
                label: self.tr("Día del mes (0-31)"),
                name: "dia_mes",
                type: "spinner"
            },
            {
                label: self.tr("Mes (0-12)"),
                name: "mes",
                type: "spinner"
            },
            {
                label: self.tr("Día de la semana (0-7)"),
                name: "dia_semana",
                type: "spinner"
            }
        ];
        self.setFields(fields);
        self.ui.minuto.set({
            maximum: 60,
            minimum: 0
        });
        self.ui.hora.set({
            maximum: 24,
            minimum: 0
        });
        self.ui.dia_mes.set({
            maximum: 31,
            minimum: 0
        });
        self.ui.mes.set({
            maximum: 12,
            minimum: 0
        });
        self.ui.dia_semana.set({
            maximum: 7,
            minimum: 0
        });
        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
    },
    members: {
        pr: null,
        slotSave: function slotSave() {
            var self = this;
            var data = self.getRecord();
            var func = function() {
                self.accept();
            };
            qxnw.utils.fastAsyncRpcCall("nw_cron", "save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            self.pr = pr;
            self.setRecord(pr);
            return true;
        }
    }
});