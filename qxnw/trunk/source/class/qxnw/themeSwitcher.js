qx.Class.define("qxnw.themeSwitcher", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        this.createBase();
        var fields = [
            {
                name: "defecto",
                label: "Tema por defecto",
                type: "checkBox"
            },
            {
                name: "indigo",
                label: "Tema Indigo",
                type: "checkBox"
            },
            {
                name: "modern",
                label: "Tema moderno",
                type: "checkBox"
            },
            {
                name: "classic",
                label: "Tema clásico",
                type: "checkBox"
            },
            {
                name: "simple",
                label: "Tema simple",
                type: "checkBox"
            }
        ];

        self.setTitle("::Temas::");
        self.setIconDialog("icon/22/actions/document-properties.png");
        self.setGroupHeader("Seleccione un tema");
        self.setFields(fields);
        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
        var theme = q.localStorage.getItem("theme");
        self.ui.defecto.setValue(true);
        self.ui.defecto.addListener("execute", function(e) {
            var data = this.getValue();
            if (data) {
                qx.theme.manager.Meta.getInstance().setTheme(theme);
                self.processSelectAll(false);
                this.setValue(true);
            }
        });
        self.ui.indigo.addListener("execute", function(e) {
            var data = this.getValue();
            if (data) {
                qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Indigo);
                self.processSelectAll(false);
                this.setValue(true);
            }
        });
        self.ui.modern.addListener("execute", function(e) {
            var data = this.getValue();
            if (data) {
                qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Modern);
                self.processSelectAll(false);
                this.setValue(true);
            }
        });
        self.ui.classic.addListener("execute", function(e) {
            var data = this.getValue();
            if (data) {
                qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Classic);
                self.processSelectAll(false);
                this.setValue(true);
            }
        });
        self.ui.simple.addListener("execute", function(e) {
            var data = this.getValue();
            if (data) {
                qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Simple);
            }
        });
    },
    destruct: function() {

    },
    members: {
        processSelectAll: function processSelectAll(bool) {
            var self = this;
            self.ui.defecto.setValue(bool);
            self.ui.indigo.setValue(bool);
            self.ui.modern.setValue(bool);
            self.ui.classic.setValue(bool);
            self.ui.simple.setValue(bool);
        }
    }
}
);
