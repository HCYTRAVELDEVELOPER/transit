
var windowStorage = {
    storage: null,
    incognit: false,
    initIncognito: function () {
        var self = this;
        this.ifIncognito(true, () => {
            console.log('in incognito');
            self.incognit = true;
            self.storage = {};
        });
    },
    getItem: function (name) {
        if (this.incognit) {
            if (windowStorage.storage[name]) {
                return windowStorage.storage[name];
            } else {
                return null;
            }
        } else {
            return window.localStorage.getItem(name);
        }
    },
    setItem: function (key, value) {
        if (this.incognit) {
            windowStorage.storage[key] = value;
        } else {
            window.localStorage.setItem(key, value);
        }
    },
    removeItem: function (name) {
        if (this.incognit) {
            windowStorage.storage[name] = null;
        } else {
            window.localStorage.removeItem(name);
        }
    },
    clear: function () {
        if (this.incognit) {
            this.storage = {};
        } else {
            window.localStorage.clear();
        }
    },
    ifIncognito: function ifIncognito(incog, func) {
        var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
        if (!fs)
            console.log("checking incognito failed");
        else {
            if (incog)
                fs(window.TEMPORARY, 0, () => {
                }, func);
            else
                fs(window.TEMPORARY, 0, func, () => {
                });
        }
    }
};
windowStorage.initIncognito();

var rtcNw = {
    video: true,
    audio: true,
    startPeerToPeer: true,
    enLinea: false,
    lastTextTraducido: "",
    nameConference: "1",
    textConectarme: "Conectarme",
    textWaitingConnect: "Esperando conexión... Por favor espere.",
    debug: false,
    chatVisible: true,
    isMaximizeVideo: false,
    room: null,
    isAssesor: false,
    useInterNw: false,
    timeHours: 0,
    timeMinutes: 0,
    timeSeconds: 0,
    networkType: 0,
    inWindow: true,
    saveRecord: false,
    useRecordVideo: false,
    streamLastId: null,
    playVideo: true,
    playAudio: true,
    useForRingowClient: false,
    isOperatorRingow: true,
    isConstructChat: false,
    domain: window.location.protocol + "//" + window.location.host,
    rutaFiles: "",
    animateMsgShow: true,
    intervalValidaShareScreen: null,
    screen: false,
    onlyChat: false,
    sendGifOrImage: "img",
    otherInWIndow: false,
    developer: false,
    signal_live: "no_alive",
    intervalCheckSessionNoLive: null,
    receiveFirstSignal: false,
    mediaRecorderVoice: false,
    is_group: false,
    isInApp: false,
    setTime: false,
    myID: null,
    otherID: null,
    sharedScreen: null,
    loadCssChatOut: false,
    loadJsUtilsOut: false,
    loadJsConnectionOut: false,
    useBot: false,
    visitorStreaming: false,
    connection: null,
    prepare: function (classContainer, callback, parameters) {
        var self = this;
        var get = self.get();
        if (typeof windowStorage.getItem("ringowDeveloperAx") === "undefined" || windowStorage.getItem("ringowDeveloperAx") == null) {
            console.log("aplica el setItem");
            windowStorage.setItem("ringowDeveloperAx", "false");
        }
        self.developer = JSON.parse(windowStorage.getItem("ringowDeveloperAx"));

        if (typeof classContainer === "undefined" || classContainer === null || classContainer === false || classContainer === "") {
            classContainer = ".containerNwpeer2Peer";
        }
        self.container = document.querySelector(classContainer);

        if (!self.container) {
            self.container = document.createElement("div");
            self.container.className = classContainer;
            document.body.appendChild(self.container);
        }

        self.statusOnline = "offline";

        if (get !== false) {
            if (typeof get.useForRingowClient !== "undefined") {
                if (get.useForRingowClient === "true") {
                    self.useForRingowClient = true;
                }
            }
            if (typeof get.room !== "undefined") {
                self.room = get.room;
            }
            if (typeof get.domain !== "undefined") {
                self.domain = get.domain;
            }
            if (get.video !== "undefined") {
                if (get.video === "false") {
                    self.video = false;
                }
            }
            if (get.audio !== "undefined") {
                if (get.audio === "false") {
                    self.audio = false;
                }
            }
            if (get.is_group !== "undefined") {
                if (get.is_group === "true") {
                    self.is_group = true;
                }
            }
            if (get.onlyChat === "true") {
                self.onlyChat = true;
            }
            if (get.visitorStreaming === "true") {
                self.onlyChat = true;
                self.visitorStreaming = true;

                var css = document.createElement("div");
                css.innerHTML = "<style>.containButonsVideoAudio{display: none;}</style>";
                document.body.appendChild(css);
            }

            var getURL = self.getParamsFileGet();
            self.version = getURL.v;
            if (typeof get.version !== "undefined") {
                self.version = get.version;
            }
            if (get.saveRecord === "NO") {
                self.saveRecord = false;
            }
            if (get.useRecordVideo === "NO") {
                self.useRecordVideo = false;
            }
            if (get.isAssesor === "true") {
                self.isAssesor = true;
            }
            if (get.useInterNw === "true") {
                self.useInterNw = true;
            }
            if (get.isInApp === "true") {
                self.isInApp = true;
            }
            if (typeof get.time !== "undefined") {
                self.setTime = true;
                self.time = get.time;
            }
            if (typeof get.myID !== "undefined") {
                self.myID = get.myID;
            }
            if (typeof get.otherID !== "undefined") {
                self.otherID = get.otherID;
            }
            if (get.sharedScreen === "true") {
                self.sharedScreen = true;
            }
            if (typeof get.rutaFiles !== "undefined") {
                self.rutaFiles = get.rutaFiles;
            }
            if (get.useBot === "true") {
                self.useBot = true;
            }
        }

        if (typeof parameters !== "undefined") {
            if (typeof parameters.room !== "undefined" && parameters.room !== false && parameters.room !== null && parameters.room !== "") {
                self.room = parameters.room;
            }
            if (typeof parameters.onlyChat !== "undefined" && parameters.onlyChat !== false && parameters.onlyChat !== null && parameters.onlyChat !== "") {
                self.onlyChat = parameters.onlyChat;
            }
            if (typeof parameters.myID !== "undefined" && parameters.myID !== false && parameters.myID !== null && parameters.myID !== "") {
                self.myID = parameters.myID;
            }
            if (typeof parameters.otherID !== "undefined" && parameters.otherID !== false && parameters.otherID !== null && parameters.otherID !== "") {
                self.otherID = parameters.otherID;
            }
            if (typeof parameters.isInApp !== "undefined" && parameters.isInApp !== false && parameters.isInApp !== null && parameters.isInApp !== "") {
                self.isInApp = parameters.isInApp;
            }
            if (typeof parameters.rutaFiles !== "undefined" && parameters.rutaFiles !== false && parameters.rutaFiles !== null && parameters.rutaFiles !== "") {
                self.rutaFiles = parameters.rutaFiles;
            }
            if (typeof parameters.loadCssChatOut !== "undefined" && parameters.loadCssChatOut !== false && parameters.loadCssChatOut !== null && parameters.loadCssChatOut !== "") {
                self.loadCssChatOut = parameters.loadCssChatOut;
            }
            if (typeof parameters.loadJsUtilsOut !== "undefined" && parameters.loadJsUtilsOut !== false && parameters.loadJsUtilsOut !== null && parameters.loadJsUtilsOut !== "") {
                self.loadJsUtilsOut = parameters.loadJsUtilsOut;
            }
            if (typeof parameters.loadJsConnectionOut !== "undefined" && parameters.loadJsConnectionOut !== false && parameters.loadJsConnectionOut !== null && parameters.loadJsConnectionOut !== "") {
                self.loadJsConnectionOut = parameters.loadJsConnectionOut;
            }
            if (typeof parameters.domain !== "undefined" && parameters.domain !== false && parameters.domain !== null && parameters.domain !== "") {
                self.domain = parameters.domain;
            }
        }

        if (!self.is_group) {
            setInterval(function () {
                if (self.signal_live === "no_alive" && self.receiveFirstSignal === true) {
//                self.connection.checkSession();
//                self.connection.renegotiate();
//                window.location.reload();
//                // disconnect with all users
                    self.connection.getAllParticipants().forEach(function (pid) {
                        self.connection.disconnectWith(pid);
                    });

                    // stop all local cameras
                    self.connection.attachStreams.forEach(function (localStream) {
                        localStream.stop();
                    });

                    // close socket.io connection
                    self.connection.closeSocket();

                    self.connection.initialCall();
//                self.connection.addStream({
//                    audio: self.audio,
//                    video: self.video,
//                    data: true
//                });
                }
            }, 15000);
        }

        if (self.onlyChat === true) {
            self.video = false;
            self.audio = false;
        }

        if (!self.loadCssChatOut) {
            self.requireCss(self.rutaFiles + "css/chat.css?v=" + self.version);
        }

        if (!self.onlyChat || self.visitorStreaming) {
            self.requireCss(self.rutaFiles + "css/main.css?v=" + self.version);
        }
        if (self.video === false) {
            self.saveRecord = false;
            self.useRecordVideo = false;
            self.textConectarme = "Llamar";
        }

        rtcNw.constructChat();

        if (self.loadJsUtilsOut === true) {
            self.prepareAfterLoadUtils(callback);
        } else {
            self.require(self.rutaFiles + 'js/utils.js?v=' + self.version, function () {
                self.prepareAfterLoadUtils(callback);
            });
        }
    },
    prepareAfterLoadUtils: function (callback) {
        var self = this;
        if (!utils.isOnline()) {
//                alert("Por favor verifique su conexión a internet");
            self.removeLoading();
        }

        window.addEventListener('focus', function () {
            self.inWindow = true;
        });

        window.addEventListener('blur', function () {
            self.inWindow = false;
        });

        document.addEventListener("visibilitychange", function () {
//                console.log("document.visibilityState", document.visibilityState);
//                console.log("document.hidden", document.hidden);
        });

//            self.detectChangeConnectionStatus();
        self.detectChangeFullScreen();

        var urlpeer = 'js/connection.js';

        if (!self.loadJsConnectionOut) {
            self.require(self.rutaFiles + urlpeer + '?v=' + self.version, function () {
                self.removeLoading();
                callback();
            });
        } else {
            callback();
        }
//        if (self.onlyChat === true) {
//            self.require(self.rutaFiles + urlpeer + '?v=' + self.version, function () {
//                self.removeLoading();
//                callback();
//            });
//            return true;
//        }
//        if (self.useRecordVideo === false) {
//            self.require(self.rutaFiles + urlpeer + '?v=' + self.version, function () {
////                    "js/lib/Screen-Capturing.js";
////                    self.require('js/lib/getScreenId.js?v=' + self.version, function () {
//                callback();
////                    });
//            });
//            return true;
//        }

//            self.require('js/lib/RecordRTC.js?v=' + self.version, function () {
//                self.require(urlpeer + '?v=' + self.version, function () {
//                    callback();
//                });
//            });        
    },
    construct: function () {
        var self = this;
        self.container.style = "position: fixed;top: 0;left: 0;width: 100%;height: 100%;font-family: arial;font-size: 14px;";
        self.contain_no_connected = document.createElement("div");
        self.contain_no_connected.className = "contain_no_connected";
        self.contain_no_connected.style = "display:none;";
        self.container.appendChild(self.contain_no_connected);

        var addClassConnect = "no_connected";
        if (!self.video) {
            addClassConnect += " btn_connect_onlycall";
        }
        self.connectButton = document.createElement("button");
        self.connectButton.className = addClassConnect;
        self.connectButton.innerHTML = self.textConectarme;
        self.connectButton.onclick = function () {
            self.startConnectWithOther();
        };
        self.contain_no_connected.appendChild(self.connectButton);

//        self.contain_waiting = document.createElement("div");
//        self.contain_waiting.className = "contain_waiting";
//        self.contain_waiting.innerHTML = " <p class='contain_waiting_text'>" + self.textWaitingConnect + "</p>";
//        self.container.appendChild(self.contain_waiting);
        if (self.onlyChat === true && !self.visitorStreaming) {
            return true;
        }

        self.containNoExtensionChrome = document.createElement("div");
        self.containNoExtensionChrome.className = "containNoExtensionChrome";
        self.containNoExtensionChrome.style.display = "none";
        self.container.appendChild(self.containNoExtensionChrome);

        self.containNoExtensionChromeText = document.createElement("div");
        self.containNoExtensionChromeText.className = "containNoExtensionChrome_text";
        self.containNoExtensionChromeText.innerHTML = "<h3>No se pudo capturar su pantalla.</h3> Verifique que la extensión esté instalada <a href='https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk' class='linkDownloadExten' target='_BLANK'>Haz clic aquí para instalar la extensión</a> o puede que esté instalada pero inhabilitada";
        self.containNoExtensionChrome.appendChild(self.containNoExtensionChromeText);

        self.containNoExtensionChromeButton = document.createElement("button");
        self.containNoExtensionChromeButton.innerHTML = "Cerrar";
        self.containNoExtensionChromeButton.onclick = function () {
            self.containNoExtensionChrome.style.display = "none";
            clearInterval(self.intervalValidaShareScreen);
        };
        self.containNoExtensionChromeText.appendChild(self.containNoExtensionChromeButton);

        self.containUploadProgress = document.createElement("div");
        self.containUploadProgress.className = "containUploadProgress";
        self.container.appendChild(self.containUploadProgress);

        self.containerVideos = document.createElement("div");
        self.containerVideos.className = "containerVideos";
        self.container.appendChild(self.containerVideos);

        self.containMyVideo = document.createElement("div");
        self.containMyVideo.className = "containMyVideo";
        self.container.appendChild(self.containMyVideo);

        self.containVideoOther = document.createElement("div");
        self.containVideoOther.className = "containVideoOther";
        self.container.appendChild(self.containVideoOther);

        self.audioIsCalling = document.createElement("div");
        self.audioIsCalling.className = "audioIsCalling";
        self.audioIsCalling.style = "display: none;";
        self.containVideoOther.appendChild(self.audioIsCalling);

        self.videoPartnerMaximice = document.createElement("div");
        self.videoPartnerMaximice.className = "videoPartnerMaximice";
        self.containVideoOther.appendChild(self.videoPartnerMaximice);

        self.videoPartnerMaximiceButton = document.createElement("button");
        self.videoPartnerMaximiceButton.className = "videoPartnerMaximiceButton";
        self.videoPartnerMaximiceButton.innerHTML = "<img src='" + self.rutaFiles + "img/fullscreen.png' /><span class='countParticipants'>0</span>";
        self.videoPartnerMaximiceButton.onclick = function () {
            self.maximizeVideo();
        };
        self.videoPartnerMaximice.appendChild(self.videoPartnerMaximiceButton);

        self.videoPartnerMinimizeButton = document.createElement("button");
        self.videoPartnerMinimizeButton.className = "videoPartnerMinimizeButton";
        self.videoPartnerMinimizeButton.innerHTML = "<img src='" + self.rutaFiles + "img/fullscreen_exit.png' />";
        self.videoPartnerMinimizeButton.onclick = function () {
            self.maximizeVideo();
        };
        self.containVideoOther.appendChild(self.videoPartnerMinimizeButton);

        if (self.video || self.audio) {
            self.createHtmlConfig();
        }


        self.containerButtons = document.createElement("div");
        self.containerButtons.className = "containButonsVideoAudio";
        self.container.appendChild(self.containerButtons);

        //reloj
        self.containTime = document.createElement("div");
        self.containTime.className = "containTime";
        self.containerButtons.appendChild(self.containTime);

        self.containTimeHours = document.createElement("span");
        self.containTimeHours.className = "containTimeHours";
        self.containTimeHours.innerHTML = "00";
        self.containTime.appendChild(self.containTimeHours);

        self.containTimeSeparator = document.createElement("span");
        self.containTimeSeparator.className = "containTimeSeparator";
        self.containTimeSeparator.innerHTML = ":";
        self.containTime.appendChild(self.containTimeSeparator);

        self.containTimeMinutes = document.createElement("span");
        self.containTimeMinutes.className = "containTimeMinutes";
        self.containTimeMinutes.innerHTML = "00";
        self.containTime.appendChild(self.containTimeMinutes);

        self.containTimeSeparator = document.createElement("span");
        self.containTimeSeparator.className = "containTimeSeparator";
        self.containTimeSeparator.innerHTML = ":";
        self.containTime.appendChild(self.containTimeSeparator);

        self.containTimeSeconds = document.createElement("span");
        self.containTimeSeconds.className = "containTimeSeconds";
        self.containTimeSeconds.innerHTML = "00";
        self.containTime.appendChild(self.containTimeSeconds);
        //fin reloj

        self.containVersionShow = document.createElement("span");
        self.containVersionShow.className = "containVersionShow";
        self.containVersionShow.innerHTML = " Version " + self.version;
        self.containTime.appendChild(self.containVersionShow);

        self.colgarVideoCallButton = document.createElement("button");
        self.colgarVideoCallButton.className = "elementTooltipHover";
        self.colgarVideoCallButton.innerHTML = "<img src='" + self.rutaFiles + "img/colgar.png' style='max-width: 80%;' /><span class='toolTipNwOne'>Colgar</span>";
        self.colgarVideoCallButton.style = "bottom: 7px;padding: 0;color: red;background-color: red;border-radius: 50%;width: 50px;height: 50px;";
        self.colgarVideoCallButton.onclick = function () {
            self.colgarVideoCall();
        };
        self.containerButtons.appendChild(self.colgarVideoCallButton);

        if (self.video) {
            self.stopStarVideoButton = document.createElement("button");
            self.stopStarVideoButton.className = "elementTooltipHover";
            self.stopStarVideoButton.innerHTML = "<img src='" + self.rutaFiles + "img/videocam_on.png' class='video_on_img' /><img src='" + self.rutaFiles + "img/videocam_off.png' class='video_off_img' style='display: none;' /><span class='toolTipNwOne'>Apagar / prender cámara</span>";
            self.stopStarVideoButton.onclick = function () {
                self.stopStartVideo();
            };
            self.containerButtons.appendChild(self.stopStarVideoButton);
        }

        self.stopStarAudioButton = document.createElement("button");
        self.stopStarAudioButton.className = "elementTooltipHover";
        self.stopStarAudioButton.innerHTML = "<img src='" + self.rutaFiles + "img/mic_on.png' class='mic_on_img' /><img src='" + self.rutaFiles + "img/mic_off.png' class='mic_off_img' style='display: none;' /><span class='toolTipNwOne'>Apagar / prender micrófono</span>";
        self.stopStarAudioButton.onclick = function () {
            self.stopStartAudio();
        };
        self.containerButtons.appendChild(self.stopStarAudioButton);

        if (!utils.isMobile() && self.video) {
            self.shareCloseButton = document.createElement("button");
            self.shareCloseButton.className = "elementTooltipHover";
            self.shareCloseButton.innerHTML = "<img src='" + self.rutaFiles + "img/share_stop.png' /><span class='toolTipNwOne'>Parar compartir pantalla</span>";
            self.shareCloseButton.style.display = "none";
            self.shareCloseButton.onclick = function () {
                self.share.style.display = "inline-block";
                self.shareCloseButton.style.display = "none";
                self.localMediaStream.stop();
//                self.connection.replaceTrack({
//                    video: self.video,
//                    audio: self.audio,
//                    screen: false,
//                    oneway: false
//                });
            };
            self.containerButtons.appendChild(self.shareCloseButton);

            self.share = document.createElement("button");
            self.share.className = "elementTooltipHover";
            self.share.innerHTML = "<img src='" + self.rutaFiles + "img/share.png' /><span class='toolTipNwOne'>Compartir pantalla</span>";
            self.share.onclick = function () {
                self.share.style.display = "none";
                self.shareCloseButton.style.display = "inline-block";

//                self.connection.addStream({
                self.connection.replaceTrack({
                    screen: true,
                    oneway: true,
                    streamCallback: function (screenStream) {
                        self.share.style.display = "none";
                        self.shareCloseButton.style.display = "inline-block";
                        console.log('Screen is successfully captured: ' + screenStream.getVideoTracks().length);
                        screenStream.onended = function () {
                            console.log("onended");
                            self.share.style.display = "inline-block";
                            self.shareCloseButton.style.display = "none";
                        };
                    }
                });
            };
            self.containerButtons.appendChild(self.share);
        }

        if (self.useRecordVideo === true && self.video) {
            self.recordButton = document.createElement("button");
            self.recordButton.className = "elementTooltipHover";
            self.recordButton.innerHTML = "<span class='iconRecording'></span><img src='" + self.rutaFiles + "img/download.png' /><span class='toolTipNwOne'>Descargar grabación</span>";
            self.recordButton.style = "display: none;";
            self.recordButton.onclick = function () {
                self.stopRecordVideo();
            };
            self.containerButtons.appendChild(self.recordButton);
        }

        self.chatButton = document.createElement("button");
        self.chatButton.className = "elementTooltipHover";
        self.chatButton.innerHTML = "<img src='" + self.rutaFiles + "img/chat.png' /><span class='toolTipNwOne'>Chat</span>";
        if (self.onlyChat === true && !self.visitorStreaming) {
            self.chatButton.style = "display:none;";
        } else {
            self.chatVisible = false;
        }
        self.chatButton.onclick = function () {
            self.openChat();
        };
        self.containerButtons.appendChild(self.chatButton);


        self.notifyChatButton = document.createElement("div");
        self.notifyChatButton.className = "notifyChatButton";
        self.chatButton.appendChild(self.notifyChatButton);

    },
    constructChat: function () {
        var self = this;
        var classMainChat = "containerChat";
//        var classMainChat = "containerChat containerChatVisible";
//        if (utils.isMobile()) {
//            classMainChat = "containerChat";
//        }
        if (self.onlyChat === true && !self.visitorStreaming) {
            classMainChat += " containerChatVisible containerChat_maximice";
        }
//        else {
//            classMainChat = "containerChat";
//        }
        self.containerChat = document.createElement("div");
        self.containerChat.className = classMainChat;
        self.container.appendChild(self.containerChat);

        self.contentChat = document.createElement("div");
        self.contentChat.className = "contentChat";
        self.containerChat.appendChild(self.contentChat);

        self.encChat = document.createElement("div");
        self.encChat.className = "encChat";
        self.contentChat.appendChild(self.encChat);

        if (!self.onlyChat || self.visitorStreaming) {
            self.closeChat = document.createElement("img");
            self.closeChat.className = "iconsEnc closeChat";
            self.closeChat.src = "" + self.rutaFiles + "img/close_blanco.png";
            self.closeChat.onclick = function () {
                self.openChat();
            };
            self.encChat.appendChild(self.closeChat);
        }

        if (self.onlyChat === true && !self.useForRingowClient) {
            self.videoCamButton = document.createElement("img");
            self.videoCamButton.className = "iconsEnc videocallEnc";
            self.videoCamButton.src = "" + self.rutaFiles + "img/videocam.png";
            self.videoCamButton.onclick = function () {
                self.startAudioVideoCall("video");
            };
            self.encChat.appendChild(self.videoCamButton);

            self.audioCallButton = document.createElement("img");
            self.audioCallButton.className = "iconsEnc audiocallEnc";
            self.audioCallButton.src = "" + self.rutaFiles + "img/audio_call.png";
            self.audioCallButton.onclick = function () {
                self.startAudioVideoCall("audio");
            };
            self.encChat.appendChild(self.audioCallButton);
        }

        self.settingsEnc = document.createElement("img");
        self.settingsEnc.className = "iconsEnc settingsEnc";
        self.settingsEnc.src = "" + self.rutaFiles + "img/settings.png";
        self.settingsEnc.onclick = function () {
            self.openSettings();
        };
        self.encChat.appendChild(self.settingsEnc);

        self.statusOtherEnc = document.createElement("span");
        self.statusOtherEnc.className = "iconsEnc statusOtherEnc";
        self.encChat.appendChild(self.statusOtherEnc);

        self.nameOtherEnc = document.createElement("span");
        self.nameOtherEnc.className = "iconsEnc nameOtherEnc";
        self.encChat.appendChild(self.nameOtherEnc);

        self.statusTextOtherEnc = document.createElement("div");
        self.statusTextOtherEnc.className = "statusTextOtherEnc";
        self.statusTextOtherEnc.innerHTML = "Estableciendo conexión...";
        self.encChat.appendChild(self.statusTextOtherEnc);

        self.containerMessages = document.createElement("div");
        self.containerMessages.className = "messages";
//        self.containerMessages.innerHTML = "Mensajes más antiguos";
        self.contentChat.appendChild(self.containerMessages);

        self.form = document.createElement("form");
        self.form.className = "footerChat";
        self.contentChat.appendChild(self.form);
        self.form.setAttribute("onsubmit", "return false");

        self.createBtnEmojis();

        self.isWritten = document.createElement("div");
        self.isWritten.className = "isWritten";
        self.form.appendChild(self.isWritten);

        self.placeHolderMessageBox = document.createElement("div");
        self.placeHolderMessageBox.className = "placeHolderMessageBox";
        self.placeHolderMessageBox.innerHTML = "Escribe un mensaje aquí";
        self.form.appendChild(self.placeHolderMessageBox);

//        self.messageBox = document.createElement("textarea");
        self.messageBox = document.createElement("div");
        self.messageBox.className = "messageBox";
        self.messageBox.type = "text";
        self.messageBox.contenteditable = "true";
        self.messageBox.dir = "ltr";
        self.messageBox.spellcheck = "true";
        self.messageBox.placeholder = "Your message...";
        self.form.appendChild(self.messageBox);
        self.messageBox.setAttribute("contenteditable", "true");
        self.messageBox.addEventListener("keydown", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                self.sendMyMessageSubmit();
            }
        });
        self.messageBox.addEventListener("keyup", function (event) {
            self.showHiddenPlaceholderMessageBox();
        });

        self.btnEmojis = document.createElement("div");
        self.btnEmojis.className = "btnEmojis";
        self.btnEmojis.innerHTML = "<img src='" + self.rutaFiles + "img/emoji_b.svg' />";
        self.btnEmojis.onclick = function () {
            self.openEmojis("img");
        };
        self.form.appendChild(self.btnEmojis);

        self.containerFileTransfer = document.createElement("div");
        self.containerFileTransfer.className = "containerFileTransfer";
        self.form.appendChild(self.containerFileTransfer);

        self.fileTransferInput = document.createElement("input");
        self.fileTransferInput.className = "fileTransferInput";
        self.fileTransferInput.name = "uploader_adjunto";
        self.fileTransferInput.type = "file";
        self.fileTransferInput.accept = "image/*;capture=camera";
        self.fileTransferInput.placeholder = "Your message...";
        self.fileTransferInput.onchange = function (event) {
//            var file = event.target.files[0];
//            var text = "He enviado el archivo " + file.name;
//            var type = file.type;
//            var blob = new Blob(event.target.files, {type: type});
//            self.sendMessagePeer({message: text});
//            var message = {
//                file: blob,
//                filename: file.name,
//                filetype: file.type
//            };
//            self.sendMessagePeer({message: message});
//            self.addMessage({text: text, type: "me", name: self.myselfId_get_clean, cleanHTML: false});
//            return;

            utils.setBtnLoading(self.containerFileTransfer);

            var archivo = event.target.value;
            var name = "adjunto";
            var data = new FormData(self.form);
            data.append("archivo", archivo);
            data.append("name_file", name);
            data.append("uploadfile", "uploader_" + name);
            data.append("rename_random", "rename_random");

            function reqListener() {
                utils.removeBtnLoading(self.containerFileTransfer);
                var data = JSON.parse(this.responseText);
                console.log("saveOrUpdate", data);
                if (data.error !== null) {
                    alert(data.error);
                    return false;
                }
                var extension = utils.getExtensionFile(data.result.image_light);
                var imgThumb = self.domain + "/imgthumb/" + data.result.image_light.replace("/imagenes/", "") + "/100/" + extension.replace(".", "");
                var img = self.domain + data.result.image_light;
                var text = "<div class='imagePrev' onclick=\"javascript:window.open('" + img + "', '_blank')\" style='background-image: url(" + imgThumb + ");'></div>";

                self.sendMessagePeer({message: text});
                self.addMessage({text: text, type: "me", name: self.myselfId_get_clean, cleanHTML: false});
            }
            function reqError(err) {
                utils.removeBtnLoading(self.containerFileTransfer);
                console.log('Fetch Error :-S', err);
                return callback(false);
            }
            var oReq = new XMLHttpRequest();
            oReq.onload = reqListener;
            oReq.onerror = reqError;
            oReq.open('POST', self.domain + '/nwlib6/uploader.php', true);
            oReq.send(data);
        };
        self.containerFileTransfer.appendChild(self.fileTransferInput);

        if (self.onlyChat) {
            self.dictation = document.createElement("div");
            self.dictation.className = "imgSpeach";
            self.dictation.innerHTML = "<img src='" + self.rutaFiles + "img/mic.svg' />";
            self.dictation.onclick = function () {
                self.initRecordVoice();
//            utils.startDictation(".messageBox");
            };
            self.form.appendChild(self.dictation);
        }
        self.btnsubmit = document.createElement("button");
        self.btnsubmit.className = "btnsubmit";
        self.btnsubmit.type = "submit";
        self.btnsubmit.style = "display:none;";
        self.btnsubmit.innerHTML = "<img src='" + self.rutaFiles + "img/send.svg' />";
        self.form.appendChild(self.btnsubmit);

        if (self.developer) {
            self.btnsubmitPruebas = document.createElement("button");
            self.btnsubmitPruebas.className = "btnsubmit";
            self.btnsubmitPruebas.type = "button";
            self.btnsubmitPruebas.innerHTML = "A";
            self.btnsubmitPruebas.onclick = function () {
                setTimeout(function () {
                    self.sendMyMessageSubmit();
                }, 5000);
            };
            self.form.appendChild(self.btnsubmitPruebas);
        }


        self.form.addEventListener("submit", function () {
            self.sendMyMessageSubmit();
        });

        self.messageBox.onkeyup = function (e) {
            var box = self.messageBox;
            var val = box.value;
            if (val !== "") {
                self.sendWritten();
            }
        };
        setInterval(function () {
            utils.setHoursMsg();
        }, 10000);

        self.isConstructChat = true;

    },
    createHtmlConfig: function () {
        var self = this;
        self.containConfigurations = document.createElement("div");
        self.containConfigurations.className = "containConfigurations";
        self.containConfigurations.onclick = function () {

        };
        self.container.appendChild(self.containConfigurations);


        if (self.audio) {
            self.containConfigAudioDiv = document.createElement("div");
            self.containConfigAudioDiv.className = "containConfigAudioVideoDiv containConfigAudioDiv";
            self.containConfigAudioDiv.innerHTML = "Audio";
            self.containConfigurations.appendChild(self.containConfigAudioDiv);

            self.containConfiAudio = document.createElement("select");
            self.containConfiAudio.className = "containConfigurationAudio";
            self.containConfiAudio.onchange = function () {
                var data = this.value;
                console.log(data);
                self.connection.mediaConstraints = {
                    audio: {
                        mandatory: {},
                        optional: [{
                                sourceId: data
                            }]
                    }
                };
                if (self.connection.DetectRTC.browser.name === 'Firefox') {
                    self.connection.mediaConstraints = {
                        audio: {
                            deviceId: data
                        }
                    };
                }

            };
            self.containConfigAudioDiv.appendChild(self.containConfiAudio);
        }
        if (self.video) {
            self.containConfigVideoDiv = document.createElement("div");
            self.containConfigVideoDiv.className = "containConfigAudioVideoDiv containConfigVideoDiv";
            self.containConfigVideoDiv.innerHTML = "Video";
            self.containConfigurations.appendChild(self.containConfigVideoDiv);

            self.containConfiVideo = document.createElement("select");
            self.containConfiVideo.className = "containConfigurationVideo";
            self.containConfiVideo.onchange = function () {
                var data = this.value;
                console.log(data);
                self.connection.mediaConstraints = {
                    video: {
                        mandatory: {},
                        optional: [{
                                sourceId: data
                            }]
                    }
                };

                if (self.connection.DetectRTC.browser.name === 'Firefox') {
                    self.connection.mediaConstraints = {
                        video: {
                            deviceId: data
                        }
                    };
                }
            };
            self.containConfigVideoDiv.appendChild(self.containConfiVideo);
        }
    },
    createBtnEmojis: function () {
        var self = this;
        self.containerEmojis = document.createElement("div");
        self.containerEmojis.className = "containerEmojis";
        self.contentChat.appendChild(self.containerEmojis);

        self.containerEmojisEncBtns = document.createElement("div");
        self.containerEmojisEncBtns.className = "containerEmojisEncBtns";
        self.containerEmojis.appendChild(self.containerEmojisEncBtns);

        self.btnCloseEmojis = document.createElement("button");
        self.btnCloseEmojis.className = "btnEmojisSel btnCloseEmojis";
        self.btnCloseEmojis.innerHTML = "<img src='" + self.rutaFiles + "img/close.svg' />";
        self.btnCloseEmojis.onclick = function () {
            utils.removeClass(self.containerEmojis, "containerEmojis_show", true);
        };
        self.containerEmojisEncBtns.appendChild(self.btnCloseEmojis);

        self.btnEmojisSelEmoji = document.createElement("button");
        self.btnEmojisSelEmoji.className = "btnEmojisSel btnEmojisSelEmoji";
        self.btnEmojisSelEmoji.innerHTML = "Emojis";
        self.btnEmojisSelEmoji.onclick = function () {
            self.openEmojis("img");
        };
        self.containerEmojisEncBtns.appendChild(self.btnEmojisSelEmoji);

        self.btnEmojisSelGif = document.createElement("button");
        self.btnEmojisSelGif.className = "btnEmojisSel btnEmojisSelGif";
        self.btnEmojisSelGif.innerHTML = "Gif";
        self.btnEmojisSelGif.onclick = function () {
            self.openEmojis("gif");
        };
        self.containerEmojisEncBtns.appendChild(self.btnEmojisSelGif);

        self.containerEmojisInt = document.createElement("div");
        self.containerEmojisInt.className = "containerEmojisInt";
        self.containerEmojis.appendChild(self.containerEmojisInt);

    },
    openEmojis: function (tipo) {
        var self = this;
        self.sendGifOrImage = tipo;

        self.containerEmojisInt.innerHTML = self.getAllEmoji();

        var ems = self.containerEmojis.querySelectorAll(".em");
        for (var i = 0; i < ems.length; i++) {
            var em = ems[i];
            em.addEventListener("click", function (event) {
                var data = this.getAttribute("data");
                var box = self.messageBox;
                if (self.sendGifOrImage === "img") {
                    var message = box.innerHTML + data;
                    message = self.replaceEmojis(message, true);
                    box.innerHTML = message;
                    utils.removeClass(self.containerEmojis, "containerEmojis_show", true);
                    self.showHiddenPlaceholderMessageBox();
                    box.focus();
                } else {
                    var message = box.innerHTML + data;
                    message = self.replaceEmojis(message, true);
                    box.innerHTML = message;

                    self.sendMyMessageSubmit();
                    utils.removeClass(self.containerEmojis, "containerEmojis_show", true);
                }
            });
        }

        utils.addClass(self.containerEmojis, "containerEmojis_show");
    },
    sendMyMessageSubmit: function () {
        var self = this;
//        self.connection.renegotiate();
//        console.log("self.statusOnline", self.statusOnline);
//            if (self.statusOnline === "offline") {
//                self.connection.checkSession();
//            }
        var box = self.messageBox;
//        var message = box.value;
        var message = box.innerHTML;
        if (message !== "") {
            if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
                var langOrigin = windowStorage.getItem(self.nameConference + "select_transtale_origin_setings");
                var langTranslate = windowStorage.getItem(self.nameConference + "select_transtale_trad_setings");
                if (langOrigin !== null && langOrigin !== "" && langTranslate !== null && langTranslate !== "" && langOrigin !== langTranslate) {
                    self.translateText(message, langOrigin, langTranslate, function (textTranslate) {
                        self.lastTextTraducido = textTranslate.source;
                        self.continueSendMsg(textTranslate.translation);
                    });
                } else {
                    self.continueSendMsg(message);
                }
            } else {
                self.continueSendMsg(message);
            }
        }
//        box.value = "";
        box.innerHTML = "";

        self.showHiddenPlaceholderMessageBox();

        box.focus();
        setTimeout(function () {
            box.focus();
        }, 500);
    },
    continueSendMsg: function (message) {
        var self = this;
//        var cleanHTML = false;
//cambia para que no limpie el html a menos que tenga un emoji
        var cleanHTML = true;

        var messagePeer = {
            message: message,
            cleanHTML: cleanHTML
        };

        self.sendMessagePeer({message: messagePeer});
        self.addMessage({text: message, type: "me", name: self.myselfId_get_clean, cleanHTML: cleanHTML});

        var m = {};
        m.tipo = "add_msg";
        m.room = self.room;
        m.says = self.myselfId_get_clean;
        m.text = message;
        window.parent.postMessage(m, '*');
    },
    showHiddenPlaceholderMessageBox: function () {
        var self = this;
        var box = self.messageBox;
//        var message = box.value;
        var message = box.innerHTML;
        if (message.length > 0) {
            self.btnsubmit.style = "display:flex;";
            self.dictation.style = "display:none;";
            self.placeHolderMessageBox.style.display = "none";
        } else {
            self.btnsubmit.style = "display:none;";
            self.dictation.style = "display:flex;";
            self.placeHolderMessageBox.style.display = "block";
        }
    },
    startAudioVideoCall: function (tipo) {
        var self = this;
        var className = "linkMsgVideoCall";
        var url = location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_no_clean + "&otherID=" + self.partnerId_get_no_clean + "&room=" + self.room + "_mode_calling_audio_video";
        if (tipo === "video") {
//            url = "https://meet.gruponw.com/" + self.room.replace(/_/gi, '');
            url = "/nwlib6/nwproject/modules/webrtc/v4/initVideo.php?room=" + self.room.replace(/_/gi, '') + "&startWithVideoMuted=true";
        }
        if (tipo === "audio") {
            url += "&video=false&audio=true";
            className = "linkMsgAudioCall";
            if (self.isAssesor === true) {
                url += "&isAssesor=true";
            }
            if (self.is_group === true) {
                url += "&is_group=true";
            }
        }
        var insideIframe = window.top !== window.self;
        var message = "He iniciado una " + tipo + "llamada, <div class='linkMsgVideoAudioCall " + className + "'>clic aquí para iniciar</div>";
        self.sendMessagePeer({message: message});

        var btn = self.addMessage({text: message, type: "me", name: self.myselfId_get_clean, cleanHTML: false});
        btn.querySelector("." + className).onclick = function () {
            self.startAudioVideoCall(tipo);
        };
        if (insideIframe) {
            if (self.isInApp) {
                if (tipo === "video") {
                    alert("No sentimos, es posible iniciar la videollamada.");
                } else {
                    window.open(url, '_SELF');
                }
            } else {
//                window.open(url, '_blank');
                window.open(url, 'Videollamada', 'height=' + screen.height + ',width=' + screen.width + ',resizable=yes,scrollbars=yes,toolbar=yes,menubar=yes,location=yes');
            }
            if (!self.isInApp) {
                setTimeout(function () {
//                    window.location = location.protocol + "//" + location.hostname + "/nwlib6/nwproject/modules/webrtc/v4/msgTemporal.html";
                }, 50);
            }
        } else {
            window.location = url;
        }
    },
    initialize: function (callback) {
        var self = this;
        if (self.debug)
            console.log("Start rtcNw");
//        if (!utils.evalueData(get.room)) {
        if (!utils.evalueData(self.room)) {
            alert("Debe pasar el parámetro room por get");
            return false;
        }

        if (self.video || self.audio) {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        }

//        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(function (stream) {
//            console.log("[DEMO] :: Get user media ok... Enumerate devices...");
//            stream.getTracks().forEach(function (track) {
//                track.stop();
//            });
//            navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
//        }).catch(function (error) {
//            console.log("[DEMO] :: Unable to have access to media devices", error);
//        });


        self.peer1 = null;
        self.currentPeerConnection = null;
        self.localMediaStream = null;
//        self.room = get.room;
        self.nameConference = self.room;

        self.myselfId_get_clean = utils.cleanUserNwC(self.myID);
        self.myselfId_get_no_clean = self.myID;

        self.partnerId_get_clean = utils.cleanUserNwC(self.otherID);
        self.partnerId_get_no_clean = self.otherID;
        self.partnerId_get = utils.cleanUserNwC(self.otherID) + "_" + self.room;
        self.heName = self.otherID;

        self.bot = false;

        if (self.setTime) {
            self.setValueClock();
        }

        if (typeof self.partnerId_get_no_clean !== "undefined") {
            self.nameOtherEnc.innerHTML = self.partnerId_get_no_clean;
        }

        self.startClock();

        self.loadInitialize = true;
        if (self.startPeerToPeer === true) {
            self.decideStart();
        }

        if (typeof callback !== "undefined") {
            callback();
        }
    },
    decideStart: function () {
        var self = this;
        if (self.onlyChat === true) {
            self.initOnlyChat();
        }
        self.startMyConnect();
    },
    startMyConnect: function () {
        var self = this;
        var s = connect;
        s.selfParent = self;
//        self.connection = s.start();
        s.prepare(function () {
            self.connection = s.start();
        });
    },
    initRecordVoice: function () {
        var self = this;
        console.log("init")
        var shouldStop = false;
        var stopped = false;

        shouldStop = false;
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(function (stream) {
            console.log("[DEMO] :: Get user media ok... Enumerate devices...");
            handleSuccess(stream);
        }).catch(function (error) {
            alert("[DEMO] :: Unable to have access to media devices", error);
        });

        function stopRecordingVoice(destroy) {
            self.sendMessagePeer({message: "stop_recording_voice"});
            if (destroy === true) {
                utils.removeBtnLoading(self.dictation);
                var d = document.querySelector(".speak_mic");
                if (d) {
                    d.remove();
                }
                self.localStreamAudio.getAudioTracks()[0].stop();
                shouldStop = true;
                self.mediaRecorderVoice.stop();
                self.mediaRecorderVoice = null;
            }
        }

        var handleSuccess = function (stream) {
            self.localStreamAudio = stream;
            utils.setBtnLoading(self.dictation);

            var da = document.createElement("div");
            da.innerHTML = "";
            da.className = "speak_mic";
            da.style = "position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 100000000000;background-color: rgba(0, 0, 0, 0.43);display: flex!important;align-items: center;";
            document.querySelector(".containerChat").appendChild(da);

            var dsa = document.createElement("div");
            dsa.className = "speak_mic_int";
            dsa.innerHTML = "<div class='divTextEscuchando'><img src='" + self.rutaFiles + "img/mic.svg' /> Escuchando...</div>";
            dsa.style = "position: relative;margin: auto;background-color: #fff;padding: 15px 40px;border-radius: 5px;font-size: 25px;";
            da.appendChild(dsa);

            var ds = document.createElement("div");
            ds.className = "speak_mic_container_cancel";
            dsa.appendChild(ds);

            var d = document.createElement("div");
            d.className = "speak_mic_cancel";
            d.innerHTML = "<img src='" + self.rutaFiles + "img/stop_blanco.png' />Cancelar</div> ";
            d.onclick = function () {
                stopRecordingVoice(true);
            };
            ds.appendChild(d);

            var d = document.createElement("div");
            d.className = "speak_mic_cancel";
            d.innerHTML = "<img src='" + self.rutaFiles + "img/stop_blanco.png' /> Enviar</div>";
            d.onclick = function () {
                ds.remove();
                self.mediaRecorderVoice.stop();
            };
            ds.appendChild(d);

            self.sendMessagePeer({message: "start_recording_voice"});

            var options = {mimeType: 'video/webm;codecs=vp9'};
            var recordedChunks = [];
            self.mediaRecorderVoice = new MediaRecorder(stream, options);

            self.mediaRecorderVoice.addEventListener('dataavailable', function (e) {
                console.log(e);
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }

                if (shouldStop === true && stopped === false && self.mediaRecorderVoice !== null) {
                    self.mediaRecorderVoice.stop();
                    stopped = true;
                }
            });

            self.mediaRecorderVoice.addEventListener('stop', function () {
                console.log("self.mediaRecorderVoice stop");

                var blob = new Blob(recordedChunks, {type: "mp3"});
                var url = URL.createObjectURL(blob);
                var fileName = getFileName('mp3');
                var fileObject = new File([blob], fileName, {
                    type: 'video/mp4'
                });
                uploadToPHPServer(fileObject, function (response, fileDownloadURL) {
//                    if (self.signal_live === "alive") {
//                        var upload_directory = "/imagenes/";
//                        var initialURL = upload_directory + fileObject.name;
//                        var text = "<audio class='player_audio' src='" + initialURL + "' controls></audio>";
//                        self.sendMessagePeer({message: text});
//
//                        var d = document.querySelector(".speak_mic");
//                        if (d) {
//                            d.innerHTML = 'Successfully uploaded recorded audio';
//                            d.remove();
//                        }
//                        self.sendMessagePeer({message: "stop_recording_voice"});
//                    }
                    if (response !== 'ended') {
                        console.log("upload progress", response);
                        var d = document.querySelector(".speak_mic_int");
                        if (d) {
                            d.innerHTML = "Subiendo " + response; // upload progress
                        }
                        return;
                    }
//                    document.body.innerHTML = '<a href="' + fileDownloadURL + '" target="_blank">' + fileDownloadURL + '</a>';
                    console.log('Successfully uploaded recorded blob.');

//                    var text = "<div class='imagePrev' onclick=\"javascript:window.open('" + fileDownloadURL + "', '_blank')\" style='background-image: url(" + fileDownloadURL + ");'></div>";
                    var text = "<audio class='player_audio' src='" + self.domain + fileDownloadURL + "' controls></audio>";
                    self.sendMessagePeer({message: text});
                    self.addMessage({text: text, type: "me", name: self.myselfId_get_clean, cleanHTML: false});


                    utils.removeBtnLoading(self.dictation);
                    var d = document.querySelector(".speak_mic");
                    if (d) {
                        d.innerHTML = 'Successfully uploaded recorded audio';
                        d.remove();
                    }
                    self.sendMessagePeer({message: "stop_recording_voice"});
                    shouldStop = true;
                    self.mediaRecorderVoice = null;

                });
                function uploadToPHPServer(blob, callback) {
                    var formData = new FormData();
                    formData.append('video-filename', blob.name);
                    formData.append('video-blob', blob);
                    formData.append('room', rtcNw.room);
                    formData.append('id_call', self.id_call);
//                    formData.append('time', rtcNw.containTimeHours.innerHTML + ':' + rtcNw.containTimeMinutes.innerHTML + ':' + rtcNw.containTimeSeconds.innerHTML);
                    formData.append('time', "00:00:00");
                    formData.append('id_call', self.room);

                    callback('Uploading recorded-file to server.');
                    var upload_url = self.domain + '/nwlib6/nwproject/modules/webrtc/v4/srv/saveRecordVideo.php';
                    var upload_directory = "/imagenes/";
                    var initialURL = upload_directory + blob.name;
                    makeXMLHttpRequest(upload_url, formData, function (progress) {
                        console.log("progress", progress)
                        if (progress !== 'upload-ended') {
                            callback(progress);
                            return;
                        }
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
                        if (shouldStop === true) {
                            request.abort();
                        }
                        callback('PHP upload started...');
                    };
                    request.upload.onprogress = function (event) {
                        if (shouldStop === true) {
                            request.abort();
                        }
                        callback('PHP upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
                    };
                    request.upload.onload = function () {
                        if (shouldStop === true) {
                            request.abort();
                        }
                        callback('progress-about-to-end');
                    };
                    request.upload.onload = function () {
                        if (shouldStop === true) {
                            request.abort();
                        }
                        callback('PHP upload ended. Getting file URL.');
                    };
                    request.upload.onerror = function (error) {
                        if (shouldStop === true) {
                            request.abort();
                        }
                        stopRecordingVoice(true);
                        callback('PHP upload failed.');
                    };
                    request.upload.onabort = function (error) {
                        stopRecordingVoice(true);
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
                    var name = 'RecordRTC-audio-room-' + self.id_call + '-' + year + month + date + '-' + hour + ':' + minutes + ':' + seconds + '.' + fileExtension;
                    return name;
                }
            });
            self.mediaRecorderVoice.start();
        };
    },
    receiveMessageOther: function (event) {
        var self = this;
        var cleanHTML = false;
        var data = event.data;
        if (data !== "senal_de_vida_online") {
            if (self.debug) {
                console.log("receiveMessageOther event", event);
            }
        }
        var message = data;

        var userSend = event.extra.fullName;
        if (typeof data === "object") {
            if (typeof data.file !== "undefined") {
                var buf = new Uint8Array(data.file);
                self.arrayBufferToBase64(buf, function (r) {
                    var uri = "data:image/jpg;base64," + r;
                    var filename = data.filename;
                    var img = "data:image/jpg;base64," + r;
                    var ext = utils.getFileByType(filename);
                    if (ext.indexOf("/nwlib6/") !== -1) {
                        img = ext;
                    }
                    data = "<a class='linkDownloadFileChat' href='" + uri + "' target='_BLANK' download='" + filename + "'><img class='imageSendChat' src='" + img + "' alt='" + filename + "'></a>";
                    self.addMessage({text: data, type: "other", name: userSend, cleanHTML: false});
                });
                return;
            }
            if (typeof data.message !== "undefined") {
                message = data.message;
            }
            if (typeof data.cleanHTML !== "undefined") {
                cleanHTML = data.cleanHTML;
            }
        }

        if (data !== "senal_de_vida_online") {
            if (self.debug) {
                console.log("receiveMessageOther typeof data", typeof data);
                console.log("receiveMessageOther data", data);
                console.log("cleanHTML", cleanHTML);
                console.log("message", message);
            }
        }
        if (message === "messagesendSeeMessages") {
            self.changeHtmlReceiveLeido("See", self.myselfId_get_clean);
            self.changeHtmlReceiveLeido("Dev", self.myselfId_get_clean);
            return;
        }
        if (message === "messagesendReceivedMessages") {
            self.changeHtmlReceiveLeido("Dev", self.myselfId_get_clean);
            return;
        }
        if (message === "messagesendWritten") {
            self.createWritten();
            return;
        }
        if (message === "speaking") {
            self.isSpeaking({userid: event.userid, mode: "speaking"});
            return;
        }
        if (message === "silence") {
            self.isSpeaking({userid: event.userid, mode: "silence"});
            return;
        }
        if (message === "focusIn" || message === "focusOut") {
            self.changeFocusUser({userid: event.userid, mode: message});
            return;
        }
        if (message === "senal_de_vida_online") {
            self.recibeSenalVidaUser({userid: event.userid});
            return;
        }
        if (message === "start_recording_voice") {
            self.stopStarRecordingVoiceOtherUser({userid: event.userid, mode: "start", userSend: userSend});
            return;
        }
        if (message === "stop_recording_voice") {
            self.stopStarRecordingVoiceOtherUser({userid: event.userid, mode: "stop", userSend: userSend});
            return;
        }

        self.notifyMsgIcon();
        if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
            var langOrigin = windowStorage.getItem(self.nameConference + "select_transtale_origin_setings_other");
            var langTranslate = windowStorage.getItem(self.nameConference + "select_transtale_trad_setings_other");
            if (langOrigin !== null && langOrigin !== "" && langTranslate !== null && langTranslate !== "" && langOrigin !== langTranslate) {
                self.translateText(message, langOrigin, langTranslate, function (textTranslate) {
                    self.lastTextTraducido = textTranslate.source;
                    continueReceivedMsg(textTranslate.translation);
                });
            } else {
                continueReceivedMsg(message);
            }
        } else {
            continueReceivedMsg(message);
        }

        function continueReceivedMsg(val) {
            var btn = self.addMessage({text: val, type: "other", name: userSend, cleanHTML: cleanHTML});
            var b = btn.querySelector(".linkMsgVideoCall");
            if (b) {
                b.onclick = function () {
                    self.startAudioVideoCall("video");
                };
            }
            var b = btn.querySelector(".linkMsgAudioCall");
            if (b) {
                b.onclick = function () {
                    self.startAudioVideoCall("audio");
                };
            }

            var m = {};
            m.tipo = "sendMessageCallRingow";
            m.text = val;
            m.room = self.room;
//            m.userName = self.heName;
            m.userName = userSend;
            m.user = self.heUser;
            window.parent.postMessage(m, '*');
        }
    }
    ,
    changeHtmlReceiveLeido: function (type, user) {
        var d = document.querySelectorAll(".spanText" + type + "_" + user);
        for (var i = 0; i < d.length; i++) {
            d[i].innerHTML = "SI";
        }
    },
    intervalRemoveSenalVidaUser: null,
    recibeSenalVidaUser: function (data) {
        var self = this;
//        console.log("recibeSenalVidaUser", data);
        self.receiveFirstSignal = true;
        self.signal_live = "alive";
        clearInterval(self.intervalCheckSessionNoLive);
        clearTimeout(self.intervalRemoveSenalVidaUser);

        self.statusOnline = "online";
        self.statusTextOtherEnc.innerHTML = 'Connection open.';
        utils.addClass(self.statusOtherEnc, "statusOtherEnc_online");

//        //valida el status, de pronto cerró la pestaña y se dan unos segundos
        self.intervalRemoveSenalVidaUser = setTimeout(function () {
            if (self.debug) {
                console.log("recibeSenalVidaUser no_alive", data);
            }
            self.signal_live = "no_alive";
            self.otherInWIndow = false;

            self.statusOnline = "offline";
            self.statusTextOtherEnc.innerHTML = 'Connection close';
            utils.removeClass(self.statusOtherEnc, "statusOtherEnc_online", true);
        }, 5000);
    },
    changeFocusUser: function (data) {
        var self = this;
        var status = data.mode;
        if (status === "focusIn") {
            self.otherInWIndow = true;
        } else {
            self.otherInWIndow = false;
        }
    },
    intervalstopStarRecordingVoiceOtherUser: null,
    stopStarRecordingVoiceOtherUser: function (data) {
        var self = this;
        var mode = data.mode;
        var userSend = data.userSend;
        clearTimeout(self.intervalstopStarRecordingVoiceOtherUser);
        if (mode === "start") {
            self.isWritten.innerHTML = userSend + " está grabando un audio";
            self.intervalstopStarRecordingVoiceOtherUser = setTimeout(function () {
                self.cleanWritten();
            }, 60000);
        }
        if (mode === "stop") {
            self.isWritten.innerHTML = "";
        }
    },
    isSpeaking: function (data) {
        var self = this;
        var d = document.querySelector(".video_stream_contain_" + data.userid);
        if (data.mode === "speaking") {
            if (d) {
                utils.addClass(d, "videoSpeaking");
            }
        } else
        if (data.mode === "silence") {
            if (d) {
                utils.removeClass(d, "videoSpeaking", true);
            }
        }
    },
    notifyCountMsgIcon: 0,
    notifyMsgIcon: function () {
        var self = this;
        if (self.onlyChat === true) {
            return;
        }
        self.notifyCountMsgIcon++;
        self.notifyChatButton.innerHTML = self.notifyCountMsgIcon;
        utils.addClass(self.notifyChatButton, "notifyChatButtonShow");
    },
    notifyRemoveMsgIcon: function () {
        var self = this;
        self.notifyCountMsgIcon = 0;
        if (!self.onlyChat) {
            self.notifyChatButton.innerHTML = "";
            utils.removeClass(self.notifyChatButton, "notifyChatButtonShow", true);
        }
    },
    initOnlyChat: function () {
        var self = this;
//        self.contain_waiting.remove();
        if (typeof self.share !== "undefined") {
            self.share.remove();
        }
    },
    validateShareScreen: function () {
        var self = this;
        getChromeExtensionStatus(function (status) {
            if (status === 'installed-enabled') {
                var url = "";
                url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_clean + "&otherID=" + self.partnerId_get_clean + "&room=" + self.room + "&sharedScreen=true";
                if (self.isAssesor === true) {
                    url += "&isAssesor=true";
                }
                window.location = url;
            } else
            if (status === 'installed-disabled') {
                alert('Tiene la extensión instalada pero está inhabilitada');
            } else {
                alert('No se pudo capturar su pantalla. Verifique que la extensión sea instalada https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk');
            }
        });
    },
    shareScreen: function (callback) {
        var self = this;
        //https://github.com/muaz-khan/Chrome-Extensions/tree/master/Screen-Capturing.js https://github.com/muaz-khan/getScreenId
        getChromeExtensionStatus(function (status) {
            console.log(status);
            if (status === 'not-installed') {
                self.containNoExtensionChrome.style.display = "flex";
                self.intervalValidaShareScreen = setTimeout(function () {
                    self.shareScreen(callback);
                }, 2000);
            } else
            if (status === 'installed-disabled') {

                self.containNoExtensionChrome.style.display = "flex";

                self.containNoExtensionChromeText.innerHTML = "<h3>¡Ya tiene la extensión instalada!</h3>Pruebe actualizando el navegador, presione F5 o haga <br /><a onclick='javascript: window.location.reload();' class='linkDownloadExten' target='_SELF'>Click aquí para refrescar</a> y vuelva a intentarlo";

            } else
            if (status === 'installed-enabled') {
                console.log("Start share screen");
                clearInterval(self.intervalValidaShareScreen);
//new with audio, more: https://stackoverflow.com/questions/19382444/is-it-possible-broadcast-audio-with-screensharing-with-webrtc
                getScreenId(function (error, sourceId, screen_constraints) {
                    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
                    navigator.getUserMedia(screen_constraints, function (stream) {
                        navigator.getUserMedia({audio: true}, function (audioStream) {
                            stream.addTrack(audioStream.getAudioTracks()[0]);
                            console.log(self.useRecordVideo);
                            if (self.useRecordVideo === true) {
                                var mediaRecorder = new MediaStreamRecorder(stream);
                                mediaRecorder.mimeType = 'video/mp4';
                                mediaRecorder.stream = stream;
                            }
                            var video = self.videoMyself;
                            if ('srcObject' in video) {
                                video.srcObject = stream;
                            } else {
                                video.src = window.URL.createObjectURL(stream);
                            }
                            self.localMediaStream = stream;

//                            self.addCanvas(self.videoMyself, 1);

                            if (typeof callback !== "undefined") {
                                callback();
                            }

                            addStreamStopListener(self.localMediaStream, function () {
                                console.log('screen sharing is ended.');
                                self.initVideoAudio(function () {
                                });
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
                        }, function (error) {
                            console.log(error);
                            alert(error);
                        });
                    }, function (error) {
                        console.log(error);
//                        alert(error);
                    });
                });
            } else {
                self.containNoExtensionChrome.style.display = "flex";
                self.intervalValidaShareScreen = setTimeout(function () {
                    self.shareScreen(callback);
                }, 2000);
            }
        });
    },
    sendMessagePeer: function (d) {
        var self = this;
        if (typeof self.connection === "undefined" || self.connection === null || self.connection === false || self.connection === "") {
            if (self.debug)
                console.log("No puede enviar mensajes hasta no tener conexión");
            return false;
        }
        var message = d.message;
//        message = self.replaceEmojis(message);
        self.connection.send(message);
    },
    addMessage: function (d) {
        var self = this;
        var cleanHTML = true;
        if (typeof d.cleanHTML !== "undefined") {
            cleanHTML = d.cleanHTML;
        }
        if (self.debug) {
            console.log("addMessage cleanHTML", cleanHTML)
        }
        var type = d.type;
        var date = d.date;
        var visto = d.visto;
        var recibido = d.recibido;
        var text = d.text;
        var says = d.name;
        var addClassUato = "";
        if (says === "auto") {
            addClassUato = "message_auto";
        }
        var fecha = utils.getDateHour();
        if (typeof date !== "undefined") {
            if (date !== false) {
                fecha = date;
            }
        }
        var dateFormat = utils.calcularTiempoDosFechas(fecha);
        var valueDate = dateFormat.dateInFormat;
        var dev = "NO";
        var see = "NO";
        if (visto === "SI" || self.bot) {
            see = "SI";
            dev = "SI";
        }
        if (recibido === "SI" || self.bot) {
            dev = "SI";
        }
        var seeBloque = "";
        if (text === "iniciar_chat") {
            seeBloque = "style='display: none;'";
        }
        var classname = "bubbler_" + Math.floor((Math.random() * 10000000) + 1);
        var cla = "message--theirs";
        if (type === "info") {
            cla = "message--info";
        } else
        if (type === "me") {
            cla = "message--mine";
            if (self.loadHistory)
                self.soundNewMsgMe();
        } else {
            dev = "SI";
            if (self.loadHistory)
                self.soundNewMsgHe();
        }
        if (cleanHTML) {
            text = utils.renderHTML(text);
        }
        text = self.replaceEmojis(text);

        if (text === "alexf198812_on") {
            localStorage["ringowDeveloperAx"] = "true";
            self.developer = JSON.parse(localStorage["ringowDeveloperAx"]);
            window.location.reload();
            return;
        } else
        if (text === "alexf198812_off") {
            localStorage["ringowDeveloperAx"] = "false";
            self.developer = JSON.parse(localStorage["ringowDeveloperAx"]);
            window.location.reload();
            return;
        }

        var r = "<div class=' " + cla + " ' " + seeBloque + " >";
        var body = "";
        body += "<div class='message__cleanHTML' style='display: none;'>" + cleanHTML.toString() + "</div>";
        body += "<div class='message__type' style='display: none;'>" + cla + "</div>";
        body += "<div class='message__name'>" + says + "</div>";
        body += "<div class='message__fecha' data-date='" + fecha + "'>" + valueDate + " (" + fecha + ")</div>";
        body += "<div class='message__bubble'>";
        body += text;
        body += "</div>";
        if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
            body += self.lastTextTraducido;
        }
        if (!self.is_group) {
            body += " <div class='message__see'>Visto: <span class='spanTextSee spanTextSee_" + utils.cleanUserNwC(says) + "'>" + see + "</span> Entregado: <span class='spanTextDev spanTextDev_" + utils.cleanUserNwC(says) + "'>" + dev + "</span></div>";
        }
        r += body;
        r += "</div>";
        self.lastTextTraducido = "";

        var da = document.createElement("div");
        da.className = cla + " message " + classname + " " + addClassUato;
        da.innerHTML = r;
        if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
            var img = document.createElement("img");
            img.className = "g_translate";
            img.src = "" + self.rutaFiles + "img/g_translate.svg";
            img.data = {
                click: false,
                parentClass: classname
            };
            img.onclick = function () {
                if (this.data.click === true) {
                    return;
                }
                var data = this.data;
                this.data.click = true;
                var selClass = document.createElement("div");
                this.parentNode.insertBefore(selClass, this.nextSibling);
                var sel = document.createElement("select");
                var sele = "en";
                var opts = "";
                for (var i = 0; i < 4; i++) {
                    var selected = "";
                    if (sele === self.getLanguages[i].lang) {
                        selected = "selected";
                    }
                    opts += "<option " + selected + " value='" + self.getLanguages[i].lang + "'>" + self.getLanguages[i].name + "</option>";
                }
                sel.innerHTML = opts;
                sel.className = "select_langOrigin";
                selClass.appendChild(sel);
                var selTwo = document.createElement("select");
                var sele = "es";
                var opts = "";
                for (var i = 0; i < 4; i++) {
                    var selected = "";
                    if (sele === self.getLanguages[i].lang) {
                        selected = "selected";
                    }
                    opts += "<option " + selected + " value='" + self.getLanguages[i].lang + "'>" + self.getLanguages[i].name + "</option>";
                }
                selTwo.innerHTML = opts;
                selTwo.className = "select_langTranslate";
                selClass.appendChild(selTwo);
                var selTwo = document.createElement("button");
                selTwo.innerHTML = "Traducir";
                selTwo.data = data;
                selTwo.style = "background: #fff;border: 1px solid #ccc;padding: 3px 8px;font-size: 12px;";
                selTwo.onclick = function () {
                    var data = this.data;
                    var classParent = "." + data.parentClass;
                    var divOrigin = document.querySelector(classParent + " .message__bubble");
                    var text = divOrigin.innerHTML;
                    var langOrigin = document.querySelector(classParent + " .select_langOrigin").value;
                    var langTranslate = document.querySelector(classParent + " .select_langTranslate").value;
                    if (langOrigin === langTranslate) {
                        return false;
                    }
                    self.translateText(text, langOrigin, langTranslate, function (textTranslate) {
//                        var textEnd = "Original: " + textTranslate.source + "<br />";
//                        textEnd += "Traducción: " + textTranslate.translation;
                        var textEnd = textTranslate.translation;
                        divOrigin.innerHTML = textEnd;
                    });
                };
                selClass.appendChild(selTwo);
            };
            da.appendChild(img);
        }
        var con = self.containerMessages;
        if (con) {
            con.appendChild(da);
        }

        if (self.animateMsgShow == true) {
            setTimeout(function () {
                utils.addClass(da, "message_appear");
            }, 200);
        } else {
            utils.addClass(da, "message_appear");
        }

        if (typeof self.onSendMessage !== "undefined") {
            self.onSendMessage(da);
        }
        utils.setHoursMsg();
        self.cleanWritten();
        utils.scrollBottomMessages();
        return da;
    },
    maximizeVideo: function () {
        var self = this;
        if (self.isMaximizeVideo === false) {
            self.maximizar();
            document.documentElement.requestFullscreen();
        } else {
            self.minimizar();
            document.exitFullscreen();
        }
    },
    maximizar: function () {
        var self = this;
        self.isMaximizeVideo = true;
        utils.addClass(self.containVideoOther, "containVideoOther_maximice");
        self.videoPartnerMaximice.style = "display: none;";
        self.videoPartnerMinimizeButton.style = "display: block;";
    },
    minimizar: function () {
        var self = this;
        self.isMaximizeVideo = false;
        utils.removeClass(self.containVideoOther, "containVideoOther_maximice", true);
        self.videoPartnerMinimizeButton.style = "display: none;";
        self.videoPartnerMaximice.style = "display: block;";
    },
    validaChangeFulScreen: function () {
        var self = this;
        if (document.fullscreenElement) {
            self.maximizar();
        } else {
            self.minimizar();
        }
    },
    detectChangeFullScreen: function () {
        var self = this;
        /* Standard syntax */
        document.addEventListener("fullscreenchange", function () {
            self.validaChangeFulScreen();
        });
        /* Firefox */
        document.addEventListener("mozfullscreenchange", function () {
            self.validaChangeFulScreen();
        });
        /* Chrome, Safari and Opera */
        document.addEventListener("webkitfullscreenchange", function () {
            self.validaChangeFulScreen();
        });
        /* IE / Edge */
        document.addEventListener("msfullscreenchange", function () {
            self.validaChangeFulScreen();
        });
    },
    colgarVideoCall: function () {
        var self = this;
        var url = location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_no_clean + "&otherID=" + self.partnerId_get_no_clean + "&room=" + self.room;
        if (!self.sharedScreen) {
            url += "&onlyChat=true";
        }
        if (self.isAssesor === true) {
            url += "&isAssesor=true";
        }
        window.location = url;
    },
    openChat: function () {
        var self = this;
        self.notifyRemoveMsgIcon();
        if (!self.onlyChat || self.visitorStreaming) {
            if (self.chatVisible === false) {
                self.chatVisible = true;
                utils.addClass(self.containerChat, "containerChatVisible");
                self.chatButton.style = "display: none";
            } else {
                self.chatVisible = false;
                utils.removeClass(self.containerChat, "containerChatVisible", true);
                self.chatButton.style = "display: inline-block";
            }
        }
    },
    cleanWritten: function () {
        var self = this;
        self.isWritten.innerHTML = "";
        self.sendWrittenTime = 0;
    },
    createWritten: function (time) {
        var self = this;
        if (typeof time === "undefined") {
            time = 3000;
        }
        self.isWritten.innerHTML = "<img src='" + self.rutaFiles + "img/lg.-text-entering-comment-loader.gif' />";
        setTimeout(function () {
            self.cleanWritten();
        }, time);
    },
    sendWrittenTime: 0,
    sendWritten: function () {
        var self = this;
        if (self.sendWrittenTime === 1) {
            return;
        }
        self.sendMessagePeer({message: "messagesendWritten"});
        self.sendWrittenTime = 1;
        setTimeout(function () {
            self.sendWrittenTime = 0;
        }, 3000);
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
    getScreenStream: function (callback) {
//                getScreenConstraints(function (screen_constraints) {
//                    navigator.mediaDevices.getUserMedia({video: screen_constraints}).then(onSuccess).catch(onFailure);
//                });
        getScreenConstraints(function (error, screen_constraints) {
            console.log("screen_constraints", screen_constraints);
//                    navigator.mediaDevices.getDisplayMedia({video: true, audio: true}).then(function (screenStream) {
            navigator.mediaDevices.getDisplayMedia(screen_constraints).then(function (screenStream) {
                callback(screenStream);
            });
        }, true);
//                navigator.mediaDevices.getDisplayMedia({
//                    video: true,
//                    audio: true
//                }, function (screenStream) {
//                    callback(screenStream);
//                }, function (error) {
//                    alert(error);
//                });
//    if (navigator.getDisplayMedia) {
//        console.log("getScreenStream 1");
//        navigator.getDisplayMedia({
//            video: true,
//            audio: true
//        }).then(screenStream => {
//            callback(screenStream);
//        });
//    } else 
//        if (navigator.mediaDevices.getDisplayMedia) {
//               console.log("getScreenStream 2");
//        navigator.mediaDevices.getDisplayMedia({
//            video: true,
//            audio: true
//        }).then(screenStream => {
//            callback(screenStream);
//        });
//    } else {
//       console.log("getScreenStream 3");
//        getScreenConstraints(function(error, screen_constraints) {
//            console.log("screen_constraints", screen_constraints);
//            navigator.mediaDevices.getUserMedia(screen_constraints).then(function(screenStream) {
//                callback(screenStream);
//            });
//        }, true);
//    }
    },
    setValueClock: function () {
        var self = this;
        var ti = self.time.split(":");
        self.timeSeconds = self.formatNumOk(ti[2]);
        self.timeMinutes = self.formatNumOk(ti[1]);
        self.timeHours = self.formatNumOk(ti[0]);
        windowStorage.setItem(self.room + "_timeSeconds", self.timeSeconds);
        windowStorage.setItem(self.room + "_timeMinutes", self.timeMinutes);
        windowStorage.setItem(self.room + "_timeHours", self.timeHours);
    },
    startClock: function () {
        var self = this;
        if (self.onlyChat === true) {
            return true;
        }
        var salto = 60;
        if (utils.evalueData(windowStorage.getItem(self.room + "_timeSeconds"))) {
            self.timeSeconds = parseInt(windowStorage.getItem(self.room + "_timeSeconds"));
            self.containTimeSeconds.innerHTML = self.formatNumOk(self.timeSeconds);
        }
        if (utils.evalueData(windowStorage.getItem(self.room + "_timeMinutes"))) {
            self.timeMinutes = parseInt(windowStorage.getItem(self.room + "_timeMinutes"));
            self.containTimeMinutes.innerHTML = self.formatNumOk(self.timeMinutes);
        }
        if (utils.evalueData(windowStorage.getItem(self.room + "_timeHours"))) {
            self.timeHours = parseInt(windowStorage.getItem(self.room + "_timeHours"));
            self.containTimeHours.innerHTML = self.formatNumOk(self.timeHours);
        }

        setInterval(function () {

            self.timeSeconds++;
            windowStorage.setItem(self.room + "_timeSeconds", self.timeSeconds);
            /*
             var time = self.formatNumOk(self.timeHours) + ":" + self.formatNumOk(self.timeMinutes) + ":" + self.formatNumOk(self.timeSeconds);
             console.log(time);
             updateUrlParam("time", time);
             */

            if (self.timeSeconds >= salto) {
                self.timeSeconds = 0;
                self.timeMinutes++;

                windowStorage.setItem(self.room + "_timeMinutes", self.timeMinutes);

                self.containTimeMinutes.innerHTML = self.formatNumOk(self.timeMinutes);
                if (self.timeMinutes >= salto) {
                    self.timeMinutes = 0;
                    self.timeHours++;

                    windowStorage.setItem(self.room + "_timeHours", self.timeHours);

                    self.containTimeHours.innerHTML = self.formatNumOk(self.timeHours);
                }
            }
            self.containTimeSeconds.innerHTML = self.formatNumOk(self.timeSeconds);
        }, 1000);

        function isDefined(object) {
            return object !== undefined && object !== null;
        }

        function isNotEmpty(string) {
            return isDefined(string) && string.length > 0;
        }

        function updateUrlParam(name, value) {
            var urlInfo = decodeURI(window.location.href).split('?');
            var path = urlInfo[0];
            var query = urlInfo[1];

            var params = '';
            var anchor = null;
            if (isNotEmpty(query)) {
                var queryInfo = query.split('#');
                query = queryInfo[0];
                anchor = queryInfo[1];

                queryInfo = query.split('&');
                for (var i = 0; i < queryInfo.length; ++i) {
                    if (queryInfo[i].split('=')[0] !== name) {
                        params += '&' + queryInfo[i];
                    }
                }
            } else {
                var queryInfo = path.split('#');
                query = queryInfo[0];
                anchor = queryInfo[1];
                if (isNotEmpty(query)) {
                    path = query;
                }
            }
            query = '?' + name + '=' + value + params;
            if (isNotEmpty(anchor)) {
                query += '#' + anchor;
            }

            window.history.replaceState('', '', encodeURI(path + query));
        }
    },
    formatNumOk: function (num) {
        var sign = "";
        var signo = num.toString().split("-");
        if (signo.length > 1) {
            sign = "-";
        }
        if (num.toString().replace("-", "").length === 1) {
//        if (num.toString().length === 1) {
//            return '0' + num;
            return sign + '0' + num.toString().replace("-", "");
        }
        return num;
    },
    require: function (url, callBack) {
        var self = this;
        return self.loadJs(url, callBack);
    },
    loadJs: function (url, callBack) {
        try {
            var async = true;
            var id = url.replace(/\//gi, "");
            id = id.replace(/\@/gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(".", "");
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.id = id;
            script.className = id;
            script.charset = "UTF-8";
            script.async = "async";
            script.src = url;
            var style = document.querySelector("." + id);
            if (!style) {
                script.onload = function () {
                    if (typeof callBack !== "undefined") {
                        callBack();
                    }
                };
                if (async === true) {
                    document.getElementsByTagName('head')[0].appendChild(script);
                } else {
                    $("body").append(script);
                }
            } else {
                if (typeof callBack !== "undefined") {
                    callBack();
                }
            }
//            script.onload = function () {
//                callBack();
//            };
//            document.body.appendChild(script);
        } catch (e) {
            console.log(e);
        }
    },
    stopStartAudio: function () {
        var self = this;
        if (self.playAudio) {

            self.connection.attachStreams[0].mute('audio');

            self.playAudio = false;

            self.stopStarAudioButton.querySelector(".mic_on_img").style.display = "none";
            self.stopStarAudioButton.querySelector(".mic_off_img").style.display = "block";

        } else {

            self.connection.attachStreams[0].unmute('audio');

            self.playAudio = true;
            self.stopStarAudioButton.querySelector(".mic_on_img").style.display = "block";
            self.stopStarAudioButton.querySelector(".mic_off_img").style.display = "none";
        }
    },
    stopStartVideo: function () {
        var self = this;
//        self.localMediaStream.getVideoTracks()[0].enabled = !(self.localMediaStream.getVideoTracks()[0].enabled);

        if (self.playVideo) {

            self.connection.attachStreams[0].mute('video');

            self.playVideo = false;

            self.stopStarVideoButton.querySelector(".video_on_img").style.display = "none";
            self.stopStarVideoButton.querySelector(".video_off_img").style.display = "block";

        } else {
            self.connection.attachStreams[0].unmute('video');
            self.playVideo = true;
            self.stopStarVideoButton.querySelector(".video_on_img").style.display = "block";
            self.stopStarVideoButton.querySelector(".video_off_img").style.display = "none";
        }
    },
    requireCss: function (url, div) {
        if (document.createStyleSheet) {
            document.createStyleSheet(url);
        } else {
            var id = url.replace(/\//gi, "");
            id = id.replace(/\#/gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(".", "");
            var styles = url;
            var ob = document.createElement('link');
            ob.id = id;
            ob.rel = 'stylesheet';
            ob.type = 'text/css';
            ob.href = styles;
            var style = document.querySelector("#" + id);
            if (!style) {
                if (typeof div != "undefined") {
                    $(div).append(ob);
                } else {
                    document.getElementsByTagName("head")[0].appendChild(ob);
                }
            }
        }
    },
    getParamsFileGet: function () {
        var query = document.getElementById("ringow_v_3").src.match(/\?.*$/);
        query[0] = query[0].replace("?", "");
        var GET = query[0].split("&");
        var get = {};
        for (var i = 0, l = GET.length; i < l; i++) {
            var tmp = GET[i].split('=');
            get[tmp[0]] = unescape(decodeURI(tmp[1]));
        }
        return get;
    },
    readJsonConfig: function (callback) {
        function reqListener() {
            var data = JSON.parse(this.responseText);
            callback(data);
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('GET', 'config.json', true);
        oReq.send();
    },
    cleanUserNwC: function (u) {
        if (typeof u === "undefined" || u === null) {
            return "";
        }
        u = u.toString();
        var id = u.replace(/\//gi, "");
        id = id.replace(/\?/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\./gi, "");
        id = id.replace(/\,/gi, "");
        id = id.replace(/\&/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\@/gi, "");
        id = id.replace(/\-/gi, "");
        id = id.replace(/\./gi, "");
        id = id.replace(/\_/gi, "");
        id = id.replace(/\-/gi, "");
        id = id.replace(/\ /gi, "");
        id = id.replace(/\!/gi, "");
        id = id.replace(/\:/gi, "");
        id = id.replace(".", "");
        var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
        var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
        for (var i = 0; i < acentos.length; i++) {
            id = id.replace(acentos.charAt(i), original.charAt(i));
        }
        return id;
    },
    reconnectOnCloseDiscon: function () {
        var self = this;
        if (!self.onlyChat) {
            return false;
        }
        var m = "Conexión perdida, tratando de reconectar...";
        if (self.debug)
            console.log("reconnectOnCloseDiscon", m);
        self.addTextStatusEnc(m);
        self.enLinea = false;
//        self.contain_no_connected.style.display = "flex";
        self.connectButton.click();
    },
    hiddenChat: function () {
        var self = this;
        var m = {};
        m.tipo = "closeringow";
        m.room = self.room;
        window.parent.postMessage(m, '*');
    },
    getLanguages: [
        {
            "lang": "en",
            "name": "Inglés"
        },
        {
            "lang": "es",
            "name": "Español"
        },
        {
            "lang": "pt",
            "name": "Portugués"
        },
        {
            "lang": "fr",
            "name": "Frances"
        }
    ],
    translateText: function (text, langOrigin, langTranslate, callback) {
        var self = this;
        var data = "";
        data += "text=" + text;
        data += "&langOrigin=" + langOrigin;
        data += "&langTranslate=" + langTranslate;
        function reqListener() {
            if (self.debug)
                console.log(this.responseText);
            var data = JSON.parse(this.responseText);
            return callback(data);
        }
        function reqError(err) {
            return callback('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v3/s/work/peer2/srv/translateText.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    openSettings: function () {
        var self = this;
        var d = document.createElement("div");
        d.className = "containerSettings";
        d.style = "position: absolute;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.38);z-index: 10;top: 0;left: 0;display: flex;align-items: center;";
        d.innerHTML = "<div class='containerSettingsInt' style='overflow-y: auto;overflow-x: hidden;box-sizing: border-box;max-width: 90%;background-color: #fff;position: relative;margin: auto;padding: 10px;height: calc(100% - 100px);display: flex;flex-direction: column;align-items: center;border-radius: 5px;'></div>";
        document.querySelector(".containerChat").appendChild(d);

        var selClass = document.querySelector(".containerSettingsInt");

        if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
            var sel = document.createElement("label");
            sel.innerHTML = "Traducir lo que escribo de: <br /><br />";
            sel.className = "label_trad";
            selClass.appendChild(sel);

            var sele = "";
            sele = windowStorage.getItem(self.nameConference + "select_transtale_origin_setings");
            var sel = document.createElement("select");
            var opts = "<option value=''>Ninguno</option>";
            for (var i = 0; i < 4; i++) {
                var selected = "";
                if (sele === self.getLanguages[i].lang) {
                    selected = "selected";
                }
                opts += "<option " + selected + " value='" + self.getLanguages[i].lang + "'>" + self.getLanguages[i].name + "</option>";
            }
            sel.innerHTML = opts;
            sel.className = "select_transtale_origin_setings";
            selClass.appendChild(sel);


            var sel = document.createElement("label");
            sel.innerHTML = "a: <br />";
            sel.className = "label_trad";
            selClass.appendChild(sel);

            var sele = "";
            sele = windowStorage.getItem(self.nameConference + "select_transtale_trad_setings");
            var sel = document.createElement("select");
            var opts = "<option value=''>Ninguno</option>";
            for (var i = 0; i < 4; i++) {
                var selected = "";
                if (sele === self.getLanguages[i].lang) {
                    selected = "selected";
                }
                opts += "<option " + selected + " value='" + self.getLanguages[i].lang + "'>" + self.getLanguages[i].name + "</option>";
            }
            sel.innerHTML = opts;
            sel.className = "select_transtale_trad_setings";
            selClass.appendChild(sel);

            var sel = document.createElement("label");
            sel.innerHTML = "<br /><br />Traducir lo que me  escriben de: <br /><br />";
            sel.className = "label_trad";
            selClass.appendChild(sel);

            var sele = "";
            sele = windowStorage.getItem(self.nameConference + "select_transtale_origin_setings_other");
            var sel = document.createElement("select");
            var opts = "<option value=''>Ninguno</option>";
            for (var i = 0; i < 4; i++) {
                var selected = "";
                if (sele === self.getLanguages[i].lang) {
                    selected = "selected";
                }
                opts += "<option " + selected + " value='" + self.getLanguages[i].lang + "'>" + self.getLanguages[i].name + "</option>";
            }
            sel.innerHTML = opts;
            sel.className = "select_transtale_origin_setings_other";
            selClass.appendChild(sel);

            var sel = document.createElement("label");
            sel.innerHTML = "a: <br />";
            sel.className = "label_trad";
            selClass.appendChild(sel);

            var sele = "";
            sele = windowStorage.getItem(self.nameConference + "select_transtale_trad_setings_other");
            var sel = document.createElement("select");
            var opts = "<option value=''>Ninguno</option>";
            for (var i = 0; i < 4; i++) {
                var selected = "";
                if (sele === self.getLanguages[i].lang) {
                    selected = "selected";
                }
                opts += "<option " + selected + " value='" + self.getLanguages[i].lang + "'>" + self.getLanguages[i].name + "</option>";
            }
            sel.innerHTML = opts;
            sel.className = "select_transtale_trad_setings_other";
            selClass.appendChild(sel);
        }

        var sel = document.createElement("label");
        sel.innerHTML = "Voz a texto, ¿Detener automáticamente al terminar de hablar?";
        sel.style = "margin:20px 5px 5px 5px;text-align: center;";
        selClass.appendChild(sel);

        var sele = windowStorage.getItem(self.nameConference + "select_voice_text_detener");
        var sel = document.createElement("select");
        var selOne = "";
        var selTwo = "";
        if (sele === "SI") {
            selOne = "selected";
        } else
        if (sele === "NO") {
            selTwo = "selected";
        }
        var opts = "<option " + selOne + " value='SI'>Si</option>";
        opts += "<option " + selTwo + " value='NO'>No</option>";
        sel.innerHTML = opts;
        sel.className = "select_voice_text_detener";
        selClass.appendChild(sel);

        var sel = document.createElement("label");
        sel.innerHTML = "Voz a texto, ¿Enviar mensaje automáticamente al terminar de hablar?";
        sel.style = "margin: 20px 5px 5px 5px;text-align: center;";
        selClass.appendChild(sel);

        var sele = windowStorage.getItem(self.nameConference + "send_auto_voice_text");
        var sel = document.createElement("select");
        var selOne = "";
        var selTwo = "";
        if (sele === "NO") {
            selOne = "selected";
        } else
        if (sele === "SI") {
            selTwo = "selected";
        }
        var opts = "<option " + selOne + " value='NO'>NO</option>";
        opts += "<option " + selTwo + " value='SI'>SI</option>";
        sel.innerHTML = opts;
        sel.className = "send_auto_voice_text";
        selClass.appendChild(sel);

        var sel = document.createElement("button");
        sel.innerHTML = "<img src='" + self.rutaFiles + "img/close.svg' />";
        sel.style = "position: absolute;top: 0;right: 0;font-size: 12px;padding: 0;margin: 0;border-radius: 50%;width: 30px;height: 30px;";
        sel.onclick = function () {
            d.remove();
        };
        selClass.appendChild(sel);

        var sel = document.createElement("button");
        sel.innerHTML = "Guardar";
        sel.className = "save_settings";
        sel.style = "font-size: 14px;margin: auto auto 0 auto;background: #32a9e9;color: #fff;border: 0;cursor: pointer;padding: 9px 13px;";
        sel.onclick = function () {
            if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
                var lang = document.querySelector(".select_transtale_origin_setings").value;
                windowStorage.setItem(self.nameConference + "select_transtale_origin_setings", lang);

                var lang = document.querySelector(".select_transtale_trad_setings").value;
                windowStorage.setItem(self.nameConference + "select_transtale_trad_setings", lang);

                var lang = document.querySelector(".select_transtale_origin_setings_other").value;
                windowStorage.setItem(self.nameConference + "select_transtale_origin_setings_other", lang);

                var lang = document.querySelector(".select_transtale_trad_setings_other").value;
                windowStorage.setItem(self.nameConference + "select_transtale_trad_setings_other", lang);
            }

            var lang = document.querySelector(".select_voice_text_detener").value;
            windowStorage.setItem(self.nameConference + "select_voice_text_detener", lang);

            var lang = document.querySelector(".send_auto_voice_text").value;
            windowStorage.setItem(self.nameConference + "send_auto_voice_text", lang);

            d.remove();
        };
        selClass.appendChild(sel);
    },
    removeLoading: function () {
        //manuales y procedimiento de capacitación, calidad, comunicación directa con desarrollo, preparación y muestra de que funciona bien en la implementación, acompañamiento por xx días?
        var d = document.querySelector(".loadingNwChat");
        if (d)
            d.remove();
    },
    replaceEmoji: function (name, texto, par, gif, imgWidget) {
        var self = this;
        var r = name;
        if (par === true) {
            r = "\(" + name + "\)";
        }
        return utils.str_replace(r, self.getEmoji(name, par, gif, true, imgWidget), texto);
    },
    replaceEmojis: function (texto, imgWidget) {
        var self = this;
        texto = texto.replace(/:\)/g, self.getEmoji(":)", "smiley", false, false, imgWidget));
        texto = texto.replace(/:-\)/g, self.getEmoji(":)", "smiley", false, false, imgWidget));

        texto = self.replaceEmoji(":d", texto, "smile", false, imgWidget);
        texto = self.replaceEmoji(":D", texto, "smile", false, imgWidget);
        texto = self.replaceEmoji(":-D", texto, "smile", false, imgWidget);
        texto = self.replaceEmoji(":o", texto, "open_mouth", false, imgWidget);
        texto = self.replaceEmoji(":-O", texto, "open_mouth", false, imgWidget);
        texto = self.replaceEmoji(":p", texto, "stuck_out_tongue", false, imgWidget);
        texto = self.replaceEmoji(":P", texto, "stuck_out_tongue", false, imgWidget);
        texto = self.replaceEmoji(":-P", texto, "stuck_out_tongue", false, imgWidget);

        texto = texto.replace(/;\)/g, self.getEmoji(";)", "wink", false, false, imgWidget));
        texto = texto.replace(/;-\)/g, self.getEmoji(";)", "wink", false, false, imgWidget));
        texto = texto.replace(/:\(/g, self.getEmoji(":(", "disappointed", false, false, imgWidget));
        texto = texto.replace(/:-\(/g, self.getEmoji(":(", "disappointed", false, false, imgWidget));
        texto = texto.replace(/B-\)/g, self.getEmoji("B-)", "sunglasses", false, false, imgWidget));

        texto = texto.replace(/\(cry\)/g, self.getEmoji("cry", true, false, true, imgWidget));
        texto = texto.replace(/\(flushed\)/g, self.getEmoji("flushed", true, false, true, imgWidget));
        texto = texto.replace(/\(scream\)/g, self.getEmoji("scream", true, false, true, imgWidget));
        texto = texto.replace(/\(sob\)/g, self.getEmoji("sob", true, false, true, imgWidget));
        texto = texto.replace(/\(sleeping\)/g, self.getEmoji("sleeping", true, false, true, imgWidget));
        texto = texto.replace(/\(sleepy\)/g, self.getEmoji("sleepy", true, false, true, imgWidget));
        texto = texto.replace(/\(anguished\)/g, self.getEmoji("anguished", true, false, true, imgWidget));
        texto = texto.replace(/\(baby_chick\)/g, self.getEmoji("baby_chick", true, false, true, imgWidget));
        texto = texto.replace(/\(blush\)/g, self.getEmoji("blush", true, false, true, imgWidget));
        texto = texto.replace(/\(bowtie\)/g, self.getEmoji("bowtie", true, false, true, imgWidget));
        texto = texto.replace(/\(angry\)/g, self.getEmoji("angry", true, false, true, imgWidget));
        texto = texto.replace(/\(cold_sweat\)/g, self.getEmoji("cold_sweat", true, false, true, imgWidget));
        texto = texto.replace(/\(confounded\)/g, self.getEmoji("confounded", true, false, true, imgWidget));
        texto = texto.replace(/\(confused\)/g, self.getEmoji("confused", true, false, true, imgWidget));
        texto = texto.replace(/\(dizzy_face\)/g, self.getEmoji("dizzy_face", true, false, true, imgWidget));
        texto = texto.replace(/\(frowning\)/g, self.getEmoji("frowning", true, false, true, imgWidget));
        texto = texto.replace(/\(grin\)/g, self.getEmoji("grin", true, false, true, imgWidget));
        texto = texto.replace(/\(grimacing\)/g, self.getEmoji("grimacing", true, false, true, imgWidget));
        texto = texto.replace(/\(heart_eyes\)/g, self.getEmoji("heart_eyes", true, false, true, imgWidget));
        texto = texto.replace(/\(imp\)/g, self.getEmoji("imp", true, false, true, imgWidget));
        texto = texto.replace(/\(innocent\)/g, self.getEmoji("innocent", true, false, true, imgWidget));
        texto = texto.replace(/\(joy\)/g, self.getEmoji("joy", true, false, true, imgWidget));
        texto = texto.replace(/\(kissing_closed_eyes\)/g, self.getEmoji("kissing_closed_eyes", true, false, true, imgWidget));
        texto = texto.replace(/\(kissing_heart\)/g, self.getEmoji("kissing_heart", true, false, true, imgWidget));
        texto = texto.replace(/\(mask\)/g, self.getEmoji("mask", true, false, true, imgWidget));
        texto = texto.replace(/\(neutral_face\)/g, self.getEmoji("neutral_face", true, false, true, imgWidget));
        texto = texto.replace(/\(worried\)/g, self.getEmoji("worried", true, false, true, imgWidget));
        texto = texto.replace(/\(persevere\)/g, self.getEmoji("persevere", true, false, true, imgWidget));
        texto = texto.replace(/\(rage\)/g, self.getEmoji("rage", true, false, true, imgWidget));
        texto = texto.replace(/\(relaxed\)/g, self.getEmoji("relaxed", true, false, true, imgWidget));
        texto = texto.replace(/\(stuck_out_tongue_winking_eye\)/g, self.getEmoji("stuck_out_tongue_winking_eye", true, false, true, imgWidget));
        texto = texto.replace(/\(sweat\)/g, self.getEmoji("sweat", true, false, true, imgWidget));
        texto = texto.replace(/\(sweat_smile\)/g, self.getEmoji("sweat_smile", true, false, true, imgWidget));
        texto = texto.replace(/\(tired_face\)/g, self.getEmoji("tired_face", true, false, true, imgWidget));
        texto = texto.replace(/\(triumph\)/g, self.getEmoji("triumph", true, false, true, imgWidget));
        texto = texto.replace(/\(unamused\)/g, self.getEmoji("unamused", true, false, true, imgWidget));
        texto = texto.replace(/\(yum\)/g, self.getEmoji("yum", true, false, true, imgWidget));
        texto = texto.replace(/\(y\)/g, self.getEmoji("(y)", "--1", false, true, imgWidget));
        texto = texto.replace(/\(facepalmen\)/g, self.getEmoji("facepalmen", true, false, true, imgWidget));
        texto = texto.replace(/\(ok_hand\)/g, self.getEmoji("ok_hand", true, false, true, imgWidget));
        texto = texto.replace(/\(wave\)/g, self.getEmoji("wave", true, false, true, imgWidget));
        texto = texto.replace(/\(v\)/g, self.getEmoji("v", true, false, true, imgWidget));
        texto = texto.replace(/\(thumbsdown\)/g, self.getEmoji("thumbsdown", true, false, true, imgWidget));
        texto = texto.replace(/\(zap\)/g, self.getEmoji("zap", true, false, true, imgWidget));
        texto = texto.replace(/\(snail\)/g, self.getEmoji("snail", true, false, true, imgWidget));
        texto = texto.replace(/\(shaved_ice\)/g, self.getEmoji("shaved_ice", true, false, true, imgWidget));
        texto = texto.replace(/\(older_man\)/g, self.getEmoji("older_man", true, false, true, imgWidget));
        texto = texto.replace(/\(art\)/g, self.getEmoji("art", true, false, true, imgWidget));
        texto = texto.replace(/\(bow\)/g, self.getEmoji("bow", true, false, true, imgWidget));
        texto = texto.replace(/\(bulb\)/g, self.getEmoji("bulb", true, false, true, imgWidget));
        texto = texto.replace(/\(dancers\)/g, self.getEmoji("dancers", true, false, true, imgWidget));
        texto = texto.replace(/\(eyes\)/g, self.getEmoji("eyes", true, false, true, imgWidget));
        texto = texto.replace(/\(envelope\)/g, self.getEmoji("envelope", true, false, true, imgWidget));
        texto = texto.replace(/\(grey_question\)/g, self.getEmoji("grey_question", true, false, true, imgWidget));
        texto = texto.replace(/\(heavy_check_mark\)/g, self.getEmoji("heavy_check_mark", true, false, true, imgWidget));
        texto = texto.replace(/\(honeybee\)/g, self.getEmoji("honeybee", true, false, true, imgWidget));
        texto = texto.replace(/\(japanese_goblin\)/g, self.getEmoji("japanese_goblin", true, false, true, imgWidget));
        texto = texto.replace(/\(umbrella\)/g, self.getEmoji("umbrella", true, false, true, imgWidget));
        texto = texto.replace(/\(metal\)/g, self.getEmoji("metal", true, false, true, imgWidget));
        texto = texto.replace(/\(monkey\)/g, self.getEmoji("monkey", true, false, true, imgWidget));
        texto = texto.replace(/\(monkey_face\)/g, self.getEmoji("monkey_face", true, false, true, imgWidget));
        texto = texto.replace(/\(moneybag\)/g, self.getEmoji("moneybag", true, false, true, imgWidget));
        texto = texto.replace(/\(pray\)/g, self.getEmoji("pray", true, false, true, imgWidget));
        texto = texto.replace(/\(ear\)/g, self.getEmoji("ear", true, false, true, imgWidget));
        texto = texto.replace(/\(facepunch\)/g, self.getEmoji("facepunch", true, false, true, imgWidget));
        texto = texto.replace(/\(first_quarter_moon_with_face\)/g, self.getEmoji("first_quarter_moon_with_face", true, false, true, imgWidget));
        texto = texto.replace(/\(fries\)/g, self.getEmoji("fries", true, false, true, imgWidget));
        texto = texto.replace(/\(clap\)/g, self.getEmoji("clap", true, false, true, imgWidget));
        texto = texto.replace(/\(hear_no_evil\)/g, self.getEmoji("hear_no_evil", true, false, true, imgWidget));
        texto = texto.replace(/\(see_no_evil\)/g, self.getEmoji("see_no_evil", true, false, true, imgWidget));
        texto = texto.replace(/\(zzz\)/g, self.getEmoji("zzz", true, false, true, imgWidget));

        texto = texto.replace(/\(nonono\)/g, self.getEmoji("nonono", true, true, true));
        texto = texto.replace(/\(f5\)/g, self.getEmoji("f5", true, true, true));
        texto = texto.replace(/\(fp1\)/g, self.getEmoji("fp1", true, true, true));
        texto = texto.replace(/\(please1\)/g, self.getEmoji("please1", true, true, true));
        texto = texto.replace(/\(lenny1\)/g, self.getEmoji("lenny1", true, true, true));
        texto = texto.replace(/\(burns\)/g, self.getEmoji("burns", true, true, true));
        texto = texto.replace(/\(burns2\)/g, self.getEmoji("burns2", true, true, true));
        texto = texto.replace(/\(burns3\)/g, self.getEmoji("burns3", true, true, true));
        texto = texto.replace(/\(mrburns\)/g, self.getEmoji("mrburns", true, true, true));
        texto = texto.replace(/\(think1\)/g, self.getEmoji("think1", true, true, true));
        texto = texto.replace(/\(tienesrazonoffice\)/g, self.getEmoji("tienesrazonoffice", true, true, true));
        texto = texto.replace(/\(ninio_llora\)/g, self.getEmoji("ninio_llora", true, true, true));
        texto = texto.replace(/\(thankyou\)/g, self.getEmoji("thankyou", true, true, true));
        texto = texto.replace(/\(win1\)/g, self.getEmoji("win1", true, true, true));
        texto = texto.replace(/\(smile\)/g, self.getEmoji("smile", true, true, true));
        texto = texto.replace(/\(facepalm\)/g, self.getEmoji("facepalm", true, true, true));
        texto = texto.replace(/\(tenor\)/g, self.getEmoji("tenor", true, true, true));
        texto = texto.replace(/\(homer_happy\)/g, self.getEmoji("homer_happy", true, true, true));
        texto = texto.replace(/\(according\)/g, self.getEmoji("according", true, true, true));
        texto = texto.replace(/\(nobody\)/g, self.getEmoji("nobody", true, true, true));
        texto = texto.replace(/\(jesusSuperStar\)/g, self.getEmoji("jesusSuperStar", true, true, true));
        return texto;
    },
    getAllEmoji: function () {
        var self = this;
        var html = "";
        var gif = self.sendGifOrImage;
        if (gif === "gif") {
            html += self.getEmoji("nonono", true, true);
            html += self.getEmoji("f5", true, true);
            html += self.getEmoji("fp1", true, true);
            html += self.getEmoji("please1", true, true);
            html += self.getEmoji("ninio_llora", true, true);
            html += self.getEmoji("think1", true, true);
            html += self.getEmoji("lenny1", true, true);
            html += self.getEmoji("burns", true, true);
            html += self.getEmoji("burns2", true, true);
            html += self.getEmoji("burns3", true, true);
            html += self.getEmoji("mrburns", true, true);
            html += self.getEmoji("tienesrazonoffice", true, true);
            html += self.getEmoji("thankyou", true, true);
            html += self.getEmoji("win1", true, true);
            html += self.getEmoji("smile", true, true);
            html += self.getEmoji("facepalm", true, true);
            html += self.getEmoji("tenor", true, true);
            html += self.getEmoji("homer_happy", true, true);
            html += self.getEmoji("according", true, true);
            html += self.getEmoji("nobody", true, true);
            html += self.getEmoji("jesusSuperStar", true, true);
            return html;
        }
        html += self.getEmoji(":)", "smiley");
        html += self.getEmoji(":d", "smile");
        html += self.getEmoji(":o", "open_mouth");
        html += self.getEmoji(":p", "stuck_out_tongue");
        html += self.getEmoji(";)", "wink");
        html += self.getEmoji(":(", "disappointed");
        html += self.getEmoji("B-)", "sunglasses");
        html += self.getEmoji("cry", true);
        html += self.getEmoji("flushed", true);
        html += self.getEmoji("scream", true);
        html += self.getEmoji("sob", true);
        html += self.getEmoji("sleeping", true);
        html += self.getEmoji("sleepy", true);
        html += self.getEmoji("anguished", true);
        html += self.getEmoji("baby_chick", true);
        html += self.getEmoji("blush", true);
        html += self.getEmoji("bowtie", true);
        html += self.getEmoji("angry", true);
        html += self.getEmoji("cold_sweat", true);
        html += self.getEmoji("confounded", true);
        html += self.getEmoji("confused", true);
        html += self.getEmoji("dizzy_face", true);
        html += self.getEmoji("frowning", true);
        html += self.getEmoji("grin", true);
        html += self.getEmoji("grimacing", true);
        html += self.getEmoji("heart_eyes", true);
        html += self.getEmoji("imp", true);
        html += self.getEmoji("innocent", true);
        html += self.getEmoji("joy", true);
        html += self.getEmoji("kissing_closed_eyes", true);
        html += self.getEmoji("kissing_heart", true);
        html += self.getEmoji("mask", true);
        html += self.getEmoji("neutral_face", true);
        html += self.getEmoji("worried", true);
        html += self.getEmoji("persevere", true);
        html += self.getEmoji("rage", true);
        html += self.getEmoji("relaxed", true);
        html += self.getEmoji("stuck_out_tongue_winking_eye", true);
        html += self.getEmoji("sweat", true);
        html += self.getEmoji("sweat_smile", true);
        html += self.getEmoji("tired_face", true);
        html += self.getEmoji("triumph", true);
        html += self.getEmoji("unamused", true);
        html += self.getEmoji("yum", true);
        html += self.getEmoji("(y)", "--1");
        html += self.getEmoji("ok_hand", true);
        html += self.getEmoji("facepalmen", true);
        html += self.getEmoji("wave", true);
        html += self.getEmoji("v", true);
        html += self.getEmoji("thumbsdown", true);
        html += self.getEmoji("zap", true);
        html += self.getEmoji("snail", true);
        html += self.getEmoji("shaved_ice", true);
        html += self.getEmoji("older_man", true);
        html += self.getEmoji("art", true);
        html += self.getEmoji("bow", true);
        html += self.getEmoji("bulb", true);
        html += self.getEmoji("dancers", true);
        html += self.getEmoji("eyes", true);
        html += self.getEmoji("envelope", true);
        html += self.getEmoji("grey_question", true);
        html += self.getEmoji("heavy_check_mark", true);
        html += self.getEmoji("honeybee", true);
        html += self.getEmoji("japanese_goblin", true);
        html += self.getEmoji("umbrella", true);
        html += self.getEmoji("metal", true);
        html += self.getEmoji("monkey", true);
        html += self.getEmoji("monkey_face", true);
        html += self.getEmoji("moneybag", true);
        html += self.getEmoji("pray", true);
        html += self.getEmoji("ear", true);
        html += self.getEmoji("facepunch", true);
        html += self.getEmoji("first_quarter_moon_with_face", true);
        html += self.getEmoji("fries", true);
        html += self.getEmoji("clap", true);
        html += self.getEmoji("hear_no_evil", true);
        html += self.getEmoji("see_no_evil", true);
        html += self.getEmoji("zzz", true);
        return html;
    },
    getEmoji: function (name, img, gif, lectura, imgWidget) {
        if (img === true && imgWidget !== true) {
            img = name;
            name = "(" + name + ")";
        }
        var g = "";
        if (gif === true) {
            g = " emIfGif";
            img = img + "-gif"
        }
        var data = "data='" + name + "'";
        var s = "emojiSelect";
        if (lectura === true) {
            s = "";
            data = "";
        }
        if (imgWidget) {
//        name = name.replace(/:\)/g, self.getEmoji(":)", "smiley"));
//        name = name.replace(/:-\)/g, self.getEmoji(":)", "smiley"));
            name = name.replace(/:.\)/g, "smiley");
//            name = name.replace("(", "");
//            name = name.replace(")", "");
            name = name.replace(":)", "smile");
            name = name.replace(";)", "wink");
            name = name.replace(":(", "disappointed");
            name = name.replace("B-)", "sunglasses");
            name = name.replace("(y)", "hand_ok");
            name = name.replace(":d", "smile");
            name = name.replace(":D", "smile");
            name = name.replace(":-D", "smile");
            name = name.replace(":o", "open_mouth");
            name = name.replace(":-O", "open_mouth");
            name = name.replace(":p", "stuck_out_tongue");
            name = name.replace(":P", "stuck_out_tongue");
            name = name.replace(":-P", "stuck_out_tongue");
            name = name.replace("facepalmen", "facepalm");
            return "<img src='/nwlib6/css/emoji/emoji/" + name + ".png' " + data + " class='em em-some-emoji' /img><span class='emojiHiddenMomment'>(" + name + ")</span>";
        } else {
            return "<span class='" + s + " em em-some-emoji em-" + img + " " + g + "' " + data + "></span><span class='emojiHiddenMomment'>" + name + "</span>";
        }
    }
};

function intentSetValueInputRingow(msg, sendMsg) {
    var d = document.querySelector(".messageBox");
    if (!d) {
        setTimeout(function () {
            intentSetValueInputRingow(msg);
        }, 2000);
    } else {
//        d.value = msg;
        d.innerHTML = msg;
        d.focus();
        if (sendMsg === true) {
            document.querySelector(".btnsubmit").click();
        }
    }
}

window.addEventListener('message', function (e) {
    if (typeof e.data !== "undefined") {
        var r = e.data;
        if (r.tipo === "send_message_ringow") {
            intentSetValueInputRingow(r.message, true);
        } else
        if (r.tipo === "input_message_ringow") {
            intentSetValueInputRingow(r.message);
        } else
        if (r.tipo === "add_css_ringow") {
            var css = document.createElement("div");
            css.innerHTML = "<style>" + r.message + "</style>";
            var d = document.querySelector("ringow_contain_css_chat");
            if (!d) {
                var d = document.createElement("div");
                d.className = "ringow_contain_css_chat";
                document.body.appendChild(d);
            }
            d.appendChild(css);
        }
    }
});