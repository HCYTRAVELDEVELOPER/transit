nw.Class.define("config", {
    extend: nw.start,
    construct: function () {
        var up = nw.userPolicies.getUserData();
        var self = this;
        //generales
        self.version = "0.0.0.8";
        self.name = "MovilMove";
        self.description = "MovilMove";
        self.co_creator = "MovilMove";
        self.moneda = "COP";
        self.credits_creator = "Grupo Nw<br /><a href='https://www.gruponw.com' target='_BLANK'>gruponw.com</a>";
        //developers
        self.showConsoleDeveloper = false;
        self.showConsoleEvents = false;
        self.testing = false;
        self.url_play_store = "https://play.google.com/store/apps/details?id=com.movilmove";
        self.url_app_store = "";
        self.nameApplication = "com.movilmove";
        self.use_func_first_testing = false;
        self.use_files_extern_by_domain_rpc = true;
        self.carpet_files_extern = "/lib_mobile/user/";
        self.useGeoLocation = true;
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
            pedir_empresa: 1,
            perfil: 1,
            pedir_genero: true,
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
//        self.home_background_color = "#f1f1f1";
        self.home_background_color = "transparent";
        self.home_background_image = "";
        self.enc_color = "#bb3e20"; // por defecto vacío o false toma el color del tema
        self.enc_height = "42px";
        self.modeMenu = "lists_normal"; //normal / lists_simple / lists_normal / bloq
        if (nw.evalueData(up.usuario)) {
            self.logotipoHeader = "<img src='img/logomovilmove.png' />";
            $(".logotipoHeader").addClass("logotipoHeader_home");
//            $("body").append("<div class='container-grid-all'></div>");

            var ht = "";
            ht += "<div class='containMapAndOpened'>";
            ht += "<div class='divInitBg divInitBg1'></div><div class='divInitBg divInitBg2'></div>";
            ht += '<div class="map_preload_static" style="height: 100%; width: 100%; position: absolute; top: 0px; left: 0px; background-color: rgb(229, 227, 223);"><div class="gm-style-premap" style="position: absolute; z-index: 0; left: 0px; top: 0px; height: 100%; width: 100%; padding: 0px; border-width: 0px; margin: 0px;"><div tabindex="0" style="position: absolute; z-index: 0; left: 0px; top: 0px; height: 100%; width: 100%; padding: 0px; border-width: 0px; margin: 0px; cursor: url(&quot;https://maps.gstatic.com/mapfiles/openhand_8_8.cur&quot;), default; touch-action: none;"><div style="z-index: 1; position: absolute; left: 50%; top: 50%; width: 100%; transform: translate(0px, 0px);"><div style="position: absolute; left: 0px; top: 0px; z-index: 100; width: 100%;"><div style="position: absolute; left: 0px; top: 0px; z-index: 0;"><div style="position: absolute; z-index: 983; transform: matrix(1, 0, 0, 1, -184, -10);"><div style="position: absolute; left: 0px; top: 0px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: -256px; top: 0px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 0px; top: 256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: -256px; top: 256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: -512px; top: 256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: -512px; top: 0px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: -512px; top: -256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: -512px; top: -512px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: -256px; top: -256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 0px; top: -256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: -256px; top: -512px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 0px; top: -512px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 256px; top: -256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 256px; top: -512px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 512px; top: -512px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 512px; top: -256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 256px; top: 0px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 256px; top: 256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 512px; top: 0px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div><div style="position: absolute; left: 512px; top: 256px; width: 256px; height: 256px;"><div style="width: 256px; height: 256px;"></div></div></div></div></div><div style="position: absolute; left: 0px; top: 0px; z-index: 101; width: 100%;"></div><div style="position: absolute; left: 0px; top: 0px; z-index: 102; width: 100%;"></div><div style="position: absolute; left: 0px; top: 0px; z-index: 103; width: 100%;"></div><div style="position: absolute; left: 0px; top: 0px; z-index: 0;"><div style="position: absolute; z-index: 983; transform: matrix(1, 0, 0, 1, -184, -10);"><div style="position: absolute; left: 0px; top: 0px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38017!3i63258!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=58982" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: -256px; top: 0px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38016!3i63258!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=2085" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: -256px; top: -256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38016!3i63257!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=15157" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 0px; top: -256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38017!3i63257!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=72054" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 256px; top: -256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38018!3i63257!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=128951" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 256px; top: 0px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38018!3i63258!4i256!2m3!1e0!2sm!3i498213122!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=16708" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 256px; top: 256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38018!3i63259!4i256!2m3!1e0!2sm!3i498213122!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=3636" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 0px; top: 256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38017!3i63259!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=45910" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: -256px; top: 256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38016!3i63259!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=120084" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: -512px; top: 256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38015!3i63259!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=63187" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: -512px; top: 0px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38015!3i63258!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=76259" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: -512px; top: -256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38015!3i63257!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=89331" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: -512px; top: -512px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38015!3i63256!4i256!2m3!1e0!2sm!3i498212990!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=102403" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: -256px; top: -512px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38016!3i63256!4i256!2m3!1e0!2sm!3i498212954!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=3184" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 0px; top: -512px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38017!3i63256!4i256!2m3!1e0!2sm!3i498212954!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=60081" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 256px; top: -512px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38018!3i63256!4i256!2m3!1e0!2sm!3i498212978!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=15404" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 512px; top: -512px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38019!3i63256!4i256!2m3!1e0!2sm!3i498212978!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=72301" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 512px; top: -256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38019!3i63257!4i256!2m3!1e0!2sm!3i498212978!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=59229" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 512px; top: 0px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38019!3i63258!4i256!2m3!1e0!2sm!3i498213122!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=73605" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div><div style="position: absolute; left: 512px; top: 256px; width: 256px; height: 256px; transition: opacity 200ms linear 0s;"><img draggable="false" alt="" role="presentation" src="https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i17!2i38019!3i63259!4i256!2m3!1e0!2sm!3i498213122!3m17!2ses-419!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy5lOmx8cC52Om9mZixzLnQ6MjF8cC52Om9mZixzLnQ6MjB8cC52Om9mZg!4e0&amp;key=AIzaSyDk4C4EBWgjuL1eBnJlu1J80WytEtSIags&amp;token=60533" style="width: 256px; height: 256px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></div></div></div></div></div></div></div>';
            ht += "</div>";
            $("body").append(ht);
//            var inter = setInterval(function () {
//                var d = document.querySelector(".gm-style");
//                if (d) {
//                    clearInterval(inter);
//                    setTimeout(function () {
//                        $(".containMapAndOpened").remove();
//                    }, 2000);
//                }
//            }, 3000);

        } else {
            self.logotipoHeader = "<img src='img/logo-movilmove-mo.png' />";
        }
        self.contentCenter = "";
        self.contentFooter = "<br /><br /><br /><p class='footCredits'>Movilmove 2019. Todos los derechos reservados. <br />Powered by Grupo <span style='color:firebrick;'>N</span><span style='color:#000;'>w</span> V " + self.version + "</p>";
    },
    destruct: function () {
    },
    members: {
    }
});