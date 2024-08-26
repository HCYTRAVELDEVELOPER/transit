var __configNwChat = {};
var __userDataNwChat = {};
var timeoutIDNotifica = [];
var __countChatsByUser = [];
var development = false;
var nameLocalSNwChatsOpen = "allUsersNwChatt";
var operatorsOnline = true;

function clearAlertNotifica() {
    window.clearTimeout(timeoutIDNotifica);
}
function newNwChat() {
    var thisDoc = this;
    this.rand = Math.floor((Math.random() * 100000) + 1);
    this.setConfig = setConfig;
    this.initNwChat = initNwChat;
    this.setConfigNwChat = setConfigNwChat;
    this.getConfigNwChat = getConfigNwChat;
    this.setuserDataNwChat = setuserDataNwChat;
    this.addCssOcultoNwChat = addCssOcultoNwChat;
    this.createWindowMessageDisconect = createWindowMessageDisconect;
    this.createNwChatConversation = createNwChatConversation;
    this.createLoginChat = createLoginChat;
    thisDoc.initNwChat();

    function setConfigNwChat(df) {
        __configNwChat = df;
    }
    function getConfigNwChat() {
        return __configNwChat;
    }
    function setConfig(callBack) {
        var get = getGET();
        if (callBack === "intern") {
            var c = nwm.getInfoApp();
            var v = c.version;
            var configGral = nwm.getConfigApp();
            get = {};
            get.callingIntern = "callingIntern";
            get.host = "";
            get.key = "";
            get.id = "";
            if (!isMobile()) {
                var allUsersOpen = getLocalStorageArray(nameLocalSNwChatsOpen);
                allUsersOpen = removeDuplicates(allUsersOpen, "user");
                var t = allUsersOpen.length;
                if (t > 0) {
                    for (var i = 0; i < t; i++) {
                        var g = allUsersOpen[i];
                        var id = ".container-conversations" + cleanUserNwC(g.user);
                        var isMax = true;
                        if (typeof localStorage["windowMinOrMaxNwChat_" + id] != "undefined") {
                            if (localStorage["windowMinOrMaxNwChat_" + id] === "MIN") {
                                isMax = false;
                            }
                        }
                        isMax = false;
                        var user = g.user;
                        var name = false;
                        var container = ".footerTools";
                        var focus = true;
                        var createStorage = false;
                        var loadData = isMax;
                        windowNwChatPes(user, name, container, focus, createStorage, loadData);
                        if (isMax === false) {
                            minimiceWindowNwChat(id);
                        }
                    }
                    testIsNotificacions(true);
                }
            }
        }
        var data = {};
        data.GET = get;
        data.id_sess = setDataSend();
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "initConfig";
        rpc["data"] = data;
        var func = function (r) {
            if (r == "0") {
                if (isOnline()) {
                    nw_dialog("No hay configuración de nwchat. Consulte con el administrador del sistema.");
                }
                return;
            }
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            thisDoc.setConfigNwChat(r.config);
            thisDoc.setuserDataNwChat(r.data_user);
            thisDoc.addCssOcultoNwChat();
            if (callBack === true) {
                activeButtonsNwMaker();
                if (!r["operadores_conectados"]) {
                    operatorsOnline = false;
                    /*
                     thisDoc.createWindowMessageDisconect();
                     return;
                     */
                }
                window.parent.postMessage("endConversation", '*');
                console.log(r);
                if (r.data_user.init_call_user === true && r.config.usar_bot === "SI" || r.config.usar_bot === "SI") {
                    thisDoc.createNwChatConversation();
                    return;
                }
                thisDoc.createLoginChat();
                return;
            }
            return;
        };
        rpcNw("rpcNw", rpc, func, true);
    }

    function maximiceWindowNwChat(self) {
        var uu = self.replace(".container-conversations", "");
        $(".globoRedNwChatList_" + uu).remove();
        localStorage["windowMinOrMaxNwChat_" + self] = "MAX";
        $(self).removeClass("miniWindowNwChat");
        $(self + " .nameEncNwChat").removeClass("nameEncNwChat_min");
        $(self + " .nameEncNwChat").addClass("userEtiqueted");
        $(self).find(".globoRedNwChat").remove();
        $(self).find("#texto").focus();
        vista(self);
    }

    function inActiveAllBar() {
        var a = document.querySelectorAll(".enc-div-chat");
        for (var i = 0; i < a.length; i++) {
            a[i].style.backgroundColor = "#a5a5a5";
        }
    }

    function minimiceWindowNwChat(self) {
        localStorage["windowMinOrMaxNwChat_" + self] = "MIN";
        $(self).addClass("miniWindowNwChat");
        $(self + " .nameEncNwChat").addClass("nameEncNwChat_min");
        $(self + " .nameEncNwChat").removeClass("userEtiqueted");
        inActiveAllBar();
        /*
         document.querySelector(self + " .enc-div-chat").style.backgroundColor = "#a5a5a5";
         var us = self.replace(".container-conversations", "");
         var allClass = ".containerConvers_" + us;
         var vars = timeoutIDNotifica[allClass];
         clearInterval(vars);
         timeoutIDNotifica[allClass] = false;
         */
    }

    function initNwChat() {
        if (isMobile()) {
            $(".container-mensaje-disconected").css({"margin-top": "40px"});
        }
        (function () {
            $('body').delegate('.videollamada', 'click', function () {
                var us = $(this).attr("data-us");
                var up = getUserInfo();
                nwrtc.startConversation(up.usuario, us);
                return;
                /*
                 var domain = document.domain;
                 var url = "https://" + domain + "/nwlib6/nwproject/modules/webrtc/testing/two/index.php?usuario=" + us + "&calling=true";
                 window.open(url, "Nw WebRtc", "width=1000,height=600");
                 */
            });
        })();
        (function () {
            $('body').delegate('.buttonEncAct', 'click', function () {
                var type = $(this).attr("mode");
                var self = $(this).attr("self");
                var us = $(this).attr("us");
                var user = $(this).attr("user");
                var allClass = ".containerConvers_" + us;
                var vars = timeoutIDNotifica[allClass];
                if (type == "close") {
                    removeItemLocalStorageArray(nameLocalSNwChatsOpen, user);
                    remove(self);
                    clearInterval(vars);
                    timeoutIDNotifica[allClass] = false;
                } else
                if (type == "min") {
                    minimiceWindowNwChat(self);
                    clearInterval(vars);
                    timeoutIDNotifica[allClass] = false;
                }
            });
        })();
        (function () {
            $('body').delegate('.nameEncNwChat_min', 'click', function () {
                var self = $(this).attr("self");
                var us = $(this).attr("user");
                maximiceWindowNwChat(self);
                var d = new f_chat(thisDoc, us, ".footerTools");
                var selfs = d.constructor();
                d.startConsulta(selfs);

            });
        })();
        (function () {
            $('body').delegate('.container-center-conversations', 'click', function () {
                $(".colsMenuInt").removeClass("colsMobil_show_menu");
            });
        })();
        (function () {
            $('body').delegate('.container-box-bottom', 'click', function () {
                $(".colsMenuInt").removeClass("colsMobil_show_menu");
            });
        })();
        var get = getGET();
        if (typeof get["callingvd"] != "undefined") {
            if (get["callingvd"] == "true") {
                setTimeout(function () {
                    $(".videollamada").remove();
                }, 2000);
                $("body").append("<style>.videollamada{display: none;}</style>");
            }
        }
        if (typeof get["callingIntern"] != "undefined") {
            if (get["callingIntern"] == "true") {
                $(".colsMenu_nwchat").remove();
            }
        }
    }

    function createWindowMessageDisconect() {
        loadJs("/nwlib6/nwproject/modules/nw_chat2/js/forms/f_mensaje_desconectado.js", function () {
            f_mensaje_desconectado(thisDoc);
        }, false, true);
    }

    function createNwChatConversation(userName, container, loadData) {
        var get = getGET();
        if (typeof get.videollamada != "undefined") {
            loadJs("/nwlib6/nwproject/modules/nw_chat2/js/forms/f_llamada_video.js", function () {
                var da = new f_llamada_video();
                da.constructor();
            }, false, true);
            return;
        }
        var d = new f_chat(thisDoc, userName, container, loadData);
        d.constructor();
    }

    function createLoginChat() {
        loadJs("/nwlib6/nwproject/modules/nw_chat2/js/forms/f_login.js", function () {
            f_login(thisDoc);
        }, false, true);
    }

    function addCssOcultoNwChat() {
        var config = thisDoc.getConfigNwChat;
        if (evalueData(config["codigo_oculto"])) {
            var html = "";
            html += config["codigo_oculto"];
            $("#container-css-oculto").html(html);
        }
    }


}

function removedLoadingNwChat() {
    $(".loadingNwChat").remove();
}
function hiddenContextMenuEnc() {
    $(".colsMenuInt").fadeOut(0);
}

function setuserDataNwChat(df) {
    __userDataNwChat = df;
}
function getUserDataNwChat() {
    var up = __userDataNwChat;
    up["correo"] = up["email"];
    return up;
}

function createSecciones(self) {
    loadJs("/nwlib6/nwproject/modules/nw_chat2/js/lists/l_secciones.js", function () {
        var d = new l_secciones(self);
        d.constructor();
    }, false, true);
}

function vista(self) {
    if (isMobile()) {
        return;
    }
    var altoTotal = $(self).height();
    var altoBox = $(self + " #nwform").height();
    var altoBarEnc = 0;
    var altoCenter = parseInt(altoTotal) - parseInt(altoBox) - parseInt(altoBarEnc) - 45;
    if (isMobile()) {
        altoBarEnc = altoBarEnc + 25;
        altoCenter = altoCenter - 35;
    }
    $(self + " .containerConvers").css({"top": altoBarEnc + "px", "height": altoCenter});
    scroll(self);
}


function alertSize() {
    var myWidth = 0, myHeight = 0;
    if (typeof (window.innerWidth) == 'number') {
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    var rta = {};
    rta["height"] = myHeight;
    rta["width"] = myWidth;
    return rta;
}

function vistaSecciones() {
    var altoTotal = $("body").height();
    var altoBox = $(".addHeaderNoteList").height();
    var altoBarEnc = 90;
    var altoCenter = altoTotal - altoBox - altoBarEnc;
    $(".container-table-list").css({"height": altoCenter});
}

function changeEncConversation(ra) {
    $(".operator-enc").text(ra["nombre_operador"]);
    $(".number-conversation").text("Servicio en línea #" + ra["visitante"]);
    $(".operator-foto-enc").css({"background-image": "url(" + ra["foto_usuario"] + ")"});
}

function changeStatusEnc(status, op, opName) {
    $(".call-status").html(" " + status);
    if (op !== false) {
        $(".operator-enc").html("<span class='userOperator'>" + op + "</span>" + opName);
    }
}

function scroll(self) {
    var totalChats = $(self).find(".chats_conversations").length;
    var altoChats = parseInt($(self).find(".chats_conversations").height()) + 200;
    var altoCenter = altoChats * totalChats;
    $(self + " .containerConvers").animate({scrollTop: altoCenter + 'px'}, 0);
}

function soundOperator() {
    if (localStorage["play_timbre"] != "NO") {
        document.getElementById('usuario_sound').play();
    }
}

function soundUser() {
    if (localStorage["play_timbre"] != "NO") {
        document.getElementById('operador_sound').play();
    }
}

function initVideoCallNwC(user) {
    var get = getGET();
    var video = "";
    if (typeof get.video != "undefined") {
        if (get.video == "false") {
            video = "&video=false";
        }
    }
    var datosCliente = getUserDataNwChat();
    var cli = "";
    if (datosCliente.celular != null && datosCliente.celular != "") {
        cli = datosCliente.celular;
    }
    if (datosCliente.correo != null && datosCliente.correo != "") {
        cli = datosCliente.correo;
    }
    var en = "?t=" + datosCliente.terminal_id + ",op=" + user + ",cli=" + cli;
    var url = "/nwlib6/nwproject/modules/webrtc/testing/two/index.php" + en;
//    var url = "/nwlib6/nwproject/modules/webrtc/testing/two/index.php?usuario=" + cli + "&calling=true";
//    window.location = url;
    nwrtc.startConversation(user, cli, "video", "_self");
}

function setDataSend() {
    var get = getGET();
    return get.id + get.origin;
}