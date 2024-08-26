<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
session::check();
$db = NWDatabase::database();
$cb = new NWDbQuery($db);
$cb->prepareDelete("man_otros_objetos", "hoja=:hoja and man=:man");
$cb->bindValue(":hoja", $p["hoja"]);
$cb->bindValue(":man", $p["man"]);
if (!$cb->exec()) {
    echo "Error:" . $cb->lastErrorText();
    return false;
}