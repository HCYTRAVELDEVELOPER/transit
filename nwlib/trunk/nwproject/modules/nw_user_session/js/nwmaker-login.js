if (typeof __configAppLogin == "undefined") {
    var __configAppLogin = {};
}
function setConfigAppLogin(df) {
    __configAppLogin = df;
}
function getConfigAppLogin() {
    return __configAppLogin;
}

function getConfigurationLogin(modo, callBack) {
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "getConfigLoginNwMaker";
    rpc["data"] = {};
    var func = function (r) {
        if (r == "0") {
            var params = {};
            params.html = "No hay configuración de diseño para nwmaker. Consulte con el administrador del sistema.";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
        } else
        if (r) {
            setConfigAppLogin(r);
            applyDesignLogin(modo);
            if (evalueData(callBack)) {
                callBack();
            }
        } else {
            nw_dialog("A ocurrido un error, mira la consola: " + r);
            console.log(r);
        }
    };
    rpcNw("rpcNw", rpc, func, true);
}

function applyDesignLogin(modo) {
    var r = getConfigAppLogin();
    if (typeof r.config_login !== "undefined") {
        r = r.config_login;
    }
    var get = getGET();
    if (modo != "out") {
        if (evalueData(r["html_encabezado"])) {
            $(".containerInitSession").before(r["html_encabezado"]);
        }
        if (evalueData(r["html_footer"])) {
            $(".containerInitSession").after(r["html_footer"]);
        }
    }
    if (typeof r["codigo_libre"] != "undefined") {
        if (evalueData(r["codigo_libre"])) {
            $("body").append(r["codigo_libre"]);
        }
    }
    if (evalueData(get) == true) {
        if (evalueData(get.onlyform) == true) {
            loadCss("/nwlib6/nwproject/modules/nw_user_session/css/loginOnlyForm.css");
            return;
        }
    }
    if (evalueData(r.background_color_login))
        $(".bg-color-login-nwmaker").css({"display": "block", "background-color": r.background_color_login});

    if (evalueData(r.background_img_login))
        $(".bg-img-login-nwmaker").css({"display": "block", "background-image": "url(" + r.background_img_login + ")"});

    if (evalueData(r.background_box_center))
        $(".bloqueInitSession").css({"background": r.background_box_center});

    if (evalueData(r.color_font_box_center)) {
        $(".bloqueInitSession").css({"color": r.color_font_box_center});
        var d = document.createElement("div");
        d.innerHTML = "<style>.btnMakerLink{color: " + r.color_font_box_center + "}</style>";
        document.body.appendChild(d);
    }
}

function addLogotipo() {
    var get = getGET();
    var r = getConfigAppLogin();
    if (typeof r.config_login !== "undefined") {
        r = r.config_login;
    }
    var loadaccountleft = false;
    if (r.show_login_and_makeaccount === "SI") {
        loadaccountleft = true;
    }
    if (typeof get.createLogin !== "undefined" || typeof get.createAccount !== "undefined") {
        loadaccountleft = false;
    }
    if (typeof r.apply_css_loginBox !== "undefined") {
        if (evalueData(r.apply_css_loginBox)) {
            $(".bloqueInitSessionNew").addClass("apply_css_loginBox");
        }
    }
    if (typeof r.logotipo_login !== "undefined" && evalueData(r.logotipo_login)) {
        var img = imgThumb(r.logotipo_login, 200);
        if (!loadaccountleft) {
            $(".logoEncloginmaker").html("<div class='containLogotipoLogin' url-origin='" + r.logotipo_login + "' style='background-image: url(" + img + ")'></div>");
        } else {
            $(".containlogoencduomaker").html("<div class='containLogotipoLogin' url-origin='" + r.logotipo_login + "' style='background-image: url(" + img + ")'></div>");
        }
    }
}


function verificaRedireccionLog(r, urlRedirect) {
    var get = getGET();
    var login = getConfigAppLogin();
    newLoadingTwo("html", "", "background: rgba(27, 104, 156, 0.38);", "allWindow");
    if (get) {
        if (typeof get.linkredirect != "undefined") {
            window.location = decodeURIComponent(get.linkredirect);
            return true;
        }
    }
    if (typeof login.config_login !== "undefined") {
        login = login.config_login;
    }
    if (typeof r.usuario !== "undefined") {
        setUserInfo(r);
        $(".bg-color-login-nwmaker").remove();
        $(".bg-img-login-nwmaker").remove();

        if (evalueData(urlRedirect)) {
            urlRedirect = urlRedirect.replace(/;que;/gi, "?");
            urlRedirect = urlRedirect.replace(/;igual;/gi, "=");
            urlRedirect = urlRedirect.replace(/;ampt;/gi, "&");
            window.location = urlRedirect;
        } else
        if (login.usar_redireccion_login === "SI" || login.usar_redireccion_login === true) {
            if (evalueData(login.url_redireccion_login)) {
                window.location = login.url_redireccion_login;
            } else {
                reloadPageRaiz();
            }
        } else {
            reloadPageRaiz();
        }
        return true;
    }
    return false;
}

function createNwMakerLogin(popup, otherdiv) {
    scrollTop();
    var css = "position: fixed;top: 0;left: 0;height: 100%;z-index: 10000000000000000000;background: #fff;color: #fff;";
    newLoadingTwo("body", "", css, "append");
    var login = getConfigAppLogin();
    if (typeof login.config_login !== "undefined") {
        login = login.config_login;
    }
    var get = getGET();
    var div = ".container-nwmaker-createlogin";
    if (typeof otherdiv !== "undefined") {
        div = otherdiv;
    } else {
        var divCrear = ".container-nwmaker-createAccount";
        empty(divCrear);
        $(divCrear).fadeOut(0);
        $(div).fadeIn(0);
    }
    var loadaccountleft = false;
    if (typeof get.createLogin === "undefined" && login.show_login_and_makeaccount === "SI") {
        loadaccountleft = true;
    }
    var self = generateSelf(div);

    var fields = [
        {
            tipo: 'textField',
            nombre: 'Correo / Usuario',
            name: 'usuario',
            requerido: "SI",
            car_min: '3',
            car_max: '250',
            mode_label: 'hidden',
            icon: 'person',
            texto_ayuda: "Correo / Usuario",
            tooltip: "Aquí debes ingresar tu usuario o correo registrado"
        }
    ];
    var usepass = true;
    if (login.no_usar_clave === "SI" && login.loguear_alcrear_siexiste === "SI") {
        usepass = false;
    }
    fields.push({
        tipo: 'password',
        nombre: 'Contraseña',
        name: 'clave',
        mode_label: 'hidden',
        icon: 'security',
        car_min: '5',
        car_max: '100',
        requerido: usepass,
        visible: usepass,
        texto_ayuda: "Contraseña"
    });
    if (get !== false) {
        if (typeof get.token !== "undefined") {
            var data = getGET();
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "validateTokenValidaUser";
            rpc["data"] = data;
            var func = function (r) {
                if (r === false) {
                    empty("#container-nwmaker");
                    var params = {};
                    params.html = 'Enlace no válido';
                    params.onSave = function () {
                        window.location = "/nwUserAccount";
                        return false;
                    };
                    params.onCancel = function () {
                        window.location = "/nwUserAccount";
                        return false;
                    };
                    createDialogNw(params);
                    return false;
                }
                if (!verifyErrorNwMaker(r) || verifyErrorNwMaker(r) == 0) {
                    return;
                }
                if (usepass) {
                    nw_dialog("Por favor ingrese su clave para seguir con el registro de tu cuenta");
                }
            };
            rpcNw("rpcNw", rpc, func, false);
            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'token',
                        name: 'token',
                        requerido: "SI",
                        visible: false,
                        enabled: false,
                        value: get.token
                    };
            fields.push(columnas);
        }
    }
    if (popup === "popup") {
        createNwForms(self, fields, "popUp");
    } else {
        createNwForms(self, fields, "nopopup");
    }

    if (get !== false) {
        if (typeof get.user !== "undefined") {
            setValue(self, "usuario", get.user);
            setEnabled(self, "usuario", true);
        }
    }
    $(".dialogEnc_container-nwmaker-createlogin").addClass("createlogin_" + popup);

    setColumnsFormNumber(self, 1);

    var html = "";
    html += "<div class='logoEncloginmaker logoEnccloginmaker_one'></div>";
    html += "<div class='titleencloginmaker titleencloginmaker_one'>" + str("Inicia Sesión") + "</div>";
    addHeaderNote(self, html);

    if (login.permitir_registro_login_con_facebook === "SI" || login.permitir_registro_login_con_facebook === true) {
        if (typeof login.fb_app_id !== "undefined") {
            if (evalueData(login.fb_app_id)) {
                cargaJs("/nwlib6/nwproject/js/NWFacebook.nw.js", function () {
                    var nwfb = new NWFacebook(login.fb_app_id);
                    nwfb.changeNameButton("Entrar con Facebook");
                    nwfb.checkStatus(self);
                }, false, true);
            }
        }
    }

    if (login.permitir_registro_login_con_google === "SI" || login.permitir_registro_login_con_google === true) {
        if (login.google_api_key != null && login.google_api_key != "") {
            if (login.google_cliente_id != null && login.google_cliente_id != "") {
                if (typeof get.action == 'undefined') {
                    cargaJs("/nwlib6/nwproject/js/NWGoogle.nw.js", function () {
                        var nwg = new NWGoogle();
                        nwg.setApiKey(login.google_api_key);
                        nwg.setClientId(login.google_cliente_id);
                        nwg.start(self);
                    }, false, true);
                }
            }
        }
    }

    addLogotipo();

    var accept = addButtonNwForm(str("Iniciar Sesión"), self);
    addStyleBig(self, accept);
    accept.addClass("button_login_cuenta_maker");
    $(".button_login_cuenta_maker .ui-button-text").addClass("button_login_cuenta_maker_span");
    var usuario = actionInColForm(self, "usuario");
    usuario.keypress(function (e) {
        if (e.which == 13) {
            loginUser();
            return false;
        }
    });
    var clave = actionInColForm(self, "clave");
    clave.keypress(function (e) {
        if (e.which == 13) {
            loginUser();
            return false;
        }
    });
    accept.click(function () {
        loginUser();
    });
    if (login.permitir_crear_cuentas !== "NO" && !loadaccountleft) {
        var crearCuenta = addButtonNwForm("Crear Cuenta", self);
        addStyleLInk(self, crearCuenta);
        crearCuenta.addClass("button_crear_cuenta_maker");
        $(".button_crear_cuenta_maker .ui-button-text").addClass("button_crear_cuenta_maker_span");
        crearCuenta.click(function () {
            if (popup == "popup") {
                reject(self);
            }

            var url = addVarInUrl("createAccount=true");
            addHash(url);
            createNwMakerCreateAccount(popup);
        });
    }

    if (login.permitir_crear_cuentas_form_externo === "SI" || login.permitir_crear_cuentas_form_externo === true) {
        var crearCuenta = addButtonNwForm("Crear Cuenta", self);
        addStyleLInk(self, crearCuenta);
        crearCuenta.addClass("button_crear_cuenta_maker");
        $(".button_crear_cuenta_maker .ui-button-text").addClass("button_crear_cuenta_maker_span");
        crearCuenta.click(function () {
            var uri = window.location.protocol + "//" + window.location.host;
            uri = uri.replace("app.", "");
            uri += "/crear-cuenta-demo-app";
            var ht = "";
            ht += "<iframe class='iframeCrearCuentaFormExtern' src='" + uri + "'></iframe>";

            var params = {};
            params.textAccept = 'Cerrar';
            params.width = "600px";
            params.title = 'Creación de cuenta';
            params.html = ht;
            createDialogNw(params);
        });
    }
    if (get) {
        setRecord(self, get);
    }
    var recordarPass = addButtonNwForm(str("Recordar contraseña"), self);
    addStyleLInk(self, recordarPass);
    recordarPass.addClass("button_recordar_cuenta_maker");
    $(".button_recordar_cuenta_maker .ui-button-text").addClass("button_recordar_cuenta_maker_span");
    recordarPass.click(function () {
        rememberPass();
    });
    if (popup === "popup") {
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.addClass("button_cancelar_cuenta_maker");
        cancel.click(function () {
            reject(self);
        });
    }
    removeLoadingNw();
    newRemoveLoading("body");
    if (login.callBack != "undefined") {
        if (evalueData(login.callBack)) {
            $("body").append(login.callBack);
        }
    }
    if (usepass === false) {
        newLoadingTwo("html", "Activando su cuenta, por favor espere...", "background: rgba(27, 104, 156, 0.38);", "allWindow");
        setValue(self, "clave", "1");
        loginUser();
    }

    if (loadaccountleft === true) {
        createNwMakerCreateAccount();
        $(".containerInitSession").addClass("maxContainerDuoLogmaker");
        $(self).addClass("containerDuoLogmaker");
        $(self).addClass("containerDuoLogmaker_login");
    }

    function loginUser() {
        if (!validateRequired(self)) {
            return;
        }
        var data = getRecordNwForm(self);
        var css = "position: fixed;top: 0;left: 0;height: 100%;z-index: 10000000000000000000;background: #fff;color: #000;";
        newLoadingTwo("body", "", css, "append");
        autentiqueUserNwMakerIn(data);
    }
}

function autentiqueUserNwMakerIn(data) {
    var login = getConfigAppLogin();
    if (typeof login.config_login !== "undefined") {
        login = login.config_login;
    }
    validateDomains(data.usuario, function () {
        if (login.get_data_location === true) {
            getDataCountryIP(function (r) {
                data.visitor = r;
                autentiqueUserNwMakerInExec(data);
            });
        } else {
            autentiqueUserNwMakerInExec(data);
        }
    });
}

function autentiqueUserNwMakerInExec(data) {
    data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "loginStarSession";
    rpc["data"] = data;
    var func = function (r) {
        var params = {};
        if (r === false) {
            removeLoadingNw();
            newRemoveLoading("body");
            params.html = "<h3 class='textClaveoInvalida'>" + str("Usuario o clave inválida (1)") + "</div>";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return false;
        }
        if (!verifyErrorNwMaker(r)) {
            removeLoadingNw();
            newRemoveLoading("body");
            return;
        }
        if (typeof r.concurrente !== "undefined") {
            if (r.concurrente === true) {
                removeLoadingNw();
                newRemoveLoading("body");
                openConcurrente(r);
                return false;
            }
        }
        if (r === "product_usuario_no_exist") {
            removeLoadingNw();
            newRemoveLoading("body");
            params.html = "<h3 class='textUserInactive'>" + str("El usuario no existe en nuestra central de productos. Verifique el usuario y/o contraseña y vuelva a intentarlo") + ".</div>";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return;
        }
        if (r === "nonexisteusuario") {
            removeLoadingNw();
            newRemoveLoading("body");
            params.html = "<h3 class='textUserInactive'>" + str("El usuario no existe. Verifique el usuario y/o contraseña y vuelva a intentarlo") + ".</div>";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return;
        }
        if (r === "usuariopreregistrado") {
            removeLoadingNw();
            newRemoveLoading("body");
            params.html = "<h3 class='textUserInactive'>" + str("El usuario se encuentra pre-registrado. Ingrese a su correo y siga las instrucciones") + "</div>";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return;
        }
        if (r === "tokennovalido_useryaregistrado") {
            removeLoadingNw();
            newRemoveLoading("body");
            params.html = "<h3 class='textUserInactive'>" + str("El enlace no es válido. Puede ser el token incorrecto, el usuario ya activó su cuenta o la clave es incorrecta") + ".</div>";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return;
        }
        if (r === "usuarioinactivo") {
            removeLoadingNw();
            newRemoveLoading("body");
            params.html = "<h3 class='textUserInactive'>" + str("Usuario inactivo, comuníquese con el administrador del sistema") + "</div>";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return;
        }
        if (r === "usuariooclaveinvalida") {
            removeLoadingNw();
            newRemoveLoading("body");
            var params = {};
            params.html = "<h3 class='textClaveoInvalida'>" + str("Usuario o clave inválida (2)") + "</div>";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return;
        }
        if (r === "NO TIENE USUARIO ACTIVO EN NUESTRA CENTRAL") {
            removeLoadingNw();
            newRemoveLoading("body");
            var params = {};
            params.html = "<h3 class='textClaveoInvalida'>" + str("NO TIENE USUARIO ACTIVO EN NUESTRA CENTRAL") + "</div>";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return;
        }
        if (verificaRedireccionLog(r) === true) {
            return;
        }
        removeLoadingNw();
        newRemoveLoading("body");
        nw_dialog("A ocurrido un error, mas info mira la consola!: " + r);
        console.log(r);
    };
    rpcNw("rpcNw", rpc, func, true);
}

function validateDomains(data, callBack) {
    var get = getGET();
    var configPage = getConfigPage();
    var page = false;
    if (evalueData(get)) {
        if (evalueData(get["pagina"])) {
            page = get["pagina"];
        }
        if (evalueData(get["page"])) {
            page = get["page"];
        }
    }
    if (evalueData(configPage)) {
        if (evalueData(configPage["pagina"])) {
            page = configPage["pagina"];
        }
    }
    if (page === false) {
        callBack();
        return true;
    }
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "queryDomainsAutorized";
    rpc["data"] = {page: page};
    var func = function (r) {
        if (r === 0 || r === "0") {
            callBack();
            return;
        }
        if (r.length === 0 || r.length === "0") {
            callBack();
            return;
        }
        var t = r.length;
        var term = "el dominio";
        if (t > 1) {
            term = "alguno de los dominios";
        }
        var doms = "";
        var arrayIps = [];
        for (var i = 0; i < t; i++) {
            var h = r[i];
            doms += h.nombre + ", ";
            arrayIps.push(h.nombre);
        }
        var user = data.split("@");
        if (typeof user[1] != "undefined") {
            user = user[1];
        } else {
            user = data;
        }
        if (arrayIps.indexOf(user) == -1) {
            var params = {};
            params.html = str("El usuario debe contener") + " " + term + " " + doms + " " + str("verifique por favor") + ".";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            removeLoadingNw();
            return;
        }
        callBack();
    };
    rpcNw("rpcNw", rpc, func, true);
}

function rememberPass() {
    var get = getGET();
    loadingNw();
    var self = generateSelf(".recuperar_contrasena");
    var fields = [
        {
            type: 'textField',
            mode: 'email',
            mode_label: 'hidden',
            placeholder: 'Correo Registrado',
            nombre: 'Correo Registrado',
            name: 'correo_registrado',
            requerido: "SI"
        }
    ];
    createNwForms(self, fields, "popUp");
    addHeaderNote(self, "<h2 class='subtitles'>" + str("Recuperar mi contraseña") + "</h2><br />");

    removeButtonMin(self);
    removeButtonMax(self);

    addCss(self, ".header-enc", {"background": "transparent", "border": "0", "font-size": "0"});
    addCss(self, ".buttonsEnc", {"background": "transparent", "box-shadow": "none", "font-size": "15px"});

    setColumnsFormNumber(self, 1);
    setModal(true);
    setWidth(self, 300);
    var accept = addButtonNwForm("Enviar", self);
    accept.addClass("btnDialogAccept");
    var cancel = addButtonNwForm("Cancelar", self);
    cancel.addClass("btnDialogCancel");
    accept.click(function () {
        if (!validateRequired(self)) {
            return;
        }
        loading("Enviando, por favor espere...", "rgba(255, 255, 255, 0.76)!important", self);
        var data = getRecordNwForm(self);
        if (get) {
            if (typeof get.linkredirect !== "undefined") {
                data.linkredirect = encodeURIComponent(get.linkredirect);
            }
        }
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "rememberPassNwMaker";
        rpc["data"] = data;
        var func = function (r) {
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            reject(self);
            removeLoading(self);
            if (r === "noexiste") {
                var params = {};
                params.html = str("Lo sentimos, no existe el usuario");
                params.title = "";
                params.buttonMin = false;
                params.buttonMax = false;
                createDialogNw(params);
                return false;
            }
            var params = {};
            params.html = str("Hemos enviado un mensaje a su correo electronico registrado. Por favor ingrese a su E-mail y siga las instrucciones que hemos enviado.");
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return true;
        };
        rpcNw("rpcNw", rpc, func, true);
    });
    cancel.click(function () {
        reject(self);
    });
    removeLoadingNw();
}

function createNwMakerCreateAccount(popup, otherdiv) {
    loadingNw();

    if (typeof nwm === "undefined") {
        nwm = new config_nwmaker();
    }
    var c = nwm.getInfoApp();
    var login = getConfigAppLogin();
    if (login.permitir_crear_cuentas === "NO" || login.permitir_crear_cuentas === false) {
        window.location = "/";
        return false;
    }
    var pageConf = getConfigPage();
    var get = getGET();
    var loadaccountleft = false;
    if (typeof get.createAccount === "undefined" && login.show_login_and_makeaccount === "SI") {
        loadaccountleft = true;
    }
    var div = ".container-nwmaker-createAccount";
    var useFacebook = false;
    if (typeof otherdiv !== "undefined") {
        div = otherdiv;
    } else {
        var divLogin = ".container-nwmaker-createlogin";
        if (!loadaccountleft) {
            $(divLogin).fadeOut(0);
            empty(divLogin);
        }
        $(div).fadeIn(0);
    }
    var self = generateSelf(div);
    if (typeof login.config_login !== "undefined") {
        login = login.config_login;
    }
    if (login.permitir_registro_login_con_facebook === "SI" || login.permitir_registro_login_con_facebook === true) {
        useFacebook = true;
    }
    var fields = [];
    fields.push(
            {
                tipo: 'textField',
                nombre: 'Página',
                name: 'page',
                requerido: "NO",
                visible: "SI",
                enabled: false
            }
    );

    if (useFacebook === true) {
        var columnas =
                {
                    tipo: 'textField',
                    nombre: "ID FB",
                    name: 'id_fb',
                    visible: false,
                    requerido: "NO",
                    enabled: false
                };
        fields.push(columnas);
        var columnas =
                {
                    tipo: 'textField',
                    nombre: "Picture FB",
                    name: 'picture_fb',
                    visible: false,
                    requerido: "NO",
                    enabled: false
                };
        fields.push(columnas);
    }

    var textcountry = "País";
    if (typeof get.country === "undefined") {
        textcountry = "Seleccione el país";
    }
    var selectBoxTwo = "selectBoxTwo";
    if (isMobile()) {
        selectBoxTwo = "selectBox";
    }
    var country_change_url = false;
    if (login.country_change_url === true && login.pedir_pais === "SI" || login.country_change_url === "SI" && login.pedir_pais === "SI") {
        country_change_url = true;
        var columnas =
                {
                    tipo: selectBoxTwo,
                    nombre: textcountry,
                    name: 'pais',
                    requerido: "SI",
                    mode_label: 'hidden',
                    texto_ayuda: "País"
                };
        fields.push(columnas);
    }
    if (login.pedir_nombre_y_apellidos !== "NO") {
        var placename = "Nombres";
        var showap = true;
        if (evalueData(login.pedir_apellido)) {
            if (login.pedir_apellido === "NO") {
                placename = "Nombre completo";
                showap = false;
            }
        }
        var columnas =
                {
                    tipo: 'textField',
                    nombre: placename,
                    name: 'nombre',
                    requerido: "SI",
                    car_min: '3',
                    car_max: '150',
                    mode_label: 'hidden',
                    texto_ayuda: placename
                };
        fields.push(columnas);
        if (showap === true) {
            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Apellidos',
                        name: 'apellido',
                        requerido: "SI",
                        car_min: '3',
                        car_max: '150',
                        mode_label: 'hidden',
                        texto_ayuda: "Apellidos"
                    };
            fields.push(columnas);
        }
    }
    var columnas =
            {
                tipo: 'textField',
                mode: 'email',
                nombre: 'Email',
                name: 'email',
                requerido: "SI",
                texto_ayuda: "Email",
                mode_label: 'hidden',
                car_min: '10',
                car_max: '50',
                tooltip: "Será tu mismo usuario para autenticación"
            };
    fields.push(columnas);
    var textButton = "Crear Cuenta";
    var usarclave = true;
    if (login.no_usar_clave === "SI") {
        usarclave = false;
        textButton = "Continuar >";
    }
    if (usarclave === true) {
        fields.push(
                {
                    tipo: 'password',
                    nombre: 'Contraseña',
                    name: 'clave_registro',
                    requerido: "SI",
                    mode_label: 'hidden',
                    car_min: '5',
                    car_max: '60',
                    texto_ayuda: "Contraseña"
                }
        );
        if (typeof login.pedir_confirmar_pass !== "undefined") {
            if (login.pedir_confirmar_pass === true || login.pedir_confirmar_pass === "SI") {
                fields.push(
                        {
                            tipo: 'password',
                            nombre: 'Confirmar contraseña',
                            name: 'clave_registro_validate',
                            requerido: "SI",
                            texto_ayuda: "Confirmar contraseña"
                        }
                );
            }
        }
    }

    if (login["pedir_documento"] !== "NO") {
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Documento',
                    name: 'nit',
                    requerido: "SI",
                    texto_ayuda: "Número de documento"
                };
        fields.push(columnas);
    }
    if (login["pedir_celular"] !== "NO") {
        var columnas =
                {
                    tipo: 'textField',
                    mode: 'integer',
                    car_min: '8',
                    car_max: '35',
                    mode_label: 'hidden',
                    nombre: 'Teléfono / Móvil',
                    name: 'celular',
                    requerido: "SI",
                    texto_ayuda: "Teléfono fijo o celular"
                };
        fields.push(columnas);
    }
    if (login["pedir_direccion"] === "SI") {
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Dirección',
                    name: 'direccion',
                    requerido: "SI",
                    texto_ayuda: "Dirección, barrio, apto o número de casa"
                };
        fields.push(columnas);
    }
    var usecountry = false;
    if (login.pedir_pais === "SI") {
        usecountry = true;
    }
    if (get) {
        if (typeof get.country !== "undefined") {
            usecountry = true;
        }
    }
    if (usecountry && !country_change_url) {
        var columnas =
                {
                    tipo: 'selectBox',
                    nombre: 'País',
                    name: 'pais',
                    requerido: "SI",
                    texto_ayuda: "País"
                };
        fields.push(columnas);
    }
    if (login["pedir_departamento_geo"] === "SI") {
        var columnas =
                {
                    tipo: 'selectBox',
                    nombre: 'Departamento',
                    name: 'departamento',
                    requerido: "SI",
                    texto_ayuda: "Departamento"
                };
        fields.push(columnas);
    }
    if (login["pedir_ciudad"] === "SI") {
        var columnas =
                {
                    tipo: 'selectBox',
                    nombre: 'Ciudad',
                    name: 'ciudad',
                    requerido: "SI",
                    texto_ayuda: "Ciudad"
                };
        fields.push(columnas);
    }
    if (login["pedir_fecha_nacimiento"] !== "NO") {
        var columnas =
                {
                    tipo: 'dateField',
                    nombre: 'Fecha de nacimiento',
                    name: 'fecha_nacimiento',
                    requerido: "NO",
                    texto_ayuda: "Fecha de Nacimiento"
                };
        fields.push(columnas);
    }
    if (login["pedir_genero"] !== "NO") {
        var columnas =
                {
                    tipo: 'selectBox',
                    nombre: 'Género',
                    name: 'genero',
                    requerido: "NO",
                    texto_ayuda: "Género"
                };
        fields.push(columnas);
    }
    if (login["pedir_profesion"] !== "NO") {
        var columnas =
                {
                    tipo: 'selectBox',
                    nombre: 'Profesión',
                    name: 'profesion',
                    requerido: "NO",
                    texto_ayuda: "Profesión"
                };
        fields.push(columnas);
    }
    if (typeof login.usar_datos_envio_tarjetabiente !== "undefined") {
        if (login.usar_datos_envio_tarjetabiente === "SI" || login.usar_datos_envio_tarjetabiente === true) {
            var columnas =
                    {
                        tipo: 'checkbox',
                        nombre: 'La dirección de envío del pedido es la misma que la dirección del comprador',
                        name: 'usar_datos_envio_tarjetabiente',
                        requerido: "NO",
                        texto_ayuda: "usar_datos_envio_tarjetabiente"
                    };
            fields.push(columnas);
            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Nombre',
                        name: 'nombre_recibe_pedido',
                        requerido: "NO",
                        visible: false,
                        texto_ayuda: "Nombre"
                    };
            fields.push(columnas);
            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Apellido',
                        name: 'apellido_recibe_pedido',
                        requerido: "NO",
                        visible: false,
                        texto_ayuda: "Apellido"
                    };
            fields.push(columnas);
            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Teléfono / Celular',
                        name: 'telefono_recibe_pedido',
                        requerido: "NO",
                        visible: false,
                        texto_ayuda: "Teléfono / Celular"
                    };
            fields.push(columnas);
            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Dirección',
                        name: 'direccion_recibe_pedido',
                        requerido: "NO",
                        visible: false,
                        texto_ayuda: "Dirección"
                    };
            fields.push(columnas);
            if (usecountry) {
                var columnas =
                        {
                            tipo: 'selectBox',
                            nombre: 'País',
                            name: 'pais_recibe_pedido',
                            visible: false,
                            texto_ayuda: "País"
                        };
                fields.push(columnas);
            }
            if (login["pedir_departamento_geo"] === "SI") {
                var columnas =
                        {
                            tipo: 'selectBox',
                            nombre: 'Departamento',
                            name: 'departamento_recibe_pedido',
                            visible: false,
                            texto_ayuda: "Departamento"
                        };
                fields.push(columnas);
            }
            if (login["pedir_ciudad"] === "SI") {
                var columnas =
                        {
                            tipo: 'selectBox',
                            nombre: 'Ciudad',
                            name: 'ciudad_recibe_pedido',
                            visible: false,
                            texto_ayuda: "Ciudad"
                        };
                fields.push(columnas);
            }
        }
    }
    if (login.pedir_formas_pago === "SI") {
        var tipoforma = 'radio';
        if (evalueData(login.type_input_forma_pago)) {
            if (login.type_input_forma_pago === "checkbox") {
                tipoforma = 'checkbox';
            }
        }
        var tipoforma_class = '.radioButtonsNw_forma_pago';
        var tipoforma_labelclass = '.labelforradionwform_forma_pago';
        var tipoforma_inputclass = '.inputradiobuttonnwf_forma_pago';
        if (tipoforma === "checkbox") {
            tipoforma_class = '.checkBoxMultiplesNw_forma_pago';
            tipoforma_labelclass = '.labelforcheckboxmultiwform_forma_pago';
            tipoforma_inputclass = '.inputcheckboxtonnwf_forma_pago';
        }
        var columnas =
                {
                    tipo: tipoforma,
                    nombre: 'Forma de pago',
                    name: 'forma_pago',
                    visible: true,
                    requerido: "SI",
                    texto_ayuda: "Forma de pago"
                };
        fields.push(columnas);
    }
    if (login["pedir_code_promo"] !== "NO") {
        var columnas =
                {
                    tipo: 'textField',
                    nombre: 'Código promocional',
                    name: 'codigo_promocional',
                    requerido: "NO",
                    texto_ayuda: "Código Promocional"
                };
        fields.push(columnas);
    }
    if (typeof login.pedir_pagina_web !== "undefined") {
        if (login.pedir_pagina_web === "SI" || login["pedir_pagina_web"] === "true" || login["pedir_pagina_web"] === true) {
            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Página web',
                        name: 'host',
                        requerido: "SI",
                        mode_label: 'hidden',
                        car_min: '5',
                        car_max: '60',
                        texto_ayuda: "Página web"
                    };
            fields.push(columnas);
        }
    }
    if (typeof login["pedir_observaciones"] !== "undefined") {
        if (login["pedir_observaciones"] === "SI") {
            var columnas =
                    {
                        tipo: 'textArea',
                        nombre: 'Observaciones',
                        name: 'observaciones',
                        requerido: "NO",
                        texto_ayuda: "Observaciones"
                    };
            fields.push(columnas);
        }
    }
    var containPlan = false;
    var valuePlan = 1;
    if (typeof get["payPlanProductNw"] !== "undefined") {
        if (get["payPlanProductNw"] !== "") {
            var columnas =
                    {
                        tipo: 'textField',
                        nombre: 'Plan',
                        name: 'plan',
                        requerido: "NO",
                        enabled: false,
                        visible: false
                    };
            fields.push(columnas);
            containPlan = true;
            valuePlan = get["payPlanProductNw"];
        }
    }
    if (typeof login.link_politicas !== "undefined") {
        if (evalueData(login.link_politicas) === true) {
            var textPolitics = str('Al enviar los datos acepta los') + ' <a class="linkAPolitics" href="' + login.link_politicas + '" target="_blank">' + str('Términos y condiciones') + '</a> ' + str('de nuestro servicio');
            if (evalueData(login.politicas_texto)) {
                textPolitics = login.politicas_texto + ' <a class="linkAPolitics" href="' + login.link_politicas + '" target="_blank">' + str('Ver aquí') + '</a>';
            }
            fields.push({
                tipo: 'checkBox',
                nombre: textPolitics,
                name: 'accept_politics',
                requerido: "SI"
            });
        }
    }
    if (typeof login.pedir_suscribirse !== "undefined") {
        if (evalueData(login.pedir_suscribirse) === true) {
            var textSuscribe = str('Acepta recibir información sobre promociones') + ' <a class="linkASuscribe" href="' + login.pedir_suscribirse + '" target="_blank">' + str('Ver aquí') + '</a>';
            if (evalueData(login.pedir_suscribirse_texto)) {
                textSuscribe = login.pedir_suscribirse_texto + ' <a class="linkAPolitics" href="' + login.pedir_suscribirse + '" target="_blank">' + str('Ver aquí') + '</a>';
            }
            fields.push({
                tipo: 'checkBox',
                nombre: textSuscribe,
                name: 'accept_suscribirse',
                requerido: "NO"
            });
        }
    }
    if (popup === "popup") {
        createNwForms(self, fields, "popUp");
    } else {
        createNwForms(self, fields);
    }

    if (loadaccountleft) {
        $(self).addClass("containerDuoLogmaker_createaccount");
        $(self).addClass("containerDuoLogmaker");
    }

    var cols = fields.length;
    if (containPlan === true) {
        setValue(self, "plan", valuePlan);
        cols--;
    }
    if (useFacebook === true) {
        cols--;
        cols--;
    }
    if (country_change_url === true) {
        cols--;
    }
    if (get) {
        if (typeof get.country !== "undefined") {
            cols--;
        }
    }

    $(self + " .labelInt").addClass("labelGeneralAll");

    if (typeof login.usar_datos_envio_tarjetabiente !== "undefined") {
        if (login.usar_datos_envio_tarjetabiente === "SI" || login.usar_datos_envio_tarjetabiente === true) {
            $(self + " .contain_input_name_usar_datos_envio_tarjetabiente .labelInt").addClass("labelEnvioAll");
            setValue(self, "usar_datos_envio_tarjetabiente", "SI");
            $(self + " #usar_datos_envio_tarjetabiente").click(function () {
                var v = true;
                if ($(this).is(":checked")) {
                    v = false;
                }
                activeInOt("nombre", v);
                activeInOt("apellido", v);
                activeInOt("telefono", v);
                activeInOt("direccion", v);
                activeInOt("pais", v);
                activeInOt("departamento", v);
                activeInOt("ciudad", v);
            });

        }
    }

    function activeInOt(name, value) {
        setVisibility(self, name + "_recibe_pedido", value);
        setRequired(self, name + "_recibe_pedido", value);
    }

    cols = 1;
    if (cols <= 5) {
        setColumnsFormNumber(self, 1);
    } else {
        setColumnsFormNumber(self, 2);
    }
    $(".dialogEnc_container-nwmaker-createAccount").addClass("createlogin_" + popup);
    if (evalueData(login.link_politicas)) {
        addCss(self, ".contain_input_name_accept_politics .divContainInputIntern", {"overflow": "hidden"});
        addCss(self, ".contain_input_name_accept_politics", {"width": "100%"});
        addCss(self, ".contain_input_name_accept_politics .labelGeneralAll", {"float": "right", "position": "relative", "max-width": "90%"});
    }
    if (evalueData(login.pedir_suscribirse)) {
        addCss(self, ".contain_input_name_accept_suscribirse .divContainInputIntern", {"overflow": "hidden"});
        addCss(self, ".contain_input_name_accept_suscribirse", {"width": "100%"});
        addCss(self, ".contain_input_name_accept_suscribirse .labelGeneralAll", {"float": "right", "position": "relative", "max-width": "90%"});
    }
    if (evalueData(login.usar_datos_envio_tarjetabiente)) {
        addCss(self, ".contain_input_name_usar_datos_envio_tarjetabiente .divContainInputIntern", {"overflow": "hidden"});
        addCss(self, ".contain_input_name_usar_datos_envio_tarjetabiente", {"width": "100%"});
        addCss(self, ".contain_input_name_usar_datos_envio_tarjetabiente .labelGeneralAll", {"float": "right", "position": "relative", "max-width": "90%"});
    }
    var data = {};
    data[""] = "Seleccione";
    populateSelectFromArray("grupo", data);
    populateSelectFromArray("genero", data);
    populateSelectFromArray("profesion", data);
    if (typeof login.usar_datos_envio_tarjetabiente !== "undefined") {
        if (login.usar_datos_envio_tarjetabiente === "SI" || login.usar_datos_envio_tarjetabiente === true) {
            populateSelectFromArray("pais_recibe_pedido", data);
        }
    }
    if (login.pedir_formas_pago === "SI") {
        var input = "forma_pago";
        var service = "nwMaker";
        var method = "getPayAlternatives";
        var array = false;
        var where = false;
        var async = true;
        var remove = true;
        var select = false;
        var callback = function (r) {
            /*
             var d = document.querySelector(self + " .inputradiobuttonnwf_forma_pago");
             if (d)
             d.checked = true;
             */
        };
        var typejson = false;
        populateSelect(self, input, service, method, array, where, async, remove, select, callback, typejson);

        click(self + " " + tipoforma_class + " " + tipoforma_labelclass, function () {
            if (tipoforma === "radio") {
                $(".valactiveenc").removeClass("valactiveenc");
            }
            var v = true;
            if ($(self).find(this.parentNode).find(tipoforma_inputclass).is(":checked")) {
                v = false;
            }
            if (v === true) {
                $(this.parentNode).addClass("valactiveenc");
            } else {
                $(this.parentNode).removeClass("valactiveenc");
            }
        });
        /*
         var forma_pago = actionInColForm(self, "forma_pago");
         click(forma_pago, function () {
         console.log("valactiveenc");
         $(".valactiveenc").removeClass("valactiveenc");
         $(this.parentNode).addClass("valactiveenc");
         });
         */
    }
    if (login.pedir_genero !== "NO") {
        var data = {};
        data["hombre"] = "Hombre";
        data["mujer"] = "Mujer";
        populateSelectFromArray("genero", data);
    }
    if (usecountry) {
        var data = {};
        data["table"] = "paises";
        populateSelect(self, "pais", "nwprojectOut", "populate", data, " order by nombre asc", true, true, true, function (aa) {
        }, false, true);
        if (typeof login.usar_datos_envio_tarjetabiente !== "undefined") {
            if (login.usar_datos_envio_tarjetabiente === "SI" || login.usar_datos_envio_tarjetabiente === true) {
                populateSelect(self, "pais_recibe_pedido", "nwprojectOut", "populate", data);
                $(self + " #pais_recibe_pedido").change(function () {
                    if (login["pedir_departamento_geo"] === "SI") {
                        var pais = $(this).val();
                        generateDeptosEnvio(pais);
                    } else
                    if (login["pedir_ciudad"] === "SI") {
                        var pais = $(this).val();
                        generateCitiesEnvio(pais);
                    }
                });
            }
        }
        $(self + " .pais").change(function () {
            var pais = $(this).val();
            actionInCountry(pais);
        });

        onChangeSelectBoxTwo(function () {
            var pais = getValue(self, "pais");
            actionInCountry(pais);
        });

        $(self + " .pais .optionSelextBoxTwo").click(function () {
            /*
             console.log("enter to show");
             var pais = $(this).attr("val-data");
             console.log(pais);
             actionInCountry(pais);
             */
        });
        if (get || loadaccountleft === true) {
            setRecord(self, get);
            if (typeof get.country !== "undefined") {
                setValue(self, "pais", get.country);
                /*
                 setEnabled(self, "pais", true);
                 setVisibility(self, "pais", false);
                 */
            }
            if (login.country_change_url === "SI" || login.country_change_url === true) {
                if (typeof get.country === "undefined") {
                    setVisibility(self, "nombre", false);
                    setVisibility(self, "apellido", false);
                    setVisibility(self, "email", false);
                    setVisibility(self, "clave_registro", false);
                    setVisibility(self, "clave_registro_validate", false);
                    setVisibility(self, "accept_politics", false);
                    setVisibility(self, "accept_suscribirse", false);
                    useFacebook = false;
                    login.permitir_registro_login_con_google = false;
                }
            }
        }
    }
    if (login.pedir_pais === "NO" && login.pedir_departamento_geo === "NO" && login.pedir_ciudad === "SI") {
        generateCities();
    }

    if (login["pedir_departamento_geo"] === "SI") {
        if (usecountry && login["pedir_ciudad"] === "NO" || login["pedir_ciudad"] === "NO" && login["pedir_pais"] === "NO") {
            var data = {};
            data["table"] = "deptosGeo";
            var input = "departamento";
            var service = "nwprojectOut";
            var method = "populate";
            var array = data;
            var where = " and 1=1 order by nombre asc";
            var async = true;
            var remove = true;
            var select = true;
            var callback = false;
            var typejson = false;
            populateSelect(self, input, service, method, array, where, async, remove, select, callback, typejson);
            if (typeof login.usar_datos_envio_tarjetabiente !== "undefined") {
                if (login.usar_datos_envio_tarjetabiente === "SI" || login.usar_datos_envio_tarjetabiente === true) {
                    populateSelect(self, "departamento_recibe_pedido", "nwprojectOut", "populate", data);
                }
            }
        }
        if (login["pedir_ciudad"] === "SI") {
            if (typeof login.usar_datos_envio_tarjetabiente !== "undefined") {
                if (login.usar_datos_envio_tarjetabiente === "SI" || login.usar_datos_envio_tarjetabiente === true) {
                    $(self + " #departamento_recibe_pedido").change(function () {
                        var pais = $(this).val();
                        generateCitiesEnvio(pais);
                    });
                }
            }
            $(self + " #departamento").change(function () {
                var pais = $(this).val();
                generateCities(pais);
            });
        }
    }
    if (login.pedir_profesion !== "NO") {
        var data = {};
        data["table"] = "nwmaker_login_profesiones";
        populateSelect(self, "profesion", "nwprojectOut", "populate", data);
    }

    var html = "";
    html += "<div class='logoEncloginmaker logoEnccloginmaker_one'></div>";
    html += "<div class='titleencloginmaker titleencloginmaker_one'>" + str("Crear Nueva Cuenta") + "</div>";
    addHeaderNote(self, html);

    addLogotipo();

    if (useFacebook === true) {
        if (typeof login.fb_app_id !== "undefined") {
            if (evalueData(login.fb_app_id)) {
                cargaJs("/nwlib6/nwproject/js/NWFacebook.nw.js");
                var nwfb = new NWFacebook(login.fb_app_id);
                nwfb.checkStatus(self);
            }
        }
    }

    if (login.permitir_registro_login_con_google === "SI" || login.permitir_registro_login_con_google === true) {
        if (login.google_api_key != null && login.google_api_key != "") {
            if (login.google_cliente_id != null && login.google_cliente_id != "") {
                if (typeof get.action == 'undefined') {
                    cargaJs("/nwlib6/nwproject/js/NWGoogle.nw.js");
                    var nwg = new NWGoogle(login.fb_app_id);
                    nwg.start(self);
                }
            }
        }
    }

    function actionInCountry(pais) {
        if (login.country_change_url === "SI" || login.country_change_url === true) {
            /* FOR CHANGE THE URL WITH LANGUAGE AND COUNTRY */
            var data = getRecordNwForm(self);
            var url = window.location.protocol + "//" + window.location.host;
            if (get || loadaccountleft === true) {
                var co = 0;
                if (get) {
                    $.each(get, function (key, value) {
                        if (key !== "country" && key !== "lang") {
                            if (co === 0) {
                                url += "?";
                            } else {
                                url += "&";
                            }
                            url += key + "=" + value;
                            co++;
                        }
                    });
                }
                if (co === 0) {
                    url += "?lang=" + data.pais_all_data.idioma_text;
                } else {
                    url += "&lang=" + data.pais_all_data.idioma_text;
                }
                url += "&country=" + data.pais;
            }
            if (typeof data.pais_all_data !== "undefined")
                window.location = url;
            return;
        }
        if (login.pedir_departamento_geo === "SI") {
            generateDeptos(pais);
        } else
        if (login["pedir_ciudad"] === "SI") {
            generateCities(pais);
        }
    }

    function generateDeptos(pais, value) {
        var data = {};
        data["bindValues"] = {};
        data["bindValues"]["pais"] = pais;
        data["table"] = "deptosGeo";
        populateSelect(self, "departamento", "nwprojectOut", "populate", data, " and pais=:pais", true, true, true, function () {
            if (typeof value !== "undefined") {
                setValue(self, "departamento", value);
            }
        });
    }
    function generateDeptosEnvio(pais, value) {
        var data = {};
        data["bindValues"] = {};
        data["bindValues"]["pais"] = pais;
        data["table"] = "deptosGeo";
        populateSelect(self, "departamento_recibe_pedido", "nwprojectOut", "populate", data, " and pais=:pais", true, true, true, function () {
            if (typeof value !== "undefined") {
                setValue(self, "departamento_recibe_pedido", value);
            }
        });
    }
    function generateCities(pais, value) {
        var data = {};
        data["bindValues"] = {};
        var where = " and 1=1";
        if (evalueData(pais)) {
            where += " and pais_id=:pais";
            if (login["pedir_departamento_geo"] === "SI") {
                data["bindValues"]["departamento"] = pais;
                where = " and departamento=:departamento";
            } else {
                data["bindValues"]["pais"] = pais;
            }
        }
        where += " order by nombre asc ";
        data["table"] = "ciudades";
        populateSelect(self, "ciudad", "nwprojectOut", "populate", data, where, true, true, true, function () {
            if (typeof value !== "undefined") {
                setValue(self, "ciudad", value);
            }
        });
    }
    function generateCitiesEnvio(pais, value) {
        var data = {};
        data["bindValues"] = {};
        var where = " and pais_id=:pais";
        if (login["pedir_departamento_geo"] === "SI") {
            data["bindValues"]["departamento"] = pais;
            where = " and departamento=:departamento";
        } else {
            data["bindValues"]["pais"] = pais;
        }
        data["table"] = "ciudades";
        populateSelect(self, "ciudad_recibe_pedido", "nwprojectOut", "populate", data, where, true, true, true, function () {
            if (typeof value !== "undefined") {
                setValue(self, "ciudad_recibe_pedido", value);
            }
        });
    }

    verifySession(function (r) {
        if (typeof r.descripcion !== "undefined") {
            r.observaciones = r.descripcion;
        }
        var istarjb = false;
        var istarjbot = false;
        if (typeof login.usar_datos_envio_tarjetabiente !== "undefined") {
            if (login.usar_datos_envio_tarjetabiente === "SI" || login.usar_datos_envio_tarjetabiente === true) {
                if (typeof r.usar_datos_envio_tarjetabiente !== "undefined") {
                    istarjb = true;
                    if (r.usar_datos_envio_tarjetabiente === "off") {
                        istarjbot = true;
                        var v = true;
                        activeInOt("nombre", v);
                        activeInOt("apellido", v);
                        activeInOt("telefono", v);
                        activeInOt("direccion", v);
                        activeInOt("pais", v);
                        activeInOt("departamento", v);
                        activeInOt("ciudad", v);
                    }
                }
            }
        }
        if (r === "usuario_no_existe") {
            return false;
        }
        setRecord(self, r);
        if (r.autenticado === "SI" || r.autenticado === true) {
            setEnabled(self, "email", true);
            setEnabled(self, "clave_registro", true);
            setVisibility(self, "clave_registro", false);
            $(self + " .contain_input_name_clave_registro").remove();
            $(".button_aceptar_cuenta_maker .ui-button-text").text("Continuar");
        }
        if (istarjbot) {
            $(self + ' #usar_datos_envio_tarjetabiente').prop('checked', false);
        }
        if (typeof r.pais !== "undefined") {
            generateDeptos(r.pais, r.departamento);
            if (istarjb) {
                generateDeptosEnvio(r.pais, r.departamento_recibe_pedido);
            }
        }
        if (typeof r.departamento !== "undefined") {
            generateCities(r.departamento, r.ciudad);
            if (istarjb) {
                generateCitiesEnvio(r.departamento_recibe_pedido, r.ciudad_recibe_pedido);
            }
        }
    });

    var accept = addButtonNwForm(textButton, self);
    addStyleBig(self, accept);
    accept.addClass("button_aceptar_cuenta_maker");
    accept.click(function () {
        var data = getRecordNwForm(self);
        if (!validateRequired(self)) {
            return false;
        }
        if (typeof login.pedir_pagina_web !== "undefined") {
            if (login.pedir_pagina_web === "SI" || login["pedir_pagina_web"] === "true" || login["pedir_pagina_web"] === true) {
                var v = validateFomatDomain(data.host);
                if (v !== true) {
                    nw_dialog(v);
                    return false;
                }
            }
        }
        if (typeof login.pedir_confirmar_pass !== "undefined") {
            if (login.pedir_confirmar_pass === "SI" || login.pedir_confirmar_pass === true) {
                if (data.clave_registro !== data.clave_registro_validate) {
                    nw_dialog("Las contraseñas no coinciden");
                    return;
                }
            }
        }
        data.email_principal = data.email;
        data.dominio = location.host;
        data.url = location.href;
        data.pathname = location.pathname;
        data.hash = location.hash;
        data.search = location.search;
        data.tipo = "app";
        data.name_app = c.alias;
        data.productnw = c.productnw;
        data.product_id = c.product_id;
        var css = "position: fixed;top: 0;left: 0;height: 100%;z-index: 10000000000000000000;background: #fff;color: #000;";
        newLoadingTwo("body", "", css, "append");
        /*       getDataCountryIP(function (r) {
         data.visitor = r;
         */
        validateDomains(data["email"], function () {
            data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "createAccount";
            rpc["data"] = data;
            console.log(data);
            var func = function (r) {
                console.log(r);
                removeLoadingNw();
                newRemoveLoading("body");
                /*
                 cleanForm("#nwform");
                 */
                if (!verifyErrorNwMaker(r, self)) {
                    return;
                }
                if (r === "yaexiste_hagalogin") {
                    nw_dialog("<h3 class='no_found_contend'>" + str("Ya hay un usuario con el correo que está ingresando") + "</h3>");
                    return;
                }
                if (r === "yaexiste") {
                    nw_dialog("<h3 class='no_found_contend'>" + str("Este usuario ya existe o el número de documento") + "<br />Por favor inicie sesión haciendo <a target='_self' href='?createLogin=true&usuario=" + data.email + "'>clic aquí.</a></h3>");
                    return;
                }
                if (r === "nonexisteusuario") {
                    nw_dialog("<h3 class='no_found_contend'>" + str("Este usuario no existe, verifique su clave y usuario.") + ".</h3>");
                    return;
                }
                if (r === "preregistrado") {
                    nw_dialog(str("<h3>" + str("Gracias por pre-registrase con nosotros. Por favor ingrese a su correo y siga las instrucciones.") + "</h3><p style='text-align: center;margin-top: 50px;margin-bottom: 30px;'><img src='/nwlib6/icons/sobre.png' style='max-width: 300px;' /><p>"));
                    return;
                }
                if (verificaRedireccionLog(r) === true) {
                    return;
                }
                nw_dialog("A ocurrido un error, mas info mira la consola!: " + r);
                console.log(r);
                return;
            };
            rpcNw("rpcNw", rpc, func, true);
        });
    });
    /*   });*/

    if (!loadaccountleft) {
        var crearLogin = addButtonNwForm("Ya tengo cuenta", self);
        addStyleLInk(self, crearLogin);
        crearLogin.addClass("button_yatengo_cuenta_maker");
        crearLogin.click(function () {
            if (popup == "popup") {
                reject(self);
            }

            var url = addVarInUrl("createLogin=true");
            addHash(url);
            /*
             window.location = url;
             */
            createNwMakerLogin(popup);
        });
    }

    if (popup == "popup") {
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.addClass("button_cancelar_crearcuenta_maker");
        cancel.click(function () {
            reject(self);
        });
    }

    setVisibility(self, "page", false);
    if (typeof pageConf["pagina"] != "undefined") {
        setValue(self, "page", pageConf["pagina"]);
    }
    if (typeof get["pagina"] != "undefined") {
        setValue(self, "page", get["pagina"]);
    }
    if (login["callBack"] != "undefined") {
        if (evalueData(login["callBack"])) {
            $("body").append(login["callBack"]);
        }
    }
    removeLoadingNw();
}

function createNwMakerAutenticUserOnly(popup, otherdiv) {
    var get = getGET();
    loadingNw();
    var login = getConfigAppLogin();
    if (typeof login.config_login !== "undefined") {
        login = login.config_login;
    }
    if (login["permitir_login_user_only"] === "SI" || login["permitir_login_user_only"] === true) {
        /*if ("SI" === "SI") {*/
        var div = "#container-nwmaker-createAccount";
        if (typeof otherdiv !== "undefined") {
            div = otherdiv;
        } else {
            var divLogin = "#container-nwmaker-createlogin";
            $(divLogin).fadeOut();
            $(div).fadeIn();
            empty(divLogin);
        }
        var self = generateSelf(div);
        var fields = [
            {
                tipo: 'textField',
                nombre: 'Usuario',
                name: 'usuario',
                requerido: "SI",
                texto_ayuda: "Usuario"
            }
        ];
        if (popup == "popup") {
            createNwForms(self, fields, "popUp");
        } else {
            createNwForms(self, fields, "nopopup");
        }
        setColumnsFormNumber(self, 1);
        addHeaderNote(self, "<p class='textOnlyAuthentic'>" + str("Este espacio es para comprobar que su usuario se encuentra pre-registrado en el sistema") + "</p><br /><br /><br />");
        var usuario = actionInColForm(self, "usuario");
        usuario.keypress(function (e) {
            if (e.which == 13) {
                createNwMakerAutenticUserOnlyStartSession(self);
                return false;
            }
        });
        var accept = addButtonNwForm("Aceptar", self);
        addStyleBig(self, accept);
        accept.addClass("button_aceptar_cuenta_maker");
        accept.click(function () {
            createNwMakerAutenticUserOnlyStartSession(self);
        });
        if (popup == "popup") {
            var cancel = addButtonNwForm("Cancelar", self);
            cancel.click(function () {
                reject(self);
            });
        }
        removeLoadingNw();
    }
}

function createNwMakerAutenticUserOnlyStartSession(self) {
    if (!validateRequired(self)) {
        return;
    }
    loadingNw(false, true, true, "rgba(255, 255, 255, 0.76)!important", false, "");
    var data = getRecordNwForm(self);
    var rpc = {};
    rpc["service"] = "nwMaker";
    rpc["method"] = "validateAuthenticUserOnly";
    rpc["data"] = data;
    var func = function (r) {
        removeLoadingNw();
        console.log(r);
        return;
        if (r === 0 || r === false) {
            var params = {};
            params.html = str("Lo sentimos, no se encuentra registrado o ya autenticó su cuenta antes. Será redireccionado automáticamente al login.");
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            redirectionToLoginNwMaker();
            return false;
        }
        if (!verifyErrorNwMaker(r)) {
            return;
        }
        if (r === "nonexisteusuario") {
            params.html = "<h3 class='textUserInactive'>" + str("El usuario no existe. Verifique el usuario y/o contraseña y vuelva a intentarlo") + ".</div>";
            params.title = "";
            params.buttonMin = false;
            params.buttonMax = false;
            createDialogNw(params);
            return;
        }
        if (typeof r.send !== "undefined") {
            if (r["send"] === true) {
                var params = {};
                params.html = str("Excelente! Se encuentra registrado! Hemos enviado un mensaje a su correo registrado para que ingrese y sigas las instrucciones.");
                params.title = "";
                params.buttonMin = false;
                params.buttonMax = false;
                createDialogNw(params);
            } else {
                if (verificaRedireccionLog(r) === true) {
                    return;
                }
                var url = window.location.pathname + "?AuthenticUserNwMaker=" + r.id;
                if (typeof get !== "undefined") {
                    if (typeof get.urlRedirect !== "undefined") {
                        url += "&urlRedirect=" + get.urlRedirect;
                    }
                }
                window.location = url;
            }
        }
        if (verificaRedireccionLog(r) === true) {
            return;
        }
        removeLoadingNw();
    };
    rpcNw("rpcNw", rpc, func, true);
}

function createNwMakerCompleteAutenticUserOnly(popup) {
    loadingNw();
    var login = getConfigAppLogin();
    if (typeof login.config_login !== "undefined") {
        login = login.config_login;
    }
    var get = getGET();
    if ("SI" == "SI") {
        /*if (login["permitir_login_user_only"] == "SI") {*/
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "validateUserMakerById";
        rpc["data"] = get;
        var func = function (ra) {
            if (ra == 0) {
                var params = {};
                params.html = "Lo sentimos, no se encuentra registrado o ya autenticó su cuenta antes. Será redireccionado automáticamente al login.";
                params.title = "";
                params.buttonMin = false;
                params.buttonMax = false;
                createDialogNw(params);
                redirectionToLoginNwMaker();
                return false;
            }
            var div = "#container-nwmaker-createAccount";
            var divLogin = "#container-nwmaker-createlogin";
            $(divLogin).fadeOut();
            $(div).fadeIn();
            empty(divLogin);
            var self = generateSelf(div);
            var fields = [
                {
                    tipo: 'textField',
                    nombre: 'ID',
                    name: 'id',
                    enabled: false,
                    visible: false
                },
                {
                    tipo: 'label',
                    nombre: 'Nombre',
                    name: 'nombre'
                },
                {
                    tipo: 'label',
                    nombre: 'Apellido',
                    name: 'apellido'
                },
                {
                    tipo: 'textField',
                    nombre: 'Usuario',
                    name: 'usuario_cliente',
                    enabled: false
                },
                {
                    tipo: 'password',
                    nombre: 'Contraseña',
                    name: 'clave',
                    requerido: "SI",
                    texto_ayuda: "Contraseña"
                }
            ];
            if (popup == "popup") {
                createNwForms(self, fields, "popUp");
            } else {
                createNwForms(self, fields, "nopopup");
            }

            setRecord(self, ra);
            applyAnimation(self, "fadeIn");
            setColumnsFormNumber(self, 2);
            addHeaderNote(self, "<p class='textOnlyAuthenticK'>" + str("Por favor ingrese una contraseña para comenzar a usar su cuenta") + ".</p><br /><br /><br />");

            var clave = actionInColForm(self, "clave");
            clave.keypress(function (e) {
                if (e.which == 13) {
                    enterUserNew();
                    return false;
                }
            });

            var accept = addButtonNwForm(str("Iniciar Sesión"), self);
            addStyleBig(self, accept);
            accept.addClass("button_aceptar_cuenta_maker");
            accept.click(function () {
                enterUserNew();
            });
            if (popup == "popup") {
                var cancel = addButtonNwForm("Cancelar", self);
                cancel.click(function () {
                    reject(self);
                });
            }


            function enterUserNew() {
                if (!validateRequired(self)) {
                    return;
                }
                loadingNw(false, true, true, "rgba(255, 255, 255, 0.76)!important", false, "");
                var data = getRecordNwForm(self);
                var rpc = {};
                rpc["service"] = "nwMaker";
                rpc["method"] = "validateKeyAuthenticUserOnly";
                rpc["data"] = data;
                var func = function (r) {
                    removeLoadingNw();
                    if (r == "usuariooclaveinvalida") {
                        var params = {};
                        params.html = "Usuario o clave inválida (3)";
                        params.title = "";
                        params.buttonMin = false;
                        params.buttonMax = false;
                        createDialogNw(params);
                        removeLoadingNw();
                        return;
                    }
                    var urlRedirect = false;
                    if (typeof get != "undefined") {
                        if (typeof get["urlRedirect"] != "undefined") {
                            urlRedirect = get["urlRedirect"];
                        }
                    }

                    if (verificaRedireccionLog(r, urlRedirect) === true) {
                        return;
                    }
                    nw_dialog("A ocurrido un error, mas info mira la consola!: " + r);
                    console.log(r);
                };
                rpcNw("rpcNw", rpc, func, true);
            }

            removeLoadingNw();
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}

function redirectionToLoginNwMaker() {
    setTimeout(function () {
        window.location = window.location.pathname;
    }, 5000);
}