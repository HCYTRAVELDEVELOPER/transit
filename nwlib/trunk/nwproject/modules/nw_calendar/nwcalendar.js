versionCalendarNw = 1;
function nwCalendar() {
    this.constructor = constructor;
    function constructor(div, fechaUsed, version) {
        if (!evalueData(div)) {
            nw_dialog("Error developer!, no envío la clase o id del div a meter el calendario, ej: createCalendar('.estesmidiv', date); date es opcional, le puede enviar la fecha ");
            return;
        }
        if (evalueData(version)) {
            versionCalendarNw = version;
        }
        var fechaactual = getFechaHoy();
        var fechao = traeFechaHoraActual();
        if (evalueData(fechaUsed)) {
            fechao = fechaUsed;
        }
        var fd = dataOfDate(fechao);
//        alert(fd.fecha_dia);
        var dia = fd.fecha_dia;
        var mes = fd.fecha_mes_string;
        var anio = fd.fecha_anio;
        var diaSemana = sacaDiaSemana(01, fd.fecha_mes_text_english, anio);
        var day = 0;
        var diasMes = calendarnw_cant_ds(mes, anio);
        var last_cell = parseInt(diaSemana) + parseInt(diasMes);
        var diahoy = "";
        var diahoytext = "";
        var fechasend = anio + "-" + mes + "-01";

        var enc = "";
        enc += "<span class='contenenccal contenenccal_backnext cal_back' onclick='nextbackcalendar(\"" + div + "\", \"" + fechasend + "\", \"back\");'><i class='material-icons'>navigate_before</i></span> ";
        enc += "<span class='contenenccal cal_dianumber'>1111</span> <span class='contenenccal cal_diatext'>alex</span> <span class='contenenccal cal_aniomes'>" + fd.fecha_mes_text + " " + anio + "</span>";
        enc += "<span class='contenenccal contenenccal_backnext cal_next' onclick='nextbackcalendar(\"" + div + "\", \"" + fechasend + "\", \"next\");'><i class='material-icons'>navigate_next</i></span> ";

        var html = "";
        html += "<div class='containcalendarnw'>";
        if (versionCalendarNw === 2) {
            html += "<div class='containEncCalendar'>";
            html += enc;
            html += "</div>";
        }
        html += "<table id='nwcalendar' class='nwcalendar'>";
        if (versionCalendarNw === 1) {
            html += "<caption>";
            html += enc;
            html += "</caption>";
        }
        html += "<tr> ";
        html += "<th>Lun</th>";
        html += "<th>Mar</th>";
        html += "<th>Mie</th>";
        html += "<th>Jue</th>";
        html += "<th>Vie</th>";
        html += "<th>Sab</th>";
        html += "<th>Dom</th>";
        html += "</tr>";
        html += "<tr>";
        for (var i = 1; i <= 42; i++) {
            if (i == diaSemana) {
                day = 1;
            }
            var dayshow = day;
            if (day.toString().length == 1) {
                day = "0" + day;
            }
            var fecha = anio + "-" + mes + "-" + day;
            var df = dataOfDate(fecha);
            var dWeek = df.fecha_dia_semana;
            var dtext = df.fecha_dia_text;
            var eshoy = "";
            if (i < diaSemana || i >= last_cell) {
                html += "<td class='tdVacia bloqueDate'>&nbsp;</td>";
            } else {
                if (day == dia) {
                    eshoy = "eshoyactive";
                    diahoy = day;
                    diahoytext = dtext;
                }
                var classdate = "cal_date_" + fecha.replace(/-/gi, "");
                var classhab = "cal_dia_habil";
                if (dWeek == "6" || dWeek == "0") {
                    classhab = "cal_dia_inhabil";
                }
                var classpass = "cal_dia_actual";
                if (fecha < fechaactual && eshoy !== "eshoyactive") {
                    classpass = "cal_dia_pasado";
                }
                html += "<td class='contend_day " + eshoy + " " + classhab + " " + classpass + " " + classdate + "' calendar-dia-semana='" + dWeek + "' data-diatext='" + dtext + "' calendar-date='" + fecha + "' >" + dayshow + "</td>";
            }
            day++;
            if (i % 7 == 0) {
                html += "</tr><tr class='week_calendar week_week' week='' calendar-date='" + fecha + "' >\n";
            }
        }
        html += "<tr>";
        html += "</table>";
        html += "</div>";
        html = html.replace("1111", diahoy);
        html = html.replace("alex", diahoytext);
        $(div).append(html);
        $(div).fadeIn(0);

        onloadcalendar(fechasend);

        $(div + " .contend_day").click(function () {
            $(div + " .contend_day").removeClass("eshoyactive");
            $(div + " .contend_day").removeClass("contend_day_selected");
            $(this).addClass("contend_day_selected");
        });
    }
}


function nextbackcalendar(div, date, mode) {
    var fechao = traeFechaHoraActual();
    var fd = dataOfDate(fechao);
    var diaactual = fd.fecha_dia;
    var mesactual = fd.fecha_mes_string;
    var anioactual = fd.fecha_anio;

    var d = date.split("-");
    var dia = "01";
    var anio = d[0];
    var mes = d[1];
    if (mode == "back") {
        if (mes == "01") {
            mes = "12";
            anio--;
        } else {
            mes--;
        }
    } else
    if (mode == "next") {
        if (mes == "12") {
            mes = "01";
            anio++;
        } else {
            mes++;
        }
    }
    if (parseInt(mes) == parseInt(mesactual) && parseInt(anioactual) == parseInt(anio)) {
        dia = diaactual;
    }
    if (dia.toString().length == 1) {
        dia = "0" + dia;
    }
    if (mes.toString().length == 1) {
        mes = "0" + mes;
    }
    var dat = anio + "-" + mes + "-" + dia;
    $(".containcalendarnw").remove();
    $(".nwcalendar").empty();
    getNwCalendar(div, dat, function () {
    }, versionCalendarNw);
}