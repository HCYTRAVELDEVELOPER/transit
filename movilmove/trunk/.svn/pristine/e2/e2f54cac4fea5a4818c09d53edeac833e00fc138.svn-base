qx.Class.define("transmovapp.forms.f_servicios_totales_ampliar", {
    extend: qxnw.forms,
    construct: function (columns) {
        var self = this;
        self.base(arguments);
        self.createBase();
        self.setGroupHeader(self.tr("Vista ampliada"));
        self.setTitle(self.tr("Vista ampliada"));
//        self.setColumnsFormNumber(5);
        var fields = [];
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
//            console.log("col", col);
            if (col.visibleExtend === false) {
                continue;
            }
            if (qxnw.utils.evalueData(col.visibleExtendGroupStart)) {
                fields.push({
                    name: col.visibleExtendGroupStart,
                    type: "startGroup",
                    icon: "",
                    mode: "horizontal"
                });
            }
            fields.push({
                name: col.caption,
                label: self.tr(col.label),
                type: "textField",
                enabled: false
            });
            if (qxnw.utils.evalueData(col.visibleExtendGroupEnd)) {
                fields.push({
                    name: "",
                    type: "endGroup",
                    icon: ""
                });
            }
        }
        self.setFields(fields);

        self.ui.accept.addListener("execute", function () {
            self.reject();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.ui.cancel.setVisibility("excluded");

        self.addListener("appear", function () {
            qx.bom.element.Class.add(self.getContentElement().getDomElement(), "container_form_extend");
        });
    },
    destruct: function () {
    },
    members: {
        setParamRecord: function setParamRecord(pr) {
            var self = this;
            for (var key in pr) {
                if (!qxnw.utils.evalueData(pr[key])) {
                    pr[key] = "N/A";
                }
            }
            self.setRecord(pr);
            return true;
        }
    }
});
