var connect = {
    selfParent: this,
    debug: false,
    prepare: function (callback) {
        var self = this;
        if (typeof RTCMultiConnection === "undefined") {
            setTimeout(function () {
                self.prepare(callback);
            }, 2000);
            return false;
        }
        callback();
    },
    start: function () {
        var selfReal = this;
        var self = this.selfParent;
        var get = utils.get();

        self.statusTextOtherEnc.innerHTML = 'Init connection in js.';

        self.intervalSoundTimbrando = null;
        self.intervalVid = null;

        self.connection = new RTCMultiConnection();
//        self.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
        self.connection.socketURL = 'https://turn.gruponw.com:9001/';
//        self.connection.socketURL = 'http://localhost:9001/';
//        self.connection.socketURL = 'https://webrtc.loc:9001/';
        self.connection.enableLogs = false;
        self.connection.enableFileSharing = false;
        self.connection.autoCloseEntireSession = false;

//        self.connection.session.oneway = true;    // one-way
//        self.connection.session.broadcast = true; // one-to-many
//        self.connection.direction = 'one-way';
//        self.connection.direction = 'one-to-many';

        self.connection.socketOptions = {
            'force new connection': true, // For SocketIO version < 1.0
            'forceNew': true, // For SocketIO version >= 1.0
            'transport': 'polling' // fixing transport:unknown issues
        };

        self.connection.socketOptions.resource = 'custom';
        self.connection.socketOptions.transport = 'polling';
        self.connection.socketOptions['try multiple transports'] = false;
        self.connection.socketOptions.secure = true;
        self.connection.socketOptions.port = '9001';
        self.connection.socketOptions['max reconnection attempts'] = 100;


//        self.connection.trickleIce = false;
        self.connection.socketMessageEvent = self.room;

//        setInterval(function () {
//            self.sendMessagePeer({message: "Hola"});
////            self.addMessage({text: "Hola", type: "auto", name: "auto", cleanHTML: false});
//        }, 5000);

        window.addEventListener('focus', function () {
            self.connection.focus = true;
            self.sendMessagePeer({message: "focusIn"});
        });

        window.addEventListener('blur', function () {
            self.connection.focus = false;
            self.sendMessagePeer({message: "focusOut"});
        });


        document.addEventListener("visibilitychange", function () {
//            console.log("document.visibilityState", document.visibilityState);
//            console.log("self.connection.focus", self.connection.focus);
        });

//        setTimeout(function () {
//            console.log("AAAAAAAAAAA document.visibilityState", document.visibilityState);
//            console.log("BBBBBBBBBBB document.hidden", document.hidden);
//            console.log("CCCCCCCCCCC self.connection.focus", self.connection.focus);
//        }, 5000);

        self.connection.channel = self.room;

        if (self.video || self.audio) {
            self.connection.codecs.video = 'VP8';
            self.connection.codecs.audio = 'G722';
            self.connection.bandwidth = {
//                audio: 192,
//                video: 512,
//                screen: 1024
                audio: 128,
                video: 1024,
                screen: 1024
            };
        }

        self.connection.socketCustomEvent = 'private-secure-chat';

        if (self.onlyChat) {
//            self.connection.dontCaptureUserMedia = true;
//            self.connection.dontAttachStream = true;
//            self.connection.direction = 'one-to-one';
//            self.connection.maxParticipantsAllowed = 1;
        } else {
//            self.connection.direction = 'many-to-many';
        }
        self.connection.direction = 'many-to-many';
//        self.connection.direction = 'many-to-one';
//        self.connection.direction = 'one-to-many';

        if (get.sharedScreen === "true" || self.screen === true) {
            self.screen = true;
            self.video = false;
        }

        self.connection.session = {
            onlyData: self.onlyChat,
            version: self.version,
            screen: self.screen,
            audio: self.audio,
            video: self.video,
            data: true,
            streamCallback: function (screen) {
                addStreamStopListener(screen, function () {
                    console.log("screen", screen)
                    self.connection.send({
                        screebEnded: true,
                        streamid: screen.id
                    });

                    var video = document.getElementById(screen.id);
                    if (video && video.parentNode) {
                        video.parentNode.removeChild(video);
                    }
                });
            }
        };

        self.connection.mediaConstraints = {
            video: self.video,
            audio: self.video
        };

//        self.connection.userid = self.connection.token();

        var fullName = self.myselfId_get_no_clean;
        if (selfReal.debug) {
            console.log("self.myselfId_get_no_clean", self.myselfId_get_no_clean)
        }
        if (typeof self.myselfId_get_no_clean === "undefined" || self.myselfId_get_no_clean === null || self.myselfId_get_no_clean === "") {
            fullName = self.connection.userid;
            self.myselfId_get_clean = utils.cleanUserNwC(self.connection.userid);
            self.myselfId_get_no_clean = self.connection.userid;
        }
        self.connection.extra = {
            video: self.video,
            audio: self.audio,
            screen: self.screen,
//            id_user: self.connection.userid,
            fullName: fullName,
            joinedAt: (new Date).toISOString()
        };

        self.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: self.audio,
            OfferToReceiveVideo: self.video
        };

        // Set up audio
        self.connection.mediaConstraints.audio = self.audio;
        self.connection.session.audio = self.audio;

        // Set up video
        if (self.video) {
            self.connection.session.video = true;
        } else {
            self.connection.session.video = false;
            self.connection.mediaConstraints.video = false;
        }


        if (self.connection.DetectRTC.isWebRTCSupported === false) {
            alert('Please try a WebRTC compatible web browser e.g. Chrome, Firefox or Opera.');
        }

        function initHark(args) {
            if (!window.hark) {
                throw 'Please link hark.js';
                return;
            }

            var connection = args.connection;
            var streamedObject = args.streamedObject;
            var stream = args.stream;

            var options = {};
            var speechEvents = hark(stream, options);

            speechEvents.on('speaking', function () {
                connection.onspeaking(streamedObject);
            });

            speechEvents.on('stopped_speaking', function () {
                connection.onsilence(streamedObject);
            });

            speechEvents.on('volume_change', function (volume, threshold) {
                streamedObject.volume = volume;
                streamedObject.threshold = threshold;
                connection.onvolumechange(streamedObject);
            });
        }

//        self.connection.videosContainer = document.getElementById('videos-container');

        self.connection.autoCreateMediaElement = true;
        self.connection.onstream = function (event) {
            var isScreen = event.isScreen || event.stream.isScreen;
            console.log("fdsafa");
            if (selfReal.debug) {
                console.log("onstream isScreen", isScreen);
                console.log("onstream event.stream.isVideo", event.stream.isVideo);
                console.log("self.video", self.video);
                console.log("onstream event.stream.isAudio", event.stream.isAudio);
                console.log("self.audio", self.audio);
            }
            if (event.type === "local") {
                initHark({
                    stream: event.stream,
                    streamedObject: event,
                    connection: self.connection
                });
            }

            if (isScreen === true) {
                handleScreen(event);
            }
//            if (event.stream.isVideo === true && self.video === true) {
            if (event.stream.isVideo) {
                handleCamera(event, "camera");
            }
//            if (event.stream.isAudio && self.audio === true) {
            if (event.stream.isAudio) {
                handleCamera(event, "audio");
//                handleAudio(event);
            }
        };

        function handleScreen(event) {
            if (selfReal.debug)
                console.log("handleScreen", event);
            var screenViewer = document.querySelector('#screen-viewer');
            screenViewer.srcObject = event.stream;
        }

        var count = 1;
        function handleCamera(event, mode) {
            if (selfReal.debug) {
                console.log("handleCamera", event);
                console.log("handleCamera mode", mode);
            }
            var classMode = "div_stream_audio";
            if (mode === "camera") {
                classMode = "div_stream_camera";
                if (event.mediaElement) {
                    event.mediaElement.muted = true;
                    delete event.mediaElement;
                }
            }
            var myVideoContainer = document.querySelector('.containMyVideo');
            var classVideo = "js-video-partner";
            var othersVideosContainer = document.querySelector('.containVideoOther');
            var videosContainer = othersVideosContainer;
            if (event.type === "local") {
                videosContainer = myVideoContainer;
                classVideo = "js-video-myself";
            }

            var id_user = event.userid;
            if (event.type !== "local") {
                if (typeof event.extra !== "undefined") {
                    if (typeof event.extra.fullName !== "undefined") {
                        id_user = utils.cleanUserNwC(event.extra.fullName);
                    }
                }
            } else {
                self.localMediaStream = event.stream;
            }
            if (event.type !== "local") {
                var da = document.querySelector(".video_stream_contain_" + id_user);
                if (da) {
                    da.remove();
                }
            }
            if (selfReal.debug)
                console.log("VIDEOOOOOOOOOOOOOOOOOOOO", event);
            var videoContain = document.createElement('div');
            videoContain.className = classVideo + "_contain video_stream_contain video_stream_contain_" + count + " video_stream_contain_" + event.userid + " video_stream_contain_" + id_user + " " + classMode;
            videosContainer.appendChild(videoContain);

            if (mode === "camera") {
                var video = document.createElement('video');
                video.className = classVideo + " video_stream video_stream_" + count + " video_stream_" + id_user;
                video.id = event.streamid;
                video.autoplay = true;
                video.controls = false;
                video.srcObject = event.stream;
                videoContain.appendChild(video);

                if (event.type === "local") {
                    var m = {};
                    m.tipo = "load_my_camera_ringow";
                    m.room = self.room;
                    m.says = self.myselfId_get_clean;
                    window.parent.postMessage(m, '*');
                }

            }
            if (event.type !== "local") {
                var name = "";
                if (typeof event.extra !== "undefined") {
                    if (typeof event.extra.fullName !== "undefined") {
                        name = " <span class='nameVideoUser_span nameVideoUser_name'>" + event.extra.fullName + "</span>";
                        if (typeof event.extra.video !== "undefined") {
                            var iconVideo = '<img src="img/videocam_off.png" class="video_off_img_user">';
                            if (event.extra.video) {
                                iconVideo = '<img src="img/videocam_on.png" class="video_on_img_user">';
                            }
                            name += " <span class='nameVideoUser_span nameVideoUser_video'>" + iconVideo + "</span>";
                        }
                        if (typeof event.extra.audio !== "undefined") {
                            var iconAudio = '<img src="img/mic_off.png" class="audio_off_img_user">';
                            if (event.extra.audio) {
                                iconAudio = '<img src="img/mic_on.png" class="audio_on_img_user">';
                            }
                            name += " <span class='nameVideoUser_span nameVideoUser_audio'>" + iconAudio + "</span>";
                        }
                        if (typeof event.extra.onlyData !== "undefined") {
                            name += " <span class='nameVideoUser_span nameVideoUser_onlydata'>onlyData: " + event.extra.onlyData + "</span>";
                        }
                        if (typeof event.extra.version !== "undefined") {
                            name += " <span class='nameVideoUser_span nameVideoUser_version'>v:" + event.extra.version + "</span>";
                        }
                    }
                }
                var videoName = document.createElement("div");
                videoName.className = "nameVideoUser";
                videoName.innerHTML = name;
                videoContain.appendChild(videoName);

                var videoNameCenter = document.createElement("div");
                videoNameCenter.className = "videoNameCenter";
                videoNameCenter.innerHTML = "<span class='videoNameCenter_span'>A</span>";
                videoContain.appendChild(videoNameCenter);

                var spanMaxMin = document.createElement("span");
                spanMaxMin.className = "nameVideoUser_span nameVideoUser_maximice nameVideoUser_maximice_" + event.userid;
                spanMaxMin.innerHTML = "<img src='img/fullscreen.png' />";
                spanMaxMin.data = {
                    userid: event.userid,
                    videoContain: videoContain
                };
                spanMaxMin.onclick = function () {
                    var data = this.data;
                    var userid = data.userid;
                    var videoContain = data.videoContain;

                    this.style.display = "none";
                    var btn = document.querySelector(".nameVideoUser_minimice_" + userid);
                    if (btn) {
                        btn.style.display = "inline-block";
                    }

                    var d = document.querySelectorAll(".js-video-partner_contain");
                    for (var i = 0; i < d.length; i++) {
                        var da = d[i];
                        utils.removeClass(da, "videoContain_maximiced", true);
                        utils.addClass(da, "videoContain_minimiced");
                    }

                    utils.removeClass(videoContain, "videoContain_minimiced", true);
                    utils.addClass(videoContain, "videoContain_maximiced");
                };
                videoName.appendChild(spanMaxMin);


                var spanMaxMin = document.createElement("span");
                spanMaxMin.className = "nameVideoUser_span nameVideoUser_minimice nameVideoUser_minimice_" + event.userid;
                spanMaxMin.innerHTML = "<img src='img/fullscreen_exit.png' />";
                spanMaxMin.data = {
                    userid: event.userid,
                    videoContain: videoContain
                };
                spanMaxMin.onclick = function () {
                    var data = this.data;
                    var userid = data.userid;

                    this.style.display = "none";
                    var btn = document.querySelector(".nameVideoUser_maximice_" + userid);
                    if (btn) {
                        btn.style.display = "inline-block";
                    }

                    var d = document.querySelectorAll(".js-video-partner_contain");
                    for (var i = 0; i < d.length; i++) {
                        var da = d[i];
                        utils.removeClass(da, "videoContain_maximiced", true);
                        utils.removeClass(da, "videoContain_minimiced", true);
                    }
                };
                videoName.appendChild(spanMaxMin);
            }

            if (mode === "camera") {
                if (event.type === "local") {
                    video.muted = true;
                    self.videoMyself = video;
                } else {
                    video.muted = false;
                    if (selfReal.debug)
                        console.log("New video");
                }
            }
            count++;
            sizesCameras();
        }

        function sizesCameras() {
            if (self.onlyChat) {
                return;
            }
            var alls = document.querySelectorAll(".js-video-partner_contain");
            if (document.querySelector(".countParticipants")) {
                document.querySelector(".countParticipants").innerHTML = alls.length;
            }
            var height = "100%";
            var width = "100%";
            if (alls.length > 0) {
                utils.addClass(document.querySelector(".js-video-myself_contain"), "js-video-myself_contain-mini", true);
            } else {
                utils.removeClass(".js-video-myself_contain", "js-video-myself_contain-mini");
            }
            if (alls.length >= 2 && alls.length < 3) {
                height = "100%";
                width = "50%";
            } else
            if (alls.length >= 3 && alls.length <= 4) {
                height = "50%";
                width = "50%";
            } else
            if (alls.length >= 5 && alls.length <= 6) {
                height = "50%";
                width = "33%";
            } else
            if (alls.length >= 7 && alls.length <= 8) {
                height = "50%";
                width = "25%";
            } else
            if (alls.length >= 9 && alls.length <= 12) {
                height = "33%";
                width = "25%";
            } else
            if (alls.length >= 13 && alls.length <= 15) {
                height = "33%";
                width = "20%";
            } else
            if (alls.length >= 16 && alls.length <= 19) {
                height = "25%";
                width = "20%";
            }
            for (var i = 0; i < alls.length; i++) {
                var vid = alls[i];
                vid.style.width = width;
                vid.style.height = height;
            }
        }

        function handleAudio(event) {
            if (selfReal.debug)
                console.log("handleAudio event", event);
//            utils.addClass(self.containVideoOther, "containVideoOtherAudio");
//            self.audioIsCalling.style = "display: block;";
//            if (event.type === "local") {
//                self.audioIsCalling.innerHTML = "Llamando...";
//                utils.playSound("audio/timbrando.mp3", "timbrando_mp3");
//                self.intervalSoundTimbrando = setInterval(function () {
//                    utils.playSound("audio/timbrando.mp3", "timbrando_mp3");
//                }, 5000);
//            } else {
//                self.audioIsCalling.innerHTML = "En línea";
//                clearInterval(self.intervalSoundTimbrando);
//                if (document.querySelector(".timbrando_mp3")) {
//                    document.querySelector(".timbrando_mp3").remove();
//                }
//            }
        }

//        self.connection.onspeaking = function (e) {
//            console.log("self.connection.onspeaking", e);
//            if (self.connection.numberOfConnectedUsers > 0) {
//                self.connection.send({
//                    streamid: e.streamid,
//                    speaking: true
//                });
//            }
//            e.mediaElement.style.border = '3px dotted red';
//        };
//        self.connection.onsilence = function (e) {
        // "numberOfConnectedUsers" is checked because we are using data channels
        // you shouldn't use this block if you're using "sendCustomMessage"
//            if (self.connection.numberOfConnectedUsers > 0) {
//                self.connection.send({
//                    streamid: e.streamid,
//                    silence: true
//                });
//            }
//            e.mediaElement.style.border = '1px solid rgb(0, 0, 0)';
//        };

        self.connection.mediaConstraints.audio = {
            mandatory: {},
            optional: [{
                    echoCancellation: true
                }]
        };

        self.connection.onspeaking = function (event) {
//            console.log("self.connection.onspeaking", event);
//            var d = document.querySelector(".video_stream_" + event.userid);
//            if (d) {
//                utils.addClass(d, "videoSpeaking");
//            }
            self.sendMessagePeer({message: "speaking"});

        };

        self.connection.onsilence = function (event) {
//            console.log("self.connection.onsilence", event);
//            var d = document.querySelector(".video_stream_" + event.userid);
//            if (d) {
//                utils.removeClass(d, "videoSpeaking", true);
//            }
            self.sendMessagePeer({message: "silence"});
        };

        self.connection.onvolumechange = function (event) {
//            console.log("onvolumechange event", event);
//            var d = document.querySelector(".video_stream_" + event.userid);
//            if (d) {
//                d.style.outlineWidth = event.volume;
//            }
//            event.mediaElement.style.borderWidth = event.volume;
        };

        self.connection.onmute = function (event) {
            if (selfReal.debug)
                console.log("self.connection.onmute", event);
            if (event.type !== "local") {
                if (event.session.video) {
                    document.querySelector(".video_stream_contain_" + event.userid + " .nameVideoUser_video").innerHTML = '<img src="img/videocam_off.png" class="video_off_img_user">';
                } else {
                    document.querySelector(".video_stream_contain_" + event.userid + " .nameVideoUser_audio").innerHTML = '<img src="img/mic_off.png" class="audio_off_img_user">';
                }
            }
//            if (event.stream.pause) {
//                // for audio-streams
//                // ask hark.js to resume looping and checking for voice activity
//                event.stream.pause();
//            }
        };

        self.connection.onunmute = function (event) {
            if (selfReal.debug)
                console.log("self.connection.onunmute", event);
            if (event.type !== "local") {
                if (event.session.video) {
                    document.querySelector(".video_stream_contain_" + event.userid + " .nameVideoUser_video").innerHTML = '<img src="img/videocam_on.png" class="video_on_img_user">';
                } else {
                    document.querySelector(".video_stream_contain_" + event.userid + " .nameVideoUser_audio").innerHTML = '<img src="img/mic_on.png" class="audio_on_img_user">';
                }
            }
//            if (event.stream.resume) {
//                // for audio-streams
//                // ask hark.js to stop looping and checking for voice activity
//                event.stream.resume();
//            }
        };

        self.connection.onstreamended = function (event) {
            var isScreen = false;
            sizesCameras();
            if (typeof event.stream.idInstance !== "undefined") {
                var id_instance = JSON.parse(event.stream.idInstance);
                isScreen = id_instance.isScreen;
            }
            if (selfReal.debug) {

                console.log("onstreamended isScreen", isScreen);
                console.log("onstreamended", event);
                console.log("onstreamended", event.userid);
            }
//            event.stream.stop();
            var id_user = event.userid;
            if (event.type !== "local") {
                if (typeof event.extra !== "undefined") {
                    if (typeof event.extra.fullName !== "undefined") {
                        id_user = utils.cleanUserNwC(event.extra.fullName);
                    }
                }
            }
//            var mediaElement = document.getElementById(event.streamid);
//            if (mediaElement) {
//                mediaElement.parentNode.removeChild(mediaElement);
//            }
            if (event.type === "local") {
                if (isScreen) {
                    var mediaElement = document.querySelectorAll(".video_stream_contain_" + id_user);
                    if (mediaElement[1]) {
                        mediaElement[1].remove();
                    }
                }
            }
            if (event.type !== "local") {
                var mediaElement = document.querySelector(".video_stream_contain_" + id_user);
                if (mediaElement) {
                    mediaElement.remove();
                }
            }
            if (event.type === "local") {
                self.connection.replaceTrack({
                    audio: self.audio,
                    video: self.video,
                    data: true
                });
            }
        };

        window.ignoreBeforeUnload = true;
        self.connection.onbeforeunload = function () {
            alert("onbeforeunload");
        };

        self.connection.onMediaError = function (e) {
            console.log("onMediaError", e);
//            alert("onMediaError", e);
            if (e.message === 'Concurrent mic process limit.') {
                if (DetectRTC.audioInputDevices.length <= 1) {
                    alert('Please select external microphone. Check github issue number 483.');
                    return;
                }
                var secondaryMic = DetectRTC.audioInputDevices[1].deviceId;
                self.connection.mediaConstraints.audio = {
                    deviceId: secondaryMic
                };
                self.connection.join(self.connection.sessionid);
            }
        };

        //detect 2G
        if (navigator.connection && navigator.connection.type === 'cellular' && navigator.connection.downlinkMax <= 0.115) {
            alert('2G is not supported. Please use a better internet service.');
        }

        var alreadyAllowed = {};
        self.connection.onNewParticipant = function (participantId, userPreferences) {
//            if (alreadyAllowed[participantId]) {
//                self.connection.addParticipationRequest(participantId, userPreferences);
//                return;
//            }
//            var message = participantId + ' is trying to join your room. Confirm to accept his request.';
//            if (window.confirm(message)) {
//                self.connection.addParticipationRequest(participantId, userPreferences);
//            }
            if (selfReal.debug) {

                console.log("self.connection.onNewParticipant participantId", participantId);
                console.log("self.connection.onNewParticipant userPreferences", userPreferences);
            }
            // if OfferToReceiveAudio/OfferToReceiveVideo should be enabled for specific users
            //si yo estoy en chat y el usuario también
            if (userPreferences.isDataOnly === true) {
                userPreferences.localPeerSdpConstraints.OfferToReceiveAudio = false;
                userPreferences.localPeerSdpConstraints.OfferToReceiveVideo = false;
                userPreferences.dontAttachStream = false;
                userPreferences.dontGetRemoteStream = false;
            } else {
                userPreferences.localPeerSdpConstraints.OfferToReceiveAudio = true;
                userPreferences.localPeerSdpConstraints.OfferToReceiveVideo = true;
            }
            // below line must be included. Above all lines are optional.
            // if below line is NOT included; "join-request" will be considered rejected.
            self.connection.acceptParticipationRequest(participantId, userPreferences);
        };

        self.connection.onopen = function (event) {
            if (selfReal.debug) {
                console.log("onopen", event);
            }
            sizesCameras();
            clearInterval(self.intervalVid);
            self.intervalVid = setInterval(function () {
                sizesCameras();
            }, 5000);
            var remoteUserId = event.userid;
            var remoteUserFullName = event.userid;
            if (typeof event.extra !== "undefined") {
                if (typeof event.extra.fullName !== "undefined") {
                    remoteUserFullName = event.extra.fullName;
                }
            }
            var text = remoteUserFullName + " ha ingresado";
//                self.sendMessagePeer({message: text});
            self.addMessage({text: text, type: "auto", name: "auto", cleanHTML: false});

            self.statusOnline = "online";
            self.statusTextOtherEnc.innerHTML = 'Connection open.';
            utils.addClass(self.statusOtherEnc, "statusOtherEnc_online");
        };

        self.connection.onleave = function (event) {
            var remoteUserId = event.userid;
            var remoteUserFullName = event.userid;
            if (typeof event.extra !== "undefined") {
                if (typeof event.extra.fullName !== "undefined") {
                    remoteUserFullName = event.extra.fullName;
                }
            }
            var text = remoteUserFullName + " ha salido";
//                self.sendMessagePeer({message: text});
            self.addMessage({text: text, type: "auto", name: "auto", cleanHTML: false});
            if (selfReal.debug)
                console.log(remoteUserFullName + ' left you.');
            var d = document.querySelector(".video_stream_contain_" + event.userid);
            if (d) {
                d.remove();
            }
        };


        self.connection.onclose = function (event) {
            if (selfReal.debug)
                console.log("onclose", event);
            sizesCameras();
            closeUserAndReconnect();
        };

        function closeUserAndReconnect() {
            self.statusOnline = "offline";
            self.statusTextOtherEnc.innerHTML = 'Connection close';
            utils.removeClass(self.statusOtherEnc, "statusOtherEnc_online", true);
        }

        self.connection.onmessage = function (event) {
            if (selfReal.debug)
                console.log("self.connection.onmessage event", event);
            if (event.data.screebEnded === true) {
                var video = document.getElementById(event.data.streamid);
                if (video && video.parentNode) {
                    video.parentNode.removeChild(video);
                }
            }
            self.receiveMessageOther(event);
        };

        self.connection.focus = true;

//        self.connection.onleave = self.connection.streamended = self.connection.onclose = function (event) {
//            self.connection.onUserStatusChanged({
//                userid: event.userid,
//                extra: event.extra,
//                status: 'offline'
//            });
//        };

        self.connection.onUserStatusChanged = function (status) {
            if (selfReal.debug)
                console.log("onUserStatusChanged", status);
            if (status.status === "offline") {
                closeUserAndReconnect();
            }
//            self.statusTextOtherEnc.innerHTML = 'onUserStatusChanged.';
//            document.querySelector(".video_stream_" + status.userid).src = status === 'online' ? 'online.gif' : 'offline.gif';
        };

        self.connection.validateLowBandWidth = function () {
            if (self.connection.isLowBandwidth === true) {
//                alert("Su banda ancha es muy baja, puede presentar problemas de conexión. Conéctese a una red más velóz.");
//                var BandwidthHandler = self.connection.BandwidthHandler;
//                self.connection.bandwidth = {
//                    audio: 128,
//                    video: 256,
//                    screen: 300
//                };
//                self.connection.processSdp = function (sdp) {
//                    sdp = BandwidthHandler.setApplicationSpecificBandwidth(sdp, self.connection.bandwidth, !!self.connection.session.screen);
//                    sdp = BandwidthHandler.setVideoBitrates(sdp, {
//                        min: self.connection.bandwidth.video,
//                        max: self.connection.bandwidth.video
//                    });
//                    sdp = BandwidthHandler.setOpusAttributes(sdp);
//                    sdp = BandwidthHandler.setOpusAttributes(sdp, {
//                        'stereo': 1,
//                        //'sprop-stereo': 1,
//                        'maxaveragebitrate': self.connection.bandwidth.audio * 1000 * 8,
//                        'maxplaybackrate': self.connection.bandwidth.audio * 1000 * 8,
//                        //'cbr': 1,
//                        //'useinbandfec': 1,
//                        // 'usedtx': 1,
//                        'maxptime': 3
//                    });
//                    return sdp;
//                };
            }
        };

        self.connection.onEntireSessionClosed = function (event) {
            console.info('Entire session is closed: ', event.sessionid, event.extra);
        };

        self.connection.onReConnecting = function (event) {
            self.statusTextOtherEnc.innerHTML = 'ReConnecting with', event.userid, '...';
            console.info('ReConnecting with', event.userid, '...');
        };

        self.connection.onPeerStateChanged = function (state) {
            if (state.iceConnectionState.search(/closed|failed/gi) !== -1) {
                console.error('Peer connection is closed between you & ', state.userid, state.extra, 'state:', state.iceConnectionState);
            }
        };

        self.connection.onUserIdAlreadyTaken = function (useridAlreadyTaken, yourNewUserId) {
            console.warn('Userid already taken.', useridAlreadyTaken, 'Your new userid:', yourNewUserId);
            self.connection.userid = self.connection.token();
            self.connection.join(self.connection.sessionid);
        };

        if (selfReal.debug)
            console.log("self.connection.version", self.connection.version);

        self.connection.onRoomFull = function (roomid) {
            console.warn(roomid, 'is full.');
            self.statusTextOtherEnc.innerHTML = roomid + ' is full.';
        };

        var iceServers = [];
        iceServers.push({
            url: 'turn:turn.gruponw.com:3478',
            username: 'andresf',
            credential: 'padre08'
        });
        iceServers.push({
            url: 'turn:turn2.gruponw.com:3478',
            username: 'andresf',
            credential: 'padre08'
        });
        iceServers.push({
            'urls': [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun.l.google.com:19302?transport=udp'
            ]
        });
//        iceServers.push({
//            url: 'stun1.l.google.com:19302'
//        });
//        iceServers.push({
//            url: 'stun2.l.google.com:19302'
//        });
//        iceServers.push({
//            url: 'stun3.l.google.com:19302'
//        });
//        iceServers.push({
//            url: 'stun.stunprotocol.org:3478'
//        });
        self.connection.iceServers = iceServers;

//        self.connection.dontCaptureUserMedia = true;
//        self.connection.attachStreams.push(videoAndScreenMixer.getMixedStream());

        if (selfReal.debug)
            console.log("self.room", self.room);

        self.intervalCheckSession = null;
        self.connection.checkSession = function () {
            if (selfReal.debug)
                console.log("checkSession");
            self.statusTextOtherEnc.innerHTML = 'checkSession';
//            clearInterval(self.intervalCheckSession);
            //INICIA CONEXIÓN!!!
//            self.connection.openOrJoin(self.room);
//            self.connection.openOrJoin('room-id', function (isRoomCreated, roomid, error) {
//                console.log("isRoomCreated", isRoomCreated);
//                if (self.connection.isInitiator === true) {
//                    console.log("you opened the room");
//                } else {
//                    console.log("you joined it");
//                }
//            });

//            self.connection.renegotiate();

            self.connection.checkPresence(self.room, function (isRoomExist, roomid) {
                self.room = roomid;
//                console.log("isRoomExist", isRoomExist);
//                clearInterval(self.intervalCheckSessionNoLive);
//                clearInterval(self.intervalCheckSession);
                if (isRoomExist === true) {
                    joinTheRoom();
                } else {
                    openTheRoom();
                }

                self.sendMessagePeer({message: "senal_de_vida_online"});

                if (!self.is_group) {
                    self.intervalCheckSession = setInterval(function () {
                        self.sendMessagePeer({message: "senal_de_vida_online"});
//                    self.connection.checkSession();
                    }, 5000);
                }
            });
        };

        function openTheRoom() {
            if (selfReal.debug)
                console.log("Initiliazing the room");
//            self.connection.open(roomid);
            self.connection.open(self.room, function (isRoomOpened, roomid, error) {
                if (error) {
                    self.statusTextOtherEnc.innerHTML = "ERROR IN OPEN: " + error;
                    self.connection.checkSession();
                    console.log('error created the room.', error);
                }
                if (isRoomOpened === true) {
                    self.statusTextOtherEnc.innerHTML = 'Successfully created the room.';
                    if (selfReal.debug)
                        console.log('Successfully created the room.');
//                    joinTheRoom();
                }
            });
        }

        function joinTheRoom() {
            if (selfReal.debug)
                console.log("Joining the room");
//            self.connection.join(roomid);
            self.connection.join(self.room, function (isJoined, roomid, error) {
                if (isJoined === false) {
                    if (selfReal.debug)
                        console.log("ERROR IN JOIN: " + error); // maybe room doesn't exist or room is full or password is invalid
                    self.statusTextOtherEnc.innerHTML = "ERROR IN JOIN: " + error;
                    self.connection.checkSession();
                } else {
                    self.statusTextOtherEnc.innerHTML = 'Successfully joined the room.';
                    if (selfReal.debug)
                        console.log('Successfully joined the room.');
                }
            });
        }

        function getListDevices() {
            if (self.audio && self.containConfiAudio) {
                self.connection.DetectRTC.audioInputDevices.forEach(function (device) {
                    var option = document.createElement('option');
                    // this is what people see
                    option.innerHTML = device.label;
                    // but this is what inernally used to select relevant device
                    option.value = device.id;
                    // append to your choice
                    self.containConfiAudio.appendChild(option);
                });
            }

            if (self.video && self.containConfiVideo) {
                // you can access all cameras using "DetectRTC.videoInputDevices"
                self.connection.DetectRTC.videoInputDevices.forEach(function (device) {
                    var option = document.createElement('option');
                    // this is what people see
                    option.innerHTML = device.label;
                    // but this is what inernally used to select relevant device
                    option.value = device.id;
                    // append to your choice
                    self.containConfiVideo.appendChild(option);
                });
            }
        }

        self.connection.initialCall = function () {
            self.connection.connectSocket(function () {
//                console.log("self.connection", self.connection);
//                console.info('Successfully connected to socket.io server.');
                self.statusTextOtherEnc.innerHTML = 'Successfully connected to socket.io server.';
//            self.connection.socket.emit(self.connection.socketCustomEvent, 'anyone-in-the-house?');
//            self.connection.socket.on(self.connection.socketCustomEvent, function (message) {
//                if (message === 'anyone-in-the-house?') {
//                    self.connection.socket.emit(self.connection.socketCustomEvent, {
//                        joinMe: self.connection.userid // share room-id so they can join
//                    });
//                    return;
//                }
//                if (message.joinMe) {
//                    self.connection.join(message.joinMe);
//                }
//            });
//            self.connection.open(self.connection.userid);
//            self.connection.openOrJoin(self.room);
                if (self.video || self.audio) {
                    self.connection.DetectRTC.load(function () {


                        getListDevices();

                        if (self.audio) {
                            if (self.connection.DetectRTC.hasMicrophone === false) {
                                alert('Please attach a microphone device.');
                                self.connection.mediaConstraints.audio = false;
                                self.connection.session.audio = false;
                                self.audio = false;
                            }
                        }
                        if (self.video) {
                            if (self.connection.DetectRTC.hasWebcam === false) {
                                alert('Please attach a camera device.');
                                self.connection.mediaConstraints.video = false;
                                self.connection.session.video = false;
                                self.video = false;
                            }
                        }
                        if (self.connection.DetectRTC.hasSpeakers === false) {
                            alert('Please attach a speaker device. You will unable to hear the incoming audios.');
                        }
                        self.connection.checkSession();
                    });
                } else {
                    self.connection.checkSession();
                }
            });
        };

        self.connection.validateLowBandWidth();
        self.connection.initialCall();

//        self.connection.openOrJoin();
//        self.connection.checkSession();

//        setInterval(function () {
//            console.log("self.connection.isOnline", self.connection.isOnline);
//        }, 5000);

        self.removeLoading();
        return self.connection;
    }
};