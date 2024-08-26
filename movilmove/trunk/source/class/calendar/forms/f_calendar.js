qx.Class.define("calendar.forms.f_calendar", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.createBase();
        this.setTitle(self.tr("Calendario de servicios"));
        var fields = [
            {
                name: "conductor",
                label: self.tr("Buscar"),
                type: "textField",
                required: false
            },
            {
                name: "buscar",
                label: self.tr("Buscar"),
                type: "button"
            }
//            ,
//            {
//                name: "explica_colores",
//                label: self.tr("Colores: <span class='explicolor'>SOLICITUD</span>"),
//                type: "label"
//            }
        ];
        self.setFields(fields);

//        self.ui.explica_colores.setValue("<strong style='color: red;'>Prueba</strong>");



        var ht = "<span class='explicolor' style='background-color: " + self.getColor()["SOLICITUD"] + ";'>SOLICITUD</span>";
        ht += "<span class='explicolor' style='background-color: " + self.getColor()["ACEPTADO_RESERVA"] + ";'>ACEPTADO_RESERVA</span>";
        ht += "<span class='explicolor' style='background-color: " + self.getColor()["EN_RUTA"] + ";'>EN_RUTA</span>";
        ht += "<span class='explicolor' style='background-color: " + self.getColor()["EN_SITIO"] + ";'>EN_SITIO</span>";
        ht += "<span class='explicolor' style='background-color: " + self.getColor()["ABORDO"] + ";'>ABORDO</span>";
        ht += "<span class='explicolor' style='background-color: " + self.getColor()["LLEGADA_DESTINO"] + ";'>LLEGADA_DESTINO</span>";
        ht += "<span class='explicolor' style='background-color: " + self.getColor()["SIN_ATENDER"] + ";'>SIN_ATENDER</span>";
        ht += "<span class='explicolor' style='background-color: " + self.getColor()["CANCELADO_POR_USUARIO"] + ";'>CANCELADO_POR_USUARIO CANCELADO_POR_CONDUCTOR CANCELADO_POR_ADMIN</span>";
        self.addHeaderNote(ht);

        self.ui.conductor.setPlaceholder("Buscar por placa, nombre conductor, celular conductor, cliente");
        self.ui.buscar.setMaxWidth(80);
        self.ui.buscar.setMinWidth(80);

        self.datesConsulta = {};

        self.ui.buscar.addListener("execute", function () {
            self.calendar.removeAllEvents();
            self.consultaInicial();
        });
        self.ui.accept.addListener("execute", function () {
            self.accept();
        });
        self.ui.cancel.addListener("execute", function () {
            self.reject();
        });

        self.created = false;
        self.addListener("appear", function () {
            if (!self.created) {
                qx.bom.element.Class.add(self.getContentElement().getDomElement(), "container_calendar");

                qxnw.utils.loadLibCalendar(".container_calendar", function (calendarEl) {

                    if (qxnw.utils.evalueData(self.calendar)) {
                        self.calendar.destroy();
                    }

                    self.calendar = new FullCalendar.Calendar(calendarEl, {
                        headerToolbar: {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                        },
                        initialView: "timeGridWeek", //dayGridMonth timeGridWeek timeGridDay listWeek
//                    listMonth: "dayGridMonth",
                        listMonth: "timeGridWeek",
                        dayGridMonth: "Mes",
                        timeGridWeek: "Semana",
                        timeGridDay: "Día",
                        listYear: 'Agenda Año',
//                    listMonth: 'Agenda Mes',
                        slotMinTime: '06:00',
                        slotMaxTime: '23:00',
                        height: "auto",
                        slotDuration: "00:30:00",
                        weekends: true,
                        fixedWeekCount: true,
                        showNonCurrentDates: true,
                        initialDate: qxnw.utils.getActualDate(),
                        navLinks: true, // can click day/week names to navigate views
                        businessHours: true, // display business hours
                        headerToolbar_left: 'prev,next today', //'prevYear,prev,next,nextYear today';
                        businessHoursDaysWeekStartTime: '07:00',
                        businessHoursDaysWeekEndTime: '18:30',
                        businessHoursWeekEnd: [6], // saturday
                        businessHoursWeekEndStartTime: '08:00',
                        businessHoursWeekEndEndTime: '14:00',
                        events: [],
                        selectMirror: true,
                        weekNumberCalculation: 'ISO',
                        initialLocaleCode: 'es',
                        editable: false,
                        selectable: true,
                        expandRows: false,
                        nowIndicator: true,
                        weekNumbers: false,
                        eventDidMount: function (info) {
//                        console.log("eventDidMount", info);
                        },
                        eventClick: function (info) {
                            var html = "<div class='divopencalendarevent'>";
                            html += info.event.title;
//                            html += 'Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY;
//                            html += 'View: ' + info.view.type;
                            html += "</div>";
                            qxnw.utils.information(html);
                            info.el.style.borderColor = 'red';
                        },
                        datesSet: function (event) {
                            if (self.createFirstTime === true) {
                                var f_inicial = event.startStr.split("T")[0];
                                var f_final = event.endStr.split("T")[0];
                                self.setEvents(f_inicial, f_final);
                            }
                        },
//                    eventsSet: function (events) {
//                        console.log("eventsSet", events);
//                    },
                        select: function (arg) {
                            console.log("arg", arg);

                            var d = new enrutamiento.tree.enrutamiento();
                            d.settings.accept = function () {
                                self.calendar.removeAllEvents();
                                self.consultaInicial();
                            };
                            d.setModal(true);
                            d.maximize();
                            d.show();

                            d.addListener("appear", function () {
                                var fecha = arg.startStr.split("T")[0];
                                var hora = arg.startStr.split("T")[1];
                                hora = hora.split("-")[0];
                                d.form.ui.fecha.setValue(fecha);
                                d.form.ui.hora.setValue(hora);
                            });
//                        var title = prompt('Título:');
//                        if (title) {
//                            self.calendar.addEvent({
//                                title: title,
//                                start: arg.start,
//                                end: arg.end,
//                                allDay: arg.allDay
//                            });
//                        }
//                        self.calendar.unselect();
                        }
                    });
                    self.calendar.render();

                    setTimeout(function () {
                        self.consultaInicial();
                    }, 1000);

//                self.calendar.batchRendering(function () {
//                    console.log("batchRendering");
//                    self.calendar.changeView('dayGridMonth');
//                    self.calendar.addEvent({title: 'new event', start: '2018-09-01'});
//                });
                });
                self.created = true;
            }
        });
//        var data = {};
//        data.table = "edo_subservice";
//        qxnw.utils.populateSelect(self.ui.service, "master", "populate", data);
    },
    destruct: function () {
    },
    members: {
        __total: null,
        navTable: null,
        __addButon: null,
        __removeButton: null,
        getColor: function getColor() {
            var r = [];
            r["ACEPTADO_RESERVA"] = "#ba65af";
            r["SOLICITUD"] = "#66fd8a";
            r["EN_RUTA"] = "#1561e0";
            r["EN_SITIO"] = "#cbb90a";
            r["ABORDO"] = "#FA8F44";
            r["LLEGADA_DESTINO"] = "green";
            r["SIN_ATENDER"] = "#F05A3A";
            r["CANCELADO_POR_USUARIO"] = "red";
            r["CANCELADO_POR_CONDUCTOR"] = "red";
            r["CANCELADO_POR_ADMIN"] = "red";
            return r;
        },
        activarTooltip: function activarTooltip() {

            const buttons = document.querySelectorAll('.fc-event-main-frame');

            buttons.forEach(button => {
                button.addEventListener("mousemove", (event) => {
                    console.log(event.target.innerText);
                    var el = this;
                    console.log("el", el);
//                    var ht = el.textContent;
//                    var ht = el.innerHTML;
                    var ht = event.target.innerText;
//                    var rect = el.getBoundingClientRect();
//                    var top = rect.top;
//                    var left = rect.left;
                    var top = event.clientY;
                    var left = event.clientX;
                    qxnw.utils.remove(".tooltip_calendarnw");
                    var tol = document.createElement("div");
                    tol.className = "tooltip_calendarnw";
                    tol.innerHTML = ht;
                    tol.style = "top: " + top + "px; left: " + left + "px;";
                    document.body.appendChild(tol);
                });
                button.addEventListener("mouseout", (event) => {
                    qxnw.utils.remove(".tooltip_calendarnw");
                });
            });
        },
        consultaInicial: function consultaInicial() {
            var self = this;

            var date = new Date();
//            var firstday = new Date(date.getFullYear(), date.getMonth(), 1);
//            var lastday = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var firstday = new Date(date.setDate(date.getDate() - date.getDay() + 1));
            var yyyy = firstday.getFullYear();
            var mm = firstday.getMonth() + 1;
            var dd = firstday.getDate();
            if (dd < 10)
                dd = '0' + dd;
            if (mm < 10)
                mm = '0' + mm;
            var f_inicial = yyyy + '-' + mm + '-' + dd;


            var lastday = new Date(date.setDate(date.getDate() - date.getDay() + 7));
            var yyyy = lastday.getFullYear();
            var mm = lastday.getMonth() + 1;
            var dd = lastday.getDate();
            if (dd < 10)
                dd = '0' + dd;
            if (mm < 10)
                mm = '0' + mm;
            var f_final = yyyy + '-' + mm + '-' + dd;

            self.setEvents(f_inicial, f_final);
        },
        setEvents: function setEvents(fecha_inicia, fecha_final) {
            var self = this;

            var d = self.getRecord();
            console.log("ddddddddddddddddddd", d);

            if (!self.validate()) {
                return false;
            }

            console.log("self.datesConsulta", self.datesConsulta);
            if (typeof self.datesConsulta[fecha_inicia] !== "undefined" && typeof self.datesConsulta[fecha_final] !== "undefined") {
                if (!qxnw.utils.evalueData(d.conductor)) {
//                    return false;
                }
            }

            self.datesConsulta[fecha_inicia] = fecha_inicia;
            self.datesConsulta[fecha_final] = fecha_final;


            var hoy = qxnw.utils.getActualDate();
            var data = {};
            data.conductor = d.conductor;
            data.fecha_inicial = fecha_inicia;
            data.fecha_final = fecha_final;
            data.empresa_o_flota = main.empresa_o_flota;
            data.permisos = main.permisos_usuario;
            console.log("dataaaaaaaaaaaaaaaa", data);
            var rpc = new qxnw.rpc(self.getRpcUrl(), "calendar");
            rpc.setAsync(true);

            qxnw.utils.loadingnw("Consultando... Por favor espere...", "cargando_axtest");

            var func = function (r) {
                console.log("setEvents:::r", r);

                qxnw.utils.loadingnw_remove("cargando_axtest");

//                self.calendar.removeAllEvents();

                for (var i = 0; i < r.length; i++) {
                    var id = r[i].id;

                    var ele = self.calendar.getEventById(id);
                    console.log("ele", ele);
                    console.log("typeof ele", typeof ele);
                    if (ele != null) {
                        continue;
                    }

                    var startDate = r[i].fecha + 'T' + r[i].hora;
                    var color = '#2C3E50';
                    var display = "normal";
//                    if (startDate < hoy) {
////                        display = "background";
//                        color = "#c9c9c9";
//                    }
//                    if (r[i].estado == "SIN_ATENDER") {
//                        color = '#000'; //negro
//                    } else
//                    if (r[i].estado == "SOLICITUD") {
//                        color = '#257e4a'; //negro
//                    } else
//                    if (r[i].estado == "EN_RUTA") {
//                        color = '#1561e0'; //azul
//                    } else
//                    if (r[i].estado == "EN_SITIO") {
//                        color = '#FEF171'; //amarillo
//                    } else
//                    if (r[i].estado == "ABORDO") {
//                        color = '#FA8F44'; //amarillo
//                    } else
//                    if (r[i].estado == "LLEGADA_DESTINO") {
//                        color = 'green';
//                    } else
//                    if (r[i].estado == "CANCELADO_POR_USUARIO" || r[i].estado == "CANCELADO_POR_CONDUCTOR" || r[i].estado == "CANCELADO_POR_ADMIN") {
//                        color = 'red';
//                    }

//                    if (qxnw.utils.evalueData(r[i].estado)) {
                    color = self.getColor()[r[i].estado];
//                    }

                    var title = "";
                    title += "Origen: " + r[i].origen;
                    title += " ::: Destino: " + r[i].destino;
                    title += " ::: Fecha del servicio: " + startDate;
                    if (qxnw.utils.evalueData(r[i].conductor)) {
                        title += " ::: Conductor: " + r[i].conductor;
                    }
                    if (qxnw.utils.evalueData(r[i].conductor_usuario)) {
                        title += " ::: Conductor usuario: " + r[i].conductor_usuario;
                    }
                    if (qxnw.utils.evalueData(r[i].conductor_celular)) {
                        title += " ::: Conductor celular: " + r[i].conductor_celular;
                    }
                    if (qxnw.utils.evalueData(r[i].placa)) {
                        title += " ::: Placa: " + r[i].placa;
                    }
                    if (qxnw.utils.evalueData(r[i].cliente_nombre)) {
                        title += " ::: Cliente: " + r[i].cliente_nombre + " (" + r[i].usuario + ")";
                    }
                    if (qxnw.utils.evalueData(r[i].observaciones_servicio)) {
                        title += " ::: Observaciones: " + r[i].observaciones_servicio;
                    }
                    title += " ::: Estado: " + r[i].estado;
                    title += " ::: ID (" + id + ")";

                    self.calendar.addEvent({
                        id: id,
                        title: title,
                        start: startDate,
//                        end: startDate,
                        overlap: true,
//                            end: '2020-09-11T16:00:00',
//                            groupId: 'availableForMeeting',
//                        constraint: 'businessHours',
                        color: color,
                        display: display
                    });
                }

                self.createFirstTime = true;

                self.activarTooltip();
            };
            rpc.exec("consulta", data, func);
        }
    }
});