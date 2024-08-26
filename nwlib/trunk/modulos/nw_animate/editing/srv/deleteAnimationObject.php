<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}
$p = $_POST;
session::check();
$db = NWDatabase::database();
$cb = new NWDbQuery($db);
$si = session::info();
$cb->prepareDelete("nwanimate_objects_animation", "objeto=:id and empresa=:empresa");
$cb->bindValue(":id", $p["id"]);
$cb->bindValue(":empresa", $si["empresa"]);
if (!$cb->exec()) {
    echo "Error:" . $cb->lastErrorText();
    return false;
} else {
    echo "Eliminado correctamente";
    return true;
}
?>