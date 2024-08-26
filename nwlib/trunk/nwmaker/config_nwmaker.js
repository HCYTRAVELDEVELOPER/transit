var __configAppLogin = {};
var __configApp = {};
var __infoApp = {};

function config_nwmaker() {
    this.setConfigApp = setConfigApp;
    this.getConfigApp = getConfigApp;
    this.setConfigLogin = setConfigLogin;
    this.getConfigLogin = getConfigLogin;
    this.setUserInfo = setUserInfo;
    this.getUserInfo = getUserInfo;
    this.getVersionNwMaker = getVersionNwMaker;
    this.getVersionNwLib = getVersionNwLib;
    this.getInfoApp = getInfoApp;
    this.setInfoApp = setInfoApp;

    function validaSiBoolean(val) {
        if (val == "SI" || val == 1 || val == true)
            return true;
        return false;
    }

    function setConfigApp(df) {
        if (typeof getUserInfo().usuario != "undefined") {
            localStorage["initSession"] = "true";
        }
        if (typeof df.activeServerWorker != "undefined") {
            df.activeServerWorker = validaSiBoolean(df.activeServerWorker);
        }
        if (typeof df.show_about != "undefined") {
            df.show_about = validaSiBoolean(df.show_about);
        }
        if (typeof df.offlineNwDual != "undefined") {
            df.offlineNwDual = validaSiBoolean(df.offlineNwDual);
        }
        if (typeof df.menu_cache != "undefined") {
            df.menu_cache = validaSiBoolean(df.menu_cache);
        }
        if (typeof df.workLocal != "undefined") {
            df.workLocal = validaSiBoolean(df.workLocal);
        }
        __configApp = df;
    }
    function getVersionNwMaker() {
        return "1.2";
    }
    function getVersionNwLib() {
        return "6.8";
    }
    function getInfoApp() {
        return __infoApp;
    }
    function setInfoApp(df) {
        __infoApp = df;
    }
    function getConfigApp() {
        return __configApp;
    }
    function setUserInfo(df) {
        __infoUser = df;
    }
    function getUserInfo() {
        if (typeof localStorage["initSession"] != "undefined") {
            if (localStorage["initSession"] == "true") {
                __infoUser.initSession = true;
            }
        }
        return __infoUser;
    }
    function getConfigLogin() {
        return __configAppLogin;
    }
    function setConfigAppLogin(df) {
        if (typeof df.pedir_pagina_web != "undefined") {
            df.pedir_pagina_web = validaSiBoolean(df.pedir_pagina_web);
        }
        if (typeof df.apply_css_loginBox != "undefined") {
            df.apply_css_loginBox = validaSiBoolean(df.apply_css_loginBox);
        }
        __configAppLogin = df;
    }

    function setConfigLogin(callBack) {
        var rand = Math.floor((Math.random() * 10000) + 1);
        /*
         * 
         if (isOnline() === true) {
         */
        fileExists("/config_nwmaker.json?v=" + rand, function (x) {
            if (x.fileExist === true) {
                if (x.response.indexOf("Opps..") !== -1 || x.response.indexOf("No existe el sitio que busca, lo sentimos") !== -1) {
                    consultaConfigB(callBack);
                } else {
                    var r = JSON.parse(x.response);
                    continueConfigInitial(r, callBack);
                }
            } else {
                consultaConfigB(callBack);
            }
        });
        /*
         } else {
         continueConfigInitial(false, callBack);
         }
         */
    }
    function consultaConfigB(callBack) {
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "getConfigNwMaker";
        rpc["data"] = {};
        var func = function (r) {
            continueConfigInitial(r, callBack);
        };
        rpcNw("rpcNw", rpc, func, true);
    }
    function continueConfigInitial(r, callBack) {
        if (r === false) {
            r = JSON.parse(localStorage["config_json"]);
        } else {
            localStorage["config_json"] = JSON.stringify(r);
        }

        if (typeof r.config_login != "undefined") {
            setConfigAppLogin(r.config_login);
        }
        if (typeof r.config != "undefined") {
            if (typeof r.session != "undefined") {
                setUserInfo(r.session);
            }
            setConfigApp(r.config);
        }

        localStorage["versionIsNew"] = true;
        if (typeof getUserInfo().initSession != "undefined") {
            if (getUserInfo().initSession === true) {
                if (localStorage["version"] != "undefined") {
                    if (typeof r.version != "undefined") {
                        if (parseFloat(r.version) == parseFloat(localStorage["version"])) {
                            localStorage["versionIsNew"] = false;
                        }
                    }
                }
            } else {
                localStorage["outputMenuLeft"] = false;
                localStorage["outputMenuCenter"] = false;
            }
            if (typeof r.version != "undefined") {
                localStorage["version"] = r.version;
                setInfoApp(r);
            }
        } else {
            localStorage["outputMenuLeft"] = "undefined";
            localStorage["outputMenuCenter"] = "undefined";
        }

        callBack();
    }
}