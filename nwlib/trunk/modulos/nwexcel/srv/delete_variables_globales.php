<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareDelete("nwexcel_variables_globales", "hoja=:hoja");
$ca->bindValue(":hoja", $_POST["hoja"]);
if (!$ca->exec()) {
    echo "Error . " . $ca->lastErrorText();
    return;
}
?>