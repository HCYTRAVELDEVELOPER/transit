<?php
$p = $_POST;
if (!isset($p["id"])) {
    return;
}
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareUpdate("sop_visitantes", "fecha_ultima_interaccion_cliente", "id=:id");
$ca->bindValue(":id", $p["id"], true, true);
$ca->bindValue(":fecha_ultima_interaccion_cliente", date("Y-m-d H:i:s"));
if (!$ca->exec()) {
    $a = Array();
    $a["error_text"] = $ca->lastErrorText();
    $a["program_name"] = "Ringow updateClient.php {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo "Error. " . $ca->lastErrorText();
    return;
}
//$ca->close();
echo "true";
return false;
