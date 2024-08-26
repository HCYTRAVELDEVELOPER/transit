<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$sql = "UPDATE sop_visitantes SET estado=:estado, fecha=:fecha WHERE id=:id";
$ca->bindValue(":id", $_POST["id"]);
$ca->bindValue(":estado", "DESCONECTADO");
$ca->bindValue(":fecha", date("Y-m-d H:i:s")); 
$ca->prepare($sql);
if (!$ca->exec()) { 
    echo "error"; 
    return;
} else {
    echo "Adiós!!!";
}
?>