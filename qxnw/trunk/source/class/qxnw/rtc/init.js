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
qx.Class.define("qxnw.rtc.init", {
    extend: qxnw.forms,
    /**
     * Gets and create the session data, starts partial layout, sets the rpcUrl value and gets and save the actual theme. 
     */
    construct: function() {

        this.base(arguments);
        var self = this;

        self.containerRemoteVideo = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
            minHeight: 300
        });
        self.containerOwnVideo = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
            minHeight: 100
        });
        self.containerTools = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
            minHeight: 50,
            maxHeight: 50
        });

        self.masterContainer.add(self.containerRemoteVideo, {
            flex: 0
        });
        self.masterContainer.add(self.containerOwnVideo, {
            flex: 0
        });
        self.masterContainer.add(self.containerTools);

        self.options = [];

        self.options.STUN = {
            url: !!navigator.webkitGetUserMedia
                    ? 'stun:stun.l.google.com:19302'
                    : 'stun:23.21.150.121'
        };
        self.options.TURN = {
            url: 'turn:turn.bistri.com:80',
            username: 'homeo',
            credential: 'homeo'
        };

        self.pc = self.getPeer({
            'iceServers': [this.options.STUN, this.options.TURN]
        });
        self.pc.onaddstream = function(event) {
            var vid = self.videoRemote.getDomElement();
            vid.src = URL.createObjectURL(event.stream);
            vid.play();
        };

        var css = {
            heigth: 100,
            width: 100
        };
        var arrbtRemote = {
            autoPlay: true,
            width: 300
        };

        self.videoRemote = new qx.html.Element("video", css, arrbtRemote);

        var arrbtMe = {
            autoPlay: true,
            width: 100,
            muted: true
        };

        self.videoMe = new qx.html.Element("video", css, arrbtMe);

        self.notificationsLbl = new qx.ui.basic.Label().set({
            rich: true
        });

        self.setNotification(self.tr("Creando interfaz..."));

        self.containerTools.add(self.notificationsLbl);

        self.containerOwnVideo.getContentElement().add(self.videoMe, {
            flex: 0
        });

        self.containerRemoteVideo.getContentElement().add(self.videoRemote, {
            flex: 0
        });
    },
    members: {
        pc: null,
        notificationsLbl: null,
        options: null,
        createNotificationsUi: function createNotificationsUi() {
                
        },
        startRing: function startRing() {
            var self = this;
            qxnw.utils.makeSound();
            var ringButton = new qx.ui.form.Button("Responder llamada", qxnw.config.execIcon("telephone", "qxnw"));
            qxnw.animation.startEffect("shake", ringButton);
            self.toolbar.add(ringButton);
            ringButton.addListener("click", function(e) {
                self.answerCall();
                ringButton.destroy();
            }, this);
        },
        startCall: function startCall() {
            var self = this;
            self.startVideoAndPeer();
            function error(err) {
                qxnw.utils.error(err);
            }
            self.pc.onicecandidate = function(evt) {
                self.setNotification(self.tr("Guardando información de conexión"));
                var v = {};
                v["candidate"] = JSON.stringify(evt.candidate);
                v["usuario"] = self.usuarioLlega;
                qxnw.utils.fastAsyncCallRpc("master", "saveCandidate", v, 0, 0, false);
            };
            self.setNotification(self.tr("Generando llamada"));
            self.getUserMedia({audio: true, video: true}, function(stream) {
                self.pc.addStream(stream);
                var vid = self.videoMe.getDomElement();
                vid.src = URL.createObjectURL(stream);
                vid.play();
                self.pc.createOffer(function(offer) {
                    self.pc.setLocalDescription(self.getSessionDescription(offer), function() {
                        var d = {
                            offer: offer.sdp,
                            usuario: self.usuarioLlega
                        };
                        self.setNotification(self.tr("Enviando información de llamada"));
                        var funcOffer = function() {
                            self.setNotification(self.tr("Información de llamada enviada... esperando respuesta"));
                        };
                        qxnw.utils.fastAsyncRpcCall("master", "processRtc", d);
                    }, error);
                }, error);
            }, function(error) {
                alert(error);
            });
            self.interval = setInterval(function() {
                self.testIsAnswered();
            }, 3000);
        },
        setNotification: function setNotification(text) {
            var html = "<br /><br /><br /><br />";
            html += "<strong style='size: 22'>";
            html += "<b>";
            html += text;
            html += "</b>";
            html += "</strong>";
            this.notificationsLbl.setValue(html);
        },
        stopCall: function stopCall() {
            var self = this;
            var layout = self.containerChatMain.getLayout();
            layout.setColumnWidth(1, 0);
            try {
                self.containerChatVideo.destroy();
                self.containerChatVideoNotifications.destroy();
            } catch (e) {

            }
            qxnw.utils.fastAsyncRpcCall("master", "clearCalls");
        },
        answerCall: function answerCall() {
            var self = this;
            self.startVideoAndPeer();
            self.setNotification(self.tr("Verificando llamada..."));
            var func = function(rta) {
                function error(err) {
                    qxnw.utils.error(err);
                }
                self.getUserMedia({video: true, audio: true}, function(stream) {
                    var vid = self.videoMe.getDomElement();
                    vid.src = URL.createObjectURL(stream);
                    vid.play();
                    var val = {
                        'type': "offer",
                        'sdp': rta
                    };
                    self.pc.addStream(stream);
                    self.pc.setRemoteDescription(self.getSessionDescription(val), function() {
                        self.pc.createAnswer(function(answer) {
                            self.pc.setLocalDescription(self.getSessionDescription(answer), function() {
                                var d = {
                                    answer: answer.sdp,
                                    usuario: self.usuarioLlega
                                };
                                self.setNotification(self.tr("Respondiendo interfaz..."));
                                qxnw.utils.fastAsyncRpcCall("master", "saveResponseSecondRtc", d);
                                self.startSearchCandidates();
                            }, error);
                        }, error);
                    }, error);
                });
            };
            var d = {
                usuario: self.usuarioLlega
            };
            qxnw.utils.fastAsyncRpcCall("master", "getRtc", d, func);
        },
        getPeer: function getPeer(parameter) {
            var genericRTCPeerConnection;
            if (typeof RTCPeerConnection !== "undefined") {
                genericRTCPeerConnection = RTCPeerConnection;
            }
            if (typeof mozRTCPeerConnection !== "undefined") {
                genericRTCPeerConnection = mozRTCPeerConnection;
            }
            if (typeof webkitRTCPeerConnection !== "undefined") {
                genericRTCPeerConnection = webkitRTCPeerConnection;
            }
            if (typeof msRTCPeerConnection !== "undefined") {
                genericRTCPeerConnection = msRTCPeerConnection;
            }
            if (typeof genericRTCPeerConnection === "undefined") {
                return false;
            }
            return new genericRTCPeerConnection(parameter);
        },
        getSessionDescription: function getSessionDescription(parameter) {
            var genericRTCSessionDescription;
            if (typeof RTCSessionDescription !== "undefined") {
                genericRTCSessionDescription = RTCSessionDescription;
            }
            if (typeof mozRTCSessionDescription !== "undefined") {
                genericRTCSessionDescription = mozRTCSessionDescription;
            }
            if (typeof webkitRTCSessionDescription !== "undefined") {
                genericRTCSessionDescription = webkitRTCSessionDescription;
            }
            if (typeof msRTCSessionDescription !== "undefined") {
                genericRTCSessionDescription = msRTCSessionDescription;
            }
            return new genericRTCSessionDescription(parameter);
        },
        getUserMedia: function getUserMedia(options, callback) {
            navigator.genericGetUserMedia = (
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia
                    );
            navigator.genericGetUserMedia(options, callback, function(error) {
                qxnw.utils.error(error);
            });
        },
        testIsAnswered: function testIsAnswered() {
            var self = this;
            function error(err) {
                qxnw.utils.error(err);
            }
            self.setNotification(self.tr("Marcando..."));
            var d = {
                usuario: self.usuarioLlega
            };
            var func = function(rta) {
                if (rta != false) {
                    var v = {
                        type: "answer",
                        sdp: rta
                    };
                    self.setNotification(self.tr("Llamada exitosa"));
                    self.pc.setRemoteDescription(self.getSessionDescription(v), function() {
                        self.setNotification(self.tr("Conectado"));
                    }, error);
                    window.clearInterval(self.interval);
                }
            };
            qxnw.utils.fastAsyncRpcCall("master", "haveResponseRtc", d, func, 0, false);
        },
        startSearchCandidates: function startSearchCandidates() {
            var self = this;
            self.setNotification(self.tr("Recuperando información de conexión"));
            var func = function(rta) {
                rta = rta.substring(2);
                var arr = rta.split("||");
                for (var i = 0; i < arr.length; i++) {
                    var candidate = JSON.parse(arr[i]);
                    if (candidate != null) {
                        self.pc.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                }
                self.setNotification(self.tr("Conectado"));
            };
            qxnw.utils.fastAsyncRpcCall("master", "getCandidates", 0, func);
        }
    }
});
;