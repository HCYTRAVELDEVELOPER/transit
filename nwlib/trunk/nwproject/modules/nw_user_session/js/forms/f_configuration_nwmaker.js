function f_configuration_nwmaker() {
    var thisDoc = this;
    thisDoc.constructor = constructor;
    var si = getUserInfo();
    var config = getConfigApp();
    thisDoc.up = si;
    thisDoc.config = config;

    function constructor() {
        var self = generateSelf(false, true);
        thisDoc.self = self;

        createTreeNwMaker(self);

        var fields = [
            {
                type: 'file',
                label: 'Mi perfil',
                name: 'miperfil',
                depend: false
            },
            {
                type: 'carpet',
                label: str('Idioma'),
                name: 'idioma_con',
                depend: false
            },
            {
                type: 'carpet',
                label: str('Formas de pago'),
                name: 'formaspago_con',
                depend: false
            },
            {
                type: 'file',
                label: 'Ver mi IP',
                name: 'vermiip',
                depend: false
            },
            {
                type: 'file',
                label: 'NwDrive',
                name: 'nwdrive',
                depend: false
            }
        ];

        if (si.usuario_principal === si.usuario && si.terminal === si.terminal_principal && config.permitir_crear_usuarios === true) {
            fields.push(
                    {
                        type: 'file',
                        label: 'Mis Usuarios',
                        name: 'misusuarios',
                        depend: false
                    }
            );
        }
        if (validaUserDeveloperNwMaker() === true) {
            fields.push(
                    {
                        type: 'file',
                        label: 'Developers Help',
                        name: 'developershelp',
                        depend: false
                    },
                    {
                        type: 'file',
                        label: 'NwMaker Admin',
                        name: 'nwmakeradmin',
                        depend: false
                    }
            );
        }
        fields.push(
                {
                    type: 'file',
                    label: 'Acerca de',
                    name: 'acercade',
                    depend: false
                },
                {
                    type: 'file',
                    label: 'Cerrar sesión',
                    name: 'cerrarsesion',
                    depend: false
                }
        );

        addFieldsLeftInTree(self, fields);

        selfButton(self, "formaspago_con").click(function () {
            formasPago();
        });
        selfButton(self, "cerrarsesion").click(function () {
            closeSession();
        });
        selfButton(self, "misusuarios").click(function () {
            loadRightFuncTree(self, function (a) {
                getMyUsersNwMaker(false, a);
            });
        });
        selfButton(self, "developershelp").click(function () {
            loadRightFuncTree(self, function (a) {
                examplesNwMaker(a);
            }, false, false, true);
        });
        selfButton(self, "nwmakeradmin").click(function () {
            loadRightFuncTree(self, function (a) {
                nwMakerAdmin(a);
            }, false, false, true);
        });
        selfButton(self, "acercade").click(function () {
            loadRightFuncTree(self, function (a) {
                acercade(a);
            });
        });
        selfButton(self, "nwdrive").click(function () {
            activeNwDrive();
        });
        selfButton(self, "miperfil").click(function () {
            var up = getUserInfo();
            loadAjaxProfileUserNw(up.usuario);
        });
        selfButton(self, "vermiip").click(function () {
            loadRightFuncTree(self, function (a) {
                vermiip(a);
            });
        });
        selfButton(self, "idioma_con").click(function () {
            loadRightFuncTree(self, function (a) {
                idioma(a);
            });
        });
        removeLoadingNw();
    }
 
    function vermiip(self) {
        loadJs("/nwlib6/nwproject/modules/webrtc/js/getIP.js", function () {
            self = generateSelf(self);
            var fields = [];
            createNwForms(self, fields, "nopopUp");
            getIPs(function (d) {
                var ip = d.ip;
                var red = d.id_red;
                var html = "";
                html += "<p>";
                html += " MI IP: " + ip;
                html += " ID RED: " + red;
                html += "</p>";
                addHeaderNote(self, html);
                var cancel = addButtonNwForm("Cerrar", self);
                if (!isMobile()) {
                    cancel.css({"display": "none"});
                } else {
                    cancel.click(function () {
                        reject(self);
                        loadConfiguracionNwMaker();
                        return true;
                    });
                }
            });
        }, false, true);
    }

    function acercade(self) {
        var self = generateSelf(self);
        var fields = [];
        createNwForms(self, fields, "nopopUp");
        var c = nwm.getInfoApp();
        var v = nwm.getVersionNwMaker();
        var lib = nwm.getVersionNwLib();
        var html = "<h3>" + c.name + " Versión " + c.version + "</h3>";
        html += "<p>NwMaker v" + v + "</p>";
        html += "<p>NwLib v" + lib + "</p>";
        html += "<p><br />" + c.description + "</p>";
        html += "<p><br />" + c.co_creator + " Derechos Reservados</p>";
        html += "<p class='creditsNwInAbout'><br /><a href='https://www.gruponw.com' target='_BLANK'>NwGroup technology</a></p>";
        addHeaderNote(self, html);
        var cancel = addButtonNwForm("Cerrar", self);
        cancel.click(function () {
            reject(self);
            window.history.back();
            return true;
        });
    }

    function idioma(self) {
        var self = generateSelf(self);
        var fields = [
            {
                tipo: 'selectBox',
                nombre: str('Idioma'),
                name: 'idioma',
                requerido: "SI"
            }
        ];
        createNwForms(self, fields, "nopopUp");
        var datap = {};
        datap["es"] = str("Español");
        datap["en"] = str("English");
        datap["pt"] = str("Português");
        datap["fr"] = str("Français");
        datap["de"] = str("Deutsch");
        populateSelectFromArray("idioma", datap);

        setValue(self, "idioma", getLanguage());
        var accept = addButtonNwForm("Aceptar", self);
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            var data = getRecordNwForm(self);
            setLanguage(data.idioma);
            reject(self);
            window.history.back();
            return true;
        });
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            reject(self);
            window.history.back();
            return true;
        });
    }
}