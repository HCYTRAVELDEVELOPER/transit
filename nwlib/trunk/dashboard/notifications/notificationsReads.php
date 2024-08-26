<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cc = new NWDbQuery($db);
$ca->prepareSelect("nw_notifications_det", "id,notificacion", "usuario=:usuario and leida=false order by fecha desc");
$ca->bindValue(":usuario", $_SESSION["usuario"]);
$ca->bindValue(":leida", false);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
$total = $ca->size();
if ($total == 0) {
    return;
}
for ($i = 0; $i < $total; $i++) {
    $ca->next();
    $r = $ca->assoc();
    $cb->prepareSelect("nw_notifications", "*", "id=:id");
    $cb->bindValue(":id", $r["notificacion"]);
    if (!$cb->exec()) {
        echo $cb->lastErrorText();
        return;
    }
    $cb->next();
    $ra = $cb->assoc();
    if ($ra["parte"] != "CHAT") {
        $cc->prepareUpdate("nw_notifications_det", "leida", "notificacion=:notificacion");
        $cc->bindValue(":notificacion", $ra["id"]);
        $cc->bindValue(":leida", true);
        if (!$cc->exec()) {
            echo "No se pudo actualizar la notificación:";
            return;
        }
    }
}
?>