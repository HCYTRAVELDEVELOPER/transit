function f_chat(thisDoc, userName, container, loadData) {
    var esteDoc = this;
    var c = false;
    if (typeof nwm !== "undefined")
        c = nwm.getInfoApp();
    esteDoc.up = getUserInfo();
    esteDoc.idInSound = {};
    esteDoc.constructor = constructor;
    esteDoc.cargaMensajesAll = cargaMensajesAll;
    esteDoc.startConsulta = startConsulta;
    esteDoc.sendMessageVisitor = sendMessageVisitor;
    esteDoc.checkCallOnlineOperator = checkCallOnlineOperator;
    esteDoc.createLinesConversation = createLinesConversation;
    esteDoc.lineByLineConversation = lineByLineConversation;
    esteDoc.reinitNwChat = reinitNwChat;
    esteDoc.finalizarNwChat = finalizarNwChat;
    esteDoc.isKokwa = true;
    esteDoc.chatInit = false;
    esteDoc.chatOperator = false;
    esteDoc.isGroup = false;
    esteDoc.paginateMore = false;
    esteDoc.paginateLimit = 20;
    var get = getGET();
    function constructor() {
        esteDoc.rand = Math.floor((Math.random() * 100000) + 1);
        if (evalueData(userName) == true) {
            esteDoc.isKokwa = false;
            esteDoc.userName = userName;
            if (typeof userName == "number") {
                esteDoc.rand = userName;
                esteDoc.chatOperator = true;
            } else {
                userName = userName.toString();
                var id = cleanUserNwC(userName);
                esteDoc.rand = id;
            }
        }
        var divPadreContainer = "body";
        if (typeof container != "undefined") {
            divPadreContainer = container;
        }
        esteDoc.existe = true;
        var classDocument = ".container-conversations" + esteDoc.rand;
        var self = classDocument;
        if (!document.querySelector(classDocument)) {
            createContainer(divPadreContainer, true, classDocument);
            self = createDocument(classDocument);
            esteDoc.existe = false;
        }
        if (esteDoc.existe === true) {
            focusInput(self, "texto");
            activeBar(self);
            return self;
        }
        document.querySelector(self).addEventListener("click", function () {
            activeBar(self);
        });
        esteDoc.self = self;
        var dataUser = getUserDataNwChat();

        var fields = [
            {
                tipo: 'textArea',
                nombre: 'Mensaje',
                name: 'texto',
                requerido: "SI",
                placeholder: "Escribe tu mensaje..."
            },
            {
                tipo: 'button',
                label: 'Enviar',
                nombre: 'Enviar',
                name: 'enviar'
            },
            {
                tipo: 'uploader',
                label: 'Adjunto',
                nombre: 'Adjunto',
                name: 'adjunto'
            },
            {
                tipo: 'button',
                label: 'Emoji',
                nombre: 'Emoji',
                name: 'emoji'
            },
            {
                tipo: 'button',
                label: 'Gif',
                nombre: 'Gif',
                name: 'gif'
            }
        ];
        var selfEnc = createContainer(self, true, ".containerEncChat_" + esteDoc.rand);
        $(selfEnc).addClass("containerEncChat");
        var enc = "";
        enc += "<div class='bar-enc-conversation'>";
        if (esteDoc.isKokwa === false) {
            enc += "<div class='enc-div-chat enc-div-chat_" + userName + "' user='" + userName + "' self='" + self + "' us='" + esteDoc.rand + "'>";
            var equis = "x";
            if (isMobile()) {
                equis = "<";
            }
            enc += "<span mode='close' user='" + userName + "' self='" + self + "' us='" + esteDoc.rand + "' class='buttonEncAct closeChat'>" + equis + "</span>";
            if (!isMobile()) {
                enc += "<span mode='min' user='" + userName + "' self='" + self + "' us='" + esteDoc.rand + "' class='buttonEncAct minChat'>-</span>";
            }
            enc += "<span user='" + userName + "' self='" + self + "' class='userEtiqueted nameEncNwChat' us='" + esteDoc.rand + "'>" + userName + "</span>";
            enc += "</div>";
        }

        enc += "<span class='operator-foto-enc'></span>";
        enc += "<p class='line1'>";
        enc += "<strong>Asesor: </strong>";
        enc += "<span class='operator-enc'></span>";
        enc += "<span class='call-status'>Buscando...</span>";
        enc += "</p>";
        enc += "<p class='line2'>";
        var datau = "";
        if (evalueData(dataUser["celular"])) {
            datau = "Tus datos: " + dataUser["celular"];
        }
        enc += "<span class='number-conversation'></span> " + datau;
        enc += "</p>";
        enc += "<div self='.colsMenu_nwchat' class='colsMenu_nwchat colsMenu colsMenu_0' n='0' >";
        enc += "<div class='menuList' >";
        enc += "<span></span>";
        enc += "<span></span>";
        enc += "<span></span>";
        enc += "</div>";
        enc += "<div class='colsMenuInt colsMenuInt_0' >";
        enc += "<p class='btn-contextMenu contextMenuNwChat'  mode='finalizarChat' >Finalizar Chat</p>";
        enc += "</div>";
        enc += "</div>";
        $(selfEnc).html(enc);

        click(".colsMenu_nwchat", function () {
            addCss(self, ".colsMenuInt_0", {"display": "block"});
        });

        click(".contextMenuNwChat", function () {
            var type = $(this).attr("mode");
            if (type == "finalizarChat") {
                finalizarNwChat(self);
            }
            hiddenContextMenuEnc();
        });

        var convers = ".containerConvers_" + esteDoc.rand;
        createContainer(self, true, convers);
        $(convers).addClass("containerConvers");

        $(self).addClass("containNwChat2");
        createNwForms(self, fields, "nopopup");
        removeButtonsNwForm(self);
        setColumnsFormNumber(self, 2);

        $(self + " .uploader_adjunto").attr("self-div", self + " #nwform");

        var b = actionInColForm(self, "texto");
        b.on('keyup', function (e) {
            if (e.keyCode == 13) {
                var data = getRecordNwForm(self);
                esteDoc.sendMessageVisitor(self, data, convers);
                return false;
            }
        });
        $('#nwform').submit(function () {
            var data = getRecordNwForm(self);
            esteDoc.sendMessageVisitor(self, data, convers);
            return false;
        });
        if (isMobile()) {
            if (esteDoc.isKokwa === false) {
                click(".enc-close-chat", function () {
                    window.close();
                });
            }
        }
        if (esteDoc.isKokwa === false) {
            $(self + " .line2").remove();
            $(self + " .line1").remove();
            $(self + " .operator-foto-enc").remove();
            $(self + " .enc-div-chat").append("<div class='containOpCalls'><div class='videollamada' data-us='" + userName + "' >LLamar</div><div class='loadMore'>Cargar más</div></div>");

            $(self + " .loadMore").click(function () {
                esteDoc.paginateMore = true;
                startConsulta(self);
                setTimeout(function () {
                    esteDoc.paginateMore = false;
                }, 2000);
            });

        }
        if (isMobile()) {
            if (esteDoc.isKokwa === false) {
            }
        }
        addCss(self, "#nwform", {"max-width": "100%"});
        addClass(self, ".addHeaderNote", "container-center-conversations");
        addClass(self, "#nwform ", "container-box-bottom");
        addCss(self, ".contain_input_name_texto", {"width": "80%", "min-width": "80%", "max-width": "80%", "float": "left"});
        addCss(self, "#texto", {"height": "auto", "padding": "3px 0px", "margin": "0px"});
        addCss(self, ".contain_input_name_enviar", {"width": "20%", "min-width": "20%", "max-width": "20%", "float": "left"});
        addCss(self, ".contain_input_name_enviar p", {"display": "none"});
        addCss(self, ".contain_input_name_adjunto", {"width": "auto", "min-width": "auto", "max-width": "initial", "float": "left", "display": "block", "clear": "both"});
        addCss(self, ".contain_input_name_adjunto p", {"display": "none"});
        addCss(self, "#uploader_adjunto", {"width": "auto", "margin": "0 5px"});
        addCss(self, ".preViewFileUploader", {"width": "30px", "height": "30px"});
        addCss(self, ".divContainInputIntern", {"margin": "2px", "padding": "0px"});
        addCss(self, "#nwform", {"padding": "0px"});
        addCss(self, ".contain_input_name_emoji", {"width": "auto", "min-width": "auto", "max-width": "initial", "float": "left", "display": "block", "margin": "0px"});
        addCss(self, ".contain_input_name_emoji p", {"display": "none"});
        addCss(self, ".emoji", {"border": "0px", "background-color": "transparent", "background-image": "url(/nwlib6/css/emoji/emoji_btn.png)", "background-size": "contain", "background-repeat": "no-repeat", "background-position": "center", "font-size": "0px", "width": "25px"});
        addCss(self, ".contain_input_name_gif", {"width": "auto", "min-width": "auto", "max-width": "initial", "float": "left", "display": "block", "margin": "0px"});
        addCss(self, ".contain_input_name_gif p", {"display": "none"});
        addCss(self, ".gif", {"border": "0px", "background-color": "transparent", "background-image": "url(/nwlib6/css/emoji/gif_btn.png)", "background-size": "contain", "background-repeat": "no-repeat", "background-position": "center", "font-size": "0px", "width": "25px"});

        addCss(self, ".enviar", {"border": "0px", "background-color": "transparent", "background-image": "url(/nwlib6/css/emoji/emoji/ok.png)", "background-size": "contain", "background-repeat": "no-repeat", "background-position": "center", "font-size": "0px", "width": "30px", "height": "40px"});

        addCss(self, ".containerEncChat", {"top": "35px"}, "mobile");
        if (isMobile()) {
            $("body").append("<style>.containerConvers .addHeaderNote {padding-bottom: 150px!important;}</style>");
        }

        vista(self);

        $(window).resize(function () {
            vista(self);
        });

        var emoji = actionInColForm(self, "emoji");
        emoji.click(function () {
            $(self + " .containEmojis").remove();
            var html = "";
            html += "<div class='containEmojis containEmojisEm'>";
            html += "<span class='closeEmojis'>X</span>";
            html += getEmoji(":)", "smiley");
            html += getEmoji(":d", "smile");
            html += getEmoji(":o", "open_mouth");
            html += getEmoji(":p", "stuck_out_tongue");
            html += getEmoji(";)", "wink");
            html += getEmoji(":(", "disappointed");
            html += getEmoji("B-)", "sunglasses");
            html += getEmoji("cry", true);
            html += getEmoji("flushed", true);
            html += getEmoji("scream", true);
            html += getEmoji("sob", true);
            html += getEmoji("sleeping", true);
            html += getEmoji("sleepy", true);
            html += getEmoji("anguished", true);
            html += getEmoji("baby_chick", true);
            html += getEmoji("blush", true);
            html += getEmoji("bowtie", true);
            html += getEmoji("angry", true);
            html += getEmoji("cold_sweat", true);
            html += getEmoji("confounded", true);
            html += getEmoji("confused", true);
            html += getEmoji("dizzy_face", true);
            html += getEmoji("frowning", true);
            html += getEmoji("grin", true);
            html += getEmoji("grimacing", true);
            html += getEmoji("heart_eyes", true);
            html += getEmoji("imp", true);
            html += getEmoji("innocent", true);
            html += getEmoji("joy", true);
            html += getEmoji("kissing_closed_eyes", true);
            html += getEmoji("kissing_heart", true);
            html += getEmoji("mask", true);
            html += getEmoji("neutral_face", true);
            html += getEmoji("worried", true);
            html += getEmoji("persevere", true);
            html += getEmoji("rage", true);
            html += getEmoji("relaxed", true);
            html += getEmoji("stuck_out_tongue_winking_eye", true);
            html += getEmoji("sweat", true);
            html += getEmoji("sweat_smile", true);
            html += getEmoji("tired_face", true);
            html += getEmoji("triumph", true);
            html += getEmoji("unamused", true);
            html += getEmoji("yum", true);

            html += getEmoji("(y)", "--1");
            html += getEmoji("ok_hand", true);
            html += getEmoji("facepalmen", true);
            html += getEmoji("wave", true);
            html += getEmoji("v", true);
            html += getEmoji("thumbsdown", true);
            html += getEmoji("zap", true);
            html += getEmoji("snail", true);
            html += getEmoji("shaved_ice", true);
            html += getEmoji("older_man", true);
            html += getEmoji("art", true);
            html += getEmoji("bow", true);
            html += getEmoji("bulb", true);
            html += getEmoji("dancers", true);
            html += getEmoji("eyes", true);
            html += getEmoji("envelope", true);
            html += getEmoji("grey_question", true);
            html += getEmoji("heavy_check_mark", true);
            html += getEmoji("honeybee", true);
            html += getEmoji("japanese_goblin", true);
            html += getEmoji("umbrella", true);
            html += getEmoji("metal", true);
            html += getEmoji("monkey", true);
            html += getEmoji("monkey_face", true);
            html += getEmoji("moneybag", true);
            html += getEmoji("pray", true);
            html += getEmoji("ear", true);
            html += getEmoji("facepunch", true);
            html += getEmoji("first_quarter_moon_with_face", true);
            html += getEmoji("fries", true);
            html += getEmoji("clap", true);
            html += getEmoji("hear_no_evil", true);
            html += getEmoji("see_no_evil", true);
            html += getEmoji("zzz", true);

            html += "</div>";
            $(self).append(html);
        });
        var emojiGif = actionInColForm(self, "gif");
        emojiGif.click(function () {
            $(self + " .containEmojis").remove();
            var html = "";
            html += "<div class='containEmojis containEmojisGifs'>";
            html += "<span class='closeEmojis'>X</span>";
            html += getEmoji("smile", true, true);
            html += getEmoji("facepalm", true, true);
            html += getEmoji("tenor", true, true);
            html += getEmoji("homer_happy", true, true);
            html += getEmoji("according", true, true);
            html += getEmoji("nobody", true, true);
            html += getEmoji("jesusSuperStar", true, true);
            html += "</div>";
            $(self).append(html);
        });
        click(self + " .emojiSelect", function () {
            var data = getRecordNwForm(self);
            var ad = $(this).attr("data");
            setValue(self, "texto", " " + data.texto + " " + ad + " ");
            focusInput(self, "texto");
            $(self + " .containEmojis").remove();
        });
        click(self + " .closeEmojis", function () {
            $(self + " .containEmojis").remove();
        });

        var send = actionInColForm(self, "enviar");
        send.click(function () {
            var data = getRecordNwForm(self);
            esteDoc.sendMessageVisitor(self, data, convers);
        });
        var send = actionInColForm(self, "uploader_adjunto");
        send.change(function () {
            var data = getRecordNwForm(self);
            var ad = getValue(self, this);
            setValue(self, "texto", data.texto + " (Mensaje con Adjunto) ");
            focusInput(self, "texto");
        });

        removedLoadingNwChat();

        var focs = true;
        if (typeof focusChat != "undefined") {
            if (focusChat === false) {
                focs = false;
            }
        }
        if (focs) {
            focusInput(self, "texto");
        }
        if (loadData !== false) {
            activeBar(self);
            startConsulta(self);
        }
    }

    function activeBar(self) {
        var a = document.querySelectorAll(".enc-div-chat");
        for (var i = 0; i < a.length; i++) {
            a[i].style.backgroundColor = "#a5a5a5";
        }
        var s = document.querySelector(self + " .enc-div-chat");
        if (s)
            s.style.backgroundColor = "#0072ce";
    }

    function startConsulta(self) {
        var convers = ".containerConvers_" + esteDoc.rand;
        if (esteDoc.isKokwa === false) {
            var data = {};
            data.get = {user: esteDoc.userName};
            if (esteDoc.chatOperator === true) {
                data.id_call = esteDoc.rand;
                data.get.callingIntern = true;
            }
            if (typeof data.id_call !== "undefined" && typeof data.get.callingIntern !== "undefined" && typeof data.get.user === "number") {
                esteDoc.isGroup = true;
            }
            data.isGroup = esteDoc.isGroup;
            var rpc = {};
            rpc["service"] = "nwchat";
            rpc["method"] = "reviewEncCallIntern";
            rpc["data"] = data;
            var func = function (r) {
                if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) == 0) {
                    return;
                }
                var id = r.id;
                var id_session = r.id_session;
                var ns = ".container-conversations" + esteDoc.rand;
                var divFoc = ns + ' #texto';
                if (!esteDoc.isGroup) {
                    isInFocus(divFoc, function (e) {
                        if (e) {
                            loadAllMensajesNwChatByUser(id, self);
                        }
                    });
                    $(divFoc).keypress(function () {
                        var data = getRecordNwForm(self);
                        if (data.texto.length > 0) {
                            data.texto = "ESCRIBIENDO_NW";
                            console.log("Envía escritura...");
                            /*
                             esteDoc.sendMessageVisitor(self, data, convers, "ESCRIBE");
                             var rpc = {};
                             rpc["service"] = "nwchat";
                             rpc["method"] = "reviewEncCallIntern";
                             rpc["data"] = data;
                             var func = function (r) {
                             console.log(r);
                             };
                             rpcNw("rpcNw", rpc, func, true, convers);
                             */
                        }
                    });
                    $(divFoc).mouseup(function () {
                        isInFocus(divFoc, function (e) {
                            if (e) {
                                loadAllMensajesNwChatByUser(id, self);
                            }
                        });
                    });
                }

                $(convers).append("<input type='hidden' class='id_call' value='" + id + "' /><input type='hidden' class='id_session id_session_" + id + "' value='" + id_session + "' />");
                esteDoc.cargaMensajesAll(convers, false, id, true, false, function () {
                    var d = $(convers + " .chats_conversations");
                    var t = d.length;
                    if (t > 0) {
                        $(convers + " .chats_conversations").remove();
                        for (var i = 0; i < t; i++) {
                            var f = d[i];
                            $(convers).prepend(f);
                        }
                        vista(self);
                    }
                }, self);
            };
            rpcNw("rpcNw", rpc, func, true, convers);
        } else {
            /*chat externo ringow*/
            var data = {};
            data.id_sess = setDataSend();
            var rpc = {};
            rpc["service"] = "nwchat";
            rpc["method"] = "consultaVideoLlamada";
            rpc["data"] = data;
            var func = function (r) {
                if (r == false) {
                    esteDoc.reinitNwChat(function () {
                        window.location.reload();
                    });
                    return;
                }
                esteDoc.cargaMensajesAll(convers, false, false, false, false, false, self);
            };
            rpcNw("rpcNw", rpc, func, true);
        }
    }


    __initChatOut = false;
    __countChatOut = 0;
    function cargaMensajesAll(self, leido, idCall, async, divcall, callback, parent) {
        var time = 4000;
        var lanzaTime = true;
        if (timeoutIDNotifica[self] == false) {
            lanzaTime = false;
        }
        if (leido == false) {
            lanzaTime = true;
        }

        if (typeof get.videollamada == "undefined") {
            window.parent.postMessage("initConversation", '*');
        }
        clearInterval(timeoutIDNotifica[self]);
        cargaMensajesAllBucle(self, "SI", idCall, true, divcall, callback, parent);
        if (lanzaTime == true) {
            timeoutIDNotifica[self] = setInterval(function () {
                cargaMensajesAllBucle(self, "NO", idCall, true, false, callback, parent);
            }, time);
        }
    }
    function cargaMensajesAllBucle(self, leido, idCall, async, divcall, callback, parent) {
        var data = {};
        var up = getUserInfo();
        data.leido = leido;
        data.getEnc = get;
        data.get = {};
        if (esteDoc.userName != false) {
            data.get = {callingIntern: esteDoc.userName};
        }
        if (typeof idCall != "undefined") {
            if (idCall != false) {
                data["id_call"] = idCall;
            }
        }
        var focus = "NO";
        var ns = ".container-conversations" + esteDoc.rand;
        var divFoc = ns + ' #texto';

        isInFocus(divFoc, function (e) {
            if (e) {
                focus = "SI";
            } else {
                focus = "NO";
            }
        });

        var uu = self.replace(".containerConvers_", "");
        $(".globoRedNwChatList_" + uu).remove();
        $(self).find(".globoRedNwChat").remove();

        data.escribiendo = "NO";
        if (esteDoc.paginateMore !== false) {
            esteDoc.paginateLimit = esteDoc.paginateLimit + 20;
            data.paginateLimit = esteDoc.paginateLimit;
        }
        /*
         if (getValue(esteDoc.self, "texto").length > 0) {
         data.escribiendo = "SI";
         }
         */
        data.focus = focus;
        data.id_sess = setDataSend();
        data.isGroup = esteDoc.isGroup;
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "consultaChatAll";
        rpc["data"] = data;
        if (typeof data.id_sess !== "string") {
            data.id_sess = "";
        }
        if (esteDoc.chatOperator === true) {
            esteDoc.isGroup = false;
        }
        var func = function (ra) {
            if (typeof get.videollamada != "undefined") {
                if (typeof callback != "undefined") {
                    if (evalueData(callback)) {
                        var d = {};
                        d.esteDoc = esteDoc;
                        d.data = data;
                        d.idCall = idCall;
                        callback(ra, d);
                        return;
                    }
                }
            }

            __initChatOut = true;
            var scrolling = false;
            var MoveScroll = false;
            var r = [];
            var o = 0;
            var t = ra.length;
            for (var i = t; i >= 0; i = i - 1) {
                if (evalueData(ra[i])) {
                    var d = ra[i];
                    var dateFormat = calcularTiempoDosFechas(d.fecha);
                    d.fecha = dateFormat.dateInFormat;
                    $(".nwchatcf_" + d.id_msg).text(dateFormat.dateInFormat);

                    d.texto = replaceEmojis(d.texto);
                    if (d.usuario != up.usuario && d.leido == "1") {
                        MoveScroll = true;
                    }
                    $(".nwchatcbox_" + d.id_msg).remove();
                    r[o] = d;
                    o++;
                }
            }
            if (r.length == 0) {
                $(self + " .envia_msg").text("Leído");
                $(self + " .envia_msg").addClass("envia_msg_blue");
            } else {
                scrolling = true;

                if (scrolling === true) {
                    if (typeof esteDoc.userName == false) {
                        esteDoc.checkCallOnlineOperator(r);
                    } else {
                        $(self + " .line2").remove();
                    }
                    var html = esteDoc.createLinesConversation(r, leido);
                    addHeaderNote(self, html, "append");
                    if (leido == "SI") {
                        MoveScroll = true;
                    }
                    if (MoveScroll === true) {
                        scroll(parent);
                    }
                }
            }
            __countChatsByUser[self] = r.length;
        };
        rpcNw("rpcNw", rpc, func, async, self);
    }

    function finalizarNwChat() {
        var data = {};
        data.id_sess = setDataSend();
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "finalizarNwChat";
        rpc["data"] = data;
        var func = function (r) {
            if (r) {
                changeStatusEnc("Finalizado por cliente");
                reinitNwChat();
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }

    function reinitNwChat(callBack) {
        clearAlertNotifica();
        var data = {};
        data.id_sess = setDataSend();
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "reinitNwChat";
        rpc["data"] = data;
        var func = function (r) {
            if (r) {
                if (development === false) {
                    clearTimeout(timeoutIDNotifica[esteDoc.self]);
                    $(esteDoc.self + " .colsMenu_nwchat").remove();
                    $(esteDoc.self + " .container-box-bottom").empty();
                    $(esteDoc.self + " .container-box-bottom").prepend("<div class='volverahacerllamada' >Llamada finalizada. ¿Desea volver a realizar una llamada?</div>");
                    $(esteDoc.self + " .volverahacerllamada").click(function () {
                        window.location.reload();
                    });
                    if (typeof callBack != "undefined") {
                        if (evalueData(callBack)) {
                            callBack();
                        }
                    }
                }
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }

    function replaceEmojis(texto) {
        texto = texto.replace(/:\)/g, getEmoji(":)", "smiley"));
        texto = texto.replace(/:-\)/g, getEmoji(":)", "smiley"));
        texto = replaceEmoji(":d", texto, "smile", false);
        texto = replaceEmoji(":D", texto, "smile", false);
        texto = replaceEmoji(":-D", texto, "smile", false);
        texto = replaceEmoji(":o", texto, "open_mouth", false);
        texto = replaceEmoji(":-O", texto, "open_mouth", false);
        texto = replaceEmoji(":p", texto, "stuck_out_tongue", false);
        texto = replaceEmoji(":P", texto, "stuck_out_tongue", false);
        texto = replaceEmoji(":-P", texto, "stuck_out_tongue", false);
        texto = texto.replace(/;\)/g, getEmoji(";)", "wink"));
        texto = texto.replace(/;-\)/g, getEmoji(";)", "wink"));
        texto = texto.replace(/:\(/g, getEmoji(":(", "disappointed"));
        texto = texto.replace(/:-\(/g, getEmoji(":(", "disappointed"));
        texto = texto.replace(/B-\)/g, getEmoji("B-)", "sunglasses"));
        texto = texto.replace(/\(cry\)/g, getEmoji("cry", true, false, true));
        texto = texto.replace(/\(flushed\)/g, getEmoji("flushed", true, false, true));
        texto = texto.replace(/\(scream\)/g, getEmoji("scream", true, false, true));
        texto = texto.replace(/\(sob\)/g, getEmoji("sob", true, false, true));
        texto = texto.replace(/\(sleeping\)/g, getEmoji("sleeping", true, false, true));
        texto = texto.replace(/\(sleepy\)/g, getEmoji("sleepy", true, false, true));
        texto = texto.replace(/\(anguished\)/g, getEmoji("anguished", true, false, true));
        texto = texto.replace(/\(baby_chick\)/g, getEmoji("baby_chick", true, false, true));
        texto = texto.replace(/\(blush\)/g, getEmoji("blush", true, false, true));
        texto = texto.replace(/\(bowtie\)/g, getEmoji("bowtie", true, false, true));
        texto = texto.replace(/\(angry\)/g, getEmoji("angry", true, false, true));
        texto = texto.replace(/\(cold_sweat\)/g, getEmoji("cold_sweat", true, false, true));
        texto = texto.replace(/\(confounded\)/g, getEmoji("confounded", true, false, true));
        texto = texto.replace(/\(confused\)/g, getEmoji("confused", true, false, true));
        texto = texto.replace(/\(dizzy_face\)/g, getEmoji("dizzy_face", true, false, true));
        texto = texto.replace(/\(frowning\)/g, getEmoji("frowning", true, false, true));
        texto = texto.replace(/\(grin\)/g, getEmoji("grin", true, false, true));
        texto = texto.replace(/\(grimacing\)/g, getEmoji("grimacing", true, false, true));
        texto = texto.replace(/\(heart_eyes\)/g, getEmoji("heart_eyes", true, false, true));
        texto = texto.replace(/\(imp\)/g, getEmoji("imp", true, false, true));
        texto = texto.replace(/\(innocent\)/g, getEmoji("innocent", true, false, true));
        texto = texto.replace(/\(joy\)/g, getEmoji("joy", true, false, true));
        texto = texto.replace(/\(kissing_closed_eyes\)/g, getEmoji("kissing_closed_eyes", true, false, true));
        texto = texto.replace(/\(kissing_heart\)/g, getEmoji("kissing_heart", true, false, true));
        texto = texto.replace(/\(mask\)/g, getEmoji("mask", true, false, true));
        texto = texto.replace(/\(neutral_face\)/g, getEmoji("neutral_face", true, false, true));
        texto = texto.replace(/\(worried\)/g, getEmoji("worried", true, false, true));
        texto = texto.replace(/\(persevere\)/g, getEmoji("persevere", true, false, true));
        texto = texto.replace(/\(rage\)/g, getEmoji("rage", true, false, true));
        texto = texto.replace(/\(relaxed\)/g, getEmoji("relaxed", true, false, true));
        texto = texto.replace(/\(stuck_out_tongue_winking_eye\)/g, getEmoji("stuck_out_tongue_winking_eye", true, false, true));
        texto = texto.replace(/\(sweat\)/g, getEmoji("sweat", true, false, true));
        texto = texto.replace(/\(sweat_smile\)/g, getEmoji("sweat_smile", true, false, true));
        texto = texto.replace(/\(tired_face\)/g, getEmoji("tired_face", true, false, true));
        texto = texto.replace(/\(triumph\)/g, getEmoji("triumph", true, false, true));
        texto = texto.replace(/\(unamused\)/g, getEmoji("unamused", true, false, true));
        texto = texto.replace(/\(yum\)/g, getEmoji("yum", true, false, true));
        texto = texto.replace(/\(y\)/g, getEmoji("(y)", "--1", false, true));
        texto = texto.replace(/\(facepalmen\)/g, getEmoji("facepalmen", true, false, true));
        texto = texto.replace(/\(ok_hand\)/g, getEmoji("ok_hand", true, false, true));
        texto = texto.replace(/\(wave\)/g, getEmoji("wave", true, false, true));
        texto = texto.replace(/\(v\)/g, getEmoji("v", true, false, true));
        texto = texto.replace(/\(thumbsdown\)/g, getEmoji("thumbsdown", true, false, true));
        texto = texto.replace(/\(zap\)/g, getEmoji("zap", true, false, true));
        texto = texto.replace(/\(snail\)/g, getEmoji("snail", true, false, true));
        texto = texto.replace(/\(shaved_ice\)/g, getEmoji("shaved_ice", true, false, true));
        texto = texto.replace(/\(older_man\)/g, getEmoji("older_man", true, false, true));
        texto = texto.replace(/\(art\)/g, getEmoji("art", true, false, true));
        texto = texto.replace(/\(bow\)/g, getEmoji("bow", true, false, true));
        texto = texto.replace(/\(bulb\)/g, getEmoji("bulb", true, false, true));
        texto = texto.replace(/\(dancers\)/g, getEmoji("dancers", true, false, true));
        texto = texto.replace(/\(eyes\)/g, getEmoji("eyes", true, false, true));
        texto = texto.replace(/\(envelope\)/g, getEmoji("envelope", true, false, true));
        texto = texto.replace(/\(grey_question\)/g, getEmoji("grey_question", true, false, true));
        texto = texto.replace(/\(heavy_check_mark\)/g, getEmoji("heavy_check_mark", true, false, true));
        texto = texto.replace(/\(honeybee\)/g, getEmoji("honeybee", true, false, true));
        texto = texto.replace(/\(japanese_goblin\)/g, getEmoji("japanese_goblin", true, false, true));
        texto = texto.replace(/\(umbrella\)/g, getEmoji("umbrella", true, false, true));
        texto = texto.replace(/\(metal\)/g, getEmoji("metal", true, false, true));
        texto = texto.replace(/\(monkey\)/g, getEmoji("monkey", true, false, true));
        texto = texto.replace(/\(monkey_face\)/g, getEmoji("monkey_face", true, false, true));
        texto = texto.replace(/\(moneybag\)/g, getEmoji("moneybag", true, false, true));
        texto = texto.replace(/\(pray\)/g, getEmoji("pray", true, false, true));
        texto = texto.replace(/\(ear\)/g, getEmoji("ear", true, false, true));
        texto = texto.replace(/\(facepunch\)/g, getEmoji("facepunch", true, false, true));
        texto = texto.replace(/\(first_quarter_moon_with_face\)/g, getEmoji("first_quarter_moon_with_face", true, false, true));
        texto = texto.replace(/\(fries\)/g, getEmoji("fries", true, false, true));
        texto = texto.replace(/\(clap\)/g, getEmoji("clap", true, false, true));
        texto = texto.replace(/\(hear_no_evil\)/g, getEmoji("hear_no_evil", true, false, true));
        texto = texto.replace(/\(see_no_evil\)/g, getEmoji("see_no_evil", true, false, true));
        texto = texto.replace(/\(zzz\)/g, getEmoji("zzz", true, false, true));

        texto = texto.replace(/\(smile\)/g, getEmoji("smile", true, true, true));
        texto = texto.replace(/\(facepalm\)/g, getEmoji("facepalm", true, true, true));
        texto = texto.replace(/\(tenor\)/g, getEmoji("tenor", true, true, true));
        texto = texto.replace(/\(homer_happy\)/g, getEmoji("homer_happy", true, true, true));
        texto = texto.replace(/\(according\)/g, getEmoji("according", true, true, true));
        texto = texto.replace(/\(nobody\)/g, getEmoji("nobody", true, true, true));
        texto = texto.replace(/\(jesusSuperStar\)/g, getEmoji("jesusSuperStar", true, true, true));
        return texto;
    }
    function replaceEmoji(name, texto, par, gif) {
        var r = name;
        if (par === true) {
            r = "\(" + name + "\)";
        }
        return str_replace(r, getEmoji(name, par, gif, true), texto);
    }
    function getEmoji(name, img, gif, lectura) {
        if (img == true) {
            img = name;
            name = "(" + name + ")";
        }
        var g = "";
        if (gif === true) {
            g = " emIfGif";
            img = img + "-gif"
        }
        var data = "data='" + name + "'";
        var s = "emojiSelect";
        if (lectura === true) {
            s = "";
            data = "";
        }
        return "<span class='" + s + " em em-some-emoji em-" + img + " " + g + "' " + data + "></span>";
    }

    function sendMessageVisitor(self, data, convers, escribe) {
        if (!evalueData(escribe)) {
            if (!validateRequired(self)) {
                return false;
            }
        }
        if (document.querySelector(self + " .contain_input_name_adjunto .newLoadingNw")) {
            nw_dialog("Se está cargando un archivo, espere por favor");
            return;
        }
        data["getEnc"] = get;
        $(self).find(".globoRedNwChat").remove();
        var uu = self.replace(".containerConvers_", "");
        $(".globoRedNwChatList_" + uu).remove();
        if (esteDoc.userName != false) {
            data["get"] = {};
            data.get.user = esteDoc.userName;
            data.get.callingIntern = esteDoc.userName;
        }
        if (esteDoc.isKokwa === false) {
            data["id_call"] = $(convers + " .id_call").val();
            data["id_session"] = $(convers + " .id_session").val();
        }
        var num = Math.floor((Math.random() * 10000) + 1);
        var ra = Array();
        ra["id_msg"] = num;
        ra["msg_temp"] = true;
        ra["fecha"] = getDateHour();
        if (esteDoc.userName != false) {
            ra["usuario_con_quien_chatea"] = esteDoc.userName;
        }
        if (esteDoc.userName != false) {
            var up = getUserInfo();
            ra["tipo_user"] = "visitante";
            ra["foto_usuario"] = up["foto_perfil"];
            ra["nombre_operador"] = "Yo";
        } else {
            ra["tipo_user"] = "visitante";
            ra["foto_usuario"] = "visitante";
            ra["nombre_operador"] = "visitante";
        }

        if (data.adjunto != "") {
            var url = location.protocol + "//" + location.host + "/" + data.adjunto;
            data.texto += " " + url + " ";
        }

        ra["texto"] = data["texto"];
        ra["num_envio"] = num;
        data["fecha"] = ra["fecha"];
        data["num_envio"] = num;
        ra["texto"] = replaceEmojis(ra["texto"]);
        if (!evalueData(escribe)) {
            var html = esteDoc.lineByLineConversation(ra);
            /*
             $(convers).append(html);
             */
            addHeaderNote(self, html, "append");
            scroll(self);
            resetForm(self);
        }
        if (esteDoc.chatOperator === true) {
            data["id_call"] = esteDoc.rand;
            data["inGroup"] = true;
            data["get"] = {callingIntern: true};
        }
        data.id_sess = setDataSend();
        data.isGroup = esteDoc.isGroup;
        var op = $(".userOperator").text();
        if (typeof op !== "undefined") {
            if (evalueData(op)) {
                data.operatorUser = op;
            }
        }

        console.log(data);
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "sendMessageVisitor";
        rpc["data"] = data;
        var func = function (r) {
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            if (!evalueData(escribe)) {
                $(".envia_msg_" + num).text("Recibido");
                $(".envia_msg_" + num).addClass("envia_msg_green");
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }



    function createLinesConversation(ra, leido) {
        var get = getGET();
        var total = ra.length;
        var rta = "";
        if (total == undefined) {
            rta += esteDoc.lineByLineConversation(ra);
        } else {
            for (var i = 0; i < total; i++) {
                var r = ra[i];
                if (typeof get["user"] != "undefined") {
                    r["usuario_con_quien_chatea"] = get["user"];
                }
                if (leido === false) {
                    r["loadAllMessages"] = true;
                }

                if (typeof r.tipo_user !== "undefined" && typeof esteDoc.idInSound[r.id_msg] === "undefined") {
                    /* USUARIO EXTERNO VISITANTE */
                    if (r.tipo_user != "visitante" && typeof esteDoc.up.load_nwmaker === "undefined") {
                        soundUser();
                    } else
                    /* USUARIO INTERNO OPERADOR O USUARIO NORMAL*/
                    if (typeof esteDoc.up.load_nwmaker !== "undefined" && r.usuario !== esteDoc.up.usuario && c !== false) {
                        if (c.alias === "ringow") {
                            soundUser();
                        }
                    }
                }
                esteDoc.idInSound[r.id_msg] = r.id_msg;

                rta += esteDoc.lineByLineConversation(r);
                var op = false;
                var opName = false;
                if (r.tipo_user === "userInterNw") {
                    op = r.usuario;
                    opName = r.nombre_operador;
                }
                changeStatusEnc(r.status, op, opName);
                if (r["status"] == "FINALIZADO") {
                    console.log("803");
                    esteDoc.reinitNwChat();
                }
            }
        }
        return rta;
    }
    function lineByLineConversation(r) {
        var classf = " nwchatcf_" + r.id_msg;
        var classleido = " nwchatclei_" + r.id_msg;
        var classbox = " nwchatcbox_" + r.id_msg;
        var up = getUserInfo();
        if (typeof up["usuario"] != "undefined" && typeof r["usuario"] != "undefined") {
            if (r["usuario"] == up["usuario"]) {
                r["tipo_user"] = "visitante";
                r["nombre_operador"] = "Yo";
                r["foto_usuario"] = up["foto_perfil"];
            } else {
                r["tipo_user"] = "elotro";
            }
        }
        if (evalueData(r["usuario_con_quien_chatea"])) {
            if (r["usuario"] != r["usuario_con_quien_chatea"]) {
                r["tipo_user"] = "visitante";
            }
        }
        if (typeof r["leido"] == undefined) {
            r["leido"] = "0";
        }
        var sending = "";
        var msg_temp = "";

        if (r["usuario"] == r["usuario_con_quien_chatea"]) {
            sending = "Leído";
            colorLeido = "blue";
        } else {
            sending = "Enviando...";
            var colorLeido = "gray";
            if (r["leido"] == "2") {
                sending = "Leído";
                colorLeido = "blue";
            } else
            if (r["leido"] == "1") {
                sending = "Recibido";
                colorLeido = "green";
            }
            if (evalueData(r["num_envio"])) {
                $(".chats_conversation_id" + r["num_envio"]).remove();
            }
        }
        var rta = "";
        var hoy = getFechaHoy();
        if (typeof r["fecha"] != "undefined") {
            var fecha_split = r["fecha"].split(" ");
            if (fecha_split[0] == hoy) {
                r["fecha"] = fecha_split[1];
            }
        } else {
            r["fecha"] = hoy;
        }
        var foto = "";
        if (evalueData(r["foto_usuario"])) {
            if (r["foto_usuario"] != "visitante") {
                foto = "style='background-image: url(/nwlib6/includes/phpthumb/phpThumb.php?src=" + r["foto_usuario"] + "&w=40&f=jpg);'";
            }
        }
        r.texto = r.texto.replace("__automensaje__", "");
        rta += "<div class='chats_conversations chats_conversation_id" + r["num_envio"] + " chat_" + r["tipo_user"] + "" + msg_temp + " " + classbox + "'>";
        rta += "<div class='photo photo_" + r["tipo_user"] + "' " + foto + " ></div>";
        rta += "<div class='message_all message_visit" + r["tipo_user"] + "'>";
        rta += "<div class='message_only message_only_" + r["tipo_user"] + "'>";
        rta += "<p class='usuario'><span>" + r["nombre_operador"] + ":</span></p>";
        rta += "<p class='mensaje'>" + r.texto + "</p>";
        rta += "</div>";
        if (evalueData(r["dispositivo"])) {
            rta += "<p class='dispositivo_conversation'>" + r["dispositivo"] + "</p>";
        }
        rta += "<p class='fecha_conversation fecha_conversation_" + r["tipo_user"] + " " + classf + "'>" + r["fecha"] + "</p>";
        rta += "<p class='envia_msg envia_msg_" + colorLeido + " envia_msg_" + r["tipo_user"] + " envia_msg_" + r["id_msg"] + " " + classleido + "'>" + sending + "</p>";
        rta += "</div>";
        rta += "</div>";

        if (typeof r["loadAllMessages"] == "undefined") {
            if (r["usuario"] == r["usuario_con_quien_chatea"]) {
                if (development === false) {
                    soundOperator();
                }
            }
        }

        if (r.texto === " <strong>¡Gracias por escribirnos!</strong>, estaremos en contacto muy pronto.") {
            reinitNwChat();
        }

        return rta;
    }
    function checkCallOnlineOperator(ra) {
        if (!esteDoc.chatInit) {
            var config = thisDoc.getConfigNwChat;
            var total = ra.length;
            for (var i = 0; i < total; i++) {
                var r = ra[i];
                changeEncConversation({nombre_operador: "Esperando conexión...", visitante: r["visitante"], foto_usuario: config["foto_autorespondedor"]});
                if (i + 1 == total) {
                    if (r["status"] == "INICIADO" || r["status"] == "HABLANDO_OP") {
                        esteDoc.chatInit = true;
                        changeEncConversation(r);
                        break;
                    }
                }
            }
        }
    }
}

function loadAllMensajesNwChatByUser(r, self) {
    $(self).find(".globoRedNwChat").remove();
    var uu = self.replace(".containerConvers_", "");
    $(".globoRedNwChatList_" + uu).remove();
    var data = {};
    data["id_call"] = r;
    var rpc = {};
    rpc["service"] = "nwchat";
    rpc["method"] = "leeMensajes";
    rpc["data"] = data;
    var funcd = function (rr) {
        if (verifyErrorNwMaker(rr) === false) {
            return;
        }
    };
    rpcNw("rpcNw", rpc, funcd);
}