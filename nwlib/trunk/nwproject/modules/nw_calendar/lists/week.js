function week(po, editInCalendar) {
//    var divPadreContainer = ".weekend_task";
//    empty(divPadreContainer);
    var numrand = Math.floor((Math.random() * 1000) + 1);
    var classDocument = ".week";
//    var classDocument = ".week" + Math.floor((Math.random() * 1000) + 1);
//    createContainer(divPadreContainer, true, classDocument);
//    var self = createDocument(classDocument);

//    empty(classDocument);
    var self = createDocument(classDocument);
    if (evalueData(po)) {
        self = po;
    }
    var thisDoc = this;
    this.constructor = constructor;
    this.updateContend = updateContend;
    this.self = self;
    var up = getUserInfo();

    hoverInBloq = false;

    function constructor(date) {

//        empty(classDocument);
        empty(classDocument + " .container-table-list");
        var addFilters = true;
        if (evalueData(date)) {
            addFilters = false;
        }

        var f1 = "";
        var f2 = "";
        var f3 = "";
        var f4 = "";
        var f5 = "";
        var f6 = "";
        var f7 = "";
        if (date == undefined) {
            date = getFechaHoraActual();
        }
        var ff = dataOfDate(date);
        var b = calculaSemanaByWeek(ff["semana"], ff["fecha_anio"]);
        for (var v = 0; v < b.length; v++) {
            if (v == 0) {
                f1 = b[v];
            }
            if (v == 1) {
                f2 = b[v];
            }
            if (v == 2) {
                f3 = b[v];
            }
            if (v == 3) {
                f4 = b[v];
            }
            if (v == 4) {
                f5 = b[v];
            }
            if (v == 5) {
                f6 = b[v];
            }
            if (v == 6) {
                f7 = b[v];
            }
        }
        var columns = [
            {
                label: "Hora <br />",
                caption: "hora"
            },
            {
                label: 'Lun <br /><span class="enc_lunes" data="' + f1 + '">' + f1 + '</span>',
                caption: "lunes"
            },
            {
                label: 'Mar <br /> <span class="enc_martes" data="' + f2 + '">' + f2 + '</span>',
                caption: "martes"
            },
            {
                label: 'Mié <br /> <span class="enc_miercoles" data="' + f3 + '">' + f3 + '</span>',
                caption: "miercoles"
            },
            {
                label: 'Jue  <br /><span class="enc_jueves" data="' + f4 + '">' + f4 + '</span>',
                caption: 'jueves'
            },
            {
                label: 'Vie  <br /><span class="enc_viernes" data="' + f5 + '">' + f5 + '</span>',
                caption: 'viernes'
            },
            {
                label: 'Sáb <br /> <span class="enc_sabado" data="' + f6 + '">' + f6 + '</span>',
                caption: 'sabado'
            },
            {
                label: 'Dom <br /> <span class="enc_domingo" data="' + f7 + '">' + f7 + '</span>',
                caption: 'domingo'
            }
        ];
        createList(columns, self);

        var filtersVisible = true;
        if (evalueData(po)) {
            filtersVisible = false;
        }
        filtersVisible = false;

        if (true === addFilters) {

            var filters = [
                {
                    name: "fecha_i_save",
                    caption: "fecha_i_save",
                    label: "Fecha Inicial Save",
                    tipo: "dateField",
                    visible: false
                },
                {
                    name: "hora_i_save",
                    caption: "hora_i_save",
                    label: "Hora Inicial Save",
                    tipo: "textField",
                    visible: false
                },
                {
                    name: "fecha_f_save",
                    caption: "fecha_f_save",
                    label: "Fecha Final Save",
                    tipo: "dateField",
                    visible: false
                },
                {
                    name: "hora_f_save",
                    caption: "hora_f_save",
                    label: "Hora Final Save",
                    tipo: "textField",
                    visible: false
                },
                {
                    name: "fecha_inicial",
                    caption: "fecha_inicial",
                    label: "Fecha Inicial",
                    tipo: "dateField",
                    visible: filtersVisible
                },
                {
                    name: "fecha_final",
                    caption: "fecha_final",
                    label: "Fecha Final",
                    tipo: "dateField",
                    visible: filtersVisible
                },
                {
                    name: "back_calendar",
                    caption: "back_calendar",
                    label: "Atrás",
                    tipo: "button"
                },
                {
                    name: "next_calendar",
                    caption: "next_calendar",
                    label: "Siguiente",
                    tipo: "button"
                },
                {
                    name: "estado_calendar",
                    caption: "estado_calendar",
                    label: "Estado",
                    tipo: "selectBox"
                },
                {
                    name: "departamento_calendar",
                    caption: "departamento_calendar",
                    label: "Área",
                    tipo: "selectBox"
                },
                {
                    name: "grupo_calendar",
                    caption: "grupo_calendar",
                    label: "Grupo",
                    tipo: "selectBox",
                    visible: filtersVisible
                },
                {
                    name: "usuario_calendar",
                    caption: "usuario_calendar",
                    label: "Usuario",
                    tipo: "selectBox"
                }
            ];
            createFilters(filters, self);

            var data = {};
            data["pend_fin"] = "Pendientes y finalizadas";
            data["Nuevo"] = "Sin Resolver";
            data["Reabierto"] = "Reabierto";
            data["Finalizado"] = "Finalizado";
            data["finalizado_sin_calif_asig_me"] = "Sin calificar, finalizadas y asignadas por mi";
            data["todas"] = "Todas";
            populateSelectFromArray("estado_calendar", data);

            var data = {};
            data["todos"] = "Todos";
            populateSelectFromArray("grupo_calendar", data);
            populateSelectFromArray("departamento_calendar", data);
            populateSelectFromArray("usuario_calendar", data);

            var data = {};
            data["table"] = "nwtask_grupos";
            data["bindValues"] = {};
            data["bindValues"]["usuario"] = up.usuario;
            populateSelect(self, "grupo_calendar", "nwTask", "consultaGrupos", data);

            var data = {};
            data['table'] = 'nwmaker_departamentos';
            data['bindValues'] = {};
            data['bindValues']['terminal'] = up.terminal;
            populateSelect(self, 'departamento_calendar', 'nwprojectOut', 'populate', data, ' and terminal=:terminal');

            var data = {};
            data["allusers"] = true;
            populateSelect(self, "usuario_calendar", "nwTask", "consultaUsuariosTerminal", data);
            var user = up.id_usuario;
            var rr = getRecordNwForm(self);
            if (evalueData(rr["asignado_a"])) {
                user = rr["asignado_a"];
            }
            setValue(self, "usuario_calendar", user);

            listScroll(self, true);

            var update = getButtonUpdateFilter(self, "update");
            update.click(function () {
                thisDoc.updateContend();
            });

            var btn = selfButton(self, "back_calendar");
            btn.click(function () {
                var datos = getDataFilters(self);
                var f = dataOfDate(datos["fecha_inicial"]);
                var g = calculaSemanaByWeek(f["semana"] - 1, f["fecha_anio"]);
                thisDoc.constructor(g[0]);
            });

            var btn = selfButton(self, "next_calendar");
            btn.click(function () {
                var datos = getDataFilters(self);
                var f = dataOfDate(datos["fecha_final"]);
                var g = calculaSemanaByWeek(f["semana"] + 1, f["fecha_anio"]);
                thisDoc.constructor(g[0]);
            });

        }

        setValue(self, "fecha_inicial", f1);
        setValue(self, "fecha_final", f7);

        thisDoc.updateContend();
    }

    function updateContend() {
        var dat = {};
        dat["filters"] = getDataFilters(self);
        var rpc = {};
        rpc["service"] = "nwtask";
        rpc["method"] = "consultaTareasCalendar";
        rpc["data"] = dat;
        var func = function (r) {
            var h_init = 7;
            var total_horas = 32;
            var m_init = "00";
            var data = [];

            for (var i = 0; i < total_horas; i++) {
                data[i] = {};
                data[i]["hora"] = h_init + ":" + m_init;
                if (data[i]["hora"].length == 4) {
                    data[i]["hora"] = "0" + h_init + ":" + m_init;
                }
                if (i % 2 == 0) {
                    m_init = "30";
                } else {
                    h_init++;
                    m_init = "00";
                }

                var lun = "";
                var mar = "";
                var mie = "";
                var jue = "";
                var vie = "";
                var sab = "";
                var dom = "";
                for (var x = 0; x < r.length; x++) {
                    var y = r[x];

                    if (!evalueData(y["fecha_inicio"])) {
                        y["fecha_inicio"] = y["fecha"];
                    }
                    if (!evalueData(y["hora_inicial"])) {
                        y["hora_inicial"] = y["hora"];
                    }
                    if (!evalueData(y["hora_final"])) {
                        y["hora_final"] = y["hora"];
                    }
                    var f = dataOfDate(y["fecha"]);
                    var f2 = dataOfDate(y["fecha_inicio"]);
                    var h_int = data[i]["hora"] + ":00";
                    h_int = h_int.replace(/:/gi, "");
                    h_int = parseInt(h_int);
                    var h1_int = parseInt(y["hora_inicial"].replace(/:/gi, ""));
                    var h2_int = parseInt(y["hora_final"].replace(/:/gi, ""));


                    if (h_int >= h1_int && h_int <= h2_int) {
                        if (f["fecha_dia_text"] == "Lunes" || f2["fecha_dia_text"] == "Lunes") {
                            lun += dataForBloq(y, f, h_int, "lunes");
                        }
                        if (f["fecha_dia_text"] == "Martes" || f2["fecha_dia_text"] == "Martes" || f["fecha_dia_semana"] > 1 && f2["fecha_dia_semana"] < 3) {
                            mar += dataForBloq(y, f, h_int, "martes");
                        }
                        if (f["fecha_dia_text"] == "Miércoles" || f2["fecha_dia_text"] == "Miércoles" || f["fecha_dia_semana"] > 2 && f2["fecha_dia_semana"] < 4) {
                            mie += dataForBloq(y, f, h_int, "miercoles");
                        }
                        if (f["fecha_dia_text"] == "Jueves" || f2["fecha_dia_text"] == "Jueves" || f["fecha_dia_semana"] > 3 && f2["fecha_dia_semana"] < 5) {
                            jue += dataForBloq(y, f, h_int, "jueves");
                        }
                        if (f["fecha_dia_text"] == "Viernes" || f2["fecha_dia_text"] == "Viernes" || f["fecha_dia_semana"] > 4 && f2["fecha_dia_semana"] < 6) {
                            vie += dataForBloq(y, f, h_int, "viernes");
                        }
                        if (f["fecha_dia_text"] == "Sábado" || f2["fecha_dia_text"] == "Sábado" || f["fecha_dia_semana"] > 5 && f2["fecha_dia_semana"] < 7) {
                            sab += dataForBloq(y, f, h_int, "sabado");
                        }
                        if (f["fecha_dia_text"] == "Domingo" || f2["fecha_dia_text"] == "Domingo") {
                            dom += dataForBloq(y, f, h_int, "domingo");
                        }
                    }
                }
                data[i]["lunes"] = lun;
                data[i]["martes"] = mar;
                data[i]["miercoles"] = mie;
                data[i]["jueves"] = jue;
                data[i]["viernes"] = vie;
                data[i]["sabado"] = sab;
                data[i]["domingo"] = dom;
            }

            setModelData(data, self);

            var d = $(".divSeparatorCal");
            var t = d.length;
            for (var p = 0; p < t; p++) {
                var s = $(d[p]);
                var a = s.attr("data");
                var c = s.attr("data-user");
                var e = s.attr("data-id");
                var tt = $(a).length;
                var te = $(e).length;
//                if (tt > 3) {
//                    $(a).css({"width": "75px", "height": "auto"});
//                } else {
                $(a).css({"width": 100 / tt + "%"});
//                }
                $(c + " .divSeparatorCalIntern").css({"background": getRandomColor()});

                if (te > 1) {
                    $(e).addClass("taskUnitedCal");
                    var k = $(e);
                    $(e).css({"font-size": "0px"});
                    $(k[0]).css({"font-size": "12px", "margin-top": "1px"});
//                    var w = $(k[0]).width();
//                    $(e).css({"width": w});
                }

            }

            function dataForBloq(y, f, h_int, day) {
                var aprobed = "";
                if (y["estado"] == "Finalizado") {
                    aprobed = " taskFinalizada";
                }
                var rta = "<div class='divSeparatorCal divSeparatorCal_" + numrand + " divSeparatorCal_" + day + h_int + " divSeparatorUs_" + y["asignado_a"] + " divSeparatorID_" + y["id"] + "' data='.divSeparatorCal_" + day + h_int + "' data-user='.divSeparatorUs_" + y["asignado_a"] + "' data-id='.divSeparatorID_" + y["id"] + "' data-id-only='" + y["id"] + "'>";
                rta += "<div class='" + aprobed + " divSeparatorCalIntern'>";
                rta += "<span class='nameSpan'>" + y["asignado_a_text"] + "</span>";
                rta += "<div class='nameContainP'>";
                rta += y["tarea"];
                rta += "</div>";
                if (evalueData(y["grupo_text"])) {
                    rta += "<span class='nameSpan'>Grupo: " + y["grupo_text"] + "</span>";
                }
                rta += "<span class='nameSpan'>Por: " + y["asignado_por"] + "</span>";
                if (evalueData(y["prioridad"])) {
                    rta += "<span class='nameSpan'>Prioridad: " + y["prioridad"] + "</span>";
                }
                if (evalueData(y["peso"])) {
                    rta += "<span class='nameSpan'>Dificultad: " + y["peso"] + "</span>";
                }
                rta += "<span class='nameSpan'>Estado: " + y["estado"] + "</span>";
                rta += "</div>";
                rta += " </div> ";
                return rta;
            }

            var options = {};
            options["width"] = "auto";
            options["height"] = "auto";
            options["max-height"] = "50px";
            options["-webkit-user-select"] = "none";
            options["-moz-user-select"] = "none";
            options["-ms-user-select"] = "none";
            options["user-select"] = "none";
            listAddCss(self, options);

            listAddCssFor(self, ".colMobilLabel_hora", {"background": "#2c2d32", "color": "#fff"});
            listAddCssFor(self, ".nameColList_hora", {"text-align": "center", "line-height": "4", "display": "block"});
            listAddCssFor(self, ".colEncMobil", {"text-align": "center", "background": "#2c2d32", "color": "#fff"});
            listAddCssFor(self, ".colsMobil p", {"padding": "0px", "margin": "0px"});
            listAddCssFor(self, ".colsMobil", {"display": "flex", "border": "0px"});
            listAddCssFor(self, ".colMobil", {"outline": "1px solid #e9e9e9", "cursor": "pointer"});
            listAddCssFor(self, ".container-table-list", {"-webkit-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none"});
            listAddCssFor(self, ".colEncMobil_Hora", {"height": "48px"});
            listAddCssFor(self, ".divContainInput select", {"max-width": "130px"});
            listAddCssFor(self, ".divContainInput input", {"max-width": "130px"});

            $("body").append("<div class='toolTipNwOne'></div>");
            $(".divSeparatorCalIntern").mousemove(function (evento) {
                var html = $(this).html();
                e = evento || event;
                var a = pintaPosPuntero(e);
                $(".toolTipNwOne").fadeIn(0).css({"top": a.cursorY, "left": a.cursorX}).html(html);
            });
            $(".divSeparatorCalIntern").mouseleave(function (evento) {
                $(".toolTipNwOne").html(" ").fadeOut(0);
            });
            $(".colMobil").mousemove(function (evento) {
                if (hoverInBloq) {
                    $(this).addClass("selected_calendar");
                }
            });
            $(".colMobil").mousedown(function () {
                hoverInBloq = true;
                var a = $(".colsMobil").has(this);
                var ass = a[0];
                $("*").removeClass("selected_calendar");
                $(this).addClass("selected_calendar");

                $("*").removeClass("colsMobil_show");
                $(ass).addClass("colsMobil_show");

                var r = getSelectedRecord(self);
                var named = $(this).attr("named");
                var fecha = $(".enc_" + named).attr("data");
                setValue(self, "fecha_i_save", fecha);
                setValue(self, "hora_i_save", r.hora);

            });

            $(".colMobil").mouseup(function () {
                hoverInBloq = false;
                var a = $(".colsMobil").has(this);
                var ass = a[0];
                $("*").removeClass("colsMobil_show");
                $(ass).addClass("colsMobil_show");

                $(this).addClass("selected_calendar");

                var r = getSelectedRecord(self);
                var named = $(this).attr("named");
                var fecha = $(".enc_" + named).attr("data");
                setValue(self, "fecha_f_save", fecha);
                setValue(self, "hora_f_save", r.hora);

                if (evalueData(po)) {
                    var params = {};
                    params.html = '¿Desea continuar?';
                    params.onCancel = function () {
                        $("*").removeClass("colsMobil_show");
                        $("*").removeClass("selected_calendar");
                    };
                    params.onSave = function () {
                        loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);
                        var filters = getDataFilters(self);
                        var data = getRecordNwForm(self);
                        data["nombre_archivo"] = nameRealFile($(self + " .uploader_adjunto").val());
                        data["fecha_inicio"] = filters["fecha_i_save"];
                        data["fecha"] = filters["fecha_f_save"];
                        data["hora_inicial"] = filters["hora_i_save"];
                        data["hora_final"] = filters["hora_f_save"];
                        var rpc = {};
                        rpc["service"] = "nwTask";
                        rpc["method"] = "save";
                        rpc["data"] = data;
                        var func = function (r) {
                            if (!verifyErrorNwMaker(r)) {
                                return;
                            }
                            if (r) {
                                if (evalueData(editInCalendar) || editInCalendar === "nuevodesdecalendar") {
                                    rejectForm(self, "popup");
                                    loadCalendarTask();
                                } else {
                                    var d = new createListTaskNw();
                                    d.updateContend();
                                    rejectForm(self, "popup");
                                }
                            } else {
                                nw_dialog("A ocurrido un error: " + r);
                            }
                            removeLoading(self);
                        };
                        rpcNw("rpcNw", rpc, func, true);
                    };
                    createDialogNw(params);
                } else {

                    var bu = $(this).has(".divSeparatorCalIntern");
                    if (bu.length > 0) {
                        return;
                    }
                    var filters = getDataFilters(self);
                    var data = {};
                    data["asignado_a"] = filters["usuario_calendar"];
                    data["fecha_inicio"] = filters["fecha_i_save"];
                    data["fecha"] = filters["fecha_f_save"];
                    data["hora_inicial"] = filters["hora_i_save"];
                    data["hora_final"] = filters["hora_f_save"];
                    var d = new newNwTask();
                    d.constructor(false, false, false, false, "nuevodesdecalendar");
                    d.updateContend(data);
                }
            });

            if (evalueData(po)) {
                var bb = $(".ui-dialog").has(self);
                var bnn = bb[0];
                $(bnn).css({"max-width": "100%", "width": "100%", "left": "0px", "top": "0px"});
            }

            if (!evalueData(po)) {
                click(self + " .divSeparatorCal_" + numrand, function () {
                    loading("Cargando", "rgba(255, 255, 255, 0.76)!important", self);
                    var id = $(this).attr("data-id-only");
                    openInframeTask(id);
                    removeLoading(self);
                    return;

                    var rpc = {};
                    rpc["service"] = "nwTask";
                    rpc["method"] = "consultaTaskByID";
                    rpc["data"] = {id: id};
                    var func = function (r) {
                        if (!verifyErrorNwMaker(r)) {
                            return;
                        }
                        var d = new newNwTask();
                        d.constructor(false, false, false, false, true);
                        d.updateContend(r);
                        removeLoading(self);
                    };
                    rpcNw("rpcNw", rpc, func, true);
                });
            }

            listWidthByColumn(self, 0, "80px");

            remove(self + " .menuList");
            listAddCssFor(self, "", {"width": "99%"});

            adapterSizeList(self);

        };
        rpcNw("rpcNw", rpc, func, true);
    }
}