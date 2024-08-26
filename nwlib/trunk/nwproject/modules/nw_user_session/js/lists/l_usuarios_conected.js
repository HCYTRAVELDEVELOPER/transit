tim = "";
loadedUsersConectedMaker = false;
timeIntervalRefreshChat = 60000;

function createUsersConected() {
    var self = generateSelf(".container-nwmakerchat");
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.execUpdateContend = execUpdateContend;
    this.self = self;
    this.mode = "chats";
    var up = getUserInfo();

    function constructor() {
        loadedUsersConectedMaker = true;
        hiddenUser();
        hideMenuMovilNwMaker();
        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Status",
                caption: "conectado"
            },
            {
                label: "Imagen",
                caption: "foto_perfil",
                type: "image",
                mode: "phpthumb",
                widthImage: "30",
                clickable: false
            },
            {
                label: "Nombre",
                caption: "nombre_apellido"
            },
            {
                label: "Último mensaje",
                caption: "last_message",
                visible: true
            },
            {
                label: "Última Conexión",
                caption: "last_connection"
            },
            {
                label: "Dispositivo",
                caption: "dispositivo",
                visible: false
            },
            {
                label: "Room grupo",
                caption: "room_v2",
                visible: false
            },
            {
                label: "Modo",
                caption: "modo",
                visible: false
            },
            {
                label: "Grupo Users",
                caption: "usersGroup",
                visible: false
            },
            {
                label: "Es Grupo",
                caption: "isGroup",
                visible: false
            },
            {
                label: "ID Call",
                caption: "idCallGroup",
                visible: false
            },
            {
                label: "Usuario",
                caption: "usuario_cliente",
                visible: false
            }
        ];
        createList(columns, self);
        var filters = [
            {
                name: "nuevo_usuario",
                caption: "nuevo_usuario",
                icon: "group_add",
                label: " Nuevo usuario",
                tipo: "button",
                visible: true
            },
            {
                title: '',
                mode: 'horizontal',
                name_group: 'grupo_users_options',
                numberCols: '1',
                tipo: 'startGroup'
            },
            {
                name: "nuevo_grupo",
                caption: "nuevo_grupo",
                icon: "group_add",
                label: " Grupo",
                tipo: "button",
                visible: true
            },
            {
                name: "nueva_videollamada",
                caption: "nueva_videollamada",
                icon: "video_call",
                label: " Videocall",
                tipo: "button",
                visible: false
            },
            {
                name: "cerrar",
                caption: "cerrar",
                label: "X",
                tipo: "button"
            },
            {
                tipo: 'endGroup'
            },
            {
                title: '',
                mode: 'horizontal',
                name_group: 'grupo_users_search',
                numberCols: '1',
                tipo: 'startGroup'
            },
            {
                name: "buscar_usuario",
                caption: "buscar_usuario",
                label: "Buscar",
                texto_ayuda: "Buscar",
                tipo: "textField"
            },
            {
                tipo: 'endGroup'
            },
            {
                title: '',
                mode: 'horizontal',
                name_group: 'grupo_users_chatsCallsCont',
                numberCols: '1',
                tipo: 'startGroup'
            },
            {
                name: "chats",
                caption: "chats",
                label: "Chats",
                tipo: "button"
            },
            /*
             {
             name: "llamadas",
             caption: "llamadas",
             label: "Llamadas",
             tipo: "button"
             },
             */
            {
                name: "contactos",
                caption: "contactos",
                label: "Contactos",
                tipo: "button"
            },
            {
                tipo: 'endGroup'
            }
        ];
        createFilters(filters, self);
        var btn = actionInColForm(self, "buscar_usuario");
        btn.keypress(function (e) {
            if (e.which === 13) {
                thisDoc.updateContend(thisDoc.mode);
                return false;
            }
        });
        
        $(self).addClass("container-nwmakerchat-show");

        setMaxWidthList(170, self);

        listAddCssFor(self, "", {"max-width": "100%", "overflow": "auto", "z-index": "1111111100000"}, "mobile");

        fadeOutMainColumns(self);

        var btn = actionInColForm(self, "nuevo_grupo");
        btn.click(function () {
            var d = new newGroup();
            d.constructor();
        });
        var btn = actionInColForm(self, "cerrar");
        btn.click(function () {
            clearInterval(tim);
            reject(self);
        });
        var btn = actionInColForm(self, "chats");
        btn.click(function () {
            activePesChats("chats");
        });
        var btn = actionInColForm(self, "llamadas");
        btn.click(function () {
            activePesChats("llamadas");
        });
        var btn = actionInColForm(self, "contactos");
        btn.click(function () {
            activePesChats("contactos");
        });
        var btn = actionInColForm(self, "nuevo_usuario");
        btn.click(function () {
            getMyUsersNwMaker(true);
        });

        var c = getConfigApp();
        if (c.permitir_boton_para_videollamadas === true) {
            setVisibility(self, "nueva_videollamada", true);
            var btn = actionInColForm(self, "nueva_videollamada");
            btn.click(function () {
                var d = new nuevaVideollamadaRingow();
                d.constructor();
            });
        }

        if (up.usuario !== up.usuario_principal) {
            setVisibility(self, "nuevo_usuario", false);
        }

        click(self + " .addUsersNwmakerList", function () {
            getMyUsersNwMaker(true);
        });

        click(self + " .colMobilLabel_nombre_apellido", function () {
            openChat();
        });

        click(self + " .colMobilLabel_foto_perfil", function () {
            openChat();
        });

        listScroll(self, true);

        $(self + " .container-table-list").before("<div class='containBoxConversEnc'></div>");

        thisDoc.updateContend("chats");
        addCss(self, ".containBoxConversEnc", {"display": "none"});
    }

    function activePesChats(mode) {
        addCss(self, ".containBoxConversEnc", {"display": "block"});
        addCss(self, ".divContainInput", {"background-color": "transparent"});
        addCss(self, ".contain_input_name_" + mode, {"background-color": "#fff"});
        thisDoc.updateContend(mode);
    }

    function openChat() {
        var data = getSelectedRecord(self);
        var myName = up.nombre + up.apellido;
        var room = "";
        if (evalueData(data.room_v2)) {
            room = data.room_v2;
        } else {
            var tod = up.usuario + myName + data.nombre_apellido + data.usuario_cliente + up.terminal.toString() + up.apikey.toString();
            var tool = tod.length + parseInt(data.id) + parseInt(up.id_usuario);
            var us = [];
            us[0] = {
                "usuario": up.usuario
            };
            us[1] = {
                "usuario": data.usuario_cliente
            };
            us.sort(function (a, b) {
                return +(a.usuario > b.usuario) || +(a.usuario === b.usuario) - 1;
            });
            for (var i = 0; i < us.length; i++) {
                tool += cleanUserNwC(us[i].usuario);
            }
            room = "userchat_" + tool + "_" + up.terminal.toString() + "_" + up.apikey.toString();
        }

        var me = up.usuario;
        var he = data.usuario_cliente;
        var heName = false;
        var hePhoto = false;
        var callback = false;
        var contain = false;
        var addGetUrl = false;
        if (data.nombre_apellido.indexOf("(Grupo)") !== -1) {
            addGetUrl = "&is_group=true";
        }
        windowNwChat(room, me, he, heName, hePhoto, callback, contain, addGetUrl);
    }

    function updateContend(mode) {
        newLoadingTwo(self + " .containDataCols", "...", "background: #fff;height: 100%;position: absolute;width: 100%;z-index: 100000;", "append");
        clearInterval(tim);
        execUpdateContend(mode);
        tim = setInterval(function () {
            thisDoc.execUpdateContend(mode);
        }, timeIntervalRefreshChat);
    }

    function execUpdateContend(mode) {
        thisDoc.mode = mode;
        var data = {};
        data.filters = getDataFilters(self);
        data.mode = mode;
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "consultaUsuariosConectados";
        rpc["data"] = data;
        var func = function (r) {
            var hoy = getDateHour();
            newRemoveLoading(self);
            removeLoadingList(self);
            newRemoveLoading(self + " .containDataCols");
            resetList(self);
            var msg = str("No tienes conversaciones, intenta buscar o haz clic en la pestaña de contactos") + "";
            if (!verifyErrorNwMaker(r, self, msg) || verifyErrorNwMaker(r, self, msg) === 0) {
                return;
            }
            var total = r.length;
            for (var i = 0; i < total; i++) {
                var row = r[i];
                var cone = "";
                row.conectado = "NO";
                if (evalueData(row.fecha_ultima_conexion)) {
                    var lastConecction = calcularTiempoDosFechas(row.fecha_ultima_conexion);
                    cone = "userConectedNw";
                    row.conectado = "SI";
                    var last = "Activ@ ahora";
                    var timeBeforeConnect = addMinutesDate(+1, row.fecha_ultima_conexion);
                    if (hoy > timeBeforeConnect) {
                        row.conectado = "NO";
                        cone = "";
                        last = lastConecction.dateInFormat;
                    }
                    if (evalueData(row.date_last_message)) {
                        var lastConecctionMsg = calcularTiempoDosFechas(row.date_last_message);
                        last = lastConecctionMsg.dateInFormat;
                    }
                }
                if (row.nombre_apellido.indexOf("(Grupo)") !== -1) {
                    cone = "userConectedNw_group";
                    row.isGroup = true;
                }
                row.last_connection = last;
                row.conectado = "<div class='statusConectedUserNw " + cone + "'>" + row.conectado + "</div>";

                var uu = cleanUserNwC(row.usuario_cliente);
                var t = addRowInList(self, row, i);
                $(self + " " + t).addClass("rowChat_" + uu);
                if (typeof rowsCirleList[uu] !== "undefined") {
                    addCircleRedListChat(uu, rowsCirleList[uu]);
                }
            }

            if (isMobile()) {
                listAddCssFor(self, ".namedColMob", {"display": "none"});
                listAddCssFor(self, ".colMobilLabel_conectado", {"max-width": "20px"});
                listAddCssFor(self, ".colMobilLabel_foto_perfil", {"max-width": "35px"});
                listAddCssFor(self, ".colMobilLabel_nombre_apellido", {"max-width": "200px"});
            }

            var options = {};
            options["padding"] = "4px 0px";
            options["height"] = "auto";
            options["max-height"] = "initial";
            listAddCss(self, options);

            showRowInMobile(self, "foto_perfil");
            showRowInMobile(self, "conectado");
            showRowInMobile(self, "dispositivo");
            showRowInMobile(self, "nombre_apellido");
            showRowInMobile(self, "last_connection");

            var btnOk = actionInColList(self, "foto_perfil");
            btnOk.click(function () {
                var r = getSelectedRecord(self);
                loadAjaxProfileUserNw(r["usuario_cliente"]);
            });

            if (mode === "chats") {
                var btn = addButtonContextMenu(self, "Ver participantes");
                btn.click(function () {
                    var r = getSelectedRecord(self);
                    var d = new showParticipantes();
                    d.constructor(r);
                });
                var btn = addButtonContextMenu(self, "Eliminar");
                btn.click(function () {
                    var r = getSelectedRecord(self);

                });
            }

            removeColorsRows(self);
            removeLoading(self);
            /*
             inactiveClicInRow(self);
             activeClickDontOpen(self);
             */
        };
        rpcNw("rpcNw", rpc, func, true, self);
    }

    function newGroup() {
        var self = createDocument(".newGroup");
        this.constructor = constructor;
        this.self = self;
        function constructor(r) {
            var fields = [
                {
                    tipo: 'textField',
                    nombre: 'Nombre del Grupo',
                    name: 'nombres_apellidos',
                    requerido: "SI"
                },
                {
                    tipo: 'uploader',
                    nombre: 'Ícono',
                    name: 'foto_perfil'
                },
                {
                    tipo: 'selectBox',
                    nombre: 'Usuarios del grupo',
                    name: 'usersGroup',
                    mode: 'multiple',
                    requerido: "SI"
                }
            ];
            createNwForms(self, fields, "popup");
            setColumnsFormNumber(self, 2);
            var html = "Nuevo grupo";
            addHeaderNote(self, html);

            $(self + " .uploader_foto_perfil").attr("self-div", self + " #nwform");

            var data = {};
            populateSelect(self, "usersGroup", "nwMaker", "consultaUsuariosTerminalText", data);

            var accept = addButtonNwForm("Crear", self);
            var cancel = addButtonNwForm("Cancelar", self);
            cancel.click(function () {
                rejectForm(self);
            });
            accept.click(function () {
                if (!validateRequired(self)) {
                    return;
                }
                loading("Validando...", "rgba(255, 255, 255, 0.76)!important", self);
                var data = getRecordNwForm(self);
                var usersGroup = "";
                for (var i = 0; i < data.usersGroup_array.length; i++) {
                    usersGroup += data.usersGroup_array[i].value;
                    if (i + 1 < data.usersGroup_array.length) {
                        usersGroup += ",";
                    }
                }
                data.usersGroup = usersGroup;
                var rpc = {};
                rpc["service"] = "nwMaker";
                rpc["method"] = "crearGrupoChat";
                rpc["data"] = data;
                var func = function (r) {
                    removeLoading(self);
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    reject(self);
                    var room = r;
                    var me = up.usuario;
                    var he = "all";
                    var heName = false;
                    var hePhoto = false;
                    var callback = false;
                    var contain = false;
                    var addGetUrl = "&is_group=true";
                    windowNwChat(room, me, he, heName, hePhoto, callback, contain, addGetUrl);
                };
                rpcNw("rpcNw", rpc, func, true);
            });
            removeLoadingNw();
        }
    }

    function addParticipantes() {
        var self = createDocument(".addParticipantes");
        this.constructor = constructor;
        this.self = self;
        function constructor(r, callback) {
            var fields = [
                {
                    tipo: 'textField',
                    nombre: 'ID User',
                    name: 'id',
                    requerido: "SI",
                    visible: false
                },
                {
                    tipo: 'textField',
                    nombre: 'Room',
                    name: 'room_v2',
                    requerido: "SI",
                    visible: false
                },
                {
                    tipo: 'textField',
                    nombre: 'Nombre del Grupo',
                    name: 'nombre_apellido',
                    requerido: "SI",
                    enabled: false
                },
                {
                    tipo: 'selectBox',
                    nombre: 'Usuarios del grupo',
                    name: 'usersGroup',
                    mode: 'multiple',
                    requerido: "SI"
                }
            ];

            createNwForms(self, fields, "popup");
            setColumnsFormNumber(self, 2);
            var html = "Agregar usuarios";
            addHeaderNote(self, html);

            var data = {};
            data.room_v2 = r.room_v2;
            populateSelect(self, "usersGroup", "nwMaker", "consultaUsuariosTerminalTextExcludeGrupo", data);

            console.log(r);
            setRecord(self, r);

            var accept = addButtonNwForm("Crear", self);
            var cancel = addButtonNwForm("Cancelar", self);
            cancel.click(function () {
                rejectForm(self);
            });
            accept.click(function () {
                if (!validateRequired(self)) {
                    return;
                }
                loading("Validando...", "rgba(255, 255, 255, 0.76)!important", self);
                var data = getRecordNwForm(self);
                var usersGroup = "";
                for (var i = 0; i < data.usersGroup_array.length; i++) {
                    usersGroup += data.usersGroup_array[i].value;
                    if (i + 1 < data.usersGroup_array.length) {
                        usersGroup += ",";
                    }
                }
                data.usersGroup = usersGroup;
                var rpc = {};
                rpc["service"] = "nwMaker";
                rpc["method"] = "agregarParticipanteGrupoChat";
                rpc["data"] = data;
                var func = function (r) {
                    removeLoading(self);
                    if (!verifyErrorNwMaker(r)) {
                        return;
                    }
                    reject(self);
                    callback();
                };
                rpcNw("rpcNw", rpc, func, true);
            });
            removeLoadingNw();
        }
    }

    function showParticipantes() {
        var self = createDocument(".l_example_list_one");
        var thisDoc = this;
        this.constructor = constructor;
        this.updateContend = updateContend;
        this.self = self;
        function constructor(r) {
            this.data = r;
            thisDoc.isGroup = false;
            if (evalueData(r.isGroup)) {
                thisDoc.isGroup = true;
            }
            var columns = [
                {
                    label: "ID user",
                    caption: "id_user",
                    visible: false
                },
                {
                    label: "ID vis",
                    caption: "id_vis",
                    visible: false
                },
                {
                    label: "Usuario",
                    caption: "user"
                },
                {
                    label: "Nombre",
                    caption: "nombre"
                }
            ];

            var params = {};
            params.self = "l_example_list_one";
            thisDoc.dataPopup = createList(columns, self, "popup", params);

            var html = "<h2 class='subtitles_bloques'>Participantes</h2>";
            if (thisDoc.isGroup) {
                html = "<h2 class='subtitles_bloques'>Agregar o quitar participantes</h2>";
            }
            addHeaderNoteList(html, self);

            setMaxWidthList(1100, self);
            listScroll(self, false);
            listAddCssFor(self, "", {"width": "100%", "display": "inline-block"});

            if (thisDoc.isGroup) {
                var nuevo = createButtonListEnc(self, "Agregar usuario");
                nuevo.click(function () {
                    var d = new addParticipantes();
                    d.constructor(r, function () {
                        thisDoc.updateContend();
                    });
                });
            }
            thisDoc.updateContend();
        }

        function updateContend() {
            var data = this.data;
            console.log(data);
            var rpc = {};
            rpc["service"] = "nwMaker";
            rpc["method"] = "consultaParticipantesConversations";
            rpc["data"] = data;
            loading("", "rgba(255, 255, 255, 0.76)!important", self);
            var func = function (r) {
                removeLoading(self);
                if (!verifyErrorNwMaker(r)) {
                    return;
                }
                setModelData(r, self);

                var options = {};
                options["max-height"] = "initial";
                listAddCss(self, options);

                showRowInMobile(self, "nombre");

                if (thisDoc.isGroup) {
                    var eliminar = addButtonContextMenu(self, "Eliminar");
                    eliminar.click(function () {
                        var selfNew = generateSelf();
                        createNwForms(selfNew, false, "popUp");
                        addHeaderNote(selfNew, "¿Desea eliminar este usuario del grupo?");
                        setModal(true);
                        setWidth(selfNew, 300);
                        var accept = addButtonNwForm("Aceptar", selfNew);
                        accept.click(function () {
                            reject(selfNew);
                            var r = getSelectedRecord(self);
                            var rpc = {};
                            rpc["service"] = "nwMaker";
                            rpc["method"] = "eliminaParticipanteConversation";
                            rpc["data"] = r;
                            loading("", "rgba(255, 255, 255, 0.76)!important", self);
                            var func = function (r) {
                                console.log(r);
                                removeLoading(self);
                                if (!verifyErrorNwMaker(r)) {
                                    return;
                                }
                                thisDoc.updateContend();
                            };
                            rpcNw("rpcNw", rpc, func, true);

                        });
                        var cancel = addButtonNwForm("Cancelar", selfNew);
                        cancel.click(function () {
                            reject(selfNew);
                        });
                    });
                }
            };
            rpcNw("rpcNw", rpc, func, true);
        }
    }
}