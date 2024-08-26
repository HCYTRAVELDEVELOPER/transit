<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareUpdate("nwexcel_files", "acceso,permisos", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
$ca->bindValue(":acceso", $_POST["acceso"]);
$ca->bindValue(":permisos", $_POST["permisos"]);
if (!$ca->exec()) {
    echo "Error . " . $ca->lastErrorText();
    return;
} else {
    echo "Guardado correctamente";
}
?>