var intervalVer;
function inicia(callBack) {
    initCompruebaLlamadaStatus();

    if (validaCompatibilityVideoCall() === false) {
        return;
    }
    inicialiceRtc(callBack);
}

var myStream;

function inicialiceRtc(callBack) {
    var constraints = window.constraints = {
        audio: true,
        video: video
    };
    function handleSuccess(stream) {
        var videoTracks = stream.getVideoTracks();
//        console.log('Got stream with constraints:', constraints);
//        console.log('Using video device: ' + videoTracks[0].label);
        stream.oninactive = function () {
            console.log('Stream inactive');
        };

        if (callBack == "startCall") {
            startCall();
        } else
        if (callBack == "answerCall") {
            answerCall();
        }

        return true;
    }
    function handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            errorMsg('La resolución ' + constraints.video.width.exact + 'x' + constraints.video.width.exact + ' px no es soportada por su dispositivo.');
        } else if (error.name === 'PermissionDeniedError') {
            errorMsg('No se han concedido permisos para usar tu cámara y micrófono, debes permitir que la app acceda a tus dispositivos para que la llamada funcione.');
        }
        var er = error.name;
        if (er == "DevicesNotFoundError") {
            er = "No se encontró un dispositivo multimedia, revise su cámara y/o micrófono.";
        }
        errorMsg('getUserMedia error: ' + er, error);
    }
    function errorMsg(msg, error) {
        nw_dialog(msg);
        if (typeof error !== 'undefined') {
            console.error(error);
        }
    }

    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);


    getUserMedia: function getUserMedia(options, callback) {
        navigator.genericGetUserMedia = (
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia
                );
        navigator.genericGetUserMedia(options, callback, function (error) {
            nw_dialog(error);
            console.log(error);
        });
    }

//    if (callBack == "startCall") {
//        startCall();
//    } else
//    if (callBack == "answerCall") {
//        answerCall();
//    }

    startCall: function startCall() {
        var get = getGET();
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "consultaUsuarioConectado";
        rpc["data"] = {usuario: get["usuario"]};
        function  funcV(r) {
            if (r === false) {
//                nw_dialog("El usuario no se encuentra conectado, intente mas tarde");
//                return;
            }
            $(".llamar").fadeOut(0);
            startVideoAndPeer();
            function error(err) {
                console.log("error line 17: " + err);
            }
            pc.onicecandidate = function (evt) {
                console.log("candidate");
                var get = getGET();
                var usuario = get["usuario"];
                var v = {};
                if (evt.candidate == null) {
                    return;
                }
                v["candidate"] = JSON.stringify(evt.candidate);
                v["usuario"] = usuario;
                v["id_call"] = get.id_call;
                function func(r) {
                }
                var rpc = {};
                rpc["service"] = "master";
                rpc["method"] = "saveCandidate";
                rpc["data"] = v;
                rpcNw("rpcNw", rpc, func, true);
            };
            getUserMedia({audio: true, video: video}, function (stream) {
                myStream = stream;
                pc.addStream(stream);
                var vid = videoMe;
                vid.src = URL.createObjectURL(stream);
                vid.play();
                streamMe = stream;
                pc.createOffer(function (offer) {
                    pc.setLocalDescription(getSessionDescription(offer), function () {
                        var get = getGET();
                        var usuario = get["usuario"];
                        var d = {
                            offer: offer.sdp,
                            usuario: usuario
                        };
                        if (video === false) {
                            d.video = "false";
                        }
                        d.id_call = get.id_call;
                        var funcOffer = function (r) {
                            console.log("get");
                        };
                        var rpc = {};
                        rpc["service"] = "master";
                        rpc["method"] = "processRtc";
                        rpc["data"] = d;
                        rpcNw("rpcNw", rpc, funcOffer);
                        if (typeof get["no_notify"] == "undefined") {
                            var rpc = {};
                            rpc["service"] = "master";
                            rpc["method"] = "notificaUserCallRtc";
                            rpc["data"] = d;
                            var func = function (r) {
                                if (!verifyErrorNwMaker(r)) {
                                    return;
                                }
                            };
                            rpcNw("rpcNw", rpc, func);
                        }
                    }, error);
                }, error);
            }, function (error) {
                console.log("line 102" + error);
            });

            testIsAnswered();
            interval = setInterval(function () {
                testIsAnswered();
            }, 3000);
        }
        rpcNw("rpcNw", rpc, funcV, true);
    }

    testIsAnswered: function testIsAnswered() {
        var get = getGET();
        var self = this;
        var usuario = get["usuario"];
        function error(err) {
            if (!verifyErrorNwMaker(err)) {
                window.clearInterval(interval);
                console.log(err);
                return;
            }
        }
        var d = {
            usuario: usuario,
            id_call: get.id_call
        };
        var func = function (rta) {
            console.log(rta);
            if (!verifyErrorNwMaker(rta)) {
//                window.clearInterval(interval);
                return;
            }
            activeSoundCalling();
            if (rta != false) {
                console.log(rta);
                var v = {
                    type: "answer",
                    sdp: rta
                };
                pc.setRemoteDescription(getSessionDescription(v), function () {
                    self.callInProgress = true;
                    startSearchCandidates();
                }, error);
//                window.clearInterval(self.interval);
//                window.clearInterval(interval);
            }
        };
        var rpc = {};
        rpc["service"] = "master";
        rpc["method"] = "haveResponseRtc";
        rpc["data"] = d;
        rpcNw("rpcNw", rpc, func, true);
    }

    answerCall: function answerCall() {
        $(".responder").fadeOut(0);
        var up = getUserInfo();
        var get = getGET();
        var usuario = get["usuario"];
        startVideoAndPeer();
        var func = function (rta) {
            console.log(rta);
//            if (!verifyErrorNwMaker(rta)) {
//                endCall();
//                return;
//            }
            function error(err) {
                endCall();
                if (!verifyErrorNwMaker(err)) {
                    return;
                }
            }
            pc.onicecandidate = function (evt) {
                var v = {};
                if (evt.candidate == null) {
                    return;
                }
                v["candidate"] = JSON.stringify(evt.candidate);
                v["usuario"] = usuario;
                v.id_call = get.id_call;
                function func2(tt) {
                    console.log(tt);
                }
                var rpc = {};
                rpc["service"] = "master";
                rpc["method"] = "saveCandidate";
                rpc["data"] = v;
                rpcNw("rpcNw", rpc, func2, true);
            };
            getUserMedia({video: video, audio: true}, function (stream) {
                myStream = stream;
                var vid = videoMe;
                vid.src = URL.createObjectURL(stream);
                vid.play();
                streamMe = stream;
                var val = {
                    'type': "offer",
                    'sdp': rta
                };
                pc.addStream(stream);
                pc.setRemoteDescription(getSessionDescription(val), function () {
                    pc.createAnswer(function (answer) {
                        pc.setLocalDescription(getSessionDescription(answer), function () {
                            var d = {
                                answer: answer.sdp,
                                usuario: usuario,
                                id_call: get.id_call
                            };
                            function func2(oo) {
                                console.log(oo);
                            }
                            var rpc = {};
                            rpc["service"] = "master";
                            rpc["method"] = "saveResponseSecondRtc";
                            rpc["data"] = d;
                            rpcNw("rpcNw", rpc, func2);
                            startSearchCandidates();
                        }, error);
                    }, error);
                }, error);
            });
        };
        var d = {
            usuario: usuario,
            id_call: get.id_call
        };
        var rpc = {};
        rpc["service"] = "master";
        rpc["method"] = "getRtc";
        rpc["data"] = d;
        rpcNw("rpcNw", rpc, func, true);
    }

    startVideoAndPeer: function startVideoAndPeer() {

        var moz = !!navigator.mozGetUserMedia;
        var chromeVersion = !!navigator.mozGetUserMedia ? 0 : parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);


        var iceServers = [];

        if (moz) {
            iceServers.push({
                url: 'stun:23.21.150.121'
            });

            iceServers.push({
                url: 'stun:stun.services.mozilla.com'
            });
        } else {
            iceServers.push({
                url: 'stun:stun.l.google.com:19302'
            });

            iceServers.push({
                url: 'stun:stun.anyfirewall.com:3478'
            });
        }

        if (!moz && chromeVersion < 28) {
            iceServers.push({
                url: 'turn:homeo@turn.bistri.com:80',
                credential: 'homeo'
            });
        }

        if (!moz && chromeVersion >= 28) {
            iceServers.push({
                url: 'turn:turn.bistri.com:80',
                credential: 'homeo',
                username: 'homeo'
            });

            iceServers.push({
                url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                credential: 'webrtc',
                username: 'webrtc'
            });
        }

        iceServers.push({
            'url': 'turn:192.158.29.39:3478?transport=udp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        });
        iceServers.push({
            'url': 'turn:192.158.29.39:3478?transport=tcp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        });
        iceServers.push({
            url: 'turn:turn.bistri.com:80',
            username: 'homeo',
            credential: 'homeo'
        });
        iceServers.push({
            url: 'stun:stun.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun1.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun2.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stu3.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun4.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun.ekiga.net'
        });
        iceServers.push({
            url: 'stun:stun.ideasip.com'
        });
        iceServers.push({
            url: 'stun:stun.iptel.org'
        });
        iceServers.push({
            url: 'stun:stun.rixtelecom.se'
        });
        iceServers.push({
            url: 'stun:stun.schlund.de'
        });
        iceServers.push({
            url: 'stun:stunserver.org'
        });
        iceServers.push({
            url: 'stun:stun.softjoys.com'
        });
        iceServers.push({
            url: 'stun:stun.voiparound.com'
        });
        iceServers.push({
            url: 'stun:stun.voipbuster.com'
        });
        iceServers.push({
            url: 'stun:stun.voipstunt.com'
        });
        iceServers.push({
            url: 'stun:stun.stunprotocol.org:3478'
        });
        iceServers.push({
            url: 'stun:stun.services.mozilla.com'
        });
        iceServers.push({
            url: 'stun:stun.sipgate.net'
        });
        iceServers.push({
            url: 'turn:numb.viagenie.ca:3478',
            username: 'assdres@gmail.com',
            credential: 'padre08'
        });

        var servers = {
            iceServers: iceServers
        };

        videoRemote = document.querySelector("#video2");

        pc = getPeer(servers);

        pc = pc;
        pc.onaddstream = function (event) {
            var vid = videoRemote;
            vid.src = URL.createObjectURL(event.stream);
            vid.play();
        };
        videoMe = document.querySelector("#video");
    }

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
    }

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
    }


    startSearchCandidates: function startSearchCandidates() {
        var self = this;
        var up = getUserInfo();
        var get = getGET();
        var usuario = get["usuario"];
//        self.setNotification(self.tr("Recuperando información de conexión"));
        var func = function (rta) {
            console.log(rta);
            if (rta == null) {
                return;
            }
            rta = rta.substring(2);
            var arr = rta.split("||");
            for (var i = 0; i < arr.length; i++) {
                var candidate = JSON.parse(arr[i]);
                if (candidate != null) {
                    pc.addIceCandidate(getRtcCandidate(candidate));
                }
            }
//            self.setNotification(self.tr("Conectado"));
            responseEmisor();
            self.callInProgress = true;
        };
        var d = {};
        d["usuario"] = up["usuario"];

        var rpc = {};
        rpc["service"] = "master";
        rpc["method"] = "getCandidates";
        rpc["data"] = {id_call: get.id_call};
        rpcNw("rpcNw", rpc, func);
    }

    getRtcCandidate: function getRtcCandidate(candidate) {
        var genericRTCIceCandidate;
        if (typeof RTCIceCandidate !== "undefined") {
            genericRTCIceCandidate = RTCIceCandidate;
        }
        if (typeof mozRTCIceCandidate !== "undefined") {
            genericRTCIceCandidate = mozRTCIceCandidate;
        }
        if (typeof webkitRTCIceCandidate !== "undefined") {
            genericRTCIceCandidate = webkitRTCIceCandidate;
        }
        if (typeof msRTCIceCandidate !== "undefined") {
            genericRTCIceCandidate = msRTCIceCandidate;
        }
        return new genericRTCIceCandidate(candidate);
    }
}

function initCompruebaLlamadaStatus() {
    intervalVer = setInterval(function () {
        compruebaLlamadaStatus();
    }, 3000);
}
function compruebaLlamadaStatus() {
    if (typeof pc != "undefined") {
        var status = pc.iceConnectionState;
        $(".bloqVoice").text(status);
        console.log(pc);
        $(".textStatusCall").text(status + ", signalingState:" + pc.signalingState + ". iceGatheringState: " + pc.iceGatheringState + ". Type: " + pc.remoteDescription.type);
        if (status === "disconnected") {
            document.getElementById('soundLostCalling').play();
            $(".callEndVoice").text("Conexión perdida");
            window.clearInterval(intervalVer);
            endCall();
            return;
        }
    }
}

function endCall() {
    if (myStream.stop) {
        console.log("stop1");
        myStream.stop(); // idk what this does, left here for legacy reasons..?
    } else {
        myStream.getTracks().forEach(function (track) {
            console.log("stop2");
//            window.clearInterval(self.interval);
//            window.clearInterval(interval);
            $(".callEndVoice").fadeIn(0);
            $(".callingVoice").fadeOut(0);
            $(".inLineVoice").fadeOut(0);
            track.stop();
            setTimeout(function () {
                window.close();
            }, 1000);
        });
    }
}

function responseEmisor() {
    if (video === true) {
        $(".containerVoice").addClass("containerCallVideo");
    }
    $(".callingVoice").fadeOut(0);
    $(".inLineVoice").fadeIn(0);
}

function activeSoundCalling() {
    document.getElementById('soundCalling').play();
}