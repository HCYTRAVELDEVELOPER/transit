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
$sala = "";
$username = "";
$where = "terminal=:id";
if (isset($p["service"])) {
    $where .= " and sala=:sala";
    $sala = $p["service"];
}
if (isset($p["username"])) {
    $where .= " and usuario=:usuario";
    $username = $p["username"];
}
$ca->prepareSelect("usuarios", "*", $where);
$ca->bindValue(":id", $p["id"], true, true);
$ca->bindValue(":sala", $sala, true, true);
$ca->bindValue(":usuario", $username, true, true);
if (!$ca->exec()) {
    echo json_encode("Error. " . $ca->lastErrorText());
    return false;
}
$d = "NONE";
if ($ca->size() > 0) {
    $d = $ca->assocAll();
}
echo json_encode($d);
//$ca->prepareSelect("usuarios a left join terminales b ON(a.terminal=b.id)", "a.id,a.usuario,a.nombre,a.apellido,a.terminal,b.clave as apikey, CONCAT(a.nombre, ' ', a.apellido) as nombre_apellido", "a.id=:id");
//$ca->bindValue(":id", $p["id"], true, true);
//if (!$ca->exec()) {
//    echo json_encode("Error. " . $ca->lastErrorText());
//    return false;
//}
//if ($ca->size() == 0) {
//    return false;
//}
//$ra = $ca->flush();
//$a = Array();
//$a["usuario"] = $ra["usuario"];
//$a["terminal"] = $ra["terminal"];
//$a["mode"] = $p["mode"];
//$r = nwMaker::consultaUsuariosConectados($a);
//$d = Array();
//$d["users"] = $r;
//$d["data_user"] = $ra;
//echo json_encode($d);
