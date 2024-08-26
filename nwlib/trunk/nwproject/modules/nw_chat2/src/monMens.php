<?php

include $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";

function consulta() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $p = $_POST;
    $domain = $p["origin"];
    $id_sess = $p["id"] . $p["origin"];
    $id_session = nwchat::set_session_id($domain);
    $config = nwchat::getConfigChat($id_sess);
    if ($config["visitas_tiempo_real"] == "NO") {
        echo "NO_visitas_tiempo_real";
        return false;
    }
    $ca->prepareUpdate("sop_visitantes", "fecha_ultima_interaccion_cliente", "id_session=:id_session");
    $ca->bindValue(":id_session", $id_session);
    $ca->bindValue(":fecha_ultima_interaccion_cliente", date("Y-m-d H:i:s"));
    if (!$ca->exec()) {
        error_log($ca->lastErrorText());
        return false;
    }
    if ($p["showMensajePush"] == "SI") {
        $ca->prepareSelect("sop_chat", "texto", "id_session=:id_session and leido='1' and tipo_user='userInterNw' order by id desc limit 1");
        $ca->bindValue(":id_session", $id_session);
        if (!$ca->exec()) {
            error_log($ca->lastErrorText());
            return false;
        }
        if ($ca->size() > 0) {
            $ss = $ca->flush();
            $d = Array();
            $d["new_message"] = true;
            $d["texto"] = $ss["texto"];
            echo json_encode($d);
            return false;
        }

        echo "iniciado";
        return false;
    }
    $ca->prepareSelect("sop_visitantes", "id,atiende,mensaje_al_visitante,estado,mensaje_al_visitante_closed,tipo", "id_session=:id_session limit 1");
    $ca->bindValue(":id_session", $id_session);
    if (!$ca->exec()) {
        error_log($ca->lastErrorText());
        return false;
    }
    if ($ca->size() == 0) {
        echo "false";
        return false;
    }
    $r = $ca->flush();
    if ($r["estado"] != "LLAMANDO" && $r["estado"] != "EN LINEA") {
        if ($r["mensaje_al_visitante"] == null || $r["mensaje_al_visitante"] == "" || $r["mensaje_al_visitante_closed"] == "SI") {
            echo "nomessages";
            return false;
        }
    }
    $_SESSION[$id_sess]["init_call_user"] = true;

    $r["config"] = $config;
    echo json_encode($r);
    return;
}

consulta();
