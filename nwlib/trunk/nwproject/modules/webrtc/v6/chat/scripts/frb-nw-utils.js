var wnwUtils = {
    getGET: function (url) {
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
    evalueData: function (d, exception) {
        var self = this;
        if (typeof d === "undefined") {
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
    notificationPushNwrtc: function (theBody, theIcon, theTitle, callback) {
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
            console.log("granted");
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
    addZero: function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    getActualFullDate: function (format) {
        var self = this;
        var hoy = self.getActualDate(format);
        var hour = self.getActualHour(format);
        if (format == "datetime-local") {
            return hoy + "T" + hour;
        }
        return hoy + " " + hour;
    },
    getActualHour: function (format) {
        var self = this;
        var d = new Date();
        var h = self.addZero(d.getHours());
        var m = self.addZero(d.getMinutes());
        var s = self.addZero(d.getSeconds());
        if (format == "datetime-local") {
            return h + ":" + m;
        }
        return h + ":" + m + ":" + s;
    },
    getActualDate: function (format) {
        var self = this;
        var d = new Date();
        var day = self.addZero(d.getDate());
        var month = self.addZero(d.getMonth() + 1);
        var year = self.addZero(d.getFullYear());
        return year + "-" + month + "-" + day;
    },
    diffEntreFechas: function (fechaIni, fechaFin) {
        var self = this;
        if (!self.evalueData(fechaIni)) {
//            console.log("fechaIni", fechaIni)
//            console.log("fechaFin", fechaFin)
            return "";
        }
        if (fechaFin == undefined || !self.evalueData(fechaFin)) {
            fechaFin = self.getActualFullDate();
        }
        var diaEnMils = 1000 * 60 * 60 * 24,
                desde = new Date(fechaIni.substr(0, 10)),
                hasta = new Date(fechaFin.substr(0, 10)),
                diff = hasta.getTime() - desde.getTime() + diaEnMils;/* +1 incluir el dia de ini*/

        var r = diff / diaEnMils;
        r = r - 1;
        return r;
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
    mesesArray: function (i) {
        var self = this;
        return self.lettersArray(i);
    },
    mesTextEnglish: function (i) {
        var d = {};
        d["01"] = "January";
        d["02"] = "February";
        d["03"] = "March";
        d["04"] = "April";
        d["05"] = "May";
        d["06"] = "June";
        d["07"] = "July";
        d["08"] = "August";
        d["09"] = "September";
        d["10"] = "October";
        d["11"] = "November";
        d["12"] = "December";
        return d[i];
    },
    semanadelanio: function (date) {
        var fecha = new Date(date);
        var f2 = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0);
        var f1 = new Date(fecha.getFullYear(), 0, 1, 0, 0);
        var day = f1.getDay();
        if (day == 0)
            day = 7;
        if (day < 5)
        {
            var FW = parseInt(((Math.round(((f2 - f1) / 1000 / 60 / 60 / 24)) + (day - 1)) / 7) + 1);
            if (FW == 53 || FW == 0)
                FW = 1;
        } else
        {
            FW = parseInt(((Math.round(((f2 - f1) / 1000 / 60 / 60 / 24)) + (day - 1)) / 7));
            if (FW == 0)
                FW = 52;
            if (FW == 53)
                FW = 1;
        }
        return(FW);
    },
    dataOfDate: function (date) {
        var self = this;
        var onlyF = date;
        if (date == undefined) {
            date = self.getActualFullDate();
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
        r.fecha_sin_hora = onlyF;
        r.fecha_completa = date;
        r.fecha_anio = d.getFullYear();
        r.fecha_mes = d.getMonth() + 1;
        r.fecha_mes_string = r.fecha_mes.toString();
        if (r.fecha_mes_string.length === 1) {
            r.fecha_mes_string = "0" + r.fecha_mes_string;
        }
        r.fecha_mes_text = self.lettersArray(r.fecha_mes);
        r.fecha_mes_text_english = self.mesTextEnglish(r.fecha_mes_string);
        r.fecha_dia = d.getDate();
        r.fecha_dia_semana = d.getDay();
        r.fecha_dia_text = diasSemana[d.getDay()];

        var habil = "SI";
        var festivo = "NO";
        if (r.fecha_dia_semana == 6 || r.fecha_dia_semana == 0) {
            habil = "NO";
        }
        if (r.fecha_dia_semana == 0) {
            festivo = "SI";
        }
        r.fecha_dia_habil = habil;
        r.fecha_dia_festivo = festivo;
        r.fecha = r.fecha_anio + "-" + r.fecha_mes + "-" + r.fecha_dia;
        r.semana = self.semanadelanio(r.fecha);
        r.hora_ex = d.getTime();
        r.hora_horas = d.getHours();
        r.hora_minutos = d.getMinutes();
        r.hora_segundos = d.getSeconds();
        r.hora_completa = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return r;
    },
    calcularTiempoDosFechas: function (date1, date2, abreviado) {
        var self = this;
        if (typeof date2 === "undefined" || !self.evalueData(date2)) {
            date2 = self.getActualFullDate();
        }
        var hoy = self.getActualFullDate();
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
//        var infoDate2 = nw.dataOfDate(hoy);
        var infoDate2 = self.dataOfDate(date2);
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
        if (date1 > date2) {
            isMayor = true;
        }
        var r = {};
        r.hoy = hoy;
        r.fecha_mayor_a_hoy = isMayor;
        r.date1 = date1;
        r.date2 = date2;
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
        if (isMayor === true) {
            dateInFormat = "En " + hoursDate + ":" + minutesDate;
        } else {
            if (days > 0) {
                if (abreviado === true) {
                    dateInFormat = days + " días";
                } else {
                    if (days === 1) {
                        dateInFormat = "Ayer a las" + " " + hoursDate + ":" + minutesDate;
                    } else {
                        dateInFormat = mesDateText + " " + dayDate + " a las " + hoursDate + ":" + minutesDate;
                    }
                }
            } else {
                if (parseFloat(hours) < 24) {
                    if (parseFloat(hours) < 1) {
                        if (minutes < 59) {
                            if (abreviado === true) {
                                dateInFormat = minutes + " " + "mins";
                            } else {
                                dateInFormat = "Hace" + " " + minutes + " " + "minutos";
                            }
                        }
                    } else {
                        if (abreviado === true) {
                            dateInFormat = parseFloat(hours) + " " + "hrs" + ", " + minutes + " " + "mins";
                        } else {
                            dateInFormat = "Hace" + " " + parseFloat(hours) + " " + "horas" + " " + "y" + " " + minutes + " " + "minutos";
                        }
                    }
                }
            }
        }
        r.dateInFormat = dateInFormat;
        return r;
    },
    setHoursMsg: function (classOrID, abrev) {
        var self = this;
        var d = document.querySelectorAll(classOrID);
        if (d.length > 0) {
            for (var i = 0; i < d.length; i++) {
                var ro = d[i];
                if (ro) {
                    var fecha = ro.getAttribute("data-date");
                    var dateFormat = self.calcularTiempoDosFechas(fecha, false, abrev);
                    var valueDate = dateFormat.dateInFormat;
                    ro.innerHTML = valueDate;
                }
            }
        }
    },
    strip: function (html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return tmp.innerText.replace(urlRegex, function (url) {
            return '\n' + url;
        });
    },
    renderHTML: function (text, encodeUri, clean) {
        var self = this;
        var rawText = self.strip(text);
        if (clean === false) {
            rawText = text;
        }
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return rawText.replace(urlRegex, function (url) {
            if (encodeUri === true) {
                url = encodeURIComponent(url);
            }
            /*
             if ((url.indexOf(".jpg") > 0) || (url.indexOf(".png") > 0) || (url.indexOf(".gif") > 0)) {
             return '<img src="' + url + '">' + '<br/>';
             } else {
             return '<a href="' + url + '" target="_BLANK">' + url + '</a>' + '<br/>';
             }
             */
            var showlink = true;
            if (url.indexOf("/nwlib6/css/emoji/emoji/") !== -1 || url.indexOf("/nwlib6/css/emoji/gifs/") !== -1 || url.indexOf("nw_taskenter_emojis") !== -1) {
                showlink = false;
            }
            if (showlink) {
                return '<a class="url_render_frb" href="' + url + '" target="_BLANK">' + url + '</a>' + '<br/>';
//                return '<a onclick="javascript: window.open(this.href, \'_BLANK\')" class="link_in_chatask" href="' + url + '" target="_BLANK">' + url + '</a>' + '<br/>';
            } else {
                return url;
            }
        });
    },
    haveUrlString: function (text) {
        var have = false;
        if (text.indexOf("/nwlib6/css/emoji/gifs/") !== -1 || text.indexOf("/nwlib6/css/emoji/emoji/") !== -1 || text.indexOf("nw_taskenter_emojis") !== -1) {
            return false;
        }
//        var rawText = self.strip(text);
        var rawText = text;
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        rawText.replace(urlRegex, function (url) {
            have = true;
        });
        return have;
    },
    toTimestamp: function (strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    },
    setBtnLoading: function (widget) {
        var self = this;
        self.addClass(widget, "events_click_none");
        var span = document.createElement("span");
        span.className = "cEftVf loading_into_btn";
        widget.appendChild(span);
    },
    removeBtnLoading: function (widget) {
        var self = this;
        if (widget) {
            self.removeClass(widget, "events_click_none", true);
            var d = widget.querySelector(".loading_into_btn");
            if (d) {
                d.remove();
            }
        }
    },
    initRecordVoice: function (submitDictation, callback) {
        var self = this;
        var get = self.getGET();
        domain = wnw.domainSrv;
        rutaFiles = domain + "/nwlib6/nwproject/modules/webrtc/v4/";
        var room = get.room;
        console.log("initRecordVoice");
        if (typeof cordova !== "undefined") {
            if (typeof cordova.platformId !== "undefined") {
                if (cordova.platformId !== "browser") {

                    var options = {};
                    options.showDialogReproductor = false;
                    options.body = "Grabando... Cuando termines la grabación haz clic en finalizar.";
                    options.textAccept = "Finalizar llamada";
                    options.useButtonCancel = true;
                    nw.audio.recordAudio(options, function (r) {
                        //devuelve al finalizar la llamada el archivo audio del server
                        console.log("Archivo audio DATA: ", r);
                        var file = domain + r.response;
                        wnw.saveMessage(file);
                        var m = {};
                        m.tipo = "saveMessageChat";
                        m.message = file;
                        m.room = wnw.room;
                        m.roomNameData = wnw.nameData;
                        m.sendFirstMessage = wnw.sendFirstMessage;
                        window.parent.postMessage(m, '*');
                        if (wnw.callbackToSendMsg !== null) {
                            wnw.callbackToSendMsg(m);
                        }
//                                data.observaciones = "Llamada finalizada <audio src='" + config.domain_rpc + r.response + "'></audio> <a href='" + config.domain_rpc + r.response + "' target='_BLANK'>" + config.domain_rpc + r.response + "</a>";
                    });
                    return true;
                }
            }
        }

        var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
        console.log("navigator", navigator);
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
        }

        var types = ["video/webm",
            "audio/webm",
            "video/webm\;codecs=vp8",
            "video/webm\;codecs=daala",
            "video/webm\;codecs=h264",
            "audio/webm\;codecs=opus",
            "video/mpeg"];
        for (var i in types) {
            console.log("Is " + types[i] + " supported? " + (MediaRecorder.isTypeSupported(types[i]) ? "Maybe!" : "Nope :("));
        }

        constraints = {
            audio: true,
            video: false
        };

        var shouldStop = false;
        var stopped = false;
        shouldStop = false;
//        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        navigator.mediaDevices.getUserMedia({audio: true, video: false}, {mimeType: "audio/webm;codecs=opus"}).then(function (stream) {
            console.log("[DEMO] :: Get user media ok... Enumerate devices...");
            handleSuccess(stream);
        }).catch(function (error) {
            console.log("[DEMO] :: Unable to have access to media devices", error);
            console.log("error.name", error.name);
            if (error.name === 'ConstraintNotSatisfiedError') {
                console.log('The resolution ' + constraints.video.width.exact + 'x' +
                        constraints.video.width.exact + ' px is not supported by your device.');
            } else if (error.name === 'PermissionDeniedError') {
                console.log('Permissions have not been granted to use your camera and ' +
                        'microphone, you need to allow the page access to your devices in ' +
                        'order for the demo to work.');
            }
            console.log('getUserMedia error: ' + error.name, error);
            alert("[DEMO] :: Unable to have access to media devices");
        });

        function stopRecordingVoice(destroy) {
            if (destroy === true) {
                self.removeBtnLoading(submitDictation);
                var d = document.querySelector(".speak_mic");
                if (d) {
                    d.remove();
                }
                localStreamAudio.getAudioTracks()[0].stop();
                shouldStop = true;
                mediaRecorderVoice.stop();
                mediaRecorderVoice = null;
            }
        }

        var handleSuccess = function (stream) {
            localStreamAudio = stream;
            self.setBtnLoading(submitDictation);

            var da = document.createElement("div");
            da.innerHTML = "";
            da.className = "speak_mic";
            da.style = "position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 100000000000;background-color: rgba(0, 0, 0, 0.43);display: flex!important;align-items: center;";
            document.querySelector(".mainContainerchatNw6").appendChild(da);

            var dsa = document.createElement("div");
            dsa.className = "speak_mic_int";
            dsa.innerHTML = "<div class='divTextEscuchando'><img src='" + rutaFiles + "img/mic.svg' /> Escuchando...</div>";
            dsa.style = "position: relative;margin: auto;background-color: #fff;padding: 15px 40px;border-radius: 5px;font-size: 25px;";
            da.appendChild(dsa);

            var ds = document.createElement("div");
            ds.className = "speak_mic_container_cancel";
            dsa.appendChild(ds);

            var d = document.createElement("div");
            d.className = "speak_mic_cancel";
            d.innerHTML = "<img src='" + rutaFiles + "img/stop_blanco.png' />Cancelar</div> ";
            d.onclick = function () {
                stopRecordingVoice(true);
            };
            ds.appendChild(d);

            var d = document.createElement("div");
            d.className = "speak_mic_cancel";
            d.innerHTML = "<img src='" + rutaFiles + "img/stop_blanco.png' /> Enviar</div>";
            d.onclick = function () {
                ds.remove();
                mediaRecorderVoice.stop();
            };
            ds.appendChild(d);

//            var options = {mimeType: 'video/webm;codecs=vp9'};
            var options = {mimeType: 'audio/webm;codecs=opus'};
            var recordedChunks = [];
            mediaRecorderVoice = new MediaRecorder(stream, options);
//            mediaRecorderVoice = new MediaRecorder(stream);

            mediaRecorderVoice.addEventListener('dataavailable', function (e) {
                console.log(e);
                if (e.data.size > 0) {
                    recordedChunks.push(e.data);
                }

                if (shouldStop === true && stopped === false && mediaRecorderVoice !== null) {
                    mediaRecorderVoice.stop();
                    stopped = true;
                }
            });

            mediaRecorderVoice.addEventListener('stop', function () {
                console.log("mediaRecorderVoice stop");

                var blob = new Blob(recordedChunks, {type: "mp3"});
                var url = URL.createObjectURL(blob);
                var fileName = getFileName('mp3');
                var fileObject = new File([blob], fileName, {
                    type: 'video/mp4'
                });

                uploadToPHPServer(fileObject, function (response, fileDownloadURL) {
//                    if (signal_live === "alive") {
//                        var upload_directory = "/imagenes/";
//                        var initialURL = upload_directory + fileObject.name;
//                        var text = "<audio class='player_audio' src='" + initialURL + "' controls></audio>";
//                        sendMessagePeer({message: text});
//
//                        var d = document.querySelector(".speak_mic");
//                        if (d) {
//                            d.innerHTML = 'Successfully uploaded recorded audio';
//                            d.remove();
//                        }
//                        sendMessagePeer({message: "stop_recording_voice"});
//                    }
                    if (response !== 'ended') {
                        console.log("upload progress", response);
                        var d = document.querySelector(".speak_mic_int");
                        if (d) {
                            d.innerHTML = "Subiendo " + response; // upload progress
                        }
                        return;
                    }
                    console.log("fileDownloadURL", fileDownloadURL);
//                    document.body.innerHTML = '<a href="' + fileDownloadURL + '" target="_blank">' + fileDownloadURL + '</a>';
                    console.log('Successfully uploaded recorded blob.');

                    self.removeBtnLoading(submitDictation);
                    var d = document.querySelector(".speak_mic");
                    if (d) {
                        d.innerHTML = 'Successfully uploaded recorded audio';
                        d.remove();
                    }
                    shouldStop = true;
                    mediaRecorderVoice = null;

                    callback(domain + fileDownloadURL);
                });
                function uploadToPHPServer(blob, callback) {
                    var formData = new FormData();
                    formData.append('video-filename', blob.name);
                    formData.append('video-blob', blob);
                    formData.append('room', room);
                    formData.append('id_call', room);
//                    formData.append('time', rtcNw.containTimeHours.innerHTML + ':' + rtcNw.containTimeMinutes.innerHTML + ':' + rtcNw.containTimeSeconds.innerHTML);
                    formData.append('time', "00:00:00");
                    formData.append('id_call', room);

                    callback('Uploading recorded-file to server.');
//                    var upload_url = domain + '/nwlib6/nwproject/modules/webrtc/v4/srv/saveRecordVideo.php';
                    var upload_url = domain + '/nwlib6/nwproject/modules/webrtc/v6/chat/saveRecordVideo.php';
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
                    var name = 'RecordRTC-audio-room-' + room + '-' + year + month + date + '-' + hour + ':' + minutes + ':' + seconds + '.' + fileExtension;
                    return name;
                }
            });
            mediaRecorderVoice.start();
        };
    },
    scrollPage: function (p, vel, toped, divScroll) {
        var self = this;
        if (!self.evalueData(vel)) {
            vel = 2000;
        }
        if (!self.evalueData(toped)) {
            toped = 100;
        }
        var pos = $(p).offset();
        if (!self.evalueData(pos)) {
            return;
        }
        var topp = parseInt(pos.top) - parseInt(toped);
        var divMoveScroll = "html, body";
        if (self.evalueData(divScroll)) {
            divMoveScroll = divScroll;
        }
        $(divMoveScroll).animate({
            scrollTop: topp
        }, parseInt(vel));
    },
    getExtensionFile: function (archivo) {
        return (archivo.substring(archivo.lastIndexOf("."))).toLowerCase();
    },
    getFileByType: function (file, w, mode, moreInfo) {
        var self = this;
        if (!self.evalueData(file)) {
            return "";
        }
        if (self.evalueData(w) === false) {
            w = "200";
        }
        var fileReal = file;
        if (typeof file.split("?")[1] !== "undefined") {
            file = file.split("?")[0];
        }
        var fileTreated = file;
        var extensiones_img = new Array(".gif", ".jpg", ".png", ".JPG", ".JPEG", ".jpeg", ".PNG", ".GIF", ".svg", ".SVG", ".bmp", ".BMP", ".tif", ".TIF");
        var extensiones_pdf = new Array(".pdf", ".PDF");
        var extensiones_excel = new Array(".xls", ".XLS", ".xlsx", ".XLSX");
        var extensiones_word = new Array(".doc", ".DOC", ".docx", ".DOCX", ".odt", ".ODT");
        var extensiones_apk = new Array(".apk", ".APK");
        var extensiones_html = new Array(".html", ".htm", ".HTML", ".HTM");
        var extensiones_zip = new Array(".zip", ".ZIP", ".rar", ".RAR", ".tar", ".TAR", ".war", ".WAR");
        var ext = self.getExtensionFile(file);
        var extreate = false;
        var phpthumb = "/nwlib6/includes/phpthumb/phpThumb.php?src=";
        var phpthumbEnd = "&w=" + w + "&f=";
        if (mode == "nophpthumb") {
            phpthumb = "";
            phpthumbEnd = "";
        }
        var isImage = false;
        for (var i = 0; i < extensiones_img.length; i++) {
            if (extensiones_img[i] == ext) {
                ext = ext.replace(".", "");
                if (phpthumbEnd == "") {
                    ext = "";
                }
                file = phpthumb + file + phpthumbEnd + ext;
                extreate = true;
                isImage = true;
                break;
            }
        }
        for (var i = 0; i < extensiones_pdf.length; i++) {
            if (extensiones_pdf[i] == ext) {
                file = wnw.domainSrv + "/nwlib6/icons/48/pdf.png";
                extreate = true;
                break;
            }
        }
        for (var i = 0; i < extensiones_word.length; i++) {
            if (extensiones_word[i] == ext) {
                file = wnw.domainSrv + "/nwlib6/icons/48/word.png";
                extreate = true;
                break;
            }
        }
        for (var i = 0; i < extensiones_excel.length; i++) {
            if (extensiones_excel[i] == ext) {
                file = wnw.domainSrv + "/nwlib6/icons/48/excel.png";
                extreate = true;
                break;
            }
        }
        for (var i = 0; i < extensiones_apk.length; i++) {
            if (extensiones_apk[i] == ext) {
                file = wnw.domainSrv + "/nwlib6/icons/apk_icon.png";
                extreate = true;
                break;
            }
        }
        for (var i = 0; i < extensiones_html.length; i++) {
            if (extensiones_html[i] == ext) {
                file = wnw.domainSrv + "/nwlib6/icons/html_48.png";
                extreate = true;
                break;
            }
        }
        for (var i = 0; i < extensiones_zip.length; i++) {
            if (extensiones_zip[i] == ext) {
                file = wnw.domainSrv + "/nwlib6/icons/zip.svg";
                extreate = true;
                break;
            }
        }
        if (extreate === false) {
            file = wnw.domainSrv + "/nwlib6/icons/attachment1.png";
//            file = wnw.domainSrv + "/nwlib6/icons/attachment2.png";
//            file = wnw.domainSrv + "/nwlib6/icons/attach_file_white_48dp.png";
        }
        if (moreInfo === true) {
            var a = {};
            a.isImage = isImage;
            a.extension = ext;
            a.fileEnd = file;
            a.fileReal = fileReal;
            a.fileTreated = fileTreated;
            return a;
        }
        return file;
    },
    remove: function (className) {
        var d = document.querySelectorAll(className);
        for (var i = 0; i < d.length; i++) {
            d[i].remove();
        }
    },
    menuFloat: function (elementContainer, links) {
        var self = this;
//        console.log("elementContainer", elementContainer);
//        self.remove(".containMenuFloatShowChat");
        self.remove(".containMenuFloatChat");
//            nw.find(elementContainer, ".containMenuFloat").remove();

        var d = document.createElement("div");
        d.className = "containMenuFloatChat";
//        elementContainer.appendChild(d);
        elementContainer.insertBefore(d, elementContainer.firstChild)

        self.removeClass(elementContainer, "elementContainerMenuFloatChat", true);
        self.addClass(elementContainer, "elementContainerMenuFloatChat");

//            elementContainer.onmouseover = function () {
//                d.remove();
//            };
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            var addClass = "";
            if (typeof link.addClass !== "undefined") {
                addClass = link.addClass;
            }
            var nameuserclean = "";
            if (typeof link.nameuserclean !== "undefined") {
                nameuserclean = "nameuserclean_" + link.nameuserclean;
            }
            var li = document.createElement("li");
            li.className = "containMenuFloatLinkChat " + addClass + " " + nameuserclean;
//            li.data = link;
            li.data = {link: link, element: d};
            li.onclick = function (event) {
                event.preventDefault();
                var link = this.data.link;
                link.callback(this);
                self.removeClass(this.data.element, "containMenuFloatShowChat", true);
                setTimeout(function () {
                    self.remove(".containMenuFloatChat");
                }, 500);
            };
            li.innerHTML = "<span>" + link.text + "</span>";
            d.appendChild(li);
        }
        setTimeout(function () {
            self.addClass(d, "containMenuFloatShowChat");
        }, 3);
        return d;
    },
    dialog: function (params) {
        var d = document.createElement("div");
        d.className = "dialogChatNw";
        d.innerHTML = "<div class='dialogChatNwInt'>" + params.html + "</div>";
        wnw.container.appendChild(d);

        var c = document.createElement("div");
        c.className = "dialogChatNwClose";
        c.innerHTML = "x";
        c.onclick = function () {
            d.remove();
        };
        d.querySelector(".dialogChatNwInt").appendChild(c);
        return d;
    },
    getMobileOperatingSystem: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "WINDOWS_PHONE";
        }
        if (/android/i.test(userAgent)) {
            return "ANDROID";
        }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "IOS";
        }
        return "NONE";
    },
    getDevice: function () {
        var isMobile = {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        var rta = false;
        var r = isMobile.any();
        if (r !== null) {
            rta = r;
        }
        return rta;
    },
    getDevType: function () {
        var ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (
                /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                        ua
                        )
                ) {
            return "mobile";
        }
        return "desktop";
    },
    infoDevice: function () {
        var info = {
            timeOpened: new Date(),
            timezone: (new Date()).getTimezoneOffset() / 60,
            pageon: window.location.pathname,
            referrer: document.referrer,
            previousSites: history.length,
            browserName: navigator.appName,
            browserEngine: navigator.product,
            browserVersion1a: navigator.appVersion,
            browserVersion1b: navigator.userAgent,
            browserLanguage: navigator.language,
            browserOnline: navigator.onLine,
            browserPlatform: navigator.platform,
            javaEnabled: navigator.javaEnabled(),
            sizeScreenW: screen.width,
            sizeScreenH: screen.height,
            sizeDocW: document.width,
            sizeDocH: document.height,
            sizeInW: innerWidth,
            sizeInH: innerHeight,
            sizeAvailW: screen.availWidth,
            sizeAvailH: screen.availHeight,
            latitude: wnw.latitude,
            longitude: wnw.longitude
        };
        return info;
    },
    appMode: function () {
        if (typeof cordova !== "undefined") {
            if (typeof cordova.platformId !== "undefined") {
                if (cordova.platformId !== "browser") {
                    return "in_app";
                }
            }
        }
        return "out_app";
    },
    isMobile: function () {
        var device = navigator.userAgent;
        if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
        {
            return true;
        }
        return false;
    },
    loadCss: function (url, div, onlyAdd, callback) {
        var self = this;
        if (document.createStyleSheet) {
            document.createStyleSheet(url);
        } else {
            var id = url.replace(/\//gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(/\{/gi, "");
            id = id.replace(/\}/gi, "");
            id = id.replace(".", "");
            var styles = url;
            var ob = document.createElement('link');
            ob.id = id;
            ob.rel = 'stylesheet';
            ob.type = 'text/css';
            ob.href = styles;
            ob.onload = function () {
                if (self.evalueData(callback)) {
                    callback();
                }
            };
            if (onlyAdd === true) {
                document.getElementsByTagName("head")[0].appendChild(ob);
            } else {
                var style = document.querySelector("#" + id);
                if (!self.evalueData(style)) {
                    if (self.evalueData(div)) {
                        $(div).append(ob);
                    } else {
                        document.getElementsByTagName("head")[0].appendChild(ob);
                    }
                }
            }
        }
    },
    cargaJs: function (url, callback, idDiv, async) {
        var self = this;
        var version = "v=0";
        url = url + version;
        try {
            var id = url.replace(/\//gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(/-/gi, "");
            id = id.replace(/\#/gi, "");
            id = id.replace(/#/gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(/:/gi, "");
            id = id.replace(/{/gi, "");
            id = id.replace(/}/gi, "");
            id = id.replace(".", "");
            if (self.evalueData(idDiv)) {
                id = idDiv;
            }
            var a = document.createElement("script");
            a.type = "text/javascript";
            a.charset = "UTF-8";
            a.async = "async";
            a.src = url;
            a.id = id;
            var style = document.querySelector("#" + id);
            if (!style) {
                a.onload = function () {
                    if (self.evalueData(callback)) {
                        callback();
                    }
                };
                if (async === true) {
                    document.getElementsByTagName('head')[0].appendChild(a);
                } else {
                    $("body").append(a);
                }
            } else {
                if (self.evalueData(callback)) {
                    callback();
                }
            }
        } catch (e) {
            console.log(e);
        }
    },
    str_replace: function (fields, fieldsChange, variable) {
        var replace = fields;
        var re = new RegExp(replace, "g");
        var str = variable.replace(re, fieldsChange);
        return str;
    },
    removeDuplicates: function (originalArray, prop) {
        var newArray = [];
        var lookupObject = {};

        for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    },
    isOnline: function () {
        if (!navigator.onLine) {
            return false;
        }
        if (typeof navigator.connection !== "undefined") {
//            console.log("navigator.connection", navigator.connection);
            if (navigator.connection.type === "none") {
                return false;
            }
            return true;
        }
        return navigator.onLine;
    },
    createRandomId: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
};