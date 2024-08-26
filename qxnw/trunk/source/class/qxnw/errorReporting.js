
/* ************************************************************************
 
 Copyright:Netwoods.net
 
 License:Private
 
 Authors:Andrés Flórez
 
 ************************************************************************ */
/**
 * Error report manager. Try to comunicate to host data center, and report the problem. 
 */
qx.Class.define("qxnw.errorReporting", {
    extend: qx.core.Object,
    include: [qx.locale.MTranslation],
    construct: function construct() {
    },
    members: {
        __errorCount: 0,
        __errorText: null,
        __preparedReport: false,
        __data: {},
        prepareReport: function prepareReport(error, sender, object, realError, errorPath) {
            var self = this;
            self.__errorText = error;
            self.__preparedReport = true;
            var data = self.__data;
            var up = qxnw.userPolicies.getUserData();
            data["error_text"] = self.__errorText.replace(/'/g, "$");
            data["error_text"] = data["error_text"].replace(/#/g, " ");
            data["error_text"] = data["error_text"].replace(/:/g, "___");
            data["error_text"] = data["error_text"].replace(/\?/g, " ");
            data["error_text"] = data["error_text"].replace(/,/g, "+");
            data["error_text"] = data["error_text"].replace(/!/g, " ");
            //data["error_text"] = data["error_text"].replace(/\*/g, " ");
            data["error_text"] = data["error_text"].replace(/\"/g, " ");
            data["error_text"] = data["error_text"].replace(/"/g, " ");
            data["error_text"] = String(data["error_text"]);
            data["errorPath"] = String(errorPath);
            data["browser_name"] = qx.core.Environment.get("browser.name");
            data["browser_version"] = qx.core.Environment.get("browser.version");
            data["device_name"] = qx.core.Environment.get("device.name");
            data["engine_name"] = qx.core.Environment.get("engine.name");
            data["engine_version"] = qx.core.Environment.get("engine.version");
            data["os_name"] = qx.core.Environment.get("os.name");
            data["os_version"] = qx.core.Environment.get("os.version");
            data["qx_version"] = qx.core.Environment.get("qx.version");
            data["program_name"] = qx.core.Init.getApplication().classname;
            data["empresa"] = up["name_company"];
            data["profile"] = up["nom_profile"];
            data["usuario"] = up["user"];
            data["email"] = up["email"];
            data["user_name"] = up["name"];
            data["db"] = up["db"];
            data["terminal"] = up["terminal"];
            data["dominio"] = location.href;
            data["theme"] = qx.core.Environment.get("qx.theme");
            data["qxnw_version"] = qxnw.userPolicies.getVersion();
            var origin;
            if (typeof realError == 'undefined' || typeof realError.origin == 'undefined') {
                origin = 0;
            }
            data["origin"] = origin;
            data["code"] = typeof realError == 'undefined' ? 0 : typeof realError.code == 'undefined' ? 0 : realError.code;

            if (typeof object != 'undefined') {
                if (object != 0) {
                    try {
                        data["callTrace"] = sender.trace();
                        data["object"] = qx.dev.Debug().debugObjectToString(object);
                        data["sender"] = qx.dev.Debug().debugObjectToString(sender);
                        data["class"] = sender.classname;
                    } catch (e) {
                        qxnw.utils.nwconsole(e);
                    }
                }
            }
            return data;
        },
        sendReport: function sendReport(error, comments, showResponse, silent) {
            var self = this;
            if (typeof showResponse == 'undefined') {
                showResponse = true;
            }
            if (typeof silent == 'undefined') {
                silent = false;
            }
            var data = error;
            if (typeof comments != 'undefined') {
                if (comments != 0) {
                    data["comments"] = comments.text;
                } else {
                    data["comments"] = "Sin comentarios.";
                }
            } else {
                data["comments"] = "Sin comentarios.";
            }
            if (!self.__preparedReport) {
                return;
            }
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl() == null ? "/rpcsrv/server.php" : qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            rpc.setHandleError(false);
            var func = function (r) {
                if (showResponse) {
                    if (qxnw.config.getShowErrorResponse()) {
                        if (!silent) {
                            var t = "<br />";
                            t += r;
                            t += "<br /><br /><a href='javascript: main.openSupport();'>Si desea asistencia personalizada click <b>aquí</b></a>";
                            self.createInformationForm(t, error);
                        }
                    }
                }
            };
            rpc.exec("sendReport", data, func);
        },
        createInformationForm: function createInformationForm(response, error) {
            var self = this;
            var f = new qxnw.forms();
            f.set({
                contentPadding: 10
            });
            f.setModal(true);
            f.setMinWidth(400);
            f.setMinHeight(350);

            if (typeof error["error_text"] != 'undefined') {
                if (typeof error["error_text"] == 'string') {
                    var err = self.tryNormalizeError(error["error_text"].substring(0, 250), f);
                    if (err != false) {
                        response += "<hr>";
                        response += "<br />";
                        response += "<b>Se ha encontrado una breve explicación del problema:</b>";
                        response += "<br />";
                        response += "<br />";
                        response += "<b><font size='3'>" + err + "</font></b>";
                    }
                }
            }

            f.setTitle(f.tr("Respuesta del servidor:"));
            f.addHtml(response, 1);
            f.show();
        },
        tryNormalizeError: function tryNormalizeError(error, parent) {
            var wordsList = [
                {
                    en: "Only secure origins are allowed",
                    es: parent.tr("Para esta función sólo se admiten conexiones por HTTPS (puerto 443)")
                },
                {
                    en: "is not a function",
                    es: parent.tr("Una función no está compilada correctamente")
                },
                {
                    en: "Unknown status code. Possibly due to a cross-domain request",
                    es: parent.tr("Se ha presentado un error en la conexión. Al parecer es demasiado lenta")
                },
                {
                    en: "duplicate key value violates unique constraint",
                    es: parent.tr("Hay una llave duplicada que viola la consistencia del registro. Uno de los campos que está ingresando debe ser único")
                },
                {
                    en: "is ambiguous",
                    es: parent.tr("Hay una columna que es ambigua")
                },
                {
                    en: "permission denied for relation",
                    es: parent.tr("No tiene permisos para la tabla")
                },
                {
                    en: "syntax error at or near",
                    es: parent.tr("Hay un problema de sintaxis al consultar, actualizar o insertar un registro. Verifique que esté ingresando los valores numéricos/fechas/horas correctamente o que no tenga campos vacíos.")
                },
                {
                    en: "Could not close zip file",
                    es: parent.tr("No posee los permisos suficientes en una carpeta del servidor.")
                },
                {
                    en: "Aborted consulta",
                    es: parent.tr("Se ha presentado un error en la conexión y se ha abortado desde el servidor. Al parecer es demasiado lenta. Inténtelo de nuevo.")
                },
                {
                    en: "Aborted",
                    es: parent.tr("Se ha presentado un error en la conexión y se ha abortado desde el servidor. Al parecer es demasiado lenta. Inténtelo de nuevo.")
                },
                {
                    en: "You have an error in your SQL syntax",
                    es: parent.tr("Se ha presentado un error al realizar la consulta en su sintaxis. Pruebe verificando los filtros de búsqueda. Al parecer su conexión es demasiado lenta. Por favor inténtelo de nuevo.")
                },
                {
                    en: "date/time field value out of range",
                    es: parent.tr("Está intentando ingresar un valor tipo FECHA con un dato inválido. Por favor revise los campos de fecha y vuelva a intentarlo.")
                },
                {
                    en: "invalid input syntax for integer",
                    es: parent.tr("Está intentando ingresar un valor tipo NÚMERO con un dato inválido. Por favor revise los campos numéricos y vuelva a intentarlo.")
                },
                {
                    en: "invalid input syntax for type double precision",
                    es: parent.tr("Está intentando ingresar un valor tipo moneda con decimales con un dato inválido. Por favor revise los campos numéricos y vuelva a intentarlo.")
                },
                {
                    en: "value too long for type character varying",
                    es: parent.tr("Está intentando ingresar un valor más largo de lo permitido en la base de datos. Por favor revise los campos y vuelva a intentarlo.")
                }
            ];
            for (var i = 0; i < wordsList.length; i++) {
                if (error.indexOf(wordsList[i].en) != -1) {
                    return wordsList[i].es;
                }
            }
            return false;
        },
        handleErrorByType: function handleErrorByType(error) {
            var self = this;
            try {
                if (error.message.indexOf("Unknown status code. Possibly due to a cross-domain request") != 1) {
                    qxnw.utils.information(self.tr("Su conexión a internet es deficiente. Por favor contacte a su proveedor de servicios"));
                    return false;
                }
                if (error.message.indexOf("Local expired time out") != 1) {
                    qxnw.utils.information(self.tr("El tiempo máximo permitido de consulta a expirado. Puede aumentarlo por Configuración->Configuración de comportamientos"));
                    return false;
                }
                if (error.message.indexOf("Debe ingresar correctamente refrescando el navegador") != 1) {
                    qxnw.utils.information(self.tr("Debe ingresar correctamente al programa para ver esta impresión. Intente refrescando el navegador"));
                    return false;
                }
            } catch (e) {
                return true;
            }
            return true;
        },
        processError: function processError(error, sender, object, mandatory, silent, realError, show) {
            var self = this;
            try {
                if (error != null && error.trim() == "Sesión Inválida") {
                    qxnw.utils.out();
                    return;
                }
            } catch (e) {

            }
            if (!self.handleErrorByType(error)) {
                return;
            }
            if (typeof mandatory == 'undefined') {
                mandatory = false;
            }
            if (typeof show == 'undefined') {
                show = true;
            }
            var func = function (r) {
                var errorPath;
                if (r != null) {
                    var oReq = new XMLHttpRequest();
                    oReq.open("POST", "/nwlib" + qxnw.userPolicies.getNwlibVersion() + "/receiveError.php", false);
                    oReq.send(r);
                    if (oReq.status === 200) {
                        errorPath = oReq.responseText;
                    }
                }
                var data = self.prepareReport(error, sender, object, realError, errorPath);
                self.up = qxnw.userPolicies.getUserData();
                var d = new qxnw.errorreporting.form();
                if (errorPath != null) {
                    d.setImageError(errorPath);
                }
                if (qx.core.Environment.get("browser.name") != "ie") {
                    try {
                        console.log(data);
                    } catch (e) {

                    }
                }
                d.setError(data);
                d.settings.accept = function () {
                    var msg = d.getData();
                    self.sendReport(data, msg, true);
                };
                d.show();
            };
            try {
                var index = qxnw.userPolicies.getDevelopers().indexOf(self.up.user);
                if (qx.core.Environment.get("qx.debug") || index != -1) {
                    func(null);
                } else {
                    qxnw.utils.screenShot(false, func);
                }
            } catch (e) {
                var data = self.prepareReport(error, sender, object, realError, "");
                self.up = qxnw.userPolicies.getUserData();
                var d = new qxnw.errorreporting.form();
                d.setError(data);
                if (qx.core.Environment.get("browser.name") != "ie") {
                    try {
                        console.log(data);
                    } catch (e) {

                    }
                }
                d.settings.accept = function () {
                    var msg = d.getData();
                    self.sendReport(data, msg);
                };
                d.show();
            }
        }
    }
});