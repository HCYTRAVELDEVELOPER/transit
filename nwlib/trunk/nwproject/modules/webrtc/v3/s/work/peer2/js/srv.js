var srv = {
    nombre_cliente: false,
    celular_cliente: false,
    correo_cliente: false,
    tipo_documento_cliente: false,
    documento_cliente: false,
    lastUserSendMessage: null,
    lastOtherUserSendMessage: null,
    lastMessageIsBy: "bot",
    bot_ha_saludado: false,
    bot_ha_indicado_pedir_datos: false,
    bot_ha_pedido_nombre: false,
    bot_ha_pedido_celular: false,
    bot_ha_pedido_correo: false,
    bot_ha_pedido_identificacion: false,
    bot_ha_pedido_tipo_identificacion: false,
    bot_message: "",
    bot: false,
    debug: true,
    status_call: "VISITANDO",
    totalMessages: 0,
    limitLoadMessages: 20,
    domainVisitor: null,
    urlVisitor: null,
    tipoChat: "chat",
    isOperatorRingow: "true",
    useForRingow: "true",
    id_session_call: false,
    domain: window.location.protocol + "//" + window.location.host,
    tokens: [],
    timeToSaveRecordVideo: 60000,
    focusIn: false,
    inWindow: true,
    config: {},
    initialize: function () {
        var self = this;
        var get = self.get();
        window.addEventListener('focus', function () {
//            console.log("focus");
            self.inWindow = true;
        });
        window.addEventListener('blur', function () {
//            console.log("blur");
            self.inWindow = false;
        });

        document.addEventListener('visibilitychange', function (e) {
//            console.log("visibilitychange");
//            console.log(document.hidden);
        });

        if (typeof get.domain !== "undefined") {
            self.domain = get.domain;
        }

        if (typeof rtcNw === "undefined") {
            setTimeout(function () {
                self.initialize();
            }, 100);
        } else {
            if (get.useBot === "true") {
                rtcNw.startPeerToPeer = false;
            }

            if (typeof rtcNw.loadInitialize === "undefined") {
                setTimeout(function () {
                    self.initialize();
                }, 100);
            } else {
                self.start();
            }
        }
    },
    start: function () {
        var self = this;
        self.room = rtcNw.room;
        self.myID = rtcNw.myselfId_get_clean;
        self.myID_no_clean = rtcNw.myselfId_get_no_clean;
        self.otherID = rtcNw.partnerId_get_clean;
        self.otherID_no_clean = rtcNw.partnerId_get_no_clean;
        self.lastMsg = null;
        self.terminal = null;
        self.id_call = null;
        self.setTerminalKey();

        if (self.evalueData(window.localStorage.getItem(self.room + "_nombre_cliente"))) {
            self.nombre_cliente = window.localStorage.getItem(self.room + "_nombre_cliente");
            self.bot_ha_pedido_nombre = true;
            self.bot_ha_saludado = true;
            self.bot_ha_indicado_pedir_datos = true;
        }
        if (self.evalueData(window.localStorage.getItem(self.room + "_celular_cliente"))) {
            self.celular_cliente = window.localStorage.getItem(self.room + "_celular_cliente");
            self.bot_ha_pedido_celular = true;
            self.bot_ha_saludado = true;
            self.bot_ha_indicado_pedir_datos = true;
        }
        if (self.evalueData(window.localStorage.getItem(self.room + "_correo_cliente"))) {
            self.correo_cliente = window.localStorage.getItem(self.room + "_correo_cliente");
            self.bot_ha_pedido_correo = true;
            self.bot_ha_saludado = true;
            self.bot_ha_indicado_pedir_datos = true;
        }
        if (self.evalueData(window.localStorage.getItem(self.room + "_documento_cliente"))) {
            self.documento_cliente = window.localStorage.getItem(self.room + "_documento_cliente");
            self.bot_ha_pedido_identificacion = true;
            self.bot_ha_saludado = true;
            self.bot_ha_indicado_pedir_datos = true;
        }

        self.loadAllMessagesServer();

        if (rtcNw.isAssesor === true) {
            if (typeof rtcNw.recordButton !== "undefined") {
                rtcNw.recordButton.onclick = function () {
                    return false;
                };
            }
            rtcNw.intervalRecorder = function () {
                self.intervalRecorder();
            };
        }

    },
    loadAllMessagesServer: function () {
        var self = this;
        var get = self.get();
        rtcNw.animateMsgShow = false;
        self.saveOrUpdate(function (r) {
            self.removeLoading();
//            if (self.debug)
            console.log(r);
            self.id_call = r.dataEnc.id;
            self.status_call = r.dataEnc.estado;
            self.config = r.config;
            if (self.debug)
                console.log("self.id_call", self.id_call);

            if (typeof r.msg !== "undefined") {
                var msgs = r.msg;
                self.onlyAddMsgCanvas(msgs);
            }

            if (get.useBot === "true") {
                self.removeLoading();
                self.botActivar();
            }

            self.setFocus();

            self.readMsgCall("recibido");

            //otros botones cuando cuelga si es ringow
            self.othersButtons = document.createElement("div");
            self.othersButtons.style = "position: absolute;bottom: 0;width: 100%;padding: 10px;display: none;flex-shrink: 0;background-color: #ffffff;z-index: 1;";
            rtcNw.contentChat.appendChild(self.othersButtons);

            self.btnCallAgain = document.createElement("button");
            self.btnCallAgain.innerHTML = "Volver a llamar";
            self.btnCallAgain.style = "border: 1px solid #ccc;margin: auto;padding: 15px;";
            self.btnCallAgain.onclick = function () {

                self.botOff();
                self.numberCallingRingow = 0;
                clearInterval(self.IntervalisCallingRingow);

                rtcNw.form.style.visibility = "visible";
                self.othersButtons.style.display = "none";
                self.changeStatusCall("LLAMANDO", "chat");
                var msg = "Espere un momento por favor";
                rtcNw.addMessage({text: msg, type: "other", name: self.myID_no_clean});
//                self.createWritten(self.heName, 3000);
            };
            self.othersButtons.appendChild(self.btnCallAgain);

            self.btnCloseAgain = document.createElement("button");
            self.btnCloseAgain.innerHTML = "Cerrar";
            self.btnCloseAgain.style = "border: 1px solid #ccc;margin: auto;padding: 15px;";
            self.btnCloseAgain.onclick = function () {
                rtcNw.hiddenChat();
            };
            self.othersButtons.appendChild(self.btnCloseAgain);

            self.btnCalificarAgain = document.createElement("button");
            self.btnCalificarAgain.innerHTML = "Calificar";
            self.btnCalificarAgain.style = "border: 1px solid #ccc;margin: auto;padding: 15px;";
            self.btnCalificarAgain.onclick = function () {
                rtcNw.hiddenChat();
            };
            self.othersButtons.appendChild(self.btnCalificarAgain);
            //FIN otros botones cuando cuelga si es ringow

            rtcNw.onSendMessage = function (elemen) {
                if (rtcNw.enLinea === true) {
                    self.botOff();
                }
                var user = elemen.querySelector(".message__name").innerHTML;
                var msg = elemen.querySelector(".message__bubble").innerHTML;
                if (user === self.myID) {
                    var type = elemen.querySelector(".message__type").innerHTML;
                    var date = elemen.querySelector(".message__fecha").getAttribute("data-date");
                    self.lastMsg = msg;
                    self.lastUserSendMessage = self.myID_no_clean;
                    self.lastOtherUserSendMessage = self.otherID_no_clean;
                    self.saveMsgSrv();

                    self.lastMessageIsBy = "self";

                    self.botValidateResponse();

                } else
                if (self.evalueData(user) && !self.focusIn && !self.inWindow) {
                    var theBody = msg;
                    var theIcon = "";
                    var theTitle = user + " escribe:";
                    var callback = false;
                    self.notificationPushNwrtc(theBody, theIcon, theTitle, callback);
                    self.readMsgCall("recibido");
                } else
                if (self.focusIn) {
                    self.readMsgCall("leido");
                }
                if (msg.indexOf("llamada_finalizada") !== -1 && user !== self.myID || msg.indexOf("end_call") !== -1 && user !== self.myID) {
                    self.othersButtons.style.display = "flex";
                    rtcNw.form.style.visibility = "hidden";
                    self.resetDataLocal();
                }
            };

            if (self.status_call === "FINALIZADO_POR_OPERADOR") {
                self.othersButtons.style.display = "flex";
                rtcNw.form.style.visibility = "hidden";
//                self.bot_ha_saludado = false;
//                self.resetDataLocal();
            }

//            setTimeout(function () {
//                rtcNw.addMessage({text: "Prueba", type: "me", name: self.myID_no_clean});
//                rtcNw.sendMessagePeer({message: "Prueba"});
//            }, 5000);

        });
    },
    onlyAddMsgCanvas: function (msgs) {
        var self = this;
        for (var i = 0; i < msgs.length; i++) {
            var msg = msgs[i];
            var type = "me";
            if (msg.usuario !== self.myID_no_clean) {
                type = "other";
            }
            rtcNw.addMessage({text: msg.texto, type: type, name: msg.usuario, date: msg.fecha, recibido: msg.recibido, visto: msg.leido});
        }
        setTimeout(function () {
            utils.scrollBottomMessages();
        }, 100);
    },
    resetDataLocal: function () {
        var self = this;
        window.localStorage.removeItem(self.room + "_nombre_cliente");
        window.localStorage.removeItem(self.room + "_celular_cliente");
        window.localStorage.removeItem(self.room + "_correo_cliente");
        window.localStorage.removeItem(self.room + "_documento_cliente");
        self.bot_ha_pedido_nombre = false;
        self.bot_ha_pedido_celular = false;
        self.bot_ha_pedido_correo = false;
        self.bot_ha_pedido_identificacion = false;
        self.bot_ha_saludado = false;
        self.bot_ha_indicado_pedir_datos = true;
    },
    setTerminalKey: function () {
        var self = this;
        var rau = self.room.split("ringow_");
        if (rau.length > 1) {
            var ra = rau[1].split("_");
            self.id_call = ra[0];
            self.terminal = ra[1];
            self.apikey = ra[2];

            if (rtcNw.isAssesor === false) {
                self.isOperatorRingow = "false";
                self.useForRingow = "false";
            }

        }
        var rau = self.room.split("userchat_");
        if (rau.length > 1) {
            var ra = rau[1].split("_");
            self.terminal = ra[1];
            self.tipoChat = "CHAT_INTERNO";

            self.isOperatorRingow = "false";
            self.useForRingow = "false";

        }
    },
    saveMsgSrv: function () {
        var self = this;
        var textoSave = utils.renderHTML(self.lastMsg, true);
        var data = "room=" + self.room;
        data += "&texto=" + textoSave;
        data += "&myUser=" + self.lastUserSendMessage;
        data += "&myName=" + self.lastUserSendMessage;
        data += "&myPhoto=" + self.lastUserSendMessage;
        data += "&isOperatorRingow=" + self.isOperatorRingow;
        data += "&useForRingow=" + self.useForRingow;
        data += "&heUser=" + self.lastOtherUserSendMessage;
        data += "&visto=NO";
        if (self.terminal !== null) {
            data += "&terminal=" + self.terminal;
        }
        if (self.id_call !== null) {
            data += "&visitante=" + self.id_call;
        }
//        if (rtcNw.isAssesor === false) {
        if (rtcNw.useInterNw === true) {
            data += "&createNotification=SI";
        }
        function reqListener() {
            var data = JSON.parse(this.responseText);
            if (self.debug)
                console.log("saveMsgSrv", data);
            if (data === "true") {
                rtcNw.sendMessagePeer({message: "messagesendReceivedMessages"});
//                self.readMsgCall("recibido");
            }
            if (typeof self.tokens !== "undefined") {
                if (self.tokens.length > 0) {
                    for (var i = 0; i < self.tokens.length; i++) {
                        var ra = self.tokens[i];
                        self.sendNotificacion({
                            title: self.myID_no_clean,
                            body: self.lastMsg,
                            icon: "fcm_push_icon",
                            sound: "default",
                            data: "main.openChatPush('" + self.myID_no_clean + "', '" + self.myID_no_clean + "', '" + self.lastMsg + "', '" + self.myID_no_clean + "', '" + self.id_call + "')",
                            callback: "FCM_PLUGIN_ACTIVITY",
                            to: ra.json
                        }, function (r) {
                            if (self.debug)
                                console.log("Notify send OK to " + ra.json + "! " + r);
                        });

                    }
                }
            }
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
            alert('Fetch Error :-S: ' + err);
//            return callback('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v3/s/work/peer2/srv/saveMsgSrv.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    saveOrUpdate: function (callback) {
        var self = this;
        var id = self.room;
        if (self.evalueData(window.localStorage.getItem("conversation_room_" + id))) {
            var ras = window.localStorage.getItem("conversation_room_" + id);
            var dat = JSON.parse(ras);
            if (typeof dat === "object") {
                if (typeof dat.msg !== "undefined") {
                    var msgs = dat.msg;
                    self.onlyAddMsgCanvas(msgs);
//                self.saveOrUpdateContinue(dat, callback);
                }
            }
        }

        var data = "room=" + self.room;
        if (self.id_call !== null) {
            data += "&id=" + self.id_call;
        }
        if (self.terminal !== null) {
            data += "&terminal=" + self.terminal;
        }
        data += "&limit=" + self.limitLoadMessages;
        data += "&myUser=" + self.myID_no_clean;
        data += "&myName=" + self.myID_no_clean;
        data += "&heUser=" + self.otherID_no_clean;
        data += "&domain=" + self.domainVisitor;
        data += "&origin=" + self.urlVisitor;
        data += "&tipo=" + self.tipoChat;
        data += "&isOperatorRingow=" + self.isOperatorRingow;
        if (self.id_session_call !== false) {
            data += "&id_session=" + self.id_session_call;
        }
        function reqListener() {
            var data = JSON.parse(this.responseText);
            if (self.debug)
                console.log("saveOrUpdate", data);
            self.saveOrUpdateContinue(data, callback);
            rtcNw.animateMsgShow = true;
            window.localStorage.setItem("conversation_room_" + id, JSON.stringify(data));
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
            return callback(false);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v3/s/work/peer2/srv/saveOrUpdate.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    saveOrUpdateContinue: function (data, callback) {
        var self = this;
        var messages = document.querySelectorAll(".message");
        for (var i = 0; i < messages.length; i++) {
            messages[i].remove();
        }
        var visit = data.dataEnc;
        if (visit.estado === "EN LINEA" || visit.estado === "LLAMANDO") {
            self.bot = false;
        }
        var msg = data.msg;
        var m = {};
        m.tipo = "startCallRingow";
        window.parent.postMessage(m, '*');
//            self.tokens = [];
        if (self.debug)
            console.log("self.tokens", self.tokens);
        if (typeof data.tokens !== "undefined") {
            if (self.tokens.length <= 0) {
                self.tokens = data.tokens;
            }
        }
        if (typeof msg !== "undefined" && msg !== null && msg !== false && msg !== "") {
            msg.sort(function (a, b) {
                return +(a.fecha > b.fecha) || +(a.fecha === b.fecha) - 1;
            });
        }
        data.msg = msg;
        return callback(data);
    },
    changeStatusCall: function (status, type, callback) {
        var self = this;
        var data = "room=" + self.room;
        if (self.nombre_cliente !== false) {
            data += "&nombre=" + self.nombre_cliente;
        }
        if (self.celular_cliente !== false) {
            data += "&celular=" + self.celular_cliente;
        }
        if (self.correo_cliente !== false) {
            data += "&correo=" + self.correo_cliente;
        }
        data += "&estado=" + status;
        data += "&tipo=" + type;
        data += "&isOperatorRingow=" + self.isOperatorRingow;
        if (self.terminal !== null) {
            data += "&terminal=" + self.terminal;
        }
        if (self.id_call !== null) {
            data += "&id=" + self.id_call;
        } else {
            alert("No existe el ID de encabezado");
            return false;
        }
        function reqListener() {
            var data = JSON.parse(this.responseText);
            if (self.debug) {
                console.log("changeStatusCall this.responseText", this.responseTexta);
                console.log("changeStatusCall", data);
            }
            var disponibles = false;
            if (data === "true" || data === "OK") {
                disponibles = true;
            }
            if (!disponibles) {
                var msg = self.config.offline_mensaje;
                rtcNw.addMessage({text: msg, type: "me", name: self.myID_no_clean});
                if (data.type === "ASESORES_NO_DISPONIBLES") {
                    self.sendEmailCallEnded();
                    self.bot = false;
                }
            } else {
                if (status === "LLAMANDO") {
                    var msg = "Llamada iniciada, será atendida por uno de nuestros asesores en un momento.";
                    rtcNw.addMessage({text: msg, type: "other", name: self.myID_no_clean});
                    self.artiveSearchCallEnded();
                }
            }
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v3/s/work/peer2/srv/changeStatusCall.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    artiveSearchCallEnded: function () {
        var self = this;
        self.IntervalisCallingRingow = setInterval(function () {
            self.searchCallEnded();
        }, 10000);
    },
    searchCallEnded: function () {
        var self = this;
        if (rtcNw.enLinea === true) {
            self.numberCallingRingow = 0;
            clearInterval(self.IntervalisCallingRingow);
            return;
        }
        var data = "id=" + self.id_call;
        function reqListener() {
            var data = JSON.parse(this.responseText);
            if (self.debug)
                console.log("searchCallEnded", data);
            if (data === "EN LINEA") {
                self.botOff();
                self.numberCallingRingow = 0;
                clearInterval(self.IntervalisCallingRingow);

                if (!rtcNw.startPeerToPeer) {
                    rtcNw.startPeerToPeer = true;
                    rtcNw.decideStart();
                }

                return true;
            } else
            if (data === "LLAMADA_PERDIDA") {
                self.bot = false;
                clearInterval(self.IntervalisCallingRingow);
                var msg = "La llamada no pudo ser atendida. ¿Qué deseas hacer? ";
                rtcNw.addMessage({text: msg, type: "other", name: self.config.bot_nombre});
                self.othersButtons.style.display = "flex";
                rtcNw.form.style.visibility = "hidden";
            } else {
                if (self.debug)
                    console.log("self.numberCallingRingow", self.numberCallingRingow);
                var msg0 = "En este momento nuestros asesores se encuentran ocupados, en un momento serás atendid@";
                var msg1 = "Te agradecemos que sigas en línea.";
                var msg2 = "Seguimos buscando asesores disponibles, por favor espera.";
                var msg3 = "Al parecer, seguimos un poco ocupados, espera por favor.";
                var msg = msg0;
                if (self.numberCallingRingow === 0) {
                    msg = msg0;
                } else
                if (self.numberCallingRingow === 1) {
                    msg = msg1;
                } else
                if (self.numberCallingRingow === 2) {
                    msg = msg2;
                } else
                if (self.numberCallingRingow === 3) {
                    msg = msg3;
                } else {
                    msg = msg1;
                    self.numberCallingRingow = 0;
                }
                rtcNw.addMessage({text: msg, type: "other", name: self.config.bot_nombre});
                self.numberCallingRingow++;

                if (rtcNw.enLinea === true) {
                    self.botOff();
                    self.numberCallingRingow = 0;
                    clearInterval(self.IntervalisCallingRingow);
                    return;
                }

            }
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v3/s/work/peer2/srv/searchCallEnded.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    sendEmailCallEnded: function () {
        var self = this;
        var data = "id_enc=" + self.id_call;
        data += "&terminal=" + self.terminal;
        data += "&href=" + self.domainVisitor;
        data += "&domain=" + self.domainVisitor;
        function reqListener() {
            var data = JSON.parse(this.responseText);
            if (self.debug)
                console.log("sendEmailCallEnded", data);

            clearInterval(self.IntervalisCallingRingow);

            var msg = "Gracias por escribirnos. Hemos recibido su mensaje y en breve será contactado.";
            rtcNw.addMessage({text: msg, type: "me", name: self.myID_no_clean});

            self.othersButtons.style.display = "flex";
            self.btnCallAgain.style.display = "none";
            rtcNw.form.style.visibility = "hidden";
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v3/s/work/peer2/srv/sendEmailCallEnded.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    setFocus: function () {
        var self = this;
        rtcNw.messageBox.addEventListener("focusin", function () {
            self.focusIn = true;
            self.readMsgCall("leido");
        });
        rtcNw.messageBox.addEventListener("focusout", function () {
            self.focusIn = false;
        });
    },
    readMsgCall: function (type) {
        var self = this;
        var data = "room=" + self.room;
        data += "&myUser=" + self.myID_no_clean;
        data += "&usuario=" + self.otherID_no_clean;
        data += "&type=" + type;
        if (rtcNw.useInterNw === true || rtcNw.isAssesor === true) {
            data += "&readNotifications=SI";
        }

        function reqListener() {
            if (self.debug) {
                console.log("readMsgCall", this.responseText);
                console.log("room", self.room);
                console.log("myUser", self.myID_no_clean);
                console.log("usuario", self.otherID_no_clean);
            }
            var data = JSON.parse(this.responseText);
            if (data === "true") {
                if (type === "leido") {
                    rtcNw.sendMessagePeer({message: "messagesendSeeMessages"});

                    rtcNw.changeHtmlReceiveLeido("See", self.otherID);
                    rtcNw.changeHtmlReceiveLeido("Dev", self.otherID);

                } else {
                    rtcNw.sendMessagePeer({message: "messagesendReceivedMessages"});
                    rtcNw.changeHtmlReceiveLeido("Dev", self.otherID);
                }
            }
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v3/s/work/peer2/srv/readMsgCall.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    notificationPushNwrtc: function (theBody, theIcon, theTitle, callback) {
        var self = this;
        if (typeof theIcon === "undefined" || theIcon === false || theIcon === null || theIcon === "") {
            theIcon = self.domain + "/app/nwchat/img/logor1.png";
        }
        var n = false;
        var options = {
            body: theBody,
            icon: theIcon,
            requireInteraction: false,
            silent: false,
            vibrate: true,
            tag: theBody,
            dir: 'ltr'
        };
        if (!("Notification"  in  window)) {
            console.log("Este navegador no soporta notificaciones de escritorio");
            return false;
        } else
        if (Notification.permission === "granted") {
            n = new Notification(theTitle, options);
        } else
        if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (!('permission'  in  Notification)) {
                    Notification.permission = permission;
                }
                if (permission === "granted") {
                    n = new Notification(theTitle, options);
                }
            });
        } else {
            if (self.debug)
                console.log("Send notifica");
            Notification.requestPermission(function (permission) {
                if (!('permission'  in  Notification)) {
                    Notification.permission = permission;
                }
                if (permission === "granted") {
                    n = new Notification(theTitle, options);
                }
            });
        }
        if (n !== false) {
            setTimeout(n.close.bind(n), 10000);
            n.onclick = function (event) {
                this.close();
                if (typeof callback != "undefined") {
                    if (callback !== false) {
                        callback();
                        return;
                    }
                }
            };
        }
    },
    sendNotificacion: function sendNotificacion(array, callback) {
        var self = this;
        var key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';
        var to = array.to;
        var notification = {
            'title': array.title,
            'body': array.body,
            'sound': array.sound,
            'icon': array.icon,
            'click_action': array.callback,
            "priority": "high",
            "content_available": true,
            "show_in_foreground": true
        };
        fetch('https://fcm.googleapis.com/fcm/send', {
            'method': 'POST',
            "content_available": true,
            'headers': {
                'Authorization': 'key=' + key,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'notification': notification,
                "show_in_foreground": true,
                "content_available": true,
                'priority': 'high',
//                "restricted_package_name":""
                'to': to,
                data: {
                    data: array.data,
                    callback: array.callback.toString(),
                    title: array.title,
                    body: array.body
                }
            })
        }).then(function (response) {
            if (self.debug)
                console.log(response);
            if (self.evalueData(callback)) {
                callback(response);
            }
        }).catch(function (error) {
            console.error(error);
        });
    },
    intervalRecorder: function () {
        var self = this;
        self.countIntervalRecorder();
        setTimeout(function () {
            self.clearCountIntervalRecorder();
            rtcNw.stopRecordVideo(true, function () {
                self.srvSaveRecordVideo(function () {
                    self.intervalRecorder();
                });
            });
        }, self.timeToSaveRecordVideo);
    },
    interRecorder: null,
    numRecord: 0,
    countIntervalRecorder: function () {
        var self = this;
        self.clearCountIntervalRecorder();
        self.interRecorder = setInterval(function () {
            self.numRecord++;
            if (self.debug)
                console.log(self.numRecord);
        }, 1000);
    },
    clearCountIntervalRecorder: function () {
        var self = this;
        self.numRecord = 0;
        clearInterval(self.interRecorder);
    },
    srvSaveRecordVideo: function (callbackEnd) {
        var self = this;
        // get recorded blob
        var blob = rtcNw.recorder.getBlob();
        // generating a random file name
//        var fileName = getFileName('webm');
        var fileName = getFileName('mp4');
        // we need to upload "File" --- not "Blob"
        var fileObject = new File([blob], fileName, {
//            type: 'video/webm'
            type: 'video/mp4'
        });
        uploadToPHPServer(fileObject, function (response, fileDownloadURL) {
            if (response !== 'ended') {
                console.log("upload progress", response);
                rtcNw.containUploadProgress.innerHTML = "upload progress " + response; // upload progress
                return;
            }
//            document.body('header').innerHTML = '<a href="' + fileDownloadURL + '" target="_blank">' + fileDownloadURL + '</a>';
            console.log('Successfully uploaded recorded blob.');
            rtcNw.containUploadProgress.innerHTML = 'Successfully uploaded recorded video';
            setTimeout(function () {
                rtcNw.containUploadProgress.innerHTML = '';
            }, 3000);
            callbackEnd();
            // preview uploaded file
//            document.getElementById('your-video-id').srcObject = null;
//            document.getElementById('your-video-id').src = fileDownloadURL;
            // open uploaded file in a new tab
//            window.open(fileDownloadURL);
        });
        function uploadToPHPServer(blob, callback) {
            var formData = new FormData();
            formData.append('video-filename', blob.name);
            formData.append('video-blob', blob);
            formData.append('room', rtcNw.room);
            formData.append('id_call', self.id_call);
            formData.append('time', rtcNw.containTimeHours.innerHTML + ':' + rtcNw.containTimeMinutes.innerHTML + ':' + rtcNw.containTimeSeconds.innerHTML);
            if (self.id_call !== null) {
                formData.append('id_call', self.id_call);
            }

            callback('Uploading recorded-file to server.');
            var upload_url = 'srv/saveRecordVideo.php';
            var upload_directory = "/imagenes/";
            makeXMLHttpRequest(upload_url, formData, function (progress) {
                if (progress !== 'upload-ended') {
                    callback(progress);
                    return;
                }
                var initialURL = upload_directory + blob.name;
                callback('ended', initialURL);
            });
        }

        function makeXMLHttpRequest(url, data, callback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    if (request.responseText === 'success') {
                        callback('upload-ended');
                        return;
                    }
                    alert(request.responseText);
                    return;
                }
            };
            request.upload.onloadstart = function () {
                callback('PHP upload started...');
            };
            request.upload.onprogress = function (event) {
                callback('PHP upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
            };
            request.upload.onload = function () {
                callback('progress-about-to-end');
            };
            request.upload.onload = function () {
                callback('PHP upload ended. Getting file URL.');
            };
            request.upload.onerror = function (error) {
                callback('PHP upload failed.');
            };
            request.upload.onabort = function (error) {
                callback('PHP upload aborted.');
            };
            request.open('POST', url, true);
            request.send(data);
        }
        function getFileName(fileExtension) {
            var d = new Date();
            var year = d.getUTCFullYear();
            var month = d.getUTCMonth();
            var date = d.getUTCDate();
            var seconds = d.getSeconds();
            var minutes = d.getMinutes();
            var hour = d.getHours();
//            var name ='RecordRTC-' + year + month + date + '-' + self.room + '-' + getRandomString() + '.' + fileExtension;
            var name = 'RecordRTC-room-' + self.id_call + '-' + year + month + date + '-' + hour + ':' + minutes + ':' + seconds + '.' + fileExtension;
            return name;
        }
        function getRandomString() {
            if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
                var a = window.crypto.getRandomValues(new Uint32Array(3)),
                        token = '';
                for (var i = 0, l = a.length; i < l; i++) {
                    token += a[i].toString(36);
                }
                return token;
            } else {
                return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
            }
        }
    },
    get: function () {
        var loc = document.location.href;
        var getString = loc.split('?')[1];
        if (typeof getString === "undefined" || getString === undefined) {
            return false;
        }
        var GET = getString.split('&');
        var get = {};
        for (var i = 0, l = GET.length; i < l; i++) {
            var tmp = GET[i].split('=');
            get[tmp[0]] = unescape(decodeURI(tmp[1]));
        }
        return get;
    },
    removeLoading: function () {
        var d = document.querySelector(".loadingNwChat");
        if (d)
            d.remove();
    },
    botActivar: function () {
        var self = this;
        if (self.debug)
            console.log("self.status_call", self.status_call);
        if (self.status_call === "EN LINEA") {
            self.bot = false;

            if (!rtcNw.startPeerToPeer) {
                rtcNw.startPeerToPeer = true;
                rtcNw.decideStart();
            }

        } else {
            rtcNw.statusTextOtherEnc.style.display = "none";
            self.bot = true;
        }
    },
    botValidateResponse: function () {
        var self = this;
        if (!self.bot || self.lastMessageIsBy === "bot") {
            return false;
        }
        self.bot_message = false;
        var msgOther = self.lastMsg;
        if (self.bot_ha_pedido_nombre === true && self.nombre_cliente === false) {
            self.nombre_cliente = msgOther;
            window.localStorage.setItem(self.room + "_nombre_cliente", self.nombre_cliente);
        }
        if (self.bot_ha_pedido_celular === true && self.celular_cliente === false) {
            self.celular_cliente = msgOther;
            window.localStorage.setItem(self.room + "_celular_cliente", self.celular_cliente);
        }
        if (self.bot_ha_pedido_correo === true && self.correo_cliente === false) {
            self.correo_cliente = msgOther;
            window.localStorage.setItem(self.room + "_correo_cliente", self.correo_cliente);
        }
        if (self.bot_ha_pedido_identificacion === true && self.documento_cliente === false) {
            self.documento_cliente = msgOther;
            window.localStorage.setItem(self.room + "_documento_cliente", self.documento_cliente);
        }

        if (!self.bot_ha_saludado) {
            self.bot_ha_saludado = true;
            self.bot_message = self.config.bot_saludo.replace("{nombre_bot}", self.config.bot_nombre);
        } else
        if (!self.bot_ha_indicado_pedir_datos) {
            self.bot_ha_indicado_pedir_datos = true;
            self.bot_message = "Necesito unos datos para poder continuar, ¿de acuerdo?";
        } else
        if (!self.bot_ha_pedido_nombre && self.config.registro_usar_nombre === "SI") {
            self.bot_ha_pedido_nombre = true;
            self.bot_message = self.config.bot_pedir_nombre.replace("{name_customer}", self.nombre_cliente);
        } else
        if (!self.bot_ha_pedido_celular && self.config.registro_usar_celular === "SI") {
            self.bot_ha_pedido_celular = true;
            self.bot_message = self.config.bot_pedir_celular.replace("{name_customer}", self.nombre_cliente);
        } else
        if (!self.bot_ha_pedido_correo && self.config.registro_usar_email === "SI") {
            self.bot_ha_pedido_correo = true;
            self.bot_message = self.config.bot_pedir_correo.replace("{name_customer}", self.nombre_cliente);
        } else
        if (!self.bot_ha_pedido_identificacion && self.config.registro_usar_documento === "SI") {
            self.bot_ha_pedido_identificacion = true;
            self.bot_message = self.nombre_cliente + ", ¿Cómo es tu número de identificación?";
        } else
        if (self.nombre_cliente !== false && self.celular_cliente !== false && self.correo_cliente !== false) {
            self.bot_message = self.config.bot_esperando_agente.replace("{name_customer}", self.nombre_cliente);

            self.botOff();

            setTimeout(function () {
                self.changeStatusCall("LLAMANDO", "chat");
            }, 1000);
        }

        if (self.bot_message !== false) {
            self.botSendMessage();
        }
    },
    botOff: function () {
        var self = this;
        self.bot = false;
        rtcNw.statusTextOtherEnc.style.display = "flex";
    },
    botSendMessage: function () {
        var self = this;
        setTimeout(function () {
            rtcNw.createWritten(3000);
            setTimeout(function () {

                var msg = self.bot_message;
//            rtcNw.addMessage({text: msg, type: "other", name: self.otherID_no_clean});
//                rtcNw.addMessage({text: msg, type: "other", name: "Bot"});
                rtcNw.addMessage({text: msg, type: "other", name: self.config.bot_nombre});

                self.lastMsg = msg;
                self.lastUserSendMessage = self.otherID_no_clean;
                self.lastOtherUserSendMessage = self.myID_no_clean;
                self.saveMsgSrv();

                self.lastMessageIsBy = "bot";
            }, 3000);
        }, 1000);

    },
    evalueData: function (d, exception) {
        var self = this;
        if (typeof d == "undefined") {
            return false;
        }
        if (self.evalueData(exception)) {
            if (d == exception) {
                return true;
            }
        }
        if (d == undefined) {
            return false;
        }
        if (d == null) {
            return false;
        }
        if (d == "null") {
            return false;
        }
        if (d == false) {
            return false;
        }
        if (d == "") {
            return false;
        }
        return true;
    }
};
srv.initialize();