<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$t = $_POST["id_t"];
$ca->prepareInsert("sop_calificaciones", "id_visitante, fecha, terminal, calificacion, ip");
$ca->bindValue(":id_visitante", $_COOKIE["$t"]);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":terminal", $t);
$ca->bindValue(":ip", $_COOKIE["real_ip"], true);
$ca->bindValue(":calificacion", $_POST["calificacion"]);
if (!$ca->exec()) {
    echo "errores. " . $ca->lastErrorText();
    return;
} 
echo "Calificación enviada correctamente";
return true;
?>