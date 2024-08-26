qx.Class.define("qxnw.security.f_security_keys", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        self.setColumnsFormNumber(1);
        self.setTitle(self.tr("Configuraciones de seguridad"));
        var fields = [
            {
                name: "block_fail_access",
                type: "spinner",
                label: self.tr("Número de intentos para bloquear:")
            },
            {
                name: "minutes_blocked_fail_access",
                type: "spinner",
                label: self.tr("Minutos de bloqueo:")
            },
            {
                name: "expiration_days",
                type: "spinner",
                label: self.tr("Días para cambiar la contraseña obligatoriamente:")
            },
            {
                name: "concurrency",
                type: "selectBox",
                label: self.tr("¿Permitir concurrencia?")
            },
            {
                name: "inactivity_days",
                type: "spinner",
                label: self.tr("Días de inactividad para obligar a cambiar la clave:")
            },
            {
                name: "days_search_old_key",
                type: "spinner",
                label: self.tr("Días de consulta de claves antíguas:")
            },
            {
                name: "minimun_length",
                type: "spinner",
                label: self.tr("Longitud mínima para las claves:")
            },
            {
                name: "numeric",
                type: "selectBox",
                label: self.tr("Exigir caracteres numéricos:")
            },
            {
                name: "upper",
                type: "selectBox",
                label: self.tr("Exigir caracteres en mayúscula:")
            },
            {
                name: "special_characters",
                type: "selectBox",
                label: self.tr("Exigir caracteres especiales:")
            },
            {
                name: "change_at_init",
                type: "checkBox",
                label: self.tr("Cambio de contraseña la primera vez de uso")
            },
            {
                name: "check_terminal",
                type: "checkBox",
                label: self.tr("Revisar sede vs IP")
            }
        ];
        self.setFields(fields);
        var d = {};
        d["SI"] = "SI";
        d["NO"] = "NO";
        qxnw.utils.populateSelectFromArray(self.ui.concurrency, d);
        qxnw.utils.populateSelectFromArray(self.ui.upper, d);
        qxnw.utils.populateSelectFromArray(self.ui.numeric, d);
        qxnw.utils.populateSelectFromArray(self.ui.special_characters, d);
        self.ui.cancel.addListener("execute", function (e) {
            self.close();
        });
        self.ui.accept.addListener("execute", function () {
            self.save();
        });
        self.slotPopulateContent();
    },
    members: {
        save: function save() {
            var self = this;
            var data = self.getRecord();
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_security");
            rpc.setAsync(true);
            var func = function () {
                self.accept();
            };
            rpc.exec("save", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            return true;
        },
        slotPopulateContent: function () {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_security", true);
            var func = function (r) {
                if (r == false) {
                    return;
                }
                self.ui.block_fail_access.setValue(r.block_fail_access != null ? parseInt(r.block_fail_access) : 0);
                self.ui.minutes_blocked_fail_access.setValue(r.minutes_blocked_fail_access != null ? parseInt(r.minutes_blocked_fail_access) : 0);
                self.ui.expiration_days.setValue(r.expiration_days != null ? parseInt(r.expiration_days) : 0);
                self.ui.concurrency.setValue(r.concurrency != null ? r.concurrency : '');
                self.ui.inactivity_days.setValue(r.inactivity_days != null ? parseInt(r.inactivity_days) : 0);
                self.ui.days_search_old_key.setValue(r.days_search_old_key != null ? parseInt(r.days_search_old_key) : 0);
                self.ui.minimun_length.setValue(r.minimun_length != null ? parseInt(r.minimun_length) : 0);
                self.ui.upper.setValue(r.upper_word);
                self.ui.numeric.setValue(r.numeric_word);
                self.ui.special_characters.setValue(r.special_characters);

                var change_at_init = false;
                if (r.change_at_init === "t") {
                    change_at_init = true;
                } else if (r.change_at_init === "true") {
                    change_at_init = true;
                } else if (r.change_at_init === true) {
                    change_at_init = true;
                }
                var check_terminal = false;
                if (r.check_terminal === "t") {
                    check_terminal = true;
                } else if (r.check_terminal === "true") {
                    check_terminal = true;
                } else if (r.change_at_init === true) {
                    check_terminal = true;
                }
                self.ui.change_at_init.setValue(change_at_init);
                self.ui.check_terminal.setValue(check_terminal);
            };
            rpc.exec("getData", 0, func);
            return true;
        }
    }
});