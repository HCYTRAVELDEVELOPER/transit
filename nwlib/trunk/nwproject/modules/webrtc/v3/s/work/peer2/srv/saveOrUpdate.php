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
$terminal = null;
$id = null;
if (isset($p["terminal"])) {
    $terminal = $p["terminal"];
}
if (isset($p["id"])) {
    $id = $p["id"];
}
$useBot = false;
if (isset($p["useBot"]) && $p["useBot"] === "SI") {
    $useBot = true;
}
$rta = Array();
$tipo = $p["tipo"];
$id_session = session_id() . $p["domain"];
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("sop_visitantes", "id,estado", "id=:id or room_v2=:room_v2");
$ca->bindValue(":id", $id, true, true);
$ca->bindValue(":room_v2", $p["room"]);
if (!$ca->exec()) {
    $a["error_text"] = "Ringow saveOrUpdate.php ERROR:" . $ca->lastErrorText();
    $a["program_name"] = "Ringow saveOrUpdate.php {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo json_encode("Error. " . $ca->lastErrorText());
    return false;
}
$dataEnc = Array();
if ($useBot === false) {
    if ($ca->size() === 0) {
        $id = master::getNextSequence("sop_visitantes_id_seq", $db);
        $fieldsInsert = "room_v2,fecha,estado,tipo,url,host,terminal,userscallintern,userscallintern_d,id_session";
        if ($p["isOperatorRingow"] === "false" || $p["isOperatorRingow"] === false) {
            $fieldsInsert .= ",fecha_ultima_interaccion_cliente";
            $fup = "fecha_ultima_interaccion_cliente";
        } else {
            $fieldsInsert .= ",fecha_ultima_interaccion_operador";
            $fup = "fecha_ultima_interaccion_operador";
        }
        if (isset($p["id"])) {
            $fieldsInsert .= ",id";
        }
        $fieldsInsert .= ",id";
        $dataEnc["id"] = $id;
        $ca->prepareInsert("sop_visitantes", $fieldsInsert);
        $ca->bindValue(":id", $id, true, true);
        $ca->bindValue(":fecha_ultima_interaccion_cliente", $fecha);
        $ca->bindValue(":fecha_ultima_interaccion_operador", $fecha);
        $ca->bindValue(":room_v2", $p["room"], true, true);
        $ca->bindValue(":terminal", $terminal, true, true);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":tipo", $tipo);
        $ca->bindValue(":estado", "VISITANDO");
        $ca->bindValue(":url", nwMaker::cortaText($p["origin"], 199));
        $ca->bindValue(":host", nwMaker::cortaText($p["domain"], 199));
        $ca->bindValue(":userscallintern", nwMaker::cortaText($p["myUser"], 249));
        $ca->bindValue(":userscallintern_d", nwMaker::cortaText($p["heUser"], 249));
        $ca->bindValue(":id_session", $id_session);
        if (!$ca->exec()) {
            $a["error_text"] = "Ringow saveOrUpdate.php ERROR:" . $ca->lastErrorText();
            $a["program_name"] = "Ringow saveOrUpdate.php {$_SERVER["HTTP_HOST"]}";
            nwMaker::sendError($a);
            echo json_encode("Error. " . $ca->lastErrorText());
            return false;
        }
    } else {
        $dataEnc = $ca->flush();
    }
}
$ca->prepareSelect("sop_chat", "texto,nombre_operador as usuario,fecha,leido,recibido", "room_v2=:room_v2 or visitante=:id order by fecha desc limit :limit");
$ca->bindValue(":id", $id, true, true);
$ca->bindValue(":room_v2", $p["room"]);
$ca->bindValue(":limit", $p["limit"]);
if (!$ca->exec()) {
    $a["error_text"] = "Ringow saveOrUpdate.php ERROR:" . $ca->lastErrorText();
    $a["program_name"] = "Ringow saveOrUpdate.php {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo json_encode("Error. " . $ca->lastErrorText());
    return false;
}
$rta["dataEnc"] = $dataEnc;
if ($ca->size() > 0) {
    $rta["msg"] = $ca->assocAll();
}
if ($p["tipoDeUso"] === "ringow_need_config") {
    $ca->prepareSelect("sop_config", "registro_usar_documento,registro_usar_email,registro_usar_celular,registro_usar_nombre,bot_saludo,bot_nombre,bot_pedir_nombre,bot_pedir_celular,bot_pedir_correo,bot_esperando_agente", "terminal=:terminal order by id desc limit 1");
    $ca->bindValue(":terminal", $terminal, true, true);
    if (!$ca->exec()) {
        $a["error_text"] = "Ringow saveOrUpdate.php ERROR:" . $ca->lastErrorText();
        $a["program_name"] = "Ringow saveOrUpdate.php {$_SERVER["HTTP_HOST"]}";
        nwMaker::sendError($a);
        echo json_encode("Error. " . $ca->lastErrorText());
        return false;
    }
    if ($ca->size() > 0) {
        $rta["config"] = $ca->flush();
    }
}

if ($p["isOperatorRingow"] === "false" || $p["isOperatorRingow"] === false) {
    $ca->prepareSelect("nwmaker_suscriptorsPush", "json", "usuario=:usuario");
    $ca->bindValue(":usuario", $p["heUser"]);
    if (!$ca->exec()) {
        $a["error_text"] = "Ringow saveOrUpdate.php ERROR:" . $ca->lastErrorText();
        $a["program_name"] = "Ringow saveOrUpdate.php {$_SERVER["HTTP_HOST"]}";
        nwMaker::sendError($a);
        echo json_encode("Error. " . $ca->lastErrorText());
        return false;
    }
    if ($ca->size() > 0) {
        $rta["tokens"] = $ca->assocAll();
    }
}
echo json_encode($rta);
