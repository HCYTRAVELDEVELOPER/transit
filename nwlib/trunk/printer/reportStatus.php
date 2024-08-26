<?php
include_once dirname(__FILE__) . '../../rpc/nwApi.inc.php';

function TraerClientes() {
    $nwApi = new nwApi("https://nwadmin.gruponw.com/rpcsrv/api.inc.php");
    $nwApi->setUser("robot");
    $nwApi->setPassword("123456");
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
    $nwApi->setUser("robot");
    $nwApi->setPassword("123456");
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
    $nwApi->setUser("robot");
    $nwApi->setPassword("123456");
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
$tiquets["pendientes"] = [];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
    <head>
        <title>Reporte de estado</title>
        <script type = "text/javascript" src = "../charts/Chart.min.js"></script>
        <link rel="stylesheet" type="text/css" href="../charts/style_2.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;display=swap" rel="stylesheet">
    </head>

    <body style=" background-color: white; font-family: 'Montserrat', sans-serif;">
        <div style="
             overflow: hidden;
             ">
            <div style="overflow: hidden; margin-bottom: 30px;">
                <img src="https://www.gruponw.com/imagenes/logoNW04_ss.jpg" width="150" style="    float: left;" />
                <img src="<?php echo $cliente["logotipo"]; ?>" width="150"  style="    float: right;" />
            </div>
            <div class="tabla1" style="    float: left;
                 width: 43%;
                 margin: 0px 2%;">
                <div id="box"><h2 style="
                                  text-align: center;
                                  color: white;
                                  background-color: #A61E22;
                                  font-weight: 600;
                                  padding: 10px;
                                  margin: unset;
                                  ">
                        Reporte mes de  <?php
                        switch (date("m")) {
                            case 1:
                                echo "Enero";
                                break;
                            case 2:
                                echo "Febrero";
                                break;
                            case 3:
                                echo "Marzo";
                                break;
                            case 4:
                                echo "Abril";
                                break;
                            case 5:
                                echo "Mayo";
                                break;
                            case 6:
                                echo "Junio";
                                break;
                            case 7:
                                echo "Julio";
                                break;
                            case 8:
                                echo "Agosto";
                                break;
                            case 9:
                                echo "Septiembre";
                                break;
                            case 10:
                                echo "Octubre";
                                break;
                            case 11:
                                echo "Noviembre";
                                break;
                            case 12:
                                echo "Diciembre";
                                break;
                        }
                        ?></h2>
                    <h3 style="
                        font-style: italic;
                        font-weight: 600;
                        margin: 10px 20px;
                        ">Datos Básicos</h3>
                    <table class="encab_table">
                        <tbody>
                            <tr style="background-color: #F1F2F2;">
                                <td style="padding: 0px 20px;
                                    font-weight: bold;
                                    width: 50%;
                                    height: 35px;"><b style="    font-weight: normal;">Cliente</b></td>
                                <td style="padding: 5px 20px;
                                    width: 50%;
                                    height: 35px; text-align: right;"><?php echo $cliente["nombre"] ?></td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 20px;
                                    font-weight: bold;
                                    width: 50%;
                                    height: 35px;"><b style="    font-weight: normal;">Nit</b></td>
                                <td style="padding: 5px 20px;
                                    width: 50%;
                                    height: 35px; text-align: right;"><?php echo $cliente["nit"] ?></td>
                            </tr>
                            <tr style="background-color: #F1F2F2;">
                                <td style="padding: 0px 20px;
                                    font-weight: bold;
                                    width: 50%;
                                    height: 35px;"><b style="    font-weight: normal;">Tiquets Gestionados a la fecha</b></td>
                                <td style="padding: 5px 20px;
                                    width: 50%;
                                    height: 35px; text-align: right;"><?php echo count($tiquets["completos"]) ?></td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 20px;
                                    font-weight: bold;
                                    width: 50%;
                                    height: 35px;"><b style="    font-weight: normal;">Tiquets Pendientes a la fecha</b></td>
                                    <?php
                                    $pendientes = 0;
                                    $pendiente = 0;
                                    $escalados = 0;
                                    for ($i = 0; $i < count($tiquets["completos"]); $i++) {
                                        if ($tiquets["completos"][$i]["id_estado"] != '10' &&
                                                $tiquets["completos"][$i]["id_estado"] != '4') {
                                            implode($tiquets["completos"][$i], $tiquets["pendientes"]);
                                            $pendientes++;
                                        }
                                        if ($tiquets["completos"][$i]["id_estado"] == '2' ||
                                                $tiquets["completos"][$i]["id_estado"] == '3' ||
                                                $tiquets["completos"][$i]["id_estado"] == '13' ||
                                                $tiquets["completos"][$i]["id_estado"] == '9' ||
                                                $tiquets["completos"][$i]["id_estado"] == '1' ||
                                                $tiquets["completos"][$i]["id_estado"] == '14' ||
                                                $tiquets["completos"][$i]["id_estado"] == '12' ||
                                                $tiquets["completos"][$i]["id_estado"] == '1') {
                                            $pendiente++;
                                        }
                                        if ($tiquets["completos"][$i]["id_estado"] == '7' ||
                                                $tiquets["completos"][$i]["id_estado"] == '8' ||
                                                $tiquets["completos"][$i]["id_estado"] == '6' ||
                                                $tiquets["completos"][$i]["id_estado"] == '5' ||
                                                $tiquets["completos"][$i]["id_estado"] == '11') {
                                            $escalados++;
                                        }
                                    }
                                    ?>
                                <td style="padding: 5px 20px;
                                    width: 50%;
                                    height: 35px; text-align: right;"><?php echo $pendientes ?></td>
                            </tr>
                            <tr style="background-color: #F1F2F2;">
                                <td style="padding: 0px 20px;
                                    width: 50%;
                                    height: 35px;"><b style="    font-weight: bold; color: brown;">Pendientes Soporte</b></td>
                                <td style="padding: 5px 20px;
                                    width: 50%;
                                    height: 35px;  text-align: right;"><b style="color: brown; font-weight: bold;"><?php echo $pendiente ?></b></td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 20px;
                                    width: 50%;
                                    height: 35px;"><b style="color: brown; font-weight: bold;">Pendientes Escalados</b></td>
                                <td style="padding: 5px 20px;
                                    width: 50%;
                                    height: 35px;  text-align: right;"><b style="color: brown; font-weight: bold;"><?php echo $escalados ?></b></td>
                            </tr>
<!--                            <tr>
                                <td><b>Mes</b></td>
                                <td> 
                                    <select>
                                        <option>Enero</option>Hola
                                        <option>Febrero</option>Hola
                                        <option>Marzo</option>Hola
                                        <option>Abril</option>Hola
                                        <option>Mayo</option>Hola
                                        <option>Junio</option>Hola
                                        <option>Julio</option>Hola
                                        <option>Agosto</option>Hola
                                        <option>Septiembre</option>Hola
                                        <option>Octubre</option>Hola
                                        <option>Noviembre</option>Hola
                                        <option>Diciembre</option>Hola
                                    </select>
                                </td>
                            </tr>-->
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
                if (is_nan($res)) {
                    $res = 0;
                }
                $arr[$sla[$i]["tipo_servicio"] . '%'] = $res;
                ?>
            <?php }
            ?>
            <div class="tabla1" style="float: right;
                 width: 49%;
                 margin: 0px 2%;">
                <div id="box">
                    <table class="encab_table">
                        <thead>
                            <tr>
                                <th style="    width: 40%;     font-size: 14px; text-transform: uppercase;">Tipo de Servicio</th>
                                <th style="    width: 20%;     font-size: 14px; text-transform: uppercase;">Tiempo</th>
                                <th style="    width: 20%;     font-size: 14px; text-transform: uppercase;">N° Tiquets reportados</th>
                                <th style="    width: 20%;     font-size: 14px; text-transform: uppercase;">% Efectividad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            for ($i = 0; $i < count($sla); $i++) {
                                $hora = $sla[$i]["tiempo"] / 60;
                                ?>
                                <tr style="border-bottom: 2px solid #F1F2F2;">
                                    <td style="padding: 0px 20px;
                                        height: 35px;"><?php echo $sla[$i]["tipo_servicio_text"]; ?></td>
                                    <td style="padding: 0px 20px;
                                        height: 35px;"><?php echo $hora . ' horas'; ?></td>
                                    <td style="    text-align: right; padding: 0px 20px;
                                        height: 35px; "><?php echo $arr[$sla[$i]["tipo_servicio"]]; ?></td>
                                    <td style="    text-align: right; padding: 0px 20px;
                                        height: 35px;"><?php echo $arr[$sla[$i]["tipo_servicio"] . '%'] . ' %'; ?></td>
                                </tr>

                            <?php } ?>
                        </tbody>

                        <thead>
                            <tr style="text-align: right;
                                color: white;
                                background-color: #A61E22;
                                font-weight: 600;
                                margin: unset;">
                                <th colspan="2" style="text-transform: uppercase;
                                    padding: 0px 20px;
                                    height: 35px;">Total Reportados</th>
                                <th style="padding: 0px 20px;
                                    height: 35px;"><?php echo count($tiquets["completos"]) ?></th>
                                <th style="padding: 0px 20px;
                                    height: 35px;"><?php echo $res_t . ' %' ?></th>
                            </tr>
                        </thead>    
                    </table>
                </div>
            </div>
        </div>

        <div class="graphics" style="overflow: hidden; max-width: 100%;margin: 30px auto 0; box-sizing: border-box; width: 96%;">
            <table class="encab_table">
                <thead>
                    <tr>
                        <th style="    width: 33%.3%; margin:auto;">Reporte por Estados</th>
                        <th style="    width: 33%.3%; margin:auto;">Reporte por Efectividad</th>
                        <th style="    width: 33%.3%; margin:auto;">Reporte por Servicio</th>
                    </tr>
                </thead>
            </table>
            <div class="grafica1" style="margin-top: 10px;">
                <canvas id="grafico_1" style="margin-top: 9px;margin-left: -59px;"></canvas>
                <script>
                    var mes = [];
                    var data = [];
<?php
for ($i = 0; $i < count($tiquets["estados"]); $i++) {
    ?>
                        mes.push('<?php echo $tiquets["estados"][$i]["nom_estado"] ?>');
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
                                    "green",
                                    "red"
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
            <div class="tabla2" style="margin: -116px 0 0 0;">
                <div id="box">
                    <main id="center">
                        <h2 style="text-align: center; color:brown">N° Tiquets gestionados a la fecha: <?php echo count($tiquets["completos"]) ?></h2>
                        <table class="encab_table" border="2" style="
                               border-spacing: 2px;
                               border-color: unset;
                               font-variant: normal;
                               border: unset;
                               border-collapse: collapse;
                               ">
                            <thead>
                                <tr>
                                    <th style="
                                        padding: 5px 10px;
                                        width: 10%;
                                        "   >N° Tiquet</th>
                                    <th style="
                                        padding: 5px 10px;
                                        width: 10%;
                                        ">Estado</th>
                                    <th style="
                                        padding: 5px 10px;
                                        width: 20%;
                                        ">Novedad</th>


                                    <th style="
                                        padding: 5px 10px;
                                        width: 15%;
                                        ">Quien Reporto</th>
                                    <th style="
                                        padding: 5px 10px;
                                        width: 10%;
                                        ">Indicador</th>
                                    <th style="
                                        padding: 5px 10px;
                                        width: 15%;
                                        ">Quien Atiende</th>
                                    <th style="
                                        padding: 5px 10px;
                                        width: 20%;
                                        ">Tiempos de respuesta</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $color = "green";
                                for ($i = 0; $i < count($tiquets["completos"]); $i++) {
                                    $hora = $tiquets["completos"][$i]["tiempo_respuesta"] / 60;
                                    ?>
                                    <tr>
                                        <td style="
                                            padding: 5px 10px;
                                            "><?php echo $tiquets["completos"][$i]["id"] ?></td>
                                            <?php
                                            if ($tiquets["completos"][$i]["nom_estado"] == "PENDIENTE") {
                                                $color = 'red';
                                            } else if ($tiquets["completos"][$i]["nom_estado"] == "FINALIZADO OK") {
                                                $color = 'green';
                                            } else if ($tiquets["completos"][$i]["nom_estado"] == "EN PROCESO ESCALAMIENTO") {
                                                $color = 'blue';
                                            } else if ($tiquets["completos"][$i]["nom_estado"] == "ANULADO") {
                                                $color = 'blue';
                                            }
                                            ?>
                                        <td> <b style="    background-color: <?php echo $color ?>;    font-weight: bold;
                                                font-size: 0px;
                                                height: 20px;
                                                width: 20px;
                                                display: block;
                                                margin: auto;
                                                border-radius: 50%;
                                                "><?php echo $tiquets["completos"][$i]["estado"] ?></b> <?php echo $tiquets["completos"][$i]["estado"] ?></td>
                                        <td style="
                                            padding: 5px 10px;
                                            "><?php
                                                $rest = substr($tiquets["completos"][$i]["novedad"], 0, 250);
                                                echo $rest
                                                ?></td>



                                        <td style="
                                            padding: 5px 10px;
                                            text-transform: uppercase;
                                            "><?php echo $tiquets["completos"][$i]["quien_reporta"] ?></td>
                                        <td> <b style="
                                                text-align: center;
                                                display: block;
                                                margin: auto;
                                                border-radius: 50%;
                                                "><?php echo $tiquets["completos"][$i]["indicador"] ?></b></td>
                                        <td style="
                                            padding: 5px 10px;
                                            text-transform: uppercase;
                                            "><?php echo $tiquets["completos"][$i]["atiende_text"] ?></td>
                                        <td style="
                                            padding: 0px 0 10px;
                                            "><b style="
                                             padding: 5px 10px;
                                             background-color: #808080b8;
                                             color: white;
                                             margin-bottom: -10px;
                                             overflow: hidden;
                                             display: block;
                                             ">Fecha Reporte</b><br><b style="
                                                                      padding: 0  10px;
                                                                      display: block;
                                                                      font-weight: normal;
                                                                      "><?php echo $tiquets["completos"][$i]["fecha_reporte"] ?></b>
                                                <br>
                                                    <b style="
                                                       padding: 5px  10px;
                                                       background-color: #808080b8;
                                                       color: white;
                                                       margin-bottom: -10px;
                                                       overflow: hidden;
                                                       display: block;
                                                       ">Tiempo SLA</b><br><b style="
                                                                           padding: 0 10px;
                                                                           display: block;
                                                                           font-weight: normal;

                                                                           "><?php echo $hora . ' horas' ?></b>
                                                        <br>
                                                            <b style="
                                                               padding: 5px 10px;
                                                               background-color: #808080b8;
                                                               color: white;
                                                               margin-bottom: -10px;
                                                               overflow: hidden;
                                                               display: block;
                                                               ">Tiempo Transcurrido</b><br><b style="
                                                                                            padding: 0 10px;
                                                                                            display: block;
                                                                                            font-weight: normal;
                                                                                            "><?php echo$tiquets["completos"][$i]["tiempo_transcurrido"] ?></b></td>
                                                                </tr>
                                                            <?php } ?>
                                                            </tbody>
                                                            </table>
                                                            </main>
                                                            </div>
                                                            </div>
                                                            </div></body></html>