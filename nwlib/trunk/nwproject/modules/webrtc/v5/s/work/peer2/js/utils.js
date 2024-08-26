var utils = {
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
    renderHTML: function (text, encodeUri) {
        var self = this;
        var rawText = self.strip(text);
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
    },
    urlify: function (text) {
        var self = this;
        text = text.replace(/ampersanNW/gi, "&");
        var rawText = self.strip(text);
        rawText = /(https?:\/\/[^\s]+)/g;
        return text.replace(rawText, function (url) {
            return '<a href="' + url + '" target="_BLANK">' + url + '</a>';
        });
    },
    strip: function (html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return tmp.innerText.replace(urlRegex, function (url) {
            return '\n' + url;
        });
    },
    strip_tags: function (str) {
        var self = this;
        if (!self.evalueData(str)) {
            return "";
        }
        str = str.toString();
        return str.replace(/<\/?[^>]+>/gi, '');
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
    scrollBottomMessages: function () {
        var s = document.querySelectorAll('.contentChat .messages')[0];
        if (s) {
            var h = s.scrollHeight;
            var c = document.querySelector('.contentChat .messages');
            c.scrollTop = h;
        }
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
    isMobile: function () {
        var device = navigator.userAgent;
        if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
        {
            return true;
        }
        return false;
    },
    isOnline: function () {
        return navigator.onLine;
    }, removeDictation: function () {
        var s = document.querySelector(".speak_mic");
        if (s) {
            s.remove();
        }
    },
    startDictation: function (div) {
        var self = this;
        // checking by google
        if (!('webkitSpeechRecognition' in window)) {
            console.log('GOOGLE: not working on this browser');
        } else {
            console.log('GOOGLE: working');
        }

//your way
        if (window.hasOwnProperty('webkitSpeechRecognition')) {
            console.log('YOUR: working');
        } else {
            console.log('YOUR: not working on this browser');
        }
        if (!('webkitSpeechRecognition' in window)) {
            alert("La API de voz a texto no está disponible para este navegador. Prueba con Google Chrome o Mozilla Firefox.");
            return false;
        }
        if (window.hasOwnProperty('webkitSpeechRecognition')) {
            self.removeDictation();

            var send_auto_voice_text = false;
            var da = window.localStorage.getItem(rtcNw.nameConference + "send_auto_voice_text");
            if (da === "SI") {
                send_auto_voice_text = true;
            } else
            if (da === "NO") {
                send_auto_voice_text = false;
            }

            var stopOverVoice = true;
            var da = window.localStorage.getItem(rtcNw.nameConference + "select_voice_text_detener");
            if (da === "SI") {
                stopOverVoice = true;
            } else
            if (da === "NO") {
                stopOverVoice = false;
            }

            var recognition = new webkitSpeechRecognition();
            if (stopOverVoice === true) {
                recognition.continuous = false;
                recognition.interimResults = false;
            } else {
                recognition.continuous = true;
                recognition.interimResults = true;
            }
            recognition.lang = "es-COL";
            recognition.start();

            recognition.onstart = function () {
            };
            recognition.onresult = function (e) {
                if (stopOverVoice === true) {
                    document.querySelector(div).value = e.results[0][0].transcript;
                    recognition.stop();
                    self.removeDictation();
                } else {
                    for (var i = e.resultIndex; i < e.results.length; i++) {
                        if (e.results[i].isFinal)
                            document.querySelector(div).value += e.results[i][0].transcript;
                    }
                }
            };
            recognition.onerror = function (e) {
                recognition.stop();
                self.removeDictation();
            };
            recognition.onend = function () {
                recognition.stop();
                self.removeDictation();
                if (send_auto_voice_text === true) {
                    document.querySelector(".btnsubmit").click();
                }
            };

            var d = document.createElement("div");
            d.innerHTML = "<div class='speak_mic_int' style='position: relative;margin: auto;background-color: #fff;padding: 15px 40px;border-radius: 5px;font-size: 25px;'><img src='img/mic.svg' /> Escuchando...</div>";
            d.className = "speak_mic";
            d.style = "position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 100000000000;background-color: rgba(0, 0, 0, 0.43);display: flex!important;align-items: center;";
            document.querySelector(".containerChat").appendChild(d);

            var d = document.createElement("div");
            d.className = "speak_mic_cancel";
            d.innerHTML = "<img src='img/stop_blanco.png' /> Detener</div>";
            d.onclick = function () {
                recognition.stop();
                self.removeDictation();
            };
            document.querySelector(".speak_mic_int").appendChild(d);
        }
    },
    getExtensionFile: function (archivo) {
        return (archivo.substring(archivo.lastIndexOf("."))).toLowerCase();
    },
    getFileByType: function (file, mode, w) {
        var self = this;
        if (self.evalueData(w) === false) {
            w = "200";
        }
        if (self.evalueData(mode) === false) {
            mode = "nophpthumb";
        }
        var extensiones_img = new Array(".gif", ".jpg", ".png", ".JPG", ".JPEG", ".jpeg", ".PNG", ".GIF");
        var extensiones_pdf = new Array(".pdf");
        var extensiones_excel = new Array(".xls", ".xlsx");
        var extensiones_word = new Array(".doc", ".docx");
        var ext = self.getExtensionFile(file);
        var extreate = false;
        var phpthumb = "/nwlib6/includes/phpthumb/phpThumb.php?src=";
        var phpthumbEnd = "&w=" + w + "&f=";
        if (mode === "nophpthumb") {
            phpthumb = "";
            phpthumbEnd = "";
        }
        for (var i = 0; i < extensiones_img.length; i++) {
            if (extensiones_img[i] == ext) {
                ext = ext.replace(".", "");
                if (phpthumbEnd == "") {
                    ext = "";
                }
                file = phpthumb + file + phpthumbEnd + ext;
                extreate = true;
                break;
            }
        }
        for (var i = 0; i < extensiones_pdf.length; i++) {
            if (extensiones_pdf[i] == ext) {
                file = "/nwlib6/icons/48/pdf.png";
                extreate = true;
                break;
            }
        }
        for (var i = 0; i < extensiones_word.length; i++) {
            if (extensiones_word[i] == ext) {
                file = "/nwlib6/icons/48/word.png";
                extreate = true;
                break;
            }
        }
        for (var i = 0; i < extensiones_excel.length; i++) {
            if (extensiones_excel[i] == ext) {
                file = "/nwlib6/icons/48/excel.png";
                extreate = true;
                break;
            }
        }
        if (extreate === false) {
            file = "/nwlib6/icons/48/upload.png";
        }
        return file;
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
    }
};

var NWMUtils = function () {
    var utils = utils;
    utils.apply(this, arguments);
    this.createElement = function (type, className, mode) {
        var elm = document.createElement(type);
        elm.className = className;
        if (typeof mode == "object") {
            if (typeof mode.src != "undefined") {
                elm.src = mode.src;
            }
        }
        return elm;
    };
};
