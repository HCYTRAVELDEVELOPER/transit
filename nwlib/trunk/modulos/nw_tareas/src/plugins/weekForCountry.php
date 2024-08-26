<?php
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
if ($_SESSION["pais"] == "") {
    return;
}
if ($_SESSION["pais"] == 0) {
    return;
}
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <link rel="stylesheet" type="text/css" href="/nwlib6/modulos/nw_tareas/src/plugins/css/css.css" />
        <link rel="stylesheet" type="text/css" href="/nwlib6/modulos/nw_tareas/src/plugins/week/css.css" />
        <?php
        require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

        function pais() {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect("paises", "*", "id=:pais");
            $ca->bindValue(":pais", $_SESSION["pais"]);
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
                return;
            }
            if ($ca->size() == 0) {

                return;
            }
            $ca->next();
            $r = $ca->assoc();
            echo $r["nombre"];
        }

        function week($day) {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $style = "";
            $where = " pais=:pais";
//            $where .= " and fecha_final between :fecha_inicial and :fecha_final"; 
            $where .= " and fecha_final=:fecha";
            $ca->prepareSelect("tareas_diarias", "*,
                                                  func_concepto(estado, 'estados_tareas_diarias', 'color') as color,
                                                  func_concepto(pais, 'paises') as pais_text
                                                   ", $where . "  order by estado asc");
            $ca->bindValue(":usuario", $_SESSION["id"]);
            $ca->bindValue(":fecha", $day);
            $ca->bindValue(":pais", $_SESSION["pais"]);
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
        $mesInitial = 0;
        $contador = 0;
        echo "<div class='contenedorPopUpTask'>";
        echo "<div class='box_task_opoup' style='width: 100%;'>";
        week_bounds(date("Y-m-d"), $start, $end);
        $ultimoDia = getUltimoDiaMes(date("Y"), date("m"));
        $numeroSemana = date("W");
        echo "<h1 class='h1_title'>Semana N° $numeroSemana. Tareas del " . $start . " al " . $end . " Del país ";
        pais();
        echo "</h1>";
        $dExplode = explode("-", $start);
        $dExplodeEnd = explode("-", $end);
        for ($i = 0; $i < 7; $i++) {
            $contador = 0;
            $today = $dExplode[2] + $i;
            $fechaDay = "";
            if ($today >= $ultimoDia) {
                $mesInitial++;
                $separar = 1;
                $numero = 12;
                $cadena = (string) $numero;
                $long = strlen($cadena);
                for ($iiii = 0; $iiii < $long; $iiii+= $separar) {
                    ++$contador;
                    if ($contador == 1) {
                        $mesInitial = "0" . $mesInitial;
                    }
                }
                $fechaDay = $dExplodeEnd[0] . "-" . $dExplodeEnd[1] . "-" . $mesInitial;
            } else {
                $fechaDay = $dExplode[0] . "-" . $dExplode[1] . "-" . $today;
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
