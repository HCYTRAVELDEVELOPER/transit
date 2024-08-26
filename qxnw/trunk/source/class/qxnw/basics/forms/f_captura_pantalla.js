qx.Class.define("qxnw.basics.forms.f_captura_pantalla", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.setTitle(self.tr("Capturar Pantalla"));
        self.createBase();
        var fields = [
            {
                name: "id",
                label: "ID",
                caption: "id",
                type: "textField",
                visible: false
            },
            {
                name: "button",
                label: "Tomar screenShot",
                type: "button"
            }
        ];
        self.setFields(fields);
        self.ui.button.setMinWidth(100);
        self.ui.button.setMinHeight(50);
        self.ui.button.addListener("click", function() {
           qxnw.utils.screenShot(true);
        });
        self.ui.accept.addListener("execute", function() {
            self.slotSave();
        });
        self.ui.accept.setVisibility("excluded");
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
    },
    destruct: function() {
    },
    members: {
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            return true;
        }
    }
});