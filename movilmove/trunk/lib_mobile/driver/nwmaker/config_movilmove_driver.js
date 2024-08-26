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

        var os = nw.utils.getMobileOperatingSystem();
        var self = this;

//        console.log(window.location.host);
        //generales
        self.version = "0.0.0.3";
        //force update in android, (files intern)
//        if (cordova.platformId !== "browser" && os === "ANDROID" && typeof versionInAppLibDevice !== "undefined") {
//        if (os === "ANDROID" && typeof versionInAppLibDevice !== "undefined") {
        if (typeof versionInAppLibDevice !== "undefined") {
            self.version = versionInAppLibDevice;
        }
        self.useTranslateStr = true;
        self.idiomaPorDefecto = "EN";
        self.name = "Movilmove";
        self.description = "Movilmove software de transporte";
        self.co_creator = "GrupoNw";
        self.moneda = "COP";
        self.country = "COL";
        self.country_text = "Colombia";
//        self.decimalesFixed = 2;
        self.decimales = ".00";
        self.indicativo = "57";
        self.accountAdminBancos = true;
        self.accountAdminRetiros = true;
        self.accountAdminPagarEmpresa = true;
        self.preoperacional_obligatorio = true;
        self.emailSupport = "info@gruponw.com";
        self.usaFechaVencimientoSaldo = false;
        self.precioMinimoIgualInicio = true;
        self.precioFinalIgualInicio = true;
        self.usaPreoperacional = true;
        self.usaRecargas = true;
        self.usaReferidos = true;
        self.usaCupones = true;
        self.credits_creator = "Grupo Nw<br /><a href='https://www.gruponw.com' target='_BLANK'>gruponw.com</a>";
        //developers
        self.showConsoleDeveloper = false;
        self.showConsoleEvents = false;
        self.testing = false;
        self.url_play_store = "https://play.google.com/store/apps/details?id=com.movilmove.movilmove.driver";
        self.url_app_store = "";
        self.nameApplication = "com.movilmove.movilmove.driver";
        self.useGPSBackgroundMode = true;
        self.modeMapa = "styleUber2";
        self.useGPSBackgroundMode_explication = "mostrar servicios y compartir su ubicación con los pasajeros a bordo de un servicio en un mapa";
        self.configureBackgroundMode = {
            title: "Movilmove Drivers",
            text: "Trabajando en segundo plano..."
        };
        self.textBtnAcceptService = "Aceptar";

        self.validateSession = true;
        self.use_files_extern_by_domain_rpc = true;

        if (typeof newRouteRelease != "undefined") {
            self.carpet_files_extern = newRouteRelease + "/driver/";
        } else {
            self.carpet_files_extern = "/lib_mobile/driver/";
        }

        self.useGeoLocation = true;
//        self.apiKeyGoogleCloud = "AIzaSyDwzPL22nfy3hRDB-kxNSJLc_dpSMGQijY";
        self.keyApiGoogleMaps = "AIzaSyCgYA9SlMJf2T_Z477v9PP5DMV2E3mYzYU"; //desarrollonw1@gmail.com 04Abril2023 key producción
//        self.fechaLanzamiento = '09/20/2021 8:00 AM';
        self.fechaLanzamiento = false;
        self.titleReferidoUser = "¡Gana más con " + self.name + "!";
        self.bodyReferidoUser = "¡Gana más con " + self.name + "! " + up.nombre + " te refirió para que te unas como usuario a " + self.name + ", la línea de transporte única en " + self.country_text + ", enlace: {link}";
        self.titleReferidoDriver = "¡Gana más con " + self.name + "!";
        self.bodyReferidoDriver = "¡Gana más con " + self.name + "! " + up.nombre + " te refirió para que te unas como conductor a " + self.name + ", la línea de transporte única en " + self.country_text + ", enlace: {link}";
        self.initSessionWithEmail = true;
        self.ringowID = "2";
        self.ringowApyKey = "66480";
        self.closeAppToDetectBack = false;
        self.use_func_first_testing = false;
        self.func_first_testing = function () {
//             nw.menuProfile();
            nw.testingSendNotificactions();
        };

        self.usePingServer = false;
        self.getUseRpcQxnw = true;

//        self.domain_rpc = "https://app.movilmove.com";
//        self.domain_rpc = "http://movilmove.loc";
//        self.domain_files = "http://movilmove.loc";
        self.terminal_id = 2;
        self.empresa_id = 24;
//        self.empresa_id = 49; //AGL
        self.domain_rpc = "http://movilmove.loc";
//        self.domain_rpc = "http://192.168.1.45/";
        if (cordova.platformId !== "browser" && os === "ANDROID" || os === "IOS") {
            self.empresa_id = 24;
//            self.domain_rpc = "https://app.movilmove.com";
            self.domain_rpc = "https://test.movilmove.com";

            //DEMO ARMONICAR ESPAÑA
//            self.empresa_id = 55;
//            self.terminal_id = 5881;
////            self.domain_rpc = "https://test.movilmove.com";
//            self.domain_rpc = "https://eu.movilmove.com";
//            self.moneda = "EUR";
//            self.country = "ESP";
//            self.country_text = "España";
//            self.decimales = ".00";
//            self.indicativo = "34";
        }

//        self.terminal_id = 2;
//        self.empresa_id = 24; //Movilmove
//        self.domain_rpc = "https://test.movilmove.com";
//        self.domain_rpc = "https://app.movilmove.com";
//        self.domain_files = "http://movilmove.loc";
//        self.domain_rpc = "http://192.168.1.45/";
//        self.domain_rpc = "http://movilmove.loc";
//        self.domain_rpc = "https://test.movilmove.com";
//        self.domain_files = "http://192.168.1.45/";
        self.domain_rpc = dom;
//        if (self.domain_rpc == "http://192.168.1.45" || self.domain_rpc == "http://movilmove.loc" || self.domain_rpc == "http://movilmove.loc/") {
//            self.empresa_id = 49; //AGL
//        }

//        //DEMO ARMONICAR ESPAÑA
//        self.empresa_id = 55;
//        self.terminal_id = 5881;
//        self.domain_rpc = "https://test.movilmove.com";
//        self.moneda = "EUR";
//        self.country = "ESP";
//        self.country_text = "España";
//        self.decimales = ".00";
//        self.indicativo = "34";

        self.iconDriverMap = self.domain_rpc + self.carpet_files_extern + '/img/pindriver_1_35.png';

        self.iconDriverMap = self.domain_rpc + self.carpet_files_extern + '/img/pindriver_1_35.png';
        self.iconDriverPuntoB = self.domain_rpc + '/lib_mobile/driver/img/marker_b.png';

        self.pedirDatosContactoEmergencia = true;
        self.vehiculo_publico_particular = false;
        self.vehiculo_poliza_contractual = true;
        self.vehiculo_poliza_todoriesgo = true;

        //login facebook
        self.fb_appid = 365348627590527;
        self.fb_clave_secreta = "33da7feb0ddf10c2578ef00c5f9f550f";
        self.fb_hashes_desarrollo = "OpBLquqUL7sNyfcgNzW3buJK2Rc="; //keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
        self.fb_hashes_activacion = "S1/NXdloaM+gxiTGRf+x94s7C/w="; //keytool -exportcert -alias YOUR_RELEASE_KEY_ALIAS -keystore YOUR_RELEASE_KEY_PATH | openssl sha1 -binary | openssl base64
        self.changePass = false;
        self.activeLatsConnect = true;
        self.activeLatsConnectTime = 15000; // 15 segs
        self.activesaveAllPosition = false;
        self.id_servi_ubic = false;
        self.requiredUpdateLastVersion = true;
        self.paymentStore = "Wompi";
        // configuracion menu
        self.menu_crear_ayuda = false;
        //config login
        self.contentCenterInLogin = "<div class='titleEncContain'><img class='titleEnc' src='" + self.domain_rpc + self.carpet_files_extern + "img/Login-Conductor-Icono.png'></div>";
        self.login_generate_code = false;
        self.login_solicitar_code = false;
        self.login_crear_cuenta = true;
        self.login_background_color = "transparent";
        self.login_background_image = self.domain_rpc + self.carpet_files_extern + "img/Login-Conductor-Fondo.jpg";
        self.useFree = false; //open, close
        self.config_crear_cuenta = {
            verificar_celular_con_codigo: false,
            page: 3,
            estado: "activo", //activo,preregistrado
            pedir_perfil: false,
            pedir_genero: true,
            pedir_nombre_y_apellidos: true,
            pedir_apellido: true,
            pedir_documento: true,
            pedir_celular: true,
            pedir_direccion: false,
            pedir_pais: true,
            pedir_empresa: self.empresa_id,
            terminal: self.terminal_id,
            perfil: 2,
            pedir_departamento_geo: false,
            pedir_ciudad: true,
            pedir_fecha_nacimiento: false,
            pedir_politicas: true,
            pedir_politicas_text: "<span class='textpoliticsspan'>Al ingresar acepto las políticas de uso <a target='_BLANK' href='https://app.movilmove.com/app/policies.php?empresa=24&perfil=2'>Ver las políticas aquí­</a></span>",
            pedir_politicas_link: "https://app.movilmove.com/app/policies.php?empresa=24&perfil=2",
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
            eliminar_cuenta: false,
            ver_saldo: true,
            ver_puntaje: true,
            foto_perfil: "true true true",
            email: "true false true",
            nombre: "true true true",
            apellido: "false false false",
            nit: "true false true",
            celular: "true true true",
            fecha_nacimiento: "true true true",
            ubicacion: true,
            pais: "true true true",
            departamento: "false false false",
            ciudad: "true true true"
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
        self.panelOpen = "open"; //open, close
        self.panelBackgroundColor = "#fff"; //overlay, push, reveal
        self.theme = "a"; //a = blanco, b = negro
        self.styleCloseIOS = "";
        self.colorBtnBackIOS = "";
//        self.home_background_color = "#f1f1f1";
        self.home_background_color = "transparent";
        self.home_background_image = "";
        self.enc_color = "transparent"; // por defecto vacÃ­o o false toma el color del tema
        self.enc_height = "42px";
        self.modeMenu = "lists_normal"; //normal / lists_simple / lists_normal / bloq
        if (nw.evalueData(up.usuario)) {
            self.logotipoHeader = "<img src='" + self.domain_rpc + self.carpet_files_extern + "img/logomovilmove.png' />";
            $(".logotipoHeader").addClass("logotipoHeader_home");
        } else {
            self.logotipoHeader = "<img src='" + self.domain_rpc + self.carpet_files_extern + "img/logomovilmove.png' />";


            if (cordova.platformId === "browser") {
//                openNormal();
            } else {
//                tomaUbiLogin();
//                setTimeout(function () {
//                    if (nw.evalueData(window.localStorage.getItem("nwPermisionBakgroundPositionModeLogin"))) {
//                        tomaUbiLogin();
//                    } else {
//                        app.inBackgroundQuestion(function () {
//                            window.localStorage.setItem("nwPermisionBakgroundPositionModeLogin", "true");
//                            tomaUbiLogin();
//                        });
//                    }
//                }, 2000);
            }

            function tomaUbiLogin() {
                nw.getGeoLocation(function () {
                    nwgeo.getMapLocation(function () {
                        openNormal();
                    });
                }, false);
                function openNormal() {
                    nw.nativeGeoCoder(nwgeo.latitude, nwgeo.longitude, function (r) {
                        if (!r) {
                            nwgeo.initialize(function () {
                                nwgeo.getLocation(function (ra) {
                                    console.log(ra);
                                    nwgeo.countryCode = ra.countryCode;
                                    nwgeo.countryName = ra.pais;
                                    nwgeo.city = ra.ciudad;
                                    nwgeo.allDataLocation = ra;
                                    console.log("openNormal", nwgeo);
                                });
                            }, true);
                        } else {
                            nwgeo.countryCode = r.allData.countryCode;
                            nwgeo.countryName = r.allData.countryName;
                            nwgeo.city = r.allData.locality;
                            nwgeo.allDataLocation = r;
                            console.log("openNormal", nwgeo);
                        }
                    });
                }
            }
        }
        self.contentCenter = "";
        self.contentFooter = "<br /><br /><br /><p class='footCredits'>Movilmove 2022. Todos los derechos reservados. <br />Powered by Grupo <span style='color:firebrick;'>N</span><span style='color:#000;'>w</span> V " + self.version + "</p>";

//        var loading = document.createElement("div");
//        loading.className = "main_loading_initial_without_lib";
//        loading.style = "position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 100000000; background-color: #dc471e; color: rgb(255, 255, 255); display: flex; flex-direction: column; flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center;";
////        loading.innerHTML = "<span>Cargando...</span>";
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
//        setTimeout(function () {
//            loading.remove();
//        }, 3000);

    },
    destruct: function () {
    },
    members: {
    }
});


