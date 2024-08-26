nw.Class.define("menu", {
    extend: nw.menu,
    construct: function () {
        var f = this;
        f.id = "menu";
        var up = nw.userPolicies.getUserData();
        if (nw.utils.evalueData(up.usuario) && nw.evalueData(up.acepto_terminos_condiciones)) {
//            abrir("Cargando recursos... Espera por favor", function () {
//            nw.dialog("¡Bienvenid@ " + up.nombre + "!");
//            });
        }
        var intentos = 0;
        function abrir(textloading, callback) {
            nw.remove(".loading_historico");
            var text = textloading;
            if (intentos > 5) {
                text = "Parece que tienes conexión baja (intentos " + intentos + ")... " + textloading;
            }
            nw.loading({text: "", title: text, addClass: "loading_historico"});
            intentos++;
            if (typeof main == "undefined") {
                setTimeout(function () {
                    abrir(textloading, callback);
                }, 1000);
                return false;
            }
            if (typeof main.openHistoricoViajes == "undefined") {
                setTimeout(function () {
                    abrir(textloading, callback);
                }, 1000);
                return false;
            }
            callback();
            nw.remove(".loading_historico");
        }

        f.menuLeft = [];
        f.menuLeft.push(
                {
                    position: "left",
                    name: "Histórico de viajes",
                    description: "Histórico de viajes",
                    icon: "material-icons history",
                    callback: function () {
                        abrir("Cargando histórico, espere por favor...", function () {
                            main.openHistoricoViajes();
                        });
                    }
                });

        if (config.usaMetodosDePago) {
            f.menuLeft.push(
                    {
                        position: "left",
                        name: "Métodos de pago",
                        description: "Métodos de pago",
                        icon: "material-icons credit_card",
                        callback: function () {
                            var d = new f_metodo_pago();
                            d.construct();
                        }
                    });
        }
        if (config.usaFavoritos != false) {
            f.menuLeft.push(
                    {
                        position: "left",
                        name: "Lugares guardados",
                        description: "Favoritos",
                        icon: "material-icons place",
                        callback: function () {
                            var d = new l_navtable_favoritos();
                            d.construct();
                        }
                    });
        }
        if (config.usaRecargas) {
            f.menuLeft.push(
                    {
                        position: "left",
                        name: nw.str("Recargas"),
                        description: nw.str("Recargas"),
                        icon: "material-icons ev_station",
                        callback: function () {
                            main.slotRecargas();
                        }
                    });
        }
        if (config.usaReferidos || config.usaCupones) {
            var label = "Cupones y referidos";
            if (config.usaCupones && !config.usaReferidos) {
                label = "Cupones";
            }
            if (!config.usaCupones && config.usaReferidos) {
                label = "Referidos";
            }
            f.menuLeft.push(
                    {
                        position: "left",
                        name: nw.str(label),
                        description: nw.str(label),
                        icon: "material-icons redeem",
                        callback: function () {
                            if (config.usaCupones && !config.usaReferidos) {
                                var d = new f_redimir_cupon();
                                d.construct();
                                return;
                            }
                            if (!config.usaCupones && config.usaReferidos) {
                                var d = new f_referidos();
                                d.construct();
                                return;
                            }
                            var referidos = function () {
                                var d = new f_referidos();
                                d.construct();
                            };
                            var cupones = function () {
                                var d = new f_redimir_cupon();
                                d.construct();
                            };
                            var options = {};
                            options.useDialogNative = false;
                            options.closeEnc = true;
                            options.autocierre = true;
                            options.cleanHtml = false;
                            options.iconAccept = "<i class='material-icons' style='top: 5px;position: relative;'>share</i>";
                            options.iconCancel = "<i class='material-icons' style='top: 5px;position: relative;'>card_giftcard</i> ";
                            options.textAccept = nw.tr("Referidos");
                            options.textCancel = nw.tr("Cupones");
                            nw.dialog(nw.tr("Desea ir a") + "...", referidos, cupones, options);
                        }
                    });
        }
        f.menuLeft.push(
                {
                    position: "left",
                    name: "Mi cuenta",
                    description: "Mi cuenta",
                    icon: "material-icons person",
                    callback: function () {
                        nw.menuProfile();
                    }
                },
//                {
//                    position: "left",
//                    name: "Soporte",
//                    description: "Soporte",
//                    icon: "material-icons headset_mic",
//                    callback: function () {
//                        var d = new f_soporte();
//                        d.construct();
//                    }
//                },
                {
                    position: "left",
                    name: "Salir",
                    description: "Cerrar sesión",
                    icon: "material-icons exit_to_app",
                    callback: function () {
                        nw.closeSession();
                    }
                }
        );
        return f;
    },
    destruct: function () {
    },
    members: {
    }
});