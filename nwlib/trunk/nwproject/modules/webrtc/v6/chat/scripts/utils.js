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

function cleanUserNwC(u) {
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
}

function evalueData(d, exception) {
    if (typeof d === "undefined") {
        return false;
    }
    if (evalueData(exception)) {
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
}

function addClass(el, cls) {
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
}

function removeClass(el, cls, isWidget) {
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
}

function notificationPushNwrtc(theBody, theIcon, theTitle, callback) {
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
}


function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getActualFullDate(format) {
    var hoy = getActualDate(format);
    var hour = getActualHour(format);
    if (format == "datetime-local") {
        return hoy + "T" + hour;
    }
    return hoy + " " + hour;
}
function getActualHour(format) {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    if (format == "datetime-local") {
        return h + ":" + m;
    }
    return h + ":" + m + ":" + s;
}
function getActualDate(format) {
    var d = new Date();
    var day = addZero(d.getDate());
    var month = addZero(d.getMonth() + 1);
    var year = addZero(d.getFullYear());
    return year + "-" + month + "-" + day;
}

function diffEntreFechas(fechaIni, fechaFin) {
    if (fechaFin == undefined) {
        fechaFin = getActualFullDate();
    }
    var diaEnMils = 1000 * 60 * 60 * 24,
            desde = new Date(fechaIni.substr(0, 10)),
            hasta = new Date(fechaFin.substr(0, 10)),
            diff = hasta.getTime() - desde.getTime() + diaEnMils;/* +1 incluir el dia de ini*/

    var r = diff / diaEnMils;
    r = r - 1;
    return r;
}

function lettersArray(i) {
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
}
function mesesArray(i) {
    return lettersArray(i);
}
function mesTextEnglish(i) {
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
}

function semanadelanio(date) {
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
}

function dataOfDate(date) {
    var onlyF = date;
    if (date == undefined) {
        date = getActualFullDate();
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
    r.fecha_mes_text = lettersArray(r.fecha_mes);
    r.fecha_mes_text_english = mesTextEnglish(r.fecha_mes_string);
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
    r.semana = semanadelanio(r.fecha);
    r.hora_ex = d.getTime();
    r.hora_horas = d.getHours();
    r.hora_minutos = d.getMinutes();
    r.hora_segundos = d.getSeconds();
    r.hora_completa = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    return r;
}

function calcularTiempoDosFechas(date1, date2, abreviado) {
    if (typeof date2 === "undefined" || !evalueData(date2)) {
        date2 = getActualFullDate();
    }
    var hoy = getActualFullDate();
    var start_actual_time = new Date(date1);
    var end_actual_time = new Date(date2);
    var diff = end_actual_time - start_actual_time;
    var diffSeconds = diff / 1000;
    var HH = Math.floor(diffSeconds / 3600);
    var MM = Math.floor(diffSeconds % 3600) / 60;
    var SS = diffSeconds % 60;
    var days = diffEntreFechas(date1, date2);
    var hours = (HH < 10) ? ("0" + HH) : HH;
    var infoDate = dataOfDate(date1);
//        var infoDate2 = nw.dataOfDate(hoy);
    var infoDate2 = dataOfDate(date2);
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
}

function setHoursMsg(classOrID) {
    var d = document.querySelectorAll(classOrID);
    if (d.length > 0) {
        for (var i = 0; i < d.length; i++) {
            var ro = d[i];
            if (ro) {
                var fecha = ro.getAttribute("data-date");
                var dateFormat = calcularTiempoDosFechas(fecha);
                var valueDate = dateFormat.dateInFormat;
                ro.innerHTML = valueDate;
            }
        }
    }
}

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return tmp.innerText.replace(urlRegex, function (url) {
        return '\n' + url;
    });
}

function renderHTML(text, encodeUri, clean) {
    var rawText = strip(text);
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
        return '<a href="' + url + '" target="_BLANK">' + url + '</a>' + '<br/>';
    });
}

function haveUrlString(text) {
    var have = false;
    var rawText = strip(text);
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    rawText.replace(urlRegex, function (url) {
        have = true;
    });
    return have;
}


function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}

function setBtnLoading(widget) {
    addClass(widget, "events_click_none");
    var span = document.createElement("span");
    span.className = "cEftVf loading_into_btn";
    widget.appendChild(span);
}
function removeBtnLoading(widget) {
    console.log(widget)
    if (widget) {
        removeClass(widget, "events_click_none", true);
        var d = widget.querySelector(".loading_into_btn");
        if (d) {
            d.remove();
        }
    }
}

function initRecordVoice() {
    var get = getGET();
    domain = window.location.protocol + "//" + window.location.host;
    rutaFiles = "/nwlib6/nwproject/modules/webrtc/v4/";
    room = get.room;
    console.log("init")
    var shouldStop = false;
    var stopped = false;

    shouldStop = false;
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(function (stream) {
        console.log("[DEMO] :: Get user media ok... Enumerate devices...");
        handleSuccess(stream);
    }).catch(function (error) {
        alert("[DEMO] :: Unable to have access to media devices");
        console.log("[DEMO] :: Unable to have access to media devices", error);
    });

    function stopRecordingVoice(destroy) {
        if (destroy === true) {
            removeBtnLoading(submitDictation);
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
        setBtnLoading(submitDictation);

        var da = document.createElement("div");
        da.innerHTML = "";
        da.className = "speak_mic";
        da.style = "position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 100000000000;background-color: rgba(0, 0, 0, 0.43);display: flex!important;align-items: center;";
        document.querySelector(".mdl-layout__container").appendChild(da);

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

        var options = {mimeType: 'video/webm;codecs=vp9'};
        var recordedChunks = [];
        mediaRecorderVoice = new MediaRecorder(stream, options);

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

                removeBtnLoading(submitDictation);
                var d = document.querySelector(".speak_mic");
                if (d) {
                    d.innerHTML = 'Successfully uploaded recorded audio';
                    d.remove();
                }
                shouldStop = true;
                mediaRecorderVoice = null;


                messageInputElement.value = domain + fileDownloadURL;
                onMessageFormSubmit();


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
                var upload_url = domain + '/nwlib6/nwproject/modules/webrtc/v4/srv/saveRecordVideo.php';
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
}