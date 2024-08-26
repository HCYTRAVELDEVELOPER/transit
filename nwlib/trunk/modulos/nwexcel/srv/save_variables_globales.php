<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareInsert("nwexcel_variables_globales", "nombre, hoja");
$ca->bindValue(":hoja", $_POST["hoja"]);
$ca->bindValue(":nombre", $_POST["nombre"]);
if (!$ca->exec()) {
    echo "Error . " . $ca->lastErrorText();
    return;
}
?>