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
$ca = new NWDbQuery($db);
$si = session::info();
$fields = "background, usuario";
if ($p["id"] != "false") {
    $ca->prepareUpdate("nwanimate_escenas", $fields, "id=:id");
    $ca->bindValue(":id", $p["id"]);
}
$ca->bindValue(":background", $p["background"]);
$ca->bindValue(":usuario", $si["usuario"]);
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return false;
}
?>