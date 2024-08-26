<html>
    <head>
        <script type="text/javascript" src="https://www.google.com/jsapi"></script>
        <script type="text/javascript">
            google.load("visualization", "1", {packages: ["corechart"]});
            google.setOnLoadCallback(drawChart);
            function drawChart() {
                var titles = <?php echo json_encode($titles); ?>;
                var data = new Array();
                data = [
                    [0, 0],
<?
$count = 0;
foreach ($rb as $key => $v) {
    ?>
                        [titles[<?php echo $count; ?>], <?php echo $v; ?>],
    <?
    $count++;
}
?>
                ];
                var data = google.visualization.arrayToDataTable(data);
                var options = {
                    title: '<?php echo $r["nombre"]; ?>'
                };

                var chart = null;
                var type = <?php echo $r["tipo"]; ?>;
                if (type == 1) {
                    chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
                } else if (type == 2) {
                    chart = new google.visualization.PieChart(document.getElementById('chart_div'));
                }
                chart.draw(data, options);
            }
        </script>
    </head>
    <body>
        <div id="chart_div" style="width: <?php echo $r["ancho"]; ?>px; height: <?php echo $r["alto"]; ?>px;"></div>
        <div id="footer" class="footer" style="float: left;">
            <strong>
                <?php
                for ($i = 0; $i < count($filters); $i++) {
                    echo $filters[$i]["label"] . ": " . $_GET[$filters[$i]["nombre"]];
                    echo "<br />";
                }
                ?>
            </strong>
        </div>
    </body>
</html>