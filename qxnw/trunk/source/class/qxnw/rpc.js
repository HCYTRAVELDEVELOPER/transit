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
/**
 * Manage all the RPC calls
 */
qx.Class.define("qxnw.rpc", {
    extend: qx.core.Object,
    /**
     * Event fired on complete the remote procedure
     */
    events: {
        complete: "qx.event.type.Data"
    },
    /**
     * Create the internal {@link qx.io.remote.Rpc} class and prepare the listeners
     * @param url {String} the URL for the call
     * @param method {String} the method (class) to call
     */
    construct: function (url, method, async) {
        var self = this;
        if (typeof async != 'undefined' && async != null && async != '' && typeof async == 'boolean') {
            this._setAsync = async;
        }
        if (typeof method != 'undefined' && method != "") {
            if (method == "session") {
                method = "nw_session";
            }
            self.rpc = new qx.io.remote.Rpc(url, method);
            self.setMethod(method);
            self.setUrl(url);
        } else {
            self.setUrl(url);
            self.rpc = new qx.io.remote.Rpc(url);
        }
        if (qx.core.Environment.get("qx.debug")) {
            if (qxnw.config.getShowRpcDebug() == true) {
                console.log("%c<<<<DEBUG: starting call RPC server>>>>", 'background: #33A51F; color: #2B0902');
                console.log("URL: ", url);
                console.log("Method: " + method);
                console.log("Async (true/false): " + async);
            }
        }
        var data = {};
        data["key"] = "bndjYWYyMzIz";
        data["debug"] = qx.core.Environment.get("qx.debug");
        var up = qxnw.userPolicies.getUserData();
        data["company"] = up.company;
        self.__serverData = data;
        self.rpc.setServerData(data);

        self.rpc.setProtocol(self.getProtocol());

        self.addListener("complete", function () {
            self.slotComplete();
        }, this);

        self.__call = null;
        self.__errorLocally = null;
        self.__tmpPopup = null;

        this.__failedListener = self.rpc.addListener("failed", function (e) {
            var error = e.getData();
            //this.handleError(error.toString());
            //this.cancelRequest();
        }, this);

        self.rpc.setTimeout(qxnw.config.getRpcTimeout());
        self.__countTimeout = 0;
    },
    properties: {
        protocol: {
            //qx1 or 2.0, for now qx1 but have to change that
            init: "qx1",
            check: "String"
        },
        loginCall: {
            init: false,
            check: "Boolean"
        },
        encode64: {
            init: false,
            check: "Boolean"
        },
        method: {
            init: null,
            check: "String"
        },
        url: {
            init: null,
            check: "String"
        },
        func: {
            init: null,
            check: "String"
        },
        loadingMessage: {
            init: "Trabajando...",
            check: "String"
        },
        handleError: {
            init: true,
            check: "Boolean"
        },
        showLoading: {
            init: true,
            check: "Boolean"
        },
        block: {
            init: true,
            check: "Boolean"
        }
    },
    statics: {
        asyncRpc: function asyncRpc(classPhp, method, data, callback) {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), classPhp);
            rpc.setAsync(true);
            if (typeof callback == 'undefined') {
                callback = 0;
            }
            rpc.exec(method, data, callback);
        },
        deleteRecordByTable: function deleteRecordByTable(table, id, callback) {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            if (typeof callback != 'undefined') {
                var func = 0;
            } else {
                var func = function () {
                    callback();
                };
            }
            rpc.exec("eliminar", {table: table, id: id}, func);
        }
    },
    members: {
        __callback: false,
        _isError: false,
        _error: null,
        rpc: null,
        data: null,
        _setAsync: false,
        _function: null,
        __countTimeout: null,
        __isTimerCreated: false,
        __serverData: null,
        __callerFirst: "",
        __call: null,
        __tmpPopup: null,
        setRequireDb: function setRequireDb(requireDbBool) {
            var self = this;
            var data = {};
            data["key"] = "bndjYWYyMzIz";
            data["debug"] = qx.core.Environment.get("qx.debug");
            data["requireDb"] = requireDbBool;
            self.__serverData = data;
            self.rpc.setServerData(data);
        },
        setCrossDomain: function setCrossDomain(bool) {
            if (typeof bool == 'undefined') {
                bool = true;
            }
            this.rpc.setCrossDomain(bool);
        },
        /*
         * Used to stop all connections on server
         * @returns {undefined}
         */
        cancelAll: function cancelAll() {
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master", true);
            rpc.setShowLoading(false);
            rpc.setHandleError(false);
            var func = function (rta) {
                console.log(rta);
            };
            rpc.exec("cancelAll", null, func);
        },
        setServerData: function setServerData(data) {
            var d = this.__serverData;
            for (var key in data) {
                d[key] = data[key];
            }
            this.rpc.setServerData(d);
        },
        setTimeOut: function setTimeOut(time) {
            this.rpc.setTimeout(time);
        },
        startCallerTimer: function startCallerTimer() {
            var self = this;
            self.setHandleError(false);
            self.setAsync(true);
            self.setShowLoading(false);
            self.rpc.setUrl(qxnw.userPolicies.getRpcUrl());
            var up = qxnw.userPolicies.getUserData();
            var func = function (r) {
                self.__timer.stop();
                self.__isTimerCreated = false;
                if (r) {
                    qxnw.config.setConnected(true);
                    self.__tmpPopup.stopAction();
                    qxnw.utils.information("Se ha normalizado la conexión. Servidor: " + r);
                    qxnw.utils.error(self.__errorLocally, self, 0, false, true, 0, self.__callerFirst);
                }
                return;
            };
            self.rpc.setServiceName("master");
            self.exec("testSignal", up, func);
            if (!self.__isTimerCreated) {
                self.__tmpPopup = qxnw.utils.createPopUp(self, "Intentando conectar...", qxnw.config.execIcon("appointment-new"), false, false, true);
                self.__timer = new qx.event.Timer(10000);
                self.__timer.start();
                self.__timer.setUserData("nw_rpc_test_counter", 1);
                self.__timer.addListener("interval", function (e) {
                    var counter = this.getUserData("nw_rpc_test_counter");
                    qxnw.config.counterOnPopupNotConnected(counter);
                    counter = counter + 1;
                    this.setUserData("nw_rpc_test_counter", counter);
                    self.startCallerTimer();
                });
                self.__isTimerCreated = true;
            }
        },
        plusTimeout: function plusTimeout() {
            qxnw.utils.question("¿Desea aumentar el tiempo máximo de espera?", function (e) {
                if (e) {
                    var fields = [
                        {
                            name: "timeout",
                            type: "textField",
                            label: "Tiempo máximo de espera (50 segundos por defecto) / Max wait time (50 segs by default)",
                            mode: "integer",
                            required: true
                        }
                    ];
                    var d = qxnw.utils.dialog(fields, "Aumente el tiempo máximo de espera / Add wait time", true);
                    d.settings.accept = function () {
                        var v = d.getRecord();
                        qxnw.local.storeData("config_rpc_timeout", v.timeout * 1000);
                    };
                    d.show();
                }
            });
        },
        handleServerErrors: function handleServerErrors(error) {
            var self = this;
            if (error.code != 102 && error.code != 103) {
                self.setError(error.message);
            }
            if (error.code == 1) {
                self.__countTimeout = self.__countTimeout + 1;
                if (self.__countTimeout == 3) {
                    self.plusTimeout();
                } else if (self.__countTimeout == 2) {
                    qxnw.utils.question("Pruebe aumentando el tiempo máximo de espera (Ayuda->Configuración de comportamientos) o inténtelo más tarde");
//                    qxnw.utils.question("Pruebe aumentando el tiempo máximo de espera (Ayuda->Configuración de comportamientos). ¿Desea intentarlo de nuevo?", function (e) {
//                        if (e) {
//                            self.setLoadingMessage("Reintentando...");
//                            self.exec(self.getFunc(), self.data, self.__callback);
//                        }
//                    });
                } else {
                    qxnw.utils.information("Su conexión a internet es deficiente. Comuníquese con el administrador o inténtelo más tarde");
                    try {
                        if (self.__call != null) {
                            self.rpc.abort(self.__call);
                        }
                    } catch (e) {

                    }
//                    qxnw.utils.question("Su conexión a internet es deficiente. Se agotó el tiempo de espera de respuesta del servidor en la llamada " + self.getMethod() + ":" + self.getFunc() + " . ¿Desea intentarlo de nuevo?", function (e) {
//                        if (e) {
//                            self.setLoadingMessage("Reintentando...");
//                            self.exec(self.getFunc(), self.data, self.__callback);
//                        }
//                    });
                }
            } else if (error.code == 0) {
                qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 2) {
                qxnw.utils.error(error, self, 0, false);
            } else if (error.code == 100) {
                var silent = false;
                if (self.getLoginCall()) {
                    silent = true;
                }
                qxnw.utils.error(error, self, 0, true, silent, 0, self.__callerFirst);
            } else if (error.code == 104) {
                self.__errorLocally = error;
                if (qxnw.config.isConnected() == true) {
//                    qxnw.utils.question("No se puede establecer la conexión con la base de datos. ¿Desea iniciar un contador de peticiones? Se le informará cuando se normalice el servicio.", function (e) {
//                        if (e) {
//                            self.startCallerTimer();
//                        }
//                    });
                    self.startCallerTimer();
                    qxnw.config.setConnected(false);
                }
            } else if (error.code == 101) {
                var errTxt = "";
                for (var v in error) {
                    if (v != "toString") {
                        error[v].toString().replace("file", "<b>File</b>");
                        error[v].toString().replace("line", "<b>File</b>");
                        errTxt += "<b>" + v + ":</b>   " + error[v] + "<br />";
                    }
                }
                qxnw.utils.information(errTxt);
            } else if (error.code == 102) {
                qxnw.utils.information(error.message);
            } else if (error.code == 103) {
                qxnw.utils.nwconsole(error, false, false);
            } else {
                qxnw.utils.error(error, self, 0, false, false, 0, self.__callerFirst);
            }
        },
        setHandleDeveloperDBErrors: function setHandleDeveloperDBErrors(callback_developer) {
            var self = this;
        },
        handleLocalErrors: function handleLocalErrors(error) {
            var self = this;
            if (qx.core.Environment.get("qx.debug")) {
                if (qxnw.config.getShowRpcDebug() == true) {
                    console.log(error);
                }
            }
            self.setError(error.message);
            if (error.code == 1) {
                self.__countTimeout = self.__countTimeout + 1;
                if (self.__countTimeout == 3) {
                    self.__errorLocally = error;
                    self.plusTimeout();
                } else if (self.__countTimeout == 2) {
                    qxnw.utils.question("Pruebe aumentando el tiempo máximo de espera (Ayuda->Configuración de comportamientos) o inténtelo más tarde");
                    try {
                        if (self.__call != null) {
                            self.rpc.abort(self.__call);
                        }

                    } catch (e) {

                    }
//                    qxnw.utils.question("Pruebe aumentando el tiempo máximo de espera (Ayuda->Configuración de comportamientos). ¿Desea intentarlo de nuevo?", function (e) {
//                        if (e) {
//                            self.setLoadingMessage("Reintentando...");
//                            self.exec(self.getFunc(), self.data, self.__callback);
//                        }
//                    });
                } else {
                    if (typeof error.message != 'undefined' && error.message.indexOf("time-out")) {
                        qxnw.utils.information("<b>Se agotó el tiempo de espera</b>. Pruebe aumentando el tiempo máximo (Menú izquierdo->Configuración->Configuración de comportamientos) o click aquí");
                        try {
                            if (self.__call != null) {
                                self.rpc.abort(self.__call);
                            }

                        } catch (e) {

                        }
                        return;
                    }

                    qxnw.utils.information("Su conexión a internet es deficiente. Comuníquese con el administrador o inténtelo más tarde");
                    try {
                        if (self.__call != null) {
                            self.rpc.abort(self.__call);
                        }

                    } catch (e) {

                    }
//                    qxnw.utils.question("Su conexión a internet es deficiente. Se agotó el tiempo de espera de respuesta local en la llamada " + self.getMethod() + ":" + self.getFunc() + " . ¿Desea intentarlo de nuevo?", function (e) {
//                        if (e) {
//                            self.setLoadingMessage("Reintentando...");
//                            self.exec(self.getFunc(), self.data, self.__callback);
//                        }
//                    });
                }
            } else if (error.code == 0) {
                qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 2) {
                //CONSULTA ABORTADA
                try {
                    var popup = qxnw.utils.createIdeaPopUp(self, "Consulta abortada::" + error.message, 1500);
                    popup.placeToPoint({
                        left: parseInt(Math.round((qx.bom.Viewport.getWidth() - 50))),
                        top: parseInt(Math.round((qx.bom.Viewport.getHeight() - 70)))
                    });
                } catch (e) {

                }
                //qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 100) {
                qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 101) {
                var errTxt = "";
                for (var v in error) {
                    if (v != "toString") {
                        error[v].toString().replace("file", "<b>File</b>");
                        error[v].toString().replace("line", "<b>File</b>");
                        errTxt += "<b>" + v + ":</b>   " + error[v] + "<br />";
                    }
                }
                qxnw.utils.information(errTxt);
            } else if (error.code == 102) {
                qxnw.utils.information(error.message);
            } else if (error.code == 103) {
                qxnw.utils.nw_console(error.message);
            } else {
                qxnw.utils.error(error, self, 0, true);
            }
        },
        handleUnknownOriginErrors: function handleUnknownOriginErrors(error) {
            var self = this;
            if (typeof error == 'undefined') {
                self.setError("");
                error = {};
                error.code = 0;
            } else if (typeof error.message != 'undefined') {
                self.setError(error.message);
            } else {
                self.setError(error);
            }
            if (error.code == 1) {
                self.__countTimeout = self.__countTimeout + 1;
                if (self.__countTimeout == 3) {
                    self.__errorLocally = error;
                    self.plusTimeout();
                } else if (self.__countTimeout == 2) {
                    qxnw.utils.question("Pruebe aumentando el tiempo máximo de espera (Ayuda->Configuración de comportamientos) o inténtelo más tarde");
//                    qxnw.utils.question("Pruebe aumentando el tiempo máximo de espera (Ayuda->Configuración de comportamientos). ¿Desea intentarlo de nuevo?", function (e) {
//                        if (e) {
//                            self.setLoadingMessage("Reintentando...");
//                            self.exec(self.getFunc(), self.data, self.__callback);
//                        }
//                    });
                } else {
                    qxnw.utils.information("Su conexión a internet es deficiente. Comuníquese con el administrador o inténtelo más tarde");
                    try {
                        if (self.__call != null) {
                            self.rpc.abort(self.__call);
                        }

                    } catch (e) {

                    }
//                    qxnw.utils.question("Su conexión a internet es deficiente. Se agotó el tiempo de espera de respuesta del servidor en la llamada " + self.getMethod() + ":" + self.getFunc() + " . ¿Desea intentarlo de nuevo?", function (e) {
//                        if (e) {
//                            self.setLoadingMessage("Reintentando...");
//                            self.exec(self.getFunc(), self.data, self.__callback);
//                        }
//                    });
                }
            } else if (error.code == 0) {
                qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 2) {
                qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 100) {
                qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 101) {
                var errTxt = "";
                for (var v in error) {
                    if (v != "toString") {
                        error[v].toString().replace("file", "<b>File</b>");
                        error[v].toString().replace("line", "<b>File</b>");
                        errTxt += "<b>" + v + ":</b>   " + error[v] + "<br />";
                    }
                }
                qxnw.utils.information(errTxt);
            } else if (error.code == 102) {
                qxnw.utils.information(error.message);
            } else if (error.code == 103) {
                qxnw.utils.nwconsole(error.message);
            } else {
                qxnw.utils.error(error, self, 0, true);
            }
        },
        prepareCounter: function prepareCounter(error) {
            var self = this;
            self.__countTimeout = self.__countTimeout + 1;
            if (self.__countTimeout == 3) {
                self.__errorLocally = error;
                qxnw.utils.question("Se ha preparado un reporte del problema con la conexión. ¿Desea iniciar un contador de peticiones? Se le informará cuando se normalice el servicio.", function (e) {
                    if (e) {
                        self.startCallerTimer();
                    }
                });
            } else if (self.__countTimeout == 2) {
                self.__errorLocally = error;
                qxnw.utils.information("Su conexión a internet es deficiente. Comuníquese con el administrador o inténtelo más tarde");
                try {
                    if (self.__call != null) {
                        self.rpc.abort(self.__call);
                    }

                } catch (e) {

                }
//                qxnw.utils.question("Su conexión a internet es deficiente. ¿Desea intentarlo de nuevo?", function (e) {
//                    if (e) {
//                        self.setLoadingMessage("Reintentando...");
//                        self.exec(self.getFunc(), self.data, self.__callback);
//                    }
//                });
            } else {
                self.__errorLocally = error;
                var up = qxnw.userPolicies.getUserData();
                if (qx.core.Environment.get("qx.debug")) {
                    if (qxnw.config.getShowRpcDebug() == true) {
                        console.log(error);
                    }
                }
//                qxnw.utils.information("Su conexión a internet es deficiente. Comuníquese con el administrador o inténtelo más tarde");
                try {
                    if (self.__call != null) {
                        self.rpc.abort(self.__call);
                    }

                } catch (e) {

                }
//                qxnw.userPolicies.setFrezzedByNoInternet(true);
//                qxnw.utils.question("Su conexión a internet es deficiente. ¿Desea intentarlo de nuevo?", function (e) {
//                    if (e) {
//                        self.setLoadingMessage("Reintentando...");
//                        self.exec(self.getFunc(), self.data, self.__callback);
//                    } else {
////                        qxnw.userPolicies.setFrezzedByNoInternet(false);
//                    }
//                });
            }
        },
        handleTransportErrors: function handleTransportErrors(error) {
            var self = this;
            self.setError(error.message);
            if (error.code == 1 || error.code == 0) {
                self.prepareCounter(error);
            } else if (error.code == 0) {
                qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 2) {
                qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 100) {
                qxnw.utils.error(error, self, 0, true);
            } else if (error.code == 101) {
                var errTxt = "";
                for (var v in error) {
                    if (v != "toString") {
                        try {
                            error[v].toString().replace("file", "<b>File</b>");
                            error[v].toString().replace("line", "<b>File</b>");
                        } catch (e) {

                        }
                        errTxt += "<b>" + v + ":</b>   " + error[v] + "<br />";
                    }
                }
                qxnw.utils.information(errTxt);
            } else if (error.code == 102) {
                // ES UN INFORMATION
                qxnw.utils.information(error.message);
            } else if (error.code == 103) {
                //CONSOLE
                qxnw.utils.nwconsole(error.message);
            } else if (error.code == 500) {
                //CONSOLE
                qxnw.utils.error(error, self, 0, true);
            } else {
                self.prepareCounter(error);
            }
        },
        handleErrors: function handleErrors(error) {
            var self = this;

            if (self.__call != null) {
                self.rpc.abort(self.__call);
            }

            if (self.getLoginCall()) {
                if (error.code != 102) {
                    qxnw.utils.error(error, self, 0, true, true, 0, self.__callerFirst);
                    return;
                }
            }

            try {
                if (error.message.indexOf("cross-domain") != -1) {
                    if (error.message.indexOf("request") != -1) {
                        if (error.message.indexOf("Possibly") != -1) {
                            qxnw.utils.information(self.tr("Su conexión de Internet es inestable"));
                            return;
                        }
                    }
                }
            } catch (e) {

            }

            if (typeof error == 'undefined' || typeof error.origin == 'undefined') {
                self.handleUnknownOriginErrors(error);
            } else {
                switch (error.origin) {
                    case 1:
                        self.handleServerErrors(error);
                        break;
                    case 2:
                        self.handleServerErrors(error);
                        break;
                    case 3:
                        self.handleTransportErrors(error);
                        break;
                    case 4:
                        self.handleLocalErrors(error);
                        break;
                }
            }
        },
        /**
         * Stops the loading (if any) 
         * @return {void}
         */
        slotComplete: function () {
            qxnw.utils.stopLoading();
        },
        /**
         * Set the function to call when the RPC call is complete
         * @param func {Function} the function on complete
         */
        setCompleteFunction: function (func) {
            this.__function = func;
        },
        __handleExecPages: function __handleExecPages(res) {
            if (typeof res == 'undefined') {
                return;
            }
            if (res == null || res == "") {
                return;
            }
            if (typeof res["currentPage"] == 'undefined') {
                return;
            }
            //TODO: PROBLEMA ENTRE LA COMUNICACIÓN DEL SENDER Y ESTA FUNCIÓN.
        },
        /**
         * Execute the call
         * @param func {String} the execute method
         * @param data {Array} an array containing all the data for pass to call
         * @param callback {Function} the function to be called when the call is ended
         * @return {Array} returns the response data of the call (if any).Otherwise returns null.
         */
        exec: function exec(func, data, callback) {
            var self = this;
//            console.log("RPC----");
//            console.log(func);
//            console.log(data);
//            console.log(self.getMethod());
            try {
                var funcCall = qx.lang.Function.getCaller(arguments);
                var funcCaller = qx.lang.Function.getName(funcCall);
                var sD = {};
                sD["class_caller"] = funcCaller;
                self.setServerData(sD);
                self.__callerFirst = funcCaller;
            } catch (e) {

            }
            if (typeof callback != 'undefined') {
                if (callback != null) {
                    if (callback != 0) {
                        self.setCompleteFunction(callback);
                        self.__callback = callback;
                    }
                }
            }
            self.setFunc(func);
            var loading = "";
            if (self.getShowLoading()) {
                var block = self.getBlock();
                if (typeof data != 'undefined') {
                    if (data != null) {
                        if (typeof data["token"] != 'undefined') {
                            block = false;
                        }
                    }
                }
                var loadingMessage = self.getLoadingMessage();
                loading = qxnw.utils.loading(loadingMessage, null, true, block);
            }

            self.data = data;
            //self.data["request"] = qx.util.Serializer.toJson(data);
            //self.data["key"] = "andresf";
            self.data = qx.util.Serializer.toJson(self.data);
            //if (self.getEncode64()) {
            //}
            var r = null;
            if (qx.core.Environment.get("qx.debug")) {
                if (qxnw.config.getShowRpcDebug() == true) {
                    console.log("Function: ", func);
                    console.log("Data: ", data);
                    console.log("%c<<<</DEBUG>>>>", 'background: #33A51F; color: #2B0902');
                }
            }
            if (self._setAsync) {
                var handler = function (result, exc) {

                    qxnw.utils.stopLoading(false);
                    if (qx.core.Environment.get("qx.debug")) {
                        if (qxnw.config.getShowRpcDebug() == true) {
                            console.log("%c<<<<DEBUG RPC ASYNC RESPONSE>>>>", 'background: #6DCD5C;');
                            console.log("URL: ", self.getUrl());
                            console.log("Method: ", self.getMethod());
                            console.log("Async (true/false): ", self._setAsync);
                            console.log("Function: ", func);
                            console.log("Data: ", data);
                            console.log("Result: ", result);
                            console.log("Error: ", exc);
                            console.log("%c<<<</DEBUG>>>>", 'background: #6DCD5C;');
                        }
                    }
                    if (exc === null) {
                        if (self.__function == null) {
                            return;
                        }
                        qxnw.config.setConnected(true, false);
                        try {
                            self.__function(result, exc);
                        } catch (e) {
                            if (self.getHandleError()) {
                                try {
                                    e.other = "::CALL: " + self.getFunc() + "::METHOD: " + self.getMethod();
                                } catch (eb) {

                                }
                                qxnw.utils.bindError(e, self);
                            }
                        }
                    } else {
                        if (self.getHandleError()) {
                            try {
                                exc.other = "::CALL: " + self.getFunc() + "::METHOD: " + self.getMethod();
                            } catch (e) {

                            }
                            self.handleErrors(exc);
                        } else {
                            return;
                        }
                    }
                };
                self.__call = null;
                try {
                    if (self.data != "") {
                        self.__call = self.rpc.callAsync(handler, func, self.data);
                    } else {
                        self.__call = self.rpc.callAsync(handler, func);
                    }
                    if (!self.getLoginCall()) {
                        if (typeof loading == "object") {

                            loading.setRpc(self.rpc);
                            loading.setCall(self.__call);
                            loading.createCancelButton();

                            loading.addListener("executeCancel", function () {
                                if (typeof self.rpc != 'undefined') {
                                    if (self.rpc != null) {
                                        self.rpc.abort(self.__call);
                                    }
                                }
                                self.cancelAll();
                            });
                            return;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    if (self.data != "") {
                        r = self.rpc.callSync(func, self.data);
                    } else {
                        r = self.rpc.callSync(func);
                    }
                    if (qx.core.Environment.get("qx.debug")) {
                        if (qxnw.config.getShowRpcDebug() == true) {
                            console.log("%c<<<<DEBUG RPC SYNC RESPONSE>>>>", 'background: #6DCD5C;');
                            console.log("URL: ", self.getUrl());
                            console.log("Method: ", self.getMethod());
                            console.log("Async (true/false): ", self._setAsync);
                            console.log("Function: ", func);
                            console.log("Result: ", r);
                            console.log("%c<<<</DEBUG>>>>", 'background: #6DCD5C;');
                        }
                    }
                    qxnw.utils.stopLoading();
                    self.fireDataEvent("complete", r);
                    qxnw.config.setConnected(true);
                } catch (exc) {
                    try {
                        exc.rpcdetails.other = "::CALL: " + self.getFunc() + "::METHOD: " + self.getMethod();
                    } catch (e) {

                    }
                    if (self.getHandleError()) {
                        self.handleErrors(exc.rpcdetails);
                    }
                    //self.setError(exc);
                    qxnw.utils.stopLoading();
                    self.fireDataEvent("complete", false);
                }
            }
            if (self.getEncode64()) {
                if (r != null) {
                    r = qx.util.Base64.decode(r);
                }
            }
//            if (typeof r != 'undefined') {
//                if (r != null) {
//                    if (typeof r.result != 'undefined') {
//                        r.result = qx.util.Base64.decode(r.result);
//                        r.result = qx.util.Serializer.toJson(r.result);
//                    }
//                }
//            }
            //self.__handleExecPages(r);
            return r;
        },
        /**
         * Set async or sync this class
         * @param bool {Boolean} True or false 
         */
        setAsync: function (bool) {
            this._setAsync = bool;
        },
        /**
         * Returns the error (if any)
         * @return {Object} the object error
         */
        getError: function getError() {
            return this._error;
        },
        /**
         * Set the error on the procedure call
         * @param error {Object} the object error
         * @return {void}
         */
        setError: function setError(error) {
            this._isError = true;
            this._error = error;
        },
        /**
         * Return if the remote call is ok or have an error
         * @return {Boolean} if the call is sucessfull of not
         */
        isError: function isError() {
            return this._isError;
        }
    }
});