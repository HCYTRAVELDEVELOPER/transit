<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
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
            h1 {
                color: #dd4b39;
                font-size: 18px;
                line-height: 29px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-bottom: 1px solid #e6e6e6;
                text-align: left;
                padding: 10px 15px 15px 15px;
                background: #fff;
                margin: 0;
                font-weight: lighter;
            }
        </style>
        <script type="text/javascript" src="/nwlib6/includes/google_api_informes/jsapi"></script>
        <script type="text/javascript">
            google.load("visualization", "1", {packages: ["corechart"]});
            google.setOnLoadCallback(drawChart);
            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Year', 'Ingresos', 'Egresos'],
                    ['fdsafdsa', 155, 1555]
                ]);
                var options = {
                    title: 'Flujo de caja',
                    hAxis: {title: 'Fechas', titleTextStyle: {color: 'red'}}
                };

//ColumnChart
//LineChart
//PieChart
//                var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
                var chart = new google.visualization.ColumnChart(document.querySelector('.chart_div'));
//                var chart = new google.visualization.ColumnChart($(".chart_div").get(0));
                chart.draw(data, options);
            }
        </script>
    </head>
    <body>

        <h1>
            Pedidos hoy: 30
        </h1>
        <h1>
            Total Ventas: 1.290.000
        </h1>

        <div id="chart_div" class="chart_div" style="width: 100%; height: 400px;"></div>
    </body>
</html>