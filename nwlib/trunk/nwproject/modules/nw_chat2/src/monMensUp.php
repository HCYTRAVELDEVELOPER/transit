<?php

include $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";

function consulta() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $domain = $_POST["origin"];
    $id_session = nwchat::set_session_id($domain);
    $fields = "mensaje_al_visitante_visto";
    if (isset($_POST["click"])) {
        $fields .= ",mensaje_al_visitante_click";
    }
    if (isset($_POST["closed"])) {
        $fields .= ",mensaje_al_visitante_closed";
    }
    $ca->prepareUpdate("sop_visitantes", $fields, "id_session=:id_session");
    $ca->bindValue(":id_session", $id_session);
    $ca->bindValue(":mensaje_al_visitante_visto", "SI");
    $ca->bindValue(":mensaje_al_visitante_click", "SI");
    $ca->bindValue(":mensaje_al_visitante_closed", "SI");
    if (!$ca->exec()) {
        error_log($ca->lastErrorText());
        return;
    }
    echo "OK";
}

consulta();
