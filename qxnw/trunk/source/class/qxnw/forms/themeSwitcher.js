qx.Class.define("qxnw.forms.themeSwitcher", {
    extend: qxnw.forms,
    construct: function() {
        var self = this;
        this.base(arguments);
        self.setColumnsFormNumber(0);
        var fields = [
            {
                name: "defecto",
                label: "Tema por defecto",
                type: "radioButton"
            },
            {
                name: "qxnw_soft",
                label: "QXNW Soft",
                type: "radioButton"
            },
            {
                name: "indigo",
                label: "Tema Indigo",
                type: "radioButton"
            },
            {
                name: "modern",
                label: "Tema moderno",
                type: "radioButton"
            },
            {
                name: "classic",
                label: "Tema clásico",
                type: "radioButton"
            },
            {
                name: "simple",
                label: "Tema simple",
                type: "radioButton"
            },
            {
                name: "aristo",
                label: "Aristo",
                type: "radioButton",
                visible: false
            },
            {
                name: "darktheme",
                label: "Tema oscuro",
                type: "radioButton",
                visible: true
            },
            {
                name: "graydient",
                label: "Graydient",
                type: "radioButton",
                visible: false
            },
            {
                name: "retrored",
                label: "Retro rojo",
                type: "radioButton",
                visible: false
            },
            {
                name: "retroblue",
                label: "Retro azul",
                type: "radioButton",
                visible: false
            }
        ];

        self.setTitle("::Temas::");
        self.setIconDialog(qxnw.config.execIcon("document-properties"));
        self.setGroupHeader("Seleccione un tema");
        self.setFields(fields);

        self.manager = new qx.ui.form.RadioGroup(self.ui.qxnw_soft, self.ui.defecto, self.ui.indigo, self.ui.modern, self.ui.classic, self.ui.simple, self.ui.aristo,
                self.ui.darktheme, self.ui.graydient, self.ui.retrored, self.ui.retroblue);

        self.ui.cancel.addListener("execute", function() {
            self.reject();
        });
        self.ui.accept.addListener("click", function() {
            self.execTheme();
        });
        self.setLocalTheme();
    },
    destruct: function() {

    },
    members: {
        manager: null,
        setLocalTheme: function setLocalTheme() {
            var self = this;
            var theme = qxnw.local.getOpenData("config_theme");
            var rta = false;
            if (theme != null) {
                switch (theme) {
                    case "qxnw.qxnw_soft":
                        self.ui.qxnw_soft.setValue(true);
                        rta = true;
                        break;
                    case "qx.theme.Modern":
                        self.ui.modern.setValue(true);
                        rta = true;
                        break;
                    case "qx.theme.Classic":
                        self.ui.classic.setValue(true);
                        rta = true;
                        break;
                    case "qx.theme.Simple":
                        self.ui.simple.setValue(true);
                        rta = true;
                        break;
                    case "qx.theme.Indigo":
                        self.ui.indigo.setValue(true);
                        rta = true;
                        break;
                    case "qxnw.themes.aristo.Aristo":
                        self.ui.aristo.setValue(true);
                        rta = true;
                        break;
                    case "qxnw.themes.darktheme.DarkTheme":
                        self.ui.darktheme.setValue(true);
                        rta = true;
                        break;
                    case "qxnw.themes.gradienttheme.GraydientTheme":
                        self.ui.graydient.setValue(true);
                        rta = true;
                        break;
                    case "qxnw.themes.retrotheme.RetroThemeRed":
                        self.ui.retrored.setValue(true);
                        rta = true;
                        break;
                    case "qxnw.themes.retrotheme.RetroThemeBlue":
                        self.ui.retroblue.setValue(true);
                        rta = true;
                        break;
                }
            } else {
                self.ui.defecto.setValue(true);
            }
            return rta;
        },
        execTheme: function execTheme() {
            var self = this;
            //qxnw.utils.createIdeaPopUp("Transformando...al actualizar, la puesta en marcha del nuevo tema será completa.");
            var qxnw_soft = {"name": "qxnw_soft", "selected": self.ui.qxnw_soft.getValue()};
            var defecto = {"name": "defecto", "selected": self.ui.defecto.getValue()};
            var indigo = {"name": "indigo", "selected": self.ui.indigo.getValue()};
            var modern = {"name": "modern", "selected": self.ui.modern.getValue()};
            var classic = {"name": "classic", "selected": self.ui.classic.getValue()};
            var simple = {"name": "simple", "selected": self.ui.simple.getValue()};
            var aristo = {"name": "aristo", "selected": self.ui.aristo.getValue()};
            var darktheme = {"name": "darktheme", "selected": self.ui.darktheme.getValue()};
            var graydient = {"name": "graydient", "selected": self.ui.graydient.getValue()};
            var retrored = {"name": "retrored", "selected": self.ui.retrored.getValue()};
            var retroblue = {"name": "retroblue", "selected": self.ui.retroblue.getValue()};
            var data = [];
            data.push(qxnw_soft);
            data.push(defecto);
            data.push(indigo);
            data.push(modern);
            data.push(classic);
            data.push(simple);
            data.push(aristo);
            data.push(darktheme);
            data.push(graydient);
            data.push(retrored);
            data.push(retroblue);
            for (var i = 0; i < data.length; i++) {
                if (data[i].selected == true) {
                    switch (data[i].name) {
                        case "qxnw_soft":
                            qxnw.local.storeOpenData("config_theme", "qxnw_soft");
                            if (!qxnw.config.getInstance().getIsLoadedQxnw_soft()) {
                                qxnw.utils.loadCss("/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/css/light.css");
                                qxnw.config.getInstance().setIsLoadedQxnw_soft(true);
                            }
                            break;
                        case "default":
                            qxnw.local.storeOpenData("config_theme", "default");
                            qx.theme.manager.Meta.getInstance().resetTheme();
                            break;
                        case "indigo":
                            qxnw.local.storeOpenData("config_theme", "qx.theme.Indigo");
                            qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Indigo);
                            break;
                        case "modern":
                            qxnw.local.storeOpenData("config_theme", "qx.theme.Modern");
                            qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Modern);
                            break;
                        case "classic":
                            qxnw.local.storeOpenData("config_theme", "qx.theme.Classic");
                            qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Classic);
                            break;
                        case "simple":
                            qxnw.local.storeOpenData("config_theme", "qx.theme.Simple");
                            qx.theme.manager.Meta.getInstance().setTheme(qx.theme.Simple);
                            break;
                        case "aristo":
                            qxnw.local.storeOpenData("config_theme", "qxnw.themes.aristo.Aristo");
                            qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.aristo.Aristo);
                            break;
                        case "darktheme":
                            qxnw.local.storeOpenData("config_theme", "qxnw.themes.darktheme.DarkTheme");
                            qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.bernstein.Bernstein);
                            break;
                        case "graydient":
                            qxnw.local.storeOpenData("config_theme", "qxnw.themes.graydienttheme.GraydientTheme");
                            qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.graydienttheme.GraydientTheme);
                            break;
                        case "retrored":
                            qxnw.local.storeOpenData("config_theme", "qxnw.themes.retrotheme.RetroThemeRed");
                            qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.retrotheme.RetroThemeRed);
                            break;
                        case "retroblue":
                            qxnw.local.storeOpenData("config_theme", "qxnw.themes.retrotheme.RetroThemeBlue");
                            qx.theme.manager.Meta.getInstance().setTheme(qxnw.themes.retrotheme.RetroThemeBlue);
                            break;
                    }
                }
            }
        }
    }
}
);
