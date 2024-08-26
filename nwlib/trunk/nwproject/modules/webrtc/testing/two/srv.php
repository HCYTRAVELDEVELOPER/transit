<?php

include $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$p = $_POST;
if ($p["type"] == "privado") {
    $tipo = "privado";
} else
if ($p["type"] == "publico") {
    $tipo = "publico";
} else {
    echo "false";
    return false;
}
$ca->prepareUpdate("nwmaker_videollamadas", "tipo", "id=:id");
$ca->bindValue(":id", $p["idCall"]);
$ca->bindValue(":tipo", $tipo);
if (!$ca->exec()) {
    error_log($ca->lastErrorText());
    return;
}
echo "OK";
return true;