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
$fields = "texto,room_v2,fecha,usuario,leido,nombre_operador,foto_usuario,recibido";
if (isset($p["heUser"])) {
    $fields .= ",usuario_recibe";
}
$id = null;
if (isset($p["terminal"])) {
    $terminal = $p["terminal"];
    $fields .= ",terminal";
}
if (isset($p["visitante"])) {
    $id = $p["visitante"];
    $fields .= ",visitante";
}
$msg = $p["texto"];
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->setCleanHtml(false);
$ca->prepareInsert("sop_chat", $fields);
$ca->bindValue(":usuario", $p["myUser"]);
if (isset($p["heUser"])) {
    $ca->bindValue(":usuario_recibe", $p["heUser"]);
}
$ca->bindValue(":texto", $msg);
$ca->bindValue(":room_v2", $p["room"]);
$ca->bindValue(":fecha", $fecha);
$ca->bindValue(":visitante", $id);
$ca->bindValue(":terminal", $terminal);
$ca->bindValue(":leido", $p["visto"]);
$ca->bindValue(":nombre_operador", $p["myName"]);
$ca->bindValue(":foto_usuario", $p["myPhoto"]);
$ca->bindValue(":recibido", "NO");
if (!$ca->exec()) {
    $a = Array();
    $a["error_text"] = $ca->lastErrorText();
    $a["program_name"] = "Ringow saveMsgSrv.php {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo json_encode("Error line 59. " . $ca->lastErrorText());
    return false;
}
$fup = "last_message,date_last_message";
if ($p["isOperatorRingow"] === "false") {
    $fup .= ",fecha_ultima_interaccion_cliente";
} else {
    $fup .= ",fecha_ultima_interaccion_operador";
}
$nameCort = nwMaker::cortaText($p["myName"], 10);
$msgConNombre = strip_tags(nwMaker::cortaText($nameCort . ": " . $msg, 90));
$ca->prepareUpdate("sop_visitantes", $fup, "id=:id or room_v2=:room_v2");
$ca->bindValue(":id", $id);
$ca->bindValue(":room_v2", $p["room"], true, true);
$ca->bindValue(":last_message", $msgConNombre);
$ca->bindValue(":date_last_message", $fecha);
$ca->bindValue(":fecha_ultima_interaccion_cliente", $fecha);
$ca->bindValue(":fecha_ultima_interaccion_operador", $fecha);
if (!$ca->exec()) {
    $a = Array();
    $a["error_text"] = $ca->lastErrorText();
    $a["program_name"] = "Ringow saveMsgSrv.php {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo json_encode("Error line 79. " . $ca->lastErrorText());
    return false;
}
if (isset($p["createNotification"]) && $p["createNotification"] === "SI") {
    if ($p["isOperatorRingow"] === "false" && $p["useForRingow"] === "false") {
        if (isset($p["is_group"])) {
            $ca->prepareSelect("sop_visitantes", "userscallintern_d,nombre", "room_v2=:room_v2 and userscallintern_d!=:usuario");
            $ca->bindValue(":room_v2", $p["room"], true, true);
            $ca->bindValue(":usuario", $p["myUser"], true, true);
            if (!$ca->exec()) {
                $a = Array();
                $a["error_text"] = $ca->lastErrorText();
                $a["program_name"] = "Ringow saveMsgSrv.php {$_SERVER["HTTP_HOST"]}";
                nwMaker::sendError($a);
                echo json_encode("Error line 79. " . $ca->lastErrorText());
                return false;
            }
            $t = $ca->size();
            if ($t > 0) {
                $usuario_envia = $p["myName"];
                if (isset($p["heUser"])) {
                    $usuario_envia = $p["heUser"];
                }
                for ($i = 0; $i < $t; $i++) {
                    $ram = $ca->flush();
                    $a = Array();
                    $a["destinatario"] = $ram["userscallintern_d"];
                    $a["body"] = $msgConNombre;
                    $a["tipo"] = "chat";
                    $a["link"] = null;
                    $a["modo_window"] = "popup";
                    $a["tipoAviso"] = "alert";
                    $a["sendEmail"] = false;
                    $a["id_objetivo"] = nwMaker::cortaText($p["room"], 99);
                    $a["titleMensaje"] = "(Grupo {$ram["nombre"]}) " . nwMaker::cortaText("{$p["myName"]} ha enviado un mensaje", 69);
                    $a["foto"] = null;
                    $a["usuario_envia"] = $usuario_envia;
                    if (isset($p["useForRingow"]) && $p["useForRingow"] === "true") {
                        $a["callback"] = "iniciarCitaAgenda($id, true, true)";
                    } else {
                        $a["callback"] = "windowNwChat('{$p["room"]}', '{$ram["userscallintern_d"]}', '{$p["heUser"]}', '{$p["myName"]}', '{$p["myPhoto"]}', '', 'body', '&is_group=true')";
                    }
                    $n = nwMaker::notificacionNwMaker($a);
                    if ($n !== true) {
                        echo json_encode($n);
                        return false;
                    }
                }
            }
        } else
        if (isset($p["heUser"])) {
            $a = Array();
            $a["destinatario"] = $p["heUser"];
            $a["body"] = $msgConNombre;
            $a["tipo"] = "chat";
            $a["link"] = null;
            $a["modo_window"] = "popup";
            $a["tipoAviso"] = "alert";
            $a["sendEmail"] = false;
            $a["id_objetivo"] = nwMaker::cortaText($p["room"], 99);
            $a["titleMensaje"] = nwMaker::cortaText("{$p["myName"]} ha enviado un mensaje", 69);
            $a["foto"] = null;
            $a["usuario_envia"] = $p["myUser"];
            if (isset($p["useForRingow"]) && $p["useForRingow"] === "true") {
                $a["callback"] = "iniciarCitaAgenda($id, true, true)";
            } else {
                $a["callback"] = "windowNwChat('{$p["room"]}', '{$p["heUser"]}', '{$p["myUser"]}', '{$p["myName"]}', '{$p["myPhoto"]}', '', 'body')";
            }
            $n = nwMaker::notificacionNwMaker($a);
            if ($n !== true) {
                echo json_encode($n);
                return false;
            }
        }
    }
}
//
//$pu = Array();
//$pu["token"] = "f3oXOZdNCk0:APA91bEMq-R4T6To7viUIrFvP7Kn2u1S61XW-IZjtnvJ__fsM1GUqx1n-3d2levHXxZaMHQooZaBusxp2SnGpVHZcHQsn2KshAJNGRie1BcS3oKDg0yNt3TMhCiZYFpugLqWB8CYX2_w";
//$pu["body"] = "Hola";
//$pu["title"] = "Hola";
//$pu["icon"] = "";
//nwMaker::sendNotificacionPush($pu);
$rta = "true";
echo json_encode($rta);
