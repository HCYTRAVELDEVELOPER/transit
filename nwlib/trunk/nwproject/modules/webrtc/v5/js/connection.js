var connect = {
    selfParent: this,
    isRoomJoined: false,
    isConnected: false,
    countPresence: 0,
    countCantIn: 0,
    isModerator: false,
    setModerator: function (moderator) {
        console.log("MODERATOR!");
        console.log(moderator);
        this.isModerator = moderator;
    },
    start: function (room) {
        var self = this.selfParent;
        var get = utils.get();
        self.room = room;
        self.isRoomJoined = false;
        self.isConnected = false;
        self.countPresence = 0;
        self.countCantIn = 0;
        console.log("Init connection in js");
        this.selfParent.statusTextOtherEnc.innerHTML = 'Init connection in js.';
        self.intervalSoundTimbrando = null;
        self.connection = new RTCMultiConnection();
        self.connection.socketURL = 'https://turn.gruponw.com:9001/';
        self.connection.enableLogs = false;
        self.connection.enableFileSharing = false;
        self.connection.autoCloseEntireSession = true;
        if (get.sharedScreen === "true" || self.screen === true) {
            self.screen = true;
            self.video = false;
        }

        self.connection.session = {
            screen: self.screen,
            audio: self.audio,
            video: self.video,
            data: true,
            streamCallback: function (screen) {
                addStreamStopListener(screen, function () {
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
        self.connection.extra = {
            fullName: self.myselfId_get_no_clean,
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

//        self.connection.videosContainer = document.getElementById('videos-container');

        self.connection.autoCreateMediaElement = true;

        var iceServers = [];
        iceServers.push({
            url: 'turn:turn.gruponw.com:3478',
            username: 'andresf',
            credential: 'padre08'
        });
        self.connection.iceServers = iceServers;
//        self.connection.dontCaptureUserMedia = true;
//        self.connection.attachStreams.push(videoAndScreenMixer.getMixedStream());

        console.log("self.room", self.room);
        self.intervalCheckSession = null;
//        self.connection.checkSession = function () {
//            console.log("checkSession");
//            self.statusTextOtherEnc.innerHTML = 'checkSession';
//            clearTimeout(self.intervalCheckSession);
//            //INICIA CONEXIÓN!!!
////            self.connection.openOrJoin(self.room);
////            self.connection.openOrJoin('room-id', function (isRoomCreated, roomid, error) {
////                console.log("isRoomCreated", isRoomCreated);
////                if (self.connection.isInitiator === true) {
////                    console.log("you opened the room");
////                } else {
////                    console.log("you joined it");
////                }
////            });
////            return;
//
//            self.connection.checkPresence(self.room, function (isRoomExist, roomid) {
//
//                console.log("PRESENCIA");
//                console.log("isRoomExist", isRoomExist);
//                clearTimeout(self.intervalCheckSession);
//                if (isRoomExist === true) {
//                    joinTheRoom();
//                } else {
//                    openTheRoom();
//                }
//            });
//        };
        self.connection.channel = self.room;
//        self.connection.socketCustomEvent = 'private-secure-chat';

        var publicRoomIdentifier = "nwproject-conference";

        self.connection.publicRoomIdentifier = publicRoomIdentifier;
        self.connection.socketMessageEvent = publicRoomIdentifier;

        self.connection.onstream = function (event) {

            var isScreen = event.isScreen || event.stream.isScreen;
            console.log("onstream isScreen", isScreen);
            console.log("onstream event.stream.isVideo", event.stream.isVideo);
            console.log("onstream event.stream.isAudio", event.stream.isAudio);
            if (isScreen === true) {
                handleScreen(event);
            }
            if (event.stream.isVideo === true && self.video === true) {
                handleCamera(event);
            }
            if (event.stream.isAudio && self.audio === true) {
                // it is Audio_Only stream
                handleAudio(event);
            }
        };
        self.connection.onstreamended = function (event) {
            console.log("onstreamended", event);
            var mediaElement = document.getElementById(event.streamid);
            if (mediaElement) {
                mediaElement.parentNode.removeChild(mediaElement);
            }

            if (event.type === "local") {
                self.connection.replaceTrack({
                    audio: self.audio,
                    video: self.video,
                    data: true
                });
            }
//            var mediaElement = document.querySelector(".video_stream_" + event.userid);
//            if (mediaElement) {
//                mediaElement.parentNode.removeChild(mediaElement);
//            }

        };
        self.connection.onMediaError = function (e) {
            console.log("onMediaError", e);
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

        self.connection.onopen = function (event) {
            self.statusOnline = "online";
            self.statusTextOtherEnc.innerHTML = 'Connection open.';
            console.log("onopen", event);
            utils.addClass(self.statusOtherEnc, "statusOtherEnc_online");
            self.isConnected = true;
            //connection.send('hello everyone');
        };
        self.connection.onclose = function (event) {
            console.log("onclose", event);
            self.isConnected = false;
            self.statusTextOtherEnc.innerHTML = 'Reconectando...';
            setTimeout(function () {
                self.openOrJoin();
            }, 500);
//            closeUserAndReconnect();
        };
        self.openOrJoin = function () {
            console.log("OPEN OR JOIN");
            self.connection.join(self.room);
            console.log(self.countCantIn);
            if (self.countCantIn < 5) {
                setTimeout(function () {
                    console.log(self.isConnected);
                    if (self.isConnected == false) {
                        self.openOrJoin();
                    }
                }, 1000);
                self.countCantIn++;
            } else {
                self.countCantIn = 0;
                setTimeout(function () {
                    openTheRoom();
                    console.log(self.isConnected);
                    if (self.isConnected == false) {
                        self.openOrJoin();
                    }
                }, 1000);
            }
        };
        self.connection.onleave = function (event) {
            var remoteUserId = event.userid;
            var remoteUserFullName = "N/A";
            if (typeof event.extra != 'undefined') {
                remoteUserFullName = event.extra.fullName;
                console.log(remoteUserFullName + ' left you.');
            }
            self.isConnected = false;
            self.connection.openOrJoin(self.room);
        };
        self.connection.onmessage = function (event) {
            console.log("self.connection.onmessage event", event);
            if (event.data.screebEnded === true) {
                var video = document.getElementById(event.data.streamid);
                if (video && video.parentNode) {
                    video.parentNode.removeChild(video);
                }
            }
            self.isConnected = true;
            self.receiveMessageOther(event);
        };
//        self.connection.onleave = self.connection.streamended = self.connection.onclose = function (event) {
//            self.connection.onUserStatusChanged({
//                userid: event.userid,
//                extra: event.extra,
//                status: 'offline'
//            });
//        };

        self.connection.onUserStatusChanged = function (status) {
            console.log("onUserStatusChanged", status);
            console.log("status.status", status.status);
//            if (status.status === "offline") {
//                closeUserAndReconnect();
//            }
//            self.statusTextOtherEnc.innerHTML = 'onUserStatusChanged.';
//            document.querySelector(".video_stream_" + status.userid).src = status === 'online' ? 'online.gif' : 'offline.gif';
        };
        self.connection.validateLowBandWidth = function () {
            if (self.connection.isLowBandwidth === true) {
                alert("Su banda ancha es muy baja, puede presentar problemas de conexión. Conéctese a una red más velóz.");
            }
        };
        self.connection.onReConnecting = function (event) {
            self.statusTextOtherEnc.innerHTML = 'ReConnecting with', event.userid, '...';
            console.info('ReConnecting with', event.userid, '...');
        };
        self.connection.onPeerStateChanged = function (state) {
            console.log("PEER STATE");
            console.log(state);
            console.log(state.iceConnectionState);
            if (state.iceConnectionState.search(/closed|failed/gi) !== -1) {
                console.error('Peer connection is closed between you & ', state.userid, state.extra, 'state:', state.iceConnectionState);
                return;
            }
            if (state.iceConnectionState.search(/connected/gi)) {
                self.isConnected = true;
            } else {
                self.isConnected = false;
            }

        };
        self.connection.onUserIdAlreadyTaken = function (useridAlreadyTaken, yourNewUserId) {
            console.warn('Userid already taken.', useridAlreadyTaken, 'Your new userid:', yourNewUserId);
            self.connection.userid = self.connection.token();
            self.connection.join(self.connection.sessionid);
        };
        console.log("self.connection.version", self.connection.version);
        self.connection.onRoomFull = function (roomid) {
            console.warn(roomid, 'is full.');
            self.statusTextOtherEnc.innerHTML = roomid + ' is full.';
        };

        self.connection.reCheckRoomPresence = function () {
            self.connection.checkPresence(self.room, function (isRoomExist, roomid, room) {
                console.log("CHECKING PRESENCE");
                console.log("isRoomExist");
                console.log(isRoomExist);
                console.log("ROOMID:");
                console.log(roomid);
                console.log("ROOM:");
                console.log(room);
//                if (b == "Joining the room") {
//                    return;
//                }
//                if (b == "Room not available") {
//                    return;
//                }
//                if (isRoomExist === true) {
                console.log("isModerator");
                console.log(self.isModerator);
                console.log(isRoomExist);
                if (isRoomExist == false) {
                    if (self.isModerator == "true") {
                        openTheRoom();
                    } else {
                        joinTheRoom();
                    }
                } else {
                    console.log("ROOM EXISTS!");
//                    if (self.isConnected == false) {
                    joinTheRoom();
//                    }
                }
            });
        }

        self.connection.connectSocket(function (socket) {
            console.info('Successfully connected to socket.io server.');
            self.statusTextOtherEnc.innerHTML = 'Successfully connected to socket.io server.';
//            self.connection.socket.emit('get-public-rooms', publicRoomIdentifier, function (listOfRooms) {
//                console.log("listOfRooms:");
//                console.log(listOfRooms);
//            });

//            self.connection.checkSession();
//            console.log(socket);
//            console.log("ROOM");
//            console.log(self.room);
//            self.connection.checkPresence(self.room, function (isRoomExist) {
//                console.log("ROOM EXISTS");
//                console.log(isRoomExist);
//                if (isRoomExist === true) {
//                    joinTheRoom();
//                    console.log('This room-id is already taken and room is active. Please join instead.', 'Room ID In Use');
//                    return;
//                } else {
//                    openTheRoom();
//                }
//            });

            console.log("connection socket!");
            console.log();

            self.isConnected = true;

            socket.on('disconnect', function () {
                console.log("------------Socket desconectado-----------");
                self.information("Socket desconectado");
                self.isConnected = false;
                self.connection.reCheckRoomPresence();
//                setTimeout(self.joinTheRoom(), 5000);
            });

        });

        srv.createInstance();

        self.connection.socket.emit('get-public-rooms', publicRoomIdentifier, function (listOfRooms) {
            console.log("listOfRooms");
            console.log(listOfRooms);
            if (listOfRooms.length < 1) {
                return;
            } else {
                for (var i = 0; i < listOfRooms.length; i++) {
                    console.log(listOfRooms[i]);
                }
                console.log("TIENE YA UN ROOM");
            }
        });

        setTimeout(self.connection.reCheckRoomPresence(), 5000);

        console.log("CREATED!!!!");

//        self.connection.openOrJoin();
//        self.connection.checkSession();

//        setInterval(function () {
//            console.log("self.connection.isOnline", self.connection.isOnline);
//        }, 5000);

        self.removeLoading();

        // auto-join-room

        function getUserMedia() {
            return navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    null;
        }

        function handleScreen(event) {
            console.log("handleScreen", event);
            var screenViewer = document.querySelector('#screen-viewer');
            screenViewer.srcObject = event.stream;
        }

        var count = 1;
        var intervalVid = null;
        function handleCamera(event) {
            console.log("handleCamera", event);
            if (event.mediaElement) {
                event.mediaElement.muted = true;
                delete event.mediaElement;
            }
            var myVideoContainer = document.querySelector('.containMyVideo');
            var classVideo = "js-video-partner";
            var othersVideosContainer = document.querySelector('.containVideoOther');
            var videosContainer = othersVideosContainer;
            if (event.type === "local") {
                videosContainer = myVideoContainer;
                classVideo = "js-video-myself";
            }
            var video = document.createElement('video');
            video.className = classVideo + " video_stream video_stream_" + count + " video_stream_" + event.userid;
            video.id = event.streamid;
            video.autoplay = true;
            video.controls = false;
            video.srcObject = event.stream;
            videosContainer.appendChild(video);
            if (event.type === "local") {
                video.muted = true;
                self.videoMyself = video;
            } else {
                video.muted = false;
                console.log("New video");
                clearInterval(intervalVid);
                intervalVid = setInterval(function () {
                    var alls = document.querySelectorAll(".js-video-partner");
                    console.log("alls", alls);
                    console.log("alls.length", alls.length);
                    if (alls.length == 0) {
                        if (self.countPresence > 2) {
                            self.connection.openOrJoin(self.room);
                            self.countPresence = 0;
                        }
                        self.countPresence++;
                    }
                    var height = "100%";
                    var width = "100%";
                    if (alls.length >= 2 && alls.length <= 3) {
                        height = "100%";
                        width = "50%";
                    } else
                    if (alls.length >= 3 && alls.length <= 4) {
                        height = "50%";
                        width = "50%";
                    } else
                    if (alls.length >= 5 && alls.length <= 8) {
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
                }, 5000);
            }
            count++;
        }

        function handleAudio(event) {
            console.log("handleAudio event", event)
            utils.addClass(self.containVideoOther, "containVideoOtherAudio");
            self.audioIsCalling.style = "display: block;";
            if (event.type === "local") {

                self.audioIsCalling.innerHTML = "Llamando...";
                utils.playSound("audio/timbrando.mp3", "timbrando_mp3");
                self.intervalSoundTimbrando = setInterval(function () {
                    utils.playSound("audio/timbrando.mp3", "timbrando_mp3");
                }, 5000);
            } else {
                self.audioIsCalling.innerHTML = "En línea";
                clearInterval(self.intervalSoundTimbrando);
                if (document.querySelector(".timbrando_mp3")) {
                    document.querySelector(".timbrando_mp3").remove();
                }
            }
        }

        function closeUserAndReconnect() {
            self.statusOnline = "offline";
            self.statusTextOtherEnc.innerHTML = 'Connection close';
            console.log('Connection close');
            utils.removeClass(self.statusOtherEnc, "statusOtherEnc_online", true);
//            self.connection.checkSession();
            if (self.audio && !self.video) {
                self.audioIsCalling.innerHTML = "Volviendo a llamar...";
                if (document.querySelector(".timbrando_mp3")) {
                    document.querySelector(".timbrando_mp3").remove();
                }
//                utils.playSound("audio/call_loss.mp3", "call_loss");
                clearInterval(self.intervalSoundTimbrando);
                utils.playSound("audio/timbrando.mp3", "timbrando_mp3");
                self.intervalSoundTimbrando = setInterval(function () {
                    utils.playSound("audio/timbrando.mp3", "timbrando_mp3");
                }, 5000);
            }
        }

        function openTheRoom() {
            console.log("Initiliazing the room");
//            self.connection.open(roomid);
            console.log("open");
            console.log(self.room);
            self.connection.openOrJoin(self.room, function (isRoomOpened, roomid, error) {
                if (error) {
                    self.statusTextOtherEnc.innerHTML = "ERROR IN OPEN: " + error;
//                    self.connection.checkSession();
                }
                if (isRoomOpened === true) {
                    self.isRoomJoined = true;
                    self.statusTextOtherEnc.innerHTML = 'Successfully created the room.';
                    console.log('Successfully created the room.');
//                    joinTheRoom();
                }
                self.isRoomOpened = isRoomOpened;
            });
        }

        function joinTheRoom() {
            console.log("Joining the room");
//            self.connection.join(roomid);
            console.log(self.room);
            self.connection.join(self.room, function (isJoined, roomid, error) {
                console.log("JOINED!");
                console.log(roomid);
                console.log(isJoined);
                console.log("ERROR:");
                console.log(error);
                if (error == "Room not available") {
                    if (self.isModerator == "true") {
                        openTheRoom();
                    } else {
                        joinTheRoom();
                    }
                }
                if (typeof error != "undefined") {
                    NWMUtils.error(error);
                    return;
                }
                if (isJoined === false) {
                    console.log("ERROR IN JOIN: " + error); // maybe room doesn't exist or room is full or password is invalid
                    self.statusTextOtherEnc.innerHTML = "ERROR IN JOIN: " + error;
//                    self.connection.checkSession();
                } else {
                    self.isRoomJoined = true;
                    self.statusTextOtherEnc.innerHTML = 'Successfully joined the room.';
                    console.log('Successfully joined the room.');
                }
                self.isRoomJoined = isJoined;
            });
        }

        self.connection.validateLowBandWidth();

        return self.connection;
    }

};