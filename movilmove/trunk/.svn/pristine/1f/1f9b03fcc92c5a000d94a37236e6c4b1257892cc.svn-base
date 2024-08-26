nw.Class.define("menu", {
    extend: nw.menu,
    construct: function () {
        var f = this;
        var c = config.config_crear_cuenta;
        var up = nw.userPolicies.getUserData();
//       if (nw.utils.evalueData(up.usuario) && nw.evalueData(up.acepto_terminos_condiciones)) {
//            abrir("Cargando recursos... Espera por favor", function () {
////            nw.dialog("¡Bienvenid@ " + up.nombre + "!");
//            });
//        }
        var intentos = 0;
        function abrir(textloading, callback) {
            nw.remove(".loading_historico");
            var text = textloading;
            if (intentos > 5) {
                text = nw.tr("Parece que tienes conexión baja (intentos") + intentos + " )... " + textloading;
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

        f.id = "menu";
        f.menuLeft = [];
        f.menuLeft.push(
                {
                    position: "left",
                    name: nw.str("Viajes, reservas"),
                    description: nw.str("Viajes, reservas"),
                    icon: "material-icons card_travel",
                    callback: function () {
                        abrir("Cargando histórico, espere por favor...", function () {
                            main.openHistoricoViajes();
                        });
//                        main.openHistoricoViajes();
                    }
                },
                {
                    position: "left",
                    name: nw.str("Mis vehiculos"),
                    description: nw.str("Mis vehiculos"),
                    icon: "material-icons drive_eta",
                    callback: function () {
                        main.misVehiculos();
                    }
                });
        if (config.usaPreoperacional) {
            f.menuLeft.push(
                    {
                        position: "left",
                        name: nw.str("Preoperacional"),
                        description: nw.str("Preoperacional"),
                        icon: "material-icons drive_eta",
                        callback: function () {
                            main.preOperacional();
                        }
                    }
            );
        }
        f.menuLeft.push(
                {
                    position: "left",
                    name: nw.str("Mi cuenta"),
                    description: nw.str("Mi cuenta"),
                    icon: "material-icons security",
                    callback: function () {
                        nw.menuProfile();
                    }
                },
                {
                    position: "left",
                    name: nw.str("Documentos"),
                    description: nw.str("Documentos"),
                    icon: "material-icons folder_open",
                    callback: function () {
                        main.misDocumentos();
                    }
                });
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
        var label = "Cupones y referidos";
        if (config.usaReferidos || config.usaCupones) {
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
                            options.textAccept = "Referidos";
                            options.textCancel = "Cupones";
                            nw.dialog("Desea ir a...", referidos, cupones, options);
                        }
                    });
        }
        f.menuLeft.push(
//                {
//                    position: "left",
//                    name: nw.str("Soporte"),
//                    description: nw.str("Soporte"),
//                    icon: "material-icons headset_mic",
//                    callback: function () {
//                        var d = new f_soporte();
//                        d.construct();
//                    }
//                },
                {
                    position: "left",
                    name: nw.str("Soporte de emergencia"),
                    description: nw.str("Soporte"),
                    icon: "material-icons headset_mic",
                    callback: function () {
                        if (nw.evalueData(main.configCliente.link_soporte_conductor)) {
                            var target = "_blank";
                            var url = main.configCliente.link_soporte_conductor;
                            nw.utils.openLink(url, target);
                        } else {
                            var d = new l_soporte_admin();
                            d.construct();
                        }
                    }
                }
        );
        if (nw.evalueData(c.pedir_politicas_link)) {
            f.menuLeft.push(
                    {
                        position: "left",
                        name: nw.str("Ver contrato"),
                        description: nw.str("Ver contrato"),
                        icon: "material-icons exit_to_app",
                        callback: function () {
                            nw.createAccount.verPoliticasApp();
                        }
                    }
            );
        }
        f.menuLeft.push(
                {
                    position: "left",
                    name: nw.str("Salir"),
                    description: nw.str("Cerrar sesión"),
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