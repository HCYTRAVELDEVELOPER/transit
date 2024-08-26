qx.Class.define("qxnw.examples.formVideoChat", {
    extend: qxnw.forms,
    ///TEST
    construct: function construct() {
        this.base(arguments);
        var self = this;
        self.createDeffectButtons();
        self.ui.accept.setLabel("Iniciar llamada");

        this.options.STUN = {
            url: !!navigator.webkitGetUserMedia
                    ? 'stun:stun.l.google.com:19302'
                    : 'stun:23.21.150.121'
        };
        this.options.TURN = {
            url: 'turn:turn.bistri.com:80',
            username: 'homeo',
            credential: 'homeo'
        };

        var pc = self.getPeer({
            'iceServers': [this.options.STUN, this.options.TURN]
        });
        self.pc = pc;

        self.pc.onaddstream = function(event) {
            var vid = self.videoRemote.getDomElement();
            vid.src = URL.createObjectURL(event.stream);
            vid.play();
        };

        var css = {
            heigth: 100,
            width: 100
        };
        var arrbt = {
            autoPlay: true,
            heigth: 200,
            width: 200
        };

        self.videoRemote = new qx.html.Element("video", css, arrbt);

        //arrbt["muted"] = true;

        self.videoMe = new qx.html.Element("video", css, arrbt);

        self.masterContainer.getContentElement().add(self.videoMe, {
            flex: 0
        });

        self.masterContainer.getContentElement().add(self.videoRemote, {
            flex: 0
        });

        self.ui.accept.addListener("execute", function() {
            self.startCall();
        });
        self.ui.cancel.addListener("execute", function() {
            self.answerCall();
        });
    },
    members: {
        video: null,
        pc: null,
        interval: null,
        options: [],
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
        startCall: function startCall() {
            var self = this;
            function error(err) {
                qxnw.utils.error(err);
            }
            self.pc.onicecandidate = function(evt) {
                var v = JSON.stringify(evt.candidate);
                qxnw.utils.fastAsyncCallRpc("master", "saveCandidate", v);
            };
            navigator.webkitGetUserMedia({audio: true, video: true}, function(stream) {
                self.pc.addStream(stream);
                var vid = self.videoMe.getDomElement();
                vid.src = URL.createObjectURL(stream);
                vid.play();
                self.pc.createOffer(function(offer) {
                    self.pc.setLocalDescription(self.getSessionDescription(offer), function() {
                        var d = {
                            offer: offer.sdp
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
        testIsAnswered: function testIsAnswered() {
            var self = this;
            function error(err) {
                qxnw.utils.error(err);
            }
            var func = function(rta) {
                if (rta != false) {
                    var v = {
                        type: "answer",
                        sdp: rta
                    };
                    self.pc.setRemoteDescription(self.getSessionDescription(v), function() {
                    }, error);
                    window.clearInterval(self.interval);
                }
            };
            qxnw.utils.fastAsyncRpcCall("master", "haveResponseRtc", 0, func);
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
        answerCall: function answerCall() {
            var self = this;
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
                                    answer: answer.sdp
                                };
                                qxnw.utils.fastAsyncRpcCall("master", "saveResponseSecondRtc", d);
                                self.startSearchCandidates();
                            }, error);
                        }, error);
                    }, error);
                });
            };
            qxnw.utils.fastAsyncRpcCall("master", "getRtc", 0, func);
        },
        startSearchCandidates: function startSearchCandidates() {
            var self = this;
            var func = function(rta) {
                var rta = rta.substring(2);
                var arr = rta.split("||");
                for (var i = 0; i < arr.length; i++) {
                    var candidate = JSON.parse(arr[i]);
                    if (candidate != null) {
                        self.pc.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                }
            };
            qxnw.utils.fastAsyncRpcCall("master", "getCandidates", 0, func);
        }
    }
});