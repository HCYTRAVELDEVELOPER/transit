<?php
$body = Array();
foreach ($rb as $v) {
    $body[] = $v;
}
?>
<html>
    <head>
        <script type="text/javascript" src="https://www.google.com/jsapi"></script>
        <script type="text/javascript">
            google.load("visualization", "1", {packages: ["corechart"]});
            google.setOnLoadCallback(drawChart);
            function drawChart() {
                var titles = <?php echo json_encode($titles); ?>;
                var body = <?php echo json_encode($body); ?>;
                for (var i = 0; i < body.length; i++) {
                    body[i] = parseInt(body[i]);
                }
                var concat = [];
                concat.push(titles);
                titles.unshift("count");
                body.unshift("");
                concat.push(body);

                var data = google.visualization.arrayToDataTable(concat);

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