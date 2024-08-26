<?php
 require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
session::check();
$db = NWDatabase::database();
$cb = new NWDbQuery($db);
$cb->prepareDelete("nwanimate_objetos", "id=:id");
$cb->bindValue(":id", $p["id"]);
if (!$cb->exec()) {
    echo "Error:" . $cb->lastErrorText();
    return false;
}
?>