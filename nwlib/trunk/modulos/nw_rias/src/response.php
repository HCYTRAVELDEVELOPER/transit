<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$search = $_POST["search"];
$todas = "";
$respuestas = "";
$respuesta = "";
$sumaCookie = "";
$pClaves = explode(" ", $search);
//echo "total: " . count($pClaves) . "<br />";
$totalKeyWords = count($pClaves);
//setcookie("keyWord", $search, time() + (60 * 60 * 24 * 365));
for ($ii = 0; $ii < $totalKeyWords; $ii++) {
    $keyClean = str_replace("?", "", $pClaves[$ii]);
//    $keyClean = str_replace(",", "", $pClaves[$ii]);
//    $keyClean = str_replace("!", "", $pClaves[$ii]);
//    $keyClean = str_replace("-", "", $pClaves[$ii]);
    $where = " " . NWDbQuery::sqlFieldsFilters("palabras_clave", $keyClean);
    $ca->prepareSelect("nw_rias", "pregunta,respuesta", $where);
    if (!$ca->exec()) {
        echo "error" . $ca->lastErrorText();
    }
//    echo $ca->size();
    if ($ca->size() != 0) {
        for ($iii = 0; $iii < $ca->size(); $iii++) {
            $ca->next();
            $r = $ca->assoc();
            $row = $ii + 1;
            if ($row == $totalKeyWords) {
                $todas .= $pClaves[$ii];
            } else {
                $todas .= $pClaves[$ii] . " ";
            }
//        if ($pClaves[$ii] == $_COOKIE["keyWord"]) {
            $respuestas = $pClaves[$ii];
            if ($search == $r["respuesta"]) {
                $sumaCookie++;
                $respuesta .= $r["respuesta"] . "///";
            } 
            if ($pClaves[$ii] == $respuestas) {
                $sumaCookie++;
                $respuesta .= $r["respuesta"] . "///";
//                setcookie("respuesta", $r["respuesta"], time() + (60 * 60 * 24 * 365));
//                setcookie("keyWord", $pClaves[$ii], time() + (60 * 60 * 24 * 365));
            } else {
                $respuesta .= 0 . "///";
//                setcookie("keyWord", $pClaves[$ii], time() + (60 * 60 * 24 * 365));
            }
        }
    }
}
//echo $respuesta;
$respuestaFinal = explode("///", $respuesta);
$respuestaRobot = $respuestaFinal[0];
if ($respuestaRobot == "") {
    $respuestaRobot = "mmm...";
}
//echo "<b>Cliente: " . $search . "<b /><br />";
//echo "<b>Robot: " . $respuestaRobot . "<b />$sumaCookie<br />";
echo "<b>Robot: " . $respuestaRobot . "<b /><br />";
return;
$palabrasKey = $todas;
echo "key: " . $palabrasKey . "<br />";

function search() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $palabrasKey;
    $where = "1=1 ";
    $campos = "palabras_clave";
    $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $palabrasKey);
    $ca->prepareSelect("nw_rias", "*", $where);
    if (!$ca->exec()) {
        echo "error" . $ca->lastErrorText();
    }
    if ($ca->size() == 0) {
        echo "lo siento, me podría repetir la pregunta?";
    }
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        echo $ca->size() . "-" . $r["respuesta"] . ". <br />";
    }
}

search();
?>
