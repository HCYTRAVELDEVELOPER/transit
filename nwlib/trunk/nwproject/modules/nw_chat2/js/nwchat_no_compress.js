__domainNwChat = false;
__iframeNwChat = false;
__minimizarNwChat = false;
__createButtonsNwChatContact = false;
__urlNwChat = false;
__dataEncTitleNwChat = false;
__titleBarraNwChat = false;
__createButtonInitialNwChat = false;
__formContactoNwChat = false;
__datoscontactoNwChat = false;
__llamadavozNwChat = false;
__videollamadaNwChat = false;
__onlyChatNwChat = 0;
__protocolNwChat = "https";
if (typeof localStorage["inConversationNwChat"] == "undefined") {
    localStorage["inConversationNwChat"] = "NO";
}

var nwchat = new nwchat();
nwchat.init();
__initNwChatP = false;

function getGetNwChat() {
    var query = document.getElementById("nwchat2").src.match(/\?.*$/);
    query[0] = query[0].replace("?", "");
    var GET = query[0].split("&");
    var get = {};
    for (var i = 0, l = GET.length; i < l; i++) {
        var tmp = GET[i].split('=');
        get[tmp[0]] = unescape(decodeURI(tmp[1]));
    }
    return get;
}

function nwchat() {
    var self = this;
    this.init = init;
    self.version = 2;

    function urlGET() {
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

    function init() {
        if (urlGET() != false) {
            if (typeof urlGET().viewNwChat != "undefined") {
                return;
            }
        }
        var ident = "ident";
        var divcontainer = document.body;
        var protocol = "https:";
        var p = document.querySelector("#nwchat2").getAttribute("src");
        if (p.indexOf("https") == -1) {
            protocol = "http:";
        }
        __protocolNwChat = protocol;

        var get = getGetNwChat();
        var host = get["host"];
        var showButtonsFirst = true;
        __videollamadaNwChat = false;
        __llamadavozNwChat = false;
        __datoscontactoNwChat = false;
        __formContactoNwChat = false;
        if (typeof get.videollamada != "undefined") {
            if (get.videollamada == "true") {
                __videollamadaNwChat = true;
                __onlyChatNwChat++;
            }
        }
        if (typeof get.llamadavoz != "undefined") {
            if (get.llamadavoz == "true") {
                __llamadavozNwChat = true;
                __onlyChatNwChat++;
            }
        }
        if (typeof get.datoscontacto != "undefined") {
            if (get.datoscontacto == "true") {
                __datoscontactoNwChat = true;
                __onlyChatNwChat++;
            }
        }
        if (typeof get.formContacto != "undefined") {
            if (get.formContacto == "true") {
                __formContactoNwChat = true;
                __onlyChatNwChat++;
            }
        }
        if (typeof get.showButtonsFirst != "undefined") {
            showButtonsFirst = get.showButtonsFirst;
        }
        if (typeof __selfNwChat == "undefined") {
            __selfNwChat = true;
        }

        var domain = protocol + "//" + host;
        if (host == "www.chat.gruponw.com" || host == "www.homecenter.com.co" || host == "homecenter.com.co" || host == "homecenterchat.gruponw.com"
                || host == "www.homecenterchat.gruponw.com"
                || host == "52.67.144.163"
                || host == "www.52.67.144.163"
                || host == "www.chat.logimov.com"
                || host == "chat.logimov.com"
                )
        {
            domain = "http://www.chat.gruponw.com";
        }
        __domainNwChat = domain;

        if (__selfNwChat === false || typeof __selfNwChatMaster != "undefined") {
            loadMonitoreo();
        }

        createContainerAll();

        if (typeof __selfNwChatMaster == "undefined") {
            var va = createButtonInitial();
            __urlNwChat = va.url;
            __dataEncTitleNwChat = va.dataEncTile;
            __titleBarraNwChat = va.titleBarra;
        }

        if (showButtonsFirst == true) {
            createButtonsNwChatContact();
        } else {
            frameChat();
        }

        function createContainerAll() {
            var containerNwChat = document.createElement("div");
            containerNwChat.id = "containNwChat" + ident;
            containerNwChat.className = "containNwChat";
            var htmlEnc = "";
            containerNwChat.innerHTML = htmlEnc;
            var divExist = document.getElementById("containNwChat" + ident);
            if (divExist == null) {
                divcontainer.appendChild(containerNwChat);
            }
        }

        __createButtonInitialNwChat = function createButtonInitialInit(pr) {
            return  createButtonInitial(pr);
        }

        function createButtonInitial(pr) {

            if (typeof __selfNwChatMaster == "undefined") {
                if (__selfNwChat == true) {
                    document.querySelector("#buttonOpenNwChat").style.display = "none";
                    document.querySelector(".imgNwChatOrigin").style.display = "none";
                }
            }

            var src = domain + "/nwlib6/modulos/nw_soporte_chat/img/online.png";
            if (typeof pr != "undefined") {
                if (typeof pr.img_online != "undefined") {
                    src = domain + pr.img_online;
                }
            }

            if (typeof __selfNwChatMaster == "undefined") {
                src = document.querySelector(".imgNwChatOrigin").src;
            }
            var button = "<img src='" + src + "' alt='Icon ringow' />";
            var url = domain + "/nwlib6/nwproject/modules/nw_chat2/index" + self.version + ".php?id=" + get["id"] + "&host=" + get["host"] + "&key=" + get["key"] + "";
            var dataEncTile = "";
            var titleBarra = "Chat";
            if (typeof get.divcontainer != "undefined") {
                if (get.divcontainer != undefined) {
                    divcontainer = document.querySelector(get.divcontainer);
                }
            }

            if (!document.querySelector("#buttonOpenNwChat" + ident)) {
                var html = "<style>#activeMensajeNwChatP, #activeMensajeNwChatP *,#buttonOpenNwChat,.buttonOpenNwChat,.buttonOpenNwChat *,#buttonOpenNwChat *,.containNwChat, .containNwChat * {-webkit-transition: all 0.5s ease;-moz-transition: all 0.5s ease;-o-transition: all 0.5s ease;transition: all 0.5s ease;}.newMesNwChat {position: absolute;bottom: 10px;left: -50px;background: red;color: #fff;padding: 5px;border-radius: 10px;z-index: 1000000000;font-weight: bold;font-size: 16px;border: 1px solid #fff;box-shadow: 1px 1px 2px #fff;max-width: 200px;word-break: break-word;}</style>";
                var div = document.createElement('div');
                div.style.display = 'none';
                div.innerHTML = html;
                document.body.appendChild(div);

                var div = document.createElement("div");
                div.id = "buttonOpenNwChat" + ident;
                div.className = "buttonOpenNwChat";
                div.innerHTML = button;
                divcontainer.appendChild(div);

                document.querySelector("#buttonOpenNwChat" + ident).style.position = "fixed";
                document.querySelector("#buttonOpenNwChat" + ident).style.right = "0px";
                document.querySelector("#buttonOpenNwChat" + ident).style.bottom = "0px";
                document.querySelector("#buttonOpenNwChat" + ident).style.zIndex = "1000000000";
                document.querySelector("#buttonOpenNwChat" + ident).style.cursor = "pointer";
                if (typeof __selfNwChatMaster == "undefined") {
                    document.querySelector("#buttonOpenNwChat" + ident).style.display = "none";
                }

                document.querySelector('#buttonOpenNwChat' + ident).onclick = function () {

                    if (document.querySelector(".newMesNwChat"))
                        document.querySelector(".newMesNwChat").remove();

                    if (localStorage["inConversationNwChat"] == "SI") {
                        createButtonsNwChatContact();
                        frameChat();
                    }

                    if (typeof __selfNwChatMaster != "undefined") {
                        if (__selfNwChatMaster == "ready") {
                            createButtonsNwChatContact();
                        }
                    }
                    document.querySelector("#buttonOpenNwChat" + ident).style.bottom = "-50%";
//                document.querySelector("#buttonOpenNwChat" + ident).style.display = "none";
//                document.querySelector("#containNwChat" + ident).style.display = "block";
                    document.querySelector("#containNwChat" + ident).style.bottom = "0px";
                    if (isMobileNwChat()) {
//                    document.querySelector("#containNwChat" + ident).style.height = "100%";
                        document.querySelector("#buttonOpenNwChat" + ident).style.display = "none";
                        document.querySelector("#containNwChat" + ident).style.display = "block";
                    }
                    __selfNwChat = true;
                    if (document.querySelector("#divBtnsNwident")) {
                        if (document.querySelector("#frameNwChatident")) {
                            document.querySelector("#divBtnsNwident").style.right = "305px";
                        } else {
                            createButtonsNwChatContact();
                        }
                    }
                    if (isMobileNwChat()) {
                        if (typeof get["callintern"] != "undefined") {
                            if (get["callintern"] != undefined) {
                                if (get["callintern"] === "true") {
                                    $(".footerTools").addClass("footerToolsOpen");
                                }
                            }
                        }
                    }
                };
            }
            return {
                button: button,
                url: url,
                dataEncTile: dataEncTile,
                titleBarra: titleBarra,
                divcontainer: divcontainer
            };
        }

        function minimiceOnlyNwChat() {
            if (document.querySelector("#divBtnsNwident")) {
                document.querySelector("#divBtnsNwident").style.bottom = "-65px";
            }
        }
        function maxOnlyNwChat() {
            if (document.querySelector("#divBtnsNwident")) {
                document.querySelector("#divBtnsNwident").style.bottom = "0px";
            }
        }
        function closeOnlyNwChat() {

            if (localStorage["inConversationNwChat"] == "SI") {
                minimizarNwChat();
                return;
            }

            if (document.querySelector("#divBtnsNwident")) {
                if (isMobileNwChat()) {
                    document.querySelector("#divBtnsNwident").style.right = "0px";
//                    document.querySelector("#divBtnsNwident").style.bottom = "0px";
                    document.querySelector("#divBtnsNwident").style.WebkitTransform = "translate(0px, 0px)";
                } else {
                    document.querySelector("#divBtnsNwident").style.right = "10px";
                }
                if (__formContactoNwChat === true)
                    document.querySelector(".btnFormContactNw").style.float = "left";
                if (__datoscontactoNwChat === true)
                    document.querySelector(".btnInfoSiteNw").style.float = "left";
                if (__videollamadaNwChat === true)
                    document.querySelector(".btnCallNw").style.float = "left";
                if (__llamadavozNwChat === true)
                    document.querySelector(".btnCallFreeNw").style.float = "left";
                document.querySelector(".btnChatNw").style.float = "left";
            }
            if (document.querySelector("#frameNwChatident")) {
                document.querySelector("#frameNwChatident").remove();
                document.querySelector(".titleEncNwChat").remove();
                document.querySelector("#divLoadingNwCident").remove();
                document.querySelector('#containNwChatident').removeAttribute('style');
            }
        }

        function closeNwChat() {
            document.querySelector("#containNwChat" + ident).remove();
            document.querySelector("#buttonOpenNwChat" + ident).remove();
            if (isMobileNwChat()) {
                document.body.style.overflow = "auto";
                if (typeof get["callintern"] != "undefined") {
                    if (get["callintern"] != undefined) {
                        if (get["callintern"] === "true") {
                            $(".footerTools").removeClass("footerToolsOpen");
                        }
                    }
                }
            }
        }
        __minimizarNwChat = function minNwChatInit() {
            minimizarNwChat();
        }
        function minimizarNwChat() {

            if (document.querySelector(".newMesNwChat"))
                document.querySelector(".newMesNwChat").remove();

            if (isMobileNwChat()) {
                if (document.querySelector("#divBtnsNwident"))
                    document.querySelector("#divBtnsNwident").style.WebkitTransform = "translate(0px, 0px)";
                document.querySelector("#containNwChat" + ident).style.display = "none";
                document.querySelector("#buttonOpenNwChat" + ident).style.display = "block";
//                document.querySelector("#buttonOpenNwChat" + ident).style.WebkitTransform = "translate(0px, 0px)";
                document.querySelector("#buttonOpenNwChat" + ident).style.bottom = "0px";
            } else {
                document.querySelector("#containNwChat" + ident).style.bottom = "-100%";
                document.querySelector("#buttonOpenNwChat" + ident).style.bottom = "0px";
            }
            if (document.querySelector("#divBtnsNwident")) {
                activeAnimationBtn(".btnChatNw", "0px", 0);
                if (__llamadavozNwChat === true)
                    activeAnimationBtn(".btnCallFreeNw", "0px", 0);
                if (__videollamadaNwChat === true)
                    activeAnimationBtn(".btnCallNw", "0px", 0);
                if (__datoscontactoNwChat === true)
                    activeAnimationBtn(".btnInfoSiteNw", "0px", 0);
                if (__formContactoNwChat === true)
                    activeAnimationBtn(".btnFormContactNw", "0px", 0);
            }
            if (isMobileNwChat()) {
                if (typeof get["callintern"] != "undefined") {
                    if (get["callintern"] != undefined) {
                        if (get["callintern"] === "true") {
                            $(".footerTools").removeClass("footerToolsOpen");
                        }
                    }
                }
            }
            localStorage["minMaxNwChat"] = "MIN";
        }
        __createButtonsNwChatContact = function createButtonsNwChatContactInit() {
            createButtonsNwChatContact(true);
        }
        function createButtonsNwChatContact(init) {
            if (typeof __selfNwChatMaster == "undefined") {
                if (init != true) {
                    if (__selfNwChat == false) {
                        return;
                    }
                }
            } else
            if (__selfNwChatMaster == true && __selfNwChat == true) {
                __selfNwChatMaster = "ready";
                return;
            }

            if (typeof __initNwChatP != "undefined") {
                if (__initNwChatP === true) {
                    frameChat();
                    __initNwChatP = false;
                    return;
                }
            }
            var cssText = "color:#000;padding: 2px;display: block;font-weight:bold;font-size:11px;";
            var cssIcon = "background-size: 50%;background-repeat: no-repeat;background-position: center;position: relative;display: block;width: 100%;height:60px;box-shadow: 0px 0px 5px #fff;border: 1px solid #fff;border-radius: 50%;";
            var css = "position: relative;width: 60px;color: #fff;text-align: center;float: left; margin: 5px;cursor:pointer;";
            if (isMobileNwChat()) {
                css += "width:70px;margin:1px;position:fixed;";
                cssIcon += "height:70px;";
            }
            var cssClose = "width: 30px!important;height: 30px!important;color:#000;";
            if (isMobileNwChat()) {
                cssClose += "position: absolute;top: -35px;right: 0px;";
            }
            var html = "";
            html += "<div class='containFormSiteNw' style='display:none;'></div>";
            html += "<div class='containDataInfoSiteNw' style='display:none;position: relative;background: #fff;border: 1px solid #ccc;padding: 5px;'></div>";
            if (__formContactoNwChat === true) {
                html += "<div class='btnNwChatGen btnFormContactNw' style='" + css + "'><span style='" + cssIcon + "background-color:#4285f4;background-image: url(" + domain + "/nwlib6/icons/2017/sobre.png);'></span><span style='" + cssText + "'>Mensaje</span></div>";
            }
            if (__datoscontactoNwChat === true) {
                html += "<div class='btnNwChatGen btnInfoSiteNw' style='" + css + "'><span style='" + cssIcon + "background-color:#fbbc05;background-image: url(" + domain + "/nwlib6/icons/2017/signointerrogacion.png);'></span><span style='" + cssText + "'>Información</span></div>";
            }
            if (__videollamadaNwChat === true) {
                html += "<div class='btnNwChatGen btnCallNw' style='" + css + "'><span style='" + cssIcon + "background-color:#663399;background-image: url(" + domain + "/nwlib6/icons/2017/facetime_boton.png);'></span><span style='" + cssText + "'>Video Llamada</span></div>";
            }
            if (__llamadavozNwChat === true) {
                html += "<div class='btnNwChatGen btnCallFreeNw' style='" + css + "'><span style='" + cssIcon + "background-color:#e64134;background-image: url(" + domain + "/nwlib6/icons/2017/telefono.png);'></span><span style='" + cssText + "'>Llamar Gratis</span></div>";
            }
            html += "<div class='btnNwChatGen btnChatNw' style='" + css + "'><span style='" + cssIcon + "background-color:#33a652;background-image: url(" + domain + "/nwlib6/icons/2017/charlar2.png);'></span><span style='font-size:16px;" + cssText + "'>Chat</span></div>";

            html += "<div class='btnNwChatGen btnCloseNw' style='" + css + cssClose + "'><span style='font-size:24px;position:relative;'>x</span></div>";

            var divBtnsNw = document.createElement("div");
            divBtnsNw.id = "divBtnsNw" + ident;
            divBtnsNw.innerHTML = html;
            var controldivBtnCall = document.getElementById("divBtnsNw" + ident);
            if (controldivBtnCall == null) {
                document.querySelector("#containNwChat" + ident).appendChild(divBtnsNw);
            }
            if (__onlyChatNwChat === 0) {
                document.querySelector(".btnChatNw").style.display = "none";
                document.querySelector(".btnCloseNw").style.display = "none";
                cleanContainersNwC();
                frameChat();
            }
            if (__formContactoNwChat === true)
                addTransitionBtn(".btnFormContactNw");
            if (__datoscontactoNwChat === true)
                addTransitionBtn(".btnInfoSiteNw");
            if (__videollamadaNwChat === true)
                addTransitionBtn(".btnCallNw");
            addTransitionBtn(".btnChatNw");
            if (__llamadavozNwChat === true)
                addTransitionBtn(".btnCallFreeNw");

            activeAnimationBtn(".btnChatNw", "-150px", 0);

            if (__llamadavozNwChat === true)
                activeAnimationBtn(".btnCallFreeNw", "320px", 300);
            if (__videollamadaNwChat === true)
                activeAnimationBtn(".btnCallNw", "300px", 600);
            if (__datoscontactoNwChat === true)
                activeAnimationBtn(".btnInfoSiteNw", "-360px", 900);
            if (__formContactoNwChat === true)
                activeAnimationBtn(".btnFormContactNw", "-420px", 1200);

            document.querySelector("#divBtnsNw" + ident).style.backgroundColor = "#fff";
            document.querySelector("#divBtnsNw" + ident).style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.57)";
            document.querySelector("#divBtnsNw" + ident).style.borderRadius = "15px";
            document.querySelector("#divBtnsNw" + ident).style.width = "auto";
            document.querySelector("#divBtnsNw" + ident).style.height = "auto";
            document.querySelector("#divBtnsNw" + ident).style.right = "10px";
            document.querySelector("#divBtnsNw" + ident).style.bottom = "0px";
            document.querySelector("#divBtnsNw" + ident).style.zIndex = "1000000";
            if (isMobileNwChat()) {
                document.querySelector("#divBtnsNw" + ident).style.minHeight = "300px";

                document.querySelector("#divBtnsNw" + ident).style.position = "fixed";
                document.querySelector("#divBtnsNw" + ident).style.padding = "5px";
                document.querySelector("#divBtnsNw" + ident).style.boxSizing = "border-box";
            } else {
                document.querySelector("#divBtnsNw" + ident).style.position = "absolute";
            }
            document.querySelector("#divBtnsNw" + ident).style.fontFamily = "Arial";
            document.querySelector("#divBtnsNw" + ident).style.fontSize = "12px";
            if (isMobileNwChat()) {
                document.querySelector("#divBtnsNw" + ident).style.width = "100%";
                document.querySelector("#divBtnsNw" + ident).style.right = "0px";
            }

            document.querySelector('.btnCloseNw').onclick = function () {
                cleanContainersNwC();
                minimizarNwChat();
            };

            document.querySelector('.btnChatNw').onclick = function () {
                cleanContainersNwC();
                frameChat();
            };
            if (__videollamadaNwChat === true) {
                document.querySelector('.btnCallNw').onclick = function () {
//                    cleanContainersNwC();
//                    closeOnlyNwChat();
                    var send = "";
                    send += "?id=" + get["id"];
                    send += "&host=" + get["host"];
                    send += "&key=" + get["key"];
                    send += "&videollamada=true";
                    send += "&origin=" + location.origin;
                    send += "&href=" + location.href;
                    send += "&protocol=" + __protocolNwChat;
                    send += "&host=" + get.host;
                    var urInfoContactNw = domain + "/nwlib6/nwproject/modules/nw_chat2/index2.php" + send;
                    window.open(urInfoContactNw, 'popup', 'width=400,height=650,left=100,top=130');
                };
            }
            if (__llamadavozNwChat === true) {
                document.querySelector('.btnCallFreeNw').onclick = function () {
                    cleanContainersNwC();
                    closeOnlyNwChat();
                    var send = "";
                    send += "?id=" + get["id"];
                    send += "&host=" + get["host"];
                    send += "&key=" + get["key"];
                    send += "&videollamada=true";
                    send += "&video=false";
                    send += "&origin=" + location.origin;
                    send += "&href=" + location.href;
                    send += "&protocol=" + __protocolNwChat;
                    send += "&host=" + get.host;
                    var urInfoContactNw = domain + "/nwlib6/nwproject/modules/nw_chat2/index2.php" + send;
                    window.open(urInfoContactNw, 'popup', 'width=400,height=650,left=100,top=130');
                };
            }
            if (__datoscontactoNwChat === true) {
                document.querySelector('.btnInfoSiteNw').onclick = function () {
                    cleanContainersNwC();
                    var urInfoContactNw = domain + "/nwlib6/nwproject/modules/nw_chat2/src/infoContactNw.php?id=" + get["id"] + "&host=" + get["host"] + "&key=" + get["key"] + "";
                    var div = document.querySelector('.containDataInfoSiteNw');
                    div.style.display = 'block';
                    var html = "";
                    html += "<div class='closeFrameNWForm' style='cursor: pointer;'>Cerrar</div>";
                    html += "<iframe src='" + urInfoContactNw + "' scrolling='no' style='border: 0;'></iframe>";
                    div.innerHTML = html;
                    document.querySelector('.closeFrameNWForm').onclick = function () {
                        cleanContainersNwC();
                    };
                };
            }
            if (__formContactoNwChat === true) {
                document.querySelector('.btnFormContactNw').onclick = function () {
                    cleanContainersNwC();
                    minimiceOnlyNwChat();
                    var send = "";
                    send += "?id=" + get["id"];
                    send += "&host=" + get["host"];
                    send += "&key=" + get["key"];
                    send += "&videollamada=true";
                    send += "&video=false";
                    send += "&origin=" + location.origin;
                    send += "&href=" + location.href;
                    send += "&protocol=" + __protocolNwChat;
                    send += "&host=" + get.host;
                    var urInfoContactNw = domain + "/nwlib6/nwproject/modules/nw_chat2/src/formContactSites.php" + send;
                    var div = document.querySelector('.containFormSiteNw');
                    div.style.display = 'block';
                    var html = "";
                    html += "<div class='closeFrameNWForm' style='position: fixed;top: 0;right: 0;background: #fff;color: #000;z-index: 100;padding: 10px;margin: 2px;cursor: pointer;font-weight: bold;border-radius: 50%;width: 30px;height: 30px;text-align: center;font-size: 10px;line-height: 28px;'>Cerrar</div>";
                    html += "<iframe src='" + urInfoContactNw + "' scrolling='no' style='border: 0;position: fixed;background: rgba(0, 0, 0, 0.52);top: 0;left: 0;width: 100%;height: 100%;margin: 0;padding: 0;'></iframe>";
                    div.innerHTML = html;

                    document.querySelector('.closeFrameNWForm').onclick = function () {
                        cleanContainersNwC();
                        maxOnlyNwChat();
                    };
                };
            }
            function cleanContainersNwC() {
                var div = document.querySelector('.containDataInfoSiteNw');
                div.innerHTML = "";
                div.style.display = 'none';
                var div = document.querySelector('.containFormSiteNw');
                div.innerHTML = "";
                div.style.display = 'none';
            }

            if (!isMobileNwChat()) {
                frameChat();
            }

        }
        __iframeNwChat = function frameChatInit() {
            frameChat();
        }
        function frameChat() {
            minimizarNwChat();

            if (document.querySelector("#divBtnsNwident")) {
                if (isMobileNwChat()) {
//                    document.querySelector("#divBtnsNwident").style.right = "0px";
//                    document.querySelector("#divBtnsNwident").style.bottom = "-120%";
                    document.querySelector("#divBtnsNwident").style.WebkitTransform = "translate(0px, 1000px)";
                } else {
                    document.querySelector("#divBtnsNwident").style.right = "305px";
                }
                if (__formContactoNwChat === true)
                    document.querySelector(".btnFormContactNw").style.float = "none";
                if (__datoscontactoNwChat === true)
                    document.querySelector(".btnInfoSiteNw").style.float = "none";
                if (__videollamadaNwChat === true)
                    document.querySelector(".btnCallNw").style.float = "none";
                if (__llamadavozNwChat === true)
                    document.querySelector(".btnCallFreeNw").style.float = "none";
                document.querySelector(".btnChatNw").style.float = "none";
            }
            var html = "";
            html += "<p class='pTitleNwChat'" + __dataEncTitleNwChat + ">" + __titleBarraNwChat + "</p>";
            html += "<span class='minNwChat" + ident + "'><span class='minNwChatIcon'></span></span>";
            html += "<span class='closeNwChat" + ident + "'><span class='closeNwChatIcon closeNwChatIcon1'></span><span class='closeNwChatIcon closeNwChatIcon2'></span></span>";
            var divBtnsNw = document.createElement("div");
            divBtnsNw.className = "titleEncNwChat";
            divBtnsNw.innerHTML = html;
            var controldivBtnCall = document.getElementById("titleEncNwChat");
            if (controldivBtnCall == null) {
                document.querySelector("#containNwChat" + ident).appendChild(divBtnsNw);
            }
            var html = "";
            html += loadingNwChat();
            var divBtnsNw = document.createElement("div");
            divBtnsNw.id = "divLoadingNwC" + ident;
            divBtnsNw.innerHTML = html;
            var controldivBtnCall = document.getElementById("divLoadingNwC" + ident);
            if (controldivBtnCall == null) {
                document.querySelector("#containNwChat" + ident).appendChild(divBtnsNw);
            }
            document.querySelector(".closeNwChat" + ident).style.display = "block";
            document.querySelector(".closeNwChat" + ident).style.position = "absolute";
            document.querySelector(".closeNwChat" + ident).style.right = "2px";
            document.querySelector(".closeNwChat" + ident).style.top = "0px";
            document.querySelector(".closeNwChat" + ident).style.width = "20px";
            document.querySelector(".closeNwChat" + ident).style.height = "100%";
            document.querySelector(".closeNwChat" + ident).style.cursor = "pointer";
            var iconcerrar = document.querySelectorAll(".closeNwChatIcon");
            for (var i = 0; i < iconcerrar.length; i++) {
                iconcerrar[i].style.background = "#fff";
                iconcerrar[i].style.display = "block";
                iconcerrar[i].style.width = "20px";
                iconcerrar[i].style.height = "3px";
                iconcerrar[i].style.top = "13px";
                iconcerrar[i].style.position = "absolute";
            }
            document.querySelector(".closeNwChatIcon1").style.transform = "rotate(40deg)";
            document.querySelector(".closeNwChatIcon2").style.transform = "rotate(-40deg)";


            document.querySelector(".minNwChat" + ident).style.display = "block";
            document.querySelector(".minNwChat" + ident).style.position = "absolute";
            document.querySelector(".minNwChat" + ident).style.right = "32px";
            document.querySelector(".minNwChat" + ident).style.top = "0px";
            document.querySelector(".minNwChat" + ident).style.width = "20px";
            document.querySelector(".minNwChat" + ident).style.height = "100%";
            document.querySelector(".minNwChat" + ident).style.cursor = "pointer";

            document.querySelector(".minNwChatIcon").style.background = "#fff";
            document.querySelector(".minNwChatIcon").style.display = "block";
            document.querySelector(".minNwChatIcon").style.width = "20px";
            document.querySelector(".minNwChatIcon").style.height = "3px";
            document.querySelector(".minNwChatIcon").style.top = "13px";
            document.querySelector(".minNwChatIcon").style.position = "relative";
            document.querySelector(".minNwChatIcon").style.cursor = "pointer";

            document.querySelector(".titleEncNwChat").style.position = "relative";
            document.querySelector(".titleEncNwChat").style.zIndex = "2";
            document.querySelector(".titleEncNwChat").style.background = "#0072ce";
            document.querySelector(".titleEncNwChat").style.color = "#fff";
            document.querySelector(".titleEncNwChat").style.padding = "10px 0px";
            document.querySelector(".titleEncNwChat").style.fontSize = "12px";
            document.querySelector(".titleEncNwChat").style.fontFamily = "Arial";
            document.querySelector(".titleEncNwChat").style.borderBottom = "1px solid #fff";
            if (isMobileNwChat()) {
                document.querySelector(".titleEncNwChat").style.position = "fixed";
                document.querySelector(".titleEncNwChat").style.width = "100%";
                document.querySelector(".titleEncNwChat").style.zIndex = "10000";
            }
            document.querySelector(".pTitleNwChat").style.textAlign = "center";
            document.querySelector(".pTitleNwChat").style.margin = "0";

            document.querySelector('.closeNwChat' + ident).onclick = function () {
                if (!isMobileNwChat()) {
                    minimizarNwChat();
                } else {
                    if (__onlyChatNwChat === 0) {
                        minimizarNwChat();
                        return;
                    }
                    if (document.querySelector("#divBtnsNwident")) {
                        closeOnlyNwChat();
                    } else {
                        minimizarNwChat();
                    }
                }
            };
            document.querySelector('.minNwChat' + ident).onclick = function () {
                minimizarNwChat();
            };

            var send = "";
            var href = location.href;
            href = href.replace(/#/gi, "(nwhashtag)");
            href = href.replace(/&/gi, "(nwampersan)");
            send += "&origin=" + location.origin;
            send += "&href=" + href;
            send += "&protocol=" + __protocolNwChat;
            send += "&host=" + get.host;
            __urlNwChat += send;
            var frameNwChat = document.createElement("IFRAME");
            frameNwChat.id = "frameNwChat" + ident;
            frameNwChat.src = __urlNwChat;
            frameNwChat.scrolling = "no";
            var control = document.getElementById("frameNwChat" + ident);
            if (control == null) {
                document.querySelector("#containNwChat" + ident).appendChild(frameNwChat);
            }
            if (isMobileNwChat()) {
                document.querySelector("#containNwChat" + ident).style.width = "100%";
                document.querySelector("#containNwChat" + ident).style.height = "100%";
                document.querySelector("#containNwChat" + ident).style.left = "0px";
                document.querySelector("#containNwChat" + ident).style.top = "0px";
            } else {
                document.querySelector("#containNwChat" + ident).style.width = "300px";
                document.querySelector("#containNwChat" + ident).style.height = "450px";
                document.querySelector("#containNwChat" + ident).style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.53)";
                document.querySelector("#containNwChat" + ident).style.right = "15px";
            }
            document.querySelector("#containNwChat" + ident).style.display = "block";
            setTimeout(function () {
                document.querySelector("#containNwChat" + ident).style.bottom = "0px";
            }, 50);
            document.querySelector("#containNwChat" + ident).style.position = "fixed";
            document.querySelector("#containNwChat" + ident).style.zIndex = "10000000000000000";
            document.querySelector("#containNwChat" + ident).style.background = "#ffffff";

//            document.querySelector("#buttonOpenNwChat" + ident).style.display = "none";
            document.querySelector("#buttonOpenNwChat" + ident).style.display = "block";
            document.querySelector("#buttonOpenNwChat" + ident).style.bottom = "-50%";

            if (isMobileNwChat()) {
                document.querySelector("#frameNwChat" + ident).style.height = "100%";
                document.querySelector("#frameNwChat" + ident).style.width = "100%";
            } else {
                document.querySelector("#frameNwChat" + ident).style.height = "420px";
                document.querySelector("#frameNwChat" + ident).style.width = "300px";
            }
            document.querySelector("#frameNwChat" + ident).style.position = "relative";
            document.querySelector("#frameNwChat" + ident).style.overflow = "hidden";
            document.querySelector("#frameNwChat" + ident).style.zIndex = "3";
            document.querySelector("#frameNwChat" + ident).style.border = "0";
        }
        function loadMonitoreo() {
            //            var li = "L253bGliNi9ud3Byb2plY3QvbW9kdWxlcy9ud19jaGF0Mi9zcmMvbW9uLnBocA==";
            var li = "/nwlib6/nwproject/modules/nw_chat2/src/mon.php";
//            var url = domain + atob(li);
            var url = domain + li;
            var send = "";
            var href = location.href;
            href = href.replace(/#/gi, "(nwhashtag)");
            href = href.replace(/&/gi, "(nwampersan)");
            send += "origin=" + location.origin;
            send += "&href=" + href;
            send += "&protocol=" + __protocolNwChat;
            send += "&host=" + get.host;
            send += "&key=" + get.key;
            send += "&id=" + get.id;
            send += "&llamadavoz=" + get.llamadavoz;
            var div = document.createElement('div');
            div.id = 'iframeNwChatMoon';
            div.style.display = 'none';
            div.style.cursor = 'pointer';
            send = send.replace(/#/gi, "");
            var urlEnd = url + "?" + send;
            urlEnd = encodeURI(urlEnd);
            div.innerHTML = '<iframe id="iframeNwChatMoonIframe" src="' + urlEnd + '"></iframe>';
            document.body.appendChild(div);
            setTimeout(function () {
                var frame = document.querySelector('#iframeNwChatMoonIframe');
                frame.contentWindow.postMessage(false, '*');
            }, 1500);
        }
    }
    function loadingNwChat() {
        var load = "<div id='loadingNwChat' class='loadingNwChat' style='\n\
             background-color: #fff;\n\
             position: absolute;\n\
             top: 0;\n\
             left: 0;\n\
             width: 100%;\n\
             height: 100%;\n\
z-index: 1;\n\
             ' >\n\
            <div class='h1_carga' style='    position: relative;\n\
                 top: 20%;\n\
                 margin: auto;\n\
                 max-width: 120px;'>\n\
                <div class='loader2' id='loader' style='    width: 50px;\n\
                     height: 50px;\n\
                     position: absolute;\n\
                     top: 50%;\n\
                     left: 50%;\n\
                     margin: -25px 0 0 -25px;\n\
                     font-size: 10px;\n\
                     text-indent: -12345px;\n\
                     border-top: 1px solid rgba(0,0,0, 0.08);\n\
                     border-right: 1px solid rgba(0,0,0, 0.08);\n\
                     border-bottom: 1px solid rgba(0,0,0, 0.08);\n\
                     border-left: 1px solid rgba(0,0,0, 0.5);\n\
                     -webkit-border-radius: 50%;\n\
                     -moz-border-radius: 50%;\n\
                     border-radius: 50%;\n\
                     -webkit-animation: load3 700ms infinite linear;\n\
                     -moz-animation: load3 700ms infinite linear;\n\
                     -ms-animation: load3 700ms infinite linear;\n\
                     -o-animation: load3 700ms infinite linear;\n\
                     animation: load3 700ms infinite linear;\n\
                     z-index: 100001;' ></div>\n\
            </div>\n\
            <style>\n\
                @-webkit-keyframes load3 { \n\
                    0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }\n\
                    100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\n\
                }\n\
                @keyframes load3 { \n\
                    0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); } \n\
                    100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\n\
                }\n\
            </style>\n\
        </div>";
        return load;
    }
    function activeAnimationBtn(btn, right, time) {

        if (isMobileNwChat()) {
            document.querySelector(btn).style.WebkitTransform = "translate(1000px, 1000px)";
        } else {
            document.querySelector(btn).style.WebkitTransform = "translate(" + right + ", 0px)";
//            document.querySelector(btn).style.right = right;
        }

        setTimeout(function () {
            if (isMobileNwChat()) {
                if (btn == ".btnCallFreeNw") {
                    document.querySelector(btn).style.WebkitTransform = "translate(35px, 80px)";
                } else
                if (btn == ".btnCallNw") {
                    document.querySelector(btn).style.WebkitTransform = "translate(200px, 80px)";
                } else
                if (btn == ".btnInfoSiteNw") {
                    document.querySelector(btn).style.WebkitTransform = "translate(170px, 190px)";
                } else
                if (btn == ".btnFormContactNw") {
                    document.querySelector(btn).style.WebkitTransform = "translate(70px, 190px)";
                } else {
                    document.querySelector(btn).style.WebkitTransform = "translate(120px, 10px)";
                }
            } else {
                document.querySelector(btn).style.WebkitTransform = "translate(0px, 0px)";
//            document.querySelector(btn).style.right = "0px";                
            }
        }, time);
    }
    function addTransitionBtn(btn) {
        document.querySelector(btn).style.transition = "all 0.5s ease";
        document.querySelector(btn).style.webkitTransition = "all 0.5s ease";
        document.querySelector(btn).style.MozTransition = "all 0.5s ease";
        document.querySelector(btn).style.oTransition = "all 0.5s ease";
    }
}

function activeMensajeNwChatP(pr) {
    if (typeof pr == "string") {
        pr = JSON.parse(pr);
    }
    if (typeof pr.new_message != "undefined" && typeof pr.texto != "undefined") {
        if (pr.texto.indexOf("ha iniciado una videollamada") != -1) {
            return;
        }
        if (document.querySelector(".newMesNwChat"))
            document.querySelector(".newMesNwChat").remove();

        var da = document.querySelector(".containNwChat");
        var h = document.createElement("div");
        h.className = "newMesNwChat";
        h.innerHTML = pr.texto;
        da.appendChild(h);

        var di = document.querySelector(".buttonOpenNwChat");
        var h = document.createElement("div");
        h.className = "newMesNwChat";
        h.innerHTML = pr.texto;
        di.appendChild(h);

        if (document.querySelector(".newMesNwChat")) {
            document.querySelector(".newMesNwChat").onclick = function () {
                this.remove();
            };
        }

        return;
    }
    if (typeof pr.launchConfigMaster != "undefined") {
        if (pr.launchConfigMaster === true) {
//            console.log("load config from server");
            var va = __createButtonInitialNwChat(pr);
            __urlNwChat = va.url;
            __dataEncTitleNwChat = va.dataEncTile;
            __titleBarraNwChat = va.titleBarra;

            __formContactoNwChat = false;
            if (pr.formContacto == "SI") {
                __formContactoNwChat = true;
                __onlyChatNwChat++;
            }
            __datoscontactoNwChat = false;
            if (pr.datoscontacto == "SI") {
                __datoscontactoNwChat = true;
                __onlyChatNwChat++;
            }
            __llamadavozNwChat = false;
            if (pr.llamadavoz == "SI") {
                __llamadavozNwChat = true;
                __onlyChatNwChat++;
            }
            __videollamadaNwChat = false;
            if (pr.videollamada == "SI") {
                __videollamadaNwChat = true;
                __onlyChatNwChat++;
            }
            return;
        }
    }
    if (typeof pr.estado != "undefined" && typeof pr.tipo != "undefined") {
        if (pr.estado == "EN LINEA" || pr.estado == "LLAMANDO") {
            if (pr.tipo == "videollamada") {
                __createButtonsNwChatContact();
                return;
            }
            if (!isMobileNwChat()) {
                __createButtonsNwChatContact();
            }
            if (typeof localStorage["minNwChat"] != "undefined") {
                if (localStorage["minMaxNwChat"] == "MIN")
                    __minimizarNwChat();
            }

            var frame = document.getElementById('iframeNwChatMoonIframe');
            frame.contentWindow.postMessage("conversationOpen", '*');

            return;
        }
    }
    var css = "position: relative;font-size: 16px;font-family: arial;background: #fff;box-shadow:-3px 4px 8px 0px rgba(0, 0, 0, 0.18);border: 1px solid #afafaf;";
    css += "overflow:hidden;";
    if (!isMobileNwChat()) {
        css += "border-top-left-radius:5px;";
    } else {
        css += "position:fixed;bottom:-100%;width:100%;";
    }
    var html = "";
    html += "<div class='containerNwChatActiveP' style='" + css + "'>";
    var cssFoto = "background-image:url(" + __domainNwChat + pr.config.foto_autorespondedor + ");";
    cssFoto += "background-size:cover;";
    cssFoto += "display:inline-block;";
    cssFoto += "width:40px;";
    cssFoto += "height:40px;";
    cssFoto += "margin:3px;";
    cssFoto += "position:relative;";
    var cssName = "display:inline-block;top: -12px;position: relative;";
    html += "<div class='userNwChatActiveP' style='position:relative;overflow:hidden;background:#7c7c7c;color:#fff;'><span style='" + cssFoto + "'></span><span style='" + cssName + "'>" + pr.atiende + " dice:</span><span class='closeWindowEmergenNwChat' style='position: absolute;right: 5px;top: 1px;font-size: 20px;font-weight: bold;cursor: pointer;'>X</span></div>";
    html += "<div class='mensajeNwChatActiveP' style='padding:12px;min-height: 200px;'>" + pr.mensaje_al_visitante + "</div>";
    html += "<div class='btnNwChatActiveP' style='cursor:pointer;padding: 8px;text-align: center;background-color: #33bb46;color: #fff;font-size: 18px;font-weight: bold;'>Recibir asistencia</div>";
    html += "</div>";

    var div = document.createElement('div');
    div.id = 'activeMensajeNwChatP';
    div.style.position = 'fixed';
    div.style.right = '0px';
    if (isMobileNwChat()) {
        div.style.bottom = '0px';
    } else {
        div.style.bottom = '-100%';
    }
    div.style.zIndex = '1000000000';
    if (isMobileNwChat()) {
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.backgroundColor = "rgba(0, 0, 0, 0.62)";
        div.style.opacity = "0";
    } else {
        div.style.width = '250px';
    }
    div.innerHTML = html;

    var el = document.querySelector("body");
//    el.insertBefore(div, el.firstChild);
    el.appendChild(div);
    setTimeout(function () {
        if (isMobileNwChat()) {
            document.querySelector(".containerNwChatActiveP").style.bottom = "0px";
            document.querySelector("#activeMensajeNwChatP").style.opacity = "1";
        } else {
            document.querySelector("#activeMensajeNwChatP").style.bottom = "0px";
        }
    }, 1000);
    __initNwChatP = true;

    document.querySelector(".btnNwChatActiveP").onclick = function () {
        closeWindowEmergentNwc();
        __createButtonsNwChatContact();
        var frame = document.getElementById('iframeNwChatMoonIframe');
        frame.contentWindow.postMessage("openClick", '*');
    }
    document.querySelector(".closeWindowEmergenNwChat").onclick = function () {
        closeWindowEmergentNwc();
    };
    function closeWindowEmergentNwc() {
        if (isMobileNwChat()) {
            document.querySelector(".containerNwChatActiveP").style.bottom = "-100%";
            document.querySelector("#activeMensajeNwChatP").style.opacity = "0";
        } else {
            document.querySelector("#activeMensajeNwChatP").style.bottom = "-100%";
        }
        setTimeout(function () {
            document.querySelector("#activeMensajeNwChatP").remove();
        }, 500);
        var frame = document.getElementById('iframeNwChatMoonIframe');
        frame.contentWindow.postMessage("reading", '*');
    }
}
function isMobileNwChat() {
    var device = navigator.userAgent;
    if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i))
    {
        return true;
    }
    return false;
}

window.addEventListener('message', function (e) {
    var get = getGetNwChat();

    if (document.querySelector(".newMesNwChat")) {
        document.querySelector(".newMesNwChat").remove();
    }
    var domain = __protocolNwChat + "//" + get["host"];
    if (e.data == "iniciado") {
        return;
    }
    if (e.data == "endConversation") {
        localStorage["inConversationNwChat"] = "NO";
        return;
    }
    if (e.data == "initConversation") {
        localStorage["inConversationNwChat"] = "SI";
        return;
    }
    if (e.origin === domain) {
        activeMensajeNwChatP(e.data);
    }
}, false);

