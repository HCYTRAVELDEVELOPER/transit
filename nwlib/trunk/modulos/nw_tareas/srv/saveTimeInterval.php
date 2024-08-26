<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareUpdate("tareas_diarias", "tiempo", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
$ca->bindValue(":tiempo", $_POST["tiempo"]);
if (!$ca->exec()) {
    echo "errores";
    return;
} else {
    echo "enviado correctamente";
}
?>