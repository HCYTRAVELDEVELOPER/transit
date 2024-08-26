<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <link rel="stylesheet" type="text/css" href="/nwlib/modulos/nw_tareas/src/plugins/css/css.css" />
        <link rel="stylesheet" type="text/css" href="/nwlib/modulos/nw_tareas/src/plugins/week/css.css" />
        <?php
        if (session_id() == "") {
            session_start();
        }
        if (!isset($_SESSION["usuario"])) {
            echo "Sesión Inválida. Inicie sesión..";
            return;
        }
        require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

        function week($star, $end) {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $style = "";
            $where = " usuario_asignado=:usuario";
//            $where .= " and fecha_final between :fecha_inicial and :fecha_final";
            $where .= " and fecha_final=:fecha_inicial";
            $ca->prepareSelect("tareas_diarias", "*,func_concepto(estado, 'estados_tareas_diarias', 'color') as color", $where . "  order by estado asc limit 5");
            $ca->bindValue(":usuario", $_SESSION["id"]);
            $ca->bindValue(":fecha_inicial", $star);
            $ca->bindValue(":fecha_final", $end);
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
                return;
            }
            if ($ca->size() == 0) {
                echo "<div class='box_task_day'>";
                echo "No tienes tareas";
                echo "</div>";
                return;
            }
            for ($i = 0; $i < $ca->size(); $i++) {
                $ca->next();
                $r = $ca->assoc();
                if ($r["color"] == "green") {
                    $style = "hecho";
                }
                echo "<div class='box_task_day'>";
                echo "<p style='color: " . $r["color"] . ";' class='pp $style'>" . strip_tags($r["tarea"]) . "</p>";
                echo "</div>";
            }
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
        <?php
        $clase = "";
        echo "<div class='contenedorPopUpTask'>";
        echo "<div class='box_task_opoup' style='width: 100%;'>";
        week_bounds(date("Y-m-d"), $start, $end);
        $ultimoDia = getUltimoDiaMes(date("Y"), date("m"));
        $numeroSemana = date("W");
        echo "<h1 class='h1_title'>Semana N° $numeroSemana. Tareas del " . $start . " al " . $end . "</h1>";
        $dExplode = explode("-", $start);
        $dExplodeEnd = explode("-", $end);
        for ($i = 0; $i < 7; $i++) {
            $today = $dExplode[2] + $i;
            $fechaDay = $dExplode[0] . "-" . $dExplode[1] . "-" . $today;
            if ($today > $ultimoDia) {
                $today = $i - $dExplodeEnd[2];
                $fechaDay = $dExplodeEnd[0] . "-" . $dExplodeEnd[1] . "-" . $today;
            }
            if ($fechaDay == date("Y-m-d")) {
                $clase = "hoyhoy";
            } else {
                $clase = "";
            }
            echo "<div class='box_day_week $clase'>";
            echo "<h3>" . $fechaDay . "</h3>";
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
