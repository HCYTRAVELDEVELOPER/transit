<?php
//date_default_timezone_set('UTC');
date_default_timezone_set(@date_default_timezone_get());

function loadMeses() {
    $rta = "";
    $mesActual = str_replace("0", "", date("m"));
    $mesText = array("EN", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC");
    for ($i = 0; $i < 12; $i++) {
        $class = "";
        $class_li = "";
        if ($i + 1 == $mesActual) {
            $class = " class='mes_actual_enc' ";
            $class_li = " class='mes_actual_enc_li' ";
        }
        $rta .= "<li $class_li ><div $class >" . $mesText[$i] . "</div></li>";
    }
    echo "<div class='enc_meses_list'><ul>" . $rta . "</ul></div>";
}

function loadNotifications() {
    session::check();
    $si = session::getInfo();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nw_notifications_det a left join nw_notifications b on (a.notificacion=b.id) ", "b.fecha,b.mensaje, b.enviado_por", "a.usuario=:usuario and b.parte=:parte order by a.fecha desc");
    $ca->bindValue(":parte", "NW_MEETING");
    $ca->bindValue(":usuario", $si["usuario"]);
    if (!$ca->exec()) {
        echo "Error: " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "No tienes notificaciones";
        return;
    }
    $rta = "";
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        $rta .= "<div class='bloque_notification'><p class='date_notification'>Fecha: " . $r["fecha"] . ". </p>" . $r["mensaje"] . "</div>";
    }
    echo $rta;
}

function loadMeetings() {
    session::check();
    $si = session::getInfo();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwreu_enc a left join nwreu_asistentes b on(a.id=b.reunion) ", "a.*", "b.asistente_mail=:usuario and a.cancelada is null and a.archivada is null order by fecha, hora asc");
    $ca->bindValue(":usuario", $si["email"]);
    $ca->bindValue(":cancelada", NULL, true, true);
    if (!$ca->exec()) {
        echo "Error: " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "No hay reuniones programadas";
        return;
    }
    $result = "";
    $totalResultHoy = 0;
    $resultHoy = "";
    $resultHoyTotal = 0;
    $resultHoyOthers = "";
    $resultHoyOthersTotal = 0;
    $resultHoyOthersPass = "";
    $resultHoyOthersPassTotal = 0;
    $resultProximasTotal = 0;
    $resultProximas = "";
    $resultPasadas = "";
    $resultPasadasTotal = 0;
    $diaText = array("LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM");
    $mesText = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        $result = "";
        $css = "";
        $ayer = "";
        $manana = "";
        if ($r["estado"] != 2 && $r["fecha"] < date("Y-m-d")) {
            $css = " style=' background: #FF6B6B; color: #fff; ' ";
        } else
        if ($r["estado"] == 2) {
            $css = " style=' background: #00ABAB; color: #fff; ' ";
        }
        $expl_fecha = explode("-", $r["fecha"]);
        $cuando = "";
        $fex = explode("0", date("d"));
        if ($fex[0] == "") {
            $manana = date("d") + 1;
            $manana = "0$manana";
        } else {
            $manana = date("d") + 1;
        }
        $manana = date("Y-m-") . $manana;
        if ($fex[0] == "") {
            $ayer = date("d") - 1;
            $ayer = "0$ayer";
        } else {
            $ayer = date("d") - 1;
        }
        $ayer = date("Y-m-") . $ayer;
        if ($r["fecha"] == date("Y-m-d")) {
            $cuando = "Hoy";
        }
        $anteayer = "";
        if ($fex[0] == "") {
            $anteayer = date("d") - 2;
            $anteayer = "0$anteayer";
        } else {
            $anteayer = date("d") - 2;
        }
        $anteayer = date("Y-m-") . $anteayer;

        if ($r["fecha"] == date("Y-m-d")) {
            $cuando = "Hoy";
        } else
        if ($r["fecha"] == $manana) {
            $cuando = "Mañana";
        } else
        if ($r["fecha"] == $ayer) {
            $cuando = "Ayer";
        } else
        if ($r["fecha"] == $anteayer) {
            $cuando = "Anteayer";
        }
        $menuf = "";
        if ($r["estado_text"] != "Finalizado") {
            $menuf = "
                             <li class='iniciar_reu_home' data='" . $r["id"] . "' >
                                  <div>Iniciar</div>
                              </li>
                             <li class='editar_reu_home' data='" . $r["id"] . "' >
                                  <div>Editar</div>
                              </li>
                               <li class='buttonArchivarReu' data='" . $r["id"] . "'>
                                 <div>Archivar</div>
                               </li>
                              <li class='cancelar_reu_home' data='" . $r["id"] . "' >
                                  <div>Cancelar</div>
                              </li>
                              ";
        }
        $result = "<div class='div_meeting_list row_" . $r["id"] . " ' >
            <div class='div_meeting_list_inter'  $css >
                <div class='meeting_overlay_list'>
                    <ul>
                        <li class='buttonViewReu' data='" . $r["id"] . "'>
                            <div>Ver</div>
                        </li>
                        $menuf
                    </ul>
                </div>
                <h1 class='title_mee_list'>
                    " . $r["titulo"] . "
                </h1>
                <div class='fecha_mee_list'>
                    <h4>$cuando</h4>
                    <h3>" . $diaText[date('N', strtotime($r["fecha"])) - 1] . " $expl_fecha[2] <p class='mes_anio_reu'>" . $mesText[str_replace("0", "", $expl_fecha[1]) - 1] . " " . $expl_fecha[0] . "</p></h3>
                    <h2>" . $r["hora"] . "</h2>
                </div>
                <div class='l_left'></div>
                <div class='l_right'></div>
                <div class='l_center'></div>
                <div class='otros_mee_list'>
                    <h2>" . $r["estado_text"] . "</h2>
                        <div class='div_place_and_objetive'>
                    <p class='p_place'><strong>Lugar: </strong>" . $r["lugar_text"] . "</p>
                   
                        </div>
                </div>
                 <div class='p_objetive'><strong>Objetivo: </strong>" . $r["objetivo_general"] . "</div>
                 <div class='p_creador'>Creada por " . $r["usuario"] . "</div>
                </div>
                </div>";
        if ($r["fecha"] == date("Y-m-d")) {
            if ($r["estado"] == 2) {
                $resultHoyOthers .= $result;
                $resultHoyOthersTotal++;
            } else
            if ($r["estado"] != 2 && $r["hora"] < date("H:i:s")) {
                $resultHoyOthersPass .= $result;
                $resultHoyOthersPassTotal++;
            } else {
                $resultHoy .= $result;
                $resultHoyTotal++;
            }
            $totalResultHoy++;
        } else
        if ($r["estado"] != 2 && $r["fecha"] > date("Y-m-d")) {
            $resultProximas .= $result;
            $resultProximasTotal++;
        } else
        if ($r["fecha"] < date("Y-m-d")) {
            $resultPasadas .= $result;
            $resultPasadasTotal++;
        } else {
            $resultPasadas .= $result;
            $resultPasadasTotal++;
        }
    }
    ?>
    <script>
        $(document).ready(function() {
            loadTotales(<?php echo $totalResultHoy . "," . $resultProximasTotal . "," . $resultPasadasTotal . "," . $resultHoyTotal . "," . $resultHoyOthersTotal . "," . $resultHoyOthersPassTotal; ?>);
        });
    </script>
    <?php
    echo "<div class='div_reus_home_meses'>";
    loadMeses();
    echo "</div>";

    echo "<div class='div_reus_home_right'>";
    echo "<h1 class='div_reus_home_h1'>Notificaciones</h1>";
    loadNotifications();
    echo "</div>";

    echo "<div class='div_reus_home_left'>";

    echo "<div class='div_reus_home_dashb'>";

    echo "<div class='div_reus_home div_home'>";
    echo "<h1 class='div_reus_home_h1'>Próximas Reuniones de hoy $resultHoyTotal </h1>";
    if ($resultHoy != "") {
        echo $resultHoy;
    } else {
        echo "<h2>No hay más reuniones para hoy.</h2>";
    }
    if ($resultHoyOthers != "") {
        echo "<div class='otrasdehoy'>";
        echo "<h1 class='div_reus_home_h2'>Ejecutadas $resultHoyOthersTotal </h1>";
        echo $resultHoyOthers;
        echo "</div>";
    }
    if ($resultHoyOthersPass != "") {
        echo "<div class='otrasdehoy'>";
        echo "<h1 class='div_reus_home_h2'>No Ejecutadas $resultHoyOthersPassTotal </h1>";
        echo $resultHoyOthersPass;
        echo "</div>";
    }
    echo "</div>";

    echo "<div class='div_reus_home div_proximas'>";
    echo "<h1 class='div_reus_home_h1'>Próximas Reuniones $resultProximasTotal </h1>";
    if ($resultProximas != "") {
        echo $resultProximas;
    } else {
        echo "<h1>No hay próximas reuniones.</h1>";
    }
    echo "</div>";
    echo "</div>";

    echo "<div class='div_historial_reu'>";
    echo "<div class='div_reus_home'>";
    echo "<h1 class='div_reus_home_h1'>Reuniones Anteriores $resultPasadasTotal </h1>";
    echo $resultPasadas;
    echo "</div>";
    echo "</div>";

    echo "</div>";
}

loadMeetings();
?>
