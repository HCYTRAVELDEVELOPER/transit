var db = null;
var roomsArray = [];
var roomsArrayMsg = [];
var queryRoom = null;
var wnw = {
    debug: false,
    versionInput: 2,
    room: null,
    nameData: null,
    nameTableTokens: null,
    token: null,
    sendFirstMessage: false,
    saveToken: true,
    limitMessages: 12,
    photoGenericProfile: '/nwlib6/nwproject/modules/webrtc/v6/chat/images/profile_placeholder.png',
    setUserID: null,
    setUserEmail: null,
    setUserName: null,
    setUserPhoto: null,
    loadMessagesOnLoad: true,
    loadedMessages: false,
    useLocation: false,
    containerClassName: null,
    callbackToSendMsg: null,
    callbackToSendMsgAfter: null,
    callbackToReceiveMessage: null,
    callBackOnAppear: null,
    msgResponse: "",
    domainSrv: window.location.protocol + "//" + window.location.host,
    is_app: false,
    container: null,
    initialize: function (options) {
        var self = this;
        if (typeof options.domainSrv !== "undefined") {
            self.domainSrv = options.domainSrv;
        }
        var version = "8";
        if (typeof config !== "undefined") {
            if (typeof config.version !== "undefined") {
                version = config.version;
            }
        }
//        wnwUtils.loadCss(self.domainSrv + "/nwlib6/nwproject/modules/webrtc/v6/chat/styles/emoji.css?v=" + version);
//        wnwUtils.cargaJs(self.domainSrv + "/nwlib6/nwproject/modules/webrtc/v6/chat/scripts/frb-nw-emoji.js?v=" + version, function () {
//            return self.initializeExec(options);
//        }, false, true);
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
        }

        if (typeof options.room !== "undefined") {
            self.room = options.room;
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
//        if (ind !== -1) {
//            var arr = roomsArrayMsg[self.room];
//            arr.sort(function (a, b) {
//                return b.timestamp - a.timestamp;
//            });
//
//            arr.sort(function (a, b) {
//                return +(a.fecha > b.fecha) || +(a.fecha === b.fecha) - 1;
//            });
//            for (var i = 0; i < arr.length; i++) {
//                var message = arr[i];
//                self.displayMessage(message.id, message.timestamp, message.name, message.text, message.profilePicUrl, message.imageUrl, message.fecha);
//            }
//        } 
//        else {
        roomsArray.push(self.room);
        roomsArrayMsg[self.room] = [];
//        self.loadMessages();
        self.loadMessagesLocal();
        var online = wnwUtils.isOnline();
        if (online) {
            self.loadMessages();
        }
//        }

        if (self.saveToken) {
            self.saveMessagingDeviceToken();
        }
        wnwUtils.setHoursMsg(".fecha", true);
        setInterval(function () {
            wnwUtils.setHoursMsg(".fecha", true);
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
                        wnwUtils.setHoursMsg(".fecha", true);
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
    loadMessagesLocal: function () {
        var self = this;
        self.messagesLocal = Array();
        if (wnwUtils.evalueData(window.localStorage.getItem("messagesLocal_" + self.room))) {
            var msgall = window.localStorage.getItem("messagesLocal_" + self.room);
            msgall = JSON.parse(msgall);
            console.log("msgall", msgall);
            self.messagesLocal = msgall;
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
                console.log("message", message)
                self.displayMessage(message);
            }
        }
        console.log("Load messages in local");
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
                if (typeof foto.split("://")[1] !== "undefined") {
                    foto = "/imagenes/" + foto.split("://")[1].split("/imagenes/")[1];
                }
            }
        } else {
            foto = url.replace(self.domainSrv, "");
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
//        console.log("cursorMoveEnd", innerhtml);
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

        function CleanPastedHTML(input) {
            // 1. remove line breaks / Mso classes
            var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
            var output = input.replace(stringStripper, ' ');
            // 2. strip Word generated HTML comments
            var commentSripper = new RegExp('<!--(.*?)-->', 'g');
            var output = output.replace(commentSripper, '');
            var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
            // 3. remove tags leave content if any
            output = output.replace(tagStripper, '');
            // 4. Remove everything in between and including tags '<style(.)style(.)>'
            var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];

            for (var i = 0; i < badTags.length; i++) {
                tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
                output = output.replace(tagStripper, '');
            }
            // 5. remove attributes ' style="..."'
            var badAttributes = ['style', 'start'];
            for (var i = 0; i < badAttributes.length; i++) {
                var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
                output = output.replace(attributeStripper, '');
            }
            return output;
        }

//        document.onpaste = function (e) {
        document.querySelector(".containerChatFormsAll").onpaste = function (e) {
            var items = (e.clipboardData || e.originalEvent.clipboardData).items;
//            console.log(JSON.stringify(items));
            for (var index in items) {
                var item = items[index];
//                console.log("item.kind", item.kind)
                if (item.kind === 'file') {

                    var blob = item.getAsFile();
//                    blob.name = "captura_de_pantalla.png";
                    var reader = new FileReader();
                    reader.onload = function (event) {
//                        console.log(event.target.result)
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
        //se reemplaza por new MutationObserver
//        self.messageInputElement.addEventListener("DOMNodeInserted", function (e) {
//            self.toggleButton();
//        });
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
                            var file = self.domainSrv + r.response + "?ok=true";
                            self.saveMessage(false, file);

                            var m = {};
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

        if (typeof cordova !== "undefined") {
            nw.console.log("OKOK___2");
            if (typeof cordova.platformId !== "undefined") {
                nw.console.log("OKOK___3");
                if (cordova.platformId !== "browser") {
                    nw.console.log("OKOK___4");
                    console.log(":::::::click");
                    nw.console.log("OKOK___4NOP");
                    (function () {
                        $('body').delegate('.link_in_chatask', "click", function (e) {
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



        document.addEventListener("drag", function (e) {
            if (self.debug)
                console.log("drag");
            e.preventDefault();
        }, false);

        document.addEventListener("dragstart", function (event) {
            if (self.debug)
                console.log("dragstart");
        }, false);

        document.addEventListener("dragend", function (event) {
            if (self.debug)
                console.log("dragend");
        }, false);

        document.addEventListener("dragover", function (event) {
            if (self.debug)
                console.log("dragover");
            event.preventDefault();
            wnwUtils.addClass(self.dropImageUp, "dropImageUp_show");
        }, false);

        document.addEventListener("dragenter", function (event) {
            if (self.debug)
                console.log("dragenter");
            wnwUtils.addClass(self.dropImageUp, "dropImageUp_show");
        }, false);

        document.addEventListener("dragleave", function (event) {
            if (self.debug)
                console.log("dragleave");
            wnwUtils.removeClass(self.dropImageUp, "dropImageUp_show", true);
        }, false);

        document.addEventListener("drop", function (event) {
            if (self.debug)
                console.log("drop");

//            event.preventDefault();
            wnwUtils.removeClass(self.dropImageUp, "dropImageUp_show", true);
            self.onMediaFileSelected(event);
        }, false);
    },
    checkSetup: function () {
        var self = this;
        if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
            self.alert('You have not configured and imported the Firebase SDK. ' +
                    'Make sure you go through the codelab setup instructions and make ' +
                    'sure you are running the codelab using `firebase serve`');
        }
    },
    saveMessagingDeviceToken: function () {
        var self = this;
        self.execFirebase(function () {
            firebase.messaging().getToken().then(function (currentToken) {
                if (currentToken) {
                    self.token = currentToken;
                    // Saving the Device Token to the datastore.
                    firebase.firestore().collection(self.nameTableTokens).doc(currentToken).set({uid: self.getUserMail(), token: currentToken});
                } else {
                    // Need to request permissions to show notifications.
                    console.log("Need to request permissions to show notifications.");
                    requestNotificationsPermissions();
                }
            }).catch(function (error) {
                console.error('Unable to get messaging token.', error);
            });
        });
    },
    loadMessages: function () {
        var self = this;
//        self.loadMessagesOnLoad = false;
        self.loadedMessages = false;
        self.execFirebase(function () {
//            console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
//        queryRoom = firebase.firestore().collection(self.nameData).orderBy('timestamp', 'desc').limit(self.limitMessages).onSnapshot(function (snapshot) {
            queryRoom = db.collection(self.nameData).orderBy('timestamp', 'desc').limit(self.limitMessages).onSnapshot(function (snapshot) {
                if (self.loadMessagesOnLoad === true) {
                    snapshot.docChanges().forEach(function (change) {
                        if (self.debug)
                            console.log("loadMessages", change);
                        if (change.type === 'removed') {
//        deleteMessage(change.doc.id);
                        } else {
                            var message = change.doc.data();
                            message.id = change.doc.id;

                            if (self.debug)
                                console.log("message", message);

//                        self.displayMessage(message.id, message.timestamp, message.name, message.text, message.profilePicUrl, message.imageUrl, message.fecha, message);
                            self.displayMessage(message);
                            wnwUtils.setHoursMsg(".fecha", true);

                            if (typeof roomsArrayMsg[message.room] !== "undefined") {
                                roomsArrayMsg[message.room].push(message);
                            }
                        }
                    });
                }
                self.loadedMessages = true;
                self.loadMessagesOnLoad = true;
            });
        });
    },
//    displayMessage: function (id, timestamp, name, text, picUrl, imageUrl, fecha) {
    displayMessage: function (message) {
        var self = this;
        var id = message.id;
        var timestamp = message.timestamp;
        var name = message.name;
        var text = message.text;
        var picUrl = message.profilePicUrl;
        var imageUrl = message.imageUrl;
        var fecha = message.fecha;
        var userName = message.userName;
        var tipo = message.tipo;

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
        div.querySelector('.name').textContent = name;
        div.querySelector('.fecha').textContent = fecha;
        div.querySelector('.fecha').setAttribute("data-date", fecha);
        var messageElement = div.querySelector('.message');
        var textResponse = "";
        var typeMessage = "text";

        if (text) {
            if (text.indexOf("youtube.com") !== -1) {
                var idyoutu = wnwUtils.getGET(text);
                text = '<iframe class="player_iframe_youtube" width="560" height="315" src="https://www.youtube.com/embed/' + idyoutu.v + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                messageElement.innerHTML = text;
                typeMessage = "video_youtube";
            } else
            if (text.indexOf(".mp4") !== -1) {
                text = '<video class="player_video" src="' + text + '" controls=""></video>';
                messageElement.innerHTML = text;
                typeMessage = "video_mp4";
            } else
            if (text.indexOf(".mp3") !== -1 || text.indexOf(".wav") !== -1) {
                text = '<audio class="player_audio" src="' + text + '" controls=""></audio>';
                messageElement.innerHTML = text;
                typeMessage = "video_mp3";
            } else {
//                if (text.indexOf("/nwlib6/css/emoji/gifs/") === -1) {
//                    text = wnwEmoji.replaceEmojis(text, true);
//                }

                var sp = text.split("|");
                if (typeof sp[1] !== "undefined") {
                    text = sp[1];
                    textResponse = sp[0];
//                        messageElementResponse.innerHTML = "<div class='containResponseChat'>" + sp[0] + "</div>";
                }

                typeMessage = "text";
                var haveUrl = wnwUtils.haveUrlString(text);


                if (haveUrl === true) {
                    var encodeUri = false;
                    var clean = false;
                    text = wnwUtils.renderHTML(text, encodeUri, clean);
//                    text = wnwUtils.strip(text);
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
//                        messageElement.innerText = text;
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
        } else
        if (imageUrl) {
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
                        nw.console.log("1:::: " + device.platform.toUpperCase());
                        if (device.platform.toUpperCase() === 'ANDROID') {
                            navigator.app.loadUrl(url, {openExternal: true});
                            e.preventDefault();
                        } else
                        if (device.platform.toUpperCase() === 'IOS') {
                            try {
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
            messageElement.appendChild(image);

            typeMessage = "image";
            text = imageUrl + '&' + new Date().getTime();
        }

        var da = document.createElement("div");
        da.className = "optionsMessage";
        messageElement.prepend(da);

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

        var d = document.createElement("i");
        d.className = "material-icons chat_others_options_msg arrow_back_chat";
        d.innerHTML = "reply";
        d.data = {
            text: text + " > " + name + " - " + fecha,
            messageElement: messageElement,
            typeMessage: typeMessage,
            message: message
        };
        d.onclick = function (event) {
            event.preventDefault();
            var data = this.data;
            if (data.typeMessage === "image") {
                data.text = "<img class='imgTypeResponse' onclick='javascript: window.open(this.src, \"_BLANK\")' onload='javascript: wnw.messageListElement.scrollTop = wnw.messageListElement.scrollHeight' src='" + data.text + "' />";
            }
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
        };
        da.appendChild(d);

        var d = document.createElement("i");
        d.className = "material-icons keyboard_arrow_down_chat";
        d.innerHTML = "keyboard_arrow_down";
        d.data = {
            text: text + " > " + name + " - " + fecha,
            messageElement: messageElement,
            typeMessage: typeMessage,
            message: message
        };
        d.onclick = function (event) {
            event.preventDefault();
            var data = this.data;
            var links = [
                {
                    text: "Responder",
                    callback: function () {
                        console.log("data", data);
                        if (data.typeMessage === "image") {
                            data.text = "<img class='imgTypeResponse' onclick='javascript: window.open(this.src, \"_BLANK\")' onload='javascript: wnw.messageListElement.scrollTop = wnw.messageListElement.scrollHeight' src='" + data.text + "' />";
                        }
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
                    }
                }
            ];
            links.push(
                    {
                        text: "Copiar",
                        callback: function () {
//                            console.log("data", data);
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
            if (typeof data.message.info !== "undefined" && data.message.info !== null && data.message.info !== "") {
                links.push(
                        {
                            text: "Info",
                            callback: function () {
                                console.log("data", data);
                                console.log("data.message.info", data.message.info);
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
                                console.log("data", data);
                                functionMoreInfoChat(data);
                            }
                        }
                );
            }
//            wnwUtils.menuFloat(this, links);
            wnwUtils.menuFloat(messageElement, links);
        };
        da.appendChild(d);
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

        div.classList.add('visible');

        var isMe = false;

        if (message.name === self.setUserName) {
            isMe = true;
        }

//        console.log("self.loadedMessages", self.loadedMessages);
//        console.log("isMe", isMe);

        if (self.loadedMessages && !isMe) {
            self.showBtnNewMessage();
        } else {
            self.removeBtnNewMessage();
            self.messageListElement.scrollTop = self.messageListElement.scrollHeight;
            if (!wnwUtils.isMobile()) {
                self.messageInputElement.focus();
            }
        }

    },
    createAndInsertMessage: function (id, timestamp, name, message) {
//        console.log("message", message)
        var self = this;
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
            $(div).addClass("messagechat_id_row_" + id_user);
            $(div).addClass("messagechat_username_row_" + usc);
        } else {
            wnwUtils.addClass(div, "messagechat_id_row_" + id_user);
            wnwUtils.addClass(div, "messagechat_username_row_" + usc);
        }

//        timestamp = timestamp ? timestamp.toMillis() : Date.now();
        timestamp = wnwUtils.toTimestamp(timestamp);
        div.setAttribute('timestamp', timestamp);

        var existingMessages = self.messageListElement.children;
        if (existingMessages.length === 0) {
            self.messageListElement.appendChild(div);
        } else {
            if (existingMessages.length > 10) {
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
                value += encodeURI(valend);
            } else {
                value += self.messageInputElement.value;
            }

//            value = unescape(encodeURIComponent(value));
//            value = encodeURIComponent(value);
//            value = encodeURI(value);
//            console.log("value", value);

            wnwUtils.remove(".message-form-response");
            self.resetMaterialTextfield(self.messageInputElement);
            self.toggleButton();


            var m = {};
            m.tipo = "saveMessageChat";
            m.message = decodeURIComponentSafe(value);
            m.room = self.room;
            m.roomNameData = self.nameData;
            m.sendFirstMessage = self.sendFirstMessage;
            m.setUserName = self.setUserName;
            m.setUserPhoto = self.setUserPhoto;
            if (self.callbackToSendMsg !== null && self.callbackToSendMsg !== false) {
                self.callbackToSendMsg(m);
            }

            self.saveMessage(value).then(function () {
                self.msgResponse = "";
                if (self.debug)
                    console.log("value", value);

                var m = {};
                m.tipo = "saveMessageChat";
                m.message = decodeURIComponentSafe(value);
                m.room = self.room;
                m.roomNameData = self.nameData;
                m.sendFirstMessage = self.sendFirstMessage;
                m.setUserName = self.setUserName;
                m.setUserPhoto = self.setUserPhoto;
                window.parent.postMessage(m, '*');

                if (typeof self.callbackToSendMsgAfter !== "undefined") {
                    if (self.callbackToSendMsgAfter !== null && self.callbackToSendMsgAfter !== false) {
                        self.callbackToSendMsgAfter(m);
                    }
                }

                self.sendFirstMessage = true;

                if (self.saveToken === true) {
                    var a = {};
                    a.title = self.getUserName();
                    a.sound = "default";
                    a.data = "fcm_push_icon";
                    a.icon = self.getProfilePicUrl();
                    a.callback = "/nwlib6/nwproject/modules/webrtc/v6/chat/openWindowChat.php?url={" + self.domainSrv + "/chat/index.html}";
                    a.body = decodeURIComponentSafe(value);

                    self.loadTokens(function (rta) {
                        for (var i = 0; i < rta.length; i++) {
                            var tokenSend = rta[i].token;
                            if (self.token != tokenSend) {
                                a.to = rta[i].token;
//                                a.key = 'AAAAGdlePaM:APA91bHRnSqVwY6_DJaJ7jIyAXI8k8eoMx2j59qDbtsll4sw4G0vR-FpfB3uUe0GRQ-_pYmzYfu1BDbHHVI4n85D5JZBcbfAd19YOjCuwfJ8LN0Giy06V1QOVb8lK-InpbEztUyWK2im';
                                self.sendNotificacion(a, function (res) {
//                                    console.log("res", res);
                                });

//                                a.key = "AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss";
////                                a.key = "BNn1wnd0LPrUIU5V94l2T41_jtxtbGlJN_3vWwKTkknGZyIyQ6jR4BgHDjGC0n3GE92_cxFPkC0CjZXNyCLW9IU";
////                                a.key = "BLrbCMas2Gk8uPEVTGk-mElkF4izcWVx1Jg8zF7clL_aen_GtqJdO7d5gejgBg9v7Wqs1ysIb__bHThS8eSsi9s";
//                                a.to = "eDUwln00Z_w:APA91bFMja8gtti5q5067MrPFauINyxsU0LlVh1gGSDDCqW_8-bEQrcJLz03mULT9Zh34aJl2e-_aai1rWaIzS_Q4CgHpBSdEiw1JBOxKTIJ-BoAGzf5AgM36eGq15bY7c76Est5mD-E";
//                                self.sendNotificacion(a, function (res) {
//                                    console.log("res ahhhhh", res);
//                                });
                            }
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
        console.log("event", event)
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
        console.log("file", file)
        var name = file.name;
        if (wnwUtils.evalueData(namefile)) {
            name = namefile;
        }
        console.log("name", name)
        console.log("self.imageFormElement", self.imageFormElement)
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
                            imageUrl: url,
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
        var self = this;
        var host = window.location.hostname;
        var key = 'AAAAGdlePaM:APA91bHRnSqVwY6_DJaJ7jIyAXI8k8eoMx2j59qDbtsll4sw4G0vR-FpfB3uUe0GRQ-_pYmzYfu1BDbHHVI4n85D5JZBcbfAd19YOjCuwfJ8LN0Giy06V1QOVb8lK-InpbEztUyWK2im';
        if (typeof cordova !== "undefined") {
            if (host === "localhost" && cordova.platformId === "browser") {
                key = 'AAAAl-vlxN8:APA91bHK4teqcx8RJaoG_iCpfwA5RYa-pO4_pXniZtb0YMpI-EYibdFImiFsGjypYWOrwpIWlj_HOqgO5sahF9jEbfM0XAsBJkJjG7gx9x1KxjXVZNDIn1wq3tDOYilbtrFi3qoXumzY';
            }
        }
//        key = "AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss";
//        key = "BNn1wnd0LPrUIU5V94l2T41_jtxtbGlJN_3vWwKTkknGZyIyQ6jR4BgHDjGC0n3GE92_cxFPkC0CjZXNyCLW9IU";
        if (typeof array.key !== "undefined") {
            key = array.key;
        }
        var to = array.to;
        var notification = {
            'title': array.title,
            'body': array.body,
            'icon': array.icon,
            'others': {
                room_clean: self.room,
                room: self.nameData,
                id: self.getUserID(),
                email: self.getUserMail()
            },
            'click_action': array.callback
        };
        fetch('https://fcm.googleapis.com/fcm/send', {
            'method': 'POST',
            'headers': {
                'Authorization': 'key=' + key,
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify({
                'notification': notification,
                'to': to,
            })
        }).then(function (response) {
            callback(response);
        }).catch(function (error) {
            console.error(error);
        });
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
        return true;
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