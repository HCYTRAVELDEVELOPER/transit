var db = null;
var roomsArray = [];
var queryRoom = null;
var __createActionsBtnsWnw = false;
var tokensAllGroup = null;
var wnw = {
    debug: false,
    versionInput: 2,
    room: null,
    nameData: null,
    nameTableTokens: null,
    sendFirstMessage: false,
    token: null,
    saveToken: true,
    tokenUserSet: null,
    keyGoogleNotificacionPush: false,
    limitMessages: 12,
    photoGenericProfile: '/nwlib6/nwproject/modules/webrtc/v6/chat/images/profile_placeholder.png',
    setUserID: null,
    setUserEmail: null,
    setUserName: null,
    setUserPhoto: null,
    loadMessagesOnLoad: true,
    loadedMessages: false,
    useLocation: false,
    loadMessagesFirst: false,
    arrayMessagesOnDisplay: [],
    containerClassName: null,
    callbackToSendMsg: null,
    callbackToSendMsgAfter: null,
    callbackToReceiveMessage: null,
    callBackOnAppear: null,
    msgResponse: "",
    domainSrv: window.location.protocol + "//" + window.location.host,
    is_app: false,
    getMessagesLocal: false,
    useMicroMsg: true,
    messagesLocal: Array(),
    container: null,
    initialize: function (options) {
        var self = this;
        if (typeof options.domainSrv !== "undefined") {
            self.domainSrv = options.domainSrv;
        }
        if (typeof options.is_app !== "undefined") {
            self.is_app = options.is_app;
        }
        if (typeof options.getMessagesLocal !== "undefined") {
            self.getMessagesLocal = options.getMessagesLocal;
        }
        var version = "10";
        if (typeof config !== "undefined") {
            if (typeof config.version !== "undefined") {
                version = config.version;
            }
        }
        if (self.is_app) {
            wnwUtils.loadCss("nwlib6/nwproject/modules/webrtc/v6/chat/styles/emoji.css?v=" + version);
            wnwUtils.cargaJs("nwlib6/nwproject/modules/webrtc/v6/chat/scripts/frb-nw-emoji.js?v=" + version, function () {
                return self.initializeExec(options);
            }, false, true);

        } else {
            wnwUtils.loadCss(self.domainSrv + "/nwlib6/nwproject/modules/webrtc/v6/chat/styles/emoji.css?v=" + version);
            wnwUtils.cargaJs(self.domainSrv + "/nwlib6/nwproject/modules/webrtc/v6/chat/scripts/frb-nw-emoji.js?v=" + version, function () {
                return self.initializeExec(options);
            }, false, true);

        }
    },
    initializeExec: function (options) {
        var self = this;

        if (typeof options === "undefined") {
            options = {};
        }
        if (typeof options.container !== "undefined") {
            self.containerClassName = options.container;
            self.container = document.querySelector(options.container);
            if (!self.container) {
                self.alert("Contenedor no existe");
                return false;
            }
        }
        var get = wnwUtils.getGET();
        if (get) {
            self.room = get.room;
            if (get.saveToken === "false") {
                self.saveToken = false;
            }
            if (typeof get.limitMessages !== "undefined") {
                self.limitMessages = parseInt(get.limitMessages);
            }
            if (typeof get.useMicroMsg !== "undefined") {
                self.useMicroMsg = parseInt(get.useMicroMsg);
            }
            if (typeof get.useLocation !== "undefined") {
                if (get.useLocation === "true") {
                    self.useLocation = true;
                }
            }
            if (typeof get.setUserName !== "undefined") {
                self.setUserName = get.setUserName;
            }
            if (typeof get.setUserEmail !== "undefined") {
                self.setUserEmail = get.setUserEmail;
            }
            if (typeof get.setUserPhoto !== "undefined") {
                self.setUserPhoto = get.setUserPhoto;
            }
            if (typeof get.tokenUserSet !== "undefined") {
                self.tokenUserSet = get.tokenUserSet;
            }
            if (typeof get.keyGoogleNotificacionPush !== "undefined") {
                self.keyGoogleNotificacionPush = get.keyGoogleNotificacionPush;
            }
            if (typeof get.tokensAllGroup !== "undefined") {

                var decodedString = atob(get.tokensAllGroup);
                var data = JSON.parse(decodedString);
                console.log("variables", data);

                tokensAllGroup = data;
            }
        }

        if (typeof options.room !== "undefined") {
            self.room = options.room;
        }
        if (typeof options.useMicroMsg !== "undefined") {
            self.useMicroMsg = options.useMicroMsg;
        }
        if (typeof options.setUserName !== "undefined") {
            self.setUserName = options.setUserName;
        }
        if (typeof options.setUserID !== "undefined") {
            self.setUserID = options.setUserID;
        }
        if (typeof options.setUserEmail !== "undefined") {
            self.setUserEmail = options.setUserEmail;
        }
        if (typeof options.setUserPhoto !== "undefined") {
            self.setUserPhoto = options.setUserPhoto;
        }
        if (typeof options.saveToken !== "undefined") {
            self.saveToken = options.saveToken;
        }
        if (typeof options.tokenUserSet !== "undefined") {
            self.tokenUserSet = options.tokenUserSet;
        }
        if (typeof options.limitMessages !== "undefined") {
            self.limitMessages = options.limitMessages;
        }
        if (typeof options.callbackToSendMsg !== "undefined") {
            self.callbackToSendMsg = options.callbackToSendMsg;
        }
        if (typeof options.callbackToReceiveMessage !== "undefined") {
            self.callbackToReceiveMessage = options.callbackToReceiveMessage;
        }
        if (typeof options.callBackOnAppear !== "undefined") {
            self.callBackOnAppear = options.callBackOnAppear;
        }
        if (typeof options.loadMessagesOnLoad !== "undefined") {
            self.loadMessagesOnLoad = options.loadMessagesOnLoad;
        }
        if (typeof options.domainSrv !== "undefined") {
            self.domainSrv = options.domainSrv;
        }
        if (typeof options.useLocation !== "undefined") {
            self.useLocation = options.useLocation;
        }

        if (!wnwUtils.evalueData(self.setUserEmail)) {
            self.setUserEmail = self.setUserName;
        }

        if (self.useLocation === true) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(onMapSuccess, errorFunc, {enableHighAccuracy: true});
                function  onMapSuccess(position) {
                    self.latitude = position.coords.latitude;
                    self.longitude = position.coords.longitude;
                }
                function errorFunc(error) {
                    console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n', error);
                }
            }
        }

        if (self.room === null) {
            self.alert("Error, falta room");
            return false;
        }

        var ind = roomsArray.indexOf(self.room);
        if (self.debug)
            console.log("ind", ind);

        self.nameData = "messages_" + self.room;
        self.nameTableTokens = "fcmTokens_" + self.room;

        self.contruyeHtml();

        self.actionsInButtons();

        self.execFirebase(function () {
            if (db === null) {
                db = firebase.firestore();
            }

            if (self.tokenUserSet != null) {
                self.saveTokenInFirebase(self.tokenUserSet);
            }

            console.log("tokensAllGroup", tokensAllGroup);
            if (tokensAllGroup != null) {
                for (var i = 0; i < tokensAllGroup.length; i++) {
//                    self.saveTokenInFirebase(tokensAllGroup[i].token);
                }
            }

//            var messaging = firebase.messaging();
//            console.log("messaging", messaging);
//            messaging.onMessage(function (payload) {
//                console.log('Message received. ', payload);
//                var theBody = payload.notification.body;
//                var theIcon = payload.notification.icon;
//                var theTitle = payload.notification.title;
//                var callback = payload.notification.click_action;
//                notificationPushNwrtc(theBody, theIcon, theTitle, callback);
//            });

        });

//        self.checkSetup();

        if (self.debug)
            console.log("queryRoom", queryRoom);
        if (queryRoom !== null) {
            queryRoom();
        }


        roomsArray.push(self.room);

        var fecha = wnwUtils.getActualFullDate();
        var p = {
            collection: "usuarios",
            document: self.getUserMail(),
            usuario: self.getUserMail(),
            nombre: self.getUserName(),
            foto_perfil: self.getProfilePicUrl(),
            fecha: fecha,
            fecha_ultima_conexion: fecha
        };
        firebase.firestore().collection(p.collection).doc(p.document).set(p);

        self.loadMessagesFirst = false;

//        self.reactionMessageAnimation(-1, self.getProfilePicUrl());

        if (self.debug) {
            console.log("self.getMessagesLocal", self.getMessagesLocal);
            console.log("self.loadMessagesFirst", self.loadMessagesFirst);
        }
        var online = wnwUtils.isOnline();
        if (self.getMessagesLocal) {
//            self.loadMessages();
            self.loadMessagesLocal(function () {
                if (self.debug) {
                    console.log("ok1");
                }
                if (online) {
                    var all = document.querySelectorAll(".message-container");
                    for (var i = 0; i < all.length; i++) {
                        wnwUtils.addClass(all[i], "message-container-temporal");
                    }
                    setTimeout(function () {
                        self.loadMessages();
                        if (self.debug) {
                            console.log("ok2");
                        }
                    }, 200);
                }
            });
        } else {
            if (online) {
                self.loadMessages();
            }
        }

        if (self.saveToken) {
            self.saveMessagingDeviceToken();
        }
        wnwUtils.setHoursMsg(".fecha", false);
        setInterval(function () {
            wnwUtils.setHoursMsg(".fecha", false);
        }, 10000);

        window.addEventListener('message', function (e) {
            if (typeof e.data !== "undefined") {
                var r = e.data;
                if (self.debug)
                    console.log(" addEventListener", r);
                if (r.tipo === "addMessage") {
                    if (self.versionInput === 2) {
                        self.messageInputElement.innerHTML = r.text;
                    } else {
                        self.messageInputElement.value = r.text;
                    }
                    self.execFirebase(function () {
                        self.onMessageFormSubmit();
                    });
                } else
                if (r.tipo === "loadMessages") {
                    for (var i = 0; i < r.data.length; i++) {
                        var message = r.data[i];
                        self.displayMessage(message.id, wnwUtils.toTimestamp(message.timestamp), message.name, message.text, message.profilePicUrl, message.imageUrl, message.fecha);
                        wnwUtils.setHoursMsg(".fecha", false);
                    }
                }
            }
        });
        if (self.callBackOnAppear !== null) {
            self.callBackOnAppear();
        }

        self.execFirebase(function () {
            wnwUtils.removeClass(".message-form-disabled", "message-form-disabled");
        });
    },
    loadMessagesLocal: function (callback) {
        var self = this;
        self.messagesLocal = Array();
        if (wnwUtils.evalueData(window.localStorage.getItem("messagesLocal_" + self.room))) {
            var msgall = window.localStorage.getItem("messagesLocal_" + self.room);
            msgall = JSON.parse(msgall);
            if (self.debug)
                console.log("msgall", msgall);
            self.messagesLocal = msgall;
        }
        if (self.debug) {
            console.log("self.messagesLocal", self.messagesLocal);
        }
        var arr = self.messagesLocal;
        arr.sort(function (a, b) {
            return b.timestamp - a.timestamp;
        });
        arr.sort(function (a, b) {
            return +(a.fecha > b.fecha) || +(a.fecha === b.fecha) - 1;
        });
        for (var i = 0; i < arr.length; i++) {
            var message = arr[i];
            if (typeof message == "object") {
                if (self.debug) {
                    console.log("message", message)
                }
//                console.log("message.room", message.room)
//                console.log("self.room", self.room)
                if (message.room !== self.room) {
                    continue;
                }
                message.timestamp = wnwUtils.toTimestamp(message.timestamp);
                self.displayMessage(message);
                wnwUtils.setHoursMsg(".fecha", false);
            }
        }
        if (self.debug)
            console.log("Load messages in local");
        if (typeof callback !== "undefined") {
            callback();
        }
    },
    getUserName: function () {
        var self = this;
        var name = "Invitado";
        var get = wnwUtils.getGET();
        if (get !== false) {
            if (typeof get.name !== "undefined") {
                name = get.name;
            }
        }
        if (self.setUserName !== null) {
            name = self.setUserName;
        }
        return name;
    },
    getUserID: function () {
        var self = this;
        var id_user = "12345";
        var get = wnwUtils.getGET();
        if (get !== false) {
            if (typeof get.id_user !== "undefined") {
                id_user = get.id_user;
            }
        }
        if (self.setUserID !== null) {
            id_user = self.setUserID;
        }
        return id_user;
    },
    getUserMail: function () {
        var self = this;
        var email = "Invitado";
        var get = wnwUtils.getGET();
        if (get !== false) {
            if (typeof get.email !== "undefined") {
                email = get.email;
            }
        }
        if (self.setUserEmail !== null) {
            email = self.setUserEmail;
        }
        return email;
    },
    getProfilePicUrl: function () {
        var self = this;
        var photo = self.photoGenericProfile;
        var get = wnwUtils.getGET();
        if (get !== false) {
            if (typeof get.photo !== "undefined") {
                photo = get.photo;
            }
        }
        if (self.setUserPhoto !== null) {
            photo = self.setUserPhoto;
        }
        return photo;
    },
    addSizeToGoogleProfilePic: function (url, fotoperfil) {
        var self = this;
        if (url === self.photoGenericProfile) {
            return self.photoGenericProfile;
        }
        if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
            return url + '?sz=150';
        }
        var foto = url;
        if (fotoperfil) {
            if (wnwUtils.evalueData(url)) {
                var spli = foto.split("://");
//                console.log("spli", spli);
                if (typeof spli[1] !== "undefined") {
                    var pr1 = spli[1];
//                    console.log("pr1", pr1);
                    var st = pr1.split("/imagenes/");
                    var st1 = pr1.split("/chat/img/");
//                    console.log("st", st)
//                    console.log("st1", st1)
                    if (typeof st[1] !== "undefined") {
                        foto = "/imagenes/" + st[1];
                    }
                    if (typeof st1[1] !== "undefined") {
                        foto = "/chat/img/" + st1[1];
                    }
                }
            }
        } else {
            foto = url.replace(self.domainSrv, "");
        }
//        console.log("wnwUtils.getExtensionFile(foto)", wnwUtils.getExtensionFile(foto))
        if (wnwUtils.getExtensionFile(foto) == ".gif") {
            if (foto.indexOf(self.domainSrv) != -1) {
                return foto;
            }
            return self.domainSrv + foto;
        }
        return self.domainSrv + "/nwlib6/includes/phpthumb/phpThumb.php?src=/" + foto + "&w=50";
    },
    LOADING_IMAGE_URL: 'https://www.google.com/images/spin-32.gif?a',
    MESSAGE_TEMPLATE:
            '<div class="message-container">' +
            '<div class="message-into">' +
//            '<div class="containResponseChatContain"></div>' +
            '<div class="messageAndDate">' +
            '<div class="spacing"><div class="pic"></div></div>' +
            '<div class="message"></div>' +
            '<div class="fecha"></div>' +
            '</div>' +
            '<div class="name"></div>' +
            '</div>' +
            '</div>',
    contruyeHtml: function () {
        var self = this;
        var html = "<div id='messages-card-container' class='mdl-cell mdl-cell--12-col mdl-grid'>\n\
                    <div id='messages-card' class='mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--6-col-desktop'>\n\
                        <div class='containerChatFormsAll mdl-card__supporting-text mdl-color-text--grey-600'>\n\
                            <div id='messages'>\n\
                                <button type='button' class='cargarmas' id='cargarmas' >Cargar más</button>\n\
                            </div>\n\
                            <form id='message-form' class='message-form-disabled' onsubmit='false'>\n\
                                <button type='button' class='nuevomensaje' id='nuevomensaje' >Nuevo mensaje</button>\n\
                                <div class='mdl-textfield mdl-js-textfield mdl-textfield--floating-label boxUniqueInChatMsgFull'>\n\
                                    <div spellcheck='true' dir='ltr' contenteditable='true' class='message mdl-textfield__input' type='text' id='message'  autocomplete='off'></div>\n\
                                    <label class='mdl-textfield__label' for='message'>Mensaje...</label>\n\
                                </div>\n\
                                <button id='submit' disabled type='submit' class='buttonSend mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'>\n\
                                    <i class='material-icons'>send</i>\n\
                                </button>\n\
                                <button id='dictation' class='buttonSend mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'>\n\
                                    <i class='material-icons'>mic</i>\n\
                                </button>\n\
                                <button id='emojis' type='button' class='buttonEmojis mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect'>\n\
                                    <i class='material-icons'>insert_emoticon</i>\n\
                                </button>\n\
                            </form>\n\
                            <form id='image-form' class='image-form' action='#'>\n\
                                <input id='mediaCapture' type='file'>\n\
                                <button id='submitImage' title='Add an image' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--amber-400 mdl-color-text--white'>\n\
                                    <i class='material-icons'>attach_file</i>\n\
                                </button>\n\
                            </form>\n\
                        </div>\n\
                    </div>\n\
                    <div id='must-signin-snackbar' class='mdl-js-snackbar mdl-snackbar'>\n\
                        <div class='mdl-snackbar__text'></div>\n\
                        <button class='mdl-snackbar__action' type='button'></button>\n\
                    </div>\n\
                </div>\n\
                <div id='dropImageUp' class='dropImageUp'>Suelta los archivos aquí</div>";
        var main = document.createElement("main");
        main.innerHTML = html;
        main.className = "mainContainerchatNw6";

        if (self.container === null) {
            var d = document.createElement("div");
            d.className = "myContainerChat";
            document.body.appendChild(d);
            self.container = d;
            self.containerClassName = ".myContainerChat";
        }
        self.container.appendChild(main);
    },
    cursorMoveEnd: function (innerhtml) {
        var self = this;
        if (innerhtml === true) {
            var p = self.messageInputElement;
            var s = window.getSelection();
            var r = document.createRange();
//            r.setStart(p, p.childElementCount);
//            r.setEnd(p, p.childElementCount);
            r.setStart(p, 3);
            r.setEnd(p, 4);
            s.removeAllRanges();
            s.addRange(r);
            return true;
        }

        var p = self.messageInputElement;
        p.focus();
        if (p.hasChildNodes()) {
            var s = window.getSelection();
            var r = document.createRange();
            var e = p.childElementCount > 0 ? p.lastChild : p;
            r.setStart(e, 1);
            r.setEnd(e, 1);
            s.removeAllRanges();
            s.addRange(r);
        }
    },
    actionsInButtons: function () {
        var self = this;
        // Shortcuts to DOM Elements.
        self.contentChat = document.querySelector('.containerChatFormsAll');
        self.messageListElement = document.getElementById('messages');
        self.messageFormElement = document.getElementById('message-form');
        self.messageInputElement = document.querySelector(self.containerClassName + ' .message');
        self.containChangeFocus = document.querySelector(self.containerClassName + " .mdl-textfield");
        self.submitButtonElement = document.getElementById('submit');
        self.submitDictation = document.getElementById("dictation");
        self.buttonEmojis = document.querySelector(".buttonEmojis");
        self.imageButtonElement = document.getElementById('submitImage');
        self.imageFormElement = document.querySelector(self.containerClassName + ' .image-form');
        self.mediaCaptureElement = document.getElementById('mediaCapture');
        self.userPicElement = document.getElementById('user-pic');
        self.userNameElement = document.getElementById('user-name');
        self.signInButtonElement = document.getElementById('sign-in');
        self.signOutButtonElement = document.getElementById('sign-out');
        self.signInSnackbarElement = document.getElementById('must-signin-snackbar');
        self.dropImageUp = document.getElementById('dropImageUp');
        self.cargarmas = document.getElementById('cargarmas');
        self.nuevomensaje = document.getElementById('nuevomensaje');

        if (!self.useMicroMsg) {
            self.submitDictation.style.display = "none";
        }

        self.messageListElementScrollEnd = true;

        self.messageListElement.addEventListener('scroll', function (event) {
            var element = event.target;
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                self.removeBtnNewMessage();
                self.messageListElementScrollEnd = true;
            } else {
                self.messageListElementScrollEnd = false;
            }
        });
        self.messageFormElement.addEventListener('submit', function (e) {
            e.preventDefault();
            self.execFirebase(function () {
                self.onMessageFormSubmit(e);
            });
        });
        self.submitButtonElement.addEventListener('click', function (e) {
            self.messageFormElement.submit;
        });
        self.submitDictation.addEventListener('click', function (e) {
            wnwUtils.initRecordVoice(self.submitDictation, function (fileDownloadURL) {
                self.execFirebase(function () {
                    if (self.versionInput === 2) {
                        self.messageInputElement.innerHTML = fileDownloadURL;

                    } else {
                        self.messageInputElement.value = fileDownloadURL;

                    }
                    self.onMessageFormSubmit();
                });
            });
            self.messageInputElement.focus();
        });

        wnwEmoji.createBtnEmojis();

        self.buttonEmojis.addEventListener('click', function (e) {
            wnwEmoji.openEmojis();
        });
        self.cargarmas.addEventListener('click', function () {
            self.cargarmasfunc();
        });
        self.nuevomensaje.addEventListener('click', function () {
            self.removeBtnNewMessage();
        });

        document.querySelector(".containerChatFormsAll").onpaste = function (e) {
            var items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (var index in items) {
                var item = items[index];
                if (item.kind === 'file') {

                    var blob = item.getAsFile();
//                    blob.name = "captura_de_pantalla.png";
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        event.target.files = [];
                        event.target.files[0] = blob;
//                        event.target.files[0].name = "captura_de_pantalla.png";

                        self.onMediaFileSelected(event, "captura_de_pantalla.png");
                    };
                    reader.readAsDataURL(blob);
                }
            }
        };
        self.messageInputElement.onpaste = function (e) {
            var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
            e.preventDefault();
            document.execCommand('insertText', false, bufferText);
        };
        self.messageInputElement.addEventListener('keyup', function (event) {
            self.toggleButton();
            if (event.keyCode === 13 || event.key === "Enter") {
                if (self.versionInput === 2) {
                    self.messageInputElement.innerHTML = self.messageInputElement.innerHTML.replace(/<style.*<\/style>/g, '');
                    self.messageInputElement.innerHTML = self.messageInputElement.innerHTML.replace(/style/g, '');
                    self.messageInputElement.innerHTML = self.messageInputElement.innerHTML.replace(/style=/g, '');
                    self.messageInputElement.innerHTML = self.messageInputElement.innerHTML.replace(/<br>/g, '');
                    self.messageInputElement.innerHTML = self.messageInputElement.innerHTML.replace(/<div><\/div\>/g, '');
                } else {
                    self.messageInputElement.innerHTML = self.messageInputElement.innerHTML.replace(/\n/g, '<br>');
                }
                event.preventDefault();
                self.submitButtonElement.click();
                return false;
            }
        });
        self.messageInputElement.addEventListener('change', function () {
            self.toggleButton();
        });
        new MutationObserver(function () {
            self.toggleButton();
        }).observe(self.messageInputElement, {childList: true});

        self.messageInputElement.onfocus = function () {
            wnwUtils.addClass(self.containChangeFocus, "is-focused");
            self.cursorMoveEnd();
        };
        self.messageInputElement.addEventListener("blur", function () {
            var data = self.messageInputElement.innerText;
            data = wnwUtils.strip(data);
            if (wnwUtils.evalueData(data)) {
                return false;
            }
            wnwUtils.removeClass(self.containChangeFocus, "is-focused", true);
        });

        self.imageButtonElement.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof cordova !== "undefined") {
                if (typeof cordova.platformId !== "undefined") {
                    if (cordova.platformId !== "browser") {
                        var name = false;
                        var quality = 50;
                        var width = false;
                        var height = false;
                        var allowEdit = false;
                        var callback = function (r) {
                            if (self.debug)
                                console.log("rrrrrrrrr", r)
                            var file = self.domainSrv + r.response + "?ok=true";
                            self.saveMessage(false, file);

                            var m = {};
                            m.id_firebase = "saveMessageChat";
                            m.tipo = "saveMessageChat";
                            m.message = file;
                            m.image = file;
                            m.room = self.room;
                            m.roomNameData = self.nameData;
                            m.sendFirstMessage = self.sendFirstMessage;
                            m.setUserName = self.setUserName;
                            m.setUserPhoto = self.setUserPhoto;
                            window.parent.postMessage(m, '*');
                            if (self.callbackToSendMsg !== null) {
                                self.callbackToSendMsg(m);
                            }

                        };
                        var offline = false;
                        if (wnwUtils.evalueData(this.getAttribute("data-offline"))) {
                            offline = this.getAttribute("data-offline");
                            if (offline === "true") {
                                offline = true;
                            }
                        }
                        var camera = function () {
                            nw.uploadFileCamera(name, "camera", false, false, quality, width, height, allowEdit, callback, offline);
                        };
                        var files = function () {
                            nw.uploadFileCamera(name, "files", false, false, quality, width, height, allowEdit, callback, offline);
                        };
                        var options = {};
                        options.iconAccept = "<i class='material-icons' style='top: 5px;position: relative;'>camera_alt</i> ";
                        options.iconCancel = "<i class='material-icons' style='top: 5px;position: relative;'>photo_library</i> ";
                        options.useDialogNative = false;
                        options.closeEnc = true;
                        options.autocierre = true;
                        options.cleanHtml = false;
                        options.textAccept = "Cámara";
                        options.textCancel = "Archivos";
                        nw.dialog("Seleccione", camera, files, options);
                        return;
                    }
                }
            }
            self.mediaCaptureElement.click();
        });

        self.mediaCaptureElement.addEventListener('change', function (e) {
            self.onMediaFileSelected(e);
        });

//        if (__createActionsBtnsWnw) {
//            return true;
//        }

        if (typeof cordova !== "undefined") {
            if (typeof cordova.platformId !== "undefined") {
                if (cordova.platformId !== "browser") {
                    (function () {
                        $('body').delegate('.link_in_chatask', "click", function (e) {
                            if (typeof cordova !== "undefined") {
                                if (typeof cordova.platformId !== "undefined") {
                                    var dev = device.platform.toUpperCase();
                                    if (dev === 'ANDROID') {
                                        navigator.app.loadUrl(this.href, {openExternal: true});
                                        e.preventDefault();
                                    } else
                                    if (dev === 'IOS') {

                                        try {
                                            window.open(this.href, '_system');
                                            var html = "<iframe src='" + this.href + "' style='width: 100%; border: 0; height: calc(100% - 50px); position: fixed; top: 0px; left: 0px; overflow: hidden;' /></iframe>";
                                            nw.nw_dialog(html);
                                            e.preventDefault();
                                        } catch (e) {
//                                            alert("error");
//                                            alert(e);
                                            nw.utils.errorReport("ele failed", e);
                                            console.log("e", e);
                                            nw.console.log("e", e);
                                        }
                                    } else {
                                        window.open(this.href, "_BLANK");
                                        e.preventDefault();
                                    }
                                }
                                return false;
                            }
                            window.open(this.href, "_BLANK");
                            e.preventDefault();
                            return false;
                        });
                    })();
                    console.log(":::::::touch");
                    (function () {
                        $('body').delegate('.link_in_chatask', "touch", function (e) {
                            nw.console.log("OKOK___5");
                            if (typeof cordova !== "undefined") {
                                if (typeof cordova.platformId !== "undefined") {
                                    var dev = device.platform.toUpperCase();
                                    nw.console.log("dev", dev);

                                    if (dev === 'ANDROID') {
                                        navigator.app.loadUrl(this.href, {openExternal: true});
                                        e.preventDefault();
                                    } else
                                    if (dev === 'IOS') {
                                        nw.console.log("open4");
                                        window.open(this.href, '_system');
                                        var html = "<iframe src='" + this.href + "' style='width: 100%; border: 0; height: calc(100% - 50px); position: fixed; top: 0px; left: 0px; overflow: hidden;' /></iframe>";
                                        nw.nw_dialog(html);
                                        e.preventDefault();
                                    } else {
                                        window.open(this.href, "_BLANK");
                                        e.preventDefault();
                                    }
                                }
                                return false;
                            }
                            window.open(this.href, "_BLANK");
                            e.preventDefault();
                            return false;
                        });
                    })();
                }
            }
        }
        self.contentChat.addEventListener("drag", function (e) {
            if (self.debug)
                console.log("drag");
            e.preventDefault();
        }, {passive: true});
        self.contentChat.addEventListener("dragstart", function (event) {
            if (self.debug)
                console.log("dragstart");
        }, {passive: true});

        self.contentChat.addEventListener("dragend", function (event) {
            if (self.debug)
                console.log("dragend");
        }, {passive: true});

        self.contentChat.addEventListener("dragover", function (event) {
            if (self.debug)
                console.log("dragover");
            event.preventDefault();
            wnwUtils.addClass(self.dropImageUp, "dropImageUp_show");
        }, {passive: false});

        self.contentChat.addEventListener("dragenter", function (event) {
            if (self.debug)
                console.log("dragenter");
            wnwUtils.addClass(self.dropImageUp, "dropImageUp_show");
        }, {passive: true});

        self.contentChat.addEventListener("dragleave", function (event) {
            if (self.debug)
                console.log("dragleave");
            wnwUtils.removeClass(self.dropImageUp, "dropImageUp_show", true);
        }, {passive: true});

//        document.addEventListener("drop", function (event) {
        self.contentChat.addEventListener("drop", function (event) {
            if (self.debug)
                console.log("drop");
            event.preventDefault();
            wnwUtils.removeClass(self.dropImageUp, "dropImageUp_show", true);
            self.onMediaFileSelected(event);
        }, {passive: false});

        __createActionsBtnsWnw = true;
    },
    checkSetup: function () {
        var self = this;
        if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
            self.alert('You have not configured and imported the Firebase SDK. ' +
                    'Make sure you go through the codelab setup instructions and make ' +
                    'sure you are running the codelab using `firebase serve`');
        }
    },
    saveTokenInFirebase: function (token) {
        console.log("saveTokenInFirebase:::token", token);
        var self = this;
        firebase.firestore().collection(self.nameTableTokens).doc(token).set({uid: self.getUserMail(), token: token});
    },
    saveMessagingDeviceToken: function () {
        var self = this;
        self.execFirebase(function () {
            firebase.messaging().getToken().then(function (currentToken) {
                if (currentToken) {
                    self.token = currentToken;
                    // Saving the Device Token to the datastore.
//                    firebase.firestore().collection(self.nameTableTokens).doc(currentToken).set({uid: self.getUserMail(), token: currentToken});
                    self.saveTokenInFirebase(currentToken);
                } else {
                    // Need to request permissions to show notifications.
                    console.log("Need to request permissions to show notifications.");
                    self.requestNotificationsPermissions();
                }
            }).catch(function (error) {
                console.error('Unable to get messaging token.', error);
            });
        });
    },
    requestNotificationsPermissions: function () {
        console.log('Requesting notifications permission...');
        firebase.messaging().requestPermission().then(function () {
            // Notification permission granted.
            saveMessagingDeviceToken();
        }).catch(function (error) {
            console.error('Unable to get permission to notify.', error);
        });
    },
    replayMessage: function replayMessage(data) {
        var self = this;
        var messageElement = data.messageElement;
//        var type = data.typeMessage;
        var type = messageElement.typeMessage;
//        var textInitial = messageElement.querySelector(".textMessage").innerHTML;
        var textInitial = messageElement.typeMessageText;
        if (self.debug) {
            console.log("data", data)
            console.log("data.message.imageUrl", data.message.imageUrl)
            console.log("messageElement", messageElement)
            console.log("messageElement.typeMessageImageName", messageElement.typeMessageImageName)
            console.log("textInitial", textInitial)
        }
//        data.text = textInitial + " > " + messageElement.typeMessageName + " - " + messageElement.typeMessagefecha;
        data.text = textInitial;
        if (type === "image") {
            var f = data.message.imageUrl;
            var ff = wnwUtils.getFileByType(f, false, "nophpthumb", true);
            if (!ff.isImage) {
                f = ff.fileEnd;
            }
//            data.text = "<img class='imgTypeResponse' data-file='" + data.message.imageUrl + "' onclick='javascript: window.open(this.src, \"_BLANK\")' onload='javascript: wnw.messageListElement.scrollTop = wnw.messageListElement.scrollHeight' src='" + f + "' />";
            data.text = "<img class='imgTypeResponse' data-file='" + data.message.imageUrl + "' onclick='javascript: window.open(this.getAttribute(\"data-file\"), \"_BLANK\")' onload='javascript: wnw.messageListElement.scrollTop = wnw.messageListElement.scrollHeight' src='" + f + "' />";
            data.text += "<span class='imgNameTypeResponse'>" + messageElement.typeMessageImageName + "</span>";
        }
        data.text += " > <span class='replayNameDate'>" + messageElement.typeMessageName + " - " + messageElement.typeMessagefecha + "</span>";

        wnwUtils.remove(".message-form-response");
        var con = document.createElement("div");
        con.className = "message-form-response";
        con.innerHTML = data.text;
        document.querySelector("#message-form").prepend(con);

        self.msgResponse = data.text;
        self.messageInputElement.focus();

        var close = document.createElement("div");
        close.className = "message-form-response-close";
        close.innerHTML = "<i class='material-icons'>close</i>";
        close.onclick = function () {
            wnwUtils.remove(".message-form-response");
            self.msgResponse = "";
        }
        con.prepend(close);
    },
    getReactionByIcon: function getReactionByIcon(number) {
        if (number == -5) {
            return "<i class='material-icons reactionicon_materireactionicon_0'>thumb_down</i>";
        }
        if (number == 3) {
            return "<i class='material-icons reactionicon_materi reactionicon_3'>thumb_up</i>";
        }
        if (number == -10) {
            return "<i class='material-icons reactionicon_materi reactionicon_1'>sentiment_very_dissatisfied</i>";
        }
        if (number == 4) {
            return "<i class='material-icons reactionicon_materi reactionicon_4'>sentiment_satisfied</i>";
        }
        if (number == 5) {
            return "<i class='material-icons reactionicon_materi reactionicon_5'>sentiment_very_satisfied</i>";
        }
    },
    updateMessage: function updateMessage(id, message) {
        var div = document.getElementById(id);
        if (div) {
            div.querySelector(".message").innerHTML = message.text;
            div.querySelector(".message").typeMessage = "text";
        }
    },
    deleteMessage: function deleteMessage(id) {
        var div = document.getElementById(id);
        // If an element for that message exists we delete it.
        if (div) {
            div.parentNode.removeChild(div);
        }
    },
    messagesArray: [],
    loadMessages: function () {
        var self = this;
        self.loadedMessages = false;
        self.execFirebase(function () {
            queryRoom = db.collection(self.nameData).orderBy('timestamp', 'desc').limit(self.limitMessages).onSnapshot(function (snapshot) {
                if (self.debug)
                    console.log("loadMessages");
                wnwUtils.remove(".message-container-temporal");
                if (self.loadMessagesOnLoad === true) {
                    snapshot.docChanges().forEach(function (change) {
                        var message = change.doc.data();
                        if (self.debug) {
                            console.log("loadMessages", change);
                            console.log("change.type", change.type);
                            console.log("message", message);
                        }
//                        if (change.type === 'removed') {
                        if (change.type === 'removed' && message.type === "deleted") {
                            self.deleteMessage(change.doc.id);
                        } else
                        if (change.type === 'modified' && message.type === "deleted") {
                            self.updateMessage(change.doc.id, message);
                        } else
//                        if (change.type === 'added')
                        {
                            message.id = change.doc.id;
                            self.displayMessage(message);
                            wnwUtils.setHoursMsg(".fecha", false);

                        }
                    });
                    if (self.debug)
                        console.log("Load in Firebase")
                }
                self.loadedMessages = true;
                self.loadMessagesOnLoad = true;

                if (self.debug)
                    console.log("docChanges");


            });
        });
    },
    displayMessage: function (message) {
        var self = this;
        var id = message.id;
        var timestamp = message.timestamp;
        var name = message.name;
        var text = message.text;
        var picUrl = message.profilePicUrl;
        var imageUrl = message.imageUrl;
        var imageName = message.imageName;
        var fecha = message.fecha;
        var userName = message.userName;
        var tipo = message.tipo;
        var classNameAlter = "classNameAlter";
        if (typeof message.classNameAlter !== "undefined") {
            classNameAlter = message.classNameAlter;
        }
        var reactions = false;
        if (typeof message.reactions !== "undefined") {
            reactions = message.reactions;
        }

        var t = self.messagesLocal.length;
        for (var i = 0; i < t; i++) {
            var ms = self.messagesLocal[i];
            if (ms.id == message.id) {
//                if (ms.id == "0") {
//                    continue;
//                }
//                console.log("ms.id.toString()", "." + ms.id.toString())
//                var dov = document.querySelector("." + ms.id.toString());
//                console.log("dov", dov)
//                if (dov) {
//                    return;
//                }
            }
        }

        if (tipo === "file") {
            imageUrl = text;
            text = null;
        }

        var div = document.getElementById(id) || self.createAndInsertMessage(id, timestamp, name, message);
        if (picUrl) {
            div.querySelector('.pic').style.backgroundImage = 'url(' + self.addSizeToGoogleProfilePic(picUrl, true) + ')';
            div.querySelector('.pic').setAttribute("data-userName", userName);
            div.querySelector('.pic').onclick = function () {
                var url = "/nwlib6/nwproject/modules/nw_user_session/index.php?profilenw=" + userName;
                if (typeof nw !== "undefined") {
                    var html = "<iframe class='iframeProfileNw' src='" + url + "'></iframe>";
                    var params = {};
                    var params = {};
                    params.html = html;
                    params.id = "profile_nw_chat";
                    params.className = "profile_nw_chat";
                    params.canvas = ".profile_nw_chat";
                    params.showBack = false;
                    params.closeBack = true;
                    nw.createDialogNw(params);
                } else {
                    window.location = url;
                }
            }
        }
        wnwUtils.addClass(div, classNameAlter);

        div.querySelector('.name').textContent = name;
        div.querySelector('.fecha').textContent = fecha;
        div.querySelector('.fecha').setAttribute("data-date", fecha);
        var messageElement = div.querySelector('.message');
        var textResponse = "";
        var typeMessage = "text";

        var havetext = false;
        if (text) {
//            if (text.indexOf("youtube.com") !== -1) {
//                var idyoutu = wnwUtils.getGET(text);
//                text = '<iframe class="player_iframe_youtube" width="560" height="315" src="https://www.youtube.com/embed/' + idyoutu.v + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
//                messageElement.innerHTML = text;
//                typeMessage = "video_youtube";
//            } else
//            if (text.indexOf(".mp4") !== -1) {
//                text = '<video class="player_video" src="' + text + '" controls=""></video>';
//                messageElement.innerHTML = text;
//                typeMessage = "video_mp4";
//            } else
            if (text.indexOf(".mp3") !== -1 || text.indexOf(".wav") !== -1) {
                text = '<audio class="player_audio" src="' + text + '" controls=""></audio>';
                messageElement.innerHTML = text;
                typeMessage = "video_mp3";
            } else {
                var sp = text.split("|");
                if (typeof sp[1] !== "undefined") {
                    text = sp[1];
                    textResponse = sp[0];
                }
                typeMessage = "text";
                var haveUrl = wnwUtils.haveUrlString(text);
                if (haveUrl === true) {
                    var encodeUri = false;
                    var clean = false;
                    text = wnwUtils.renderHTML(text, encodeUri, clean);
                    text = decodeURIComponentSafe(text);
                    text = text.replace(/<style.*<\/style>/g, '');
                    text = text.replace(/style/g, '');
                    text = text.replace(/style=/g, '');
                    text = text.replace(/<br>/g, '');
                    text = text.replace(/<div><\/div\>/g, '');
                    text = text.replace(/data-css/g, 'style');
                    text = wnwUtils.str_replace("<div>", "", text);
                    text = wnwUtils.str_replace("</div>", "", text);
                    messageElement.innerHTML = text;
                } else {
                    if (self.versionInput === 2) {
                        text = decodeURIComponentSafe(text);
                        text = text.replace(/<style.*<\/style>/g, '');
                        text = text.replace(/style/g, '');
                        text = text.replace(/style=/g, '');
                        text = text.replace(/<br>/g, '');
                        text = text.replace(/<div><\/div\>/g, '');
                        text = text.replace(/data-css/g, 'style');
                        text = text.replace(/<div>/gi, '');
                        text = text.replace(/<\/div>/gi, '');
                        text = wnwUtils.str_replace("<div>", "", text);
                        text = wnwUtils.str_replace("</div>", "", text);
                        messageElement.innerHTML = text;
                    } else {
                        messageElement.textContent = text;
                    }
                }
            }
            if (self.versionInput === 2) {
//                messageElement.innerHTML = messageElement.innerHTML.replace(/<br>/g, '');
            } else {
                messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
            }

            havetext = text;
        }

        if (imageUrl && message.type !== "deleted") {
            var image = document.createElement('img');
            var className = "imgInMsg";
            var dataImg = wnwUtils.getFileByType(imageUrl, false, "nophpthumb", true);
            if (dataImg.isImage === false) {
                className += " imgInMsgIsFile";
                image = document.createElement('div');
                image.style = " background-image: url(" + dataImg.fileEnd + "); ";
            }
            image.addEventListener('load', function () {
                self.messageListElement.scrollTop = self.messageListElement.scrollHeight;
            });
            image.className = className;
            image.onclick = function (e) {
                var url = this.src;
                if (typeof cordova !== "undefined") {
                    if (typeof cordova.platformId !== "undefined") {
                        if (self.debug)
                            nw.console.log("1:::: " + device.platform.toUpperCase());
                        if (device.platform.toUpperCase() === 'ANDROID') {
                            navigator.app.loadUrl(url, {openExternal: true});
                            e.preventDefault();
                        } else
                        if (device.platform.toUpperCase() === 'IOS') {
                            try {
                                if (self.debug)
                                    nw.console.log("open5_ok");
//                                window.open(url, "_BLANK");
                                var html = "<iframe src='" + url + "' style='width: 100%; border: 0; height: calc(100% - 50px); position: fixed; top: 0px; left: 0px; overflow: hidden;' /></iframe>";
                                nw.nw_dialog(html);
                                window.open(url, '_system');
                                e.preventDefault();
                            } catch (e) {
//                                alert("error");
//                                alert(e);
                                nw.utils.errorReport("ele failed", e);
                                console.log("e", e);
                                nw.console.log("e", e);
                            }
                        } else {
                            window.open(url, "_BLANK");
                            e.preventDefault();
                        }
                        return false;
                    }
                }
                window.open(url, "_BLANK");
                e.preventDefault();
            };
            image.src = imageUrl + '&' + new Date().getTime();
            messageElement.innerHTML = '';
            if (self.debug) {
                console.log("havetext", havetext)
                console.log("text", text)
                console.log("imageName", imageName)
                console.log("imageUrl", imageUrl)
            }
            if (wnwUtils.evalueData(imageName)) {
                if (!havetext) {
                    havetext = "";
                }
                havetext += '<span class="textspanaddimagename">' + imageName + '</span>';
            }
            if (havetext !== false) {
                messageElement.innerHTML = '<span class="textspanaddimagead">' + havetext + '</span>';
            }
            messageElement.appendChild(image);

            typeMessage = "image";
            text = imageUrl + '&' + new Date().getTime();
        }
//        messageElement.innerHTML = "<span class='textMessage'>" + messageElement.innerHTML + "</span>";
        messageElement.typeMessage = typeMessage;
        messageElement.typeMessageName = name;
        messageElement.typeMessagefecha = fecha;
        messageElement.typeMessageText = text;
        messageElement.typeMessageImageName = imageName;
        messageElement.typeMessageImageUrl = imageUrl;

        if (reactions !== false) {
            var da = document.createElement("div");
            da.className = "reactionsMessage";
            var htr = "";
            for (var i = 0; i < reactions.length; i++) {
                var reac = reactions[i];
                htr += self.getReactionByIcon(reac.reaction);
            }
            da.innerHTML = htr;
            messageElement.append(da);
        }

        var da = document.createElement("div");
        da.className = "optionsMessage";
        messageElement.prepend(da);
        var usercrea = message.userName;

        if (typeof cordova !== "undefined") {
            if (typeof cordova.platformId !== "undefined") {
//                console.log("message", message)
//                console.log("usercrea", usercrea)
//                console.log("self.setUserEmail", self.setUserEmail)
                if (usercrea == self.setUserEmail) {
                    var d = document.createElement("i");
                    d.className = "material-icons chat_others_options_msg content_deletechat";
                    d.innerHTML = "delete";
                    d.data = {
                        text: text + " > " + name + " - " + fecha,
                        messageElement: messageElement,
                        typeMessage: typeMessage,
                        message: message
                    };
                    d.onclick = function (event) {
                        event.preventDefault();
                        var data = this.data;
                        self.deleteMessageFirebase(data);
                    };
                    da.appendChild(d);
                }
            }
        }

        var d = document.createElement("i");
        d.className = "material-icons chat_others_options_msg content_favorite";
        d.innerHTML = "grade";
        d.data = {
            text: text + " > " + name + " - " + fecha,
            messageElement: messageElement,
            typeMessage: typeMessage,
            message: message
        };
        d.onclick = function (event) {
            event.preventDefault();
            var data = this.data;
            var text = data.message.text;
            if (data.typeMessage === "image") {
                text = data.text;
            }
            if (typeof mainNwOutFuncFavorite !== "undefined") {
                var dx = {};
                dx.room = self.room;
                dx.msg = text;
                dx.data = data;
                mainNwOutFuncFavorite(dx);
            }
        };
        da.appendChild(d);

        var d = document.createElement("i");
        d.className = "material-icons chat_others_options_msg content_copy";
        d.innerHTML = "content_copy";
        d.data = {
            text: text + " > " + name + " - " + fecha,
            messageElement: messageElement,
            typeMessage: typeMessage,
            message: message
        };
        d.onclick = function (event) {
            event.preventDefault();
            var data = this.data;
            var text = data.message.text;
            if (data.typeMessage === "image") {
                text = data.text;
            }
            var aux = document.createElement("textarea");
            aux.innerHTML = text;
            document.body.appendChild(aux);
            aux.select();
            document.execCommand("copy");
            document.body.removeChild(aux);
        };
        da.appendChild(d);

        var usercrea = message.userName;
        if (usercrea != self.setUserEmail) {
            var d = document.createElement("i");
            d.className = "material-icons chat_others_options_msg content_tag_faces";
            d.innerHTML = "thumb_up"; //thumb_up tag_faces sentiment_very_satisfied mood thumbs_up_down
            d.data = {
                messageElement: messageElement,
                message: message
            };
            da.appendChild(d);

            var ds = document.createElement("i");
            ds.className = "material-icons chat_others_options_msg chat_others_options_msg_intern chat_others_1";
            ds.innerHTML = "sentiment_very_satisfied";
            ds.data = {
                messageElement: messageElement,
                message: message,
                point: 5
            };
            ds.onclick = function (event) {
                event.preventDefault();
                var data = this.data;
                self.reactionMessageFirebase(data);
            };
            d.appendChild(ds);
            var ds = document.createElement("i");
            ds.className = "material-icons chat_others_options_msg chat_others_options_msg_intern chat_others_2";
            ds.innerHTML = "sentiment_satisfied";
            ds.data = {
                messageElement: messageElement,
                message: message,
                point: 4
            };
            ds.onclick = function (event) {
                event.preventDefault();
                var data = this.data;
                self.reactionMessageFirebase(data);
            };
            d.appendChild(ds);
            var ds = document.createElement("i");
            ds.className = "material-icons chat_others_options_msg chat_others_options_msg_intern chat_others_3";
            ds.innerHTML = "sentiment_very_dissatisfied";
            ds.data = {
                messageElement: messageElement,
                message: message,
                point: -10
            };
            ds.onclick = function (event) {
                event.preventDefault();
                var data = this.data;
                self.reactionMessageFirebase(data);
            };
            d.appendChild(ds);
            var ds = document.createElement("i");
            ds.className = "material-icons chat_others_options_msg chat_others_options_msg_intern chat_others_4";
            ds.innerHTML = "thumb_up";
            ds.data = {
                messageElement: messageElement,
                message: message,
                point: 3
            };
            ds.onclick = function (event) {
                event.preventDefault();
                var data = this.data;
                self.reactionMessageFirebase(data);
            };
            d.appendChild(ds);
            var ds = document.createElement("i");
            ds.className = "material-icons chat_others_options_msg chat_others_options_msg_intern chat_others_5";
            ds.innerHTML = "thumb_down";
            ds.data = {
                messageElement: messageElement,
                message: message,
                point: -5
            };
            ds.onclick = function (event) {
                event.preventDefault();
                var data = this.data;
                self.reactionMessageFirebase(data);
            };
            d.appendChild(ds);
        }

        var d = document.createElement("i");
        d.className = "material-icons chat_others_options_msg arrow_back_chat";
        d.innerHTML = "reply";
        d.data = {
//            text: text + " > " + name + " - " + fecha,
            messageElement: messageElement,
//            typeMessage: typeMessage,
            message: message
        };
        d.onclick = function (event) {
            event.preventDefault();
            var data = this.data;
            self.replayMessage(data);
        };
        da.appendChild(d);

        var d = document.createElement("i");
        d.className = "material-icons keyboard_arrow_down_chat";
        d.innerHTML = "keyboard_arrow_down";
        d.data = {
//            text: text + " > " + name + " - " + fecha,
            messageElement: messageElement,
//            typeMessage: typeMessage,
            message: message
        };
        d.onclick = function (event) {
            event.preventDefault();
            var data = this.data;
            var links = [
                {
                    text: "Responder",
                    callback: function () {
                        if (self.debug)
                            console.log("data", data);
                        self.replayMessage(data);
                    }
                }
            ];
            links.push(
                    {
                        text: "Copiar",
                        callback: function () {
                            var text = data.message.text;
                            if (data.typeMessage === "image") {
                                text = data.text;
                            }
                            var aux = document.createElement("textarea");
                            aux.innerHTML = text;
                            document.body.appendChild(aux);
                            aux.select();
                            document.execCommand("copy");
                            document.body.removeChild(aux);
                        }
                    }
            );
            var showinfo = true;
            if (typeof up_nwmakermain !== "undefined") {
                if (typeof up_nwmakermain.perfil !== "undefined") {
                    if (up_nwmakermain.perfil != 7) {
//                        showinfo = false;
                    }
                }
            }
            if (typeof functionTaskUsersGerencia !== "undefined") {
                if (!functionTaskUsersGerencia(message.userName)) {
                    showinfo = false;
                }
            }
            if (message.userName == self.setUserEmail) {
                showinfo = true;
            }
            if (showinfo) {
                if (typeof data.message.info !== "undefined" && data.message.info !== null && data.message.info !== "") {
                    links.push(
                            {
                                text: "Info",
                                addClass: "infochatlink",
                                nameuser: message.userName,
                                nameuserclean: wnwUtils.cleanUserNwC(message.userName),
                                callback: function (thi) {
                                    var latitude = false;
                                    var longitude = false;
                                    var obj = JSON.parse(data.message.info);
                                    var htl = "";
                                    htl += "<strong>Enviado por</strong>: " + data.message.name + " (" + data.message.userName + ") <br />";
                                    htl += "<strong>Fecha</strong>: " + data.message.fecha + " <br />";
                                    htl += "<strong>Room</strong>: " + data.message.room + " <br />";
                                    Object.keys(obj).forEach(function (valor, indice) {
                                        htl += "<strong>" + valor + "</strong>: " + obj[valor] + " <br />";
                                        if (valor === "latitude") {
                                            latitude = obj[valor];
                                        }
                                        if (valor === "longitude") {
                                            longitude = obj[valor];
                                        }
                                    });
                                    if (latitude !== false && longitude !== false) {
                                        htl += "<strong><a href='https://maps.google.com/?q=" + latitude + "," + longitude + "' target='_BLANK'>Ver en mapa</a></strong><br />";
                                    }
                                    wnwUtils.dialog({html: htl});
                                }
                            }
                    );
                } else
                if (typeof functionMoreInfoChat !== "undefined") {
                    links.push(
                            {
                                text: "Info",
                                callback: function () {
                                    functionMoreInfoChat(data);
                                }
                            }
                    );
                }
            }
            if (typeof cordova !== "undefined") {
                if (typeof cordova.platformId !== "undefined") {
                    var usercrea = data.message.userName;
                    if (usercrea == self.setUserEmail) {
                        links.push(
                                {
                                    text: "Eliminar",
                                    callback: function () {
                                        self.deleteMessageFirebase(data);
                                    }
                                }
                        );
                    }
                }
            }
//            wnwUtils.menuFloat(this, links);

//            wnwUtils.menuFloat(messageElement, links);
            var domRect = messageElement.querySelector(".optionsMessage").getBoundingClientRect();
            var flot = wnwUtils.menuFloat(document.body, links);
//            var flot = wnwUtils.menuFloat(self.container, links);
            flot.style.top = domRect.top + "px";
            flot.style.left = domRect.left + "px";
        };
        da.appendChild(d);
//        da.prepend(d);
//        messageElement.prepend(d);

        if (textResponse !== "") {
            var d = document.createElement("div");
            d.className = "containResponseChatContain";
            d.innerHTML = "<div class='containResponseChat'>" + textResponse + "</div>";
            messageElement.prepend(d);
        }

//        setTimeout(function () {
//            div.classList.add('visible');
//        }, 1);

//        div.classList.add('visible');

        var isMe = false;

        if (message.name === self.setUserName) {
            isMe = true;
        }

        if (self.loadedMessages && !isMe) {
            self.showBtnNewMessage();
        } else {
            self.removeBtnNewMessage();
            self.messageListElement.scrollTop = self.messageListElement.scrollHeight;
            if (!wnwUtils.isMobile()) {
                self.messageInputElement.focus();
            }
        }
        message.ro = {};
        if (reactions !== false) {
            var ro = reactions[reactions.length - 1];
            if (typeof ro !== "undefined") {
                message.ro = ro;
            }
            if (self.loadMessagesFirst) {
                if (!self.validaMessageDisplayArray(message)) {
                    console.log("reactions:::ro", reactions, ro);
                    console.log("message", message);
                    console.log("message.type", message.type);
                    self.reactionMessageAnimation(ro.reaction, message.profilePicUrl);
                    self.addMessageDisplayArray(message);
                }
            }
        }
        if (!self.loadMessagesFirst) {
            setTimeout(function () {
                self.loadMessagesFirst = true;
            }, 500);
            self.addMessageDisplayArray(message);
        }

    },
    validaMessageDisplayArray: function (message) {
        var self = this;
        var men = self.arrayMessagesOnDisplay;
        for (var i = 0; i < men.length; i++) {
            var r = men[i];
            if (r.id == message.id && r.ro.userCalifica == message.ro.userCalifica) {
                return true;
            }
        }
        return false;
    },
    addMessageDisplayArray: function (message) {
        var self = this;
        self.arrayMessagesOnDisplay.push(message);
    },
    reactionMessageFirebase: function (data) {
        var self = this;
        var msg = data.message.text;
        var userCalificado = data.message.userName;
        var nameCalificado = data.message.name;
        var photoCalificado = data.message.profilePicUrl;
//        console.log("reactionMessageFirebase:::data", data);
//        console.log("reactionMessageFirebase:::data.reaction", data.message.reactions);
        if (typeof data.message.reactions !== "undefined") {
            for (var i = 0; i < data.message.reactions.length; i++) {
                var re = data.message.reactions[i];
                if (re.userCalifica == self.getUserMail()) {
                    return false;
                }
            }
        }
        var collection = "messages_" + self.room;
        var document = data.message.id;
        var point = data.point;
        firebase.firestore().collection(collection).doc(document).update({
            reactions: firebase.firestore.FieldValue.arrayUnion({
                user: userCalificado, userCalifica: self.getUserMail(),
                reaction: point
            }),
            type: "reaction"
        }).then(function () {
            if (self.debug)
                console.log("Document successfully reaction updated!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
            alert("Error removing document: " + error);
        });

        var fecha = wnwUtils.getActualFullDate();
        var mes = fecha.split(" ")[0];
        mes = mes.split("-")[1];
//        var da = {
//            room: self.room,
//            calificado_name: nameCalificado,
//            calificado_photo: photoCalificado,
//            calificado_user: userCalificado,
//            califica_user: self.getUserMail(),
//            califica_name: self.setUserName,
//            reaction: point,
//            mes: mes,
//            fecha: fecha
//        };
//        firebase.firestore().collection("reactions_history").add(da).catch(function (error) {
//            console.error('Error writing new message to database', error);
//        });
        var terminal = "N_A";
        var table = "reactions_history";
        if (typeof nw !== "undefined") {
            var up = nw.userPolicies.getUserData();
            terminal = up.terminal;
            //temporal solo por Julio 2022, después debe ser con terminal concatenada
//            if (terminal == "365") {
            table = "reactions_history_" + terminal;
//            }
        }
//        table = "reactions_history_" + terminal;
        var p = {
            collection: table,
            document: "mes_" + mes,
            mes: mes,
            terminal: terminal
        };
        var pa = {
            room: self.room,
            calificado_name: nameCalificado,
            calificado_photo: photoCalificado,
            calificado_user: userCalificado,
            califica_user: self.getUserMail(),
            califica_name: self.setUserName,
            reaction: point,
            msg: wnwUtils.strip(msg),
            type: "reaction",
            mes: mes,
            fecha: fecha
        };
        //intenta actualizar
        firebase.firestore().collection(p.collection).doc(p.document).update({
            reactions: firebase.firestore.FieldValue.arrayUnion(pa),
            terminal: terminal
        }).then(function () {
            if (self.debug)
                console.log("Document successfully reaction updated!");
        }).catch(function (error) {
            if (self.debug)
                console.error("Error updating document: ", error);
            //si genera error lo inserta como nuevo
            p.reactions = firebase.firestore.FieldValue.arrayUnion(pa);
            firebase.firestore().collection(p.collection).doc(p.document).set(p);
        });


        //actualiza encabezado de chat si está en Taskenter
        if (typeof nw !== "undefined") {
            firebase.firestore().collection("rooms").doc(self.room).update({lastMessage: nw.utils.cortaText(self.setUserName, 20) + " reaccionó a un mensaje"});
        }
        if (typeof functionReactionsCallBack !== "undefined") {
            functionReactionsCallBack(data);
        }
        console.log("SAVE REACTION:::END");
        self.reactionMessageAnimation(point, photoCalificado);
    },
    reactionMessageAnimation: function (point, photo) {
        var self = this;
        for (var i = 0; i < 20; i++) {
            var time = (i + "0") + 0;
            setTimeout(function () {
                var num = Math.random() * (100 - 0) + 0;
                var elem = document.createElement("div");
                elem.style = "left: " + num + "%;";
                elem.className = "emojiFloating";
                elem.innerHTML = self.getReactionByIcon(point);
                document.body.appendChild(elem);

                var num = Math.random() * (100 - 0) + 0;
                var elem = document.createElement("div");
                elem.style = "left: " + num + "%;background-image: url(" + photo + ");";
                elem.className = "emojiFloating emojiFloatingProfilePhoto";
                document.body.appendChild(elem);
            }, time);
            if (i + 1 == 20) {
                setTimeout(function () {
                    setTimeout(function () {
                        wnwUtils.remove(".emojiFloating");
                    }, 1000);
                }, time);
            }
        }


    },
    deleteMessageFirebase: function (data) {
        var self = this;
        var collection = "messages_" + self.room;
        var document = data.message.id;
        var h = "¿Desea eliminar este mensaje?";
        var ac = function () {
//            firebase.firestore().collection(collection).doc(document).delete().then(function () {
            firebase.firestore().collection(collection).doc(document).update({text: "Mensaje eliminado", type: "deleted"}).then(function () {
                if (self.debug)
                    console.log("Document successfully deleted!");
            }).catch(function (error) {
                console.error("Error removing document: ", error);
                alert("Error removing document: " + error);
            });
            firebase.firestore().collection("rooms").doc(self.room).update({lastMessage: nw.utils.cortaText(self.setUserName, 20) + " ha eliminado un mensaje"});
        };
        var cn = function () {
            return true;
        };
        nw.dialog(h, ac, cn);
    },
    createAndInsertMessage: function (id, timestamp, name, message) {
        var self = this;
        if (self.getMessagesLocal) {
            var existe = false;
            var t = self.messagesLocal.length;
            for (var i = 0; i < t; i++) {
                var ms = self.messagesLocal[i];
                if (ms.id == message.id) {
                    existe = true;
                    break;
                }
            }
            console.info("existe", existe);
            if (!existe) {
                self.messagesLocal.push(message);
                window.localStorage.setItem("messagesLocal_" + self.room, JSON.stringify(self.messagesLocal));
            }
        }

        var container = document.createElement('div');
        container.innerHTML = self.MESSAGE_TEMPLATE;
        var div = container.firstChild;
        div.setAttribute('id', id);
        var classUser = "message--mee";
        if (name !== self.getUserName()) {
            classUser = "message--other";
        }
        var id_user = message.id_user;
        var userName = message.userName;

        wnwUtils.addClass(div, classUser);

        var usc = wnwUtils.cleanUserNwC(userName);
        usc = usc.toString();
        if (typeof cordova !== "undefined") {
            $(div).addClass(id);
            $(div).addClass("messagechat_id_row_" + id_user);
            $(div).addClass("messagechat_username_row_" + usc);
        } else {
            wnwUtils.addClass(div, "messagechat_id_row_" + id_user);
            wnwUtils.addClass(div, "messagechat_username_row_" + usc);
            wnwUtils.addClass(div, id);
        }

        timestamp = timestamp ? timestamp.toMillis() : Date.now();
        div.setAttribute('timestamp', timestamp);

        var existingMessages = self.messageListElement.children;
        if (existingMessages.length === 0) {
            self.messageListElement.appendChild(div);
        } else {
            if (self.limitMessages) {
                self.cargarmas.style.display = "block";
            }
            var messageListNode = existingMessages[0];

            while (messageListNode) {

                var type = messageListNode.getAttribute("type");
                if (type !== null) {
                    break;
                }
                var messageListNodeTime = messageListNode.getAttribute('timestamp');

                if (!messageListNodeTime) {
                    console.log("ERROR");
                }
                if (messageListNodeTime > timestamp) {
                    break;
                }
                messageListNode = messageListNode.nextSibling;
            }
            self.messageListElement.insertBefore(div, messageListNode);
        }

        if (self.callbackToReceiveMessage !== null) {
            self.callbackToReceiveMessage(message);
        }

        return div;
    },
    onMessageFormSubmit: function (e) {
        var self = this;
        if (typeof e !== "undefined") {
            e.preventDefault();
        }

        var valueinput = self.messageInputElement.value;
        if (self.versionInput === 2) {
            valueinput = self.messageInputElement.innerHTML;
        }
//                setTimeout(function() {
        if (valueinput && self.checkSignedInWithMessage()) {
            var value = "";
            if (self.msgResponse !== "") {
                value += self.msgResponse + " | ";
            }
            if (self.versionInput === 2) {
                var valend = self.messageInputElement.innerHTML;
//                valend = wnwUtils.strip(self.messageInputElement.innerHTML);
                valend = valend.replace(/<style.*<\/style>/g, '');
                valend = valend.replace(/style/g, '');
                valend = valend.replace(/style=/g, '');
                valend = valend.replace(/<br>/g, '');
                valend = valend.replace(/<div><\/div\>/g, '');
//                value += encodeURI(valend);
                value += valend;
            } else {
                value += self.messageInputElement.value;
            }

//            value = unescape(encodeURIComponent(value));
//            value = encodeURIComponent(value);
//            value = encodeURI(value);

            wnwUtils.remove(".message-form-response");
            self.resetMaterialTextfield(self.messageInputElement);
            self.toggleButton();

            if (self.callbackToSendMsg !== null && self.callbackToSendMsg !== false) {
                var m = {};
                m.id_firebase = "saveMessageChat";
                m.tipo = "saveMessageChat";
                m.message = decodeURIComponentSafe(value);
                m.room = self.room;
                m.roomNameData = self.nameData;
                m.sendFirstMessage = self.sendFirstMessage;
                m.setUserName = self.setUserName;
                m.setUserPhoto = self.setUserPhoto;
                self.callbackToSendMsg(m);
            }

            self.saveMessage(value).then(function () {
                self.msgResponse = "";
                if (self.debug)
                    console.log("value", value);

                var m = {};
                m.id_firebase = "saveMessageChat";
                m.tipo = "saveMessageChat";
                m.message = decodeURIComponentSafe(value);
                m.room = self.room;
                m.roomNameData = self.nameData;
                m.sendFirstMessage = self.sendFirstMessage;
                m.setUserName = self.setUserName;
                m.setUserPhoto = self.setUserPhoto;
                console.log("tokensAllGroup", tokensAllGroup);
                if (tokensAllGroup != null) {
                    m.tokensConversation = tokensAllGroup;
                }
                window.parent.postMessage(m, '*');

                if (typeof self.callbackToSendMsgAfter !== "undefined") {
                    if (self.callbackToSendMsgAfter !== null && self.callbackToSendMsgAfter !== false) {
                        self.callbackToSendMsgAfter(m);
                    }
                }

                self.sendFirstMessage = true;

                self.tokensSended = {};
                if (self.saveToken === true) {
                    self.loadTokens(function (rta) {
                        console.log("self.loadTokens:::rta", rta);
                        var empresa = 0;
                        var id_viaje = 0;
                        var id_servicio_hora = 0;
                        var id_servicio_fecha = 0;
                        var message = decodeURIComponentSafe(value);
                        var users = [];
                        var usersArray = [];
                        var usersAllData = [];
                        for (var i = 0; i < rta.length; i++) {
//                            console.log("self.tokensSended", self.tokensSended);
//                            console.log("rta[i]", rta[i]);
                            if (typeof self.tokensSended[rta[i].token] != "undefined") {
                                continue;
                            }
                            var tokenSend = rta[i].token;
                            if (self.token != tokenSend) {
                                var a = {};
                                a.title = self.getUserName();
                                a.body = message;
                                a.sound = "default";
                                a.icon = "fcm_push_icon";
                                a.callback = "FCM_PLUGIN_ACTIVITY";
                                a.data = "main.newNotificationChat('Nuevo mensaje de chat por " + self.getUserName() + ": " + a.body + "')";
                                a.to = rta[i].token;
                                a.allData = rta[i];
                                console.log("a", a);
                                self.sendNotificacion(a, function (res) {
                                    console.log("res", res);
                                });
                                self.tokensSended[rta[i].token] = rta[i].token;
                                empresa = rta[i].empresa;
                                id_servicio_fecha = rta[i].id_servicio_fecha;
                                id_servicio_hora = rta[i].id_servicio_hora;
                                id_viaje = rta[i].id_viaje;
                            }
                            if (typeof usersArray[rta[i].usuario] == "undefined") {
                                users.push(rta[i].usuario);
                                usersArray[rta[i].usuario] = rta[i].usuario;

                                var da = {};
                                da.usuario = rta[i].usuario;
                                da.nombre = rta[i].nombre;
                                da.foto = self.domainSrv + rta[i].foto;
                                usersAllData.push(da);

                            }
                        }
                        users.push(self.setUserEmail);

                        var da = {};
                        da.usuario = self.setUserEmail;
                        da.nombre = self.setUserName;
                        da.foto = self.domainSrv + self.getProfilePicUrl();
                        usersAllData.push(da);


                        if (self.validateIsMovilmove()) {
                            self.getFirebaseSecondary();
                            self.execFirebaseSecondary(function () {
                                var p = {};
                                p.collection = "chats";
                                p.document = self.room;
                                var fields = {
                                    id_servicio_fecha: id_servicio_fecha,
                                    id_servicio_hora: id_servicio_hora,
                                    id_viaje: id_viaje,
                                    usuarios: users,
                                    usuarios_more_data: usersAllData,
                                    description: message,
                                    date: wnwUtils.getActualFullDate(),
                                    count: firebase.firestore.FieldValue.increment(1),
                                    total: firebase.firestore.FieldValue.increment(1)
                                };
                                for (var i = 0; i < users.length; i++) {
                                    fields["count_" + wnwUtils.cleanUserNwC(users[i])] = firebase.firestore.FieldValue.increment(1);
                                    fields["total_" + wnwUtils.cleanUserNwC(users[i])] = firebase.firestore.FieldValue.increment(1);
                                    fields["open_" + wnwUtils.cleanUserNwC(users[i])] = "NO";
                                }
                                secondaryDatabase.firestore().collection(p.collection).doc(p.document).update(fields).then(function () {
                                    console.log("FIREBASE::UPDATE:: collection: " + p.collection + " document: " + p.document);
                                }).catch(function (error) {
                                    console.error("Error writing document: ", error, p);
//                                    p.usuarios = firebase.firestore.FieldValue.arrayUnion(rta);
                                    for (var i = 0; i < users.length; i++) {
                                        p["count_" + wnwUtils.cleanUserNwC(users[i])] = 1;
                                        p["total_" + wnwUtils.cleanUserNwC(users[i])] = 1;
                                        p["open_" + wnwUtils.cleanUserNwC(users[i])] = "NO";
                                    }
                                    p.usuarios_more_data = usersAllData;
                                    p.usuarios = users;
                                    p.empresa = empresa;
                                    p.id_servicio_fecha = id_servicio_fecha;
                                    p.id_servicio_hora = id_servicio_hora;
                                    p.id_viaje = id_viaje;
                                    p.description = message;
                                    p.date = wnwUtils.getActualFullDate();
                                    p.type = "chat";
                                    p.room = self.room;
                                    p.count = 1;
                                    p.total = 1;
//                            p.getData = get;
//                            p.arrayData = array;
                                    p.callback = "main.openNotificationFirebase(p)";
                                    console.log("p", p);
                                    secondaryDatabase.firestore().collection(p.collection).doc(p.document).set(p);
                                });
                                console.log("Chat created!");
                            });
                        }

                    });
                }
                self.messageInputElement.focus();
            });
        }
//       }, 1000);

        self.messageInputElement.focus();

    },
    saveMessage: function (messageText, imageUrl) {
        var self = this;
        // Add a new message entry to the database.
//        return self.execFirebase(function () {
        var info = {};
        info.infoMobile = wnwUtils.getMobileOperatingSystem();
        info.appMode = wnwUtils.appMode();
        info.latitude = wnwUtils.infoDevice().latitude;
        info.longitude = wnwUtils.infoDevice().longitude;
        info.browserVersion1a = wnwUtils.infoDevice().browserVersion1a;
        info.browserLanguage = wnwUtils.infoDevice().browserLanguage;
        info.browserPlatform = wnwUtils.infoDevice().browserPlatform;
        info.devType = wnwUtils.getDevType();
        info.screenWidth = screen.width;
        info.screenHeight = screen.height;
        if (typeof screen.ip !== "undefined") {
            info.IP = screen.ip;
        }
        if (typeof config !== "undefined") {
            if (typeof config.version !== "undefined") {
                info.version = config.version;
            }
        }
        if (typeof app !== "undefined") {
            if (typeof app.version !== "undefined") {
                info.version_nwmaker = app.version;
            }
        }

        if (typeof imageUrl === "undefined") {
            imageUrl = false;
        }

        var data = {
            room: self.room,
            id_user: self.getUserID(),
            userName: self.getUserMail(),
            name: self.getUserName(),
            text: messageText,
            imageUrl: imageUrl,
            profilePicUrl: self.getProfilePicUrl(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            fecha: wnwUtils.getActualFullDate(),
            info: JSON.stringify(info)
        };

        return firebase.firestore().collection(self.nameData).add(data).catch(function (error) {
            console.error('Error writing new message to database', error);
        });
//        });
    },
    toggleButton: function () {
        var self = this;
        var val = self.messageInputElement.value;
        if (self.versionInput === 2) {
            val = self.messageInputElement.textContent;
        }
        if (val) {
            self.submitButtonElement.removeAttribute('disabled');
        } else {
            self.submitButtonElement.setAttribute('disabled', 'true');
        }
    },
    countBtnNewMessage: 0,
    showBtnNewMessage: function () {
        var self = this;
        if (self.messageListElementScrollEnd) {
            self.removeBtnNewMessage();
            self.messageListElement.scrollTop = self.messageListElement.scrollHeight;
//            if (!wnwUtils.isMobile()) {
//                self.messageInputElement.focus();
//            }
            return;
        }

        self.countBtnNewMessage++;
        var cero = "";
        if (self.countBtnNewMessage > 1) {
            cero = "s";
        }
        self.nuevomensaje.style.display = "flex";
        self.nuevomensaje.innerHTML = "<i class='material-icons'>arrow_downward</i> " + self.countBtnNewMessage + " nuevo" + cero + " mensaje" + cero;
    },
    removeBtnNewMessage: function () {
        var self = this;
        self.countBtnNewMessage = 0;
        self.nuevomensaje.style.display = "none";
        self.messageListElement.scrollTop = self.messageListElement.scrollHeight;
        if (!wnwUtils.isMobile()) {
            self.messageInputElement.focus();
        }
    },
    checkSignedInWithMessage: function () {
        var self = this;
        return true;

        if (isUserSignedIn()) {
            return true;
        }
        var data = {
            message: 'You must sign-in first',
            timeout: 2000
        };
        self.signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
        return false;
    },
    resetMaterialTextfield: function (element) {
        var self = this;
        if (self.versionInput === 2) {
            element.innerHTML = '';
        } else {
            element.value = '';
        }
//        element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
    },
    loadTokens: function (callback) {
        var self = this;
        if (tokensAllGroup != null) {
            return callback(tokensAllGroup);
        }
        self.execFirebase(function () {
            var query = firebase.firestore().collection(self.nameTableTokens);
            query.onSnapshot(function (snapshot) {
                var tokens = [];
                snapshot.docChanges().forEach(function (change) {
                    var token = change.doc.data();
                    tokens.push(token);
                });
                callback(tokens);
            });
        });
    },
    onMediaFileSelected: function (event, namefile) {
        var self = this;
        event.preventDefault();
        if (!self.finishSaveImage) {
            return false;
        }
        var file = null;
        if (typeof event.dataTransfer !== "undefined") {
            file = event.dataTransfer.files[0];
        } else {
            file = event.target.files[0];
        }
        var name = file.name;
        if (wnwUtils.evalueData(namefile)) {
            name = namefile;
        }
//        console.log("onMediaFileSelected:::event, file", event, file);
//        console.log("name", name)
//        console.log("self.imageFormElement", self.imageFormElement)

        var addClass = "";
        var f = URL.createObjectURL(file);
        if (self.debug) {
            console.log("f", f);
        }
        var ff = wnwUtils.getFileByType(name, false, "nophpthumb", true);
        if (!ff.isImage) {
            f = ff.fileEnd;
            addClass = "imgprevis_file";
        }
        var htl = "";
        htl += "<div class='imgprevis " + addClass + "' style='background-image: url(" + f + ");'></div>";
        htl += "<div class='btnsfAdjuntoN'>";
        htl += "<input placeholder='Escribe algo...' type='text' class='textAddAdu'></input>";
        htl += "<button class='cancelAdjuntoN'>Cancelar</button>";
        htl += "<button class='enviarAdjuntoN'>Enviar</button>";
        htl += "</div>";
        var d = wnwUtils.dialog({html: htl});
        document.querySelector(".textAddAdu").focus();
        d.querySelector(".cancelAdjuntoN").onclick = function () {
            d.remove();
            self.imageFormElement.reset();
            self.finishSaveImage = true;
        };
        self.imageFormElement.reset();
        d.querySelector(".enviarAdjuntoN").onclick = function () {
            file.textAdd = document.querySelector(".textAddAdu").value;
            d.remove();
            self.imageFormElement.reset();
            if (self.checkSignedInWithMessage()) {
                self.saveImageMessage(file, name);
            }
        };
        return;
        self.imageFormElement.reset();
        if (self.checkSignedInWithMessage()) {
            self.saveImageMessage(file, name);
        }
    },
    finishSaveImage: true,
    saveImageMessage: function (file, name) {
        var self = this;
        if (!self.finishSaveImage) {
            return false;
        }
        var text = "";
        if (typeof file.textAdd !== "undefined") {
            text = file.textAdd;
        }
        self.finishSaveImage = false;

        self.execFirebase(function () {
            firebase.firestore().collection(self.nameData).add({
                room: self.room,
                id_user: self.getUserID(),
                userName: self.getUserMail(),
                name: self.getUserName(),
                nameFile: name,
                imageUrl: self.LOADING_IMAGE_URL,
                profilePicUrl: self.getProfilePicUrl(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                fecha: wnwUtils.getActualFullDate()
            }).then(function (messageRef) {
                var filePath = messageRef.id + '/' + file.name;
                return firebase.storage().ref(filePath).put(file).then(function (fileSnapshot) {
                    return fileSnapshot.ref.getDownloadURL().then(function (url) {

                        var m = {};
                        m.tipo = "saveMessageChat";
                        m.message = "";
                        m.nameFile = name;
                        m.image = url;
                        m.room = self.room;
                        m.roomNameData = self.nameData;
                        m.setUserName = self.setUserName;
                        m.setUserPhoto = self.setUserPhoto;
                        window.parent.postMessage(m, '*');

                        if (self.callbackToSendMsg !== null) {
                            self.callbackToSendMsg(m);
                        }

                        self.finishSaveImage = true;

//                        console.log("self.finishSaveImage", self.finishSaveImage);

                        return messageRef.update({
                            text: text,
                            imageUrl: url,
                            imageName: name,
                            storageUri: fileSnapshot.metadata.fullPath
                        });


                    });
                });
            }).catch(function (error) {
                console.error('There was an error uploading a file to Cloud Storage:', error);
            });
        });
    },
    cargarmasfunc: function () {
        var self = this;
        var d = document.querySelectorAll(".message-container");
        for (var i = 0; i < d.length; i++) {
            d[i].remove();
        }
        var m = {};
        m.tipo = "loadMoreMessages";
        m.room = self.room;
        m.setUserName = self.setUserName;
        m.setUserPhoto = self.setUserPhoto;
        window.parent.postMessage(m, '*');
        if (self.callbackToSendMsg !== null) {
            self.callbackToSendMsg(m);
        }
    },
    sendNotificacion: function (array, callback) {
        console.log("sendNotificacion:::array", array);
        var self = this;
//        var key = "AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss";
//        if (typeof array.key !== "undefined") {
//            key = array.key;
//        }
//        console.log("key", key);
        var key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';//nwMaker (alexf) la de siempre
        if (wnwUtils.evalueData(self.keyGoogleNotificacionPush) && !wnwUtils.evalueData(array.key)) {
            setTimeout(function () {
                var sendData = array;
                sendData.key = self.keyGoogleNotificacionPush;
                self.sendNotificacion(sendData, callback);
            }, 1000);
        }
        if (wnwUtils.evalueData(array.key)) {
            key = array.key;
        }
        console.log("sendNotificacion:::key", key);
        console.log("sendNotificacion:::array", array);

//        array.callback = "FCM_PLUGIN_ACTIVITY";
//        array.sound = "default";
//        array.icon = "fcm_push_icon";
//        array.data = "";

        console.log("%cOK:::sendNotificationTo:::" + array.to + ">>>>", 'background: #ff3366; color: #fff');

        var to = array.to;
        var notification = {
            'title': "Nuevo mensaje de chat: " + array.title,
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
                'to': to,
//                "restricted_package_name":""
                data: {
                    data: array.data,
                    callback: array.callback.toString(),
                    title: array.title,
                    body: array.body
                }
            })
        }).then(function (response) {
            console.log("sendNotificacionOK:::response", response);
            console.log("sendNotificacionOK:::to", to);
            callback(response);

//            console.log("array.allData.usuario", array.allData.usuario)
//            console.log("self.tokensSended", self.tokensSended)
            console.log("self.tokensSended[array.allData.usuario]", self.tokensSended[array.allData.usuario])
            if (typeof self.tokensSended[array.allData.usuario] != "undefined" && typeof self.tokensSended[array.allData.perfil] != "undefined") {
//            if (typeof self.tokensSended[array.allData.usuario] != "undefined") {
                return;
            }
//            if (self.validateIsMovilmove()) {
//                self.getFirebaseSecondary();
//                self.execFirebaseSecondary(function () {
//                    var p = {};
//                    p.collection = "notifications";
////                        p.document = "notif_" + Math.floor((Math.random() * 10000000) + 1);
//                    p.document = self.room + "_" + array.allData.usuario + "_" + array.allData.perfil;
//                    var fields = {
//                        envia_foto: self.domainSrv + self.getProfilePicUrl(),
//                        envia_nombre: self.setUserName,
//                        envia_email: self.setUserEmail,
//                        title: array.title,
//                        description: array.body,
//                        date: wnwUtils.getActualFullDate(),
//                        body: array.body,
//                        open: "NO",
//                        count: firebase.firestore.FieldValue.increment(1),
//                        total: firebase.firestore.FieldValue.increment(1)
//                    };
//                    secondaryDatabase.firestore().collection(p.collection).doc(p.document).update(fields).then(function () {
//                        console.log("FIREBASE::UPDATE:: collection: " + p.collection + " document: " + p.document);
//                    }).catch(function (error) {
//                        console.error("Error writing document: ", error, p);
//                        p.usuario = array.allData.usuario;
//                        p.perfil = array.allData.perfil;
//                        p.empresa = array.allData.empresa;
//                        p.envia_foto = self.setUserPhoto;
//                        p.envia_nombre = self.setUserName;
//                        p.envia_email = self.domainSrv + self.getProfilePicUrl();
//                        p.title = array.title;
//                        p.description = array.body;
//                        p.date = wnwUtils.getActualFullDate();
//                        p.open = "NO";
//                        p.type = "chat";
//                        p.room = self.room;
//                        p.count = 1;
//                        p.total = 1;
////                            p.getData = get;
////                            p.arrayData = array;
//                        p.callback = "main.openNotificationFirebase(p)";
//                        console.log("p", p);
//                        secondaryDatabase.firestore().collection(p.collection).doc(p.document).set(p);
//                    });
//                    console.log("Notification created!");
//                    self.tokensSended[array.allData.usuario] = array.allData.usuario;
//                    self.tokensSended[array.allData.perfil] = array.allData.perfil;
//                });
//            }
        }).catch(function (error) {
            console.error(error);
        });
    },
    validateIsMovilmove: function () {
        var get = wnwUtils.getGET();
        if (typeof get.configAditional != "undefined") {
            var configAditional = atob(get.configAditional);
            var data = JSON.parse(configAditional);
            if (data.is_movilmove == true) {
                return true;
            }
        }
        return false;
    },
    getFirebaseSecondary: function () {
//        var get = wnwUtils.getGET();
//        if (typeof get.configAditional != "undefined") {
//            var configAditional = atob(get.configAditional);
//            var data = JSON.parse(configAditional);
//        }
        if (typeof secondaryDatabase == "undefined") {
            //movilmove services 20nov2023
            var firebasePruebas = false;
//            var domain = window.location.host;
            var domain = self.domainSrv;
            console.log("domain", domain);
            var firebaseConfig = false;
//            if (domain == "app.movilmove.com" || domain == "app.transfershcy.com") {
                firebasePruebas = "PRODUCCIÓN";
                //movilmove producción services 21nov2023
                firebaseConfig = {
                    apiKey: "AIzaSyCANJzxDNeSj-MFeOdEtOEmapAiR0r5Yvw",
                    authDomain: "movilmove-services.firebaseapp.com",
                    projectId: "movilmove-services",
                    storageBucket: "movilmove-services.appspot.com",
                    messagingSenderId: "766196491813",
                    appId: "1:766196491813:web:9f1e67fa80f885094d01cc"
                };
//            }
            if (domain == "test.movilmove.com" || domain == "ultimamilla.sitca.co" || domain == "eu.movilmove.com" || domain == "192.168.1.45" || domain == "movilmove.loc") {
                firebasePruebas = "PRUEBAS";
                firebaseConfig = {
                    apiKey: "AIzaSyDficCW6wxBnN_9uuwrp7yUBQVukXmhMBg",
                    authDomain: "movilmove-services-test.firebaseapp.com",
                    projectId: "movilmove-services-test",
                    storageBucket: "movilmove-services-test.appspot.com",
                    messagingSenderId: "496616900417",
                    appId: "1:496616900417:web:13ae352d745983daed03c0"
                };
            }
            if (!firebasePruebas || !firebaseConfig) {
                alert("NO puede activar Firebase en este dominio " + domain + ". No autorizado.");
                return false;
            }
            console.log("firebaseConnection", firebasePruebas);
            secondaryDatabase = firebase.initializeApp(firebaseConfig, "secondary");
        }
    },
    execFirebaseSecondary: function (callback) {
        var self = this;
        if (typeof secondaryDatabase === "undefined") {
            setTimeout(function () {
                return self.execFirebaseSecondary(callback);
            }, 100);
            return false;
        }
        if (typeof secondaryDatabase.firestore === "undefined") {
            setTimeout(function () {
                return self.execFirebaseSecondary(callback);
            }, 100);
            return false;
        }
        return callback();
    },
    execFirebase: function (callback) {
        var self = this;
        if (typeof firebase === "undefined") {
            setTimeout(function () {
                return self.execFirebase(callback);
            }, 100);
            return false;
        }
        if (typeof firebase.firestore === "undefined") {
            setTimeout(function () {
                return self.execFirebase(callback);
            }, 100);
            return false;
        }
        return callback();
    },
    alert: function (msg) {
        if (typeof cordova !== "undefined") {
            if (typeof cordova.platformId !== "undefined") {
                nw.utils.errorReport(msg);
                return false;
            }
        }
        alert(msg);
        return false;
    }
};

document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener('click', function (e) {
        if (e.target.classList.value.indexOf("keyboard_arrow_down_chat") === -1) {
            wnwUtils.removeClass(".containMenuFloatChat", "containMenuFloatShowChat");
            setTimeout(function () {
                wnwUtils.remove(".containMenuFloatChat");
            }, 500);

        }
    });
});

function decodeURIComponentSafe(s) {
    var uri = s;
    var out = new String(),
            arr,
            i = 0,
            l,
            x;
    typeof mod === "undefined" ? mod = 0 : 0;
    arr = uri.split(/(%(?:d0|d1)%.{2})/);
    for (l = arr.length; i < l; i++) {
        try {
            x = decodeURIComponent(arr[i]);
        } catch (e) {
            x = mod ? arr[i].replace(/%(?!\d+)/g, '%25') : arr[i];
        }
        out += x;
    }
    return out;
    /*
     return;
     if (!s) {
     return s;
     }
     //    return decodeURIComponent(s.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'));
     return decodeURI(s.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'));
     //    return decodeURI(s);
     */
}


window.addEventListener('message', function (e) {
    console.log("message:::e", e);
});