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
    isOperatorRingow: true,
    isConstructChat: false,
    domain: window.location.protocol + "//" + window.location.host,
    animateMsgShow: true,
    intervalValidaShareScreen: null,
    screen: false,
    connection: null,
    root: null,
    isModerator: false,
    prepare: function (classContainer, callback) {
        var self = this;

        var get = self.get();
        if (!get) {
            return false;
        }
        if (typeof get.isModerator != 'undefined') {
            self.isModerator = get.isModerator;
        }
        if (typeof classContainer === "undefined" || classContainer === null || classContainer === false || classContainer === "") {
            classContainer = ".containerNwpeer2Peer";
        }
        self.container = document.querySelector(classContainer);
        if (!self.container) {
            self.container = document.createElement("div");
            self.container.className = classContainer;
            document.body.appendChild(self.container);
        }
        self.root = self.container;
        self.statusOnline = "offline";

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
        var getURL = self.getParamsFileGet();
        self.version = getURL.v;
        if (typeof get.version !== "undefined") {
            self.version = get.version;
        }

        self.requireCss("css/chat.css?v=" + self.version);

        if (get.onlyChat !== "true") {
            self.requireCss("css/main.css?v=" + self.version);
        }
        if (get.saveRecord === "NO") {
            self.saveRecord = false;
        }
        if (get.useRecordVideo === "NO") {
            self.useRecordVideo = false;
        }
        if (self.video === false) {
            self.saveRecord = false;
            self.useRecordVideo = false;
            self.textConectarme = "Llamar";
        }

        self.require('js/utils.js?v=' + self.version, function (loaded) {

            NWMUtils = new NWMUtils();

            NWMUtils.loading("Cargando scripts...", 2000);

            self.constructChat();

            self.information("Cargando librería de utilidades...");

            if (!loaded) {
                self.information("No se logró cargar la librería de utilidades");
                return;
            }

            if (!utils.isOnline()) {
                alert("Por favor verifique su conexión a internet");
                self.removeLoading();
            }

            window.addEventListener('focus', function () {
                self.inWindow = true;
            });

            window.addEventListener('blur', function () {
                self.inWindow = false;
            });

            document.addEventListener('visibilitychange', function (e) {
//                console.log("visibilitychange");
//                console.log(document.hidden);
            });

//            self.detectChangeConnectionStatus();

            self.detectChangeFullScreen();

            var urlpeer = 'js/connection.js';

            if (get.onlyChat === "true") {
                self.video = false;
                self.audio = false;
            }

            if (self.useRecordVideo === false) {
                self.information("Cargando Record RTConnection");
                self.require('js/lib/RecordRTC.js?v=' + self.version, function (loaded) {
                    if (!loaded) {
                        self.information("No se logró cargar la librería", 1);
                        return;
                    }
                    utils.sendEvent(self.root, "loadRecordRTC", true);
                });
            }

            NWMUtils.loading("Cargando script RTC...", 2000);
            self.require("../../../lib/RTCMultiConnection/dist/RTCMultiConnection.min.js", function (loaded) {
                if (!loaded) {
                    self.information("No se logró cargar la librería de RTC, actualizando en 5 segundos...", 5000);
                    setTimeout(function () {
                        location.reload();
                    }, 5000);
                    return;
                }
                utils.sendEvent(self.root, "loadRTC", true);
            });

            utils.listenEvent(self.root, "loadRTC", function (loaded) {
                NWMUtils.loading("Cargando peer...", 2000);
                self.information("RTConnection cargada!");
                self.require(urlpeer + '?v=' + self.version, function (loaded) {
                    if (!loaded) {
                        self.information("No se logró cargar la librería de conexiones");
                        return;
                    }
                    self.information("Core cargado!");
                    console.log("Core cargado!");
                    callback();
                    self.information("Construyendo interfaz...");
                    self.construct();
                    self.initialize();
                    self.startMyConnect();
                });
                return true;
            });

//            else if (self.useRecordVideo === false) {
//                self.require(urlpeer + '?v=' + self.version, function () {
////                    "js/lib/Screen-Capturing.js";
////                    self.require('js/lib/getScreenId.js?v=' + self.version, function () {
//                    callback();
////                    });
//                });
//                return true;
//            }
        });
//        });
    },
    construct: function () {
        var self = this;
        var get = self.get();
        if (!get) {
            return false;
        }
        self.container.style = "position: fixed;top: 0;left: 0;width: 100%;height: 100%;font-family: arial;font-size: 14px;";
        self.contain_no_connected = document.createElement("div");
        self.contain_no_connected.className = "contain_no_connected";
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

        self.contain_waiting = document.createElement("div");
        self.contain_waiting.className = "contain_waiting";
        self.contain_waiting.innerHTML = " <p class='contain_waiting_text'>" + self.textWaitingConnect + "</p>";
        self.container.appendChild(self.contain_waiting);
        if (get.onlyChat === "true") {
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
        self.videoPartnerMaximiceButton.innerHTML = "<img src='img/fullscreen.png' />";
        self.videoPartnerMaximiceButton.onclick = function () {
            self.maximizeVideo();
        };
        self.videoPartnerMaximice.appendChild(self.videoPartnerMaximiceButton);
        self.videoPartnerMinimizeButton = document.createElement("button");
        self.videoPartnerMinimizeButton.className = "videoPartnerMinimizeButton";
        self.videoPartnerMinimizeButton.innerHTML = "<img src='img/fullscreen_exit.png' />";
        self.videoPartnerMinimizeButton.onclick = function () {
            self.maximizeVideo();
        };
        self.containVideoOther.appendChild(self.videoPartnerMinimizeButton);

//        self.videoPartnerShareScreen = document.createElement("video");
//        self.videoPartnerShareScreen.className = "videoPartnerShareScreen";
//        self.videoPartnerShareScreen.autoplay = "true";
//        self.containVideoOther.appendChild(self.videoPartnerShareScreen);

//        self.videoPartner = document.createElement("video");
//        self.videoPartner.className = "js-video-partner";
//        self.videoPartner.autoplay = "true";
//        self.videoPartner.playsinline = "playsinline";
//        self.videoPartner.loop = "true";
//        self.containVideoOther.appendChild(self.videoPartner);
//        self.videoPartner.setAttribute("playsinline", "true");

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
        self.colgarVideoCallButton.innerHTML = "<img src='img/colgar.png' style='max-width: 80%;' /><span class='toolTipNwOne'>Colgar</span>";
        self.colgarVideoCallButton.style = "bottom: 7px;padding: 0;color: red;background-color: red;border-radius: 50%;width: 50px;height: 50px;";
        self.colgarVideoCallButton.onclick = function () {
            self.colgarVideoCall();
        };
        self.containerButtons.appendChild(self.colgarVideoCallButton);

        if (self.video) {
            self.stopStarVideoButton = document.createElement("button");
            self.stopStarVideoButton.className = "elementTooltipHover";
            self.stopStarVideoButton.innerHTML = "<img src='img/videocam_on.png' class='video_on_img' /><img src='img/videocam_off.png' class='video_off_img' style='display: none;' /><span class='toolTipNwOne'>Apagar / prender cámara</span>";
            self.stopStarVideoButton.onclick = function () {
                self.stopStartVideo();
            };
            self.containerButtons.appendChild(self.stopStarVideoButton);
        }

        self.stopStarAudioButton = document.createElement("button");
        self.stopStarAudioButton.className = "elementTooltipHover";
        self.stopStarAudioButton.innerHTML = "<img src='img/mic_on.png' class='mic_on_img' /><img src='img/mic_off.png' class='mic_off_img' style='display: none;' /><span class='toolTipNwOne'>Apagar / prender micrófono</span>";
        self.stopStarAudioButton.onclick = function () {
            self.stopStartAudio();
        };
        self.containerButtons.appendChild(self.stopStarAudioButton);

        if (get.sharedScreen === "true") {
//            self.shareCloseButton = document.createElement("button");
//            self.shareCloseButton.innerHTML = "<img src='img/share_stop.png' />";
//            self.shareCloseButton.onclick = function () {
//                self.validateShareScreen();
//            };
//            self.containerButtons.appendChild(self.shareCloseButton);
        } else {
            if (!utils.isMobile() && self.video) {
                self.share = document.createElement("button");
                self.share.className = "elementTooltipHover";
                self.share.innerHTML = "<img src='img/share.png' /><span class='toolTipNwOne'>Compartir pantalla</span>";
                self.share.onclick = function () {

                    self.connection.replaceTrack({
                        screen: true,
                        oneway: true,
                        streamCallback: function (screenStream) {
                            console.log('Screen is successfully captured: ' + screenStream.getVideoTracks().length);
                        }
                    });
                    return;

                    self.connection.addStream({
                        screen: true,
                        oneway: true,
                        streamCallback: function (screenStream) {
                            // this will be fired as soon as stream is captured
                            if (!screenStream) {
                                alert('User did NOT select to share any stream. He clicked "Cancel" button instead.');
                                return;
                            }
                            console.log('Screen is successfully captured: ' + screenStream.getVideoTracks().length);
                            screenStream.onended = function () {
                                console.log("onended");
//                                document.getElementById('share-screen').disabled = false;
//                                // or show button
//                                $('#share-screen').show();
                            };
                        }
                    });
                    return;


//                    self.connection.addStream({
//                        screen: true,
////                        oneway: false,
//                        streamCallback: function (screen) {
//                            addStreamStopListener(screen, function () {
//                                self.connection.send({
//                                    screebEnded: true,
//                                    streamid: screen.id
//                                });
//
//                                var video = document.getElementById(screen.id);
//                                if (video && video.parentNode) {
//                                    video.parentNode.removeChild(video);
//                                }
//                            });
//                        }
//                    });
//                    return;


                    self.connection.disconnectWith(self.room);
                    self.screen = true;
                    self.startMyConnect();
                    return;

                    self.shareScreen(function () {
                        clearInterval(self.intervalValidaShareScreen);
                        self.addCanvasPartnert = false;
                        if (self.useRecordVideo === true) {
                            self.addVideoToRecorder(self.videoMyself);
                        }
                    });
                };
                self.containerButtons.appendChild(self.share);
            }
        }

        if (self.useRecordVideo === true && self.video) {
            self.recordButton = document.createElement("button");
            self.recordButton.className = "elementTooltipHover";
            self.recordButton.innerHTML = "<span class='iconRecording'></span><img src='img/download.png' /><span class='toolTipNwOne'>Descargar grabación</span>";
            self.recordButton.style = "display: none;";
            self.recordButton.onclick = function () {
                self.stopRecordVideo();
            };
            self.containerButtons.appendChild(self.recordButton);
        }

        self.chatButton = document.createElement("button");
        self.chatButton.className = "elementTooltipHover";
        self.chatButton.innerHTML = "<img src='img/chat.png' /><span class='toolTipNwOne'>Chat</span>";
        if (get.onlyChat === "true") {
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

        var get = self.get();
        if (!get) {
            return false;
        }
        var classMainChat = "containerChat";
//        var classMainChat = "containerChat containerChatVisible";
//        if (utils.isMobile()) {
//            classMainChat = "containerChat";
//        }
        if (get.onlyChat === "true") {
            classMainChat += " containerChatVisible containerChat_maximice";
        }
//        else {
//            classMainChat = "containerChat";
//        }
        if (get.isAssesor === "true") {
            self.isAssesor = true;
        }
        if (get.useInterNw === "true") {
            self.useInterNw = true;
        }
        self.containerChat = NWMUtils.createElement("div", classMainChat);
        self.container.appendChild(self.containerChat);

        self.contentChat = NWMUtils.createElement("div", "contentChat");
        self.containerChat.appendChild(self.contentChat);

        self.encChat = NWMUtils.createElement("div", "encChat");
        self.contentChat.appendChild(self.encChat);

        var mode = {};

        if (get.onlyChat !== "true") {
            mode.src = "img/close_blanco.png";
            self.closeChat = NWMUtils.createElement("img", "iconsEnc closeChat", mode);
            self.closeChat.onclick = function () {
                self.openChat();
            };
            self.encChat.appendChild(self.closeChat);
        }

        if (get.onlyChat === "true") {
            mode.src = "img/videocam.png";
            self.videoCamButton = NWMUtils.createElement("img", "iconsEnc videocallEnc", mode);
            self.videoCamButton.onclick = function () {
                self.startAudioVideoCall("video");
//                openVideoCall();
            };
            self.encChat.appendChild(self.videoCamButton);

            mode.src = "img/audio_call.png";
            self.audioCallButton = NWMUtils.createElement("img", "iconsEnc audiocallEnc", mode);
            self.audioCallButton.onclick = function () {
                self.startAudioVideoCall("audio");
//                openAudioCall();
            };
            self.encChat.appendChild(self.audioCallButton);
        }

        mode = {};
        mode.src = "img/settings.png";
        self.settingsEnc = NWMUtils.createElement("img", "iconsEnc settingsEnc", mode);
        self.settingsEnc.onclick = function () {
            self.openSettings();
        };
        self.encChat.appendChild(self.settingsEnc);

        self.statusOtherEnc = NWMUtils.createElement("span", "iconsEnc statusOtherEnc");
        self.encChat.appendChild(self.statusOtherEnc);

        self.nameOtherEnc = NWMUtils.createElement("span", "iconsEnc nameOtherEnc");
        self.encChat.appendChild(self.nameOtherEnc);

        self.statusTextOtherEnc = NWMUtils.createElement("div", "statusTextOtherEnc");
        self.encChat.appendChild(self.statusTextOtherEnc);

        self.containerMessages = NWMUtils.createElement("div", "messages");
        self.contentChat.appendChild(self.containerMessages);

        self.form = NWMUtils.createElement("form", "footerChat");
        self.contentChat.appendChild(self.form);
        self.form.setAttribute("onsubmit", "return false");

        self.isWritten = NWMUtils.createElement("div", "isWritten");
        self.form.appendChild(self.isWritten);

        self.messageBox = NWMUtils.createElement("input", "messageBox");
        self.messageBox.type = "text";
        self.messageBox.placeholder = "Your message...";
        self.form.appendChild(self.messageBox);

        self.fileTransferInput = NWMUtils.createElement("input", "fileTransferInput");
        self.fileTransferInput.type = "file";
        self.fileTransferInput.placeholder = "Your message...";
        self.fileTransferInput.onchange = function (event) {
            var file = event.target.files[0];
            var text = "He enviado el archivo " + file.name;
            var blob = new Blob(event.target.files, {type: file.type});
            self.sendMessagePeer({message: text});
            var message = {
                file: blob,
                filename: file.name,
                filetype: file.type
            };
            self.sendMessagePeer({message: message});
            self.addMessage({text: text, type: "me", name: self.myselfId_get_clean, cleanHTML: false});
        };
//        self.form.appendChild(self.fileTransferInput);

        self.dictation = NWMUtils.createElement("div", "imgSpeach");
        self.dictation.innerHTML = "<img src='img/mic.svg' />";
        self.dictation.onclick = function () {
            utils.startDictation(".messageBox");
        };
        self.form.appendChild(self.dictation);

        self.btnsubmit = NWMUtils.createElement("button", "btnsubmit");
        self.btnsubmit.type = "submit";
        self.btnsubmit.innerHTML = "<img src='img/send.svg' />";
        self.form.appendChild(self.btnsubmit);

        self.form.addEventListener("submit", function () {

            console.log("self.statusOnline", self.statusOnline);
            if (self.statusOnline === "offline") {
                self.connection.reCheckRoomPresence();
            }

            var box = self.messageBox;
            var message = box.value;
            if (message !== "") {
                if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
                    var langOrigin = window.localStorage.getItem(self.nameConference + "select_transtale_origin_setings");
                    var langTranslate = window.localStorage.getItem(self.nameConference + "select_transtale_trad_setings");
                    if (langOrigin !== null && langOrigin !== "" && langTranslate !== null && langTranslate !== "" && langOrigin !== langTranslate) {
                        self.translateText(message, langOrigin, langTranslate, function (textTranslate) {
                            self.lastTextTraducido = textTranslate.source;
                            continueSendMsg(textTranslate.translation);
                        });
                    } else {
                        continueSendMsg(message);
                    }
                } else {
                    continueSendMsg(message);
                }
            }
            box.value = "";
            box.focus();
            setTimeout(function () {
                box.focus();
            }, 500);
        });

        function continueSendMsg(message) {
            self.sendMessagePeer({message: message});
            self.addMessage({text: message, type: "me", name: self.myselfId_get_clean});
            var m = {};
            m.tipo = "add_msg";
            m.room = self.room;
            m.says = self.myselfId_get_clean;
            m.text = message;
            window.parent.postMessage(m, '*');
        }

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
    startAudioVideoCall: function (tipo) {
        var self = this;
        var className = "linkMsgVideoCall";
        var url = location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_no_clean + "&otherID=" + self.partnerId_get_no_clean + "&room=" + self.room;
        if (tipo === "audio") {
            url += "&video=false&audio=true";
            className = "linkMsgAudioCall";
        }
        if (self.isAssesor === true) {
            url += "&isAssesor=true";
        }
        if (self.is_group === true) {
            url += "&is_group=true";
        }
        var insideIframe = window.top !== window.self;
        var message = "He iniciado una " + tipo + "llamada, <div class='linkMsgVideoAudioCall " + className + "'>clic aquí para iniciar</div>";
        self.sendMessagePeer({message: message});

        var btn = self.addMessage({text: message, type: "me", name: self.myselfId_get_clean, cleanHTML: false});
        btn.querySelector("." + className).onclick = function () {
            self.startAudioVideoCall(tipo);
        };
        setTimeout(function () {
            if (insideIframe) {
                window.open(url, '_blank');
                setTimeout(function () {
                    window.location = location.protocol + "//" + location.hostname + "/nwlib6/nwproject/modules/webrtc/v4/msgTemporal.html";
                }, 50);
            } else {
                window.location = url;
            }
        }, 500);
    },
    initialize: function () {
        var self = this;
        if (self.debug)
            console.log("Start rtcNw");
        var get = self.get();
        if (!get) {
            return false;
        }
        if (!utils.evalueData(get.room)) {
            alert("Debe pasar el parámetro room por get");
            return false;
        }

        console.log("Init app in js");

        navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                null;
//        navigator.getUserMedia = connection.getUserMedia();
        self.peer1 = null;
        self.currentPeerConnection = null;
        self.localMediaStream = null;
        self.room = get.room;
        self.nameConference = self.room;

        self.myselfId_get_clean = utils.cleanUserNwC(get.myID);
        self.myselfId_get_no_clean = get.myID;
        self.myselfId_get = utils.cleanUserNwC(get.myID) + "_" + self.room;

        self.partnerId_get_clean = utils.cleanUserNwC(get.otherID);
        self.partnerId_get_no_clean = get.otherID;
        self.partnerId_get = utils.cleanUserNwC(get.otherID) + "_" + self.room;
        self.heName = get.otherID;

        self.bot = false;
        self.sharedScreen = false;
        if (get.sharedScreen === "true") {
            self.sharedScreen = true;
        }
        self.onlyChat = false;
        if (get.onlyChat === "true") {
            self.onlyChat = true;
        }

        if (typeof get.time !== "undefined") {
            self.setValueClock();
        }

        self.nameOtherEnc.innerHTML = self.partnerId_get_no_clean;

        self.startClock();

        self.loadInitialize = true;
        if (self.startPeerToPeer === true) {
//            self.decideStart();
        }
    },
    openAudioCall: function () {
        var self = this;
        var url = "";
        var target = "_SELF";
        var insideIframe = window.top !== window.self;
        if (insideIframe) {
            target = "_BLANK";
        }
        url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.partnerId_get_no_clean + "&otherID=" + self.myselfId_get_no_clean + "&room=" + self.room + "&video=false&audio=true";
        var message = "He iniciado una audiollamada, <a class='linkMsgVideoCall' href='" + url + "' target='" + target + "'>clic aquí para iniciar</a>";
        self.sendMessagePeer({message: message});
        self.addMessage({text: message, type: "me", name: self.myselfId_get_clean, cleanHTML: false});

        setTimeout(function () {
            var url = location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_no_clean + "&otherID=" + self.partnerId_get_no_clean + "&room=" + self.room + "&video=false&audio=true";
            if (self.isAssesor === true) {
                url += "&isAssesor=true";
            }
            if (self.is_group === true) {
                url += "&is_group=true";
            }
            if (insideIframe) {
                window.open(url, '_blank');
            } else {
                window.location = url;
            }
        }, 500);
    },
    setDisconected: function () {
        utils.removeClass(this.statusOtherEnc, "statusOtherEnc_online", true);
    },
    setConnected: function () {
        utils.addClass(this.statusOtherEnc, "statusOtherEnc_online");
    },
    openVideoCall: function () {
        var self = this;
        var url = "";
        var target = "_SELF";
        var insideIframe = window.top !== window.self;
        if (insideIframe) {
            target = "_BLANK";
        }
        url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.partnerId_get_no_clean + "&otherID=" + self.myselfId_get_no_clean + "&room=" + self.room;
        var message = "He iniciado una videollamada, <a class='linkMsgVideoCall' href='" + url + "' target='" + target + "'>clic aquí para iniciar</a>";
        self.sendMessagePeer({message: message});
        self.addMessage({text: message, type: "me", name: self.myselfId_get_clean, cleanHTML: false});

        setTimeout(function () {
            var url = location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_no_clean + "&otherID=" + self.partnerId_get_no_clean + "&room=" + self.room;
            if (self.isAssesor === true) {
                url += "&isAssesor=true";
            }
            if (self.is_group === true) {
                url += "&is_group=true";
            }
            if (insideIframe) {
                window.open(url, '_blank');
            } else {
                window.location = url;
            }
        }, 500);
    },
    decideStart: function () {
        var self = this;
        console.log("----decideStart----");
        if (self.onlyChat === true) {
            self.initOnlyChat();
        }
        self.startMyConnect();
    },
    startMyConnect: function () {
        var self = this;
        console.log("----startMyConnect----");
        var s = connect;
        s.selfParent = self;
        if (self.isModerator != null) {
            s.setModerator(self.isModerator);
        }
        self.connection = s.start(self.room);
    },
    receiveMessageOther: function (event) {
        var self = this;
        console.log("receiveMessageOther data", event);
        var data = event.data;
//        var userSend = event.extra.fullName;
        var userSend = "N/A";
        if (typeof event.extra != 'undefined') {
            var userSend = event.extra.fullName;
        }
        console.log("receiveMessageOther data", event);
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
        }
        if (data === "messagesendSeeMessages") {
            self.changeHtmlReceiveLeido("See", self.myselfId_get_clean);
            self.changeHtmlReceiveLeido("Dev", self.myselfId_get_clean);
            return;
        }
        if (data === "messagesendReceivedMessages") {
            self.changeHtmlReceiveLeido("Dev", self.myselfId_get_clean);
            return;
        }
        if (data === "messagesendWritten") {
            self.createWritten();
            return;
        }

        self.notifyMsgIcon();

        if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
            var langOrigin = window.localStorage.getItem(self.nameConference + "select_transtale_origin_setings_other");
            var langTranslate = window.localStorage.getItem(self.nameConference + "select_transtale_trad_setings_other");
            if (langOrigin !== null && langOrigin !== "" && langTranslate !== null && langTranslate !== "" && langOrigin !== langTranslate) {
                self.translateText(data, langOrigin, langTranslate, function (textTranslate) {
                    self.lastTextTraducido = textTranslate.source;
                    continueReceivedMsg(textTranslate.translation);
                });
            } else {
                continueReceivedMsg(data);
            }
        } else {
            continueReceivedMsg(data);
        }

        function continueReceivedMsg(val) {
            var btn = self.addMessage({text: val, type: "other", name: userSend, cleanHTML: false});
            if (btn.querySelector(".linkMsgVideoCall") != null) {
                btn.querySelector(".linkMsgVideoCall").onclick = function () {
                    self.startAudioVideoCall("video");
                };
            }
            if (btn.querySelector(".linkMsgAudioCall") != null) {
                btn.querySelector(".linkMsgAudioCall").onclick = function () {
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
    },
    changeHtmlReceiveLeido: function (type, user) {
        var d = document.querySelectorAll(".spanText" + type + "_" + user);
        for (var i = 0; i < d.length; i++) {
            d[i].innerHTML = "SI";
        }
    },
    notifyCountMsgIcon: 0,
    notifyMsgIcon: function () {
        var self = this;
        var get = self.get();
        if (get.onlyChat === "true") {
            return;
        }
        self.notifyCountMsgIcon++;
        self.notifyChatButton.innerHTML = self.notifyCountMsgIcon;
        utils.addClass(self.notifyChatButton, "notifyChatButtonShow");
    },
    notifyRemoveMsgIcon: function () {
        var self = this;
        var get = self.get();
        self.notifyCountMsgIcon = 0;
        if (get.onlyChat !== "true") {
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
        self.connection.send(message);
    },
    addMessage: function (d) {
        var self = this;
        var cleanHTML = true;
        if (typeof d.cleanHTML !== "undefined") {
            cleanHTML = d.cleanHTML;
        }
        var type = d.type;
        var date = d.date;
        var visto = d.visto;
        var recibido = d.recibido;
        var text = d.text;
        var says = d.name;
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
        var r = "<div class=' " + cla + "' " + seeBloque + " >";
        var body = "";
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
        da.className = cla + " message " + classname;
        da.innerHTML = r;
        if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
            var img = document.createElement("img");
            img.className = "g_translate";
            img.src = "img/g_translate.svg";
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
        var get = self.get();
        var url = location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_no_clean + "&otherID=" + self.partnerId_get_no_clean + "&room=" + self.room;
        if (get.sharedScreen !== "true") {
            url += "&onlyChat=true";
        }
        if (self.isAssesor === true) {
            url += "&isAssesor=true";
        }
        window.location = url;
    },
    checkCanUseVideocall: function () {
        var self = this;
    },
    openChat: function () {
        var self = this;
        self.notifyRemoveMsgIcon();
        var get = self.get();
        if (get.onlyChat !== "true") {
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
        self.isWritten.innerHTML = "<img src='img/lg.-text-entering-comment-loader.gif' />";
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
        var get = self.get();
        var ti = get.time.split(":");
        self.timeSeconds = self.formatNumOk(ti[2]);
        self.timeMinutes = self.formatNumOk(ti[1]);
        self.timeHours = self.formatNumOk(ti[0]);
        window.localStorage.setItem(self.room + "_timeSeconds", self.timeSeconds);
        window.localStorage.setItem(self.room + "_timeMinutes", self.timeMinutes);
        window.localStorage.setItem(self.room + "_timeHours", self.timeHours);
    },
    startClock: function () {
        var self = this;
        var get = self.get();
        if (get.onlyChat === "true") {
            return true;
        }
        var salto = 60;
        if (utils.evalueData(window.localStorage.getItem(self.room + "_timeSeconds"))) {
            self.timeSeconds = parseInt(window.localStorage.getItem(self.room + "_timeSeconds"));
            self.containTimeSeconds.innerHTML = self.formatNumOk(self.timeSeconds);
        }
        if (utils.evalueData(window.localStorage.getItem(self.room + "_timeMinutes"))) {
            self.timeMinutes = parseInt(window.localStorage.getItem(self.room + "_timeMinutes"));
            self.containTimeMinutes.innerHTML = self.formatNumOk(self.timeMinutes);
        }
        if (utils.evalueData(window.localStorage.getItem(self.room + "_timeHours"))) {
            self.timeHours = parseInt(window.localStorage.getItem(self.room + "_timeHours"));
            self.containTimeHours.innerHTML = self.formatNumOk(self.timeHours);
        }

        setInterval(function () {

            self.timeSeconds++;
            window.localStorage.setItem(self.room + "_timeSeconds", self.timeSeconds);
            /*
             var time = self.formatNumOk(self.timeHours) + ":" + self.formatNumOk(self.timeMinutes) + ":" + self.formatNumOk(self.timeSeconds);
             console.log(time);
             updateUrlParam("time", time);
             */

            if (self.timeSeconds >= salto) {
                self.timeSeconds = 0;
                self.timeMinutes++;

                window.localStorage.setItem(self.room + "_timeMinutes", self.timeMinutes);

                self.containTimeMinutes.innerHTML = self.formatNumOk(self.timeMinutes);
                if (self.timeMinutes >= salto) {
                    self.timeMinutes = 0;
                    self.timeHours++;

                    window.localStorage.setItem(self.room + "_timeHours", self.timeHours);

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
    loadWebRtc: function () {
        var self = this;
        self.require('js/lib/RecordRTC.js?v=' + self.version, function (loaded) {
            if (!loaded) {
                self.information("No se logró cargar la librería", 1);
                return;
            }
            utils.sendEvent(self.root, "loadRecordRTC");
//            self.require(urlpeer + '?v=' + self.version, function (loaded) {
//                    "js/lib/Screen-Capturing.js";
//                    self.require('js/lib/getScreenId.js?v=' + self.version, function () {
//                if (!loaded) {
//                    utils.sendEvent(self.root, "loadRecordRTC", "ok");
//                    callback();
//                }
//                    });
//            });
        });
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
    information: function (str) {
        this.statusTextOtherEnc.innerHTML = str;
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
                        callBack(true);
                    }
                };
                if (async === true) {
                    document.getElementsByTagName('head')[0].appendChild(script);
                } else {
                    $("body").append(script);
                }
            } else {
                if (typeof callBack !== "undefined") {
                    callBack(true);
                }
            }
//            script.onload = function () {
//                callBack();
//            };
//            document.body.appendChild(script);
            return true;
        } catch (e) {
            self.information(e);
            console.log(e);
            return false;
        }
    },
    stopStartAudio: function () {
        var self = this;
        //            self.localMediaStream.getAudioTracks()[0].enabled = false;
//        self.localMediaStream.getAudioTracks()[0].enabled = !(self.localMediaStream.getAudioTracks()[0].enabled);
//        self.connection.attachStreams[0].mute('audio');
//        self.connection.extra.isAudioMuted = true;
//        self.connection.extra.audioTrackId = self.connection.attachStreams[0].getTracks().filter(function (t) {
//            return t.kind === 'audio';
//        })[0].id;
//        self.connection.updateExtraData();
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
        var get = self.get();
        if (typeof get.onlyChat === "undefined") {
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
            sele = window.localStorage.getItem(self.nameConference + "select_transtale_origin_setings");
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
            sele = window.localStorage.getItem(self.nameConference + "select_transtale_trad_setings");
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
            sele = window.localStorage.getItem(self.nameConference + "select_transtale_origin_setings_other");
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
            sele = window.localStorage.getItem(self.nameConference + "select_transtale_trad_setings_other");
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

        var sele = window.localStorage.getItem(self.nameConference + "select_voice_text_detener");
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

        var sele = window.localStorage.getItem(self.nameConference + "send_auto_voice_text");
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
        sel.innerHTML = "<img src='img/close.svg' />";
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
                window.localStorage.setItem(self.nameConference + "select_transtale_origin_setings", lang);

                var lang = document.querySelector(".select_transtale_trad_setings").value;
                window.localStorage.setItem(self.nameConference + "select_transtale_trad_setings", lang);

                var lang = document.querySelector(".select_transtale_origin_setings_other").value;
                window.localStorage.setItem(self.nameConference + "select_transtale_origin_setings_other", lang);

                var lang = document.querySelector(".select_transtale_trad_setings_other").value;
                window.localStorage.setItem(self.nameConference + "select_transtale_trad_setings_other", lang);
            }

            var lang = document.querySelector(".select_voice_text_detener").value;
            window.localStorage.setItem(self.nameConference + "select_voice_text_detener", lang);

            var lang = document.querySelector(".send_auto_voice_text").value;
            window.localStorage.setItem(self.nameConference + "send_auto_voice_text", lang);

            d.remove();
        };
        selClass.appendChild(sel);
    },
    removeLoading: function () {
        //manuales y procedimiento de capacitación, calidad, comunicación directa con desarrollo, preparación y muestra de que funciona bien en la implementación, acompañamiento por xx días?
        var d = document.querySelector(".loadingNwChat");
        if (d)
            d.remove();
    }
};

function intentSetValueInputRingow(msg, sendMsg) {
    var d = document.querySelector(".messageBox");
    if (!d) {
        setTimeout(function () {
            intentSetValueInputRingow(msg);
        }, 2000);
    } else {
        d.value = msg;
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