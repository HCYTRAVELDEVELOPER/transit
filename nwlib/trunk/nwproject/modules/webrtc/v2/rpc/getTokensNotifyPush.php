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
$ca->prepareSelect("nwmaker_suscriptorsPush", "json", "usuario=:usuario");
$ca->bindValue(":usuario", $p["usuario"]);
if (!$ca->exec()) {
    return "Error. " . $ca->lastErrorText();
}
$rta = "NO_FOUND";
if ($ca->size() > 0) {
    $rta = $ca->assocAll();
}
echo json_encode($rta);
