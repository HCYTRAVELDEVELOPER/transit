<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareUpdate("nwexcel_files", "code_js", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
$ca->bindValue(":code_js", $_POST["code_js"]);
if (!$ca->exec()) {
    echo "Error . " . $ca->lastErrorText();
    return;
}
?>