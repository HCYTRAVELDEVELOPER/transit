
qx.Class.define("qxnw.userPolicies", {
    type: "singleton",
    extend: qx.core.Object,
    properties: {
        developers: {
            init: ["andresf", "ladyg@netwoods.net", "alexf@netwoods.net", "alexf@gruponw.com", "alexf", "ladyg", "AndresF", "lady.kgonzalez@gmail.com", "juliand", "andersonb", "santiagor", "diegos", "osmanm", "lauram", "MDSTEST", "enderg", "orionjafe@gmail.com"]
        },
        developersNames: {
            init: [{"andresf": "Andrés Flórez E."}, {"lady.kgonzalez@gmail.com": "Lady Gonzalez"}, {"alexf": "Alexander Flórez"}, {"ladyg@netwoods.net": "Lady Gonzalez"}, {"alexf@netwoods.net": "Alexander Florez"}, {"alexf@gruponw.com": "Alexander Florez"}, {"andresonb": "Anderson Beltran"}, {"ladyg": "Lady Gonzalez"}, {"AndresF": "Andrés Flórez E."}, {"lccanon": "Laura Camila"}, {"LCCANON": "Laura Camila"}, {"aeromero": "Alix Romero"}, {"carlosd": "Carlos Díaz"}, {"enderg": "User dev"}]
        },
        showLoading: {
            init: true,
            check: "Boolean"
        },
        isProduct: {
            init: false,
            check: "Boolean"
        },
        colorLabelGroups: {
            init: null,
            check: "String"
        },
        version: {
            init: "7"
        },
        nwlibVersion: {
            init: ""
        },
        initSettings: {
            init: null
        },
        leader: {
            check: "String"
        },
        user: {
            check: "String"
        },
        userName: {
            check: "String"
        },
        userCode: {
            check: "Integer"
        },
        userProfile: {
            check: "Integer"
        },
        userNomProfile: {
            check: "String"
        },
        userTerminal: {
            check: "Integer"
        },
        userNomTerminal: {
            check: "String"
        },
        userCompany: {
            check: "Integer"
        },
        userNameCompany: {
            check: "String"
        },
        userCostumer: {
            check: "String"
        },
        top: {
            check: "Decimal"
        },
        left: {
            check: "Decimal"
        },
        width: {
            check: "Decimal"
        },
        font_size: {
            check: "Integer"
        },
        mainMethod: {
            check: "String"
        },
        stack: {
            check: "String"
        },
        rpcPhpLibraryUrl: {
            init: "/qxnw/rpcsrv/server.php",
            check: "String"
        },
        permissions: {
            init: null
        },
        frezzedByNoInternet: {
            init: false
        },
        userNameAuth: {
            init: null
        },
        userPassAuth: {
            init: null
        },
        authByToken: {
            init: false
        },
        wasAuthByToken: {
            init: false
        },
        modeReAuth: {
            init: true
        },
        showDashBoard: {
            init: true
        }
    },
    construct: function () {

    },
    members: {
        __db: null,
        __rpcUrl: null,
        __indexUrl: null,
        __method: null,
        __parameters: null,
        __regexSpecialCharacteres: /[^\\]/g,
        /**
         * Set the user name
         * @param user {String} 
         * @return {void}
         */
        setAppUserName: function setAppUserName(user) {
            this.user = user;
        },
        /**
         * Set the method to call
         * @param method {String} the service method
         */
        setMethod: function (method) {
            this.__method = method;
        },
        getMethod: function () {
            return this.__method;
        },
        getConfigurationsData: function () {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "configuraciones");
            var r = rpc.exec("getData");
            if (rpc.isError()) {
                qxnw.utils.error(rpc.getError(), self);
                return;
            }
            self.setConfigurations(r);
            return r;
        },
        getSessionData: function getSessionData(callback) {
            var self = this;
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), self.getMethod());
            rpc.setAsync(false);
            rpc.setShowLoading(false);
            var r = rpc.exec("getInfo", null);
            //Asignación de otro dígito al perfil
            qxnw.local.setPrefix(r.empresa + "_" + r.usuario);
            qxnw.local.storeDataWithOutPrefix("session", r, false);
            self.setData(r);
            if (typeof callback !== 'undefined') {
                callback();
            }
        },
        setConfigurations: function (data) {
            var self = this;
            self.top = data.all_top;
            self.left = data.all_left;
            self.width = data.all_width;
            self.font_size = data.font_size;
            self.print_type = data.tipo_impresion;
        },
        getConfigurations: function () {
            var self = this;
            var data = {};
            if (typeof self.top == 'undefined' && typeof self.left == 'undefined') {
                var r = self.getConfigurationsData();
                data = {
                    "top": r.all_top,
                    "left": r.all_left,
                    "width": r.width,
                    "font_size": r.font_size,
                    "print_type": r.tipo_impresion
                };
            } else {
                data = {
                    "top": self.top,
                    "left": self.left,
                    "width": self.width,
                    "font_size": self.font_size,
                    "print_type": self.tipo_impresion
                };
            }
            return data;
        },
        changeProfile: function changeProfile(data) {
            this.userProfile = parseInt(data.perfil);
            this.userNomProfile = data.nom_perfil;
        },
        setData: function setData(data) {

            this.allData = data;

            this.userCode = parseInt(data.id);

            if (typeof data.code !== 'undefined') {
                this.userCode = parseInt(data.code);
            }
            if (typeof data.documento !== 'undefined') {
                this.identification = data.documento;
            }
            this.userCompany = parseInt(data.empresa);
            this.userName = data.nombre;
            this.user = data.usuario;
            this.userProfile = parseInt(data.perfil);
            this.userNomProfile = data.nom_perfil;
            this.userTerminal = parseInt(data.terminal);
            this.userNomTerminal = data.nom_terminal;
            this.userNameCompany = data.nom_empresa;
            this.userCostumer = data.cliente;
            this.userEmail = data.email;
            if (typeof data.bodega != 'undefined') {
                this.userBodega = data.bodega;
                this.userNameBodega = data.nom_bodega;
            }
            if (typeof data.pais != 'undefined') {
                this.userPais = data.pais;
                this.pais = data.pais;
            }
            if (typeof data.pais_nombre != 'undefined') {
                this.pais_name = data.pais_nombre;
            }
            if (typeof data.ciudad != 'undefined') {
                this.ciudad = data.ciudad;
            }
            if (typeof data.zona_horaria != 'undefined') {
                this.zona_horaria = data.zona_horaria;
            }
            if (typeof data.idioma != 'undefined') {
                this.idioma = data.idioma;
            }
            if (typeof data.logo != 'undefined') {
                this.logo = data.logo;
            }
            if (typeof data.web != 'undefined') {
                this.web = data.web;
            }
            if (typeof data.model != 'undefined') {
                this.model = data.model;
            }

            if (typeof data.perms != 'undefined') {
                this.perms = data.perms;
                for (var item in data.perms) {
                    this[item] = data.perms[item];
                }
            }

            this.userPhoto = data.foto;
        },
        setUserPhoto: function setUserPhoto(photo) {
            this.userPhoto = photo;
        },
        addParameterData: function addParameterData(arr) {
            if (this.__parameters == null) {
                this.__parameters = [];
            }
            this.__parameters.push(arr);
        },
        getData: function getData() {
            var self = this;
            var data = {
                "user": self.user,
                "name": self.userName,
                "code": self.userCode,
                "profile": self.userProfile,
                "nom_profile": self.userNomProfile,
                "terminal": self.userTerminal,
                "nom_terminal": self.userNomTerminal,
                "company": self.userCompany,
                "name_company": self.userNameCompany,
                "costumer": self.userCostumer,
                "db": self.__db,
                "email": self.userEmail,
                "pais": self.pais,
                "pais_name": self.pais_name,
                "zona_horaria": self.zona_horaria,
                "idioma": self.idioma,
                "logo": self.logo,
                "web": self.web,
                "bodega": self.userBodega,
                "nom_bodega": self.userNameBodega,
                "parameters": self.__parameters,
                "model": self.model,
                "photo": self.userPhoto,
                "identificacion": self.identification,
                "city": self.ciudad
            };

            if (typeof self.perms != 'undefined') {
                for (var item in self.perms) {
                    data[item] = self.perms[item];
                }
            }
            return data;
        },
        getRpcUrl: function () {
            return this.__rpcUrl;
        },
        getIndexUrl: function () {
            return this.__indexUrl;
        },
        setRegexSpecialCharacteres: function (regex) {
            this.__regexSpecialCharacteres = regex;
        },
        getRegexSpecialCharacteres: function () {
            return this.__regexSpecialCharacteres;
        }
    },
    statics: {
        setUserPhoto: function setUserPhoto(photo) {
            var self = this.getInstance();
            self.userPhoto = photo;
        },
        getShowLoading: function getShowLoading() {
            var self = this.getInstance();
            return self.getShowLoading();
        },
        setShowLoading: function setShowLoading(bool) {
            var self = this.getInstance();
            self.setShowLoading(bool);
        },
        setColorLabelGroups: function setColorLabelGroups(color) {
            var self = this.getInstance();
            self.setColorLabelGroups(color);
        },
        getColorLabelGroups: function getColorLabelGroups() {
            var self = this.getInstance();
            return self.getColorLabelGroups();
        },
        setFrezzedByNoInternet: function setFrezzedByNoInternet(frezzed) {
            var self = this.getInstance();
            self.setFrezzedByNoInternet(frezzed);
        },
        getFrezzedByNoInternet: function getFrezzedByNoInternet() {
            var self = this.getInstance();
            return self.getFrezzedByNoInternet();
        },
        setShowDashBoard: function setShowDashBoard(dash) {
            var self = this.getInstance();
            self.setShowDashBoard(dash);
        },
        getShowDashBoard: function getShowDashBoard() {
            var self = this.getInstance();
            return self.getShowDashBoard();
        },
        setLeader: function setLeader(leader) {
            var self = this.getInstance();
            self.setLeader(leader);
        },
        setModeReAuth: function setModeReAuth(mode) {
            var self = this.getInstance();
            self.setModeReAuth(mode);
        },
        getModeReAuth: function getModeReAuth() {
            var self = this.getInstance();
            return self.getModeReAuth();
        },
        getLeader: function getLeader() {
            try {
                var self = this.getInstance();
                var leader = self.getLeader();
                if (leader == null) {
                    return "";
                }
                var developers = self.getDevelopersNames();
                for (var i = 0; i < developers.length; i++) {
                    if (typeof developers[i][leader] != 'undefined') {
                        return developers[i][leader];
                    }
                }
                return "";
            } catch (e) {
                return "";
            }
        },
        setRegexSpecialCharacteres: function setRegexSpecialCharacteres(regex) {
            var self = this.getInstance();
            self.setRegexSpecialCharacteres(regex);
        },
        getRegexSpecialCharacteres: function getRegexSpecialCharacteres() {
            var self = this.getInstance();
            return self.getRegexSpecialCharacteres();
        },
        getUserNameAuth: function getUserNameAuth() {
            var self = this.getInstance();
            return self.getUserNameAuth();
        },
        getUserPassAuth: function getUserPassAuth() {
            var self = this.getInstance();
            return self.getUserPassAuth();
        },
        getAuthByToken: function getAuthByToken() {
            var self = this.getInstance();
            return self.getAuthByToken();
        },
        getWasAuthByToken: function getWasAuthByToken() {
            var self = this.getInstance();
            return self.getWasAuthByToken();
        },
        setAuthByToken: function setAuthByToken(bool) {
            if (bool) {
                qxnw.userPolicies.openAuthByToken();
            }
        },
        openAuthByToken: function openAuthByToken() {
            var self = this.getInstance();
            var val = qxnw.utils.getURLParameter("token");
            if (val == "" || val == null) {
                self.setAuthByToken(false);
                self.setUserNameAuth("");
            } else {
                var token = atob(val);
                var splitted = token.split(",");
                self.setAuthByToken(true);
                self.setUserNameAuth(splitted[0]);
                if (typeof splitted[1] != 'undefined') {
                    self.setUserPassAuth(splitted[1]);
                }
                self.setWasAuthByToken(true);
            }
        },
        setProduct: function setProduct(bool) {
            var self = this.getInstance();
            self.setIsProduct(bool);
        },
        isProduct: function isProduct() {
            var self = this.getInstance();
            return self.getIsProduct();
        },
        isDeveloper: function isDeveloper(user) {
            var index = qxnw.userPolicies.getDevelopers().indexOf(user);
            if (index == -1) {
                return false;
            } else {
                return true;
            }
        },
        setInitSettings: function setInitSettings(settings) {
            var self = this.getInstance();
            self.setInitSettings(settings);
        },
        getInitSettings: function getInitSettings() {
            var self = this.getInstance();
            return self.getInitSettings();
        },
        addParameterData: function addParameterData(data) {
            this.getInstance().addParameterData(data);
        },
        getDevelopers: function getDevelopers() {
            return this.getInstance().getDevelopers();
        },
        getPermissions: function getPermissions(classname) {
            var self = this.getInstance();
            if (typeof classname == 'undefined') {
                var r = self.getPermissions();
                return r;
            } else {
                var r = self.getPermissions();
                if (r == null) {
                    return null;
                }
                for (var v in r[classname]) {
                    if (r[classname][v] == "t" || r[classname][v] == true || r[classname][v] == "true") {
                        r[classname][v] = true;
                    } else if (r[classname][v] == "f" || r[classname][v] == false || r[classname][v] == "false") {
                        r[classname][v] = false;
                    }
                }
            }
            if (r[classname] == 'undefined') {
                return null;
            }
            return r[classname];
        },
        getCallback: function getCallback(classname) {
            var self = this.getInstance();
            if (typeof classname == 'undefined') {
                return null;
            } else {
                var r = self.getPermissions();
                if (r == null) {
                    return null;
                }
                if (typeof r[classname] != 'undefined') {
                    if (typeof r[classname].callback != 'undefined') {
                        return r[classname].callback;
                    }
                }
            }
            return null;
        },
        setPermissions: function setPermissions(permissions) {
            var self = this.getInstance();
            self.setPermissions(permissions);
        },
        getVersion: function getVersion() {
            var self = this.getInstance();
            return self.getVersion();
        },
        setVersion: function setVersion(v) {
            if (typeof v == 'undefined') {
                return;
            }
            if (v === "") {
                v = "Developer";
            }
            var self = this.getInstance();
            return self.setVersion(v);
        },
        getSendErrorFlag: function getSendErrorFlag() {
            return true;
        },
        setMainMethod: function setMainMethod(method) {
            var self = this.getInstance();
            self.setMainMethod(method);
        },
        getMainMethod: function getMainMethod() {
            var self = this.getInstance();
            return self.getMainMethod();
        },
        setIndexUrl: function setIndexUrl(indexUrl) {
            var rpc = this.getInstance();
            rpc.__indexUrl = indexUrl;
        },
        setRpcUrl: function setRpcUrl(rpcUrl) {
            var rpc = this.getInstance();
            rpc.__rpcUrl = rpcUrl;
        },
        setNwlibVersion: function setNwlibVersion(version) {
            var up = this.getInstance();
            up.setNwlibVersion(version);
        },
        getNwlibVersion: function getNwlibVersion() {
            var up = this.getInstance();
            return up.getNwlibVersion();
        },
        setMethod: function setMethod(method) {
            var up = this.getInstance();
            up.setMethod(method);
        },
        setDB: function setDB(db) {
            var rpc = this.getInstance();
            rpc.__db = db;
        },
        indexUrl: function indexUrl() {
            var rpc = this.getInstance();
            return rpc.getIndexUrl();
        },
        rpcUrl: function rpcUrl() {
            var rpc = this.getInstance();
            return rpc.getRpcUrl();
        },
        getRpcUrl: function getRpcUrl() {
            var rpc = this.getInstance();
            return rpc.getRpcUrl();
        },
        getRpcPhpLibraryUrl: function getRpcPhpLibraryUrl() {
            var self = this.getInstance();
            return self.getRpcPhpLibraryUrl();
        },
        setRpcPhpLibraryUrl: function setRpcPhpLibraryUrl(phpLibrayUrl) {
            var self = this.getInstance();
            self.setRpcPhpLibraryUrl(phpLibrayUrl);
        },
        getUserConfigurations: function getUserConfigurations() {
            var rpc = qxnw.userPolicies.getInstance();
            var data = rpc.getConfigurations();
            return data;
        },
        getConfigurationsData: function getConfigurationsData() {
            var rpc = qxnw.userPolicies.getInstance();
            var data = rpc.getConfigurationsData();
            return data;
        },
        getUser: function getUser() {
            var up = new qxnw.userPolicies.getUserData();
            return up["user"];
        },
        getData: function getData() {
            var rpc = qxnw.userPolicies.getInstance();
            var data = rpc.getData();
            return data;
        },
        getUserData: function getUserData() {
            var rpc = qxnw.userPolicies.getInstance();
            var data = rpc.getData();
            return data;
        },
        setUserData: function setUserData(up) {
            var rpc = qxnw.userPolicies.getInstance();
            rpc.setData(up);
        }
    }
});