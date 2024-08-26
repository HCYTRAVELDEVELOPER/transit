var rtcNw = {
    nameConference: "1",
    debug: false,
    chatVisible: true,
    isMaximizeVideo: false,
    room: null,
    isAssesor: false,
    connection: null,
    prepare: function (callback) {
        var js = document.createElement("script");
        js.src = "js/utils.js";
        js.onload = function () {
            var js = document.createElement("script");
            js.src = "js/lib/RecordRTC.js";
            js.onload = function () {
                if (!utils.isOnline()) {
                    alert("Por favor verifique su conexión a internet");
                    return false;
                }
                var js = document.createElement("script");
                js.src = "js/lib/peerjs.min.js";
                js.onload = function () {
                    callback();
                };
                document.body.appendChild(js);
            };
            document.body.appendChild(js);
        };
        document.body.appendChild(js);
    },
    construct: function (classContainer) {
        var self = this;
        if (typeof classContainer === "undefined" || classContainer === null || classContainer === false || classContainer === "") {
            classContainer = ".containerNwpeer2Peer";
        }
        self.container = document.querySelector(classContainer);
        if (!self.container) {
            self.container = document.createElement("div");
            self.container.className = classContainer;
            document.body.appendChild(self.container);
        }
        self.container.style = "position: fixed;top: 0;left: 0;width: 100%;height: 100%;font-family: arial;font-size: 14px;";

        self.contain_no_connected = document.createElement("div");
        self.contain_no_connected.className = "contain_no_connected";
        self.container.appendChild(self.contain_no_connected);

        self.connectButton = document.createElement("button");
        self.connectButton.className = "no_connected";
        self.connectButton.innerHTML = "Conectarme";
        self.connectButton.onclick = function () {
            self.startConnectWithOther();
        };
        self.contain_no_connected.appendChild(self.connectButton);

        self.contain_waiting = document.createElement("div");
        self.contain_waiting.className = "contain_waiting";
        self.contain_waiting.innerHTML = " <p class='contain_waiting_text'>Esperando conexión...</p>";
        self.container.appendChild(self.contain_waiting);

        self.containerVideos = document.createElement("div");
        self.containerVideos.className = "containerVideos";
        self.container.appendChild(self.containerVideos);

        self.containMyVideo = document.createElement("div");
        self.containMyVideo.className = "containMyVideo";
        self.container.appendChild(self.containMyVideo);

        self.videoMyself = document.createElement("video");
        self.videoMyself.className = "js-video-myself";
        self.videoMyself.autoplay = "true";
        self.videoMyself.playsinline = "playsinline";
        self.videoMyself.loop = "true";
        self.videoMyself.muted = "true";
        self.containMyVideo.appendChild(self.videoMyself);
        self.videoMyself.setAttribute("playsinline", "true");
        self.videoMyself.setAttribute("mute", "true");

        self.containVideoOther = document.createElement("div");
        self.containVideoOther.className = "containVideoOther";
        self.container.appendChild(self.containVideoOther);

        self.videoPartnerMaximice = document.createElement("div");
        self.videoPartnerMaximice.className = "videoPartnerMaximice";
        self.containVideoOther.appendChild(self.videoPartnerMaximice);

        self.videoPartnerMaximiceButton = document.createElement("button");
        self.videoPartnerMaximiceButton.className = "videoPartnerMaximiceButton";
        self.videoPartnerMaximiceButton.innerHTML = "<img src='img/maximice.png' />";
        self.videoPartnerMaximiceButton.onclick = function () {
            self.maximizeVideo();
        };
        self.videoPartnerMaximice.appendChild(self.videoPartnerMaximiceButton);

        self.videoPartnerMinimizeButton = document.createElement("button");
        self.videoPartnerMinimizeButton.className = "videoPartnerMinimizeButton";
        self.videoPartnerMinimizeButton.innerHTML = "<img src='img/close.svg' />";
        self.videoPartnerMinimizeButton.onclick = function () {
            self.maximizeVideo();
        };
        self.containVideoOther.appendChild(self.videoPartnerMinimizeButton);

        self.videoPartner = document.createElement("video");
        self.videoPartner.className = "js-video-partner";
        self.videoPartner.autoplay = "true";
        self.containVideoOther.appendChild(self.videoPartner);

        self.containerButtons = document.createElement("div");
        self.containerButtons.className = "containButonsVideoAudio";
        self.container.appendChild(self.containerButtons);

        self.colgarVideoCallButton = document.createElement("button");
        self.colgarVideoCallButton.innerHTML = "<img src='img/colgar.png' />";
        self.colgarVideoCallButton.onclick = function () {
            self.colgarVideoCall();
        };
        self.containerButtons.appendChild(self.colgarVideoCallButton);

        if (self.get.sharedScreen === "true") {
//            self.shareCloseButton = document.createElement("button");
//            self.shareCloseButton.innerHTML = "<img src='img/share_stop.png' />";
//            self.shareCloseButton.onclick = function () {
//                self.validateShareScreen();
//            };
//            self.containerButtons.appendChild(self.shareCloseButton);
        } else {
            if (!utils.isMobile()) {
                self.share = document.createElement("button");
                self.share.innerHTML = "<img src='img/share.png' />";
                self.share.onclick = function () {
                    self.validateShareScreen();
                };
                self.containerButtons.appendChild(self.share);
            }
        }

        self.recordButton = document.createElement("button");
        self.recordButton.innerHTML = "<img src='img/download.png' />";
        self.recordButton.onclick = function () {
            self.stopRecordVideo();
//            self.stopRecordVideoCanvas();
        };
        self.containerButtons.appendChild(self.recordButton);

        self.chatButton = document.createElement("button");
        self.chatButton.innerHTML = "<img src='img/chat.png' />";
        if (!utils.isMobile()) {
            self.chatButton.style = "display:none;";
        } else {
            self.chatVisible = false;
        }
        self.chatButton.onclick = function () {
            self.openChat();
        };
        self.containerButtons.appendChild(self.chatButton);
    },
    constructChat: function () {
        var self = this;
        var get = self.get();
        if (!get) {
            return false;
        }
        var classMainChat = "containerChat containerChatVisible";
        if (utils.isMobile()) {
            classMainChat = "containerChat";
        }
        if (get.onlyChat === "true") {
            classMainChat += " containerChat_maximice";
        }
        if (get.isAssesor === "true") {
            self.isAssesor = true;
        }
        self.containerChat = document.createElement("div");
        self.containerChat.className = classMainChat;
        self.container.appendChild(self.containerChat);

        self.contentChat = document.createElement("div");
        self.contentChat.className = "contentChat";
        self.containerChat.appendChild(self.contentChat);

        self.encChat = document.createElement("div");
        self.encChat.className = "encChat";
        self.contentChat.appendChild(self.encChat);

        if (get.onlyChat !== "true") {
            self.closeChat = document.createElement("img");
            self.closeChat.className = "iconsEnc closeChat";
            self.closeChat.src = "img/close_blanco.png";
            self.closeChat.onclick = function () {
                self.openChat();
            };
            self.encChat.appendChild(self.closeChat);
        }
        if (get.onlyChat === "true") {
            self.videoCamButton = document.createElement("img");
            self.videoCamButton.className = "iconsEnc videocallEnc";
            self.videoCamButton.src = "img/videocam.png";
            self.videoCamButton.onclick = function () {
                var url = "";
                url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.partnerId_get_clean + "&otherID=" + self.myselfId_get_clean + "&room=" + self.room;
                var message = "he iniciado una videollamada, <a class='linkMsgVideoCall' href='" + url + "' target='_SELF'>clic aquí para iniciar</a>";
                self.sendMessagePeer({message: message});

                setTimeout(function () {
                    var url = location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_clean + "&otherID=" + self.partnerId_get_clean + "&room=" + self.room;
                    window.location = url;
                }, 500);

            };
            self.encChat.appendChild(self.videoCamButton);
        }
        self.settingsEnc = document.createElement("img");
        self.settingsEnc.className = "iconsEnc settingsEnc";
        self.settingsEnc.src = "img/settings.png";
        self.encChat.appendChild(self.settingsEnc);

        self.containerMessages = document.createElement("div");
        self.containerMessages.className = "messages";
        self.contentChat.appendChild(self.containerMessages);

        self.form = document.createElement("form");
        self.form.className = "footerChat";
        self.contentChat.appendChild(self.form);
        self.form.setAttribute("onsubmit", "return false");

        self.messageBox = document.createElement("input");
        self.messageBox.className = "messageBox";
        self.messageBox.type = "text";
        self.messageBox.placeholder = "Your message...";
        self.form.appendChild(self.messageBox);

        self.dictation = document.createElement("div");
        self.dictation.className = "imgSpeach";
        self.dictation.innerHTML = "<img src='img/mic.svg' />";
        self.dictation.onclick = function () {
            utils.startDictation(".messageBox");
        };
        self.form.appendChild(self.dictation);

        self.btnsubmit = document.createElement("button");
        self.btnsubmit.className = "btnsubmit";
        self.btnsubmit.type = "submit";
        self.btnsubmit.innerHTML = "<img src='/nwlib6/icons/svg/send.svg' />";
        self.form.appendChild(self.btnsubmit);

        self.form.addEventListener("submit", function () {
            var box = self.messageBox;
            var message = box.value;
            if (message !== "") {
                self.sendMessagePeer({message: message});
                self.addMessage({text: message, type: "me", name: "Yo"});
            }
            box.value = "";
        });
        setInterval(function () {
            utils.setHoursMsg();
        }, 10000);
    },
    initialize: function () {
        var self = this;
        console.log("Start rtcNw");
        self.get = self.get();
        if (!self.get) {
            return false;
        }
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        self.peerClient = null;
        self.currentPeerConnection = null;
        self.localMediaStream = null;
        self.room = self.get.room;
        self.myselfId_get_clean = utils.cleanUserNwC(self.get.myID);
        self.partnerId_get_clean = utils.cleanUserNwC(self.get.otherID);
        self.myselfId_get = utils.cleanUserNwC(self.get.myID) + "_" + self.room;
        self.partnerId_get = utils.cleanUserNwC(self.get.otherID) + "_" + self.room;
        self.heName = self.get.otherID;
        self.bot = false;
        self.isOperatorRingow = false;
        self.sharedScreen = false;
        if (self.get.sharedScreen === "true") {
            self.sharedScreen = true;
        }
        self.onlyChat = false;
        if (self.get.onlyChat === "true") {
            self.onlyChat = true;
        }
        self.decideStart();
    },
    decideStart: function () {
        var self = this;
        if (self.onlyChat === true) {
            self.initOnlyChat();
        } else
        if (self.sharedScreen === false) {
            self.initVideoAudio();
        } else
        if (self.sharedScreen === true) {
            self.shareScreen();
        }
        self.startMyConnect();
    },
    startMyConnect: function () {
        var self = this;
        self.peerClient = new Peer(self.myselfId_get, {
//            key: 'lwjd5qra8257b9',
            debug: 2,
            config: {
                'iceServers': self.getServers()
            }
        });
        self.peerClient.on('open', function () {
            console.log('startMyConnect');
            document.querySelector(".loadingNwChat").remove();
            self.contain_no_connected.style.display = "flex";
            self.connectButton.click();
        });
        self.peerClient.on('connection', function (conn) {
//            connection = conn;
            self.connection = conn;
            self.connection.on('open', function () {
                self.conexionEstablecida(1);

                self.contain_waiting.style.display = "none";
                self.contain_no_connected.style.display = "none";

            });
            self.connection.on('data', function (data) {
                console.log(data);
//                show_messages(data);
                self.addMessage({text: data, type: "other", name: self.partnerId_get});
            });
            self.connection.on('close', function () {
                var m = "El usuario ha cerrado el chat";
                console.log(m);
                self.addMessage({text: m, type: "info", name: ""});
            });
            self.connection.on('disconnected', function (data) {
                var m = "El usuario se ha desconectado";
                console.log(m);
                self.addMessage({text: m, type: "info", name: ""});
            });
        });
        self.peerClient.on('call', function (call) {
            call.answer(self.localMediaStream);
            if (self.currentPeerConnection) {
                self.currentPeerConnection.close();
            }
            self.currentPeerConnection = call;
            call.on('stream', function (stream) {
                if ('srcObject' in self.videoPartner) {
                    self.videoPartner.srcObject = stream;
                } else {
                    self.videoPartner.src = window.URL.createObjectURL(stream);
                }
                self.videoPartner.play();
//                self.videoPartner.style.display = "none";
                self.contain_waiting.style.display = "none";
                self.contain_no_connected.style.display = "none";

                self.addCanvas(self.videoPartner, 2);

            });
            call.on('close', function () {
                var m = "El usuario se ha desconectado";
                console.log('Connection is closed.');
                console.log(m);
                self.addMessage({text: m, type: "info", name: ""});
            });
        });
        self.peerClient.on('error', function (err) {
            console.log(err);
            if (err.toString().indexOf("Could not connect to peer") !== -1) {
                var m = "El usuario no está conectado, por favor espera...";
                self.addMessage({text: m, type: "info", name: ""});
            }
            if (err.toString().indexOf("is taken") !== -1) {
                alert("El ID de usuario " + self.get.myID + " ya está en uso por otro usuario, no podrá conectarse hasta cerrar la anterior");
            }
        });
        self.peerClient.on('disconnected', function (id) {
            console.log('disconnected', id);
            self.peerClient.destroy();
            self.peerClient.disconnect();
            self.peerClient.reconnect();
        });
        self.peerClient.on('chatmessage', function (data) {
            console.log("", data);
        });
        self.peerClient.on('close', function (data) {
            console.log("close", data);
        });
    },
    startConnectWithOther: function () {
        var self = this;
        if (!self.peerClient) {
            return;
        }
        self.connection = self.peerClient.connect(self.partnerId_get);

        if (self.onlyChat === false) {
            var call = self.peerClient.call(self.partnerId_get, self.localMediaStream);
            if (self.currentPeerConnection) {
                self.currentPeerConnection.close();
            }
            self.currentPeerConnection = call;
            call.on('stream', function (stream) {
                self.videoPartner.srcObject = stream;
//                self.videoPartner.style.display = "none";
                self.videoPartner.play();
                self.contain_waiting.style.display = "none";
                self.contain_no_connected.style.display = "none";
                self.addCanvas(self.videoPartner, 2);
            });
            call.on('close', function () {
                console.log('Connection is closed.');
            });
        }
        self.connection.on('open', function (data) {
            console.log(data);
            self.conexionEstablecida(2);
            self.contain_waiting.style.display = "none";
            self.contain_no_connected.style.display = "none";
        });
        self.connection.on('data', function (data) {
            console.log("data", data);
            self.addMessage({text: data, type: "other", name: self.partnerId_get});
        });
        self.connection.on('close', function (data) {
            console.log("close", data);
        });
        self.connection.on('disconnected', function (data) {
            console.log("disconnected", data);
        });

        self.contain_no_connected.style.display = "none";
        self.contain_waiting.style.display = "flex";
    },
    addCanvasMySelf: false,
    addCanvasPartnert: false,
    addCanvas: function (v, num) {
        var self = this;
        if (self.addCanvasMySelf === true && self.addCanvasPartnert === true) {
//            self.initRecordVideoCanvas();
            return true;
        }
        if (num === 1 && self.addCanvasMySelf === true) {
            return true;
        } else
        if (num === 2 && self.addCanvasPartnert === true) {
            return true;
        }
        self.addVideoToRecorder(v);
        console.log("addCanvas " + num);

//        var time = 30;
//        var ancho = 150;
//        var alto = 100;
//        var c = document.getElementById("myCanvas");
//        c.width = (ancho + ancho);
//        c.height = (alto);
////        c.style.display = "block";
//        var ctx = c.getContext('2d');
//        var i;
//        v.addEventListener('play', function () {
////            function step() {
////                if (num === 2) {
////                    ctx.drawImage(v, ancho + 1, 0, ancho, alto);
////                } else {
////                    ctx.drawImage(v, 0, 0, ancho, alto);
////                }
////                requestAnimationFrame(step);
////            }
////            requestAnimationFrame(step);
//            draw(this, ctx, ancho, alto);
////            i = window.setInterval(function () {
////                if (num === 2) {
////                    ctx.drawImage(v, ancho + 1, 0, ancho, alto);
////                } else {
////                    ctx.drawImage(v, 0, 0, ancho, alto);
////                }
////            }, time);
//        }, false);
//        function draw(v, c, w, h) {
//            if (v.paused || v.ended)
//                return false;
//            if (num === 2) {
//                c.drawImage(v, ancho + 1, 0, w, h);
//            } else {
//                c.drawImage(v, 0, 0, w, h);
//            }
//            setTimeout(draw, time, v, c, w, h);
//        }
//
//        v.addEventListener('pause', function () {
//            window.clearInterval(i);
//        }, false);
//        v.addEventListener('ended', function () {
//            clearInterval(i);
//        }, false);

        if (num === 1) {
            self.addCanvasMySelf = true;
        } else
        if (num === 2) {
            self.addCanvasPartnert = true;
        }
    },
    initVideoAudio: function () {
        var self = this;
        navigator.getUserMedia({
            video: true,
            audio: true
        }, function (stream) {
            if ('srcObject' in self.videoMyself) {
                self.videoMyself.srcObject = stream;
            } else {
                self.videoMyself.src = window.URL.createObjectURL(stream);
            }
//            self.videoMyself.style.display = "none";
            self.videoMyself.muted = true;
            self.videoMyself.volume = 0;
            self.videoMyself.play();
            self.localMediaStream = stream;
//            self.videoMyself.style = "display: none;";
            self.addCanvas(self.videoMyself, 1);
//            self.initRecordVideo(stream);
        }, function (error) {
            alert(error);
        });
    },
    conexionEstablecida: function (type) {
        var self = this;
        var m = "Conexión establecida " + type;
        console.log(m);
        self.addMessage({text: m, type: "info", name: ""});
    },
    recorderCanvas: null,
    initRecordVideoCanvas: function () {
        var self = this;
        var js = document.createElement("script");
        js.src = "js/lib/CanvasRecorder.js";
        js.onload = function () {
            var canvas = document.getElementById('myCanvas');
//            canvas.style = "position: fixed;background-color: red;";
//            var ctx = canvas.getContext('2d');
//            for (var i = 0; i < self.vid.length; i++) {
//                ctx.drawImage(self.vid[i], 641, 0, 640, 480);
//            }
//            ctx.drawImage(self.videoPartner, 0, 0, 640, 480);

//            self.recorderCanvas = new CanvasRecorder(canvas, 4500000);
//            self.recorderCanvas = new CanvasRecorder(canvas);
            self.recorderCanvas = new CanvasRecorder(canvas, 500000);
            self.recorderCanvas.start();
//            setTimeout(function () {
//                recorder.save('busy_motion.webm');
//            }, 5000);
        };
        document.body.appendChild(js);
    },
    stopRecordVideoCanvas: function () {
        var self = this;
        self.recorderCanvas.save('video_ringow.webm');
    },
    recorder: null,
    addVideoToRecorder: function (video) {
        var self = this;
        var stream = video.captureStream();
        if (!self.recorder) {
            self.recorder = RecordRTC([stream], {
                type: 'video'
            });
            self.recorder.startRecording({
                enableScreen: true,
                enableMicrophone: true,
                enableSpeakers: true
            });
        } else {
            self.recorder.getInternalRecorder().addStreams([stream]);
        }
    },
    initRecordVideo: function (stream) {
        var self = this;
        var js = document.createElement("script");
        js.src = "https://www.WebRTC-Experiment.com/RecordRTC.js";
        js.onload = function () {
            self.recorder = RecordRTC(stream, {
                //options in https://github.com/muaz-khan/RecordRTC
                type: 'video',
                checkForInactiveTracks: true
            });
            self.recorder.startRecording({
                enableScreen: true,
                enableMicrophone: true,
                enableSpeakers: true
            });
//            setTimeout(function () {
//                self.stopRecordVideo();
//            }, 5000);
        };
        document.body.appendChild(js);
    },
    stopAndGetSingleBlob: function (callback) {
        var self = this;
        if (!self.recorder)
            return;
        self.recorder.stopRecording(function () {
            callback(self.recorder.getBlob());
            self.recorder = null;
        });
    },
    stopRecordVideo: function (save) {
        var self = this;
        self.stopAndGetSingleBlob(function (blob) {
//            var url = URL.createObjectURL(blob);
//            previewVideo.src = url;
//            // or
//            window.open(url);
//            // or
//            if (save) {
            self.srvSaveRecordVideo();
//            }
//            invokeSaveAsDialog(blob);
        });

        return true;
        self.recorder.stopRecording(function () {
            var blob = self.recorder.getBlob();
            console.log(blob);
            if (save) {
                self.saveRecordVideo();
            }
//                    invokeSaveAsDialog(blob, 'video.webm');
            invokeSaveAsDialog(blob);
            self.recorder.startRecording({
                enableScreen: true,
                enableMicrophone: true,
                enableSpeakers: true
            });
        });
    },
    srvSaveRecordVideo: function () {
        var self = this;

        // get recorded blob
        var blob = self.recorder.getBlob();
        // generating a random file name
        var fileName = getFileName('webm');
        // we need to upload "File" --- not "Blob"
        var fileObject = new File([blob], fileName, {
            type: 'video/webm'
        });

        uploadToPHPServer(fileObject, function (response, fileDownloadURL) {
            if (response !== 'ended') {
                console.log("upload progress", response);
//                document.getElementById('header').innerHTML = response; // upload progress
                return;
            }
//            document.body('header').innerHTML = '<a href="' + fileDownloadURL + '" target="_blank">' + fileDownloadURL + '</a>';
            console.log('Successfully uploaded recorded blob.');
            // preview uploaded file
//            document.getElementById('your-video-id').srcObject = null;
//            document.getElementById('your-video-id').src = fileDownloadURL;
            // open uploaded file in a new tab
//            window.open(fileDownloadURL);
        });

        function uploadToPHPServer(blob, callback) {
            // create FormData
            var formData = new FormData();
            formData.append('video-filename', blob.name);
            formData.append('video-blob', blob);
            formData.append('room', self.room);
            callback('Uploading recorded-file to server.');
            var upload_url = 'srv/saveRecordVideo.php';
            // var upload_url = 'RecordRTC-to-PHP/save.php';
            var upload_directory = "/imagenes/";

            makeXMLHttpRequest(upload_url, formData, function (progress) {
                if (progress !== 'upload-ended') {
                    callback(progress);
                    return;
                }
                var initialURL = upload_directory + blob.name;
                callback('ended', initialURL);
            });
        }

        function makeXMLHttpRequest(url, data, callback) {
            console.log(data);
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
                callback('PHP upload started...');
            };
            request.upload.onprogress = function (event) {
                callback('PHP upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
            };
            request.upload.onload = function () {
                callback('progress-about-to-end');
            };
            request.upload.onload = function () {
                callback('PHP upload ended. Getting file URL.');
            };
            request.upload.onerror = function (error) {
                callback('PHP upload failed.');
            };
            request.upload.onabort = function (error) {
                callback('PHP upload aborted.');
            };
            request.open('POST', url, true);
            request.send(data);
        }
        // this function is used to generate random file name
        function getFileName(fileExtension) {
            var d = new Date();
            var year = d.getUTCFullYear();
            var month = d.getUTCMonth();
            var date = d.getUTCDate();
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

//        var blob = self.recorder.getBlob();
//        var url = URL.createObjectURL(blob);
//        console.log(url);
//        console.log(blob);
//        var data = "";
//        function reqListener() {
//            console.log(this.responseText);
//            var data = JSON.parse(this.responseText);
//            alert(data);
//        }
//        function reqError(err) {
//            alert(err);
//        }
//        var oReq = new XMLHttpRequest();
//        oReq.onload = reqListener;
//        oReq.onerror = reqError;
//        oReq.open('POST', 'saveRecordVideo.php', true);
//        oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//        oReq.send(data);
    },
    initOnlyChat: function () {
        var self = this;
        self.contain_waiting.remove();
        if (typeof self.share !== "undefined") {
            self.share.remove();
        }
    },
    validateShareScreen: function () {
        var self = this;
        var js = document.createElement("script");
        js.src = "https://www.WebRTC-Experiment.com/getScreenId.js";
        js.onload = function () {
            getChromeExtensionStatus(function (status) {
                if (status === 'installed-enabled') {
                    var url = "";
                    url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_clean + "&otherID=" + self.partnerId_get_clean + "&room=" + self.room + "&sharedScreen=true";
                    window.location = url;
                } else
                if (status === 'installed-disabled') {
                    alert('Tiene la extensión instalada pero está inhabilitada');
                } else {
                    alert('No se pudo capturar su pantalla. Verifique que la extensión sea instalada https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk');
                }
            });
        };
        document.body.appendChild(js);
    },
    shareScreen: function () {
        var self = this;
        //https://github.com/muaz-khan/Chrome-Extensions/tree/master/Screen-Capturing.js https://github.com/muaz-khan/getScreenId
        var js = document.createElement("script");
        js.src = "https://www.WebRTC-Experiment.com/getScreenId.js";
        js.onload = function () {
            var js = document.createElement("script");
            js.src = "https://webrtc.github.io/adapter/adapter-latest.js";
            document.body.appendChild(js);
            js.onload = function () {
                getScreenStream(function (screenStream) {
                    if ('srcObject' in self.videoMyself) {
                        self.videoMyself.srcObject = screenStream;
                    } else {
                        self.videoMyself.src = window.URL.createObjectURL(screenStream);
                    }
                    self.localMediaStream = screenStream;
                    addStreamStopListener(self.localMediaStream, function () {
                        console.log('screen sharing is ended.');
                        var url = "";
                        url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_clean + "&otherID=" + self.partnerId_get_clean + "&room=" + self.room;
                        window.location = url;
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
                });
//function getScreenStream(callback) {
//    if (navigator.getDisplayMedia) {
//        navigator.getDisplayMedia({
//            video: true
//        }).then(screenStream => {
//            callback(screenStream);
//        });
//    } else if (navigator.mediaDevices.getDisplayMedia) {
//        navigator.mediaDevices.getDisplayMedia({
//            video: true
//        }).then(screenStream => {
//            callback(screenStream);
//        });
//    } else {
//        getScreenConstraints(function(error, screen_constraints) {
//            navigator.mediaDevices.getUserMedia(screen_constraints).then(function(screenStream) {
//                callback(screenStream);
//            });
//        });
//    }
//}
//OTRA FORMA PARA COMPARTIR PANTALLA
                /*
                 getScreenId(function (error, sourceId, screen_constraints) {
                 navigator.mediaDevices.getUserMedia(screen_constraints).then(function (stream) {
                 var video = document.querySelector('#js-video-myself');
                 if ('srcObject' in video) {
                 video.srcObject = stream;
                 } else {
                 video.src = window.URL.createObjectURL(stream);
                 }
                 self.localMediaStream = stream;
                 
                 
                 }).catch(function (error) {
                 console.log("ERROR::: " + error);
                 var url = "";
                 url += location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get + "&otherID=" + self.partnerId_get;
                 window.location = url;
                 });
                 return true;
                 });
                 */
            };
        };
        document.body.appendChild(js);
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
    getServers: function () {
        var iceServers = [];
        var moz = !!navigator.mozGetUserMedia;
        if (moz) {
            iceServers.push({
                url: 'stun:23.21.150.121'
            });

            iceServers.push({
                url: 'stun:stun.services.mozilla.com'
            });
        } else {
            iceServers.push({
                url: 'stun:stun.l.google.com:19302'
            });

            iceServers.push({
                url: 'stun:stun.anyfirewall.com:3478'
            });
        }
        iceServers.push({
            'url': 'turn:192.158.29.39:3478?transport=udp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        });
        iceServers.push({
            'url': 'turn:192.158.29.39:3478?transport=tcp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        });
        iceServers.push({
            url: 'turn:turn.bistri.com:80',
            username: 'homeo',
            credential: 'homeo'
        });
        iceServers.push({
            url: 'stun:stun.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun1.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun2.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stu3.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun4.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun.ekiga.net'
        });
        iceServers.push({
            url: 'stun:stun.ideasip.com'
        });
        iceServers.push({
            url: 'stun:stun.iptel.org'
        });
        iceServers.push({
            url: 'stun:stun.rixtelecom.se'
        });
        iceServers.push({
            url: 'stun:stun.schlund.de'
        });
        iceServers.push({
            url: 'stun:stunserver.org'
        });
        iceServers.push({
            url: 'stun:stun.softjoys.com'
        });
        iceServers.push({
            url: 'stun:stun.voiparound.com'
        });
        iceServers.push({
            url: 'stun:stun.voipbuster.com'
        });
        iceServers.push({
            url: 'stun:stun.voipstunt.com'
        });
        iceServers.push({
            url: 'stun:stun.stunprotocol.org:3478'
        });
        iceServers.push({
            url: 'stun:stun.services.mozilla.com'
        });
        iceServers.push({
            url: 'stun:stun.sipgate.net'
        });
        iceServers.push({
            url: 'turn:numb.viagenie.ca:3478',
            username: 'assdres@gmail.com',
            credential: 'padre08'
        });
        return iceServers;
    },
    sendMessagePeer: function (d) {
        var self = this;
        if (typeof self.connection === "undefined" || self.connection === null || self.connection === false || self.connection === "") {
            alert("No puede enviar mensajes hasta no tener conexión");
            return false;
        }
        var message = d.message;
        self.connection.send(message);
    },
    addMessage: function (d) {
        var self = this;
//        if (typeof connection === "undefined" || connection === null || connection === false || connection === "") {
//            alert("No puede enviar mensajes hasta no tener conexión");
//            return false;
//        }
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
        var cla = "message message--theirs";
        if (type === "info") {
            cla = "message message--info";
        } else
        if (type === "me") {
            cla = "message message--mine";
            if (self.loadHistory)
                self.soundNewMsgMe();
        } else {
            dev = "SI";
            if (self.loadHistory)
                self.soundNewMsgHe();
        }
        var showSays = "";
        if (utils.evalueData(says)) {
            if (says.indexOf("Visitor-") !== -1) {
                showSays = "style='display:none;'";
            }
        }
//        text = utils.renderHTML(text);
        var r = "<div class='" + cla + "' " + seeBloque + " >";
        var body = "";
        body += "<div class='message__name' " + showSays + ">" + says + "</div>";
        body += "<div class='message__fecha' data-date='" + fecha + "'>" + valueDate + "</div>";
        body += "<div class='message__bubble'>";
        body += text;
        body += "</div>";
        if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
            body += self.lastTextTraducido;
        }
        body += " <div class='message__see'>Visto: <span class='spanTextSee spanTextSee_" + utils.cleanUserNwC(says) + "'>" + see + "</span> Entregado: <span class='spanTextDev spanTextDev_" + utils.cleanUserNwC(says) + "'>" + dev + "</span></div>";
        r += body;
        r += "</div>";
        self.lastTextTraducido = "";

        var d = document.createElement("div");
        d.className = cla + " " + classname;
        d.innerHTML = r;

        if (self.isOperatorRingow === "true" || self.isOperatorRingow === true) {
            var img = document.createElement("img");
            img.className = "g_translate";
            img.src = "icons/g_translate.svg";
            img.data = {
                parentClass: classname
            };
            img.onclick = function () {
                var data = this.data;

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
                        console.log(textTranslate);
//                var textEnd = "Original: " + textTranslate.source + "<br />";
//                textEnd += "Traducción: " + textTranslate.translation;
                        var textEnd = textTranslate.translation;
                        divOrigin.innerHTML = textEnd;
                    });
                };
                selClass.appendChild(selTwo);
            };
            d.appendChild(img);
        }

        var con = self.containerMessages;
        if (con) {
            con.appendChild(d);
        }

        utils.scrollBottomMessages();
        utils.setHoursMsg();

        return d;
    },
    maximizeVideo: function () {
        var self = this;
        console.log("maximizeVideo");
        if (self.isMaximizeVideo === false) {
            self.isMaximizeVideo = true;
            utils.addClass(self.containVideoOther, "containVideoOther_maximice");
            self.videoPartnerMaximice.style = "display: none;";
            self.videoPartnerMinimizeButton.style = "display: block;";
        } else {
            self.isMaximizeVideo = false;
            utils.removeClass(self.containVideoOther, "containVideoOther_maximice", true);
            self.videoPartnerMinimizeButton.style = "display: none;";
            self.videoPartnerMaximice.style = "display: flex;";
        }

    },
    colgarVideoCall: function () {
        var self = this;
        var url = location.protocol + "//" + location.hostname + location.pathname + "?myID=" + self.myselfId_get_clean + "&otherID=" + self.partnerId_get_clean + "&room=" + self.room + "&onlyChat=true";
        window.location = url;
    },
    openChat: function () {
        var self = this;
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
};