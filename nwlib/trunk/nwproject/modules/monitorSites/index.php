<?php
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function getSite($url, $id) {
    $html = file_get_contents($url);
    $texto = "";
    $status = "FAILED";
    $color = "red;";
    $ob = strpos($html, "id='" . $id);
    $ob_alter = strpos($html, 'id="' . $id);
    if ($ob !== "" && $ob !== null && $ob !== false || $ob_alter !== "" && $ob_alter !== null && $ob_alter !== false) {
        $status = "OK";
        $color = "#86c76f;";
    }
//    $doc = new DOMDocument;
//    $doc->loadHTML($html, LIBXML_COMPACT | LIBXML_HTML_NOIMPLIED | LIBXML_NONET);
//    $textoejemplo = $doc->getElementById($id);
//    $texto = $textoejemplo->textContent;
//    $texto = strip_tags($texto);
//    $texto = str_replace(" ", "", $texto);
//    $color = "#86c76f;";
//    $status = "OK";
//    if ($texto == "") {
//        $status = "FAILED";
//        $color = "red;";
//    }
    echo "<tr style='background: $color'>";
    echo "<td>" . $url . "</td><td> " . $status . " {$texto} </td>";
    echo "</tr>";
}

function getAll() {
//    $output = shell_exec('ping -c1 google.com');
//    echo "<pre>$output</pre>";
//    return;
//    getSite('https://www.reddearboles.org', 'foot_nw_credit');
//    getSite('https://www.ringow.com', 'foot_nw_credit');
//    getSite('https://www.sanitco.com', 'foot_nw_credit');
//    getSite('https://homecenter.gruponw.com', 'downloading');
//    getSite('https://app.taskenter.com', 'downloading');
//    getSite('https://www.logimov.com', 'foot_nw_credit');
//    getSite('https://www.taskenter.com', 'foot_nw_credit');
//    getSite('https://products.gruponw.com', 'downloading');
//    getSite('https://gsclaro.com', 'playground');
//    getSite('https://nwadmin.gruponw.com', 'playground');
//    getSite('https://app.ringow.com', 'downloading');
//    getSite('https://www.gruponw.com', 'foot_nw_credit');
//    getSite('https://mydamcovas.com', 'playground');
//    getSite('https://ecomcolombia.com.co', 'playground');
//    return;
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nw_monitor_sites", "*", "1=1");
    if (!$ca->exec()) {
        echo "Error line 8 " . $ca->lastErrorText();
        return false;
    }
    $t = $ca->size();
    if ($t == 0) {
        echo "No hay sitios para monitorear";
        return false;
    }
    for ($i = 0; $i < $t; $i++) {
        $r = $ca->flush();
        getSite($r["dominio"], $r["ratreo"]);
    }
}
?>
<div style='width: 100%;max-width: 1000px;margin: auto;position: relative;'>
    <h2>Última actualización: <?php echo date("Y-m-d H:i:s"); ?></h2>
    <p>
        Cada <span class="time"></span> minutos (<span class="segs"></span> segundos) se actualiza. Count: <span class="count">0</span>
    </p>
    <table border='yes' style='width: 100%;'>
        <tr>
            <th>
                SITE
            </th>
            <th>
                STATUS
            </th>
        </tr>
        <?php
        getAll();
        ?>
    </table>
</div>
<!--<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-3.3.1.min.js'></script>-->
<script>
    var count = 1;
    document.addEventListener("DOMContentLoaded", function () {
        var mins = 10;
        var milis = 1000;
        var min = 60 * milis;
        var time = min * mins;
        var segs = time / 1000;
        document.querySelector(".time").innerHTML = mins;
        document.querySelector(".segs").innerHTML = segs;
        init = setInterval(function () {
            if (count > segs) {
                clearInterval(init);
                return;
            }
            document.querySelector(".count").innerHTML = count;
            count++;
        }, milis);
        setTimeout(function () {
            window.location.reload();
        }, time);
    });
</script>