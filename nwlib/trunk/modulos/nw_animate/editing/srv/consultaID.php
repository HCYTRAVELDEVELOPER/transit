<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$id_next = "";
$ca->prepareSelect("man_objetos_id_seq", "nextval('man_objetos_id_seq') as id");
if (!$ca->exec()) {
    $db->rollback();
    echo "Error: " . $ca->lastErrorText();
    return;
}
if ($ca->size() != 0) {
    $ca->next();
    $ra_next = $ca->assoc();
    $id_next = $ra_next["id"] + 1;
}
echo $id_next;
?>