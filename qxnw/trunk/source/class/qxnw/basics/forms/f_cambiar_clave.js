qx.Class.define("qxnw.basics.forms.f_cambiar_clave", {
    extend: qxnw.forms,
    construct: function (showFirst) {
        var self = this;
        this.base(arguments);
        this.setTitle(self.tr("Cambiar clave"));
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
                name: "vieja",
                label: "Clave anterior",
                caption: "vieja",
                type: "passwordField"
            },
            {
                name: "nueva",
                label: "Clave nueva",
                caption: "nueva",
                type: "passwordField"
            },
            {
                name: "repetida",
                label: "Nuevamente",
                caption: "repetida",
                type: "passwordField"
            }
        ];
        if (typeof showFirst != 'undefined') {
            if (showFirst == false) {
                self.__showFirst = false;
                for (var i = 0; i < fields.length; i++) {
                    if (fields[i]["name"] == "vieja") {
                        fields.splice(i, 1);
                        break;
                    }
                }
            }
        }
        self.setFields(fields);
        self.ui.nueva.addListener("keypress", function (e) {
            var d = e.getKeyIdentifier();
            if (d == "Enter") {
                self.ui.repetida.focus();
            }
        });
        self.ui.repetida.addListener("keypress", function (e) {
            var d = e.getKeyIdentifier();
            if (d == "Enter") {
                self.ui.accept.focus();
            }
        });
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });
        self.populateSettings();
    },
    destruct: function () {
    },
    members: {
        __showFirst: null,
        switchPropertyName: function switchPropertyName(name) {
            var self = this;
            var rta = "";
            switch (name) {
                case "minimun_length":
                    rta = self.tr("La longitud mínima es de %s");
                    break;
                case "upper_word":
                    rta = self.tr("Debe contener al menos un caracter en <b>MAYÚSCULA</b>");
                    break;
                case "numeric_word":
                    rta = self.tr("Debe contener al menos un <b>NÚMERO</b>");
                    break;
                case "special_characters":
                    rta = self.tr("Debe contener al menos un caracter especial <b>(#$@)</b>");
                    break;
            }
            return rta;
        },
        populateSettings: function populateSettings() {
            var self = this;
            var html = "<ul>";
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
            var func = function (r) {
                if (r) {
                    if (typeof r.length != 'undefined') {
                        if (r.length > 0) {
                            var keys = Object.keys(r[0]);
                            var counter = 0;
                            for (var v in r[0]) {
                                if (r[0][v] != null) {
                                    var pn = self.switchPropertyName(keys[counter]);
                                    if (pn != "") {
                                        pn = pn.replace("%s", r[0][v]);
                                        html += "<li>";
                                        html += pn;
                                        html += "</li>";
                                    }
                                }
                                counter++;
                            }
                            html += "</ul>";
                            self.addFooterNote(html);
                        }
                    }
                }
            };
            rpc.exec("populate", {table: 'nw_keys_conf'}, func);
        },
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            if (self.__showFirst != null) {
                data["showFirst"] = false;
            }
            var rpc = new qxnw.rpc(self.getRpcUrl(), "session", true);
            var func = function (r) {
                if (r) {
                    qxnw.utils.information("Clave cambiada correctamente");
                    self.accept();
                }
            };
            rpc.exec("cambiar_clave", data, func);
        },
        setParamRecord: function setParamRecord(pr) {
            this.setRecord(pr);
            return true;
        }
    }
});