<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function selectOb() {
    $p = $_POST;
    session::check();
    $db = NWDatabase::database();
    $cs = new NWDbQuery($db);
    $cs->prepareSelect("nwanimate_objetos", "pos_x, pos_y,pos_x_inicial,pos_y_inicial", "id=:id");
    $cs->bindValue(":id", $p["id"]);
    if (!$cs->exec()) {
        echo "Error:" . $cs->lastErrorText();
        return false;
    }
    $cs->next();
    return $cs->assoc();
}

$objectEnc = selectOb();
$p = $_POST;
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cc = new NWDbQuery($db);
$si = session::info();
$tabla = "nwanimate_objects_animation";
if (!isset($p["id"])) {
    echo "No hay objeto válido";
    return;
}
$cb->prepareDelete($tabla, "objeto=:objeto and activo='si'");
$cb->bindValue(":objeto", $p["id"]);
if (!$cb->exec()) {
    echo "Error:" . $cb->lastErrorText();
    return false;
}
$ca->prepareUpdate($tabla, "activo", "objeto=:objeto and activo='no' ");
$ca->bindValue(":objeto", $p["id"]);
$ca->bindValue(":activo", "si");
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return false;
}
$cc->prepareUpdate("nwanimate_objetos", "movimiento, reproducir, pos_x, pos_y, pos_x_final, pos_y_final", "id=:id");
$cc->bindValue(":id", $p["id"]);
$cc->bindValue(":movimiento", "si");
$cc->bindValue(":reproducir", $p["reproducir"]);
$cc->bindValue(":pos_x", $objectEnc["pos_x"]);
$cc->bindValue(":pos_y", $objectEnc["pos_y"]);
$cc->bindValue(":pos_x_final", $objectEnc["pos_x_inicial"]);
$cc->bindValue(":pos_y_final", $objectEnc["pos_y_inicial"]);
if (!$cc->exec()) {
    echo "Error:" . $cc->lastErrorText();
    return false;
}
?>