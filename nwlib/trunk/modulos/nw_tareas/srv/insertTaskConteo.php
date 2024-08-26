<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$ca->prepareUpdate("tareas_diarias", "tiempo,estado", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
$ca->bindValue(":tiempo", $_POST["tiempo"]);
$ca->bindValue(":estado", 11);
if (!$ca->exec()) {
    echo "errores";
    return;
}

$avance = "Inició actividad. Tiempo de inicio: " . $_POST["tiempo"];
$cb->prepareInsert("tareas_det", "tarea, observaciones, fecha, usuario, tipo");
$cb->bindValue(":fecha", date("Y-m-d H:i:s"));
$cb->bindValue(":usuario", $_SESSION["usuario"]);
$cb->bindValue(":tarea", $_POST["id"]);
$cb->bindValue(":observaciones", $avance);
$cb->bindValue(":tipo", "Avance");
if (!$cb->exec()) {
    echo "errores";
    return;
} 
?>