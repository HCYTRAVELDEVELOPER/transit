<?php
$title = $_GET["title"];
$cols = $_GET["cols"];
$hAxisTitle = $_GET["hAxisTitle"];
$vAxisTitle = $_GET["vAxisTitle"];

$cols = explode(",", $cols);
$c = "";
for ($i = 0; $i < count($cols); $i++) {
    $c .= "'" . $cols[$i] . "',";
}
$vals = explode("||", $_GET["values"]);
$v = "";
for ($t = 0; $t < count($vals); $t++) {
    if ($t == 0) {
        continue;
    }
    $d = $vals[$t];
    $o = explode(",", $d);
    $v1 = explode(":", $o[0]);
    $v2 = explode(":", $o[1]);
    $v .= "['{$v1[1]}', {$v2[1]}],";
}
?>
<html>
    <head>
        <style>
            body {
                position: relative;
                margin: 0;
                font-size: 12px;
                font-family: arial;
            }
        </style>
        <script type="text/javascript" src="/nwlib6/includes/google_api_informes/jsapi"></script>
        <script type="text/javascript">
            google.load("visualization", "1", {packages: ["corechart"]});
            google.setOnLoadCallback(drawChart);
            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    [<?php echo $c; ?>],
<?php echo $v; ?>
                ]);
                var options = {
                    width: "100%",
                    height: 400,
//                    colors: ['red', 'blue', '#ec8f6e', '#f3b49f', '#f6c7b6'],
                    title: '<?php echo $title; ?>',
                    hAxis: {title: '<?php echo $hAxisTitle; ?>', titleTextStyle: {color: '#000'}},
                    vAxis: {title: '<?php echo $vAxisTitle; ?>', titleTextStyle: {color: '#000'}}
                };
//ColumnChart
//LineChart
//PieChart
                var chart = new google.visualization.ColumnChart(document.querySelector('.chart_div'));
                chart.draw(data, options);
            }
        </script>
    </head>
    <body>
        <div id="chart_div" class="chart_div" style="width: 100%; height: 400px;"></div>
    </body>
</html>