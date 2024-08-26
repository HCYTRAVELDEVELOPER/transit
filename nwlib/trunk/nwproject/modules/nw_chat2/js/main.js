var __configNwChat = {};
var __userDataNwChat = {};
var __arrancaChat = false;
var __totalMsg = false;
var timeoutIDNotifica;
var intervalSound;

function clearAlertNotifica() {
    window.clearTimeout(timeoutIDNotifica);
}

$(document).ready(function () {
    activeButtonsNwMaker();
    if (isMobile()) {
        $(".container-mensaje-disconected").css({"margin-top": "40px"});
    }
    $(".inputdatanwform").css({"max-width": "95%"});
    (function () {
        $('body').delegate('.finalizarCh', 'click', function () {
            finalizarNwChat();
        });
    })();
    (function () {
        $('body').delegate('.btn-contextMenu', 'click', function () {
            var type = $(this).attr("mode");
            if (type == "finalizarChat") {
                finalizarNwChat();
            }
            hiddenContextMenuEnc();
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
});
function removedLoadingNwChat() {
    $(".loadingNwChat").remove();
}
function hiddenContextMenuEnc() {
    $(".colsMenuInt").fadeOut(0);
}
function initAll() {
    getConfigurationNwChat();
}

function setuserDataNwChat(df) {
    __userDataNwChat = df;
}
function getUserDataNwChat() {
    var up = __userDataNwChat;
    up["correo"] = up["email"];
    return up;
}

function setConfigNwChat(df) {
    __configNwChat = df;
}
function getConfigNwChat() {
    return __configNwChat;
}

function getConfigurationNwChat() {
    var get = getGET();
    var rpc = {};
    rpc["service"] = "nwchat";
    rpc["method"] = "initConfig";
    rpc["data"] = {GET: get};
    var func = function (r) {
        if (!verifyErrorNwMaker(r) || verifyErrorNwMaker(r) == 0) {
            return;
        }
        if (r == "0") {
            nw_dialog("No hay configuración de nwchat. Consulte con el administrador del sistema.");
        } else
        if (r) {
            setConfigNwChat(r["config"]);
            setuserDataNwChat(r["data_user"]);
            addCssOculto();
            var testing = false;
            if (typeof get["testing"] != "undefined") {
                testing = true;
            }
            if (typeof get["callingIntern"] != "undefined") {
                createNwChatConversation();
            } else
            if (testing) {
                createLoginChat();
            } else {
                if (!r["operadores_conectados"]) {
                    createWindowMessageDisconect();
                } else
                if (typeof videoCallNwChat != "undefined" && videoCallNwChat === true) {
                    createLoginChat();
                } else
                if (r["data_user"]["init_call_user"]) {
                    createNwChatConversation();
                } else {
                    createLoginChat();
                }
            }
        } else {
            nw_dialog("A ocurrido un error: " + r);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function createWindowMessageDisconect() {
    var up = getUserDataNwChat();
    var config = getConfigNwChat();
    var self = generateSelf(".container-mensaje-disconected");
    var fields = [
        {
            tipo: 'textField',
            nombre: 'Nombre',
            name: 'nombre',
            requerido: "SI"
        },
        {
            tipo: 'textField',
            nombre: 'Correo',
            name: 'correo',
            requerido: "SI"
        },
        {
            tipo: 'textField',
            mode: 'integer',
            nombre: 'Celular',
            name: 'celular',
            requerido: "SI"
        },
        {
            tipo: 'textArea',
            nombre: 'Mensaje',
            name: 'mensaje',
            requerido: "SI"
        }
    ];
    createNwForms(self, fields);

    setRecord(self, up);

    setColumnsFormNumber(self, 1);

    noSubmitForm(self);

    addHeaderNote(self, "<h3>Lo sentimos, no estamos disponibles.</h3><p>Déjanos tu mensaje.</p>");

    var accept = addButtonNwForm("Enviar", self);
    accept.click(function () {
        if (!validateRequired(self)) {
            return false;
        }
        var data = getRecordNwForm(self);
        data["terminal"] = config["terminal"];
        var rpc = {};
        rpc["service"] = "nwchat";
        rpc["method"] = "sendMessageDisconected";
        rpc["data"] = data;
        var func = function (r) {
            if (r) {
                nw_dialog("Hemos recibido tu mensaje, gracias por escribirnos.");
                resetForm(self);
            } else {
                nw_dialog("A ocurrido un error: " + r);
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    });
    removeLoadingNw();
    removedLoadingNwChat();
}


function addCssOculto() {
    var self = "#container-css-oculto";
    var fields = [];
    createNwForms(self, fields);
    var config = getConfigNwChat();
    var html = "";
    if (evalueData(config)) {
        html += config["codigo_oculto"];
    }
    addHeaderNote(self, html);
    removeButtonsNwForm(self);
}

function createLoginChat() {
    var config = getConfigNwChat();
    var up = getUserDataNwChat();

    var self = generateSelf("#container-all");
    var fields = [];

    if (config["registro_usar_nombre"] != "NO") {
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Nombre',
                    name: 'nombre',
                    requerido: "SI"
                };
        fields.push(columnas);
    }
    if (config["registro_usar_email"] != "NO") {
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Correo',
                    name: 'correo',
                    requerido: "SI"
                };
        fields.push(columnas);
    }
    if (config["registro_usar_celular"] != "NO") {
        var columnas =
                {
                    tipo: 'textField',
                    mode: 'integer',
                    nombre: 'Celular',
                    name: 'celular',
                    car_min: '10',
                    car_max: '10',
                    requerido: "SI"
                };
        fields.push(columnas);
    }

    createNwForms(self, fields);

    setColumnsFormNumber(self, 1);

    setRecord(self, up);

    $('#nwform').submit(function () {
        return false;
    });

    var html = "";
    html += "<div class='enc_log'>";
    if (evalueData(config["banner"])) {
        html += "<div class='img_log_enc' style='background-image: url(" + config["banner"] + ");'></div>";
    }
    html += config["texto_bienvenida"];
    html += "</div>";

    html += "<div class='texto_registro' id='pasa_form'>";
    html += config["texto_registro"];
    html += "</div>";
    addHeaderNote(self, html);

    addCss(self, ".divContainInputIntern", {"margin": "0px", "padding": "0px 5px"});

    var celular = actionInColForm(self, "celular");
    celular.keypress(function (e) {
        if (e.which == 13) {
            initChatWindow1(self, config);
            return false;
        }
    });

    var accept = addButtonNwForm("Iniciar", self);
    accept.click(function () {
        initChatWindow1(self, config);
    });
    removedLoadingNwChat();
}

function initChatWindow1(self, config) {

    if (!validateRequired(self)) {
        return false;
    }
    var data = getRecordNwForm(self);
    data["tipo"] = "chat";
    if (typeof videoCallNwChat != "undefined") {
        if (videoCallNwChat === true) {
            data["tipo"] = "videollamada";
        }
    }
    var rpc = {};
    rpc["service"] = "nwchat";
    rpc["method"] = "saveUserVisitante";
    rpc["data"] = data;
    var func = function (r) {
        if (r) {
            empty(self);
            if (config["requiere_redireccion_a_seccion"] == "SI") {
                createSecciones();
            } else {
                createNwChatConversation();
            }
        } else {
            nw_dialog("A ocurrido un error: " + r);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function createSecciones() {
    var self = generateSelf("#container-all");
    var get = getGET();
    var columns = [
        {
            label: "ID",
            caption: "id",
            visible: false
        },
        {
            label: "Imagen",
            caption: "imagen",
            type: "image",
            mode: "phpthumb",
            clickable: false
        },
        {
            label: "Nombre Sección",
            caption: "nombre"
        },
        {
            label: "Redirecciona al chat",
            caption: "redirecciona_al_chat",
            visible: false
        },
        {
            label: "Muestra Info",
            caption: "redirecciona_al_mostrar_info",
            visible: false
        }
    ];
    createList(columns, self);

    applyFilters(self, "nwchat", "queryProfiles", false);

    showRowInMobile(self, "nombre");

    listBloqs(self);

    removeColorsRows(self);

    listScroll(self, false);

    var html = "<h2 class='subtitles'>Selecciona una opción</h2><p>Selecciona el servicio que necesites, para que nuestro equipo te colabore.</p>";
    addHeaderNoteList(html, self);
    $(".menuList").remove();

    var options = {};
    options["margin"] = "10px";
    options["width"] = "100px";
    options["height"] = "150px";
    options["max-height"] = "150px";
    options["padding"] = "10px";
    options["text-align"] = "center";
    listAddCss(self, options);

    listAddCssFor(self, ".colsMobil", {"cursor": "pointer"});
    listAddCssFor(self, ".colsMobil p", {"padding": "0px", "margin": "0px", "text-align": "center"});
    listAddCssFor(self, "2", {"font-size": "10px"});
    listAddCssFor(self, ".namedColMob", {"display": "none"});
    listAddCssFor(self, ".imageListNwMaker2", {"background-position": "center"});
    listAddCssFor(self, ".childrenValuesList", {"text-align": "center"});

    vistaSecciones();

    onChangeWindow("vistaSecciones");

    var row = actionInRow(self);

    row.click(function () {

        loadingNw();

        var data = getSelectedRecord(self);
        data["tipo"] = "chat";
        if (typeof videoCallNwChat != "undefined") {
            if (videoCallNwChat === true) {
                data["tipo"] = "videollamada";
            }
            if (typeof showVideoCallNwChat != "undefined") {
                if (showVideoCallNwChat == false) {
                    data["tipo"] = "llamada";
                }
            }
        }
        if (data["redirecciona_al_chat"] == "SI") {
            var async = true;
            if (typeof videoCallNwChat != "undefined") {
                if (videoCallNwChat === true) {
                    async = false;
                }
            }
            data.get = get;
            var rpc = {};
            rpc["service"] = "nwchat";
            rpc["method"] = "initAllCallInitialVisitor";
            rpc["data"] = data;
            var func = function (r) {
                console.log(r);
                if (r == "salanodisponible") {
                    nw_dialog("Lo sentimos, no hay nadie disponible en esta sala");
                } else
                if (r) {
                    if (typeof videoCallNwChat != "undefined") {
                        if (videoCallNwChat === true) {
                            document.getElementById('soundIntroCalling').play();
                            intervalSound = setInterval(function () {
                                timbraBucleNwChat();
                            }, 3000);
                        }
                    }

                    reject(self);
                    createNwChatConversation();
                } else {
                    nw_dialog("A ocurrido un error: " + r);
                }
                removeLoadingNw("fast");
            };
            rpcNw("rpcNw", rpc, func, async);
        } else
        if (data["redirecciona_al_mostrar_info"] == "SI") {
            var rpc = {};
            rpc["service"] = "nwchat";
            rpc["method"] = "getInfoBySeccionShow";
            rpc["data"] = data;
            var func = function (r) {
                if (r) {
                    var html = "<div class='showInfoBySeccionInWindow'><div class='closeWindowParentNwMaker closeInfoWindowSeccion'></div>" + r["texto_redireccion_info"] + "</div>";
                    addHeaderNoteList(html, self);
                    if (isMobile()) {
                        $(".closeWindowParentNwMaker").css({"top": "27px", "right": "3px", "width": "25px", "height": "25px", "line-height": "25px"});
                    }
                } else {
                    nw_dialog("A ocurrido un error: " + r);
                }
                removeLoadingNw("fast");
            };
            rpcNw("rpcNw", rpc, func, true);
        } else {
            nw_dialog("Ha ocurrido algo inesperado. Consulte con su administrador del sistema.");
        }
    });

}

function initVideoCallNwC(user) {
    var video = "";
    if (typeof showVideoCallNwChat != "undefined") {
        if (showVideoCallNwChat == false) {
            video = "&video=false";
        }
    }
    window.location = "/nwlib6/nwproject/modules/webrtc/index.php?usuario=" + user + "&answer=true" + video;
}

function createNwChatConversation() {
    var get = getGET();
    var self = createDocument("#container-all");
    var self = createDocument("#container-conversations");
    var dataUser = getUserDataNwChat();
    var fields = [
        {
            tipo: 'textArea',
            nombre: 'Mensaje',
            name: 'texto',
            requerido: "SI"
//            ,
//            autocomplete: false
        },
        {
            tipo: 'button',
            label: 'Enviar',
            nombre: 'Enviar',
            name: 'enviar'
        }
    ];

//    if (typeof videoCallNwChat != "undefined") {
//        if (videoCallNwChat === true) {
//            document.getElementById('soundIntroCalling').play();
//            addCss(self, "#nwform", {"display": "none"});
//            $(".chats_conversations").append("<div class='conectadoCall'>Conectando... Por favor espere. <div class='finalizarCh'><span>Finalizar</span></div> </div>");
//        }
//    }

    //verifica si es chat interno para hacer el insert o update de la llamada
    if (typeof get["callingIntern"] != "undefined") {
        addHeaderNote(self, "<div style='display: none;'><input type='text' class='id_call' /></div>", "before");
        reviewEncCallIntern(self);
    } else {
        cargaMensajesAll(self, false, false, false);
    }

    createNwForms(self, fields);

    if (typeof videoCallNwChat != "undefined") {
        if (videoCallNwChat === true) {
            document.getElementById('soundIntroCalling').play();
            addCss(self, "#nwform", {"display": "none"});
//            $(".container-center-conversations").append("<div class='conectadoCall'>Conectando... Por favor espere. <div class='finalizarCh'><span>Finalizar</span></div> </div>");
            $("#container-nwchat2").append("<div class='conectadoCall'>Conectando... Por favor espere. <div class='finalizarCh'><span>Finalizar</span></div> </div>");
        }
    }

    removeButtonsNwForm(self);

    setColumnsFormNumber(self, 2);

    var b = actionInColForm(self, "texto");
    b.on('keyup', function (e) {
        if (e.keyCode == 13) {
            var data = getRecordNwForm(self);
            sendMessageVisitor(self, data);
            return false;
        }
    });
    $('#nwform').submit(function () {
        var data = getRecordNwForm(self);
        sendMessageVisitor(self, data);
        return false;
    });

    var enc = "";
    enc += "<div class='bar-enc-conversation'>";
    if (isMobile()) {
        if (typeof get["callingIntern"] != "undefined") {
            enc += "<div class='enc-close-chat'>Cerrar</div><style>.menuList span{background: #fff;}</style>";
        }
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

    //contextmenú
    enc += "<div self='.colsMenu_nwchat' class='colsMenu_nwchat colsMenu colsMenu_0' n='0' >";

    enc += "<div class='menuList' >";
    enc += "<span></span>";
    enc += "<span></span>";
    enc += "<span></span>";
    enc += "</div>";

    enc += "<div class='colsMenuInt colsMenuInt_0' >";
//    enc += "<p class='btn-contextMenu'  mode='editarDatosUser' >Mis Datos</p>";
//    enc += "<p class='btn-contextMenu'  mode='adjuntarUser' >Enviar Adjunto</p>";
    enc += "<p class='btn-contextMenu'  mode='finalizarChat' >Finalizar Chat</p>";
    enc += "</div>";

    enc += "</div>";

//fin menú
//    enc += "</div><style>#nwform input[type='button']{font-size: 12px!important;background-color: rgb(67, 185, 201);border: 1px solid rgb(59, 169, 184);}</style>";

    addHeaderNote(self, enc, "before");

    if (isMobile()) {
        if (typeof get["callingIntern"] != "undefined") {
            click(".enc-close-chat", function () {
                window.close();
            });
        }
    }

    //verifica si es chat interno para hacer el insert o update de la llamada
    if (typeof get["callingIntern"] != "undefined") {
        $(".line2").remove();
        $(".operator-foto-enc").remove();
        var domain = document.domain;
        $(".line1").html(get["nameUser"] + ". <div class='videollamada'>Iniciar Videollamada</a>");
        $(".videollamada").click(function () {
            var url = location.protocol + "//" + domain + "/nwlib6/nwproject/modules/webrtc/index.php?usuario=" + get["user"] + "&calling=true";
            window.open(url, "Nw WebRtc", "width=600,height=600");
        });
    }


    if (typeof videoCallNwChat != "undefined") {
        if (videoCallNwChat === true) {
            $(".message_only_autocontestador").fadeOut(0);
            $(".photo_autocontestador").fadeOut(0);
            $(".message_visitautocontestador").fadeOut(0);
            $(".bar-enc-conversation").fadeOut(0);
            $(".bar-enc-conversation").css({"margin-top": "0px"});
            $("body").append("<style>.container-center-conversations{background: transparent!important}</style>");
            $("#container-nwchat2").css({"background-color": "rgb(54, 54, 54)", "color": "#fff"});
        }
    }
    if (isMobile()) {
        if (typeof videoCallNwChat == "undefined") {
            $(".bar-enc-conversation").css({"margin-top": "25px"});
        }
    }

    addClass(self, ".addHeaderNote", "container-center-conversations");
    addClass(self, "#nwform ", "container-box-bottom");

    addCss(self, "#texto", {"height": "45px"});


//organiza los mensajes ya que vienen por defecto desc si es interna el chat
    if (typeof get["callingIntern"] != "undefined") {
        var d = $(".chats_conversations");
        var t = d.length;
        for (var i = 0; i < t; i++) {
            var f = d[i];
            $(self + " .addHtmlForm").prepend(f);
        }
    }


    listAddCssFor(self, ".contain_input_name_texto", {"width": "78%", "min-width": "78%", "max-width": "78%"});
    listAddCssFor(self, ".contain_input_name_enviar", {"width": "20%", "min-width": "20%", "max-width": "20%"});

    vista();

    onChangeWindow("vista");

    var send = actionInColForm(self, "enviar");
    send.click(function () {
        var data = getRecordNwForm(self);
        sendMessageVisitor(self, data);
    });

    removedLoadingNwChat();

    focusInput(self, "texto");

}

function reviewEncCallIntern(self) {
    var get = getGET();
    var data = {};
    data["get"] = get;
    var rpc = {};
    rpc["service"] = "nwchat";
    rpc["method"] = "reviewEncCallIntern";
    rpc["data"] = data;
    var func = function (r) {
        $(".id_call").val(r);
        cargaMensajesAll(self, false, r, false);
    };
    rpcNw("rpcNw", rpc, func, false);
}

function sendMessageVisitor(self, data) {
    if (!validateRequired(self)) {
        return false;
    }
    var get = getGET();
    data["get"] = get;
    if (typeof get["callingIntern"] != "undefined") {
        data["id_call"] = $(".id_call").val();
    }

    var num = Math.floor((Math.random() * 10000) + 1);
    var ra = Array();
    ra["id_msg"] = num;
    ra["msg_temp"] = true;
    ra["fecha"] = getDateHour();
    if (typeof get["user"] != "undefined") {
        ra["usuario_con_quien_chatea"] = get["user"];
    }
    if (typeof get["callingIntern"] != "undefined") {
        var up = getUserInfo();
        ra["tipo_user"] = "visitante";
        ra["foto_usuario"] = up["foto_perfil"];
        ra["nombre_operador"] = "Yo";
    } else {
        ra["tipo_user"] = "visitante";
        ra["foto_usuario"] = "visitante";
        ra["nombre_operador"] = "visitante";
    }
    ra["texto"] = data["texto"];
    ra["num_envio"] = num;

    data["fecha"] = ra["fecha"];
    data["num_envio"] = num;

    var html = lineByLineConversation(ra);

    addHeaderNote(self, html, "append");
    scroll();
//    soundUser();
    resetForm(self);

    var rpc = {};
    rpc["service"] = "nwchat";
    rpc["method"] = "sendMessageVisitor";
    rpc["data"] = data;
    var func = function (r) {
        if (!verifyErrorNwMaker(r)) {
            return;
        }
        $(".envia_msg_" + num).text("Recibido");
        $(".envia_msg_" + num).addClass("envia_msg_green");
    };
    rpcNw("rpcNw", rpc, func, true);
}

function vista() {
    var get = getGET();
    var altoTotal = $("#container-nwchat2").height();
    var altoBox = $(".container-box-bottom").height();
    var altoBarEnc = $(".bar-enc-conversation").height();
    var altoCenter = parseInt(altoTotal) - parseInt(altoBox) - parseInt(altoBarEnc) - 30;
    if (isMobile()) {
        if (typeof get["callingIntern"] == "undefined") {
            altoBarEnc = altoBarEnc + 25;
            altoCenter = altoCenter - 35;
        }
    }

    $(".container-center-conversations").css({"top": altoBarEnc + "px", "height": altoCenter});
    scroll();
}


function alertSize() {
    var myWidth = 0, myHeight = 0;
    if (typeof (window.innerWidth) == 'number') {
        //No-IE 
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ 
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible 
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


function cargaMensajesAll(self, leido, idCall, async, divcall) {
    var get = getGET();
    var data = {};
    data["leido"] = leido;
    data["get"] = get;
    if (typeof videoCallNwChat != "undefined") {
        if (videoCallNwChat === true) {
            data["focus"] = "NO";
            if (leido == true) {
                data["focus"] = "SI";
            }
        }
    }
    if (typeof idCall != "undefined") {
        if (idCall != undefined) {
            if (idCall != false) {
                data["id_call"] = idCall;
            }
        }
    }
    var rpc = {};
    rpc["service"] = "nwchat";
    rpc["method"] = "consultaChatAll";
    rpc["data"] = data;
    var func = function (r) {
        console.log(r);
        var isVideoCall = false;
        if (typeof videoCallNwChat != "undefined") {
            if (videoCallNwChat === true) {
                if (r != 0) {
                    if (r.length > 0) {
                        for (var i = 0; i < r.length; i++) {
                            var g = r[i];
                            console.log(g);
                            if (g.usuario != "Autocontestador") {
                                initVideoCallNwC(g.usuario);
                                clearAlertNotifica();
                                return;
                            }
                        }
                    }
                }
                isVideoCall = true;
            }
        }
        if (r === 0) {
            $(".envia_msg").text("Leído");
            $(".envia_msg").addClass("envia_msg_blue");
        } else {
            if (typeof get["callingIntern"] == "undefined") {
                checkCallOnlineOperator(r);
            } else {
                $(".line2").remove();
            }

            if (isVideoCall === false) {
                var html = createLinesConversation(r, leido);
                addHeaderNote(self, html, "append");

                scroll();

                if (leido === true) {
                    var divcalling = r.length;
                }
                if (divcall != divcalling) {
                    scroll();
                }
            }

            __totalMsg = r.length;
        }

        timeoutIDNotifica = setTimeout(function () {
            cargaMensajesAll(self, true, idCall, true, divcalling);
        }, 5000);
    };
    rpcNw("rpcNw", rpc, func, async);
}

chatInit = false;
function checkCallOnlineOperator(ra) {
    if (!chatInit) {
        var config = getConfigNwChat();
        var total = ra.length;
        for (var i = 0; i < total; i++) {
            var r = ra[i];
            changeEncConversation({nombre_operador: "Esperando conexión...", visitante: r["visitante"], foto_usuario: config["foto_autorespondedor"]});
            if (i + 1 == total) {
                if (r["status"] == "INICIADO" || r["status"] == "HABLANDO_OP") {
                    chatInit = true;
                    changeEncConversation(r);
                    break;
                }
            }
        }
    }
}

function changeEncConversation(ra) {
    $(".operator-enc").text(ra["nombre_operador"]);
    $(".number-conversation").text("Servicio en línea #" + ra["visitante"]);
    $(".operator-foto-enc").css({"background-image": "url(" + ra["foto_usuario"] + ")"});
}

function createLinesConversation(ra, leido) {
    var get = getGET();
    var total = ra.length;
    var rta = "";
    if (total == undefined) {
        rta += lineByLineConversation(ra);
    } else {
        for (var i = 0; i < total; i++) {
            var r = ra[i];
            if (typeof get["user"] != "undefined") {
                r["usuario_con_quien_chatea"] = get["user"];
            }
            if (leido === false) {
                r["loadAllMessages"] = true;
            }
            rta += lineByLineConversation(r);

            changeStatusEnc(r["status"]);

            if (r["status"] == "FINALIZADO") {
                reinitNwChat();
            }
        }
    }
    return rta;
}

function changeStatusEnc(status) {
    $(".call-status").html(" " + status);
}

function lineByLineConversation(r) {
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
    if (typeof r.fecha != "undefined") {
        var fecha_split = r.fecha.split(" ");
        if (fecha_split[0] == hoy) {
            r["fecha"] = fecha_split[1];
        }
    }

    var foto = "";
    if (evalueData(r["foto_usuario"])) {
        if (r["foto_usuario"] != "visitante") {
            var foto = "style='background-image: url(/nwlib6/includes/phpthumb/phpThumb.php?src=" + r["foto_usuario"] + "&w=40&f=jpg);'";
        }
    }
    rta += "<div class='chats_conversations chats_conversation_id" + r["num_envio"] + " chat_" + r["tipo_user"] + "" + msg_temp + "'>";
    rta += "<div class='photo photo_" + r["tipo_user"] + "' " + foto + " ></div>";
    rta += "<div class='message_all message_visit" + r["tipo_user"] + "'>";
    rta += "<div class='message_only message_only_" + r["tipo_user"] + "'>";
    rta += "<p class='usuario'><span>" + r["nombre_operador"] + ":</span></p>";
    rta += "<p class='mensaje'>" + r["texto"] + "</p>";
    rta += "</div>";
    if (evalueData(r["dispositivo"])) {
        rta += "<p class='dispositivo_conversation'>" + r["dispositivo"] + "</p>";
    }
    rta += "<p class='fecha_conversation fecha_conversation_" + r["tipo_user"] + "'>" + r["fecha"] + "</p>";
    rta += "<p class='envia_msg envia_msg_" + colorLeido + " envia_msg_" + r["tipo_user"] + " envia_msg_" + r["id_msg"] + "'>" + sending + "</p>";
    rta += "</div>";
    rta += "</div>";

    if (typeof r["loadAllMessages"] == "undefined") {
        if (r["usuario"] == r["usuario_con_quien_chatea"]) {
            soundOperator();
        }
    }

    return rta;
}

function scroll() {
    var totalChats = $(".chats_conversations").length;
    var altoChats = parseInt($(".chats_conversations").height()) + 200;
    var altoCenter = altoChats * totalChats;
    $(".container-center-conversations").animate({scrollTop: altoCenter + 'px'}, 0);
}

function soundOperator() {
    if (localStorage["play_timbre"] != "NO") {
        document.getElementById('operador_sound').play();
    }
}

function soundUser() {
    if (localStorage["play_timbre"] != "NO") {
        document.getElementById('usuario_sound').play();
    }
}

function finalizarNwChat() {
    var rpc = {};
    rpc["service"] = "nwchat";
    rpc["method"] = "finalizarNwChat";
    var func = function (r) {
        console.log(r);
        if (r) {
            changeStatusEnc("Finalizado por cliente");
            reinitNwChat();
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function reinitNwChat() {
    clearAlertNotifica();
    var rpc = {};
    rpc["service"] = "nwchat";
    rpc["method"] = "reinitNwChat";
    var func = function (r) {
        if (typeof videoCallNwChat != "undefined" && videoCallNwChat === true) {
            window.location.reload();
        }
        if (r) {
            $(".colsMenu_nwchat").remove();
            $(".container-box-bottom").empty();
            $(".container-box-bottom").prepend("<div class='volverahacerllamada' >Llamada finalizada. ¿Desea volver a realizar una llamada?</div>");

            $(".volverahacerllamada").click(function () {
                window.location.reload();
            });

        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function timbraBucleNwChat() {
    document.getElementById('soundCalling').play();
}