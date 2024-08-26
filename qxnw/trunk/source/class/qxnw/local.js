/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 
 ************************************************************************ */
/**
 * Class to store all data offline in the user side
 */
qx.Class.define("qxnw.local", {
    type: "singleton",
    extend: qx.core.Object,
    properties: {
        staredTimer: {
            init: false
        },
        widgetsCount: {
            init: 0
        },
        appTitle: {
            init: "QXNW Lib"
        },
        appVersion: {
            init: "6.0"
        },
        device: {
            init: "desktop",
            check: "String"
        },
        isLoadedMoneyConverter: {
            init: false,
            check: "Boolean"
        }
    },
    members: {
        __isStared: false,
        __store: null,
        __prefix: null,
        __companyPrefix: "",
        counter: 0,
        __allStoredData: null,
        isStoreData: function isStoreData() {
            return this.__store;
        },
        /**
         * Set the prefix for a saved data. This is very util when change the user but in the same computer 
         * and the stored data changes
         * @param prefix {String} the prefix for the data stored
         */
        setPrefix: function setPrefix(prefix) {
            this.__prefix = prefix;
        },
        /**
         * Sets the company code support. An aditional code for the prefix.
         * @param companyCode {String} the code
         */
        setCompanyPrefix: function setCompanyPrefix(companyCode) {
            this.__companyPrefix = companyCode;
            this.__prefix = this.__prefix + "_" + this.__companyPrefix;
        },
        /**
         * Returns the prefix set
         */
        getPrefix: function getPrefix() {
            return this.__prefix;
        },
        getOpenData: function getOpenData(key) {
            var self = this;
            var store = self.getStore();
            if (store == null) {
                self.start();
            }
            try {
                return store.getItem(key);
            } catch (e) {
                qxnw.utils.nwconsole(e);
                qxnw.utils.nwconsole(key);
                return null;
            }
        },
        loadTuto: function loadTuto() {
            var js = document.createElement('script');
            js.type = 'text/javascript';
            js.charset = 'UTF-8';
            js.src = 'https://tuto.gruponw.com/nwlib6/nwproject/modules/nw_tuto/tuto.js';
//            js.src = 'http://localhost:8000/nwlib6/nwproject/modules/nw_tuto/tuto.js';
            js.id = 'nwTutoMaker';
            js.async = true;
            document.body.appendChild(js);
            js.onload = function () {
                var nwt = new nwTuto();
                nwt.loadTuto();
//                nwt.start(2);
            };
        },
        /**
         * Create the class for storage
         */
        start: function start() {
            if (!this.__isStared) {
                this.__store = new qx.bom.storage.Web("local");
                this.__isStared = true;

                var locale = qx.locale.Manager.getInstance().getLocale();

                var lang = qxnw.local.getOpenData("lang");

                console.log("%c <<<< LANG SYSTEM " + locale + " >>>>", 'background: #B8E47F; color: #200f0c');
                console.log("%c <<<< LANG SETTED " + lang + " >>>>", 'background: #B8E47F; color: #200f0c');

                if (typeof lang !== 'undefined' && lang !== null && lang !== "") {
                    qxnw.config.setLocaleByData(lang);
                } else {
                    var extract = qxnw.config.searchIntoLocales(locale);
                    if (typeof extract !== 'undefined' && extract !== null) {
                        qxnw.config.setLocaleByData(locale);
                    } else {
                        qxnw.config.setLocaleByData("es");
                    }
                }

                if (typeof document.getElementById("playground") != 'undefined' && document.getElementById("playground") != null && document.getElementById("playground") != '') {
                    qxnw.animation.startEffectOnDiv("disapear", document.getElementById("playground"));
                    var interval = setInterval(function () {
                        clearInterval(interval);
                        var elem = document.getElementById("playground");
                        if (elem !== null) {
                            elem.style.visibility = "hidden";
                            elem.innerHTML = '';
                        }
                    }, 500);
                }
            }
            qxnw.config.switchTheme();
        },
        getLocaleConfigByFile: function getLocaleConfigByFile() {
            var self = this;
            var rpc = new qxnw.rpc("/rpcsrv/server.php", "NWUtils", true);
            rpc.exec("readConfig", null, function (rta) {
                var comes = false;
                var locale = qx.locale.Manager.getInstance().getLocale();
                if (typeof rta != 'undefined') {
                    if (rta != false) {
                        if (rta != null) {
                            if (rta.fecha_normal != null) {
                                comes = true;
                                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_short": rta.fecha_normal});
                                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_medium": rta.fecha_normal});
                                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_full": rta.fecha_normal});
                                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_long": rta.fecha_normal});

                                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_short": rta.fecha_normal + " HH:mm:ss"});
                                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_medium": rta.fecha_normal + " HH:mm:ss"});
                                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_full": rta.fecha_normal + " HH:mm:ss"});
                                qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_long": rta.fecha_normal + " HH:mm:ss"});
                            }
                        }
                    }
                }
                if (!comes) {
                    qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_short": "yyyy-MM-dd"});
                    qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_medium": "yyyy-MM-dd"});
                    qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_full": "yyyy-MM-dd"});
                    qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_format_long": "yyyy-MM-dd"});

                    qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_short": "yyyy-MM-dd HH:mm:ss"});
                    qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_medium": "yyyy-MM-dd HH:mm:ss"});
                    qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_full": "yyyy-MM-dd HH:mm:ss"});
                    qx.locale.Manager.getInstance().addLocale(locale, {"cldr_date_time_format_long": "yyyy-MM-dd HH:mm:ss"});
                }
            });
        },
        changeStoredLang: function changeStoredLang() {
            var lang = qxnw.local.getOpenData("lang");
            switch (lang) {
                case "en":
                    qxnw.config.setLocaleByData(lang);
                    break;
                case "es":
                    qxnw.config.setLocaleByData(lang);
                    break;
            }
            return true;
        },
        getStore: function getStore() {
            var self = this;
            if (!self.__isStared) {
                self.__store = new qx.bom.storage.Web("local");
                self.__isStared = true;
            }
            return this.__store;
        },
        /**
         * Remove all stored data
         */
        clear: function clear() {
            var self = this;
            self.__store.clear();
        },
        /**
         * Returns the local copy of this class
         * @return {Object} the copy of this class
         */
        getLocal: function getLocal() {
            return this.getLocal();
        },
        /*
         * For each value, calls a callback
         */
        forEach: function forEach(callback, scope) {
            var self = this;
            self.__store.forEach(callback, scope);
        },
        /**
         * Store data with a key as needle
         * @param key {String} a string containing the key for the stored value
         * @param data {Object} the values to be stored. Can be an Array, Json Object, String and Integer
         * @param havePrefix {Boolean} If have to save width prefix or not. Deffect: yes
         */
        storeData: function storeData(key, data, havePrefix) {
            var self = this;
            if (self.__store == null) {
                self.start();
            }
            if (typeof havePrefix === 'undefined') {
                havePrefix = true;
            }
            if (havePrefix === true) {
                if (self.__prefix != null) {
                    key = key + "_" + self.__prefix;
                }
            }
            if (qxnw.utils.isDebug()) {
                if (qxnw.config.getShowStorageDebug() == true) {
                    console.log("%c <<<< START save web storage settings >>>>", 'background: #222; color: #bada55');
                    console.log("KEY: ", key);
                    console.log("DATA: ", data);
                    console.log("%c <<<< / END >>>>", 'background: #222; color: #bada55');
                }
            }
            self.__allStoredData[key] = data;
            self.__store.setItem(key, data);
        },
        /**
         * Store the data of a columns from a qxnw.lists
         * 
         * @param key {String} value for a data stored
         * @param data {Array} an array containing values of columns 
         */
        storeClassColumnsData: function storeClassColumnsData(key, data) {
            var self = this;
            if (typeof data == 'undefined') {
                this.debug("You try to save something, but the values to save are null");
                return;
            }
            if (self.__store == null) {
                return;
            }
            if (key == null) {
                return;
            }
            if (self.__prefix != null) {
                key = key + "_" + self.__prefix;
            }
            var columnsData = self.__store.getItem(key);
            if (typeof columnsData != 'undefined') {
                if (columnsData != null) {
                    for (var i = 0; i < columnsData.length; i++) {
                        if (columnsData[i] != null) {
                            if (typeof data[i] == 'undefined') {
                                data[i] = columnsData[i];
                            }
                        }
                    }
                }
            }
            if (qxnw.utils.isDebug()) {
                if (qxnw.config.getShowStorageDebug() == true) {
                    console.log("%c <<<< START save web storage settings of COLUMNS OF TABLE >>>>", 'background: #222; color: #bada55');
                    console.log("KEY: ", key);
                    console.log("DATA: ", data);
                    console.log("%c <<<< / END >>>>", 'background: #222; color: #bada55');
                }
            }
            self.__store.setItem(key, data);
        },
        /**
         * Get the stored data passing a key
         * @param key {String} the key for a stored value
         * @param havePrefix {Boolean} if have to search by prefix or not. Deffect: no
         */
        getData: function getData(key, havePrefix) {
            var self = this;
            if (self.__store == null) {
                self.start();
            }
            if (typeof havePrefix === 'undefined') {
                havePrefix = true;
            }
            if (havePrefix === true) {
                if (self.__prefix != null) {
                    key = key + "_" + self.__prefix;
                }
            }
            var item = self.__store.getItem(key);
            if (qxnw.utils.isDebug()) {
                if (qxnw.config.getShowStorageDebug() == true) {
                    console.log("%c <<<< START GET web storage settings >>>>", 'background: #0F35D2; color: #bada55');
                    console.log("KEY: ", key);
                    console.log("DATA: ", item);
                    console.log("%c <<<< / END >>>>", 'background: #0F35D2; color: #bada55');
                }
            }
            return item;
        },
        clearKey: function clearKey(key) {
            var self = this;
            if (self.__store == null) {
                self.start();
            }
            if (self.__prefix != null) {
                key = key + "_" + self.__prefix;
            }
            self.__store.removeItem(key);
        },
        saveErrorLocally: function saveErrorLocally(error) {
            var self = this;
            if (self.__store == null) {
                self.start();
            }
            var key = "errorData";
            if (self.__prefix != null) {
                key = key + "_" + self.__prefix;
            }
            self.__store.setItem(key, error);
        },
        getErrorLocally: function getErrorLocally() {
            var self = this;
            if (self.__store == null) {
                self.start();
            }
            var key = "errorData";
            if (self.__prefix != null) {
                key = key + "_" + self.__prefix;
            }
            return self.__store.getItem(key);
        }
    },
    statics: {
        setStaredTimer: function setStaredTimer() {
            var self = this.getInstance();
            self.setStaredTimer(true);
        },
        getStaredTimer: function getStaredTimer() {
            var self = this.getInstance();
            return self.getStaredTimer();
        },
        translateByBaidu: function translateByBaidu(params, callback) {
            qxnw.utils.loading("Traduciendo... /Translating.../翻译...");
            if (typeof params === 'string') {
                params = {
                    q: params
                };
            }
            var req = new qx.io.request.Jsonp();
            var url = "https://api.fanyi.baidu.com/api/trans/vip/translate";
            req.setUrl(url);
            params = {
                from: params.from || 'spa',
                to: params.to || 'zh',
                appid: params.appid || '2015063000000001',
                q: params.query,
                salt: (new Date).getTime(),
                pass: params.pass || '12345678'
            };
            var str1 = params.appid + params.q + params.salt + params.pass;
            var sign = qxnw.md5.MD5(str1);
            params.sign = sign;
            req.setRequestData(params);
            req.addListener("success", function (e) {
                var req = e.getTarget();
                var status = req.getStatus();
                var respAlter = req.getPhase();
                var obj = req.getResponse();
                qxnw.utils.stopLoading();
                if (typeof obj.error_code != 'undefined' && obj.error_code != null) {
                    qxnw.utils.error("URL: " + url + "::Error code: " + obj.error_code + "::Error text: " + obj.error_msg + "::Status: " + status + "::Header response: " + respAlter);
                    return;
                }
                callback(obj);
            }, this);
            req.send();
        },
        translateByBaiduDeprecated: function translateByBaiduDeprecated(params, callback) {
            qxnw.utils.loading("Traduciendo... /Translating.../翻译...");
            if (typeof params === 'string') {
                params = {
                    q: params
                };
            }
            params = {
                from: params.from || 'spa',
                to: params.to || 'zh',
                appid: params.appid || '2015063000000001',
                q: 'apple',
                salt: (new Date).getTime(),
                pass: params.pass || '12345678'
            };
            var str1 = params.appid + params.q + params.salt + params.pass;
            var sign = qxnw.md5.MD5(str1);
            params.sign = sign;
            var data = JSON.stringify(params);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    var obj = JSON.parse(xhttp.responseText);
                    qxnw.utils.stopLoading();
                    callback(obj);
                }
            };
            xhttp.open("GET", "http://api.fanyi.baidu.com/api/trans/vip/translate", true);
            xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(null);
        },
        deleteFromDataByName: function deleteFromDataByName(key, name) {
            var savedArray = qxnw.local.getData(key);
            if (savedArray == null) {
                return;
            }
            for (var i = 0; i < savedArray.length; i++) {
                if (savedArray[i].name == name) {
                    savedArray.splice(i);
                    break;
                }
            }
            qxnw.local.setData(key, savedArray);
            return false;
        },
        insertUniqueIntoData: function insertUniqueIntoData(key, arr) {
            var savedArray = qxnw.local.getData(key);
            if (savedArray == null) {
                savedArray = [];
            }
            if (typeof savedArray != 'object') {
                savedArray = [];
            }
            var index = savedArray.indexOf(arr);
            if (index != -1) {
                savedArray.splice(index);
            }
            savedArray.push(arr);
            qxnw.local.setData(key, savedArray);
        },
        isLoadedMoneyConverter: function isLoadedMoneyConverter() {
            var self = this.getInstance();
            var rta = self.getIsLoadedMoneyConverter();
            self.setIsLoadedMoneyConverter(true);
            return rta;
        },
        getWidgetsCount: function getWidgetsCount() {
            var self = this.getInstance();
            var rta = self.getWidgetsCount();
            rta++;
            self.setWidgetsCount(rta);
            return rta;
        },
        getFavorites: function getFavorites() {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var sd = self.getData("favorites" + up.userCompany);
            return sd;
        },
        getFavoriteByClassName: function getFavoriteByClassName(classname) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var sd = self.getData("favorites" + up.userCompany);
            var arr = false;
            if (sd != null) {
                for (var i = 0; i < sd.length; i++) {
                    if (sd[i].classname == classname.toString()) {
                        return sd[i];
                    }
                }
            }
            return arr;
        },
        isFavorite: function isFavorite(classname) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var sd = self.getData("favorites" + up.userCompany);
            var exists = false;
            if (sd != null) {
                for (var i = 0; i < sd.length; i++) {
                    if (sd[i].classname == classname) {
                        exists = true;
                        return exists;
                    }
                }
            }
            return exists;
        },
        removeFavorite: function removeFavorite(data) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var sd = self.getData("favorites" + up.userCompany);
            if (sd != null) {
                for (var i = 0; i < sd.length; i++) {
                    if (sd[i].classname == data.classname) {
                        var index = sd.indexOf(sd[i]);
                        sd.splice(index, 1);
                    }
                }
                self.storeData("favorites" + up.userCompany, sd);
            }
            qxnw.utils.fastAsyncRpcCall("master", "removeFavorite", data);
        },
        saveFavorite: function saveFavorite(data) {
            var self = this;
            var up = qxnw.userPolicies.getUserData();
            var sd = self.getData("favorites" + up.userCompany);
            var exists = false;
            var arr = [];
            if (sd != null) {
                for (var i = 0; i < sd.length; i++) {
                    if (sd[i].classname == data.classname) {
                        exists = true;
                    }
                    arr.push(sd[i]);
                }
                if (exists) {
                    return;
                }
            }
            arr.push({
                "classname": data.classname,
                "label": data.label,
                "isMainForm": data.isMainForm,
                "tableMethod": data.tableMethod,
                "serialColumn": data.serialColumn,
                "modulo": data.modulo
            });
            self.storeData("favorites" + up.userCompany, arr);

            var d = {
                "classname": data.classname,
                "label": data.label,
                "isMainForm": data.isMainForm,
                "tableMethod": data.tableMethod,
                "serialColumn": data.serialColumn,
                "modulo": data.modulo
            };

            qxnw.utils.fastAsyncRpcCall("master", "saveFavorite", d);
        },
        getErrorLocally: function getErrorLocally(error) {
            var self = this.getInstance();
            return self.getErrorLocally(error);
        },
        saveErrorLocally: function saveErrorLocally(error) {
            var self = this.getInstance();
            self.saveErrorLocally(error);
        },
        /**
         * Set the prefix for a saved data in static mode. This is very util when change the user but in the same computer 
         * and the stored data changes
         * @param prefix {String} the prefix for the data stored
         */
        setPrefix: function setPrefix(prefix) {
            var self = this.getInstance();
            self.setPrefix(prefix);
        },
        /**
         * Returns the prefix used for store data
         * @returns {String} the prefix used
         */
        getPrefix: function getPrefix() {
            var self = this.getInstance();
            return self.getPrefix();
        },
        /**
         * Set the prefix for a saved data in static mode. This is very util when change the user but in the same computer 
         * and the stored data changes
         * @param prefix {String} the prefix for the data stored
         */
        setCompanyPrefix: function setCompanyPrefix(prefix) {
            var self = this.getInstance();
            self.setCompanyPrefix(prefix);
        },
        /**
         * Returns the prefix used for store data
         * @returns {String} the prefix used
         */
        getCompanyPrefix: function getCompanyPrefix() {
            var self = this.getInstance();
            return self.getCompanyPrefix();
        },
        /*
         * Clear all the stored data in static mode
         */
        clear: function clear() {
            var self = this.getInstance();
            self.clear();
        }
        ,
        /**
         * Returns the local copy of this class in static mode
         * @return {Object} the copy of this class
         */
        getLocal: function getLocal() {
            var self = this.getInstance();
            return self.getLocal();
        },
        /*
         * For each value, calls a callback in static mode, touching a main class
         */
        forEach: function forEach(callback, scope) {
            var self = this.getInstance();
            self.forEach(callback, scope);
        },
        setAppVersion: function setAppVersion(version) {
            var self = this.getInstance();
            self.setAppVersion(version);
        },
        getAppVersion: function getAppVersion() {
            var self = this.getInstance();
            return self.getAppVersion();
        },
        getAppTitle: function getAppTitle() {
            var self = this.getInstance();
            return self.getAppTitle();
        },
        setAppTitle: function setAppTitle(title) {
            var self = this.getInstance();
            console.log("%c <<<< RELEASE " + qxnw.userPolicies.getVersion() + " >>>>", 'background: #0F35D2; color: #61ef6a');
            console.log("%c <<<< QXNW " + qxnw.config.getQxnwVersionStr() + " >>>>", 'background: #0F35D2; color: #61ef6a');
            console.log("%c <<<< NWLIB " + qxnw.config.getNwlibVersionStr() + " >>>>", 'background: #0F35D2; color: #61ef6a');
            console.log("%c " + qxnw.utils.cleanHtml(qxnw.config.getDevMessage()), 'background: #0F35D2; color: #61ef6a');
            console.log("%c <<<< qooxdoo " + qx.core.Environment.get("qx.version") + " >>>>", 'background: #0F35D2; color: #61ef6a');
            self.setAppTitle(title);
        },
        saveConfigurationsOnServer: function saveConfigurationsOnServer() {
            var self = this.getInstance();
            var counter = 0;
            for (var v in self.__allStoredData) {
                counter++;
            }
            if (counter == 0) {
                return;
            }
            var toSave = JSON.stringify(self.__allStoredData);
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            var func = function (rta) {
                if (rta == true) {
                    self.__allStoredData = {};
                }
            };
            rpc.exec("saveUserSettings", toSave, func);
        },
        startStoredData: function startStoredData() {
            var self = this.getInstance();
            self.__allStoredData = {};
        },
        /**
         * Create the class for storage in static mode, starting the inside class if a singleton
         */
        start: function start() {
            var self = this.getInstance();

            if (qxnw.local.getStaredTimer() == false) {
                self.__allStoredData = {};
            }
            self.start();
            document.title = self.getAppTitle() + ":: Versión: " + qxnw.utils.getScriptURLParameter("nw-script-main", "version");
            self.setDevice(qx.core.Environment.get("device.type"));
            if (qxnw.local.getDevice() != "desktop") {
                qxnw.local.storeData("hide_buttons_text", true);
                //qxnw.config.setIconSize(32);
                //qxnw.config.setFontSize(20);
            }
            var nwlibV = qxnw.userPolicies.getNwlibVersion();
            if (nwlibV == null) {
                nwlibV = "";
            }
//            var ver = qxnw.userPolicies.getVersion(); 
            if (typeof self.qxnwLoadComponentCss === "undefined") {
                var ver = qxnw.utils.getScriptURLParameter("nw-script-main", "version");
                qxnw.utils.loadCss("/nwlib" + nwlibV + "/css/component.css?" + ver);

                var s = "https://fonts.googleapis.com/icon?family=Material+Icons"; 
                var newSS = document.createElement('link'); 
                newSS.rel = 'stylesheet'; 
                newSS.type = 'text/css'; 
                newSS.href = s; 
                document.getElementsByTagName("head")[0].appendChild(newSS);
            }
            self.qxnwLoadComponentCss = true;
        },
        getDevice: function getDevice() {
            return this.getInstance().getDevice();
        },
        setOpenData: function setOpenData(key, data) {
            this.storeOpenData(key, data);
        },
        storeOpenData: function storeOpenData(key, data) {
            var self = this.getInstance();
            var store = self.getStore();
            this.start();
            store.setItem(key, data);
        },
        getOpenData: function getOpenData(key) {
            var self = this.getInstance();
            var store = self.getStore();
            if (store == null) {
                self.start();
            }
            var ki = null;
            try {
                ki = store.getItem(key);
            } catch (e) {
                qxnw.utils.error(e);
            }
            return ki;
        },
        changeStoredLang: function changeStoredLang() {
            var self = this.getInstance();
            self.start();
            var lang = this.getOpenData("lang");
            qx.locale.Manager.getInstance().setLocale(lang);
            return true;
        },
        /**
         * Store data with a key as needle in static mode
         * @param key {String} a string containing the key for the stored value
         * @param data {Object} the values to be stored. Can be an Array, Json Object, String and Integer
         */
        storeData: function storeData(key, data) {
            var self = this.getInstance();
            self.storeData(key, data);
        },
        storeDataWithOutPrefix: function storeDataWithOutPrefix(key, data, havePrefix) {
            var self = this.getInstance();
            self.storeData(key, data, havePrefix);
        },
        setData: function setData(key, data) {
            this.storeData(key, data);
        },
        setSessionName: function setSessionName(setSessionName) {
            this.storeData("sessionName", setSessionName);
        },
        getSessionName: function getSessionName() {
            this.getData("sessionName");
        },
        /**
         * Get the stored data passing a key
         * @param key {String} the key for a stored value
         */
        getData: function getData(key) {
            var self = this.getInstance();
            self.start();
            return self.getData(key);
        }
        ,
        removeByKey: function removeByKey(key) {
            var self = this.getInstance();
            self.clearKey(key);
        }
        ,
        clearKey: function clearKey(key) {
            var self = this.getInstance();
            self.clearKey(key);
        },
        /**
         * Store the data of a columns from a qxnw.lists
         * 
         * @param key {String} value for a data stored
         * @param data {Array} an array containing values of columns 
         */
        storeClassColumnsData: function storeClassColumnsData(key, data) {
            var self = this.getInstance();
            self.storeClassColumnsData(key, data);
        }
    }
});