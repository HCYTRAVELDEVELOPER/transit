<!DOCTYPE html>
<html>
    <head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <link rel="stylesheet" type="text/css" href="/nwlib/modulos/nw_tareas/src/plugins/css/css.css" />

        <?php
        if (session_id() == "") {
            session_start();
        }
        if (!isset($_SESSION["usuario"])) {
            echo "Sesión Inválida. Inicie sesión..";
            return;
        }
        require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

        function ultimeTask() {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $where = " usuario_asignado=:usuario order by fecha asc limit 1";

            $ca->prepareSelect("tareas_diarias", "fecha", $where);
            $ca->bindValue(":usuario", $_SESSION["id"]);
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
                return;
            }
            if ($ca->size() == 0) {
                echo "No hay resultados.";
                return;
            }
            $ca->next();
            $r = $ca->assoc();
            global $fecha_primera_task;
            $fecha_primera_task = $r["fecha"];
        }

        function rendimiento() {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $cb = new NWDbQuery($db);
            $cd = new NWDbQuery($db);
            global $fecha_primera_task;
            $where = " usuario_asignado=:usuario";

            $ca->prepareSelect("tareas_diarias", "*", $where . " and fecha_final < :hoy");
            $ca->bindValue(":hoy", date("Y-m-d"));
            $ca->bindValue(":usuario", $_SESSION["id"]);
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
                return;
            }
//            $cb->prepareSelect("tareas_diarias", "*", $where . " and estado=3");
            $cb->prepareSelect("tareas_diarias", "*", $where . " and estado=3 and fecha_final < :hoy");
            $cb->bindValue(":usuario", $_SESSION["id"]);
            $cb->bindValue(":hoy", date("Y-m-d"));
            if (!$cb->exec()) {
                echo $cb->lastErrorText();
                return;
            }
//            $cd->prepareSelect("tareas_diarias", "*", $where . " and estado<>3 and estado<>7 and estado<>4 and estado<>5 and estado<>8 and fecha_final < :hoy");
            $cd->prepareSelect("tareas_diarias", "*", $where . " and estado<>3 and fecha_final < :hoy");
            $cd->bindValue(":hoy", date("Y-m-d"));
            $cd->bindValue(":usuario", $_SESSION["id"]);
            if (!$cd->exec()) {
                echo $cd->lastErrorText();
                return;
            }
            $total = $ca->size();
            $finalizadas = $cb->size();
//    $pendientes = $total - $finalizadas;
            $pendientes = $cd->size();
            echo " Total tareas " . $total;
            echo " Total tareas finalizadas " . $finalizadas;
            echo " Pendientes " . $pendientes;

            $diferencia = $pendientes / $total;
            $competitividad = $diferencia * 100;
            $competivo = 100 - $competitividad;
            $numberCompetitivity = number_format($competivo, 0);
            $bottom = $numberCompetitivity - 100;
//    echo " Competitividad del " . $numberCompetitivity . "% $competivo";
            $background = "";
            $mensaje = "";
            if ($numberCompetitivity <= 0) {
                $background = "red";
                $mensaje = "Muy pero muy mal, estás por debajo de cero! sinvergúenza!";
            }
            if ($numberCompetitivity >= 1 & $numberCompetitivity <= 15) {
                $background = "red";
                $mensaje = "Pésimo desempeño, ponte pilas!";
            }
            if ($numberCompetitivity >= 16 & $numberCompetitivity <= 30) {
                $background = "red";
                $mensaje = "Deficiente! Tienes que mejorar bastante.";
            }
            if ($numberCompetitivity >= 31 & $numberCompetitivity <= 45) {
                $background = "orange";
                $mensaje = "Tienes un rango malo de competitividad, mediocre...";
            }
            if ($numberCompetitivity >= 46 & $numberCompetitivity <= 60) {
                $background = "yellow";
                $mensaje = "Regular! sube tu competitividad.";
            }
            if ($numberCompetitivity >= 61 & $numberCompetitivity <= 75) {
                $background = "yellow";
                $mensaje = "Aceptable, sin embargo debes mejorar.";
            }
            if ($numberCompetitivity >= 76 & $numberCompetitivity <= 90) {
                $background = "green";
                $mensaje = "Muy bien! Tu competitividad es eficiente.";
            }
            if ($numberCompetitivity >= 90 & $numberCompetitivity <= 99) {
                $background = "blue";
                $mensaje = "Excelente! Estás cumpliendo.";
            }
            if ($numberCompetitivity == 100) {
                $background = "orange";
                $mensaje = "Increíble! Eres el empleado perfecto.";
            }
            ?>
            <style>
                .subesube {
                    -webkit-animation: myfirst 5s; /* Chrome, Safari, Opera */
                    animation: myfirst 5s;
                }
                .mensajeBox, .textCompet {
                    -webkit-animation: mensajeBox 5s; /* Chrome, Safari, Opera */
                    animation: mensajeBox 5s;
                }
                /* Chrome, Safari, Opera */
                @-webkit-keyframes myfirst {
                    0% {bottom: -100px;background: red;}
                100% {bottom: <?php echo $bottom; ?>px; background: <?php echo $background; ?>;}
                }
                /* Standard syntax */
                @keyframes myfirst {
                    0% {bottom: -100px;}
                100% {bottom: <?php echo $bottom; ?>px;background: <?php echo $background; ?>;}
                }
                @-webkit-keyframes mensajeBox {
                    0% {opacity: 0;}
                75% {opacity: 0;}
                100% {opacity: 1;}
                }
                /* Standard syntax */
                @keyframes mensajeBox {
                    0% {opacity: 0;}
                75% {opacity: 0;}
                100% {opacity: 1;}
                }
                .subesube {
                    bottom: <?php echo $bottom; ?>px;
                    background: <?php echo $background; ?>;
                }
            </style>
            <?php
            echo "<div class='boxCompetitivity'><h3 class='textCompet'>$numberCompetitivity</h3> <div class='subesube' id='subesube'></div></div><div class='mensajeBox'>$mensaje</div>";

            //defino fecha 1 
            ultimeTask();
            echo "<br />Fecha primera tarea: " . $fecha_primera_task;
            $dateInit = explode("-", $fecha_primera_task);
            $diaInit = explode(" ", $dateInit[2]);
            $ano1 = $dateInit[0];
            $mes1 = $dateInit[1];
            $dia1 = $diaInit[0];
//defino fecha 2 
            $ano2 = date("Y");
            $mes2 = date("m");
            $dia2 = date("d");
//calculo timestam de las dos fechas 
            $timestamp1 = mktime(0, 0, 0, $mes1, $dia1, $ano1);
            $timestamp2 = mktime(0, 0, 0, $mes2, $dia2, $ano2);
            //resto a una fecha la otra 
            $segundos_diferencia = $timestamp2 - $timestamp1;
//convierto segundos en días 
            $dias_diferencia = $segundos_diferencia / (60 * 60 * 24);
            $promedio_tareas = $total / $dias_diferencia;
            echo "<br />Lleva realizando tareas " . $dias_diferencia . " días";
            echo "<br />Promedio de tareas por día: " . number_format($promedio_tareas, 0);
        }

        function module($p, $e) {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $where = " usuario_asignado=:usuario ";
            if ($e == "si") {
                $where .= " and fecha_final=:fecha";
            } else {
                $where .= " and fecha_final>:fecha";
            }
            $where .= " order by fecha desc";
            $ca->prepareSelect("tareas_diarias", "*", $where);
            $ca->bindValue(":usuario", $_SESSION["id"]);
            $ca->bindValue(":fecha", $p);
            $ca->bindValue(":init", date("Y-m-") . "01");
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
                return;
            }
            if ($ca->size() == 0) {
                echo "No hay resultados.";
                return;
            }
            echo "Total:" . $ca->size() . "<br />";
            for ($i = 0; $i < $ca->size(); $i++) {
                $ca->next();
                $r = $ca->assoc();
                echo strip_tags($r["tarea"]) . "<br />";
            }
        }
        ?>
    </head>
    <body>
        <?php
        echo "<div class='contenedorPopUpTask'>";
        echo "<div class='box_task_opoup'>";
        echo "<h1 class='h1_title'>Rendimiento</h1>";
        rendimiento();
        echo "</div>";
        echo "<div class='box_task_opoup'>";
        echo "<h1 class='h1_title'>Tus tareas de hoy</h1>";
        module(date("Y-m-d"), "si");
        echo "</div>";
        echo "<div class='box_task_opoup'>";
        echo "<h1 class='h1_title'>Tareas de ayer</h1>";
        $ayer = date("d") - 1;
        module(date("Y-m-") . $ayer, "si");
        echo "</div>";
        echo "<div class='box_task_opoup'>";
        echo "<h1 class='h1_title'>Tareas de la semana</h1>";
        module(date("Y-m-") . "01", "no");
        echo "</div>";
        echo "</div>";
        ?>
    </body>
</html>
