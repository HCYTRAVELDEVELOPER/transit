nw.Class.define("config", {
    extend: nw.start,
    construct: function () {
        var up = nw.userPolicies.getUserData();
        var self = this;
        //generales
        self.version = "0.0.1.0";
        self.name = "Interceptos";
        self.description = "Interceptos";
        self.co_creator = "Interceptos";
        self.moneda = "COP";
        self.credits_creator = "Grupo Nw<br /><a href='https://www.gruponw.com' target='_BLANK'>gruponw.com</a>";
        //developers
        self.showConsoleDeveloper = false;
        self.showConsoleEvents = false;
        self.testing = false;
        self.url_play_store = "https://play.google.com/store/apps/details?id=com.movilmove.movilmove_interceptos";
        self.url_app_store = "";
        self.nameApplication = "com.movilmove.movilmove_interceptos";
        self.validateSession = true;
        self.use_func_first_testing = false;
        self.use_files_extern_by_domain_rpc = true;
        self.carpet_files_extern = "/lib_mobile/user/";
        self.useGeoLocation = true;
        self.ringowID = "2";
        self.ringowApyKey = "66480";
//        self.apiKeyGoogleCloud = "AIzaSyBajx2ZPzBtciFXA9z1LNXFc3daLe-xSk4";
        //netcar
        self.apiKeyGoogleCloud = "AIzaSyDwzPL22nfy3hRDB-kxNSJLc_dpSMGQijY";
        self.initSessionWithEmail = true;
//        self.closeAppToDetectBack = false;
        self.func_first_testing = function () {
//             nw.menuProfile();
            nw.editProfile();
        };
        self.domain_rpc = window.location.origin;
        //login facebook
        self.fb_appid = 365348627590527;
        self.fb_clave_secreta = "33da7feb0ddf10c2578ef00c5f9f550f";
        self.fb_hashes_desarrollo = "OpBLquqUL7sNyfcgNzW3buJK2Rc="; //keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
        self.fb_hashes_activacion = "S1/NXdloaM+gxiTGRf+x94s7C/w="; //keytool -exportcert -alias YOUR_RELEASE_KEY_ALIAS -keystore YOUR_RELEASE_KEY_PATH | openssl sha1 -binary | openssl base64
        self.changePass = false;
        self.activeLatsConnect = false;
        self.requiredUpdateLastVersion = false;
        // configuracion menu
        self.menu_crear_ayuda = false;
        //config login
        self.contentCenterInLogin = "<h1 class='titleEnc'>Iniciar sesión</h1>";
        self.login_generate_code = false;
        self.login_solicitar_code = false;
        self.login_crear_cuenta = true;
        self.login_background_color = "transparent";
        self.login_background_image = "img/home-img1.jpg";
        self.useFree = false; //open, close
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
//            pedir_empresa: 1,
            pedir_empresa: 14,
            perfil: 1,
            pedir_genero: false,
            pedir_pais: true,
            pedir_departamento_geo: false,
            pedir_ciudad: true,
            pedir_fecha_nacimiento: false,
            pedir_politicas: true,
            pedir_politicas_text: "Al ingresar acepto las políticas de uso <a target='_BLANK' href='https://www.movilmove.com/politicas'>Ver las políticas aquí</a>",
            pedir_politicas_in_session_create: false,
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
            email: "true false true",
            nombre: "true true true",
            apellido: "false false false",
            nit: "true true true",
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
        self.panelDisplay = "overlay"; //overlay, push, reveal
        self.panelOpen = "open"; //open, close
        self.panelBackgroundColor = "#fff"; //overlay, push, reveal
        self.theme = "a"; //a = blanco, b = negro
        self.styleCloseIOS = "";
        self.colorBtnBackIOS = "";
        self.home_background_color = "transparent";
        self.home_background_image = "";
        self.enc_color = "#bb3e20"; // por defecto vacío o false toma el color del tema
        self.enc_height = "42px";
        self.modeMenu = "lists_normal"; //normal / lists_simple / lists_normal / bloq
        if (nw.evalueData(up.usuario)) {
            self.logotipoHeader = "<img src='img/Logo-interceptos.jpg' />";
            $(".logotipoHeader").addClass("logotipoHeader_home");
//            $("body").append("<div class='container-grid-all'></div>");
//            var ht = "";
//            ht += "<div class='containMapAndOpened'>";
//            ht += "<div class='divInitBg divInitBg1'></div><div class='divInitBg divInitBg2'></div>";
//            ht += "</div>";
//            $("body").append(ht);
        } else {
            self.logotipoHeader = "<img src='img/Logo-interceptos.jpg' />";

            nw.getGeoLocation(function () {
                nwgeo.getMapLocation(function () {
//                    openNormal();
                });
            }, false);
            function openNormal() {
                nw.nativeGeoCoder(nwgeo.latitude, nwgeo.longitude, function (r) {
                    console.log(r);
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
        self.contentCenter = "";
        self.contentFooter = "<br /><br /><br /><p class='footCredits'>Interceptos 2020. Todos los derechos reservados. <br />Powered by Grupo <span style='color:firebrick;'>N</span><span style='color:#000;'>w</span> V " + self.version + "</p>";
    },
    destruct: function () {
    },
    members: {
    }
});