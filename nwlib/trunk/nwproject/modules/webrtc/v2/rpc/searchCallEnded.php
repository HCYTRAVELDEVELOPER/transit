<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
$usedOutNwlib = true;
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";
$p = $_POST;
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->setCleanHtml(false);
$ca->prepareSelect("sop_visitantes", "estado", "id=:id");
$ca->bindValue(":id", $p["id"]);
if (!$ca->exec()) {
    $a = Array();
    $a["error_text"] = $ca->lastErrorText();
    $a["program_name"] = "Ringow {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo json_encode("Error. " . $ca->lastErrorText());
    return false;
}
$rta = "NO_EXISTE";
if ($ca->size() > 0) {
    $r = $ca->flush();
    $rta = $r["estado"];
}
echo json_encode($rta);
