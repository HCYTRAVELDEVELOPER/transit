var get = urlGET();
var room = get.idCall + "&apikey=" + get.apikey + "&term=" + get.term;
var video = document.querySelector('#localVideo');
var audio = document.querySelector('.audioone');
var audio2 = document.querySelector('.audiotwo');
var recorderAudio2 = null;
var recorder;
document.addEventListener("DOMContentLoaded", function () {
    /*
     if (getChat === false) {
     chunks = [];
     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
     navigator.mediaDevices.getUserMedia({audio: true}).then(function (stream) {
     mediaRecorder = new MediaRecorder(stream);
     mediaRecorder.start();
     mediaRecorder.addEventListener('dataavailable', function (e) {
     var el = document.querySelector('.audioone');
     el.src = URL.createObjectURL(e.data);
     });
     mediaRecorder.ondataavailable = function (e) {
     console.log("ondataavailable", e.data)
     chunks.push(e.data);
     }
     }).catch(function (err) {
     console.log('The following getUserMedia error occured: ' + err);
     });
     } else {
     console.log('getUserMedia not supported on your browser!');
     }
     var handleSuccess = function (stream) {
     var context = new AudioContext();
     var source = context.createMediaStreamSource(stream);
     var processor = context.createScriptProcessor(1024, 1, 1);
     source.connect(processor);
     processor.connect(context.destination);
     elemDest = audio3;
     elemDest.src = URL.createObjectURL(processor.stream);
     processor.onaudioprocess = function (e) {
     console.log(e.inputBuffer);
     };
     ctx = new AudioContext();
     srcNode = ctx.createMediaStreamSource(stream);
     destNode = ctx.createMediaStreamDestination();
     srcNode.connect(destNode);
     elemDest = audio3;
     elemDest.src = URL.createObjectURL(destNode.stream);
     };
     navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(handleSuccess);
     
     captureMicrophone(function (microphone) {
     setSrcObject(microphone, audio);
     recorderAudio = RecordRTC(microphone, {
     type: 'audio',
     recorderType: StereoAudioRecorder,
     });
     recorderAudio.startRecording();
     recorderAudio.microphone = microphone;
     });
     }
     else {
     chatGetMessages();
     }
     document.querySelector(".openbaseblob").addEventListener("click", function () {
     openBaseBlob();
     });
     chatGetMessages();
     */
});

function openBaseBlob() {
    var base64data = document.querySelector(".openbaseblob").getAttribute("data");
    var iframe = "<iframe width='100%' height='100%' src='" + base64data + "'></iframe>";
    var x = window.open();
    x.document.open();
    x.document.write(iframe);
    x.document.close();
}

var webrtc = new SimpleWebRTC({
    localVideoEl: 'localVideo',
    remoteVideosEl: '',
    autoRequestMedia: true,
    debug: false,
    detectSpeakingEvents: false
});
webrtc.on('readyToCall', function () {
    console.log(room);
    if (room) {
        if (debug)
            console.log("Me he unido a la sala " + room);
        webrtc.joinRoom(room);
        if (getChat === false) {
            /*
             var camera = streamCamera;
             setSrcObject(camera, video);
             video.play();
             recorder = RecordRTC(camera, {
             type: 'video'
             });
             recorder.startRecording();
             recorder.camera = camera;
             document.querySelector(".seeRecording").style.display = "block";
             */
        }
    } else {
        console.log("NO");
    }
});
webrtc.on('channelMessage', function (peer, label, data) {
    if (data.type === 'volume') {
        showVolume(document.getElementById('volume_' + peer.id), data.volume);
    }
});
var ads = 1;
webrtc.on('videoAdded', function (video, peer) {
    if (getAudio === true) {
        document.querySelector(".conectandow").style.display = "none";
        document.querySelector(".onlineaudio").style.display = "block";
    }
    /*
    if (getVideo === false) {
        return;
    }
    */
    console.log('video added', peer);
    var remotes = document.getElementById('remotes');
    if (remotes) {
        var d = document.createElement('div');
        d.className = 'videoContainer';
        d.id = 'container_' + webrtc.getDomId(peer);
        d.appendChild(video);
        video.className = "videoIncoming";
        if (ads === 1) {
            if (getChat === false) {
                /*RECORDING AUDIO*/
                captureMicrophone(function (microphone) {
                    setSrcObject(microphone, audio);
                    recorderAudio = RecordRTC(microphone, {
                        type: 'audio',
                        recorderType: StereoAudioRecorder
                    });
                    recorderAudio.startRecording();
                    recorderAudio.microphone = microphone;
                    document.querySelector(".seeRecordingAudio").style.display = "inline-block";
                });
                /*RECORDING AUDIO*/
            }
        }

        var vol = document.createElement('div');
        vol.id = 'volume_' + peer.id;
        vol.className = 'volume_bar';
        video.onclick = function () {
            video.style.width = video.videoWidth + 'px';
            video.style.height = video.videoHeight + 'px';
        };
        d.appendChild(vol);
        remotes.appendChild(d);
        orderAddVideo();
        ads++;
    }
});
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    if (getChat === false) {
        stopRecordingAudio();
    }

    var remotes = document.getElementById('remotes');
    var el = document.getElementById('container_' + webrtc.getDomId(peer));
    if (remotes && el) {
        remotes.removeChild(el);
        removeVideo();
    }
});
webrtc.on('volumeChange', function (volume, treshold) {
    showVolume(document.getElementById('localVolume'), volume);
});
if (room) {
    setRoom(room);
} else {
    $('form').submit(function () {
        var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
        webrtc.createRoom(val, function (err, name) {
            console.log(' create room cb', arguments);
            var newUrl = location.pathname + '?' + name;
            if (!err) {
                history.replaceState({foo: 'bar'}, null, newUrl);
                setRoom(name);
            } else {
                console.log(err);
            }
        });
        return false;
    });
}

var button = $('#screenShareButton'),
        setButton = function (bool) {
            button.text(bool ? 'Compartir pantalla' : 'stop sharing');
        };
webrtc.on('localScreenStopped', function () {
    setButton(true);
});
setButton(true);
button.click(function () {
    var us = document.querySelector(".usersNumConecc").innerHTML;
    if (parseInt(us) === 0) {
        nw_dialog("No hay usuarios en línea para compartir pantalla");
        return;
    }
    console.log("START SHARING SCREEN");
    if (webrtc.getLocalScreen()) {
        webrtc.stopScreenShare();
        console.log("SHARING SCREEN OK!!!");
        setButton(true);
    } else {
        webrtc.shareScreen(function (err) {
            console.log("log screensharing", err);
            if (err != null) {
                nw_dialog("Ha ocurrido un error al compartir pantalla. Comprueba que tienes la extensión instalada. Para instalar la extension haz <a target='_BLANK' href='https://chrome.google.com/webstore/detail/screensharing-ringow-5/mjccfoffanmcdnbidinoamkmokjhmfae'>click aqui</a>, luego vuelve y refresca esta ventana. ");
                return;
            }
            if (err) {
                setButton(true);
            } else {
                setButton(false);
            }
        });
    }
});
function setRoom(name) {
    $('form').remove();
    $('h1').text(name);
    $('#subTitle').html('<span class="textShared">Compartir:</span> <input class="cajaShared" type="text" value="' + location.href + '" />');
    $('body').addClass('active');
}

function showVolume(el, volume) {
    if (!el)
        return;
    if (volume < -45) { /* vary between -45 and -20*/
        el.style.height = '0px';
    } else if (volume > -20) {
        el.style.height = '100%';
    } else {
        el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
    }
}



webrtc.connection.on('message', function (data) {
    var get = urlGET();
    var r = getDataRctNw(data);
    var user = $("#miuserid").val();
    if (r.type === 'chat_escribiendo' && r.user !== user) {
        var ni = r.user;
        if (typeof get.usernametwo_show !== "undefined") {
            ni = get.usernametwo_show;
        }
        isWritten(ni);
    } else
    if (r.type === 'chat_leido' && r.user !== user) {
        leerTodos(false);
    } else
    if (r.type === 'chat') {
        var ops = document.querySelector(".encOptionsNwRtc");
        var disp = ops.style.display;
        if (disp !== "block") {
            ops.style.display = "block";
        }
        var msg = r.message;
        var nick = r.user;
        var photo = r.photo;
        if (nick !== user) {
            if (typeof msg !== "undefined") {
                msg = msg.replace("containChat_one", "containChat_two");
                playSoundTwo();
            }
        }
        validateMsgEnd(msg);
        var blo = msg;
        $('.showMessagesChat').append(blo);
        $("#messages").fadeIn(0);
        scrollToBottomMessages();
        var isInFrame = insideIframe();
        if (nick !== user) {
            if (tabVisible === "hidden") {
                if (typeof r.msgClean !== "undefined") {
                    msg = r.msgClean;
                }
                var array = {};
                array.callBack = function () {
                    alert("fdsfdas");
                };
                var nick_show = nick;
                if (isInFrame === true) {
                    if (typeof get.usernametwo_show !== "undefined") {
                        nick_show = get.usernametwo_show;
                    }
                    var m = {};
                    m.tipo = "sendNotifyPushFrameNwrtc";
                    m.body = stripTags(msg);
                    m.title = "Mensaje de " + nick_show;
                    m.icon = photo;
                    m.array = false;
                    m.user = nick;
                    m.otto = user;
                    m.classt = get.classt;
                    window.parent.postMessage(m, '*');
                } else {
                    spawnNotification(stripTags(msg), photo, stripTags(nick), array);
                }
            } else {
                /*le digo al otro que ya leí sus mensajes*/
                sendMessageRctnw("chat_leido", "leido", nick);
                leerTodos();
            }
        }
    }
});
function getDataRctNw(data) {
    var r = {};
    r.type = data.type;
    if (typeof data.payload !== "undefined") {
        if (typeof data.payload.message !== "undefined") {
            var p = data.payload.message;
            if (typeof p.msgClean !== "undefined") {
                r.msgClean = p.msgClean;
            }
            r.photo = p.photo;
            r.message = p.message;
            r.nick = p.nick;
            r.user = p.user;
        }
    }
    return r;
}

function sendMessageRctnw(type, message, nick, msgClean, photo) {
    var user = $("#miuserid").val();
    webrtc.sendToAll(type, {message: {
            msgClean: msgClean,
            message: message,
            photo: photo,
            nick: nick,
            user: user
        },
        nick: nick
    });
}

window.addEventListener('message', function (event) {
    var r = event.data;
    if (r === "focusExternRingow") {
        var btms = document.querySelector(".mensaje");
        if (btms) {
            btms.focus();
        }
    }
    if (r === "leerMensajesRingow") {
        tabVisible = "visible";
        leerTodos(true, "me");
    }
});