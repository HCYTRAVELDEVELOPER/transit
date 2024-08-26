/* ************************************************************************
 
 Copyright:
 2017 Grupo NW S.A.S, https://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to work on Facebook Login
 
 ************************************************************************ */
var loadNWFacebook = false;
var intervalCheckStatus = false;
var NWFacebook = function (appIdsend) {

    var self = this;
    clicInButton = false;
    this.is_registered = false;
    if (loadNWFacebook === false)
        this.isLoaded = false;
    else
        this.isLoaded = true;
    this.status = null;
    this.accessToken = null;
    this.expiresIn = null;
    this.signedRequest = null;
    this.userID = null;
    this.parent = null;
    this.addedHeaderNote = false;
    this.pageId = null;
    this.textBtn = "Registrate con Facebook";

    this.changeNameButton = function (text) {
        this.textBtn = text;

    }

    function getMetaContent() {
        var metas = document.getElementsByTagName('meta');
        for (var i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute("property") == "fb:app_id") {
                return metas[i].getAttribute("content");
            }
        }
        return "";
    }
    var appId = getMetaContent();
    if (typeof appIdsend !== "undefined") {
        if (appIdsend !== null && appIdsend !== false && appIdsend !== "") {
            appId = appIdsend;
        }
    }

    if (typeof appId == 'undefined' || appId == null || appId == "") {
        appId = '1386343161484463';
    }

    window.fbAsyncInit = function () {
        FB.init({
            appId: appId,
            xfbml: true,
            version: 'v2.9'
        });
        FB.AppEvents.logPageView();
        self.isLoaded = true;
        loadNWFacebook = true;
        FB.getLoginStatus();
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    this.getLikePage = function (pageId) {
        this.pageId = pageId;
        FB.getLoginStatus(function (response) {
            var page_id = this.pageId;
            if (response && response.authResponse) {
                var user_id = response.authResponse.userID;
                var fql_query = "SELECT uid FROM page_fan WHERE page_id = " + page_id + "and uid=" + user_id;
                FB.Data.query(fql_query).wait(function (rows) {
                    if (rows.length == 1 && rows[0].uid == user_id) {
                        return true;
                    } else {
                        return false;
                    }
                });
            } else {
                FB.login(function (response) {
                    if (response && response.authResponse) {
                        var user_id = response.authResponse.userID;
                        var fql_query = "SELECT uid FROM page_fan WHERE page_id = " + page_id + "and uid=" + user_id;
                        FB.Data.query(fql_query).wait(function (rows) {
                            if (rows.length == 1 && rows[0].uid == user_id) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                    } else {
                        return false;
                    }
                }, {scope: 'user_likes'});
            }
        });
    };

    this.findGetParameter = function findGetParameter(parameterName) {
        var result = null,
                tmp = [];
        var items = location.search.substr(1).split("&");
        for (var index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0] === parameterName)
                result = decodeURIComponent(tmp[1]);
        }
        return result;
    };

    this.checkStatus = function (parent) {
        var self = this;
        loadingNw();
        self.parent = parent;
        var counter = 0;
        intervalCheckStatus = setInterval(function () {
            if (self.testLoad() == true) {
                clearInterval(intervalCheckStatus);
                removeLoadingNw();
            }
            if (counter == 500) {
                clearInterval(intervalCheckStatus);
                removeLoadingNw();
            }
            counter++;
        }, 500);
    };

    this.handleLoginConnected = function (response) {
        var get = getGET();
        var self = this;
        this.accessToken = response.accessToken;
        this.expiresIn = response.expiresIn;
        this.signedRequest = response.signedRequest;
        this.userID = response.userID;
        FB.api('/me', {fields: 'name,email,first_name,last_name,locale,gender,picture,age_range,location{location}'}, function (responseMe) {
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "checkFBUserExists";
            rpc["data"] = {userID: self.userID, email: responseMe.email};
            var func = function (rta) {
                if (rta != false) {
                    if (typeof rta.email != 'undefined') {
                        self.autenticar(rta.email, self.userID);
                    }
                } else {
                    var create = false;
                    if (get) {
                        if (typeof get.createAccount !== "undefined") {
//                            createNwMakerCreateAccount();
                            $("#nombre").val(responseMe.first_name);
                            $("#apellido").val(responseMe.last_name);
                            $("#email").val(responseMe.email);
                            $("#id_fb").val(self.userID);
                            $("#usuario").val(self.userID);
                            //var code = btoa(self.userID);
                            $("#clave_registro").val(self.userID);
                            if (typeof responseMe.picture != 'undefined') {
                                if (typeof responseMe.picture.data != 'undefined') {
                                    if (typeof responseMe.picture.data.url != 'undefined') {
                                        $("#picture_fb").val(responseMe.picture.data.url);
                                    }
                                }
                            }

                            $("#nit").attr("readonly", "readonly");
                            $("#nit").val(self.userID);
                            if (typeof responseMe.gender != 'undefined') {
                                if (responseMe.gender == "male") {
                                    $("#genero").val("hombre");
                                } else {
                                    $("#genero").val("mujer");
                                }
                            }
//                            return;
                            $(".button_aceptar_cuenta_maker").click();
                            create = true;
                            return;
                        }
                    }
                    if (!create) {
                        $("#usuario").val(responseMe.email);
                        $("#clave").val(self.userID);
                        $(".button_login_cuenta_maker_span").click();
                    }
                }
            };
            rpcNw("rpcNw", rpc, func, true);
        });
    };

    this.autenticar = function (email, pass) {
        var data = {};
        data.authFb = true;
        data.usuario = email;
        data.clave = pass;
//        data.nomd5 = true;
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "loginStarSession";
        rpc["data"] = data;
        var func = function (r) {
            if (r == "usuarioinactivo") {
                nw_dialog("Usuario inactivo, comuníquese con el administrador del sistema.");
                removeLoadingNw();
            } else if (r == "usuariooclaveinvalida") {
                var params = {};
                params.html = "<h3 class='textClaveoInvalida'>Usuario o clave inválida</div>";
                createDialogNw(params);
                removeLoadingNw();
            } else if (typeof r["usuario"] != "undefined") {
                setUserInfo(r);
                verificaRedireccionLog(r);
            } else {
                nw_dialog("A ocurrido un error, mas info mira la consola!: " + r);
                console.log(r);
                removeLoadingNw();
            }
        };
        rpcNw("rpcNw", rpc, func, true);

    };

    this.checkResponse = function (response) {
        var status = response;
        if (self.addedHeaderNote == false) {
            var html = "";
            html += "<div class='iniciarSessionFaceboookNwMaker'>";
            html += "<img src='/nwlib6/icons/facebook_2.png' />";
            html += "<span>" + str(this.textBtn) + "</span>";
            html += "</div>";
            $(".titleencloginmaker_one").after(html);
        }
        self.addedHeaderNote = true;
        switch (status.status) {
            case "connected" :
                $(".iniciarSessionFaceboookNwMaker").unbind("click");
                $(".iniciarSessionFaceboookNwMaker").click(function () {
                    clicInButton = true;
                    self.handleLoginConnected(status.authResponse);
                });
                if (clicInButton === true) {
                    self.handleLoginConnected(status.authResponse);
                }
                clearInterval(intervalCheckStatus);

                $(".loadingNwInto").remove();
                removeLoadingNw();
                break;
            case "not_authorized":
                $(".iniciarSessionFaceboookNwMaker").unbind("click");
                $(".iniciarSessionFaceboookNwMaker").click(function () {
                    loading("Autenticando...", "rgba(255, 255, 255, 0.76)!important", self.parent);
                    clicInButton = true;
                    FB.login(function (rta) {
                        if (rta.status == "not_authorized") {
                            removeLoadingComplete();
                            return;
                        }
                        removeLoadingNw();
                        self.handleLoginConnected(rta.authResponse);
                    }, {
                        scope: 'email,public_profile'
                    }
                    );
                });
                break;
            case "unknown":
                var html = "";
                if (self.addedHeaderNote == false) {
                    html += "<div class='titleencloginmaker titleencloginmaker_one'></div>";
                    html += "<div class='iniciarSessionFaceboookNwMaker'>";
                    html += "<img src='/nwlib6/icons/facebook_2.png' />";
                    html += "<span>" + str(this.textBtn) + "</span>";
                    html += "</div>";
                    html += "<div class='titleencloginmaker titleencloginmaker_two'></div>";
                    addHeaderNote(self.parent, html);
                }
                self.addedHeaderNote = true;
                $(".iniciarSessionFaceboookNwMaker").unbind("click");
                $(".iniciarSessionFaceboookNwMaker").click(function () {
                    loading("Autenticando...", "rgba(255, 255, 255, 0.76)!important", self.parent);
                    clicInButton = true;
                    FB.login(function (rta) {
                        self.testLoad(rta);
                        removeLoadingNw();
                    }, {
                        scope: 'email,public_profile'
                    }
                    );
                });
                break;
        }
        self.status = status;
        removeLoadingComplete();
        return status;
    };

    this.testLoad = function (response) {
        var self = this;
        if (self.isLoaded == true) {
            if (typeof response != 'undefined') {
                self.checkResponse(response);
            } else {
                FB.getLoginStatus(function (response) {
                    self.checkResponse(response);
                });
                removeLoadingNw();
            }
            return true;
        }
        return false;
    };
};