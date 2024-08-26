function l_nwmaker_admin_main(self) {
    var self = generateSelf(self);
    var thisDoc = this;
    var config = getConfigApp();
    thisDoc.constructor = constructor;
    thisDoc.self = self;
    var up = getUserInfo();
    var c = nwm.getInfoApp();
    function constructor() {
        createTreeNwMaker(self);

        var fields = [
            {
                type: 'carpet',
                label: 'Países',
                name: 'paises',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Ciudades',
                name: 'ciudades',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Menú',
                name: 'menu',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Perfiles',
                name: 'perfiles',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Perfiles Autorizados',
                name: 'perfiles_autorizados',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Permisos',
                name: 'permisos',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Módulos Home',
                name: 'modulos_home',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Módulos',
                name: 'modulos',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Componentes',
                name: 'componentes',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Usuarios Registrados',
                name: 'usuarios_registrados',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Configuración General',
                name: 'configuracion_general',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Configuración Login',
                name: 'configuracion_login',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Configuración credenciales pagos nc_config',
                name: 'configuracion_nc_config',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Dominios autorizados para crear /login cuenta',
                name: 'dominios_autorizados',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Áreas',
                name: 'departamentos',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Profesiones',
                name: 'profesiones',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Idiomas',
                name: 'idiomas',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Términos y Condiciones',
                name: 'terminos',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Log de Usuarios',
                name: 'log_usuarios',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Usuarios Empresas',
                name: 'nwmaker_users_empresas',
                depend: false
            },
            {
                type: 'carpet',
                label: 'Update DB nwmaker',
                name: 'update_db',
                depend: false
            }
        ];
        console.log(c);
        fields.push({
            type: 'carpet',
            label: 'Limpiar nw_registro',
            name: 'clean_nwregistro',
            depend: false
        });
        fields.push({
            type: 'carpet',
            label: 'Limpiar nwmaker_usuarios_log, usuarios_log',
            name: 'clean_userslog',
            depend: false
        });
        fields.push({
            type: 'carpet',
            label: 'Mantenimiento: Reparar y sincronizar tablas nwmaker',
            name: 'mant_nwmaker',
            depend: false
        });
        fields.push({
            type: 'carpet',
            label: 'Mantenimiento: Reparar y sincronizar tablas nwlib',
            name: 'mant_nwlib',
            depend: false
        });
        fields.push({
            type: 'carpet',
            label: 'Mantenimiento: BackUp Notificaciones',
            name: 'mant_notif',
            depend: false
        });

        if (c.alias === "ringow") {
            fields.push(
                    {
                        type: 'carpet',
                        label: 'Backup Ringow: Visitas, chats, disponibilidad, notificaciones',
                        name: 'backup_ringow',
                        depend: false
                    }
            );
            fields.push(
                    {
                        type: 'carpet',
                        label: 'Ringow Mantenimiento completo. Límpia nw_registro optimiza nwmaker y nwlib, backup',
                        name: 'backup_ringow_gral',
                        depend: false
                    }
            );
        }

        if (typeof c.productnw !== "undefined") {
            if (c.productnw === true || c.productnw === "SI") {
                fields.push({
                    type: 'carpet',
                    label: 'Sincronizar users products con WS',
                    name: 'sincrows',
                    depend: false
                });
            }
        }
        addFieldsLeftInTree(self, fields);
        var containerRigth = getContainerTreeRigth(self);
        addCss(self, ".container-treen_rigth", {"width": "100%", "max-width": "80%"});

        selfButton(self, "sincrows").click(function () {
            var params = {};
            params.html = "<h3>Al abrir el siguiente link iniciará la sincronización. Es un proceso complejo del sistema.</h3>Abra el siguiente link: <a href='/nwlib6/basics/copy.php?product=" + c.product_id + "&key=' target='_BLANK'>LINK</a>";
            createDialogNw(params);
        });

        selfButton(self, "update_db").click(function () {
            var params = {};
            params.html = 'Este es un proceso complejo del sistema, actualizará la base de datos nwmaker a su última versión, ¿desea continuar?';
            params.onSave = function () {
                loading("Actualizando base de datos, por favor espere...", "rgba(255, 255, 255, 0.76)!important", self);
                var rpc = {};
                rpc["service"] = "updaterNwp";
                rpc["method"] = "nwmaker";
                rpc["data"] = {};
                var func = function (r) {
                    console.log(r);
                    removeLoading(self);
                    var params = {};
                    params.html = 'Proceso finalizado correctamente.';
                    createDialogNw(params);
                };
                rpcNw("rpcNw", rpc, func, true);
                return true;
            };
            createDialogNw(params);
        });

        selfButton(self, "paises").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("paises", options);
        });

        selfButton(self, "ciudades").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("ciudades", options);
        });

        selfButton(self, "configuracion_nc_config").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nc_config", options);
        });

        selfButton(self, "nwmaker_users_empresas").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_users_empresas", options);
        });

        selfButton(self, "log_usuarios").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_usuarios_log", options);
        });

        selfButton(self, "terminos").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_terminos_condiciones", options);
        });

        selfButton(self, "idiomas").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_idiomas", options);
        });

        selfButton(self, "profesiones").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_login_profesiones", options);
        });

        selfButton(self, "departamentos").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_departamentos", options);
        });

        selfButton(self, "menu").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_menu", options);
        });

        selfButton(self, "perfiles").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_perfiles", options);
        });

        selfButton(self, "perfiles_autorizados").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_perfiles_autorizados", options);
        });

        selfButton(self, "permisos").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_permisos", options);
        });

        selfButton(self, "modulos_home").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_modulos_home", options);
        });

        selfButton(self, "modulos").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_modulos", options);
        });

        selfButton(self, "componentes").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            options['cleanHtml'] = true;
            createMaster("nwmaker_modulos_componentes", options);
        });

        selfButton(self, "usuarios_registrados").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("pv_clientes", options);
        });

        selfButton(self, "configuracion_general").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_codigo_oculto", options);
        });

        selfButton(self, "configuracion_login").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_login", options);
        });

        selfButton(self, "dominios_autorizados").click(function () {
            remove(".createListadoMaster");
            var options = {};
            options['filter_by_user'] = "NO";
            options['filter_by_terminal'] = "NO";
            options['container'] = containerRigth;
            createMaster("nwmaker_domains_autorizados", options);
        });

        selfButton(self, "clean_nwregistro").click(function () {
            var params = {};
            params.html = "¿Deseas limpiar los registros de nw_registro?";
            params.textAccept = 'Si';
            params.textCancel = 'Cancelar';
            params.no_buttons_enc = true;
            params.width = "500px";
            params.onSave = function () {
                loading("Cargando", "rgba(255, 255, 255, 0.76)!important", "body");
                var data = {};
                data.clean_nwregistro = "SI";
                var rpc = {};
                rpc["service"] = "updaterNwp";
                rpc["method"] = "generarMantenimiento";
                rpc["data"] = data;
                var func = function (r) {
                    removeLoading("body");
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    nw_dialog("Proceso finalizado correctamente");
                };
                rpcNw("rpcNw", rpc, func, true);
                return true;
            };
            params.onCancel = function () {
                return true;
            };
            createDialogNw(params);
        });

        selfButton(self, "clean_userslog").click(function () {
            var params = {};
            params.html = "¿Deseas limpiar los registros de nwmaker_usuarios_log, usuarios_log?";
            params.textAccept = 'Si';
            params.textCancel = 'Cancelar';
            params.no_buttons_enc = true;
            params.width = "500px";
            params.onSave = function () {
                loading("Cargando", "rgba(255, 255, 255, 0.76)!important", "body");
                var data = {};
                data.clean_usuarioslog = "SI";
                var rpc = {};
                rpc["service"] = "updaterNwp";
                rpc["method"] = "generarMantenimiento";
                rpc["data"] = data;
                var func = function (r) {
                    removeLoading("body");
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    nw_dialog("Proceso finalizado correctamente");
                };
                rpcNw("rpcNw", rpc, func, true);
                return true;
            };
            params.onCancel = function () {
                return true;
            };
            createDialogNw(params);
        });

        selfButton(self, "mant_nwmaker").click(function () {
            var params = {};
            params.html = "¿Deseas reparar y optimizar las tablas de nwmaker?";
            params.textAccept = 'Si';
            params.textCancel = 'Cancelar';
            params.no_buttons_enc = true;
            params.width = "500px";
            params.onSave = function () {
                loading("Cargando", "rgba(255, 255, 255, 0.76)!important", "body");
                var data = {};
                data.optimiza_tablas_nwmaker = "SI";
                var rpc = {};
                rpc["service"] = "updaterNwp";
                rpc["method"] = "generarMantenimiento";
                rpc["data"] = data;
                var func = function (r) {
                    removeLoading("body");
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    nw_dialog("Proceso finalizado correctamente");
                };
                rpcNw("rpcNw", rpc, func, true);
                return true;
            };
            params.onCancel = function () {
                return true;
            };
            createDialogNw(params);
        });

        selfButton(self, "mant_nwlib").click(function () {
            var params = {};
            params.html = "¿Deseas reparar y optimizar las tablas de nwlib?";
            params.textAccept = 'Si';
            params.textCancel = 'Cancelar';
            params.no_buttons_enc = true;
            params.width = "500px";
            params.onSave = function () {
                loading("Cargando", "rgba(255, 255, 255, 0.76)!important", "body");
                var data = {};
                data.optimiza_tablas_nwlib = "SI";
                var rpc = {};
                rpc["service"] = "updaterNwp";
                rpc["method"] = "generarMantenimiento";
                rpc["data"] = data;
                var func = function (r) {
                    removeLoading("body");
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    nw_dialog("Proceso finalizado correctamente");
                };
                rpcNw("rpcNw", rpc, func, true);
                return true;
            };
            params.onCancel = function () {
                return true;
            };
            createDialogNw(params);
        });

        selfButton(self, "mant_notif").click(function () {
            var params = {};
            params.html = "¿Deseas generar backup de notificaciones?";
            params.textAccept = 'Si';
            params.textCancel = 'Cancelar';
            params.no_buttons_enc = true;
            params.width = "500px";
            params.onSave = function () {
                loading("Cargando", "rgba(255, 255, 255, 0.76)!important", "body");
                var data = {};
                data.backupNotificaciones = "SI";
                var rpc = {};
                rpc["service"] = "updaterNwp";
                rpc["method"] = "generarMantenimiento";
                rpc["data"] = data;
                var func = function (r) {
                    removeLoading("body");
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    nw_dialog("Proceso finalizado correctamente");
                };
                rpcNw("rpcNw", rpc, func, true);
                return true;
            };
            params.onCancel = function () {
                return true;
            };
            createDialogNw(params);
        });

        selfButton(self, "backup_ringow").click(function () {
            var params = {};
            params.html = "¿Deseas generar backup de tablas de visitas, chat y disponibilidad de Ringow?";
            params.textAccept = 'Si';
            params.textCancel = 'Cancelar';
            params.no_buttons_enc = true;
            params.width = "500px";
            params.onSave = function () {
                loading("Cargando", "rgba(255, 255, 255, 0.76)!important", "body");
                var data = {};
                var rpc = {};
                rpc["service"] = "nwchatMaker";
                rpc["method"] = "backUpRingow";
                rpc["data"] = data;
                var func = function (r) {
                    removeLoading("body");
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    nw_dialog("Proceso finalizado correctamente");
                };
                rpcNw("rpcNw", rpc, func, true);
                return true;
            };
            params.onCancel = function () {
                return true;
            };
            createDialogNw(params);
        });

        selfButton(self, "backup_ringow_gral").click(function () {
            var params = {};
            params.html = "¿Deseas generar un mantenimiento general de Ringow: backup de tablas de visitas, chat, disponibilidad y notificaciones de Ringow, limpiar nw_registro, limpiar log de usuarios, optimizar tablas nwmaker y nwlib, optimización de índices, desfragmentar disco?";
            params.textAccept = 'Si';
            params.textCancel = 'Cancelar';
            params.no_buttons_enc = true;
            params.width = "500px";
            params.onSave = function () {
                loading("Cargando", "rgba(255, 255, 255, 0.76)!important", "body");
                var data = {};
                var rpc = {};
                rpc["service"] = "nwchatMaker";
                rpc["method"] = "backUpGeneralRingow";
                rpc["data"] = data;
                var func = function (r) {
                    console.log(r);
                    removeLoading("body");
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    nw_dialog("Proceso finalizado correctamente. Mantenimiento #" + r.mante_general + "<br />Log " + r.backup_ringow);
                };
                rpcNw("rpcNw", rpc, func, true);
                return true;
            };
            params.onCancel = function () {
                return true;
            };
            createDialogNw(params);
        });

        removeLoadingNw();
    }
}