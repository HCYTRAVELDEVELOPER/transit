var callbackhomenwmaker = null;
/*
 var timeConsultNotifications = 30000;
 var timeConsultNotifications = 2000;
 */
var timeConsultNotifications = 60000;
var functionsAddInNotifyResponse = [];

function createHomeNwMaker() {
    var c = getConfigApp();
    var up = getUserInfo();
    var v = nwm.getInfoApp();
    var version = v.version;
    var gv = "?v=" + version;
    if (nwm.getConfigApp.length > 0) {
        if (typeof v != "undefined") {
            if (typeof v.config != "undefined") {
                if (typeof v.config.offlineNwDual != "undefined") {
                    if (v.config.offlineNwDual == true) {
                        if (navigator.onLine == false) {
                            gv = "";
                        }
                    }
                }
            }
        }
    }
    if (typeof c.activeServerWorker !== "undefined") {
        if (c.activeServerWorker === true) {
            loadJs("/nwlib6/nwproject/modules/nw_user_session/js/activeServerWorker.js" + gv, false, false, true);
        }
    }
    if (c.useApiGoogleMaps === "SI" || c.useApiGoogleMaps === true) {
        if (c.use_geolocation === "SI" || c.use_geolocation === true) {
            miUbicacion(true);
        }
    }
    var foto_enc = "";
    if (evalueData(up.foto_perfil)) {
        if (up.foto_perfil.indexOf("platform-lookaside.fbsbx.com") !== -1) {
            foto_enc = "style='background-image: url(" + up.foto_perfil + ");' ";
        } else {
            foto_enc = "style='background-image: url(/nwlib6/includes/phpthumb/phpThumb.php?src=" + up.foto_perfil + "&w=70&f=jpg);' ";
        }
    }
    if (evalueData(up.foto)) {
        if (up.foto.indexOf("platform-lookaside.fbsbx.com") !== -1) {
            foto_enc = "style='background-image: url(" + up.foto + ");' ";
        } else {
            foto_enc = "style='background-image: url(/nwlib6/includes/phpthumb/phpThumb.php?src=" + up.foto + "&w=70&f=jpg);' ";
        }
    }
    var classmenu = "containerLeft_pcnormal";
    var classmenulines = "menMovilButtonNwm_pcnormal";
    var classconcenter = "containerCenter_pcnormal";
    if (c.menu_movil_en_pc === "NO" || c.menu_movil_en_pc === false) {
        classmenu = "";
        classmenulines = "";
        classconcenter = "";
    }
    var home = "<div class='loginnw' carpet_module='/nwlib6/nwproject/modules/nw_user_session/' url_sites='' >";
    home += "<div class='containerHomeUser' id='containerHomeUser'>";
    home += "<div class='containerLeft " + classmenu + "' id='containerLeft'>";
    home += "    <div class='container_left_gral'></div>";
    home += "<div class='menuMain separatorsLeft menuLeftModules'><ul class='ulMenuLeft'></ul></div>";
    home += " </div>";
    home += "   <div class='encMenuMobile'>";
    home += "     <div class='menMovilButtonNwm " + classmenulines + " showmenmovilNwmaker'>";
    home += "         <span class='movilEquisNwmaker movilEquisNwmaker1'></span>";
    home += "         <span class='movilEquisNwmaker movilEquisNwmaker2'></span>";
    home += "         <span class='movilEquisNwmaker movilEquisNwmaker3'></span>";
    home += "    </div>";
    home += "    <div id='logotipoMain_w' class='buttonEncMobile logotipoMain execCallBack' data='logotipo' data-url='#' callBack='createMenuAndModulesHome' parameters='execFunc' type='homenwMaker'  ></div>";
    home += "    <div class='containerMenuVertical'></div>";
    home += "    <div class='others_enc'>";

    home += "         <div class='buttonEncMobile searchMobile' data='search'>";
    home += "       </div>";
    var iconStatus = "<span class='iconStatusNwUser'></span>";
    if (up["usuario"] == undefined) {
        iconStatus = "";
    }

    if (evalueData(up.usuario)) {
        home += "<div class='buttonEncMobile userMobile showNotificationEver' data='user' >" + iconStatus;
        home += "<span class='nozbf fotoperfilnwmaker' " + foto_enc + ">";
        if (!evalueData(foto_enc)) {
            home += "<i class='material-icons'>person</i>";
        }
        home += "</span>";
        home += "</div>";

        activeLastCon();
        if (c.permitir_chat === "SI" || c.permitir_chat === "true" || c.permitir_chat === true) {
            home += "        <div class='buttonEncMobile chatMobile showNotificationEver' data='chat'><i class='material-icons'>chat</i><div class='globoRojoNotifica globoEncChat' ><span class='globoRojoNotificaChat'></span></div></div>";
        }
        if (c.activar_notificaciones === "SI" || c.activar_notificaciones === "true" || c.activar_notificaciones === true) {
            home += "        <div class='buttonEncMobile notificationMobile showNotificationEver' data='notification'><i class='material-icons'>notifications</i><div class='globoRojoNotifica globoEncNotify'><span class='globoRojoNotificaNotify'></span></div></div>";
        }

    }
    home += "    </div>";
    home += "  </div>";
    home += "<div class='containerCenter " + classconcenter + "' id='containerCenter'>";
    home += "     <div class='encData'></div>";
    home += "    <div class='loadMenuModules'></div>";
    home += "   <div class='loadModulosCenter'></div>";
    home += " </div>";
    home += "<div class='container-nwmakerchat'></div>";
    home += "<div class='footerTools'></div>";

    var noticon = "<div class='container-notifications-mini'></div>";
    var noticonRight = "<div class='container-notifications-mini-right'></div>";
    if (!isMobile()) {
        home += noticon;
        home += noticonRight;
    }
    home += "</div>";
    home += "</div>";

    home += " <audio id='operador_sound' src='/nwlib6/audio/chat.wav' ></audio>";
    $("#container-nwmaker").html(home);
    if (isMobile()) {
        $("body").append(noticon);
        $("body").append(noticonRight);
    }

    activeButtonsNwMaker();
    activeNotificacions("INITIAL");
    if (c["pedir_aceptar_terminos_interno"] == "SI") {
        showTerminosCondicionesNwMaker();
    }
    if (c["solicitar_pago"] == "SI") {
        verificaPagoUsuario();
    }
    var loadMultiTerm = false;
    if (c["multi_terminal"] == "SI") {
        loadMultiTerm = true;
    }
    if (typeof up["multi_terminal"] != "undefined") {
        if (up["multi_terminal"] == "NO") {
            loadMultiTerm = false;
        }
    }
    if (window.location.hash == "#execCallBack=SwitchTerminal") {
        loadMultiTerm = false;
    }
    if (loadMultiTerm === true) {
        loadJs("/nwlib6/nwproject/modules/nw_user_session/js/forms/f_multi_terminal.js" + gv, function () {
            SwitchTerminal();
        }, false, true);
    }

    var completaPerfil = false;
    if (c["solicitar_completar_perfil"] == "SI") {
        if (!evalueData(up["nombre"]) || !evalueData(up["apellido"]) || !evalueData(up["ciudad"])) {
            completaPerfil = true;
        }
    }
    if (completaPerfil) {
        editDataPersonal("popup");
    }

    activeResponsive();
}

function activeResponsive() {
    var w = window.innerWidth;
    var h = window.innerHeight;
}

function activeLastCon() {
    var c = getConfigApp();
    var pass = false;
    if (c.updateLastConnection === true || c.updateLastConnection === "SI") {
        pass = true;
    }
    if(!pass) {
        return false;
    }
    inactiveLastCon();
    updateLastConnection();
    updateUserCon = setInterval(function () {
        updateLastConnection();
    }, 60000);
}

function inactiveLastCon() {
    if (typeof updateUserCon !== "undefined") {
        clearInterval(updateUserCon);
    }
}

function updateLastConnection() {
    var up = getUserInfo();
    var data = {};
    data.estado = up.estado_conexion;
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "actualizeLastConnection";
    rpc["data"] = data;
    var func = function (r) {
        if (!verifyErrorNwMaker(r, false, false, false, false)) {
            return false;
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function createMenuVerticalNwMaker(html) {
    var h = "";
    if (typeof html !== "undefined") {
        if (evalueData(html)) {
            h = html;
        }
    }
    $(".others_enc").prepend("<ul class='containerMenuVerticalUl'>" + h + "</ul>");
    remove(".containerMenuVerticalUl .usersConectedBtn");
    remove(".containerMenuVerticalUl .myUsersNwMakerBtn");
    remove(".containerMenuVerticalUl .close_session");
}

function SwitchTerminal() {
    var up = getUserInfo();
    loadJs("/nwlib6/nwproject/modules/nw_user_session/js/forms/f_multi_terminal.js", function () {
        var g = new multiTerminalNw();
        g.constructor();
    }, false, true);
}

var totalNotificacionsNwMaker = 0;
function activeNotificacions(leido, total) {
    var c = getConfigApp();
    var active = false;
    if (typeof c.activar_notificaciones === "undefined") {
        active = false;
    }
    if (c.activar_notificaciones === true || c.activar_notificaciones === "SI") {
        active = true;
    }
    if (typeof __nwMakerWorkOut != "undefined") {
        if (__nwMakerWorkOut == true) {
            active = false;
        }
    }
    if (active === true) {
        testIsNotificacions(leido, total);
        intervalNotifyNwmaker = setInterval(function () {
            testIsNotificacions("NO", total);
        }, timeConsultNotifications);
    }
}

function execFunctionsAddNotify() {
    if (functionsAddInNotifyResponse.length > 0) {
        for (var i = 0; i < functionsAddInNotifyResponse.length; i++) {
            functionsAddInNotifyResponse[i]();
        }
    }
}

var idNo = {};
var rowsCirleList = {};
function testIsNotificacions(leido, total) {
    var up = getUserInfo();
    if (typeof up.usuario === "undefined") {
        return false;
    }
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "consultaNotificaciones";
    rpc["data"] = {leido: leido};
    var func = function (r) {
        $(".containerNotifyRemove").remove();
        execFunctionsAddNotify();
        idNo = {};
        rowsCirleList = {};
        $(".globoRojoNotifica").fadeOut(0);
        $(".cerrartodasnotify").fadeOut(0);
        if (verifyErrorNwMaker(r) === false) {
            return;
        }
        if (r === false) {
            changeTitle(false, false, true, false);
            return;
        }
        var totalNots = r.length;
        var totalNotsEnc = 0;
        for (var i = 0; i < totalNots; i++) {
            var a = r[i];
            if (a.notificado !== "SI" || evalueData(a.callback)) {
                totalNotsEnc++;
            }
        }
        if (totalNotsEnc > 0) {
            changeTitle(false, totalNotsEnc, false, false);
        }

        if (totalNots > 0) {
            if (totalNots > 2) {
                $(".cerrartodasnotify").fadeIn(0);
            }
            if (totalNots != total) {
                total = totalNots;
                var launch = true;
                if (totalNotificacionsNwMaker != 0) {
                    if (totalNots == totalNotificacionsNwMaker) {
                        launch = false;
                        totalNotificacionsNwMaker = 0;
                    }
                }
                if (totalNots <= totalNotificacionsNwMaker) {
                    launch = false;
                    totalNotificacionsNwMaker = 0;
                }
                launch = true;
                if (launch === true) {
                    addNumNotific(r.length, r, leido);
                } else {
                    totalNotificacionsNwMaker = totalNots;
                }
                total = 0;
            }
        }
        totalNotificacionsNwMaker = r.length;
    };
    rpcNw("rpcNw", rpc, func, true);
}

function addNumNotific(total, data, leido) {
    var c = getConfigApp();
    var sichat = true;
    if (typeof c["permitir_chat"] != "undefined") {
        if (c["permitir_chat"] == "NO") {
            sichat = false;
        }
    }
    var totalnoti = 0;
    var totalchat = 0;
    var totalN = data.length;

    for (var i = 0; i < totalN; i++) {
        var r = data[i];
        if (r.tipo == "chat" && sichat === true || r.tipo == "chatg" && sichat === true || r.tipo == "call" && sichat === true) {
            totalchat++;
        } else {
            totalnoti++;
        }
        r.nube = true;
        var msg = bodyNotificacionEnc(r);
        if (leido === "NO" || leido === "INITIAL") {
            notifica_mini(msg, r, leido);
        }
    }
    if (totalnoti > 0) {
        $(".globoEncNotify").fadeIn(0);
        $(".globoRojoNotificaNotify").text(totalnoti);
    }
    if (totalchat > 0) {
        $(".globoEncChat").fadeIn(0);
        $(".globoRojoNotificaChat").text(totalchat);
    }
}

function notifica_mini(msg, array, leido) {
    if (evalueData(array.izquierda_nomostrar_despues_de)) {
        var hoy = getFechaHoraActual();
        var timeAdd = addMinutesDate(array.izquierda_nomostrar_despues_de, array.fecha_aviso_recordat);
        if (hoy >= timeAdd) {
            if (document.querySelector(".containerAlertNotificaMini_" + array.id)) {
                document.querySelector(".containerAlertNotificaMini_" + array.id).remove();
                return false;
            }
            return false;
        }
    }
    if (document.querySelector(".containerAlertNotificaMini_" + array.id)) {
        return false;
    }
    var nav = getNavigator();
    var launch = true;
    if (array.notificado === "SI") {
        launch = false;
    }
    if (launch === true) {
        notificaNotifications(array.id);
    }
    var id = array.id;
    var sendNotifiDesk = true;
    if (!validaNotificaCreate(id)) {
        sendNotifiDesk = false;
        return;
    }
    if (sendNotifiDesk === false) {
        return false;
    }
    if (evalueData(array.sendNotifiDesk)) {
        sendNotifiDesk = array.sendNotifiDesk;
    }
    if (launch === false && !evalueData(array.callback)) {
        /*
         return;
         */
    }
    if (array.tipo === "chat") {
        var uu = cleanUserNwC(array.usuario_envia);
        var dd = $(".container-conversations" + uu);
        var t = dd.length;
        if (windowFocused == true && t >= 1) {
            return;
        }
    }
    var num = Math.floor(Math.random() * 101);
    var div = "createAlertNotificaMini_" + num;
    var html = "";
    var u = array.usuario_envia;
    if (evalueData(u)) {
        u = u.replace("@", "");
        u = u.replace(/\./g, "");
    }
    var containerNotifyRemove = "";
    if (!evalueData(array.callback)) {
        containerNotifyRemove = "containerNotifyRemove";
    }

    html += "<div class='createAlertNotificaMini " + div + " " + containerNotifyRemove + " containerNotifyRemove_ containerAlertNotificaMini_" + array.id + " containerAlertNotificaMini_" + array.tipo + u + "' >";
    html += "<div class='createAlertNotificaMiniMSG' >";
    html += msg;
    html += "</div>";
    html += "</div>";

    if (array.tipo === "chat" || array.tipo === "chatg" || array.tipo === "call") {
        /*
         $(".containInfoNotificationsChat").prepend(msg);
         */
        addCircleRedChat(array);
        $(".notifications_none_enc_chat").css({"display": "none"});
    } else {
        /*
         $(".containInfoNotificationsNotify").prepend(msg);
         */
        if (array.solo_campana !== "SI") {
            $(".container-notifications-mini").prepend(html);
        }
        $(".notifications_none_enc_notification").css({"display": "none"});
    }

    $("." + div + " .btnCloseNoty").click(function () {
        reject("." + div);
        leerNotificationById(array["id"]);
        var t = parseInt(__totalCountTitle) - 1;
        changeTitle(false, t);
        if (nav === "Google Chrome" || nav === "Firefox") {
            navigator.vibrate(0);
        }
    });
    $("." + div + " .btnOpenNoty").click(function () {
        reject("." + div);
    });
    if (launch === false) {
        return;
    }

    if (sendNotifiDesk === true) {
        spawnNotification(stripTags(array.mensaje), array.icon, array.title, array);
    }
    arrayNotifications[id] = id;
    if (array.tipo === "call") {
        $(".divContainerVideoCall").remove();
        $("." + div).addClass("divContainerVideoCall");
    }
    if (!isMobile()) {
        if (sendNotifiDesk === true) {
            if (array.tipo == "call") {
                if (nav == "Google Chrome" || nav == "Firefox") {
                    document.getElementById('usuario_sound').play();
                }
            } else {
                if (nav == "Google Chrome" || nav == "Firefox") {
                    document.getElementById('operador_sound').play();
                }
            }
        }
    }
    /*
     setTimeout(function () {
     reject("." + div);
     }, 6000);
     */
}

var timeoutIDNotifica;
function delayedAlertOne(func, time) {
    timeoutIDNotifica = window.setTimeout(func, time);
}
function clearAlertNotifica() {
    window.clearTimeout(timeoutIDNotifica);
}

function showNotificAlert(msg, array, self) {
    self = generateSelf();
    createNwForms(self, false, "popUp");
    addHeaderNote(self, msg);
    setModal(true);
    setWidth(self, 300);
    document.getElementById('operador_sound').play();
    navigator.vibrate([1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500]);
    document.getElementById('usuario_sound').play();
    var accept = addButtonNwForm("OK", self);
    accept.click(function () {
        leerNotificationById(array["id"]);
        navigator.vibrate(0);
        if (array["tipo"] == "nwdialogframe") {
            $(".dialogNwNew").remove();
            $(".dialogNwBg").remove();
            var params = {};
            params["html"] = array["link"];
            params["frame"] = true;
            createDialogNw(params);
        } else
        if (array["tipo"] == "nwdialog") {
            var params = {};
            params["html"] = array["link"];
            createDialogNw(params);
        } else
        if (array["tipo"] == "vcall") {
            openNwVideoChat(array["link"]);
        } else
        if (evalueData(array["link"])) {
            if (array["modo_window"] == "popup") {
                if (isMobile()) {
                    window.open(array["link"], '_blank');
                } else {
                    window.open(array["link"], "Nw", "width=600,height=600");
                }
            } else
            if (array["modo_window"] == "blank") {
                window.open(array["link"]);
            } else {
                window.location = array["link"];
            }
        }
        reject(self);
    });
    var cancel = addButtonNwForm("Cancelar", self);
    cancel.click(function () {
        leerNotificationById(array["id"]);
        navigator.vibrate(0);
        reject(self);
    });
    removeLoadingNw();
}

var arrayNotifications = {};
function validaNotificaCreate(i) {
    if (evalueData(arrayNotifications[i])) {
        return false;
    }
    return true;
}

function closeNotificacionNw(div) {
    $(div).fadeOut(1000);
    setTimeout(function () {
        remove(div);
    }, 1000);
}

function ingresaPhoneParaValidar() {
    var config = nwm.getConfigApp();
    var c = nwm.getInfoApp();
    remove(".ingresaPhoneParaValidar");
    $("body").append("<div class='ingresaPhoneParaValidar'></div>");
    var self = createDocument(".ingresaPhoneParaValidar");
    this.self = self;
    var fields = [
        {
            tipo: 'textField',
            nombre: '',
            placeholder: 'Correo / Email',
            name: 'email',
            car_min: '10',
            car_max: '200',
            requerido: "SI"
        },
        {
            title: "+",
            mode: "horizontal",
            name_group: "contenedor_celindi",
            numberCols: "1",
            tipo: "startGroup"
        },
        {
            tipo: 'integer',
            nombre: '',
            placeholder: 'Indicativo',
            name: 'indicativo',
            requerido: "SI"
        },
        {
            tipo: 'integer',
            nombre: '',
            placeholder: 'Celular / Móvil',
            name: 'celular',
            car_min: '0',
            car_max: '20',
            requerido: "SI"
        },
        {
            tipo: "endGroup"
        },
    ];
    createNwForms(self, fields, "nopopup");
    var up = getUserInfo();
    setValue(self, "email", up.email);
    setValue(self, "indicativo", up.pais_all_data.indicativo_celular);
    if (evalueData(up.celular)) {
        setValue(self, "celular", up.celular);
    }
    setColumnsFormNumber(self, 1);
    var html = "<span class='logoActPhone' style='background-image: url(" + config.logotipo + ")'></span>Ingresa tu número de teléfono y valida tu correo para activar tu cuenta y enviar el código de validación";
    addHeaderNote(self, html);
    var accept = addButtonNwForm("Enviar", self);
    accept.click(function () {
        var data = getRecordNwForm(self);
        if (!validateRequired(self)) {
            return false;
        }
        if (data.celular.length < 8) {
            nw_dialog("Verifique por favor el número de móvil");
            return false;
        }
        loading("Validando...", "rgba(255, 255, 255, 0.76)!important", self);
        data.name = c.name;
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "sendPhoneVerificarByCode";
        rpc["data"] = data;
        var func = function (r) {
            removeLoading(self);
            console.log(r);
            if (r === true) {
                ingresaCodePhone(data, data.email);
            } else {
                nw_dialog(r);
            }
            if (!verifyErrorNwMaker(r)) {
                return;
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    });
    removeLoadingNw();
}

function ingresaCodePhone(data, email) {
    var celular = data.celular;
    var indicativo = data.indicativo;
    var config = nwm.getConfigApp();
    var c = nwm.getInfoApp();
    remove(".ingresaPhoneParaValidar");
    $("body").append("<div class='ingresaPhoneParaValidar'></div>");
    var self = createDocument(".ingresaPhoneParaValidar");
    this.self = self;
    var fields = [
        {
            tipo: 'integer',
            nombre: '',
            placeholder: 'Código de 6 dígitos',
            name: 'token',
            car_min: '6',
            car_max: '6',
            requerido: "SI"
        }
    ];
    createNwForms(self, fields, "nopopup");
    $(self).addClass("ingresaCodePhone");

    setColumnsFormNumber(self, 1);
    var html = "<span class='logoActPhone' style='background-image: url(" + config.logotipo + ")'></span>El código de verificación se ha enviado al +" + indicativo + " " + celular + " y al correo " + email + "</h3><p>Revise los mensajes de texto y/o su correo registrado</p>";
    addHeaderNote(self, html);
    var accept = addButtonNwForm("Enviar", self);
    var cancel = addButtonNwForm("Volver a enviar", self);
    cancel.addClass("volveraenviar");
    cancel.click(function () {
        ingresaPhoneParaValidar();
    });
    accept.click(function () {
        var data = getRecordNwForm(self);
        var up = getUserInfo();
        if (!validateRequired(self)) {
            return false;
        }
        if (data.token.length < 6) {
            nw_dialog("El número debe ser mínimo de 6 dígitos, verifique por favor");
            return false;
        }
        data.celular = indicativo + celular;
        data.user = indicativo + celular;
        data.use = true;
        data.tipo = "verify";
        data.usuario = up.usuario;
        /*
         data.empresa = up.empresa;
         data.perfil = up.perfil;
         */
        data.name = c.name;
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "verificarCodeByPhone";
        rpc["data"] = data;
        loading("Validando...", "rgba(255, 255, 255, 0.76)!important", self);
        var func = function (r) {
            removeLoading(self);
            console.log(r);
            if (r === true) {
                window.localStorage.setItem("celular", celular);
                window.localStorage.setItem("celular_validado", "true");
                setTimeout(function () {
                    window.location.reload();
                }, 500);
            } else {
                nw_dialog("El código no coincide, intente nuevamente");
            }
            if (!verifyErrorNwMaker(r)) {
                return;
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    });
    removeLoadingNw();
}

function NwMaker() {
    var config = nwm.getConfigApp();
    var v = nwm.getInfoApp();
    this.constructor = constructor;
    var version = v.version;
    var up = getUserInfo();
    function constructor(params) {

        if (evalueData(up.usuario)) {
            var pasCel = true;
            if (typeof up.celular_validado === "undefined" || up.celular_validado === null || up.celular_validado === false || up.celular_validado === "false" || up.celular_validado === "NO") {
                pasCel = false;
            }
            if (config.verificar_celular_con_codigo_por_dispositivo === true) {
                if (window.localStorage.getItem("celular_validado") === null) {
                    pasCel = false;
                }
            }
            if (pasCel === false && config.verificar_celular_con_codigo === true) {
                remove(".containerLeft");
                remove(".containerCenter");
                remove(".container-nwmakerchat");
                remove(".containDataDemoEnclinka");

                newRemoveLoading("body");
                ingresaPhoneParaValidar();
                /*
                 ingresaCodePhone("3125729272");
                 */
                return false;
            }

            if (up.estado === "registrado_sin_validacion") {
                var msg = "Su cuenta ha sido creada correctamente, pero debe ser activada por el administrador del sistema.";
                if (evalueData(v.config_login.estado_registro_mensaje_in_home)) {
                    msg = v.config_login.estado_registro_mensaje_in_home;
                }
                document.querySelector(".loadModulosCenter").innerHTML = "<div class='msguserSinValidar'>" + msg + "<div class='imgUserSinValidar'><i class='material-icons'>ev_station</i></div></div>";
                newRemoveLoading("body");
                var cont = document.querySelector(".loadMenuModules");
                if (cont) {
                    cont.remove();
                }
                return false;
            }

        }

        var css = "";
        css += "";
        var callBack = false;
        if (typeof params.callBack !== "undefined") {
            callBack = params.callBack;
        }
        if (typeof params.css !== "undefined") {
            var cssCarpet = params.cssCarpet;
            var css = params.css;
            var total = css.length;
            if (total > 0) {
                for (var i = 0; i < total; i++) {
                    var c = css[i];
                    loadCss(cssCarpet + c + "?v=" + version);
                }
            }
        }

        if (typeof params.js !== "undefined") {
            var js = params.js;
            var totalj = js.length;
            var sa = 0;
            var workLocal = false;
            var workOld = false;
            var isnwproject = false;
            if (typeof config.workLocal !== "undefined") {
                workLocal = config.workLocal;
            } else {
                workOld = true;
            }
            var version_compress = "1";
            if (typeof config.version_compress !== "undefined") {
                if (evalueData(config.version_compress)) {
                    version_compress = config.version_compress;
                }
            }
            if (typeof config.id !== "undefined") {
                isnwproject = true;
            }
            var files = [];
            if (totalj > 0) {
                for (var ia = 0; ia < totalj; ia++) {
                    var jsCarpet = params.jsCarpet;
                    var sj = js[ia];
                    if (sj.indexOf("l_") != -1) {
                        jsCarpet = jsCarpet + "lists/";
                    } else {
                        jsCarpet = jsCarpet + "forms/";
                    }
                    files[ia] = {};
                    files[ia]["ruta"] = jsCarpet;
                    files[ia]["file"] = sj;
                    if (workLocal === true || workOld === true) {
                        loadJs(jsCarpet + sj + "?v=" + version, function () {
                            sa++;
                            validateEnd(sa, totalj, callBack);
                        }, false, true);
                    }
                }
                if (workLocal === true && isnwproject === false) {
                    if (typeof config.url_javascript_principal_ruta != "undefined" && typeof config.url_javascript_principal_name != "undefined") {
                        files[totalj] = {};
                        files[totalj]["ruta"] = config.url_javascript_principal_ruta;
                        files[totalj]["file"] = config.url_javascript_principal_name;
                    }
                    if (version_compress === "1") {
                        var rpc = {};
                        rpc["service"] = "nwMaker";
                        rpc["method"] = "loadFilesCompress";
                        rpc["data"] = {files: files};
                        var func = function (r) {
                            if (config.show_log_console_compress === true) {
                                console.log("Archivos comprimidos: " + r);
                                for (var o = 0; o < files.length; o++) {
                                    console.log(files[o].file);
                                }
                            }
                        };
                        rpcNw("rpcNw", rpc, func);
                    }
                } else {
                    if (workOld === false) {
                        /*
                         var gv = "?v=" + version;
                         if (navigator.onLine == false) {
                         gv = "";
                         }
                         loadJs("/nwlib6/nwproject/modules/nw_user_session/nwmaker_js.php" + gv, function () {
                         validateEnd(totalj, totalj, callBack);
                         }, false, true);
                         */
                        if (isnwproject === false) {
                            validateEnd(totalj, totalj, callBack);
                        }
                    }
                }
            } else {
                newRemoveLoading("body");
            }
        }
    }

    function validateEnd(sa, total, callBack) {
        var test = false;
        if (test === true) {
            setTimeout(function () {
                validateProductExpired(true);
            }, 3000);
            return false;
        }
        if (sa === total) {
            var get = getGET();
            localStorage["callBackHome"] = callBack;
            callbackhomenwmaker = callBack;
            if (getFuncHash() === false) {
                if (validateProductExpired() && typeof get.profilenw === "undefined") {
                    callBack();
                }
            }
            newRemoveLoading("body");
        }
    }
}

function validateProductExpired(test) {
    var v = nwm.getInfoApp();
    var up = getUserInfo();
    var hoy = getDateHour();
    /*
     console.log(up.estado_producto_cliente);
     console.log(up.account_date_expiration);
     console.log(hoy);
     console.log(up);
     */
    if (up.estado_producto_cliente === "ACTIVO") {
        if (up.account_date_expiration > hoy) {
            return true;
        }
    }
    if (typeof up.usuario !== "undefined") {
        if (typeof v.productnw !== "undefined" || test === true) {
            if (v.productnw === true || v.productnw === "SI" || test === true) {
                /*
                 if (up.status_account === "DEMO_HAS_EXPIRE") {
                 */
                if (!evalueData(up.pais) && v.config_login.pedir_pais === "SI") {
                    var self = createDocument(".f_check_country");
                    var fields = [
                        {
                            tipo: 'selectBox',
                            nombre: 'País',
                            name: 'pais',
                            requerido: "SI"
                        }
                    ];
                    createNwForms(self, fields, "nopopup");
                    var data = {};
                    data["table"] = "paises";
                    populateSelect(self, "pais", "nwprojectOut", "populate", data, " order by nombre asc", true, true, true);
                    setColumnsFormNumber(self, 1);
                    var html = "<h1>" + str("Selecciona  tu país") + "</h1>";
                    addHeaderNote(self, html);
                    setModal(true);
                    setWidth(self, 700);
                    var accept = addButtonNwForm("Guardar", self);
                    accept.click(function () {
                        if (!validateRequired(self)) {
                            return;
                        }
                        loading("Validando...", "rgba(255, 255, 255, 0.76)!important", self);
                        var data = getRecordNwForm(self);
                        var rpc = {};
                        rpc["service"] = "nwMaker";
                        rpc["method"] = "checkCountryProd";
                        rpc["data"] = data;
                        var func = function (r) {
                            if (!verifyErrorNwMaker(r)) {
                                return;
                            }
                            setLanguage(data.pais_all_data.idioma_text);
                            window.location.reload();
                        };
                        rpcNw("rpcNw", rpc, func, true);
                    });
                    removeLoadingNw();
                    return false;
                }
                var product_id = v.product_id;
                var div = ".containerCenter";
                var url = "https://app.ringow.com/?createAccount=true";
                var country = "";
                if (typeof up.pais_text !== "undefined") {
                    country = up.pais_text;
                }
                if (typeof up.pais_name !== "undefined") {
                    country = up.pais_name;
                }
                if (typeof up.pais_all_data !== "undefined") {
                    if (typeof up.pais_all_data.alias !== "undefined") {
                        country = up.pais_all_data.alias;
                    }
                }
                var connecToServer = true;
                if (v.productnw_connect_to_server === false) {
                    connecToServer = false;
                }
                var mode = up.status_account;
                if (up.estado_producto_cliente !== "ACTIVO" || up.status_account !== "ACTIVE" || test === true) {
                    if (connecToServer === true) {
                        var html = "";
                        html += "<div class='containDataDemoEnc' style='left: " + v.config.ancho_menu_left + "'>";
                        html += str("Estás en modo") + " " + up.estado_producto_cliente + ". " + str("Faltan") + " " + up.dias_prueba + " " + str("días");
                        if (up.estado_producto_cliente !== "ACTIVO")
                            html += " " + str("para renovar tu pago, Puedes actualizar tu plan aquí. ");
                        html += " <span class='containDataDemoEnclinka'>" + str("Haz click aquí para actualizar tu plan") + ".</span>";
                        html += "</div>";
                        $(".menuLeftModules").before(html);
                    }

                    if (document.querySelector(".containDataDemoEnclinka")) {
                        document.querySelector(".containDataDemoEnclinka").addEventListener("click", function () {
                            newLoading("html", "Cargando planes, espere un momento por favor...", "background-color: #fff;z-index: 10000000000000;font-family: arial;", "allWindow");
                            var params = {};
                            params.html = "<div class='containPlansIntCl'></div>";
                            params.textAccept = 'Cancelar';
                            params.no_cancel_button = true;
                            params.no_buttons_enc = true;
                            params.width = "80%";
                            params.title = 'Título de ventana';
                            var se = createDialogNw(params);
                            removeTitleForm(se);
                            addCss(se, ".dialogNwNewInter", {"padding": "0px", "margin": "0px"});
                            addCss(se, ".dialogNwNewInterContend", {"padding": "0px", "margin": "0px"});
                            addCss(".dialogNwBg", "", {"background": "rgba(255, 255, 255, 0.9)"});

                            showPlanesProductsNw(product_id, ".containPlansIntCl", mode, false, url, country, function () {
                                addCss(".containPlans", "", {"padding": "20px", "margin": "0px", "max-width": "100%"});
                                adapterSizeAndPositionDialogNw(se);
                                newRemoveLoading("html");
                            });

                        });
                    }
                }
                if (up.status_account !== "ACTIVE") {
                    /*
                     remove(".containerCenter");
                     */
                    remove(".containerLeft");
                    remove(".container-nwmakerchat");
                    remove(".containDataDemoEnclinka");
                    if (connecToServer === true) {
                        showPlanesProductsNw(product_id, div, mode, false, url, country);
                    }
                    return false;
                }
            }
        }
    }
    return true;
}

function createCircleNotifyNwChatRed(data) {
    $(".globoRedNwChat").remove();
    for (var i = 0; i < data.length; i++) {
        if (data[i].tipo === "chat")
            addCircleRedChat(data[i]);
    }
}


function validaIdNotChat(id) {
    if (typeof idNo[id] === "undefined")
        return true;
    return false;
}

function addCircleRedChat(array) {
    var id = array.id;
    if (validaIdNotChat(id)) {
        var uu = cleanUserNwC(array.usuario_envia);
        var dd = $(".container-conversations" + uu);
        var cl = "globoRedNwChat_" + uu;
        idNo[id] = id;
        var num = $("." + cl).text();
        if (!evalueData(num)) {
            num = 1;
        } else {
            num++;
        }
        rowsCirleList[uu] = num;
        dd.find(".globoRedNwChat").remove();
        dd.append("<div class='globoRedNwChat " + cl + "'>" + num + "</div>");
        addCircleRedListChat(uu, num);
    }
}

function addCircleRedListChat(uu, num) {
    var da = $(".rowChat_" + uu);
    da.find(".globoRedNwChat").remove();
    da.append("<div class='globoRedNwChatList globoRedNwChatList_" + uu + "'>" + num + "</div>");
}

function misUsuariosCompartidos() {
    loadJs("/nwlib6/nwproject/modules/nw_user_session/js/lists/l_usuarios_compartidos.js", function () {
        loadJs("/nwlib6/nwproject/modules/nw_user_session/js/forms/f_usuarios_compartidos.js", function () {
            var d = new l_usuarios_compartidos();
            d.constructor();
        }, false, true);
    }, false, true);
}

function bodyNotificacionEnc(r) {
    var nav = getNavigator();
    var classcursor = "";
    var num = Math.floor(Math.random() * 11101);
    /*
     classcursor = "cursorCallBackMaker";
     */
    if (evalueData(r.callback) === true || evalueData(r.link) === true) {
        (function () {
            $('body').delegate(".notificationMakerNumber_" + num + " .btnOpenNoty", 'mouseup', function (e) {
                leerNotificationById(r.id);
                var t = parseInt(__totalCountTitle) - 1;
                changeTitle(false, t);
                $(this).removeClass("notificationBox_NO");
                $(this).addClass("notificationBox_SI");
                if (nav == "Google Chrome" || nav == "Firefox") {
                    navigator.vibrate(0);
                }
                if (evalueData(r.callback) === true) {
                    new Function(r.callback)();
                }
                if (evalueData(r.link) === true) {
                    window.open(r.link, '_blank');
                }
                setTimeout(function () {
                    $(".containInfoNotifications").fadeOut(0);
                }, 1000);
            });
        })();
    }

    var u = r.usuario_envia;
    if (evalueData(u)) {
        u = u.replace("@", "");
        u = u.replace(/\./g, "");
    }
    var dateFormat = calcularTiempoDosFechas(r.fecha_aviso_recordat);
    var f = dateFormat.dateInFormat;
    var msg = "";
    msg += "<div class='notificationBox notificationBox_" + r.tipo + u + " notificationBox_" + r.notify_open + " notificationBox_" + r.id + " notificationMakerNumber_" + num + " " + classcursor + "'>";
    /*    
     msg += r.title;
     */
    msg += "<div class='bodyMensajeNotific' >" + r.mensaje + "</div>";
    msg += "<div class='fechaNotif contain_date_format' data-date='" + r.fecha_aviso_recordat + "'>" + f + "</div>";
    msg += "<div class='usuarioEnviaNot' >Enviada por <strong>" + r.usuario_envia + "</strong></div>";
    /*
     msg += "<div class='containBtnsNoty'>";
     */
    var claaddclose = "";
    if (evalueData(r.callback) === true || evalueData(r.link) === true) {
        msg += "<div class='btnNotyfy btnOpenNoty' tipo='" + r.tipo + "'>Ingresar</div>";
        claaddclose = "claaddclose";
    }
    /*
     msg += "</div>";
     */
    if (typeof r.nube !== "undefined") {
        if (r.nube === true) {
            msg += "<div class='btnNotyfy btnCloseNoty " + claaddclose + "' tipo='" + r.tipo + "'><i class='material-icons'>close</i></div>";
        }
    }
    msg += "<div class='tipoNotify' style='display:none;'>" + r.tipo + "</div>";
    msg += "</div>";
    return msg;
}

function readNotifyByIDS(ids) {
    if (evalueData(ids)) {
        if (ids.length > 0) {
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "readNotifyByIDS";
            rpc["data"] = {detalle: ids};
            var func = function (r) {
                setTimeout(function () {
                    for (var i = 0; i < ids.length; i++) {
                        var d = ids[i];
                        $(".notificationBox_" + d).removeClass("notificationBox_NO");
                        $(".notificationBox_" + d).addClass("notificationBox_SI");
                    }
                }, 2000);
                if (!verifyErrorNwMaker(r)) {
                    return;
                }
            };
            rpcNw("rpcNw", rpc, func, true);
        }
    }
}


function nuevaVideollamadaRingow() {
    var self = createDocument(".nuevaVideollamadaRingow");
    this.constructor = constructor;
    this.self = self;
    function constructor() {
        var fields = [
            {
                tipo: 'textField',
                nombre: 'Nombre del Invitado',
                name: 'nombre',
                requerido: "SI"
            },
            {
                tipo: 'textField',
                nombre: 'Correo',
                name: 'usuario_recibe',
                requerido: "SI"
            },
            {
                tipo: 'dateField',
                nombre: 'Fecha de caducidad',
                name: 'fecha_caducidad',
                requerido: "SI"
            },
            {
                tipo: 'textArea',
                nombre: 'Comentarios',
                name: 'observaciones',
                requerido: "NO"
            }
        ];
        createNwForms(self, fields, "popup");
        setColumnsFormNumber(self, 2);
        var html = "Crear una videollamada con Ringow, uno a uno...";
        addHeaderNote(self, html);

        var data = getRecordNwForm(self);
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "getMyLastVideollamadaRingow";
        rpc["data"] = data;
        var func = function (r) {
            console.log(r);
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            var html = "<h2>Últimas videollamadas</h2>";
            for (var i = 0; i < r.length; i++) {
                var ra = r[i];
                html += "<div class='lastVidero lastVidero_" + ra.id + "'><a href='" + ra.link_usuario + "' target='_BLANK'>Room " + ra.id + " - Correo: " + ra.usuario_recibe + "<br />Fecha: " + ra.fecha + " - Caducidad: " + ra.fecha_caducidad + "</a></div>";
            }
            addFooterNote(self, html);

            for (var i = 0; i < r.length; i++) {
                var ra = r[i];
                var d = document.querySelector(".lastVidero_" + ra.id);
                var da = document.createElement("button");
                da.className = "reenviarVideoRingow";
                da.innerHTML = "Reenviar";
                da.data = ra;
                da.onclick = function () {
                    loading("Por favor espere...", "rgba(255, 255, 255, 0.76)!important", self);
                    var data = this.data;
                    data.reenviar = true;
                    var rpc = {};
                    rpc["service"] = "nwMaker";
                    rpc["method"] = "nuevaVideollamadaRingow";
                    rpc["data"] = data;
                    var func = function (r) {
                        if (!verifyErrorNwMaker(r)) {
                            return;
                        }
                        reject(self);
                        nw_dialog("Ha sido enviada la invitación al correo " + data.usuario_recibe + ", tu link de conexión es: <br /><br /><a class='btn linkconecvidringow' href='" + r + "' target='_BLANK'>" + r + "</a>");
                    };
                    rpcNw("rpcNw", rpc, func, true);
                };
                d.appendChild(da);
            }
        };
        rpcNw("rpcNw", rpc, func, true);


        setValue(self, "fecha_caducidad", hoy());

        $(self + " .uploader_foto_perfil").attr("self-div", self + " #nwform");

        var data = {};
        populateSelect(self, "usersGroup", "nwMaker", "consultaUsuariosTerminalText", data);

        var accept = addButtonNwForm("Crear", self);
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            rejectForm(self);
        });
        accept.click(function () {
            if (!validateRequired(self)) {
                return;
            }
            loading("Por favor espere...", "rgba(255, 255, 255, 0.76)!important", self);
            var data = getRecordNwForm(self);
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "nuevaVideollamadaRingow";
            rpc["data"] = data;
            var func = function (r) {
                if (!verifyErrorNwMaker(r)) {
                    return;
                }
                reject(self);
                nw_dialog("Ha sido enviada la invitación al correo " + data.usuario_recibe + ", tu link de conexión es: <br /><br /><a class='btn linkconecvidringow' href='" + r + "' target='_BLANK'>" + r + "</a>");
            };
            rpcNw("rpcNw", rpc, func, true);
        });
        removeLoadingNw();
    }
}