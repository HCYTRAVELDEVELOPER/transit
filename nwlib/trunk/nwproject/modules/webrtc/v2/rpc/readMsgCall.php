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
$type = $p["type"];
if ($p["type"] === "leido") {
    $type = "leido,recibido";
}
$ca->prepareUpdate("sop_chat", $type, "(room_v2=:room_v2 or visitante=:room_v2) and usuario=:usuario");
$ca->bindValue(":usuario", $p["usuario"], true, true);
$ca->bindValue(":room_v2", $p["room"], true, true);
if ($p["type"] === "leido") {
    $ca->bindValue(":leido", "SI");
    $ca->bindValue(":recibido", "SI");
} else {
    $ca->bindValue(":{$p["type"]}", "SI");
}
if (!$ca->exec()) {
    $a = Array();
    $a["error_text"] = $ca->lastErrorText();
    $a["program_name"] = "Ringow readMsgCall.php {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo json_encode("Error. " . $ca->lastErrorText());
    return false;
}
$ca->prepareUpdate("nwmaker_notificaciones", "leido,fecha_lectura", "usuario_recibe=:usuario_recibe and id_objetivo=:room");
$ca->bindValue(":usuario_recibe", $p["myUser"], true, true);
$ca->bindValue(":room", $p["room"], true, true);
$ca->bindValue(":leido", "SI");
$ca->bindValue(":fecha_lectura", date("Y-m-d H:i:s"));
if (!$ca->exec()) {
    $a = Array();
    $a["error_text"] = $ca->lastErrorText();
    $a["program_name"] = "Ringow readMsgCall.php {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo json_encode("Error. " . $ca->lastErrorText());
    return false;
}
$rta = "true";
echo json_encode($rta);
