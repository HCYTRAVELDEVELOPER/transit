<?php
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesion Invalida. Inicie sesion.." . $_SESSION["usuario"] . " user";
    return true;
}
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function visitas() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = "terminal=:terminal group by fecha_sola order by fecha_sola asc limit 15";
//    $ca->prepareSelect("sop_visitantes", "DATE(fecha::date) as fecha_sola,SUM(visita) as total", $where);
    $ca->prepareSelect("sop_visitantes", "DATE(fecha) as fecha_sola,SUM(visita) as total", $where);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "Error!";
        return;
    }
    if ($ca->size() == 0) {
        echo "no hay registros, lo sentimos.";
        return;
    }
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        ?>
        ['<?php echo $r["fecha_sola"] ?>', <?php echo $r["total"]; ?>],
        <?php
    }
}

function visitasPromedio() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $total_visitas = "";
    $where = "terminal=:terminal group by fecha_sola order by fecha_sola asc";
    $ca->prepareSelect("sop_visitantes", "DATE(fecha) as fecha_sola,SUM(visita) as total", $where);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "Error!";
        return;
    }
    if ($ca->size() == 0) {
        echo "no hay registros, lo sentimos.";
        return;
    }
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        $total_visitas += $r["total"];
    }
    $promedio = $total_visitas / $ca->size();
    echo "<h1 class='now'>";
    echo number_format($promedio, 0);
    echo "</h1>";
}

function visitas_otras($p, $c, $g) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = " 1=1 ";
    $where .= " and terminal=:terminal ";
    $fields = "SUM(visita) as total";
    if ($p != "") {
        $where .= $p;
    }
    if ($c != "") {
        $fields .= "," . $c;
    }
    $ca->prepareSelect("sop_visitantes", $fields, $where . " order by total desc");
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "Error!";
        return;
    }
    if ($ca->size() == 0) {
        echo "no hay registros, lo sentimos.";
        return;
    }
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        $num = $i + 1;
        if ($g == "si") {
            if ($r["$c"] != "") {
                ?>
                ['<?php echo $r["$c"] ?>', <?php echo $r["total"]; ?>],
                <?php
            }
        } else {
            echo "<tr><td style='width: 30px;'>" . $num . "</td><td style='width: 50px;'>" . $r["total"] . "</td><td>" . $r["$c"] . "</td></tr>";
        }
    }
}

function visitas_ahora() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
//    $where = " terminal=:terminal and (estado<>'NO_CONECTADO' and estado<>'DESCONECTADO') 
//            and (EXTRACT(EPOCH FROM fecha::timestamp) > (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - 1800)) ";
    $where = " terminal=:terminal and (estado<>'NO_CONECTADO' and estado<>'DESCONECTADO') ";
    $ca->prepareSelect("sop_visitantes", "*", $where);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "Error!";
        return;
    }
    echo "<h1 class='now'>";
    echo $ca->size();
    echo "</h1>";
}

function operadores() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
//    $where = " terminal=:terminal and estado='ACTIVO'";
//    $where = " (estado<>'NO_CONECTADO' and estado<>'DESCONECTADO') 
//            and (EXTRACT(EPOCH FROM fecha::timestamp) > (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - 1800)) ";
    $where = " (estado<>'NO_CONECTADO' and estado<>'DESCONECTADO')  ";
    $ca->prepareSelect("sop_operadores", "*", $where);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "Error!";
        return;
    }
    echo "<h1 class='now'>";
    echo $ca->size();
    echo "</h1>";
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        echo "<p>" . $r["usuario"] . "</p>";
    }
}

function timesince($original) {
    $ta = array(
        array(31536000, "Año", "Años"),
        array(2592000, "Mes", "Meses"),
        array(604800, "Semana", "Semanas"),
        array(86400, "Día", "Días"),
        array(3600, "Hora", "Horas"),
        array(60, "Minuto", "Minutos"),
        array(1, "Segundo", "Segundos")
    );
    $since = time() - $original;
    $res = "";
    $lastkey = 0;
    for ($i = 0; $i < count($ta); $i++) {
        $cnt = floor($since / $ta[$i][0]);
        if ($cnt != 0) {
            $since = $since - ($ta[$i][0] * $cnt);
            if ($res == "") {
                $res .= ( $cnt == 1) ? "1 {$ta[$i][1]}" : "{$cnt} {$ta[$i][2]}";
                $lastkey = $i;
            } else if ($ta[0] >= 60 && ($i - $lastkey) == 1) {
                $res .= ( $cnt == 1) ? " y 1 {$ta[$i][1]}" : " y {$cnt} {$ta[$i][2]}";
                break;
            } else {
                break;
            }
        }
    }
    return $res;
}

function visitas_recientes() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = " terminal=:terminal order by fecha desc limit 10";
    $ca->prepareSelect("sop_visitantes", "*", $where);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "Error!";
        return;
    }
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($r["estado"] == "CONECTADO") {
            $fondo = "background: green;color: #fff;";
        }
        if ($r["estado"] == "ATENDIDO") {
            $fondo = "background: green;color: #fff;";
        }
        if ($r["estado"] == "LLAMANDO") {
            $fondo = "background: green;color: orange;";
        }
        if ($r["estado"] == "VISITANDO") {
            $fondo = "background: rgb(200, 238, 200);";
        }
        if ($r["estado"] == "DESCONECTADO") {
            $fondo = "background: #BEBEBE;";
        }
        $hora = strtotime($r["fecha"]);
        $hora = timesince($hora);
        echo "<tr style='$fondo font-size: 10px;'><td style='width: 70px;'>Hace " . $hora . "</td><td style='font-size: 9px;text-transform: lowercase;width: 50px;'>" . $r["estado"] . "</td><td>" . $r["url"] . "</td><td style='width: 50px;'>" . $r["ciudad"] . "</td><td>" . $r["ip"] . "</td></tr>";
    }
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script type="text/javascript" src="/nwlib6/includes/jquery/jquery-1.4.2.min.js" ></script>
        <script type="text/javascript" src="/nwlib6/modulos/nw_soporte_chat/js/jsapi"></script>
        <link rel="stylesheet" type="text/css" href="../css/css.css" />
    </head>
    <body> 
        <div id="contend">
            <h1>
                Estadísticas de su sitio web
            </h1>
 <!--<script type="text/javascript" src="https://www.google.com/jsapi"></script>-->
            <script type="text/javascript">
                google.load("visualization", "1", {packages: ["corechart"]});
                google.setOnLoadCallback(drawChart);
                function drawChart() {
                    var data = google.visualization.arrayToDataTable([
                        ['Fecha', 'Visitas'],
<?php
visitas();
?>
                    ]);
                    var options = {
                        title: 'Visitas Diarias'
                    };
                    var chart = new google.visualization.LineChart(document.getElementById('chart_div_line'));
                    chart.draw(data, options);
                }
            </script>
            <div class="enc">
                <div id="chart_div_line"></div>
                <div class="others">
                    <h1>
                        Ahora mismo
                    </h1>
                    <?php
                    visitas_ahora();
                    ?>
                </div>
                <div class="others">
                    <h1>
                        Promedio de visitas
                    </h1>
                    <?php
                    visitasPromedio();
                    ?>
                </div>
                <div class="others">
                    <h1>
                        Operadores Conectados
                    </h1>
                    <?php
                    operadores();
                    ?>
                </div>
            </div>
            <div class="others bloques_two">
                <h1>
                    Visitas Recientes
                </h1>
                <table>
                    <tr>
                        <th style="width: 70px;">
                            Fecha y Hora
                        </th>
                        <th style="width: 50px;">
                            Estado
                        </th>
                        <th>
                            URL
                        </th>
                        <th style="width: 60px;">
                            Ciudad
                        </th>
                        <th>
                            IP
                        </th>
                    </tr>
                </table>
                <div class="contiene_tabla">
                    <table>
                        <?php
                        visitas_recientes();
                        ?>
                    </table>
                </div>
            </div>
            <div class="others bloques_two">
                <h1>
                    Páginas más vistas
                </h1>
                <table>
                    <tr>
                        <th style="width: 30px;">

                        </th>
                        <th style="width: 50px;">
                            Visitas
                        </th>
                        <th>
                            URL
                        </th>
                    </tr>
                </table>
                <div class="contiene_tabla">
                    <table>
                        <?php
                        visitas_otras("group by url", "url", "");
                        ?>
                    </table>
                </div>
            </div>
            <div class="others bloques_two" >
                <h1>
                    Sistema Operativo
                </h1>
                <script type="text/javascript">
                    google.load("visualization", "1", {packages: ["corechart"]});
                    google.setOnLoadCallback(drawChart);
                    function drawChart() {
                        var data = google.visualization.arrayToDataTable([
                            ['Seccion sitio', 'Visitas'],
<?php
visitas_otras("group by navegador", "navegador", "si");
?>
                        ]);
                        var options = {
                            title: 'Visitas en secciones de su sitio web'
                        };

                        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                        chart.draw(data, options);
                    }
                </script>
                <div id="piechart" style="width: 100%; height: 400px;"></div>
            </div>
            <div class="others bloques_two" >
                <h1>
                    Paises
                </h1>
                <script type="text/javascript">
                    google.load("visualization", "1", {packages: ["corechart"]});
                    google.setOnLoadCallback(drawChart);
                    function drawChart() {
                        var data = google.visualization.arrayToDataTable([
                            ['Seccion sitio', 'Visitas'],
<?php
visitas_otras("group by pais", "pais", "si");
?>
                        ]);
                        var options = {
                            title: 'Visitas en secciones de su sitio web'
                        };

                        var chart = new google.visualization.PieChart(document.getElementById('piechartDos'));
                        chart.draw(data, options);
                    }
                </script>
                <div id="piechartDos" style="width: 100%; height: 400px;"></div>
            </div>
        </div>
    </body>
</html>