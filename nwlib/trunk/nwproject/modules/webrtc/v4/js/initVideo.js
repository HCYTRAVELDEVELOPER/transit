modeCallingVoice = false;

if (document.readyState !== 'loading') {
    validaAllReady();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        start();
    });
}

function start() {

    version = document.body.getAttribute("data-version");
//        dom = 'meet.gruponw.com';
    dom = 'meet2.gruponw.com';
//        dom = 'meet.ringow.com';
    if (version === "2") {
        dom = 'meet2.gruponw.com';
//        dom = 'meet1.gruponw.com';
//        dom = 'meet1.ringow.com';
    } else
    if (version === "3") {
        dom = 'meet3.gruponw.com';
//        dom = 'meet1.ringow.com';
    }

    loadJs("https://" + dom + "/external_api.js", function () {
        var get = getGET();
        var up = getUserData();
        var host = window.location.host;
        var protocol = window.location.protocol;

        usePrejoinPageJitsi = true;

        contain = document.querySelector(".containerInit");
        startWithVideoMuted = false;
        startWithAudioMuted = false;
        room = document.body.getAttribute("data-room");
        startName = document.body.getAttribute("data-name");
        foto = document.body.getAttribute("data-photo");
        email = document.body.getAttribute("data-email");
        terminal = document.body.getAttribute("data-terminal");
        fileRecordingsEnabled = JSON.parse(document.body.getAttribute("data-fileRecordingsEnabled"));
        urlend = document.body.getAttribute("data-urlend");
        mosaico = document.body.getAttribute("data-mosaico");
        jwt = document.body.getAttribute("data-jwt");
        moderator = document.body.getAttribute("data-moderator");

        if (moderator == "SI") {
            moderator = true;
        } else {
            moderator = false;
        }

        if (typeof up.nombre !== "undefined") {
            startName = up.nombre;
        }
        if (typeof up.foto_perfil !== "undefined") {
            foto = protocol + "//" + host + "/" + up.foto_perfil;
        }
        if (typeof up.email !== "undefined") {
            email = up.email;
        }
        if (typeof up.terminal !== "undefined") {
            terminal = up.terminal;
        }
        if (typeof get.terminal !== "undefined") {
            terminal = get.terminal;
        }

        if (startName === "" || startName === null) {
            startName = "Invitado";
        }
        if (email === "" || email === null) {
            email = "invitado@nw.com";
        }
        if (foto === "" || foto === null) {
            foto = "";
        }

        if (usePrejoinPageJitsi === true) {
            //videollamada directa
            //muestra opciones antes de abrir videollamada con jitsi
            contain.remove();
            document.body.style.backgroundImage = "none";
            openConference();
        } else {
            //muestra opciones antes de abrir videollamada
            openOptions();
        }
//        askErrorDiag("Error");
    }, true);
}


function openOptions() {

    if (typeof up !== "undefined") {
        if (typeof up.empresa !== "undefined") {
            if (up.empresa === "108") {
                openConference();
                contain.remove();
                document.body.style.backgroundImage = "none";
                return false;
            }
        }
    }


    video = document.getElementById('video');
    constraints = {
        audio: true,
        video: true
    };

    playCamera();

    nameInput = document.createElement("input");
    nameInput.className = "input input_name";
    nameInput.placeHolder = "Nombre";
    nameInput.value = startName;
    contain.appendChild(nameInput);

    containBtns = document.createElement("div");
    containBtns.className = "containBtns";
    contain.appendChild(containBtns);

    audioOn = document.createElement("button");
    audioOn.className = "btn audio_on";
    audioOn.innerHTML = "<i class='material-icons'>mic</i>";
    audioOn.onclick = function () {
        startWithAudioMuted = true;
        audioOn.style.display = "none";
        audioOff.style.display = "block";
        window.localStorage.setItem("videoCallAudioOn_" + room, "false");
    };
    containBtns.appendChild(audioOn);

    audioOff = document.createElement("button");
    audioOff.className = "btn audio_on";
    audioOff.innerHTML = "<i class='material-icons'>mic_off</i>";
    audioOff.style = "display:none;";
    audioOff.onclick = function () {
        startWithAudioMuted = false;
        audioOn.style.display = "block";
        audioOff.style.display = "none";
        window.localStorage.setItem("videoCallAudioOn_" + room, "true");
    };
    containBtns.appendChild(audioOff);

    if (typeof window.localStorage.getItem("videoCallAudioOn_" + room) !== "undefined") {
        if (window.localStorage.getItem("videoCallAudioOn_" + room) === "false") {
            startWithAudioMuted = true;
            audioOn.style.display = "none";
            audioOff.style.display = "block";
        }
    }

    videoOn = document.createElement("button");
    videoOn.className = "btn video_on";
    videoOn.innerHTML = "<i class='material-icons'>videocam</i>";
    videoOn.onclick = function () {
        validaStreamCamera(function () {
            offCamera();
        });
        window.localStorage.setItem("videoCallCameraOn_" + room, "false");
    };
    containBtns.appendChild(videoOn);

    videoOff = document.createElement("button");
    videoOff.className = "btn video_on";
    videoOff.innerHTML = "<i class='material-icons'>videocam_off</i>";
    videoOff.style = "display:none;";
    videoOff.onclick = function () {
        startWithVideoMuted = false;
        playCamera();

        videoOn.style.display = "block";
        videoOff.style.display = "none";
        window.localStorage.setItem("videoCallCameraOn_" + room, "true");
    };
    containBtns.appendChild(videoOff);

    if (typeof window.localStorage.getItem("videoCallCameraOn_" + room) !== "undefined") {
        if (window.localStorage.getItem("videoCallCameraOn_" + room) === "false") {
            validaStreamCamera(function () {
                offCamera();
            });
        }
    }

    var btn = document.createElement("button");
    btn.className = "unirse";
    btn.innerHTML = "Unirme a la videollamada";
    btn.onclick = function () {
        enterTo();
    };
    contain.appendChild(btn);
}

function enterTo() {
    contain.innerHTML = "<div class='cEftVf'></div>";
    startName = nameInput.value;
    openConference();

    setTimeout(function () {
        contain.remove();
        document.body.style.backgroundImage = "none";
    }, 20000);
}
function validaStreamCamera(callback) {
    if (typeof localstream === "undefined") {
        setTimeout(function () {
            validaStreamCamera(callback);
        }, 500);
    } else {
        callback();
    }
}
function offCamera() {
    localstream.getVideoTracks()[0].stop();
    startWithVideoMuted = true;
    videoOn.style.display = "none";
    videoOff.style.display = "block";
}
function playCamera() {
    try {
        navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
            localstream = mediaStream;
            video.srcObject = mediaStream;
        }).catch(function (err) {
            console.log("error", err);
            askErrorDiag(err);
        });
    } catch (e) {
        console.log(e);
        askErrorDiag(e);
    }
}

function getUserData() {
    return localStorage;
}

function askErrorDiag(msg) {

    containDiag = document.createElement("div");
    containDiag.className = "containDiag";
    document.body.appendChild(containDiag);

    containDiagInt = document.createElement("div");
    containDiagInt.className = "containDiagInt";
    containDiag.appendChild(containDiagInt);

    var close = document.createElement("div");
    close.innerHTML = "<i class='material-icons materialClose'>close</i>";
    close.className = "containCloseDiag";
    close.onclick = function () {
        containDiag.remove();
    };
    containDiagInt.appendChild(close);

    if (typeof msg !== "undefined" && msg !== false && msg !== null && msg !== "") {
        var men = document.createElement("div");
        men.innerHTML = "Se ha presentado una novedad: " + msg;
        men.className = "containMenDiag";
        containDiagInt.appendChild(men);
    }

    dia = document.createElement("iframe");
    dia.src = "https://app.ringow.com/app/tester-hard/test-page/index.html";
    dia.className = "frameDiags";
    containDiagInt.appendChild(dia);
    dia.setAttribute("allowusermedia", "allowusermedia");
    dia.setAttribute("allow", "feature_name allow_list");
//    dia.setAttribute("allow", "camera *;microphone *");

}



function openConference() {
    var h = document.querySelector("html").offsetHeight;
    var container = document.querySelector('#jitsi-container');
    var domain = dom;
    var host = window.location.host;
    var isccb = false;
    if (host === "192.168.10.19" || host === "localhost" || host === "localhost:8383") {
        isccb = true;
    }
    if (host === "ccb.gruponw.com" || host === "www.ccb.gruponw.com" || host === "asesoriasvirtuales.ccb.org.co" || host === "www.asesoriasvirtuales.ccb.org.co") {
        isccb = true;
    }

    var interfaceConfigOverwrite = {filmStripOnly: false};

    console.log("version", version);
    if (version === "2" || version === "3") {
//        interfaceConfigOverwrite.TOOLBAR_BUTTONS = [
////                "chat",
//            "microphone",
//            "camera", "desktop",
//            "closedcaptions", "security", "embedmeeting",
//            "fullscreen", "fodeviceselection",
//            "profile",
//            "hangup",
//            "recording",
//            "participants-pane",
//            "livestreaming",
//            "etherpad", "sharedvideo", "settings", "raisehand",
//            "videoquality", "filmstrip", "feedback", "stats",
//            "shortcuts", "tileview", "select-background",
//            "download", "help", "shareaudio", "mute-everyone",
//            "mute-video-everyone"
//        ];
        interfaceConfigOverwrite.TOOLBAR_BUTTONS = [];
//        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("chat");
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("microphone");
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("camera");
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("desktop");

        // andresf 2023 se agrega la opción de invitar por celular
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("invite");

        if (!isccb) {
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("embedmeeting");
        }
        if (!isccb) {
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("security");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("closedcaptions");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("fullscreen");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("profile");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("settings");
        }
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("fodeviceselection");
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("raisehand");
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("hangup");
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("profile");
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("participants-pane");
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("videoquality");
        if (!isccb) {
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("filmstrip");
        }
        if (!isccb) {
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("feedback");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("stats");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("shortcuts");
        }
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("tileview");
        interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("select-background");
        if (!isccb) {
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("download");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("help");
        }
        if (!isccb) {
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("mute-video-everyone");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("mute-everyone");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("shareaudio");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("recording");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("etherpad");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("livestreaming");
            interfaceConfigOverwrite.TOOLBAR_BUTTONS.push("sharedvideo");
        }
    }
    console.log("moderator", moderator);
    var options = {
        roomName: room,
        width: "100%",
        parentNode: container,
        height: h,
        moderator: moderator,
        interfaceConfigOverwrite: interfaceConfigOverwrite,
        configOverwrite: {
            remoteVideoMenu: {
                disableKick: false
            },
            useNewBandwidthAllocationStrategy: true,
            startBitrate: "800",
            disableAudioLevels: false,
            stereo: false,
            forceJVB121Ratio: -1,
            enableTalkWhileMuted: true,
            mouseMoveCallbackInterval: 1000,
            enableNoAudioDetection: true,
            enableNoisyMicDetection: true,
            enableClosePage: true,
            disableLocalVideoFlip: false,
            transcribingEnabled: true,
            startAudioMuted: 9,
            startVideoMuted: 9,
            prejoinPageEnabled: usePrejoinPageJitsi,
            openBridgeChannel: true,
            enableForcedReload: true,
            liveStreamingEnabled: true,
            fileRecordingsServiceEnabled: true,
            fileRecordingsServiceSharingEnabled: true,
            requireDisplayName: true,
            enableWelcomePage: true,
            fileRecordingsEnabled: fileRecordingsEnabled,
            startWithVideoMuted: startWithVideoMuted,
            startWithAudioMuted: startWithAudioMuted,
            startScreenSharing: false
        },
        userInfo: {
            email: email,
            displayName: startName
        }
    };
    options.jwt = jwt;
    api = new JitsiMeetExternalAPI(domain, options);

    api.addEventListener("videoConferenceJoined", function () {
        api.executeCommand('subject', 'Sala de trabajo');
        api.executeCommand('avatarUrl', foto);
        api.executeCommand('displayName', startName);
        api.executeCommand("fileRecordingsEnabled", fileRecordingsEnabled);
    });
//    api.executeCommand('subject', 'Sala de trabajo');
//    api.executeCommand('displayName', startName);
//    api.executeCommand("fileRecordingsEnabled", fileRecordingsEnabled);

    var host = window.location.host;

    var fram = api.getIFrame();
    fram.onload = function () {
        var divcall = false;
        var divtablet = false;
        var div = document.createElement('div');
        div.className = 'btn_chatNw';
        if (version === "2" || version === "3") {
            div.className = 'btn_chatNw btn_chatNw_vers';
            div.innerHTML = "<i class='material-icons'>chat</i>";

//            if (host === "localhost" || host === "localhost:8383" || host === "app.taskenter.com" || host === "test.taskenter.com" || host === "taskenter.com") {
            divtablet = document.createElement('div');
            divtablet.className = 'btn_divtabletNw divtabletNw_vers';
            divtablet.innerHTML = "<i class='material-icons'>format_shapes</i>";

            divcall = document.createElement('div');
            divcall.className = 'btn_callNw divCallNw_vers';
            divcall.innerHTML = "<i class='material-icons'>call</i>";
//            }
        }

        var divH = document.createElement('div');
        divH.className = 'chat-header';
        divH.innerHTML = '<div class="chat-close"><div class="jitsi-icon "><svg height="24" width="24" viewBox="0 0 24 24"><path d="M18.984 6.422L13.406 12l5.578 5.578-1.406 1.406L12 13.406l-5.578 5.578-1.406-1.406L10.594 12 5.016 6.422l1.406-1.406L12 10.594l5.578-5.578z"></path></svg></div></div>';
        var iframechat = document.createElement('iframe');
        iframechat.className = "chatNw";
        iframechat.scrolling = "no";
        var usfoto = "";
        if (foto != "") {
            usfoto = "&setUserPhoto=" + foto;
        }
        var usid = "";
        if (typeof window.localStorage.getItem("idUserChatFrame_" + room) !== 'undefined' && window.localStorage.getItem("idUserChatFrame_" + room) !== null) {
            usid = window.localStorage.getItem("idUserChatFrame_" + room);
        } else {
            usid = Math.floor(Math.random() * (900 - 1)) + 1;
            window.localStorage.setItem("idUserChatFrame_" + room, usid);
        }
        iframechat.src = "/nwlib6/nwproject/modules/webrtc/v6/chat/index.html?room=" + room + "&setUserID=" + usid + "&saveToken=false&setUserName=" + startName + usfoto + "&terminal=" + terminal;
        divH.onclick = function () {
            iframechat.classList.remove("showChatNw");
            divH.classList.remove("showChatNw");
        };
        div.onclick = function () {
            iframechat.classList.add("showChatNw");
            divH.classList.add("showChatNw");
        };
        var body = document.querySelector('body');
        body.appendChild(div);

        if (divtablet !== false) {
            selfevent = null;
            divtablet.onclick = function () {
                if (selfevent == null) {
                    selfevent = document.createEvent('Event');
                    selfevent.initEvent('connect_dashboard');
                    document.addEventListener("response_dashboard", function (rta) {
                        var js = JSON.parse(localStorage["dashboard"]);
                        console.log(js);
                    });
                }
                document.dispatchEvent(selfevent);
                var r = {};
                r.tipo = "initEventConnectDashboard";
                window.parent.postMessage(r, '*');
            };
            body.appendChild(divtablet);
        }

        if (divcall !== false) {
            divcall.onclick = function () {
                initCallVoice();
//                var person = prompt("Ingrese el número de teléfono en formato E.164:", "(ej. +31201234567)");
//                if (person == null || person == "") {
//                    alert("El usuario canceló el aviso.");
//                } else {
//                    alert("Se iniciará la llamada al número " + person + "");
//
//                    api.invite([{
//                            type: 'phone',
//                            number: person
//                        }]).then((r) => {
//                        console.log("success ", person, r);
//                    }).catch((er) => {
//                        console.log("failure", er);
//                    });
//
//                    var r = {};
//                    r.numero = person;
//                    r.tipo = "initEventCall";
//                    window.parent.postMessage(r, '*');
//                }
            };
            body.appendChild(divcall);
        }
        body.appendChild(divH);
        body.appendChild(iframechat);

        api.addListener('readyToClose', () => {
//            alert("CLOSE");
            var r = {};
            r.tipo = "close_videocall_nw2";
            window.parent.postMessage(r, '*');
        });

        var r = {};
        r.tipo = "init_videocall_nw2";
        window.parent.postMessage(r, '*');

        api.on("participantJoined", (object) => {
//            alert("JOIN")
            console.log("object", object);
//            join(object.id)

            var mode = "normal";
            if (modeCallingVoice === true) {
                mode = "call_voice";
            }
            object.mode_join = mode;

            var r = {};
            r.object = object;
            r.tipo = "participantJoined";
            window.parent.postMessage(r, '*');

        });

    };

    if (urlend !== "") {
        api.addEventListener("readyToClose", function () {
            window.open(urlend, '_parent');
        });
    }

    if (mosaico === "true")
        api.executeCommand('toggleTileView');

    if (host === "192.168.10.19" || host === "localhost" || host === "localhost:8383" || host === "app.taskenter.com" || host === "test.taskenter.com" || host === "taskenter.com") {
        console.log("Run firebase in");
        appTask.init();
    }
}


function getGET(url) {
    var loc = document.location.href;
    if (typeof url !== "undefined") {
        loc = url;
    }
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

function loadJs(url, callBack, async) {
    try {
        var asyncText = "async";
        if (typeof async === "undefined") {
            async = true;
        }
        if (!async) {
            asyncText = "";
        }
        var id = url.replace(/\//gi, "");
        id = id.replace(/\:/gi, "");
        id = id.replace(/\?/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\./gi, "");
        id = id.replace(/\,/gi, "");
        id = id.replace(/\&/gi, "");
        id = id.replace(/\=/gi, "");
        id = id.replace(/\_/gi, "");
        id = id.replace(/\-/gi, "");
        id = id.replace(/\</gi, "");
        id = id.replace(".", "");
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = id;
        script.className = id;
        script.charset = "UTF-8";
        script.async = asyncText;
        script.src = url;
        var style = document.querySelector("." + id);
        if (!evalueData(style)) {
            script.onload = function () {
                if (evalueData(callBack)) {
                    callBack();
                }
            };
            if (async === true) {
                document.getElementsByTagName('head')[0].appendChild(script);
            } else {
                $("body").append(script);
            }
        } else {
            if (evalueData(callBack)) {
                callBack();
            }
        }
    } catch (e) {
        alert("error in loadJS", e);
    }
}

function evalueData(d, exception) {
    if (typeof d === "undefined") {
        return false;
    }
    if (d === undefined) {
        return false;
    }
    if (d === null) {
        return false;
    }
    if (d === "null") {
        return false;
    }
    if (d === false) {
        return false;
    }
    var permiteCero = true;
    if (typeof permiteCeroException !== "undefined") {
        if (permiteCeroException === false) {
            permiteCero = false;
        }
    }
    if (permiteCero) {
        if (d == false || d == null) {
            return false;
        }
    }

    if (d === "") {
        return false;
    }
    return true;
}

function initCallVoice(number) {

    if (typeof number == "undefined") {
        number = "(ej. +573125729272)";
    }
    var person = prompt("Ingrese el número de teléfono en formato E.164:", number);
    if (person == null || person == "") {
//        alert("Llamada cancelada.");
    } else {
//        alert("Se iniciará la llamada al número " + person + "");
        console.log("person", person.length);
        if (person.length < 10) {
            alert("El número " + person + " es inválido");
            return false;
        }

        modeCallingVoice = true;

        api.invite([{
                type: 'phone',
                number: person
            }]).then((r) => {
            console.log("success ", person, r);
            setTimeout(function () {
                modeCallingVoice = false;
            }, 1000);
        }).catch((er) => {
            console.log("failure", er);
        });

        var r = {};
        r.numero = person;
        r.tipo = "initEventCallVoice";
        window.parent.postMessage(r, '*');
    }
}


window.addEventListener('message', function (e) {
    if (typeof e.data !== "undefined") {
        var r = e.data;
//        console.log("r.tipo", r.tipo);
        if (r.tipo === "initCallVoice") {
            initCallVoice(r.celular);
//            var el = document.querySelector('.divCallNw_vers');
//            if (el) {
//                el.click();
//            }
        } else
        if (r.tipo === "kickParticipant") {
            console.log("r.participantID", r.participantID);
//            api.executeCommand('rejectParticipant', {participantId: r.participantID, mediaType: "audio"});
//            api.executeCommand('kickParticipant', {participantID: r.participantID});
            api.executeCommand('kickParticipant', r.participantID);
//            alert("rejectParticipant");
        }
    }
});


