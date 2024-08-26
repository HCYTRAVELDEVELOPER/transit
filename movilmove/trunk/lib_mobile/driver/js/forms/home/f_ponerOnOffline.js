nw.Class.define("f_ponerOnOffline", {
    extend: nw.lists,
    construct: function (self, mode, consult) {
        if (self.debugConstruct) {
            console.log("START_LAUNCH:::::::::::::: f_ponerOnOffline");
        }
        var estado_conexion = "desconectado";
        var up = nw.userPolicies.getUserData();
        if (mode === "online") {
            estado_conexion = "conectado";
            if (!document.querySelector(".cont-radar")) {
                self.getIcon();
            }
            nw.activateBackgroundMode();
        } else {
//            $('.cont-radar').remove();
            nw.inactivateBackgroundMode();
            self.stopSound();
        }
        if (consult === false) {
            resolveModeOffOn(mode);
            return true;
        }
        nw.loading({text: "Por favor espere...", title: "Validando estado"});
        var data = {};
        data.usuario = up.usuario;
        data.empresa = up.empresa;
        data.mode = mode;
        data.estado_conexion = estado_conexion;
        var rpc = new nw.rpc(self.getRpcUrl(), "servicios_conductor");
        rpc.setAsync(true);
        rpc.setLoading(false);
        var func = function (r) {
            console.log("RESPONSE_SERVER:::::::::::::: f_ponerOnOffline", r);
            if (self.debugConstruct) {
            }
            nw.loadingRemove();
            if (r !== true) {
                return false;
            }
            resolveModeOffOn(mode);

            nw.loading({text: "Por favor espere...", title: "Actualizando"});
            setTimeout(function () {
                window.location.reload();
            }, 2000);

        };
        rpc.exec("poner_onoffline", data, func);

        function resolveModeOffOn(mode) {
            if (self.debugConstruct) {
                console.log("CHANGE_STATUS_OFFLINE_ONLINE:::::::::::::: f_ponerOnOffline::resolveModeOffOn", mode);
            }
            if (mode === "online") {
                self.ui.ofline.setVisibility(true);
                self.ui.ofline.setVisibility(false);
                self.idServicesMostrados.pop();
                self.status = "activo";
                window.localStorage.setItem("status_driver_online_offline", "activo");
                self.ui.mapa.setVisibility(true);

                self.ui.status_driver.setVisibility(true);
                self.ui.driver_online.setVisibility(false);

                if (!document.querySelector(".cont-radar")) {
                    self.getIcon();
                }
                nw.activateBackgroundMode();
            } else {
                self.ui.mapa.setVisibility(false);
                self.ui.status_driver.setVisibility(false);
                self.ui.driver_online.setVisibility(true);
                self.ui.ofline.setVisibility(true);
                $('.notifyBarEnc').remove();
                window.localStorage.setItem("status_driver_online_offline", "inactivo");
                self.status = "inactivo";
                self.clearIntervalo();
                var ofline = document.querySelector('.ofline');

                var imgcar = config.domain_rpc + '/lib_mobile/driver/img/carro-off.png';
                if (nw.evalueData(config.iconCarOffline)) {
                    imgcar = config.iconCarOffline;
                }
                ofline.innerHTML = "<div class='div_ofline'><h3>Estas de manera desconectad@, cambia a conectad@ para recibir nuevos servicios</h3><img src='" + imgcar + "'></div>";
//                $('.cont-radar').remove();
                nw.inactivateBackgroundMode();
                self.stopSound();
            }

            if (self.configCliente.conductores_siempre_online == "SI") {
                self.ui.status_driver.setVisibility(false);
                self.ui.driver_online.setVisibility(false);
            }

            $(".dataUserStatus").remove();
            $(".dataUserNameMail").append("<span class='dataUser dataUserStatus'>" + nw.utils.tr(self.status) + "</span>");
        }
    },
    destruct: function () {
    },
    members: {
    }
});