nw.Class.define("config", {
    extend: nw.start,
    construct: function () {
        var up = nw.userPolicies.getUserData();
        var os = nw.utils.getMobileOperatingSystem();
        var self = this;
//        console.log("newRouteRelease:::::.", newRouteRelease);
        var get = nw.getGET();
        console.log("get", get);
        if (get) {
            console.log("get.empresa", get.empresa);
            console.log("get.createAccount", get.createAccount);
            console.log("get.code_referido", get.code_referido);
            if (get.empresa == "56" && get.createAccount == "true" && nw.utils.evalueData(get.code_referido)) {
                window.location = "https://play.google.com/store/apps/details?id=movilmove.tecapser.driver&pcampaignid=web_share";
                return;
            }
        }
        //generales
        self.version = "0.0.0.3";
        if (typeof versionInAppLibDevice !== "undefined") {
            self.version = versionInAppLibDevice;
        }
        var datas = {};
        datas[""] = "Select";
        datas["LI"] = "License";
        datas["SS"] = "Social Security";
        datas["IT"] = "ITIN";
        self.labelsAccountTypeDocs = datas;
        self.tipo_doc = datas;

        self.bycompanyidiomas = true;
        config.detectLowSignal = false;
        self.useTranslateStr = true;
        self.idiomaPorDefecto = "EN";
        self.name = "Tecapser Driver";
        self.description = "Tecapser Driver";
        self.co_creator = "GrupoNw";
        self.moneda = "USD";
        self.country = "EE.UU";
        self.decimales = ".00";
        self.indicativo = "1";
        self.accountAdminBancos = true;
        self.accountAdminRetiros = true;
        self.accountAdminPagarEmpresa = true;
        self.preoperacional_obligatorio = true;
        self.emailSupport = "tecapsersolutions@gmail.com";
        self.usaFechaVencimientoSaldo = false;
        self.precioMinimoIgualInicio = false;
        self.precioFinalIgualInicio = false;
        self.usaPreoperacional = true;
        self.usaRecargas = false;
        self.usaReferidos = true;
        self.usaCupones = true;
        self.paymentStore = "payu";
        self.credits_creator = "Grupo Nw<br /><a href='https://www.gruponw.com' target='_BLANK'>gruponw.com</a>";
        //developers
        self.showConsoleDeveloper = false;
        self.showConsoleEvents = false;
        self.testing = false;
        self.url_play_store = "https://play.google.com/store/apps/details?id=movilmove.tecapser.driver";
        self.url_app_store = "";
        self.nameApplication = "com.movilmove.movilmove.tecapser.driver";
        self.useGPSBackgroundMode = true;
        self.modeMapa = "styleUber2";
        self.useGPSBackgroundMode_explication = "mostrar servicios y compartir su ubicación con los pasajeros a bordo de un servicio en un mapa";
        self.configureBackgroundMode = {
            title: self.name,
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
        //nueva 2021-04-05 jasond
//        self.keyApiGoogleMaps = "AIzaSyACNy07A4kREm7VTt6ucGPSTJTMPfSi3nM";
//        self.keyApiGoogleMaps = "AIzaSyCgYA9SlMJf2T_Z477v9PP5DMV2E3mYzYU"; //desarrollonw1@gmail.com 04Abril2023 key producción
//        self.fechaLanzamiento = '09/20/2021 8:00 AM';
        self.fechaLanzamiento = false;
//        self.titleReferidoUser = "¡Earn more with " + self.name + "!";
        self.titleReferidoUser = self.name;
        self.bodyReferidoUser = up.nombre + " referred you to join as a user " + self.name + ", the only transportation line in the EE. UU, link: {link}";
        self.titleReferidoDriver = self.name;
        self.bodyReferidoDriver = up.nombre + " referred you to join as a driver " + self.name + ", the only transportation line in the EE. UU, link: {link}";
        self.initSessionWithEmail = true;
        self.ringowID = "2";
        self.ringowApyKey = "66480";
        self.closeAppToDetectBack = false;
        self.use_func_first_testing = false;
        self.func_first_testing = function () {
            nw.testingSendNotificactions();
        };

        self.usePingServer = false;
        self.getUseRpcQxnw = true;

        self.domain_rpc = "https://192.168.1.64";
        self.empresa_id = 56;
        if (cordova.platformId !== "browser" && os === "ANDROID" || os === "IOS") {
            self.empresa_id = 56;
            self.domain_rpc = "https://app.movilmove.com";
        }
        var get = nw.getGET();
        if (nw.evalueData(get)) {
            if (nw.evalueData(get.conf)) {
                self.empresa_id = 56;
                self.domain_rpc = "https://app.movilmove.com";
            }
        }
        self.empresa_id = 56;
        self.domain_rpc = "https://app.movilmove.com";

        self.domain_rpc = dom;
        console.log("self.domain_rpc::: ", self.domain_rpc);

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
        self.activesaveAllPosition = false;
        self.id_servi_ubic = false;
        self.requiredUpdateLastVersion = false;
        // configuracion menu
        self.menu_crear_ayuda = false;
        //config login
        self.contentCenterInLogin = "<div class='titleEncContain'>Driver, log in</div>";
        self.login_generate_code = false;
        self.login_solicitar_code = false;
        self.login_crear_cuenta = true;
        self.login_background_color = "transparent";
        self.login_background_image = "";
//        self.login_background_image = self.domain_rpc + self.carpet_files_extern + "img/logo_Tecapser.png";
        self.useFree = false; //open, close
        self.config_crear_cuenta = {
            verificar_celular_con_codigo: false,
            page: 3,
            estado: "activo", //activo,preregistrado
            pedir_perfil: false,
            pedir_genero: true,
            pedir_nombre_y_apellidos: true,
            pedir_apellido: true,
            pedir_documento: false,
            pedir_celular: true,
            pedir_direccion: false,
            pedir_pais: true,
            pedir_empresa: self.empresa_id,
            terminal: 5909,
            perfil: 2,
            pedir_departamento_geo: false,
            pedir_ciudad: true,
            pedir_fecha_nacimiento: false,
            pedir_politicas: true,
            pedir_politicas_text: "<span class='textpoliticsspan'>By entering I accept the usage policies <a target='_BLANK' href='https://app.movilmove.com/app/policies.php?empresa=56&perfil=2'>Ver las políticas aquí­</a></span>",
            pedir_politicas_link: "https://app.movilmove.com/app/policies.php?empresa=56&perfil=2",
            pedir_politicas_in_session_create: true,
            pedir_suscribirse: false,
            pedir_suscribirse_texto: "¿Suscribirse a nuestro boletín?",
            permitir_registro_login_con_facebook: false,
            pedir_confirmar_pass: true
        };
        //config editar perfil // visible enabled required
        self.edit_profile = {
            permitir_editar: true,
            permitir_cambiar_clave: true,
            eliminar_cuenta: true,
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
//            self.logotipoHeader = "<img src='" + self.domain_rpc + self.carpet_files_extern + "img/Logo-Tecapser-Usuarios-200x200.png' />";
            self.logotipoHeader = "<img src='" + self.domain_rpc + "/" + newRouteRelease + "/driver/" + "img/tecapser_driver_400px.png' />";
            $(".logotipoHeader").addClass("logotipoHeader_home");
        } else {
//            self.logotipoHeader = "<img src='" + self.domain_rpc + self.carpet_files_extern + "img/tecapser_driver_400px.png' />";
            self.logotipoHeader = "<img src='" + self.domain_rpc + "/" + newRouteRelease + "/driver/" + "img/tecapser_driver_400px.png' />";

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
        self.contentFooter = "<br /><br /><br /><p class='footCredits'>Tecapser 2023. All rights reserved. <br />Powered by Grupo <span style='color:firebrick;'>N</span><span style='color:#000;'>w</span> V " + self.version + "</p>";
    },
    destruct: function () {
    },
    members: {
    }
});


