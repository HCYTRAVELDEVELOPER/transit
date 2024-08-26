<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
global $id;
global $user;
global $fecha_inicial;
global $fecha_final;
global $asignado;
$id = 0;
$user = 0;
$fecha_inicial = 0;
$fecha_final = 0;
$asignado = "";
if (isset($_POST["project"])) {
    $id = $_POST["project"];
}
if (isset($_GET["project"])) {
    $id = $_GET["project"];
}
if (isset($_POST["user"])) {
    $user = $_POST["user"];
}
if (isset($_GET["user"])) {
    $user = $_GET["user"];
}
if (isset($_POST["fecha_inicial"])) {
    $fecha_inicial = $_POST["fecha_inicial"];
}
if (isset($_GET["fecha_inicial"])) {
    $fecha_inicial = $_GET["fecha_inicial"];
}
if (isset($_POST["fecha_final"])) {
    $fecha_final = $_POST["fecha_final"];
}
if (isset($_GET["fecha_final"])) {
    $fecha_final = $_GET["fecha_final"];
}
if (isset($_POST["asignado"])) {
    $asignado = $_POST["asignado"];
}
if (isset($_GET["asignado"])) {
    $asignado = $_GET["asignado"];
}

function userEnc($p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $user;
//    $where = "1=1";
    if($p != 0) {
        $user = $p;
    }
    $ca->prepareSelect("usuarios", "*", "id=:id");
    $ca->bindValue(":id", $user);
    if (!$ca->exec()) {
        echo "error 43" . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if($total == 0) {
//        echo "No existe el usuario";
        return;
    }
    $ca->next();
    $r = $ca->assoc();
//    return $r["nombre"];
    return $r["usuario"];
}

function userReporteTareasByUser($id, $user) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $fecha_inicial;
    global $fecha_final;
    global $asignado;
    $usuarioMismo = "";
    $where = "b.empresa=:empresa and b.terminal=:terminal ";
    if ($id != 0) {
        $where .= " and a.proyecto=:project";
    }
    if ($user != 0) {
        $where .= " and a.usuario_asignado=:usuario and b.estado='activo' and cliente=0";
    }
    if (isset($fecha_inicial) && isset($fecha_final)) {
        $where .= " and a.fecha_final between :fecha_inicial and :fecha_final";
    }
    if($asignado == "elmismo") {
        $usuarioMismo = userEnc($user);
        $where .= " and a.usuario=:usuario_mismo";
    }
    if($asignado == "otrosinel") {
        $usuarioMismo = userEnc($user);
        $where .= " and a.usuario<>:usuario_mismo";
    }
    $ca->prepareSelect("tareas_diarias a left join usuarios b on (a.usuario_asignado=b.id)", "a.usuario_asignado,a.estado,a.fecha_cierre,a.fecha_final,b.usuario, b.nombre", $where);
    $ca->bindValue(":project", $id);
    $ca->bindValue(":usuario", $user);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    $ca->bindValue(":fecha_inicial", $fecha_inicial);
    $ca->bindValue(":fecha_final", $fecha_final);
    $ca->bindValue(":usuario_mismo", $usuarioMismo);
    if (!$ca->exec()) {
        echo "error 75" . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        return;
    }
    $finalizadas = 0;
    $pendientes = 0;
    $sinejecucion = 0;
    $finalizadas_tarde = 0;
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        $fechaCierre = explode(" ", $r["fecha_cierre"]);
        if ($r["estado"] == 3) {
            $finalizadas += 1;
        }
        if ($r["estado"] == 2) {
            $pendientes += 1;
        }
        if ($r["estado"] == 1) {
            $sinejecucion += 1;
        }
        if ($r["estado"] == 3 && $fechaCierre[0] > $r["fecha_final"]) {
            $finalizadas_tarde += 1;
        }
    }
    echo "<div id='$finalizadas' class='sortat'>";
    echo "<p><b>" . $r["nombre"] . "</b><br />Total tareas: $total </p>";
    echo " <p>Total finalizadas:" . $finalizadas . "</p>";
    echo "<p>Total pendientes:" . $pendientes . "</p>";
    echo "<p>Total sin ejecutar:" . $sinejecucion . "</p>";
    echo "<p>Total finalizadas tarde:" . $finalizadas_tarde . "</p>";
    echo "</div>";
}

function userReporteTareas($id, $user) {
    if ($user != 0) {
        userReporteTareasByUser($id, $user);
        return;
    }
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = "1=1 ";
    if ($id != 0) {
        $where .= " and proyecto=:project";
    }
    $ca->prepareSelect("tareas_diarias", "usuario_asignado,estado,fecha_cierre, fecha_final", $where . " order by usuario_asignado asc");
    $ca->bindValue(":project", $id);
    $ca->bindValue(":usuario", $user);
    if (!$ca->exec()) {
        echo "error 123";
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "Upps, no tiene tareas";
        return;
    }
    $usuario = "";
    $usuario_ = "";
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($usuario_ != $r["usuario_asignado"]) {
            $usuario .= "&";
        }
        $usuario_ = $r["usuario_asignado"];
        $usuario .= $usuario_ . "/";
    }
    $usuario_explode = explode("&", $usuario);
    $totalUsuarios = count($usuario_explode);
    for ($ii = 1; $ii < $totalUsuarios; $ii++) {
        $usuario_id = explode("/", $usuario_explode[$ii]);
        $usuario_final = $usuario_id[0];
        if ($usuario_final != "") {
            userReporteTareasByUser($id, $usuario_final);
        }
    }
}

function endingTask($p, $type) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
    global $user;
    $where = "";
    if ($type != "") {
        $where .= " and tipo=:type ";
    }
    if ($p != "") {
        if ($p == 3 && $type == "adicional") {
            $where .= " and estado='3' or proyecto=:project and etapa IS NULL and estado='13'";
        } else
        if ($p == 2) {
            $where .= " and estado<>3 and estado<>13  and estado<>8  and estado<>10  and estado<>1  ";
        } else {
            $where .= " and estado=:been ";
        }
    }
    $where .= " and usuario_asignado=:usuario";
    $ca->prepareSelect("tareas_diarias", "id", "proyecto=:project and etapa IS NULL $where ");
    $ca->bindValue(":project", $id);
    $ca->bindValue(":usuario", $user);
    $ca->bindValue(":been", $p);
    $ca->bindValue(":type", $type);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    return $ca->size();
}

function stadistics_times($p, $type) {
    global $id;
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = "";
    if ($type != "") {
        $where .= " and tipo=:type ";
    }
    if ($p == 1) {
        $where .= "and fecha_cierre::date<=fecha_final";
    }
    if ($p == 2) {
        $where .= "and fecha_cierre::date>fecha_final";
    }
    $where .= " and estado='3' and estado='13'";
    $ca->prepareSelect("tareas_diarias", "*", "proyecto=:proyecto $where");
    $ca->bindValue(":proyecto", $id);
    $ca->bindValue(":type", $type);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    return $ca->size();
}

function stadistics_chart($type) {
    $id_div = rand(100, 200);
    ?>
    <script type="text/javascript">
        google.load("visualization", "1", {packages: ["corechart"]});
    //        google.setOnLoadCallback(drawChart);
        google.setOnLoadCallback(drawVisualization);
        function drawVisualization() {
            var data = google.visualization.arrayToDataTable([
                ['Tiempo', 'On Time', 'Delay'],
                ['Tareas', <?php echo stadistics_times(1, $type); ?>, <?php echo stadistics_times(2, $type); ?>]
            ]);

            var options = {
                title: 'Tasks completed (<?php echo $type; ?>), Comparison of times of delivery.',
                vAxis: {title: "Tareas"},
                hAxis: {title: "Tipo"},
                seriesType: "bars",
                series: {5: {type: "line"}}
            };

            var chart = new google.visualization.ColumnChart(document.getElementById('chart_div<?php echo $id_div; ?>'));
            chart.draw(data, options);
        }
    </script>
    <div class="boxStadistic" id="chart_div<?php echo $id_div; ?>" style="width: 50%; height: 400px;"></div>
    <?php
}

function stadistics() {
    global $id;
    global $user;
    $task = "tarea";
    $aditional = "adicional";
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("tareas_diarias", "*", "usuario_asignado=:usuario and proyecto=:proyecto");
    $ca->bindValue(":proyecto", $id);
    $ca->bindValue(":usuario", $user);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "<tr><td colspan='10'><h3>Total registros: " . $ca->size() . " No se han encontrado registros.</h3></td></tr>";
        return;
    }
    ?>
    <script type="text/javascript" src="/nwlib/modulos/projectplan/js/jsapi"></script>
    <script type="text/javascript">
        google.load("visualization", "1", {packages: ["corechart"]});
        google.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Tipo', 'Porcentaje'],
                ['<?php echo endingTask(3, "$task"); ?> Completed', <?php echo endingTask(3, "$task"); ?>],
                ['<?php echo endingTask(2, "$task"); ?> In process', <?php echo endingTask(2, "$task"); ?>],
                ['<?php echo endingTask(1, "$task"); ?> Pending', <?php echo endingTask(1, "$task"); ?>]
            ]);
            var options = {
                title: 'Tareas fuera de tiempo, total: <?php echo endingTask("", "$task"); ?>'
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart'));
            chart.draw(data, options);
        }
    </script>
    <script type="text/javascript">
        google.load("visualization", "1", {packages: ["corechart"]});
        google.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Tipo', 'Porcentaje'],
                ['<?php echo endingTask(3, "$aditional"); ?> Completed', <?php echo endingTask(3, "$aditional"); ?>],
                ['<?php echo endingTask(2, "$aditional"); ?> In process', <?php echo endingTask(2, "$aditional"); ?>],
                ['<?php echo endingTask(1, "$aditional"); ?> Pending', <?php echo endingTask(1, "$aditional"); ?>]
            ]);
            var options = {
                title: 'Tareas Adicionales, total: <?php echo endingTask("", "$aditional"); ?>'
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechartTwo'));
            chart.draw(data, options);
        }
    </script>
    <div class="boxStadistic" id="piechart" style="width: 50%; height: 400px;"></div>
    <div class="boxStadistic" id="piechartTwo" style="width: 50%; height: 400px;"></div>
    <?php
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
            body {
                position: relative;
                margin: 0;
                padding: 0;
                font-family: arial;
                font-size: 12px;
            }
            #contain {

            }
            .sortat{
                position: relative;
                border-bottom: 1px solid #DBDBDB;
                background: #F5F5F5;
                margin: 5px 0;
                padding: 15px;
            }
            .sortat p{
                margin: 0;
                padding: 0;
            }
        </style>
          <script src="js/jquery.min.js" type="text/javascript"></script>
            <script src="js/tinysort.js"></script>
            <script src="js/jquery.tinysort.js"></script>
            <script src="js/tinysort.charorder.js"></script>
            <script>
            $(document).ready(function() {
                $(".sortat").tsort({attr: "id", order: 'desc'});
            });
            </script>
    </head>
    <body>
        <div id="contenedor">
            <?php
            if ($user != 0) {
                userEnc(0);
            }
            echo "<br />";
//            userReporteTareas(0, 0);
//            userReporteTareas($id, 0);
            echo "<div id='contain'>";
            userReporteTareas($id, $user);
            echo "</div>";
//            stadistics();
//            stadistics_chart("tarea");
//            stadistics_chart("adicional");
            ?>
        </div>
    </body>
</html>
