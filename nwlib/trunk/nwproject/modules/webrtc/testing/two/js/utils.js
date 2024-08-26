/* global getChat */

var debug = true;
var tabVisible = "hidden";
var __configRingow = null;
var interval = null;
var interval2 = null;
var streamAudio = null;
var time = 0;
var callfinish = false;
$(document).ready(function () {
    var get = urlGET();
    var agent = navigator.userAgent;
    var version = "";
    var r = "";
    if (agent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
        r = "Internet Explorer";
        alert("Lo sentimos, está utilizando Internet Explorer, no es compatible con la videollamada. Recomendamos usar Google Chrome, Mozilla, Opera.");
        return;
    } else
    if (agent.indexOf('Firefox') !== -1) {
        r = "Firefox";
    } else
    if (agent.indexOf('Chrome') !== -1) {
        r = "Google Chrome";
        version = agent.split("Chrome/")[1];
        version = version.split(" ")[0];
        version = version.split(".")[0];
        if (parseInt(version) < 28) {
            var mensaje = "La versión " + version + " de Chrome que tienes está obsoleta. Actualiza tu navegador para un mejor rendimiento.";
            getDataErrorMaker(mensaje);
            return;
        }
    } else
    if (agent.indexOf('Opera') !== -1) {
        r = "Opera";
    } else {
        r = "Navegador no identificado ...";
    }
    createBoxSend();
    prepareActionsButtons();
    chatGetMessages();
    if (getChat === true) {
        getStatus();
        var activetime = false;
        if (typeof get.useinapp === "undefined") {
            activetime = true;
        } else {
            activetime = false;
        }
        if (typeof get.usarPlantillas !== "undefined") {
            activetime = false;
        }
        if (activetime === true) {
            interval = setInterval(function () {
                getStatus();
            }, 10000);
        }
    }
    if (getChat === false) {
        time = document.querySelector(".timetrans").innerHTML;
        changeTime();
        interval2 = setInterval(function () {
            changeTime();
        }, 1000);

        updateTime();
        interval3 = setInterval(function () {
            updateTime();
        }, 15000);
    }
});

function prepareActionsButtons() {
    var b = $(".cambiarStatus");
    if (b.length > 0) {
        b.click(function () {
            changeStatus(this);
        });
    }
    if (document.querySelector(".sendCorreo")) {
        document.querySelector(".sendCorreo").addEventListener("click", function () {
            sendCorreo();
        });
    }
}

function getStatus() {
    var get = urlGET();
    var data = {};
    data.id_enc = get.idCall;
    var rpc = {};
    rpc["service"] = "nwchat2";
    rpc["method"] = "getStatus";
    rpc["data"] = data;
    var func = function (ra) {
        if (!verifyErrorNwMaker(ra)) {
            return;
        }
        if (ra.size === 0 || ra.size === "0" || ra.row.estado === "LLAMADA_PERDIDA") {
            showMessageOffline();
            return;
        }
        if (ra.row) {
            if (ra.row.estado === "LLAMANDO") {
                if (evalueData(ra.row.fecha_inicio_llamada)) {
                    var fa = calcularTiempoDosFechas(ra.row.fecha_inicio_llamada, ra.row.fecha_ultima_interaccion_cliente);
                    if (ra.row.fecha_ultima_interaccion_operador === null && fa.minutes > 3) {
                        continueColgarChat("LLAMADA_PERDIDA");
                        clearInterval(interval);
                        return;
                    }
                }
            }
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function showMessageOffline() {
    var get = urlGET();
    callfinish = true;
    clearInterval(interval);
    if (typeof get.usarPlantillas !== "undefined") {
        sendMessage("one", "La llamada ha sido finalizada");
        session_regenerate_id(function () {
            closeBoxChat();
        });
    } else {
        cargaJs("/nwlib6/nwproject/modules/webrtc/testing/two/js/openForm/f_message_offline.js", function () {
            var d = new f_message_offline();
            d.constructor(false, function () {
                closeBoxChat();
            }, __configRingow);
        }, false, true);
        session_regenerate_id();
    }
}

function changeTime() {
    document.querySelector(".timetrans").innerHTML = time;
    time++;
}

function updateTime() {
    var get = urlGET();
    var data = {};
    data.id_enc = get.idCall;
    data.tiempo = time;
    var rpc = {};
    rpc["service"] = "nwchat2";
    rpc["method"] = "updateTime";
    rpc["data"] = data;
    var func = function (ra) {
        if (!verifyErrorNwMaker(ra)) {
            return;
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function openCallRingow(tipo) {
    var mode = "video";
    if (tipo === 1) {
        mode = "audio";
    }
    var url = getUrlVideoCallMyRingow(mode, "popup");
    window.open(url, "_blank");
    setTimeout(function () {
        openinWaitingCallRingow(mode, "popup");
    }, 1000);
}


function openinWaitingCallRingow(type, mode) {
    var get = urlGET();
    var domain = location.origin;
    var url = domain + "/nwlib6/nwproject/modules/webrtc/testing/two/inWaitingCall.php";
    url += "?term=" + get.term + "&iam=" + get.iam + "&received=" + get.received;
    url += "&apikey=" + get.apikey + "&mode=" + mode + "&type=" + type;
    window.location = url;
}

function getUrlVideoCallMyRingow(type, mode) {
    var get = urlGET();
    var domain = location.origin;
//    var url = domain + "/nwlib6/nwproject/modules/webrtc/testing/two/index.php";
//    url += "?t=" + get.term + ",op=" + get.iam + ",cli=" + get.received;
//    url += "&apikey=" + get.apikey + "&mode=" + mode + "&type=" + type;
    var rest = "?onlyAudio=true&callingAudio=true";
    if (type === "video") {
        rest = "?onlyVideo=true&callingVideo=true";
    }
//    var url = "/nwlib6/nwproject/modules/webrtc/v2/index.html?room=" + get.id_enc + ",terminal=" + get.term + ",apikey=" + get.apikey + "&video=" + video + "&audio=" + audio + "&usejoin=false&chat=true&openchat=true&myName=" + get.iam + "&heName=" + get.received;
    var url = "/ringowEmbed/" + get.term + "/" + get.apikey + rest;
    return url;
}
function getUrlVideoCallOtherRingow(type, mode) {
    var get = urlGET();
    var domain = location.origin;
    var url = domain + "/nwlib6/nwproject/modules/webrtc/testing/two/index.php";
    url += "?t=" + get.term + ",op=" + get.received + ",cli=" + get.iam;
    url += "&apikey=" + get.apikey + "&mode=" + mode + "&type=" + type;
    return url;
}

function getDataErrorMaker(mensaje, e) {
    getPermissionWebCam(function (rot) {
        var status = rot;
        if (typeof rot === "object") {
            status = rot.active;
        }
        var get = urlGET();
        var agent = navigator.userAgent;
        var error = "";
        error += "STATUS WEBCAM: " + status + " <br />";
        error += mensaje + " <br />";
        var version = "";
        var r = "";
        if (agent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
            r = "Internet Explorer";
        } else
        if (agent.indexOf('Firefox') !== -1) {
            r = "Firefox";
        } else
        if (agent.indexOf('Chrome') !== -1) {
            r = "Google Chrome";
            version = agent.split("Chrome/")[1];
            version = version.split(" ")[0];
            version = version.split(".")[0];
            r += " version " + version;
        } else
        if (agent.indexOf('Opera') !== -1) {
            r = "Opera";
        } else {
            r = "Navegador no identificado ...";
        }
        error += "language: " + navigator.language + ". <br />";
        error += "platform: " + navigator.platform + ". <br />";
        error += "DOMAIN: " + location.hostname + ". <br />";
        error += "URL: " + location.href + ". <br />";
        error += r + " - <br />";
        error += " Agent:" + agent + " - <br />";
        $.each(get, function (key, value) {
            error += key + ": " + value + ", <br />";
        });
        if (typeof e === "object") {
            $.each(e, function (key, value) {
                error += key + ": " + value + ", <br />";
            });
        } else {
            error += e;
        }
        console.log(e);
        console.log(error);
        nw_dialog(mensaje);
        sendErrorMaker(error, "videoconf", "1", false);
    });
}


function changeStatus(self) {
    var get = urlGET();
    var d = $(self).attr("data");
    var send = "type=" + d + "&idCall=" + get.idCall;
    var li = "/nwlib6/nwproject/modules/webrtc/testing/two/srv.php";
    var request = new XMLHttpRequest();
    request.open("POST", li, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(send);
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                window.location.reload();
            } else {
                console.error(request.statusText);
            }
        }
    };
    request.onerror = function (e) {
        console.error(request.statusText);
    };
}
function sendCorreo() {
    var correo = $(".boxCorreo").val();
    var nombreCorreo = $(".nombreCorreo").val();
    var micorreoCorreo = $(".micorreoCorreo").val();
    var url = window.location.href;
    var send = "correo=" + correo;
    send += "&nombreCorreo=" + nombreCorreo;
    send += "&micorreoCorreo=" + micorreoCorreo;
    send += "&url=" + url;
    var li = "/nwlib6/nwproject/modules/webrtc/testing/two/sendCorreo.php";
    var request = new XMLHttpRequest();
    request.open("POST", li, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(send);
    request.onload = function (e) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                alert("Mensaje enviado correctamente");
            } else {
                console.error(request.statusText);
            }
        }
    };
    request.onerror = function (e) {
        console.error(request.statusText);
    };
}
function urlGET() {
    var loc = document.location.href;
    var getString = loc.split('?')[1];
    if (getString === undefined) {
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

function orderAddVideo() {
    var d = $(".videoContainer");
    var t = d.length;
    $(".usersNumConecc").html(t);
    var w = 100 / t;
    if (t === 1) {
        d.css({"position": "fixed", "width": "100%", "height": "100%"});
        d.addClass("OnlyOneVideo");
    } else
    if (t > 1) {
        d.css({"position": "relative", "width": w + "%", "height": "500px"});
        d.removeClass("OnlyOneVideo");
    }
}

function removeVideo() {
    var d = $(".videoContainer");
    var t = d.length;
    $(".usersNumConecc").html(t);
    var w = 100 / t;
    if (t === 1) {
        d.css({"position": "fixed", "width": "100%", "height": "100%"});
        d.addClass("OnlyOneVideo");
    } else {
        d.css({"position": "relative", "width": w + "%", "height": "500px"});
        d.removeClass("OnlyOneVideo");
    }
}

function initChat() {
    if (getChat === true) {
        document.querySelector(".conectando").style.display = "none";
    }
    scrollToBottomMessages();
}

function showMessages() {
    document.querySelector("#messages").style.display = "block";
    scrollToBottomMessages();
    document.querySelector(".messageChat").focus();
}
function scrollToBottomMessages() {
    var s = $('.showMessagesChat')[0];
    var h = s.scrollHeight;
    var c = $('.showMessagesChat');
    c.scrollTop(h);
}

function closeChat() {
    $("#messages").fadeOut(0);
}

function openPageCredits() {
    var url = "https://www.ringow.com";
    window.open(url, "_blank");
}

function validateMsgEnd(msg, mode) {
    var get = urlGET();
    var g = msg.indexOf("La llamada ha sido finalizada");
    if (g !== -1) {
        document.querySelector(".boxSendChat").innerHTML = "<h2 class='textendcall'>Llamada finalizada.</h2>";
        document.querySelector(".encOptionsNwRtc").style.display = "none";
        var r = {};
        r.tipo = "restarCallRingow";
        r.mode = mode;
        r.classt = get.classt;
        window.parent.postMessage(r, '*');
    }
}

function colgarChat() {
    var params = {};
    params.html = '¿Desea finalizar la llamada?';
    params.onSave = function () {
        clearInterval(interval);
        continueColgarChat();
        return true;
    };
    params.no_buttons_enc = true;
    createDialogNw(params);
}

function continueColgarChat(estado) {
    var get = urlGET();
    var data = {};
    data.id_enc = get.idCall;
    data.terminal = get.term;
    if (typeof estado !== "undefined") {
        if (estado !== false) {
            data.estado = estado;
        }
    }
    var rpc = {};
    rpc["service"] = "nwchat2";
    rpc["method"] = "colgarChat";
    rpc["data"] = data;
    var func = function (ra) {
        if (!verifyErrorNwMaker(ra)) {
            return;
        }
        sendMessage("one", "La llamada ha sido finalizada");
        closeBoxChat();
    };
    rpcNw("rpcNw", rpc, func, true);
}

function session_regenerate_id(callback) {
    var data = {};
    var rpc = {};
    rpc["service"] = "nwchat2";
    rpc["method"] = "sessionRegenerateID";
    rpc["data"] = data;
    var func = function (ra) {
        if (!verifyErrorNwMaker(ra)) {
            return false;
        }
        if (typeof callback !== "undefined") {
            if (evalueData(callback)) {
                callback();
            }
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function closeBoxChat() {
    validateMsgEnd("La llamada ha sido finalizada", "one");
    endCall();
}

function leerTodos(update, padre) {
    var get = urlGET();
    var p = "";
    if (padre === "me") {
        p = ".containChat_two ";
    }
    var d = document.querySelectorAll(p + ".textLeido");
    var haynoleidos = "NO";
    for (var i = 0; i < d.length; i++) {
        var e = d[i];
        var k = e.innerHTML;
        if (k === "NO") {
            haynoleidos = "SI";
            e.innerHTML = "SI";
        }
    }
    if (haynoleidos === "SI" && update !== false) {
        var data = {};
        data.id_enc = get.idCall;
        data.terminal = get.term;
        data.myuser = get.iam;
        if (typeof get.usarPlantillas !== "undefined") {
            data.msgsinleer = "NO";
        }
        var rpc = {};
        rpc["service"] = "nwchat2";
        rpc["method"] = "readMessages";
        rpc["data"] = data;
        var func = function (ra) {
            if (!verifyErrorNwMaker(ra)) {
                return;
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}

function chatGetMessages() {
    var get = urlGET();
    var us = get.iam;
    var data = {};
    data.id_enc = get.idCall;
    data.terminal = get.term;
    data.myuser = us;
    if (typeof get.useinapp === "undefined") {
        data.isringow = true;
    }
    if (typeof get.usarPlantillas !== "undefined") {
        data.msgsinleer = "NO";
    }
    var rpc = {};
    rpc["service"] = "nwchat2";
    rpc["method"] = "consultaMessages";
    rpc["data"] = data;
    var func = function (ra) {
        console.log(ra);
        document.querySelector(".conectando").style.display = "none";
        if (!verifyErrorNwMaker(ra)) {
            return;
        }
        if (getChat === true) {
            if (ra === "noexisteusuario" || ra === "noexistellamada") {
                var r = {};
                r.tipo = "restarCallRingow";
                r.classt = get.classt;
                r.noclose = true;
                r.idCall = get.idCall;
                window.parent.postMessage(r, '*');

                nw_dialog("No existe la llamada.");
                document.querySelector("#messages").style.display = "none";
                return;
            }
        }
        __configRingow = ra.config;
        var c = __configRingow;
        /*para activar el timer de actividad*/
        var vs = false;
        if (c !== null) {
            if (typeof c.visitas_tiempo_real !== "undefined") {
                if (c.visitas_tiempo_real === "SI") {
                    vs = true;
                }
            }
        }
        /*
         if (typeof get.useinapp === "undefined" && c.visitas_tiempo_real !== "SI") {
         */
        if (typeof get.useinapp === "undefined" && !vs) {
            if (typeof ra.data_call !== "undefined") {
                if (typeof ra.data_call.estado !== "undefined") {
                    if (ra.data_call.estado !== "EN LINEA") {
                        var r = {};
                        r.tipo = "restarCallRingow";
                        r.classt = get.classt;
                        r.noclose = true;
                        r.idCall = get.idCall;
                        window.parent.postMessage(r, '*');
                    }
                }
            }
        }

        if (c !== null) {
            var g = document.createElement("div");
            g.innerHTML = "<style>.containChat_one .msg{background-color: " + c.color_principal + "}</style>";
            document.body.appendChild(g);
        }

        playSoundOne();
        var us = ra.myuser;
        var r = ra.rows;
        var t = r.length;
        r.reverse();
        for (var i = 0; i < t; i++) {
            var x = r[i];
            var tipo = "one";
            if (us !== x.usuario) {
                tipo = "two";
            }
            var blo = bodyMessage(x.texto, x.nombre_operador, tipo, x.fecha, x.leido, x.foto_usuario);
            $('.showMessagesChat').append(blo);
        }
        scrollToBottomMessages();
    };
    rpcNw("rpcNw", rpc, func, true);
}

function sendMessage(mode, message, user, userphoto) {
    var self = ".btnAttachmentInt";
    var get = urlGET();
    var data = getRecordNwForm(self);

    var photoget = false;
    if (typeof get.userphoto !== "undefined") {
        photoget = get.userphoto;
    }
    if (typeof userphoto === "undefined" && photoget !== false) {
        userphoto = photoget;
    }
    var date = getDateHour();
    var msg = data.mensaje;
    var nick = $("#miuserid").val();
    var type = "one";
    if (mode === "two") {
        type = "two";
    }
    if (typeof message !== "undefined") {
        if (message !== false && message !== null) {
            msg = message;
        }
    }
    if (typeof user !== "undefined") {
        if (user !== false && user !== null) {
            nick = user;
        }
    }
    if (typeof get.username_show !== "undefined") {
        nick = get.username_show;
    }
    var btms = document.querySelector(self + " .mensaje");
    if (btms)
        btms.focus();
    if (mode === "two") {
        playSoundTwo();
    } else {
        saveMsgSrv(msg);
    }
    var blo = bodyMessage(msg, nick, type, date, "NO", userphoto);
    $('.showMessagesChat').append(blo);

    validateMsgEnd(msg, mode);
    if (mode !== "two") {
        if (btms)
            btms.value = "";
    }
    scrollToBottomMessages();
    sendMessageRctnw("chat", blo, nick, msg, userphoto);
}

function saveMsgSrv(msg) {
    var get = urlGET();
    var date = getDateHour();
    playSoundOne();
    var data = {};
    if (typeof get.userphoto !== "undefined") {
        data.userphoto = get.userphoto;
    }
    if (typeof get.userphotorecibe !== "undefined") {
        data.userphotorecibe = get.userphotorecibe;
    }
    if (typeof get.username_show !== "undefined") {
        data.username_show = get.username_show;
    }
    if (typeof get.useinapp === "undefined") {
        data.msgsinleer = "SI";
    }
    data.mensaje = msg;
    data.id_enc = get.idCall;
    data.terminal = get.term;
    data.myuser = get.iam;
    data.usuario_recibe = get.received;
    data.fecha = date;
    data.bot_nombre = "";
    if (__configRingow !== null) {
        data.bot_nombre = __configRingow.bot_nombre;
    }
    data.domain = get.domain;
    data.href = get.href;
    data.get = get;
    data.config = __configRingow;
    var rpc = {};
    rpc["service"] = "nwchat2";
    rpc["method"] = "saveMessage";
    rpc["data"] = data;
    var func = function (r) {
        if (!verifyErrorNwMaker(r)) {
            return;
        }
        if (r === "llamadafinalizada" || r === "operators_offline") {
            closeBoxChat();
            return false;
        }
        if (r === "noexisteusuario") {
            nw_dialog("Ha ocurrido un error con su sesión");
        }
        if (typeof r === "object") {
            if (r.isbot === true && r.botmsg !== false) {
                if (r.botmsg === "operators_offline") {
                    setTimeout(function () {
                        showMessageOffline();
                    }, 2000);
                    return false;
                }
                sendMsgBot(r.botmsg, r.photo);
            }
        }
        scrollToBottomMessages();
    };
    rpcNw("rpcNw", rpc, func, true);
}

function sendMsgBot(msg, userphoto) {
    var get = urlGET();
    var nick = __configRingow.bot_nombre;
    if (typeof get.username_show !== "undefined") {
        nick = get.username_show;
    }
    setTimeout(function () {
        isWritten(nick, 2000);
        setTimeout(function () {
            sendMessage("two", msg, nick, userphoto);
        }, 2200);
    }, 1000);
}

borraescribe = false;
function isWritten(user, time) {
    if (typeof time === "undefined") {
        time = 300;
    }
    document.querySelector(".escribiendoNwRtc").innerHTML = user + " está escribiendo...";
    clearTimeout(borraescribe);
    borraescribe = setTimeout(function () {
        document.querySelector(".escribiendoNwRtc").innerHTML = "";
    }, time);
}

function playSoundOne() {
    document.querySelector(".usuario_sound").play();
}
function playSoundTwo() {
    document.querySelector(".operador_sound").play();
}

function convertText(txtData) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    txtData = txtData.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

    var urlRegex = /(\b(\swww).[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    txtData = txtData.replace(urlRegex, ' <a href="$1" target="_blank">$1</a>');

    var urlRegex = /(>\swww)/ig;
    txtData = txtData.replace(urlRegex, '>www');

    var urlRegex = /(\"\swww)/ig;
    txtData = txtData.replace(urlRegex, '"http://www');

    return txtData;
}

function bodyMessage(msg, nick, type, date, leido, foto_usuario) {
    msg = convertText(msg);
    var blo = '<div class="containChat containChat_' + type + '">';
    blo += '<div class="containChatInt">';
    blo += '<div class="nameNick">' + nick + '</div>';
    if (evalueData(foto_usuario)) {
        blo += '<div class="photoUser" style="background-image: url(' + foto_usuario + ');"></div>';
    }
    blo += '<div class="msg">' + msg + '</div>';
    blo += '<div class="date">' + date + '</div>';
    blo += '<div class="leido">Leído <span class="textLeido">' + leido + '</span></div>';
    blo += '</div>';
    blo += '</div>';
    return blo;
}


function soundOff() {
    $(".muteOff").fadeIn(0);
    $(".muteOn").fadeOut(0);
    webrtc.mute();
}
function soundOn() {
    $(".muteOff").fadeOut(0);
    $(".muteOn").fadeIn(0);
    webrtc.unmute();
}

function OnVideo() {
    $(".offCam").fadeOut(0);
    $(".onCam").fadeIn(0);
    /*
     webrtc.resume();
     */
    webrtc.resumeVideo();
}

function OffVideo() {
    $(".onCam").fadeOut(0);
    $(".offCam").fadeIn(0);
    /*
     webrtc.pause();
     */
    webrtc.pauseVideo();
}

function stopRecordingCallback() {
    var ur = URL.createObjectURL(recorder.getBlob());
    window.open(ur, '_blank');
    video.src = ur;
    video.play();
    recorder.camera.stop();
    recorder.destroy();
    recorder = null;
    endCall();
}
function seeRecording() {
    recorder.stopRecording(stopRecordingCallback);
}
function stopRecordingAudio() {
    /*
     recorderAudio.stopRecording(stopRecordingAudioCallback);
     document.querySelector(".containerButtons").style.display = "none";
     var text = "<h1>Guardando...</h1> <h2>No cierre la ventana, espere por favor hasta que complete la carga.</h2>";
     var css = "";
     css += "background: rgba(0, 0, 0, 0.7);";
     css += "color: #fff;";
     css += "z-index: 1000000000;";
     css += "position: fixed;";
     newLoading("body", text, css, "allWindow");
     endCall();
     */

    /*
     stopRecordingAudioCallback();
     */
    /*
     if (recorderAudio2 !== null) {
     console.log(recorderAudio2);
     setTimeout(function () {
     var internalRecorder2 = recorderAudio2.getInternalRecorder();
     stopRecordingAudioCallback(internalRecorder2);
     }, 2000);
     }
     */
}
function endCall() {
    webrtc.stopLocalVideo();
    webrtc.leaveRoom();
    webrtc.disconnect();
}

function captureMicrophone(callback) {
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function (microphone) {
        streamAudio = microphone;
        callback(microphone);
    }).catch(function (error) {
        var mensaje = "No se puede capturar tu micrófono. Revisa si tiene todos los permisos de audio.";
        getDataErrorMaker(mensaje, error);
    });
}
function stopRecordingAudioCallback() {
    var internalRecorder = recorderAudio.getInternalRecorder();
    var leftchannel = internalRecorder.leftchannel;
    var rightchannel = internalRecorder.rightchannel;
    mergeLeftRightBuffers({
        desiredSampRate: internalRecorder.desiredSampRate,
        sampleRate: internalRecorder.sampleRate,
        numberOfAudioChannels: internalRecorder.numberOfAudioChannels,
        internalInterleavedLength: internalRecorder.recordingLength,
        leftBuffers: leftchannel,
        rightBuffers: internalRecorder.numberOfAudioChannels === 1 ? [] : rightchannel
    }, function (buffer, view) {
        var file = new File([buffer], getFileName('mp3'), {
            type: 'audio/mp3'
        });
        var uri = URL.createObjectURL(file);
        var get = urlGET();
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            var base64data = reader.result;
            save(base64data);
        };
        console.log("Init saved audio");
        function save(blob) {
            var formData = new FormData();
            formData.append('image', blob);
            formData.append('idCall', get.idCall);
            formData.append('iam', get.iam);
            formData.append('received', get.received);
            formData.append('term', get.term);

            function reqListener() {
                newRemoveLoading("body");
                var params = {};
                params.html = 'Llamada finalizada y guardada correctamente';
                params.onSave = function () {
                    return true;
                };
                params.textAccept = 'Aceptar';
                params.no_cancel_button = true;
                params.no_buttons_enc = true;
                params.width = "auto";
                params.height = "auto";
                createDialogNw(params);
                console.log("End saved audio");
                console.log(this.responseText);
            }
            var xhr = new XMLHttpRequest();
            xhr.onload = reqListener;
            xhr.open("POST", "save.php", true);
            xhr.send(formData);
        }

    });
    recorderAudio.microphone.stop();
}

function getFileName(fileExtension) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var date = d.getDate();
    return 'RecordRTC-' + year + month + date + '-' + getRandomString() + '.' + fileExtension;
}
function getRandomString() {
    if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
        for (var i = 0, l = a.length; i < l; i++) {
            token += a[i].toString(36);
        }
        return token;
    } else {
        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    }
}

/*
 below two methods are copied from dev/StereoAudioRecorder.js
 just to explain how to process RAW PCM data
 */
function mergeLeftRightBuffers(config, callback) {
    function mergeAudioBuffers(config, cb) {
        var numberOfAudioChannels = config.numberOfAudioChannels;

        var leftBuffers = config.leftBuffers.slice(0);
        var rightBuffers = config.rightBuffers.slice(0);
        var sampleRate = config.sampleRate;
        var internalInterleavedLength = config.internalInterleavedLength;
        var desiredSampRate = config.desiredSampRate;

        if (numberOfAudioChannels === 2) {
            leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
            rightBuffers = mergeBuffers(rightBuffers, internalInterleavedLength);
            if (desiredSampRate) {
                leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
                rightBuffers = interpolateArray(rightBuffers, desiredSampRate, sampleRate);
            }
        }

        if (numberOfAudioChannels === 1) {
            leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
            if (desiredSampRate) {
                leftBuffers = interpolateArray(leftBuffers, desiredSampRate, sampleRate);
            }
        }

        if (desiredSampRate) {
            sampleRate = desiredSampRate;
        }

        function interpolateArray(data, newSampleRate, oldSampleRate) {
            var fitCount = Math.round(data.length * (newSampleRate / oldSampleRate));
            var newData = [];
            var springFactor = Number((data.length - 1) / (fitCount - 1));
            newData[0] = data[0];
            for (var i = 1; i < fitCount - 1; i++) {
                var tmp = i * springFactor;
                var before = Number(Math.floor(tmp)).toFixed();
                var after = Number(Math.ceil(tmp)).toFixed();
                var atPoint = tmp - before;
                newData[i] = linearInterpolate(data[before], data[after], atPoint);
            }
            newData[fitCount - 1] = data[data.length - 1];
            return newData;
        }

        function linearInterpolate(before, after, atPoint) {
            return before + (after - before) * atPoint;
        }

        function mergeBuffers(channelBuffer, rLength) {
            var result = new Float64Array(rLength);
            var offset = 0;
            var lng = channelBuffer.length;

            for (var i = 0; i < lng; i++) {
                var buffer = channelBuffer[i];
                result.set(buffer, offset);
                offset += buffer.length;
            }

            return result;
        }

        function interleave(leftChannel, rightChannel) {
            var length = leftChannel.length + rightChannel.length;

            var result = new Float64Array(length);

            var inputIndex = 0;

            for (var index = 0; index < length; ) {
                result[index++] = leftChannel[inputIndex];
                result[index++] = rightChannel[inputIndex];
                inputIndex++;
            }
            return result;
        }

        function writeUTFBytes(view, offset, string) {
            var lng = string.length;
            for (var i = 0; i < lng; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        }

        var interleaved;

        if (numberOfAudioChannels === 2) {
            interleaved = interleave(leftBuffers, rightBuffers);
        }

        if (numberOfAudioChannels === 1) {
            interleaved = leftBuffers;
        }

        var interleavedLength = interleaved.length;

        var resultingBufferLength = 44 + interleavedLength * 2;

        var buffer = new ArrayBuffer(resultingBufferLength);

        var view = new DataView(buffer);

        writeUTFBytes(view, 0, 'RIFF');

        view.setUint32(4, 44 + interleavedLength * 2, true);

        writeUTFBytes(view, 8, 'WAVE');

        writeUTFBytes(view, 12, 'fmt ');

        view.setUint32(16, 16, true);

        view.setUint16(20, 1, true);

        view.setUint16(22, numberOfAudioChannels, true);

        view.setUint32(24, sampleRate, true);

        view.setUint32(28, sampleRate * 2, true);

        view.setUint16(32, numberOfAudioChannels * 2, true);

        view.setUint16(34, 16, true);

        writeUTFBytes(view, 36, 'data');

        view.setUint32(40, interleavedLength * 2, true);

        var lng = interleavedLength;
        var index = 44;
        var volume = 1;
        for (var i = 0; i < lng; i++) {
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
        }

        if (cb) {
            return cb({
                buffer: buffer,
                view: view
            });
        }

        postMessage({
            buffer: buffer,
            view: view
        });
    }

    if (!isChrome) {
        mergeAudioBuffers(config, function (data) {
            callback(data.buffer, data.view);
        });
        return;
    }


    var webWorker = processInWebWorker(mergeAudioBuffers);

    webWorker.onmessage = function (event) {
        callback(event.data.buffer, event.data.view);

        URL.revokeObjectURL(webWorker.workerURL);
    };

    webWorker.postMessage(config);
}

function processInWebWorker(_function) {
    var workerURL = URL.createObjectURL(new Blob([_function.toString(),
        ';this.onmessage =  function (e) {' + _function.name + '(e.data);}'
    ], {
        type: 'application/javascript'
    }));

    var worker = new Worker(workerURL);
    worker.workerURL = workerURL;
    return worker;
}

function createBoxSend() {
    var get = urlGET();
    var div = ".btnAttachmentInt";
    var self = createDocument(div);

    var fields = [];
    fields.push(
            {
                tipo: 'textArea',
                nombre: 'Mensaje',
                name: 'mensaje',
                placeholder: 'Escribe el mensaje',
                required: true
            }
    );
    fields.push(
            {
                tipo: 'button',
                nombre: 'Video Llamada',
                name: 'video_call',
                tooltip: "Inicia una video llamada"
            },
            {
                tipo: 'button',
                nombre: 'Audio Llamada',
                name: 'audio_call',
                tooltip: "Inicia una llamada de voz"
            },
            {
                tipo: 'button',
                nombre: 'Colgar',
                name: 'end_call',
                tooltip: "Finaliza la llamada"
            }
    );
    if (typeof get.usarPlantillas !== "undefined") {
        fields.push({
            tipo: 'button',
            nombre: 'Plantillas',
            name: 'plantillas'
        });
    }

    fields.push(
            {
                tipo: 'uploader',
                nombre: 'Adjunto',
                name: 'adjunto'
            },
            {
                tipo: 'button',
                nombre: 'Enviar',
                name: 'enviarmsg'
            },
            {
                tipo: 'button',
                nombre: 'Enviar adjunto',
                name: 'enviarat'
            },
            {
                tipo: 'button',
                nombre: 'Cancelar',
                name: 'cancelarat'
            }
    );

    createNwForms(self, fields, "nopopup");

    addCss(self, ".containFormFields", {"padding": "0px", "overflow": "hidden", "background": "#fff", "border-radius": "0px 30px 30px 0px"});

    addCss(self, "#nwform", {"overflow": "initial", "background": "#f1f1f1"});
    addCss(self, ".footerButtonsNwForms", {"display": "none"});
    addCss(self, ".contain_input_name_enviarat", {"display": "none", "width": "50%"});
    addCss(self, ".contain_input_name_cancelarat", {"display": "none", "width": "50%"});
    addCss(self, ".divSendNwForm", {"display": "none"});
    addCss(self, ".labelInt", {"display": "none", "margin": "0", "padding": "0"});
    addCss(self, ".labelInt .novisible", {"display": "none"});
    addCss(self, ".divContainInputIntern", {"margin": "0", "padding": "0"});
    addCss(self, ".divContainInput", {"float": "none", "min-width": "auto"});

    if (typeof get.usarPlantillas !== "undefined") {
        addCss(self, ".contain_input_name_plantillas", {"position": "fixed", "top": "0px", "left": "93px", "z-index": "4", "width": "auto"});
        var send = actionInColForm(self, "plantillas");
        send.click(function () {
            openPlantillas();
        });
    }

    addCss(self, ".contain_input_name_video_call", {"position": "fixed", "top": "0px", "left": "0px", "z-index": "3", "width": "auto"});
    addCss(self, ".contain_input_name_video_call .labelInt", {"display": "block"});
    addCss(self, ".contain_input_name_audio_call", {"position": "fixed", "top": "0px", "left": "45px", "z-index": "2", "width": "auto"});
    addCss(self, ".contain_input_name_audio_call .labelInt", {"display": "block"});
    addCss(self, ".contain_input_name_end_call", {"position": "fixed", "top": "0px", "left": "90px", "z-index": "1", "width": "auto"});
    addCss(self, ".contain_input_name_end_call .labelInt", {"display": "block"});

    setIconUploader(self, "adjunto", "/nwlib6/icons/attachment1.png");

    addCss(self, ".contain_input_name_adjunto .labelInt", {"background-size": "80%"});

    var haddcenter = 60;
    var hei = 45;
    var wad = 25;
    var wbox = 30;
    if (isMobile()) {
        haddcenter = 85;
    }
    sizesContainMessages();
    function sizesContainMessages() {
        var wi = getWidthPos();
        var hc = document.querySelector("#messages").offsetHeight;
        addCss("", ".showMessagesChat", {
            "height": hc - hei - haddcenter
        });
        addCss(self, ".contain_input_name_mensaje", {"width": wi.width - wad - wbox - 20, "float": "left"});
        addCss(self, ".contain_input_name_adjunto", {"width": wad + "px", "height": hei + "px", "float": "left"});
        addCss(self, ".contain_input_name_enviarmsg", {"width": wbox + "px", "height": hei + "px", "float": "right"});
    }

    addCss(self, ".enviarmsg", {"background-size": "50%", "background-color": "rgb(0, 114, 206)", "border": "0px",
        "background-image": "url(/nwlib6/icons/enviar-boton_blanco_32.png)",
        "background-repeat": "no-repeat",
        "background-position": "62% center",
        "color": "transparent",
        "height": "30px",
        "width": "30px",
        "border-radius": "50%",
        "padding": "0",
        "margin": "0", "top": "9px", "right": "6px"});
    addCss(self, ".mensaje", {"max-height": hei + "px", "border": "0", "font-size": "15px", "resize": "none", "box-shadow": "none", "overflow": "hidden", "outline": "0"});


    $(window).resize(function () {
        sizesContainMessages();
        scrollToBottomMessages();
    });

    document.querySelector(".boxSendChat").style.bottom = "0px";
    if (isMobile()) {
        document.querySelector(".boxSendChat").style.position = "absolute";
        document.querySelector(".boxSendChat").style.bottom = "42px";
    }

    var m = {};
    m.tipo = "activeInactiveWindRing";
    m.classt = get.classt;
    window.parent.postMessage(m, '*');

    var btms = document.querySelector(self + " .mensaje");
    btms.focus();
    btms.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            if (!validateRequired(self)) {
                return;
            }
            sendMessage();
        } else {
            sendMessageRctnw("chat_escribiendo", "leido", "");
        }
    });
    btms.addEventListener("focusout", function () {
        tabVisible = "hidden";
        var m = {};
        m.tipo = "activeInactiveWindRing";
        window.parent.postMessage(m, '*');
    });
    btms.addEventListener("focusin", function () {
        tabVisible = "visible";
        leerTodos(true, "me");

        var m = {};
        m.tipo = "activeInactiveWindRing";
        m.classt = get.classt;
        window.parent.postMessage(m, '*');

        var r = {};
        r.tipo = "readMessagesRingow";
        r.classt = get.classt;
        r.user = get.received;
        window.parent.postMessage(r, '*');

        sendMessageRctnw("chat_leido", "leido", "");
    });
    btms.addEventListener("focus", function () {
        tabVisible = "visible";
    });
    document.addEventListener("visibilitychange", function () {
        tabVisible = document.visibilityState;
        if (tabVisible === "visible") {
            /*
             leerTodos(true, "me");
             sendMessageRctnw("chat_leido", "leido", "");
             */
        }
    });

    if (!isMobile()) {
        $(".showMessagesChat").mouseup(function () {
            var m = {};
            m.tipo = "activeInactiveWindRing";
            m.classt = get.classt;
            window.parent.postMessage(m, '*');
            /*
             btms.focus();
             */
        });
    }

    var send = actionInColForm(self, "end_call");
    send.click(function () {
        colgarChat();
    });
    var send = actionInColForm(self, "audio_call");
    send.click(function () {
        openCallRingow();
        var msg = "He iniciado una llamada de voz<br /><span onclick='openCallRingow(1);'  class='initVideoCall' type='video'>haz clic aquí para ingresar a la llamada de voz</span>";
        sendMessage("one", msg);
    });
    var send = actionInColForm(self, "video_call");
    send.click(function () {
        openCallRingow();
        var msg = "He iniciado una videollamada<br /><span onclick='openCallRingow();'  class='initVideoCall' type='video'>haz clic aquí para ingresar a la videollamada</span>";
        sendMessage("one", msg);
    });

    var send = actionInColForm(self, "enviarmsg");
    send.click(function () {
        if (!validateRequired(self)) {
            return;
        }
        sendMessage();
    });

    var send = actionInColForm(self, "enviarat");
    send.click(function () {
        var data = getRecordNwForm(self);
        var domain = location.origin;
        var at = domain + data.adjunto;
        sendMessage("one", "Envío adjunto: " + at);
        cleanForm(self);
        showHiddenOthers("none");
    });
    var send = actionInColForm(self, "cancelarat");
    send.click(function () {
        cleanForm(self);
        showHiddenOthers("none");
    });

    $(self).delegate(':file', 'change', function () {
        showHiddenOthers("block");
    });

    function showHiddenOthers(mode) {
        var d = document.querySelector(".showMessagesChat");
        if (d) {
            if (mode === "block") {
                d.style.marginTop = "-80px";
            } else {
                d.style.marginTop = "0px";
            }
        }
        addCss(self, ".contain_input_name_enviarat", {"display": mode});
        addCss(self, ".contain_input_name_cancelarat", {"display": mode});
    }
}

function openPlantillas() {
    var get = urlGET();
    var da = {};
    da.id_enc = get.idCall;
    da.terminal = get.term;

    var self = createDocument(".f_enviar_mensaje");
    var fields = [
        {
            name: "plantilla",
            label: "Plantilla",
            type: "selectBox"
        },
        {
            name: "mensaje_al_visitante",
            label: "Mensaje",
            type: "textArea"
        }
    ];
    var typeForm = "popup";
    createNwForms(self, fields, typeForm);
    setColumnsFormNumber(self, 1);
    removeTitleForm(self);
    var data = {};
    data["Ninguno"] = "Seleccione";
    populateSelectFromArray("plantilla", data);

    var data = {};
    data['table'] = 'sop_plantillas';
    data['bindValues'] = {};
    data['bindValues']['terminal'] = get.term;
    populateSelect(self, 'plantilla', 'nwprojectOut', 'populate', data, ' and terminal=:terminal');

    addListener(self, "plantilla", "changeSelection", function () {
        var d = getValue(self, "plantilla");
        var rpc = {};
        rpc["service"] = "soporte";
        rpc["method"] = "getMensaje";
        rpc["data"] = {id: d};
        var func = function (r) {
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            setValue(self, "mensaje_al_visitante", r.texto);
        };
        rpcNw("rpcNw", rpc, func, true);
    });
    var accept = addButtonNwForm("Enviar", self);
    accept.css({"width": "50%"});
    var cancel = addButtonNwForm("Cancelar", self);
    cancel.css({"width": "50%"});
    cancel.find(".btnm_news_span").css({"background": "transparent", "color": "#039be5"});
    cancel.click(function () {
        rejectForm(self, typeForm);
    });
    accept.click(function () {
        if (!validateRequired(self)) {
            return;
        }
        var data = getRecordNwForm(self);
        sendMessage("one", data.mensaje_al_visitante);
        reject(self);
    });
    removeLoadingNw();
}