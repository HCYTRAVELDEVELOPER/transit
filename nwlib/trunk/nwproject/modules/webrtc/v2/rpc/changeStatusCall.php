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
$fecha = date("Y-m-d H:i:s");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);

$rta = "OK";
$terminal = null;
$online = "online";
if (isset($p["terminal"])) {
    $terminal = $p["terminal"];
    $s = Array();
    $s["terminal"] = $terminal;
    if (nwchat2::operatorOnline($s) === 0) {
        $online = "offline";
    }
}
if ($online === "offline") {
    $p["estado"] = "LLAMADA_PERDIDA";
    $rta = Array();
    $rta["message"] = "No estamos disponibles.";
    $rta["type"] = "ASESORES_NO_DISPONIBLES";
}
$nombre = null;
if (isset($p["nombre"])) {
    $nombre = nwMaker::cortaText($p["nombre"], 170);
}
$correo = null;
if (isset($p["correo"])) {
    $correo = nwMaker::cortaText($p["correo"], 99);
}
$celular = null;
if (isset($p["celular"])) {
    $celular = nwMaker::cortaText($p["celular"], 14);
}

$ca->prepareSelect("sop_visitantes", "id,estado", "id=:id or room_v2=:room_v2");
$ca->bindValue(":id", $p["id"], true, true);
$ca->bindValue(":room_v2", $p["room"]);
if (!$ca->exec()) {
    echo json_encode("Error. " . $ca->lastErrorText());
    return false;
}
if ($ca->size() > 0) {
    $r = $ca->flush();
    if ($r["estado"] === "EN LINEA") {
        $p["estado"] = "EN LINEA";
        echo json_encode("true");
        return false;
    }
}
$f = "id,estado,tipo,fecha_inicio_llamada";
if ($p["isOperatorRingow"] === "false") {
    $f .= ",fecha_ultima_interaccion_cliente";
    if ($nombre !== null) {
        $f .= ",nombre";
    }
    if ($correo !== null) {
        $f .= ",correo";
    }
    if ($celular !== null) {
        $f .= ",celular";
    }
} else {
    $f .= ",fecha_ultima_interaccion_operador";
}
$ca->prepareUpdate("sop_visitantes", $f, "id=:id or room_v2=:room_v2");
$ca->bindValue(":id", $p["id"]);
$ca->bindValue(":room_v2", nwMaker::cortaText($p["room"], 80), true, true);
$ca->bindValue(":tipo", $p["tipo"]);
$ca->bindValue(":estado", nwMaker::cortaText($p["estado"], 49));
$ca->bindValue(":fecha_inicio_llamada", $fecha);
$ca->bindValue(":fecha_ultima_interaccion_cliente", $fecha);
$ca->bindValue(":fecha_ultima_interaccion_operador", $fecha);
$ca->bindValue(":nombre", $nombre);
$ca->bindValue(":correo", $correo);
$ca->bindValue(":celular", $celular);
if (!$ca->exec()) {
    echo json_encode("Error. " . $ca->lastErrorText());
    return false;
}
if (isset($p["terminal"]) && $p["isOperatorRingow"] === "false") {
    $rat = Array();
    $rat["terminal"] = $p["terminal"];
    $rat["nombre"] = $nombre;
    nwchat2::sendMsgPushApp($db, $rat);
}

echo json_encode($rta);
