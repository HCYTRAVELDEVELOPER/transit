function myUsersNwMaker(openOutside, callback) {
    var thisDoc = this;
    thisDoc.constructor = constructor;
    thisDoc.updateContend = updateContend;
    var c = getConfigApp();

    function constructor(self) {
        empty(".myUsersNwMaker");
        if (evalueData(self)) {
            empty(self);
            generateSelf(self);
        } else {
            var divPadreContainer = ".container-main-myusers";
            initContainer(divPadreContainer);
            var classDocument = ".myUsersNwMaker";
            createContainer(divPadreContainer, false, classDocument);
            self = createDocument(classDocument);
        }
        thisDoc.self = self;

        var up = getUserInfo();
        if (typeof up["usuario"] == "undefined") {
            return;
        }
        var columns = [];
        columns.push(
                {
                    label: "Foto",
                    caption: "foto_perfil",
                    type: "image",
                    widthImage: "125",
                    mode: "phpthumb"
                },
                {
                    label: "Nombre",
                    caption: "nombres_apellidos"
                },
                {
                    label: "Usuario",
                    caption: "usuario_cliente"
                },
                {
                    label: "Status",
                    caption: "estado",
                    visible: false
                },
                {
                    label: "Estado",
                    caption: "estado_conexion",
                    visible: true
                },
                {
                    label: "Última conexión",
                    caption: "fecha_ultima_conexion",
                    visible: true
                },
                {
                    label: "ID",
                    caption: "id",
                    visible: false
                },
                {
                    label: "Nombre",
                    caption: "nombre",
                    visible: false
                },
                {
                    label: "Apellido",
                    caption: "apellido",
                    visible: false
                },
                {
                    label: "Clave",
                    caption: "clave",
                    visible: false
                },
                {
                    label: "Perfil",
                    caption: "nombre_perfil",
                    visible: true
                },
                {
                    label: "Perfil",
                    caption: "perfil",
                    visible: false
                },
                {
                    label: "Género",
                    caption: "genero",
                    visible: false
                }
        );


        if (evalueData(c.config_datauser)) {
            if (c.config_datauser.fecha_nacimiento === true) {
                columns.push(
                        {
                            label: "Fecha nacimiento",
                            caption: "fecha_nacimiento",
                            visible: true
                        }
                );
            }
            if (c.config_datauser.professional_data === true) {
                columns.push(
                        {
                            label: "Profesión",
                            caption: "profesion",
                            visible: true
                        }
                );
            }
            if (c.config_datauser.salas === true) {
                columns.push(
                        {
                            label: "Sala ID",
                            caption: "sala",
                            visible: false
                        },
                        {
                            label: "Sala / Depto",
                            caption: "sala_text",
                            visible: true
                        }
                );
            }
            if (c.config_datauser.pais === true) {
                columns.push(
                        {
                            label: "País ID",
                            caption: "pais",
                            visible: false
                        },
                        {
                            label: "País",
                            caption: "pais_text",
                            visible: true
                        }
                );
            }
            if (c.config_datauser.extension_pbx === true) {
                columns.push(
                        {
                            label: "PBX",
                            caption: "extension_pbx",
                            visible: true
                        }
                );
            }
            if (c.config_datauser.cargo_actual === true) {
                columns.push(
                        {
                            label: "Cargo",
                            caption: "cargo_actual",
                            visible: true
                        }
                );
            }
            if (c.config_datauser.tarifa === true) {
                columns.push(
                        {
                            label: "Tarifa",
                            caption: "tarifa",
                            visible: true
                        }
                );
            }
            if (c.config_datauser.descripcion === true) {
                columns.push(
                        {
                            label: "Descripción",
                            caption: "descripcion",
                            visible: true
                        }
                );
            }
            if (c.config_datauser.celular === true) {
                columns.push(
                        {
                            label: "Celular",
                            caption: "celular",
                            visible: true
                        }
                );
            }
        }
        columns.push(
                {
                    label: "Horario",
                    caption: "horario_task",
                    visible: true
                }
        );
        columns.push(
                {
                    label: "Almuerzo",
                    caption: "horario_task_almuerzo",
                    visible: true
                }
        );

        createList(columns, self);
        var filters = [
            {
                name: "buscar",
                caption: "buscar",
                label: "Buscar",
                tipo: "textField",
                visible: true
            },
            {
                name: "estado",
                caption: "estado",
                label: "Estado",
                tipo: "selectBox",
                visible: true
            },
            {
                name: "consultar",
                caption: "consultar",
                label: '<i class="material-icons add_new_group">refresh</i>',
                mode_label: 'hidden',
                tipo: "button",
                visible: true
            }
        ];
        createFilters(filters, self);

        var btn = actionInColForm(self, "buscar");
        btn.keypress(function (e) {
            if (e.which === 13) {
                thisDoc.updateContend();
                return false;
            }
        });

        var data = {};
        data["activo"] = "Activo";
        data["inactivo"] = "Inactivo";
        populateSelectFromArray("estado", data);

        var html = "<h2 class='subtitles titleMyUsersNwMaker'>Usuarios del sistema</h2>";
        addHeaderNoteList(html, self);

        setMaxWidthList(1100, self);
        listScroll(self, false);

        var update = actionInColForm(self, "consultar");
        update.click(function () {
            thisDoc.updateContend();
        });

        var nuevo = createButtonListEnc(self, "Crear Nuevo Usuario");
        nuevo.click(function () {
            var d = new f_usuarios_nwmaker(openOutside, thisDoc);
            d.constructor();
        });

        activepagination(self, function () {
            thisDoc.updateContend();
        });

        thisDoc.updateContend();
    }

    function updateContend() {
        loading("Cargando...", "rgba(255, 255, 255, 0.76)!important", self);
        var self = thisDoc.self;
        var data = {};
        data.filters = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "consultaMyUsuariosNwMaker";
        rpc["data"] = data;
        var func = function (r) {
            removeLoading(self);
            resetList(self);
            if (!verifyErrorNwMaker(r, self) || verifyErrorNwMaker(r, self) === 0) {
                if (evalueData(callback)) {
                    callback();
                }
                return;
            }
            var tab = "pv_clientes";
            var total = r.length;
            for (var i = 0; i < total; i++) {
                var row = r[i];
                if (typeof row.foto !== "undefined") {
                    row.usuario_cliente = row.usuario;
                    row.foto_perfil = row.foto;
                    row.nit = row.documento;
                }
                var t = addRowInList(self, row, i);
            }

            var options = {};
            options["margin"] = "10px";
            options["height"] = "auto";
            options["max-height"] = "initial";
            options["padding"] = "10px";
            options["margin"] = "0";
            listAddCss(self, options);

            listAddCssFor(self, ".colEncMobil p", {"padding": "10px 0", "text-align": "left"});

            listAddCssFor(self, "2", {"font-weight": "bold"});

            listAddCssFor(self, ".imageListNwMaker2", {"background-position": "center", "border": "1px solid #ccc", "border-radius": "50%", "width": "70px", "height": "70px", "background-size": "cover"});

            listAddCssFor(self, ".colsMobil", {"width": "auto", "height": "auto", "margin": "auto", "float": "none"}, "mobile");
            listAddCssFor(self, ".namedColMob", {"display": "none"}, "mobile");

            showRowInMobile(self, "nombres_apellidos");
            showRowInMobile(self, "usuario_cliente");
            showRowInMobile(self, "estado");

            var btnOk = actionInColList(self, "nombres_apellidos");
            btnOk.click(function () {
                var r = getSelectedRecord(self);
                loadAjaxProfileUserNw(r["usuario_cliente"]);
            });

            var btnOk = actionInColList(self, "usuario_cliente");
            btnOk.click(function () {
                var r = getSelectedRecord(self);
                loadAjaxProfileUserNw(r["usuario_cliente"]);
            });

            $(self + " .imageListNwMaker2").click(function () {
                var r = getSelectedRecord(self);
                loadAjaxProfileUserNw(r["usuario_cliente"]);
            });

            var editar = addButtonContextMenu(self, "Editar");
            editar.click(function () {
                var data = getSelectedRecord(self);
                var d = new f_usuarios_nwmaker(false, thisDoc);
                d.constructor(false);
                d.updateContend(data);
            });

            var salas = addButtonContextMenu(self, "Otras salas");
            salas.click(function () {
                var data = getSelectedRecord(self);
                loadJs("/nwlib6/nwproject/modules/nw_user_session/js/forms/f_salas_usuarios.js");
                var d = new f_salas_usuarios(thisDoc);
                d.constructor(data);
                d.updateContend(data);

            });

            var textActivar = "activar";
            if (data.filters.estado === "activo") {
                textActivar = "inactivar";
            }
            var inactivar = addButtonContextMenu(self, textActivar);
            inactivar.click(function () {
                var data = getSelectedRecord(self);
                data.status = textActivar;
                var params = {};
                params.html = "<h3>¿Desea " + textActivar + " el usuario " + data.usuario_cliente + "?</h3>";
                params.onSave = function () {
                    var rpc = {};
                    rpc["service"] = "nwMaker";
                    rpc["method"] = "inactiveUsuariosNwMaker";
                    rpc["data"] = data;
                    var func = function (r) {
                        if (!verifyErrorNwMaker(r)) {
                            return;
                        }
                        updateContend();
                        return true;
                    };
                    rpcNw("rpcNw", rpc, func, true);
                    return true;
                };
                params.textAccept = 'Aceptar';
                params.textCancel = 'Cancelar';
                params.no_buttons_enc = true;
                createDialogNw(params);
            });

            var clave = addButtonContextMenu(self, "Cambiar clave");
            clave.click(function () {
                var data = getSelectedRecord(self);
                changePass("popup", data.usuario_cliente, true);
            });
            var eliminar = addButtonContextMenu(self, "Eliminar");
            eliminar.click(function () {
                var data = getSelectedRecord(self);
                data.delete = true;
                var params = {};
                params.html = "<h3>¿Desea eliminar completamente el usuario " + data.usuario_cliente + "?</h3><p>El usuario " + data.usuario_cliente + " no podrá ingresar a la plataforma y sus datos serán eliminados.</p>";
                params.onSave = function () {
                    var rpc = {};
                    rpc["service"] = "nwMaker";
                    rpc["method"] = "inactiveUsuariosNwMaker";
                    rpc["data"] = data;
                    var func = function (r) {
                        if (!verifyErrorNwMaker(r)) {
                            return;
                        }
                        updateContend();
                        return true;
                    };
                    rpcNw("rpcNw", rpc, func, true);
                    return true;
                };
                params.textAccept = 'Aceptar';
                params.textCancel = 'Cancelar';
                params.no_buttons_enc = true;
                createDialogNw(params);
            });
            addDataPagination(self, total);

            if (evalueData(callback)) {
                callback();
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}