/* ************************************************************************
 
 Copyright:
 2019 gruponw.com, https://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Login class to start any software
 
 ************************************************************************ */

qx.Class.define("qxnw.login", {
    extend: qxnw.forms,
    /**
     * Event fired on complete the remote procedure
     */
    events: {
        logged: "qx.event.type.Data",
        loadedCompany: "qx.event.type.Data"
    },
    construct: function (load_css) {
        var self = this;
        if (typeof load_css === 'undefined') {
            load_css = true;
        }
        this.base(arguments);

        self.setCreateHelpButton(false);

        self.setInvalidateStore(true);
        self.set({
            opacity: 0.81,
            resizable: false
        });
        if (load_css === true) {
            self.addListener("appear", function () {
                qx.bom.element.Class.add(self.getContentElement().getDomElement(), "nw_login_box");

                // qx.bom.element.Style.setCss(this, "background-size: 100%");
                try {
                    qx.bom.element.Style.set(self.getContentElement().getDomElement(), "border", "1px solid #ccc");
                    qx.bom.element.Style.set(self.getContentElement().getDomElement(), "box-shadow", "rgba(217, 185, 78 ) 1px 1px 10px 1px");
                    qx.bom.element.Style.set(self.getChildControl("pane").getContentElement().getDomElement(), "background", "red");
                    qx.bom.element.Style.set(self.getChildControl("pane").getContentElement().getDomElement(), "border", "none");
                    qx.bom.element.Style.set(self.getChildControl("pane").getContentElement().getDomElement(), "padding", "80px");
                    qx.bom.element.Style.set(self.getChildControl("pane").getContentElement().getDomElement(), "color", "red");
                } catch (e) {
                    qxnw.utils.nwconsole(e);
                }
                // qx.bom.element.Style.set(self.getChildControl("statusbar-text").getContentElement().getDomElement(), "color", "#999");

            });
        }
        //var cont = self.getChildrenContainer();
        //self._activateMoveHandler(self);
        self.addHeaderNote(self.tr("<div style='font-size: 14px; color:#444;'><h2>Aplicativo HCY </h2><p>Iniciar Sesión</p></div>"));
        self.setColumnsFormNumber(0);
        //self.setModal(true);

        self.setTitle("::" + this.tr("Inicio") + "::");
        self.setIconDialog(qxnw.config.execIcon("office-project", "apps"));
        self.setGroupHeader(this.tr("Datos de Ingreso"));
        //this.setSimpleWindow(false);
        self.getChildControl("captionbar").setVisibility("excluded");

        self.putFieldsIntoFormTag();

        var fields = [
            {
                name: "usuario",
                label: this.tr("Usuario"),
                type: "textField",
                required: true 
            },
            {
                name: "clave",
                label: this.tr("Paswword"),
                type: "passwordField",
                required: true,
                font: {
                    size: 14
                }
            },
            {
                name: "empresa",
                label: this.tr("Empresa"),
                type: "selectBox",
                required: false,
                enabled: true
            },
            /*{
                name: "",
                type: "startGroup",
                maximize: false,
                mode: "horizontal"
            },*/
            {
                name: "no_close",
                label: this.tr(""),
                type: "label",
                required: false,
                enabled: true
            },
            {
                name: "show_password",
                label: this.tr(""),
                type: "label",
                required: false,
                enabled: true
            },
            {
                name: "",
                type: "endGroup"
            }
        ];
        self.setFields(fields);

        self.ui.show_password.addListener("changeValue", function (e) {
            var bool = e.getData();
            if (bool) {
                self.ui.clave.getContentElement().setAttribute("type", "text");
            } else {
                self.ui.clave.getContentElement().setAttribute("type", "password");
            }
        });

        self.ui.usuario.addListener("appear", function () {
            qx.bom.element.Class.add(self.getContentElement().getDomElement(), "nw_username_field");
        });
        self.ui.clave.addListener("appear", function () {
            qx.bom.element.Class.add(self.getContentElement().getDomElement(), "nw_password_field");
        });
        self.ui.no_close.addListener("appear", function () {
            qx.bom.element.Class.add(self.getContentElement().getDomElement(), "nw_noclose_field");
        });

        var openDataUser = qxnw.local.getOpenData("user");
        var openDataNoClose = qxnw.local.getOpenData("no_close");

        self.ui.usuario.setValue(openDataUser);
        self.ui.no_close.setValue(openDataNoClose);

        self.ui.usuario.setTextSelection(0);
        self.ui.empresa.addListener("keypress", function (e) {
            if (e._keyCode == 13) {
                self.ui.accept.focus();
            }
        });
        self.ui.usuario.addListener("keypress", function (e) {
            if (e._keyCode == 13) {
                if (self.ui.clave.isFocusable()) {
                    self.ui.clave.focus();
                }
            }
        });

        try {
            if (qxnw.utils.getScriptURLParameter("nw-script-main", "version") != null) {
                qxnw.userPolicies.setVersion(qxnw.utils.getScriptURLParameter("nw-script-main", "version"));
            }
        } catch (e) {

        }

        //var powered = self.tr("</a><p><a style='font-size: 10px; color:#444;' class='enlace_powered' href='http://www.gruponw.com' target='_blank'>Powered By <span style='color:red;'>NW</span><span style='color:#777;'> Group</span>, Versión: {version_release}</a></p>");
        //powered = powered.replace("{version_release}", qxnw.userPolicies.getVersion());

        var rememberPasswordLbl = new qx.ui.basic.Label().set({
            rich: true,
            //value: "<a style='font-size: 11px; color:firebrick; text-decoration: none;font-weight: bold;' href='#' onClick='forgotPassword(); return false;'>" + self.tr("¿Olvidó su contraseña?<span style='color:#666; text-decoration: underline;'> Haga clic aqui para recuperarla</span>") + powered,
            maxHeight: 60,
            minWidth: 200
        });
        self.insert(rememberPasswordLbl, {
            flex: 0
        });

        forgotPassword = function () {
            var d = new qxnw.forms();
            d.setModal(true);
            d.set({
                showMinimize: false,
                showMaximize: false,
                showClose: false
            });
            d.setTitle(d.tr("::Recuperación de contraseñas::"));
            var fields = [
                {
                    name: "",
                    type: "startGroup",
                    mode: "horizontal"
                },
                {
                    name: "email",
                    label: d.tr("Su e-mail"),
                    type: "textField",
                    required: true,
                    mode: "email"
                },
                {
                    name: "",
                    type: "endGroup"
                }
            ];
            d.setFields(fields);
            d.ui.email.addListener("keypress", function (e) {
                var key = e.getKeyIdentifier();
                if (key == "Enter") {
                    self.processFindEnter(d);
                }
            });
            d.ui.accept.addListener("execute", function (e) {
                self.processFindEnter(d);
            });
            d.ui.cancel.addListener("execute", function (e) {
                d.reject();
            });
            d.show();
        };
        self.ui.clave.addListener("keypress", function (e) {
            if (e.getKeyIdentifier() == "Tab" && e.isShiftPressed()) {
                return;
            }
            if (e._keyCode == 13 || e._keyCode == 9) {
                if (!self.validate()) {
                    qxnw.animation.startEffect("shake", self);
                    return;
                }
                qxnw.local.storeOpenData("user", self.ui.usuario.getValue());
                qxnw.local.storeOpenData("no_close", self.ui.no_close.getValue());
                self.consultUser();
            }
        });
        var listenerAccept = self.ui.accept.addListener("execute", function (e) {
            if (!self.validate()) {
                return;
            }
            qxnw.local.storeOpenData("user", self.ui.usuario.getValue());
            qxnw.local.storeOpenData("no_close", self.ui.no_close.getValue());
            self.consultUser();
        });
        self.ui.accept.setUserData("listenerAccept", listenerAccept);
        self.ui.cancel.addListener("execute", function () {
            self.reject();
            window.location.reload();
        });
        self.setShowMinimize(false);
        self.setShowMaximize(false);
        self.setShowClose(false);
        self.setFieldVisibility(self.ui.empresa, 'excluded');
        self.addListener("NWChangeFieldVisibility", function () {
            self.__isHiddenCompany = true;
        });
        self.center();

        qxnw.main.deleteMenuCache(false);

        if (qxnw.userPolicies.getAuthByToken() === true) {
            var userNameAuth = qxnw.userPolicies.getUserNameAuth();
            if (userNameAuth == "") {
                return;
            }
            self.ui.usuario.setValue(userNameAuth);
            if (userPassAuth == "") {
                return;
            }
            var userPassAuth = qxnw.userPolicies.getUserPassAuth();
            self.ui.clave.setValue(userPassAuth);
            qxnw.utils.loading(self.tr("Autenticando por token..."));
            setTimeout(function () {
                qxnw.utils.stopLoading();
                self.consultUser();
            }, 500);
        }

//        var css = 'width: 110px;border: 1px solid #CCC;position: text-align: center;color: #444;margin-top: 10px;left: 190px;background: rgba(225%, 225%, 225%, 0.6);border-radius: 10px;-webkit-border-radius: 10px;box-shadow: 0 4px 23px 5px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.15);';
//        qx.bom.element.Style.setCss(self.getContentElement(), css);
    },
    destruct: function () {
    },
    members: {
        __model: null,
        __method: null,
        __ok: false,
        __isHiddenCompany: false,
        __perfil: null,
        __pais: null,
        __pais_nombre: null,
        __zona_horaria: null,
        __idioma: null,
        __perfilNom: null,
        __logo: null,
        __web: null,
        processFindEnter: function (d) {
            var self = this;
            if (!d.validate()) {
                return;
            }
            var data = d.getRecord();
            data.email = qxnw.utils.cleanHtml(data.email);
            data.email = data.email.replace("'", "");
            data.email = data.email.replace(";", "");
            var dii = {};
            dii.table = "usuarios";
            dii.fields = "usuario";
            dii.where = "email='" + data.email + "' ";
            dii.type = "select";
            qxnw.utils.fastAsyncCallRpc("Master", "autoQuery", dii, function (rta) {
                if (typeof rta[0] == 'undefined' || rta[0].usuario == 'undefined') {
                    qxnw.utils.information(self.tr("El correo no existe en nuestros registros"), function () {
                        var t = new qx.event.Timer(100);
                        t.start();
                        t.addListener("interval", function (e) {
                            this.stop();
                            d.ui.email.focus();
                        });
                    });
                    return;
                }
                var dtt = {};
                dtt.table = "nw_security_questions";
                dtt.fields = "pregunta,respuesta";
                dtt.where = "usuario='" + rta[0].usuario + "' ";
                dtt.type = "select";
                qxnw.utils.fastAsyncCallRpc("Master", "autoQuery", dtt, function (rtas) {
                    if (rtas.length == 0) {
                        var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
                        rpc.setAsync(true);
                        var func = function (r) {
                            d.accept();
                            d.close();
                            if (self.ui.usuario.isFocusable()) {
                                self.ui.usuario.focus();
                            }
                            qxnw.utils.information(r);
                            return;
                        };
                        rpc.exec("forgotPassword", data, func);
                    } else {
                        var ff = new qxnw.forms();
                        ff.set({
                            showMinimize: false,
                            showClose: false,
                            showMaximize: false
                        });
                        ff.setTitle(self.tr("Preguntas de seguridad"));
                        ff.setModal(true);
                        var ffields = [];
                        for (var i = 0; i < rtas.length; i++) {
                            var v = {
                                name: "pregunta" + i,
                                label: rtas[i].pregunta,
                                type: "passwordField",
                                required: true
                            };
                            ffields.push(v);
                        }
                        ff.setFields(ffields);
                        ff.show();
                        ff.ui.cancel.addListener("execute", function () {
                            ff.reject();
                        });
                        ff.ui.accept.addListener("execute", function () {
                            if (!ff.validate()) {
                                return;
                            }
                            var records = ff.getRecord();
                            var counter = 0;
                            for (var vi in records) {
                                if (records[vi] != rtas[counter]["respuesta"]) {
                                    ff.ui["pregunta" + counter].focus();
                                    qxnw.utils.information(self.tr("Verifique sus respuestas"));
                                    return;
                                }
                                counter++;
                            }
                            var rpc = new qxnw.rpc(self.getRpcUrl(), "master");
                            rpc.setAsync(true);
                            var funct = function (r) {
                                if (r) {
                                    d.accept();
                                    ff.accept();
                                    ff.close();
                                    d.close();
                                    if (self.ui.usuario.isFocusable()) {
                                        self.ui.usuario.focus();
                                    }
                                    qxnw.utils.information(self.tr("En pocos minutos recibirá un correo para cambiar su contraseña"));
                                    return;
                                }
                            };
                            rpc.exec("forgotPassword", data, funct);
                        });
                    }
                });
            });
        },
        setMethod: function (method) {
            this.__method = method;
        },
        setEmpresa: function (ra) {
            var self = this;
            var data = {};

            var v = self.ui.empresa.getValue();

            if (typeof v.empresa_model.logo != 'undefined') {
                if (v.empresa_model.logo != '') {
                    ra.logo = v.empresa_model.logo;
                }
            }
            if (typeof v.empresa_model.web != 'undefined') {
                if (v.empresa_model.web != '') {
                    ra.web = v.empresa_model.web;
                }
            }
            if (typeof v.empresa_model.terminal != 'undefined') {
                if (v.empresa_model.terminal != '') {
                    ra.terminal = v.empresa_model.terminal;
                }
            }
            if (typeof v.empresa_model.nom_terminal != 'undefined') {
                if (v.empresa_model.nom_terminal != '') {
                    ra.nom_terminal = v.empresa_model.nom_terminal;
                }
            }

            data["empresa"] = v.empresa;
            data["nom_empresa"] = v.empresa_text;
            data["logo"] = v.empresa_model.logo;
            data["web"] = v.empresa_model.web;
            data["pais"] = v.empresa_model.pais;
            data["pais_nombre"] = v.empresa_model.pais_nombre;
            data["idioma_text"] = v.empresa_model.idioma_text;
            data["zona_horaria"] = v.empresa_model.zona_horaria;

            data["model"] = v.empresa_model;

            ra.empresa = v.empresa;
            ra.nom_empresa = v.empresa_text;

            //ADITIONAL PARAMS
            self.__params = v.empresa_model;

            // PROFILE DATA
            self.__perfil = data["model"].perfil;
            self.__perfilNom = data["model"].nom_perfil;

            // COUNTRY DATA
            self.__pais = data["model"].pais;
            self.__pais_nombre = data["model"].pais_nombre;
            self.__zona_horaria = data["model"].zona_horaria;
            self.__idioma = data["model"].idioma_text;
            self.__logo = data["logo"];
            self.__web = data["model"].web;

            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_session");
            var r = rpc.exec("setEmpresa", data);

            if (typeof r.perms !== 'undefined') {
                self.__perms = r.perms;
            }

            if (rpc.isError()) {
                qxnw.animation.startEffect("shake", self);
                qxnw.utils.alert(self.tr("Se presentó un problema iniciando la sesión. Inténtelo de nuevo."), self);
                return false;
            }

            qxnw.local.setPrefix(r.empresa + "_" + r.usuario);
            qxnw.local.storeDataWithOutPrefix("session", r, false);

            if (qxnw.utils.evalue(r.concurrency)) {
                if (qxnw.utils.evalue(r.msg)) {
                    if (typeof r != 'undefined' && typeof r.concurrency != 'undefined' && typeof r.msg != 'undefined') {
                        if (r.concurrency === true) {
                            qxnw.utils.question(r.msg, function (rta) {
                                if (rta === false) {
                                    var t = new qx.event.Timer(5000);
                                    t.start();
                                    t.addListener("interval", function (e) {
                                        this.stop();
                                        location.reload();
                                        return;
                                    });
                                } else {
                                    qxnw.utils.loading(self.tr("Intentando cerrar la sesión..."));
                                    var t = new qx.event.Timer(100);
                                    t.start();
                                    t.addListener("interval", function (e) {
                                        this.stop();
                                        var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_session");
                                        rpc.setAsync(true);
                                        var func = function (rtaa) {
                                            qxnw.utils.stopLoading();
                                            location.reload();
                                            return;
                                        };
                                        rpc.exec("closePreviousSession", r, func);
                                    });
                                }
                            });
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        getEmpresas: function (codigo_usuario) {
            var self = this;
            var data = {};
            data["usuario"] = codigo_usuario;
            data["version"] = qxnw.local.getAppVersion();
            self.ui.empresa.removeAll();
            var answer = qxnw.utils.populateSelect(self.ui.empresa, "nw_session", "getEmpresas", data);
            if (typeof answer == 'undefined' || answer == null || answer == "") {
                return false;
            }
            if (answer.size == 0) {
                qxnw.animation.startEffect("shake", self);
                qxnw.utils.information(self.tr("No tiene permisos en ninguna empresa"), function () {
                    if (self.ui.clave.isFocusable()) {
                        if (self.ui.clave != null) {
                            self.ui.clave.focus();
                        }
                    }
                });
                return false;
            } else if (answer.size == 1) {

                if (self.ui.accept != null) {
                    try {
                        self.ui.accept.focus();
                    } catch (e) {

                    }
                }
            } else {
                if (answer.size > 1) {
                    self.setFieldVisibility(self.ui.empresa, 'visible');
                }

                if (!self.__isHiddenCompany) {
                    if (self.ui.empresa != null) {
                        self.ui.empresa.focus();
                    }
                } else {
                    if (self.ui.accept != null) {
                        self.ui.accept.focus();
                    }
                }
            }
            self.fireDataEvent("loadedCompany", answer);
            return answer;
        },
        sendLoginException: function sendLoginException(text, sendAtack) {
            var self = this;
            var m = qxnw.userPolicies.getModeReAuth();
            qxnw.utils.information(text, function () {
                if (self.ui.usuario.getValue() != "" && self.ui.usuario.isFocusable() && self.ui.usuario.isEnabled() == true) {
                    self.ui.usuario.focus();
                } else {
                    if (m == true) {
                        var t = new qx.event.Timer(100);
                        t.start();
                        t.addListener("interval", function (e) {
                            this.stop();
                            self.ui.clave.focus();
                        });
                    } else {
                        self.ui.clave.focus();
                    }
                }
            });
            if (typeof sendAtack != 'undefined') {
                if (sendAtack) {
                    qxnw.utils.error(text, this, 0, 0, true);
                }
            }
        },
        getUserSettings: function getUserSettings() {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "master", true);
            //rpc.setLoginCall(true);
            var func = function (r) {
                var valores = JSON.parse(r.valores);
                for (var v in valores) {
                    qxnw.local.storeData(v, valores[v]);
                }
            };
            rpc.exec("getUserSettings", null, func);
        },
        consultUser: function consultUser() {
            var self = this;
//            qxnw.config.setShowTips(false);
            var data = self.getRecord();
            data["clave"] = qxnw.md5.MD5(data["clave"]);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_session", true);
            rpc.setLoginCall(true);
            var func = function (r) {
                if (r != false) {
                    if (typeof r.usuario == 'undefined') {
                        self.sendLoginException(self.tr("Usuario o clave incorrecta"), true);
                        return;
                    }
                    var empresas = self.getEmpresas(r);
                    if (typeof empresas != 'undefined' && empresas != false) {
                        self.ui.usuario.setEnabled(false);
                        self.ui.clave.setEnabled(false);
                        self.ui.empresa.setEnabled(true);
                        if (empresas.size == 1) {
                            if (self.setEmpresa(r)) {
                                var user = qxnw.userPolicies.getInstance();
                                r.perfil = self.__perfil;
                                r.nom_perfil = self.__perfilNom;
                                r.pais = self.__pais;
                                r.pais_nombre = self.__pais_nombre;
                                r.zona_horaria = self.__zona_horaria;
                                r.idioma = self.__idioma;
                                r.logo = self.__logo;
                                r.web = self.__web;
                                r.model = self.__params;

                                if (self.__perms !== 'undefined') {
                                    r.perms = self.__perms;
                                }

                                user.setData(r);

                                self.fireDataEvent("logged", true);

                                var ff = self.ui.empresa.getValue();
                                if (typeof ff.empresa_model != 'undefined') {
                                    if (typeof ff.empresa_model.change_at_init != 'undefined' && typeof ff.empresa_model.cambio_clave != 'undefined') {
                                        if (ff.empresa_model.change_at_init == 't' && ff.empresa_model.cambio_clave != "1") {
                                            var f = new qxnw.basics.forms.f_cambiar_clave(false);
                                            f.setModal(true);
                                            f.set({
                                                showClose: false,
                                                showMinimize: false,
                                                showMaximize: false
                                            });
                                            f.setTitle(self.tr("Debe cambiar su primera clave :: QXNW"));
                                            f.settings.accept = function () {
                                                self.accept();
                                            };
                                            f.ui.cancel.setVisibility("excluded");
                                            f.show();
                                            return;
                                        }
                                    }
                                }
//                                qxnw.config.setShowTips(true);
                                self.accept();
                            }
                        } else if (empresas.size > 1) {

                            self.ui.empresa.focus();
                            var listenerId = self.ui.accept.getUserData("listenerAccept");
                            self.ui.accept.removeListenerById(listenerId);
                            self.ui.accept.addListener("execute", function () {
                                if (self.setEmpresa(r)) {
                                    var user = qxnw.userPolicies.getInstance();
                                    r.perfil = self.__perfil;
                                    r.nom_perfil = self.__perfilNom;
                                    r.pais = self.__pais;
                                    r.pais_nombre = self.__pais_nombre;
                                    r.zona_horaria = self.__zona_horaria;
                                    r.idioma = self.__idioma;
                                    r.logo = self.__logo;
                                    r.web = self.__web;
                                    r.model = self.__params;

                                    if (self.__perms !== 'undefined') {
                                        r.perms = self.__perms;
                                    }

                                    user.setData(r);

                                    self.fireDataEvent("logged", true);

                                    var ff = self.ui.empresa.getValue();
                                    if (typeof ff.empresa_model != 'undefined') {
                                        if (typeof ff.empresa_model.change_at_init != 'undefined' && typeof ff.empresa_model.cambio_clave != 'undefined') {
                                            if (ff.empresa_model.change_at_init == 't' && ff.empresa_model.cambio_clave != "1") {
                                                var f = new qxnw.basics.forms.f_cambiar_clave(false);
                                                f.setModal(true);
                                                f.set({
                                                    showClose: false,
                                                    showMinimize: false,
                                                    showMaximize: false
                                                });
                                                f.setTitle(self.tr("Debe cambiar su primera clave :: QXNW"));
                                                f.settings.accept = function () {
                                                    self.accept();
                                                };
                                                f.ui.cancel.setVisibility("excluded");
                                                f.show();
                                                return;
                                            }
                                        }
                                    }
//                                    qxnw.config.setShowTips(true);
                                    qxnw.local.setData("nw_companies", null);
                                    self.accept();
                                }
                            });
                        }
                    } else {
                        qxnw.utils.information(self.tr("No tiene empresas asociadas"), function () {
                            if (self.ui.clave.isFocusable()) {
                                self.ui.clave.focus();
                            }
                        });
                    }
                    self.__ok = true;
                } else {
                    qxnw.animation.startEffect("shake", self);
                    self.sendLoginException(self.tr("Usuario o clave incorrecta"));
                }
            };
            rpc.exec("consulta", data, func);
            return true;
        }
    }
}
);
