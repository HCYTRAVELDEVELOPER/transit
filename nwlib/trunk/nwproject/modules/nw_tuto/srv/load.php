<?php
include $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$p = $_POST;
$ca->prepareSelect("nwtuto_objetos", "*, description as text", "id_enc=:tuto");
$ca->bindValue(":tuto", $p["tuto"]);
if (!$ca->exec()) {
    error_log($ca->lastErrorText());
    print_r($ca->lastErrorText());
    echo json_encode($ca->lastErrorText());
    return false;
}
if ($ca->size() == 0) {
    echo "false";
    return false;
}
$r = $ca->assocAll();
echo json_encode($r);
return;
