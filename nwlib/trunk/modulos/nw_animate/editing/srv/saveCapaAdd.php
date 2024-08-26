<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$ca->setCleanHtml(false);
$p = $_POST;
$ca->prepareUpdate("nwanimate_objetos", "capa", "id=:id");
$ca->bindValue(":id", $p["id"]);
$ca->bindValue(":capa", $p["capa"]);
if (!$ca->exec()) {
    $db->rollback();
    echo "Error: " . $ca->lastErrorText();
    return;
} else {
    echo "Realizado correctamente!";
    return true;
}
?>