nw.Class.define("config", {
    extend: nw.start,
    construct: function () {
        var up = nw.userPolicies.getUserData();

//        var incss = ".loading_home_localiz{background-color: var(--color_empresarial)!important;}";
//        incss += ".loading_home_localiz .loadingCenter{background-color: transparent; box-shadow: none;}";
//        var addcss = document.createElement("style");
//        addcss.innerHTML = incss;
//        addcss.className = "loading_home_localiz_css";
//        document.body.appendChild(addcss);
//
//        console.log("up", up);
//        console.log("up.acepto_terminos_condiciones", up.acepto_terminos_condiciones);
//        if (nw.utils.evalueData(up.usuario) && nw.evalueData(up.acepto_terminos_condiciones)) {
//            nw.loading({text: "", title: "", addClass: "loading_init_preload_home"});
//        }

        var self = this;
        var os = nw.utils.getMobileOperatingSystem();
        var useFree = false;
        var validateSession = true;
        var get = nw.getGET();
        if (get) {
            if (typeof get.service !== "undefined") {
                useFree = true;
                validateSession = false;
            }
        }
//        validateSession = false;
        //generales
        self.version = "0.0.0.2";
        //force update in android, (files intern)
//        if (os === "ANDROID" && typeof versionInAppLibDevice !== "undefined") {
        if (typeof versionInAppLibDevice !== "undefined") {
            self.version = versionInAppLibDevice;
        }
        self.useTranslateStr = true;
        self.idiomaPorDefecto = "EN";
        self.name = "MovilMove";
        self.description = "MovilMove";
        self.co_creator = "GrupoNw";
        self.credits_creator = "Grupo Nw<br /><a href='https://www.gruponw.com' target='_BLANK'>gruponw.com</a>";
        self.moneda = "COP";
        self.country = "COL";
        self.country_text = "Colombia";
        self.decimales = ".00";
        self.indicativo = "57";
        self.accountAdminBancos = false;
        self.emailSupport = "info@gruponw.com";
        self.usaRecargas = true;
        self.usaReferidos = true;
        self.usaMetodosDePago = true;
        self.usaCupones = true;
//        self.paymentStore = "Conekta";
//        self.paymentStorePruebas = false;
        //developers
        self.showConsoleDeveloper = false;
        self.showConsoleEvents = false;
        self.testing = false;
        self.url_play_store = "https://play.google.com/store/apps/details?id=com.movilmove";
        self.url_app_store = "";
        self.nameApplication = "com.movilmove";
        self.validateSession = validateSession;
//        self.validateSession = false;
        self.fechaLanzamiento = false;
        self.titleReferidoUser = "¡Gana más con " + self.name + "!";
        self.bodyReferidoUser = "¡Gana más con " + self.name + "! " + up.nombre + " te refirió para que te unas como usuario a " + self.name + ", la línea de transporte única en " + self.country_text + ", enlace: {link}";
        self.titleReferidoDriver = "¡Gana más con " + self.name + "!";
        self.bodyReferidoDriver = "¡Gana más con " + self.name + "! " + up.nombre + " te refirió para que te unas como conductor a " + self.name + ", la línea de transporte única en " + self.country_text + ", enlace: {link}";
        self.use_files_extern_by_domain_rpc = true;

        if (typeof newRouteRelease != "undefined") {
            self.carpet_files_extern = newRouteRelease + "/user/";
        } else {
            self.carpet_files_extern = "/lib_mobile/user/";
        }

        self.useGeoLocation = true;
        self.modeMapa = "styleUber2";
//        self.modeMapa = "styleMapNight";
//        self.apiKeyGoogleCloud = "AIzaSyDwzPL22nfy3hRDB-kxNSJLc_dpSMGQijY";
//        self.keyApiGoogleMaps = "AIzaSyACNy07A4kREm7VTt6ucGPSTJTMPfSi3nM";//nueva 2021-04-05 jasond
        self.keyApiGoogleMaps = "AIzaSyCgYA9SlMJf2T_Z477v9PP5DMV2E3mYzYU"; //desarrollonw1@gmail.com 04Abril2023 key producción
        self.initSessionWithEmail = true;
        self.ringowID = "3095";
        self.ringowApyKey = "1510848061182";
        self.closeAppToDetectBack = false;
        self.use_func_first_testing = false;
        self.func_first_testing = function () {
            nw.removeSplash();
//             nw.menuProfile();
//            nw.editProfile();
            nw.developers();
        };
        self.debugConstruct = false;
        self.usePingServer = false;
        self.getUseRpcQxnw = true;

//        self.debugConstruct = true;
        self.empresa_id = 24;
//        self.domain_rpc = "http://192.168.2.183/";
        self.domain_rpc = "http://movilmove.loc";
//        self.domain_rpc = "http://192.168.172.244/";

//        self.empresa_id = 49;
//        self.domain_rpc = "http://192.168.1.45/";
        self.domain_rpc = "http://movilmove.loc/";

        if (cordova.platformId !== "browser" && os === "ANDROID" || os === "IOS") {
            self.empresa_id = 24;
//            self.domain_rpc = "https://app.movilmove.com";
            self.domain_rpc = "https://test.movilmove.com";

            //DEMO ARMONICAR ESPAÑA
//            self.empresa_id = 55;
//            self.terminal_id = 5881;
//            self.domain_rpc = "https://test.movilmove.com";
//            self.moneda = "EUR";
//            self.country = "ESP";
//            self.country_text = "España";
//            self.decimales = ".00";
//            self.indicativo = "34";

        }
        var get = nw.getGET();
        if (nw.evalueData(get)) {
            if (nw.evalueData(get.conf)) {
                self.empresa_id = 24;
//                self.domain_rpc = "https://app.movilmove.com";
                self.domain_rpc = "https://test.movilmove.com";

                //DEMO ARMONICAR ESPAÑA
//                self.empresa_id = 55;
//                self.terminal_id = 5881;
////                self.domain_rpc = "https://test.movilmove.com";
//                self.domain_rpc = "https://eu.movilmove.com";
//                self.moneda = "EUR";
//                self.country = "ESP";
//                self.country_text = "España";
//                self.decimales = ".00";
//                self.indicativo = "34";

//                self.empresa_id = 49;
////                self.domain_rpc = "http://192.168.1.45/";
//                self.domain_rpc = "http://movilmove.loc/";

            }
        }
//        self.terminal_id = 2;
//        self.empresa_id = 24;
//        self.domain_rpc = "https://test.movilmove.com";
//        self.domain_rpc = "https://app.movilmove.com/";
//        self.domain_rpc = "http://movilmove.loc/";
//        self.domain_rpc = "http://192.168.10.18/";
//        self.domain_files = "http://192.168.10.18/";
//        self.domain_rpc = "http://192.168.2.183/";
//        self.domain_rpc = "http://192.168.172.244/";
//        self.domain_rpc = "http://192.168.1.105/";
//        self.domain_rpc = "http://movilmove.loc/";
//        self.domain_rpc = "http://192.168.1.45";
        self.domain_rpc = dom;
//        self.domain_rpc = "https://test.movilmove.com";
//        self.domain_rpc = "https://app.movilmove.com/";
//        self.domain_files = dom;
//        if (self.domain_rpc == "http://192.168.1.45" || self.domain_rpc == "http://movilmove.loc" || self.domain_rpc == "http://movilmove.loc/") {
//            self.empresa_id = 49; //AGL
//        }

//        self.domain_files = "http://192.168.1.45/";
//        self.domain_rpc = "http://192.168.0.8/";

        //DEMO ARMONICAR ESPAÑA
//        self.empresa_id = 55;
//        self.terminal_id = 5881;
//        self.domain_rpc = "https://test.movilmove.com";
//        self.moneda = "EUR";
//        self.country = "ESP";
//        self.country_text = "España";
//        self.decimales = ".00";
//        self.indicativo = "34";

        self.iconDriverPuntoA = self.domain_rpc + '/lib_mobile/driver/img/marker_a.png';
        self.iconDriverPuntoB = self.domain_rpc + '/lib_mobile/driver/img/marker_b.png';
        self.iconDriverPuntoDriver = self.domain_rpc + self.carpet_files_extern + '/img/pindriver_1_35.png';

        //login facebook
//        cordova plugin add cordova-plugin-facebook4 --save --variable APP_ID="2651602848434556" --variable APP_NAME="Movilmove"
//        self.fb_appid = 365348627590527;
//        self.fb_clave_secreta = "33da7feb0ddf10c2578ef00c5f9f550f";
//        self.fb_hashes_desarrollo = "OpBLquqUL7sNyfcgNzW3buJK2Rc="; //keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
//        self.fb_hashes_activacion = "S1/NXdloaM+gxiTGRf+x94s7C/w="; //keytool -exportcert -alias YOUR_RELEASE_KEY_ALIAS -keystore YOUR_RELEASE_KEY_PATH | openssl sha1 -binary | openssl base64

//        self.iconUserMap = self.domain_rpc + self.carpet_files_extern + '/img/me_pin.png';
        self.iconUserMap = false;
        self.iconDriverMap = self.domain_rpc + self.carpet_files_extern + '/img/pindriver_1_35.png';
        self.colorPolyLine = "#4aa64b";

        self.fb_appid = 2651602848434556;
        self.fb_clave_secreta = "531f1f4d62d82a1520afec1fbe5446e7";
        self.fb_hashes_desarrollo = "qbVxOyyMZIx6QIq4XGpeX0WxgbE="; //keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
        self.fb_hashes_activacion = "X9gLKfHkZrYg5jcexlNlwQj8DGI="; //keytool -exportcert -alias android-app-key -keystore android.keystore | openssl sha1 -binary | openssl base64
        self.changePass = false;
        self.activeLatsConnect = false;
        self.requiredUpdateLastVersion = true;
        // configuracion menu
        self.menu_crear_ayuda = false;
        //config login
        self.contentCenterInLogin = "<h1 class='titleEnc'>Iniciar sesión</h1>";
        self.login_generate_code = false;
        self.login_solicitar_code = false;
        self.login_crear_cuenta = true;
        self.login_background_color = "transparent";
        self.login_background_image = self.domain_rpc + self.carpet_files_extern + "img/home-img1.jpg";
        self.useFree = useFree; //open, close
        self.config_crear_cuenta = {
            verificar_celular_con_codigo: false,
            page: 2,
            estado: "activo", //activo, preregistrado
            pedir_perfil: true,
            pedir_nombre_y_apellidos: true,
            pedir_apellido: false,
            pedir_documento: false,
            pedir_celular: true,
            pedir_direccion: false,
            terminal: self.terminal_id,
            pedir_empresa: self.empresa_id,
            perfil: 1,
            pedir_genero: false,
            pedir_pais: true,
            pedir_departamento_geo: false,
            pedir_ciudad: true,
            pedir_fecha_nacimiento: false,
            pedir_politicas: true,
            pedir_politicas_text: "<span class='textpoliticsspan'>Al ingresar acepto las políticas de uso <a target='_BLANK' href='https://app.movilmove.com/app/policies.php?empresa=24&perfil=1'>Ver las políticas aquí­</a></span>",
            pedir_politicas_link: "https://app.movilmove.com/app/policies.php?empresa=24&perfil=1",
            pedir_politicas_in_session_create: true,
            pedir_suscribirse: false,
            pedir_suscribirse_texto: "¿Suscribirse a nuestro boletín?",
            permitir_registro_login_con_facebook: false,
            pedir_confirmar_pass: false
        };
        //config editar perfil // visible enabled required
        self.edit_profile = {
            permitir_editar: true,
            permitir_cambiar_clave: true,
            eliminar_cuenta: true,
            ver_saldo: true,
            ver_puntaje: true,
            foto_perfil: "true true true",
            email: "true false false",
            nombre: "true true true",
            apellido: "false false false",
            tipo_documento: false,
            adjunto_optional: false,
            nit: "true true true",
            celular: "false false false",
            fecha_nacimiento: "false false false",
            ubicacion: false,
            pais: "false false false",
            departamento: "false false false",
            ciudad: "false false false"
        };
        //config interna
        self.showLabel = true;
        self.defaultPageTransition = "slide";//slide, slideup, slidedown, slidefade, fade, flip, pop, turn, flow, none
        self.defaultPageTransitionDesktop = "slide";
        if (os === "IOS") {
            self.defaultPageTransition = "none";//slide, slideup, slidedown, slidefade, fade, flip, pop, turn, flow, none
            self.defaultPageTransitionDesktop = "none";
        }
        self.panelDisplay = "overlay"; //overlay, push, reveal
        self.panelOpen = "close"; //open, close
        self.panelBackgroundColor = "#fff"; //overlay, push, reveal
        self.theme = "a"; //a = blanco, b = negro
        self.styleCloseIOS = "";
        self.colorBtnBackIOS = "";
        self.home_background_color = "transparent";
        self.home_background_image = "";
        self.enc_color = ""; // por defecto vacío o false toma el color del tema
        self.enc_height = "42px";
        self.modeMenu = "lists_normal"; //normal / lists_simple / lists_normal / bloq
        if (nw.evalueData(up.usuario)) {
            self.logotipoHeader = "<img src='" + self.domain_rpc + self.carpet_files_extern + "img/logomovilmove.png' />";
            $(".logotipoHeader").addClass("logotipoHeader_home");
        } else {
            self.logotipoHeader = "<img src='" + self.domain_rpc + self.carpet_files_extern + "img/logomovilmove.png' />";

//            if (os === "IOS") {
//
//            } else {
//                if (cordova.platformId === "browser") {
////                openNormal();
//                } else {
//                    nw.getGeoLocation(function () {
//                        nwgeo.getMapLocation(function () {
//                            openNormal();
//                        });
//                    }, false);
//                }
//                function openNormal() {
//                    nw.nativeGeoCoder(nwgeo.latitude, nwgeo.longitude, function (r) {
//                        if (!r) {
//                            nwgeo.initialize(function () {
//                                nwgeo.getLocation(function (ra) {
//                                    console.log(ra);
//                                    nwgeo.countryCode = ra.countryCode;
//                                    nwgeo.countryName = ra.pais;
//                                    nwgeo.city = ra.ciudad;
//                                    nwgeo.allDataLocation = ra;
//                                    console.log("openNormal", nwgeo);
//                                });
//                            }, true);
//                        } else {
//                            nwgeo.countryCode = r.allData.countryCode;
//                            nwgeo.countryName = r.allData.countryName;
//                            nwgeo.city = r.allData.locality;
//                            nwgeo.allDataLocation = r;
//                            console.log("openNormal", nwgeo);
//                        }
//                    });
//                }
//            }
        }
        self.contentCenter = "";
        self.contentFooter = "<br /><br /><br /><p class='footCredits'>Movilmove 2023. All rights reserved. <br />Powered by Grupo <span style='color:firebrick;'>N</span><span style='color:#000;'>w</span> V " + self.version + "</p>";


//        var loading = document.createElement("div");
//        loading.className = "main_loading_initial_without_lib";
//        loading.style = "position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 100000000; background-color: #dc471e; color: rgb(255, 255, 255); display: flex; flex-direction: column; flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center;";
//        loading.innerHTML = "<span>" + config.logotipoHeader + "</span>";
//        document.body.appendChild(loading);
//
//        if (nw.utils.evalueData(up.usuario) && nw.evalueData(up.acepto_terminos_condiciones)) {
//////            nw.loading({text: "", title: config.logotipoHeader, addClass: "loading_home_localiz"});
////            nw.loading({text: "", title: "", addClass: "loading_home_localiz"});
//        } else {
//            setTimeout(function () {
//                loading.remove();
//            }, 1000);
//        }

    },
    destruct: function () {
    },
    members: {
    }
});
