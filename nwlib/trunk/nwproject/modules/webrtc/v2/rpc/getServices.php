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
$id_filtro_padre = "";
$where = "terminal=:id";
if (isset($p["parent"])) {
    if ($p["parent"] === "true" || $p["parent"] === true) {
        $where .= " and filtro='SI' ";
    } else
    if ($p["parent"] === "false" || $p["parent"] === false) {
        $where .= " and filtro='NO' ";
    } else {
        $where .= " and id_filtro_padre=:id_filtro_padre";
        $id_filtro_padre = $p["parent"];
    }
}
$ca->prepareSelect("sop_secciones", "*", $where);
$ca->bindValue(":id", $p["id"], true, true);
$ca->bindValue(":id_filtro_padre", $id_filtro_padre, true, true);
if (!$ca->exec()) {
    echo json_encode("Error. " . $ca->lastErrorText());
    return false;
}
$d = "NONE";
if ($ca->size() > 0) {
    $d = $ca->assocAll();
}
echo json_encode($d);
