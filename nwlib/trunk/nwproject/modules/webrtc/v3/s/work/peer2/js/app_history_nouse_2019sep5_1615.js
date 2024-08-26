(function (global) {

    // Compatibility
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

    var peerClient;
    var currentPeerConnection;
    var localMediaStream;

//    $(function () {
    var get = get();
    if (!get) {
        return false;
    }

    var $myselfId_get = get.myID;
    var $partnerId_get = get.otherID;
    var $share = document.querySelector('#js-share');
    var $myselfId = document.querySelector('#js-myself-id');
    var $peerId = document.querySelector('#js-peer-id');
    var $partnerId = document.querySelector('#js-partner-id');
//    var $open = document.querySelector('#js-open');
    var $connect = document.querySelector('#js-connect');
    var videoMyself = document.querySelector('#js-video-myself');
    var videoPartner = document.querySelector('#js-video-partner');

    $myselfId.value = $myselfId_get;
    $partnerId.value = $partnerId_get;


    var sharedScreen = false;
    if (get.sharedScreen === "true") {
        sharedScreen = true;
    }
    if (sharedScreen === false) {
        navigator.getUserMedia({video: true, audio: true}, function (stream) {
            if ('srcObject' in videoMyself) {
                videoMyself.srcObject = stream;
            } else {
                videoMyself.src = window.URL.createObjectURL(stream);
            }
            videoMyself.muted = true;
            videoMyself.volume = 0;
            videoMyself.play();
            localMediaStream = stream;

            var js = document.createElement("script");
            js.src = "https://www.WebRTC-Experiment.com/RecordRTC.js";
            js.onload = function () {
                var recorder = RecordRTC(stream, {
                    type: 'video'
                });
                recorder.startRecording();
                setTimeout(function () {
                    recorder.stopRecording(function () {
                        var blob = recorder.getBlob();
                        console.log(blob);
                        invokeSaveAsDialog(blob);
                    });
                }, 10000);
            };
            document.body.appendChild(js);


        }, function (error) {
            alert(error);
        });
//        navigator.mediaDevices.getUserMedia({
//            video: true,
//            audio: {echoCancellation: true}
//        }).then(async function (stream) {
//            if ('srcObject' in videoMyself) {
//                videoMyself.srcObject = stream;
//            } else {
//                videoMyself.src = window.URL.createObjectURL(stream);
//            }
//            videoMyself.muted = true;
//            videoMyself.volume = 0;
//            videoMyself.play();
//            localMediaStream = stream;
//
//            var recorder = RecordRTC(stream, {
//                type: 'video'
//            });
//            recorder.startRecording();
//            setTimeout(function () {
//                recorder.stopRecording(function () {
//                    var blob = recorder.getBlob();
//                    invokeSaveAsDialog(blob);
//                });
//            }, 5000);
//        });
    } else
    if (sharedScreen === true) {
        //https://github.com/muaz-khan/Chrome-Extensions/tree/master/Screen-Capturing.js https://github.com/muaz-khan/getScreenId
        var js = document.createElement("script");
        js.src = "https://www.WebRTC-Experiment.com/getScreenId.js";
        js.onload = function () {
            var js = document.createElement("script");
            js.src = "https://webrtc.github.io/adapter/adapter-latest.js";
            document.body.appendChild(js);
            js.onload = function () {

//                getChromeExtensionStatus(function (status) {
//                    if (status === 'installed-enabled')
//                        console.log('installed extension');
//                    if (status === 'installed-disabled')
//                        alert('installed but disabled');
//                });


                getScreenId(function (error, sourceId, screen_constraints) {

                    navigator.mediaDevices.getUserMedia(screen_constraints).then(function (stream) {
                        var video = document.querySelector('#js-video-myself');
                        if ('srcObject' in video) {
                            video.srcObject = stream;
                        } else {
                            video.src = window.URL.createObjectURL(stream);
                        }
                        localMediaStream = stream;

                        addStreamStopListener(localMediaStream, function () {
                            console.log('screen sharing is ended.');
                            var url = "";
                            url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + $myselfId_get + "&otherID=" + $partnerId_get;
                            window.location = url;
                        });
                        function addStreamStopListener(stream, callback) {
                            stream.addEventListener('ended', function () {
                                console.log("ended");
                                callback();
                                callback = function () {};
                            }, false);
                            stream.addEventListener('inactive', function () {
                                console.log("inactive");
                                callback();
                                callback = function () {};
                            }, false);
                            stream.getTracks().forEach(function (track) {
                                track.addEventListener('ended', function () {
                                    console.log("ended");
                                    callback();
                                    callback = function () {};
                                }, false);
                                track.addEventListener('inactive', function () {
                                    console.log("inactive");
                                    callback();
                                    callback = function () {};
                                }, false);
                            });
                        }
                    }).catch(function (error) {
                        console.log("ERROR::: " + error);
                        var url = "";
                        url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + $myselfId_get + "&otherID=" + $partnerId_get;
                        window.location = url;
                    });
                    return true;
                    // error    == null || 'permission-denied' || 'not-installed' || 'installed-disabled' || 'not-chrome'
                    // sourceId == null || 'string' || 'firefox'
                    if (sourceId && sourceId != 'firefox') {
                        screen_constraints = {
                            video: {
                                mandatory: {
                                    chromeMediaSource: 'screen',
                                    maxWidth: 1920,
                                    maxHeight: 1080,
                                    minAspectRatio: 1.77
                                }
                            }
                        };
                        if (error === 'permission-denied')
                            return alert('Permission is denied.');
                        if (error === 'not-chrome')
                            return alert('Please use chrome.');

                        if (!error && sourceId) {
                            screen_constraints.video.mandatory.chromeMediaSource = 'desktop';
                            screen_constraints.video.mandatory.chromeMediaSourceId = sourceId;
                        }
                    }

                    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
                    navigator.getUserMedia(screen_constraints, function (stream) {
                        var video = document.querySelector('#js-video-myself');
                        if ('srcObject' in video) {
                            video.srcObject = stream;
                        } else {
                            video.src = window.URL.createObjectURL(stream);
                        }
                        localMediaStream = stream;
                        //https://www.webrtc-experiment.com/webrtcpedia/#stream-ended-listener
                        addStreamStopListener(localMediaStream, function () {
                            console.log('screen sharing is ended.');
                            var url = "";
                            url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + $myselfId_get + "&otherID=" + $partnerId_get;
                            window.location = url;
                        });
                        function addStreamStopListener(stream, callback) {
                            stream.addEventListener('ended', function () {
                                console.log("ended");
                                callback();
                                callback = function () {};
                            }, false);
                            stream.addEventListener('inactive', function () {
                                console.log("inactive");
                                callback();
                                callback = function () {};
                            }, false);
                            stream.getTracks().forEach(function (track) {
                                track.addEventListener('ended', function () {
                                    console.log("ended");
                                    callback();
                                    callback = function () {};
                                }, false);
                                track.addEventListener('inactive', function () {
                                    console.log("inactive");
                                    callback();
                                    callback = function () {};
                                }, false);
                            });
                        }
                        // share this "MediaStream" object using RTCPeerConnection API
                    }, function (error) {
                        console.log('getScreenId error', error);
                        alert('No se pudo capturar su pantalla. Verifique que la extensión sea instalada https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk');
                    });
                });
//            getScreenId(function (error, sourceId, screen_constraints) {
//                navigator.mediaDevices.getUserMedia(screen_constraints).then(function (stream) {
//                    var video = document.querySelector('#js-video-myself');
//                    if ('srcObject' in video) {
//                        video.srcObject = stream;
//                    } else {
//                        video.src = window.URL.createObjectURL(stream);
//                    }
//                    localMediaStream = stream;
//                }).catch(function (error) {
//                    console.log("ERROR::: " + error);
//                });
//            });
            };
        };
        document.body.appendChild(js);
    }

    var called = null;
//        $share.on('click', function (e) {
    $share.addEventListener("click", function () {
        var js = document.createElement("script");
        js.src = "https://www.WebRTC-Experiment.com/getScreenId.js";
        js.onload = function () {
            getChromeExtensionStatus(function (status) {
                if (status === 'installed-enabled') {
                    var url = "";
                    url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + $myselfId_get + "&otherID=" + $partnerId_get + "&sharedScreen=true";
                    window.location = url;
                } else
                if (status === 'installed-disabled') {
                    alert('Tiene la extensión instalada pero está inhabilitada');
                } else {
                    alert('No se pudo capturar su pantalla. Verifique que la extensión sea instalada https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk');
                }
            });
        };
        document.body.appendChild(js);
    });

//        $open.on('click', function (e) {
    // create peer object
    var iceServers = getServers();
    var myselfId = $myselfId.value;
    peerClient = new Peer(myselfId, {
//                key: '0c3244yhqia4i'
        debug: 2,
        config: {'iceServers': iceServers}
    });
    // if peer connection is opened
    peerClient.on('open', function () {
        console.log('Connection start.');
        $peerId.innerHTML = peerClient.id;
        document.querySelector(".contain_no_connected").style.display = "flex";
    });
    peerClient.on('call', function (call) {
        // answer with my media stream
        called = call;
        call.answer(localMediaStream);
        // close current connection if exists
        if (currentPeerConnection) {
            currentPeerConnection.close();
        }
        // keep call as currentPeerConnection
        currentPeerConnection = call;
        // wait for partner's stream
        call.on('stream', function (stream) {
            if ('srcObject' in videoPartner) {
                videoPartner.srcObject = stream;
            } else {
                videoPartner.src = window.URL.createObjectURL(stream);
            }
            videoPartner.play();
            document.querySelector(".contain_waiting").style.display = "none";
            document.querySelector(".contain_no_connected").style.display = "none";
        });
        // if connection is closed
        call.on('close', function () {
            console.log('Connection is closed.');
        });
    });
    peerClient.on('error', function (err) {
        console.log(err);
        if (err.toString().indexOf("is taken") !== -1) {
            alert("El ID de usuario " + get.myID + " ya está en uso por otro usuario, no podrá conectarse hasta cerrar la anterior");
        }
//        else {
//            alert(err);
//        }
//        console.log(err);
    });
    peerClient.on('disconnected', function (id) {
        console.log('disconnected', id);
        peerClient.destroy();
        peerClient.disconnect();
        peerClient.reconnect();
    });
//    peerClient.destroy();
//    peerClient.disconnect();
//        $myselfId.setAttribute('disabled', 'disabled');
//        $partnerId.removeAttribute('disabled');
//        $connect.removeAttribute('disabled');
//        });

//        $connect.on('click', function (e) {
    $connect.addEventListener("click", function () {
        // if peerClient is not initialized
        if (!peerClient) {
            return;
        }
        // connect to partner
        var partnerId = $partnerId.value;
        var call = peerClient.call(partnerId, localMediaStream);
        // close current connection if exists
        if (currentPeerConnection) {
            currentPeerConnection.close();
        }
        // keep call as currentPeerConnection
        currentPeerConnection = call;
        // wait for partner's stream
        call.on('stream', function (stream) {
//                videoPartner.src = URL.createObjectURL(stream);
            videoPartner.srcObject = stream;
            videoPartner.play();
            document.querySelector(".contain_waiting").style.display = "none";
            document.querySelector(".contain_no_connected").style.display = "none";
        });
        // if connection is closed
        call.on('close', function () {
            console.log('Connection is closed.');
        });
        document.querySelector(".contain_no_connected").style.display = "none";
        document.querySelector(".contain_waiting").style.display = "flex";
    });

    function get() {
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
    }
    function stopScreenSharing() {
        addStreamStopListener(localMediaStream, function () {
            console.log('screen sharing is ended.');
            var url = "";
            url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + $myselfId_get + "&otherID=" + $partnerId_get;
            window.location = url;
        });
        function addStreamStopListener(stream, callback) {
            stream.addEventListener('ended', function () {
                console.log("ended");
                callback();
                callback = function () {};
            }, false);
            stream.addEventListener('inactive', function () {
                console.log("inactive");
                callback();
                callback = function () {};
            }, false);
            stream.getTracks().forEach(function (track) {
                track.addEventListener('ended', function () {
                    console.log("ended");
                    callback();
                    callback = function () {};
                }, false);
                track.addEventListener('inactive', function () {
                    console.log("inactive");
                    callback();
                    callback = function () {};
                }, false);
            });
        }
    }
    function getServers() {
        var iceServers = [];
        var moz = !!navigator.mozGetUserMedia;
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
        return iceServers;
    }
//    });

})(this);