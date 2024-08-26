<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

$db = NWDatabase::database();
$cc = new NWDbQuery($db);
$cc->prepareSelect("nwanimate_objects_animation", "*", "objeto=:objecto and activo='si' order by id asc");
$cc->bindValue(":objecto", $_POST["id"]);
if (!$cc->exec()) {
    echo "error:" . $cc->lastErrorText();
    return;
}
$totalANims = $cc->size();
$rta = Array();
$points = Array();
$data = Array();
if ($totalANims > 0) {
    for ($e = 0; $e < $totalANims; $e++) {
        $num = $e + 1;
        $cc->next();
        $rob = $cc->assoc();
        $velocity_object = $rob["velocidad"] / 10;
//        $v = [];
        $v = "";
        $v["left"] = $rob["pos_x"];
        $v["top"] = $rob["pos_y"];
        $v["object"] = $rob["id"];
        $v["time"] = $velocity_object;
        $points[] = "<div id='fotogramaLineTime_$num' class='fotogramaLineTime fotograma_" . $_POST["id"] . "' style='left: " . $velocity_object . "px; ' name=''></div>";
        $data[] = $v;
    }
    $rta["points"] = $points;
    $rta["data"] = $data;
    echo json_encode($rta);
}
?>
