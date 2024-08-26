/* 
 * creador: Alexander Flórez
 * Abril 2016
 * 
 * doc:
 * MUY IMPORTANTE ES +++, MEDIO: ++, BAJO O NADA: +
 * 
 * EXPLICACIÓN: loadModuleCenter
 *+++ output: html a mostrar, también puede ser una función
 *+++ div: objeto o div en donde va a cargar
 *+ parameters: pueden ser datos para la función output o algo así: createModulesHome o un identificador, se puede dejar vacío o false o null o undefined
 *++ status: por defecto true, o si quiere ejecutar una función le pasa esto: execFunc
 *+ type: identifica si es el menú principal, o un maestro
 *+ rastro: para crear la miga de pan
 *EJEMPLO DE USO loadModuleCenter:
 *output = "<h1>hola mundo</h1>";
 *div = ".container";
 *parameters = "";
 *status = true;
 *type = "";
 *rastro = "Mi módulo";
 * loadModuleCenter(output, div, parameters, status, type, rastro)
 * 
 * 
 * 
 * CARGAR UN MÓDULO NWMAKER con loadModuleMaker
 * loadModuleMaker
 * loadModuleMaker(pr, tipo)
 * +++ pr: un array donde se debe enviar el id del módulo
 * tipo: puede ser de home, dejar en blanco o vacío si es normal
 * EJEMPLO DE USO:
 *   var get = getGET();
 var dataSend = {};
 dataSend["action"] = func;
 dataSend["parameters"] = parameters;
 dataSend["get"] = get;
 dataSend["id"] = parameters;
 * loadModuleMaker(dataSend, tipo)
 */
var __loadMenu = false;
var __loadModulesHome = false;
var __pruebasNwMaker = true;
var __async_menu = true;
var __asyncModulesHome = true;
var __asyncModules = true;
var __asyncModulesComponents = false;
var __asyncConfig = true;
var __asyncJsPrincipalConfig = true;
var __loadNotificacionsNwMaker = false;
var __loadNotificacionsChatNwMaker = false;
var __loadEncDataUserNwMaker = false;
var __isInHomeNwMaker = false;

function initNwMaker() {
    var config = getConfigApp();
    setInterval(function () {
        setHoursMsg();
    }, 10000);

    /*
     window.onhashchange = function () {
     console.log(window.location);
     return false;
     }
     */
    window.onpopstate = function (event) {
        reject();
        if (evalueData(location.href) === true) {
            var dom = cleanDomainByHost(location.host);
            var state = cleanDomainByHost(location.href);
            if (dom === state) {
                if (__isInHomeNwMaker !== true) {
                    loadHomeNwMaker();
                }
            }
        }
        hiddenMenuCenter();
        removeAllDialog();
        hiddenUser();
        hideMenuMovilNwMaker();
        getFuncHash();
    };

    if (document.querySelector(".ulMenuLeft")) {
        applyDesignGralConfig();
    } else
    if (document.querySelector("#container-nwmaker")) {
        applyDesignGralConfig();
    }
    if (document.querySelector(".ulMenuLeft")) {
        createMenuAndModulesHome();
        if (typeof config.configjson == "undefined") {
            getFuncHash();
        }
    }
    activeMenuMovilNwMaker();
    var get = getGET();
    if (typeof get["profilenw"] != "undefined") {
        loadAjaxProfileUserNw(get["profilenw"]);
    }
    if (typeof config.configjson == "undefined") {
        newRemoveLoading("body");
    }
}

function loadHomeNwMaker(urlHome) {
    hiddenMenuCenter();
    removeAllDialog();
    hiddenUser();
    hideMenuMovilNwMaker();
    $(".loadModulosCenter").removeClass("loadModulosCenterShow");
    $(".loadMenuModules").removeClass("loadModulosCenterShow");
    $(".loadModulosCenter").empty();

    __isInHomeNwMaker = true;
    if (typeof urlHome == "undefined") {
        urlHome = "";
    }
    var dom = cleanDomainByHost(location.host);
    var state = cleanDomainByHost(location.href);
    if (dom != state) {
        addHash("/" + urlHome);
    }
    if (typeof callbackhomenwmaker !== "undefined") {
        if (typeof callbackhomenwmaker === 'function') {
            $(".btnActiveNw").removeClass("btnActiveNw");
            callbackhomenwmaker();
            return true;
        }
    }
    var a = {};
    a.callBack = "createMenuAndModulesHome";
    a.change_url = undefined;
    a.clean = undefined;
    a.datas = "#";
    a.div = undefined;
    a.execFunBefore = true;
    a.executeCallBackCode = undefined;
    a.hiddenm = undefined;
    a.id = undefined;
    a.nam = undefined;
    a.nivel = undefined;
    a.nmenu = undefined;
    a.parameters = "execFunc";
    a.rastro = undefined;
    a.type = "homenwMaker";
    loadExecCallBack(a);
}

function activeBtnExecNw(parameters) {
    $(".execCallBack").removeClass("btnActiveNw");
    $(".linkleftcallback_" + parameters).addClass("btnActiveNw");
}
function initOnlyConfigMaker(callBack) {
    if ($(".ulMenuLeft").length > 0) {
        getConfiguration(callBack);
    } else
    if ($("#container-nwmaker").length > 0) {
        getConfiguration(callBack);
    }
}

function getMyUsersNwMaker(add, self, callback) {
    if (add !== true) {
        var d = new myUsersNwMaker(false, callback);
        d.constructor(self);
    }
    if (add === true) {
        var d = new f_usuarios_nwmaker(add);
        d.constructor();
    }
}
function removeFromUrl(data) {
    var url = location.href;
    url = url.replace("?" + data, "");
    url = url.replace("&" + data, "");
    url = url.replace(data, "");
    addHash(url);
}
function addDataUrlGet(data) {
    var addData = data;
    var dataPath = location.pathname;
    var dataGet = "";
    var dataHash = "";
    if (evalueData(location.search)) {
        dataGet = location.search;
        dataGet = dataGet.replace("openContextMenu=true", "");
        addData = "&" + addData;
    } else {
        addData = "?" + addData;
    }
    if (evalueData(location.hash)) {
        dataHash = location.hash;
    }
    addHash(dataPath + dataGet + addData + dataHash);
}

function activeButtonsNwMaker() {
    /*
     (function () {
     $('body').delegate('.callBackHome', 'click', function () {
     loadHomeNwMaker();
     });
     })();
     (function () {
     $('body').delegate('.logotipoMain', 'click', function () {
     loadHomeNwMaker();
     });
     })();
     */
    (function () {
        $('body').delegate('.homeMobile', 'click', function () {
            loadHomeNwMaker();
        });
    })();
    (function () {
        $('body').delegate('.rastroInicio', 'click', function () {
            loadHomeNwMaker();
        });
    })();
    $("html").click(function () {
        $(".containInfoNotifications").fadeOut(0);
        $(".containCloseNotifyMobile").fadeOut(0);
        /*
         hiddenNotifications();
         */
    });
    $(".showNotificationEver").click(function (e) {
        var type = $(this).attr("data");
        loadInfoNotifications(type);
        e.stopPropagation();
        e.preventDefault();
    });
    (function () {
        $('body').delegate('*', 'mouseup', function (e) {
            __isInHomeNwMaker = false;
        });
    })();
    (function () {
        $('body').delegate('.activinSoundMaker', 'mouseup', function (e) {
            activeInOnSoundMaker("off");
        });
    })();
    (function () {
        $('body').delegate('.inactivinSoundMaker', 'mouseup', function (e) {
            activeInOnSoundMaker("on");
        });
    })();
    (function () {
        $('body').delegate('.hiddenLeftMenu', 'mouseup', function (e) {
            hiddenShowMenuLeft("hidden");
        });
    })();
    (function () {
        $('body').delegate('.showLeftMenu', 'mouseup', function (e) {
            hiddenShowMenuLeft("show");
        });
    })();
    (function () {
        $('body').delegate('.inactiveIncNotify', 'mouseup', function (e) {
            localStorage["notificationsnwmakeroffon"] = "false";
            this.style.display = "none";
            document.querySelector(".activeIncNotify").style.display = "block";
        });
    })();
    (function () {
        $('body').delegate('.activeIncNotify', 'mouseup', function (e) {
            localStorage["notificationsnwmakeroffon"] = "true";
            this.style.display = "none";
            document.querySelector(".inactiveIncNotify").style.display = "block";
        });
    })();
    (function () {
        $('body').delegate('.cerrartodasnotify', 'mouseup', function (e) {
            var data = {};
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "leerNotificaciones";
            rpc["data"] = data;
            var func = function (r) {
                if (!verifyErrorNwMaker(r)) {
                    return false;
                }
                $(".createAlertNotificaMini").remove();
                changeTitle(false, 0);
                $(".globoEncChat").fadeOut(0);
                $(".globoRojoNotificaChat").text("0");
                $(".globoEncNotify").fadeOut(0);
                $(".globoRojoNotificaNotify").text("0");
            };
            rpcNw("rpcNw", rpc, func, true);
        });
    })();
    (function () {
        $('body').delegate('.btnNotyfy', 'mouseup', function (e) {
            var t = $(this).attr("tipo");
            if (t === "chat" || t === "chatg" || t === "call") {
                var g = $(".globoRojoNotificaChat");
                var ac = g.text();
                ac = parseInt(ac) - 1;
                if (ac <= 0) {
                    ac = 0;
                    $(".globoEncChat").fadeOut(0);
                }
                g.text(ac);
            } else {
                var g = $(".globoRojoNotificaNotify");
                var ac = g.text();
                ac = parseInt(ac) - 1;
                if (ac <= 0) {
                    ac = 0;
                    $(".globoEncNotify").fadeOut(0);
                }
                g.text(ac);
            }
        });
    })();
    (function () {
        $('body').delegate('.userEtiqueted', 'click', function (e) {
            var s = $(this).text();
            var user = getAttributeNw($(this), "user");
            if (evalueData(user)) {
                s = user;
            }
            loadAjaxProfileUserNw(s);
        });
    })();
    (function () {
        $('body').delegate('.pTitleNwChat', 'click', function () {
            var u = $(this).attr("data-user");
            loadAjaxProfileUserNw(u);
        });
    })();
    (function () {
        $('#containerHomeUser').delegate('.openNwTaskNwMaker', 'click', function () {
            var ob = $(this).attr("id-obj");
            if (!ob) {
                return false;
            }
            loadTaskUnitary(ob);
        });
    })();
    (function () {
        $('#containerHomeUser').delegate('.btnOpenWallNotify', 'click', function () {
            var ob = $(this).attr("id-obj");
            if (!ob) {
                return false;
            }
            loadWallUnitary(ob);
        });
    })();
    (function () {
        $('body').delegate('.imgUser', 'click', function () {
            var up = getUserInfo();
            loadAjaxProfileUserNw(up.usuario);
        });
    })();
    (function () {
        $('#containerHomeUser').delegate('.openProfileNwUser', 'click', function () {
            var up = getUserInfo();
            loadAjaxProfileUserNw(up.usuario);
        });
    })();
    (function () {
        $('body').delegate('.closeNotMob', 'mousedown click touchstart', function (e) {
            console.log("hola hola");
            $(".containCloseNotifyMobile").fadeOut(0);
            $(".containInfoNotifications").fadeOut(0);
            hiddenNotifications();
        });
    })();
    (function () {
        $('body').delegate('.separator_enc_user', 'mousedown', function (e) {
            $(".containInfoNotifications").fadeOut(0);
            var up = getUserInfo();
            loadAjaxProfileUserNw(up.usuario);
            e.stopPropagation();
            e.preventDefault();
        });
    })();
    (function () {
        $('body').delegate('.separatos_link_exit', 'mousedown', function (e) {
            $(".containInfoNotifications").fadeOut(0);
            closeSession();
            e.stopPropagation();
            e.preventDefault();
        });
    })();
    (function () {
        $('body').delegate('.buttonInitSessNwm', 'click', function () {
            dontReloadRaiz = true;
            hiddenUser();
            hideMenuMovilNwMaker();
            removeLoadingNw();

            var url = addVarInUrl("createLogin=true");
            addHash(url);
            loginNw(".loadModulosCenter");
            /*
             loginNwByLink();
             var html = "";
             html += "<div class='volverNwMLogin'>Volver</div>";
             addHtmlForm(".containerInitSession", html);
             $(".volverNwMLogin").click(function () {
             window.location.reload();
             });
             */
        });
    })();
    (function () {
        $('body').delegate('.buttonCreateSessNwm', 'click', function () {
            dontReloadRaiz = true;
            hiddenUser();
            hideMenuMovilNwMaker();
            removeLoadingNw();
            var url = addVarInUrl("createAccount=true");
            addHash(url);
            createAccountNw(".loadModulosCenter");
            /*
             empty(".loadMenuModules");
             createAccountNwByLink();
             var html = "";
             html += "<div class='volverNwMLogin'>Volver</div>";
             addHtmlForm(".containerInitSession", html);
             $(".volverNwMLogin").click(function () {
             window.location.reload();
             });
             */
        });
    })();
    (function () {
        /*
         $('body').delegate('.execCallBack', 'click', function () {
         */
        $('body').delegate('.execCallBack', 'mousedown', function () {
            var a = {};
            a.datas = $(this).attr("data-url");
            a.nmenu = $(this).attr("dmenum-ispa");
            a.id = $(this).attr("d");
            a.nivel = $(this).attr("dmenum-nivel");
            a.hiddenm = $(this).attr("hidden-m");
            a.clean = $(this).attr("data-clean");
            a.change_url = $(this).attr("data-change_url");
            a.execFunBefore = true;
            a.executeCallBackCode = $(this).attr("executeCallBackCode");
            a.callBack = $(this).attr("callBack");
            a.div = $(this).attr("data-div");
            a.parameters = $(this).attr("parameters");
            a.type = $(this).attr("type");
            a.rastro = $(this).attr("rastro");
            a.nam = $(this).attr("nam-m");
            if (a.callBack == "createMenuAndModulesHome") {
                loadHomeNwMaker();
                return;
            }
            loadExecCallBack(a);
        });
    })();
    (function () {
        $('body').delegate('.closeWindowParentNwMaker', 'click', function () {
            $(this).parent().remove();
        });
    })();
    (function () {
        $('body').delegate('.usersConectedBtn', 'click', function () {
            usersConected();
        });
    })();
    (function () {
        $('body').delegate('.separatos_link_chatintern', 'mousedown', function () {
            usersConected();
        });
    })();
    var oldHashMaster = "";
    (function () {
        $('#containerHomeUser').delegate('.btnNew', 'click', function () {
            var hash = location.hash;
            var mode = $(this).attr("mode");
            oldHashMaster = hash;

            var data = hash;
            loadFunction("makeNwForm", ".nwMakeNwForm", data);
            if (mode == "edit") {
                var id = $(this).attr("data");
                location.hash = hash + "&record=" + id;
            }
        });
    })();
    (function () {
        $('body').delegate('.bgShowMenuLeft', 'click', function () {
            hideMenuMovilNwMaker();
        });
    })();
    (function () {
        $('body').delegate('.close_session', 'click', function () {
            closeSession();
        });
    })();
    (function () {
        $('body').delegate('.usersConectedBtn', 'click', function () {
            usersConected();
        });
    })();
    activeChangeStatusNwUser();
}

function activeInOnSoundMaker(mode) {
    var one = "";
    var two = "";
    if (mode == "off") {
        localStorage["playSoundsMaker"] = "false";
        one = "none";
        two = "block";
    } else {
        localStorage["playSoundsMaker"] = "true";
        one = "block";
        two = "none";
    }
    var d = document.querySelector(".activinSoundMaker");
    if (d) {
        d.style.display = one;
        document.querySelector(".inactivinSoundMaker").style.display = two;
    } else {
        setTimeout(function () {
            activeInOnSoundMaker(mode);
        }, 100);
    }
}

function hiddenShowMenuLeft(mode) {
    var one = "";
    var two = "";
    if (mode === "hidden") {
        localStorage["hiddenShowLeftMenu"] = "true";
        $(".containerLeft").addClass("containerLeft_hidden");
        $(".encMenuMobile").addClass("encMenuMobile_hidden");
        $(".containerCenter").addClass("containerCenter_hidden");
        one = "none";
        two = "block";
    } else {
        localStorage["hiddenShowLeftMenu"] = "false";
        $(".containerLeft").removeClass("containerLeft_hidden");
        $(".encMenuMobile").removeClass("encMenuMobile_hidden");
        $(".containerCenter").removeClass("containerCenter_hidden");
        one = "block";
        two = "none";
    }
    var d = document.querySelector(".hiddenLeftMenu");
    if (d) {
        d.style.display = one;
        document.querySelector(".showLeftMenu").style.display = two;
    } else {
        setTimeout(function () {
            hiddenShowMenuLeft(mode);
        }, 100);
    }
}

function loadExecCallBack(a) {
    var datas = a.datas;
    var nmenu = a.nmenu;
    var id = a.id;
    var nivel = a.nivel;
    var hiddenm = a.hiddenm;
    var clean = a.clean;
    var change_url = a.change_url;
    var executeCallBackCode = a.executeCallBackCode;
    var callBack = a.callBack;
    var div = a.div;
    var parameters = a.parameters;
    var type = a.type;
    var rastro = a.rastro;
    var nam = a.nam;
    var execFunBefore = true;
    if (isMobile()) {
        if (hiddenm === "SI") {
            $(".menMovilButtonNwm").fadeOut(0);
        } else {
            $(".menMovilButtonNwm").fadeIn(0);
        }
    }
    activeBtnExecNw(a.parameters);
    containFileDirNum = 0;
    if (clean !== "NO") {
        empty(".loadModulosCenter");
    }
    if (evalueData(executeCallBackCode)) {
        if (executeCallBackCode === "true") {
            execFunBefore = false;
            if (isMobile()) {
                addCss("body", ".loadModulosCenter", {"left": "0px"});
            }
            /*
             hiddenMenuCenter();
             removeAllDialog();
             hiddenUser();
             hideMenuMovilNwMaker();
             removeLoadingNw();
             */
            cleanWindowMaker();
        }
    }
    if (evalueData(nmenu) && nmenu === "SI" && evalueData(id) && evalueData(nivel)) {
        hiddenMenuCenter();
        removeAllDialog();
        hiddenUser();
        hideMenuMovilNwMaker();
        var params = {
            nivel: nivel,
            pertenece: id,
            name: nam
        };
        loadMenuNivel(params);
        return;
    }
    if (execFunBefore === true) {
        loadFunction(callBack, div, parameters, type, rastro);
    }
    if (change_url !== "NO") {
        changeUrl(datas);
    }
    removeLoadingNw();
}

function cleanWindowMaker() {
    hiddenMenuCenter();
    removeAllDialog();
    hiddenUser();
    hideMenuMovilNwMaker();
    removeLoadingNw();
}
function activeChangeStatusNwUser() {
    var up = getUserInfo();
    var div = $(".selectBoxStatusNwUser");
    div.val(up["estado_conexion"]);
    verificaColorsStatusNwUser(up["estado_conexion"]);
    (function () {
        $('body').delegate('.selectBoxStatusNwUser', 'change', function () {
            var val = $(this).val();
            /*
             if (val === "conectado") {
             activeLastCon();
             } else {
             inactiveLastCon();
             }
             */
            var data = {};
            data.estado = val;
            data.getSession = true;
            hiddenUser();
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "actualizeLastConnection";
            rpc["data"] = data;
            var func = function (r) {
                setUserInfo(r);
                verificaColorsStatusNwUser(val);
                div.val(val);
                activeLastCon();
            };
            rpcNw("rpcNw", rpc, func, true);
        });
    })();
}

function verificaColorsStatusNwUser(val) {
    if (val == "desconectado") {
        $(".iconStatusNwUser").css({"background-color": "#8d8d8d"});
    } else
    if (val == "ocupado") {
        $(".iconStatusNwUser").css({"background-color": "#e70303"});
    } else
    if (val == "ausente") {
        $(".iconStatusNwUser").css({"background-color": "#efe414"});
    } else
    if (val == "conectado") {
        $(".iconStatusNwUser").css({"background-color": "#14ef14"});
    }
}

function loadModuleMenu(p, rastro, callback, dataCallBack) {
    loadFunction("menuModuleCallBack", ".mainModulesMaker", p, false, rastro, callback, dataCallBack);
}

function loadModuleCall() {

}
function hiddenMenuCenter() {
    $(".loadMenuModules").removeClass("showMenuCenter");
    $(".loadMenuModules").addClass("hiddenMenuCenter");
}
function showMenuCenter() {
    $(".loadMenuModules").addClass("showMenuCenter");
    $(".loadMenuModules").removeClass("hiddenMenuCenter");
}
function loadMenuNivel(params) {
    var da = {};
    da.nivel = 1;
    if (!evalueData(params)) {
        return false;
    }
    if (evalueData(params.nivel)) {
        da.nivel = params.nivel;
    } else {
        return false;
    }
    if (evalueData(params.pertenece)) {
        da.pertenece = params.pertenece;
    } else {
        return false;
    }
    var rastro = "Nivel " + da.nivel;
    if (evalueData(params.name)) {
        rastro = params.name;
    }
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "getDataMenuMaker";
    rpc["data"] = da;
    var func = function (r) {
        var outputCenter = createMenuCenter(r, "center");
        loadModuleCenter(outputCenter, ".mainModulesMaker");
        changeUrl("submenu" + da.pertenece + "=nivel" + da.nivel);
        createRastro(rastro);
    };
    rpcNw("rpcNw", rpc, func);
}
function createMenuAndModulesHome(params) {
    var config = getConfigApp();
    if (typeof config.mostrar_chat_al_inicio != "undefined") {
        if (config.mostrar_chat_al_inicio == "SI" || config.mostrar_chat_al_inicio == true && (config.permitir_chat == "SI" || config.permitir_chat == true)) {
            openNwMakerChat();
        }
    }
    localStorage["createInfoUserLeftLocale"] = createInfoUserLeft(true);
    if (config.use_menu_of_bd === false || config.use_menu_of_bd === "NO") {
        return;
    }
    var si = getUserInfo();
    var get = getGET();
    if (config.menu_para_qxnw == "SI") {
        get = false;
    }
    if (!__loadMenu) {
        if (typeof config.menu_cache != "undefined" && config.menu_cache === true && localStorage["outputMenuLeft"] != "undefined" && localStorage["outputMenuCenter"] != "undefined") {
            if (typeof localStorage["versionIsNew"] != "undefined") {
                if (localStorage["versionIsNew"] == "false" || localStorage["versionIsNew"] == false) {
                    if (typeof config.workLocal != "undefined" && config.workLocal === true) {
                        console.log("LOAD MENÚ LOCAL STORAGE");
                    }
                    $(".salirleft_leftleft").remove();
                    $(".about_left_leftleft").remove();
                    $(".myUsersNwMakerBtn_leftleft").remove();
                    $(".usersConectedBtn_leftleft").remove();
                    if (!evalueData(get)) {
                        loadModuleCenter(localStorage["outputMenuCenter"], null, null, true);
                    }

                    loadModuleCenter(localStorage["outputMenuLeft"], ".ulMenuLeft", null, true);

                    if (typeof config.mostrar_chat_al_inicio != "undefined") {
                        if (config.mostrar_chat_al_inicio == "SI" || config.mostrar_chat_al_inicio == true) {
                            openNwMakerChat();
                        }
                    }
                    return;
                }
            }
        }
        if (isOnline() === false) {
            $(".salirleft_leftleft").remove();
            $(".about_left_leftleft").remove();
            $(".myUsersNwMakerBtn_leftleft").remove();
            $(".usersConectedBtn_leftleft").remove();
            if (!evalueData(get)) {
                loadModuleCenter(localStorage["outputMenuCenter"], null, null, true);
            }
            loadModuleCenter(localStorage["outputMenuLeft"], ".ulMenuLeft", null, true);
            return;
        }
        var da = {};
        if (typeof config.menu_para_qxnw != "undefined") {
            if (config.menu_para_qxnw === "SI" || config.menu_para_qxnw === true || config.menu_para_qxnw === "si") {
                da["menu_para_qxnw"] = true;
            }
        }
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "getDataMenuMaker";
        rpc["data"] = da;
        var func = function (r) {
            if (r == "0" || r == 0) {
                return false;
            }
            var menu_para_qxnw = false;
            if (typeof config.menu_para_qxnw != "undefined") {
                if (config.menu_para_qxnw === "SI" || config.menu_para_qxnw === true || config.menu_para_qxnw === "si") {
                    menu_para_qxnw = true;
                    $("body").append("<style>.showMenuCenter{overflow:hidden;}</style>");
                }
            }
            if (typeof config.workLocal != "undefined" && config.workLocal === true) {
                console.log("LOAD MENÚ OF BD");
            }
            var showmencen = false;
            if (!evalueData(get)) {
                showmencen = true;
            } else
            if (typeof get.action != "undefined") {
                showmencen = true;
            }
            if (typeof config.menu_para_qxnw != "undefined") {
                if (config.menu_para_qxnw === "SI" || config.menu_para_qxnw === true || config.menu_para_qxnw === "si") {
                    showmencen = true;
                }
            }
            if (showmencen === true) {
                var outputCenter = createMenuCenter(r, "center");
                if (menu_para_qxnw == true) {
                    outputCenter = r;
                }
            }
            var outputLeft = createMenuCenter(r, "left");
            if (menu_para_qxnw == true) {
                outputLeft = r;
            }
            if (showmencen === true) {
                loadModuleCenter(outputCenter, null, null, true);
            }

            var classDivSalir = "leftleft";
            var dataMyUsersConSpan = $(".usersConectedBtn_leftleft").html();
            var dataMyUsersCon = "<li class='usersConectedBtn usersConectedBtn_" + classDivSalir + "'  rastro='Usuarios Conectados' >";
            dataMyUsersCon += dataMyUsersConSpan;
            dataMyUsersCon += "</li>";

            if (si["usuario_principal"] == si["usuario"] && si["terminal"] == si["terminal_principal"]) {
                var dataMyUsersSpan = $(".myUsersNwMakerBtn_leftleft").html();
                var dataMyUsers = "<li class='execCallBack myUsersNwMakerBtn myUsersNwMakerBtn_" + classDivSalir + "' data-url='execCallBack=getMyUsersNwMaker' callBack='getMyUsersNwMaker' parameters='execFunc' rastro='Mis Usuarios' >";
                dataMyUsers += dataMyUsersSpan;
                dataMyUsers += "</li>";
            }

            var dataSalir = $(".salirleft_leftleft").html();
            $(".salirleft_leftleft").remove();
            var dataAbout = $(".about_left_leftleft").html();
            $(".about_left_leftleft").remove();

            $(".myUsersNwMakerBtn_leftleft").remove();
            $(".usersConectedBtn_leftleft").remove();

            if (evalueData(dataMyUsersConSpan)) {
                outputLeft += dataMyUsersCon;
            }
            if (evalueData(dataMyUsersSpan)) {
                outputLeft += dataMyUsers;
            }
            if (evalueData(dataAbout)) {
                outputLeft += "<li>" + dataAbout + "</li>";
            }
            if (evalueData(dataSalir)) {
                outputLeft += "<li>" + dataSalir + "</li>";
            }
            loadModuleCenter(outputLeft, ".ulMenuLeft", null, true);

            if (config["menu_vertical"] == "SI") {
                if (!isMobile()) {
                    createMenuVerticalNwMaker(outputLeft);
                }
            }

            localStorage["outputMenuLeft"] = outputLeft;
            localStorage["outputMenuCenter"] = outputCenter;

            showMenuCenter();
            __loadMenu = true;
        };
        rpcNw("rpcNw", rpc, func, __async_menu);
    } else {
        showMenuCenter();
    }
    containFileDirNum = 0;

    var createModuleH = true;
    if (verifyHash() != false) {
        createModuleH = false;
    }
    if (evalueData(get)) {
        createModuleH = false;
        if (config["permitir_cargar_moduleshome_get"] == "SI") {
            createModuleH = true;
        }
        if (typeof get["profilenw"] != "undefined") {
            createModuleH = false;
        }
    }
    if (createModuleH) {
        loadModulesHome();
    }
}

function loadModulesHome() {
    containFileDirNumModules = 0;
    /*
     $(".loadModulosCenter").empty();
     */
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "loadModuleHomeMakerNew";
    rpc["data"] = {nivel: 1};
    var func = function (r) {
        console.log(r);
        if (r == "0" || r == 0) {
            return false;
        }
        if (r) {
            for (var i = 0; i < r.length; i++) {
                var pr = r[i];
                pr["id"] = pr["modulo"];
                pr["number"] = i;
                loadModuleMaker(pr, "modulesHome");
            }
            __loadModulesHome = true;
        } else {
            nw_dialog("A ocurrido un error loadModulesHome: " + r);
        }
    };
    rpcNw("rpcNw", rpc, func, __asyncModulesHome);
}

function loadModuleMaker(pr, tipo, callback, dataCallBack) {
    var config = getConfigApp();
    var id = pr.id;
    var i = "0";
    if (typeof pr["number"] != "undefined") {
        i = pr["number"];
    }
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "loadModuleComponentMakerNew";
    rpc["data"] = {id: id};
    var func = function (r) {
        if (!verifyErrorNwMaker(r) || verifyErrorNwMaker(r) == 0) {
            return;
        }
        var rta = "";
        if (evalInput(pr['js'])) {
            rta += "<script>" + pr['js'] + "</script>";
        }
        if (evalInput(pr['css'])) {
            rta += "<style>" + pr['css'] + "</style>";
        }
        var parameters = "";
        var rta = "";
        var div = ".loadHmmm" + id;
        if (tipo == "modulesHome") {
            rta += "<div class='menuDashBoard modulesHomeDash menuDashBoard_" + pr["id"] + " menuDashBoard_ord_" + i + "' style='width: " + pr["ancho"] + "; float: " + pr["flotante"] + "' >";
            parameters = "createModulesHome";
            if (config["mostrar_primero_menu_que_modulos_home"] == "NO") {
                div = ".encData";
            }
        }
        rta += " <div class='loadModulesHome'>";
        rta += loadModuleComponentMaker(r);
        rta += "</div>";
        if (tipo == "modulesHome") {
            rta += "</div>";
        }
        loadModuleCenter(rta, div, parameters);
        if (typeof callback != "undefined") {
            if (callback != undefined) {
                if (callback != false && callback != null) {
                    callback(dataCallBack);
                }
            }
        }
    };
    rpcNw("rpcNw", rpc, func, __asyncModules);
}

containFileDirNumModules = 0;
function loadModuleComponentMaker(data) {
    var response = "";
    var total = data.length;
    var get = getGET();
    for (var i = 0; i < total; i++) {
        var r = data[i];
        var html = true;
        response += "<div class='loadModulesUnitary'>";
        response += "<div class='containFileDir containFileDir_" + containFileDirNumModules + "' >";
        if (r['html'] == null || r['html'] == "" || r['html'] == "<p>0</p>" || r['html'] == "0") {
            html = false;
        }
        if (html) {
            response += r['html'];
        }
        if (r['usar_modulo'] == "SI") {
            if (r['nwproject_modulo'] != null && r['nwproject_modulo'] != '' && r['nwproject_modulo'] != 0) {
                var rpc = {};
                rpc["service"] = "nwMaker";
                rpc["method"] = "loadInclude";
                rpc["data"] = {get: get, module_nwproject: r["nwproject_modulo"]};
                var func = function (r) {
                    if (r) {
                        response += r;
                    }
                };
                rpcNw("rpcNw", rpc, func, __asyncModulesComponents);
            }
        }
        if (r['usar__tabla_maestro'] == "SI") {
            if (r['maestro'] != null && r['maestro'] != "" && r['maestro'] != " ") {
                createMaster(r.maestro);
            }
        }
        if (r['mostrar_archivo'] == "SI") {
            var das = {};
            das.file = r.ruta_archivo;
            das.get = get;
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "loadInclude";
            rpc["data"] = das;
            var func = function (rs) {
                if (rs) {
                    response += rs;
                } else {
                    nw_dialog("A ocurrido un error, puede que no se encuentre el archivo " + r.ruta_archivo + ". Verifique con el administrador del sistema. LOG: loadModuleComponentMaker: " + rs);
                    console.log(rs);
                }
            };
            rpcNw("rpcNw", rpc, func, __asyncModulesComponents);
        }
        containFileDirNumModules++;
        response += "</div>";
        response += "</div>";
    }
    return response;
}

function createMaster(table, options) {
    return createMasterDataTableNwMaker(table, options);
}

function createMasterDataTableNwMaker(table, options) {
    var self = generateSelf();
    var dataSend = {};
    dataSend["table"] = table;
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "getColsByTableMaster";
    rpc["data"] = dataSend;
    var func = function (ra) {
        if (ra) {
            var r = ra["cols"];
            var columnas = [];
            var filters = [];
            var populates = [];
            for (var i = 0; i < r.length; i++) {
                var pr = r[i];
                /*
                 tipocampo,tabla,visible,requerido,0,el label, si es filtro
                 selectBox,ciudades,true, true,0, El label, true
                 */
                var description = false;
                var params = false;
                if (typeof pr.description !== "undefined" && pr.description !== null) {
                    description = pr.description;
                    params = description.split(",");
                }
                var columnName = pr.column_name;
                var label = columnName;
                if (typeof params[5] != "undefined") {
                    label = params[5];
                }
                var caption = columnName;
                var type = false;
                if (typeof params[0] != "undefined") {
                    type = params[0];
                }
                var filter = false;
                if (typeof params[6] != "undefined") {
                    filter = params[6];
                }
                var populate = false;
                if (typeof params[6] != "undefined") {
                    populate = params[1];
                }
                var visible = true;
                if (typeof params[2] != "undefined") {
                    getBoolean(params[2]);
                }
                if (type == "uploader") {
                    type = "image";
                }
                var addColumnas =
                        {
                            label: label,
                            caption: caption,
                            type: type,
                            visible: visible
                        };
                columnas.push(addColumnas);
                /*
                 agrega filtros
                 */
                if (typeof params[6] != "undefined") {
                    if (params[6] && filter != "false") {
                        var filtersAdd =
                                {
                                    where: params[7],
                                    order: params[8],
                                    name: caption + "_filter",
                                    label: label + "_filter",
                                    tipo: type
                                };
                        filters.push(filtersAdd);

                        if (typeof populate != "undefined") {
                            if (type === "selectBox") {
                                var addPopulates =
                                        {
                                            where: params[7],
                                            order: params[8],
                                            input: caption + "_filter",
                                            table: populate
                                        };
                                populates.push(addPopulates);
                            }
                        }
                    }
                }
            }

            var d = new createListadoMaster(table, columnas, filters, populates, ra, options);
            d.constructor();
        } else {
            nw_dialog("A ocurrido un error: " + ra);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function createListadoMaster(table, columnas, filters, populates, dataCols, options) {
    /*   remove(".tableListMakerMobil"); */
    remove(".container-pagination-nwlist");
    var classDocument = ".createListadoMaster";
    var self = createDocument(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    if (evalueData(options)) {
        if (evalueData(options["container"])) {
            self = options["container"];
        }
    }
    function constructor() {
        remove(".addHeaderNoteList");
        createList(columnas, self);
        createFilters(filters, self);
        if (populates.length > 0) {
            for (var p = 0; p < populates.length; p++) {
                var pop = populates[p];
                var input = pop["input"];
                var datas = pop["table"];
                var data = {};
                data[""] = "Seleccione";
                populateSelectFromArray(input, data);
                if (datas == "boolean") {
                    datas = "boolean";
                    populateSelectFromArray(input, {"SI": "SI", "NO": "NO"});
                } else {
                    data = {};
                    data["table"] = datas;
                    data["input"] = pop.input;
                    data["where"] = pop.where;
                    data["order"] = pop.order;
                    populateSelect(self, input, "nwprojectOut", "populate", data);
                }
                input = input.replace("_filter", "");
                $("#col_" + input).attr("populate", datas);
            }
        }
        if (evalueData(options)) {
            if (evalueData(options["setValuesFilters"])) {
                $.each(options["setValuesFilters"], function (key, value) {
                    setValue(self, key + "_filter", value.toString());
                });
            }
        }
        var update = getButtonUpdateFilter(self, "update");
        update.click(function () {
            updateContend(table);
        });
        activepagination(self, function () {
            updateContend(table);
        });
        removeColorsRows(self);
        listAddCssFor(self, ".tableListMakerMobil", {"background-color": "#ffffff"});
        listAddCssFor(self, ".colsMobil", {"background-color": "#ffffff"});
        var nuevo = createButtonListEnc(self, "Nuevo");
        nuevo.click(function () {
            newOrEditMasterNwMaker(table, columnas, filters, populates, dataCols, false, options);
        });
        updateContend(table);
    }
    function updateContend(table) {
        var service = "nwMaker";
        if (evalueData(options)) {
            if (evalueData(options["service"])) {
                service = options["service"];
            }
        }
        var method = "getDataByTableMaster";
        if (evalueData(options)) {
            if (evalueData(options["method"])) {
                method = options["method"];
            }
        }
        loading("Cargando datos...", "rgba(255, 255, 255, 0.76)!important", self);
        var dataMaster = {};
        dataMaster["table"] = table;
        dataMaster["columnas"] = dataCols;
        dataMaster["filters"] = getDataFilters(self);
        if (evalueData(options)) {
            if (evalueData(options["filter_by_user"])) {
                dataMaster["filter_by_user"] = options["filter_by_user"];
            }
            if (evalueData(options["filter_by_terminal"])) {
                dataMaster["filter_by_terminal"] = options["filter_by_terminal"];
            }
            if (evalueData(options["order"])) {
                dataMaster["order"] = options["order"];
            }
        }
        var rpc = {};
        rpc["service"] = service;
        rpc["method"] = method;
        rpc["data"] = dataMaster;
        var func = function (r) {
            $(self + " .containDataColsInt").empty();
            if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) == 0) {
                if (typeof options != "undefined") {
                    if (evalueData(options)) {
                        if (evalueData(options["callBack"])) {
                            var c = {};
                            c["self"] = self;
                            c["data"] = r;
                            options["callBack"](c);
                        }
                    }
                }
                return;
            }
            var cleanHtml = false;
            if (typeof options != "undefined") {
                if (evalueData(options)) {
                    if (evalueData(options["cleanHtml"])) {
                        cleanHtml = options["cleanHtml"];
                    }
                }
            }
            setModelData(r, self, false, false, cleanHtml);

            var editar = addButtonContextMenu(self, "Editar", "edita_master");
            editar.click(function () {
                var data = getSelectedRecord(self);
                newOrEditMasterNwMaker(table, columnas, filters, populates, dataCols, data, options);
            });
            var eliminar = addButtonContextMenu(self, "Eliminar", "elimina_master");
            eliminar.click(function () {
                var r = getSelectedRecord(self);
                var params = {};
                params.html = "¿Desea eliminar este registro?";
                params.onSave = function () {
                    var data = {};
                    data["id"] = r["id"];
                    data["table"] = table;
                    deleteRecordForId(data);
                    thisDoc.updateContend(table);
                    return true;
                };
                createDialogNw(params);
            });
            if (typeof options != "undefined") {
                if (evalueData(options)) {
                    if (evalueData(options["callBack"])) {
                        var c = {};
                        c["self"] = self;
                        c["data"] = r;
                        options["callBack"](c);
                    }
                }
            }
            removeLoading(self);
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}

function newOrEditMasterNwMaker(table, columnas, filters, populates, dataCols, ra, callBack) {
    var self = generateSelf();
    var dataSend = {};
    dataSend["table"] = table;
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "getColsByTableMaster";
    rpc["data"] = dataSend;
    var func = function (rr) {
        if (rr) {
            var r = rr["cols"];
            var fields = [];
            var selectbox = [];
            for (var i = 0; i < r.length; i++) {
                var pr = r[i];
                var description = pr["description"];
                var columnName = pr["column_name"];
                var data_type = pr["data_type"];
                var is_nullable = pr["is_nullable"];
                var params = description.split(",");
                var nombre = columnName;
                var name = columnName;
                var type = "textField";
                if (params[0] != "") {
                    type = params[0];
                }
                var mode = data_type;
                var populate = params[1];
                if (type == "selectBox") {
                    var selectboxAdd = {};
                    selectboxAdd["input"] = name;
                    selectboxAdd["param"] = populate;
                    selectbox.push(selectboxAdd);
                }
                var visible = getBoolean(params[2]);
                var required = "SI";
                if (is_nullable == "SI" || is_nullable == "YES" || is_nullable == true) {
                    required = "NO";
                }
                if (name == "id") {
                    required = "NO";
                }
                if (!visible) {
                    required = "NO";
                }
                if (typeof params[3] != "undefined") {
                    if (params[3] == "true" || params[3] == true) {
                        required = "SI";
                    }
                }
                var fieldsAdd =
                        {
                            tipo: type,
                            mode: mode,
                            nombre: nombre,
                            name: name,
                            requerido: required,
                            visible: visible
                        };
                fields.push(fieldsAdd);
            }
            var typeForm = "popup";
            if (isMobile()) {
                typeForm = "slider";
            }
            createNwForms(self, fields, typeForm);
            var data = {};
            data[""] = "Seleccione";
            for (var a = 0; a < selectbox.length; a++) {
                populateSelectFromArray(selectbox[a]["input"], data);
            }
            for (var a = 0; a < selectbox.length; a++) {
                var h = selectbox[a];
                if (evalueData(h["param"])) {
                    if (h["param"] == "boolean") {
                        populateSelectFromArray(h["input"], {"SI": "SI", "NO": "NO"});
                    } else {
                        data = {};
                        data["table"] = h["param"];
                        populateSelect(self, h["input"], "nwprojectOut", "populate", data);
                    }
                }
            }
            var numberCols = 2;
            if (evalueData(callBack)) {
                if (evalueData(callBack["optionsForm"])) {
                    if (evalueData(callBack["optionsForm"]["numberCols"])) {
                        var numberCols = callBack["optionsForm"]["numberCols"];
                    }
                }
            }
            setColumnsFormNumber(self, numberCols);
            if (evalueData(ra)) {
                setRecord(self, ra);
            }
            var accept = addButtonNwForm("Guardar", self);
            accept.click(function () {
                if (!validateRequired(self)) {
                    return;
                }
                loading("Guardando...", "rgba(255, 255, 255, 0.76)!important", self);
                var data = getRecordNwForm(self);
                var x = {};
                x["data"] = data;
                x["cols"] = r;
                x["table"] = table;
                var rpc = {};
                rpc["service"] = "nwMaker";
                rpc["method"] = "insertOrUpdateMasterNwMaker";
                rpc["data"] = x;
                var func = function (r) {
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    reject(self, typeForm, "form");
                    var d = new createListadoMaster(table, columnas, filters, populates, dataCols, callBack);
                    d.updateContend(table);
                    removeLoading(self);
                };
                rpcNw("rpcNw", rpc, func, true);
            });
            if (!isMobile()) {
                var cancel = addButtonNwForm("Cancelar", self);
                cancel.click(function () {
                    reject(self, typeForm, "form");
                });
            }
            removeLoadingNw();
        } else {
            nw_dialog("A ocurrido un error: " + rr);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}



function createMenuCenter(array, tipo) {
    var rta = "";
    if (tipo == "center") {
        rta = "<div class='menuDashBoard'>";
    }
    if (evalueData(array)) {
        var total = array.length;
        for (var i = 0; i < total; i++) {
            var r = array[i];
            r.tipo = tipo;
            rta += htmlLinkMenuMaker(r);
        }
    }
    if (tipo == "center") {
        rta += "</div>";
    }
    return rta;
}

function executeCallBack(callBack) {
    callBack;
}

function changeUrl(url) {
    var datas = url;
    var pathname = location.pathname;
    var revp = "";
    if (evalueData(datas)) {
        revp = datas.split("?");
    }

    if (revp.length >= 2) {
        datas = url;
    } else
    if (datas == "#") {
        datas = "";
    } else {
        datas = "#" + datas;
    }
    var url = pathname + datas;
    var title = "Title: " + datas;
    var obj = datas;
    var obj = window.location.href;

    var t = !!(window.history && history.pushState);
    if (t === true) {
        window.history.pushState(obj, title, url);
    }
}

function setConfigApp(df) {
    __configApp = df;
}

function getConfiguration(callBack) {
    if (evalueData(callBack)) {
        callBack();
    }
}

function workingLocale() {
    var config = getConfigApp();
    if (typeof config.workLocal != "undefined") {
        if (config.workLocal === true || config.workLocal === "true" || config.workLocal === "SI") {
            return true;
        }
    }
    return false;
}

function applyDesignGralConfig() {
    var up = getUserInfo();
    var v = nwm.getInfoApp();
    var config = getConfigApp();
    var menuLeft = "";
    if (isOnline() === false) {
        menuLeft = localStorage["outputMenuUserLeft"];
    } else {
        menuLeft = createInfoUserLeft();
    }
    if (isOnline() === true) {
        localStorage["outputMenuUserLeft"] = menuLeft;
    }

    if (isOnline() === false) {
        $(".container_left_gral").append(menuLeft);
        loadCssOculto();
    } else {
        if (workingLocale() === true) {
            if (config["url_javascript_principal"] != null && config["url_javascript_principal"] != "" && config["url_javascript_principal"] != "0") {
                loadJs(config.url_javascript_principal, function () {
                    $(".container_left_gral").append(menuLeft);
                    loadCssOculto();
                }, false, __asyncJsPrincipalConfig);
            } else {
                $(".container_left_gral").append(menuLeft);
                loadCssOculto();
            }
        } else {
            $(".container_left_gral").append(menuLeft);
            loadCssOculto();
            newRemoveLoading("body");
        }
    }
    if (isMobile()) {
        loadCssButtonsMobile(config["tipo_menu_mobile"]);
    } else {
        if (typeof localStorage["hiddenShowLeftMenu"] != "undefined") {
            if (localStorage["hiddenShowLeftMenu"] == "true") {
                hiddenShowMenuLeft("hidden");
            } else {
                hiddenShowMenuLeft("show");
            }
        }
    }
}

function loadCssOculto() {
    var r = getConfigApp();
    if (r.codigo_css != null) {
        r.codigo_css = r.codigo_css.replace(/\[/g, "{");
        r.codigo_css = r.codigo_css.replace(/\]/gi, "}");
        $("body").append("<style>" + r.codigo_css + "</style>");
    }
    if (r.codigo_libre != null) {
        $("body").append(r.codigo_libre);
    }
    if (isMobile()) {
        if (evalueData(r.logotipo_movil)) {
            $(".logotipoMain").css({"background-image": "url(" + r.logotipo_movil + ")"});
        } else
        if (evalueData(r.logotipo)) {
            $(".logotipoMain").css({"background-image": "url(" + r.logotipo + ")"});
        }
    } else {
        if (evalueData(r.logotipo)) {
            var existe = ImageExist(r.logotipo);
            if (existe) {
                $(".logotipoMain").css({"background-image": "url(" + r.logotipo + ")"});
            } else {
                $(".logotipoMain").css({"background-image": "url(/app/nwchat/img/logor1.png)"});
            }
        } else {
            var existe = ImageExist("/app/nwchat/img/logor1.png");
            if (existe) {
                $(".logotipoMain").css({"background-image": "url(/app/nwchat/img/logor1.png)"});
            }
        }
    }
}

function ImageExist(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function createInfoUserLeft(show) {
    var si = getUserInfo();
    var config = getConfigApp();
    var dataUserLeft = "";
    var classDiv = "";
    var classDivSalir = "leftleft";
    var get = false;

    var loadMultiTerm = false;
    if (config["multi_terminal"] == "SI") {
        loadMultiTerm = true;
    }

    if (config["mostrar_info_user_left"] != "NO") {
        get = true;
    }
    if (show) {
        get = true;
        classDiv = " infoUserFloatEnc";
        classDivSalir = "";
    }
    var foto = "";
    var wfoto = "450";
    if (isMobile()) {
        wfoto = "150";
    }
    if (si["foto"] != null && si["foto"] != "") {
        if (si["foto"].indexOf("platform-lookaside.fbsbx.com") !== -1) {
            foto = "style='background-image: url(" + si["foto"] + ")' ";
        } else {
            foto = "style='background-image: url(/nwlib6/includes/phpthumb/phpThumb.php?src=" + si["foto"] + "&w=" + wfoto + "&f=jpg)' ";
        }
    }
    if (typeof si["foto_perfil"] !== "undefined") {
        if (si["foto_perfil"] != null && si["foto_perfil"] != "") {
            if (si["foto_perfil"].indexOf("platform-lookaside.fbsbx.com") !== -1) {
                foto = "style='background-image: url(" + si["foto_perfil"] + ")' ";
            } else {
                foto = "style='background-image: url(/nwlib6/includes/phpthumb/phpThumb.php?src=" + si["foto_perfil"] + "&w=" + wfoto + "&f=jpg)' ";
            }
        }
    }
    if (get) {
        var showf = true;
        if (config.no_mostrar_foto_name_email_left == "NO") {
            showf = false;
        }
        if (show == true) {
            showf = true;
        }
        if (showf) {
            dataUserLeft = "<div class='containerInfoEnc " + classDiv + "'>";

            var displaynotyoff = "style='display:none;'";
            var displaynotyon = "style='display:none;'";
            if (config.use_inactive_notify === true || config.use_inactive_notify === "SI") {
                if (typeof localStorage["notificationsnwmakeroffon"] !== "undefined") {
                    if (localStorage["notificationsnwmakeroffon"] === "false") {
                        displaynotyon = " style='display:block;' ";
                        displaynotyoff = " style='display:none;' ";
                    } else {
                        displaynotyon = " style='display:none;' ";
                        displaynotyoff = " style='display:block;' ";
                    }
                } else {
                    displaynotyon = " style='display:none;' ";
                    displaynotyoff = " style='display:block;' ";
                }
            }
            var displaySouon = "style='display:none;'";
            var displaySouoff = "style='display:none;'";
            if (config.use_inactive_sound === true || config.use_inactive_sound === "SI") {
                if (typeof localStorage["playSoundsMaker"] !== "undefined") {
                    if (localStorage["playSoundsMaker"] === "false") {
                        displaySouon = " style='display:none;' ";
                        displaySouoff = " style='display:block;' ";
                    } else {
                        displaySouon = " style='display:block;' ";
                        displaySouoff = " style='display:none;' ";
                    }
                } else {
                    displaySouon = " style='display:block;' ";
                    displaySouoff = " style='display:none;' ";
                }
            }
            dataUserLeft += "<div class='containbuttonsencactions'>";
            if (!isMobile() && config.menu_movil_en_pc === "SI") {
                dataUserLeft += " <div class='btnnotifyacin hiddenShowLeftMenu hiddenLeftMenu'><i class='material-icons'>keyboard_arrow_left</i></div>";
                dataUserLeft += " <div class='btnnotifyacin hiddenShowLeftMenu showLeftMenu'><i class='material-icons'>keyboard_arrow_right</i></div>";
            }
            dataUserLeft += " <div " + displaynotyon + " class='btnnotifyacin activeIncNotify'><i class='material-icons'>notifications_off</i></div>";
            dataUserLeft += " <div " + displaynotyoff + " class='btnnotifyacin inactiveIncNotify'><i class='material-icons'>notifications_active</i></div>";
            dataUserLeft += " <div " + displaySouon + "  class='btnnotifyacin activinSoundMaker'><i class='material-icons'>volume_up</i></div>";
            dataUserLeft += " <div " + displaySouoff + "  class='btnnotifyacin inactivinSoundMaker'><i class='material-icons'>volume_off</i></div>";
            dataUserLeft += "</div>";

            dataUserLeft += "<div class='separatorsLeft separatorsLeftUser separator_static'>";
            dataUserLeft += "   <div class='imgUser' " + foto + ">";
            if (!evalueData(foto)) {
                dataUserLeft += "   <i class='material-icons'>person</i>";
            }
            dataUserLeft += "   </div>";
            if (typeof si.nombre != "undefined") {
                dataUserLeft += "   <div class='openProfileNwUser' ><span class='userIcon'></span><span class='userIconName'>" + si.nombre;
                if (typeof si.apellido !== "undefined") {
                    dataUserLeft += " " + si.apellido;
                }
                dataUserLeft += "</span>";
                dataUserLeft += "   <br /><span class='userIcon userIconUser'></span><span class='userIconUser'>" + si.usuario + "</span></div>";
            }
            if (typeof si.id_usuario == "undefined") {
                dataUserLeft += "   <div class='buttonEncmak buttonInitSessNwm' >Iniciar sesión</div>";
                dataUserLeft += "   <div class='buttonEncmak buttonCreateSessNwm' >Crear cuenta</div>";
            }
            dataUserLeft += "</div>";
        }
        dataUserLeft += "  <div class='menuMain separatorsLeft separatorsLeftMenuUserEnc  separator_static'>";
        dataUserLeft += "      <ul>";
        if (typeof si.id_usuario != "undefined") {
            dataUserLeft += "          <li class='execCallBack callBackHome' data-url='#' callBack='createMenuAndModulesHome' parameters='execFunc' type='homenwMaker' >";
            dataUserLeft += "              <span class=' icon_menu_li icon_menu_li_home'></span><span class='name_menu_li name_menu_li_gral name_menu_li_home' >" + str("Inicio") + "</span>";
            dataUserLeft += "          </li>";
            dataUserLeft += "          <li class='execCallBack configurationNwMaker' data-url='execCallBack=configurationNwMaker' callBack='configurationNwMaker' parameters='execFunc' type='configurationNwMaker'  rastro='Config' >";
            dataUserLeft += "              <span class=' icon_menu_li icon_menu_li_configurationNwMaker'></span><span class='name_menu_li name_menu_li_gral name_menu_li_configurationNwMaker' >" + str("Mi cuenta") + "</span>";
            dataUserLeft += "          </li>";
            if (config.permitir_buscar_personas_invitaciones === true || config.permitir_buscar_personas_invitaciones === "SI") {
                dataUserLeft += "          <li class='execCallBack myUsersCompartidosNwMakerBtn myUsersCompartidosNwMakerBtn_" + classDivSalir + "' data-url='execCallBack=myUsersCompartidosNwMaker' callBack='misUsuariosCompartidos' parameters='execFunc' rastro='Usuarios Invitados' >";
                dataUserLeft += "              <span class=' icon_menu_li icon_menu_li_usersCompartidosConected'></span><span class='name_menu_li name_menu_li_gral name_menu_li_usersCompartidosConected' >" + str("Buscar personas e invitaciones") + "</span>";
                dataUserLeft += "          </li>";
            }

            if (loadMultiTerm) {
                dataUserLeft += "          <li class='execCallBack changeTerminalMakerBtn' data-url='execCallBack=SwitchTerminal' callBack='SwitchTerminal' parameters='execFunc' rastro='Cambiar Terminal' >";
                dataUserLeft += "              <span class=' icon_menu_li icon_menu_li_usersConected'></span><span class='name_menu_li name_menu_li_gral name_menu_li_usersConected' >" + str("Cambiar Terminal") + "</span>";
                dataUserLeft += "          </li>";
            }
            if (config.permitir_chat === true || config.permitir_chat === "SI") {
                dataUserLeft += "          <li class='usersConectedBtn usersConectedBtn_" + classDivSalir + "' >";
                dataUserLeft += "              <span class=' icon_menu_li icon_menu_li_usersConected'></span><span class='name_menu_li name_menu_li_gral name_menu_li_usersConected' >" + str("Chat") + "</span>";
                dataUserLeft += "          </li>";
            }
            dataUserLeft += "          <li class='salirleft salirleft_" + classDivSalir + "'>";
            dataUserLeft += "              <div class='close_session' >";
            dataUserLeft += "              <span class=' icon_menu_li icon_menu_li_exit'></span><span class='name_menu_li name_menu_li_gral name_menu_li_exit' >" + str("Salir") + "</span>";
            dataUserLeft += "              </div>";
            dataUserLeft += "          </li>";
            dataUserLeft += "          <li class='userStatusNwMakerBtn' >";
            var selected_conectado = "";
            var selected_ausente = "";
            var selected_ocupado = "";
            var selected_desconectado = "";
            if (si.estado_conexion === "conectado") {
                selected_conectado = "selected=selected";
            }
            if (si.estado_conexion === "ausente") {
                selected_ausente = "selected=selected";
            }
            if (si.estado_conexion === "ausente") {
                selected_ausente = "selected=selected";
            }
            if (si.estado_conexion === "ocupado") {
                selected_ocupado = "selected=selected";
            }
            if (si.estado_conexion === "desconectado") {
                selected_desconectado = "selected=selected";
            }
            dataUserLeft += "          <select class='selectBoxStatusNwUser' >";
            dataUserLeft += "          <option " + selected_conectado + " value='conectado' ><span style='background-color: rgb(20, 239, 20)'></span>" + str("Conectado") + "</option>";
            dataUserLeft += "          <option " + selected_ausente + " value='ausente' >" + str("Ausente") + "</option>";
            dataUserLeft += "          <option " + selected_ocupado + " value='ocupado' >" + str("Ocupado") + "</option>";
            dataUserLeft += "          <option " + selected_desconectado + " value='desconectado' >" + str("Desconectado") + "</option>";
            dataUserLeft += "          </select>";
            dataUserLeft += "          </li>";
        }
        dataUserLeft += "      </ul>";
        if (showf) {
            dataUserLeft += " </div>";
        }
        dataUserLeft += "  </div>";
    }
    return dataUserLeft;
}

function validaUserDeveloperNwMaker() {
    var si = getUserInfo();
    if (si.usuario === "alexf" || si.usuario === "alexf@netwoods.net" || si.usuario === "orionjafe@hotmail.com" || si.usuario === "orionjafe@gmail.com" || si.usuario === "direccion@netwoods.net" || si.usuario === "andresf" || si.usuario === "francyp@netwoods.net" || si.usuario === "ladyg@netwoods.net" || si.usuario === "ladyg" || si.usuario === "jasond@gruponw.com" || si.usuario === "sarac@gruponw.com" || si.usuario === "sarac") {
        return true;
    }
    return false;
}

function perfilUserNwMaker(user) {
    var config = getConfigApp();
    if (config.profile_template === "2019") {
        loadJs("/nwlib6/nwproject/modules/nw_user_session/js/forms/f_perfil_user_2019.js");
        var d = new f_perfil_user_2019(user);
        d.constructor();
    } else {
        loadJs("/nwlib6/nwproject/modules/nw_user_session/js/forms/f_perfil_user_nwmaker.js");
        var d = new f_perfil_user_nwmaker(user);
        d.constructor();
    }
    if (typeof modifyPerfilNw != "undefined") {
        modifyPerfilNw();
    }
}

function showTerminosCondicionesNwMaker() {
    if (isOnline() === true) {
        loadJs("/nwlib6/nwproject/modules/nw_user_session/js/forms/f_showTerminosCondicionesNwMaker.js", function () {
            var d = new f_showTerminosCondicionesNwMaker();
            d.constructor();
        }, false, true);
    }
}

function loadAjaxProfileUserNw(user) {

    scrollPage("container-nwmaker", 500, 0, false);

    hiddenUser();
    hiddenMenuCenter();
    removeAllDialog();
    hideMenuMovilNwMaker();
    hiddenUser();

    $(".loadModulosCenter").empty();
    $(".loadModulosCenter").removeClass("loadModulosCenterShow");
    $(".loadMenuModules").removeClass("loadModulosCenterShow");
    $(".loadModulosCenter").addClass("loadModulosCenterShow");
    empty(".loadModulosCenter");

    addHash("?profilenw=" + user);
    var up = getUserInfo();
    if (typeof user == "undefined") {
        user = up["usuario"];
    }
    if (user == "execFunc") {
        user = up["usuario"];
    }
    perfilUserNwMaker(user);
}

function usersConected() {
    var d = new createUsersConected();
    d.constructor();
}

function myUsersEtiquetar(top, left, self) {
    loadJs("/nwlib6/nwproject/modules/nw_user_session/js/lists/l_users_for_etiqueta.js", function () {
        var d = new l_users_for_etiqueta(top, left, self);
        d.constructor();
    }, false, true);
}

function activeNwDrive() {
    loadJs("/nwlib6/nwproject/modules/nwdrive/lists/l_files.js");
    loadJs("/nwlib6/nwproject/modules/nwdrive/forms/f_files.js");
    var d = new l_files();
    d.constructor();
}

function examplesNwMaker(self) {
    addHash("/#execCallBack=examplesNwMaker");
    loadJs("/nwlib6/nwproject/modules/examplesNwMaker/lists/l_main.js");
    loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_form.js");
    var d = new l_main(self);
    d.constructor();
}
function loadConfiguracionNwMaker() {
    var a = {};
    a.callBack = "configurationNwMaker";
    a.datas = "execCallBack=configurationNwMaker";
    a.execFunBefore = true;
    a.parameters = "execFunc";
    a.rastro = "Config";
    a.type = "configurationNwMaker";
    loadExecCallBack(a);
}
function configurationNwMaker() {
    loadJs("/nwlib6/nwproject/modules/nw_user_session/js/forms/f_configuration_nwmaker.js", function () {
        var d = new f_configuration_nwmaker();
        d.constructor();
    }, false, true);
}

function nwMakerAdmin(self) {
    loadJs("/nwlib6/nwproject/modules/nw_user_session/js/lists/nwmaker_admin/l_nwmaker_admin_main.js");
    loadJs("/nwlib6/nwproject/modules/examplesNwMaker/forms/f_example_form.js");
    var d = new l_nwmaker_admin_main(self);
    d.constructor();
}

function loadInfoNotifications(type) {
    var up = getUserInfo();
    if (!evalueData(up.usuario)) {
        return false;
    }
    $(".containInfoNotifications").fadeOut(0);
    $(".containCloseNotifyMobile").fadeOut(0);
    if (isMobile()) {
        $(".containCloseNotifyMobile").fadeIn(0);
    }
    if (type === "user") {
        if (__loadEncDataUserNwMaker === true) {
            $(".containInfoNotificationsUser").fadeIn(0);
            return;
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
        var ht = "";
        ht += "<div class='containInfoNotifications containInfoNotificationsUser'>";

        ht += "<div class='separatos_enc separator_enc_user'>";
        ht += "<div class='bloqs_enc_us photo_enc_user' " + foto_enc + ">";
        if (!evalueData(foto_enc)) {
            ht += "<i class='material-icons'>person</i>";
        }
        ht += "</div>";
        ht += "<div class='bloqs_enc_us datas_enc_user'>";
        ht += "<div class='bloqs_enc_us name_enc_user'>" + up.nombre + "</div>";
        ht += "<div class='bloqs_enc_us email_enc_user'>" + up.email + "</div>";
        ht += "</div>";
        ht += "</div>";

        ht += "<div class='separatos_enc separatos_link_account execCallBack' data-url='execCallBack=configurationNwMaker' callback='configurationNwMaker' parameters='execFunc' type='configurationNwMaker' rastro='Config' >";
        ht += "<div class='bloqs_enc_us photo_enc_user iconlink_enc_user'>";
        ht += "<i class='material-icons'>account_circle</i>";
        ht += "</div>";
        ht += "<div class='bloqs_enc_us datas_enc_user'>";
        ht += "<div class='bloqs_enc_us'>Mi cuenta</div>";
        ht += "</div>";
        ht += "</div>";

        ht += "<div class='separatos_enc separatos_link_chatintern'>";
        ht += "<div class='bloqs_enc_us photo_enc_user iconlink_enc_user'>";
        ht += "<i class='material-icons'>chat</i>";
        ht += "</div>";
        ht += "<div class='bloqs_enc_us datas_enc_user'>";
        ht += "<div class='bloqs_enc_us'>Chat interno</div>";
        ht += "</div>";
        ht += "</div>";

        ht += "<div class='separatos_enc separatos_link_exit'>";
        ht += "<div class='bloqs_enc_us photo_enc_user iconlink_enc_user'>";
        ht += "<i class='material-icons'>exit_to_app</i>";
        ht += "</div>";
        ht += "<div class='bloqs_enc_us datas_enc_user'>";
        ht += "<div class='bloqs_enc_us'>Salir</div>";
        ht += "</div>";
        ht += "</div>";

        ht += "</div>";
        $(".userMobile").append(ht);
        $(".containInfoNotificationsUser").fadeIn(0);
        __loadEncDataUserNwMaker = true;
    } else
    if (type === "chat") {
        leerNotifications({"tipo": "chat"});

        $(".globoEncChat").fadeOut(0);
        $(".globoRojoNotificaChat").text("");

        if (__loadNotificacionsChatNwMaker === true) {
            $(".containInfoNotificationsChat").fadeIn(0);
            remove(".containInfoNotifications");
            /*
             return;
             */
        }
        $(".chatMobile").append("<div class='containInfoNotifications containInfoNotificationsChat' id='containInfoNotifications'><span class='notifications_none_enc notifications_none_enc_chat'>No tiene mensajes<i class='material-icons back_icon notifynone'>chat_bubble_outline</i></span></div>");
        $(".containInfoNotificationsChat").fadeIn(0);
        newLoading(".containInfoNotificationsChat", "", "position:relative;", "append");
        getAndConstructorInitialNotifyMaker(type, function (r) {
            if (r.length > 0) {
                for (var i = 0; i < r.length; i++) {
                    var ra = r[i];
                    var msg = bodyNotificacionEnc(ra);
                    $(".containInfoNotificationsChat").append(msg);
                }
            }
        });
        __loadNotificacionsChatNwMaker = true;
    } else {

        if (__loadNotificacionsNwMaker === true) {
            $(".containInfoNotificationsNotify").fadeIn(0);
            remove(".containInfoNotifications");
            /*
             return;
             */
        }
        $(".notificationMobile").append("<div class='containInfoNotifications containInfoNotificationsNotify' id='containInfoNotifications'><span class='notifications_none_enc notifications_none_enc_notification'>Sin notificaciones<i class='material-icons back_icon notifynone'>notifications_none</i></span></div>");
        $(".containInfoNotificationsNotify").fadeIn(0);
        newLoading(".containInfoNotificationsNotify", "", "position:relative;", "append");
        getAndConstructorInitialNotifyMaker(type, function (r) {
            if (r.length > 0) {
                var ids = [];
                for (var i = 0; i < r.length; i++) {
                    var ra = r[i];
                    if (ra.notificado !== "SI" && !evalueData(ra.callback)) {
                        ids.push(ra.id);
                    }
                    var msg = bodyNotificacionEnc(ra);
                    $(".containInfoNotificationsNotify").append(msg);
                }
                /*
                 readNotifyByIDS(ids);
                 */
            }

            $(".globoEncNotify").fadeOut(0);
            $(".globoRojoNotificaNotify").text("");
            leerNotifications({"tipo_diferent": "chat"});

        });
        __loadNotificacionsNwMaker = true;
    }
    if (isMobile()) {
        var h = "<div class='containCloseNotifyMobile'><i class='material-icons closeNotMob'>close</i></div>";
        $(".encMenuMobile").append(h);
    }
}

function getAndConstructorInitialNotifyMaker(type, callBack) {
    var data = {};
    data.tipo = type;
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "getNotificaciones";
    rpc["data"] = data;
    var func = function (r) {
        newRemoveLoading(".containInfoNotificationsChat");
        newRemoveLoading(".containInfoNotificationsNotify");
        if (r === 0 || r.length === 0) {
            $(".notifications_none_enc_" + type).css({"display": "block"});
        }
        if (!verifyErrorNwMaker(r)) {
            return false;
        }
        callBack(r);
    };
    rpcNw("rpcNw", rpc, func, true);
}

function leerNotifications(d) {
    var data = {};
    if (evalueData(d.tipo)) {
        data.tipo = d.tipo;
    }
    if (evalueData(d.tipo_diferent)) {
        data.tipo_diferent = d.tipo_diferent;
    }
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "leerNotificaciones";
    rpc["data"] = data;
    var func = function (r) {
        if (r != true) {
            nw_dialog("A ocurrido un error: " + r);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function notificaNotifications(id) {
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "notificaNotifications";
    rpc["data"] = {id: id};
    var func = function (r) {
        if (r != true) {
            nw_dialog("A ocurrido un error: " + r);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function leerNotificationById(id) {
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "leerNotificacionesById";
    rpc["data"] = {id: id};
    var func = function (r) {
        if (r != true) {
            nw_dialog("A ocurrido un error: " + r);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function hiddenNotifications() {
    $(".containInfoNotifications").fadeOut(0);
    $(".containCloseNotifyMobile").fadeOut(0);
    $(".globoRojoNotifica").remove();
    $(".bgUserEncShow").remove();
}

function hiddenUser() {
    $(".containInfoAccountEnc").remove();
    $(".bgUserEncShow").remove();
}

function activeMenuMovilNwMaker() {
    (function () {
        $('body').delegate('.showmenmovilNwmaker', 'click', function () {
            showMenuMovilNwMaker();
        });
    })();
    (function () {
        $('body').delegate('.hidemenmovilNwmaker', 'click', function () {
            hideMenuMovilNwMaker();
        });
    })();
}

function showMenuMovilNwMaker() {
    $(".containerHomeUser").append("<div class='bgShowMenuLeft'></div>");
    $(".containerLeft").addClass("menu_inside_movshowNwMaker");
    $("body").css({"overflow": "hidden"});

    $(window).on("touchstart", function (ev) {
        var e = ev.originalEvent;
        var div = e.touches["0"]["target"];
        var classDetected = $(div).attr("class");
        if (classDetected == "bgShowMenuLeft") {
            hideMenuMovilNwMaker();
        }
    });

}
function hideMenuMovilNwMaker() {
    $(".bgShowMenuLeft").remove();
    $(".containerLeft").removeClass("menu_inside_movshowNwMaker");
    $("body").css({"overflow": "auto"});
}
function selectedMenuLeft(id) {
    if (evalueData(id)) {
        $(".linkleft").removeClass("selectedMenuLeft");
        $(".linkleftcallback_" + id).addClass("selectedMenuLeft");
    }
}

function verifyHash() {
    var URLactual = window.location;
    var hash = URLactual.hash;
    if (hash == "") {
        return false;
    }
    return hash;
}
function getFuncHash() {
    var response = false;
    var hash = verifyHash();
    if (hash != "" && hash != undefined) {
        hiddenMenuCenter();
        removeAllDialog();
        hiddenUser();
        hideMenuMovilNwMaker();
        empty(".loadModulosCenter");
        var hashSplit = hash.split("=");
        if (hashSplit.length > 1) {
            if (hashSplit[0] == "#callback") {
                activeBtnExecNw(hashSplit[1]);
                var num = hashSplit[1].split("&");
                response = true;
                loadFunction("menuModuleCallBack", ".midivtest", num[0]);
            } else
            if (hashSplit[0] == "#execCallBack") {
                response = true;
                loadFunction(hashSplit[1], ".midivtest", "execFunc");
            } else
            if (hashSplit[0].indexOf("#submenu") != -1) {
                response = true;
                hiddenMenuCenter();
                removeAllDialog();
                hiddenUser();
                hideMenuMovilNwMaker();
                var params = {
                    nivel: hashSplit[1].replace("nivel", ""),
                    pertenece: hashSplit[0].replace("#submenu", "")
                };
                loadMenuNivel(params);
            }
        }
    }
    return response;
}

function removeAllDialog() {
    $(".ui-dialog").empty();
    $(".ui-dialog").remove();
    $(".ui-widget-overlay").remove();
}

function loadFunction(func, div, parameters, type, rastro, callback, dataCallBack) {
    __isInHomeNwMaker = false;
    hiddenMenuCenter();
    removeAllDialog();
    hiddenUser();
    hideMenuMovilNwMaker();

    var get = getGET();
    setTimeout(function () {
        var dataSend = {};
        dataSend["action"] = func;
        dataSend["parameters"] = parameters;
        dataSend["get"] = get;
        dataSend["id"] = parameters;
        if (parameters == "execFunc") {
            loadModuleCenter(func, "containerExecFunc", parameters, "execFunc", type, rastro);
            return;
        }
        /*consulta los  módulos*/
        if (__pruebasNwMaker) {
            if (func == "menuModuleCallBack") {
                type = "menuModuleCallBack";
                loadModuleMaker(dataSend, false, callback, dataCallBack);
                return;
            }
        }
        if (func == "makeNwForm") {
            type = "makeNwForm";
        }
        $.ajax({url: '/nwlib6/nwproject/modules/nw_user_session/src/scripts.php',
            data: dataSend,
            type: 'post',
            async: true,
            error: function () {
                loadModuleCenter("", div, parameters, false, type);
            },
            success: function (output) {
                loadModuleCenter(output, div, parameters, true, type, rastro);
            }
        });
    }, 100);
}

function loadModuleCenter(output, div, parameters, status, type, rastro) {
    hiddenMenuCenter();
    removeAllDialog();
    hiddenUser();
    hideMenuMovilNwMaker();
    $(".loadModulosCenter").removeClass("loadModulosCenterShow");
    $(".loadMenuModules").removeClass("loadModulosCenterShow");

    var ident = parameters;
    $(div).removeClass("loadModulosCenterShow");
    if (status == false) {
        console.log("La operación no pudo ser procesada. Inténtelo de nuevo.");
        if (div == undefined || div == "" || div == false || div == null) {
            $(".loadMenuModules").empty();
            $(".loadMenuModules").append(localStorage["nwUsMenu"]);
        } else {
            $(".loadModulosCenter").empty();
            $(".loadModulosCenter").append(localStorage["nwUsMenuDiv" + ident]);
            $(div).html(localStorage["nwUsMenuModule" + ident]);
        }
        removeLoadingNw();
        return false;
    }
    var tipomodule = "";
    /*si es menú hace esto*/
    if (!evalueData(div)) {
        $(".loadMenuModules").empty();
        $(".loadMenuModules").append(output);
        localStorage["nwUsMenu"] = output;
    }
    /*si es un módulo del centro o componente o función hace esto*/
    else {
        var divContend = false;
        if (div != undefined && div != "" && div != false && div != null && div != ".ulMenuLeft") {
            divContend = true;
        }
        if (divContend === true) {
            tipomodule = "loadModulosCenter";
            if (status != "execFunc") {
                /*reviso que el div no exista*/
                if ($(div).length == 0) {
                    /*remuevo el div*/
                    $(div).remove();
                    /*busco armar el div de nuevo, si es ID(#) o CLASE(.)*/
                    var idenSplit = div.split("#");
                    var iden = "id";
                    if (idenSplit == div) {
                        iden = "class";
                    }
                    var namediv = div.replace(".", "");
                    namediv = namediv.replace("#", "");
                    /*vacío el div contenedor*/
                    /*creo el div en html*/
                    var html = "<div " + iden + "='" + namediv + " vidModuleMake' ></div>";
                    /*lo agrego*/
                    $(".loadModulosCenter").append(html);
                    /*
                     localStorage["nwUsMenuDiv" + ident] = html;
                     */
                }
            }
        }
        if (status == "execFunc") {
            /*creo el div que almacena un listado o form */
            createContainer("master", "<div class='loadModulesUnitary'><div class='containFileDir containFileDir_" + containFileDirNum + "' ></div></div>");
            /*ejecuto la función*/
            if (evalueData(output)) {
                if (typeof output === "string") {
                    window[output](parameters);
                } else {
                    output(parameters);
                }
            }
        } else {
            $(div).html(output);
        }
        localStorage["nwUsMenuModule" + ident] = output;
    }
    scrollPage("contenedor", 0);
    if (type != "homenwMaker") {
        if (divContend) {
            if (parameters != "createModulesHome") {
                createRastro(rastro);
                if (status != "execFunc") {
                    $(".modulesHomeDash").remove();
                }
            }
            if (parameters == "createModulesHome") {
                showMenuCenter();
            }
            if (tipomodule == "loadModulosCenter") {
                $(".loadModulosCenter").addClass("loadModulosCenterShow");
            } else {
                $(".loadMenuModules").addClass("loadModulosCenterShow");
            }
        }
    } else {
        cleanRastro();
    }
    if (type == "makeNwForm") {
        $(".midivtest").fadeOut(0);
        $(".mainModulesMaker").fadeOut(0);
        setRecordMaster();
    }
    if (status != "execFunc" && type != "makeNwForm") {
        selectedMenuLeft(parameters);
    }
    removeLoadingNw();
}

function addTitle(self, text) {
    var html = "";
    html += "<span class='textRastroAdd'>";
    html += text;
    html += "</span>";
    $(".rastroModulesMaker").append(html);
}

function createRastro(rastro) {
    cleanRastro();
    $(".encMenuMobile").addClass("encMenuMobileChange");
    if (isMobile()) {
        $(".homeMobile").addClass("nodisplayenc");
        $(".userMobile").addClass("nodisplayenc");
        $(".logotipoMain").addClass("nodisplayenc");
    }
    $(".menMovilButtonNwm").addClass("displayMenuLeftInRastro");
    var html = "";
    html += "<div class='rastroModulesMaker' >";
    html += "<span class='span_rastro_back execCallBack' data-url='#' callBack='createMenuAndModulesHome' parameters='execFunc' type='homenwMaker'>";
    html += "<-";
    html += "</span>";
    /*
     html += "<span class='span_rastro execCallBack rastroInicio' data-url='#' callBack='createMenuAndModulesHome' parameters='execFunc' type='homenwMaker'>";
     html += "Inicio";
     html += "</span>";
     */
    if (evalueData(rastro)) {
        html += "<span class='textRastroAdd'>";
        html += rastro;
        html += "</span>";
    }
    html += "</div>";
    $(".logotipoMain").after(html);
}
function cleanRastro() {
    $(".encMenuMobile").removeClass("encMenuMobileChange");
    if (isMobile()) {
        $(".logotipoMain").removeClass("nodisplayenc");
        $(".homeMobile").removeClass("nodisplayenc");
        $(".userMobile").removeClass("nodisplayenc");
    }
    $(".menMovilButtonNwm").removeClass("displayMenuLeftInRastro");
    $(".rastroModulesMaker").remove();
}



function reviewRecordUrl() {
    var hash = window.location.hash;
    var sha = hash.split("record=");
    if (sha[1] == undefined) {
        return false;
    }
    return sha[1];
}

function setRecordMaster() {
    if (!reviewRecordUrl()) {
        return;
    }
    var hash = window.location.hash;
    var data = {};
    data["hash"] = hash;
    data["service"] = "nwprojectOut";
    data["method"] = "getTableByHash";
    var url = "/nwlib6/nwproject/modules/nw_user_session/src/rpcNw.php";
    ajax_nw_json(url, data, "setRecordMasterTab");
}

function setRecordMasterTab(r) {
    if (!r) {
        return;
    }
    var id = reviewRecordUrl();
    if (!id) {
        return;
    }
    var data = {};
    data["table"] = r;
    data["id"] = id;
    data["service"] = "nwprojectOut";
    data["method"] = "getDataByIdAndTable";
    var url = "/nwlib6/nwproject/modules/nw_user_session/src/rpcNw.php";
    ajax_nw_json(url, data, "llenaMaestro");
}

function llenaMaestro(data) {
    setRecord(".containFormFields", data);
}
/*                                           FUNCTIONS TREE                          */
function createTreeNwMaker(self) {
    var html = "";
    html += "<div class='container-treenwm'>";
    html += "<div class='container-treenwmIntern'>";

    html += "<div class='container-treen_left'>";
    html += "</div>";

    html += "<div class='container-treen_rigth'>";
    html += "</div>";

    html += "</div>";
    html += "</div>";
    $(self).append(html);
    return true;
}

function addFieldsLeftInTree(self, fields) {
    var totalCols = fields.length;
    var rta = "";

    for (var i = 0; i < totalCols; i++) {
        var label = fields[i].label;
        var type = fields[i].type;
        var name = fields[i].name;
        var depend = fields[i].depend;

        rta += "<div class='addsLeftTreeNwmaker link_left_nwtree " + name + "' >";
        rta += "<p>" + str(label) + "</p>";
        rta += "</div>";
    }

    $(self + " .container-treen_left").append(rta);

    if (isMobile()) {
        (function () {
            $('#containerHomeUser').delegate('.backIntreeNwClick', 'click', function () {
                $(".container-treen_rigth").css({"left": "150%"});
                $(".container-treen_left").css({"left": "0%"});
            });
        })();
    }
    return true;
}

function loadRightFuncTree(self, func, divContainer, paramsData, otherTree) {
    var div = ".container-treen_rigth";
    if (typeof divContainer !== "undefined") {
        if (divContainer !== false) {
            div = divContainer;
        }
    }
    var divComplet = self + " " + div;
    if (otherTree === true) {
        hiddenTree(self);
        ShowTreeRight(divComplet);

        addCss(self, ".container-treen_rigth", {"width": "100%", "background": "transparent", "border": "0px", "margin": "0px", "padding": "0px"});
        addCss(self, ".container-treenwmIntern", {"background": "transparent", "border": "0px", "margin": "0px", "padding": "0px"});
        addCss(self, ".container-treenwm", {"background": "transparent", "border": "0px", "margin": "0px", "padding": "0px"});
        if (!isMobile()) {
            addCss(self, ".container-treen_left", {"display": "none"});
        }

    } else
    if (isMobile()) {
        hiddenTree(self);
        ShowTreeRight(divComplet);
    } else {
        $(divComplet).fadeOut(0);
        $(divComplet).fadeIn("fast");
        var w = document.querySelector(self + " .container-treen_left").clientWidth;
        var ch = document.querySelector(".container-nwmakerchat");
        var s = ch.clientWidth;
        if (ch.innerHTML === "") {
            s = 200;
        }
        var wWind = document.querySelector(self).offsetWidth;
        var f = wWind - w - s;
        addCss(self, ".container-treen_rigth", {"width": f + "px"});
    }

    var isParam = false;
    if (typeof paramsData !== "undefined") {
        if (paramsData !== false) {
            isParam = true;
        }
    }
    if (isParam === true) {
        $(div).addClass("divAnimate");
        $(div).addClass("dontShowTree");
        loadModuleCenter(func, divComplet, paramsData, "execFunc");
    } else {
        removeAllContend(div);
        loadModuleCenter(func, divComplet, divComplet, "execFunc");
    }
    var url = self;
    if (isMobile()) {
        changeUrl(url);
    }
}

function hiddenTree(self) {
    $(self + " .container-treen_left").css({"left": "-150%"});
}
function ShowTreeRight(self) {
    $(self).css({"left": "-150%"});
    $(self).css({"left": "0%"});
}

function removeAllContend(self, widget) {
    if (widget === true) {
        self.empty();
    } else {
        $(self).empty();
    }
}
function onkeyreturn(input, value) {
    $(input).keyup(function () {
        return false;
    });
    $(input).keydown(function () {
        return false;
    });
    $(input).keypress(function () {
        return false;
    });
    return false;
}
function addClass(self, div, className) {
    $(self + " " + div).addClass(className);
}

function applyAnimation(self, mode) {
    $(self).css({"opacity": "0", "top": "20px"});
    $(self).animate({"opacity": "1", "top": "0px"}, 1000);
}

function addContainerInRow(self, options, input) {
    if (typeof input == "undefined") {
        input = ".showRowMax";
    }
    if (input === false) {
        input = "";
    }
    var num = Math.floor((Math.random() * 10000) + 1);
    var div = "newContainerInRow_" + num;
    $(self + " " + input).append("<div class='newContainerInRow " + div + "' ></div>");
    var className = "." + div;
    if (typeof options != "undefined") {
        if (options != undefined && options != false) {
            $(className).css(options);
        }
    }
    return className;
}

function addInContainer(container, source) {
    var data = source;
    if (typeof source.self != "undefined") {
        data = source.self;
        $(data).appendTo(container);
    } else {
        $(container).append(data);
    }
}

function verificaPerfilCompletoUsuario() {
    var c = getConfigApp();

    if (c["solicitar_pago"] == "SI") {
        empty(".containerHomeUser");
        myProfile(".containerHomeUser");
    }
}

function verificaPagoUsuario() {
    var c = getConfigApp();
    var up = getUserInfo();

    if (c["solicitar_pago"] == "SI") {
        if (up["pago_estado"] != "Transacción aprobada") {
            remove(".containerLeft");
            empty(".containerCenter");
            createPayPlataform(".containerCenter");
        }
    }
}

function windowNwChat(room, me, he, heName, hePhoto, callback, contain, addGetUrl) {
    var get = "";
    if (evalueData(addGetUrl)) {
        get = addGetUrl;
    }
    var url = "/nwlib6/nwproject/modules/webrtc/v4/index.html?myID=" + me + "&otherID=" + he + "&room=" + room + "&onlyChat=true&useInterNw=true" + get;
    var min = createMiniBar(room);
    if (min === false) {
        return false;
    }
    var container = document.body;
    var con = document.querySelector(".containerChatsFoot");
    if (con) {
        container = con;
    } else {
        var conta = document.createElement("div");
        conta.className = "containerChatsFoot";
        document.body.appendChild(conta);
        container = conta;
    }
    container.appendChild(min);

    var fram = document.createElement("iframe");
    fram.className = "iframechat";
    fram.src = url;
    fram.onload = function () {
        if (evalueData(callback)) {
            callback();
        }
    };
    document.querySelector("." + min.data).appendChild(fram);

    var reload = document.createElement("div");
    reload.className = "reloadMiniBar reloadMiniBarShowEnc";
    reload.innerHTML = '<i class="material-icons">refresh</i>';
    reload.data = fram;
    reload.onclick = function () {
        var fram = this.data;
        fram.contentWindow.location.reload();
    };
    min.appendChild(reload);
}
function windowNwChatPes(user, username, divload, focusCht, createStorage, loadData) {
    console.log(user);
    return;
    var room = user.id_objetivo;
    var me = user.usuario_recibe;
    var he = user.usuario_envia;
    var foto_perfil = user.icon;
    windowNwChat(room, me, he);
    return;

    if (!isMobile()) {
        var d = {};
        d.user = user;
        if (typeof createStorage === "undefined" || createStorage === true) {
            addItemLocalStorageArray("allUsersNwChatt", d);
        }
    }
    if (isMobile()) {
        divload = "body";
    }
    var u = user;
    if (user === false) {
        return;
    }
    if (typeof user !== "number") {
        if (evalueData(u)) {
            u = u.replace("@", "");
            u = u.replace(/@/g, "");
            u = u.replace(/\./g, "");
        }
    }
    var d = ".containerAlertNotificaMini_chat" + u;
    if ($(d).length > 0) {
        $(d).remove();
    }
    focusChat = true;
    if (typeof focusCht != "undefined") {
        if (focusCht === false) {
            focusChat = false;
        }
    }
    nwc.createNwChatConversation(user, divload, loadData);

    if (typeof createStorage === "undefined") {
        if (username != false) {
            var id = ".container-conversations" + cleanUserNwC(user);
            localStorage["windowMinOrMaxNwChat_" + id] = "MAX";
        }
    }
    return true;
}

function getUrlActual() {
    var protocol = window.location.protocol;
    var domain = protocol + "//" + window.location.host;
    var path = window.location.pathname;
    var uri = domain + path;
    return uri;
}

function reloadPageRaiz() {
    var uri = getUrlActual();
    window.location = uri;
}
function openNwMakerChat() {
    if (!isMobile()) {
        if ($(".container-nwmakerchat .tableListMakerMobil").length == 0) {
            usersConected();
        }
    }
}
function getContainerTreeRigth(self) {
    return self + " .container-treen_rigth";
}

function activeDivEtiquetUss(d, self) {
    var p = d.substring(d.length - 2, d.length);
    if (p == "@" || p == " @") {
        var top = parseInt($(self).offset().top);
        var left = parseInt($(self).offset().left);
        myUsersEtiquetar(top, left, self);
    }
}

function extraeUsersEtiqs(descripcion) {
    var etiqs = [];
    var de = descripcion.split("<nw>");
    var to = de.length;
    if (to > 0) {
        var n = 0;
        for (var i = 0; i < to; i++) {
            var j = de[i].split("</nw>");
            if (j.length >= 2) {
                etiqs[n] = j[0];
                n++;
            }
        }
    }
    return etiqs;
}
function addLinkMenuMaker(r) {
    if (typeof r.id === "undefined") {
        r.id = Math.floor((Math.random() * 100) + 1);
        r.callback = Math.floor((Math.random() * 100) + 1);
    }
    if (typeof r.callback == "undefined") {
        r.callback = Math.floor((Math.random() * 100) + 1);
    }
    if (typeof r.limpiar_modulos_center === "undefined") {
        r.limpiar_modulos_center = "NO";
    }
    var id = r.id;
    var rta = htmlLinkMenuMaker(r);
    var con = ".ulMenuLeft";
    if (typeof r.tipo !== "undefined") {
        if (r.tipo === "center") {
            var ra = r;
            ra.tipo = "left";
            addLinkMenuMaker(ra);
            con = ".menuDashBoard";
        }
    }
    if (typeof r.vertical !== "undefined") {
        if (r.vertical === true) {
            con = ".containerMenuVerticalUl";
        }
    }
    if (document.querySelector(con)) {
        $(con).append(rta);
        if (typeof r.execCallBack !== "undefined") {
            if (typeof r.emptycenter !== "undefined") {
                if (r.emptycenter === "NO" || r.emptycenter === false) {
                    $(".linkleft_" + id).attr("emptycenter", "NO");
                }
            }
            $(".linkleft_" + id).click(function () {
                if ($(this).attr("emptycenter") !== "NO") {
                    empty(".loadModulosCenter");

                    hiddenMenuCenter();
                    removeAllDialog();
                    hiddenUser();
                    hideMenuMovilNwMaker();

                }
                r.execCallBack();
            });
            $(".nwMakerMenu_" + id).removeClass("execCallBack");
            $(".nwMakerMenu_" + id).click(function () {
                r.execCallBack();
            });
        }
    }
}

function htmlLinkMenuMaker(r) {
    var tipo = "";
    if (typeof r.tipo != "undefined") {
        tipo = r.tipo;
    }
    var up = getUserInfo();
    var parameter = "";
    var callback = "";
    var rta = "";
    if (typeof r.id !== "undefined") {
        callback = "menu=" + r.id + "&nivel=2";
        parameter = r.id;
    }
    if (typeof r.callback !== "undefined") {
        if (r.callback != null && r.callback != "" && r.callback != "0") {
            callback = "callback=" + r.callback;
            parameter = r.callback;
        }
    }
    var className = "execCallBack";
    var icon = "";
    var iconMaterialIcons = "";
    if (typeof r.icono != "undefined") {
        if (r.icono != "" && r.icono != null && r.icono != "0") {
            if (r.icono.indexOf("material-icons") !== -1) {
                icon = "";
                iconMaterialIcons = r.icono;
            } else {
                icon = " style='background-image: url(" + r.icono + ");' ";

            }
        }
    }
    var executeCallBackCode = "";
    if (typeof r.callback_code != "undefined" || typeof r.execCallBack != "undefined") {
        if (evalueData(r.callback_code) || evalueData(r.execCallBack)) {
            if (r.callback_code != "0" || r.execCallBack != "0") {
                executeCallBackCode = " executeCallBackCode='true'";
            }
        }
    }
    var limpiar_modulos_center = "";
    if (typeof r.limpiar_modulos_center != "undefined") {
        if (evalueData(r.limpiar_modulos_center)) {
            limpiar_modulos_center = "data-clean='" + r.limpiar_modulos_center + "'";
        }
    }
    var change_url = "";
    if (typeof r.change_url != "undefined") {
        if (evalueData(r.change_url)) {
            change_url = "data-change_url='" + r.change_url + "'";
        }
    }
    var show = true;
    if (typeof r.solo_registrados != "undefined") {
        if (r.solo_registrados === "SI") {
            if (typeof up.id_usuario == "undefined") {
                show = false;
            }
        } else
        if (r.solo_registrados === "NO") {
            if (typeof up.id_usuario != "undefined") {
                show = false;
            }
        }
    }
    var addclassName = "";
    if (typeof r.addclassName != "undefined") {
        if (evalueData(r.addclassName)) {
            addclassName = r.addclassName;
        }
    }

    if (show === true) {
        var link = " data-url='" + callback + "' callback='menuModuleCallBack' parameters='" + parameter + "' data-div='.mainModulesMaker' ";
        if (tipo == "center") {
            if (r["mostrar_en_el_home"] == "SI") {
                rta += "<div class='liMenuDash nwMakerMenu_" + r.id + " " + className + " " + addclassName + "' " + limpiar_modulos_center + " " + change_url + " " + link + " rastro='" + stripTags(r.nombre) + "' " + executeCallBackCode + "  dmenum-ispa='" + r.contiene_hijos + "' dmenum-nivel='" + r.nivel_hijos + "' d='" + r.id + "' hidden-m='" + r.ocultar_menu_on_click + "' nam-m='" + stripTags(r.nombre) + "'>";
                rta += "      <div class='imgMenuDash' " + icon + " >" + iconMaterialIcons + "</div>";
                rta += "         <div class='descriptionModuleBloq' >";
                rta += "   <h3 class='textMenuP'>";
                rta += str(r.nombre);
                rta += "     </h3>";
                rta += "     <p>";
                if (evalueData(r.description)) {
                    if (r.description != "" && r.description != "0") {
                        rta += r["description"];
                    }
                }
                rta += "     </p>";
                rta += "      </div>";
                rta += "     </div>";
            }
        } else {
            if (r.icono_menu_left != null && r.icono_menu_left != "" && r.icono_menu_left != "0") {
                icon = " style='background-image: url(" + r.icono_menu_left + ");' ";
            }
            rta += "<li rastro='" + stripTags(r.nombre) + "' " + limpiar_modulos_center + " " + change_url + " class='" + className + " " + addclassName + " linkleft linkleft_" + r.id + " linkleftcallback_" + r.callback + "' " + link + " " + executeCallBackCode + ">";
            rta += "<span class=' icon_menu_li icon_menu_li_" + r['id'] + "' " + icon + " >" + iconMaterialIcons + "</span>";
            rta += "<span class='name_menu_li name_menu_li_" + r['id'] + "' >" + str(r.nombre) + "</span>";
            rta += "</li>";
        }
    }
    return rta;
}

function hiddenMenuAndChat() {
    console.log("hiddenMenuAndChat");
    reject(".container-nwmakerchat");
    $(".menMovilButtonNwm").addClass("menMovilButtonNwmNormalice");
    $(".containerLeft").addClass("containerLeftNormalice");
    $(".encMenuMobile").addClass("encMenuMobileNormalice");
    $(".containerCenter").addClass("containerCenterNormalice");
}


function installAppNwMaker() {
    var button = document.querySelector('.installAppMaker');

    var deferredPrompt;

    window.addEventListener('beforeinstallprompt', function (e) {
        console.log('beforeinstallprompt Event fired');
        e.preventDefault();
        deferredPrompt = e;
        return true;
    });

    button.addEventListener('click', function () {
        console.log("click to install ok");
        if (deferredPrompt !== undefined) {
            console.log("Inside");
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function (choiceResult) {
                console.log(choiceResult.outcome);
                if (choiceResult.outcome == 'dismissed') {
                    console.log('User cancelled home screen install');
                } else {
                    console.log('User added to home screen');
                }
                deferredPrompt = null;
            });
        }
    });

    window.addEventListener('beforeinstallprompt', function (e) {
        e.userChoice.then(function (choiceResult) {
            console.log(choiceResult.outcome);
            if (choiceResult.outcome == 'dismissed') {
                console.log('User cancelled home screen install');
            } else {
                console.log('User added to home screen');
            }
        });
    });
}

function requestNotificationsWeb(text) {
    if (!evalueData(text)) {
        return false;
    }
    if (!("Notification" in window)) {
    } else if (Notification.permission === "granted") {
        var notification = new Notification(text);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                var notification = new Notification(text);
            }
        });
    }
}

function notificationPush(theBody, theIcon, theTitle, array) {
    spawnNotification(theBody, theIcon, theTitle, array);
}

var la = false;
var permiseNotification = false;
function spawnNotification(theBody, theIcon, theTitle, array) {
    var c = getConfigApp();
    if (permiseNotification === "granted") {
        continueSpawnNotification(theBody, theIcon, theTitle, array);
    } else
    if (typeof c.activeServerWorker !== "undefined" && c.activeServerWorker === true) {
        getPermissionsNwMaker(function (get) {
            permiseNotification = get.notifications;
            if (get.notifications === "granted") {
                continueSpawnNotification(theBody, theIcon, theTitle, array);
            } else {
                initServerWorker(function (get) {
                    console.log(get);
                    la = get;
                    continueSpawnNotification(theBody, theIcon, theTitle, array);
                });
            }
        });
    } else {
        continueSpawnNotification(theBody, theIcon, theTitle, array);
    }
}
function continueSpawnNotification(theBody, theIcon, theTitle, array) {
    var c = getConfigApp();
    var isInFrame = insideIframe();
    var serviceWorker = false;
    if (typeof c.activeServerWorker !== "undefined") {
        if (c.activeServerWorker === true) {
            serviceWorker = true;
        }
    }
    var title = theTitle;
    var tag = theBody;
    if (isInFrame == true) {
        notificationNormal(theBody, theIcon, theTitle, array);
        return;
    }
    if (isMobile() == false) {
        notificationNormal(theBody, theIcon, theTitle, array);
        return;
    }
    if (serviceWorker === true) {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else
        if (Notification.permission === "granted") {
            Notification.requestPermission(function (result) {
                if (result === 'granted') {
                    var options = {
                        "renotify": true,
                        "body": theBody,
                        "icon": theIcon,
                        "vibrate": [200, 100, 200, 100, 200, 100, 400],
                        "tag": tag
                        ,
                        "actions": [
                            {"action": "yes", "title": "Ampliar", "icon": "images/yes.png"},
                            {"action": "no", "title": "Cerrar", "icon": "images/no.png"}
                        ]
                    };
                    swRegistration.showNotification(title, options);
                }
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification(text);
                }
            });
        }
        return;
    }
    if (!("Notification" in window)) {

    } else
    if (Notification.permission === "granted") {
        notificationNormal(theBody, theIcon, theTitle, array);
    } else
    if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                var notification = new Notification(text);
            }
        });
    }
}

function notificationNormal(theBody, theIcon, theTitle, array) {
    var nav = getNavigator();
    if (nav == "Google Chrome" || nav == "Firefox") {
        Notification.requestPermission().then(function (result) {
            if (result == "granted") {
                var options = {
                    body: theBody,
                    icon: theIcon,
                    requireInteraction: false,
                    silent: false,
                    vibrate: true,
                    tag: theBody,
                    dir: 'ltr'
                };
                var timeRemove = 5000;
                if (evalueData(array) === true) {
                    if (evalueData(array.timeDestroy) === true) {
                        timeRemove = array.timeDestroy;
                    }
                }
                var n = new Notification(theTitle, options);
                setTimeout(n.close.bind(n), timeRemove);
                n.onclick = function (event) {
                    window.focus();
                    n.close.bind(n);
                    if (evalueData(array) == true) {
                        if (typeof array.id != "undefined") {
                            leerNotificationById(array["id"]);
                        }
                        if (typeof array.callBack != "undefined") {
                            array.callBack();
                            return;
                        }
                    }
                    if (array == "nwchat") {
                        return;
                    }
                    if (array == "nwchat") {
                        return;
                    }
                    var uri = getUrlActual();
                    event.preventDefault();
                    if (array["tipo"] == "muro" && evalueData(array["id_objetivo"])) {
                        loadWallUnitary(array["id_objetivo"]);
                    } else
                    if (array["tipo"] == "task" && evalueData(array["id_objetivo"])) {
                        loadTaskUnitary(array["id_objetivo"]);
                    } else
                    if (array["tipo"] == "chat") {
                        windowNwChatPes(array);
                    } else {
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
                    }
                };
            }
        });
    }
}

function formasPago() {
    loadJs("/nwlib6/nwproject/modules/apiNwPay/lists/l_tarjetas.js", function () {
        var d = new l_tarjetas();
        d.constructor();
    }, false, true);
}

function setHoursMsg() {
    var d = document.querySelectorAll(".contain_date_format");
    if (d.length > 0) {
        for (var i = 0; i < d.length; i++) {
            var fecha = d[i].getAttribute("data-date");
            var dateFormat = calcularTiempoDosFechas(fecha);
            var valueDate = dateFormat.dateInFormat;
            d[i].innerHTML = valueDate;
        }
    }
}