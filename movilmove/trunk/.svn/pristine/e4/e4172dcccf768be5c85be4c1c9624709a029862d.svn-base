var interactUserInDocRingow = true;
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function () {
        if (interactUserInDocRingow === false) {
            interactUserInDocRingow = true;
        }
    });
    var get = webrtcNw.GET();
    var d = document.querySelector(".volver_a_llamar");
    if (d) {
        d.addEventListener("click", function () {
            history.back();
        });
    }
    var d = document.querySelector(".loadingNwChat");
    if (d) {
        d.remove();
    }
    if (get.callEnd === "true") {
        var d = document.querySelector(".contenedorMain");
        if (d) {
            d.style.display = "none";
        }
        var d = document.querySelector(".containerButtonVolver");
        if (d) {
            d.style.display = "block";
        }
        return;
    }
    var room = get.room;
    if (room) {
//        webrtcNw.initialize(room);
        initwebrtcNW.startRoom(room);
    }
});

createinitwebrtcNW = false;
var initwebrtcNW = {
    startRoom: function (room, options) {
        webrtcNw.endCall();
//                    var url = location.pathname + "?chat=true&openchat=true&video=false&audio=false&useServer=true&myUser=normal&myName=normal&room=" + room;
//                    window.history.pushState({"html": "", "pageTitle": "Hola"}, "", url);
        if (!createinitwebrtcNW) {
            webrtcNw.initialize(room, options);
            setTimeout(function () {
                webrtcNw.scrollBottomMessages();
            }, 500);
        } else {
            webrtcNw.options(options);
            webrtcNw.nameConference = room;
            var li = webrtcNw.createLienzo();
            if (li) {
//                webrtcNw.createChat();
            }
            webrtcNw.createChat();
            webrtcNw.joinRoom(room);
            setTimeout(function () {
                webrtcNw.scrollBottomMessages();
            }, 500);
        }
        createinitwebrtcNW = true;
    },
    getUsers: function (d, callback) {
        var domain = location.origin;
        if (typeof d.domain !== "undefined") {
            domain = d.domain;
        }
        var data = "";
        data += "id=" + d.id;
        if (typeof d.service !== "undefined") {
            if (d.service !== false && d.service !== null && d.service !== "") {
                data += "&service=" + d.service;
            }
        }
        if (typeof d.search !== "undefined") {
            data += "&search=" + d.search;
        }
        if (typeof d.username !== "undefined") {
            if (d.username !== false && d.username !== null && d.username !== "") {
                data += "&username=" + d.username;
            }
        }
        function reqListener() {
            var data = JSON.parse(this.responseText);
            return callback(data);
        }
        function reqError(err) {
            return callback('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', domain + '/nwlib6/nwproject/modules/webrtc/v2/rpc/getUsers.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    getServices: function (d, callback) {
        var domain = location.origin;
        if (typeof d.domain !== "undefined") {
            domain = d.domain;
        }
        var data = "";
        data += "id=" + d.id;
        if (typeof d.parent !== "undefined") {
            data += "&parent=" + d.parent;
        }
        data += "&mode=contactos";
        function reqListener() {
            var data = JSON.parse(this.responseText);
            return callback(data);
        }
        function reqError(err) {
            return callback('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', domain + '/nwlib6/nwproject/modules/webrtc/v2/rpc/getServices.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    GET: function () {
        var loc = document.location.href;
        var getString = loc.split('?')[1];
        if (getString == undefined) {
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
};

var webrtcNw = {
    debug: false,
    readyToCall: null,
    nameConference: null,
    tokens: [],
    interValRinging: null,
    statusCallRingow: false,
    isCallingRingow: false,
    numberCallingRingow: 0,
    IntervalisCallingRingow: null,
    video: true,
    audio: true,
    chat: true,
    id_session: "",
    id_session_call: false,
    myUser: false,
    isSetMyName: false,
    setMyCelular: false,
    setMyCorreo: false,
    myName: "",
    myPhoto: "",
    myCelular: "",
    heName: "",
    heUser: false,
    hePhoto: false,
    bot: false,
    nameUserRingow: false,
    mailUserRingow: false,
    celUserRingow: false,
    usejoin: "false",
    openchat: "false",
    terminal: null,
    apikey: null,
    id_call: null,
    domain: null,
    domainVisitor: null,
    urlVisitor: null,
    useServer: true,
    loadHistory: false,
    useAudioCall: true,
    useVideoCall: true,
    focusIn: false,
    get: false,
    tipoChat: "chat",
    isOperatorRingow: "false",
    useForRingow: "false",
    canvasChat: null,
    haveOptions: false,
    getSaludoBotPredeterminate: "Hola, ¿cómo puedo ayudarte?",
    getNameBotPredeterminate: "Será un placer asistirte, ¿Cuál es tu nombre?",
    getEmailBotPredeterminate: "¿Puedes dejarme tu email?",
    getPhoneBotPredeterminate: "¿Puedes dejarme tu teléfono con código de área o móvil?",
    botInResponse: null,
    botLastMsg: false,
    botResponseHelloInitial: "Bienvenido a nuestro chat",
    botResponseNoFound: "No he entendido tu pregunta... ¿Puedes formularla nuevamente por favor?",
    botResponseWaiting: "Dame un momento, me estoy encargando de ponterte en contacto con un asesor para que responda tu consulta",
    options: function (options) {
        var self = this;
        debugMainRingow = self.debug;
        if (typeof options !== "undefined") {
            self.haveOptions = true;
            if (typeof options.domain !== "undefined") {
                self.domain = options.domain;
            }
            if (typeof options.heUser !== "undefined") {
                self.heUser = options.heUser;
            }
            if (typeof options.hePhoto !== "undefined") {
                self.hePhoto = options.hePhoto;
            }
            if (typeof options.heName !== "undefined") {
                self.heName = options.heName;
            }
            if (typeof options.myUser !== "undefined") {
                self.myUser = options.myUser;
            }
            if (typeof options.myName !== "undefined") {
                self.myName = options.myName;
            }
            if (typeof options.myPhoto !== "undefined") {
                self.myPhoto = options.myPhoto;
            }
            if (typeof options.chat !== "undefined") {
                self.chat = options.chat;
            }
            if (typeof options.openchat !== "undefined") {
                if (options.openchat === true) {
                    self.openchat = "true";
                } else
                if (options.openchat === false) {
                    self.openchat = "false";
                } else {
                    self.openchat = options.openchat;
                }
            }
            if (typeof options.useServer !== "undefined") {
                if (options.useServer === true) {
                    self.useServer = "true";
                } else
                if (options.useServer === false) {
                    self.useServer = "false";
                } else {
                    self.useServer = options.useServer;
                }
            }
            if (typeof options.audio !== "undefined") {
                self.audio = options.audio;
            }
            if (typeof options.video !== "undefined") {
                self.video = options.video;
            }
            if (typeof options.bot !== "undefined") {
                self.bot = options.bot;
            }
            if (typeof options.isOperatorRingow !== "undefined") {
                self.isOperatorRingow = options.isOperatorRingow;
            }
            if (typeof options.id_call !== "undefined") {
                self.id_call = options.id_call;
            }
            if (typeof options.body !== "undefined") {
                self.body = options.body;
            }
            if (typeof options.useForRingow !== "undefined") {
                if (options.useForRingow === true) {
                    self.useForRingow = "true";
                } else
                if (options.useForRingow === false) {
                    self.useForRingow = "false";
                } else {
                    self.useForRingow = options.useForRingow;
                }
            }
            if (typeof options.statusCallRingow !== "undefined") {
                self.statusCallRingow = options.statusCallRingow;
            }
        }
    },
    initialize: function (val, options) {
        var self = this;
        self.domain = location.origin;
        self.domainVisitor = location.origin;
        self.urlVisitor = location.href;
        if (top.location != location) {
            var matches = document.referrer.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            var domain = matches && matches[1];
            var http = document.referrer.split(/[/?#]/)[0];
            var urlDomain = http + "//" + domain;
            self.domainVisitor = urlDomain;
            self.urlVisitor = document.referrer;
        }
        var get = self.GET();
        if (self.debug)
            console.log(get.room);
        self.get = get;
        if (typeof localStorage["id_session"] !== "undefined") {
            self.id_session = localStorage["id_session"];
        } else {
            self.id_session = Math.floor((Math.random() * 10000) + 999999999).toString();
            localStorage["id_session"] = self.id_session;
        }
        self.setMyName("guest_" + self.id_session);
        if (get.id_session !== "undefined") {
            self.id_session_call = get.id_session;
        }
        if (get.video === "false") {
            self.video = false;
        }
        if (get.audio === "false") {
            self.audio = false;
        }
        if (get.chat === "false") {
            self.chat = false;
        }
        if (get.bot === "true" || get.bot === "SI") {
            self.bot = true;
        }
        if (typeof get.useVideoCall !== "undefined") {
            if (get.useVideoCall === "NO") {
                self.useVideoCall = false;
            }
        }
        if (typeof get.useAudioCall !== "undefined") {
            if (get.useAudioCall === "NO") {
                self.useAudioCall = false;
            }
        }
        if (typeof get.isOperatorRingow !== "undefined") {
            self.isOperatorRingow = get.isOperatorRingow;
        }
        if (typeof get.useForRingow !== "undefined") {
            self.useForRingow = get.useForRingow;
        }
        if (typeof get.myName !== "undefined") {
            self.setMyName(get.myName, true);
        }
        if (typeof get.myUser !== "undefined") {
            self.myUser = get.myUser;
        }
        if (typeof get.myPhoto !== "undefined") {
            self.myPhoto = get.myPhoto;
        }
        if (typeof get.heUser !== "undefined") {
            self.heUser = get.heUser;
        }
        if (typeof get.hePhoto !== "undefined") {
            self.hePhoto = get.hePhoto;
        }
//        if (typeof localStorage["heName"] !== "undefined") {
//            self.heName = localStorage["heName"];
//        }
        if (typeof get.heName !== "undefined") {
            self.heName = get.heName;
        }
        if (typeof get.usejoin !== "undefined") {
            self.usejoin = get.usejoin;
        }
        if (typeof get.openchat !== "undefined") {
            self.openchat = get.openchat;
        }
        if (typeof get.useServer !== "undefined") {
            if (get.useServer === "true") {
                self.useServer = true;
            } else
            if (get.useServer === "false") {
                self.useServer = false;
            }
        }
        if (self.myName.indexOf("Visitor-") === -1) {
            self.isSetMyName = true;
        }

        self.nameConference = val;
        self.setTerminalKey();
        self.options(options);
        self.createLienzo();
        self.addCssRingow();
        self.setReady();
        self.setRoom();
        self.setButtons();
    },
    createLienzo: function () {
        var self = this;
        var d = document.querySelector(".bubble_ringow_" + self.nameConference);
        if (d) {
            return false;
        }
        if (typeof self.body === "undefined") {
            self.body = document.querySelector(".containWebRtcNw");
            if (!self.body) {
                self.body = document.querySelector(".miniBar");
            }
        }
        self.canvas = document.createElement("div");
        self.canvas.className = "contenedorChatAndVideo bubble_ringow_" + self.nameConference;
        self.canvas.innerHTML = " <div class='contenedorVideosAndAudio contenedorMain'>\n\
                    <div class='contain_me contain_me_alone'>\n\
                        <video id='localVideo'></video>\n\
                        <div id='localVolume' class='volumen'></div>\n\
                    </div>\n\
                </div>";
        self.body.appendChild(self.canvas);

        self.remotes = document.createElement("div");
        self.remotes.className = "remotes";
        self.remotes.id = "remotes";
        self.canvas.appendChild(self.remotes);

        self.containerButtons = document.createElement("div");
        self.containerButtons.className = "containerButtons";
        self.canvas.appendChild(self.containerButtons);

        self.canvasChat = self.createCanvasChat();
        if (self.debug)
            console.log(self.canvasChat);
        self.canvas.appendChild(self.canvasChat);
        return true;
    },
    setMyName: function (name, set) {
        var self = this;
        if (set === true) {
            self.myName = name;
//            localStorage["myName"] = self.myName;
        } else {
            if (typeof localStorage["myName"] !== "undefined") {
                self.myName = localStorage["myName"];
            } else {
                self.myName = name;
//                localStorage["myName"] = self.myName;
            }
        }
        self.myUser = self.myName;
    },
    setHeName: function (name, set) {
        var self = this;
        if (set === true) {
            self.heName = name;
//            localStorage["heName"] = self.heName;
        } else {
            if (typeof localStorage["heName"] !== "undefined") {
//                self.heName = localStorage["heName"];
            } else {
                self.heName = name;
//                localStorage["heName"] = self.heName;
            }
        }
        var d = document.querySelector(".encName");
        if (d) {
            d.innerHTML = self.heName;
        }
    },
    setHePhoto: function (name, set) {
        var self = this;
        if (set === true) {
            self.hePhoto = name;
//            localStorage["hePhoto"] = self.hePhoto;
        } else {
            if (typeof localStorage["hePhoto"] !== "undefined") {
//                self.heName = localStorage["hePhoto"];
            } else {
                self.hePhoto = name;
//                localStorage["hePhoto"] = self.hePhoto;
            }
        }
        var d = document.querySelector(".encPhoto");
        if (d) {
            d.style.backgroundImage = "url(" + self.hePhoto + ")";
        }
    },
    setReady: function () {
        var self = this;
        self.webrtc = new SimpleWebRTC({
            localVideoEl: 'localVideo',
            remoteVideosEl: '',
            autoRequestMedia: true,
            debug: false,
            detectSpeakingEvents: false,
            autoAdjustMic: false,
            media: {
                video: self.video,
                audio: self.audio
            }
//                        ,
//                        receiveMedia: {
//                            offerToReceiveAudio: 1,
//                            offerToReceiveVideo: 0
//                        }
        });
        self.webrtc.on('readyToCall', function (data) {
            if (self.debug)
                console.log("readyToCall to " + self.nameConference);
            if (self.usejoin !== "true") {
                self.joinRoom();
            }
        });
        self.webrtc.on('channelMessage', function (peer, label, data) {
//            console.log(data.type);
            if (data.type === 'volume') {
                self.showVolume(document.getElementById('volume_' + peer.id), data.volume);
            }
            self.changeStatusActiveOther();
        });
        self.webrtc.on('channelOpen', function (peer, label) {
            if (self.debug)
                console.log("channelOpen", peer);
            self.bot = false;
            clearInterval(self.IntervalisCallingRingow);
            if (typeof self.othersButtons !== "undefined") {
                if (self.othersButtons !== null == self.othersButtons !== "" && self.othersButtons !== false) {
                    self.othersButtons.style.display = "none";
                }
            }
            var d = {};
            d.name = self.myName;
            d.photo = self.myPhoto;
            d.user = self.myUser;
            self.sendMessage(d, "sendNickName");
            self.sendMessage(false, "deliveryMessages");
            self.changeStatusActiveOther();
//            self.addMessage("El usuario " + self.webrtc.getDomId(peer) + " ha ingresado", "me");
        });
        self.webrtc.on('channelClose', function (peer, label) {
            if (self.debug)
                console.log("channelClose", peer);
            self.changeStatusInactiveOther();
//            self.setHeName("", true);
//            self.setHePhoto("", true);
//            self.bot = true;
//            self.addMessage("El usuario " + self.webrtc.getDomId(peer) + " se ha desconectado");
        });
        self.webrtc.on('videoAdded', function (video, peer) {
            if (self.debug)
                console.log('video added in ' + self.nameConference, peer);
            var remotes = document.getElementById('remotes');
            if (remotes) {
                self.bot = false;
                var d = document.createElement('div');
                d.className = 'contenedor';
                d.id = 'container_' + self.webrtc.getDomId(peer);
                d.appendChild(video);
                var vol = document.createElement('div');
                vol.id = 'volume_' + peer.id;
                vol.className = 'volumen';
//                            video.onclick = function () {
//                                video.style.width = video.videoWidth + 'px';
//                                video.style.height = video.videoHeight + 'px';
//                            };
                d.appendChild(vol);
                remotes.appendChild(d);
                self.setSizesRemotes();
                self.soundNewAddUser();
                self.stopRingCalling();
                document.querySelector(".terminar_before_container").style.display = "none";
                document.querySelector(".terminar").style.display = "inline-block";
                self.removeClass(".contain_me", "contain_me_alone");
                if (self.audio && !self.video) {
                    document.querySelector(".callvioce_container").style.display = "block";
                }
            }
        });
        self.webrtc.on('videoRemoved', function (video, peer) {
            if (self.debug)
                console.log('video removed in ' + self.nameConference, peer);
            var remotes = document.getElementById('remotes');
            var el = document.getElementById('container_' + self.webrtc.getDomId(peer));
            if (remotes && el) {
                remotes.removeChild(el);
                self.setSizesRemotes();
                var con = document.querySelectorAll(".contenedor");
                if (con) {
                    if (con.length <= 0) {
                        self.soundLostCalling();
                        self.addClass(document.querySelector(".contain_me"), "contain_me_alone");
                        document.querySelector(".terminar_before_container").style.display = "block";
//                        self.bot = true;
                    }
                    document.querySelector(".callvioce_container").style.display = "none";
                }
            }
        });
        self.webrtc.on('volumeChange', function (volume, treshold) {
            self.showVolume(document.getElementById('localVolume'), volume);
        });
        self.webrtc.connection.on('message', function (data) {
            if (self.debug)
                console.log("message " + data.type, data);
            if (data.type === "sendNickName") {
                var changeUserName = true;
                var changeUser = true;
                if (typeof self.get.heName !== "undefined") {
                    changeUserName = false;
                }
                if (typeof self.get.heUser !== "undefined") {
                    changeUser = false;
                }
                if (self.useForRingow === "true") {
                    changeUser = true;
                    changeUserName = true;
                }
                if (typeof self.get.hePhoto === "undefined") {
                    if (data.payload.message.photo !== self.myPhoto) {
                        self.setHePhoto(data.payload.message.photo, true);
                    }
                }
                if (changeUserName) {
                    if (data.payload.message.name !== self.myName) {
                        self.setHeName(data.payload.message.name, true);
                    }
                }
                if (changeUser) {
                    if (data.payload.message.user !== self.myUser) {
                        self.heUser = data.payload.message.user;
                        self.getTokensNotifyPush(self.heUser);
                    }
                }
            } else
            if (data.type === "messageReceivedFull") {
                self.showChat();
                document.querySelector(".messages").innerHTML = data.payload.message;
                self.scrollBottomMessages();
            } else
            if (data.type === "messageReceived") {
//                self.showChat();
                if (self.get.heName === "undefined") {
                    self.setHeName(data.payload.user, true);
                }
                self.addMessage(data.payload.message, false, false, false, data.payload.user, "NO");
                self.readMessages(self.heName, true);

                var m = {};
                m.tipo = "sendMessageCallRingow";
                m.text = data.payload.message;
                m.room = self.nameConference;
                m.userName = self.heName;
                m.user = self.heUser;
                window.parent.postMessage(m, '*');

            } else
            if (data.type === "messagesendWritten") {
                self.createWritten(data.payload.message);
            } else
            if (data.type === "readMessages") {
                self.readMessages(self.myName, true);
            } else
            if (data.type === "deliveryMessages") {
                self.readMsgCall(self.myName, "recibido");
                self.onDevMessages(self.myName, true);
            }
        });
    },
    cleanWritten: function () {
        var d = document.querySelector(".isWritten");
        if (d)
            d.innerHTML = "";
    },
    createWritten: function (user, time) {
        if (typeof time === "undefined") {
            time = 500;
        }
        var self = this;
        var d = document.querySelector(".isWritten");
        if (d) {
//            d.innerHTML = "<img src='" + self.domain + "/nwlib6/icons/lg.-text-entering-comment-loader.gif' style='height: 56px;position: relative;display: inline-block;position: absolute;top: -39px;left: -10px;z-index: 0;'><span>" + user + " está escribiendo...</span>";
            d.innerHTML = "<img src='" + self.domain + "/nwlib6/icons/lg.-text-entering-comment-loader.gif' />";
        }
        self.scrollBottomMessages();
        setTimeout(function () {
            self.cleanWritten();
        }, time);
    },
    sendWritten: function () {
        var self = this;
        self.sendMessage(self.myName, "messagesendWritten");
    },
    onDevMessages: function (user) {
        var self = this;
        var d = document.querySelectorAll(".spanTextDev_" + self.cleanUserNwC(user));
        for (var i = 0; i < d.length; i++) {
            d[i].innerHTML = "SI";
        }
    },
    onReadMessages: function (user) {
        var self = this;
        var d = document.querySelectorAll(".spanTextSee_" + self.cleanUserNwC(user));
        for (var i = 0; i < d.length; i++) {
            d[i].innerHTML = "SI";
        }
    },
    readAllMessages: function (user) {
        var self = this;
        var r = true;
        var d = document.querySelectorAll(".spanTextSee_" + self.cleanUserNwC(user));
        for (var i = 0; i < d.length; i++) {
            if (d[i].innerHTML === "NO") {
                r = false;
            }
        }
        return r;
    },
    readMessages: function (user, receivedMsg) {
        var self = this;
        if (self.focusIn) {
            var readAllMesagges = self.readAllMessages(user);
            if (user !== self.myName) {
                self.sendMessage(user, "readMessages");
            }
            if (self.useServer && user !== self.myName) {
                if (!readAllMesagges) {
                    self.readMsgCall(user, "leido");
                }
            }
            self.onReadMessages(user);
        }

        if (user !== self.myName) {
            self.sendMessage(false, "deliveryMessages");
        }
        if (user === self.myName) {
            self.onReadMessages(user);
        }
        self.setHoursMsg();
    },
    setFocus: function () {
        var self = this;
        self.messageBox.addEventListener("focusin", function () {
            self.focusIn = true;
            if (self.useForRingow === "true") {
                self.readMessages(self.heName);
            } else {
                self.readMessages(self.heUser);
            }
        });
        self.messageBox.addEventListener("focusout", function () {
            self.focusIn = false;
        });
    },
    sendMessage: function (text, type) {
        var self = this;
        self.webrtc.sendToAll(type,
                {
                    message: text,
                    user: self.myName,
                    nick: "nick"
                });
        self.scrollBottomMessages();
    },
    joinRoom: function (room) {
        var self = this;
        var r = self.nameConference;
        if (typeof room !== "undefined") {
            r = room;
            self.nameConference = r;
        }
        self.webrtc.joinRoom(r);
        if (self.video || self.audio) {
            self.soundIntroCalling();
            self.ringCalling();
        }
        var d = document.querySelector(".containerButtonJoin");
        if (d) {
            d.style.display = "none";
        }
        self.readyToCall = true;
    },
    endCall: function () {
        var self = this;
        self.stopRingCalling();
        self.offVideo();
        self.close();
        var d = document.querySelector(".terminar");
        if (d) {
            d.style.display = "none";
        }
        var d = document.querySelector(".llamar");
        if (d) {
            d.style.display = "inline-block";
        }
        var d = self.canvasChat;
        if (d) {
            d.innerHTML = "";
        }
//            window.location = "?callEnd=true";
    },
    close: function () {
        var self = this;
        if (typeof self.webrtc !== "undefined") {
            self.webrtc.stopLocalVideo();
            self.webrtc.leaveRoom();
//            self.webrtc.connection.disconnect();
        }
//        self.webrtc = null;
        if (self.remotes) {
            self.remotes.innerHTML = "";
        }
    },
    GET: function () {
        var loc = document.location.href;
        var getString = loc.split('?')[1];
        if (getString == undefined) {
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
    soundNewMsgHe: function () {
        var self = this;
        var a = document.querySelector(".soundNewMsgHe");
        if (!a) {
            var d = document.createElement("audio");
            d.className = "soundNewMsgHe";
            d.src = self.domain + "/nwlib6/audio/ping.mp3";
            document.body.appendChild(d);
            if (interactUserInDocRingow === true) {
                d.play();
            } else {
                setTimeout(function () {
                    self.soundNewMsgHe();
                }, 1000);
            }
        } else {
            if (interactUserInDocRingow === true) {
                a.play();
            } else {
                setTimeout(function () {
                    self.soundNewMsgHe();
                }, 1000);
            }
        }
    },
    soundNewMsgMe: function () {
        var self = this;
        var a = document.querySelector(".soundNewMsgMe");
        if (!a) {
            var d = document.createElement("audio");
            d.className = "soundNewMsgMe";
            d.src = self.domain + "/nwlib6/audio/blop.mp3";
            document.body.appendChild(d);
            if (interactUserInDocRingow === true) {
                d.play();
            } else {
                setTimeout(function () {
                    self.soundNewMsgMe();
                }, 1000);
            }
        } else {
            if (interactUserInDocRingow === true) {
                a.play();
            } else {
                setTimeout(function () {
                    self.soundNewMsgMe();
                }, 1000);
            }
        }
    },
    soundNewAddUser: function () {
        var self = this;
        var d = document.createElement("audio");
        d.className = "soundNewAddUser";
        d.src = self.domain + "/nwlib6/audio/2017/BeepcortoparaWhatsapp.mp3";
        document.body.appendChild(d);
        if (interactUserInDocRingow === true) {
            d.play();
        } else {
            setTimeout(function () {
                self.soundNewAddUser();
            }, 1000);
        }
    },
    soundLostCalling: function () {
        var self = this;
        var d = document.createElement("audio");
        d.className = "soundLostCalling";
        d.src = self.domain + "/nwlib6/audio/misc312.mp3";
        document.body.appendChild(d);
        if (interactUserInDocRingow === true) {
            d.play();
        } else {
            setTimeout(function () {
                self.soundLostCalling();
            }, 1000);
        }
    },
    soundIntroCalling: function () {
        var self = this;
        var d = document.createElement("audio");
        d.className = "soundIntroCalling";
        d.src = self.domain + "/nwlib6/audio/misc101.mp3";
        document.body.appendChild(d);
        if (interactUserInDocRingow === true) {
            d.play();
        } else {
            setTimeout(function () {
                self.soundIntroCalling();
            }, 1000);
        }
    },
    ringCalling: function () {
        var self = this;
        self.stopRingCalling();
        var d = document.createElement("audio");
        d.className = "soundCalling";
        d.src = self.domain + "/nwlib6/audio/misc027.mp3";
        document.body.appendChild(d);
        self.interValRinging = setInterval(function () {
            if (interactUserInDocRingow === true) {
                d.play();
            } else {
                setTimeout(function () {
                    self.ringCalling();
                }, 1000);
            }
        }, 2500);
    },
    stopRingCalling: function () {
        var self = this;
        clearInterval(self.interValRinging);
        var d = document.querySelector(".soundCalling");
        if (d)
            d.remove();
    },
    isMobile: function () {
        var device = navigator.userAgent;
        if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
        {
            return true;
        }
        return false;
    },
    setSizesRemotes: function () {
        var w = "100%";
        var con = document.querySelectorAll(".contenedor");
        if (con) {
            w = 100 / con.length;
        }
        for (var i = 0; i < con.length; i++) {
            var c = con[i];
            c.style.width = w + "%";
        }
    },
    setButtons: function () {
        var self = this;
        if (self.usejoin === "true") {
            document.querySelector(".containerButtonJoin").style.display = "block";
            document.querySelector(".join").addEventListener("click", function () {
                self.joinRoom();
            });
        }

//        var con = document.querySelector(".containerButtons");
        var con = self.containerButtons;
        con.innerHTML = "";

        self.callvioce_container = document.createElement("div");
        self.callvioce_container.className = "callvioce_container";
        self.callvioce_container.style = "display:none";
        self.canvas.appendChild(self.callvioce_container);

        var btn = document.createElement("div");
        btn.className = "btnvoice_active";
        btn.innerHTML = "<i class='material-icons'>mic</i>";
        self.callvioce_container.appendChild(btn);
        btn.onclick = function () {
            window.history.back();
        };

        self.terminar_before_container = document.createElement("div");
        self.terminar_before_container.className = "terminar_before_container";
        con.appendChild(self.terminar_before_container);

        var btn = document.createElement("button");
        btn.className = "terminar_before";
        btn.innerHTML = "<i class='material-icons'>call_end</i>";
        self.terminar_before_container.appendChild(btn);
        btn.onclick = function () {
            var val = "He salido de la video-audio llamada";
            self.sendMessage(val, "messageReceived");
            self.addMessage(val, "me", true, false, "NO");
            window.history.back();
        };

        var btn = document.createElement("button");
        btn.className = "terminar";
        btn.innerHTML = "<i class='material-icons'>call_end</i>";
        btn.style = "display:none";
        con.appendChild(btn);
        btn.onclick = function () {
            var val = "He salido de la video-audio llamada";
            self.sendMessage(val, "messageReceived");
            self.addMessage(val, "me", true, false, "NO");
//            self.endCall();
            window.history.back();
        };

        var btn = document.createElement("button");
        btn.className = "llamar";
        btn.innerHTML = "<i class='material-icons'>call</i>";
        btn.style = "display:none";
        con.appendChild(btn);
        btn.onclick = function () {
            webrtcNw.initialize(self.nameConference);
            window.location.reload();
        };

        var btn = document.createElement("button");
        btn.className = "oncam";
        btn.innerHTML = "<i class='material-icons'>videocam_off</i>";
        btn.style = "display:none";
        con.appendChild(btn);
        btn.onclick = function () {
            self.OnVideo();
        };

        var btn = document.createElement("button");
        btn.className = "offcam";
        btn.innerHTML = "<i class='material-icons'>videocam</i>";
        con.appendChild(btn);
        btn.onclick = function () {
            self.offVideo();
        };

        var btn = document.createElement("button");
        btn.className = "onsound";
        btn.innerHTML = "<i class='material-icons'>volume_off</i>";
        btn.style = "display:none";
        con.appendChild(btn);
        btn.onclick = function () {
            self.soundOn();
        };

        var btn = document.createElement("button");
        btn.className = "offsound";
        btn.innerHTML = "<i class='material-icons'>volume_up</i>";
        con.appendChild(btn);
        btn.onclick = function () {
            self.soundOff();
        };

        var btn = document.createElement("button");
        btn.className = "showChat";
        btn.innerHTML = "<i class='material-icons'>chat</i>";
        con.appendChild(btn);
        btn.onclick = function () {
            self.showChat();
        };

        var btn = document.createElement("button");
        btn.className = "hiddenChat";
        btn.innerHTML = "<i class='material-icons'>chat</i>";
        btn.style = "display:none";
        con.appendChild(btn);
        btn.onclick = function () {
            self.hiddenChat();
        };
        if (self.openchat === "true") {
            self.showChat();
            if (!self.video && !self.audio) {
                document.querySelector(".callEnc").style.display = "block";
                document.querySelector(".videocallEnc").style.display = "block";
                document.querySelector(".contenedorMain").style.display = "none";
//                self.addClass(document.querySelector(".containerChat"), "containerChat_maximice");
                self.addClass(self.canvasChat, "containerChat_maximice");
                self.stopRingCalling();
            } else {
                self.addClass(document.querySelector(".encChat"), "encChat_fix");
                document.querySelector(".hiddenChat").style.display = "none";
            }
        }
        document.body.onresize = function () {
            self.scrollBottomMessages();
        };
    },
    createChat: function () {
        var self = this;
        var d = document.createElement("div");
        d.className = "contentChat";
//        d.innerHTML = "<div class='encChat'></div><div class='messages'></div>\n\
//      <div class='isWritten'></div>\n\
//    <form id='footerChat' class='footerChat' onsubmit='return false;'>\n\
//      <input class='messageBox' type='text' placeholder='Your message..'>\n\
//      <button class='btnsubmit' type='submit'><img src='" + self.domain + "/nwlib6/icons/svg/send.svg' /></button>\n\
//    </form>";
//        document.querySelector(".containerChat").appendChild(d);
        self.canvasChat.appendChild(d);

        self.encChat = document.createElement("div");
        self.encChat.className = "encChat";
        d.appendChild(self.encChat);

        self.messages = document.createElement("div");
        self.messages.className = "messages";
        d.appendChild(self.messages);

        self.NoMoreMessages = document.createElement("div");
        self.NoMoreMessages.className = "NoMoreMessages";
        self.NoMoreMessages.style = "display:none;";
        self.NoMoreMessages.innerHTML = "No hay más mensajes";
        self.messages.appendChild(self.NoMoreMessages);

        self.loadMoreMessages = document.createElement("button");
        self.loadMoreMessages.className = "loadMoreMessages";
        self.loadMoreMessages.style = "display:none;";
        self.loadMoreMessages.innerHTML = "Leer más mensajes";
        self.loadMoreMessages.onclick = function () {
            var s = this;
            var m = document.querySelectorAll(".message");
            for (var x = 0; x < m.length; x++) {
                m[x].remove();
            }
            self.limitLoadMessages = self.limitLoadMessages + 10;
            self.loadMessages(function (r) {
                document.querySelector('.contentChat .messages').scrollTop = 0;
                if (self.totalMessages >= r.length) {
                    s.style.display = "none";
                    self.NoMoreMessages.style.display = "block";
                }
            });
        };
        self.messages.appendChild(self.loadMoreMessages);

        self.isWritten = document.createElement("div");
        self.isWritten.className = "isWritten";
        d.appendChild(self.isWritten);

        self.form = document.createElement("form");
        self.form.className = "footerChat";
        d.appendChild(self.form);
        self.form.setAttribute("onsubmit", "return false");

        self.othersButtons = document.createElement("div");
        self.othersButtons.style = "position: absolute;bottom: 0;width: 100%;padding: 10px;display: none;flex-shrink: 0;background-color: #ffffff;";
        d.appendChild(self.othersButtons);

        self.btnCallAgain = document.createElement("button");
        self.btnCallAgain.innerHTML = "Volver a llamar";
        self.btnCallAgain.style = "border: 1px solid #ccc;margin: auto;padding: 15px;";
        self.btnCallAgain.onclick = function () {
            self.createWritten(self.heName, 3000);
            setTimeout(function () {
                var msg = self.botResponseWaiting;
                self.addMessage(msg);
            }, 3000);
            self.form.style.visibility = "visible";
            self.othersButtons.style.display = "none";
            self.bot = false;
            self.isCallingRingow = false;
            self.changeStatusCall("LLAMANDO", "chat");
        };
        self.othersButtons.appendChild(self.btnCallAgain);

        self.btnCloseAgain = document.createElement("button");
        self.btnCloseAgain.innerHTML = "Cerrar";
        self.btnCloseAgain.style = "border: 1px solid #ccc;margin: auto;padding: 15px;";
        self.btnCloseAgain.onclick = function () {
            self.hiddenChat();
        };
        self.othersButtons.appendChild(self.btnCloseAgain);

        self.btnCalificarAgain = document.createElement("button");
        self.btnCalificarAgain.innerHTML = "Calificar";
        self.btnCalificarAgain.style = "border: 1px solid #ccc;margin: auto;padding: 15px;";
        self.btnCalificarAgain.onclick = function () {
            self.hiddenChat();
        };
        self.othersButtons.appendChild(self.btnCalificarAgain);

        self.messageBox = document.createElement("input");
        self.messageBox.className = "messageBox";
        self.messageBox.type = "text";
        self.messageBox.placeholder = "Your message...";
        self.form.appendChild(self.messageBox);

        self.btnsubmit = document.createElement("button");
        self.btnsubmit.className = "btnsubmit";
        self.btnsubmit.type = "submit";
        self.btnsubmit.innerHTML = "<img src='" + self.domain + "nwlib6/icons/svg/send.svg' />";
        self.form.appendChild(self.btnsubmit);

        self.form.addEventListener("submit", function () {
            var box = self.messageBox;
            var val = box.value;
            if (val !== "") {
                self.sendMessage(val, "messageReceived");
                self.addMessage(val, "me", true, false);
            }
            box.value = "";
        });

        self.btnsubmit.addEventListener("click", function () {
            var box = self.messageBox;
            var val = box.value;
            if (val !== "") {
                self.sendMessage(val, "messageReceived");
                self.addMessage(val, "me", true, false);
            }
            box.value = "";
        });

        var html = "";
        var cbg = "";
        if (self.evalueData(self.hePhoto)) {
            cbg = " style='background-image: url(" + self.hePhoto + ");' ";
        }
        html += "<div class='encStatus'></div>";
        html += "<div class='encPhoto' " + cbg + "></div>";
        html += "<div class='encName'>" + self.heName + "</div>";
        var claud = "";
        if (self.useAudioCall === false)
            claud = "hiddenButton";
        html += "<i class='material-icons iconsEnc callEnc " + claud + "'>call</i>";
        var clavid = "";
        if (self.useVideoCall === false)
            clavid = "hiddenButton";
        html += "<i class='material-icons iconsEnc videocallEnc " + clavid + "'>videocam</i> ";
        html += "<img class='iconsEnc closeChat' src='" + self.domain + "nwlib6/icons/svg/close_blanco.png' />";
        html += "<i class='material-icons iconsEnc openChat'>open_in_new</i>";
        html += "<div class='myName'>myName: " + self.myName + "</div>";
//        document.querySelector(".encChat").innerHTML = html;
        self.encChat.innerHTML = html;

        if (self.useAudioCall === true) {
            document.querySelector(".callEnc").addEventListener("click", function () {
                var loc = location.href.replace("video=true", "video=false");
                loc = loc.replace("audio=false", "audio=true");
                var locurl = loc.replace(/&/gi, "(ampersand)");
                var locrechz = location.href.replace("video=true", "video=false");
                locrechz = locrechz.replace("audio=true", "audio=false");
                locrechz = locrechz.replace(/&/gi, "(ampersand)");
                var val = "<div class='globeCall callVoice'>He iniciado una llamada de voz. ";
                val += "<a href='" + encodeURI(locurl) + "' target='_SELF' class='btn_conts contestar_a'><i class='material-icons'>mic</i> <span>Contestar</span></a>";
                val += "</div>";
                var valsend = val.replace(/\(ampersand\)/g, "&");
                self.sendMessage(valsend, "messageReceived");
                self.addMessage(val, "me", true, false);

                var alter = "iniciar_audiollamada";
                self.sendMessage(alter, "messageReceived");
                self.addMessage(alter, "me", true, false);

                var m = {};
                m.tipo = "initaudiocallringow";
                m.room = self.nameConference;
                m.loc = loc;
                window.parent.postMessage(m, '*');
                location.href = loc;
            });
        }
        if (self.useVideoCall === true) {
            document.querySelector(".videocallEnc").addEventListener("click", function () {
                var loc = location.href.replace("video=false", "video=true");
                loc = loc.replace("audio=false", "audio=true");
                var locurl = loc.replace(/&/gi, "(ampersand)");
                var locrechz = location.href.replace("video=true", "video=false");
                locrechz = locrechz.replace("audio=true", "audio=false");
                locrechz = locrechz.replace(/&/gi, "(ampersand)");
                var val = "<div class='globeCall callVideo'>He iniciado una video llamada. ";
                val += "<a href='" + locurl + "' target='_SELF' class='btn_conts contestar_a'><i class='material-icons'>videocam</i> <span>Contestar</span></a>";
                val += "</div>";
                var valsend = val.replace(/\(ampersand\)/g, "&");
                self.sendMessage(valsend, "messageReceived");
                self.addMessage(val, "me", false, false);
                var m = {};
                m.tipo = "initvideocallringow";
                m.room = self.nameConference;
                m.loc = loc;
                window.parent.postMessage(m, '*');
                location.href = loc;
            });
        }
        document.querySelector(".closeChat").addEventListener("click", function () {
            self.hiddenChat();
        });
        document.querySelector(".openChat").addEventListener("click", function () {
            self.showChat();
            var m = {};
            m.tipo = "openringow";
            m.room = self.nameConference;
            window.parent.postMessage(m, '*');
        });

        self.loadMessages();

        self.messageBox.onkeyup = function (e) {
            var box = self.messageBox;
            var val = box.value;
            if (val !== "") {
                self.sendWritten();
            }
        };
        self.setFocus();

        setInterval(function () {
            self.setHoursMsg();
        }, 10000);

    },
    totalMessages: 0,
    limitLoadMessages: 10,
    loadMessages: function (callback) {
        var self = this;
        if (self.useServer) {
            self.saveOrUpdate(function (r) {
                var total = self.totalMessages;
                if (typeof r !== "undefined") {
                    if (r !== "true") {
                        total = r.length;
                        if (typeof r !== "undefined" && r !== null && r !== false && r !== "") {
                            if (total >= 10) {
                                document.querySelector(".loadMoreMessages").style.display = "block";
                            }
                            for (var i = 0; i < total; i++) {
                                var user = r[i].usuario;
                                var fecha = r[i].fecha;
                                var text = r[i].texto;
                                var visto = r[i].leido;
                                var recibido = r[i].recibido;
                                text = text.replace(/\(ampersand\)/g, "&");
                                var tipo = "";
                                if (user === self.myName) {
                                    tipo = "me";
                                }
                                self.addMessage(text, tipo, false, fecha, user, visto, recibido);
                            }
                        }
                        self.scrollBottomMessages();
                    }
                }

                self.loadHistory = true;
                if (self.debug)
                    console.log("self.loadHistory", total);
                if (self.bot) {
                    self.botInit();
                }
                if (typeof callback !== "undefined") {
                    callback(r);
                }
                self.totalMessages = total;

                if (self.statusCallRingow !== false) {
                    if (self.statusCallRingow === "LLAMANDO") {
                        self.artiveSearchCallEnded();
                    }
                }

            });
        }
    },
    changeStatusActiveOther: function () {
        var self = this;
        self.addClass(document.querySelector(".encStatus"), "changeStatusActive");
    },
    changeStatusInactiveOther: function () {
        var self = this;
        self.removeClass(".encStatus", "changeStatusActive");
    },
    setHoursMsg: function () {
        var self = this;
        var d = document.querySelectorAll(".message__fecha");
        if (d.length > 0) {
            for (var i = 0; i < d.length; i++) {
                var fecha = d[i].getAttribute("data-date");
                var dateFormat = self.calcularTiempoDosFechas(fecha);
                var valueDate = dateFormat.dateInFormat;
                d[i].innerHTML = valueDate;
            }
        }
    },
    btnInitVideo: function () {
        var self = this;
        self.video = true;
        self.setReady();
    },
    cleanUserNwC: function (u) {
        if (u === null) {
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
    getNavigator: function (all) {
        var r = "";
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
            r = "Internet Explorer";
        } else
        if (navigator.userAgent.indexOf('Firefox') != -1) {
            r = "Firefox";
        } else
        if (navigator.userAgent.indexOf('Chrome') != -1) {
            r = "Google Chrome";
        } else
        if (navigator.userAgent.indexOf('Opera') != -1) {
            r = "Opera";
        } else {
            r = "Navegador no identificado ...";
        }
        if (all == true) {

        }
        return r;
    },
    scrollBottomMessages: function () {
        var s = document.querySelectorAll('.contentChat .messages')[0];
        if (s) {
            var h = s.scrollHeight;
            var c = document.querySelector('.contentChat .messages');
            c.scrollTop = h;
        }
    },
    addMessage: function (textorigin, type, srv, fecha, user, visto, recibido) {
        var self = this;
        var endcall = false;
        if (self.botLastMsg === self.getNameBotPredeterminate) {
            self.myName = textorigin;
            self.isSetMyName = true;
        }
        if (self.botLastMsg === self.getEmailBotPredeterminate) {
            self.myUser = textorigin;
            self.setMyCorreo = true;
        }
        if (self.botLastMsg === self.getPhoneBotPredeterminate) {
            self.myCelular = textorigin;
            self.setMyCelular = true;
        }
        if (textorigin === "llamada_finalizada") {
            textorigin = "La llamada ha sido finalizada";
            clearInterval(self.IntervalisCallingRingow);
            self.createWritten(self.heName, 3000);
            setTimeout(function () {
                var msg = "¿Qué deseas hacer?";
                self.addMessage(msg);
                self.othersButtons.style.display = "flex";
                self.form.style.visibility = "hidden";
            }, 3000);
        }
        var text = self.bubbleChat(textorigin, type, fecha, user, visto, recibido);

        var d = self.messages;
        if (d) {
            d.appendChild(text);
        }
        self.scrollBottomMessages();

        if (srv !== false) {
            var tsen = text.querySelector(".message__bubble").innerHTML;
            self.saveMsgSrv(tsen, user);
        }
        var calling = false;
        if (srv !== false) {
            if (textorigin === "iniciar_chat") {
                calling = true;
                self.changeStatusCall("LLAMANDO", "chat");
            } else
            if (textorigin === "iniciar_videollamada") {
                calling = true;
                self.changeStatusCall("LLAMANDO", "videocalldirect");
            } else
            if (textorigin === "iniciar_audiollamada") {
                calling = true;
                self.changeStatusCall("LLAMANDO", "audiocalldirect");
            }
            if (calling) {
                self.messages.appendChild(self.bubbleChat(self.botResponseWaiting, type));
            }
        }
        if (user !== self.myName && visto === "NO" && !self.focusIn && self.loadHistory) {
            var theBody = textorigin;
            var theIcon = "";
            var theTitle = user + " escribe:";
            var callback = false;
            self.notificationPushNwrtc(theBody, theIcon, theTitle, callback);
        }
        self.setHoursMsg();
    },
    bubbleChat: function (text, type, date, user, visto, recibido) {
        var self = this;
        var fecha = self.getDateHour();
        if (typeof date !== "undefined") {
            if (date !== false) {
                fecha = date;
            }
        }
        var dateFormat = self.calcularTiempoDosFechas(fecha);
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
        var says = self.heName;
        if (self.bot !== true) {
            if (self.heUser === self.myUser || user === self.myUser || user === self.myName || self.heName === self.myName || self.heName === self.myUser) {
                type = "me";
            }
        }
        var seeBloque = "";
        if (self.debug)
            console.log(text);
        if (text === "iniciar_chat") {
            seeBloque = "style='display: none;'";
        }
        var cla = "message message--theirs";
        if (type === "me") {
            cla = "message message--mine";
            says = self.myName;
            if (self.loadHistory)
                self.soundNewMsgMe();
        } else {
            dev = "SI";
            if (self.loadHistory)
                self.soundNewMsgHe();
        }
        if (typeof user !== "undefined") {
            says = user;
        }
        var showSays = "";
        if (self.evalueData(says)) {
            if (says.indexOf("Visitor-") !== -1) {
                showSays = "style='display:none;'";
            }
        }
        var r = "<div class='" + cla + "' " + seeBloque + " >";
        var body = "";
        body += "<div class='message__name' " + showSays + ">" + says + "</div>";
        body += "<div class='message__fecha' data-date='" + fecha + "'>" + valueDate + "</div>";
        body += " <div class='message__bubble'>" + text + "</div>";
        body += " <div class='message__see'>Visto: <span class='spanTextSee spanTextSee_" + self.cleanUserNwC(says) + "'>" + see + "</span> Entregado: <span class='spanTextDev spanTextDev_" + self.cleanUserNwC(says) + "'>" + dev + "</span></div>";
        r += body;
        r += "</div>";

        var d = document.createElement("div");
        d.className = cla;
        d.innerHTML = r;
        return d;
    },
    showChat: function (onlyShow) {
        var self = this;
        if (self.chat === false) {
            return false;
        }
        var d = self.canvasChat;
        if (onlyShow !== true) {
            if (!d || typeof d.length === "undefined") {
                self.createChat();
            }
        }
        self.removeClass(self.encChat, "encChatMinimiced", true);
        self.addClass(document.querySelector(".contenedorMain"), "contenedorMainMiddle");
        self.addClass(document.querySelector(".remotes"), "contenedorMainMiddle");
//        self.addClass(document.querySelector(".containerChat"), "containerChatMiddle");
//        self.addClass(document.querySelector(".containerChat"), "containerChatVisible");
        self.addClass(self.canvasChat, "containerChatMiddle");
        self.addClass(self.canvasChat, "containerChatVisible");

        document.querySelector(".closeChat").style.display = "block";
        document.querySelector(".openChat").style.display = "none";
//        document.querySelector(".encName").style.display = "block";
        document.querySelector(".myName").style.display = "block";
        if (!self.video && !self.audio) {
            document.querySelector(".callEnc").style.display = "block";
            document.querySelector(".videocallEnc").style.display = "block";
        } else {
            document.querySelector(".showChat").style.display = "none";
            document.querySelector(".hiddenChat").style.display = "inline-block";
        }

//        var m = {};
//        m.tipo = "openringow";
//        m.room = self.nameConference;
//        window.parent.postMessage(m, '*');

    },
    hiddenChat: function () {
        var self = this;
//        self.addClass(document.querySelector(".encChat"), "encChatMinimiced");
        self.addClass(self.encChat, "encChatMinimiced");
        document.querySelector(".myName").style.display = "none";
//        document.querySelector(".encName").style.display = "none";
        document.querySelector(".closeChat").style.display = "none";
        document.querySelector(".openChat").style.display = "block";
        if (!self.video && !self.audio) {
            document.querySelector(".callEnc").style.display = "none";
            document.querySelector(".videocallEnc").style.display = "none";
        } else {
            self.removeClass(".contenedorMain", "contenedorMainMiddle");
            self.removeClass(".remotes", "contenedorMainMiddle");
//            self.removeClass(".containerChat", "containerChatMiddle");
//            self.removeClass(".containerChat", "containerChatVisible");
            self.removeClass(self.canvasChat, "containerChatMiddle", true);
            self.removeClass(self.canvasChat, "containerChatVisible", true);
            document.querySelector(".showChat").style.display = "inline-block";
            document.querySelector(".hiddenChat").style.display = "none";
        }
        var m = {};
        m.tipo = "closeringow";
        m.room = self.nameConference;
        window.parent.postMessage(m, '*');
    },
    OnVideo: function () {
        var self = this;
        self.webrtc.resumeVideo();
        document.querySelector(".offcam").style.display = "inline-block";
        document.querySelector(".oncam").style.display = "none";
    },
    offVideo: function () {
        var self = this;
        if (self.webrtc) {
            self.webrtc.pauseVideo();
        }
        var d = document.querySelector(".offcam");
        if (d) {
            d.style.display = "none";
        }
        var d = document.querySelector(".oncam");
        if (d) {
            d.style.display = "inline-block";
        }
    },
    soundOff: function () {
        var self = this;
        self.webrtc.mute();
        document.querySelector(".offsound").style.display = "none";
        document.querySelector(".onsound").style.display = "inline-block";
    },
    soundOn: function () {
        var self = this;
        self.webrtc.unmute();
        document.querySelector(".onsound").style.display = "none";
        document.querySelector(".offsound").style.display = "inline-block";
    },
    createRoom: function () {
        var self = this;
        self.webrtc.createRoom(self.nameConference, function (err, name) {
            console.log(' create sala conferencia cb in ' + self.nameConference, arguments);
            var newUrl = location.pathname + '?' + name;
            if (!err) {
                //                            history.replaceState({foo: 'bar'}, null, newUrl);
                self.setRoom();
            } else {
                console.log(err);
            }
        });
    },
    setRoom: function () {
        var self = this;
        return;
    },
    showVolume: function (el, volume) {
        if (!el)
            return;
        if (volume < -45) { // variamos el volumen -45 and -20
            el.style.height = '0px';
        } else if (volume > -20) {
            el.style.height = '100%';
        } else {
            el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
        }
    },
    calcularTiempoDosFechas: function (date1, date2) {
        var self = this;
        if (typeof date2 === "undefined") {
            date2 = self.getDateHour();
        }
        var hoy = self.getDateHour();
        var start_actual_time = new Date(date1);
        var end_actual_time = new Date(date2);
        var diff = end_actual_time - start_actual_time;
        var diffSeconds = diff / 1000;
        var HH = Math.floor(diffSeconds / 3600);
        var MM = Math.floor(diffSeconds % 3600) / 60;
        var SS = diffSeconds % 60;
        var days = self.diffEntreFechas(date1, date2);
        var hours = (HH < 10) ? ("0" + HH) : HH;
        var infoDate = self.dataOfDate(date1);
        var infoDate2 = self.dataOfDate(hoy);
        var mesDate = infoDate.fecha_mes;
        var mesDateText = infoDate.fecha_mes_text;
        var dayDate = infoDate.fecha_dia;
        var dayDateText = infoDate.fecha_dia_text;
        var hoursDate = infoDate.hora_horas;
        var minutesDate = infoDate.hora_minutos;
        var minutes = ((MM < 10) ? ("0" + MM) : MM);
        var seconds = ((MM < 10) ? ("0" + MM) : SS);
        var formatted = hours + ":" + minutes;
        minutes = parseInt(minutes);
        var isMayor = false;

        if (date1 > hoy) {
            isMayor = true;
        }

        var r = {};
        r.hoy = hoy;
        r.fecha_mayor_a_hoy = isMayor;
        r.date1 = date1;
        r.time_complet = formatted;
        r.days = days;
        r.hours = hours;
        r.mesDate = mesDate;
        r.mesDateText = mesDateText;
        r.dayDate = dayDate;
        r.dayDateText = dayDateText;
        r.hoursDate = hoursDate;
        r.minutesDate = minutesDate;
        r.minutes = minutes;
        r.seconds = seconds;

        var dateInFormat = mesDateText + " " + dayDate + " a las " + hoursDate + ":" + minutesDate;
        if (isMayor == true) {
            /*        dateInFormat = "En " + hoursDate + ":" + minutesDate;*/
        } else {
            if (days > 0) {
                if (days == 1) {
                    dateInFormat = self.str("Ayer a las") + " " + hoursDate + ":" + minutesDate;
                } else {
                    dateInFormat = mesDateText + " " + dayDate + " a las " + hoursDate + ":" + minutesDate;
                }
            } else {
                if (hours < 24) {
                    if (hours < 1) {
                        if (minutes < 59) {
                            dateInFormat = self.str("Hace") + " " + minutes + " " + self.str("minutos");
                        }
                    } else {
                        dateInFormat = self.str("Hace") + " " + hours + " " + self.str("horas") + " " + self.str("y") + " " + minutes + " " + self.str("minutos");
                    }
                }
            }
        }
        r["dateInFormat"] = dateInFormat;
        return r;
    },
    diffEntreFechas: function (fechaIni, fechaFin) {
        var self = this;
        if (fechaFin == undefined) {
            fechaFin = self.getDateHour();
        }
        var diaEnMils = 1000 * 60 * 60 * 24,
                desde = new Date(fechaIni.substr(0, 10)),
                hasta = new Date(fechaFin.substr(0, 10)),
                diff = hasta.getTime() - desde.getTime() + diaEnMils;/* +1 incluir el dia de ini*/

        var r = diff / diaEnMils;
        r = r - 1;
        return r;
    },
    dataOfDate: function (date) {
        var self = this;
        var onlyF = date;
        if (date == undefined) {
            date = getDateHour();
        }
        if (date.split(" ").length == 1) {
            date = date + " 00:00:00";
        }
        onlyF = date.split(" ")[0];
        var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
        var dateString = date;
        dateString = dateString.replace(/-/g, '/');
        var d = new Date(dateString);
        var r = {};
        r["fecha_sin_hora"] = onlyF;
        r["fecha_completa"] = date;
        r["fecha_anio"] = d.getFullYear();
        r.fecha_mes = d.getMonth() + 1;
        r["fecha_mes_string"] = r["fecha_mes"].toString();
        if (r["fecha_mes_string"].length == 1) {
            r["fecha_mes_string"] = "0" + r["fecha_mes_string"];
        }
        r["fecha_mes_text"] = self.lettersArray(r.fecha_mes);
        r["fecha_dia"] = d.getDate();
        r["fecha_dia_semana"] = d.getDay();
        r.fecha_dia_text = diasSemana[d.getDay()];
        /*    r["fecha_dia_text"] = diasArray(r["fecha_dia_semana"]);*/

        var habil = "SI";
        var festivo = "NO";
        if (r["fecha_dia_semana"] == 6 || r["fecha_dia_semana"] == 0) {
            habil = "NO";
        }
        if (r["fecha_dia_semana"] == 0) {
            festivo = "SI";
        }
        r["fecha_dia_habil"] = habil;
        r["fecha_dia_festivo"] = festivo;
        r["fecha"] = r["fecha_anio"] + "-" + r["fecha_mes"] + "-" + r["fecha_dia"];
        r["hora_ex"] = d.getTime();
        r["hora_horas"] = d.getHours();
        r["hora_minutos"] = d.getMinutes();
        r["hora_segundos"] = d.getSeconds();
        r["hora_completa"] = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return r;
    },
    str: function (text) {
        return text;
    },
    lettersArray: function (i) {
        var r = {};
        r["1"] = "Enero";
        r["2"] = "Febrero";
        r["3"] = "Marzo";
        r["4"] = "Abril";
        r["5"] = "Mayo";
        r["6"] = "Junio";
        r["7"] = "Julio";
        r["8"] = "Agosto";
        r["9"] = "Septiembre";
        r["10"] = "Octubre";
        r["11"] = "Noviembre";
        r["12"] = "Diciembre";
        return r[i.toString()];
    },
    getDateHour: function () {
        var d = new Date();
        var month = (d.getMonth() + 1).toString();
        var day = d.getDate().toString();
        var hora = d.getHours().toString();
        var minuto = d.getMinutes().toString();
        var segundo = d.getSeconds().toString();
        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }
        if (hora.length == 1) {
            hora = "0" + hora;
        }
        if (minuto.length == 1) {
            minuto = "0" + minuto;
        }
        if (segundo.length == 1) {
            segundo = "0" + segundo;
        }
        var fecha = d.getFullYear() + "-" + month + "-" + day + " " + hora + ":" + minuto + ":" + segundo;
        return fecha;
    },
    getFullDate: function () {
        var self = this;
        return self.getDate() + " " + self.getHour();
    },
    getDate: function () {
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
        var f = new Date();
        return diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
    },
    getHour: function () {
        var d = new Date();
        return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    },
    addClass: function (el, cls) {
        if (el) {
            if (el.classList) {
                el.classList.add(cls);
            } else {
                var cur = ' ' + (el.getAttribute('class') || '') + ' ';
                if (cur.indexOf(' ' + cls + ' ') < 0) {
                    setClass(el, (cur + cls).trim());
                }
            }
        }
    },
    removeClass: function (el, cls, isWidget) {
        var di = null;
        if (isWidget === true) {
            di = el;
            di.classList.remove(cls);
        } else {
            di = document.querySelectorAll(el);
        }
        var t = di.length;
        for (var i = 0; i < t; i++) {
            var d = di[i];
            d.classList.remove(cls);
        }
    },
    botInit: function () {
        var self = this;
//        document.querySelector(".footerChat").addEventListener("submit", function () {
        self.form.addEventListener("submit", function () {
            var la = document.querySelectorAll(".message--mine");
            var last = la[la.length - 1];
            var mine = last.querySelector(".message__bubble");
            var rta = self.botSearchResponse(mine.innerHTML);
            if (rta === self.botResponseNoFound && typeof self.botInResponse !== "undefined") {
                rta = self.botSearchResponse(false, parseInt(self.botInResponse));
            }
            if (rta !== false) {
                self.botSend(rta);
            }
        });
        if (self.loadHistory === false) {
            var rta = self.botSearchResponse(false, 0);
            if (rta !== false)
                self.botSend(rta, 0);
        }
    },
    botSend: function (msg, time) {
        var self = this;
        if (!self.bot) {
            return false;
        }
        setTimeout(function () {
            self.createWritten(self.heName, 5000);
        }, 1000);
        if (typeof time === "undefined") {
            time = 3000;
        }
        setTimeout(function () {
            var val = msg;
            self.sendMessage(val, "messageReceived");
            self.addMessage(val, false, true, false, self.heName, "SI");
            self.scrollBottomMessages();
            self.cleanWritten();
        }, time);
    },
    keyw: false,
    searchText: false,
    botSearchResponse: function (text, index) {
        var self = this;
//        if (self.isSetMyName === true) {
//            self.createWritten(self.heName, 2000);
//            setTimeout(function () {
//                self.addMessage(self.botResponseWaiting);
//            }, 2000);
//            self.bot = false;
//            return false;
//        }
        self.searchText = text;
        var r = self.botDataMsg();
        var rta = self.botResponseNoFound;
        if (text === "iniciar_chat") {
            return self.botResponseWaiting;
        }
        if (text === "iniciar_videollamada") {
            return self.botResponseWaiting;
        }
        if (text === "iniciar_audiollamada") {
            return self.botResponseWaiting;
        }
//        var rta = false;
        for (var i = 0; i < r.length; i++) {
            var ra = r[i];
            var response = ra.response;
            var keywords = ra.keywords;
            var options = ra.options;
            var in_response = ra.in_response;
            var kexpl = keywords.split(",");
            for (var x = 0; x < kexpl.length; x++) {
                var key = kexpl[x];
                if (text !== false && text.indexOf(key) !== -1 || index === i) {
                    rta = response;
                    self.keyw = keywords;
                    if (typeof in_response !== "undefined") {
                        self.botInResponse = in_response;
                    }
                    if (typeof options !== "undefined") {
                        for (var y = 0; y < options.length; y++) {
                            var yeah = options[y];
                            rta += "<button class='buttonBot' data-response='" + yeah.response + "' onclick='sendMsgBotButton(this)'>" + yeah.text + "</button>";
                        }
                    }
                    break;
                }
            }
        }
//        console.log(rta);
//        console.log(self.botLastMsg);
//        if (rta === self.getNameBotPredeterminate && self.isSetMyName === true) {
//            self.createWritten(self.heName, 2000);
//            setTimeout(function () {
//                self.addMessage(self.botResponseWaiting);
//            }, 2000);
//            self.bot = false;
//            return false;
//////            return self.botSearchResponse("iniciar_audiollamada");
//        }
        if (rta === self.botLastMsg) {
            return self.botSearchResponse("en_que_ayudo");
        }
        self.botLastMsg = rta;
        return rta;
    },
    botDataMsg: function () {
        var self = this;
        var r = [];
        if (r.length === 0) {
            r = self.botDataMsgDefault();
        }
        return r;
    },
    botDataMsgDefault: function () {
        var self = this;
        var option = 2;
        var option = 1;
        var r = [];
        if (option === 1) {
            r.push(
                    {
                        response: "¡Hola!",
                        keywords: "inicio",
                        in_response: "1"
                    },
                    {
                        response: self.getSaludoBotPredeterminate,
                        keywords: "en_que_ayudo",
                        in_response: "2"
                    },
                    {
                        response: self.getNameBotPredeterminate,
                        keywords: "nombre",
                        in_response: "3"
                    },
                    {
                        response: self.getEmailBotPredeterminate,
                        keywords: "correo",
                        in_response: "4"
                    },
                    {
                        response: self.getPhoneBotPredeterminate,
                        keywords: "correo",
                        in_response: "7"
                    },
                    {
                        response: "Si no tienes correo, ¿me puedes dar tu número de celular?",
                        keywords: "no tengo correo",
                        in_response: "7"
                    },
                    {
                        response: "No tienes celular, entiendo",
                        keywords: "no tengo celular",
                        in_response: "7"
                    },
                    {
                        response: "iniciar_chat",
                        keywords: "iniciar_chat"
                    }
            );
        } else
        if (option === 2) {
            r.push(
                    {
                        response: "¡Hola!, por favor selecciona la opción que requieras ayuda",
                        keywords: "hola,buenos dias,buenos días,inicio",
                        in_response: "1",
                        options: [
                            {
                                type: "button",
                                icon: "",
                                response: "iniciar_chat",
                                text: "Iniciar chat de ventas"
                            },
                            {
                                type: "button",
                                icon: "",
                                response: "iniciar_videollamada",
                                text: "Iniciar videollamada"
                            },
                            {
                                type: "button",
                                icon: "",
                                response: "iniciar_audiollamada",
                                text: "Iniciar llamada de voz"
                            },
                            {
                                type: "button",
                                icon: "",
                                response: "garantía",
                                text: "Solicito garantía de mis productos"
                            },
                            {
                                type: "button",
                                icon: "",
                                response: "bruto",
                                text: "Preguntar si el bot es bruto"
                            }
                        ]
                    },
                    {
                        response: self.getSaludoBotPredeterminate,
                        keywords: "en_que_ayudo",
                        in_response: "2"
                    },
                    {
                        response: self.getNameBotPredeterminate,
                        keywords: "nombre",
                        in_response: "3"
                    },
                    {
                        response: self.getEmailBotPredeterminate,
                        keywords: "correo",
                        in_response: "4"
                    },
                    {
                        response: self.getPhoneBotPredeterminate,
                        keywords: "correo",
                        in_response: "7"
                    },
                    {
                        response: "Si no tienes correo, ¿me puedes dar tu número de celular?",
                        keywords: "no tengo correo",
                        in_response: "7"
                    },
                    {
                        response: "No tienes celular, entiendo",
                        keywords: "no tengo celular",
                        in_response: "7"
                    },
                    {
                        response: self.botResponseWaiting,
                        keywords: "iniciar_audiollamada"
                    },
                    {
                        response: "La garantía es esta y aquella",
                        keywords: "garantia,garantía",
                        options: [
                            {
                                type: "button",
                                icon: "",
                                response: "inicio",
                                text: "Volver al inicio"
                            }
                        ]
                    },
                    {
                        response: "Bruto su culo",
                        keywords: "bruto,estupido",
                        options: [
                            {
                                type: "button",
                                icon: "",
                                response: "inicio",
                                text: "Volver al inicio"
                            }
                        ]
                    }
            );
        }
        return r;
    },
    setTerminalKey: function () {
        var self = this;
        var rau = self.nameConference.split("ringow_");
        if (rau.length > 1) {
            var ra = rau[1].split("_");
            self.id_call = ra[0];
            self.terminal = ra[1];
            self.apikey = ra[2];
        }
        var rau = self.nameConference.split("userchat_");
        if (rau.length > 1) {
            var ra = rau[1].split("_");
            self.terminal = ra[1];
            self.tipoChat = "CHAT_INTERNO";
        }
    },
    validateIfUseServer: function () {
        var self = this;
        if (!self.useServer) {
            return false;
        }
        return true;
    },
    sendEmailCallEnded: function () {
        var self = this;
        if (!self.validateIfUseServer()) {
            return false;
        }
        var data = "id_enc=" + self.id_call;
        data += "&terminal=" + self.terminal;
        data += "&href=" + self.domainVisitor;
        data += "&domain=" + self.domainVisitor;
        function reqListener() {
            var data = JSON.parse(this.responseText);
            if (self.debug)
                console.log("sendEmailCallEnded", data);
            self.bot = false;
            clearInterval(self.IntervalisCallingRingow);
            self.createWritten(self.heName, 3000);
            setTimeout(function () {
                var msg = "Gracias por escribirnos. Hemos recibido su mensaje y en breve será contactado.";
                self.addMessage(msg);
                self.othersButtons.style.display = "flex";
                self.btnCallAgain.style.display = "none";
                self.form.style.visibility = "hidden";
            }, 3000);
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v2/rpc/sendEmailCallEnded.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    searchCallEnded: function () {
        var self = this;
        if (!self.validateIfUseServer()) {
            return false;
        }
        var data = "id=" + self.id_call;
        function reqListener() {
            var data = JSON.parse(this.responseText);
            if (self.debug)
                console.log("searchCallEnded", data);
            if (data === "LLAMADA_PERDIDA") {
                self.bot = false;
                clearInterval(self.IntervalisCallingRingow);
                self.createWritten(self.heName, 3000);
                setTimeout(function () {
                    var msg = "La llamada no pudo ser atendida. ¿Qué deseas hacer? ";
                    self.addMessage(msg);
                    self.othersButtons.style.display = "flex";
                    self.form.style.visibility = "hidden";
                }, 3000);
            } else {
                self.createWritten(self.heName, 3000);
                setTimeout(function () {
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
                    self.addMessage(msg);
                    self.numberCallingRingow++;
                }, 3000);
            }
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v2/rpc/searchCallEnded.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    artiveSearchCallEnded: function () {
        var self = this;
        if (!self.validateIfUseServer()) {
            return false;
        }
        self.isCallingRingow = true;
        self.numberCallingRingow = 0;
        self.IntervalisCallingRingow = setInterval(function () {
            self.searchCallEnded();
        }, 10000);
    },
    readMsgCall: function (user, type) {
        var self = this;
        if (!self.validateIfUseServer()) {
            return false;
        }
        var data = "room=" + self.nameConference;
        data += "&myUser=" + self.myUser;
        data += "&usuario=" + user;
        data += "&type=" + type;
        data += "&isOperatorRingow=" + self.isOperatorRingow;
        function reqListener() {
            var data = JSON.parse(this.responseText);
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v2/rpc/readMsgCall.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    getTokensNotifyPush: function (usuario) {
        var self = this;
        if (!self.validateIfUseServer()) {
            return false;
        }
        if (self.isOperatorRingow !== "false") {
            return false;
        }
        if (self.tokens.length > 0) {
            return false;
        }
        var data = "";
//        data += "&room=" + self.nameConference;
        data += "usuario=" + usuario;
//        data += "&isOperatorRingow=" + self.isOperatorRingow;
//        data += "&terminal=" + self.terminal;
        function reqListener() {
            var r = this.responseText;
            if (self.debug)
                console.log(r);
            var data = JSON.parse(r);
            if (data === "NO_FOUND") {
                return false;
            }
            self.tokens = data;
            if (self.debug)
                console.log(self.tokens);
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v2/rpc/getTokensNotifyPush.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    changeStatusCall: function (status, type) {
        var self = this;
        if (!self.validateIfUseServer()) {
            return false;
        }
        var data = "room=" + self.nameConference;
        data += "&nombre=" + self.myName;
        data += "&correo=" + self.myUser;
        data += "&celular=" + self.myCelular;
        data += "&estado=" + status;
        data += "&tipo=" + type;
        data += "&isOperatorRingow=" + self.isOperatorRingow;
        if (self.terminal !== null) {
            data += "&terminal=" + self.terminal;
        }
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
            if (self.debug)
                console.log("changeStatusCall", data);
            if (data !== "OK") {
                self.createWritten(self.heName, 6000);
//                setTimeout(function () {
//                    self.addMessage(data.message);
//                }, 2000);
                if (data.type === "ASESORES_NO_DISPONIBLES") {
                    self.sendEmailCallEnded();
                    self.bot = false;
                }
            } else {
                if (status === "LLAMANDO" && self.isCallingRingow === false) {
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
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v2/rpc/changeStatusCall.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    saveOrUpdate: function (callback) {
        var self = this;
        if (!self.validateIfUseServer()) {
            return false;
        }
        var data = "room=" + self.nameConference;
        if (self.id_call !== null) {
            data += "&id=" + self.id_call;
        }
        if (self.terminal !== null) {
            data += "&terminal=" + self.terminal;
        }
        data += "&limit=" + self.limitLoadMessages;
        data += "&myUser=" + self.myUser;
        data += "&myName=" + self.myName;
        data += "&heUser=" + self.heUser;
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
            return callback(msg);
        }
        function reqError(err) {
            console.log('Fetch Error :-S', err);
            return callback(false);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v2/rpc/saveOrUpdate.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
    },
    saveMsgSrv: function (texto, myname) {
        var self = this;
        if (!self.validateIfUseServer()) {
            return false;
        }
        var me = self.myName;
        if (self.myUser !== false) {
            me = self.myUser;
        }
        if (typeof myname !== "undefined") {
            me = myname;
        }
        var visto = "NO";
        if (self.bot) {
            visto = "SI";
        }
        var data = "room=" + self.nameConference;
        data += "&texto=" + texto;
        data += "&isOperatorRingow=" + self.isOperatorRingow;
        data += "&useForRingow=" + self.useForRingow;
        data += "&myUser=" + me;
        data += "&myName=" + self.myName;
        data += "&myPhoto=" + self.myPhoto;
        if (self.heUser !== false) {
            data += "&heUser=" + self.heUser;
        } else
        if (self.heName !== false && self.heName !== "") {
            data += "&heUser=" + self.heName;
        }
        data += "&visto=" + visto;
        if (self.terminal !== null) {
            data += "&terminal=" + self.terminal;
        }
        if (self.id_call !== null) {
            data += "&visitante=" + self.id_call;
        }
        function reqListener() {
            if (typeof self.tokens !== "undefined") {
                if (self.tokens.length > 0) {
                    for (var i = 0; i < self.tokens.length; i++) {
                        var ra = self.tokens[i];
                        self.sendNotificacion({
                            title: self.myName,
                            body: texto,
                            icon: "fcm_push_icon",
                            sound: "default",
                            data: "main.openChatPush('" + me + "', '" + self.myName + "', '" + texto + "', '" + self.myPhoto + "', '" + self.id_call + "')",
                            callback: "FCM_PLUGIN_ACTIVITY",
//                to: "dztBg5jSLZA:APA91bHVXnYzv2T9x_07j8NWm0YviHYUxh6DptrPKSdiv7Iw23ovK_-_3AFBSSSgFPSnOvXZOM9rdSQNjcc3IdmqRJElbErG3kfHMf_USwbCDnA9qiL2ByFKcalYXiHeTAKDTHF7hdUN"
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
//            return callback('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/nwlib6/nwproject/modules/webrtc/v2/rpc/saveMsgSrv.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
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
    getconfig: function (callback) {
        var self = this;
        if (!self.validateIfUseServer()) {
            return false;
        }
        var data = "";
        data += "terminal=" + self.terminal;
        data += "&apikey=" + self.apikey;
        data += "&domain=" + self.domainVisitor;
        data += "&origin=" + self.urlVisitor;
        data += "&country=" + self.dataIP.country_name;
        data += "&city=" + self.dataIP.city;
        data += "&lang=" + self.dataIP.languages;
        function reqListener() {
            var data = JSON.parse(this.responseText);
            return callback(data);
        }
        function reqError(err) {
            return callback('Fetch Error :-S', err);
        }
        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.onerror = reqError;
        oReq.open('POST', self.domain + '/app/nwchat/js/config.php', true);
        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        oReq.send(data);
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
    },
    addCssRingow: function () {
        var self = this;
        var cssChat = "";
        var cssMain = "";
        if (self.haveOptions) {
//            cssChat += "";
//            cssMain += "";
            cssChat += ".contentChat ::-webkit-scrollbar-thumb{-webkit-border-radius:10px;-moz-border-radius:10px;-o-border-radius:10px;-moz-osx-border-radius:10px;-ms-border-radius:10px;border-radius:10px;-webkit-box-shadow:inset 0 -6px 0 0 #fff,inset 0 6px 0 0 #fff;-moz-box-shadow:inset 0 -6px 0 0 #fff,inset 0 6px 0 0 #fff;-o-box-shadow:inset 0 -6px 0 0 #fff,inset 0 6px 0 0 #fff;-moz-osx-box-shadow:inset 0 -6px 0 0 #fff,inset 0 6px 0 0 #fff;-ms-box-shadow:inset 0 -6px 0 0 #fff,inset 0 6px 0 0 #fff;box-shadow:inset 0 -6px 0 0 #fff,inset 0 6px 0 0 #fff;background-color:rgba(209,209,209,.97)}.contentChat ::-webkit-scrollbar{width:8px;background-color:#fff}.contentChat{box-shadow:0 0 10px 2px rgba(0,0,0,.16);border-radius:10px;height:100vh;max-height:100%;width:100vw;max-width:100%;display:flex;flex-direction:column;background-color:#fff;background-color:#f9f9f9;overflow:hidden;margin:auto}.contentChat .messages{flex-grow:1;padding:20px 30px;overflow:auto;position:relative}.contentChat .message{display:flex;flex-direction:column;margin:10px 0 5px 0}.contentChat .message--mine{align-items:flex-end}.contentChat .message--theirs{align-items:flex-start}.contentChat .message__name{padding:10px 0;padding:10px 0 0 0;color:#919090;font-size:12px;word-break:break-word;font-weight:700}.message__see{position:relative;color:#929292;font-size:11px;font-size:9px}.contentChat .message__fecha{font-size:10px;padding:0 0 5px 0;color:#919090;word-break:break-word}.message--mine .message__name{text-align:right}.contentChat .message__bubble{padding:10px;border-radius:3px;word-break:break-word}.contentChat .message--theirs .message__bubble{background:#6363bf;color:#fff;background-color:#e6ecf0;color:#50565d;-webkit-border-radius:5px 5px 5px 0;-moz-border-radius:5px 5px 5px 0;-o-border-radius:5px 5px 5px 0;-moz-osx-border-radius:5px 5px 5px 0;-ms-border-radius:5px 5px 5px 0;border-radius:5px 5px 5px 0}.contentChat .message--mine .message__bubble{background-color:#1f8ceb;color:#fff;-webkit-border-radius:5px 5px 0 5px;-moz-border-radius:5px 5px 0 5px;-o-border-radius:5px 5px 0 5px;-moz-osx-border-radius:5px 5px 0 5px;-ms-border-radius:5px 5px 0 5px;border-radius:5px 5px 0 5px}.contentChat .footerChat{position:relative;line-height:76px;border-top:1px solid rgba(156,172,172,.2);border-bottom:1px solid rgba(156,172,172,.2);display:flex;flex-shrink:0;-webkit-box-shadow:0 0 18px rgba(0,0,0,.1);-moz-box-shadow:0 0 18px rgba(0,0,0,.1);-o-box-shadow:0 0 18px rgba(0,0,0,.1);-moz-osx-box-shadow:0 0 18px rgba(0,0,0,.1);-ms-box-shadow:0 0 18px rgba(0,0,0,.1);box-shadow:0 0 18px rgba(0,0,0,.1);background-color:#fff}.contentChat input{height:76px;border:none;flex-grow:1;padding:0 30px;font-size:16px;background:0 0}.contentChat button{border:none;background:0 0;padding:0 30px;font-size:16px;cursor:pointer}.containerChat_maximice{max-width:100%;height:100%;-webkit-transition:none;-moz-transition:none;-o-transition:none;transition:none}.isWritten{position:relative;color:#878686;margin:0;padding:0;display:block;bottom:0;height:0;top:-40px;pointer-events:none}.isWritten img{height:56px;position:relative}.isWritten span{display:inline-block;top:-5px;position:relative;margin:0 3px}body .loadMoreMessages{margin:auto}body .NoMoreMessages{margin:auto;text-align:center}@media screen and (max-width:900px){.contentChat input{padding:0 30px;height:45px;font-size:14px}.footerChat button{padding:0 3px;font-size:10px}.footerChat .material-icons{font-size:21px;color:#919090}.contentChat{margin:0;max-width:100%;max-height:100%;border-radius:0}}";
            cssMain += ".containWebRtcNw .clear{clear:both}.containWebRtcNw{margin:0;padding:0;font-family:arial;vertical-align:baseline;font-size:13px;position:fixed;overflow:hidden;top:0;left:0;width:100%;height:100%}.contain_me,.containerChat,.contenedor{-webkit-transition:all .5s ease;-moz-transition:all .5s ease;-o-transition:all .5s ease;transition:all .5s ease}.containWebRtcNw button{padding:9px 13px;margin:2px 2px;border-radius:2px;background-color:#fff;border:0;font-size:1.3em}.containerButtonJoin{position:absolute;z-index:3;text-align:center;width:100%;padding:10px;box-sizing:border-box;color:#fff;text-shadow:0 0 5px #000}.containerButtonJoin p{font-size:2em}.contenedorMain{width:100%;height:100%;position:absolute;background-color:#1e1e1e}.contain_me{position:absolute;top:0;left:0;max-height:250px;max-width:250px;z-index:1}.contain_me_alone{width:100%;height:100%;max-width:100%;max-height:100%}#localVideo{position:relative;height:100%;width:100%;object-fit:contain;object-position:center}.contenedor{position:relative;width:100%;height:100%;display:inline-block}.contenedor video{position:relative;min-width:100%;min-height:100%;max-width:100%;max-height:100%;width:auto;height:max-content;object-fit:contain;object-position:center}#remotes{position:fixed;width:100%;height:100%;top:0;left:0;text-align:center;display:none}.containerButtons{position:absolute;position:relative;bottom:0;left:0;width:100%;text-align:center;z-index:2;display:none}.containerButtonVolver{position:relative;text-align:center;color:#fff;background-color:#2d2c2c;height:100%;padding:0;margin:0;position:fixed;top:0;left:0;width:100%}.volver_a_llamar{font-size:1.5em}.containerChat{position:absolute;z-index:3;bottom:0;right:0;height:100%;bottom:-100%;max-width:400px}.containerChatVisible{bottom:0}.containerChat iframe{position:relative;width:100%;height:100%;border:0}.encChat{position:relative;top:0;z-index:1;background-color:#1f8ceb;box-sizing:border-box;width:100%;min-height:55px;height:auto;color:#fff;border-top-left-radius:10px;border-top-right-radius:10px;-webkit-box-shadow:0 0 18px rgba(0,0,0,.5);-moz-box-shadow:0 0 18px rgba(0,0,0,.5);-o-box-shadow:0 0 18px rgba(0,0,0,.5);-moz-osx-box-shadow:0 0 18px rgba(0,0,0,.5);-ms-box-shadow:0 0 18px rgba(0,0,0,.5);box-shadow:0 0 18px rgba(0,0,0,.5);display:flex;flex-wrap:wrap}.iconsEnc{cursor:pointer;float:right;position:relative;margin:5px 4px;font-size:28px;height:26px}.closeChat{position:absolute;top:0;right:0}.callEnc,.openChat,.videocallEnc{display:none}body .openChat{left:0;display:block;width:100%;height:100%;top:0;position:absolute;margin:0}.encPhoto{position:relative;width:50px;height:50px;float:left;border-radius:50%;margin:3px 4px;background-image:url(/nwlib6/nwproject/modules/nw_user_session/img/icon_user.png);background-size:cover;background-position:center;background-color:#fff}.encName,.myName{position:relative;margin:11px 0 0 3px;max-width:50%;overflow:hidden;font-size:10px;font-weight:lighter;line-height:11px;white-space:pre-wrap;max-height:22px}.encName{display:block;font-size:13px;font-weight:700}.myName{min-width:100%}.terminar_before_container{position:fixed;top:0;left:0;width:100%;height:100%;max-height:calc(100% - 55px)}body .terminar_before{color:#fff;background-color:red;position:relative;margin:auto;top:40%;border-radius:50%;width:70px;height:70px;padding:0;cursor:pointer}body .terminar{color:#fff;background-color:red}.btn_conts{text-decoration:none;color:#fff;padding:5px 6px;display:block;border-radius:5px;margin:10px 0 0 0;cursor:pointer}.contestar_a{background-color:green}.rechazar_a{background-color:red}.btn_conts .material-icons{border-right:1px solid rgba(255,255,255,.42);padding-right:3px;margin-right:3px}.btn_conts span{display:inline-block;top:-6px;position:relative;left:0;font-weight:700}.callvioce_container{position:absolute;width:100%;text-align:center;background-color:#00cd30;margin:auto;left:0;top:25%}.btnvoice_active{position:relative;color:#fff;padding:5px}.contentChat .buttonBot{background-color:#2767c3;color:#fff;border:1px solid #3156c2;padding:6px 10px;display:block;margin:5px 0;border-radius:5px;cursor:pointer;position:relative}.callendedfoot{position:relative;text-align:center;width:100%;font-weight:700;font-size:16px;cursor:pointer}.hiddenButton{display:none!important}.encChatMinimiced{height:80px}.encChatMinimiced .encPhoto{height:50px;width:50px}.encStatus{position:absolute;top:0;left:0;width:20px;height:20px;background-color:#c3c3c3;z-index:1;border-radius:50%}.changeStatusActive{background-color:#00ff37}@media screen and (max-width:900px){.terminar_before_container{max-height:40%}.contenedorMain{max-height:calc(100% - 15px);max-width:calc(100% - 15px);background-color:#1e1e1e;margin:auto}.encChat_fix{position:fixed;height:32px;font-size:14px;max-width:calc(100% - 15px)}.encChat_fix .material-icons{font-size:20px}.contain_me{left:auto;right:0;max-height:120px;max-width:120px;top:31px}#remotes{max-height:calc(100% - 35px);top:33px}.contain_me_alone{max-width:100%;max-height:100%}.contenedorMainMiddle{height:50%!important}.containerChatMiddle{height:50%}.containerChat{max-width:100%}.containerButtons .button{font-size:11px;padding:5px 8px}.containerButtons .material-icons{font-size:20px}}.terminar_before .material-icons{font-size:32px}";
        }
        if (self.video) {
            cssMain += "#remotes, .containerButtons{display:block;}";
        }
        var cssAll = "<style>";
        cssAll += cssMain;
        cssAll += cssChat;
        cssAll += "</style>";
        var d = document.querySelector("ringow_contain_css_chat");
        if (!d) {
            var d = document.createElement("div");
            d.className = "ringow_contain_css_chat";
            d.innerHTML = cssAll;
            document.body.appendChild(d);
        }
    },
    createCanvasChat: function () {
        var d = document.createElement("div");
        d.className = "containerChat";
        return d;
    }
};
function sendMsgBotButton(w) {
    var text = w.getAttribute("data-response");
    sendMsgAuto(text);
}
function sendMsgAuto(text, onlyInput) {
    document.querySelector(".messageBox").value = text;
    document.querySelector(".messageBox").focus();
    if (onlyInput !== true) {
        document.querySelector(".btnsubmit").click();
    }
}
function sendMsgInterval(text, onlyInput) {
    var d = document.querySelector(".messageBox");
    if (d) {
        sendMsgAuto(text, onlyInput);
    } else {
        setTimeout(function () {
            sendMsgInterval(text, onlyInput);
        }, 1000);
    }
}
//            var button = $('#screenShareButton'), setButton = function (bool) {button.text(bool ? 'share screen' : 'stop sharing');};
//            webrtc.on('localScreenStopped', function () {
//                setButton(true);
//            });
//            setButton(true);
//            button.click(function () {
//                if (webrtc.getLocalScreen()) {
//                    webrtc.stopScreenShare();
//                    setButton(true);
//                } else {
//                    webrtc.shareScreen(function (err) {
//                        if (err) {
//                            setButton(true);
//                        } else {
//                            setButton(false);
//                        }
//                    });
//
//                }
//            });


window.addEventListener('message', function (e) {
    if (typeof e.data !== "undefined") {
        var r = e.data;
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
        } else
        if (r.tipo === "input_message_ringow") {
            sendMsgInterval(r.message, true);
        } else
        if (r.tipo === "send_message_ringow") {
            sendMsgInterval(r.message);
        } else
        if (r.tipo === "openRingow") {
            webrtcNw.showChat();
        }
    }
});