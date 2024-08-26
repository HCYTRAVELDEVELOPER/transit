var timeFMuro = "";
function l_muro_publico() {

    empty(".l_muro_publico");

    var divPadreContainer = ".container-main-center-nwtask";
    var classDocument = ".l_muro_publico";
    createContainer(divPadreContainer, true, classDocument);
    var self = createDocument(classDocument);
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;

    function constructor(grupo) {

        clearTimeout(timeFMuro);

        var columns = [
            {
                label: "ID",
                caption: "id",
                visible: false
            },
            {
                label: "Usuario",
                caption: "usuario",
                visible: false
            },
            {
                label: "Foto perfil",
                caption: "foto_perfil",
                type: "image",
                mode: "phpthumb",
                clickable: false
            },
            {
                label: "Nombre",
                caption: "usuario_nombre"
            },
            {
                label: "Fecha",
                caption: "fecha"
            },
            {
                label: "Grupo ID",
                caption: "grupo",
                visible: false
            },
            {
                label: "Grupo",
                caption: "grupo_text"
            },
            {
                label: "Tipo",
                caption: "tipo"
            },
            {
                label: "Privacidad",
                caption: "privacidad"
            },
            {
                label: "Publicación",
                caption: "publicacion"
            }
        ];
        createList(columns, self);

        var filters = [
            {
                name: "usuario",
                caption: "usuario",
                label: "Usuario",
                tipo: "selectBox",
                enabled: true
            },
            {
                name: "grupo",
                caption: "grupo",
                label: "Grupo",
                tipo: "selectBox",
                enabled: true
            },
            {
                name: "fecha_inicial",
                caption: "fecha_inicial",
                label: "Fecha Inicial",
                tipo: "date"
            },
            {
                name: "fecha_final",
                caption: "fecha_final",
                label: "Fecha Final",
                tipo: "date"
            }
        ];
        createFilters(filters, self);

        setValue(self, "fecha_inicial", getFechaHoy());
        setValue(self, "fecha_final", getFechaHoy());

        var data = {};
        data[""] = "Todos";
        populateSelectFromArray("usuario", data);
        populateSelectFromArray("grupo", data);
        populateSelect(self, "grupo", "nwTask", "consultaGrupos", {});
        populateSelect(self, "usuario", "nwTask", "consultaUsuariosTerminal", {allusers: true});

        var update = getButtonUpdateFilter(self, "update");
        update.click(function () {
            thisDoc.updateContend();
        });

        listScroll(self, false);
        thisDoc.updateContend();
    }

    function updateContend(noLoading) {

        if (typeof noLoading == "undefined") {
            loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);
        }
        var data = {};
        data["filters"] = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nwTask";
        rpc["method"] = "consultaWallPublic";
        rpc["data"] = data;
        var func = function (rj) {
            resetList(self);
            if (rj == "0" || rj == 0) {
                listBloqs(self, 2);
                removeLoading(self);
                return false;
            }
//            setModelData(r, self);
            var r = rj["task"];
            for (var i = 0; i < r.length; i++) {
                var row = r[i];
                var t = addRowInList(self, row, i);

                var container1 = addContainerInRow(self, {"width": "100%", "height": "auto", "overflow": "auto"}, t);

                var html = "<div class='container-comments-task comments-task-" + i + "' >";
                html += "<div class='like-comment-wall' data-id='" + row["id"] + "'  likes-comment='" + row["me_gusta"] + "' >Me gusta " + row["me_gusta"] + "</div>";

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
                row["tipo"] = "muro";
                row["asignado_por"] = row["usuario"];
                row["asignado_a_username"] = row["usuario"];
                var d = new f_tareas_comentar(row, ".comments-task-" + i, thisDoc);
                d.constructor();
            }

            var up = getUserInfo();

            listBloqs(self, 2);
            var options = {};
            options["width"] = "auto";
            options["float"] = "none";
            listAddCss(self, options);

            moveDataToColumn(self, "4", "3");
            moveDataToColumn(self, "6", "3");
            moveDataToColumn(self, "7", "3");
            moveDataToColumn(self, "8", "3");

            listAddCssFor(self, ".colMobil", {"width": "auto", "float": "left", "min-width": "auto", "color": "#a1a1a1"});
            listAddCssFor(self, ".colMobilLabel_foto_perfil", {"width": "auto", "float": "left", "max-width": "50px", "min-width": "50px"});
            listAddCssFor(self, ".colMobilLabel_usuario_nombre", {"width": "auto", "float": "left", "max-width": "500px", "min-width": "500px"});
            listAddCssFor(self, ".nameColList_usuario_nombre", {"font-weight": "bold", "color": "#4c7dc8", "font-size": "13px"});
            listAddCssFor(self, ".pColsIntListName_privacidad", {"margin": "15px 0px 3px 5px"});
            listAddCssFor(self, ".imageListNwMaker2", {"background-size": "cover", "background-position": "center"});
            listAddCssFor(self, ".pColsIntListName_foto_perfil", {"padding": "0"});
            listAddCssFor(self, ".colMobilLabel_publicacion", {"width": "97%", "font-size": "15px", "color": "#535F69"});
            listAddCssFor(self, ".colMobilLabel_publicacion", {"color": "#000"}, "mobile");

            listAddCssFor(self, ".containerFilters .divContainInput", {"margin": "0px 2px 0px 0px"});
            listAddCssFor(self, ".containerFilters .inputdatanwform", {"max-width": "148px"});
            listAddCssFor(self, ".containerFilters .inputdatanwform", {"max-width": "initial"}, "mobile");
            listAddCssFor(self, ".newContainerInRow", {"min-width": "100%"}, "mobile");

            listAddCssFor(self, ".namedColMob", {"display": "none"});
            listAddCssFor(self, ".colsMobil p", {"margin": "5px 0px", "padding": "5px 0px"});
            listAddCssFor(self, ".colMobilLabel_usuario_nombre", {"max-width": "190px", "min-width": "auto"}, "mobile");
            showRowInMobile(self, "usuario_nombre");
            showRowInMobile(self, "fecha");
            showRowInMobile(self, "publicacion");

            $(self + " .like-comment-wall").click(function () {
                var id = $(this).attr("data-id");
                var me_gusta = $(this).attr("likes-comment");
                var rpc = {};
                rpc["service"] = "nwTask";
                rpc["method"] = "saveLikeCommentTask";
                rpc["data"] = {id: id, me_gusta: me_gusta};
                var func = function (r) {
                    thisDoc.updateContend(true);
                };
                rpcNw("rpcNw", rpc, func, true);
            });

            var ocultar = addButtonContextMenu(self, "Ocultar");
            ocultar.click(function () {
                var data = getSelectedRecord(self);
                return;
            });

//            var editar = addButtonContextMenu(self, "Editar");
//            addClass(self, "." + $(editar).attr("class").split(" ")[1], "subMenuUserProperty");
//            editar.click(function () {
//                var data = getSelectedRecord(self);
//                var d = new participantesForm();
//                d.constructor();
//                d.updateContend(data);
//            });

            var eliminar = addButtonContextMenu(self, "Eliminar");
            addClass(self, "." + $(eliminar).attr("class").split(" ")[1], "subMenuUserProperty");
            eliminar.click(function () {
                var r = getSelectedRecord(self);
                var selfNew = generateSelf();
                createNwForms(selfNew, false, "popUp");
                addHeaderNote(selfNew, "¿Desea eliminar esta publicación?");
                setModal(true);
                setWidth(selfNew, 300);
                var accept = addButtonNwForm("Aceptar", selfNew);
                accept.click(function () {
                    var data = {};
                    data["id"] = r["id"];
                    data["table"] = "nwtask_wall_public";
                    deleteRecordForId(data);
                    reject(selfNew);
                    thisDoc.updateContend(true);
                });
                var cancel = addButtonNwForm("Cancelar", selfNew);
                cancel.click(function () {
                    reject(selfNew);
                });
            });

            for (var i = 0; i < r.length; i++) {
                var g = r[i];
                if (g["usuario"] != up.usuario) {
                    remove(".colsMenuIntID_" + g["id"] + " .subMenuUserProperty");
                }
            }
//            timeFMuro = setTimeout(function () {
//                var d = new l_muro_publico();
//                d.constructor();
//            }, 30000);
            removeLoading(self);
        };
        rpcNw("rpcNw", rpc, func, true);
    }
}