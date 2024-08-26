nwrtc = false;
__domainRingow = "";
__notifyEncRingow = {};
__configRingow = false;
__isRingowCh = false;
__addCssWinRingow = false;
__heiRingow = 450;
__heiRingowOut = 510;
__bottomRingow = 41;
__bottomMinRingow = 40;
__bottomMaxRingow = __heiRingow + 25;
__containerConversBarRingow = "body";
__ringowDataGeo = {};

validateCallBackRingow();

function validateCallBackRingow() {
    var get = getDataRingowJS();
    if (typeof get.callback !== "undefined") {
        var fn = window[get.callback];
        if (typeof fn === 'function') {
            fn();
        }
    }
}

function urlGetDataRingow() {
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

function getDataRingowJS() {
    var query = document.getElementById("nwRtcMaker").src.match(/\?.*$/);
    query[0] = query[0].replace("?", "");
    var GET = query[0].split("&");
    var get = {};
    for (var i = 0, l = GET.length; i < l; i++) {
        var tmp = GET[i].split('=');
        get[tmp[0]] = unescape(decodeURI(tmp[1]));
    }
    return get;
}

function startRingow() {
    var get = getDataRingowJS();
    var nwrct = new nwRct();
    nwrct.start(get.id, get.key, true);
}

function nwRct() {
    var self = this;
    self.start = start;
    self.startConversation = startConversation;
    self.activeNotificationsByUser = activeNotificationsByUser;
    self.activeConversationBar = activeConversationBar;
    self.protocol = "https:";
    var p = document.querySelector("#nwRtcMaker").getAttribute("src");
    if (p.indexOf("https") == -1) {
        self.protocol = "http:";
    }
    var h = p.split(self.protocol);
    var hh = h[1].split("//");
    var hhh = hh[1].split("/");
    var dom = hhh[0];
    self.domain = dom;
    nwrtc = this;
    __domainRingow = self.protocol + "//" + self.domain;
    __hostInSiteRingow = cleanUserNwRingow(location.host);
    self.dataGeo = false;

    function start(id, apikey, isringow, embed, dataEmbed) {
        __idnwrtc = id;
        __apikeynwrtc = apikey;
        __isRingowCh = isringow;
        if (isringow === true) {
            var rurl = 'https://ipapi.co/json/';
            function reqListener() {
                var data = JSON.parse(this.responseText);
                self.dataGeo = data;
                __ringowDataGeo = data;
                if (embed !== true) {
                    openFrameUp(data.country_name, data.city);
                } else {
                    sendConfigurationRingow(dataEmbed);
                }
            }
            function reqError(err) {
                console.log('Fetch Error :-S', err);
                if (embed !== true) {
                    openFrameUp();
                } else {
                    sendConfigurationRingow(dataEmbed);
                }
            }
            var oReq = new XMLHttpRequest();
            oReq.onload = reqListener;
            oReq.onerror = reqError;
            oReq.open('get', rurl, true);
            oReq.send();
        }
    }

    function openFrameUp(country, city) {
        var get = urlGetDataRingow();
        var getjs = getDataRingowJS();
        var id = __idnwrtc;
        var apikey = __apikeynwrtc;
        var lang = navigator.language;
        if (typeof country === "undefined") {
            country = lang;
        }
        if (typeof city === "undefined") {
            city = lang;
        }
        var url = self.protocol + "//" + self.domain + "/nwlib6/nwproject/modules/webrtc/testing/two/up.php?term=" + id + "&apikey=" + apikey + "&domain=" + location.origin + "&origin=" + location.href + "&lang=" + lang + "&country=" + country + "&city=" + city;
        url += "&host=" + location.host;
        if (get) {
            if (typeof get.viewBYRingowOperator !== "undefined") {
                url += "&viewBYRingowOperator=true";
            }
        }
        if (getjs) {
            if (typeof getjs.visitas_tiempo_real !== "undefined") {
                url += "&visitas_tiempo_real=" + getjs.visitas_tiempo_real;
            }
            if (typeof getjs.usar_bot !== "undefined") {
                url += "&usar_bot=" + getjs.usar_bot;
            }
            if (typeof getjs.tiempo_abrir_chat_auto !== "undefined") {
                url += "&tiempo_abrir_chat_auto=" + getjs.tiempo_abrir_chat_auto;
            }
            if (typeof getjs.abrir_chat_automaticamente !== "undefined") {
                url += "&abrir_chat_automaticamente=" + getjs.abrir_chat_automaticamente;
            }
            if (typeof getjs.requiere_redireccion_a_seccion !== "undefined") {
                url += "&requiere_redireccion_a_seccion=" + getjs.requiere_redireccion_a_seccion;
            }
            if (typeof getjs.enviar_emails !== "undefined") {
                url += "&enviar_emails=" + getjs.enviar_emails;
            }
            if (typeof getjs.offline_recibir_mensaje !== "undefined") {
                url += "&offline_recibir_mensaje=" + getjs.offline_recibir_mensaje;
            }
            if (typeof getjs.offline_mensaje !== "undefined") {
                url += "&offline_mensaje=" + getjs.offline_mensaje;
            }
            if (typeof getjs.show_btn_fixed !== "undefined") {
                url += "&show_btn_fixed=" + getjs.show_btn_fixed;
            }
            if (typeof getjs.copym !== "undefined") {
                url += "&copym=" + getjs.copym;
            }
        }
        if (location.href.indexOf("ringowEmbed") !== -1) {
            url += "&ringow_popup=true";
        }
        var f = document.createElement("iframe");
        f.id = "iframeRingowUp";
        f.className = "iframeRingowUp";
        f.style = "display:none;";
        f.src = url;
        document.body.appendChild(f);
        document.querySelector(".iframeRingowUp").style.display = "none";
    }

    function activeNotificationsByUser(user) {
        var f = document.createElement("iframe");
        f.className = "activeNotificationsByUser";
        f.style = "display:none;";
        f.src = self.protocol + "//" + self.domain + "/nwlib6/nwproject/modules/webrtc/testing/two/consMsg.php?term=" + __idnwrtc + "&apikey=" + __apikeynwrtc + "&user=" + user;
        document.body.appendChild(f);
        document.querySelector(".activeNotificationsByUser").style = "display:none;";
    }
    function activeConversationBar(user, container) {
        if (typeof container !== "undefined") {
            __containerConversBarRingow = container;
        }
        var f = document.createElement("iframe");
        f.className = "activeConversationBarData";
        f.src = self.protocol + "//" + self.domain + "/nwlib6/nwproject/modules/webrtc/testing/two/activeConversationBar.php?term=" + __idnwrtc + "&apikey=" + __apikeynwrtc + "&user=" + user;
        document.body.appendChild(f);
        document.querySelector(".activeConversationBarData").style = "display:none;";
    }

    function omitirAcentos(text) {
        var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
        var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
        for (var i = 0; i < acentos.length; i++) {
            text = text.replace(acentos.charAt(i), original.charAt(i));
        }
        return text;
    }

    function startConversation(userOne, userTwo, type, mode, isgroup, openForm, dataOpenForm, lienzo) {
        var getjs = getDataRingowJS();
        normalizeBodyRingow("open");
        var country = "";
        var city = "";
        var username = userOne;
        var username_show = false;
        var userphoto = false;
        var usernametwo = userTwo;
        var usernametwo_show = false;
        var usernametwo_show_enc = usernametwo;
        var userphototwo = false;
        var usarPlantillas = "";
        if (typeof userOne === "object") {
            if (typeof userOne.username !== "undefined") {
                username = userOne.username;
            }
            if (typeof userOne.username_show !== "undefined") {
                username_show = userOne.username_show;
            }
            if (typeof userOne.photo !== "undefined") {
                userphoto = userOne.photo;
            }
            if (typeof userOne.usarPlantillas !== "undefined") {
                usarPlantillas = "&usarPlantillas=true";
            }
            if (typeof userOne.country !== "undefined") {
                country = userOne.country;
            }
            if (typeof userOne.city !== "undefined") {
                city = userOne.city;
            }
        }
        if (typeof userTwo === "object") {
            if (typeof userTwo.username !== "undefined") {
                usernametwo = userTwo.username;
                usernametwo_show_enc = usernametwo;
            }
            if (typeof userTwo.username_show !== "undefined") {
                usernametwo_show_enc = userTwo.username_show;
                usernametwo_show = userTwo.username_show;
            }
            if (typeof userTwo.photo !== "undefined") {
                userphototwo = userTwo.photo;
            }
        }
        usernametwo = usernametwo.replace(/,/gi, '_');
        usernametwo = usernametwo.replace(/\,/gi, '_');

        var us = cleanUserNwRingow(usernametwo);
        __myUserClientRingow = us;
        var classt = "conversnwrtc_" + us;
        __classtGlobalyConvRing = classt;
        var href = location.href;
        if (typeof getjs.videocall !== "undefined") {
            if (getjs.videocall === "true") {
//                href = href.replace("/videocallnw", "?onlyVideo=true&callingVideo=true");
//                href = href + "?onlyVideo=true&callingVideo=true";
            }
        }
        href = href.replace(/#/gi, "(nwhashtag)");
        href = href.replace(/&/gi, "(nwampersan)");
        href = href.replace(/\?/gi, "(nwinitget)");
        var main = "index.php";
        if (openForm === true && typeof getjs.videocall === "undefined") {
            main = "openForm.php";
        }
        if (typeof dataOpenForm !== "undefined") {
            if (typeof dataOpenForm.embed !== "undefined" && typeof dataOpenForm.edita_asesor !== "undefined" && typeof dataOpenForm.id_enc !== "undefined") {
                main = "openForm.php";
            }
        }
        var url = self.protocol + "//" + self.domain + "/nwlib6/nwproject/modules/webrtc/testing/two/" + main;
        url += "?t=" + __idnwrtc + ",op=" + username + ",cli=" + usernametwo;
        url += "&apikey=" + __apikeynwrtc;
        if (username_show !== false)
            url += "&username_show=" + username_show;
        if (usernametwo_show !== false)
            url += "&usernametwo_show=" + usernametwo_show;
        if (type === "chat") {
            url += "&chat=true";
        } else
        if (type === "audio") {
            url += "&audio=true&video=false";
        }
        if (userphoto !== false) {
            url += "&userphoto=" + userphoto;
        }
        if (userphototwo !== false) {
            url += "&userphotorecibe=" + userphototwo;
        }
        if (typeof getjs.videocall !== "undefined") {
            if (getjs.videocall === "true") {
                url += "&audio=true&video=true&onlyVideo=true&callingVideo=true";
                url += "&chat=false";
            }
        }
        url += "&classt=" + classt;
        url += "&domain=" + self.domain;
        url += "&href=" + href;

        if (self.dataGeo !== false) {
            url += "&ip=" + self.dataGeo.ip;
            url += "&country=" + omitirAcentos(self.dataGeo.country_name);
            url += "&city=" + omitirAcentos(self.dataGeo.city);
            country = omitirAcentos(self.dataGeo.country_name);
            city = omitirAcentos(self.dataGeo.city);
        }

        if (typeof isgroup !== "undefined") {
            if (isgroup !== null && isgroup !== false && isgroup !== "") {
                if (isgroup === true) {
                    url += "&namegroupgeneral=" + isgroup;
                }
            }
        }
        var bottom = __heiRingow - __bottomRingow;
        var poscontainer = "position: fixed;bottom: 0;z-index: 1000000000000;height: 0;width: auto;right: 3px;";
        var colprin = "#0072ce";
        var position = "position: relative; bottom: " + __heiRingow + "px;";
        var remove = true;
        if (__configRingow !== false) {
            var co = __configRingow;
            if (typeof co.color_principal !== "undefined") {
                colprin = co.color_principal;
            }
            if (typeof co.position !== "undefined") {
                if (co.position === "bottom_right") {
                    bottom = __heiRingowOut;
                    position = "position:fixed;bottom:" + __bottomRingow + "px;right:10px;";
                } else
                if (co.position === "bottom_left") {
                    bottom = __heiRingowOut;
                    position = "position:fixed;bottom:" + __bottomRingow + "px;left:0px;";
                } else
                if (co.position === "top_right") {
                    position = "position:fixed;bottom:auto; top: 0px;right:0px;";
                } else
                if (co.position === "top_left") {
                    position = "position:fixed;bottom:auto; top: 0px;left:0px;";
                } else
                if (co.position === "center") {
                    position = "position:fixed;top: 10%;left: 40%;";
                    poscontainer += "background: rgba(0, 0, 0, 0.34901960784313724);height: 100%;width: 100%;right: 0;left: 0;top: 0;";
                } else
                if (co.position === "fullscreen") {

                }
                __bottomMinRingow = -470;
                __bottomMaxRingow = 0;
                remove = false;
            }
        }

        var isembed = false;
        var get = urlGetDataRingow();
        if (get) {
            if (typeof get.ringow_popup !== "undefined") {
                if (get.ringow_popup === "true") {
                    isembed = true;
                }
            }
        }
        if (typeof dataOpenForm !== "undefined") {
            if (typeof dataOpenForm.ringow_popup !== "undefined") {
                if (dataOpenForm.ringow_popup === "true") {
                    isembed = true;
                }
            }
        }
        if (isembed === true) {
            position = "position:fixed;top: 0%;left: 0%;width: 100%;height: 100%;margin:0px;";
        }
        if (openForm === true) {
            url += "&requiere_redireccion_a_seccion=" + dataOpenForm.requiere_redireccion_a_seccion;
            url += "&registro_usar_nombre=" + dataOpenForm.registro_usar_nombre;
            url += "&registro_usar_email=" + dataOpenForm.registro_usar_email;
            url += "&registro_usar_celular=" + dataOpenForm.registro_usar_celular;
            url += "&distribuir_llamadas=" + dataOpenForm.distribuir_llamadas;
            url += "&maxima_llamadas_agente=" + dataOpenForm.maxima_llamadas_agente;
            url += "&texto_bienvenida=" + encodeURI(dataOpenForm.texto_bienvenida.replace(/=/gi, '{igual}'));
            url += "&banner=" + dataOpenForm.banner;
            url += "&offline_recolectar_llamadas=" + dataOpenForm.offline_recolectar_llamadas;
            url += "&offline_recibir_mensaje=" + dataOpenForm.offline_recibir_mensaje;
            url += "&enviar_emails=" + dataOpenForm.enviar_emails;
            url += "&offline_mensaje=" + dataOpenForm.offline_mensaje;
            url += "&copym=" + dataOpenForm.copym;
            url += "&online=" + dataOpenForm.online;
        }
        if (typeof dataOpenForm !== "undefined") {
            console.log(dataOpenForm);
            if (typeof dataOpenForm.visitas_tiempo_real !== "undefined") {
                url += "&visitas_tiempo_real=" + dataOpenForm.visitas_tiempo_real;
            }
            if (typeof dataOpenForm.terminal !== "undefined") {
                url += "&terminal=" + dataOpenForm.terminal;
            }
            if (typeof dataOpenForm.id_enc !== "undefined") {
                url += "&id_enc=" + dataOpenForm.id_enc;
            }
            if (typeof dataOpenForm.typeCall !== "undefined") {
                url += "&typeCall=" + dataOpenForm.typeCall;
            }
            if (typeof dataOpenForm.offline !== "undefined") {
                url += "&offline=" + dataOpenForm.offline;
            }
            if (typeof dataOpenForm.status !== "undefined") {
                url += "&status=" + dataOpenForm.status;
            }
            if (typeof dataOpenForm.username !== "undefined") {
                url += "&username=" + dataOpenForm.username;
            }
            if (typeof dataOpenForm.ringow_popup !== "undefined") {
                url += "&ringow_popup=" + dataOpenForm.ringow_popup;
            }
            if (typeof dataOpenForm.getSalas !== "undefined") {
                url += "&getSalas=" + dataOpenForm.getSalas;
            }
            if (typeof dataOpenForm.texto_sala !== "undefined") {
                url += "&texto_sala=" + encodeURI(dataOpenForm.texto_sala);
            }
            if (typeof dataOpenForm.registro_usar_documento !== "undefined") {
                url += "&registro_usar_documento=" + encodeURI(dataOpenForm.registro_usar_documento);
            }
            if (typeof dataOpenForm.registro_validar_email !== "undefined") {
                url += "&registro_validar_email=" + encodeURI(dataOpenForm.registro_validar_email);
            }
            if (typeof dataOpenForm.registro_usar_recaptcha !== "undefined") {
                url += "&registro_usar_recaptcha=" + encodeURI(dataOpenForm.registro_usar_recaptcha);
            }
            if (typeof dataOpenForm.registro_usar_checkacepto !== "undefined") {
                url += "&registro_usar_checkacepto=" + encodeURI(dataOpenForm.registro_usar_checkacepto);
            }
            if (typeof dataOpenForm.text_checkacepto !== "undefined") {
                url += "&text_checkacepto=" + encodeURI(dataOpenForm.text_checkacepto);
            }
            if (typeof dataOpenForm.usar_filtro_grupos !== "undefined") {
                url += "&usar_filtro_grupos=" + encodeURI(dataOpenForm.usar_filtro_grupos);
            }
            if (typeof dataOpenForm.usar_conectar_cita_enc !== "undefined") {
                url += "&usar_conectar_cita_enc=" + encodeURI(dataOpenForm.usar_conectar_cita_enc);
            }
            if (typeof dataOpenForm.tipo_grupos_hijos !== "undefined") {
                url += "&tipo_grupos_hijos=" + encodeURI(dataOpenForm.tipo_grupos_hijos);
            }
            if (typeof dataOpenForm.link_css !== "undefined") {
                url += "&link_css=" + encodeURI(dataOpenForm.link_css);
            }
            if (typeof dataOpenForm.code !== "undefined") {
                url += "&code=" + encodeURI(dataOpenForm.code);
            }
            if (typeof dataOpenForm.asesor !== "undefined") {
                url += "&asesor=" + encodeURI(dataOpenForm.asesor);
            }
            if (typeof dataOpenForm.mode !== "undefined") {
                url += "&mode=" + encodeURI(dataOpenForm.mode);
            }
            if (typeof dataOpenForm.kCode !== "undefined") {
                url += "&kCode=" + encodeURI(dataOpenForm.kCode);
            }
            if (typeof dataOpenForm.service !== "undefined") {
                url += "&service=" + encodeURI(dataOpenForm.service);
            }
            if (typeof dataOpenForm.embed !== "undefined") {
                url += "&embed=" + encodeURI(dataOpenForm.embed);
            }
            if (typeof dataOpenForm.edita_asesor !== "edita_asesor") {
                url += "&edita_asesor=" + encodeURI(dataOpenForm.edita_asesor);
            }
            if (typeof dataOpenForm.texto_registro !== "undefined") {
                url += "&texto_registro=" + dataOpenForm.texto_registro;
            }
            if (typeof dataOpenForm.codigo_oculto !== "undefined") {
                url += "&codigo_oculto=" + encodeURI(dataOpenForm.codigo_oculto);
            }

            if (typeof dataOpenForm.info_site !== "undefined") {
                url += "&info_site=" + encodeURI(dataOpenForm.info_site.replace(/=/gi, '{igual}'));
            }
            url += "&op=" + username;
            url += "&cli=" + usernametwo;
        }
        url += usarPlantillas;

        if (mode === "bottom") {
            if (document.querySelector("." + classt)) {
                openWinWrtc("." + classt);
                return;
            }
            var classkok = "containconversnwrtc";
            if (typeof lienzo !== "undefined") {
                if (lienzo !== null && lienzo !== false && lienzo !== "") {
                    classkok = "containconversnwrtc_lienzo";
                }
            }
            var con = document.querySelector("." + classkok);
            if (!con) {
                var f = document.createElement("div");
                f.className = classkok;
                var dom = document.body;
                if (typeof lienzo !== "undefined") {
                    if (lienzo !== null && lienzo !== false && lienzo !== "") {
                        var dono = document.querySelector(lienzo);
                        if (dono) {
                            dom = dono;
                        }
                    }
                }
                dom.appendChild(f);
            }
            document.querySelector("." + classkok).style = poscontainer;
            var fontsize = "16";
            var fontsizemenos = "19";
            if (isMobileRingow()) {
                fontsize = "28";
                fontsizemenos = "0";
            }
            var colorencinactive = "#828282";
            if (__isRingowCh) {
                colorencinactive = colprin;
            }
            var enc = "<div class='containEncBarRingow' style='position: relative; background: " + colorencinactive + "; color: #fff;font-size: 13px;padding: 13px;border-radius: 5px 5px 0px 0px;'>";
            if (userphototwo !== false) {
                enc += "<span  style='background-image: url(" + userphototwo + ");\n\
cursor: pointer;\n\
    font-weight: bold;\n\
    text-align: left;\n\
    display: block;\n\
    width: 40px;\n\
    height: 33px;\n\
    background-size: contain;\n\
    position: relative;\n\
    float: left;\n\
    background-repeat: no-repeat;\n\
    background-position: center;\n\
    margin-left: -10px;\n\
    margin-right: 8px;\n\
    margin-top: -9px;\n\
    border-radius: 5px;\n\
    padding: 0px;' class='userfoto_ringow'></span>";
            }
            enc += "<span  onclick='javascript: minimizeWinWrtc(\"." + classt + "\")' style='font-family: arial;max-height: 15px;overflow:hidden;cursor: pointer;font-size: 13px;font-weight: bold;text-align: left;display: block;line-height: normal;' class='linkencUsRing minimize2Winwrc_" + classt + "'>" + usernametwo_show_enc + " <span class='dataencringreg'>" + country + " " + city + "</span></span>";
            enc += "<span  onclick='javascript: openWinWrtc(\"." + classt + "\")' style='font-family: arial;cursor: pointer;font-size: 13px;font-weight: bold;text-align: left;display: none;line-height: normal;' class='linkencUsRing openWinwrc_" + classt + "'>" + usernametwo_show_enc + "</span>";
            enc += "<span class='closeWinwrc minimizeWinwrc_" + classt + "' style='font-family: arial;position: absolute;top: -3px;right: 20px;cursor: pointer;font-weight: bold;font-size: " + fontsizemenos + "px;line-height: normal;' onclick='javascript: minimizeWinWrtc(\"." + classt + "\")'>-</span>";
            if (remove === true) {
                url += "&useinapp=true";
                enc += "<span class='closeWinwrc closeWinwrc_" + classt + "' style='font-family: arial;font-size: " + fontsize + "px;position: absolute;top: 2px;right: 3px;cursor: pointer;line-height: normal;' onclick='javascript: closeWinWrtc(\"." + classt + "\", false)'>X</span>";
            } else {
                enc += "<span class='closeWinwrc closeWinwrc_" + classt + "' style='font-family: arial;font-size: " + fontsize + "px;position: absolute;top: 2px;right: 3px;cursor: pointer;line-height: normal;' onclick='javascript: closeWinWrtc(\"." + classt + "\")'>X</span>";
            }
            enc += "</div>";
            var con = document.querySelector("." + classkok);

            var css = "";
            css += "box-sizing: border-box;background: #fff;border-radius: 5px;-webkit-box-shadow: 0 5px 40px rgba(0,0,0,.16);box-shadow: 0 5px 40px rgba(0,0,0,.16);z-index:100000000000;";
            if (isMobileRingow()) {
                css += "position: fixed;top: 0;left: 0;bottom: auto;height: 100%;width: 100%;margin: 0;border: 0;box-shadow: none;";
            } else {
                css += "height: " + bottom + "px;width: 290px;float:left;margin-left:5px;border-radius: 25px 5px 15px 5px;" + position;
            }
            var iframeshow = enc;
            iframeshow += loadingRingow();
            iframeshow += "<iframe allow='microphone; camera' src='" + url + "' class='iframeclassconrt iframeclassconrt_" + classt + "' style='position: relative;width: 100%;height: 100%;border:0;z-index: 2;'></iframe>";
            var f = document.createElement("div");
            f.className = "conversnwrtc " + classt;
            f.innerHTML = iframeshow;
            con.appendChild(f);

            setTimeout(function () {
                var lo = document.querySelector(".loadingNwRingow");
                if (lo) {
                    lo.remove();
                }
            }, 5000);

            if (!__addCssWinRingow) {
                var cs = document.createElement("div");
                cs.innerHTML = "<style>.conversnwrtc{" + css + "} .activeWindRingow .containEncBarRingow{background: " + colprin + "!important;} .iosBugFixCaret{position: fixed; width: 100%;} .circleNotifyIntRingow{position: absolute;top: 2px;left: 6px;}.numberNotyIntRingow{position: relative;background: firebrick;color: #fff;display: block;border: 1px solid #fff;width: 25px;height: 25px;border-radius: 50%;text-align: center;font-weight: bold;font-size: 12px;line-height: 18px;}</style>";
                document.body.appendChild(cs);
                __addCssWinRingow = true;
            }

        } else
        if (mode === "popup") {
            window.open(url, "Nw", "width=600,height=600");
        } else {
            window.open(url, mode);
        }
    }
}

function loadingRingow() {
    var html = " <div id='loadingNwRingow' class='loadingNwRingow' style='position: absolute;top: 80px;left: 0;width: 100%;height: 100%;background: #fff;z-index: 1;'>\n\
            <div class='cEftVf_ringow' style='top: 10%;position: relative;'></div>\n\
            <style>\n\
                @-webkit-keyframes iECmZH {\n\
                    0% {\n\
                        -webkit-transform: rotate(0deg);\n\
                        -ms-transform: rotate(0deg);\n\
                        transform: rotate(0deg);\n\
                    }\n\
                    100% {\n\
                        -webkit-transform: rotate(360deg);\n\
                        -ms-transform: rotate(360deg);\n\
                        transform: rotate(360deg);\n\
                    }\n\
                }\n\
                @keyframes iECmZH {\n\
                    0% {\n\
                        -webkit-transform: rotate(0deg);\n\
                        -ms-transform: rotate(0deg);\n\
                        transform: rotate(0deg);\n\
                    }\n\
                    100% {\n\
                        -webkit-transform: rotate(360deg);\n\
                        -ms-transform: rotate(360deg);\n\
                        transform: rotate(360deg);\n\
                    }\n\
                }\n\
                .cEftVf_ringow {\n\
                    margin-left: auto;\n\
                    margin-right: auto;\n\
                    border: 4px solid #358EFF;\n\
                    border-top: 4px solid transparent;\n\
                    height: 3rem;\n\
                    width: 3rem;\n\
                    box-sizing: border-box;\n\
                    -webkit-animation: iECmZH 1100ms infinite linear;\n\
                    animation: iECmZH 1100ms infinite linear;\n\
                    border-radius: 50%;\n\
                }\n\
            </style>\n\
        </div>";
    return html;
}

function changeMinMaxWindRing(mode) {
    var w = __hostInSiteRingow + __myUserClientRingow;
    localStorage["minWinRingow_" + w] = mode;
}

function minimizeWinWrtc(clas) {
    if (typeof clas === "undefined") {
        return;
    }
    if (__isRingowCh === true) {
        closeWinWrtc(clas);
        return;
    }
    document.querySelector(clas).style.bottom = __bottomMinRingow + "px";
    document.querySelector(".minimize2Winwrc_" + clas.replace(".", "")).style.display = "none";
    document.querySelector(".minimizeWinwrc_" + clas.replace(".", "")).style.display = "none";
    document.querySelector(".openWinwrc_" + clas.replace(".", "")).style.display = "block";

    document.querySelector(".containconversnwrtc").style.width = "auto";
    document.querySelector(".containconversnwrtc").style.height = "0";

    normalizeBodyRingow();

    changeMinMaxWindRing("MIN");
}

function closeWinWrtc(clas, remove) {
    var coi = document.querySelector(".containconversnwrtc");
    if (coi) {
        coi.style.width = "auto";
        coi.style.height = "0";
    }
    if (document.querySelector(clas)) {
        document.querySelector(clas).style.display = "none";
        if (remove === true || remove === "SI") {
            document.querySelector(clas).remove();
        }
    }
    normalizeBodyRingow();
    changeMinMaxWindRing("MIN");
//    changeMinMaxWindRing("CLOSE");
}
function openWinWrtc(clas) {
    normalizeBodyRingow("open");
    var d = document.querySelectorAll(".conversnwrtc");
    if (d) {
        for (var i = 0; i < d.length; i++) {
            var el = d[i];
            el.style.zIndex = "1000000";
        }
    }
    document.querySelector(clas).style.display = "block";
    document.querySelector(clas).style.zIndex = "1000000000";
    var bottom = __bottomRingow;
    if (__isRingowCh !== true) {
        bottom = __heiRingow;
    }
    document.querySelector(clas).style.bottom = bottom + "px";
    document.querySelector(".minimize2Winwrc_" + clas.replace(".", "")).style.display = "block";
    document.querySelector(".minimizeWinwrc_" + clas.replace(".", "")).style.display = "block";
    document.querySelector(".openWinwrc_" + clas.replace(".", "")).style.display = "none";
    changeMinMaxWindRing("MAX");

    var fr = document.querySelector(clas + " .iframeclassconrt");
    if (fr) {
        fr.contentWindow.postMessage("focusExternRingow", '*');
        fr.contentWindow.postMessage("leerMensajesRingow", '*');
    }
}

function normalizeBodyRingow(mode) {
    if (isMobileRingow()) {
//    document.body.style.overflow = "hidden";
//    document.body.scrollTop = 0;
//    window.scrollTo(0, 0);
        var el = document.body;
        var cls = "iosBugFixCaret";
        if (mode === "open") {
            ringowAddClass(el, cls);
        } else {
            ringowRemoveClass(el, cls, true);
        }
    }
}
function ringowAddClass(el, cls) {
    if (el.classList) {
        el.classList.add(cls);
    } else {
        var cur = ' ' + (el.getAttribute('class') || '') + ' ';
        if (cur.indexOf(' ' + cls + ' ') < 0) {
            setClass(el, (cur + cls).trim());
        }
    }
}
function ringowRemoveClass(el, cls, isWidget) {
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

function cleanUserNwRingow(u) {
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
    id = id.replace(/\:/gi, "");
    id = id.replace(/\ /gi, "");
    id = id.replace(/\!/gi, "");
    id = id.replace(/\¡/gi, "");
    id = id.replace(/\¿/gi, "");
    id = id.replace(/\?/gi, "");
    id = id.replace(".", "");
    return id;
}

function startConversationNwrct(userOne, userTwo, type, mode, isgroup) {
    nwrtc.startConversation(userOne, userTwo, type, mode, isgroup);
}

function notificationPushNwrtc(theBody, theIcon, theTitle, callback) {
    if (typeof localStorage["notificationsnwmakeroffon"] !== "undefined") {
        if (localStorage["notificationsnwmakeroffon"] === "false") {
            return false;
        }
    }
    var n = false;
    if (typeof theIcon === "undefined" || theIcon === false || theIcon === null || theIcon === "") {
        theIcon = "/nwlib6/nwproject/modules/webrtc/testing/two/img/icon_ringow_2.png";
    }
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
    }
    if (n !== false) {
        setTimeout(n.close.bind(n), 10000);
        n.onclick = function (event) {
//            var uri = location.href;
//            openWindow(urlToOpen);
//            window.open(uri, "_self");
//            window.location.href = uri;
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

function isMobileRingow() {
    var device = navigator.userAgent;
    if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
    {
        return true;
    }
    return false;
}

function createConversBarRingow(r) {
    var html = "";
    if (__containerConversBarRingow !== "body") {
        html += "<div class='containerConversationsBarRingow'>";
    }
    var h = r.all;
    for (var i = 0; i < h.length; i++) {
        var x = h[i];
        var user = x.userscallintern_d;
        var photo = "";
        var phototwo = "";
        if (x.myuser === user) {
            user = x.userscallintern;
        }
        html += "<div class='rowConBarRinw' data-userone-user='" + x.myuser + "' data-userone-photo='" + photo + "' data-usertwo-user='" + user + "' data-usertwo-photo='" + phototwo + "' >";
        html += "<p class='rowConBarRinw_status'>";
        html += "</p>";
        html += "<p class='rowConBarRinw_image' style='background-image: url(" + photo + ");'></p>";
        html += "<p class='rowConBarRinw_name'>";
        html += user;
        html += "</p>";
        html += "<p class='rowConBarRinw_lastext'>" + x.last_message + "</p>";
        html += "</div>";
    }
    if (__containerConversBarRingow !== "body") {
        html += "</div>";
    }
    var con = document.querySelector(".containerConversationsBarRingow");
    if (con) {
        con.innerHTML = html;
    } else {
        if (__containerConversBarRingow === "body") {
            var h = document.createElement("div");
            h.className = "containerConversationsBarRingow";
            h.innerHTML = html;
            document.body.appendChild(h);
        } else {
            if (document.querySelector(__containerConversBarRingow))
                document.querySelector(__containerConversBarRingow).innerHTML = html;
        }
        var css = "<style>";
        css += ".containerConversationsBarRingow{position: relative;background: #fff;z-index: 100000000;overflow-y: auto;";
        if (__containerConversBarRingow === "body") {
            css += "position: fixed;top: 50px;right: 0;width: 250px;height: 90%;";
        } else {
            css += "position: absolute;width: 100%;height: 100%;";
        }
        css += "}";
        css += ".rowConBarRinw{cursor:pointer;overflow: hidden;position: relative;display: block;word-break: break-word;padding: 5px;box-sizing: border-box;border-bottom: 1px solid #f4f3f3;-webkit-transition: all 0.5s ease;-moz-transition: all 0.5s ease;-o-transition: all 0.5s ease;transition: all 0.5s ease;}";
        css += ".rowConBarRinw:hover{background-color: #eaeaea;}";
        css += ".rowConBarRinw_lastext{position: relative;max-height: 30px;overflow: hidden;}";
        css += ".rowConBarRinw_name{font-weight: bold;position: relative;max-height: 15px;overflow: hidden;}";
        css += ".rowConBarRinw_image{position: relative;overflow: hidden;width: 28px;height: 28px;border: 1px solid #ccc;border-radius: 50%;float: left;margin-right: 3px;background-image: url(/nwlib6/icons/2017/user.png);background-size: contain;background-position: center;}";
        css += "</style>";
        var style = document.createElement("div");
        style.innerHTML = css;
        document.body.appendChild(style);
    }
    var d = document.querySelectorAll(".rowConBarRinw");
    for (var i = 0; i < d.length; i++) {
        d[i].addEventListener("click", function () {
            var userone_user = this.getAttribute("data-userone-user");
            var userone_photo = this.getAttribute("data-userone-photo");
            var usertwo_user = this.getAttribute("data-usertwo-user");
            var usertwo_photo = this.getAttribute("data-usertwo-photo");
            var userone = {};
            userone.username = userone_user;
            userone.photo = usertwo_photo;
            var usertwo = {};
            usertwo.username = usertwo_user;
            usertwo.photo = userone_photo;
            var isgroup = false;
            startConversationNwrct(userone, usertwo, "chat", "bottom", isgroup);
        });
    }
}

function sendConfigurationRingow(r) {
    console.log("sendConfigurationRingow", r);
    var conf = r.config;
    var online = r.online;
    var id_enc = r.id_enc;
    console.log(id_enc);
    var status = r.status;
    var userOne = r.usuario;
    var userTwo = r.usuarioTwo;
    var ringow_popup = false;
    if (typeof r.ringow_popup !== "undefined") {
        if (r.ringow_popup === "SI") {
            ringow_popup = true;
        }
    }
    conf.online = online;
    __configRingow = conf;
    var namebot = r.usuarioTwo.username;
    var position = "bottom: 20px;right: 10px;";
    if (typeof conf.position !== "undefined") {
        if (conf.position === "bottom_right") {
            position = "bottom:0px;right:0px;";
        } else
        if (conf.position === "bottom_left") {
            position += "bottom:0px;left:0px;";
        } else
        if (conf.position === "top_right") {
            position += "bottom:auto; top: 0px;right:0px;";
        } else
        if (conf.position === "top_left") {
            position += "bottom:auto; top: 0px;left:0px;";
        }
    }
    var ant = document.querySelector(".buttonOpenNwChat");
    if (ant) {
        ant.remove();
    }
    var ant = document.querySelector("#buttonOpenNwChat");
    if (ant) {
        ant.remove();
    }

    var image = conf.img_online;
    if (isMobileRingow()) {
        if (conf.mobile_img_online !== "") {
            image = conf.mobile_img_online;
        }
    }
    if (online === "offline") {
        if (conf.img_offline !== "") {
            image = conf.img_offline;
        }
        if (isMobileRingow()) {
            if (conf.mobile_img_offline !== "") {
                image = conf.mobile_img_offline;
            }
        }
    }

    var credits = "<a style='display: block;position: relative;text-align: right;text-decoration: none;color: #6c6c6c;text-shadow: 1px 1px 1px #fff;font-size: 10px;font-family: arial;' href='https://www.ringow.com' target='_BLANK'>Powered by Ringow.com</a>";
    if (typeof conf.creditos_ringow !== "undefined") {
        if (conf.creditos_ringow === "NO") {
            credits = "";
        }
    }
    var openForm = false;
    var dataOpenForm = conf;
    console.log(r);
    dataOpenForm.id_enc = id_enc;
    dataOpenForm.typeCall = r.typeCall;
    dataOpenForm.offline = r.online;
    dataOpenForm.ringow_popup = r.ringow_popup;
    dataOpenForm.status = r.status;
    dataOpenForm.username = r.usuario;
    dataOpenForm.usernameTwo = r.usuarioTwo;
    if (conf.usar_bot === "NO" && status !== "EN LINEA" && status !== "LLAMANDO") {
        openForm = true;
    }
    if (online === "offline") {
        if (conf.offline_recolectar_llamadas === "NO") {
            openForm = true;
        }
    }
    var openchatauto = false;
    if (conf.abrir_chat_automaticamente === "SI" && isMobileRingow() === false) {
        openchatauto = true;
    }
    if (ringow_popup === true) {
        openchatauto = true;
        dataOpenForm.ringow_popup = "true";
    }
    var usa = cleanUserNwRingow(namebot);
    __myUserClientRingow = usa;
    __classtGlobalyConvRing = "conversnwrtc_" + usa;

    var show_btn_fixed = true;
    if (typeof conf.show_btn_fixed !== "undefined") {
        if (conf.show_btn_fixed === "NO") {
            show_btn_fixed = false;
        }
    }
    if (conf.usar_bot === "NO") {
        openForm = true;
    }
    var func = function () {
        if (openForm) {
            nwrtc.startConversation(userOne, userTwo, "chat", "bottom", false, true, dataOpenForm);
        } else {
            nwrtc.startConversation(userOne, userTwo, "chat", "bottom", false, openForm, dataOpenForm);
        }
    };

    if (!ringow_popup && show_btn_fixed === true) {
        var div = document.createElement("div");
        div.id = "buttonOpenNwChatRingow";
        div.className = "buttonOpenNwChatRingow";
        div.innerHTML = "<img src='" + __domainRingow + image + "' alt='Icon ringow' />" + credits;
        document.body.appendChild(div);
        if (!document.querySelector(".containCssRingowOne")) {
            var css = document.createElement("div");
            css.className = "containCssRingowOne";
            css.innerHTML = "<style>.buttonOpenNwChatRingow{position: fixed;cursor:pointer;z-index: 100000000;" + position + "}</style>";
            document.body.appendChild(css);
        }
        document.querySelector(".buttonOpenNwChatRingow").addEventListener("click", function () {
            changeMinMaxWindRing("MAX");
//            nwrtc.startConversation(userOne, userTwo, "chat", "bottom", false, openForm, dataOpenForm);
            func();
        });
    }
    if (!show_btn_fixed) {
        openchatauto = true;
    }
    if (openchatauto) {
        var time = 5000;
        if (conf.tiempo_abrir_chat_auto !== null && conf.tiempo_abrir_chat_auto !== false && conf.tiempo_abrir_chat_auto !== null) {
            time = parseInt(conf.tiempo_abrir_chat_auto);
        }
        if (ringow_popup === true) {
            time = 0;
        }
        var showchat = true;
        var modewin = "MAX";
        var w = __hostInSiteRingow + __myUserClientRingow;
        if (typeof localStorage["minWinRingow_" + w] !== "undefined") {
            modewin = localStorage["minWinRingow_" + w];
            if (localStorage["minWinRingow_" + w] === "CLOSE") {
                showchat = false;
            }
        }
        if (!show_btn_fixed) {
            showchat = true;
            modewin = "MAX";
        }
        if (showchat === true) {
            setTimeout(function () {
                if (modewin === "MIN" && ringow_popup !== true) {
//                                minimizeWinWrtc("." + __classtGlobalyConvRing);
                } else {
                    func();
//                    nwrtc.startConversation(userOne, userTwo, "chat", "bottom", false, openForm, dataOpenForm);
                }
            }, time);
        }
    }
}

var countmsgnootyring = 0;
window.addEventListener('message', function (e) {
    var r = e.data;
    if (typeof r !== "undefined") {
        if (typeof r.tipo !== "undefined") {
            if (r.tipo === "reloadWindow") {
                window.location.reload();
            } else
            if (r.tipo === "restarCallRingow") {
                var dd = document.querySelector('.buttonOpenNwChatRingow');
                if (dd) {
                    dd.remove();
                }
                setTimeout(function () {
                    var cont = window.parent.document.getElementById('iframeRingowUp');
                    if (cont) {
                        cont.contentWindow.postMessage("refresh", '*');
                    }
                    if (typeof r.noclose === "undefined") {
                        closeWinWrtc("." + r.classt, true);
                    }
                }, 1000);
            } else
            if (r.tipo === "createConversationsBarRingow") {
                createConversBarRingow(r);
            } else
            if (r.tipo === "createEncNotificationsRingow") {

                var h = document.createElement("div");
                h.innerHTML = "<audio class='soundNotifyNwrtc' src='" + __domainRingow + "/nwlib6/audio/ping.mp3' ></audio>";
                document.body.appendChild(h);

                var g = document.querySelector(".notifyRtcnwenc");
                if (!g) {
                    var f = document.createElement("div");
                    f.style = "cursor: pointer;\n\
position: fixed;\n\
    top: 0px;\n\
    right: 0px;\n\
    z-index: 10000;\n\
    width: 47px;\n\
    height: 40px;\n\
    background-image: url(/nwlib6/icons/charlar_2_64_gris.png);\n\
    background-size: 70%;\n\
    background-repeat: no-repeat;\n\
    background-position: center center;";
                    f.className = "notifyRtcnwenc";
                    f.innerHTML = "<span class='circleNotifyInsideNwrtc' style='background-color: firebrick;position: absolute;width: 20px;height: 20px;bottom: 0;display: block;color: #fff;font-size: 12px;text-align: center;font-weight: bold;line-height: 22px;border-radius: 50%;'></span><div class='containBloqsrtcnwenc' style='display: none;position: absolute;top: 40px;right: 0;background-color: #fff;padding: 10px;border: 1px solid #ccc;border-radius: 5px;font-size: 12px;max-width: 300px;'></div>";
                    document.body.appendChild(f);

                    window.addEventListener("click", function (e) {
                        var c = document.querySelector(".containBloqsrtcnwenc");
                        c.style.display = "none";
                    });
                    document.querySelector(".notifyRtcnwenc").addEventListener("click", function (e) {
                        var c = document.querySelector(".containBloqsrtcnwenc");
                        c.style.display = "block";
                        e.stopPropagation();
                        e.preventDefault();
                    });
                }
            } else
            if (r.tipo === "newNotificationsRingow") {
                var c = document.querySelector(".containBloqsrtcnwenc");
                var x = r.all;
                var to = 0;
                if (typeof x.length !== "undefined") {
                    to = x.length;
                }
                var res = [];
                var sum = 0;
                if (to > 0) {
                    x.reverse();
                    for (var i = 0; i < x.length; i++) {
                        var t = x[i];
                        var image = t.foto_usuario;
                        if (typeof __notifyEncRingow[t.id] !== "undefined") {
                            continue;
                        }
                        __notifyEncRingow[t.id] = t.id;
                        res[sum] = t;
                        sum++;
                        var s = document.createElement("div");
                        s.style = "border-bottom: 1px solid #ccc;margin: 5px 0;";
                        var classn = "openconversgroupringowenc_" + countmsgnootyring;
                        var ht = "";
                        ht += "<div class='" + classn + "' data-isgroup='" + t.isgroup + "' data-myuser='" + t.myuser + "' data-userone-user='" + t.usuario + "' data-userone_show-user='" + t.nombre_operador + "' data-userone-photo='" + image + "'  data-usertwo-user='" + t.usuario_recibe + "' data-usertwo-photo='" + t.foto_usuario_recibe + "' >";
                        if (image !== null && image !== "")
                            ht += "<p><span style='display: block;float: left;margin: 0px 5px;position: relative;width: 40px;height: 40px;background-size: cover;background-position: center;border-radius: 50%;overflow: hidden;background-image: url(" + image + ");'></span></p>";
                        ht += "<p><strong>" + t.usuario + "</strong></p>";
                        ht += "<p>" + t.texto + "</p>";
                        ht += "<p>" + t.fecha + "</p>";
                        ht += "</div>";
                        s.innerHTML = ht;
                        c.appendChild(s);
                        if (document.querySelector("." + classn)) {
                            document.querySelector("." + classn).addEventListener("click", function () {
                                var userone_user = this.getAttribute("data-userone-user");
                                var userone_user_show = this.getAttribute("data-userone_show-user");
                                var userone_photo = this.getAttribute("data-userone-photo");
                                var usertwo_user = this.getAttribute("data-usertwo-user");
                                var usertwo_photo = this.getAttribute("data-usertwo-photo");
                                var isgroupe = this.getAttribute("data-isgroup");
                                var myuser = this.getAttribute("data-myuser");
                                var userone = {};
//                                userone.username_show = userone_user_show;
                                userone.username = usertwo_user;
                                userone.photo = usertwo_photo;
                                var usertwo = {};
                                usertwo.username_show = userone_user_show;
                                usertwo.username = userone_user;
                                usertwo.photo = userone_photo;
                                var isgroup = false;
                                if (isgroupe === true || isgroupe === "true" || isgroupe === "SI") {
                                    isgroup = true;
                                    userone = {};
                                    userone.username = myuser;
                                    userone.photo = userone_photo;
                                    usertwo = {};
                                    usertwo.username = usertwo_user;
                                    usertwo.photo = usertwo_photo;
                                }
                                startConversationNwrct(userone, usertwo, "chat", "bottom", isgroup);
                            });
                        }

                        var usertwo = {};
                        usertwo.username = t.usuario;
                        usertwo.photo = image;
                        var userone = {};
                        userone.username = t.usuario_recibe;
                        userone.photo = t.foto_usuario_recibe;
                        var isgroup = false;
                        window.focus();
                        if (t.isgroup === true) {
                            isgroup = true;
                            userone = {};
                            userone.username = t.myuser;
                            userone.photo = image;
                            usertwo = {};
                            usertwo.username = t.usuario_recibe;
                            usertwo.photo = t.foto_usuario_recibe;
                        } else {
                            var userone = {};
                            userone.username = t.usuario_recibe;
                        }
                        var theBody = t.texto;
                        var theTitle = t.usuario + " dice:";
                        var array = function () {
                            startConversationNwrct(userone, usertwo, "chat", "bottom", isgroup);
                            if (typeof r.classt !== "undefined") {
                                var fr = document.querySelector(".iframeclassconrt_" + r.classt);
                                if (fr) {
                                    fr.contentWindow.postMessage("focusExternRingow", '*');
                                }
                            }
                        };
                        notificationPushNwrtc(theBody, image, theTitle, array);
                        countmsgnootyring++;
                        document.querySelector(".soundNotifyNwrtc").play();
                    }
                }
                var a = document.querySelector(".circleNotifyInsideNwrtc");
                if (to > 0) {
                    a.innerHTML = to;
                    a.style.display = "block";
                } else {
                    a.style.display = "none";
                }
            } else
            if (r.tipo === "sendConfigurationRingow") {
                sendConfigurationRingow(r);
            } else
            if (r.tipo === "startConversationRingow") {
                nwrtc.startConversation(r.usuario, r.usuario_recibe, "chat", "bottom");
            } else
            if (r.tipo === "sendNotifyPushFrameNwrtc") {
                var theBody = r.body;
                var theIcon = r.icon;
                var theTitle = r.title;
                var array = function () {
                    window.focus();
                    startConversationNwrct(r.otto, r.user, "chat", "bottom");
                    var fr = document.querySelector(".iframeclassconrt_" + r.classt);
                    if (fr) {
                        fr.contentWindow.postMessage("focusExternRingow", '*');
                    }
                };
                notificationPushNwrtc(theBody, theIcon, theTitle, array);

                var us = cleanUserNwRingow(r.user);
                var cl = "circleNotifyIntRingow_" + us;
                var go = document.querySelector("." + cl);

                //pone icono en listado ringow.com si existe
                var io = document.querySelector(".rowonline_" + us);
                if (io) {
                    var a = document.createElement("div");
                    a.className = "circleNotifyIntRingowList";
                    a.innerHTML = "<span class='numberNotyIntRingowLIst'>1</span>";
                    io.appendChild(a);
                }

                if (go) {
                    go.innerHTML = "<span class='numberNotyIntRingow numberNotyIntRingow_" + us + "'>1</span>";
                } else {
                    var a = document.createElement("div");
                    a.className = "circleNotifyIntRingow " + cl;
                    a.innerHTML = "<span class='numberNotyIntRingow numberNotyIntRingow_" + us + "'>1</span>";
                    document.querySelector(".conversnwrtc_" + us).appendChild(a);
                }
            } else
            if (r.tipo === "readMessagesRingow") {
                var us = cleanUserNwRingow(r.user);
                var k = document.querySelector(".numberNotyIntRingow_" + us);
                if (k) {
                    k.remove();
                }
            } else
            if (r.tipo === "activeInactiveWindRing") {
                var all = document.querySelectorAll(".conversnwrtc");
                for (var i = 0; i < all.length; i++) {
                    var el = all[i];
                    ringowRemoveClass(el, "activeWindRingow", true);
                }
                //listado ringow
                if (typeof r.classt !== "undefined") {
                    var us = r.classt;
                    var io = document.querySelector(".rowonline_" + us);
                    var ot = document.querySelector("." + us);
                    if (ot) {
                        ringowAddClass(ot, "activeWindRingow");
                    }
                }
            }
        }
    }
});