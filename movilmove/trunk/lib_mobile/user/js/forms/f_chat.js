nw.Class.define("f_chat", {
    extend: nw.forms,
    construct: function (datos) {
        var self = this;
        self.id = "f_chat";
        self.showBack = true;
        self.closeBack = false;
//        self.transition = "slide";
        self.textClose = "Volver";
        self.setTitle = "Chat / " + datos.conductor;
        self.createBase();
        var fields = [
            {
                name: "frame_chat_form",
                label: "Cargando ...",
                type: "html",
                visible: true
            }
        ];
        self.setFields(fields);
        self.show();

        self.datos = datos;

        self.tokens = false;
        self.id_clean = datos.id;
        self.isParada = "NO";
        console.log("datos.id", datos.id);
        console.log("datos.id.indexOf(parada)", datos.id.indexOf("parada"));
        if (datos.id.indexOf("parada") != -1) {
            self.isParada = "SI";
            console.log("datos.id.split(_parada_)", datos.id.split("_parada_"));
            self.id_clean = datos.id.split("_parada_")[1];
        }
        console.log("self.id_clean", self.id_clean);
        console.log("self.datos", self.datos);

//        self.onAppear(function () {
//            setTimeout(function () {
//                nw.loading({text: "Por favor espere...", title: "Cargando chat..."});
//                self.frame();
//            }, 100);
//        });
        self.onAppear(function () {
            setTimeout(function () {
                nw.loading({text: "Por favor espere...", title: "Cargando chat..."});
                self.getTokens(function () {
                    self.frame();
                });
            }, 100);
        });
    },
    destruct: function () {
    },
    members: {
        getTokens: function getTokens(callback) {
//            nw.loading();
            var self = this;
//            if (nw.evalueData(window.localStorage.getItem("tokensInChat_" + self.id_clean))) {
//                var r = window.localStorage.getItem("tokensInChat_" + self.id_clean);
//                r = JSON.parse(r);
//                self.tokens = r;
//                console.log("getTokens:::local_data", r);
//                return callback();
//            }
            var up = nw.userPolicies.getUserData();
            var data = {};
            data.id = self.id_clean;
            data.es_parada = self.isParada;
            data.empresa = up.empresa;
            data.usuario = up.usuario;
            data.perfil = up.perfil;
            var rpc = new nw.rpc(self.getRpcUrl(), "servicios");
            console.log("getTokens:::dataSend", data);
            rpc.setAsync(true);
            rpc.setLoading(false);
            var func = function (r) {
                console.log("getTokens:::responseServer", r);
                if (typeof r == "string") {
                    nw.loadingRemove();
                    if (r == "pasajero_no_configurado") {
                        nw.dialog("El servicio no tiene configurado un pasajero");
                    } else {
                        var res = "<strong style='color:red;'>" + nw.tr("¡Importante! No podrás comunicarte por el siguiente motivo:") + " </strong>";
                        res += "<br />" + nw.tr(r);
                        nw.dialog(res);
                    }
                    nw.back();
                    return false;
                }
                self.tokens = r;
                callback();
                console.log("getTokens:::server_data", JSON.stringify(r));
                window.localStorage.setItem("tokensInChat_" + self.id_clean, JSON.stringify(r));
            };
            rpc.exec("getTokensByChat", data, func);
        },
        frame: function () {
            var self = this;
            var datos = self.datos;
            var up = nw.userPolicies.getUserData();
//            var domain = nw.utils.cleanUserNwC(config.domain_rpc);
            var frame = document.querySelector('.framechat_conversation');
            if (!frame) {

                var url = "";
                url += config.domain_rpc;
                url += "/nwlib6/nwproject/modules/webrtc/v6/chat/index.html?";
//                url += "room=" + domain + datos.id;
                url += "room=" + datos.id;
                url += "&setUserName=" + up.nombre + " (Pasajero)";
                url += "&setUserPhoto=" + up.foto_perfil;
                url += "&setUserEmail=" + up.email;
                url += "&id_user=" + up.id_usuario;
                url += "&saveToken=true";
                url += "&useMicroMsg=false";
                url += "&btnEmoji=false";
                if (nw.utils.evalueData(config.idiomaPorDefecto)) {
                    url += "&languaje=" + config.idiomaPorDefecto;
                }
                if (nw.utils.evalueData(main.configCliente.keyGoogleNotificacionPush)) {
                    url += "&keyGoogleNotificacionPush=" + main.configCliente.keyGoogleNotificacionPush;
                }
                if (nw.utils.evalueData(self.tokens)) {
                    var tokens = JSON.stringify(self.tokens);
                    console.log("tokens", tokens);
                    var encodedString = btoa(tokens);
                    console.log("encodedString", encodedString);
                    url += "&tokensAllGroup=" + encodedString;
                }
                var c = main.configCliente;
                var conf = {is_movilmove: true, usa_firebase: c.usa_firebase, usa_firebase_modo_pruebas: c.usa_firebase_modo_pruebas};
                conf = JSON.stringify(conf);
                url += "&configAditional=" + btoa(conf);
//                url += "&tokenUser=false";
//                if (nw.evalueData(window.localStorage.getItem("token"))) {
//                    url += "&tokenUserSet=" + window.localStorage.getItem("token");
//                }
                console.log("url", url);


                frame = document.createElement('iframe');
                frame.className = 'framechat_conversation framechat_conversation_' + datos.id;
                frame.id = 'framechat_conversation';
//                frame.src = config.domain_rpc + "/nwlib6/nwproject/modules/webrtc/v6/chat/index.html?room=" + domain + datos.id + "&setUserName=" + up.nombre + " (User)&setUserPhoto=" + up.foto_perfil + "&setUserEmail=" + up.email + "&id_user=" + up.id_usuario + "&saveToken=false";
                frame.src = url;
                frame.allow = "geolocation; microphone; camera";
                frame.onload = function () {
                    nw.loadingRemove();
                };
                self.ui.frame_chat_form.setValue(frame);
            }
        }
    }
});