<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function endingTask($p, $type) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
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
    $ca->prepareSelect("tareas_diarias", "id", "proyecto=:project and etapa IS NULL $where ");
    $ca->bindValue(":project", $id);
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
    $task = "tarea";
    $aditional = "adicional";
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("tareas_diarias", "*", "proyecto=:proyecto");
    $ca->bindValue(":proyecto", $id);
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
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
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
                title: 'Task outside of timetable, total: <?php echo endingTask("", "$task"); ?>'
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
                title: 'Tasks additional, total: <?php echo endingTask("", "$aditional"); ?>'
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechartTwo'));
            chart.draw(data, options);
        }
    </script>


    <div class="boxStadistic" id="piechart" style="width: 50%; height: 400px;"></div>
    <div class="boxStadistic" id="piechartTwo" style="width: 50%; height: 400px;"></div>
    <?php
    if (isset($_GET["nwview"]) == "true") {
        stadistics_chart("tarea");
        stadistics_chart("adicional");
    }
}

stadistics();
?>
