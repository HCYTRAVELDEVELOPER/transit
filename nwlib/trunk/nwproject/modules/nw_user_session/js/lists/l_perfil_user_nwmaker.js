function l_perfil_user_nwmaker() {
    $(".container-main-myusers").empty();
    var divPadreContainer = ".container-main-myusers";
    initContainer(divPadreContainer);
    var classDocument = ".l_perfil_user_nwmaker";
    createContainer(divPadreContainer, false, classDocument);
    var self = createDocument(classDocument);

    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.populateUsuario = populateUsuario;
    this.self = self;

    function constructor(r, grupo_text) {
        if (typeof timeFMuro != "undefined")
            clearTimeout(timeFMuro);

        var visibleGrupo = true;
        if (typeof r != "undefined") {
            visibleGrupo = false;
        }
        if (isMobile()) {
            visibleGrupo = true;
        }
        var columns = [
            {
                label: "Foto",
                caption: "foto_perfil",
                type: "image",
                mode: "phpthumb",
                clickable: false
            },
            {
                label: "Asignado a",
                caption: "asignado_a_text"
            },
            {
                label: "Asignado po",
                caption: "asignado_por"
            },
            {
                label: "Grupo",
                caption: "grupo_text",
                visible: visibleGrupo
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Hora",
                caption: "hora"
            },
            {
                label: "Estado",
                caption: "estado"
            },
            {
                label: "ID",
                caption: "id",
                visible: true
            },
            {
                label: "Finalizar",
                caption: "accion",
                type: "button"
            },
            {
                label: "Tarea",
                caption: "tarea"
            },
            {
                label: "Usuario",
                caption: "usuario",
                visible: false
            },
            {
                label: "Asignado a ID",
                caption: "asignado_a",
                visible: false
            },
            {
                label: "Asignado a User",
                caption: "asignado_a_username",
                visible: false
            },
            {
                label: "Grupo ID",
                caption: "grupo",
                visible: false
            }
        ];

        createList(columns, self);

        var filters = [
            {
                name: "grupo",
                caption: "grupo",
                label: "Grupo",
                tipo: "selectBox",
                enabled: true
            },
            {
                name: "usuario",
                caption: "usuario",
                label: "Usuario",
                tipo: "selectBox",
                enabled: true
            },
            {
                name: "estado",
                caption: "estado",
                label: "Estado",
                tipo: "selectBox",
                enabled: true
            },
            {
                name: "modo_tarea",
                caption: "modo_tarea",
                label: "Modo",
                tipo: "selectBox",
                enabled: true
            }
        ];
        createFilters(filters, self);

        var up = getUserInfo();

        var data = {};
        data[""] = "Seleccione";
        populateSelectFromArray("grupo", data);

        var data = {};
        data[""] = "Todos";
        populateSelectFromArray("usuario", data);

        var data = {};
        data["Nuevo"] = "Sin Resolver";
        data["Reabierto"] = "Reabierto";
        data["Finalizado"] = "Finalizado";
        data["todas"] = "Todas";
        populateSelectFromArray("estado", data);

        var data = {};
        if (typeof r != "undefined") {
            data["todas"] = "Todas";
            data["mis_tareas"] = "Mis tareas";
        } else {
            data["mis_tareas"] = "Mis tareas";
        }
        data["asignadas_por_mi"] = "Asignadas por mi (excluirme)";
        populateSelectFromArray("modo_tarea", data);

        var grupo = actionInColForm(self, "grupo");
        grupo.change(function () {
            if (!isMobile()) {
                thisDoc.updateContend();
            }
        });

        var estado = actionInColForm(self, "estado");
        estado.change(function () {
            if (!isMobile()) {
                thisDoc.updateContend();
            }
        });

        var usuario = actionInColForm(self, "usuario");
        usuario.change(function () {
            if (!isMobile()) {
                thisDoc.updateContend();
            }
        });

        if (typeof r == "undefined") {
            var modo = actionInColForm(self, "modo_tarea");
            modo.change(function () {
                var data = getValue(self, this);
                if (data == "asignadas_por_mi") {
                    removeAllContend(usuario, true);
                    var data = {};
                    data[""] = "Todos";
                    populateSelectFromArray("usuario", data);
//                    populateSelect(self, "usuario", "nwMaker", "consultaUsuariosTerminal", false);
                    setVisibility(self, "usuario", true);
                    setEnabled(self, "usuario", false);

                    if (!isMobile()) {
                        thisDoc.updateContend();
                    }
                } else {
                    removeAllContend(usuario, true);
                    thisDoc.populateUsuario(self);
                    if (!isMobile()) {
                        thisDoc.updateContend();
                    }
                }
            });
        }

        if (typeof r != "undefined") {
            setValue(self, "grupo", r);
            var data = {};
            data["grupo"] = r;
//            populateSelect(self, "usuario", "nwMaker", "consultaParticipantesFilter", data);

            var data = {};
            data[r] = grupo_text;
            populateSelectFromArray("grupo", data);
            setValue(self, "grupo", r);

            setVisibility(self, "grupo", false);

        } else {

            var data = {};
            data["table"] = "nwtask_grupos";
            data["bindValues"] = {};
            data["bindValues"]["usuario"] = up.usuario;
//            populateSelect(self, "grupo", "nwMaker", "consultaGrupos", data);

            thisDoc.populateUsuario(self);

        }

        var html = "<h2 class='subtitles_bloques'>Tareas</h2>";
        addHeaderNoteList(html, self);

        setMaxWidthList(800, self);

        setMinHeightList(400, self);

        var nuevo = createButtonListEnc(self, "Nueva Tarea");
        nuevo.click(function () {
            var data = getDataFilters(self);
            var d = new newNwTask();
            d.constructor(data["grupo"], data["grupo_text"]);
            d.updateContend();
        });

        var update = getButtonUpdateFilter(self, "update");
        update.click(function () {
            thisDoc.updateContend();
        });

        thisDoc.updateContend();

    }

    function populateUsuario(self) {
        var up = getUserInfo();
        var data = {};
        data[up.id_usuario] = "Yo";
        populateSelectFromArray("usuario", data);
        setEnabled(self, "usuario");
        setValue(self, "usuario", up.id_usuario);
        setVisibility(self, "usuario", false);
    }

    function updateContend() {

        loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);

        var data = {};
        data["filters"] = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nwTask";
        rpc["method"] = "consultaTareas";
        rpc["data"] = data;
        var func = function (rj) {

            resetList(self);
            if (rj == "0" || rj == 0) {
                removeLoading(self);
                return false;
            }
            var r = rj["task"];
            for (var i = 0; i < r.length; i++) {
                var row = r[i];
                row["accion"] = "OK";
                if (row["estado"] == "Finalizado") {
                    row["accion"] = "Reabrir";
                }
                var t = addRowInList(self, row, i);
                var container1 = addContainerInRow(self, {"width": "100%", "height": "auto", "overflow": "auto"}, t);
                var html = "<div class='container-comments-task comments-task-" + i + "' >";
                if (typeof row["comments"] != "undefined") {
                    var comments = row["comments"];
                    var total = comments.length;
                    if (total > 0) {
                        html += "<span class='comentarios_task'>Comentarios " + total + "</span>";
                        for (var c = 0; c < total; c++) {
                            var com = comments[c];
                            html += "<div class='containers-row-comments-task' >";
                            html += "<div class='photouser-comment-task' style='background-image: url(/nwlib6/includes/phpthumb/phpThumb.php?src=" + com["foto_perfil"] + "&w=200&f=jpg);' ></div>";
                            html += "<div class='row-descripcion-comment' >";
                            html += "<span class='username-comment-task' >" + com["usuario_nombre"] + "</span> " + com["descripcion"];
                            if (evalueData(com["adjunto"])) {
                                html += "<span class='adjunto_comment_task'><a loading='NO' href='" + com["adjunto"] + "' target='_blank'>Adjunto: " + com["adjunto"] + "</a></span>";
                            }
                            html += "<div class='row-others-comment' >";
                            html += " " + com["fecha"] + " ";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                        }
                    }
                }
                html += "</div>";
                addInContainer(container1, html);
                row["tipo"] = "tarea";
                var d = new f_tareas_comentar(row, ".comments-task-" + i);
                d.constructor();
            }

            var up = getUserInfo();

            var options = {};
            options["height"] = "auto";
            options["max-height"] = "initial";
            options["padding"] = "0px";
            options["margin"] = "10px 0";
            options["background"] = "#fff";
            options["border"] = "1px solid #dfe0e4";
            options["border-bottom"] = "1px solid rgb(198, 199, 204)";
            options["margin-bottom"] = "13px";
            listAddCss(self, options);

            listAddCssFor(self, ".inputdatanwform", {"max-width": "140px"});
            listAddCssFor(self, ".colMobil", {"color": "rgb(161, 161, 161)"});
            listAddCssFor(self, ".colMobilLabel_tarea", {"width": "100%", "color": "rgb(83, 95, 105)", "font-size": "15px", "margin-bottom": "13px", "padding-top": "8px", "border-top": "1px solid #f5f5f5"});

            listAddCssFor(self, "", {"background": "transparent", "box-shadow": "none"});
            listAddCssFor(self, ".subtitles_bloques", {"background": "#ffffff", "border": "1px solid #dfe0e4"});
            listAddCssFor(self, ".containerFilters", {"border": "1px solid #dfe0e4"});
            listAddCssFor(self, ".colsMobilEnc", {"display": "none"});

            listAddCssFor(self, ".colMobilLabel_foto_perfil", {"width": "auto", "margin-left": "10px"});
            listAddCssFor(self, ".colMobilLabel_id", {"width": "auto"});
            listAddCssFor(self, ".colMobilLabel_asignado_a_text", {"width": "auto", "margin-left": "10px", "font-weight": "bold", "color": "rgb(83, 95, 105)"});
            listAddCssFor(self, ".colMobilLabel_asignado_por", {"width": "auto", "margin-left": "10px"});
            listAddCssFor(self, ".colMobilLabel_grupo_text", {"width": "auto", "margin-left": "10px"});
            listAddCssFor(self, ".colMobilLabel_fecha", {"width": "auto", "margin-left": "10px"});
            listAddCssFor(self, ".colMobilLabel_hora", {"width": "auto", "margin-left": "10px"});
            listAddCssFor(self, ".colMobilLabel_estado", {"width": "auto", "margin-left": "10px"});
            listAddCssFor(self, ".colMobilLabel_comentar", {"width": "auto", "margin-left": "10px"});
            listAddCssFor(self, ".colMobilLabel_accion", {"width": "auto", "margin-right": "20px", "float": "right", "max-width": "100px"});
            listAddCssFor(self, ".namedColMob", {"display": "block", "font-weight": "bold", "text-transform": "uppercase", "font-size": "9px"});
            listAddCssFor(self, ".namedColMobLabel_accion", {"display": "none"});
            listAddCssFor(self, ".namedColMobLabel_foto_perfil", {"display": "none"});
            listAddCssFor(self, ".namedColMobLabel_comentar", {"display": "none"});
            listAddCssFor(self, ".namedColMobLabel_asignado_a_text", {"display": "none"});
            listAddCssFor(self, ".nameColList_accion input", {"background": "#3cba6f", "color": "#fff", "text-shadow": "none", "box-shadow": "none", "border-radius": "3px", "border": "0", "cursor": "pointer"});
            listAddCssFor(self, ".colsMobil p", {"margin": "0", "padding": "5px 0"});
            listAddCssFor(self, ".colMobil", {"margin-top": "10px", "margin-left": "10px"});
            listAddCssFor(self, ".pColsIntListName_foto_perfil .imageListNwMaker2", {"background-size": "cover", "background-position": "center", "height": "40px", "width": "40px", "border-radius": "50%"});


            listAddCssFor(self, ".colMobilLabel_accion", {"margin-right": "0px", "position": "absolute", "top": "0px", "right": "10px"}, "mobile");
            listAddCssFor(self, ".namedColMob", {"display": "none"}, "mobile");
            listAddCssFor(self, ".colMobilLabel_foto_perfil", {"max-width": "60px"}, "mobile");
            listAddCssFor(self, ".colMobilLabel_asignado_a_text", {"max-width": "180px", "margin": "auto"}, "mobile");
            listAddCssFor(self, ".inputdatanwform", {"max-width": "100%"}, "mobile");
            listAddCssFor(self, ".colMobilLabel_tarea", {"color": "#000"}, "mobile");
            listAddCssFor(self, ".newContainerInRow", {"min-width": "100%"}, "mobile");


            showRowInMobile(self, "accion");
            showRowInMobile(self, "tarea");
            showRowInMobile(self, "grupo_text");
            showRowInMobile(self, "asignado_a_text");

            listScroll(self, false);

            var editar = addButtonContextMenu(self, "Editar");
            editar.click(function () {
                var data = getSelectedRecord(self);
                var d = new newNwTask();
                d.constructor();
                d.updateContend(data);
            });

            var eliminar = addButtonContextMenu(self, "Eliminar");
            eliminar.click(function () {
                var r = getSelectedRecord(self);
                var selfNew = generateSelf();
                createNwForms(selfNew, false, "popUp");
                addHeaderNote(selfNew, "¿Desea eliminar este registro?");
                setModal(true);
                setWidth(selfNew, 300);
                var accept = addButtonNwForm("Aceptar", selfNew);
                accept.click(function () {
                    var data = {};
                    data["id"] = r["id"];
                    data["table"] = "nwtask_tareas";
                    deleteRecordForId(data);
                    reject(selfNew);
                    thisDoc.updateContend();
                });
                var cancel = addButtonNwForm("Cancelar", selfNew);
                cancel.click(function () {
                    reject(selfNew);
                });
            });

            var btnOk = actionInColList(self, "accion");
            btnOk.click(function () {
                var data = getSelectedRecord(self);
                console.log(data);
                if (data["estado"] == "Finalizado") {
                    save(data, "Reabierto");
                    return;
                }
                if (data["asignado_a"] != up.id_usuario) {
                    $("<div>Esta tarea no le corresponde, ¿Desea finalizarla?</div>").dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: {
                            "Aceptar": function () {
                                $(this).dialog("close");
                                save(data, "Finalizado");
                            },
                            "Cancelar": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                } else {
                    save(data, "Finalizado");
                }
            });

            inactiveClicInRow(self);
            removeLoading(self);
        };
        rpcNw("rpcNw", rpc, func, true);
    }

    function save(data, estado) {
        var up = getUserInfo();
        data["estado"] = estado;
        if (data["asignado_por"] == up.usuario && data["asignado_a"] == up.id_usuario) {
            saveEnd(data);
            return true;
        }
        var self = generateSelf();
        var fields = [
            {
                tipo: 'textArea',
                nombre: 'Comentarios',
                name: 'comentarios_finalizado',
                requerido: "SI"
            }
        ];
        createNwForms(self, fields, "popUp");
//        setValue(self, "comentarios_finalizado", "Hecho!");
        setColumnsFormNumber(self, 1);
        setModal(true);
        setWidth(self, 300);
        var accept = addButtonNwForm("Aceptar", self);
        accept.click(function () {
            var datos = getRecordNwForm(self);
            data["comentarios_finalizado"] = datos["comentarios_finalizado"];
            saveEnd(data);
            reject(self);
        });
        var cancel = addButtonNwForm("Cancelar", self);
        cancel.click(function () {
            reject(self);
        });
    }

    function saveEnd(data) {
        var rpc = {};
        rpc["service"] = "nwTask";
        rpc["method"] = "updateTask";
        rpc["data"] = data;
        if (typeof data["comentarios_finalizado"] == "undefined") {
            data["comentarios_finalizado"] = "Hecho!";
        }
        var func = function (r) {
            if (r) {
                thisDoc.updateContend();
            } else {
                nw_dialog("A ocurrido un error: " + r);
            }
        };
        rpcNw("rpcNw", rpc, func, true);
    }

}