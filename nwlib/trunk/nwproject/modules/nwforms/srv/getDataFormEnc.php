<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nwforms_enc", "offline_tabla_consulta,offline_campos_tabla_consulta,url_consulta", " id=:id ");
$ca->bindValue(":id", $_POST["id"]);
if (!$ca->exec()) {
    return "Error. " . $ca->lastErrorText();
}
if ($ca->size() == 0) {
    return false;
}
print json_encode($ca->flush());
return true;
?>