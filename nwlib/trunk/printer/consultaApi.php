<?php
include_once dirname(__FILE__) . '../../rpc/nwApi.inc.php';

function TraerClientes() {
    $nwApi = new nwApi("https://nwadmin.gruponw.com/rpcsrv/api.inc.php");
    $nwApi->setUser("andresf");
    $nwApi->setPassword("ayahuasca");
    $nwApi->setProfile(1);
    $nwApi->setCompany(1);
    $nwApi->startSession();
    $arr = array();
    if (isset($_GET)) {
        if ($_GET["id"] && $_GET["id"] != "") {
            $arr["campo"] = "id";
            $arr["valor"] = $_GET["id"];
        } else {
            if ($_GET["nit"] && $_GET["nit"] != "") {
                $arr["campo"] = "nit";
                $arr["valor"] = $_GET["nit"];
            } else {
                $arr["campo"] = "id";
                $arr["valor"] = 0;
            }
        }
    }
    $cliente = $nwApi->exec("getCliente", "control_tiquets", $arr);
    return $cliente;
}

function TraerSLA($cliente) {
    $nwApi = new nwApi("https://nwadmin.gruponw.com/rpcsrv/api.inc.php");
    $nwApi->setUser("andresf");
    $nwApi->setPassword("ayahuasca");
    $nwApi->setProfile(1);
    $nwApi->setCompany(1);
    $nwApi->startSession();
    $arr = array();
    $arr["cliente"] = $cliente;
    $sla = $nwApi->exec("getSLA", "control_tiquets", $arr);
    return $sla;
}

function TraerTiquets($cliente) {
    $nwApi = new nwApi("https://nwadmin.gruponw.com/rpcsrv/api.inc.php");
    $nwApi->setUser("andresf");
    $nwApi->setPassword("ayahuasca");
    $nwApi->setProfile(1);
    $nwApi->setCompany(1);
    $nwApi->startSession();
    $arr = array();
    $arr["cliente"] = $cliente;
    $tiquets = $nwApi->exec("getTiquets", "control_tiquets", $arr);
    return $tiquets;
}

$cliente = TraerClientes();
$cliente = $cliente["result"];
$sla = TraerSLA($cliente["id"]);
$sla = $sla["result"];
$tiquets = TraerTiquets($cliente["id"]);
$tiquets = $tiquets["result"];
//print_r($tiquets)
?>
<html >
    <head>
        <!--<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />-->
        <script type = "text/javascript" src = "../charts/Chart.min.js"></script>
        <link rel="stylesheet" type="text/css" href="../charts/style_2.css" />
    </head>
    <body>
        <div style="margin-top: -17px;">
            <img src="https://www.gruponw.com/imagenes/logoNW04_ss.jpg" width="150" style="    float: left;" />
            <img src="<?php echo $cliente["logotipo"]; ?>" width="150"  style="    float: left;" />
            <div class="tabla1" style="float: left;margin-top: 91px;margin-left: -112px;">
                <div id="box">
                    <center><h2 style="text-align: center">Datos Básicos</h2></center>
                    <table class="encab_table">
                        <tbody>
                            <tr>
                                <td><b>Cliente</b></td>
                                <td><?php echo $cliente["nombre"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Nit</b></td>
                                <td><?php echo $cliente["nit"] ?></td>
                            </tr>
                            <tr>
                                <td><b>Tiquets Gestionados a la fecha</b></td>
                                <td><?php echo count($tiquets["completos"]) ?></td>
                            </tr>
                            <tr>
                                <td><b>Tiquets Pendientes a la fecha</b></td>
                                <td><?php echo count($tiquets["pendientes"]) ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <?php
            $suma_late_t = 0;
            $suma_on_t = 0;
            for ($y = 0; $y < count($tiquets["completos"]); $y++) {
                if ($tiquets["completos"][$y]["indicador"] == '<b style="color: red;"> Late</b>') {
                    $suma_late_t++;
                } else {
                    $suma_on_t++;
                }
            }
            $arr = Array();
            for ($i = 0; $i < count($sla); $i++) {
                $suma = 0;
                $suma_late = 0;
                $suma_on = 0;
                for ($y = 0; $y < count($tiquets["completos"]); $y++) {
                    if ($tiquets["completos"][$y]["tipo_servicio"] == $sla[$i]["tipo_servicio"]) {
                        if ($tiquets["completos"][$y]["indicador"] == '<b style="color: red;"> Late</b>') {
                            $suma_late++;
                        } else {
                            $suma_on++;
                        }
                        $suma++;
                    }
                }
                $res = round(($suma_on * 100) / $suma);
                $res_t = round(($suma_on_t * 100) / count($tiquets["completos"]));
                $arr[$sla[$i]["tipo_servicio"]] = $suma;
                $arr[$sla[$i]["tipo_servicio"] . '%'] = $res;
                ?>
            <?php }
            ?>
            <div class="tabla1" style="float: right;margin-right: 198px;margin-top: 5px;">
                <div id="box">
                    <h2 style="text-align: center">Condiciones de Servicio</h2>
                    <table class="encab_table">
                        <thead>
                            <tr>
                                <th>Tipo de Servicio</th>
                                <th style="    width: 53%;">Tiempo</th>
                                <th>N° Tiquets reportados</th>
                                <th>% Efectividad</th>
                            </tr>
                        </thead>
                        <tbody>
<?php
for ($i = 0; $i < count($sla); $i++) {
    ?>
                                <tr>
                                    <td><?php echo $sla[$i]["tipo_servicio_text"]; ?></td>
                                    <td ><?php echo $sla[$i]["tiempo"] . ' minutos'; ?></td>
                                    <td style="    text-align: right;"><?php echo $arr[$sla[$i]["tipo_servicio"]]; ?></td>
                                    <td style="    text-align: right;"><?php echo $arr[$sla[$i]["tipo_servicio"] . '%'] . ' %'; ?></td>
                                </tr>
<?php } ?>
                        </tbody>
                        <thead>
                            <tr>
                                <th colspan="2">Total Reportados</th>
                                <th><?php echo count($tiquets["completos"]) ?></th>
                                <th><?php echo $res_t . ' %' ?></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
        </br>
<!--        <p style="color: brown;font-size: 26px;">Cliente: <?php echo $cliente["nombre"]; ?></p>
    <p style="color: brown;font-size: 26px;">Nit: <?php echo $cliente["nit"]; ?></p>-->
        <div class="graphics" style="margin-top: 18px;">
            <div class="grafica1" style="margin-top: 10px;">
                <canvas id="grafico_1" style="margin-top: 9px;margin-left: -27px;"></canvas>
                <script>
                    var mes = [];
                    var data = [];
<?php
for ($i = 0; $i < count($tiquets["estados"]); $i++) {
    ?>
                        mes.push('<?php echo $tiquets["estados"][$i]["nom_estado"] ?>')
    <?php
}
for ($i = 0; $i < count($tiquets["estados"]); $i++) {
    $suma = 0;
    for ($y = 0; $y < count($tiquets["completos"]); $y++) {
        if ($tiquets["completos"][$y]["estado"] == $tiquets["estados"][$i]["nom_estado"]) {
            $suma++;
        }
    }
    $res = round(($suma * 100) / count($tiquets["completos"]));
    ?>
                        data.push(<?php echo $res ?>);
<?php }
?>
                    var chrt = document.getElementById("grafico_1");
                    chrt.height = 200;
                    chrt.width = 500;
                    Chart.defaults.global.legend.labels.usePointStyle = true;
                    Chart.defaults.globaldefaultFontFamily = "Lato";
                    Chart.defaults.globaldefaultFontSize = 18;
                    var vdata = {
                        labels: mes,
                        datasets: [
                            {
                                data: data,
                                backgroundColor: [
                                    "blue",
                                    "red",
                                    "green",
                                    "orange",
                                    "pink",
                                    "black",
                                    "brown",
                                    "purple",
                                    "grey",
                                    "golden",
                                    "dark blue",
                                    "light blue"
                                ]
                            }]
                    };
                    var pieChart = new Chart(chrt, {
                        type: 'pie',
                        data: vdata,
                        options: {
                            responsive: false,
                            legend: {
                                display: true,
                                position: 'right',
                                labels: {
                                    boxWidth: 30,
                                    padding: 15
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }

                            },
                            legendCallback: function (chart) {
                                var legendHtml = [];
                                legendHtml.push('<ul>');
                                var item = chart.data.datasets[0];
//                                for (var i = 0; i < item.data.length; i++) {
//                                    legendHtml.push('<li>');
//                                    legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] + '"></span>');
//                                    legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + ' person - ' + chart.data.labels[i] + ' times</span>');
//                                    legendHtml.push('</li>');
//                                }

                                legendHtml.push('</ul>');
                                return legendHtml.join("");
                            },
                            tooltips: {
                                enabled: true,
                                mode: 'label',
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        var indice = tooltipItem.index;
                                        return data.labels[indice] + ": " + data.datasets[0].data[indice] + "%";
                                    }
                                }
                            }
                        }
                    });
                </script>
            </div>
            <div class="grafica2" style="margin-top: 10px;">
                <canvas id="grafico_2" style="margin-top: -309px;float: right;margin-right: 33px;"></canvas>
                <script>
                    var mes = [];
                    var data = [];
<?php
for ($i = 0; $i < count($tiquets["servicios"]); $i++) {
    ?>
                        mes.push('<?php echo $tiquets["servicios"][$i]["nom_servicio"] ?>')
    <?php
}
for ($i = 0; $i < count($tiquets["servicios"]); $i++) {
    $suma = 0;
    for ($y = 0; $y < count($tiquets["completos"]); $y++) {
        if ($tiquets["completos"][$y]["tipo_servicio_text"] == $tiquets["servicios"][$i]["nom_servicio"]) {
            $suma++;
        }
    }
    $res = round(($suma * 100) / count($tiquets["completos"]));
    ?>
                        data.push(<?php echo $res ?>);
<?php }
?>
                    var chrt = document.getElementById("grafico_2");
                    chrt.height = 200;
                    chrt.width = 400;
                    Chart.defaults.global.legend.labels.usePointStyle = true;
                    Chart.defaults.globaldefaultFontFamily = "Lato";
                    Chart.defaults.globaldefaultFontSize = 18;
                    var vdata = {
                        labels: mes,
                        datasets: [
                            {
                                data: data,
                                backgroundColor: [
                                    "blue",
                                    "red",
                                    "green",
                                    "orange",
                                    "pink",
                                    "black",
                                    "brown",
                                    "purple",
                                    "grey",
                                    "golden",
                                    "dark blue",
                                    "light blue"
                                ]
                            }]
                    };
                    var pieChart = new Chart(chrt, {
                        type: 'pie',
                        data: vdata,
                        options: {
                            responsive: false,
                            legend: {
                                display: true,
                                position: 'right',
                                labels: {
                                    boxWidth: 30,
                                    padding: 15
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }

                            },
                            legendCallback: function (chart) {
                                var legendHtml = [];
                                legendHtml.push('<ul>');
                                var item = chart.data.datasets[0];
                                for (var i = 0; i < item.data.length; i++) {
                                    legendHtml.push('<li>');
                                    legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] + '"></span>');
                                    legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + ' person - ' + chart.data.labels[i] + ' times</span>');
                                    legendHtml.push('</li>');
                                }

                                legendHtml.push('</ul>');
                                return legendHtml.join("");
                            },
                            tooltips: {
                                enabled: true,
                                mode: 'label',
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        var indice = tooltipItem.index;
                                        return data.labels[indice] + ": " + data.datasets[0].data[indice] + "%";
                                    }
                                }
                            }
                        }
                    });
                </script>
            </div>
            <div class="grafica3" style="margin-top: -344px;float: right;margin-right: 465px;">
                <canvas id="grafico_3" ></canvas>
                <script>
                    var mes = ['On Time', 'Late'];
<?php
$suma_late = 0;
$suma_on = 0;
for ($y = 0; $y < count($tiquets["completos"]); $y++) {
    if ($tiquets["completos"][$y]["indicador"] == '<b style="color: red;"> Late</b>') {
        $suma_late++;
    } else {
        $suma_on++;
    }
}
$res_late = round(($suma_late * 100) / count($tiquets["completos"]));
$res_on = round(($suma_on * 100) / count($tiquets["completos"]));
?>
                    data.push(<?php echo $res ?>);
                    var chrt = document.getElementById("grafico_3");
                    chrt.height = 200;
                    chrt.width = 400;
                    Chart.defaults.global.legend.labels.usePointStyle = true;
                    Chart.defaults.globaldefaultFontFamily = "Lato";
                    Chart.defaults.globaldefaultFontSize = 18;
                    var vdata = {
                        labels: mes,
                        datasets: [
                            {
                                data: [<?php echo $res_on ?>, <?php echo $res_late ?>],
                                backgroundColor: [
                                    "blue",
                                    "red",
                                    "green",
                                    "orange",
                                    "pink",
                                    "black",
                                    "brown",
                                    "purple",
                                    "grey",
                                    "golden",
                                    "dark blue",
                                    "light blue"
                                ]
                            }]
                    };
                    var pieChart = new Chart(chrt, {
                        type: 'pie',
                        data: vdata,
                        options: {
                            responsive: false,
                            legend: {
                                display: true,
                                position: 'right',
                                labels: {
                                    boxWidth: 30,
                                    padding: 15
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }

                            },
                            legendCallback: function (chart) {
                                var legendHtml = [];
                                legendHtml.push('<ul>');
                                var item = chart.data.datasets[0];
                                for (var i = 0; i < item.data.length; i++) {
                                    legendHtml.push('<li>');
                                    legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] + '"></span>');
                                    legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + ' person - ' + chart.data.labels[i] + ' times</span>');
                                    legendHtml.push('</li>');
                                }

                                legendHtml.push('</ul>');
                                return legendHtml.join("");
                            },
                            tooltips: {
                                enabled: true,
                                mode: 'label',
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        var indice = tooltipItem.index;
                                        return data.labels[indice] + ": " + data.datasets[0].data[indice] + "%";
                                    }
                                }
                            }
                        }
                    });
                </script>
                <script>
                    data = {
                        datasets: [{
                                data: [10, 20, 30]
                            }],
                        // These labels appear in the legend and in the tooltips when hovering different arcs
                        labels: [
                            'Red',
                            'Yellow',
                            'Blue'
                        ]
                    };
                    var ctx = '';
                    var data = '';
                    var options = '';
                    var myPieChart = new Chart(ctx, {
                        type: 'pie',
                        data: data,
                        options: options
                    });
                </script>
            </div>
            <!--            <div class="grafica4">
                            <div class="grafica21">
                                <canvas id="myChart" width="400" height="400"></canvas>
                                <script>
                                    var ctx = document.getElementById('myChart').getContext('2d');
                                    var myChart = new Chart(ctx, {
                                        type: 'bar',
                                        data: {
                                            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                                            datasets: [{
                                                    label: 'Total Finalizado',
                                                    data: [12, 19, 3, 5, 2, 3],
                                                    backgroundColor: [
                                                        'rgba(255, 99, 132, 0.2)',
                                                        'rgba(54, 162, 235, 0.2)',
                                                        'rgba(255, 206, 86, 0.2)',
                                                        'rgba(75, 192, 192, 0.2)',
                                                        'rgba(153, 102, 255, 0.2)',
                                                        'rgba(255, 159, 64, 0.2)'
                                                    ],
                                                    borderColor: [
                                                        'rgba(255, 99, 132, 1)',
                                                        'rgba(54, 162, 235, 1)',
                                                        'rgba(255, 206, 86, 1)',
                                                        'rgba(75, 192, 192, 1)',
                                                        'rgba(153, 102, 255, 1)',
                                                        'rgba(255, 159, 64, 1)'
                                                    ],
                                                    borderWidth: 1
                                                }]
                                        },
                                        options: {
                                            scales: {
                                                yAxes: [{
                                                        ticks: {
                                                            beginAtZero: true
                                                        }
                                                    }]
                                            }
                                        }
                                    });
                                </script>
                            </div>-->
            <!--                <div class="grafica22">
                                <canvas id="myChart1" width="400" height="400"></canvas>
                                <script>
                                    var ctx = document.getElementById('myChart1').getContext('2d');
                                    var myChart = new Chart(ctx, {
                                        type: 'bar',
                                        data: {
                                            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                                            datasets: [{
                                                    label: 'Total Pendientes',
                                                    data: [12, 19, 3, 5, 2, 3],
                                                    backgroundColor: [
                                                        'rgba(255, 99, 132, 0.2)',
                                                        'rgba(54, 162, 235, 0.2)',
                                                        'rgba(255, 206, 86, 0.2)',
                                                        'rgba(75, 192, 192, 0.2)',
                                                        'rgba(153, 102, 255, 0.2)',
                                                        'rgba(255, 159, 64, 0.2)'
                                                    ],
                                                    borderColor: [
                                                        'rgba(255, 99, 132, 1)',
                                                        'rgba(54, 162, 235, 1)',
                                                        'rgba(255, 206, 86, 1)',
                                                        'rgba(75, 192, 192, 1)',
                                                        'rgba(153, 102, 255, 1)',
                                                        'rgba(255, 159, 64, 1)'
                                                    ],
                                                    borderWidth: 1
                                                }]
                                        },
                                        options: {
                                            scales: {
                                                yAxes: [{
                                                        ticks: {
                                                            beginAtZero: true
                                                        }
                                                    }]
                                            }
                                        }
                                    });
                                </script>
                            </div>    </div>-->
            <div class="tabla2" style="margin-top: -116px;">
                <div id="box">
                    <main id="center">
                        <h2 style="text-align: center; color:brown">N° Tiquets pendientes a la fecha: <?php echo count($tiquets["pendientes"]) ?></h2>
                        <table class="encab_table" border="1">
                            <thead>
                                <tr>
                                    <th>N° Tiquet</th>
                                    <th style="    width: 11%;">Estado</th>
                                    <th style="    width: 11%;">Fecha Reporte</th>
                                    <th style="    width: 7%;">Tiempo SLA</th>
                                    <th>Tiempo Transcurrido</th>
                                    <th>Indicador</th>
                                    <th>Novedad</th>
                                    <th>Quien Reporto</th>
                                    <th>Quien Atiende</th>
                                </tr>
                            </thead>
                            <tbody>
<?php
for ($i = 0; $i < count($tiquets["pendientes"]); $i++) {
    ?>
                                    <tr>
                                        <td><?php echo $tiquets["pendientes"][$i]["id"] ?></td>
                                        <td><?php echo $tiquets["pendientes"][$i]["estado"] ?></td>
                                        <td><?php echo $tiquets["pendientes"][$i]["fecha_reporte"] ?></td>
                                        <td><?php echo $tiquets["pendientes"][$i]["tiempo_respuesta"] . ' minutos' ?></td>
                                        <td><?php echo $tiquets["pendientes"][$i]["tiempo_transcurrido"] ?></td>
                                        <td><?php echo $tiquets["pendientes"][$i]["indicador"] ?></td>
                                        <td><?php echo $tiquets["pendientes"][$i]["novedad"] ?></td>
                                        <td><?php echo $tiquets["pendientes"][$i]["quien_reporta"] ?></td>
                                        <td><?php echo $tiquets["pendientes"][$i]["atiende_text"] ?></td>
                                    </tr>
<?php } ?>
                            </tbody>
                        </table>
                    </main>
                </div>
            </div>
        </div></body></html>