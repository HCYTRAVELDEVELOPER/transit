<?php
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
date_default_timezone_set(@date_default_timezone_get());
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
?>
<link rel="stylesheet" type="text/css" href="/nwlib<?php echo master::getNwlibVersion() ?>/modulos/nw_tareas/src/plugins/css/css.css" />
<link rel="stylesheet" type="text/css" href="/nwlib<?php echo master::getNwlibVersion() ?>/modulos/nw_tareas/src/plugins/week/css.css" />
<link rel="stylesheet" type="text/css" href="/nwlib<?php echo master::getNwlibVersion() ?>/modulos/nw_tareas/src/plugins/week/css_week_by_user.css" />
<?php

function week($star, $end) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $cb = new NWDbQuery($db);
    $cc = new NWDbQuery($db);
    $ca->prepareSelect("usuarios", "id,usuario", "estado='activo'", "id");
    if (!$ca->exec()) {
        echo $ca->lastErrorText();
    }
    echo "<div >";
    echo "<table>";
    echo "<tr>";


    echo "<td>";
    echo "<table>";
    $hour = 7;
    $media = "00";
    for ($ib = 0; $ib <= 25; $ib++) {
        echo "<tr>";
        echo "<td>";
        if ($ib == 0) {
            echo "<div style='height: 20px'>";
            echo "<p>" . "" . "</p>";
            echo "</div>";
        } else {
            echo "<div class='div_hour' style='height: 20px'>";
            echo "<p>" . $hour . ":" . $media . "</p>";
            echo "</div>";
            if ($media == "30") {
                if ($hour == 12 && $media == "30") {
                    $hour = 1;
                } else {
                    $hour++;
                }
                $media = "00";
            } else {
                $media = "30";
            }
        }
        echo "</td>";
        echo "</tr>";
    }
    echo "</td>";
    echo "</table>";

    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        $sql = "select count(*) as total from tareas_diarias where publico='NO' and usuario_asignado=:usuario and fecha_final=:fecha_inicial group by fecha_final";
        $cc->prepare($sql);
        $cc->bindValue(":usuario", $r["id"]);
        $cc->bindValue(":fecha_inicial", $star);
        if (!$cc->exec()) {
            echo $cc->lastErrorText();
            continue;
        }
        $no_publicas = 0;
        if ($cc->size() > 0) {
            $cc->next();
            $no_publicas = $cc->assoc();
        }
        echo "<td>";
        echo "<table style='width: 55px'>";

        echo "<tr>";
        echo "<td>";
        echo "<div style='height: 20px'>";
        $add = "";
        if ($no_publicas["total"] > 0) {
            $add = "<b>PRIV: " . $no_publicas["total"] . "</b>";
        }
        echo "<p style='text-transform: capitalize!important;'>" . $r["usuario"] . " " . $add . "</p>";
        echo "</div>";
        echo "</td>";
        echo "</tr>";

        $cb->prepareSelect("tareas_diarias", "*,
                                                   func_concepto(estado, 'estados_tareas_diarias', 'color') as color, 
                                                   func_concepto(estado, 'estados_tareas_diarias') as estado_nom, 
                                                   func_concepto(proyecto, 'projectplan_enc') as proyecto_nom", "publico='SI' and usuario_asignado=:usuario and fecha_final=:fecha_inicial", "fecha_final, hora_final asc");
        $cb->bindValue(":usuario", $r["id"]);
        $cb->bindValue(":fecha_inicial", $star);
        if (!$cb->exec()) {
            echo $cb->lastErrorText();
            continue;
        }
        $data = $cb->assocAll();

        $hour = 7;
        $media = "00";
        $hours = 24;
        for ($ib = 0; $ib <= $hours; $ib++) {

            if ($hour < 10) {
                $hour = "0" . (int) $hour;
            }

            $hora = $hour . ":" . $media;

            $formed_cell = Array();

            $formed_cell[0] = "<tr>";
            $formed_cell[1] = "<td>";

            $style = "";

            $inserted = false;
            for ($iz = 0; $iz < count($data); $iz++) {
                $ra = $data[$iz];
                if ($ra["color"] == "green") {
                    $style = "hecho";
                }

                $color = NWUtils::createRandomColor(); // DEPUTED $ra["color"]

                if ($hora == substr($ra["hora_final"], 0, -3)) {
                    $exploded_time = explode(":", $ra["hora_estimada"]);
                    $project = "";
                    if ($ra["proyecto"] != "" && $ra["proyecto"] != 0) {
                        $project = "<h3 style='text-transform: capitalize!important;'>" . strip_tags($ra["proyecto_nom"]) . "</h3>";
                    }
                    $tooltil = "<div class='tooltil' style='text-transform: none;'> $project " . "<font style='color: green'>Creador: " . $ra["usuario"] . "</font><br />" . strip_tags($ra["observaciones"]) . "<br /><b>Estado: " . $ra["estado_nom"] . "</b></div>";
                    $formed_cell[2] = "<div class='div_proyecto' style='height: 20px;' ><p style='color: " . $color . " !important;text-transform: none;'>Proyecto</p> $tooltil </div>";

                    for ($izz = 0; $izz < (int) $exploded_time[0] + (int) $exploded_time[0] - 1; $izz++) {
                        $formed_cell[2] = $formed_cell[2] . "<div class='div_proyecto' style='height: 20px'><p style='color: " . $color . "!important; text-transform: none;'>Proyecto</p> $tooltil </div>";
                        $ib++;
                        if ($media == "30") {
                            $hour++;
                            $media = "00";
                        } else {
                            $media = "30";
                        }
                    }
                    // TEST MANAGE 30 MIN
                    if (isset($exploded_time[1]) && $exploded_time[1] != "00" && $exploded_time[0] != 0) {
                        $formed_cell[2] = $formed_cell[2] . "<div class='div_proyecto' style='height: 20px'><p style='color: " . $color . "!important; text-transform: none;'>Proyecto</p> $tooltil </div>";
                        $ib++;
                        if ($media == "30") {
                            $hour++;
                            $media = "00";
                        } else {
                            $media = "30";
                        }
                    }
                    $inserted = true;
                    break;
                } else {
                    $inserted = false;
                }
            }

            if (!$inserted) {
                $formed_cell[2] = "<div class='div_libre' style='height: 20px;'><p style='text-transform: none;'>" .
                        "<a href=\"javascript: parent.parent.nwadmin3.main.slotNuevaTarea('" . $star . "', '" . $r["id"] . "', '" . $hora . "', this);\">Libre</a></p></div>";
            }

            if ($media == "30") {
                $hour++;
                $media = "00";
            } else {
                $media = "30";
            }

            $formed_cell[3] = "</td>";
            $formed_cell[4] = "</tr>";
            echo implode("", $formed_cell);
        }
        echo "</table>";
        echo "</td>";
    }
    echo "</tr>";
    echo "</table>";
    echo "</div>";
    return;
}

function week_bounds($date, &$start, &$end) {
    $date = strtotime($date);
    // Encuentra el inicio de la semana, trabajando hacia atrás
    $start = $date;
    while (date('w', $start) > 1) {
        $start -= 86400; // One day
    }
    // Fin de la semana es más que 6 días desde el inicio
    $end = date('Y-m-d', $start + ( 6 * 86400 ));
    $start = date('Y-m-d', $start);
}

function getUltimoDiaMes($elAnio, $elMes) {
    return date("d", (mktime(0, 0, 0, $elMes + 1, 1, $elAnio) - 1));
}
?>
</head>
<body>
    <a href="<?php echo $_SERVER["PHP_SELF"]; ?>">Actualizar</a>
    <?php
    $clase = "";
    echo "<div class='contenedorPopUpTask'>";
    echo "<div class='box_task_opoup' style='width: 100%;'>";
    week_bounds(date("Y-m-d"), $start, $end);
    $numeroSemana = date("W");
    echo "<h1 class='h1_title'>Semana N° $numeroSemana. Tareas del " . $start . " al " . $end . "</h1>";
    $dExplode = explode("-", $start);
    $dExplodeEnd = explode("-", $end);
    $countOtherMonth = 1;
    for ($i = 0; $i < 7; $i++) {
        $today = $dExplode[2] + $i;
        if (strlen($today) == 1) {
            $today = "0" . $today;
        }
        $fechaDay = $dExplode[0] . "-" . $dExplode[1] . "-" . $today;
        $ultimoDia = getUltimoDiaMes(date("Y"), $dExplode[1]);
        if ($today > $ultimoDia) {
            //$today = $i - $dExplodeEnd[2];
            $today = $countOtherMonth;
            if (strlen($today) == 1) {
                $today = "0" . $today;
            }
            $fechaDay = $dExplodeEnd[0] . "-" . $dExplodeEnd[1] . "-" . $today;
            $countOtherMonth++;
        }
        if ($fechaDay == date("Y-m-d")) {
            $clase = "hoyhoy";
        } else {
            $clase = "";
        }
        echo "<div class='box_day_week $clase'>";
        echo "<h3>" . master::diaSemana(date("N", strtotime($fechaDay))) . "::" . $fechaDay . "</h3>";
        echo "<div class='box_day_weekInt'>";
        week($fechaDay, 0);
        echo "</div>";
        echo "</div>";
    }
    echo "</div>";
    echo "</div>";
    ?>
</body>
</html>
