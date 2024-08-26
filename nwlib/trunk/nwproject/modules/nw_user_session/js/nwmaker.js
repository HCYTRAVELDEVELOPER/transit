document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener('load', function () {
        new FastClick(document.body);
    }, false);
    initSession();
});

function initSession(init) {
    var css = "position: fixed;top: 0;left: 0;height: 100%;z-index: 10000000000000000000;background: #fff;color: #fff;";
    if (init === true) {
        document.querySelector("#container-nwmaker").innerHTML = "";
    }
    var get = getGET();
    if (get) {
        if (typeof get.edite !== "undefined") {
            if (get.edite === "TrueEditNW") {
                return false;
            }
        }
    }

    /*
     loadJs("/nwlib6/nwmaker/config_nwmaker.js", function () {
     catarsis();
     }, false, true);
     */

    catarsis();

    function catarsis() {
        nwm = new config_nwmaker();
        nwm.setConfigLogin(function () {
            var config = nwm.getConfigLogin();
            var c = nwm.getInfoApp();
            var v = c.version;
            var configGral = nwm.getConfigApp();

            var up = getUserInfo();

            if (config.permitir_login_mobile === false && isMobile()) {
                var html = "<div class='containIngresaByApp'>";
                html += "<div class='containIngresaByAppInt'>";
                html += "<h1>Ingresa por la aplicación</h1>";
                html += "<a href='" + config.url_google_play + "' target='_BLANK'>Abrir app</a>";
                html += "</div>";
                html += "</div>";
                $("body").append(html);
                return false;
            }

            initTraductor();

            if (typeof configGral.use_translate != "undefined") {
                if (configGral.use_translate == true) {
                    alterTraductor();
                }
            }

            if (typeof get.recover_pass != "undefined") {
                loadJs("/nwlib6/nwproject/modules/nw_user_session/js/forms/f_recover_pass.js?v=" + v, function () {
                    changePassRecovery();
                }, false, true);
                return;
            } else {
                newLoadingTwo("body", "", css, "append");
            }
            if (typeof configGral.workLocal != "undefined") {
                if (configGral.workLocal == true) {
                    console.log("IS WORKING LOCALE!!");
                }
            }

            if (config == "0") {
                nw_dialog("No hay configuración para nwmaker. Consulte con el administrador del sistema.");
                return false;
            }

            if (typeof up.usuario == "undefined") {
                /*
                 if (config.permitir_acceso_sin_login == "SI" && typeof up.initSession == "undefined") {
                 */
                if (typeof get.createAccount != "undefined" || typeof get.login != "undefined" || typeof get.createLogin != "undefined") {
                    hiddenUser();
                    hideMenuMovilNwMaker();
                    removeLoadingNw();
                    showLoginAccess();
                }
            }
            if (config.permitir_acceso_sin_login == "SI" && typeof up.initSession == "undefined") {
                continueCreateNwMaker();
                return;
            }
            if (typeof configGral.offlineNwDual != "undefined") {
                if (configGral.offlineNwDual === true) {
                    if (navigator.onLine === false) {
                        continueCreateNwMaker();
                        return;
                    }
                }
            }

            if (typeof up != "undefined") {
                if (typeof up.usuario != "undefined" || typeof up.initSession != "undefined") {
                    if (typeof up.usuario != "undefined") {
                        continueCreateNwMaker();
                    } else
                    if (typeof up.initSession != "undefined") {
                        if (up.initSession == true) {
                            verifySession(function (r) {
                                if (typeof r.usuario === "undefined" && config.permitir_acceso_sin_login === "SI") {
                                    continueCreateNwMaker();
                                } else
                                if (typeof r.usuario != "undefined") {
                                    continueCreateNwMaker();
                                } else {
                                    showLoginAccess();
                                }
                            }, c);
                        } else {
                            showLoginAccess();
                        }
                    } else {
                        showLoginAccess();
                    }
                    return;
                }
                if (get != false && typeof get.userName != "undefined") {
                    var rpc = {};
                    rpc["service"] = "nwMaker";
                    rpc["method"] = "verifyInitSessionByGetUserName";
                    rpc["data"] = {userName: get["userName"]};
                    var func = function (r) {
                        reloadPageRaiz();
                    };
                    rpcNw("rpcNw", rpc, func, true);
                } else {
                    showLoginAccess();
                }
                return;
            }
            showLoginAccess();
        });

        function showLoginAccess() {
            loginNw();
        }

        function continueCreateNwMaker() {
            var config = nwm.getConfigApp();
            var configLogin = nwm.getConfigLogin();
            var v = nwm.getInfoApp();
            var version = v.version;
            var workLocal = false;
            var loadhom = true;
            var up = getUserInfo();
            if (typeof __nwMakerWorkOut == "undefined") {
                if (isset(up.usuario)) {
                    /*
                     if (configLogin.tipo_login == "qxnw" && configLogin.usar_redireccion_login == "SI" && config.menu_para_qxnw == "SI") {
                     */
                    if (configLogin.tipo_login == "qxnw" && configLogin.usar_redireccion_login == "SI") {
                        var isInFrame = insideIframe();
                        if (!isInFrame) {
                            window.location = configLogin.url_redireccion_login;
                        }
                    }
                }
            }
            if (typeof config.workLocal != "undefined") {
                workLocal = config.workLocal;
                if (workLocal === true) {
                    loadJs("/nwlib6/nwproject/modules/nw_user_session/nwmaker_js.php?worklocal=true&v=" + version, function () {
                        initNwMaker();
                    }, false, true);
                    newRemoveLoading("body");
                } else {
                    loadhom = false;
                    loadHome(function () {
                        var gv = "?v=" + version;
                        if (navigator.onLine == false) {
                            gv = "";
                        }
                        loadJs("/nwlib6/nwproject/modules/nw_user_session/nwmaker_js.php" + gv, function () {
                            initNwMaker();
                        }, false, true);
                    });
                }
            } else {
                loadJs("/nwlib6/nwproject/modules/nw_user_session/nwmaker_js.php?workNHormal", function () {
                    initNwMaker();
                }, false, true);
            }
            if (typeof config.offlineNwDual != "undefined") {
                if (config.offlineNwDual === true) {
                    loadJs("/nwlib6/nwmaker/offline/reviewCacheMan.js?v=" + version, false, false, true);
                }
            }
            if (loadhom === true) {
                loadHome();
            }
        }

        function loadHome(callBack) {
            var v = nwm.getInfoApp();
            var version = v.version;
            var up = getUserInfo();
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
            initNwMakerHome();
            function initNwMakerHome() {
                if (evalueData(get) == true) {
                    if (evalueData(get.onlyform) == true) {
                        top.location.href = location.protocol + "//" + location.host;
                        return;
                    }
                }
                createHomeNwMaker();



                if (typeof callBack != "undefined") {
                    callBack();
                }
            }
        }
    }
}
